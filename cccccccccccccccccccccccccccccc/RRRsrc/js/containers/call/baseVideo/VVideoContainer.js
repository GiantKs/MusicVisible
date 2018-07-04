/**
 * 视频显示部分-底部和右侧所有视频组件的Smart模块
 * @module BaseVideoSmart
 * @description   承载左侧部分-底部所有组件
 * @author xiagd
 * @date 2017/08/11
 */

'use strict';
import React from 'react';
import ServiceRoom from 'ServiceRoom' ;
import TkGlobal from 'TkGlobal';
import TkUtils from 'TkUtils';
import CoreController from 'CoreController';
import TkConstant from "TkConstant";
import ServiceSignalling from "ServiceSignalling";
import eventObjectDefine from 'eventObjectDefine';
import CommonVideoSmart from "./commonVideoSmart";

class VVideoContainer extends React.Component{
    constructor(props){
        super(props);
        this.state={
            pictureInPictureClassnameFromTeacherStream:undefined ,
            pictureInPictureClassnameFromStudentStream:undefined ,
            teacherStream:undefined,
            studentStream:undefined,
            areaExchangeFlag: false,
        };
        this.listernerBackupid = new Date().getTime()+'_'+Math.random() ;
        this.mainPictureInPictureStreamRole = undefined ;
        this.fullScreenType = undefined ;
        this.foregroundpicUrl = undefined ;
        this.teacherCss="video-chairman-wrap";
        this.studentCss="video-hearer-wrap";
    };

    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamSubscribed_video, this.handlerStreamSubscribed.bind(this) , this.listernerBackupid ); //stream-subscribed事件：订阅事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamRemoved_video, this.handlerStreamRemoved.bind(this)  , this.listernerBackupid ); //stream-remove事件：取消订阅事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamAdded_video, this.handlerStreamAdded.bind(this)  , this.listernerBackupid ); //stream-added事件：增加事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomConnected, this.handlerRoomConnected.bind(this)  , this.listernerBackupid ); //Room-Connected事件：房间连接事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDisconnected,this.handlerRoomDisconnected.bind(this) , this.listernerBackupid); //Disconnected事件：失去连接事件
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , this.handlerRoomDelmsg.bind(this), this.listernerBackupid); //roomDelmsg事件 下课事件 classBegin
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPubmsg , this.handlerRoomPubmsg.bind(this), this.listernerBackupid); //roomPubmsg事件  上课事件 classBegin
        eventObjectDefine.CoreController.addEventListener( 'endClassbeginShowLocalStream', this.handlerEndClassbeginShowLocalStream.bind(this), this.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener( 'areaExchange', this.handlerAreaExchange.bind(this) ,this.listernerBackupid  ); // 区域交换事件监听
        eventObjectDefine.CoreController.addEventListener( "receive-msglist-ClassBegin" , this.handlerReceiveMsglistClassBegin.bind(this), this.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener( "receive-msglist-FullScreen" , this.handlerReceiveMsglistFullScreen.bind(this), this.listernerBackupid);
    };

    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        eventObjectDefine.CoreController.removeBackupListerner(this.listernerBackupid);
    };

    handlerAreaExchange(){
        this.setState({
            areaExchangeFlag: !this.state.areaExchangeFlag,
        });
    }

    handlerEndClassbeginShowLocalStream(){
        if(TkConstant.joinRoomInfo.isClassOverNotLeave){
            return ;
        }
        setTimeout(  () => {
            if(CoreController.handler.getAppPermissions('endClassbeginShowLocalStream')  ) { //下课后显示本地视频权限,并且是老师
                if( (TkConstant.hasRole.roleChairman && !this.state.teacherStream) || (TkConstant.hasRole.roleStudent && !this.state.studentStream) ){
                    this._addLocalStreamToVideoContainer();
                }
            }
        }, 250);
    };

    getRoomType(){
        let roomType = undefined ;
        if( ServiceRoom.getTkRoom() ){
            roomType = ServiceRoom.getTkRoom().getRoomType();
        }
        return roomType;
    };


    isTeacher(userID){
        let user = this.getUser(userID);
        if(!user){L.Logger.warning('[vv->isTeacher]user is not exist  , user id:'+userID+'!');} ;
        if (user && user.role === TkConstant.role.roleChairman) {
            return true;
        }
        return false;
    }

    handlerRoomConnected(roomEvent) {
        if(TkGlobal.classBegin || TkConstant.joinRoomInfo.autoClassBegin){ //如果上课了或者自动上课，不生成本地流
            return;
        }
        if(  !TkConstant.hasRoomtype.oneToOne && TkConstant.hasRole.roleChairman ){
            this._addLocalStreamToVideoContainer();
        }else if( (TkConstant.hasRoomtype.oneToOne ) ){
            this._addLocalStreamToVideoContainer();
        }
    }

    handlerStreamAdded(roomEvent){
        let stream = roomEvent.stream ;
        if(stream.extensionId === ServiceRoom.getTkRoom().getMySelf().id ){
            if(  !TkConstant.hasRoomtype.oneToOne && TkConstant.hasRole.roleChairman ){
                this._addRemoteStreamToVideoContainer(ServiceRoom.getTkRoom().getMySelf().id  , ServiceRoom.getLocalStream() );
            }else if( (TkConstant.hasRoomtype.oneToOne) ){
                this._addRemoteStreamToVideoContainer(ServiceRoom.getTkRoom().getMySelf().id , ServiceRoom.getLocalStream() );
            }
        }
    }

    handlerStreamSubscribed(streamEvent){
        if(streamEvent) {
            let stream = streamEvent.stream;
            if(  !TkConstant.hasRoomtype.oneToOne ){
                this._addRemoteStreamToVideoContainer(stream.extensionId , stream);
            }else if( (TkConstant.hasRoomtype.oneToOne ) ){
                this._addRemoteStreamToVideoContainer(stream.extensionId , stream);
            }
        }
    };

    handlerStreamRemoved(streamEvent){
        let stream = streamEvent.stream;
        if(this.fullScreenType === 'stream_video' &&  this.fullScreenStreamExtensionId === stream.extensionId  ){
            ServiceSignalling.sendSignallingFromFullScreen({} , true);
        }
        if(  !TkConstant.hasRoomtype.oneToOne ){
            stream.hide();
            this._addRemoteStreamToVideoContainer(stream.extensionId , undefined);
        }else if( (TkConstant.hasRoomtype.oneToOne ) ){
            stream.hide();
            this._addRemoteStreamToVideoContainer(stream.extensionId , undefined);
        }
    };

    handlerRoomDisconnected(recvEventData){
        this._clearAllStream();
    };

    handlerRoomDelmsg(recvEventData){
        let delmsgData = recvEventData.message ;
        switch(delmsgData.name) {
            case "ClassBegin":
                if(TkConstant.joinRoomInfo.isClassOverNotLeave){
                    return ;
                }
                this._clearAllStream();              
                setTimeout(  () => {
                    if( CoreController.handler.getAppPermissions('endClassbeginShowLocalStream')  ) { //下课后显示本地视频权限,并且是老师
                        if( (TkConstant.hasRole.roleChairman && !this.state.teacherStream) || (TkConstant.hasRole.roleStudent && !this.state.studentStream) ){
                            this._addLocalStreamToVideoContainer();
                        }
                    }
                }, 250);
                break;
            case "FullScreen":
                this.mainPictureInPictureStreamRole = undefined ;
                this.fullScreenType = undefined;
                this.foregroundpicUrl = undefined ;
                this.setState({pictureInPictureClassnameFromTeacherStream:undefined});
                this.setState({pictureInPictureClassnameFromStudentStream:undefined});
                break;
        }
    }

    videoOnDoubleClick(stream , source , event){ //双击视频全屏
		if(! CoreController.handler.getAppPermissions('dblclickDeviceVideoFullScreenRight')){return ; } ;
		let _launchFullscreenToVideo = ()=>{
            if( TkUtils.tool.isFullScreenStatus() ) {
                TkUtils.tool.exitFullscreen();
            }else{
                if(stream){
                    let targetVideo = document.getElementById('player_'+(TkGlobal.isClient? stream.extensionId : stream.getID() ));
                    if(targetVideo){
                        TkUtils.tool.launchFullscreen(targetVideo);
                    }
                }
            }
        };
		if(TkGlobal.classBegin){
            if( CoreController.handler.getAppPermissions('pictureInPicture') ){
                if(source === 'studentStream' && this.mainPictureInPictureStreamRole === undefined){ //双击的是学生的视频，并且没有画中画
                    if(stream){
                        _launchFullscreenToVideo();
                    }else{
                        return ;
                    }
                }else if(source === 'teacherStream' && this.mainPictureInPictureStreamRole === undefined && !stream){ //老师没有开启视频时，双击视频窗无效，不开启全屏
                    return ;
                }else{
                    if(this.fullScreenType === undefined){
                        let data = {
                            fullScreenType:'stream_video' ,
                            needPictureInPictureSmall:true ,
                            mainPictureInPictureStreamRoleStreamRole:source === 'teacherStream'? TkConstant.role.roleChairman:TkConstant.role.roleStudent,
                            fullScreenStreamExtensionId:stream?stream.extensionId:''
                        };
                        let isDelMsg = false ;
                        ServiceSignalling.sendSignallingFromFullScreen(data , isDelMsg);
                    }else if(this.fullScreenType === 'stream_video'){
                        if( (source === 'teacherStream' && this.mainPictureInPictureStreamRole === TkConstant.role.roleChairman) || (source === 'studentStream' && this.mainPictureInPictureStreamRole === TkConstant.role.roleStudent)  ) {
                            ServiceSignalling.sendSignallingFromFullScreen({} , true);
                        }else{
                            let mimeticPubmsgData = {  //模拟的FullScreen信令数据
                                data:{
                                    fullScreenType:this.fullScreenType ,
                                    needPictureInPictureSmall:true ,
                                    mainPictureInPictureStreamRoleStreamRole:this.mainPictureInPictureStreamRole === TkConstant.role.roleChairman ? TkConstant.role.roleStudent:TkConstant.role.roleChairman,
                                    fullScreenStreamExtensionId:this.fullScreenStreamExtensionId
                                }
                            };
                            this._handlerSignallingFullScreen(mimeticPubmsgData ); //本地切换,不是远程数据控制
                        }
                    }
                }
            }else{
                if( (source === 'teacherStream' &&  this.state.pictureInPictureClassnameFromTeacherStream === undefined) || (source === 'studentStream' &&  this.state.pictureInPictureClassnameFromStudentStream === undefined)  ){
                    _launchFullscreenToVideo();
                }
            }
        }
        if(event){
            event.preventDefault();
            event.stopPropagation();
        }
        return false ;
    };


    handlerReceiveMsglistClassBegin(recvEventData){
        if(TkGlobal.isBroadcast || TkGlobal.playback ){//是直播或者回放不需要移除数据流
            return ;
        }
        this._clearAllLocalStream();
    }

    handlerReceiveMsglistFullScreen(recvEventData){
        let {FullScreenArray} = recvEventData.message ;
        this._handlerSignallingFullScreen(FullScreenArray[0]);
    };

    handlerRoomPubmsg(recvEventData){
        let pubmsgData = recvEventData.message;
        switch(pubmsgData.name) {
            case "ClassBegin":
                if(TkGlobal.isBroadcast || TkGlobal.playback ){//是直播或者回放不需要移除数据流
                    return ;
                }
                // 清空音视频流
                this._clearAllLocalStream();
                break;
            case "FullScreen":
                this._handlerSignallingFullScreen(pubmsgData);
                break;
        }
    };
    
    getUser(userid){
        if( !ServiceRoom.getTkRoom() ){
            return undefined ;
        }
        return ServiceRoom.getTkRoom().getUser(userid);
    }
    
    /*添加本地视频流到容器中*/
    _addLocalStreamToVideoContainer(){
        if(CoreController.handler.getAppPermissions('localStream') ){
            if( TkConstant.hasRole.roleChairman){
                this.setState({
                    teacherStream: ServiceRoom.getLocalStream()
                });
            }else if( TkConstant.hasRole.roleStudent) {
                this.setState({
                    studentStream: ServiceRoom.getLocalStream()
                });
            }
        }
    };
    
    /*添加远程视频流到容器中*/
    _addRemoteStreamToVideoContainer(userid , stream){
        if(this.isTeacher(userid) === true){
            this.setState({
                teacherStream: stream
            });
        }else if(this.getUser(userid) && this.getUser(userid).role ===TkConstant.role.roleStudent){
            this.setState({
                studentStream: stream
            });
        }
    }
    
    /*清空所有的视频流*/
    _clearAllStream(){
        this.setState({ // 清空音视频流
            teacherStream:undefined ,
            studentStream:undefined,
        });
    };

    /*清空所有的本地视频流*/
    _clearAllLocalStream(){
        if(this.state.teacherStream && this.state.teacherStream.local && this.state.teacherStream.getID() === 'local'){
            this.setState({ teacherStream:undefined });
        }
        if(this.state.studentStream && this.state.studentStream.local && this.state.studentStream.getID() === 'local'){
            this.setState({ studentStream:undefined });
        }
    };

    /*处理信令FullScreen*/
    _handlerSignallingFullScreen(pubmsgData){
        this.fullScreenType = pubmsgData.data.fullScreenType;
        this.foregroundpicUrl = undefined ;
        this.fullScreenStreamExtensionId = undefined ;
        switch (pubmsgData.data.fullScreenType){
            case 'stream_video':
                this.fullScreenStreamExtensionId = pubmsgData.data.fullScreenStreamExtensionId ;
                if(TkConstant.hasRole.roleStudent){
                    this.mainPictureInPictureStreamRole = TkConstant.role.roleChairman;
                    this.foregroundpicUrl = TkConstant.SERVICEINFO.address+TkConstant.joinRoomInfo.foregroundpic ;
                    this.setState({pictureInPictureClassnameFromTeacherStream:'pictureInPicture big '+pubmsgData.data.fullScreenType});
                    this.setState({pictureInPictureClassnameFromStudentStream:undefined});
                }else{
                    if(pubmsgData.data.mainPictureInPictureStreamRoleStreamRole === TkConstant.role.roleChairman){
                        this.mainPictureInPictureStreamRole = pubmsgData.data.mainPictureInPictureStreamRoleStreamRole ;
                        this.setState({pictureInPictureClassnameFromTeacherStream:'pictureInPicture big '+pubmsgData.data.fullScreenType});
                        if(pubmsgData.data.needPictureInPictureSmall){
                            this.setState({pictureInPictureClassnameFromStudentStream:'pictureInPicture small '+pubmsgData.data.fullScreenType});
                        }else{
                            this.setState({pictureInPictureClassnameFromStudentStream:undefined});
                        }
                    }else if( pubmsgData.data.mainPictureInPictureStreamRoleStreamRole === TkConstant.role.roleStudent ){
                        this.mainPictureInPictureStreamRole = pubmsgData.data.mainPictureInPictureStreamRoleStreamRole ;
                        this.setState({pictureInPictureClassnameFromStudentStream:'pictureInPicture big '+pubmsgData.data.fullScreenType});
                        if(pubmsgData.data.needPictureInPictureSmall){
                            this.setState({pictureInPictureClassnameFromTeacherStream:'pictureInPicture small '+pubmsgData.data.fullScreenType});
                        }else{
                            this.setState({pictureInPictureClassnameFromTeacherStream:undefined});
                        }
                    }
                }
                break;
            default:
                if(pubmsgData.data.needPictureInPictureSmall){
                    if(TkConstant.hasRole.roleChairman){
                        this.mainPictureInPictureStreamRole = undefined;
                        this.setState({pictureInPictureClassnameFromTeacherStream:undefined});
                        this.setState({pictureInPictureClassnameFromStudentStream:'pictureInPicture small '+pubmsgData.data.fullScreenType});
                    }else{
                        this.mainPictureInPictureStreamRole = undefined;
                        this.setState({pictureInPictureClassnameFromStudentStream:undefined});
                        this.setState({pictureInPictureClassnameFromTeacherStream:'pictureInPicture small '+pubmsgData.data.fullScreenType});
                    }
                }
                break;
        }
    };

    render(){
        return (
            <div id={this.props.id || 'participants'} className={"clear-float video-participants-vessel " + (this.state.areaExchangeFlag ? 'areaExchange' : '')}  style={{display:TkGlobal.doubleScreen?"none":""}}>
                <CommonVideoSmart hasDragJurisdiction = {false} videoDumbClassName={"vvideo"}  direction={'vertical'} mainPictureInPictureStreamRole={this.mainPictureInPictureStreamRole} foregroundpicUrl={this.foregroundpicUrl}
                      videoOnDoubleClick={this.videoOnDoubleClick.bind(this , this.state.teacherStream , 'teacherStream')} pictureInPictureClassname={this.state.pictureInPictureClassnameFromTeacherStream}
                      className={this.teacherCss}  stream={this.state.teacherStream} id={this.state.teacherStream?this.state.teacherStream.extensionId:undefined}  />
                {( this.getRoomType()===TkConstant.ROOMTYPE.oneToOne)?
                    <CommonVideoSmart  hasDragJurisdiction = {false} videoDumbClassName={"vvideo"} direction={'vertical'} mainPictureInPictureStreamRole={this.mainPictureInPictureStreamRole} foregroundpicUrl={this.foregroundpicUrl}
                                       videoOnDoubleClick={this.videoOnDoubleClick.bind(this , this.state.studentStream ,'studentStream')} pictureInPictureClassname={this.state.pictureInPictureClassnameFromStudentStream}
                                       className={this.studentCss}   stream={this.state.studentStream} id={this.state.studentStream?this.state.studentStream.extensionId:undefined}  /> :undefined  }
            </div>
        )
    };
};

export default  VVideoContainer;