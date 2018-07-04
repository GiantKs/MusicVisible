import React,{ Component } from 'react';
import ServiceSignalling from 'ServiceSignalling';
import TkGlobal from 'TkGlobal';
import TkUtils from 'TkUtils';
import ServiceRoom from 'ServiceRoom';
import eventObjectDefine from 'eventObjectDefine';
import TkConstant from 'TkConstant';
import AnsItem from './ansItem';
import Md5 from 'js-md5';

const emit = eventObjectDefine.CoreController.dispatchEvent;

class Bubble extends Component {

    constructor(){
        super();
        this.state = {
            show: true,
            passed: false,//是否通過
            disabledNoTalking:false,
            disabledKickOut:false,
        }
        this.isTeacher = TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant;
        this.me = ServiceRoom.getTkRoom().getMySelf();
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
        this.adminMenu = (this.me.role === TkConstant.role.roleChairman ||this.me.role === TkConstant.role.roleTeachingAssistant)?true:false;
        this.noTalkingTime = 300;
        this.kictOutTime = 1800;
    }

    componentDidMount() {   
        eventObjectDefine.CoreController.addEventListener( "textMessageFilter" , this.handlerFilter.bind(this), this.listernerBackupid); //roomPubmsg事件
        // eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPubmsg , this.handlerRoomPubmsg.bind(this), this.listernerBackupid); //roomPubmsg事件  上课事件 classBegin
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPlaybackClearAllFromPlaybackController,this.handlerRoomPlaybackClearAll.bind(this) , this.listernerBackupid); //roomPlaybackClearAll 事件：回放清除所有信令
    };

    componentWillUnmount(){
        eventObjectDefine.CoreController.removeBackupListerner(this.listernerBackupid );
    }

    // 接收到发布信令时的处理方法
   /* handlerRoomPubmsg(recvEventData){
        const that = this ;

        if( TkGlobal.isBroadcast ){//是直播的话才处理
            let pubmsgData = recvEventData.message;

            switch(pubmsgData.name){

                case "LiveQuestions":
                    //问答区
                    let data = recvEventData.message.data;
                    let sender = this.props.isBroadcast ? data.sender : ServiceRoom.getTkRoom().getUser(data.id.substr(5,36));


                    Log.error("recvEventData.message====",recvEventData.message);
                    if(data.hasPassed){
                        this.setState({
                            passed: true,
                        });
                    }
                    break;

            }
        }
    };*/

    handlerRoomPlaybackClearAll(){
  
        /*this.setState({
            show: true,
            passed: false,//是否通過
            disabledNoTalking:false,
            disabledKickOut:false,
        })*/
        this.isTeacher = TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant;
        this.me = ServiceRoom.getTkRoom().getMySelf();
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
        this.adminMenu = (this.me.role === TkConstant.role.roleChairman ||this.me.role === TkConstant.role.roleTeachingAssistant)?true:false;
        this.noTalkingTime = 300;
        this.kictOutTime = 1800;

    }


    handlerFilter(event){
        // filterType:
        // 0 不过滤
        // 1 只显示老师发送的消息
        // 2 只显示自己发送的消息
        // 3 同时显示老师和自己发送的消息
        let filterType = (event.message.teacherOnly && event.message.selfOnly) ? 3 : event.message.teacherOnly ? 1 : event.message.selfOnly ? 2 : 0;
        let message = this.props.data;
        let self = this;

        if(message.id){
            switch(filterType){
                case 0:
                    self.setState({
                        show: true,
                    })
                    break;
                case 1:
                    self.setState({
                        show: message.isTeacher,
                    })
                    break;
                case 2:
                    self.setState({
                        show: message.fromID === this.me.id,
                    })
                    break;
                case 3:
                    self.setState({
                        show: message.fromID === this.me.id || message.isTeacher,
                    });
                    break;
                default:
                    break;
            }
        }
    }

    handlerQuizPass(data){
        data.msg = (typeof data.msg === 'object') ? data.msg.props.dangerouslySetInnerHTML.__html : data.msg;
        data.msg = data.msg.replace(/&nbsp;/ig, " ");
        
        data.sender = data.sender ? data.sender : {nickname: data.who};
        data.hasPassed = true;
        this.setState({
            passed: true,
        });
        ServiceSignalling.sendSignallingFromLiveQuestions(false, data.id, {
            hasPassed: data.hasPassed,
            msg: data.msg,
            type: data.type,
            id:  data.id,
            time: data.time,
            sender: data.sender,
        });
    }

    handlerQuizDel(data){
        ServiceSignalling.sendSignallingFromLiveQuestions(true, data.id, {});
    }

    handlerQuizAns(data, event){
        data.msg = (typeof data.msg === 'object') ? data.msg.props.dangerouslySetInnerHTML.__html : data.msg;
        data.msg = data.msg.replace(/&nbsp;/ig, " ");

        if(!data.hasPassed ){
            this.handlerQuizPass(data);
        }

        emit({
            type:'onAnsClick',
            data: {
                isAns: true,
                associatedMsgID: data.id
            }
        });
    }

    _onClickAdmin(){
        let that = this;
        if(that.me.role === TkConstant.role.roleChairman ||that.me.role === TkConstant.role.roleTeachingAssistant)
            that.adminMenu = true;
    }

    sendUserNoTalk(userid){
        let that = this;
        this.state.disabledSharing
        that.setState({disabledNoTalking:true});
        setTimeout( () => {
            that.setState({
                disabledNoTalking:false,
            });
        }, that.noTalkingTime * 1000 );
        that.props.sendUserNoTalk(userid);
    }

    sendKickOut(userid){
        let that = this;
        that.props.sendKickOut(userid);
        that.setState({disabledKickOut:true});
        setTimeout( () => {
            that.setState({
                disabledKickOut:false,
            });
        }, that.kictOutTime * 1000 );

    }

    liveUserListAdd(userid,nickname){
        let that = this;
        if(!TkGlobal.isBroadcast || userid === this.me.id)
            return;
        that.props.liveUserListAdd(userid,nickname);
    }


    onClickMenuShow(){
        let that = this;
        that.state.teacherAdminMenu = !that.state.teacherAdminMenu;
        that.setState({teacherAdminMenu:that.state.teacherAdminMenu});
    }

    mouseOverMenuShow(){
        let that = this;
        that.state.teacherAdminMenu = true;
        that.setState({teacherAdminMenu:that.state.teacherAdminMenu});
    }

    mouseLeaveMenuClose(){
        let that = this;
        that.state.teacherAdminMenu = false;
        that.setState({teacherAdminMenu:that.state.teacherAdminMenu});
    }

    _handleSelectAddOption(){
        let that = this;
        //let
        //shosetype.options.add(new Option("1","添加成功"));
    }

    _handleTranslateClick(ev){
        let target = ev.target ;
        let query=$(target).siblings('.user-sended').text();
        //翻译功能
        let appid ='20170517000048030';
        let key = 'JKrcizzIAo5OhDv1NDYy';
        let salt=new Date().getTime();

        let sign=Md5(appid+query+salt+key);
        let to;
        if((/[\u4e00-\u9fa5]/.test(query))) {
            to = 'en';
        } else {
            to = 'zh';
        }
        let request={
            "q":query,
            "from":"auto",
            "to":to,
            "appid":appid,
            "salt":salt,
            "sign":sign
        };
        $.ajax({//跨域
            url:"https://fanyi-api.baidu.com/api/trans/vip/translate",
            data:request,
            dataType:'jsonp',
            type:'get',
            success:function(data){
                if(data.trans_result){
                    $(target).siblings('.user-sended').append('<p>'+data.trans_result[0].dst+'</p>');//将翻译结果添加到页面中
                }
            }
        });
        $(target).prop('disabled',true);
        $(target).css('opacity',0.5);
    };

    changebig(e){
        /*  let url=e.target.src;
          this.setState((prevState, props) => ({
              imgurl:url
          }));
  
          this.setState((prevState, props) => ({
              isbig:true
          }));
  */
      }

    _getDataID(){
        let dataID = ServiceRoom.getTkRoom().getMySelf().id + '_' + TkUtils.getGUID().getGUIDDate() + TkUtils.getGUID().getGUIDTime()
        return dataID;
    }
    _loadBubble(data, index){
        let imgurl=''
        const self = this;
        let bubble = '';
        if(data.msgtype=='onlyimg'){
            let st = /([^\*]+)(.png|.gif|.jpg|.jpeg)$/;
            let ary=st.exec(data.msg);
            imgurl=ary[1] + '-1' + ary[2];
        }
        if(data.id &&  data.type === 0){
            bubble = (
                <li data-identify={data.id} key={index} data-associatedMsgID={data.associatedMsgID} className={data.styleName?data.styleName:""}
                    style={{
                        display:　self.state.show ? '' : 'none',
                    }}>
                    <div className="user-msg-box" >
                        <div className="user-title">
                            <span className="username"  onClick={self.liveUserListAdd.bind(self,data.id,data.who)}><span className="limit-length">{data.who}</span><span className="keywords"> {data.tips?data.tips:""} </span></span>
                            <span className="send-time">{data.time}</span>
                        </div>
                        <div className="user-body">
                        {data.msgtype=='onlyimg'? <img  src={TkConstant.SERVICEINFO.address+imgurl} onDoubleClick={this.changebig.bind(this)} alt={imgurl} style={{width: 'auto',
                                height: 'auto',
                                maxWidth: '100%',
                                maxHeight: '100%',
                                boxSizing:'borderBox',
                                borderRadius:'0.1rem',
                                border: '2px solid #647de1'
                            }}/> :<div className="user-sended">{data.msg}</div>}
                            {/* {data.msgtype!=='onlyimg'? <button className="translate"  style={{display:TkGlobal.playback?'none':''}} onClick={self._handleTranslateClick.bind(self)}></button>:null} */}
                        </div>
                    </div>
                    <div className="teach-admin-column" style={{display:this.adminMenu?!data.isTeacher?"block":"none":"none",float:"right",background: "#59B9F9",padding: ".03rem .04rem",borderRadius: ".04rem", position: 'absolute', top: 0, right: '15%', zIndex: 199}}>
                        <button className="teach-admin-button clear-float"  onClick={self.onClickMenuShow.bind(self)} >{!this.state.teacherAdminMenu?TkGlobal.language.languageData.broadcast.adminButton:TkGlobal.language.languageData.broadcast.closeButton}</button>
                        <ul className="teach-admin-menu clear-float" style={{display:this.state.teacherAdminMenu?"block":"none"}}>
                            <li className={"notalking-implement-bg" + (this.state.disabledNoTalking?' disabled':'')} title={TkGlobal.language.languageData.broadcast.noTalking} disabled={this.state.disabledNoTalking} onClick={self.sendUserNoTalk.bind(self,data.id)} >{TkGlobal.language.languageData.broadcast.noTalking}</li>
                            <li className={"kickout-implement-bg" +  (this.state.disabledKickOut?' disabled':'')} title={TkGlobal.language.languageData.broadcast.kickout} disabled={this.state.disabledKickOut} onClick={self.sendKickOut.bind(self,data.id)} >{TkGlobal.language.languageData.broadcast.kickout}</li>

                        </ul>
                    </div>
                </li>
            );
        }else if (data.id && data.type === 1){
            if(data.hasPassed){
                bubble = (
                    <li data-identify={data.id} key={index}
                        className={'quiz-list ' + data.styleName?data.styleName:""}
                        style={{
                            display:　self.state.show ? '' : 'none',
                        }}>
                        <div className="user-msg-box quiz">
                            <div className="user-title">
                                <span className="username">
                                    <span className="limit-length">
                                        {data.who}
                                    </span>
                                    <span className="keywords"> {data.tips?data.tips:""} </span>
                                
                                    <span className="btn-panel">
                                        <button onClick={self.handlerQuizPass.bind(self, data)} style={{marginLeft: '.08rem', display:  'none'}}>
                                            {TkGlobal.language.languageData.quiz.pass}
                                        </button>
                                        <button onClick={self.handlerQuizAns.bind(self, data)} style={{marginLeft: '.08rem', display: (self.isTeacher) ? '' : 'none'}}>
                                            {TkGlobal.language.languageData.quiz.answer}
                                        </button>
                                        <button onClick={self.handlerQuizDel.bind(self, data)} style={{marginLeft: '.08rem', display: (self.isTeacher) ? '' : 'none'}}>
                                            {TkGlobal.language.languageData.quiz.delete}
                                        </button>
                                    </span>
                                </span>
                                <span className="send-time">{data.time}</span>
                            </div>
                            <div className="user-body">
                            {data.msgtype=='onlyimg'? <img src={TkConstant.SERVICEINFO.address+imgurl} onClick={this.changebig.bind(this)} alt={imgurl} style={{width:"0.9rem",height:"1rem"}}/>:<div className="user-sended ">{TkGlobal.language.languageData.quiz.ask} : {data.msg}</div>}
                            </div>
                        </div>
                        <ul>
                            {
                                self.props.ansList.map((item, index)=>{
                                    return  <AnsItem key={index} data={item} index={index} />
                                })
                            }
                        </ul>
                    </li>
                );
            }else{
                bubble = (
                    // <li className="notice" key={index}
                    //     style={{display: (this.state.show && this.isTeacher) ? '' : 'none'}}>
                    //     <span className="send-time">{data.time}</span>
                    //     <span className="the-msg" dangerouslySetInnerHTML={{__html:data.remind}}></span>
                    //     <div className="confirm-panel">
                    //         <button className="btn-confirm" onClick={self.handlerQuizPass.bind(self, data)}>是</button>
                    //         <button className="btn-cancel" onClick={self.handlerQuizDel.bind(self, data)}>否</button>
                    //     </div>
                    // </li>
                    <li data-identify={data.id} key={index}
                        className={'quiz-list ' + data.styleName?data.styleName:""}
                        style={{
                            display:　self.state.show ? '' : 'none',
                        }}>
                        <div className="user-msg-box quiz">
                            <div className="user-title">
                                <span className="username">
                                    <span className="limit-length">
                                        {data.who}
                                    </span>
                                    <span className="keywords"> {data.tips?data.tips:""} </span>
                                    <span className="btn-panel">
                                        <button onClick={self.handlerQuizPass.bind(self, data)} style={{marginLeft: '.08rem', display: ( !self.state.passed && !data.isTeacher && self.isTeacher) ? '' : 'none'}}>
                                            {TkGlobal.language.languageData.quiz.pass}
                                        </button>
                                        <button onClick={self.handlerQuizAns.bind(self, data)} style={{marginLeft: '.08rem', display: (self.isTeacher) ? '' : 'none'}}>
                                            {TkGlobal.language.languageData.quiz.answer}
                                        </button>
                                        <button onClick={self.handlerQuizDel.bind(self, data)} style={{marginLeft: '.08rem', display: (self.isTeacher) ? '' : 'none'}}>
                                            {TkGlobal.language.languageData.quiz.delete}
                                        </button>
                                    </span>
                                </span>
                                <span className="send-time">{data.time}</span>
                            </div>
                            <div className="user-body">
                                <div className="user-sended">{TkGlobal.language.languageData.quiz.ask} : {data.msg}</div>
                            </div>
                        </div>
                        <ul>
                            {
                                self.props.ansList.map((item, index)=>{
                                    return  <AnsItem key={index} data={item} index={index} />
                                })
                            }
                        </ul>
                    </li>
                );
            }
        } else {
            bubble = (
                <li className={"notice " + data.styleName} key={index}>
                    <span className="send-time">{data.time}</span>
                    <span className="the-msg" dangerouslySetInnerHTML={{__html:data.who}}></span>
                </li>
            );
        }

        return bubble;
    }

    render(){
        return this._loadBubble(this.props.data, this.props.index);
    }

}

export default Bubble;