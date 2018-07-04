/**
 * videoContainer 组件
 * @module videoContainer
 * @description   提供 VideoContainer组件
 * @author xiagd
 * @date 2017/08/12
 */

'use strict';
import React  from 'react';
import TkGlobal from 'TkGlobal';
import Video from "../../../components/video/video";
import ServiceRoom from 'ServiceRoom' ;
import ServiceSignalling from 'ServiceSignalling' ;
import eventObjectDefine from 'eventObjectDefine';
import TkConstant from 'TkConstant';
import WebAjaxInterface from 'WebAjaxInterface' ;
import CoreController from 'CoreController' ;
import ServiceTooltip from 'ServiceTooltip' ;


class VVideoComponent extends React.Component{
    constructor(props){
        super(props);
        this.state= {
            stateChange:false,
            networkDelay:0,
            networkDelayColor:"#41BF33",
            backgroundModeFloatIsShow:false,
            giftnumberState:false,
            liveUserpropertyChanged:0,
        };
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
        this.classCss='vvideo';
        this.userid="";
        this.display='none';
        this.afterElementArray=[];
        this.buttonElementArray=[];
        this.studentElementArray=[];
        this.userNickName='';
        this.raisehand=false;
        this.buttonsStyle=false;
        this.studentStyle=false;
        this.giftnumberStyle=true;
        this.areaExchange = false;
        this.muteVideo = false;
        this.muteAudio = false;
        this.MySelf = ServiceRoom.getTkRoom().getMySelf();
        this.publishstate = 0;
    };

    componentDidMount(){
        let that = this;
        if (that.props.stream && that.props.stream.extensionId) {//tkpc2.0.8
            that.handleBackgroundModeFloat(that.props.stream.extensionId);//处理后台模式浮层
        }
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomUserpropertyChanged , that.handlerRoomUserpropertyChanged.bind(that) , that.listernerBackupid ); //room-userproperty-changed事件-收到参与者属性改变后执行更新
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDisconnected,that.handlerRoomDisconnected.bind(that) , that.listernerBackupid); //Disconnected事件：失去连接事件
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomParticipantLeave , that.handlerRoomParticipantLeave.bind(that) , that.listernerBackupid); //room-participant_leave事件-收到有参与者离开房间
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomParticipantJoin , that.handlerRoomParticipantJoin.bind(that) , that.listernerBackupid ); //room-participant_join事件-收到有参与者加入房间后执行添加用户到用户列表中
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that), that.listernerBackupid); //roomDelmsg事件 下课事件 classBegin
        //eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPlaybackClearAllFromPlaybackController,that.handlerRoomPlaybackClearAll.bind(that) , that.listernerBackupid); //roomPlaybackClearAll 事件：回放清除所有信令
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPubmsg ,that.handlerRoomPubmsg.bind(that)  ,  that.listernerBackupid ) ;//room-pubmsg事件：
        eventObjectDefine.CoreController.addEventListener( 'handleMyselfNetworkStatus', that.handleMyselfNetworkStatus.bind(that) ,that.listernerBackupid  );
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomMsglist, that.handlerRoomMsgList.bind(that), that.listernerBackupid);
        that._init();
        that._receviceStreamCompleted();

    };

    handlerRoomParticipantLeave(eventData) {
        this.handleBackgroundModeFloat(eventData.user.id);//处理后台模式浮层//tkpc2.0.8
        //this.setState({giftnumber:0});
    };
    handlerRoomParticipantJoin(eventData) {
        let user = eventData.user;
        this.handleBackgroundModeFloat(eventData.user.id);//处理后台模式浮层//tkpc2.0.8
        //this.setState({giftnumber:user.giftnumber});
    };

    componentWillUnmount(){
        let that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid );
        that._receviceStreamCompleted();
    }

    handlerRoomPubmsg(recvEventData){
        let pubmsgData = recvEventData.message;
        switch (pubmsgData.name) {
            case "sendNetworkState":
                let data = pubmsgData.data;
                this.handleNetworkStatus(data);
                break;
            case "ClassBegin":  //上课，调用一次打开音，视频
                if(TkGlobal.isBroadcast && TkGlobal.isClient){
                    this.userAudioOpenOrClose(ServiceRoom.getTkRoom().getMySelf().id);
                    this.userVideoOpenOrClose(ServiceRoom.getTkRoom().getMySelf().id);
                }
                break;
        }
    };

    handlerRoomDelmsg(recvEventData){
        let pubmsgData = recvEventData.message;
        switch (pubmsgData.name) {
            case "ClassBegin":  //下课
                if(TkGlobal.isBroadcast && TkGlobal.isClient){
                    this.muteVideo = false;
                    this.muteAudio = false;
                    this.publishstate = 0;
                }
                break;
        }
    }

    handlerRoomMsgList(recvEventData){

        const that = this;
        let messageListData = recvEventData.message;
        // Log.debug('messageListData',messageListData)
        let mySelf = ServiceRoom.getTkRoom().getMySelf();
        for(let x in messageListData) {
            if(messageListData[x].name == "ClassBegin") {
                if(TkGlobal.isBroadcast && TkGlobal.isClient){
                    this.muteVideo = true;
                    this.muteAudio = true;
                    this.publishstate = 3;
                }
            }
        };
    }

    handleMyselfNetworkStatus(handleData) {
        let that = this;
        let data = handleData.message.data;
        that.handleNetworkStatus(data);
    };
    handleNetworkStatus(data){
        let that = this;
        if (that.props.stream !== undefined) {
            let extensionId = that.props.stream.extensionId;
            if (data.extensionId === extensionId) {
                let {packetsLost , rtt} = data.networkStatus;
                this.state.networkDelay = rtt;
                if (packetsLost>5 && packetsLost<=10) {
                    this.state.networkDelayColor = "#ff8b2b";
                }else if (packetsLost>10) {
                    this.state.networkDelayColor = "#ff021d";
                }else {
                    this.state.networkDelayColor = "#41BF33";
                }
                this.setState({
                    networkDelay:this.state.networkDelay,
                    networkDelayColor:this.state.networkDelayColor,
                });
            }
        }
    };

    _receviceStreamCompleted(){
        this.props.receiveStreamCompleteCallback();
    }

    /*根据user生产用户描述信息*/
    _productionUserDescInfo(user,publishstate){
        const that = this ;
        const userDescInfo =  {
            id:user.id,
            disabled:false ,
            textContext:user.nickname ,
            order:user.role === TkConstant.role.roleStudent ? 0 : ( user.role === TkConstant.role.roleChairman?1:user.role === TkConstant.role.roleTeachingAssistant?2:3), //根据角色排序用户列表，数越小排的越往后 （order:0-学生 ， 1-老师 ， 2-暂时未定）
            afterIconArray:[
                {
                    disabled:true,
                    isHide:false ,
                    'className':'v-user-pen ' + (user.candraw? 'on' : 'off') ,
                } ,
                {
                    disabled:true,
                    isHide:!user.hasaudio  ,
                    'className':'v-device-microphone ' + ( (user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH  ) ?  'on' : 'off' ) + ' ' +( user.disableaudio ? 'disableaudio' : '') ,

                },
                {
                    disabled:true,
                    isHide:!user.hasvideo ,
                    'className':'v-device-video ' + ( ( user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH ) ? 'on' : 'off' )+ ' ' +( user.disablevideo ? 'disablevideo' : '') ,
                }
            ],
            buttonIconArray:[
                {
                    states:true,
                    text:user.candraw? 'no' : 'yes' ,
                    'className':'scrawl-btn' ,
                    'onClick':that.changeUserCandraw.bind(that, user.id )
                } ,
                {
                    states:true,
                    text:user.publishstate !== TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE ? 'no' : 'yes'  ,
                    'className':'platform-btn',
                    'onClick':that.userPlatformUpOrDown.bind(that, user.id )
                } ,
                {
                    states:user.hasaudio,
                    text:(publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY || publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH  ) ?  'no' : 'yes' ,
                    'className':'audio-btn',
                    'onClick':that.userAudioOpenOrClose.bind(that, user.id )
                } ,
                {
                    states:user.hasvideo,
                    text:( publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY || publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH ) ? 'no' : 'yes',
                    'className':'video-btn' ,
                    'onClick':that.userVideoOpenOrClose.bind(that, user.id )
                } ,
                {
                    states:true,
                    text:'yes'  ,
                    'className':TkConstant.hasRole.roleTeachingAssistant?'gift-btn display-none':'gift-btn',
                    'onClick':that.sendGiftToStudent.bind(that,user.id),
                } , 
                {
                    states: true,
                    text: 'text',
                    'className': 'areaExchange-btn',
                    'onClick': that.handlerAreaExchange.bind(that),
                } ,
                {
                    states: true,
					text: 'text',
                    'className':'oneKeyReset-btn' ,
                 	'onClick': that.handlerOneKeyReset.bind(that),
                }
            ],
            studentIconArray:[
                {
                    states:user.hasaudio,
					text:( user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH ) ? 'no' : 'yes',//tkpc2.0.8
                    'className':'audio-btn',
                    'onClick':that.userAudioOpenOrClose.bind(that, user.id )
                } ,
                {
                    states:user.hasvideo,
                    text:( user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY || user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH ) ? 'no' : 'yes',
                    'className':'video-btn' ,
                    'onClick':that.userVideoOpenOrClose.bind(that, user.id )
                },
            ],
            raisehand:user.raisehand,
        } ;

        if(!user.hasvideo && !user.hasaudio){
            //userDescInfo.afterIconArray.length = 0 ;
            //userDescInfo.buttonIconArray.length = 0 ;
        }
        return userDescInfo ;
    };

    //根据流获取user数据
    addUserData(stream) {
        let that = this;
        let userDescInfo={};

        if (stream.getID() > 0 || stream.getID() === "local") {
            let userid = stream.extensionId;
            const user = TkGlobal.isBroadcast?this.MySelf:ServiceRoom.getTkRoom().getUsers()[userid];
            if(!user)  { //什么情况下获取不到用户
                return {};
            }
            userDescInfo = that._productionUserDescInfo(user,that.publishstate);
            //that.setState()
            //that.setState({userDescInfo: userDescInfo});
        } /*else {
            userDescInfo = that._productionDefaultDescInfo(stream);
            //that.setState({userDescInfo: userDescInfo});
        }*/

        //处理图标按钮状态
        let {afterElementArray,buttonElementArray,studentElementArray}= that.loadUserDataProps(userDescInfo);
        return{
            afterElementArray:afterElementArray,
            buttonElementArray:buttonElementArray,
            studentElementArray:studentElementArray
        }
    };



    /*加载视频需要的user props*/
    loadUserDataProps(userDescInfo){
        let that = this;

        let userid = "";

        //加载图标按钮

        let {afterElementArray, buttonElementArray,studentElementArray} =this.loadIconArray(userDescInfo);
        return {
            afterElementArray,
            buttonElementArray,
            studentElementArray
        };

    };



    /*加载图标元素*/
    loadIconArray(userDescInfo){

        const afterElementArray = [], buttonElementArray = [],studentElementArray = [];

        const {id,disabled , textContext ,order , afterIconArray ,buttonIconArray,studentIconArray,raisehand} = userDescInfo ;

        this.userNickName=textContext;


        this.raisehand=raisehand;


        if(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant){//除了学生都隐藏
            this.buttonsStyle=true;
        }

        if(afterIconArray){
            afterIconArray.forEach( (value , index) =>{
                //value.attrJson = value.attrJson || {} ;
                const {disabled ,isHide ,className, onClick  } = value ;
                //const {id , title  , className , ...otherAttrs} =  attrJson ;
                //老师为1
                if ((order == 1 || order == 2) && (className.indexOf('v-device-video') != -1 || className.indexOf('v-device-microphone') == -1 )) {
                    const iconTemp = <button key={index}
                                             className={'' + (className ? className : '') + ' ' + (disabled ? ' disabled ' : ' ')}
                                             onClick={onClick && typeof onClick === "function" ? onClick : undefined}
                                             disabled={disabled ? disabled : undefined} id={id + "" + index}></button>;
                    afterElementArray.push(iconTemp)
                }  else if(order == 0) {  //学生为0
                    if(!isHide){
                        const iconTemp = <button key={index}
                                                 className={'' + (className ? className : '') + ' ' + (disabled ? ' disabled ' : ' ')}
                                                 onClick={onClick && typeof onClick === "function" ? onClick : undefined}
                                                 disabled={disabled ? disabled : undefined} id={id + "" + index}></button>;
                        afterElementArray.push(iconTemp)
                    }
                }

            });

        }

        if(buttonIconArray){
            buttonIconArray.forEach( (value , index) => {
                if(!TkGlobal.classBegin)
                    return;

                const {states,text, className, onClick} = value;
                //const {id , title  , className , ...otherAttrs} =  attrJson ;
                //老师为1
                if(states){
                    if ((order == 1 || order == 2) && (className === 'audio-btn'  || className === 'video-btn'  ||  (className === 'oneKeyReset-btn' && !TkGlobal.isBroadcast) || (className === 'areaExchange-btn' && TkGlobal.isBroadcast))){
                        let buttonName = className.split("-");
                        const iconTemp = <button key={index}
                                                 className={"" + (className ? className : '')}
                                                 onClick={onClick && typeof onClick === "function" ? onClick : undefined} style={{display:(ServiceRoom.getTkRoom().getRoomType()===TkConstant.ROOMTYPE.oneToOne && className === 'oneKeyReset-btn' ?"none":(TkConstant.hasRole.roleStudent?"none":"block"))}}> {TkGlobal.language.languageData.otherVideoContainer.button[buttonName[0]][text]} </button>;

                        buttonElementArray.push(iconTemp)
                    } else if((order == 0)  && (className != 'video-btn' && className != 'areaExchange-btn' && className != 'oneKeyReset-btn')){  //学生为0
                        let buttonName = className.split("-");
                        const iconTemp = <button key={index}
                                                 className={''+ (className ? className : '')}
                                                 onClick={onClick && typeof onClick === "function" ? onClick : undefined}>{TkGlobal.language.languageData.otherVideoContainer.button[buttonName[0]][text]}</button>;

                        buttonElementArray.push(iconTemp)
                    }
                }

            });
        }

        if(studentIconArray){
            studentIconArray.forEach( (value , index) => {
                if(!TkGlobal.classBegin)
                    return;
                const {states,text, className, onClick} = value;
                //const {id , title  , className , ...otherAttrs} =  attrJson ;
                if(states) {
                    //老师为1
                    if ((order == 1 || order === 2) && (className === 'audio-btn' || className === 'video-btn' )) {

                    } else if ((order == 0) && (className == 'audio-btn' || className === 'video-btn' )) {  //学生为0
                        let buttonName = className.split("-");
                        const iconTemp = <button key={index}
                                                 className={'' + (className ? className : '')}
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
    userPlatformUpOrDown(userid){
        ServiceSignalling.userPlatformUpOrDown(userid);
    }

    /*用户功能-打开关闭音频*/
    userAudioOpenOrClose(userid){

        if(TkGlobal.isBroadcast){

            ServiceRoom.getLocalStream().muteAudio(this.muteAudio);
            this.muteAudio = !this.muteAudio;
            if(this.muteAudio && this.muteVideo)
                this.publishstate = 3;
            else if(this.muteAudio)
                this.publishstate = 1;
            else if(this.muteVideo)
                this.publishstate = 2;
            else {
                this.publishstate = 0;
            }
            this.setState({
                liveUserpropertyChanged:this.state.liveUserpropertyChanged + 1
            })
        } else {
            ServiceSignalling.userAudioOpenOrClose(userid);
        }
    }

    /*用户功能-打开关闭视频*/
    userVideoOpenOrClose(userid){

        if(TkGlobal.isBroadcast){
            //ServiceRoom.getTk.muteVideo(this.muteVideo,function(){});
            ServiceRoom.getLocalStream().muteVideo(this.muteVideo);
            this.muteVideo = !this.muteVideo;
            if(this.muteAudio && this.muteVideo)
                this.publishstate = 3;
            else if(this.muteAudio)
                this.publishstate = 1;
            else if(this.muteVideo)
                this.publishstate = 2;
            else {
                this.publishstate = 0;
            }
            this.setState({
                liveUserpropertyChanged:this.state.liveUserpropertyChanged + 1
            })
        } else {
            ServiceSignalling.userVideoOpenOrClose(userid);
        }
    }

    /*改变用户的画笔权限*/
    changeUserCandraw(userid){
        ServiceSignalling.changeUserCandraw(userid);
    }

    //给学生发送礼物
    sendGiftToStudent(userid){
        let user = ServiceRoom.getTkRoom().getUsers()[userid]; //根据userid获取用户信息
        /*let message = {
            textBefore:TkGlobal.language.languageData.alertWin.messageWin.winMessageText.aloneGift.before ,
            textMiddle:user.nickname  ,
            textAfter:TkGlobal.language.languageData.alertWin.messageWin.winMessageText.aloneGift.after  ,
        };
        let allGiftMessage = <span>
                                <span className="add-fl" >{message.textBefore}</span>
                                <span className="gift-username add-nowrap add-fl" style={{color:'#4468d0',maxWidth:'2rem'}}>&nbsp;{message.textMiddle}&nbsp;</span>
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


    //视频加载完发送消息
    receiveStreamComplete(){
        eventObjectDefine.CoreController.dispatchEvent({type:'receiveStreamComplete' ,message:{right:true} });
    }

    _init(){
        let that = this;
        if(!that.props.stream)
            return;

        let {afterElementArray,buttonElementArray,studentElementArray} = that.addUserData(that.props.stream);
        this.afterElementArray = afterElementArray;
        this.buttonElementArray = buttonElementArray;
        this.studentElementArray = studentElementArray;
        /*this.setState({
            buttonElementArray:buttonElementArray
        });
        this.setState({
            studentElementArray:studentElementArray
        });*/
    }

    handleBackgroundModeFloat(userId,backgroundModeFloatIsShow) {//处理后台模式浮层//tkpc2.0.8
        if (this.props.stream && this.props.stream.extensionId && this.props.stream.extensionId===userId) {
            let id = this.props.stream.extensionId;
            let user = ServiceRoom.getTkRoom().getUsers()[id];
            backgroundModeFloatIsShow = (typeof backgroundModeFloatIsShow === "boolean")? backgroundModeFloatIsShow:user.isInBackGround;
            this.setState({backgroundModeFloatIsShow:backgroundModeFloatIsShow});
        }else if(!this.props.stream || !this.props.stream.extensionId || this.props.stream.extensionId === "") {
            this.setState({backgroundModeFloatIsShow:false});
        }
    }
    /*处理room-userproperty-changed事件*/
    handlerRoomUserpropertyChanged(roomUserpropertyChangedEventData){

        if(TkGlobal.isBroadcast){return;} //直播直接返回
        const that = this ;
        const changePropertyJson  = roomUserpropertyChangedEventData.message ;
        const user = roomUserpropertyChangedEventData.user ;
        for (let [key, value] of Object.entries(changePropertyJson)) {//tkpc2.0.8
            if (key === "isInBackGround") {
                if (value === true) {//收到手机端按home键的信息
                    that.handleBackgroundModeFloat(user.id,true);//处理后台模式浮层
                }else if (value === false){
                    that.handleBackgroundModeFloat(user.id,false);//处理后台模式浮层
                }
            }else if(key === 'publishstate' && user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE) {
                that.handleBackgroundModeFloat(user.id,false);//处理后台模式浮层
            }
        }
        if(!that.props.stream || that.props.stream.extensionId !== user.id ){
            return;
        }


        for( let [key , value] of Object.entries(changePropertyJson) ){
            if(key === 'publishstate' || key === 'disablevideo' ){ //发布状态改变时显示或者隐藏video
                if( (user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY ||  user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH) && !user.disablevideo  ){
                    that.props.stream.show();
                    this.giftnumberStyle = false;
                }else{
                    that.props.stream.hide();
                    this.giftnumberStyle = true;
                }
            }
            if( key !== 'giftnumber' ){
                if(that.props.stream.extensionId === user.id){
                    if(!that.props.stream)
                        return;
                    this.setState({
                        stateChange:!this.state.stateChange
                    });
                    /*this.setState({
                        buttonElementArray:buttonElementArray
                    });
                    this.setState({
                        studentElementArray:studentElementArray
                    });*/
                }
            } else if(key == 'giftnumber'){
                this.setState({
                    giftnumberState:!that.state.giftnumberState
                });

            }
        }
    };

    handlerRoomPlaybackClearAll(){
        if(!TkGlobal.playback){
            //L.Logger.error('No playback environment, no execution event[roomPlaybackClearAll] handler ') ;
            return ;};
        const that = this ;
        that._clearElementArray(); //清空所有元素描述数组
    };


    handlerRoomDisconnected(recvEventData){
        const that = this ;
        if(TkGlobal.isBroadcast && TkGlobal.isClient){
            this.muteVideo = false;
            this.muteAudio = false;
            this.publishstate = 0;
        }
        that._clearElementArray();//清空所有元素描述数组
    };

    getUser(userid){
        return ServiceRoom.getTkRoom().getUser(userid);
    }

    getGiftnumber(){
        const that = this ;

        let giftnumber = 0;

        if(that.props.stream!==undefined && that.getUser(that.props.stream.extensionId)!==undefined) {
            giftnumber = that.getUser(that.props.stream.extensionId).giftnumber;
        }

        return giftnumber;
    };

    /*清空所有元素描述数组*/
    _clearElementArray(){
        const that = this ;
        let afterElementArray=that.afterElementArray;
        let buttonElementArray = that.buttonElementArray;
        let studentElementArray = that.studentElementArray;
        afterElementArray.length = 0 ;//清空数组
        buttonElementArray.length = 0 ;//清空数组
        studentElementArray.length = 0 ;//清空数组

        this.afterElementArray = afterElementArray;
        this.buttonElementArray = buttonElementArray;
        this.studentElementArray = studentElementArray;
    };

    handlerAreaExchange(){
        this.areaExchange = !this.areaExchange;
        eventObjectDefine.CoreController.dispatchEvent({//自己本地改变拖拽的video位置
            type:'areaExchange',
            message: {
                hasExchange: this.areaExchange,
            }
        });
        let defalutFontSize = window.innerWidth / TkConstant.STANDARDSIZE ; 
        setTimeout(function(){
            eventObjectDefine.Window.dispatchEvent({ type:TkConstant.EVENTTYPE.WindowEvent.onResize , message:{defalutFontSize:defalutFontSize} });
        }, 20);
    }
	
	/*一键还原的函数*/
	handlerOneKeyReset(){
		let userIDArry = [];
		let data = {
			userIDArry: userIDArry,
		},
		isDelMsg = true;
        eventObjectDefine.CoreController.dispatchEvent({//初始化视频框的位置（拖拽和分屏）
            type:'initVideoSplitScreen',
            message: {}
        });
		ServiceSignalling.sendSignallingFromVideoSplitScreen(data,isDelMsg);
	}
    render(){
        let that = this;
        let {afterElementArray,buttonElementArray,studentElementArray} = that.props.stream===undefined?{}:that.addUserData(that.props.stream);
        let giftnumber = that.getGiftnumber();
        let extensionId = '';
		let {teacherDivStyle}=that.state;
        //let assistantFlag = that.props.stream.extensionId!==undefined &&  ServiceRoom.getTkRoom().getUser(that.props.stream.extensionId) !== undefined && ServiceRoom.getTkRoom().getUser(that.props.stream.extensionId).role === TkConstant.role.roleTeachingAssistant?true:false;
        let buttonsStyle = CoreController.handler.getAppPermissions('teacherVframeBtnIsShow')?((TkConstant.hasRole.roleTeachingAssistant && that.props.stream && ServiceRoom.getTkRoom().getUser(that.props.stream.extensionId).role === TkConstant.role.roleChairman)?"none":""):"none";//tkpc2.0.8
        let raisehand = (!buttonsStyle && that.props.classCss.indexOf("video-hearer-wrap")!= -1 && that.raisehand)?'block':'none';
        let studentStyle = this.props.showGift?((that.props.classCss.indexOf("video-hearer-wrap")==-1)?"none":"block"):"none";
        let userNickName = that.userNickName;
        let studentButton = CoreController.handler.getAppPermissions('studentVframeBtnIsHide')?"none":((that.props.stream && that.props.stream.extensionId == ServiceRoom.getTkRoom().getMySelf().id) ? '' : 'none');//tkpc2.0.8

        if(this.props.stream!==undefined){
            extensionId = this.props.stream.extensionId;
        }
        return (
            <div id={'video_container_'+extensionId} className={this.props.classCss}  onDoubleClick={that.props.handlerOnDoubleClick.bind(that) } style={teacherDivStyle}> {/*老师类名:video-chairman-wrap*/}
                <div data-video="false"  className="video-permission-container add-position-relative clear-float">
                    <div  className="video-wrap  participant-right video-participant-wrap add-position-relative" >
                        {this.props.stream!==undefined?<Video stream={this.props.stream} classCss={this.classCss} ></Video>:undefined }
                        <div className="v-name-wrap clear-float other-name " >
                            <span className="v-name add-nowrap add-fl" style={{display: this.props.stream==undefined?"none":""}}>{userNickName}</span>
                            <span className="v-device-open-close add-fr clear-float" style={{display: studentStyle}}>
                                {afterElementArray}
                            </span>
                        </div>
                        <div className="user-network-delay" style={{color:this.state.networkDelayColor,display:TkGlobal.isBroadcast?"none":(TkGlobal.classBegin && this.props.stream !== undefined)?"inline-block":"none"}}>
                            <span className="user-network-dot" style={{backgroundColor:this.state.networkDelayColor}}></span>
                            <span className="user-network-delay-num" >{this.state.networkDelay+'ms'}</span>
                        </div>
                        <div className="gift-show-container"  style={{display: studentStyle}} >
                            <span className="gift-icon"></span>
                            <span className="gift-num">{giftnumber}</span>
                        </div>
                        <div className="video-hover-function-container"  style={{display:this.props.stream==undefined?"none":buttonsStyle}} >
                            <span className="button-set role-student" onDoubleClick={ (e) => { e.stopPropagation(); return false ; } } >
                                {buttonElementArray}
                            </span>
                        </div>
                        <div className="background-mode-float" style={{display:this.state.backgroundModeFloatIsShow?"block":"none"}}>
                            <p className="background-mode-prompt">{TkGlobal.language.languageData.otherVideoContainer.prompt.text}</p>
                        </div>
                        <div className="video-student-set-container" style={{display:studentButton}}>
                            <span className="button-set role-student" onDoubleClick={ (e) => { e.stopPropagation(); return false ; } }  >
                                {studentElementArray}
                            </span>
                        </div>
                    </div>
                    <div className="video-participant-raise-btn add-position-absolute-top0-right0"  style={{display: raisehand}}>
                        <span className="raise-img"></span>
                    </div>
                </div>
            </div>
        )
    };
};


export  default  VVideoComponent;
