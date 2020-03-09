import React from "react";
import { connect } from "react-redux";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import { withStyles } from "@material-ui/core/styles";

const VisitedCard = withStyles({
  root: {
    width: "100%",
    padding: "3%",
    marginBottom: "2vh"
  }
})(Card);

const Visited = props => {
  const progress = (props.visited * 100) / (props.rows * props.columns);
  return (
    <VisitedCard>
      <Typography variant="h6">Visited</Typography>
      <Typography variant="h3">{props.visited}</Typography>
      <LinearProgress variant="determinate" value={progress} />
    </VisitedCard>
  );
};

const mapStateToProps = state => {
  return {
    visited: state.visited
  };
};

export default connect(mapStateToProps)(Visited);
