import React from 'react';
let height = 0;
export default class Node extends React.Component{
    constructor(){
        super();
    }
    componentDidMount(){
    }
    nodeStyle(){
        return {
            position:'absolute',
            width:200,
            left:this.props.node.position.x,
            top:this.props.node.position.y,
            wordWrap:'break-word'
        }
    }
    render(){
        return(<div style={this.nodeStyle()} >
            {this.props.node.title}
        </div>);
    }
}
