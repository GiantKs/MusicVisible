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
import { DragDropContext,DragDropContextProvider,DropTarget  } from 'react-dnd';
import eventObjectDefine from 'eventObjectDefine' ;
import TkGlobal from 'TkGlobal' ;
import TkUtils from 'TkUtils' ;
import ServiceRoom from 'ServiceRoom' ;
import ServiceSignalling from 'ServiceSignalling' ;
import TkConstant from 'TkConstant' ;
import CoreController from 'CoreController';
import HeaderVesselSmart from './headerVessel/headerVessel' ;
import JoinDetectionDeviceSmart from '../detectionDevice/joinDetectionDevice';
import RemoteControlDetectionDeviceSmart from '../detectionDevice/remoteControlDetectionDevice';
import ReconnectingSmart from './supernatant/reconnecting';
import SupernatantDynamicPptVideoSmart from './supernatant/supernatantDynamicPptVideo';
import LoadSupernatantPromptSmart from './supernatant/loadSupernatantPrompt';
import Help from '../help/subpage/help';
import LxNotification from '../LxNotification/LxNotification';
import RightVesselSmart from './mainVessel/rightVessel/rightVessel';
import BottomVesselSmart from './mainVessel/leftVessel/bottomVessel/bottomVessel';
import LeftToolBarVesselSmart from './mainVessel/leftVessel/topVessel/leftToolBarVessel/leftToolBarVessel';
import RightContentVesselSmart from './mainVessel/leftVessel/topVessel/rightContentVessel/rightContentVessel';
import DesktopShareSmart from "./desktopShare/desktopShareSmart";
import GiftAnimationSmart from './mainVessel/leftVessel/giftAnimation/giftAnimation';
import ToolExtendListVesselSmart from './mainVessel/leftVessel/topVessel/leftToolBarVessel/toolExtendListVessel/toolExtendListVessel';
import BigPictureDisplay from "../BigPicture/BigPicture";

const specTarget = {
    drop(props, monitor, component) {
        let dragFinishEleCoordinate = monitor.getSourceClientOffset(); //拖拽后鼠标相对body的位置
        if (dragFinishEleCoordinate && dragFinishEleCoordinate !== null && dragFinishEleCoordinate !== undefined) {
            const item = monitor.getItem(); //拖拽的元素信息
            let {id} = item;
            const defalutFontSize = TkGlobal.windowInnerWidth / TkConstant.STANDARDSIZE;
            let dragEle = document.getElementById(id); //拖拽的元素
            let dragEleW = dragEle.clientWidth;
            let dragEleH = dragEle.clientHeight;
            let content = document.getElementById('lc-full-vessel'); //白板拖拽区域
            let contentW = content.clientWidth;
            let contentH = content.clientHeight;
            /*拖拽元素不能拖出白板区*/
            let dragEleOffsetLeft = dragFinishEleCoordinate.x;
            let dragEleOffsetTop = dragFinishEleCoordinate.y;
            let dragEleLeft,dragEleTop;
            if (TkGlobal.mainContainerFull || TkGlobal.isVideoInFullscreen) {//如果白板区全屏
                if (dragEleOffsetLeft < 0) {
                    dragEleOffsetLeft = 0;
                }else if (dragEleOffsetLeft > (contentW-dragEleW)) {
                    dragEleOffsetLeft = contentW-dragEleW;
                }
                if (dragEleOffsetTop < 0) {
                    dragEleOffsetTop = 0;
                }else if (dragEleOffsetTop > (contentH - dragEleH)) {
                    dragEleOffsetTop = contentH - dragEleH;
                }
                /*计算位置百分比*/
                dragEleLeft = dragEleOffsetLeft/(contentW - dragEleW);
                dragEleTop = dragEleOffsetTop/(contentH - dragEleH);
            }else {//白板区没有全屏
                if (dragEleOffsetLeft < TkGlobal.dragRange.left*defalutFontSize) {
                    dragEleOffsetLeft = TkGlobal.dragRange.left*defalutFontSize;
                }else if (dragEleOffsetLeft > (TkGlobal.dragRange.left*defalutFontSize+contentW-dragEleW)) {
                    dragEleOffsetLeft = TkGlobal.dragRange.left*defalutFontSize+contentW-dragEleW;
                }
                if (dragEleOffsetTop < TkGlobal.dragRange.top*defalutFontSize) {
                    dragEleOffsetTop = TkGlobal.dragRange.top*defalutFontSize;
                }else if (dragEleOffsetTop > (TkGlobal.dragRange.top*defalutFontSize + contentH - dragEleH)) {
                    dragEleOffsetTop = TkGlobal.dragRange.top*defalutFontSize + contentH - dragEleH;
                }
                /*计算位置百分比*/
                dragEleLeft = (dragEleOffsetLeft - TkGlobal.dragRange.left*defalutFontSize)/(contentW - dragEleW);
                dragEleTop = (dragEleOffsetTop - TkGlobal.dragRange.top*defalutFontSize)/(contentH - dragEleH);
            }
            dragEleLeft = (isNaN(dragEleLeft) || dragEleLeft === Infinity || dragEleLeft === null )?0:dragEleLeft;
            dragEleTop = (isNaN(dragEleTop) || dragEleTop === Infinity || dragEleTop === null )?0:dragEleTop;
            let dragEleStyle = { //相对白板区位置的百分比
                percentTop: dragEleTop,
                percentLeft: dragEleLeft,
                isDrag: true,
            };
            if(id === 'page_wrap' || id === 'lc_tool_container' || id === 'timerDrag' || id === 'dialDrag' || id === 'answerDrag' || id === 'moreBlackboardDrag' || id === 'responderDrag' || id === 'studentResponderDrag' || id === 'coursewareRemarks') {
                eventObjectDefine.CoreController.dispatchEvent({ //自己本地改变拖拽的video位置
                    type: 'otherDropTarget',
                    message: {data: {id: item.id, style: dragEleStyle}},
                });
            } else {
                eventObjectDefine.CoreController.dispatchEvent({ //自己本地和通知别人改变拖拽的video位置
                    type: 'changeOtherVideoStyle',
                    message: {data: {style: dragEleStyle, id: id} , initiative:true},
                });
            }
        }
    },
    canDrop(props, monitor) { //拖拽元素不能拖出白板区
        let {isDrag} = props;
        /*const item = monitor.getItem();
        let dragFinishEleCoordinate = monitor.getSourceClientOffset();//拖拽后元素相对body的位置
        let dragEle = document.getElementById(item.id);//拖拽的元素
        let content = document.getElementById('lc-full-vessel');//白板拖拽区域
        const defalutFontSize = TkGlobal.windowInnerWidth / TkConstant.STANDARDSIZE ;
        //获取拖拽的元素宽高：
        let dragEleW = dragEle.clientWidth;
        let dragEleH = dragEle.clientHeight;
        //获取白板区域宽高：
        let contentW = content.clientWidth;
        let contentH = content.clientHeight;
        //功能条宽度：
        let toolContainerW = TkGlobal.dragRange.left*defalutFontSize;
        //头部高度：
        let headerH = TkGlobal.dragRange.top*defalutFontSize;
        if (dragFinishEleCoordinate.y > headerH + contentH - dragEleH) {
            return false;
        }else {
            return true;
        }*/
        return true;
    },
};
/*Call页面*/
class TkCall extends React.Component{
    constructor(props){
        super(props);
        this.state = {
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
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomConnected ,that.handlerRoomConnected.bind(that), that.listernerBackupid ) ;//roomConnected事件：白板处理
        eventObjectDefine.CoreController.addEventListener( 'updateSystemStyleJson' , that.handlerUpdateSystemStyleJson.bind(that));
        eventObjectDefine.CoreController.dispatchEvent({type: 'loadSupernatantPrompt' , message:{show:true , content:TkGlobal.language.languageData.loadSupernatantPrompt.loadRooming }  });
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        let that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid );
    };


    handlerRoomConnected(){
        this.setState({updateState:!this.state.updateState});
    };

    handlerUpdateSystemStyleJson(){
        this.setState({updateState:!this.state.updateState});
    };

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
            let hrefSessionStorage  = L.Utils.sessionStorage.getItem(time);
            if (hrefSessionStorage) {
                window.location.href =  TkUtils.decrypt( hrefSessionStorage );
            }
        }
    };

    mouseLeave(event) {
        if( !CoreController.handler.getAppPermissions('isChangeVideoSize') ){return ;} ;
        if (TkGlobal.isVideoStretch === true) {
            if (TkGlobal.changeVideoSizeMouseUpEventName && TkGlobal.changeVideoSizeMouseUpEventName !== null) {
                eventObjectDefine.CoreController.dispatchEvent({type:TkGlobal.changeVideoSizeMouseUpEventName, message:{data:{event:event}},});
            }
        }
    };
    mouseMove (event) {
        if( !CoreController.handler.getAppPermissions('isChangeVideoSize') ){return ;} ;
        if (TkGlobal.changeVideoSizeEventName && TkGlobal.changeVideoSizeEventName !== null) {
            eventObjectDefine.CoreController.dispatchEvent({type:TkGlobal.changeVideoSizeEventName, message:{data:{event:event}},},false);
        }
    };
    mouseUp (event) {
        if( !CoreController.handler.getAppPermissions('isChangeVideoSize') ){return ;} ;
        //如果您想以一个异步的方式来访问事件属性，您应该对事件调用event.persist()。这将从事件池中取出合成的事件，并允许该事件的引用，使用户的代码被保留
        event.persist();//TkGlobal.changeVideoSizeMouseUpEventName
        if (TkGlobal.changeVideoSizeMouseUpEventName && TkGlobal.changeVideoSizeMouseUpEventName !== null) {
            eventObjectDefine.CoreController.dispatchEvent({type:TkGlobal.changeVideoSizeMouseUpEventName, message:{data:{event:event}},});
        }
    };

    render(){
        const that = this ;
        const {connectDropTarget} = that.props;
        let {HeaderVesselSmartStyleJson={}  , RightVesselSmartStyleJson={} , BottomVesselSmartStyleJson={} , LeftToolBarVesselSmartStyleJson ={} , RightContentVesselSmartStyleJson ={} , DesktopShareSmartStyleJson = {},
        ToolExtendListVesselSmartStyleJson = {} } = TkGlobal.systemStyleJson ;
        CoreController.handler.updateLoadModuleJson('LeftToolBarVesselSmart' ,  !TkGlobal.playback && !TkConstant.hasRole.roleAudit  );
        return connectDropTarget(
            <section  onMouseUp={this.mouseUp.bind(that)} onMouseMove={that.mouseMove.bind(that)} onMouseLeave={that.mouseLeave.bind(that)} className="add-position-relative" id="room"  style={{width:'100%' , height:'100%'}}>
                <article  className="all-wrap clear-float" id="all_wrap" onClick={that.callAllWrapOnClick.bind(that) } >
                    {/*系统内部组件 start*/}
                    <HeaderVesselSmart styleJson={HeaderVesselSmartStyleJson} />   {/*头部header*/}
                    <RightVesselSmart styleJson={RightVesselSmartStyleJson}  />
                    <BottomVesselSmart styleJson={BottomVesselSmartStyleJson}  />
                    { TkGlobal.loadModuleJson.LeftToolBarVesselSmart ? <LeftToolBarVesselSmart styleJson={LeftToolBarVesselSmartStyleJson}  /> : undefined }
                    <RightContentVesselSmart styleJson={RightContentVesselSmartStyleJson}  />
                    <DesktopShareSmart styleJson={DesktopShareSmartStyleJson}  />
                    <GiftAnimationSmart /> {/*礼物动画*/}
                    { TkGlobal.loadModuleJson.LeftToolBarVesselSmart ?<ToolExtendListVesselSmart styleJson={ToolExtendListVesselSmartStyleJson}   />: undefined } {/*工具按钮对应的List列表Smart模块*/}
                    {/*系统内部组件 end*/}


                    {/*拓展组件 start*/}
                    <Help/>{/*xueln 帮助组件*/}
                    <ReconnectingSmart /> {/*重新连接*/}
                    <LoadSupernatantPromptSmart /> {/*正在加载浮层*/}
                    <BigPictureDisplay/>{/*双击聊天区图片变大浮层*/}
                    <SupernatantDynamicPptVideoSmart /> {/*动态PPT正在播放浮层*/}
                    <RemoteControlDetectionDeviceSmart isEnter={false} clearFinsh={true}  handlerOkCallback={undefined} backgroundColor='rgba(0,0,0,0.5)'  okText={TkGlobal.language.languageData.login.language.detection.button.ok.text}  titleText={TkGlobal.language.languageData.login.language.detection.deviceTestHeader.deviceSwitch.text} saveLocalStorage={false}  />
                    <LxNotification/>{/*提示弹框*/}
                    {!(TkGlobal.isBroadcast && !TkGlobal.isClient)?<JoinDetectionDeviceSmart isEneter={false} saveLocalStorage={false} clearFinsh={true} handlerOkCallback={that.handlerOkCallback.bind(that)}  backgroundColor='rgba(0,0,0,0.5)' okText={TkGlobal.language.languageData.login.language.detection.button.ok.text} titleText={TkGlobal.language.languageData.login.language.detection.deviceTestHeader.deviceSwitch.text} /> : undefined}{/*设备切换*/}
                    {/*拓展组件 end*/}
                </article>
            </section>
        )
    }
};
const callDropTarget = DropTarget('talkDrag', specTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
}))(TkCall);
export default  DragDropContext(HTML5Backend)(callDropTarget);
// export default DragDropContext(HTML5Backend)(TkCall);