import React from "react";
import { connect } from "react-redux";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import { withStyles } from "@material-ui/core/styles";

const ShortestPathCard = withStyles({
  root: {
    width: "100%",
    padding: "3%",
    marginBottom: "2vh"
  }
})(Card);

const ColorLinearProgress = withStyles({
  colorPrimary: {
    backgroundColor: "orange"
  },
  barColorPrimary: {
    backgroundColor: "white"
  }
})(LinearProgress);

const Shortest = props => {
  const progress = (props.shortest * 100) / (props.rows * props.columns);
  return (
    <ShortestPathCard className="shortestPathCard">
      <Typography variant="h6">Shortest Path</Typography>
      <Typography variant="h3">{props.shortest}</Typography>
      <ColorLinearProgress variant="determinate" value={progress} />
    </ShortestPathCard>
  );
};

const mapStateToProps = state => {
  return {
    shortest: state.shortest
  };
};

export default connect(mapStateToProps)(Shortest);
