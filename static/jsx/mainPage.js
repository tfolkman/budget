// main.js
var React = require('react');
var ReactDOM = require('react-dom');
global.jQuery = require('jquery');
require('bootstrap');

var MainPage = React.createClass({
  getInitialState: function() {
    return {
      budgetData: []
    };
  },

  componentDidMount: function() {
    this.serverRequest = jQuery.get(this.props.budgetSource, function (result) {
      this.setState({
        budgetData: result,
      });
    }.bind(this));
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  render: function() {
    var budgets = this.state.budgetData.map(function(b) {
      return (
        <BudgetRow name={b.Name} amount={b.Amount} key={b.ID} />
      );
    });
    return (
      <div className="budgets">
        {budgets}
      </div>
    );
  }
});

var BudgetRow = React.createClass({

  render: function() {
    return (
      <div className="row">
        <div className="col-lg-5">
            {this.props.name}
        </div>
        <div className="col-lg-5">
            {this.props.amount}
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <MainPage budgetSource="/get_budget" />,
    document.getElementById('main')
);

