/**
 * 多黑板组件
 * @module MoreBlackboardSmart
 * @description   提供 多黑板的组件
 * @author QiuShao
 * @date 2017/7/27
 */
'use strict';
import React from 'react';
import ReactDom from 'react-dom';
import eventObjectDefine from 'eventObjectDefine';
import TkConstant from 'TkConstant';
import TkGlobal from 'TkGlobal';
import TkUtils from 'TkUtils';
import CoreController from 'CoreController';
import ServiceSignalling from 'ServiceSignalling';
import ServiceRoom from 'ServiceRoom';
import BlackboardSmart from './blackboard';
import { DragSource } from 'react-dnd';

let outBlackBoardState = '_none';
const specSource = {
    beginDrag(props, monitor, component) {
        const { id, percentLeft,percentTop } = props;
        return { id, percentLeft,percentTop };
    },
    canDrag(props, monitor) {
        // (outBlackBoardState !== '_dispenseed' && outBlackBoardState !== '_againDispenseed')
        if (TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant || ((TkConstant.hasRole.roleStudent|| TkConstant.hasRole.rolePatrol) && outBlackBoardState !== '_recycle')) {
            return true;
        }else {
            return false;
        }
    },
};

function collect(connect, monitor) {
    return {
        connectDragPreview: connect.dragPreview(),
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
        isCanDrag:monitor.canDrag(),
    };
}

class MoreBlackboardSmart extends React.Component{
    constructor(props){
        super(props);
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
        this.state = Object.assign({} , this._getDefaultState() , {
            show:false ,
            moreBlackboardDrag:{
                pagingToolLeft:"",
                pagingToolTop:"",
            },
        });
        this.blackboardCanvasBackgroundColor = this.props.blackboardCanvasBackgroundColor || "#ffffff";
        this.blackboardThumbnailImageId = this.props.blackboardThumbnailImageId ||  'blackboardThumbnailImageId';
        this.associatedMsgID = 'BlackBoard';
        this.currentTapKey = undefined ;
        this.whiteboardMagnification = 16 /9 ;
        this.maxBlackboardNumber = 8 ; //超过7个后显示左右按钮
    };

    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        let that = this ;
        eventObjectDefine.Window.addEventListener(TkConstant.EVENTTYPE.WindowEvent.onResize , that.handlerOnResize.bind(that)   , that.listernerBackupid); //window.resize事件：白板处理
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPubmsg ,that.handlerRoomPubmsg.bind(that) , that.listernerBackupid ); //roomPubmsg 事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDelmsg ,that.handlerRoomDelmsg.bind(that) , that.listernerBackupid ); //roomPubmsg 事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomParticipantJoin ,that.handlerRoomParticipantJoin.bind(that) , that.listernerBackupid ); //roomParticipantJoin 事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomParticipantLeave ,that.handlerRoomParticipantLeave.bind(that) , that.listernerBackupid ); //roomParticipantLeave 事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDisconnected ,that.handlerRoomDisconnected.bind(that) , that.listernerBackupid ); //roomDisconnected 事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPlaybackClearAll ,that.handlerRoomPlaybackClearAll.bind(that) , that.listernerBackupid ); //roomDisconnected 事件
        eventObjectDefine.CoreController.addEventListener('receive-msglist-BlackBoard' ,that.handlerReceive_msglist_BlackBoard.bind(that)  , that.listernerBackupid );
        eventObjectDefine.CoreController.addEventListener("resizeHandler" ,that.handlerResizeHandler.bind(that) , that.listernerBackupid); //接收resizeHandler事件执行resizeHandler
        eventObjectDefine.CoreController.addEventListener("isSendSignallingFromBlackBoardDrag" ,that.handlerBlackBoardDrag.bind(that) , that.listernerBackupid); //接收小黑板的拖拽信息
        eventObjectDefine.CoreController.addEventListener("updateBlackboardThumbnailImageFromBlackboardThumbnailImage" ,that.handlerUpdateBlackboardThumbnailImageFromBlackboardThumbnailImage.bind(that) , that.listernerBackupid); //接收小黑板的缩略图信息
        eventObjectDefine.CoreController.addEventListener('changeBottomVesselSmartHeightRem' , that.changeBottomVesselSmartHeightRem.bind(that)  , that.listernerBackupid) ; //改变视频框占底部的ul的高度的事件

        this._init();
    };

    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        let that = this ;
        clearTimeout( this.disabledBlackboardToolBtnTimer ) ;
        eventObjectDefine.Window.removeBackupListerner(that.listernerBackupid);
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid);
    };

    componentDidUpdate(prevProps , prevState){ //在组件完成更新后立即调用,在初始化时不会被调用
        if(prevState.show !== this.state.show && this.state.show){
            this._updateContainerWidthAndHeight();
        }
        if(prevState.blackBoardState !== this.state.blackBoardState){
            this._updateBlackBoardDescListByBlackBoardState();
            this._updateContainerWidthAndHeight();
        }
    };
    changeBottomVesselSmartHeightRem() {
        this.handlerOnResize();
    }

    handlerUpdateBlackboardThumbnailImageFromBlackboardThumbnailImage(recvEventData){
        let {action} = recvEventData.message ;
        this.blackboardThumbnailImageClick({action:action ,initiative:false});
    };

    handlerRoomPlaybackClearAll(){
        this._recoverDedaultState();
    };

    handlerRoomDisconnected(){
        this._recoverDedaultState();
    };

    handlerRoomParticipantJoin(){
        this._updateBlackBoardDescListByBlackBoardState();
    };

    handlerRoomParticipantLeave(){
        this._updateBlackBoardDescListByBlackBoardState();
    };

    handlerOnResize(){
        this._updateContainerWidthAndHeight();
        if( TK.SDKTYPE !== 'mobile' ){
            let that = this;
            let {percentLeft,percentTop,id,isDrag} = this.props;
            TkUtils.getPagingToolLT(that,percentLeft,percentTop,id,isDrag);
            this.setState({[id]:this.state[id]});
        }
    };

    handlerResizeHandler(recvEventData){
        this._updateContainerWidthAndHeight();
    };

    handlerReceive_msglist_BlackBoard(recvEventData){
        this.handlerRoomPubmsg(recvEventData);
    };

    handlerRoomPubmsg(recvEventData){
        let pubmsgData = recvEventData.message;
        switch (pubmsgData.name) {
            case "BlackBoard":
                if( (TkConstant.hasRole.roleChairman ||  TkConstant.hasRole.roleTeachingAssistant) && this.state.useToolColor  === undefined ){
                    this.setState({
                        useToolColor:'#FF0000'
                    });
                }else if( !(TkConstant.hasRole.roleChairman ||  TkConstant.hasRole.roleTeachingAssistant) && this.state.useToolColor  === undefined ){
                    this.setState({
                        useToolColor:'#000000'
                    });
                }
                if( ( (TkConstant.hasRole.roleChairman ||  TkConstant.hasRole.roleTeachingAssistant ||  TkConstant.hasRole.rolePatrol || TkConstant.hasRole.rolePlayback ) && pubmsgData.data.blackBoardState !== '_none' )
                    || (pubmsgData.data.blackBoardState === '_dispenseed' || pubmsgData.data.blackBoardState === '_recycle' || pubmsgData.data.blackBoardState === '_againDispenseed')  ){
                    this.setState({
                       show:true
                    });
                }
                let currentTapKey = this.currentTapKey ;
                let blackBoardState = this.state.blackBoardState  ;
                if(pubmsgData.data.currentTapKey !== undefined){
                    this.currentTapKey = pubmsgData.data.currentTapKey ;
                }
                if(pubmsgData.data.currentTapPage !== undefined && this.state.currentTapPage !== pubmsgData.data.currentTapPage ){
                    this.state.currentTapPage = pubmsgData.data.currentTapPage ;
                }
                outBlackBoardState = pubmsgData.data.blackBoardState;
                this.setState({
                    blackBoardState:pubmsgData.data.blackBoardState ,
                    updateState:!this.state.updateState ,
                    currentTapPage:this.state.currentTapPage ,
                });
                if( blackBoardState === pubmsgData.data.blackBoardState && currentTapKey !== pubmsgData.data.currentTapKey){
                    if(  !(TkConstant.hasRole.roleStudent && ( pubmsgData.data.blackBoardState === '_dispenseed'  || pubmsgData.data.blackBoardState === '_againDispenseed'  ) )  ){
                        this._updateBlackBoardDescListByBlackBoardState();
                    }
                }
                break;
        }
    };

    handlerRoomDelmsg(recvEventData){
        let delmsgData = recvEventData.message;
        switch (delmsgData.name) {
            case "BlackBoard":
                this._recoverDedaultState();
                break;
            case "ClassBegin":
                this._recoverDedaultState();
                break;
        }
    };

    handlerBlackBoardDrag(handleData) {//接收小黑板的拖拽信息
        let BlackBoardDragInfo = handleData.message.data;
        if (this.state.blackBoardState === '_recycle') {//小黑板处于回收状态
            ServiceSignalling.sendSignallingFromBlackBoardDrag(BlackBoardDragInfo);
        }
    };

    handlerCloseClick(){
        /** todo 保存图片（文件夹级保存）--未完成
        ServiceTooltip.showConfirm(TkGlobal.language.languageData.header.tool.blackBoard.tip.saveImage , (answer)=>{
            if(answer){
                for(let value of Object.values( this.state.blackBoardDescList) ){
                    value.saveImage = true ;
                }
                this.setState({
                    blackBoardDescList:this.state.blackBoardDescList
                });
                let isDelMsg = true , data = {} ;
                ServiceSignalling.sendSignallingFromBlackBoard(data , isDelMsg);
            }else{
                let isDelMsg = true , data = {} ;
                ServiceSignalling.sendSignallingFromBlackBoard(data , isDelMsg);
            }
        });*/

        let isDelMsg = true , data = {} ;
        ServiceSignalling.sendSignallingFromBlackBoard(data , isDelMsg);
    };

    handlerBlackBoardDispatchClick(){
        let blackBoardState = undefined;
        let {percentLeft,percentTop,id,isDrag} = this.props;
        let data = {
            percentLeft:percentLeft,
            percentTop:percentTop,
            isDrag:true
        };
        if( this.state.blackBoardState === '_prepareing'){
            ServiceSignalling.sendSignallingFromBlackBoardDrag(data);//变成分发状态时同步小黑板位置
            blackBoardState = '_dispenseed' ;
        }else if( this.state.blackBoardState === '_dispenseed'){
            ServiceSignalling.sendSignallingFromBlackBoardDrag(data);//点击再次分发时同步小黑板位置
            blackBoardState = '_recycle';
        }else if( this.state.blackBoardState === '_recycle'){
            blackBoardState = '_againDispenseed';
        }else if( this.state.blackBoardState === '_againDispenseed'){
            ServiceSignalling.sendSignallingFromBlackBoardDrag(data);//点击再次分发时同步小黑板位置
            blackBoardState = '_recycle';
        }else  if( this.state.blackBoardState === '_none'){
            L.Logger.error('current blackBoardState is _none , can\'t execute blackBoardDispatchClick!');
            return ;
        }
        if(blackBoardState){
            let isDelMsg = false , data = {
                blackBoardState,  //_none:无 , _prepareing:准备中 , _dispenseed:分发 , _recycle:回收分发 , _againDispenseed:再次分发
                currentTapKey:this.currentTapKey ,
                currentTapPage:this.state.currentTapPage ,
            } ;
            ServiceSignalling.sendSignallingFromBlackBoard(data , isDelMsg);
        }
        this.setState({
            disabledBlackboardToolBtn:true
        });
        clearTimeout( this.disabledBlackboardToolBtnTimer ) ;
        this.disabledBlackboardToolBtnTimer = setTimeout(  () => {
            this.setState({
                disabledBlackboardToolBtn:false
            });
        } , 300);
    };

    handlerTabClick(instanceId){
        if(instanceId !== undefined){
            let isDelMsg = false , data = {
                blackBoardState:this.state.blackBoardState,  //_none:无 , _prepareing:准备中 , _dispenseed:分发 , _recycle:回收分发 , _againDispenseed:再次分发
                currentTapKey:instanceId ,
                currentTapPage:this.state.currentTapPage ,
            } ;
            ServiceSignalling.sendSignallingFromBlackBoard(data , isDelMsg);
        };
    };

    resizeWhiteboardSizeCallback(fatherContainerConfiguration){

    };

    handleToolClick(toolKey){
        if(toolKey === 'tool_pencil' || toolKey ==='tool_text' || toolKey ==='tool_eraser'){
            this.setState({
                useToolKey:toolKey
            });
        }
    };

    changeStrokeColorClick(colorValue){
        this.setState({
            useToolColor:colorValue
        });
    };

    onTapPrevOrNextClick(type , send=false){
        let blackboardNumber = Object.keys(this.state.blackBoardDescList).length;
        let totalPage = Math.ceil( blackboardNumber / (this.maxBlackboardNumber-1)) ;
        switch (type){
            case 'prev':
                this.state.currentTapPage--;
                break;
            case 'next':
                this.state.currentTapPage++;
                break ;
        }
        if(this.state.currentTapPage<1){
            this.state.currentTapPage = 1 ;
        }else if(this.state.currentTapPage  > totalPage){
            this.state.currentTapPage = totalPage;
        }
        if(send){
            let isDelMsg = false , data = {
                blackBoardState:this.state.blackBoardState ,  //_none:无 , _prepareing:准备中 , _dispenseed:分发 , _recycle:回收分发 , _againDispenseed:再次分发
                currentTapKey:this.currentTapKey ,
                currentTapPage:this.state.currentTapPage ,
            } ;
            ServiceSignalling.sendSignallingFromBlackBoard(data , isDelMsg);
        };
        this.setState({
            currentTapPage:this.state.currentTapPage
        });
    };

    layerIsShowOfIsDraging(isDragging) {
        if (isDragging) {
            // eventObjectDefine.CoreController.dispatchEvent({type:'layerIsShowOfDraging', message:{isDragging:isDragging},});
            //layerIsShowOfDraging = false;
            let newpptLayer = document.getElementById("ppt_not_click_newppt");
            let h5DocumentLayer = document.getElementById("h5Document-layer");
            if (newpptLayer) {
                newpptLayer.style.display = 'block';
            }
            if (h5DocumentLayer) {
                h5DocumentLayer.style.display = 'block';
            }
        }else {
            // eventObjectDefine.CoreController.dispatchEvent({type:'layerIsShowOfDraging', message:{isDragging:isDragging},});
            let newpptLayer = document.getElementById("ppt_not_click_newppt");
            let h5DocumentLayer = document.getElementById("h5Document-layer");
            if (newpptLayer) {
                newpptLayer.style.display = 'none';
            }
            if (h5DocumentLayer) {
                h5DocumentLayer.style.display = 'none';
            }
        }
    }

    blackboardThumbnailImageClick({action , initiative=true} = {}){
        if(this.state.blackBoardState !== '_none' ){
            switch (action){
                case 'shrink':
                    this.setState({blackboardThumbnailImage:this.blackboardThumbnailImageId });
                    if(initiative){
                        eventObjectDefine.CoreController.dispatchEvent({type:'updateBlackboardThumbnailImageFromMoreBlackboard' , message:{show:true ,blackboardThumbnailImageId:this.blackboardThumbnailImageId  , blackboardThumbnailImageBackgroundColor:this.blackboardCanvasBackgroundColor}});
                    }
                    break;
                case 'magnify':
                    this.setState({blackboardThumbnailImage:undefined });
                    if(initiative){
                        eventObjectDefine.CoreController.dispatchEvent({type:'updateBlackboardThumbnailImageFromMoreBlackboard' , message:{show:false,blackboardThumbnailImageId:this.blackboardThumbnailImageId  , blackboardThumbnailImageBackgroundColor:this.blackboardCanvasBackgroundColor}});
                    }
                    break;
            }
        }else{
            eventObjectDefine.CoreController.dispatchEvent({type:'updateBlackboardThumbnailImageFromMoreBlackboard' , message:{show:false ,blackboardThumbnailImageId:this.blackboardThumbnailImageId  , blackboardThumbnailImageBackgroundColor:this.blackboardCanvasBackgroundColor}});
        }
    };

    _init(){
        this._updateContainerWidthAndHeight();
    };

    _updateContainerWidthAndHeight(){
        let moreBlackboardEle = document.getElementById('blackboardContentBox');
        if(TK.SDKTYPE === 'mobile'){
            if(moreBlackboardEle){
                let width = moreBlackboardEle.clientWidth ;
                let height = moreBlackboardEle.clientHeight ;
                this.state.containerWidthAndHeight.width = width ;
                this.state.containerWidthAndHeight.height = height ;
                this.setState({
                    containerWidthAndHeight:this.state.containerWidthAndHeight
                });
            }
        }else if(TK.SDKTYPE === 'pc'){
            if(moreBlackboardEle){
                let width = moreBlackboardEle.clientWidth ;
                let height = width * (1/this.whiteboardMagnification) ;
                this.state.containerWidthAndHeight.width = width ;
                this.state.containerWidthAndHeight.height = height ;
                this.setState({
                    containerWidthAndHeight:this.state.containerWidthAndHeight
                });
            }
        }
    };

    _updateBlackBoardDescListByBlackBoardState(){
        if(ServiceRoom.getTkRoom()){
            let blackBoardDescList = this.state.blackBoardDescList;
            if( this.currentTapKey !== 'blackBoardCommon' &&  !ServiceRoom.getTkRoom().getUser(this.currentTapKey) ){ //users里面没有currentTapKey
                this.currentTapKey = 'blackBoardCommon' ;
            }
            if( this.state.blackBoardState === '_prepareing'){
                if(TkConstant.hasRole.roleChairman ||  TkConstant.hasRole.roleTeachingAssistant ||  TkConstant.hasRole.rolePatrol   || TkConstant.hasRole.rolePlayback ){
                    this.currentTapKey = 'blackBoardCommon' ;
                }
                blackBoardDescList = Object.assign({} , this._getBlackBoardCommon());
            }else if( this.state.blackBoardState === '_dispenseed' ||  this.state.blackBoardState === '_againDispenseed'){
                if(TkConstant.hasRole.roleStudent){
                    this.currentTapKey = ServiceRoom.getTkRoom().getMySelf().id ;
                }
                blackBoardDescList = Object.assign({} , this._getBlackBoardCommon() , this._getStudentBlackboard() );
            }else if( this.state.blackBoardState === '_recycle'){
                blackBoardDescList = Object.assign({} , this._getBlackBoardCommon() , this._getStudentBlackboard() );
            }else  if( this.state.blackBoardState === '_none'){
                blackBoardDescList = {} ;
            }
            let blackboardNumber = Object.keys(blackBoardDescList).length;
            let totalPage = Math.ceil( blackboardNumber / (this.maxBlackboardNumber-1)) ;
            if(this.state.currentTapPage<1){
                this.state.currentTapPage = 1 ;
            }else if(this.state.currentTapPage  > totalPage){
                this.state.currentTapPage = totalPage;
            }
            this.setState({
                blackBoardDescList:blackBoardDescList,
                currentTapPage:this.state.currentTapPage
            });
        }
    };

    _getStudentBlackboard(){
        let studentBlackboardList = {} ;
        for(let [key,value] of Object.entries( ServiceRoom.getTkRoom().getSpecifyRoleList(TkConstant.role.roleStudent) ) ){
            if(value.playbackLeaved){continue ;} ;
            studentBlackboardList[key] = {
                instanceId:key ,
                show:this.currentTapKey === key ,
                isBaseboard:false ,
                deawPermission: false ,
                dependenceBaseboardWhiteboardID:'blackBoardCommon' ,
                needLooadBaseboard:true ,
                saveImage:false ,
                nickname:value.nickname ,
            };
            if( TkConstant.role.roleStudent && (this.state.blackBoardState === '_dispenseed' || this.state.blackBoardState === '_againDispenseed' ) && ServiceRoom.getTkRoom().getMySelf().id ===  key ){
                studentBlackboardList[key]['deawPermission'] = true ;
            }
            if(  this.state.blackBoardState === '_recycle' &&  (TkConstant.hasRole.roleChairman ||  TkConstant.hasRole.roleTeachingAssistant) ){
                studentBlackboardList[key]['deawPermission'] = true ;
            }
        }
        return studentBlackboardList ;
    };

    _getBlackBoardCommon(extraJson){
        let blackBoardCommon = {
            blackBoardCommon:{
                instanceId:'blackBoardCommon' ,
                show:this.currentTapKey === 'blackBoardCommon' ,
                isBaseboard:this.state.blackBoardState === '_prepareing' ,
                deawPermission:TkConstant.hasRole.roleChairman ||  TkConstant.hasRole.roleTeachingAssistant ,
                dependenceBaseboardWhiteboardID:undefined ,
                needLooadBaseboard:false ,
                saveImage:false ,
                nickname:'blackBoardCommon' ,
            }
        };
        if(extraJson && typeof extraJson === 'object'){
            Object.assign(blackBoardCommon.blackBoardCommon ,extraJson ) ;
        }
        return blackBoardCommon  ;
    };

    _getDefaultState(){
        let defaultState = {
            blackBoardState:'_none' , //_none:无 , _prepareing:准备中 , _dispenseed:分发 , _recycle:回收分发 , _againDispenseed:再次分发
            disabledBlackboardToolBtn: false ,
            blackBoardDescList:{} ,
            useToolKey:'tool_pencil' ,
            useToolColor: TkConstant.hasRole.roleChairman === undefined ? undefined : ( (TkConstant.hasRole.roleChairman ||  TkConstant.hasRole.roleTeachingAssistant) ? '#FF0000' :  '#000000' ) ,
            containerWidthAndHeight:{
                width:0 ,
                height:0
            } ,
            updateState:false ,
            currentTapPage:1 ,
            blackboardToolsInfo:{pencil:5 , text:30 , eraser:30} ,
            selectBlackboardToolSizeId:'blackboard_size_small' ,
            blackboardThumbnailImage:undefined ,
        };
        return defaultState ;
    };

    _loadBlackBoardElementArray(blackBoardDescList){
        let users = undefined ;
        let tabContentBlackBoardElementArray = [] ;
        let tabBlackBoardElementArray = [] ;
        let useWidth = this.state.useToolKey ===  'tool_eraser' ? this.state.blackboardToolsInfo.eraser : this.state.blackboardToolsInfo.pencil ;
        let fontSize = this.state.blackboardToolsInfo.text ;
        let descArray = [];
        let blackBoardCommonDesc = undefined ;
        for( let desc of Object.values(blackBoardDescList) ){
            if(desc.instanceId !==  'blackBoardCommon'){
                descArray.push(desc);
            }else{
                blackBoardCommonDesc = desc ;
            }
        }
        descArray.sort(function(obj1, obj2){
            if (obj1 === undefined || !obj1.hasOwnProperty('instanceId') || obj2 === undefined || !obj2.hasOwnProperty('instanceId'))
                return 0;
            if ( obj1.instanceId  < obj2.instanceId) {
                return -1;
            } else if ( obj1.instanceId >  obj2.instanceId) {
                return 1;
            } else {
                return 0;
            }
        });
        if(blackBoardCommonDesc){
            descArray.unshift(blackBoardCommonDesc);
        }
        let blackboardNumber = Object.keys(blackBoardDescList).length;
        let optionTapWidth =  undefined ;
        let marginLeft = undefined ;
        let totalPage = Math.ceil( blackboardNumber / (this.maxBlackboardNumber-1) )  ;
        if(totalPage>1){
            optionTapWidth =  100 / (this.maxBlackboardNumber-1) ;
            if(totalPage === 1 || this.state.currentTapPage < totalPage){
                marginLeft = (this.state.currentTapPage-1)*(this.maxBlackboardNumber-1)*optionTapWidth ;
            }else{
                let difference = totalPage*(this.maxBlackboardNumber-1)-blackboardNumber ;
                marginLeft = ( (this.state.currentTapPage-1)*(this.maxBlackboardNumber-1) - difference )* optionTapWidth ;
            }
        }
        descArray.forEach( (value , index) => {
            if( value.instanceId === 'blackBoardCommon' || (value.instanceId !== 'blackBoardCommon' && ServiceRoom.getTkRoom() && ServiceRoom.getTkRoom().getUser(value.instanceId) ) ){
                let associatedUserID = undefined ;
                // let associatedUserID = value.instanceId!=='blackBoardCommon'?value.instanceId:undefined ;
                tabContentBlackBoardElementArray.push(
                    <li className="tab-content-option "  key={value.instanceId} style={{display:value.show?'block':'none'}} >
                        <BlackboardSmart containerWidthAndHeight={this.state.containerWidthAndHeight} resizeWhiteboardSizeCallback={this.resizeWhiteboardSizeCallback.bind(this)} instanceId={value.instanceId}
                             show={value.show} isBaseboard={value.isBaseboard}  deawPermission={value.deawPermission} dependenceBaseboardWhiteboardID={value.dependenceBaseboardWhiteboardID}
                             associatedMsgID={this.associatedMsgID} associatedUserID={associatedUserID} needLooadBaseboard={value.needLooadBaseboard}  saveImage={value.saveImage}
                             nickname={value.nickname} useToolKey={this.state.useToolKey} fontSize={fontSize} useToolColor={this.state.useToolColor}  pencilWidth={useWidth}
                             saveRedoStack={TkConstant.hasRole.roleChairman} imageThumbnailId={value.show?this.state.blackboardThumbnailImage : undefined}  backgroundColor={this.blackboardCanvasBackgroundColor}
                             imageThumbnailTipContent={TkGlobal.language.languageData.header.tool.blackBoard.content.blackboardHeadTitle}
                        />
                    </li>
                );
                tabBlackBoardElementArray.push(
                    <li style={{marginLeft:index===0?(marginLeft!==undefined?(-marginLeft)+'%':undefined) : undefined , width:optionTapWidth!==undefined?(optionTapWidth+'%'):undefined , maxWidth:optionTapWidth!==undefined?(optionTapWidth+'%'):undefined , minWidth:optionTapWidth!==undefined?(optionTapWidth+'%'):undefined }} className={"tap-option add-nowrap "+(value.show?'active':'') +( !(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant )?' disabled':' '  ) }   key={value.instanceId} onClick={ (TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant )? this.handlerTabClick.bind(this , value.instanceId) : undefined} >
                        <span className="text add-nowrap">{value.instanceId === 'blackBoardCommon'?TkGlobal.language.languageData.header.tool.blackBoard.toolBtn.commonTeacher  :  ServiceRoom.getTkRoom().getUser(value.instanceId).nickname }</span>
                    </li>
                );
            }
        });
        return{
            tabContentBlackBoardElementArray:tabContentBlackBoardElementArray ,
            tabBlackBoardElementArray:tabBlackBoardElementArray
        }
    };

    _loadToolColorsElementArray(){
        let colorsArray = [];
        let colors = ["#FF0000" , "#FFFF00" , "#00FF00" , "#00FFFF" , "#0000FF" , "#FF00FF" ,
            "#FE9401" , "#FF2C55" , "#007AFF" , "#7457F1" , "#626262" , "#000000"
        ] ;
        colors.forEach(  (item , index) => {
            colorsArray.push(
                <li className={"color-option " + (this.state.useToolColor === item ? ' active' : '') } key={index}  onClick={this.changeStrokeColorClick.bind( this , item )} style={{backgroundColor:item}}  id={"blackboard_color_"+this._colorFilter(item)} ></li>
            );
        });
        return{
            toolColorsArray:colorsArray
        }
    };

    _colorFilter(text){
        return text.replace(/#/g,"");
    };

    _recoverDedaultState(){
        clearTimeout( this.disabledBlackboardToolBtnTimer ) ;
        let defaultState = this._getDefaultState();
        this.currentTapKey = undefined ;
        this.setState( Object.assign({} , defaultState , {
            show:false ,
        }));
        eventObjectDefine.CoreController.dispatchEvent({type:'updateBlackboardThumbnailImageFromMoreBlackboard' , message:{show:false ,blackboardThumbnailImageId:this.blackboardThumbnailImageId  , blackboardThumbnailImageBackgroundColor:this.blackboardCanvasBackgroundColor}});
    };
    
    /*改变大小的点击事件*/
    _changeStrokeSizeClick(selectBlackboardToolSizeId , strokeJson ){
        this.setState({
            selectBlackboardToolSizeId:selectBlackboardToolSizeId ,
            blackboardToolsInfo:Object.assign(this.state.blackboardToolsInfo ,strokeJson ) ,
        });
    };

    render(){
        let that = this ;
        let {blackBoardState , show , blackBoardDescList , containerWidthAndHeight , useToolKey  , blackboardThumbnailImage} = that.state ;
        const {connectDragSource,connectDragPreview,isDragging,isCanDrag,percentLeft,percentTop,id,isDrag} = this.props;
        TkUtils.getPagingToolLT(that,percentLeft,percentTop,id,isDrag);
        let {pagingToolLeft,pagingToolTop} = that.state[id];
        this.layerIsShowOfIsDraging(isDragging);
        let blackboardToolBtnText =  (blackBoardState !== '_none') ? (
            (blackBoardState === '_prepareing') ?  TkGlobal.language.languageData.header.tool.blackBoard.toolBtn.dispenseed : (
                (blackBoardState === '_dispenseed') ? TkGlobal.language.languageData.header.tool.blackBoard.toolBtn.recycle  : (
                    (blackBoardState === '_recycle') ? TkGlobal.language.languageData.header.tool.blackBoard.toolBtn.againDispenseed  : (
                        (blackBoardState === '_againDispenseed') ?  TkGlobal.language.languageData.header.tool.blackBoard.toolBtn.recycle : ''
                    )
                )
            )
        ): '' ;
        let {tabContentBlackBoardElementArray , tabBlackBoardElementArray} = that._loadBlackBoardElementArray(blackBoardDescList);
        let {toolColorsArray} = that._loadToolColorsElementArray();
        let blackboardNumber = Object.keys(blackBoardDescList).length;
        let totalPage = Math.ceil( blackboardNumber / (that.maxBlackboardNumber-1) )  ;
        let tapContentStyle = undefined ;
        let hideTap = !(blackBoardState === '_recycle' || ( (blackBoardState === '_dispenseed' || blackBoardState === '_againDispenseed' ) &&   (TkConstant.hasRole.roleChairman ||  TkConstant.hasRole.roleTeachingAssistant || TkConstant.hasRole.rolePatrol || TkConstant.hasRole.rolePlayback)  )  ) ;
        let hideBottom = ( TkConstant.hasRole.rolePlayback || TkConstant.hasRole.rolePatrol  || ( TkConstant.hasRole.roleStudent && !(blackBoardState === '_dispenseed' || blackBoardState === '_againDispenseed' ) ) ) ;
        if(TK.SDKTYPE === 'mobile'){
            let ohterContentHeightRem = 0.44 ; //0.44:title , 0.46:bottom , tap:0.3452
            if(!hideTap){
                ohterContentHeightRem+=0.3452;
            }
            if(!hideBottom){
                ohterContentHeightRem+=0.46;
            }
            tapContentStyle = {
                height:'calc( 100% - '+ohterContentHeightRem+'rem )'
            };
        }
        return connectDragPreview(
                <section id={id} className="black-board-container"  style={{display:show?'block':'none',position:"absolute",left:(isDrag?pagingToolLeft:"0")+"rem",top:(isDrag?pagingToolTop:"0")+"rem" , opacity:(blackboardThumbnailImage === undefined ? undefined: 0 )  , zIndex:(blackboardThumbnailImage === undefined ? undefined: -999 )  }} >
                    {connectDragSource(
                        <article className="title-container" style={{cursor: ((TkConstant.hasRole.roleStudent|| TkConstant.hasRole.rolePatrol) && outBlackBoardState === '_recycle')?'default':'move'}}>
                            <span className="title">{TkGlobal.language.languageData.header.tool.blackBoard.content.blackboardHeadTitle}</span>
                            {TK.SDKTYPE === 'mobile'?<button className="blackboard-thumbnail-image" onClick={that.blackboardThumbnailImageClick.bind(that , {action:'shrink'})}  title={TkGlobal.language.languageData.header.tool.blackBoard.title.shrink}  >{TkGlobal.language.languageData.header.tool.blackBoard.title.shrink}</button>:undefined}
                            <button className="close"  style={{display:!(TkConstant.hasRole.roleChairman ||  TkConstant.hasRole.roleTeachingAssistant)?'none':''}}  title={TkGlobal.language.languageData.header.tool.blackBoard.title.close} onClick={that.handlerCloseClick.bind(that)} ></button>
                        </article>
                    )}
                    <article className="tap-container clear-float"   style={{display:hideTap?'none':''}}  >
                        <button className={"prev add-fl "+(that.state.currentTapPage<=1?'disabled':'')}  disabled={that.state.currentTapPage<=1}  style={{display: blackboardNumber < that.maxBlackboardNumber ?'none':''}}   title={TkGlobal.language.languageData.header.tool.blackBoard.title.prev} onClick={(!(that.state.currentTapPage<=1))?that.onTapPrevOrNextClick.bind(that , 'prev' , true):undefined}  ></button>
                        <ul className="tap add-fl clear-float"  >
                            {tabBlackBoardElementArray}
                        </ul>
                        <button className={"next add-fr "+(that.state.currentTapPage>=totalPage?'disabled':'')} disabled={that.state.currentTapPage>=totalPage} style={{display: blackboardNumber < that.maxBlackboardNumber ?'none':''}}   title={TkGlobal.language.languageData.header.tool.blackBoard.title.next} onClick={(!(that.state.currentTapPage>=totalPage))?that.onTapPrevOrNextClick.bind(that , 'next' , true):undefined}   ></button>
                    </article>
                    <article className="tab-content-container"  id="blackboardContentBox"  style={tapContentStyle} >
                        <ul style={{width:containerWidthAndHeight.width+'px' , height:containerWidthAndHeight.height +'px'}} className="tab-content clear-float overflow-hidden" >
                            {tabContentBlackBoardElementArray}
                        </ul>
                    </article>

                    <article id="blackboard-tool-container" className="blackboard-tool-container clear-float" style={{display:hideBottom ?'none':''}}  >
                        <ul className="blackboard-tool clear-float"   style={{display: ( TkConstant.hasRole.rolePlayback || TkConstant.hasRole.rolePatrol  || ( TkConstant.hasRole.roleStudent && !(blackBoardState === '_dispenseed' || blackBoardState === '_againDispenseed' ) ) )?'none':''}}   >
                            <li className="blackboard-tool-option" >
                                <button id="blackboard_tool_vessel_pencil" className={"tool-btn pencil-icon " + (useToolKey ===  'tool_pencil' ? ' active':'')} title={TkGlobal.language.languageData.header.tool.blackBoard.boardTool.pen }  onClick={that.handleToolClick.bind(that , 'tool_pencil')}  ></button>
                            </li>
                            <li className="blackboard-tool-option" >
                                <button id="blackboard_tool_vessel_text" className={"tool-btn text-icon"+ (useToolKey ===  'tool_text' ? ' active':'')}   title={TkGlobal.language.languageData.header.tool.blackBoard.boardTool.text }  onClick={that.handleToolClick.bind(that , 'tool_text')}  ></button>
                            </li>
                            <li className="blackboard-tool-option" >
                                <button id="blackboard_tool_vessel_eraser" className={"tool-btn eraser-icon"+ (useToolKey ===  'tool_eraser' ? ' active':'')}    title={TkGlobal.language.languageData.header.tool.blackBoard.boardTool.eraser }  onClick={that.handleToolClick.bind(that , 'tool_eraser')}  ></button>
                            </li>
                            <li className="blackboard-tool-option colors  add-position-relative" >
                                <button id="blackboard_tool_vessel_color" className="tool-btn colors-icon"   title={TkGlobal.language.languageData.header.tool.blackBoard.boardTool.color }  >
                                    <span className="current-color" style={{backgroundColor:this.state.useToolColor}} ></span>
                                </button>
                                <div className="blackboard-color-size-box">
                                    {/*<p className="blackboard-size-title">{TkGlobal.language.languageData.header.tool.colorAndMeasure.selectMeasure}</p>*/}
                                    <ul className="tool-size-container" id="blackboard_tool_size">
                                        <li id="blackboard_size_small" onClick={that._changeStrokeSizeClick.bind(that , 'blackboard_size_small' , {pencil:5 , text:30 , eraser:30 } ) } className={"size-small "+(this.state.selectBlackboardToolSizeId === 'blackboard_size_small'?'active':'')}  data-pencil-size="5"  data-text-size="30"  data-eraser-size="15">
                                            <span></span>
                                        </li>
                                        <li id="blackboard_size_middle" onClick={that._changeStrokeSizeClick.bind(that , 'blackboard_size_middle' , {pencil:15 , text:36 , eraser:90 } ) } className={"size-middle "+(this.state.selectBlackboardToolSizeId === 'blackboard_size_middle'?'active':'') }  data-pencil-size="15"  data-text-size="36"  data-eraser-size="45">
                                            <span></span>
                                        </li>
                                        <li id="blackboard_size_big" onClick={that._changeStrokeSizeClick.bind(that , 'blackboard_size_big' , {pencil:30 , text:72 , eraser:150 } ) } className={"size-big "+(this.state.selectBlackboardToolSizeId === 'blackboard_size_big'?'active':'')}  data-pencil-size="30"  data-text-size="72"  data-eraser-size="90">
                                            <span></span>
                                        </li>
                                    </ul>
                                    {/*<p className="colors-container-title">{TkGlobal.language.languageData.header.tool.colorAndMeasure.selectColorText}</p>*/}
	                                <ol className="colors-container">
	                                    {toolColorsArray}
	                                </ol>
                                </div>
                                
                            </li>
                        </ul>
                        <button  style={{display:!(TkConstant.hasRole.roleChairman ||  TkConstant.hasRole.roleTeachingAssistant)?'none':''}}   className={"blackboard-send-btn " + (this.state.disabledBlackboardToolBtn ? 'disabled':'' ) } disabled={this.state.disabledBlackboardToolBtn}  onClick={that.handlerBlackBoardDispatchClick.bind(that)} >{blackboardToolBtnText}</button>
                    </article>
                </section>
        )
    };
};
export default DragSource('talkDrag', specSource, collect)(MoreBlackboardSmart);


