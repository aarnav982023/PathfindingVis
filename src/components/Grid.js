import React from "react";
import Node from "./Node";
import dijkstra from "../algorithms/dijkstra";

const rows = 26;
const columns = 65;
let startNode = { row: 13, column: 16 };
let endNode = { row: 13, column: 45 };
let selectStart = false;
let selectEnd = false;
let isAnimating = false;

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
              isVisited={this.state.grid[i][j].isVisited}
              isShortestPath={this.state.grid[i][j].isShortestPath}
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
        <button onClick={this.visualizeDijkstra} disabled={isAnimating}>
          dijkstra
        </button>
        <table className="grid">
          <tbody>{nodes}</tbody>
        </table>
      </div>
    );
  }
  setGrid = async (grid = this.getInitGrid()) => {
    if (selectEnd) {
      selectEnd = false;
      this.changeGridEndNode(endNode.row, endNode.column);
    }
    if (selectStart) {
      selectStart = false;
      this.changeGridStartNode(startNode.row, startNode.column);
    }
    this.setState({ grid });
  };

  getInitGrid = () => {
    let grid = [];
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < columns; j++) row.push(this.getNode(i, j));
      grid.push(row);
    }
    return grid;
  };

  getNode = (row, col) => {
    return {
      row,
      col,
      isStart: row === startNode.row && col === startNode.column,
      isEnd: row === endNode.row && col === endNode.column,
      isVisited: false,
      isShortestPath: false
    };
  };
  setRowColumnStyle = () => {
    document.documentElement.style.setProperty("--row", rows);
    document.documentElement.style.setProperty("--column", columns);
  };

  onMouseClick = (row, column) => {
    if (isAnimating) return;
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
    if (row === startNode.row && column === startNode.column) {
      document
        .querySelector(`#node-${row}-${column}`)
        .classList.add("start-node");
    }
    let grid = this.state.grid;
    grid[startNode.row][startNode.column].isStart = false;
    startNode = { row, column };
    grid[startNode.row][startNode.column].isStart = true;
    this.setState({ grid });
  };
  changeGridEndNode = (row, column) => {
    if (row === endNode.row && column === endNode.column) {
      document
        .querySelector(`#node-${row}-${column}`)
        .classList.add("end-node");
    }
    let grid = this.state.grid;
    grid[endNode.row][endNode.column].isEnd = false;
    endNode = { row, column };
    grid[endNode.row][endNode.column].isEnd = true;
    this.setState({ grid });
  };

  visualizeDijkstra = async () => {
    isAnimating = true;
    await this.setGrid();
    let grid = this.state.grid;
    const response = dijkstra(grid, startNode, endNode);
    const { visitedNodes, shortestPath } = response;
    visitedNodes.shift();
    shortestPath.shift();
    shortestPath.pop();
    for (let i = 0; i < visitedNodes.length; i++) {
      const { row, col } = visitedNodes[i];
      setTimeout(() => {
        document.querySelector(`#node-${row}-${col}`).classList.add("visited");
        if (i === visitedNodes.length - 1) {
          if (shortestPath.length) this.animateShortestPath(shortestPath, grid);
          else {
            this.setAnimatingFalse();
            this.setState({ grid });
          }
        }
      }, 5 * i);
    }
  };
  animateShortestPath = (shortestPath, grid) => {
    for (let i = 0; i < shortestPath.length; i++) {
      const { row, col } = shortestPath[i];
      setTimeout(async () => {
        document
          .querySelector(`#node-${row}-${col}`)
          .classList.add("shortest-path");
        if (i === shortestPath.length - 1) {
          this.setAnimatingFalse();
          setTimeout(() => this.setState({ grid }), 20 * i);
        }
      }, 20 * i);
    }
  };
  setAnimatingFalse = () => {
    isAnimating = false;
  };
}

export default Grid;
