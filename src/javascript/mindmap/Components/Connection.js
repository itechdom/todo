import React from 'react';
import Node from './Node.js'

export default class Connection extends React.Component{
    constructor(){
        super();
    }
    componentDidMount(){

    }
    
    render(){
        
        return(
            <div>
                {
                this.props.connections.map((connection)=>(
                <svg height="200" width="200">
                  <line x1={connection.from.x} y1={connection.from.y} x2={connection.to.x} y2={connection.to.y} style={{stroke:'red',strokeWidth:2,zIndex:999}} />
                </svg>
                ))
                }
                <svg />
            </div>
        );
    }
}
