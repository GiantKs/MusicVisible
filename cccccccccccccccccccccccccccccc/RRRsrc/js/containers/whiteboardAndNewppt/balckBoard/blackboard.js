/**
 * 白板组件
 * @module WhiteboardSmart
 * @description   提供 白板的组件
 * @author QiuShao
 * @date 2017/7/27
 */
'use strict';
import React from 'react';
import PropTypes  from 'prop-types';
import eventObjectDefine from 'eventObjectDefine';
import TkUtils from 'TkUtils';
import TkGlobal from 'TkGlobal';
import ServiceSignalling from 'ServiceSignalling';
import HandlerWhiteboardAndCoreInstance from '../plugs/literally/js/handlerWhiteboardAndCore';

class BlackboardSmart extends React.Component{
    constructor(props){
        super(props);
        this.containerWidthAndHeight =  Object.customAssign({} , this.props.containerWidthAndHeight);
        this.instanceId = this.props.instanceId !== undefined ? this.props.instanceId : 'whiteboard_default' ;
        this.whiteboardElementId = 'whiteboard_container_'+ this.instanceId;
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
        this.showRemoteRemindContent = this.props.showRemoteRemindContent !== undefined ? this.props.showRemoteRemindContent : TkGlobal.showRemoteRemindContent ; //是否显示远程提示内容
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        let that = this ;
        eventObjectDefine.CoreController.addEventListener("resizeHandler" ,that.handlerResizeHandler.bind(that) , that.listernerBackupid); //接收resizeHandler事件执行resizeHandler
        that._lcInit();
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        let that = this ;
        if(that.props.saveImage){
            HandlerWhiteboardAndCoreInstance.downCanvasImageToLocalFile(that.instanceId);
        }
        HandlerWhiteboardAndCoreInstance.destroyWhiteboardInstance(that.instanceId);
        eventObjectDefine.Window.removeBackupListerner(that.listernerBackupid);
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid);
    };
    componentDidUpdate(prevProps , prevState){ //在组件完成更新后立即调用,在初始化时不会被调用
        let that = this ;
        if(prevProps.show !== this.props.show && this.props.show){
            HandlerWhiteboardAndCoreInstance.resizeWhiteboardHandler(that.instanceId) ;
        }
        if(that.props.containerWidthAndHeight && (that.props.containerWidthAndHeight.width !==  that.containerWidthAndHeight.width || that.props.containerWidthAndHeight.height !==  that.containerWidthAndHeight.height ) ){
            Object.customAssign(that.containerWidthAndHeight , that.props.containerWidthAndHeight );
            HandlerWhiteboardAndCoreInstance.updateContainerWidthAndHeight(that.instanceId , that.containerWidthAndHeight ) ;
        }
        if(that.props.isBaseboard !== prevProps.isBaseboard  ){
            HandlerWhiteboardAndCoreInstance.updateIsBaseboard(that.instanceId , that.props.isBaseboard ) ;
        };
        if(that.props.watermarkImageScalc !== prevProps.watermarkImageScalc  ){
            HandlerWhiteboardAndCoreInstance.updateWhiteboardWatermarkImageScalc(that.instanceId , that.props.watermarkImageScalc ) ;
        };
        if(that.props.dependenceBaseboardWhiteboardID !== prevProps.dependenceBaseboardWhiteboardID  ){
            HandlerWhiteboardAndCoreInstance.updateDependenceBaseboardWhiteboardID(that.instanceId , that.props.dependenceBaseboardWhiteboardID ) ;
        };
        if(that.props.deawPermission !== prevProps.deawPermission){
            HandlerWhiteboardAndCoreInstance.changeWhiteboardDeawPermission( that.props.deawPermission , that.instanceId ) ;
        };
        if(that.props.useToolKey !== prevProps.useToolKey){
            HandlerWhiteboardAndCoreInstance.activeWhiteboardTool(that.props.useToolKey , that.instanceId);
        }
        if(that.props.useToolColor !== prevProps.useToolColor){
            HandlerWhiteboardAndCoreInstance.updateColor(that.instanceId , {primary:that.props.useToolColor} );
        }
        if(that.props.pencilWidth !== prevProps.pencilWidth){
            HandlerWhiteboardAndCoreInstance.updatePencilWidth(that.instanceId , {pencilWidth:that.props.pencilWidth} );
        }
        if(that.props.saveRedoStack !== prevProps.saveRedoStack){
            HandlerWhiteboardAndCoreInstance.updateWhiteboardSaveRedoStackAndSaveUndoStack(that.instanceId , {saveRedoStack:that.props.saveRedoStack } );
        }
        if(that.props.fontSize !== prevProps.fontSize){
            HandlerWhiteboardAndCoreInstance.updateTextFont(that.instanceId , {fontSize:that.props.fontSize});
        }
        if(that.props.imageThumbnailId !== prevProps.imageThumbnailId){
            HandlerWhiteboardAndCoreInstance.updateImageThumbnailId(that.instanceId , that.props.imageThumbnailId);
        }
        if(that.props.backgroundColor !== prevProps.backgroundColor){
            HandlerWhiteboardAndCoreInstance.updateColor(that.instanceId , {background:that.props.backgroundColor});
        }
    };
    handlerResizeHandler(recvEventData){
        const that = this ;
        if(recvEventData&& recvEventData.message&&recvEventData.message.eleWHPercent!=undefined){
            HandlerWhiteboardAndCoreInstance.updateWhiteboardMagnification( that.instanceId , recvEventData.message.eleWHPercent  );
        }
    };
    sendSignallingToServer(signallingName ,id , toID ,  data , do_not_save , expiresabs  , associatedMsgID , associatedUserID){
        let isDelMsg = false ;
        ServiceSignalling.sendSignallingFromSharpsChange(isDelMsg , signallingName ,id , toID ,  data , do_not_save , expiresabs  , associatedMsgID , associatedUserID);
    };
    delSignallingToServer(signallingName ,id , toID ,  data){
        let isDelMsg = true ;
        ServiceSignalling.sendSignallingFromSharpsChange(isDelMsg , signallingName ,id , toID ,  data );
    };
    resizeWhiteboardSizeCallback(fatherContainerConfiguration){
        if(this.props.resizeWhiteboardSizeCallback && typeof this.props.resizeWhiteboardSizeCallback === 'function'){
            this.props.resizeWhiteboardSizeCallback(fatherContainerConfiguration);
        }
    };
    noticeUpdateToolDescCallback(registerWhiteboardToolsList){
        // eventObjectDefine.CoreController.dispatchEvent({type:'commonWhiteboardTool_noticeUpdateToolDesc' , message:{registerWhiteboardToolsList}});
    };

    _lcInit(){ //白板初始化
        let that = this ;
        if( ! HandlerWhiteboardAndCoreInstance.hasWhiteboardById(that.instanceId) ){
            let whiteboardInstanceData = {
                whiteboardElementId:that.whiteboardElementId ,
                id:that.instanceId ,
                productionOptions:{
                    proprietaryTools:true ,
                    isBaseboard:this.props.isBaseboard ,
                    dependenceBaseboardWhiteboardID:this.props.dependenceBaseboardWhiteboardID ,
                    deawPermission:this.props.deawPermission ,
                    containerWidthAndHeight:this.props.containerWidthAndHeight ,
                    associatedMsgID:this.props.associatedMsgID ,
                    associatedUserID:this.props.associatedUserID ,
                    needLooadBaseboard:this.props.needLooadBaseboard ,
                    nickname:this.props.nickname ,
                    useToolKey:this.props.useToolKey ,
                    saveRedoStack:this.props.saveRedoStack ,
                    imageThumbnailId:this.props.imageThumbnailId,
                    backgroundColor:this.props.backgroundColor ,
                    imageThumbnailTipContent:this.props.imageThumbnailTipContent ,
                    showRemoteRemindContent:this.showRemoteRemindContent ,
                },
                handler:{
                    sendSignallingToServer:that.sendSignallingToServer.bind(that) ,
                    delSignallingToServer:that.delSignallingToServer.bind(that) ,
                    resizeWhiteboardSizeCallback:that.resizeWhiteboardSizeCallback.bind(that) ,
                    noticeUpdateToolDescCallback:that.noticeUpdateToolDescCallback.bind(that) ,
                }
            } ;
            if(this.props.watermarkImageScalc){
                whiteboardInstanceData.productionOptions.watermarkImageScalc = this.props.watermarkImageScalc ;
            }
            let toolsDesc = {
                tool_pencil:{} ,
                tool_eraser:{} ,
                tool_text:{} ,
            };
            HandlerWhiteboardAndCoreInstance.productionWhiteboard(whiteboardInstanceData);
            HandlerWhiteboardAndCoreInstance.registerWhiteboardTools(that.instanceId , toolsDesc);
            HandlerWhiteboardAndCoreInstance.clearRedoAndUndoStack(that.instanceId);
            if( !HandlerWhiteboardAndCoreInstance.hasWhiteboardFiledata(that.instanceId) ){
                HandlerWhiteboardAndCoreInstance.updateWhiteboardFiledata(that.instanceId , HandlerWhiteboardAndCoreInstance.getWhiteboardDefaultFiledata({
                    fileid:this.instanceId,
                    filetype: 'blackboard'  ,
                    filename: 'blackboard' ,
                }) ) ;
            };
            HandlerWhiteboardAndCoreInstance.loadCurrpageWhiteboard(that.instanceId);
            HandlerWhiteboardAndCoreInstance.resizeWhiteboardHandler(that.instanceId);
            HandlerWhiteboardAndCoreInstance.updateTextFont(that.instanceId , {fontSize:that.props.fontSize});
            HandlerWhiteboardAndCoreInstance.updateColor(that.instanceId , {primary:that.props.useToolColor} );
            HandlerWhiteboardAndCoreInstance.updatePencilWidth(that.instanceId , {pencilWidth:that.props.pencilWidth} );
            /*HandlerWhiteboardAndCoreInstance.updateEraserWidth(that.instanceId , {eraserWidth:that.props.eraserWidth} );*/
        }
    };

    render(){
        let that = this ;
        let { show , ...other} = that.props ;
        return (
            <div id={that.whiteboardElementId} style={{display:show?'block':'none'}} className={"overflow-hidden  scroll-literally-container " }    {...TkUtils.filterContainDataAttribute(other)}   ></div>
        )
    };
};
BlackboardSmart.propTypes = {
    instanceId:PropTypes.string.isRequired ,
    containerWidthAndHeight:PropTypes.object.isRequired ,
    isBaseboard:PropTypes.bool.isRequired ,
    deawPermission:PropTypes.bool.isRequired ,
};
export default BlackboardSmart ;


