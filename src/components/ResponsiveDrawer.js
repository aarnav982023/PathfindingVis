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
import {
  makeStyles,
  useTheme,
  createMuiTheme,
  ThemeProvider
} from "@material-ui/core/styles";
import { Divider } from "@material-ui/core";

const drawerWidth = 300;

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
      marginLeft: drawerWidth
    },
    border: 0,
    backgroundColor: theme.palette.background.default,
    color: "black",
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
    width: drawerWidth
    //border: 0
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
  overrides: {
    MuiListItem: {
      root: {
        fontSize: "1rem"
      }
    }
  }
});

function ResponsiveDrawer(props) {
  const { container } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [heuristic, setHeuristic] = React.useState({ 1: "manhatten" });
  const [allowDiag, setAllowDiag] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };
  const handleHeuristicChange = event => {
    setHeuristic({ [selectedIndex]: event.target.value });
  };

  const drawer = (
    <ThemeProvider theme={myTheme}>
      <div>
        <div className={classes.toolbar} />
        <List>
          <ListItem>
            <FormControlLabel
              control={
                <Switch
                  checked={allowDiag}
                  onChange={() => setAllowDiag(!allowDiag)}
                  value="allowDiagonals"
                />
              }
              label="Allow Diagonals"
            />
          </ListItem>
          <Divider />
          <Typography variant="h5" className={classes.test}>
            Algorithms
          </Typography>
          <ListItem
            button
            selected={selectedIndex === 0}
            onClick={event => {
              handleListItemClick(event, 0);
            }}
          >
            Dijkstra
          </ListItem>
          <ListItem
            button
            selected={selectedIndex === 1}
            onClick={event => {
              handleListItemClick(event, 1);
            }}
          >
            A*
            <Collapse in={selectedIndex === 1} timeout="auto" unmountOnExit>
              <CardContent>
                <FormLabel>Heuristic</FormLabel>
                <RadioGroup
                  value={heuristic[1]}
                  onChange={handleHeuristicChange}
                >
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
                    value="diagonal"
                    control={<Radio />}
                    label="Diagonal"
                  />
                </RadioGroup>
              </CardContent>
            </Collapse>
          </ListItem>
        </List>
      </div>
    </ThemeProvider>
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
            variant="contained"
            disableElevation
            onClick={() =>
              props.visualize(
                selectedIndex,
                heuristic[selectedIndex],
                allowDiag
              )
            }
            disabled={props.isAnimating}
          >
            Visualize
          </Button>
          <Button
            className={classes.toolButton}
            variant="contained"
            disableElevation
            onClick={() => {
              props.clearGrid();
            }}
            disabled={props.isAnimating}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            disableElevation
            onClick={() => {
              props.setKruskalMaze();
            }}
            disabled={props.isAnimating}
          >
            Kruskal Maze
          </Button>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
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
          </Drawer>
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

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  container: PropTypes.instanceOf(
    typeof Element === "undefined" ? Object : Element
  )
};

export default ResponsiveDrawer;
