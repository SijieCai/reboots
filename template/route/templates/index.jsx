import {AuthRoute} from 'auth';

function chunkLoader(cb) {
  require([
    './home',
    './route-3-1'
  ], cb);
}

export default AuthRoute({
  path: '<%=route.name%>',
  chunkLoader: chunkLoader
});