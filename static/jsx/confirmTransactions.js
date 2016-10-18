// main.js
var React = require('react');
var ReactDOM = require('react-dom');
var Select = require('react-select');
var Creatable = require('react-select/lib/Creatable.js')
global.jQuery = require('jquery');
require('bootstrap');

var TransactionScreen = React.createClass({

  getInitialState: function() {
    return {data: [], accounts: [], categories: [], account: '', deletes: []};
  },

  componentDidMount: function() {
    this.getUniques().done(this.getData)
  },

  getUniques: function() {
    return jQuery.get(this.props.uniqueSource, function (result) {
      this.setState({
        accounts: result.accounts,
        categories: result.categories,
        account: result.accounts[0]
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

  newAccount: function(e){
    return {label: e.label, labelKey: "account_" + e.label, valueKey: e.label.split(" ")[1]}
  },

  promptText: function(label){
    return "Create " + label + " category";
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
      this.setState({account: value})
    } else if (type === 'category'){
        var data = this.state.data;
        data[index].Category = value;
        this.setState({data: data});
    }
  },

  deleteChild: function(event) {
    var index = event.target.id.split("_")[1]
    var locIndex = event.target.id.split("_")[2]
    console.log(index)
    var newData = this.state.data;
    delete newData[locIndex];
    this.setState({data: newData,
      deletes: this.state.deletes.concat([parseInt(index)])
    });
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var data = {}
    data['data'] = this.state.data;
    data['account'] = this.state.account;
   jQuery.ajax({
    url: "/post_imports",
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json;charset=UTF-8',
    dataType: 'json',
    cache: false,
    success: function(data) {
      window.location = '/main_page'
    }.bind(this),
    error: function(xhr, status, err) {
      console.error("/post_imports", status, err.toString());
    }.bind(this)
   });
   console.log(this.state.deletes)
    jQuery.ajax({
    url: "/delete_transaction",
    type: 'POST',
    data: JSON.stringify(this.state.deletes),
    contentType: 'application/json;charset=UTF-8',
    dataType: 'json',
    cache: false,
    success: function(data) {
        console.log("successfully deleted transaction")
    }.bind(this),
    error: function(xhr, status, err) {
      console.error("/delete_transaction", status, err.toString());
    }.bind(this)
   });
  },

  render: function() {
    var accountValue = {value: this.state.account, label: this.state.account};
    var accountOptions = this.state.accounts.map(function(X) {
      return {value: "account_" + X, label: X};
    });
    return (
    <div>
    <form onSubmit={this.handleSubmit} >
        <div className="row">
            <div className="col-lg-2">
                <input className="btn btn-success" type="submit" value="Submit" />
            </div>
            <div className="col-lg-2">
              <div className="form-group">
                <label>Account</label>
                <Creatable value={accountValue} options={accountOptions}
                  onChange={this.catChange} newOptionCreator={this.newAccount}
                  promptTextCreator={this.promptText}></Creatable>
              </div>
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

  newPayee: function(e){
    return {label: e.label, labelKey: "payee_" + this.props.reactKey, valueKey: e.label.split(" ")[1]}
  },

  promptText: function(label){
    return "Create " + label + " category";
  },

  render: function() {
    var key = this.props.reactKey;
    var categoryValue = {value: this.props.data.Category, label: this.props.data.Category};
    var categoryOptions = this.props.categories.map(function(X) {
      return {value: "category_" + key, label: X};
    });

    return (
    <div>
      <div className="row">
      <div className="col-lg-2">
      <div className="form-group">
        <label>Date</label>
        <input type="date" className="form-control" id={"date_"+this.props.reactKey} value={this.props.data.Date.substring(0,10)} disabled name={"date_"+this.props.reactKey}></input>
      </div>      
      </div>
      <div className="col-lg-2">
      <div className="form-group">
        <label>Payee</label>
        <input type="text" className="form-control" id={"payee_"+this.props.reactKey} value={this.props.data.Payee} disabled name={"payee_"+this.props.reactKey}></input>
      </div>
      </div>
      <div className="col-lg-2">
      <div className="form-group">
        <label>Category</label>
        <Select id={"category_"+this.props.reactKey} value={categoryValue} options={categoryOptions}
          onChange={this.props.catChange} name={"category_"+this.props.reactKey}></Select>
      </div>
      </div>
      <div className="col-lg-2">
      <div className="form-group">
        <label>Outflow</label>
        <input type="number" className="form-control" id={"outflow_"+this.props.reactKey} value={this.props.data.Outflow} disabled name={"outflow_"+this.props.reactKey}></input>
      </div>
      </div>
      <div className="col-lg-2">
      <div className="form-group">
        <label>Inflow</label>
        <input type="number" className="form-control" id={"inflow_"+this.props.reactKey} value={this.props.data.Inflow} disabled name={"inflow_"+this.props.reactKey}></input>
      </div>
      </div>
      <div className="col-lg-1">
      <a href="#" className="btn btn-danger btn-sm top-buffer" id={"delete_"+this.props.data.ID+"_"+this.props.reactKey} onClick={this.props.deleteChild}>X</a>
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