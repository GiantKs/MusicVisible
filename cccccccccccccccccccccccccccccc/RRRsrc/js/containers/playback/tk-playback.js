/**
 * 组合回放playback页面的所有模块
 * @module TkPlayback
 * @description   提供call页面的所有模块的组合功能
 * @author QiuShao
 * @date 2017/7/27
 */

'use strict';
import React from 'react';
import { DragDropContext ,DragDropContextProvider ,DropTarget  } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import eventObjectDefine from 'eventObjectDefine' ;
import TkGlobal from 'TkGlobal' ;
import TkUtils from 'TkUtils' ;
import TkConstant from 'TkConstant' ;
import CoreController from 'CoreController';
import HeaderVesselSmart from '../call/headerVessel/headerVessel'
import ReconnectingSmart from '../call/supernatant/reconnecting';
import SupernatantDynamicPptVideoSmart from '../call/supernatant/supernatantDynamicPptVideo';
import LoadSupernatantPromptSmart from '../call/supernatant/loadSupernatantPrompt';
import LxNotification from '../LxNotification/LxNotification';
import RightVesselSmart from '../call/mainVessel/rightVessel/rightVessel';
import BottomVesselSmart from '../call/mainVessel/leftVessel/bottomVessel/bottomVessel';
import LeftToolBarVesselSmart from '../call/mainVessel/leftVessel/topVessel/leftToolBarVessel/leftToolBarVessel';
import RightContentVesselSmart from '../call/mainVessel/leftVessel/topVessel/rightContentVessel/rightContentVessel';
import DesktopShareSmart from "../call/desktopShare/desktopShareSmart";
import GiftAnimationSmart from '../call/mainVessel/leftVessel/giftAnimation/giftAnimation';
import PlaybackControlSmart from './playbackControl/playbackControl' ;
import "../../../css/tk-playback.css";

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
            if(id === 'page_wrap' || id === 'lc_tool_container' || id === 'timerDrag' || id === 'dialDrag' || id === 'answerDrag' || id === 'moreBlackboardDrag' || id === 'responderDrag' || id === 'studentResponderDrag') {
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
        return true;
    },
};

/*Call页面*/
class TkPlayback extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            updateState:false ,
        };
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
    };
    componentWillMount(){ //在初始化渲染执行之前立刻调用
        const that = this ;
        TkGlobal.playback = true ; //是否回放
        TkGlobal.playbackControllerHeight = '0.5rem' ;
        TkGlobal.routeName = 'playback' ; //路由的名字
        TkGlobal.isGetNetworkStatus = false ; //是否获取网络状态
        $(document.body).addClass('playback');
        that._refreshHandler();
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this ;
        if(!TkGlobal.isReload){
            eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomConnected ,that.handlerRoomConnected.bind(that), that.listernerBackupid ) ;//roomConnected事件：白板处理
            eventObjectDefine.CoreController.addEventListener( 'updateSystemStyleJson' , that.handlerUpdateSystemStyleJson.bind(that));
            let timestamp = new Date().getTime() ;
            let href = window.location.href ;
            L.Utils.sessionStorage.setItem(timestamp , TkUtils.encrypt( href ) );
            this.props.history.push('/replay?timestamp='+timestamp+'&reset=true' );
            eventObjectDefine.CoreController.dispatchEvent({type: 'loadSupernatantPrompt' , message:{show:true , content:TkGlobal.language.languageData.loadSupernatantPrompt.loadRoomingPlayback }  });
            CoreController.handler.initPlaybackInfo( { initPlaybackInfoAterCallback: ()=>{
                CoreController.handler.joinRoom(); //执行joinroom
            }}); //执行initPlaybackInfo

        }
    };
    componentWillUnmount(){ //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        const that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid );
    };

    handlerRoomConnected(){
        this.setState({updateState:!this.state.updateState});
    };

    handlerUpdateSystemStyleJson(){
        this.setState({updateState:!this.state.updateState});
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
        const {connectDropTarget} = that.props;
        let {HeaderVesselSmartStyleJson={}  , RightVesselSmartStyleJson={} , BottomVesselSmartStyleJson={} ,
            LeftToolBarVesselSmartStyleJson ={} , RightContentVesselSmartStyleJson ={} , DesktopShareSmartStyleJson = {} } = TkGlobal.systemStyleJson ;
        CoreController.handler.updateLoadModuleJson('LeftToolBarVesselSmart' ,  !TkGlobal.playback && !TkConstant.hasRole.roleAudit  );
        return connectDropTarget(
            <section  className="add-position-relative" id="room"  style={{width:'100%' , height:'100%'}} >
                <article  className="all-wrap clear-float disabled playback-all-container " id="all_wrap"  style={{disabled:true , height:'calc(100% - '+TkGlobal.playbackControllerHeight+')'}} >
                    {/*系统内部组件 start*/}
                    <HeaderVesselSmart styleJson={HeaderVesselSmartStyleJson} />   {/*头部header*/}
                    <RightVesselSmart styleJson={RightVesselSmartStyleJson}  />
                    <BottomVesselSmart styleJson={BottomVesselSmartStyleJson}  />
                    <RightContentVesselSmart styleJson={RightContentVesselSmartStyleJson}  />
                    <DesktopShareSmart styleJson={DesktopShareSmartStyleJson}  />
                    <GiftAnimationSmart /> {/*礼物动画*/}
                    {/*系统内部组件 end*/}

                    {/*拓展组件 start*/}
                    <ReconnectingSmart /> {/*重新连接*/}
                    <SupernatantDynamicPptVideoSmart /> {/*动态PPT正在播放浮层*/}
                    {/*拓展组件 end*/}
                    {/*<article className="playback-barrier-bed disabled"     style={{disabled:true}}  ></article>*/}
                </article>
                <PlaybackControlSmart /> {/*回放控制器*/}
                <LoadSupernatantPromptSmart /> {/*正在加载浮层*/}
                <LxNotification/>{/*提示弹框*/}
            </section>
        )
    }
};
const callDropTarget = DropTarget('talkDrag', specTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
}))(TkPlayback);
export default  DragDropContext(HTML5Backend)(callDropTarget);
