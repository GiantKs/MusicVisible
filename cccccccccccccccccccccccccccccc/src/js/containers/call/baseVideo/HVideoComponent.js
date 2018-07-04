/**
 * HVideoComponent 组件
 * @module HVideoComponent
 * @description   提供 HVideoComponent组件
 * @author xiagd
 * @date 2017/08/16
 */

'use strict';
import React from 'react';
import TkGlobal from 'TkGlobal';
import TkUtils from 'TkUtils';
import Video from "../../../components/video/video";
import ServiceRoom from 'ServiceRoom';
import ServiceSignalling from 'ServiceSignalling';
import TkConstant from 'TkConstant';
import eventObjectDefine from 'eventObjectDefine';
import WebAjaxInterface from 'WebAjaxInterface';
import CoreController from 'CoreController';
import ServiceTooltip from 'ServiceTooltip';
import { DragSource, DropTarget } from 'react-dnd';

let outUserIDArry = [];//tkpc2.0.8
const specSource = {
	beginDrag(props, monitor, component) {
		const {id, percentLeft, percentTop, isDrag} = props;
		return {id, percentLeft, percentTop, isDrag};
	},
	canDrag(props, monitor) {
		const {id} = props;
		if((TkConstant.hasRole.roleStudent && props.isDrag == false) || TkConstant.hasRole.rolePatrol || !TkGlobal.classBegin || TkGlobal.isVideoStretch ) { //视频没有拽出并且是学生，或者寻课，或者没有上课，或者是视频拉伸，或者已分屏六个人，则不能拖拽//tkpc2.0.8
			return false;
		} else {
			return true;
		}
	},
};

function collect(connect, monitor) {
	return {
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging(),
		isCanDrag: monitor.canDrag(),
        getItem:monitor.getItem(),
	};
}

const specTarget = {
	drop(props, monitor, component) {
		const delta = monitor.getDifferenceFromInitialOffset(); //拖拽的偏移量
		let dragFinishEleCoordinate = monitor.getSourceClientOffset(); //拖拽后鼠标相对body的位置
		const item = monitor.getItem(); //拖拽的元素信息

		let {id} = item;
		const defalutFontSize = window.innerWidth / TkConstant.STANDARDSIZE;
		let dragEle = document.getElementById(id); //拖拽的元素
		let dragEleW = dragEle.clientWidth;
		let dragEleH = dragEle.clientHeight;
		let content = document.getElementById('content'); //白板拖拽区域
		let contentW = content.clientWidth;
		let contentH = content.clientHeight;
		let dragEleLeft = (dragFinishEleCoordinate.x - 0.5 * defalutFontSize) / (contentW - dragEleW);
		let dragEleTop = (dragFinishEleCoordinate.y - 0.49 * defalutFontSize) / (contentH - dragEleH);
		let dragEleStyle = { //相对白板区位置的百分比
			percentTop: dragEleTop,
			percentLeft: dragEleLeft,
			isDrag: true,
		};
		if(id === 'page_wrap' || id === 'lc_tool_container' || id === 'timerDrag' || id === 'dialDrag' || id === 'answerDrag' || id === 'moreBlackboardDrag') {
			eventObjectDefine.CoreController.dispatchEvent({ //自己本地改变拖拽的video位置
				type: 'otherDropTarget',
				message: {data: {id: item.id, style: dragEleStyle}},
			});
		} else {
			eventObjectDefine.CoreController.dispatchEvent({ //自己本地和通知别人改变拖拽的video位置
				type: 'changeOtherVideoStyle',
				message: {data: {style: dragEleStyle, id: id}
				},
			});
		}
	},
	canDrop(props, monitor) { //拖拽元素不能拖出白板区
		const item = monitor.getItem();
		let dragFinishEleCoordinate = monitor.getSourceClientOffset(); //拖拽后鼠标相对body的位置
		let dragEle = document.getElementById(item.id); //拖拽的元素
		let content = document.getElementById('content'); //白板拖拽区域

		const defalutFontSize = window.innerWidth / TkConstant.STANDARDSIZE;
		//获取拖拽的元素宽高：
		let dragEleW = dragEle.clientWidth;
		let dragEleH = dragEle.clientHeight;
		//获取白板区域宽高：
		let contentW = content.clientWidth;
		let contentH = content.clientHeight;
		//功能条宽度：
		let toolContainerW = 0.5 * defalutFontSize;
		//头部高度：
		let headerH = 0.49 * defalutFontSize;
		if(dragFinishEleCoordinate.x < toolContainerW || dragFinishEleCoordinate.x > toolContainerW + contentW - dragEleW || dragFinishEleCoordinate.y < headerH || dragFinishEleCoordinate.y > headerH + contentH - dragEleH) {
			return false;
		} else {
			return true;
		}
	},
};

class HVideoComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			classCss: 'hvideo',
			userid: "",
			//display:'none',
			afterElementArray: [],
			buttonElementArray: [],
			studentElementArray: [],
			userIDArry: [],
			userNickName: '',
			giftnumberState: false,
			raisehand: false,
			buttonsStyle: false,
			otherVideoSize: {},
			networkDelay: 0,
			networkDelayColor: "#41BF33",
			liStyle: {
				oneLiStyle: {},
				twoLiStyle: {},
				threeLiStyle: {},
				fourLiStyle: {},
				fiveLiStyle: {},
				sixLiStyle: {},
			},
			ulHeight: 0,
            backgroundModeFloatIsShow:false,
		};
		this.otherVideoLT = {};
		this.btnIsHideOfDrag = {}; //根据拖拽判断按钮是否隐藏,没有拖拽则为false
		this.mouseDownPosition = {};
		this.stretchDirection = null;
		this.isTriggerOnResize = false;
		this.listernerBackupid = new Date().getTime() + '_' + Math.random();

	};

	componentDidMount() { //真实的DOM被渲染出来后调用
		let that = this;
		let {id, isDrag} = that.props;
		this.initOtherVideoWH();
		that._init();
        that.handleBackgroundModeFloat(id);//处理后台模式浮层
		eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomUserpropertyChanged, that.handlerRoomUserpropertyChanged.bind(that), that.listernerBackupid); //room-userproperty-changed事件-收到参与者属性改变后执行更新
		eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPubmsg, that.handlerRoomPubmsg.bind(that), that.listernerBackupid); //room-pubmsg事件：
		eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomParticipantLeave, that.handlerRoomParticipantLeave.bind(that), that.listernerBackupid); //room-participant_leave事件-收到有参与者离开房间
		eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDelmsg, that.handlerRoomDelmsg.bind(that), that.listernerBackupid);
		eventObjectDefine.CoreController.addEventListener('changeVideoBtnHide', that.changeVideoBtnHide.bind(that), that.listernerBackupid);
		eventObjectDefine.CoreController.addEventListener(id + "_mouseMove", that.videoChangeSize.bind(that), that.listernerBackupid);
		eventObjectDefine.CoreController.addEventListener(id + "_mouseUp", that.videoMouseUp.bind(that), that.listernerBackupid);
		eventObjectDefine.CoreController.addEventListener('handleMyselfNetworkStatus', that.handleMyselfNetworkStatus.bind(that), that.listernerBackupid);
		eventObjectDefine.CoreController.addEventListener('handleInitVideoDrag', that.handleInitVideoDrag.bind(that), that.listernerBackupid);
		eventObjectDefine.CoreController.addEventListener('handleVideoSplitScreen', that.handleVideoSplitScreen.bind(that), that.listernerBackupid);
		eventObjectDefine.CoreController.addEventListener('initVideoSplitScreen', that.initVideoSplitScreen.bind(that), that.listernerBackupid);
		eventObjectDefine.CoreController.addEventListener('changeBottomUlHeightRem', that.changeBottomUlHeightRem.bind(that), that.listernerBackupid);
		//eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that), that.listernerBackupid); //roomDelmsg事件 下课事件 classBegin
		that._receviceStreamCompleted();
		//发送msglist的数据：
		if(TkGlobal.msglist.videoDragArray) { //视频拖拽
			if(TkGlobal.msglist.videoDragArray[0].data.otherVideoStyle[id]) {
				eventObjectDefine.CoreController.dispatchEvent({
					type: 'handleVideoDragListData',
					message: {
						data: {
							videoStyle: TkGlobal.msglist.videoDragArray[0].data.otherVideoStyle[id],
							id: id
						}
					},
				});
			}
		}
		/*视频拉伸*/
		if(TkGlobal.msglist.videoChangeSizeArr && TkGlobal.msglist.videoChangeSizeArr !== null) {
			that.handlemsglistVideoChangeSize(TkGlobal.msglist.videoChangeSizeArr);
			// TkGlobal.msglist.videoChangeSizeArr = null;
		}
		/*分屏*/
		if(TkGlobal.msglist.VideoSplitScreenArray && TkGlobal.msglist.VideoSplitScreenArray !== null) {
			/*tkpc2.0.8-start*/ 
			let data = TkGlobal.msglist.VideoSplitScreenArray[0].data.userIDArry; 
			eventObjectDefine.CoreController.dispatchEvent({ 
				type: "handlemsglistVideoSplitScreen",
				message: {
					data: data
				}
			});
		   // TkGlobal.msglist.VideoSplitScreenArray = null;
		   /*tkpc2.0.8-start*/
		}

	};
	componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作
		let that = this;
		eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid);
		that._receviceStreamCompleted();
	};
	componentDidUpdate(prevProps, prevState) { //每次render结束后会触发
		if(this.isTriggerOnResize == true) {
			this.isTriggerOnResize = false;
			let defalutFontSize = window.innerWidth / TkConstant.STANDARDSIZE;
			eventObjectDefine.Window.dispatchEvent({
				type: TkConstant.EVENTTYPE.WindowEvent.onResize,
				message: {
					defalutFontSize: defalutFontSize
				}
			});
		}
	};

	
	handlemsglistVideoChangeSize(videoChangeSizeArr) { //msglist,视频框大小的数据
		let {id} = this.props;
		videoChangeSizeArr.map((item, index) => {
			this.state.otherVideoSize = item.data.otherVideoSize;
			for(let [key, value] of Object.entries(this.state.otherVideoSize)) { //限制视频大小,不能超出白板范围
				let {
					videoWidth,
					videoHeight
				} = value;
				this.state.otherVideoSize[key] = this.limitVideoSize(videoWidth, videoHeight);
			}
		});
		this.setState({
			otherVideoSize: this.state.otherVideoSize
		});
	};

	handlerRoomPubmsg(recvEventData) {
		let pubmsgData = recvEventData.message;
		let {id} = this.props;
		switch(pubmsgData.name) {
			case "sendNetworkState":
				let data = pubmsgData.data;
				this.handleNetworkStatus(data);
				break;
			case "VideoChangeSize":
				let {
					otherVideoSize,
					finallyChangeVideoId
				} = pubmsgData.data;
				this.state.otherVideoSize[finallyChangeVideoId] = otherVideoSize[finallyChangeVideoId];
				let {
					videoWidth,
					videoHeight
				} = this.state.otherVideoSize[finallyChangeVideoId];
				this.state.otherVideoSize[finallyChangeVideoId] = this.limitVideoSize(videoWidth, videoHeight); //限制视频大小,不能超出白板范围
				this.setState({
					otherVideoSize: this.state.otherVideoSize
				});
				break;
		}
	};
	initVideoSplitScreen() {
		this.state.userIDArry = [];
		this.isTriggerOnResize = true;
		TkGlobal.isSplitScreen = false;
		this.setState({
			userIDArry: this.state.userIDArry,
		});
        outUserIDArry = this.state.userIDArry;/*tkpc2.0.8-start*/ 
		this.initVideoDrag();
	};
	handlerRoomDelmsg(recvEventData) {
		let pubmsgData = recvEventData.message;
		switch(pubmsgData.name) {
			case "VideoSplitScreen":
				this.initVideoSplitScreen();
				break;
		}
	};
	limitVideoSize(videoWidth, videoHeight) { //限制视频大小,不能超出白板范围
		//获取白板区域宽高：
		const defalutFontSize = window.innerWidth / TkConstant.STANDARDSIZE;
		let content = document.getElementById('content');
		let contentW = content.clientWidth;
		let contentH = content.clientHeight;
		if(contentH > contentW) {
			if(videoWidth >= contentW / defalutFontSize) {
				videoWidth = contentW / defalutFontSize;
				videoHeight = contentW / defalutFontSize * 3 / 4;
			}
		} else {
			if(videoHeight >= contentH / defalutFontSize) {
				videoHeight = contentH / defalutFontSize;
				videoWidth = contentH / defalutFontSize * 4 / 3;
			}
		}
		return {
			videoWidth,
			videoHeight
		};
	};
	handlerRoomParticipantLeave(handleData) { //用户离开房间时，删除该视频框的样式
		let that = this;
		let user = handleData.user;
		//不是助教或老师才删除离开用户的视频框样式：
		if(user.role !== TkConstant.role.roleTeachingAssistant && user.role !== TkConstant.role.roleChairman) {
			delete that.state.otherVideoSize[user.id];
			that.setState({
				otherVideoSize: that.state.otherVideoSize
			});
			if(TkGlobal.msglist.videoChangeSizeArr) { //其他人离开房间将他的视频样式从保存的msglist数据删除
				delete TkGlobal.msglist.videoChangeSizeArr[0].data.otherVideoSize[user.id];
			}
		}
	};
	handleMyselfNetworkStatus(handleData) {
		let data = handleData.message.data;
		this.handleNetworkStatus(data);
	};
	handleNetworkStatus(data) {
		let extensionId = this.props.stream.extensionId;
		if(data.extensionId === extensionId) {
			let {packetsLost, rtt} = data.networkStatus;
			this.state.networkDelay = rtt;
			if(packetsLost > 5 && packetsLost <= 10) {
				this.state.networkDelayColor = "#ff8b2b";
			} else if(packetsLost > 10) {
				this.state.networkDelayColor = "#ff021d";
			} else {
				this.state.networkDelayColor = "#41BF33";
			}
			this.setState({
				networkDelay: this.state.networkDelay,
				networkDelayColor: this.state.networkDelayColor,
			});
		}
	};

	changeVideoBtnHide(handledata) { //根据拖拽改变视频上的按钮是否隐藏
		let {id} = this.props;
		let extensionId = handledata.message.data.extensionId;
		if(id === extensionId) {
			this.btnIsHideOfDrag[extensionId] = handledata.message.data.isDrag;
			if(this.btnIsHideOfDrag[extensionId] == false) { //如果没有拖拽则初始化视频宽高：
				this.initOtherVideoWH();
			}
			let {buttonElementArray} = this.addUserData(this.props.stream);
			this.setState({
				buttonElementArray: buttonElementArray
			});
		}
	};

	_receviceStreamCompleted() {
		this.props.receiveStreamCompleteCallback();
	};

	/*根据user生产用户描述信息*/
	_productionUserDescInfo(user) {
		const that = this;
		if(user == undefined){
			return {};
        }
		const userDescInfo = {
			id: user.id,
			textContext: user.nickname,
			order: TkConstant.role.roleChairman ? 0 : (TkConstant.role.roleTeachingAssistant ? 1 : 2), //根据角色排序用户列表，数越小排的越往后 （order:0-学生 ， 1-老师 ， 2-暂时未定）
			afterIconArray: [{
					disabled: true,
					idHide: false,
					'className': 'v-user-pen ' + (user.candraw ? 'on' : 'off'),

				},
				{
					disabled: true,
					idHide: !user.hasaudio,
					'className': 'v-device-microphone ' + ((user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH) ? 'on' : 'off') + ' ' + (user.disableaudio ? 'disableaudio' : ''),

				},
				{
					disabled: true,
					idHide: !user.hasvideo,
					'className': 'v-device-video ' + ((user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH) ? 'on' : 'off') + ' ' + (user.disablevideo ? 'disablevideo' : ''),
				}
			],
			buttonIconArray: [{
					states: true,
					disabled: false,
					text: (user.candraw ? 'no' : 'yes'),
					'className': 'scrawl-btn',
					'onClick': that.changeUserCandraw.bind(that, user.id),
					title: user.candraw ? TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.Scrawl.on.title : TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.Scrawl.off.title,
					isHide: (ServiceRoom.getTkRoom().getUser(user.id).role === TkConstant.role.roleTeachingAssistant ? true : false), //如果是助教则隐藏
				},
				{
					states: true,
					disabled: false,
					text: (user.publishstate !== TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE ? 'no' : 'yes'),
					'className': 'platform-btn',
					'onClick': that.userPlatformUpOrDown.bind(that, user.id),
					title: user.publishstate !== TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE ? TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.update.up.title : TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.update.down.title,
					isHide: (TkGlobal.isSplitScreen?false:(that.btnIsHideOfDrag[user.id] ? true : false)),//tkpc2.0.8
				},
				{
					states: user.hasaudio,
					disabled: false,
					text: (user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH) ? 'no' : 'yes',
					'className': 'audio-btn',
					'onClick': that.userAudioOpenOrClose.bind(that, user.id),
					title: user.disableaudio ? TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.audio.disabled.title : (
						user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH ?
						TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.audio.on.title : TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.audio.off.title
					),
					isHide: (TkGlobal.isSplitScreen?false:(that.btnIsHideOfDrag[user.id] ? true : false)),//tkpc2.0.8
				},
				{
					states: true,
					disabled: false,
					text: 'yes',
					'className': 'gift-btn',
					'onClick': that.sendGiftToStudent.bind(that, user.id),
					title: user.raisehand ? TkGlobal.language.languageData.header.system.Raise.yesText : TkGlobal.language.languageData.header.system.Raise.noText,
					isHide: TkConstant.hasRole.roleTeachingAssistant ? true : ((ServiceRoom.getTkRoom().getUser(user.id).role === TkConstant.role.roleTeachingAssistant ? true : false)),
				},
				{
					states: true,
					disabled: false,
					text: 'text',
					'className': 'restoreDrag-btn',
					'onClick': that.initVideoDrag.bind(that, user.id),
					title: TkGlobal.language.languageData.otherVideoContainer.button.restoreDrag.text,
					isHide: (TkGlobal.isSplitScreen?true:(that.btnIsHideOfDrag[user.id] ? false : true)),//tkpc2.0.8
                },
			],
			studentIconArray: [{
					states: user.hasaudio,
					text: (user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH) ? 'no' : 'yes',
					'className': 'audio-btn',
					'onClick': that.userAudioOpenOrClose.bind(that, user.id)
				},
				{
					states: user.hasvideo,
					text: (user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH) ? 'no' : 'yes',
					'className': 'video-btn',
					'onClick': that.userVideoOpenOrClose.bind(that, user.id)
				}
			],
			raisehand: user.raisehand,
		};
		/*--tkpc2.0.8--start*/
		/*if(!user.hasvideo && !user.hasaudio) {
			userDescInfo.afterIconArray.length = 0;
			userDescInfo.buttonIconArray.length = 0;
		}*/
		/*--tkpc2.0.8--end*/
		return userDescInfo;
	};

	//根据流获取user数据
	addUserData(stream) {

		let that = this;
		let userDescInfo = {};
		//let afterElementArray = [],buttonElementArray = []  ;
		if(stream.getID() > 0 || stream.getID() === "local") {
			let userid = stream.extensionId;
			const user = ServiceRoom.getTkRoom().getUsers()[userid];
			userDescInfo = that._productionUserDescInfo(user);
			//that.setState({userDescInfo: userDescInfo});
		} else {
			//userDescInfo = that._productionDefaultDescInfo(stream);
			//that.setState({userDescInfo: userDescInfo});
		}

		//处理图标按钮状态
		let {
			afterElementArray,
			buttonElementArray,
			studentElementArray
		} = that.loadUserDataProps(userDescInfo);
		return {
			afterElementArray: afterElementArray,
			buttonElementArray: buttonElementArray,
			studentElementArray: studentElementArray
		}
	};

	/*加载视频需要的user props*/
	loadUserDataProps(userDescInfo) {
		let that = this;
		let userid = "";
		//加载图标按钮
		//userid = userDescInfo.id;
		let {
			afterElementArray,
			buttonElementArray,
			studentElementArray
		} = this.loadIconArray(userDescInfo);

		return {
			afterElementArray,
			buttonElementArray,
			studentElementArray
		};
	};

	/*加载图标元素*/
	loadIconArray(userDescInfo) {
		const afterElementArray = [],
			buttonElementArray = [],
			studentElementArray = [];
		const {
			id,
			textContext,
			order,
			afterIconArray,
			buttonIconArray,
			studentIconArray,
			raisehand
		} = userDescInfo;
		//this.btnIsHideOfDrag[id] = false;

		this.setState({
			userNickName: textContext
		});

		this.setState({
			raisehand: raisehand
		});

		if(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant) {
			this.setState({
				buttonsStyle: true
			});
		}

		if(afterIconArray) {
			afterIconArray.forEach((value, index) => {
				//value.attrJson = value.attrJson || {} ;
				const {
					disabled,
					idHide,
					className,
					onClick
				} = value;
				//const {id , title  , className , ...otherAttrs} =  attrJson ;
				if(!idHide) {
					const iconTemp = <button key={index}
                                             className={'' + (className ? className : '') + ' ' + (disabled ? ' disabled ' : ' ')}
                                             onClick={onClick && typeof onClick === "function" ? onClick : undefined}
                                             disabled={disabled ? disabled : undefined} id={id + "" + index}></button>;
					afterElementArray.push(iconTemp)
				}
			});
		}

		if(buttonIconArray) {

			buttonIconArray.forEach((value, index) => {
				//value.attrJson = value.attrJson || {} ;
				if(!TkGlobal.classBegin) {
					return;
				};
				const {
					states,
					disabled,
					text,
					className,
					onClick,
					title,
					isHide
				} = value;
				//const {id , title  , className , ...otherAttrs} =  attrJson ;
				if(states) {
					let buttonName = className.split("-");
					const iconTemp = <button key={index}
                                             className={'' + (className ? className : '') + ' ' + (disabled ? ' disabled ' : ' ')}
                                             onClick={onClick && typeof onClick === "function" ? onClick : undefined}
                                             disabled={disabled ? disabled : undefined}
                                             style={{display:isHide?'none':'block'}}
                                             id={id + "" + index}>{TkGlobal.language.languageData.otherVideoContainer.button[buttonName[0]][text]} </button>;
					buttonElementArray.push(iconTemp);
				}

			});
		}

		if(studentIconArray) {

			studentIconArray.forEach((value, index) => {
				if(!TkGlobal.classBegin)
					return;
				//value.attrJson = value.attrJson || {} ;
				const {
					states,
					text,
					className,
					onClick
				} = value;
				//const {id , title  , className , ...otherAttrs} =  attrJson ;
				if(states) {
					if(className == 'audio-btn' || className === 'video-btn') {
						let buttonName = className.split("-");
						const iconTemp = <button key={index}
                                                 className={''+ (className ? className : '')}
                                                 onClick={onClick && typeof onClick === "function" ? onClick : undefined}>{TkGlobal.language.languageData.otherVideoContainer.button[buttonName[0]][text]}</button>;

						studentElementArray.push(iconTemp)
					}
				}
			});
		}

		return {
			afterElementArray,
			buttonElementArray,
			studentElementArray
		}
	}

	//*用户功能-上下讲台信令的发送*/
	userPlatformUpOrDown(userid) {
		let that = this;
		//if(that.state.userid> 0 || that.state.userid === 'local') {
		ServiceSignalling.userPlatformUpOrDown(userid)
		//}
	}

	/*用户功能-打开关闭音频*/
	userAudioOpenOrClose(userid) {

		let that = this;
		//if(that.state.userid> 0 || that.state.userid === 'local') {
		ServiceSignalling.userAudioOpenOrClose(userid)
		//}
	}

	/*用户功能-打开关闭视频*/
	userVideoOpenOrClose(userid) {

		let that = this;
		//if(that.state.userid> 0 || that.state.userid === 'local') {
		ServiceSignalling.userVideoOpenOrClose(userid)
		//}
	}

	/*改变用户的画笔权限*/
	changeUserCandraw(userid) {

		let that = this;
		//if(that.state.userid> 0 || that.state.userid === 'local') {
		ServiceSignalling.changeUserCandraw(userid)
		//}
	}

	//给学生发送礼物
	sendGiftToStudent(userid) {
		let user = ServiceRoom.getTkRoom().getUsers()[userid]; //根据userid获取用户信息
		/*let message = {
		    textBefore:TkGlobal.language.languageData.alertWin.messageWin.winMessageText.aloneGift.before ,
		    textMiddle:user.nickname  ,
		    textAfter:TkGlobal.language.languageData.alertWin.messageWin.winMessageText.aloneGift.after  ,
		};
		let allGiftMessage = <span>
		                        <span className="add-fl" >{message.textBefore}</span>
		                        <span className="gift-username add-nowrap add-fl"  style={{color:'#4468d0',maxWidth: '2rem'}} >&nbsp;{message.textMiddle}&nbsp;</span>
		                        <span className="add-fl">{message.textAfter}</span>
		                    </span>;
		ServiceTooltip.showConfirm(allGiftMessage , function (answer) {
		    if(answer){
		        if( CoreController.handler.getAppPermissions('giveAloneUserSendGift') ){
		            let userIdJson = {};
		            if(user.role === TkConstant.role.roleStudent){ //如果是学生，则发送礼物
		                let userId = user.id;
		                let userNickname = user.nickname ;
		                userIdJson[userId] = userNickname ;
		                WebAjaxInterface.sendGift(userIdJson);
		            }
		        }
		    }
		});*/
		if(CoreController.handler.getAppPermissions('giveAloneUserSendGift')) {
			let userIdJson = {};
			if(user.role === TkConstant.role.roleStudent) { //如果是学生，则发送礼物
				let userId = user.id;
				let userNickname = user.nickname;
				userIdJson[userId] = userNickname;
				WebAjaxInterface.sendGift(userIdJson);
			}
		}
	};

	_init() {
		let that = this;

		let {
			afterElementArray,
			buttonElementArray,
			studentElementArray
		} = that.addUserData(that.props.stream);
		this.setState({
			afterElementArray: afterElementArray
		});
		this.setState({
			buttonElementArray: buttonElementArray
		});
		this.setState({
			studentElementArray: studentElementArray
		});
	}

    handleBackgroundModeFloat(userId,backgroundModeFloatIsShow) {//处理后台模式浮层
        let {id} = this.props;
        if (userId === id) {
			let user = ServiceRoom.getTkRoom().getUsers()[id];
			backgroundModeFloatIsShow = backgroundModeFloatIsShow || user.isInBackGround;
			this.setState({backgroundModeFloatIsShow:backgroundModeFloatIsShow});
		}
    }
	/*处理room-userproperty-changed事件*/
	handlerRoomUserpropertyChanged(roomUserpropertyChangedEventData) {
		const that = this;
		const changePropertyJson = roomUserpropertyChangedEventData.message;
		const user = roomUserpropertyChangedEventData.user;

        for (let [key, value] of Object.entries(changePropertyJson)) {
            if (key === "isInBackGround") {
                if (value === true) {//收到手机端按home键的信息
					that.handleBackgroundModeFloat(user.id,true);//处理后台模式浮层
                }else if (value === false){//如果不在后台模式或者下台
                    that.handleBackgroundModeFloat(user.id,false);//处理后台模式浮层
                }
            }else if (key === 'publishstate' && user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE) {
                that.handleBackgroundModeFloat(user.id,false);//处理后台模式浮层
            }
        }

		if(user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE) { //如果是下台状态，删除该视频框的样式
			delete that.state.otherVideoSize[user.id];
			that.setState({
				otherVideoSize: that.state.otherVideoSize
			});
			if(TkGlobal.msglist.videoChangeSizeArr) { //其他人离开房间将他的视频样式从保存的msglist数据删除
				delete TkGlobal.msglist.videoChangeSizeArr[0].data.otherVideoSize[user.id];
			}			
		}
		if(!that.props.stream || that.props.stream.extensionId !== user.id) {
			return;
		}

		//let giftnumber = user.giftnumber;
		for(let [key, value] of Object.entries(changePropertyJson)) {
			if(key === 'publishstate' || key === 'disablevideo') { //发布状态改变时显示或者隐藏video
				if((user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH) && !user.disablevideo) {
					that.props.stream.show();
				} else {
					that.props.stream.hide();
				}
			}
			if(key !== 'giftnumber') {
				if(!that.props.stream)
					return;
				/*this.setState({
				    giftnumber:giftnumber
				});*/

				let {
					afterElementArray,
					buttonElementArray,
					studentElementArray
				} = that.addUserData(that.props.stream);
				this.setState({
					afterElementArray: afterElementArray,
					buttonElementArray: buttonElementArray,
					studentElementArray: studentElementArray,
				});
			} else if(key == 'giftnumber') {
				/*this.setState({
					giftnumber: value
				});*/
                this.setState({
                    giftnumberState: !this.state.giftnumberState
                });
			}
		}
	};
	handleInitVideoDrag(handleData) {
		let {id} = this.props;
		if(id === handleData.message.id) {
			this.initVideoDrag();
		}
	}
	initVideoDrag() { //初始化视频的位置
		let {id, isDrag} = this.props;
		if(isDrag) {
			let videoStyle = {percentLeft: 0, percentTop: 0, isDrag: false,};
			this.initOtherVideoWH(); //初始化视频的大小
			eventObjectDefine.CoreController.dispatchEvent({ //改变拖拽的video位置
				type: 'changeOtherVideoStyle',
				message: {data: {style: videoStyle, id: id}},
				source:'initVideoDrag',
			});
			TkGlobal.changeVideoSizeEventName = null;
			TkGlobal.changeVideoSizeMouseUpEventName = null;
			// this.isTriggerOnResize = true;
		}
	};

	//  otherVideoOndblclick(){//双击视频浮出在随机位置
	//      let {id,isDrag} = this.props;     
	//      if (TkConstant.hasRole.roleStudent) {return};
	//      Log.error(this.state.userIDArry,id);
	//      if (isDrag) {
	//          this.initVideoDrag();
	//      }else {
	//          const defalutFontSize = window.innerWidth / TkConstant.STANDARDSIZE ;
	//          // let contentEle = document.getElementById("content");
	//          // let otherVideoEle = document.getElementById(id);
	//          // let contentEleW = contentEle.clientWidth;
	//          // let contentEleH = contentEle.clientHeight;
	//          // const translateX = (contentEleW-otherVideoEle.clientWidth)*Math.random();
	//          // const translateY = (contentEleH-otherVideoEle.clientHeight)*Math.random();
	//          // let otherVideoLeft = translateX/(contentEleW-otherVideoEle.clientWidth);
	//          // let otherVideoTop = translateY/(contentEleH-otherVideoEle.clientHeight);
	//          let videoStyle = {
	//              top:otherVideoTop,
	//              left:otherVideoLeft,
	//              isDrag:true,
	//          };
	//          eventObjectDefine.CoreController.dispatchEvent({//自己本地改变拖拽的video位置
	//              type:'changeOtherVideoStyle',
	//              message:{data: {style:videoStyle,id:id}},
	//          });
	//      }
	//  };

	layerIsShowOfIsDraging(isDragging, isVideoStretch, getItem) { //根据是否正在拖拽显示或隐藏ppt上的浮层
		let {id} = this.props;
		if(isDragging || isVideoStretch) {
			//layerIsShowOfDraging = false;
			let newpptLayer = document.getElementById("ppt_not_click_newppt");
			let h5DocumentLayer = document.getElementById("h5Document-layer");
			if(newpptLayer) {
				newpptLayer.style.display = 'block';
			}
			if(h5DocumentLayer) {
				h5DocumentLayer.style.display = 'block';
			}
		} else {
			if (getItem === null || (getItem && getItem.id === id)) {
                let newpptLayer = document.getElementById("ppt_not_click_newppt");
                let h5DocumentLayer = document.getElementById("h5Document-layer");
                if(newpptLayer) {
                    newpptLayer.style.display = 'none';
                }
                if(h5DocumentLayer) {
                    h5DocumentLayer.style.display = 'none';
                }
			}
		}
	};
	initOtherVideoWH() { //初始化拖拽的视频宽高
		let {id} = this.props;
		const defalutFontSize = window.innerWidth / TkConstant.STANDARDSIZE;
		let lcVideoContainer = document.getElementById('main_content_tool_lc_video_container');
		let otherVideoWidth = ((lcVideoContainer.clientWidth / defalutFontSize) / 6 - 0.15);
		let otherVideoHeight = otherVideoWidth * 3 / 4;
		this.state.otherVideoSize[id] = {
			videoHeight: otherVideoHeight,
			videoWidth: otherVideoWidth,
		};
		this.setState({
			otherVideoSize: this.state.otherVideoSize
		});
	};
	getOtherVideoLT(percentLeft, percentTop, id, isDrag) { //获取视频框相对白板的位置
		if(isDrag && this.state.otherVideoSize[id]) {
			const defalutFontSize = window.innerWidth / TkConstant.STANDARDSIZE;
			//获取视频宽高：
			let {videoHeight, videoWidth} = this.state.otherVideoSize[id];
			//获取白板区域宽高：
			let content = document.getElementById('content');
			let contentW = content.clientWidth;
			let contentH = content.clientHeight;
			//计算视频框相对白板的位置：
			let otherVideoLeft = percentLeft * (contentW - videoWidth * defalutFontSize) / defalutFontSize;
			let otherVideoTop = percentTop * (contentH - videoHeight * defalutFontSize) / defalutFontSize;
			//保存视频框相对白板的位置：
			this.otherVideoLT[id] = {
				otherVideoLeft: otherVideoLeft,
				otherVideoTop: otherVideoTop,
			};
			return {
				otherVideoLeft,
				otherVideoTop
			};
		} else {
			let otherVideoLeft = 0,
				otherVideoTop = 0;
			//保存视频框相对白板的位置：
			this.otherVideoLT[id] = {
				otherVideoLeft: otherVideoLeft,
				otherVideoTop: otherVideoTop,
			};
			return {
				otherVideoLeft,
				otherVideoTop
			};
		}
	};

	mouseDown(event) { //鼠标按下时
		if(!CoreController.handler.getAppPermissions('isChangeVideoSize')) {
			return;
		};
		let {
			id,
			isDrag
		} = this.props;
		if(isDrag) {
			const defalutFontSize = window.innerWidth / TkConstant.STANDARDSIZE;
			//获取视频框相对白板的位置：
			let {
				otherVideoLeft,
				otherVideoTop
			} = this.otherVideoLT[id];
			//获取视频框相对body的位置：
			let videoLeft = (otherVideoLeft + 0.5) * defalutFontSize;
			let videoTop = (otherVideoTop + 0.49) * defalutFontSize;
			//获取鼠标相对body的位置：
			let mouseLeft = event.pageX;
			let mouseTop = event.pageY;
			//获取视频框当前宽高：
			let dragEle = document.getElementById(id); //拖拽的元素
			let videoWidth = dragEle.clientWidth;
			let videoHeight = dragEle.clientHeight;
			//根据鼠标按下的位置判断是否可以拉伸：
			if((mouseLeft >= videoLeft + videoWidth - 7 && mouseLeft < videoLeft + videoWidth) && (mouseTop >= videoTop && mouseTop < videoTop + videoHeight - 7)) {
				TkGlobal.isVideoStretch = true; //是否是拉伸
			} else if((mouseTop >= videoTop + videoHeight - 7 && mouseTop < videoTop + videoHeight) && (mouseLeft >= videoLeft && mouseLeft < videoLeft + videoWidth - 7)) {
				TkGlobal.isVideoStretch = true; //是否是拉伸
			} else if((mouseTop < videoTop + videoHeight && mouseTop >= videoTop + videoHeight - 7) && (mouseLeft < videoLeft + videoWidth && mouseLeft >= videoLeft + videoWidth - 7)) {
				TkGlobal.isVideoStretch = true; //是否是拉伸
			}
		}

	};
	videoMouseUp(handleData) { //鼠标抬起时
		let {
			id,
			isDrag
		} = this.props;
		if(isDrag) {
			let event = handleData.message.data.event;
			if(TkGlobal.isVideoStretch === true) {
				let data = {
					otherVideoSize: this.state.otherVideoSize,
					finallyChangeVideoId: id,
				};
				ServiceSignalling.sendSignallingFromVideoChangeSize(data);
			}
			TkGlobal.isVideoStretch = false; //是否是拉伸
			this.layerIsShowOfIsDraging(false, TkGlobal.isVideoStretch);
			event.onmousemove = null;
			event.target.style.cursor = "";
		}
	};
	videoChangeSize(handleData) { //鼠标移动时
		let event = handleData.message.data.event;
		let {
			id,
			isDrag
		} = this.props;
		let otherVideoSize = {};
		if(isDrag) {
			const defalutFontSize = window.innerWidth / TkConstant.STANDARDSIZE;
			//获取视频框相对body的位置：
			let {
				otherVideoLeft,
				otherVideoTop
			} = this.otherVideoLT[id];
			let videoLeft = (otherVideoLeft + 0.5) * defalutFontSize;
			let videoTop = (otherVideoTop + 0.49) * defalutFontSize;
			//获取鼠标相对body的位置：
			let mouseLeft = event.pageX;
			let mouseTop = event.pageY;
			//获取视频框当前宽高：
			let dragEle = document.getElementById(id); //拖拽的元素
			let videoWidth = dragEle.clientWidth;
			let videoHeight = dragEle.clientHeight;
			//获取视频框初始宽高：
			/*let lcVideoContainer = document.getElementById('main_content_tool_lc_video_container');
			let videoInitWidth = ((lcVideoContainer.clientWidth) / 6 - 0.15*defalutFontSize);
			let videoInitHeight = videoInitWidth*3/4;*/
			//获取白板区域宽高：
			let content = document.getElementById('content');
			let contentW = content.clientWidth;
			let contentH = content.clientHeight;
			//改变鼠标的样式
			if(!TkGlobal.isVideoStretch) {
				if((mouseLeft >= videoLeft + videoWidth - 7 && mouseLeft <= videoLeft + videoWidth) && (mouseTop >= videoTop && mouseTop < videoTop + videoHeight - 7)) {
					event.target.style.cursor = "w-resize";
					this.stretchDirection = 'w';
				} else if((mouseTop >= videoTop + videoHeight - 7 && mouseTop <= videoTop + videoHeight) && (mouseLeft >= videoLeft && mouseLeft < videoLeft + videoWidth - 7)) {
					event.target.style.cursor = "s-resize";
					this.stretchDirection = 's';
				} else if((mouseTop < videoTop + videoHeight && mouseTop >= videoTop + videoHeight - 7) && (mouseLeft < videoLeft + videoWidth && mouseLeft >= videoLeft + videoWidth - 7)) {
					event.target.style.cursor = "se-resize";
					this.stretchDirection = 'se';
				} else {
					event.target.style.cursor = "";
				}
			}

			//改变视频框的大小
			if((TkGlobal.isVideoStretch && this.stretchDirection == "w") || (TkGlobal.isVideoStretch && this.stretchDirection == "se")) {
				let newVideoWidth = Math.abs(mouseLeft - videoLeft) / defalutFontSize;
				let newVideoHeight = Math.abs(mouseLeft - videoLeft) / defalutFontSize * 3 / 4;
				if(newVideoWidth < 2.4 || mouseLeft < 0.5 * defalutFontSize || mouseLeft < videoLeft) {
					newVideoWidth = 2.4;
					newVideoHeight = 1.8;
				}
				if(contentH > contentW) { //限制视频大小,不能超出白板范围
					if(newVideoWidth >= contentW / defalutFontSize) {
						newVideoWidth = contentW / defalutFontSize;
						newVideoHeight = newVideoWidth * 3 / 4;
					}
				} else {
					if(newVideoHeight >= contentH / defalutFontSize) {
						newVideoHeight = contentH / defalutFontSize;
						newVideoWidth = contentH / defalutFontSize * 4 / 3;
					}
				}
				otherVideoSize = {
					videoHeight: newVideoHeight,
					videoWidth: newVideoWidth,
				};
				this.state.otherVideoSize[id] = otherVideoSize;
				this.setState({
					otherVideoSize: this.state.otherVideoSize
				});
			} else if(TkGlobal.isVideoStretch && this.stretchDirection == "s") {
				let newVideoHeight = Math.abs(mouseTop - videoTop) / defalutFontSize;
				let newVideoWidth = Math.abs(mouseTop - videoTop) / defalutFontSize * 4 / 3;
				if(newVideoHeight < 1.8 || mouseTop < 0.49 * defalutFontSize || mouseTop < videoTop) {
					newVideoWidth = 2.4;
					newVideoHeight = 1.8;
				}
				if(contentH > contentW) { //限制视频大小,不能超出白板范围
					if(newVideoWidth >= contentW / defalutFontSize) {
						newVideoWidth = contentW / defalutFontSize;
						newVideoHeight = newVideoWidth * 3 / 4;
					}
				} else {
					if(newVideoHeight >= contentH / defalutFontSize) {
						newVideoHeight = contentH / defalutFontSize;
						newVideoWidth = contentH / defalutFontSize * 4 / 3;
					}
				}
				otherVideoSize = {
					videoHeight: newVideoHeight,
					videoWidth: newVideoWidth,
				};
				this.state.otherVideoSize[id] = otherVideoSize;
				this.setState({
					otherVideoSize: this.state.otherVideoSize
				});
			}

		}
	};

	mouseMove() {
		if(!CoreController.handler.getAppPermissions('isChangeVideoSize')) {
			return;
		};
		let {id, isDrag} = this.props;
		if(TkGlobal.changeVideoSizeEventName !== id + "_mouseMove" && TkGlobal.changeVideoSizeMouseUpEventName !== id + "_mouseUp" && !TkGlobal.isVideoStretch && isDrag) {
			TkGlobal.changeVideoSizeEventName = id + "_mouseMove"; //以id作为改变视频大小事件的名字
			TkGlobal.changeVideoSizeMouseUpEventName = id + "_mouseUp";
		}
	}

	/*分屏函数*/
	handleVideoSplitScreen(data) {
		this.state.userIDArry = data.message.datas.userIDArry;
		this.state.ulHeight = data.message.datas.ulHeight;
		this.setState({
			userIDArry: this.state.userIDArry,
			ulHeight: this.state.ulHeight
		});
        outUserIDArry = this.state.userIDArry;//tkpc2.0.8
		this.dispatchAndPubMsgFun(this.state.userIDArry)
        /*--tkpc2.0.8--start*/
        let {buttonElementArray} = this.addUserData(this.props.stream);
        this.setState({
            buttonElementArray: buttonElementArray
        });
		/*--tkpc2.0.8--end*/
	};
	dispatchAndPubMsgFun(userIDArry) {
		this.isTriggerOnResize = true;
		TkGlobal.isSplitScreen = (userIDArry.length > 0) ? true : false;
		if(TkGlobal.isSplitScreen) {
			this.setStyleFun();
		}
	}
	/*改变底部UL的高度*/
	changeBottomUlHeightRem(data) {
		this.state.ulHeight = data.message.ulHeight;
		this.setState({
			ulHeight: this.state.ulHeight
		});
		if(TkGlobal.isSplitScreen) {
			this.setStyleFun();
		}
	}
	/*设置样式的函数*/
	setStyleFun() {
		let {id} = this.props;
		let {liStyle, ulHeight} = this.state;
		if(TkGlobal.isSplitScreen) {
			let lengths = this.state.userIDArry.length;
			if(lengths === 1) {
				let heightValue = "calc(100%" + " - " + ulHeight + "rem" + " - " + "0.48rem)";
				liStyle.oneLiStyle = {
					width: "calc(100% - 0.5rem - 3.9rem)",
					height: heightValue,
					position: "fixed",
					top: "0.48rem",
					left: "0.5rem",
					zIndex: 122,
					margin: 0,
				};
				this.setState({
					liStyle: liStyle,
				});
			} else if(lengths === 2) {

				let heightValue = "calc(100%" + " - " + ulHeight + "rem" + " - " + "0.48rem)";
				liStyle.oneLiStyle = {
					width: "calc(50% - 0.25rem - 1.95rem) ",
					height: heightValue,
					position: "fixed",
					top: "0.48rem",
					left: "0.5rem ",
					zIndex: 122,
					margin: 0,
				};
				liStyle.twoLiStyle = {
					width: "calc(50% - 0.25rem - 1.95rem) ",
					height: "calc(100%" + " - " + ulHeight + "rem" + " - " + "0.48rem)",
					position: "fixed",
					top: "0.48rem",
					left: "calc(50% - 0.25rem - 1.45rem)",
					zIndex: 122,
					margin: 0,
				};

				this.setState({
					liStyle: liStyle,
				});
			} else if(lengths === 3) {

				let oneHeightValue = "calc(100% - " + ulHeight + "rem" + " - 0.48rem)";
				let twoHeightValue = "calc(50% - " + ulHeight / 2 + "rem" + " - 0.24rem)";
				liStyle.oneLiStyle = {
					width: "calc(50% - 0.25rem - 1.95rem)",
					height: oneHeightValue,
					position: "fixed",
					top: "0.48rem",
					left: "0.5rem ",
					margin: 0,
					zIndex: 122,
				};
				liStyle.twoLiStyle = {
					width: "calc(50% - 0.25rem - 1.95rem) ",
					height: twoHeightValue,
					position: "fixed",
					top: "0.48rem",
					left: "calc(50% - 0.25rem - 1.45rem) ",
					margin: 0,
					zIndex: 122,
				};
				liStyle.threeLiStyle = {
					width: "calc(50% - 0.25rem - 1.95rem) ",
					height: twoHeightValue,
					position: "fixed",
					top: "calc(" + twoHeightValue + " + 0.48rem)",
					left: "calc(50% - 0.25rem - 1.45rem) ",
					margin: 0,
					zIndex: 122,
				};
				this.setState({
					liStyle: liStyle,
				});
			} else if(lengths === 4) {
				let oneHeightValue = "calc(50%" + " - " + ulHeight / 2 + "rem" + " - " + "0.24rem)";
				liStyle.oneLiStyle = {
					width: "calc(50% - 0.25rem - 1.95rem)",
					height: oneHeightValue,
					position: "fixed",
					top: "0.48rem",
					left: "0.5rem ",
					zIndex: 122,
					margin: 0,
				};
				liStyle.twoLiStyle = {
					width: "calc(50% - 0.25rem - 1.95rem) ",
					height: oneHeightValue,
					position: "fixed",
					top: "0.48rem",
					left: "calc(50% - 0.25rem - 1.45rem) ",
					zIndex: 122,
					margin: 0,
				};
				liStyle.threeLiStyle = {
					width: "calc(50% - 0.25rem - 1.95rem) ",
					height: oneHeightValue,
					position: "fixed",
					top: "calc(" + oneHeightValue + " + 0.48rem)",
					left: "0.5rem",
					zIndex: 122,
					margin: 0,
				};
				liStyle.fourLiStyle = {
					width: "calc(50% - 0.25rem - 1.95rem) ",
					height: oneHeightValue,
					position: "fixed",
					top: "calc(" + oneHeightValue + " + 0.48rem)",
					left: "calc(50% - 0.25rem - 1.45rem) ",
					zIndex: 122,
					margin: 0,
				};
				this.setState({
					liStyle: liStyle,
				});
			} else if(lengths === 5) {
				let oneHeightValue = "calc(50%" + " - " + ulHeight / 2 + "rem" + " - " + "0.24rem)";
				liStyle.oneLiStyle = {
					width: "calc(50% - 0.25rem - 3.9rem/2)",
					height: oneHeightValue,
					position: "fixed",
					top: "0.48rem",
					left: "0.5rem ",
					zIndex: 122,
					margin: 0,
				};
				liStyle.twoLiStyle = {
					width: "calc(50% - 0.25rem - 3.9rem/2)",
					height: oneHeightValue,
					position: "fixed",
					top: "0.48rem",
					left: "calc(50% - 0.25rem - 1.45rem) ",
					zIndex: 122,
					margin: 0,
				};
				liStyle.threeLiStyle = {
					width: "calc(100%/3 - 0.5rem/3 - 3.9rem/3)",
					height: oneHeightValue,
					position: "fixed",
					top: "calc(" + oneHeightValue + " + 0.48rem)",
					left: "0.5rem ",
					zIndex: 122,
					margin: 0,
				};
				liStyle.fourLiStyle = {
					width: "calc(100%/3 - 0.5rem/3 - 3.9rem/3)",
					height: oneHeightValue,
					position: "fixed",
					top: "calc(" + oneHeightValue + " + 0.48rem)",
					left: "calc(100%/3 - 0.5rem/3 - 1.3rem + 0.5rem) ",
					zIndex: 122,
					margin: 0,
				};
				liStyle.fiveLiStyle = {
					width: "calc(100%/3 - 0.5rem/3 - 3.9rem/3)",
					height: oneHeightValue,
					position: "fixed",
					top: "calc(" + oneHeightValue + " + 0.48rem)",
					left: "calc(100%*2/3 - 0.5rem*2/3 - 3.9rem*2/3 + 0.5rem) ",
					zIndex: 122,
					margin: 0,
				};
				this.setState({
					liStyle: liStyle,
				});

			} else if(lengths === 6) {
				let oneHeightValue = "calc(50%" + " - " + ulHeight / 2 + "rem" + " - " + "0.24rem)";
				liStyle.oneLiStyle = {
					width: "calc(100%/3 - 0.5rem/3 - 3.9rem/3)",
					height: oneHeightValue,
					position: "fixed",
					top: "0.48rem",
					left: "0.5rem ",
					zIndex: 122,
					margin: 0,
				};
				liStyle.twoLiStyle = {
					width: "calc(100%/3 - 0.5rem/3 - 3.9rem/3) ",
					height: oneHeightValue,
					position: "fixed",
					top: "0.48rem",
					left: "calc(100%/3 - 0.5rem/3 -  3.9rem/3 + 0.5rem)",
					zIndex: 122,
					margin: 0,
				};
				liStyle.threeLiStyle = {
					width: "calc(100%/3 - 0.5rem/3 - 3.9rem/3)",
					height: oneHeightValue,
					position: "fixed",
					top: "0.48rem",
					left: "calc(100%*2/3 - 0.5rem*2/3 - 3.9rem*2/3 + 0.5rem)",
					zIndex: 122,
					margin: 0,
				};
				liStyle.fourLiStyle = {
					width: "calc(100%/3 - 0.5rem/3 - 3.9rem/3)",
					height: oneHeightValue,
					position: "fixed",
					top: "calc(" + oneHeightValue + " + 0.48rem)",
					left: "0.5rem",
					zIndex: 122,
					margin: 0,
				};
				liStyle.fiveLiStyle = {
					width: "calc(100%/3 - 0.5rem/3 - 3.9rem/3)",
					height: oneHeightValue,
					position: "fixed",
					top: "calc(" + oneHeightValue + " + 0.48rem)",
					left: "calc(100%/3 - 0.5rem/3 -  3.9rem/3 + 0.5rem)",
					zIndex: 122,
					margin: 0,
				};
				liStyle.sixLiStyle = {
					width: "calc(100%/3 - 0.5rem/3 - 3.9rem/3)",
					height: oneHeightValue,
					position: "fixed",
					top: "calc(" + oneHeightValue + " + 0.48rem)",
					left: "calc(100%*2/3 - 0.5rem*2/3 - 3.9rem*2/3 + 0.5rem)",
					zIndex: 122,
					margin: 0,
				};
				this.setState({
					liStyle: liStyle,
				});
			}
		}
	};

    getUser(userid){
        return ServiceRoom.getTkRoom().getUser(userid);
    }

    getGiftnumber(){
        const that = this ;
        let giftnumber = 0;
        let stream = that.props.stream;

        if(that.props.stream===undefined) {
            giftnumber =0;
        }
        if(ServiceRoom.getTkRoom().getUser(stream.extensionId)===undefined) {
            giftnumber =0;
        }
        else{
            if(that.getUser(stream.extensionId)!=undefined) {
                giftnumber = that.getUser(stream.extensionId).giftnumber;
            }
        }

        return giftnumber;

    };
	render() {
		let that = this;
        let {liStyle} = this.state;
        let {userIDArry} = that.state;
        let {oneLiStyle, twoLiStyle, threeLiStyle, fourLiStyle, fiveLiStyle, sixLiStyle} = that.state.liStyle;
        const {connectDropTarget, connectDragSource, getItem, isDragging, percentLeft, percentTop, id, isDrag, isCanDrag, otherVideoOndblclick} = that.props;
        that.layerIsShowOfIsDraging(isDragging, TkGlobal.isVideoStretch, getItem);
        let {otherVideoLeft, otherVideoTop} = that.getOtherVideoLT(percentLeft, percentTop, id, isDrag);
		//let {afterElementArray,buttonElementArray} = that.addUserData(that.props.stream);
		let afterElementArray = that.state.afterElementArray;
		let buttonElementArray = that.state.buttonElementArray;
		let studentElementArray = that.state.studentElementArray;
		let giftnumber = that.getGiftnumber();

		let assistantFlag = (that.props.stream.extensionId !== undefined && ServiceRoom.getTkRoom().getUser(that.props.stream.extensionId) !== undefined && ServiceRoom.getTkRoom().getUser(that.props.stream.extensionId).role === TkConstant.role.roleTeachingAssistant) ? true : false;
		let buttonsStyle = (that.btnIsHideOfDrag[id] !== true&&assistantFlag&&TkConstant.hasRole.roleTeachingAssistant)?"none":(!TkGlobal.classBegin ? 'none' : (that.state.buttonsStyle ? '' : 'none'));//tkpc2.0.8
		let raisehand = !buttonsStyle && that.state.raisehand ? 'block' : 'none';
		let userNickName = that.state.userNickName;
		//let studentButton = that.state.buttonsStyle?'none':'';
		let studentButton = !TkGlobal.classBegin ? 'none' : (that.props.stream.extensionId == ServiceRoom.getTkRoom().getMySelf().id ? '' : 'none');
		/*<div className="stretch-video" style={{border:isDrag?'0.1rem solid #fff':'none'}}>*/
		//  onMouseMove={that.mouseMove.bind(that)} onMouseDown={that.mouseDown.bind(that)}
		let thisVideoDragStyle = {
			cursor: isCanDrag?"move":"default",
			top: isDrag ? (otherVideoTop + 0.49 - 0.09 + 'rem') : 0,
			left: isDrag ? (otherVideoLeft + 0.5 - 0.12 + 'rem') : 0,
			position: isDrag ? 'fixed' : '',
			width: isDrag ? ((that.state.otherVideoSize[id] ? that.state.otherVideoSize[id].videoWidth + 'rem' : 'calc(100% / 6 - 0.15rem )')) : 'calc(100% / 6 - 0.15rem )',
			height: isDrag ? ((that.state.otherVideoSize[id] ? that.state.otherVideoSize[id].videoHeight + 'rem' : 'calc((100% / 6 - 0.15rem) * 3 / 4)')) : 'calc((100% / 6 - 0.15rem) * 3 / 4)',
		};
		return connectDropTarget(connectDragSource(
			<li id={id} onMouseMove={that.mouseMove.bind(that)} onMouseDown={that.mouseDown.bind(that)} className={"video-permission-container"}  onDoubleClick={otherVideoOndblclick}
                style={TkGlobal.isSplitScreen?(userIDArry[0]==id?oneLiStyle:(userIDArry[1]==id?twoLiStyle:(userIDArry[2]==id?threeLiStyle:(userIDArry[3]==id?fourLiStyle:(userIDArry[4]==id?fiveLiStyle:(userIDArry[5]==id?sixLiStyle:thisVideoDragStyle)))))):thisVideoDragStyle}>
                <div  className="video-wrap video-participant-wrap video-other-wrap add-position-relative" >
                    {this.props.stream.getID()>0 || this.props.stream.getID()=='local'?<Video stream={this.props.stream} classCss={this.state.classCss} ></Video>:undefined }
                    <div className="v-name-wrap clear-float other-name " >
                        <span className="v-name add-nowrap add-fl"  >{userNickName}</span>
                        <span className="v-device-open-close add-fr clear-float" >
                            {afterElementArray}
                        </span>
                    </div>
                    <div className="user-network-delay" style={{color:this.state.networkDelayColor,display:(TkGlobal.classBegin && this.props.stream !== undefined)?"inline-block":"none"}}>
                        <span className="user-network-dot" style={{backgroundColor:this.state.networkDelayColor}}></span>
                        <span className="user-network-delay-num">{this.state.networkDelay+'ms'}</span>
                    </div>
                    <div className="gift-show-container " style={{display: assistantFlag?'none':''}}>
                        <span className="gift-icon"></span>
                        <span className="gift-num">{giftnumber}</span>
                    </div>
                    <div className="video-hover-function-container" style={{display:!isCanDrag?"none":buttonsStyle}}>
                        <span className="button-set role-student" onDoubleClick={ (e) => { e.stopPropagation(); return false ; } }  >
                            {buttonElementArray}
                        </span>
                    </div>
					<div className="background-mode-float" style={{display:this.state.backgroundModeFloatIsShow?"block":"none"}}>
						<p className="background-mode-prompt">{TkGlobal.language.languageData.otherVideoContainer.prompt.text}</p>
					</div>
                    <div className="video-student-set-container" style={{display:CoreController.handler.getAppPermissions('studentVframeBtnIsHide')?"none":((that.btnIsHideOfDrag[id] == true&&assistantFlag)?"none":(!isCanDrag&&assistantFlag?"none":studentButton))}}>
                        <span className="button-set role-student" onDoubleClick={ (e) => { e.stopPropagation(); return false ; } }  >
                            {studentElementArray}
                        </span>
                    </div>
                    <div className="video-participant-raise-btn add-position-absolute-top0-right0"  style={{display: raisehand}}>
                        <span className="raise-img"></span>
                    </div>
                </div>
            </li>
		))
	};
};
/*const HVideoComponentDragTarget = DropTarget('talkDrag', specTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
}))(HVideoComponent);*/
// export  default DragSource('talkDrag', specSource, collect)(HVideoComponent);

const HVideoComponentDragSource = DragSource('talkDrag', specSource, collect)(HVideoComponent);
export default DropTarget('talkDrag', specTarget, connect => ({
	connectDropTarget: connect.dropTarget(),
}))(HVideoComponentDragSource);