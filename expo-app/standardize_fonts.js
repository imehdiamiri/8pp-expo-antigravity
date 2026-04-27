const fs = require('fs');
const path = require('path');

const iosSizes = [11, 12, 13, 15, 16, 17, 20, 22, 28, 34];

function getClosestIosSize(size) {
  // If it's a huge title, keep it or snap to something reasonable.
  // Many games have custom huge texts like "96" for dice/timer, let's not touch sizes > 40
  if (size > 40) return size;
  
  return iosSizes.reduce((prev, curr) => {
    return (Math.abs(curr - size) < Math.abs(prev - size) ? curr : prev);
  });
}

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
      
      // Regex to find fontSize: <number>
      content = content.replace(/fontSize:\s*(\d+)/g, (match, p1) => {
        const originalSize = parseInt(p1, 10);
        const newSize = getClosestIosSize(originalSize);
        if (originalSize !== newSize) {
          modified = true;
          return `fontSize: ${newSize}`;
        }
        return match;
      });
      
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated fonts in ${fullPath}`);
      }
    }
  }
}

processDirectory('./app');
processDirectory('./src');
console.log('Done standardizing font sizes.');
