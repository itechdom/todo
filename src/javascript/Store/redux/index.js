import React from "react";
import { render } from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import reducer from "./reducers";
import generateTree from "./generateTree";
import Node from "./containers/Node";
import { getRefreshToken, getAccessToken } from "./authTokens";
import data from '../../Self.json';

const tree = generateTree();
let token = getAccessToken();
let refreshToken = getRefreshToken();
let state = {
   ideaList : [],
   level:0,
   maxLevel:0,
   pendingRequestCount:0,
   isLoggedIn : false
}
const store = createStore(reducer, tree, applyMiddleware(thunk));

render(
  <Provider store={store}>
    <Node id={0} />
  </Provider>,
  document.getElementById("root")
);
