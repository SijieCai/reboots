import modifyWebpack from './webpack-add-entry';
import fs from 'fs';
import path from 'path';
import thinkit from 'thinkit';

export default ({entries, projectPath, copyTpl, mkdir, log}) => {
  let webpackPath = path.join(projectPath, 'webpack.config.js');
  modifyWebpack(webpackPath, entries);
  
  let templatePath = (...args)=>path.join('entry', ...args);
  entries.forEach(entry=>{
    let dirEntry = path.join(projectPath, 'src', 'app', entry);
    
    let settings = {
      '<%=name%>': entry
    }
    if(thinkit.isDir(dirEntry)){
      log(colors => {
        return colors.yellow('exist') + ' : entry ' + dirEntry;
      });
      return;
    }

    copyTpl(
      templatePath('home.jsx'),
      path.join(dirEntry, 'home.jsx'),
      settings
    );
    copyTpl(
      templatePath('index.jsx'),
      path.join(dirEntry, 'index.jsx'),
      settings
    );
    copyTpl(
      templatePath('style.css'),
      path.join(dirEntry, 'style.css')
    );
 
    copyTpl(
      templatePath('index.html'),
      path.join(projectPath, 'src', entry + '.html'),
      settings
    );

    //copy come components
    dirEntry = path.join(dirEntry, 'components');

    mkdir(dirEntry);
    ['top-menu', 'left-menu'].forEach(componentName=>{
      let componentEntry =path.join(dirEntry, componentName);
      mkdir(componentEntry);
      copyTpl(
        templatePath(componentName + '.jsx'),
        path.join(componentEntry, 'index.jsx'),
        settings
      );
      copyTpl(
        templatePath(componentName + '.css'),
        path.join(componentEntry, 'style.css'),
        settings
      );
    });
  });
};
