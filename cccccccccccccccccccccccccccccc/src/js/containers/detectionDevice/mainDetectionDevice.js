/**
 * 检测设备-检测主界面的Smart组件
 * @module MainDetectionDeviceSmart
 * @description   提供检测设备-检测主界面的Smart组件
 * @author QiuShao
 * @date 2017/08/18
 */

'use strict';
import React from 'react';
import TkGlobal from 'TkGlobal';
import eventObjectDefine from 'eventObjectDefine';
import HandlerDetectionDevice from "./handler/handlerDetectionDevice" ;
import ReactSlider from "react-slider" ;
import ServiceRoom from 'ServiceRoom' ;
import TkUtils from 'TkUtils';
import WebAjaxInterface from 'WebAjaxInterface' ;

class MainDetectionDeviceSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            show:false ,
            selectShow:{
                networkinput:false,
                videoinput:false ,
                audioinput:false ,
                audiooutput:false,
                systemInfo:false,
                result:false,
            },
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
            audiooutputVolume:100 ,
            //xueln 添加
            isClient:TkGlobal.isClient,
            testSystemInfo:{
                currentUser:"",//当前用户：
                operatingSystem:"",//操作系统
                // processor:"----",//处理器：
                // RAM:"----",//内存：
                // serverName:"----",//服务器名称：
                IPAddress:"----",//IP地址：
                LoginDevice:"----",//登入设备
                networkDelay:"----",//网络延时：
                packetLoss:"----",//丢包率：
                browser:"----",//浏览器：
                roomNumber:"----",//房间号：
                versionNumber:"----",//版本号
                // uploadSpeed:"----",//上传速度：
                // downloadSpeed:"----",//下载速度：
            },
            // serverSpeed:{},
            serverlist:{},
        };
        this.oldUseServerName = '';
        this.useServerName = '';
        this.systemInfoLanguage = {
            currentUser:TkGlobal.language.languageData.login.language.detection.systemInfo.currentUser,//当前用户：
            operatingSystem:TkGlobal.language.languageData.login.language.detection.systemInfo.operatingSystem,//操作系统：
            // processor:TkGlobal.language.languageData.login.language.detection.systemInfo.processor,//处理器：
            // RAM:TkGlobal.language.languageData.login.language.detection.systemInfo.RAM,//内存：
            // serverName:TkGlobal.language.languageData.login.language.detection.systemInfo.serverName,//服务器名称：
            IPAddress:TkGlobal.language.languageData.login.language.detection.systemInfo.IPAddress,//IP地址：
            LoginDevice:TkGlobal.language.languageData.login.language.detection.systemInfo.LoginDevice,//登入设备：
            networkDelay:TkGlobal.language.languageData.login.language.detection.systemInfo.networkDelay,//网络延时：
            packetLoss:TkGlobal.language.languageData.login.language.detection.systemInfo.packetLoss,//丢包率：
            browser:TkGlobal.language.languageData.login.language.detection.systemInfo.browser,//浏览器：
            roomNumber:TkGlobal.language.languageData.login.language.detection.systemInfo.roomNumber,//房间号：
            versionNumber:TkGlobal.language.languageData.login.language.detection.systemInfo.versionNumber,//版本号：
            // uploadSpeed:TkGlobal.language.languageData.login.language.detection.systemInfo.uploadSpeed,//上传速度：
            // downloadSpeed:TkGlobal.language.languageData.login.language.detection.systemInfo.downloadSpeed,//下载速度：
        };
        this.detectionResult = {
            whichServer:false,
            canSee:false,
            canListen:false,
            canSpeak:false,
        };
       
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
        let that = this;
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.deviceChange , that.handlerDeviceChange.bind(that) ,  that.listernerBackupid   );
        //注册执行检测界面的事件，调用检测界面的方法detectionDeviceHandlerExecute()
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomConnected, that.handlerRoomConnected.bind(that)  , that.listernerBackupid ); //Room-Connected事件：房间连接事件
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomUserpropertyChanged , this.handlerRoomUserpropertyChanged.bind(this) , this.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener( "mainDetectionDevice" , that.handlerMainDetectionDevice.bind(that) ,  that.listernerBackupid   );
        eventObjectDefine.CoreController.addEventListener( "handleTestSystemInfo" , that.handleTestSystemInfo.bind(that) ,  that.listernerBackupid   );
        eventObjectDefine.CoreController.addEventListener( "remotecontrol_deviceManagement_changeDeviceInfo" , that.handleRemotecontrol_deviceManagement_changeDeviceInfo.bind(that) ,  that.listernerBackupid   );
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        let that = this;
        HandlerDetectionDevice.exitDetectionDevicePage();
        that._stepExecuteStopOrClear(3);
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid);
    };
    handlerRoomUserpropertyChanged(roomUserpropertyChangedEventData){
        if(this.state.selectShow.networkinput){
            let user = roomUserpropertyChangedEventData.user ;
            if(user && user.id ===  ServiceRoom.getTkRoom().getMySelf().id){
                let changePropertyJson  = roomUserpropertyChangedEventData.message ;
                for( let key of Object.keys(changePropertyJson) ){
                    if( key !== 'servername' ){
                        this.changeServerClick(changePropertyJson[key]);
                    }
                }
            }
        }
    };

    handlerRoomConnected() {
        this.getSystemInfo();//获取用户系统信息
        if(this.state.selectShow.networkinput){
            this.changeServerClick( ServiceRoom.getTkRoom().getMySelf().servername );
        }
    }
    handleTestSystemInfo(handleData) {//处理网络延时和丢包率
        let networkStatus = handleData.message.data.networkStatus;
        let show = handleData.message.data.show;
        if (show === true) {
            this.state.testSystemInfo.networkDelay = networkStatus.rtt+"ms";
            this.state.testSystemInfo.packetLoss = networkStatus.packetsLost+"%";
        }else {
            this.state.testSystemInfo.networkDelay = "----";
            this.state.testSystemInfo.packetLoss = "----";
        }
        this.setState({testSystemInfo:this.state.testSystemInfo});
    }

    handlerDeviceChange(){
        this._enumerateDevices();
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

    handlerMainDetectionDevice(recvEventData){
        const that = this ;
        let {isEnter} = this.props;
        if (isEnter || !TkConstant.hasRole.roleTeachingAssistant) {
            that._loadSelectShow('videoinput' , true);
        }else {
            ServiceRoom.getTkRoom().requestServerList(TkConstant.SERVICEINFO.hostname,TkConstant.SERVICEINFO.port,(serverlist,res)=>{
                var serverlistCopy = undefined ;
                if(serverlist && typeof serverlist === 'object'){
                    serverlistCopy = {} ;
                    for(let [key,value] of Object.entries(serverlist) ){
                        serverlistCopy[key] = Object.assign({} , value);
                    }
                    //serverlistCopy = Object.assign({} , serverlist);
                }else{
                    serverlistCopy = serverlist;
                }
                that.setState({serverlist:serverlistCopy});
            });
            that.oldUseServerName = ServiceRoom.getTkRoom().getServerName();
            that._loadSelectShow('networkinput' , true);
        }
        that.setState({show:true});
        that._enumerateDevices();
    };

    /*下一步按钮的点击事件*/
    nextButtonOnClick(selectKey , selectValue = true , step ,detection, isIntact){
        const that = this ;
        that._stepExecuteStopOrClear(step);
        that._loadSelectShow(selectKey , selectValue) ;
        that._detectionResultSave(detection,isIntact);
    };
    _detectionResultSave(detection,isIntact) {
        switch (detection) {
            case 'video'://视频
                this.detectionResult.canSee = isIntact;
                break;
            case 'telephone'://话筒
                this.detectionResult.canListen = isIntact;
                break;
            case 'voiceTube'://听筒
                this.detectionResult.canSpeak = isIntact;
                break;
        }
    };

    /*确定按钮的点击事件*/
    okButtonOnClick(step){
        const that = this ;
        let {handlerOkCallback , saveLocalStorage=true} = that.props ;
        HandlerDetectionDevice.exitDetectionDevicePage();
        that._stepExecuteStopOrClear(step);
        if(saveLocalStorage){
            for(let [deviceKind,deviceId] of Object.entries(that.selectDevice)){
                localStorage.setItem(L.Constant.deviceStorage[deviceKind],deviceId);
            }
        }
        eventObjectDefine.CoreController.dispatchEvent({type:'detectionDeviceFinsh' , message:{clearFinsh:that.props.clearFinsh}});
        if(handlerOkCallback && typeof handlerOkCallback === 'function'){
            handlerOkCallback({selectDeviceInfo:that.selectDevice});
        }
        if (that.oldUseServerName !== that.useServerName) {//选择的服务器名与当前使用的不相等时
            ServiceRoom.getTkRoom().switchServerByName(that.useServerName);
        }
        that._resetDefaultStateAndData();
    };
    closeButtonOnClick(step) {
        const that = this ;
        HandlerDetectionDevice.exitDetectionDevicePage();
        that._stepExecuteStopOrClear(step);
        eventObjectDefine.CoreController.dispatchEvent({type:'detectionDeviceFinsh' , message:{clearFinsh:that.props.clearFinsh}});
        that._resetDefaultStateAndData();
    };
    
    /*播放音乐*/
    playAudioToAudiooutput(audioId = 'music_audio', play = true){
        let $audio = $("#"+audioId) ;
        if($audio && $audio.length>0){
            if(play){
                L.Utils.mediaPlay( $audio[0])
            }else{
                L.Utils.mediaPause( $audio[0])
            }
        }
    };
	
    /*改变选中的设备*/
    changeSelectDeviceOnChange(deviceKind , event){
    	const that = this ;
        let deviceId =  event.target.value ;
        that._changeStateSelectDevice(deviceKind , deviceId);
        that._deviceSwitch(deviceKind);
        if(event){
            event.preventDefault();
            event.stopPropagation();
        }
        return false ;
    };

    /*处理音量改变事件*/
    handerVolumeOnAfterChange(volume){
        document.getElementById('music_audio').volume = volume/100 ;
        this.setState({audiooutputVolume:volume});
    };

    handerVolumeOnBeforeChange(volume){
    };

    handleRemotecontrol_deviceManagement_changeDeviceInfo(recvEventData){
        if( this.state.show ){
            let {selectDeviceInfo} = recvEventData.message ;
            this.selectDevice = selectDeviceInfo && typeof selectDeviceInfo === 'object' ? Object.assign({} , selectDeviceInfo ) : this.selectDevice ;
            this._selectShowToDeviceSwitch();
            this._checkSelectDevice();
        }
    };

    /*加载选中的检测界面显示*/
    _loadSelectShow(selectKey , selectValue){
        for( let key of Object.keys(this.state.selectShow) ){
            if(key === selectKey ){
                this.state.selectShow[key] = selectValue ;
            }else{
                this.state.selectShow[key] = false ;
            }
        }
        this._checkSelectDevice();
        this.setState({selectShow:this.state.selectShow});
        this._deviceSwitch(selectKey);
    };

    _enumerateDevices(){
        const that = this ;
        HandlerDetectionDevice.enumerateDevices( (deviceInfo) => {
            that._changeDeviceElementDesc(deviceInfo);
            that._selectShowToDeviceSwitch();
            that._checkSelectDevice();
        });
    };

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

    _selectShowToDeviceSwitch(){ 
        const that = this ;
        for(let [key , value] of  Object.entries(that.state.selectShow) ){
            if(value){
                that._deviceSwitch(key);
            }
        }
    };

    _deviceSwitch(deviceKind){
        const that = this ;
        if(!that.selectDevice[deviceKind]){
            L.Logger.warning('deviceSwitch deviceId is not exist from selectDevice!');
            return ;
        }
        if(!that.state.selectShow[deviceKind]){
            L.Logger.warning('deviceSwitch deviceId is not exist from selectShow!');
            return;
        }
        switch (deviceKind){
            case 'videoinput':
            	//xueln add
            	if(that.state.isClient){
            		HandlerDetectionDevice.videoSourceChangeHandlerFromClient(that.selectDevice[deviceKind],{
	            		"elementId":"videoinput_video_stream"
	            	});
            	}else{
		   			HandlerDetectionDevice.videoSourceChangeHandler({deviceId:that.selectDevice[deviceKind]  , videoinputVideoElementId:'videoinput_video_stream' });
				}
                break;
            case 'audioinput':
				if(that.state.isClient){
            		HandlerDetectionDevice.audioSourceChangeHandlerFromClient({deviceId:that.selectDevice[deviceKind]  , audioinputAudioElementId:'audioinput_audio_stream'   , audioinputVolumeContainerId:'volume_audioinput_container' });
            	}else{
            		HandlerDetectionDevice.audioSourceChangeHandler({deviceId:that.selectDevice[deviceKind]  , audioinputAudioElementId:'audioinput_audio_stream'   , audioinputVolumeContainerId:'volume_audioinput_container' } );
				}
                break;
            case 'audiooutput':
            	if(that.state.isClient){
            		HandlerDetectionDevice.audioOutputChangeHandlerFromClient(that.selectDevice[deviceKind]);
            	}else{
                	HandlerDetectionDevice.audioOutputChangeHandler({deviceId:that.selectDevice[deviceKind]  , setSinkIdParentElementId:'main_detection_device' });
				}                
                break;
        }

    };

    _stepExecuteStopOrClear(step){
        const that = this ;
        if(step!=undefined){
            switch (step){
                case -1:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                	if(that.state.isClient){
	            		HandlerDetectionDevice.stopDetecteCam(); 
	            		HandlerDetectionDevice.stopDetectMic();
	            	}  
                    HandlerDetectionDevice.stopStreamTracks();                                      
                    $("#videoinput_video_stream , #audioinput_audio_stream").removeAttr('src');
                    that.playAudioToAudiooutput('music_audio' , false);
                    break;
            }
         /*   if( step ===  1){
                HandlerDetectionDevice.stopStreamTracks();
                $("#audioinput_audio_stream").removeAttr('src');
                that.playAudioToAudiooutput('music_audio' , false);
            }else if( step ===  2){
                HandlerDetectionDevice.stopStreamTracks();
                $("#videoinput_video_stream  , #audioinput_audio_stream").removeAttr('src');
            }else if(step === 3){
                HandlerDetectionDevice.stopStreamTracks();
                $("#videoinput_video_stream").removeAttr('src');
                that.playAudioToAudiooutput('music_audio' , false);
            }else if(step === 4 || step === -1){
                HandlerDetectionDevice.stopStreamTracks();
                $("#videoinput_video_stream , #audioinput_audio_stream").removeAttr('src');
                that.playAudioToAudiooutput('music_audio' , false);
            }*/
        }
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

    /*检测选中的设备是否和状态中的设备相等*/
    _checkSelectDevice(){
        for(let deviceKind of Object.keys(this.selectDevice) ){
            if( this.selectDevice[deviceKind] !== this.state.selectDevice[deviceKind] ){
                this._changeStateSelectDevice(deviceKind , this.selectDevice[deviceKind]  );
            }
        }
    };

    _cutDetectionItem(isEnter , step , selectKey , selectValue = true , e) {
        const that = this ;
    	if (isEnter) {
    		return false;
    	}
    	that._stepExecuteStopOrClear(step);
        that._loadSelectShow(selectKey , selectValue) ;
    };
    /*重置默认数据*/
    _resetDefaultStateAndData(){
        let changeState = {
            show:false ,
            selectShow:{
                networkinput:false,
                videoinput:false ,
                audioinput:false ,
                audiooutput:false,
                systemInfo:false,
                result:false,
            },
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
            audiooutputVolume:100 ,
            //xueln 添加
            isClient:TkGlobal.isClient,
            // serverSpeed:{},
            serverlist:{},
        };
        this.selectDevice = {
            videoinput: undefined,
            audioinput: undefined,
            audiooutput: undefined
        };
        this.oldUseServerName = '';
        this.useServerName = '';
        this.setState( changeState ) ;
    };
    getSystemInfo() {//获取用户系统信息
        let mySelfInfo = ServiceRoom.getTkRoom().getMySelf();
        let operatingSystem = TkGlobal.osType;
        this.state.testSystemInfo.currentUser = mySelfInfo.nickname;//当前用户：
        this.state.testSystemInfo.operatingSystem = operatingSystem;//操作系统
        this.state.testSystemInfo.IPAddress = TkConstant.SERVICEINFO.hostname;//IP地址：
        this.state.testSystemInfo.LoginDevice = mySelfInfo.devicetype;//登入设备
        this.state.testSystemInfo.browser = TkUtils.getBrowserInfo().info.browserName+" "+TkUtils.getBrowserInfo().info.browserVersion;//浏览器：
        this.state.testSystemInfo.roomNumber = TkConstant.joinRoomInfo.serial;//房间号：
        this.state.testSystemInfo.versionNumber = mySelfInfo.version;//版本号
        this.setState({testSystemInfo:this.state.testSystemInfo});
    }
    systemInfoEleArr (systemInfoLanguage) {//获取设备信息数组
        let networkEles = [];
        if (Object.keys(systemInfoLanguage).length > 0) {
            for (let [key,value] of Object.entries(systemInfoLanguage)) {
                networkEles.push(<li key={networkEles.length}><span>{value}</span><span>{this.state.testSystemInfo[key]}</span></li>);
            }
        }
        return networkEles;
    };

    /*testServerSpeedClick () {//获取服务器速度
        let startTime = new Date().getTime();
        let resCallback = {
            doneCallback(res){
                if (res && res.result === 0) {
                    let endTime = new Date().getTime();
                    let timeDiff = endTime-startTime;

                }
            },
        };
        WebAjaxInterface.getServerSpeed(resCallback);
    };*/

    render(){
        let that = this ;
        let { show  , selectShow , devicesDesc  , audiooutputVolume } = that.state ;
        let {isEnter, titleText , okText } = that.props;
        let { audioinputElementArray ,  audiooutputElementArray , videoinputElementArray } = that._loadDeviceElementByDeviceDescArray(devicesDesc);
        let audiooutputVolumeItemArray = [];
        for(let i=0 ; i< 16 ; i++){
            audiooutputVolumeItemArray.push(
                <li key={i} className="audiooutput-volume-item" ></li>
            );
        }
        return (
            <article id="main_detection_device" className="device-test" style={{display: !show ? 'none' : 'block'}}>
                <div className="net-testing">
                    <span className="device-test-header">{titleText || TkGlobal.language.languageData.login.language.detection.deviceTestHeader.device.text}</span>
                    <button id="close-detection" className="close-detection" onClick={that.closeButtonOnClick.bind(that , -1)} style={{display:isEnter?"none":"block"}}>+</button>
                </div>
                <div className="testing-bot">
                    <div className="testing-left en-testing-left">
                        <ul id="testing_box" className="testing-box">
                            <li className={"network-pic testing-option" + (selectShow.networkinput?' active':'')}  style={{ display:(isEnter || !TkConstant.hasRole.roleTeachingAssistant)?'none':'block'}} onClick={that._cutDetectionItem.bind(that,isEnter , 1 , 'networkinput')}>
                                <span className="networkpic en-pic">{TkGlobal.language.languageData.login.language.detection.deviceTestHeader.optimalServer.text}</span>
                                <span className="green-video tk-img  icon_right"></span>
                                <span className="red-video tk-img  icon_warn"></span>
                            </li>
                            <li className={"video-pic testing-option" + (selectShow.videoinput?' active':'')  } data-extend-id="skip-video" onClick={that._cutDetectionItem.bind(that,isEnter , 2 , 'videoinput')}>
                                <span className="videopic en-pic">{TkGlobal.language.languageData.login.language.detection.deviceTestHeader.videoinput.text}</span>
                                <span className="green-video tk-img  icon_right"></span>
                                <span className="red-video tk-img  icon_warn"></span>
                            </li>

                            <li className={"listen-pic testing-option"+ (selectShow.audiooutput?' active':'')  } data-extend-id="skip-listen" onClick={that._cutDetectionItem.bind(that,isEnter,3, 'audiooutput')}>
                                <span className="listenpic en-pic">{TkGlobal.language.languageData.login.language.detection.deviceTestHeader.audioouput.text}</span>
                                <span className="green-listen tk-img  icon_right "></span>
                                <span className="red-listen tk-img  icon_warn "></span>
                            </li>

                            <li className={"speak-pic testing-option"+ (selectShow.audioinput?' active':'')  } data-extend-id="skip-speak" onClick={that._cutDetectionItem.bind(that,isEnter,4, 'audioinput')}>
                                <span className="speakpic en-pic">{TkGlobal.language.languageData.login.language.detection.deviceTestHeader.audioinput.text}</span>
                                <span className="green-speak tk-img  icon_right "></span>
                                <span className="red-speak tk-img  icon_warn "></span>
                            </li>
                            <li className={"result-pic testing-option"+ (selectShow.result?' active':'')} style={{ display:isEnter?'block':'none'}}>
                                <span className="resultpic en-pic">{TkGlobal.language.languageData.login.language.detection.deviceTestHeader.detectionResult.text}</span>
                            </li>
                            <li className={"systemInfo-pic testing-option"+ (selectShow.systemInfo?' active':'')} style={{ display:isEnter?'none':'block'}} onClick={that._cutDetectionItem.bind(that,isEnter,5, 'systemInfo')}>
                                <span className="systemInfoPic en-pic">{TkGlobal.language.languageData.login.language.detection.deviceTestHeader.systemInfo.text}</span>
                            </li>
                        </ul>
                    </div>

                    <div className="testing-right en-testing-right">
                        <div className="network-right fixldy" id="skip-network" style={{ display:(isEnter && !TkConstant.hasRole.roleTeachingAssistant)?'none':(selectShow.networkinput?'block':'none')}} >
                            <div className="test-network-title">
                                {/*<span className="network-title-select">{TkGlobal.language.languageData.login.language.detection.networkExtend.title.select}</span>
                                <span className="network-title-server">{TkGlobal.language.languageData.login.language.detection.networkExtend.title.area}</span>*/}
                                {/*<span className="network-title-delay">{TkGlobal.language.languageData.login.language.detection.networkExtend.title.delay}</span>*/}
                                {TkGlobal.language.languageData.login.language.detection.networkExtend.title.text}
                            </div>
                            <ul className="test-network-box">
                                {this._getServerListEle()}
                            </ul>
                            <div className="network-button">
                                <button className="detection-result-btn"  onClick={that.okButtonOnClick.bind(that , 4)} >{okText}</button>
                                {/*<button onClick={this.testServerSpeedClick.bind(this)} className="test-server-btn detection-result-btn">{TkGlobal.language.languageData.login.language.detection.networkExtend.testBtn}</button>*/}
                            </div>
                        </div>
                        <div className="video-right fixldy" id="skip-video" style={{ display:selectShow.videoinput?'block':'none' }} >
                            <div className="video-right-inside device-right-inside">
                                <div className="camera-option-all clear-float">
                                    <span className="camera-option">{TkGlobal.language.languageData.login.language.detection.videoinputExtend.cameraOptionAll.cameraOption.text}</span>
                                    <div className="styled-select" id="video-select">
                                        <select id="videoSource" value={that.state.selectDevice.videoinput} className="no-camera-option" onChange={that.changeSelectDeviceOnChange.bind(that ,'videoinput' ) } >
                                            {videoinputElementArray}
                                        </select>
                                    </div>
                                </div>
                                <div className="notice-red">
                                    {TkGlobal.language.languageData.login.language.detection.videoinputExtend.cameraOptionAll.noticeRed.text}
                                </div>
                                <div className="camera-black" id="camera-black">
                            		{/* xueln 添加 */
                            			this.state.isClient?<embed id="videoinput_video_stream"  type="application/x-ppapi-proxy" data-notDevice={that.selectDevice.videoinput===undefined?true:undefined} ></embed>:<video id="videoinput_video_stream" autoPlay data-notDevice={that.selectDevice.videoinput===undefined?true:undefined} ></video>
                            		}
                                </div>
                                <div className="notice-carmera">
                                    <p>{TkGlobal.language.languageData.login.language.detection.videoinputExtend.noticeCarmera.one}</p>
                                    <p>{TkGlobal.language.languageData.login.language.detection.videoinputExtend.noticeCarmera.two}</p>
                                    <p >{TkGlobal.language.languageData.login.language.detection.videoinputExtend.noticeCarmera.three}</p>
                                    <p >{TkGlobal.language.languageData.login.language.detection.videoinputExtend.noticeCarmera.four}</p>
                                    <p>{TkGlobal.language.languageData.login.language.detection.videoinputExtend.noticeCarmera.five}</p>
                                    <p>{TkGlobal.language.languageData.login.language.detection.videoinputExtend.noticeCarmera.six}</p>
                                    <p>{TkGlobal.language.languageData.login.language.detection.videoinputExtend.noticeCarmera.seven}</p>

                                </div>
                            </div>
                            <div className="see-button" style={{display:isEnter?"none":"block"}}>
                                <button className="can-see detection-result-btn" onClick={that.okButtonOnClick.bind(that , 4)} >{okText}</button>
                            </div>
                            <div className="detection-result" style={{display:isEnter?"flex":"none"}}>
                                <button className="not-see detection-result-btn" onClick={that.nextButtonOnClick.bind(that , 'audiooutput' , true , 2 ,'video',false)} >{TkGlobal.language.languageData.login.language.detection.button.notSee.text}</button>
                                <button className="can-see detection-result-btn" style={{display:this.state.hasDetection.videoinput?'block':'none'}} onClick={that.nextButtonOnClick.bind(that , 'audiooutput' , true , 2 ,'video',true)} >{TkGlobal.language.languageData.login.language.detection.button.canSee.text}</button>
                            </div>

                            {/*<div className="see-button">
                                <button className="can-see detection-result-btn"  onClick={isEnter?that.nextButtonOnClick.bind(that , 'audiooutput' , true , 2 ):that.okButtonOnClick.bind(that , 4)} >{isEnter?TkGlobal.language.languageData.login.language.detection.button.next.text:okText}</button>
                            </div>*/}

                        </div>

                        <div className="listen-right fixldy" id="skip-listen" style={{ display:selectShow.audiooutput?'block':'none' }} >
                            <div className="listen-right-inside device-right-inside">
                                <div className="camera-option-all clear-float">
                                    <span className="camera-option">{TkGlobal.language.languageData.login.language.detection.audioouputExtend.cameraOptionAll.cameraOption.text}</span>
                                    <div className="styled-select">
                                        <select  id="audioOutput" value={that.state.selectDevice.audiooutput} className="no-camera-option" onChange={that.changeSelectDeviceOnChange.bind(that  ,'audiooutput' ) } >
                                            {audiooutputElementArray}
                                        </select>
                                    </div>
                                </div>
                                <div className="click-music clear-float">
                                    <ul className="music-play">
                                        <li><span className="clickmusic">{TkGlobal.language.languageData.login.language.detection.audioouputExtend.cameraOptionAll.clickmusic.one}</span>
                                        </li>
                                        <li className="musicplay-pic">
                                            <button className="play-music"  onClick={that.playAudioToAudiooutput.bind(that , 'music_audio' , true ) } >{TkGlobal.language.languageData.login.language.detection.audioouputExtend.cameraOptionAll.playMusic}</button>
                                            <audio id="music_audio" src="./music/music.mp3" className="audio-play"></audio>
                                        </li>
                                        <li className="listen-sure">
                                            <span >{TkGlobal.language.languageData.login.language.detection.audioouputExtend.cameraOptionAll.clickmusic.two}</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="sound-vol">
                                    <div className="sound-btn icon_volume tk-img "></div>
                                    <ReactSlider className={"tk-slide tk-detection-device"} withBars  defaultValue={100}  onBeforeChange={that.handerVolumeOnBeforeChange.bind(that)}   onAfterChange={that.handerVolumeOnAfterChange.bind(that)}    />
                                    <span className="txtValue" >{audiooutputVolume}</span>
                                </div>
                                <div className="notice-carmera">
                                    <p>{TkGlobal.language.languageData.login.language.detection.audioouputExtend.noticeCarmera.one}</p>
                                    <p>{TkGlobal.language.languageData.login.language.detection.audioouputExtend.noticeCarmera.two}</p>
                                    <p >{TkGlobal.language.languageData.login.language.detection.audioouputExtend.noticeCarmera.three}</p>
                                    <p >{TkGlobal.language.languageData.login.language.detection.audioouputExtend.noticeCarmera.four}</p>
                                    <p>{TkGlobal.language.languageData.login.language.detection.audioouputExtend.noticeCarmera.five}</p>
                                    <p>{TkGlobal.language.languageData.login.language.detection.audioouputExtend.noticeCarmera.six}</p>
                                    <p>{TkGlobal.language.languageData.login.language.detection.audioouputExtend.noticeCarmera.seven}</p>
                                </div>
                            </div>
                            <div className="listen-button"  style={{display:isEnter?"none":"block"}}>
                                <button className="can-listen detection-result-btn" onClick={that.okButtonOnClick.bind(that , 4) }>{okText}</button>
                            </div>
                            <div className="detection-result" style={{display:isEnter?"flex":"none"}}>
                                <button className="not-listen detection-result-btn" onClick={that.nextButtonOnClick.bind(that , 'audioinput' , true , 3 ,'telephone',false)}>{TkGlobal.language.languageData.login.language.detection.button.notListen.text}</button>
                                <button className="can-listen detection-result-btn" style={{display:this.state.hasDetection.audiooutput?'block':'none'}} onClick={that.nextButtonOnClick.bind(that , 'audioinput' , true , 3 ,'telephone',true)}>{TkGlobal.language.languageData.login.language.detection.button.canListen.text}</button>
                            </div>

                            {/*<div className="listen-button">
                                <button className="can-listen detection-result-btn"   onClick={isEnter?that.nextButtonOnClick.bind(that , 'audioinput' , true , 3 ):that.okButtonOnClick.bind(that , 4) }   >{isEnter?TkGlobal.language.languageData.login.language.detection.button.next.text:okText}</button>
                            </div>*/}

                        </div>

                        <div className="speak-right fixldy" id="skip-speak" style={{ display:selectShow.audioinput?'block':'none' }} >
                            <div className="speak-right-inside device-right-inside">
                                <div className="camera-option-all clear-float ">
                                    <span className="camera-option">{TkGlobal.language.languageData.login.language.detection.audioinputExtend.cameraOptionAll.cameraOption.text}</span>
                                    <div className="styled-select">
                                        <select id="audioSource" className="no-camera-option" value={that.state.selectDevice.audioinput}  onChange={that.changeSelectDeviceOnChange.bind(that  ,'audioinput' ) } >
                                            {audioinputElementArray}
                                        </select>
                                    </div>
                                </div>
                                <div className="notice-red">
                                    {TkGlobal.language.languageData.login.language.detection.audioinputExtend.cameraOptionAll.noticeRed.text}
                                </div>
                                <audio autoPlay id="audioinput_audio_stream"  className="audioinput-audio-detection add-display-none"></audio>
                                <div className="speak-sound">
                                    {TkGlobal.language.languageData.login.language.detection.audioinputExtend.cameraOptionAll.speakSound.text}
                                </div>
                                <div className="sound-green">
                                    <ul id="volume_audioinput_container">
                                        {audiooutputVolumeItemArray}
                                    </ul>
                                </div>
                                <div className="notice-carmera">
                                    <p>{TkGlobal.language.languageData.login.language.detection.audioinputExtend.noticeCarmera.one}</p>
                                    <p>{TkGlobal.language.languageData.login.language.detection.audioinputExtend.noticeCarmera.two}</p>
                                    <p>{TkGlobal.language.languageData.login.language.detection.audioinputExtend.noticeCarmera.three}</p>
                                    <p>{TkGlobal.language.languageData.login.language.detection.audioinputExtend.noticeCarmera.four}</p>
                                    <p>{TkGlobal.language.languageData.login.language.detection.audioinputExtend.noticeCarmera.five}</p>
                                    <p>{TkGlobal.language.languageData.login.language.detection.audioinputExtend.noticeCarmera.six}</p>
                                    <p>{TkGlobal.language.languageData.login.language.detection.audioinputExtend.noticeCarmera.seven}</p>
                                </div>
                            </div>
                            <div className="speak-button" style={{display:isEnter?"none":"block"}}>
                                <button className="can-speak detection-result-btn" onClick={that.okButtonOnClick.bind(that , 4)}  >{okText}</button>
                            </div>
                            <div className="detection-result" style={{display:isEnter?"flex":"none"}}>
                                <button className="not-speak detection-result-btn" onClick={that.nextButtonOnClick.bind(that , 'result' , true , 4 ,'voiceTube',false)}  >{TkGlobal.language.languageData.login.language.detection.button.notSpeak.text}</button>
                                <button className="can-speak detection-result-btn" style={{display:this.state.hasDetection.audioinput?'block':'none'}} onClick={that.nextButtonOnClick.bind(that , 'result' , true , 4 ,'voiceTube',true)}  >{TkGlobal.language.languageData.login.language.detection.button.canSpeak.text}</button>
                            </div>

                            {/*<div className="other-button">
                                <button className="can-other detection-result-btn" data-extend-id="normal-into"   onClick={that.okButtonOnClick.bind(that , 4)}  >{okText || TkGlobal.language.languageData.login.language.detection.button.join.text}</button>
                            </div>*/}

                        </div>
                        <div className="systemInfo-right fixldy" id="skip-SystemInfo" style={{ display:isEnter?'none':(selectShow.systemInfo?'block':'none') }} >
                            <div className="network-right-inside device-right-inside">
                                <ul className="systemInfo-content">
                                    {this.systemInfoEleArr(this.systemInfoLanguage)}
                                </ul>
                            </div>
                            <div className="systemInfo-button">
                                <button className="detection-result-btn" onClick={that.okButtonOnClick.bind(that , 4)}  >{okText}</button>
                            </div>
                        </div>

                        <div className="result-right fixldy" id="skip-result" style={{ display:isEnter?(selectShow.result?'block':'none'):'none' }} >
                            <div className="result-right-inside device-right-inside">
                                <h3 className="result-head">{TkGlobal.language.languageData.login.language.detection.resultExtend.head.text}</h3>
                                <dl className="result-box">
                                    <dt>
                                        <span>{TkGlobal.language.languageData.login.language.detection.resultExtend.item1.text}</span>
                                        <span>{TkGlobal.language.languageData.login.language.detection.resultExtend.item2.text}</span>
                                        <span>{TkGlobal.language.languageData.login.language.detection.resultExtend.item3.text}</span>
                                    </dt>
                                    <dd className={this.detectionResult.canSee?"colorGreen":"colorRed"}>
                                        <span className="video-icon add-icon">{TkGlobal.language.languageData.login.language.detection.deviceTestHeader.videoinput.text}</span>
                                        <span>{this.detectionResult.canSee?TkGlobal.language.languageData.login.language.detection.resultExtend.item2.content.normal:TkGlobal.language.languageData.login.language.detection.resultExtend.item2.content.abnormal}</span>
                                        <span>{this.detectionResult.canSee?'----':TkGlobal.language.languageData.login.language.detection.resultExtend.item3.content.video}</span>
                                    </dd>
                                    <dd className={this.detectionResult.canListen?"colorGreen":"colorRed"}>
                                        <span className="listen-icon add-icon">{TkGlobal.language.languageData.login.language.detection.deviceTestHeader.audioouput.text}</span>
                                        <span>{this.detectionResult.canListen?TkGlobal.language.languageData.login.language.detection.resultExtend.item2.content.normal:TkGlobal.language.languageData.login.language.detection.resultExtend.item2.content.abnormal}</span>
                                        <span>{this.detectionResult.canListen?'----':TkGlobal.language.languageData.login.language.detection.resultExtend.item3.content.listen}</span>
                                    </dd>
                                    <dd className={this.detectionResult.canSpeak?"colorGreen":"colorRed"}>
                                        <span className="speak-icon add-icon">{TkGlobal.language.languageData.login.language.detection.deviceTestHeader.audioinput.text}</span>
                                        <span>{this.detectionResult.canSpeak?TkGlobal.language.languageData.login.language.detection.resultExtend.item2.content.normal:TkGlobal.language.languageData.login.language.detection.resultExtend.item2.content.abnormal}</span>
                                        <span>{this.detectionResult.canSpeak?'----':TkGlobal.language.languageData.login.language.detection.resultExtend.item3.content.speak}</span>
                                    </dd>
                                </dl>
                            </div>
                            <div className="detection-result" >
                                <button className="check-back detection-result-btn" onClick={that.nextButtonOnClick.bind(that , 'videoinput' , true , 1 )}  >{TkGlobal.language.languageData.login.language.detection.button.checkBack.text}</button>
                                <button className="join-room detection-result-btn" onClick={that.okButtonOnClick.bind(that , 4)}  >{TkGlobal.language.languageData.login.language.detection.button.joinRoom.text}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        )
    };
};
export  default  MainDetectionDeviceSmart ;

