const Plugin = require('broccoli-caching-writer');
const JSZip = require('jszip');
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
  return new Promise((resolve, reject) => {
    const inputPath = path.join(this.inputPaths[0]);
    const outputPath = path.join(this.outputPath, options.name);

    new JSZip()
    .folder(inputPath)
    .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
    .pipe(fs.createWriteStream(outputPath))
    .on('finish', () => { resolve(); })
    .on('error', () => { reject(); });
  });
};

module.exports = Zip;