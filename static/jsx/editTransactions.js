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
      this.setState({
        years: result.years,
        months: result.months,
        monthSelected: result.max_trans_month,
        yearSelected: result.max_trans_year,
      });
    }.bind(this));
  },

  getTransactions: function(){
    console.log(this.state.monthSelected);
    var tranUrl = this.props.transactionSource+"?month="+this.state.monthSelected+"&year="+this.state.yearSelected
    this.serverRequest = jQuery.get(tranUrl, function (result) {
      if (result != null){
        this.setState({
          transactions: result,
        });
      }
    }.bind(this));
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
    this.serverRequest2.abort();
  },

  monthChange: function(e) {
    console.log("month change " + e.value);
    this.setState({monthSelected: e.value}, this.getData);
  },

  yearChange: function(e) {
    this.setState({yearSelected: e.value}, this.getData);
  },

  dateFormat: function(cell, row){
    console.log(cell)
    try {
        return cell.substring(0, 10);
    } catch (e) {
        return cell;
    }
  },

  cellEdit: function(row, cellName, cellValue){
   row["inflow"] = parseFloat(row.inflow);
   row["outflow"] = parseFloat(row.outflow);
   jQuery.ajax({
    url: "/update_transaction",
    type: 'POST',
    data: JSON.stringify(row),
    contentType: 'application/json;charset=UTF-8',
    dataType: 'json',
    cache: false,
    success: function(data) {
        console.log("successfully updated transaction")
    }.bind(this),
    error: function(xhr, status, err) {
      console.error("/update_transaction", status, err.toString());
    }.bind(this)
   });
  },

  deleteRow: function(row){
    console.log(row)
   jQuery.ajax({
    url: "/delete_transaction",
    type: 'POST',
    data: JSON.stringify(row),
    contentType: 'application/json;charset=UTF-8',
    dataType: 'json',
    cache: false,
    success: function(data) {
        console.log("successfully deleted transaction")
    }.bind(this),
    error: function(xhr, status, err) {
      console.error("/update_transaction", status, err.toString());
    }.bind(this)
   });
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
    </div>
    <BootstrapTable data={this.state.transactions} striped={true} hover={true} cellEdit={ cellEditProp } deleteRow={true}
            selectRow={ selectRowProp } condensed={true} bordered={false} exportCSV={true} options={ optionProp }>
        <TableHeaderColumn dataField="ID" isKey={true}>ID</TableHeaderColumn>
        <TableHeaderColumn dataField="account" dataSort={true}>Account</TableHeaderColumn>
        <TableHeaderColumn dataField="date" dataSort={true} dataFormat={this.dateFormat}>Date</TableHeaderColumn>
        <TableHeaderColumn dataField="payee" dataSort={true}>Payee</TableHeaderColumn>
        <TableHeaderColumn dataField="category" dataSort={true}>Category</TableHeaderColumn>
        <TableHeaderColumn dataField="note">Note</TableHeaderColumn>
        <TableHeaderColumn dataField="outflow" dataSort={true}>Outflow</TableHeaderColumn>
        <TableHeaderColumn dataField="inflow" dataSort={true}>Inflow</TableHeaderColumn>
    </BootstrapTable>
</div>
    );
  }
});

ReactDOM.render(
  <MainPage transactionSource="/get_transactions" uniqueSource="/get_uniques"/>,
    document.getElementById('transactions')
);

