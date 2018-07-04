/**
 * 检测设备-检测主界面的Smart组件(远程控制)
 * @module RemoteControlDetectionDeviceSmart
 * @description   提供检测设备-检测主界面的Smart组件(远程控制)
 * @author QiuShao
 * @date 2017/11/26
 */
'use strict';
import React from 'react';
import TkGlobal from 'TkGlobal';
import eventObjectDefine from 'eventObjectDefine';
import ServiceRoom from 'ServiceRoom' ;
import ServiceSignalling from 'ServiceSignalling' ;


class RemoteControlDetectionDeviceSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            show:false ,
            loading:false ,
            loadShowOptionJson:{
                userAreaSelection:false ,
                deviceManagement:false ,
            },
            titleText:undefined ,
            devicesDesc:{
                videoinput:{},
                audioinput:{},
                audiooutput:{}
            },
            selectDevice:{
                videoinput: undefined,
                audioinput: undefined,
                audiooutput: undefined
            },
            hasDetection:{
                videoinput: false,
                audioinput: false,
                audiooutput: false,
            },
            //xueln 添加
            isClient:TkGlobal.isClient,
            serverlist:{},
        };
        this.backupServerList = {} ;
        this.backupDeviceInfo = {} ;
        this.oldUseServerName = '';
        this.useServerName = '';
        this.selectDevice = {
            videoinput: undefined,
            audioinput: undefined,
            audiooutput: undefined
        };
        this.deviceLabelMap = {
            videoinput:{
                default:TkGlobal.language.languageData.alertWin.settingWin.defult.text ,
                defaultLabel:TkGlobal.language.languageData.alertWin.settingWin.videoInput.text ,
                notDevice:TkGlobal.language.languageData.login.language.detection.selectOption.noCam
            },
            audioinput:{
                default:TkGlobal.language.languageData.alertWin.settingWin.defult.text ,
                defaultLabel:TkGlobal.language.languageData.alertWin.settingWin.audioInput.text ,
                notDevice:TkGlobal.language.languageData.login.language.detection.selectOption.noMicrophone
            },
            audiooutput:{
                default:TkGlobal.language.languageData.alertWin.settingWin.defult.text ,
                defaultLabel:TkGlobal.language.languageData.alertWin.settingWin.audioOutput.text ,
                notDevice:TkGlobal.language.languageData.login.language.detection.selectOption.noEarphones
            },
        };
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
    };

    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        eventObjectDefine.CoreController.addEventListener( 'remoteControl_userAreaSelection' , this.handleRemoteControl_userAreaSelection.bind(this) , this.listernerBackupid); //remoteControl_userAreaSelection 事件
        eventObjectDefine.CoreController.addEventListener( 'remoteControl_deviceManagement' , this.handleRemoteControl_deviceManagement.bind(this) , this.listernerBackupid); //remoteControl_deviceManagement 事件
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPubmsg , this.handlerRoomPubmsg.bind(this) , this.listernerBackupid); //roomPubmsg事件
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomUserpropertyChanged , this.handlerRoomUserpropertyChanged.bind(this) , this.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomParticipantJoin , this.handlerRoomParticipantJoin.bind(this) , this.listernerBackupid);
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        eventObjectDefine.CoreController.removeBackupListerner(this.listernerBackupid);
    };
    handlerRoomParticipantJoin(recvEventData){
        if(this.state.loadShowOptionJson.userAreaSelection){
            let user  = recvEventData.user ;
            if(user && user.id === this.userid){
                this.changeServerClick( user.servername );
            }
        }
    };
    handlerRoomUserpropertyChanged(roomUserpropertyChangedEventData){
        if(this.state.loadShowOptionJson.userAreaSelection){
            let user = roomUserpropertyChangedEventData.user ;
            if(user && user.id === this.userid){
                let changePropertyJson  = roomUserpropertyChangedEventData.message ;
                for( let key of Object.keys(changePropertyJson) ){
                    if( key !== 'servername' ){
                        this.changeServerClick(changePropertyJson[key]);
                    }
                }
            }
        }
    };

    handlerRoomPubmsg(recvEventData){
        let pubmsgData = recvEventData.message ;
        let fromID = pubmsgData.fromID ;
        switch(pubmsgData.name) {
            case "RemoteControl":
                switch (pubmsgData.data.action){
                    case 'areaSelection':
                        if (this.state.loadShowOptionJson.userAreaSelection && pubmsgData.data.type === 'sendServerListInfo' && fromID === this.userid){
                            let { serverList , serverName } = pubmsgData.data.serverData;
                            this.useServerName = serverName ;
                            this.backupServerList = serverList && typeof serverList ==='object'? Object.assign({} , serverList) : {} ;
                            this.setState({serverlist:serverList , loading:false});
                        }
                        break ;
                    case 'deviceManagement':
                        if (this.state.loadShowOptionJson.deviceManagement && pubmsgData.data.type === 'sendDeviceInfo' && fromID === this.userid ){
                            let { deviceInfo } = pubmsgData.data.deviceData;
                            this.selectDevice = deviceInfo.useDevices && typeof deviceInfo.useDevices === 'object'? Object.assign({} , deviceInfo.useDevices )  : this.selectDevice ;
                            this.setState({selectDevice: deviceInfo.useDevices && typeof deviceInfo.useDevices === 'object'? Object.assign({} , deviceInfo.useDevices ) :  this.state.selectDevice });
                            this._changeDeviceElementDesc(deviceInfo);
                            this.backupDeviceInfo = deviceInfo && typeof deviceInfo ==='object'? Object.assign({} , deviceInfo) : {} ;
                            this.setState({loading:false});
                        }
                        break ;
                }
                break;
        }
    };

    handleRemoteControl_deviceManagement(recvEventData){
        let {userid} = recvEventData.message ;
        if( !(ServiceRoom.getTkRoom() &&   ServiceRoom.getTkRoom().getUser(userid)) ){
            L.Logger.error('remoteControl_deviceManagement:user is not exist , user id is '+userid+'!');
            return ;
        }
        this.userid = userid ;
        for( let key of Object.keys(this.state.loadShowOptionJson) ){
            if(key === 'deviceManagement'){
                this.state.loadShowOptionJson[key] = true ;
            }else{
                this.state.loadShowOptionJson[key] = false ;
            }
        }
        let user = ServiceRoom.getTkRoom().getUser(userid) ;
        let titleText = TkGlobal.language.languageData.login.language.detection.deviceTestHeader.deviceSwitch.text + '('+user.nickname+')' ;
        this.setState({show:true , loadShowOptionJson:this.state.loadShowOptionJson , loading:true , titleText: titleText });
        this._getRemoteDeviceInfo(userid);
    };

    handleRemoteControl_userAreaSelection(recvEventData){
        let {userid} = recvEventData.message ;
        if( !(ServiceRoom.getTkRoom() &&   ServiceRoom.getTkRoom().getUser(userid)) ){
            L.Logger.error('remoteControl_userAreaSelection:user is not exist , user id is '+userid+'!');
            return ;
        }
        this.userid = userid ;
        for( let key of Object.keys(this.state.loadShowOptionJson) ){
            if(key === 'userAreaSelection'){
                this.state.loadShowOptionJson[key] = true ;
            }else{
                this.state.loadShowOptionJson[key] = false ;
            }
        }
        let user = ServiceRoom.getTkRoom().getUser(userid) ;
        let titleText = TkGlobal.language.languageData.login.language.detection.deviceTestHeader.optimalServer.text + '('+user.nickname+')' ;
        this.setState({show:true , loadShowOptionJson:this.state.loadShowOptionJson, loading:true , titleText:titleText});
        this._getRemoteServerListInfo(userid);
    };

    changeServerClick(servername) {//选择服务器
        for (let key of Object.keys(this.state.serverlist)) {
            if (key === servername) {
                this.state.serverlist[key].isUseServer = true;
            }else {
                this.state.serverlist[key].isUseServer = false;
            }
        }
        this.setState({serverlist:this.state.serverlist});
    };

    /*确定按钮的点击事件*/
    okButtonOnClick(step){
        if(this.state.loadShowOptionJson.userAreaSelection){
            let user = ServiceRoom.getTkRoom().getUser(this.userid);
            if(user && user.servername !== this.useServerName){
                ServiceSignalling.setParticipantPropertyToAll(this.userid , {servername: this.useServerName});
            }
        }else if(this.state.loadShowOptionJson.deviceManagement){
            this._changeUserDeviceManagement(this.userid);
        }
        this._resetDefaultStateAndData();
    };
    closeButtonOnClick(step) {
        this._resetDefaultStateAndData();
    };

    /*改变选中的设备*/
    changeSelectDeviceOnChange(deviceKind , event){
        const that = this ;
        let deviceId =  event.target.value ;
        that._changeStateSelectDevice(deviceKind , deviceId);
    };

    /*根据枚举设备信息更改设备的描述信息*/
    _changeDeviceElementDesc(deviceInfo){
        const that = this ;
        let { devices ,useDevices , hasdevice } = deviceInfo ;
        let devicesDesc = {
            videoinput:{},
            audioinput:{},
            audiooutput:{}
        };
        let deviceNumJson = {
            videoinput:0 ,
            audioinput:0 ,
            audiooutput:0
        };
        for( let [key , value] of Object.entries(devices) ){
            if (value.length === 0) {//是否存在设备
                that.state.hasDetection[key] = false;
            }else {
                that.state.hasDetection[key] = true;
            }
            that.setState({hasDetection:that.state.hasDetection});
            value.map( (device , index) => {
                devicesDesc[key][device.deviceId] = {
                    deviceId: device.deviceId ,
                    groupId: device.groupId ,
                    kind: device.kind ,
                    label: device.label || (  device.deviceId === "default" ? that.deviceLabelMap[key].default :  that.deviceLabelMap[key].defaultLabel + ( ++deviceNumJson[key] ) ) ,
                    select: that.selectDevice[key]=== device.deviceId ||  useDevices[key] === device.deviceId
                }
            });
        }
        that.setState({devicesDesc:devicesDesc});
    };

    /*加载设备的节点数组*/
    _loadDeviceElementByDeviceDescArray(devicesDesc){
        const that = this ;
        let devicesElementInfo = {
            audioinputElementArray:[] ,
            audiooutputElementArray:[] ,
            videoinputElementArray:[] ,
        };
        for(let [deviceKind,deviceDescJson] of Object.entries(devicesDesc) ){
            for(let  deviceDesc of Object.values(deviceDescJson) ){
                let { deviceId ,groupId , kind , label , select } = deviceDesc ;
                if(select){
                    that.selectDevice[kind] = deviceId ;
                }
                devicesElementInfo[deviceKind+'ElementArray'].push(
                    <option key={deviceKind+'_'+deviceId}  data-deviceId={deviceId}  data-groupId={groupId}  data-kind={kind}  data-label={label}  value={deviceId}  > {label}</option>
                );
            }
        }
        for( let [key , value] of Object.entries(devicesElementInfo) ){
            if(value.length === 0){ //没有设备
                let  deviceId = undefined ,groupId = undefined , kind = key.replace(/ElementArray/g,'') , label = that.deviceLabelMap[kind].notDevice, select = true ;
                if(select){
                    that.selectDevice[kind] = deviceId ;
                }
                devicesElementInfo[key].push(
                    <option key={key}    data-deviceId={deviceId} data-groupId={groupId}  data-kind={kind}  data-label={label} value={deviceId}  > {label} </option>
                );
            }
        }
        return devicesElementInfo ;
    };

    _changeStateSelectDevice(deviceKind , deviceId){
        const that = this ;
        if( that.state.selectDevice[deviceKind] !== deviceId){
            that.selectDevice[deviceKind] = deviceId ;
            that.state.selectDevice[deviceKind] = deviceId ;
            for( let [key , value] of Object.entries( that.state.devicesDesc[deviceKind]) ){
                if(key === deviceId){
                    value.select = true ;
                }else{
                    value.select = false ;
                }
            }
            that.setState({selectDevice:that.state.selectDevice , devicesDesc: that.state.devicesDesc});
        }

    };

    /*重置默认数据*/
    _resetDefaultStateAndData(){

        this.backupServerList = {} ;
        this.backupDeviceInfo = {} ;
        this.oldUseServerName = '';
        this.useServerName = '';
        this.selectDevice = {
            videoinput: undefined,
            audioinput: undefined,
            audiooutput: undefined
        };
        let changeState = {
            show:false ,
            loading:false ,
            loadShowOptionJson:{
                userAreaSelection:false ,
                deviceManagement:false ,
            },
            titleText:undefined ,
            devicesDesc:{
                videoinput:{},
                audioinput:{},
                audiooutput:{}
            },
            selectDevice:{
                videoinput: undefined,
                audioinput: undefined,
                audiooutput: undefined
            },
            hasDetection:{
                videoinput: false,
                audioinput: false,
                audiooutput: false,
            },
            //xueln 添加
            isClient:TkGlobal.isClient,
            serverlist:{},
        };
        this.setState( changeState ) ;
    };

    _getRemoteServerListInfo(userid){
        //tkpc2.0.8
        /*let data = {   // 这里不需要问远程获取服务器列表信息
            action:'areaSelection' ,
            type:'getServerListInfo' ,
         };
         ServiceSignalling.sendSignallingFromRemoteControl(userid , data);*/
        ServiceRoom.getTkRoom().requestServerList(TkConstant.SERVICEINFO.hostname,TkConstant.SERVICEINFO.port,(serverlist,res)=>{
            let user = ServiceRoom.getTkRoom().getUser(this.userid) ;
            if(this.userid && ServiceRoom.getTkRoom().getUser(this.userid)){
                let serverList = undefined ;
                let serverName = user.servername ;
                if(serverlist && typeof serverlist === 'object'){
                    serverList = {};
                    for(let [key,value] of Object.entries(serverlist) ){
                        serverList[key] = Object.assign({} , value);
                        if( serverList[key].serverareaname === serverName){
                            serverList[key].isUseServer = true ;
                        }else {
                            serverList[key].isUseServer = false ;
                        }
                    }
                }else{
                    serverList = serverlist ;
                }
                this.useServerName = serverName ;
                this.backupServerList = serverList && typeof serverList ==='object'? Object.assign({} , serverList) : {} ;
                this.setState({serverlist:serverList , loading:false});
            }else{
                L.Logger.error('_getRemoteServerListInfo:user id not exist , user id is '+this.userid+"!");
            }
        });
    }

    _getRemoteDeviceInfo(userid){
        let data = {
            action:'deviceManagement' ,
            type:'getDeviceInfo' ,
        };
        ServiceSignalling.sendSignallingFromRemoteControl(userid , data);
    }

    _changeUserDeviceManagement(userid){
        if( this.selectDevice  && typeof this.selectDevice === 'object'){
            let data = {
                action: 'deviceManagement',
                type: 'changeDeviceInfo',
                changeData:{selectDeviceInfo:this.selectDevice },
            };
            ServiceSignalling.sendSignallingFromRemoteControl(userid , data);
        }
    }

    _getServerListEle() {//创建服务器列表标签
        let that = this;
        let serverNameEleArr = [];
        if (this.state.serverlist && this.state.serverlist !== null && this.state.serverlist !== undefined) {
            for (let [key, value] of Object.entries(this.state.serverlist)) {
                if (value.isUseServer=== true) {
                    that.useServerName = value.serverareaname;
                }
                serverNameEleArr.push(
                    <li key={key} className={(value.isUseServer ? "active" : '')}>
                        <span>
                            <input id={'srever_' + key} name="selectServer" value={key} onChange={that.changeServerClick.bind(that, value.serverareaname)} type="radio" checked={value.isUseServer}/>
                        </span>
                        <span>
                            <label htmlFor={'srever_' + key}>{TkGlobal.language.name === 'chinese'?value.chinesedesc:value.englishdesc}</label>
                        </span>
                    </li>
                );
            }
        }
        return serverNameEleArr;
    };

    render(){
        let that = this ;
        let { show   , devicesDesc   , loading , loadShowOptionJson  , titleText} = that.state ;
        let { okText , backgroundColor } = that.props;
        let { audioinputElementArray ,  audiooutputElementArray , videoinputElementArray } = that._loadDeviceElementByDeviceDescArray(devicesDesc);
        let serverNameEleArr = this._getServerListEle() ;
        return (
            <section id="remote_control_all_start_remote_control" className="remote-control-container startdetection add-position-absolute-top0-left0" style={{display: !show ? 'none' : 'block'  , backgroundColor:backgroundColor }}>
                <article id="remote_control_main_detection_device" className="device-test" style={{display: !show ? 'none' : 'block'}}>
                    <div className="net-testing">
                        <span className="device-test-header">{titleText || TkGlobal.language.languageData.login.language.detection.deviceTestHeader.device.text}</span>
                        <button id="remote_control_close-detection" className="close-detection" onClick={that.closeButtonOnClick.bind(that , -1)} style={{display:"block"}}>+</button>
                    </div>
                    <div className="testing-bot">
                        <div className="testing-right en-testing-right">
                            <div className="network-right fixldy" id="remote_control_skip-network" style={{ display:loadShowOptionJson.userAreaSelection?'block':'none'}} >
                                <div className="test-network-title">
                                    {/*<span className="network-title-select">{TkGlobal.language.languageData.login.language.detection.networkExtend.title.select}</span>
                                     <span className="network-title-server">{TkGlobal.language.languageData.login.language.detection.networkExtend.title.area}</span>*/}
                                    {/*<span className="network-title-delay">{TkGlobal.language.languageData.login.language.detection.networkExtend.title.delay}</span>*/}
                                    {TkGlobal.language.languageData.login.language.detection.networkExtend.title.text}
                                </div>
                                <ul className="test-network-box">
                                    {serverNameEleArr}
                                </ul>
                                <div className="network-button">
                                    <button className="detection-result-btn"  onClick={that.okButtonOnClick.bind(that , 4)} >{okText}</button>
                                    {/*<button onClick={this.testServerSpeedClick.bind(this)} className="test-server-btn detection-result-btn">{TkGlobal.language.languageData.login.language.detection.networkExtend.testBtn}</button>*/}
                                </div>
                            </div>
                            <div className="video-right fixldy" id="remote_control_skip-video" style={{ display:loadShowOptionJson.deviceManagement?'block':'none'}} >
                                <div className="video-right-inside device-right-inside">
                                    <div className="camera-option-all clear-float">
                                        <span className="camera-option">{TkGlobal.language.languageData.login.language.detection.videoinputExtend.cameraOptionAll.cameraOption.text}</span>
                                        <div className="styled-select" id="remote_control_video-select">
                                            <select id="remote_control_videoSource" value={that.state.selectDevice.videoinput} className="no-camera-option" onChange={that.changeSelectDeviceOnChange.bind(that ,'videoinput' ) } >
                                                {videoinputElementArray}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="camera-option-all clear-float">
                                        <span className="camera-option">{TkGlobal.language.languageData.login.language.detection.audioouputExtend.cameraOptionAll.cameraOption.text}</span>
                                        <div className="styled-select">
                                            <select  id="remote_control_audioOutput" value={that.state.selectDevice.audiooutput} className="no-camera-option" onChange={that.changeSelectDeviceOnChange.bind(that  ,'audiooutput' ) } >
                                                {audiooutputElementArray}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="camera-option-all clear-float ">
                                        <span className="camera-option">{TkGlobal.language.languageData.login.language.detection.audioinputExtend.cameraOptionAll.cameraOption.text}</span>
                                        <div className="styled-select">
                                            <select id="remote_control_audioSource" className="no-camera-option" value={that.state.selectDevice.audioinput}  onChange={that.changeSelectDeviceOnChange.bind(that  ,'audioinput' ) } >
                                                {audioinputElementArray}
                                            </select>
                                        </div>
                                    </div>
                                {/*    <div className="notice-red">
                                        {TkGlobal.language.languageData.login.language.detection.videoinputExtend.cameraOptionAll.noticeRed.text}
                                    </div>
                                    <div className="camera-black" id="remote_control_camera-black">
                                        {this.state.isClient?<embed id="remote_control_videoinput_video_stream"  type="application/x-ppapi-proxy" data-notDevice={that.selectDevice.videoinput===undefined?true:undefined} ></embed>:<video id="remote_control_videoinput_video_stream" autoPlay data-notDevice={that.selectDevice.videoinput===undefined?true:undefined} ></video>}
                                    </div>*/}
                                </div>
                                <div className="see-button" style={{display:"block"}}>
                                    <button className="can-see detection-result-btn" onClick={that.okButtonOnClick.bind(that , 4)} >{okText}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div  className="remote-control-loading add-position-absolute-top0-left0"  style={{display:loading?'block':'none'}} ></div>
                </article>
            </section>
        )
    };
};
export  default  RemoteControlDetectionDeviceSmart ;

