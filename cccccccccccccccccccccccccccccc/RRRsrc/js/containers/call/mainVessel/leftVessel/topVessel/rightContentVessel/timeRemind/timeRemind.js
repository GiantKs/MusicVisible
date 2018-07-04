/**
 * 右侧内容-时间提示Smart模块
 * @module TimeRemindSmart
 * @description   右侧内容-时间提示Smart模块
 * @author QiuShao
 * @date 2017/08/29
 */
'use strict';
import React from 'react';
import TkGlobal from 'TkGlobal';
import TkConstant from 'TkConstant' ;
import ServiceSignalling from 'ServiceSignalling';
import ServiceRoom from 'ServiceRoom';
import WebAjaxInterface from 'WebAjaxInterface';
import eventObjectDefine from 'eventObjectDefine';
import TkAppPermissions from 'TkAppPermissions';
import CoreController from 'CoreController';

class TimeRemindSmart extends React.Component{
    constructor(props){
        super(props);
        this.start = {
            status_lt_minute_1:false ,
            status_gt_minute_1:false ,
            status_gt_minute_0:false ,
        };
        this.end = {
            status_gt_minute_0:false ,
            status_gt_minute_3:false ,
            status_lt_minute_1:false ,
            status_end_second_10:false ,
            status_end:false ,
            status_end_minute_0:false,
        };
        this.timeContainer=null;
        this.state = {
            isShowTimeRemind:false,//提示是否显示
            ableStartClass:false,
            ableEndClass:false,
            isShowRemindBtn:true,//提示的确定按钮是否显示
            remindType:null,
            timeDifference:null,
            timeOfTen:10,
            timeOfFive:5,
        };
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this;
        that._handlerRoomConnected();
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        const that = this ;
        eventObjectDefine.CoreController.removeBackupListerner( this.listernerBackupid);
        clearInterval(that.notClassBeginTimer);
        clearInterval(that.systemTimeRemind);
        clearInterval(that.timerCloseRoom);
        that.timerCloseRoom = null ;
        that.systemTimeRemind = null ;
        that.notClassBeginTimer = null ;
    };
    _handlerRoomConnected(){
        const that = this ;
        let {roomConnected} = that.props ;
        if(roomConnected){
            if( TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant ){
                ServiceSignalling.sendSignallingFromUpdateTime();//发送更新时间的信令
                let startTime = TkConstant.joinRoomInfo.starttime * 1000;//课堂开始时间
                let endTime = TkConstant.joinRoomInfo.endtime * 1000;//课堂结束时间
                let intervalNumber = 0;
                that.listeningNotClassBeginTime(startTime , endTime  , 1000 , intervalNumber);
            }
        }
    };
    listeningNotClassBeginTime(startTime , endTime  , intervalTime , intervalNumber){ //老师时间提示监听器
        let that = this;
        clearInterval(that.notClassBeginTimer);
        that.notClassBeginTimer =  setInterval(function(){
            if( TkGlobal.remindServiceTime ){
                TkGlobal.remindServiceTime += 1000 ;
                let startTimeDifference =  TkGlobal.remindServiceTime  - startTime ;
                let endTimeDifference =  TkGlobal.remindServiceTime  - endTime ;
                if( startTimeDifference < 0 ){
                    if(TkGlobal.classBegin === false){ //没有上课
                        TkAppPermissions.setAppPermissions('classBtnIsDisableOfRemind' , true);
                        if( startTimeDifference > - 60*1000 ){ //离上课时间还有一分钟
                            if( that.start.status_lt_minute_1 === false ){
                                that.start.status_lt_minute_1 = true ;
                                that.setState({
                                    isShowTimeRemind:true,
                                    ableStartClass:true,
                                    ableEndClass:false,
                                    isShowRemindBtn:true,
                                    remindType:"distanceOneMinute",//离上课时间还有一分钟
                                    timeDifference:startTimeDifference,
                                });
                                TkAppPermissions.setAppPermissions('classBtnIsDisableOfRemind' , false);
                                that.fiveIntervalTime();//倒计时5秒
                            }
                            if (ServiceRoom.getTkRoom().getMySelf().hasaudio == false) {
                                TkAppPermissions.setAppPermissions('classBtnIsDisableOfRemind' , true);
                            }else{
                                TkAppPermissions.setAppPermissions('classBtnIsDisableOfRemind' , false);
                            }
                        }
                    }else {
                        if (!CoreController.handler.getAppPermissions('classBtnIsDisableOfRemind')) {
                            TkAppPermissions.setAppPermissions('classBtnIsDisableOfRemind' , true);
                        }
                    }
                }else{
                    if(TkGlobal.classBegin === false){ //没有上课
                        if( endTimeDifference > 0){//超过课堂时间并且没有上课
                            if( that.end.status_gt_minute_0 === false ){
                                that.end.end_gt_minute_0 = true ;
                                that.setState({
                                    isShowTimeRemind:true,
                                    ableStartClass:false,
                                    ableEndClass:false,
                                    isShowRemindBtn:true,
                                    remindType:"noClassInTime",
                                    timeDifference:startTimeDifference,
                                });
                                TkAppPermissions.setAppPermissions('classBtnIsDisableOfRemind' , true);
                                let isLeaveRoom = true;
                                that.fiveIntervalTime(isLeaveRoom);

                                clearInterval(that.notClassBeginTimer);
                                that.notClassBeginTimer = null ;
                                return  ;
                            }
                            return  ;
                        }

                        if( startTimeDifference >  60*1000 ){ //超过上课时间一分钟后提醒
                            if( that.start.status_gt_minute_1 === false){
                                that.start.status_gt_minute_1 = true ;
                                that.setState({
                                    isShowTimeRemind:true,
                                    ableStartClass:true,
                                    ableEndClass:false,
                                    isShowRemindBtn:true,
                                });
                                that.fiveIntervalTime();
                                TkAppPermissions.setAppPermissions('classBtnIsDisableOfRemind' , false);
                            }
                            if (ServiceRoom.getTkRoom().getMySelf().hasaudio == false) {
                                TkAppPermissions.setAppPermissions('classBtnIsDisableOfRemind' , true);
                            }else{
                                TkAppPermissions.setAppPermissions('classBtnIsDisableOfRemind' , false);
                            }

                            if(that.state.isShowTimeRemind == true){
                                that.setState({
                                    remindType:"exceedOneMinuteOfClass",
                                    timeDifference:startTimeDifference,
                                });//超过上课时间一分钟
                            }
                        }else{
                            if(that.start.status_gt_minute_0 === false ){
                                that.start.status_gt_minute_0 = true ;
                                that.setState({
                                    isShowTimeRemind:false,
                                    ableStartClass:true,
                                    ableEndClass:false,
                                });
                                TkAppPermissions.setAppPermissions('classBtnIsDisableOfRemind' , false);
                            }
                            if (ServiceRoom.getTkRoom().getMySelf().hasaudio == false) {
                                TkAppPermissions.setAppPermissions('classBtnIsDisableOfRemind' , true);
                            }else{
                                TkAppPermissions.setAppPermissions('classBtnIsDisableOfRemind' , false);
                            }
                        }

                    }else{ //已经上课了
                        if( endTimeDifference < 0){ //没到下课时间
                            if(TkGlobal.classBeginTime && TkGlobal.remindServiceTime ) {
                                //$scope.remind.classBeginTime.func.classBeginInterval();
                            }
                            if (endTimeDifference < - 60*1000 && !CoreController.handler.getAppPermissions('classBtnIsDisableOfRemind')) {
                                TkAppPermissions.setAppPermissions('classBtnIsDisableOfRemind' , true);
                            }
                            if( endTimeDifference > - 60*1000 ){ //离下课还有1分钟
                                if( that.end.status_lt_minute_1 === false ){
                                    that.end.status_lt_minute_1 = true ;
                                    that.setState({
                                        isShowTimeRemind:true,
                                        ableStartClass:false,
                                        ableEndClass:true,
                                        isShowRemindBtn:true,
                                    });
                                    TkAppPermissions.setAppPermissions('classBtnIsDisableOfRemind' , false);
                                    that.fiveIntervalTime();
                                    if (that.timeContainer !== "ready-end") {
                                        that.timeContainer = "ready-end";
                                        eventObjectDefine.CoreController.dispatchEvent({
                                            type:'backTimecolorOfRemind',
                                            message:{
                                                source:'timeRemind' ,
                                                data:{
                                                    timeColor:that.timeContainer
                                                }
                                            }
                                        });
                                    }
                                    //$("#time_container").removeClass("ready-end no-start ready-start start immediately-end end").addClass("ready-end") ;
                                }
                                if(that.state.isShowTimeRemind == true){
                                    that.setState({
                                        remindType:"oneBeforeClass",
                                        timeDifference:endTimeDifference,
                                    });//离下课还有1分钟
                                }
                            }
                        }else{ //超过下课时间
                            let countDownTime = 5*60*1000 - endTimeDifference ;
                            if( countDownTime >= 0){ //超过下课时间五分钟内
                                if(TkGlobal.classBeginTime && TkGlobal.remindServiceTime ) {
                                    //$scope.remind.classBeginTime.func.classBeginInterval();
                                }
                                if( countDownTime <= 10 * 1000 ){ //离最大下课超时还有10秒
                                    if( that.end.status_end_second_10 === false ){
                                        that.end.status_end_second_10 = true ;
                                        that.setState({
                                            isShowTimeRemind:true,
                                            ableStartClass:false,
                                            ableEndClass:true,
                                        });
                                        TkAppPermissions.setAppPermissions('classBtnIsDisableOfRemind' , false);
                                        if (that.timeContainer !== "end") {
                                            that.timeContainer = "end";
                                            eventObjectDefine.CoreController.dispatchEvent({
                                                type:'backTimecolorOfRemind',
                                                message:{
                                                    source:'timeRemind' ,
                                                    data:{
                                                        timeColor:that.timeContainer
                                                    }
                                                }
                                            });
                                        }
                                        //$("#time_container").removeClass("ready-end no-start ready-start start immediately-end end").addClass("end") ;
                                    }
                                    /*定时关闭课堂，10秒后*/
                                    that.setState({
                                        isShowRemindBtn:false,
                                        remindType:"closeClassAfterTen",//10秒后关闭课堂
                                        timeOfTen:10,
                                    });
                                    clearInterval(that.timerCloseRoom);
                                    that.timerCloseRoom = setInterval(function(){
                                        if(that.state.isShowTimeRemind == true){
                                            that.setState({
                                                isShowRemindBtn:false,
                                                remindType:"closeClassAfterTen",//10秒后关闭课堂
                                                timeOfTen:(--that.state.timeOfTen),
                                            });
                                        }
                                        //wj改7-10:
                                        if(TkGlobal.classBeginTime && TkGlobal.remindServiceTime ) {
                                            TkGlobal.remindServiceTime += 1000 ;
                                            //$scope.remind.classBeginTime.func.classBeginInterval();
                                        }
                                        if(that.state.timeOfTen<1){
                                            WebAjaxInterface.roomOver(); //发送下课信令 //如果课堂到时间了，则下课
                                            that.setState({
                                                isShowTimeRemind:false,
                                                ableStartClass:false,
                                                ableEndClass:true,
                                            });
                                            clearInterval(that.timerCloseRoom);
                                            that.timerCloseRoom = null ;
                                        }
                                    },1000);
                                    clearInterval(that.notClassBeginTimer);
                                    that.notClassBeginTimer = null ;
                                    return ;
                                }else if( endTimeDifference >  3 * 60 * 1000 ){ //超过下课时间3分钟
                                    if( that.end.status_gt_minute_3 === false ){
                                        that.end.status_gt_minute_3 = true ;
                                        that.setState({
                                            isShowTimeRemind:true,
                                            ableStartClass:false,
                                            ableEndClass:true,
                                            isShowRemindBtn:true,
                                        });
                                        TkAppPermissions.setAppPermissions('classBtnIsDisableOfRemind' , false);
                                        that.fiveIntervalTime();
                                        if (that.timeContainer !== "immediately-end") {
                                            that.timeContainer = "immediately-end";
                                            eventObjectDefine.CoreController.dispatchEvent({
                                                type:'backTimecolorOfRemind',
                                                message:{
                                                    source:'timeRemind' ,
                                                    data:{
                                                        timeColor:that.timeContainer
                                                    }
                                                }
                                            });
                                        }
                                        //$("#time_container").removeClass("ready-end no-start ready-start start immediately-end end").addClass("immediately-end") ;
                                    }
                                    if(that.state.isShowTimeRemind == true){
                                        that.setState({
                                            remindType:"exceedThreeMinuteOfClass",
                                            timeDifference:endTimeDifference,
                                        });//超过下课时间3分钟
                                    }
                                }else{
                                    if(that.end.status_end_minute_0 === false ){
                                        that.end.status_end_minute_0 = true ;
                                        that.setState({
                                            isShowTimeRemind:false,
                                            ableStartClass:false,
                                            ableEndClass:true,
                                        });
                                        TkAppPermissions.setAppPermissions('classBtnIsDisableOfRemind' , false);
                                        if (that.timeContainer !== "end") {
                                            that.timeContainer = "end";
                                            eventObjectDefine.CoreController.dispatchEvent({
                                                type:'backTimecolorOfRemind',
                                                message:{
                                                    source:'timeRemind' ,
                                                    data:{
                                                        timeColor:that.timeContainer
                                                    }
                                                }
                                            });
                                        }
                                        //$("#time_container").removeClass("ready-end no-start ready-start start immediately-end end").addClass("end") ;
                                    }
                                }
                            }else{ //已经超过时间五分钟
                                if( that.end.status_end === false ){
                                    that.end.status_end = true ;
                                    that.setState({
                                        isShowTimeRemind:true,
                                        ableStartClass:false,
                                        ableEndClass:false,
                                        isShowRemindBtn:true,
                                        remindType:"exceedFiveMinuteOfClass",
                                    });
                                    TkAppPermissions.setAppPermissions('classBtnIsDisableOfRemind' , true);
                                    that.fiveIntervalTime();

                                    clearInterval(that.notClassBeginTimer);
                                    that.notClassBeginTimer = null ;
                                    return;
                                }
                            }
                        }
                    }
                }
            }else{
                ServiceSignalling.sendSignallingFromUpdateTime(ServiceRoom.getTkRoom().getMySelf().id);//发送更新时间的信令
            }
            intervalNumber++;
            if(intervalNumber >300){
                ServiceSignalling.sendSignallingFromUpdateTime();
                intervalNumber = 0 ;
            }
        },intervalTime);
    };
    fiveIntervalTime(isLeaveRoom) {
        //clearInterval(systemTimeRemind);
        const that = this ;
        clearInterval(that.systemTimeRemind);
        that.systemTimeRemind = setInterval(() => {
            this.state.timeOfFive = this.state.timeOfFive - 1;
            this.setState({timeOfFive:this.state.timeOfFive});
            if (this.state.timeOfFive <= 0) {
                this.setState({
                    isShowTimeRemind:false,
                    timeOfFive:5,
                });
                clearInterval(that.systemTimeRemind);
                that.systemTimeRemind = null ;
                if (isLeaveRoom) {
                    ServiceRoom.getTkRoom().leaveroom(); //超过上课时间并且没有上课，则关闭房间
                }
            }
        } ,1000);
    };
    returnTimeEle(remindType,timeDifference) {
        let htmlStr = "";
        switch (remindType) {
            case "distanceOneMinute"://离上课时间还有一分钟
                htmlStr = <span>{TkGlobal.language.languageData.remind.time.readyStart.one}
                    <time className="time">{Math.ceil( Math.abs(timeDifference)/(1000*60) )}</time>
                    {TkGlobal.language.languageData.remind.time.readyStart.two}</span>;
                break;
            case "noClassInTime"://超过课堂时间并且没有上课
                htmlStr = TkGlobal.language.languageData.remind.time.endNotBegin.one ;
                break;
            case "exceedOneMinuteOfClass"://超过上课时间一分钟后提醒
                htmlStr = <span>{TkGlobal.language.languageData.remind.time.timeoutStart.one}
                    <time className="time">{Math.floor( timeDifference/(1000*60) )}</time>
                    {TkGlobal.language.languageData.remind.time.timeoutStart.two}</span> ;
                break;
            case "oneBeforeClass"://离下课还有1分钟
                htmlStr = <span>{TkGlobal.language.languageData.remind.time.readyEnd.one}
                    <time className="time">{Math.ceil( Math.abs(timeDifference)/(1000*60) )}</time>
                    {TkGlobal.language.languageData.remind.time.readyEnd.two}</span>;
                break;
            case "closeClassAfterTen"://超过下课时间10分钟10秒后关闭课堂
                htmlStr = <span>{TkGlobal.language.languageData.remind.time.timeoutEnd.one}
                    <time>{this.state.timeOfTen}</time>
                    {TkGlobal.language.languageData.remind.time.timeoutEnd.two}</span>;
                break;
            case "exceedThreeMinuteOfClass"://超过下课时间3分钟
                htmlStr = <span>{TkGlobal.language.languageData.remind.time.timeoutReadyEnd.one}
                    <time className="time">{Math.floor(timeDifference/(1000*60) )}</time>
                    {TkGlobal.language.languageData.remind.time.timeoutReadyEnd.two}
                    <time className="time">{(5 - Math.floor(timeDifference/(1000*60) ))}</time>
                    {TkGlobal.language.languageData.remind.time.timeoutReadyEnd.three}</span>;
                break;
            case "exceedFiveMinuteOfClass"://已经超过时间五分钟
                htmlStr = TkGlobal.language.languageData.remind.time.endBegin.one ;
                break;
        }
        return htmlStr;
    }
    remindBtnClick() {
        this.setState({isShowTimeRemind:false});
    }

    render(){
        let that = this ;
        return (
            <div className="sys-time-remind add-position-absolute-top0-right0" style={{display:that.state.isShowTimeRemind? "block":"none"}} > {/*提示信息*/}
                <span className="message" id="remind_msg">{that.returnTimeEle(that.state.remindType,that.state.timeDifference)}</span>
                <button className="know-btn" style={{display:that.state.isShowRemindBtn?"inline-block":"none"}} id="remind_ok_btn" onClick={that.remindBtnClick.bind(that)} ><span className="btn-content" >{TkGlobal.language.languageData.remind.button.remindKnow.text} <span>{that.state.timeOfFive}’</span></span></button>
            </div>
        )
    };
};
export default  TimeRemindSmart;

