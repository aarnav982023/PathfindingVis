import React from "react";
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
import GitHubIcon from "@material-ui/icons/GitHub";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Divider } from "@material-ui/core";
import { connect } from "react-redux";
import {
  selectAlgo,
  allowDiag,
  changeHeuristic,
  selectMaze,
  animateMaze,
} from "../actions";

const drawerWidth = 275;

const OrangeSwitch = withStyles({
  switchBase: {
    color: "#FFCC80",
    "&$checked": {
      color: "#EF6C00",
    },
    "&$checked + $track": {
      backgroundColor: "#E65100",
    },
  },
  checked: {},
  track: {},
})(Switch);

const OrangeRadio = withStyles({
  root: {
    color: "",
    "&$checked": {
      color: "#EF6C00",
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
      marginRight: theme.spacing(6),
    },
  },
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("md")]: {
      zIndex: theme.zIndex.drawer + 1,
    },
    border: 0,
    backgroundColor: theme.palette.background.paper,
    boxShadow: "0 0.5rem 1rem 0 #1a1f33",
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  toolbar: theme.mixins.toolbar,
  toolButton: {
    marginRight: "1vw",
  },
  drawerPaper: {
    //Color for actual drawer can be set here
    width: drawerWidth,
    border: 0,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  card: {
    width: "100%",
    borderRadius: "0.5vw",
  },
  cardHeadText: {
    padding: "1vh",
    fontSize: "1rem",
  },
  header: {
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  titlebar: {
    display: "flex",
    flexGrow: 1,
  },
}));

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
    anim,
  } = props;
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleAlgoClick = (index) => {
    selectAlgo(index);
  };
  const handleHeuristicChange = (event) => {
    changeHeuristic({ [algo]: event.target.value });
  };
  const handleMazeItemClick = (index) => {
    selectMaze(index);
  };
  const onGitHubClick = () => {
    window.open("https://github.com/aarnav982023/PathfindingVis", "_blank");
  };

  const drawer = (
    <div>
      <List>
        <ListItem>
          <FormControlLabel
            control={
              <OrangeSwitch
                checked={diag}
                disabled={anim}
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
              <OrangeSwitch
                disabled={anim}
                checked={animMaze}
                onChange={() => animateMaze(!animMaze)}
                value="animateMaze"
              />
            }
            label="Animate Maze"
          />
        </ListItem>
        <Divider />
        <Typography variant="h6" className={classes.header}>
          Algorithms
        </Typography>
        <ListItem
          button
          disabled={anim}
          selected={algo === 0}
          onClick={(event) => {
            handleAlgoClick(0);
          }}
        >
          Dijkstra
        </ListItem>
        <ListItem
          button
          selected={algo === 1}
          disabled={anim}
          onClick={(event) => {
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
                  control={<OrangeRadio />}
                  label="Euclidean"
                />
                <FormControlLabel
                  size="small"
                  value="manhatten"
                  control={<OrangeRadio />}
                  label="Manhatten"
                />
                <FormControlLabel
                  size="small"
                  value="chebyshev"
                  control={<OrangeRadio />}
                  label="Chebyshev"
                />
                <FormControlLabel
                  size="small"
                  value="octile"
                  control={<OrangeRadio />}
                  label="Octile"
                />
              </RadioGroup>
            </CardContent>
          </Collapse>
        </ListItem>
        <ListItem
          button
          selected={algo === 2}
          disabled={anim}
          onClick={(event) => {
            handleAlgoClick(2);
          }}
        >
          Jump Point Search
        </ListItem>
        <Divider />
        <Typography variant="h6" className={classes.header}>
          Mazes
        </Typography>
        <ListItem
          button
          selected={maze === 0}
          disabled={anim}
          onClick={(event) => {
            handleMazeItemClick(0);
          }}
        >
          Kruskal
        </ListItem>
        <ListItem
          button
          selected={maze === 1}
          disabled={anim}
          onClick={(event) => {
            handleMazeItemClick(1);
          }}
        >
          Prim
        </ListItem>
        <ListItem
          button
          selected={maze === 2}
          disabled={anim}
          onClick={(event) => {
            handleMazeItemClick(2);
          }}
        >
          Recursive Division
        </ListItem>
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <div className={classes.titlebar}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Pathfinding Visualizer
            </Typography>
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
          </div>
          <IconButton style={{ color: "white" }} onClick={onGitHubClick}>
            <GitHubIcon style={{ fontSize: "30" }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <SwipeableDrawer
            container={container}
            variant="temporary"
            onOpen={() => {
              setMobileOpen(true);
            }}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </SwipeableDrawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            <div className={classes.toolbar} />
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps, {
  selectAlgo,
  allowDiag,
  changeHeuristic,
  selectMaze,
  animateMaze,
})(NavBar);
