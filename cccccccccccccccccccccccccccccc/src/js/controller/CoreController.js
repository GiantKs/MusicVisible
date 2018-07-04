/**
 * UI-总控制中心
 * @module CoreController
 * @description  用于控制页面组件的通信
 * @author QiuShao
 * @date 2017/7/5
 */
'use strict';
import eventObjectDefine from 'eventObjectDefine';
//import $ from 'jquery';
import StreamHandler from 'StreamHandler';
import RoomHandler from 'RoomHandler';
import RoleHandler from 'RoleHandler';
import TkConstant from 'TkConstant';
import TkGlobal from 'TkGlobal';
import TkUtils from 'TkUtils';
import TkAppPermissions from 'TkAppPermissions';
import ServiceTools from  'ServiceTools' ;
import ServiceRoom from  'ServiceRoom' ;
import handlerCoreController from  './handlerCoreController' ;
import handlerIframeMessage from  './handlerIframeMessage' ;
import ServiceTooltip from 'ServiceTooltip';


const coreController = TK.EventDispatcher( {} ) ;
eventObjectDefine.CoreController = coreController ;
coreController.handler = {};
/*加载系统所需的信息
* @method loadSystemRequiredInfo*/
coreController.handler.loadSystemRequiredInfo = () => {
    /*禁止浏览器右键*/
    // document.oncontextmenu = null ;
    // document.oncontextmenu = function() {return false;};

    window.onbeforeunload = null ;
    window.onbeforeunload = function () { //onbeforeunload 事件在即将离开当前页面（刷新或关闭）时触发
        /*function res() {
            let r = confirm("Press a button")
            if (r === true) {
                if(ServiceRoom.getTkRoom()){
                    ServiceRoom.getTkRoom().leaveroom();
                }
            } else {

            }
        }
        return res();*/
        // return confirm("Press a button");
        //2018-01-16 修改客户端关闭按钮
        /*if(ServiceRoom.getTkRoom()){
            //ServiceRoom.getTkRoom().stopStreamTracksFromDefaultStream();
            if(TkGlobal.isBroadcast && TkGlobal.isClient)
                ServiceTooltip.showConfirm(TkGlobal.language.languageData.alertWin.messageWin.winMessageText.classBeginEnd.text , function (answer) {
                    if(answer){
                //        if( !CoreController.handler.getAppPermissions('endClassBegin') ){return ;}
                        WebAjaxInterface.roomOver(); //发送下课信令
                        ServiceRoom.getTkRoom().stopBroadcast();
                        ServiceSignalling.delmsgTo__AllAll();//清除所有信令消息
                        eventObjectDefine.CoreController.dispatchEvent({type:'revertToStartupLayout'}); //触发恢复原始界面的事件
                        ServiceRoom.getTkRoom().leaveroom();

                        ServiceRoom.getTkRoom().closeWindow();
                   }
                });
        }*/

    };

    /*todo 禁止选中文字（暂时去掉）*/
  /*  $(document).off("selectstart");
    $(document).bind("selectstart", function () { return true; });*/

    if(TK.tkLogPrintConfig){
        //DEBUG = 0, TRACE = 1, INFO = 2, WARNING = 3, ERROR = 4, NONE = 5,
        if( TkConstant.DEV ){ //开发模式
            let socketLogConfig = {
                debug:true ,
            } , loggerConfig = {
                development:true ,
                logLevel:TkConstant.LOGLEVEL.DEBUG ,
            }, adpConfig = {
                webrtcLogDebug:true
            };
            TK.tkLogPrintConfig( socketLogConfig , loggerConfig , adpConfig );
        }else{//发布模式
            let socketLogConfig = {
                debug:false ,
            } , loggerConfig = {
                development:false ,
                logLevel:TkConstant.LOGLEVEL.INFO ,
            }, adpConfig = {
                webrtcLogDebug:false
            };
            TK.tkLogPrintConfig( socketLogConfig , loggerConfig , adpConfig );
        }
    }

    ServiceTools.getAppLanguageInfo(function (languageInfo) { //加载语言包
        TkGlobal.language = languageInfo ;
    });
    handlerCoreController.setPageStyleByDomain();//根据公司domain决定加载的页面样式布局*
     //初始化
    if( TK.Initialize ){
        //TK.Initialize( TkGlobal.isBroadcastClient );//xueln 添加
        TK.Initialize( TkGlobal.isClient );//xiagd 17-10-17
    }
    //if( !ServiceRoom.getTkRoom() ){
        ServiceRoom.setTkRoom(TK.Room()) ;

        if(TkConstant.SERVICEINFO.protocol === 'http' && !TkGlobal.isClient && TkGlobal.isBroadcast){ //xgd 2017-11-15
             ServiceRoom.getTkRoom().updateProtocol('http://');
        }

        RoomHandler.registerEventToRoom();
        if(!(TkGlobal.isClient || TkGlobal.isBroadcast || TkGlobal.playback) ){
            if(ServiceRoom.getTkRoom().addOndevicechange){
                ServiceRoom.getTkRoom().addOndevicechange();
            }
        }

    //}
};

/*执行checkroom*/
coreController.handler.checkRoom = (callback) => {
    let checkroomEventData = {
        type:TkConstant.EVENTTYPE.OtherEvent.checkRoom ,
        message:{checkMeetingAterCallback:callback}
    };
    eventObjectDefine.CoreController.dispatchEvent(checkroomEventData);
};
/*执行joinroom*/
coreController.handler.joinRoom = () => {
    let joinroomEventData = {
        type:TkConstant.EVENTTYPE.OtherEvent.joinRoom ,
        message:{}
    };
    eventObjectDefine.CoreController.dispatchEvent(joinroomEventData);
};

/*执行initPlaybackInfo*/
coreController.handler.initPlaybackInfo = () => {
    if(!TkGlobal.playback){L.Logger.error('No playback environment!');return;} ;
    let initPlaybackInfoEventData = {
        type:TkConstant.EVENTTYPE.OtherEvent.initPlaybackInfo ,
        message:{}
    };
    eventObjectDefine.CoreController.dispatchEvent(initPlaybackInfoEventData);
};


/*核心控制器操控系统权限-更新和获取以及初始化权限*/
coreController.handler.setAppPermissions = ( appPermissionsKey ,appPermissionsValue )=> {
    TkAppPermissions.setAppPermissions(appPermissionsKey ,appPermissionsValue);
};
coreController.handler.getAppPermissions = ( appPermissionsKey  )=> {
   return TkAppPermissions.getAppPermissions(appPermissionsKey );
};
coreController.handler.initAppPermissions = ( initAppPermissionsJson)=> {
    TkAppPermissions.initAppPermissions(initAppPermissionsJson);
};
coreController.handler.checkRoleConflict = (user , isEvictUser) => {
    if(TkGlobal.isDisconnected) //断网重连 2018-01-15 xgd
        return false;
    return RoleHandler.checkRoleConflict(user , isEvictUser);
};
coreController.handler.handlerOnMessage = (event) => {
    return handlerIframeMessage.handlerOnMessage(event);
};
coreController.handler.addEventListenerOnCoreController = () => {
    handlerIframeMessage.addEventListener();
    $(window).off("resize");
    $(window).resize(function () { //窗口resize事件监听
        let defalutFontSize = window.innerWidth / TkConstant.STANDARDSIZE ;  //5rem = defalutFontSize*'5px' ;
        let rootElement = document.getElementById('all_root') ||  document.getElementsByTagName('html') ;
        if(rootElement){
            let rootEle = TkUtils.isArray(rootElement) ? rootElement[0] : rootElement ;
            if(rootEle && rootEle.style){
                rootEle.style.fontSize = defalutFontSize+ 'px';
            }
        }
        eventObjectDefine.Window.dispatchEvent({ type:TkConstant.EVENTTYPE.WindowEvent.onResize , message:{defalutFontSize:defalutFontSize} });
    });
    $(window).resize();

    let {hidden, state, visibilityChange} = TkUtils.handleVisibilityChangeCompatibility();
    /*监听浏览器窗口是否可见（最小化）*/
    document.addEventListener(visibilityChange, function() {
        if (document[state] === 'visible') {
            setTimeout(()=> {
                let defalutFontSize = window.innerWidth / TkConstant.STANDARDSIZE ;
                eventObjectDefine.Window.dispatchEvent({ type:TkConstant.EVENTTYPE.WindowEvent.onResize , message:{defalutFontSize:defalutFontSize} });
            },50);
        }
    }, false);

    /*接收IFrame框架的消息*/
    const _eventHandler_windowMessage = (event) => {
        if(coreController.handler.handlerOnMessage){
            let isReturn =  coreController.handler.handlerOnMessage(event);
            if(isReturn){
                return ;
            }
        }
        eventObjectDefine.Window.dispatchEvent({ type:TkConstant.EVENTTYPE.WindowEvent.onMessage , message:{event:event} });
    };
    TkUtils.tool.removeEvent(window ,'message' , _eventHandler_windowMessage ) ;
    TkUtils.tool.addEvent(window ,'message' , _eventHandler_windowMessage , false  ); //给当前window建立message监听函数


    $(document).off("keydown");
    $(document).keydown(function(event){
        event = event || window.event ;
        eventObjectDefine.Document.dispatchEvent({ type:TkConstant.EVENTTYPE.DocumentEvent.onKeydown , message:{keyCode:event.keyCode} });
    });

    const _eventHandler_addFullscreenchange = (event) => {
        eventObjectDefine.CoreController.dispatchEvent({type:'resizeHandler'});
        eventObjectDefine.Document.dispatchEvent({ type:TkConstant.EVENTTYPE.DocumentEvent.onFullscreenchange , message:{event:event} });
    };
    TkUtils.tool.removeFullscreenchange(_eventHandler_addFullscreenchange);
    TkUtils.tool.addFullscreenchange( _eventHandler_addFullscreenchange ) ;
    
    /*checkroom事件*/
    eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.OtherEvent.checkRoom , function (checkRoomEventData) {
        let {checkroomServiceUrl, checkroomServicePort, checkMeetingAterCallback  } = checkRoomEventData.message || {} ;
        RoomHandler.checkroom(checkroomServiceUrl, checkroomServicePort, checkMeetingAterCallback  );
    });
    /*joinroom事件*/
    eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.OtherEvent.joinRoom , function () {
        RoomHandler.registerRoom();//进入房间
    });

    /*checkroom事件*/
    eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.OtherEvent.initPlaybackInfo , function (initPlaybackInfoEventData) {
        if(!TkGlobal.playback){L.Logger.error('No playback environment!');return;} ;
        let {initPlaybackInfoServiceUrl, initPlaybackInfoServicePort, initPlaybackInfoAterCallback  } = initPlaybackInfoEventData.message ;
        RoomHandler.initPlaybackInfo(initPlaybackInfoServiceUrl, initPlaybackInfoServicePort, initPlaybackInfoAterCallback  );
    });

};
coreController.handler.addEventListenerOnCoreController();

export default coreController ;
