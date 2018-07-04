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
import DestTop from '../../desktopShare/share.js';

class LeftVesselSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            bottomVesselSmartHeightRem:0,
            destTopStream:undefined,
            destTopFlag:false,
            teacher:false,
            shareType: -1,
        };
        this.listernerBackupid =  new Date().getTime()+'_'+Math.random();

        this.teacher=false;
        // this.destTopFlag=false;
        this.disconnectedDesttop = false;
        //this.destTopFlag=false;
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
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPubmsg , that.handlerRoomPubmsg.bind(that), that.listernerBackupid); //roomPubmsg事件 桌面共享事件
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that), that.listernerBackupid); //roomDelmsg事件 下课事件 classBegin
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
            defalutFontSize = defalutFontSize || TkGlobal.windowInnerWidth / TkConstant.STANDARDSIZE ;
            if (this.refs.bottomVesselSmart && ReactDom.findDOMNode(this.refs.bottomVesselSmart)) {
                let bottomVesselSmartHeight =  ReactDom.findDOMNode(this.refs.bottomVesselSmart).clientHeight / defalutFontSize ;
                this.state.bottomVesselSmartHeightRem = bottomVesselSmartHeight;
                this.setState({bottomVesselSmartHeightRem:this.state.bottomVesselSmartHeightRem});
            }
        },0) ;
    };

    handlerStreamSubscribed(streamEvent){
        let that = this;
        if (streamEvent) {
            let stream = streamEvent.stream;
            if(stream.screen){
                that.setState({
                    destTopFlag:true
                });
                // this.destTopFlag = true;
                const userid = ServiceRoom.getTkRoom().getMySelf().id;
                if( this.isTeacher(userid)  === false  ) {
                    that.setState({
                        destTopStream:stream
                    });

                } else {
                    // that.setState({
                    //     teacher:true
                    // });
                    this.teacher = true;
                }
            }
        }
    };

    handlerStreamRemoved(removeEvent){
        let that = this;

        if (removeEvent) {
            let stream = removeEvent.stream;
            if(stream.screen){ //
                stream.hide();
                const userid = ServiceRoom.getTkRoom().getMySelf().id;
                if( this.isTeacher(userid)  === false  ) {
                    that.setState({
                        destTopFlag:false
                    });
                    // this.destTopFlag = false;
                    that.setState({
                        destTopStream:undefined
                    });

                }
                if( this.isTeacher(userid)) {
                    that.setState({
                        destTopStream:undefined
                    });

                }
            }
        }

    }

    handlerStreamAdded(addEvent){
        let that = this;
        if(TkGlobal.playback){ //回放就跳过stream-add
            return ;
        }
        let stream = addEvent.stream ;

        if(stream.screen){
            const userid = ServiceRoom.getTkRoom().getMySelf().id;
            that.setState({
                destTopFlag:true
            });
            // this.destTopFlag = true;

            if( this.isTeacher(userid)  === false  ) {
                /*that.setState({
                    destTopStream:stream
                });*/
            } else {
                /*that.setState({
                    teacher:true
                });*/
                this.teacher = true;
                that.setState({
                    destTopStream:stream
                });
            }
        }
    }

    handlerRoomDisconnectedScreen(recvEventData){
        let that = this;
        if( TkConstant.hasRole.roleChairman ) {
            that.setState({
                destTopStream:undefined
            });
            this.disconnectedDesttop = true;
        }
    }

    handlerRoomPubmsg(recvEventData){
        const that = this ;
        let pubmsgData = recvEventData.message ;
        switch(pubmsgData.name){
            case "LiveShareStream":{
                    that.handleShareStreamStart();
                    that.setState({
                        shareType: pubmsgData.data.type,
                        liveShareFlag:true,
                        destTopStream:"start"
                    });
                
                break;
            }
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
        }
    }

    _unScreenSharing() {
        let that = this;
        let destTopStream = that.state.destTopStream;
        that.setState({
            destTopFlag:false
        });
        //this.destTopFlag = false;
        ServiceSignalling.unpublishDeskTopShareStream(destTopStream);
    }

    //判断用户是否是老师
    isTeacher(userID){

        const user = ServiceRoom.getTkRoom().getUsers()[userID];
        if (user && user.role === TkConstant.role.roleChairman) {
            return true;
        }
        return false;
    }

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
                ServiceSignalling.publishDeskTopShareStream(stream);
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
        let {styleJson} = this.props ;
       
        
        return (
            <article style={styleJson} id="main_content_tool_lc_video_container" className="add-fl clear-float tool-and-literally-and-othervideo-wrap add-position-relative">
                {/*工具、白板、其它视频区域*/}
                <DestTop isTeacher={this.teacher} destTopFlag = {this.state.destTopFlag} unScreenSharing = {that._unScreenSharing.bind(that) } style = { this.teacher || that.state.destTopStream!==undefined ?"block":"none"} stream = {!this.teacher?that.state.destTopStream:undefined} bottomVesselSmartHeightRem={this.state.bottomVesselSmartHeightRem} shareType={that.state.shareType} />;
                <TopVesselSmart  bottomVesselSmartHeightRem={this.state.bottomVesselSmartHeightRem} />;
                <BottomVesselSmart  ref="bottomVesselSmart" />
                <GiftAnimationSmart /> {/*礼物动画*/}
            </article>
        )
    };
};
export default  LeftVesselSmart;

