import React from "react";
import Grid from "./Grid";
import NavBar from "./NavBar";
import Visited from "./Visited";
import ShortestPath from "./ShortestPath";
import AlgoInfo from "./AlgoInfo";
import "../assets/css/App.css";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

const myTheme = createMuiTheme({
  palette: {
    type: "dark",
    background: {
      default: "#151a30",
      paper: "#222b45"
    },
    divider: "#151a30",
    action: {
      hover: "#598bff66",
      selected: "#3366ff4D",
      active: "#274bdb"
    }
  },
  overrides: {
    MuiListItem: {
      root: {
        fontSize: "1rem"
      }
    }
  },
  typography: {
    fontFamily: "'Karla', sans-serif"
  }
});

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
          <div className="data">
            <div className="dataContent">
              <Visited />
              <ShortestPath />
            </div>
            <AlgoInfo />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
