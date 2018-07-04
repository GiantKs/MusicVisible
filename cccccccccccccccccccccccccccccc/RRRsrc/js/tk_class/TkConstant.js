/**
 * TK常量类
 * @class TkConstant
 * @description   提供 TK系统所需的常量
 * @author QiuShao
 * @date 2017/7/21
 */
'use strict';
import TkUtils from 'TkUtils';
import eventObjectDefine from 'eventObjectDefine';
import TkGlobal from 'TkGlobal';

const TkConstant = {} ;
/*版本号*/
let VERSIONS  =  'v2.1.4' , VERSIONSTIME = '2018010721' ,  DEV = false ;
try{
    VERSIONS = __VERSIONS__ ;
    VERSIONSTIME = __VERSIONSTIME__ ;
    DEV =  __DEV__ ;
}catch (e){
    L.Logger.warning('There is no configuration version number and version time[__VERSIONS__ , __VERSIONSTIME__]!');
    L.Logger.warning('There is no configuration dev mark[__DEV__]!');
}
TkConstant.VERSIONS = VERSIONS ; //系统版本号
TkConstant.VERSIONSTIME = VERSIONSTIME ; //系统版本号更新时间
TkConstant.newpptVersions = 2017091401 ; //动态ppt的版本
TkConstant.remoteNewpptUpdateTime = 2018010721 ; //远程动态PPT文件更新时间
TkConstant.debugFromAddress = TkUtils.getUrlParams('debug') ? TkUtils.getUrlParams('debug') != "" : false  ; //从地址栏设置系统为debug状态
TkConstant.DEV = DEV ||  TkConstant.debugFromAddress; //系统是否处于开发者状态
/*角色对象*/
TkConstant.role = {};
Object.defineProperties(TkConstant.role, {
    //0：主讲  1：助教    2: 学员   3：直播用户 4:巡检员　10:系统管理员　11:企业管理员　12:管理员 , -1:回放者
    roleChairman: {
        value: 0,
        writable: false,
    },
    roleTeachingAssistant: {
        value: 1,
        writable: false,
    },
    roleStudent: {
        value: 2,
        writable: false,
    },
    roleAudit: {
        value: 3,
        writable: false,
    },
    rolePatrol: {
        value: 4,
        writable: false,
    },
    rolePlayback:{
        value: -1,
        writable: false,
    }
});

const RoomEvent = {};//房间事件
Object.defineProperties(RoomEvent, {
    roomConnected: { //room-connected 房间连接事件
        value: 'room-connected',
        writable: false,
        enumerable: true,
    },
    roomParticipantJoin: { //room-participant_join 参与者加入房间事件
        value: 'room-participant_join',
        writable: false,
        enumerable: true,
    },
    roomParticipantLeave: {  //room-participant_leave  参与者离开房间事件
        value: 'room-participant_leave',
        writable: false,
        enumerable: true,
    },
    roomParticipantEvicted: {  //room-participant_evicted 参与者被踢事件
        value: 'room-participant_evicted',
        writable: false,
        enumerable: true,
    },
    roomTextMessage: { //	room-text-message 聊天消息事件
        value: 'room-text-message',
        writable: false,
        enumerable: true,
    },
    roomPubmsg: {  //room-pubmsg pubMsg消息事件
        value: 'room-pubmsg',
        writable: false,
        enumerable: true,
    },
    roomDelmsg: {  //room-delmsg delMsg消息事件
        value: 'room-delmsg',
        writable: false,
        enumerable: true,
    },
    roomUserpropertyChanged: {  //room-userproperty-changed setProperty消息事件
        value: 'room-userproperty-changed',
        writable: false,
        enumerable: true,
    },
    roomRemotemsg: {  //room-remotemsg
        value: 'room-remotemsg',
        writable: false,
        enumerable: true,
    },
    roomFiles: {  //room-files 房间文件消息事件
        value: 'room-files',
        writable: false,
        enumerable: true,
    },
    roomError: {  //room-error 房间出现错误消息事件
        value: 'room-error',
        writable: false,
        enumerable: true,
    },
    roomDisconnected: {  // room-disconnected 房间失去连接事件
        value: 'room-disconnected',
        writable: false,
        enumerable: true,
    },
    roomReconnected: {  //room-reconnected：重新连接房间成功事件
        value: 'room-reconnected',
        writable: false,
        enumerable: true,
    },
    roomReconnecting: {  // room-reconnecting 房间正在连接事件
        value: 'room-reconnecting',
        writable: false,
        enumerable: true,
    },
    roomLeaveroom: {  //room-leaveroom：重新连接房间成功事件
        value: 'room-leaveroom',
        writable: false,
        enumerable: true,
    },
    roomMsglistFromConnected: {  //room-msglist：房间房间连接成功的msglist事件
        value: 'room-msglist-from-connected',
        writable: false,
        enumerable: true,
    },
   /* roomMsglist: {  //room-msglist：房间信令msglist事件
        value: 'room-msglist',
        writable: false,
        enumerable: true,
    },*/
    roomPlaybackClearAll:{//room-playback-clear_all：回放清除所有信令生成的数据
        value: 'room-playback-clear_all',
        writable: false,
        enumerable: true,
    },
    roomPlaybackDuration:{//room-playback-duration：回放的开始和结束时间
        value: 'room-playback-duration',
        writable: false,
        enumerable: true,
    },
    roomPlaybackPlaybackEnd:{//room-playback-playbackEnd：服务器回放播放结束，收到的通知消息
        value: 'room-playback-playbackEnd',
        writable: false,
        enumerable: true,
    },
    roomPlaybackPlaybackUpdatetime:{//room-playback-playback_updatetime：服务器回放的播放时间更新
        value: 'room-playback-playback_updatetime',
        writable: false,
        enumerable: true,
    },
    bandwidthAlert: {  //bandwidth-alert： 宽带警报
        value: 'bandwidth-alert',
        writable: false,
        enumerable: true,
    },

    streamRemoved: {  //stream-removed 数据流移除事件
        value: 'stream-removed',
        writable: false,
        enumerable: true,
    },
    streamAdded: { //stream-added 数据流添加事件
        value: 'stream-added',
        writable: false,
        enumerable: true,
    },
    streamFailed: {  //stream-failed 数据流失败事件
        value: 'stream-failed',
        writable: false,
        enumerable: true,
    },
    streamSubscribed:{  //stream-subscribed 数据流订阅事件
        value: 'stream-subscribed',
        writable: false,
        enumerable: true,
    },
    streamData: {  //stream-data
        value: 'stream-data',
        writable: false,
        enumerable: true,
    },
    streamAttributesUpdate: { //stream-attributes-update 数据流属性更新事件
        value: 'stream-attributes-update',
        writable: false,
        enumerable: true,
    },
    streamPublishFail: {  //stream-publish-fail: 发布失败
        value: 'stream-publish-fail',
        writable: false,
        enumerable: true,
    },
    streamUnpublishFail: { //stream-unpublish-fail: 取消发布失败
        value: 'stream-unpublish-fail',
        writable: false,
        enumerable: true,
    },
    streamRtcStatsFailed: { //stream-rtcStats-failed: 网络状态获取失败
        value: 'stream-rtcStats-failed',
        writable: false,
        enumerable: true,
    },
    streamRtcStats: { //stream-rtcStats: 网络状态获取
        value: 'stream-rtcStats',
        writable: false,
        enumerable: true,
    },
    streamReconnectionFailed:{ //stream-reconnection-failed:数据流重连失败
        value: 'stream-reconnection-failed',
        writable: false,
        enumerable: true,
    },
    streamUnpublishNotBelongRemoteStreams:{ //stream-unpublish-not-belong-remoteStreams:取消发布但是流没有添加的时候
        value: 'stream-unpublish-not-belong-remoteStreams',
        writable: false,
        enumerable: true,
    },

    //聊天音视频流
    streamRemoved_video: {  //stream-removed 数据流移除事件(video流)
        value: 'stream-removed_video',
        writable: false,
        enumerable: true,
    },
    streamAdded_video: { //stream-added 数据流添加事件(video流)
        value: 'stream-added_video',
        writable: false,
        enumerable: true,
    },
/*    streamFailed_video: {  //stream-failed 数据流失败事件(video流)
        value: 'stream-failed_video',
        writable: false,
        enumerable: true,
    },*/
    streamSubscribed_video:{  //stream-subscribed 数据流订阅事件(video流)
        value: 'stream-subscribed_video',
        writable: false,
        enumerable: true,
    },
    streamData_video: {  //stream-data(video流)
        value: 'stream-data_video',
        writable: false,
        enumerable: true,
    },
    streamAttributesUpdate_video: { //stream-attributes-update 数据流属性更新事件(video流)
        value: 'stream-attributes-update_video',
        writable: false,
        enumerable: true,
    },
    streamPublishFail_video: {  //stream-publish-fail: 发布失败(video流)
        value: 'stream-publish-fail_video',
        writable: false,
        enumerable: true,
    },
    streamUnpublishFail_video: { //stream-unpublish-fail: 取消发布失败(video流)
        value: 'stream-unpublish-fail_video',
        writable: false,
        enumerable: true,
    },
    streamReconnectionFailed_video:{ //
        value: 'stream-reconnection-failed_video',
        writable: false,
        enumerable: true,
    },
   streamRtcStatsFailed_video: { //stream-rtcStats-failed: 网络状态获取失败(video流)
        value: 'stream-rtcStats-failed_video',
        writable: false,
        enumerable: true,
    },
    streamRtcStats_video: { //stream-rtcStats: 网络状态获取(video流)
        value: 'stream-rtcStats_video',
        writable: false,
        enumerable: true,
    },

    //媒体文件音视频流
    streamRemoved_media: {  //stream-removed 数据流移除事件(media流)
        value: 'stream-removed_media',
        writable: false,
        enumerable: true,
    },
    streamAdded_media: { //stream-added 数据流添加事件(media流)
        value: 'stream-added_media',
        writable: false,
        enumerable: true,
    },
    streamFailed_media: {  //stream-failed 数据流失败事件(media流)
        value: 'stream-failed_media',
        writable: false,
        enumerable: true,
    },
    streamSubscribed_media:{  //stream-subscribed 数据流订阅事件(media流)
        value: 'stream-subscribed_media',
        writable: false,
        enumerable: true,
    },
    streamData_media: {  //stream-data(media流)
        value: 'stream-data_media',
        writable: false,
        enumerable: true,
    },
    streamAttributesUpdate_media: { //stream-attributes-update 数据流属性更新事件(media流)
        value: 'stream-attributes-update_media',
        writable: false,
        enumerable: true,
    },
    streamPublishFail_media: {  //stream-publish-fail: 发布失败(media流)
        value: 'stream-publish-fail_media',
        writable: false,
        enumerable: true,
    },
    streamUnpublishFail_media: { //stream-unpublish-fail: 取消发布失败(media流)
        value: 'stream-unpublish-fail_media',
        writable: false,
        enumerable: true,
    },
    streamReconnectionFailed_media:{ //stream-reconnection-failed:数据流重连失败
        value: 'stream-reconnection-failed_media',
        writable: false,
        enumerable: true,
    },

    //屏幕贡献音视频流
    streamRemoved_screen: {  //stream-removed 数据流移除事件(screen流)
        value: 'stream-removed_screen',
        writable: false,
        enumerable: true,
    },
    streamAdded_screen: { //stream-added 数据流添加事件(screen流)
        value: 'stream-added_screen',
        writable: false,
        enumerable: true,
    },
    streamFailed_screen: {  //stream-failed 数据流失败事件(screen流)
        value: 'stream-failed_screen',
        writable: false,
        enumerable: true,
    },
    streamSubscribed_screen:{  //stream-subscribed 数据流订阅事件(screen流)
        value: 'stream-subscribed_screen',
        writable: false,
        enumerable: true,
    },
    streamData_screen: {  //stream-data(screen流)
        value: 'stream-data_screen',
        writable: false,
        enumerable: true,
    },
    streamAttributesUpdate_screen: { //stream-attributes-update 数据流属性更新事件(screen流)
        value: 'stream-attributes-update_screen',
        writable: false,
        enumerable: true,
    },
    streamPublishFail_screen: {  //stream-publish-fail: 发布失败(screen流)
        value: 'stream-publish-fail_screen',
        writable: false,
        enumerable: true,
    },
    streamUnpublishFail_screen: { //stream-unpublish-fail: 取消发布失败(screen流)
        value: 'stream-unpublish-fail_screen',
        writable: false,
        enumerable: true,
    },
    streamReconnectionFailed_screen:{ //stream-reconnection-failed:数据流重连失败
        value: 'stream-reconnection-failed_screen',
        writable: false,
        enumerable: true,
    },

    roomPlaybackClearAllFromPlaybackController:{//room-playback-clear_all-from-playback-controller：回放清除所有信令生成的数据(来自于回放控制器触发)
        value: 'room-playback-clear_all-from-playback-controller',
        writable: false,
        enumerable: true,
    },
    getUserMediaSuccess:{//getUserMedia_success：getUserMeida成功的事件通知
        value: 'getUserMedia_success',
        writable: false,
        enumerable: true,
    },
    getUserMediaFailure:{//getUserMedia_failure：getUserMeida失败的事件通知
        value: 'getUserMedia_failure',
        writable: false,
        enumerable: true,
    },
    getUserMediaFailure_reGetOnlyAudioStream:{//getUserMedia_failure_reGetOnlyAudioStream：getUserMeida失败的事件通知(再次获取只有音频的流)
        value: 'getUserMedia_failure_reGetOnlyAudioStream',
        writable: false,
        enumerable: true,
    },
    deviceChange:{ //deviceChange 设备改变时候的事件通知
        value: 'device_change',
        writable: false,
        enumerable: true,
    },
    addDeviceChangeListener:{ //addDeviceChangeListener 添加设备改变事件的通知
        value: 'add_device_change_listener',
        writable: false,
        enumerable: true,
    },
    removeDeviceChangeListener:{ //removeDeviceChangeListener 移除设备改变事件的通知
        value: 'remove_device_change_listener',
        writable: false,
        enumerable: true,
    },
    roomUpdateWebAddressInfo:{ //roomUpdateWebAddressInfo 更新服务器地址信息
        value: 'room-updateWebAddressInfo',
        writable: false,
        enumerable: true,
    },
});
const StreamEvent = {};//数据流事件
Object.defineProperties(StreamEvent, {
    accessAccepted: { //getUserMedia 接受（成功）---access-accepted事件
        value: 'access-accepted',
        writable: false,
        enumerable: true,
    },
    accessDenied: {  //getUserMedia 拒绝（失败）--- access-denied事件
        value: 'access-denied',
        writable: false,
        enumerable: true,
    },
    streamEnded: {  //track结束（通过track的onended事件监听来触发）--- stream-ended事件
        value: 'stream-ended',
        writable: false,
    },
});
const WindowEvent = {};//window事件
Object.defineProperties(WindowEvent, {
    onResize: { //onResize 窗口改变事件
        value: 'onResize',
        writable: false,
    },
    onMessage: { //message
        value: 'onMessage',
        writable: false,
    },
    onBeforeUnload: { //onBeforeUnload 浏览器离开事件
        value: 'onBeforeUnload',
        writable: false,
    },
});


const DocumentEvent = {};//document事件
Object.defineProperties(DocumentEvent, {
    onKeydown: { //onKeydown 键盘按下事件
        value: 'onKeydown',
        writable: false,
    },
    onFullscreenchange:{ //onFullscreenchange 全屏状态改变事件
        value: 'onFullscreenchange',
        writable: false,
    }
});
const WebDaoEvent = {};//web接口操作事件
Object.defineProperties(WebDaoEvent, {
    getGiftInfo: { //获取礼物接口后触发的事件
        value: 'get-gift-info',
        writable: false,
        enumerable: true,
    },
    sendGift: { //发送礼物接口后触发的事件
        value: 'send-gift',
        writable: false,
        enumerable: true,
    },
    roomStart: { //上课发送的web接口roomstart后触发的事件
        value: 'room-start',
        writable: false,
        enumerable: true,
    },
    roomOver: { //下课发送的web接口roomover后触发的事件
        value: 'room-over',
        writable: false,
        enumerable: true,
    },
});
const OtherEvent = {};//其它事件
Object.defineProperties(OtherEvent, {
    checkRoom: { //check-room: 检测满足进入房间的事件
        value: 'check-room',
        writable: false,
    },
    joinRoom: { //join-room: 进入房间
        value: 'join-room',
        writable: false,
    },
    initPlaybackInfo: { //init-playback-info:初始化回放数据
        value: 'init-playback-info',
        writable: false,
    },
    initSystemStyleJson:{
        value: 'init-system-style-json',
        writable: false,
    },
    updateSystemStyleJson:{
        value: 'update-system-style-json',
        writable: false,
    },
});

/*事件类型*/
TkConstant.EVENTTYPE = {};
Object.defineProperties(TkConstant.EVENTTYPE, {
    RoomEvent:{
        value: RoomEvent,
        writable: false,
    },
    StreamEvent:{
        value: StreamEvent,
        writable: false,
    },
    WindowEvent:{
        value: WindowEvent,
        writable: false,
    },
    DocumentEvent:{
        value: DocumentEvent,
        writable: false,
    },
    WebDaoEvent:{
        value: WebDaoEvent,
        writable: false,
    },
    OtherEvent:{
        value: OtherEvent,
        writable: false,
    }
});

/*房间类型*/
TkConstant.ROOMTYPE = {};
Object.defineProperties(TkConstant.ROOMTYPE, {
    //1：1 ， 1：6 ， 1：多 , 大讲堂（直播）
    oneToOne: { //1对1
        value: 0,
        writable: false,
    },
  /*  oneToSix: {//1对6
        value: 1,
        writable: false,
    },
    oneToMore: { //1对多
        value: 3,
        writable: false,
    },
    liveBroadcast: { // 大讲堂（直播）
        value: 10,
        writable: false,
    }*/
});

/*服务器信息*/
TkConstant.SERVICEINFO = {};
TkConstant.bindServiceinfoToTkConstant = (protocol , hostname , port , isInit=true )=>{
    protocol = protocol ||  window.location.protocol?window.location.protocol.replace(/:/g,""):"https" ;
    hostname = hostname ||  TkUtils.getUrlParams("host") ||  window.location.hostname ;
    port = port || (protocol === 'http') ? 80 : 443 ;
    let serviceinfo = {
        protocol:protocol ,
        hostname:hostname ,
        port:port,
        sdkPort:443 ,
        protocolAndHostname: protocol+"://"+hostname,
        address:protocol+"://"+hostname+":"+port,
    };
    if(isInit){
        serviceinfo.joinUrl = TkUtils.encrypt( window.location.href ) ;
    }
    Object.customAssign(TkConstant.SERVICEINFO , serviceinfo ) ;
    if(isInit){
        console.info('encrypt_tk_info:\n' ,TkConstant.SERVICEINFO.joinUrl);
    }
    if(eventObjectDefine && eventObjectDefine.CoreController && eventObjectDefine.CoreController.dispatchEvent){
        eventObjectDefine.CoreController.dispatchEvent({type:"bindServiceinfoToTkConstant" , message:{SERVICEINFO:TkConstant.SERVICEINFO}});
    }
};
TkConstant.bindServiceinfoToTkConstant();

/*发布状态*/
TkConstant.PUBLISHSTATE = {};
Object.defineProperties(TkConstant.PUBLISHSTATE  , {
    PUBLISH_STATE_NONE: {
        value: TK.PUBLISH_STATE_NONE , //下台,
        writable: false,
    },
    PUBLISH_STATE_AUDIOONLY: {
        value: TK.PUBLISH_STATE_AUDIOONLY , //只发布音频,
        writable: false,
    },
    PUBLISH_STATE_VIDEOONLY: {
        value: TK.PUBLISH_STATE_VIDEOONLY , //只发布视频,
        writable: false,
    },
    PUBLISH_STATE_BOTH: {
        value: TK.PUBLISH_STATE_BOTH , //音视频都发布,
        writable: false,
    },
    PUBLISH_STATE_MUTEALL: {
        value: TK.PUBLISH_STATE_MUTEALL , //音视频都关闭,
        writable: false,
    },
});

/*rem 基准大小*/
TkConstant.STANDARDSIZE = TkGlobal.isBroadcastMobile ?  3.75 : 19.2 ;


/*上传文件的类型*/
let documentFileListAccpetArr = ['xls','xlsx','ppt','pptx','doc','docx','txt','pdf','bmp','jpg','jpeg','png','gif'] ; //普通文件类型数组
let mediaFileListAccpetArr = ['mp3','mp4'] ; //媒体文件类型数组
let h5DocumentFileListAccpetArr = ['zip'] ; //H5文件类型数组  //xgd 2017-09-21
TkConstant.FILETYPE = {
    documentFileListAccpetArr:documentFileListAccpetArr ,
    mediaFileListAccpetArr:mediaFileListAccpetArr ,
    h5DocumentFileListAccpetArr:h5DocumentFileListAccpetArr ,           //xgd 2017-09-21
    documentFileListAccpet:"."+documentFileListAccpetArr.join(',.') ,
    mediaFileListAccpet:"."+mediaFileListAccpetArr.join(',.')  ,
    h5DocumentFileListAccpet:"."+h5DocumentFileListAccpetArr.join(',.') ,  //xgd 2017-09-21
};


/*输出日志等级*/
TkConstant.LOGLEVEL = {};
Object.defineProperties(TkConstant.LOGLEVEL  , {
    DEBUG: {
        value: 0 ,
        writable: false,
    },
    TRACE: {
        value: 1 ,
        writable: false,
    },
    INFO: {
        value: 2 ,
        writable: false,
    },
    WARNING: {
        value: 3 ,
        writable: false,
    },
    ERROR: {
        value: 4 ,
        writable: false,
    },
    NONE: {
        value: 5 ,
        writable: false,
    },
});

/*改变上传文件的类型*/
TkConstant.changeDocumentFileListAccpetArr = (addDocumentFileType , addMediaFileType  , addH5FileType )=> {
    if(addDocumentFileType){
        if( TkUtils.isArray(addDocumentFileType) ){
            for(let value of addDocumentFileType){
                documentFileListAccpetArr.push(value);
            }
        }else if( typeof addDocumentFileType === 'string'){
            documentFileListAccpetArr.push(addDocumentFileType)
        }
    }
    if(addMediaFileType){
        if( TkUtils.isArray(addMediaFileType) ){
            for(let value of addMediaFileType){
                mediaFileListAccpetArr.push(value);
            }
        }else if( typeof addMediaFileType === 'string'){
            mediaFileListAccpetArr.push(addMediaFileType)
        }
    }
    if(addH5FileType){
        if( TkUtils.isArray(addH5FileType) ){
            for(let value of addH5FileType){
                h5DocumentFileListAccpetArr.push(value);
            }
        }else if( typeof addH5FileType === 'string'){
            h5DocumentFileListAccpetArr.push(addH5FileType)
        }
    }
    TkConstant.FILETYPE = {
        documentFileListAccpetArr:documentFileListAccpetArr ,
        mediaFileListAccpetArr:mediaFileListAccpetArr ,
        h5DocumentFileListAccpetArr:h5DocumentFileListAccpetArr ,           //xgd 2017-09-21
        documentFileListAccpet:"."+documentFileListAccpetArr.join(',.') ,
        mediaFileListAccpet:"."+mediaFileListAccpetArr.join(',.')  ,
        h5DocumentFileListAccpet:"."+h5DocumentFileListAccpetArr.join(',.') ,  //xgd 2017-09-21
    };
    eventObjectDefine.CoreController.dispatchEvent({type:'changeDocumentFileListAccpetArr'}) ;
};

/*绑定房间信息到TkConstant*/
TkConstant.joinRoomInfo = {} ;
TkConstant.bindRoomInfoToTkConstant = (joinRoomInfo)=>{
    if(!joinRoomInfo){L.Logger.error('joinRoomInfo is not exist!');return ;};
    L.Logger.debug('joinRoomInfo:' , joinRoomInfo);
    TkConstant.joinRoomInfo = joinRoomInfo ;
    eventObjectDefine.CoreController.dispatchEvent({type:"bindRoomInfoToTkConstant" , message:{joinRoomInfo:TkConstant.joinRoomInfo}});
};

/*绑定当前登录对象事是否拥有指定角色到TkConstant
 * @method bindParticipantRoleToHasRole
 * @description  [TkConstant.joinRoomInfo:加入房间的信息 , ]*/
TkConstant.hasRole = {};
TkConstant.bindParticipantHasRoleToTkConstant = ()=> {
    if(!TkConstant.joinRoomInfo){L.Logger.error('TkConstant.joinRoomInfo is not exist!');return ;};
    Object.defineProperties( TkConstant.hasRole , {
        //0：主讲  1：助教    2: 学员   3：直播用户 4:巡检员　10:系统管理员　11:企业管理员　12:管理员 , -1:回放者
        roleChairman: {
            value:TkConstant.joinRoomInfo && TkConstant.joinRoomInfo.roomrole === TkConstant.role.roleChairman ,
            writable: false ,
        },
        roleTeachingAssistant: {
            value:TkConstant.joinRoomInfo &&  TkConstant.joinRoomInfo.roomrole === TkConstant.role.roleTeachingAssistant  ,
            writable: false ,
        },
        roleStudent: {
            value:TkConstant.joinRoomInfo &&  TkConstant.joinRoomInfo.roomrole === TkConstant.role.roleStudent ,
            writable: false ,
        },
        roleAudit:{
            value:TkConstant.joinRoomInfo &&  TkConstant.joinRoomInfo.roomrole === TkConstant.role.roleAudit ,
            writable: false ,
        } ,
        rolePatrol:{
            value:TkConstant.joinRoomInfo && TkConstant.joinRoomInfo.roomrole === TkConstant.role.rolePatrol ,
            writable: false ,
        } ,
        rolePlayback:{
            value:TkConstant.joinRoomInfo && TkConstant.joinRoomInfo.roomrole === TkConstant.role.rolePlayback ,
            writable: false ,
        } ,
    });
    eventObjectDefine.CoreController.dispatchEvent({type:"bindParticipantHasRoleToTkConstant" , message:{hasRole:TkConstant.hasRole}});
};

/*绑定当前登录对象事是否拥有指定教室到TkConstant*/
TkConstant.hasRoomtype = {};
TkConstant.bindParticipantHasRoomtypeTkConstant = ()=> {
    if(!TkConstant.joinRoomInfo){L.Logger.error('TkConstant.joinRoomInfo is not exist!');return ;};
    Object.defineProperties(TkConstant.hasRoomtype, {
        //1：1 ， 1：6 ， 1：多 , 大讲堂（直播）
        oneToOne: { //1对1
            value: TkConstant.joinRoomInfo && TkConstant.joinRoomInfo.roomtype === TkConstant.ROOMTYPE.oneToOne,
            writable: false,
        },
      /*  oneToSix: {//1对6
            value: TkConstant.joinRoomInfo && TkConstant.joinRoomInfo.roomtype === TkConstant.ROOMTYPE.oneToSix ,
            writable: false,
        },
        oneToMore: { //1对多
            value: TkConstant.joinRoomInfo && TkConstant.joinRoomInfo.roomtype === TkConstant.ROOMTYPE.oneToMore ,
            writable: false,
        },
        liveBroadcast: { // 大讲堂（直播）
            value: TkConstant.joinRoomInfo && TkConstant.joinRoomInfo.roomtype === TkConstant.ROOMTYPE.liveBroadcast,
            writable: false,
        }*/
    });
    eventObjectDefine.CoreController.dispatchEvent({type:"bindParticipantHasRoomtypeTkConstant" , message:{hasRoomtype:TkConstant.hasRoomtype}});
};

//tkpc2.0.8
/*数据流发布失败的信令StreamFailure的failuretype的值*/
TkConstant.streamFailureType = {};
Object.defineProperties(TkConstant.streamFailureType  , {//failuretype = 1 udp不通 2 publishvideo失败（除去人数超限） 3 人数超限 4 home键了 5 udp中途断掉 6 取消发布成功但是流不属于远程流
    udpNotOnceSuccess: {
        value: 1 ,
        writable: false,
    },
    publishvideoFailure_notOverrun: {
        value: 2 ,
        writable: false,
    },
    publishvideoFailure_overrun: {
        value: 3 ,
        writable: false,
    },
    mobileHome: {
        value: 4 ,
        writable: false,
    },
    udpMidwayDisconnected: {
        value: 5 ,
        writable: false,
    },
    unpublishStreamNotBelongremoteStreams:{
        value: 6,
        writable: false,
    },
});

//模板
TkConstant.template = 'template_default'  ; //模板(默认为template_default)
// TkConstant.testTemplate = undefined;
// TkConstant.testTemplate = 'template_default';
/*
     template_default:默认
     template_yinglianbang:英练邦
     template_zuoyewang30:一对30模板
     template_sharktop:鲨鱼公园的模板
     template_gogoxmas:gogotalk 的模板
*/
TkConstant.updateTemplate = (template)=>{
    let templateCopy = TkConstant.template ;
    TkConstant.template = template ;
    /*根据公司domain决定加载的页面样式布局
     * @method setPageStyleByDomain*/
    switch (TkConstant.template){
        case  'template_yinglianbang': //英练邦
            require('../../cssTemplate/icoachu.css') ;
            $(document.head).append('<link rel="shortcut icon" href='+ require('../../img/call_layout/logo/icu_logo_ico.png')+' type="image/png" />');
            break;
        default:
            break;
    };
    $(document.body).removeClass(templateCopy+" "+TkConstant.template).addClass(TkConstant.template).attr("tkcustomdatatemplate" , TkConstant.template );
    eventObjectDefine.CoreController.dispatchEvent({type:TkConstant.EVENTTYPE.OtherEvent.initSystemStyleJson });
    eventObjectDefine.CoreController.dispatchEvent({type:"updateTemplate" , message:{template:TkConstant.template}});
};

window.TkConstant = TkConstant ;
export  default TkConstant ;
