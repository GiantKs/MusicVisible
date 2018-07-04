import React from 'react';
import ss from 'ServiceSignalling';
import evtObj from 'eventObjectDefine';
import ServiceRoom from 'ServiceRoom';
import TkUtils from 'TkUtils';
import TkGlobal from 'TkGlobal';

import { DragSource } from 'react-dnd';

const specSource = {
    beginDrag(props, monitor, component) {
        const { id, percentLeft,percentTop } = props;
        return { id, percentLeft,percentTop };
    },
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}


class SignIn extends React.Component {

    constructor(props){
        super(props);
        let id = props.id;
        this.state={
            [id]:{
                pagingToolLeft:"",
                pagingToolTop:"",
            },
            show: false,
            currentTime: 0
        }

        this.markID = new Date().getTime()+'_'+Math.random();
        this.assID = undefined;
        this.timerID = undefined;
        this.timerType = [6e4, 1.8e5, 3e5, 6e5, 1.8e6];
        
    }

    componentDidMount(){
        evtObj.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPubmsg, this.handleRoomPubmsg.bind(this), this.markID);
        evtObj.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDelmsg, this.handleRoomDelmsg.bind(this), this.markID); //监听roomDelmsg
        evtObj.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomMsglist, this.handleRoomMsgList.bind(this), this.markID);
        evtObj.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPlaybackClearAllFromPlaybackController,this.handlerRoomPlaybackClearAll.bind(this) , this.listernerBackupid); //roomPlaybackClearAll 事件：回放清除所有信令

    }

    componentWillUnmount(){
        evtObj.CoreController.removeBackupListerner(this.markID);
    }

    handleRoomMsgList(dataFromServer){
        dataFromServer.message.forEach((item, index) => {
            if(item.name === 'LiveCallRoll'){
                this.setState({
                    show: true,
                    currentTime:  this.timerType[item.data.timerType]-(TkGlobal.serviceTime - item.ts*1e3),
                })
                if(this.timerID !== undefined){
                    clearInterval(this.timerID)
                }
                this.timerID = setInterval(() => {
                    if(this.state.currentTime <= 0){
                        this.setState({show: false});
                    }else {
                        this.setState({currentTime: this.state.currentTime-1000});
                    }
                },1000);
                this.assID = item.id;
            }
        });
    }

    //重置数据
    handlerRoomPlaybackClearAll(){
        this.setState({
            show: false,
            currentTime: 0
        })
        this.assID = undefined;
        this.timerID = undefined;
        this.timerType = [6e4, 1.8e5, 3e5, 6e5, 1.8e6];
    };

    // 监听pubmsg事件
    handleRoomPubmsg(dataFromServer){

        let message = dataFromServer.message;

        switch(message.name){
            case 'LiveCallRoll':
                this.setState({
                    show: true,
                    currentTime:  this.timerType[message.data.timerType],
                });
                if(this.timerID !== undefined){
                    clearInterval(this.timerID)
                }
                this.timerID = setInterval(() => {
                    if(this.state.currentTime <= 0){
                        this.setState({show: false});
                    }else {
                        this.setState({currentTime: this.state.currentTime-1000});
                    }
                },1000);
                this.assID = message.id;
                break;
        }
    }

    handleRoomDelmsg(dataFromServer){
        
        let message = dataFromServer.message;

        switch(message.name){
            case 'LiveCallRoll':
                this.setState({
                    show: false,
                    currentTime: 0,
                });
                if(this.timerID !== undefined){clearInterval(this.timerID);}
                this.timerID = undefined;
                this.assID = undefined;
                break;
        }
    }

    handleSignIn(){
        this.setState({show: false,currentTime: 0});
        if(this.timerID !== undefined){clearInterval(this.timerID);}
        this.timerID = undefined;
        ss.sendSignallingFromLiveSignIn('LiveSignIn', 
                                        this.assID,
                                        {},[]);
    }

    ms2minute(ms){
        let sTotal = parseInt(ms/1000),
            m = parseInt(sTotal/60),
            s = sTotal%60;

        return (m>9?m:('0'+m)) +':'+ (s>9?s:('0'+s));
    }

    __getSignInID(){
        return (
           'si_' + ServiceRoom.getTkRoom().getMySelf().id + '_' + TkUtils.getGUID().getGUIDDate() + TkUtils.getGUID().getGUIDTime() // vote_userid_timestamp
        );
    }

    close(){
        this.setState({show: false})
    }

    render(){
        const {connectDragSource,isDragging,percentLeft,percentTop,id,isDrag} = this.props;
        TkUtils.getPagingToolLT(this,percentLeft,percentTop,id,isDrag);
        let {pagingToolLeft,pagingToolTop} = this.state[id];
        let mySelf = ServiceRoom.getTkRoom().getMySelf();
        let roleAudit = mySelf.role === TkConstant.role.roleAudit? true:false;
        return connectDragSource(
            <div className='sign-in' id={id} style={{display: (this.state.show && roleAudit)? 'block' : 'none',position:"absolute",left:pagingToolLeft+"rem",top:pagingToolTop+"rem",border:"0px"}}>
                <button className='panel-close light-close' onClick={this.close.bind(this)} style={{position: 'absolute', top: '1.1rem', right: '.4rem'}}></button>
                <div className='timer'>{this.ms2minute(this.state.currentTime)}</div>
                <button className='button' onClick={this.handleSignIn.bind(this)}>{TkGlobal.language.languageData.callroll.signIn}</button>
            </div>
        )
    }

}

export default DragSource('talkDrag', specSource, collect)(SignIn); 