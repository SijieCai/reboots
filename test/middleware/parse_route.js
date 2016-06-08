var assert = require('assert');
var path = require('path');
var fs = require('fs');
var muk = require('muk');

var Index = require('../../lib/index.js');
var instance = new Index();
instance.load();

think.APP_PATH = path.dirname(__dirname) + think.sep + 'testApp';


var _http = require('../_http.js');

function getHttp(config, options){
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
    return http;
  })
}

function execMiddleware(middleware, config, options, data){
  return getHttp(config, options).then(function(http){
    return think.middleware(middleware, http, data).then(function(data){
      return http;
    });
  }) 
}

describe('middleware/parse_route', function(){
  it('route_on not on, parsePathname empty', function(done){
    execMiddleware('parse_route', {}, {
      pathname: ''
    }).then(function(http){
      assert.equal(http.module, 'home');
      assert.equal(http.controller, 'index');
      assert.equal(http.action, 'index');
      done();
    })
  })
  it('route_on not on, has pathname', function(done){
    execMiddleware('parse_route', {}, {
      pathname: 'welefen/suredy'
    }).then(function(http){
      assert.equal(http.module, 'home');
      assert.equal(http.controller, 'welefen');
      assert.equal(http.action, 'suredy');
      done();
    })
  })
  it('route_on not on, has pathname', function(done){
    execMiddleware('parse_route', {}, {
      pathname: 'welefen/suredy/name/test'
    }).then(function(http){
      assert.equal(http.module, 'home');
      assert.equal(http.controller, 'welefen');
      assert.equal(http.action, 'suredy');
      assert.deepEqual(http._get, { test: 'welefen', value: '1111', name: 'test' });
      done();
    })
  })
  it('route_on not on, has pathname, has module', function(done){
    muk(think, 'module', ['test'])
    execMiddleware('parse_route', {}, {
      pathname: 'test/welefen/suredy/name/test'
    }).then(function(http){
      assert.equal(http.module, 'test');
      assert.equal(http.controller, 'welefen');
      assert.equal(http.action, 'suredy');
      assert.deepEqual(http._get, { test: 'welefen', value: '1111', name: 'test' });
      muk.restore();
      done();
    })
  })
  it('route_on not on, has pathname, controller not valid', function(done){
    muk(think, 'reject', function(err){
      return Promise.reject(err);
    })
    muk(think, 'statusAction', function(status, http){
      assert.equal(status, 400);
      assert.equal(http.error.message.indexOf('`test-ww`') > -1, true);
      return think.prevent();
    })
    execMiddleware('parse_route', {}, {
      pathname: 'test-ww/welefen'
    }).catch(function(err){
      muk.restore();
      done();
    })
  })
  it('route_on not on, has pathname, action has -', function(done){
    execMiddleware('parse_route', {}, {
      pathname: 'welefen/welefen-test'
    }).then(function(data){
      muk.restore();
      done();
    })
  })
  it('route_on not on, has pathname, action not valid', function(done){
    muk(think, 'reject', function(err){
      return Promise.reject(err);
    })
    muk(think, 'statusAction', function(status, http){
      assert.equal(status, 400);
      assert.equal(http.error.message.indexOf('`wele$fen-test`') > -1, true);
      return think.prevent();
    })
    execMiddleware('parse_route', {}, {
      pathname: 'welefen/wele$fen-test'
    }).catch(function(err){
      muk.restore();
      done();
    })
  })
  it('route_on on, rules empty', function(done){
    muk(think, 'route', function(){
      return [];
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'welefen/suredy'
    }).then(function(http){
      assert.equal(http.controller, 'welefen');
      assert.equal(http.action, 'suredy');
      muk.restore();
      done();
    })
  })
  it('route_on on, has rules, pathname empty', function(done){
    muk(think, 'route', function(){
      return [
        [/welefen/, 'suredy']
      ];
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: ''
    }).then(function(http){
      assert.equal(http.controller, 'index');
      assert.equal(http.action, 'index');
      muk.restore();
      done();
    })
  })
  it('route_on on, has rules, pathname is /', function(done){
    muk(think, 'route', function(){
      return [
        [/welefen/, 'suredy']
      ];
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: '/'
    }).then(function(http){
      assert.equal(http.controller, 'index');
      assert.equal(http.action, 'index');
      muk.restore();
      done();
    })
  })
  it('route_on on, has rules, not match', function(done){
    muk(think, 'route', function(){
      return [
        [/welefensuredy/, 'home/welefen/suredy?name=welefen_suredy']
      ];
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'welefen/suredy'
    }).then(function(http){
      assert.equal(http.controller, 'welefen');
      assert.equal(http.action, 'suredy');
      assert.deepEqual(http._get, { test: 'welefen', value: '1111' });
      muk.restore();
      done();
    })
  })
  it('route_on on, has rules, match', function(done){
    muk(think, 'module', ['dddd'])
    muk(think, 'route', function(){
      return [
        [/^welefen\/suredy/, 'dddd/welefen/suredy?name=welefen_suredy']
      ];
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'welefen/suredy'
    }).then(function(http){
      assert.equal(http.module, 'dddd');
      assert.equal(http.controller, 'welefen');
      assert.equal(http.action, 'suredy');
      assert.deepEqual(http._get, { test: 'welefen', value: '1111', name: 'welefen_suredy' });
      muk.restore();
      done();
    })
  })
  it('route_on on, has rules, match 2', function(done){
    muk(think, 'module', ['dddd'])
    muk(think, 'route', function(){
      return [
        [/^welefen\/(.*)/, 'dddd/welefen/:1?name=suredy']
      ];
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'welefen/suredy'
    }).then(function(http){
      assert.equal(http.module, 'dddd');
      assert.equal(http.controller, 'welefen');
      assert.equal(http.action, 'suredy');
      assert.deepEqual(http._get, { test: 'welefen', value: '1111', name: 'suredy' });
      muk.restore();
      done();
    })
  })
  it('route_on on, has rules, has query', function(done){
    muk(think, 'module', ['dddd'])
    muk(think, 'route', function(){
      return [
        [/^welefen\/(.*)/, 'dddd/welefen/:1?name=:2']
      ];
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'welefen/suredy'
    }).then(function(http){
      assert.equal(http.module, 'dddd');
      assert.equal(http.controller, 'welefen');
      assert.equal(http.action, 'suredy');
      assert.deepEqual(http._get, { test: 'welefen', value: '1111', name: '' });
      muk.restore();
      done();
    })
  })
  it('route_on on, has rules, has query 2', function(done){
    muk(think, 'module', ['dddd'])
    muk(think, 'route', function(){
      return [
        [/^welefen\/(.*)/, 'dddd/welefen/:1?value=:2']
      ];
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'welefen/suredy'
    }).then(function(http){
      assert.equal(http.module, 'dddd');
      assert.equal(http.controller, 'welefen');
      assert.equal(http.action, 'suredy');
      assert.deepEqual(http._get, { test: 'welefen', value: '1111' });
      muk.restore();
      done();
    })
  })
  it('route_on on, has rules, has query override', function(done){
    muk(think, 'module', ['dddd'])
    muk(think, 'route', function(){
      return [
        [/^welefen\/(.*)/, 'dddd/welefen/:1?value=value']
      ];
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'welefen/suredy'
    }).then(function(http){
      assert.equal(http.module, 'dddd');
      assert.equal(http.controller, 'welefen');
      assert.equal(http.action, 'suredy');
      assert.deepEqual(http._get, { test: 'welefen', value: 'value' });
      muk.restore();
      done();
    })
  })
  it('route_on on, has rules, match 4', function(done){
    muk(think, 'module', ['dddd'])
    muk(think, 'route', function(){
      return [
        [/^welefen/, 'dddd/welefen/suredy']
      ];
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'welefen/name/suredy'
    }).then(function(http){
      assert.equal(http.module, 'dddd');
      assert.equal(http.controller, 'welefen');
      assert.equal(http.action, 'suredy');
      assert.deepEqual(http._get, { test: 'welefen', value: '1111', name: 'suredy' });
      muk.restore();
      done();
    })
  })
  it('route_on on, has rules, match 5', function(done){
    muk(think, 'module', ['dddd'])
    muk(think, 'route', function(){
      return [
        [/^welefen/, '/dddd/welefen/suredy']
      ];
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'welefen/name/suredy'
    }).then(function(http){
      assert.equal(http.module, 'dddd');
      assert.equal(http.controller, 'welefen');
      assert.equal(http.action, 'suredy');
      assert.deepEqual(http._get, { test: 'welefen', value: '1111', name: 'suredy' });
      muk.restore();
      done();
    })
  })
  it('route_on on, has rules, clean pathname', function(done){
    muk(think, 'module', ['dddd'])
    muk(think, 'route', function(){
      return [
        [/^welefen/, '/dddd/welefen/suredy']
      ];
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: '/welefen/name/suredy/'
    }).then(function(http){
      assert.equal(http.module, 'dddd');
      assert.equal(http.controller, 'welefen');
      assert.equal(http.action, 'suredy');
      assert.deepEqual(http._get, { test: 'welefen', value: '1111', name: 'suredy' });
      muk.restore();
      done();
    })
  })
  it('route_on on, has rules, has method, get', function(done){
    muk(think, 'module', ['dddd'])
    muk(think, 'route', function(){
      return [
        [/^welefen/, {
          get: '/dddd/welefen/get',
          post: '/dddd/welefen/post'
        }]
      ];
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'welefen/name/suredy'
    }).then(function(http){
      assert.equal(http.module, 'dddd');
      assert.equal(http.controller, 'welefen');
      assert.equal(http.action, 'get');
      assert.deepEqual(http._get, { test: 'welefen', value: '1111', name: 'suredy' });
      muk.restore();
      done();
    })
  })
  it('route_on on, has rules, has method, get 2', function(done){
    muk(think, 'module', ['dddd'])
    muk(think, 'route', function(){
      return [
        [/^welefen\//, {
          get: '/dddd/welefen/get',
          post: '/dddd/welefen/post'
        }]
      ];
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'welefen/name/suredy'
    }).then(function(http){
      assert.equal(http.module, 'dddd');
      assert.equal(http.controller, 'welefen');
      assert.equal(http.action, 'get');
      assert.deepEqual(http._get, { test: 'welefen', value: '1111', name: 'suredy' });
      muk.restore();
      done();
    })
  })
  it('route_on on, has rules, has method, get 3', function(done){
    muk(think, 'module', ['dddd'])
    muk(think, 'route', function(){
      return [
        [/^welefen\/name\/suredy/, {
          get: '/dddd/welefen/get',
          post: '/dddd/welefen/post'
        }]
      ];
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'welefen/name/suredy'
    }).then(function(http){
      assert.equal(http.module, 'dddd');
      assert.equal(http.controller, 'welefen');
      assert.equal(http.action, 'get');
      assert.deepEqual(http._get, { test: 'welefen', value: '1111' });
      muk.restore();
      done();
    })
  })
  it('route_on on, has rules, has method, get 3', function(done){
    muk(think, 'module', ['dddd'])
    muk(think, 'route', function(){
      return [
        [/^welefen\/name\//, {
          get: '/dddd/welefen/get',
          post: '/dddd/welefen/post'
        }]
      ];
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'welefen/name/suredy'
    }).then(function(http){
      assert.equal(http.module, 'dddd');
      assert.equal(http.controller, 'welefen');
      assert.equal(http.action, 'get');
      assert.deepEqual(http._get, { test: 'welefen', value: '1111' , 'suredy': ''});
      muk.restore();
      done();
    })
  })
  it('route_on on, has rules, has method, post', function(done){
    muk(think, 'module', ['dddd'])
    muk(think, 'route', function(){
      return [
        [/^welefen/, {
          get: '/dddd/welefen/get',
          post: '/dddd/welefen/post'
        }]
      ];
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'welefen/name/suredy',
      method: 'POST'
    }).then(function(http){
      assert.equal(http.module, 'dddd');
      assert.equal(http.controller, 'welefen');
      assert.equal(http.action, 'post');
      assert.deepEqual(http._get, { test: 'welefen', value: '1111', name: 'suredy' });
      muk.restore();
      done();
    })
  })
  it('route_on on, has rules, has method, post, has extra pathname', function(done){
    muk(think, 'module', ['dddd'])
    muk(think, 'route', function(){
      return [
        [/^welefen/, {
          get: '/dddd/welefen/get',
          post: '/dddd/welefen/post'
        }]
      ];
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'welefen/name/suredy/value/2222',
      method: 'POST'
    }).then(function(http){
      assert.equal(http.module, 'dddd');
      assert.equal(http.controller, 'welefen');
      assert.equal(http.action, 'post');
      assert.deepEqual(http._get, { test: 'welefen', value: '2222', name: 'suredy' });
      muk.restore();
      done();
    })
  })
  it('route_on on, has rules, has method, post, has extra pathname, decode', function(done){
    muk(think, 'module', ['dddd'])
    muk(think, 'route', function(){
      return [
        [/^welefen/, {
          get: '/dddd/welefen/get',
          post: '/dddd/welefen/post'
        }]
      ];
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'welefen/name/suredy/value/w%2Fww',
      method: 'POST'
    }).then(function(http){
      assert.equal(http.module, 'dddd');
      assert.equal(http.controller, 'welefen');
      assert.equal(http.action, 'post');
      assert.deepEqual(http._get, { test: 'welefen', value: 'w/ww', name: 'suredy' });
      muk.restore();
      done();
    })
  })
  it('route_on on, has rules, has method, delete', function(done){
    muk(think, 'module', ['welefen']);
    muk(think, 'mode', think.mode_module);
    muk(think, 'route', function(){
      return [
        [/^welefen/, {
          get: '/dddd/welefen/get',
          post: '/dddd/welefen/post'
        }]
      ];
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'welefen/name/suredy',
      method: 'DELETE'
    }).then(function(http){
      assert.equal(http.module, 'welefen');
      assert.equal(http.controller, 'name');
      assert.equal(http.action, 'suredy');
      assert.deepEqual(http._get, { test: 'welefen', value: '1111' });
      muk.restore();
      done();
    })
  })
  it('route_on on, rules is object, has reg', function(done){
    muk(think, 'module', ['admin']);
    muk(think, 'mode', think.mode_module);
    muk(think, 'route', function(){
      return {
        admin: {
          reg: /^admin/,
          children: [
            [/^admin\/welefen\/list/, 'admin/welefen/list/name/suredy']
          ]
        }
      }
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'admin/welefen/list',
    }).then(function(http){
      assert.equal(http.module, 'admin');
      assert.equal(http.controller, 'welefen');
      assert.equal(http.action, 'list');
      assert.deepEqual(http._get, { test: 'welefen', value: '1111', name: 'suredy' });
      muk.restore();
      done();
    })
  })
  it('route_on on, rules is object, has reg 2', function(done){
    muk(think, 'module', ['admin']);
    muk(think, 'mode', think.mode_module);
    muk(think, 'route', function(){
      return {
        admin: {
          reg: /^admin/,
          children: [
            [/^admin\/welefen\/list/, 'welefen/list/name/suredy']
          ]
        }
      }
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'admin/welefen/list',
    }).then(function(http){
      assert.equal(http.module, 'admin');
      assert.equal(http.controller, 'welefen');
      assert.equal(http.action, 'list');
      assert.deepEqual(http._get, { test: 'welefen', value: '1111', name: 'suredy' });
      muk.restore();
      done();
    })
  })
  it('route_on on, rules is object, has reg 2', function(done){
    muk(think, 'module', ['test']);
    muk(think, 'mode', think.mode_module);
    muk(think, 'route', function(){
      return {
        admin: {
          reg: /^adwwwmin/,
          children: [
            [/^admin\/welefen\/list/, 'welefen/list/name/suredy']
          ]
        }
      }
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'admin/welefen/list',
    }).then(function(http){
      assert.equal(http.module, 'home');
      assert.equal(http.controller, 'admin');
      assert.equal(http.action, 'welefen');
      assert.deepEqual(http._get, { test: 'welefen', value: '1111', list: '' });
      muk.restore();
      done();
    })
  })
  it('route_on on, rules is object, no reg', function(done){
    muk(think, 'module', ['admin']);
    muk(think, 'mode', think.mode_module);
    muk(think, 'route', function(){
      return {
        admin: {
          children: [
            [/^admin\/welefen\/list/, 'welefen/list/name/suredy']
          ]
        }
      }
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'admin/welefen/list',
    }).then(function(http){
      assert.equal(http.module, 'admin');
      assert.equal(http.controller, 'welefen');
      assert.equal(http.action, 'list');
      assert.deepEqual(http._get, { test: 'welefen', value: '1111', name: 'suredy' });
      muk.restore();
      done();
    })
  })
  it('route_on on, rules is object, has reg 3, mode_normal', function(done){
    muk(think, 'module', ['admin']);
    muk(think, 'mode', think.mode_normal);
    muk(think, 'route', function(){
      return {
        admin: {
          reg: /^admin/,
          children: [
            [/^admin\/welefen\/list/, 'welefen/list/name/suredy']
          ]
        }
      }
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'admin/welefen/list',
    }).then(function(http){
      assert.equal(http.module, 'home');
      assert.equal(http.controller, 'welefen');
      assert.equal(http.action, 'list');
      assert.deepEqual(http._get, { test: 'welefen', value: '1111', name: 'suredy' });
      muk.restore();
      done();
    })
  })

  it('route_on on, rules is object, has reg 3, action has uppercases', function(done){
    muk(think, 'module', ['admin']);
    muk(think, 'mode', think.mode_normal);
    muk(think, 'route', function(){
      return {
        admin: {
          reg: /^admin/,
          children: [
            [/^admin\/welefen\/list/, 'welefen/LIST/name/suredy']
          ]
        }
      }
    })
    muk(think, 'log', function(callback){
      var data = callback({
        yellow: function(msg){return msg}
      });
      assert.equal(data.indexOf('[WARNING]') > -1, true)
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'admin/welefen/list',
    }).then(function(http){
      assert.equal(http.module, 'home');
      assert.equal(http.controller, 'welefen');
      assert.equal(http.action, 'list');
      assert.deepEqual(http._get, { test: 'welefen', value: '1111', name: 'suredy' });
      muk.restore();
      done();
    })
  })

  it('route_on on, rules is object, no reg, string rule', function(done){
    muk(think, 'module', ['admin']);
    muk(think, 'mode', think.mode_module);
    muk(think, 'route', function(){
      return {
        admin: {
          children: [
            ['admin', 'welefen/list/name/suredy']
          ]
        }
      }
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'admin/',
    }).then(function(http){
      assert.equal(http.module, 'admin');
      assert.equal(http.controller, 'welefen');
      assert.equal(http.action, 'list');
      assert.deepEqual(http._get, { test: 'welefen', value: '1111', name: 'suredy' });
      muk.restore();
      done();
    })
  })
  it('route_on on, rules is object, no reg, string rule, not match', function(done){
    muk(think, 'module', ['admin']);
    muk(think, 'mode', think.mode_module);
    muk(think, 'route', function(){
      return {
        admin: {
          children: [
            ['admin/welefen/list', 'welefen/list/name/suredy']
          ]
        }
      }
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'admin/',
    }).then(function(http){
      assert.equal(http.module, 'admin');
      assert.equal(http.controller, 'index');
      assert.equal(http.action, 'index');
      assert.deepEqual(http._get, { test: 'welefen', value: '1111' });
      muk.restore();
      done();
    })
  })
  it('route_on on, rules is object, no reg, string rule', function(done){
    muk(think, 'module', ['admin']);
    muk(think, 'mode', think.mode_module);
    muk(think, 'route', function(){
      return {
        admin: {
          children: [
            ['admin/:name', 'welefen/list/']
          ]
        }
      }
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'admin/1234',
    }).then(function(http){
      assert.equal(http.module, 'admin');
      assert.equal(http.controller, 'welefen');
      assert.equal(http.action, 'list');
      assert.deepEqual(http._get, { test: 'welefen', value: '1111', name: '1234' });
      muk.restore();
      done();
    })
  })
  it('route_on on, rules is object, no reg, string rule 2', function(done){
    muk(think, 'module', ['admin']);
    muk(think, 'mode', think.mode_module);
    muk(think, 'route', function(){
      return {
        admin: {
          children: [
            ['admin/test', 'welefen/list/']
          ]
        }
      }
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'admin/w1234',
    }).then(function(http){
      assert.equal(http.module, 'admin');
      assert.equal(http.controller, 'w1234');
      assert.equal(http.action, 'index');
      assert.deepEqual(http._get, { test: 'welefen', value: '1111'});
      muk.restore();
      done();
    })
  })
  it('route_on on, rules is object, no reg, string rule 2', function(done){
    muk(think, 'module', ['admin']);
    muk(think, 'mode', think.mode_module);
    muk(think, 'route', function(){
      return {
        admin: {
          children: [
            ['admin/test', 'welefen/list/']
          ]
        }
      }
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'admin/test/name/wwwww',
    }).then(function(http){
      assert.equal(http.module, 'admin');
      assert.equal(http.controller, 'welefen');
      assert.equal(http.action, 'list');
      assert.deepEqual(http._get, { test: 'welefen', value: '1111', 'name': 'wwwww'});
      muk.restore();
      done();
    })
  })
  it('route_on on, rules is object, no reg, has sub controller', function(done){
    muk(think, 'module', ['admin']);
    muk(think, 'mode', think.mode_module);
    muk(thinkData, 'subController', {
      admin: ['welefen/list']
    })
    muk(think, 'route', function(){
      return {
        admin: {
          children: [
            ['admin/test', 'welefen/list/']
          ]
        }
      }
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'admin/test/',
    }).then(function(http){
      assert.equal(http.module, 'admin');
      assert.equal(http.controller, 'welefen/list');
      assert.equal(http.action, 'index');
      muk.restore();
      done();
    })
  })
  it('route_on on, rules is object, no reg, has sub controller 1', function(done){
    muk(think, 'module', ['admin']);
    muk(think, 'mode', think.mode_module);
    muk(thinkData, 'subController', {
      admin: ['welefen/list']
    })
    muk(think, 'route', function(){
      return {
        admin: {
          children: [
            ['admin/test', 'welefen/list/haha']
          ]
        }
      }
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'admin/test/',
    }).then(function(http){
      assert.equal(http.module, 'admin');
      assert.equal(http.controller, 'welefen/list');
      assert.equal(http.action, 'haha');
      muk.restore();
      done();
    })
  })
  it('route_on on, rules is object, no reg, has sub controller 1', function(done){
    muk(think, 'module', ['admin']);
    muk(think, 'mode', think.mode_module);
    muk(thinkData, 'subController', {
      admin: ['welefen/search', 'welefen/list']
    })
    muk(think, 'route', function(){
      return {
        admin: {
          children: [
            ['admin/test', 'welefen/list/haha']
          ]
        }
      }
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'admin/test/',
    }).then(function(http){
      assert.equal(http.module, 'admin');
      assert.equal(http.controller, 'welefen/list');
      assert.equal(http.action, 'haha');
      muk.restore();
      done();
    })
  })
  it('route_on on, rules is object, no reg, has sub controller 2, change module', function(done){
    muk(think, 'module', ['admin', 'blog']);
    muk(think, 'mode', think.mode_module);
    muk(thinkData, 'subController', {
      blog: ['welefen/search', 'welefen/list']
    })
    muk(think, 'route', function(){
      return {
        blog: {
          children: [
            ['admin/test', 'blog/welefen/list/haha']
          ]
        }
      }
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'admin/test/',
    }).then(function(http){
      assert.equal(http.module, 'blog');
      assert.equal(http.controller, 'welefen/list');
      assert.equal(http.action, 'haha');
      muk.restore();
      done();
    })
  })
  it('route_on on, rules is object, no reg, has sub controller 2, mode normal', function(done){
    muk(think, 'module', ['home']);
    muk(think, 'mode', think.mode_normal);
    muk(thinkData, 'subController', {
      home: ['welefen/search', 'welefen/list']
    })
    muk(think, 'route', function(){
      return {
        home: {
          children: [
            ['admin/test', 'welefen/list/haha']
          ]
        }
      }
    })
    execMiddleware('parse_route', {
      route_on: true
    }, {
      pathname: 'admin/test/',
    }).then(function(http){
      assert.equal(http.module, 'home');
      assert.equal(http.controller, 'welefen/list');
      assert.equal(http.action, 'haha');
      muk.restore();
      done();
    })
  })
})