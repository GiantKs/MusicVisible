/**
 * 右侧内容-全员操作功能 Smart组件
 * @module ControlOverallBarSmart
 * @description   承载右侧内容-全员操作的所有Smart组件
 * @author QiuShao
 * @date 2017/08/14
 */

'use strict';
import React from 'react';
import TkGlobal from 'TkGlobal' ;
import TkConstant from 'TkConstant' ;
import ServiceRoom from 'ServiceRoom' ;
import ServiceSignalling from 'ServiceSignalling' ;
import ServiceTools from 'ServiceTools' ;
import ServiceTooltip from 'ServiceTooltip' ;
import WebAjaxInterface from 'WebAjaxInterface' ;
import eventObjectDefine from 'eventObjectDefine';
import CoreController from 'CoreController';

class ControlOverallBarSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            show:{
                allGift:false ,
                allMute:false ,
                allCpature:false ,
                allTools:false,
            },
            allMuteDisabled:true ,
            smallCaptureDisabled:true ,
            allSpeakingDisabled:false,
            allCaptureDisabled:true ,
            disabledBlackBoard:false ,
            audioBoxIsShow:false,
            CaptureBoxIsShow:false,
            onClick:{
                allGift:this.sendGiftGiveAllUserClick.bind(this) ,
                allMute:this.allUserMuteClick.bind(this),
                allSpeaking:this.allSpeakingClick.bind(this),
            },
            teachExpansionColumnIsShow:false,
            iconNum:0,
            nameArr:[],
            answerShow:false,
            startAndStop: false,
            restarting:false,
            timeDescArray:[0,5,0,0],
            initArr:[{id:0,"name":"A","sel":false},{id:1,"name":"B","sel":false},{id:2,"name":"C","sel":false},{id:3,"name":"D","sel":false}],
			brr:[],
            crr:[],
            idA:[],
            idB:[],
            idC:[],
            idD:[],
            idE:[],
            idF:[],
            idG:[],
            idH:[],
            allNumbers:0,
            trueLV:0,
            allStudentChosseAnswer:{},
            tableObject:{},
            round:false,
            dialShow:false,
            responderShow:false,
            beginIsStatus:false,
            studentRes:false,
            timerShow:false,
	        userAdmin:"" ,
	        disabledAnswer:false,
	        disabledTurnplate:false,
	        disabledTimer:false,
	        disabledResponder:false,
	        isPublished:false,
            toolsShow:{
                destTopShare:false ,
                answer:false ,
                turnplate:false ,
                timer:false ,
                responder:false ,
                moreBlackboard:false ,
            }
        };
        this.listernerBackupid =  new Date().getTime()+'_'+Math.random();
        this.destTopShare = false;
    };
    componentDidMount() { //在完成首次渲染之后调用，此时仍可以修改组件的state
        const that = this ;
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomUserpropertyChanged ,that.handlerroomUserpropertyChanged.bind(that) , that.listernerBackupid ); //roomUserpropertyChanged事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamRemoved_video ,that.handlerStreamRemoved.bind(that) , that.listernerBackupid ); //streamRemoved事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamAdded_video ,that.handlerStreamAdded.bind(that) , that.listernerBackupid ); //streamAdded 事件
        //eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamFailed_video ,that.handlerStreamFailed.bind(that) , that.listernerBackupid ); //streamFailed 事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPubmsg ,that.handlerRoomPubmsg.bind(that) , that.listernerBackupid ); //roomPubmsg 事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDelmsg ,that.handlerRoomDelmsg.bind(that) , that.listernerBackupid ); //roomPubmsg 事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomConnected ,that.handlerRoomConnected.bind(that) , that.listernerBackupid ); //roomDisconnected 事件
        eventObjectDefine.CoreController.addEventListener("initAppPermissions" ,that.handlerInitAppPermissions.bind(that) , that.listernerBackupid ); //initAppPermissions：白板可画权限更新
        eventObjectDefine.CoreController.addEventListener('receive-msglist-BlackBoard' ,that.handlerReceive_msglist_BlackBoard.bind(that)  , that.listernerBackupid );
		eventObjectDefine.CoreController.addEventListener("receive-msglist-timer", that.handlerMsglistTimerShow.bind(that), that.listernerBackupid);
  	    eventObjectDefine.CoreController.addEventListener( "receive-msglist-dial" , that.handlerMsglistDialShow.bind(that), that.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener( "receive-msglist-answer" , that.handlerMsglistAnswerShow.bind(that), that.listernerBackupid);
		eventObjectDefine.CoreController.addEventListener( "receive-msglist-qiangDaQi" , that.handlerMsglistQiangDaQi.bind(that), that.listernerBackupid);
		eventObjectDefine.CoreController.addEventListener( "updateAppPermissions_isCapture" , that.handlerIsCaptureUpdate.bind(that), that.listernerBackupid);
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        const that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid);
    };
    handlerRoomConnected(recvEventData){ //房间连接成功后执行的操作
        this.setState({
            disabledBlackBoard:false,
            disabledAnswer:false,
            disabledTurnplate:false,
            disabledTimer:false,
            disabledResponder:false
        });
    };
    handlerReceive_msglist_BlackBoard(recvEventData){
        this.handlerRoomPubmsg(recvEventData);
        let pubmsgData = recvEventData.message;
        if(pubmsgData.name ===  'BlackBoard'){
            this.setState({
                disabledBlackBoard:true
            });
        }
    };
    handlerMsglistTimerShow(recvEventData){
    	for(let message of recvEventData.message.timerShowArr){
    		this.setState({
		            disabledTimer:true
		       });
    	}
    };
    handlerMsglistDialShow(recvEventData){
     	
     	for(let message of recvEventData.message.dialShowArr){
     		this.setState({
		            disabledTurnplate:true,
		       });
    	}
    };
    handlerMsglistAnswerShow(recvEventData){
    	for(let message of recvEventData.message.answerShowArr){
    		this.setState({
		            disabledAnswer:true,
		       });
    	}
    };
    handlerMsglistQiangDaQi(recvEventData){
    	for(let message of recvEventData.message.qiangDaQiArr){
    		this.setState({
		            disabledResponder:true,
		       });
    	}
    }
    handlerRoomPubmsg(recvEventData){
        let pubmsgData = recvEventData.message;
        switch (pubmsgData.name) {
            case "BlackBoard":
                this.setState({
                   disabledBlackBoard:true
                });
                break;
            case "answer":
                this.setState({
                   disabledAnswer:true
                });
                break;
            case "dial":
	            this.setState({
	               disabledTurnplate:true
	            });
	            break;
            case "timer":
	            this.setState({
	               disabledTimer:true
	            });
	            break;
	        case "qiangDaQi":
	            this.setState({
	               disabledResponder:true
	            });
	            break;    
        }
    };
    handlerRoomDelmsg(recvEventData){
        let delmsgData = recvEventData.message;
        switch (delmsgData.name) {
            case "BlackBoard":
                this.setState({
                    disabledBlackBoard:false
                });
                break;
            case "answer":
                this.setState({
                   disabledAnswer:false
                });
                break;
            case "dial":
	            this.setState({
	               disabledTurnplate:false
	            });
	            break;
            case "timer":
	            this.setState({
	               disabledTimer:false
	            });
	            break;
	        case "qiangDaQi":
	            this.setState({
	               disabledResponder:false
	            });
	            break;
	        case "ClassBegin":
                this.setState({
                    disabledBlackBoard:false ,
                    disabledAnswer:false,
                    disabledTurnplate:false,
                    disabledTimer:false,
                    disabledResponder:false
                });
        }
    };
    handlerroomUserpropertyChanged(roomUserpropertyChangedEventData){
        const that = this ;
        const changePropertyJson  = roomUserpropertyChangedEventData.message ;
        const user  = roomUserpropertyChangedEventData.user ;
        for( let key of Object.keys(changePropertyJson) ){
            if( key === 'publishstate' ){
                that._checkRoomIsAllParticipantMute();
            }
        }
    };
    handlerStreamRemoved(recvEventData){
        const that = this ;
        that._checkRoomIsAllParticipantMute();
    };
    handlerStreamAdded(recvEventData){
        const that = this ;
        that._checkRoomIsAllParticipantMute();
    };
    /*handlerStreamFailed(recvEventData){
        const that = this ;
        that._checkRoomIsAllParticipantMute();
    };*/
    handlerIsCaptureUpdate() {
        this.handlerInitAppPermissions();
    }
    handlerInitAppPermissions(){
        let toolsShow = {
            answer:true ,
            turnplate:true ,
            timer:true ,
            destTopShare: TkGlobal.isClient && TkGlobal.classBegin && CoreController.handler.getAppPermissions('destTopShareIsShow') ,
            responder:true ,
            moreBlackboard:true ,
        };
        Object.customAssign(this.state.toolsShow , toolsShow);
        this.state.show.allGift = CoreController.handler.getAppPermissions('giveAllUserSendGift') && ServiceRoom.getTkRoom().getRoomType() !== TkConstant.ROOMTYPE.oneToOne ;
        this.state.show.allMute = CoreController.handler.getAppPermissions('allUserMute') && ServiceRoom.getTkRoom().getRoomType() !== TkConstant.ROOMTYPE.oneToOne;
        this.state.show.allCpature = CoreController.handler.getAppPermissions('isCapture') && TkGlobal.isClient&&!TkGlobal.isMacClient;
        // this.state.show.allCpature = CoreController.handler.getAppPermissions('isCapture');
        this.state.show.allTools = CoreController.handler.getAppPermissions('allUserTools');
        this.setState({show:this.state.show , destTopShare:this.state.toolsShow});
    };

    /*全体静音*/
    allUserMuteClick(){
        if( CoreController.handler.getAppPermissions('allUserMute') ){
            let users = ServiceRoom.getTkRoom().getUsers();
            for(let user of Object.values(users) ){
                if(user.role !== TkConstant.role.roleChairman && user.role !== TkConstant.role.roleTeachingAssistant && user.publishstate !== TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE ){
                    if(user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY ){
                        ServiceSignalling.setParticipantPropertyToAll(user.id , {publishstate:TkConstant.PUBLISHSTATE.PUBLISH_STATE_MUTEALL} );
                    }else if( user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH){
                        ServiceSignalling.setParticipantPropertyToAll(user.id , {publishstate:TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY} );
                    }
                }
            }
        }
    };
    /*全体发言*/
    allSpeakingClick() {
        if( CoreController.handler.getAppPermissions('hasAllSpeaking') ){
            let users = ServiceRoom.getTkRoom().getUsers();
            for(let user of Object.values(users) ){
                if(user.role !== TkConstant.role.roleChairman && user.role !== TkConstant.role.roleTeachingAssistant && user.publishstate !== TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE ){
                    if(user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_MUTEALL){
                        ServiceSignalling.setParticipantPropertyToAll(user.id , {publishstate:TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY} );
                    }else if( user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY){
                        ServiceSignalling.setParticipantPropertyToAll(user.id , {publishstate:TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH} );
                    }
                }
            }
        }
    }
    /*截屏*/
    allCpatureClick(){
        eventObjectDefine.CoreController.dispatchEvent({
            type:'cpature' ,
            isture:false
        });
    }
    /*小截屏*/
    smallCpatureClick(){
        eventObjectDefine.CoreController.dispatchEvent({
            type:'cpature' ,
            isture:true
        });
    }
    /*全体发送礼物*/
    sendGiftGiveAllUserClick(){
        /*let message = {
            textBefore:TkGlobal.language.languageData.alertWin.messageWin.winMessageText.allGift.one ,
            textMiddle:TkGlobal.language.languageData.alertWin.messageWin.winMessageText.allGift.two  ,
            textAfter:TkGlobal.language.languageData.alertWin.messageWin.winMessageText.allGift.three ,
        };
        let allGiftMessage = <span>
                                <span className="add-fl" >{message.textBefore}</span>
                                <span className="gift-username add-nowrap add-fl"  style={{color:'#4468d0'}} >&nbsp;{message.textMiddle}&nbsp;</span>
                                <span className="add-fl">{message.textAfter}</span>
                            </span>;
        ServiceTooltip.showConfirm(allGiftMessage , function (answer) {
            if(answer){
                if( CoreController.handler.getAppPermissions('giveAllUserSendGift') ){
                    let userIdJson = {};
                    let users = ServiceRoom.getTkRoom().getUsers();
                    for (let user of Object.values(users)) {
                        if(user.role === TkConstant.role.roleStudent){ //如果是学生，则发送礼物
                            let userId = user.id;
                            let userNickname = user.nickname ;
                            userIdJson[userId] = userNickname ;
                        }
                    }
                    WebAjaxInterface.sendGift(userIdJson);
                }
            }
        });*/
        if( CoreController.handler.getAppPermissions('giveAllUserSendGift') ){
            let userIdJson = {};
            let users = ServiceRoom.getTkRoom().getUsers();
            for (let user of Object.values(users)) {
                if(user.role === TkConstant.role.roleStudent){ //如果是学生，则发送礼物
                    let userId = user.id;
                    let userNickname = user.nickname ;
                    userIdJson[userId] = userNickname ;
                }
            }
            WebAjaxInterface.sendGift(userIdJson);
        }
    };
    /*教学工具箱*/
    teachExpansionController(){
        this.state.teachExpansionColumnIsShow = !this.state.teachExpansionColumnIsShow;
        this.setState({teachExpansionColumnIsShow: this.state.teachExpansionColumnIsShow});
    };
    /*工具箱类别*/
    /*移除*/
    teachBoxLeftMouseOut(){
        this.state.teachExpansionColumnIsShow = false;
        this.setState({teachExpansionColumnIsShow: this.state.teachExpansionColumnIsShow});
    }
    _checkRoomIsAllParticipantMute(){
        const that = this ;
        let users = ServiceRoom.getTkRoom().getUsers() ;
        let muteUserSize = 0 ;
        let speakingUserSize = 0;
        for(let user of Object.values(users) ){
            if(user && user.role === TkConstant.role.roleStudent ){
                if (user.publishstate == TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY || user.publishstate == TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH) {//状态为1和3的时候
                    muteUserSize++ ;
                }else if(user.publishstate == TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY || user.publishstate == TkConstant.PUBLISHSTATE.PUBLISH_STATE_MUTEALL) {//状态为2和4的时候
                    speakingUserSize++;
                }
            }
        }
        let allMute = (muteUserSize === 0 )  ;
        let allSpeaking = (speakingUserSize === 0 )  ;
        if( that.state.allMuteDisabled !== allMute ){
            that.setState({allMuteDisabled: allMute });
        }
        if (that.state.allSpeakingDisabled !== allSpeaking) {
            that.setState({allSpeakingDisabled: allSpeaking});
        }
        return allMute ;
    };
    /*答题器组件的显示的控制*/
    answerAssemblyShowHandel(e){
    	this.state.answerShow=true;
    	this.setState({answerShow:this.state.answerShow})
    	let rounds = this.state.round;
        let optionalAnswer=this.state.initArr;
        let studentSels = this.state.brr;
        let trueLV= this.state.trueLV;
    	let allNumbers= this.state.allNumbers;
    	let dataChoose = this.state.allStudentChosseAnswer;
    	let idAS = this.state.idA;
		let idBS = this.state.idB;
		let idCS = this.state.idC;						
		let idDS = this.state.idD;
		let idES = this.state.idE;					
		let idFS = this.state.idF;				
		let idGS = this.state.idG;					
		let idHS = this.state.idH;
		let dataTable = this.state.tableObject;
		let isPublished = this.state.isPublished
        let quizTime=document.getElementById("result-teach-mytime").textContent;
        let newCrr=Array.from(new Set(this.state.crr));
        	newCrr=newCrr.sort();
    	let iconShow=this.state.answerShow;
    	let data = {
            optionalAnswers:optionalAnswer,
            quizTimes:quizTime,
            rightAnswers:newCrr,
            isRound:rounds,
            studentSelect:studentSels,
            trueLV:trueLV,
            allNumbers:allNumbers,
            dataChoose:dataChoose,
            dataTable:dataTable,
            isPublished:isPublished,
            idAS:idAS,
            idBS:idBS,
            idCS:idCS,
            idDS:idDS,
            idES:idES,
            idFS:idFS,
            idGS:idGS,
            idHS:idHS,
            isShow:iconShow
        };
        ServiceSignalling.sendSignallingAnswerToStudent(data);
        eventObjectDefine.CoreController.dispatchEvent({
                    type:'handleAnswerShow' ,
                    className:"answer-implement-bg",
                    isShow:iconShow,
               });
    }
    
    _screenSharing() {
        // ServiceTools.unpublishAllMediaStream(function(code,stream){
        //     let eid = ServiceRoom.getTkRoom().getMySelf().id + ":screen";
        //     let screenStream = TK.Stream({
        //         audio: true,
        //         video: true,
        //         screen: true,
        //         data: false,
        //         extensionId: eid,
        //         attributes: {type: 'screen'},
        //     },true);
        //     ServiceSignalling.publishDeskTopShareStream(screenStream);
        // });
        eventObjectDefine.CoreController.dispatchEvent({
            type: 'programmShare'
        });
    }

    /*转盘组件的显示的控制*/
    turntableAssemblyShowHandel(){
    	this.state.dialShow =true;
    	this.setState({dialShow:this.state.dialShow})
        let i=0;
        let iconShow=this.state.dialShow
    	let data={
                rotationAngle:'rotate('+ i * 900 +'deg)',
                isShow:iconShow
			};
		let isDelMsg = false;
    	ServiceSignalling.sendSignallingDialToStudent(data,isDelMsg);
    }
    /*倒计时组件的显示的控制*/
    timerAssemblyShowHandel(){
    	this.state.timerShow=true;
    	this.state.restarting=false;
    	this.setState({timerShow:this.state.timerShow,restarting:this.state.restarting})
    	let stopBtn= this.state.startAndStop;
    	let dataTimerArry= this.state.timeDescArray;
    	let iconShow=this.state.timerShow;
    	let isRestart = this.state.restarting;
		let data = {
				isStatus: stopBtn,
				sutdentTimerArry: dataTimerArry,
				isShow:iconShow,
				isRestart:isRestart
		};
		ServiceSignalling.sendSignallingTimerToStudent(data);
    	eventObjectDefine.CoreController.dispatchEvent({
                        type:'handleTurnShow' ,
                        className:"timer-implement-bg",
                        isShow:iconShow,
                   });
    }
    /*抢答器的显示的控制*/
	responderAssemblyShowHandel(){
		const that = this;
		that.state.responderShow = true;
		that.setState({
			responderShow: that.state.responderShow
		})
		let iconShow = that.state.responderShow;
		let begin = that.state.beginIsStatus;
		let userAdmin = this.state.userAdmin
		let data = {
			isShow: iconShow,
			begin: begin,
			userAdmin: userAdmin
		}
		let isDelMsg = false;
		ServiceSignalling.sendSignallingQiangDaQi(isDelMsg, data);
		eventObjectDefine.CoreController.dispatchEvent({
			type: 'responderShow',
			className: "responder-implement-bg",
			isShow: iconShow,
		});
	};
    getUser(){
        let userid = ServiceRoom.getTkRoom().getMySelf().id;
        let user = ServiceRoom.getTkRoom().getUsers()[userid];
        return user;
    }

    liveNoticeBoard(data){ //公告
        let that = this;
        let user = that.getUser();
        if (user.role === TkConstant.role.roleChairman) {
            ServiceSignalling.sendSignallingFromLiveNoticeBoard(data);
        }
    }

    liveNoticeInform(data){  //通知
        let that = this;
        let user = that.getUser();
        if (user.role === TkConstant.role.roleChairman) {
            ServiceSignalling.sendSignallingFromLiveNoticeInform(data);
        }
    }

    liveBroadcast(data){ //广播
        let that = this;
        let user = that.getUser();
        if (user.role === TkConstant.role.roleChairman) {
            ServiceSignalling.sendSignallingFromLiveBroadcast(data);
        }
    }

    /*
      Added by R37 on 171025 
    */

    // 广播按钮点击事件
    handlerOnBroadcastClick(){
        const self = this;

        ServiceTooltip.showInputTooltip({
            title: {
                text: TkGlobal.language.languageData.notice.publishBroadcast,
            },
            content: {
                type: 'edit-input',
                text: TkGlobal.language.languageData.notice.broadcast,
            },
            data: {}
        }, function(hasConfirm, data){
            if(hasConfirm && data)self.liveBroadcast(data);
        });
    }
    
    // 公告按钮点击事件
    handlerOnNoticeClick(){
        const self = this;
        
        ServiceTooltip.showInputTooltip({
            title: {
                text: TkGlobal.language.languageData.notice.publishNotice,
            },
            content: {
                type: 'edit-text-area',
                text: TkGlobal.language.languageData.notice.notice,
            },
            data: {}
        }, function(hasConfirm, data){
            if(hasConfirm && data)self.liveNoticeBoard(data);
        });
    }
     
    // 通知按钮点击事件
    handlerOnInformClick(){
        const self = this;

        ServiceTooltip.showInputTooltip({
            title: {
                text: TkGlobal.language.languageData.notice.publishInform,
            },
            content: {
                type: 'edit-input-db',
                text: TkGlobal.language.languageData.notice.inform,
            },
            data: {}
        }, function(hasConfirm, data){
            if(hasConfirm && data)self.liveNoticeInform(data);
        });
    }
    /**************************** R_add_terminus *********************/

    handleBlackBoardClick(){
        let isDelMsg = false , data = {
            blackBoardState:'_prepareing' ,  //_none:无 , _prepareing:准备中 , _dispenseed:分发 , _recycle:回收分发 , _againDispenseed:再次分发
            currentTapKey:'blackBoardCommon' ,
            currentTapPage:1 ,
        } ;
        ServiceSignalling.sendSignallingFromBlackBoard(data , isDelMsg);
    };
    /*静音和发言工具按钮的点击*/
    handleAudioBoxClick() {
        this.state.audioBoxIsShow = !this.state.audioBoxIsShow;
        this.setState({audioBoxIsShow:this.state.audioBoxIsShow});
    }
    /*鼠标离开静音和发言工具按钮*/
    handleAudioBoxMouseLeave() {
        this.state.audioBoxIsShow = false;
        this.setState({audioBoxIsShow:this.state.audioBoxIsShow});
    }
    handleCaptureClick() {
        this.state.CaptureBoxIsShow = !this.state.CaptureBoxIsShow;
        this.setState({CaptureBoxIsShow:this.state.CaptureBoxIsShow});
    }
    handleCaptureBoxMouseLeave() {
        this.state.CaptureBoxIsShow = false;
        this.setState({CaptureBoxIsShow:this.state.CaptureBoxIsShow});
    }
    render(){
        let that = this;
        let {pagingToolLeft} = this.props; // tkpc2.0.8
        let {show, allMuteDisabled, onClick, toolsShow, allSpeakingDisabled, audioBoxIsShow ,CaptureBoxIsShow,teachExpansionColumnIsShow,smallCaptureDisabled,allCaptureDisabled} = that.state ;
        let {allGift , allMute ,allCpature, allTools} = show ;
        let toolsNum =  0 ; //显示工具包的个数
        if (ServiceRoom.getTkRoom().getRoomType() === TkConstant.ROOMTYPE.oneToOne) { // tkpc2.0.8 包括 <li className={"responder-implement-bg..... style={[]}></li>
            toolsNum = toolsNum - 1;
        }
        for(let value of Object.values(toolsShow) ){
            if(value){
                toolsNum++;
            }
            if(toolsNum > 5){
                toolsNum = 5 ;
                break ;
            }
        }
        return (
            <ol className="all-participant-function add-fl clear-float  h-tool"  > {/*全员操作功能组件*/}
                <li className="tl-all-participant-gift" style={{display:!allGift?'none':''}}  >
                    <button className="header-tool "  title={TkGlobal.language.languageData.header.tool.allGift.title.yes}  onClick={onClick.allGift}  >
                        <span className="tool-img-wrap on "></span>
                    </button>
                </li>
                <li className="tl-all-participant-mute " style={{display:!allMute?'none':''}}  onMouseLeave={that.handleAudioBoxMouseLeave.bind(that)}>
                    <button className={"mute_or_speaking_btn "+(audioBoxIsShow?"active":"")} onClick={that.handleAudioBoxClick.bind(that)} >

                    </button>
                    <ul className="handle-audio-box" style={{display:audioBoxIsShow?"block":"none", width:pagingToolLeft<2.5 && typeof(pagingToolLeft)==="number"?"1rem":"auto",left:(pagingToolLeft<2.5 && typeof(pagingToolLeft)==="number"?"0.5rem":'-1rem')}} >{/*tkpc2.0.8*/}
                        <li id="all_mute_btn" className={"all_mute_btn " + (allMuteDisabled?'disabled':'')}  title={TkGlobal.language.languageData.header.tool.allMute.title.no}  disabled={allMuteDisabled}  onClick={!allMuteDisabled?onClick.allMute:undefined }  >
                            <button className="tool-img-wrap"></button>
                        </li>
                        <li id="all_speaking" className={"all_speaking " + (allSpeakingDisabled?'disabled':'')}  title={TkGlobal.language.languageData.header.tool.allMute.title.yes}  disabled={allSpeakingDisabled}  onClick={!allSpeakingDisabled?onClick.allSpeaking:undefined}  >
                            <button className="tool-img-wrap"></button>
                        </li>
                    </ul>
                </li>
                <li className="tl-all-participant-capture " style={{display:!allCpature?'none':''}}  onMouseLeave={that.handleCaptureBoxMouseLeave.bind(that)}>{/*截屏*/}
                    <button className={"allcapture_or_samllcapture_btn "+(CaptureBoxIsShow?"active":"")} title={TkGlobal.language.languageData.header.tool.capture.title.all} onClick={that.handleCaptureClick.bind(that)} >

                    </button>
                    <ul className="handle-capture-box" style={{display:CaptureBoxIsShow?"block":"none", width:pagingToolLeft<2.5 && typeof(pagingToolLeft)==="number"?"1rem":"auto",left:(pagingToolLeft<2.5 && typeof(pagingToolLeft)==="number"?"0.5rem":'-1rem')}} >{/*tkpc2.0.8*/}
                        <li id="small_capture_btn" className="small_capture_btn"  title={TkGlobal.language.languageData.header.tool.capture.title.small}  onClick={that.smallCpatureClick.bind(that)}>
                            <button className="tool-img-wrap"></button>
                        </li>
                        <li id="all_capture_btn" className="all_capture_btn"  title={TkGlobal.language.languageData.header.tool.capture.title.all}  onClick={that.allCpatureClick.bind(that)}>
                            <button className="tool-img-wrap"></button>
                        </li>
                    </ul>
                </li>
                <li className={"tl-all-participant-tools" + (teachExpansionColumnIsShow?' active':'')} id="tl-all-participant-tools-id" title={TkGlobal.language.languageData.toolCase.toolBox.text} onClick={this.teachExpansionController.bind(this)} onMouseLeave={this.teachBoxLeftMouseOut.bind(this)} style={{display:allTools?'block':'none'}}>
                    <div className={" teach-expansion-column "} style={{display:teachExpansionColumnIsShow?'block':'none' , width:'calc(100% * '+toolsNum+')',right:(pagingToolLeft<2.5 && typeof(pagingToolLeft)==="number"?'calc(-100% * '+toolsNum+')':'100%')}} >{/*tkpc2.0.8*/}
                        <ul className="teach-box-left clear-float"   ref="teachBoxLeftStyle">
                            <li className={"answer-implement-bg"+" " +(this.state.disabledAnswer?'disabled':'') } title={TkGlobal.language.languageData.answers.headerTopLeft.text} disabled={this.state.disabledAnswer} onClick={this.answerAssemblyShowHandel.bind(this)}  style={{display:!toolsShow.answer?'none':''}} ></li>
                            <li className={"turnplate-implement-bg"+" "+ (this.state.disabledTurnplate?'disabled':'') } title={TkGlobal.language.languageData.dial.turntable.text} disabled={this.state.disabledTurnplate} onClick={this.turntableAssemblyShowHandel.bind(this)} style={{display:!toolsShow.turnplate?'none':''}}  ></li>
                            <li className={"timer-implement-bg"+" "+ (this.state.disabledTimer?'disabled':'') } title={TkGlobal.language.languageData.timers.timerSetInterval.text} disabled={this.state.disabledTimer} onClick={this.timerAssemblyShowHandel.bind(this)} style={{display:!toolsShow.timer?'none':''}}  ></li>
                            <li className={"responder-implement-bg"+ " "+ (this.state.disabledResponder?'disabled':'') } title={TkGlobal.language.languageData.responder.responder.text} onClick={this.responderAssemblyShowHandel.bind(this)}  style={{display:toolsShow.responder && ServiceRoom.getTkRoom().getRoomType()!=TkConstant.ROOMTYPE.oneToOne?'':'none'}} ></li>
							<li className="tl-all-participant-sharing" title={TkGlobal.language.languageData.shares.shareSceen.text} id="whiteboard_tool_vessel_sharing" onClick={that._screenSharing.bind(that)} style={{display:toolsShow.destTopShare ?'':'none'}}></li>
							<li className={"tl-more-black-board "+ (this.state.disabledBlackBoard?'disabled':'') }  title={TkGlobal.language.languageData.header.tool.blackBoard.title.open} disabled={this.state.disabledBlackBoard} id="more_black_board"  style={{display:!toolsShow.moreBlackboard?'none':''}}  onClick={this.handleBlackBoardClick.bind(this)} ></li>
                            <li className="icon-base-style icon-broadcast" onClick={that.handlerOnBroadcastClick.bind(that)} title={TkGlobal.language.languageData.notice.broadcast} style={{display: TkGlobal.isBroadcast && TkGlobal.isClient && TkGlobal.classBegin ?'':'none'}}></li>
                            <li className="icon-base-style icon-notice" onClick={that.handlerOnNoticeClick.bind(that)} title={TkGlobal.language.languageData.notice.notice} style={{display: TkGlobal.isBroadcast && TkGlobal.isClient && TkGlobal.classBegin ?'':'none'}}></li>
                            <li className="icon-base-style icon-inform" onClick={that.handlerOnInformClick.bind(that)} title={TkGlobal.language.languageData.notice.inform} style={{display: TkGlobal.isBroadcast && TkGlobal.isClient && TkGlobal.classBegin ?'':'none'}}></li>
                        </ul>
                    </div>
                </li>
            </ol>
        )
    };

};
export default  ControlOverallBarSmart;

