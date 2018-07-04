/**
 * 右侧内容-教学工具箱 Smart组件
 * @module responderStudentToolComponent
 * @description   抢答器组件
 * @author liujianhang
 * @date 2017/10/30
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
import { DragSource } from 'react-dnd';

const specSource = {
    beginDrag(props, monitor, component) {
        const { id, percentLeft,percentTop } = props;
        return { id, percentLeft,percentTop };
    },
    canDrag(props, monitor) {
        return true;
    },
};

function collect(connect, monitor) {
    return {
        connectDragPreview: connect.dragPreview(),
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
        isCanDrag:monitor.canDrag(),
        getItem:monitor.getItem(),
    };
}

class ResponderStudentToolSmart extends React.Component {
	constructor(props){
		super(props);
		this.state={
			responderStudentIsShow:"none",
			timesRun:3,
			intervals:"",
			timeOutIntervals:"",
			studentText:"",
			userName:null,
			isClick:false,
			userSort:{},
			userArry:[],
			isHasTransition:true,
            studentResponderDrag:{
                pagingToolLeft:4.4,
                pagingToolTop:0,
            },
		};
		this.temporaryStyle = {
            percentLeft:null,
            percentTop:null
		};
		this.listernerBackupid =  new Date().getTime()+'_'+Math.random();
	};
	componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
		const that = this;
        eventObjectDefine.Window.addEventListener( TkConstant.EVENTTYPE.WindowEvent.onResize , this.handlerOnResize.bind(this) , this.listernerBackupid );
        eventObjectDefine.CoreController.addEventListener( 'resizeHandler' , this.handlerOnResize.bind(this) , this.listernerBackupid );
        eventObjectDefine.Document.addEventListener(TkConstant.EVENTTYPE.DocumentEvent.onFullscreenchange , that.handlerOnFullscreenchange.bind(that)   , that.listernerBackupid); //document.onFullscreenchange事件
        eventObjectDefine.CoreController.addEventListener( "receive-msglist-qiangDaQi" , that.handlerMsglistQiangDaQi.bind(that), that.listernerBackupid);
		eventObjectDefine.CoreController.addEventListener( "receive-msglist-QiangDaZhe" , that.handlerMsglistQiangDaZhe.bind(that), that.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPubmsg , that.handlerRoomPubmsg.bind(that), that.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that), that.listernerBackupid); //roomDelmsg事件
        eventObjectDefine.CoreController.addEventListener('changeMainContentVesselSmartSize' , that.changeMainContentVesselSmartSize.bind(that)  , that.listernerBackupid) ; //改变视频框占底部的ul的高度的事件

    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        const that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid);
        eventObjectDefine.Window.removeBackupListerner(this.listernerBackupid);
        eventObjectDefine.Document.removeBackupListerner(that.listernerBackupid );
    };
    /*添加全屏监测处理函数*/
    handlerOnFullscreenchange(){
        if(TK.SDKTYPE !== 'mobile' && (!TkUtils.tool.isFullScreenStatus() || (TkUtils.tool.getFullscreenElement().id && TkUtils.tool.getFullscreenElement().id == "lc-full-vessel"))){
            this.anewCountPosition();
        }
    };
    changeMainContentVesselSmartSize() {
        this.anewCountPosition();
    }
    handlerOnResize(){
        this.anewCountPosition();
    };
    /*重新计算位置*/
    anewCountPosition() {
        let that = this;
        let {percentLeft,percentTop,id} = this.props;
        TkUtils.getPagingToolLT(that,percentLeft,percentTop,id);
        this.setState({[id]:this.state[id]});
    }
    handlerRoomPubmsg(recvEventData){
        const that = this;
        let pubmsgData = recvEventData.message;
        let users =ServiceRoom.getTkRoom().getMySelf();
        switch (pubmsgData.name) {
            case "qiangDaQi":
                let {id} = this.props;
				if(TkConstant.hasRole.roleStudent && users.publishstate>0){
					that._teacherRecevedServiceQiangDaQiData(pubmsgData);
				}
            	break;
			case "QiangDaZhe":
				if(TkConstant.hasRole.roleStudent){
					that._teacherRecevedServiceQiangDaZheData(pubmsgData);
				}
            	break;
            case 'ResponderDrag'://抢答器的拖拽
                that.temporaryStyle.percentLeft = pubmsgData.data.percentLeft;
                that.temporaryStyle.percentTop = pubmsgData.data.percentTop;
                break;
        }
    };
    handlerRoomDelmsg(recvEventData){
        const that = this;
        let pubmsgData = recvEventData.message;
        switch (pubmsgData.name) {
            case "ClassBegin":
                that.state.responderStudentIsShow = "none";
				that.setState({responderStudentIsShow:that.state.responderStudentIsShow})
                break;
            case "qiangDaQi":
            	if (pubmsgData.data.isShow === false) {
                    let {id} = that.props;
                    let {percentLeft,percentTop} = TkUtils.RemChangeToPercentage(4.4,0,id);
                    eventObjectDefine.CoreController.dispatchEvent({
                        type: 'changeDragEleTranstion',
                        message: {data: {id, percentLeft, percentTop},isSendSignalling:true},
                    });
				}
            	that.state.responderStudentIsShow = "none";
            	that.state.isHasTransition = false;
            	that.state.isClick = false;
            	that.state.timesRun = 3;
            	that.state.userArry=[];
            	that.state.userSort={};
            	that.state.studentText = that.state.timesRun;
				that.setState({
					isHasTransition:that.state.isHasTransition,
					userArry:that.state.userArry,
					userSort:that.state.userSort,
					responderStudentIsShow:that.state.responderStudentIsShow,
					isClick:that.state.isClick,
					timesRun:that.state.timesRun,
					studentText:that.state.studentText
				});
            	break;
        }
    };
	handlerMsglistQiangDaQi(recvEventData){
     	const that = this;
     	let users =ServiceRoom.getTkRoom().getMySelf();
    	for(let message of recvEventData.message.qiangDaQiArr){
    		 if(TkConstant.hasRole.roleStudent && users.publishstate>0){
            	that._teacherRecevedServiceQiangDaQiData(message);
            }
    	}
    };
    handlerMsglistQiangDaZhe(recvEventData){
    	const that = this;
    	for(let message of recvEventData.message.QiangDaZheArr){
    		 if(TkConstant.hasRole.roleStudent){
            	that._teacherRecevedServiceQiangDaZheData(message);
            }
    	}
    };
    _teacherRecevedServiceQiangDaQiData(pubmsgData){
        const that = this;
        let {id} = this.props;
        let serviceTimeData = TkGlobal.serviceTime / 1000 - pubmsgData.ts;
        if (pubmsgData.data.begin) {
            that.state.responderStudentIsShow = "block";
            if (serviceTimeData >= 8) {
                let percentLeft,percentTop;
                if (that.temporaryStyle.percentLeft === null) {
                    percentLeft = TkUtils.RemChangeToPercentage(4.4,0,id).percentLeft;
                    percentTop = TkUtils.RemChangeToPercentage(4.4,0,id).percentTop;
                }else {
                    percentLeft = that.temporaryStyle.percentLeft;
                    percentTop = that.temporaryStyle.percentTop;
                }
                eventObjectDefine.CoreController.dispatchEvent({
                    type: 'changeDragEleTranstion',
                    message: {data: {id, percentLeft, percentTop},isSendSignalling:false},
                });
                that.state.studentText = TkGlobal.language.languageData.responder.noContest.text;
                that.setState({
                    studentText: that.state.studentText,
                    responderLeft: that.state.responderLeft,
                });
            } else {

                that.state.intervals = setInterval(function () {
                    that.state.timesRun -= 1;
                    if (that.state.timesRun == 0) {
                        let percentLeft = 0.2;
                        let percentTop = 0.2;
                        eventObjectDefine.CoreController.dispatchEvent({
                            type: 'changeDragEleTranstion',
                            message: {data: {id, percentLeft, percentTop},isSendSignalling:false},
                        });
                    }
                    if (that.state.timesRun == 1) {
                        let percentLeft = 0.4;
                        let percentTop = 0.6;
                        eventObjectDefine.CoreController.dispatchEvent({
                            type: 'changeDragEleTranstion',
                            message: {data: {id, percentLeft, percentTop},isSendSignalling:false},
                        });
                    }
                    if (that.state.timesRun == 2) {
                        let percentLeft = 0.7;
                        let percentTop = 0.2;
                        eventObjectDefine.CoreController.dispatchEvent({
                            type: 'changeDragEleTranstion',
                            message: {data: {id, percentLeft, percentTop},isSendSignalling:false},
                        });
                    }
                    that.state.studentText = that.state.timesRun;
                    that.setState({
                        [id]: that.state[id],
                        responderLeft: that.state.responderLeft,
                        timesRun: that.state.timesRun,
                        studentText: that.state.studentText
                    });

                    if (that.state.timesRun <= 0) {
                        clearInterval(that.state.intervals);
                        that.state.studentText = TkGlobal.language.languageData.responder.answer.text;
                        that.setState({
                            responderLeft: that.state.responderLeft,
                            studentText: that.state.studentText
                        });
                        if (that.state.isClick == false) {
                            that.state.timeOutIntervals = setTimeout(function () {
                                that.state.isHasTransition = true;
                                that.state.studentText = TkGlobal.language.languageData.responder.noContest.text;
                                let percentLeft,percentTop;
                                if (that.temporaryStyle.percentLeft === null) {
                                    percentLeft = TkUtils.RemChangeToPercentage(4.4,0,id).percentLeft;
                                    percentTop = TkUtils.RemChangeToPercentage(4.4,0,id).percentTop;
                                }else {
                                    percentLeft = that.temporaryStyle.percentLeft;
                                    percentTop = that.temporaryStyle.percentTop;
                                }
                                eventObjectDefine.CoreController.dispatchEvent({
                                    type: 'changeDragEleTranstion',
                                    message: {data: {id, percentLeft, percentTop},isSendSignalling:false},
                                });
                                that.setState({
                                    isHasTransition: that.state.isHasTransition,
                                    timeOutIntervals: that.state.timeOutIntervals,
                                    studentText: that.state.studentText,
                                });
                            }, 4500)
                        }
                    }
                }, 1000);
            }
            that.setState({responderStudentIsShow: that.state.responderStudentIsShow, intervals: that.state.intervals,})
        } else {
            if (pubmsgData.data.isShow) {
                that.state.timesRun = 3;
                that.state.isHasTransition = false;
                that.state.responderStudentIsShow = "none";
                that.state.studentText = 3;
                that.setState({
                    isHasTransition: that.state.isHasTransition,
                    timesRun: that.state.timesRun,
                    responderStudentIsShow: that.state.responderStudentIsShow,
                    studentText: that.state.studentText
                })
            }
        }
    };
    _teacherRecevedServiceQiangDaZheData(pubmsgData){
    	const that = this;
    	let {id} = that.props;
		if(pubmsgData.data.isClick){
        	that.state.userSort[pubmsgData.fromID]={};
        	that.state.userSort[pubmsgData.fromID][pubmsgData.seq]=pubmsgData.data.userAdmin;
        	that.setState({userSort:that.state.userSort});
        	that.state.userArry=[];
        	for(let item in that.state.userSort){
        		for(let i in that.state.userSort[item]){
        			that.state.userArry.push(i);
        			that.state.userArry= that.state.userArry.sort()
        			that.setState({userArry:that.state.userArry});
        			 if(that.state.userSort[item][that.state.userArry[0]]!=undefined){
        			 	that.state.studentText = that.state.userSort[item][that.state.userArry[0]];
        			 	that.setState({studentText:that.state.studentText,firstUser:that.state.firstUser});
        			 }
        		}
        	}
        	clearInterval(that.state.intervals);
			clearTimeout(that.state.timeOutIntervals);

            let percentLeft,percentTop;
            if (that.temporaryStyle.percentLeft === null) {
                percentLeft = TkUtils.RemChangeToPercentage(4.4,0,id).percentLeft;
                percentTop = TkUtils.RemChangeToPercentage(4.4,0,id).percentTop;
            }else {
                percentLeft = that.temporaryStyle.percentLeft;
                percentTop = that.temporaryStyle.percentTop;
            }
            eventObjectDefine.CoreController.dispatchEvent({
                type: 'changeDragEleTranstion',
                message: {data: {id, percentLeft, percentTop},isSendSignalling:false},
            });
			that.state.isHasTransition = true;
			that.setState({
				isHasTransition:that.state.isHasTransition,
				studentText:that.state.studentText,
			});
        }
    };
    /*抢答*/
    studentResponder(){
        let users = ServiceRoom.getTkRoom().getMySelf();
        if (users.publishstate > 0 && TkConstant.hasRole.roleStudent && this.state.studentText == TkGlobal.language.languageData.responder.answer.text && this.state.isClick == false) {
            this.state.userAdmin = users.nickname;
            this.setState({userAdmin: this.state.userAdmin})
            this.state.isClick = true;
            this.setState({isClick: this.state.isClick});
            let userAdmin = this.state.userAdmin;
            let isClick = this.state.isClick
            let data = {
                userAdmin: userAdmin,
                isClick: isClick
            };
            let isDelMsg = false;
            ServiceSignalling.sendSignallingQiangDaZhe(isDelMsg, data);
        }
    };
	render(){
		let that = this;
        const {connectDragSource,isDragging,isCanDrag,percentLeft,percentTop,id,isDrag} = this.props;
		TkUtils.getPagingToolLT(that,percentLeft,percentTop,id);
        let {pagingToolLeft,pagingToolTop} = that.state[id];
        if (isDragging) {
            let newpptLayer = document.getElementById("ppt_not_click_newppt");
            let h5DocumentLayer = document.getElementById("h5Document-layer");
            if (newpptLayer) {
                newpptLayer.style.display = 'block';
            }
            if (h5DocumentLayer) {
                h5DocumentLayer.style.display = 'block';
            }
        }else {
            let newpptLayer = document.getElementById("ppt_not_click_newppt");
            let h5DocumentLayer = document.getElementById("h5Document-layer");
            if (newpptLayer) {
                newpptLayer.style.display = 'none';
            }
            if (h5DocumentLayer) {
                h5DocumentLayer.style.display = 'none';
            }
        }
		let studentResponderDivStyle = {
            display:this.state.responderStudentIsShow,
            left:pagingToolLeft+"rem",
            top:pagingToolTop+"rem",
			// transform:this.state.translateMove,
            transitionProperty:this.state.isHasTransition?'left,top':undefined,
            transitionDuration: this.state.isHasTransition?'0.5s':undefined,
		};
		return connectDragSource(
			<div id={id} className="responder-circle-student" style={studentResponderDivStyle}>
				<div className="responder-black-circle-student"></div>
				<div className={"responder-begin-circle-student"+" "+(typeof(this.state.studentText)=="number"?'disabled':'')} onClick={this.studentResponder.bind(this)}>
					{this.state.studentText}
				</div>
			</div>
		)
	}
}

export default DragSource('talkDrag', specSource, collect)(ResponderStudentToolSmart);