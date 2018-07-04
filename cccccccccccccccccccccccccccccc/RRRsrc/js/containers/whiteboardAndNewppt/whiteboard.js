/**
 * 白板组件
 * @module WhiteboardSmart
 * @description   提供 白板的组件
 * @author QiuShao
 * @date 2017/7/27
 */
'use strict';
import React  from 'react';
import PropTypes  from 'prop-types';
import eventObjectDefine from 'eventObjectDefine';
import TkConstant from 'TkConstant';
import TkGlobal from 'TkGlobal';
import TkUtils from 'TkUtils';
import CoreController from 'CoreController';
import ServiceSignalling from 'ServiceSignalling';
import HandlerWhiteboardAndCoreInstance from './plugs/literally/js/handlerWhiteboardAndCore';

class WhiteboardSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            show:true ,
            selectMouse:true  ,  //选中的标注工具默认是鼠标
        };
        this.containerWidthAndHeight = {width:0 , height:0};
        this.instanceId = this.props.instanceId !== undefined ? this.props.instanceId : 'default' ;
        this.whiteboardElementId = 'whiteboard_container_'+ this.instanceId;
        this.fileid = undefined ; //切换文件或者打开文件之前的文件id
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
        this.cacheMaxPageNum = 1;        //当前打开文档的缓存的最大页数，缺省为1
        this.cacheMinPageNum = 1;        //当前打开文档的缓存的最小页数，缺省为1
        this.filePreLoadCurrPage = 1;        //当前打开文档的缓存的当前页，缺省为1
        this.filePreLoadStep = 2;     //普通文档预加载步长，缺省为2
        this.showRemoteRemindContent = TkGlobal.showRemoteRemindContent ; //是否显示远程提示内容
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        let that = this ;
        eventObjectDefine.Window.addEventListener(TkConstant.EVENTTYPE.WindowEvent.onResize , that.handlerOnResize.bind(that)   , that.listernerBackupid); //window.resize事件：白板处理
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomConnected ,that.handlerRoomConnected.bind(that), that.listernerBackupid ) ;
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPubmsg ,that.handlerRoomPubmsg.bind(that), that.listernerBackupid ) ;//room-pubmsg事件：白板处理
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that) , that.listernerBackupid) ;//room-delmsg事件：白板处理
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDisconnected , that.handlerRoomDisconnected.bind(that) , that.listernerBackupid) ;//roomDisconnected事件：白板处理
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPlaybackClearAllFromPlaybackController,that.handlerRoomPlaybackClearAll.bind(that) , that.listernerBackupid); //roomPlaybackClearAll 事件：回放清除所有信令
        // eventObjectDefine.CoreController.addEventListener("save-lc-waiting-process-data" ,that.handlerSavelcWaitingProcessData.bind(that) , that.listernerBackupid); //保存白板待处理数据事件
        eventObjectDefine.CoreController.addEventListener("receive-msglist-ShowPage-lastDocument" ,that.handlerReceiveMsglistShowPageLastDocument.bind(that), that.listernerBackupid ); //接收ShowPage信令：白板处理
        eventObjectDefine.CoreController.addEventListener("saveLcStackToStorage" ,that.handlerSaveLcStackToStorage.bind(that), that.listernerBackupid ); //接收saveLcStackToStorage事件执行saveLcStackToStorage
        eventObjectDefine.CoreController.addEventListener("resizeHandler" ,that.handlerResizeHandler.bind(that) , that.listernerBackupid); //接收resizeHandler事件执行resizeHandler
        eventObjectDefine.CoreController.addEventListener("setFileDataToLcElement" ,that.handlerSetFileDataToLcElement.bind(that), that.listernerBackupid ); //接收setFileDataToLcElement事件执行setFileDataToLcElement
        eventObjectDefine.CoreController.addEventListener("getFileDataFromLcElement" ,that.handlerGetFileDataFromLcElement.bind(that), that.listernerBackupid ); //接收getFileDataFromLcElement事件执行getFileDataFromLcElement
        eventObjectDefine.CoreController.addEventListener("resetLcDefault" ,that.handlerResetLcDefault.bind(that) , that.listernerBackupid); //接收resetLcDefault事件执行resetLcDefault
        eventObjectDefine.CoreController.addEventListener("closeLoading" ,that.handlerCloseLoading.bind(that) , that.listernerBackupid); //接收closeLoading事件执行closeLoading
        eventObjectDefine.CoreController.addEventListener("updateLcScaleWhenAynicPPTInitHandler" ,that.handlerUpdateLcScaleWhenAynicPPTInitHandler.bind(that), that.listernerBackupid ); //接收updateLcScaleWhenAynicPPTInitHandler事件：根据动态PPT传过来的白板比例进行白板缩放
        eventObjectDefine.CoreController.addEventListener("recoverCurrpageLcData" ,that.handlerRecoverCurrpageLcData.bind(that) , that.listernerBackupid); //接收recoverCurrpageLcData事件执行recoverCurrpageLcData
        eventObjectDefine.CoreController.addEventListener("whiteboardPrevPage" ,that.handlerWhiteboardPrevPage.bind(that), that.listernerBackupid ); //接收whiteboardPrevPage事件上一页操作
        eventObjectDefine.CoreController.addEventListener("whiteboardNextPage" ,that.handlerWhiteboardNextPage.bind(that) , that.listernerBackupid); //接收whiteboardNextPage事件下一页操作
        eventObjectDefine.CoreController.addEventListener("whiteboardAddPage" ,that.handlerWhiteboardAddPage.bind(that) , that.listernerBackupid); //接收whiteboardAddPage事件加页操作
        eventObjectDefine.CoreController.addEventListener("updateAppPermissions_whiteboardPagingPage" ,that.handlerUpdateAppPermissions_whiteboardPagingPage.bind(that), that.listernerBackupid ); //updateAppPermissions_whiteboardPagingPage:更新白板翻页权限
        // eventObjectDefine.CoreController.addEventListener("initAppPermissions" ,that.handlerInitAppPermissions.bind(that) , that.listernerBackupid); //initAppPermissions：初始化权限处理
        eventObjectDefine.CoreController.addEventListener("initAppPermissionsOfWhiteboard" ,that.initAppPermissionsOfWhiteboard.bind(that) , that.listernerBackupid); //initAppPermissions：初始化权限处理//tkpc2.0.8
        eventObjectDefine.CoreController.addEventListener("openDocuemntOrMediaFile" ,that.handlerOpenDocuemntOrMediaFile.bind(that), that.listernerBackupid ); //openDocuemntOrMediaFile：打开文档或者媒体文件
        eventObjectDefine.CoreController.addEventListener("whiteboard_updateWhiteboardToolsInfo" ,that.handlerWhiteboard_updateWhiteboardToolsInfo.bind(that) , that.listernerBackupid); //whiteboard_updateWhiteboardToolsInfo：更新白板toolStatus
        eventObjectDefine.CoreController.addEventListener("whiteboard_updateTextFont" ,that.handlerWhiteboard_updateTextFont.bind(that) , that.listernerBackupid); //whiteboard_updateTextFont：执行白板uploadTextFont方法
        eventObjectDefine.CoreController.addEventListener("updateSelectMouse" ,that.handlerUpdateSelectMouse.bind(that), that.listernerBackupid ); //updateSelectMouse：选择的标注工具是否是鼠标
        eventObjectDefine.CoreController.addEventListener("checkSelectMouseState" ,that.handlerCheckSelectMouseState.bind(that), that.listernerBackupid ); //checkSelectMouseState：检测选中的标注工具是否是鼠标
        eventObjectDefine.CoreController.addEventListener("changeStrokeSize" ,that.handlerChangeStrokeSize.bind(that) , that.listernerBackupid); //changeStrokeSize：改变白板画笔等大小
        eventObjectDefine.CoreController.addEventListener("changeStrokeColor" ,that.handlerChangeStrokeColor.bind(that), that.listernerBackupid ); //changeStrokeColor：改变白板的画笔颜色
        eventObjectDefine.CoreController.addEventListener("updateAppPermissions_canDraw" ,that.handlerUpdateAppPermissions_canDraw.bind(that) , that.listernerBackupid); //updateAppPermissions_canDraw：白板可画权限更新
        eventObjectDefine.CoreController.addEventListener("updateAppPermissions_h5DocumentActionClick" ,that.handlerUpdateAppPermissions_h5DocumentActionClick.bind(that) , that.listernerBackupid);   //updateAppPermissions_h5DocumentActionClick：H5文档可点击权限更新
        eventObjectDefine.CoreController.addEventListener("updateAppPermissions_dynamicPptActionClick" ,that.handlerUpdateAppPermissions_dynamicPptActionClick.bind(that) , that.listernerBackupid);   //updateAppPermissions_dynamicPptActionClick：动态PPT可点击权限更新
        eventObjectDefine.CoreController.addEventListener("lcTextEditing" ,that.handlerLcTextEditing.bind(that) , that.listernerBackupid); //lcTextEditing：白板是否处于text的editing
        eventObjectDefine.CoreController.addEventListener("skipPage_general" ,that.handlerSkipPage_general.bind(that) , that.listernerBackupid); //skipPage_general：普通文档跳转
        eventObjectDefine.CoreController.addEventListener("preloadWhiteboardImg" ,that.handlerPreloadWhiteboardImg.bind(that) , that.listernerBackupid); //preloadWhiteboardImg：预加载白板图片
        eventObjectDefine.CoreController.addEventListener('receive-msglist-whiteboardMarkTool' ,that.handlerReceive_msglist_whiteboardMarkTool.bind(that)  , that.listernerBackupid ); //receive-msglist-whiteboardMarkTool
        eventObjectDefine.CoreController.addEventListener('whiteboard_activeCommonWhiteboardTool' ,that.handlerWhiteboard_activeCommonWhiteboardTool.bind(that)  , that.listernerBackupid ); //whiteboard_activeCommonWhiteboardTool
        eventObjectDefine.CoreController.addEventListener(  'receive-msglist-ClassBegin' , that.handlerReceiveMsglistClassBegin.bind(that) , that.listernerBackupid  ) ;
        that._lcInit();
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        let that = this ;
        eventObjectDefine.Window.removeBackupListerner(that.listernerBackupid);
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid);
        HandlerWhiteboardAndCoreInstance.destroyWhiteboardInstance(that.instanceId);
    };
    componentDidUpdate(prevProps , prevState){ //在组件完成更新后立即调用,在初始化时不会被调用
        if(prevState.selectMouse !==   this.state.selectMouse ){
            this.handlerCheckSelectMouseState();
        }
        if(prevState.show !==  this.state.show  && this.state.show  ){
            HandlerWhiteboardAndCoreInstance.checkWhiteboardCanvasSize(this.instanceId , {isResize:true});
        }
    }

    handlerReceiveMsglistClassBegin(recvEventData){
        HandlerWhiteboardAndCoreInstance.clearWhiteboardAllDataById(this.instanceId);
    };

    handlerRoomConnected(){
        if(  this.showRemoteRemindContent !== TkGlobal.showRemoteRemindContent){
            this.showRemoteRemindContent = TkGlobal.showRemoteRemindContent ;
            HandlerWhiteboardAndCoreInstance.updateShowRemindContent(this.instanceId , TkGlobal.showRemoteRemindContent);
        }
    };

    handlerOnResize(){ //window.resize事件：白板处理
        const that = this;
        if(that.props.fatherContainerId){
            let $fatherContainer = $("#"+that.props.fatherContainerId);
            if($fatherContainer && $fatherContainer.length>0){
                let containerWidthAndHeight = {
                    width:$fatherContainer.width() ,
                    height:$fatherContainer.height()
                };
                that.containerWidthAndHeight = containerWidthAndHeight ;
                HandlerWhiteboardAndCoreInstance.updateContainerWidthAndHeight(that.instanceId , containerWidthAndHeight ) ;
            }
        }
        HandlerWhiteboardAndCoreInstance.resizeWhiteboardHandler(that.instanceId);
    };
    handlerRoomPubmsg(pubmsgDataEvent){//room-pubmsg事件：白板处理
        let that = this ;
        let pubmsgData = pubmsgDataEvent.message ;
        switch(pubmsgData.name) {
            case "ClassBegin":
                HandlerWhiteboardAndCoreInstance.clearWhiteboardAllDataById(that.instanceId);
                break;
            case "ShowPage":
                let open =  that._saveFileidReturnOpen(pubmsgData.data);
                let tmpData = { message:{data:pubmsgData.data   , open:open  , source:'room-pubmsg'}};
                that._handlerReceiveShowPageSignalling(tmpData);
                break;
            case "whiteboardMarkTool":
                let { selectMouse } = pubmsgData.data ;
                that.handlerUpdateSelectMouse({type:'updateSelectMouse' , message:{selectMouse:selectMouse}});
                break;
            default:
                break;
        }
    };
    handlerReceive_msglist_whiteboardMarkTool(recvEventData){
        const that = this ;
        let pubmsgData = recvEventData.message ;
        let { selectMouse } = pubmsgData.data ;
        that.handlerUpdateSelectMouse({type:'updateSelectMouse' , message:{selectMouse:selectMouse}});
    };
    handlerRoomDelmsg(delmsgDataEvent){//room-delmsg事件：白板处理
        const that = this ;
        let delmsgData = delmsgDataEvent.message ;
        switch(delmsgData.name) {
            /*case "SharpsChange": //删除白板数据
                HandlerWhiteboardAndCoreInstance.handlerDelmsg_SharpsChange(delmsgData  );
                break;*/
            case "ClassBegin":
                if(!TkConstant.joinRoomInfo.isClassOverNotLeave && CoreController.handler.getAppPermissions('endClassbeginRevertToStartupLayout')) { //是否拥有下课重置界面权限
                    HandlerWhiteboardAndCoreInstance.clearWhiteboardAllDataById(that.instanceId);
                }
                break;
        }
    };
    handlerRoomPlaybackClearAll(){
        if(!TkGlobal.playback){L.Logger.error('No playback environment, no execution event[roomPlaybackClearAll] handler ') ;return ;};
        const that = this ;
        HandlerWhiteboardAndCoreInstance.clearWhiteboardAllDataById(that.instanceId);
    };
    handlerRoomDisconnected(recvEventData){
        const that = this ;
        HandlerWhiteboardAndCoreInstance.clearWhiteboardAllDataById(that.instanceId);
    };
    /* handlerSavelcWaitingProcessData(waitingProcessEventData){//保存白板待处理数据事件处理函数
        const that = this ;
        let {sharpsChangeArray} = waitingProcessEventData.message;
        HandlerWhiteboardAndCoreInstance.handlerMsglist_SharpsChange(sharpsChangeArray);
    };*/
    handlerReceiveMsglistShowPageLastDocument(showpageData){
        const that = this ;
        let open =  that._saveFileidReturnOpen(showpageData.message.data);
        showpageData.message.open = open ;
        that._handlerReceiveShowPageSignalling(showpageData);
    };
    handlerSaveLcStackToStorage(recvEventData){
        const that = this ;
        HandlerWhiteboardAndCoreInstance.saveWhiteboardStackToStorage(that.instanceId ,{
            saveRedoStack: TkConstant.hasRole.roleChairman  ,
        });
    } ;
    handlerResizeHandler(recvEventData){
        const that = this ;
        if(recvEventData&& recvEventData.message&&recvEventData.message.eleWHPercent!=undefined){
            HandlerWhiteboardAndCoreInstance.updateWhiteboardMagnification( that.instanceId , recvEventData.message.eleWHPercent  );
        }
        that.handlerOnResize();
    };
    handlerSetFileDataToLcElement(recvEventData){
        const that = this ;
        HandlerWhiteboardAndCoreInstance.updateWhiteboardFiledata(that.instanceId , recvEventData.message.filedata);
    };
    handlerGetFileDataFromLcElement(recvEventData){
        const that = this ;
        let {callback} = recvEventData.message ;
        if(callback && typeof callback === 'function'){
            let fileInfo = HandlerWhiteboardAndCoreInstance.getWhiteboardFiledata(that.instanceId);
            callback( fileInfo );
        }
    };
    handlerResetLcDefault(recvEventData){
        const that = this ;
        HandlerWhiteboardAndCoreInstance.resetDedaultWhiteboardMagnification(that.instanceId);
    };
    handlerCloseLoading(recvEventData){
        const that = this ;
        HandlerWhiteboardAndCoreInstance.hideWhiteboardLoading(that.instanceId);
    };
    handlerUpdateLcScaleWhenAynicPPTInitHandler(recvEventData){
        const that = this ;
        HandlerWhiteboardAndCoreInstance.updateWhiteboardWatermarkImageScalc(that.instanceId ,  recvEventData.message.lcLitellyScalc );
        HandlerWhiteboardAndCoreInstance.setWhiteboardWatermarkImage(that.instanceId , "" );
    };
    handlerRecoverCurrpageLcData(recvEventData){
        const that = this ;
        that._recoverCurrpageLcData();
    };
    handlerWhiteboardPrevPage(){
        const that = this ;
        that._whiteboardPaging(false , true);
    };
    handlerWhiteboardNextPage(){
        const that = this ;
        that._whiteboardPaging(true , true);
    };
    handlerWhiteboardAddPage(){
        const that = this ;
        that.handlerSaveLcStackToStorage();
        let lcData = HandlerWhiteboardAndCoreInstance.getWhiteboardFiledata(that.instanceId);
        lcData.pagenum += 1 ;
        let addPageData = {
            totalPage: lcData.pagenum ,
            fileid:lcData.fileid
        };
        HandlerWhiteboardAndCoreInstance.updateWhiteboardFiledata(that.instanceId , lcData);
        ServiceSignalling.sendSignallingFromWBPageCount(addPageData);
        that._whiteboardPaging(true , true);
    };
    handlerUpdateAppPermissions_whiteboardPagingPage(){
        const that = this ;
        if(that.props.fileTypeMark === 'general' ){
            eventObjectDefine.CoreController.dispatchEvent({ type:'updatePagdingState' , message:{ source:'whiteboard' , data: HandlerWhiteboardAndCoreInstance.getWhiteboardFiledata(that.instanceId) }});
        }
    };
    initAppPermissionsOfWhiteboard() {//tkpc2.0.8
        this.handlerInitAppPermissions();
    }
    handlerInitAppPermissions(){
        const that = this ;
        that.handlerUpdateAppPermissions_canDraw();
        that.handlerUpdateAppPermissions_whiteboardPagingPage();
        that.handlerCheckSelectMouseState();
    };
    handlerOpenDocuemntOrMediaFile(recvEventData){
        const that = this ;
        let fileDataInfo  = recvEventData.message ;
        let open =  that._saveFileidReturnOpen(fileDataInfo);
        if( fileDataInfo.isGeneralFile ){ //如果是普通文档
            that._handlerReceiveShowPageSignalling( { message:{ data:fileDataInfo  , open:open  ,  source:'commonFileClickEvent' } } ) ;
            /*fileDataInfo格式:
                 const fileDataInfo = {
                     isGeneralFile:file.isGeneralFile,
                     isMedia:file.isMediaFile,
                     isDynamicPPT:file.isDynamicPPT,
                     action: file.isDynamicPPT?"show":"",
                     mediaType:file.isMediaFile?file.filetype:null,
                     filedata: {
                         fileid: file.fileid,
                         currpage: file.currentPage,
                         pagenum: file.pagenum,
                         filetype: file.filetype,
                         filename: file.filename,
                         swfpath: file.swfpath,
                         pptslide: file.pptslide,
                         pptstep: file.pptstep,
                         steptotal:file.steptotal
                     }
                 }
             * */
        }
    };
    handlerWhiteboard_updateWhiteboardToolsInfo(recvEventData){
        HandlerWhiteboardAndCoreInstance.updateWhiteboardToolsInfo(this.instanceId ,  recvEventData.message.whiteboardToolsInfo);
    };
    handlerWhiteboard_updateTextFont(recvEventData){
        const that = this ;
        HandlerWhiteboardAndCoreInstance.updateTextFont(that.instanceId);
    };
    handlerUpdateSelectMouse(recvEventData){
        let selectMouse = recvEventData.message.selectMouse ;
        if(this.state.selectMouse !== selectMouse){
            let {fileTypeMark} = this.props ;
            let hideLc = false ;
            switch (fileTypeMark){
                case 'dynamicPPT':
                    hideLc =  selectMouse ;//是动态PPT并且拥有动态PPT点击权限并且选中的是鼠标，则隐藏
                    // hideLc = CoreController.handler.getAppPermissions('dynamicPptActionClick') &&  selectMouse ;//是动态PPT并且拥有动态PPT点击权限并且选中的是鼠标，则隐藏
                    break;
                case 'h5document':
                    hideLc =   selectMouse ;//是H5文档并且拥有H5文档点击权限并且选中的是鼠标，则隐藏
                    // hideLc = CoreController.handler.getAppPermissions('h5DocumentActionClick') &&  selectMouse ;//是H5文档并且拥有H5文档点击权限并且选中的是鼠标，则隐藏
                    break;
                default:
                    hideLc = false ;
                    break;
            }
            this.setState({selectMouse:selectMouse , show:!hideLc });
        }
    };
    handlerCheckSelectMouseState(recvEventData){
        let fileTypeMark = undefined;
        if(recvEventData && recvEventData.message && recvEventData.message.fileTypeMark){
            fileTypeMark = recvEventData.message.fileTypeMark ;
        }
        let {selectMouse , show} = this.state ;
        fileTypeMark = fileTypeMark || this.props.fileTypeMark;
        let hideLc = false ;
        switch (fileTypeMark){
            case 'dynamicPPT':
                hideLc = selectMouse ;//是动态PPT并且拥有动态PPT点击权限并且选中的是鼠标，则隐藏
                // hideLc = CoreController.handler.getAppPermissions('dynamicPptActionClick') &&  selectMouse ;//是动态PPT并且拥有动态PPT点击权限并且选中的是鼠标，则隐藏
                break;
            case 'h5document':
                hideLc =  selectMouse ;//是H5文档并且拥有H5文档点击权限并且选中的是鼠标，则隐藏
                // hideLc = CoreController.handler.getAppPermissions('h5DocumentActionClick') &&  selectMouse ;//是H5文档并且拥有H5文档点击权限并且选中的是鼠标，则隐藏
                break;
            default:
                hideLc = false ;
                break;
        }
        if(show !== (!hideLc) ){
            this.setState({show:!hideLc});
        }
    } ;
    handlerChangeStrokeSize(recvEventData){
        const that = this ;
        let { pencil , text , eraser , shape } = recvEventData.message.strokeJson ;
        let whiteboardToolsInfo = { pencilWidth:pencil , fontSize:text ,  eraserWidth:eraser , shapeWidth:shape } ;
        HandlerWhiteboardAndCoreInstance.updateWhiteboardToolsInfo( that.instanceId ,  whiteboardToolsInfo);
        for(let [key , value] of Object.entries(recvEventData.message.selectedTool) ){
            if(!value){continue ;} ;
            switch (key){
                case 'pencil':
                    HandlerWhiteboardAndCoreInstance.updatePencilWidth(that.instanceId , {pencilWidth:pencil} );
                    break;
                case 'text':
                    HandlerWhiteboardAndCoreInstance.updateTextFont(that.instanceId , {fontSize:text} );
                    break;
                case 'eraser':
                    HandlerWhiteboardAndCoreInstance.updateEraserWidth(that.instanceId , {eraserWidth:eraser} );
                    break;
                case 'shape':
                    HandlerWhiteboardAndCoreInstance.updateShapeWidth(that.instanceId , {shapeWidth:shape} );
                    break;
            }
        }
    };

    handlerChangeStrokeColor(recvEventData){
        const that = this ;
        HandlerWhiteboardAndCoreInstance.updateColor(that.instanceId , {primary:"#"+recvEventData.message.selectColor});//设置画笔颜色
    };
    handlerUpdateAppPermissions_canDraw(){
        const that = this ;
        HandlerWhiteboardAndCoreInstance.changeWhiteboardDeawPermission(  CoreController.handler.getAppPermissions('canDraw')  , that.instanceId);//设置白板可画权限
    };
    handlerUpdateAppPermissions_h5DocumentActionClick(){
        this.handlerCheckSelectMouseState();
    };
    handlerUpdateAppPermissions_dynamicPptActionClick(){
        this.handlerCheckSelectMouseState();
    };
    handlerLcTextEditing(recvEventData){
        const that = this ;
        let callback = recvEventData.message.callback ;
        if(callback && typeof callback === 'function'){
            callback( HandlerWhiteboardAndCoreInstance.isWhiteboardTextEditing(that.instanceId) );
        }
    };
    handlerSkipPage_general(recvEventData){
        const that = this ;
        if(that.props.fileTypeMark === 'general' ){
            let { currpage } = recvEventData.message ;
            that._skipWhiteboardPaging(currpage);
        }
    };
    handlerPreloadWhiteboardImg(recvEventData){
        const that = this ;
        let {url} = recvEventData.message ;
        HandlerWhiteboardAndCoreInstance.preloadWhiteboardImg(url) ;
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
        eventObjectDefine.CoreController.dispatchEvent({type:'commonWhiteboardTool_noticeUpdateToolDesc' , message:{registerWhiteboardToolsList}});
    };
    handlerWhiteboard_activeCommonWhiteboardTool(recvEventData){
        let {toolKey} = recvEventData.message ;
        HandlerWhiteboardAndCoreInstance.activeWhiteboardTool(toolKey , this.instanceId);
    };

    _lcInit(){ //白板初始化
        let that = this ;
        if( ! HandlerWhiteboardAndCoreInstance.hasWhiteboardById(that.instanceId) ){
            let whiteboardInstanceData = {
                whiteboardElementId:that.whiteboardElementId ,
                id:that.instanceId ,
                handler:{
                    sendSignallingToServer:that.sendSignallingToServer.bind(that) ,
                    delSignallingToServer:that.delSignallingToServer.bind(that) ,
                    resizeWhiteboardSizeCallback:that.resizeWhiteboardSizeCallback.bind(that) ,
                    noticeUpdateToolDescCallback:that.noticeUpdateToolDescCallback.bind(that) ,
                },
                productionOptions:{
                    deawPermission: CoreController.handler.getAppPermissions('canDraw')  ,
                    showRemoteRemindContent:this.showRemoteRemindContent ,
                }
            } ;
            let toolsDesc = {
                tool_pencil:{} ,
                tool_highlighter:{} ,
                tool_line:{} ,
                tool_arrow:{} ,
                tool_eraser:{} ,
                tool_text:{} ,
                tool_rectangle:{} ,
                tool_rectangle_empty:{} ,
                tool_ellipse:{} ,
                tool_ellipse_empty:{} ,
                tool_mouse:{} ,
                tool_laser:{} ,
                action_undo:{} ,
                action_redo:{} ,
                action_clear:{} ,
                zoom_big:{} ,
                zoom_small:{} ,
            };
           /* if(TK.SDKTYPE === 'mobile'){
                whiteboardInstanceData.productionOptions.backgroundColor = "#d4d8dc";
                whiteboardInstanceData.productionOptions.secondaryColor = "#d4d8dc";
            }*/
            HandlerWhiteboardAndCoreInstance.productionWhiteboard(whiteboardInstanceData);
            HandlerWhiteboardAndCoreInstance.registerWhiteboardTools(that.instanceId , toolsDesc);
            HandlerWhiteboardAndCoreInstance.clearRedoAndUndoStack(that.instanceId);
            if( !HandlerWhiteboardAndCoreInstance.hasWhiteboardFiledata(that.instanceId) ){
                HandlerWhiteboardAndCoreInstance.updateWhiteboardFiledata(that.instanceId , HandlerWhiteboardAndCoreInstance.getWhiteboardDefaultFiledata() ) ;
            }
            that.handlerOnResize();
        }
    };
    _handlerReceiveShowPageSignalling(showpageData){
        let that = this ;
        let doucmentFileData = showpageData.message.data;
        let open = showpageData.message.open;
        if(!doucmentFileData.isMedia) {
            if (doucmentFileData.isGeneralFile ) { //普通文档
                let source = showpageData.message.source; //source:'room-pubmsg'
                if(source==='room-pubmsg' && !open && doucmentFileData.filedata.fileid === that.fileid  &&  Number(doucmentFileData.filedata.currpage) === HandlerWhiteboardAndCoreInstance.getWhiteboardFiledata(this.instanceId).currpage){
                    return ;
                }
                that.handlerSaveLcStackToStorage();
                HandlerWhiteboardAndCoreInstance.updateWhiteboardFiledata(that.instanceId , doucmentFileData.filedata );
                let isSetPlayUrl = true ;
                that._recviceCommonDocumentShowPage(isSetPlayUrl, open);
            }
        }
    };
    _recviceCommonDocumentShowPage( isSetPlayUrl , open ){ //普通文档的显示处理
        const that=  this ;
        let fileTypeMark = 'general' ;
        that.props.changeFileTypeMark(fileTypeMark); //改变fileTypeMark的值
        isSetPlayUrl = (isSetPlayUrl!=null && isSetPlayUrl!=undefined ) ?isSetPlayUrl:true ;
        eventObjectDefine.CoreController.dispatchEvent({type:'setNewPptFrameSrc'  ,  message:{src:''}}) ;
        eventObjectDefine.CoreController.dispatchEvent({type:'setH5FileFrameSrc'  ,  message:{src:''}}) ;
        HandlerWhiteboardAndCoreInstance.resetDedaultWhiteboardMagnification(that.instanceId); //重置白板的缩放比
        let {swfpath , currpage , pagenum , filetype} =HandlerWhiteboardAndCoreInstance.getWhiteboardFiledata(that.instanceId);
        if( filetype === 'whiteboard'){
            HandlerWhiteboardAndCoreInstance.updateWhiteboardWatermarkImageScalc(that.instanceId , 16 / 9 );
            if(isSetPlayUrl) {
                HandlerWhiteboardAndCoreInstance.setWhiteboardWatermarkImage(that.instanceId , "" , {resetDedaultWhiteboardMagnification:false} );
            }
        }else{
            let index = swfpath.lastIndexOf(".") ;
            let imgType = swfpath.substring(index);
            let fileUrl = swfpath.replace(imgType,"-"+currpage+imgType) ;
            if(isSetPlayUrl) {
                let serviceUrl = TkConstant.SERVICEINFO.protocolAndHostname + ":" +   TkConstant.SERVICEINFO.port ;
                HandlerWhiteboardAndCoreInstance.setWhiteboardWatermarkImage(that.instanceId , serviceUrl + fileUrl , {resetDedaultWhiteboardMagnification:false} );

                //open == true 为打开一个普通文档。open === undefined为前后翻页
                let startInt = 1;
                let endInt = 1;
                if(open) {
                    that.cacheMaxPageNum = currpage;
                    that.filePreLoadCurrPage = currpage;
                    that.cacheMinPageNum = currpage;
                    if (that.cacheMaxPageNum + that.filePreLoadStep <= pagenum) {
                        that.cacheMaxPageNum += that.filePreLoadStep;
                    } else if (that.cacheMaxPageNum < pagenum) {
                        that.cacheMaxPageNum += (pagenum - that.cacheMaxPageNum);
                    }

                    if (that.cacheMinPageNum - that.filePreLoadStep >= 1) {
                        that.cacheMinPageNum -= that.filePreLoadStep;
                    } else {
                        that.cacheMinPageNum = 1;
                    }
                    endInt = that.cacheMaxPageNum;
                    startInt = that.cacheMinPageNum;
                } else {
                    if(that.filePreLoadCurrPage  < currpage ){
                        startInt = that.cacheMaxPageNum + 1;
                        if(currpage > that.cacheMaxPageNum ){
                            that.cacheMaxPageNum = currpage;
                        }
                        if (that.cacheMaxPageNum + that.filePreLoadStep <= pagenum) {
                            that.cacheMaxPageNum += that.filePreLoadStep;
                        } else if (that.cacheMaxPageNum < pagenum) {
                            that.cacheMaxPageNum += (pagenum - that.cacheMaxPageNum);
                        }
                        endInt = that.cacheMaxPageNum;
                    } else if (that.filePreLoadCurrPage  > currpage){
                        endInt = that.cacheMinPageNum - 1;
                        if(currpage < that.cacheMinPageNum ){
                            that.cacheMinPageNum = currpage;
                        }
                        if (that.cacheMinPageNum - that.filePreLoadStep >= 1) {
                            that.cacheMinPageNum -= that.filePreLoadStep;
                        } else {
                            that.cacheMinPageNum = 1;
                        }
                        startInt = that.cacheMinPageNum;
                    }
                    that.filePreLoadCurrPage = currpage;
                }

                for(let i=startInt ;i<=endInt ; i++){  //todo qiugs 普通文档预加载代码
                    if(i !== currpage){
                        let index = swfpath.lastIndexOf(".") ;
                        let imgType = swfpath.substring(index);
                        let fileUrl = swfpath.replace(imgType,"-"+ i + imgType) ;
                        let serviceUrl = TkConstant.SERVICEINFO.protocolAndHostname + ":" +   TkConstant.SERVICEINFO.port ;
                        that.handlerPreloadWhiteboardImg({type:'preloadWhiteboardImg' , message:{url:serviceUrl + fileUrl}});
                    }
                }
            }
        }
        //加载当前页的白板数据
        that._recoverCurrpageLcData();
        eventObjectDefine.CoreController.dispatchEvent({ type:'updatePagdingState' , message:{ source:'whiteboard' , data: HandlerWhiteboardAndCoreInstance.getWhiteboardFiledata(that.instanceId) }});
        that.handlerCheckSelectMouseState({type:'checkSelectMouseState' , message:{fileTypeMark:fileTypeMark}});
    };
    _recoverCurrpageLcData(){ //画当前文档当前页数据到白板上
        let that = this ;
        let paramsJson = { loadRedoStack:TkConstant.hasRole.roleChairman};
        HandlerWhiteboardAndCoreInstance.loadCurrpageWhiteboard(that.instanceId , paramsJson);
    };

    /*白板翻页*/
    _whiteboardPaging(next , send = true , isSetPlayUrl=true) {
        const that = this ;
        let lcData =  HandlerWhiteboardAndCoreInstance.getWhiteboardFiledata(that.instanceId);
        if (next === true) {
            if(lcData.currpage >= lcData.pagenum ){
                return ;
            }
            lcData.currpage++ ;
        } else if (next == false) {
            if(lcData.currpage <= 1 ){
                return ;
            }
            lcData.currpage-- ;
        }
        that.handlerSaveLcStackToStorage();
        HandlerWhiteboardAndCoreInstance.updateWhiteboardFiledata(that.instanceId , lcData);
        that._recviceCommonDocumentShowPage(isSetPlayUrl);
        let pagingData = this._toShowPageData(lcData);
        eventObjectDefine.CoreController.dispatchEvent({
            type:'documentPageChange' ,
            message:pagingData
        });
        if(send){
            let isDelMsg = false , id = 'DocumentFilePage_ShowPage';
            ServiceSignalling.sendSignallingFromShowPage( isDelMsg , id , pagingData);
        };
    };
    _skipWhiteboardPaging(currpage , send = true , isSetPlayUrl=true){ //普通文档跳转
        const that = this ;
        let lcData = HandlerWhiteboardAndCoreInstance.getWhiteboardFiledata(that.instanceId);
        lcData.currpage = currpage ;
        that.handlerSaveLcStackToStorage();
        HandlerWhiteboardAndCoreInstance.updateWhiteboardFiledata(that.instanceId , lcData) ;
        that._recviceCommonDocumentShowPage(isSetPlayUrl);
        let pagingData = this._toShowPageData(lcData);
        eventObjectDefine.CoreController.dispatchEvent({
            type:'documentPageChange' ,
            message:pagingData
        });
        if(send){
            let isDelMsg = false , id = 'DocumentFilePage_ShowPage';
            ServiceSignalling.sendSignallingFromShowPage( isDelMsg , id , pagingData);
        };
    };
    _toShowPageData(lcData){
        let pagingData = {
            isMedia:false ,
            isDynamicPPT:false ,
            isGeneralFile:true ,
            isH5Document:false ,
            action:"" ,
            mediaType:"" ,
            filedata:lcData
        };
        return pagingData ;
    }
    _saveFileidReturnOpen(fileFormatInfo){ //保存文件id，返回是否打开文件
        const that = this ;
        let open = undefined ;
        if(!fileFormatInfo.isMedia){ //不是媒体文件才有这个操作
            let  fileid = fileFormatInfo.filedata.fileid ;
            open = (that.fileid != fileid);
            that.fileid = fileid ;
        }
        return open ;
    };
    render(){
        let that = this ;
        const {fileTypeMark , ...other} = that.props ;
        const {show} = that.state ;
        return (
            <div id={that.whiteboardElementId}  style={{display:!show?'none':'block'}} className={"overflow-hidden  scroll-literally-container "+ ('tk-filetype-'+fileTypeMark) }    {...TkUtils.filterContainDataAttribute(other)}   ></div>
        )
    };
};
WhiteboardSmart.propTypes = {
    instanceId:PropTypes.string.isRequired ,
};
export default WhiteboardSmart ;


