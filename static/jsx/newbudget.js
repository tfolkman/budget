// main.js
var React = require('react');
var ReactDOM = require('react-dom');
global.jQuery = require('jquery');
require('bootstrap');

var WelcomeScreen = React.createClass({

  getInitialState: function() {
    return {numChildren: 1, data: [{'n':1}]};
  },

  addChild: function() {
    var newData = this.state.data;
    newData.push({'n': this.state.numChildren+1})
    this.setState({data: newData, numChildren: this.state.numChildren+1});
  },

  deleteChild: function(e) {
    console.log('remove task');
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
            <AllCategories data={this.state.data} deleteChild={this.deleteChild}/>
          </form>
          </div>
        </div>
			</div>
    );
  }
});

var AllCategories = React.createClass({
  render: function() {
    var categoryNodes = this.props.data.map(function(category) {
      return (
          <Category key={category.n} delete={this.props.data}/>
      );
    });
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
      <div key={this.props.key}>
      <div className="form-group">
        <label>Category Name</label>
        <input type="text" className="form-control" id="categoryname1"></input>
      </div>      
      <div className="form-group">
        <label>Amount</label>
        <input type="number" className="form-control" id="amount1"></input>
      </div>      
      <a href="#" className="btn btn-danger btn-sm bottom-buffer" onClick={this.props.delete}>Delete Category</a>
      <hr></hr>
      </div>
      );
  }
});

ReactDOM.render(
	<WelcomeScreen />,
  document.getElementById('newbudget')
);