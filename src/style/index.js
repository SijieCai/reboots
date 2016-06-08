const fs = require('fs');
const path = require('path');
import webpackSetPostcss from './webpack-set-postcss.js';

function getPackageJson() {
  var obj = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  return obj;
}

function appendIfNotMatch(pattern, textToAppend) {
  var filename = 'webpack.config.js';
  var text = fs.readFileSync(filename, 'utf8');
  if(pattern.test(text)) {
    console.log('matched');
    return;
  }
  text = textToAppend + text;
  fs.writeFileSync(filename, text, 'utf8');
}

export default ({projectPath, style, autoprefixer})=>{
  var config = getPackageJson();
  var postcssNames = [];
  var devDependencies = config.devDependencies;
  if(style === 'sass') {
    devDependencies['node-sass'] = devDependencies['node-sass'] || '^3.4.2';
    devDependencies['sass-loader'] = devDependencies['sass-loader'] || '3.2.0';
  }
  if(style === 'precss') {
    devDependencies.precss = devDependencies.precss || '^1.4.0';
    postcssNames.push('precss');
    appendIfNotMatch(/var precss = require\('precss'\);/g, "var precss = require('precss');");
    
  }
  if(autoprefixer) {
    postcssNames.push('autoprefixer');
    devDependencies.autoprefixer = devDependencies.autoprefixer || '^6.1.2';
    appendIfNotMatch(/var autoprefixer = require\('autoprefixer'\);/g, "var autoprefixer = require('autoprefixer');");
  }
  webpackSetPostcss(postcssNames);
  
  fs.writeFileSync('package.json', JSON.stringify(config, null, 2), 'utf8');
};