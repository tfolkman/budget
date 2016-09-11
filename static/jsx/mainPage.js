// main.js
var React = require('react');
var ReactDOM = require('react-dom');
global.jQuery = require('jquery');
require('bootstrap');

var MainApp = React.createClass({
  render: function() {
    return (
    	<div className="container">
  			<div className="row top-buffer">
  				<div className="col-md-4 col-md-offset-4">
						<a href="/new_budget" className="btn btn-primary">Welcome to the main page</a>
					</div>
				</div>
      </div>
    );
  }
});

ReactDOM.render(
	<MainApp />,
  document.getElementById('main')
);