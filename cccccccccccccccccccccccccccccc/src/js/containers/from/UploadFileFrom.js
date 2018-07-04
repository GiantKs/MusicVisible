import React, { Component } from 'react';
import ServiceRoom from 'ServiceRoom';
import ServiceTooltip from 'ServiceTooltip';
import TkGlobal from 'TkGlobal';

export default class UploadFileFrom extends Component{
    constructor(){
        super()
      this.state={
          uploadFileParams:null,
      }
      this.isUpdate = false ;
    }

    componentDidUpdate(prevProps,prevState){
       if(prevProps.flag!==this.props.flag){
           let input=this.i;
           input.value="";
           input.click()
           ;}
           if(!this.isUpdate){
               this.isUpdate = true ;
               let formData = new FormData(this.form);
                   ServiceRoom.getTkRoom().uploadFile(formData, (code,res)=> {
                       if(code === 0){
                           this.props.uoloadSuccessCallback(res)
                       }else{
                           L.Logger.warning('服务端失败');
                       }
                   })

           }
        /*this.props.file(this.i,this.form)*/
    }

    change (e) {
        let input=this.i;
        let accept = this.props.accept ;
        let uploadFileName = input.files[0].name;
        let fileType = uploadFileName.substring(uploadFileName.lastIndexOf(".") + 1);
        let acceptFileTyle = accept.toString() + "";
        if (acceptFileTyle.toLowerCase().indexOf("." + fileType.toLowerCase()) == -1) {
            ServiceTooltip.showError(TkGlobal.language.languageData.alertWin.call.fun.uploadCourseFile.fileTypeError.text.one + fileType + TkGlobal.language.languageData.alertWin.call.fun.uploadCourseFile.fileTypeError.text.two);
            return;
        }
        if(this.props.size){
            let MAXFILESIZE = this.props.size ;
            let fileSize = input.files[0].size ;
            if(fileSize > MAXFILESIZE) {
                ServiceTooltip.showError(TkGlobal.language.languageData.alertWin.call.fun.uploadCourseFile.fileSizeError.text.one + MAXFILESIZE / 1024 / 1024+ 'M' , false);
                return;
            }
        }

        let uploadFileParams =  ServiceRoom.getTkRoom().getUploadFileParams(uploadFileName ,fileType, false) ;
        this.setState({
            uploadFileParams:uploadFileParams
        })
        this.isUpdate = false ;
        e.preventDefault();
        e.stopPropagation();
    }



    render(){
        let ary=[];
        for(let i in this.state.uploadFileParams){
            ary.push({[i]:this.state.uploadFileParams[i]})
        }
        return(
            <div>
                <form style={{display:'none'}} ref={form=>this.form=form} >
                    <input type="file" ref={i=>this.i=i}  onChange={this.change.bind(this)}  name={"filedata"} accept={(TkGlobal.isClient || TkGlobal.osType==='Mac')?'*':this.props.accept} />
                    {
                       ary.length>0?ary.map(function (item,index) {
                        let key,value;
                           for(let a in item){
                               key=a;
                               value=item[a]
                           }
                           return  <input type="text" key={index} name={key} value={value} readOnly/>
                       }):null
                    }
                </form>
            </div>
        )
    }

}