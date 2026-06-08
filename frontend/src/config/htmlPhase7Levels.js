export const htmlPhase7Levels = {
  "1": {
    "title": "Meta Tags for SEO",
    "description": "Add meta tags in the <head> section for SEO and social media. Meta tags provide information about your webpage to search engines and social platforms.",
    "timeLimit": 330,
    "testCases": [
      {
        "id": 1,
        "description": "Add meta charset and viewport tags"
      },
      {
        "id": 2,
        "description": "Add meta description tag"
      },
      {
        "id": 3,
        "description": "Add meta keywords tag"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <meta name=\"description\" content=\"Learn web development with HTML, CSS, and JavaScript tutorials\">\n    <meta name=\"keywords\" content=\"HTML, CSS, JavaScript, web development, tutorial\">\n    <meta name=\"author\" content=\"John Doe\">\n    <title>Web Development Tutorials</title>\n</head>\n<body>\n    <h1>Welcome to Web Dev Tutorials</h1>\n    <p>Learn to build amazing websites!</p>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <!-- Add meta tags here -->\n    <title>Web Development Tutorials</title>\n</head>\n<body>\n    <h1>Welcome to Web Dev Tutorials</h1>\n    <p>Learn to build amazing websites!</p>\n</body>\n</html>"
  },
  "2": {
    "title": "Open Graph Meta Tags",
    "description": "Add Open Graph meta tags for better social media sharing. These tags control how your page appears when shared on Facebook, LinkedIn, etc.",
    "timeLimit": 330,
    "testCases": [
      {
        "id": 1,
        "description": "Add og:title meta tag"
      },
      {
        "id": 2,
        "description": "Add og:description meta tag"
      },
      {
        "id": 3,
        "description": "Add og:image meta tag"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta property=\"og:title\" content=\"Amazing Web Development Course\">\n    <meta property=\"og:description\" content=\"Master HTML, CSS, and JavaScript in 30 days\">\n    <meta property=\"og:image\" content=\"https://example.com/course-image.jpg\">\n    <meta property=\"og:url\" content=\"https://example.com/course\">\n    <meta property=\"og:type\" content=\"website\">\n    <title>Web Dev Course</title>\n</head>\n<body>\n    <h1>Web Development Course</h1>\n    <p>Start your coding journey today!</p>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <!-- Add Open Graph meta tags here -->\n    <title>Web Dev Course</title>\n</head>\n<body>\n    <h1>Web Development Course</h1>\n    <p>Start your coding journey today!</p>\n</body>\n</html>"
  },
  "3": {
    "title": "Twitter Card Meta Tags",
    "description": "Add Twitter Card meta tags to control how your page appears when shared on Twitter. These work alongside Open Graph tags.",
    "timeLimit": 330,
    "testCases": [
      {
        "id": 1,
        "description": "Add twitter:card meta tag"
      },
      {
        "id": 2,
        "description": "Add twitter:title meta tag"
      },
      {
        "id": 3,
        "description": "Add twitter:description meta tag"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"twitter:card\" content=\"summary_large_image\">\n    <meta name=\"twitter:title\" content=\"Learn Web Development\">\n    <meta name=\"twitter:description\" content=\"Comprehensive guide to HTML, CSS, and JavaScript\">\n    <meta name=\"twitter:image\" content=\"https://example.com/twitter-image.jpg\">\n    <meta name=\"twitter:site\" content=\"@webdevtutorials\">\n    <title>Web Dev Guide</title>\n</head>\n<body>\n    <h1>Web Development Guide</h1>\n    <p>Your complete resource for learning web development</p>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <!-- Add Twitter Card meta tags here -->\n    <title>Web Dev Guide</title>\n</head>\n<body>\n    <h1>Web Development Guide</h1>\n    <p>Your complete resource for learning web development</p>\n</body>\n</html>"
  },
  "4": {
    "title": "Link Tags for Resources",
    "description": "Use <link> tags to connect external resources like stylesheets, fonts, and favicons. Link tags go in the <head> section.",
    "timeLimit": 420,
    "testCases": [
      {
        "id": 1,
        "description": "Add link tag for external CSS stylesheet"
      },
      {
        "id": 2,
        "description": "Add link tag for favicon"
      },
      {
        "id": 3,
        "description": "Add link tag for Google Fonts"
      },
      {
        "id": 4,
        "description": "Include proper HTML structure"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>Linked Resources</title>\n    <link rel=\"stylesheet\" href=\"styles.css\">\n    <link rel=\"icon\" type=\"image/png\" href=\"favicon.png\">\n    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n    <link href=\"https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap\" rel=\"stylesheet\">\n</head>\n<body>\n    <h1>Page with Linked Resources</h1>\n    <p>This page links to external CSS, fonts, and favicon.</p>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>Linked Resources</title>\n    <!-- Add link tags here -->\n</head>\n<body>\n    <h1>Page with Linked Resources</h1>\n    <p>This page links to external CSS, fonts, and favicon.</p>\n</body>\n</html>"
  },
  "5": {
    "title": "Script Tags and Placement",
    "description": "Add <script> tags to include JavaScript. Learn about placement (head vs body) and the defer/async attributes.",
    "timeLimit": 420,
    "testCases": [
      {
        "id": 1,
        "description": "Add external script with src attribute"
      },
      {
        "id": 2,
        "description": "Add inline script in body"
      },
      {
        "id": 3,
        "description": "Use defer attribute on script"
      },
      {
        "id": 4,
        "description": "Include proper HTML structure"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>JavaScript Integration</title>\n    <script src=\"app.js\" defer></script>\n</head>\n<body>\n    <h1>JavaScript Example</h1>\n    <p id=\"demo\">This text will change</p>\n    <button onclick=\"changeText()\">Click Me</button>\n    <script>\n        function changeText() {\n            document.getElementById('demo').innerHTML = 'Text changed!';\n        }\n    </script>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>JavaScript Integration</title>\n    <!-- Add script tags here -->\n</head>\n<body>\n    <h1>JavaScript Example</h1>\n    <p id=\"demo\">This text will change</p>\n    <button onclick=\"changeText()\">Click Me</button>\n    <!-- Add inline script here -->\n</body>\n</html>"
  },
  "6": {
    "title": "Base and Link Canonical",
    "description": "Use <base> to set a base URL for relative links and <link rel='canonical'> to specify the preferred URL for SEO.",
    "timeLimit": 420,
    "testCases": [
      {
        "id": 1,
        "description": "Add <base> tag with href attribute"
      },
      {
        "id": 2,
        "description": "Add canonical link tag"
      },
      {
        "id": 3,
        "description": "Include relative links that use the base URL"
      },
      {
        "id": 4,
        "description": "Include proper HTML structure"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <base href=\"https://example.com/\">\n    <link rel=\"canonical\" href=\"https://example.com/blog/article\">\n    <title>Article Page</title>\n</head>\n<body>\n    <h1>Blog Article</h1>\n    <p>Read more <a href=\"blog/related-article\">related articles</a></p>\n    <img src=\"images/photo.jpg\" alt=\"Photo\">\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <!-- Add base and canonical link tags here -->\n    <title>Article Page</title>\n</head>\n<body>\n    <h1>Blog Article</h1>\n    <p>Read more <a href=\"blog/related-article\">related articles</a></p>\n    <img src=\"images/photo.jpg\" alt=\"Photo\">\n</body>\n</html>"
  },
  "7": {
    "title": "Noscript Element",
    "description": "Use <noscript> to provide fallback content for users who have JavaScript disabled. This improves accessibility.",
    "timeLimit": 420,
    "testCases": [
      {
        "id": 1,
        "description": "Add <noscript> element with fallback message"
      },
      {
        "id": 2,
        "description": "Include alternative content or links"
      },
      {
        "id": 3,
        "description": "Add JavaScript that modifies the page"
      },
      {
        "id": 4,
        "description": "Show different content for JS enabled/disabled"
      },
      {
        "id": 5,
        "description": "Include proper HTML structure"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>NoScript Example</title>\n</head>\n<body>\n    <h1>Interactive Page</h1>\n    <div id=\"content\">\n        <p>Loading interactive content...</p>\n    </div>\n    <noscript>\n        <div style=\"background: #ffcccc; padding: 20px;\">\n            <h2>JavaScript Required</h2>\n            <p>This page requires JavaScript to function properly.</p>\n            <p>Please enable JavaScript in your browser settings.</p>\n        </div>\n    </noscript>\n    <script>\n        document.getElementById('content').innerHTML = '<p>JavaScript is enabled! Interactive features are available.</p>';\n    </script>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>NoScript Example</title>\n</head>\n<body>\n    <h1>Interactive Page</h1>\n    <div id=\"content\">\n        <p>Loading interactive content...</p>\n    </div>\n    <!-- Add noscript element here -->\n    <!-- Add script to modify content -->\n</body>\n</html>"
  },
  "8": {
    "title": "Template Element",
    "description": "Use the <template> tag to hold HTML content that won't be rendered immediately. Templates are activated with JavaScript.",
    "timeLimit": 540,
    "testCases": [
      {
        "id": 1,
        "description": "Create a <template> element with id"
      },
      {
        "id": 2,
        "description": "Add HTML content inside template"
      },
      {
        "id": 3,
        "description": "Include a button to activate template"
      },
      {
        "id": 4,
        "description": "Add script to clone and display template content"
      },
      {
        "id": 5,
        "description": "Include proper HTML structure"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>Template Example</title>\n</head>\n<body>\n    <h1>Product List</h1>\n    <div id=\"products\"></div>\n    <button onclick=\"addProduct()\">Add Product</button>\n    \n    <template id=\"product-template\">\n        <div class=\"product\">\n            <h3>Product Name</h3>\n            <p>Price: $99.99</p>\n        </div>\n    </template>\n    \n    <script>\n        function addProduct() {\n            const template = document.getElementById('product-template');\n            const clone = template.content.cloneNode(true);\n            document.getElementById('products').appendChild(clone);\n        }\n    </script>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>Template Example</title>\n</head>\n<body>\n    <h1>Product List</h1>\n    <div id=\"products\"></div>\n    <button onclick=\"addProduct()\">Add Product</button>\n    \n    <!-- Add template element here -->\n    \n    <!-- Add script to use template -->\n</body>\n</html>"
  },
  "9": {
    "title": "Dialog Element",
    "description": "Use the <dialog> element to create modal dialogs and popups. Control visibility with the open attribute and JavaScript.",
    "timeLimit": 540,
    "testCases": [
      {
        "id": 1,
        "description": "Create a <dialog> element with id"
      },
      {
        "id": 2,
        "description": "Add content inside dialog"
      },
      {
        "id": 3,
        "description": "Add buttons to open and close dialog"
      },
      {
        "id": 4,
        "description": "Add JavaScript to control dialog"
      },
      {
        "id": 5,
        "description": "Include proper HTML structure"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>Dialog Example</title>\n</head>\n<body>\n    <h1>Dialog Demo</h1>\n    <button onclick=\"openDialog()\">Open Dialog</button>\n    \n    <dialog id=\"myDialog\">\n        <h2>This is a Dialog</h2>\n        <p>Dialog content goes here.</p>\n        <button onclick=\"closeDialog()\">Close</button>\n    </dialog>\n    \n    <script>\n        function openDialog() {\n            document.getElementById('myDialog').showModal();\n        }\n        function closeDialog() {\n            document.getElementById('myDialog').close();\n        }\n    </script>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <title>Dialog Example</title>\n</head>\n<body>\n    <h1>Dialog Demo</h1>\n    <button onclick=\"openDialog()\">Open Dialog</button>\n    \n    <!-- Add dialog element here -->\n    \n    <!-- Add JavaScript functions -->\n</body>\n</html>"
  },
  "10": {
    "title": "Complete HTML5 Document",
    "description": "Create a complete, production-ready HTML5 document with all best practices: meta tags, semantic structure, accessibility features, and SEO optimization.",
    "timeLimit": 540,
    "testCases": [
      {
        "id": 1,
        "description": "Include comprehensive meta tags (SEO, Open Graph, Twitter)"
      },
      {
        "id": 2,
        "description": "Use semantic HTML5 elements (header, nav, main, article, aside, footer)"
      },
      {
        "id": 3,
        "description": "Add accessibility features (lang, alt, aria labels)"
      },
      {
        "id": 4,
        "description": "Include external resources (CSS, fonts, favicon)"
      },
      {
        "id": 5,
        "description": "Add structured content with proper hierarchy"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <meta name=\"description\" content=\"Professional web development services and tutorials\">\n    <meta name=\"keywords\" content=\"web development, HTML5, CSS3, JavaScript\">\n    <meta property=\"og:title\" content=\"Web Dev Pro\">\n    <meta property=\"og:description\" content=\"Learn professional web development\">\n    <meta property=\"og:image\" content=\"https://example.com/og-image.jpg\">\n    <link rel=\"stylesheet\" href=\"styles.css\">\n    <link rel=\"icon\" href=\"favicon.ico\">\n    <title>Web Dev Pro - Professional Web Development</title>\n</head>\n<body>\n    <header>\n        <h1>Web Dev Pro</h1>\n        <nav aria-label=\"Main navigation\">\n            <ul>\n                <li><a href=\"#home\">Home</a></li>\n                <li><a href=\"#services\">Services</a></li>\n                <li><a href=\"#about\">About</a></li>\n                <li><a href=\"#contact\">Contact</a></li>\n            </ul>\n        </nav>\n    </header>\n    <main>\n        <article>\n            <h2>Welcome to Web Dev Pro</h2>\n            <p>Published on <time datetime=\"2024-01-15\">January 15, 2024</time></p>\n            <section>\n                <h3>Our Services</h3>\n                <p>We provide professional web development services.</p>\n            </section>\n        </article>\n        <aside>\n            <h3>Quick Links</h3>\n            <ul>\n                <li><a href=\"#tutorials\">Tutorials</a></li>\n                <li><a href=\"#blog\">Blog</a></li>\n            </ul>\n        </aside>\n    </main>\n    <footer>\n        <p>&copy; 2024 Web Dev Pro. All rights reserved.</p>\n    </footer>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n    <!-- Add all meta tags and links here -->\n    <title>Web Dev Pro - Professional Web Development</title>\n</head>\n<body>\n    <!-- Build complete semantic structure here -->\n</body>\n</html>"
  }
};
