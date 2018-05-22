import TodoStore from './stores/TodoStore';
import ViewStore from './stores/ViewStore';
import TodoApp from './components/todoApp.js';
import React from 'react';
import ReactDOM from 'react-dom';
require('todomvc-app-css/index.css');

const initialState = window.initialState && JSON.parse(window.initialState) || {};

var todoStore = TodoStore.fromJS(initialState.todos || []);
var viewStore = new ViewStore();

ReactDOM.render(
	<TodoApp todoStore={todoStore} viewStore={viewStore}/>,
	document.getElementById('todoapp')
);

