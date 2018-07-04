/**
 * video Dumb组件
 * @module VideoDumb
 * @description   提供 Video显示区组件
 * @author xiagd
 * @date 2017/08/10
 */
'use strict';
import React  from 'react';
import CoreController from 'CoreController' ;
import TkUtils from 'TkUtils';
import TkGlobal from 'TkGlobal';
import eventObjectDefine from 'eventObjectDefine';
import ServiceRoom from 'ServiceRoom';
import Video from "../../containers/call/baseVideo/index";
import Bg from '../../../img/call/icon_timer_sharing.png'


class DestTop extends React.Component{
    constructor(props){
        super(props);
        this.programmShare=false;
        //this.liveStreamState = undefined;
        this.programmArray = []; //可共享程序列表
        this.selectProgramm = undefined;
        this.state = {
            shareType: this.props.shareType,
            liveStreamState: undefined,
        }
    };

    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        let that = this;
        if(!TkGlobal.isBroadcast && this.props.stream)
            this.props.stream.stop();

    };

    componentDidMount(){
        let that = this;
        if(!TkGlobal.isBroadcast && this.props.stream!== undefined && !this.props.stream.playing){
            this.props.stream.play(that.props.stream.extensionId,{bar:false});
        } 
            
        //let input = this.refs.myInput;
        //eventObjectDefine.CoreController.addEventListener("programmShareSelect",that.handlerProgrammShareSelect.bind(that));
        //eventObjectDefine.CoreController.addEventListener( "liveShareStreamStart" , that.handleShareStreamStart.bind(that), that.listernerBackupid); // 共享事件
        //eventObjectDefine.CoreController.addEventListener( "liveShareStreamEnd" , that.handleShareStreamEnd.bind(that), that.listernerBackupid); // 共享事件
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that), that.listernerBackupid); //roomDelmsg事件 下课事件 classBegin
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPubmsg , that.handlerRoomPubmsg.bind(that), that.listernerBackupid); //roomPubmsg事件 桌面共享事件
        
    }
    

    /*停止共享 回调父函数*/
    stopScreenShare(){
        let that = this;
        //this.programmArray = []
        that.props.unScreenSharing();
        //that.wsToggle(false);
    }

    /*直播开始共享*/
    handleShareStreamStart(){
        let that = this;
        
        // this.liveStreamState = true;
        that.setState({
            liveStreamState: true,
        })
        if(that.props.isTeacher){
            that.handlerProgrammShareSelect();
        }
    }


    /*直播结束共享*/
    handleShareStreamEnd(){
        let that = this;
        that.setState({
            liveStreamState: false,
        })
    }

    handlerRoomDelmsg(recvEventData){

        const that = this ;
        let pubmsgData = recvEventData.message;
        switch(pubmsgData.name)
        {
            case "LiveShareStream":{
                that.handleShareStreamEnd();
                break;
            }
            case "ClassBegin":{
                if(that.state.liveStreamState)
                    that.wsToggle(false);

                break;
            }
        }
    }

    handlerRoomPubmsg(recvEventData){
        const that = this ;
        let mySelf = ServiceRoom.getTkRoom().getMySelf();

        let pubmsgData = recvEventData.message ;
        switch(pubmsgData.name)
        {

            case "LiveShareStream":{
                that.handleShareStreamStart();
                if(mySelf.role === TkConstant.role.roleChairman){
                    that.handlerProgrammShareSelect();
                }
                this.selectProgramm = parseInt(pubmsgData.data.selectProgramm);
                break;
            }
        }
    }

    handlerOnDoubleClick(event){ //双击视频全屏
        let that = this;
        if(! CoreController.handler.getAppPermissions('dblclickDeviceVideoFullScreenRight')){return ; } ;
        //let targetVideo = document.getElementById('player');
        let targetVideo = that.refs.destTopPlayer;
        if(targetVideo){
            if( TkUtils.tool.isFullScreenStatus(targetVideo) ) {
                TkUtils.tool.exitFullscreen(targetVideo);
            }else{
                TkUtils.tool.launchFullscreen(targetVideo);
            }
        }
    };



    onComboBoxChanged(e){
        this.selectProgramm = parseInt(this.refs.programmShareSelect.value);
        this.handlerProgrammShareSelectClick();
    }

    /*开始程序共享 暂时推桌面，区域，应用程序都用1280*720的分辨率，视频都用640*480的分辨率*/
    handlerProgrammShareSelectClick(){
        let that = this;

        //推流
        //that.upShareStream();

        if(TkGlobal.isBroadcast && TkGlobal.isClient) {
            var ws = {
                id: this.selectProgramm,
                mixSpk: false,
                mixMic: false,
                type: 1,
            };
            ServiceRoom.getTkRoom().updateWindowSource(ws);  //更新窗口
        }
    }
    /*获取可共享的程序*/
    handlerProgrammShareSelect(){
        let that = this;
        if(TkGlobal.isBroadcast && TkGlobal.isClient) {
            ServiceRoom.getTkRoom().getValidWindowList(1, function (windowList) {//可共享程序列表
                if (!Array.isArray(windowList)) return;
                that.programmArray = [];
                let windowsel = that.refs.programmShareSelect;
                windowsel.innerHTML = "";
                for (let index = 0; index < windowList.length; index++) {
                    let flag = false;
                    for (let i = 0; i < that.programmArray.length; i++) {
                        if (that.programmArray[i].value === windowList[index].id) {
                            flag = true;
                            break;
                        }
                    }

                    if (!flag) {
                        let item = {};
                        item.value = windowList[index].id;
                        item.label = windowList[index].title;

                        that.programmArray.push(item);

                        let textData = windowList[index].title.indexOf("-") !== -1 ? windowList[index].title.split("-")[0] : windowList[index].title;
                        
                        let optionItem = document.createElement("option");
                        //optionItem.style.width = "350px";
                        //optionItem.style.overflowX= "hidden";
                        optionItem.title = windowList[index].title;
                        optionItem.value = windowList[index].id;
                        optionItem.text = textData;
                        if(parseInt(windowList[index].id) === that.selectProgramm){
                            optionItem.selected = true;
                        }
                        windowsel.options.add(optionItem);
                    }
                }

                // for(let i=0;i<windowsel.options.length;i++)
                // {
                //     if(parseInt(windowsel.options[i].value) === that.selectProgramm)
                //     {
                //         windowsel.options[i].selected=true;
                //         break;
                //     }
                // }
            });
        }

    }


    upShareStream(){
        //推流
        let that = this;
        if(that.state.shareStream !== undefined && !that.isPublish) {
            if(!TkGlobal.isBroadcast ){//交互 发布流
                ServiceSignalling.publishDeskTopShareStream(that.state.stream);
            } else if(TkGlobal.isBroadcast && TkGlobal.isClient){ //直播且客户端
                ServiceRoom.getTkRoom().stopBroadcast(); //停止推流
                let pullWidth = 1920,pullHeight = 1080;
                that.state.shareStream.create();
                ServiceRoom.getTkRoom().uninitBroadcast();
                ServiceRoom.getTkRoom().initBroadcast(TkConstant.joinRoomInfo.pushConfigure.RTMP,10,2,pullWidth,pullHeight);
                ServiceRoom.getTkRoom().startBroadcast(that.state.shareStream.extensionId);

                
                let id = 'shareStream_' + TkConstant.joinRoomInfo.serial;
                let isDelMsg = false;
                let toID = "__all";
                let dot_not_save = false;
                let mySelf = ServiceRoom.getTkRoom().getMySelf();

                let data = {};
                data.type = -1;
                for(let i = 0; i < this.state.modeStatuses.length; i++){
                    if(this.state.modeStatuses[i]===true){
                        data.type = i;
                    }
                }
                ServiceSignalling.sendSignallingFromLiveShareStream(isDelMsg, id, toID, data, dot_not_save);
            }
            that.isPublish = true;
        }
    }



    wsToggle(t){  // t为开关
        let ws = {
            id:0,
            x: t ? window.innerWidth/2-200 : 0,
            y: t ? window.innerHeight/2-150 : 0,
            width: t ? 400 : 0,
            height:t ? 300 : 0,
            mixSpk: false,
            mixMic: false,
            type: 0,
        }
        ServiceRoom.getTkRoom().updateWindowSource(ws);  //1.更新窗口
    }



















    _loadComponent(isTeacher){
        let that = this;
        let destTopComponents = undefined ;
        let mySelf = ServiceRoom.getTkRoom().getMySelf();
        
        if(mySelf.role === TkConstant.role.roleChairman){

            // if(that.programmShare){
            //     destTopComponents = <div  ref="destTopPlayer" className={"screen-share-" +  (that.props.destTopFlag?"all":"unall") } id={that.props.stream!==undefined?that.props.stream.extensionId:""} onDoubleClick={that.handlerOnDoubleClick.bind(that)} />;
            // } else {
                let shareText = TkGlobal.language.languageData.shares.shareing.text2;
                if(that.props.shareType !== undefined && that.props.shareType !== null){
                    switch (this.props.shareType){
                        case 0 :
                            shareText = TkGlobal.language.languageData.shares.shareing.text0;
                            break;
                        case 1 :
                            shareText = TkGlobal.language.languageData.shares.shareing.text1;
                            break;
                        case 2 :
                            shareText = TkGlobal.language.languageData.shares.shareing.text2;
                            break;
                    }
                }
                destTopComponents = <div className={"screen-share-" + (that.props.destTopFlag ? "all" : "unall") + " screen-share-wrap"}>
                    <div className="screen-share-wrap-box" >
                        <div className="screen-share-wrap-bg" >
                            <img src={Bg} />
                            <span className="screen-shareing-wrap_button">{shareText}</span>
                        </div>
                        <select ref="programmShareSelect" className="programm-share-select-stop" onChange={that.onComboBoxChanged.bind(that) } style={{display: this.props.shareType===0? 'block' : 'none'}} >
                                
                        </select>
                        <button className="screen-share-wrap_button" onClick={this.stopScreenShare.bind(that)}>{TkGlobal.language.languageData.shares.stopShare.text}</button>
                    </div>
                </div>;
            // }
        } else{
            if(this.props.destTopFlag){//直播端显示，这部分没做完。这部分界面是在白板区显示。
                /*let roomProperties = ServiceRoom.getTkRoom().getRoomProperties();
                let rtmpProtocol = roomProperties.pullConfigure.RTMP;

                let pullUrl = '';
                let rtmpUrl = '';

                if(rtmpProtocol !="" && rtmpProtocol!==undefined) {
                    rtmpUrl = rtmpProtocol[0].originPullUrl;
                }
                onCloseHandler();
                broadcastInit(1280,720,rtmpUrl);
                destTopComponents =
                            <div id="flashContent"   className={"screen-share-" + (that.props.destTopFlag ? "all" : "unall")}>
                                <object type="application/x-shockwave-flash" id="cloudvPlayer" name="cloudvPlayer"  data="cloudvPlayer.swf" style={{display:'block',width:'100%', height:'100%'}} >

                                </object>
                            </div>;*/
            }else {
                destTopComponents =
                    <div ref="destTopPlayer" className={"screen-share-" + (that.props.destTopFlag ? "all" : "unall")}
                         id={that.props.stream !== undefined ? that.props.stream.extensionId : ""}
                         onDoubleClick={that.handlerOnDoubleClick.bind(that)}/>;
            }

        }
        return {destTopComponents:destTopComponents};
    }

    render(){
        //if(this.props.stream!==undefined)
        //this.props.stream.show(this.props.stream.getID());
        let that=this;
        let {bottomVesselSmartHeightRem,isTeacher} = that.props;
        let {destTopComponents} = that._loadComponent(isTeacher);

    
        return (
            <div  className="add-fl clear-float tool-and-literally-wrap add-position-relative "   style={{height:'calc(100% - '+bottomVesselSmartHeightRem+'rem)'}} id={"screen"}>
                {destTopComponents}
            </div>
        )
    };
};

export  default  DestTop;
