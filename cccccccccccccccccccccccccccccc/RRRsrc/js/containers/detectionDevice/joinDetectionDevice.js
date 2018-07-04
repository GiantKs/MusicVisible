/**
 * 登录页面模块-检测设备
 * @module JoinDetectionDeviceSmart
 * @description   提供设备的检测页面
 * @author QiuShao
 * @date 2017/7/21
 */

'use strict';
import React from 'react';
import  eventObjectDefine from "eventObjectDefine" ;
import HandlerDetectionDevice from "./handler/handlerDetectionDevice" ;
import WelcomeDetectionDeviceSmart from "./welcomeDetectionDevice" ;
import MainDetectionDeviceSmart from "./mainDetectionDevice" ;

/*检测页面*/
class JoinDetectionDeviceSmart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show:false
        };
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
    };

    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        let that = this;
        eventObjectDefine.CoreController.addEventListener( "loadDetectionDevice" , that.handlerLoadDeviceDetection.bind(that) , that.listernerBackupid ); /*加载设备检测功能*/
        eventObjectDefine.CoreController.addEventListener( "detectionDeviceFinsh" , that.handlerDetectionDeviceFinsh.bind(that) , that.listernerBackupid ); /*设备检测完成*/
    };

    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        let that = this;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid);
    };

    handlerLoadDeviceDetection(recvEventData){
        const that = this ;
        let { start , main  , check} = recvEventData.message || {} ;
        if(check) {
            HandlerDetectionDevice.checkNeedDetectionDevice((needDetection) => {
                //needDetection = true ;//测试数据
                if(needDetection){
                    that.setState({show:true});
                    if(start){
                        eventObjectDefine.CoreController.dispatchEvent({type:'welcomeDetectionDevice'});
                    }else if(main){
                        eventObjectDefine.CoreController.dispatchEvent({type:'mainDetectionDevice'});
                    }
                }else{
                    let {handlerOkCallback} = that.props ;
                    if(handlerOkCallback && typeof handlerOkCallback === 'function'){
                        handlerOkCallback({needDetection:needDetection});
                    }
                }
            });
        } else {
            if(start){
                that.setState({show:true});
                eventObjectDefine.CoreController.dispatchEvent({type:'welcomeDetectionDevice'});
            }else if(main){
                that.setState({show:true});
                eventObjectDefine.CoreController.dispatchEvent({type:'mainDetectionDevice'});
            }
        }
    };
    handlerDetectionDeviceFinsh(recvEventData){
		let {clearFinsh} = recvEventData.message || {};
		const that = this ;
		if(clearFinsh){
		    that.setState({show:false});
		}
  };
    render() {
        let that = this;
        let {show} = that.state ;
        let {isEneter, handlerOkCallback , clearFinsh , backgroundColor , okText , titleText , saveLocalStorage} = that.props ;
        return (
            <section id="all_start" className="startdetection add-position-absolute-top0-left0" style={{display: !show ? 'none' : 'block'  , backgroundColor:backgroundColor }}>
                <WelcomeDetectionDeviceSmart /> {/*开始检测界面开始 */}
                <MainDetectionDeviceSmart isEnter={isEneter} clearFinsh={clearFinsh} closeDetectionCallback={(isShow)=>{that.setState({show:isShow})}} handlerOkCallback={handlerOkCallback} okText={okText} titleText={titleText} saveLocalStorage={saveLocalStorage}  /> {/*设备检测的主要页面*/}
            </section>
        )
    };
}
;
export default JoinDetectionDeviceSmart;

