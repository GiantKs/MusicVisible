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
import ServiceRoom from 'ServiceRoom';
import TkConstant from 'TkConstant';
import eventObjectDefine from 'eventObjectDefine';
import CoreController from 'CoreController' ;


class LeftHeaderSmart extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            onlineNum:1,
        };

        this.onlineNumInfo = null;
        this._isMounted = false;
        this.isShowStudentsNum =false;
        this.listernerBackupid = new Date().getTime()+'_'+Math.random() ;

    };

    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this;
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomConnected, that.handlerRoomConnected.bind(that)  , that.listernerBackupid ); //Room-Connected事件：房间连接事件
        
    };
    componentWillMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this;
        if(TkGlobal.isBroadcast) {
            //that.onlineNumInfo = setInterval( () => {(that.getOnlineNum()}, 10000); //每10秒钟，轮询一次，获取在线人数
            this._isMounted = true;
            that.onlineNumInfo = setInterval(() => { //每10秒钟，轮询一次，获取在线人数
                const that = this ;
                let getOnlineNumAjaxInfo = {
                    getOnlineNumAjaxXhr:undefined
                };
                let roomProperties = ServiceRoom.getTkRoom().getRoomProperties();
                getOnlineNumAjaxInfo.getOnlineNumAjaxXhr = ServiceRoom.getTkRoom().getOnlineNum(roomProperties.companyid,roomProperties.serial,function(code,response){
                    that.getOnlineNumBack(code,response,roomProperties.serial);
                });
            }, 10000);
        }
        eventObjectDefine.CoreController.removeBackupListerner(this.listernerBackupid);
    };

    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        this._isMounted = false;
    };


    handlerRoomConnected(roomEvent){//房间连接时
        const that = this;
        that.isShowStudentsNum = TkConstant.joinRoomInfo.isShowStudentsNum;
    }
    getOnlineNumBack(code,response,serial){
        let that = this;
        if(code === 0){
            if(response.onlinenum === undefined)
                return;
            for(let i=0;i<response.onlinenum.length;i++){
                if(response.onlinenum[i].serial === serial && this._isMounted){
                    that.setState({onlineNum :response.onlinenum[i].num});
                    break;
                }
            }
        }

    }

    //获取在线人数
    getOnlineNum(){
        const that = this ;
        let getOnlineNumAjaxInfo = {
            getOnlineNumAjaxXhr:undefined
        };
        let roomProperties = ServiceRoom.getTkRoom().getRoomProperties();
        getOnlineNumAjaxInfo.getOnlineNumAjaxXhr = ServiceRoom.getTkRoom().getOnlineNum(roomProperties.companyid,roomProperties.serial,function(code,response){
            that.getOnlineNumBack(code,response,roomProperties.serial);
        });

    }

    render() {
        let that = this;
        let tmpColor = TkGlobal.isBroadcast?'#ffffff':'#000000';
        return (
            <article className="h-left-wrap clear-float add-fl add-position-relative" id="header_left">
                <span className={"add-block add-fl h-logo-wrap" +  TkGlobal.isBroadcast && that.isShowStudentsNum?"add-display":"add-display-none"} style={{color:tmpColor,verticalAlign:"middle"}} >{TkGlobal.isBroadcast? TkGlobal.language.languageData.broadcast.onlineNumber + that.state.onlineNum:""}</span>
                { TkGlobal.isClient?undefined:!TkGlobal.playback ?  <NetworkStatusSmart />: undefined }
                <AudioPlayerSmart />
            </article>
        )
    };
};
export default  LeftHeaderSmart;

