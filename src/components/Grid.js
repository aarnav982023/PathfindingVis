import React from "react";
import Node from "./Node";
import dijkstra from "../algorithms/dijkstra";

let startNode = { row: 13, column: 16 };
let endNode = { row: 13, column: 45 };
const rows = 27;
const columns = 65;
let selectStart = false;
let selectEnd = false;

class Grid extends React.Component {
  state = {
    grid: []
  };
  componentDidMount() {
    this.setGrid();
  }
  render() {
    if (this.state.grid.length === 0) return <div>Loading...</div>;
    let nodes = [];
    for (let i = 0; i < rows; i++) {
      let nodeRow = [];
      for (let j = 0; j < columns; j++)
        nodeRow.push(
          <td key={i.toString() + "-" + j.toString()}>
            <Node
              row={this.state.grid[i][j].row}
              column={this.state.grid[i][j].col}
              isStart={this.state.grid[i][j].isStart}
              isEnd={this.state.grid[i][j].isEnd}
              onMouseClick={this.onMouseClick}
              onMouseEnterAndLeave={this.onMouseEnterAndLeave}
            />
          </td>
        );
      nodes.push(<tr key={i}>{nodeRow}</tr>);
    }
    this.setRowColumnStyle();
    return (
      <div>
        <button>dijkstra</button>
        <table className="grid">
          <tbody>{nodes}</tbody>
        </table>
      </div>
    );
  }
  setGrid = () => {
    let grid = [];
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < columns; j++) row.push(this.getNode(i, j));
      grid.push(row);
    }
    this.setState({ grid });
  };

  getNode = (row, col) => {
    return {
      row,
      col,
      isStart: row === startNode.row && col === startNode.column,
      isEnd: row === endNode.row && col === endNode.column
    };
  };
  setRowColumnStyle = () => {
    document.documentElement.style.setProperty("--row", rows);
    document.documentElement.style.setProperty("--column", columns);
  };

  onMouseClick = (row, column) => {
    if (selectStart) {
      if (row !== endNode.row || column !== endNode.column) {
        selectStart = false;
        this.changeGridStartNode(row, column);
      }
    } else if (
      row === startNode.row &&
      column === startNode.column &&
      !selectEnd
    ) {
      selectStart = true;
    } else if (selectEnd) {
      if (row !== startNode.row || column !== startNode.column) {
        selectEnd = false;
        this.changeGridEndNode(row, column);
      }
    } else if (
      row === endNode.row &&
      column === endNode.column &&
      !selectStart
    ) {
      selectEnd = true;
    }
  };
  onMouseEnterAndLeave = (row, column) => {
    //Just changing the class in the dom and not in grid itself.
    if (selectStart) {
      if (row !== endNode.row || column !== endNode.column) {
        document
          .querySelector(`#node-${row}-${column}`)
          .classList.toggle("start-node");
      }
    } else if (selectEnd) {
      if (row !== startNode.row || column !== startNode.column) {
        document
          .querySelector(`#node-${row}-${column}`)
          .classList.toggle("end-node");
      }
    }
    //Changing the grid and thus rerendering the dom. Slower than the above
    /*if (selectStart) {
      if (row !== endNode.row || column !== endNode.column) {
        this.changeGridStartNode(row, column);
      }
    } else if (selectEnd) {
      if (row !== startNode.row || column !== startNode.column) {
        this.changeGridEndNode(row, column);
      }
    }*/
  };
  changeGridStartNode = (row, column) => {
    let grid = this.state.grid;
    grid[startNode.row][startNode.column].isStart = false;
    startNode = { row, column };
    grid[startNode.row][startNode.column].isStart = true;
    this.setState({ grid });
  };
  changeGridEndNode = (row, column) => {
    let grid = this.state.grid;
    grid[endNode.row][endNode.column].isEnd = false;
    endNode = { row, column };
    grid[endNode.row][endNode.column].isEnd = true;
    this.setState({ grid });
  };
}

export default Grid;
