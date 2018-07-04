/**
 * 登录页面模块-进入页面提示
 * @module JoinHint
 * @description   提供 进入页面的提示
 * @author QiuShao
 * @date 2017/7/21
 */

'use strict';
import React from 'react';

/*Login页面*/
class JoinHint extends React.Component{
    constructor(props){
        super(props);
        this.state={
            languageData:window.GLOBAL.language.languageData
        }
    }
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        let that = this ;
    }
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        let that = this ;
    }
    render(){
        let that = this ;
        return (
            <div className="join" >
                <div className="wait-room-wrap" >
                    <span>{that.state.languageData.login.language.joinRoomHint.text}</span> <span className="add-letter-spacing-5px" >···</span>
                </div>
            </div>
        )
    }
};
export default JoinHint;

