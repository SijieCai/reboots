const fs = require('fs');
const path = require('path');

function getRouteConfig(projectPath, entry) {
  let entryPath = path.join(projectPath, '/src/app', entry, 'route.js');
  var obj = JSON.parse(fs.readFileSync('file', 'utf8'));
  return obj;
}

function createRouteArchives(key, entry) {

}

export default ({config, projectPath})=>{
  let entries = config.entries;
  entires.keys.forEach(key=>{
    let entry = entires[key];
    if(entry.type === 'admin') {
      createRouteArchives({key, entry, projectPath})
    }
  });
};