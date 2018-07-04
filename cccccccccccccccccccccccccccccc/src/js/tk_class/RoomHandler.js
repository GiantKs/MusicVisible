/**
 * 房间相关处理类
 * @class RoomHandler
 * @description   提供 房间相关的处理功能
 * @author QiuShao
 * @date 2017/7/21
 */
'use strict';
import { hashHistory } from 'react-router'
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
            roomName: ServiceRoom.getTkRoom().getRoomProperties().roomname.replace(/&(lt|gt|nbsp|amp|quot);/ig,(all,t)=>{return {'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"'}[t];}),
            userThirdid: ServiceRoom.getTkRoom().getMySelf().id,
        };
        if(!TkGlobal.playback){
            /*跳转call*/
            let timestamp = new Date().getTime() ;
            that._saveAddressToSession(timestamp);/!*保存登录地址到sessionStorage*!/
            if(!TkGlobal.isBroadcastMobile){ //不是移动端并且直播
                hashHistory.push('/call?timestamp='+ timestamp);
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
                TK.Stream({ audio:audioPermissions, video: vedioPermissions , data: false , extensionId:ServiceRoom.getTkRoom().getMySelf().id,  attributes:{ type:'video' }  }, TkGlobal.isClient)
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
        let that = this ;
        if(!TkGlobal.playback){
            checkroomServiceUrl = checkroomServiceUrl || TkConstant.SERVICEINFO.hostname ;
            checkroomServicePort = checkroomServicePort || TkConstant.SERVICEINFO.sdkPort ;
            let href =   TkUtils.decrypt(TkConstant.SERVICEINFO.joinUrl)  || window.location.href;
            let urlAdd = decodeURIComponent(href);
            let urlIndex = urlAdd.indexOf("?");
            let urlSearch = urlAdd.substring(urlIndex + 1);
            //if(!ServiceRoom.getTkRoom()){
                //ServiceRoom.setTkRoom(TK.Room()) ;
                //if(TkConstant.SERVICEINFO.protocol === 'http'){
                    //ServiceRoom.getTkRoom().updateProtocol('http://');
                //}
                //that.registerEventToRoom();
                //if(!(TkGlobal.isClient || TkGlobal.isBroadcast) ){
                    //ServiceRoom.getTkRoom().addOndevicechange();
                //}
            //}
            let userid = TkUtils.getUrlParams('refresh_thirdid') ;
            ServiceRoom.getTkRoom().checkroom(checkroomServiceUrl, checkroomServicePort,urlSearch.toString(), function (ret, userinfo, roominfo) {
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
                    L.Logger.debug('Trying to joinroom', userinfo , roominfo);
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
                        destTopShareShow: (chairmancontrol? Number(chairmancontrol.substr(3, 1) ) === 1 : false) , //程序共享 //xgd 17-10-19
                        autoStartAV: (chairmancontrol? Number(chairmancontrol.substr(23, 1) ) === 1 : false) , //自动发布音视频
                        autoClassBegin:(chairmancontrol?  Number(chairmancontrol.substr(32, 1) ) == 1 : false) , //自动上课
                        studentCloseMyseftAV: (chairmancontrol? Number(chairmancontrol.substr(33, 1) ) == 1 :false), //学生能否关闭自己音视频
                        hiddenClassBegin: (chairmancontrol? Number(chairmancontrol.substr(34, 1) ) == 1 : false) , //隐藏上下课
                        isUploadH5Document: chairmancontrol? Number(chairmancontrol.substr(35, 1) ) == 1 : false , //是否上传H5课件           //xgd 17-09-14
                        assistantOpenMyseftAV: chairmancontrol? Number(chairmancontrol.substr(36, 1) ) == 1 : false , //助教是否开启音视频   //xgd 17-09-14
                        isSupportCandraw:chairmancontrol? Number(chairmancontrol.substr(37, 1) ) == 1 : false , //是否支持上课就拥有画笔权限
                        isSupportPageTrun:chairmancontrol? Number(chairmancontrol.substr(38, 1) ) == 1 : false , //是否支持文档翻页

                        isShowStudentsNum:chairmancontrol? Number(chairmancontrol.substr(200, 1) ) == 1 : false ,//是否显示学生人数
                        isBeforeClassInteraction:chairmancontrol? Number(chairmancontrol.substr(201, 1) ) == 1 : false , //是否支持课前互动
                        isAfterClassInteraction:chairmancontrol? Number(chairmancontrol.substr(202, 1) ) == 1 : false , //是否支持课后互动
                        isDisplayBurglarChain:chairmancontrol? Number(chairmancontrol.substr(203, 1) ) == 1 : false , //是否开启防盗链
                        isDisplayTeacherInformation:chairmancontrol? Number(chairmancontrol.substr(204, 1) ) == 1 : false , //是否显示老师信息
                        isShowShare:chairmancontrol? Number(chairmancontrol.substr(205, 1) ) == 1 : false , //是否开启共享
                        isShowRollCall:chairmancontrol? Number(chairmancontrol.substr(206, 1) ) == 1 : false , //是否开启点名
                        isShowLuckDraw:chairmancontrol? Number(chairmancontrol.substr(207, 1) ) == 1 : false , //是否开启抽奖
                        isShowVote:chairmancontrol? Number(chairmancontrol.substr(208, 1) ) == 1 : false , //是否开启投票
                        isShowNotice:chairmancontrol? Number(chairmancontrol.substr(209, 1) ) == 1 : false , //是否开启公告
                        isOpeningNotice:chairmancontrol? Number(chairmancontrol.substr(210, 1) ) == 1 : false , //是否开启通知
                        isOpeningRadioBroadcast:chairmancontrol? Number(chairmancontrol.substr(211, 1) ) == 1 : false , //是否开启广播
                        


                        jumpurl:TkUtils.getUrlParams("jumpurl"),
                        roomname:ServiceRoom.getTkRoom().getRoomProperties().roomname,
                        pullConfigure:ServiceRoom.getTkRoom().getRoomProperties().pullConfigure ,
                        pushConfigure:ServiceRoom.getTkRoom().getRoomProperties().pushConfigure,
                        pushUrl:ServiceRoom.getTkRoom().getRoomProperties().pullid,//目前为空
                        helpcallbackurl:roominfo.helpcallbackurl,
                    };
                    TkConstant.bindRoomInfoToTkConstant(joinRoomInfo); //绑定房间信息到TkConstant
                    TkConstant.bindParticipantHasRoleToTkConstant(); //绑定当前登录对象事是否拥有指定角色到TkConstant
                    if(TkGlobal.isBroadcastClient && TkConstant.hasRole.roleChairman){//初始化直播
                        if(!TkConstant.joinRoomInfo.pushConfigure.RTMP){
                            L.Logger.warning('pushConfigure RTMP is not exist!' , JSON.stringify(TkConstant.joinRoomInfo.pushConfigure) );
                        }
                    	let pushUrl=TkConstant.joinRoomInfo.pushConfigure.RTMP ;
                        let {pullWidth,pullHeight} = TkUtils.getWidthAndHeight(ServiceRoom.getTkRoom().getRoomProperties().videotype);
                        // ServiceRoom.getTkRoom().initBroadcast(pushUrl,10,2, pullWidth,pullHeight);
//                    	ServiceRoom.getTkRoom().initBroadcast(pushUrl,1024,1,48000,1);
//                  	ServiceRoom.getTkRoom().initBroadcast("rtmp://push-huantuo.8686c.com/live/017f5ec367f54cc6b23f6a4dd8635e57",1024,1,48000,1);
                    }
                    TkConstant.bindParticipantHasRoomtypeTkConstant(); //绑定当前登录对象事是否拥有指定教室到TkConstant
                    if( checkroomAterCallback &&  typeof checkroomAterCallback === "function" ){
                        checkroomAterCallback();
                    }
                }
            } , userid);
        }else{
            L.Logger.error('In the playback environment, cannot execute checkroom!');
            return;
        }
    };

    /*初始化回放参数，模拟checkroom
    * @method initPlaybackInfo */
    initPlaybackInfo(initPlaybackInfoServiceUrl, initPlaybackInfoServicePort, initPlaybackInfoAterCallback ){
        let that = this ;
        if(!TkGlobal.playback){
            L.Logger.error('No playback environment, no execution initPlaybackInfo!');
            return;
        }else{ //回放走的流程
            initPlaybackInfoServiceUrl = initPlaybackInfoServiceUrl || TkConstant.SERVICEINFO.hostname ;
            initPlaybackInfoServicePort = initPlaybackInfoServicePort || TkConstant.SERVICEINFO.sdkPort ;
            //if(!ServiceRoom.getTkRoom()){
                //ServiceRoom.setTkRoom(TK.Room()) ;
                //if(TkConstant.SERVICEINFO.protocol === 'http'){
                //   ServiceRoom.getTkRoom().updateProtocol('http://');
                //}
                //that.registerEventToRoom();
            //}
            let playbackParams = {
                roomtype:TkUtils.getUrlParams('type') != ""? Number(TkUtils.getUrlParams('type') ) : TkUtils.getUrlParams('type'),
                serial:TkUtils.getUrlParams('serial'),
                recordfilepath:"http://"+TkUtils.getUrlParams('path'),
                domain:TkUtils.getUrlParams('domain'),
                host:TkUtils.getUrlParams('host'),
            };
            //兼容直播回放，增加第五个参数 true，callback函数返回code为0
            ServiceRoom.getTkRoom().initPlaybackInfo(initPlaybackInfoServiceUrl, initPlaybackInfoServicePort,playbackParams, function (code,userinfo, roominfo) {
                L.Logger.debug('Trying to joinroom', userinfo , roominfo);
                let chairmancontrol = ServiceRoom.getTkRoom().getRoomProperties().chairmancontrol ;
                let href =   TkUtils.decrypt( TkConstant.SERVICEINFO.joinUrl)  || window.location.href;
                let joinRoomInfo = {
                    starttime : ServiceRoom.getTkRoom().getRoomProperties().starttime,
                    endtime : ServiceRoom.getTkRoom().getRoomProperties().endtime,
                    nickname:ServiceRoom.getTkRoom().getMySelf().nickname,
                    thirdid: ServiceRoom.getTkRoom().getMySelf().id ,
                    joinUrl: TkUtils.encrypt(href),
                    serial: ServiceRoom.getTkRoom().getRoomProperties().serial,
                    roomrole: Number(ServiceRoom.getTkRoom().getMySelf().role),
                    roomtype: Number(ServiceRoom.getTkRoom().getRoomProperties().roomtype),
                    companyid:Number( ServiceRoom.getTkRoom().getRoomProperties().companyid ),
                    destTopShareShow: (chairmancontrol? Number(chairmancontrol.substr(3, 1) ) === 1 : false) , //程序共享 //xgd 17-10-19
                    autoStartAV: chairmancontrol? Number(chairmancontrol.substr(23, 1) ) === 1 : false , //自动发布音视频
                    autoClassBegin:chairmancontrol?  Number(chairmancontrol.substr(32, 1) ) == 1 : false , //自动上课
                    studentCloseMyseftAV: chairmancontrol? Number(chairmancontrol.substr(33, 1) ) == 1 :false, //学生能否关闭自己音视频
                    hiddenClassBegin: chairmancontrol? Number(chairmancontrol.substr(34, 1) ) == 1 : false , //隐藏上下课
                    isUploadH5Document: chairmancontrol? Number(chairmancontrol.substr(35, 1) ) == 1 : false , //是否上传H5课件           //xgd 17-09-14
                    assistantOpenMyseftAV: chairmancontrol? Number(chairmancontrol.substr(36, 1) ) == 1 : false , //助教是否开启音视频   //xgd 17-09-14
                    isSupportCandraw:chairmancontrol? Number(chairmancontrol.substr(37, 1) ) == 1 : false , //是否支持上课就拥有画笔权限
                    isSupportPageTrun:chairmancontrol? Number(chairmancontrol.substr(38, 1) ) == 1 : false , //是否支持文档翻页



                    isShowStudentsNum:chairmancontrol? Number(chairmancontrol.substr(200, 1) ) == 1 : false ,//是否显示学生人数
                    isBeforeClassInteraction:chairmancontrol? Number(chairmancontrol.substr(201, 1) ) == 1 : false , //是否支持课前互动
                    isAfterClassInteraction:chairmancontrol? Number(chairmancontrol.substr(202, 1) ) == 1 : false , //是否支持课后互动
                    isDisplayBurglarChain:chairmancontrol? Number(chairmancontrol.substr(203, 1) ) == 1 : false , //是否开启防盗链
                    isDisplayTeacherInformation:chairmancontrol? Number(chairmancontrol.substr(204, 1) ) == 1 : false , //是否显示老师信息
                    isShowShare:chairmancontrol? Number(chairmancontrol.substr(205, 1) ) == 1 : false , //是否开启共享
                    isShowRollCall:chairmancontrol? Number(chairmancontrol.substr(206, 1) ) == 1 : false , //是否开启点名
                    isShowLuckDraw:chairmancontrol? Number(chairmancontrol.substr(207, 1) ) == 1 : false , //是否开启抽奖
                    isShowVote:chairmancontrol? Number(chairmancontrol.substr(208, 1) ) == 1 : false , //是否开启投票
                    isShowNotice:chairmancontrol? Number(chairmancontrol.substr(210, 1) ) == 1 : false , //是否开启通知
                    isOpeningNotice:chairmancontrol? Number(chairmancontrol.substr(209, 1) ) == 1 : false , //是否开启公告
                    isOpeningRadioBroadcast:chairmancontrol? Number(chairmancontrol.substr(211, 1) ) == 1 : false , //是否开启广播



                    jumpurl:TkUtils.getUrlParams("jumpurl") ,
                    roomname:ServiceRoom.getTkRoom().getRoomProperties().roomname ,
                    recordfilepath:ServiceRoom.getTkRoom().getRoomProperties().recordfilepath,
                    recordjsonpath:ServiceRoom.getTkRoom().getRoomProperties().recordfilepath + "record.json",   //回放json路径
                    pullConfigure:ServiceRoom.getTkRoom().getRoomProperties().pullConfigure ,
                    pushConfigure:ServiceRoom.getTkRoom().getRoomProperties().pushConfigure,
                    pushUrl:ServiceRoom.getTkRoom().getRoomProperties().pullid,//目前为空
                };
                TkConstant.bindRoomInfoToTkConstant(joinRoomInfo); //绑定房间信息到TkConstant
                TkConstant.bindParticipantHasRoleToTkConstant(); //绑定当前登录对象事是否拥有指定角色到TkConstant
                if( initPlaybackInfoAterCallback &&  typeof initPlaybackInfoAterCallback === "function" ){
                    initPlaybackInfoAterCallback();
                }
            },true );
        }
    };

    /*进入房间的方法*/
    joinRoom(){
        /*if(TkGlobal.isBroadcast && TkGlobal.playback) //todo 20180109 直播回放返回
            return ;*/
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
        ServiceRoom.getTkRoom().joinroom( ServiceRoom.getLocalStream() );
        // if(TkGlobal.isClient){
        //      ServiceRoom.getTkRoom().joinroom( ServiceRoom.getLocalStream(),'192.168.1.249' ,'9000');
        // } else {
        //      ServiceRoom.getTkRoom().joinroom( ServiceRoom.getLocalStream(),'192.168.1.249' ,'9101');
        // }
        //ServiceRoom.getTkRoom().joinroom( ServiceRoom.getLocalStream(),'192.168.1.57' ,'8889');
    };


    /*添加事件监听到Room*/
    addEventListenerToRoomHandler(){
        let that = this ;
        /*@description Room类-RoomEvent的相关事件*/
        let liveMap = JSON.parse(TkGlobal.liveDelayCondition);
        let livePubmsgMap = JSON.parse(TkGlobal.liveDelayPubmsgCondition);
        let liveDelmsgMap = JSON.parse(TkGlobal.liveDelayDelmsgCondition);

        for(let eventKey in TkConstant.EVENTTYPE.RoomEvent ){
            //Log.error("addEventListenerToRoomHandler eventKey===", eventKey);
            eventObjectDefine.Room.addEventListener(TkConstant.EVENTTYPE.RoomEvent[eventKey] , function (recvEventData) {
                let isTimeout = TkGlobal.playback?false:TkGlobal.isLiveDelay ;
                if(liveMap[eventKey] || recvEventData.type === "room-pubmsg" && livePubmsgMap[recvEventData.message.name] || recvEventData.type === "room-delmsg" && liveDelmsgMap[recvEventData.message.name] )
                    isTimeout = false;
                TkUtils.liveTimeout(function () {

                    if(that['handler'+TkUtils.replaceFirstUper(eventKey) ] && typeof  that['handler'+TkUtils.replaceFirstUper(eventKey) ]  === "function" ){
                        let isReturn =  that[ 'handler'+TkUtils.replaceFirstUper(eventKey) ](recvEventData);
                        if(isReturn){return;}; //是否直接return，不做后面的事件再次分发
                    }
                    let isLog = true ;
                    if(recvEventData.type === 'stream-rtcStats'){
                        isLog = false ;
                    }
                    eventObjectDefine.CoreController.dispatchEvent(recvEventData , isLog);
                } , TkGlobal.liveTimeDelay , isTimeout) ;
            });
        }


        //that.handlerLiveTimeDelay("",false,that.handlerAddEventListenerToRoomHandler);

    };

    handlerRoomCilentClose(recvEventData){ //客户端关闭回调事件
        ServiceTooltip.showSelectTooltip({
            title: {
                text: TkGlobal.language.languageData.alertWin.messageWin.title.leaveRoom.text,
            },
            content: {
                type: 'db-radio',
                text: TkGlobal.language.languageData.alertWin.ok.showConfirm.ok,
            },
            data: {}
        }, function(hasConfirm, data){
            if(hasConfirm && data.checked === 1){  //下课处理流程
                if( !CoreController.handler.getAppPermissions('endClassBegin') ){return ;}
                if(TkGlobal.classBegin){
                    WebAjaxInterface.roomOver(); //发送下课信令
                    ServiceRoom.getTkRoom().stopBroadcast();
                    ServiceRoom.getTkRoom().uninitBroadcast();
                    ServiceSignalling.delmsgTo__AllAll();//清除所有信令消息
                    ServiceRoom.getTkRoom().leaveroom();

                }
                ServiceRoom.getTkRoom().closeWindow();
            } else if(hasConfirm && data.checked === 2){ //离开教室处理流程
                let dataToServer = {
                    msg: TkGlobal.language.languageData.classroomNotice.text,
                    type: 0,
                    id:  ServiceRoom.getTkRoom().getMySelf().id,
                    time: TkUtils.getSendTime(),
                }
                dataToServer.sender = TkGlobal.isBroadcast ? {
                    id: ServiceRoom.getTkRoom().getMySelf().id,
                    role: ServiceRoom.getTkRoom().getMySelf().role,
                    nickname: ServiceRoom.getTkRoom().getMySelf().nickname,
                } : undefined;
                ServiceSignalling.sendTextMessage(dataToServer);//sendMessage 发送消息
                ServiceRoom.getLocalStream().muteVideo(false);
                ServiceRoom.getLocalStream().muteAudio(false);
                ServiceRoom.getTkRoom().closeWindow();

            };
        });
        /*if(TkGlobal.classBegin){
            ServiceTooltip.showConfirm(TkGlobal.language.languageData.alertWin.messageWin.winMessageText.classBeginEnd.text , function (answer) {
                if(answer){
                    WebAjaxInterface.roomOver(); //发送下课信令
                    ServiceRoom.getTkRoom().stopBroadcast();
                    ServiceRoom.getTkRoom().uninitBroadcast();
                    ServiceSignalling.delmsgTo__AllAll();//清除所有信令消息
                    ServiceRoom.getTkRoom().leaveroom(); 
                    ServiceRoom.getTkRoom().closeWindow();
                }  
            });
        } else {
            ServiceRoom.getTkRoom().closeWindow();
        }*/
        
        return true ;
    }

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
                    eventObjectDefine.Room.dispatchEvent({type:TkConstant.EVENTTYPE.RoomEvent.roomMsglist, message:TkGlobal.signallingMessageList , source:'roomPubmsg' });
                    TkGlobal.signallingMessageList = null;
                    delete TkGlobal.signallingMessageList ;
                }
                break;
            case "SharpsChange":
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
                    //todo 等待肖阳视频发布的消息
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
                                            serverListCopy[key] = Object.assign({} , value);
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
        }
    };
    handlerRoomDelmsg(recvEventData){//处理room-delmsg事件
        const that = this ;
        if(recvEventData.message && typeof recvEventData.message == "string") {
            recvEventData.message = JSON.parse(recvEventData.message);
        }
        if(recvEventData.message.data && typeof recvEventData.message.data == "string") {
            recvEventData.message.data = JSON.parse(recvEventData.message.data);
        }
        let delmsgData = recvEventData.message ;
        switch(delmsgData.name) {
            case "ClassBegin": //删除上课（也就是下课了）
                let isDispatchEvent_endClassbeginShowLocalStream = that._classBeginEndHandler(delmsgData); //下课之后的处理函数
                if(!isDispatchEvent_endClassbeginShowLocalStream){
                    ServiceRoom.getTkRoom().stopStreamTracksFromDefaultStream();
                }
                ServiceTooltip.showPrompt(TkGlobal.language.languageData.alertWin.login.register.eventListener.roomDelClassBegin.text , ()=>{
                    if(isDispatchEvent_endClassbeginShowLocalStream){
                        eventObjectDefine.CoreController.dispatchEvent({type:'endClassbeginShowLocalStream'}); //触发下课后显示本地视频
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
        }
    };
    handlerRoomConnected(roomConnectedEventData){  //处理room-connected事件
        //获取角色默认权限
        const that = this ;
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
            if(TkGlobal.isDisconnected) //断网重连 2018-01-15 xgd
                continue;
            RoleHandler.checkRoleConflict(user , true) ;
        }
        eventObjectDefine.Room.dispatchEvent({type:TkConstant.EVENTTYPE.RoomEvent.roomMsglist, message:TkGlobal.signallingMessageList , source:'roomConnected' });
        if(TkGlobal.serviceTime &&  !TkGlobal.firstGetServiceTime && !TkGlobal.isHandleMsglistFromRoomPubmsg && TkGlobal.signallingMessageList  ){
            TkGlobal.firstGetServiceTime = true ;
            eventObjectDefine.Room.dispatchEvent({type:TkConstant.EVENTTYPE.RoomEvent.roomMsglist, message:TkGlobal.signallingMessageList , source:'roomPubmsg' });
            TkGlobal.signallingMessageList = null;
            delete TkGlobal.signallingMessageList ;
        }
        if( !TkGlobal.classBegin && ServiceRoom.getTkRoom().getMySelf().candraw !== CoreController.handler.getAppPermissions('canDraw') ){
            ServiceSignalling.setParticipantPropertyToAll( ServiceRoom.getTkRoom().getMySelf().id , {candraw:CoreController.handler.getAppPermissions('canDraw') } );
        };
        if(!TkGlobal.firstGetServiceTime){ //没有获取第一次服务器时间
            ServiceSignalling.sendSignallingFromUpdateTime( ServiceRoom.getTkRoom().getMySelf().id );
        }

        let defalutFontSize = window.innerWidth / TkConstant.STANDARDSIZE ;  //5rem = defalutFontSize*'5px' ;
        eventObjectDefine.Window.dispatchEvent({ type:TkConstant.EVENTTYPE.WindowEvent.onResize , message:{defalutFontSize:defalutFontSize} });
        eventObjectDefine.CoreController.dispatchEvent({type: 'loadSupernatantPrompt' , message:{show:false , content:undefined}  });
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
                    if(TkConstant.hasRole.roleStudent){
                        TkAppPermissions.setAppPermissions('whiteboardPagingPage' , value ? value : TkConstant.joinRoomInfo.isSupportPageTrun);//白板翻页权限
                        TkAppPermissions.setAppPermissions('newpptPagingPage' , value ? value : TkConstant.joinRoomInfo.isSupportPageTrun);//动态ppt翻页权限
                        TkAppPermissions.setAppPermissions('h5DocumentPagingPage' , value ? value : TkConstant.joinRoomInfo.isSupportPageTrun);//h5课件翻页权限
                        TkAppPermissions.setAppPermissions('jumpPage' , value ? value : TkConstant.joinRoomInfo.isSupportPageTrun);//h5课件翻页权限
                    }
                }
                if(key === 'publishstate' || key === 'raisehand' ){
                    if( (user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY ||  user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH) && user.raisehand && TkConstant.hasRole.roleStudent ){
                        ServiceSignalling.setParticipantPropertyToAll(ServiceRoom.getTkRoom().getMySelf().id , {raisehand:false}); //如果音频或者音视频都有但是又举手了，则取消举手
                    }
                }
            }
            if(  key === 'giftnumber'){
                TkGlobal.participantGiftNumberJson[user.id] = 0 ;
            }
        }
    };
    handlerRoomFiles(roomFilesEventData){
        let filesArray = roomFilesEventData.message;
        let defaultFileInfo = undefined ;
        for(let fileInfo of filesArray){
            if(Number(fileInfo.type) === 1 &&   !(TkUtils.getFiletyeByFilesuffix(fileInfo.filetype) === 'mp4' ||   TkUtils.getFiletyeByFilesuffix(fileInfo.filetype) === 'mp3' )  ){
                defaultFileInfo = fileInfo ;
                break;
            }else if( !(TkUtils.getFiletyeByFilesuffix(fileInfo.filetype) === 'mp4' ||   TkUtils.getFiletyeByFilesuffix(fileInfo.filetype) === 'mp3' )  && !defaultFileInfo){
                defaultFileInfo = fileInfo ;
            }
        }
        TkGlobal.defaultFileInfo = defaultFileInfo || TkGlobal.defaultFileInfo;
    };
    handlerRoomMsglist(roomMsglistEventData){//处理room-msglist事件
        const that = this ;
        const _handlerRoomMsglist = (messageListData , source , ignoreSignallingJson) => { //room-msglist处理函数
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
                    TkGlobal.msglist.videoDragArray = videoDragArr;
                    let user = ServiceRoom.getTkRoom().getMySelf();
                    if (TkGlobal.msglist.videoDragArray[0].data.otherVideoStyle[user.id]) {
                        TkGlobal.msglist.videoDragArray[0].data.otherVideoStyle[user.id] = {
                            percentTop:0,
                            percentLeft:0,
                            isDrag:false,
                        };
                        let data = {otherVideoStyle:TkGlobal.msglist.videoDragArray[0].data.otherVideoStyle};
                        ServiceSignalling.sendSignallingFromVideoDraghandle(data);
                    }
                }
                tmpSignallingData["videoDraghandle"] = null;
                
                /*分屏数据*/
                let VideoSplitScreenArr = tmpSignallingData["VideoSplitScreen"];
                if(VideoSplitScreenArr !== null && VideoSplitScreenArr !== undefined && VideoSplitScreenArr.length > 0) {
                    TkGlobal.msglist.VideoSplitScreenArray = VideoSplitScreenArr;
                }
                tmpSignallingData["VideoSplitScreen"] = null;

                /*视频拉伸的动作*/
                let VideoChangeSizeArr = tmpSignallingData["VideoChangeSize"];
                if (VideoChangeSizeArr !== null && VideoChangeSizeArr !== undefined && VideoChangeSizeArr.length > 0) {
                    TkGlobal.msglist.videoChangeSizeArr = VideoChangeSizeArr;
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

				
                
                //最后打开的文档文件和媒体文件
                let lastDoucmentFileData = null,
                    lastMediaFileData = null;
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

        let messageListData = roomMsglistEventData.message ;
        let source = roomMsglistEventData.source ;
        let ignoreSignallingJson = {} ;
        _handlerRoomMsglist(messageListData , source , ignoreSignallingJson);
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

    /*自动发布音视频*/
    _autoPublishAV(){
        if( (TkConstant.joinRoomInfo.autoStartAV || TkConstant.hasRole.roleChairman ) &&  TkAppPermissions.getAppPermissions('autoPublishAV')  ) {
            let localUser = ServiceRoom.getTkRoom().getMySelf() ;
            let publishstate = localUser.hasvideo ? (localUser.hasaudio ? TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH : TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY ): ( localUser.hasaudio ? TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY  : TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE   ) ;//自动发布
            ServiceSignalling.changeUserPublish(localUser.id , publishstate);
        }
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
            //window.sessionStorage.setItem("thirdid",TkConstant.joinRoomInfo.thirdid);
            L.Utils.sessionStorage.setItem(time, TkUtils.encrypt(joinUrl) );
        }
    };
    /*处理数据流再次细分分发，根据数据流type*/
    _againDispatchStreamEvent(streamEventData){
        let stream = streamEventData.stream ;
        if(!stream){ return ; } ;
        let changeEventData =  Object.assign( {} ,  streamEventData)  ;
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
    		if(TkGlobal.osType=="Mac"){
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
    _classBeginStartHandler(classbeginInfo){
        const that = this ;
        TkGlobal.classBeginTime = !TkUtils.isMillisecondClass( classbeginInfo.ts ) ? classbeginInfo.ts * 1000 : classbeginInfo.ts ; //上课的时间
        TkGlobal.classBegin = true ;//已经上课
        let roleHasDefalutAppPermissionsJson =  RoleHandler.getRoleHasDefalutAppPermissions();
        TkAppPermissions.initAppPermissions(roleHasDefalutAppPermissionsJson);

        if(TkGlobal.isBroadcast){
            if(TkGlobal.isBroadcastClient) {
                /*if (TkConstant.hasRole.roleChairman) {
                    ServiceRoom.getTkRoom().startBroadcast(ServiceRoom.getLocalStream().extensionId,640,480);
                }*/
            } else {
                if (TkConstant.hasRole.roleChairman) {
                    ServiceTooltip.showPrompt(TkGlobal.language.languageData.alertWin.login.register.eventListener.broadcastClass.roleChairman.text);
                }
            }
        }else{
            if (!CoreController.handler.getAppPermissions('pairOfManyIsShow') || TkConstant.hasRole.roleChairman) {//如果是一起作业的一对三十
                that._autoPublishAV();  //自动发布音视频
            }
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
    _classBeginEndHandler(classbeginInfo){
        let isDispatchEvent_endClassbeginShowLocalStream = false ;
        if( TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleStudent   ){
            if( ServiceRoom.getTkRoom().getMySelf().publishstate !== TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE){
                ServiceSignalling.changeUserPublish(ServiceRoom.getTkRoom().getMySelf().id , TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE);
            }
        }
        TkGlobal.classBegin = false; //下课状态
        TkGlobal.endClassBegin = true ; //已经下课
        let roleHasDefalutAppPermissionsJson =  RoleHandler.getRoleHasDefalutAppPermissions();
        TkAppPermissions.initAppPermissions(roleHasDefalutAppPermissionsJson);
       /* if(TkGlobal.isBroadcastClient){
        	if(TkConstant.hasRole.roleChairman){
        		ServiceRoom.getTkRoom().stopBroadcast();
        	}
        }*/
        if(  TkConstant.joinRoomInfo.hiddenClassBegin ||  !TkConstant.hasRole.roleChairman ){ //隐藏上下课或者不是老师就离开教室，否则恢复页面能再次上课
            ServiceRoom.getTkRoom().leaveroom(true);
            isDispatchEvent_endClassbeginShowLocalStream = false ;
        }else{
            ServiceTools.unpublishAllMediaStream();
            ServiceSignalling.delmsgTo__AllAll();//清除所有信令消息
            eventObjectDefine.CoreController.dispatchEvent({type:'revertToStartupLayout'}); //触发恢复原始界面的事件
            isDispatchEvent_endClassbeginShowLocalStream = true ;
        }
        return isDispatchEvent_endClassbeginShowLocalStream ;
    };
};
const  RoomHandlerInstance = new RoomHandler() ;
RoomHandlerInstance.addEventListenerToRoomHandler();
export default RoomHandlerInstance ;