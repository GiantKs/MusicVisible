/**
 * 视频显示部分-底部和右侧所有视频组件的Smart模块
 * @module BaseVideoSmart
 * @description   承载左侧部分-底部所有组件
 * @author xiagd
 * @date 2017/08/11
 */

'use strict';
import React from 'react';
import ReactDom from 'react-dom';
import ServiceRoom from 'ServiceRoom' ;
import TkUtils from 'TkUtils' ;
import TkGlobal from 'TkGlobal' ;
import TkConstant from "TkConstant";
import eventObjectDefine from 'eventObjectDefine';
import CoreController from 'CoreController' ;
import ServiceSignalling from 'ServiceSignalling';
import CommonVideoSmart from "./commonVideoSmart";

class HVideoContainer extends React.Component{
    constructor(props){
        super(props);
        this.state={
            streams:[],
            otherVideoStyle:{},
            otherVideoSize:{},
            userIDArry:[],
            childrenSplitScreenStyle:{} ,
            changeMainContentVesselSmartSizeNumber:0 ,
        };
        this.ulHeight=0;
        this.isTriggerOnResize = false;
        this.listernerBackupid = new Date().getTime()+'_'+Math.random() ;
        this.teacherExist = false;
        this.assistantStream = [];
        this.streamNumber = 0 ; //流的个数
        //this.oenToOneMaxVideoNum = 5;
        //this.oenToManyMaxVideoNum = 6;
        this.userIDArryNumber = 0 ;
        this.elementId = "hvideo_container" ;
    };

    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
		eventObjectDefine.Window.addEventListener( TkConstant.EVENTTYPE.WindowEvent.onResize , this.handlerOnResize.bind(this) , this.listernerBackupid );
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamSubscribed_video, this.handlerStreamSubscribed.bind(this), this.listernerBackupid); //stream-subscribed事件：订阅事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamRemoved_video, this.handlerStreamRemoved.bind(this) , this.listernerBackupid); //stream-remove事件：取消订阅事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamAdded_video, this.handlerStreamAdded.bind(this) , this.listernerBackupid); //stream-added事件：增加事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomConnected, this.handlerRoomConnected.bind(this)  , this.listernerBackupid ); //Room-Connected事件：房间连接事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDisconnected,this.handlerRoomDisconnected.bind(this) , this.listernerBackupid); //Disconnected事件：失去连接事件
        //xueqiang change ,when teacher click everybody on,當超過7個人的時候，總是有是有人失敗，則需要將失敗的學生視頻的窗口刪除
        //eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamPublishFail_video,this.handlerStreamPublishFail.bind(this) , this.listernerBackupid); //PublishFail：流发布失败事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , this.handlerRoomDelmsg.bind(this), this.listernerBackupid); //roomDelmsg事件 下课事件 classBegin
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPubmsg ,this.handlerRoomPubmsg.bind(this)  ,  this.listernerBackupid ) ;//room-pubmsg事件：拖拽动作处理
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomUserpropertyChanged , this.handlerRoomUserpropertyChanged.bind(this) , this.listernerBackupid  ) ;
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomParticipantLeave , this.handlerRoomParticipantLeave.bind(this) , this.listernerBackupid); //room-participant_leave事件-收到有参与者离开房间
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPlaybackClearAllFromPlaybackController,this.handlerRoomPlaybackClearAll.bind(this) , this.listernerBackupid); //roomPlaybackClearAll 事件：回放清除所有信令
        eventObjectDefine.CoreController.addEventListener('changeOtherVideoStyle' , this.changeOtherVideoStyle.bind(this)  , this.listernerBackupid); //更新底部视频的位置
        eventObjectDefine.CoreController.addEventListener( "receive-msglist-ClassBegin" , this.handlerReceiveMsglistClassBegin.bind(this), this.listernerBackupid);
		eventObjectDefine.CoreController.addEventListener('oneKeyRecovery' , this.handlerOneKeyRecovery.bind(this)  , this.listernerBackupid) ; //分屏初始化
        eventObjectDefine.CoreController.addEventListener('changeMainContentVesselSmartSize' , this.changeMainContentVesselSmartSize.bind(this)  , this.listernerBackupid) ; //改变视频框占底部的ul的高度的事件
        eventObjectDefine.CoreController.addEventListener('receive-msglist-VideoSplitScreen' , this.handleReceiveMsglistVideoSplitScreen.bind(this)  , this.listernerBackupid) ; // 分屏msglist改变时的事件分发  tkpc2.0.8
        eventObjectDefine.CoreController.addEventListener('handleVideoDragListData' , this.handleVideoDragListData.bind(this)  , this.listernerBackupid) ; // 分屏msglist改变时的事件分发  tkpc2.0.8
        eventObjectDefine.CoreController.addEventListener( 'endClassbeginShowLocalStream', this.handlerEndClassbeginShowLocalStream.bind(this), this.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener('handleVideoSizeListData' , this.handleVideoSizeListData.bind(this)  , this.listernerBackupid) ; // 分屏msglist改变时的事件分发  tkpc2.0.8
    };

    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        eventObjectDefine.CoreController.removeBackupListerner(this.listernerBackupid);
	 	eventObjectDefine.Window.removeBackupListerner(this.listernerBackupid);
    };
    componentDidUpdate(prevProps , prevState) {//每次render结束后会触发
        if(this.userIDArryNumber !==  this.state.userIDArry.length){
            this.userIDArryNumber = this.state.userIDArry.length;
            this._updateSystemStyleJsonValueByInnerKey();
            this._updateChildrenSplitScreenStyle();
        }
        if( (this.state.streams && this.state.streams.length !== this.streamNumber) || ( this.state.otherVideoStyle !==  prevState.otherVideoStyle) ){
            this.streamNumber = this.state.streams.length;
            this._updateSystemStyleJsonValueByInnerKey();
        }
    };

    handlerOnResize() {
        for (let [key,value] of Object.entries(this.state.otherVideoSize)) {
            //限制视频大小,不能超出白板范围
            this.state.otherVideoSize[key] = this.limitVideoSize(value.videoWidth,value.videoHeight);
        }
        this.setState({
            otherVideoSize: this.state.otherVideoSize
        });
        this.setState({otherVideoStyle:this.state.otherVideoStyle});
    }

	handlerEndClassbeginShowLocalStream(){
        if(TkConstant.joinRoomInfo.isClassOverNotLeave){
            return ;
        }
        setTimeout(  () => {
            if( TkConstant.template === 'template_sharktop' &&   CoreController.handler.getAppPermissions('endClassbeginShowLocalStream')  ) { //是否拥有下课后显示本地视频权限,并且是老师
                if( this.state.streams.length === 0){
                    this._addLocalStreamToVideoContainer();
                }
            }
        }, 250);
    };
    handleReceiveMsglistVideoSplitScreen(recvEventData){
        let {userIDArry} = recvEventData.message.data ;
        this.setState({
            userIDArry: userIDArry
        });
        //this.sendDispatchAndSignallingSplitScreen(userIDArry);
    };

    handlerRoomPubmsg(pubmsgDataEvent){//room-pubmsg事件：拖拽动作处理
        let pubmsgData = pubmsgDataEvent.message ;
        switch(pubmsgData.name) {
            case "videoDraghandle":
                if (pubmsgData.data.otherVideoStyle) {//兼容以前版本
                    for (let [key,value] of Object.entries(pubmsgData.data.otherVideoStyle)) {
                        if (value.left || value.top) {
                            pubmsgData.data.otherVideoStyle[key].percentLeft = value.left;
                            pubmsgData.data.otherVideoStyle[key].percentTop = value.top;
                            delete pubmsgData.data.otherVideoStyle[key].left;
                            delete pubmsgData.data.otherVideoStyle[key].top;
                        }
                    }
                    let otherVideoStyleCopy = Object.customAssign({} , this.state.otherVideoStyle) ;
                    otherVideoStyleCopy = Object.customAssign(otherVideoStyleCopy , pubmsgData.data.otherVideoStyle);
                    this.setState({
                        otherVideoStyle:otherVideoStyleCopy,
                    });
                }
                break;
            case "VideoChangeSize":
                let {initVideoWidth,initVideoHeight} = this._getInitVideoSize();
                if (pubmsgData.data.ScaleVideoData) {
                    let {ScaleVideoData} = pubmsgData.data;
                    for (let [key,value] of Object.entries(ScaleVideoData)) {
                        this.state.otherVideoSize[key] = {
                            videoWidth:value.scale*initVideoWidth,
                            videoHeight:value.scale*initVideoWidth*3/4
                        };
                    }
                }else if (pubmsgData.data.otherVideoSize) {//兼容以前版本
                    this.state.otherVideoSize = pubmsgData.data.otherVideoSize;
                }
                for (let [key,value] of Object.entries(this.state.otherVideoSize)) {
                    //限制视频大小,不能超出白板范围
                    this.state.otherVideoSize[key] = this.limitVideoSize(value.videoWidth,value.videoHeight);
                }
                this.setState({
                    otherVideoSize: this.state.otherVideoSize
                });
                break;
			case "ClassBegin":{
                if(TkGlobal.isBroadcast || TkGlobal.playback ){//是直播或者回放不需要移除数据流
                    return ;
                }
                //上课要删除本地流
                this._removeLocalStreamToVideoContainer();
                break;
           	}
			case "VideoSplitScreen":
            	let userIDArryCopy = pubmsgData.data.userIDArry;
            	this.setState({userIDArry:userIDArryCopy});
            	break;
        }
    };
    handleVideoDragListData(handleData) {//msglist视频拖拽
        let otherVideoStyle = handleData.message.data.otherVideoStyle;
        this.setState({
            otherVideoStyle:otherVideoStyle,
        });
    };
    handleVideoSizeListData(handleData) {//msglist视频大小
        let {initVideoWidth,initVideoHeight} = this._getInitVideoSize();
        let ScaleVideoData = handleData.message.data.ScaleVideoData;
        for (let [key, value] of Object.entries(ScaleVideoData)) {
            this.state.otherVideoSize[key] = {
                videoWidth: value.scale * initVideoWidth,
                videoHeight: value.scale * initVideoWidth * 3 / 4
            };
        }
        for (let [key,value] of Object.entries(this.state.otherVideoSize)) {
            //限制视频大小,不能超出白板范围
            this.state.otherVideoSize[key] = this.limitVideoSize(value.videoWidth,value.videoHeight);
        }
        this.setState({
            otherVideoSize: this.state.otherVideoSize
        });
    };
   
    handlerRoomParticipantLeave(handleData) {//用户离开房间时，删除该视频框的样式
        let user = handleData.user;
        //其他人离开房间将他的视频样式数据删除
        let otherVideoStyleCopy = Object.customAssign({} , this.state.otherVideoStyle) ;
        delete otherVideoStyleCopy[user.id];
        delete this.state.otherVideoSize[user.id];
        this.setState({
            otherVideoStyle:otherVideoStyleCopy,
            otherVideoSize: this.state.otherVideoSize
        });
        let userIDArryCopy =  this.state.userIDArry.slice(0,this.state.userIDArry.length) ;
        if(userIDArryCopy.indexOf(user.id)>=0){
            userIDArryCopy.splice(userIDArryCopy.indexOf(user.id),1);
        	this.setState({
                userIDArry:userIDArryCopy,
            });
        	this.sendDispatchAndSignallingSplitScreen(userIDArryCopy , true); //todo 用户离开，多人发送了分屏消息，需要优化，另外发送者权限？
        } 
    };

    handlerRoomUserpropertyChanged (recvEventData) {//用户属性改变的时候
        let user = recvEventData.user ;
        if (user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE) { //如果是下台状态，删除该视频框的样式
            //其他人下台将他的视频样式数据删除
            let otherVideoStyleCopy = Object.customAssign({} , this.state.otherVideoStyle) ;
            delete otherVideoStyleCopy[user.id];
            delete this.state.otherVideoSize[user.id];
            this.setState({
                otherVideoStyle:otherVideoStyleCopy,
                otherVideoSize: this.state.otherVideoSize
            });
            let userIDArryCopy =  this.state.userIDArry.slice(0,this.state.userIDArry.length) ;
            if(userIDArryCopy.indexOf(user.id) >= 0 ) { // tkpc2.0.8
                userIDArryCopy.splice(userIDArryCopy.indexOf(user.id), 1);
				this.setState({
					userIDArry: userIDArryCopy,
				});
				this.sendDispatchAndSignallingSplitScreen(userIDArryCopy);// tkpc2.0.8
			}
        }
    };

    handlerReceiveMsglistClassBegin(recvEventData){
        if(TkGlobal.isBroadcast || TkGlobal.playback ){//是直播或者回放不需要移除数据流
            return ;
        }
        this._removeLocalStreamToVideoContainer();
    }

    /*初始化视频拖拽位置*/
    initOtherVideoDragByUserid(id) {
        this._initVideoSizeByUserid(id); //初始化视频的大小
        this.sendSignallingOfVideoSize();//发送视频大小信令
        let videoStyle = {percentLeft: 0, percentTop: 0, isDrag: false,};
        let handleData = {message: {data: {style: videoStyle, id: id} , initiative:true},};
        this.changeOtherVideoStyle(handleData);
    }
    /*拖拽改变视频位置或分屏*/
    changeOtherVideoStyle(handleData) {
        let extensionId = handleData.message.data.id;
        if(this.state.userIDArry.indexOf(extensionId) === -1  &&  this.state.userIDArry.length >= (TkConstant.template === 'template_sharktop'?7:6)){   // tkpc2.0.8
        	return
        }
        let otherVideoStyleCopy = Object.customAssign({} , this.state.otherVideoStyle) ;
        otherVideoStyleCopy[extensionId] = handleData.message.data.style;
        this.setState({//自己本地改变拖拽的video样式
            otherVideoStyle:otherVideoStyleCopy,
        });
        //通知其他人改变拖拽的video位置
        if (handleData.message.initiative && TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant) {
            let data = {otherVideoStyle:otherVideoStyleCopy};
            ServiceSignalling.sendSignallingFromVideoDraghandle(data);
        }
        let userIDArryCopy =  this.state.userIDArry.slice(0,this.state.userIDArry.length) ;
        if (TkGlobal.isSplitScreen && userIDArryCopy.indexOf(handleData.message.data.id) === -1) {
            userIDArryCopy.push(handleData.message.data.id);
            this.setState({
                userIDArry: userIDArryCopy
            });
            if(handleData.message.initiative){
                this.sendDispatchAndSignallingSplitScreen(userIDArryCopy);
            }
        }
    };
    getRoomType(){
        let roomType = ServiceRoom.getTkRoom().getRoomType();
        return roomType;
    }

    //判断用户是否是老师
    isTeacher(userID){
        let user = this.getUser(userID);
        if(!user){L.Logger.warning('[hv->isTeacher]user is not exist  , user id:'+userID+'!');} ;
        if (user && user.role === TkConstant.role.roleChairman) {
            return true;
        }
        return false;
    }

    updateStreams(streams)
    {
        if(streams !== undefined) {
            this.setState({
                streams: streams
            });
        }
    }

    findStream(stream){
        let streams = this.state.streams;
        for(let i=0;i<streams.length;i++) {
            let st = streams[i];
            if (stream.getID() === st.getID() || stream.extensionId === st.extensionId ) {
                return true;
            }
        }
        return false;
    }

    delCommonStreams(streams , stream){
        for(let i= streams.length -1  ;i>=0 ;i--) {
            let st = streams[i];
            if (stream.getID() === st.getID() || stream.extensionId === st.extensionId ) {
                streams.splice(i,1);
            }
        }
        return streams;
    };

    addStream(stream) {
        let streams = this.state.streams;
        //将自己放到第一个
        let chairmanStreamIndex = -1 ;
        for (let i = 0; i < streams.length; i++) {
            let stream = streams[i];
            if (this.getUser(stream.extensionId) && this.getUser(stream.extensionId).role === TkConstant.role.roleChairman) {
                chairmanStreamIndex = i;
            }else{
                break ;
            }
        }
        if (!this.findStream(stream)) {
            if(TkConstant.template === 'template_sharktop' ){
                if(this.getUser(stream.extensionId)  && this.getUser(stream.extensionId).role === TkConstant.role.roleChairman){
                    streams.unshift(stream);
                }else{
                    if(stream.extensionId==ServiceRoom.getTkRoom().getMySelf().id){
                        streams.splice(chairmanStreamIndex+1, 0, stream);
                    }else{
                        streams.push(stream);
                    }
                }
            }else{
                if(stream.extensionId==ServiceRoom.getTkRoom().getMySelf().id){
                    streams.unshift(stream);
                }else{
                    streams.push(stream);
                }
            }
        }else{
            this.delCommonStreams(streams , stream );
            if(TkConstant.template === 'template_sharktop' ){
                if(this.getUser(stream.extensionId)  && this.getUser(stream.extensionId).role === TkConstant.role.roleChairman){
                    streams.unshift(stream);
                }else{
                    if(stream.extensionId==ServiceRoom.getTkRoom().getMySelf().id){
                        streams.splice(chairmanStreamIndex+1, 0, stream);
                    }else{
                        streams.push(stream);
                    }
                }
            }else{
                if(stream.extensionId==ServiceRoom.getTkRoom().getMySelf().id){
                    streams.unshift(stream);
                }else{
                    streams.push(stream);
                }
            }
        }
        return  streams;
    }

    removeStream(stream){
        let streams=this.state.streams;
        return  this.delCommonStreams(streams , stream);
    }

   handlerRoomConnected(roomEvent){//房间连接时
        if(TkGlobal.classBegin || TkConstant.joinRoomInfo.autoClassBegin){ //如果上课了或者自动上课，不生成本地流
            return;
        }
        if( !TkConstant.hasRoomtype.oneToOne ) {//如果不是一对一
            if(CoreController.handler.getAppPermissions('localStream') && (TkConstant.template === 'template_sharktop' ?(TkConstant.hasRole.roleStudent || TkConstant.hasRole.roleTeachingAssistant || TkConstant.hasRole.roleChairman)  : (TkConstant.hasRole.roleStudent || TkConstant.hasRole.roleTeachingAssistant) )  ) {
                this._addLocalStreamToVideoContainer();
            }
        } else if(TkConstant.hasRoomtype.oneToOne ){
            if(CoreController.handler.getAppPermissions('localStream')  &&  TkConstant.hasRole.roleTeachingAssistant) {
                this._addLocalStreamToVideoContainer();
            }
        }
    }

    handlerStreamAdded(addEvent){//数据流添加
        if(TkGlobal.playback){ //回放就跳过stream-add,因为回放都是走流订阅
            return ;
        }
        if(this.getRoomType() !== TkConstant.ROOMTYPE.oneToOne ) {
            let userid = ServiceRoom.getTkRoom().getMySelf().id;
            let stream = addEvent.stream ;
            if(stream && stream.extensionId === ServiceRoom.getTkRoom().getMySelf().id ){
                if(this.isTeacher(userid)  === false || TkConstant.template === 'template_sharktop' ) {
                    if ( CoreController.handler.getAppPermissions('publishVideoStream') ) {
                        let streams = this.addStream(ServiceRoom.getLocalStream());
                        this.updateStreams(streams);
                    }
                }
            }
        } else if(TkConstant.hasRoomtype.oneToOne){
            if(addEvent.stream.extensionId === ServiceRoom.getTkRoom().getMySelf().id ) {
                if(CoreController.handler.getAppPermissions('publishVideoStream')  &&  TkConstant.hasRole.roleTeachingAssistant) {
                    let streams = this.addStream(ServiceRoom.getLocalStream());
                    this.updateStreams(streams);
                }
            }
        }
    }


    handlerStreamSubscribed(streamEvent){//数据流订阅
        if(!TkConstant.hasRoomtype.oneToOne) {
            if (streamEvent) {
                let stream = streamEvent.stream;
                let userid = stream.extensionId;
                if( this.isTeacher(userid)  === false   || TkConstant.template === 'template_sharktop'  ) {
                    let streams = this.addStream(stream);
                    this.updateStreams(streams);
                }
            }
        } else if(TkConstant.hasRoomtype.oneToOne){
            if (streamEvent) {
                let userid = streamEvent.stream.extensionId;
                if (this.getUser(userid) && this.getUser(userid).role === TkConstant.role.roleTeachingAssistant) {
                    let streams = this.addStream(streamEvent.stream);
                    this.updateStreams(streams);
                }
            }
        }
    };

    handlerStreamPublishFail(streamEvent){
        this.handlerStreamRemoved(streamEvent);
    };

	changeMainContentVesselSmartSize(data){
	    this._updateChildrenSplitScreenStyle();
	    this.setState({changeMainContentVesselSmartSizeNumber:(this.state.changeMainContentVesselSmartSizeNumber+1)});
	    this.handlerOnResize();
	}

	/*双击触发演讲模式*/
    videoOnDoubleClick(stream, extensionId , event) {
		if(CoreController.handler.getAppPermissions('isCanDragVideo') && TkGlobal.classBegin) {
            if( (this.state.userIDArry.indexOf(extensionId) === -1  &&  this.state.userIDArry.length >= (TkConstant.template === 'template_sharktop'?7:6)) || TkConstant.hasRole.roleStudent ){   // tkpc2.0.8
                return;
            };
            if(stream){
                let userIDArryCopy =  this.state.userIDArry.slice(0,this.state.userIDArry.length) ;
                if(TkGlobal.isSplitScreen) {
                    if (!TkConstant.hasRole.roleStudent) {
                        if(this.state.otherVideoStyle[extensionId].isDrag) {
                            this.initOtherVideoDragByUserid(extensionId);//初始化视频框拖拽的video位置
                            if(userIDArryCopy.length > 0) {
                                userIDArryCopy.splice(userIDArryCopy.indexOf(stream.extensionId), 1);
                            }
                        } else {
                            if(userIDArryCopy.indexOf(stream.extensionId) === -1) {
                                userIDArryCopy.push(stream.extensionId);
                            } else {
                                userIDArryCopy.splice(userIDArryCopy.indexOf(stream.extensionId), 1);
                            }
                        }
                    }
                    this.setState({
                        userIDArry: userIDArryCopy
                    });
                    this.sendDispatchAndSignallingSplitScreen(userIDArryCopy);  // tkpc2.0.8
                } else {
                    if(this.state.otherVideoStyle[extensionId].isDrag) {
                        this.initOtherVideoDragByUserid(extensionId);//初始化视频框拖拽的video位置
                    } else {
                        if (!TkConstant.hasRole.roleStudent) {
                            for(let [key, value] of Object.entries(this.state.otherVideoStyle)) {
                                if(value.isDrag) {
                                    userIDArryCopy.push(key);
                                }
                            }
                            if(userIDArryCopy.indexOf(stream.extensionId) === -1) {
                                userIDArryCopy.push(stream.extensionId);
                            }else {
                                userIDArryCopy.splice(userIDArryCopy.indexOf(stream.extensionId), 1);
                            }
                        }
                        this.setState({
                            userIDArry: userIDArryCopy
                        });
                        this.sendDispatchAndSignallingSplitScreen(userIDArryCopy);  // tkpc2.0.8
                    }
                }
            }
		}
        if(event){
            event.preventDefault();
            event.stopPropagation();
        }
        return false ;
	};

	/*关于分屏的发送信令和事件分发*/
	sendDispatchAndSignallingSplitScreen(userIDArry , notNeedRole = false){
	    if(notNeedRole || (!notNeedRole && TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant)){
            userIDArry = userIDArry || this.state.userIDArry ;
            let data = {
                userIDArry: userIDArry,
            };
            ServiceSignalling.sendSignallingFromVideoSplitScreen(data);
        }
	};
	
    handlerStreamRemoved(streamEvent){
        let stream = streamEvent.stream;
        if (stream) {
            //视频停止播放
            stream.hide();
            let streams = this.removeStream(stream);
            this.updateStreams(streams);
        }
    };

    handlerRoomPlaybackClearAll(){
        if(!TkGlobal.playback){L.Logger.error('No playback environment, no execution event[roomPlaybackClearAll] handler ') ;return ;};
        this.initOtherVideoStyle(false);
        this.initOtherVideoSize(false);
        this.initVideoSplitScreen(false);
    };
    handlerRoomDisconnected(recvEventData){
        this._clearAllStreamArray();
    }

    //加载视频组件style样式：分屏
    _loadVideoContainerStyle(userid) {
        let videoContainerStyle = undefined;
        let index = this.state.userIDArry.indexOf(userid) ;
        if (TkGlobal.isSplitScreen &&  index !== -1 && ServiceRoom.getTkRoom() ) {
            if( this.state.userIDArry.length === 7){
                let roleChairmanId = undefined ;
                for(let value of  this.state.userIDArry){
                    let user = this.getUser(value) ;
                    if(user && user.role ===  TkConstant.role.roleChairman ){
                        roleChairmanId = user.id ;
                        break ;
                    }
                }
                if(roleChairmanId){
                    let currentUser =  this.getUser(userid) ;
                    if(currentUser && currentUser.role === TkConstant.role.roleChairman){
                        videoContainerStyle = this.state.childrenSplitScreenStyle['liStyle_2'] ;
                    }else{
                        let roleChairmanIdIndex = this.state.userIDArry.indexOf(roleChairmanId) ;
                        if(index === 1 && roleChairmanIdIndex !== -1){
                            videoContainerStyle = this.state.childrenSplitScreenStyle['liStyle_'+(roleChairmanIdIndex+1)] ;
                        }else{
                            videoContainerStyle = this.state.childrenSplitScreenStyle['liStyle_'+(index+1)] ;
                        }
                    }
                }else{
                    videoContainerStyle = this.state.childrenSplitScreenStyle['liStyle_'+(index+1)] ;
                }
            }else{
                videoContainerStyle = this.state.childrenSplitScreenStyle['liStyle_'+(index+1)] ;
            }
        }
        return videoContainerStyle;
    };

    /*限制视频大小,不能超出白板范围*/
    limitVideoSize(videoWidth, videoHeight) {
        //获取白板区域宽高：
        const defalutFontSize = window.innerWidth / TkConstant.STANDARDSIZE;
        let content = document.getElementById('lc-full-vessel');
        let contentW = content.clientWidth;
        let contentH = content.clientHeight;
        let {initVideoWidth,initVideoHeight} = this._getInitVideoSize();
        if(videoWidth < initVideoWidth || videoHeight < initVideoHeight) {
            videoWidth = initVideoWidth;
            videoHeight = initVideoHeight;
        }
        if(contentH > contentW) {
            if(videoWidth >= contentW / defalutFontSize) {
                videoWidth = contentW / defalutFontSize;
                videoHeight = contentW / defalutFontSize * 3 / 4;
            }
        } else {
            if(videoHeight >= contentH / defalutFontSize) {
                videoHeight = contentH / defalutFontSize;
                videoWidth = contentH / defalutFontSize * 4 / 3;
            }
        }
        return {videoWidth, videoHeight};
    };
    /*改变视频大小*/
    changeVideoSize(newVideoWidth, newVideoHeight, id) {
        // 限制视频,不能超出白板范围并且不小于原有大小
        this.state.otherVideoSize[id] = this.limitVideoSize(newVideoWidth, newVideoHeight);
        this.setState({
            otherVideoSize: this.state.otherVideoSize
        });
    }
    /*发送视频大小信令*/
    sendSignallingOfVideoSize() {
        let {initVideoWidth,initVideoHeight} = this._getInitVideoSize();
        let data = {
            ScaleVideoData: {},
        };
        for (let [key,value] of Object.entries(this.state.otherVideoSize)) {
            data.ScaleVideoData[key] = {
                scale:value.videoWidth/initVideoWidth,
            }
        }
        ServiceSignalling.sendSignallingFromVideoChangeSize(data);
    }

    /*获取初始化视频的大小*/
    _getInitVideoSize() {
        const defalutFontSize = TkGlobal.windowInnerWidth / TkConstant.STANDARDSIZE;
        let lcVideoContainer = document.getElementById('other_video_container');
        let videoNum = TkConstant.template === 'template_sharktop'?7:6;
        let initVideoWidth = ((lcVideoContainer.clientWidth / defalutFontSize) / videoNum - 0.15);
        let initVideoHeight = initVideoWidth * 3 / 4;
        return {initVideoWidth,initVideoHeight}
    }

    /*初始化视频大小*/
    _initVideoSizeByUserid(extensionId) {
        const defalutFontSize = TkGlobal.windowInnerWidth / TkConstant.STANDARDSIZE;
        let lcVideoContainer = document.getElementById('other_video_container');
        let videoNum = TkConstant.template === 'template_sharktop'?7:6;
        let videoWidth = ((lcVideoContainer.clientWidth / defalutFontSize) / videoNum - 0.15);
        let videoHeight = videoWidth * 3 / 4;
        this.state.otherVideoSize[extensionId] = {
            videoWidth: videoWidth,
            videoHeight: videoHeight,
        };
    }

    _loadHVideoComponentArray( streams ){
        let hVideoComponentArray = [] ;
        for(let stream of streams){
            if(stream) {
                let extensionId = stream.extensionId;
                if (this.state.otherVideoStyle && !this.state.otherVideoStyle[extensionId]) {//设置初始值
                    this.state.otherVideoStyle[extensionId] = {
                        percentTop:0,
                        percentLeft:0,
                        isDrag:false,
                    };
                }
                if (this.state.otherVideoSize && !this.state.otherVideoSize[extensionId]) {//设置宽高初始值
                    this._initVideoSizeByUserid(extensionId);
                }

                let {otherVideoStyle,otherVideoSize} = this.state;
                let videoContainerStyle = this._loadVideoContainerStyle(extensionId);
                hVideoComponentArray.push(
                    <CommonVideoSmart sendSignallingOfVideoSize={this.sendSignallingOfVideoSize.bind(this)}
                                      changeVideoSize={this.changeVideoSize.bind(this)}
                                      initOtherVideoDragByUserid={this.initOtherVideoDragByUserid.bind(this)}
                                      videoContainerStyle={videoContainerStyle} {...otherVideoStyle[extensionId]} {...otherVideoSize[extensionId]}
                                      fatherId={this.elementId}   direction={'horizontal'} changeMainContentVesselSmartSizeNumber={this.state.changeMainContentVesselSmartSizeNumber}
                                      hasDragJurisdiction={ CoreController.handler.getAppPermissions('isCanDragVideo') }
                                      id={extensionId}  key={stream.getID()} stream={stream} videoDumbClassName={"hvideo"}
                                      videoOnDoubleClick={this.videoOnDoubleClick.bind(this , stream ,extensionId)}  />
                );
            }
        }
        return{
            hVideoComponentArray:hVideoComponentArray
        }
    };

    getUser(userid){
        if( !ServiceRoom.getTkRoom() ){
            return undefined ;
        }
        return ServiceRoom.getTkRoom().getUser(userid);
    }

    handlerRoomDelmsg(recvEventData){
        let pubmsgData = recvEventData.message ;
        switch(pubmsgData.name) {
            case "ClassBegin":
                if(TkConstant.joinRoomInfo.isClassOverNotLeave){
                    let send = false ;
                    this.initOtherVideoStyle(send);
                    this.initOtherVideoSize(send);
                    this.initVideoSplitScreen(send);
                    return ;
                }
                this._clearAllStreamArray();
                setTimeout(  () => {
                    if( TkConstant.template === 'template_sharktop' &&   CoreController.handler.getAppPermissions('endClassbeginShowLocalStream')  ) { //是否拥有下课后显示本地视频权限,并且是老师
                        if( this.state.streams.length === 0){
                            this._addLocalStreamToVideoContainer();
                        }
                    }
                }, 250);
                break;
            case "VideoSplitScreen":
            	this.initVideoSplitScreen();
            	break;
        }
    }

    /*一键还原*/
    handlerOneKeyRecovery(send=true){
        this.initOtherVideoStyle(send);
        this.initOtherVideoSize(send);
        this.initVideoSplitScreen(send);
    }

    /*初始化所有的拖拽数据*/
    initOtherVideoStyle(send=false){
        let otherVideoStyleCopy = Object.customAssign({} , this.state.otherVideoStyle );
        for(let key of Object.keys(otherVideoStyleCopy)  ){
            otherVideoStyleCopy[key] = {
                percentTop:0,
                percentLeft:0,
                isDrag:false,
            }
        }
        this.setState({otherVideoStyle:otherVideoStyleCopy}) ;
        if(send){
            ServiceSignalling.sendSignallingFromVideoDraghandle({otherVideoStyle:otherVideoStyleCopy});
        }
    };

    /*初始化所有的视频大小数据*/
    initOtherVideoSize(send=false){
        let sendOtherVideoSizeData = { ScaleVideoData:{} } ;
        for(let key of  Object.keys(this.state.otherVideoSize) ){
            sendOtherVideoSizeData.ScaleVideoData[key] = {
                scale:1,
            };
            this._initVideoSizeByUserid(key);
        }
        this.setState({otherVideoSize:this.state.otherVideoSize}) ;
        if(send){
            ServiceSignalling.sendSignallingFromVideoChangeSize(sendOtherVideoSizeData);
        }
    }

    /*初始化所有的分屏数据*/
	initVideoSplitScreen(send=false) {
       this.setState({ userIDArry: [],}) ;
        if(send){
            let isDelMsg = true;
            ServiceSignalling.sendSignallingFromVideoSplitScreen({userIDArry: []},isDelMsg);
        }
    };

    /*清空数据流数组*/
    _clearAllStreamArray(){
        this.state.streams.length = 0;//清空数组
        this.setState({
            streams:this.state.streams
        });
    };

    _updateSystemStyleJsonValueByInnerKey(){
        //clearTimeout(this.updateSystemStyleJsonValueByInnerKeyTimer);
        //this.updateSystemStyleJsonValueByInnerKeyTimer = setTimeout(()=>{
            if( this.refs.hVideoCcontainer && ReactDom.findDOMNode(this.refs.hVideoCcontainer) ){
                let remValue = 0 ;
                if(this.state.userIDArry.length === this.state.streams.length){
                    remValue = 0 ;
                }else{
                    let hVideoCcontainerElement = ReactDom.findDOMNode(this.refs.hVideoCcontainer) ;
                    let defalutFontSize = TkGlobal.windowInnerWidth / TkConstant.STANDARDSIZE ;
                    remValue = (hVideoCcontainerElement.clientHeight / defalutFontSize)
                }
                let StyleJsonKey = 'BottomVesselSmartStyleJson' , innerKey = 'height' ,innerValue = remValue+'rem' ;
                if( remValue !== TkUtils.replaceRemToNumber(TkGlobal.systemStyleJson.BottomVesselSmartStyleJson.height) ){
                    CoreController.handler.updateSystemStyleJsonValueByInnerKey(StyleJsonKey , innerKey ,innerValue);
                }
            }
        //} , 0 );
    }

    _updateChildrenSplitScreenStyle(){
        let {childrenSplitScreenStyle} = this.state;
        if(TkGlobal.isSplitScreen) {
            let lengths = this.state.userIDArry.length;
            let isChangeChildrenSplitScreenStyle = false ;
            let { width , height , left , top } = TkGlobal.systemStyleJson.RightContentVesselSmartStyleJson ;
            if(lengths === 1) {
                childrenSplitScreenStyle.liStyle_1 = {
                    width: width ,
                    height: "calc( "+TkUtils.replaceCalc(height) + " -  "+TkGlobal.playbackControllerHeight+")",
                    top: top,
                    left: left,
                };
                isChangeChildrenSplitScreenStyle = true ;
            } else if(lengths === 2) {
                childrenSplitScreenStyle.liStyle_1 = {
                    width: "calc( ("+TkUtils.replaceCalc(width) + ") / 2 )",
                    height: "calc( "+TkUtils.replaceCalc(height) + " -  "+TkGlobal.playbackControllerHeight+")",
                    top: top,
                    left: left,
                };
                childrenSplitScreenStyle.liStyle_2 = {
                    width: "calc( ("+TkUtils.replaceCalc(width) + ") / 2 )",
                    height: "calc( "+TkUtils.replaceCalc(height) + " -  "+TkGlobal.playbackControllerHeight+")",
                    top: top,
                    left:  "calc( ( ("+TkUtils.replaceCalc(width) + ") / 2 ) " + " + " +left + " )",
                };
                isChangeChildrenSplitScreenStyle = true ;
            } else if(lengths === 3) {
                childrenSplitScreenStyle.liStyle_1 = {
                    width:  "calc( ("+TkUtils.replaceCalc(width) + ") / 2 )" ,
                    height:  "calc( "+TkUtils.replaceCalc(height) + " -  "+TkGlobal.playbackControllerHeight+")",
                    top: top,
                    left: left,
                };
                childrenSplitScreenStyle.liStyle_2 = {
                    width: "calc( ("+TkUtils.replaceCalc(width) + ") / 2 )" ,
                    height: "calc( ("+TkUtils.replaceCalc(height) + " - "+TkGlobal.playbackControllerHeight+") / 2 )",
                    top: top,
                    left: "calc( ( ("+TkUtils.replaceCalc(width) + ") / 2 ) " + " + " +left + " )",
                };
                childrenSplitScreenStyle.liStyle_3 = {
                    width:"calc( ("+TkUtils.replaceCalc(width) + ") / 2 )" ,
                    height: "calc( ("+TkUtils.replaceCalc(height) + " - "+TkGlobal.playbackControllerHeight+ ") / 2 )",
                    top: "calc( ( ("+TkUtils.replaceCalc(height) +  " - "+TkGlobal.playbackControllerHeight+ ") / 2 ) " + " + " +top + " )",
                    left: "calc( ( ("+TkUtils.replaceCalc(width) + ") / 2 ) " + " + " +left + " )",
                };
                isChangeChildrenSplitScreenStyle = true ;
            } else if(lengths === 4) {
                childrenSplitScreenStyle.liStyle_1 = {
                    width:"calc( ("+TkUtils.replaceCalc(width) +") / 2 )" ,
                    height:  "calc( ("+TkUtils.replaceCalc(height) +  " - "+TkGlobal.playbackControllerHeight+ ") / 2 )",
                    top:top,
                    left:left,
                };
                childrenSplitScreenStyle.liStyle_2 = {
                    width:"calc( ("+TkUtils.replaceCalc(width) + ") / 2 )" ,
                    height:  "calc( ("+TkUtils.replaceCalc(height) + " - "+TkGlobal.playbackControllerHeight+ ") / 2 )",
                    top:top,
                    left: "calc( ( ("+TkUtils.replaceCalc(width) + ") / 2 ) " + " + " +left + " )",
                };
                childrenSplitScreenStyle.liStyle_3 = {
                    width:"calc( ("+TkUtils.replaceCalc(width) + ") / 2 )" ,
                    height:  "calc( ("+TkUtils.replaceCalc(height) +  " - "+TkGlobal.playbackControllerHeight+") / 2 )",
                    top: "calc( ( ("+TkUtils.replaceCalc(height) +  " - "+TkGlobal.playbackControllerHeight+") / 2 ) " + " + " +top + " )",
                    left:left,
                };
                childrenSplitScreenStyle.liStyle_4 = {
                    width:"calc( ("+TkUtils.replaceCalc(width) + ") / 2 )" ,
                    height:  "calc( ("+TkUtils.replaceCalc(height) +  " - "+TkGlobal.playbackControllerHeight+") / 2 )",
                    top: "calc( ( ("+TkUtils.replaceCalc(height) +  " - "+TkGlobal.playbackControllerHeight+") / 2 ) " + " + " +top + " )",
                    left: "calc( ( ("+TkUtils.replaceCalc(width) + ") / 2 ) " + " + " +left + " )",
                };
                isChangeChildrenSplitScreenStyle = true ;
            } else if(lengths === 5) {
                childrenSplitScreenStyle.liStyle_1 = {
                    width:"calc( ("+TkUtils.replaceCalc(width) + ") / 2 )" ,
                    height:"calc( ("+TkUtils.replaceCalc(height) +  " - "+TkGlobal.playbackControllerHeight+") / 2 )",
                    top:top,
                    left:left,
                };
                childrenSplitScreenStyle.liStyle_2 = {
                    width:"calc( ("+TkUtils.replaceCalc(width) + ") / 2 )" ,
                    height:"calc( ("+TkUtils.replaceCalc(height) +  " - "+TkGlobal.playbackControllerHeight+") / 2 )",
                    top:top,
                    left: "calc( ( ( ("+TkUtils.replaceCalc(width) + ") / 2 ) * 1 )  " + " + " +left + " )",
                };
                childrenSplitScreenStyle.liStyle_3 = {
                    width:"calc( ("+TkUtils.replaceCalc(width) + ") / 3 )" ,
                    height:  "calc( ("+TkUtils.replaceCalc(height) +  " - "+TkGlobal.playbackControllerHeight+") / 2 )",
                    top: "calc( ( ("+TkUtils.replaceCalc(height) +  " - "+TkGlobal.playbackControllerHeight+") / 2 ) " + " + " +top + " )",
                    left:left,
                };
                childrenSplitScreenStyle.liStyle_4 = {
                    width:"calc( ("+TkUtils.replaceCalc(width) + ") / 3 )" ,
                    height:  "calc( ("+TkUtils.replaceCalc(height) +  " - "+TkGlobal.playbackControllerHeight+") / 2 )",
                    top: "calc( ( ("+TkUtils.replaceCalc(height) +  " - "+TkGlobal.playbackControllerHeight+") / 2 ) " + " + " +top + " )",
                    left: "calc( ( ( ("+TkUtils.replaceCalc(width) + ") / 3 ) * 1 )  " + " + " +left + " )",
                };
                childrenSplitScreenStyle.liStyle_5 = {
                    width:"calc( ("+TkUtils.replaceCalc(width) + ") / 3 )" ,
                    height:  "calc( ("+TkUtils.replaceCalc(height) +  " - "+TkGlobal.playbackControllerHeight+") / 2 )",
                    top: "calc( ( ("+TkUtils.replaceCalc(height) +  " - "+TkGlobal.playbackControllerHeight+") / 2 ) " + " + " +top + " )",
                    left: "calc( ( ( ("+TkUtils.replaceCalc(width) + ") / 3 ) * 2 )  " + " + " +left + " )",
                };
                isChangeChildrenSplitScreenStyle = true ;
            } else if(lengths === 6) {
                childrenSplitScreenStyle.liStyle_1 = {
                    width:"calc( ("+TkUtils.replaceCalc(width) + ") / 3 )" ,
                    height:  "calc( ("+TkUtils.replaceCalc(height) + " - "+TkGlobal.playbackControllerHeight+ ") / 2 )",
                    top:top,
                    left:left,
                };
                childrenSplitScreenStyle.liStyle_2 = {
                    width:"calc( ("+TkUtils.replaceCalc(width) + ") / 3 )" ,
                    height:  "calc( ("+TkUtils.replaceCalc(height) + " - "+TkGlobal.playbackControllerHeight+ ") / 2 )",
                    left: "calc( ( ( ("+TkUtils.replaceCalc(width) + ") / 3 ) * 1 )  " + " + " +left + " )",
                    top:top,
                };
                childrenSplitScreenStyle.liStyle_3 = {
                    width:"calc( ("+TkUtils.replaceCalc(width) + ") / 3 )" ,
                    height:  "calc( ("+TkUtils.replaceCalc(height) + " - "+TkGlobal.playbackControllerHeight+ ") / 2 )",
                    top:top,
                    left: "calc( ( ( ("+TkUtils.replaceCalc(width) + ") / 3 ) * 2 )  " + " + " +left + " )",
                };
                childrenSplitScreenStyle.liStyle_4 = {
                    width:"calc( ("+TkUtils.replaceCalc(width) + ") / 3 )" ,
                    height:  "calc( ("+TkUtils.replaceCalc(height) +  " - "+TkGlobal.playbackControllerHeight+") / 2 )",
                    top: "calc( ( ("+TkUtils.replaceCalc(height) +  " - "+TkGlobal.playbackControllerHeight+") / 2 ) " + " + " +top + " )",
                    left:left,
                };
                childrenSplitScreenStyle.liStyle_5 = {
                    width:"calc( ("+TkUtils.replaceCalc(width) + ") / 3 )" ,
                    height:  "calc( ("+TkUtils.replaceCalc(height) + " - "+TkGlobal.playbackControllerHeight+ ") / 2 )",
                    top: "calc( ( ("+TkUtils.replaceCalc(height) +  " - "+TkGlobal.playbackControllerHeight+") / 2 ) " + " + " +top + " )",
                    left: "calc( ( ( ("+TkUtils.replaceCalc(width) + ") / 3 ) * 1 )  " + " + " +left + " )",
                };
                childrenSplitScreenStyle.liStyle_6 = {
                    width:"calc( ("+TkUtils.replaceCalc(width) + ") / 3 )" ,
                    height:  "calc( ("+TkUtils.replaceCalc(height) +  " - "+TkGlobal.playbackControllerHeight+") / 2 )",
                    top: "calc( ( ("+TkUtils.replaceCalc(height) + " - "+TkGlobal.playbackControllerHeight+ ") / 2 ) " + " + " +top + " )",
                    left: "calc( ( ( ("+TkUtils.replaceCalc(width) + ") / 3 ) * 2 )  " + " + " +left + " )",
                };
                isChangeChildrenSplitScreenStyle = true ;
            }else if(lengths === 7) {
                childrenSplitScreenStyle.liStyle_1 = {
                    width:"calc( ("+TkUtils.replaceCalc(width) + ") / 3 )" ,
                    height:  "calc( ("+TkUtils.replaceCalc(height) +  " - "+TkGlobal.playbackControllerHeight+") / 2 )",
                    top:top,
                    left:left,
                };
                childrenSplitScreenStyle.liStyle_2 = {
                    width:"calc( ("+TkUtils.replaceCalc(width) + ") / 3 )" ,
                    height:  "calc( ("+TkUtils.replaceCalc(height) + " - "+TkGlobal.playbackControllerHeight+ ") / 2 )",
                    left: "calc( ( ( ("+TkUtils.replaceCalc(width) + ") / 3 ) * 1 )  " + " + " +left + " )",
                    top:top,
                };
                childrenSplitScreenStyle.liStyle_3 = {
                    width:"calc( ("+TkUtils.replaceCalc(width) + ") / 3 )" ,
                    height:  "calc( ("+TkUtils.replaceCalc(height) +  " - "+TkGlobal.playbackControllerHeight+") / 2 )",
                    top:top,
                    left: "calc( ( ( ("+TkUtils.replaceCalc(width) + ") / 3 ) * 2 )  " + " + " +left + " )",
                };
                childrenSplitScreenStyle.liStyle_4 = {
                    width:"calc( ("+TkUtils.replaceCalc(width) + ") / 4 )" ,
                    height:  "calc( ("+TkUtils.replaceCalc(height) +  " - "+TkGlobal.playbackControllerHeight+") / 2 )",
                    top: "calc( ( ("+TkUtils.replaceCalc(height) +  " - "+TkGlobal.playbackControllerHeight+") / 2 ) " + " + " +top + " )",
                    left:left,
                };
                childrenSplitScreenStyle.liStyle_5 = {
                    width:"calc( ("+TkUtils.replaceCalc(width) + ") / 4 )" ,
                    height:  "calc( ("+TkUtils.replaceCalc(height) +  " - "+TkGlobal.playbackControllerHeight+") / 2 )",
                    top: "calc( ( ("+TkUtils.replaceCalc(height) +  " - "+TkGlobal.playbackControllerHeight+") / 2 ) " + " + " +top + " )",
                    left: "calc( ( ( ("+TkUtils.replaceCalc(width) + ") / 4 ) * 1 )  " + " + " +left + " )",
                };
                childrenSplitScreenStyle.liStyle_6 = {
                    width:"calc( ("+TkUtils.replaceCalc(width) + ") / 4 )" ,
                    height:  "calc( ("+TkUtils.replaceCalc(height) +  " - "+TkGlobal.playbackControllerHeight+") / 2 )",
                    top: "calc( ( ("+TkUtils.replaceCalc(height) +  " - "+TkGlobal.playbackControllerHeight+") / 2 ) " + " + " +top + " )",
                    left: "calc( ( ( ("+TkUtils.replaceCalc(width) + ") / 4 ) * 2 )  " + " + " +left + " )",
                };
                childrenSplitScreenStyle.liStyle_7 = {
                    width:"calc( ("+TkUtils.replaceCalc(width) + ") / 4 )" ,
                    height:  "calc( ("+TkUtils.replaceCalc(height) +  " - "+TkGlobal.playbackControllerHeight+") / 2 )",
                    top: "calc( ( ("+TkUtils.replaceCalc(height) +  " - "+TkGlobal.playbackControllerHeight+") / 2 ) " + " + " +top + " )",
                    left: "calc( ( ( ("+TkUtils.replaceCalc(width) + ") / 4 ) * 3 )  " + " + " +left + " )",
                };
                isChangeChildrenSplitScreenStyle = true ;
            }
            if(isChangeChildrenSplitScreenStyle){
                let zIndex = 300 ;
                for( let value of Object.values(childrenSplitScreenStyle) ){
                    Object.customAssign(value , {
                        position: "fixed",
                        margin: 0,
                        zIndex:++zIndex
                    });
                }
                this.setState({
                    childrenSplitScreenStyle: childrenSplitScreenStyle,
                });
            }
        }else{
            if(Object.keys(this.state.childrenSplitScreenStyle).length>0){
                this.setState({
                    childrenSplitScreenStyle: {},
                });
            }
        }
    }

    /*添加本地数据流到容器中*/
    _addLocalStreamToVideoContainer(){
        if(CoreController.handler.getAppPermissions('localStream') ){
            let streams = this.addStream(ServiceRoom.getLocalStream());
            this.updateStreams(streams);
        }
    };

    /*移除本地数据流到容器中*/
    _removeLocalStreamToVideoContainer(){
        let streams = this.state.streams;
        for(let i= streams.length -1  ;i>=0 ;i--) {
            let st = streams[i];
            if (st.local && st.getID() === 'local') {
                streams.splice(i,1);
            }
        }
        this.updateStreams(streams);
    };

    render(){
        TkGlobal.isSplitScreen = this.state.userIDArry.length > 0 ; //根据数组长度改变是否是分屏状态
        let {hVideoComponentArray} = this._loadHVideoComponentArray(this.state.streams);
        return (
            <section ref="hVideoCcontainer"  className="hvideo_container" id={this.elementId} >
            	<ol ref={'hvideoContainerList'} id="other_video"  className={"hvvideo-ol-container clear-float "+ (TkConstant.template)} style={{display:TkGlobal.doubleScreen?"none":""}}>
                    {hVideoComponentArray}
                </ol>
            </section>
        )
    };
};
export default  HVideoContainer;

