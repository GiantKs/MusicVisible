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
import TkConstant from "../../../tk_class/TkConstant";
import eventObjectDefine from 'eventObjectDefine';
import  './css/cssVVideoContainer.css';
import VVideoComponent from "./VVideoComponent";
import ServiceSignalling from 'ServiceSignalling';

class VVideoContainer extends React.Component{
    constructor(props){
        super(props);
        this.state={
            streams:[],
            renderStreams:[],
            teacherId:-2,
            teacherStream:undefined,
            studentStream:undefined,
            areaExchangeFlag: false,
        };
        this.listernerBackupid = new Date().getTime()+'_'+Math.random() ;
        this.teacherExist = false;
        this.studentExist = false;
        this.assistantStream = [];
        this.moduleState = undefined;
        this.teacherCss="video-chairman-wrap";
        this.studentCss="video-hearer-wrap";
    };



	
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state

        let that = this;

        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamSubscribed_video, that.handlerStreamSubscribed.bind(that) , that.listernerBackupid ); //stream-subscribed事件：订阅事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamRemoved_video, that.handlerStreamRemoved.bind(that)  , that.listernerBackupid ); //stream-remove事件：取消订阅事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamAdded_video, that.handlerStreamAdded.bind(that)  , that.listernerBackupid ); //stream-added事件：增加事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomConnected, that.handlerRoomConnected.bind(that)  , that.listernerBackupid ); //Room-Connected事件：房间连接事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDisconnected,that.handlerRoomDisconnected.bind(that) , that.listernerBackupid); //Disconnected事件：失去连接事件
        //eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPlaybackClearAllFromPlaybackController,that.handlerRoomPlaybackClearAll.bind(that) , that.listernerBackupid); //roomPlaybackClearAll 事件：回放清除所有信令
        //eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomParticipantEvicted,that.handlerRoomParticipantEvicted.bind(that) , that.listernerBackupid); //Disconnected事件：参与者被踢事件
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that), that.listernerBackupid); //roomDelmsg事件 下课事件 classBegin
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPubmsg , that.handlerRoomPubmsg.bind(that), that.listernerBackupid); //roomPubmsg事件  上课事件 classBegin
        eventObjectDefine.CoreController.addEventListener( 'endClassbeginShowLocalStream', that.handlerEndClassbeginShowLocalStream.bind(that), that.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener( 'areaExchange', that.handlerAreaExchange.bind(that) ,that.listernerBackupid  ); // 区域交换事件监听
        eventObjectDefine.CoreController.dispatchEvent({type:'receiveStreamComplete' ,message:{right:true} });
        eventObjectDefine.CoreController.addEventListener( "receive-msglist-ClassBegin" , that.handlerClassBegin.bind(that), that.listernerBackupid); //roomPubmsg事件

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
        const that = this ;
        setTimeout(  () => {
            if(CoreController.handler.getAppPermissions('endClassbeginRevertToStartupLayout') && CoreController.handler.getAppPermissions('endClassbeginShowLocalStream')  ) { //是否拥有下课重置界面权限,并且是老师
                if( that.state.streams.length === 0){
                    that._addLocalStreamToVideoContainer();
                }
            }
        }, 250);
    };

    receiveStreamComplete(){
        eventObjectDefine.CoreController.dispatchEvent({type:'receiveStreamComplete' ,message:{right:true} });
    };

    handlerClassBegin(){
        this.setState({
            teacherStream:ServiceRoom.getLocalStream()
        });
    }

	  
    getRoomType(){
        let roomType = ServiceRoom.getTkRoom().getRoomType();
        return roomType;
    };


    isTeacher(userID){
        const user = ServiceRoom.getTkRoom().getUsers()[userID];
        if(!user){L.Logger.warning('[vv->isTeacher]user is not exist  , user id:'+userID+'!');} ;
        if (user && user.role === TkConstant.role.roleChairman) {
            return true;
        }
        return false;
    }

    isAssistantAndPatrol(userID){
        const user = ServiceRoom.getTkRoom().getUsers()[userID];
        if (user.role === TkConstant.role.roleTeachingAssistant || user.role === TkConstant.role.rolePatrol) {
            return true;
        }
        return false;
    }

    handlerRoomConnected(roomEvent)
    {
        let that= this;
        if(TkGlobal.classBegin || TkGlobal.isBroadcast && !TkGlobal.isClient )
            return;

        const userid = ServiceRoom.getTkRoom().getMySelf().id;

        if(this.getRoomType()==TkConstant.ROOMTYPE.oneToOne || CoreController.handler.getAppPermissions('pairOfManyIsShow')){
            that.moduleState = 1;

            if(CoreController.handler.getAppPermissions('localStream') ){
                if(TkConstant.joinRoomInfo.autoClassBegin && !TkConstant.joinRoomInfo.autoStartAV )
                    return;

                if(this.isTeacher(userid) === true){
                    that.setState({
                       teacherStream: ServiceRoom.getLocalStream()
                    });
                }
                if(  that.getUser(userid) && that.getUser(userid).role ===TkConstant.role.roleStudent) {
                    that.setState({
                        studentStream: ServiceRoom.getLocalStream()
                    });

                }
            }
        }

        if(this.getRoomType()!=TkConstant.ROOMTYPE.oneToOne && !CoreController.handler.getAppPermissions('pairOfManyIsShow')){
            if(CoreController.handler.getAppPermissions('localStream') ){
                if(TkConstant.joinRoomInfo.autoClassBegin && !TkConstant.joinRoomInfo.autoStartAV )
                    return;

                if(this.isTeacher(userid) === true){
                    that.setState({
                        teacherStream: ServiceRoom.getLocalStream()
                    });
                }
            }
        }

    }

    handlerStreamAdded(roomEvent){
        let that = this;
        const userid = ServiceRoom.getTkRoom().getMySelf().id;
        let stream = roomEvent.stream ;

        if(this.getRoomType()==TkConstant.ROOMTYPE.oneToOne || CoreController.handler.getAppPermissions('pairOfManyIsShow')){
            that.moduleState = 1;

            if(stream.extensionId === ServiceRoom.getTkRoom().getMySelf().id ){
                if(this.isTeacher(userid) === true){
                    that.setState({
                        teacherStream: ServiceRoom.getLocalStream()
                    });
                }
                if(  that.getUser(userid) && that.getUser(userid).role ===TkConstant.role.roleStudent) {
                    that.setState({
                        studentStream: ServiceRoom.getLocalStream()
                    });
		    
                }
            }
        }

        if(this.getRoomType()!==TkConstant.ROOMTYPE.oneToOne && !CoreController.handler.getAppPermissions('pairOfManyIsShow')){
            if(stream.extensionId === ServiceRoom.getTkRoom().getMySelf().id ){
                if(this.isTeacher(userid) === true){
                    that.setState({
                        teacherStream: ServiceRoom.getLocalStream()
                    });
                }
            }
        }

    }


    handlerStreamSubscribed(streamEvent){
        let that = this;
        //room-pubmsg事件：
        if(streamEvent) {
            // Log.error('handlerStreamSubscribed 1' , streamEvent.stream.getID()  , streamEvent.stream.extensionId  );
            let stream = streamEvent.stream;
            let userid = stream.extensionId;
            //let assistantFlag = (  this.getUser(userid) && this.getUser(userid).role===TkConstant.role.roleTeachingAssistant  && TkConstant.joinRoomInfo.assistantOpenMyseftAV)?true:false;

            /*if(((this.getRoomType()==TkConstant.ROOMTYPE.oneToOne || CoreController.handler.getAppPermissions('pairOfManyIsShow'))  )  || ((this.getRoomType()!=TkConstant.ROOMTYPE.oneToOne && !CoreController.handler.getAppPermissions('pairOfManyIsShow'))  ) ) {
                if(this.getRoomType()==TkConstant.ROOMTYPE.oneToOne || CoreController.handler.getAppPermissions('pairOfManyIsShow'))
                    that.moduleState = 1;

                if(this.isTeacher(userid) === true){
                    that.setState({
                        teacherStream: stream
                    });
                }
                if( that.getUser(userid) && that.getUser(userid).role ===TkConstant.role.roleStudent) {
                    that.setState({
                        studentStream: stream
                    });

                }
            }*/
            if(this.getRoomType()==TkConstant.ROOMTYPE.oneToOne || CoreController.handler.getAppPermissions('pairOfManyIsShow')){
                    that.moduleState = 1;

                if(this.isTeacher(userid) === true){
                    that.setState({
                        teacherStream: stream
                    });
                }
                if(that.getUser(userid).role ===TkConstant.role.roleStudent) {
                    that.setState({
                        studentStream: stream
                    });
		   
                }
            }

            if(this.getRoomType()!=TkConstant.ROOMTYPE.oneToOne && !CoreController.handler.getAppPermissions('pairOfManyIsShow')){
                if(this.isTeacher(userid) === true){
                    that.setState({
                        teacherStream: stream
                    });
                }
            }

        }
    };

    handlerStreamRemoved(streamEvent){
        let that = this;
        let stream = streamEvent.stream;
        // Log.error('handlerStreamRemoved 1' , streamEvent.stream.getID()  , streamEvent.stream.extensionId  );
        if (stream !== null) {//&& stream.elementID !== undefined
            const userid = stream.extensionId;
            if((this.getRoomType()!=TkConstant.ROOMTYPE.oneToOne && !CoreController.handler.getAppPermissions('pairOfManyIsShow')) || (this.getRoomType()==TkConstant.ROOMTYPE.oneToOne || CoreController.handler.getAppPermissions('pairOfManyIsShow'))) {
                //视频停止播放
                stream.hide();
                if(that.isTeacher(userid)  === true){
                    that.setState({
                        teacherStream:undefined
                    });
                }
                if( that.getUser(userid) && that.getUser(userid).role ===TkConstant.role.roleStudent) {
                    that.setState({
                        studentStream:undefined
                    });
                }
            }
        }
    };

    handlerRoomPlaybackClearAll(){
        if(!TkGlobal.playback){L.Logger.error('No playback environment, no execution event[roomPlaybackClearAll] handler ') ;return ;};
        const that = this ;
        // 清空音视频流
        that.setState({
            studentStream:undefined,
            teacherStream:undefined
        });
    };
    handlerRoomDisconnected(recvEventData){
        this._clearAllStreamArray();
    };

    handlerRoomDelmsg(recvEventData){
        const that = this ;
        let pubmsgData = recvEventData.message ;
        switch(pubmsgData.name)
        {
            case "ClassBegin":{
                that._clearAllStreamArray();
                setTimeout(  () => {
                    if(CoreController.handler.getAppPermissions('endClassbeginRevertToStartupLayout') && CoreController.handler.getAppPermissions('endClassbeginShowLocalStream')  ) { //是否拥有下课重置界面权限,并且是老师
                        if( that.state.streams.length === 0){
                            that._addLocalStreamToVideoContainer();
                        }
                    }
                }, 250);
                break;
            }

        }
    }
    handlerOnDoubleClick(stream , event){ //双击视频全屏
		if(! CoreController.handler.getAppPermissions('dblclickDeviceVideoFullScreenRight')){return ; } ;
        let targetVideo = document.getElementById('stream'+stream.getID() );       
        if(targetVideo){
            if( TkUtils.tool.isFullScreenStatus(targetVideo) ) {
                TkUtils.tool.exitFullscreen(targetVideo);
            }else{
                TkUtils.tool.launchFullscreen(targetVideo);
            }
        }
    };

    handlerRoomPubmsg(recvEventData){
        const that = this ;
        if(TkGlobal.isBroadcast || TkGlobal.playback ){//是直播的话不需要移除标签
            return ;
        }
        let pubmsgData = recvEventData.message
        switch(pubmsgData.name)
        {
            case "ClassBegin":{
                //上课要删除本地流
                const that = this ;
                // 清空音视频流
                that.setState({
                    studentStream:undefined,
                    teacherStream:undefined
                });
                break;
            }
            case "VideoSplitScreen":
            	this.state.userIDArry = pubmsgData.data.userIDArry;
            	this.setState({userIDArry:this.state.userIDArry})
            	break;
        }
    };




    _loadVVideoComponentArray( streams ){
        const that = this ;
        let showGift = that.state.studentStream!==undefined?true:false;

        return{
            showGift:showGift
        }
    };

    getUser(userid){
        return ServiceRoom.getTkRoom().getUser(userid);
    }
    /*添加本地数据流到容器中*/
    _addLocalStreamToVideoContainer(){
        const that = this;
        if(CoreController.handler.getAppPermissions('localStream') ){
            const userid = ServiceRoom.getTkRoom().getMySelf().id;
            if(this.isTeacher(userid) === true){
                that.setState({
                    teacherStream: ServiceRoom.getLocalStream()
                });
            }
            if(  that.getUser(userid) && that.getUser(userid).role ===TkConstant.role.roleStudent) {
                that.setState({
                    studentStream: ServiceRoom.getLocalStream()
                });
            }
        }
    };

    /*清空数据流数组*/
    _clearAllStreamArray( callback ){
        const that = this ;
        // 清空音视频流
        that.setState({
            studentStream:undefined,
            teacherStream:undefined
        });
    };
    render(){
        let that = this;
        
        let {showGift} = this._loadVVideoComponentArray(this.state.studentStreams);
        return (
            <div id={that.props.id || 'participants'} className={"clear-float video-participants-vessel " + (this.state.areaExchangeFlag ? 'areaExchange' : '')}>
                <VVideoComponent  handlerOnDoubleClick={that.handlerOnDoubleClick.bind(that , that.state.teacherStream)}  stream={this.state.teacherStream}  classCss={that.teacherCss} showGift={false}   receiveStreamCompleteCallback={that.receiveStreamComplete.bind(that)}  ></VVideoComponent>
                {that.moduleState===1?<VVideoComponent  handlerOnDoubleClick={that.handlerOnDoubleClick.bind(that , that.state.studentStream)}  stream={this.state.studentStream}  classCss={that.studentCss} showGift={showGift}   receiveStreamCompleteCallback={that.receiveStreamComplete.bind(that)}  ></VVideoComponent>:undefined}
            </div>
        )
    };
};

/*BaseVideSmart.defaultProps = {
 streams:[]
 };*/

/*VVideoContainer.propTypes = {
 studentSetJson:PropTypes.object.isRequired ,
 videoHoverJson:PropTypes.object.isRequired
 };*/

export default  VVideoContainer;