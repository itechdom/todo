import React from 'react';
import Node from './Node.js'

export default class Tree extends React.Component{
    constructor(){
        super();
    }
    componentDidMount(){

    }

    renderNodes(arr) {
        return arr.map((ch, index) => (
            <Node
                node={ch}
                key={index}
            />
        ))
    }

    render(){
        let level = 0;
        let arr =[];
        this.traverse(this.props.nodes,(child,parent,lev)=>{
            arr.push(child);
        })
        return (
            <div>
            {
                this.renderNodes(arr)
            }
            </div>
        );

    }
    traverse(node, fn) {
        if (node && node.ideas) {
            return Object.keys(node.ideas).map((key) => {
                let child = node.ideas[key];
                fn(child, node);
                this.traverse(child, fn);
            });
        }
    }
}
