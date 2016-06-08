import React from 'react';
import {Link} from 'react-router';
export default class App extends React.Component {
  render() {
    return (
      <div>
        <ul>
          <li><Link to={'route/route-3/route-3-1'}>go to route-3-1</Link></li>
        </ul>
        <div style={{ paddingLeft: 20 }}>
          {this.props.children}
        </div>
      </div>
    );
  }
};