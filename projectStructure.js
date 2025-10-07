// projectStructure.js
// This script shows the project structure

const fs = require("fs");
const path = require("path");

function walkDir(dir, indent = "") {
  const files = fs.readdirSync(dir);
  files.forEach((file, index) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    const isLast = index === files.length - 1;

    if (stats.isDirectory()) {
      console.log(`${indent}${isLast ? "└──" : "├──"} ${file}/`);
      walkDir(filePath, `${indent}${isLast ? "    " : "│   "}`);
    } else {
      console.log(`${indent}${isLast ? "└──" : "├──"} ${file}`);
    }
  });
}

function showProjectStructure() {
  console.log("IG-Live Backend Project Structure");
  console.log("===============================");
  console.log(".");
  walkDir(".");
}

showProjectStructure();
