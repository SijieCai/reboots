var assert = require('assert');
var path = require('path');
var fs = require('fs');
var muk = require('muk');

var _http = require('../_http.js');

function execMiddleware(middleware, config, options, data){
  think.APP_PATH = path.dirname(__dirname) + think.sep + 'testApp';
  var req = think.extend({}, _http.req);
  var res = think.extend({}, _http.res);
  return think.http(req, res).then(function(http){
    if(config){
      http._config = config;
    }
    if(options){
      for(var key in options){
        http[key] = options[key];
      }
    }
    return think.middleware(middleware, http, data);
  })
}


describe('middleware/parse_template', function(){
  it('base', function(done){
    var filePath = __dirname + think.sep + 'parse_template.js';
    execMiddleware('parse_template', {
      tpl: {
        type: 'base'
      }
    }, {}, {file: filePath, var: {}}).then(function(data){
      assert.equal(data.length > 0, true);
      assert.equal(data.indexOf('describe') > -1, true);
      done();
    })
  })
  it('base, file exist', function(done){
    var filePath = __dirname + think.sep + 'parse_template.js';
    execMiddleware('parse_template', {
      tpl: {
        type: undefined
      }
    }, {}, {file: filePath, var: {}}).then(function(data){
      assert.equal(data.length > 0, true);
      assert.equal(data.indexOf('describe') > -1, true);
      done();
    })
  })
  it('base, file not exist', function(done){
    var filePath = __dirname + think.sep + 'parse_template11111.js';
    execMiddleware('parse_template', {
      tpl: {
        type: undefined
      }
    }, {}, {file: filePath, var: {}}).catch(function(err){
      done();
    })
  })
})