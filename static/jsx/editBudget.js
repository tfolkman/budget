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
      budgets: [], months: [], years: [], monthSelected: '', yearSelected: ''
    };
  },

  componentDidMount: function(){
    this.getDates().done(this.getBudgets);
  },

  getData: function() {
    this.updateDates().done(this.getBudgets);
  },

  updateDates: function(){
    return jQuery.get(this.props.uniqueSource, function (result) {
      this.setState({
        years: result.budget_years,
        months: result.budget_months,
      });
    }.bind(this));
  },

  getDates: function(){
    return jQuery.get(this.props.uniqueSource, function (result) {
      var monthSelected = result.budget_months[result.budget_months.length - 1];
      var yearSelected = result.budget_years[result.budget_years.length - 1];
      this.setState({
        years: result.budget_years,
        months: result.budget_months,
        monthSelected: monthSelected,
        yearSelected: yearSelected,
      });
    }.bind(this));
  },

  getBudgets: function(){
    console.log(this.state.monthSelected);
    var tranUrl = this.props.budgetSource+"?month="+this.state.monthSelected+"&year="+this.state.yearSelected
    this.serverRequest = jQuery.get(tranUrl, function (result) {
      this.setState({
        budgets: result,
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

  cellEdit: function(row, cellName, cellValue){
   jQuery.ajax({
    url: "/update_budget",
    type: 'POST',
    data: JSON.stringify(row),
    contentType: 'application/json;charset=UTF-8',
    dataType: 'json',
    cache: false,
    success: function(data) {
        console.log("successfully updated budget")
    }.bind(this),
    error: function(xhr, status, err) {
      console.error("/update_budget", status, err.toString());
    }.bind(this)
   });
  },

  deleteRow: function(row){
   jQuery.ajax({
    url: "/delete_budget",
    type: 'POST',
    data: JSON.stringify(row),
    contentType: 'application/json;charset=UTF-8',
    dataType: 'json',
    cache: false,
    success: function(data) {
        console.log("successfully deleted budget")
    }.bind(this),
    error: function(xhr, status, err) {
      console.error("/delete_budget", status, err.toString());
    }.bind(this)
   });
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
    const cellEditProp = {
        mode: 'click',
        afterSaveCell: this.cellEdit
    };
    const optionProp = {
        onDeleteRow: this.deleteRow
    };
    const selectRowProp = {
        mode: "checkbox"
    };
    return (
    <div>
    <div className="row bottom-buffer">
    <div className="col-lg-2">
    <Select value={monthValue} options={monthOptions} onChange={this.monthChange}></Select>
    </div>
    <div className="col-lg-2">
    <Select value={yearValue} options={yearOptions} onChange={this.yearChange}></Select>
    </div>
    <div className="col-lg-2">
    <a href="/new_budget" className="btn btn-primary" role="button">New Month</a>
    </div>
    </div>
    <BootstrapTable data={this.state.budgets} striped={true} hover={true} cellEdit={ cellEditProp } deleteRow={true}
            selectRow={ selectRowProp } condensed={true} bordered={false} exportCSV={true} options={ optionProp }>
        <TableHeaderColumn dataField="ID" isKey={true}>ID</TableHeaderColumn>
        <TableHeaderColumn dataField="Category" dataSort={true}>Category</TableHeaderColumn>
        <TableHeaderColumn dataField="Budgeted" dataSort={true}>Budgeted</TableHeaderColumn>
    </BootstrapTable>
</div>
    );
  }
});

ReactDOM.render(
  <MainPage budgetSource="/get_budget" uniqueSource="/get_uniques"/>,
    document.getElementById('editBudget')
);

