// main.js
var React = require('react');
var ReactDOM = require('react-dom');
global.jQuery = require('jquery');
require('bootstrap');
var Select = require('react-select');

var ImportBudget = React.createClass({

  getInitialState: function() {
    var d = new Date();
    var m = d.getMonth()+1;
    var y = d.getFullYear();
    return {month: m.toString(), year: y.toString(), budgetYears: [], budgetMonths: [], monthSelected: '', yearSelected: '', disabled: true,
        checked: false};
  },

  componentDidMount: function(){
    this.getDates();
  },

  catChange: function(event) {
    console.log(event)
    var id = event.target.id
    var value = event.target.value;
    if (id === 'month'){
        this.setState({month: value});
    } else if (id === 'year'){
        this.setState({year: value});
    }
  },

  getDates: function(){
    return jQuery.get(this.props.uniqueSource, function (result) {
      var monthSelected = result.budget_months[result.budget_months.length - 1];
      var yearSelected = result.budget_years[result.budget_years.length - 1];
      this.setState({
        budgetYears: result.budget_years,
        budgetMonths: result.budget_months,
        monthSelected: monthSelected,
        yearSelected: yearSelected,
      });
    }.bind(this));
  },

  handleClick: function(e){
    var currDisabled = this.state.disabled;
    this.setState({checked: e.target.checked, disabled: !currDisabled});
  },

  handleSubmit: function(e) {
   e.preventDefault();
   var data = {year: this.state.year, month: this.state.month, base: this.state.checked, baseYear: this.state.yearSelected,
    baseMonth: this.state.monthSelected}
    console.log(JSON.stringify(data))
   jQuery.ajax({
    url: "/post_new_budget",
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json;charset=UTF-8',
    dataType: 'json',
    cache: false,
    success: function(data) {
      window.location = '/main_page'
    }.bind(this),
    error: function(xhr, status, err) {
      console.error("/post_new_budget", status, err.toString());
    }.bind(this)
   });
  },

  render: function() {
    var monthValue = {value: this.state.monthSelected, label: this.state.monthSelected};
    var yearValue = {value: this.state.yearSelected, label: this.state.yearSelected};
    var monthOptions = this.state.budgetMonths.map(function(X) {
      return {value: X, label: X};
    });
    var yearOptions = this.state.budgetYears.map(function(X) {
      return {value: X, label: X};
    });
    return (
    <form onSubmit={this.handleSubmit} >
        <div className="row bottom-buffer">
            <div className="col-lg-2">
                <label>Month</label>
                <input type="number" className="form-control" value={this.state.month} onChange={this.catChange} id="month"></input>
            </div>
            <div className="col-lg-2">
                <label>Year</label>
                <input type="number" className="form-control" value={this.state.year} onChange={this.catChange} id="year"></input>
            </div>
        </div>
        <div className="row bottom-buffer">
            <div className="col-lg-6">
                <div className="form-check">
                  <label className="form-check-label">
                    <input className="form-check-input" type="checkbox" value="" checked={this.state.checked}
                        onClick={this.handleClick}></input>
                    Start from previous budget
                  </label>
                </div>
            </div>
        </div>
        <div className="row bottom-buffer">
            <div className="col-lg-2">
                <Select value={monthValue} options={monthOptions} onChange={this.monthChange} disabled={this.state.disabled}></Select>
            </div>
            <div className="col-lg-2">
                <Select value={yearValue} options={yearOptions} onChange={this.yearChange} disabled={this.state.disabled}></Select>
            </div>
        </div>
        <div className="row bottom-buffer">
            <div className="col-lg-2">
                <input className="btn btn-success" type="submit" value="Submit" />
            </div>
        </div>
    </form>
    );
  }
});

ReactDOM.render(
	<ImportBudget uniqueSource="/get_uniques"/>,
  document.getElementById('newbudget')
);