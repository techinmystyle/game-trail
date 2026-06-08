export const htmlPhase3Levels = {
  "1": {
    "title": "Nested Lists",
    "description": "Create a nested list structure where list items contain other lists. This is useful for creating hierarchical menus or outlines.",
    "timeLimit": 180,
    "testCases": [
      {
        "id": 1,
        "description": "Create a main unordered list with at least 3 items"
      },
      {
        "id": 2,
        "description": "Nest a sub-list inside one of the main list items"
      },
      {
        "id": 3,
        "description": "Ensure proper indentation and structure"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Nested Lists</title>\n</head>\n<body>\n    <h1>Course Outline</h1>\n    <ul>\n        <li>HTML Basics\n            <ul>\n                <li>Tags</li>\n                <li>Attributes</li>\n            </ul>\n        </li>\n        <li>CSS Styling</li>\n        <li>JavaScript</li>\n    </ul>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Nested Lists</title>\n</head>\n<body>\n    <h1>Course Outline</h1>\n    <!-- Create your nested list here -->\n</body>\n</html>"
  },
  "2": {
    "title": "Description Lists",
    "description": "Create a description list using <dl>, <dt>, and <dd> tags. Description lists are perfect for glossaries, FAQs, and term definitions.",
    "timeLimit": 180,
    "testCases": [
      {
        "id": 1,
        "description": "Use <dl> tag to create description list"
      },
      {
        "id": 2,
        "description": "Add at least 3 terms using <dt> tags"
      },
      {
        "id": 3,
        "description": "Add descriptions using <dd> tags for each term"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Glossary</title>\n</head>\n<body>\n    <h1>Web Development Terms</h1>\n    <dl>\n        <dt>HTML</dt>\n        <dd>HyperText Markup Language</dd>\n        <dt>CSS</dt>\n        <dd>Cascading Style Sheets</dd>\n        <dt>JavaScript</dt>\n        <dd>Programming language for web</dd>\n    </dl>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Glossary</title>\n</head>\n<body>\n    <h1>Web Development Terms</h1>\n    <!-- Create your description list here -->\n</body>\n</html>"
  },
  "3": {
    "title": "Table with Headers",
    "description": "Create a table with proper header row using <thead>, body using <tbody>, and footer using <tfoot>. This creates well-structured, semantic tables.",
    "timeLimit": 180,
    "testCases": [
      {
        "id": 1,
        "description": "Use <thead> for header row with <th> cells"
      },
      {
        "id": 2,
        "description": "Use <tbody> for data rows with <td> cells"
      },
      {
        "id": 3,
        "description": "Add at least 3 data rows"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Product Table</title>\n</head>\n<body>\n    <h1>Product Inventory</h1>\n    <table border=\"1\">\n        <thead>\n            <tr>\n                <th>Product</th>\n                <th>Price</th>\n                <th>Stock</th>\n            </tr>\n        </thead>\n        <tbody>\n            <tr>\n                <td>Laptop</td>\n                <td>$999</td>\n                <td>15</td>\n            </tr>\n            <tr>\n                <td>Mouse</td>\n                <td>$25</td>\n                <td>50</td>\n            </tr>\n            <tr>\n                <td>Keyboard</td>\n                <td>$75</td>\n                <td>30</td>\n            </tr>\n        </tbody>\n    </table>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Product Table</title>\n</head>\n<body>\n    <h1>Product Inventory</h1>\n    <!-- Create your table with thead and tbody here -->\n</body>\n</html>"
  },
  "4": {
    "title": "Table with Colspan",
    "description": "Use the colspan attribute to make table cells span multiple columns. This is useful for creating complex table layouts.",
    "timeLimit": 300,
    "testCases": [
      {
        "id": 1,
        "description": "Create a table with at least 3 columns"
      },
      {
        "id": 2,
        "description": "Use colspan attribute to span 2 or more columns"
      },
      {
        "id": 3,
        "description": "Include proper thead and tbody"
      },
      {
        "id": 4,
        "description": "Add at least 3 data rows"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Schedule Table</title>\n</head>\n<body>\n    <h1>Weekly Schedule</h1>\n    <table border=\"1\">\n        <thead>\n            <tr>\n                <th>Day</th>\n                <th>Morning</th>\n                <th>Afternoon</th>\n            </tr>\n        </thead>\n        <tbody>\n            <tr>\n                <td>Monday</td>\n                <td>Math</td>\n                <td>Science</td>\n            </tr>\n            <tr>\n                <td>Tuesday</td>\n                <td colspan=\"2\">Field Trip</td>\n            </tr>\n            <tr>\n                <td>Wednesday</td>\n                <td>English</td>\n                <td>History</td>\n            </tr>\n        </tbody>\n    </table>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Schedule Table</title>\n</head>\n<body>\n    <h1>Weekly Schedule</h1>\n    <!-- Create your table with colspan here -->\n</body>\n</html>"
  },
  "5": {
    "title": "Table with Rowspan",
    "description": "Use the rowspan attribute to make table cells span multiple rows. Combine with colspan for complex table structures.",
    "timeLimit": 300,
    "testCases": [
      {
        "id": 1,
        "description": "Create a table with at least 3 rows"
      },
      {
        "id": 2,
        "description": "Use rowspan attribute to span 2 or more rows"
      },
      {
        "id": 3,
        "description": "Include proper table structure"
      },
      {
        "id": 4,
        "description": "Add descriptive content"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Employee Table</title>\n</head>\n<body>\n    <h1>Department Staff</h1>\n    <table border=\"1\">\n        <thead>\n            <tr>\n                <th>Department</th>\n                <th>Name</th>\n                <th>Role</th>\n            </tr>\n        </thead>\n        <tbody>\n            <tr>\n                <td rowspan=\"2\">Engineering</td>\n                <td>Alice</td>\n                <td>Developer</td>\n            </tr>\n            <tr>\n                <td>Bob</td>\n                <td>Designer</td>\n            </tr>\n            <tr>\n                <td>Marketing</td>\n                <td>Carol</td>\n                <td>Manager</td>\n            </tr>\n        </tbody>\n    </table>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Employee Table</title>\n</head>\n<body>\n    <h1>Department Staff</h1>\n    <!-- Create your table with rowspan here -->\n</body>\n</html>"
  },
  "6": {
    "title": "Div and Span Elements",
    "description": "Learn the difference between <div> (block-level) and <span> (inline) elements. Use them to group and style content.",
    "timeLimit": 300,
    "testCases": [
      {
        "id": 1,
        "description": "Create at least 2 <div> elements with class attributes"
      },
      {
        "id": 2,
        "description": "Use <span> elements inside paragraphs"
      },
      {
        "id": 3,
        "description": "Add descriptive content"
      },
      {
        "id": 4,
        "description": "Include proper HTML structure"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Div and Span</title>\n</head>\n<body>\n    <div class=\"header\">\n        <h1>Welcome</h1>\n    </div>\n    <div class=\"content\">\n        <p>This is <span class=\"highlight\">important</span> text.</p>\n        <p>Learn about <span class=\"highlight\">HTML</span> elements.</p>\n    </div>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Div and Span</title>\n</head>\n<body>\n    <!-- Create divs and spans here -->\n</body>\n</html>"
  },
  "7": {
    "title": "HTML Comments",
    "description": "Use HTML comments to add notes in your code. Comments are not displayed in the browser but help document your code.",
    "timeLimit": 300,
    "testCases": [
      {
        "id": 1,
        "description": "Add at least 3 HTML comments using <!-- -->"
      },
      {
        "id": 2,
        "description": "Include comments explaining different sections"
      },
      {
        "id": 3,
        "description": "Add actual HTML content between comments"
      },
      {
        "id": 4,
        "description": "Include proper HTML structure"
      },
      {
        "id": 5,
        "description": "Add at least 5 HTML comments using <!-- -->"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>HTML Comments</title>\n</head>\n<body>\n    <!-- Header Section -->\n    <h1>My Website</h1>\n    \n    <!-- Navigation Menu -->\n    <nav>\n        <a href=\"home.html\">Home</a>\n        <a href=\"about.html\">About</a>\n    </nav>\n    \n    <!-- Main Content Area -->\n    <p>Welcome to my website!</p>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>HTML Comments</title>\n</head>\n<body>\n    <!-- Add your commented sections here -->\n</body>\n</html>"
  },
  "8": {
    "title": "HTML Entities",
    "description": "Use HTML entities to display special characters like <, >, &, copyright symbol, and more. Entities start with & and end with ;",
    "timeLimit": 420,
    "testCases": [
      {
        "id": 1,
        "description": "Use &lt; and &gt; to display < and >"
      },
      {
        "id": 2,
        "description": "Use &copy; for copyright symbol"
      },
      {
        "id": 3,
        "description": "Use &nbsp; for non-breaking space"
      },
      {
        "id": 4,
        "description": "Use &amp; to display &"
      },
      {
        "id": 5,
        "description": "Include proper HTML structure"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>HTML Entities</title>\n</head>\n<body>\n    <h1>Special Characters</h1>\n    <p>Use &lt;div&gt; tags for containers.</p>\n    <p>Copyright &copy; 2024</p>\n    <p>Use&nbsp;&nbsp;&nbsp;non-breaking spaces.</p>\n    <p>The &amp; symbol is called ampersand.</p>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>HTML Entities</title>\n</head>\n<body>\n    <h1>Special Characters</h1>\n    <!-- Add paragraphs with HTML entities here -->\n</body>\n</html>"
  },
  "9": {
    "title": "Abbreviations and Acronyms",
    "description": "Use <abbr> tag with title attribute to define abbreviations and acronyms. The title shows on hover.",
    "timeLimit": 420,
    "testCases": [
      {
        "id": 1,
        "description": "Use <abbr> tag with title attribute"
      },
      {
        "id": 2,
        "description": "Add at least 3 different abbreviations"
      },
      {
        "id": 3,
        "description": "Include descriptive title attributes"
      },
      {
        "id": 4,
        "description": "Wrap in proper paragraph structure"
      },
      {
        "id": 5,
        "description": "Include proper HTML structure"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Abbreviations</title>\n</head>\n<body>\n    <h1>Web Technologies</h1>\n    <p>Learn <abbr title=\"HyperText Markup Language\">HTML</abbr> for structure.</p>\n    <p>Use <abbr title=\"Cascading Style Sheets\">CSS</abbr> for styling.</p>\n    <p>Add interactivity with <abbr title=\"JavaScript\">JS</abbr>.</p>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Abbreviations</title>\n</head>\n<body>\n    <h1>Web Technologies</h1>\n    <!-- Add paragraphs with abbreviations here -->\n</body>\n</html>"
  },
  "10": {
    "title": "Address and Contact Info",
    "description": "Use the <address> tag to mark up contact information. This semantic tag indicates author or owner contact details.",
    "timeLimit": 420,
    "testCases": [
      {
        "id": 1,
        "description": "Use <address> tag for contact information"
      },
      {
        "id": 2,
        "description": "Include name, email, and physical address"
      },
      {
        "id": 3,
        "description": "Use <br> tags for line breaks"
      },
      {
        "id": 4,
        "description": "Add mailto: link for email"
      },
      {
        "id": 5,
        "description": "Include proper HTML structure"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Contact Information</title>\n</head>\n<body>\n    <h1>About Us</h1>\n    <address>\n        Written by John Doe<br>\n        Email: <a href=\"mailto:john@example.com\">john@example.com</a><br>\n        123 Main Street<br>\n        New York, NY 10001\n    </address>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Contact Information</title>\n</head>\n<body>\n    <h1>About Us</h1>\n    <!-- Add address element with contact info here -->\n</body>\n</html>"
  }
};
