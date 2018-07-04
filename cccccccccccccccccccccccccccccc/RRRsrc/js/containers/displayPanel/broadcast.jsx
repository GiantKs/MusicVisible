/**
 * 广播组件
 * @description 纯文字展示
 * @author R37
 * @date 2017/10/25
 */

import React,{ Component } from 'react';
import './static/css/displayPanel.css'

import CoreController from 'CoreController';
import eventObjectDefine from 'eventObjectDefine';
import TkConstant from 'TkConstant';

class Broadcast extends Component {

    constructor(){
        super();
        this.markID = new Date().getTime()+'_'+Math.random();
    }
    
    // Mounting
    componentWillMount(){}
    componentDidMount(){}

    // Updating
    componentWillUpdate(){}
    componentDidUpdate(){}

    // Unmounting
    componentWillUnmount(){}

    render(){
        const self = this;

        return (
           <p className='brd' style={{display: self.props.text? 'block' : 'none'}}>广播:{self.props.text}</p>
       );
    }
}

export default Broadcast;