'use strict';

var assert = require('assert');
var path = require('path');


for(var filepath in require.cache){
  delete require.cache[filepath];
}
var Index = require('../../../lib/index.js');
var instance = new Index();
instance.load();

think.APP_PATH = path.dirname(path.dirname(__dirname)) + think.sep + 'testApp';

describe('adapter/cache/file.js', function() {
  var instance;
  var FileCache;

  before(function() {

    FileCache = think.adapter('cache', 'file');
    instance = new FileCache(think.config('cache'));
  });

  it('new file cache instance', function() {
    assert.equal(instance.gcType, instance.path);
    assert.equal(instance.file_ext, '.json');
    assert.equal(instance.path_depth, 2);
  });

  it('new  instance', function() {
    var instance = new FileCache({
      path: 'www'
    });
    assert.equal(instance.path_depth, 2);
  });

  it('get file path', function() {
    var filepath = instance.getFilepath('maxzhang');
    assert.equal(filepath, 'c' + think.sep + 'b' + think.sep + 'cbc21016fc89ec482594a22e03e02834.json');
    filepath = instance.getFilepath('Max Zhang');
    assert.equal(filepath, '5' + think.sep + 'e' + think.sep + '5e98a6842702de206202d9ddd0a6bbc2.json');
  });

  it('get empty data', function(done) {
    instance.get('thinkjs').then(function(data) {
      assert.equal(data, undefined);
      done();
    });
  });
  it('get data, file not exist', function(done) {
    var instance = new FileCache({
      path: 'www'
    });
    instance.store.get = function(){
      return Promise.reject();
    }
    instance.get('thinkjs').then(function(data) {
      assert.equal(data, undefined);
      done();
    });
  });
  it('get data, not json', function(done) {
    var instance = new FileCache({
      path: 'www'
    });
    instance.store.get = function(){
      return Promise.resolve('not json');
    }
    var flag = false;
    instance.store.delete = function(){
      flag = true;
    }
    instance.get('thinkjs').then(function(data) {
      assert.equal(data, undefined);
      assert.equal(flag, true)
      done();
    });
  });

  it('set data, store error', function(done) {
    var instance = new FileCache({
      path: 'www'
    });
    instance.store.set = function(path, data){
      return Promise.reject();
    }
    instance.set('thinkjs', 'test').then(function(data) {
      assert.equal(data, undefined);
      done();
    });
  });

  it('delete data, store error', function(done) {
    var instance = new FileCache({
      path: 'www'
    });
    instance.store.delete = function(path, data){
      return Promise.reject();
    }
    instance.delete('thinkjs').then(function(data) {
      assert.equal(data, undefined);
      done();
    });
  });

  it('set cache data', function(done) {
    instance.set('thinkjs', 'maxzhang').then(function() {
      return instance.get('thinkjs');
    }).then(function(data){
      assert.equal(data, 'maxzhang');
      done();
    })
  });
  it('set cache data, object', function(done) {
    instance.set('thinkjs', {name: 'maxzhang'}).then(function() {
      return instance.get('thinkjs');
    }).then(function(data){
      assert.deepEqual(data, {name: 'maxzhang'});
      done();
    })
  });

  it('set cache data(object)', function(done) {
    instance.set({ 'thinkjs': 'maxzhang1' }).then(function() {
      return instance.get('thinkjs');
    }).then(function(data){
      assert.equal(data, 'maxzhang1');
      done();
    })
  });

  it('set object data', function(done) {
    instance.set('thinkjs1', { a: 1, b: 2 }).then(function() {
      instance.get('thinkjs1').then(function(data) {
        assert.deepEqual(data, { a: 1, b: 2 });
        done();
      });
    });
  });

  it('remove cache data', function(done) {
    instance.delete('thinkjs1').then(function() {
      instance.get('thinkjs1').then(function(data) {
        assert.equal(data, undefined);
        done();
      });
    });
  });

  it('set data with expire', function(done) {
    instance.set('thinkjs2', 'maxzhang', 0.1).then(function() {
      instance.get('thinkjs2').then(function(value) {
        assert.equal(value, 'maxzhang');
        done();
      });
    });
  });

  it('get expired data', function(done) {
    instance.set('thinkjs2', 'maxzhang', 0.01).then(function() {
      setTimeout(function() {
        instance.get('thinkjs2').then(function(value) {
          assert.equal(value, undefined);
          done();
        });
      }, 15);
    });
  });

  it('run cache gc', function(done) {
    instance.set('thinkjs2', 'maxzhang', 0.01).then(function() {
      setTimeout(function() {
        instance.gc();
        instance.get('thinkjs2').then(function(value) {
          assert.equal(value, undefined);
          done();
        });
      }, 15);
    });
  });
  it('run cache gc, not json', function(done) {
    instance.store.list = function(){
      require('fs').writeFileSync(instance.path + '/a.json');
      return Promise.resolve(['a.json']);
    }
    instance.gc();
    setTimeout(function(){
      assert.equal(think.isFile(instance.path + '/a.json'), false)
      done();
    }, 10)
  });

  it('custom data timeout', function(done) {
    var instance = new FileCache(think.extend({}, think.config('cache'), { timeout: 0.01 }));
    instance.set('thinkjs3', 'maxzhang', 10).then(function() {
      setTimeout(function() {
        instance.gc();
        instance.get('thinkjs3').then(function(value) {
          assert.equal(value, 'maxzhang');
          done();
        });
      }, 15);
    });
  });

  it('delete files', function(done){
    think.rmdir(instance.path).then(done);
  })

});