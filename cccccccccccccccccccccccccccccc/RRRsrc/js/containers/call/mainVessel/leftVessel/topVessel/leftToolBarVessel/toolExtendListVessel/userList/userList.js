/**
 * 用户列表的Smart组件
 * @module UserListSmart
 * @description   用户列表的Smart组件,处理用户列表的业务
 * @author QiuShao
 * @date 2017/08/11
 */
'use strict';
import React from 'react';
import TkGlobal from 'TkGlobal';
import eventObjectDefine from 'eventObjectDefine';
import TkConstant from 'TkConstant';
import ServiceRoom from 'ServiceRoom';
import ServiceSignalling from 'ServiceSignalling';
import CoreController from 'CoreController';
import WebAjaxInterface from 'WebAjaxInterface' ;
import UserListDumb from '../../../../../../../../components/userList/userList';
import ServiceTooltip from 'ServiceTooltip';

class UserListSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            checkNetworkChecked:false,
            userlistData: this._productionDefaultUserlistData(),
            userIsAsk:{},
            updateState:false ,
        };
        this.listernerBackupid = new Date().getTime()+'_'+Math.random() ;
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this ;
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomConnected , that.handlerRoomConnected.bind(that) , that.listernerBackupid ); //room-connected事件-接收到房间连接成功后执行添加用户到用户列表中
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomParticipantJoin , that.handlerRoomParticipantJoin.bind(that) , that.listernerBackupid ); //room-participant_join事件-收到有参与者加入房间后执行添加用户到用户列表中
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomParticipantLeave , that.handlerRoomParticipantLeave.bind(that) , that.listernerBackupid); //room-participant_leave事件-收到有参与者离开房间后执行删除用户在用户列表中
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomUserpropertyChanged , that.handlerRoomUserpropertyChanged.bind(that) , that.listernerBackupid); //room-userproperty-changed事件-收到参与者属性改变后执行更新用户在用户列表中
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDisconnected , that.handlerRoomDisconnected.bind(that) , that.listernerBackupid); //room-disconnected事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPlaybackClearAllFromPlaybackController,that.handlerRoomPlaybackClearAll.bind(that) , that.listernerBackupid); //roomPlaybackClearAll 事件：回放清除所有信令
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.streamRemoved_video , that.handlerStreamRemoved.bind(that) , that.listernerBackupid); //streamRemoved事件
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.streamSubscribed_video , that.handlerStreamSubscribed.bind(that) , that.listernerBackupid); //streamSubscribed事件
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.streamAdded_video , that.handlerStreamAdded.bind(that) , that.listernerBackupid); //streamAdded_video事件
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPubmsg , that.handlerRoomPubmsg.bind(that) , that.listernerBackupid); //roomPubmsg事件
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.streamReconnectionFailed_video , that.handlerStreamReconnectionFailed_video.bind(that) , that.listernerBackupid );
        //tkpc2.0.8
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.streamPublishFail_video , that.handlerStreamPublishFail_video.bind(that) , that.listernerBackupid );
        eventObjectDefine.CoreController.addEventListener( 'receive-msglist-ClassBegin' , that.handlerReceiveMsglistClassBegin.bind(that) , that.listernerBackupid); //receive-msglist-ClassBegin 事件
        eventObjectDefine.CoreController.addEventListener('initAppPermissions' , that.handlerInitAppPermissions.bind(that)  , that.listernerBackupid) ; //事件 initAppPermissions
        // eventObjectDefine.CoreController.addEventListener( 'handleGetRoomMark' , that.handleGetRoomMark.bind(that) , that.listernerBackupid); //receive-msglist-ClassBegin 事件
        // eventObjectDefine.CoreController.addEventListener( 'handleSetRoomMark' , that.handleSetRoomMark.bind(that) , that.listernerBackupid); //receive-msglist-ClassBegin 事件
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        eventObjectDefine.CoreController.removeBackupListerner(this.listernerBackupid);
    };

    handlerInitAppPermissions(){
        this.updateAllUserToList();
    };

    //tkpc2.0.8
    handlerStreamPublishFail_video(handlerStreamPublishFail_videoEventData){
        let stream = handlerStreamPublishFail_videoEventData.stream ;
        this._updateTemporaryDisabled(stream.extensionId , false);
    };

    handlerStreamReconnectionFailed_video (streamReconnectionFailed_videoEventData) {
        let stream = streamReconnectionFailed_videoEventData.stream ;
        this._updateTemporaryDisabled(stream.extensionId , false);
    };

    /*处理room-connected事件*/
    handlerRoomConnected(roomConnectedEventData){
        const  that = this ;
        let users = ServiceRoom.getTkRoom().getUsers() ;
        /*if (CoreController.handler.getAppPermissions('pairOfManyIsShow')) {
            WebAjaxInterface.getRoomMark();//获取课堂点名记录
        }*/
        for(let key in  users ){
            let user = users[key];
            let isConflict = CoreController.handler.checkRoleConflict(user , false) ;
            if(!isConflict){
                that.addUserToList(user);
            }
        }
    };

    /*处理room-participant_join事件*/
    handlerRoomParticipantJoin(roomParticipantJoinEventData){
        const that = this ;
        const user = roomParticipantJoinEventData.user ;
        /*if (CoreController.handler.getAppPermissions('pairOfManyIsShow')) {
            WebAjaxInterface.getRoomMark();//获取课堂点名记录
        }*/
        let isConflict = CoreController.handler.checkRoleConflict(user , false) ;
        if(!isConflict){
            that.addUserToList(user);
        }
    };

    /*处理room-participant_leave事件*/
    handlerRoomParticipantLeave(roomParticipantLeaveEventData){
        const that = this ;
        const user = roomParticipantLeaveEventData.user ;
        that.removeUserToList(user);
    }


    /*处理room-userproperty-changed事件*/
    handlerRoomUserpropertyChanged(roomUserpropertyChangedEventData){
        const that = this ;
        const changePropertyJson  = roomUserpropertyChangedEventData.message ;
        const user = roomUserpropertyChangedEventData.user ;
        for( let key of Object.keys(changePropertyJson) ){
            if( key !== 'giftnumber' ){
                /*if (CoreController.handler.getAppPermissions('pairOfManyIsShow')) {
                    if (key === 'publishstate' && changePropertyJson[key] !== TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE) {
                        let userId = user.id;
                        WebAjaxInterface.setRoomMark(userId);//设置课堂点名记录
                        this.state.userIsAsk[userId] = true;
                        this.updateUserToList(user);
                    }else {
                        this.updateUserToList(user);
                    }
                    if( key === 'publishstate' && changePropertyJson[key] === TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE ){ //todo 这里先暂时处理（如果下台3s后还没有更新临时disabled状态，则自动更新）
                        clearTimeout(this.publishstate_none_timer);
                        this.publishstate_none_timer = setTimeout( ()=> {
                            this._updateTemporaryDisabled(user.id, false);
                        } , 10000) ;
                    }else if(key === 'publishstate' && changePropertyJson[key] !== TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE){//todo 这里先暂时处理（如果上台10s后还没有更新临时disabled状态，则自动更新）
                        clearTimeout(this.publishstate_none_timer);
                        this.publishstate_none_timer = setTimeout( ()=> {
                            this._updateTemporaryDisabled(user.id, false);
                        } , 10000) ;
                    }
                }else {
                    that.updateUserToList(user) ;
                }*/
                that.updateUserToList(user) ;
            }
        }
    };

    handlerRoomPlaybackClearAll(){
        if(!TkGlobal.playback){L.Logger.error('No playback environment, no execution event[roomPlaybackClearAll] handler ') ;return ;};
        const that = this;
        that.recoverDefaultUserToList();
    };

    /*处理room-disconnected事件*/
    handlerRoomDisconnected(roomDisconnectedEventData){
        const that = this;
        that.recoverDefaultUserToList();
    };

    /*处理用户列表中用户点击item的事件-用户上下台功能*/
    handlerUserListItemOnClick(userid){
        const that = this ;
	    let user =  ServiceRoom.getTkRoom().getUsers()[userid] ;
        //该用户在后台模式并且是下台状态就不让上台，给予提示
        if (user.isInBackGround && user.isInBackGround === true && user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE) {
            ServiceTooltip.showPrompt(
                user.nickname
                + TkGlobal.language.languageData.alertWin.call.prompt.remoteStreamFailure.mobileHome.two
            );
            return;
        }

        /*if (CoreController.handler.getAppPermissions('pairOfManyIsShow')) {//如果是一起作业的一对三十
            let publishedUsers =  ServiceRoom.getTkRoom().getSpecifyUsersByPublishstate(undefined,2,true);
            if (user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE) {
                if (Object.keys(publishedUsers).length >= 1) {
                    for(let key in publishedUsers) {//让已经在台上的人下台
                        //that._updateTemporaryDisabled(key ,false );
                        ServiceSignalling.userPlatformUpOrDown(key) ;
                    }
                }
            }
        }*/

        //tkpc2.0.8
        if(!user){ L.Logger.error('user is not exist , userid is '+userid+'!'); return;}
        user.passivityPublish = true ;

        //let assistantFlag = ServiceRoom.getTkRoom().getRoomType()==TkConstant.ROOMTYPE.oneToOne && TkConstant.joinRoomInfo.assistantOpenMyseftAV;
        //let studentPlatformUp = ServiceRoom.getTkRoom().getRoomType()==TkConstant.ROOMTYPE.oneToOne && assistantFlag &&  user.role === TkConstant.role.roleStudent && user.publishstate == TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE;   //一对一，学生没有上台，且助教可以发布音视频
        if( (!ServiceRoom.getTkRoom().isBeyondMaxVideo() || user.publishstate !== TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE )){ //没有超出最大发布路数   //xgd 17-09-20
            if(!TkGlobal.classBegin && ServiceRoom.getTkRoom().getMySelf().id == userid){  //LJH修改  爱斑马的上课前助教开启音视频配置 满足条件助教自己点击自己
                this._updateTemporaryDisabled(userid ,true );
                ServiceSignalling.userPlatformUpOrDown( userid ) ;
            }else if(TkGlobal.classBegin){ //LJH   上课之后不做修改保留之前
                this._updateTemporaryDisabled(userid ,true );
                ServiceSignalling.userPlatformUpOrDown( userid ) ;
            }
        }else{
            const children = <span className="beyond-max-video" > {TkGlobal.language.languageData.alertWin.call.prompt.remoteStreamFailure.publishvideoFailure_overrun.one} </span> ;
            that.updateUserToList( user , children );
            that._updateTemporaryDisabled(userid ,true );
            setTimeout( () => {
                that.updateUserToList( user , undefined );
                that._updateTemporaryDisabled(userid ,false );
            } , 3000) ;
        }
    } ;

    handlerStreamRemoved(recvEventData){
        let stream = recvEventData.stream ;
        this._updateTemporaryDisabled(stream.extensionId , false);
        //tkpc2.0.8
        let userid = stream.extensionId ;
        let user =  ServiceRoom.getTkRoom().getUsers()[userid] ;
        if(!user){ L.Logger.error('user is not exist , userid is '+userid+'!'); return;}
        user.passivityPublish = false ;
    };

    handlerRoomPubmsg(recvEventData){
        const that = this ;
        let pubmsgData = recvEventData.message ;
        switch(pubmsgData.name) {
            case "StreamFailure"://wj改8-10
                this._updateTemporaryDisabled(pubmsgData.data.studentId , false);
                //tkpc2.0.8
                let userid = pubmsgData.data.studentId ;
                let user =  ServiceRoom.getTkRoom().getUsers()[userid] ;
                if(!user){ L.Logger.error('user is not exist , userid is '+userid+'!'); return;}
                if(user.passivityPublish){
                    user.passivityPublish = false ;
                }
                break;
            case 'ClassBegin':
                that.updateAllUserToList();
                break;
        }
    };
    handlerStreamSubscribed(streamSubscribedEventData){
        let stream = streamSubscribedEventData.stream ;
        /*if (CoreController.handler.getAppPermissions('pairOfManyIsShow')) {
            WebAjaxInterface.setRoomMark(stream.extensionId);
            let userId = stream.extensionId;
            this.state.userIsAsk[userId] = true;
            let user = ServiceRoom.getTkRoom().getUsers()[userId];
            this.updateUserToList(user);
        }*/
        this._updateTemporaryDisabled(stream.extensionId , false);
        let user =  ServiceRoom.getTkRoom().getUsers()[stream.extensionId] ;
        if(!user){ L.Logger.error('user is not exist , userid is '+userid+'!'); return;}
        user.passivityPublish = false ;
    };
    handlerStreamAdded(streamSubscribedEventData){
        let stream = streamSubscribedEventData.stream ;
        //tkpc2.0.8，删除判断id是否和自己是否相等
        if( stream && stream.extensionId === ServiceRoom.getTkRoom().getMySelf().id ){
            this._updateTemporaryDisabled(stream.extensionId , false);
            let user =  ServiceRoom.getTkRoom().getUsers()[stream.extensionId] ;
            if(!user){ L.Logger.error('user is not exist , userid is '+userid+'!'); return;}
            user.passivityPublish = false ;
        }
    };

    handlerReceiveMsglistClassBegin(recvEventData){
        const that = this ;
        that.updateAllUserToList();
    };

    /*在用户列表中添加或者更新用户*/
    addUserToList(user){
        const that = this ;
        if(user.role === TkConstant.role.roleStudent  || user.role === TkConstant.role.roleTeachingAssistant ||  user.role === TkConstant.role.roleChairman) {
            if( !that.state.userlistData.userListItemJson.has(user.id) ){
                let userItemDescInfo = that._productionUserItemDescInfo(user);
                //tkpc2.0.8
                if(!userItemDescInfo){return ;}
                userItemDescInfo.temporaryDisabled = false ;
                that.state.userlistData.titleJson.number += 1;
                that.state.userlistData.userListItemJson.set(user.id , userItemDescInfo );
                that.setState({userlistData:that.state.userlistData});
            }
        }
    };

    /*在用户列表中删除用户*/
    removeUserToList(user){
        const that = this ;
        if(user.role === TkConstant.role.roleStudent  || user.role === TkConstant.role.roleTeachingAssistant ||  user.role === TkConstant.role.roleChairman) {
            if(that.state.userlistData.userListItemJson.has(user.id) ){
                that.state.userlistData.userListItemJson.delete(user.id) ;
                that.state.userlistData.titleJson.number -= 1;
                that.setState({userlistData:that.state.userlistData});
            }
        }
    };

    /*更新所有的用户属性状态*/
    updateAllUserToList(){
        const that = this ;
        let users = ServiceRoom.getTkRoom().getUsers();
       
        for(let user of Object.values(users) ){
            that.updateUserToList(user);
        }
    };

    /*在用户列表中更新用户*/
    updateUserToList(user , children){
        const that = this ;
        if(user.role === TkConstant.role.roleStudent  || user.role === TkConstant.role.roleTeachingAssistant ||  user.role === TkConstant.role.roleChairman ) {
            let userItemDescInfo = that._productionUserItemDescInfo(user , children);
            //tkpc2.0.8
            if(!userItemDescInfo){return ;}
            if(that.state.userlistData.userListItemJson.has(user.id) ){
                Object.customAssign(that.state.userlistData.userListItemJson.get(user.id) , userItemDescInfo ) ;
                that.setState({userlistData:that.state.userlistData});
            }
        }
    };

    /*恢复用户列表的默认数据*/
    recoverDefaultUserToList(){
        const that = this ;
        const defaultUserlistData = that._productionDefaultUserlistData();
        that.setState({userlistData:defaultUserlistData});
    };

    /*更新临时disabled*/
    _updateTemporaryDisabled(userid , temporaryDisabled){
        const that = this ;
        if(this.publishstate_none_timer ){
            clearTimeout(this.publishstate_none_timer );
            this.publishstate_none_timer = null ;
        }
        if(that.state.userlistData.userListItemJson.has(userid) ){
            Object.customAssign(that.state.userlistData.userListItemJson.get(userid) , {temporaryDisabled:temporaryDisabled} ) ;
            that.setState({userlistData:that.state.userlistData});
        }
    };

    /*一起作业星星点击提问事件*/
    /*askQuestionClick(e) {
        let userId = e.target.id.split('_')[1];
        let user = ServiceRoom.getTkRoom().getUsers()[userId];
        if (this.state.userIsAsk[userId]) {
            this.state.userIsAsk[userId] = false;
            this.updateUserToList(user);
            WebAjaxInterface.setRoomMark(userId,1);
        }else {
            this.state.userIsAsk[userId] = true;
            this.updateUserToList(user);
            WebAjaxInterface.setRoomMark(userId);
        }
        e.stopPropagation();
    };*/

    handleGetRoomMark(handleData) {//处理获取课堂点名记录
        let roomUsersMark = handleData.message.roomusermark;
        if (roomUsersMark && roomUsersMark != undefined) {
            roomUsersMark.map((item)=>{
                if (item && item != null) {
                    let user = ServiceRoom.getTkRoom().getUsers()[item];
                    if (user && user != undefined) {
                        this.state.userIsAsk[item] = true;
                        this.updateUserToList(user);
                    }
                }
            });
        }
    };
    handleSetRoomMark(handleData) {//处理设置课堂点名记录
        let setAskInfo = handleData.message.setAskInfo;
        if (setAskInfo.state == 0) {
            /*let userId = setAskInfo.userid;
            this.state.userIsAsk[userId] = true;
            let user = ServiceRoom.getTkRoom().getUsers()[userId];
            this.updateUserToList(user);*/
        }
    }

    handlerOpenUserExtendListOnMouseLeave(userid , event){
        let user = ServiceRoom.getTkRoom().getUser(userid);
        if(user){
            if(  user.openUserExtendList ){
                this._updateOpenUserExtendList(user , false );
            }
        }
        if(event){
            event.preventDefault();
            event.stopPropagation();
        }
        return false ;
    };

    handlerOpenUserExtendListOnClick(userid , event){
        let user = ServiceRoom.getTkRoom().getUser(userid);
        if(user){
            let openUserExtendList = user.openUserExtendList ;
            this._updateOpenUserExtendList(user , !openUserExtendList );
        }
        if(event){
            event.preventDefault();
            event.stopPropagation();
        }
        return false ;
    };

    handlerUserRefresh(userid , event){
        let data = {
            action:'refresh' ,
        };
        ServiceSignalling.sendSignallingFromRemoteControl(userid , data);
        if(event){
            event.preventDefault();
            event.stopPropagation();
        }
        return false ;
    };

    handlerUserDeviceManagement(userid , event){
        eventObjectDefine.CoreController.dispatchEvent({type:'remoteControl_deviceManagement' , message:{userid:userid}});
        if(event){
            event.preventDefault();
            event.stopPropagation();
        }
        return false ;
    };

    handlerUserAreaSelection(userid , event){
        eventObjectDefine.CoreController.dispatchEvent({type:'remoteControl_userAreaSelection' , message:{userid:userid}});
        if(event){
            event.preventDefault();
            event.stopPropagation();
        }
        return false ;
    };

    _updateOpenUserExtendList(user ,openUserExtendList ){
        if(user){
            user.openUserExtendList = openUserExtendList ;
            this.updateUserToList(user);
        }
    };

    /*根据user生产用户描述信息*/
    _productionUserItemDescInfo(user , children ){
        const that = this ;
        //tkpc2.0.8
        if(user.role === TkConstant.role.roleChairman && !TkConstant.hasRole.roleTeachingAssistant){ //用户角色是老师并且我自己的角色不是助教，则不显示老师
            return ;
        }
        //LJH 添加能否点击判断
        let disabled = !TkGlobal.classBegin && TkConstant.joinRoomInfo.isBeforeClassReleaseVideo && TkConstant.joinRoomInfo.assistantOpenMyseftAV ?false:!CoreController.handler.getAppPermissions('userlisPlatform') ||  user.id == ServiceRoom.getTkRoom().getMySelf().id && user.role === TkConstant.role.roleTeachingAssistant && !TkConstant.joinRoomInfo.assistantOpenMyseftAV ||  (!user.hasvideo && !user.hasaudio &&  user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE ) || (user.disableaudio && user.disablevideo &&  user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE)  || !(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant) ; //没有音视频设备或者音视频设备禁用或者角色不是老师（助教）则不能上台;  //2017-09-18 xgd
        let beforeIconChildrenArray  = undefined ;
        if(TkConstant.hasRole.roleTeachingAssistant && user.id !== ServiceRoom.getTkRoom().getMySelf().id){ //如果是助教才有管理的功能
            beforeIconChildrenArray = [] ;
            let extendButtonShow =  {
                // refresh:user.appType === 'webpageApp' ,
                refresh:user.appType === 'webpageApp' && !(user.devicetype === 'MacClient' || user.devicetype === 'WindowClient') ,
                deviceManagement:user.appType === 'webpageApp' ,
                areaSelection:true ,
            };
            let extendNum = 0 ;
            for(let value of Object.values(extendButtonShow)){
                if(value){
                    extendNum++;
                }
            }
            beforeIconChildrenArray.push(
                <div className="user-extend-list remote-control-container add-position-absolute-top0-right0"  key={'userExtendList'}  style={{display:user.openUserExtendList ? 'table' : 'none' }} >
                   {/* <button className="icon-btn remote-title" >{TkGlobal.language.languageData.remoteControl.remoteTitle}</button>*/}
                    <span className={"extend-container " }  >
                        {!extendButtonShow.refresh?undefined: <button className="extend-option refresh"   onClick={that.handlerUserRefresh.bind(that , user.id)} >{TkGlobal.language.languageData.remoteControl.refresh}</button> }
                        {!extendButtonShow.deviceManagement?undefined: <button className="extend-option device-management" onClick={that.handlerUserDeviceManagement.bind(that , user.id)}  >{TkGlobal.language.languageData.remoteControl.deviceManagement}</button>}
                        {!extendButtonShow.areaSelection?undefined: <button className="extend-option area-selection"  onClick={that.handlerUserAreaSelection.bind(that , user.id)}  >{TkGlobal.language.languageData.remoteControl.optimalServer}</button>}
                    </span>
                </div>
            );
        }
        let roleClassName =  (user.role === TkConstant.role.roleChairman ? 'roleChairman':( user.role === TkConstant.role.roleTeachingAssistant ? 'roleTeachingAssistant': ( user.role === TkConstant.role.roleStudent ? 'roleStudent': ''  )  ) ) ;
        const userItemDescInfo =  {
            id:user.id,
            disabled:disabled ,
            active:  user.publishstate !== TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE  ,
            onClick:!disabled?that.handlerUserListItemOnClick.bind(that , user.id ):undefined ,
            textContext:user.nickname ,
            clientDeviceVersionInfo :user.devicetype,
            children:children  ,
            order:user.role === TkConstant.role.roleStudent ? 0 : ( user.role === TkConstant.role.roleTeachingAssistant?1:2 ), //根据角色排序用户列表，数越小排的越往后 （order:0-学生 ， 1-助教 ， 2-暂时未定）
            beforeIconArray:[
                {
                    show:true ,
                    className:user.udpstate === L.Constant.udpState.notOnceSuccess ? 'udp-notOnceSuccess ' : 'udp-ok ' + ( user.openUserExtendList?' userRemoteActive':' '  ) ,
                    disabled:!(TkConstant.hasRole.roleTeachingAssistant && user.id !== ServiceRoom.getTkRoom().getMySelf().id) ,
                    title:undefined ,
                    iconChildren:beforeIconChildrenArray ,
                    before:true ,
                    onMouseLeave:that.handlerOpenUserExtendListOnMouseLeave.bind(that , user.id) ,
                    onClick:that.handlerOpenUserExtendListOnClick.bind(that , user.id )
                }
            ] ,
            afterIconArray:[
                {
                    show:!(user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE && !user.hasaudio && !user.hasvideo) ,//tkpc2.0.8
                    'className':'v-user-update-icon  '+ roleClassName + ( user.publishstate !== TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE ? ' on' : ' off') ,
                    title: user.publishstate !== TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE ? TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.update.up.title : TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.update.down.title
                } ,
                {
                    show:user.hasaudio ,
                    'className':'audio-icon ' +' '+ ( (user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH  ) ?  'on' : 'off' ) + ' ' +( user.disableaudio ? 'disableaudio' : '') ,
                    title: user.disableaudio ? TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.audio.disabled.title : (
                        user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH   ?
                            TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.audio.on.title : TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.audio.off.title
                        ) ,
                } ,
                {
                    show:user.hasvideo ,
                    'className':'video-icon ' + ( ( user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH ) ? 'on' : 'off' )+ ' ' +( user.disablevideo ? 'disablevideo' : '') ,
                    title: user.disablevideo ? TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.video.disabled.title : (
                        user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH   ?
                            TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.video.on.title : TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.video.off.title
                    ) ,
                } ,
                {
                    show:true ,
                    'className':'pencil-icon '+ (user.candraw? 'on' : 'off') ,
                    title:user.candraw ?  TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.Scrawl.on.title :  TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.Scrawl.off.title
                } ,
                /*{
                    show:CoreController.handler.getAppPermissions('pairOfManyIsShow')?true:false ,
                    id:'ask_'+user.id,
                    'className':'star-icon '+ (this.state.userIsAsk[user.id]?'on' : 'off'),
                    onClick:that.askQuestionClick.bind(that),
                    title:this.state.userIsAsk[user.id]?  TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.answered.on.title :  TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.answered.off.title
                } ,*/
                {
                    show:true ,
                    'className':'hand-icon '+ (user.raisehand? 'on' : 'off') ,
                    title:user.raisehand?TkGlobal.language.languageData.header.system.Raise.yesText : TkGlobal.language.languageData.header.system.Raise.noText
                } ,
            ]
        } ;
        /*--tkpc2.0.8--start*/
        if( !CoreController.handler.getAppPermissions('showUserlistIcon') ||  (user.role === TkConstant.role.roleTeachingAssistant && !TkConstant.joinRoomInfo.assistantOpenMyseftAV) ){ //没有音视频设备则不显示用户列表的状态图标   //2017-09-18 xgd
            userItemDescInfo.afterIconArray.length = 0 ;
        }
        /*--tkpc2.0.8--end*/
        return userItemDescInfo ;
    };

    /*生产默认的用户列表数据*/
    _productionDefaultUserlistData(){
        const userlistData = {
            titleJson:{
                title:TkGlobal.language.languageData.toolContainer.toolIcon.userList.title ,
                number:0,
                /*isUserList:true,
                checkNetworkBox:{
                    text:TkGlobal.language.languageData.toolContainer.toolIcon.userList.input.text,
                    onChange:this.checkNetworkOnChange && this.checkNetworkOnChange!==undefined? this.checkNetworkOnChange.bind(this):undefined,
                    checked:this.state && this.state.checkNetworkChecked !== undefined ? this.state.checkNetworkChecked : false,
                }*/
            } ,
            userListItemJson:new Map(),
        };
        return userlistData ;
    };

    render(){
        const that = this ;
        const {show , styleJson } = this.props ;
        return (
            <UserListDumb show={show} styleJson={styleJson} {... that.state.userlistData}    />
        )
    };

};
export default  UserListSmart;

