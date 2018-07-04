import React,{ Component } from 'react';
import ReactDom from 'react-dom';
import TkGlobal from 'TkGlobal';
import CoreController from 'CoreController';
import eventObjectDefine from 'eventObjectDefine';
import ServiceRoom from 'ServiceRoom';
import ServiceSignalling from 'ServiceSignalling';
import TkConstant from 'TkConstant';
import Input from './input';
import ChatListMessageDumb from './chatListMessage';
import Notice from '../../displayPanel/notice';
import TkUtils from 'TkUtils';
import ServiceTooltip from 'ServiceTooltip';

class ChatContainer extends Component{
	constructor(props,context){
        super(props,context);
        this.state={
            broadcastFlag:undefined ,
            chatList:[],
            quizList:[],
            inputHide:true ,//是否是巡课或者回放者,默认框不显示
            liveNoticeBoard:'', //公告内容
            // liveNoticeInform:'',//通知内容
            liveBroadcast:'',//广播内容
            liveAllNoTalking:undefined,//全体禁言
            ntToggle: false, // 全体禁言开关
            userlists:[],
            selectUserID:undefined,
            selectUserNickname:'',
            isBarrageLocked: true, // 弹幕开关
            isBarrageShow: undefined,
            selectBox : {
                teacherOnly: false,
                selfOnly: false,
            },
            qqFaceShow:false ,
        };
        this.selectBox = {
            teacherOnly: false,
            selfOnly: false,
        }
        this.property = {
            publishState:0,
            drawtype:false,
            raiseHand:undefined
        };
        this.ids={
            teacherid:'', 
            myid:''
        };
        this.chatIndex = 'chat' ;
        this.quizIndex = 'quiz' ;
        this.isTeacher = TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant;
        this.intervalChat = this.isTeacher ? 0 : 10;     // 聊天发送间隔，常量
        this.intervalQuiz = this.isTeacher ? 0 : 120;   // 提问发送间隔，常量
        this.timeChat = 0;                               // 聊天发送间隔时间
        this.timeQuiz = 0;                               // 提问发送间隔时间
        this.timerChat = undefined;                      // 聊天间隔计时器
        this.timerQuiz = undefined;                      // 提问间隔计时器
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
        //this.liveNoticeBoard=''; //公告内容
        //liveNoticeInform:'',//通知内容屏幕
        this.userlist = [];
        //this.evictUsersData = [];

        this.countChat = 0; //接收的聊天记录数
        this.lastReceiveChatList = [];  //聊天区超出最大聊天数后，接收的聊天信息临时保存；每两秒处理一次，一次处理其中的最后5条。
        this.chatMaxCount = 100;  //聊天区无限制接收最大聊天数量，超出部分每2秒显示最后5条聊天记录。
        this.isinRoom = false;  //是否已经进入房间
    };

    componentDidMount() {
        const that = this ;
        
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomConnected, that.handlerRoomConnected.bind(that) , that.listernerBackupid); //监听房间连接事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPubmsg , that.handlerRoomPubmsg.bind(that), that.listernerBackupid); //roomPubmsg事件  上课事件 classBegin
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDelmsg, that.handlerRoomDelmsg.bind(that) , that.listernerBackupid); //监听roomDelmsg
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomParticipantJoin, that.handlerRoomParticipantJoin.bind(that) , that.listernerBackupid); //监听用户加入
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomParticipantLeave, that.handlerRoomParticipantLeave.bind(that) , that.listernerBackupid); //监听用户离开
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomTextMessage, that.handlerRoomTextMessage.bind(that)  , that.listernerBackupid);//监听服务器的广播聊天消息
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomUserpropertyChanged,that.handlerRoomUserpropertyChanged.bind(that) , that.listernerBackupid);//监听学生权限变化
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPlaybackClearAllFromPlaybackController,that.handlerRoomPlaybackClearAll.bind(that) , that.listernerBackupid); //roomPlaybackClearAll 事件：回放清除所有信令
        eventObjectDefine.CoreController.addEventListener( "receive-msglist-ClassBegin" , that.handlerReceiveMsglistClassBegin.bind(that), that.listernerBackupid); //roomPubmsg事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomMsglist, that.handlerRoomMsgList.bind(that), that.listernerBackupid);
        // eventObjectDefine.CoreController.addEventListener( "receive-msglist-userEnterBackGround" , that.handlerReceiveMsglistHomeEnter.bind(that), that.listernerBackupid); //后进来的人收到手机端按home键的信息
    };
    componentWillUnmount(){
        let that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid );
    }

    //提问列表中是否有提问
    hasQuizeId(data){
        let that = this;
        for(let key=0;key<that.state.quizList.length;key++){
            if(that.state.quizList[key].id === data.id){
                let quizMsg =  that.state.quizList;
                quizMsg[key].hasPassed = data.hasPassed;;
                that.setState({
                    quizList :quizMsg
                });
                return true;
            }
        }
        return false;
    }

    // 接收到发布信令时的处理方法
    handlerRoomPubmsg(recvEventData){
        const that = this ;
        let mySelf = ServiceRoom.getTkRoom().getMySelf();
        if( TkGlobal.isBroadcast ){//是直播的话才处理
            let pubmsgData = recvEventData.message;
            switch(pubmsgData.name){
                case "ClassBegin":
                    //上课要设置变量
                    that.setState({
                        broadcastFlag:true
                    });
                    if(ServiceRoom.getTkRoom().getMySelf().role === TkConstant.role.roleChairman || ServiceRoom.getTkRoom().getMySelf().role === TkConstant.role.roleTeachingAssistant)
                        that.setState({
                            ntToggle: false
                        })
                    break;
                case "LiveNoticeBoard":
                    //公告
                    that.setState({
                        liveNoticeBoard:recvEventData.message.data.text
                    });
                    break;
                case "LiveBroadcast":
                    //广播
                    that.setState({
                        liveBroadcast:recvEventData.message.data.text
                    });
                    this.appendChatList({
                        time: this.getSendTime(),
                        chatType: 0,
                        who: recvEventData.message.data.text,
                        isBrd: true,
                    });
                    break;
                case "LiveQuestions":
                    //问答区
                    let data = recvEventData.message.data;
                    let sender = this.props.isBroadcast ? data.sender : ServiceRoom.getTkRoom().getUser(data.id.substr(5,36));
                    let isTeacher = sender.role === 0 || sender.role === 1;

                    // 过滤，若为老师点击通过按钮则不进行插入操作
                    /*if( this.ids.myid === recvEventData.message.fromID && !recvEventData.message.associatedMsgID && this.ids.myid !== sender.id)
                        return;*/
                    //若当前提问列表中没有这条提问再插入
                    if(!that.hasQuizeId(data)){
                        that.appendChatList({
                            time: data.time,
                            strmsg: data.msg,
                            chatType: data.type,
                            who: sender.nickname,
                            id : data.id,
                            isTeacher: isTeacher,
                            associatedMsgID: recvEventData.message.associatedMsgID,
                            hasPassed: data.hasPassed,
                            fromID: data.id.substr(5,36),
                        });
                    }

                    break;
                case "LiveAllNoTalking":
                    //全体禁言
                    that.handleLiveAllNoTalking(pubmsgData);
                    //Log.error('收到禁言',pubmsgData)
                    break;
                case "LiveEvictSpecificUser":
                    let type = 1;
                    that.handlerEvictSpecificUserAndNoTalk(type);
                    break;
                case "LiveLuckDraw":
                    //抽奖
                    if((mySelf.role === TkConstant.role.roleTeachingAssistant) || (mySelf.role === TkConstant.role.roleChairman) ){
                        if( mySelf.id === recvEventData.message.data.fromUser.id )   return ;
                        let luckdrawData = recvEventData.message.data;
                        let str;
                        if(parseInt(luckdrawData.state) === 1){
                            //开始抽奖
                            //luckdrawData.fromName     发起人的名字
                            str = luckdrawData.fromName + '发起了抽奖';
                        }
                        // else if(parseInt(luckdrawData.state) === 0){
                        //     // 结束抽奖
                        //     str = luckdrawData.fromName + '结束了抽奖';
                        // }
                        that.functionStartTips(0, str)
                    }
                    break;
                case "LiveCallRoll":
                    //点名
                    if((mySelf.role === TkConstant.role.roleTeachingAssistant) || (mySelf.role === TkConstant.role.roleChairman) ){
                        if( mySelf.id === recvEventData.message.data.fromUser.id )   return ;
                        let LiveCallRollData = recvEventData.message.data;
                        let str;
                        if(LiveCallRollData.fromUser.nickname){
                            str = LiveCallRollData.fromUser.nickname + "发起了点名";
                        }else{
                            str = "神秘人发起了点名"
                        }
                        that.functionStartTips(0, str)
                    }
                    break;
                case "LiveVote":
                    //投票
                    if((mySelf.role === TkConstant.role.roleTeachingAssistant) || (mySelf.role === TkConstant.role.roleChairman) ){
                        if( mySelf.id === recvEventData.message.data.fromUser.id )   return ;
                        let LiveVoteData = recvEventData.message.data;
                        let str;
                        if(LiveVoteData.fromUser.nickname){
                            str = LiveVoteData.fromUser.nickname + "发起了投票";
                        }else{
                            str = "神秘人发起了投票"
                        }
                        that.functionStartTips(0, str)
                    }
                    break;

            }
        }
    };



    handleLiveAllNoTalking(pubmsgData){
        const that = this;
        let mySelf = ServiceRoom.getTkRoom().getMySelf();
        if (mySelf.role === TkConstant.role.roleChairman || mySelf.role === TkConstant.role.roleTeachingAssistant) {
            if (pubmsgData.data.time === undefined) {
                that.setState({
                    ntToggle: true
                })
                that.appendChatList({
                    time: that.getSendTime(),
                    chatType: 0,
                    who: TkGlobal.language.languageData.broadcast.allNoTalking,
                });
            }
        } else if (mySelf.role !== TkConstant.role.roleChairman && mySelf.role !== TkConstant.role.roleTeachingAssistant) {

            if (pubmsgData.data.time === undefined) {
                that.appendChatList({
                    time: that.getSendTime(),
                    chatType: 0,
                    who: TkGlobal.language.languageData.broadcast.allNoTalking
                });

                that.setState({
                    liveAllNoTalking: true
                });

            } else if (pubmsgData.data.time !== undefined && pubmsgData.data.time > 0 && pubmsgData.toID === mySelf.id) {
                that.appendChatList({
                    time: that.getSendTime(),
                    chatType: 0,
                    who: TkGlobal.language.languageData.broadcast.noTalkingToUser
                });
                that.setState({
                    liveAllNoTalking: true,
                });
                let type = 0;
                that.handlerEvictSpecificUserAndNoTalk(type);
                setTimeout(() => {
                    that.setState({
                        liveAllNoTalking: false,
                    });
                }, pubmsgData.data.time * 1000);
            }
        }
    }


    handlerRoomMsgList(recvEventData){

        const that = this;
        let messageListData = recvEventData.message;
        let mySelf = ServiceRoom.getTkRoom().getMySelf();

        if(that.isinRoom){  return ;    }

        for(let x in messageListData) {
            if(messageListData[x].name == "LiveAllNoTalking") {
                that.handleLiveAllNoTalking(messageListData[x]);
            } else if(messageListData[x].name == "LiveNoticeBoard") {
                that.setState({
                    liveNoticeBoard:messageListData[x].data.text
                });
            } else if(messageListData[x].name == "LiveBroadcast"){
                //广播
                if(that.state.liveBroadcast === ''){
                    //这里会执行两次,会出现双份的广播,所以在这里限制一下
                    that.setState({
                        liveBroadcast:messageListData[x].data.text
                    });
                    that.appendChatList({
                        time: that.getSendTime(),
                        chatType: 0,
                        who: messageListData[x].data.text,
                        isBrd: true,
                    });
                }
            } else if(messageListData[x].name == "LiveLuckDraw"){
                //抽奖
                if((mySelf.role === TkConstant.role.roleTeachingAssistant) || (mySelf.role === TkConstant.role.roleChairman) ){
                    if( mySelf.id === messageListData[x].data.fromUser.id )   return ;
                    let luckdrawData = messageListData[x].data;
                    let str;
                    if(parseInt(luckdrawData.state) === 1){
                        //开始抽奖
                        //luckdrawData.fromName     发起人的名字
                        str = luckdrawData.fromName + '发起了抽奖';
                    }
                    // else if(parseInt(luckdrawData.state) === 0){
                    //     // 结束抽奖
                    //     str = luckdrawData.fromName + '结束了抽奖';
                    // }
                    that.functionStartTips(0, str)
                }
            } else if(messageListData[x].name == "LiveCallRoll"){
                //点名
                
                if((mySelf.role === TkConstant.role.roleTeachingAssistant) || (mySelf.role === TkConstant.role.roleChairman) ){
                    if( mySelf.id === messageListData[x].data.fromUser.id )   return ;
                    let LiveCallRollData = messageListData[x].data;
                    let str;
                    if(LiveCallRollData.fromUser.nickname){
                        str = LiveCallRollData.fromUser.nickname + "发起了点名";
                    }else{
                        str = "神秘人发起了点名"
                    }
                    that.functionStartTips(0, str)
                }
            } else if(messageListData[x].name == "LiveVote"){
                //投票
                if((mySelf.role === TkConstant.role.roleTeachingAssistant) || (mySelf.role === TkConstant.role.roleChairman) ){
                    if( mySelf.id === messageListData[x].data.fromUser.id )   return ;
                    let LiveVoteData = messageListData[x].data;
                    let str;
                    if(LiveVoteData.fromUser.nickname){
                        str = LiveVoteData.fromUser.nickname + "发起了投票";
                    }else{
                        str = "神秘人发起了投票"
                    }
                    that.functionStartTips(0, str)
                }
            }
        };
        that.isinRoom = true;
    }

    // 接收到删除信令时的处理方法
    handlerRoomDelmsg(delmsgDataEvent){
        const that = this ;
        let mySelf = ServiceRoom.getTkRoom().getMySelf();
        let delmsgData = delmsgDataEvent.message ;
        switch(delmsgData.name) {
            case "ClassBegin":
                if(CoreController.handler.getAppPermissions('endClassbeginRevertToStartupLayout')) { //是否拥有下课重置界面权限
                    setTimeout( () => {
                        that._resetChatList();
                    } , 250 );
                }
                if(this.props.isBroadcast && !TkGlobal.isClient) {//是直播观看端的话才处理
                    that.setState({
                        broadcastFlag:false
                    });
                }
                break;
            case "LiveQuestions":
                if(TkGlobal.isBroadcast) {//是直播才处理
                    that.deleteItemById(delmsgDataEvent.message.id);
                }
                break;
            case "LiveAllNoTalking":
                //全体禁言
                //Log.error('收到解除禁言信令',delmsgData)
                if(TkGlobal.isBroadcast) { //是直播才处理
                    let mySelf = ServiceRoom.getTkRoom().getMySelf();
                    if (mySelf.role === TkConstant.role.roleChairman || mySelf.role === TkConstant.role.roleTeachingAssistant) {
                        that.setState({
                            ntToggle: false,
                        })
                    }

                    that.appendChatList({
                        time: that.getSendTime(),
                        chatType: 0,
                        who: TkGlobal.language.languageData.broadcast.cancelNoTalked,
                    });

                    that.setState({
                        liveAllNoTalking: false
                    });
                }
                break;
            case "LiveCallRoll":
                //点名
                
                if((mySelf.role === TkConstant.role.roleTeachingAssistant) || (mySelf.role === TkConstant.role.roleChairman) ){
                    if( mySelf.id === delmsgDataEvent.message.data.fromUser.id )   return ;
                    let LiveCallRollData = delmsgDataEvent.message.data;
                    let str;
                    if(LiveCallRollData.fromUser.nickname){
                        str = LiveCallRollData.fromUser.nickname + "结束了点名";
                    }else{
                        str = "神秘人结束了点名"
                    }
                    that.functionStartTips(0, str)
                }
                break;
            case "LiveVote":
                //投票

                if((mySelf.role === TkConstant.role.roleTeachingAssistant) || (mySelf.role === TkConstant.role.roleChairman) ){
                    if( mySelf.id === delmsgDataEvent.message.data.fromUser.id )   return ;
                    let LiveCallRollData = delmsgDataEvent.message.data;
                    let str;
                    if(LiveCallRollData.fromUser.nickname){
                        str = LiveCallRollData.fromUser.nickname + "结束了投票";
                    }else{
                        str = "神秘人结束了投票"
                    }
                    that.functionStartTips(0, str)
                }
                break;
            case "LiveLuckDraw":
                //抽奖
                if((mySelf.role === TkConstant.role.roleTeachingAssistant) || (mySelf.role === TkConstant.role.roleChairman) ){
                    if( mySelf.id === delmsgDataEvent.message.data.fromUser.id )   return ;
                    let luckdrawData = delmsgDataEvent.message.data;
                    let str;
                    if(parseInt(luckdrawData.state) === 0){
                        // 结束抽奖
                        str = luckdrawData.fromName + '结束了抽奖';
                    }else{
                        str = "神秘人结束了抽奖"
                    }
                    that.functionStartTips(0, str)
                }
                break;
        }
    };
    handlerReceiveMsglistClassBegin(){
        const that = this ;
        if(this.props.isBroadcast && !TkGlobal.isClient) {//是直播的话才处理
            that.setState({
                broadcastFlag:true
            });
        }
    };
    
    handlerRoomConnected(handlerData){
        const that = this ;
        //bug有时teacherid是undefined
        that.ids.teacherid=Object.keys(ServiceRoom.getTkRoom().getSpecifyRoleList(TkConstant.role.roleChairman))[0];//获取老师的id
        that.ids.myid=ServiceRoom.getTkRoom().getMySelf().id;
        
        that.isBeforeClassInteraction = TkConstant.joinRoomInfo.isBeforeClassInteraction;
        that.isAfterClassInteraction = TkConstant.joinRoomInfo.isAfterClassInteraction;


        that.setState({
            inputHide:TkConstant.hasRole.rolePatrol ||  TkConstant.hasRole.rolePlayback, //判断人物身份是否是巡课身份或者回放者身份，巡课、回放者不需要聊天框
            isBarrageShow: parseInt(ServiceRoom.getTkRoom().getRoomProperties().barrage) === 1,
        });
        if(!that.isLoadWelcomeClassroom){
            if(!TkGlobal.isBroadcast) {
                that.isLoadWelcomeClassroom = true;
                that.notice(undefined, '<p class="welcome-classroom">' + TkGlobal.language.languageData.welcomeClassroom.text + "（" + TkGlobal.language.languageData.welcomeClassroom.roomId + TkConstant.joinRoomInfo.serial + '）</p>');
            }
        }
        if(TkGlobal.isBroadcast){
            that._handlerLiveuserlistAdd("",TkGlobal.language.languageData.broadcast.labelToAll);
            if(!TkGlobal.isClient){
                that.getLocalStorage();
            }
        }
        if(TkConstant.hasRole.roleTeachingAssistant  && !that.isLoadUserVersion ){
            that.isLoadUserVersion = true ;
            for(let user of Object.values( ServiceRoom.getTkRoom().getUsers() ) ){
                if(user.role != 4 ){//不是巡检员,才提醒
                    let time=that.getSendTime(TkGlobal.playback,user.joinTs);
                    let userVersionInfo = '' ;
                    let userRoleInfo = '';
                    switch (user.role) {
                        case TkConstant.role.roleChairman:
                            userRoleInfo = "（"+TkGlobal.language.languageData.videoContainer.sendMsg.tips.teacher+"）";
                            break;
                        case TkConstant.role.roleTeachingAssistant:
                            userRoleInfo = "（"+TkGlobal.language.languageData.videoContainer.sendMsg.tips.assistant+"）";
                            break;
                        case TkConstant.role.roleStudent:
                            userRoleInfo = "（"+TkGlobal.language.languageData.videoContainer.sendMsg.tips.student+"）";
                            break;
                        case TkConstant.role.rolePatrol:
                            userRoleInfo = "（"+TkGlobal.language.languageData.videoContainer.sendMsg.tips.patrol+"）";
                            break;
                    }

                    if(TkConstant.hasRole.roleTeachingAssistant && user.appType && user.devicetype && user.systemversion && user.version){
                        let clientDeviceVersionInfo = TkGlobal.language.languageData.version.clientDeviceVersionInfo.key + user.devicetype ;
                        let browserVersionInfo =  (user.appType === 'webpageApp' ? TkGlobal.language.languageData.version.browserVersionInfo.webpageApp : TkGlobal.language.languageData.version.browserVersionInfo.mobileApp) + user.systemversion   ;
                        let appVersionInfo = TkGlobal.language.languageData.version.appVersionInfo.key  + user.version;
                        let comma = (TkGlobal.language.name === 'chinese' ?'，' : ',' ) ;
                        userVersionInfo = comma + clientDeviceVersionInfo+ comma +browserVersionInfo+ comma+ appVersionInfo;
                    }
                    that.notice(time,'<span class="limit-length diff-width">'+user.nickname+'</span><span class="user-role">'+userRoleInfo+'</span><span class="action">'+TkGlobal.language.languageData.alertWin.call.prompt.joinRoom.stream.join.text+userVersionInfo+'</span>')
                }
            }
        }
        if (TkConstant.hasRole.roleTeachingAssistant || TkConstant.hasRole.roleChairman || TkConstant.hasRole.rolePatrol) {
            for(let user of Object.values( ServiceRoom.getTkRoom().getUsers() ) ){
                if (user.isInBackGround === true) {//收到手机端按home键的信息
                    let userInfo = ServiceRoom.getTkRoom().getUsers()[user.id];
                    let time = that.getSendTime(TkGlobal.playback,0);
                    let homeRemindText = userInfo.nickname + "（" + userInfo.devicetype + "）" + TkGlobal.language.languageData.alertWin.call.prompt.homeBtnRemind.leave.text;
                    that.notice(time,homeRemindText);
                }else if(user.isInBackGround === false){
                    let userInfo = ServiceRoom.getTkRoom().getUsers()[user.id];
                    let time = that.getSendTime(TkGlobal.playback,0);
                    let homeRemindText = userInfo.nickname + "（" + userInfo.devicetype + "）" + TkGlobal.language.languageData.alertWin.call.prompt.homeBtnRemind.join.text;
                    that.notice(time,homeRemindText);
                }
            }
        }
    };
    
    handlerRoomParticipantJoin(roomEvent){
        const that = this ;
        if(roomEvent.user.role != 4 ){//不是巡检员,才提醒
            let time=that.getSendTime(TkGlobal.playback,roomEvent.user.joinTs);
            let userVersionInfo = '' ;
            let user = roomEvent.user ;
            let userRoleInfo = '';
            switch (user.role) {
                case TkConstant.role.roleChairman:
                    userRoleInfo = "（"+TkGlobal.language.languageData.videoContainer.sendMsg.tips.teacher+"）";
                    break;
                case TkConstant.role.roleTeachingAssistant:
                    userRoleInfo = "（"+TkGlobal.language.languageData.videoContainer.sendMsg.tips.assistant+"）";
                    break;
                case TkConstant.role.roleStudent:
                    userRoleInfo = "（"+TkGlobal.language.languageData.videoContainer.sendMsg.tips.student+"）";
                    break;
                case TkConstant.role.rolePatrol:
                    userRoleInfo = "（"+TkGlobal.language.languageData.videoContainer.sendMsg.tips.patrol+"）";
                    break;
            }

            if(TkConstant.hasRole.roleTeachingAssistant && user.appType && user.devicetype && user.systemversion && user.version){
                let clientDeviceVersionInfo = TkGlobal.language.languageData.version.clientDeviceVersionInfo.key + user.devicetype ;
                let browserVersionInfo =  (user.appType === 'webpageApp' ? TkGlobal.language.languageData.version.browserVersionInfo.webpageApp : TkGlobal.language.languageData.version.browserVersionInfo.mobileApp) + user.systemversion   ;
                let appVersionInfo = TkGlobal.language.languageData.version.appVersionInfo.key  + user.version;
                let comma = (TkGlobal.language.name === 'chinese' ?'，' : ',' ) ;
                userVersionInfo = comma + clientDeviceVersionInfo+ comma +browserVersionInfo+ comma+ appVersionInfo;
            }
            that.notice(time,'<span class="limit-length diff-width">'+roomEvent.user.nickname+'</span><span class="user-role">'+userRoleInfo+'</span><span class="action">'+TkGlobal.language.languageData.alertWin.call.prompt.joinRoom.stream.join.text+userVersionInfo+'</span>')
        }
    };

    handlerRoomParticipantLeave(roomEvent){
        const that = this ;
        let user = roomEvent.user ;
        let userRoleInfo = '';
        switch (user.role) {
            case TkConstant.role.roleChairman:
                userRoleInfo = "（"+TkGlobal.language.languageData.videoContainer.sendMsg.tips.teacher+"）";
                break;
            case TkConstant.role.roleTeachingAssistant:
                userRoleInfo = "（"+TkGlobal.language.languageData.videoContainer.sendMsg.tips.assistant+"）";
                break;
            case TkConstant.role.roleStudent:
                userRoleInfo = "（"+TkGlobal.language.languageData.videoContainer.sendMsg.tips.student+"）";
                break;
            case TkConstant.role.rolePatrol:
                userRoleInfo = "（"+TkGlobal.language.languageData.videoContainer.sendMsg.tips.patrol+"）";
                break;
        }
        if(roomEvent.user.role != TkConstant.role.rolePatrol ){//不是巡检员,才提醒
            let time=that.getSendTime(TkGlobal.playback,roomEvent.user.leaveTs);
            that.notice(time,'<span class="limit-length diff-width">'+roomEvent.user.nickname+'</span><span class="user-role">'+userRoleInfo+'</span><span class="action">'+TkGlobal.language.languageData.alertWin.call.prompt.joinRoom.stream.leave.text+'</span>');
        }
    };


    /*处理聊天消息*/
    handlerReceiveMessage(param){

        let time=this.getSendTime(TkGlobal.playback,param.message.ts);
        let sender = this.props.isBroadcast ? param.message.sender:param.user;
        let isTeacher = sender.role == TkConstant.role.roleChairman || sender.role == TkConstant.role.roleTeachingAssistant;
        if(param.message.toUserID === "" || param.message.toUserID === this.ids.myid || isTeacher || sender.id === this.ids.myid) {
            let mySelf = ServiceRoom.getTkRoom().getMySelf();
            let toWho = (param.message.sender.id === this.ids.myid ? '我': sender.nickname) + TkGlobal.language.languageData.broadcast.labelToUser +  (param.message.sender.id === this.ids.myid ?param.message.toUserNickname:'你') + TkGlobal.language.languageData.broadcast.labelSay;

            this.appendChatList({
                time: time,
                strmsg: param.message.toUserID === ""?param.message.msg:toWho + " " + param.message.msg,
                chatType: param.message.type,
                who: sender.nickname,
                id: sender.id,
                roleNum: sender.role,
                isTeacher: isTeacher,
                fromID: sender.id,
                msgtype:param.message.msgtype,
            });
            this.setState({
                isBarrageShow: parseInt(ServiceRoom.getTkRoom().getRoomProperties().barrage) === 1,
            });
        }
        if(!this.state.isBarrageLocked){
            eventObjectDefine.CoreController.dispatchEvent({
                type:'barrage',
                message: {content: param.message.msg},
            });
        }
    }


    handlerRoomTextMessage(param){
        const that = this ;
        let time=that.getSendTime(TkGlobal.playback,param.message.ts);
        let sender = that.props.isBroadcast ? param.message.sender:param.user;
        let isTeacher = sender.role == TkConstant.role.roleChairman || sender.role == TkConstant.role.roleTeachingAssistant;
        //客户端收到服务器来的广播聊天消息,添加到所有用户消息框里
        if(param.message.type === 0){
            if(TkGlobal.isBroadcast){

                that.countChat += 1;

                if(that.chatMaxCount < that.countChat){
                    that.lastReceiveChatList.push(param);
                    setTimeout(function(){
                        let count = 0;
                        let length = that.lastReceiveChatList.length;
                        let i = 0;
                        if(length > 0 )
                            i = length-1;
                        that.handlerReceiveMessage(that.lastReceiveChatList[i]);
                        that.lastReceiveChatList = [];
                    },1000);                        //延时两秒处理
                } else {
                    that.handlerReceiveMessage(param);
                }

            } else {
                that.appendChatList({
                    time: time,
                    strmsg: param.message.msg,
                    chatType: param.message.type,
                    who: sender.nickname,
                    id: sender.id,
                    roleNum: sender.role,
                    isTeacher: isTeacher,
                    fromID: sender.id,
                    msgtype:param.message.msgtype,
                });
            }
        } else {
            that.appendChatList({
                time: time,
                strmsg: param.message.msg,
                id: param.message.id,
                roleNum: sender.role,
                chatType: param.message.type,
                isTeacher: isTeacher,
                who:  sender.nickname,
                hasPassed: param.message.hasPassed,
                fromID: sender.id,
                msgtype:param.message.msgtype,
            });
        }
    };

    handlerRoomUserpropertyChanged(param){
        const that = this ;
        let userid=param.user.id;

        let changeUserproperty = param.message;
        for (let [key, value] of Object.entries(changeUserproperty)) {
            if (key === "isInBackGround" && (TkConstant.hasRole.roleTeachingAssistant || TkConstant.hasRole.roleChairman || TkConstant.hasRole.rolePatrol)) {
                if (value === true) {//收到手机端按home键的信息
                    let user = ServiceRoom.getTkRoom().getUsers()[userid];
                    let time = that.getSendTime(TkGlobal.playback,0);
                    let homeRemindText = user.nickname + "（" + user.devicetype + "）" + TkGlobal.language.languageData.alertWin.call.prompt.homeBtnRemind.leave.text;
                    that.notice(time,homeRemindText);
                }else if (value === false){
                    let user = ServiceRoom.getTkRoom().getUsers()[userid];
                    let time = that.getSendTime(TkGlobal.playback,0);
                    let homeRemindText = user.nickname + "（" + user.devicetype + "）" + TkGlobal.language.languageData.alertWin.call.prompt.homeBtnRemind.join.text;
                    that.notice(time,homeRemindText);
                }
            }
        }

        if(userid==that.ids.myid && userid!=that.ids.teacherid && !TkGlobal.playback){//只给我自己且不是教师并且不是回放者提醒消息
            let mediatype=param.message.publishstate;//音视频权限号码 gg
            let drawtype=param.user.candraw;//画笔权限
            let raisehand=param.message.raisehand;//举手
            if(raisehand != undefined){
                that.property.raiseHand=raisehand;
            }

            let time=that.getSendTime(TkGlobal.playback,0);

            if(mediatype != undefined){
                if((that.property.publishState==3&&mediatype==1)||(that.property.publishState==2&&mediatype==4)){//视频取消
                    that.notice(time,TkGlobal.language.languageData.alertWin.call.prompt.publishStatus.stream.videooff.text);
                }
                if((that.property.publishState==3&&mediatype==2)||(that.property.publishState==1&&mediatype==4)){//音频取消
                    that.notice(time,TkGlobal.language.languageData.alertWin.call.prompt.publishStatus.stream.audiooff.text);
                }
                if((that.property.publishState==4&&mediatype==1)||(that.property.publishState==2&&mediatype==3)){//音频开启
                    that.notice(time,TkGlobal.language.languageData.alertWin.call.prompt.publishStatus.stream.audioon.text);
                }
                if((that.property.publishState==4&&mediatype==2)||(that.property.publishState==1&&mediatype==3)){//'视频开启'
                    that.notice(time,TkGlobal.language.languageData.alertWin.call.prompt.publishStatus.stream.videoon.text);
                }
                if(that.property.publishState == 0&&mediatype){//点击上课，音视频都开启了,上台，提醒上台;老师取消学生举手
                    that.notice(time,TkGlobal.language.languageData.alertWin.call.prompt.publishStatus.stream.yes_status_3.text);
                }

                if(mediatype == 0){//下台 gg
                    that.notice(time,TkGlobal.language.languageData.alertWin.call.prompt.publishStatus.stream.no_status_0.text);

                }

                that.property.publishState=mediatype;//将现有状态保存
            }

            if(drawtype != undefined){
                if(param.user.publishstate){ //上台时才提醒
                    if(drawtype!=that.property.drawtype){//涂鸦权限改变了才提醒
                        if(drawtype){//涂鸦权限
                            that.notice(time,TkGlobal.language.languageData.alertWin.call.prompt.chat.literally.yes.text)
                        }else{
                            that.notice(time,TkGlobal.language.languageData.alertWin.call.prompt.chat.literally.no.text)
                        }
                        that.property.drawtype=drawtype;//将现有状态保存
                    }
                }else{//下台时将涂鸦权限的初始值置为false，防止出现授权涂鸦后下台，上台时因默认无涂鸦权限而提醒取消涂鸦
                    that.property.drawtype= drawtype;
                }
            }
        }
    };

    handlerRoomPlaybackClearAll(){
        let that = this;
        this.state.chatList.length = 0 ;
        this.state.quizList.length = 0 ;
        that.setState({
            broadcastFlag:undefined ,
            chatList:this.state.chatList,
            quizList:this.state.quizList,
            inputHide:true ,//是否是巡课或者回放者,默认框不显示
            liveNoticeBoard:'', //公告内容
            // liveNoticeInform:'',//通知内容
            liveBroadcast:'',//广播内容
            liveAllNoTalking:undefined,//全体禁言
            userlists:[],
            selectUserID:undefined,
            selectUserNickname:'',
            isBarrageLocked: true, // 弹幕开关
            isBarrageShow: undefined,
        });
        that.selectBox = {
            teacherOnly: false,
            selfOnly: false,
        }
        that.property = {
            publishState:0,
            drawtype:false,
            raiseHand:undefined
        };
        that.ids={
            teacherid:'', 
            myid:''
        };
        that.chatIndex = 'chat' ;
        that.quizIndex = 'quiz' ;
        that.isTeacher = TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant;
        that.intervalChat = that.isTeacher ? 0 : 10;     // 聊天发送间隔，常量
        that.intervalQuiz = that.isTeacher ? 0 : 120;   // 提问发送间隔，常量
        that.timeChat = 0;                               // 聊天发送间隔时间
        that.timeQuiz = 0;                               // 提问发送间隔时间
        that.timerChat = undefined;                      // 聊天间隔计时器
        that.timerQuiz = undefined;                      // 提问间隔计时器
        that.userlist = [];
    };

    handleInputToSend(value){
        const that = this ;
        const isTeacher = TkConstant.hasRole.roleChairman;
        const isTeachingAssistant = TkConstant.hasRole.roleTeachingAssistant;
        if( value.value && $.trim( value.value ) ){
            let identity =  undefined ; 
            let code = that.props.selectChat === that.chatIndex ? 0 : (that.props.selectChat === that.quizIndex? 1 : undefined ) ;


            if(!TkGlobal.classBegin && code === 1){
                //如果没上课并且是提问就返回
                return ;
            }

            let dataToServer = {
                msg: value.value,
                type: code,
                id:  TkGlobal.isBroadcast?(code==0?that._getChatDataID():that._getQuizDataID()):ServiceRoom.getTkRoom().getMySelf().id,
                time: that.getSendTime(),
                toUserID:this.state.selectUserID,
                toUserNickname:this.state.selectUserNickname
            }
            if(value.msgtype){
                dataToServer.msgtype = value.msgtype ;
            }

            // 由于服务器分服，对sender数据做兼容性处理
            dataToServer.sender = TkGlobal.isBroadcast ? {
                id: ServiceRoom.getTkRoom().getMySelf().id,
                role: ServiceRoom.getTkRoom().getMySelf().role,
                nickname: ServiceRoom.getTkRoom().getMySelf().nickname,
            } : undefined;
            switch (code) {
                case 0: // 若为chat界面
                    if(this.timeChat > 0 && TkGlobal.isBroadcast){
                        this.intervalTips(code, this.timeChat);
                        return;
                    }
                    if(TkGlobal.isBroadcast){
                        ServiceSignalling.sendTextMessage(dataToServer, this.state.selectUserID?[this.state.selectUserID, ServiceRoom.getTkRoom().getMySelf().id]:undefined);
                    } else {
                        if (identity) {
                            ServiceSignalling.sendTextMessage(dataToServer, identity);
                        } else {
                            ServiceSignalling.sendTextMessage(dataToServer);
                        };
                    }
                    this.timeChat = this.intervalChat;
                    if(!isTeacher)
                        this.timerChat = setInterval(function(){that.timer(code)}, 1000);
                    break;
                case 1: // 若为question界面
                    if(this.timeQuiz > 0 && !value.associatedMsgID){
                        this.intervalTips(code, this.timeQuiz);
                        return;
                    }
                    if(!TkGlobal.classBegin){   return ;    }

                    if(value.associatedMsgID && isTeacher){
                        ServiceSignalling.sendSignallingFromLiveQuestions(false, dataToServer.id, dataToServer, '__all', value.associatedMsgID);
                    }else if(isTeacher || isTeachingAssistant){ // 若为老师仍发布聊天信息
                        dataToServer.hasPassed = true;
                        ServiceSignalling.sendSignallingFromLiveQuestions(false, dataToServer.id, dataToServer);
                    }else{
                        let toId = '__allSuperUsers';
                        // that.appendChatList(that.getSendTime(),value.value,code,"您的问题已提交，请耐心等待审核");
                        that.appendChatList({
                            time: that.getSendTime(),
                            chatType: code,
                            who: TkGlobal.language.languageData.quiz.studentAskRemind.part1 + value.value + 
                                 TkGlobal.language.languageData.quiz.studentAskRemind.part2,
                        });
                        
                        dataToServer.hasPassed = false;
                        ServiceSignalling.sendTextMessage(dataToServer, toId);
                    };

                    this.timeQuiz = this.intervalQuiz;
                    if(!isTeacher)
                        this.timerQuiz = setInterval(function(){that.timer(code)}, 1000);
                    break;
                case undefined:
                    return;
                    break;
                default:
                    return;
                    break;
            }
          
        }
    };

    intervalTips(type, interval){
        this.appendChatList({
            time: this.getSendTime(),
            chatType: type,
            who: TkGlobal.language.languageData.quiz.intervalTips.part1 + interval + TkGlobal.language.languageData.quiz.intervalTips.part2,
        });
    }

    //抽奖、投票、点名等活动开启时发送提示文字
    functionStartTips(type, msg){
        let data = {
            time: this.getSendTime(),
            chatType: 0,
        }
        switch(parseInt(type)){
            case 0:
                //点名
                data.who = msg;
                this.appendChatList(data);
                break;
            case 1:
                //抽奖
                data.who = msg;
                this.appendChatList(data);
                break;
            case 2:
                //投票
                data.who = msg;
                this.appendChatList(data);
                break;
        }
        
    }


    timer(type){
		switch(type){
			case 0:
				if(this.timeChat <= 0){
				    clearInterval(this.timerChat);
				    this.timerChat = undefined;
				    return;
				  }else {
				    this.timeChat --;
				  }
				break;

			case 1:
				if(this.timeQuiz <= 0){
					clearInterval(this.timerQuiz);
					this.timerQuiz = undefined;
				    return;
				  }else {
				    this.timeQuiz --;
				  }
				break;
		}
	}

    handlerCloseNotice(){
        const self = this;
        
        self.setState({
            liveNoticeBoard: undefined,
        })
    }

    _getQuizDataID(){
        let dataID = 'quiz_' + ServiceRoom.getTkRoom().getMySelf().id + '_' + TkUtils.getGUID().getGUIDDate() + TkUtils.getGUID().getGUIDTime()
        return dataID;
    }

    _getChatDataID(){
        let dataID = 'chat_' + ServiceRoom.getTkRoom().getMySelf().id + '_' + TkUtils.getGUID().getGUIDDate() + TkUtils.getGUID().getGUIDTime()
        return dataID;
    }

    getSendTime(playback , ts){//获取当前时间或时间戳时间
        const that=this;
        let time;
        if(playback && ts!= undefined){//是回放者
            let now=new Date(parseInt(ts));
            time=that.toTwo(now.getHours())+':'+that.toTwo(now.getMinutes());
        }else{
            time=that.toTwo(new Date().getHours())+':'+that.toTwo(new Date().getMinutes());
        }
        return time;
    }

    getTimeStamp(){
        return TkUtils.getGUID().getGUIDDate() + TkUtils.getGUID().getGUIDTime();
    }
    
    switchParent(code){//聊天为0，提问为1，根据0 1 赋值父节点的class值,使得发送的信息添加到哪个父节点下
        let parentNode='';
        switch(code){
            case 0:parentNode='chatPartContainer';break;
            case 1:parentNode='quizPartContainer';break;
            case 2:parentNode='chatPartContainer';break;
        }
        return parentNode;
    }

    switchRole(num){//根据角色代码转换为字，跟在用户名后面，只需要老师和助教
        let person='';
        switch (num) {
            case TkConstant.role.roleChairman:
                person = '( ' + TkGlobal.language.languageData.videoContainer.sendMsg.tips.teacher + ' )';
                break;
            case TkConstant.role.roleTeachingAssistant:
                person = '( ' + TkGlobal.language.languageData.videoContainer.sendMsg.tips.assistant + ' )';
                break;
            default:
                break;
        }
        return person;
    }

    toTwo(num){//时间个位数转十位数
        if(parseInt(num/10)==0){
            return '0'+num;
        }else{
            return num;
        }
    }

    notice(time,who){//通知消息
        let that=this;
        let $element,top,scrollHeight;
        if( that.refs.chatPartContainer && ReactDom.findDOMNode(that.refs.chatPartContainer) ){
            $element =  $( ReactDom.findDOMNode(this.refs.chatPartContainer)  ) ;
            if($element && $element.length>0){
                scrollHeight = $element[0].scrollHeight;
            }
        }
        that.setState({
            chatList:that.state.chatList.concat([{
                time,
                who
            }])
        });
        setTimeout(()=>{
            if( that.refs.chatPartContainer && ReactDom.findDOMNode(that.refs.chatPartContainer) ){
                if($element && $element.length>0){
                    if ($element.height()+$element[0].scrollTop+5 >= scrollHeight) {
                        top=  $element[0].scrollHeight - $element.height() ;
                        $element.scrollTop(top)//将滚动条始终置底
                    }
                }
            }
        },300)
        
    }

    replace_em(str){//发送的表情代码正则转为图片
        if(!str) return;

        if(str.indexOf())

        str = str.replace(/\</g,'&lt;').replace(/\>/g,'&gt;').replace(/\n/g,'<br/>').replace(/ /g,'&nbsp;');

        if(str.indexOf('em')!=-1){
            str = str.replace(/\[em_([1-8]*)\]/g,function(str,str1){
                return '<img src='+"./img/"+str1+".png"+' border="0" />' ;
            })
        }

        return	<span  dangerouslySetInnerHTML={{__html: str}} ></span>
    }

    deleteItemById(id){
        let newQuizList = [];

        this.state.quizList.forEach((item, index) => {
            if(item.id !== id){
                let ansList = [];

                if(Array.isArray(item.ansList) ) {
                    item.ansList.forEach((ansItem, ansIndex) => {
                        if(ansItem.id !== id){
                            ansList.push(ansItem);
                        } 
                    });
                }
                
                item.ansList = ansList;
                newQuizList.push(item);
            }
        });

        this.setState({
            quizList: newQuizList,
        });
    }

    appendChatList(data){//添加聊天记录列表
        let that=this;
        let role=this.switchRole(data.roleNum) || '';
        let msg= data.msgtype ==='onlyimg'?data.strmsg:that.replace_em(data.strmsg);
        //如果是我自己 需要在用户名后跟着我字样
        if(data.chatType == 1){//提问
            // let markID = data.id ? data.id + '_' + that.getTimeStamp() : '';
            if(!data.associatedMsgID){
                that.setState({
                    quizList:that.state.quizList.concat([
                        {
                            id: data.id,
                            who: data.who,
                            tips: data.id==that.ids.myid?'( '+TkGlobal.language.languageData.videoContainer.sendMsg.tips.me+' )':role,
                            time: data.time,
                            msg: msg,
                            styleName: data.fromID==that.ids.myid?"isme": data.isBrd ? 'brd' : '',
                            type: data.chatType,
                            associatedMsgID: data.associatedMsgID,
                            remind: data.remind ? data.remind : '',
                            hasPassed: data.hasPassed,
                            isTeacher: data.isTeacher,
                            fromID: data.fromID,
                            sender: data.sender,
                            msgtype: data.msgtype,
                        }
                    ])
                });
            }else {
                if(Array.isArray(that.state.quizList) ){
                    let newQuizList = [],
                        targetItem = {};
                    that.state.quizList.forEach( (item,index) => {
                        if(item.id === data.associatedMsgID){
                            item.ansList = item.ansList ? item.ansList : [];
                            item.ansList.push(
                                {
                                    id: data.id,
                                    who: data.who,
                                    tips: data.id==that.ids.myid?'( '+TkGlobal.language.languageData.videoContainer.sendMsg.tips.me+' )':role,
                                    time: data.time,
                                    msg: msg,
                                    styleName:'',
                                    type: data.chatType,
                                    associatedMsgID: data.associatedMsgID,
                                    isTeacher: data.isTeacher,
                                    fromID: data.fromID,
                                    sender: data.sender,
                                    msgtype: data.msgtype,
                                }
                            );
                            if(that.isTeacher){
                                newQuizList.push(item);
                            }else {
                                targetItem = item
                            };
                        }else {
                            newQuizList.push(item);
                        }
                    });
                    if(!that.isTeacher){
                        newQuizList.push(targetItem);
                    }

                    that.setState({
                        quizList : newQuizList,
                    });
                }
            }
        }else if(data.chatType == 0){
            that.setState({
                chatList:that.state.chatList.concat([
                    {
                        id: data.id,
                        who: data.who,
                        tips: data.fromID==that.ids.myid?'( '+TkGlobal.language.languageData.videoContainer.sendMsg.tips.me+' )':role,
                        time: data.time,
                        msg: msg,
                        styleName: data.fromID==that.ids.myid?"isme": data.isBrd ? 'brd' : '',
                        type: data.chatType,
                        isTeacher: data.isTeacher,
                        fromID: data.fromID,
                        sender: data.sender,
                        msgtype: data.msgtype,
                    }
                ])
            });
        }
        setTimeout(()=>{
            let parentNode=that.switchParent(data.chatType);
            let $element,top,scrollHeight;
            if( this.refs[parentNode] && ReactDom.findDOMNode(this.refs[parentNode]) ){
                $element =  $( ReactDom.findDOMNode(this.refs[parentNode])  ) ;
                if($element && $element.length>0){
                    
                    scrollHeight = $element[0].scrollHeight;
                    $element[0].scrollTop = $element[0].scrollHeight;//将滚动条始终置底
                }

            }
        },300)

    };

    /*重置聊天列表*/
    _resetChatList(){
        this.setState({
            chatList:[],
            quizList:[],
        });
    };

    getLocalStorage(){
        let that = this;
        let noTalkUsersData = L.Utils.localStorage.getItem("noTalkUsersData");
             noTalkUsersData = noTalkUsersData?JSON.parse(L.Utils.localStorage.getItem("noTalkUsersData")):"";
        if(noTalkUsersData !== null) {

            if (noTalkUsersData.action === 0 && noTalkUsersData.roomNumber === TkConstant.joinRoomInfo.serial) {
                let currTime = noTalkUsersData.currTime;
                let intervalTime = noTalkUsersData.intervalTime;
                let systemTime = TkUtils.getGUID().getGUIDDate() + TkUtils.getGUID().getGUIDTime();
                if ((systemTime - currTime) < intervalTime) {
                    that.appendChatList({
                        time: that.getSendTime(),
                        chatType: 0,
                        who: TkGlobal.language.languageData.broadcast.noTalkingToUser
                    });
                    that.setState({
                        liveAllNoTalking:true,
                    });
                    setTimeout( () => {
                        that.setState({
                            liveAllNoTalking:false,
                        });
                    }, (intervalTime - (systemTime - currTime))* 10 );
                    //return true;
                }
            }
        }
        //return false;
    }

    _handlerSendUserNoTalk(userid){
        let mySelf = ServiceRoom.getTkRoom().getMySelf();
        if(mySelf.role === TkConstant.role.roleChairman || mySelf.role === TkConstant.role.roleTeachingAssistant) { //老师和助教才能禁言
            let id = 'noTalking_'+ TkConstant.joinRoomInfo.serial;
            let isDelMsg = false;
            let toID = userid;
            let data = {time: 300};
            let dot_not_save = true;
            //toID.push(userid);
            //toID.push("__allSuperUsers");
            ServiceSignalling.sendSignallingFromLiveAllNoTalking(isDelMsg, id, toID, data, dot_not_save);
        }
    }



    handlerSendAllNoTalk(){
        this.setState({ntToggle: !this.state.ntToggle}, ()=> {
            let mySelf = ServiceRoom.getTkRoom().getMySelf();
            if(mySelf.role === TkConstant.role.roleChairman || mySelf.role === TkConstant.role.roleTeachingAssistant) { //老师和助教才能禁言
                let id = 'allNoTalking_'+ TkConstant.joinRoomInfo.serial;
                let flag = this.state.ntToggle;
                let isDelMsg = false;
                let toID = "__all";
                let data = {};
                let dot_not_save = false;
                //Log.error('发送禁言',flag)
                if (flag) {
                    ServiceSignalling.sendSignallingFromLiveAllNoTalking(isDelMsg, id, toID, data);
                    // Log.error('发送禁言信令',isDelMsg)
                } else {
                    isDelMsg = true;
                    ServiceSignalling.sendSignallingFromLiveAllNoTalking(isDelMsg, id, toID, data);
                    // Log.error('发送禁言信令',isDelMsg)
                }
            }
        });
    }

    handlerEvictSpecificUserAndNoTalk(type){
        let that = this;
        let mySelf = ServiceRoom.getTkRoom().getMySelf();
        if(mySelf.role === TkConstant.role.roleChairman || mySelf.role === TkConstant.role.roleTeachingAssistant) //老师和助教不能互踢
            return;

        //房间号,当前时间,动作0：禁言，1：踢出房间,间隔时长 单位毫秒，2位毫秒
        let evictUsersData = {"roomNumber":TkConstant.joinRoomInfo.serial,"currTime":that.getTimeStamp(),"action":type,"intervalTime":type==1?180000:30000};
        let evictUserItem = type==1?"evictUsersData":"noTalkUsersData";
        evictUsersData = JSON.stringify(evictUsersData)
        L.Utils.localStorage.setItem(evictUserItem,evictUsersData);
        
        //把自己踢出房间,断网 //
        if(type === 1) {
            //提示，被踢出房间
            ServiceTooltip.showPrompt(TkGlobal.language.languageData.broadcast.kickoutTipInform);
            ServiceRoom.getTkRoom().leaveroom(true);
        }
    }

    _handlerSendKickOut(userid){
        let isDelMsg = false;
        let mySelf = ServiceRoom.getTkRoom().getMySelf();
        let toID = userid;
        let data = {time:"1800"};
        let dot_not_save = false;

        if(mySelf.role === TkConstant.role.roleChairman || mySelf.role === TkConstant.role.roleTeachingAssistant) { //老师和助教才能踢人
            ServiceSignalling.sendSignallingFromLiveEvictSpecificUser(isDelMsg, mySelf.id, toID, data, dot_not_save);
        }
    }

    _handlerLiveuserlistAdd(userid,userrole){

        let that = this;
        let users = that.userlist;
        let flag = false;
        for(let i=0; i< users.length; i++){
            if(users[i].value === userid) {
                flag = true;
                that.setState({
                    selectUserID:userid,
                    selectUserNickname:userrole.length > 10? userrole.substr(0,10) + "...":userrole
                });
                break;
            }
        }
        if(!flag){
            let data = {};
            data.value = userid;
            data.nickname = userrole.length > 10? userrole.substr(0,10) + "...":userrole;
            that.userlist.push(data);
            that.setState({userlists:this.userlist});
            that.setState({
                selectUserID:userid,
                selectUserNickname:data.nickname
            });
        }
    }

    handleBarrage(){
        this.setState({
            isBarrageLocked : !this.state.isBarrageLocked,
        });
        eventObjectDefine.CoreController.dispatchEvent({
            type:'barrageToggle',
            message: {
                isLocked: this.state.isBarrageLocked,
            },
        });
    }

    isTeacherAndAssistant(){
        let that = this;
        let role = ServiceRoom.getTkRoom().getMySelf().role;
        if(role === TkConstant.role.roleTeachingAssistant || role === TkConstant.role.roleChairman){
            return true;
        }
        return false;
    }

    handleUserChange(event){
        let that = this;
        //that.setState({selectUserID:event.target.value});
        if(event && event.target !== undefined){
            that.setState({
                selectUserID:event.target.value,
                selectUserNickname:event.target.options[event.target.selectedIndex].text
            });
        }
    }

    select(handle, data){
        let that = this;
        let isDesabled = ( !TkGlobal.classBegin && !that.isBeforeClassInteraction ) || ( !TkGlobal.classBegin && !that.isAfterClassInteraction ) ;
        let mySelf = ServiceRoom.getTkRoom().getMySelf();
        if(mySelf.role === TkConstant.role.roleChairman || mySelf.role === TkConstant.role.roleTeachingAssistant){
            if(isDesabled || ( !TkGlobal.classBegin && this.props.selectChat == this.quizIndex) )  return;
        }else {
            if(isDesabled || that.state.liveAllNoTalking || ( !TkGlobal.classBegin && this.props.selectChat == this.quizIndex) ) return
        }

        let obj = {};
        // Log.error('触发了')
        switch (handle) {
            case 't':       // 只看老师点击事件
                obj = this.state.selectBox;
                obj.teacherOnly = !obj.teacherOnly;
                this.setState({
                    selectBox: obj,
                },() => {
                    eventObjectDefine.CoreController.dispatchEvent({
                        type:'textMessageFilter',
                        message: this.state.selectBox,
                    });
                });
                break;
            case 's':       // 只看自己点击事件
                obj = this.state.selectBox;
                obj.selfOnly = !obj.selfOnly;
                this.setState({
                    selectBox: obj,
                },() => {
                    eventObjectDefine.CoreController.dispatchEvent({
                        type:'textMessageFilter',
                        message: this.state.selectBox,
                    });
                });
                break;
            case 'p':       // 图片上传点击事件
                eventObjectDefine.CoreController.dispatchEvent({
                    type:'picClick',
                    message: {},
                });
                break;
            case 'n':       // 禁言点击事件
                this.handlerSendAllNoTalk();
                break;
            case 'e':       // 表情点击事件
                // if(mySelf.role === TkConstant.role.roleAudit){
                //     if(isDesabled || that.state.liveAllNoTalking ) return
                // }
                eventObjectDefine.CoreController.dispatchEvent({
                    type:'emotionClick',
                    message: {},
                });
                break;
            case 'b':       // 弹幕点击事件
                this.handleBarrage();
                break;
        
            default:
                break;
        }
    }

    _loadSelectBox(){
        let that = this;
        let selectBoxComponents = undefined;
        let isTeacher = that.isTeacherAndAssistant();
        let options = [];
        let isDesabled = ( ( !TkGlobal.classBegin && !that.isBeforeClassInteraction ) || ( !TkGlobal.classBegin && !that.isAfterClassInteraction ) ) ? true : false ;
        
        // let isDisabled = !that.isBeforeClassInteraction || !that.isBeforeClassInteraction ? true : false ;
        for(let option in this.state.userlists){
            options.push(<option key={option} value = {this.state.userlists[option].value} >{this.state.userlists[option].nickname}</option>)
        };

        if(isTeacher){          
            selectBoxComponents = <div className="select-box" style={{display:!this.props.isBroadcast || this.state.inputHide?'none':'block'}}>
                <span onClick={this.select.bind(this, 's', {})}
                        className={"icon onlyme"+(this.state.selectBox.selfOnly ? '-p': '')} 
                        style={{verticalAlign: 'middle',height: '.4rem', width: '.4rem',}} 
                        disabled={ isDesabled } 
                        title={TkGlobal.language.languageData.quiz.onlySelf}></span>
                <span onClick={this.select.bind(this, 'n', {})}
                        className={"icon notalking"+(this.state.ntToggle ? '-p': '')} 
                        style={{display: this.props.selectChat==this.chatIndex ? '':'none', verticalAlign: 'middle',height: '.4rem', width: '.4rem',}} 
                        disabled={ isDesabled }                       
                        title={TkGlobal.language.languageData.broadcast.allNoTalking}></span>
                <span  onClick={this.select.bind(this, 'b', {})}
                        className={"icon barrage"+(this.state.isBarrageLocked ? '': '-p')} 
                        style={{display: this.props.selectChat==this.chatIndex && this.state.isBarrageShow ? '':'none',height: '.4rem', width: '.4rem',verticalAlign: 'middle'}} 
                        disabled={ isDesabled }              
                        title={TkGlobal.language.languageData.select.barrage}></span>
                <span onClick={this.select.bind(this, 'p', {})} 
                        className="icon pic" 
                        style={{display: this.props.selectChat==this.chatIndex && (this.state.selectUserID === '' || undefined)? '':'none',height: '.4rem', width: '.4rem',verticalAlign: 'middle'}} 
                        disabled={ isDesabled } 
                        title={TkGlobal.language.languageData.select.picture}></span>
                <span onClick={this.select.bind(this, 'e', {})} 
                        className="icon emotion" 
                        style={{display: this.props.selectChat==this.chatIndex ? '':'none' ,height: '.4rem', width: '.4rem',verticalAlign: 'middle'}} 
                        disabled={ isDesabled } 
                        title={TkGlobal.language.languageData.select.emotion}></span>
                    <div style = {{display: this.props.selectChat== this.chatIndex? '':'none',float:"right",marginRight: '.1rem'}}>
                <label className="label_user">{TkGlobal.language.languageData.broadcast.labelToUser + ":"}</label>
                <select style = {{color:"#000000",width:'auto'}} onChange = {that.handleUserChange.bind(that)} value={this.state.selectUserID}>
                    {options}
                </select>
            </div>
            </div>
        } else {
            selectBoxComponents = <div className="select-box" style={{display:!this.props.isBroadcast || this.state.inputHide?'none':'block'}}>
                <span onClick={this.select.bind(this, 't', {})} 
                        className={"icon onlyt"+(this.state.selectBox.teacherOnly ? '-p': '')}  
                        style={{verticalAlign: 'middle',height: '.4rem', width: '.4rem',}} 
                        disabled={ isDesabled } 
                        title={TkGlobal.language.languageData.quiz.onlyTeacher}></span>
                <span onClick={this.select.bind(this, 's', {})}
                        className={"icon onlyme"+(this.state.selectBox.selfOnly ? '-p': '')} 
                        style={{ verticalAlign: 'middle',height: '.4rem', width: '.4rem',}} 
                        disabled={ isDesabled } 
                        title={TkGlobal.language.languageData.quiz.onlySelf}></span>
                <span onClick={this.select.bind(this, 'b', {})}
                        className={"icon barrage"+(this.state.isBarrageLocked ? '': '-p')} 
                        style={{display: this.props.selectChat==this.chatIndex && this.state.isBarrageShow ? '':'none',height: '.4rem', width: '.4rem',verticalAlign: 'middle'}} 
                        disabled={ isDesabled || that.state.liveAllNoTalking } 
                        title={TkGlobal.language.languageData.select.barrage}></span>
                <span onClick={this.select.bind(this, 'e', {})} 
                        className="icon emotion" 
                        style={{display: this.props.selectChat==this.chatIndex ? '':'none' ,height: '.4rem', width: '.4rem',verticalAlign: 'middle'}} 
                        disabled={ ( that.state.liveAllNoTalking ? true : (isDesabled) ? true : false ) }
                        title={TkGlobal.language.languageData.select.emotion}></span>
                <div style = {{display: this.props.selectChat == this.chatIndex? '':'none',float:"right",marginRight: '.1rem'}}>
                    <label className="label_user">{TkGlobal.language.languageData.broadcast.labelToUser + ":"}</label>
                    <select style = {{color:"#000000",width:'auto'}} onChange = {that.handleUserChange.bind(that)} value={this.state.selectUserID} disabled={ ( that.state.liveAllNoTalking ? true : (isDesabled) ? true : false ) }>
                        {options}
                    </select>
                </div>
            </div>
        }
        return {selectBoxComponents:selectBoxComponents}
    }

    _loadChatListMessage() {
        let that = this;
        let chatListMessageComponents = undefined;
        let prompt="";
        let key = 0;

        if(that.state.broadcastFlag === undefined)
            prompt=TkGlobal.language.languageData.alertWin.call.fun.audit.title.text;
        else if(that.state.broadcastFlag === false)
            if(this.props.selectChat==this.quizIndex)
            prompt=TkGlobal.language.languageData.alertWin.call.fun.audit.ended.text;

        if(this.props.selectChat==this.quizIndex)
            prompt=TkGlobal.language.languageData.alertWin.call.fun.audit.bfQuiz.text;

        let {selectBoxComponents} = that._loadSelectBox();
        if(TkGlobal.isBroadcast){
            chatListMessageComponents =  <div style={{height:'100%'}}>
                <ChatListMessageDumb ref='chatPartContainer' type="chat" prompt={prompt} liveSendKickOut = {this._handlerSendKickOut.bind(this)} liveUserlistAdd = {this._handlerLiveuserlistAdd.bind(this)} sendUserNoTalk = {this._handlerSendUserNoTalk.bind(this)} isBroadcast={this.props.isBroadcast} chatMessageList={this.state.chatList} liveNoticeBoard={this.state.liveNoticeBoard} show={this.props.selectChat== this.chatIndex} />
                <ChatListMessageDumb ref='quizPartContainer' type="quiz" prompt={prompt} isBroadcast={this.props.isBroadcast} chatMessageList={this.state.quizList} show={this.props.selectChat==this.quizIndex} />
                <div className="input-box" style={{display:this.state.inputHide?'none':'block'}}>
                    {selectBoxComponents}
                    <Input id="talk" isBroadcast={this.props.isBroadcast} liveAllNoTalking = {that.state.liveAllNoTalking} handleInputToSend={that.handleInputToSend.bind(that)}
                           selectChat={this.props.selectChat} canNotUse={this.props.selectChat===this.quizIndex && !this.state.broadcastFlag} isQuiz={this.props.selectChat==this.quizIndex} />
                </div>
            </div>
        } else {
            chatListMessageComponents = <div style={{height:'100%'}}>
                <ChatListMessageDumb ref='chatPartContainer' prompt={prompt} isBroadcast={this.props.isBroadcast} chatMessageList={this.state.chatList} show={this.props.selectChat== this.chatIndex} />
                <ChatListMessageDumb ref='quizPartContainer' prompt={prompt} isBroadcast={this.props.isBroadcast} chatMessageList={this.state.quizList} show={this.props.selectChat==this.quizIndex} />
                <div className="input-box" style={{display:this.state.inputHide?'none':'block'}}>
                    <Input id="talk"  handleInputToSend={that.handleInputToSend.bind(that)}
                           selectChat={this.props.selectChat} canNotUse={this.props.selectChat===this.quizIndex && !this.state.broadcastFlag}/>
                </div>
            </div>
        }

        return {chatListMessageComponents:chatListMessageComponents}

    }

	render(){
        const that = this;

        let {chatListMessageComponents} = that._loadChatListMessage();

		return(
            <section  className="chat-part" style={{display:this.props.chatContainerHide?'none':'block'}} >
                <Notice text={that.state.liveNoticeBoard} handleClose={that.handlerCloseNotice.bind(that)}/>
                {chatListMessageComponents}
            </section>
		)
	};
};

export default ChatContainer;
