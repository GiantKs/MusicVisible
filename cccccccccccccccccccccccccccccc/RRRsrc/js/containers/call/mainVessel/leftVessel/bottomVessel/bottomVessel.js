/**
 * 左侧部分-底部所有组件的Smart模块
 * @module BottomVesselSmart
 * @description   承载左侧部分-底部所有组件
 * @author QiuShao
 * @date 2017/08/08
 */
'use strict';
import React from 'react';
import HVideoContainer from  '../../../baseVideo/HVideoContainer';


class BottomVesselSmart extends React.Component{
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
            <section  style={styleJson} className="tk-left-bottom other-video-container add-btn-hover-opacity"     id="other_video_container"    >
                <HVideoContainer />
            </section>
        )
    };
};

export default  BottomVesselSmart;

