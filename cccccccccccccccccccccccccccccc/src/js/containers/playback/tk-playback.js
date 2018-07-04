/**
 * 组合回放playback页面的所有模块
 * @module TkPlayback
 * @description   提供call页面的所有模块的组合功能
 * @author QiuShao
 * @date 2017/7/27
 */

'use strict';
import React from 'react';
import { hashHistory } from 'react-router'
import eventObjectDefine from 'eventObjectDefine' ;
import TkGlobal from 'TkGlobal' ;
import TkUtils from 'TkUtils' ;
import CoreController from 'CoreController' ;
import HeaderVesselSmart from '../call/headerVessel/headerVessel' ;
import MainVesselSmart from '../call/mainVessel/mainVessel' ;
import PlaybackControlSmart from './playbackControl/playbackControl' ;
import LoadSupernatantPromptSmart from '../call/supernatant/loadSupernatantPrompt';
import "../../../css/tk-playback.css";
import HTML5Backend from 'react-dnd-html5-backend';
import ServiceRoom from 'ServiceRoom';
import { DragDropContext } from 'react-dnd';


/*Call页面*/
class TkPlayback extends React.Component{
    constructor(props){
        super(props);
        this.playjson = undefined;
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
    };
    componentWillMount(){ //在初始化渲染执行之前立刻调用
        const that = this ;
        TkGlobal.playback = true ; //是否回放
        TkGlobal.routeName = 'playback' ; //路由的名字
        TkGlobal.isGetNetworkStatus = false ; //是否获取网络状态
        $(document.body).addClass('playback');
        that._refreshHandler();
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this ;
        if(!TkGlobal.isReload){
            let timestamp = new Date().getTime() ;
            let href = window.location.href ;
            L.Utils.sessionStorage.setItem(timestamp , TkUtils.encrypt( href ) );
            hashHistory.push('/replay?timestamp='+timestamp+'&reset=true' );
            eventObjectDefine.CoreController.dispatchEvent({type: 'loadSupernatantPrompt' , message:{show:true , content:TkGlobal.language.languageData.loadSupernatantPrompt.loadRoomingPlayback }  });
            CoreController.handler.initPlaybackInfo(); //执行initPlaybackInfo
            if(!TkGlobal.playback){
                CoreController.handler.joinRoom(); //执行joinroom
            }else{
                TkGlobal.liveRoom = TKLIVE.LivePlayBack(ServiceRoom.getTkRoom());
                let playbackParams = {
                    roomtype:TkUtils.getUrlParams('type') != ""? Number(TkUtils.getUrlParams('type') ) : TkUtils.getUrlParams('type'),
                    serial:TkUtils.getUrlParams('serial'),
                    recordjsonpath:"http://"+TkUtils.getUrlParams('path'),
                    domain:TkUtils.getUrlParams('domain'),
                    host:TkUtils.getUrlParams('host'),
                };
                TkGlobal.liveRoom.joinLivePlaybackRoom(playbackParams);
            }

            //this.playjson = CoreController.handler.getPlayBackJson(); //获取json
            //this.playjson = [{"ts":1515494908123,"method":"start"},{"ts":1515494908123,"method":"join","participantId":"ArsTZyPAawkVCJGjACrF","userName":"eb006f1c-af5b-8a2f-bfd1-96ebbcd5e560","dataChannels":false,"webParticipant":false,"properties":{"role":0,"nickname":"ttt","publishstate":0,"raisehand":false,"giftnumber":0,"candraw":false,"disablevideo":false,"disableaudio":false,"devicetype":"WindowClient","systemversion":"chrome 53.0.2785.116","version":"2.1.0","appType":"webpageApp","hasvideo":true,"hasaudio":true,"udpstate":1}},{"ts":1515494908125,"method":"PubMsg","data":{"name":"ClassBegin","id":"ClassBegin","toID":"__all","data":"{\"recordchat\":true,\"recordts\":1515494908121}","seq":3,"ts":1515494908}},{"ts":1515494908201,"method":"setProperty","id":"eb006f1c-af5b-8a2f-bfd1-96ebbcd5e560","properties":{"candraw":true}},{"ts":1515494908204,"method":"PubMsg","data":{"name":"ShowPage","id":"DocumentFilePage_ShowPage","toID":"__all","data":"{\"isDel\":false,\"isGeneralFile\":true,\"isMedia\":false,\"isDynamicPPT\":false,\"isH5Document\":false,\"action\":\"show\",\"mediaType\":\"\",\"filedata\":{\"fileid\":\"26330\",\"currpage\":1,\"pagenum\":14,\"filetype\":\"pptx\",\"filename\":\"9.23团建.pptx\",\"swfpath\":\"/upload/20171126_115824_qwpolbxr.jpg\",\"pptslide\":1,\"pptstep\":0,\"steptotal\":0}}","seq":4,"ts":1515494908}},{"ts":1515494911215,"method":"PubMsg","data":{"name":"whiteboardMarkTool","id":"whiteboardMarkTool","toID":"__allExceptSender","data":"{\"selectMouse\":false}","seq":5,"ts":1515494911}},{"ts":1515494911776,"method":"PubMsg","data":{"name":"SharpsChange","id":"1743c3bf-0be8-e946-a518-c8149df8fd67###_SharpsChange_26330_1","toID":"__allExceptSender","data":"{\"eventType\":\"shapeSaveEvent\",\"actionName\":\"AddShapeAction\",\"shapeId\":\"1743c3bf-0be8-e946-a518-c8149df8fd67\",\"data\":{\"className\":\"Rectangle\",\"data\":{\"x\":396.379980563654,\"y\":241.35082604470358,\"width\":360.73858114674437,\"height\":192.80855199222543,\"strokeWidth\":5,\"strokeColor\":\"#ff0001\",\"fillColor\":\"transparent\"},\"id\":\"1743c3bf-0be8-e946-a518-c8149df8fd67\"},\"whiteboardID\":\"default\"}","seq":6,"ts":1515494912}},{"ts":1515494912204,"method":"PubMsg","data":{"name":"SharpsChange","id":"a1250bd3-c058-2c91-6b0e-5826530dd199###_SharpsChange_26330_1","toID":"__allExceptSender","data":"{\"eventType\":\"shapeSaveEvent\",\"actionName\":\"AddShapeAction\",\"shapeId\":\"a1250bd3-c058-2c91-6b0e-5826530dd199\",\"data\":{\"className\":\"Rectangle\",\"data\":{\"x\":985.6899902818269,\"y\":381.2925170068027,\"width\":133.72206025267258,\"height\":121.28279883381919,\"strokeWidth\":5,\"strokeColor\":\"#ff0001\",\"fillColor\":\"transparent\"},\"id\":\"a1250bd3-c058-2c91-6b0e-5826530dd199\"},\"whiteboardID\":\"default\"}","seq":7,"ts":1515494912}},{"ts":1515494912604,"method":"PubMsg","data":{"name":"SharpsChange","id":"1af29ff6-09bf-f36c-de0c-3987f2879e1e###_SharpsChange_26330_1","toID":"__allExceptSender","data":"{\"eventType\":\"shapeSaveEvent\",\"actionName\":\"AddShapeAction\",\"shapeId\":\"1af29ff6-09bf-f36c-de0c-3987f2879e1e\",\"data\":{\"className\":\"Rectangle\",\"data\":{\"x\":769.5578231292517,\"y\":312.87657920310977,\"width\":461.807580174927,\"height\":219.24198250728858,\"strokeWidth\":5,\"strokeColor\":\"#ff0001\",\"fillColor\":\"transparent\"},\"id\":\"1af29ff6-09bf-f36c-de0c-3987f2879e1e\"},\"whiteboardID\":\"default\"}","seq":8,"ts":1515494913}},{"ts":1515494912938,"method":"PubMsg","data":{"name":"SharpsChange","id":"060a495c-b77f-f481-1d42-ebaa96ccafb7###_SharpsChange_26330_1","toID":"__allExceptSender","data":"{\"eventType\":\"shapeSaveEvent\",\"actionName\":\"AddShapeAction\",\"shapeId\":\"060a495c-b77f-f481-1d42-ebaa96ccafb7\",\"data\":{\"className\":\"Rectangle\",\"data\":{\"x\":1094.5335276967928,\"y\":261.5646258503401,\"width\":205.24781341107882,\"height\":205.2478134110787,\"strokeWidth\":5,\"strokeColor\":\"#ff0001\",\"fillColor\":\"transparent\"},\"id\":\"060a495c-b77f-f481-1d42-ebaa96ccafb7\"},\"whiteboardID\":\"default\"}","seq":9,"ts":1515494913}},{"ts":1515494913298,"method":"PubMsg","data":{"name":"SharpsChange","id":"618622d2-4f7b-ee4f-0163-7ac31433372a###_SharpsChange_26330_1","toID":"__allExceptSender","data":"{\"eventType\":\"shapeSaveEvent\",\"actionName\":\"AddShapeAction\",\"shapeId\":\"618622d2-4f7b-ee4f-0163-7ac31433372a\",\"data\":{\"className\":\"Rectangle\",\"data\":{\"x\":1181.6083576287656,\"y\":354.8590864917395,\"width\":296.9873663751216,\"height\":222.35179786200194,\"strokeWidth\":5,\"strokeColor\":\"#ff0001\",\"fillColor\":\"transparent\"},\"id\":\"618622d2-4f7b-ee4f-0163-7ac31433372a\"},\"whiteboardID\":\"default\"}","seq":10,"ts":1515494913}},{"ts":1515494913600,"method":"PubMsg","data":{"name":"SharpsChange","id":"7a4e5f04-4d37-b0a5-eed7-9575fa5b33ce###_SharpsChange_26330_1","toID":"__allExceptSender","data":"{\"eventType\":\"shapeSaveEvent\",\"actionName\":\"AddShapeAction\",\"shapeId\":\"7a4e5f04-4d37-b0a5-eed7-9575fa5b33ce\",\"data\":{\"className\":\"Rectangle\",\"data\":{\"x\":974.8056365403303,\"y\":333.0903790087463,\"width\":209.91253644314872,\"height\":205.24781341107877,\"strokeWidth\":5,\"strokeColor\":\"#ff0001\",\"fillColor\":\"transparent\"},\"id\":\"7a4e5f04-4d37-b0a5-eed7-9575fa5b33ce\"},\"whiteboardID\":\"default\"}","seq":11,"ts":1515494914}},{"ts":1515494913904,"method":"PubMsg","data":{"name":"SharpsChange","id":"122d94b5-e79c-0168-1669-79f58122bf5d###_SharpsChange_26330_1","toID":"__allExceptSender","data":"{\"eventType\":\"shapeSaveEvent\",\"actionName\":\"AddShapeAction\",\"shapeId\":\"122d94b5-e79c-0168-1669-79f58122bf5d\",\"data\":{\"className\":\"Rectangle\",\"data\":{\"x\":595.408163265306,\"y\":333.0903790087463,\"width\":167.93002915451893,\"height\":127.50242954324585,\"strokeWidth\":5,\"strokeColor\":\"#ff0001\",\"fillColor\":\"transparent\"},\"id\":\"122d94b5-e79c-0168-1669-79f58122bf5d\"},\"whiteboardID\":\"default\"}","seq":12,"ts":1515494914}},{"ts":1515494915184,"method":"PubMsg","data":{"name":"ShowPage","id":"DocumentFilePage_ShowPage","toID":"__all","data":"{\"isMedia\":false,\"isDynamicPPT\":false,\"isGeneralFile\":true,\"isH5Document\":false,\"action\":\"\",\"mediaType\":\"\",\"filedata\":{\"fileid\":\"26330\",\"currpage\":2,\"pagenum\":14,\"filetype\":\"pptx\",\"filename\":\"9.23团建.pptx\",\"swfpath\":\"/upload/20171126_115824_qwpolbxr.jpg\",\"pptslide\":1,\"pptstep\":0,\"steptotal\":0}}","seq":13,"ts":1515494915}},{"ts":1515494915859,"method":"PubMsg","data":{"name":"SharpsChange","id":"d5f209de-4d98-71d3-f4d5-0c23417ade14###_SharpsChange_26330_2","toID":"__allExceptSender","data":"{\"eventType\":\"shapeSaveEvent\",\"actionName\":\"AddShapeAction\",\"shapeId\":\"d5f209de-4d98-71d3-f4d5-0c23417ade14\",\"data\":{\"className\":\"Rectangle\",\"data\":{\"x\":652.9397473275023,\"y\":421.7201166180758,\"width\":163.26530612244903,\"height\":111.95335276967927,\"strokeWidth\":5,\"strokeColor\":\"#ff0001\",\"fillColor\":\"transparent\"},\"id\":\"d5f209de-4d98-71d3-f4d5-0c23417ade14\"},\"whiteboardID\":\"default\"}","seq":14,"ts":1515494916}},{"ts":1515494916210,"method":"PubMsg","data":{"name":"SharpsChange","id":"fdb66414-41d0-a4fb-59c1-54c3b4f6e193###_SharpsChange_26330_2","toID":"__allExceptSender","data":"{\"eventType\":\"shapeSaveEvent\",\"actionName\":\"AddShapeAction\",\"shapeId\":\"fdb66414-41d0-a4fb-59c1-54c3b4f6e193\",\"data\":{\"className\":\"Rectangle\",\"data\":{\"x\":754.008746355685,\"y\":339.310009718173,\"width\":356.0738581146744,\"height\":167.93002915451893,\"strokeWidth\":5,\"strokeColor\":\"#ff0001\",\"fillColor\":\"transparent\"},\"id\":\"fdb66414-41d0-a4fb-59c1-54c3b4f6e193\"},\"whiteboardID\":\"default\"}","seq":15,"ts":1515494916}},{"ts":1515494916489,"method":"PubMsg","data":{"name":"SharpsChange","id":"3715da6b-d3ba-4974-d3f5-e9427faafe29###_SharpsChange_26330_2","toID":"__allExceptSender","data":"{\"eventType\":\"shapeSaveEvent\",\"actionName\":\"AddShapeAction\",\"shapeId\":\"3715da6b-d3ba-4974-d3f5-e9427faafe29\",\"data\":{\"className\":\"Rectangle\",\"data\":{\"x\":1002.7939747327501,\"y\":370.4081632653061,\"width\":398.0563654033041,\"height\":256.55976676384836,\"strokeWidth\":5,\"strokeColor\":\"#ff0001\",\"fillColor\":\"transparent\"},\"id\":\"3715da6b-d3ba-4974-d3f5-e9427faafe29\"},\"whiteboardID\":\"default\"}","seq":16,"ts":1515494916}},{"ts":1515494916817,"method":"PubMsg","data":{"name":"SharpsChange","id":"d6d14b2e-05f3-422c-99b8-6290ed4340e1###_SharpsChange_26330_2","toID":"__allExceptSender","data":"{\"eventType\":\"shapeSaveEvent\",\"actionName\":\"AddShapeAction\",\"shapeId\":\"d6d14b2e-05f3-422c-99b8-6290ed4340e1\",\"data\":{\"className\":\"Rectangle\",\"data\":{\"x\":674.7084548104956,\"y\":120.06802721088434,\"width\":147.7162293488824,\"height\":211.46744412050532,\"strokeWidth\":5,\"strokeColor\":\"#ff0001\",\"fillColor\":\"transparent\"},\"id\":\"d6d14b2e-05f3-422c-99b8-6290ed4340e1\"},\"whiteboardID\":\"default\"}","seq":17,"ts":1515494917}},{"ts":1515494917096,"method":"PubMsg","data":{"name":"SharpsChange","id":"519defc5-a41e-821c-1cea-11e98cd7c180###_SharpsChange_26330_2","toID":"__allExceptSender","data":"{\"eventType\":\"shapeSaveEvent\",\"actionName\":\"AddShapeAction\",\"shapeId\":\"519defc5-a41e-821c-1cea-11e98cd7c180\",\"data\":{\"className\":\"Rectangle\",\"data\":{\"x\":369.94655004859084,\"y\":218.02721088435374,\"width\":136.83187560738577,\"height\":155.49076773566566,\"strokeWidth\":5,\"strokeColor\":\"#ff0001\",\"fillColor\":\"transparent\"},\"id\":\"519defc5-a41e-821c-1cea-11e98cd7c180\"},\"whiteboardID\":\"default\"}","seq":18,"ts":1515494917}},{"ts":1515494917376,"method":"PubMsg","data":{"name":"SharpsChange","id":"2853128f-0599-9c4e-f005-a2c204f726ab###_SharpsChange_26330_2","toID":"__allExceptSender","data":"{\"eventType\":\"shapeSaveEvent\",\"actionName\":\"AddShapeAction\",\"shapeId\":\"2853128f-0599-9c4e-f005-a2c204f726ab\",\"data\":{\"className\":\"Rectangle\",\"data\":{\"x\":191.1321671525753,\"y\":286.4431486880466,\"width\":192.80855199222546,\"height\":146.16132167152574,\"strokeWidth\":5,\"strokeColor\":\"#ff0001\",\"fillColor\":\"transparent\"},\"id\":\"2853128f-0599-9c4e-f005-a2c204f726ab\"},\"whiteboardID\":\"default\"}","seq":19,"ts":1515494917}},{"ts":1515494917734,"method":"PubMsg","data":{"name":"SharpsChange","id":"c5117b24-c5f9-f9ed-80d2-39a2a866dedd###_SharpsChange_26330_2","toID":"__allExceptSender","data":"{\"eventType\":\"shapeSaveEvent\",\"actionName\":\"AddShapeAction\",\"shapeId\":\"c5117b24-c5f9-f9ed-80d2-39a2a866dedd\",\"data\":{\"className\":\"Rectangle\",\"data\":{\"x\":345.06802721088434,\"y\":382.84742468415936,\"width\":340.5247813411079,\"height\":234.79105928085517,\"strokeWidth\":5,\"strokeColor\":\"#ff0001\",\"fillColor\":\"transparent\"},\"id\":\"c5117b24-c5f9-f9ed-80d2-39a2a866dedd\"},\"whiteboardID\":\"default\"}","seq":20,"ts":1515494918}},{"ts":1515494924412,"method":"PubMsg","data":{"name":"SharpsChange","id":"17b62ba8-7779-3c2f-d4d7-4c6854258df8###_SharpsChange_26330_2","toID":"__allExceptSender","data":"{\"eventType\":\"shapeSaveEvent\",\"actionName\":\"AddShapeAction\",\"shapeId\":\"17b62ba8-7779-3c2f-d4d7-4c6854258df8\",\"data\":{\"className\":\"Rectangle\",\"data\":{\"x\":1047.8862973760931,\"y\":222.6919339164237,\"width\":138.38678328474248,\"height\":104.17881438289601,\"strokeWidth\":5,\"strokeColor\":\"#ff0001\",\"fillColor\":\"transparent\"},\"id\":\"17b62ba8-7779-3c2f-d4d7-4c6854258df8\"},\"whiteboardID\":\"default\"}","seq":21,"ts":1515494924}},{"ts":1515494926505,"method":"PubMsg","data":{"name":"ShowPage","id":"DocumentFilePage_ShowPage","toID":"__all","data":"{\"isMedia\":false,\"isDynamicPPT\":false,\"isGeneralFile\":true,\"isH5Document\":false,\"action\":\"\",\"mediaType\":\"\",\"filedata\":{\"fileid\":\"26330\",\"currpage\":3,\"pagenum\":14,\"filetype\":\"pptx\",\"filename\":\"9.23团建.pptx\",\"swfpath\":\"/upload/20171126_115824_qwpolbxr.jpg\",\"pptslide\":1,\"pptstep\":0,\"steptotal\":0}}","seq":22,"ts":1515494927}},{"ts":1515494927076,"method":"PubMsg","data":{"name":"SharpsChange","id":"7ba8d76f-1836-a3e4-b7c3-932b65edc9f9###_SharpsChange_26330_3","toID":"__allExceptSender","data":"{\"eventType\":\"shapeSaveEvent\",\"actionName\":\"AddShapeAction\",\"shapeId\":\"7ba8d76f-1836-a3e4-b7c3-932b65edc9f9\",\"data\":{\"className\":\"Rectangle\",\"data\":{\"x\":478.7900874635568,\"y\":556.9970845481049,\"width\":200.5830903790087,\"height\":96.40427599611269,\"strokeWidth\":5,\"strokeColor\":\"#ff0001\",\"fillColor\":\"transparent\"},\"id\":\"7ba8d76f-1836-a3e4-b7c3-932b65edc9f9\"},\"whiteboardID\":\"default\"}","seq":23,"ts":1515494927}},{"ts":1515494927404,"method":"PubMsg","data":{"name":"SharpsChange","id":"e73e9ff5-bbb1-d1ad-94f8-89aab791e73a###_SharpsChange_26330_3","toID":"__allExceptSender","data":"{\"eventType\":\"shapeSaveEvent\",\"actionName\":\"AddShapeAction\",\"shapeId\":\"e73e9ff5-bbb1-d1ad-94f8-89aab791e73a\",\"data\":{\"className\":\"Rectangle\",\"data\":{\"x\":754.008746355685,\"y\":387.5121477162293,\"width\":213.02235179786203,\"height\":102.62390670553935,\"strokeWidth\":5,\"strokeColor\":\"#ff0001\",\"fillColor\":\"transparent\"},\"id\":\"e73e9ff5-bbb1-d1ad-94f8-89aab791e73a\"},\"whiteboardID\":\"default\"}","seq":24,"ts":1515494927}},{"ts":1515494927700,"method":"PubMsg","data":{"name":"SharpsChange","id":"73fb9f10-47a8-f634-ecef-4069a3fc7b84###_SharpsChange_26330_3","toID":"__allExceptSender","data":"{\"eventType\":\"shapeSaveEvent\",\"actionName\":\"AddShapeAction\",\"shapeId\":\"73fb9f10-47a8-f634-ecef-4069a3fc7b84\",\"data\":{\"className\":\"Rectangle\",\"data\":{\"x\":1026.1175898931,\"y\":429.49465500485906,\"width\":166.3751214771621,\"height\":172.59475218658895,\"strokeWidth\":5,\"strokeColor\":\"#ff0001\",\"fillColor\":\"transparent\"},\"id\":\"73fb9f10-47a8-f634-ecef-4069a3fc7b84\"},\"whiteboardID\":\"default\"}","seq":25,"ts":1515494928}},{"ts":1515494931276,"method":"close"}];
            //ServiceRoom.getTkRoom().getPlaybackStartAndEndTime(this.playjson);
        }
    };
    componentWillUnmount(){ //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        const that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid );
    };

    _refreshHandler(){
        if( TkUtils.getUrlParams('reset' , window.location.href ) && TkUtils.getUrlParams('timestamp' , window.location.href) &&  L.Utils.sessionStorage.getItem( TkUtils.getUrlParams('timestamp' , window.location.href) ) ){
            TkGlobal.isReload = true ;
            window.location.href =  TkUtils.decrypt(  L.Utils.sessionStorage.getItem( TkUtils.getUrlParams('timestamp' , window.location.href) ) ) ;
            window.location.reload(true);
        }
    };

    render(){
        const that = this ;
        return (
            <section  className="add-position-relative" id="room"  style={{width:'100%' , height:'100%'}} >
                <article  className="all-wrap clear-float disabled" id="all_wrap"  style={{disabled:true}} >
                    <HeaderVesselSmart />   {/*头部header*/}
                    <MainVesselSmart />   {/*主体内容*/}
                    <article className="playback-barrier-bed disabled"     style={{disabled:true}}  ></article>
                </article>
                <PlaybackControlSmart playBackJson = {TkGlobal.isBroadcast?this.playjson:""}/> {/*回放控制器*/}
                <LoadSupernatantPromptSmart /> {/*正在加载浮层*/}
            </section>
        )
    }
};
export default  DragDropContext(HTML5Backend)(TkPlayback);