/**
 * 信令服务
 * @module ServiceSignalling
 * @description  提供 信令相关的功能服务
 * @author QiuShao
 * @date 2017/08/12
 */
import SignallingInterface from 'SignallingInterface' ;
import ServiceRoom from 'ServiceRoom' ;
import TkUtils from 'TkUtils' ;
import TkConstant from 'TkConstant' ;
import CoreController from 'CoreController' ;

class ServiceSignalling extends SignallingInterface {
    constructor() {
        super();
    }

    /*发送LowConsume信令*/
    sendSignallingFromLowConsume(maxvideo){
        if( !CoreController.handler.getAppPermissions('sendSignallingFromLowConsume') ){return ;} ;
        const that = this ;
        if(maxvideo === undefined || maxvideo === null){L.Logger.error('sendSignallingFromLowConsume maxvideo is not exist!') ; return ;} ;
        let id , data = {lowconsume:false , maxvideo: Number(maxvideo) } , signallingName = "LowConsume" , toID = "__all"  , expiresabs = undefined , isDelMsg = false , do_not_save = undefined ;
        id = signallingName  ;
        that.sendSignallingDataToParticipant( isDelMsg , signallingName ,id , toID ,  data , do_not_save  , expiresabs);
    };


    /*发送上下课信令
     * method sendSignallingFromClassBegin
     * params [isDelMsg:boolean(true-上课,false-下课) ,  toID:string ,do_not_save:boolean ] */
    sendSignallingFromClassBegin(isDelMsg  , do_not_save){
        if( !CoreController.handler.getAppPermissions('sendSignallingFromClassBegin') ){return ;} ;
        const that = this ;
        let id , data = {} , signallingName = "ClassBegin" , toID = "__all"  , expiresabs = undefined;
        //if(TkConstant.joinRoomInfo && TkConstant.joinRoomInfo.endtime){
            //expiresabs =  Number(TkConstant.joinRoomInfo.endtime) + 5*60;//服务器自动下课时间
        //}
        id = signallingName  ;
        data.recordchat = true ; //录制聊天消息
        that.sendSignallingDataToParticipant( isDelMsg , signallingName ,id , toID ,  data , do_not_save  , expiresabs);
    };

    /*老师端教学组件倒计时的发送到学生端的信令*/
    sendSignallingTimerToStudent(data , isDelMsg = false){
        if(!CoreController.handler.getAppPermissions('sendSignallingTimerToStudent') ){return false;};
        const that = this ;
        let id="timerMesg" , signallingName = "timer" , toID = "__all" ;
        that.sendSignallingDataToParticipant( isDelMsg , signallingName ,id , toID ,  data );
    };

    /*老师助教端转盘组件的发送到学生端的信令*/
    sendSignallingDialToStudent(data,  isDelMsg = false){
        if(!CoreController.handler.getAppPermissions('sendSignallingDialToStudent') ){return false;};
        const that = this ;
        let id="dialMesg" , signallingName = "dial" , toID = "__all"  ;
        that.sendSignallingDataToParticipant( isDelMsg , signallingName ,id , toID ,  data );
    };

    /*老师端教学组件的发送到学生端的信令*/
    sendSignallingAnswerToStudent(data , isDelMsg = false){
        if(!CoreController.handler.getAppPermissions('sendSignallingAnswerToStudent') ){return false;};
        const that = this ;
        let id="answerMesg" , signallingName = "answer" , toID = "__all"  ;
        that.sendSignallingDataToParticipant( isDelMsg , signallingName ,id , toID ,  data );
    };

    /*学生端提交自己的答案*/
    sendSignallingDataStudentToTeacherAnswer(isDelMsg ,data){
         if(!CoreController.handler.getAppPermissions('sendSignallingDataStudentToTeacherAnswer') ){return false;};
        const that = this ;
        let   signallingName = "submitAnswers" , toID = "__all"  ,associatedMsgID="answerMesg" ;
        let id = "submitAnswers_"+ServiceRoom.getTkRoom().getMySelf().id;
        that.sendSignallingDataToParticipant( isDelMsg , signallingName ,id , toID ,  data , undefined , undefined  , associatedMsgID );
    };

    /*抢答器*/
    sendSignallingQiangDaQi(isDelMsg ,data){
         if(!CoreController.handler.getAppPermissions('sendSignallingQiangDaQi') ){return false;};
        const that = this ;
        let   signallingName = "qiangDaQi" , toID = "__all"  ,id="qiangDaQiMesg" ;
        that.sendSignallingDataToParticipant( isDelMsg , signallingName ,id , toID ,  data );
    };

    /*抢答者*/
    sendSignallingQiangDaZhe(isDelMsg ,data){
         if(!CoreController.handler.getAppPermissions('sendSignallingQiangDaZhe') ){return false;};
        const that = this ;
        let   signallingName = "QiangDaZhe" , toID = "__all"  ,associatedMsgID="qiangDaQiMesg" ;
        let id = "QiangDaZhe_"+ServiceRoom.getTkRoom().getMySelf().id;
        that.sendSignallingDataToParticipant( isDelMsg , signallingName ,id , toID ,  data , undefined , undefined  , associatedMsgID );
    };

     /* method sendSignallingFromUpdateTime */
    sendSignallingFromUpdateTime(toParticipantID){
        if( !CoreController.handler.getAppPermissions('sendSignallingFromUpdateTime') ){return ;} ;
        const that = this ;
        let isDelMsg = false  , id = "UpdateTime" , toID= toParticipantID || "__all" , data = {} , signallingName = "UpdateTime"   , do_not_save = true ;
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , do_not_save);
    };

    /* method sendSignallingFromUpdateTime */
    sendSignallingFromRemoteControl(toParticipantID , data){
        if( !CoreController.handler.getAppPermissions('sendSignallingFromRemoteControl') ){return ;} ;
        let isDelMsg = false  , id = "RemoteControl" , toID= toParticipantID || "__all" , signallingName = "RemoteControl"   , do_not_save = true ;
        this.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , do_not_save);
    };

    /*发送白板数据相关的信令SharpsChange
     *@method  sendSignallingFromSharpsChange */
    sendSignallingFromSharpsChange(isDelMsg , signallingName ,id , toID ,  data , do_not_save , expiresabs  , associatedMsgID , associatedUserID){
        if( !CoreController.handler.getAppPermissions('sendSignallingFromSharpsChange') ){return ;} ;
        const that = this ;
        if(isDelMsg){
            do_not_save = true ;
        }
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , do_not_save , expiresabs  , associatedMsgID , associatedUserID) ;
    }

    /*发送白板加页相关的信令WBPageCount
    * @method sendSignallingFromWBPageCount */
    sendSignallingFromWBPageCount(data){
        if( !CoreController.handler.getAppPermissions('sendSignallingFromWBPageCount') ){return ;} ;
        const that = this ;
        let signallingName = "WBPageCount" ;
        let id = "WBPageCount";
        let dot_not_save = undefined ;
        let isDelMsg = false ;
        let toID="__allExceptSender" ;
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , dot_not_save) ;
    };

    /*发送ShowPage相关的信令
    *@method sendSignallingFromShowPage */
    sendSignallingFromShowPage(isDelMsg , id , data , toID = '__all'){
        if( !CoreController.handler.getAppPermissions('sendSignallingFromShowPage') ){return ;} ;
        if(!data){
            L.Logger.error('sendSignallingFromShowPage data is not exist!');
            return ;
        }
        if(data && typeof data === 'string'){
            data = JSON.parse(data);
        }
        if(data.isDynamicPPT && !CoreController.handler.getAppPermissions('sendSignallingFromDynamicPptShowPage') ){return ;}
        if(data.isH5Document && !CoreController.handler.getAppPermissions('sendSignallingFromH5ShowPage') ){return ;}
        if(data.isGeneralFile && !CoreController.handler.getAppPermissions('sendSignallingFromGeneralShowPage') ){return ;}
        const that = this ;
        let signallingName = "ShowPage" ;
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data ) ;
    };

    /*发送动态PPT触发器NewPptTriggerActionClick相关的信令
    * @method */
    sendSignallingFromDynamicPptTriggerActionClick(data){
        if( !CoreController.handler.getAppPermissions('sendSignallingFromDynamicPptTriggerActionClick') ){return ;} ;
        const that = this ;
        let  signallingName = "NewPptTriggerActionClick" , id = "NewPptTriggerActionClick" , toID="__allExceptSender"  , isDelMsg = false , dot_not_save = false;
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , dot_not_save) ;
    };

    /*h5文档的动作相关信令*/
    sendSignallingFromH5DocumentAction(data) {
        if( !CoreController.handler.getAppPermissions('sendSignallingFromH5DocumentAction') ){return ;} ;
        const that = this;
        let signallingName = "H5DocumentAction" , id = "H5DocumentAction" , toID="__allExceptSender"  , isDelMsg = false , dot_not_save = false;
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , dot_not_save) ;
    };

    /*视频框拖拽的动作相关信令*/
    sendSignallingFromVideoDraghandle(data , toID) {
        if( !CoreController.handler.getAppPermissions('sendSignallingFromVideoDraghandle') ){return ;} ;
        const that = this;
        let signallingName = "videoDraghandle" , id = "videoDraghandle"  , isDelMsg = false , dot_not_save = false;
        toID= toID || "__allExceptSender";
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , dot_not_save) ;
    };

    /*视频框拉伸的相关信令*/
    sendSignallingFromVideoChangeSize(data , toID) {
        if( !CoreController.handler.getAppPermissions('isSendSignallingFromVideoChangeSize') ){return ;} ;
        const that = this;
        let signallingName = "VideoChangeSize" , id = "VideoChangeSize"  , isDelMsg = false , dot_not_save = false;
        toID= toID || "__all";
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , dot_not_save) ;
    };

    /*演讲模式双击视频分屏的动作相关信令*/
    sendSignallingFromVideoSplitScreen(data, isDelMsg ) {
        if( !CoreController.handler.getAppPermissions('sendSignallingFromVideoSplitScreen') ){return ;} ;
        const that = this;
        let signallingName = "VideoSplitScreen" , id = "VideoSplitScreen", dot_not_save = false , toID= "__allExceptSender";
        isDelMsg = isDelMsg || false;
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , dot_not_save) ;
    };
    
    /*小黑板拖拽的动作相关信令*/
    sendSignallingFromBlackBoardDrag(data , toID) {
        if( !CoreController.handler.getAppPermissions('sendSignallingFromBlackBoardDrag') ){return ;} ;
        const that = this;
        let signallingName = "BlackBoardDrag" ,
            id = "BlackBoardDrag"  ,
            isDelMsg = false ,
            dot_not_save = false,
            associatedMsgID = "BlackBoard";
        toID= toID || "__allExceptSender";
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , dot_not_save, undefined  , associatedMsgID) ;
    };

    /*转盘拖拽的动作相关信令*/
    sendSignallingFromDialDrag(data , toID) {
        if( !CoreController.handler.getAppPermissions('sendSignallingFromDialDrag') ){return ;} ;
        const that = this;
        let signallingName = "DialDrag" ,
            id = "DialDrag"  ,
            isDelMsg = false ,
            dot_not_save = false,
            associatedMsgID = "dialMesg";
        toID= toID || "__allExceptSender";
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , dot_not_save, undefined  , associatedMsgID) ;
    };
    /*计时器拖拽的动作相关信令*//*--tkpc2.0.8--start*/
    sendSignallingFromTimerDrag(data , toID) {
        if( !CoreController.handler.getAppPermissions('isSendSignallingFromTimerDrag') ){return ;} ;
        const that = this;
        let signallingName = "TimerDrag" ,
            id = "TimerDrag"  ,
            isDelMsg = false ,
            dot_not_save = false,
            associatedMsgID = "timerMesg";
        toID= toID || "__allExceptSender";
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , dot_not_save, undefined  , associatedMsgID) ;
    };
    /*答题卡拖拽的动作相关信令*/
    sendSignallingFromAnswerDrag(data , toID) {
        if( !CoreController.handler.getAppPermissions('isSendSignallingFromAnswerDrag') ){return ;} ;
        const that = this;
        let signallingName = "AnswerDrag" ,
            id = "AnswerDrag"  ,
            isDelMsg = false ,
            dot_not_save = false,
            associatedMsgID = "answerMesg";
        toID= toID || "__allExceptSender";
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , dot_not_save, undefined  , associatedMsgID) ;
    };
	/*--tkpc2.0.8--end*/
    /*抢答器拖拽的相关信令*/
    sendSignallingFromResponderDrag(data , toID) {
        if( !CoreController.handler.getAppPermissions('isSendSignallingFromResponderDrag') ){return ;} ;
        const that = this;
        let signallingName = "ResponderDrag" ,
            id = "ResponderDrag"  ,
            isDelMsg = false ,
            dot_not_save = false,
            associatedMsgID = "qiangDaQiMesg";
        toID= toID || "__allExceptSender";
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , dot_not_save, undefined  , associatedMsgID) ;
    };
    /*发送自己的网络延迟给其他人相关信令*/
    sendSignallingFromSendNetworkState(data, id ,isDelMsg, toID) {
        // if( !CoreController.handler.getAppPermissions('sendSignallingFromSendNetworkState') ){return ;} ;
        const that = this;
        let signallingName = "sendNetworkState" , dot_not_save = false;
        isDelMsg = isDelMsg || false ;
        toID= toID || "__allExceptSender";
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , dot_not_save) ;
    };

    /*与父框架通信的相关信令*/
    sendSignallingToParentIframe(sendDataWrap) {
        const that = this;
        let {id , signallingName , toID = '__all' , data , source , save = true ,  delmsg = false } = sendDataWrap ;
        id = id || signallingName ;
        signallingName = "outIframe_" + signallingName;
        that.sendSignallingDataToParticipant(delmsg , signallingName ,id , toID ,  sendDataWrap , !save) ;
    }

    /*发送文档上传或者删除相关的信令DocumentChange
     *@method  sendSignallingFromDocumentChange */
    sendSignallingFromDocumentChange(data , toID){
        if( !CoreController.handler.getAppPermissions('sendSignallingFromDocumentChange') ){return ;} ;
        const that = this ;
        let signallingName = "DocumentChange";
        let id = signallingName;
        let do_not_save = true;
        let isDelMsg = false;
        toID = toID || "__allExceptSender";
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , do_not_save );
    }

    /*数据流失败后发送信令StreamFailure
    * @method sendSignallingFromStreamFailure*/
    //tkpc2.0.8:参数添加streamFailureJson
    sendSignallingFromStreamFailure(failStreamUserid , streamFailureJson){
        if( !CoreController.handler.getAppPermissions('sendSignallingFromStreamFailure') ){return ;} ;
        const that = this ;
        if(!failStreamUserid){ L.Logger.error( 'sendSignallingFromStreamFailure stream extensionId is not exist!' ) } ;
        if( failStreamUserid === ServiceRoom.getTkRoom().getMySelf().id ){
            let signallingName = "StreamFailure" ;
            let id = signallingName , toID='__allSuperUsers'  , do_not_save = true , isDelMsg = false , data = {studentId:failStreamUserid};
            //tkpc2.0.8
            if(streamFailureJson && typeof streamFailureJson === 'object'){
                Object.assign(data , streamFailureJson ) ;
            }
            that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , do_not_save );
         /*   for(let userid of Object.keys( ServiceRoom.getTkRoom().getSpecifyRoleList(TkConstant.role.roleChairman) ) ){
                 toID = userid ;
                that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , do_not_save );
            }
            for(let userid of Object.keys( ServiceRoom.getTkRoom().getSpecifyRoleList(TkConstant.role.roleTeachingAssistant) ) ){
                toID = userid ;
                that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , do_not_save );
            }*/
        }
    };

    /*发送公告相关信令*/
    sendSignallingFromLiveNoticeBoard(data , toID) {
        if( !CoreController.handler.getAppPermissions('sendSignallingFromLiveNoticeBoard') ){return ;} ;
        const that = this;
        let signallingName = "LiveNoticeBoard" , id = "LiveNoticeBoard"  , isDelMsg = false , dot_not_save = false;
        toID= toID || "__all";
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , dot_not_save) ;
    };

    /*发送通知相关信令*/
    sendSignallingFromLiveNoticeInform(data , toID) {
        if( !CoreController.handler.getAppPermissions('sendSignallingFromLiveNoticeInform') ){return ;} ;
        const that = this;
        let signallingName = "LiveNoticeInform" , id = "LiveNoticeInform"  , isDelMsg = false , dot_not_save = false;
        toID= toID || "__all";
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , dot_not_save) ;
    };

    /*发送广播相关信令*/
    sendSignallingFromLiveBroadcast(data , toID) {
        if( !CoreController.handler.getAppPermissions('sendSignallingFromLiveBroadcast') ){ return ;} ;
        const that = this;
        let signallingName = "LiveBroadcast" , id = "LiveBroadcast"  , isDelMsg = false , dot_not_save = false;
        toID= toID || "__all";
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , dot_not_save) ;
    };

    /*发送老师通过，回复，删除提问相关信令*
    signallingName：LiveQuestions
    isDelMsg：false 为通过和回复；true为删除
    删除时：id为提问的ID时， 删除该提问及其下的所有回复；当id为回复的id时直接删除该回复
    发送：通过 data 没有信息，回复 data 中为具体的回复内容,通过、回复信令中associatedmsgID 为提问的ID
     */
    sendSignallingFromLiveQuestions(isDelMsg, id, data, toID, associatedMsgID) {
        if( !CoreController.handler.getAppPermissions('sendSignallingFromLiveQuestions') ){return ;} ;
        const that = this;
        let signallingName = "LiveQuestions",
            dot_not_save = false,
            expiresabs = 0;
            toID = toID || "__all";
            associatedMsgID = associatedMsgID || '';
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , dot_not_save , expiresabs  , associatedMsgID) ;
    };

    /*直播发送pubmsg信令，全体禁言和对某个人禁言以及时长*
    signallingName：LiveAllNoTalking
    isDelMsg：false 禁言，isDelMsg ：true 恢复禁言
    toID:_all,全体禁言老师和助教不进行禁言，接收到不做处理，
    toID：associatedUserID是对该用户进行禁言。第一次为5分钟，第二次为10分钟；第三次及以上为30分钟。在data 中 time = 5,10,30
    data={number，time}
    do_not_save：false  保存
  */
    sendSignallingFromLiveAllNoTalking(isDelMsg, id , toID, data, dot_not_save) {
        if( !CoreController.handler.getAppPermissions('sendSignallingFromLiveAllNoTalking') ){return ;} ;
        const that = this;
        let signallingName = "LiveAllNoTalking",
            expiresabs = false;
            toID = toID || "__all";
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID , data, dot_not_save ) ;
    };

    /*直播发送pubmsg信令，桌面，区域共享和程序共享*
    signallingName：LiveShareStream
    isDelMsg：false 取消共享，isDelMsg ：true 共享
    toID:_all,全体，
    data={}
    do_not_save：false  保存
  */
    sendSignallingFromLiveShareStream(isDelMsg, id , toID, data, dot_not_save) {
        if( !CoreController.handler.getAppPermissions('sendSignallingFromLiveShareStream') ){return ;} ;
        const that = this;
        let signallingName = "LiveShareStream",
            expiresabs = false;
        toID = toID || "__all";
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID , data, dot_not_save ) ;
    };

    /*直播发送pubmsg信令，把指定用户踢出教室*
    signallingName：LiveEvictSpecificUser
    isDelMsg：false
    toID：associatedUserID 指定用户
    data={time}  1800 秒
    do_not_save：true  不保存
    */
    sendSignallingFromLiveEvictSpecificUser(isDelMsg, id , toID, data, dot_not_save) {
        if( !CoreController.handler.getAppPermissions('sendSignallingFromLiveEvictSpecificUser') ){return ;} ;
        const that = this;
        let signallingName = "LiveEvictSpecificUser",
            expiresabs = false;
        toID = toID || "__associatedUserID";
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID , data, dot_not_save ) ;
    };

    /*直播发送pubmsg信令，抽奖*
    signallingName：LiveLuckDraw
    isDelMsg：false               //关闭抽奖,isDelMag为真 true
    toID：__all 所有用户
    data：{state：1}开始抽奖为1，结束抽奖为0 ，
    do_not_save：false  保存
    */
    sendSignallingFromLiveLuckDraw(isDelMsg, id ,  toID, data, dot_not_save, do_not_replace, ) {
        if( !CoreController.handler.getAppPermissions('sendSignallingFromLiveLuckDraw') ){return ;} ;
        const that = this;
        let signallingName = "LiveLuckDraw",
            expiresabs = false;
        toID = toID || "__all";
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID, data, dot_not_save, do_not_replace, ) ;
    };

/**
     * 直播端投票相关信令
     * do_not_save: false
     * @param {*type: Boolean, true=>发布投票, false=>结束投票} isDelMsg 
     * @param {*type: String, 'vote_'/'v_res' + userID + timeStamp} id 
     * @param {*type: JSON/Object, vote data} data 
     * @param {*type: String, 缺省值为'__allExceptSender'} toID 
     * @param {*type: String, 投票结果关联相应投票ID} associatedMsgID 
     */
    sendSignallingFromLiveVote(isDelMsg, data,){
        if( !CoreController.handler.getAppPermissions('sendSignallingFromLiveVote') ){return ;} ;
        const that = this;
        let id = data.id,
            signallingName = "LiveVote",
            dot_not_save = false,
            expiresabs = undefined,
            toID = "__allExceptSender",
            associatedMsgID = data.assID || '';
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , dot_not_save , expiresabs  , associatedMsgID) ;
    }

    /**
     * 直播端提交投票信令
     * do_not_save: true
     * @param {*type: String, 'v_sub_' + userID + timeStamp} id 
     * @param {*type: JSON/Object, vote commit data} data 
     * @param {*type: String, 投票结果关联相应投票ID} associatedMsgID 
     */
    sendSignallingFromLiveVoteCommit( id, assID, data, actions){
        if( !CoreController.handler.getAppPermissions('sendSignallingFromLiveVoteCommit') ){return ;} ;
        const that = this;
        let type             = 'count',
            write2DB         = true,
            signallingName   = "LiveVoteCommit",
            dot_not_save     = true,
            expiresabs       = undefined,
            associatedUserID = undefined,
            expires          = undefined,
            toID             = "room";
            id               = id || '';
        let associatedMsgID  = assID || '';
            if(actions !== undefined && Array.isArray(actions) && actions.length > 0){
                actions = actions;  // 0/1/2  -->  加/减/清空
            }else{
                return Log.error('[Signaling error]: Live vote commit signalling\'s param actions is illegal !!')
            }
        that.pubMsg(signallingName ,id , toID ,  data , dot_not_save , expiresabs  , associatedMsgID, associatedUserID, expires, type, write2DB, actions ) ;
    }

    /**
     * 直播端获取投票结果
     */
    getVoteCount(id, assID, data,toID){
        const that = this;
        let type             = 'getCount',
            signallingName   = "getVoteCount",
            dot_not_save     = true,
            expiresabs       = undefined,
            associatedUserID = undefined,
            expires          = undefined,
            associatedMsgID  = assID || undefined;
            toID             = toID;
            id               = id || undefined;
        that.pubMsg(signallingName ,id , toID ,  data , dot_not_save , expiresabs  , associatedMsgID, associatedUserID, expires, type,) ;
    }

    /**
     * 直播端点名相关信令
     * do_not_save: false
     * @param {*type: Boolean, true=>发布投票, false=>结束投票} isDelMsg 
     * @param {*type: String, 'vote_'/'v_res' + userID + timeStamp} id 
     * @param {*type: JSON/Object, vote data} data 
     * @param {*type: String, 缺省值为'__allExceptSender'} toID 
     */
    sendSignallingFromLiveCallRoll(isDelMsg, id, data,){
        if( !CoreController.handler.getAppPermissions('sendSignallingFromLiveVote') ){return ;} ;
        const that = this;
        let signallingName = "LiveCallRoll",
            dot_not_save = false,
            expiresabs = undefined,
            toID = "__allExceptSender",
            associatedMsgID = data.assID || '';
            id = id || '';
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data , dot_not_save , expiresabs  , associatedMsgID) ;
    }

    /**
     * 直播端签到信令
     * do_not_save: true
     * @param {*type: String, 'v_sub_' + userID + timeStamp} id 
     * @param {*type: JSON/Object, vote commit data} data 
     * @param {*type: String, 投票结果关联相应投票ID} associatedMsgID 
     */
    sendSignallingFromLiveSignIn( id, assID, data, actions){  //  不要删除actions字段，若要改动请联系信令服务器
        if( !CoreController.handler.getAppPermissions('sendSignallingFromLiveVoteCommit') ){return ;} ;
        const that = this;
        let type             = 'count',
            write2DB         = true,
            isDelMsg =false,
            signallingName = "LiveSignIn",
            dot_not_save = true,
            expiresabs = undefined,
            associatedUserID = undefined,
            expires          = undefined,
            toID = "room";
            id = id || undefined;
        that.pubMsg(signallingName ,id , toID ,  data , dot_not_save , expiresabs  , assID, associatedUserID, expires, type, write2DB, actions) ;
    }

    /**
     * 直播端获取签到结果
     */
    getSICount(id, assID, data,toID){
        const that = this;
        let type             = 'getCount',
            signallingName   = "getSICount",
            dot_not_save     = true,
            expiresabs       = undefined,
            associatedUserID = undefined,
            expires          = undefined,
            associatedMsgID  = assID || undefined;
            toID             = toID;
            id               = id || undefined;
        that.pubMsg(signallingName ,id , toID ,  data , dot_not_save , expiresabs  , associatedMsgID, associatedUserID, expires, type,) ;
    }

    /*用户功能-上下讲台信令的发送
    * @method userPlatformUpOrDown*/
    userPlatformUpOrDown(userid){
        if( !CoreController.handler.getAppPermissions('userPlatformUpOrDown') ){return ;} ;
        const that = this ;
        let user = ServiceRoom.getTkRoom().getUsers()[userid];
        if(!user){ L.Logger.error("not user , id:"+userid); }
        //如果用户属性状态为非零（上台状态）则变为零（下台），若为下台状态则根据是否有音视频设备赋值属性：
        let publishstate = user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE ? ( user.hasvideo ? (user.hasaudio ? TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH : TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY ): ( user.hasaudio ? TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY : TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE   )  ) : TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE ;
        that.changeUserPublish(user.id , publishstate) ;//改变用户的发布状态
        let userPropertyData = {} ;
        if(user.role !== TkConstant.role.roleTeachingAssistant && user.role !== TkConstant.role.roleChairman ){ //如果不是助教和老师
            if( publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE &&  user.candraw ){ //如果下台并且当前可画,则设置不可画
                userPropertyData.candraw= false ;
            }
            if(user.raisehand ){ //如果举手则置为不举手
                userPropertyData.raisehand = false ;
            }
        }
        if(!TkUtils.isEmpty(userPropertyData)){//userPropertyData如果不是空对象
            that.setParticipantPropertyToAll( user.id , userPropertyData);
        }
    };

    /*用户功能-打开关闭音频
    * @method userAudioOpenOrClose*/
    userAudioOpenOrClose(userid){
        if( !CoreController.handler.getAppPermissions('userAudioOpenOrClose') ){return ;} ;
        const that = this ;
        let user = ServiceRoom.getTkRoom().getUsers()[userid];
        if(!user){ L.Logger.error("not user , id:"+userid); } ;
        let data = {} ;
        let isSet = false ;
        if(user.raisehand){
            data.raisehand = false;
        }
        if(user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY ){  //之前状态为1 ==>变为4
            data.publishstate = TkConstant.PUBLISHSTATE.PUBLISH_STATE_MUTEALL;
            isSet = true ;
        }else if(user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY ){  //之前状态为2 ==>变为3
            data.publishstate =TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH ;
            isSet = true ;
        }else if(user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH ){  //之前状态为3 ==>变为2
            data.publishstate =TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY ;
            isSet = true ;
        }else if(user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_MUTEALL ){  //之前状态为4 ==>变为1
            data.publishstate =TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY ;
            isSet = true ;
        }else if(user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE ){  //之前状态为0 ==>变为1
            data.publishstate =TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY ;
            isSet = true ;
        }
        if(isSet){
            that.setParticipantPropertyToAll(userid, data);
        }
    };

    /*用户功能-打开关闭视频
     *@method userVideoOpenOrClose*/
    userVideoOpenOrClose(userid){
        if( !CoreController.handler.getAppPermissions('userVideoOpenOrClose') ){return ;} ;
        const that = this ;
        let user = ServiceRoom.getTkRoom().getUsers()[userid];
        let isSet = false ;
        let data = {} ;
        if(user.raisehand){
            data.raisehand = false;
        }
        if(user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY ){  //之前状态为1 ==>变为3
            data.publishstate = TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH;
            isSet = true ;
        }else if(user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY ){  //之前状态为2 ==>变为4
            data.publishstate = TkConstant.PUBLISHSTATE.PUBLISH_STATE_MUTEALL;
            isSet = true ;
        }else if(user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_BOTH ){  //之前状态为3 ==>变为1
            data.publishstate = TkConstant.PUBLISHSTATE.PUBLISH_STATE_AUDIOONLY;
            isSet = true ;
        }else if(user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_MUTEALL ){  //之前状态为4 ==>变为2
            data.publishstate = TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY;
            isSet = true ;
        }else if(user.publishstate === TkConstant.PUBLISHSTATE.PUBLISH_STATE_NONE ){  //之前状态为0 ==>变为2
            data.publishstate = TkConstant.PUBLISHSTATE.PUBLISH_STATE_VIDEOONLY;
            isSet = true ;
        }
        if(isSet){
            that.setParticipantPropertyToAll(userid, data);
        }
    };
    
    /*改变用户的画笔权限
     *@method changeUserCandraw*/
    changeUserCandraw(userid){
        if( !CoreController.handler.getAppPermissions('changeUserCandraw') ){return ;} ;
        const that = this ;
        let user = ServiceRoom.getTkRoom().getUsers()[userid];
        if(!user){ L.Logger.error("not user , id:"+userid); return ; }
        that.setParticipantPropertyToAll( user.id , {candraw:!user.candraw});
    } ;

    /*发布媒体文件流*/
    publishMediaStream(stream, options, callback){
        if( !CoreController.handler.getAppPermissions('publishMediaStream') ){return  false;} ;
        if(!stream){ L.Logger.error("publishMediaStream stream is not exist!"); return false; }
        L.Logger.debug('publishMediaStream stream info:' , {url:stream.url , extensionId:stream.extensionId , attributes:stream.getAttributes() } );
        ServiceRoom.getTkRoom().publishMedia(stream, options, callback );
    };

    /*取消发布媒体文件流*/
    unpublishMediaStream(stream , callback){
        if( !CoreController.handler.getAppPermissions('unpublishMediaStream') ){return false;} ;
        if(!stream){ L.Logger.error("unpublishMediaStream stream is not exist!"); return false; }
        L.Logger.debug('unpublishMediaStream stream info:' , {url:stream.url , extensionId:stream.extensionId ,  attributes:stream.getAttributes()} );
        ServiceRoom.getTkRoom().unpublishMedia(stream ,callback );
    };

    /*发布桌面共享流 xiagd 2017-10-10*/
    publishDeskTopShareStream(stream, options, callback){
        if( !CoreController.handler.getAppPermissions('publishDeskTopShareStream') ){return  false;} ;
        if(!stream){ L.Logger.error("publishDeskTopShareStream stream is not exist!"); return false; }
        L.Logger.debug('publishDeskTopShareStream stream info:' , {screen:stream.screen , extensionId:stream.extensionId , attributes:stream.getAttributes() } );
        ServiceRoom.getTkRoom().publishScreen(stream, options, callback );
    };

    /*取消发布桌面共享流 xiagd 2017-10-10*/
    unpublishDeskTopShareStream(stream , callback){
        if( !CoreController.handler.getAppPermissions('unpublishDeskTopShareStream') ){return false;} ;
        if(!stream){ L.Logger.error("unpublishDeskTopShareStream stream is not exist!"); return false; }
        L.Logger.debug('unpublishDeskTopShareStream stream info:' , {screen:stream.screen , extensionId:stream.extensionId ,  attributes:stream.getAttributes()} );
        ServiceRoom.getTkRoom().unpublishScreen(callback );
    };

    /*改变用户的发布状态*/
    changeUserPublish(id , publishstate){
        let user = ServiceRoom.getTkRoom().getUsers()[id] ;
        if(!user){L.Logger.error( 'user is not exist  , user id is '+id+'!' ); return ; } ;
        if( !(user.role === TkConstant.role.roleChairman || user.role === TkConstant.role.roleStudent || (user.role === TkConstant.role.roleTeachingAssistant)&& TkConstant.joinRoomInfo.assistantOpenMyseftAV) ){        //17-09-15 xgd 修改
            return ;
        }
        ServiceRoom.getTkRoom().changeUserPublish(id , publishstate);
    }

    /*鼠标状态是否选中*/
    sendMarkToolMouseIsSelect(selectMouse , selectElementLiId ,  selectElementId){
        if( !CoreController.handler.getAppPermissions('sendWhiteboardMarkTool') ){return ;} ;
        const that = this ;
        let data = {selectMouse: selectMouse} ;
        if(selectElementLiId){
            data.selectElementLiId = selectElementLiId ;
        }
        if(selectElementId){
            data.selectElementId = selectElementId ;
        }
        let  signallingName = "whiteboardMarkTool" , id = "whiteboardMarkTool" , toID="__allExceptSender"  , isDelMsg = false;
        that.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data ) ;
    };

    /*发送多黑板信令*/
    sendSignallingFromBlackBoard(data , isDelMsg = false ){
        if( !CoreController.handler.getAppPermissions('sendSignallingFromBlackBoard') ){return ;} ;
        let  signallingName = "BlackBoard" , id = "BlackBoard" , toID="__all" ;
        this.sendSignallingDataToParticipant(isDelMsg , signallingName ,id , toID ,  data ) ;
    };
}
const  ServiceSignallingInstance = new ServiceSignalling();
export default ServiceSignallingInstance;
    

/*
备注：
    toID=> __all , __allExceptSender , userid , __none ,__allSuperUsers
* */