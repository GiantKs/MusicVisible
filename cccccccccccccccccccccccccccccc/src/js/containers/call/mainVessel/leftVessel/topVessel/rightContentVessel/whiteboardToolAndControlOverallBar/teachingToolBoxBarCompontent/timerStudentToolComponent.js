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
import ServiceSignalling from 'ServiceSignalling';

class TimerStudentToolSmart extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			hoursDiv: "",
			secondsDiv: "",
			number: "",
			timeDescArray: [],
			triangleStyles: "",
			numContentBorder: "",
			timerTeachToolWrapDisplay: "none",
			studentInit: false,
			startAndStop: false,
			restarting: false,
			startAndStopImg: "none",
			servicerTimes: '',
			ado:"none"
		}
		this.stop = null;
		this.listernerBackupid = new Date().getTime() + '_' + Math.random();
	};
	componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
		const that = this;
		eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPubmsg, that.handlerRoomPubmsg.bind(that), that.listernerBackupid); //roomPubmsg事件
		eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDelmsg, that.handlerRoomDelmsg.bind(that), that.listernerBackupid); //roomDelmsg事件
		eventObjectDefine.CoreController.addEventListener("initAppPermissions", that.handlerInitAppPermissions.bind(that), that.listernerBackupid); //initAppPermissions：白板可画权限更新
		eventObjectDefine.CoreController.addEventListener("receive-msglist-timer", that.handlerMsglistTimerShow.bind(that), that.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPlaybackClearAllFromPlaybackController,that.handlerRoomPlaybackClearAll.bind(that) , that.listernerBackupid); //roomPlaybackClearAll 事件：回放清除所有信令
	};
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        const that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid);
    };
	handlerRoomPubmsg(recvEventData) {
		const that = this;
		let pubmsgData = recvEventData.message;
		that.state.servicerTimes = TkGlobal.serviceTime
		that.setState({
			servicerTimes: that.state.servicerTimes
		})

		switch(pubmsgData.name) {
			case "timer":
					if(TkConstant.hasRole.roleStudent){
						that.handleTimerShow(pubmsgData);
					}
					break;
			
		}
	};
	handlerRoomDelmsg(recvEventData) {
		const that = this;
		let pubmsgData = recvEventData.message;
		switch(pubmsgData.name) {
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
				
			case "ClassBegin":
					that.state.timerTeachToolWrapDisplay="none";
					that.setState({timerTeachToolWrapDisplay:that.state.timerTeachToolWrapDisplay})
					break;

		}
	};
	handlerMsglistTimerShow(recvEventData) {
		const that = this;
		let message = recvEventData.message.timerShowArr[0];
		if(TkConstant.hasRole.roleStudent) {
			that.handleTimerShow(message);
		}

	}
	handleTimerShow(pubmsgData) {
		if(pubmsgData.data.isShow){
			return false;
		}
		let that = this;
		let serviceTimeData = TkGlobal.serviceTime / 1000 - pubmsgData.ts;
		that.state.timerTeachToolWrapDisplay = "block";
		that.state.timeDescArray = pubmsgData.data.sutdentTimerArry;
		that.setState({
			timeDescArray: that.state.timeDescArray,
			timerTeachToolWrapDisplay: that.state.timerTeachToolWrapDisplay
		});
		let timeArrAdd = that.state.timeDescArray[0] * 600 + that.state.timeDescArray[1] * 60 + that.state.timeDescArray[2] * 10 + that.state.timeDescArray[3] * 1;
		let timesValue = timeArrAdd - serviceTimeData;
		if(pubmsgData.data.isStatus) {
			clearInterval(that.stop);
			that.playAudioToAudiooutput('ring_audio_student' , false)
			that.state.numContentBorder = 'black';
			that.state.startAndStopImg = "none";
			that.setState({
				startAndStopImg: that.state.startAndStopImg,
				numContentBorder: that.state.numContentBorder
			})
			that.stop = setInterval(that.timeReduce.bind(that), 1000);
			if(timesValue > 0) {
				if(timesValue>timeArrAdd){
					timesValue=timeArrAdd;
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
				that.state.startAndStopImg = "block";
				that.setState({
					timeDescArray: that.state.timeDescArray,
					numContentBorder:that.state.numContentBorder,
					startAndStopImg: that.state.startAndStopImg,
				});
			}
		} else {
			that.state.timeDescArray = pubmsgData.data.sutdentTimerArry;
			that.setState({
				timeDescArray: that.state.timeDescArray
			});
			that.state.startAndStopImg = "block";
			that.state.numContentBorder = 'black';
			that.setState({
				startAndStopImg: that.state.startAndStopImg,
				numContentBorder: that.state.numContentBorder
			})
			clearInterval(that.stop);
			that.playAudioToAudiooutput('ring_audio_student' , false)
		}
	}
	handlerInitAppPermissions() {
		this.state.studentInit = CoreController.handler.getAppPermissions('studentInit');
		this.setState({
			studentInit: this.state.studentInit
		});
		if(this.state.studentInit == false) {
			this.state.triangleStyles = "hidden";
			this.state.againStuBtnStyle = "none";
			this.state.startStuBtnStyle = "none";
			this.state.startAndStopImg = "none";
			this.setState({
				triangleStyle: this.state.triangleStyles,
				againStuBtnStyle: this.state.againStuBtnStyle,
				startStuBtnStyle: this.state.startStuBtnStyle,
				startAndStopImg: this.state.startAndStopImg,
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
            timeDescArray: [],
            triangleStyles: "",
            numContentBorder: "",
            timerTeachToolWrapDisplay: "none",
            studentInit: false,
            startAndStop: false,
            restarting: false,
            startAndStopImg: "none",
            servicerTimes: ''
        });
        this.stop = null;
    };

	/*内部方法*/
	_loadTimeDescArrays(desc) {
		let beforeArrays = [];
		let afterArrays = [];
		desc.forEach((value, index) => {
			let a = <div  className="timer-teachTool-num-divs" key={index}>
                <div className="timer-teachTool-triangle-tops" style={{visibility:this.state.triangleStyles}} ></div>
                <div className="timer-teachTool-num-contents" style={{color:this.state.numContentBorder}}>
                    {value}
                </div>
                <div className="timer-teachTool-triangle-downs" style={{visibility:this.state.triangleStyles}} ></div>
            </div>;
			if(index > 1) {
				afterArrays.push(a);
			} else {
				beforeArrays.push(a);
			}

		});
		return {
			afterArrays: afterArrays,
			beforeArrays: beforeArrays
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
			clearInterval(that.stop);
			that.playAudioToAudiooutput('ring_audio_student' , true)
		}
		if(that.state.timeDescArray[0] == 0 && that.state.timeDescArray[1] == 0 && that.state.timeDescArray[2] == 0 && that.state.timeDescArray[3] == 0) {
			that.state.timeDescArray = [0, 0, 0, 0];
			that.playAudioToAudiooutput('ring_audio_student' , true)
			that.state.numContentBorder = 'red';
			clearInterval(that.stop);
		}

		that.setState({
			timeDescArray: that.state.timeDescArray,
			numContentBorder: that.state.numContentBorder
		})

	};
	    /*播放音乐*/
    playAudioToAudiooutput(audioId = 'ring_audio_student', play = true){
        let $audio = $("#"+audioId) ;
        if($audio && $audio.length>0){
            if(play){
                L.Utils.mediaPlay( $audio[0]);
            }else{
                L.Utils.mediaPause( $audio[0]);
            }
        }
    };
	render() {
		let {
			timeDescArray
		} = this.state;
		let {
			afterArrays,
			beforeArrays
		} = this._loadTimeDescArrays(timeDescArray);
		return(

			<div className="timer-teachTool-wraps" style={{display:this.state.timerTeachToolWrapDisplay}} ref='timerTeachToolWrap'>
                    <div  className="timer-teachTool-headers" >
                        <span></span>
                        <span>{TkGlobal.language.languageData.timers.timerSetInterval.text}</span>
                        <span className="timer-teachTool-closeSpans"></span>
                    </div>
                    {beforeArrays}
                    <div className="timer-teachTool-colons">
                        <div></div>
                        <div></div>
                    </div>
                    {afterArrays}
                    <div className="stop-btn-Imgs"  style={{display:this.state.startAndStopImg}}></div>
					<audio id="ring_audio_student" src="music/ring.mp3" className="audio-play"></audio>
                </div>

		)
	};
}
export default TimerStudentToolSmart;