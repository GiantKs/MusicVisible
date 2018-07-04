import React,{ Component } from 'react';
import ServiceSignalling from 'ServiceSignalling';
import TkGlobal from 'TkGlobal';
import TkUtils from 'TkUtils';
import ServiceRoom from 'ServiceRoom';
import eventObjectDefine from 'eventObjectDefine';
import Md5 from 'js-md5';
import TkConstant from 'TkConstant';

const emit = eventObjectDefine.CoreController.dispatchEvent;

class AnsItem extends Component {

    constructor(){
        super();
        this.state = {
            show: true,
        }
        this.isTeacher = TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant;
    }


    handlerQuizDel(data){
        ServiceSignalling.sendSignallingFromLiveQuestions(true, data.id, {});
    }

    _handleTranslateClick(ev){
        let target = ev.target ;
        let query=$(target).siblings('.user-sended').text();
        //��-��?1|?��
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
        $.ajax({//??����
            url:"https://fanyi-api.baidu.com/api/trans/vip/translate",
            data:request,
            dataType:'jsonp',
            type:'get',
            success:function(data){
                if(data.trans_result){
                    $(target).siblings('.user-sended').append('<p>'+data.trans_result[0].dst+'</p>');//??��-��??��1?����?����?��3???D
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

    _loadAnsItem(data, index) {
        let self = this;
        let ansItem = '';

        if(data.id) {
            ansItem = (
                <li tkcustomdataidentify={data.id} key={index}
                    className={data.styleName?data.styleName:""} 
                    style={{display: this.state.show === true ? '' : 'none'}}>
                    <div className="user-msg-box ans">
                        <div className="user-title">
                            <span className="username">
                                <span className="limit-length">
                                    {data.who}
                                </span>
                                <span className="keywords"> {data.tips?data.tips:""} </span>
                                <span className="btn-panel">
                                    <button onClick={self.handlerQuizDel.bind(self, data)}  style={{marginLeft: '.08rem', display: (this.state.show && this.isTeacher) ? '' : 'none'}}>
                                        {TkGlobal.language.languageData.quiz.delete}
                                    </button>
                                </span>
                            </span>
                            <span className="send-time">{data.time}</span>
                        </div>
                        <div className="user-body">
                            <div className="user-sended ">{TkGlobal.language.languageData.quiz.answer} : {data.msg}</div>
                            <button className="translate"  style={{display:TkGlobal.playback?'none':''}} onClick={self._handleTranslateClick.bind(self)}  ></button>
                        </div>
                    </div>
                </li>
            );
        }

        return ansItem;
    }

    render(){
        return this._loadAnsItem(this.props.data, this.props.index);
    }

}

export default AnsItem;