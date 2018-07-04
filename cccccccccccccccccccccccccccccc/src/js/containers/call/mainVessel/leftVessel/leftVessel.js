/**
 * 主体容器-左边所有组件的Smart模块
 * @module LeftVesselSmart
 * @description   承载左边的所有组件
 * @author QiuShao
 * @date 2017/08/08
 */
'use strict';
import React from 'react';
import ReactDom from 'react-dom';
import TkConstant from 'TkConstant';
import TkGlobal from 'TkGlobal';
import eventObjectDefine from 'eventObjectDefine';
import TopVesselSmart from './topVessel/topVessel';
import BottomVesselSmart from './bottomVessel/bottomVessel';
import GiftAnimationSmart from './giftAnimation/giftAnimation';
import CoreController from 'CoreController' ;
import ServiceRoom from 'ServiceRoom';
import ServiceSignalling from 'ServiceSignalling';
import DestTop from '../../../../components/video/share.js';
import TkUtils from 'TkUtils';

class LeftVesselSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            bottomVesselSmartHeightRem:0,
            destTopStream:undefined,
            destTopFlag:false,
            teacher:false,
            //liveShareFlag:false,
            shareType: -1,
        };
        this.listernerBackupid =  new Date().getTime()+'_'+Math.random();
        this.teacher=false;
        // this.destTopFlag=false;
        this.disconnectedDesttop = false;
        // this.shareType = -1;
        //this.liveShareFlag =false;
        //this.teacher = false;
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this ;
        eventObjectDefine.Window.addEventListener( TkConstant.EVENTTYPE.WindowEvent.onResize , that.handlerOnResize.bind(that) , that.listernerBackupid );
        eventObjectDefine.CoreController.addEventListener( 'receiveStreamComplete' , that.handlerReceiveStreamComplete.bind(that) , that.listernerBackupid );
        that.handlerReceiveStreamComplete({type:'receiveStreamComplete' , message:{right:false}});
        //eventObjectDefine.CoreController.addEventListener( 'destTopShareStream' , that.handlerDestTopShareStream.bind(that) , that.listernerBackupid );
        //eventObjectDefine.CoreController.addEventListener( 'undestTopShareStream' , that.handlerUndestTopShareStream.bind(that) , that.listernerBackupid );

        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamSubscribed_screen, that.handlerStreamSubscribed.bind(that), that.listernerBackupid); //stream-subscribed事件：订阅事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamAdded_screen, that.handlerStreamAdded.bind(that) , that.listernerBackupid); //stream-added事件：增加事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamRemoved_screen, that.handlerStreamRemoved.bind(that) , that.listernerBackupid);//
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDisconnected,that.handlerRoomDisconnectedScreen.bind(that) , that.listernerBackupid); //Disconnected事件：失去连接事件
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that), that.listernerBackupid); //roomDelmsg事件 下课事件 classBegin
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPubmsg , that.handlerRoomPubmsg.bind(that), that.listernerBackupid); //roomPubmsg事件 桌面共享事件
        //eventObjectDefine.CoreController.addEventListener( "liveShareStreamStart" , that.handleShareStreamStart.bind(that), that.listernerBackupid); // 共享事件
        //eventObjectDefine.CoreController.addEventListener( "liveShareStreamEnd" , that.handleShareStreamEnd.bind(that), that.listernerBackupid); // 共享事件
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        const that = this ;
        eventObjectDefine.Window.removeBackupListerner(that.listernerBackupid);
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid);
    };

    handlerOnResize(recvEvent){
        let {defalutFontSize} = recvEvent.message || {};
        this._TtpVesselSmartAutoHeight(defalutFontSize);
    };
    handlerReceiveStreamComplete(recvEvent){
        let {right} = recvEvent.message;
        if(!right){
            this._TtpVesselSmartAutoHeight();
        }
    };

    _TtpVesselSmartAutoHeight(defalutFontSize){
        setTimeout( () => {
            defalutFontSize = defalutFontSize || window.innerWidth / TkConstant.STANDARDSIZE ;
            if (this.refs.bottomVesselSmart && ReactDom.findDOMNode(this.refs.bottomVesselSmart)) {
                let bottomVesselSmartHeight =  ReactDom.findDOMNode(this.refs.bottomVesselSmart).clientHeight / defalutFontSize ;
                this.state.bottomVesselSmartHeightRem = bottomVesselSmartHeight;
                this.setState({bottomVesselSmartHeightRem:this.state.bottomVesselSmartHeightRem});
            }
        },0) ;
    };
    mouseMove (event) {
        if( !CoreController.handler.getAppPermissions('isChangeVideoSize') ){return ;} ;
        if (TkGlobal.changeVideoSizeEventName && TkGlobal.changeVideoSizeEventName !== null) {
            eventObjectDefine.CoreController.dispatchEvent({type:TkGlobal.changeVideoSizeEventName, message:{data:{event:event}},},false);
        }
    };
    mouseUp (event) {
        if( !CoreController.handler.getAppPermissions('isChangeVideoSize') ){return ;} ;
        //如果您想以一个异步的方式来访问事件属性，您应该对事件调用event.persist()。这将从事件池中取出合成的事件，并允许该事件的引用，使用户的代码被保留
        event.persist();//TkGlobal.changeVideoSizeMouseUpEventName
        if (TkGlobal.changeVideoSizeMouseUpEventName && TkGlobal.changeVideoSizeMouseUpEventName !== null) {
            eventObjectDefine.CoreController.dispatchEvent({type:TkGlobal.changeVideoSizeMouseUpEventName, message:{data:{event:event}},});
        }
    };

    /*直播桌面共享开始*/
    handleShareStreamStart(){
        let that = this;
        that.setState({
            destTopFlag: true,
        })
        // that.destTopFlag = true;
        const user = ServiceRoom.getTkRoom().getMySelf();
        if( that.isTeacher(user))
            that.teacher = true;
        else
            that.teacher = false;
        
    };

    /*直播桌面共享结束*/
    handleShareStreamEnd(){
        let that = this;
        // that.destTopFlag = false;
        that.setState({
            destTopStream:undefined,
            destTopFlag: false,
            shareType: -1,
        });
    }

    /*交互桌面共享流订阅*/
    handlerStreamSubscribed(streamEvent){
        let that = this;
        if (streamEvent) {
            let stream = streamEvent.stream;
            if(stream.screen){
                that.setState({
                    destTopFlag:true
                });
                // this.destTopFlag = true;
                const user = ServiceRoom.getTkRoom().getMySelf();
                if( this.isTeacher(user)  === false  ) {
                    that.setState({
                        destTopStream:stream
                    });

                } else {
                    /*that.setState({
                        teacher:true
                    });*/
                    this.teacher = true;
                }
            }
        }
    };

    /*交互桌面共享流移除*/
    handlerStreamRemoved(removeEvent){
        let that = this;

        if (removeEvent) {
            let stream = removeEvent.stream;
            if(stream.screen){ //
                stream.hide();
                const userid = ServiceRoom.getTkRoom().getMySelf().id;
                if( this.isTeacher(userid)  === false  ) {
                    // this.destTopFlag = false;
                    that.setState({
                        destTopStream:undefined,
                        destTopFlag: false,
                    });
                }
                if( this.isTeacher(userid)) {
                    // this.destTopFlag = false;
                    that.setState({
                        destTopStream:undefined,
                        destTopFlag: false,
                    });
                }
            }
        }

    }

    /*交互桌面共享流添加*/
    handlerStreamAdded(addEvent){
        let that = this;
        if(TkGlobal.playback){ //回放就跳过stream-add
            return ;
        }
        let stream = addEvent.stream ;

        if(stream.screen){
            const userid = ServiceRoom.getTkRoom().getMySelf().id;
            // this.destTopFlag = true;
            that.setState({
                destTopFlag: true,
            })
            if( this.isTeacher(userid)  === false  ) {

            } else {
                this.teacher = true;
                that.setState({
                    destTopStream:stream
                });
            }
        }
    }

    /*断网重连*/
    handlerRoomDisconnectedScreen(recvEventData){
        let that = this;
        TkGlobal.isDisconnected = true;
        if( TkConstant.hasRole.roleChairman ) {
            that.setState({
                destTopStream:undefined
            });
            this.disconnectedDesttop = true;
        }
    }

    handlerRoomDelmsg(recvEventData){
        const that = this ;
        let pubmsgData = recvEventData.message ;
        switch(pubmsgData.name)
        {
            case "ClassBegin":{
                if(this.state.destTopFlag) //只有共享,才取消共享
                    that._unScreenSharing();
                break;
            }
            case "LiveShareStream":{
                if(TkGlobal.isBroadcast){
                    that.handleShareStreamEnd();
                }
                break;
            }
        }
    }

    handlerRoomPubmsg(recvEventData){
        const that = this ;
        let pubmsgData = recvEventData.message ;
        switch(pubmsgData.name)
        {
            case "LiveShareStream":{
                if(TkGlobal.isBroadcast){
                    that.handleShareStreamStart();
                    that.setState({
                        shareType: pubmsgData.data.type,
                        destTopFlag:true,
                        destTopStream:"start"
                    });
                    //that.shareType =  pubmsgData.data.type

                }
                
                break;
            }
        }
    }

    _unScreenSharing() {
        let that = this;
        let destTopStream = that.state.destTopStream;
        that.setState({
            destTopFlag:false
        });
        // this.destTopFlag = false;

        if(!TkGlobal.isBroadcast ){
            ServiceSignalling.unpublishDeskTopShareStream(destTopStream);
            that.setState({
                destTopStream:undefined
            });
        } else if(TkGlobal.isBroadcast && TkGlobal.isClient){ //直播且客户端
            var ws = {
                id: 0,
                x:0,
                y:0,
                width:0,
                height:0,
                mixSpk: false,
                mixMic: false
            };
            ServiceRoom.getTkRoom().updateWindowSource(ws);  //更新窗口*/ //这么销毁不能停止共享，程序只能关闭
            ServiceRoom.getTkRoom().stopBroadcast(); //停止推流
            let {pullWidth,pullHeight} = TkUtils.getWidthAndHeight(ServiceRoom.getTkRoom().getRoomProperties().videotype);
            //ServiceRoom.getLocalStream().play(document.getElementById("vvideo"+ServiceRoom.getTkRoom().getMySelf().id));
            ServiceRoom.getTkRoom().uninitBroadcast();
            ServiceRoom.getTkRoom().initBroadcast(TkConstant.joinRoomInfo.pushConfigure.RTMP,10,2,pullWidth,pullHeight);
            ServiceRoom.getTkRoom().startBroadcast(ServiceRoom.getLocalStream().extensionId);
            eventObjectDefine.CoreController.dispatchEvent({type:'liveShareStreamEnd'});
            let isDelMsg = true;
            let id = 'shareStream_' + TkConstant.joinRoomInfo.serial;
            let toID = "__all";
            let data = {};
            let dot_not_save = true;
            let mySelf = ServiceRoom.getTkRoom().getMySelf();
            ServiceSignalling.sendSignallingFromLiveShareStream(isDelMsg, id, toID, data);
        }
    }

    //判断用户是否是老师
    isTeacher(user){

        //const user = ServiceRoom.getTkRoom().getUsers()[userID];
        if (user && user.role === TkConstant.role.roleChairman) {
            return true;
        }
        return false;
    }

    /*断网重连后的处理*/
    _loadDestTopComponent(){              //xgd 2017-10-11
        let that = this;
        let destTopComponent = undefined ;

        if(TkGlobal.classBegin && that.state.destTopFlag && this.disconnectedDesttop){
            if(that.state.destTopStream === undefined){ //断网重连 重新发送 xgd
                let eid = ServiceRoom.getTkRoom().getMySelf().id + ":screen";
                let stream = TK.Stream({
                    audio: true,
                    video: true,
                    screen: true,
                    data: false,
                    extensionId: eid,
                    attributes: {type: 'screen'},
                },true);
                if(!TkGlobal.isBroadcast) {
                    ServiceSignalling.publishDeskTopShareStream(stream);
                } else {
                    ServiceRoom.getTkRoom().stopBroadcast(); //停止推流
                    let pullWidth = 1920,pullHeight=1080;
                    ServiceRoom.getTkRoom().uninitBroadcast();
                    ServiceRoom.getTkRoom().initBroadcast(TkConstant.joinRoomInfo.pushConfigure.RTMP,10,2,pullWidth,pullHeight);
                    ServiceRoom.getTkRoom().startBroadcast(ServiceRoom.getLocalStream().extensionId);
                }
                this.disconnectedDesttop = false;
            }
            destTopComponent = <DestTop isTeacher={this.teacher} unScreenSharing = {that._unScreenSharing.bind(that) } stream = {that.state.destTopStream} bottomVesselSmartHeightRem={this.state.bottomVesselSmartHeightRem}/>;
        } else {
            destTopComponent =  <TopVesselSmart  bottomVesselSmartHeightRem={this.state.bottomVesselSmartHeightRem}   />;
        }

        return {
            destTopComponent:destTopComponent
        }
    }
    render(){
        let that = this ;
        let {destTopComponent} = this._loadDestTopComponent();
        // const {connectDropTarget} = that.props;

        return (
            <article onMouseUp={this.mouseUp.bind(that)} onMouseMove={that.mouseMove.bind(that)} id="main_content_tool_lc_video_container" className="add-fl clear-float tool-and-literally-and-othervideo-wrap add-position-relative">
                {/*工具、白板、其它视频区域*/}
                <DestTop isTeacher={this.teacher} destTopFlag = {this.state.destTopFlag} unScreenSharing = {that._unScreenSharing.bind(that) } style = { this.teacher || that.state.destTopStream!==undefined ?"block":"none"} stream = {!this.teacher?that.state.destTopStream:undefined} bottomVesselSmartHeightRem={this.state.bottomVesselSmartHeightRem} shareType={that.state.shareType} />;
                <TopVesselSmart  bottomVesselSmartHeightRem={this.state.bottomVesselSmartHeightRem}  style = {{display:that.state.destTopFlag?"none":"block"}} />;
                <BottomVesselSmart  ref="bottomVesselSmart" />
                <GiftAnimationSmart /> {/*礼物动画*/}
            </article>
        )
    };
};
export default  LeftVesselSmart;

