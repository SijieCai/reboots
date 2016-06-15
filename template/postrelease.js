const fs = require('fs');
const webpackConfig = require('./webpack.config.js');
const packageConfig = require('./package.json');

var entry = webpackConfig.entry;

packageConfig.version = packageConfig.version.replace(/(\.)(\d+)$/g, function(a,b,c){return b+(c/1+1)});
var timestamp = (new Date()).getTime();
Object.keys(entry).forEach(key=>{
  var entryFile = entry[key] + '.html';
  fs.readFile(entryFile.replace('/app/', '/'), 'utf8', (err, content)=>{
    if(err) throw err;
    content = content.replace(/"><\/script>/g, `?version=${packageConfig.version}_${timestamp}"></script>`);
    entryFile = entryFile.replace('src/app', 'dist')
    fs.writeFile(entryFile, content, 'utf8', err=>{
      if(err) throw err;
      console.log('write file successful ', entryFile);
    });
  });
});
