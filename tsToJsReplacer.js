const fs = require('fs');

exports.default = ({ orig, file }) => {
  const fileContents = fs.readFileSync(file, 'utf8');
  
  // Substitui todas as extensões .ts por .js
  const newContents = fileContents.replace(/\.ts/g, '.js');
  
  fs.writeFileSync(file, newContents);
  
  return orig;
};