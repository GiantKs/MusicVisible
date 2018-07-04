/**
 * 主体容器-右边所有组件的Smart模块
 * @module RightVesselSmart
 * @description   承载右边的所有组件
 * @author QiuShao
 * @date 2017/08/08
 */


'use strict';
import React from 'react';
import ReactDom from 'react-dom';
import eventObjectDefine from 'eventObjectDefine';
import TkConstant from 'TkConstant';
import ServiceRoom from 'ServiceRoom' ;
import TkGlobal from "TkGlobal";
import VVideoContainer from "../../baseVideo/VVideoContainer";
import ChairmanDefaultVideo from "../../baseVideo/ChairmanDefaultVideo";
import Video from "../../baseVideo/index";
import ChatBox from '../../../chatroom'
import TkUtils from 'TkUtils';
import WebAjaxInterface from "WebAjaxInterface" ;

class RightVesselSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            videoContainerHeightRem:0,
            pullUrl:undefined,
            rtmpUrl:undefined,
            broadcastFlag:undefined,
            userRole:undefined,
            updateWindow:false,
            areaExchangeFlag: false,
            disConnectedLive:false,
        };
        this.listernerBackupid =  new Date().getTime()+'_'+Math.random();
        this.userRole = undefined;
        this.startTime = undefined;
        this.endTime = undefined;
        //this.pullUrl = undefined;
        //this.playType = 'flv';
        this.disconnectedDesttop = false;
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this ;
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomConnected, that.handlerRoomConnected.bind(that)  , that.listernerBackupid ); //Room-Connected事件：房间连接事件
        eventObjectDefine.Window.addEventListener( TkConstant.EVENTTYPE.WindowEvent.onResize , that.handlerOnResize.bind(that) , that.listernerBackupid );
        eventObjectDefine.CoreController.addEventListener( 'receiveStreamComplete' , that.handlerReceiveStreamComplete.bind(that) , that.listernerBackupid );
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg, that.handlerRoomDelmsg.bind(that), that.listernerBackupid); //roomDelmsg事件 下课事件 classBegin
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPubmsg, that.handlerRoomPubmsg.bind(that), that.listernerBackupid); //roomPubmsg事件  上课事件 classBegin
        eventObjectDefine.CoreController.addEventListener( "receive-msglist-ClassBegin" , that.handlerClassBegin.bind(that), that.listernerBackupid); //roomPubmsg事件
        eventObjectDefine.CoreController.addEventListener( 'areaExchange', that.handlerAreaExchange.bind(that) ,that.listernerBackupid  ); // 区域交换事件监听
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDisconnected,that.handlerRoomDisconnected.bind(that) , that.listernerBackupid); //Disconnected事件：失去连接事件
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPlaybackDuration , that.handlerRoomPlaybackDuration.bind(that) , that.listernerBackupid ); //直播回放开始结束
        that.handlerReceiveStreamComplete({type:'receiveStreamComplete' , message:{right:true}});
        //that._loadReConnected();
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        const that = this ;
        eventObjectDefine.Window.removeBackupListerner(that.listernerBackupid);
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid);
    };
    componentDidUpdate(prevProps , prevState){ //在组件完成更新后立即调用。在初始化时不会被调用
        const that = this ;
        if(that.updateChairmanDefaultVideo ||  that.updateVideoFromPullUrl || that.updateVVideoContainerl ){
            that.updateChairmanDefaultVideo = that.updateChairmanDefaultVideo ?  false : that.updateChairmanDefaultVideo;
            that.updateVideoFromPullUrl = that.updateVideoFromPullUrl ?  false : that.updateVideoFromPullUrl;
            that.updateVVideoContainerl = that.updateVVideoContainerl ?  false : that.updateVVideoContainerl;
            that.handlerReceiveStreamComplete({type:'receiveStreamComplete' , message:{right:true}});
        }
    };


    /*共享大小根据比例自适应*/
    resizeShareByScalc(parentWidth,parentHeight,selfWidth,selfHeight){
        let watermarkImageScalc = 16/9;

        let fatherContainerConfiguration = {} ;
        let width = 0 , height = 0  , minWidth = 320 , minHeight = 240;

        if(parentHeight*watermarkImageScalc < parentWidth ){
            width = Math.round( parentHeight * watermarkImageScalc ) ;
            height =  Math.round( parentHeight ) ;
            fatherContainerConfiguration['top'] = 0  + '%' ;
            fatherContainerConfiguration['left'] = 50  + '%';
            fatherContainerConfiguration['marginTop'] = 0  + 'px' ;
            fatherContainerConfiguration['marginLeft'] = (parentWidth- width )/2+ 'px'  ;
            fatherContainerConfiguration['width'] = width + 'px';
            fatherContainerConfiguration['height'] = height + 'px';
        }else{
            width = Math.round( parentWidth  )  ;
            height = Math.round( parentWidth /watermarkImageScalc )  ;

            fatherContainerConfiguration['top'] = 50  + '%' ;
            fatherContainerConfiguration['left'] = 0  + '%';
            fatherContainerConfiguration['marginTop'] =  (parentHeight-height)/2 + 'px' ;
            fatherContainerConfiguration['marginLeft'] =  0+'px' ;
            fatherContainerConfiguration['width'] = width+ 'px' ;
            fatherContainerConfiguration['height'] = height + 'px';
        }

        return fatherContainerConfiguration;

    }

    handlerAreaExchange(){

        const that = this;
        /*let flashCom  = that.refs.rightVideoContainerElement;
        if(!this.state.areaExchangeFlag){
            //Log.error("flashCom.refs.broadCastVideo.childNodes[0] === ", flashCom,flashCom.refs.broadCastVideo);
            let parentWidth = flashCom.refs.broadCastVideo.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[0].offsetWidth;
            let parentHeight = flashCom.refs.broadCastVideo.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[0].offsetHeight;

            let fatherContainerConfiguration = that.resizeShareByScalc(parentWidth,parentHeight,0,0);

            flashCom.refs.broadCastVideo.childNodes[0].style.width = fatherContainerConfiguration['width'];
            flashCom.refs.broadCastVideo.childNodes[0].style.height = fatherContainerConfiguration['height'];
            flashCom.refs.broadCastVideo.childNodes[0].style.marginTop = fatherContainerConfiguration['marginTop'];
            flashCom.refs.broadCastVideo.childNodes[0].style.marginLeft = fatherContainerConfiguration['marginLeft'];

        } else {
            flashCom.refs.broadCastVideo.childNodes[0].style.width = '100%';
            flashCom.refs.broadCastVideo.childNodes[0].style.height = '100%';
        }
*/
        this.setState({
            areaExchangeFlag: !this.state.areaExchangeFlag,
        });

    }

    handlerRoomConnected(roomEvent){
        let that = this;

        let mySelf = ServiceRoom.getTkRoom().getMySelf();
        let roomVideotype = ServiceRoom.getTkRoom().getRoomProperties().videotype;

        that.setState({
            userRole:mySelf.role ,
        });

        if(TkGlobal.playback && mySelf.role ===  TkConstant.role.rolePlayback ){
            that.setState({
                pullUrl: TkGlobal.liveVideoFile ,
                rtmpUrl: TkGlobal.liveVideoFile,
            });
        }


        if(mySelf.role ===  TkConstant.role.roleAudit ||(mySelf.role === TkConstant.role.roleTeachingAssistant && TkConstant.joinRoomInfo.roomtype === 10)) {
            let room = ServiceRoom.getTkRoom();
            let roomProperties = ServiceRoom.getTkRoom().getRoomProperties();
            let hlsPullProtocol = roomProperties.pullConfigure.HLS;
            let flvPullProtocol = roomProperties.pullConfigure.HDL;
            let rtmpProtocol = roomProperties.pullConfigure.RTMP;
            //let pushProtocol = roomProperties.pushConfigure.RTMP;

            let pullUrl = '';
            let rtmpUrl = '';

            if(rtmpProtocol !="" && rtmpProtocol!==undefined) {
                rtmpUrl = rtmpProtocol[0].originPullUrl;
            }
            this.playType="flash";

            that.setState({
                pullUrl: pullUrl ,
                rtmpUrl: rtmpUrl,
                updateWindow:!this.state.updateWindow
            });
        }
    }


    handlerRoomPlaybackDuration(recvEventData){ //回放开始，结束时间
        const that = this ;
        let {startTime , endTime} = recvEventData.message ;

        that.startTime = startTime;
        that.endTime =  endTime;
        //that.setState({startTime:startTime , endTime:endTime , currTime:startTime });
    };

    handlerRoomDisconnected(recvEventData){//断网事件
        this._stopBroadcast();
    }

    handlerRoomPubmsg(recvEventData){
        const that = this ;

        if(TkGlobal.isBroadcast){//是直播的话才处理
            let pubmsgData = recvEventData.message
            switch(pubmsgData.name)
            {
                case "ClassBegin":{
                    setTimeout(that._startBroadcast(),10000);  //网宿接口推流和录制请求相差10秒
                    //上课要设置变量
                   that.setState({
                       broadcastFlag:true
                   });
                    break;
                }
                case "LiveEvictSpecificUser":
                    this.playType="";
                    that.setState({
                        pullUrl: "" ,
                        rtmpUrl: "",
                        broadcastFlag:false,
                    });
                    break;
            }
        }
    };

    handlerRoomDelmsg(recvEventData){
        const that = this ;
        if(TkGlobal.isBroadcast) {//是直播的话才处
            let pubmsgData = recvEventData.message;
            switch (pubmsgData.name) {
                case "ClassBegin": {
                    this._stopBroadcast();
                    break;
                }
            }
        }
    }

    handlerClassBegin(event){
        const that = this ;
        if(TkGlobal.isBroadcast) {//是直播的话才处理
            that._startBroadcast();
            that.setState({
                broadcastFlag:true
            });
        }
    }

    _startBroadcast(){
        if(TkGlobal.isBroadcastClient && TkConstant.hasRole.roleChairman && TkGlobal.classBegin ) {
            ServiceRoom.setLocalStream(
                TK.Stream({
                    audio: true,
                    video: true,
                    data: false,
                    extensionId: ServiceRoom.getTkRoom().getMySelf().id,
                    attributes: {type: 'video'}
                }, TkGlobal.isClient)
            );

            ServiceRoom.getTkRoom().listenCloseEvent();
            let {pullWidth,pullHeight} = TkUtils.getWidthAndHeight(ServiceRoom.getTkRoom().getRoomProperties().videotype);
            ServiceRoom.getLocalStream().create();
            ServiceRoom.getTkRoom().initBroadcast(TkConstant.joinRoomInfo.pushConfigure.RTMP, 10, 2, pullWidth, pullHeight);
            ServiceRoom.getTkRoom().startBroadcast(ServiceRoom.getLocalStream().extensionId);
        }
    }

    _stopBroadcast(){
        if(TkGlobal.isBroadcast && TkGlobal.isBroadcastClient && TkConstant.hasRole.roleChairman ){
            ServiceRoom.getTkRoom().stopBroadcast();
            ServiceRoom.getTkRoom().uninitBroadcast();
        }
        this.setState({
            broadcastFlag:undefined,
        });
    }

    _loadReConnected(){  //xgd 17-12-24 断网重连
        let that = this;
        if(TkGlobal.isBroadcastClient) { //重连直播,条件直播且客户端
            //Log.error("_loadReConnected() 2===");
            if (TkConstant.hasRole.roleChairman) {
                //Log.error("_loadReConnected() 3===");
                if(that.state.disConnectedLive) {

                    ServiceRoom.setLocalStream(
                        TK.Stream({
                            audio: true,
                            video: true,
                            data: false,
                            extensionId: ServiceRoom.getTkRoom().getMySelf().id,
                            attributes: {type: 'video'}
                        }, TkGlobal.isClient)
                    );


                    //WebAjaxInterface.roomStart(); //发送上课信令，并推流
                    let {pullWidth,pullHeight} = TkUtils.getWidthAndHeight(ServiceRoom.getTkRoom().getRoomProperties().videotype);
                    ServiceRoom.getTkRoom().initBroadcast(TkConstant.joinRoomInfo.pushConfigure.RTMP, 10, 2, pullWidth, pullHeight);
                    ServiceRoom.getTkRoom().startBroadcast(ServiceRoom.getLocalStream().extensionId);
                    //this.disconnectedDesttop = false;
                    that.setState({
                        disConnectedLive: false,
                    });

                }
            }
        }

    }

    handlerOnResize(recvEvent){
        let {defalutFontSize} = recvEvent.message || {};
        this._chatAutoHeight(defalutFontSize);
        /*if(this.state.areaExchangeFlag){
            let flashCom  = this.refs.rightVideoContainerElement;
            let parentWidth = flashCom.refs.broadCastVideo.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[0].offsetWidth;
            let parentHeight = flashCom.refs.broadCastVideo.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.childNodes[0].offsetHeight;
            let fatherContainerConfiguration = this.resizeShareByScalc(parentWidth,parentHeight,0,0);
            flashCom.refs.broadCastVideo.childNodes[0].style.width = fatherContainerConfiguration['width'];
            flashCom.refs.broadCastVideo.childNodes[0].style.height = fatherContainerConfiguration['height'];
            flashCom.refs.broadCastVideo.childNodes[0].style.marginTop = fatherContainerConfiguration['marginTop'];
            flashCom.refs.broadCastVideo.childNodes[0].style.marginLeft = fatherContainerConfiguration['marginLeft'];
        }*/

    };

    handlerReceiveStreamComplete(recvEvent){

        let {right} = recvEvent.message;
        if(right){
            this._chatAutoHeight();
        }
    };
    _chatAutoHeight(defalutFontSize){
        let that = this;
        defalutFontSize = defalutFontSize || window.innerWidth / TkConstant.STANDARDSIZE ;
        let videoContainerHeight = that.state.videoContainerHeightRem;            //xgd 2017-09-20
        if(that.state.userRole  === TkConstant.role.roleAudit || (that.state.userRole === TkConstant.role.roleTeachingAssistant && TkConstant.joinRoomInfo.roomtype ===10) ){
            var height = undefined;
            if(this.refs.rightVideoContainerElement !== undefined && ReactDom.findDOMNode(this.refs.rightVideoContainerElement).clientHeight !== undefined)
                height =  ReactDom.findDOMNode(this.refs.rightVideoContainerElement).clientHeight / defalutFontSize ;
            else{
                if(this.refs.rightVideoContainerElement_notPullUrl !== undefined && ReactDom.findDOMNode(this.refs.rightVideoContainerElement_notPullUrl).clientHeight !== undefined)
                    height =  ReactDom.findDOMNode(this.refs.rightVideoContainerElement_notPullUrl).clientHeight / defalutFontSize ;
            }
            if(videoContainerHeight && height == undefined){
                this.setState({videoContainerHeightRem:videoContainerHeight});
                return ;
            }
            videoContainerHeight = height ;
        }
        else{
            if(this.refs.rightVVideoContainerElement !== undefined && ReactDom.findDOMNode(this.refs.rightVVideoContainerElement).clientHeight !== undefined)
                videoContainerHeight =  ReactDom.findDOMNode(this.refs.rightVVideoContainerElement).clientHeight / defalutFontSize ;
        }
        if(videoContainerHeight){
            videoContainerHeight += 0.1 ;
        }
        this.setState({videoContainerHeightRem:videoContainerHeight});
    };

    /*视频显示组件*/
    _loadVideoComponent(){              //xgd 2017-09-20
        let that = this;
        let videoComponent = undefined ;
        let ieKernel = this.playType === "flash"?true:false;
        //let pullAdd = 'http://pull.talk-cloud.com/live/2c9d58972ccd4f95ac5c8c151082a4e5/playlist.m3u8';
        //Log.error("rightVessel.js _loadVideoComponent ===",TkGlobal.playback,that.state.userRole, TkConstant.role.rolePlayback);
        if(TkGlobal.playback && that.state.userRole === TkConstant.role.rolePlayback || that.state.userRole === TkConstant.role.roleAudit || (that.state.userRole === TkConstant.role.roleTeachingAssistant && TkConstant.joinRoomInfo.roomtype === 10)){
            if(that.state.broadcastFlag && this.state.pullUrl!==undefined && this.state.rtmpUrl!==undefined) {
                videoComponent = (
                    <div style = {{width: '3.9rem', height: '2.778rem',}}>
                        <Video ref="rightVideoContainerElement" id={'auditparticipants'} rtmpUrl={this.state.rtmpUrl} pullUrl={this.state.pullUrl} roomVideotype = {this.roomVideotype} ieKernel = {ieKernel} playType = {that.playType} startTime = {that.startTime} endTime = {that.endTime}/>;
                    </div>
                )
                if( that.updateVideoFromPullUrl == undefined){
                    that.updateVideoFromPullUrl = true ;
                }
            } else if((that.state.broadcastFlag===undefined || !that.state.broadcastFlag )&& this.state.pullUrl!==undefined){
                videoComponent = <ChairmanDefaultVideo  ref="rightVideoContainerElement_notPullUrl"  /> ;
                if( that.updateChairmanDefaultVideo == undefined){
                    that.updateChairmanDefaultVideo = true ;
                }
            }
        } else {
            videoComponent =  TkGlobal.isBroadcast ? 
                                (<div style = {{width: '3.9rem', height: '2.778rem',}}>
                                    <VVideoContainer ref="rightVVideoContainerElement" id={'participants'} roomVideotype = {this.roomVideotype} />
                                </div>) : 
                                <VVideoContainer ref="rightVVideoContainerElement" id={'participants'}  />;
            if( that.updateVVideoContainerl == undefined){
                that.updateVVideoContainerl = true ;
            }
        }
        return {
            videoComponent:videoComponent
        }
    }

    getBrowserKernel(){
        /*trident://IE内核;presto://opera内核;webKit://苹果、谷歌内核;gecko://火狐内核;webApp:Safari*/
        let that = this;
        let ieKernel = false;
        /*let {trident,presto,webKit,gecko,webApp} = TkUtils.getBrowserInfo().versions;


        if(trident || gecko){
            ieKernel = true;
        }
        if(webKit ){
            ieKernel = false;
        }*/
        if(Clappr.isSupportMSE()) {
            //L.Logger.debug( "MSE is supported." );
        } else {
            //L.Logger.debug( "MSE is unsupported." );
            //ieKernel = true;
        }
        return ieKernel;
    }

    render(){
        let that = this ;
        //this._loadReConnected();
        let {videoComponent} = this._loadVideoComponent();

        return (
            <article id="video_chat_container" className="video-container add-btn-hover-opacity add-position-relative add-fr" >{/*视频区域*/}
                {videoComponent}
                <ChatBox id={'chatbox'} videoContainerHeightRem={this.state.videoContainerHeightRem} ignoreIsBroadcast={TkGlobal.isMobile}  />{/* xueln 聊天室组件*/}

            </article>
        )
    };
};
export default  RightVesselSmart;

