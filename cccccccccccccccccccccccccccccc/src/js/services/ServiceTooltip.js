/**
 * 提示框服务
 * @module ServiceTooltip
 * @description  提供 提示框的相关服务
 * @author QiuShao
 * @date 2017/08/07
 */
'use strict';
import TkGlobal from "TkGlobal" ;
import eventObjectDefine from 'eventObjectDefine';

const Tooltip = {
    showAlert:function(msg, callback) {
        eventObjectDefine.CoreController.dispatchEvent({type:'showAlert', message:{data:{
            title:msg.title,
            message:msg.message,
            ok:msg.ok,
            callback: function(answer) {
                if(callback && typeof callback === "function") {
                    callback(answer);
                }
            }
        }},});
    },
    showConfirm:function(msg, callback) {
        eventObjectDefine.CoreController.dispatchEvent({type:'showConfirm', message:{data:{
            title:msg.title,
            message:msg.message,
            isOk:{
                cancel: msg.button.cancel,
                ok: msg.button.ok
            },
            callback: function(answer) {
                if(callback && typeof callback === "function") {
                    callback(answer);
                }
            }
        }},});
        /*LxNotificationService.confirm(msg.title, msg.message, {
                cancel: msg.button.cancel,
                ok: msg.button.ok
            },
            function(answer) {
                if(callback && typeof callback === "function") {
                    callback(answer);
                }
            }
        );*/
    },

    // Fucntion added by R37 on 171026.
    showInputTooltip: function(data, callback){
        eventObjectDefine.CoreController.dispatchEvent({
            type: 'showInputTooltip', 
            data: {
                title: data.title.text,
                contentType: data.content.type,
                contentText: data.content.text,
                isOk: {
                    cancel: data.bottom.button[1].text,
                    ok: data.bottom.button[0].text
                },
                callback: function(hasConfirm, message){
                    if(callback && typeof callback === "function"){
                        callback(hasConfirm, message)
                    }
                }
            }
        });
    },
};
const ServiceTooltip = {
    /*显示错误提示框*/
    showError:function(errorMessage, callback, title, ok) {
        let e = {
            message: errorMessage,
            title: title ? title : TkGlobal.language.languageData.alertWin.title.showError.text,
            ok: ok ? ok : TkGlobal.language.languageData.alertWin.ok.showError.text
        } ;
        Tooltip.showAlert(e , callback);
    } ,

    /*显示正常提示框*/
    showPrompt:function(tipMessage, callback, title, ok) {
        let msg = {
            message: tipMessage,
            title: title ? title : TkGlobal.language.languageData.alertWin.title.showPrompt.text,
            ok: ok ? ok : TkGlobal.language.languageData.alertWin.ok.showPrompt.text
        };
        Tooltip.showAlert(msg , callback);
    } ,

    /*显示确认对话框*/
    showConfirm:function(confirmMessage, confirmCallback, title, ok , cancel) {
        let msg = {
            title: title ? title :TkGlobal.language.languageData.alertWin.title.showConfirm.text,
            button: {
                cancel:cancel ? cancel : TkGlobal.language.languageData.alertWin.ok.showConfirm.cancel,
                ok: ok ? ok : TkGlobal.language.languageData.alertWin.ok.showConfirm.ok
            },
            message: confirmMessage
        };
        Tooltip.showConfirm(msg, confirmCallback);
    },

    // 显示可以发布文字的提示框
    // Fucntion added by R37 on 171026.
    showInputTooltip: function(data, callback){
        
        data.bottom = data.bottom ? data.bottom : {
            button: [{
                name: 'confirm',
                text: data.content.type === 'db-radio' ? TkGlobal.language.languageData.alertWin.ok.showConfirm.ok :TkGlobal.language.languageData.notice.publish ,
            },{
                name: 'cancel',
                text: TkGlobal.language.languageData.notice.cancel 
            }]
        };

        Tooltip.showInputTooltip(data, callback);
    },

    // 显示可以选择的提示框
    // Fucntion added by R38 on 180127.
    showSelectTooltip: function(data, callback){

        data.bottom = data.bottom ? data.bottom : {
            button: [{
                name: 'confirm',
                text: TkGlobal.language.languageData.alertWin.ok.showConfirm.ok  //TODO  需要去语言包里更改并复用全局常量中的语言包数据
            },{
                name: 'cancel',
                text: TkGlobal.language.languageData.alertWin.ok.showConfirm.cancel  //TODO  需要去语言包里更改并复用全局常量中的语言包数据
            }]
        };

        Tooltip.showInputTooltip(data, callback);
    }
};
export default ServiceTooltip;