import {
  INCREMENT,
  ADD_CHILD,
  REMOVE_CHILD,
  CREATE_NODE,
  DELETE_NODE,
  GET_FILES
} from "../actions";

import { GET, POST, UPDATE, DELETE } from "../httpConfig";

import { HOST } from "../../../config.js";

import thunk from "redux-thunk";

function fetchFiles() {
  return fetch(`${HOST}/google/file/list`, POST({ token: token }));
}

function getFiles(forPerson) {
  return function(dispatch) {
    return fetchFiles().then(
      sauce => dispatch(makeASandwich(forPerson, sauce)),
      error => dispatch(apologize("The Sandwich Shop", forPerson, error))
    );
  };
}

const childIds = (state, action) => {
  switch (action.type) {
    case ADD_CHILD:
      return [...state, action.childId];
    case REMOVE_CHILD:
      return state.filter(id => id !== action.childId);
    default:
      return state;
  }
};

const node = (state, action) => {
  switch (action.type) {
    case CREATE_NODE:
      return {
        id: action.nodeId,
        counter: 0,
        childIds: []
      };
    case INCREMENT:
      return {
        ...state,
        counter: state.counter + 1
      };
    case ADD_CHILD:
    case REMOVE_CHILD:
      return {
        ...state,
        childIds: childIds(state.childIds, action)
      };
    default:
      return state;
  }
};

const getAllDescendantIds = (state, nodeId) =>
  state[nodeId].childIds.reduce(
    (acc, childId) => {
      return [...acc, childId, ...getAllDescendantIds(state, childId)]
    },
    []
  );

const deleteMany = (state, ids) => {
  state = { ...state };
  ids.forEach(id => delete state[id]);
  return state;
};

export default (state = {}, action) => {
  const { nodeId } = action;

  //initial state
  if (typeof nodeId === "undefined") {
    console.log("INITIAL STATE",state);
    return state;
  }

  if (action.type === DELETE_NODE) {
    const descendantIds = getAllDescendantIds(state, nodeId);
    return deleteMany(state, [nodeId, ...descendantIds]);
  }
  return {
    ...state,
    [nodeId]: node(state[nodeId], action)
  };
};
