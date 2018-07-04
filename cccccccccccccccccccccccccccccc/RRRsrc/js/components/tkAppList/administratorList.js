/**
 * administratorList  系統文件夾和課堂文件夾的组件
 * @module administratorList
 * @author liujianhang
 * @date 2017/12/27
 */
'use strict';
import React  from 'react';
import TkUtils from 'TkUtils' ;
import PropTypes  from 'prop-types';
import List  from '../base/list/List';
import CoreController from 'CoreController';
import TkGlobal from "TkGlobal" ;
import eventObjectDefine from 'eventObjectDefine';

class AdministratorList extends React.Component {
    constructor(props){
        super(props);
        this.uploadFile = this.uploadFile.bind(this) ;
        this.fileListSort = this.fileListSort.bind(this) ;
        this.fileSortType = 3;                  //文件排序类型
        this.fileNameSortState = undefined;            //文件名排序状态
        this.fileTypeSortState = undefined;            //文件类型排序状态
        this.fileSortState = 1;                 //文件上传时间排序状态
        this.state={
            classFile:false,
            publicFile:true,
            isWhiteBoard:false
        };
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

    /*控制显示隐藏课堂文件夹*/
    classFileHandel(){
        this.state.classFile = !this.state.classFile
        this.setState ({
            classFile:this.state.classFile
        })
    }

    /*控制显示白板*/
    onClickShowWhitebord(){
        let that = this ;
        let { fileListProps } = that.props ;
        fileListProps.listPros.listItemDataArray[0].onClick();
    }
    /*控制显示隐藏系统文件夹*/
    publicFileHandel(){
        this.state.publicFile = !this.state.publicFile
        this.setState ({
            classFile:this.state.classFile
        })
    }
    /*上传展示公有还是课堂*/
    showChange(uploadFileArray){
        if(uploadFileArray.length>0){
            this.state.classFile = true;
            this.state.publicFile = false;
        }
    }
    render(){
        let that = this ;
        let {fileListProps ,systemFileListProps , currDocumentFileid , show , isSort , uploadButtonJson , idType , uploadFileArray}    = that.props
        let { id , className  ,  titleJson  , listPros  ,   ...otherProps} = fileListProps ;
        let {sortName,sortType,sortTime} = that._loadSort();
        that.showChange(uploadFileArray)

        return (
            <div id={id} className={"tk-app-list tool-extend "+ (className || '') }   {...TkUtils.filterContainDataAttribute(otherProps)}   style={ {display:show?'block':'none'} }  >
                <div className="tk-app-list-title  add-position-relative" id={titleJson.id}>
                    <span className="tk-list-title-context add-nowrap ">
                        <span> {titleJson.title}</span>
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
                <div className={"tk-list-left-div  scroll-bar"} style={{height:"calc(100% - 1.12rem)"}}>
                    { idType ==="common"?
                        <div className={"tk-list-left "+ (currDocumentFileid===0?"active":"")} onClick={that.onClickShowWhitebord.bind(that)}>
                            <span className={"tk-list-left-icon "}>
                                <button className={"tk-icon-whiteboard"}></button>
                            </span>
                            <span className={"tk-whiteboard-textContent"} title={TkGlobal.language.languageData.toolContainer.toolIcon.whiteBoard.title} >{TkGlobal.language.languageData.toolContainer.toolIcon.whiteBoard.title}</span>
                        </div>:undefined
                    }
                    <div className={"class-folders  "+ (this.state.classFile?"active":"")} onClick={that.classFileHandel.bind(that)}>
                        <span className="class-folders-text">{TkGlobal.language.languageData.toolContainer.toolIcon.classFolder.title}</span>
                        <span className={"class-folders-change-img  "+ (this.state.classFile?"active":"")}></span>
                    </div>
                    <div style={{display:this.state.classFile?"":"none"}}>
                        <List {...listPros} classFile = {this.state.classFile}/>
                    </div>
                    <div className={"system-folders  " + (this.state.publicFile?"active":"")}   onClick={that.publicFileHandel.bind(that)}>
                        <span className="system-folders-text">{TkGlobal.language.languageData.toolContainer.toolIcon.adminFolders.title}</span>
                        <span className={"system-folders-change-img  "+(this.state.publicFile?"active":"")}></span>
                    </div>
                    <div style={{display:this.state.publicFile?"":"none"}}>
                        <List {...systemFileListProps.listPros} />
                    </div>
                </div>
                <div className="tk-app-list-button-container"  style={{display:(uploadButtonJson && uploadButtonJson.show)?'flex':'none'}} >
                    <button className="upload-btn "  onClick={that.uploadFile.bind(that , false)}  ref="uploadDocumentFile" >{uploadButtonJson && uploadButtonJson.buttonText ? uploadButtonJson.buttonText : '' }</button>
                    <button  style={{display:!that.props.isUploadH5Document?'none':''}} className="upload-btn H5"  onClick={that.uploadFile.bind(that , true)}  ref="uploadH5DocumentFile" >{uploadButtonJson && uploadButtonJson.buttonH5Text ? uploadButtonJson.buttonH5Text : '' }</button>
                </div>
            </div>
        )
    };
};


export  default  AdministratorList ;