/**
 * 网络状态Smart组件
 * @module NetworkStatusSmart
 * @description   承载网络状态Smart组件
 * @author QiuShao
 * @date 2017/09/26
 */

'use strict';
import React from 'react';
import eventObjectDefine from 'eventObjectDefine';
import TkConstant from 'TkConstant';
import TkGlobal from "TkGlobal";
import ServiceRoom from "ServiceRoom";
import ServiceSignalling from "ServiceSignalling";
import  "../../../../../../css/cssNetwordStatus.css";

class NetworkStatusSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            networkStatus:{
                rtt:0 , //延时
                packetsLost:0 , //丢包率(%)
                kbps:0 , //带宽
                frameRatio:{frameWidth:0 , frameHeight:0 } , //分辨率
                frameRate:0,//帧率
            } ,
            show:false
        };
        this.isSendNetworkDelay = 0;
        this.listernerBackupid =  new Date().getTime()+'_'+Math.random();
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this ;
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.streamRtcStats_video , that.handlerStreamRtcStats_video.bind(that) , that.listernerBackupid );
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.streamRtcStatsFailed_video , that.handlerStreamRtcStatsFailed_video.bind(that) , that.listernerBackupid );
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.streamAdded_video , that.handlerStreamAdded_video.bind(that) , that.listernerBackupid );
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.streamRemoved_video , that.handlerStreamRemoved_video.bind(that) , that.listernerBackupid );
        //eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.streamFailed_video , that.handlerStreamFailed_video.bind(that) , that.listernerBackupid );

    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        const that = this ;
        clearInterval(this.sendNetworkDelayInterval);
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid);
    };

    handlerStreamRtcStats_video(recvEventData){
        let stream = recvEventData.stream ;
        if( stream.extensionId === ServiceRoom.getTkRoom().getMySelf().id ){
            let { networkStatus = {} } = recvEventData.message ;
            this.state.networkStatus = networkStatus ;
            this.setState({networkStatus:this.state.networkStatus});
            let data = {
                extensionId:stream.extensionId,
                networkStatus:networkStatus,
            };
            eventObjectDefine.CoreController.dispatchEvent({type:'handleMyselfNetworkStatus',
                message:{data: data},
            });
            if (this.isSendNetworkDelay === 0) {
                this.handlerSendNetworkDelay();//设置发送网络状态的定时器，及发送信令：
            }
            this.isSendNetworkDelay++;
            //传递网络状态给设备检测组件：
            eventObjectDefine.CoreController.dispatchEvent({type:'handleTestSystemInfo', message:{data:this.state}});
        }
    };
    handlerSendNetworkDelay() {//设置发送网络状态的定时器，及发送信令：
        this.sendNetworkDelayInterval = setInterval(()=>{
            let data = {
                extensionId:ServiceRoom.getTkRoom().getMySelf().id,
                networkStatus:this.state.networkStatus,
            };
            ServiceSignalling.sendSignallingFromSendNetworkState(data,data.extensionId);
        },5000);
    }

    handlerStreamAdded_video(recvEventData){
        let stream = recvEventData.stream ;
        if(stream.extensionId === ServiceRoom.getTkRoom().getMySelf().id  && TkGlobal.isGetNetworkStatus ){
            this.setState({show:true});
            //传递网络状态给设备检测组件：
            eventObjectDefine.CoreController.dispatchEvent({type:'handleTestSystemInfo', message:{data:this.state},});
        }
    };

    handlerStreamRemoved_video(recvEventData){
        let stream = recvEventData.stream ;
        if( stream.extensionId === ServiceRoom.getTkRoom().getMySelf().id ){
            this.setState({show:false});
            //传递网络状态给设备检测组件：
            eventObjectDefine.CoreController.dispatchEvent({type:'handleTestSystemInfo', message:{data:this.state},});
            //清除发送网络状态的定时器，删除这条信令：
            clearInterval(this.sendNetworkDelayInterval);
            this.isSendNetworkDelay = 0;
            let data = {};
            let isDelMsg = true;
            ServiceSignalling.sendSignallingFromSendNetworkState(data,stream.extensionId,isDelMsg);
        }
    };

/*    handlerStreamFailed_video(recvEventData){
        let stream = recvEventData.stream ;
        if( stream.extensionId === ServiceRoom.getTkRoom().getMySelf().id  ){
            this.setState({show:false});
            //传递网络状态给设备检测组件：
            eventObjectDefine.CoreController.dispatchEvent({type:'handleTestSystemInfo', message:{data:this.state},});
            //清除发送网络状态的定时器，删除这条信令：
            clearInterval(this.sendNetworkDelayInterval);
            this.isSendNetworkDelay = 0;
            let data = {};
            let isDelMsg = true;
            ServiceSignalling.sendSignallingFromSendNetworkState(data,stream.extensionId,isDelMsg);
        }
    };*/
    handlerStreamRtcStatsFailed_video(recvEventData){
        let stream = recvEventData.stream ;
        if( stream.extensionId === ServiceRoom.getTkRoom().getMySelf().id  ){
            this.setState({show:false});
            //传递网络状态给设备检测组件：
            eventObjectDefine.CoreController.dispatchEvent({type:'handleTestSystemInfo', message:{data:this.state},});
            //清除发送网络状态的定时器，删除这条信令：
            clearInterval(this.sendNetworkDelayInterval);
            this.isSendNetworkDelay = 0;
            let data = {};
            let isDelMsg = true;
            ServiceSignalling.sendSignallingFromSendNetworkState(data,stream.extensionId,isDelMsg);
        }
    };

    /*获取网络状态:优、良好、一般、*/
    _getNetworkText(packetsLost , rtt ,kbps){
        let networkText = "";
        let networkStyle = undefined ;
        if(packetsLost <= 1 ){
            networkText = TkGlobal.language.languageData.networkStatus.network.value.excellent ;
        }else if( packetsLost <= 5 ){
            networkText = TkGlobal.language.languageData.networkStatus.network.value.well ;
        }else if( packetsLost <= 10){
            networkText = TkGlobal.language.languageData.networkStatus.network.value.general ;
            networkStyle = {color:"#ff8b2b"};
        }else{
            networkText = TkGlobal.language.languageData.networkStatus.network.value.suck ;
            networkStyle = {color:"#ff021d"};
        }
        return{
            networkText:networkText ,
            networkStyle:networkStyle
        }
    }

    render(){
        let that = this ;
        let { networkStatus = {} , show } = that.state ;
        let {rtt , packetsLost , kbps} = networkStatus ;
        let {networkText , networkStyle } = that._getNetworkText( packetsLost , rtt ,kbps);
        return (
            <div style={{display:!show ? 'none':undefined}} id="network_status_container" className="network-status-container add-position-relative add-fl" >{/*网络状态容器*/}
               <span className="rtt-container">
                    <span className="title">{TkGlobal.language.languageData.networkStatus.rtt.title.text}</span>:<span className="value" >{rtt}ms</span>
               </span>
               <span className="packetsLost-container">
                    <span className="title">{TkGlobal.language.languageData.networkStatus.packetsLost.title.text}</span>:<span className="value" >{packetsLost}%</span>
               </span>
               <span className="network-container">
                    <span className="title">{TkGlobal.language.languageData.networkStatus.network.title.text}</span>:<span className="value" style={networkStyle} >{networkText}</span>
               </span>
            </div>
        )
    };
};
export default  NetworkStatusSmart;

