//@flow
import Tree from '../Components/Tree.js';
import Connection from '../Components/Connection.js';
import React from 'react';
import ReactDOM from 'react-dom';
import mindmap from '../data.json';
import Model from '../Model/Model.js';

export default class App extends React.Component {
    constructor() {
        super();
        let model = new Model(mindmap);
        model.createDepthModel();
        model.centerParents();
        model.drawConnections();
        this.state = {
            mindmap: model.tree,
            connections:model.connections
        }
    }
    componentDidMount() {

    }
    updateCounter() {

    }
    //we will have multiple views here as well
    render() {
        return (
        <div className="board">
            <Tree
                onPositionChange
                nodes={this.state.mindmap}
            />
            <Connection
                connections={this.state.connections}
            />
        </div>
        );
    }
}
