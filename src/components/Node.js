import React from "react";

class Node extends React.PureComponent {
  render() {
    const { row, column, onMouseClick, onMouseEnterAndLeave } = this.props;

    const statusClass = this.props.isStart
      ? "start-node"
      : this.props.isEnd
      ? "end-node"
      : "";
    return (
      <div
        id={`node-${row}-${column}`}
        className={`node ${statusClass}`}
        onClick={() => onMouseClick(row, column)}
        onMouseEnter={() => onMouseEnterAndLeave(row, column)}
        onMouseLeave={() => onMouseEnterAndLeave(row, column)}
      ></div>
    );
  }
}

export default Node;
