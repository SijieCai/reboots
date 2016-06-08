'use strict';

var assert = require('assert');
var path = require('path');
var fs = require('fs');
var muk = require('muk');


var Index = require('../../../lib/index.js');
var instance = new Index();
instance.load();

think.APP_PATH = path.dirname(__dirname) + think.sep + 'testApp';


var Template = think.adapter('template', 'jade');

describe('adapter/template/jade.js', function(){
  it('get instance', function(){
    var instance = new Template();
    assert.equal(think.isFunction(instance.run), true);
  })
  it('run', function(done){
    var instance = new Template();
    muk(think, 'npm', function(){
      return {
        compile: function(content, conf){
          assert.equal(content.indexOf("describe('adapter/template/jade.js'") > -1, true);
          assert.equal(conf.filename, __filename)
          //assert.deepEqual(conf, { filename: __filename })
          return function(data){
            return content;
          }
        }
      }
    })
    instance.run(__filename).then(function(data){
      assert.equal(data.indexOf("describe('adapter/template/jade.js'") > -1, true);
      muk.restore();
      done();
    }).catch(function(err){
      console.log(err.stack)
    })
  })
  it('run, config', function(done){
    var instance = new Template();
    muk(think, 'npm', function(){
      return {
        compile: function(content, conf){
          assert.equal(content.indexOf("describe('adapter/template/jade.js'") > -1, true);
          assert.equal(conf.test, 'haha')
          //assert.deepEqual(conf, { filename: __filename , test: 'haha'})
          return function(data){
            assert.deepEqual(data, {name: 'welefen'})
            return content;
          }
        }
      }
    })
    muk(think, 'log', function(){})
    instance.run(__filename, {
      name: 'welefen'
    }, {
      type: 'jade', 
      options: {
        test: 'haha'
      }
    }).then(function(data){
      assert.equal(data.indexOf("describe('adapter/template/jade.js'") > -1, true);
      muk.restore();
      done();
    })
  })
  it('run, config, cache_compile, no cache data', function(done){
    var instance = new Template();
    muk(think, 'npm', function(){
      return {
        compile: function(content, conf){
          assert.equal(content.indexOf("describe('adapter/template/jade.js'") > -1, true);
          assert.equal(conf.test, 'haha')
          //assert.deepEqual(conf, { filename: __filename , test: 'haha'})
          return function(data){
            assert.deepEqual(data, {name: 'welefen'})
            return content;
          }
        }
      }
    })
    muk(think, 'log', function(){})
    instance.run(__filename, {
      name: 'welefen'
    }, {
      type: 'jade', 
      cache_compile: true,
      options: {
        test: 'haha'
      }
    }).then(function(data){
      assert.equal(data.indexOf("describe('adapter/template/jade.js'") > -1, true);
      muk.restore();
      done();
    })
  })
  it('run, config, cache_compile, has cache data', function(done){
    var instance = new Template();
    muk(think, 'npm', function(){
      return {
        compile: function(content, conf){
          assert.equal(content.indexOf("describe('adapter/template/jade.js'") > -1, true);
          assert.equal(conf.test, 'haha')
          //assert.deepEqual(conf, { filename: __filename , test: 'haha'})
          return function(data){
            assert.deepEqual(data, {name: 'welefen'})
            return content;
          }
        }
      }
    })
    muk(think, 'log', function(){});
    thinkCache(thinkCache.VIEW_CONTENT, __filename + '-compile', function(){return 'cache_content'});
 
    instance.run(__filename, {
      name: 'welefen'
    }, {
      type: 'jade', 
      cache_compile: true,
      options: {
        test: 'haha'
      }
    }).then(function(data){
      assert.equal(data, 'cache_content');
      thinkCache(thinkCache.VIEW_CONTENT, __filename + '-compile', null);
      muk.restore();
      done();
    })
  })
  it('run, config, with prerender', function(done){
    var instance = new Template();
    muk(think, 'npm', function(){
      return {
        compile: function(content, conf){
          assert.equal(content.indexOf("describe('adapter/template/jade.js'") > -1, true);
          assert.equal(conf.test, 'haha')
          //assert.deepEqual(conf, { filename: __filename , test: 'haha'})
          return function(data){
            assert.deepEqual(data, {name: 'welefen'})
            return content;
          }
        }
      }
    })
    var flag = false;
    instance.run(__filename, {
      name: 'welefen'
    }, {
      prerender: function(jade){
        flag = true;
        assert.equal(think.isObject(jade), true);
      },
      type: 'jade', 
      adapter: {
        jade: {
          test: 'haha'
        }
      }
    }).then(function(data){
      assert.equal(data.indexOf("describe('adapter/template/jade.js'") > -1, true);
      muk.restore();
      assert.equal(flag, true);
      done();
    })
  })
})