/**
 * UI-总控制中心处理类
 * @class HandlerCoreController
 * @description  用于CoreController核心控制器的处理
 * @author QiuShao
 * @date 2017/08/08
 */
'use strict';
import TkUtils from 'TkUtils';
import TkGlobal from 'TkGlobal';
import TkConstant from 'TkConstant';
import eventObjectDefine from 'eventObjectDefine';
import systemStyleJsonUtils from '../utils/loadSystemStyleJson' ;

class HandlerCoreController {
    updateSystemStyleJsonValueByInnerKey(StyleJsonKey , innerKey ,innerValue ){
        if(StyleJsonKey && innerKey && TkGlobal.systemStyleJson[StyleJsonKey] && TkGlobal.systemStyleJson[StyleJsonKey][innerKey] ){
            let StyleJsonValue = Object.customAssign({} , TkGlobal.systemStyleJson[StyleJsonKey] ) ;
            StyleJsonValue[innerKey] = innerValue ;
            this.updateSystemStyleJson(StyleJsonKey ,StyleJsonValue);
        }
    }

    updateSystemStyleJson(StyleJsonKey , StyleJsonValue){
        if(StyleJsonKey && StyleJsonValue && typeof StyleJsonValue === 'object' && TkGlobal.systemStyleJson[StyleJsonKey] ){
            TkGlobal.systemStyleJson[StyleJsonKey] = StyleJsonValue;
            systemStyleJsonUtils.updateSystemStyleJson();
            eventObjectDefine.CoreController.dispatchEvent({type:'updateSystemStyleJson' });
        }
    };

    initSystemStyleJson(){
        systemStyleJsonUtils.loadSystemStyleJson();
        eventObjectDefine.CoreController.dispatchEvent({type:'initSystemStyleJson'});
    };

    refreshSystemStyleJson(){
        if(TkGlobal.systemStyleJson && typeof TkGlobal.systemStyleJson === 'object' && Object.keys(TkGlobal.systemStyleJson).length > 0 ){
            systemStyleJsonUtils.updateSystemStyleJson();
            eventObjectDefine.CoreController.dispatchEvent({type:'updateSystemStyleJson' });
        }else{
            systemStyleJsonUtils.loadSystemStyleJson();
            eventObjectDefine.CoreController.dispatchEvent({type:'initSystemStyleJson'});
        }
    };
};
const handlerCoreControllerInstance = new HandlerCoreController();
export default handlerCoreControllerInstance ;