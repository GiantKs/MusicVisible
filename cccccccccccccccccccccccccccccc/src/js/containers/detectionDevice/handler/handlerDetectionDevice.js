/**
 * 检测组件用到的方法类
 * @class HandlerDetectionDevice
 * @description  用于提供检测设备用到的方法
 * @author QiuShao
 * @date 2017/08/18
 */

class HandlerDetectionDevice {

    /*audioinput设备切换的处理函数*/
    audioSourceChangeHandler({deviceId , audioinputAudioElementId , audioinputVolumeContainerId}) {
        let that = this;
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
            //tkpc2.0.8:修改代码that.audioContext
            that.audioContext =  new window.AudioContext();
        } catch (e) {
            L.Logger.error('Web Audio API not supported ');
        }
        let specifiedConstraints = {
            audio: {
                sourceId:deviceId
            },
            video:{} ,
            exclude:{video:true}
        };
        that.getUserMedia( function (stream) {
            that.stopStreamTracks( that.stream );
            that.stream = stream ;
            let audioinputAudioElement = document.getElementById(audioinputAudioElementId);
            if(audioinputAudioElement  && audioinputAudioElement.nodeName.toLocaleLowerCase() === 'audio' ){
                let myURL = window.URL || webkitURL;
                let streamUrl = myURL.createObjectURL(stream);
                audioinputAudioElement.src = streamUrl;
                audioinputAudioElement.load();
            }
            //tkpc2.0.8:修改代码判断条件
            if (that.soundMeter && that.soundMeter.stop && that.soundMeter.stop()) {
                that.soundMeter.stop();
            }
            if(that.audioContext){
                that.soundMeter = TK.AVMgr.getsSoundMeterInstance(that.audioContext);
                if(that.soundMeter && that.soundMeter.connectToSource ){
                    that.soundMeter.connectToSource(stream, function (e) {
                        if (e) {L.Logger.error("connectToSource error:", e);return;};
                        let $audioVolumeElement = $("#" + audioinputVolumeContainerId);
                        if($audioVolumeElement && $audioVolumeElement.length>0){
                            clearInterval( that.audioinputChangeTime );
                            that.audioinputChangeTime = setInterval(function () {
                                let volumeIndex = Math.floor(that.soundMeter.instant.toFixed(2) * 16);
                                $audioVolumeElement.find("li").removeClass("yes").filter(":lt(" + volumeIndex + ")").addClass("yes");
                            }, 100);
                        }
                    });
                }
            }
        } , function (error) {
            that.stopStreamTracks( that.stream );
            that.stream = undefined ;
            let audioinputAudioElement = document.getElementById(audioinputAudioElementId);
            if(audioinputAudioElement  && audioinputAudioElement.nodeName.toLocaleLowerCase() === 'audio' ){
                let streamUrl = '';
                audioinputAudioElement.src = streamUrl;
            }
            if (that.soundMeter && that.soundMeter.stop()) {
                that.soundMeter.stop();
            }
            clearInterval( that.audioinputChangeTime );
            that.audioinputChangeTime = null ;
        } , specifiedConstraints);
    };

    /*audiooutput设备切换的处理函数*/
    /*audioOutputChangeHandler({deviceId , setSinkIdParentElementId }) {
        let audiooutputDeviceId = deviceId;
        if (audiooutputDeviceId != undefined && audiooutputDeviceId != null) { //更换输出设备
            let audioElemetArray = document.getElementById(setSinkIdParentElementId).getElementsByTagName('audio') ;
            if(audioElemetArray && audioElemetArray.length>0){
                TK.AVMgr.setElementSinkIdToAudioouputDevice(audioElemetArray , audiooutputDeviceId );
            }
        }
    };*/
    audioOutputChangeHandler({deviceId , setSinkIdParentElementId }) {
        let audiooutputDeviceId = deviceId;
        if (audiooutputDeviceId != undefined && audiooutputDeviceId != null) { //更换输出设备
            let videoElemetArray = document.getElementById(setSinkIdParentElementId).getElementsByTagName('audio') ;
            if(videoElemetArray && videoElemetArray.length>0){
                for(let i=0 ; i<videoElemetArray.length ; i++ ){
                    let audioElement = videoElemetArray[i] ;
                    if (audioElement.setSinkId) {
                        audioElement.setSinkId(audiooutputDeviceId)
                            .then(function () {
                                L.Logger.debug('页面检测:Audio output device set to ' + audiooutputDeviceId);
                            });
                    } else {
                        L.Logger.error("浏览器不支持setSinkId方法,audiooutputDeviceId:", audiooutputDeviceId, this);
                    }
                }
            }
        }
    };

    /*停止设备数据流轨道*/
    stopStreamTracks(stream){
        stream = stream || this.stream ;
        if(stream){
            let tmpTracks =  stream.getTracks();
            for(let i=0 ; i<tmpTracks.length ; i++){
                tmpTracks[i].stop();
            }
        }
    };

    /*videoinput设备切换的处理函数*/
    videoSourceChangeHandler({deviceId , videoinputVideoElementId}) {
        const that = this ;
        let specifiedConstraints = {
            video: {
                sourceId:deviceId
            },
            audio:{} ,
            exclude:{audio:true}
        };
        that.getUserMedia( function (stream) {
            that.stopStreamTracks( that.stream );
            that.stream = stream ;
            let videoinputVideoElement = document.getElementById(videoinputVideoElementId) ;
            if(videoinputVideoElement && videoinputVideoElement.nodeName.toLocaleLowerCase() === 'video'  ){
                let myURL = window.URL || webkitURL;
                let streamUrl = myURL.createObjectURL(stream);
                videoinputVideoElement.src = streamUrl;
                videoinputVideoElement.load();
                videoinputVideoElement.removeAttribute('streamFailure');
            }
        } , function (error) {
            let videoinputVideoElement = document.getElementById(videoinputVideoElementId) ;
            if(videoinputVideoElement && videoinputVideoElement.nodeName.toLocaleLowerCase() === 'video'  ){
                let streamUrl = '';
                videoinputVideoElement.src = streamUrl;
                videoinputVideoElement.setAttribute('streamFailure' , true);
            }
        } , specifiedConstraints);
    };
	
	videoSourceChangeHandlerFromClient(deviceId,json){
        TK.AVMgr.stopDetecteCam();                  //xgd 2017-12-19
		TK.AVMgr.startDetecteCam(deviceId,json);
	}
	audioSourceChangeHandlerFromClient({deviceId , audioinputAudioElementId , audioinputVolumeContainerId}){
	    const that = audioinputVolumeContainerId ;
		TK.AVMgr.startDetecteMic(deviceId , function (instant) {
            let $audioVolumeElement = $("#" + audioinputVolumeContainerId);
            if($audioVolumeElement && $audioVolumeElement.length>0){
                let volumeIndex = Math.floor(instant * 16);
                $audioVolumeElement.find("li").removeClass("yes").filter(":lt(" + volumeIndex + ")").addClass("yes");
            }
        });
	}
	audioOutputChangeHandlerFromClient(deviceId){
		TK.AVMgr.setSpeaker(deviceId);
	};
	stopDetecteCam(){
		TK.AVMgr.stopDetecteCam();
	};
	stopDetectMic(){
		TK.AVMgr.stopDetectMic();
	}
    /*枚举设备信息*/
    enumerateDevices(callback, paramsJson = {isSetlocalStorage: false} ){
        TK.AVMgr.enumerateDevices(callback, paramsJson);
        
    };

    getUserMedia(callback , error  , specifiedConstraints){
        TK.AVMgr.getUserMedia(callback,error , undefined , specifiedConstraints)
    };

    /*
     * 退出检测界面，结束检测界面执行的功能*/
    exitDetectionDevicePage() {
        try {
            this.stopStreamTracks( this.stream );
            this.stream = null ;
            clearInterval(this.audioinputChangeTime);
            this.audioinputChangeTime = null;
            this.audioContext = null ;
            if (this.soundMeter && this.soundMeter.stop()) {
                this.soundMeter.stop();
                this.soundMeter = null;
            }
        } catch (e) {
            L.Logger.error("exitDetectionDevicePage error:", e);
        }
    };

    /*
     * 是否需要进行页面设备检测
     * @method checkNeedDetectionDevice
     * */
    checkNeedDetectionDevice(callback) {
        const that = this ;
        const _enumerateDevicesCallbakc = (deviceInfo) => {
            try {
                let needDetection = true; //默认需要检测
                L.Logger.debug("checkNeedDetectionDevice deviceInfo：", deviceInfo);
                let audioinputDeviceId = L.Utils.localStorage.getItem(L.Constant.deviceStorage.audioinput);
                let audiooutputDeviceId = L.Utils.localStorage.getItem(L.Constant.deviceStorage.audiooutput);
                let videoinputDeviceId = L.Utils.localStorage.getItem(L.Constant.deviceStorage.videoinput);
                if (!( deviceInfo.hasdevice.audioinput && deviceInfo.hasdevice.audiooutput && deviceInfo.hasdevice.videoinput )
                    || !( deviceInfo.useDevices.audioinput === audioinputDeviceId && deviceInfo.useDevices.audiooutput === audiooutputDeviceId && deviceInfo.useDevices.videoinput === videoinputDeviceId  )) {
                    //三种设备有任何一个没有或者三种设备有任何一个设备id和缓存中的id不一样 ， 则需要检测界面
                    needDetection = true;
                } else {
                    needDetection = false;
                }
                if (callback && typeof callback === 'function') {
                    callback(needDetection);
                }
            } catch (e) {
                L.Logger.error("TK  enumerateDevices error:", e);
            }
        };
        let paramsJson = {isSetlocalStorage: false};
        that.enumerateDevices( _enumerateDevicesCallbakc, paramsJson );
    };

}

const HandlerDetectionDeviceInstance = new HandlerDetectionDevice();
export default HandlerDetectionDeviceInstance ;


