const fs = require('fs');
const path = require('path');

const routeNamespaces = {};

function loadRoutesRecursively(dir, namespace = routeNamespaces) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      namespace[file] = {};
      loadRoutesRecursively(fullPath, namespace[file]);
    } else if (file.endsWith('.js') && file !== 'index.js') {
      const moduleName = path.basename(file, '.js');
      namespace[moduleName] = require(fullPath);
    }
  });
}

loadRoutesRecursively(__dirname);

module.exports = routeNamespaces;
