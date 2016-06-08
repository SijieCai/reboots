import request from 'falcon/components/request';
import Reflux from 'reflux';

let AsyncConfig = {asyncResult: true};
export const <%=model.name%>Actions = Reflux.createActions({
  get<%=model.name%>List: AsyncConfig,
  get<%=model.name%>: AsyncConfig,
  add<%=model.name%>: AsyncConfig,
  edit<%=model.name%>: AsyncConfig,
  delete<%=model.name%>: AsyncConfig
});

export const <%=model.name%>Store = Reflux.createStore({
  listenables: <%=model.name%>Actions,
  onGet<%=model.name%>List() {
    // this.trigger({}, 'get<%=model.name%>ListSuccessful');
    this.trigger('get<%=model.name%>List not implemented', 'get<%=model.name%>ListFailed');
  },

  onGet<%=model.name%>() {
    // this.trigger({}, 'get<%=model.name%>Successful');
    this.trigger('get<%=model.name%> not implemented', 'get<%=model.name%>Failed');
  },

  onEdit<%=model.name%>() {
    // this.trigger({}, 'edit<%=model.name%>Successful');
    this.trigger('edit<%=model.name%> not implemented', 'edit<%=model.name%>Failed');
  },

  onDelete<%=model.name%>() {
    // this.trigger({}, 'delete<%=model.name%>Successful');
    this.trigger('delete<%=model.name%> not implemented', 'delete<%=model.name%>Failed');
  }
});

