/**
 * 头部容器-左侧头部Smart模块
 * @module LeftHeaderSmart
 * @description   承载头部的左侧所有组件
 * @author QiuShao
 * @date 2017/08/08
 */
'use strict';
import React from 'react';
import TkGlobal from 'TkGlobal';
import AudioPlayerSmart from './audioPlayer';
import NetworkStatusSmart from './networkStatus/networkStatus';
import CoreController from 'CoreController';
import eventObjectDefine from 'eventObjectDefine';
import LocalRecordSmart from './localRecord';

class LeftHeaderSmart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           updateState:false ,
        };
    };

    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        eventObjectDefine.CoreController.addEventListener("initAppPermissions", this.handlerInitAppPermissions.bind(this), this.listernerBackupid);
    };

    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        eventObjectDefine.CoreController.removeBackupListerner(this.listernerBackupid);
    };

    handlerInitAppPermissions(){
        this.setState({updateState:!this.state.updateState});
    }

    render() {
        return (
            <article className="h-left-wrap clear-float add-fl add-position-relative" id="header_left">
                <span className="add-block add-fl h-logo-wrap add-display-none"></span>
                { TkGlobal.isClient? undefined:!TkGlobal.playback ?  <NetworkStatusSmart />: undefined }
                <AudioPlayerSmart />
                { TkGlobal.clientversion && TkGlobal.clientversion>=2018010200 && TkGlobal.isClient && CoreController.handler.getAppPermissions('localRecord')?  <LocalRecordSmart />: undefined }
            </article>
        )
    };
};
export default  LeftHeaderSmart;

