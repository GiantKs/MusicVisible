/**
 * 右侧头部-上下课以及举手等按钮功能Smart模块
 * @module ClassbeginAndRaiseSmart
 * @description   承载上下课以及举手等按钮功能Smart模块
 * @author QiuShao
 * @date 2017/08/08
 */
'use strict';
import React from 'react';
import TkGlobal from 'TkGlobal';
import TkConstant from 'TkConstant';
import eventObjectDefine from 'eventObjectDefine';
import ServiceSignalling from 'ServiceSignalling';
import ServiceTooltip from 'ServiceTooltip';
import ServiceRoom from 'ServiceRoom';
import CoreController from 'CoreController';
import WebAjaxInterface from 'WebAjaxInterface';
import TkUtils from 'TkUtils';


class ClassbeginAndRaiseSmart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            classbeginInfo:{
                show:false ,
                disabled:false ,
                classbegin:false
            } ,
            raiseInfo:{
                show:false ,
                disabled:false ,
                raisehand:false
            }
        };
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
    };

    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this ;
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPubmsg , that.handlerRoomPubmsg.bind(that) , that.listernerBackupid  ) ;
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that) , that.listernerBackupid  ) ;
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomUserpropertyChanged , that.handlerRoomUserpropertyChanged.bind(that) , that.listernerBackupid  ) ;
        eventObjectDefine.CoreController.addEventListener(  'receive-msglist-ClassBegin' , that.handlerReceiveMsglistClassBegin.bind(that) , that.listernerBackupid  ) ;
        eventObjectDefine.CoreController.addEventListener(  'initAppPermissions' , that.handlerInitAppPermissions.bind(that) , that.listernerBackupid  ) ;
        eventObjectDefine.CoreController.addEventListener("updateAppPermissions_classBtnIsDisableOfRemind" ,that.handlerUpdateAppPermissions_classBtnIsDisableOfRemind.bind(that)  ,  that.listernerBackupid); //h5点击动作权限的更新

    };

    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        const that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(  that.listernerBackupid  ) ;
    };

    handlerRoomPubmsg(recvEventData){
        const that = this ;
        let message = recvEventData.message ;
        if(message.name === "ClassBegin" ){
            that._updateClassbeginInfo();
        }
    };
    handlerRoomDelmsg(recvEventData){
        const that = this ;
        let message = recvEventData.message ;
        if(message.name === "ClassBegin" ){
            that._updateClassbeginInfo();
        }
    };
    handlerRoomUserpropertyChanged(recvEventData){
        const that = this ;
        let message = recvEventData.message ;
        let user = recvEventData.user ;
        if(user.id === ServiceRoom.getTkRoom().getMySelf().id){
            for( let key of Object.keys(message) ){
                if(key === 'raisehand' || key === 'publishstate' || key === 'disableaudio'){
                    that._updateRaiseInfo();
                }
            }
        }
    };
    handlerReceiveMsglistClassBegin(recvEventData){
        const that = this ;
        let message =  recvEventData.message ;
        if(recvEventData.source === 'room-msglist' && recvEventData.message){
            that._updateClassbeginInfo();
        }
    };
    handlerInitAppPermissions(recvEventData){
        const that = this ;
        that._updateClassbeginInfo();
        that._updateRaiseInfo();
    };
    classbeginOnClick(){
        if(!TkGlobal.classBegin){
            if( !CoreController.handler.getAppPermissions('startClassBegin') ){return ;}
            WebAjaxInterface.roomStart(); //发送上课信令
        }else{
            ServiceTooltip.showSelectTooltip({
                title: {
                    text: TkGlobal.language.languageData.alertWin.messageWin.title.leaveRoom.text,
                },
                content: {
                    type: 'db-radio',
                    text: TkGlobal.language.languageData.alertWin.ok.showConfirm.ok,
                },
                data: {}
            }, function(hasConfirm, data){
                if(hasConfirm && data.checked === 1){  //下课处理流程
                    if( !CoreController.handler.getAppPermissions('endClassBegin') ){return ;}
                    if(TkGlobal.classBegin){
                        WebAjaxInterface.roomOver(); //发送下课信令
                        ServiceRoom.getTkRoom().stopBroadcast();
                        ServiceRoom.getTkRoom().uninitBroadcast();
                        ServiceSignalling.delmsgTo__AllAll();//清除所有信令消息
                        //ServiceRoom.getTkRoom().leaveroom();

                    }
                    ServiceRoom.getTkRoom().closeWindow();

                } else if(hasConfirm && data.checked === 2){ //离开教室处理流程
                    let dataToServer = {
                        msg: TkGlobal.language.languageData.classroomNotice.text,
                        type: 0,
                        id:  ServiceRoom.getTkRoom().getMySelf().id,
                        time: TkUtils.getSendTime(),
                    }
                    dataToServer.sender = TkGlobal.isBroadcast ? {
                        id: ServiceRoom.getTkRoom().getMySelf().id,
                        role: ServiceRoom.getTkRoom().getMySelf().role,
                        nickname: ServiceRoom.getTkRoom().getMySelf().nickname,
                    } : undefined;
                    ServiceSignalling.sendTextMessage(dataToServer);//sendMessage 发送消息
                    ServiceRoom.getLocalStream().muteVideo(false);
                    ServiceRoom.getLocalStream().muteAudio(false);
                    ServiceRoom.getTkRoom().closeWindow();

                };
            });
            // ServiceTooltip.showConfirm(TkGlobal.language.languageData.alertWin.messageWin.winMessageText.classBeginEnd.text , function (answer) {
            //     if(answer){
            //         if( !CoreController.handler.getAppPermissions('endClassBegin') ){return ;}
            //         WebAjaxInterface.roomOver(); //发送下课信令
            //     }
            // });
        }
    };
    raiseOnClick(){
        if( !CoreController.handler.getAppPermissions('raisehand') ){return ;}
        ServiceSignalling.setParticipantPropertyToAll(ServiceRoom.getTkRoom().getMySelf().id , {raisehand:!ServiceRoom.getTkRoom().getMySelf().raisehand} );
    };
    handlerUpdateAppPermissions_classBtnIsDisableOfRemind() {
        this._updateClassbeginInfo();
    };
    /*更新classbegin的描述信息*/
    _updateClassbeginInfo(){
        const that = this ;

        let classbeginInfo = {
            show: CoreController.handler.getAppPermissions('forcedEndClassBegin') ||  ( !TkGlobal.classBegin?CoreController.handler.getAppPermissions('startClassBegin') : CoreController.handler.getAppPermissions('endClassBegin') ),
            disabled:( CoreController.handler.getAppPermissions('forcedEndClassBegin') &&   !TkGlobal.classBegin ) ||  ( CoreController.handler.getAppPermissions('classBtnIsDisableOfRemind') ? true : false ),
            classbegin:TkGlobal.classBegin
        } ;
        Object.assign(that.state.classbeginInfo , classbeginInfo) ;
        that.setState({classbeginInfo:that.state.classbeginInfo}) ;
        let { raiseInfo } = that.state ;
        let {classbeginAndRaiseShowButtonCallback} = that.props ;
        if(classbeginAndRaiseShowButtonCallback && typeof classbeginAndRaiseShowButtonCallback === 'function'){
            classbeginAndRaiseShowButtonCallback( (classbeginInfo.show || raiseInfo.show)  );
        }
        /*if (TkGlobal.classBegin == true && TkGlobal.remindServiceTime - TkConstant.joinRoomInfo.endtime * 1000 < 0) {
            TkAppPermissions.setAppPermissions('classBtnIsDisableOfRemind' , true);

        }*/
    };
    /*更新classbegin的描述信息*/
    _updateRaiseInfo(){
        const that = this ;
        let localUser = ServiceRoom.getTkRoom().getMySelf() ;
        let  raiseInfo = {
            show:CoreController.handler.getAppPermissions('raisehand')  ,
            disabled: CoreController.handler.getAppPermissions('raisehandDisable') || !localUser.hasaudio ||  !( !localUser.disableaudio &&  (localUser.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE ||  localUser.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY || localUser.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_MUTEALL  ) ) , //音频设备禁用或者音频已发布则不能点举手
            raisehand:ServiceRoom.getTkRoom().getMySelf().raisehand
        };
        Object.assign(that.state.raiseInfo , raiseInfo) ;
        that.setState({raiseInfo:that.state.raiseInfo}) ;
        let { classbeginInfo  } = that.state ;
        let {classbeginAndRaiseShowButtonCallback} = that.props ;
        if(classbeginAndRaiseShowButtonCallback && typeof classbeginAndRaiseShowButtonCallback === 'function'){
            classbeginAndRaiseShowButtonCallback( (classbeginInfo.show || raiseInfo.show)  );
        }
    };
    render() {
        let that = this;
        let { classbeginInfo  , raiseInfo } = that.state ;
        return (
            <div className="h-btn-wrap add-fl add-fr" id="room_controller_container"  style={{display:!(classbeginInfo.show || raiseInfo.show)?'none':''}} >
                {classbeginInfo.show? <button
                    className={"add-fl "+( classbeginInfo.disabled ?'disabled':'') + ( (TkGlobal.classBegin  || CoreController.handler.getAppPermissions('forcedEndClassBegin') )? ' h-room-end':' h-room-start' ) }
                    disabled={classbeginInfo.disabled || undefined}  id="room_classBegin"
                    onClick={!classbeginInfo.disabled ? that.classbeginOnClick.bind(that): undefined } >
                    { (!classbeginInfo.classbegin && !CoreController.handler.getAppPermissions('forcedEndClassBegin')  ?TkGlobal.language.languageData.header.system.attend.text : TkGlobal.language.languageData.header.system.finish.text) }
                    </button> : undefined }
                {raiseInfo.show?  <button className={"h-room-start h-room-raise add-fl  "+(raiseInfo.disabled?'disabled':'')}   disabled={raiseInfo.disabled || undefined}  id="room_Raise"   onClick={!raiseInfo.disabled ? that.raiseOnClick.bind(that): undefined }  >{!raiseInfo.raisehand?TkGlobal.language.languageData.header.system.Raise.yesText:TkGlobal.language.languageData.header.system.Raise.noText}</button>: undefined }
            </div>
        )
    };
};
export default  ClassbeginAndRaiseSmart;

