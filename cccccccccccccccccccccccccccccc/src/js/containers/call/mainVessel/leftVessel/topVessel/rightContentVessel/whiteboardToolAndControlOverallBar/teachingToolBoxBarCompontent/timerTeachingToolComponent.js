/**
 * 右侧内容-教学工具箱 Smart组件
 * @module timerTeachingToolComponent
 * @description   倒计时组件
 * @author liujianhang
 * @date 2017/09/20
 */
'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import TkGlobal from 'TkGlobal';
import TkConstant from 'TkConstant';
import TkUtils from 'TkUtils';
import eventObjectDefine from 'eventObjectDefine';
import CoreController from 'CoreController';
import ServiceRoom from 'ServiceRoom';
import TimerStudentToolSmart from './timerStudentToolComponent';
import ServiceSignalling from 'ServiceSignalling';
import { DragSource } from 'react-dnd';

const specSource = {
	beginDrag(props, monitor, component) {
		const {id, percentLeft,percentTop} = props;
		return {id, percentLeft,percentTop};
	},
};

function collect(connect, monitor) {
	return {
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging()
	};
}

class TimerTeachingToolSmart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hoursDiv: "",
			secondsDiv: "",
			number: "",
			timeDescArray: [0, 5, 0, 0],
			triangleStyle: "",
			againBtnStyle: "",
			startBtnStyle: "",
			numContentBorder: "",
			timerTeachToolWrapDisplay: "none",
			timerStuStyle: "",
			restarting: false,
			studentInit: false,
			startAndStop: false,
			startAndStopImg: "none",
			isShow:false,
			againUnClickableStyle:"block",
            timerDrag:{
                pagingToolLeft:"",
                pagingToolTop:"",
            },
		};
		this.stop = null;
		this.listernerBackupid = new Date().getTime() + '_' + Math.random();
	};
	componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
		const that = this;
        eventObjectDefine.Window.addEventListener( TkConstant.EVENTTYPE.WindowEvent.onResize , this.handlerOnResize.bind(this) , this.listernerBackupid );
        eventObjectDefine.CoreController.addEventListener( 'handleTurnShow' , that.handleTurnShow.bind(that) , that.listernerBackupid);
		eventObjectDefine.CoreController.addEventListener("initAppPermissions", that.handlerInitAppPermissions.bind(that), that.listernerBackupid); //initAppPermissions：白板可画权限更新
		eventObjectDefine.CoreController.addEventListener("receive-msglist-timer", that.handlerMsglistTimerShow.bind(that), that.listernerBackupid);
		eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPubmsg, that.handlerRoomPubmsg.bind(that), that.listernerBackupid); //roomPubmsg事件
		eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDelmsg, that.handlerRoomDelmsg.bind(that), that.listernerBackupid); //roomDelmsg事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPlaybackClearAllFromPlaybackController,that.handlerRoomPlaybackClearAll.bind(that) , that.listernerBackupid); //roomPlaybackClearAll 事件：回放清除所有信令
        eventObjectDefine.CoreController.addEventListener('changeBottomVesselSmartHeightRem' , that.changeBottomVesselSmartHeightRem.bind(that)  , that.listernerBackupid) ; //改变视频框占底部的ul的高度的事件
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        const that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid);
        eventObjectDefine.Window.removeBackupListerner(this.listernerBackupid);
    };
    changeBottomVesselSmartHeightRem() {
        this.handlerOnResize();
    }
    handlerOnResize(){
        let that = this;
        let {percentLeft,percentTop,id,isDrag} = this.props;
        TkUtils.getPagingToolLT(that,percentLeft,percentTop,id,isDrag);
        this.setState({[id]:this.state[id]});
    };
	handlerRoomPubmsg(recvEventData){
		const that = this;
		let pubmsgData = recvEventData.message;

		switch(pubmsgData.name) {
			case "timer":
			if(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant||TkConstant.hasRole.rolePatrol){
				that.handleTimerShow(pubmsgData);
			}
				break;	
			
		}
	}
	handlerRoomDelmsg(recvEventData){
		const that = this;
		let pubmsgData = recvEventData.message;

		switch(pubmsgData.name) {
			case "ClassBegin":
				
				that.state.timerTeachToolWrapDisplay="none";
				that.setState({timerTeachToolWrapDisplay:that.state.timerTeachToolWrapDisplay})
				break;
			case "timer":
				
					clearInterval(that.stop);
					that.state.startAndStopImg = "none";
					that.state.timeDescArray = [0, 5, 0, 0];
					that.state.timerTeachToolWrapDisplay = "none";
					that.setState({
						timerTeachToolWrapDisplay: that.state.timerTeachToolWrapDisplay,
						startAndStopImg: that.state.startAndStopImg,
						timeDescArray:that.state.timeDescArray
					});
					break;	
		}
	};
	handlerMsglistTimerShow(recvEventData) {
		const that = this;
		let message = recvEventData.message.timerShowArr[0];
		if(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant||TkConstant.hasRole.rolePatrol) {
			that.handleTimerShow(message);
		}

	}
	handleTimerShow(pubmsgData) {
		let that = this;
		let serviceTimeData = TkGlobal.serviceTime / 1000 - pubmsgData.ts;
		that.state.timeDescArray = pubmsgData.data.sutdentTimerArry;
		let timeArrAdd = that.state.timeDescArray[0] * 600 + that.state.timeDescArray[1] * 60 + that.state.timeDescArray[2] * 10 + that.state.timeDescArray[3] * 1;
		let timesValue = timeArrAdd - serviceTimeData;
		if(pubmsgData.data.isShow){
			that.state.startBtnStyle = "block";
			that.state.timerTeachToolWrapDisplay = "block";
			that.state.againBtnStyle="none";
			that.state.numContentBorder = 'black';
			that.state.againUnClickableStyle="block";
			that.state.startAndStopImg = "none";
			that.state.triangleStyle = "visible";
			that.setState({
			timeDescArray: that.state.timeDescArray,
			timerTeachToolWrapDisplay: that.state.timerTeachToolWrapDisplay,
			againUnClickableStyle:that.state.againUnClickableStyle,
			startBtnStyle:that.state.startBtnStyle,
			startAndStopImg:that.state.startAndStopImg
			});
		}else{
			
		if(pubmsgData.data.isStatus) {
			clearInterval(that.stop);
			that.state.againBtnStyle="block";
			that.state.startBtnStyle="none";
			that.state.againUnClickableStyle="none";
			that.state.timerTeachToolWrapDisplay = "block";
			that.state.numContentBorder = 'black';
			that.state.triangleStyle = "hidden";
			that.state.startAndStopImg = "block";
			that.setState({
				startAndStopImg: that.state.startAndStopImg,
				timerTeachToolWrapDisplay: that.state.timerTeachToolWrapDisplay,
				startBtnStyle: that.state.startBtnStyle,
				numContentBorder: that.state.numContentBorder,
				againBtnStyle: that.state.againBtnStyle,
				triangleStyle: that.state.triangleStyle,
				againUnClickableStyle:that.state.againUnClickableStyle
			})
			that.stop = setInterval(that.timeReduce.bind(that), 1000);
			if(timesValue > 0) {
				if(timesValue>timeArrAdd){
					timesValue=timeArrAdd
				}
				let m = (parseInt(timesValue / 60) < 10 ? '0' + parseInt(timesValue / 60) : parseInt(timesValue / 60));
				let n = (parseInt(timesValue % 60) < 10 ? '0' + parseInt(timesValue % 60) : parseInt(timesValue % 60));
				that.state.timeDescArray[0] = parseInt(m / 10); //tkpc2.0.8
				that.state.timeDescArray[1] = parseInt(m % 10); //tkpc2.0.8
				that.state.timeDescArray[2] = parseInt(n / 10);
				that.state.timeDescArray[3] = parseInt(n % 10);
				that.setState({
					timeDescArray: that.state.timeDescArray
				});
			}else{
				clearInterval(that.stop);
				that.state.timeDescArray[0] = 0;
				that.state.timeDescArray[1] = 0;
				that.state.timeDescArray[2] = 0;
				that.state.timeDescArray[3] = 0;
				that.state.numContentBorder = 'red';
				that.setState({
					timeDescArray: that.state.timeDescArray,
					numContentBorder:that.state.numContentBorder
				});
			}	
		} else {
			if(pubmsgData.data.isRestart){
				that.playAudioToAudiooutput('ring_audio' , false)
				that.state.timeDescArray = pubmsgData.data.sutdentTimerArry;
				that.state.againUnClickableStyle="block";
				that.state.timerTeachToolWrapDisplay = "block";
				that.state.startBtnStyle="block";
				that.state.againBtnStyle="none";
				that.state.triangleStyle = "visible";
				that.state.startAndStop= false;
				that.state.numContentBorder = 'black';
				that.state.startAndStopImg = "none";
				that.setState({
					timeDescArray: that.state.timeDescArray,
					timerTeachToolWrapDisplay: that.state.timerTeachToolWrapDisplay,
					numContentBorder: that.state.numContentBorder,
					startAndStopImg: that.state.startAndStopImg,
					startBtnStyle: that.state.startBtnStyle,
					againBtnStyle: that.state.againBtnStyle,
					triangleStyle: that.state.triangleStyle,
					startAndStop: that.state.startAndStop,
					againUnClickableStyle:that.state.againUnClickableStyle
				});
				}else{
				that.state.timeDescArray = pubmsgData.data.sutdentTimerArry;
				that.playAudioToAudiooutput('ring_audio' , false)
				that.state.startBtnStyle="block";
				that.state.againBtnStyle="block";
				that.state.againUnClickableStyle="none";
				that.state.timerTeachToolWrapDisplay = "block";
				that.state.triangleStyle = "hidden";
				that.state.startAndStop= false;
				that.state.numContentBorder = 'black';
				that.state.startAndStopImg = "none";
				that.setState({
					timeDescArray: that.state.timeDescArray,
					timerTeachToolWrapDisplay: that.state.timerTeachToolWrapDisplay,
					numContentBorder: that.state.numContentBorder,
					startAndStopImg: that.state.startAndStopImg,
					startBtnStyle: that.state.startBtnStyle,
					againBtnStyle: that.state.againBtnStyle,
					triangleStyle: that.state.triangleStyle,
					startAndStop: that.state.startAndStop,
					againUnClickableStyle:that.state.againUnClickableStyle
				});
			clearInterval(that.stop);
			}
		}
		}
	}
	handleTurnShow(data){
		const that = this;
		if(data.className=="timer-implement-bg")
		{	
			if(that.state.timerTeachToolWrapDisplay=="none"){
				that.playAudioToAudiooutput('ring_audio' , false)
				that.state.startBtnStyle="block";
				that.state.againBtnStyle="none";
				that.state.startAndStopImg = "none";
				that.state.triangleStyle = "visible";
				that.state.timerTeachToolWrapDisplay="block";
				that.state.againUnClickableStyle="block";
				that.state.startAndStop= false;
				that.state.numContentBorder = 'black';
				clearInterval(that.stop);
				that.state.timeDescArray = [0, 5, 0, 0];
				that.setState({timerTeachToolWrapDisplay:that.state.timerTeachToolWrapDisplay,startAndStop:that.state.startAndStop,
					startBtnStyle:that.state.startBtnStyle,againBtnStyle:that.state.againBtnStyle,triangleStyle:that.state.triangleStyle,
					numContentBorder:that.state.numContentBorder,timeDescArray:that.state.timeDescArray,againUnClickableStyle:that.state.againUnClickableStyle,
					startAndStopImg:that.state.startAndStopImg})
		}
			}
	}
	/*权限*/
	handlerInitAppPermissions() {
		this.state.studentInit = CoreController.handler.getAppPermissions('studentInit');
		this.setState({
			studentInit: this.state.studentInit
		});
		if(this.state.studentInit) {
			this.state.triangleStyle = "visible";
			this.state.againBtnStyle = "none";
			this.state.againUnClickableStyle="block";
			this.state.startBtnStyle = "block";
			this.state.startAndStopImg = "none";
			this.setState({
				triangleStyle: this.state.triangleStyles,
				againStuBtnStyle: this.state.againStuBtnStyle,
				startStuBtnStyle: this.state.startStuBtnStyle,
				startAndStopImg: this.state.startAndStopImg,
				againUnClickableStyle:this.state.againUnClickableStyle
			})
		}

	};

    handlerRoomPlaybackClearAll(){
        if(!TkGlobal.playback){L.Logger.error('No playback environment, no execution event[roomPlaybackClearAll] handler ') ;return ;};
        const that = this ;
        that.setState({
            hoursDiv: "",
            secondsDiv: "",
            number: "",
            timeDescArray: [0, 5, 0, 0],
            triangleStyle: "",
            againBtnStyle: "",
            startBtnStyle: "",
            numContentBorder: "",
            timerTeachToolWrapDisplay: "none",
            timerStuStyle: "",
            restarting: false,
            studentInit: false,
            startAndStop: false,
            startAndStopImg: "none",
            isShow:false,
            againUnClickableStyle:"block",
        });
        this.stop = null;
    };

	/*内部方法*/
	_loadTimeDescArray(desc) {
		let beforeArray = [];
		let afterArray = [];
		desc.forEach((value, index) => {
			let a = <div  className="timer-teachTool-num-div" key={index}>
                <div className="timer-teachTool-triangle-top" style={{visibility:this.state.triangleStyle}} onClick={this.AddHandel.bind(this,index)}></div>
                <div className="timer-teachTool-num-content" style={{color:this.state.numContentBorder}}>
                    {value}
                </div>
                <div className="timer-teachTool-triangle-down" style={{visibility:this.state.triangleStyle}} onClick={this.ReduceHandel.bind(this,index)}></div>
            </div>;
			if(index > 1) {
				afterArray.push(a);
			} else {
				beforeArray.push(a);
			}

		});
		return {
			afterArray: afterArray,
			beforeArray: beforeArray
		}
	};
	/*手动增加*/
	AddHandel(index, e) {
		if(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant){
		if(index === 0) {
			e.target.nextSibling.textContent++;
			this.state.timeDescArray[0] = e.target.nextSibling.textContent;
			if(e.target.nextSibling.textContent > 9) {
				e.target.nextSibling.textContent = 0;
				this.state.timeDescArray[0] = e.target.nextSibling.textContent;

			}
		}
		if(index === 1) {
			e.target.nextSibling.textContent++;
			this.state.timeDescArray[1] = e.target.nextSibling.textContent;
			if(e.target.nextSibling.textContent > 9) {
				e.target.nextSibling.textContent = 0;
				this.state.timeDescArray[1] = e.target.nextSibling.textContent;
			}
		}
		if(index === 2) {
			e.target.nextSibling.textContent++;
			this.state.timeDescArray[2] = e.target.nextSibling.textContent;
			if(e.target.nextSibling.textContent > 5) {
				e.target.nextSibling.textContent = 0;
				this.state.timeDescArray[2] = e.target.nextSibling.textContent;
			}
		}
		if(index === 3) {
			e.target.nextSibling.textContent++;
			this.state.timeDescArray[3] = e.target.nextSibling.textContent;
			if(e.target.nextSibling.textContent > 9) {
				e.target.nextSibling.textContent = 0;
				this.state.timeDescArray[3] = e.target.nextSibling.textContent = 0;
			}
		}
		this.setState({
			timeDescArray: this.state.timeDescArray
		})
		}
	};
	/*手动减少*/
	ReduceHandel(index, e) {
		if(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant){
		if(index === 0) {
			e.target.previousSibling.textContent--;
			this.state.timeDescArray[0] = e.target.previousSibling.textContent;
			if(e.target.previousSibling.textContent < 0) {
				e.target.previousSibling.textContent = 9;
				this.state.timeDescArray[0] = e.target.previousSibling.textContent;
			}
		}
		if(index === 1) {
			e.target.previousSibling.textContent--;
			this.state.timeDescArray[1] = e.target.previousSibling.textContent;
			if(e.target.previousSibling.textContent < 0) {
				e.target.previousSibling.textContent = 9;
				this.state.timeDescArray[1] = e.target.previousSibling.textContent;
			}
		}
		if(index === 2) {
			e.target.previousSibling.textContent--;
			this.state.timeDescArray[2] = e.target.previousSibling.textContent;
			if(e.target.previousSibling.textContent < 0) {
				e.target.previousSibling.textContent = 5;
				this.state.timeDescArray[2] = e.target.previousSibling.textContent;
			}
		}
		if(index === 3) {
			e.target.previousSibling.textContent--;
			this.state.timeDescArray[3] = e.target.previousSibling.textContent;
			if(e.target.previousSibling.textContent < 0) {
				e.target.previousSibling.textContent = 9;
				this.state.timeDescArray[3] = e.target.previousSibling.textContent;
			}
		}
		this.setState({
			timeDescArray: this.state.timeDescArray
		})
		}
	};
	/*开始*/
	startBtnHandel(e) {
		if(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant){
		clearInterval(this.stop);
		this.playAudioToAudiooutput('ring_audio' , false)
		this.state.numContentBorder = 'black';
		this.state.startAndStop = true;
		this.state.restarting = false;
		this.setState({
			startAndStop: this.state.startAndStop,
			numContentBorder: this.state.numContentBorder,
			restarting:this.state.restarting
		});
			this.state.startBtnStyle="none";
			this.state.startAndStopImg="block";
			this.state.triangleStyle = "hidden";
			this.state.againBtnStyle = "block";
			this.state.againUnClickableStyle="none";
			this.setState({startAndStopImg:this.state.startAndStopImg,startBtnStyle:this.state.startBtnStyle,againBtnStyle: this.state.againBtnStyle,triangleStyle:this.state.triangleStyle,againUnClickableStyle:this.state.againUnClickableStyle})
			if(this.state.timeDescArray[0] == 0 && this.state.timeDescArray[1] == 0 && this.state.timeDescArray[2] == 0 && this.state.timeDescArray[3] == 0) {
				this.state.timeDescArray = [0, 0, 0, 0];
				this.state.numContentBorder = 'red';
				clearInterval(this.stop);
			}
			this.stop = setInterval(this.timeReduce.bind(this), 1000);
			let stopBtn = this.state.startAndStop;
			let dataTimerArry = this.state.timeDescArray;
			let iconShow=this.state.isShow;
			let isRestart = this.state.restarting
			let data = {
				isStatus : stopBtn,
				sutdentTimerArry: dataTimerArry,
				isShow:iconShow,
				isRestart:isRestart
			};
			ServiceSignalling.sendSignallingTimerToStudent(data);
		}
	};
	/*暂停*/
	stopBtnHandel(){
		if(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant){
			this.playAudioToAudiooutput('ring_audio' , false)
			this.state.startAndStop=false ;
			this.state.restarting = false;
			this.state.startAndStopImg="none";
			this.state.triangleStyle = "hidden";
			this.state.startBtnStyle="block";
			this.state.againUnClickableStyle="none";
			this.state.againBtnStyle = "block";
			this.setState({startAndStopImg:this.state.startAndStopImg,startBtnStyle:this.state.startBtnStyle,againBtnStyle: this.state.againBtnStyle,startAndStop:this.state.startAndStop,triangleStyle:this.state.triangleStyle,againUnClickableStyle:this.state.againUnClickableStyle})
			clearInterval(this.stop);
			let stopBtn = this.state.startAndStop;
			let iconShow=this.state.isShow;
			let dataTimerArry = this.state.timeDescArray;
			let isRestart = this.state.restarting;
			let data = {
				isStatus: stopBtn,
				sutdentTimerArry: dataTimerArry,
				isShow:iconShow,
				isRestart:isRestart
			};
			ServiceSignalling.sendSignallingTimerToStudent(data);
		}
	};
	firstArr() {
		this.handlersetAnswerMessage(recvEventData);
		this.state.optionUl = this.state.initArr.map((item, index) => {
			return <li className="answer-teach-lis" key={item.id} onClick={this.changeColor.bind(this,index)} >{item.name}</li>
		});
		this.setState({
			optionUl: this.state.optionUl
		})
	}
	/*重新开始*/
	againBtnHandel(e) {
		if(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant){
			this.playAudioToAudiooutput('ring_audio' , false);
		this.state.numContentBorder = 'black';
		this.setState({
			numContentBorder: this.state.numContentBorder
		});
		this.state.restarting = true;
		this.state.startAndStop=false ;
		this.state.triangleStyle = "visible";
		this.state.againBtnStyle = "none";
		this.state.startAndStopImg="none";
		this.state.startBtnStyle = "block";
		this.state.againUnClickableStyle="block";
		clearInterval(this.stop);
		this.state.numContentBorder = 'black';
		this.state.timeDescArray = [0, 5, 0, 0];
		this.setState({
			triangleStyle: this.state.triangleStyle,
			againBtnStyle: this.state.againBtnStyle,
			startBtnStyle: this.state.startBtnStyle,
			timeDescArray: this.state.timeDescArray,
			startAndStopImg:this.state.startAndStopImg,
			startAndStop: this.state.startAndStop,
			restarting: this.state.restarting,
			numContentBorder: this.state.numContentBorder,
			againUnClickableStyle:this.state.againUnClickableStyle
		});
		let stopBtn = this.state.startAndStop;
		let dataTimerArry = this.state.timeDescArray;
		let iconShow=this.state.isShow;
		let isRestart = this.state.restarting;
		let data = {
				isStatus: stopBtn,
				sutdentTimerArry: dataTimerArry,
				isShow:iconShow,
				isRestart:isRestart
		};
		ServiceSignalling.sendSignallingTimerToStudent(data);
		}
	};
	/*倒计时*/
	timeReduce() {
		let that = this;
		that.state.timeDescArray[3]--;

		if(that.state.timeDescArray[3] < 0) {
			that.state.timeDescArray[3] = 9;
			that.state.timeDescArray[2]--;
		}
		if(that.state.timeDescArray[2] < 0) {
			that.state.timeDescArray[2] = 5;
			that.state.timeDescArray[1]--
		}
		if(that.state.timeDescArray[1] < 0) {
			that.state.timeDescArray[1] = 9;
			that.state.timeDescArray[0]--
		}if(that.state.timeDescArray[0]<0){
			that.state.timeDescArray = [0, 0, 0, 0];
			that.state.numContentBorder = 'red';
			that.state.startBtnStyle = "none";
			clearInterval(that.stop);
			that.playAudioToAudiooutput('ring_audio' , true)
		}
		if(that.state.timeDescArray[0] == 0 && that.state.timeDescArray[1] == 0 && that.state.timeDescArray[2] == 0 && that.state.timeDescArray[3] == 0) {
			that.playAudioToAudiooutput('ring_audio' , true);
			that.state.timeDescArray = [0, 0, 0, 0];
			that.state.numContentBorder = 'red';
			that.state.startBtnStyle = "none";
			clearInterval(that.stop);
		}

		that.setState({
			timeDescArray: that.state.timeDescArray,
			startBtnStyle: that.state.startBtnStyle,
			numContentBorder: that.state.numContentBorder
		})

	};
	/*关闭*/
	timerCloseHandel() {
		if(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant){
		this.playAudioToAudiooutput('ring_audio' , false);
		this.state.timeDescArray = [0, 5, 0, 0];
		this.state.triangleStyle = "visible";
		this.state.startAndStop= false;
		this.state.againBtnStyle="none";
		this.state.startAndStopImg="none";
		this.state.numContentBorder = 'black';
		this.state.againUnClickableStyle="block";
		clearInterval(this.stop);
		this.setState({
			timeDescArray: this.state.timeDescArray,
			triangleStyle:this.state.triangleStyle,
			startAndStop:this.state.startAndStop,
			numContentBorder:this.state.numContentBorder,
			startAndStopImg:this.state.startAndStopImg,
			againBtnStyle:this.state.againBtnStyle,
			againUnClickableStyle:this.state.againUnClickableStyle,
		});
		this.state.timerTeachToolWrapDisplay = "none";
		this.setState({
			timerTeachToolWrapDisplay: this.state.timerTeachToolWrapDisplay,
		});
		let stopBtn = this.state.startAndStop;
		let iconShow=this.state.isShow;
			let dataTimerArry = this.state.timeDescArray;
			let data = {
				isStatus: stopBtn,
				sutdentTimerArry: dataTimerArry,
				isShow:iconShow
			};
		let isDelMsg = true;
		ServiceSignalling.sendSignallingTimerToStudent(data, isDelMsg);
        //初始化拖拽元素的位置
		let {id} = this.props;
		const defalutFontSize = window.innerWidth / TkConstant.STANDARDSIZE ;
		let dragEle = document.getElementById(id);//拖拽的元素
		let dragEleW = dragEle.clientWidth;
		let content = document.getElementById('content');//白板拖拽区域
		let contentW = content.clientWidth;
		let percentLeft = ((8.5 - 0.5)*defalutFontSize)/(contentW - dragEleW);
		let percentTop = 0;
		eventObjectDefine.CoreController.dispatchEvent({type:'initDragEleTranstion', message:{data:{id,percentLeft,percentTop}},});
	}
	};
	    /*播放音乐*/
    playAudioToAudiooutput(audioId = 'ring_audio', play = true){
        let $audio = $("#"+audioId) ;
        if($audio && $audio.length>0){
            if(play){
                L.Utils.mediaPlay($audio[0]);
            }else{
                L.Utils.mediaPause($audio[0]);
            }
        }
    };
	render() {
		let that = this;
		let {timeDescArray} = this.state;
        const {connectDragSource,isDragging,percentLeft,percentTop,id,isDrag} = that.props;
		TkUtils.getPagingToolLT(that,percentLeft,percentTop,id,isDrag);
        let {pagingToolLeft,pagingToolTop} = that.state[id];
		if(isDragging) {
			let newpptLayer = document.getElementById("ppt_not_click_newppt");
			let h5DocumentLayer = document.getElementById("h5Document-layer");
			if(newpptLayer) {
				newpptLayer.style.display = 'block';
			}
			if(h5DocumentLayer) {
				h5DocumentLayer.style.display = 'block';
			}
		} else {
			let newpptLayer = document.getElementById("ppt_not_click_newppt");
			let h5DocumentLayer = document.getElementById("h5Document-layer");
			if(newpptLayer) {
				newpptLayer.style.display = 'none';
			}
			if(h5DocumentLayer) {
				h5DocumentLayer.style.display = 'none';
			}
		}
		let {afterArray, beforeArray} = this._loadTimeDescArray(timeDescArray);
        let timerDragStyle = {
            position: 'absolute',
            zIndex: 110,
            display: 'inline-block',
            transition: 'all 0.4s',
            cursor: "move",
            left: (isDrag ? pagingToolLeft : "8.5") + "rem",
            top: (isDrag ? pagingToolTop : "0") + "rem"
        };
		return connectDragSource(
			<div id="timerDrag" style={timerDragStyle}>
                <div className="timer-teachTool-wrap" style={{display:this.state.timerTeachToolWrapDisplay}} ref='timerTeachToolWrap'>
                    <div  className="timer-teachTool-header">
                        <span></span>
                        <span>{TkGlobal.language.languageData.timers.timerSetInterval.text}</span>
                        <span className="timer-teachTool-closeSpan" onClick={this.timerCloseHandel.bind(this)}></span>
                    </div>
                    {beforeArray}
                    <div className="timer-teachTool-colon">
                        <div></div>
                        <div></div>
                    </div>
                    {afterArray}
                    <div className="timer-teachTool-startBtn" ref="timerStartBtn" style={{display:this.state.startBtnStyle}} onClick={this.startBtnHandel.bind(this)} title={TkGlobal.language.languageData.timers.timerBegin.text}></div>
                    <div className="timer-teachTool-stopBtn"  style={{display:this.state.startAndStopImg}} onClick={this.stopBtnHandel.bind(this)} title={TkGlobal.language.languageData.timers.timerStop.text}></div>
                    <div className="timer-teachTool-againBtn" style={{display:this.state.againBtnStyle}} onClick={this.againBtnHandel.bind(this)} title={TkGlobal.language.languageData.timers.again.text}></div>
                	<div className="timer-teachTool-againBtn-unclickable" style={{display:this.state.againUnClickableStyle}} title={TkGlobal.language.languageData.timers.again.text}></div>
                	<audio id="ring_audio" src="music/ring.mp3" className="audio-play"></audio>
                </div>
                <TimerStudentToolSmart />
            </div>
		)
	};
}
export default DragSource('talkDrag', specSource, collect)(TimerTeachingToolSmart);