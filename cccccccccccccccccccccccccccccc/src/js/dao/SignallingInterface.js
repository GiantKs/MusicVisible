/**
 * 信令发送接口封装类
 * @class SignallingInterface
 * @description   提供系统所需要的信令发送请求
 * @author QiuShao
 * @date 2017/08/09
 */

'use strict';
import TkGlobal from 'TkGlobal';
import ServiceRoom from 'ServiceRoom';
import CoreController from 'CoreController';
import TkConstant from "../tk_class/TkConstant";

class SignallingInterface{
    /*发送room-pubMsg信令
    * @method pubMsg*/
    pubMsg(signallingName ,id , toID ,  data , do_not_save , expiresabs , associatedMsgID , associatedUserID, expires, type, write2DB, actions ){
        if( !CoreController.handler.getAppPermissions('pubMsg') ){return ;} ;
        if(TkGlobal.appConnected) {
            toID = toID || "__all";
            let save =  !do_not_save ;
            if(data && typeof data === 'object' ){
                data = JSON.stringify(data);
            }
            ServiceRoom.getTkRoom().pubMsg(signallingName ,id , toID ,  data , save  , expiresabs ,  associatedMsgID , associatedUserID, expires, type, write2DB, actions );
        }
    };
    /*发送room-delMsg信令
     * @method pubMsg*/
    delMsg(signallingName ,id , toID ,  data ) {
        if( !CoreController.handler.getAppPermissions('delMsg') ){return ;} ;
        if (TkGlobal.appConnected) {
            toID = toID || "__all";
            if(data && typeof data === 'object' ){
                data = JSON.stringify(data);
            }
            ServiceRoom.getTkRoom().delMsg(signallingName, id, toID, data);
        }
    };
    /*发送room-setProperty更新参与者属性
     * @method pubMsg*/
    setProperty(id , toID , properties ){
        if( !CoreController.handler.getAppPermissions('setProperty') ){return ;} ;
        if(TkGlobal.appConnected) {
            toID = toID || "__all";
            ServiceRoom.getTkRoom().changeUserProperty(id , toID , properties);
        }
    };
    /*设置参与者属性发送给所有人
    * @method setParticipantPropertyToAll*/
    setParticipantPropertyToAll(id, properties){
        if( !CoreController.handler.getAppPermissions('setParticipantPropertyToAll') ){return ;} ;
        let that = this ;
        let toID = "__all";
        let user = ServiceRoom.getTkRoom().getUsers()[id] ;
        if(!user){L.Logger.error( 'user is not exist  , user id is '+id+'!' ); return ; } ;
        if( !(user.role === TkConstant.role.roleChairman || user.role === TkConstant.role.roleStudent || user.role===TkConstant.role.roleTeachingAssistant && TkConstant.joinRoomInfo.assistantOpenMyseftAV) && properties && properties.publishstate != undefined ){   //xgd 17-09-15
           return ;
        }
        that.setProperty(id , toID , properties );
    };

    /*发送delMsg或者pubMsg信令数据给服务器，由服务器负责分发给参与者
    * @method sendSignallingDataToParticipant*/
    sendSignallingDataToParticipant( isDelMsg , signallingName ,id , toID ,  data, do_not_save, do_not_replace, expiresabs  , associatedMsgID , associatedUserID ){
        if( !CoreController.handler.getAppPermissions('sendSignallingDataToParticipant') ){return ;} ;
        let that = this ;
        if(isDelMsg){
            that.delMsg(  signallingName ,id , toID ,  data );
        }else{
            that.pubMsg(  signallingName ,id , toID ,  data, do_not_save, do_not_replace, expiresabs  , associatedMsgID , associatedUserID  );
        }
    };
    /*删除所有信令的消息，从服务器上
     * @method delmsgTo__AllAll*/
    delmsgTo__AllAll(toID = '__none'){
        if( !CoreController.handler.getAppPermissions('delmsgTo__AllAll') ){return ;} ;
        const that = this ;
        let signallingName = '__AllAll' , id = '__AllAll' ,  data = {} ;
        that.delMsg(  signallingName ,id , toID ,  data  );
    };

    /*发送聊天消息
    * @method sendTextMessage
    * params[message:string(require) ,toId:string]*/
    sendTextMessage(message ,toId ){
        if( !CoreController.handler.getAppPermissions('sendTextMessage') ){return ;} ;
        if(TkGlobal.appConnected) {
            if(message){
                toId =  toId || "__all" ;
                if(message && typeof message === 'object' ){
                    message = JSON.stringify(message);
                }
                ServiceRoom.getTkRoom().sendMessage(message ,toId);
            }
        }
    }
};
export  default  SignallingInterface ;
