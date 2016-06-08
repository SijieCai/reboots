function AuthRoute(config) {
  var {chunkLoader, path} = config;

  var route = {
    path,
    getComponent(location, cb) {
      chunkLoader(entry => cb(null, (entry && entry.default) || entry));
    },
    onEnter(a, b, c) {
      c();
    },
    getChildRoutes(location, cb) {
      chunkLoader((entry, ...files)=> cb(null, files.map(f=>f.default || f)));
    }
  };
  return route;
}

export {AuthRoute};
export default AuthRoute;
