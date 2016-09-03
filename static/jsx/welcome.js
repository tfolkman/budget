// main.js
var React = require('react');
var ReactDOM = require('react-dom');
global.jQuery = require('jquery');
require('bootstrap');

var WelcomeScreen = React.createClass({
  render: function() {
    return (
    	<div className="container">
  			<div className="row top-buffer">
  				<div className="col-md-4 col-md-offset-4">
						<a href="/new_budget" className="btn btn-primary">Create New Budget</a>
					</div>
				</div>
      </div>
    );
  }
});

ReactDOM.render(
	<WelcomeScreen />,
  document.getElementById('welcome')
);