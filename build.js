const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'dist', 'index.js');
let content = fs.readFileSync(filePath, 'utf8');

// Replace the last line with a direct module.exports assignment
content = content.replace(
  /exports\.default = (\w+);$/m,
  'module.exports = $1;'
);

fs.writeFileSync(filePath, content);