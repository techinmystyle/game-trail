export const htmlPhase4Levels = {
  "1": {
    "title": "Basic Form Structure",
    "description": "Create a basic HTML form with a form tag, input fields, and a submit button. Forms are used to collect user input.",
    "timeLimit": 330,
    "testCases": [
      {
        "id": 1,
        "description": "Create a <form> element with action and method attributes"
      },
      {
        "id": 2,
        "description": "Add at least 2 text input fields with name attributes"
      },
      {
        "id": 3,
        "description": "Add a submit button using <input type='submit'>"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Basic Form</title>\n</head>\n<body>\n    <h1>Contact Form</h1>\n    <form action=\"/submit\" method=\"post\">\n        <label for=\"name\">Name:</label>\n        <input type=\"text\" id=\"name\" name=\"name\"><br><br>\n        <label for=\"email\">Email:</label>\n        <input type=\"text\" id=\"email\" name=\"email\"><br><br>\n        <input type=\"submit\" value=\"Submit\">\n    </form>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Basic Form</title>\n</head>\n<body>\n    <h1>Contact Form</h1>\n    <!-- Create your form here -->\n</body>\n</html>"
  },
  "2": {
    "title": "Input Types",
    "description": "Explore different HTML5 input types: text, email, password, number, and date. Each type provides specific validation and UI.",
    "timeLimit": 330,
    "testCases": [
      {
        "id": 1,
        "description": "Use input type='email' for email field"
      },
      {
        "id": 2,
        "description": "Use input type='password' for password field"
      },
      {
        "id": 3,
        "description": "Use input type='number' for age field"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Input Types</title>\n</head>\n<body>\n    <h1>Registration Form</h1>\n    <form>\n        <label>Email: <input type=\"email\" name=\"email\"></label><br><br>\n        <label>Password: <input type=\"password\" name=\"password\"></label><br><br>\n        <label>Age: <input type=\"number\" name=\"age\"></label><br><br>\n        <label>Birth Date: <input type=\"date\" name=\"birthdate\"></label><br><br>\n        <input type=\"submit\" value=\"Register\">\n    </form>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Input Types</title>\n</head>\n<body>\n    <h1>Registration Form</h1>\n    <!-- Create form with different input types -->\n</body>\n</html>"
  },
  "3": {
    "title": "Radio Buttons",
    "description": "Create radio buttons for single-choice selections. Radio buttons with the same name attribute form a group where only one can be selected.",
    "timeLimit": 330,
    "testCases": [
      {
        "id": 1,
        "description": "Create at least 3 radio buttons with the same name"
      },
      {
        "id": 2,
        "description": "Each radio button must have a unique value attribute"
      },
      {
        "id": 3,
        "description": "Use <label> tags for each option"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Radio Buttons</title>\n</head>\n<body>\n    <h1>Choose Your Favorite Color</h1>\n    <form>\n        <input type=\"radio\" id=\"red\" name=\"color\" value=\"red\">\n        <label for=\"red\">Red</label><br>\n        <input type=\"radio\" id=\"blue\" name=\"color\" value=\"blue\">\n        <label for=\"blue\">Blue</label><br>\n        <input type=\"radio\" id=\"green\" name=\"color\" value=\"green\">\n        <label for=\"green\">Green</label><br><br>\n        <input type=\"submit\" value=\"Submit\">\n    </form>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Radio Buttons</title>\n</head>\n<body>\n    <h1>Choose Your Favorite Color</h1>\n    <!-- Create radio button form here -->\n</body>\n</html>"
  },
  "4": {
    "title": "Checkboxes",
    "description": "Create checkboxes for multiple-choice selections. Unlike radio buttons, users can select multiple checkboxes.",
    "timeLimit": 420,
    "testCases": [
      {
        "id": 1,
        "description": "Create at least 3 checkboxes with different names"
      },
      {
        "id": 2,
        "description": "Each checkbox must have a value attribute"
      },
      {
        "id": 3,
        "description": "Use <label> tags for each checkbox"
      },
      {
        "id": 4,
        "description": "Include a submit button"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Checkboxes</title>\n</head>\n<body>\n    <h1>Select Your Hobbies</h1>\n    <form>\n        <input type=\"checkbox\" id=\"reading\" name=\"reading\" value=\"reading\">\n        <label for=\"reading\">Reading</label><br>\n        <input type=\"checkbox\" id=\"sports\" name=\"sports\" value=\"sports\">\n        <label for=\"sports\">Sports</label><br>\n        <input type=\"checkbox\" id=\"music\" name=\"music\" value=\"music\">\n        <label for=\"music\">Music</label><br><br>\n        <input type=\"submit\" value=\"Submit\">\n    </form>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Checkboxes</title>\n</head>\n<body>\n    <h1>Select Your Hobbies</h1>\n    <!-- Create checkbox form here -->\n</body>\n</html>"
  },
  "5": {
    "title": "Textarea Element",
    "description": "Use the <textarea> element for multi-line text input. Perfect for comments, messages, or longer text entries.",
    "timeLimit": 420,
    "testCases": [
      {
        "id": 1,
        "description": "Create a <textarea> element with name attribute"
      },
      {
        "id": 2,
        "description": "Set rows and cols attributes"
      },
      {
        "id": 3,
        "description": "Add a label for the textarea"
      },
      {
        "id": 4,
        "description": "Include form structure with submit button"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Textarea</title>\n</head>\n<body>\n    <h1>Feedback Form</h1>\n    <form>\n        <label for=\"feedback\">Your Feedback:</label><br>\n        <textarea id=\"feedback\" name=\"feedback\" rows=\"5\" cols=\"40\"></textarea><br><br>\n        <input type=\"submit\" value=\"Submit Feedback\">\n    </form>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Textarea</title>\n</head>\n<body>\n    <h1>Feedback Form</h1>\n    <!-- Create form with textarea here -->\n</body>\n</html>"
  },
  "6": {
    "title": "Select Dropdown",
    "description": "Create a dropdown menu using <select> and <option> tags. Dropdowns save space and provide a clean way to offer multiple choices.",
    "timeLimit": 420,
    "testCases": [
      {
        "id": 1,
        "description": "Create a <select> element with name attribute"
      },
      {
        "id": 2,
        "description": "Add at least 4 <option> elements"
      },
      {
        "id": 3,
        "description": "Each option must have a value attribute"
      },
      {
        "id": 4,
        "description": "Add a label and submit button"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Select Dropdown</title>\n</head>\n<body>\n    <h1>Choose Your Country</h1>\n    <form>\n        <label for=\"country\">Country:</label>\n        <select id=\"country\" name=\"country\">\n            <option value=\"usa\">United States</option>\n            <option value=\"uk\">United Kingdom</option>\n            <option value=\"canada\">Canada</option>\n            <option value=\"australia\">Australia</option>\n        </select><br><br>\n        <input type=\"submit\" value=\"Submit\">\n    </form>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Select Dropdown</title>\n</head>\n<body>\n    <h1>Choose Your Country</h1>\n    <!-- Create form with select dropdown here -->\n</body>\n</html>"
  },
  "7": {
    "title": "Form Validation Attributes",
    "description": "Use HTML5 validation attributes like required, minlength, maxlength, and pattern to validate form input without JavaScript.",
    "timeLimit": 420,
    "testCases": [
      {
        "id": 1,
        "description": "Add required attribute to at least 2 inputs"
      },
      {
        "id": 2,
        "description": "Use minlength and maxlength on a text input"
      },
      {
        "id": 3,
        "description": "Use min and max on a number input"
      },
      {
        "id": 4,
        "description": "Include placeholder attributes"
      },
      {
        "id": 5,
        "description": "Add a submit button"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Form Validation</title>\n</head>\n<body>\n    <h1>Sign Up Form</h1>\n    <form>\n        <label>Username: <input type=\"text\" name=\"username\" required minlength=\"3\" maxlength=\"15\" placeholder=\"3-15 characters\"></label><br><br>\n        <label>Email: <input type=\"email\" name=\"email\" required placeholder=\"your@email.com\"></label><br><br>\n        <label>Age: <input type=\"number\" name=\"age\" min=\"18\" max=\"100\" required></label><br><br>\n        <input type=\"submit\" value=\"Sign Up\">\n    </form>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Form Validation</title>\n</head>\n<body>\n    <h1>Sign Up Form</h1>\n    <!-- Create form with validation attributes -->\n</body>\n</html>"
  },
  "8": {
    "title": "Fieldset and Legend",
    "description": "Group related form elements using <fieldset> and add a caption with <legend>. This improves form organization and accessibility.",
    "timeLimit": 540,
    "testCases": [
      {
        "id": 1,
        "description": "Create at least 2 <fieldset> elements"
      },
      {
        "id": 2,
        "description": "Each fieldset must have a <legend>"
      },
      {
        "id": 3,
        "description": "Include form inputs inside fieldsets"
      },
      {
        "id": 4,
        "description": "Add a submit button"
      },
      {
        "id": 5,
        "description": "Include proper form structure"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Fieldset Form</title>\n</head>\n<body>\n    <h1>User Profile</h1>\n    <form>\n        <fieldset>\n            <legend>Personal Information</legend>\n            <label>Name: <input type=\"text\" name=\"name\"></label><br>\n            <label>Email: <input type=\"email\" name=\"email\"></label>\n        </fieldset>\n        <fieldset>\n            <legend>Address</legend>\n            <label>City: <input type=\"text\" name=\"city\"></label><br>\n            <label>Zip: <input type=\"text\" name=\"zip\"></label>\n        </fieldset>\n        <input type=\"submit\" value=\"Save Profile\">\n    </form>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Fieldset Form</title>\n</head>\n<body>\n    <h1>User Profile</h1>\n    <!-- Create form with fieldsets here -->\n</body>\n</html>"
  },
  "9": {
    "title": "File Upload Input",
    "description": "Create a file upload form using input type='file'. Add the accept attribute to specify allowed file types.",
    "timeLimit": 540,
    "testCases": [
      {
        "id": 1,
        "description": "Create input with type='file'"
      },
      {
        "id": 2,
        "description": "Add accept attribute for specific file types"
      },
      {
        "id": 3,
        "description": "Set form enctype='multipart/form-data'"
      },
      {
        "id": 4,
        "description": "Add a label and submit button"
      },
      {
        "id": 5,
        "description": "Include proper form structure"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>File Upload</title>\n</head>\n<body>\n    <h1>Upload Your Photo</h1>\n    <form action=\"/upload\" method=\"post\" enctype=\"multipart/form-data\">\n        <label for=\"photo\">Choose a photo:</label>\n        <input type=\"file\" id=\"photo\" name=\"photo\" accept=\"image/*\"><br><br>\n        <label for=\"document\">Choose a document:</label>\n        <input type=\"file\" id=\"document\" name=\"document\" accept=\".pdf,.doc,.docx\"><br><br>\n        <input type=\"submit\" value=\"Upload Files\">\n    </form>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>File Upload</title>\n</head>\n<body>\n    <h1>Upload Your Photo</h1>\n    <!-- Create file upload form here -->\n</body>\n</html>"
  },
  "10": {
    "title": "Complete Registration Form",
    "description": "Build a comprehensive registration form combining multiple input types, validation, and proper structure. This is a real-world form example.",
    "timeLimit": 540,
    "testCases": [
      {
        "id": 1,
        "description": "Include text, email, password, radio, and checkbox inputs"
      },
      {
        "id": 2,
        "description": "Use fieldset to group related fields"
      },
      {
        "id": 3,
        "description": "Add validation attributes (required, minlength)"
      },
      {
        "id": 4,
        "description": "Include a select dropdown"
      },
      {
        "id": 5,
        "description": "Add submit and reset buttons"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Complete Registration</title>\n</head>\n<body>\n    <h1>Create Account</h1>\n    <form>\n        <fieldset>\n            <legend>Account Details</legend>\n            <label>Username: <input type=\"text\" name=\"username\" required minlength=\"3\"></label><br>\n            <label>Email: <input type=\"email\" name=\"email\" required></label><br>\n            <label>Password: <input type=\"password\" name=\"password\" required minlength=\"8\"></label>\n        </fieldset>\n        <fieldset>\n            <legend>Personal Info</legend>\n            <label>Gender:</label>\n            <input type=\"radio\" name=\"gender\" value=\"male\"> Male\n            <input type=\"radio\" name=\"gender\" value=\"female\"> Female<br>\n            <label>Country: \n                <select name=\"country\">\n                    <option value=\"usa\">USA</option>\n                    <option value=\"uk\">UK</option>\n                </select>\n            </label><br>\n            <input type=\"checkbox\" name=\"terms\" required> I agree to terms\n        </fieldset>\n        <input type=\"submit\" value=\"Register\">\n        <input type=\"reset\" value=\"Clear\">\n    </form>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Complete Registration</title>\n</head>\n<body>\n    <h1>Create Account</h1>\n    <!-- Create comprehensive registration form here -->\n</body>\n</html>"
  }
};
