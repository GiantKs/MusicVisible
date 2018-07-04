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
import ChatBox from '../../../chatroom/index';

class RightVesselSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            videoContainerHeightRem:0,
            pullUrl:undefined,
            broadcastFlag:undefined,
            userRole:undefined,
            updateWindow:false,
            areaExchangeFlag: false,
            updateState:false ,
        };
        this.listernerBackupid =  new Date().getTime()+'_'+Math.random();
        this.userRole = undefined;
        //this.pullUrl = undefined;
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this ;
        eventObjectDefine.Window.addEventListener( TkConstant.EVENTTYPE.WindowEvent.onResize , that.handlerOnResize.bind(that) , that.listernerBackupid );
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomConnected, that.handlerRoomConnected.bind(that)  , that.listernerBackupid ); //Room-Connected事件：房间连接事件
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that), that.listernerBackupid); //roomDelmsg事件 下课事件 classBegin
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPubmsg , that.handlerRoomPubmsg.bind(that), that.listernerBackupid); //roomPubmsg事件  上课事件 classBegin
        eventObjectDefine.CoreController.addEventListener( "receive-msglist-ClassBegin" , that.handlerClassBegin.bind(that), that.listernerBackupid); //roomPubmsg事件
        eventObjectDefine.CoreController.addEventListener( 'areaExchange', that.handlerAreaExchange.bind(that) ,that.listernerBackupid  ); // 区域交换事件监听
        eventObjectDefine.CoreController.addEventListener( "receive-msglist-FullScreen" , this.handlerReceiveMsglistFullScreen.bind(this), this.listernerBackupid);
        this._updateVideoContainerHeightRem();
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
        }
    };

    handlerAreaExchange(){
        this.setState({
            areaExchangeFlag: !this.state.areaExchangeFlag,
        });
    }

    handlerRoomConnected(roomEvent){
        let that = this;

        let userid = ServiceRoom.getTkRoom().getMySelf().id;
        let user = ServiceRoom.getTkRoom().getUsers()[userid];

        //that.userRole = user.role;

        that.setState({
            userRole:user.role ,
        });

        if(user.role ===  TkConstant.role.roleAudit) {
            let room = ServiceRoom.getTkRoom();
            let roomProperties = ServiceRoom.getTkRoom().getRoomProperties();
            let pullProtocol = roomProperties.pullConfigure.HLS;
            let pushProtocol = roomProperties.pushConfigure.RTMP;
            let pullUrl = pullProtocol[0].originPullUrl;
            if(pullUrl.indexOf("https://") == -1){
                pullUrl = 'https'+ pullUrl.split('http')[1];
            }
            //that.pullUrl = pullUrl;

            that.setState({
                pullUrl: pullUrl ,
                updateWindow:!this.state.updateWindow
            });
        }
        this._updateVideoContainerHeightRem();
    }

    handlerReceiveMsglistFullScreen(){
        this.setState({updateState:!this.state.updateState});
    };

    handlerRoomPubmsg(recvEventData){
        const that = this ;
        let pubmsgData = recvEventData.message
        switch(pubmsgData.name) {
            case "ClassBegin":
                if(TkGlobal.isBroadcast){//是直播的话才处理
                    //上课要设置变量
                    that.setState({
                        broadcastFlag:true
                    });
                }
                break;
            case "FullScreen":
                this.setState({updateState:!this.state.updateState});
                break;
        }

    };

    handlerRoomDelmsg(recvEventData){
        const that = this ;
        let pubmsgData = recvEventData.message;
        switch (pubmsgData.name) {
            case "ClassBegin":
                if(TkGlobal.isBroadcast) {//是直播的话才处理
                    that.setState({
                        broadcastFlag:false
                    });
                }
                break;
            case "FullScreen":
                this.setState({updateState:!this.state.updateState});
                break;
        }

    }

    handlerClassBegin(event){
        const that = this ;
        if(TkGlobal.isBroadcast) {//是直播的话才处理
            that.setState({
                broadcastFlag:true
            });
        }
    }

    handlerOnResize(recvEvent){
        this._updateVideoContainerHeightRem();
    };

    _loadVideoComponent(){              //xgd 2017-09-20
        let that = this;
        let videoComponent = undefined ;
        if(TkConstant.template !== 'template_sharktop'){
            //let pullAdd = 'http://pull.talk-cloud.com/live/2c9d58972ccd4f95ac5c8c151082a4e5/playlist.m3u8';
            if(that.state.userRole === TkConstant.role.roleAudit ){
                if(that.state.broadcastFlag && this.state.pullUrl!==undefined) {
                    videoComponent = <Video ref="rightVideoContainerElement" id={'auditparticipants'} pullUrl={this.state.pullUrl}/>;
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
                    (<div style = {{width: '3.9rem', height: '2.775rem',}}>
                        <VVideoContainer ref="rightVVideoContainerElement" id={'participants'}  />
                    </div>) :
                    <VVideoContainer ref="rightVVideoContainerElement" id={'participants'}  />;
                if( that.updateVVideoContainerl == undefined){
                    that.updateVVideoContainerl = true ;
                }
            }
        }
        return {
            videoComponent:videoComponent
        }
    }

    _updateVideoContainerHeightRem(){
        if( this.refs.verticalVideoContainerRef !== undefined && ReactDom.findDOMNode(this.refs.verticalVideoContainerRef) ){
            let verticalVideoContainerElement  = ReactDom.findDOMNode(this.refs.verticalVideoContainerRef) ;
            if(verticalVideoContainerElement){
                let defalutFontSize = TkGlobal.windowInnerWidth / TkConstant.STANDARDSIZE ;
                let videoContainerHeight =  verticalVideoContainerElement.clientHeight / defalutFontSize ;
                if(videoContainerHeight){
                    videoContainerHeight += 0.1 ;
                }
                this.setState({videoContainerHeightRem:videoContainerHeight});
            }
        }
    }

    render(){
        let {videoComponent} = this._loadVideoComponent();
        let {styleJson} = this.props ;
        return (
            <article  style={styleJson} id="video_chat_container" className={"video-container add-btn-hover-opacity add-position-relative add-fr "+(TkGlobal.isVideoInFullscreen?'videoInFullscreen':'')} >{/*视频区域*/}
                <div className="vertical-video-container" id="verticalVideoContainer" ref="verticalVideoContainerRef" >
                    {videoComponent}
                </div>
                <ChatBox id={'chatbox'} videoContainerHeightRem={this.state.videoContainerHeightRem} ignoreIsBroadcast={TkGlobal.isMobile}  />{/* xueln 聊天室组件*/}
            </article>
        )
    };
};
export default  RightVesselSmart;

