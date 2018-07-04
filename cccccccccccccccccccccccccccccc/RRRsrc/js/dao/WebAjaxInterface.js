/**
 * web接口请求封装类
 * @class WebAjaxInterface
 * @description   提供系统所需要的web接口请求
 * @author QiuShao
 * @date 2017/08/08
 */
'use strict';
import TkConstant from 'TkConstant';
import TkGlobal from 'TkGlobal';
import eventObjectDefine from 'eventObjectDefine';
import ServiceRoom from 'ServiceRoom';
import ServiceSignalling from 'ServiceSignalling';
import CoreController from 'CoreController';
import HandlerWebDaoInterface from './handlerWebDaoInterface';

export  const webRequestSuccess = 1 ;
export  const webRequestFail = 0 ;
class WebAjaxInterface{
    /*基础请求接口*/
    baseAjax(requestJson , responseJson){
        responseJson = responseJson || {} ;
        responseJson.ajaxHandlerCallback = function (error , response ) {
            if(requestJson.handlerEventKey){
                let webAjaxEventData = {
                    type: TkConstant.EVENTTYPE.WebDaoEvent[requestJson.handlerEventKey] ,
                } ;
                if(error && !response){
                    webAjaxEventData.message = {
                        error:error ,
                        requestResult:webRequestFail
                    }
                }else if(response){
                    webAjaxEventData.message = {
                        response:response ,
                        requestResult:webRequestSuccess
                    };
                    if(requestJson.excessResponseResultJson){
                        for(let keyName in requestJson.excessResponseResultJson){
                            webAjaxEventData.message[keyName] =  requestJson.excessResponseResultJson[keyName] ;
                        }
                    }
                }
                eventObjectDefine.HandlerWebDaoInterface.dispatchEvent(webAjaxEventData);
            }else{
                L.Logger.error('requestJson not handlerEventKey!' , JSON.stringify(requestJson) );
            }
        };
        $.ajax({
            type: requestJson.type || "post",
            url: requestJson.url,
            dataType:requestJson.dataType || "json",
            async: requestJson.async || false,
            data:requestJson.data,
        }).done(function(response) {
            L.Logger.debug( (requestJson.remark?'['+requestJson.remark+']' : '' )  +"success:ajax request  response:", response);
            if(responseJson && responseJson.doneCallback && typeof responseJson.doneCallback === "function" ){
                responseJson.doneCallback(response);
            }else{
                responseJson.ajaxHandlerCallback(undefined ,response);
            }
        }).fail(function(error) {
            L.Logger.error((requestJson.remark?'['+requestJson.remark+']' : '' )  + "fail:ajax request  error:", error);
            if(responseJson && responseJson.failCallback && typeof responseJson.failCallback === "function" ){
                responseJson.failCallback(error);
            }else{
                responseJson.ajaxHandlerCallback(error ,undefined);
            }
        });
    };

    /*获取礼物信息，participantId可缺省，缺省获取所有人的
    * @method getGiftInfo*/
    getGiftInfo(participantId){
        let that = this ;
        let data = {
            serial: TkConstant.joinRoomInfo["serial"] //教室id
        };
        if(participantId) {
            data["receiveid"] = participantId; //收礼物人id',（可不填）
        };
        let requestJson = {
            type:'get' ,
            url:TkConstant.SERVICEINFO.address + "/ClientAPI" + "/getgiftinfo"+"?ts="+new Date().getTime(),
            data:data ,
            handlerEventKey:'getGiftInfo' ,
            remark:'获取礼物'
        };
        that.baseAjax(requestJson);
    } ;

    /*发送礼物
     * @method sendGift
     * @params [participantIdJson:json]*/
    sendGift(participantIdJson){
        if( !CoreController.handler.getAppPermissions('sendGift') ){return ;} ;
        let that = this ;
        let data = {
            serial: TkConstant.joinRoomInfo["serial"] , //教室id
            sendid: ServiceRoom.getTkRoom().getMySelf().id, //送礼物人id
            sendname: ServiceRoom.getTkRoom().getMySelf().nickname, //送礼物人名字'
            receivearr: participantIdJson //接收礼物人id Json
        };
        let requestJson = {
            type:'post' ,
            url:TkConstant.SERVICEINFO.address + "/ClientAPI" + "/sendgift"+"?ts="+new Date().getTime(),
            data:data ,
            async:true ,
            handlerEventKey:'sendGift' ,
            excessResponseResultJson:{participantIdJson:participantIdJson} ,
            remark:'发送礼物' ,
        };
        that.baseAjax(requestJson);
    };

    /*上课发送的web接口roomstart
     * @method roomStart*/
    roomStart(){
        if( !CoreController.handler.getAppPermissions('roomStart') ){return ;} ;
        let that = this ;
        let data = {
            serial: TkConstant.joinRoomInfo["serial"],
            companyid: TkConstant.joinRoomInfo["companyid"]
        };
        let requestJson = {
            type:'post' ,
            url:TkConstant.SERVICEINFO.address + "/ClientAPI" + "/roomstart"+"?ts="+new Date().getTime(),
            data:data ,
            async:true ,
            handlerEventKey:'roomStart' ,
            remark:'开始上课' ,
        };
        that.baseAjax(requestJson);
        ServiceSignalling.sendSignallingFromClassBegin(false);
    };


    /*下课发送的web接口roomove
     * @method roomOver */
    roomOver(){
        if( !CoreController.handler.getAppPermissions('roomOver') ){return ;} ;
        let that = this ;
        let data = {
            act: 3, //删除会议
            serial: TkConstant.joinRoomInfo["serial"],
            companyid: TkConstant.joinRoomInfo["companyid"]
        };
        let requestJson = {
            type:'post' ,
            url:TkConstant.SERVICEINFO.address + "/ClientAPI" + "/roomover"+"?ts="+new Date().getTime(),
            data:data ,
            async:true ,
            handlerEventKey:'roomOver' ,
            remark:'结束上课' ,
        };
        that.baseAjax(requestJson);
        ServiceSignalling.sendSignallingFromClassBegin(true);
    };

    /*课堂点名发送的web接口setroommark
     * @method roomStart*/
    setRoomMark(userId,state){
        if( !CoreController.handler.getAppPermissions('pairOfManyIsShow') ){return ;} ;
        let that = this ;
        let data = {
            serial: TkConstant.joinRoomInfo["serial"],
            userid: userId,
            state:state || 0,
        };
        let requestJson = {
            type:'post' ,
            url:TkConstant.SERVICEINFO.address + "/ClientAPI" + "/setroommark"+"?ts="+new Date().getTime(),
            data:data ,
            async:true ,
            handlerEventKey:'setroommark' ,
            remark:'设置课堂点名的人' ,
        };
        let responseJson = {
            doneCallback(res){
                if (res.result == 0) {
                    eventObjectDefine.CoreController.dispatchEvent({
                        type:'handleSetRoomMark' ,
                        message:{setAskInfo:res}
                    });
                }
            },
        };
        that.baseAjax(requestJson,responseJson);
    };

    /*课堂点名发送的web接口setroommark
     * @method roomStart*/
    getRoomMark(){
        if( !CoreController.handler.getAppPermissions('pairOfManyIsShow') ){return ;} ;
        let that = this ;
        let data = {
            serial: TkConstant.joinRoomInfo["serial"],
        };
        let requestJson = {
            type:'post' ,
            url:TkConstant.SERVICEINFO.address + "/ClientAPI" + "/getroommark"+"?ts="+new Date().getTime(),
            data:data ,
            async:true ,
            handlerEventKey:'getroommark' ,
            remark:'获取课堂点名记录' ,
        };
        let responseJson = {
            doneCallback(res){
                if (res.result == 0) {
                    eventObjectDefine.CoreController.dispatchEvent({
                        type:'handleGetRoomMark' ,
                        message:{roomusermark:res.roomusermark}
                    });
                }
            },
        };
        that.baseAjax(requestJson,responseJson);
    };

    /*课堂点名发送的web接口setroommark
     * @method roomStart*/
    deleteRoomMark(){
        if( !CoreController.handler.getAppPermissions('pairOfManyIsShow') ){return ;} ;
        let that = this ;
        let data = {
            serial: TkConstant.joinRoomInfo["serial"],
        };
        let requestJson = {
            type:'post' ,
            url:TkConstant.SERVICEINFO.address + "/ClientAPI" + "/deleteroommark"+"?ts="+new Date().getTime(),
            data:data ,
            async:true ,
            handlerEventKey:'deleteroommark' ,
            remark:'删除课堂点名记录' ,
        };
        that.baseAjax(requestJson);
    };
    /*获取服务器名称的web接口getserverlist*/
    getServerList(resCallback){
        // if( !CoreController.handler.getAppPermissions('pairOfManyIsShow') ){return ;} ;
        let that = this ;
        let data = {
            supportlanguage: TkGlobal.language.name === 'chinese'?'zh-CN':'en',
        };
        let requestJson = {
            type:'post' ,
            url:TkConstant.SERVICEINFO.address + "/ClientAPI" + "/getserverarea"+"?ts="+new Date().getTime(),
            data:data ,
            async:true ,
            handlerEventKey:'getserverlist' ,
            remark:'获取服务器名称' ,
        };
        that.baseAjax(requestJson,resCallback);
    };

    /*获取服务器速度的web接口testserverrate*/
    getServerSpeed(resCallback){
        // if( !CoreController.handler.getAppPermissions('pairOfManyIsShow') ){return ;} ;
        let that = this ;
        let testData = '获取服务器速度耶'.repeat(64)+Math.floor(Math.random()*10000);
        let data = {
            testData: testData,
        };
        let requestJson = {
            type:'post' ,
            url:TkConstant.SERVICEINFO.address + "/ClientAPI" + "/testserverrate"+"?ts="+new Date().getTime(),
            data:data ,
            async:true ,
            handlerEventKey:'testserverrate' ,
            remark:'获取服务器速度' ,
        };
        that.baseAjax(requestJson,resCallback);
    };

    /*获取默认服务器名称*/
    getDefaultServerName(resCallback) {
        let that = this ;
        let requestJson = {
            type:'post' ,
            url:TkConstant.SERVICEINFO.protocolAndHostname+':8080/where.html?ts='+new Date().getTime(),
            data:{} ,
            async:true ,
            handlerEventKey:'testserverrate' ,
            remark:'获取默认服务器名称' ,
        };
        that.baseAjax(requestJson,resCallback);
    };

    /*课堂点名发送的web接口setroommark
     * @method roomStart*/
    getFileRemark(fileid,responseJson){
        let that = this ;
        let data = {fileid:fileid};
        let requestJson = {
            type:'post' ,
            url:TkConstant.SERVICEINFO.address + "/ClientAPI" + "/getfileremark"+"?ts="+new Date().getTime(),
            data:data ,
            async:true ,
            handlerEventKey:'getfileremark' ,
            remark:'获取课件备注' ,
        };
        that.baseAjax(requestJson,responseJson);
    };

};
const  WebAjaxInterfaceInstance = new WebAjaxInterface();
export  default  WebAjaxInterfaceInstance ;