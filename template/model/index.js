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
    this.args.forEach((name)=>{
      var settings = utils.yeoman.getAllSettingsFromComponentName(name);

      this.fs.copyTpl(
        this.templatePath('model.js'),
        this.destinationPath(settings.model.destinationPath),
        settings
      );
    });
    
  }
});
