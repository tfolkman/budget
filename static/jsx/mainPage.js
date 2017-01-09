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
      budgetData: [], monthSelected: '', yearSelected: '', years: [], months: []
    };
  },

  componentDidMount: function(){
    this.getDates().done(this.getTransactions);
  },

  getData: function() {
    this.updateDates().done(this.getTransactions);
  },

  sortNumber: function(a, b){
    return parseInt(b) - parseInt(a);
  },

  updateDates: function(){
    return jQuery.get(this.props.uniqueSource, function (result) {
      this.setState({
        years: result.budget_years.sort(this.sortNumber),
        months: result.budget_months.sort(this.sortNumber),
      });
    }.bind(this));
  },

  getDates: function(){
    return jQuery.get(this.props.uniqueSource, function (result) {
      this.setState({
        years: result.budget_years.sort(this.sortNumber),
        months: result.budget_months.sort(this.sortNumber),
        monthSelected: result.max_budget_month,
        yearSelected: result.max_budget_year,
      });
    }.bind(this));
  },

  getTransactions: function(){
    console.log(this.state.monthSelected);
    console.log(this.state.yearSelected);
    var tranUrl = this.props.transactionSource+"?month="+this.state.monthSelected+"&year="+this.state.yearSelected
    console.log(tranUrl)
    this.serverRequest = jQuery.get(tranUrl, function (result) {
      if (result != null){
        this.setState({
          budgetData: result,
        });
      }
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
        <TableHeaderColumn dataField="Remaining" dataSort={true}>Remaining</TableHeaderColumn>
    </BootstrapTable>
</div>
    );
  }
});


ReactDOM.render(
  <MainPage transactionSource="/get_summary" uniqueSource="/get_uniques"/>,
    document.getElementById('main')
);

