import React from 'react';
global.React = React;
import {render} from 'react-dom';
import {Router} from 'react-router';
import {RBAuthRoute} from 'rb-component';

import { useRouterHistory } from 'react-router';
import { createHistory } from 'history';

const browserHistory = useRouterHistory(createHistory)({
  basename: "/<%=name%>"
});

const rootRoute = RBAuthRoute({
  path: '/',
  chunkLoader(cb) {
    cb(
      require('./home')
    );
  }
});

render(
  <Router history={browserHistory} routes={rootRoute}/>,
  document.getElementById('app')
);
