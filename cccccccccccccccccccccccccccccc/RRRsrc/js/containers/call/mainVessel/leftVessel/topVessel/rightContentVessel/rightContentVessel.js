/**
 * 顶部部分-右侧内容Smart模块
 * @module RightContentVesselSmart
 * @description   承载顶部部分-右侧内容的承载容器
 * @author QiuShao
 * @date 2017/08/08
 */
'use strict';
import React from 'react';
import { DropTarget } from 'react-dnd';
import TkGlobal from 'TkGlobal' ;
import TkUtils from 'TkUtils' ;
import TkConstant from 'TkConstant' ;
import eventObjectDefine from 'eventObjectDefine';
import CoreController from 'CoreController';
import ServiceSignalling from 'ServiceSignalling';
import WhiteboardAndNewpptSmart from '../../../../../whiteboardAndNewppt/whiteboardAndNewppt' ;
import PagingToolBarSmart from './pagingToolBar/pagingToolBar' ;
import CoursewareRemarks from './pagingToolBar/coursewareRemarks/coursewareRemarks' ;
import TimeRemindSmart from './timeRemind/timeRemind' ;
import WhiteboardToolAndControlOverallBarSmart from './whiteboardToolAndControlOverallBar/whiteboardToolAndControlOverallBar' ;
import Video from '../../../../../video';
import TimerTeachingToolSmart from './whiteboardToolAndControlOverallBar/teachingToolBoxBarCompontent/timerTeachingToolComponent';
import DialTeachingToolSmart from './whiteboardToolAndControlOverallBar/teachingToolBoxBarCompontent/dialTeachingToolComponent';
import AnswerTeachingToolSmart from './whiteboardToolAndControlOverallBar/teachingToolBoxBarCompontent/answerTeachingToolComponent';
import ResponderTeachingToolSmart from './whiteboardToolAndControlOverallBar/teachingToolBoxBarCompontent/responderTeacherToolComponent';
import ResponderStudentToolSmart from './whiteboardToolAndControlOverallBar/teachingToolBoxBarCompontent/responderStudentToolCompontent';
import MoreBlackboardSmart from '../../../../../whiteboardAndNewppt/balckBoard/moreBlackBoard';
import BlackboardThumbnailImageSmart from '../../../../../whiteboardAndNewppt/balckBoard/blackboardThumbnailImage';
import Inform from '../../../../../displayPanel/inform';
import ProgrammShareComponent from './whiteboardToolAndControlOverallBar/teachingToolBoxBarCompontent/programmShareCompontent'

/*const specTarget = {
    drop(props, monitor, component) {
        let dragFinishEleCoordinate = monitor.getSourceClientOffset();//拖拽后元素相对body的位置
        const item = monitor.getItem();//拖拽的元素信息
        let { id} = item;
        const defalutFontSize = TkGlobal.windowInnerWidth / TkConstant.STANDARDSIZE ;
        let dragEle = document.getElementById(id);//拖拽的元素
        let dragEleW = dragEle.clientWidth;
        let dragEleH = dragEle.clientHeight;
        let content = document.getElementById('lc-full-vessel');//白板拖拽区域
        let contentW = content.clientWidth;
        let contentH = content.clientHeight;
        /!*拖拽元素不能拖出白板区*!/
        let dragEleOffsetLeft = dragFinishEleCoordinate.x;
        let dragEleOffsetTop = dragFinishEleCoordinate.y;
        let dragEleLeft,dragEleTop;
        if (TkGlobal.mainContainerFull) {//如果白板区全屏
            if (dragFinishEleCoordinate.x < 0) {
                dragEleOffsetLeft = 0;
            }else if (dragFinishEleCoordinate.x > (contentW-dragEleW)) {
                dragEleOffsetLeft = contentW-dragEleW;
            }
            if (dragFinishEleCoordinate.y < 0) {
                dragEleOffsetTop = 0;
            }else if (dragFinishEleCoordinate.y > (contentH - dragEleH)) {
                dragEleOffsetTop = contentH - dragEleH;
            }
            /!*计算位置百分比*!/
            dragEleLeft = dragEleOffsetLeft/(contentW - dragEleW);
            dragEleTop = dragEleOffsetTop/(contentH - dragEleH);
        }else {//白板区没有全屏
            if (dragFinishEleCoordinate.x < TkGlobal.dragRange.left*defalutFontSize) {
                dragEleOffsetLeft = TkGlobal.dragRange.left*defalutFontSize;
            }else if (dragFinishEleCoordinate.x > (TkGlobal.dragRange.left*defalutFontSize+contentW-dragEleW)) {
                dragEleOffsetLeft = TkGlobal.dragRange.left*defalutFontSize+contentW-dragEleW;
            }
            if (dragFinishEleCoordinate.y < TkGlobal.dragRange.top*defalutFontSize) {
                dragEleOffsetTop = TkGlobal.dragRange.top*defalutFontSize;
            }else if (dragFinishEleCoordinate.y > (TkGlobal.dragRange.top*defalutFontSize + contentH - dragEleH)) {
                dragEleOffsetTop = TkGlobal.dragRange.top*defalutFontSize + contentH - dragEleH;
            }
            /!*计算位置百分比*!/
            dragEleLeft = (dragEleOffsetLeft - TkGlobal.dragRange.left*defalutFontSize)/(contentW - dragEleW);
            dragEleTop = (dragEleOffsetTop - TkGlobal.dragRange.top*defalutFontSize)/(contentH - dragEleH);
        }
        dragEleLeft = (isNaN(dragEleLeft) || dragEleLeft === Infinity || dragEleLeft === null )?0:dragEleLeft;
        dragEleTop = (isNaN(dragEleTop) || dragEleTop === Infinity || dragEleTop === null )?0:dragEleTop;
        let dragEleStyle = {//相对白板区位置的百分比
            percentTop:dragEleTop,
            percentLeft:dragEleLeft,
            isDrag:true,
        };
        if (id === 'page_wrap' || id === 'lc_tool_container' || id === 'timerDrag' || id === 'dialDrag' || id === 'answerDrag' || id === 'moreBlackboardDrag' || id === 'responderDrag' || id === 'studentResponderDrag') {
            let {percentLeft,percentTop,isDrag} = dragEleStyle;
            component._changePagingToolStyle(id,percentLeft,percentTop,isDrag,true);
        }else {
            eventObjectDefine.CoreController.dispatchEvent({//自己本地和通知别人改变拖拽的video位置
                type:'changeOtherVideoStyle',
                message:{data: {style:dragEleStyle,id:id} , initiative:true },
            });
        }
    },
    canDrop(props, monitor) {//拖拽元素不能拖出白板区
        /!*const item = monitor.getItem();
        let dragFinishEleCoordinate = monitor.getSourceClientOffset();//拖拽后元素相对body的位置
        let dragEle = document.getElementById(item.id);//拖拽的元素
        let content = document.getElementById('content');//白板拖拽区域

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
        if (dragFinishEleCoordinate.x < toolContainerW || dragFinishEleCoordinate.x > toolContainerW+contentW-dragEleW || dragFinishEleCoordinate.y < headerH || dragFinishEleCoordinate.y > headerH + contentH - dragEleH) {
            return false;
        }else {
            return true;
        }*!/
        return true;
    },
};*/
// @DragDropContext(HTML5Backend)
class RightContentVesselSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loadTimeRemindSmart:false ,
            page_wrap:{
                percentLeft:0,
                percentTop:0,
                isDrag:false,
            },
            lc_tool_container:{
                percentLeft:0,
                percentTop:0,
                isDrag:false,
            },
            timerDrag:{//计时器
                percentLeft:0,
                percentTop:0,
                isDrag:false,
            },
            dialDrag:{//转盘
                percentLeft:0,
                percentTop:0,
                isDrag:false,
            },
            responderDrag:{//抢答器
                percentLeft:0.4,
                percentTop:0,
                isDrag:false,
            },
            studentResponderDrag:{//学生抢答器
                percentLeft:0.4,
                percentTop:0,
                isDrag:false,
            },
            answerDrag:{//答题卡
                percentLeft:0,
                percentTop:0,
                isDrag:false,
            },
            moreBlackboardDrag:{//小白板
                percentLeft:0,
                percentTop:0,
                isDrag:false,
            },
            coursewareRemarks:{//课件备注
                percentLeft:0,
                percentTop:0,
                isDrag:false,
            },
            informPanel: {  // 顶层通知栏
                text: undefined,
                href: undefined,
            },
            areaExchangeFlag: false,
            isVideoInFullscreenFile:false,
        };
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this;
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomConnected, that.handlerRoomConnected.bind(that)  , that.listernerBackupid ); //Room-Connected事件：房间连接事件
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPubmsg ,that.handlerRoomPubmsg.bind(that)  ,  that.listernerBackupid ) ;//room-pubmsg事件：拖拽动作处理
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that), that.listernerBackupid); //roomDelmsg事件
        eventObjectDefine.CoreController.addEventListener( "initDragEleTranstion" , that.initDragEleTranstion.bind(that), that.listernerBackupid);//初始化拖拽元素的位置
        eventObjectDefine.CoreController.addEventListener( "changeDragEleTranstion" , that.changeDragEleTranstion.bind(that), that.listernerBackupid);//改变拖拽元素的位置
        eventObjectDefine.CoreController.addEventListener( "receive-msglist-BlackBoardDrag" , that.handlerMsglistBlackBoardDrag.bind(that), that.listernerBackupid);//msglist,后面进来的人收到小黑板的拖拽位置
        eventObjectDefine.CoreController.addEventListener( "receive-msglist-DialDrag" , that.handlerMsglistDialDrag.bind(that), that.listernerBackupid);//msglist,后面进来的人收到转盘的拖拽位置
        eventObjectDefine.CoreController.addEventListener( "receive-msglist-TimerDrag" , that.handlerMsglistTimerDrag.bind(that), that.listernerBackupid);//msglist,后面进来的人收到转盘的拖拽位置/*--tkpc2.0.8--*/
        eventObjectDefine.CoreController.addEventListener( "receive-msglist-AnswerDrag" , that.handlerMsglistAnswerDrag.bind(that), that.listernerBackupid);//msglist,后面进来的人收到转盘的拖拽位置/*--tkpc2.0.8--*/
        eventObjectDefine.CoreController.addEventListener( "receive-msglist-ResponderDrag" , that.handlerMsglistResponderDrag.bind(that), that.listernerBackupid);//msglist,后面进来的人收到抢答器的拖拽位置
        eventObjectDefine.CoreController.addEventListener('receive-msglist-FullScreen' , that.handlerMsglistFullScreen.bind(that)  , that.listernerBackupid);//msglist,处理课件全屏
        eventObjectDefine.CoreController.addEventListener( "otherDropTarget" , that.handlerOtherDropTarget.bind(that), that.listernerBackupid);//监听其他拖放目标的拖放数据处理
        eventObjectDefine.CoreController.addEventListener( 'areaExchange', that.handlerAreaExchange.bind(that) ,that.listernerBackupid  ); // 区域交换事件监听

    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        const that = this ;
        eventObjectDefine.CoreController.removeBackupListerner( that.listernerBackupid );
    };

    componentDidUpdate(prevProps , prevState){ //在组件完成更新后立即调用,在初始化时不会被调用
        if( !TkUtils.lowclassCompareJsonIsCommon(prevProps.styleJson ,this.props.styleJson ) ){
            eventObjectDefine.CoreController.dispatchEvent({type:"resizeHandler"});
            eventObjectDefine.CoreController.dispatchEvent({type:"resizeMediaVideoHandler"});
            eventObjectDefine.CoreController.dispatchEvent({type:"changeMainContentVesselSmartSize" , message:{bottomVesselSmartHeightRem:this.props.bottomVesselSmartHeightRem}});
        }
    };

    handlerAreaExchange(){
        this.setState({
            areaExchangeFlag: !this.state.areaExchangeFlag,
        });
    }

    handlerRoomConnected() {
        this.setState({ loadTimeRemindSmart:CoreController.handler.getAppPermissions('loadClassbeginRemind') });
    };

    handlerRoomPubmsg(recvEventData) {
        let pubmsgData = recvEventData.message;
        switch (pubmsgData.name) {
            case 'BlackBoardDrag'://小白板的拖拽
                this.state.moreBlackboardDrag = pubmsgData.data;
                this.setState({moreBlackboardDrag:this.state.moreBlackboardDrag});
                break;
            case 'DialDrag'://转盘的拖拽
                this.state.dialDrag = pubmsgData.data;
                this.setState({dialDrag:this.state.dialDrag});
                break;
            case 'TimerDrag'://计时器的拖拽/*--tkpc2.0.8--start*/
                this.state.timerDrag = pubmsgData.data;
                this.setState({timerDrag:this.state.timerDrag});
                break;
            case 'AnswerDrag'://答题卡的拖拽
                this.state.answerDrag = pubmsgData.data;
                this.setState({answerDrag:this.state.answerDrag});
                break;/*--tkpc2.0.8--end*/
            case 'ResponderDrag'://抢答器的拖拽
                this.state.responderDrag = pubmsgData.data;
                this.state.studentResponderDrag = pubmsgData.data;
                this.setState({
                    responderDrag:this.state.responderDrag,
                    studentResponderDrag:this.state.studentResponderDrag,
                });
                break;
            case "LiveNoticeInform":
                if( TkGlobal.isBroadcast ){//是直播的话才处理
                    //通知
                    this.setState({
                        informPanel: eventData.message.data
                    });
                }
                break;
            case "FullScreen":
                if (pubmsgData.data.fullScreenType === 'courseware_file' || pubmsgData.data.fullScreenType === 'stream_media') {
                    this.setState({isVideoInFullscreenFile:true});
                    eventObjectDefine.CoreController.dispatchEvent({type:"resizeHandler"});
                }else {
                    this.setState({isVideoInFullscreenFile:false});
                }
                break;
        }
    };
    handlerRoomDelmsg(recvEventData) {
        const that = this;
        let pubmsgData = recvEventData.message;
        switch(pubmsgData.name) {
            case "FullScreen":
                if (this.state.isVideoInFullscreenFile) {
                    this.setState({isVideoInFullscreenFile:false});
                    eventObjectDefine.CoreController.dispatchEvent({type:"resizeHandler"});
                }
                break;
        }
    };
    /*--msglist--start*/
    handlerMsglistBlackBoardDrag(handleData) {//msglist,小黑板的拖拽位置
        let blackBoardDragInfo = handleData.message.BlackBoardDragArray;
        blackBoardDragInfo.map((item,index)=>{
            this.state.moreBlackboardDrag = item.data;
            this.setState({moreBlackboardDrag:this.state.moreBlackboardDrag});
        });
    };
    handlerMsglistDialDrag(handleData) {//msglist,转盘的拖拽位置
        let DialDragInfo = handleData.message.DialDragArray;
        DialDragInfo.map((item,index)=>{
            this.state.dialDrag = item.data;
            this.setState({dialDrag:this.state.dialDrag});
        });
    };
    handlerMsglistTimerDrag(handleData) {//msglist,计时器的拖拽位置
        let TimerDragInfo = handleData.message.TimerDragArray;
        TimerDragInfo.map((item,index)=>{
            this.state.timerDrag = item.data;
            this.setState({timerDrag:this.state.timerDrag});
        });
    };
    handlerMsglistAnswerDrag(handleData) {//msglist,答题卡的拖拽位置
        let AnswerDragInfo = handleData.message.AnswerDragArray;
        AnswerDragInfo.map((item,index)=>{
            this.state.answerDrag = item.data;
            this.setState({answerDrag:this.state.answerDrag});
        });
    };
    handlerMsglistResponderDrag(handleData) {//msglist,抢答器的拖拽位置
        let ResponderDragInfo = handleData.message.ResponderDragArray;
        ResponderDragInfo.map((item,index)=>{
            this.state.responderDrag = item.data;
            this.setState({responderDrag:this.state.responderDrag});
        });
    };
    handlerMsglistFullScreen(handleData) {//msglist,文档全屏画中画
        let data = handleData.message.FullScreenArray[0].data;
        if (data.fullScreenType === 'courseware_file' || data.fullScreenType === 'stream_media') {
            this.setState({isVideoInFullscreenFile:true});
            eventObjectDefine.CoreController.dispatchEvent({type:"resizeHandler"});
        }
    }
    /*--msglist--end*/
    handlerOtherDropTarget(handleData) {//处理其他拖放目标的拖放数据处理
        let dropInfo = handleData.message.data;
        let {percentLeft,percentTop,isDrag} = dropInfo.style;
        let isSendSignalling = true;
        this._changePagingToolStyle(dropInfo.id,percentLeft,percentTop,isDrag,isSendSignalling);
    };
    initDragEleTranstion(handleData) {//初始化拖拽元素的位置
        let {id,percentLeft,percentTop} = handleData.message.data;
        let isSendSignalling = handleData.message.isSendSignalling;//是否发送信令
        this._changePagingToolStyle(id,percentLeft,percentTop,undefined,isSendSignalling);
    };
    changeDragEleTranstion(handleData) {//改变拖拽元素的位置
        let {id,percentLeft,percentTop} = handleData.message.data;
        let isSendSignalling = handleData.message.isSendSignalling;//是否发送信令
        this._changePagingToolStyle(id,percentLeft,percentTop,true,isSendSignalling);
    };
    handleCloseInform(){
        this.setState({
            informPanel: {
                text: undefined,
                href: undefined
            }
        });
    };
    _changePagingToolStyle(id,percentLeft,percentTop,isDrag,isSendSignalling) {//白板区工具的拖拽
        this.state[id]={                              
            percentLeft:percentLeft,
            percentTop:percentTop,
            isDrag:isDrag || false,
        };
        this.setState({[id]:{
            percentLeft:percentLeft,
            percentTop:percentTop,
            isDrag:isDrag || false,
        }});
        if (isSendSignalling === true) {
            if (TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant) {
                switch (id) {
                    case 'moreBlackboardDrag'://小黑板
                        eventObjectDefine.CoreController.dispatchEvent({type:'isSendSignallingFromBlackBoardDrag', message:{data:this.state.moreBlackboardDrag}});
                        break;
                    case 'dialDrag'://转盘
                        ServiceSignalling.sendSignallingFromDialDrag(this.state[id]);
                        break;
                    case 'responderDrag'://抢答器
                        ServiceSignalling.sendSignallingFromResponderDrag(this.state[id]);
                        break;
                    case 'timerDrag'://计时器
                        ServiceSignalling.sendSignallingFromTimerDrag(this.state[id]);
                        break;
                    case 'answerDrag'://答题卡
                        ServiceSignalling.sendSignallingFromAnswerDrag(this.state[id]);
                        break;
                }
            }
        }
    };

    render(){
        let that = this ;
        // const {connectDropTarget} = that.props;
        let {loadTimeRemindSmart,isVideoInFullscreenFile} = that.state ;
        return (
            <article style={this.props.styleJson}  id="content" className={"lc-container add-position-relative add-fl " + (this.state.areaExchangeFlag ? 'areaExchange' : '')}>
            {/*白板以及动态PPT等区域*/}
                <div   id="lc-full-vessel" className={"add-position-relative lc-full-vessel " + (isVideoInFullscreenFile?" pictureInPicture big":"")} >
                    <Inform data={that.state.informPanel} handleClose={that.handleCloseInform.bind(that)}/>
                    <WhiteboardAndNewpptSmart /> {/*白板以及动态PPT组件*/}
                    <MoreBlackboardSmart id="moreBlackboardDrag"  blackboardThumbnailImageId={"blackboardThumbnailImageId"} blackboardCanvasBackgroundColor={"#ffffff"}   {...that.state.moreBlackboardDrag}   />{/*多黑板组件*/}
                    <BlackboardThumbnailImageSmart blackboardThumbnailImageId={"blackboardThumbnailImageId"} blackboardThumbnailImageBackgroundColor={"#ffffff"} blackboardThumbnailImageWidth={"2rem"}  />{/*多黑板缩略图组件*/}
                    { (!TkGlobal.playback && loadTimeRemindSmart ) ? <TimeRemindSmart roomConnected={loadTimeRemindSmart} /> : undefined  } {/*提示信息*/}
                     <Video />   {/*视频悬浮窗口*/}
                     <PagingToolBarSmart id="page_wrap" {...that.state.page_wrap} /> {/*白板以及动态ppt下面工具条*/}
                    { !TkGlobal.playback ? <WhiteboardToolAndControlOverallBarSmart id="lc_tool_container" {...that.state.lc_tool_container}/> : undefined }{/*白板工具栏以及全体操作功能栏*/}
                    <TimerTeachingToolSmart id="timerDrag" {...that.state.timerDrag}/>
                    <DialTeachingToolSmart id="dialDrag" {...that.state.dialDrag}/>
                    <AnswerTeachingToolSmart id="answerDrag" {...that.state.answerDrag}/>
                   	<ResponderTeachingToolSmart id="responderDrag" {...that.state.responderDrag}/>
                    <ResponderStudentToolSmart  id="studentResponderDrag" {...that.state.studentResponderDrag}/>
                    <CoursewareRemarks id="coursewareRemarks" {...that.state.coursewareRemarks}/>
                    <ProgrammShareComponent />
                </div>
            </article>
        )
    };
}
RightContentVesselSmart.defaultProps = {
    systemHideTime:0 ,
};
/*export default  DropTarget('talkDrag', specTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
}))(RightContentVesselSmart);*/

export default RightContentVesselSmart

