import Autobind from 'autobind-decorator';
import Base from 'components/base';

import './<%=style.fileName%>';

@Autobind
export default class <%=component.name%> extends Base {
  render() {
    return (
      <div className="<%=style.className%>">
        Component jsx path <%=component.destinationPath%>
        Component style path <%=style.destinationPath%>
      </div>
    );
  }
}

export {<%=component.name%>};
