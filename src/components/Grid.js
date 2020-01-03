import React from "react";
import Node from "./Node";
import dijkstra from "../algorithms/dijkstra";
import astar from "../algorithms/astar";
import jumpPointSearch from "../algorithms/jumpPointSearch";
import kruskal from "../mazeGen/kruskall";
import prim from "../mazeGen/Prim";
import Card from "@material-ui/core/Card";
import { withStyles } from "@material-ui/core/styles";

//41 55
const rows = 53;
const columns = 71;
let startNode = { row: 20, column: 11 };
let endNode = { row: 20, column: 43 };
let selectStart = false;
let selectEnd = false;
let selectWall = false;
let isAnimated = false;
let rtAlgoId = 0;
let rtHeuristic = "";
let rtAllowDiag = false;

const GridContainer = withStyles({
  root: {
    width: "100%",
    padding: "1vw",
    marginRight: "1vw"
  }
})(Card);

class TGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: []
    };
    this.nodeRefs = this.getRefs();
    this.gridRef = React.createRef();
    this.isAnimating = false;
  }
  async componentDidMount() {
    await this.setGrid();
    this.gridRef.current.style.height = `${(this.gridRef.current.offsetWidth /
      columns) *
      rows}px`;
    window.addEventListener("resize", e => {
      this.gridRef.current.style.height = `${(this.gridRef.current.offsetWidth /
        columns) *
        rows}px`;
    });
  }
  render() {
    if (this.state.grid.length === 0) return <div>Loading...</div>;
    return (
      <GridContainer>
        <table className="grid" ref={this.gridRef}>
          <tbody>{this.nodes()}</tbody>
        </table>
      </GridContainer>
    );
  }
  nodes = () => {
    let nodes = [];
    for (let i = 0; i < rows; i++) {
      let nodeRow = [];
      for (let j = 0; j < columns; j++)
        nodeRow.push(
          <Node
            key={i.toString() + "-" + j.toString()}
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
        );
      nodes.push(<tr key={i}>{nodeRow}</tr>);
    }
    return nodes;
  };
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
    document.documentElement.style.setProperty("--rows", rows);
    document.documentElement.style.setProperty("--columns", columns);
  };
  onMouseClick = async (row, column) => {
    if (this.isAnimating) return;
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
      if (isAnimated) this.visualizeRealTime(startNode, endNode);
      await this.setGrid(this.state.grid);
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
  visualize = async (algoId, heuristic = "", allowDiag) => {
    this.isAnimating = true;
    rtAlgoId = algoId;
    rtHeuristic = heuristic;
    rtAllowDiag = allowDiag;
    let grid = this.state.grid;
    await this.setGrid(grid);
    this.clearVisited(grid);
    const response = await this.getResponseFromAlgo(
      grid,
      startNode,
      endNode,
      algoId,
      heuristic,
      allowDiag
    );
    console.log(response);
    const { visitedNodes, shortestPath } = response;
    visitedNodes.shift();
    shortestPath.shift();
    shortestPath.pop();
    if (visitedNodes.length === 0 && shortestPath.length === 0) {
      this.isAnimating = false;
      this.setGrid(grid);
      return;
    }
    this.animate(visitedNodes, shortestPath, grid);
  };
  getResponseFromAlgo = (grid, sn, en, algoId, heuristic, allowDiag) => {
    switch (algoId) {
      case 0:
        return dijkstra(grid, sn, en, allowDiag);
      case 1:
        return astar(grid, sn, en, heuristic, allowDiag);
      case 2:
        return jumpPointSearch(grid, sn, en);
      default:
        break;
    }
  };
  animate = (visitedNodes, shortestPath, grid) => {
    let i = 0,
      j = 0;
    const animateVisitedNodes = () => {
      if (i === visitedNodes.length) {
        if (shortestPath.length) requestAnimationFrame(animateShortestPath);
        else {
          isAnimated = true;
          this.isAnimating = false;
          this.setGrid(grid);
        }
        return;
      }
      const { row, col } = visitedNodes[i];
      this.nodeRefs[row][col].current.classList.add("visited-anim");
      ++i;
      requestAnimationFrame(animateVisitedNodes);
    };
    const animateShortestPath = () => {
      if (j === shortestPath.length) {
        isAnimated = true;
        this.isAnimating = false;
        this.setGrid(grid);
        return;
      }
      const { row, col } = shortestPath[j];
      this.nodeRefs[row][col].current.classList.add("shortest-path-anim");
      ++j;
      requestAnimationFrame(animateShortestPath);
    };
    requestAnimationFrame(animateVisitedNodes);
  };

  visualizeRealTime = (sn, en) => {
    let grid = this.state.grid;
    this.clearVisited(grid);
    const { visitedNodes, shortestPath } = this.getResponseFromAlgo(
      grid,
      sn,
      en,
      rtAlgoId,
      rtHeuristic,
      rtAllowDiag
    );
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

  visualizeMaze = async (mazeId, animateMaze) => {
    await this.clearGrid();
    let grid = this.state.grid;
    if (!animateMaze) {
      this.getResponseFromMaze(grid, mazeId);
      await this.setGrid(grid);
    } else {
      this.isAnimating = true;
      await this.setGrid(grid);
      const { addedWalls, removedWalls } = this.getResponseFromMaze(
        grid,
        mazeId
      );
      this.animateMaze(addedWalls, removedWalls, grid);
    }
  };

  getResponseFromMaze = (grid, mazeId) => {
    switch (mazeId) {
      case 0:
        return kruskal(grid, rows, columns);
      case 1:
        return prim(grid, rows, columns);
      default:
        break;
    }
  };

  animateMaze = (addedWalls, removedWalls, grid) => {
    //let i = 0;
    /*const animateAddedWalls = () => {
      if (i === addedWalls.length) {
        if (removedWalls.length) requestAnimationFrame(animateRemovedWalls);
        else {
          isAnimating = false;
          this.setGrid(grid);
        }
        return;
      }
      const { row, col } = addedWalls[i];
      this.nodeRefs[row][col].current.classList.add("wall");
      ++i;
      requestAnimationFrame(animateAddedWalls);
    };*/
    let j = 0;
    const animateRemovedWalls = () => {
      if (j === removedWalls.length) {
        this.isAnimating = false;
        this.setGrid(grid);
        return;
      }
      const { row, col } = removedWalls[j];
      this.nodeRefs[row][col].current.classList.remove("wall");
      ++j;
      requestAnimationFrame(animateRemovedWalls);
    };
    const showAddedWalls = () => {
      addedWalls.forEach(node =>
        this.nodeRefs[node.row][node.col].current.classList.add("wall")
      );
    };
    showAddedWalls();
    requestAnimationFrame(animateRemovedWalls);
  };
}

export default TGrid;
