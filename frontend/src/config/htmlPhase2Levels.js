export const htmlPhase2Levels = {
  "1": {
    "title": "Multiple Headings",
    "description": "Create a webpage with all six heading levels (h1 through h6) to understand heading hierarchy. Each heading should contain text describing its level.",
    "timeLimit": 180,
    "testCases": [
      {
        "id": 1,
        "description": "Add all six heading tags from <h1> to <h6>"
      },
      {
        "id": 2,
        "description": "Each heading must contain descriptive text"
      },
      {
        "id": 3,
        "description": "Include proper DOCTYPE and HTML structure"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Heading Hierarchy</title>\n</head>\n<body>\n    <h1>Main Heading</h1>\n    <h2>Subheading Level 2</h2>\n    <h3>Subheading Level 3</h3>\n    <h4>Subheading Level 4</h4>\n    <h5>Subheading Level 5</h5>\n    <h6>Subheading Level 6</h6>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Heading Hierarchy</title>\n</head>\n<body>\n    <!-- Add all six heading levels here -->\n</body>\n</html>"
  },
  "2": {
    "title": "Text Formatting Tags",
    "description": "Use HTML text formatting tags to make text bold, italic, underlined, and highlighted. Learn to use <strong>, <em>, <u>, and <mark> tags.",
    "timeLimit": 180,
    "testCases": [
      {
        "id": 1,
        "description": "Use <strong> tag to make text bold"
      },
      {
        "id": 2,
        "description": "Use <em> tag for italic and <u> for underline"
      },
      {
        "id": 3,
        "description": "Use <mark> tag to highlight text"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Text Formatting</title>\n</head>\n<body>\n    <h1>Text Formatting Demo</h1>\n    <p>This is <strong>bold text</strong> and this is <em>italic text</em>.</p>\n    <p>This is <u>underlined text</u> and this is <mark>highlighted text</mark>.</p>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Text Formatting</title>\n</head>\n<body>\n    <h1>Text Formatting Demo</h1>\n    <!-- Add formatted text here -->\n</body>\n</html>"
  },
  "3": {
    "title": "Navigation Links",
    "description": "Create a navigation menu with multiple links. Use <nav> tag to wrap your links and create a list of navigation items pointing to different pages.",
    "timeLimit": 180,
    "testCases": [
      {
        "id": 1,
        "description": "Wrap links in a <nav> element"
      },
      {
        "id": 2,
        "description": "Create at least 4 links using <a> tags"
      },
      {
        "id": 3,
        "description": "Each link must have href and descriptive text"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Navigation Menu</title>\n</head>\n<body>\n    <nav>\n        <a href=\"home.html\">Home</a>\n        <a href=\"about.html\">About</a>\n        <a href=\"services.html\">Services</a>\n        <a href=\"contact.html\">Contact</a>\n    </nav>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Navigation Menu</title>\n</head>\n<body>\n    <nav>\n        <!-- Add your navigation links here -->\n    </nav>\n</body>\n</html>"
  },
  "4": {
    "title": "Paragraph Breaks",
    "description": "Create multiple paragraphs with line breaks. Use <p> tags for paragraphs and <br> tags for line breaks within paragraphs.",
    "timeLimit": 300,
    "testCases": [
      {
        "id": 1,
        "description": "Create at least 3 separate <p> elements"
      },
      {
        "id": 2,
        "description": "Use <br> tag to add line breaks within a paragraph"
      },
      {
        "id": 3,
        "description": "Add a horizontal rule <hr> between sections"
      },
      {
        "id": 4,
        "description": "Include proper HTML structure"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Paragraphs and Breaks</title>\n</head>\n<body>\n    <h1>My Story</h1>\n    <p>This is the first paragraph of my story.</p>\n    <p>This is the second paragraph.<br>It has a line break in the middle.</p>\n    <hr>\n    <p>This is the final paragraph after the horizontal rule.</p>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Paragraphs and Breaks</title>\n</head>\n<body>\n    <h1>My Story</h1>\n    <!-- Add your paragraphs, breaks, and horizontal rule here -->\n</body>\n</html>"
  },
  "5": {
    "title": "Email and Phone Links",
    "description": "Create special links for email and phone numbers using mailto: and tel: protocols. These create clickable links that open email clients or dial phone numbers.",
    "timeLimit": 300,
    "testCases": [
      {
        "id": 1,
        "description": "Create an email link using <a href='mailto:email@example.com'>"
      },
      {
        "id": 2,
        "description": "Create a phone link using <a href='tel:+1234567890'>"
      },
      {
        "id": 3,
        "description": "Add descriptive text for each link"
      },
      {
        "id": 4,
        "description": "Include a heading and proper HTML structure"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Contact Links</title>\n</head>\n<body>\n    <h1>Contact Us</h1>\n    <p>Email: <a href=\"mailto:contact@example.com\">contact@example.com</a></p>\n    <p>Phone: <a href=\"tel:+1234567890\">+1 (234) 567-890</a></p>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Contact Links</title>\n</head>\n<body>\n    <h1>Contact Us</h1>\n    <!-- Add email and phone links here -->\n</body>\n</html>"
  },
  "6": {
    "title": "Link Targets",
    "description": "Learn to control how links open using the target attribute. Create links that open in new tabs (_blank) and in the same window (_self).",
    "timeLimit": 300,
    "testCases": [
      {
        "id": 1,
        "description": "Create a link with target='_blank' to open in new tab"
      },
      {
        "id": 2,
        "description": "Create a link with target='_self' to open in same window"
      },
      {
        "id": 3,
        "description": "Add title attributes to provide hover tooltips"
      },
      {
        "id": 4,
        "description": "Include proper HTML structure with headings"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Link Targets</title>\n</head>\n<body>\n    <h1>Understanding Link Targets</h1>\n    <p><a href=\"https://google.com\" target=\"_blank\" title=\"Opens in new tab\">Open Google in New Tab</a></p>\n    <p><a href=\"https://example.com\" target=\"_self\" title=\"Opens in same window\">Open Example in Same Window</a></p>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Link Targets</title>\n</head>\n<body>\n    <h1>Understanding Link Targets</h1>\n    <!-- Add links with different target attributes -->\n</body>\n</html>"
  },
  "7": {
    "title": "Image with Alt Text",
    "description": "Add images with proper alt attributes for accessibility. The alt text describes the image for screen readers and appears if the image fails to load.",
    "timeLimit": 300,
    "testCases": [
      {
        "id": 1,
        "description": "Add an <img> tag with src attribute"
      },
      {
        "id": 2,
        "description": "Include descriptive alt text"
      },
      {
        "id": 3,
        "description": "Add width and height attributes"
      },
      {
        "id": 4,
        "description": "Include a caption using <p> tag"
      },
      {
        "id": 5,
        "description": "Add an <img> tag with src attribute"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Image Gallery</title>\n</head>\n<body>\n    <h1>My Photo</h1>\n    <img src=\"sunset.jpg\" alt=\"Beautiful sunset over the ocean\" width=\"400\" height=\"300\">\n    <p>A stunning sunset view</p>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Image Gallery</title>\n</head>\n<body>\n    <h1>My Photo</h1>\n    <!-- Add your image with alt text here -->\n</body>\n</html>"
  },
  "8": {
    "title": "Blockquote and Citation",
    "description": "Use <blockquote> for long quotations and <cite> for citing sources. These semantic tags help structure quoted content properly.",
    "timeLimit": 420,
    "testCases": [
      {
        "id": 1,
        "description": "Use <blockquote> tag for a quote"
      },
      {
        "id": 2,
        "description": "Use <cite> tag to cite the source"
      },
      {
        "id": 3,
        "description": "Add a paragraph before the quote"
      },
      {
        "id": 4,
        "description": "Include proper HTML structure"
      },
      {
        "id": 5,
        "description": "Add a heading"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Famous Quotes</title>\n</head>\n<body>\n    <h1>Inspirational Quote</h1>\n    <p>One of my favorite quotes is:</p>\n    <blockquote>\n        <p>The only way to do great work is to love what you do.</p>\n        <cite>- Steve Jobs</cite>\n    </blockquote>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Famous Quotes</title>\n</head>\n<body>\n    <h1>Inspirational Quote</h1>\n    <!-- Add your blockquote and citation here -->\n</body>\n</html>"
  },
  "9": {
    "title": "Preformatted Text",
    "description": "Use the <pre> tag to display preformatted text that preserves spaces and line breaks. Perfect for displaying code or ASCII art.",
    "timeLimit": 420,
    "testCases": [
      {
        "id": 1,
        "description": "Use <pre> tag to wrap preformatted content"
      },
      {
        "id": 2,
        "description": "Include text with multiple spaces and line breaks"
      },
      {
        "id": 3,
        "description": "Add a heading above the preformatted text"
      },
      {
        "id": 4,
        "description": "Use <code> tag inside <pre> for code display"
      },
      {
        "id": 5,
        "description": "Include proper HTML structure"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Code Display</title>\n</head>\n<body>\n    <h1>JavaScript Example</h1>\n    <pre><code>function greet() {\n    console.log(\"Hello, World!\");\n}\ngreet();</code></pre>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Code Display</title>\n</head>\n<body>\n    <h1>JavaScript Example</h1>\n    <!-- Add your preformatted code here -->\n</body>\n</html>"
  },
  "10": {
    "title": "Semantic HTML5 Elements",
    "description": "Use HTML5 semantic elements like <article>, <section>, and <time> to create well-structured, meaningful content.",
    "timeLimit": 420,
    "testCases": [
      {
        "id": 1,
        "description": "Use <article> tag to wrap the main content"
      },
      {
        "id": 2,
        "description": "Use <section> tags for different parts"
      },
      {
        "id": 3,
        "description": "Include <time> tag with datetime attribute"
      },
      {
        "id": 4,
        "description": "Add headings and paragraphs"
      },
      {
        "id": 5,
        "description": "Include proper HTML structure"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Blog Post</title>\n</head>\n<body>\n    <article>\n        <h1>My First Blog Post</h1>\n        <p>Published on <time datetime=\"2024-01-15\">January 15, 2024</time></p>\n        <section>\n            <h2>Introduction</h2>\n            <p>Welcome to my blog!</p>\n        </section>\n        <section>\n            <h2>Main Content</h2>\n            <p>This is the main content of my post.</p>\n        </section>\n    </article>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Blog Post</title>\n</head>\n<body>\n    <!-- Create your article with sections here -->\n</body>\n</html>"
  }
};
