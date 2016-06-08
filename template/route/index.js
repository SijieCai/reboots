'use strict';
let generator = require('yeoman-generator');
let utils = require('../../utils/all');

module.exports = generator.NamedBase.extend({

  constructor: function() {
    generator.NamedBase.apply(this, arguments);

    // this.option('split', {
    //   desc: 'Create a stateless component instead of a full one',
    //   defaults: false
    // });

    // this.option('base-route', {
    //   desc: 'If you want to create multiple routes with the same base-route, you can set the base here and provide the route name',
    //   default: ''
    // });
  },

  writing: function() {
    const routeSettings = require(this.destinationPath('route.js'));
    Object.keys(routeSettings).forEach(entryName=> {
      console.log(entryName);
    });

    return;
    let settings = utils.yeoman.getAllSettingsFromComponentName(this.name, this.config.get('style'));
    let componentType = this.options.stateless ? 'Stateless' : 'Base';

    // Create the style template
    this.fs.copyTpl(
      this.templatePath(`styles/Component${settings.style.suffix}`),
      this.destinationPath(settings.style.path + settings.style.fileName),
      settings
    );

    // Create the component
    this.fs.copyTpl(
      this.templatePath(`components/${componentType}.js`),
      this.destinationPath(settings.component.path + settings.component.fileName),
      settings
    );

    // Create the unit test
    this.fs.copyTpl(
      this.templatePath('tests/Base.js'),
      this.destinationPath(settings.test.path + settings.test.fileName),
      settings
    );
  }
});
