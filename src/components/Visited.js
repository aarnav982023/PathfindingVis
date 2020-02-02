import React from "react";
import { connect } from "react-redux";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

const VisitedCard = withStyles({
  root: {
    width: "100%",
    padding: "3%",
    marginBottom: "2vh",
    marginRight: "2%"
  }
})(Card);

const Visited = props => {
  return (
    <VisitedCard className="visitedCard">
      <Typography>Visited</Typography>
      <Typography variant="h3">{props.visited}</Typography>
    </VisitedCard>
  );
};

const mapStateToProps = state => {
  return {
    visited: state.visited
  };
};

export default connect(mapStateToProps)(Visited);
