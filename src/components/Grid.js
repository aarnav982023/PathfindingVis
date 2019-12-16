import React from "react";
import Node from "./Node";
import dijkstra from "../algorithms/dijkstra";
import "./Grid.css";

const rows = 34;
const columns = 85;
let startNode = { row: 16, column: 15 };
let endNode = { row: 16, column: 63 };
let selectStart = false;
let selectEnd = false;
let selectWall = false;
let isAnimating = false;
let isAnimated = false;

class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: []
    };
    this.nodeRefs = this.getRefs();
  }
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
              isWall={this.state.grid[i][j].isWall}
              isShortestPath={this.state.grid[i][j].isShortestPath}
              onMouseClick={this.onMouseClick}
              onMouseEnterAndLeave={this.onMouseEnterAndLeave}
              ref={this.nodeRefs[i][j]}
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
        <button onClick={this.clearGrid} disabled={isAnimating}>
          reset
        </button>
        <div className="grid-container">
          <table className="grid">
            <tbody>{nodes}</tbody>
          </table>
        </div>
      </div>
    );
  }
  setGrid = async (grid = this.getInitGrid()) => {
    if (selectEnd) {
      selectEnd = false;
      this.changeGridEndNode(endNode.row, endNode.column, grid);
    }
    if (selectStart) {
      selectStart = false;
      this.changeGridStartNode(startNode.row, startNode.column, grid);
    }
    if (selectWall) {
      selectWall = false;
      await this.setState({});
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
      isShortestPath: false,
      isWall: false
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
    } else if (selectWall) {
      selectWall = false;
      this.setState({});
    } else {
      selectWall = true;
      this.nodeRefs[row][column].current.classList.add("wall");
      let grid = this.state.grid;
      grid[row][column].isWall = true;
    }
  };
  onMouseEnterAndLeave = (row, column) => {
    //Just changing the class using refs.
    if (selectStart) {
      if (row !== endNode.row || column !== endNode.column) {
        this.nodeRefs[row][column].current.classList.toggle("start-node");
        if (isAnimated) this.visualizeRealTime({ row, column }, endNode);
      }
    } else if (selectEnd) {
      if (row !== startNode.row || column !== startNode.column) {
        this.nodeRefs[row][column].current.classList.toggle("end-node");
        if (isAnimated) this.visualizeRealTime(startNode, { row, column });
      }
    } else if (selectWall) {
      if (
        (row !== endNode.row || column !== endNode.column) &&
        (row !== startNode.row || column !== startNode.column)
      ) {
        this.nodeRefs[row][column].current.classList.add("wall");
        let grid = this.state.grid;
        grid[row][column].isWall = true;
      }
    }
  };
  getRefs = () => {
    let refs = [];
    for (let i = 0; i < rows; i++) {
      let rowRef = [];
      for (let j = 0; j < columns; j++) rowRef.push(React.createRef());
      refs.push(rowRef);
    }
    return refs;
  };
  changeGridStartNode = (row, column, grid = this.state.grid) => {
    grid[startNode.row][startNode.column].isStart = false;
    startNode = { row, column };
    grid[startNode.row][startNode.column].isStart = true;
    this.nodeRefs[row][column].current.classList.add("start-node");
    this.setGrid(grid);
  };
  changeGridEndNode = (row, column, grid = this.state.grid) => {
    grid[endNode.row][endNode.column].isEnd = false;
    endNode = { row, column };
    grid[endNode.row][endNode.column].isEnd = true;
    this.nodeRefs[row][column].current.classList.add("end-node");
    this.setGrid(grid);
  };
  clearVisited = grid => {
    grid.forEach(row =>
      row.forEach(node => {
        node.isShortestPath = false;
        node.isVisited = false;
        this.nodeRefs[node.row][node.col].current.classList.remove("visited");
        this.nodeRefs[node.row][node.col].current.classList.remove(
          "shortest-path"
        );
        this.nodeRefs[node.row][node.col].current.classList.remove(
          "visited-anim"
        );
        this.nodeRefs[node.row][node.col].current.classList.remove(
          "shortest-path-anim"
        );
      })
    );
  };
  clearGrid = () => {
    isAnimated = false;
    this.setGrid();
  };
  visualizeDijkstra = async () => {
    isAnimating = true;
    let grid = this.state.grid;
    await this.setGrid(grid);
    this.clearVisited(grid);
    const response = dijkstra(grid, startNode, endNode);
    const { visitedNodes, shortestPath } = response;
    this.animate(visitedNodes, shortestPath, grid);
  };
  animate = (visitedNodes, shortestPath, grid) => {
    visitedNodes.shift();
    shortestPath.shift();
    shortestPath.pop();
    if (visitedNodes.length === 0) {
      this.setAnimatingFalse();
      this.setGrid(grid);
      return;
    }
    for (let i = 0; i < visitedNodes.length; i++) {
      const { row, col } = visitedNodes[i];
      setTimeout(() => {
        this.nodeRefs[row][col].current.classList.add("visited-anim");
        if (i === visitedNodes.length - 1) {
          if (shortestPath.length) this.animateShortestPath(shortestPath, grid);
          else {
            this.setAnimatingFalse();
            this.setGrid(grid);
          }
        }
      }, 6 * i);
    }
    isAnimated = true;
  };
  animateShortestPath = (shortestPath, grid) => {
    for (let i = 0; i < shortestPath.length; i++) {
      const { row, col } = shortestPath[i];
      setTimeout(() => {
        this.nodeRefs[row][col].current.classList.add("shortest-path-anim");
        if (i === shortestPath.length - 1) {
          this.setAnimatingFalse();
          setTimeout(() => this.setGrid(grid), 5 * i);
        }
      }, 20 * i);
    }
  };
  setAnimatingFalse = () => {
    isAnimating = false;
  };

  visualizeRealTime = (startNode, endNode) => {
    let grid = this.state.grid;
    this.clearVisited(grid);
    const { visitedNodes, shortestPath } = dijkstra(grid, startNode, endNode);
    visitedNodes.shift();
    shortestPath.shift();
    shortestPath.pop();
    visitedNodes.forEach(node =>
      this.nodeRefs[node.row][node.col].current.classList.add("visited")
    );
    shortestPath.forEach(node =>
      this.nodeRefs[node.row][node.col].current.classList.add("shortest-path")
    );
  };
}

export default Grid;
