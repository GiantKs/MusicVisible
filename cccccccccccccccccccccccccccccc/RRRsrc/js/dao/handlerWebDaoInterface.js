/**
 *  web接口请求封装类处理函数
 * @module HandlerWebDaoInterface
 * @description  用于控制页面组件的通信
 * @author QiuShao
 * @date 2017/7/5
 */
'use strict';
import eventObjectDefine from 'eventObjectDefine';
import TkConstant from 'TkConstant';
import TkUtils from 'TkUtils';
import TkGlobal from 'TkGlobal';
import ServiceRoom from 'ServiceRoom';
import ServiceSignalling from 'ServiceSignalling';

const HandlerWebDaoInterface  = TK.EventDispatcher( {} ) ;
eventObjectDefine.HandlerWebDaoInterface = HandlerWebDaoInterface ;
HandlerWebDaoInterface.addEventListenerOnHandlerWebDaoInterface = () =>  {
    /**@description WebAjaxInterface的相关事件**/
    for(let eventKey in TkConstant.EVENTTYPE.WebDaoEvent ){
        eventObjectDefine.HandlerWebDaoInterface.addEventListener(TkConstant.EVENTTYPE.WebDaoEvent[eventKey] , function (recvEventData) {
            if(HandlerWebDaoInterface['handler'+TkUtils.replaceFirstUper(eventKey) ] && typeof  HandlerWebDaoInterface['handler'+TkUtils.replaceFirstUper(eventKey) ]  === "function" ){
                HandlerWebDaoInterface[ 'handler'+TkUtils.replaceFirstUper(eventKey) ](recvEventData);
            }
            eventObjectDefine.CoreController.dispatchEvent(recvEventData);
        });
    }
};

/*获取礼物接口后触发的事件处理函数*/
HandlerWebDaoInterface.handlerGetGiftInfo = (getGiftInfoEventData) => {
    let {response,requestResult}=getGiftInfoEventData.message;
    if(requestResult && response.result == 0) {
        let giftInfoList = response.giftinfo;
        for(let giftInfo  of giftInfoList){
            let participantId = giftInfo.receiveid;
            if( TkGlobal.participantGiftNumberJson[participantId]  === undefined ){ TkGlobal.participantGiftNumberJson[participantId] = 0 ; } ;
            TkGlobal.participantGiftNumberJson[participantId] += Number(giftInfo.giftnumber); //从web接口中获取礼物数
        }
    }
};

/*获取礼物接口后触发的事件处理函数*/
HandlerWebDaoInterface.handlerSendGift = (recvEventData) => {
    let {response , requestResult , participantIdJson} =  recvEventData.message ;
    if(requestResult && response.result == 0) {
        let participantList = ServiceRoom.getTkRoom().getUsers();
        for(let keyName in participantIdJson) {
            let participantId = keyName;
            let participant = participantList[participantId];
            if(participant) {
                if(TkGlobal.participantGiftNumberJson[participantId] == undefined || TkGlobal.participantGiftNumberJson[participantId] == null) {
                    TkGlobal.participantGiftNumberJson[participantId] = 0;
                }
                TkGlobal.participantGiftNumberJson[participantId]++;
                let giftnumber = (participant.giftnumber != undefined ? participant.giftnumber : 0) + TkGlobal.participantGiftNumberJson[participantId];
                let data = {
                    giftnumber: giftnumber
                };
                ServiceSignalling.setParticipantPropertyToAll(participantId, data);
            }
        }
    }
};

/*上课发送的web接口roomstart后触发的事件处理函数*/
HandlerWebDaoInterface.handlerRoomStart = (recvEventData) => {

};

/*下课发送的web接口roomove后触发的事件处理函数*/
HandlerWebDaoInterface.handlerRoomStart = (recvEventData) => {

};

HandlerWebDaoInterface.addEventListenerOnHandlerWebDaoInterface();
export default HandlerWebDaoInterface ;