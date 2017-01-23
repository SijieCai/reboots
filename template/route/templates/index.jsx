import {RBAuthRoute} from 'rb-component';

function chunkLoader(cb) {
  require([
    './home',
    './route-3-1'
  ], cb);
}

export default RBAuthRoute({
  path: '<%=route.name%>',
  chunkLoader: chunkLoader
});