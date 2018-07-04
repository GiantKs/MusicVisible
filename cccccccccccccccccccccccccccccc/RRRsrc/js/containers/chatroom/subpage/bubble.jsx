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
            passed: false,
            isbig:false,
            imgurl:'',
            width:'3rem',
            height:'1.5rem'
        }
        this.isTeacher = TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant;
        this.me = ServiceRoom.getTkRoom().getMySelf();
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
    }

    componentDidMount() {   
        eventObjectDefine.CoreController.addEventListener( "textMessageFilter" , this.handlerFilter.bind(this), this.listernerBackupid); //roomPubmsg事件
    };

    componentWillUnmount(){
        eventObjectDefine.CoreController.removeBackupListerner(this.listernerBackupid );
    }

    changebig(e){
       let url=e.target.src;
        eventObjectDefine.CoreController.dispatchEvent({type:'isBigPictureDisplay',imgurl:url})
    }
    getsize(e){
        this.setState({
            width:(Math.round(e.target.width)+3.6)/100+'rem' ,
            height:(Math.round(e.target.height)+3.6)/100+'rem'
        })

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
                <li tkcustomdataidentify={data.id} key={index} tkcustomdataassociatedmsgid={data.associatedMsgID} className={data.styleName?data.styleName:""}
                    style={{
                        display:　self.state.show ? '' : 'none',
                    }}>
                    <div className="user-msg-box">
                        <div className="user-title">
                            <span className="username"><span className="limit-length">{data.who}</span><span className="keywords"> {data.tips?data.tips:""} </span></span>
                            <span className="send-time">{data.time}</span>
                        </div>
                        <div className="user-body">
                                {data.msgtype=='onlyimg'? <div ref={div=>this.div=div} style={{height: this.state.height,width:this.state.width}}><img onLoad={this.getsize.bind(this)} src={TkConstant.SERVICEINFO.address+imgurl} onDoubleClick={this.changebig.bind(this)} alt={imgurl} style={{width: 'auto',
                                    height: 'auto',
                                    maxWidth: '100%',
                                    maxHeight: '100%',
                                    boxSizing:'borderBox',
                                    borderRadius:'0.1rem',
                                    border: '2px solid #647de1'
                                }}/></div> :<div className="user-sended ">{data.msg}</div>}

                            {data.msgtype!=='onlyimg'? <button className="translate"  style={{display:TkGlobal.playback?'none':''}} onClick={self._handleTranslateClick.bind(self)}></button>:null}
                        </div>
                    </div>

                </li>
            );
        }else if (data.id && data.type === 1){
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
                <li tkcustomdataidentify={data.id} key={index}
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
                            {data.msgtype=='onlyimg'? <div style={{height: '1.5rem',width:'3rem'}}><img  src={TkConstant.SERVICEINFO.address+imgurl} onDoubleClick={this.changebig.bind(this)} alt={imgurl} style={{width: 'auto',
                                height: 'auto',
                                maxWidth: '100%',
                                maxHeight: '100%',
                                boxSizing:'borderBox',
                                borderRadius:'0.1rem',
                                border: '2px solid #647de1'
                            }}/></div> :<div className="user-sended ">{TkGlobal.language.languageData.quiz.ask} : {data.msg}</div>}
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