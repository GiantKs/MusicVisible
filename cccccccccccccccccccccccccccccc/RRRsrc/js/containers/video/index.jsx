import React from 'react';
import ReactDom from 'react-dom';
import ReactSlider from 'react-slider';
import eventObjectDefine from 'eventObjectDefine';
import TkGlobal from 'TkGlobal' ;
import ServiceRoom from "ServiceRoom";
import TkConstant from "TkConstant";
import ServiceSignalling from 'ServiceSignalling';
import TkUtils from 'TkUtils';
import CoreController from 'CoreController' ;
import VideoDrawingBoard from '../whiteboardAndNewppt/videoDrawingBoard/videoDrawingBoard';

class Video extends React.Component {
    constructor(props, context) {
        super(props, context);
       	this.state={
            isFullScreen:false ,
			stream:undefined,
            volume:100,
            loading:true,
            videoSize:{
                width:0,
                height:0,
            },
            updateState:false ,
            isVideoInFullscreenMedia:false,
        };
        this.isProgressDraging = false ; //拖动进度过程中
        this.isVolumeDraging = false ; //拖动音量过程中
        this.listernerBackupid = new Date().getTime()+'_'+Math.random() ;
    };

    componentDidMount(){
        eventObjectDefine.Window.addEventListener(TkConstant.EVENTTYPE.WindowEvent.onResize, this.handlerOnResize.bind(this) , this.listernerBackupid  ); //监听窗口改变 使得视频容器宽高按比例缩小
        eventObjectDefine.Document.addEventListener(TkConstant.EVENTTYPE.DocumentEvent.onKeydown , this.handlerOnKeydown.bind(this)   , this.listernerBackupid); //document.keydown事件
        eventObjectDefine.Document.addEventListener(TkConstant.EVENTTYPE.DocumentEvent.onFullscreenchange , this.handlerOnFullscreenchange.bind(this)   , this.listernerBackupid); //document.onFullscreenchange事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPubmsg ,this.handlerRoomPubmsg.bind(this)  ,  this.listernerBackupid ) ;//room-pubmsg事件：动态ppt处理
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , this.handlerRoomDelmsg.bind(this), this.listernerBackupid); //roomDelmsg事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamSubscribed_media, this.handlerStreamSubscribed.bind(this), this.listernerBackupid); //stream_media-subscribed事件：订阅事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamRemoved_media, this.handlerStreamRemoved.bind(this), this.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamAttributesUpdate_media, this.handlerStreamAttributesUpdate.bind(this) , this.listernerBackupid); //视频流更新事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamPublishFail_media, this.handlerStreamPublishFail.bind(this) , this.listernerBackupid); //stream-publish_fail事件：流发布失败事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamUnpublishFail_media, this.handlerStreamUnpublishFail.bind(this) , this.listernerBackupid); //stream-unpublish_fail事件：流取消发布失败事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomUserpropertyChanged ,this.handlerroomUserpropertyChanged.bind(this) , this.listernerBackupid );
        eventObjectDefine.CoreController.addEventListener('resizeMediaVideoHandler', this.handlerResizeMediaVideoHandler.bind(this) , this.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener('receive-msglist-FullScreen' , this.handlerMsglistFullScreen.bind(this)  , this.listernerBackupid);//msglist,处理课件全屏
    }

    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        eventObjectDefine.CoreController.removeBackupListerner(this.listernerBackupid );
        eventObjectDefine.Window.removeBackupListerner(this.listernerBackupid );
        eventObjectDefine.Document.removeBackupListerner(this.listernerBackupid );
        this.stopTimer();
    };
    componentDidUpdate(prevProps , prevState){ //在组件完成更新后立即调用。在初始化时不会被调用
        if (prevState.stream !== this.state.stream) {
            if(this.refs.videoTopContainer){
                let videoTopContainerElement = ReactDom.findDOMNode(this.refs.videoTopContainer);
                if(videoTopContainerElement){
                    this.setState({videoSize:{
                        width:videoTopContainerElement.clientWidth ,
                        height:videoTopContainerElement.clientHeight,
                    }});
                }
            }
        }
        if(prevState.volume !== this.state.volume){
            let video= this.refs.video;
            if(video){
                video.volume=this.state.volume/100;
                if(this.state.volume===0) {
                    video.muted = true;
                }else{
                    video.muted = false;
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
    handlerRoomPubmsg(recvEventData){
        let that = this;
        let pubmsgData = recvEventData.message;
        switch (pubmsgData.name) {
            case "FullScreen":
                if (pubmsgData.data.fullScreenType === 'stream_media') {
                    this.setState({isVideoInFullscreenMedia:true});
                }else{
                    this.setState({isVideoInFullscreenMedia:false,});
                }
                break;
        }
    };
    handlerRoomDelmsg(recvEventData) {
        const that = this;
        let pubmsgData = recvEventData.message;
        switch(pubmsgData.name) {
            case "FullScreen":
                this.setState({isVideoInFullscreenMedia:false});
                break;
        }
    };
    handlerMsglistFullScreen(handleData) {
        let data = handleData.message.FullScreenArray[0].data;
        if (data.fullScreenType === 'stream_media') {
            this.setState({isVideoInFullscreenMedia:true});
        }
    }

    handlerOnResize(param){
        this.changeSize();
    };
	
	handlerResizeMediaVideoHandler(){
		this.changeSize();
	}
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

    changeSize(){
        if(this.refs.videoTopContainer){
            let videoTopContainerElement = ReactDom.findDOMNode(this.refs.videoTopContainer);
            if(videoTopContainerElement){
                this.setState({videoSize:{
                    width:videoTopContainerElement.clientWidth ,
                    height:videoTopContainerElement.clientHeight
                }});
            }
        }
    };

    playPauseOnClick(){//播放暂停视频
        let videoStream = this.state.stream;
        if(videoStream && ( TkConstant.hasRole.roleChairman||TkConstant.hasRole.roleTeachingAssistant ) ){
            clearTimeout( this.playPauseTimer );
            this.playPauseTimer = setTimeout( ()=>{
                if(videoStream.getAttributes().pause){
                    ServiceRoom.getTkRoom().controlMedia(videoStream.getID(),{"type":"pause","pause":false});       //恢复
                    if(TkConstant.joinRoomInfo.videoWhiteboardDraw){
                        let isDelMsg = true;
                        ServiceSignalling.sendSignallingFromVideoWhiteboard(isDelMsg);
                    }
                }else{
                    ServiceRoom.getTkRoom().controlMedia(videoStream.getID(),{"type":"pause","pause":true});       //暂停
                    if(TkConstant.joinRoomInfo.videoWhiteboardDraw){
                        let isDelMsg = false;
                        let data = {videoRatio:videoStream.getAttributes().width/videoStream.getAttributes().height};
                        ServiceSignalling.sendSignallingFromVideoWhiteboard(isDelMsg,data);
                    }
                }
            } , 200 );
        }
    };

    handlerOnFullscreenchange(){
        if(TK.SDKTYPE !== 'mobile'){
            this.setState({isFullScreen: TkUtils.tool.getFullscreenElement() && TkUtils.tool.getFullscreenElement().id == "videoPlayFullContainerId" });
        }
    };

    videoMediaFullScreenOnClick () {
        let videoPlayFullContainerElement = document.getElementById('videoPlayFullContainerId');
        if( this.state.isFullScreen ){
            TkUtils.tool.exitFullscreen();
        }else{
            TkUtils.tool.launchFullscreen( videoPlayFullContainerElement );
        }
    };

    handlerOnKeydown(recvEventData){
        let { keyCode } = recvEventData.message;
        clearTimeout(this.keydownTimer);
        this.keydownTimer = setTimeout( () => {
            switch(keyCode) {
                case 27://esc退出
                    if(  TkUtils.tool.isFullScreenStatus() ){
                        TkUtils.tool.exitFullscreen();
                    }
                    break ;
            }
        } , 250 ) ;
    };

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
    }

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

    handlerStreamSubscribed(streamEvent){
        if (streamEvent && streamEvent.stream) {
            let stream = streamEvent.stream;
            if(!stream.video)  //mp3 直接返回
                return;
            let myURL = window.URL || webkitURL;
            let streamUrl = myURL.createObjectURL(stream.stream);
            let media = this.refs.video;
            media.src = streamUrl ;
            media.load();
            TK.AVMgr.setElementSinkIdToAudioouputDevice(media , undefined , () => {
                L.Utils.mediaPlay( media);
            });
            this.setState({
                stream:stream
            });
            if(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant ){
                if(stream.getAttributes().filename !== "" ) {
                    //dispatch 分发一个取消发布成功事件
                    let playMediaPublishSucceedData = {
                        stream:stream
                    };
                    eventObjectDefine.CoreController.dispatchEvent({
                        type: 'playMediaPublishSucceed',
                        message: playMediaPublishSucceedData
                    });
                }
            }
            if(stream.getAttributes().filename === "" ){
                let playDynamicPPTMediaStreamData={
                    stream:stream,
                    show:true
                };
                TkGlobal.playPptVideoing = true ;
                eventObjectDefine.CoreController.dispatchEvent({
                    type: 'playDynamicPPTMediaStream',
                    message:  playDynamicPPTMediaStreamData
                });
            }
        }
	};

    handlerStreamAttributesUpdate(updateEvent){
        if(!updateEvent.stream.video)  //mp3,动态PPT 直接返回  学生端不用管，服务器推流。暂停就不推流了
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
	};

    closeMediaVideoOnClick(){//关闭视频文件
        let stream = this.state.stream;
        if(stream && stream.extensionId){
            ServiceSignalling.unpublishMediaStream(stream); //取消发布
        }
    }

    handlerStreamRemoved(streamEvent){
        TkUtils.tool.exitFullscreen();
        let stream = streamEvent.stream;
        if (stream !== undefined && stream.extensionId !== undefined ) {
            if(!stream.video) {  //mp3 直接返回
                return;
            }
            stream.hide();  //视频停止播放
            let video = this.refs.video;
            video.src = '' ;  //连接地址修改为空
            video.load();
            this.stopTimer();
            this.setState({
                stream:undefined,
            });
            if(TkConstant.joinRoomInfo.videoWhiteboardDraw){
                let isDelMsg = true;
                ServiceSignalling.sendSignallingFromVideoWhiteboard(isDelMsg);
            }
            if( TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant ) {
                if(stream.getAttributes().filename !== "" ) {
                    let playMediaUnpublishSucceedData = {
                        stream: stream
                    };
                    eventObjectDefine.CoreController.dispatchEvent({
                        type: 'playMediaUnpublishSucceed',
                        message: playMediaUnpublishSucceedData
                    });
                }
            }
            if(stream.getAttributes().filename === "" ) {
                let playDynamicPPTMediaStreamData = {
                    stream: stream,
                    show: false
                };
                TkGlobal.playPptVideoing = false;
                eventObjectDefine.CoreController.dispatchEvent({
                    type: 'playDynamicPPTMediaStream',
                    message: playDynamicPPTMediaStreamData
                });
            }
            if (TkGlobal.isVideoInFullscreen) {//取消画中画全屏
                let isDelMsg = true;
                ServiceSignalling.sendSignallingFromFullScreen(undefined,isDelMsg);
            }
        }
        this.setState({
            loading:true
        });
	}

    handlerStreamPublishFail(streamEvent){
        let stream = streamEvent.stream;
        if(!stream.video)  //mp3 直接返回
            return;

        if(stream.getAttributes().filename !== "" ) {
            if(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant ){  //dispatch 分发一个发布失败事件
                let playMediaPublishFailData = {
                    stream: stream
                };
                eventObjectDefine.CoreController.dispatchEvent({
                    type: 'playMediaPublishFail',
                    message: playMediaPublishFailData
                });
            }
        } else {
            let playDynamicPPTMediaStreamData = {
                stream: stream,
                show: false
            };
            TkGlobal.playPptVideoing = false;
            eventObjectDefine.CoreController.dispatchEvent({
                type: 'playDynamicPPTMediaStream',
                message: playDynamicPPTMediaStreamData
            });
        }
        this.setState({
            loading:false
        });
    }

    handlerStreamUnpublishFail(streamEvent){
        let stream = streamEvent.stream;
        if(!stream.video)  //mp3 直接返回
            return;

        if(stream.getAttributes().filename !== "" ) {
            if(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant) {
                let playMediaUnpublishFailData = {
                    stream: stream
                };
                eventObjectDefine.CoreController.dispatchEvent({  //dispatch 分发一个取消发布失败事件
                    type: 'playMediaUnpublishFail',
                    message: playMediaUnpublishFailData
                });
            }
        }
    }

    volumeMuteOnClick(){//点击喇叭图标 静音和恢复音量
        this.setState({
            volume:this.state.volume!== 0 ? 0:(this.volume || 100) ,
        });
    };

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
    closeLoadingOnPlay(){
        this.setState({
            loading:false
        });
    }
    _loadStreamInfo(){ //加载流的专属信息
        let attributes = {} , positionTime = 0  , durationTime = 0 ;
        if(this.state.stream && this.state.stream.video){
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
    /*处理画中画的全屏点击事件*/
    _handleVideoInFullScreen() {
        if (TkGlobal.isVideoInFullscreen) {
            let isDelMsg = true;
            ServiceSignalling.sendSignallingFromFullScreen(undefined,isDelMsg);
        }else {
            let data = {
                fullScreenType:'stream_media',//'stream_video','courseware_file','stream_media'
                needPictureInPictureSmall:true,
            };
            ServiceSignalling.sendSignallingFromFullScreen(data);
        }
    }
    render() {
        let isRoleChairman = TkConstant.hasRole.roleChairman ;
        let isRoleTeachingAssistant = TkConstant.hasRole.roleTeachingAssistant ;
        let isRoleChairmanOrTeachingAssistant = isRoleChairman ||  isRoleTeachingAssistant ;
        let { attributes , positionTime , durationTime } = this._loadStreamInfo();
        let progress = durationTime>0 ?100*positionTime/durationTime :0;
    	let zIndex = attributes.filename !== "" ? 119 : 151;
    	let {loading,isVideoInFullscreenMedia}=this.state;
    	let videoFullBtn = CoreController.handler.getAppPermissions('isHandleVideoInFullScreen')?this._handleVideoInFullScreen.bind(this):this.videoMediaFullScreenOnClick.bind(this);
    	let isDisableFullscreenBtn = TkConstant.hasRole.roleStudent && isVideoInFullscreenMedia;
    	return(
    		<div id="video-box" className="video-box" ref="mp4"  style={{display:!this.state.stream?'none':'block' , zIndex:zIndex}}  >
	    		<div id="mp4" className="mp4-video-box">
	    			<div id="videoPlayFullContainerId" style={{width:'100%' , height:'100%'}}>
                        <div ref="videoTopContainer" className="video-play" style={{height:TkGlobal.playback?'100%':undefined}}>
                            <video  ref="video" id="uploaded-video" className="video-js" preload="auto"  onPlay={this.closeLoadingOnPlay.bind(this)} />
                            <div id="preloader_mp4" className="mp4-loading-container add-position-absolute-top0-left0" style={{display:loading?'block':'none'}} >
                            </div>
                            <VideoDrawingBoard containerWidthAndHeight={this.state.videoSize}/>
                        </div>
                        {!isRoleChairmanOrTeachingAssistant?undefined:<button  className="close" onClick={this.closeMediaVideoOnClick.bind(this)} style={{display: !isRoleChairmanOrTeachingAssistant ? 'none' : 'block'}} /> }
                        <div className="video-controller" style={{display:TkGlobal.playback?'none':undefined}}>
                            <div className="video-func-btn-container clear-float">
                                <div className="play-container" ref="progressDiv">
                                    <ReactSlider disabled={!isRoleChairmanOrTeachingAssistant} ref="progressBar" defaultValue={0}  withBars value={this.changeProgress || progress} onChange={this.progressOnChange.bind(this)}  onBeforeChange={this.progressOnBeforeChange.bind(this)} onAfterChange={this.progressOnAfterChange.bind(this)} />
                                </div>
                                <span className="button-left add-fl" onClick={this.playPauseOnClick.bind(this)}>
								    <button style={{display:!isRoleChairmanOrTeachingAssistant?'none':'block'}} ref="playPauseBtn" className={"play-pause-btn "+(!attributes.pause?'pause':'play') } id="play_pause_btn" />
                                </span>
                                <span className="button-right add-fr clear-float">
                                    <span className="video-time add-fl">
                                        <time ref="currentVideoTime" className="curr-play-time">{this._formatTime(positionTime/1000)}</time>/<time id="total-play-time" ref="totalVideoTime" className="total-play-time">{this._formatTime(durationTime/1000)}</time>
                                    </span>
                                    <button  className={"volume-btn add-fl  "  + (this.state.volume>0?'yes':'no') } onClick={this.volumeMuteOnClick.bind(this) }  />
                                    <span id="video_volume_slide" className="volume-bar-container add-position-relative add-fl ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content">
                                        <ReactSlider  defaultValue={100} withBars  value={this.changeVolume || this.state.volume}  onChange={this.volumeOnChange.bind(this)} onBeforeChange={this.volumeOnBeforeChange.bind(this)}  onAfterChange={this.volumeOnAfterChange.bind(this)}    />
                                    </span>
                                    <button id="video-full-btn" onClick={videoFullBtn} className={"full-btn no add-fl " + (this.state.isFullScreen || isVideoInFullscreenMedia?'yes':'no') + (isDisableFullscreenBtn?' disabled':'')} disabled={isDisableFullscreenBtn}/>
                                </span>
                            </div>
                        </div>
                    </div>
		    	</div>
		    </div>
    	)
    }
};

export default Video;