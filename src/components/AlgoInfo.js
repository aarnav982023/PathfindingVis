import React from "react";
import { connect } from "react-redux";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import { useTransition, animated } from "react-spring";

const AlgoInfoCard = withStyles({
  root: {
    width: "100%",
    padding: "3%",
    marginBottom: "2vh",
    marginRight: "2%"
  }
})(Card);

const getTitle = algo => {
  switch (algo) {
    case 0:
      return "Dijkstra's Algorithm";
    case 1:
      return "A* Search";
    case 2:
      return "Jump Point Search";
    default:
      return;
  }
};

const getContent = algo => {
  switch (algo) {
    case 0:
      return `Dijkstra's algorithm is an algorithm for finding the shortest paths between nodes in a graph, which may represent, for example, road networks. It was conceived by computer scientist Edsger W. Dijkstra in 1956 and published three years later.
      The algorithm exists in many variants. Dijkstra's original algorithm found the shortest path between two given nodes, but a more common variant fixes a single node as the "source" node and finds shortest paths from the source to all other nodes in the graph, producing a shortest-path tree.`;
    case 1:
      return `A* (pronounced "A-star") is a graph traversal and path search algorithm, which is often used in computer science due to its completeness, optimality, and optimal efficiency.
      One major practical drawback is its O(b^d) space complexity, as it stores all generated nodes in memory. Thus, in practical travel-routing systems, it is generally outperformed by algorithms which can pre-process the graph to attain better performance,
      as well as memory-bounded approaches; however, A* is still the best solution in many cases.`;
    case 2:
      return `Jump point search (JPS) is an optimization to the A* search algorithm for uniform-cost grids. It reduces symmetries in the search procedure by means of graph pruning, 
      eliminating certain nodes in the grid based on assumptions that can be made about the current node's neighbors, as long as certain conditions relating to the grid are satisfied.
       As a result, the algorithm can consider long "jumps" along straight (horizontal, vertical and diagonal) lines in the grid, rather than the small steps from one grid position to the next that ordinary A* considers.
       Jump point search preserves A*'s optimality, while potentially reducing its running time by an order of magnitude.`;
    default:
      return;
  }
};

const AlgoInfo = props => {
  const transition = useTransition(props.algo, null, {
    from: {
      position: "absolute",
      overflowX: "hidden",
      transform: "translateY(-5vh) scale(0.7)",
      opacity: 0
    },
    enter: { opacity: 1, transform: "translateY(0vh) scale(1)" },
    leave: { opacity: 0, transform: "translateY(5vh) scale(0.7)" }
  });
  return transition.map(({ item, props, key }) => (
    <animated.div key={key} style={props}>
      <AlgoInfoCard>
        <Typography variant="h4">{getTitle(item)}</Typography>
        <br />
        <Typography variant="body1">{getContent(item)}</Typography>
      </AlgoInfoCard>
    </animated.div>
  ));
};

const mapStateToProps = state => {
  return {
    algo: state.algo
  };
};

export default connect(mapStateToProps)(AlgoInfo);
