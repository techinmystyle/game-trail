export const htmlPhase5Levels = {
  "1": {
    "title": "Audio Element",
    "description": "Embed audio files in your webpage using the <audio> tag. Add controls to let users play, pause, and adjust volume.",
    "timeLimit": 330,
    "testCases": [
      {
        "id": 1,
        "description": "Create an <audio> element with src attribute"
      },
      {
        "id": 2,
        "description": "Add controls attribute to show playback controls"
      },
      {
        "id": 3,
        "description": "Include multiple <source> elements for browser compatibility"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Audio Player</title>\n</head>\n<body>\n    <h1>Listen to Music</h1>\n    <audio controls>\n        <source src=\"song.mp3\" type=\"audio/mpeg\">\n        <source src=\"song.ogg\" type=\"audio/ogg\">\n        Your browser does not support the audio element.\n    </audio>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Audio Player</title>\n</head>\n<body>\n    <h1>Listen to Music</h1>\n    <!-- Add audio element here -->\n</body>\n</html>"
  },
  "2": {
    "title": "Video Element",
    "description": "Embed video files using the <video> tag. Add controls, set dimensions, and provide multiple formats for compatibility.",
    "timeLimit": 330,
    "testCases": [
      {
        "id": 1,
        "description": "Create a <video> element with width and height"
      },
      {
        "id": 2,
        "description": "Add controls attribute"
      },
      {
        "id": 3,
        "description": "Include multiple <source> elements"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Video Player</title>\n</head>\n<body>\n    <h1>Watch Video</h1>\n    <video width=\"640\" height=\"360\" controls>\n        <source src=\"movie.mp4\" type=\"video/mp4\">\n        <source src=\"movie.webm\" type=\"video/webm\">\n        Your browser does not support the video tag.\n    </video>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Video Player</title>\n</head>\n<body>\n    <h1>Watch Video</h1>\n    <!-- Add video element here -->\n</body>\n</html>"
  },
  "3": {
    "title": "Iframe Embedding",
    "description": "Use <iframe> to embed external content like YouTube videos, maps, or other webpages within your page.",
    "timeLimit": 330,
    "testCases": [
      {
        "id": 1,
        "description": "Create an <iframe> element with src attribute"
      },
      {
        "id": 2,
        "description": "Set width and height attributes"
      },
      {
        "id": 3,
        "description": "Add title attribute for accessibility"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Embedded Content</title>\n</head>\n<body>\n    <h1>Embedded YouTube Video</h1>\n    <iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/dQw4w9WgXcQ\" title=\"YouTube video player\"></iframe>\n    <h2>Embedded Map</h2>\n    <iframe width=\"600\" height=\"450\" src=\"https://www.google.com/maps/embed\" title=\"Google Maps\"></iframe>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Embedded Content</title>\n</head>\n<body>\n    <h1>Embedded YouTube Video</h1>\n    <!-- Add iframe elements here -->\n</body>\n</html>"
  },
  "4": {
    "title": "Canvas Element",
    "description": "Create a <canvas> element for drawing graphics with JavaScript. Set dimensions and add an id for JavaScript access.",
    "timeLimit": 420,
    "testCases": [
      {
        "id": 1,
        "description": "Create a <canvas> element with id attribute"
      },
      {
        "id": 2,
        "description": "Set width and height attributes"
      },
      {
        "id": 3,
        "description": "Add fallback text inside canvas"
      },
      {
        "id": 4,
        "description": "Include a border style for visibility"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Canvas Drawing</title>\n    <style>\n        canvas { border: 1px solid black; }\n    </style>\n</head>\n<body>\n    <h1>Drawing Canvas</h1>\n    <canvas id=\"myCanvas\" width=\"400\" height=\"300\">\n        Your browser does not support the canvas element.\n    </canvas>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Canvas Drawing</title>\n    <style>\n        canvas { border: 1px solid black; }\n    </style>\n</head>\n<body>\n    <h1>Drawing Canvas</h1>\n    <!-- Add canvas element here -->\n</body>\n</html>"
  },
  "5": {
    "title": "SVG Graphics",
    "description": "Create Scalable Vector Graphics (SVG) directly in HTML. Draw basic shapes like circles, rectangles, and lines.",
    "timeLimit": 420,
    "testCases": [
      {
        "id": 1,
        "description": "Create an <svg> element with width and height"
      },
      {
        "id": 2,
        "description": "Draw a circle using <circle>"
      },
      {
        "id": 3,
        "description": "Draw a rectangle using <rect>"
      },
      {
        "id": 4,
        "description": "Add fill and stroke attributes for colors"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>SVG Graphics</title>\n</head>\n<body>\n    <h1>SVG Shapes</h1>\n    <svg width=\"400\" height=\"300\">\n        <circle cx=\"100\" cy=\"100\" r=\"50\" fill=\"blue\" stroke=\"black\" stroke-width=\"2\"/>\n        <rect x=\"200\" y=\"50\" width=\"100\" height=\"80\" fill=\"red\" stroke=\"black\" stroke-width=\"2\"/>\n    </svg>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>SVG Graphics</title>\n</head>\n<body>\n    <h1>SVG Shapes</h1>\n    <!-- Add SVG with shapes here -->\n</body>\n</html>"
  },
  "6": {
    "title": "Progress and Meter Elements",
    "description": "Use <progress> to show task completion and <meter> to display measurements within a range.",
    "timeLimit": 420,
    "testCases": [
      {
        "id": 1,
        "description": "Create a <progress> element with value and max attributes"
      },
      {
        "id": 2,
        "description": "Create a <meter> element with value, min, and max"
      },
      {
        "id": 3,
        "description": "Add labels for each element"
      },
      {
        "id": 4,
        "description": "Include proper HTML structure"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Progress and Meter</title>\n</head>\n<body>\n    <h1>Task Progress</h1>\n    <label>Download Progress:</label>\n    <progress value=\"70\" max=\"100\">70%</progress>\n    <p>70% Complete</p>\n    \n    <h2>Disk Usage</h2>\n    <label>Storage:</label>\n    <meter value=\"65\" min=\"0\" max=\"100\">65%</meter>\n    <p>65 GB of 100 GB used</p>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Progress and Meter</title>\n</head>\n<body>\n    <h1>Task Progress</h1>\n    <!-- Add progress and meter elements here -->\n</body>\n</html>"
  },
  "7": {
    "title": "Details and Summary",
    "description": "Create collapsible content sections using <details> and <summary> tags. Users can click to expand/collapse content.",
    "timeLimit": 420,
    "testCases": [
      {
        "id": 1,
        "description": "Create at least 2 <details> elements"
      },
      {
        "id": 2,
        "description": "Each details must have a <summary>"
      },
      {
        "id": 3,
        "description": "Add content inside details after summary"
      },
      {
        "id": 4,
        "description": "Make one details element open by default"
      },
      {
        "id": 5,
        "description": "Include proper HTML structure"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>FAQ Section</title>\n</head>\n<body>\n    <h1>Frequently Asked Questions</h1>\n    <details open>\n        <summary>What is HTML?</summary>\n        <p>HTML stands for HyperText Markup Language. It's used to structure web content.</p>\n    </details>\n    <details>\n        <summary>What is CSS?</summary>\n        <p>CSS stands for Cascading Style Sheets. It's used to style web pages.</p>\n    </details>\n    <details>\n        <summary>What is JavaScript?</summary>\n        <p>JavaScript is a programming language that adds interactivity to websites.</p>\n    </details>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>FAQ Section</title>\n</head>\n<body>\n    <h1>Frequently Asked Questions</h1>\n    <!-- Add details and summary elements here -->\n</body>\n</html>"
  },
  "8": {
    "title": "Figure and Figcaption",
    "description": "Use <figure> to group media content with its caption using <figcaption>. This creates semantic, accessible content.",
    "timeLimit": 540,
    "testCases": [
      {
        "id": 1,
        "description": "Create at least 2 <figure> elements"
      },
      {
        "id": 2,
        "description": "Each figure must contain an <img>"
      },
      {
        "id": 3,
        "description": "Each figure must have a <figcaption>"
      },
      {
        "id": 4,
        "description": "Add descriptive alt text to images"
      },
      {
        "id": 5,
        "description": "Include proper HTML structure"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Image Gallery</title>\n</head>\n<body>\n    <h1>Photo Gallery</h1>\n    <figure>\n        <img src=\"sunset.jpg\" alt=\"Beautiful sunset\" width=\"300\">\n        <figcaption>A stunning sunset over the ocean</figcaption>\n    </figure>\n    <figure>\n        <img src=\"mountain.jpg\" alt=\"Mountain landscape\" width=\"300\">\n        <figcaption>Majestic mountain peaks</figcaption>\n    </figure>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Image Gallery</title>\n</head>\n<body>\n    <h1>Photo Gallery</h1>\n    <!-- Add figure elements with images and captions -->\n</body>\n</html>"
  },
  "9": {
    "title": "Data Attributes",
    "description": "Use custom data-* attributes to store extra information on HTML elements. These can be accessed with JavaScript.",
    "timeLimit": 540,
    "testCases": [
      {
        "id": 1,
        "description": "Add data-* attributes to at least 3 elements"
      },
      {
        "id": 2,
        "description": "Use different data attribute names (data-id, data-category, etc.)"
      },
      {
        "id": 3,
        "description": "Create a list of products with data attributes"
      },
      {
        "id": 4,
        "description": "Include descriptive content"
      },
      {
        "id": 5,
        "description": "Include proper HTML structure"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Product List</title>\n</head>\n<body>\n    <h1>Products</h1>\n    <ul>\n        <li data-id=\"101\" data-category=\"electronics\" data-price=\"999\">Laptop</li>\n        <li data-id=\"102\" data-category=\"electronics\" data-price=\"599\">Smartphone</li>\n        <li data-id=\"103\" data-category=\"accessories\" data-price=\"49\">Headphones</li>\n    </ul>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Product List</title>\n</head>\n<body>\n    <h1>Products</h1>\n    <!-- Add list with data attributes -->\n</body>\n</html>"
  },
  "10": {
    "title": "Picture Element for Responsive Images",
    "description": "Use the <picture> element with multiple <source> tags to serve different images based on screen size or format support.",
    "timeLimit": 540,
    "testCases": [
      {
        "id": 1,
        "description": "Create a <picture> element"
      },
      {
        "id": 2,
        "description": "Add at least 2 <source> elements with media queries"
      },
      {
        "id": 3,
        "description": "Include an <img> as fallback"
      },
      {
        "id": 4,
        "description": "Use srcset and media attributes"
      },
      {
        "id": 5,
        "description": "Include proper HTML structure"
      }
    ],
    "expectedOutput": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Responsive Images</title>\n</head>\n<body>\n    <h1>Responsive Image Example</h1>\n    <picture>\n        <source media=\"(min-width: 800px)\" srcset=\"large-image.jpg\">\n        <source media=\"(min-width: 400px)\" srcset=\"medium-image.jpg\">\n        <img src=\"small-image.jpg\" alt=\"Responsive image\" style=\"width:100%;\">\n    </picture>\n</body>\n</html>",
    "starterCode": "<!DOCTYPE html>\n<html>\n<head>\n    <title>Responsive Images</title>\n</head>\n<body>\n    <h1>Responsive Image Example</h1>\n    <!-- Add picture element with sources -->\n</body>\n</html>"
  }
};
