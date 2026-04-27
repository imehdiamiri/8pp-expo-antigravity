const fs = require('fs');
const path = require('path');

const hexMap = {
  '#0A84FF': 'Colors.blue',
  '#5E5CE6': 'Colors.indigo',
  '#BF5AF2': 'Colors.purple',
  '#66D4CF': 'Colors.mint',
  '#64D2FF': 'Colors.teal',
  '#FF375F': 'Colors.pink',
  '#FF453A': 'Colors.red',
  '#FF3B30': 'Colors.red',
  '#FF9F0A': 'Colors.orange',
  '#FF9500': 'Colors.orange',
  '#FFD60A': 'Colors.yellow',
  '#FFCC00': 'Colors.yellow',
  '#32ADE6': 'Colors.cyan',
  '#30D158': 'Colors.green',
  '#34C759': 'Colors.green',
  '#000000': 'Colors.black',
  '#FFFFFF': 'Colors.white',
  '#0a0a12': 'Colors.appBackground'
};

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
      
      // We only replace if Colors is imported, or we add the import.
      // For simplicity, we just look for exact hex matches (case insensitive) inside quotes.
      
      for (const [hex, token] of Object.entries(hexMap)) {
        const regex = new RegExp(`['"]${hex}['"]`, 'gi');
        if (regex.test(content)) {
          content = content.replace(regex, token);
          modified = true;
        }
      }

      if (modified) {
        // Ensure Colors is imported
        if (!content.includes("import { Colors }")) {
          // Calculate relative path to src/theme/Colors
          const depth = fullPath.split(path.sep).length - 2; // app/ is 1 deep, app/tabs/ is 2
          const relativePath = depth > 0 ? '../'.repeat(depth) + 'src/theme/Colors' : './src/theme/Colors';
          // Actually, many use '@/src/theme/Colors'
          const importStatement = `import { Colors } from '@/src/theme/Colors';\n`;
          content = importStatement + content;
        }
        
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated colors in ${fullPath}`);
      }
    }
  }
}

processDirectory('./app');
processDirectory('./src');
console.log('Color standardization complete.');
