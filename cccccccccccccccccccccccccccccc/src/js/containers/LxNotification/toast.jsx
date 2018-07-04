import React from 'react';

class Toast extends React.Component{

    constructor(){
        super();
    }

    render(){
        return (
            <span className="toast">{this.props.msg}</span>
        )
    }
    
}

export default Toast;