/**
 * 桌面共享的Smart模块
 * @module DesktopShareSmart
 * @description   承载左边的所有组件
 * @author QiuShao
 * @date 2017/08/08
 */
'use strict';
import React from 'react';
import TkConstant from 'TkConstant';
import TkGlobal from 'TkGlobal';
import eventObjectDefine from 'eventObjectDefine';
import ServiceRoom from 'ServiceRoom';
import ServiceSignalling from 'ServiceSignalling';
import DestTop from './share.js';

class DesktopShareSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            destTopStream:undefined,
        };
        this.listernerBackupid =  new Date().getTime()+'_'+Math.random();

        this.teacher=false;
        this.destTopFlag=false;
        this.disconnectedDesttop = false;
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this ;
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamSubscribed_screen, that.handlerStreamSubscribed.bind(that), that.listernerBackupid); //stream-subscribed事件：订阅事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamAdded_screen, that.handlerStreamAdded.bind(that) , that.listernerBackupid); //stream-added事件：增加事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamRemoved_screen, that.handlerStreamRemoved.bind(that) , that.listernerBackupid);//
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDisconnected,that.handlerRoomDisconnectedScreen.bind(that) , that.listernerBackupid); //Disconnected事件：失去连接事件
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that), that.listernerBackupid); //roomDelmsg事件 下课事件 classBegin
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        const that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid);
    };

    handlerStreamSubscribed(streamEvent){
        let that = this;
        if (streamEvent) {
            let stream = streamEvent.stream;
            if(stream.screen){
                this.destTopFlag = true;
                const userid = ServiceRoom.getTkRoom().getMySelf().id;
                if( this.isTeacher(userid)  === false  ) {
                    that.setState({
                        destTopStream:stream
                    });
                } else {
                    this.teacher = true;
                }
            }
        }
    };

    handlerStreamRemoved(removeEvent){
        let that = this;
        if (removeEvent) {
            let stream = removeEvent.stream;
            if(stream.screen){
                stream.hide();
                const userid = ServiceRoom.getTkRoom().getMySelf().id;
                if( this.isTeacher(userid)  === false  ) {
                    this.destTopFlag = false;
                    that.setState({
                        destTopStream:undefined
                    });
                }
                if( this.isTeacher(userid)) {
                    that.setState({
                        destTopStream:undefined
                    });
                }
            }
        }

    }

    handlerStreamAdded(addEvent){
        let that = this;
        if(TkGlobal.playback){ //回放就跳过stream-add
            return ;
        }
        let stream = addEvent.stream ;

        if(stream.screen){
            const userid = ServiceRoom.getTkRoom().getMySelf().id;
            this.destTopFlag = true;
            if( this.isTeacher(userid)  === false  ) {
            } else {
                this.teacher = true;
                that.setState({
                    destTopStream:stream
                });
            }
        }
    }

    handlerRoomDisconnectedScreen(recvEventData){
        let that = this;
        if( TkConstant.hasRole.roleChairman ) {
            that.setState({
                destTopStream:undefined
            });
            this.disconnectedDesttop = true;
        }
    }

    handlerRoomDelmsg(recvEventData){
        const that = this ;
        let pubmsgData = recvEventData.message ;
        switch(pubmsgData.name)
        {
            case "ClassBegin":{
                if(this.destTopFlag) //只有共享,才取消共享
                    that._unScreenSharing();
                break;
            }
        }
    }

    _unScreenSharing() {
        let that = this;
        let destTopStream = that.state.destTopStream;
        this.destTopFlag = false;
        var ws = {
            id: 0,
            x:0,
            y:0,
            width:0,
            height:0,
            mixSpk: false,
            mixMic: false
        };
        ServiceRoom.getTkRoom().updateWindowSource(ws); 
        ServiceSignalling.unpublishDeskTopShareStream(destTopStream);
    }

    //判断用户是否是老师
    isTeacher(userID){
        const user = ServiceRoom.getTkRoom().getUsers()[userID];
        if (user && user.role === TkConstant.role.roleChairman) {
            return true;
        }
        return false;
    }

    render(){
        let that = this ;
        let {styleJson} = this.props ;
        return (
            <article style={Object.assign({} ,styleJson , {display:that.destTopFlag?"block":"none"})} className="desktop-share-container"  >
                {/*工具、白板、其它视频区域*/}
                {this.teacher || that.state.destTopStream!==undefined?<DestTop isTeacher={this.teacher} destTopFlag = {this.destTopFlag} unScreenSharing = {that._unScreenSharing.bind(that) }  stream = {!this.teacher?that.state.destTopStream:undefined} />:undefined}
            </article>
        )
    };
};
export default  DesktopShareSmart;

