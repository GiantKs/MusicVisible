/**
 * TK全局变量类
 * @class TkGlobal
 * @description   提供 TK系统所需的全局变量
 * @author QiuShao
 * @date 2017/7/21
 */
'use strict';
import TkUtils from 'TkUtils';
import eventObjectDefine from 'eventObjectDefine';

window.GLOBAL = window.GLOBAL || {} ;
const TkGlobal = window.GLOBAL ;
TkGlobal.participantGiftNumberJson = TkGlobal.participantGiftNumberJson || {} ; //参与者拥有没有存储到参与者属性的礼物个数Json集合（注：没有存储到参与者属性中的礼物）
TkGlobal.classBegin = false ; //是否已经上课
TkGlobal.endClassBegin = false ; //结束上课
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
let endtype = TkUtils.getUrlParams("endtype") !=="" ? Number( TkUtils.getUrlParams('endtype') ) : TkUtils.getUrlParams('endtype') ;
TkGlobal.isClient = (endtype === 1 || endtype === 2); //是否客户端
TkGlobal.isMacClient = endtype === 2 ;
TkGlobal.clientversion =   TkUtils.getUrlParams("clientversion") !=="" ? Number(TkUtils.getUrlParams('clientversion') ) : TkUtils.getUrlParams('clientversion') ; //客户端的版本
TkGlobal.isBroadcast = ( TkUtils.getUrlParams("roomtype") !== "" ?  Number( TkUtils.getUrlParams('roomtype') ) : TkUtils.getUrlParams('roomtype') ) === 10 ; //是否直播
let browserInfo = TkUtils.getBrowserInfo();
TkGlobal.isMobile = browserInfo.versions.mobile || browserInfo.versions.ios || browserInfo.versions.android ||  browserInfo.versions.iPhone || browserInfo.versions.iPad; //是否是移动端
L.Logger.info("浏览器 browserInfo:" +JSON.stringify(browserInfo) , ' isClient is '+TkGlobal.isClient+'  , isBroadcast is '+TkGlobal.isBroadcast + ' , isMobile is '+TkGlobal.isMobile + ' , osType is' + TkGlobal.osType);
TkGlobal.isBroadcastClient =  TkGlobal.isClient && TkGlobal.isBroadcast ; //是否是直播且客户端
TkGlobal.isBroadcastMobile =  TkGlobal.isMobile && TkGlobal.isBroadcast ; //是否是直播且是移动端
// TkGlobal.languageName = browserInfo.language && browserInfo.language.toLowerCase().match(/zh/g) ? (browserInfo.language.toLowerCase().match(/tw/g) ? 'complex':  'chinese' ): 'english' ;
TkGlobal.languageName = browserInfo.language && browserInfo.language.toLowerCase().match(/zh/g) ?  'chinese' : 'english' ;
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
TkGlobal.systemStyleJson = {} ;
TkGlobal.dragRange = {left:0 , top:0};
TkGlobal.windowInnerWidth = window.innerWidth  ;
TkGlobal.windowInnerHeight = window.innerHeight ;
TkGlobal.loadModuleJson = {
    LeftToolBarVesselSmart:true ,
};
TkGlobal.doubleScreen = false; //是否是多屏幕 bobo的
TkGlobal.showRemoteRemindContent = false ;  //是否显示远程提示内容
TkGlobal.playbackControllerHeight = '0rem' ;
TkGlobal.mainContainerFull = false ; //主体区域是否全屏
TkGlobal.isVideoInFullscreen = false ; //是否处于画中画（课件全屏video在右下角）
TkGlobal.localRecording = false ; //正在本地录制
TkGlobal.selectedRecord = false ; //是否选中本地录制
TkGlobal.localRecordPath = "" ; //正在本地文件保存路径
export  default TkGlobal ;
