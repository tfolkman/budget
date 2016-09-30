// main.js
var React = require('react');
var ReactDOM = require('react-dom');
var Select = require('react-select');
var ReactBSTable = require('react-bootstrap-table');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;
global.jQuery = require('jquery');
require('bootstrap');

var MainPage = React.createClass({
  getInitialState: function() {
    return {
      transactions: [], months: [], years: [], monthSelected: '', yearSelected: ''
    };
  },

  componentDidMount: function(){
    this.getDates().done(this.getTransactions);
  },

  getDates: function(){
    return jQuery.get(this.props.uniqueSource, function (result) {
      var monthSelected = result.months[result.months.length - 1];
      var yearSelected = result.years[result.years.length - 1];
      this.setState({
        years: result.years,
        months: result.months,
        monthSelected: monthSelected,
        yearSelected: yearSelected,
      });
    }.bind(this));
  },

  getTransactions: function(){
    console.log(this.state.monthSelected);
    var tranUrl = this.props.transactionSource+"?month="+this.state.monthSelected+"&year="+this.state.yearSelected
    this.serverRequest = jQuery.get(tranUrl, function (result) {
      this.setState({
        transactions: result,
      });
    }.bind(this));
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
    this.serverRequest2.abort();
  },

  monthChange: function(e) {
    console.log("month change " + e.value);
    this.setState({monthSelected: e.value}, this.getTransactions);
  },

  yearChange: function(e) {
    this.setState({yearSelected: e.value}, this.getTransactions);
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
    var transactionNodes = []
    var transactionNodes = this.state.transactions.map(function(transaction) {
      return <TransactionRow data={transaction} key={transaction.ID}/>;
    });
    const cellEditProp = {
        mode: 'click'
    };
    const selectRowProp = {
        mode: "checkbox"
    };
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
    <BootstrapTable data={this.state.transactions} striped={true} hover={true} cellEdit={ cellEditProp } deleteRow={true}
            selectRow={ selectRowProp }>
        <TableHeaderColumn dataField="ID" isKey={true} dataAlign="center" dataSort={true}>ID</TableHeaderColumn>
        <TableHeaderColumn dataField="Account" dataSort={true}>Account</TableHeaderColumn>
        <TableHeaderColumn dataField="Date">Date</TableHeaderColumn>
    </BootstrapTable>
</div>
    );
  }
});

var TransactionRow = React.createClass({

  render: function() {
    return (
    <tr>
        <td>{this.props.data.Account}</td>
        <td>{this.props.data.Date}</td>
        <td>{this.props.data.Payee}</td>
        <td>{this.props.data.Category}</td>
        <td>{this.props.data.Note}</td>
        <td>{this.props.data.Outflow}</td>
        <td>{this.props.data.Inflow}</td>
    </tr>
    );
  }
});

ReactDOM.render(
  <MainPage transactionSource="/get_transactions" uniqueSource="/get_uniques"/>,
    document.getElementById('transactions')
);

