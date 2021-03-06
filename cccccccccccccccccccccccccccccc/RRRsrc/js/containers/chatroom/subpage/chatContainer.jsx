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

class ChatContainer extends Component{
	constructor(props,context){
        super(props,context);
        this.myid='';
        this.state={
            broadcastFlag:undefined ,
            chatList:[],
            quizList:[],
            inputHide:true ,//是否是巡课或者回放者,默认框不显示
            liveNoticeBoard:'', //公告内容
            //liveNoticeInform:'',//通知内容
            liveBroadcast:'',//广播内容
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
        this.intervalQuiz = this.isTeacher ? 10 : 120;   // 提问发送间隔，常量
        this.timeChat = 0;                               // 聊天发送间隔时间
        this.timeQuiz = 0;                               // 提问发送间隔时间
        this.timerChat = undefined;                      // 聊天间隔计时器
        this.timerQuiz = undefined;                      // 提问间隔计时器
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
        this.down=function () {
            
        }

        //this.liveNoticeBoard=''; //公告内容
        //liveNoticeInform:'',//通知内容屏幕

    };

    componentDidMount() {
        const that = this ;
        eventObjectDefine.Document.addEventListener(TkConstant.EVENTTYPE.DocumentEvent.onFullscreenchange , that.handlerOnFullscreenchange.bind(that)   , that.listernerBackupid); //document.onFullscreenchange事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomConnected, that.handlerRoomConnected.bind(that) , that.listernerBackupid); //监听房间连接事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPubmsg , that.handlerRoomPubmsg.bind(that), that.listernerBackupid); //roomPubmsg事件  上课事件 classBegin
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDelmsg, that.handlerRoomDelmsg.bind(that) , that.listernerBackupid); //监听roomDelmsg
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomParticipantJoin, that.handlerRoomParticipantJoin.bind(that) , that.listernerBackupid); //监听用户加入
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomParticipantLeave, that.handlerRoomParticipantLeave.bind(that) , that.listernerBackupid); //监听用户离开
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomTextMessage, that.handlerRoomTextMessage.bind(that)  , that.listernerBackupid);//监听服务器的广播聊天消息
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomUserpropertyChanged,that.handlerRoomUserpropertyChanged.bind(that) , that.listernerBackupid);//监听学生权限变化
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPlaybackClearAllFromPlaybackController,that.handlerRoomPlaybackClearAll.bind(that) , that.listernerBackupid); //roomPlaybackClearAll 事件：回放清除所有信令
        eventObjectDefine.CoreController.addEventListener( "receive-msglist-ClassBegin" , that.handlerReceiveMsglistClassBegin.bind(that), that.listernerBackupid); //roomPubmsg事件
    };
    componentWillUnmount(){
        let that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid );
        eventObjectDefine.Document.removeBackupListerner(that.listernerBackupid );
    }
    componentDidUpdate(){
        this.down()
    }
   /* shouldComponentUpdate(newsProps,newState){
        if(newState.chatList.length!==this.state.chatList.length&&newState.quizList.length!==this.state.quizList){
            return true
        }
    }*/
    handlerOnFullscreenchange(){
        if(TkGlobal.playback){
            let $element,top;
            if(this.props.selectChat== this.chatIndex){
                if( this.refs.chatPartContainer && ReactDom.findDOMNode(this.refs.chatPartContainer) ){
                    $element =  $( ReactDom.findDOMNode(this.refs.chatPartContainer)  ) ;
                    if($element && $element.length>0){
                        top=  $element[0].scrollHeight - $element.height() ;
                        $element.scrollTop(top)//将滚动条始终置底
                    }
                }
            }
        }
    };

    // 接收到发布信令时的处理方法
    handlerRoomPubmsg(recvEventData){
        const that = this ;

        if( this.props.isBroadcast ){//是直播的话才处理
            let pubmsgData = recvEventData.message;

            switch(pubmsgData.name){
                case "ClassBegin":
                    //上课要设置变量
                    that.setState({
                        broadcastFlag:true
                    });
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
                    let sender = this.props.isBroadcast ? data.sender : ServiceRoom.getTkRoom().getUser(data.id.substr(5,40));
                    let isTeacher = sender.role === 0 || sender.role === 1;
                    
                    // 过滤，若为老师点击通过按钮则不进行插入操作
                    if( this.ids.myid === recvEventData.message.fromID && !recvEventData.message.associatedMsgID && this.ids.myid !== sender.id)return;

                    that.appendChatList({
                        time: data.time,
                        strmsg: data.msg,
                        chatType: data.type,
                        who: sender.nickname,
                        id : data.id,
                        isTeacher: isTeacher,
                        associatedMsgID: recvEventData.message.associatedMsgID,
                        hasPassed: data.hasPassed,
                        fromID: sender.id,
                    });
                    break;
            }
        }
    };

    // 接收到删除信令时的处理方法
    handlerRoomDelmsg(delmsgDataEvent){
        const that = this ;
        let delmsgData = delmsgDataEvent.message ;
        switch(delmsgData.name) {
            case "ClassBegin":
                if(!TkConstant.joinRoomInfo.isClassOverNotLeave && CoreController.handler.getAppPermissions('endClassbeginRevertToStartupLayout')) { //是否拥有下课重置界面权限
                    setTimeout( () => {
                        that._resetChatList();
                    } , 250 );
                }
                if(this.props.isBroadcast && !TkGlobal.isClient) {//是直播的话才处理
                    that.setState({
                        broadcastFlag:false
                    });
                }
                break;
            case "LiveQuestions":
                that.deleteItemById(delmsgDataEvent.message.id);
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
        that.setState({
            inputHide:TkConstant.hasRole.rolePatrol ||  TkConstant.hasRole.rolePlayback //判断人物身份是否是巡课身份或者回放者身份，巡课、回放者不需要聊天框
        });
        if(!that.isLoadWelcomeClassroom){
            that.isLoadWelcomeClassroom = true ;
            that.notice(undefined,'<p class="welcome-classroom">'+TkGlobal.language.languageData.welcomeClassroom.text+"（"+TkGlobal.language.languageData.welcomeClassroom.roomId+TkConstant.joinRoomInfo.serial+'）</p>');
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

    //  监听事件，服务端返回的数据↓
    handlerRoomTextMessage(param){
        const that = this ;
        let time=that.getSendTime(TkGlobal.playback,param.message.ts);
        let sender = this.props.isBroadcast ? param.message.sender:param.user;
        let isTeacher = sender.role === 0 || sender.role === 1;
        //客户端收到服务器来的广播聊天消息,添加到所有用户消息框里
        if(param.message.type === 0){
            that.appendChatList({
                time: time,
                strmsg: param.message.msg,
                chatType: param.message.type,
                who: sender.nickname,
                id: sender.id,
                roleNum: sender.role,
                isTeacher: isTeacher,
                fromID: sender.id,
                msgtype:param.message.msgtype
            });
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
                msgtype:param.message.msgtype
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
        this.setState({
            chatList:[],
            quizList:[],
            inputHide:TkConstant.hasRole.rolePatrol ||  TkConstant.hasRole.rolePlayback//是否是巡课或者回放者
        });
    };

    handleInputToSend(value){
        const that = this ;
        const isTeacher = TkConstant.hasRole.roleChairman;
        if( value.value && $.trim( value.value ) ){
            let identity =  undefined ; //todo 这里需要处理私聊
            let code = that.props.selectChat === that.chatIndex ? 0 : (that.props.selectChat === that.quizIndex? 1 : undefined ) ;

            let dataToServer = {
                msg: value.value,
                type: code,
                id:  that._getQuizDataID(),
                time: that.getSendTime(),
            }
            if(value.msgtype){
                dataToServer.msgtype = value.msgtype ;
            }

            // 由于服务器分服，对sender数据做兼容性处理
            dataToServer.sender = this.props.isBroadcast ? {
                id: ServiceRoom.getTkRoom().getMySelf().id,
                role: ServiceRoom.getTkRoom().getMySelf().role,
                nickname: ServiceRoom.getTkRoom().getMySelf().nickname,
            } : undefined;
            
            switch (code) {
                case 0: // 若为chat界面
                    if(this.timeChat > 0 && this.props.isBroadcast){
                        this.intervalTips(code, this.timeChat);
                        return;
                    }
                    if(identity){
                        ServiceSignalling.sendTextMessage(dataToServer,identity);
                    }else{
                        ServiceSignalling.sendTextMessage(dataToServer);
                    };

                    this.timeChat = this.intervalChat;
                    this.timerChat = setInterval(function(){that.timer(code)}, 1000);
                    break;
                case 1: // 若为question界面
                    if(this.timeQuiz > 0 && !value.associatedMsgID){
                        this.intervalTips(code, this.timeQuiz);
                        return;
                    }
                    if(value.associatedMsgID && isTeacher){
                        ServiceSignalling.sendSignallingFromLiveQuestions(false, dataToServer.id, dataToServer, '__all', value.associatedMsgID);
                    }else if(isTeacher){ // 若为老师仍发布聊天信息
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
                    }

                    this.timeQuiz = this.intervalQuiz;
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
            time=this.toTwo(now.getHours())+':'+this.toTwo(now.getMinutes());
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
        if( this.refs.chatPartContainer && ReactDom.findDOMNode(this.refs.chatPartContainer) ){
            $element =  $( ReactDom.findDOMNode(this.refs.chatPartContainer)  ) ;
            if($element && $element.length>0){
                scrollHeight = $element[0].scrollHeight;
            }
        }
        this.setState({
            chatList:that.state.chatList.concat([{
                time,
                who
            }])
        });
        if( this.refs.chatPartContainer && ReactDom.findDOMNode(this.refs.chatPartContainer) ){
            if($element && $element.length>0){
                if ($element.height()+$element[0].scrollTop+5 >= scrollHeight) {
                    top=  $element[0].scrollHeight - $element.height() ;
                    $element.scrollTop(top)//将滚动条始终置底
                }
            }
        }
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
        this.myid=ServiceRoom.getTkRoom().getMySelf().id
        let that=this;
        let parentNode=that.switchParent(data.chatType);
        this.parentNode=parentNode;
        let $element,top,scrollHeight;
        if( this.refs[parentNode] && ReactDom.findDOMNode(this.refs[parentNode]) ){
            $element =  $( ReactDom.findDOMNode(this.refs[parentNode])  ) ;
            this.$element=$element;
            if($element && $element.length>0){
                scrollHeight = $element[0].scrollHeight;
            }
        }
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
                            styleName: '',
                            type: data.chatType,
                            associatedMsgID: data.associatedMsgID,
                            remind: data.remind ? data.remind : '',
                            hasPassed: data.hasPassed,
                            isTeacher: data.isTeacher,
                            fromID: data.fromID,
                            sender: data.sender,
                            msgtype:data.msgtype
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
                                    styleName: '',
                                    type: data.chatType,
                                    associatedMsgID: data.associatedMsgID,
                                    isTeacher: data.isTeacher,
                                    fromID: data.fromID,
                                    sender: data.sender,
                                    msgtype:data.msgtype
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
                        msgtype:data.msgtype
                    }
                ])
            });
        }
//   手滑不回直接回到底部
        function down() {
            if( this.refs[parentNode] && ReactDom.findDOMNode(this.refs[parentNode]) ){
                 if($element && $element.length>0){
                     if ($element.height()+$element[0].scrollTop+36 >= scrollHeight) {
                         $element.scrollTop($element[0].scrollHeight)//将滚动条始终置底
                     }
                 }
             }
        }
        this.down=down
    };


/*
    componentDidUpdate(){
        let parentNode=this.parentNode;
        let $element=  $( ReactDom.findDOMNode(this.refs[parentNode])  );
        let scrollHeight;
        if($element && $element.length>0){
              scrollHeight = $element[0].scrollHeight;
        }

        if( this.refs[parentNode] && ReactDom.findDOMNode(this.refs[parentNode]) ){
            if($element && $element.length>0){
                if ($element.height()+$element[0].scrollTop+127 >= scrollHeight) {

                   let  top=  $element[0].scrollHeight - $element.height() ;
                    $element.scrollTop(top)//将滚动条始终置底
                }
            }
        }

    }*/


    /*重置聊天列表*/
    _resetChatList(){
        this.setState({
            chatList:[],
            quizList:[],
        });
    };

    handlerMsgFilter(event){
        let flag = event.target.checked;

        switch(event.target.value){
            case 't':
                this.selectBox = {
                    teacherOnly: flag,
                    selfOnly: this.selectBox.selfOnly,
                }
                break;
            case 's':
            this.selectBox = {
                teacherOnly: this.selectBox.teacherOnly,
                selfOnly: flag,
            }
                break;
        }

        eventObjectDefine.CoreController.dispatchEvent({
            type:'textMessageFilter',
            message: this.selectBox,
        });
    }
    height(e){

    }

	render(){
        const that = this;
        let prompt="";
        if(that.state.broadcastFlag === undefined){
            prompt=TkGlobal.language.languageData.alertWin.call.fun.audit.title.text;
        }else if(that.state.broadcastFlag === false){
            prompt=TkGlobal.language.languageData.alertWin.call.fun.audit.ended.text;
        }

		return(
            <section  className="chat-part" style={{display:this.props.chatContainerHide?'none':'block'}} >
                <Notice text={that.state.liveNoticeBoard} handleClose={that.handlerCloseNotice.bind(that)}/>
                <div style={{height:'100%'}}>
                    <ChatListMessageDumb ref='chatPartContainer' prompt={prompt} height={this.height.bind(this)} isBroadcast={this.props.isBroadcast} chatMessageList={this.state.chatList} myid={this.myid} show={this.props.selectChat== this.chatIndex} />
                    <ChatListMessageDumb ref='quizPartContainer' myid={this.myid} prompt={prompt} isBroadcast={this.props.isBroadcast} chatMessageList={this.state.quizList} show={this.props.selectChat==this.quizIndex} />
                    <div className="select-box" style={{display:!this.props.isBroadcast || this.state.inputHide?'none':'block', position: 'absolute', bottom: '.6rem'}}>
                        <input type="checkbox" className="vehicle" onChange={this.handlerMsgFilter.bind(this)} value="t"/><span style={{marginRight: '.2rem'}}>{TkGlobal.language.languageData.quiz.onlyTeacher}</span>
                        <input type="checkbox" className="vehicle" onChange={this.handlerMsgFilter.bind(this)} value="s"/><span>{TkGlobal.language.languageData.quiz.onlySelf}</span>
                    </div>
                    <div className="input-box" style={{display:this.state.inputHide?'none':'block'}}>
                        <Input id="talk" isBroadcast={this.props.isBroadcast} handleInputToSend={that.handleInputToSend.bind(that)}
                        selectChat={this.props.selectChat} canNotUse={this.props.selectChat==this.quizIndex && !this.state.broadcastFlag} />
                    </div>
                </div>
            </section>
		)
	};
};

export default ChatContainer;
