/**
 * CommonVideoSmart 组件
 * @module CommonVideoSmart
 * @description   提供 CommonVideoSmart组件
 * @author xiagd
 * @date 2017/12/13
 */

'use strict';
import React from 'react';
import ServiceRoom from 'ServiceRoom';
import TkConstant from 'TkConstant';
import CoreController from 'CoreController';
import TkUtils from 'TkUtils';
import ServiceSignalling from 'ServiceSignalling';
import eventObjectDefine from 'eventObjectDefine';
import TkGlobal from 'TkGlobal';
import WebAjaxInterface from 'WebAjaxInterface';
import VideoDumb from "../../../components/video/realVideo";
import { DragSource, DropTarget } from 'react-dnd';

const specSource = {
    beginDrag(props, monitor, component) {
        const {id, percentLeft, percentTop, isDrag} = props;
        return {id, percentLeft, percentTop, isDrag};
    },
    canDrag(props, monitor) {
        const {id , hasDragJurisdiction} = props;
        if(!hasDragJurisdiction || TkGlobal.isVideoStretch ) { //视频没有拽出并且是学生，或者寻课，或者没有上课，或者是视频拉伸，则不能拖拽//tkpc2.0.8
            return false;
        } else {
            return true;
        }
    },
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging(),
        isCanDrag: monitor.canDrag(),
        getItem:monitor.getItem(),
    };
}

const specTarget = {
    drop(props, monitor, component) {
        let dragFinishEleCoordinate = monitor.getSourceClientOffset(); //拖拽后鼠标相对body的位置
        const item = monitor.getItem(); //拖拽的元素信息
        let {id} = item;
        const defalutFontSize = TkGlobal.windowInnerWidth / TkConstant.STANDARDSIZE;
        let dragEle = document.getElementById(id); //拖拽的元素
        let dragEleW = dragEle.clientWidth;
        let dragEleH = dragEle.clientHeight;
        let content = document.getElementById('lc-full-vessel'); //白板拖拽区域
        let contentW = content.clientWidth;
        let contentH = content.clientHeight;
        /*拖拽元素不能拖出白板区*/
        let dragEleOffsetLeft = dragFinishEleCoordinate.x;
        let dragEleOffsetTop = dragFinishEleCoordinate.y;
        let dragEleLeft,dragEleTop;
        if (TkGlobal.mainContainerFull || TkGlobal.isVideoInFullscreen) {//如果白板区全屏
            if (dragEleOffsetLeft < 0) {
                dragEleOffsetLeft = 0;
            }else if (dragEleOffsetLeft > (contentW-dragEleW)) {
                dragEleOffsetLeft = contentW-dragEleW;
            }
            if (dragEleOffsetTop < 0) {
                dragEleOffsetTop = 0;
            }else if (dragEleOffsetTop > (contentH - dragEleH)) {
                dragEleOffsetTop = contentH - dragEleH;
            }
            /*计算位置百分比*/
            dragEleLeft = dragEleOffsetLeft/(contentW - dragEleW);
            dragEleTop = dragEleOffsetTop/(contentH - dragEleH);
        }else {//白板区没有全屏
            if (dragEleOffsetLeft < TkGlobal.dragRange.left*defalutFontSize) {
                dragEleOffsetLeft = TkGlobal.dragRange.left*defalutFontSize;
            }else if (dragEleOffsetLeft > (TkGlobal.dragRange.left*defalutFontSize+contentW-dragEleW)) {
                dragEleOffsetLeft = TkGlobal.dragRange.left*defalutFontSize+contentW-dragEleW;
            }
            if (dragEleOffsetTop < TkGlobal.dragRange.top*defalutFontSize) {
                dragEleOffsetTop = TkGlobal.dragRange.top*defalutFontSize;
            }else if (dragEleOffsetTop > (TkGlobal.dragRange.top*defalutFontSize + contentH - dragEleH)) {
                dragEleOffsetTop = TkGlobal.dragRange.top*defalutFontSize + contentH - dragEleH;
            }
            /*计算位置百分比*/
            dragEleLeft = (dragEleOffsetLeft - TkGlobal.dragRange.left*defalutFontSize)/(contentW - dragEleW);
            dragEleTop = (dragEleOffsetTop - TkGlobal.dragRange.top*defalutFontSize)/(contentH - dragEleH);
        }
        dragEleLeft = (isNaN(dragEleLeft) || dragEleLeft === Infinity || dragEleLeft === null )?0:dragEleLeft;
        dragEleTop = (isNaN(dragEleTop) || dragEleTop === Infinity || dragEleTop === null )?0:dragEleTop;
        let dragEleStyle = { //相对白板区位置的百分比
            percentTop: dragEleTop,
            percentLeft: dragEleLeft,
            isDrag: true,
        };
        if(id === 'page_wrap' || id === 'lc_tool_container' || id === 'timerDrag' || id === 'dialDrag' || id === 'answerDrag' || id === 'moreBlackboardDrag' || id === 'responderDrag' || id === 'studentResponderDrag' || id === 'coursewareRemarks') {
            eventObjectDefine.CoreController.dispatchEvent({ //自己本地改变拖拽的video位置
                type: 'otherDropTarget',
                message: {data: {id: item.id, style: dragEleStyle}},
            });
        } else {
            eventObjectDefine.CoreController.dispatchEvent({ //自己本地和通知别人改变拖拽的video位置
                type: 'changeOtherVideoStyle',
                message: {data: {style: dragEleStyle, id: id}, initiative:true},
            });
        }
    },
    canDrop(props, monitor) { //拖拽元素不能拖出白板区
        let {isDrag} = props;
        if (isDrag) {
            return true;
        }else {
            return false;
        }

    },
};

class CommonVideoSmart extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            networkDelay: 0,
            networkDelayColor: "#41BF33",
            updateState:false ,
            hasNetworkState:true ,
        };
        this.listernerBackupid = new Date().getTime() + '_' + Math.random();
        this.areaExchange = false;
	};
	componentDidMount() { //真实的DOM被渲染出来后调用
        let {id} = this.props;
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomUserpropertyChanged, this.handlerRoomUserpropertyChanged.bind(this), this.listernerBackupid); //room-userproperty-changed事件-收到参与者属性改变后执行更新
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPubmsg, this.handlerRoomPubmsg.bind(this), this.listernerBackupid); //room-pubmsg事件：
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDelmsg, this.handlerRoomDelmsg.bind(this), this.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener('handleMyselfNetworkStatus', this.handleMyselfNetworkStatus.bind(this), this.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener(id + "_mouseMove", this.videoChangeSize.bind(this), this.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener(id + "_mouseUp", this.videoMouseUp.bind(this), this.listernerBackupid);
	};
	componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作
        eventObjectDefine.CoreController.removeBackupListerner(this.listernerBackupid);
	};
	componentDidUpdate(prevProps, prevState) { //每次render结束后会触发
        if(this.props.stream  !== prevProps.stream &&  this.props.stream === undefined &&  this.hasNetworkState  ){
            this.setState({
                hasNetworkState:false,
                networkDelay: 0,
                networkDelayColor: "#41BF33",
            });
        }else  if(this.props.stream  !== prevProps.stream && prevProps.stream === undefined && this.props.stream !== undefined &&  !this.hasNetworkState  ){
            this.setState({
                hasNetworkState:true,
            });
        }
	};

    /*处理room-userproperty-changed事件*/
    handlerRoomUserpropertyChanged(roomUserpropertyChangedEventData) {
        let user = roomUserpropertyChangedEventData.user ;
        if(this.props.stream && this.props.stream.extensionId === user.id){
            let changePropertyJson = roomUserpropertyChangedEventData.message;
            for(let key of Object.keys(changePropertyJson) ) {
                if(key === 'publishstate' || key === 'disablevideo') { //发布状态改变时显示或者隐藏video
                    if((user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH) && !user.disablevideo) {
                        this.props.stream.show();
                    } else {
                        this.props.stream.hide();
                    }
                }
            }
            this.setState({updateState:!this.state.updateState});
        }
    };
    
    handlerRoomPubmsg(recvEventData) {
        let pubmsgData = recvEventData.message;
        switch(pubmsgData.name) {
            case "sendNetworkState":
                let data = pubmsgData.data;
                this._handleNetworkStatus(data);
                break;
        }
    };
    handlerRoomDelmsg(recvEventData) {
        let delmsgData = recvEventData.message;
        switch(delmsgData.name) {
            case "sendNetworkState":
                if(this.props.stream && this.props.stream.extensionId === delmsgData.id){
                    this.setState({
                        hasNetworkState:false,
                        networkDelay: 0,
                        networkDelayColor: "#41BF33",
                    });
                }
                break;
        }
    };
    handleMyselfNetworkStatus(handleData) {
        let data = handleData.message.data;
        this._handleNetworkStatus(data);
    };
    _handleNetworkStatus(data) {
        if(this.props.stream){
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
                    hasNetworkState:true ,
                });
            }
        }
    };
    
	/*改变用户的画笔权限*/
    changeUserCandraw(userid) {
        ServiceSignalling.changeUserCandraw(userid)
    }
    /*用户功能-上下讲台信令的发送*/
    userPlatformUpOrDown(userid) {
        ServiceSignalling.userPlatformUpOrDown(userid)
    }
    /*用户功能-打开关闭音频*/
    userAudioOpenOrClose(userid) {
        ServiceSignalling.userAudioOpenOrClose(userid)
    }

    /*用户功能-打开关闭视频*/
    userVideoOpenOrClose(userid) {
        ServiceSignalling.userVideoOpenOrClose(userid)
    };

    /*恢复拖拽位置*/
    restoreVideoDrag(){
        let {id, isDrag} = this.props;
        if(isDrag) {
            if (this.props.initOtherVideoDragByUserid && typeof this.props.initOtherVideoDragByUserid === "function") {
                this.props.initOtherVideoDragByUserid(id);
            }
        }
    };

    //给学生发送礼物
    sendGiftToStudent(userid) {
        let user = ServiceRoom.getTkRoom().getUsers()[userid]; //根据userid获取用户信息
        if(user && CoreController.handler.getAppPermissions('giveAloneUserSendGift')) {
            let userIdJson = {};
            if(user.role === TkConstant.role.roleStudent) { //如果是学生，则发送礼物
                let userId = user.id;
                let userNickname = user.nickname;
                userIdJson[userId] = userNickname;
                WebAjaxInterface.sendGift(userIdJson);
            }
        }
    };
    /*根据是否正在拖拽显示或隐藏ppt上的浮层*/
    layerIsShowOfIsDraging(isDragging, isVideoStretch, getItem) {
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

    handlerAreaExchange(){
        /*todo 区域交换这里需要修改，不能用延时*/
     /*   this.areaExchange = !this.areaExchange;
        eventObjectDefine.CoreController.dispatchEvent({//自己本地改变拖拽的video位置
            type:'areaExchange',
            message: {
                hasExchange: this.areaExchange,
            }
        });
        let defalutFontSize = TkGlobal.windowInnerWidth / TkConstant.STANDARDSIZE ;
        setTimeout(function(){
            eventObjectDefine.Window.dispatchEvent({ type:TkConstant.EVENTTYPE.WindowEvent.onResize , message:{defalutFontSize:defalutFontSize} });
        }, 20);*/
    }

    /*一键还原的函数*/
    handlerOneKeyReset(){
        eventObjectDefine.CoreController.dispatchEvent({//初始化视频框的位置（拖拽和分屏）
            type:'oneKeyRecovery',
            message: {}
        });
    }
    /*缩放后发送位置*/
    sendDragOfChangeVideoSize(id) {
        const defalutFontSize = TkGlobal.windowInnerWidth / TkConstant.STANDARDSIZE;
        let dragEle = document.getElementById(id); //拖拽的元素
        let dragEleW = dragEle.clientWidth;
        let dragEleH = dragEle.clientHeight;
        let content = document.getElementById('lc-full-vessel'); //白板拖拽区域
        let contentW = content.clientWidth;
        let contentH = content.clientHeight;
        /*计算位置百分比*/
        let dragEleLeft = (dragEle.offsetLeft - TkGlobal.dragRange.left*defalutFontSize)/(contentW - dragEleW);
        let dragEleTop = (dragEle.offsetTop - TkGlobal.dragRange.top*defalutFontSize)/(contentH - dragEleH);
        dragEleLeft = (isNaN(dragEleLeft) || dragEleLeft === Infinity || dragEleLeft === null)?0:dragEleLeft;
        dragEleTop = (isNaN(dragEleTop) || dragEleTop === Infinity || dragEleTop === null)?0:dragEleTop;
        let dragEleStyle = { //相对白板区位置的百分比
            percentTop: dragEleTop,
            percentLeft: dragEleLeft,
            isDrag: true,
        };
        eventObjectDefine.CoreController.dispatchEvent({ //自己本地和通知别人改变拖拽的video位置
            type: 'changeOtherVideoStyle',
            message: {data: {style: dragEleStyle, id: id}, initiative:true},
        });
    }

    /*鼠标在视频框上按下时*/
    mouseDown(event) {
        if(!CoreController.handler.getAppPermissions('isChangeVideoSize')) {
            return;
        }
        let {id, isDrag, percentLeft, percentTop, videoWidth, videoHeight} = this.props;
        if(isDrag) {
            const defalutFontSize = TkGlobal.windowInnerWidth / TkConstant.STANDARDSIZE;
            videoWidth = videoWidth*defalutFontSize;
            videoHeight = videoHeight*defalutFontSize;
            //获取视频框相对白板的位置：

            let {videoLeft,videoTop} = this._percentageChangeToRem(percentLeft,percentTop,videoWidth/defalutFontSize,videoHeight/defalutFontSize);
            //获取视频框相对body的位置：
            let videoLeftOfbody = (videoLeft + TkGlobal.dragRange.left) * defalutFontSize;
            let videoTopOfbody = (videoTop + TkGlobal.dragRange.top) * defalutFontSize;
            //获取鼠标相对body的位置：
            let mouseLeft = event.pageX;
            let mouseTop = event.pageY;
            //根据鼠标按下的位置判断是否可以拉伸：
            if((mouseLeft >= videoLeftOfbody + videoWidth - 7 && mouseLeft < videoLeftOfbody + videoWidth) && (mouseTop >= videoTopOfbody && mouseTop < videoTopOfbody + videoHeight - 7)) {
                TkGlobal.isVideoStretch = true; //是否是拉伸
            } else if((mouseTop >= videoTopOfbody + videoHeight - 7 && mouseTop < videoTopOfbody + videoHeight) && (mouseLeft >= videoLeftOfbody && mouseLeft < videoLeftOfbody + videoWidth - 7)) {
                TkGlobal.isVideoStretch = true; //是否是拉伸
            } else if((mouseTop < videoTopOfbody + videoHeight && mouseTop >= videoTopOfbody + videoHeight - 7) && (mouseLeft < videoLeftOfbody + videoWidth && mouseLeft >= videoLeftOfbody + videoWidth - 7)) {
                TkGlobal.isVideoStretch = true; //是否是拉伸
            }
        }
    };
    /*鼠标在白板区抬起时*/
    videoMouseUp(handleData) {
        let {id, isDrag} = this.props;
        if(isDrag) {
            let event = handleData.message.data.event;
            if(TkGlobal.isVideoStretch === true) {
                if (this.props.sendSignallingOfVideoSize && typeof this.props.sendSignallingOfVideoSize === "function") {
                    this.props.sendSignallingOfVideoSize();
                    this.sendDragOfChangeVideoSize(id);//缩放后发送位置
                }
                TkGlobal.isVideoStretch = false; //是否是拉伸
                this.layerIsShowOfIsDraging(false, TkGlobal.isVideoStretch);
                event.onmousemove = null;
                event.target.style.cursor = "";
                TkGlobal.changeVideoSizeEventName = null;
                TkGlobal.changeVideoSizeMouseUpEventName = null;
                this.setState({updateState:!this.state.updateState});
            }
        }
    };
    /*鼠标在白板区移动时*/
    videoChangeSize(handleData) {
        let event = handleData.message.data.event;
        let {id, isDrag, percentLeft, percentTop, videoWidth, videoHeight} = this.props;
        if(isDrag) {
            const defalutFontSize = TkGlobal.windowInnerWidth / TkConstant.STANDARDSIZE;
            //获取视频框相对body的位置：
            videoWidth = videoWidth * defalutFontSize;
            videoHeight = videoHeight * defalutFontSize;
            let {videoLeft, videoTop} = this._percentageChangeToRem(percentLeft, percentTop, videoWidth / defalutFontSize, videoHeight / defalutFontSize);
            let videoLeftOfbody = (videoLeft + TkGlobal.dragRange.left) * defalutFontSize;
            let videoTopOfbody = (videoTop + TkGlobal.dragRange.top) * defalutFontSize;
            //获取鼠标相对body的位置：
            let mouseLeft = event.pageX;
            let mouseTop = event.pageY;
            //改变鼠标的样式
            if (!TkGlobal.isVideoStretch) {
                if ((mouseLeft >= videoLeftOfbody + videoWidth - 7 && mouseLeft <= videoLeftOfbody + videoWidth) && (mouseTop >= videoTopOfbody && mouseTop < videoTopOfbody + videoHeight - 7)) {
                    event.target.style.cursor = "w-resize";
                    this.stretchDirection = 'w';
                } else if ((mouseTop >= videoTopOfbody + videoHeight - 7 && mouseTop <= videoTopOfbody + videoHeight) && (mouseLeft >= videoLeftOfbody && mouseLeft < videoLeftOfbody + videoWidth - 7)) {
                    event.target.style.cursor = "s-resize";
                    this.stretchDirection = 's';
                } else if ((mouseTop < videoTopOfbody + videoHeight && mouseTop >= videoTopOfbody + videoHeight - 7) && (mouseLeft < videoLeftOfbody + videoWidth && mouseLeft >= videoLeftOfbody + videoWidth - 7)) {
                    event.target.style.cursor = "se-resize";
                    this.stretchDirection = 'se';
                } else {
                    event.target.style.cursor = "";
                }
            } else {
                event.target.style.cursor = "";
            }

            //改变视频框的大小
            let newVideoWidth, newVideoHeight;
            if (TkGlobal.isVideoStretch && (this.stretchDirection === "w" || this.stretchDirection === "se")) {
                newVideoWidth = Math.abs(mouseLeft - videoLeftOfbody) / defalutFontSize;
                newVideoHeight = newVideoWidth * 3 / 4;
                if (mouseLeft < TkGlobal.dragRange.left * defalutFontSize || mouseLeft < videoLeftOfbody) {
                    let lcVideoContainer = document.getElementById('other_video_container');
                    let videoNum = TkConstant.template === 'template_sharktop'?7:6;
                    newVideoWidth = ((lcVideoContainer.clientWidth / defalutFontSize) / videoNum - 0.1);
                    newVideoHeight = newVideoWidth * 3 / 4;
                }
                if (this.props.changeVideoSize && typeof this.props.changeVideoSize === "function") {
                    this.props.changeVideoSize(newVideoWidth, newVideoHeight, id);
                }
            } else if (TkGlobal.isVideoStretch && this.stretchDirection === "s") {
                newVideoHeight = Math.abs(mouseTop - videoTopOfbody) / defalutFontSize;
                newVideoWidth = newVideoHeight * 4 / 3;
                if (mouseTop < TkGlobal.dragRange.top * defalutFontSize || mouseTop < videoTopOfbody) {
                    let lcVideoContainer = document.getElementById('other_video_container');
                    let videoNum = TkConstant.template === 'template_sharktop'?7:6;
                    newVideoWidth = ((lcVideoContainer.clientWidth / defalutFontSize) / videoNum - 0.1);
                    newVideoHeight = newVideoWidth * 3 / 4;
                }
                if (this.props.changeVideoSize && typeof this.props.changeVideoSize === "function") {
                    this.props.changeVideoSize(newVideoWidth, newVideoHeight, id);
                }
            }
        }
    }; 
    /*鼠标在视频框上移动时*/ 
    mouseMove() {
        if(!CoreController.handler.getAppPermissions('isChangeVideoSize')) {
            return;
        }
        let {id, isDrag} = this.props;
        if(TkGlobal.changeVideoSizeEventName !== id + "_mouseMove" && TkGlobal.changeVideoSizeMouseUpEventName !== id + "_mouseUp" && !TkGlobal.isVideoStretch && isDrag) {
            TkGlobal.changeVideoSizeEventName = id + "_mouseMove"; //以id作为改变视频大小事件的名字
            TkGlobal.changeVideoSizeMouseUpEventName = id + "_mouseUp";
        }
    }

    _getUser(userid){
		let user = undefined ;
		if(ServiceRoom.getTkRoom() ){
            user = ServiceRoom.getTkRoom().getUser(userid);
		}
		return user ;
	}

	_loadStreamInfo(stream){
		let user = undefined , afterElementArray = [];
		if(stream && stream.extensionId !== undefined &&  ServiceRoom.getTkRoom() ){
			user = this._getUser(stream.extensionId) ;
		}
		return{
			user ,
            afterElementArray ,
		}
	};

	_loadUserInfoIconArray(user){
        let userInfoIconArray = []  ;
        if( user.role === TkConstant.role.roleChairman){
	        return userInfoIconArray ;
        }
		let userInfoIconDesc = [
            {
                disabled: true,
                isShow: true,
                className: 'v-user-pen ' + (user.candraw ? 'on' : 'off'),
            },
            {
                disabled: true,
                isShow: user.hasaudio,
                className: 'v-device-microphone ' + ((user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH) ? 'on' : 'off') + ' ' + (user.disableaudio ? 'disableaudio' : ''),

            },
            {
                disabled: true,
                isShow: user.hasvideo,
                className: 'v-device-video ' + ((user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH) ? 'on' : 'off') + ' ' + (user.disablevideo ? 'disablevideo' : ''),
            }
        ];
        userInfoIconDesc.map( (item , index) => {
        	let { disabled , isShow , className } = item ;
        	if(isShow){
                userInfoIconArray.push(
					<button key={index} className={(className ||'') + ' ' + (disabled ? ' disabled ' : ' ')} disabled={disabled} />
				);
			}
		} );
		return userInfoIconArray ;
	}

    _loadActionButtonArray(user){
	    let actionButtonArray = []  ;
	    let actionButtonDesc = []  ;
        if(TkGlobal.playback){ //回放 不显示按钮
            return actionButtonArray ;
        }
	    let isMyself =  user.id === ServiceRoom.getTkRoom().getMySelf().id ;
	    let closeMyseftAV =  CoreController.handler.getAppPermissions('closeMyseftAV') ;
	    let controlOtherVideo =  CoreController.handler.getAppPermissions('controlOtherVideo') ;
        /*if( (!isMyself && !controlOtherVideo) || (isMyself && !closeMyseftAV) || (!isMyself && controlOtherVideo && user.role === TkConstant.role.roleChairman) ){
            return actionButtonArray ;
        }*/
        let loadActionBtn = {};
        if(!TkGlobal.classBegin){
            if(TkConstant.joinRoomInfo.isBeforeClassReleaseVideo){
                loadActionBtn = {
                    scrawl:false ,//画笔
                    platform:false,//上下台
                    audio:closeMyseftAV && isMyself,//音频
                    video:closeMyseftAV && isMyself,//视频
                    gift:false,//送礼物
                    restoreDrag:false,//恢复位置
                    areaExchange:false,//区域交换
                    oneKeyReset:false,//一键恢复
                };
            }else{//上课前且上课前不发布音视频，则不显示按钮
                return actionButtonArray ;
            }
        }else{
            if (TkConstant.hasRole.roleStudent) {
                loadActionBtn = {
                    scrawl:false ,//画笔
                    platform:false,//上下台
                    audio:closeMyseftAV && isMyself,//音频
                    video:closeMyseftAV && isMyself,//视频
                    gift:false,//送礼物
                    restoreDrag:CoreController.handler.getAppPermissions('isCanDragVideo')&&this.props.direction === 'horizontal',//恢复位置
                    areaExchange:false,//区域交换
                    oneKeyReset:false,//一键恢复
                };
            }else if (TkConstant.hasRole.roleChairman) {
                loadActionBtn = {
                    scrawl:!isMyself,
                    platform:!isMyself,
                    audio:true,
                    video:isMyself,
                    gift:!isMyself,
                    restoreDrag:CoreController.handler.getAppPermissions('isCanDragVideo')&&this.props.direction === 'horizontal',
                    areaExchange:false,
                    oneKeyReset:isMyself,
                };
            }else if (TkConstant.hasRole.roleTeachingAssistant) {
                loadActionBtn = {
                    scrawl:isMyself?false:user.role !== TkConstant.role.roleChairman ,
                    platform:isMyself?false:user.role !== TkConstant.role.roleChairman,
                    audio:isMyself?true:(user.role !== TkConstant.role.roleChairman),
                    video:isMyself,
                    gift:false,
                    restoreDrag:CoreController.handler.getAppPermissions('isCanDragVideo')&&this.props.direction === 'horizontal',
                    areaExchange:false,
                    oneKeyReset:false,
                };
            }else if (TkConstant.hasRole.rolePatrol) {
                loadActionBtn = {
                    scrawl:false ,
                    platform:false,
                    audio:false,
                    video:false,
                    gift:false,
                    restoreDrag:false,
                    areaExchange:false,
                    oneKeyReset:false,
                };
            }
        }

        let actionBtnJson = {
            scrawl: {
                disabled: false,
                languageKeyText: (user.candraw ? 'no' : 'yes'),
                className: 'scrawl-btn ' + (  (user.candraw )? 'no' : 'yes'),
                onClick: this.changeUserCandraw.bind(this, user.id),
                title: user.candraw ? TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.Scrawl.on.title : TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.Scrawl.off.title,
                isShow: isMyself ? false : (user.role === TkConstant.role.roleStudent), //不是学生则隐藏
            },
            platform: {
                disabled: false,
                languageKeyText: (user.publishstate !== TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE ? 'no' : 'yes'),
                className: 'platform-btn '+ (user.publishstate !== TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE ? 'no' : 'yes'),
                onClick: this.userPlatformUpOrDown.bind(this, user.id),
                title: user.publishstate !== TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE ? TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.update.up.title : TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.update.down.title,
                isShow: isMyself ? false : (user.role === TkConstant.role.roleStudent || user.role === TkConstant.role.roleTeachingAssistant )? true : !this.props.isDrag,//tkpc2.0.8
            },
            audio: {
                disabled: false,
                languageKeyText: (user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH) ? 'no' : 'yes',
                className: 'audio-btn ' + (  (user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH) ? 'no' : 'yes'),
                onClick: this.userAudioOpenOrClose.bind(this, user.id),
                title: user.disableaudio ? TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.audio.disabled.title : (
                    user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH ?
                        TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.audio.on.title : TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.audio.off.title
                ),
                isShow: user.hasaudio ,//tkpc2.0.8
            },
            video: {
                disabled: false,
                languageKeyText: (user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH) ? 'no' : 'yes',
                className: 'video-btn ' + (  (user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH) ?'no' : 'yes' ),
                onClick: this.userVideoOpenOrClose.bind(this, user.id),
                title: user.disablevideo ? TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.video.disabled.title : (
                    user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH ?
                        TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.video.on.title : TkGlobal.language.languageData.toolContainer.toolIcon.userList.button.video.off.title
                ),
                isShow: isMyself ? user.hasvideo  : false,//tkpc2.0.8
            },
            gift: {
                disabled: false,
                languageKeyText: 'yes',
                className: 'gift-btn',
                onClick: this.sendGiftToStudent.bind(this, user.id),
                title: TkGlobal.language.languageData.otherVideoContainer.button.gift.yes,
                isShow: isMyself ? false : (user.role === TkConstant.role.roleStudent && TkConstant.hasRole.roleChairman),
            },
            restoreDrag: {
                disabled: false,
                languageKeyText: 'text',
                className: 'restoreDrag-btn',
                onClick: this.restoreVideoDrag.bind(this, user.id),
                title: TkGlobal.language.languageData.otherVideoContainer.button.restoreDrag.text,
                isShow: (TkGlobal.isSplitScreen ? false : this.props.isDrag ),//tkpc2.0.8
            },
            areaExchange: {
                disabled: false,
                languageKeyText: 'text',
                className: 'areaExchange-btn',
                onClick: this.handlerAreaExchange.bind(this),
                title: undefined,
                isShow: false, //todo 区域交换先取消
            },
            oneKeyReset:{
                disabled: false,
                languageKeyText: 'text',
                className: 'oneKeyReset-btn',
                onClick: this.handlerOneKeyReset.bind(this),
                title: undefined,
                isShow: TkConstant.hasRole.roleChairman && isMyself && !TkConstant.isBaseboard && !TkConstant.hasRoomtype.oneToOne ,
            }
        };
        for( let key of Object.keys(actionBtnJson) ){
            if(loadActionBtn[key]){
                actionButtonDesc.push(actionBtnJson[key]);
            }
        }
        actionButtonDesc.map( (item , index) => {
            let { disabled , languageKeyText , className  , onClick , title , isShow } = item ;
            if(isShow){
                let buttonName = className.split("-");
                actionButtonArray.push(
                    <button key={index}
                            className={'' + (className || '') + ' ' + (disabled ? ' disabled ' : ' ')}
                            onClick={onClick && typeof onClick === "function" ? onClick : undefined}
                            disabled={disabled ? disabled : undefined}
                            style={{display:!isShow?'none':'block'}}  title={this.props.direction === 'horizontal'?TkGlobal.language.languageData.otherVideoContainer.button[buttonName[0]][languageKeyText]:undefined} >
                        {this.props.direction === 'horizontal'?undefined:TkGlobal.language.languageData.otherVideoContainer.button[buttonName[0]][languageKeyText]}
                    </button>
                );
            }
        } );
        return actionButtonArray ;
    }
    _percentageChangeToRem(percentLeft,percentTop,videoWidth,videoHeight) {
        let videoLeft = 0;
        let videoTop = 0;
        if(this.props.direction === 'horizontal'){
            let defalutFontSize = window.GLOBAL.windowInnerWidth / TkConstant.STANDARDSIZE ;
            //获取白板区域宽高：
            let boundsEle = document.getElementById('lc-full-vessel');
            let boundsEleW = boundsEle.clientWidth;
            let boundsEleH = boundsEle.clientHeight;
            //计算白板区工具相对白板的位置：
            videoLeft = percentLeft*(boundsEleW - videoWidth*defalutFontSize)/defalutFontSize;
            videoTop = percentTop*(boundsEleH - videoHeight*defalutFontSize)/defalutFontSize;
        }
        return {videoLeft,videoTop};
    }

	render() {
        let {connectDropTarget, connectDragSource, connectDragPreview, getItem, isDragging, percentLeft, percentTop, id, isDrag, isCanDrag,videoWidth,videoHeight, videoOnDoubleClick} = this.props;

        this.layerIsShowOfIsDraging(isDragging, TkGlobal.isVideoStretch, getItem);
		let {user={}} = this._loadStreamInfo(this.props.stream);
		let userInfoIconArray = [] ;
		let actionButtonArray = [] ;
		if( user && Object.keys(user).length > 0 ){
            userInfoIconArray = this._loadUserInfoIconArray(user);
            actionButtonArray = this._loadActionButtonArray(user);
		}
		let dragIsHide = this.props.hasDragJurisdiction ? !isCanDrag :false ;
        let thisVideoDragStyle = undefined ;
		if(this.props.direction === 'horizontal'){
            let {videoLeft,videoTop} = this._percentageChangeToRem(percentLeft,percentTop,videoWidth,videoHeight);
            if(TkGlobal.isSplitScreen || this.props.isDrag ){
                if(!this.maxWidthToActionContainer){
                    this.maxWidthToActionContainer = videoWidth+'rem' ;
                }
            }else{
                this.maxWidthToActionContainer = undefined ;
            }
            thisVideoDragStyle = {
                cursor: isCanDrag?"move":"default",
                top: videoTop+ TkGlobal.dragRange.top+'rem',
                left: videoLeft + TkGlobal.dragRange.left+'rem',
                margin:isDrag?0:undefined,
                position: isDrag ? 'fixed' : '',
                width: isDrag?videoWidth+'rem':'calc(100% / '+(TkConstant.template === 'template_sharktop'?7:6)+' - 0.1rem )',
                height:isDrag?videoHeight+'rem':undefined,
                zIndex: TkConstant.template === 'template_sharktop' ? (isDrag ?300:undefined) : (!isDrag?400:399)  ,
            };
        }
        return connectDropTarget(connectDragSource(
			<li id={id || user.id} onMouseMove={this.mouseMove.bind(this)} onMouseDown={this.mouseDown.bind(this)} className={"video-permission-container clear-float " + (this.props.videoDumbClassName+'-option-container ')+ (this.props.className || ' ') + ' ' +(this.props.pictureInPictureClassname || ' ')}   onDoubleClick={videoOnDoubleClick} style={ this.props.videoContainerStyle || thisVideoDragStyle}  >
				<div  className="video-wrap video-participant-wrap video-other-wrap add-position-relative"  id={user.id?'videoContainer_'+user.id:undefined} >
                    {this.props.stream?<VideoDumb  volume={ServiceRoom.getTkRoom()?ServiceRoom.getTkRoom().getMySelf().volume:100} stream={this.props.stream} videoDumbClassName={this.props.videoDumbClassName}   /> : undefined }
					<div className="v-name-wrap clear-float other-name " >
						<span className="v-name add-nowrap add-fl"  >{user.nickname}</span>
						<span className="v-device-open-close add-fr clear-float" >
                            {userInfoIconArray}
                        </span>
					</div>
					<div className="user-network-delay" style={{color:this.state.networkDelayColor,display:(TkGlobal.classBegin && this.props.stream !== undefined && this.state.hasNetworkState)?"inline-block":"none"}}>
						<span className="user-network-dot" style={{backgroundColor:this.state.networkDelayColor}} />
						<span className="user-network-delay-num">{this.state.networkDelay+'ms'}</span>
					</div>
					<div className="gift-show-container " style={{display:this.props.stream && user.role === TkConstant.role.roleStudent?undefined:'none'}}>
						<span className="gift-icon" />
						<span className="gift-num">{user.giftnumber || 0}</span>
					</div>
					<div className="video-hover-function-container" style={{display:dragIsHide?"none":(actionButtonArray.length===0?'none':undefined) , maxWidth:this.maxWidthToActionContainer}}>
                        <span className="button-set role-student" onDoubleClick={ (e) => { e.stopPropagation(); return false ; } }  >
                            {actionButtonArray}
                        </span>
					</div>
					<div className="background-mode-float" style={{display:(TkGlobal.classBegin || TkConstant.joinRoomInfo.isBeforeClassReleaseVideo) && user.isInBackGround ?"block":"none"}}>
						<p className="background-mode-prompt">{user.role===TkConstant.role.roleChairman?TkGlobal.language.languageData.otherVideoContainer.prompt.userText:TkGlobal.language.languageData.otherVideoContainer.prompt.text}</p>
					</div>
					<div className="video-participant-raise-btn add-position-absolute-top0-right0"  style={{display: user.raisehand?'block':'none'}}>
						<span className="raise-img" />
					</div>
                    <div className="foregroundpic-container" style={{display:TkConstant.hasRole.roleStudent && TkConstant.joinRoomInfo.foregroundpic && this.props.foregroundpicUrl && this.props.pictureInPictureClassname ? 'block':'none'  , backgroundImage:TkConstant.hasRole.roleStudent && TkConstant.joinRoomInfo.foregroundpic && this.props.foregroundpicUrl && this.props.pictureInPictureClassname?'url('+(this.props.foregroundpicUrl)+')':undefined  }} />
				</div>
			</li>
		))
	};
};
const HVideoComponentDragSource = DragSource('talkDrag', specSource, collect)(CommonVideoSmart);
export default DropTarget('talkDrag', specTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
}))(HVideoComponentDragSource);