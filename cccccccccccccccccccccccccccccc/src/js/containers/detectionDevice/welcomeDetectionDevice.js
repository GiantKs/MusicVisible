/**
 * 检测设备-开始检测的Smart组件
 * @module WelcomeDetectionDeviceSmart
 * @description   提供检测设备-开始检测的Smart组件
 * @author QiuShao
 * @date 2017/08/18
 */

'use strict';
import React from 'react';
import TkGlobal from 'TkGlobal';
import eventObjectDefine from 'eventObjectDefine';
import WebAjaxInterface from 'WebAjaxInterface' ;

class WelcomeDetectionDeviceSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            show:false
        };
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
    };

    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        let that = this;
        //注册执行检测界面的事件，调用检测界面的方法detectionDeviceHandlerExecute()
        eventObjectDefine.CoreController.addEventListener( "welcomeDetectionDevice" , that.handlerWelcomeDetectionDevice.bind(that) , that.listernerBackupid );
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        let that = this;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid );
    };

    handlerWelcomeDetectionDevice(recvEventData){
        this.setState({show:true});
        /*let resCallback = {
            doneCallback(res){
                let serverSpeed = {};
                let serverIsSelect = {};
                let serverNameEleArr = [];
                res.map((item,index)=>{
                    serverSpeed[item.servername] = '--ms';
                    serverIsSelect[item.servername] = true;
                    serverNameEleArr.push(<li key={index} className={serverIsSelect[item.servername]?"active":''}>
                        <input id={'srever_'+index} type="radio" defaultChecked={serverIsSelect[item.servername]}/>
                        <label htmlFor={'srever_'+index}>{item.servername}</label>
                        <span>{'（'+serverSpeed[item.servername]+'）'}</span>
                    </li>);
                });
                eventObjectDefine.CoreController.dispatchEvent({type:'getNetworkEleArr',data:{serverSpeed,serverIsSelect,serverNameEleArr}});
            },
        };
        WebAjaxInterface.getServerList(resCallback);//获取服务器名称*/
    };
    startDetectionOnClick(event) {
        const that = this;
        that.setState({show:false});
        eventObjectDefine.CoreController.dispatchEvent({type:'mainDetectionDevice'});
    };
    render(){
        let that = this ;
        let { show } = that.state ;
        return (
            <article className="startdetection-container" style={{display: !show?'none':'block' }} >
                <div className="wel-all">
                    <p className="welcome-to-use">{TkGlobal.language.languageData.login.language.detection.welAll.one}
                        {TkGlobal.language.languageData.login.language.detection.welAll.two} </p>
                    <p className="ensure">{TkGlobal.language.languageData.login.language.detection.welAll.three}</p>
                </div>
                <button className="start-detection add-cursor-pointer" onClick={that.startDetectionOnClick.bind(that)} id="start-detection">
                    {TkGlobal.language.languageData.login.language.detection.welAll.four}
                </button>
            </article>
        )
    };
};
export  default  WelcomeDetectionDeviceSmart ;

