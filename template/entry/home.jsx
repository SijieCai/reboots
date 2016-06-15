import {Component} from 'react';
import './style.css';
import LeftMenu from '<%=name%>/components/left-menu';
import TopMenu from '<%=name%>/components/top-menu';
import {RBLayout, RBAlert} from 'rb-component';

export default class extends Component {
  state = {menus: []};
  render() { 
    return (
      <RBLayout>
        <RBAlert/>
        <div className="rb-layout__top">
        <TopMenu {...this.props} menus={this.state.menus}/>
        </div>
        <div className="rb-layout__bottom">
          <div className="rb-layout__bottom__left">
            <LeftMenu menuGroups={this.state.subMenus}/>
          </div>
          <div className="rb-layout__content">
            {this.props.children}
          </div>
        </div>
      </RBLayout>
    );
  }
};