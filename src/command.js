// reboots command

import fs from 'fs';
import path from 'path';
import commander from 'commander';
import thinkit from 'thinkit';
import createEntries from './entry';
import createRoutes from './route';
import useStyle from './style';
import colors from 'colors/safe';
global.think = Object.create(thinkit);

let {sep} = path;
let cwd = process.cwd();
let templatePath = path.join(__dirname, '../template');
let projectRootPath = cwd; //project root path


/**
 * log
 * @param  {Function} fn []
 * @return {}      []
 */
let log = fn => {
  console.log(fn(colors)); 
};

/**
 * mkdir
 * @param  {String} dir []
 * @return {}     []
 */
let mkdir = dir => {
  if(think.isDir(dir)){
    return;
  }
  think.mkdir(dir);
  log(colors => {
    return colors.cyan('create') + ' : ' + path.relative(cwd, dir);
  });
};

/**
 * get version
 * @return {String} []
 */
let getVersion = () => {
  let filepath = path.resolve(__dirname, '../package.json');
  let version = JSON.parse(fs.readFileSync(filepath)).version;
  return version;
};

/**
 * copy file
 * @param  {String} source []
 * @param  {String} target []
 * @return {}        []
 */
let copyFile = (source, target, replace, showWarning) => {
  source = path.join(templatePath, source);

  if(showWarning === undefined){
    showWarning = true;
  }

  if(think.isBoolean(replace)){
    showWarning = replace;
    replace = '';
  }

  //if target file is exist, ignore it
  if(think.isFile(target)){
    if(showWarning){
      log(colors => {
        return colors.yellow('exist') + ' : ' + path.normalize(target);
      });
    }
    return;
  }

  mkdir(path.dirname(target));

  let es = commander.es || commander.es6;

  //if source file is not exist
  if(!think.isFile(source)){
    return;
  }

  let content = fs.readFileSync(source, 'utf8');
  //replace content 
  if(think.isObject(replace)){
    for(let key in replace){
      /*eslint-disable no-constant-condition*/
      while(1){ 
        let content1 = content.replace(key, replace[key]);
        if(content1 === content){
          content = content1;
          break;
        }
        content = content1;
      }
    }
  }
  fs.writeFileSync(target, content);
  log(colors => {
    return colors.cyan('create') + ' : ' + path.relative(cwd, target);
  });
};

let isRebootsApp = projectPath => {
  if(think.isDir(projectPath)){
    if(think.isFile(path.join(projectPath, '.rebootsrc'))){
      return true;
    }
  }
  return false;
};

let getAppConfig = () => {
  let _checkEnv = () => {
    if(!isRebootsApp('./')){
      console.log();
      log(colors => {
        return colors.red('current path is not reboots project.\n');
      });
      process.exit();
    }
    console.log();
  };
  _checkEnv();
  let content = fs.readFileSync(path.join(projectRootPath, '.rebootsrc'), 'utf8');
  let data = JSON.parse(content);
  return data;
};

let getSecret = length => {
  length = length || 8;
  let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ~!@#$%^&*()`1234567890';
  let arr = str.split('').sort(() => {
    return Math.random() >= 0.5 ? 1 : -1;
  }).slice(0, length);
  return arr.join('');
};

const createProject = ({projectPath, projectName, style, force}) => {
  if(!force && isRebootsApp(projectPath)){
    console.log();
    log(colors => {
      return colors.red('path `' + projectPath + '` is already a reboots project.\n');
    });
    return;
  }
  console.log();

  mkdir(projectPath);

  let getDateTime = () => {
    let fn = d => {
      return ('0' + d).slice(-2);
    };
    let d = new Date();
    let date = d.getFullYear() + '-' + fn(d.getMonth() + 1) + '-' + fn(d.getDate());
    let time = fn(d.getHours()) + ':' + fn(d.getMinutes()) + ':' + fn(d.getSeconds());
    return date + ' ' + time;
  };
  

  copyFile('babelrc', path.join(projectPath, '.babelrc'));
  copyFile('eslintrc', path.join(projectPath, '.eslintrc'));
  copyFile('gitignore', path.join(projectPath, '.gitignore'));
  copyFile('package.json', path.join(projectPath, 'package.json'), {
    '<%=projectName%>': projectName
  });
  copyFile('README.md', path.join(projectPath, 'README.md'));

  copyFile('rebootsrc.json', path.join(projectPath, '.rebootsrc'), {
    '<%=createAt%>': getDateTime(),
    '<%=style%>': style
  });
  copyFile('webpack.config.js', path.join(projectPath, 'webpack.config.js'));
  copyFile('webpack.config.production.js', path.join(projectPath, 'webpack.config.production.js'));

  copyFile('auth-route.js', path.join(projectPath, 'src/app/components/auth-route/index.js'));

  mkdir(path.join(projectPath, '/src'));
  mkdir(path.join(projectPath, '/src/images'));
  mkdir(path.join(projectPath, '/src/style'));
  // mkdir(path.join(projectPath, '/src/vendors'));
  // copyFile('vendors/react-with-addons.min.js', path.join(projectPath, '/src/vendors/react-with-addons.min.js'));
  // copyFile('vendors/react-router.min.js', path.join(projectPath, '/src/vendors/react-router.min.js'));

  console.log();
  console.log('  enter path:');
  console.log('  $ cd ' + projectRootPath.slice(cwd.length + 1));
  console.log();

  console.log('  install dependencies:');
  console.log('  $ npm install');
  console.log();

  console.log('  run the app:');
  console.log('  $ npm start');

  console.log();
};

 
/**
 * display reboots version
 * @return {} []
 */
let displayVersion = () => {
  let version = getVersion();
  let chars = [
'         | |               | |      ',
' _ __ ___| |__   ___   ___ | |_ ___ ',
'| \'__/ _ \ \'_ \\ / _ \\ / _ \\| __/ __|',
'| | |  __/ |_) | (_) | (_) | |_\\__ \\',
'|_|  \\___|_.__/ \\___/ \\___/ \\__|___/'                            
].join('\n');
  console.log('\n v' + version + '\n');
  console.log(chars);
};


commander.usage('[command] <options ...>');
commander.option('-v, --version', 'output the version number', () => {
  displayVersion();
});
commander.option('-f, --force', 'force create, use in `new`');

commander.option('-a --autoprefixer', 'use autoprefixer, use in `style`')
//create project
commander.command('new <projectPath> [otherArgs...]').description('create project').action((projectPath, otherArgs) => {
  let style = commander.style || 'css';
  let force = commander.force;
  let projectName = projectPath;
  projectPath = path.resolve(projectRootPath, projectPath);
  if(otherArgs && otherArgs.length > 0) {
    projectName = otherArgs[0];
  }
  createProject({projectPath, projectName, style, force});
});

//create entries
commander.command('entry <name> [names...]').description('add module').action((entry, entries) => {
  var config = getAppConfig();

  entries = [entry, ...entries];
  createEntries({entries, projectPath: cwd, copyTpl: copyFile, mkdir, log});
});

//create routes
commander.command('route').description('create route based on setting').action(()=> {
  var config = getAppConfig();
  createRoutes({config, projectPath: cwd});
});

commander.command('style <style>').description('use sass, need npm install').action(style=>{
  
  var styleList = ['precss', 'sass', 'less', 'stylus'];
  if(styleList.indexOf(style) === -1){
    console.log('style value must one of ' + styleList.join(', '));
    process.exit();
  }
  useStyle({style, projectPath: cwd, autoprefixer: commander.autoprefixer});
});

commander.parse(process.argv);  