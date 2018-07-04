/**
 * TK全局变量类
 * @class TkGlobal
 * @description   提供 TK系统所需的全局变量
 * @author QiuShao
 * @date 2017/7/21
 */
'use strict';
import TkUtils from 'TkUtils';

window.GLOBAL = window.GLOBAL || {} ;
const TkGlobal = window.GLOBAL ;
TkGlobal.participantGiftNumberJson = TkGlobal.participantGiftNumberJson || {} ; //参与者拥有没有存储到参与者属性的礼物个数Json集合（注：没有存储到参与者属性中的礼物）
TkGlobal.classBegin = false ; //是否已经上课
TkGlobal.endClassBegin = false ; //结束上课
//TkGlobal.classState = 0 ; //上课状态    课前 => 0     课后 => 1 
TkGlobal.routeName = undefined ; //路由的位置
TkGlobal.playback = false ; //是否回放
TkGlobal.isGetNetworkStatus = false ; //是否获取网络状态
TkGlobal.playPptVideoing = false ; //是否正在播放PPT视频
TkGlobal.playMediaFileing = false ; //是否正在播放媒体文件
TkGlobal.serviceTime = undefined ; //服务器的时间
TkGlobal.firstGetServiceTime = false ; //是否是第一次获取服务器的时间
TkGlobal.isHandleMsglist = false ; //是否已经处理msglist数据
TkGlobal.remindServiceTime = undefined ; //remind用的服务器的时间
TkGlobal.classBeginTime = undefined ; //上课的时间
TkGlobal.isSkipPageing = false ; //是否正在输入跳转页
TkGlobal.osType = TkUtils.detectOS(); //操作系统类型
TkGlobal.isClient =  ( TkUtils.getUrlParams("endtype") !="" ? Number(TkUtils.getUrlParams('endtype') ) : TkUtils.getUrlParams('endtype') ) == 1 || ( TkUtils.getUrlParams("endtype") !="" ? Number(TkUtils.getUrlParams('endtype') ) : TkUtils.getUrlParams('endtype') ) == 2 ; //是否客户端
TkGlobal.isMacClient = ( TkUtils.getUrlParams("endtype") !="" ? Number(TkUtils.getUrlParams('endtype') ) : TkUtils.getUrlParams('endtype') ) == 2 ;
TkGlobal.isBroadcast = ( TkUtils.getUrlParams("roomtype") != "" ?  Number( TkUtils.getUrlParams('roomtype') ) : TkUtils.getUrlParams('roomtype') ) == 10 || ( TkUtils.getUrlParams("type") != "" ?  Number( TkUtils.getUrlParams('type') ) : TkUtils.getUrlParams('type') ) == 10 ;//是否直播,type==10 直播回放
let browserInfo = TkUtils.getBrowserInfo();
TkGlobal.isMobile = browserInfo.versions.mobile || browserInfo.versions.ios || browserInfo.versions.android ||  browserInfo.versions.iPhone || browserInfo.versions.iPad; //是否是移动端
L.Logger.info("浏览器 browserInfo:" +JSON.stringify(browserInfo) , ' isClient is '+TkGlobal.isClient+'  , isBroadcast is '+TkGlobal.isBroadcast + ' , isMobile is '+TkGlobal.isMobile + ' , osType is' + TkGlobal.osType);
TkGlobal.isBroadcastClient =  TkGlobal.isClient && TkGlobal.isBroadcast ; //是否是直播且客户端
TkGlobal.isBroadcastMobile =  TkGlobal.isMobile && TkGlobal.isBroadcast ; //是否是直播且是移动端
TkGlobal.languageName = browserInfo.language && browserInfo.language.toLowerCase().match(/zh/g) ? (browserInfo.language.toLowerCase().match(/tw/g) ? 'complex':  'chinese' ): 'english' ;
TkGlobal.isVideoStretch = false;//是否是视频拉伸
TkGlobal.changeVideoSizeEventName = null;//鼠标移动触发事件的名字（视频拉伸中用到）
TkGlobal.changeVideoSizeMouseUpEventName = null;//鼠标抬起触发事件的名字（视频拉伸中用到）
TkGlobal.needDetectioned = undefined ; //是否进行了设备检测
TkGlobal.defaultFileInfo = {
    fileid:0,
    currpage:1 ,
    pagenum:1 ,
    filetype: 'whiteboard'  ,
    filename: 'whiteboard' ,
    swfpath: '' ,
    pptslide:1 ,
    pptstep:0,
    steptotal:0
} ; //默认的文件信息
TkGlobal.numAA=0;
TkGlobal.msglist = {//视频拖拽和视频拉伸和分屏的msglist保存的数据
    videoDragArray: null,
    videoChangeSize: null,
    VideoSplitScreenArray: null,
};
TkGlobal.isSplitScreen = false;

TkGlobal.liveTimeDelay = 0; //直播信令延时时间，默认为0; xgd 2017-11-29
TkGlobal.liveDelayCondition = '{"roomConnected":true,"roomParticipantJoin":true,"roomParticipantLeave":true,"roomParticipantEvicted":true,"roomTextMessage":true,"roomFiles":true,"roomError":true,"roomDisconnected":true,"roomReconnected":true,"roomReconnecting":true,"roomLeaveroom":true,"roomMsglist":true}'; //直播信令延时例外; xgd 2017-11-29
TkGlobal.liveDelayPubmsgCondition = '{"ClassBegin":true,"UpdateTime":true,"LiveNoticeBoard":true,"LiveNoticeInform":true,"LiveBroadcast":true,"LiveQuestions":true,"LiveAllNoTalking":true,"LiveEvictSpecificUser":true,"LiveLuckDraw":true,"LiveShareStream":true,"LiveCallRoll":true,"LiveSignIn":true,"LiveVote":true,"LiveVoteCommit":true,"getVoteCount":true,"getSICount":true}'; //直播信令延时例外; xgd 2017-12-22
TkGlobal.liveDelayDelmsgCondition = '{"ClassBegin":true,"LiveQuestions":true,"LiveAllNoTalking":true,"LiveLuckDraw":true,"LiveShareStream":true,"LiveCallRoll":true,"LiveSignIn":true,"LiveVote":true,"LiveVoteCommit":true,"getVoteCount":true,"getSICount":true}'; //直播信令延时例外; xgd 2017-12-22
TkGlobal.isLiveDelay = TkGlobal.isBroadcast && !TkGlobal.isClient; //直播是否延时; 老师不延时 xgd 2017-11-29

TkGlobal.isStartLuckdraw = false; //是否已经开始抽奖

TkGlobal.isDisconnected = false;
TkGlobal.liveVideoFile = TkUtils.getUrlParams('videofile') ;//直播录制视频地址
TkGlobal.liveRoom = undefined;//直播房间,回放用到



export  default TkGlobal ;
