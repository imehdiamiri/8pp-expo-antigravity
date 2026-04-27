const fs = require('fs');
const path = require('path');

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      // Fix missing JSX braces: attr=Colors.red -> attr={Colors.red}
      // This regex matches any word followed by =Colors. and then a word,
      // as long as it's not already inside braces.
      const jsxColorRegex = /([a-zA-Z0-9_]+)=Colors\.([a-zA-Z0-9_]+)/g;
      
      if (jsxColorRegex.test(content)) {
        content = content.replace(jsxColorRegex, (match, attr, color) => {
          modified = true;
          return `${attr}={Colors.${color}}`;
        });
      }

      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Fixed JSX braces in ${fullPath}`);
      }
    }
  }
}

processDirectory('./app');
processDirectory('./src');
console.log('Fixed JSX color attributes.');
