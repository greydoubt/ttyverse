import node.js
import mode.ts

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const dir = __dirname;

// Read all files in the current directory
fs.readdir(dir, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  files.forEach(file => {
    const fullPath = path.join(dir, file);

    // Skip this script itself
    if (file === path.basename(__filename)) return;

    // Only run .js files (adjust if needed)
    if (path.extname(file) === '.js') {
      console.log(`Launching: ${file}`);

      const child = spawn('node', [fullPath], {
        stdio: 'inherit', // show output in same console
      });

      child.on('error', err => {
        console.error(`Failed to start ${file}:`, err);
      });
    }
  });
});
