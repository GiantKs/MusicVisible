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
                allTools:false,   
            },
            allMuteDisabled:true ,
            allSpeakingDisabled:true ,
            disabledBlackBoard:false ,
            audioBoxIsShow:false,
            onClick:{
                allGift:this.sendGiftGiveAllUserClick.bind(this) ,
                allMute:this.allUserMuteClick.bind(this),
                allSpeaking:this.allSpeakingClick.bind(this),
            },
            teachExpansionColumnDisplay:null,
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
            disabledSharing:false,
            disabledSign:false,
            disabledLuckdraw:false,
            disabledVote:false,
	        isPublished:false,
            toolsShow:{
                destTopShare:false ,
                answer:false ,
                turnplate:false ,
                timer:false ,
                responder:false ,
                moreBlackboard:false ,
            },
            voteShow: false,
        };
        this.listernerBackupid =  new Date().getTime()+'_'+Math.random();
        this.destTopShare = false;

        this.isShowBroadcast = false;   //广播
        this.isShowNotice = false;     //公告
        this.isShowInform = false;      //通知
        this.isShowSharing = false;     //共享
        this.isShowSign = false;    //点名
        this.isShowVote = false;    //投票
        this.isShowLuckdraw = false;    //抽奖
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
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamRemoved_screen, that.handlerStreamRemovedScreen.bind(that) , that.listernerBackupid);//
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomMsglist, that.handlerRoomMsgList.bind(that), that.listernerBackupid);//开始后进入
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPlaybackClearAllFromPlaybackController,that.handlerRoomPlaybackClearAll.bind(that) , that.listernerBackupid); //roomPlaybackClearAll 事件：回放清除所有信令


        eventObjectDefine.CoreController.addEventListener("initAppPermissions" ,that.handlerInitAppPermissions.bind(that) , that.listernerBackupid ); //initAppPermissions：白板可画权限更新
        eventObjectDefine.CoreController.addEventListener('receive-msglist-BlackBoard' ,that.handlerReceive_msglist_BlackBoard.bind(that)  , that.listernerBackupid );
		eventObjectDefine.CoreController.addEventListener("receive-msglist-timer", that.handlerMsglistTimerShow.bind(that), that.listernerBackupid);
  	    eventObjectDefine.CoreController.addEventListener( "receive-msglist-dial" , that.handlerMsglistDialShow.bind(that), that.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener( "receive-msglist-answer" , that.handlerMsglistAnswerShow.bind(that), that.listernerBackupid);
		eventObjectDefine.CoreController.addEventListener( "receive-msglist-qiangDaQi" , that.handlerMsglistQiangDaQi.bind(that), that.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener( "receive-msglist-liveLuckDraw" , that.handlerMsglistLiveLuckDraw.bind(that), that.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener( "receive-msglist-liveVote" , that.handlerMsglistLiveVote.bind(that), that.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener( "receive-msglist-liveCallRoll" , that.handlerMsglistLiveCallRoll.bind(that), that.listernerBackupid);
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
            disabledResponder:false,
            disabledSharing:false,
            disabledSign:false,
            disabledLuckdraw:false,
            disabledVote:false,
            

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

    handlerRoomPlaybackClearAll(){
        this.setState({
            show:{
                allGift:false ,
                allMute:false ,
                allTools:false,   
            },
            allMuteDisabled:true ,
            allSpeakingDisabled:true ,
            disabledBlackBoard:false ,
            audioBoxIsShow:false,
            onClick:{
                allGift:this.sendGiftGiveAllUserClick.bind(this) ,
                allMute:this.allUserMuteClick.bind(this),
                allSpeaking:this.allSpeakingClick.bind(this),
            },
            teachExpansionColumnDisplay:null,
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
            disabledSharing:false,
            disabledSign:false,
            disabledLuckdraw:false,
            disabledVote:false,
	        isPublished:false,
            toolsShow:{
                destTopShare:false ,
                answer:false ,
                turnplate:false ,
                timer:false ,
                responder:false ,
                moreBlackboard:false ,
            },
            voteShow: false,
        });
        this.listernerBackupid =  new Date().getTime()+'_'+Math.random();
        this.destTopShare = false;

        this.isShowBroadcast = false;   //广播
        this.isShowNotice = false;     //公告
        this.isShowInform = false;      //通知
        this.isShowSharing = false;     //共享
        this.isShowSign = false;    //点名
        this.isShowVote = false;    //投票
        this.isShowLuckdraw = false;    //抽奖
    }


    handlerRoomPubmsg(recvEventData){
        let pubmsgData = recvEventData.message;
        let mySelf = ServiceRoom.getTkRoom().getMySelf();
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
            case "LiveLuckDraw":
                // 抽奖
                if( mySelf.id === pubmsgData.data.fromUser.id ){
                    // this.setState({
                    //     disabledLuckdraw:false
                    // });
                }else{
                    this.setState({
                        disabledLuckdraw:true
                    });
                }
                // if(pubmsgData.data.state === 1){
                //     this.setState({
                //         disabledLuckdraw:true
                //     });
                // }
                // else if(pubmsgData.data.state === 0){
                //     this.setState({
                //         disabledLuckdraw:false
                //     });
                // }
                break;
            case "LiveVote":
                //投票
                if( mySelf.id === pubmsgData.data.fromUser.id ){
                    // this.setState({
                    //     disabledVote:false
                    // });
                }else{
                    this.setState({
                        disabledVote:true
                    });
                }
                // this.setState({
                //     disabledVote:true
                // });
                break;
            case "LiveCallRoll":
                // 点名
                if( mySelf.id === pubmsgData.data.fromUser.id ){
                    // this.setState({
                    //     disabledSign:false
                    // });
                }else{
                    this.setState({
                        disabledSign:true
                    });
                }
                
                break;
            case "ClassBegin":
                // Log.debug('上课了',TkConstant.joinRoomInfo)

                this.isShowBroadcast = TkConstant.joinRoomInfo.isOpeningRadioBroadcast;   //广播
                this.isShowNotice = TkConstant.joinRoomInfo.isShowNotice;     //通知
                this.isShowInform = TkConstant.joinRoomInfo.isOpeningNotice;      //公告
                this.isShowSharing = TkConstant.joinRoomInfo.isShowShare;     //共享
                this.isShowSign = TkConstant.joinRoomInfo.isShowRollCall;    //点名
                this.isShowVote = TkConstant.joinRoomInfo.isShowLuckDraw;    //投票
                this.isShowLuckdraw = TkConstant.joinRoomInfo.isShowVote;    //抽奖
                this.handlerInitAppPermissions();
                break;
        }
    };

    handlerRoomDelmsg(recvEventData){
        let delmsgData = recvEventData.message;
        let mySelf = ServiceRoom.getTkRoom().getMySelf();
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
            case "LiveLuckDraw":
                //抽奖
                if( mySelf.id === delmsgData.data.fromUser.id ) return ;
                this.setState({
                    disabledLuckdraw:false
                });
                break;
            case "LiveVote":
                //投票
                if( mySelf.id === delmsgData.data.fromUser.id ) return ;
                this.setState({
                    disabledVote:false
                });
                break;
            case "LiveCallRoll":
                // 点名
                if( mySelf.id === delmsgData.data.fromUser.id ) return ;
                this.setState({
                    disabledSign:false
                });
                break;
	        case "ClassBegin":
                this.handlerRoomPlaybackClearAll();     //清除所有数据
                break;
        }
    };

    handlerRoomMsgList(recvEventData){
        const that = this;
        let pubmsgData = recvEventData.message;
        let mySelf =ServiceRoom.getTkRoom().getMySelf();
        // Log.debug('handlerRoomMsgList111=>',pubmsgData)
        for(let i=0;i<pubmsgData.length;i++){
            let data = pubmsgData[i];

            switch (data.name) {
                case "LiveLuckDraw":
                    //抽奖
                    if( mySelf.id === data.data.fromUser.id )   return ;
                    if(data.data.state === 1){
                        this.setState({
                            disabledLuckdraw:true
                        });
                    }
                    break;
                case "LiveVote":
                    //投票
                    if( mySelf.id === data.data.fromUser.id )   return ;
                    this.setState({
                        disabledVote:true
                    });
                    break;
                case "LiveCallRoll":
                    // 点名
                    if( mySelf.id === data.data.fromUser.id )   return ;
                    this.setState({
                        disabledSign:true,
                    });
                    break;
                case "ClassBegin":
                    
                    this.isShowBroadcast = TkConstant.joinRoomInfo.isOpeningRadioBroadcast;   //广播
                    this.isShowNotice = TkConstant.joinRoomInfo.isShowNotice;     //公告
                    this.isShowInform = TkConstant.joinRoomInfo.isOpeningNotice;   //通知   
                    this.isShowSharing = TkConstant.joinRoomInfo.isShowShare;     //共享
                    this.isShowSign = TkConstant.joinRoomInfo.isShowRollCall;    //点名
                    this.isShowVote = TkConstant.joinRoomInfo.isShowLuckDraw;    //投票
                    this.isShowLuckdraw = TkConstant.joinRoomInfo.isShowVote;    //抽奖
                    this.handlerInitAppPermissions();
                    break;
            }

        }
        
    }
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

    handlerInitAppPermissions(){
        let toolsShow = {}

        if(TkGlobal.isBroadcast && (TkGlobal.isClient ||ServiceRoom.getTkRoom().getRoomType() === 10 && ServiceRoom.getTkRoom().getMySelf().role === TkConstant.role.roleTeachingAssistant)){
            toolsShow = {
                broadcast: this.isShowBroadcas ,
                notice: this.isShowNotice ,
                inform: this.isShowInform ,
                sharing: this.isShowSharing ,
                sign: this.isShowSign,
                vote: this.isShowVote,
                luckdraw: this.isShowLuckdraw,
                
               
            };
        } else{
            toolsShow = {
                answer:true ,
                turnplate:true ,
                timer:true ,
                destTopShare: TkGlobal.isClient && TkGlobal.classBegin && CoreController.handler.getAppPermissions('destTopShareIsShow') ,
                responder:true ,
                moreBlackboard:true ,
            };
        }
        Object.assign(this.state.toolsShow , toolsShow);
        this.state.show.allGift = CoreController.handler.getAppPermissions('giveAllUserSendGift') && ServiceRoom.getTkRoom().getRoomType() !== TkConstant.ROOMTYPE.oneToOne ;
        this.state.show.allMute = CoreController.handler.getAppPermissions('allUserMute') && ServiceRoom.getTkRoom().getRoomType() !== TkConstant.ROOMTYPE.oneToOne;
        this.state.show.allTools = CoreController.handler.getAppPermissions('allUserTools');
        this.setState({show:this.state.show , destTopShare:this.state.toolsShow});
    };

    handlerStreamRemovedScreen(removeEvent){ //停止共享时，桌面共享恢复可点击
        let that = this;

        if (removeEvent) {
            let stream = removeEvent.stream;
            if(stream.screen){ //
                const mySelf = ServiceRoom.getTkRoom().getMySelf();
                if( mySelf.role === TkConstant.role.roleChairman) {
                    this.setState({
                        disabledSharing:false
                    });
                }
            }
        }

    }

    handlerMsglistLiveLuckDraw(){
        let that = this;
        that.setState({
           disabledLuckdraw:false
        });
        TkGlobal.isStartLuckdraw = false;
    }

    handlerMsglistLiveVote(){
        let that = this;
        that.setState({
            disabledVote:false
        });
    }

    handlerMsglistLiveCallRoll(){
        let that = this;
        that.setState({
            disabledSign:false
        });
    }

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
        
    	let boxID=document.getElementById("tl-all-participant-tools-id");
    	boxID.setAttribute("class","tl-all-participant-tools-active");
        this.state.teachExpansionColumnDisplay = "block";
        this.setState({teachExpansionColumnDisplay: this.state.teachExpansionColumnDisplay});
    };
    /*工具箱类别*/
    /*移除*/
    teachBoxLeftMouseOut(){
    	let boxID=document.getElementById("tl-all-participant-tools-id");
    	boxID.setAttribute("class","tl-all-participant-tools");
        this.state.teachExpansionColumnDisplay = "none";
        this.setState({teachExpansionColumnDisplay: this.state.teachExpansionColumnDisplay});
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
    answerAssemblyShowHandel(){
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
        	} 
        	ServiceSignalling.sendSignallingAnswerToStudent(data);
    	 	eventObjectDefine.CoreController.dispatchEvent({
                        type:'handleAnswerShow' ,
                        className:"answer-implement-bg",
                        isShow:iconShow,
                   });
        this.state.teachExpansionColumnDisplay = "none";
        this.setState({teachExpansionColumnDisplay: this.state.teachExpansionColumnDisplay});
    }
    
    _screenSharing() {
        /*let eid = ServiceRoom.getTkRoom().getMySelf().id + ":screen";
        let stream = TK.Stream({
            audio: true,
            video: true,
            screen: true,
            data: false,
            extensionId: eid,
            attributes: {type: 'screen'},
        },true);

        ServiceSignalling.publishDeskTopShareStream(stream);*/
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
    	this.state.teachExpansionColumnDisplay = "none";
        this.setState({teachExpansionColumnDisplay: this.state.teachExpansionColumnDisplay});
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
        this.state.teachExpansionColumnDisplay = "none";
        this.setState({teachExpansionColumnDisplay: this.state.teachExpansionColumnDisplay});
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
		this.state.teachExpansionColumnDisplay = "none";
		this.setState({
			teachExpansionColumnDisplay: this.state.teachExpansionColumnDisplay
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
        if (user.role === TkConstant.role.roleChairman || user.role === TkConstant.role.roleTeachingAssistant) {
            ServiceSignalling.sendSignallingFromLiveNoticeBoard(data);
        }
    }

    liveNoticeInform(data){  //通知
        let that = this;
        let user = that.getUser();
        if (user.role === TkConstant.role.roleChairman || user.role === TkConstant.role.roleTeachingAssistant) {
            ServiceSignalling.sendSignallingFromLiveNoticeInform(data);
        }
    }

    liveBroadcast(data){ //广播
        let that = this;
        let user = that.getUser();
        data.text = TkGlobal.language.languageData.notice.broadcast+':'+data.text;
        if (user.role === TkConstant.role.roleChairman || user.role === TkConstant.role.roleTeachingAssistant) {
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
            if(hasConfirm && data.text)self.liveBroadcast(data);
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
            if(hasConfirm && data.text)self.liveNoticeBoard(data);
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
            if(hasConfirm && data.text)self.liveNoticeInform(data);
        });
    }
    
     // method on vote button clicked
    handleOnVoteBtnClick(){
        let that = this;
        that.setState({
            disabledVote:true
        });
        eventObjectDefine.CoreController.dispatchEvent({
			type: 'voteShow',
		});
    }

    // method on call-roll button clicked
    handleCallRollShow(){
        let that = this;
        that.setState({
            disabledSign:true
        });
        eventObjectDefine.CoreController.dispatchEvent({
			type: 'callRollShow',
		});
    }
    /**************************** R_add_terminus *********************/

    //直播抽奖开始点击事件
    handlerStartLiveLuckdraw(){
        let that = this;
        that.setState({
            disabledLuckdraw:true
        });
        eventObjectDefine.CoreController.dispatchEvent({
            type: 'liveLuckDrawShow',
        });
    }



    handleBlackBoardClick(){
        let isDelMsg = false , data = {
            blackBoardState:'_prepareing' ,  //_none:无 , _prepareing:准备中 , _dispenseed:分发 , _recycle:回收分发 , _againDispenseed:再次分发
            currentTapKey:'blackBoardCommon' ,
            currentTapPage:1 ,
        } ;
        ServiceSignalling.sendSignallingFromBlackBoard(data , isDelMsg);
    };
    handleAudioBoxClick() {
        this.state.audioBoxIsShow = !this.state.audioBoxIsShow;
        this.setState({audioBoxIsShow:this.state.audioBoxIsShow});
    }
    handleAudioBoxMouseLeave() {
        this.state.audioBoxIsShow = false;
        this.setState({audioBoxIsShow:this.state.audioBoxIsShow});
    }

    render(){
        let that = this;
        let {pagingToolLeft} = this.props; // tkpc2.0.8
        let {show, allMuteDisabled, onClick, toolsShow, allSpeakingDisabled, audioBoxIsShow } = that.state ;
        let {allGift , allMute , allTools} = show ;
        let toolsNum =  0 ; //显示工具包的个数
        let isTeachingAssistant = (ServiceRoom.getTkRoom().getRoomType() === 10 && ServiceRoom.getTkRoom().getMySelf().role === TkConstant.role.roleTeachingAssistant)?true:false;
        if(ServiceRoom.getTkRoom().getRoomType() ===TkConstant.ROOMTYPE.oneToOne){ // tkpc2.0.8 包括 <li className={"responder-implement-bg..... style={[]}></li>
        	toolsNum = toolsNum-1;
       };
        for(let value of Object.values(toolsShow) ){
            
            if(value){
                toolsNum++;
            }
            if(toolsNum > 5){
                toolsNum = 5 ;
                break ;
            }
        };
        return (
            <ol className="all-participant-function add-fl clear-float  h-tool"  > {/*全员操作功能组件*/}
                <li className="tl-all-participant-gift" style={{display:TkGlobal.isBroadcast?'none':!allGift?'none':''}}  >
                    <button className="header-tool "  title={TkGlobal.language.languageData.header.tool.allGift.title.yes}  onClick={onClick.allGift}  >
                        <span className="tool-img-wrap on "></span>
                    </button>
                </li>
                <li className="tl-all-participant-mute " style={{display:TkGlobal.isBroadcast?'none':!allMute?'none':''}}  onMouseLeave={that.handleAudioBoxMouseLeave.bind(that)}>
                    <button className={"mute_or_speaking_btn "+(audioBoxIsShow?"active":"")} onClick={that.handleAudioBoxClick.bind(that)} >

                    </button>
                    <ul className="handle-audio-box" style={{display:audioBoxIsShow?"block":"none", width:pagingToolLeft<2.5 && typeof(pagingToolLeft)=="number"?"1rem":"auto",left:(pagingToolLeft<2.5 && typeof(pagingToolLeft)=="number"?"0.5rem":'-1rem')}} >{/*tkpc2.0.8*/}
                        <li id="all_mute_btn" className={"all_mute_btn " + (allMuteDisabled?'disabled':'')}  title={TkGlobal.language.languageData.header.tool.allMute.title.no}  disabled={allMuteDisabled}  onClick={!allMuteDisabled?onClick.allMute:undefined }  >
                            <button className="tool-img-wrap"></button>
                        </li>
                        <li id="all_speaking" className={"all_speaking " + (allSpeakingDisabled?'disabled':'')}  title={TkGlobal.language.languageData.header.tool.allMute.title.yes}  disabled={allSpeakingDisabled}  onClick={!allSpeakingDisabled?onClick.allSpeaking:undefined}  >
                            <button className="tool-img-wrap"></button>
                        </li>
                    </ul>
                </li>
                <li className="tl-all-participant-tools " id="tl-all-participant-tools-id" onMouseLeave={this.teachBoxLeftMouseOut.bind(this)} style={{display:allTools && toolsNum > 0 ?'block':'none'}}>
                    <button className="toolBox" onClick={this.teachExpansionController.bind(this)} title={TkGlobal.language.languageData.toolCase.toolBox.text}></button>
                    <div className={" teach-expansion-column "} style={{display:this.state.teachExpansionColumnDisplay , width:'calc(100% * '+toolsNum+')',right:(pagingToolLeft<2.5 && typeof(pagingToolLeft)=="number"?'calc(-100% * '+toolsNum+')':'100%')}} >{/*tkpc2.0.8*/}
                        <ul className="teach-box-left clear-float"   ref="teachBoxLeftStyle">
                            <li className={"answer-implement-bg"+" " +(this.state.disabledAnswer?'disabled':'') } title={TkGlobal.language.languageData.answers.headerTopLeft.text} disabled={this.state.disabledAnswer} onClick={this.answerAssemblyShowHandel.bind(this)}  style={{display:TkGlobal.isBroadcast?"none":!toolsShow.answer?'none':''}} ></li>
                            <li className={"turnplate-implement-bg"+" "+ (this.state.disabledTurnplate?'disabled':'') } title={TkGlobal.language.languageData.dial.turntable.text} disabled={this.state.disabledTurnplate} onClick={this.turntableAssemblyShowHandel.bind(this)} style={{display:TkGlobal.isBroadcast?"none":!toolsShow.turnplate?'none':''}}  ></li>
                            <li className={"timer-implement-bg"+" "+ (this.state.disabledTimer?'disabled':'') } title={TkGlobal.language.languageData.timers.timerSetInterval.text} disabled={this.state.disabledTimer} onClick={this.timerAssemblyShowHandel.bind(this)} style={{display:TkGlobal.isBroadcast?"none":!toolsShow.timer?'none':''}}  ></li>
                            <li className={"responder-implement-bg"+ " "+ (this.state.disabledResponder?'disabled':'') } title={TkGlobal.language.languageData.responder.responder.text} onClick={this.responderAssemblyShowHandel.bind(this)}  style={{display:TkGlobal.isBroadcast?"none":toolsShow.responder ?'':'none'}} ></li>
							<li className={"tl-more-black-board "+ (this.state.disabledBlackBoard?'disabled':'') }  title={TkGlobal.language.languageData.header.tool.blackBoard.title.open} disabled={this.state.disabledBlackBoard} id="more_black_board"  style={{display:TkGlobal.isBroadcast?"none":!toolsShow.moreBlackboard?'none':''}}  onClick={this.handleBlackBoardClick.bind(this)} ></li>
                            <li className={"tl-all-participant-sharing"+ " "+ (this.state.disabledSharing?'disabled':'') } title={TkGlobal.language.languageData.shares.shareSceen.text} disabled={this.state.disabledSharing} id="whiteboard_tool_vessel_sharing" onClick={that._screenSharing.bind(that)} style={{display:TkGlobal.isBroadcast && TkGlobal.isClient  && TkGlobal.classBegin && (TkGlobal.isClient || isTeachingAssistant) && TkGlobal.osType!=='Mac' && this.isShowSharing ?'':'none'}}></li>
                            <li className={"tl-live-participant-sign"+ " "+ (this.state.disabledSign?'disabled':'') } title={TkGlobal.language.languageData.callroll.callroll} disabled={this.state.disabledSign}  onClick={that.handleCallRollShow.bind(that)} style={{display: TkGlobal.isBroadcast &&  TkGlobal.classBegin && (TkGlobal.isClient || isTeachingAssistant) && this.isShowSign ?'block':'none'}}></li>
                            <li className={"tl-live-participant-luckdraw"+ " "+ (this.state.disabledLuckdraw ?'disabled':'') } title={TkGlobal.language.languageData.broadcast.luckdraw} disabled={this.state.disabledLuckdraw }  onClick={that.handlerStartLiveLuckdraw.bind(that)} style={{display: TkGlobal.isBroadcast && (TkGlobal.isClient || isTeachingAssistant) && TkGlobal.classBegin && this.isShowLuckdraw ?'block':'none'}}></li>
                            <li className={"tl-live-participant-vote"+ " "+ (this.state.disabledVote?'disabled':'') } title={TkGlobal.language.languageData.vote.vote} disabled={this.state.disabledVote} onClick={that.handleOnVoteBtnClick.bind(that)}  style={{display: TkGlobal.isBroadcast &&  TkGlobal.classBegin && (TkGlobal.isClient || isTeachingAssistant) && this.isShowVote ?'':'none'}}></li>
                            <li className="icon-base-style icon-broadcast" onClick={that.handlerOnBroadcastClick.bind(that)} title={TkGlobal.language.languageData.notice.broadcast} style={{display: TkGlobal.isBroadcast && (TkGlobal.isClient || isTeachingAssistant) && TkGlobal.classBegin && this.isShowBroadcast ?'':'none'}}></li>
                            <li className="icon-base-style icon-notice" onClick={that.handlerOnNoticeClick.bind(that)} title={TkGlobal.language.languageData.notice.notice} style={{display: TkGlobal.isBroadcast && (TkGlobal.isClient || isTeachingAssistant) && TkGlobal.classBegin && this.isShowNotice ?'':'none'}}></li>
                            <li className="icon-base-style icon-inform" onClick={that.handlerOnInformClick.bind(that)} title={TkGlobal.language.languageData.notice.inform} style={{display: TkGlobal.isBroadcast && (TkGlobal.isClient || isTeachingAssistant) && TkGlobal.classBegin && this.isShowInform ?'':'none'}}></li>
                        </ul>
                    </div>
                </li>
            </ol>
        )
    };

};
export default  ControlOverallBarSmart;

