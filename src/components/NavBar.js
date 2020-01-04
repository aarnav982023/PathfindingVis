import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import Collapse from "@material-ui/core/Collapse";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { makeStyles, useTheme, createMuiTheme } from "@material-ui/core/styles";
import { Divider } from "@material-ui/core";
import { connect } from "react-redux";
import {
  selectAlgo,
  allowDiag,
  changeHeuristic,
  selectMaze,
  animateMaze
} from "../actions";

const drawerWidth = 275;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      height: "7vh"
    },
    border: 0,
    backgroundColor: myTheme.palette.background.default,
    //color: "black",
    boxShadow: "none"
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },
  toolbar: theme.mixins.toolbar,
  toolButton: {
    marginRight: "1vw"
  },
  drawerPaper: {
    width: drawerWidth,
    border: 0
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  card: {
    width: "100%",
    borderRadius: "0.5vw"
  },
  cardHeadText: {
    padding: "1vh",
    fontSize: "1rem"
  },
  test: {
    padding: "1vh 0 1vh 1vh"
  }
}));

const myTheme = createMuiTheme({
  palette: {
    type: "dark"
  },
  overrides: {
    MuiListItem: {
      root: {
        fontSize: "1rem"
      }
    }
  }
});

function NavBar(props) {
  const {
    container,
    algo,
    selectAlgo,
    diag,
    allowDiag,
    heuristic,
    changeHeuristic,
    maze,
    selectMaze,
    animMaze,
    animateMaze,
    anim
  } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleAlgoClick = index => {
    selectAlgo(index);
  };
  const handleHeuristicChange = event => {
    changeHeuristic({ [algo]: event.target.value });
  };
  const handleMazeItemClick = index => {
    selectMaze(index);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <List>
        <ListItem>
          <FormControlLabel
            control={
              <Switch
                checked={diag}
                onChange={() => allowDiag(!diag)}
                value="allowDiagonals"
              />
            }
            label="Allow Diagonals"
          />
        </ListItem>
        <ListItem>
          <FormControlLabel
            control={
              <Switch
                checked={animMaze}
                onChange={() => animateMaze(!animMaze)}
                value="animateMaze"
              />
            }
            label="Animate Maze"
          />
        </ListItem>
        <Divider />
        <Typography variant="h6" className={classes.test}>
          Pathfinding Algorithms
        </Typography>
        <ListItem
          button
          selected={algo === 0}
          onClick={event => {
            handleAlgoClick(0);
          }}
        >
          Dijkstra
        </ListItem>
        <ListItem
          button
          selected={algo === 1}
          onClick={event => {
            handleAlgoClick(1);
          }}
        >
          A*
          <Collapse in={algo === 1} timeout="auto" unmountOnExit>
            <CardContent>
              <FormLabel>Heuristic</FormLabel>
              <RadioGroup value={heuristic[1]} onChange={handleHeuristicChange}>
                <FormControlLabel
                  size="small"
                  value="euclidean"
                  control={<Radio />}
                  label="Euclidean"
                />
                <FormControlLabel
                  size="small"
                  value="manhatten"
                  control={<Radio />}
                  label="Manhatten"
                />
                <FormControlLabel
                  size="small"
                  value="chebyshev"
                  control={<Radio />}
                  label="Chebyshev"
                />
                <FormControlLabel
                  size="small"
                  value="octile"
                  control={<Radio />}
                  label="Octile"
                />
              </RadioGroup>
            </CardContent>
          </Collapse>
        </ListItem>
        <ListItem
          button
          selected={algo === 2}
          onClick={event => {
            handleAlgoClick(2);
          }}
        >
          Jump Point Search
        </ListItem>
        <Divider />
        <Typography variant="h6" className={classes.test}>
          Maze Algorithms
        </Typography>
        <ListItem
          button
          selected={maze === 0}
          onClick={event => {
            handleMazeItemClick(0);
          }}
        >
          Kruskal
        </ListItem>
        <ListItem
          button
          selected={maze === 1}
          onClick={event => {
            handleMazeItemClick(1);
          }}
        >
          Prim
        </ListItem>
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Button
            className={classes.toolButton}
            variant="text"
            disableElevation
            onClick={() => props.visualize()}
            disabled={anim}
          >
            Visualize
          </Button>
          <Button
            className={classes.toolButton}
            variant="text"
            disableElevation
            onClick={() => {
              props.clearGrid();
            }}
            disabled={anim}
          >
            Clear
          </Button>
          <Button
            variant="text"
            disableElevation
            onClick={() => {
              props.visualizeMaze(animateMaze);
            }}
            disabled={anim}
          >
            Maze
          </Button>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <SwipeableDrawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            onOpen={() => {
              setMobileOpen(true);
            }}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {drawer}
          </SwipeableDrawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
}

NavBar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  container: PropTypes.instanceOf(
    typeof Element === "undefined" ? Object : Element
  )
};

const mapStateToProps = state => {
  console.log(state);
  return state;
};

export default connect(mapStateToProps, {
  selectAlgo,
  allowDiag,
  changeHeuristic,
  selectMaze,
  animateMaze
})(NavBar);
