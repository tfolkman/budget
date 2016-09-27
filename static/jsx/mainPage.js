// main.js
var React = require('react');
var ReactDOM = require('react-dom');
global.jQuery = require('jquery');
require('bootstrap');
import {Table, Column, Cell} from 'fixed-data-table';


const TextCell = ({rowIndex, data, col, props}) => (
  <Cell {...props}>
    {data[rowIndex][col]}
  </Cell>
);

var MainPage = React.createClass({
  getInitialState: function() {
    return {
      budgetData: []
    };
  },

  componentDidMount: function() {
    this.serverRequest = jQuery.get(this.props.budgetSource, function (result) {
      this.setState({
        budgetData: result,
      });
    }.bind(this));
  },

  componentWillUnmount: function() {
    this.serverRequest.abort();
  },

  render: function() {
    var budgetData = this.state.budgetData;
    return (
     <Table
        rowHeight={50}
        headerHeight={50}
        rowsCount={budgetData.length}
        width={jQuery(window).width() * 0.7}
        height={500}
        {...this.props}>
        <Column
          header={<Cell>Category</Cell>}
          cell={<TextCell data={budgetData} col="Category" />}
          fixed={true}
          width={100}
        />
        <Column
          header={<Cell>Budget</Cell>}
          cell={<TextCell data={budgetData} col="Amount" />}
          fixed={true}
          width={100}
        />
        <Column
          header={<Cell>Spent</Cell>}
          cell={<TextCell data={budgetData} col="Spent" />}
          fixed={true}
          width={100}
        />
        <Column
          header={<Cell>Remaining</Cell>}
          cell={<TextCell data={budgetData} col="Remaining" />}
          fixed={true}
          width={100}
        />
     </Table>
    );
  }
});

var BudgetRow = React.createClass({

  render: function() {
    var remaining = (this.props.amount - this.props.spent);
    return (
    <tr>
        <td>{this.props.category}</td>
        <td>{this.props.amount}</td>
        <td>{this.props.spent}</td>
        <td>{remaining.toFixed(2)}</td>
    </tr>
    );
  }
});

ReactDOM.render(
  <MainPage budgetSource="/get_budget" />,
    document.getElementById('main')
);

