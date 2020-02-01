import React from "react";
import Grid from "./Grid";
import NavBar from "./NavBar";
import "../assets/css/App.css";
import Card from "@material-ui/core/Card";
import {
  createMuiTheme,
  ThemeProvider,
  withStyles
} from "@material-ui/core/styles";

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

const Placeholder = withStyles({
  root: {
    width: "100%",
    height: "100%"
  }
})(Card);

const App = () => {
  const gridRef = React.useRef();

  const xs = window.matchMedia("(max-width: 576px)").matches;
  const sm = window.matchMedia("(min-width: 576px)").matches;
  const md = window.matchMedia("(min-width: 768px)").matches;
  const lg = window.matchMedia("(min-width: 960px)").matches;
  const xl = window.matchMedia("(min-width: 1200px)").matches;

  const getRow = () => {
    if (xl) return 41;
    if (lg) return 37;
    if (md) return 39;
    if (sm) return 43;
    if (xs) return 43;
    return 60;
  };

  const getColumn = () => {
    if (xl) return 61;
    if (lg) return 45;
    if (md) return 51;
    if (sm) return 41;
    if (xs) return 31;
    return 100;
  };

  return (
    <ThemeProvider theme={myTheme}>
      <div className="app">
        <NavBar
          visualize={() => {
            gridRef.current.visualize();
          }}
          clearGrid={() => {
            gridRef.current.clearGrid();
          }}
          visualizeMaze={animateMaze => {
            gridRef.current.visualizeMaze();
          }}
        />
        <div className="content">
          <Grid ref={gridRef} rows={getRow()} columns={getColumn()} />
          <div className="placeholder">
            <Placeholder />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
