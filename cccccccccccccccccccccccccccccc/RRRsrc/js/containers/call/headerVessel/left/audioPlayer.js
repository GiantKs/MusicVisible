/**
 * 左侧头部-音频媒体文件播放的Smart模块
 * @module AudioPlayerSmart
 * @description   承载左侧头部-音频媒体文件播放的Smart模块的所有组件
 * @author QiuShao
 * @date 2017/08/22
 */
'use strict';
import React from 'react';
import ReactSlider from 'react-slider';
import TkGlobal from 'TkGlobal';
import eventObjectDefine from 'eventObjectDefine';
import ServiceRoom from 'ServiceRoom';
import TkConstant from "../../../../tk_class/TkConstant";
import ServiceSignalling from 'ServiceSignalling';

class AudioPlayerSmart extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            stream:undefined,
            volume:100,
            updateState:false ,
        };
        this.isProgressDraging = false ; //拖动进度过程中
        this.isVolumeDraging = false ; //拖动音量过程中
        this.listernerBackupid = new Date().getTime()+'_'+Math.random() ;
    };

    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamSubscribed_media, this.handlerStreamSubscribed.bind(this), this.listernerBackupid); //stream_media-subscribed事件：订阅事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamRemoved_media, this.handlerStreamRemoved.bind(this), this.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamAttributesUpdate_media, this.handlerStreamAttributesUpdate.bind(this) , this.listernerBackupid); //stream-added事件：增加事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamPublishFail_media, this.handlerStreamPublishFail.bind(this) , this.listernerBackupid); //stream-publish_fail事件：流发布失败事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamUnpublishFail_media, this.handlerStreamUnpublishFail.bind(this) , this.listernerBackupid); //stream-unpublish_fail事件：流取消发布失败事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomUserpropertyChanged ,this.handlerroomUserpropertyChanged.bind(this) , this.listernerBackupid );
    };

    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        eventObjectDefine.CoreController.removeBackupListerner(this.listernerBackupid );
        this.stopTimer();
    };

    componentDidUpdate(prevProps, prevState) { //每次render结束后会触发
        if(prevState.volume !== this.state.volume){
            let audio= this.refs.playAudio;
            if(audio){
                audio.volume=this.state.volume/100;
                if(this.state.volume===0) {
                    audio.muted = true;
                }else{
                    audio.muted = false;
                }
            }
        }
        if(this.state.stream ){
            if( !(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant ) ){
                if(this.myTime && this.state.stream.getAttributes().pause){
                    this.stopTimer();
                }else if(!this.myTime && !this.state.stream.getAttributes().pause){
                    this.startTimer();
                }
            }
        }else if(this.myTime){
            this.stopTimer();
        }
    };

    /*处理room-userproperty-changed事件音量*/
    handlerroomUserpropertyChanged(roomUserpropertyChangedEventData) {
        // if(!TkGlobal.isClient){
            let user = roomUserpropertyChangedEventData.user ;
            if(ServiceRoom.getTkRoom().getMySelf().id === user.id){
                let changePropertyJson = roomUserpropertyChangedEventData.message;
                for(let key of Object.keys(changePropertyJson) ) {
                    if(key === 'volume' ) { //发布状态改变时显示或者隐藏video
                        this.setState({volume:changePropertyJson[key]});
                    }
                }
            }
        // }

    };

    handlerStreamSubscribed(streamEvent){
        if (streamEvent && streamEvent.stream) {
            let stream = streamEvent.stream;
            if(stream.video|| stream.getAttributes().filename === "" )  //mp4,动态PPT 直接返回
                return;
            let myURL = window.URL || webkitURL;
            let streamUrl = myURL.createObjectURL(stream.stream);
            let audio = this.refs.playAudio;
            audio.src = streamUrl ;
            audio.load();
            TK.AVMgr.setElementSinkIdToAudioouputDevice(audio , undefined , () => {
                L.Utils.mediaPlay(audio);
            });
            this.setState({
                stream: stream,
            });
            if(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant ){
                let playMediaPublishSucceedData = {};
                playMediaPublishSucceedData.stream = stream;
                eventObjectDefine.CoreController.dispatchEvent({   //dispatch 分发一个发布成功事件
                    type: 'playMediaPublishSucceed',
                    message: playMediaPublishSucceedData
                });
            }
        }
    };

    handlerStreamAttributesUpdate(updateEvent){
        if(updateEvent.stream.video || updateEvent.stream.getAttributes().filename=="")  //mp4,动态PPT 直接返回
            return;
        if(this.isProgressDraging){
            return ;
        }
        if(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant ){
            let nowTime = new Date().getTime() ;
            if( this.updateTime ){
                if(nowTime - this.updateTime > 500 ){
                    clearTimeout(this._streamAttributesUpdateTimer);
                    this.updateTime = nowTime;
                    this.setState({updateState:!this.state.updateState});
                }else{
                    this._streamAttributesUpdateTimer = setTimeout( () => {
                        this.updateTime = nowTime;
                        this.setState({updateState:!this.state.updateState});
                    } , 1000) ;
                }
            } else{
                this.updateTime = nowTime;
                this.setState({updateState:!this.state.updateState});
            }
        }else{
            this.setState({updateState:!this.state.updateState});
        }
    }

    closeAudioVideoOnClick(){   //关闭视频文件
        let stream = this.state.stream;
        if(stream && stream.extensionId){
            ServiceSignalling.unpublishMediaStream(stream); //取消发布
        }
    }

    handlerStreamRemoved(streamEvent){
        let stream = streamEvent.stream;
        if (stream !== undefined && stream.extensionId !== undefined ) {
            if(stream.video || stream.getAttributes().filename === "")  //mp4,动态PPT 直接返回
                return;

            stream.hide();  //视频停止播放
            let audio = this.refs.playAudio;
            audio.src = '' ;  //连接地址修改为空
            audio.load();
            this.stopTimer();
            this.setState({
                stream:undefined,
            });
            if( TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant ) {
                let playMediaUnpublishSucceedData = {};
                playMediaUnpublishSucceedData.stream = stream;
                eventObjectDefine.CoreController.dispatchEvent({   //dispatch 分发一个取消发布成功事件
                    type: 'playMediaUnpublishSucceed',
                    message: playMediaUnpublishSucceedData
                });
            }
        }
    }

    playPauseOnClick(){//播放暂停视频
        let audioStream = this.state.stream;
        if(audioStream && ( TkConstant.hasRole.roleChairman||TkConstant.hasRole.roleTeachingAssistant ) ){
            clearTimeout( this.playPauseTimer );
            this.playPauseTimer = setTimeout( ()=>{
                if(audioStream.getAttributes().pause){
                    ServiceRoom.getTkRoom().controlMedia(audioStream.getID(),{"type":"pause","pause":false});       //恢复
                }else{
                    ServiceRoom.getTkRoom().controlMedia(audioStream.getID(),{"type":"pause","pause":true});       //暂停
                }
            } , 200 );
        }
    }

    progressOnAfterChange(value){//滑动或点击进度条时 跳到对应位置的视频
        this.isProgressDraging = false ;
        this.changeProgress = undefined ;
        if(this.state.stream && (TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant)){
            let positionTime =  parseInt(value/100 * this.state.stream.getAttributes().duration);
            this._updateStreamAttributes('position' , positionTime);
            ServiceRoom.getTkRoom().controlMedia( this.state.stream.getID(),{'type':'seek', 'pos':positionTime});  //controlmedia 拖动
        }
    };

    progressOnChange(value){
        if(this.isProgressDraging){
            this.changeProgress = value ;
        }
    };

    progressOnBeforeChange(value){ //改变进度之前不能更新进度条进度的state
        this.isProgressDraging = true ;
        this.changeProgress = value ;
    };

    volumeOnAfterChange(value){//滑动过程和点击音量条时，设置音量大小
        this.isVolumeDraging = false ;
        this.changeVolume = undefined ;
        this.volume = value ;
        this.setState({
            volume:value ,
        });
    }

    volumeOnBeforeChange(value){
        this.isVolumeDraging = true ;
        this.changeVolume = value ;
    }

    volumeOnChange(value){
        if(this.isVolumeDraging){
            this.changeVolume = value ;
        }
    }

    startTimer(){/* 定义一个得到本地时间的函数*/
        if(TkGlobal.playback){
            return ;
        }
        this.stopTimer();
        if(this.state.stream && !(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant )){
            this.myTime = setInterval( () =>{
                let { positionTime , durationTime } = this._loadStreamInfo();
                positionTime+=1000 ;
                if(positionTime >  durationTime ){
                    positionTime =  durationTime;
                    this.stopTimer();
                }
                this._updateStreamAttributes('position' , positionTime ) ;
            },1000);
        }
    }

    stopTimer() {/* clearInterval() 方法用于停止 setInterval() 方法执行的函数代码*/
        clearInterval(this.myTime);
        this.myTime = null ;
    }

    handlerStreamPublishFail(streamEvent){
        let stream = streamEvent.stream;
        if(stream.video || stream.getAttributes().filename === "")  //mp4,动态PPT 直接返回
            return;

        if(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant ){
            let playMediaPublishFailData = {};
            playMediaPublishFailData.stream = stream;
            eventObjectDefine.CoreController.dispatchEvent({ //dispatch 分发一个发布失败事件
                type:'playMediaPublishFail' ,
                message:playMediaPublishFailData
            });
        }
    }

    handlerStreamUnpublishFail(streamEvent){
        let stream = streamEvent.stream;
        if(stream.video || stream.getAttributes().filename === "")  //mp4,动态PPT 直接返回
            return;

        if(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant ){
            let playMediaUnpublishFailData = {};
            playMediaUnpublishFailData.stream = stream;
            eventObjectDefine.CoreController.dispatchEvent({   //dispatch 分发一个取消发布失败事件
                type:'playMediaUnpublishFail' ,
                message:playMediaUnpublishFailData
            });
        }
    }

    volumeMuteOnClick(){//点击喇叭图标 静音和恢复音量
        this.setState({
            volume:this.state.volume!== 0 ? 0:(this.volume || 100) ,
        });
    };

    _toDecimal(num){//时间个位数转十位数
        if(parseInt(num/10)==0){
            return '0'+num;
        }else{
            return num;
        }
    }

    _formatTime(data){//将时间格式化
        let minute=parseInt(data/60);
        let second=Math.round(data%60);
        if(second==60){
            minute+=1;
            second=0;
        }
        return this._toDecimal(minute)+':'+this._toDecimal(second)
    }

    _updateStreamAttributes(key , value){ //更新流的attributes
        if(this.state.stream){
            let attrs = {};
            attrs[key] = value ;
            this.state.stream.updateLocalAttributes(attrs);
            if(this.isProgressDraging){
                return ;
            }
            this.setState({updateState:!this.state.updateState});
        }
    }

    _loadStreamInfo(){ //加载流的专属信息
        let attributes = {} , positionTime = 0  , durationTime = 0 ;
        if(this.state.stream && !this.state.stream.video){
            attributes =  this.state.stream.getAttributes();
            positionTime = attributes.position || 0 ;
            durationTime = attributes.duration || 0 ;
        }
        return {
            attributes ,
            positionTime ,
            durationTime ,
        } ;
    }

    render() {
        let isRoleChairman = TkConstant.hasRole.roleChairman ;
        let isRoleTeachingAssistant = TkConstant.hasRole.roleTeachingAssistant ;
        let isRoleChairmanOrTeachingAssistant = isRoleChairman ||  isRoleTeachingAssistant ;
        let { attributes , positionTime , durationTime } = this._loadStreamInfo();
        let progress = durationTime>0 ?100*positionTime/durationTime :0;
        return (
            <div className="lc-audio-container add-position-absolute-top0-left0 clear-float "  id="lc_audio_container"  style={{display:!this.state.stream?'none':''}}>
                <audio ref="playAudio" preload="auto" id="mp3Audio"  >
                    {TkGlobal.language.name === 'chinese' ? '您的浏览器不支持  audio 播放 ， 请更新更高版本的浏览器或者更换主流浏览器！' : ' Your browser does not support audio playback, please update the higher version of the browser or replace the mainstream browser!'}
                </audio>
                {!isRoleChairmanOrTeachingAssistant?undefined:<button ref="playAudioPauseBtn" style={{display: !isRoleChairmanOrTeachingAssistant ? 'none' : 'block'}} className={"play-pause-btn "+(!attributes.pause?'pause':'play')} id="play_pause_btn_audio" onClick={this.playPauseOnClick.bind(this)} />}
                <span className="audio-progress-container add-fl add-block" style={{lineHeight:TkGlobal.playback?'0.3rem':undefined , width:TkGlobal.playback?'auto':undefined , marginRight:TkGlobal.playback?'0':undefined }}  >
                    <span className="audio-info-vessel">
                        <span className="playback-music-icon"  style={{display:TkGlobal.playback?'block':'none'}}  />
                        <span className="audio-name add-nowrap"  style={{textAlign:TkGlobal.playback?'right':undefined}} >{attributes.filename}</span>
                        <span className="audio-time" style={{display:TkGlobal.playback?'none':undefined}} >
                            <time ref="currAudioTime" className="curr-play-time">{this._formatTime(positionTime/1000)}
                            </time>/
                            <time ref="totalAudioTime" className="total-play-time">{this._formatTime(durationTime/1000)}
                            </time>
                        </span>
                    </span>
                    <div className="audio-progress-outside"  style={{display:TkGlobal.playback?'none':undefined}} >
                        <ReactSlider disabled={!isRoleChairmanOrTeachingAssistant} className={"tk-slide tk-audio-progress-slider"} withBars defaultValue={0} value={this.changeProgress || progress}  onChange={this.progressOnChange.bind(this)} onAfterChange={this.progressOnAfterChange.bind(this)} onBeforeChange={this.progressOnBeforeChange.bind(this)}/>
                    </div>
                </span>
                <span className="audio-volume-container add-fl clear-float add-position-relative" style={{width: '1.7rem'}}>
                    <button ref="audioVolumeBtn" className={"volume-btn add-fl " + (this.state.volume>0?'yes':'no') } onClick={this.volumeMuteOnClick.bind(this) } />
                    <ReactSlider className={"tk-slide tk-audio-volume-slider add-fl"} withBars defaultValue={0} value={this.changeVolume || this.state.volume } onChange={this.volumeOnChange.bind(this)} onBeforeChange={this.volumeOnBeforeChange.bind(this)}  onAfterChange={this.volumeOnAfterChange.bind(this)}   />
                </span>
                {!isRoleChairmanOrTeachingAssistant?undefined:<button className="audio-close add-fl"   onClick={this.closeAudioVideoOnClick.bind(this)}  style={{display:!isRoleChairmanOrTeachingAssistant?'none':''}} />}
            </div>
        )
    };
};
export default  AudioPlayerSmart;

