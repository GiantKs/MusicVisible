/**
 * Created by weijin on 2017/8/28.
 */

import React from 'react';
import TkConstant from 'TkConstant';
import eventObjectDefine from 'eventObjectDefine';
import TkUtils from 'TkUtils';
import ServiceSignalling from 'ServiceSignalling';
import CoreController from 'CoreController';
import TkGlobal from 'TkGlobal';

class H5Document extends React.Component{
    constructor(props){
        super(props);
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
        this.h5FileId = null;
        this.state={
            h5FileSrc:"",
            h5DocumentActionClick:CoreController.handler.getAppPermissions('h5DocumentActionClick'),
            // isDraging:false,
        };
        this.H5IsOnload = false;
        this.h5ActionJson = {};
    };
    componentDidMount() {
        let that = this ;
        this.h5Frame = document.getElementById("h5DocumentFrame").contentWindow;
        eventObjectDefine.Window.addEventListener(TkConstant.EVENTTYPE.WindowEvent.onMessage ,that.handlerOnMessage.bind(that)  ,  that.listernerBackupid); //接收onMessage事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPubmsg ,that.handlerRoomPubmsg.bind(that)  ,  that.listernerBackupid ) ;//room-pubmsg事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that)  ,  that.listernerBackupid ) ;//room-delmsg事件
        eventObjectDefine.CoreController.addEventListener("openDocuemntOrMediaFile" ,that.handlerOpenDocuemntOrMediaFile.bind(that)  ,  that.listernerBackupid );
        eventObjectDefine.CoreController.addEventListener("receive-msglist-ShowPage-lastDocument" ,that.handlerShowLastDocument.bind(that)  ,  that.listernerBackupid ); //接收ShowPage信令：h5课件处理
        eventObjectDefine.CoreController.addEventListener("initAppPermissions" ,that.handlerInitAppPermissions.bind(that)  ,  that.listernerBackupid ); //initAppPermissions：初始化权限处理
        eventObjectDefine.CoreController.addEventListener("h5DocumentPageUpClick" ,that.handlerH5FilePageUpClick.bind(that) ,  that.listernerBackupid ); //上一页操作
        eventObjectDefine.CoreController.addEventListener("h5DocumentPageDownClick" ,that.handlerH5FilePageDownClick.bind(that)  ,  that.listernerBackupid); //下一页操作
        eventObjectDefine.CoreController.addEventListener("setH5FileFrameSrc" ,that.setH5FileFrameSrc.bind(that)  ,  that.listernerBackupid); //设置h5文件路径
        eventObjectDefine.CoreController.addEventListener("updateAppPermissions_h5DocumentPagingPage" ,that.handlerUpdateAppPermissions_h5DocumentPagingPage.bind(that)  ,  that.listernerBackupid ); //updateAppPermissions_h5DocumentPagingPage：更新H5翻页权限
        eventObjectDefine.CoreController.addEventListener("updateAppPermissions_h5DocumentActionClick" ,that.handlerUpdateAppPermissions_h5DocumentActionClick.bind(that)  ,  that.listernerBackupid); //h5点击动作权限的更新
        eventObjectDefine.CoreController.addEventListener("skipPage_h5document" ,that.handlerSkipPage_h5document.bind(that) , that.listernerBackupid); //skipPage_h5document：H5文档跳转
        // eventObjectDefine.CoreController.addEventListener("layerIsShowOfDraging" ,that.layerIsShowOfDraging.bind(that) , that.listernerBackupid); //skipPage_dynamicPPT：动态PPT跳转

    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        let that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid);
        eventObjectDefine.Window.removeBackupListerner(that.listernerBackupid);
    };
    handlerUpdateAppPermissions_h5DocumentPagingPage(){
        const that = this ;
        if(that.props.fileTypeMark === 'h5document'){
            const callbackHandler = (fileInfo) => {
                eventObjectDefine.CoreController.dispatchEvent({ type:'updatePagdingState' , message:{ source:'h5document' , data: fileInfo }});
            };
            eventObjectDefine.CoreController.dispatchEvent({type:'getFileDataFromLcElement' ,message:{callback:callbackHandler}});
        }
    };
    handlerRoomPubmsg(pubmsgDataEvent){//room-pubmsg事件：动态h5文档处理
        let that = this ;
        let pubmsgData = pubmsgDataEvent.message ;
        switch(pubmsgData.name) {
            case "ShowPage":
                let open = (that.h5FileId !== pubmsgData.data.filedata.fileid);
                that.h5FileId = pubmsgData.data.filedata.fileid;//保存当前文档id
                that._handlerReceiveShowPageSignalling({message:{data:pubmsgData.data ,open:open,  source:'room-pubmsg'} });
                break;
            case "H5DocumentAction": //h5文件动作
                const callbackHandler = (fileInfo) => {
                    let { currpage} = fileInfo;
                    let data = pubmsgData.data;
                    if (this.H5IsOnload === false && TkGlobal.playback) {
                        if (this.h5ActionJson[currpage] && this.h5ActionJson[currpage].length > 0) {
                            this.h5ActionJson[currpage].push(data);
                        }else {
                            this.h5ActionJson[currpage] = [];
                            this.h5ActionJson[currpage].push(data);
                        }
                        L.Logger.warning('iframe加载好之前保存H5文件动作：',this.h5ActionJson);
                    }
                    that.h5Frame.postMessage(JSON.stringify(data),'*');
                };
                eventObjectDefine.CoreController.dispatchEvent({type:'getFileDataFromLcElement' ,message:{callback:callbackHandler}});

                break;
            default:
                break;
        }
    };
    handlerRoomDelmsg(delmsgData){//room-delmsg事件：动态h5文档处理

    };
    handlerOnMessage(recvEventData){
        const that = this ;
        let {event} = recvEventData.message ;
        that.handlerIframeMessage(event); //iframe框架消息处理函数
    };
    handlerIframeMessage(event){ //iframe框架消息处理函数
        let that = this ;
        // 通过origin属性判断消息来源地址
        if( event.data ){
            let data = undefined;
            try{
                data =  JSON.parse(event.data) ;
            }catch (e){
                L.Logger.warning(  "iframe message data can't be converted to JSON , iframe data:" , event.data ) ;
                return ;
            }
            if (data.method) {
                L.Logger.debug("[h5]receive remote iframe data form "+ event.origin +":",  event );
                switch (data.method) {
                    case "onPagenum"://收到总页数
                        let h5Pagenum = data.totalPages;
                        that.initH5Document(h5Pagenum);
                        break;
                    case "onFileMessage"://操作h5课件时
                        data.method = "onFileMessage";
                        ServiceSignalling.sendSignallingFromH5DocumentAction(data);
                        //点击时是否收回列表
                        eventObjectDefine.CoreController.dispatchEvent({type:'resetAllLeftToolButtonOpenStateToFalse'});
                        break;
                    case "onLoadComplete"://收到iframe加载完成时
                        this.H5IsOnload = true;
                        const callback = (fileInfo) => {
                            that.h5FileJumpPage(fileInfo);
                            let {currpage} = fileInfo;
                            if (!TkUtils.isEmpty(this.h5ActionJson) && this.h5ActionJson[currpage]) {
                                if (this.h5ActionJson[currpage].length !== 0) {
                                    this.h5ActionJson[currpage].map((item,index)=>{
                                        that.h5Frame.postMessage(JSON.stringify(item),'*');
                                    });
                                    this.h5ActionJson = {};
                                }
                            }
                        };
                        let coursewareRatio = data.coursewareRatio || 16/9;
                        eventObjectDefine.CoreController.dispatchEvent({type:'getFileDataFromLcElement' ,message:{callback:callback}});
                        eventObjectDefine.CoreController.dispatchEvent({type:'updateLcScaleWhenAynicPPTInitHandler' , message:{lcLitellyScalc:coursewareRatio}});
                        break;
                }
            }
        }
    }
    initH5Document(h5Pagenum) {
        this._sendDocumentPageChangeAndSaveWhiteboard(h5Pagenum);
    }
    handlerInitAppPermissions(recvEventData){
        this._sendDocumentPageChangeAndSaveWhiteboard();
    };
    handlerUpdateAppPermissions_h5DocumentActionClick(){
        const that = this ;
        that.setState({ h5DocumentActionClick:CoreController.handler.getAppPermissions('h5DocumentActionClick') });
    };
    handlerSkipPage_h5document(recvEventData){
        const that = this ;

        if(that.props.fileTypeMark === 'h5document' ){
            let { currpage } = recvEventData.message ;
            that._skipH5documentPaging(currpage);
        }
    };
    handlerOpenDocuemntOrMediaFile(recvEventData) {//本地收到打开文档
        const that = this ;
        let fileDataInfo = recvEventData.message ;
        let open = (that.h5FileId !== fileDataInfo.filedata.fileid);
        that.h5FileId = fileDataInfo.filedata.fileid;//保存当前文档id
        if( fileDataInfo.isH5Document){ //如果是h5文档
            that._handlerReceiveShowPageSignalling( { message:{ data:fileDataInfo  , open:open ,  source:'h5DocumentClickEvent' } } ) ;
        }
    };
    handlerShowLastDocument(showpageData) {//打开最后一次操作的文档
        showpageData.message.open = (this.h5FileId !== showpageData.message.data.filedata.fileid) ;
        this.h5FileId = showpageData.message.data.filedata.fileid;//保存当前文档id
        this._handlerReceiveShowPageSignalling(showpageData)
    }
    _handlerReceiveShowPageSignalling(showpageData){//接收ShowPage信令
        let that =  this ;
        let h5DocumentData = showpageData.message.data ;
        let open = showpageData.message.open ;
        this.h5FileId = h5DocumentData.filedata.fileid;
        that.h5DocumentData = h5DocumentData;
        if(!h5DocumentData.isMedia) {
            if(h5DocumentData.isH5Document){
                let isReturn  = false ;
                const callbackHandler = (fileInfo) => {//tkpc2.0.8
                    if(!open){
                        h5DocumentData.filedata.pagenum = fileInfo.pagenum;
                        let source = showpageData.message.source; //source:'room-pubmsg'
                        if (source==='room-pubmsg'  &&  Number(h5DocumentData.filedata.currpage) === fileInfo.currpage) {
                            isReturn = true ;
                        }
                    }
                };
                eventObjectDefine.CoreController.dispatchEvent({type:'getFileDataFromLcElement' ,message:{callback:callbackHandler}});
                if(isReturn){
                    return ;
                }
                if( showpageData.message.source === "room-pubmsg" || showpageData.message.source === "room-msglist" ||  showpageData.message.source === "h5DocumentClickEvent" ){
                    if (showpageData.message.open == true ) {
                        that._openH5DocumentHandler(h5DocumentData.filedata);
                    }
                }
                that.slideChangeToLc(h5DocumentData.filedata);
                that.h5FileJumpPage(h5DocumentData.filedata);
            }
        }
    };

    h5FileJumpPage(filedata) {//跳转到h5文档的某一页
        let data = null;
        let toPage = filedata.currpage;
        data = JSON.stringify({method:"onJumpPage","toPage":toPage});
        this.h5Frame.postMessage(data,'*');
        this._sendDocumentPageChangeAndSaveWhiteboard(filedata.pagenum,toPage);
    }
    _openH5DocumentHandler(filedata){//打开h5文档
        let that = this ;
        let fileTypeMark = 'h5document' ;
        let serviceUrl = TkConstant.SERVICEINFO.address;
        let swfpath = filedata.swfpath;
        that.props.changeFileTypeMark(fileTypeMark); //改变fileTypeMark的值
        eventObjectDefine.CoreController.dispatchEvent({type:'resetLcDefault'});
        eventObjectDefine.CoreController.dispatchEvent({type:'updateLcScaleWhenAynicPPTInitHandler' , message:{lcLitellyScalc:16/9}});
        eventObjectDefine.CoreController.dispatchEvent({type:'setNewPptFrameSrc'  ,  message:{src:''}}) ;//清空ppt的路径
        this.H5IsOnload = false;
        that.setState({h5FileSrc:serviceUrl+swfpath});
        eventObjectDefine.CoreController.dispatchEvent({type:'checkSelectMouseState' , message:{fileTypeMark:fileTypeMark} });
    };
    setH5FileFrameSrc(fileData) {//设置h5文件路径
        this.setState({h5FileSrc:fileData.message.src || ""});
    }
    slideChangeToLc(filedata){
        eventObjectDefine.CoreController.dispatchEvent({type:'saveLcStackToStorage' , message:{} }) ;//保存上一页数据
        eventObjectDefine.CoreController.dispatchEvent({type:'setFileDataToLcElement' , message:{filedata:filedata} }) ;//设置当前文档数据到白板节点上
        eventObjectDefine.CoreController.dispatchEvent({type:'recoverCurrpageLcData'}); //画当前文档当前页数据到白板上
        eventObjectDefine.CoreController.dispatchEvent({ type:'updatePagdingState' , message:{ source:'h5document' , data: filedata }});
    }
    handlerH5FilePageUpClick(){//点击上一页
        const that = this ;
        let data = JSON.stringify({method:"onPageup"});
        that.h5Frame.postMessage(data,'*');
        that.changCurrPageUp();//改变当前页数
    };
    handlerH5FilePageDownClick(){//点击下一页
        const that = this ;
        let data = JSON.stringify({method:"onPagedown"});
        that.h5Frame.postMessage(data,'*');
        that.changCurrPageDown();//改变当前页数
    };
    changCurrPageUp() {
        const that = this ;
        const callbackHandler = (fileInfo) => {
            let { currpage, pagenum} = fileInfo;
            currpage--;
            if (currpage <= 1) {
                currpage = 1;
            }
            fileInfo.currpage = currpage;
            that.slideChangeToLc(fileInfo);
            that.h5DocumentData.filedata = fileInfo;
            eventObjectDefine.CoreController.dispatchEvent({
                type:'documentPageChange' ,
                message:that.h5DocumentData
            });
            that.h5DocumentData.action = 'onJumpPage';
            that.sendSignallingToH5File(that.h5DocumentData);//发送信令告诉其他人翻页
            eventObjectDefine.CoreController.dispatchEvent({ type:'updatePagdingState' , message:{ source:'h5document' , data: fileInfo }});
        };
        eventObjectDefine.CoreController.dispatchEvent({type:'getFileDataFromLcElement' ,message:{callback:callbackHandler}});
    };
    changCurrPageDown() {
        const that = this ;
        const callbackHandler = (fileInfo) => {
            let { currpage, pagenum} = fileInfo;
            currpage++;
            if (currpage >= pagenum) {
                currpage = pagenum;
            }
            fileInfo.currpage = currpage;
            that.slideChangeToLc(fileInfo);
            that.h5DocumentData.filedata = fileInfo;
            eventObjectDefine.CoreController.dispatchEvent({
                type:'documentPageChange' ,
                message:that.h5DocumentData
            });

            that.h5DocumentData.action = 'onJumpPage';
            that.sendSignallingToH5File(that.h5DocumentData);//发送信令告诉其他人翻页
            eventObjectDefine.CoreController.dispatchEvent({ type:'updatePagdingState' , message:{ source:'h5document' , data: fileInfo }});
        };
        eventObjectDefine.CoreController.dispatchEvent({type:'getFileDataFromLcElement' ,message:{callback:callbackHandler}});
    };
    sendSignallingToH5File(h5FileData) {//发送信令告诉其他人翻页
        let isDelMsg = false ;
        let id = 'DocumentFilePage_ShowPage';
        ServiceSignalling.sendSignallingFromShowPage(isDelMsg , id , h5FileData);
    }
    _skipH5documentPaging(currpage){
        let data = null;
        let toPage = currpage;
        data = JSON.stringify({method:"onJumpPage","toPage":toPage});
        this.h5Frame.postMessage(data,'*');
        const callbackHandler = (fileInfo) => {//tkpc2.0.8
            this.h5DocumentData.filedata = fileInfo;
            this.h5DocumentData.filedata.currpage = currpage;
            this.slideChangeToLc(this.h5DocumentData.filedata);
            eventObjectDefine.CoreController.dispatchEvent({
                type:'documentPageChange' ,
                message:this.h5DocumentData
            });
            this.sendSignallingToH5File(this.h5DocumentData);//发送信令告诉其他人跳转到某页
        };
        eventObjectDefine.CoreController.dispatchEvent({type:'getFileDataFromLcElement' ,message:{callback:callbackHandler}});
    };
    _updateLcScaleWhenAynicPPTInitHandler(lcLitellyScalc) {
        eventObjectDefine.CoreController.dispatchEvent({type:'updateLcScaleWhenAynicPPTInitHandler' , message:{lcLitellyScalc:lcLitellyScalc}});
    };
    _sendDocumentPageChangeAndSaveWhiteboard(h5Pagenum,h5Currpage){
        const that = this ;
        that.setState({ h5DocumentActionClick:CoreController.handler.getAppPermissions('h5DocumentActionClick') });
        if(that.props.fileTypeMark === 'h5document'){
            const callbackHandler = (fileInfo) => {
                if (h5Pagenum) {
                    fileInfo.pagenum = h5Pagenum;
                }
                if (h5Currpage) {
                    fileInfo.currpage = h5Currpage;
                }
                let pagingData = {
                    isMedia:false ,
                    isDynamicPPT:false ,
                    isGeneralFile:false ,
                    isH5Document:true ,
                    action:'show' ,
                    mediaType:"" ,
                    filedata:fileInfo
                };
                eventObjectDefine.CoreController.dispatchEvent({
                    type:'documentPageChange' ,
                    message:pagingData
                });
                eventObjectDefine.CoreController.dispatchEvent({type:'setFileDataToLcElement' , message:{filedata:fileInfo} }) ;//设置当前文档数据到白板节点上
                eventObjectDefine.CoreController.dispatchEvent({ type:'updatePagdingState' , message:{ source:'h5document' , data: fileInfo }});
            };
            eventObjectDefine.CoreController.dispatchEvent({type:'getFileDataFromLcElement' ,message:{callback:callbackHandler}});
        }
    };
    /*layerIsShowOfDraging(handledata){//根据是否正在拖拽显示课件上的浮层
        this.setState({isDraging:handledata.message.isDraging});
    };*/


    render() {
        let fileTypeMark = this.props.fileTypeMark;

        let { h5FileSrc  ,  h5DocumentActionClick } = this.state ;
        let styleClass = Object.customAssign({display:fileTypeMark == 'h5document' ? "block": "none"} , this.props.styleJson) ;
        return (
            <div id="h5FileWrap" style={ styleClass } className="h5-file-wrap add-position-absolute-top0-left0" >
                <iframe allowFullScreen={true} id="h5DocumentFrame" scrolling="no" src={h5FileSrc} name="h5FileFrame" ></iframe>
                <div className="student-disabled add-position-absolute-top0-left0" style={{ display:!h5DocumentActionClick ? "block" : "none" }} ></div>
                <div id="h5Document-layer" className="student-disabled add-position-absolute-top0-left0" style={{ display:(!h5DocumentActionClick ? "block" : "none") }} ></div>
            </div>
        );
    };

}
export default H5Document;

