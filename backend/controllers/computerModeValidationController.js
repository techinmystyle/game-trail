const Groq = require('groq-sdk');
const { generateChallenge } = require('../data/challengeGenerator');
const { tryWithFallback } = require('../config/computerModeApiKeys');

exports.validateComputerModeCode = async (req, res) => {
  const { userCode, challenge, language, timeMinutes, difficulty } = req.body;
  const testCases = challenge?.testCases || [];

  try {
    const prompt = `You are a code validator for a competitive coding game. Analyze the following ${language} code and determine if it meets the requirements.

Challenge: ${challenge.title}
Description: ${challenge.description}
Difficulty: ${difficulty}
Time Limit: ${timeMinutes} minutes
Test Cases: ${testCases.length}

Expected Output/Structure:
${challenge.expectedOutput}

Test Cases to Validate:
${testCases.map(tc => `${tc.id}. ${tc.description}`).join('\n')}

User's Code:
${userCode}

Respond in JSON format:
{
  "allTestsPassed": boolean,
  "testResults": [
    ${testCases.map(tc => `{ "id": ${tc.id}, "passed": boolean, "message": "explanation" }`).join(',\n    ')}
  ],
  "errors": [
    { "line": number, "message": "error description", "type": "syntax|logic|style" }
  ],
  "completionPercentage": number (0-100)
}`;

    // Use load balancer with automatic fallback across models and keys
    const result = await tryWithFallback('validation', async (apiKey, model) => {
      const groq = new Groq({ apiKey });
      
      const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: model,
        temperature: 0.3,
        max_tokens: 2000,
      });

      const responseText = completion.choices[0]?.message?.content || '{}';
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from AI');
      }

      return JSON.parse(jsonMatch[0]);
    });

    res.json({ success: true, validation: result });
  } catch (error) {
    console.error('Computer mode validation error:', error);
    
    // Return fallback validation if all attempts fail
    const fallbackValidation = {
      allTestsPassed: false,
      testResults: testCases.map(tc => ({ 
        id: tc.id, 
        passed: false, 
        message: 'Validation service temporarily unavailable. Please try again.' 
      })),
      errors: [{ 
        line: 1, 
        message: 'Unable to validate code at this time. All API keys exhausted.', 
        type: 'error' 
      }],
      completionPercentage: 0
    };
    
    res.json({ success: true, validation: fallbackValidation });
  }
};

// Get AI-generated challenge for game start
exports.getChallenge = async (req, res) => {
  try {
    const { language, difficulty, timeMinutes } = req.query;
    
    // Generate unique challenge using AI
    const challenge = await generateChallenge(language, difficulty, parseInt(timeMinutes));

    res.json({ 
      success: true, 
      challenge
    });
  } catch (error) {
    console.error('Get challenge error:', error);
    res.status(500).json({ message: 'Error generating challenge' });
  }
};
