// main.js
var React = require('react');
var ReactDOM = require('react-dom');
global.jQuery = require('jquery');
require('bootstrap');
var ReactBSTable = require('react-bootstrap-table');
var Select = require('react-select');
var BootstrapTable = ReactBSTable.BootstrapTable;
var TableHeaderColumn = ReactBSTable.TableHeaderColumn;


var MainPage = React.createClass({
  getInitialState: function() {
    return {
      budgetData: []
    };
  },

  componentDidMount: function(){
    this.getDates().done(this.getTransactions);
  },

  getData: function() {
    this.updateDates().done(this.getTransactions);
  },

  updateDates: function(){
    return jQuery.get(this.props.uniqueSource, function (result) {
      this.setState({
        years: result.years,
        months: result.months,
      });
    }.bind(this));
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
    this.setState({monthSelected: e.value}, this.getData);
  },

  yearChange: function(e) {
    this.setState({yearSelected: e.value}, this.getData);
  },

  render: function() {
    var budgetData = this.state.budgetData;
    return (
    <div>
    <div className="row bottom-buffer">
    <div className="col-lg-2">
    <Select value={monthValue} options={monthOptions} onChange={this.monthChange}></Select>
    </div>
    <div className="col-lg-2">
    <Select value={yearValue} options={yearOptions} onChange={this.yearChange}></Select>
    </div>
    </div>
    <BootstrapTable data={this.state.budgetData} striped={true} hover={true}
            condensed={true} bordered={false} exportCSV={true}>
        <TableHeaderColumn dataField="Category" isKey={true} dataSort={true}>Category</TableHeaderColumn>
        <TableHeaderColumn dataField="Budgeted" dataSort={true}>Budgeted</TableHeaderColumn>
        <TableHeaderColumn dataField="Spent" dataSort={true}>Spent</TableHeaderColumn>
    </BootstrapTable>
</div>
    );
  }
});


ReactDOM.render(
  <MainPage transactionSource="/get_summary" uniqueSource="/get_uniques"/>,
    document.getElementById('main')
);

