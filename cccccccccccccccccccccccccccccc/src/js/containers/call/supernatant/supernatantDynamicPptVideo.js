/**
 * 动态PPT视频正在播放浮层
 * @module SupernatantDynamicPptVideoSmart
 * @description   提供动态PPT视频正在播放浮层
 * @author QiuShao
 * @date 2017/09/01
 */

'use strict';
import React from 'react';
import eventObjectDefine from 'eventObjectDefine' ;
import TkConstant from 'TkConstant' ;

class SupernatantDynamicPptVideoSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            dynamicPptVideoPlaying:false
        };
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        let that = this ;
        eventObjectDefine.CoreController.addEventListener( 'playDynamicPPTMediaStream' , that.handlerPlayDynamicPPTMediaStream.bind(that)  , that.listernerBackupid );
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        let that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid );
    };

    handlerPlayDynamicPPTMediaStream(recvEventData){
        const that = this ;
        let {show , stream} = recvEventData.message ;
        if(that.state.dynamicPptVideoPlaying !== show){
            that.setState({dynamicPptVideoPlaying:show});
        }
    };

    render(){
        const that = this ;
        let {dynamicPptVideoPlaying} = that.state ;
        return (
            <section className="dynamicPptVideoPlaying-container add-position-absolute-top0-left0" id="dynamicPptVideoPlaying_container"   style={{display:dynamicPptVideoPlaying?'block':'none',width:'100%' , height:'100%' , backgroundColor:'rgba(0,0,0,0.5)' , zIndex:150 , }} ></section>
        )
    }
};
export default  SupernatantDynamicPptVideoSmart;