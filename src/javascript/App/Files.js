import { AppBar, RaisedButton, Chip, Paper, BottomNavigation, BottomNavigationItem, FontIcon, IconButton, Snackbar } from 'material-ui';
import {Tree} from './Tree.js';
import React from 'react';
import {
  observer,
  Provider,
  inject
}
from "mobx-react";
@inject('branchitStore') @observer
export default class Files extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        let files = this.props.files;
        return <div>
            files
            </div>
    }
}