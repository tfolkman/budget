// main.js
var React = require('react');
var ReactDOM = require('react-dom');
var Select = require('react-select');
global.jQuery = require('jquery');
require('bootstrap');

var MainPage = React.createClass({
  getInitialState: function() {
    return {
      transactions: [], months: [], years: [], monthSelected: '', yearSelected: ''
    };
  },

  componentDidMount: function() {
    this.serverRequest = jQuery.get(this.props.transactionSource, function (result) {
      this.setState({
        transactions: result,
      });
    }.bind(this));
    this.serverRequest2 = jQuery.get(this.props.uniqueSource, function (result) {
      this.setState({
        years: result.years,
        months: result.months,
        monthSelected: result.months[result.months.length - 1],
        yearSelected: result.years[result.years.length - 1]
      });
    }.bind(this));
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
    this.serverRequest2.abort();
  },

  monthChange: function(e) {
    this.setState({monthSelected: e.value})
  },

  yearChange: function(e) {
    this.setState({yearSelected: e.value})
  },

  render: function() {
    var budgetData = this.state.budgetData;
    var monthValue = {value: this.state.monthSelected, label: this.state.monthSelected};
    var yearValue = {value: this.state.yearSelected, label: this.state.yearSelected};
    var monthOptions = this.state.months.map(function(X) {
      return {value: X, label: X};
    });
    var yearOptions = this.state.years.map(function(X) {
      return {value: X, label: X};
    });
    return (
    <div>
    <div className="row">
    <div className="col-lg-2">
    <Select value={monthValue} options={monthOptions} onChange={this.monthChange}></Select>
    </div>
    <div className="col-lg-2">
    <Select value={yearValue} options={yearOptions} onChange={this.yearChange}></Select>
    </div>
    </div>
    <table id="transactions">
  <tbody>
  <tr>
    <th>Company</th>
    <th>Contact</th>
    <th>Country</th>
  </tr>
  <tr>
    <td>Alfreds Futterkiste</td>
    <td>Maria Anders</td>
    <td>Germany</td>
  </tr>
  <tr>
    <td>Berglunds snabbköp</td>
    <td>Christina Berglund</td>
    <td>Sweden</td>
  </tr>
  <tr>
    <td>Centro comercial Moctezuma</td>
    <td>Francisco Chang</td>
    <td>Mexico</td>
  </tr>
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
  <MainPage transactionSource="/get_budget" uniqueSource="/get_uniques"/>,
    document.getElementById('transactions')
);

