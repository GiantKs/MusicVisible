/**
 * 拓课系统样式工具类
 * @module serviceTools
 * @description   提供 系统所需要的模块样式
 * @author QiuShao
 * @date 2017/12/08
 */
'use strict';
import TkGlobal from 'TkGlobal';
import TkConstant from 'TkConstant';
import TkUtils from 'TkUtils';

const systemStyleJsonUtils  = {
    updateSystemStyleJson:() => {
        let notUpdateSystemStyleJson = {};
        switch (TkConstant.template){
            case '':
                break;
            default:
                notUpdateSystemStyleJson.BottomVesselSmartStyleJson = TkGlobal.systemStyleJson.BottomVesselSmartStyleJson ;
                systemStyleJsonUtils.loadSystemStyleJson( notUpdateSystemStyleJson );
                break ;
        }
    },
    loadSystemStyleJson:(notUpdateSystemStyleJson={} ) => {
        // notUpdateSystemStyleJson = L.Utils.toJsonStringify(notUpdateSystemStyleJson);
        // let notUpdateSystemStyleJsonToJsonParse = L.Utils.toJsonParse(notUpdateSystemStyleJson);
        let notUpdateSystemStyleJsonToJsonParse = notUpdateSystemStyleJson ;
        let HeaderVesselSmartStyleJson =  notUpdateSystemStyleJsonToJsonParse.HeaderVesselSmartStyleJson || {
            position:'absolute' ,
            width:'100%' ,
            height:'0.48rem' ,
            top:'0rem' ,
        } ;
        let RightVesselSmartStyleJson =  notUpdateSystemStyleJsonToJsonParse.RightVesselSmartStyleJson ||  {
            position:'absolute' ,
            width:'3.9rem' ,
            height:"calc( 100% - "+HeaderVesselSmartStyleJson.height+ ")" ,
            right:'0rem' ,
            top:HeaderVesselSmartStyleJson.height ,
            left:"auto" ,
            zIndex:260
        } ;
        let BottomVesselSmartStyleJson =  notUpdateSystemStyleJsonToJsonParse.BottomVesselSmartStyleJson || {
            position:'absolute' ,
            width:"calc(100% - "+RightVesselSmartStyleJson.width+")" ,
            height:'0rem' ,
            bottom:'0rem' ,
            top:'auto' ,
            zIndex:250
        };
        let LeftToolBarVesselSmartStyleJson =  notUpdateSystemStyleJsonToJsonParse.LeftToolBarVesselSmartStyleJson || {
            position:'absolute' ,
            width:TkGlobal.loadModuleJson.LeftToolBarVesselSmart?"0.5rem":'0rem' ,
            height:TkGlobal.loadModuleJson.LeftToolBarVesselSmart?'calc(100% - '+HeaderVesselSmartStyleJson.height+' -  '+BottomVesselSmartStyleJson.height+')':'0rem' ,
            top:HeaderVesselSmartStyleJson.height,
            zIndex:200
        };
        let RightContentVesselSmartStyleJson = notUpdateSystemStyleJsonToJsonParse.RightContentVesselSmartStyleJson || {
            position:'absolute' ,
            width:'calc(100% - '+RightVesselSmartStyleJson.width+' - '+LeftToolBarVesselSmartStyleJson.width+')' ,
            height:'calc(100% - '+HeaderVesselSmartStyleJson.height+' -  '+BottomVesselSmartStyleJson.height+')'  ,
            top:HeaderVesselSmartStyleJson.height,
            left:LeftToolBarVesselSmartStyleJson.width,
        } ;
        let DesktopShareSmartStyleJson = notUpdateSystemStyleJsonToJsonParse.DesktopShareSmartStyleJson || {
            position:'absolute' ,
            width:'calc(100% - '+RightVesselSmartStyleJson.width+')' ,
            height:'calc(100% - '+HeaderVesselSmartStyleJson.height+' -  '+BottomVesselSmartStyleJson.height+')'  ,
            top:HeaderVesselSmartStyleJson.height,
            left:'0rem',
        };
        let ToolExtendListVesselSmartStyleJson = notUpdateSystemStyleJsonToJsonParse.ToolExtendListVesselSmartStyleJson || {
            position:'absolute' ,
            //width:'calc(100% - '+RightVesselSmartStyleJson.width+')' ,
            height:'calc(100% - '+HeaderVesselSmartStyleJson.height+' -  '+BottomVesselSmartStyleJson.height+')'  ,
            top:HeaderVesselSmartStyleJson.height,
            left:LeftToolBarVesselSmartStyleJson.width,
            zIndex:251
        };
        Object.customAssign( TkGlobal.dragRange,  {
            left:TkUtils.replaceRemToNumber(LeftToolBarVesselSmartStyleJson.width) ,
            top:TkUtils.replaceRemToNumber(HeaderVesselSmartStyleJson.height) ,
        });
        switch (TkConstant.template){
            case 'template_yinglianbang': //英练邦模板
                break;
            case 'template_zuoyewang30': //1对30模板
                if(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant ){
                    Object.customAssign(RightContentVesselSmartStyleJson , {
                        width: 'calc(100% - '+RightVesselSmartStyleJson.width+' - '+LeftToolBarVesselSmartStyleJson.width+' - 2.8rem)' ,
                        left: 'calc('+LeftToolBarVesselSmartStyleJson.width + ' + 2.8rem)' ,
                    });
                    Object.customAssign(BottomVesselSmartStyleJson , {
                        zIndex:252
                    });
                    Object.customAssign( TkGlobal.dragRange,  {
                        left:TkUtils.replaceRemToNumber(LeftToolBarVesselSmartStyleJson.width) + TkUtils.replaceRemToNumber('2.8rem') ,
                    });
                }
                break ;
            case 'template_sharktop': //鲨鱼公园的模板
                Object.customAssign(BottomVesselSmartStyleJson , {
                    bottom:'auto' ,
                    top:HeaderVesselSmartStyleJson.height ,
                    width:"100%" ,
                });
                Object.customAssign(RightVesselSmartStyleJson , {
                    top:'calc('+BottomVesselSmartStyleJson.height+' + '+HeaderVesselSmartStyleJson.height+')' ,
                    height:'calc(100% - '+HeaderVesselSmartStyleJson.height+' -  '+BottomVesselSmartStyleJson.height+')'  ,
                });
                Object.customAssign(LeftToolBarVesselSmartStyleJson , {
                    top:'calc('+BottomVesselSmartStyleJson.height+' + '+HeaderVesselSmartStyleJson.height+')' ,
                });
                Object.customAssign(RightContentVesselSmartStyleJson , {
                    top:'calc('+BottomVesselSmartStyleJson.height+' + '+HeaderVesselSmartStyleJson.height+')' ,
                });
                Object.customAssign(DesktopShareSmartStyleJson , {
                    top:'calc('+BottomVesselSmartStyleJson.height+' + '+HeaderVesselSmartStyleJson.height+')' ,
                });
                Object.customAssign(ToolExtendListVesselSmartStyleJson,  {
                    height:'calc(100% - '+HeaderVesselSmartStyleJson.height+' -  '+BottomVesselSmartStyleJson.height+')'  ,
                    top:'calc('+HeaderVesselSmartStyleJson.height+' +  '+BottomVesselSmartStyleJson.height+')' ,
                });
                Object.customAssign( TkGlobal.dragRange,  {
                    top:TkUtils.replaceRemToNumber(HeaderVesselSmartStyleJson.height) + TkUtils.replaceRemToNumber(BottomVesselSmartStyleJson.height),
                });
                break;
            default:
                break ;
        }
        TkGlobal.systemStyleJson = null ;
        TkGlobal.systemStyleJson = {
            HeaderVesselSmartStyleJson ,
            RightVesselSmartStyleJson ,
            BottomVesselSmartStyleJson ,
            LeftToolBarVesselSmartStyleJson ,
            RightContentVesselSmartStyleJson ,
            DesktopShareSmartStyleJson ,
            ToolExtendListVesselSmartStyleJson ,
        };
    }
};

export default systemStyleJsonUtils ;
