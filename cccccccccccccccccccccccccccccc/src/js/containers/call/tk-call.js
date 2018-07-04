/**
 * 组合call页面的所有模块
 * @module TkCall
 * @description   提供call页面的所有模块的组合功能
 * @author QiuShao
 * @date 2017/7/27
 */

'use strict';
import React from 'react';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext,DragDropContextProvider  } from 'react-dnd';
import eventObjectDefine from 'eventObjectDefine' ;
import TkGlobal from 'TkGlobal' ;
import TkUtils from 'TkUtils' ;
import ServiceRoom from 'ServiceRoom' ;
import HeaderVesselSmart from './headerVessel/headerVessel' ;
import MainVesselSmart from './mainVessel/mainVessel' ;
import JoinDetectionDeviceSmart from '../detectionDevice/joinDetectionDevice';
import RemoteControlDetectionDeviceSmart from '../detectionDevice/remoteControlDetectionDevice';
import ReconnectingSmart from './supernatant/reconnecting';
import SupernatantDynamicPptVideoSmart from './supernatant/supernatantDynamicPptVideo';
import LoadSupernatantPromptSmart from './supernatant/loadSupernatantPrompt';
import Help from '../help/subpage/help';
import LxNotification from '../LxNotification/LxNotification';
import ServiceTooltip from 'ServiceTooltip' ;
import ServiceSignalling from 'ServiceSignalling' ;
import TkConstant from 'TkConstant' ;

/*Call页面*/
class TkCall extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            reconnecting:false ,
            updateState:false ,
        };
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
    };
    componentWillMount(){ //在初始化渲染执行之前立刻调用
        const that = this ;
        TkGlobal.playback = false ; //是否回放
        TkGlobal.routeName = 'call' ; //路由的名字
        TkGlobal.isGetNetworkStatus = TkGlobal.isClient?false:true ; //是否获取网络状态
        $(document.body).removeClass('playback');
        that._refreshHandler();
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        let that = this ;
        //tkpc2.0.8:删除 eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.streamReconnectionFailed , that.reconnectionFailed.bind(that), that.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomConnected ,that.handlerRoomConnected.bind(that), that.listernerBackupid ) ;//roomConnected事件：白板处理
        eventObjectDefine.CoreController.dispatchEvent({type: 'loadSupernatantPrompt' , message:{show:true , content:TkGlobal.language.languageData.loadSupernatantPrompt.loadRooming }  });
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        let that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid );
    };
    handlerRoomConnected(){
        this.setState({updateState:!this.state.updateState});
    };
    //tkpc2.0.8:删除 reconnectionFailed


    handlerOkCallback(json){ /*切换设备之后的处理*/

        let {selectDeviceInfo} = json || {} ;
        let audioouputElementIdArr = document.getElementById("room").querySelectorAll("video , audio") ;
        ServiceRoom.getTkRoom().changeLocalDeviceToLocalstream(selectDeviceInfo , function (stream) {
            //eventObjectDefine.CoreController.dispatchEvent({ type:"migrationOfDevices" , message:{stream:stream} }) ;
            if(ServiceRoom.getTkRoom() && ServiceRoom.getTkRoom().getMySelf() && ServiceRoom.getTkRoom().getMySelf().id && ServiceRoom.getTkRoom().getUser(ServiceRoom.getTkRoom().getMySelf().id) ){
                let paramsJson = {isSetlocalStorage: false} ;
                TK.AVMgr.enumerateDevices(function (deviceInfo) {
                    let data = {
                        action:'deviceManagement' ,
                        type:'sendDeviceInfo' ,
                        deviceData:{deviceInfo:deviceInfo} ,
                    };
                    for(let user of Object.values( ServiceRoom.getTkRoom().getSpecifyRoleList(TkConstant.role.roleTeachingAssistant) ) ){
                        ServiceSignalling.sendSignallingFromRemoteControl( user.id , data);
                    }
                }, paramsJson);
            }
        },audioouputElementIdArr);
    };

    /*点击call整体页面的事件处理*/
    callAllWrapOnClick(event){
        eventObjectDefine.CoreController.dispatchEvent({type:'callAllWrapOnClick' , message:{event} });
    };

    _refreshHandler(){
        //如果没有经过login则视为刷新
        if (TkGlobal.isRenovate !== false ) {
            TkGlobal.isRenovate = true;
            let time = TkUtils.getUrlParams('timestamp' , window.location.href );
            let hrefSessionStorage  = window.sessionStorage.getItem(time);
            if (hrefSessionStorage) {
                window.location.href =  TkUtils.decrypt( hrefSessionStorage );
            }
        }
    };

    mouseUp() {
        TkGlobal.isVideoStretch = false;//鼠标在页面上抬起就取消视频拉伸
    };
    mouseLeave() {
        TkGlobal.isVideoStretch = false;//鼠标离开页面就取消视频拉伸
    };

    render(){
        const that = this ;
        return (
            <section onMouseLeave={that.mouseLeave.bind(that)} onMouseUp={this.mouseUp.bind(that)} className="add-position-relative" id="room"  style={{width:'100%' , height:'100%'}}>
                <article  className="all-wrap clear-float" id="all_wrap" onClick={that.callAllWrapOnClick.bind(that) } >
                    <HeaderVesselSmart />   {/*头部header*/}
                    <Help/>{/*xueln 帮助组建*/}
                    <MainVesselSmart />   {/*主体内容*/}
                    <ReconnectingSmart /> {/*重新连接*/}
                    <LoadSupernatantPromptSmart /> {/*正在加载浮层*/}
                    <SupernatantDynamicPptVideoSmart /> {/*动态PPT正在播放浮层*/}
                    <RemoteControlDetectionDeviceSmart isEnter={false} clearFinsh={true}  handlerOkCallback={undefined} backgroundColor='rgba(0,0,0,0.5)'  okText={TkGlobal.language.languageData.login.language.detection.button.ok.text}  titleText={TkGlobal.language.languageData.login.language.detection.deviceTestHeader.deviceSwitch.text} saveLocalStorage={false}  />
                    {!(TkGlobal.isBroadcast && !TkGlobal.isClient)?<JoinDetectionDeviceSmart isEneter={false} saveLocalStorage={false} clearFinsh={true} handlerOkCallback={that.handlerOkCallback.bind(that)}  backgroundColor='rgba(0,0,0,0.5)' okText={TkGlobal.language.languageData.login.language.detection.button.ok.text} titleText={TkGlobal.language.languageData.login.language.detection.deviceTestHeader.deviceSwitch.text} /> : undefined}{/*设备切换*/}
                    <LxNotification/>{/*提示弹框*/}
                </article>
            </section>
        )
    }
};
export default   DragDropContext(HTML5Backend)(TkCall);