/**
 * 右侧内容-直播抽奖 Smart组件
 * @module responderStudentToolComponent
 * @description   抽奖组件
 * @author xiaguodong
 * @date 2017/11/27
 */

'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import TkGlobal from 'TkGlobal' ;
import rename from 'TkConstant';
import TkConstant from 'TkConstant' ;
import TkUtils from 'TkUtils';
import eventObjectDefine from 'eventObjectDefine';
import CoreController from 'CoreController';
import ServiceRoom from 'ServiceRoom';
import ServiceSignalling from 'ServiceSignalling' ;
import LiveBase from '../../../../../../../../components/live/liveBase';
import Bg1 from '../../../../../../../../../img/luckdraw/luckdrawSbg1.png';
import Bg2 from '../../../../../../../../../img/luckdraw/luckdrawSbg2.png';

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


class LiveLuckdrawStudentSmart extends React.Component {
    constructor(props){
        super(props);
        let id = props.id;
        this.state={
            [id]:{
                pagingToolLeft:"",
                pagingToolTop:"",
            },
            liveLuckdrawStart:false,
            liveLuckdrawEnd:false,
            liveLuckdrawLonding: ['·'],
            // isMyStart: true,
        };
        this.listernerBackupid =  new Date().getTime()+'_'+Math.random();
        this.content = undefined;
        //this.mySelf = undefined;
        this.liveLuckdrawSpanNum = 1;
        this.timeInterval = undefined;
        // this.isMe = false;

    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this;

        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPubmsg , that.handlerRoomPubmsg.bind(that), that.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that), that.listernerBackupid); //roomDelmsg事件
        eventObjectDefine.CoreController.addEventListener( "receive-msglist-liveLuckDraw" , that.handlerMsglistLiveLuckDraw.bind(that), that.listernerBackupid); //roomDelmsg事件
        eventObjectDefine.CoreController.addEventListener( "receive-msglist-liveLuckDrawWinners" , that.handlerMsglistLiveLuckDrawWinners.bind(that), that.listernerBackupid); //roomDelmsg事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomMsglist, that.handlerRoomMsgList.bind(that), that.listernerBackupid);//开始后进入
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPlaybackClearAllFromPlaybackController,that.handlerRoomPlaybackClearAll.bind(that) , that.listernerBackupid); //roomPlaybackClearAll 事件：回放清除所有信令

    };

    componentWillUnmount(){
        let that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid );
    }
    handlerRoomPlaybackClearAll(){  //回放清空
        this.setState({
            liveLuckdrawStart:false,
            liveLuckdrawEnd:false,
            liveLuckdrawLonding: ['·'],
            // isMyStart: true,
        });
        this.content = undefined;
        this.liveLuckdrawSpanNum = 1;
        this.timeInterval = undefined;
    }
    handlerMsglistLiveLuckDraw(recvEventData){
        const that = this;
        
        // if(!that.isMe){
            that.clearTimeInterval();
            that.setState({
                // isMyStart: true,
                liveLuckdrawStart:false,
                liveLuckdrawEnd:false
            });
        // }
    }
    handlerRoomPubmsg(recvEventData){  //图标显示
        const that = this;
        let pubmsgData = recvEventData.message;
        let users = ServiceRoom.getTkRoom().getMySelf();
        switch (pubmsgData.name) {
            case "LiveLuckDraw":
                that.clearTimeInterval();
                if(pubmsgData.data.state === 1){
                    //开始抽奖
                    //that.content =undefined;
                    // that.isMe = false;
                    that.timeInterval = setInterval(() => {
                        that.liveLuckdrawSpanNum++;
                        if(that.liveLuckdrawSpanNum >3){
                            that.liveLuckdrawSpanNum = 1;
                        }
                        that.changeLiveLuckdrawLonding();
                        that.content =<div className="live-luckdraw-student-img">
                            <img src={Bg1} alt=""/>
                            <p className="live-luckdraw-student-londing">{TkGlobal.language.languageData.broadcast.luckdrawLond} {that.state.liveLuckdrawLonding}</p>
                        </div>;
                    },1000)
                    that.content =<div className="live-luckdraw-student-img">
                        <img src={Bg1} alt=""/>
                        <p className="live-luckdraw-student-londing">{TkGlobal.language.languageData.broadcast.luckdrawLond} {that.state.liveLuckdrawLonding}</p>
                    </div>;
                    
                    that.setState({
                        // isMyStart: false,
                        liveLuckdrawStart:true,
                        liveLuckdrawEnd:false
                    })
                    TkGlobal.isStartLuckdraw = true;
                }
                // if(pubmsgData.data.state === 0){
                //     let tempData = pubmsgData.data.winners.winners;
                //     let arr = [];
                //     for(let i = 0; i < tempData.length; i++){
                //         if(users.id === tempData[i].buddyid){
                //             // that.isMe = true;
                //             //Log.debug('我中奖了',that.isMe);
                //             arr.push(<div key={i} className="live-luckdraw-winnerList-item isme">{tempData[i].buddyname}</div>)
                //         }else{
                //             arr.push(<div key={i} className="live-luckdraw-winnerList-item">{tempData[i].buddyname}</div>)
                //         }
                        
                //     }
                //     that.content =<div className="live-luckdraw-student-img">
                //         <img src={Bg2} alt="" />
                //         <div className="live-luckdraw-winnersListBox">
                //             <p className="live-luckdraw-winnersListTitle">{TkGlobal.language.languageData.broadcast.winners}</p>
                //             <div className="live-luckdraw-winnersList">
                //                 {arr}
                //             </div>
                //         </div>
                //     </div>;

                //         that.setState({
                //             // isMyStart: false,
                //             liveLuckdrawStart:true,
                //             liveLuckdrawEnd:false
                //         })
                //     TkGlobal.isStartLuckdraw = false;

                // }
                break;

        }
    };
    handlerRoomDelmsg(recvEventData){
        const that = this;
        let delmsgData = recvEventData.message;
        let users = ServiceRoom.getTkRoom().getMySelf();
        switch (delmsgData.name) {
            case "LiveLuckDraw":
                that.clearTimeInterval();
                let tempData = delmsgData.data.winners.winners;
                let arr = [];
                for(let i = 0; i < tempData.length; i++){
                    if(users.id === tempData[i].buddyid){
                        // that.isMe = true;
                        //Log.debug('我中奖了',that.isMe);
                        arr.push(<div key={i} className="live-luckdraw-winnerList-item isme">{tempData[i].buddyname}</div>)
                    }else{
                        arr.push(<div key={i} className="live-luckdraw-winnerList-item">{tempData[i].buddyname}</div>)
                    }
                    
                }
                that.content =<div className="live-luckdraw-student-img">
                    <img src={Bg2} alt="" />
                    <div className="live-luckdraw-winnersListBox">
                        <p className="live-luckdraw-winnersListTitle">{TkGlobal.language.languageData.broadcast.winners}</p>
                        <div className="live-luckdraw-winnersList">
                            {arr}
                        </div>
                    </div>
                </div>;

                    that.setState({
                        // isMyStart: false,
                        liveLuckdrawStart:true,
                        liveLuckdrawEnd:false
                    })
                TkGlobal.isStartLuckdraw = false;
                break;
        }
    };

    handlerMsglistLiveLuckDrawWinners(winnersData){  //获奖名单
        let that = this;
        let spanList = [];
        let spanLable = undefined;
        let mySelfWinner = false;
        for(let i=0; i<winnersData.length;i++){
            if(winnersData[i].id === ServiceRoom.getTkRoom().getMySelf().id)
                mySelfWinner = true;
            spanLable = <span>winnersData[i].name</span>;
            spanList.push(spanLable);
        }
        return{
            spanList:spanList,
            mySelfWinner:mySelfWinner
        }
    }

    handlerRoomMsgList(recvEventData){//开始后进入

        const that = this;
        let pubmsgData = recvEventData.message;
        let users =ServiceRoom.getTkRoom().getMySelf();
        for(let i=0;i<pubmsgData.length;i++){
            let data = pubmsgData[i];
            if(data.name === "LiveLuckDraw"){
                that.clearTimeInterval();
                //断网重连如果是老师或者助教的话就判断是否是自己发起的
                // if(users.role === TkConstant.role.roleChairman || users.role === TkConstant.role.roleTeachingAssistant){
                //     if(users.nickname === data.data.fromName){
                //         return;
                //     }
                // }
               
                if(data.data.state === 1){
                    //开始抽奖
                    //that.content =undefined;
                    // that.isMe = false;
                    that.timeInterval = setInterval(() => {
                        that.liveLuckdrawSpanNum++;
                        if(that.liveLuckdrawSpanNum >3){
                            that.liveLuckdrawSpanNum = 1;
                        }
                        that.changeLiveLuckdrawLonding();
                        that.content =<div className="live-luckdraw-student-img">
                            <img src={Bg1} alt=""/>
                            <p className="live-luckdraw-student-londing">{TkGlobal.language.languageData.broadcast.luckdrawLond} {that.state.liveLuckdrawLonding}</p>
                        </div>;
                    },1000)
                    that.content =<div className="live-luckdraw-student-img">
                        <img src={Bg1} alt=""/>
                        <p className="live-luckdraw-student-londing">{TkGlobal.language.languageData.broadcast.luckdrawLond} {that.state.liveLuckdrawLonding}</p>
                    </div>;
                    // if(pubmsgData.fromID !== users.id){
                        that.setState({
                            // isMyStart: false,
                            liveLuckdrawStart:true,
                            liveLuckdrawEnd:false
                        })
                    // }
                    TkGlobal.isStartLuckdraw = true;
                }else if(data.data.state === 0){
                    let tempData = data.data.winners.winners;
                    let arr = [];
                    for(let i = 0; i < tempData.length; i++){
                        if(users.id === tempData[i].buddyid){
                            // that.isMe = true;
                            // Log.debug('我中奖了',that.isMe);
                            arr.push(<div key={i} className="live-luckdraw-winnerList-item isme">{tempData[i].buddyname}</div>)
                        }else{
                            arr.push(<div key={i} className="live-luckdraw-winnerList-item">{tempData[i].buddyname}</div>)
                        }
                    }
                    that.content =<div className="live-luckdraw-student-img">
                        <img src={Bg2} alt="" />
                        <div className="live-luckdraw-winnersListBox">
                            <p className="live-luckdraw-winnersListTitle">{TkGlobal.language.languageData.broadcast.winners}</p>
                            <div className="live-luckdraw-winnersList">
                                {arr}
                            </div>
                        </div>
                    </div>;

                    // if(pubmsgData.fromID !== users.id){
                        that.setState({
                            // isMyStart: false,
                            liveLuckdrawStart:true,
                            liveLuckdrawEnd:false
                        })
                    // }
                    TkGlobal.isStartLuckdraw = false;
                }
            }else if (data.name === "ClassBegin"){
                //Log.debug('ClassBegin',data)
            }
        }
    }


//关闭
    closeLiveBase(){
        let that = this;
        // that.isMe = false;
        that.setState({
            // isMyStart:true,
            liveLuckdrawStart:false,
            liveLuckdrawEnd:false
        });
        that.clearTimeInterval();
    }
    //清除定时器
    clearTimeInterval(){
        let that = this;
        if(that.timeInterval){
            clearInterval(that.timeInterval)
        }
    }


    //抽奖中
    changeLiveLuckdrawLonding(){
        let that = this;
        let num = that.liveLuckdrawSpanNum;
        let spanArr = [];
        for(let i=0;i<num;i++){
            spanArr.push('·')
        }
        that.setState({
            liveLuckdrawLonding : spanArr
        })
    }


    render(){
        let that = this;
        let show = that.state.liveLuckdrawStart||that.state.liveLuckdrawEnd;
        let titleName = that.state.liveLuckdrawStart?TkGlobal.language.languageData.broadcast.luckdraw:that.state.liveLuckdrawEnd?TkGlobal.language.languageData.broadcast.listOfWinners:"";
        let mySelf = ServiceRoom.getTkRoom().getMySelf();
        let roleAudit = mySelf.role === TkConstant.role.roleAudit? true:false;
        // let roleAudit = !that.state.isMyStart?true:false;

        const {connectDragSource,isDragging,percentLeft,percentTop,id,isDrag} = this.props;
        TkUtils.getPagingToolLT(this,percentLeft,percentTop,id,isDrag);
        let {pagingToolLeft,pagingToolTop} = this.state[id];
        return connectDragSource(
            <div className="live-luckdraw-student" id={id} style={{display:roleAudit && show?"block":"none",position:"absolute",left:pagingToolLeft+"rem",top:pagingToolTop+"rem"}}>
                {this.content}
                <div className="live-luckdraw-student-canclebox">
                    <button className="live-luckdraw-student-cancle" onClick={that.closeLiveBase.bind(that)} ></button>
                </div>

            </div>
        )
    }
}

export default DragSource('talkDrag', specSource, collect)(LiveLuckdrawStudentSmart);