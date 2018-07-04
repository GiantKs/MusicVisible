/**
 * 左侧工具栏-工具按钮对应的List列表Smart模块
 * @module ToolExtendListVesselSmart
 * @description   承载左侧工具栏-工具按钮对应的List列表的所有组件
 * @author QiuShao
 * @date 2017/08/11
 */
'use strict';
import React from 'react';
import TkGlobal from 'TkGlobal';
import TkConstant from 'TkConstant';
import CoreController from 'CoreController';
import eventObjectDefine from 'eventObjectDefine';
import UserListSmart from './userList/userList';
import FileListSmart from './fileList/fileList';
import FileSelect  from '../toolExtendListVessel/fileList/fileSelect';

class ToolExtendListVesselSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            listLoad:{ //列表加载
                tool_courseware_list:CoreController.handler.getAppPermissions('loadCoursewarelist') ,
                tool_media_courseware_list:CoreController.handler.getAppPermissions('loadMedialist') ,
                tool_user_list:CoreController.handler.getAppPermissions('loadUserlist') ,
                isUploadH5Document:false ,
            },
           listShow:{ //列表显示
               tool_courseware_list:false ,
               tool_media_courseware_list:false ,
               tool_user_list:CoreController.handler.getAppPermissions('toolListIsShowPairMany')?true:false ,
           },
            tool_common_type: "common",
            tool_media_type:"media",
        };
        this.accept = TkGlobal.isBroadcast && TkGlobal.isClient?TkConstant.FILETYPE.broadcastFileListAccpet:"";
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this ;
        eventObjectDefine.CoreController.addEventListener('initAppPermissions' , that.handlerInitAppPermissions.bind(that)  , that.listernerBackupid) ; //事件 initAppPermissions
        eventObjectDefine.CoreController.addEventListener('updateToolButtonDescription' , that.handlerUpdateToolButtonDescription.bind(that)  , that.listernerBackupid) ; //事件updateToolButtonDescription
        eventObjectDefine.CoreController.addEventListener( 'resetAllLeftToolButtonOpenStateToFalse' , that.handlerResetAllLeftToolButtonOpenStateToFalse.bind(that) , that.listernerBackupid ); //resetAllLeftToolButtonOpenStateToFalse 事件-重置所有的列表打开状态为false
        eventObjectDefine.CoreController.addEventListener( 'callAllWrapOnClick' , that.handlerCallAllWrapOnClick.bind(that) , that.listernerBackupid ); //callAllWrapOnClick 事件-点击整个页面容器
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPubmsg , that.handlerRoomPubmsg.bind(that), that.listernerBackupid); //roomPubmsg事件
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that), that.listernerBackupid); //roomDelmsg事件 下课事件 classBegin
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomConnected , that.handlerRoomConnected.bind(that), that.listernerBackupid); //roomConnected事件
        //eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomParticipantEvicted,that.handlerRoomParticipantEvicted.bind(that) , that.listernerBackupid); //Disconnected事件：参与者被踢事件
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        const that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid);
    };

    handlerCallAllWrapOnClick(recvEventData){
        let {event} = recvEventData.message ;
        if( !(event.target.id === 'tool_list_left' ||  $(event.target).parents("#tool_list_left").length>0 ) && !( event.target.id === 'tool_extend_container' ||  $(event.target).parents("#tool_extend_container").length>0  ) && !CoreController.handler.getAppPermissions('toolListIsShowPairMany') ){
            this.handlerResetAllLeftToolButtonOpenStateToFalse();
        }
    };

    handlerInitAppPermissions(){
        let   listLoad = {
            tool_courseware_list:CoreController.handler.getAppPermissions('loadCoursewarelist') ,
            tool_media_courseware_list:TkGlobal.isBroadcast?false:CoreController.handler.getAppPermissions('loadMedialist') ,
            tool_user_list:CoreController.handler.getAppPermissions('loadUserlist') ,
        };//列表加载
        Object.assign(this.state.listLoad , listLoad);
        this.state.listShow.tool_user_list = CoreController.handler.getAppPermissions('toolListIsShowPairMany')?true:false;
        this.setState({
            listLoad:this.state.listLoad,
            listShow:this.state.listShow,
        });
    };

    /*处理事件updateToolButtonDescription*/
    handlerUpdateToolButtonDescription(recvEventData){
        const that = this ;
        let message = recvEventData.message ;
       if( that.state.listShow[message.id] != undefined ){
           for( let key  of Object.keys(that.state.listShow) ){
               if(key === message.id){
                   that.state.listShow[key] = message.open ;
               }else{
                   that.state.listShow[key] = false ;
               }
           }
           that.setState({listShow:that.state.listShow});
        }else{
            for( let key  of Object.keys(that.state.listShow) ){
                if (key == 'tool_user_list' && CoreController.handler.getAppPermissions('pairOfManyIsShow')) {
                    that.state.listShow[key] = true ;
                }else {
                    that.state.listShow[key] = false ;
                }
            }
            that.setState({listShow:that.state.listShow});
        }
    };

    handlerResetAllLeftToolButtonOpenStateToFalse(){
        const that = this ;
        for( let key  of Object.keys(that.state.listShow) ){
            //如果是一对三十的界面则默认显示用户列表，其他重置
            if (key == 'tool_user_list' && CoreController.handler.getAppPermissions('toolListIsShowPairMany')) {
                that.state.listShow[key] = true ;
            }else {
                that.state.listShow[key] = false ;
            }
        }
        that.setState({listShow:that.state.listShow});
    };

    handlerRoomConnected(){
        this.setState({
            isUploadH5Document:TkConstant.joinRoomInfo.isUploadH5Document
        });
    };

    handlerRoomPubmsg(recvEventData){
        const that = this ;
        let pubmsgData = recvEventData.message ;

        switch(pubmsgData.name)
        {
            case "ClassBegin":{
                //上课要发送信令
                //全部置false
                that.handlerResetAllLeftToolButtonOpenStateToFalse();
                break;
            }

        }
    };

    handlerRoomDelmsg(recvEventData){
        const that = this ;
        let delmsgData = recvEventData.message ;

        switch(delmsgData.name)
        {
            case "ClassBegin":{

                that.handlerResetAllLeftToolButtonOpenStateToFalse();
                break;
            }

        }

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


    render(){
        let that = this ;
        let open = false ;
        for( let value  of Object.values(that.state.listShow) ){
            if(value){
                open = true ;
                break ;
            }
        };
        let tool_extend_container_style = {
            left:CoreController.handler.getAppPermissions('toolListIsShowPairMany')?'100%':(open?'100%':undefined),
            width:CoreController.handler.getAppPermissions('toolListIsShowPairMany')?'2.8rem':'3.6rem',
        };
        return (
            <article className="tool-extend-container tk-weight" id="tool_extend_container"  style={tool_extend_container_style} >
                {that.state.listLoad.tool_courseware_list?<FileListSmart show={that.state.listShow.tool_courseware_list} isUploadH5Document={this.state.isUploadH5Document} isMediaUI={false}  idType={that.state.tool_common_type}/>:undefined} {/* 普通文件列表*/}
                {that.state.listLoad.tool_media_courseware_list?<FileListSmart show={that.state.listShow.tool_media_courseware_list} isMediaUI={true}   idType={that.state.tool_media_type}/>:undefined} {/* 媒体文件列表*/}
                {that.state.listLoad.tool_user_list?<UserListSmart show={that.state.listShow.tool_user_list}  /> :undefined} {/* 用户列表*/}
            </article>
        )
    };

};
export default  ToolExtendListVesselSmart;

