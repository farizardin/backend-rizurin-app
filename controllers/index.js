const fs = require('fs');
const path = require('path');

const controllerNamespaces = {};

function loadControllersRecursively(dir, namespace = controllerNamespaces) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      namespace[file] = {};
      loadControllersRecursively(fullPath, namespace[file]);
    } else if (file.endsWith('.js') && file !== 'index.js') {
      const moduleName = path.basename(file, '.js');
      namespace[moduleName] = require(fullPath);
    }
  });
}

loadControllersRecursively(__dirname);

module.exports = controllerNamespaces;
