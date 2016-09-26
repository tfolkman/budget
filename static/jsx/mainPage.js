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
    var i = 0;
    var budgets = this.state.budgetData.map(function(b) {
      i=i+1
      return (
        <BudgetRow category={b.Category} amount={b.Amount} spent={b.Spent} key={i} />
      );
    });
    return (
    <div className="budgets">
    <table id="categoryTable" className="display" cellSpacing="0" width="100%">
        <thead>
            <tr>
                <th>Category</th>
                <th>Budgeted</th>
                <th>Spent</th>
                <th>Remaining</th>
            </tr>
        </thead>
        <tbody>
            {budgets}
        </tbody>
    </table>
    </div>
    );
  }
});

var BudgetRow = React.createClass({

  render: function() {
    var remaining = (this.props.amount - this.props.spent);
    return (
    <tr>
        <td>{this.props.category}</td>
        <td>{this.props.amount}</td>
        <td>{this.props.spent}</td>
        <td>{remaining.toFixed(2)}</td>
    </tr>
    );
  }
});

ReactDOM.render(
  <MainPage budgetSource="/get_budget" />,
    document.getElementById('main')
);

