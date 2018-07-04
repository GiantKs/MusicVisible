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
import TkGlobal from 'TkGlobal' ;
import TkConstant from "../../../tk_class/TkConstant";
import eventObjectDefine from 'eventObjectDefine';
import  './css/cssHVideoContainer.css';
import HVideoComponent from "./HVideoComponent";
import CoreController from 'CoreController' ;
import RoleHandler from 'RoleHandler';
import ServiceSignalling from 'ServiceSignalling';
import ServiceTooltip from 'ServiceTooltip';


class HVideoContainer extends React.Component{
    constructor(props){
        super(props);
        this.state={
            streams:[],
            otherVideoStyle:{},
            userIDArry:[],

        };
        this.ulHeight=0;
        this.isTriggerOnResize = false;
        this.listernerBackupid = new Date().getTime()+'_'+Math.random() ;
        this.teacherExist = false;
        this.assistantStream = [];
        //this.oenToOneMaxVideoNum = 5;
        //this.oenToManyMaxVideoNum = 6;
    };

    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        let that = this;
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamSubscribed_video, that.handlerStreamSubscribed.bind(that), that.listernerBackupid); //stream-subscribed事件：订阅事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamRemoved_video, that.handlerStreamRemoved.bind(that) , that.listernerBackupid); //stream-remove事件：取消订阅事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamAdded_video, that.handlerStreamAdded.bind(that) , that.listernerBackupid); //stream-added事件：增加事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomConnected, that.handlerRoomConnected.bind(that)  , that.listernerBackupid ); //Room-Connected事件：房间连接事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDisconnected,that.handlerRoomDisconnected.bind(that) , that.listernerBackupid); //Disconnected事件：失去连接事件
        //eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPlaybackClearAllFromPlaybackController,that.handlerRoomPlaybackClearAll.bind(that) , that.listernerBackupid); //roomPlaybackClearAll 事件：回放清除所有信令
        //xueqiang change ,when teacher click everybody on,當超過7個人的時候，總是有是有人失敗，則需要將失敗的學生視頻的窗口刪除
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamPublishFail_video,that.handlerStreamPublishFail.bind(that) , that.listernerBackupid); //PublishFail：流发布失败事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that), that.listernerBackupid); //roomDelmsg事件 下课事件 classBegin
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPubmsg ,that.handlerRoomPubmsg.bind(that)  ,  that.listernerBackupid ) ;//room-pubmsg事件：拖拽动作处理
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomUserpropertyChanged , that.handlerRoomUserpropertyChanged.bind(that) , that.listernerBackupid  ) ;
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomParticipantLeave , that.handlerRoomParticipantLeave.bind(that) , that.listernerBackupid); //room-participant_leave事件-收到有参与者离开房间
        eventObjectDefine.CoreController.addEventListener('changeOtherVideoStyle' , that.changeOtherVideoStyle.bind(that)  , that.listernerBackupid); //更新底部视频的位置
        eventObjectDefine.CoreController.addEventListener('handleVideoDragListData' , that.handleVideoDragListData.bind(that)  , that.listernerBackupid); //更新底部视频的位置
        eventObjectDefine.CoreController.addEventListener( "receive-msglist-ClassBegin" , that.handlerReceiveMsglistClassBegin.bind(that), that.listernerBackupid);
		eventObjectDefine.CoreController.addEventListener('initVideoSplitScreen' , that.initVideoSplitScreen.bind(that)  , that.listernerBackupid) ; //分屏初始化
        eventObjectDefine.CoreController.addEventListener('changeBottomVesselSmartHeightRem' , that.changeBottomVesselSmartHeightRem.bind(that)  , that.listernerBackupid) ; //改变视频框占底部的ul的高度的事件
        eventObjectDefine.CoreController.addEventListener('handlemsglistVideoSplitScreen' , that.handlemsglistVideoSplitScreen.bind(that)  , that.listernerBackupid) ; // 分屏msglist改变时的事件分发  tkpc2.0.8
    };

    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        eventObjectDefine.CoreController.removeBackupListerner(this.listernerBackupid);
    };
    componentDidUpdate(prevProps , prevState) {//每次render结束后会触发
        if (this.isTriggerOnResize == true) {
            this.isTriggerOnResize = false;
            let defalutFontSize = window.innerWidth / TkConstant.STANDARDSIZE ;
            eventObjectDefine.Window.dispatchEvent({ type:TkConstant.EVENTTYPE.WindowEvent.onResize , message:{defalutFontSize:defalutFontSize} });
        }
    };
	
    handlerRoomPubmsg(pubmsgDataEvent){//room-pubmsg事件：拖拽动作处理
        let that = this ;
        let pubmsgData = pubmsgDataEvent.message ;
        switch(pubmsgData.name) {
            case "videoDraghandle":
                // if (!TkGlobal.playback) {
                if (pubmsgData.data.otherVideoStyle) {
                    for (let [key,value] of Object.entries(pubmsgData.data.otherVideoStyle)) {
                        if (value.left || value.top) {
                            pubmsgData.data.otherVideoStyle[key].percentLeft = value.left;
                            pubmsgData.data.otherVideoStyle[key].percentTop = value.top;
                            delete pubmsgData.data.otherVideoStyle[key].left;
                            delete pubmsgData.data.otherVideoStyle[key].top;
                        }
                    }
                }
                this.isTriggerOnResize = true;
                this.state.otherVideoStyle = pubmsgData.data.otherVideoStyle;
                this.setState({otherVideoStyle:this.state.otherVideoStyle});
                for (let i in this.state.otherVideoStyle) {//拖拽后改变视频上的按钮
                    let isDrag = this.state.otherVideoStyle[i].isDrag;
                    eventObjectDefine.CoreController.dispatchEvent({type:'changeVideoBtnHide', message:{data:{isDrag:isDrag,extensionId:i}},});
                }
                // }
                break;
			case "ClassBegin":{
			    if (TkGlobal.playback) {
			        return;
                }
                //上课要删除本地流
                let streams = this.state.streams;
                for(let i= streams.length -1  ;i>=0 ;i--) {
                    let st = streams[i];
                    if (st.local) {
                        streams.splice(i,1);
                    }
                }
                that.updateStreams(streams);
                break;
           	}
			case "VideoSplitScreen":
            	this.state.userIDArry = pubmsgData.data.userIDArry;
				let datas = {
					userIDArry: this.state.userIDArry,
					ulHeight:this.ulHeight
				};
				eventObjectDefine.CoreController.dispatchEvent({ //子组件更新改变
					type: 'handleVideoSplitScreen',
					message: {
						datas: datas
					},
				});
            	break;
        }
    };
    
   
    handlerRoomParticipantLeave(handleData) {//用户离开房间时，删除该视频框的样式
        let user = handleData.user;
        //不是老师才删除离开用户的视频框样式：
        if ( user.role !== TkConstant.role.roleChairman) {
            if (TkGlobal.msglist.videoDragArray) {//其他人离开房间将他的视频样式从保存的msglist数据删除
                delete TkGlobal.msglist.videoDragArray[0].data.otherVideoStyle[user.id];
            }
            delete this.state.otherVideoStyle[user.id];
            this.setState({otherVideoStyle:this.state.otherVideoStyle});
            /*let data = {otherVideoStyle:this.state.otherVideoStyle,};
            let toID = '__none';
            ServiceSignalling.sendSignallingFromVideoDraghandle(data,toID);*/
        };
        if(this.state.userIDArry.indexOf(user.id)>=0){
        	this.state.userIDArry.splice(this.state.userIDArry.indexOf(user.id),1);
        	this.setState({
                userIDArry:this.state.userIDArry,
            });
        	this.sendDispatchAndSignallingSplitScreen();
        } 
    };

    handleVideoDragListData(handleData) {//msglist后面进来的人接收拖拽的信息
        if (handleData.message.data) {
            let id = handleData.message.data.id;
            this.state.otherVideoStyle[id] = handleData.message.data.videoStyle;
            this.setState({
                otherVideoStyle:this.state.otherVideoStyle,
            });
            let isDrag = this.state.otherVideoStyle[id].isDrag;
            //更新视频上的按钮：
            eventObjectDefine.CoreController.dispatchEvent({type:'changeVideoBtnHide', message:{data:{isDrag:isDrag,extensionId:id}},});
        }
    };

    handlerReceiveMsglistClassBegin(recvEventData){
        const that = this ;
        let streams = this.state.streams;
        for(let i= streams.length -1  ;i>=0 ;i--) {
            let st = streams[i];
            if (st.local) {
                streams.splice(i,1);
            }
        }
        that.updateStreams(streams);
    }

    handlerRoomUserpropertyChanged (recvEventData) {//用户属性改变的时候
        let user = recvEventData.user ;
        if (user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE) {//如果是下台状态，删除该视频框的样式
            if (TkGlobal.msglist.videoDragArray) {
                delete TkGlobal.msglist.videoDragArray[0].data.otherVideoStyle[user.id];
            }
            delete this.state.otherVideoStyle[user.id];
            this.setState({otherVideoStyle:this.state.otherVideoStyle});
            /*let data = {otherVideoStyle:this.state.otherVideoStyle,};
            let toID = '__none';
            ServiceSignalling.sendSignallingFromVideoDraghandle(data,toID);*/
            if(this.state.userIDArry.indexOf(user.id) >= 0) { // tkpc2.0.8
				this.state.userIDArry.splice(this.state.userIDArry.indexOf(user.id), 1);
				this.setState({
					userIDArry: this.state.userIDArry,
				});
				this.sendDispatchAndSignallingSplitScreen();// tkpc2.0.8
			}
        }
    };

    changeOtherVideoStyle(handleData) {
        this.isTriggerOnResize = true;
        if(this.state.userIDArry.length>=6 && (!handleData.source || handleData.source !== 'initVideoDrag')){   // tkpc2.0.8
        	return
        }
        this.state.otherVideoStyle[handleData.message.data.id] = handleData.message.data.style;
        this.setState({//自己本地改变拖拽的video样式
            otherVideoStyle:this.state.otherVideoStyle,
        });
        //拖拽后改变视频上的按钮
        eventObjectDefine.CoreController.dispatchEvent({type:'changeVideoBtnHide', message:{data:{isDrag:handleData.message.data.style.isDrag,extensionId:handleData.message.data.id}},});
        //通知其他人改变拖拽的video位置
        if (TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant) {
            let data = {otherVideoStyle:this.state.otherVideoStyle,};
            ServiceSignalling.sendSignallingFromVideoDraghandle(data);
        }
        if (TkGlobal.isSplitScreen && this.state.userIDArry.indexOf(handleData.message.data.id) === -1) {
            this.state.userIDArry.push(handleData.message.data.id);
            this.setState({
                userIDArry: this.state.userIDArry
            });
            this.sendDispatchAndSignallingSplitScreen();
        }
    };
    getRoomType(){
        let roomType = ServiceRoom.getTkRoom().getRoomType();
        return roomType;
    }

    //判断用户是否是老师
    isTeacher(userID){
        const user = ServiceRoom.getTkRoom().getUsers()[userID];
        if(!user){L.Logger.warning('[hv->isTeacher]user is not exist  , user id:'+userID+'!');} ;
        if (user && user.role === TkConstant.role.roleChairman) {
            return true;
        }
        return false;
    }

    //判断用户是否是助教和巡视员
    isAssistantAndPatrol(userID){
        const user = ServiceRoom.getTkRoom().getUsers()[userID];

        if (user.role === TkConstant.role.roleTeachingAssistant || user.role === TkConstant.role.rolePatrol) {
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
        if (!this.findStream(stream)) {
            streams.push(stream);
        }else{
            this.delCommonStreams(streams , stream );
            streams.push(stream);
        }
        //将自己放到第一个
        for (let i = 0; i < streams.length; i++) {
            let stream = streams[i];
            if(stream.extensionId==ServiceRoom.getTkRoom().getMySelf().id){
                streams.splice(i,1);//将自己的流删除
                streams.splice(0, 0, stream);//将自己放到第一个
            }
        }
        return  streams;
    }
    removeStream(stream){
        let streams=this.state.streams;
        return  this.delCommonStreams(streams , stream);
    }

   handlerRoomConnected(roomEvent){//房间连接时
        let that = this;
        let streams = this.state.streams;
        that.isTriggerOnResize == true;
       if(TkGlobal.isBroadcast && !TkGlobal.classBegin){
           return ;
       }
        if(TkGlobal.classBegin)
            return;

        if(this.getRoomType()!=TkConstant.ROOMTYPE.oneToOne && !CoreController.handler.getAppPermissions('pairOfManyIsShow')) {//如果不是一对一
            const userid = ServiceRoom.getTkRoom().getMySelf().id;

            if(TkConstant.joinRoomInfo.autoClassBegin && !TkConstant.joinRoomInfo.autoStartAV ){return;}

            let assistantFlag =  (this.getUser(userid) && this.getUser(userid).role === TkConstant.role.roleTeachingAssistant) && TkConstant.joinRoomInfo.assistantOpenMyseftAV?true:false; //助教开启音视频
            let studentFlag = this.isTeacher(userid) === false && CoreController.handler.getAppPermissions('localStream')?true:false; //学生且本地流存在
            //if(!this.isTeacher(userid) && !this.isAssistantAndPatrol(userid))
            if(studentFlag || assistantFlag) {
                let localStream = ServiceRoom.getLocalStream();
                let localid = localStream.getID();
                let streams = this.addStream(ServiceRoom.getLocalStream());
                this.updateStreams(streams);

            }
        } else if(this.getRoomType()==TkConstant.ROOMTYPE.oneToOne || CoreController.handler.getAppPermissions('pairOfManyIsShow')){

            let assistantFlag = TkConstant.joinRoomInfo.assistantOpenMyseftAV?true:false; //助教开启音视频
            const userid = ServiceRoom.getTkRoom().getMySelf().id;

            if(assistantFlag &&  this.getUser(userid) && this.getUser(userid).role === TkConstant.role.roleTeachingAssistant)
            {

                let localStream = ServiceRoom.getLocalStream();
                let localid = localStream.getID();
                let streams = this.addStream(ServiceRoom.getLocalStream());
                this.updateStreams(streams);
            }
        }
    }

    handlerStreamAdded(addEvent){//数据流添加
        let that = this;
        if(TkGlobal.playback){ //回放就跳过stream-add
            return ;
        }
        let streams = this.state.streams;

        if(this.getRoomType()!=TkConstant.ROOMTYPE.oneToOne && !CoreController.handler.getAppPermissions('pairOfManyIsShow')) {
            const userid = ServiceRoom.getTkRoom().getMySelf().id;
            let stream = addEvent.stream ;
            let id = stream.getID();
            if(stream.extensionId === ServiceRoom.getTkRoom().getMySelf().id ){
                if(that.isTeacher(userid)  === false ) {
                    //if(!TkConstant.joinRoomInfo.assistantOpenMyseftAV && !TkConstant.joinRoomInfo.autoStartAV ){return;}
                    if ((TkConstant.hasRole.roleTeachingAssistant && TkConstant.joinRoomInfo.assistantOpenMyseftAV) || TkConstant.hasRole.roleStudent) {
                        let localStream = ServiceRoom.getLocalStream();
                        let localid = localStream.getID();
                        let streams = this.addStream(ServiceRoom.getLocalStream());
                        this.updateStreams(streams);

                    }
                }
            }
        } else if(this.getRoomType()==TkConstant.ROOMTYPE.oneToOne || CoreController.handler.getAppPermissions('pairOfManyIsShow')){
            let assistantFlag = TkConstant.joinRoomInfo.assistantOpenMyseftAV?true:false; //助教开启音视频
            const userid = ServiceRoom.getTkRoom().getMySelf().id;

            if(addEvent.stream.extensionId === ServiceRoom.getTkRoom().getMySelf().id ) {
                if (assistantFlag && this.getUser(userid) && this.getUser(userid).role === TkConstant.role.roleTeachingAssistant) {

                    let localStream = ServiceRoom.getLocalStream();
                    let localid = localStream.getID();
                    let streams = this.addStream(ServiceRoom.getLocalStream());
                    this.updateStreams(streams);
                }
            }
        }
    }


    handlerStreamSubscribed(streamEvent){//数据流订阅
        let that = this;

        if(this.getRoomType()!=TkConstant.ROOMTYPE.oneToOne && !CoreController.handler.getAppPermissions('pairOfManyIsShow')) {
            if (streamEvent) {

                let stream = streamEvent.stream;
                const userid = stream.extensionId;

                if( this.isTeacher(userid)  === false  ) {
                    //if(that.state.streams.length<this.oenToManyMaxVideoNum) {
                        let streams = this.addStream(stream);
                        this.updateStreams(streams);

                    /*} else {
                        ServiceTooltip.showPrompt(TkGlobal.language.languageData.alertWin.call.fun.video.max.text);
                    }*/
                }
            }
        } else if(this.getRoomType()==TkConstant.ROOMTYPE.oneToOne || CoreController.handler.getAppPermissions('pairOfManyIsShow')){
            let assistantFlag = TkConstant.joinRoomInfo.assistantOpenMyseftAV?true:false; //助教开启音视频
            if (streamEvent) {
                const userid = streamEvent.stream.extensionId;

                if (assistantFlag && this.getUser(userid) && this.getUser(userid).role === TkConstant.role.roleTeachingAssistant) {
                    //if(that.state.streams.length<this.oenToOneMaxVideoNum) {
                        let streams = this.addStream(streamEvent.stream);
                        this.updateStreams(streams);
                    /*} else {
                        ServiceTooltip.showPrompt(TkGlobal.language.languageData.alertWin.call.fun.video.max.text);
                    }*/
                }
            }
        }
    };

    handlerStreamPublishFail(streamEvent){
        this.handlerStreamRemoved(streamEvent);
    };
    /*底部UL的高度*/
	changeBottomVesselSmartHeightRem(data){
		this.ulHeight = data.message.bottomVesselSmartHeightRem;
        eventObjectDefine.CoreController.dispatchEvent({ //改变视频框ul的高度
            type: 'changeBottomUlHeightRem',
            message: {ulHeight:this.ulHeight},
        });
	}

	/*双击触发演讲模式*/
	otherVideoOndblclick(stream, extensionId) {
        this.isTriggerOnResize = true;
		if(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant) {
            if(this.state.userIDArry.length>=6 && !this.state.otherVideoStyle[extensionId].isDrag){   // tkpc2.0.8
                return
            }
			if(TkGlobal.isSplitScreen) {
				if(this.state.otherVideoStyle[extensionId].isDrag) {
					eventObjectDefine.CoreController.dispatchEvent({ //初始化视频框拖拽的video位置
						type: 'handleInitVideoDrag',
						message: {
							id: extensionId
						},
					});
					if(this.state.userIDArry.length > 0) {
						this.state.userIDArry.splice(this.state.userIDArry.indexOf(stream.extensionId), 1);
					}
				} else {
					if(this.state.userIDArry.indexOf(stream.extensionId) === -1) {
						this.state.userIDArry.push(stream.extensionId);
					} else {
						this.state.userIDArry.splice(this.state.userIDArry.indexOf(stream.extensionId), 1);
					}					
				}
			} else {
				if(this.state.otherVideoStyle[extensionId].isDrag) {
					eventObjectDefine.CoreController.dispatchEvent({ //初始化视频框拖拽的video位置
						type: 'handleInitVideoDrag',
						message: {
							id: extensionId
						}
					});
				} else {
					for(let [key, value] of Object.entries(this.state.otherVideoStyle)) {
						if(value.isDrag) {
							this.state.userIDArry.push(key);
						}
					}
					if(this.state.userIDArry.indexOf(stream.extensionId) === -1) {
						this.state.userIDArry.push(stream.extensionId);
					}else {
						this.state.userIDArry.splice(this.state.userIDArry.indexOf(stream.extensionId), 1);
					}
				}
			}
            this.setState({
                userIDArry: this.state.userIDArry
            });
            this.sendDispatchAndSignallingSplitScreen();  // tkpc2.0.8
			TkGlobal.isSplitScreen = (this.state.userIDArry.length > 0) ? true : false; //根据数组长度改变是否是分屏状态
		}
	};
	
	handlemsglistVideoSplitScreen(data){ //监听分屏的msglist的函数     tkpc2.0.8
		this.state.userIDArry = data.message.data;
		this.setState({
                userIDArry: this.state.userIDArry
            });
		this.sendDispatchAndSignallingSplitScreen();
	}
	
	/*关于分屏的发送信令和事件分发*/
	sendDispatchAndSignallingSplitScreen(){
		let data = {
            userIDArry: this.state.userIDArry,
        };
		let datas = {
			userIDArry: this.state.userIDArry,
			ulHeight:this.ulHeight
		};
		eventObjectDefine.CoreController.dispatchEvent({ //子组件更新改变
			type: 'handleVideoSplitScreen',
			message: {datas: datas}
		});
		ServiceSignalling.sendSignallingFromVideoSplitScreen(data);
	};
	
    handlerStreamRemoved(streamEvent){

        let that = this;
        let stream = streamEvent.stream;
        //if (stream !== null && stream.elementID !== undefined) {
        if (stream) {
            //视频停止播放
            stream.hide();
            let streams = that.removeStream(stream);
            that.updateStreams(streams);
        }
    };

    handlerRoomPlaybackClearAll(){
        if(!TkGlobal.playback){L.Logger.error('No playback environment, no execution event[roomPlaybackClearAll] handler ') ;return ;};
        const that = this ;
        let streams=that.state.streams;
        streams.splice(0,streams.length);//清空数组
        that.setState({
            streams:streams
        });
    };
    handlerRoomDisconnected(recvEventData){
        this._clearAllStreamArray();
    }

    receiveStreamComplete(){
        eventObjectDefine.CoreController.dispatchEvent({type:'receiveStreamComplete' ,message:{right:false} });
    };


    _loadHVideoComponentArray( streams ){
    	let {id,isDrag} = this.props;
        const that = this ;
        let hVideoComponentArray = [] ;

        for(let stream of streams){
            if(stream===undefined) {

                continue;
            }


            let extensionId = stream.extensionId;
            if (!this.state.otherVideoStyle[extensionId]) {//设置初始值
                this.state.otherVideoStyle[extensionId] = {
                    percentTop:0,
                    percentLeft:0,
                    isDrag:false,
                };
                //this.setState({otherVideoStyle:this.state.otherVideoStyle});
            }

            hVideoComponentArray.push(
                <HVideoComponent id={extensionId} key={stream.getID()} stream={stream} classCss={"hvideo"}  otherVideoOndblclick={that.otherVideoOndblclick.bind(that , stream ,extensionId)}  receiveStreamCompleteCallback={that.receiveStreamComplete.bind(that)} {...this.state.otherVideoStyle[extensionId]}></HVideoComponent>
            );
        }
        return{
            hVideoComponentArray:hVideoComponentArray
        }
    };

    getUser(userid){
        return ServiceRoom.getTkRoom().getUser(userid);
    }

    handlerRoomDelmsg(recvEventData){
        const that = this ;
        let pubmsgData = recvEventData.message ;
        switch(pubmsgData.name)
        {
            case "ClassBegin":{
                that._clearAllStreamArray();
                break;
            }
            case "VideoSplitScreen":
            	this.initVideoSplitScreen();
            	break;
        }
    }
	initVideoSplitScreen() {
        this.state.userIDArry=[];
        TkGlobal.isSplitScreen = false;
        this.setState({
            userIDArry: this.state.userIDArry,
        });
    };
    /*清空数据流数组*/
    _clearAllStreamArray(){
        const that = this ;
        let streams=that.state.streams;
        streams.splice(0,streams.length);//清空数组
        that.setState({
            streams:streams
        });
    };

    render(){
        let {hVideoComponentArray} = this._loadHVideoComponentArray(this.state.streams);
        return (
            <section ref="mySection"  className="hvideo_container" id="hvideo_container" >
            	<ol id="other_video">
                {hVideoComponentArray}
                </ol>
            </section>
        )
    };
};

/*BaseVideSmart.defaultProps = {
    streams:[]
};*/

export default  HVideoContainer;

