/**
 * 右侧内容-直播抽奖组件
 * @module responderStudentToolComponent
 * @description   抽奖组件
 * @author xiaguodong
 * @date 2017/11/21
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

class LiveList extends React.Component {
    constructor(props){
        super(props);
        this.state={

        };
        this.listernerBackupid =  new Date().getTime()+'_'+Math.random();
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this;
        //eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPubmsg , that.handlerRoomPubmsg.bind(that), that.listernerBackupid);
        //eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that), that.listernerBackupid); //roomDelmsg事件
    };
    handlerRoomPubmsg(recvEventData){
        const that = this;
        /*let pubmsgData = recvEventData.message;
        let users =ServiceRoom.getTkRoom().getMySelf();
        switch (pubmsgData.name) {
            case "qiangDaQi":
                if(TkConstant.hasRole.roleStudent && users.publishstate>0){

                }
                break;
        }*/
    };
    handlerRoomDelmsg(recvEventData){
        const that = this;
        /*let pubmsgData = recvEventData.message;
        switch (pubmsgData.name) {
            case "ClassBegin":
                break;
        }*/
    };

    _loadHistoryLiveLuckdraw(){
        let that = this;
        let tempWinners = that.props.liveLuckDrawWinners;
        let ulList = [];
        let ulComponent = undefined;
        //Log.error("_loadHistoryLiveLuckdraw ===",tempWinners)
        for(let i=0;i<tempWinners.length;i++){
            ulComponent = <ul key={i}>
                <li>
                    <span>{TkGlobal.language.languageData.broadcast.winner + ":" + tempWinners[i].winners[0].name}</span>
                </li>
                <li className="live-base-option">
                    <span>{TkGlobal.language.languageData.broadcast.initiator + ":" +  tempWinners[i].sponsor.name}</span>
                    <span>{TkGlobal.language.languageData.broadcast.initiatorTime + ":" +  tempWinners[i].timer}</span>
                </li>
            </ul>
            ulList.push(ulComponent);
        }
        return {ulList:ulList}
    }



    render(){
        let that = this;
        let {ulList}= that._loadHistoryLiveLuckdraw();
        return (
            <div className="live-list" style={{display:""}}>
                {ulList}
            </div>
        )
    }
}

export default LiveList;