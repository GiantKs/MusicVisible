/**
 * 普通文件列表的 Dumb组件
 * @module FileListDumb
 * @description   提供普通文件列表的Dumb组件
 * @author Xiagd
 * @date 2017/08/17
 */


'use strict';
import React  from 'react';
import PropTypes  from 'prop-types';
import TkAppListDumb  from '../tkAppList/tkAppList';
import TkUtils  from 'TkUtils';
import TkConstant from "../../tk_class/TkConstant";
import AdministratorList  from '../tkAppList/administratorList';

class FileListDumb extends React.Component{
    constructor(props){
        super(props);
    };

    /*加载用户列表所需要的props*/
    loadUserListProps(titleJson ,fileListItemJson ){
        //const _getListItemDataArray = (fileListItemJson) => {
        let  that = this;
        const listItemDataArray = [] ;
        for(let i=0;i<fileListItemJson.length;i++)
        {
            let value = fileListItemJson[i];
            let {id , disabled  , children , textContext ,afterIconArray , show , active ,temporaryDisabled , filetype, onClick } = value ;
            let tmpFileListItemJson = {
                className: 'file-container clear-float  add-position-relative '  + (active==1?'active':'') + (disabled?" disabled":""),
                id: 'file_list_' + id,
                textContextArray: [
                    {
                        className: 'file-name add-fl add-nowrap',
                        textContext: textContext,
                    }
                ],
                children:children ,
                //filetype:filetype,
                //dynamicppt:dynamicppt,
                show: show,
                onClick: onClick,

                iconArray:(function (afterIconArray) {
                    const tmpArr = [];
                    afterIconArray = afterIconArray || [];
                    afterIconArray.forEach(function (item) {
                        const {disabled,after, before, className, show, onClick, ...other} = item;
                        tmpArr.push(
                            {
                                attrJson: {
                                    className: className,
                                },
                                before: before,
                                after: after,
                                disabled: disabled,
                                show: show,
                                onClick: onClick,
                                ...TkUtils.filterContainDataAttribute(other)
                            }
                        );
                    });
                    /*tmpArr.push({
                        attrJson:{
                            className:'file-portrait add-block ',
                        } ,
                        before:true,
                        disabled:true ,
                        show:true ,
                        onClick:undefined
                    });*/
                    return tmpArr;
                })(afterIconArray) ,

            };
            listItemDataArray.push(tmpFileListItemJson);
        };
        let bStudent = TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant;
        if(TkConstant.joinRoomInfo.isDocumentClassification){
            let systemFileListDataProps={};
            let fileListDataProps={};
            systemFileListDataProps.systemFileListProps = {
                id:'tool_file_list_extend ' + this.props.idType ,
                className:'tool-file-list-extend ' + this.props.idType  + (bStudent?'':' student'),
                titleJson:{
                    id:'tool_file_list' ,
                    title:titleJson.title ,
                    titleSort:titleJson.titleSort,
                    number:titleJson.number
                }  ,
                listPros:{
                    id:'tool_participant_file_list' ,
                    className:'t-participant-file-list add-over-auto-max-height  custom-scroll-bar' ,
                    listItemDataArray:listItemDataArray ,
                }  ,
            };
            fileListDataProps.fileListProps = {
            id:'tool_file_list_extend ' + this.props.idType ,
                className:'tool-file-list-extend ' + this.props.idType  + (bStudent?'':' student'),
                titleJson:{
                id:'tool_file_list' ,
                    title:titleJson.title ,
                    titleSort:titleJson.titleSort,
                    number:titleJson.number
                }  ,
            listPros:{
                id:'tool_participant_file_list' ,
                    className:'t-participant-file-list add-over-auto-max-height  custom-scroll-bar' ,
                    listItemDataArray:listItemDataArray ,
                }  ,
            };
            return {
                fileListProps:fileListDataProps,
                systemFileListProps:systemFileListDataProps
            } ;
        }else{
            const fileListProps = {
                id:'tool_file_list_extend ' + this.props.idType ,
                className:'tool-file-list-extend ' + this.props.idType  + (bStudent?'':' student'),
                titleJson:{
                    id:'tool_file_list' ,
                    title:titleJson.title ,
                    titleSort:titleJson.titleSort,
                    number:titleJson.number
                }  ,
                listPros:{
                    id:'tool_participant_file_list' ,
                    className:'t-participant-file-list add-over-auto-max-height  custom-scroll-bar' ,
                    listItemDataArray:listItemDataArray ,
                }  ,
            };
            return {fileListProps:fileListProps} ;
        }
    };

    render(){
        const that = this ;
        const {titleJson , fileListItemJson , systemFileListItemJson , show , uploadFileArray , ...otherProps} = that.props ;
        const {fileListProps} = that.loadUserListProps(titleJson ,fileListItemJson ) ;
        const {systemFileListProps} = that.loadUserListProps(titleJson ,systemFileListItemJson )
        return (
            <div>
                {TkConstant.joinRoomInfo.isDocumentClassification?<AdministratorList isSort={true} isMediaUI = {this.props.isMediaUI} isUploadH5Document={this.props.isUploadH5Document} show={show} uploadFileArray ={uploadFileArray} {...fileListProps} {...systemFileListProps} {...otherProps}/>:<TkAppListDumb isSort={true} isMediaUI = {this.props.isMediaUI} isUploadH5Document={this.props.isUploadH5Document} show={show} {...fileListProps} {...otherProps}  />}
            </div>
        )
    };
};

FileListDumb.propTypes = {
titleJson:PropTypes.object.isRequired ,
fileListItemJson:PropTypes.array.isRequired,
    uploadButtonJson:PropTypes.object.isRequired
};
export  default  FileListDumb ;

/*
数据格式：
props = {
show:true ,
titleJson:{
title:title ,
number:number
} ,
userListItemJson:Map( [userid:{
id:id,
disabled:disabled  ,
textContext:textContext ,
afterIconArray:[
{
className:className
}
]
}
] ) ,
...otherProps
}
* */
