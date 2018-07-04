/**
 * 工具服务
 * @module serviceTools
 * @description   提供 工具服务
 * @author QiuShao
 * @date 2017/7/10
 */
import TkUtils from  "TkUtils" ;
import TkGlobal from  'TkGlobal' ;
import TkConstant from  'TkConstant' ;
import ServiceRoom from 'ServiceRoom';
import eventObjectDefine from 'eventObjectDefine';
import ServiceSignalling from 'ServiceSignalling';


const ServiceTools = {
   /*获取语言包数据
    @method getAppLanguageInfo
    @param {string} languageName 语言名字*/
   getAppLanguageInfo:function ( callback , languageName) {
       let lang = languageName ? languageName : TkGlobal.languageName;//默认语言
       // lang = 'english';//测试数据
       let languageInfo = {} ;
       TkGlobal.language = TkGlobal.language || {} ;
       /*获取语言数据*/
       languageInfo.name = lang ;
       languageInfo.languageData = require('../../language/i18_'+lang+'.js');
       if(callback && typeof callback === "function" ){
           callback(languageInfo);
       }
       $(document.body).removeClass("chinese english complex").addClass(languageInfo.name).attr("data-language" , languageInfo.name);
   } ,
    /*关闭所有正在发布的media流*/
    unpublishAllMediaStream:(callback) => {
        if( ServiceRoom.getTkRoom() ){
            let streams =  ServiceRoom.getTkRoom().remoteStreams;
            let isUnpublish = false ;
            let code = -1 ;  //-1:没有流可以取消发布 , 0：取消发布失败 ， 1：取消发布成功 , -2:没有unpublishMediaStream权限
            for(let stream of Object.values(streams) ){
                if(stream.getAttributes().type === 'media' ) {
                    isUnpublish = true;
                    let result = ServiceSignalling.unpublishMediaStream(stream, function (success, error) {
                        if (success) {
                            code = 1;
                            if (TkUtils.isFunction(callback)) {
                                callback(code, stream);
                            }
                        } else {
                            code = 0;
                            if (TkUtils.isFunction(callback)) {
                                callback(code, stream);
                            }
                        }
                    });
                    if (result === false) {
                        code = -2;
                        if( TkUtils.isFunction(callback) ){
                            callback(code, stream);
                        }
                    }
                }
            }
            if(!isUnpublish){
                if( TkUtils.isFunction(callback) ){
                    callback(code , undefined);
                }
            }
        }
    } ,
    isPlayMediaFile:() => {
        if( ServiceRoom.getTkRoom() ){
            let streams =  ServiceRoom.getTkRoom().remoteStreams;
            let isPlayMediaFile = false ;
            for(let stream of Object.values(streams) ){
                if(stream.getAttributes().type === 'media' ) {
                    isPlayMediaFile = true ;
                    break ;
                }
            }
            TkGlobal.playMediaFileing = isPlayMediaFile ;
        }
        return TkGlobal.playMediaFileing;
    },
    TkUtils:TkUtils ,
};

export default ServiceTools ;