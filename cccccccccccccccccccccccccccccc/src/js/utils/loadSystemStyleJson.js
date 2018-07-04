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
        let systemStyleJson = {} ;
        let HeaderVesselSmartStyleJson =  notUpdateSystemStyleJson.HeaderVesselSmartStyleJson || {
            position:'absolute' ,
            width:'100%' ,
            height:'0.48rem' ,
        } ;
        let RightVesselSmartStyleJson =  notUpdateSystemStyleJson.RightVesselSmartStyleJson ||  {
            position:'absolute' ,
            width:'3.9rem' ,
            height:"calc( 100% - "+HeaderVesselSmartStyleJson.height+ ")" ,
            right:'0rem' ,
            top:HeaderVesselSmartStyleJson.height ,
            left:"auto" ,
        } ;
        let BottomVesselSmartStyleJson =  notUpdateSystemStyleJson.BottomVesselSmartStyleJson || {
            position:'absolute' ,
            width:"calc(100% - "+RightVesselSmartStyleJson.width+")" ,
            height:'0rem' ,
            bottom:'0rem' ,
        };
        let LeftToolBarVesselSmartStyleJson =  notUpdateSystemStyleJson.LeftToolBarVesselSmartStyleJson || {
            position:'absolute' ,
            width:TkGlobal.loadModuleJson.LeftToolBarVesselSmart?"0.5rem":'0rem' ,
            height:TkGlobal.loadModuleJson.LeftToolBarVesselSmart?'calc(100% - '+HeaderVesselSmartStyleJson.height+' -  '+BottomVesselSmartStyleJson.height+')':'0rem' ,
            top:TkGlobal.loadModuleJson.LeftToolBarVesselSmart?HeaderVesselSmartStyleJson.height:'0rem',
        };
        let RightContentVesselSmartStyleJson = notUpdateSystemStyleJson.RightContentVesselSmartStyleJson || {
            position:'absolute' ,
            width:'calc(100% - '+RightVesselSmartStyleJson.width+' - '+LeftToolBarVesselSmartStyleJson.width+')' ,
            height:'calc(100% - '+HeaderVesselSmartStyleJson.height+' -  '+BottomVesselSmartStyleJson.height+')'  ,
            top:HeaderVesselSmartStyleJson.height,
            left:LeftToolBarVesselSmartStyleJson.width,
        } ;
        let DesktopShareSmartStyleJson = notUpdateSystemStyleJson.DesktopShareSmartStyleJson || {
            position:'absolute' ,
            width:'calc(100% - '+RightVesselSmartStyleJson.width+')' ,
            height:'calc(100% - '+HeaderVesselSmartStyleJson.height+' -  '+BottomVesselSmartStyleJson.height+')'  ,
            top:HeaderVesselSmartStyleJson.height,
            left:'0rem',
        };
        switch (TkConstant.template){
            case 'icoachu': //英练邦模板
                break;
            case 'oneToThirty': //1对30模板
                RightContentVesselSmartStyleJson.width =  'calc(100% - '+RightVesselSmartStyleJson.width+' - '+LeftToolBarVesselSmartStyleJson.width+' - 2.8rem)'  ;
                RightContentVesselSmartStyleJson.left =  'calc('+LeftToolBarVesselSmartStyleJson.width + ' + 2.8rem)'  ;
                break ;
            default:
                break ;
        }
        systemStyleJson = {
            HeaderVesselSmartStyleJson ,
            RightVesselSmartStyleJson ,
            BottomVesselSmartStyleJson ,
            LeftToolBarVesselSmartStyleJson ,
            RightContentVesselSmartStyleJson ,
            DesktopShareSmartStyleJson ,
        };
        TkGlobal.systemStyleJson = null ;
        TkGlobal.systemStyleJson = systemStyleJson ;
    }
};

export default systemStyleJsonUtils ;
