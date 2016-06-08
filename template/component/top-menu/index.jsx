import Base from 'base';
import {Link} from 'react-router';
import Autobind from 'autobind-decorator';
import './style.scss';
@Autobind
export default class extends Base {
  static defaultProps = {
    menus: [],
    logo: ''
  }
  componentWillMount() {
  }

  handleClick(e, item) {
    if(item.subMenus && item.subMenus.length > 0){
      e.preventDefault();
      var subMenu = item.subMenus[0];
      this.props.history.pushState(null, subMenu.to || subMenu.menus[0].to);
    }
  }

  render () {
    return (
      <header className="top-menu-component">
        <div className="top-menu__logo">HULK云平台</div>
        <div className="top-menu__content">
          {this.props.menus.map((item, i) =>
            <div key={i} className="top-menu__content__menu">
              <Link activeClassName="active-menu" onClick={e=>this.handleClick(e, item)} to={item.to}>{item.label}</Link>
            </div>
          )}
        </div> 
        <div className="top-menu__right">
        </div>
      </header>
    );
  }
}