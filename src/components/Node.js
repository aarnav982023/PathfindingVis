import React from "react";

class Node extends React.PureComponent {
  render() {
    const {
      row,
      column,
      onMouseClick,
      onMouseEnterAndLeave,
      startNodeClass,
      endNodeClass,
      wallClass
    } = this.props;
    const statusClass = this.props.isStart
      ? startNodeClass
      : this.props.isEnd
      ? endNodeClass
      : this.props.isShortestPath
      ? "shortest-path"
      : this.props.isVisited
      ? "visited"
      : this.props.isWall
      ? wallClass
      : "";
    return (
      <td
        id={`node-${row}-${column}`}
        className={`node ${statusClass}`}
        ref={this.props.forwardRef}
        onClick={() => onMouseClick(row, column)}
        onMouseEnter={() => onMouseEnterAndLeave(row, column)}
        onMouseLeave={() => onMouseEnterAndLeave(row, column)}
      ></td>
    );
  }
}

export default React.forwardRef((props, ref) => (
  <Node {...props} forwardRef={ref} />
));
