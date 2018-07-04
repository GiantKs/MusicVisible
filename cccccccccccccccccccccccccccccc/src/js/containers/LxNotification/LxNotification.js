'use strict';
import TkGlobal from "TkGlobal" ;
import React from 'react';
import eventObjectDefine from 'eventObjectDefine';

class LxNotification extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            alert:{
                isShow:false,
                ok:'',
                type:'',
            },
            confirm:{
                isShow:false,
            },
            isHasClassCenter:false,
            title:'',
            message:'',
            callback:null,
        };
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
        this.liveState = false;
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this ;
        this.liveState = true;
        eventObjectDefine.CoreController.addEventListener( "showAlert" , that.showAlert.bind(that), that.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener( "showConfirm" , that.showConfirm.bind(that), that.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener('showInputTooltip', that.showInputTooltip.bind(that), self.listernerBackupid);  //added by R37
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        this.liveState = false;
        eventObjectDefine.CoreController.removeBackupListerner(this.listernerBackupid);
    };
    alertCloseClick (callback) {
        this.setState({
            isHasClassCenter:false,
            alert:{isShow:false},
            confirm:{isShow:false},
        });
        callback(true);
    };
    confirmClick(callback) {//同意
        if( this.refs.subNode_1 && new RegExp('^[ ]+$').test(this.refs.subNode_1.value))return; //校验字符是不是全为空格

        let data = {
            'text': this.refs.subNode_1 ? this.refs.subNode_1.value : undefined,
            'href': this.refs.subNode_2 ? this.refs.subNode_2.value : undefined,
            'checked': this.refs.radio1 && this.refs.radio1.checked ? 1 : this.refs.radio2 && this.refs.radio2.checked ? 2 : undefined,
        };
        if(this.liveState){
            this.setState({
                isHasClassCenter:false,
                alert:{isShow:false},
                confirm:{isShow:false},
            });
        }
        // confirm按钮点击事件会根据content类型的不同而传递不同个数的参数
        // 如果是message类的content，只传递boolean类型的参数
        // 如果是editable类的content，除了boolean类型的参数，还会传递输入框内的数据
        // if(data.text.trim() != ''){
            callback(true, data);
        // }

        if(this.refs.subNode_1!==undefined){
            this.refs.subNode_1.value = '';
        }

    };
    cancelClick(callback) {//不同意
        if(this.liveState){
            this.setState({
                isHasClassCenter:false,
                alert:{isShow:false},
                confirm:{isShow:false},
            });
        }
        callback(false);
        if(this.refs.subNode_1!==undefined){
            this.refs.subNode_1.value = '';
        }
    };
    showAlert(handleData) {
        let {title,message,ok,callback , type } = handleData.message.data;
        if(this.liveState){
            this.setState({
                alert:{
                    isShow:true,
                    ok:ok,
                    type:type,
                },
                confirm:{isShow:false},
                title:title,
                message:message,
                callback:callback,
                isHasClassCenter:true,
            })
        }
    };
    showConfirm(handleData) {
        let {title,message,isOk,callback} = handleData.message.data;
        if(this.liveState){
            this.setState({
                alert:{isShow:false},
                confirm:{
                    isShow:true,
                    isOk:isOk,
                },
                title:title,
                message:message,
                callback:callback,
                isHasClassCenter:true,
            })
        }
    };

    /***************************** R_add_origin ***********************/
    // 监听到showInputTooltip后触发的事件
    showInputTooltip(event) {
        let {title, message, isOk, callback, contentType} = event.data;
        if(this.liveState){
            this.setState({
                alert: {
                    isShow:false
                },
                confirm: {
                    isShow:true,
                    isOk:isOk,
                },
                title: title,
                message: message,
                callback: callback,
                isHasClassCenter: true,
                contentType: contentType
            })
        }
    }
    changeValue(e){
        let v = e.target.value;
        if(v.trim() === ''){
            e.target.value = ''
        }
    }
    __loadContent(){
        const self = this;
        let content = undefined;

        if(self.state.message){
            content = self.state.message;
        }else if(self.state.contentType){
            switch(self.state.contentType){
                case 'edit-text-area':
                    content = (
                        <div className="edit-node">
                            <p>{TkGlobal.language.languageData.notice.noticeTips}</p>
                            <textarea ref="subNode_1" name="" id="" cols="50" rows="6" maxLength='50' style={{marginTop: '.15rem'}}
                            placeholder='最多输入50个字符'></textarea>
                        </div>
                    );
                    break;
                case 'db-radio':
                    content = (
                        <div className="edit-node">
                            <input type="radio" ref="radio1" value='1' name='class' />{TkGlobal.language.languageData.tips.tip1}<br/>
                            <input type="radio" ref="radio2" value='2' name='class' defaultChecked="checked" style={{marginLeft: 0}}/>{TkGlobal.language.languageData.tips.tip2}
                        </div>
                    );
                    break;
                case 'edit-input':
                    content = (
                        <div className="edit-node">
                            <p>{TkGlobal.language.languageData.notice.broadcastTips}</p>
                            <label htmlFor="">{TkGlobal.language.languageData.notice.content}:</label><input ref="subNode_1" type="text" style={{marginLeft: '.08rem', width: '85%',marginTop: '.15rem'}} maxLength='20' placeholder='最多输入20个字符'/>
                        </div>
                    );
                    break;
                case 'edit-input-db':
                    content = (
                        <div className="edit-node">
                            <p>{TkGlobal.language.languageData.notice.informTips}</p>
                            <label htmlFor="">{TkGlobal.language.languageData.notice.content}:</label><input ref="subNode_1" type="text" style={{marginLeft: '.08rem',marginBottom: '.3rem', width: '85%',marginTop: '.15rem'}} maxLength='30' placeholder='最多输入30个字符'/><br/>
                            {/* <label htmlFor="">{TkGlobal.language.languageData.notice.href}:</label><input ref="subNode_2" type="text" style={{marginLeft: '.08rem'}} maxLength='50'/> */}
                        </div>     
                    );                  
                    break;
                default:
                    L.Logger.error('This content type has not defined, please check out and define this content!')
            }
        }

        return {
            content: content
        }
    }
    /**************************** R_add_terminus *********************/

    render(){
        const self = this;
        let {alert,confirm,isHasClassCenter,title, message,callback} = this.state;
        let {content} =  self.__loadContent();
        
        return (
            <section id="alert-error-confrim" className={"alert-error-confrim "+(alert.isShow?(alert.type==='error'?' error-message':' prompt-message'):'')} style={{display:(alert.isShow || confirm.isShow)?'block':'none'}}>
                <div id="alert-box" className={"alert-box " + (isHasClassCenter?'center ':'')}>
                    <div className="alert-title">
                        <p className="title-text">{title}</p>
                        {alert.isShow?<button onClick={self.alertCloseClick.bind(self,callback)} className="title-close" id="title-close"></button>:''}
                    </div>
                    <div className="alert-contant">{content}</div>
                    <div className="alert-isOk">
                        <button id="alert-confrim" onClick={alert.isShow?self.alertCloseClick.bind(self,callback):(confirm.isShow?self.confirmClick.bind(self,callback):undefined)}>{alert.isShow?alert.ok:(confirm.isShow?confirm.isOk.ok:'')}</button>
                        {confirm.isShow?<button id="alert-cancel" onClick={self.cancelClick.bind(self,callback)} className="alert-cancel">{confirm.isOk.cancel}</button>:''}
                    </div>
                </div>
            </section>
        )
    };
}
export default LxNotification;
