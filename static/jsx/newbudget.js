// main.js
var React = require('react');
var ReactDOM = require('react-dom');
global.jQuery = require('jquery');
require('bootstrap');

var WelcomeScreen = React.createClass({

  getInitialState: function() {
    return {numChildren: 0, data: {0: {'name': '', 'amount': ''}}};
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

  handleSubmit: function(e) {
    e.preventDefault();
    console.log(JSON.stringify(this.state.data))
   jQuery.ajax({
    url: "/submit_budget",
    type: 'POST',
    data: JSON.stringify(this.state.data),
    contentType: 'application/json;charset=UTF-8',
    dataType: 'json',
    cache: false,
    success: function(data) {
        console.log("returned")
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
              <input type="text" className="form-control" id="budgetName" name="budgetName"></input>
            </div>
            <hr></hr>
            <a href="#" className="btn btn-primary bottom-buffer" onClick={this.addChild}>Add Category</a>
            <AllCategories data={this.state.data} deleteChild={this.deleteChild} catChange={this.catChange}/>
            <input type="submit" value="Post" />
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
      <div className="form-group">
        <label>Category Name</label>
        <input type="text" className="form-control" id={"name_"+this.props.reactKey} value={this.props.data.name} onChange={this.props.catChange} name={"name_"+this.props.reactKey}></input>
      </div>      
      <div className="form-group">
        <label>Amount</label>
        <input type="number" className="form-control" id={"amount_"+this.props.reactKey} value={this.props.data.amount} onChange={this.props.catChange} name={"amount_"+this.props.reactKey}></input>
      </div>      
      <a href="#" className="btn btn-danger btn-sm bottom-buffer" id={"delete_"+this.props.reactKey} onClick={this.props.deleteChild}>Delete Category</a>
      <hr></hr>
      </div>
      );
  }
});

ReactDOM.render(
	<WelcomeScreen />,
  document.getElementById('newbudget')
);