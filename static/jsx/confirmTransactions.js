// main.js
var React = require('react');
var ReactDOM = require('react-dom');
var Select = require('react-select');
var Creatable = require('react-select/lib/Creatable.js')
global.jQuery = require('jquery');
require('bootstrap');

var TransactionScreen = React.createClass({

  getInitialState: function() {
    return {data: [], accounts: [], payees: [], categories: []};
  },

  componentDidMount: function() {
    this.getUniques().done(this.getData)
  },

  getUniques: function() {
    return jQuery.get(this.props.uniqueSource, function (result) {
      this.setState({
        accounts: result.accounts,
        payees: result.payees,
        categories: result.categories
      });
    }.bind(this));
  },

  getData: function() {
    this.serverRequest2 = jQuery.get(this.props.dataSource, function (result) {
      this.setState({
        data: result
      });
    }.bind(this));
  },

  componentWillUnmount: function() {
    this.serverRequest2.abort();
  },

  catChange: function(event) {
    console.log(event)
    console.log(event.target)
    if (typeof event.labelKey != "undefined"){
      var split = event.labelKey.split("_")
      var value = event.valueKey;
    } else if (typeof event.target == 'undefined') {
      var split = event.value.split("_")
      var value = event.label
    } else {
      var split = event.target.id.split("_")
      var value = event.target.value;
    }
    var index = split[1];
    var type = split[0];
    var newData = this.state.data;
    if (type === 'account'){
      console.log("account!!")
      console.log(value)
      newData[index].account = value;
    } else if (type === 'date'){
      newData[index].date = value;
    } else if (type === 'payee'){
      newData[index].payee = value;
    } else if (type === 'category'){
      newData[index].category = value;
    } else if (type === 'note'){
      newData[index].note = value;
    } else if (type === 'outflow'){
      newData[index].outflow = value;
    } else if (type === 'inflow'){
      newData[index].inflow = value;
    }
    this.setState({data: newData});
  },

  deleteChild: function(event) {
    var index = event.target.id.split("_")[1]
    var newData = this.state.data;
    delete newData[index];
    this.setState({data: newData});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var data = this.state.data;
    data['nChildren'] = this.state.numChildren;
   jQuery.ajax({
    url: "/post_transactions",
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json;charset=UTF-8',
    dataType: 'json',
    cache: false,
    success: function(data) {
      window.location = '/main_page'
    }.bind(this),
    error: function(xhr, status, err) {
      console.error("/post_transactions", status, err.toString());
    }.bind(this)
   });
  },

  render: function() {
    return (
    <div>
    <form onSubmit={this.handleSubmit} >
        <div className="row">
            <div className="col-lg-2">
                <input className="btn btn-success" type="submit" value="Submit" />
            </div>
        </div>
        <AllTransactions data={this.state.data} deleteChild={this.deleteChild} catChange={this.catChange}
          accounts={this.state.accounts} payees={this.state.payees} categories={this.state.categories}/>
    </form>
    </div>
    );
  }
});

var AllTransactions = React.createClass({
  render: function() {
    var deleteChild = this.props.deleteChild;
    var catChange = this.props.catChange;
    var transactionNodes = [];
    for (var key in this.props.data){
      transactionNodes.push(<Transaction key={key} deleteChild={deleteChild} reactKey={key} catChange={catChange}
        data={this.props.data[key]} accounts={this.props.accounts} payees={this.props.payees} categories={this.props.categories}/>);
    }
    return (
      <div>
        {transactionNodes}
      </div>
    );
  }
});

var Transaction = React.createClass({


  newAccount: function(e){
    return {label: e.label, labelKey: "account_" + this.props.reactKey, valueKey: e.label.split(" ")[1]}
  },

  newPayee: function(e){
    return {label: e.label, labelKey: "payee_" + this.props.reactKey, valueKey: e.label.split(" ")[1]}
  },

  promptText: function(label){
    return "Create " + label + " category";
  },

  render: function() {
    var key = this.props.reactKey;
    var accountValue = {value: this.props.data.Account, label: this.props.data.Account};
    var payeeValue = {value: this.props.data.Payee, label: this.props.data.Payee};
    var categoryValue = {value: this.props.data.Category, label: this.props.data.Category};
    var accountOptions = this.props.accounts.map(function(X) {
      return {value: "account_" + key, label: X};
    });
    var payeeOptions = this.props.payees.map(function(X) {
      return {value: "payee_" + key, label: X};
    });
    var categoryOptions = this.props.categories.map(function(X) {
      return {value: "category_" + key, label: X};
    });

    return (
    <div>
      <div className="row">
      <div className="col-lg-2">
      <div className="form-group">
        <label>Account</label>
        <Creatable id={"account_"+this.props.reactKey} value={accountValue} options={accountOptions}
          onChange={this.props.catChange} name={"account_"+this.props.reactKey} newOptionCreator={this.newAccount}
          promptTextCreator={this.promptText}></Creatable>
      </div>      
      </div>
      <div className="col-lg-2">
      <div className="form-group">
        <label>Date</label>
        <input type="date" className="form-control" id={"date_"+this.props.reactKey} value={this.props.data.Date.substring(0,10)} onChange={this.props.catChange} name={"date_"+this.props.reactKey}></input>
      </div>      
      </div>
      <div className="col-lg-2">
      <div className="form-group">
        <label>Payee</label>
        <Creatable id={"payee_"+this.props.reactKey} value={payeeValue} options={payeeOptions}
          onChange={this.props.catChange} name={"payee_"+this.props.reactKey} newOptionCreator={this.newPayee}
          promptTextCreator={this.promptText}></Creatable>
      </div>
      </div>
      <div className="col-lg-2">
      <div className="form-group">
        <label>Category</label>
        <Select id={"category_"+this.props.reactKey} value={categoryValue} options={categoryOptions}
          onChange={this.props.catChange} name={"category_"+this.props.reactKey}></Select>
      </div>
      </div>
      </div>
      <div className="row">
      <div className="col-lg-2">
      <div className="form-group">
        <label>Note</label>
        <input type="text" className="form-control" id={"note_"+this.props.reactKey} value={this.props.data.Note} onChange={this.props.catChange} name={"note_"+this.props.reactKey}></input>
      </div>
      </div>
      <div className="col-lg-2">
      <div className="form-group">
        <label>Outflow</label>
        <input type="number" className="form-control" id={"outflow_"+this.props.reactKey} value={this.props.data.Outflow} onChange={this.props.catChange} name={"outflow_"+this.props.reactKey}></input>
      </div>
      </div>
      <div className="col-lg-2">
      <div className="form-group">
        <label>Inflow</label>
        <input type="number" className="form-control" id={"inflow_"+this.props.reactKey} value={this.props.data.Inflow} onChange={this.props.catChange} name={"inflow_"+this.props.reactKey}></input>
      </div>
      </div>
      <div className="col-lg-1">
      <a href="#" className="btn btn-danger btn-sm top-buffer" id={"delete_"+this.props.reactKey} onClick={this.props.deleteChild}>X</a>
      </div>
      </div>
      <hr></hr>
      </div>
      );
  }
});

ReactDOM.render(
	<TransactionScreen uniqueSource="/get_uniques" dataSource="/get_import_data" />,
  document.getElementById('transactions')
);