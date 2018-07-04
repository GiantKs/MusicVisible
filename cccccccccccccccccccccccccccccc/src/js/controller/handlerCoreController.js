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

class HandlerCoreController {
    /*根据公司domain决定加载的页面样式布局
    * @method setPageStyleByDomain*/
    setPageStyleByDomain(){
        let domain = TkUtils.getUrlParams("domain");
        //domain = 'icoachu';//测试数据!!!!!!
        TkGlobal.format  = "normal";
        switch (domain){
            case  'icoachu': //英练邦
                TkGlobal.format = "icoachu" ;
                $(document.head).append('<link rel="shortcut icon" href='+ require('../../img/call_layout/logo/icu_logo_ico.png')+' type="image/png" />');
                break;
            default:
                TkGlobal.format = "normal" ;
                break;
        };
        $(document.body).removeClass("normal icoachu").addClass(TkGlobal.format).attr("data-company" , TkGlobal.format );
    }

};
const handlerCoreControllerInstance = new HandlerCoreController();
export default handlerCoreControllerInstance ;