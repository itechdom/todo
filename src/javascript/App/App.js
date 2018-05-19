import React from 'react';
import ReactDOM from 'react-dom';
import {
  observer,
  Provider,
  inject
}
  from "mobx-react";
import Dropzone from 'react-dropzone';
import {
  Branchit,
  Idea
}
  from '../Store';

import {
  IntlProvider,
  FormattedDate
}
  from 'react-intl';

// First we import some modules...
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'

import DevTools from 'mobx-react-devtools';

import injectTapEventPlugin from 'react-tap-event-plugin';

import '../Style/main.scss';

import { Tree } from './Tree.js';
import Home from './Home.js'
import Files from './Files.js'

injectTapEventPlugin();

import data from '../Self.json';
import jsMindmap from '../JavaScript.json';
import { AppBar,Drawer, MenuItem, RaisedButton, FlatButton, Chip, Paper, BottomNavigation, BottomNavigationItem, FontIcon, IconButton, Snackbar } from 'material-ui';
import * as colors from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {
  fade
}
  from 'material-ui/utils/colorManipulator';

const muiTheme = getMuiTheme({
  fontFamily: 'PT Sans Narrow,Roboto,sans-serif',
  palette: {
    primary1Color: colors.grey100,
    primary2Color: colors.teal500,
    primary3Color: colors.grey400,
    accent1Color: colors.pinkA200,
    accent2Color: colors.grey100,
    accent3Color: colors.grey500,
    textColor: colors.darkBlack,
    alternateTextColor: colors.darkBlack,
    canvasColor: colors.white,
    borderColor: colors.grey300,
    disabledColor: fade(colors.darkBlack, 0.3),
    pickerHeaderColor: colors.cyan500,
    shadowColor: colors.fullBlack
  },
  tabs: {
    backgroundColor: colors.grey700
  }
});
@inject('branchitStore')
@observer class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {open: false};
    props.branchitStore.getFiles();
  }

  handleToggle = () => this.setState({open: !this.state.open});

  render() {
    let store = this.props.branchitStore;
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Paper className="app__border" zDepth={1}>
          <Snackbar
            open={store.isLoggedIn}
            message="You are logged In"
          />
          <Drawer open={this.state.open}>
          <MenuItem onClick={()=>alert("hello")}>Home</MenuItem>
          <MenuItem>Recent</MenuItem>
          <MenuItem>Stats</MenuItem>
          </Drawer>
          <AppBar
            className="app__title"
            title={<span><FontIcon style={{color:"green"}} className="fa fa-leaf"></FontIcon> A leaf of knowledge</span>}
            iconElementRight={
              <div>
                <FlatButton 
                label="Login" 
                onClick={() => { store.login() }} 
                icon={<FontIcon className="fa fa-sign-in"></FontIcon>}
                />
              </div>
            }
            onLeftIconButtonClick={this.handleToggle}
            // onRightIconButtonClick={}
          />
          {this.props.children}
          {/* <DevTools /> */}
        </Paper>
      </MuiThemeProvider>
    );
  }
};

const Footer = () => (
  <footer style={{ marginTop: '4em', padding: '2em', textAlign: 'center', backgroundColor: colors.grey300 }}>
    <p>Branchit</p>
  </footer>
);

let branchitStore = new Branchit();

ReactDOM.render(
  <Provider branchitStore={branchitStore}>
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="files" component={Files} />
      </Route>
    </Router>
  </Provider>
  ,
  document.getElementById('app')
);
