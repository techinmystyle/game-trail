export const htmlPhase6Levels = {
  "1": {
    "title": "Header and Footer Elements",
    "description": "Use semantic <header> and <footer> elements to define page sections. These improve structure and accessibility.",
    "timeLimit": 330,
    "testCases": [
      {
        "id": 1,
        "description": "Create a <header> element with site title and navigation"
      },
      {
        "id": 2,
        "description": "Create a <footer> element with copyright info"
      },
      {
        "id": 3,
        "description": "Add main content between header and footer"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Semantic Layout</title>\n</head>\n<body>\n    <header>\n        <h1>My Website</h1>\n        <nav>\n            <a href=\"#home\">Home</a>\n            <a href=\"#about\">About</a>\n            <a href=\"#contact\">Contact</a>\n        </nav>\n    </header>\n    <main>\n        <p>Welcome to my website!</p>\n    </main>\n    <footer>\n        <p>&copy; 2024 My Website. All rights reserved.</p>\n    </footer>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Semantic Layout</title>\n</head>\n<body>\n    <!-- Add header, main, and footer elements -->\n</body>\n</html>"
  },
  "2": {
    "title": "Nav Element",
    "description": "Use the <nav> element to define navigation sections. This semantic tag helps screen readers and search engines identify navigation.",
    "timeLimit": 330,
    "testCases": [
      {
        "id": 1,
        "description": "Create a <nav> element with multiple links"
      },
      {
        "id": 2,
        "description": "Create a second nav for footer navigation"
      },
      {
        "id": 3,
        "description": "Use unordered lists inside nav elements"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Navigation</title>\n</head>\n<body>\n    <header>\n        <nav>\n            <ul>\n                <li><a href=\"#home\">Home</a></li>\n                <li><a href=\"#services\">Services</a></li>\n                <li><a href=\"#portfolio\">Portfolio</a></li>\n                <li><a href=\"#contact\">Contact</a></li>\n            </ul>\n        </nav>\n    </header>\n    <footer>\n        <nav>\n            <a href=\"#privacy\">Privacy</a> | \n            <a href=\"#terms\">Terms</a> | \n            <a href=\"#sitemap\">Sitemap</a>\n        </nav>\n    </footer>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Navigation</title>\n</head>\n<body>\n    <!-- Add header and footer with nav elements -->\n</body>\n</html>"
  },
  "3": {
    "title": "Main and Aside Elements",
    "description": "Use <main> for primary content and <aside> for sidebar content. These semantic elements improve document structure.",
    "timeLimit": 330,
    "testCases": [
      {
        "id": 1,
        "description": "Create a <main> element with article content"
      },
      {
        "id": 2,
        "description": "Create an <aside> element with related info"
      },
      {
        "id": 3,
        "description": "Add headings and paragraphs in both sections"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Main and Aside</title>\n</head>\n<body>\n    <main>\n        <h1>Main Article</h1>\n        <p>This is the primary content of the page.</p>\n        <p>It contains the main information users are looking for.</p>\n    </main>\n    <aside>\n        <h2>Related Links</h2>\n        <ul>\n            <li><a href=\"#link1\">Related Article 1</a></li>\n            <li><a href=\"#link2\">Related Article 2</a></li>\n        </ul>\n    </aside>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Main and Aside</title>\n</head>\n<body>\n    <!-- Add main and aside elements -->\n</body>\n</html>"
  },
  "4": {
    "title": "Article and Section Elements",
    "description": "Use <article> for self-contained content and <section> to group related content. These create logical document structure.",
    "timeLimit": 420,
    "testCases": [
      {
        "id": 1,
        "description": "Create an <article> element with heading and content"
      },
      {
        "id": 2,
        "description": "Add multiple <section> elements inside the article"
      },
      {
        "id": 3,
        "description": "Each section must have a heading"
      },
      {
        "id": 4,
        "description": "Include proper HTML structure"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Blog Post</title>\n</head>\n<body>\n    <article>\n        <h1>Understanding HTML5</h1>\n        <section>\n            <h2>Introduction</h2>\n            <p>HTML5 is the latest version of HTML.</p>\n        </section>\n        <section>\n            <h2>New Features</h2>\n            <p>HTML5 introduces semantic elements and multimedia support.</p>\n        </section>\n        <section>\n            <h2>Conclusion</h2>\n            <p>HTML5 makes web development more powerful and accessible.</p>\n        </section>\n    </article>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Blog Post</title>\n</head>\n<body>\n    <!-- Add article with sections -->\n</body>\n</html>"
  },
  "5": {
    "title": "Mark and Highlight Text",
    "description": "Use <mark> to highlight text and combine with other formatting tags. Learn when to use mark vs other emphasis tags.",
    "timeLimit": 420,
    "testCases": [
      {
        "id": 1,
        "description": "Use <mark> to highlight important text"
      },
      {
        "id": 2,
        "description": "Combine <mark> with <strong> or <em>"
      },
      {
        "id": 3,
        "description": "Create multiple paragraphs with highlighted terms"
      },
      {
        "id": 4,
        "description": "Include proper HTML structure"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Highlighted Text</title>\n</head>\n<body>\n    <h1>Search Results</h1>\n    <p>The <mark>HTML</mark> language is used for web structure.</p>\n    <p><mark><strong>CSS</strong></mark> is essential for styling websites.</p>\n    <p>Learn <mark>JavaScript</mark> to add interactivity to your pages.</p>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Highlighted Text</title>\n</head>\n<body>\n    <h1>Search Results</h1>\n    <!-- Add paragraphs with marked text -->\n</body>\n</html>"
  },
  "6": {
    "title": "Small and Sub/Sup Elements",
    "description": "Use <small> for fine print, <sub> for subscript, and <sup> for superscript text. Perfect for legal text, formulas, and footnotes.",
    "timeLimit": 420,
    "testCases": [
      {
        "id": 1,
        "description": "Use <small> for copyright or disclaimer text"
      },
      {
        "id": 2,
        "description": "Use <sub> for subscript (like H₂O)"
      },
      {
        "id": 3,
        "description": "Use <sup> for superscript (like x²)"
      },
      {
        "id": 4,
        "description": "Include proper HTML structure"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Text Formatting</title>\n</head>\n<body>\n    <h1>Chemical Formula</h1>\n    <p>Water is H<sub>2</sub>O</p>\n    <p>The area formula is A = πr<sup>2</sup></p>\n    <p>E = mc<sup>2</sup> is Einstein's famous equation</p>\n    <footer>\n        <small>&copy; 2024 Science Education. All rights reserved.</small>\n    </footer>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Text Formatting</title>\n</head>\n<body>\n    <h1>Chemical Formula</h1>\n    <!-- Add content with sub, sup, and small tags -->\n</body>\n</html>"
  },
  "7": {
    "title": "Ins and Del Elements",
    "description": "Use <ins> to show inserted text and <del> to show deleted text. These are useful for showing document changes and edits.",
    "timeLimit": 420,
    "testCases": [
      {
        "id": 1,
        "description": "Use <del> to mark deleted text"
      },
      {
        "id": 2,
        "description": "Use <ins> to mark inserted text"
      },
      {
        "id": 3,
        "description": "Add datetime attributes to track changes"
      },
      {
        "id": 4,
        "description": "Create multiple examples"
      },
      {
        "id": 5,
        "description": "Include proper HTML structure"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Document Revisions</title>\n</head>\n<body>\n    <h1>Meeting Notes - Revised</h1>\n    <p>The meeting will be held on <del datetime=\"2024-01-15\">Monday</del> <ins datetime=\"2024-01-16\">Tuesday</ins>.</p>\n    <p>Budget: <del>$5000</del> <ins>$7500</ins></p>\n    <p>Attendees: <ins>John, Mary, </ins>Bob, Alice</p>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Document Revisions</title>\n</head>\n<body>\n    <h1>Meeting Notes - Revised</h1>\n    <!-- Add content with ins and del tags -->\n</body>\n</html>"
  },
  "8": {
    "title": "Kbd, Samp, and Var Elements",
    "description": "Use <kbd> for keyboard input, <samp> for sample output, and <var> for variables. These semantic tags are perfect for technical documentation.",
    "timeLimit": 540,
    "testCases": [
      {
        "id": 1,
        "description": "Use <kbd> to show keyboard shortcuts"
      },
      {
        "id": 2,
        "description": "Use <samp> to show program output"
      },
      {
        "id": 3,
        "description": "Use <var> to show variables"
      },
      {
        "id": 4,
        "description": "Create multiple examples"
      },
      {
        "id": 5,
        "description": "Include proper HTML structure"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Technical Documentation</title>\n</head>\n<body>\n    <h1>Keyboard Shortcuts</h1>\n    <p>Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy</p>\n    <p>Press <kbd>Ctrl</kbd> + <kbd>V</kbd> to paste</p>\n    <h2>Program Output</h2>\n    <p>The program returned: <samp>Hello, World!</samp></p>\n    <h2>Variables</h2>\n    <p>The formula is <var>y</var> = <var>mx</var> + <var>b</var></p>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Technical Documentation</title>\n</head>\n<body>\n    <h1>Keyboard Shortcuts</h1>\n    <!-- Add content with kbd, samp, and var tags -->\n</body>\n</html>"
  },
  "9": {
    "title": "Wbr and Bdi Elements",
    "description": "Use <wbr> for word break opportunities and <bdi> for bidirectional text isolation. These handle special text formatting needs.",
    "timeLimit": 540,
    "testCases": [
      {
        "id": 1,
        "description": "Use <wbr> in long URLs or words"
      },
      {
        "id": 2,
        "description": "Use <bdi> for user-generated content"
      },
      {
        "id": 3,
        "description": "Create examples showing their usage"
      },
      {
        "id": 4,
        "description": "Add explanatory text"
      },
      {
        "id": 5,
        "description": "Include proper HTML structure"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Special Text Elements</title>\n</head>\n<body>\n    <h1>Long URL Example</h1>\n    <p>Visit: https://www.<wbr>example<wbr>.com/<wbr>very/<wbr>long/<wbr>path</p>\n    <h2>User Comments</h2>\n    <p>User <bdi>إيان</bdi> posted: Great article!</p>\n    <p>User <bdi>John</bdi> posted: Thanks for sharing!</p>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Special Text Elements</title>\n</head>\n<body>\n    <h1>Long URL Example</h1>\n    <!-- Add content with wbr and bdi tags -->\n</body>\n</html>"
  },
  "10": {
    "title": "Complete Semantic Blog Page",
    "description": "Build a complete blog page using all semantic HTML5 elements: header, nav, main, article, section, aside, footer, and more.",
    "timeLimit": 540,
    "testCases": [
      {
        "id": 1,
        "description": "Include header with nav"
      },
      {
        "id": 2,
        "description": "Use main with article containing sections"
      },
      {
        "id": 3,
        "description": "Add aside with related content"
      },
      {
        "id": 4,
        "description": "Include footer with copyright"
      },
      {
        "id": 5,
        "description": "Use time, mark, and other semantic tags"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Complete Blog</title>\n</head>\n<body>\n    <header>\n        <h1>Tech Blog</h1>\n        <nav>\n            <a href=\"#home\">Home</a> | <a href=\"#about\">About</a> | <a href=\"#contact\">Contact</a>\n        </nav>\n    </header>\n    <main>\n        <article>\n            <h2>Understanding HTML5</h2>\n            <p>Posted on <time datetime=\"2024-01-15\">January 15, 2024</time></p>\n            <section>\n                <h3>Introduction</h3>\n                <p>HTML5 brings <mark>semantic elements</mark> to web development.</p>\n            </section>\n            <section>\n                <h3>Key Features</h3>\n                <p>New elements improve accessibility and SEO.</p>\n            </section>\n        </article>\n    </main>\n    <aside>\n        <h3>Related Posts</h3>\n        <ul>\n            <li><a href=\"#css\">CSS Guide</a></li>\n            <li><a href=\"#js\">JavaScript Basics</a></li>\n        </ul>\n    </aside>\n    <footer>\n        <small>&copy; 2024 Tech Blog</small>\n    </footer>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Complete Blog</title>\n</head>\n<body>\n    <!-- Build complete semantic blog page -->\n</body>\n</html>"
  }
};
