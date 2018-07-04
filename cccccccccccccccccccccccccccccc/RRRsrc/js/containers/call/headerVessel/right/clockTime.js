/**
 * 右侧头部-时钟计时Smart模块
 * @module ClockTimeSmart
 * @description   承载时钟计时Smart模块
 * @author QiuShao
 * @date 2017/08/08
 */
'use strict';
import React from 'react';
import TkGlobal from 'TkGlobal';
import TkConstant from 'TkConstant';
import eventObjectDefine from 'eventObjectDefine';
import ServiceSignalling from 'ServiceSignalling';
import ServiceRoom from 'ServiceRoom';
import TkUtils from 'TkUtils';
import CoreController from 'CoreController';


class ClockTimeSmart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clockTimeToHide:false ,
            clock:{
                hh:'00' ,
                mm:'00' ,
                ss:'00'
            },
            clockColor:"no-start",
        };
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
    };

    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this ;
        that._stopTime();
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPubmsg , that.handlerRoomPubmsg.bind(that) , that.listernerBackupid  ) ;
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that) , that.listernerBackupid  ) ;
        eventObjectDefine.CoreController.addEventListener(  'receive-msglist-ClassBegin' , that.handlerReceiveMsglistClassBegin.bind(that) , that.listernerBackupid  ) ;
        eventObjectDefine.CoreController.addEventListener('backTimecolorOfRemind', that.handlerTimerColor.bind(that) , that.listernerBackupid  ) ;
    };

    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        const that = this ;
        that._stopTime();
        eventObjectDefine.CoreController.removeBackupListerner(  that.listernerBackupid  ) ;
    };

    handlerRoomPubmsg(recvEventData){
        const that = this ;
        let message = recvEventData.message ;
        if(message.name === "ClassBegin" ){
            this.setState({clockTimeToHide:false});
            that._startTime();
        }
    };
    handlerRoomDelmsg(recvEventData){
        const that = this ;
        let message = recvEventData.message ;
        if(message.name === "ClassBegin" ){
            that._stopTime();
            if(TkConstant.joinRoomInfo.isClassOverNotLeave){
                this.setState({clockTimeToHide:true});
            }
            if(CoreController.handler.getAppPermissions('endClassbeginRevertToStartupLayout')) { //是否拥有下课重置界面权限
                that._resetClockTime();
            }
        }
    };
    handlerReceiveMsglistClassBegin(recvEventData){
        if(recvEventData.source === 'room-msglist' && recvEventData.message){
            this.setState({clockTimeToHide:false});
            this._startTime();
        }
    };

    _startTime(){
        const that = this ;
        clearInterval( that.timer );
        that.timer =  setInterval( () => {
            if(TkGlobal.classBeginTime && TkGlobal.serviceTime ) {
                TkGlobal.serviceTime += 1000 ;
                that._clockTimeDifference();
            }else if(!TkGlobal.serviceTime){
                ServiceSignalling.sendSignallingFromUpdateTime( ServiceRoom.getTkRoom().getMySelf().id );
            }
        },1000);
    };

    _stopTime(){
        const that = this ;
        clearInterval( that.timer );
        that.timer = null ;
    };
    /*重置时间*/
    _resetClockTime(){
        this.setState({
            clock:{
                hh:'00' ,
                mm:'00' ,
                ss:'00'
            },
            clockColor:"no-start",
        });
    };
    _clockTimeDifference(){
        const that = this ;
        let clock =  TkUtils.getTimeDifferenceToFormat(  TkGlobal.classBeginTime   ,  TkGlobal.serviceTime);
        if(clock){
            that.state.clock = clock ;
            that.setState({clock:that.state.clock});
        }
    };
    handlerTimerColor(colorData) {
        this.setState({clockColor:colorData.message.data.timeColor || "no-start"});
    }

    render() {
        let that = this;
        return (
            <div className={"add-block add-fl h-time-wrap add-fr "+that.state.clockColor} id="time_container" style={{display:this.state.clockTimeToHide?'none':undefined}}>
                {that.state.clock.hh}<span className="space">:</span>{that.state.clock.mm}<span className="space">:</span>{that.state.clock.ss}
            </div>
        )
    };
};
export default  ClockTimeSmart;

