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
import TkUtils from 'TkUtils';

class AudioPlayerSmart extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            open:false,
            close:false,
            progress:0,
            stream:undefined,
            streamDuration:0,
            isTeacher:(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant)?true:false,
            title:"",
            startTime:0,
            volume:100,
            volumeButtonStyle:''
        };
        this.myTime ;
        this.isProgressDraging = false ; //拖动进度过程中
        this.isVolumeDraging = false ; //拖动音量过程中
        this.listernerBackupid = new Date().getTime()+'_'+Math.random() ;
        this.destTopShare = false;
    };

    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        let that = this;
        // that.setState({open:false});
        eventObjectDefine.CoreController.addEventListener( "playMediaFile" , that.playMediaFile.bind(that), that.listernerBackupid); //播放媒体事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamSubscribed_media, that.handlerStreamSubscribed.bind(that), that.listernerBackupid); //stream_media-subscribed事件：订阅事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamRemoved_media, that.handlerStreamRemoved.bind(that), that.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamAdded_media, that.handlerStreamAdded.bind(that) , that.listernerBackupid); //stream-added事件：增加事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamAttributesUpdate_media, that.handlerStreamAttributesUpdate.bind(that) , that.listernerBackupid); //stream-added事件：增加事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamPublishFail_media, that.handlerStreamPublishFail.bind(that) , that.listernerBackupid); //stream-publish_fail事件：流发布失败事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamUnpublishFail_media, that.handlerStreamUnpublishFail.bind(that) , that.listernerBackupid); //stream-unpublish_fail事件：流取消发布失败事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamFailed_media, that.handlerStreamFailed.bind(that) , that.listernerBackupid); //stream-unpublish_fail事件：流取消发布失败事
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomConnected, that.handlerRoomConnected.bind(that)  , that.listernerBackupid ); //Room-Connected事件：房间连接事件

        //eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamSubscribed_screen, that.handlerStreamSubscribedScreen.bind(that), that.listernerBackupid); //stream_media-subscribed事件：订阅事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamAdded_screen, that.handlerStreamAddedScreen.bind(that), that.listernerBackupid); //stream_media-subscribed事件：订阅事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamRemoved_screen, that.handlerStreamRemovedScreen.bind(that) , that.listernerBackupid);//
        eventObjectDefine.CoreController.addEventListener( 'destTopShareStream' , that.handlerDestTopShareStream.bind(that) , that.listernerBackupid );
        //that.controlVolume();
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        let that = this ;
        clearInterval(that.myTime);
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid );
        that.stopTimer();
    };
    playMediaFile(event){
        let that= this;
        let playFileData = event.message;
        let fileid = playFileData.fileid;
        let filePlayUrl = playFileData.filePlayUrl;
        let filename=playFileData.filename;
        let isVideo = playFileData.video;
        if(isVideo)
            return;

        let room = ServiceRoom.getTkRoom();
        let url = filePlayUrl;

        let to = "__all";
        if(!TkGlobal.classBegin)
            to = room.getMySelf().id;

        let stream = TK.Stream({video: false, audio: true, url:url, extensionId:room.getMySelf().id + ":media", attributes:{filename:filename,fileid:fileid,type:'media',toID:to}},TkGlobal.isClient);

        //发布流媒体
        let isTeacher = that.state.isTeacher;
        let id = ServiceRoom.getTkRoom().getMySelf().id;

        if(isTeacher && playFileData.userid === id )
            ServiceSignalling.publishMediaStream(stream);
    };

    handlerStreamSubscribed(streamEvent){
        let that = this;
        let isTeacher = that.state.isTeacher;
        if(streamEvent.stream.video|| streamEvent.stream.getAttributes().filename=="")  //mp4,动态PPT 直接返回
            return;

        if (streamEvent) {
            let stream = streamEvent.stream;
            let myURL = window.URL || webkitURL;
            let streamUrl = myURL.createObjectURL(stream.stream);
            let audio=that.refs.playAudio;
            // let audioEle = document.getElementById('mp3Audio');
            audio.src = streamUrl ;
            audio.load();
            TK.AVMgr.setElementSinkIdToAudioouputDevice(audio , undefined , () => {
                L.Utils.mediaPlay(audio);
            });
            //TkUtils.tool.removeEvent(audio , 'loadedmetadata');
            //TkUtils.tool.addEvent(audio , 'loadedmetadata',function(){//获取总时间
                let duration = that.state.streamDuration;
                let totalAudioTime = that.refs.totalAudioTime;
                totalAudioTime.innerHTML=that.formatTime(duration/1000);
                let currAudioTime = that.refs.currAudioTime;
                currAudioTime.innerHTML = that.formatTime(that.state.startTime/1000);

                let playBtn=that.refs.playAudioPauseBtn;
               /* try {
                    // 此处是可能产生例外的语句
                     L.Utils.mediaPlay(audio);

                } catch(error) {
                    // 此处是负责例外处理的语句

                } finally {*/
                    playBtn.className = 'play-pause-btn pause'

                    that.setState({
                        stream: stream,
                        open: true,
                        title: stream.getAttributes().filename,
                    });
                    clearTimeout(that.loadedmetadataTimer);
                    that.loadedmetadataTimer = setTimeout(() => {
                        that.setState({
                            close: true
                        });
                        if (isTeacher) {
                            let extensionId = ServiceRoom.getTkRoom().getMySelf().id + ":media";
                            //if(stream.extensionId ===  extensionId) {
                            //dispatch 分发一个发布成功事件
                            let playMediaPublishSucceedData = {};
                            playMediaPublishSucceedData.stream = stream;

                            eventObjectDefine.CoreController.dispatchEvent({
                                type: 'playMediaPublishSucceed',
                                message: playMediaPublishSucceedData
                            });
                            //}
                        } else {
                            let startTime = that.state.startTime;
                            that.startTimer(startTime);
                        }
                    }, 200);
                /*}*/


            //}) ;

            /* audio.addEventListener('ended',function() {//结束改变按钮状态
                playBtn.className="play-pause-btn";
                that.closeAudioVideo();
            });*/
        }
    };

    setDurationAndPos(stream){
        let that=this;
        let duration = 0;
        let position = 0;
        duration = stream.getAttributes().duration;
        if(duration===undefined)
            duration = 0;
        position = stream.getAttributes().position;
        if(position===undefined)
            position = 0;

        that.setState({
            streamDuration:duration,
            startTime:position
        });
    };

    //获取流文件总时长
    handlerStreamAdded(addEvent){
        /*
        "onAddStream",{"id":541805088155220600,"audio":true,"video":true,"attributes":{"duration":51000},"extensionId":"23a3b346-a3b1-c032-6a07-de58c7c5fea8"}
        */
        let that = this;
        if(addEvent.stream.video|| addEvent.stream.getAttributes().filename=="")  //mp4,动态PPT 直接返回
            return;

        let stream = addEvent.stream;
        that.setDurationAndPos(stream);

    };

    handlerStreamAttributesUpdate(updateEvent){
        let that = this;
        let isTeacher = that.state.isTeacher;

        if(updateEvent.stream.video || updateEvent.stream.getAttributes().filename=="")  //mp4,动态PPT 直接返回
            return;
        let {attrs} = updateEvent ;
        if(isTeacher){
            let position = attrs.position !== undefined ?   attrs.position : updateEvent.stream.getAttributes().position;
            if(position === undefined)
                position = 0;

            let currAudioTime = that.refs.currAudioTime;
            let duration =that.state.streamDuration;
            let radio=100*position/duration;

            currAudioTime.innerHTML = that.formatTime(position/1000);
            if(that.isProgressDraging){
                return ;
            }
            that.setState({
                progress:radio
            });

            if(  attrs.pause !== undefined ) {
                //let audio=that.refs.playAudio;
                let playBtn=that.refs.playAudioPauseBtn;
                let pause = updateEvent.stream.getAttributes().pause;
                if (pause) {
                    playBtn.className='play-pause-btn';
                    // L.Utils.mediaPause( audio);
                } else {
                    playBtn.className='play-pause-btn pause';
                    //L.Utils.mediaPlay(audio);
                }
            }

        } else {
            let pause =false;
            let position = 0;
            if(updateEvent.stream.getAttributes().position!== undefined){
                position = updateEvent.stream.getAttributes().position;
                this.setState({
                    startTime:position
                });
                this.stopTimer();
                this.startTimer(position);
            }

            //let position = updateEvent.stream.getAttributes().position;
            if( attrs.pause !== undefined ) {
                pause = updateEvent.stream.getAttributes().pause;
                if (pause) {
                    this.stopTimer();
                    this.playPause();
                } else {
                    this.playPause();
                    let startTime = that.state.startTime;
                    this.startTimer(startTime);
                }
            }
        }

    }


    //关闭视频文件
    closeAudioVideo(){
        let that = this;
        let stream = that.state.stream;
        let room = ServiceRoom.getTkRoom();

        if(stream && stream.extensionId){
            //stream.hide();
            ServiceSignalling.unpublishMediaStream(stream); //取消发布
        }

    }

    handlerStreamRemoved(streamEvent){
        let that = this;
        let stream = streamEvent.stream;
        if(streamEvent.stream.video|| streamEvent.stream.getAttributes().filename=="")  //mp4,动态PPT 直接返回
            return;

        let isTeacher = that.state.isTeacher;
        //if (stream !== null && stream.elementID !== undefined) {
        if (stream != undefined && stream.extensionId != undefined ) {
            //视频停止播放
            stream.hide();
            //连接地址修改为空
            that.refs.playAudio.src ='';
            that.stopTimer();
            that.setState({
                stream:undefined,
                open:false,
                startTime:0 ,//重置0
            });
            //dispatch 分发一个取消发布成功事件
            if(isTeacher) {
                let extensionId = ServiceRoom.getTkRoom().getMySelf().id + ":media";
                //if(stream.extensionId ===  extensionId) {
                    let playMediaUnpublishSucceedData = {};
                    playMediaUnpublishSucceedData.stream = stream;
                    eventObjectDefine.CoreController.dispatchEvent({
                        type: 'playMediaUnpublishSucceed',
                        message: playMediaUnpublishSucceedData
                    });
                //}
            }
        }
    }

    handlerRoomConnected(roomEvent){
        let that = this;
        let streams = roomEvent.streams;
        for(let i=0;i<streams.length;i++){
            let stream = streams[i];
            if(stream.getAttributes().type==="media") {
                let filename = stream.getAttributes().filename;
                let index = filename.lastIndexOf(".") ;
                let filesuxx = filename.substring(index+1);
                if(TkUtils.getFiletyeByFilesuffix(filesuxx)==="mp3")
                {
                    that.setDurationAndPos(stream);
                }
            }
        }
    }

    handlerStreamFailed(streamEvent){
        let that = this;

        /*type: 'stream-failed',
            msg:{reason:'Subscribing stream failed after connection' , source:'subscribe'} ,
        stream:stream }*/
        let msg = streamEvent.message;
        let stream = streamEvent.stream;
        if(msg!=undefined && msg.source=='subscribe'){  //取消发布
            if(stream!==undefined && stream.extensionId){
                let isTeacher = that.state.isTeacher;
                if(isTeacher) {
                    ServiceSignalling.unpublishMediaStream(stream); //取消发布
                }
            }
        }
    }

    handlerStreamSubscribedScreen(streamEvent){

        let that = this;
        /*let isTeacher = that.state.isTeacher;
        if (streamEvent) {
            let streamScreen = streamEvent.stream;
            if(isTeacher && streamScreen.screen ){
                let room = ServiceRoom.getTkRoom();
                let stream = that.state.stream;
                if(stream!=undefined )
                    room.controlMedia(stream.getID(),{"type":"pause","pause":true});       //暂停
            };
        }*/
    }

    handlerStreamAddedScreen(streamEvent){
        let that = this;
        let isTeacher = that.state.isTeacher;
        if (streamEvent) {
            let streamScreen = streamEvent.stream;
            if(isTeacher && streamScreen.screen ){
                let room = ServiceRoom.getTkRoom();
                /*let stream = that.state.stream;
                if(stream!=undefined )
                    room.controlMedia(stream.getID(),{"type":"pause","pause":true});       //暂停

                this.destTopShare = true;*/
                let stream = that.state.stream;
                if(stream && stream.extensionId)
                    ServiceSignalling.unpublishMediaStream(stream); //取消发布
            };
        }
    }

    handlerStreamRemovedScreen(streamEvent){
        let that = this;
        /*let isTeacher = that.state.isTeacher;
        if (streamEvent) {
            let streamScreen = streamEvent.stream;
            if(isTeacher && streamScreen.screen ){
                let room = ServiceRoom.getTkRoom();
                let stream = that.state.stream;
                if(stream!=undefined )
                    room.controlMedia(stream.getID(),{"type":"pause","pause":false});       //恢复
                this.destTopShare = false;
            };
        }*/
    }

    handlerDestTopShareStream(event){
        let that = this;
        let  destTopStream = event.message;
        let isTeacher = that.state.isTeacher;

        if(isTeacher) {  //老师端
            let room = ServiceRoom.getTkRoom();
            let stream = that.state.stream;
            if(stream!==undefined && isTeacher)
                room.controlMedia(stream.getID(),{"type":"pause","pause":false});       //暂停
        }

    }

    playPause(){//播放暂停视频
        //let media=document.getElementById('uploaded-video');
        let that = this;
        let audio=that.refs.playAudio;
        let playBtn=that.refs.playAudioPauseBtn;
        let isTeacher = that.state.isTeacher;
        //let playBtn=document.getElementById('play_pause_btn');
        clearTimeout( that.playPauseTimer );
        let audioStream = that.state.stream;
        that.playPauseTimer = setTimeout( ()=>{
            if(audioStream.getAttributes().pause){
                /*try {
                    // 此处是可能产生例外的语句
                    L.Utils.mediaPlay(audio);

                } catch(error) {
                    // 此处是负责例外处理的语句

                } finally {*/
                    playBtn.className='play-pause-btn pause'
                    //发布,controlmedia
                    let room = ServiceRoom.getTkRoom();
                    // let stream = that.state.stream;
                    if(audioStream!==undefined && isTeacher)
                        room.controlMedia(audioStream.getID(),{"type":"pause","pause":false});       //暂停
                /*}*/

            }else{
                // L.Utils.mediaPause( audio);
                playBtn.className='play-pause-btn';
                //发布,controlmedia
                let room = ServiceRoom.getTkRoom();
                if(audioStream!==undefined && isTeacher)
                    room.controlMedia(audioStream.getID(),{"type":"pause","pause":true});       //恢复
            }
        } , 200 );

       /* audio.addEventListener('ended',function() {//结束改变按钮状态
            playBtn.className="play-pause-btn";
            that.closeAudioVideo();
        });
        audio.addEventListener('error',function() {//获取错误信息
            //this.closeAudioVideo();
        });*/
    }

    toTwo(num){//时间个位数转十位数

        if(parseInt(num/10)==0){
            return '0'+num;
        }else{
            return num;
        }
    }
    formatTime(data){//将时间格式化
        let minute=parseInt(data/60);
        let second=Math.round(data%60);
        if(second==60){
            minute+=1;
            second=0;
        }
        return this.toTwo(minute)+':'+this.toTwo(second)
    }

    progressOnAfterChange(value){//滑动或点击进度条时 跳到对应位置的视频
        let that = this;
        that.isProgressDraging = false ;
        let currentTime =value*that.state.streamDuration;
        let position =  parseInt(currentTime/100);
        let room = ServiceRoom.getTkRoom();
        let stream = that.state.stream;
        let isTeacher = this.state.isTeacher;
        //发布 controlmedia 拖动
        if(stream!==undefined && isTeacher)
            room.controlMedia(stream.getID(),{'type':'seek', 'pos':position});       //拖动

    };

    progressOnBeforeChange(){ //改变进度之前不能更新进度条进度的state
        const that = this ;
        that.isProgressDraging = true ;
    };

    volumeOnAfterChange(value){//滑动过程和点击音量条时，设置音量大小
        let that = this;
        that.isVolumeDraging = false ;
        let audio=that.refs.playAudio;
        audio.volume=value/100;
        let volumeBtn=that.refs.audioVolumeBtn;

        let radio=100*value/100;
        if(value===0) {
            audio.muted = true;
            volumeBtn.className='volume-btn no add-fl  muted';
            that.setState({
                volume: 0
            });
        } else {
            audio.muted = false;
            volumeBtn.className='volume-btn yes add-fl';
            that.setState({
                volume: radio
            });
        }

    }

    volumeOnBeforeChange(){
        const that = this ;
        let audio=that.refs.playAudio;
        that.isVolumeDraging = true ;
    }


    volume(value){//滑动过程和点击音量条时，设置音量大小
        //let father=document.getElementById('video-box');
        let that = this;
        let audio=that.refs.playAudio;
        audio.volume=value/100;
        this.state.volume=value;

    }

    controlVolume(){//点击喇叭图标 静音和恢复音量
        let that=this;

        let volumeBtn=that.refs.audioVolumeBtn;
        //let audio=document.getElementById('uploaded-video');
        let audio=that.refs.playAudio;

        volumeBtn.addEventListener('click',function(){
            audio.muted=!audio.muted;

            if(audio.muted){
                volumeBtn.className='volume-btn no add-fl  muted';
                that.state.volume=0;
            }else{
                let reg=/muted/g;
                //volumeBtn.className=volumeBtn.className.replace(reg,'');
                volumeBtn.className='volume-btn yes add-fl';
                that.state.volume=audio.volume*100;

            }

        });
    }

    currentPlayTimer(startTime){
        let that = this;
        let currAudioTime = that.refs.currAudioTime;
        let duration =that.state.streamDuration;

        if(startTime >duration ){
            that.stopTimer();
            return;
        }

        that.setState({
            startTime:startTime
        });

        currAudioTime.innerHTML = that.formatTime(startTime/1000);
        let radio=100*startTime/duration;
        if(that.isProgressDraging){
            return ;
        }
        that.setState({
            progress:radio
        });

    }

    startTimer(startTime)/* 定义一个得到本地时间的函数*/
    {
        if(TkGlobal.playback){
            return ;
        }
        let that = this;
        clearInterval(that.myTime);
        that.myTime = setInterval(function () {that.currentPlayTimer(startTime+=1000)},1000);
    }

    stopTimer()
    {/* clearInterval() 方法用于停止 setInterval() 方法执行的函数代码*/
        let that=this;
        clearInterval(that.myTime);
        that.myTime = null ;
    }

    handlerStreamPublishFail(streamEvent){
        let that = this;
        if(streamEvent.stream.video || streamEvent.stream.getAttributes().filename=="")  //mp4,动态PPT 直接返回
            return;

        let isTeacher = that.state.isTeacher;
        let stream = streamEvent.stream;
        if (stream !== undefined ) {
            if(isTeacher){
                //dispatch 分发一个发布失败事件
                let playMediaPublishFailData = {};
                playMediaPublishFailData.stream = stream;
                eventObjectDefine.CoreController.dispatchEvent({
                    type:'playMediaPublishFail' ,
                    message:playMediaPublishFailData
                });
            }
        }

    }

    handlerStreamUnpublishFail(streamEvent){
        let that = this;
        let isTeacher = that.state.isTeacher;
        if(streamEvent.stream.video || streamEvent.stream.getAttributes().filename=="")  //mp4,动态PPT 直接返回
            return;

        let stream = streamEvent.stream;
        if (stream !== undefined ) {

            if(!isTeacher)
                that.closeAudioVideo();
            else{
                //dispatch 分发一个取消发布失败事件
                let playMediaUnpublishFailData = {};
                playMediaUnpublishFailData.stream = stream;
                eventObjectDefine.CoreController.dispatchEvent({
                    type:'playMediaUnpublishFail' ,
                    message:playMediaUnpublishFailData
                });
            }
        };
    }

    _handlerVolumeMute(){//点击喇叭图标 静音和恢复音量
        const that = this ;
        let audio=that.refs.playAudio;
        audio.muted = !audio.muted ;
        let volumeBtn=that.refs.audioVolumeBtn;
        if(audio.muted){
            audio.volume = 0;
            volumeBtn.className='volume-btn no add-fl  muted';
            that.setState({
                volume:0
            });
        }else{
            let reg=/muted/g;
            audio.volume = 1;
            //volumeBtn.className=volumeBtn.className.replace(reg,'');
            volumeBtn.className='volume-btn yes add-fl';
            that.setState({
                volume:audio.volume*100
            });

        }
    };

    render() {

        let that = this;
        let closeStyle = !this.state.isTeacher?'none':(!this.state.close?'none':'');
        //let { volumeButtonStyle } = that.state ;
        return (
            <div className="lc-audio-container add-position-absolute-top0-left0 clear-float "  id="lc_audio_container"  style={{display:!that.state.open?'none':''}}>
                <audio ref="playAudio" preload="auto" id="mp3Audio" data-audio-id="" src="">
                    {TkGlobal.language.name === 'chinese' ? '您的浏览器不支持  audio 播放 ， 请更新更高版本的浏览器或者更换主流浏览器！' : ' Your browser does not support audio playback, please update the higher version of the browser or replace the mainstream browser!'}
                </audio>
                <button ref="playAudioPauseBtn" style={{display: !this.state.isTeacher ? 'none' : 'block'}} className="playing-btn play add-fl" id="play_pause_btn_audio" onClick={that.playPause.bind(that)}>
                </button>
                <span className="audio-progress-container add-fl add-block" style={{lineHeight:TkGlobal.playback?'0.3rem':undefined , width:TkGlobal.playback?'auto':undefined , marginRight:TkGlobal.playback?'0':undefined }}  >
                    <span className="audio-info-vessel">
                        <span className="playback-music-icon"  style={{display:TkGlobal.playback?'block':'none'}}  />
                        <span className="audio-name add-nowrap"  style={{textAlign:TkGlobal.playback?'right':undefined}} >{that.state.title}</span>
                        <span className="audio-time" style={{display:TkGlobal.playback?'none':undefined}} >
                            <time ref="currAudioTime" className="curr-play-time">
                            </time>/
                            <time ref="totalAudioTime" className="total-play-time">
                            </time>
                        </span>
                    </span>
                    <div className="audio-progress-outside"  style={{display:TkGlobal.playback?'none':undefined}} >
                        <ReactSlider disabled={!this.state.isTeacher} className={"tk-slide tk-audio-progress-slider"} withBars defaultValue={0} value={this.state.progress} onAfterChange={that.progressOnAfterChange.bind(that)} onBeforeChange={that.progressOnBeforeChange.bind(that)}/>
                    </div>
                </span>
                <span className="audio-volume-container add-fl clear-float add-position-relative" style={{width: '1.7rem'}}>
                    <button ref="audioVolumeBtn" className={"volume-btn add-fl yes"} onClick={that._handlerVolumeMute.bind(that) }>
                    </button>
                    <ReactSlider className={"tk-slide tk-audio-volume-slider add-fl"} withBars defaultValue={100} value={this.state.volume} onChange={this.volumeOnAfterChange.bind(this)}/>
                </span>
                <button className="audio-close add-fl"   onClick={that.closeAudioVideo.bind(that)}  style={{display:closeStyle}} >
                </button>
            </div>
        )
    };
};
export default  AudioPlayerSmart;

