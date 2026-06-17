const fs = require('fs');
let code = fs.readFileSync('src/pages/LevelsModePage.jsx', 'utf8');

code = code.replace(
  'import { ChevronLeft, ChevronRight, Zap } from "lucide-react";',
  'import { ChevronLeft, ChevronRight, Zap } from "lucide-react";\nimport PixelBlast from "../components/landing/PixelBlast";'
);

// Remove the inline PixelBlast definition
code = code.replace(/\/\* ════════════════════════════════════════════════════════════════════\r?\n   PIXEL BLAST BACKGROUND[\s\S]*?const PixelBlast[\s\S]*?return \([\s\S]*?<\/canvas>\r?\n  \);\r?\n};\r?\n\r?\n/g, '');

// The usage is already <PixelBlast accent={ac} asteroid={theme.asteroid} /> inside LevelsModePage.
// I should update it to <PixelBlast color={ac} /> as per the new component's props.
code = code.replace(/<PixelBlast accent=\{ac\} asteroid=\{theme\.asteroid\} \/>/g, '<PixelBlast color={ac} />');

fs.writeFileSync('src/pages/LevelsModePage.jsx', code);
console.log('Updated LevelsModePage.jsx');
