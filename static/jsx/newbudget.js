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

  catChange: function(event, index) {
    console.log("cat change");
    console.log(event.target);
    console.log(index);
  },

  deleteChild: function(e) {
    console.log('remove task: ' + e);
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
          <form>
            <div className="form-group">
              <label>Budget Name</label>
              <input type="text" className="form-control" id="budgetName"></input>
            </div>
            <hr></hr>
            <a href="#" className="btn btn-primary bottom-buffer" onClick={this.addChild}>Add Category</a>
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
      <div className="form-group">
        <label>Category Name</label>
        <input type="text" className="form-control" id="categoryname1" onChange={this.props.catChange(this.props.reactKey)} value={this.props.data.name}></input>
      </div>      
      <div className="form-group">
        <label>Amount</label>
        <input type="number" className="form-control" id="amount1"></input>
      </div>      
      <a href="#" className="btn btn-danger btn-sm bottom-buffer" onClick={this.props.deleteChild(this.props.reactKey)}>Delete Category</a>
      <hr></hr>
      </div>
      );
  }
});

ReactDOM.render(
	<WelcomeScreen />,
  document.getElementById('newbudget')
);