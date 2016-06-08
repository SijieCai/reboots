'use strict';
let generator = require('yeoman-generator');
let utils = require('../../utils/all');

module.exports = generator.NamedBase.extend({

  constructor: function() {
    generator.NamedBase.apply(this, arguments);

    // this.option('stateless', {
    //   desc: 'Create a stateless component instead of a full one',
    //   defaults: false
    // });
  },

  writing: function() {
    var styleSetting = this.config.get('style');
    this.args.forEach(name=>{     
      let settings = utils.yeoman.getAllSettingsFromComponentName(name, styleSetting);
      // let componentType = this.options.stateless ? 'Stateless' : 'Base';

      // Create the style template
      this.fs.copyTpl(
        this.templatePath(`style${settings.style.suffix}`),
        this.destinationPath(settings.style.destinationPath),
        settings
      );

      // Create the component
      this.fs.copyTpl(
        this.templatePath('component.js'),
        this.destinationPath(settings.component.destinationPath),
        settings
      );  
    });
    
  }
});
