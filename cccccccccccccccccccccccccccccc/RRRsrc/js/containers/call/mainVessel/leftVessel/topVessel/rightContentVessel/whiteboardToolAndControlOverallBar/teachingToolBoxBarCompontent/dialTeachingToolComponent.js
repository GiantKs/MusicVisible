/**
 * 右侧内容-教学工具箱 Smart组件
 * @module dialTeachingToolComponent
 * @description   转盘组件
 * @author liujianhang
 * @date 2017/09/20
 */
'use strict';
import React from 'react';
import TkGlobal from 'TkGlobal' ;
import TkConstant from 'TkConstant' ;
import eventObjectDefine from 'eventObjectDefine';
import ServiceSignalling from 'ServiceSignalling' ;
import TkUtils from 'TkUtils';

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

class DialTeachingToolSmart extends React.Component {
	constructor(props){
		super(props);
		this.state={
            dialTeachComponentBgDisplay:"none",
            dialIconClose:false,
            turnTableDeg:'rotate(0)',
			dialShow:false,
			deg:50, // tkpc2.0.8
			numdeg:0,
			num:0,
			isClick:false,
            dialDrag:{
                pagingToolLeft:"",
                pagingToolTop:"",
            },
            msgDeg:false
		};
		this.isHasTransition = false,
		this.listernerBackupid =  new Date().getTime()+'_'+Math.random();

	};
	componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
    	const that = this ;
        eventObjectDefine.Window.addEventListener( TkConstant.EVENTTYPE.WindowEvent.onResize , this.handlerOnResize.bind(this) , this.listernerBackupid );
        eventObjectDefine.CoreController.addEventListener( 'resizeHandler' , this.handlerOnResize.bind(this) , this.listernerBackupid );
        eventObjectDefine.Document.addEventListener(TkConstant.EVENTTYPE.DocumentEvent.onFullscreenchange , that.handlerOnFullscreenchange.bind(that)   , that.listernerBackupid); //document.onFullscreenchange事件
        // 	eventObjectDefine.CoreController.addEventListener("initAppPermissions", that.handlerInitAppPermissions.bind(that), that.listernerBackupid);
		eventObjectDefine.CoreController.addEventListener( "receive-msglist-dial" , that.handlerMsglistDialShow.bind(that), that.listernerBackupid);
      //	eventObjectDefine.CoreController.addEventListener(rename.EVENTTYPE.RoomEvent.roomParticipantJoin, that.handlerRoomParticipantJoin.bind(that) , that.listernerBackupid); //监听用户加入
    //	eventObjectDefine.CoreController.addEventListener(rename.EVENTTYPE.RoomEvent.roomParticipantLeave, that.handlerRoomParticipantLeave.bind(that) , that.listernerBackupid); //监听用户离开
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPubmsg , that.handlerRoomPubmsg.bind(that), that.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that), that.listernerBackupid); //roomDelmsg事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomUserpropertyChanged ,that.handlerroomUserpropertyChanged.bind(that) , that.listernerBackupid ); //roomUserpropertyChanged事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPlaybackClearAllFromPlaybackController,that.handlerRoomPlaybackClearAll.bind(that) , that.listernerBackupid); //roomPlaybackClearAll 事件：回放清除所有信令
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
	componentDidUpdate() {//每次render结束后会触发,每次转过之后去除过度效果
		if (this.isHasTransition == true) {
			this.isHasTransition = false;
		}
	};
	handlerroomUserpropertyChanged(roomUserpropertyChangedEventData){
        const that = this ;
        const changePropertyJson  = roomUserpropertyChangedEventData.message ;
        const user  = roomUserpropertyChangedEventData.user ;
        for( let key of Object.keys(changePropertyJson) ){
            if( key === 'publishstate' ){
//	                that.goStageUsers();!!!!
            }
        }
	};
    handlerMsglistDialShow(recvEventData){
        const that = this;
        this.state.msgDeg = true;
        this.setState({msgDeg:this.state.msgDeg})
        for(let message of recvEventData.message.dialShowArr){
            if(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant||TkConstant.hasRole.rolePatrol){ 
		        if (message.data.isShow) {
		            that.state.turnTableDeg = 'rotate(0)';
		            that.state.dialTeachComponentBgDisplay = "block";
		            that.state.dialIconClose = true;
		            that.setState({
		                dialTeachComponentBgDisplay: that.state.dialTeachComponentBgDisplay,
		                turnTableDeg: that.state.turnTableDeg,
		                dialIconClose: that.state.dialIconClose
		            });
		        }
		        else {
		            that.state.dialTeachComponentBgDisplay = "block";
		            that.state.turnTableDeg = message.data.rotationAngle;
		            that.state.dialIconClose = true; //tkpc2.0.8
		            that.setState({
		                dialTeachComponentBgDisplay: that.state.dialTeachComponentBgDisplay,
		                turnTableDeg: that.state.turnTableDeg,
		                dialIconClose: that.state.dialIconClose,
		                isClick: that.state.isClick,
		            });
		        }
		    }else{
		    	if (message.data.isShow) {
		            that.state.turnTableDeg = 'rotate(0)';
		            that.state.dialIconClose = false;
		            that.state.dialTeachComponentBgDisplay = "block";
		            that.setState({
		                dialTeachComponentBgDisplay: that.state.dialTeachComponentBgDisplay,
		                turnTableDeg: that.state.turnTableDeg,
		                dialIconClose: that.state.dialIconClose
		            });
		        }
		        else {
		            that.state.dialTeachComponentBgDisplay = "block";
		            that.state.turnTableDeg = message.data.rotationAngle;
		            that.state.dialIconClose = false;
		            that.setState({
		                dialTeachComponentBgDisplay: that.state.dialTeachComponentBgDisplay,
		                turnTableDeg: that.state.turnTableDeg,
		                dialIconClose: that.state.dialIconClose
		            });
		        }
		    }
        }
    };
    handlerRoomPubmsg(recvEventData){
        const that = this;
        let pubmsgData = recvEventData.message;
        switch (pubmsgData.name) {
            case "dial":
                that.handlerDisplayTeachTool(pubmsgData);
            	break;
        }
    }
    handlerRoomDelmsg(recvEventData){
        const that = this;
        let pubmsgData = recvEventData.message;
        switch (pubmsgData.name) {
            case "dial":
                that.state.dialTeachComponentBgDisplay = "none";
                that.state.num = 0;
				that.state.numdeg = 0;
				that.state.deg = 50; // tkpc2.0.8
                that.setState({
                    dialTeachComponentBgDisplay: that.state.dialTeachComponentBgDisplay,
                    num:that.state.num,
	                numdeg:that.state.numdeg,
	                deg:that.state.deg
                });
                break;
            case "ClassBegin":
                that.state.dialTeachComponentBgDisplay = "none";
                that.setState({
                    dialTeachComponentBgDisplay: that.state.dialTeachComponentBgDisplay
                });
                break;
        }
    }
	handlerDisplayTeachTool(recvEventData){
        const that = this;
		that.isHasTransition = true;
        if(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant||TkConstant.hasRole.rolePatrol){ 
	        if (recvEventData.data.isShow) {
	            that.state.turnTableDeg = 'rotate(0)';
	            that.state.dialTeachComponentBgDisplay = "block";
	            that.state.dialIconClose = true;
	            that.setState({
	                dialTeachComponentBgDisplay: that.state.dialTeachComponentBgDisplay,
	                turnTableDeg: that.state.turnTableDeg,
	                dialIconClose: that.state.dialIconClose
	            });
	        }
	        else {
	            that.state.dialTeachComponentBgDisplay = "block";
	            that.state.turnTableDeg = recvEventData.data.rotationAngle;
	            that.state.dialIconClose = false;
	            that.state.msgDeg = false;
	            that.setState({
	                dialTeachComponentBgDisplay: that.state.dialTeachComponentBgDisplay,
	                turnTableDeg: that.state.turnTableDeg,
	                dialIconClose: that.state.dialIconClose,
	                isClick: that.state.isClick,
	                msgDeg:that.state.msgDeg
	            });
	            setTimeout(function () {
	                that.state.dialIconClose = true;
	                that.state.isClick = false;
	                that.setState({
	                    dialIconClose: that.state.dialIconClose,
	                    isClick:that.state.isClick,
	                });
	            }, 4000);
	        }
	    }else{
	    	if (recvEventData.data.isShow) {
	            that.state.turnTableDeg = 'rotate(0)';
	            that.state.dialIconClose = false;
	            that.state.dialTeachComponentBgDisplay = "block";
	            that.setState({
	                dialTeachComponentBgDisplay: that.state.dialTeachComponentBgDisplay,
	                turnTableDeg: that.state.turnTableDeg,
	                dialIconClose: that.state.dialIconClose
	            });
	        }
	        else {
	            that.state.dialTeachComponentBgDisplay = "block";
	            that.state.turnTableDeg = recvEventData.data.rotationAngle;
	            that.state.dialIconClose = false;
	            that.setState({
	                dialTeachComponentBgDisplay: that.state.dialTeachComponentBgDisplay,
	                turnTableDeg: that.state.turnTableDeg,
	                dialIconClose: that.state.dialIconClose
	            });
	        }
	    }
	};

	
	handlerRoomPlaybackClearAll(){
	    if(!TkGlobal.playback){L.Logger.error('No playback environment, no execution event[roomPlaybackClearAll] handler ') ;return ;};
	    const that = this ;
	    that.setState({
	        dialTeachComponentBgDisplay:"none",
	        dialIconClose:false,
	        turnTableDeg:'rotate(0)',
	        dialShow:false
	    });
	    this.isHasTransition = false;
	};

	/*指针的点击函数*/
	opointer(e){
		if (TkConstant.hasRole.roleStudent || this.state.isClick ) {
			return false;
		}
		if(this.state.msgDeg){
			this.state.turnTableDeg = 'rotate(0)';
		}
		this.state.msgDeg = false;
		this.state.isClick = true;
		this.state.dialShow =false;
	 	let index = Math.floor(Math.random() * 5+1); //得到0-7随机数
        this.state.num = index + this.state.num; //得到本次位置
        this.state.numdeg += index * this.state.deg + Math.floor(Math.random() * 2 + 2) * 360 ;
        if(this.state.numdeg.toString().substr(-2)==90 || this.state.numdeg.toString().substr(-2)==30 || this.state.numdeg.toString().substr(-2)==10 || this.state.numdeg.toString().substr(-2)==50 || this.state.numdeg.toString().substr(-2)==70){ // tkpc2.0.8
       		this.state.numdeg=this.state.numdeg+30
       	}; // tkpc2.0.8
        this.setState({
			dialShow: this.state.dialShow,
			num:this.state.num,
			numdeg:this.state.numdeg,
			deg:this.state.deg,
			isClick:this.state.isClick,
			turnTableDeg:this.state.turnTableDeg,
			msgDeg:this.state.msgDeg
        });
		let iconShow=this.state.dialShow
    	let data={
                rotationAngle:'rotate('+ this.state.numdeg +'deg)',
                isShow:iconShow

				};
			ServiceSignalling.sendSignallingDialToStudent(data);
			const that = this;
			setTimeout(function(){
				that.state.isClick = false;
				 that.setState({isClick:that.state.isClick});
			},4000)
		};
		/*关闭指针*/
		dialClosePHandle(){
			// ReactDOM.findDOMNode(this.refs.turnTable).style.transform=0 ;
			this.isHasTransition = true;
			this.state.num = 0;
			this.state.numdeg = 0;
			this.state.deg = 50; // tkpc2.0.8
            this.state.turnTableDeg = 'rotate(0)';
			this.state.dialTeachComponentBgDisplay='none';
			this.setState({
				dialTeachComponentBgDisplay:this.state.dialTeachComponentBgDisplay,
                turnTableDeg: this.state.turnTableDeg,
                num:this.state.num,
                numdeg:this.state.numdeg,
                deg:this.state.deg
			});
			let data={
                dialClose:'none'
            };
			let isDelMsg=true;
        	ServiceSignalling.sendSignallingDialToStudent(data , isDelMsg);
			this.state.studentNameArr=[];
			this.setState({studentNameArr:this.state.studentNameArr});
            //初始化拖拽元素的位置
			let {id} = this.props;
            const defalutFontSize = TkGlobal.windowInnerWidth / TkConstant.STANDARDSIZE ;
            let dragEle = document.getElementById(id);//拖拽的元素
            let dragEleW = dragEle.clientWidth;
            let content = document.getElementById('lc-full-vessel');//白板拖拽区域
            let contentW = content.clientWidth;
            let percentLeft = ((4.4 - 0.5)*defalutFontSize)/(contentW - dragEleW);
            let percentTop = 0;
            eventObjectDefine.CoreController.dispatchEvent({type:'initDragEleTranstion', message:{data:{id,percentLeft,percentTop},isSendSignalling:true},});
		}
		render(){
		    let that = this;
			let {studentNameArr} = this.state ;
            const {getItem,connectDragSource,isDragging,isCanDrag,percentLeft,percentTop,id,isDrag} = this.props;
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
            let dialDragStyle = {
                position:'absolute',
                zIndex:110,
                display:this.state.dialTeachComponentBgDisplay,
                width:TkConstant.hasRole.roleStudent?'4rem':'4.4rem',
                height:TkConstant.hasRole.roleStudent?'4rem':'4.7rem',
                transition: 'all 0.4s',
                cursor:"move",
                left:(isDrag?pagingToolLeft:"4.4")+"rem",
                top:(isDrag?pagingToolTop:"0")+"rem",
            };

			return connectDragSource(
				<div id="dialDrag" style={dialDragStyle}>
					 <div className="dial-teachComponent-bg" ref="dialTeachComponentBg"  style={{display:this.state.dialTeachComponentBgDisplay,top:TkConstant.hasRole.roleStudent?'0':'0.7rem'}}>
						 <button alt="pointer" style={{backgroundColor:this.state.a}} className="dial-teachComponent-pointer-button" onClick={this.opointer.bind(this)} ></button>
                         <div className="dial-teachComponent-turntable" ref='turnTable' style={{transition: this.isHasTransition?'transform 4s ease':undefined,transform:(!isCanDrag && getItem.id === "dialDrag")?'rotate(0deg)':this.state.turnTableDeg}}>
                         </div>
						 {/*<div style={{height:'100%',zIndex:121}}></div>*/}
						 <div className="dialCloseP" onClick={this.dialClosePHandle.bind(this)} style={{display:this.state.dialIconClose?"block":"none"}}></div>
					 </div>
                </div>
			)
		}
	}

export default DragSource('talkDrag', specSource, collect)(DialTeachingToolSmart);