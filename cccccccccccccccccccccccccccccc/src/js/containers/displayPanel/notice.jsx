/**
 * 公告栏组件
 * @description block布局，展示文字块
 * @author R37
 * @date 2017/10/25
 */
import TkGlobal from "TkGlobal" ;
import React,{ Component } from 'react';

class Notice extends Component {

    constructor(){
        super();
    }
    
    // Mounting
    componentWillMount(){}
    componentDidMount(){}

    // Updating
    componentWillUpdate(){}
    componentDidUpdate(){}

    // Unmountint
    componentWillUnmount(){}

    render(){
        const self = this;

        return (
            <div className="ntc" style={{ display: self.props.text? 'block' : 'none'}}>
                <h6>{TkGlobal.language.languageData.notice.notice}</h6>
                <p>{self.props.text}</p>
                <button className="btn-close" onClick={this.props.handleClose}>X</button>
            </div>
        );
    }
}

export default Notice;