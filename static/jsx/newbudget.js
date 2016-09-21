// main.js
var React = require('react');
var ReactDOM = require('react-dom');
global.jQuery = require('jquery');
require('bootstrap');

var WelcomeScreen = React.createClass({

  getInitialState: function() {
    return {month: 'base', name: '', numChildren: 0, data: {0: {'name': '', 'amount': ''}}};
  },

  addChild: function() {
    var newData = this.state.data;
    newData[this.state.numChildren+1] = {'name': '', 'amount': ''};
    this.setState({data: newData, numChildren: this.state.numChildren+1});
  },

  catChange: function(event) {
    var split = event.target.id.split("_")
    var index = split[1];
    var type = split[0];
    var newData = this.state.data;
    if (type === 'name'){
      newData[index].name = event.target.value;
    } else if (type === 'amount'){
      newData[index].amount = event.target.value;
    }
    this.setState({data: newData});
  },

  deleteChild: function(event) {
    var index = event.target.id.split("_")[1]
    var newData = this.state.data;
    delete newData[index];
    this.setState({data: newData});
  },

  nameChange: function(event) {
    this.setState({name: event.target.value})
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var data = this.state.data;
    data['nChildren'] = this.state.numChildren;
    data['name'] = this.state.name;
    data['month'] = this.state.month;
    console.log(JSON.stringify(data))
   jQuery.ajax({
    url: "/submit_budget",
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json;charset=UTF-8',
    dataType: 'json',
    cache: false,
    success: function(data) {
      window.location = '/main_page'
    }.bind(this),
    error: function(xhr, status, err) {
      console.error("/submit_budget", status, err.toString());
    }.bind(this)
   });
  },

  render: function() {
    return (
    	<div className="container">
  			<div className="row top-buffer">
  				<div className="col-md-4 col-md-offset-4">
            <h2>New Budget</h2>
					</div>
        </div>
        <div className="row top-buffer">
          <div className="col-md-4 col-md-offset-4">
          <form onSubmit={this.handleSubmit} >
            <div className="form-group">
              <label>Budget Name</label>
              <input type="text" className="form-control" id="budgetName" name="budgetName" value={this.state.name}
                onChange={this.nameChange}></input>
            </div>
            <hr></hr>
            <div className="row">
            <div className="col-lg-4">
            <a href="#" className="btn btn-primary bottom-buffer" onClick={this.addChild}>Add Category</a>
            </div>
            <div className="col-lg-4">
            <input className="btn btn-success" type="submit" value="Submit" />
            </div>
            </div>
            <AllCategories data={this.state.data} deleteChild={this.deleteChild} catChange={this.catChange}/>
          </form>
          </div>
        </div>
			</div>
    );
  }
});

var AllCategories = React.createClass({
  render: function() {
    var deleteChild = this.props.deleteChild;
    var catChange = this.props.catChange;
    var categoryNodes = [];
    for (var key in this.props.data){
      categoryNodes.push(<Category key={key} deleteChild={deleteChild} reactKey={key} catChange={catChange}
        data={this.props.data[key]}/>);
    }
    return (
      <div>
        {categoryNodes}
      </div>
    );
  }
});

var Category = React.createClass({
  render: function() {
    return (
      <div>
      <div className="col-lg-6">
      <div className="form-group">
        <label>Category Name</label>
        <input type="text" className="form-control" id={"name_"+this.props.reactKey} value={this.props.data.name} onChange={this.props.catChange} name={"name_"+this.props.reactKey}></input>
      </div>      
      </div>
      <div className="col-lg-5">
      <div className="form-group">
        <label>Amount</label>
        <input type="number" className="form-control" id={"amount_"+this.props.reactKey} value={this.props.data.amount} onChange={this.props.catChange} name={"amount_"+this.props.reactKey}></input>
      </div>      
      </div>
      <div className="col-lg-1">
      <a href="#" className="btn btn-danger btn-sm top-buffer" id={"delete_"+this.props.reactKey} onClick={this.props.deleteChild}>X</a>
      <hr></hr>
      </div>
      </div>
      );
  }
});

ReactDOM.render(
	<WelcomeScreen />,
  document.getElementById('newbudget')
);