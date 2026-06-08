export const htmlPhase8Levels = {
  "1": {
    "title": "Datalist for Autocomplete",
    "description": "Use <datalist> to provide autocomplete suggestions for input fields. This enhances user experience with predefined options.",
    "timeLimit": 420,
    "testCases": [
      {
        "id": 1,
        "description": "Create an input with list attribute"
      },
      {
        "id": 2,
        "description": "Create a <datalist> with matching id"
      },
      {
        "id": 3,
        "description": "Add at least 5 <option> elements in datalist"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Datalist Example</title>\n</head>\n<body>\n    <h1>Choose a Browser</h1>\n    <form>\n        <label for=\"browser\">Select your browser:</label>\n        <input list=\"browsers\" id=\"browser\" name=\"browser\">\n        <datalist id=\"browsers\">\n            <option value=\"Chrome\">\n            <option value=\"Firefox\">\n            <option value=\"Safari\">\n            <option value=\"Edge\">\n            <option value=\"Opera\">\n        </datalist>\n        <input type=\"submit\" value=\"Submit\">\n    </form>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Datalist Example</title>\n</head>\n<body>\n    <h1>Choose a Browser</h1>\n    <!-- Create form with datalist here -->\n</body>\n</html>"
  },
  "2": {
    "title": "Output Element",
    "description": "Use the <output> element to display calculation results. Perfect for showing computed values from form inputs.",
    "timeLimit": 420,
    "testCases": [
      {
        "id": 1,
        "description": "Create a form with number inputs"
      },
      {
        "id": 2,
        "description": "Add an <output> element with for attribute"
      },
      {
        "id": 3,
        "description": "Use oninput to calculate and display result"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Output Element</title>\n</head>\n<body>\n    <h1>Simple Calculator</h1>\n    <form oninput=\"result.value=parseInt(num1.value)+parseInt(num2.value)\">\n        <label>First Number: <input type=\"number\" id=\"num1\" value=\"0\"></label><br>\n        <label>Second Number: <input type=\"number\" id=\"num2\" value=\"0\"></label><br>\n        <label>Result: <output name=\"result\" for=\"num1 num2\">0</output></label>\n    </form>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Output Element</title>\n</head>\n<body>\n    <h1>Simple Calculator</h1>\n    <!-- Create form with output element -->\n</body>\n</html>"
  },
  "3": {
    "title": "Optgroup in Select",
    "description": "Use <optgroup> to group related options in a <select> dropdown. This improves organization in long dropdown lists.",
    "timeLimit": 420,
    "testCases": [
      {
        "id": 1,
        "description": "Create a <select> element"
      },
      {
        "id": 2,
        "description": "Add at least 2 <optgroup> elements with label attributes"
      },
      {
        "id": 3,
        "description": "Each optgroup must contain at least 3 <option> elements"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Optgroup Example</title>\n</head>\n<body>\n    <h1>Choose a Programming Language</h1>\n    <form>\n        <label for=\"language\">Select Language:</label>\n        <select id=\"language\" name=\"language\">\n            <optgroup label=\"Frontend\">\n                <option value=\"html\">HTML</option>\n                <option value=\"css\">CSS</option>\n                <option value=\"javascript\">JavaScript</option>\n            </optgroup>\n            <optgroup label=\"Backend\">\n                <option value=\"python\">Python</option>\n                <option value=\"java\">Java</option>\n                <option value=\"php\">PHP</option>\n            </optgroup>\n        </select>\n        <input type=\"submit\" value=\"Submit\">\n    </form>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Optgroup Example</title>\n</head>\n<body>\n    <h1>Choose a Programming Language</h1>\n    <!-- Create form with optgroup -->\n</body>\n</html>"
  },
  "4": {
    "title": "Range and Color Inputs",
    "description": "Use HTML5 input types: range for sliders and color for color pickers. These provide native UI controls.",
    "timeLimit": 600,
    "testCases": [
      {
        "id": 1,
        "description": "Create input type='range' with min, max, and value"
      },
      {
        "id": 2,
        "description": "Create input type='color' with default value"
      },
      {
        "id": 3,
        "description": "Add labels for each input"
      },
      {
        "id": 4,
        "description": "Display current values using oninput"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Range and Color</title>\n</head>\n<body>\n    <h1>Interactive Controls</h1>\n    <form>\n        <label>Volume: <input type=\"range\" id=\"volume\" min=\"0\" max=\"100\" value=\"50\" oninput=\"volumeValue.textContent=this.value\"></label>\n        <span id=\"volumeValue\">50</span><br><br>\n        \n        <label>Choose Color: <input type=\"color\" id=\"color\" value=\"#ff0000\"></label><br><br>\n        \n        <input type=\"submit\" value=\"Submit\">\n    </form>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Range and Color</title>\n</head>\n<body>\n    <h1>Interactive Controls</h1>\n    <!-- Create form with range and color inputs -->\n</body>\n</html>"
  },
  "5": {
    "title": "Search and Tel Inputs",
    "description": "Use input type='search' for search fields and type='tel' for phone numbers. These provide appropriate mobile keyboards.",
    "timeLimit": 600,
    "testCases": [
      {
        "id": 1,
        "description": "Create input type='search' with placeholder"
      },
      {
        "id": 2,
        "description": "Create input type='tel' with pattern validation"
      },
      {
        "id": 3,
        "description": "Add labels for each input"
      },
      {
        "id": 4,
        "description": "Include form structure with submit button"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Search and Tel</title>\n</head>\n<body>\n    <h1>Contact Form</h1>\n    <form>\n        <label>Search: <input type=\"search\" name=\"search\" placeholder=\"Search our site...\"></label><br><br>\n        \n        <label>Phone: <input type=\"tel\" name=\"phone\" pattern=\"[0-9]{3}-[0-9]{3}-[0-9]{4}\" placeholder=\"123-456-7890\"></label><br><br>\n        \n        <input type=\"submit\" value=\"Submit\">\n    </form>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Search and Tel</title>\n</head>\n<body>\n    <h1>Contact Form</h1>\n    <!-- Create form with search and tel inputs -->\n</body>\n</html>"
  },
  "6": {
    "title": "URL and Email Validation",
    "description": "Use input type='url' and type='email' for automatic validation. Browsers will check format before submission.",
    "timeLimit": 600,
    "testCases": [
      {
        "id": 1,
        "description": "Create input type='email' with required attribute"
      },
      {
        "id": 2,
        "description": "Create input type='url' with required attribute"
      },
      {
        "id": 3,
        "description": "Add placeholder text for each input"
      },
      {
        "id": 4,
        "description": "Include form structure with submit button"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>URL and Email Validation</title>\n</head>\n<body>\n    <h1>Contact Information</h1>\n    <form>\n        <label>Email: <input type=\"email\" name=\"email\" required placeholder=\"your@email.com\"></label><br><br>\n        \n        <label>Website: <input type=\"url\" name=\"website\" required placeholder=\"https://example.com\"></label><br><br>\n        \n        <input type=\"submit\" value=\"Submit\">\n    </form>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>URL and Email Validation</title>\n</head>\n<body>\n    <h1>Contact Information</h1>\n    <!-- Create form with url and email inputs -->\n</body>\n</html>"
  },
  "7": {
    "title": "Date and Time Inputs",
    "description": "Use HTML5 date/time input types: date, time, datetime-local, month, and week. These provide native date pickers.",
    "timeLimit": 600,
    "testCases": [
      {
        "id": 1,
        "description": "Create input type='date'"
      },
      {
        "id": 2,
        "description": "Create input type='time'"
      },
      {
        "id": 3,
        "description": "Create input type='datetime-local'"
      },
      {
        "id": 4,
        "description": "Add labels for each input"
      },
      {
        "id": 5,
        "description": "Include form structure with submit button"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Date and Time Inputs</title>\n</head>\n<body>\n    <h1>Event Scheduler</h1>\n    <form>\n        <label>Event Date: <input type=\"date\" name=\"eventDate\"></label><br><br>\n        \n        <label>Event Time: <input type=\"time\" name=\"eventTime\"></label><br><br>\n        \n        <label>Full DateTime: <input type=\"datetime-local\" name=\"fullDateTime\"></label><br><br>\n        \n        <input type=\"submit\" value=\"Schedule Event\">\n    </form>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Date and Time Inputs</title>\n</head>\n<body>\n    <h1>Event Scheduler</h1>\n    <!-- Create form with date and time inputs -->\n</body>\n</html>"
  },
  "8": {
    "title": "Form Autocomplete Attribute",
    "description": "Use the autocomplete attribute to control browser autofill behavior. This improves user experience and security.",
    "timeLimit": 750,
    "testCases": [
      {
        "id": 1,
        "description": "Set form autocomplete='on'"
      },
      {
        "id": 2,
        "description": "Use autocomplete='name' for name field"
      },
      {
        "id": 3,
        "description": "Use autocomplete='email' for email field"
      },
      {
        "id": 4,
        "description": "Use autocomplete='off' for sensitive field"
      },
      {
        "id": 5,
        "description": "Include complete form structure"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Autocomplete Form</title>\n</head>\n<body>\n    <h1>Registration Form</h1>\n    <form autocomplete=\"on\">\n        <label>Full Name: <input type=\"text\" name=\"name\" autocomplete=\"name\"></label><br><br>\n        \n        <label>Email: <input type=\"email\" name=\"email\" autocomplete=\"email\"></label><br><br>\n        \n        <label>Credit Card: <input type=\"text\" name=\"cc\" autocomplete=\"off\"></label><br><br>\n        \n        <input type=\"submit\" value=\"Register\">\n    </form>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Autocomplete Form</title>\n</head>\n<body>\n    <h1>Registration Form</h1>\n    <!-- Create form with autocomplete attributes -->\n</body>\n</html>"
  },
  "9": {
    "title": "Form Novalidate and Formnovalidate",
    "description": "Use novalidate on forms and formnovalidate on buttons to bypass HTML5 validation when needed.",
    "timeLimit": 750,
    "testCases": [
      {
        "id": 1,
        "description": "Create a form with required fields"
      },
      {
        "id": 2,
        "description": "Add a normal submit button"
      },
      {
        "id": 3,
        "description": "Add a submit button with formnovalidate"
      },
      {
        "id": 4,
        "description": "Include email and number inputs with validation"
      },
      {
        "id": 5,
        "description": "Add proper labels"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Form Validation Control</title>\n</head>\n<body>\n    <h1>User Form</h1>\n    <form>\n        <label>Email: <input type=\"email\" name=\"email\" required></label><br><br>\n        \n        <label>Age: <input type=\"number\" name=\"age\" min=\"18\" required></label><br><br>\n        \n        <input type=\"submit\" value=\"Submit with Validation\">\n        <input type=\"submit\" formnovalidate value=\"Save Draft (No Validation)\">\n    </form>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Form Validation Control</title>\n</head>\n<body>\n    <h1>User Form</h1>\n    <!-- Create form with validation control -->\n</body>\n</html>"
  },
  "10": {
    "title": "Advanced Form with All Input Types",
    "description": "Create a comprehensive form using all HTML5 input types and attributes. This demonstrates mastery of HTML forms.",
    "timeLimit": 750,
    "testCases": [
      {
        "id": 1,
        "description": "Include at least 8 different input types"
      },
      {
        "id": 2,
        "description": "Use validation attributes (required, pattern, min, max)"
      },
      {
        "id": 3,
        "description": "Include datalist, optgroup, and fieldset"
      },
      {
        "id": 4,
        "description": "Add autocomplete attributes"
      },
      {
        "id": 5,
        "description": "Include submit and reset buttons"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Advanced Form</title>\n</head>\n<body>\n    <h1>Complete Registration</h1>\n    <form autocomplete=\"on\">\n        <fieldset>\n            <legend>Personal Information</legend>\n            <label>Name: <input type=\"text\" name=\"name\" required autocomplete=\"name\"></label><br>\n            <label>Email: <input type=\"email\" name=\"email\" required autocomplete=\"email\"></label><br>\n            <label>Phone: <input type=\"tel\" name=\"phone\" pattern=\"[0-9]{3}-[0-9]{3}-[0-9]{4}\"></label><br>\n            <label>Birth Date: <input type=\"date\" name=\"birthdate\"></label><br>\n            <label>Age: <input type=\"number\" name=\"age\" min=\"18\" max=\"100\"></label>\n        </fieldset>\n        <fieldset>\n            <legend>Preferences</legend>\n            <label>Favorite Color: <input type=\"color\" name=\"color\"></label><br>\n            <label>Volume: <input type=\"range\" name=\"volume\" min=\"0\" max=\"100\" value=\"50\"></label><br>\n            <label>Country: \n                <select name=\"country\">\n                    <optgroup label=\"North America\">\n                        <option value=\"usa\">USA</option>\n                        <option value=\"canada\">Canada</option>\n                    </optgroup>\n                    <optgroup label=\"Europe\">\n                        <option value=\"uk\">UK</option>\n                        <option value=\"germany\">Germany</option>\n                    </optgroup>\n                </select>\n            </label><br>\n            <label>Search: <input type=\"search\" name=\"search\" list=\"searches\"></label>\n            <datalist id=\"searches\">\n                <option value=\"HTML\">\n                <option value=\"CSS\">\n                <option value=\"JavaScript\">\n            </datalist>\n        </fieldset>\n        <input type=\"submit\" value=\"Register\">\n        <input type=\"reset\" value=\"Clear Form\">\n    </form>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Advanced Form</title>\n</head>\n<body>\n    <h1>Complete Registration</h1>\n    <!-- Create comprehensive form with all input types -->\n</body>\n</html>"
  }
};
