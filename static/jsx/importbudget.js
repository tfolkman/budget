// main.js
var React = require('react');
var ReactDOM = require('react-dom');
global.jQuery = require('jquery');
require('bootstrap');

var ImportBudget = React.createClass({

  getInitialState: function() {
    return {name: ''};
  },

  nameChange: function(event) {
    this.setState({name: event.target.value})
  },

  handleSubmit: function(e) {
    e.preventDefault();
   jQuery.ajax({
    url: "/import_budget_post",
    type: 'POST',
    data: JSON.stringify(this.state),
    contentType: 'application/json;charset=UTF-8',
    dataType: 'json',
    cache: false,
    success: function(data) {
      window.location = '/main_page'
    }.bind(this),
    error: function(xhr, status, err) {
      console.error("/import_budget", status, err.toString());
    }.bind(this)
   });
  },

  render: function() {
    return (
    	<div className="container">
  			<div className="row top-buffer">
  				<div className="col-md-4 col-md-offset-4">
            <h2>Import Budget</h2>
					</div>
        </div>
        <div className="row top-buffer">
          <div className="col-md-4 col-md-offset-4">
          <form onSubmit={this.handleSubmit} >
            <div className="form-group">
              <label>Database Name</label>
              <input type="text" className="form-control" id="budgetName" name="budgetName" value={this.state.name}
                onChange={this.nameChange}></input>
            </div>
            <input className="btn btn-success" type="submit" value="Submit" />
          </form>
          </div>
        </div>
        </div>
    );
  }
});

ReactDOM.render(
	<ImportBudget />,
  document.getElementById('importbudget')
);