// main.js
var React = require('react');
var ReactDOM = require('react-dom');
global.jQuery = require('jquery');
require('bootstrap');

var TransactionScreen = React.createClass({

  getInitialState: function() {
    return {numChildren: 0, data: {0: {'account': '', 'date': '', 'payee': '', 'category': '', 'note': '',
      'outflow': '', 'inflow': ''}}};
  },

  addChild: function() {
    var newData = this.state.data;
    newData[this.state.numChildren+1] = {'account': '', 'date': '', 'payee': '', 'category': '', 'note': '',
      'outflow': '', 'inflow': ''};
    this.setState({data: newData, numChildren: this.state.numChildren+1});
  },

  catChange: function(event) {
    console.log(event.target)
    var split = event.target.id.split("_")
    var index = split[1];
    var type = split[0];
    var newData = this.state.data;
    if (type === 'account'){
      newData[index].account = event.target.value;
    } else if (type === 'date'){
      newData[index].date = event.target.value;
    } else if (type === 'payee'){
      newData[index].payee = event.target.value;
    } else if (type === 'category'){
      newData[index].category = event.target.value;
    } else if (type === 'note'){
      newData[index].note = event.target.value;
    } else if (type === 'outflow'){
      newData[index].outflow = event.target.value;
    } else if (type === 'inflow'){
      newData[index].inflow = event.target.value;
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
                <a href="#" className="btn btn-primary bottom-buffer" onClick={this.addChild}>Add Transaction</a>
            </div>
            <div className="col-lg-1">
                <input className="btn btn-success" type="submit" value="Submit" />
            </div>
        </div>
        <AllTransactions data={this.state.data} deleteChild={this.deleteChild} catChange={this.catChange}/>
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
        data={this.props.data[key]}/>);
    }
    return (
      <div>
        {transactionNodes}
      </div>
    );
  }
});

var Transaction = React.createClass({
  render: function() {
    return (
    <div>
      <div className="row">
      <div className="col-lg-2">
      <div className="form-group">
        <label>Account</label>
        <input type="text" className="form-control" id={"account_"+this.props.reactKey} value={this.props.data.account} onChange={this.props.catChange} name={"account_"+this.props.reactKey}></input>
      </div>      
      </div>
      <div className="col-lg-2">
      <div className="form-group">
        <label>Date</label>
        <input type="date" className="form-control" id={"date_"+this.props.reactKey} value={this.props.data.date} onChange={this.props.catChange} name={"date_"+this.props.reactKey}></input>
      </div>      
      </div>
      <div className="col-lg-2">
      <div className="form-group">
        <label>Payee</label>
        <input type="text" className="form-control" id={"payee_"+this.props.reactKey} value={this.props.data.payee} onChange={this.props.catChange} name={"payee_"+this.props.reactKey}></input>
      </div>
      </div>
      <div className="col-lg-2">
      <div className="form-group">
        <label>Category</label>
        <input type="text" className="form-control" id={"category_"+this.props.reactKey} value={this.props.data.category} onChange={this.props.catChange} name={"category_"+this.props.reactKey}></input>
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
	<TransactionScreen />,
  document.getElementById('transactions')
);