/**
 * 普通文件列表的Smart组件
 * @module FileListSmart
 * @description   普通文件列表的Smart组件,处理普通文件列表的业务
 * @author Xiagd
 * @date 2017/08/17
 */

'use strict';
import React from 'react';
import TkGlobal from 'TkGlobal';
import eventObjectDefine from 'eventObjectDefine';
import TkConstant from 'TkConstant';
import ServiceRoom from 'ServiceRoom';
import ServiceSignalling from 'ServiceSignalling';
import CoreController from 'CoreController';
import FileListDumb from '../../../../../../../../components/fileList/fileList';
import FileSelect  from './fileSelect';
import FileProgressBar from './fileProgressBar';
import ServiceTooltip from 'ServiceTooltip' ;
import ServiceTools from 'ServiceTools' ;
import TkUtils from 'TkUtils';
import WebAjaxInterface from 'WebAjaxInterface';
import TkAppPermissions from 'TkAppPermissions';



class FileListSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            filelistData: this._createDefaultFilelistData(), //课堂文件
            commonAccept:TkConstant.FILETYPE.documentFileListAccpet,
            mediaAccept:TkConstant.FILETYPE.mediaFileListAccpet,
            h5DocumentAccept:TkConstant.FILETYPE.h5DocumentFileListAccpet,
            filePercent:0,
            isSelectUploadH5Document:false ,
        };
        this.isSelectUploadH5Document = false ;
        this.listernerBackupid = new Date().getTime()+'_'+Math.random() ;
        this.uploadFileArray = [];              //正在上传的文档
        this.currDocumentFileid = -1;          //当前打开文档文件ID，不能重复打开当前文档
        this.cachePageNum = 1;                  //当前打开文档的缓存总数
        this.filePreLoadStep = 2;               //普通文档预加载步长
        this.currPlayFileid = undefined;       //上传文件时是否有媒体文件在播放
        this.uploadFilePath = "";               //断点续传时的临时文件路径
        this.fileSortType = 3;                  //文件排序类型
        //this.fileNameSortState = undefined;            //文件名排序状态
        //this.fileTypeSortState = undefined;            //文件类型排序状态
        this.fileSortState = 1;                 //文件名排序状态
        this.uploadFileInfo = false;            //有上传文件是否在进行轮询
        this.myUploadInfo = null;               //文件转换计时器
        this.uploadFileStateInfo =[] ;          //上传文档正在转换
    };

    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this ;
        let {isMediaUI} = that.props;

        that.initFileToList();
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomFiles , that.handlerRoomFiles.bind(that), that.listernerBackupid); //roomFiles事件
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPubmsg , that.handlerRoomPubmsg.bind(that), that.listernerBackupid); //roomPubmsg事件
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that), that.listernerBackupid); //roomDelmsg事件 下课事件 classBegin
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDisconnected,that.handlerRoomDisconnected.bind(that) , that.listernerBackupid); //Disconnected事件：失去连接事件
        eventObjectDefine.CoreController.addEventListener( "openDefaultDoucmentFile" , that.handlerDefaultDocument.bind(that), that.listernerBackupid); //roomPubmsg事件
        eventObjectDefine.CoreController.addEventListener( "receive-msglist-ShowPage-lastDocument" , that.handlerShowpage.bind(that), that.listernerBackupid); //msglist事件
        !isMediaUI?eventObjectDefine.CoreController.addEventListener( "documentPageChange" , that.handlerDocmentPageChange.bind(that), that.listernerBackupid):undefined; //roomPubmsg事件

        eventObjectDefine.CoreController.addEventListener( "receive-msglist-WBPageCount" , that.handlerMsglistWBPageCount.bind(that), that.listernerBackupid); //roomPubmsg事件
        //{type:'receive-msglist-ShowPage-lastDocument' , message:{data:lastDoucmentFileData  , source:'room-msglist' }
        //eventObjectDefine.CoreController.addEventListener({type:'openDefaultDoucmentFile' , message:{fileid:fileid} }); //打开缺省文档
        //eventObjectDefine.CoreController.addEventListener({type:'currDoucmentFileChange' , message:{fileid:fileid} }); //当前文档翻页侦听事件

        eventObjectDefine.CoreController.addEventListener( "playMediaUnpublishSucceed" , that.playMediaUnpublishSucceed.bind(that), that.listernerBackupid); //媒体取消发布事件成功
        eventObjectDefine.CoreController.addEventListener( "playMediaPublishSucceed" , that.playMediaPublishSucceed.bind(that), that.listernerBackupid); //媒体发布事件成功
        eventObjectDefine.CoreController.addEventListener( "playMediaUnpublishFail" , that.playMediaUnpublishFail.bind(that), that.listernerBackupid); //媒体取消发布事件失败
        eventObjectDefine.CoreController.addEventListener( "playMediaPublishFail" , that.playMediaPublishFail.bind(that), that.listernerBackupid); //媒体发布事件失败
        eventObjectDefine.CoreController.addEventListener( "changeDocumentFileListAccpetArr" , that.changeDocumentFileListAccpetArr.bind(that), that.listernerBackupid); //roomPubmsg事件
        eventObjectDefine.CoreController.addEventListener("initAppPermissions" ,that.initAppPermissions.bind(that) , that.listernerBackupid);   //权限初始化//tkpc2.0.8
        //eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomParticipantEvicted,that.handlerRoomParticipantEvicted.bind(that) , that.listernerBackupid); //Disconnected事件：参与者被踢事件
        //eventObjectDefine.CoreController.addEventListener("uploadH5DocumentFile" , this.handlerUploadH5DocumentFile.bind(this),that.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener("uploadH5DocumentFileComplete" , this.handlerUploadH5DocumentFileComplete.bind(this),that.listernerBackupid);
        !isMediaUI?eventObjectDefine.CoreController.addEventListener("cpature" , this.takeSnapshot.bind(this),that.listernerBackupid):undefined;
        //eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomMsglistFromConnected, that.handlerRoomMsgList.bind(that), that.listernerBackupid);

    };

    componentWillMount(){
        let that = this;
        eventObjectDefine.CoreController.addEventListener("uploadH5DocumentFile" , this.handlerUploadH5DocumentFile.bind(this),that.listernerBackupid);
    }

    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        let that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid );
    };

    componentDidUpdate( prevProps,  prevState){//在组件重新被渲染之后，componentDidUpdate(object prevProps, object prevState) 会被调用
        if(this.needdispatchEvent_uploadFile){
            this.needdispatchEvent_uploadFile = false ;
            eventObjectDefine.CoreController.dispatchEvent({type:'uploadFile'}) ;
        }
    };

    /*生产默认的普通文件列表数据*/
    _createDefaultFilelistData(){
        const filelistData = {
            titleJson:{
                title:this.props.isMediaUI?TkGlobal.language.languageData.toolContainer.toolIcon.mediaDocumentList.title:TkGlobal.language.languageData.toolContainer.toolIcon.documentList.title ,
                titleSort: TkGlobal.language.languageData.toolContainer.toolIcon.documentList.titleSort,
                number:0,
            } ,
            //fileListItemJson:new Map(),
            fileListItemJson:new Array(),
            systemFileListItemJson:new Array(),
            uploadButtonJson:{
                show:TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant,
                buttonText: this.props.isMediaUI?TkGlobal.language.languageData.toolContainer.toolIcon.mediaDocumentList.button.addCourse.text:TkGlobal.language.languageData.toolContainer.toolIcon.documentList.button.addCourse.text,
                buttonH5Text: TkGlobal.language.languageData.toolContainer.toolIcon.H5DocumentList.button.addCourse.text ,
                buttonTypeSortText: TkGlobal.language.languageData.toolContainer.toolIcon.documentList.button.fileType.text ,
                buttonNameSortText: TkGlobal.language.languageData.toolContainer.toolIcon.documentList.button.fileName.text ,
                buttonTimeSortText: TkGlobal.language.languageData.toolContainer.toolIcon.documentList.button.uploadTime.text ,
                uploadFile:this.uploadFile.bind(this),
                fileListSort:this.fileListSort.bind(this)
            }
        };
        return filelistData ;
    };
    //创建白板文档信息
    _createWhiteBoard(fileid,filename,pagenum,swfpath,isDynamicPPT){
        let filetype = 'whiteboard';
        let newDocumentInfo = {
            active:0,
            isGeneralFile:true,
            isDynamicPPT:false,
            isMediaFile:false,
            isH5Document:false,
            fileid:fileid,
            currentPage:1 ,
            pagenum:1 ,
            filetype: filetype,
            filename: filename,
            swfpath: swfpath ,
            pptslide:1 ,
            pptstep:0 ,
            steptotal:0 ,
        };
        return newDocumentInfo;
    }

    //创建临时文档信息
    _createTempFile(fileid,filename,pagenum,swfpath,isDynamicPPT,isH5Document,isMediaFile){
        //let filetype = filename.split('.');
        let filetype = filename.substring(filename.lastIndexOf(".") + 1);
        let newDocumentInfo = {
            active:0,
            isGeneralFile:!isH5Document && !isDynamicPPT && !isMediaFile?true:false,
            isDynamicPPT:isDynamicPPT,
            isMediaFile:isMediaFile,
            isH5Document:isH5Document,
            fileid:fileid,
            currentPage:1 ,
            pagenum:pagenum ,
            filetype: filetype,
            filename: filename,
            swfpath: swfpath ,
            pptslide:1 ,
            pptstep:0 ,
            steptotal:0 ,
            filecategory:0,
        };
        return newDocumentInfo;
    }

    //创建普通文档信息
    _createFile(file){
        /*
            active:"0"
            companyid:"10032"
            downloadpath:"/upload/20170804_180639_wywpgbmr.txt"
            dynamicppt:"0"
            fileid:"20892"
            filename:"test.txt"
            filepath:""
            fileserverid:"0"
            filetype:"txt"
            isconvert:"1"
            newfilename:"20170804_180639_wywpgbmr.txt"
            pagenum:"1"
            pdfpath:"/upload/20170804_180639_wywpgbmr.pdf"
            size:"16"
            status:"1"
            swfpath:"/upload/20170804_180639_wywpgbmr.jpg"
            type:"1"
            uploadtime:"2017-08-04 18:06:43"
            uploaduserid:"100620"
            uploadusername:"admin"
         */
        if(file.dynamicppt=="")
            file.dynamicppt="0";
        //let filetype = file.filename.split(".");

        //1:上传文件和获取文件返回一个文件属性fileprop
        //0:表示普通文档　１－２动态ppt(1: 第一版动态ppt 2: 新版动态ppt ）  3:h5文档
        let filetype;
        if (file.filetype) {
            filetype = file.filetype.toLowerCase();
        }else {
            filetype = file.filename.substring(file.filename.lastIndexOf(".") + 1).toLowerCase();
        }
        //let filetype = file.filename.substring(file.filename.lastIndexOf(".") + 1).toLowerCase();

        let isDynamicPPT = false;
        let isMediaFile = this.state.mediaAccept.indexOf(filetype)==-1?false:true;
        let isH5Document = false;
        let isGeneralFile = false;

        let fileprop = file.fileprop;
        if(fileprop==1 || fileprop==2)
            isDynamicPPT = true;
        else if(fileprop==3)
            isH5Document = true;
        else if(!isMediaFile && fileprop==0)
            isGeneralFile=true;


        let newDocumentInfo = {
            active:0,
            isGeneralFile:isGeneralFile,
            isDynamicPPT:isDynamicPPT,
            isMediaFile:isMediaFile,
            isH5Document:isH5Document,
            fileid:file.fileid,
            currentPage:1 ,
            pagenum:parseInt(file.pagenum),
            filetype: filetype,
            filename: file.filename,
            swfpath: (isDynamicPPT||isH5Document)?file.downloadpath:file.swfpath ,
            pptslide:1 ,
            pptstep:0 ,
            steptotal:0 ,
            filecategory:file.filecategory?Number(file.filecategory):0,
        }
        return newDocumentInfo;
    }

    _createfileFromNetworkMsg(netWorkMsg){
        /*let data = {
            isDel:false ,
            isMedia:false ,
            isDynamicPPT:false ,
            filedata:{
                fileid:fileid,
                currpage:currpage ,
                pagenum:pagenum ,
                filetype:filetype  ,
                filename: filename ,
                swfpath: swfpath ,
                pptslide:pptslide ,
                pptstep:pptstep ,
                steptotal:pptstep ,
            }
        };*/
        let isDynamicPPT = netWorkMsg.isDynamicPPT;
        let isMediaFile = netWorkMsg.isMedia;
        let isH5Document = netWorkMsg.isH5Document;
        //let isMediaFile = this.state.mediaAccept.indexOf(netWorkMsg.filedata.filetype)==-1?false:true;
        let newDocumentInfo = {
            active:0,
            isGeneralFile:!isH5Document && !isDynamicPPT && !isMediaFile?true:false,
            isDynamicPPT:isDynamicPPT,
            isMediaFile:isMediaFile,
            isH5Document:isH5Document,
            fileid:netWorkMsg.filedata.fileid,
            currentPage:1 ,
            pagenum:netWorkMsg.filedata.pagenum ,
            filetype: netWorkMsg.filedata.filetype,
            filename: netWorkMsg.filedata.filename,
            swfpath: netWorkMsg.filedata.swfpath ,
            pptslide:1 ,
            pptstep:0 ,
            steptotal:0 ,
        }

        return newDocumentInfo;

    }


    //创建上传文档信息
    /*_createUploadFile(fileid,filename,dynamicppt,pagenum,swfpath){
        let filetype = filename.split(".");
        let isDynamicPPT = dynamicppt=="0"?true:false;
        let isMediaFile = this.state.mediaAccept.indexOf(1])==-1?false:true;
        let newDocumentInfo = {
            isGeneralFile:!isDynamicPPT && !isMediaFile?true:false,
            isDynamicPPT:isDynamicPPT,
            isMediaFile:isMediaFile,
            fileid:fileid,
            currpage:1 ,
            pagenum:pagenum ,
            filetype: filetype[1],
            filename: filename,
            swfpath: swfpath ,
            pptslide:0 ,
            pptstep:0 ,
            steptotal:0 ,
        }
    }*/

    _createNetworkMsg(fileDataInfo,isdel){
        fileDataInfo.isDel = isdel ;
       return fileDataInfo;
    }
    initAppPermissions() {//tkpc2.0.8
        let fileListData = this.state.filelistData;
        let fileListItem = fileListData.fileListItemJson;
        for(let i=0;i<fileListItem.length;i++){
            fileListItem[i].disabled = CoreController.handler.getAppPermissions('openFileIsClick')?fileListItem[i].disabled:true;
        }
        this.setState({filelistData:fileListData});
    }
    /*根据file生产用户描述信息*/
    _createFileItemDescInfo(file){
        const that = this ;
        //本地数据结构
        const fileDataInfo = {
            isDel:false,
            isGeneralFile:file.isGeneralFile,
            isMedia:file.isMediaFile,
            isDynamicPPT:file.isDynamicPPT,
            isH5Document:file.isH5Document,
            action: "show",
            mediaType:file.isMediaFile?file.filetype:"",
            filedata: {
                fileid: file.fileid,
                currpage: file.currentPage,
                pagenum: file.pagenum,
                filetype: file.filetype,
                filename: file.filename,
                swfpath: file.swfpath,
                pptslide: file.pptslide,
                pptstep: file.pptstep,
                steptotal:file.steptotal,
                filecategory:file.filecategory,
            }
        }

        //L.Logger.debug('TkGlobal.classBegin  =', TkGlobal.classBegin);
        let disabler = false;

         //file.isMediaFile?(TkGlobal.classBegin?(bShowIcon?(file.active==1?true:false):true):true):(file.active==1?true:false);

        let bShowIcon = TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant;
        const fileItemDescInfo =  {
            id:file.fileid,
            disabled:file.isMediaFile?(bShowIcon?(file.active==1?true:false):true):(file.active==1?true:false),
            active:  file.active,
            onClick: file.fileid==0?that.handlerOpenDocuemnt.bind(that, fileDataInfo):undefined,
            textContext:file.filename,
            children:undefined ,
            order:1,
            show:true,
            //TkConstant.role.roleTeachingAssistant;
            //TkConstant.role.roleChairman
            // order:user.role === TkConstant.role.roleStudent ? 0 : ( user.role === TkConstant.role.roleTeachingAssistant?1:2 ), //根据角色排序用户列表，数越小排的越往后 （order:0-学生 ， 1-助教 ， 2-暂时未定）
            //ServiceRoom.getTkRoom().getMySelf().role
            afterIconArray:[
                {
                    disabled:false,
                    before:true,
                    after:false,
                    show:true ,
                    'className':"disabled tk-icon-before tk-icon-" + TkUtils.getFiletyeByFilesuffix(file.filetype),
                    onClick: undefined,
                } ,
                {
                    disabled:false,
                    before:false,
                    after:true,
                    show:true ,
                    'className':file.isMediaFile?('file-list-play-icon '):('file-list-eye-icon '  + (file.active==0?'off':'on' )),
                    onClick: that.handlerOpenDocuemnt.bind(that, fileDataInfo),
                } ,
                {
                    disabled:false,
                    before:false,
                    after:true,
                    show:TkConstant.joinRoomInfo.isDocumentClassification?(bShowIcon && file.filecategory===0?true:false ):bShowIcon,
                    'className':'file-list-delete-icon ' ,
                    onClick: that.handlerDeleteDocuemnt.bind(that, fileDataInfo),
                } ,
            ],
            fileDataInfo:fileDataInfo,
        } ;
        return fileItemDescInfo ;
    };

    //初始化文件列表
    initFileToList(){
        const that = this ;
        if(that.props.isMediaUI )
            return;
        let filename = TkGlobal.language.languageData.toolContainer.toolIcon.whiteBoard.title;

        let whiteboard = that._createWhiteBoard(0,filename,1,"",false);
        let fileItemDescInfo = that._createFileItemDescInfo(whiteboard);
        that.addFileToList(fileItemDescInfo);

        //fileItemDescInfo.temporaryDisabled = false ;
        /*if(whiteboard.fileid!=0) {
            that.state.filelistData.titleJson.number += 1;
        }*/
        //that.state.filelistData.fileListItemJson.push(fileItemDescInfo );
        //that.setState({filelistData:that.state.filelistData});
    }

    /*处理room-files事件,获取房间所有普通文件*/
    handlerRoomFiles(roomFilesEventData) {
        const  that = this ;
        let files = roomFilesEventData.message ;
        for(let key in  files ){
            if(this.props.isMediaUI)
            {
                let file = files[key];
                let index = that.state.mediaAccept.indexOf(file.filetype);
                if(index!=-1)
                {
                    let newDocument = that._createFile(files[key]);
                    let fileItemDescInfo = that._createFileItemDescInfo(newDocument);
                    that.addFileToList(fileItemDescInfo);
                }
            }
            else{
                let file = files[key];
                let index = that.state.mediaAccept.indexOf(file.filetype);
                if(index==-1)
                {
                    let newDocument = that._createFile(files[key]);
                    let fileItemDescInfo = that._createFileItemDescInfo(newDocument);
                    that.addFileToList(fileItemDescInfo);
                }
            }
        }
    }

    handlerRoomDelmsg(recvEventData){
        const that = this ;
        let delmsgData = recvEventData.message ;

        switch(delmsgData.name) {
            case "ClassBegin":
                if(!TkConstant.joinRoomInfo.isClassOverNotLeave && CoreController.handler.getAppPermissions('endClassbeginRevertToStartupLayout')) { //是否拥有下课重置界面权限
                    if(!this.props.isMediaUI){
                        that.initDocumentDefaultState();
                        let fileId = TkGlobal.defaultFileInfo.fileid;
                        that.handlerDefaultDocument( {type:'openDefaultDoucmentFile' , message:{fileid:fileId} } );
                    }
                }else if(TkConstant.joinRoomInfo.isClassOverNotLeave){
                    let fileListData = that.state.filelistData;
                    let fileListItem = fileListData.fileListItemJson;
                    if(!this.props.isMediaUI) {
                        for (let i = 0; i < fileListItem.length; i++) {
                            if(fileListItem[i].fileDataInfo.filedata.fileid === 0){
                                fileListItem[i].fileDataInfo.filedata.currpage = 1;
                                fileListItem[i].fileDataInfo.filedata.pagenum = 1;
                                fileListItem[i].fileDataInfo.filedata.pptslide = 1;
                                fileListItem[i].fileDataInfo.filedata.pptstep = 0;
                            }else if(fileListItem[i].active != '1'){
                                fileListItem[i].fileDataInfo.filedata.currpage = 1;
                                fileListItem[i].fileDataInfo.filedata.pptslide = 1;
                                fileListItem[i].fileDataInfo.filedata.pptstep = 0;
                            }
                        }
                        that.setState({filelistData: fileListData});
                    }
                }
                break;
        }
    }

    handlerRoomPubmsg(recvEventData){
        const that = this ;
        let pubmsgData = recvEventData.message ;
        switch(pubmsgData.name)
        {

            case "DocumentChange": {
                //if(this.props.isMediaUI)
                //    return;
                //信令产生回调函数，判断返回值是否成功，然后才能删除
                if (pubmsgData.data.isDel) {
                    let room = ServiceRoom.getTkRoom();
                    //动态ppt 暂时老师和助教都发布信令；完善后谁删除，谁发布信令
                    this.removeFileToList(pubmsgData.data.filedata.fileid,pubmsgData.fromID,pubmsgData.data.isDynamicPPT);

                }
                else {

                    let createfileFromNetworkMsg = that._createfileFromNetworkMsg(pubmsgData.data);
                    let fileItemDescInfo = that._createFileItemDescInfo(createfileFromNetworkMsg);
                    that.addFileToList(fileItemDescInfo);
                    let isSender = pubmsgData.fromID === ServiceRoom.getTkRoom().getMySelf().id;
                    if(TkGlobal.classBegin && !fileItemDescInfo.fileDataInfo.isMedia && isSender){
                        that.handlerOpenDocuemnt(fileItemDescInfo.fileDataInfo);
                    }
                }
                //发送打开文档命令，如果删除的文档下面有数据，则打开下面的文档，如果没有该文档向上一个，如果是白板则打开白板


                break;
            }
            case "WBPageCount":{
                if(this.props.isMediaUI)
                    return;

                let fileid = pubmsgData.data.fileid;
                let pagenum = pubmsgData.data.totalPage;
                this.handleWBAddPage(fileid,pagenum);
                break;
            }
            case "ClassBegin":{
                //上课要发送信令
                if(this.props.isMediaUI){
                    ServiceTools.unpublishAllMediaStream(function(code,stream){
                        let fileid = undefined;
                        if(stream!==null && stream!==undefined)
                            fileid = stream.getAttributes().fileid;
                        let nFlag = 3;
                        //取消发布成功，所有媒体文件都可以操作
                        that.changeMediaFileAttr(false  ,nFlag ,  fileid );
                    }); //取消发布所有媒体流
                    //上课，所有媒体文件都可以操作
                    //L.Logger.debug('pubmsg classBegin  =', TkGlobal.classBegin);
                    //that.changeMediaFileAttr(false);
                } else{
                    let isDelMsg = false;
                    let id = "DocumentFilePage_ShowPage";
                    //打开一个文档，学生端接收ShowPage 命令
                    let fileListData = that.state.filelistData;
                    let fileListItem = fileListData.fileListItemJson;
                    let openData ={};

                    for(var i=0; i< fileListItem.length; i++){
                        if(fileListItem[i].active=="1"  ){
                            openData = fileListItem[i];
                            if(TkConstant.hasRole.roleChairman && openData.fileDataInfo!==undefined)
                                ServiceSignalling.sendSignallingFromShowPage(isDelMsg, id, openData.fileDataInfo);
                            break;
                        }
                    }

                }

                break;
            }
            case "ShowPage": {
                let that= this;
                if(this.props.isMediaUI && pubmsgData.data.isMedia ) {
                    //that.showPageOpenMedia(pubmsgData.data);
                }else {
                    that.showPageOpenDocuemnt(pubmsgData.data);
                }
                break;
            }
               /* let pagingData = {
                    isMedia:false ,
                    isDynamicPPT:false ,
                    isGeneralFile:true ,
                    action:'' ,
                    mediaType:'' ,
                    filedata:lcData
                };
                eventObjectDefine.CoreController.dispatchEvent({
                    type:'documentPageChange' ,
                    message:pagingData
                });
                if(send){
                    let isDelMsg = false , id = 'DocumentFilePage_ShowPage';
                    ServiceSignalling.sendSignallingFromShowPage( isDelMsg , id , pagingData);
                };*/
        }
    };

    handlerMsglistWBPageCount(recvEventData){
        const that = this ;
        let message =  recvEventData.message ;
        let fileid = message.data.fileid;
        let pagenum = message.data.totalPage;
        this.handleWBAddPage(fileid,pagenum);
    }

    handleWBAddPage(fileid,pagenum){
        let that = this;
        let fileListData = that.state.filelistData;
        let fileListItem = fileListData.fileListItemJson;
        for(let i=0;i<fileListItem.length;i++){
            if(fileid ==fileListItem[i].fileDataInfo.filedata.fileid)
            {
                 fileListItem[i].fileDataInfo.filedata.pagenum=pagenum;
            }
        }
        that.setState({filelistData:fileListData});
    }

    //打开默认文档
    handlerDefaultDocument(event) {
        let that = this;
        let fileid = event.message.fileid;
        let fileListData = that.state.filelistData;
        let fileListItem = fileListData.fileListItemJson;

        let index = 0;
        if(!event.message.isMedia) {

            that.currDocumentFileid = fileid;

            for (let i = 0; i < fileListItem.length; i++) {
                if (fileid == fileListItem[i].fileDataInfo.filedata.fileid) {
                    fileListItem[i].active = "1";
                    fileListItem[i].afterIconArray[1].className = fileListItem[i].fileDataInfo.isMedia ? 'file-list-play-icon ' : 'file-list-eye-icon on';
                    index = i;
                }
                else {
                    fileListItem[i].active = "0";
                    fileListItem[i].afterIconArray[1].className = fileListItem[i].fileDataInfo.isMedia ? 'file-list-play-icon ' : 'file-list-eye-icon off';
                    fileListItem[i].fileDataInfo.action = (fileListItem[i].fileDataInfo.isDynamicPPT || fileListItem[i].fileDataInfo.isH5Document)?"show":"";
                }
            }
            that.setState({filelistData: fileListData});

            if (fileListItem.length > 0 && index >= 0) {
                let nextOpenData = fileListItem[index];

                if(event.message.isGeneralFile) {  //普通文档预加载
                    that.cachePageNum = nextOpenData.fileDataInfo.filedata.currpage;
                    that.cachePageNum = that.openFilePreLoad(that.cachePageNum, that.filePreLoadStep, nextOpenData.fileDataInfo);
                }

                //发送信令并播放
                eventObjectDefine.CoreController.dispatchEvent({
                    type: 'openDocuemntOrMediaFile',
                    message: nextOpenData.fileDataInfo
                });
                //得到白板回来的信息后才能发信令
                let isDelMsg = false;
                let id = "DocumentFilePage_ShowPage";
                if (nextOpenData.fileDataInfo.isMedia)
                    id = nextOpenData.fileDataInfo.filedata.filetype == "mp3" ? "Audio_MediaFilePage_ShowPage" : "Video_MediaFilePage_ShowPage";
                ServiceSignalling.sendSignallingFromShowPage(isDelMsg, id, nextOpenData.fileDataInfo);
            }
        }

    }

    handlerShowpage(event){
        //message:{data:lastDoucmentFileData  , source:'room-msglist'
        //L.Logger.debug('handlerShowpage event=', event);
        const that = this ;

        if(!this.props.isMediaUI){
            if(!event.message.isMedia) {
                let fileid = event.message.data.filedata.fileid;
                let fileListData = that.state.filelistData;
                let fileListItem = fileListData.fileListItemJson;
                for (let i = 0; i < fileListItem.length; i++) {
                    if (fileid == fileListItem[i].fileDataInfo.filedata.fileid) {
                        fileListItem[i].fileDataInfo.filedata.currpage = event.message.data.filedata.currpage;
                    }
                }
                that.setState({filelistData: fileListData});
            }
            let  filedata = event.message.data;
            //打开文件，需要发送信令吗？
            this.handlerOpenDocuemnt(filedata,true);
        }
    }

    handlerDocmentPageChange(event){
        let that= this;
        let  filedescinfo = event.message;
        let fileid = event.message.filedata.fileid;
        let index = 0;
        //let fileItemDescInfo = that._createFileItemDescInfo(filedescinfo);
        //that.updateFileToList(fileItemDescInfo,fileid);
        let fileListData = that.state.filelistData;
        let fileListItem = fileListData.fileListItemJson;
        for(let i=0;i<fileListItem.length;i++){
            if(fileid ==fileListItem[i].fileDataInfo.filedata.fileid){
                // that.handleCoursewareRemarks(filedescinfo);//处理课件备注
                fileListItem[i].fileDataInfo.filedata.pptslide=filedescinfo.filedata.pptslide;
                fileListItem[i].fileDataInfo.filedata.currpage=filedescinfo.filedata.currpage;
                fileListItem[i].fileDataInfo.filedata.swfpath=filedescinfo.filedata.swfpath;
                fileListItem[i].fileDataInfo.filedata.steptotal=filedescinfo.filedata.steptotal;
                fileListItem[i].fileDataInfo.filedata.pptslide=filedescinfo.filedata.pptslide;
                fileListItem[i].fileDataInfo.filedata.pptstep=filedescinfo.filedata.pptstep;
                if(!fileListItem[i].fileDataInfo.isMedia){
                    fileListItem[i].fileDataInfo.filedata.pagenum=filedescinfo.filedata.pagenum;
                }
            }
        }
        that.setState({filelistData:fileListData});

    }

    initDocumentDefaultState(){
        let that = this;
        let fileListData = that.state.filelistData;
        let fileListItem = fileListData.fileListItemJson;
        if(!this.props.isMediaUI) {
            for (let i = 0; i < fileListItem.length; i++) {
                if (i === 0) {
                    fileListItem[i].active = "1";
                    fileListItem[i].fileDataInfo.filedata.currpage = 1;
                    fileListItem[i].fileDataInfo.filedata.pagenum = 1;
                    fileListItem[i].fileDataInfo.filedata.pptslide = 1;
                    fileListItem[i].fileDataInfo.filedata.pptstep = 0;
                } else {
                    fileListItem[i].active = "0";
                    fileListItem[i].fileDataInfo.filedata.currpage = 1;
                    fileListItem[i].fileDataInfo.filedata.pptslide = 1;
                    fileListItem[i].fileDataInfo.filedata.pptstep = 0;
                }
            }
            that.setState({filelistData: fileListData});
        }
    }

    currMediaFileSetActive(){
        let that = this;
        let fileid = that.currPlayFileid;
        if(fileid !== undefined){
            let fileListData = that.state.filelistData;
            let fileListItem = fileListData.fileListItemJson;
            for(let i=0;i<fileListItem.length;i++){
                if(fileid ==fileListItem[i].fileDataInfo.filedata.fileid){
                    fileListItem[i].active = "1";
                }
            }
            that.setState({filelistData:fileListData});
        }
    }

    handlerUploadH5DocumentFile(){
        let isCommon = this.state.isSelectUploadH5Document === true ;
        if(!isCommon){
            this.isSelectUploadH5Document = true ;
            this.setState({
                isSelectUploadH5Document:this.isSelectUploadH5Document
            });
        }
    }

    handlerUploadH5DocumentFileComplete(){
        let isCommon = this.state.isSelectUploadH5Document === false ;
        if(!isCommon){
            this.isSelectUploadH5Document = false ;
            this.setState({
                isSelectUploadH5Document:this.isSelectUploadH5Document
            });
        }
    }


    fileListSort(sortType,sortState){ //列表排序

        let that = this;

        let fileListData = that.state.filelistData;
        let fileListItem = fileListData.fileListItemJson;
        that.fileSortState = sortState;
        that.fileSortType = sortType;

        fileListItem.sort(that.fileSortBy(sortType,sortState));
        that.setState({filelistData: fileListData});

    }

    handlerRoomDisconnected(recvEventData){ //房间重连
        this.currDocumentFileid = -1; //当前打开文档文件ID，不能重复打开当前文档
        this.setState({
            filelistData: this._createDefaultFilelistData() , //课堂文件
        });
        this.initFileToList();
    }

    //打开文件选择对话框
    uploadFile(isH5){
        let that = this;
        //L.Logger.debug("this.props.isMediaUI  = ",this.props.isMediaUI)
        if(this.props.isMediaUI){
            eventObjectDefine.CoreController.dispatchEvent({type:'uploadMediaFile'}) ;
        } else{
            let isCommon = undefined ;
            if(isH5){
                isCommon = that.handlerUploadH5DocumentFile();
                if(isCommon){
                    that.needdispatchEvent_uploadFile = false ;
                    eventObjectDefine.CoreController.dispatchEvent({type:'uploadFile'}) ;
                }else{
                    that.needdispatchEvent_uploadFile = true ;
                }
            }else{
                that.needdispatchEvent_uploadFile = false ;
                eventObjectDefine.CoreController.dispatchEvent({type:'uploadFile'}) ;
            }
        }
    }
    //截屏bmp的格式记得改
    takeSnapshot(data) {
        let isture=data.isture
        let room=ServiceRoom.getTkRoom();
        let requestId = room.getNativeCallSeq();
        let fileName='TK'+new Date().getFullYear()+Number(new Date().getMonth() + 1)+new Date().getDate()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds();
        let filename=fileName+'.bmp'
        const that = this ;
        let tmpFileid = new Date().getTime();
        //改变状态，上传时，不允许进行其他操作。
        let nFlag = 0;
        this.isSelectUploadH5Document = false ;
        this.setState({
            isSelectUploadH5Document:this.isSelectUploadH5Document
        });
        that.uploadFileArray.push(tmpFileid);

        let uploadFileAjaxInfo = {
            uploadFileAjaxXhr:undefined
        };
        let newDocument  = that._createTempFile(tmpFileid,filename,1,"",false,false,false);
        let fileItemDescInfo = that._createFileItemDescInfo(newDocument);
        let {progressBarDisabled =true , cancelFileUpload  , cancelBtnShow = true } = that.props ;
        let percent = 0 ;
        let currProgressText = percent+'%';
        fileItemDescInfo.children =  <FileProgressBar id={"fileProgressBar_"+tmpFileid} currProgressWidth={percent} currProgressText={currProgressText} progressBarDisabled={true} cancelFileUpload={that.cancelFileUpload.bind(that  , tmpFileid , uploadFileAjaxInfo.uploadFileAjaxXhr)}  cancelBtnShow={true}  /> ;
        room.takeSnapshot(isture,fileName, requestId, function(action, requestId, total, now, code, result){
            that.addFileToList(fileItemDescInfo);
            if (action === "progress") {
                // the requestId, total, now parameter will be used.
                let s=Math.round((now/total)*100)/100
                percent=s*100
                that.progressCallback(event,percent,tmpFileid,'bmp',fileItemDescInfo , uploadFileAjaxInfo);
            }
            if (action === "result") {
                // the requestId, code, result parameter will be used.
                that.uploadCallback(code,result,tmpFileid,'bmp',fileItemDescInfo);
            }
        });
    }

    //上传文件
    uploadForm(formData,filename,filetype){
        const that = this ;
        let tmpFileid = new Date().getTime();
        //改变状态，上传时，不允许进行其他操作。
        let nFlag = 0;
        this.isSelectUploadH5Document = false ;
        this.setState({
            isSelectUploadH5Document:this.isSelectUploadH5Document
        });
        //that.changeMediaFileAttr(true,nFlag,undefined);  //xgd 2017-12-07
        that.uploadFileArray.push(tmpFileid);

        let isH5Document = false;
        if(filename.indexOf(".zip")>0 ){
            isH5Document = true;
        }
        let isMedia = this.props.isMediaUI;

        let uploadFileAjaxInfo = {
            uploadFileAjaxXhr:undefined
        };
        let newDocument  = that._createTempFile(tmpFileid,filename,1,"",false,isH5Document,isMedia);
        let fileItemDescInfo = that._createFileItemDescInfo(newDocument);
        let {progressBarDisabled =true , cancelFileUpload  , cancelBtnShow = true } = that.props ;
        let percent = 0 ;
        let currProgressText = percent+'%';

        fileItemDescInfo.children =  <FileProgressBar id={"fileProgressBar_"+tmpFileid} currProgressWidth={percent} currProgressText={currProgressText} progressBarDisabled={true} cancelFileUpload={that.cancelFileUpload.bind(that  , tmpFileid , uploadFileAjaxInfo.uploadFileAjaxXhr)}  cancelBtnShow={true}  /> ;
        uploadFileAjaxInfo.uploadFileAjaxXhr = ServiceRoom.getTkRoom().uploadFile(formData,function(code,response){
            that.uploadCallback(code,response,tmpFileid,filetype,fileItemDescInfo);
        },function(event,percent){
            that.progressCallback(event,percent,tmpFileid,filetype,fileItemDescInfo , uploadFileAjaxInfo);
        });
        that.addFileToList(fileItemDescInfo);
    }


    startTimer(startTime)/* 定义一个得到本地时间的函数*/
    {
        let that = this;
        clearInterval(that.myUploadInfo);
        that.myUploadInfo = setInterval( () => {that.currentPlayTimer(startTime)},5000);  //5秒钟一轮询
    }

    stopTimer() {/* clearInterval() 方法用于停止 setInterval() 方法执行的函数代码*/
        let that=this;
        clearInterval(that.myUploadInfo);
        that.myUploadInfo = null ;
    }

    //获取上传文件转换状态
    getUploadDataInfo(){
        const that = this ;

        for(let i=0;i<that.uploadFileStateInfo.length;i++){
            let uploadDataInfoAjaxInfo = {
                uploadDataInfoAjaxXhr:undefined
            };
            uploadDataInfoAjaxInfo.uploadDataInfoAjaxXhr = ServiceRoom.getTkRoom().docUploadFileDataInfo(that.uploadFileStateInfo[i],function(code,response){
                that.uploadDataInfoCallback(code,response,that.uploadFileStateInfo[i]);
            });
        }

    }

    uploadDataInfoCallback(code,response,fileid){
        let that = this;

        if(parseInt(code) === 1){

            let fileItemDescData = that.updateFileToListFile(fileid,response);
            fileItemDescData.children = undefined;
            let networkmsg = that._createNetworkMsg(fileItemDescData.fileDataInfo, false);
            let toID = "__allExceptSender";

            for (let i = 0; that.uploadFileStateInfo.length; i++) {
                if (fileid == that.uploadFileStateInfo[i]) {
                    that.uploadFileStateInfo.splice(i, 1);
                    that.deleteUploadFileArray(fileid);
                    break;
                }
            }
            if (that.uploadFileStateInfo.length === 0) {
                this.uploadFileInfo = false;
                that.stopTimer();
            }

            //改变状态，上传完成时恢复操作。
            if (that.uploadFileArray.length == 0) {
                let nFlag = 0;
                //that.changeMediaFileAttr(false, nFlag, undefined);
                that.currMediaFileSetActive();
            }

            ServiceSignalling.sendSignallingFromDocumentChange(networkmsg, toID);
            that.handlerOpenDocuemnt(fileItemDescData.fileDataInfo);

        }
    }

    resumeUploadFileData(filecount,formData,resultfile,setsize,i,resumefileInfo){ //断点续传，现在不用了；每次进行TCP连接，反而慢了。
        let that= this;

        //追加文件数据
        let blobfile = undefined;
        if((resultfile.size-i*setsize)>setsize){
            blobfile= resultfile.slice(i*setsize,(i+1)*setsize);
        }else{
            blobfile= resultfile.slice(i*setsize,resultfile.size);
            formData.append('lastone', Math.ceil(filecount));
        }

        formData.append('file', blobfile);
        formData.append('blobname', i);
        formData.append('filename', resultfile.name); //
        if(i!==0)
            formData.append('filepath', resumefileInfo.filepath);
        formData.append('blobflag', resumefileInfo.blobflag); //

        return formData;
    }

    resumeUploadFile(resumefileInfo,formData,resultfile,tmpFileid,fileItemDescInfo,filetype){ //断点续传，现在不用了；每次进行TCP连接，反而慢了。

        let that = this;
        let percent = 0;
        let filecount =  resumefileInfo.filecount;
        let setsize = resumefileInfo.setsize;
        let i = resumefileInfo.i ;

        let uploadFileAjaxInfo = {
            uploadFileAjaxXhr:undefined
        };

        that.resumeUploadFileData(filecount, formData,resultfile,setsize, i,resumefileInfo);

        if (Math.floor(filecount) <= i) {
            percent = 100;
            resumefileInfo.lastone = i;
        } else {
            let p = parseInt(i) * 100 / Math.ceil(filecount);
            percent = parseInt(p);
        }
        let currProgressText = percent + "%";
        fileItemDescInfo.children = <FileProgressBar id={"fileProgressBar_"+tmpFileid} currProgressWidth={percent} currProgressText={currProgressText}
                                                     progressBarDisabled={true}
                                                     cancelFileUpload={that.cancelFileUpload.bind(that, tmpFileid, uploadFileAjaxInfo.uploadFileAjaxXhr)}
                                                     cancelBtnShow={true}/>;
        uploadFileAjaxInfo.uploadFileAjaxXhr = ServiceRoom.getTkRoom().uploadFileNew(formData, function (code, response) {
            that.uploadCallback(code, response, tmpFileid, filetype, fileItemDescInfo,resultfile,resumefileInfo,formData);
        }, function (event, tmppercent) {
            that.progressCallback(event, percent===100?percent:percent+ parseInt(tmppercent/Math.ceil(filecount)), tmpFileid, filetype, fileItemDescInfo, uploadFileAjaxInfo);
        });
    }

    setSessionStorage(c_name,value){    //断点续传，现在不用了；每次进行TCP连接，反而慢了。
        L.Utils.sessionStorage.setItem(c_name,value);
    }

    getSessionStorage(c_name){      //断点续传，现在不用了；每次进行TCP连接，反而慢了。
        return L.Utils.sessionStorage.getItem(c_name);
    }

    //上传文件
    uploadFormNew(fileList,formData,filename,filetype){  //断点续传，现在不用了；每次进行TCP连接，反而慢了。
        const that = this ;

        let tmpFileid = new Date().getTime();
        //改变状态，上传时，不允许进行其他操作。
        let nFlag = 0;

        //that.changeMediaFileAttr(true,nFlag,undefined);
        that.uploadFileArray.push(tmpFileid);

        let isH5Document = false;
        if(filename.indexOf(".zip")>0 )
            isH5Document = true;
        let isMedia = this.props.isMediaUI;

        let uploadFileAjaxInfo = {
            uploadFileAjaxXhr:undefined
        };

        let bFlag = false;
        let percent = 0 ;
        let currProgressText = percent+'%';
        let newDocument  = that._createTempFile(tmpFileid,filename,1,"",false,isH5Document,isMedia);
        let fileItemDescInfo = that._createFileItemDescInfo(newDocument);
        let {progressBarDisabled =true , cancelFileUpload  , cancelBtnShow = true } = that.props ;


        let resultfile = fileList.files[0];
        //切片计算
        let filesize= resultfile.size;
        let setsize=512*1024;
        let filecount = filesize/setsize;
        //console.log(filecount)
        //定义进度条


        let values = that.getSessionStorage(resultfile.name);

        let i = 0;
        let filepath = "";
        if(values!=null) {
            i = values.split(";")[0].split(":")[1];
            i = (i != null && i != "") ? parseInt(i) : 0
            filepath = values.split(";")[1].split(":")[1];
            let saveFilesize = values.split(";")[2].split(":")[1];
            if(i>0 && filesize.toString()!==saveFilesize){       //文件大小不一致作为新的文件进行上传。
                i = 0;
                filepath = "";
            }
        }

        let resumefileInfo = {};
        resumefileInfo.filecount = filecount;
        resumefileInfo.setsize = setsize;
        resumefileInfo.i = i;
        resumefileInfo.filepath = filepath;
        resumefileInfo.lastone = i;
        resumefileInfo.blobflag = 1;

        if(resumefileInfo.i>Math.floor(filecount)){

            resumefileInfo.i = 0;
            resumefileInfo.lastone = 0;
            this.uploadFilePath = ""
            that.resumeUploadFile(resumefileInfo, formData, resultfile, tmpFileid, fileItemDescInfo, filetype);
        } else {
            that.resumeUploadFile(resumefileInfo, formData, resultfile, tmpFileid, fileItemDescInfo, filetype);
        }

        that.addFileToList(fileItemDescInfo);
    }

    uploadCallbackNew(code,response,tmpFileid,filetype,fileItemDescInfo,resultfile,resumefileInfo,formData){        //断点续传，现在不用了；每次进行TCP连接，反而慢了。
        let that = this;
        if(code>=0)
        {
            let values = "i:" + (resumefileInfo.i+1) + ";filepath:";

            if(response!==undefined && response.result === 1)
                this.uploadFilePath = response.filepath;

            values = values + this.uploadFilePath;              //上传临时路径
            values = values + ";filesize:" + resultfile.size;   //文件大小

            that.setSessionStorage(resultfile.name,values);

            if(resumefileInfo.lastone >= Math.floor(resumefileInfo.filecount)){

                fileItemDescInfo.children = undefined ;
                that.setState({filelistData:that.state.filelistData});
                //此处要返回真实的数据
                let newDocument = that._createFile(response);
                let fileItemDescData = that._createFileItemDescInfo(newDocument);
                that.updateFileToList(fileItemDescData,tmpFileid);


                that.deleteUploadFileArray(response.fileid);
                //改变状态，上传完成时恢复操作。
                if(that.uploadFileArray.length==0) {
                    let nFlag = 0;
                    //that.changeMediaFileAttr(false, nFlag, undefined);
                    that.currMediaFileSetActive();
                }

                let networkmsg = this._createNetworkMsg(fileItemDescData.fileDataInfo,false);
                let toID = "__allExceptSender";

                ServiceSignalling.sendSignallingFromDocumentChange(networkmsg , toID);


                //如果是MP3，MP4 直接返回
                if(this.props.isMediaUI || fileItemDescData.fileDataInfo.isMedia)
                    return;

                that.handlerOpenDocuemnt(fileItemDescData.fileDataInfo);
            } else {

                fileItemDescInfo.children = undefined;
                resumefileInfo.i = resumefileInfo.i + 1;
                resumefileInfo.lastone +=1;
                that.resumeUploadFile(resumefileInfo,formData,resultfile,tmpFileid,fileItemDescInfo,filetype);
            }

        }
        else
        {

            that.deleteUploadFileArray(tmpFileid);
            if(that.uploadFileArray.length===0) {
                let nFlag = 0;
                //that.changeMediaFileAttr(false, nFlag, undefined);
                that.currMediaFileSetActive();
            }
            let percent = 100 ;
            let currProgressText = '' ;
            let faukureText = TkGlobal.language.languageData.alertWin.call.fun.uploadCourseFile.fileUpload.failure.text ;
            fileItemDescInfo.children = <FileProgressBar id={"fileProgressBar_"+tmpFileid} failureColor={"#f03a0e"} faukureText={faukureText} currProgressWidth={percent} currProgressText={currProgressText} progressBarDisabled={true} cancelFileUpload={undefined}  cancelBtnShow={false}  />  ;
            that.setState({filelistData:that.state.filelistData});
            setTimeout(function () {
                fileItemDescInfo.children = undefined ;
                that.setState({filelistData:that.state.filelistData});
                let room = ServiceRoom.getTkRoom();
                that.removeFileToList(tmpFileid,room.getMySelf().id,fileItemDescInfo.fileDataInfo.isDynamicPPT);
            }, 1000);
        }
    }

    updateUploadFileArray(tmpFileid,fileid){
        let that = this;
        let fileArray = that.uploadFileArray;
        for(let i=0;i<fileArray.length;i++){
            if(fileArray[i] === tmpFileid ) {
                fileArray[i] = fileid;
                break;
            }
        }
    }

    deleteUploadFileArray(fileid){
        let that = this;
        let fileArray = that.uploadFileArray;
        for(let i=0;i<fileArray.length;i++){
            if(fileArray[i] === fileid ) {
                fileArray.splice(i, 1);
                break;
            }
        }
    }

    searchUploadFileArray(fileid){
        let that = this;
        let flag = false;
        let fileArray = that.uploadFileArray;
        for(let i=0;i<fileArray.length;i++){
            if(fileArray[i] === fileid ) {
                flag = true;
                break;
            }
        }
        return flag;
    }

    uploadCallback(code,response,tmpFileid,filetype,fileItemDescInfo){
        let that = this;
        if(code === 0)
        {
            fileItemDescInfo.children = undefined ;
            that.setState({filelistData:that.state.filelistData});
            let newDocument = that._createFile(response);
            let tempFileItemDescData = that._createFileItemDescInfo(newDocument);

            that.updateFileToList(tempFileItemDescData,tmpFileid);
            //that.updateUploadFileArray(tmpFileid,response.fileid);


            //tempFileItemDescData.children =  <FileProgressBar id={"fileProgressBar_"+tmpFileid} currProgressWidth={100} currProgressText={currProgressText} progressBarDisabled={true} cancelFileUpload={undefined}  cancelBtnShow={false}  /> ;
            that.deleteUploadFileArray(tmpFileid);
            //改变状态，上传完成时恢复操作。
            if(that.uploadFileArray.length==0) {
                let nFlag = 0;
                //that.changeMediaFileAttr(false, nFlag, undefined);
                that.currMediaFileSetActive();
            }

            let networkmsg = this._createNetworkMsg(tempFileItemDescData.fileDataInfo,false);
            let toID = "__allExceptSender";

            ServiceSignalling.sendSignallingFromDocumentChange(networkmsg , toID);

            if(this.props.isMediaUI || tempFileItemDescData.fileDataInfo.isMedia){
                return;
                /*//that.uploadFileArray.splice(0,1);
                that.deleteUploadFileArray(response.fileid);
                //改变状态，上传完成时恢复操作。
                if(that.uploadFileArray.length==0) {
                    let nFlag = 0;
                    //that.changeMediaFileAttr(false, nFlag, undefined);
                    that.currMediaFileSetActive();
                }

                let networkmsg = this._createNetworkMsg(tempFileItemDescData.fileDataInfo,false);
                let toID = "__allExceptSender";

                ServiceSignalling.sendSignallingFromDocumentChange(networkmsg , toID);*/

            } else {
                /* that.uploadFileStateInfo.push(response.fileid);
                 //如果存在上传，则进行轮询
                 //if(!that.uploadFileInfo && !this.props.isMediaUI && !fileItemDescData.fileDataInfo.isMedia){
                 that.uploadFileInfo = true;
                 clearInterval(that.myUploadInfo);
                 that.myUploadInfo = setInterval( () => {that.getUploadDataInfo()},5000);  //5秒钟一轮询*/
                //}
                that.handlerOpenDocuemnt(tempFileItemDescData.fileDataInfo);
            }


            //that.handlerOpenDocuemnt(fileItemDescData.fileDataInfo);

        }
        else
        {

            //that.uploadFileArray.splice(0,1);
            that.deleteUploadFileArray(tmpFileid);
            if(that.uploadFileArray.length===0) {
                let nFlag = 0;
                //that.changeMediaFileAttr(false, nFlag, undefined);
                that.currMediaFileSetActive();
            }
            let percent = 100 ;
            let currProgressText = '' ;
            let faukureText = TkGlobal.language.languageData.alertWin.call.fun.uploadCourseFile.fileUpload.failure.text ;
            fileItemDescInfo.children = <FileProgressBar id={"fileProgressBar_"+tmpFileid} failureColor={"#f03a0e"} faukureText={faukureText} currProgressWidth={percent} currProgressText={currProgressText} progressBarDisabled={true} cancelFileUpload={undefined}  cancelBtnShow={false}  />  ;
            that.setState({filelistData:that.state.filelistData});
            setTimeout(function () {

                fileItemDescInfo.children = undefined ;
                that.setState({filelistData:that.state.filelistData});
                let room = ServiceRoom.getTkRoom();
                that.removeFileToList(tmpFileid,room.getMySelf().id,fileItemDescInfo.fileDataInfo.isDynamicPPT);
            }, 1000);
        }
    }

    progressCallback(event,percent,tmpFileid,filetype,fileItemDescInfo , uploadFileAjaxInfo){
        const that = this ;
        if(percent >= 100){
            let currProgressText = percent + "%";
            if(!that.props.isMediaUI && filetype!=='mp3'&& filetype !=='mp4' ){
                currProgressText = TkGlobal.language.languageData.toolContainer.toolIcon.FileConversion.text ;
            } else{
                //$tmpLi.find(".progress-bar-box").remove();
            }
            fileItemDescInfo.children =  <FileProgressBar id={"fileProgressBar_"+tmpFileid} currProgressWidth={percent} currProgressText={currProgressText} progressBarDisabled={true} cancelFileUpload={undefined}  cancelBtnShow={false}  /> ;
        }else{
            let currProgressText = percent + "%";
            fileItemDescInfo.children =  <FileProgressBar id={"fileProgressBar_"+tmpFileid} currProgressWidth={percent} currProgressText={currProgressText} progressBarDisabled={true} cancelFileUpload={that.cancelFileUpload.bind(that  , tmpFileid , uploadFileAjaxInfo.uploadFileAjaxXhr)}  cancelBtnShow={true}  /> ;
        }
        that.setState({filelistData:that.state.filelistData});
    };

    cancelFileUpload(tmpFileid,uploadFileAjaxXhr,){
        uploadFileAjaxXhr.abort();
        let that = this;
        let room = ServiceRoom.getTkRoom();
        that.removeFileToList(tmpFileid,room.getMySelf().id,false);

        if(that.uploadFileArray.length===0) {
            let nFlag = 0;
            //that.changeMediaFileAttr(false, nFlag, undefined);
            that.currMediaFileSetActive();
        }
    }

    //接收翻页命令打开一个文件
    showPageOpenDocuemnt(fileDataInfo){
        let that = this;
        let {isMediaUI} = that.props;
        if (!isMediaUI) {
            if(!fileDataInfo.isMedia) {
                let fileListData = that.state.filelistData;
                let fileListItem = fileListData.fileListItemJson;
                for (var i = 0; i < fileListItem.length; i++) {
                    if (fileListItem[i].fileDataInfo.filedata.fileid == fileDataInfo.filedata.fileid) {
                        that.currDocumentFileid = fileDataInfo.filedata.fileid;
                        // that.handleCoursewareRemarks(fileDataInfo);//处理课件备注
                        fileListItem[i].active = "1";
                        fileListItem[i].fileDataInfo.filedata.currpage = fileDataInfo.filedata.currpage;
                        fileListItem[i].afterIconArray[1].className = fileListItem[i].fileDataInfo.isMedia ? 'file-list-play-icon on' : 'file-list-eye-icon on';
                    }
                    else {
                        fileListItem[i].active = "0";
                        fileListItem[i].afterIconArray[1].className = fileListItem[i].fileDataInfo.isMedia ? 'file-list-play-icon off' : 'file-list-eye-icon off';
                        fileListItem[i].fileDataInfo.action = (fileListItem[i].fileDataInfo.isDynamicPPT || fileListItem[i].fileDataInfo.isH5Document) ? "show" : "";
                    }
                }
                that.setState({filelistData: fileListData});

                if(fileDataInfo.isGeneralFile){
                    //发送预下载事件
                    that.cachePageNum = fileDataInfo.filedata.currpage; //缓存开始页为打开文档的当前页
                    that.cachePageNum = that.openFilePreLoad(that.cachePageNum,that.filePreLoadStep,fileDataInfo);
                }
            }
        }
    }

    //接收翻页命令打开一个文件
    showPageOpenMedia(fileDataInfo){
        let that = this;
        let swfpath = fileDataInfo.filedata.swfpath;
        let index = swfpath.lastIndexOf(".") ;
        let imgType = swfpath.substring(index);
        let fileUrl = swfpath.replace(imgType,"-1"+imgType) ;

        let serviceUrl = TkConstant.SERVICEINFO.address;
        //let urls = serviceUrl.split(":");
        //serviceUrl =  'http:' +  urls[1] ;

        //处理当前活动文档
        let fileListData = that.state.filelistData;
        let fileListItem = fileListData.fileListItemJson;
        let currDocumentState = -1;

        //if(user.role === TkConstant.role.roleStudent  || user.role === TkConstant.role.roleTeachingAssistant) {
        for(var i=0; i< fileListItem.length; i++){
            if(fileListItem[i].fileDataInfo.filedata.fileid==fileDataInfo.filedata.fileid){
                fileListItem[i].active="1";
                fileListItem[i].disabled=true;
                fileListItem[i].afterIconArray[1].className = fileListItem[i].fileDataInfo.isMedia?'file-list-play-icon on':'file-list-eye-icon on';
            }
            else{
                fileListItem[i].active="0";
                fileListItem[i].disabled=false;
                fileListItem[i].afterIconArray[1].className = fileListItem[i].fileDataInfo.isMedia?'file-list-play-icon off':'file-list-eye-icon off';
            }
        }

        that.setState({filelistData:fileListData});

        /*let playFileData = {};
        playFileData.filePlayUrl = serviceUrl + fileUrl;
        playFileData.filename=fileDataInfo.filedata.filename;
        playFileData.fileid=fileDataInfo.filedata.fileid;

        if (fileDataInfo.mediaType == 'mp4') {
            playFileData.video=true;
        } else if(fileDataInfo.mediaType == 'mp3'){
            playFileData.video=false;
        }

        eventObjectDefine.CoreController.dispatchEvent({
            type: 'playMediaFile',
            message: playFileData
        });*/


    }

    //打开一个普通文档, 需要权限
    handlerOpenDocuemnt(fileDataInfo,isMsgList){
        let that = this;
        if(!fileDataInfo.isMedia){
            if(fileDataInfo.filedata.fileid===that.currDocumentFileid){
                return;
            }
            // that.handleCoursewareRemarks(fileDataInfo);//处理课件备注
            that.currDocumentFileid = fileDataInfo.filedata.fileid; //选中课件的id

            let fileListData = that.state.filelistData;
            let fileListItem = fileListData.fileListItemJson;
            let systemFileListItem = fileListData.systemFileListItemJson;
            //if(user.role === TkConstant.role.roleStudent  || user.role === TkConstant.role.roleTeachingAssistant) {
            for(let i=0; i< fileListItem.length; i++){
                if(fileListItem[i].fileDataInfo.filedata.fileid==fileDataInfo.filedata.fileid){
                    fileListItem[i].active="1";
                    fileListItem[i].afterIconArray[1].className = fileListItem[i].fileDataInfo.isMedia?'file-list-play-icon on':'file-list-eye-icon on';
                }
                else{
                    fileListItem[i].active="0";
                    fileListItem[i].afterIconArray[1].className = fileListItem[i].fileDataInfo.isMedia?'file-list-play-icon off':'file-list-eye-icon off';
                    fileListItem[i].fileDataInfo.action = (fileListItem[i].fileDataInfo.isDynamicPPT || fileListItem[i].fileDataInfo.isH5Document)?"show":"";
                }
            }
            if(TkConstant.joinRoomInfo.isDocumentClassification){
                for(let n=0;n<systemFileListItem.length;n++){
                    if(systemFileListItem[n].fileDataInfo.filedata.fileid==fileDataInfo.filedata.fileid){
                        systemFileListItem[n].active="1";
                        systemFileListItem[n].afterIconArray[1].className = systemFileListItem[n].fileDataInfo.isMedia?'file-list-play-icon on':'file-list-eye-icon on';
                    }
                    else{
                        systemFileListItem[n].active="0";
                        systemFileListItem[n].afterIconArray[1].className = systemFileListItem[n].fileDataInfo.isMedia?'file-list-play-icon off':'file-list-eye-icon off';
                        systemFileListItem[n].fileDataInfo.action = (systemFileListItem[n].fileDataInfo.isDynamicPPT || systemFileListItem[n].fileDataInfo.isH5Document)?"show":"";
                    }
                }
            }
            that.setState({filelistData:fileListData});

            if(fileDataInfo.isGeneralFile){
                //发送预下载事件
                that.cachePageNum = fileDataInfo.filedata.currpage; //缓存开始页为打开文档的当前页
                that.cachePageNum = that.openFilePreLoad(that.cachePageNum,that.filePreLoadStep,fileDataInfo);
            }
            if (isMsgList !== true) {//如果不是msglist

                eventObjectDefine.CoreController.dispatchEvent({
                    type: 'openDocuemntOrMediaFile',
                    message: fileDataInfo
                });

                //上课后才能发信令
                if (TkGlobal.classBegin) {
                    let isDelMsg = false;
                    let id = "DocumentFilePage_ShowPage";
                    if (fileDataInfo.isMedia)
                        id = fileDataInfo.filedata.filetype == "mp3" ? "Audio_MediaFilePage_ShowPage" : "Video_MediaFilePage_ShowPage";
                    ServiceSignalling.sendSignallingFromShowPage(isDelMsg, id, fileDataInfo);
                }
            }

        }
        else{   //mp3,mp4 多媒体类型
            /*
            playFileData ={
                filePlayUrl:"",
                filename:filename,
                fileid:fileid,
                type:'media',
                video:true; //mp4 为true MP3 为false
            }
            */
            //处理当前活动文档
            let fileListData = that.state.filelistData;
            let fileListItem = fileListData.fileListItemJson;
            let systemFileListItem = fileListData.systemFileListItemJson;
            let currDocumentState = -1;
            for(var i=0; i< fileListItem.length; i++){
                if(fileListItem[i].fileDataInfo.filedata.fileid==fileDataInfo.filedata.fileid){
                    fileListItem[i].active="1";
                    fileListItem[i].disabled=true;
                    fileListItem[i].afterIconArray[1].className = fileListItem[i].fileDataInfo.isMedia?'file-list-play-icon on':'file-list-eye-icon on';
                }
                else{
                    fileListItem[i].active="0";
                    fileListItem[i].disabled=true;
                    fileListItem[i].afterIconArray[1].className = fileListItem[i].fileDataInfo.isMedia?'file-list-play-icon off':'file-list-eye-icon off';
                }
            }
            if(TkConstant.joinRoomInfo.isDocumentClassification) {
                for(var n=0; n< systemFileListItem.length; n++){
                    if(systemFileListItem[n].fileDataInfo.filedata.fileid==fileDataInfo.filedata.fileid){
                        systemFileListItem[n].active="1";
                        systemFileListItem[n].disabled=true;
                        systemFileListItem[n].afterIconArray[1].className = systemFileListItem[n].fileDataInfo.isMedia?'file-list-play-icon on':'file-list-eye-icon on';
                    }
                    else{
                        systemFileListItem[n].active="0";
                        systemFileListItem[n].disabled=false;
                        systemFileListItem[n].afterIconArray[1].className = systemFileListItem[n].fileDataInfo.isMedia?'file-list-play-icon off':'file-list-eye-icon off';
                    }
                }
            }
            that.setState({filelistData:fileListData});


            let swfpath = fileDataInfo.filedata.swfpath;
            let index = swfpath.lastIndexOf(".") ;
            let imgType = swfpath.substring(index);
            let fileUrl = swfpath.replace(imgType,"-1"+imgType) ;

            let serviceUrl = TkConstant.SERVICEINFO.address;
            //let urls = serviceUrl.split(":");
            //serviceUrl =  'http:' +  urls[1] ;


            let playFileData = {};
            playFileData.filePlayUrl = serviceUrl + fileUrl;
            playFileData.filename=fileDataInfo.filedata.filename;
            playFileData.fileid=fileDataInfo.filedata.fileid;
            playFileData.userid = ServiceRoom.getTkRoom().getMySelf().id;
            if (fileDataInfo.mediaType == 'mp4') {
                playFileData.video=true;
            } else if(fileDataInfo.mediaType == 'mp3'){
                playFileData.video=false;
            }
            ServiceTools.unpublishAllMediaStream(function(code,stream){
                that.closeMediaVideoCallback(code,stream,playFileData,fileDataInfo);
            });
        }
    }

    openFilePreLoad(pageCacheNum,preLoadStep,fileDataInfo){
        /*currPage,cachePageNum,pageNum,pageStep*/
        let that = this;
        //let currPage = preLoadData.currPage;
        let cachePageNum = pageCacheNum;
        let pageNum = fileDataInfo.filedata.pagenum;
        let pageStep = preLoadStep;
        let openFilePreLoad = {};
        let bFlag = false;
        if(cachePageNum + pageStep <= pageNum){
            openFilePreLoad.step = pageStep;
            openFilePreLoad.cachePageNum = cachePageNum;
            cachePageNum += pageStep;
            bFlag = true;
        } else if(cachePageNum < pageNum ){  //缓存页数加步长大于文档总页数，缓存总页数小于文档总页数
            openFilePreLoad.step = pageNum - cachePageNum;
            openFilePreLoad.cachePageNum = cachePageNum;
            cachePageNum = pageNum;
            bFlag = true;
        }

        if(bFlag) {
            openFilePreLoad.data= fileDataInfo;
            //dispatch 分发一个预下载事件
            eventObjectDefine.CoreController.dispatchEvent({
                type: 'openFilePreLoad',
                message: openFilePreLoad
            });
        }

        return cachePageNum;
    }

    //删除一个普通文档
    handlerDeleteDocuemnt(fileDataInfo){
        let that = this;
        let toID = "__all" ;
        ServiceTooltip.showConfirm(TkGlobal.language.languageData.alertWin.call.fun.deleteCourseFile.isDel , function (answer) {
            if(answer){
                //调用删除文件web接口，向php发送删除信息
                ServiceRoom.getTkRoom().deleteFile(fileDataInfo.filedata.fileid, function (code ,response_json ) {
                    if(code === 0  && response_json){
                        //向信令发送删除文档消息
                        let networkMsg = that._createNetworkMsg(fileDataInfo,true);
                        ServiceSignalling.sendSignallingFromDocumentChange(networkMsg , toID);
                    }else{
                        //显示错误信息
                        //xgd todo...
                        ServiceTooltip.showError(TkGlobal.language.languageData.alertWin.call.fun.deleteCourseFile.fileDelete.failure.text);
                    }
                });
            }
        });
    }

    /*在普通文件列表中增加文件 ,只有老师和助教才能操作文件*/
    addFileToList(fileItemDescInfo){
        const that = this ;
        let bFind = false;
        let fileListData = that.state.filelistData;
        let fileListItem = fileListData.fileListItemJson;
        let systemFileListItem = fileListData.systemFileListItemJson;
        if((this.props.isMediaUI && fileItemDescInfo.fileDataInfo.isMedia) || (!this.props.isMediaUI && !fileItemDescInfo.fileDataInfo.isMedia)) { //如果是媒体文件或者是普通课件的话，判断数据里面有没有该文件

            //if(user.role === TkConstant.role.roleStudent  || user.role === TkConstant.role.roleTeachingAssistant) {
            for (let i = 0; i < fileListItem.length; i++) {
                if (fileItemDescInfo.fileDataInfo.filedata.fileid == fileListItem[i].fileDataInfo.filedata.fileid) {
                    //fileListItem[i].active = "1";
                    //fileListItem[i].afterIconArray[1].className = fileListItem[i].fileDataInfo.isMedia?'file-list-play-icon on':'file-list-eye-icon on';
                    bFind = true;
                } else {
                    //fileListItem[i].active = "0";
                    //fileListItem[i].afterIconArray[1].className = fileListItem[i].fileDataInfo.isMedia?'file-list-play-icon off':'file-list-eye-icon off';
                }

            }

            if (!bFind) {
                if(TkConstant.joinRoomInfo.isDocumentClassification) {
                    if(fileItemDescInfo.fileDataInfo.filedata.filetype==="whiteboard"){
                        fileListItem.push(fileItemDescInfo);
                        systemFileListItem.push(fileItemDescInfo);
                    }
                    if(fileItemDescInfo.fileDataInfo.filedata.filecategory===0){
                        fileListItem.push(fileItemDescInfo);
                    }else if(fileItemDescInfo.fileDataInfo.filedata.filecategory===1){
                        systemFileListItem.push(fileItemDescInfo)
                    }
                }else{
                    fileListItem.push(fileItemDescInfo);
                }
                that.state.filelistData.titleJson.number += 1;
                //fileListItem.sort(that.fileSortCompare);
               /* let sortState = undefined;
                if(this.fileSortType === 3)
                    sortState = this.fileSortState;
                if(this.fileSortType === 2)
                    sortState = this.fileTypeSortState;
                if(this.fileSortType === 1)
                    sortState = this.fileNameSortState;*/

                fileListItem.sort(that.fileSortBy(this.fileSortType,this.fileSortState));
                systemFileListItem.sort(that.fileSortBy(this.fileSortType,this.fileSortState));
                that.setState({
                    filelistData: fileListData,
                });
            }
        }
    };

    //按文件ID升序排序
    fileSortCompare(obj1, obj2) {
        let val1 = obj1.fileDataInfo.filedata.fileid;
        let val2 = obj2.fileDataInfo.filedata.fileid;
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }
    }

    fileSortBy(attr,rev){
        //第二个参数没有传递 默认升序排列
        if(rev ==  undefined){
            rev = 1;
        }else{
            rev = (rev) ? 1 : -1;
        }

        return function(obj1, obj2){
            let val1 = undefined;
            let val2 = undefined;

            if(obj1.fileDataInfo.filedata.fileid == 0 || obj2.fileDataInfo.filedata.fileid == 0)
                return;

            if(attr === 3){ //这里需要转成数字进行比较
                val1 = Number(obj1.fileDataInfo.filedata.fileid);
                val2 = Number(obj2.fileDataInfo.filedata.fileid);
            }

            if(attr === 2){
                val1 = obj1.fileDataInfo.filedata.filetype;
                val2 = obj2.fileDataInfo.filedata.filetype;
            }

            if(attr === 1){
                val1 = obj1.fileDataInfo.filedata.filename;
                val2 = obj2.fileDataInfo.filedata.filename;
            }

            if(val1 < val2){
                return rev * -1;
            }
            if(val1 > val2){
                return rev * 1;
            }
            return 0;
        }
    }

    //newArray.sort(sortBy('number',false))

    /*在普通文件列表中删除文件 ,只有老师和助教才能操作文件*/
    removeFileToList(fileid,fromID,isDynamicPPT) {

        const that = this;
        let fileListData = that.state.filelistData;
        let fileListItem = fileListData.fileListItemJson;
        let nextOpenData = {};
        let index = 0;
        let indexMedia = -1;
        let length = fileListItem.length;
        let bFound = false;
        for (let i = 0; i < length; i++) {
            if (fileid == fileListItem[i].fileDataInfo.filedata.fileid) {
                if (fileListItem[i].active == 1){
                    index = i;
                    indexMedia = i;
                }
                fileListItem.splice(i, 1);
                bFound = true;
                break;
            }
        }
        if (fileid === TkGlobal.defaultFileInfo.fileid) {
            let fileDataArr = fileListItem.slice(0);
            if (fileDataArr.length>1) {
                fileDataArr.sort(that.fileSortBy(3,1));
                let defaultFileInfo = fileDataArr[1];
                if (!defaultFileInfo.fileDataInfo.isMedia) {
                    TkGlobal.defaultFileInfo = defaultFileInfo.fileDataInfo.filedata;
                }
            }else {
                let defaultFileInfo = fileDataArr[0];
                if (!defaultFileInfo.fileDataInfo.isMedia) {
                    TkGlobal.defaultFileInfo = defaultFileInfo.fileDataInfo.filedata;
                }
            }
        }

        if (!bFound)
            return;
        //备注 动态PPT  现在 老师和助教都可以发布信令

        that.state.filelistData.titleJson.number -= 1;
        that.setState({filelistData: fileListData});

        //未上课,老师和助教都可以，上课后只有操作该事件的人，才可以
        if(!TkGlobal.classBegin ){
            if (!that.props.isMediaUI && fileListItem.length > 0 && index > 0) {
                nextOpenData = fileListItem[index];

                if (nextOpenData === undefined)
                    nextOpenData = fileListItem[index - 1];
                //发送信令并播放
                let flag = that.searchUploadFileArray(nextOpenData.fileDataInfo.filedata.fileid);
                if(flag)
                    return;

                that.handlerOpenDocuemnt(nextOpenData.fileDataInfo);
            } else if (that.props.isMediaUI && fileListItem.length > 0 && indexMedia >= 0) {
                ServiceTools.unpublishAllMediaStream(function (code, stream) {
                    //that.closeMediaVideoCallback(code,stream,playFileData,fileDataInfo);
                });
            }

        }else  { //只有操作该事件的人，才能发信令, 现在还是老师和助教都可以操作

            let extensionId = ServiceRoom.getTkRoom().getMySelf().id ;
            if (!that.props.isMediaUI && fileListItem.length > 0 && index > 0) {
                nextOpenData = fileListItem[index];

                if (nextOpenData === undefined)
                    nextOpenData = fileListItem[index - 1];

                let flag = that.searchUploadFileArray(nextOpenData.fileDataInfo.filedata.fileid);
                if(flag)
                    return;

                //发送信令并播放
                if(fromID === extensionId){//todo 删掉了判断（ || isDynamicPPT）!!!!!!
                    that.handlerOpenDocuemnt(nextOpenData.fileDataInfo);
                }
            } else if (that.props.isMediaUI && fileListItem.length > 0 && indexMedia >= 0) {
                if(fromID === extensionId) {
                    ServiceTools.unpublishAllMediaStream(function (code, stream) {
                        //that.closeMediaVideoCallback(code,stream,playFileData,fileDataInfo);
                    });
                }
            }

        }

    };


    /*在普通文件列表中更新文件内容 ,只有老师和助教才能操作*/
    updateFileToListFile(fileid,response){
        const that = this ;
        let tempFileListItem = undefined;
        let fileListData = that.state.filelistData;
        let fileListItem = fileListData.fileListItemJson;

        for (let i = 0; i < fileListItem.length; i++) {
            if (fileid == fileListItem[i].fileDataInfo.filedata.fileid) {
                if(response!==undefined){
                fileListItem[i].fileDataInfo.filedata.pagenum =  parseInt(response.pagenum);
                /*fileListItem[i].fileDataInfo.filedata.pptslide = response.pptslide;
                fileListItem[i].fileDataInfo.filedata.currpage = response.currpage;
                fileListItem[i].fileDataInfo.filedata.swfpath = response.swfpath;
                fileListItem[i].fileDataInfo.filedata.steptotal = response.steptotal;
                fileListItem[i].fileDataInfo.filedata.pptslide = response.pptslide;
                fileListItem[i].fileDataInfo.filedata.pptstep = response.pptstep;*/

                }
                tempFileListItem = fileListItem[i];
                break;
            }
        }
        that.setState({filelistData: fileListData});
        return tempFileListItem;
    };


    /*在普通文件列表中更新文件 ,只有老师和助教才能操作文件*/
    updateFileToList(fileinfodesc,tmpFileid){
        const that = this ;
        let bFind = false;

        if((this.props.isMediaUI && fileinfodesc.fileDataInfo.isMedia) || (!this.props.isMediaUI && !fileinfodesc.fileDataInfo.isMedia))
        {
            let fileListData = that.state.filelistData;
            let fileListItem = fileListData.fileListItemJson;
            //let tempFileinfo = fileinfodesc;
            /*if(this.props.isMediaUI || fileinfodesc.fileDataInfo.isMedia){

            } else {
                let currProgressText = TkGlobal.language.languageData.toolContainer.toolIcon.FileConversion.text;
                fileinfodesc.children =
                    <FileProgressBar id={"fileProgressBar_"+tmpFileid} currProgressWidth={100} currProgressText={currProgressText}
                                     progressBarDisabled={true} cancelFileUpload={undefined} cancelBtnShow={false}/>;
                /!*fileListItem[i].children =
                    <FileProgressBar id={"fileProgressBar_"+tmpFileid} currProgressWidth={100} currProgressText={currProgressText}
                                     progressBarDisabled={true} cancelFileUpload={undefined} cancelBtnShow={false}/>;*!/
            }*/

            for (let i = 0; i < fileListItem.length; i++) {
                if (tmpFileid == fileListItem[i].fileDataInfo.filedata.fileid) {
                    //先删除
                    fileListItem.splice(i, 1);
                    //再添加
                    fileListItem.splice(i, 0, fileinfodesc);
                    break;
                }
            }
            that.setState({filelistData: fileListData});
        }

    };

    changeDocumentFileListAccpetArr(event){

        let that = this;
        that.setState({
            commonAccept:TkConstant.FILETYPE.documentFileListAccpet,
            mediaAccept:TkConstant.FILETYPE.mediaFileListAccpet,
        });

    }

    playMediaUnpublishSucceed(event){
        let that= this;
        let playMediaUnpublishData = event.message;
        let stream = playMediaUnpublishData.stream;
        //if(stream.getAttributes().filename==="")  //动态PPT视频
        //    return;

        let fileid = stream.getAttributes().fileid;
        let nFlag = 3;

        this.currPlayFileid = undefined;
        //取消发布成功，所有媒体文件都可以操作
        that.changeMediaFileAttr(false  ,nFlag ,  fileid );
    }

    playMediaPublishSucceed(event){
        let that= this;
        let playMediaPublishData = event.message;
        let stream = playMediaPublishData.stream;
        if(stream.getAttributes().filename==="" || !that.props.isMediaUI)  //动态PPT视频,普通文件
            return;


        let fileid = stream.getAttributes().fileid;

        //判断播放的时候该文件是否还存在,存在播放，不存在取消发布
        let fileListData = that.state.filelistData;
        let fileListItem = fileListData.fileListItemJson;
        let systemFileListItem = fileListData.systemFileListItemJson;
        let bFlag = false;
        for (let i = 0; i < fileListItem.length; i++) {
            if (fileid == fileListItem[i].fileDataInfo.filedata.fileid) {
                bFlag = true;
                break;
            }
        }
        if(TkConstant.joinRoomInfo.isDocumentClassification) {
            for (let i = 0; i < systemFileListItem.length; i++) {
                if (fileid == systemFileListItem[i].fileDataInfo.filedata.fileid) {
                    bFlag = true;
                    break;
                }
            }
        }
        let extensionId = ServiceRoom.getTkRoom().getMySelf().id + ":media";
        if(!bFlag && (stream.extensionId === extensionId)){

            ServiceTools.unpublishAllMediaStream(function(code,stream){
                //that.closeMediaVideoCallback(code,stream,playFileData,fileDataInfo);
            });
        }

        let nFlag = 1;
        this.currPlayFileid = fileid;
        //发布成功，除当前媒体文件不可操作，都可以操作
        that.changeMediaFileAttr(false  , nFlag ,  fileid );
    }

    playMediaPublishFail(event){
        let that= this;
        let playMediaPublishData = event.message;
        let stream = playMediaPublishData.stream;
        if(stream.getAttributes().filename==="") {  //动态PPT视频
            //显示提示信息
            ServiceTooltip.showPrompt(TkGlobal.language.languageData.alertWin.call.fun.file.pptFile.text);
            return;
        }
        let fileid = stream.getAttributes().fileid;
        let nFlag = 2;
        //发布失败，所有媒体文件都可以操作
        that.changeMediaFileAttr(false   , nFlag ,  fileid );
        //显示提示信息
        ServiceTooltip.showPrompt(TkGlobal.language.languageData.alertWin.call.fun.file.mediaFile.text);
    }

    playMediaUnpublishFail(event){
        let that= this;
        let playMediaUnpublishData = event.message;
        let stream = playMediaUnpublishData.stream;
        if(stream.getAttributes().filename==="")  //动态PPT视频
            return;
        let fileid = stream.getAttributes().fileid;
        let nFlag = 4;
        //取消发布失败，除当前媒体文件不可操作，都可以操作
        that.changeMediaFileAttr(false , nFlag ,  fileid );
    }

    changeMediaFileAttr(disabled  , nFlag ,  fileid ) {
        //nFlag 0:正在发布 ,  1.发布成功， 2.发布失败， 3.取消发布成功，4.取消发布失败,不改变状态
        let that = this;
        let fileListData = that.state.filelistData;
        let fileListItem = fileListData.fileListItemJson;
        let systemFileListItem = fileListData.systemFileListItemJson;
        if(!this.props.isMediaUI) //不是媒体文件
            return;


        for (let i = 0; i < fileListItem.length; i++) {
            fileListItem[i].disabled = disabled;

            if(  fileListItem[i].fileDataInfo.filedata.fileid == fileid && (nFlag === 1 || nFlag === 4) ){      //pid 端传入fileid 为数值型
                fileListItem[i].afterIconArray[1].disabled = true ;
                if(nFlag === 1)
                    fileListItem[i].active = "1";
            }else{

                fileListItem[i].afterIconArray[1].disabled = disabled ;
                //fileListItem[i].afterIconArray[2].disabled = disabled ;
                fileListItem[i].active = "0";

            }
            fileListItem[i].afterIconArray[1].className =this.props.isMediaUI ? 'file-list-play-icon off' : 'file-list-eye-icon off';
        }
        for (let i = 0; i < systemFileListItem.length; i++) {
            systemFileListItem[i].disabled = disabled;

            if(  systemFileListItem[i].fileDataInfo.filedata.fileid == fileid && (nFlag === 1 || nFlag === 4) ){      //pid 端传入fileid 为数值型
                systemFileListItem[i].afterIconArray[1].disabled = true ;
                if(nFlag === 1)
                    systemFileListItem[i].active = "1";
            }else{

                systemFileListItem[i].afterIconArray[1].disabled = disabled ;
                //fileListItem[i].afterIconArray[2].disabled = disabled ;
                systemFileListItem[i].active = "0";

            }
            systemFileListItem[i].afterIconArray[1].className =this.props.isMediaUI ? 'file-list-play-icon off' : 'file-list-eye-icon off';
        }
        this.setState({filelistData: fileListData});
    };


    closeMediaVideoCallback(code,stream,playFileData,fileDataInfo){
        const that = this ;
        //code   -1:没有流可以取消发布 , 0：取消发布失败 ， 1：取消发布成功 , -2:没有unpublishMediaStream权限
        if( code == -1 ||  code == 1 ) {
            let nFlag = 0 ;
            that.changeMediaFileAttr(true , nFlag , undefined );
            //dispatch 分发一个文件连接事件
           /* eventObjectDefine.CoreController.dispatchEvent({
                type: 'playMediaFile',
                message: playFileData
            });*/
            let toID = "__all";
            if(!TkGlobal.classBegin){
                toID = ServiceRoom.getTkRoom().getMySelf().id;
            }
            let stream = TK.Stream({video: playFileData.video, audio: true , url: playFileData.filePlayUrl, extensionId:ServiceRoom.getTkRoom().getMySelf().id + ":media", attributes:{filename:playFileData.filename,fileid:playFileData.fileid,type:'media',toID:toID , pauseWhenOver:playFileData.video && TkConstant.joinRoomInfo.pauseWhenOver}},TkGlobal.isClient);
            if((TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant) && playFileData.userid === ServiceRoom.getTkRoom().getMySelf().id ){
                ServiceSignalling.publishMediaStream(stream);
            }
        }
    };

    render(){
        const that = this ;
        const {show, mediaFileType , styleJson} = this.props ;

        let filelistData = that.state.filelistData;
        let accept = this.props.isMediaUI?that.state.mediaAccept:that.state.commonAccept;
        if(mediaFileType!=undefined){
            accept = mediaFileType
        }
        if(!this.props.isMediaUI && that.isSelectUploadH5Document){
            accept = that.state.h5DocumentAccept;
        }
        return (
            <div>
                {TkConstant.joinRoomInfo.isDocumentClassification?<FileListDumb isMediaUI = {this.props.isMediaUI} isUploadH5Document={this.props.isUploadH5Document} idType={this.props.idType} show={show} styleJson={styleJson} {... filelistData}  currDocumentFileid={that.currDocumentFileid}  uploadFileArray = {that.uploadFileArray}/> :                <FileListDumb isMediaUI = {this.props.isMediaUI} isUploadH5Document={this.props.isUploadH5Document} idType={this.props.idType} show={show} styleJson={styleJson} {... filelistData} />}
                <FileSelect isMediaUI = {this.props.isMediaUI} selecteFileCompleted={that.uploadForm.bind(that) } accept={accept}/>
            </div>

        )
    };

};
export default  FileListSmart;

