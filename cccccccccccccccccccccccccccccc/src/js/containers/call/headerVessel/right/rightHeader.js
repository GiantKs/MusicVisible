/**
 * 头部容器-右侧头部Smart模块
 * @module RightHeaderSmart
 * @description   承载头部的左侧所有组件
 * @author QiuShao
 * @date 2017/08/08
 */
'use strict';
import React from 'react';
import TkGlobal from 'TkGlobal';
import ClockTimeSmart from './clockTime';
import ClassbeginAndRaiseSmart from './classbeginAndRaise';
import './cssRightHeader.css';

class RightHeaderSmart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notClockTimeClass:''
        };
    };

    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
    };

    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
    };

    classbeginAndRaiseShowButtonCallback(showButton){
        if(!showButton){
            if(this.state.notClockTimeClass !== 'only-clock'){
                this.setState({notClockTimeClass:'only-clock'}) ;
            }
        }else{
            if(this.state.notClockTimeClass !== ''){
                this.setState({notClockTimeClass:''}) ;
            }
        }
    };

    render() {
        let that = this;
        return (
            <article className={"h-right-wrap add-btn-hover-opacity clear-float add-fr "+that.state.notClockTimeClass} id="header_right" >
                { !TkGlobal.playback ? <ClockTimeSmart /> : undefined }
                { !TkGlobal.playback ? <ClassbeginAndRaiseSmart classbeginAndRaiseShowButtonCallback={that.classbeginAndRaiseShowButtonCallback.bind(that) } /> : undefined }
            </article>
        )
    };
};
export default  RightHeaderSmart;

