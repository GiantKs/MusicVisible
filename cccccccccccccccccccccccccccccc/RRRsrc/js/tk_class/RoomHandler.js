/**
 * 房间相关处理类
 * @class RoomHandler
 * @description   提供 房间相关的处理功能
 * @author QiuShao
 * @date 2017/7/21
 */
'use strict';
import eventObjectDefine from 'eventObjectDefine';
import TkConstant from 'TkConstant' ;
import TkUtils from 'TkUtils' ;
import RoleHandler from 'RoleHandler' ;
import CoreController from 'CoreController' ;
import ServiceTooltip from 'ServiceTooltip' ;
import TkGlobal from "TkGlobal" ;
import WebAjaxInterface from "WebAjaxInterface" ;
import ServiceRoom from "ServiceRoom" ;
import ServiceSignalling from "ServiceSignalling" ;
import ServiceTools from "ServiceTools" ;
import TkAppPermissions from 'TkAppPermissions';
import HandlerWhiteboardAndCoreInstance from '../containers/whiteboardAndNewppt/plugs/literally/js/handlerWhiteboardAndCore';

class RoomHandler{
    constructor(room){
        this.room = room ;
    } ;

    /*注册房间
    *@method registerRoom */
    registerRoom(){
        let that = this;
        let roomInfo = {
            userName: ServiceRoom.getTkRoom().getMySelf().nickname,
            roomName: ServiceRoom.getTkRoom().getRoomProperties().roomname,
            userThirdid: ServiceRoom.getTkRoom().getMySelf().id,
        };
        if(!TkGlobal.playback){
            /*跳转call*/
            let timestamp = new Date().getTime() ;
            that._saveAddressToSession(timestamp);/!*保存登录地址到sessionStorage*!/
            if(!TkGlobal.isBroadcastMobile){ //不是移动端并且直播
                window.location.hash = 'call?timestamp='+ timestamp ;
                //hashHistory.push('/call?timestamp='+ timestamp);
            }
        }
        let userName = roomInfo.userName;
        let roomName = roomInfo.roomName;
        let userThirdid = roomInfo.userThirdid;
        //save tk & roomName & userName in service
        ServiceRoom.setRoomName(roomName);
        ServiceRoom.setUserName(userName);
        ServiceRoom.setUserThirdid(userThirdid);
        document.head.getElementsByTagName('title')[0].innerHTML = ServiceRoom.getRoomName(); //设置title为房间名字
        let isInitStream =  !TkGlobal.playback &&  !(TkGlobal.isBroadcast && !TkGlobal.isClient) && ( TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleStudent || (TkConstant.hasRole.roleTeachingAssistant && TkConstant.joinRoomInfo.assistantOpenMyseftAV) ) ;
        const _initLocalStreamAndJoinroom = (devicesInfo) => {          //xgd 17-09-30 直播不进行视频和音频设备的枚举
            let hasDevice = devicesInfo.hasdevice;
            let audioPermissions = isInitStream ? hasDevice["audioinput"] : false;   //xgd 17-09-15 //xgd 17-09-30 直播
            let vedioPermissions =  isInitStream ? hasDevice["videoinput"] : false;   //xgd 17-09-15 //xgd 17-09-30 直播
            ServiceRoom.setLocalStream(
                TK.Stream({ audio:audioPermissions, video: vedioPermissions , data: false , extensionId:ServiceRoom.getTkRoom().getMySelf().id , attributes:{ type:'video' }  }, TkGlobal.isClient)
            );  //xgd 17-09-15 17-10-18 增加是否客户端判断
            that.registerEventToLocalStream();
            if( isInitStream ){ //学生和老师才有初始化流的权限  //xgd 17-09-15 //xgd 17-09-30 直播
                let dispatchGetUserMediaResult_Event = true ;
                ServiceRoom.getLocalStream().init(dispatchGetUserMediaResult_Event);
            }else{
                ServiceRoom.getTkRoom().removeOndevicechange();
                that.joinRoom();
                eventObjectDefine.CoreController.dispatchEvent({type:'joinRoomLocalStreamNotInit'});
            }
        };
        if(isInitStream){ //学生和老师才有初始化流的权限  //xgd 17-09-15 //xgd 17-09-30 直播
            ServiceRoom.getTkRoom().getAVMgr().enumerateDevices( function (devicesInfo) {
                _initLocalStreamAndJoinroom(devicesInfo);
            }  , {isSetlocalStorage:true} );
        }else{
            let devicesInfo = {
                hasdevice:{
                    audioinput:false ,
                    videoinput:false ,
                    audioouput:true ,
                }
            };
            _initLocalStreamAndJoinroom(devicesInfo);
        }

    };
    /*注册事件给room，与底层相关 
    * @method  registerEventToRoom*/
    registerEventToRoom(){
        /**@description Room类-RoomEvent的相关事件**/
        for(let eventKey in TkConstant.EVENTTYPE.RoomEvent ){
            ServiceRoom.getTkRoom().addEventListener(TkConstant.EVENTTYPE.RoomEvent[eventKey], function(recvEventData) {
                let isLog = true ;
                if(recvEventData.type === 'stream-rtcStats' || (recvEventData.type === 'room-pubmsg' && recvEventData.message.name === 'sendNetworkState')){
                    isLog = false ;
                }
                if(isLog){
                    L.Logger.debug(TkConstant.EVENTTYPE.RoomEvent[eventKey]+" event:" , recvEventData );
                }
                eventObjectDefine.Room.dispatchEvent(recvEventData , false);
            });
        }
    };

    /*注册事件给localStream，与底层相关
     * @method  registerEventToLocalStream*/
    registerEventToLocalStream(){
        /**@description Stream类-StreanEvent的相关事件**/
        for(let eventKey in TkConstant.EVENTTYPE.StreamEvent ){
            ServiceRoom.getLocalStream().addEventListener(TkConstant.EVENTTYPE.StreamEvent[eventKey], function(recvEventData) {
                let isLog = true ;
                if(recvEventData.type === 'stream-rtcStats' || (recvEventData.type === 'room-pubmsg' && recvEventData.message.name === 'sendNetworkState')){
                    isLog = false ;
                }
                if(isLog){
                    L.Logger.debug(TkConstant.EVENTTYPE.StreamEvent[eventKey]+" event:" , recvEventData );
                }
                eventObjectDefine.Stream.dispatchEvent(recvEventData  , false);
            });
        }
    };

    /*检测房间 
    * method checkroom*/
    checkroom(checkroomServiceUrl, checkroomServicePort, checkroomAterCallback  ){
        if(!TkGlobal.playback){
            checkroomServiceUrl = checkroomServiceUrl || TkConstant.SERVICEINFO.hostname ;
            checkroomServicePort = checkroomServicePort || TkConstant.SERVICEINFO.sdkPort ;
            let href =   TkUtils.decrypt(TkConstant.SERVICEINFO.joinUrl)  || window.location.href;
            let urlAdd = decodeURIComponent(href);
            let urlIndex = urlAdd.indexOf("?");
            let urlSearch = urlAdd.substring(urlIndex + 1);
            let userid = TkUtils.getUrlParams('refresh_thirdid') ;
            ServiceRoom.getTkRoom().checkroom(checkroomServiceUrl, checkroomServicePort,urlSearch.toString(), (ret, userinfo, roominfo) => {
                this._handlerCheckroomOrInitPlaybackInfo(ret, userinfo, roominfo , checkroomAterCallback);
            } , userid);
        }else{
            L.Logger.error('In the playback environment, cannot execute checkroom!');
            return;
        }
    };

    /*初始化回放参数，模拟checkroom
    * @method initPlaybackInfo */
    initPlaybackInfo(initPlaybackInfoServiceUrl, initPlaybackInfoServicePort, initPlaybackInfoAterCallback ){
        if(!TkGlobal.playback){
            L.Logger.error('No playback environment, no execution initPlaybackInfo!');
            return;
        }else{ //回放走的流程
            initPlaybackInfoServiceUrl = initPlaybackInfoServiceUrl || TkConstant.SERVICEINFO.hostname ;
            initPlaybackInfoServicePort = initPlaybackInfoServicePort || TkConstant.SERVICEINFO.sdkPort ;
            let playbackParams = {
                serial:TkUtils.getUrlParams('serial'),
                recordfilepath:"http://"+TkUtils.getUrlParams('path'),
            };
            ServiceRoom.getTkRoom().initPlaybackInfo(initPlaybackInfoServiceUrl, initPlaybackInfoServicePort,playbackParams,  (ret , userinfo, roominfo) => {
                this._handlerCheckroomOrInitPlaybackInfo(ret, userinfo, roominfo , initPlaybackInfoAterCallback);
            } );
        }
    };

    /*进入房间的方法*/
    joinRoom(){
        if(ServiceRoom.getTkRoom().getMySelf().role === TkConstant.role.roleStudent){
            WebAjaxInterface.getGiftInfo(ServiceRoom.getTkRoom().getMySelf().id); //获取教室礼物信息，当前登录者的礼物
        }
        ServiceRoom.getTkRoom().getMySelf().raisehand = false ; //是否举手-默认不举手
        ServiceRoom.getTkRoom().getMySelf().giftnumber = TkGlobal.participantGiftNumberJson[ServiceRoom.getTkRoom().getMySelf().id] || 0 ; //礼物的个数-默认0
        ServiceRoom.getTkRoom().getMySelf().candraw = CoreController.handler.getAppPermissions('canDraw')  || false; //是否可画-老师以及助教默认可画
        ServiceRoom.getTkRoom().getMySelf().disablevideo = false ; //视频设备是否禁用,默认不禁用
        ServiceRoom.getTkRoom().getMySelf().disableaudio = false ; //音频设备是否禁用
        let browserInfo = TkUtils.getBrowserInfo() ;
        /*
        * 设备类型devicetype：AndroidPad，iPad，AndroidPhone，iPhone , WindowClient , WindowPC , Mobile , MacClient , MacPC
         系统版本systemversion：例：android 4.4，ios11
         版本号version：android：2.0.2 ios：2.0.5
         app类型appType：webpageApp , mobileApp*/

        ServiceRoom.getTkRoom().getMySelf().devicetype = this._userLoginDeviceType();
        ServiceRoom.getTkRoom().getMySelf().systemversion = browserInfo.info.browserName + " " +  browserInfo.info.browserVersion;
        ServiceRoom.getTkRoom().getMySelf().version = TkConstant.VERSIONS ;
        ServiceRoom.getTkRoom().getMySelf().appType = 'webpageApp' ;
        ServiceRoom.getTkRoom().getMySelf().volume = 100 ;
        ServiceRoom.getTkRoom().joinroom( ServiceRoom.getLocalStream() );
        //ServiceRoom.getTkRoom().joinroom( ServiceRoom.getLocalStream(),'192.168.1.57' ,'8889');
    };

    /*添加事件监听到Room*/
    addEventListenerToRoomHandler(){
        let that = this ;
        /**@description Room类-RoomEvent的相关事件**/
        for(let eventKey in TkConstant.EVENTTYPE.RoomEvent ){
            eventObjectDefine.Room.addEventListener(TkConstant.EVENTTYPE.RoomEvent[eventKey] , function (recvEventData) {
                if(that['handler'+TkUtils.replaceFirstUper(eventKey) ] && typeof  that['handler'+TkUtils.replaceFirstUper(eventKey) ]  === "function" ){
                    let isReturn =  that[ 'handler'+TkUtils.replaceFirstUper(eventKey) ](recvEventData);
                    if(isReturn){return;}; //是否直接return，不做后面的事件再次分发
                }
                let isLog = true ;
                if(recvEventData.type === 'stream-rtcStats' || (recvEventData.type === 'room-pubmsg' && recvEventData.message.name === 'sendNetworkState')){
                    isLog = false ;
                }
                eventObjectDefine.CoreController.dispatchEvent(recvEventData , isLog);
            });
        }

    };

    handlerRoomUpdateWebAddressInfo(recvEventData){
        let {host} = recvEventData.message ;
        TkConstant.bindServiceinfoToTkConstant(undefined , host  , undefined , false);
        return true ;
    };
    handlerRoomPubmsg(recvEventData){//处理room-pubmsg事件
        const that = this ;
        if(recvEventData.message && typeof recvEventData.message == "string") {
            recvEventData.message = JSON.parse(recvEventData.message);
        }
        if(recvEventData.message.data && typeof recvEventData.message.data == "string") {
            recvEventData.message.data = JSON.parse(recvEventData.message.data);
        }
        let pubmsgData = recvEventData.message ;
        if(TkGlobal.signallingMessageList && TkGlobal.signallingMessageList.length>0 && (pubmsgData.name !== "UpdateTime" && pubmsgData.name !== "LowConsume" &&  pubmsgData.name !== "StreamFailure" ) ){
            TkGlobal.signallingMessageList.push(pubmsgData);
            return true ;
        }else{
            if(!TkGlobal.serviceTime){
                TkGlobal.serviceTime = pubmsgData.ts * 1000;
                TkGlobal.remindServiceTime = pubmsgData.ts * 1000;
            }
            switch(pubmsgData.name) {
                case "ClassBegin": //上课
                    TkGlobal.serviceTime = !TkUtils.isMillisecondClass( pubmsgData.ts ) ? pubmsgData.ts * 1000 :  pubmsgData.ts; //服务器时间
                    TkGlobal.remindServiceTime = !TkUtils.isMillisecondClass( pubmsgData.ts )? pubmsgData.ts * 1000 :  pubmsgData.ts;//remind的服务器时间
                    that._classBeginStartHandler(pubmsgData); //上课之后的处理函数
                    break;
                case "UpdateTime": //更新服务器时间
                    TkGlobal.serviceTime =  pubmsgData.ts * 1000; //服务器时间
                    TkGlobal.remindServiceTime = pubmsgData.ts * 1000;//remind的服务器时间
                    if(!TkGlobal.firstGetServiceTime && !TkGlobal.isHandleMsglistFromRoomPubmsg && TkGlobal.signallingMessageList  ){
                        TkGlobal.firstGetServiceTime = true;
                        eventObjectDefine.Room.dispatchEvent({type:TkConstant.EVENTTYPE.RoomEvent.roomMsglistFromConnected, message:TkGlobal.signallingMessageList , source:'roomPubmsg' });
                        TkGlobal.signallingMessageList = null;
                        delete TkGlobal.signallingMessageList ;
                    }
                    break;
                case "SharpsChange":
                    if(TkGlobal.showRemoteRemindContent && ServiceRoom.getTkRoom().getUser(pubmsgData.fromID) ){
                        pubmsgData.remindContent = ServiceRoom.getTkRoom().getUser(pubmsgData.fromID).nickname ;
                    };
                    HandlerWhiteboardAndCoreInstance.handlerPubmsg_SharpsChange(pubmsgData);
                    break;
                case "StreamFailure":
                    L.Logger.info('StreamFailure signalling:'+JSON.stringify(pubmsgData) );
                    //tkpc2.0.8
                    let userid = pubmsgData.data.studentId ;
                    let failuretype = pubmsgData.data.failuretype ;
                    let user =  ServiceRoom.getTkRoom().getUsers()[userid] ;
                    if(!user){ L.Logger.error('user is not exist , userid is '+userid+'!'); return;}
                    if(user.passivityPublish){
                        user.passivityPublish = false ;
                        switch (failuretype){
                            case TkConstant.streamFailureType.udpNotOnceSuccess:
                                ServiceTooltip.showPrompt(
                                    TkGlobal.language.languageData.alertWin.call.prompt.remoteStreamFailure.udpNotOnceSuccess.one
                                    +user.nickname
                                    + TkGlobal.language.languageData.alertWin.call.prompt.remoteStreamFailure.udpNotOnceSuccess.two
                                );
                                break ;
                            case TkConstant.streamFailureType.udpMidwayDisconnected:
                                ServiceTooltip.showPrompt(
                                    TkGlobal.language.languageData.alertWin.call.prompt.remoteStreamFailure.udpMidwayDisconnected.one
                                    +user.nickname
                                    + TkGlobal.language.languageData.alertWin.call.prompt.remoteStreamFailure.udpMidwayDisconnected.two
                                );
                                break ;
                            case TkConstant.streamFailureType.publishvideoFailure_notOverrun:
                                ServiceTooltip.showPrompt(
                                    TkGlobal.language.languageData.alertWin.call.prompt.remoteStreamFailure.publishvideoFailure_notOverrun.one
                                    +user.nickname
                                    + TkGlobal.language.languageData.alertWin.call.prompt.remoteStreamFailure.publishvideoFailure_notOverrun.two
                                );
                                break ;
                            case TkConstant.streamFailureType.publishvideoFailure_overrun:
                                ServiceTooltip.showPrompt(
                                    TkGlobal.language.languageData.alertWin.call.prompt.remoteStreamFailure.publishvideoFailure_overrun.one
                                );
                                break ;
                            case TkConstant.streamFailureType.mobileHome:
                                ServiceTooltip.showPrompt(
                                    user.nickname
                                    + TkGlobal.language.languageData.alertWin.call.prompt.remoteStreamFailure.mobileHome.two
                                );
                                break ;
                        }
                    }
                    break;
                case "LowConsume":
                    if(pubmsgData.data && pubmsgData.data.maxvideo !== undefined ){
                        ServiceRoom.getTkRoom().updateRoomMaxVideocount( Number(pubmsgData.data.maxvideo) );
                    }
                    break;
                case "RemoteControl":
                    switch (pubmsgData.data.action){
                        case 'refresh':
                            if(pubmsgData.toID === ServiceRoom.getTkRoom().getMySelf().id){
                                eventObjectDefine.CoreController.dispatchEvent({type: 'loadSupernatantPrompt' , message:{show:true , content:TkGlobal.language.languageData.loadSupernatantPrompt.refreshing }  });
                                window.location.reload(true);
                                // window.location.href = TkUtils.decrypt( TkConstant.joinRoomInfo.joinUrl );
                                return true ;
                            }
                            break ;
                        case 'areaSelection':
                            if(pubmsgData.toID === ServiceRoom.getTkRoom().getMySelf().id){
                                if (pubmsgData.data.type === 'getServerListInfo'){
                                    let {host , port} = ServiceRoom.getTkRoom().getWebAddressInfo();
                                    ServiceRoom.getTkRoom().requestServerList(host , port ,function (serverList , code) {
                                        let serverName = ServiceRoom.getTkRoom().getServerName();
                                        var serverListCopy = undefined;
                                        if(serverList && typeof serverList === 'object'){
                                            serverListCopy = {} ;
                                            for(let [key,value] of Object.entries(serverList) ){
                                                serverListCopy[key] = Object.customAssign({} , value);
                                            }
                                        }else{
                                            serverListCopy = serverList;
                                        }
                                        let data = {
                                            action:'areaSelection' ,
                                            type:'sendServerListInfo' ,
                                            serverData:{serverList:serverListCopy , serverName:serverName} ,
                                        };
                                        let fromID = pubmsgData.fromID ;
                                        ServiceSignalling.sendSignallingFromRemoteControl(fromID , data);
                                    });
                                    return true ;
                                }
                            }
                            break ;
                        case 'deviceManagement':
                            if(pubmsgData.toID === ServiceRoom.getTkRoom().getMySelf().id){
                                if (pubmsgData.data.type === 'getDeviceInfo'){
                                    /*枚举设备信息*/
                                    let paramsJson = {isSetlocalStorage: false} ;
                                    TK.AVMgr.enumerateDevices(function (deviceInfo) {
                                        let data = {
                                            action:'deviceManagement' ,
                                            type:'sendDeviceInfo' ,
                                            deviceData:{deviceInfo:deviceInfo} ,
                                        };
                                        let fromID = pubmsgData.fromID ;
                                        ServiceSignalling.sendSignallingFromRemoteControl(fromID , data);
                                    }, paramsJson);
                                    return true ;
                                }else if(pubmsgData.data.type === 'changeDeviceInfo'){
                                    let {selectDeviceInfo} = pubmsgData.data.changeData  ;
                                    let audioouputElementIdArr = document.getElementById("room").querySelectorAll("video , audio") ;
                                    ServiceRoom.getTkRoom().changeLocalDeviceToLocalstream(selectDeviceInfo , function (stream) {
                                        eventObjectDefine.CoreController.dispatchEvent({ type:"remotecontrol_deviceManagement_changeDeviceInfo" , message:{selectDeviceInfo:selectDeviceInfo} }) ;
                                    },audioouputElementIdArr);
                                }
                            }
                            break ;
                    }
                    break;
                case "FullScreen":
                    TkGlobal.isVideoInFullscreen = true;
                    if( TkUtils.tool.isFullScreenStatus() ) {
                        TkUtils.tool.exitFullscreen();
                    }
                    break;
            }
        }
    };
    handlerRoomDelmsg(recvEventData){//处理room-delmsg事件
        const that = this ;
        let delmsgData = recvEventData.message ;
        if(recvEventData.message && typeof recvEventData.message == "string") {
            recvEventData.message = JSON.parse(recvEventData.message);
        }
        if(recvEventData.message.data && typeof recvEventData.message.data == "string") {
            recvEventData.message.data = JSON.parse(recvEventData.message.data);
        }
        if(TkGlobal.signallingMessageList && TkGlobal.signallingMessageList.length>0 ){
            for(let i=TkGlobal.signallingMessageList.length-1 ; i>=0 ; i--){
                if(TkGlobal.signallingMessageList[i].id === delmsgData.id || TkGlobal.signallingMessageList[i].associatedMsgID === delmsgData.id){
                    TkGlobal.signallingMessageList.splice(i,1);
                }
            }
            return true ;
        }else{
            switch(delmsgData.name) {
                case "ClassBegin": //删除上课（也就是下课了）
                    let isDispatchEvent_endClassbeginShowLocalStream = that._classBeginEndHandler(delmsgData); //下课之后的处理函数
                    if(!isDispatchEvent_endClassbeginShowLocalStream){
                        ServiceRoom.getTkRoom().stopStreamTracksFromDefaultStream();
                    }
                    ServiceTooltip.showPrompt(TkGlobal.language.languageData.alertWin.login.register.eventListener.roomDelClassBegin.text , ()=>{
                        if(TkConstant.joinRoomInfo.classBeginEndCloseClient && TkGlobal.isClient && delmsgData.fromID === ServiceRoom.getTkRoom().getMySelf().id &&  ServiceRoom.getTkRoom().shutdownNativeClient ){
                            ServiceRoom.getTkRoom().shutdownNativeClient();
                        }
                        if(isDispatchEvent_endClassbeginShowLocalStream){
                            if(!TkConstant.joinRoomInfo.isClassOverNotLeave){
                                eventObjectDefine.CoreController.dispatchEvent({type:'endClassbeginShowLocalStream'}); //触发下课后显示本地视频
                            }
                        }else{
                            if(TkConstant.joinRoomInfo && TkConstant.joinRoomInfo.jumpurl && TkConstant.hasRole.roleStudent){
                                window.location.href = TkConstant.joinRoomInfo.jumpurl ;
                            }
                        }
                    });
                    break;
                case "SharpsChange": //删除白板数据
                    HandlerWhiteboardAndCoreInstance.handlerDelmsg_SharpsChange(delmsgData);
                    break;
                case "FullScreen":
                    TkGlobal.isVideoInFullscreen = false;
                    break;
            }
        }
    };
    handlerRoomConnected(roomConnectedEventData){  //处理room-connected事件
        //获取角色默认权限
        const that = this ;
        if(TkGlobal.isClient || TkGlobal.isBroadcast || TkGlobal.playback ){
            if(ServiceRoom.getTkRoom().removeOndevicechange){
                ServiceRoom.getTkRoom().removeOndevicechange();
            }
        }
        TkGlobal.showRemoteRemindContent = !TkGlobal.playback ;
        TkGlobal.firstGetServiceTime = false;
        TkGlobal.isHandleMsglistFromRoomPubmsg = false;
        TkGlobal.appConnected = true ; //房间连接成功

        if(TkGlobal.isGetNetworkStatus){
            // if (TkConstant.hasRole.roleTeachingAssistant) {
                // ServiceRoom.getTkRoom().startIntervalRtcStatsrObserver(); //获取所有人的网络状态，定时
            // }else {
            if(ServiceRoom.getTkRoom().startIntervalRtcStatsrObserverByStream){
               ServiceRoom.getTkRoom().startIntervalRtcStatsrObserverByStream( ServiceRoom.getLocalStream() ); //获取自己的网络状态，定时
            }
            // }
        }
        if(ServiceRoom.getTkRoom().getMySelf().role === TkConstant.role.roleStudent){
            if(that.reconnectedNeedGetGiftInfo){
                WebAjaxInterface.getGiftInfo(ServiceRoom.getTkRoom().getMySelf().id); //获取教室礼物信息，当前登录者的礼物
                ServiceSignalling.setParticipantPropertyToAll(ServiceRoom.getTkRoom().getMySelf().id , {giftnumber:TkGlobal.participantGiftNumberJson[ServiceRoom.getTkRoom().getMySelf().id] || 0});
                that.reconnectedNeedGetGiftInfo = false ; //重连需要获取礼物
            }
        }
        let roleHasDefalutAppPermissionsJson =  RoleHandler.getRoleHasDefalutAppPermissions();
        TkAppPermissions.initAppPermissions(roleHasDefalutAppPermissionsJson);
        let signallingMessageList =  roomConnectedEventData.message ; //信令list数据
        TkGlobal.signallingMessageList = signallingMessageList ;
        let users = ServiceRoom.getTkRoom().getUsers() ;
        for(let key in users){
            let user = users[key];
            RoleHandler.checkRoleConflict(user , true) ;
        }
        eventObjectDefine.Room.dispatchEvent({type:TkConstant.EVENTTYPE.RoomEvent.roomMsglistFromConnected, message:TkGlobal.signallingMessageList , source:'roomConnected' });
        if(TkConstant.joinRoomInfo.isBeforeClassReleaseVideo && !TkGlobal.classBegin){  // 未上课发布音视频
            that._BeforeClassAutoPublishAV();
        }
        if(TkGlobal.serviceTime &&  !TkGlobal.firstGetServiceTime && !TkGlobal.isHandleMsglistFromRoomPubmsg && TkGlobal.signallingMessageList  ){
            TkGlobal.firstGetServiceTime = true ;
            eventObjectDefine.Room.dispatchEvent({type:TkConstant.EVENTTYPE.RoomEvent.roomMsglistFromConnected, message:TkGlobal.signallingMessageList , source:'roomPubmsg' });
            TkGlobal.signallingMessageList = null;
            delete TkGlobal.signallingMessageList ;
        }
        if( !TkGlobal.classBegin && ServiceRoom.getTkRoom().getMySelf().candraw !== CoreController.handler.getAppPermissions('canDraw') ){
            ServiceSignalling.setParticipantPropertyToAll( ServiceRoom.getTkRoom().getMySelf().id , {candraw:CoreController.handler.getAppPermissions('canDraw') } );
        };
        if(!TkGlobal.firstGetServiceTime){ //没有获取第一次服务器时间
            ServiceSignalling.sendSignallingFromUpdateTime( ServiceRoom.getTkRoom().getMySelf().id );
        }
        CoreController.handler.refreshSystemStyleJson();
        eventObjectDefine.CoreController.dispatchEvent({type: 'loadSupernatantPrompt' , message:{show:false , content:undefined}  });
        let defalutFontSize = TkGlobal.windowInnerWidth / TkConstant.STANDARDSIZE ;  //5rem = defalutFontSize*'5px' ;
        eventObjectDefine.Window.dispatchEvent({ type:TkConstant.EVENTTYPE.WindowEvent.onResize , message:{defalutFontSize:defalutFontSize} });
    };
    handlerStreamRemoved(streamEventData){
        return this._againDispatchStreamEvent(streamEventData);
    };
    handlerStreamRtcStats(streamEventData){
        return this._againDispatchStreamEvent(streamEventData);
    };
    handlerStreamRtcStatsFailed(streamEventData){
        return this._againDispatchStreamEvent(streamEventData);
    };
    handlerStreamAdded(streamEventData){
        return  this._againDispatchStreamEvent(streamEventData);
    };
    handlerStreamSubscribed(streamEventData){
        return  this._againDispatchStreamEvent(streamEventData);
    };
 /*   handlerStreamFailed(streamEventData){
        if(streamEventData.stream.extensionId === ServiceRoom.getTkRoom().getMySelf().id){
            switch (streamEventData.stream.getAttributes().type){
                case 'video':
                    let userid = streamEventData.stream.extensionId;
                    ServiceSignalling.sendSignallingFromStreamFailure(userid);
                    break;
            };
        }
        return this._againDispatchStreamEvent(streamEventData);
    };*/
    handlerStreamData(streamEventData){
        return this._againDispatchStreamEvent(streamEventData);
    };
    handlerStreamAttributesUpdate(streamEventData){
        return this._againDispatchStreamEvent(streamEventData);
    };
    handlerStreamPublishFail(streamEventData){
        if(streamEventData.stream.extensionId === ServiceRoom.getTkRoom().getMySelf().id) {
            switch (streamEventData.stream.getAttributes().type) {
                case 'video':
                    let userid = streamEventData.stream.extensionId;
                    //tkpc2.0.8
                    L.Logger.warning('my stream is not publish success , publish failure info is '+JSON.stringify(streamEventData.message)+' , my user id is '+ServiceRoom.getTkRoom().getMySelf().id+' , stream id:'+streamEventData.stream.getID()+ ' , extensionId is '+ streamEventData.stream.extensionId +', attrs is '+ JSON.stringify(streamEventData.stream.getAttributes()) );
                    let {errorCode} = streamEventData.message ;
                    let streamFailureJson = {
                        failuretype:Number(errorCode) === 2 ? TkConstant.streamFailureType.publishvideoFailure_overrun : TkConstant.streamFailureType.publishvideoFailure_notOverrun ,
                    };
                    ServiceSignalling.sendSignallingFromStreamFailure(userid , streamFailureJson);
                    break;
            };
        }
        return this._againDispatchStreamEvent(streamEventData);
    };
    handlerStreamReconnectionFailed(streamEventData){
        if(streamEventData.stream.extensionId === ServiceRoom.getTkRoom().getMySelf().id) {
            switch (streamEventData.stream.getAttributes().type) {
                case 'video':
                    let userid = streamEventData.stream.extensionId;
                    //tkpc2.0.8
                    let {code , isCompleted} = streamEventData.message;
                    let streamFailureJson = {};
                    if (code === L.Constant.streamReconnection.notOnceSuccess) {
                        streamFailureJson.failuretype = TkConstant.streamFailureType.udpNotOnceSuccess ;
                        ServiceTooltip.showPrompt(TkGlobal.language.languageData.alertWin.call.prompt.streamConnectFailed.notSuccess.text);
                    }else if (code === L.Constant.streamReconnection.midwayReconnectionNotSuccess) {
                        streamFailureJson.failuretype = TkConstant.streamFailureType.udpMidwayDisconnected ;
                        ServiceTooltip.showPrompt(TkGlobal.language.languageData.alertWin.call.prompt.streamConnectFailed.onceSuccessed.text);
                    }
                    ServiceSignalling.sendSignallingFromStreamFailure(userid , streamFailureJson);
                    break;
            };
        }
        return this._againDispatchStreamEvent(streamEventData);
    };
    handlerStreamUnpublishFail(streamEventData){
        return this._againDispatchStreamEvent(streamEventData);
    };
    handlerRoomDisconnected(roomDisconnectedEventData){
        TkGlobal.appConnected = false;
        TkGlobal.classBegin = false;
        TkGlobal.serviceTime = undefined ;
        TkGlobal.remindServiceTime = undefined;
        TkGlobal.signallingMessageList = null;
        delete TkGlobal.signallingMessageList ;
        TkGlobal.isHandleMsglistFromRoomPubmsg = false ;
        TkGlobal.participantGiftNumberJson = {} ;
        //TkAppPermissions.resetDefaultAppPermissions(true); //恢复默认权限
    };
    handlerRoomParticipantJoin(roomParticipantJoinEventData){//处理room-participant_join 事件

    };
    handlerRoomUserpropertyChanged(roomUserpropertyChangedEventData){
        const changePropertyJson  = roomUserpropertyChangedEventData.message ;
        const user  = roomUserpropertyChangedEventData.user ;
        for( let [key , value] of Object.entries(changePropertyJson) ){
            if(user.id === ServiceRoom.getTkRoom().getMySelf().id){
                if( key === 'candraw' ){
                    TkAppPermissions.setAppPermissions('sendSignallingFromShowPage' , value);//发送ShowPage相关的信令权限
                    TkAppPermissions.setAppPermissions('sendSignallingFromH5ShowPage' , value);//发送H5文档的ShowPage相关数据权限
                    TkAppPermissions.setAppPermissions('sendSignallingFromDynamicPptShowPage' , value);//发送动态PPT的ShowPage相关数据权限
                    TkAppPermissions.setAppPermissions('sendSignallingFromGeneralShowPage' , value);//发送普通文档的ShowPage相关数据权限
                    TkAppPermissions.setAppPermissions('sendSignallingFromDynamicPptTriggerActionClick' , value);//发送动态PPT触发器NewPptTriggerActionClick相关的信令权限
                    TkAppPermissions.setAppPermissions('sendSignallingFromH5DocumentAction' , value);//发送h5文档相关动作的信令权限
                    TkAppPermissions.setAppPermissions('sendWhiteboardMarkTool' , value);//发送标注工具信令权限
                    TkAppPermissions.setAppPermissions('h5DocumentActionClick' , value);//h5课件点击动作的权限
                    TkAppPermissions.setAppPermissions('dynamicPptActionClick' , value);//动态PPT点击动作的权限
                    TkAppPermissions.setAppPermissions('publishDynamicPptMediaPermission_video' , value);//发布动态PPT视频的权限
                    TkAppPermissions.setAppPermissions('unpublishMediaStream' , value);//取消发布媒体文件流的权限
                    TkAppPermissions.setAppPermissions('publishMediaStream' , value);//发布媒体文件流的权限
                    TkAppPermissions.setAppPermissions('canDraw' , value);//画笔权限
                    TkAppPermissions.setAppPermissions('isCanDragVideo' , value);//能否拖拽视频框的权限
                    TkAppPermissions.setAppPermissions('isChangeVideoSize' , value);//能否拉伸视频框的权限
                    TkAppPermissions.setAppPermissions('isCapture' ,  TkGlobal.clientversion && TkGlobal.clientversion>=2018010200 && TkGlobal.isClient && value );//能否截屏的权限

                    if(TkConstant.hasRole.roleStudent){
                        TkAppPermissions.setAppPermissions('whiteboardPagingPage' , value ? value : TkConstant.joinRoomInfo.isSupportPageTrun);//白板翻页权限
                        TkAppPermissions.setAppPermissions('newpptPagingPage' , value ? value : TkConstant.joinRoomInfo.isSupportPageTrun);//动态ppt翻页权限
                        TkAppPermissions.setAppPermissions('h5DocumentPagingPage' , value ? value : TkConstant.joinRoomInfo.isSupportPageTrun);//h5课件翻页权限
                        TkAppPermissions.setAppPermissions('jumpPage' , value ? value : TkConstant.joinRoomInfo.isSupportPageTrun);//h5课件翻页权限
                    }
                }
                if(key === 'publishstate' || key === 'raisehand' ){
                    if( (user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY ||  user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH) && user.raisehand && TkConstant.hasRole.roleStudent && !TkConstant.joinRoomInfo.isHandsUpOnStage){
                         // ServiceSignalling.setParticipantPropertyToAll(ServiceRoom.getTkRoom().getMySelf().id , {raisehand:false}); //如果音频或者音视频都有但是又举手了，则取消举手
                    }
                }
                // if(key === 'volume'){
                //     Log.error('value',value);
                //     //调用客户端方法设置音量
                //     // ServiceRoom.getTkRoom().getAVMgr().stopDetectMic();
                //     ServiceRoom.getTkRoom().getAVMgr().setSpeakerVolume(value);
                // }
            }
            if(  key === 'giftnumber'){
                TkGlobal.participantGiftNumberJson[user.id] = 0 ;
            }
        }
    };
    handlerRoomFiles(roomFilesEventData){
        let filesArray = roomFilesEventData.message;
        let defaultFileInfo = undefined ;
        let jsonDefaultFileInfo = {};
        for(let fileInfo of filesArray){
            // if(fileInfo.fileid%2===0){ //todo测试数据   start
            //     fileInfo.filecategory=1
            // }else{
            //     fileInfo.filecategory=0
            // }//todo测试数据   end
            if(Number(fileInfo.type) === 1 &&   !(TkUtils.getFiletyeByFilesuffix(fileInfo.filetype) === 'mp4' ||   TkUtils.getFiletyeByFilesuffix(fileInfo.filetype) === 'mp3' )  ){
                defaultFileInfo = fileInfo ;
                break;
            }else if( !(TkUtils.getFiletyeByFilesuffix(fileInfo.filetype) === 'mp4' ||   TkUtils.getFiletyeByFilesuffix(fileInfo.filetype) === 'mp3' )  && !defaultFileInfo){
                if(!defaultFileInfo){
                    defaultFileInfo = fileInfo ;
                }
                /*if(jsonDefaultFileInfo['filecategory_'+fileInfo.filecategory] === undefined){//filecategory-->0：课堂  1：系统
                    jsonDefaultFileInfo['filecategory_'+fileInfo.filecategory]= fileInfo ; //取最早上传的文件显示
                }*/
            }
        }
        /*if(!defaultFileInfo){
            if(jsonDefaultFileInfo['filecategory_'+0] !== undefined){ //有课堂文件夹则以课堂文件夹作为默认文件
                defaultFileInfo = jsonDefaultFileInfo['filecategory_'+0] ;
            }else if(jsonDefaultFileInfo['filecategory_'+1] !== undefined){//没有课堂文件夹但有系统则以系统文件夹作为默认文件
                defaultFileInfo = jsonDefaultFileInfo['filecategory_'+1] ;
            }
        }*/
        TkGlobal.defaultFileInfo = defaultFileInfo || TkGlobal.defaultFileInfo;
    };
    handlerRoomMsglistFromConnected(roomMsglistFromConnectedEventData){//处理room-msglist事件
        const that = this ;
        const _handlerRoomMsglistFromConnected = (messageListData , source , ignoreSignallingJson) => { //room-msglist处理函数
            let tmpSignallingData =  {};
            for(let x in messageListData) {
                if(ignoreSignallingJson && ignoreSignallingJson[messageListData[x].name]){ //如果有忽略的信令，则跳出本次循环
                    continue;
                }
                if(messageListData[x].data && typeof messageListData[x].data == "string") {
                    messageListData[x].data = JSON.parse(messageListData[x].data);
                }
                if (/outIframe/.test(messageListData[x].name)) {
                    eventObjectDefine.CoreController.dispatchEvent({type:'outIframe-msglist' , message:{signallingData:messageListData[x]}}) ;
                }else if(tmpSignallingData[messageListData[x].name] == null || tmpSignallingData[messageListData[x].name] == undefined) {
                    tmpSignallingData[messageListData[x].name] = [];
                    tmpSignallingData[messageListData[x].name].push(messageListData[x]);
                } else {
                    tmpSignallingData[messageListData[x].name].push(messageListData[x]);
                }
            };

            if(source === 'roomConnected'){
                /*上课数据*/
                let classBeginArr = tmpSignallingData["ClassBegin"];
                if(classBeginArr != null && classBeginArr != undefined && classBeginArr.length > 0) {
                    if(classBeginArr[classBeginArr.length - 1].name == "ClassBegin") {
                        that._classBeginStartHandler(classBeginArr[classBeginArr.length - 1]);
                        eventObjectDefine.CoreController.dispatchEvent({
                            type:'receive-msglist-ClassBegin' ,
                            source:'room-msglist' ,
                            message:classBeginArr[classBeginArr.length - 1]
                        });
                    }
                }else{
                    eventObjectDefine.CoreController.dispatchEvent({
                        type:'receive-msglist-not-ClassBegin' ,
                        source:'room-msglist' ,
                        message:{}
                    });
                    if(TkConstant.joinRoomInfo.autoClassBegin && TkConstant.hasRole.roleChairman && TkAppPermissions.getAppPermissions('autoClassBegin') ){
                        if(!TkGlobal.classBegin){
                            if(TkConstant.joinRoomInfo.hiddenClassBegin){ //隐藏上下课按钮
                                if( !TkAppPermissions.getAppPermissions('hiddenClassBeginAutoClassBegin') ){ return ; } ;
                                WebAjaxInterface.roomStart(); //发送上课信令
                            }else{
                                if( !TkAppPermissions.getAppPermissions('startClassBegin') ){ return ; } ;
                                WebAjaxInterface.roomStart(); //发送上课信令
                            }
                        }
                    }
                }
                tmpSignallingData["ClassBegin"] = null;
            }else if(source === 'roomPubmsg'){

                /*性能指标信令（适应IOS配置）*/
                let lowconsumeArr = tmpSignallingData["LowConsume"];
                if(lowconsumeArr !== null && lowconsumeArr !== undefined && lowconsumeArr.length > 0) {
                    if(TkConstant.hasRole.roleChairman){
                        ServiceSignalling.sendSignallingFromLowConsume( ServiceRoom.getTkRoom().getRoomMaxVideocount() );
                    }else{
                        if(lowconsumeArr[lowconsumeArr.length-1].data && lowconsumeArr[lowconsumeArr.length-1].data.maxvideo !== undefined  ){
                            ServiceRoom.getTkRoom().updateRoomMaxVideocount( Number(lowconsumeArr[lowconsumeArr.length-1].data.maxvideo) );
                        }
                    }
                }else{
                    if(TkConstant.hasRole.roleChairman){
                        ServiceSignalling.sendSignallingFromLowConsume( ServiceRoom.getTkRoom().getRoomMaxVideocount() );
                    }
                }
                tmpSignallingData["LowConsume"] = null;

                /*视频拖拽的动作*/
                let videoDragArr = tmpSignallingData["videoDraghandle"];
                if(videoDragArr !== null && videoDragArr !== undefined && videoDragArr.length > 0) {
                    if (videoDragArr[videoDragArr.length - 1].data.otherVideoStyle) {
                        let user = ServiceRoom.getTkRoom().getMySelf();
                        //刚进入房间时将自己的视频框位置初始化
                        if (!TkConstant.hasRole.roleChairman && !TkConstant.hasRole.roleTeachingAssistant) {
                            if (videoDragArr[videoDragArr.length - 1].data.otherVideoStyle[user.id]) {
                                videoDragArr[videoDragArr.length - 1].data.otherVideoStyle[user.id] = {
                                    percentTop:0,
                                    percentLeft:0,
                                    isDrag:false,
                                };
                                let data = {otherVideoStyle:videoDragArr[videoDragArr.length - 1].data.otherVideoStyle};
                                ServiceSignalling.sendSignallingFromVideoDraghandle(data);
                            }
                        }
                        eventObjectDefine.CoreController.dispatchEvent({
                            type: 'handleVideoDragListData',
                            message: {data: {otherVideoStyle:videoDragArr[videoDragArr.length - 1].data.otherVideoStyle,}},
                        });
                    }
                }
                tmpSignallingData["videoDraghandle"] = null;
                
                /*分屏数据*/
                let VideoSplitScreenArr = tmpSignallingData["VideoSplitScreen"];
                if(VideoSplitScreenArr !== null && VideoSplitScreenArr !== undefined && VideoSplitScreenArr.length > 0) {
                    eventObjectDefine.CoreController.dispatchEvent({
                        type: 'receive-msglist-VideoSplitScreen',
                        message: VideoSplitScreenArr[VideoSplitScreenArr.length - 1],
                    });
                }
                tmpSignallingData["VideoSplitScreen"] = null;

                /*视频拉伸的动作*/
                let VideoChangeSizeArr = tmpSignallingData["VideoChangeSize"];
                if (VideoChangeSizeArr !== null && VideoChangeSizeArr !== undefined && VideoChangeSizeArr.length > 0) {
                    if (VideoChangeSizeArr[0].data.ScaleVideoData) {
                        let user = ServiceRoom.getTkRoom().getMySelf();
                        //刚进入房间时将自己的视频大小初始化
                        if (!TkConstant.hasRole.roleChairman && !TkConstant.hasRole.roleTeachingAssistant) {
                            if (VideoChangeSizeArr[0].data.ScaleVideoData[user.id]) {
                                VideoChangeSizeArr[0].data.ScaleVideoData[user.id] = {
                                    scale:1,
                                };
                                let data = {ScaleVideoData:VideoChangeSizeArr[0].data.ScaleVideoData};
                                ServiceSignalling.sendSignallingFromVideoChangeSize(data);
                            }
                        }
                        eventObjectDefine.CoreController.dispatchEvent({
                            type: 'handleVideoSizeListData',
                            message: {data: {ScaleVideoData:VideoChangeSizeArr[0].data.ScaleVideoData,}},
                        });
                    }
                }
                tmpSignallingData["VideoChangeSize"] = null;

                /*小黑板拖拽的动作*/
                let BlackBoardDragArr = tmpSignallingData["BlackBoardDrag"];
                if (BlackBoardDragArr !== null && BlackBoardDragArr !== undefined && BlackBoardDragArr.length > 0) {
                    eventObjectDefine.CoreController.dispatchEvent({
                        type: 'receive-msglist-BlackBoardDrag',
                        message: {BlackBoardDragArray: BlackBoardDragArr}
                    });
                }
                tmpSignallingData["BlackBoardDrag"] = null;


                /*转盘拖拽的动作*/
                let DialDragArr = tmpSignallingData["DialDrag"];
                if (DialDragArr !== null && DialDragArr !== undefined && DialDragArr.length > 0) {
                    eventObjectDefine.CoreController.dispatchEvent({
                        type: 'receive-msglist-DialDrag',
                        message: {DialDragArray: DialDragArr}
                    });
                }
                tmpSignallingData["DialDrag"] = null;

                /*计时器拖拽的动作*//*--tkpc2.0.8--start*/
                let TimerDragArr = tmpSignallingData["TimerDrag"];
                if (TimerDragArr !== null && TimerDragArr !== undefined && TimerDragArr.length > 0) {
                    eventObjectDefine.CoreController.dispatchEvent({
                        type: 'receive-msglist-TimerDrag',
                        message: {TimerDragArray: TimerDragArr}
                    });
                }
                tmpSignallingData["TimerDrag"] = null;

                /*答题卡拖拽的动作*/
                let AnswerDragArr = tmpSignallingData["AnswerDrag"];
                if (AnswerDragArr !== null && AnswerDragArr !== undefined && AnswerDragArr.length > 0) {
                    eventObjectDefine.CoreController.dispatchEvent({
                        type: 'receive-msglist-AnswerDrag',
                        message: {AnswerDragArray: AnswerDragArr}
                    });
                }
                tmpSignallingData["AnswerDrag"] = null;
				/*--tkpc2.0.8--end*/
                /*抢答器拖拽的动作*/
                let ResponderDragArr = tmpSignallingData["ResponderDrag"];
                if (ResponderDragArr !== null && ResponderDragArr !== undefined && ResponderDragArr.length > 0) {
                    eventObjectDefine.CoreController.dispatchEvent({
                        type: 'receive-msglist-ResponderDrag',
                        message: {ResponderDragArray: ResponderDragArr}
                    });
                }
                tmpSignallingData["ResponderDrag"] = null;
                /*课件全屏之后video在右下角*/
                let FullScreenArr = tmpSignallingData["FullScreen"];
                if (FullScreenArr !== null && FullScreenArr !== undefined && FullScreenArr.length > 0) {
                    TkGlobal.isVideoInFullscreen = true;
                    eventObjectDefine.CoreController.dispatchEvent({
                        type: 'receive-msglist-FullScreen',
                        message: {FullScreenArray: FullScreenArr}
                    });
                }

                tmpSignallingData["FullScreen"] = null;
                /*标注工具*/
                let whiteboardMarkToolArr = tmpSignallingData["whiteboardMarkTool"];
                if(whiteboardMarkToolArr != null && whiteboardMarkToolArr != undefined && whiteboardMarkToolArr.length > 0) {
                    if(whiteboardMarkToolArr[whiteboardMarkToolArr.length - 1].name == "whiteboardMarkTool") {
                        eventObjectDefine.CoreController.dispatchEvent({
                            type:'receive-msglist-whiteboardMarkTool' ,
                            source:'room-msglist' ,
                            message:whiteboardMarkToolArr[whiteboardMarkToolArr.length - 1]
                        });
                    }
                }
                tmpSignallingData["whiteboardMarkTool"] = null;

                /*画笔数据*/
                let sharpsChangeArr = tmpSignallingData["SharpsChange"];
                if(sharpsChangeArr != null && sharpsChangeArr != undefined && sharpsChangeArr.length > 0) {
                    // eventObjectDefine.CoreController.dispatchEvent({type:'save-lc-waiting-process-data' , message:{ sharpsChangeArray:sharpsChangeArr } });
                    HandlerWhiteboardAndCoreInstance.handlerMsglist_SharpsChange(sharpsChangeArr);
                }
                tmpSignallingData["SharpsChange"] = null;


                /*视频标注*/
                let VideoWhiteboardArr = tmpSignallingData["VideoWhiteboard"];
                if (VideoWhiteboardArr !== null && VideoWhiteboardArr !== undefined && VideoWhiteboardArr.length > 0) {
                    eventObjectDefine.CoreController.dispatchEvent({
                        type: 'receive-msglist-VideoWhiteboard',
                        message: {VideoWhiteboardArray: VideoWhiteboardArr}
                    });
                }
                tmpSignallingData["VideoWhiteboard"] = null;


                /*加页数据*/
                let wBPageCountArr = tmpSignallingData["WBPageCount"];
                if(wBPageCountArr != null && wBPageCountArr != undefined && wBPageCountArr.length > 0) {
                    if(wBPageCountArr[wBPageCountArr.length - 1].name == "WBPageCount") {
                        eventObjectDefine.CoreController.dispatchEvent({
                            type:'receive-msglist-WBPageCount' ,
                            source:'room-msglist' ,
                            message:wBPageCountArr[wBPageCountArr.length - 1]
                        });
                    }
                }
                tmpSignallingData["WBPageCount"] = null;

                /*倒计时数据*/
                let timerShowArr = tmpSignallingData["timer"];
                if(timerShowArr != null && timerShowArr != undefined && timerShowArr.length > 0) {
                    if(timerShowArr[timerShowArr.length - 1].name == "timer") {
                        eventObjectDefine.CoreController.dispatchEvent({
                            type:'receive-msglist-timer' ,
                            source:'room-msglist' ,
                            message:{ timerShowArr:timerShowArr }
                        });
                    }
                }
                tmpSignallingData["timer"] = null;
                /*转盘数据*/
                let dialShowArr = tmpSignallingData["dial"];
                if(dialShowArr != null && dialShowArr != undefined && dialShowArr.length > 0) {
                    if(dialShowArr[dialShowArr.length - 1].name == "dial") {
                        eventObjectDefine.CoreController.dispatchEvent({
                            type:'receive-msglist-dial' ,
                            source:'room-msglist' ,
                            message:{ dialShowArr:dialShowArr }
                        });
                    }
                }
                tmpSignallingData["dial"] = null;
                /*答题卡数据*/
                let answerShowArr = tmpSignallingData["answer"];
                if(answerShowArr != null && answerShowArr != undefined && answerShowArr.length > 0) {
                    if(answerShowArr[answerShowArr.length - 1].name == "answer") {
                        eventObjectDefine.CoreController.dispatchEvent({
                            type:'receive-msglist-answer' ,
                            source:'room-msglist' ,
                            message:{ answerShowArr:answerShowArr }
                        });
                    }
                }
                tmpSignallingData["answer"] = null;
                /*答案数据*/
                let submitAnswersArr = tmpSignallingData["submitAnswers"];
                if(submitAnswersArr != null && submitAnswersArr != undefined && submitAnswersArr.length > 0) {
                    if(submitAnswersArr[submitAnswersArr.length - 1].name == "submitAnswers") {
                        eventObjectDefine.CoreController.dispatchEvent({
                            type:'receive-msglist-submitAnswers' ,
                            source:'room-msglist' ,
                            message:{ submitAnswersArr:submitAnswersArr }
                        });
                    }
                }
                tmpSignallingData["submitAnswers"] = null;
				/*抢答器数据*/
                let qiangDaQiArr = tmpSignallingData["qiangDaQi"];
                if(qiangDaQiArr != null && qiangDaQiArr != undefined && qiangDaQiArr.length > 0) {
                    if(qiangDaQiArr[qiangDaQiArr.length - 1].name == "qiangDaQi") {
                        eventObjectDefine.CoreController.dispatchEvent({
                            type:'receive-msglist-qiangDaQi' ,
                            source:'room-msglist' ,
                            message:{ qiangDaQiArr:qiangDaQiArr }
                        });
                    }
                };
                tmpSignallingData["qiangDaQi"] = null;
				/*抢答者数据*/
                let QiangDaZheArr = tmpSignallingData["QiangDaZhe"];
                if(QiangDaZheArr != null && QiangDaZheArr != undefined && QiangDaZheArr.length > 0) {
                    if(QiangDaZheArr[QiangDaZheArr.length - 1].name == "QiangDaZhe") {
                        eventObjectDefine.CoreController.dispatchEvent({
                            type:'receive-msglist-QiangDaZhe' ,
                            source:'room-msglist' ,
                            message:{ QiangDaZheArr:QiangDaZheArr }
                        });
                    }
                };
                tmpSignallingData["QiangDaZhe"] = null;

                /*小白板数据*/
                let blackBoardArr = tmpSignallingData["BlackBoard"];
                if(blackBoardArr != null && blackBoardArr != undefined && blackBoardArr.length > 0) {
                    if(blackBoardArr[blackBoardArr.length - 1].name == "BlackBoard") {
                        eventObjectDefine.CoreController.dispatchEvent({
                            type:'receive-msglist-BlackBoard' ,
                            source:'room-msglist' ,
                            message:blackBoardArr[blackBoardArr.length - 1]
                        });
                    }
                }
                tmpSignallingData["BlackBoard"] = null;

				/*ppt音量数据*/
                let PptVolumeControlArr = tmpSignallingData["PptVolumeControl"];
                if(PptVolumeControlArr != null && PptVolumeControlArr != undefined && PptVolumeControlArr.length > 0) {
                    if(PptVolumeControlArr[PptVolumeControlArr.length - 1].name == "PptVolumeControl") {
                        eventObjectDefine.CoreController.dispatchEvent({
                            type:'receive-msglist-PptVolumeControl' ,
                            source:'room-msglist' ,
                            message:{ PptVolumeControlArr:PptVolumeControlArr }
                        });
                    }
                };
                tmpSignallingData["PptVolumeControl"] = null;
                
                //最后打开的文档文件和媒体文件
                let lastDoucmentFileData = null ;
                let showPageArr = tmpSignallingData["ShowPage"];
                if(showPageArr != null && showPageArr != undefined && showPageArr.length > 0) {
                    for(let i = 0; i < showPageArr.length; i++) {
                        if(!showPageArr[i].data.isMedia) {
                            lastDoucmentFileData = showPageArr[i];
                        }
                    }
                };
                tmpSignallingData["ShowPage"] = null;

                //打开文件列表中的一个
                if(lastDoucmentFileData != undefined && lastDoucmentFileData != null) {
                    L.Logger.debug('receive-msglist-ShowPage-lastDocument info:' , lastDoucmentFileData );
                    eventObjectDefine.CoreController.dispatchEvent({type:'receive-msglist-ShowPage-lastDocument' , message:{data:lastDoucmentFileData.data  , source:'room-msglist' } });
                } else {
                    L.Logger.debug('openDefaultDoucmentFile info:' , TkGlobal.defaultFileInfo );
                    let fileid = TkGlobal.defaultFileInfo.fileid ;
                    eventObjectDefine.CoreController.dispatchEvent({type:'openDefaultDoucmentFile' , message:{fileid:fileid} }); //打开缺省文档
                }

                TkGlobal.isHandleMsglistFromRoomPubmsg = true;
            }
        };

        let messageListData = roomMsglistFromConnectedEventData.message ;
        let source = roomMsglistFromConnectedEventData.source ;
        let ignoreSignallingJson = {} ;
        _handlerRoomMsglistFromConnected(messageListData , source , ignoreSignallingJson);
        return true ;
    } ;
    handlerRoomParticipantEvicted(roomParticipantEvictedEventData){
        TkAppPermissions.resetDefaultAppPermissions(true);
        ServiceTooltip.showPrompt(TkGlobal.language.languageData.alertWin.login.register.eventListener.participantEvicted.roleConflict.text);
    };
    handlerRoomTextMessage(roomTextMessageEventData){
        if( roomTextMessageEventData && roomTextMessageEventData.message && typeof roomTextMessageEventData.message === 'string' ){
            roomTextMessageEventData.message = JSON.parse(roomTextMessageEventData.message);
        }
    };
    handlerRroomLeaveroom(rroomLeaveroomEventData){

    };
    handlerRoomParticipantLeave(roomParticipantLeaveEventData){
        //todo 老师和学生进入课堂上课开始上课，然后老师退出课堂，如果5分钟之后老师还没有进来，这个课堂就结束；提示和老师点击下课的提示一样
    };
    handlerRoomReconnected(roomReconnectedEventData){
        const that = this ;
        if(ServiceRoom.getTkRoom().getMySelf().role === TkConstant.role.roleStudent){
            that.reconnectedNeedGetGiftInfo = true ; //重连需要获取礼物
        }
    };
    handlerDeviceChange(deviceChangeEventData){
        if(ServiceRoom.getTkRoom() && ServiceRoom.getTkRoom().getMySelf() && ServiceRoom.getTkRoom().getMySelf().id && ServiceRoom.getTkRoom().getUser(ServiceRoom.getTkRoom().getMySelf().id) ){
            let paramsJson = {isSetlocalStorage: false} ;
            TK.AVMgr.enumerateDevices(function (deviceInfo) {
                let data = {
                    action:'deviceManagement' ,
                    type:'sendDeviceInfo' ,
                    deviceData:{deviceInfo:deviceInfo} ,
                };
                for(let user of Object.values( ServiceRoom.getTkRoom().getSpecifyRoleList(TkConstant.role.roleTeachingAssistant) ) ){
                    ServiceSignalling.sendSignallingFromRemoteControl( user.id , data);
                }
            }, paramsJson);
        }
    };
    handlerStreamUnpublishNotBelongRemoteStreams(streamUnpublishNotBelongRemoteStreamsEventData){
        let stream = streamUnpublishNotBelongRemoteStreamsEventData.stream ;
        if(stream.extensionId  === ServiceRoom.getTkRoom().getMySelf().id){
            let userid = stream.extensionId;
            let streamFailureJson = {
                failuretype:TkConstant.streamFailureType.unpublishStreamNotBelongremoteStreams ,
            };
            ServiceSignalling.sendSignallingFromStreamFailure(userid , streamFailureJson);
        }
        return true ;
    };

    /*自动发布音视频*/
    _autoPublishAV(){
          if( (TkConstant.joinRoomInfo.autoStartAV || TkConstant.hasRole.roleChairman ) &&  TkAppPermissions.getAppPermissions('autoPublishAV')  ) {
              let localUser = ServiceRoom.getTkRoom().getMySelf() ;
             /* if(TkConstant.joinRoomInfo.isBeforeClassReleaseVideo){ //todo(服务器那边录制件会把当前发布的视频录制上，所以不需要添加这部分代码)  如果上课前发布音视频的，取消发布自己的流
                  ServiceRoom.getTkRoom().unpublish( ServiceRoom.getLocalStream() );
              }*/
              let publishstate = localUser.hasvideo ? (localUser.hasaudio ? TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH : TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY ): ( localUser.hasaudio ? TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY  : TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE   ) ;//自动发布
              ServiceSignalling.changeUserPublish(localUser.id , publishstate);
          }else if(TkConstant.joinRoomInfo.isBeforeClassReleaseVideo){
          	  ServiceSignalling.changeUserPublish( ServiceRoom.getTkRoom().getMySelf().id , TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE  );
          }
    };

    /*上课前自动发布音视频 ljh*/
    _BeforeClassAutoPublishAV(){
        if(TkConstant.hasRole.roleTeachingAssistant){return}
    	let localUser = ServiceRoom.getTkRoom().getMySelf() ;
        let publishstate = localUser.hasvideo ? (localUser.hasaudio ? TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH : TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY ): ( localUser.hasaudio ? TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY  : TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE   ) ;//自动发布
        ServiceSignalling.changeUserPublish(localUser.id , publishstate);
    };

    /*保存登录地址到sessionStorage*/
    _saveAddressToSession(timestamp){
        if( TkConstant.joinRoomInfo &&  TkConstant.joinRoomInfo.thirdid  ){
            //将地址存入本地session,time为key值
            let time = timestamp ||  TkUtils.getUrlParams('timestamp' , window.location.href );
            let joinUrl = TkUtils.decrypt( TkConstant.joinRoomInfo.joinUrl ) ;
            let refresh_thirdid_index = joinUrl.indexOf('&refresh_thirdid') ;
            if( refresh_thirdid_index !== -1 ){
                joinUrl = joinUrl.substring(0 , refresh_thirdid_index);
            }
            joinUrl += ('&refresh_thirdid='+TkConstant.joinRoomInfo.thirdid) ;
            //L.Utils.sessionStorage.setItem("thirdid",TkConstant.joinRoomInfo.thirdid);
            L.Utils.sessionStorage.setItem(time, TkUtils.encrypt(joinUrl) );
        }
    };

    /*处理数据流再次细分分发，根据数据流type*/
    _againDispatchStreamEvent(streamEventData){
        let stream = streamEventData.stream ;
        if(!stream){ return ; } ;
        let changeEventData =  Object.customAssign( {} ,  streamEventData)  ;
        let attributes = stream.getAttributes() ;
        if(!attributes){L.Logger.error('_againDispatchStreamEvent:stream attributes is not exist!'); return ; } ;
        changeEventData.type = changeEventData.type + "_"+ attributes.type ;
        let isLog = true ;
        if(streamEventData.type === 'stream-rtcStats' || (streamEventData.type === 'room-pubmsg' && streamEventData.message.name === 'sendNetworkState')){
            isLog = false ;
        }
        eventObjectDefine.CoreController.dispatchEvent( changeEventData  , isLog );
        let isReturn  = true ; //是否直接return
        return isReturn;
    };

    /*用户登录设备类型*/
    _userLoginDeviceType(){
    	if(TkGlobal.isClient){
    		if(TkGlobal.isMacClient){
    			return 'MacClient';
    		}else{
    			return "WindowClient" ;
    		}
    	}else if(TkGlobal.isMobile){
    		return "Mobile";
    	}else{
    		if(TkGlobal.osType=="Mac"){
    			return 'MacPC';
    		}else{
    			return "WindowPC" ;
    		}
    	}
    }

    /*上课之后的处理函数*/
    _classBeginStartHandler(pubmsgData){
        const that = this ;
        TkGlobal.classBeginTime = !TkUtils.isMillisecondClass( pubmsgData.ts ) ? pubmsgData.ts * 1000 : pubmsgData.ts ; //上课的时间
        TkGlobal.classBegin = true ;//已经上课
        let roleHasDefalutAppPermissionsJson =  RoleHandler.getRoleHasDefalutAppPermissions();
        TkAppPermissions.initAppPermissions(roleHasDefalutAppPermissionsJson);

        if(TkGlobal.isBroadcast){//如果是直播
            if(TkGlobal.isBroadcastClient) {//是直播且客户端
                if (TkConstant.hasRole.roleChairman) {
                    ServiceRoom.getTkRoom().startBroadcast();
                }
            } else {
                if (TkConstant.hasRole.roleChairman) {
                    ServiceTooltip.showPrompt(TkGlobal.language.languageData.alertWin.login.register.eventListener.broadcastClass.roleChairman.text);
                }
            }
        }else{
            that._autoPublishAV();  //自动发布音视频
        }
        if(TkConstant.joinRoomInfo.isSupportCandraw && TkConstant.hasRoomtype.oneToOne  && TkConstant.hasRole.roleStudent ){ //1对1,根据配置项决定是否给予画笔权限(学生)
            if( !ServiceRoom.getTkRoom().getMySelf().candraw ){
                ServiceSignalling.setParticipantPropertyToAll( ServiceRoom.getTkRoom().getMySelf().id , {candraw:!ServiceRoom.getTkRoom().getMySelf().candraw} );
            }else{
                if( ServiceRoom.getTkRoom().getMySelf().candraw !== CoreController.handler.getAppPermissions('canDraw') ){
                    CoreController.handler.setAppPermissions('canDraw' , ServiceRoom.getTkRoom().getMySelf().candraw ) ;
                }
            }
        }else{
            if( ServiceRoom.getTkRoom().getMySelf().candraw !== CoreController.handler.getAppPermissions('canDraw') ){
                ServiceSignalling.setParticipantPropertyToAll( ServiceRoom.getTkRoom().getMySelf().id , {candraw:CoreController.handler.getAppPermissions('canDraw') } );
            }
        }
    };

    /*下课之后的处理函数*/
    _classBeginEndHandler(delmsgData){
        TkGlobal.classBegin = false; //下课状态
        TkGlobal.endClassBegin = true ; //已经下课
        let isDispatchEvent_endClassbeginShowLocalStream = false ;
        if(  !TkConstant.joinRoomInfo.isClassOverNotLeave && (TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleStudent) ){ //下课离开教室并且是老师或学生
            if( ServiceRoom.getTkRoom().getMySelf().publishstate !== TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE){ //用户的发布状态不是下台
                ServiceSignalling.changeUserPublish(ServiceRoom.getTkRoom().getMySelf().id , TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE); //改变用户的发布状态
            }
        }
        let roleHasDefalutAppPermissionsJson =  RoleHandler.getRoleHasDefalutAppPermissions();
        TkAppPermissions.initAppPermissions(roleHasDefalutAppPermissionsJson); 
        if(TkGlobal.isBroadcastClient){ 
        	if(TkConstant.hasRole.roleChairman){ 
        		ServiceRoom.getTkRoom().stopBroadcast();
        	}
        }
        if( TkConstant.joinRoomInfo.hiddenClassBegin ){ //隐藏上下课就离开教室
            ServiceRoom.getTkRoom().leaveroom(true);
            isDispatchEvent_endClassbeginShowLocalStream = false ;
        }else{
            if( TkConstant.joinRoomInfo.isClassOverNotLeave ){ //下课后不离开教室
                if(delmsgData.fromID && ( ServiceRoom.getTkRoom().getMySelf().id ===  delmsgData.fromID || !ServiceRoom.getTkRoom().getUser( delmsgData.fromID) ) ){
                    ServiceTools.unpublishAllMediaStream();
                    if(!TkConstant.joinRoomInfo.isClassOverNotLeave){
                        ServiceSignalling.delmsgTo__AllAll();//清除所有信令消息
                    }
                }
                if(TkConstant.hasRole.roleStudent && ServiceRoom.getTkRoom().getMySelf().candraw !== false){
                    ServiceSignalling.setParticipantPropertyToAll(ServiceRoom.getTkRoom().getMySelf().id , {candraw:false});
                }
                eventObjectDefine.CoreController.dispatchEvent({type:'revertToStartupLayout_endClassbegin'}); //触发下课恢复原始界面的事件
                isDispatchEvent_endClassbeginShowLocalStream = true ;
            }else{
                if( !TkConstant.hasRole.roleChairman ){ //不是老师就离开教室，否则恢复页面能再次上课
                    ServiceRoom.getTkRoom().leaveroom(true);
                    isDispatchEvent_endClassbeginShowLocalStream = false ;
                }else{
                    ServiceTools.unpublishAllMediaStream();
                    if(!TkConstant.joinRoomInfo.isClassOverNotLeave){
                        ServiceSignalling.delmsgTo__AllAll();//清除所有信令消息
                    }
                    eventObjectDefine.CoreController.dispatchEvent({type:'revertToStartupLayout_endClassbegin'}); //触发下课恢复原始界面的事件
                    isDispatchEvent_endClassbeginShowLocalStream = true ;
                }
            }
        }
        return isDispatchEvent_endClassbeginShowLocalStream ;
    };

    /*处理checkroom或者nitPlaybackInfo*/
    _handlerCheckroomOrInitPlaybackInfo(ret, userinfo, roominfo , checkroomAterCallback){
        if (ret != 0) {
            L.Logger.error('checkroom error', ret);
            switch(ret) {
                case -1:
                    ServiceTooltip.showError(TkGlobal.language.languageData.alertWin.login.func.checkMeeting.status_minus_1.text);
                    break;
                case 3001:
                    ServiceTooltip.showError(TkGlobal.language.languageData.alertWin.login.func.checkMeeting.status_3001.text);
                    break;
                case 3002:
                    ServiceTooltip.showError(TkGlobal.language.languageData.alertWin.login.func.checkMeeting.status_3002.text);
                    break;
                case 3003:
                    ServiceTooltip.showError(TkGlobal.language.languageData.alertWin.login.func.checkMeeting.status_3003.text);
                    break;
                case 4007:
                    ServiceTooltip.showError(TkGlobal.language.languageData.alertWin.login.func.checkMeeting.status_4007.text);
                    break;
                case 4008:
                    ServiceTooltip.showError(TkGlobal.language.languageData.alertWin.login.func.checkMeeting.status_4008.text);
                    break;
                case 4110:
                    ServiceTooltip.showError(TkGlobal.language.languageData.alertWin.login.func.checkMeeting.status_4110.text);
                    break;
                case 4109:
                    ServiceTooltip.showError(TkGlobal.language.languageData.alertWin.login.func.checkMeeting.status_4109.text);
                    break;
                case 4103:
                    ServiceTooltip.showError(TkGlobal.language.languageData.alertWin.login.func.checkMeeting.status_4103.text);
                    break;
                case 4112:
                    ServiceTooltip.showError(TkGlobal.language.languageData.alertWin.login.func.checkMeeting.status_4112.text);
                    break;
                default:
                    ServiceTooltip.showError(TkGlobal.language.languageData.alertWin.login.func.checkMeeting.status_defalut.text);
                    break;
            }
        } else {
            L.Logger.debug('checkroom userinfo and roominfo:', userinfo , roominfo);
            let href =   TkUtils.decrypt( TkConstant.SERVICEINFO.joinUrl)  || window.location.href;
            let chairmancontrol = ServiceRoom.getTkRoom().getRoomProperties().chairmancontrol ;
            let joinRoomInfo = {
                starttime : ServiceRoom.getTkRoom().getRoomProperties().starttime,
                endtime : ServiceRoom.getTkRoom().getRoomProperties().endtime,
                nickname:ServiceRoom.getTkRoom().getMySelf().nickname,
                thirdid: ServiceRoom.getTkRoom().getMySelf().id ,
                joinUrl: TkUtils.encrypt( href ) ,
                serial: ServiceRoom.getTkRoom().getRoomProperties().serial,
                roomrole: Number(ServiceRoom.getTkRoom().getMySelf().role),
                roomtype: Number(ServiceRoom.getTkRoom().getRoomProperties().roomtype),
                companyid:Number( ServiceRoom.getTkRoom().getRoomProperties().companyid ),
                destTopShareShow:!TkGlobal.playback && (chairmancontrol? Number(chairmancontrol.substr(3, 1) ) === 1 : false) , //程序共享 //xgd 17-10-19
                autoStartAV:!TkGlobal.playback &&  (chairmancontrol? Number(chairmancontrol.substr(23, 1) ) === 1 : false) , //自动发布音视频
                autoClassBegin:!TkGlobal.playback && (chairmancontrol?  Number(chairmancontrol.substr(32, 1) ) === 1 : false) , //自动上课
                studentCloseMyseftAV:!TkGlobal.playback &&  (chairmancontrol? Number(chairmancontrol.substr(33, 1) ) === 1 :false), //学生能否关闭自己音视频
                hiddenClassBegin:!TkGlobal.playback &&  (chairmancontrol? Number(chairmancontrol.substr(34, 1) ) === 1 : false) , //隐藏上下课
                isUploadH5Document:!TkGlobal.playback &&  chairmancontrol? Number(chairmancontrol.substr(35, 1) ) === 1 : false , //是否上传H5课件           //xgd 17-09-14
                assistantOpenMyseftAV:!TkGlobal.playback &&  chairmancontrol? Number(chairmancontrol.substr(36, 1) ) === 1 : false , //助教是否开启音视频   //xgd 17-09-14
                isSupportCandraw:!TkGlobal.playback && chairmancontrol? Number(chairmancontrol.substr(37, 1) ) === 1 : false , //是否支持上课就拥有画笔权限
                isSupportPageTrun:!TkGlobal.playback && chairmancontrol? Number(chairmancontrol.substr(38, 1) ) === 1 : false , //是否支持文档翻页
                isShowTheAnswer:!TkGlobal.playback && chairmancontrol? Number(chairmancontrol.substr(42, 1) ) === 1 : false , //答题卡结束是否展示答案  ljh
                isDoubleScreenDisplay:!TkGlobal.playback && chairmancontrol? Number(chairmancontrol.substr(39, 1) ) === 1 : false , //是否允许双屏显示  ljh
                isBeforeClassReleaseVideo:!TkGlobal.playback &&chairmancontrol? Number(chairmancontrol.substr(41, 1) ) === 1 : false , //:上课前是否发布音视频  ljh
                isClassOverNotLeave:!TkGlobal.playback && chairmancontrol? Number(chairmancontrol.substr(47, 1) ) === 1 : false , //:下课不离开教室  ljh
                videoWhiteboardDraw: !TkGlobal.playback && chairmancontrol? Number(chairmancontrol.substr(48, 1) ) === 1 : false , //视频标注
                localRecord:!TkGlobal.playback && chairmancontrol? Number(chairmancontrol.substr(49, 1) ) === 1 : false , //本地录制
                videoInFullScreen:!TkGlobal.playback && chairmancontrol? Number(chairmancontrol.substr(50, 1) ) === 1 : false , //课件或MP4全屏后video放置右下角
                pictureInPicture:!TkGlobal.playback && chairmancontrol? Number(chairmancontrol.substr(51, 1) ) === 1 : false , //视频全屏后采用画中画配置
                pauseWhenOver:!TkGlobal.playback && chairmancontrol? Number(chairmancontrol.substr(52, 1) ) === 1 : false , //MP4播放结束后，停止在最后一帧，并且不自动关闭视频播放器
                classBeginEndCloseClient:!TkGlobal.playback && chairmancontrol? Number(chairmancontrol.substr(54, 1) ) === 1 : false  , //下课后关闭客户端
                chatSendImg:!TkGlobal.playback && chairmancontrol? Number(chairmancontrol.substr(53, 1) ) === 1 : false  , //聊天发送图片
                isDocumentClassification:!TkGlobal.playback && chairmancontrol? Number(chairmancontrol.substr(56, 1) ) === 1 : false  , //聊天发送图片
                isHandsUpOnStage:true , //上台后是否允许举手 /*isHandsUpOnStage:chairmancontrol? Number(chairmancontrol.substr(40, 1) ) == 1 : false , //上台后是否允许举手  ljh  产品要求先注释掉，默认写成固定值*/
                jumpurl:TkGlobal.playback?'':TkUtils.getUrlParams("jumpurl"), //跳转地址
                roomname:ServiceRoom.getTkRoom().getRoomProperties().roomname, //房间名字
                pullConfigure:ServiceRoom.getTkRoom().getRoomProperties().pullConfigure , //拉流配置
                pushConfigure:ServiceRoom.getTkRoom().getRoomProperties().pushConfigure, //推流配置
                pushUrl:ServiceRoom.getTkRoom().getRoomProperties().pullid,//目前为空
                helpcallbackurl:roominfo.helpcallbackurl,
                template: TkConstant.testTemplate? TkConstant.testTemplate : roominfo.pclayout ? ( !/^\d*$/g.test(roominfo.pclayout)?  'template_'+roominfo.pclayout : TkConstant.template ) : TkConstant.template, //模板
                localRecordInfo:{ //本地录制信息
                    recorduploadaddr:ServiceRoom.getTkRoom().getRoomProperties().recorduploadaddr , //本地录制文件上传地址
                    localrecordtype:'mp4' || ServiceRoom.getTkRoom().getRoomProperties().localrecordtype , //本地录制的类型
                },
                foregroundpic:ServiceRoom.getTkRoom().getRoomProperties().foregroundpic , //视频前景图
            };
         /*   Object.customAssign(joinRoomInfo , { //todo 测试数据

            });*/

            TkConstant.updateTemplate(joinRoomInfo.template);
            TkConstant.bindRoomInfoToTkConstant(joinRoomInfo); //绑定房间信息到TkConstant
            TkConstant.bindParticipantHasRoleToTkConstant(); //绑定当前登录对象事是否拥有指定角色到TkConstant
            TkConstant.bindParticipantHasRoomtypeTkConstant(); //绑定当前登录对象事是否拥有指定教室到TkConstant
            if(TkConstant.isClient){
                ServiceRoom.getTkRoom().getMonitorCount(function(moinitorCount){ //多屏幕 bobo的 判断是否有企业配置项并且是否多屏幕
                    if (moinitorCount >1 && TkConstant.joinRoomInfo.isDoubleScreenDisplay) {
                        TkGlobal.doubleScreen = true;
                        ServiceRoom.getTkRoom().enableViceMonitor();
                    }
                });
                if(TkGlobal.isBroadcastClient && TkConstant.hasRole.roleChairman){ //初始化直播
                    if(!TkConstant.joinRoomInfo.pushConfigure.RTMP){
                        L.Logger.warning('pushConfigure RTMP is not exist!' , JSON.stringify(TkConstant.joinRoomInfo.pushConfigure) );
                    }
                    let pushUrl=TkConstant.joinRoomInfo.pushConfigure.RTMP ;
                    ServiceRoom.getTkRoom().initBroadcast(pushUrl,1024,1,48000,1);
//              ServiceRoom.getTkRoom().initBroadcast("rtmp://push-huantuo.8686c.com/live/017f5ec367f54cc6b23f6a4dd8635e57",1024,1,48000,1);
                }
            }
            if( checkroomAterCallback &&  typeof checkroomAterCallback === "function" ){
                checkroomAterCallback();
            }
        }
    };

};
const  RoomHandlerInstance = new RoomHandler() ;
//RoomHandlerInstance.addEventListenerToRoomHandler();
export default RoomHandlerInstance ;