import {Component} from 'react';
import './style.css';
import LeftMenu from '<%=name%>/components/left-menu';
import TopMenu from '<%=name%>/components/top-menu';

export default class extends Component {
  state = {menus: []};
  render() { 
    return (
      <div className="app-container">
        <TopMenu {...this.props} menus={this.state.menus}/>
        <div className="app__content">
          <div className="main">
            <LeftMenu menuGroups={this.state.subMenus}/>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
};
