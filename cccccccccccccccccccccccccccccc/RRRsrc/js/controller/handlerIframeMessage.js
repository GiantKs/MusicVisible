/**
 * UI-总控制中心处理Iframe消息类
 * @class HandlerIframeMessage
 * @description  用于总控制中心处理Iframe消息
 * @author WeiJin
 * @date 2017/09/05
 */

import eventObjectDefine from 'eventObjectDefine';
import TkConstant from 'TkConstant';
import ServiceSignalling from 'ServiceSignalling';

class HandlerIframeMessage{
    constructor(){
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
    };
    addEventListener(){
        const that = this ;
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPubmsg ,that.handlerRoomPubmsg.bind(that)  ,  that.listernerBackupid ) ;//room-pubmsg事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomConnected, that.handlerRoomConnected.bind(that)  , that.listernerBackupid ); //Room-Connected事件：房间连接事件
        eventObjectDefine.CoreController.addEventListener("outIframe-msglist" ,that.handlerOutIframeMsglist.bind(that)  ,  that.listernerBackupid );
    };

    removeEventListener(){
        eventObjectDefine.CoreController.removeBackupListerner(this.listernerBackupid);
    };

    handlerRoomPubmsg(pubmsgDataEvent){//room-pubmsg事件：
        let that = this ;
        if (window == window.parent) {return ;};//如果页面没有被iframe包裹,则return
        let pubmsgData = pubmsgDataEvent.message ;
        if (/outIframe/.test(pubmsgData.name)) {
            let data = JSON.stringify( pubmsgData.data );
            L.Logger.debug("[pubmsg]send outIframe info:" , data );
            if (window == window.parent) {return ;}; //如果页面没有被iframe包裹,则return
            window.parent.postMessage(data, '*');// 向父窗框返回响应结果
        }
    };
    handlerOutIframeMsglist(receiveData) {
        if (window == window.parent) {return ;};//如果页面没有被iframe包裹,则return
        let signallingData = receiveData.message.signallingData;
        if (/outIframe/.test(signallingData.name)) {
            let data = JSON.stringify( signallingData.data );
            L.Logger.debug("[msglist]send outIframe info:" , data );
            window.parent.postMessage(data, '*');// 向父窗框返回响应结果
        }
    }
    handlerOnMessage(event){
        const that = this ;
        return that.handlerIframeMessage(event); //iframe框架消息处理函数
    };
    handlerIframeMessage(event){ //iframe框架消息处理函数
        let data = undefined;
        try{
            data = JSON.parse(event.data);
            if (data.source) {
                switch (data.source){
                    case "tk_dynamicPPT":
                        break;
                    default:
                        if (window == window.parent) {return true;};//如果页面没有被iframe包裹,并且该消息是第三方消息,则return true
                        L.Logger.debug("receive outIframe info:" , data );
                        ServiceSignalling.sendSignallingToParentIframe(data);
                        return true;
                        break;
                }
            }
        }catch (e){
            L.Logger.warning(  "iframe message data can't be converted to JSON , iframe data:" , event.data ) ;
            return ;
        }

    };
    handlerRoomConnected () {
        if (window == window.parent) {return ;};//如果页面没有被iframe包裹,则return
        window.parent.postMessage(JSON.stringify({"source":"Talk" , data:{action:'loaded'} }), '*');
    }

};
const HandlerIframeMessageInstance = new HandlerIframeMessage();
export  default  HandlerIframeMessageInstance ;