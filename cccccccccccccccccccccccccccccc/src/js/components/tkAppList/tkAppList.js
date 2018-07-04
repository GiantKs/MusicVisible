/**
 *  应用系统列表的Dumb组件
 * @module TkAppListDumb
 * @description   提供应用系统列表的Dumb组件
 * @author QiuShao
 * @date 2017/08/10
 */
'use strict';
import React  , {PropTypes} from 'react';
import List  from '../base/list/List';
import TkUtils  from 'TkUtils';


class TkAppListDumb extends React.Component{
    constructor(props){
        super(props);
        this.uploadFile = this.uploadFile.bind(this) ;
        this.fileListSort = this.fileListSort.bind(this) ;
        this.fileSortType = 3;                  //文件排序类型
        this.fileNameSortState = undefined;            //文件名排序状态
        this.fileTypeSortState = undefined;            //文件类型排序状态
        this.fileSortState = 1;                 //文件上传时间排序状态
    };

    uploadFile(isH5 , e){
        const {uploadButtonJson} = this.props ;
        if(uploadButtonJson && uploadButtonJson.uploadFile && typeof uploadButtonJson.uploadFile  === "function" ){
            uploadButtonJson.uploadFile(isH5);
        }
        return false ;
    }

    fileListSort(sortType,sortState){
        const {uploadButtonJson} = this.props ;
        if(uploadButtonJson && uploadButtonJson.fileListSort && typeof uploadButtonJson.fileListSort  === "function" ){
            uploadButtonJson.fileListSort(sortType,sortState);
        }
    }

    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        let that = this;

        that.onClickFileListSort("Time");
    }

    onClickFileListSort(type,state){

        let that = this;
        let sortType = undefined;
        let sortState = undefined;
        let { fileListItemJson } = that.props ;
        if(type === 'Time'){
            sortType = 3;
            that.fileSortType = sortType;
            if(that.fileSortState === 1 && state === undefined) {
                sortState = 0;
                that.fileSortState = 0;
            }
            else if(that.fileSortState !==1 && state === undefined){
                sortState = 1;
                that.fileSortState = 1;
            } else if(state !== undefined){
                sortState = state;
                that.fileSortState = state;
            }
        }
        if(type === 'Type'){
            sortType = 2;
            that.fileSortType = sortType;
            if(that.fileTypeSortState === 1 && state === undefined) {
                sortState = 0;
                that.fileTypeSortState = 0;
            }
            else if(that.fileTypeSortState !==1 && state === undefined){
                sortState = 1;
                that.fileTypeSortState = 1;
            } else if(state !== undefined){
                sortState = state;
                that.fileTypeSortState = state;
            }
        }

        if(type === 'Name'){
            sortType = 1;
            that.fileSortType = sortType;
            if(that.fileNameSortState === 1  && state === undefined) {
                sortState = 0;
                that.fileNameSortState = 0;
            }
            else if(that.fileNameSortState !==1  && state === undefined) {
                sortState = 1;
                that.fileNameSortState = 1;
            } else if(state !== undefined){
                sortState = state;
                that.fileNameSortState = state;
            }
        }

        let fileListSortData = {};
        fileListSortData.sortType = sortType;
        fileListSortData.sortState = sortState;
        that.fileListSort(sortType,sortState);
        return false ;
    }

    _loadSort(){
        let that = this;
        let sortName = "";
        let sortType = "";
        let sortTime = "";

        if(that.fileSortType===1 && that.fileNameSortState ===1){
            sortName = " active-up";
        }
        if(that.fileSortType===1 && that.fileNameSortState ===0){
            sortName = " active-down";
        }

        if(that.fileSortType===2 && that.fileTypeSortState ===1){
            sortType = " active-up";
        }
        if(that.fileSortType===2 && that.fileTypeSortState ===0){
            sortType = " active-down";
        }

        if(that.fileSortType===3 && that.fileSortState ===1){
            sortTime = " active-up";
        }
        if(that.fileSortType===3 && that.fileSortState ===0){
            sortTime = " active-down";
        }

        return {sortName:sortName,
            sortType:sortType,
            sortTime:sortTime};

    }

    render(){
        let that = this ;
        let { id , className  , show , isSort  ,  titleJson  , listPros  , uploadButtonJson , ...otherProps } = that.props ;
        let {sortName,sortType,sortTime} = that._loadSort();
        return (
            <div id={id} className={"tk-app-list tool-extend "+ (className || '') }   {...TkUtils.filterContainDataAttribute(otherProps)}   style={ {display:show?'block':'none'} }  >
                <div className="tk-app-list-title  add-position-relative" id={titleJson.id}>
                    <span className="tk-list-title-context add-nowrap ">
                        <span> {titleJson.title}（<span className="tk-list-title-number" >{titleJson.number?titleJson.number:0}</span>）</span>                     
                        <span className={"tk-list-button-context" + sortName} ref="fileSortFormName" style={{display:!isSort?'none':''}} >
                            <button className="text"  onClick={that.onClickFileListSort.bind(that,'Name',undefined)}  >{uploadButtonJson && uploadButtonJson.buttonNameSortText ? uploadButtonJson.buttonNameSortText : ''}  </button>
                            <span className="btn-container">
                                <button className="up" onClick={that.onClickFileListSort.bind(that,'Name',1)} ></button>
                                <button className="down" onClick={that.onClickFileListSort.bind(that,'Name',0)} ></button>
                            </span>
                        </span>
						<span className={"tk-list-button-context " +  sortTime}  ref="fileSortFormTime" style={{display:!isSort?'none':''}}>
                            <button className="text"  onClick={that.onClickFileListSort.bind(that,'Time',undefined)}  >{uploadButtonJson && uploadButtonJson.buttonTimeSortText ? uploadButtonJson.buttonTimeSortText : ''}</button>
                            <span className="btn-container">
                                <button className="up" onClick={that.onClickFileListSort.bind(that,'Time',1)} ></button>
                                <button className="down" onClick={that.onClickFileListSort.bind(that,'Time',0)} ></button>
                            </span>
                        </span>
                        <span className={"tk-list-button-context " + sortType} ref="fileSortFormType" style={{display:!isSort?'none':''}}>
                            <button className="text"  onClick={that.onClickFileListSort.bind(that,'Type',undefined)}  >{uploadButtonJson && uploadButtonJson.buttonTypeSortText ? uploadButtonJson.buttonTypeSortText : ''} </button>
                            <span className="btn-container">
                                <button className="up" onClick={that.onClickFileListSort.bind(that,'Type',1)} ></button>
                                <button className="down" onClick={that.onClickFileListSort.bind(that,'Type',0)} ></button>
                            </span>
                        </span>
                        {/*<div className="check-network-box" style={{display:titleJson.isUserList?"block":"none"}}>
                            <input id="checkNetwork" onChange={titleJson.isUserList?titleJson.checkNetworkBox.onChange:undefined} type="checkbox" defaultChecked={titleJson.isUserList?titleJson.checkNetworkBox.checked:''}/>
                            <label htmlFor="checkNetwork">{titleJson.isUserList?titleJson.checkNetworkBox.text:''}</label>
                        </div>*/}
                        {/*<button className="disabled" >{titleJson.titleSort} : </button>*/}
                    </span>

                </div>
                <List {...listPros} />
                <div className="tk-app-list-button-container"  style={{display:(uploadButtonJson && uploadButtonJson.show)?'flex':'none'}} >
                    <button className="upload-btn "  onClick={that.uploadFile.bind(that , false)}  ref="uploadDocumentFile" >{uploadButtonJson && uploadButtonJson.buttonText ? uploadButtonJson.buttonText : '' }</button>
                    <button  style={{display:!that.props.isUploadH5Document?'none':''}} className="upload-btn H5"  onClick={that.uploadFile.bind(that , true)}  ref="uploadH5DocumentFile" >{uploadButtonJson && uploadButtonJson.buttonH5Text ? uploadButtonJson.buttonH5Text : '' }</button>
                </div>
            </div>
        )
    };
};
TkAppListDumb.propTypes = {
    titleJson:PropTypes.object.isRequired ,
    listPros:PropTypes.object.isRequired ,
    uploadButtonJson:PropTypes.object
};
export  default  TkAppListDumb ;

/*
数据格式:
props = {
    id:id ,
    className:className  ,
    titleJson:{
        id:id ,
        title:title ,
        number:number
    }  ,
    listPros:{...listPros}  ,
    uploadButtonJson:{
         show:show ,
         buttonText:buttonText ,
         uploadFile:uploadFile
    } ,
    ...otherProps
}
* */
