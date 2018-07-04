/**
 * Created by weijin on 2017/12/28.
 */
/**
 * 右侧内容-白板标注工具以及全员操作的Smart组件
 * @module WhiteboardToolAndControlOverallBarSmart
 * @description   承载右侧内容-白板标注工具以及全员操作的所有Smart组件
 * @author QiuShao
 * @date 2017/08/14
 */
'use strict';
import React from 'react';
import { DragSource } from 'react-dnd';
import eventObjectDefine from 'eventObjectDefine';
import TkUtils from 'TkUtils' ;
import TkGlobal from "TkGlobal";
import CoreController from 'CoreController' ;

const specSource = {
    beginDrag(props, monitor, component) {
        const { id, percentLeft,percentTop } = props;
        return { id, percentLeft,percentTop };
    },
};

function collect(connect, monitor) {
    return {
        connectDragPreview: connect.dragPreview(),
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}


class CoursewareRemarks extends React.Component{
    constructor(props){
        super(props);
        let {id} = this.props;
        this.state = {
            [id]:{
                pagingToolLeft:"",
                pagingToolTop:"",
            },
            isShowRemarksBox:false,
            remarksInfo:"",
        };
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
    };

    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this ;
        eventObjectDefine.Window.addEventListener( TkConstant.EVENTTYPE.WindowEvent.onResize , this.handlerOnResize.bind(this) , this.listernerBackupid );
        eventObjectDefine.Document.addEventListener(TkConstant.EVENTTYPE.DocumentEvent.onFullscreenchange , that.handlerOnFullscreenchange.bind(that)   , that.listernerBackupid); //document.onFullscreenchange事件
        eventObjectDefine.CoreController.addEventListener( 'resizeHandler' , this.handlerOnResize.bind(this) , this.listernerBackupid );
        eventObjectDefine.CoreController.addEventListener('changeMainContentVesselSmartSize' , that.changeMainContentVesselSmartSize.bind(that)  , that.listernerBackupid) ; //改变视频框占底部的ul的高度的事件
        eventObjectDefine.CoreController.addEventListener('handleHasRemarks' , that.handleHasRemarks.bind(that)  , that.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener('handleIsShowRemarksBox' , that.handleIsShowRemarksBox.bind(that)  , that.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener('renderRemarks' , that.renderRemarks.bind(that)  , that.listernerBackupid);
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        const that = this ;
        eventObjectDefine.Window.removeBackupListerner(this.listernerBackupid);
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid);
        eventObjectDefine.Document.removeBackupListerner(that.listernerBackupid );
    };
    /*添加全屏监测处理函数*/
    handlerOnFullscreenchange(){
        if(TK.SDKTYPE !== 'mobile' && (!TkUtils.tool.isFullScreenStatus() || (TkUtils.tool.getFullscreenElement().id && TkUtils.tool.getFullscreenElement().id == "lc-full-vessel"))){
            this.anewCountPosition();
        }
    };
    /*监听主体内容区高度改变*/
    changeMainContentVesselSmartSize() {
        this.anewCountPosition();
    }
    /*监听窗口改变*/
    handlerOnResize(){
        this.anewCountPosition();
    };
    /*重新计算拖拽的位置*/
    anewCountPosition() {
        let that = this;
        let {percentLeft,percentTop,id} = this.props;
        TkUtils.getPagingToolLT(that,percentLeft,percentTop,id);
        this.setState({[id]:this.state[id]});
    };
    /*是否有课件备注*/
    handleHasRemarks(handleData) {
        let hasRemarks = handleData.message.data.hasRemarks;
        let remarksInfo = handleData.message.data.remarksInfo;
        //初始化拖拽元素的位置
        let {id} = this.props;
        let percentLeft = 0;
        let percentTop = 0;
        eventObjectDefine.CoreController.dispatchEvent({type:'initDragEleTranstion', message:{data:{id,percentLeft,percentTop},isSendSignalling:false},});
        this.setState({
            isShowRemarksBox:hasRemarks,
            remarksInfo:remarksInfo,
        });
    }
    /*点击备注关闭*/
    remarksCloseClick() {
        this.setState({isShowRemarksBox:false});
        //初始化拖拽元素的位置
        let {id} = this.props;
        let percentLeft = 0;
        let percentTop = 0;
        eventObjectDefine.CoreController.dispatchEvent({type:'initDragEleTranstion', message:{data:{id,percentLeft,percentTop},isSendSignalling:false},});
    };
    /*监听课件备注是否显示*/
    handleIsShowRemarksBox(handleData) {
        let isShowRemarksBox = handleData.message.data.isShowRemarksBox;
        this.setState({isShowRemarksBox:isShowRemarksBox});
        if (!isShowRemarksBox) {
            //初始化拖拽元素的位置
            let {id} = this.props;
            let percentLeft = 0;
            let percentTop = 0;
            eventObjectDefine.CoreController.dispatchEvent({type:'initDragEleTranstion', message:{data:{id,percentLeft,percentTop},isSendSignalling:false},});
        }
    };
    /*render这个组件*/
    renderRemarks() {
        this.setState({isShowRemarksBox:this.state.isShowRemarksBox});
    };

    render(){
        let that = this ;
        const {connectDragSource,connectDragPreview,isDragging,percentLeft,percentTop,id,isDrag} = that.props;
        TkUtils.getPagingToolLT(that,percentLeft,percentTop,id);
        let {pagingToolLeft,pagingToolTop} = that.state[id];
        if (isDragging) {
            let newpptLayer = document.getElementById("ppt_not_click_newppt");
            let h5DocumentLayer = document.getElementById("h5Document-layer");
            if (newpptLayer) {
                newpptLayer.style.display = 'block';
            }
            if (h5DocumentLayer) {
                h5DocumentLayer.style.display = 'block';
            }
        }else {
            let newpptLayer = document.getElementById("ppt_not_click_newppt");
            let h5DocumentLayer = document.getElementById("h5Document-layer");
            if (newpptLayer) {
                newpptLayer.style.display = 'none';
            }
            if (h5DocumentLayer) {
                h5DocumentLayer.style.display = 'none';
            }
        }
        let pageWrapEle = document.querySelector('#page_wrap');
        let defalutFontSize = TkGlobal.windowInnerWidth / TkConstant.STANDARDSIZE ;
        let pageWrapEleWidth = pageWrapEle?pageWrapEle.clientWidth/defalutFontSize:0;
        let remarksStyle = {
            display:that.state.isShowRemarksBox && CoreController.handler.getAppPermissions('isShowCoursewareRemarks')?'block':'none',
            position:"absolute",
            left:isDrag?pagingToolLeft+"rem":'calc(((100% - 5.5rem) / 2) ' + '+ ' + ((pageWrapEleWidth/2)-0.25) +'rem)',
            top:isDrag?pagingToolTop+"rem":undefined,
        };
        return connectDragPreview(
            <div id={id} className="courseware-remarks-box" style={remarksStyle} >
                {connectDragSource(
                    <div className="remarks-title">
                        <p className="remarks-title-text">{TkGlobal.language.languageData.coursewareRemarks.remarks}</p>
                        <button className="remarks-close" onClick={that.remarksCloseClick.bind(that)} title={TkGlobal.language.languageData.coursewareRemarks.close}></button>
                    </div>
                )}
                <div className="remarks-content">
                    {that.state.remarksInfo}
                </div>
            </div>
        )
    };
};
export default  DragSource('talkDrag', specSource, collect)(CoursewareRemarks);

