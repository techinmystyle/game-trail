const Groq = require('groq-sdk');
const { tryWithFallback } = require('../config/apiKeys');

/**
 * Validate HTML code using Groq AI with automatic fallback
 */
exports.validateHTMLCode = async (req, res) => {
  try {
    const { 
      userCode, 
      levelTitle, 
      levelDescription, 
      testCases,
      expectedOutput 
    } = req.body;

    // Validate input
    if (!userCode || !levelTitle || !testCases) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields: userCode, levelTitle, testCases' 
      });
    }

    console.log(`[HTML Validation] Level: ${levelTitle}, User: ${req.user?.id || 'anonymous'}`);

    // Use fallback system to try all models and keys
    const result = await tryWithFallback('html', async (apiKey, model) => {
      const groq = new Groq({ apiKey });

      const prompt = `You are an expert HTML validator. Analyze the user's HTML code and validate it against the requirements.

**Level:** ${levelTitle}
**Description:** ${levelDescription}

**Test Cases to Validate:**
${testCases.map((tc, i) => `${i + 1}. ${tc.description}`).join('\n')}

**User's Code:**
\`\`\`html
${userCode}
\`\`\`

**Your Task:**
1. Check if the code meets each test case requirement
2. Find syntax errors, missing tags, incorrect content
3. Respect different coding styles - focus on OUTPUT, not exact code structure
4. Be flexible with formatting, spacing, and attribute order

**Respond in this EXACT JSON format:**
{
  "testResults": [
    { "id": 1, "passed": true/false, "message": "explanation" },
    { "id": 2, "passed": true/false, "message": "explanation" },
    { "id": 3, "passed": true/false, "message": "explanation" }
  ],
  "errors": [
    { "line": 5, "message": "error description", "type": "SyntaxError/MissingTag/StructureError" }
  ],
  "allTestsPassed": true/false,
  "summary": "brief summary of validation"
}`;

      const response = await groq.chat.completions.create({
        model: model,
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert HTML validator. Always respond with valid JSON only, no markdown or extra text.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1, // Low temperature for consistent validation
        max_tokens: 1500,
      });

      const content = response.choices[0]?.message?.content;
      
      // Parse JSON response
      let validationResult;
      try {
        // Remove markdown code blocks if present
        const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        validationResult = JSON.parse(cleanContent);
      } catch (parseError) {
        console.error('Failed to parse AI response:', content);
        throw new Error('AI returned invalid JSON format');
      }

      return validationResult;
    });

    // Return validation result
    res.json({
      success: true,
      validation: result
    });

  } catch (error) {
    console.error('HTML Validation Error:', error.message);
    
    // Check if all models/keys exhausted
    if (error.message.includes('exhausted')) {
      return res.status(503).json({
        success: false,
        message: 'Validation service temporarily unavailable. Please try again in a moment.',
        error: 'RATE_LIMIT_EXCEEDED'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error validating code',
      error: error.message
    });
  }
};

/**
 * Validate CSS code using Groq AI with automatic fallback
 */
exports.validateCSSCode = async (req, res) => {
  try {
    const { 
      userCSS, 
      htmlCode,
      levelTitle, 
      levelDescription, 
      testCases,
      expectedOutput 
    } = req.body;

    // Validate input
    if (!userCSS || !levelTitle || !testCases) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields: userCSS, levelTitle, testCases' 
      });
    }

    console.log(`[CSS Validation] Level: ${levelTitle}, User: ${req.user?.id || 'anonymous'}`);

    // Use fallback system to try all models and keys
    const result = await tryWithFallback('css', async (apiKey, model) => {
      const groq = new Groq({ apiKey });

      const prompt = `You are an expert CSS validator. Analyze the user's CSS code and validate it against the requirements.

**Level:** ${levelTitle}
**Description:** ${levelDescription}

**HTML Code (Read-only):**
\`\`\`html
${htmlCode}
\`\`\`

**Test Cases to Validate:**
${testCases.map((tc, i) => `${i + 1}. ${tc.description}`).join('\n')}

**User's CSS Code:**
\`\`\`css
${userCSS}
\`\`\`

**Your Task:**
1. Check if the CSS code meets each test case requirement
2. Find syntax errors, missing selectors, incorrect properties
3. Verify that selectors target the correct HTML elements
4. Be flexible with property order and formatting
5. Focus on whether the styling achieves the desired visual result

**Respond in this EXACT JSON format:**
{
  "testResults": [
    { "id": 1, "passed": true/false, "message": "explanation" },
    { "id": 2, "passed": true/false, "message": "explanation" },
    { "id": 3, "passed": true/false, "message": "explanation" }
  ],
  "errors": [
    { "message": "error description", "type": "SyntaxError/MissingSelector/InvalidProperty" }
  ],
  "allTestsPassed": true/false,
  "summary": "brief summary of validation"
}`;

      const response = await groq.chat.completions.create({
        model: model,
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert CSS validator. Always respond with valid JSON only, no markdown or extra text.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 1500,
      });

      const content = response.choices[0]?.message?.content;
      
      // Parse JSON response
      let validationResult;
      try {
        const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        validationResult = JSON.parse(cleanContent);
      } catch (parseError) {
        console.error('Failed to parse AI response:', content);
        throw new Error('AI returned invalid JSON format');
      }

      return validationResult;
    });

    res.json({
      success: true,
      validation: result
    });

  } catch (error) {
    console.error('CSS Validation Error:', error.message);
    
    if (error.message.includes('exhausted')) {
      return res.status(503).json({
        success: false,
        message: 'Validation service temporarily unavailable. Please try again in a moment.',
        error: 'RATE_LIMIT_EXCEEDED'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error validating CSS code',
      error: error.message
    });
  }
};

/**
 * Validate JavaScript code using Groq AI with automatic fallback
 */
exports.validateJSCode = async (req, res) => {
  try {
    const { 
      userCode, 
      levelTitle, 
      levelDescription, 
      testCases,
      expectedOutput 
    } = req.body;

    // Validate input
    if (!userCode || !levelTitle || !testCases) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields: userCode, levelTitle, testCases' 
      });
    }

    console.log(`[JS Validation] Level: ${levelTitle}, User: ${req.user?.id || 'anonymous'}`);

    // Use fallback system to try all models and keys
    const result = await tryWithFallback('javascript', async (apiKey, model) => {
      const groq = new Groq({ apiKey });

      const prompt = `You are an expert JavaScript validator. Analyze the user's JavaScript code and validate it against the requirements.

**Level:** ${levelTitle}
**Description:** ${levelDescription}

**Test Cases to Validate:**
${testCases.map((tc, i) => `${i + 1}. ${tc.description}`).join('\n')}

**Expected Output:**
\`\`\`javascript
${expectedOutput}
\`\`\`

**User's Code:**
\`\`\`javascript
${userCode}
\`\`\`

**Your Task:**
1. Check if the code meets each test case requirement
2. Find syntax errors, missing variables, incorrect logic
3. Verify that the code produces the expected output
4. Be flexible with coding style - focus on FUNCTIONALITY, not exact code structure
5. Accept different variable names, approaches, and formatting as long as they meet requirements

**Respond in this EXACT JSON format:**
{
  "testResults": [
    { "id": 1, "passed": true/false, "message": "explanation" },
    { "id": 2, "passed": true/false, "message": "explanation" },
    { "id": 3, "passed": true/false, "message": "explanation" }
  ],
  "errors": [
    { "message": "error description", "type": "SyntaxError/LogicError/MissingVariable" }
  ],
  "allTestsPassed": true/false,
  "summary": "brief summary of validation"
}`;

      const response = await groq.chat.completions.create({
        model: model,
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert JavaScript validator. Always respond with valid JSON only, no markdown or extra text.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 1500,
      });

      const content = response.choices[0]?.message?.content;
      
      // Parse JSON response
      let validationResult;
      try {
        const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        validationResult = JSON.parse(cleanContent);
      } catch (parseError) {
        console.error('Failed to parse AI response:', content);
        throw new Error('AI returned invalid JSON format');
      }

      return validationResult;
    });

    res.json({
      success: true,
      validation: result
    });

  } catch (error) {
    console.error('JS Validation Error:', error.message);
    
    if (error.message.includes('exhausted')) {
      return res.status(503).json({
        success: false,
        message: 'Validation service temporarily unavailable. Please try again in a moment.',
        error: 'RATE_LIMIT_EXCEEDED'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error validating JavaScript code',
      error: error.message
    });
  }
};

/**
 * Validate Python code using Groq AI with automatic fallback
 */
exports.validatePythonCode = async (req, res) => {
  try {
    const { 
      userCode, 
      levelTitle, 
      levelDescription, 
      testCases,
      expectedOutput 
    } = req.body;

    // Validate input
    if (!userCode || !levelTitle || !testCases) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields: userCode, levelTitle, testCases' 
      });
    }

    console.log(`[Python Validation] Level: ${levelTitle}, User: ${req.user?.id || 'anonymous'}`);

    // Use fallback system to try all models and keys
    const result = await tryWithFallback('python', async (apiKey, model) => {
      const groq = new Groq({ apiKey });

      const prompt = `You are an expert Python validator. Analyze the user's Python code and validate it against the requirements.

**Level:** ${levelTitle}
**Description:** ${levelDescription}

**Test Cases to Validate:**
${testCases.map((tc, i) => `${i + 1}. ${tc.description}`).join('\n')}

**Expected Output:**
\`\`\`
${expectedOutput}
\`\`\`

**User's Code:**
\`\`\`python
${userCode}
\`\`\`

**Your Task:**
1. Check if the code meets each test case requirement
2. Find syntax errors, indentation issues, missing functions
3. Verify that the code produces the expected output
4. Be flexible with coding style - focus on FUNCTIONALITY
5. Accept different variable names and approaches as long as they meet requirements

**Respond in this EXACT JSON format:**
{
  "testResults": [
    { "id": 1, "passed": true/false, "message": "explanation" },
    { "id": 2, "passed": true/false, "message": "explanation" }
  ],
  "errors": [
    { "message": "error description", "type": "SyntaxError/IndentationError/LogicError" }
  ],
  "allTestsPassed": true/false,
  "summary": "brief summary of validation"
}`;

      const response = await groq.chat.completions.create({
        model: model,
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert Python validator. Always respond with valid JSON only, no markdown or extra text.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 1500,
      });

      const content = response.choices[0]?.message?.content;
      
      // Parse JSON response
      let validationResult;
      try {
        const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        validationResult = JSON.parse(cleanContent);
      } catch (parseError) {
        console.error('Failed to parse AI response:', content);
        throw new Error('AI returned invalid JSON format');
      }

      return validationResult;
    });

    res.json({
      success: true,
      validation: result
    });

  } catch (error) {
    console.error('Python Validation Error:', error.message);
    
    if (error.message.includes('exhausted')) {
      return res.status(503).json({
        success: false,
        message: 'Validation service temporarily unavailable. Please try again in a moment.',
        error: 'RATE_LIMIT_EXCEEDED'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error validating Python code',
      error: error.message
    });
  }
};

/**
 * Validate Java code using Groq AI with automatic fallback
 */
exports.validateJavaCode = async (req, res) => {
  try {
    const { 
      userCode, 
      levelTitle, 
      levelDescription, 
      testCases,
      expectedOutput 
    } = req.body;

    // Validate input
    if (!userCode || !levelTitle || !testCases) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required fields: userCode, levelTitle, testCases' 
      });
    }

    console.log(`[Java Validation] Level: ${levelTitle}, User: ${req.user?.id || 'anonymous'}`);

    // Use fallback system to try all models and keys
    const result = await tryWithFallback('java', async (apiKey, model) => {
      const groq = new Groq({ apiKey });

      const prompt = `You are an expert Java validator. Analyze the user's Java code and validate it against the requirements.

**Level:** ${levelTitle}
**Description:** ${levelDescription}

**Test Cases to Validate:**
${testCases.map((tc, i) => `${i + 1}. ${tc.description}`).join('\n')}

**Expected Output:**
\`\`\`
${expectedOutput}
\`\`\`

**User's Code:**
\`\`\`java
${userCode}
\`\`\`

**Your Task:**
1. Check if the code meets each test case requirement
2. Find syntax errors, missing semicolons, incorrect class structure
3. Verify that the code produces the expected output
4. Be flexible with coding style - focus on FUNCTIONALITY
5. Accept different variable names and approaches as long as they meet requirements

**Respond in this EXACT JSON format:**
{
  "testResults": [
    { "id": 1, "passed": true/false, "message": "explanation" },
    { "id": 2, "passed": true/false, "message": "explanation" }
  ],
  "errors": [
    { "message": "error description", "type": "SyntaxError/CompilationError/LogicError" }
  ],
  "allTestsPassed": true/false,
  "summary": "brief summary of validation"
}`;

      const response = await groq.chat.completions.create({
        model: model,
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert Java validator. Always respond with valid JSON only, no markdown or extra text.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 1500,
      });

      const content = response.choices[0]?.message?.content;
      
      // Parse JSON response
      let validationResult;
      try {
        const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        validationResult = JSON.parse(cleanContent);
      } catch (parseError) {
        console.error('Failed to parse AI response:', content);
        throw new Error('AI returned invalid JSON format');
      }

      return validationResult;
    });

    res.json({
      success: true,
      validation: result
    });

  } catch (error) {
    console.error('Java Validation Error:', error.message);
    
    if (error.message.includes('exhausted')) {
      return res.status(503).json({
        success: false,
        message: 'Validation service temporarily unavailable. Please try again in a moment.',
        error: 'RATE_LIMIT_EXCEEDED'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error validating Java code',
      error: error.message
    });
  }
};
