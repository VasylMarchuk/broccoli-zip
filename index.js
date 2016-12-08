const Plugin = require('broccoli-caching-writer');
// const JSZip = require('jszip');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

// Create a subclass Zip derived from Plugin
Zip.prototype = Object.create(Plugin.prototype);
Zip.prototype.constructor = Zip;
function Zip(inputNode, options) {
  // check for mandatory options
  options = options || {};
  options.name = options.name || 'archive';
  options.cacheInclude = [ /.*/ ];
  if (!(this instanceof Zip)) {
    return new Zip(inputNode, options);
  }
  this.options = options;

  Plugin.call(this, [inputNode], {
    annotation: options.name,
    persistentOutput: true
  });
}

Zip.prototype.build = function() {
  var options = this.options;
  const inputPath = path.join(this.inputPaths[0]);
  const outputPath = path.join(this.outputPath, options.name);

  return new Promise((resolve, reject) => {
    var zip = archiver('zip', { store: true });
    var out = fs.createWriteStream(outputPath);
    out.on('close', resolve);
    zip.on('error', reject);
    zip.pipe(out);
    zip.directory(inputPath, '');
    zip.finalize();
  });
};

module.exports = Zip;