export const htmlPhase1Levels = {
  "1": {
    "title": "First HTML Document",
    "description": "Create your very first HTML document with the correct basic structure. Every webpage must start with a DOCTYPE declaration, followed by html, head, and body tags.",
    "timeLimit": 180,
    "testCases": [
      {
        "id": 1,
        "description": "Add <!DOCTYPE html> declaration at the top"
      },
      {
        "id": 2,
        "description": "Create <html>, <head>, and <body> tags"
      },
      {
        "id": 3,
        "description": "Add <title>My First Page</title> inside <head>"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>My First Page</title>\n</head>\n<body>\n</body>\n</html>",
    "starterCode": "<!-- Write your HTML code here -->\n"
  },
  "2": {
    "title": "Hello World",
    "description": "Display a heading and paragraph on your webpage. Use the <h1> tag for the main heading and <p> tag for a paragraph below it.",
    "timeLimit": 180,
    "testCases": [
      {
        "id": 1,
        "description": "Add <h1>Hello World</h1> inside the body"
      },
      {
        "id": 2,
        "description": "Add <p>This is my first webpage</p> below the heading"
      },
      {
        "id": 3,
        "description": "Ensure proper <!DOCTYPE html> structure"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Hello World</title>\n</head>\n<body>\n    <h1>Hello World</h1>\n    <p>This is my first webpage</p>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Hello World</title>\n</head>\n<body>\n    <!-- Add your heading and paragraph here -->\n</body>\n</html>"
  },
  "3": {
    "title": "HTML Links & Images",
    "description": "Add a clickable hyperlink and an image to your webpage. Use <a href='...'>text</a> for links and <img src='...' alt='...'> for images.",
    "timeLimit": 180,
    "testCases": [
      {
        "id": 1,
        "description": "Add a hyperlink: <a href='https://example.com'>Visit Example</a>"
      },
      {
        "id": 2,
        "description": "Add an image tag with src and alt attributes"
      },
      {
        "id": 3,
        "description": "Wrap everything in proper HTML structure with DOCTYPE"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Links and Images</title>\n</head>\n<body>\n    <h1>My Links and Images</h1>\n    <a href=\"https://example.com\">Visit Example</a>\n    <img src=\"photo.jpg\" alt=\"A photo\">\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Links and Images</title>\n</head>\n<body>\n    <h1>My Links and Images</h1>\n    <!-- Add your link and image here -->\n</body>\n</html>"
  },
  "4": {
    "title": "HTML Lists",
    "description": "Create both an ordered list (numbered) and an unordered list (bullet points). Use <ol> for ordered and <ul> for unordered, with <li> items inside.",
    "timeLimit": 300,
    "testCases": [
      {
        "id": 1,
        "description": "Create an unordered <ul> list with at least 3 <li> items"
      },
      {
        "id": 2,
        "description": "Create an ordered <ol> list with at least 3 <li> items"
      },
      {
        "id": 3,
        "description": "Add headings above each list"
      },
      {
        "id": 4,
        "description": "Create an unordered <ul> list with at least 4 <li> items"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>HTML Lists</title>\n</head>\n<body>\n    <h1>My Favorite Foods</h1>\n    <ul>\n        <li>Pizza</li>\n        <li>Burger</li>\n        <li>Pasta</li>\n    </ul>\n    <h2>Steps to Cook</h2>\n    <ol>\n        <li>Prepare ingredients</li>\n        <li>Cook on medium heat</li>\n        <li>Serve hot</li>\n    </ol>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>HTML Lists</title>\n</head>\n<body>\n    <h1>My Favorite Foods</h1>\n    <!-- Add your unordered list here -->\n    <h2>Steps to Cook</h2>\n    <!-- Add your ordered list here -->\n</body>\n</html>"
  },
  "5": {
    "title": "HTML Table",
    "description": "Build a basic HTML table to display student scores. Use <table>, <tr> for rows, <th> for headers, and <td> for data cells.",
    "timeLimit": 300,
    "testCases": [
      {
        "id": 1,
        "description": "Create a <table> with a header row using <th> tags"
      },
      {
        "id": 2,
        "description": "Add at least 3 data rows using <tr> and <td>"
      },
      {
        "id": 3,
        "description": "Include columns: Name, Subject, and Score"
      },
      {
        "id": 4,
        "description": "Create a <table> with a header row using <th> tags"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Student Scores</title>\n</head>\n<body>\n    <h1>Student Scores</h1>\n    <table border=\"1\">\n        <tr>\n            <th>Name</th>\n            <th>Subject</th>\n            <th>Score</th>\n        </tr>\n        <tr>\n            <td>Alice</td>\n            <td>Math</td>\n            <td>95</td>\n        </tr>\n        <tr>\n            <td>Bob</td>\n            <td>Science</td>\n            <td>88</td>\n        </tr>\n        <tr>\n            <td>Carol</td>\n            <td>English</td>\n            <td>91</td>\n        </tr>\n    </table>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Student Scores</title>\n</head>\n<body>\n    <h1>Student Scores</h1>\n    <!-- Build your table here -->\n</body>\n</html>"
  },
  "6": {
    "title": "HTML Div Blocks",
    "description": "Create a webpage structure using div blocks. Create a header div and a content div inside the body.",
    "starterCode": "<!DOCTYPE html>\n<html>\n<body>\n    <!-- Create your div blocks here -->\n</body>\n</html>",
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head><title>Div blocks</title></head>\n<body>\n    <div class=\"header\">Header content</div>\n    <div class=\"main\">Main content</div>\n</body>\n</html>",
    "testCases": [
      {
        "id": 1,
        "description": "Add a div with class 'header' inside body"
      },
      {
        "id": 2,
        "description": "Add a div with class 'main' inside body"
      },
      {
        "id": 3,
        "description": "Add some text inside both div elements"
      }
    ],
    "timeLimit": 300
  },
  "7": {
    "title": "HTML Span Containers",
    "description": "Use the span inline container to highlight specific words. Create a paragraph and wrap the word 'essential' inside a span tag with color styling.",
    "starterCode": "<!DOCTYPE html>\n<html>\n<body>\n    <p>Coding is ... to learn.</p>\n</body>\n</html>",
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<body>\n    <p>Coding is <span style=\"color: red; font-weight: bold;\">essential</span> to learn.</p>\n</body>\n</html>",
    "testCases": [
      {
        "id": 1,
        "description": "Create a paragraph <p> with text"
      },
      {
        "id": 2,
        "description": "Use <span> element inside paragraph"
      },
      {
        "id": 3,
        "description": "Add inline style to make span text red and bold"
      }
    ],
    "timeLimit": 300
  },
  "8": {
    "title": "HTML Line Breaks & Horizontal Rules",
    "description": "Organize text layout using line breaks <br> and horizontal rules <hr>.",
    "starterCode": "<!DOCTYPE html>\n<html>\n<body>\n    <!-- Add address lines and dividers -->\n</body>\n</html>",
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<body>\n    <p>Google Inc.<br>1600 Amphitheatre Pkwy<br>Mountain View, CA</p>\n    <hr>\n    <p>End of Address</p>\n</body>\n</html>",
    "testCases": [
      {
        "id": 1,
        "description": "Add a paragraph with three lines separated by <br>"
      },
      {
        "id": 2,
        "description": "Add a horizontal rule <hr> below the paragraph"
      },
      {
        "id": 3,
        "description": "Add a second paragraph below the divider"
      }
    ],
    "timeLimit": 420
  },
  "9": {
    "title": "HTML Strong and Emphasis",
    "description": "Format text using strong emphasis <strong> and italic emphasis <em> tags.",
    "starterCode": "<!DOCTYPE html>\n<html>\n<body>\n    <!-- Format the text below -->\n    <p>This is important and this is italic.</p>\n</body>\n</html>",
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<body>\n    <p>This is <strong>important</strong> and this is <em>italic</em>.</p>\n</body>\n</html>",
    "testCases": [
      {
        "id": 1,
        "description": "Wrap 'important' inside a <strong> tag"
      },
      {
        "id": 2,
        "description": "Wrap 'italic' inside an <em> tag"
      },
      {
        "id": 3,
        "description": "Ensure proper HTML structure"
      }
    ],
    "timeLimit": 420
  },
  "10": {
    "title": "HTML Forms Basics",
    "description": "Create a basic HTML form containing a label, a text input for username, and a submit button.",
    "starterCode": "<!DOCTYPE html>\n<html>\n<body>\n    <!-- Create a username form -->\n</body>\n</html>",
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<body>\n    <form>\n        <label for=\"user\">Username:</label>\n        <input type=\"text\" id=\"user\" name=\"username\">\n        <button type=\"submit\">Submit</button>\n    </form>\n</body>\n</html>",
    "testCases": [
      {
        "id": 1,
        "description": "Create a <form> container element"
      },
      {
        "id": 2,
        "description": "Add a <label> with a for='user' attribute"
      },
      {
        "id": 3,
        "description": "Add a text <input> with id='user'"
      },
      {
        "id": 4,
        "description": "Add a submit <button>"
      }
    ],
    "timeLimit": 420
  }
};
