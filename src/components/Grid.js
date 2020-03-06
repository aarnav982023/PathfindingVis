import React from "react";
import Node from "./Node";
import dijkstra from "../algorithms/dijkstra";
import astar from "../algorithms/astar";
import jumpPointSearch from "../algorithms/jumpPointSearch";
import kruskal from "../mazeGen/kruskall";
import recursiveDivision from "../mazeGen/recursiveDivison";
import prim from "../mazeGen/Prim";
import Card from "@material-ui/core/Card";
import { withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { setAnimating, setVisited, setShortest } from "../actions";

let startNode = { row: 20, column: 4 };
let endNode = { row: 20, column: 27 };
let selectStart = false;
let selectEnd = false;
let selectWall = false;
let selectRemoveWall = false;
let isAnimated = false;

const startNodeClass = "start-node";
const endNodeClass = "end-node";
const wallClass = "wall";

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
  }
  async componentDidMount() {
    await this.setGrid();
    this.gridRef.current.style.height = `${(this.gridRef.current.offsetWidth /
      this.props.columns) *
      this.props.rows}px`;
    window.addEventListener("resize", e => {
      this.gridRef.current.style.height = `${(this.gridRef.current.offsetWidth /
        this.props.columns) *
        this.props.rows}px`;
    });
  }

  render() {
    if (isAnimated) {
      const response = this.visualizeRealTime(startNode, endNode);
      this.props.setVisited(response.visitedNodes.length);
      this.props.setShortest(response.shortestPath.length);
    }
    if (this.state.grid.length === 0) return <div>Loading...</div>;
    return (
      <GridContainer ref={this.gridRef}>
        <table className="grid">
          <tbody>{this.nodes()}</tbody>
        </table>
      </GridContainer>
    );
  }

  nodes = () => {
    let nodes = [];
    for (let i = 0; i < this.props.rows; i++) {
      let nodeRow = [];
      for (let j = 0; j < this.props.columns; j++)
        nodeRow.push(
          <Node
            key={i.toString() + "-" + j.toString()}
            startNodeClass={startNodeClass}
            endNodeClass={endNodeClass}
            wallClass={wallClass}
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
    for (let i = 0; i < this.props.rows; i++) {
      let row = [];
      for (let j = 0; j < this.props.columns; j++) row.push(this.getNode(i, j));
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
  onMouseClick = async (row, column) => {
    if (this.props.anim) return;
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
      if (this.state.grid[row][column].isWall)
        this.nodeRefs[row][column].current.classList.add(wallClass);
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
      if (this.state.grid[row][column].isWall)
        this.nodeRefs[row][column].current.classList.add(wallClass);
    } else if (selectWall) {
      selectWall = false;
      await this.setGrid(this.state.grid);
    } else if (this.state.grid[row][column].isWall) {
      selectRemoveWall = true;
      this.nodeRefs[row][column].current.classList.remove(wallClass);
      let grid = this.state.grid;
      grid[row][column].isWall = false;
      if (isAnimated) this.visualizeRealTime(startNode, endNode);
    } else if (selectRemoveWall) {
      selectRemoveWall = false;
      await this.setGrid(this.state.grid);
    } else {
      selectWall = true;
      this.nodeRefs[row][column].current.classList.add(wallClass);
      let grid = this.state.grid;
      grid[row][column].isWall = true;
      if (isAnimated) this.visualizeRealTime(startNode, endNode);
    }
  };
  onMouseEnterAndLeave = (row, column) => {
    //Just changing the class using refs.
    if (selectStart) {
      if (row !== endNode.row || column !== endNode.column) {
        this.nodeRefs[row][column].current.classList.toggle(startNodeClass);
        if (isAnimated) this.visualizeRealTime({ row, column }, endNode);
      }
    } else if (selectEnd) {
      if (row !== startNode.row || column !== startNode.column) {
        this.nodeRefs[row][column].current.classList.toggle(endNodeClass);
        if (isAnimated) this.visualizeRealTime(startNode, { row, column });
      }
    } else if (selectWall) {
      if (
        (row !== endNode.row || column !== endNode.column) &&
        (row !== startNode.row || column !== startNode.column)
      ) {
        this.nodeRefs[row][column].current.classList.add(wallClass);
        let grid = this.state.grid;
        grid[row][column].isWall = true;
        if (isAnimated) this.visualizeRealTime(startNode, endNode);
      }
    } else if (selectRemoveWall) {
      if (
        (row !== endNode.row || column !== endNode.column) &&
        (row !== startNode.row || column !== startNode.column)
      ) {
        this.nodeRefs[row][column].current.classList.remove(wallClass);
        let grid = this.state.grid;
        grid[row][column].isWall = false;
        if (isAnimated) this.visualizeRealTime(startNode, endNode);
      }
    }
  };
  getRefs = () => {
    let refs = [];
    for (let i = 0; i < this.props.rows; i++) {
      let rowRef = [];
      for (let j = 0; j < this.props.columns; j++)
        rowRef.push(React.createRef());
      refs.push(rowRef);
    }
    return refs;
  };
  changeGridStartNode = (row, column, grid = this.state.grid) => {
    grid[startNode.row][startNode.column].isStart = false;
    startNode = { row, column };
    grid[startNode.row][startNode.column].isStart = true;
    this.nodeRefs[row][column].current.classList.add(startNodeClass);
    this.setGrid(grid);
  };
  changeGridEndNode = (row, column, grid = this.state.grid) => {
    grid[endNode.row][endNode.column].isEnd = false;
    endNode = { row, column };
    grid[endNode.row][endNode.column].isEnd = true;
    this.nodeRefs[row][column].current.classList.add(endNodeClass);
    this.setGrid(grid);
  };
  clearVisited = grid => {
    this.props.setVisited(0);
    this.props.setShortest(0);
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
    this.props.setVisited(0);
    this.props.setShortest(0);
    this.setGrid();
  };
  visualize = async () => {
    this.props.setAnimating(true);
    let grid = this.state.grid;
    await this.setGrid(grid);
    this.clearVisited(grid);
    const response = await this.getResponseFromAlgo(grid, startNode, endNode);
    const { visitedNodes, shortestPath } = response;
    visitedNodes.shift();
    shortestPath.shift();
    shortestPath.pop();
    if (visitedNodes.length === 0 && shortestPath.length === 0) {
      this.props.setAnimating(false);
      this.setGrid(grid);
      return;
    }
    this.animate(visitedNodes, shortestPath, grid);
  };
  getResponseFromAlgo = (grid, sn, en) => {
    let response;
    switch (this.props.algo) {
      case 0:
        response = dijkstra(grid, sn, en, this.props.diag);
        break;
      case 1:
        response = astar(
          grid,
          sn,
          en,
          this.props.heuristic[1],
          this.props.diag
        );
        break;
      case 2:
        response = jumpPointSearch(grid, sn, en);
        break;
      default:
        break;
    }
    return response;
  };
  animate = async (visitedNodes, shortestPath, grid) => {
    let i = 0,
      j = 0;
    const animateVisitedNodes = async () => {
      if (i === visitedNodes.length) {
        if (shortestPath.length) requestAnimationFrame(animateShortestPath);
        else {
          isAnimated = true;
          this.props.setAnimating(false);
          this.setGrid(grid);
        }
        return;
      }
      const { row, col } = visitedNodes[i];
      this.nodeRefs[row][col].current.classList.add("visited-anim");
      ++i;
      this.props.setVisited(i);
      requestAnimationFrame(animateVisitedNodes);
    };
    const animateShortestPath = () => {
      if (j === shortestPath.length) {
        isAnimated = true;
        this.props.setAnimating(false);
        this.setGrid(grid);
        return;
      }
      const { row, col } = shortestPath[j];
      this.nodeRefs[row][col].current.classList.add("shortest-path-anim");
      ++j;
      this.props.setShortest(j);
      requestAnimationFrame(animateShortestPath);
    };
    await requestAnimationFrame(animateVisitedNodes);
  };

  visualizeRealTime = (sn, en) => {
    let grid = this.state.grid;
    this.clearVisited(grid);
    const { visitedNodes, shortestPath } = this.getResponseFromAlgo(
      grid,
      sn,
      en
    );
    this.props.setVisited(visitedNodes.length);
    this.props.setShortest(shortestPath.length);
    visitedNodes.shift();
    shortestPath.shift();
    shortestPath.pop();
    visitedNodes.forEach(node => {
      this.nodeRefs[node.row][node.col].current.classList.add("visited");
    });
    shortestPath.forEach(node => {
      this.nodeRefs[node.row][node.col].current.classList.add("shortest-path");
    });
    return { visitedNodes, shortestPath };
  };

  visualizeMaze = async () => {
    await this.clearGrid();
    let grid = this.state.grid;
    if (!this.props.animMaze) {
      this.getResponseFromMaze(grid, this.props.maze);
      await this.setGrid(grid);
    } else {
      this.props.setAnimating(true);
      await this.setGrid(grid);
      const {
        addedWalls,
        removedWalls,
        animAddedWalls
      } = this.getResponseFromMaze(grid);
      this.animateMaze(addedWalls, removedWalls, grid, animAddedWalls);
    }
  };

  getResponseFromMaze = grid => {
    switch (this.props.maze) {
      case 0:
        return kruskal(grid, this.props.rows, this.props.columns);
      case 1:
        return prim(grid, this.props.rows, this.props.columns);
      case 2:
        return recursiveDivision(grid, this.props.rows, this.props.columns);
      default:
        break;
    }
  };

  animateMaze = (addedWalls, removedWalls, grid, animAddedWalls) => {
    let i = 0;
    const animateAddedWalls = () => {
      if (i === addedWalls.length) {
        if (removedWalls.length) requestAnimationFrame(animateRemovedWalls);
        else {
          this.props.setAnimating(false);
          this.setGrid(grid);
        }
        return;
      }
      const { row, col } = addedWalls[i];
      this.nodeRefs[row][col].current.classList.add(wallClass);
      ++i;
      requestAnimationFrame(animateAddedWalls);
    };
    let j = 0;
    const animateRemovedWalls = () => {
      if (j === removedWalls.length) {
        this.props.setAnimating(false);
        this.setGrid(grid);
        return;
      }
      const { row, col } = removedWalls[j];
      this.nodeRefs[row][col].current.classList.remove(wallClass);
      ++j;
      requestAnimationFrame(animateRemovedWalls);
    };
    const showAddedWalls = () => {
      addedWalls.forEach(node =>
        this.nodeRefs[node.row][node.col].current.classList.add(wallClass)
      );
    };
    if (animAddedWalls) {
      requestAnimationFrame(animateAddedWalls);
    } else {
      showAddedWalls();
      requestAnimationFrame(animateRemovedWalls);
    }
  };
}

const mapStateToProps = state => {
  return {
    algo: state.algo,
    diag: state.diag,
    heuristic: state.heuristic,
    maze: state.maze,
    animMaze: state.animMaze,
    anim: state.anim
  };
};

export default connect(
  mapStateToProps,
  { setAnimating, setVisited, setShortest },
  null,
  {
    forwardRef: true
  }
)(TGrid);
