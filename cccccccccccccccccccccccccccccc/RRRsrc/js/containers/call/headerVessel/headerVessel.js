/**
 * 头部容器Smart模块
 * @module HeaderVesselSmart
 * @description   承载头部的所有组件
 * @author QiuShao
 * @date 2017/08/08
 */
'use strict';
import React from 'react';
import LeftHeaderSmart from './left/leftHeader';
import RightHeaderSmart from './right/rightHeader';

class HeaderVesselSmart extends React.Component{
    constructor(props){
        super(props);
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
    };
    render(){
        let {styleJson} = this.props ;
        return (
            <header id="header" style={styleJson}>
                <section className="header-wrap clear-float "  id="header_container">
                    <LeftHeaderSmart /> {/*左侧组件*/}
                    <RightHeaderSmart />{/*右侧组件*/}
                </section>
            </header>
        )
    };
};
export default  HeaderVesselSmart;

