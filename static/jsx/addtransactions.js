// main.js
var React = require('react');
var ReactDOM = require('react-dom');
var Select = require('react-select');
var Creatable = require('react-select/lib/Creatable.js')
global.jQuery = require('jquery');
require('bootstrap');

var TransactionScreen = React.createClass({

  getInitialState: function() {
    return {data: [{'account': '', 'date': '', 'payee': '', 'category': '', 'note': '',
      'outflow': 0, 'inflow': 0}], accounts: [], payees: [], categories: []};
  },

  componentDidMount: function() {
    this.serverRequest = jQuery.get(this.props.uniqueSource, function (result) {
      this.setState({
        accounts: result.accounts,
        payees: result.payees,
        categories: result.categories
      });
    }.bind(this));
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  addChild: function() {
    var newData = this.state.data;
    newData.push({'account': '', 'date': '', 'payee': '', 'category': '', 'note': '',
      'outflow': 0, 'inflow': 0});
    this.setState({data: newData});
  },

  catChange: function(event) {
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
      newData[index].account = value;
    } else if (type === 'date'){
      newData[index].date = value + "T00:00:00.00Z";
    } else if (type === 'payee'){
      newData[index].payee = value;
    } else if (type === 'category'){
      newData[index].category = value;
    } else if (type === 'note'){
      newData[index].note = value;
    } else if (type === 'outflow'){
      newData[index].outflow = parseFloat(value);
    } else if (type === 'inflow'){
      newData[index].inflow = parseFloat(value);
    }
    this.setState({data: newData});
  },

  deleteChild: function(event) {
    var index = event.target.id.split("_")[1]
    var newData = this.state.data;
    delete newData.splice(index, 1);
    this.setState({data: newData});
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var data = this.state.data;
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
                <a href="#" className="btn btn-primary bottom-buffer" onClick={this.addChild}>Add Transaction</a>
            </div>
            <div className="col-lg-1">
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
    var key = 0;
    var data = this.props.data;
    var accounts = this.props.accounts;
    var payees = this.props.payees;
    var categories = this.props.categories;
    var transactionNodes = [];
    for (var i = 0; i < data.length; i++) {
      transactionNodes.push(<Transaction key={i} deleteChild={deleteChild} reactKey={i} catChange={catChange}
        data={data[i]} accounts={accounts} payees={payees} categories={categories}/>);
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
    var accountValue = {value: this.props.data.account, label: this.props.data.account};
    var payeeValue = {value: this.props.data.payee, label: this.props.data.payee};
    var categoryValue = {value: this.props.data.category, label: this.props.data.category};
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
        <input type="date" className="form-control" id={"date_"+this.props.reactKey} value={this.props.data.date.substring(0, 10)} onChange={this.props.catChange} name={"date_"+this.props.reactKey}></input>
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
        <input type="text" className="form-control" id={"note_"+this.props.reactKey} value={this.props.data.note} onChange={this.props.catChange} name={"note_"+this.props.reactKey}></input>
      </div>
      </div>
      <div className="col-lg-2">
      <div className="form-group">
        <label>Outflow</label>
        <input type="number" className="form-control" id={"outflow_"+this.props.reactKey} value={this.props.data.outflow} onChange={this.props.catChange} name={"outflow_"+this.props.reactKey}></input>
      </div>
      </div>
      <div className="col-lg-2">
      <div className="form-group">
        <label>Inflow</label>
        <input type="number" className="form-control" id={"inflow_"+this.props.reactKey} value={this.props.data.inflow} onChange={this.props.catChange} name={"inflow_"+this.props.reactKey}></input>
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
	<TransactionScreen uniqueSource="/get_uniques"/>,
  document.getElementById('transactions')
);