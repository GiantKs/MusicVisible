/**
 * 右侧内容-白板标注工具以及全员操作的Smart组件
 * @module WhiteboardToolAndControlOverallBarSmart
 * @description   承载右侧内容-白板标注工具以及全员操作的所有Smart组件
 * @author QiuShao
 * @date 2017/08/14
 */
'use strict';
import React from 'react';
import ControlOverallBarSmart from './controlOverallBar';
import WhiteboardToolBarSmart from './whiteboardToolBar';
import { DragSource } from 'react-dnd';
import eventObjectDefine from 'eventObjectDefine';
import TkUtils from 'TkUtils' ;

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


class WhiteboardToolAndControlOverallBarSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            lc_tool_container:{
                pagingToolLeft:"",
                pagingToolTop:"",
            },
        };
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
    };

    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        eventObjectDefine.Window.addEventListener( TkConstant.EVENTTYPE.WindowEvent.onResize , this.handlerOnResize.bind(this) , this.listernerBackupid );
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        eventObjectDefine.Window.removeBackupListerner(this.listernerBackupid);
    };
    handlerOnResize(){
        let that = this;
        let {percentLeft,percentTop,id,isDrag} = this.props;
        TkUtils.getPagingToolLT(that,percentLeft,percentTop,id,isDrag);
        this.setState({lc_tool_container:this.state.lc_tool_container});
    };

    render(){
        let that = this ;
        const {connectDragSource,isDragging,percentLeft,percentTop,id,isDrag} = that.props;
        TkUtils.getPagingToolLT(that,percentLeft,percentTop,id,isDrag);
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
        let lcToolContainerStyle = {
            position:"absolute",
            left:isDrag?pagingToolLeft+"rem":undefined,
            top:isDrag?pagingToolTop-0.4+"rem":undefined,
        };

        return connectDragSource(
            <div  id="lc_tool_container" className="lc-tool-container clear-float tk-tool-right" style={lcToolContainerStyle} >{/*白板工具栏以及全体操作功能栏*/}
                <ControlOverallBarSmart pagingToolLeft={pagingToolLeft}/>
                <WhiteboardToolBarSmart pagingToolLeft={pagingToolLeft}/>
            </div>
        )
    };
};
export default  DragSource('talkDrag', specSource, collect)(WhiteboardToolAndControlOverallBarSmart);

