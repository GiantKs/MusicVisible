/**
 * 右侧内容-教学工具箱 Smart组件
 * @module responderTeachingToolComponent
 * @description   抢答器组件
 * @author liujianhang
 * @date 2017/09/20
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

class ResponderTeachingToolSmart extends React.Component {
	constructor(props){
		super(props);
		this.state={
			responderIsShow:"none",
			closeImg:"none",
			restartImg:"none",
			startAngle: -(1 / 2 * Math.PI),
			tmpAngle:-(1 / 2 * Math.PI),
			answerText:TkGlobal.language.languageData.responder.begin.text,
			responderShow:false,
			beginIsStatus:false,
			studentRes:false,
			userAdmin:"",
			firstUser:false,
			userSort:{},
			userArry:[],
			teacherTimeOut:null,
			beginTimeOut:null,
			responderDrag:{
				pagingToolLeft:"",
				pagingToolTop:"",
			},
		};
		this.stop = undefined ;
		this.listernerBackupid =  new Date().getTime()+'_'+Math.random();
		this.mH = 300;
		this.mW =  300;
		this.r = this.mW / 2; //中间位置
		this.cR = this.r - 2 * 5; //圆半径
		this.endAngle = this.startAngle + 2 * Math.PI; //结束角度
		this.xAngle = 0.8* (Math.PI / 180); //偏移角度量
		this.fontSize = 35; //字号大小
		this.listernerBackupid =  new Date().getTime()+'_'+Math.random();
	};
	componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
		const that = this;
		eventObjectDefine.Window.addEventListener( TkConstant.EVENTTYPE.WindowEvent.onResize , this.handlerOnResize.bind(this) , this.listernerBackupid );
        eventObjectDefine.CoreController.addEventListener( 'resizeHandler' , this.handlerOnResize.bind(this) , this.listernerBackupid );
        eventObjectDefine.Document.addEventListener(TkConstant.EVENTTYPE.DocumentEvent.onFullscreenchange , that.handlerOnFullscreenchange.bind(that)   , that.listernerBackupid); //document.onFullscreenchange事件
        eventObjectDefine.CoreController.addEventListener( 'responderShow' , that.responderShow.bind(that) , that.listernerBackupid);
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
		switch (pubmsgData.name) {
                case "qiangDaQi":
                if(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant ||TkConstant.hasRole.rolePatrol){
                	that._teacherRecevedServiceQiangDaQiData(pubmsgData);
            }
            	break;
            case "QiangDaZhe":
            if(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant ||TkConstant.hasRole.rolePatrol){
            	that._teacherRecevedServiceQiangDaZheData(pubmsgData);
            }
            	break;
        }
    };
    handlerRoomDelmsg(recvEventData){
        const that = this;
        let pubmsgData = recvEventData.message;
        switch (pubmsgData.name) {
            case "ClassBegin":
                that.state.responderIsShow = "none";
				that.setState({responderIsShow:that.state.responderIsShow})
                break;
            case "qiangDaQi":
             if(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant ||TkConstant.hasRole.rolePatrol){
            	if(pubmsgData.data.isShow){
            		// that.state.responderIsShow = "none";
            		that.state.responderIsShow = "block";
                	clearTimeout(that.state.beginTimeOut); //tkpc2.0.8   添加一个清除定时器
			       	window.cancelAnimationFrame(that.stop);
                	that.state.beginIsStatus = false;  //tkpc2.0.8   添加一个
                	that.state.firstUser = false;
                	that.state.userSort={};
     				that.state.userArry=[];
					that.setState({
						teacherTimeOut: that.state.teacherTimeOut,
						responderIsShow: that.state.responderIsShow,
						beginIsStatus: that.state.beginIsStatus,
						firstUser:that.state.firstUser,
						userSort:that.state.userSort,
						userArry:that.state.userArry,
					})
            	}else{
            		that.state.responderIsShow = "none";
                	that.state.teacherTimeOut = "";
					that.setState({
						teacherTimeOut: that.state.teacherTimeOut,
						responderIsShow: that.state.responderIsShow
					})
            	}
            	break;
            	}
        }
    };
    handlerMsglistQiangDaQi(recvEventData){
    	const that = this;
    	for(let message of recvEventData.message.qiangDaQiArr){
    		 if(TkConstant.hasRole.roleChairman||TkConstant.hasRole.roleTeachingAssistant||TkConstant.hasRole.rolePatrol){
            	that._teacherRecevedServiceQiangDaQiData(message);
            }
    	}
    }
    handlerMsglistQiangDaZhe(recvEventData){
    	const that = this;
    	for(let message of recvEventData.message.QiangDaZheArr){
    		 if(TkConstant.hasRole.roleChairman||TkConstant.hasRole.roleTeachingAssistant||TkConstant.hasRole.rolePatrol){
            	that._teacherRecevedServiceQiangDaZheData(message);
            }
    	}
    };
    /*抢答题message-list*/
    _teacherRecevedServiceQiangDaQiData(recvEventData){
    	const that = this;
    	let serviceTimeData = TkGlobal.serviceTime / 1000 - recvEventData.ts;
    	if(recvEventData.data.isShow) {
			that.state.responderIsShow = "block";
			that.state.closeImg = "block";
       		that.state.restartImg = "none";
       		that.state.answerText = TkGlobal.language.languageData.responder.begin.text;
			let c = document.getElementById('myCanvas');
			c.style.display = "block";
			that.setState({
				responderIsShow: that.state.responderIsShow,
				closeImg:that.state.closeImg,
				restartImg:that.state.restartImg,
				answerText:that.state.answerText
			});
			clearTimeout(that.state.teacherTimeOut);
			if(recvEventData.data.begin) {
				if(serviceTimeData>=8){
					clearTimeout(that.state.teacherTimeOut);
					that.state.closeImg = "block";
					that.state.restartImg = "block";
					that.state.responderIsShow = "block";
					if(that.state.firstUser == false) {
						that.clearCanvasData(); //tkpc2.0.8   
						that.state.answerText = TkGlobal.language.languageData.responder.noContest.text;
						that.setState({
							answerText: that.state.answerText
						})
					} else {
						that.state.answerText = that.state.answerText;
						that.setState({
							answerText: that.state.answerText
						})
					}
					that.setState({
						answerText: that.state.answerText,
						closeImg: that.state.closeImg,
						restartImg: that.state.restartImg,
						responderIsShow: that.state.responderIsShow
					})
				}else{
					that.canvasDraw();
					that.state.closeImg = "none";
					that.state.beginIsStatus = recvEventData.data.begin;
					that.state.answerText = TkGlobal.language.languageData.responder.inAnswer.text;
					that.setState({
						beginIsStatus: that.state.beginIsStatus,
						closeImg: that.state.closeImg,
						answerText: that.state.answerText,
					})
					that.state.teacherTimeOut = setTimeout(function() {
						that.state.closeImg = "block";
						that.state.restartImg = "block";
						that.state.responderIsShow = "block";
						
						if(that.state.firstUser == false) {
                            that.clearCanvasData();
							that.state.answerText = TkGlobal.language.languageData.responder.noContest.text;
							that.setState({
								answerText: that.state.answerText
							})
						} else {
							that.state.answerText = that.state.answerText;
							that.setState({
								answerText: that.state.answerText
							})
						}
						that.setState({
							teacherTimeOut: that.state.teacherTimeOut,
							answerText: that.state.answerText,
							closeImg: that.state.closeImg,
							restartImg: that.state.restartImg,
							responderIsShow: that.state.responderIsShow,
							beginIsStatus: that.state.beginIsStatus,
						})
			
					}, 8000);
				}
			}
		}
    };
    /*抢答者的message-list*/
    _teacherRecevedServiceQiangDaZheData(recvEventData){
    	const that = this;
    	if(recvEventData.data.isClick){
            	clearTimeout(that.state.teacherTimeOut);
            	that.clearCanvasData();
            	that.state.closeImg="block";
		        that.state.restartImg="block";
            	that.state.userSort[recvEventData.fromID]={};
            	that.state.userSort[recvEventData.fromID][recvEventData.seq]=recvEventData.data.userAdmin;
            	that.setState({userSort:that.state.userSort});
            	that.state.userArry=[];
            	for(let item in that.state.userSort){
            		for(let i in that.state.userSort[item]){
            			that.state.userArry.push(i);
            			that.state.userArry= that.state.userArry.sort()
            			that.setState({userArry:that.state.userArry});
            			 if(that.state.userSort[item][that.state.userArry[0]]!=undefined){
            			 	that.state.answerText = that.state.userSort[item][that.state.userArry[0]];
            			 	that.setState({answerText:that.state.answerText,firstUser:that.state.firstUser});
            			 }
            		}
            	}
        		that.state.firstUser = true;
        		that.setState({firstUser:that.state.firstUser})
            	}else{
            		that.state.firstUser = false;
            		that.setState({firstUser:that.state.firstUser})
            	}
    };
    /*事件分发*/
    responderShow(data){
   		const that = this;
		if(data.className=="responder-implement-bg"){
			if(that.state.responderIsShow=="none"){
				let c = document.getElementById('myCanvas');
    			c.style.display="block";
				that.state.responderIsShow = "block";
				that.setState({responderIsShow:that.state.responderIsShow});
			}
		}
    };   
	//渲染函数
    canvasDraw(){
    	window.cancelAnimationFrame(this.stop);
    	let that=this;
    	that.c = document.getElementById('myCanvas');
        that.ctx = that.c.getContext('2d');
        that.c.width = 300;
        that.c.height = 300;
        that.ctx.clearRect(0,0,300,300);
        if(that.state.tmpAngle >= that.endAngle){
        	
          return;
        }else if(that.state.tmpAngle + that.xAngle > that.endAngle){
            that.state.tmpAngle = that.endAngle;
        }else{
            that.state.tmpAngle += that.xAngle;
        }
        that.ctx.clearRect(0, 0, that.mW, that.mH);
        //画圈
        that.ctx.beginPath();
        that.ctx.lineWidth = 9;
        that.ctx.strokeStyle = '#1e2b49';
        that.ctx.arc(that.r, that.r, that.cR, that.state.startAngle, that.state.tmpAngle);
        that.ctx.stroke();
        that.ctx.closePath();
        that.stop = requestAnimationFrame(that.canvasDraw.bind(that));
   };
    /*开始*/
    beginResponder(){
    	if(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant ){ //tkpc2.0.8   添加一个身份的识别
	    	if(this.state.beginIsStatus == false){
	            // CoreController.handler.setAppPermissions('sendSignallingFromResponderDrag' , true);
	            this.canvasDraw();
	            this.state.responderShow = true;
	            this.state.beginIsStatus = true;
	            clearTimeout(this.state.beginTimeOut);
	            this.state.beginTimeOut = setTimeout(() => {
	                this.state.closeImg = "block";
	                this.state.restartImg = "block";
	                this.setState({closeImg: this.state.closeImg, restartImg: this.state.restartImg})
	                if (this.state.firstUser == false) {
	                    this.state.answerText = TkGlobal.language.languageData.responder.noContest.text;
	                    this.setState({answerText: this.state.answerText})
	                }
	                let c = document.getElementById('myCanvas');
	                c.style.display = "none";
	            }, 8000);
	            let iconShow = this.state.responderShow;
	            let begin = this.state.beginIsStatus;
	            let userAdmin = this.state.userAdmin
	            let data = {
	                isShow: iconShow,
	                begin: begin,
	                userAdmin: userAdmin
	            };
	            let isDelMsg = false;
	            ServiceSignalling.sendSignallingQiangDaQi(isDelMsg, data);
	            this.state.answerText = TkGlobal.language.languageData.responder.inAnswer.text;
	            this.setState({answerText:this.state.answerText,responderShow:this.state.responderShow,beginTimeOut:this.state.beginTimeOut})
			}
    	}
    };
   	/*close*/
    closeResponder(){
    	if(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant ){ //tkpc2.0.8   添加一个身份的识别
    	const that = this;
    	let {id} = that.props;
        let {percentLeft,percentTop} = TkUtils.RemChangeToPercentage(4.4,0,id);
        eventObjectDefine.CoreController.dispatchEvent({
            type: 'changeDragEleTranstion',
            message: {data: {id, percentLeft, percentTop},isSendSignalling:true},
        });
    	let c = document.getElementById('myCanvas');
        c.style.display="none";
    	that.state.responderIsShow = "none";
    	that.state.beginIsStatus = false;
    	that.state.responderShow = false;
    	that.state.closeImg="none";
        that.state.restartImg="none";
        that.state.userSort={};
     	that.state.userArry=[];
        that.state.answerText = TkGlobal.language.languageData.responder.begin.text;
    	that.setState({
			closeImg: that.state.closeImg,
			restartImg: that.state.restartImg,
			answerText: that.state.answerText,
			responderIsShow: that.state.responderIsShow,
			beginIsStatus: that.state.beginIsStatus,
			responderShow: that.state.responderShow
		});
  		let data ={
			isShow:false
		}
  		let isDelMsg = true;
		ServiceSignalling.sendSignallingQiangDaQi(isDelMsg,data);
		that.clearCanvasData();
		}
    };
    /*restart*/
   	restartResponder(){
        // CoreController.handler.setAppPermissions('sendSignallingFromResponderDrag' , false);
        if(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant ){ //tkpc2.0.8   添加一个身份的识别
        	clearTimeout(this.state.beginTimeOut); //tkpc2.0.8   添加一个清除定时器
	   	    this.clearCanvasData();
	   	    let c = document.getElementById('myCanvas');
	        c.style.display="block";
		    this.state.closeImg="none";
	        this.state.restartImg="none";
	        this.state.answerText = TkGlobal.language.languageData.responder.begin.text;
	        this.state.beginIsStatus = false;
	        this.state.responderShow = true;
	        this.state.firstUser = false;
	        this.state.userSort={};
	     	this.state.userArry=[];
	        this.setState({
			 	firstUser: this.state.firstUser,
			 	responderShow: this.state.responderShow,
			 	beginIsStatus: this.state.beginIsStatus,
			 	userSort: this.state.userSort,
			 	userArry: this.state.userArry
			});
	        let iconShow = this.state.responderShow;
	        let begin = this.state.beginIsStatus;
	    	let userAdmin = this.state.userAdmin;
	        let data = {
	          	isShow:iconShow,
				begin:begin,
	            userAdmin:userAdmin
			};
	        let isDelMsg = true;
	        ServiceSignalling.sendSignallingQiangDaQi(isDelMsg,data);
	        	isDelMsg = false;
			ServiceSignalling.sendSignallingQiangDaQi(isDelMsg,data);
	        this.setState({beginIsStatus:this.state.beginIsStatus,startAngle:this.state.startAngle,tmpAngle:this.state.tmpAngle,closeImg:this.state.closeImg,restartImg:this.state.restartImg})
   	    }
    };
   	/*清除canvas画布数据*/
  	clearCanvasData(){
  		let c = document.getElementById('myCanvas');
	  	let ctx = c.getContext('2d');
	  	let mW = c.width = 300;
	  	let mH = c.height = 300;
   		ctx.clearRect(0, 0, mW, mH);
   		window.cancelAnimationFrame(this.stop);
   		this.state.startAngle = -(1 / 2 * Math.PI); //开始角度
	    this.endAngle = this.state.startAngle + 2 * Math.PI; //结束角度
	    this.xAngle = 0.8* (Math.PI / 180); //偏移角度量
	    this.fontSize = 35; //字号大小
	    this.state.tmpAngle = this.state.startAngle; //临时角度变量
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
		let responderDragStyle = {
			width:'1.805rem',
			height:'1.805rem',
			// transition: 'all 0.5s',
            transitionProperty:'left,top',
            transitionDuration:'0.4s',
			cursor:"move",
			position:'absolute',
			left:(isDrag?pagingToolLeft:"4.4")+"rem",
			top:(isDrag?pagingToolTop:"0")+"rem",
			zIndex:110,
            display:this.state.responderIsShow,
		};
		return connectDragSource(
			<div id={id} className="responder-circle" style={responderDragStyle}>
				<canvas id="myCanvas">{TkGlobal.language.languageData.responder.update.text}</canvas>
				<div className="myCanvas-bg-div"></div>
				<div className="responder-black-circle"></div>
				<div className={"responder-begin-circle"+" "+(this.state.beginIsStatus?'disabled':'')} onClick={this.beginResponder.bind(this)}>
					{this.state.answerText}
				</div>
				<div className="responder-close-img" onClick={this.closeResponder.bind(this)} style={{display:this.state.closeImg}}>{TkGlobal.language.languageData.responder.close.text}</div>
				<div className="responder-restart-img" onClick={this.restartResponder.bind(this)} style={{display:this.state.restartImg}}>{TkGlobal.language.languageData.responder.restart.text}</div>
			</div>
		)
	}
}

export default DragSource('talkDrag', specSource, collect)(ResponderTeachingToolSmart);