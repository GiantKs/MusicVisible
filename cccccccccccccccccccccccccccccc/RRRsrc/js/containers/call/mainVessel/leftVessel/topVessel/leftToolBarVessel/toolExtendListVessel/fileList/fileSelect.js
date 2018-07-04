/**
 *  Dumb组件
 * @module fileSelect Dumb
 * @description   提供 file 上传表单显示区组件
 * @author xiagd
 * @date 2017/08/10
 */
'use strict';
import React  from 'react';
import eventObjectDefine  from 'eventObjectDefine';
import ServiceRoom from 'ServiceRoom';
import ServiceTooltip from 'ServiceTooltip';
import TkGlobal from 'TkGlobal';
import TkConstant from 'TkConstant';

class FileSelectDumb extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            hasData:false
        };
        this.uploadElementId = "filedata"+ (this.props.isMediaUI?"media":"document")  ;
        this.uploadFormId="uploadForm"+ (this.props.isMediaUI?"media":"document")  ;
    };


    componentWillMount(){
        if(this.props.isMediaUI)
            eventObjectDefine.CoreController.addEventListener("uploadMediaFile" , this.handlerUploadFile.bind(this) ) ;
        else
            eventObjectDefine.CoreController.addEventListener("uploadFile" , this.handlerUploadFile.bind(this) ) ;

    }

    componentDidMount(){
        //create formdata
        /*if(this.state.hasData) {
            let formData = new FormData($("#uploadForm")[0]);
            this.props.selecteFileCompleted(formData);
            //clear state
            that.setState({hasData:false});
        }*/
    }

    handlerUploadFile(){
        const that = this ;
        if(!this.props.isMediaUI && this.props.accept.toLowerCase().indexOf(TkConstant.FILETYPE.h5DocumentFileListAccpet.toLowerCase()) != -1){
            eventObjectDefine.CoreController.dispatchEvent({type:'uploadH5DocumentFileComplete'}) ;
        }
        let accept = this.props.accept ;
        $("#"+that.uploadElementId ).val("").off("click change") ;
        $("#"+that.uploadElementId ).on("change" ,function(){
            let uploadFileName = $("#"+that.uploadElementId )[0].files[0].name;
            let fileType = uploadFileName.substring(uploadFileName.lastIndexOf(".") + 1);
            let acceptFileTyle = accept.toString() + "";
           if (acceptFileTyle.toLowerCase().indexOf("." + fileType.toLowerCase()) == -1) {
                ServiceTooltip.showError(TkGlobal.language.languageData.alertWin.call.fun.uploadCourseFile.fileTypeError.text.one + fileType + TkGlobal.language.languageData.alertWin.call.fun.uploadCourseFile.fileTypeError.text.two);
                return;
            }
            let MAXFILESIZE = 100 * 1024 * 1024 ;
            let fileSize = $("#"+that.uploadElementId )[0].files[0].size ;
            if(fileSize > MAXFILESIZE) {
                ServiceTooltip.showError(TkGlobal.language.languageData.alertWin.call.fun.uploadCourseFile.fileSizeError.text.one + MAXFILESIZE / 1024 / 1024+ 'M' , false);
                return;
            }


            //上传文档参数
            let uploadFileParams =  ServiceRoom.getTkRoom().getUploadFileParams(uploadFileName , fileType) ;

            $("#"+that.uploadFormId).find("#"+that.uploadElementId ).nextAll().remove();
            for (let x in uploadFileParams) {
                $("#"+that.uploadFormId).append('<input type="text" name="' + x + '" value="' + uploadFileParams[x] + '" />');
            }
            let formData = new FormData($("#"+that.uploadFormId)[0]);
            that.props.selecteFileCompleted(formData,uploadFileName,fileType);
            //that.props.selecteFileCompleted($("#"+that.uploadFormId)[0][0],formData,uploadFileName,fileType);
        }).click();
    };





    render(){
        let {accept} = this.props ;
        return (
                <form  id={this.uploadFormId}   style={{display:'none'}} encType="multipart/form-data"  >
                    {/*<input id="filedata" type="file" accept={accept} />*/}
                    {/*<input value="Get File" type="button" ref="fileSelect" onclick={this.handleSelected}/>*/}
                    <input id={this.uploadElementId} type="file"  name={"filedata"} accept={ TkGlobal.isClient ?'*':accept}/>
                </form>
        )
    };
};

export  default  FileSelectDumb ;
