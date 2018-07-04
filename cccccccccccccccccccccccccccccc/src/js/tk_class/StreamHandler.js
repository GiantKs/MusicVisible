/**
 * Stream流的相关处理类
 * @class StreamHandler
 * @description   提供Stream流相关的处理功能
 * @author QiuShao
 * @date 2017/7/21
 */
'use strict';
import eventObjectDefine from 'eventObjectDefine';
import TkConstant from 'TkConstant' ;
import TkGlobal from 'TkGlobal' ;
import TkUtils from 'TkUtils' ;
import RoomHandler from 'RoomHandler' ;
import ServiceTooltip from 'ServiceTooltip' ;

class StreamHandler{
    constructor(stream){
        this.stream = stream ;
    }
    addEventListenerToRoomHandler(){
        let that = this ;
        /**@description Stream类-StreanEvent的相关事件**/
        for(let eventKey in TkConstant.EVENTTYPE.StreamEvent ){
            eventObjectDefine.Stream.addEventListener(TkConstant.EVENTTYPE.StreamEvent[eventKey] , function (recvEventData) {
                if(that['handler'+TkUtils.replaceFirstUper(eventKey) ] && typeof  that['handler'+TkUtils.replaceFirstUper(eventKey) ]  === "function" ){
                    that[ 'handler'+TkUtils.replaceFirstUper(eventKey) ](recvEventData);
                }
                eventObjectDefine.CoreController.dispatchEvent(recvEventData);
            });
        }
    };
    handlerAccessAccepted(accessAcceptedEventData){ //处理access-accepted事件
        if(accessAcceptedEventData.message && accessAcceptedEventData.message.getUserMediaFailureCode !== undefined ){
            if( accessAcceptedEventData.message.getUserMediaFailureCode === L.Constant.getUserMedia.FAILURE_VIDEO_AGAIN_GET_AUDIO ){
                ServiceTooltip.showPrompt(TkGlobal.language.languageData.getUserMedia.accessAccepted.getUserMediaFailure_reGetAudio );
            }
        }
        RoomHandler.joinRoom();
    };
    handlerAccessDenied(accessDeniedEventData){ //处理access-denied事件
        let errormsg = undefined ;
        let {code} = accessDeniedEventData.message ;
        let isShowPrompt = false ;
        switch (code){
            case L.Constant.accessDenied.streamFail://获取流失败
                errormsg = TkGlobal.language.languageData.getUserMedia.accessDenied.streamFail ;
                isShowPrompt = true ;
                break;
            case L.Constant.accessDenied.notAudioAndVideo: //没有音视频设备
                errormsg = TkGlobal.language.languageData.getUserMedia.accessDenied.notAudioAndVideo ;
                isShowPrompt = true ;
                break;
        }
        if(isShowPrompt && TkGlobal.needDetectioned === false){  ServiceTooltip.showPrompt(errormsg); }
        RoomHandler.joinRoom();
    };
}
const  StreamHandlerInstance = new StreamHandler() ;
StreamHandlerInstance.addEventListenerToRoomHandler();
export default StreamHandlerInstance ;