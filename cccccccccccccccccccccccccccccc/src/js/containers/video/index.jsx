import React from 'react'
import ReactSlider from 'react-slider';
import eventObjectDefine from 'eventObjectDefine';
import TkGlobal from 'TkGlobal' ;
import './static/index.css' ;
import ServiceRoom from "../../services/ServiceRoom";
import TkConstant from "../../tk_class/TkConstant";
import ServiceSignalling from 'ServiceSignalling';
import TkUtils from 'TkUtils';

class Video extends React.Component {
    constructor(props, context) {
        super(props, context);
       	this.state={
       		open:false,
            close:false,
       		progress:0,
			radio:0,
			stream:undefined,
			streamid:0,
			streamDuration:0,
            currentTime:0,
            volume:100,
            isTeacher:(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant)?true:false,
            startTime:0,
            title:'',
            volumeButtonStyle:''
            
       };
        this.myTime ;
        this.isProgressDraging = false ; //拖动进度过程中
        this.isVolumeDraging = false ; //拖动音量过程中
        this.listernerBackupid = new Date().getTime()+'_'+Math.random() ;
    };

    componentDidMount(){
        let that = this;
        eventObjectDefine.CoreController.addEventListener( "playMediaFile" , that.playMediaFile.bind(that), that.listernerBackupid); //播放媒体事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamSubscribed_media, that.handlerStreamSubscribed.bind(that), that.listernerBackupid); //stream_media-subscribed事件：订阅事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamRemoved_media, that.handlerStreamRemoved.bind(that), that.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamAdded_media, that.handlerStreamAdded.bind(that) , that.listernerBackupid); //stream-added事件：增加事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamAttributesUpdate_media, that.handlerStreamAttributesUpdate.bind(that) , that.listernerBackupid); //stream-added事件：增加事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomConnected, that.handlerRoomConnected.bind(that)  , that.listernerBackupid ); //Room-Connected事件：房间连接事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamPublishFail_media, that.handlerStreamPublishFail.bind(that) , that.listernerBackupid); //stream-publish_fail事件：流发布失败事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamUnpublishFail_media, that.handlerStreamUnpublishFail.bind(that) , that.listernerBackupid); //stream-unpublish_fail事件：流取消发布失败事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamFailed_media, that.handlerStreamFailed.bind(that) , that.listernerBackupid); //stream-unpublish_fail事件：流取消发布失败事件
        eventObjectDefine.CoreController.addEventListener('resizeMediaVideoHandler', that.handlerResizeMediaVideoHandler.bind(that) , that.listernerBackupid);
        eventObjectDefine.Window.addEventListener(TkConstant.EVENTTYPE.WindowEvent.onResize, that.handlerOnResize.bind(that) , that.listernerBackupid  ); //监听窗口改变 使得视频容器宽高按比例缩小
        eventObjectDefine.Document.addEventListener(TkConstant.EVENTTYPE.DocumentEvent.onKeydown , that.handlerOnKeydown.bind(that)   , that.listernerBackupid); //document.keydown事件
        //eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamSubscribed_screen, that.handlerStreamSubscribedScreen.bind(that), that.listernerBackupid); //stream_media-subscribed事件：订阅事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamAdded_screen, that.handlerStreamAddedScreen.bind(that), that.listernerBackupid); //stream_media-subscribed事件：订阅事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.streamRemoved_screen, that.handlerStreamRemovedScreen.bind(that) , that.listernerBackupid);//
        eventObjectDefine.CoreController.addEventListener( 'destTopShareStream' , that.handlerDestTopShareStream.bind(that) , that.listernerBackupid );
        // this.fullScreen();
       
        //this.livePushFlow();
        
    }
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        let that = this ;
        clearInterval(that.myTime);
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid );
        eventObjectDefine.Window.removeBackupListerner(that.listernerBackupid );
        that.stopTimer();
    };

    isTeacher(){
    	this.setState({
    		'isTeacher':TkConstant.hasRole.roleChairman
    	})
    	
    }

    handlerOnResize(param){
        const that = this ;
        that.changeSize();
    };
	
	handlerResizeMediaVideoHandler(){
		const that = this ;
		that.changeSize();
	}
    changeSize(){
    		let content=document.getElementById('content');
			let mp4=document.getElementById('mp4');
			
			let outerWidth=content.offsetWidth;
			let outerHeight=content.offsetHeight;

			 let radio=outerWidth/outerHeight;
			 if(radio>16/9){//以高为基准
			 	mp4.style.height=outerHeight+'px';
			 	mp4.style.width=outerHeight*16/9+'px';
			 }else{//以宽为基准
			 	mp4.style.width=outerWidth+'px';
			 	mp4.style.height=9*outerWidth/16+'px';
			 }
    };

    handlerStreamSubscribedScreen(streamEvent){
        let that = this;
        /*let isTeacher = that.state.isTeacher;
        if (streamEvent) {

            let streamScreen = streamEvent.stream;
            if(isTeacher && streamScreen.screen ){
                let room = ServiceRoom.getTkRoom();
                let stream = that.state.stream;

                if(stream!==undefined )
                    room.controlMedia(stream.getID(),{"type":"pause","pause":true});       //暂停
            };
        }*/
    }

    handlerStreamAddedScreen(streamEvent){
        let that = this;
        let isTeacher = that.state.isTeacher;
        if (streamEvent) {

            /*let streamScreen = streamEvent.stream;
            if(isTeacher && streamScreen.screen ){
                let room = ServiceRoom.getTkRoom();
                let stream = that.state.stream;

                if(stream!==undefined )
                    room.controlMedia(stream.getID(),{"type":"pause","pause":true});       //暂停
            };*/



            //dispatch 分发一个取消发布成功事件
            if(isTeacher) {
                let stream = that.state.stream;
                //视频停止播放
                if(stream && stream.extensionId){
                    //stream.hide();
                    ServiceSignalling.unpublishMediaStream(stream); //取消发布
                }
            }
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
                if(stream!==undefined )
                    room.controlMedia(stream.getID(),{"type":"pause","pause":false});       //恢复
            };
        }*/
    }

    handlerDestTopShareStream(event){
        let that = this;
        let  destTopStream = event.message;
    }

    playPause(){//播放暂停视频
		let that = this;
        let media=that.refs.video;
        let playBtn=that.refs.playPauseBtn;
        let isTeacher = this.state.isTeacher;
        clearTimeout( that.playPauseTimer );
        let videoStream = that.state.stream;
        that.playPauseTimer = setTimeout( () =>{
            if(videoStream.getAttributes().pause){
                /*try {
                    // 此处是可能产生例外的语句
                    L.Utils.mediaPlay( media);
                } catch(error) {
                    // 此处是负责例外处理的语句
                } finally {*/
                    // 此处是出口语句
                    playBtn.className='play-pause-btn pause'
                    //发布,controlmedia
                    let room = ServiceRoom.getTkRoom();
                    // let stream = that.state.stream;
                    if(videoStream!==undefined && isTeacher)
                        room.controlMedia(videoStream.getID(),{"type":"pause","pause":false});       //暂停
               /* }*/

            }else{
                // L.Utils.mediaPause( media);
                playBtn.className='playing-btn';
                //发布,controlmedia
                let room = ServiceRoom.getTkRoom();
                // let stream = that.state.stream;
                if(videoStream !== undefined && isTeacher)
                    room.controlMedia(videoStream.getID(),{"type":"pause","pause":true});       //恢复
            }
        } , 200) ;
    };

    toTwo(num){//时间个位数转十位数

		if(parseInt(num/10)==0){
			return '0'+num;
		}
        else{
			return num;
		}
	};
    formatTime(data){//将时间格式化
    	let minute=parseInt(data/60);
    	let second=Math.round(data%60);

    	if(second==60){
            minute+=1;
            second=0;
        }
    	return this.toTwo(minute)+':'+this.toTwo(second)
    };

    timeShow(){//获取视频总视频和播放中的当前时间
    	//let father=document.getElementById('video-box');
    	//let media=document.getElementById('uploaded-video');
		let that = this;
        let father=this.refs.mp4;
        let media=that.refs.video;
    	//let totalPlayTimeDOM=father.getElementsByClassName('total-play-time')[0];
    	//let currentTimeDOM=father.getElementsByClassName('curr-play-time')[0];
        //let playBtn=document.getElementById('play_pause_btn');
		let totalVideoTime = that.refs.totalVideoTime;
        let currentVideoTime = that.refs.currentVideoTime;
        let playBtn=that.refs.playPauseBtn;
    	let totaltime;
    	let stream = that.state.stream;

    	media.addEventListener('loadedmetadata',function(){//获取总时间
        //stream.addEventListener('loadedmetadata',function(){//获取总时间

    		//totaltime=media.duration;
            //totaltime=that.state.streamDuration;
			/*that.setState({
				radio:totaltime/100
			});*/
	    	//totalPlayTimeDOM.innerHTML=that.formatTime(totaltime)
			//totalVideoTime.innerHTML=that.formatTime(totaltime);
    	})
    	media.addEventListener('timeupdate',function(){//当前播放时间
        //stream.addEventListener('timeupdate',function(){//当前播放时间


    		//let radio=media.currentTime/totaltime;
            /*let radio=that.state.currentTime/totaltime;
    		that.setState({
    			progress:radio
    		})*/
    		//currentTimeDOM.innerHTML=that.formatTime(media.currentTime);
            //currentVideoTime.innerHTML = that.formatTime(that.state.currentTime);
    		//if(media.ended){//结束时将按钮变换
            if(that.state.stream.ended){//结束时将按钮变换
	    		playBtn.className="playing-btn";
	    	}
    	})
    };


    /*fullScreen(){//全屏
    	let that=this;
    	//let father=document.getElementById('video-box');
        let father=this.refs.mp4;
    	//let media=document.getElementById('uploaded-video');
        let media=that.refs.video;
    	let fullBtn=father.getElementsByClassName('full-btn')[0];
        TkUtils.tool.removeEvent( fullBtn ,'click');
    	TkUtils.tool.addEvent( fullBtn ,'click',function(){
    	    TkUtils.tool.launchFullscreen(media);
        } );
    }*/
    videoMediaFullScreen () {
        let mp4Video = document.getElementById('uploaded-video');
        TkUtils.tool.launchFullscreen(mp4Video);
    };
    handlerOnKeydown(recvEventData){
        const that = this ;
        let { keyCode } = recvEventData.message;
        let mp4Video = document.getElementById('uploaded-video');
        clearTimeout(that.keydownTimer);
        that.keydownTimer = setTimeout( () => {
            switch(keyCode) {
                case 27://esc退出
                    if(  TkUtils.tool.isFullScreenStatus(mp4Video) ){
                        TkUtils.tool.exitFullscreen();
                    }
                    break ;
            }
        } , 250 ) ;
    };

    progressOnAfterChange(value){//滑动或点击进度条时 跳到对应位置的视频
        let that = this;
        that.isProgressDraging = false ;
        let stream = that.state.stream;
    	let currentTime =value*that.state.streamDuration;
        let isTeacher = this.state.isTeacher;
    	let position = parseInt(currentTime/100);
        let room = ServiceRoom.getTkRoom();
        //发布 controlmedia 拖动
        if(stream!=undefined && isTeacher)
            room.controlMedia(stream.getID(),{'type':'seek', 'pos':position});       //拖动
    }

    progressOnBeforeChange(){ //改变进度之前不能更新进度条进度的state
        const that = this ;
        that.isProgressDraging = true ;
    };

    volumeOnAfterChange(value){//滑动过程和点击音量条时，设置音量大小
        let that = this;
        let father=this.refs.mp4;
        that.isVolumeDraging = false ;
        let media=that.refs.video;
        media.volume=value/100;
        //this.state.volume=value;
        if(value===0) {
            media.muted = true;
            that.setState({
                volume: 0,
                volumeButtonStyle: 'muted'
            });
        } else {
            media.muted = false;
            that.setState({
                volume: value,
                volumeButtonStyle: ''
            });
        }
    }

    volumeOnBeforeChange(){
        const that = this ;
        that.isVolumeDraging = true ;
    }

    playMediaFile(event){

        let that= this;
        let playFileData = event.message;
        let fileid = playFileData.fileid;
        let filePlayUrl = playFileData.filePlayUrl;
        let filename=playFileData.filename;
        let isVideo = playFileData.video;
        if(!isVideo)
        	return;

		let room = ServiceRoom.getTkRoom();
        let url = filePlayUrl;

        let to = "__all";
        if(!TkGlobal.classBegin)
            to = room.getMySelf().id;
        let stream = TK.Stream({video: true, audio: true, url:url, extensionId:room.getMySelf().id + ":media", attributes:{filename:filename,fileid:fileid,type:'media',toID:to}},TkGlobal.isClient);

		//发布流媒体
        let isTeacher = that.state.isTeacher;
        let id = ServiceRoom.getTkRoom().getMySelf().id;
        if(isTeacher && playFileData.userid === id )
            ServiceSignalling.publishMediaStream(stream);
        that.changeSize();
	}

    handlerStreamSubscribed(streamEvent){
		let that = this;
		let isTeacher = that.state.isTeacher;
        if(!streamEvent.stream.video)  //mp3,动态PPT 直接返回
            return;
        if (streamEvent) {
            let stream = streamEvent.stream;
            let myURL = window.URL || webkitURL;
            let streamUrl = myURL.createObjectURL(stream.stream);
            //that.refs.video.src = streamUrl ;
            let media=that.refs.video;
            media.src = streamUrl ;
            media.load();

            TK.AVMgr.setElementSinkIdToAudioouputDevice(media , undefined , () => {
                L.Utils.mediaPlay( media);
            });
            //TkUtils.tool.removeEvent( media , 'loadedmetadata' );
            //TkUtils.tool.addEvent( media , 'loadedmetadata',function(){ //获取总时间
                let totalVideoTime = that.refs.totalVideoTime;
                let duration = that.state.streamDuration;
                totalVideoTime.innerHTML=that.formatTime(duration/1000);
                let currentVideoTime = that.refs.currentVideoTime;
                currentVideoTime.innerHTML = that.formatTime(that.state.startTime/1000);

                let playBtn=that.refs.playPauseBtn;
                /*try {
                    // 此处是可能产生例外的语句
                    L.Utils.mediaPlay( media);
                } catch(error) {
                    // 此处是负责例外处理的语句

                } finally {*/
                    // 此处是出口语句
                    playBtn.className='play-pause-btn pause'
                    that.setState({
                        stream:stream,
                        open:true,
                        title:stream.getAttributes().filename
                    });
                    that.setState({
                        close:true
                    });
                    if(isTeacher){
                        //let extensionId = ServiceRoom.getTkRoom().getMySelf().id + ":media";
                        if(stream.getAttributes().filename!="" ) {
                            //dispatch 分发一个取消发布成功事件
                            let playMediaPublishSucceedData = {
                                stream:stream
                            };
                            eventObjectDefine.CoreController.dispatchEvent({
                                type: 'playMediaPublishSucceed',
                                message: playMediaPublishSucceedData
                            });
                        }
                    } else {
                        let room = ServiceRoom.getTkRoom();
                        if(streamEvent.stream.extensionId != undefined && streamEvent.stream.extensionId.split(':')[0] === room.getMySelf().id && streamEvent.stream.getAttributes().filename==="" ) {
                            that.setProgress(streamEvent.stream, false);
                        } else {
                            let startTime = that.state.startTime;
                            that.startTimer(startTime);
                        }
                    };
                    //} );
                    if(stream.getAttributes().filename == "" ){
                        let playDynamicPPTMediaStreamData={
                            stream:stream,
                            show:true
                        };
                        TkGlobal.playPptVideoing = true ;
                        eventObjectDefine.CoreController.dispatchEvent({
                            type: 'playDynamicPPTMediaStream',
                            message:  playDynamicPPTMediaStreamData
                        });
                    };
                // }


        }
	};

    currentPlayTimer(startTime){
        let that = this;
        let currentVideoTime = that.refs.currentVideoTime;
        let duration =that.state.streamDuration;

        if(startTime >=duration ){
            that.stopTimer();
            return;
        }
        that.setState({
            startTime:startTime
        });
        currentVideoTime.innerHTML = that.formatTime(startTime/1000);
        let radio=100*startTime/duration;
        if(that.isProgressDraging){
            return ;
        }
        that.setState({
            progress:radio
        });
    };

    startTimer(startTime)/* 定义一个得到本地时间的函数*/
    {
        if(TkGlobal.playback){
           return ;
        }
        let that = this;
        clearInterval(that.myTime);
        that.myTime = setInterval( () => {that.currentPlayTimer(startTime+=1000)},1000);
    }

    stopTimer() {/* clearInterval() 方法用于停止 setInterval() 方法执行的函数代码*/
        let that=this;
        clearInterval(that.myTime);
        that.myTime = null ;
    }

    setDurationAndPos(stream){
        let that=this;
        let duration = 0;
        let position = 0;
        duration = stream.getAttributes().duration;
        if(duration===undefined){
            duration = 0;
        }
        position = stream.getAttributes().position;
        if(position===undefined){
            position = 0;
        }

        that.setState({
            streamDuration:duration,
            startTime:position,
        });
    }
	//获取流文件总时长
    handlerStreamAdded(addEvent){
    	/*
    	"onAddStream",{"id":541805088155220600,"audio":true,"video":true,"attributes":{"duration":51000},"extensionId":"23a3b346-a3b1-c032-6a07-de58c7c5fea8"}
    	*/
        let that = this;
        if(!addEvent.stream.video)  //mp3,动态PPT 直接返回
            return;
        let stream = addEvent.stream;
        that.setDurationAndPos(stream);
    }

    setProgress(updateEvent,isTeacher){
        let that = this;
        let progressBar = that.refs.progressBar;
        let {attrs} = updateEvent ;
        let position = attrs.position !== undefined ?   attrs.position : updateEvent.stream.getAttributes().position;
        if(position === undefined)
            position = 0;

        let currentVideoTime = that.refs.currentVideoTime;
        let duration = that.state.streamDuration;
        //let progressBar = that.refs.progressBar;
        let radio = 100 * position / duration;
        currentVideoTime.innerHTML = that.formatTime(position / 1000);

        if(that.isProgressDraging && isTeacher){
            return ;
        }
        that.setState({
            progress: radio
        });
    }

    handlerStreamAttributesUpdate(updateEvent){
    	let that = this;
        let isTeacher = that.state.isTeacher;

        if(!updateEvent.stream.video)  //mp3,动态PPT 直接返回  学生端不用管，服务器推流。暂停就不推流了
            return;
        let {attrs} = updateEvent ;
        if(isTeacher) {  //老师端
            if(attrs.pause !== undefined) {
                //
                let playBtn=that.refs.playPauseBtn;
                let media=that.refs.video;
                let pause = updateEvent.stream.getAttributes().pause;
                if (pause) {
                    playBtn.className='playing-btn';
                    // L.Utils.mediaPause( media);

                } else {
                    playBtn.className='play-pause-btn pause';
                    //  L.Utils.mediaPlay( media);
                }
            }

            that.setProgress(updateEvent, true);

        } else { //学生端

            //let pause = updateEvent.stream.getAttributes().pause;
            let pause =false;
            let position = 0;
            let room = ServiceRoom.getTkRoom();
            if(updateEvent.stream.extensionId !== undefined && updateEvent.stream.extensionId.split(':')[0] === room.getMySelf().id && updateEvent.stream.getAttributes().filename==="" ){
                that.setProgress(updateEvent.stream, false);
            } else {
                if (updateEvent.stream.getAttributes().position !== undefined) {
                    position = updateEvent.stream.getAttributes().position;
                    this.setState({
                        startTime: position
                    });
                    this.stopTimer();
                    this.startTimer(position);
                }

                //let position = updateEvent.stream.getAttributes().position;
                if (attrs.pause !== undefined) {
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

	};

    handlerRoomConnected(roomEvent){
        let that = this;
        let streams = roomEvent.streams;
        for(let i=0;i<streams.length;i++){
            let stream = streams[i];

            if(stream.getAttributes().type==="media") {
                let filename = stream.getAttributes().filename;
                if(filename===""){
                    that.setDurationAndPos(stream);
                } else {
                    let index = filename.lastIndexOf(".") ;
                    let filesuxx = filename.substring(index+1);
                    if(TkUtils.getFiletyeByFilesuffix(filesuxx)==="mp4")
                    {
                        that.setDurationAndPos(stream);
                    }
                }
            }
        }
    }

	//关闭视频文件
    closeMediaVideo(){

        let that = this;
        let stream = that.state.stream;
        let media=that.refs.video;

        //连接地址修改为空
        //this.refs.video.src ='';

        if(stream && stream.extensionId){
            //stream.hide();
            ServiceSignalling.unpublishMediaStream(stream); //取消发布
        }
    }

    handlerStreamRemoved(streamEvent){
        let that = this;
        TkUtils.tool.exitFullscreen();
        if(!streamEvent.stream.video)  //mp3,动态PPT 直接返回
        {
            return;
        }

        let isTeacher = that.state.isTeacher;
        let stream = streamEvent.stream;
        if (stream != undefined ) {
            //视频停止播放
            stream.hide();
            //连接地址修改为空
            this.refs.video.src = '';
            that.stopTimer();
            this.setState({
                stream: undefined,
                open: false,
                startTime:0         //重置0
            });


            //dispatch 分发一个取消发布成功事件
            if(isTeacher) {
                //let extensionId = ServiceRoom.getTkRoom().getMySelf().id + ":media";
                if(stream.getAttributes().filename!="" ) {
                    let playMediaUnpublishSucceedData = {
                        stream: stream
                    };
                    eventObjectDefine.CoreController.dispatchEvent({
                        type: 'playMediaUnpublishSucceed',
                        message: playMediaUnpublishSucceedData
                    });
                }
            }

            if (stream.getAttributes().filename != "") {

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

        }
	}

    handlerStreamPublishFail(streamEvent){
        let that = this;
        if(!streamEvent.stream.video)  //mp3,动态PPT 直接返回
            return;

        let isTeacher = that.state.isTeacher;
        let stream = streamEvent.stream;
        if (stream !== undefined && stream.extensionId !== undefined ) {
            let extensionId = ServiceRoom.getTkRoom().getMySelf().id + ":media";
            if(stream.getAttributes().filename!="" ) {
            //if (stream.getAttributes().filename !== "") {
                //dispatch 分发一个发布失败事件
                if(isTeacher) {
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

        }
    }

    handlerStreamUnpublishFail(streamEvent){
        let that = this;
        let isTeacher = that.state.isTeacher;
        if(!streamEvent.stream.video)  //mp3,动态PPT 直接返回
            return;
        let stream = streamEvent.stream;
        if (stream != undefined && stream.extensionId != undefined ) {
            let extensionId = ServiceRoom.getTkRoom().getMySelf().id + ":media";
            if(stream.getAttributes().filename!="" ) {
            //if (stream.getAttributes().filename != ""){
                if(isTeacher) {
                    //dispatch 分发一个取消发布失败事件
                    let playMediaUnpublishFailData = {
                        stream: stream
                    };
                    eventObjectDefine.CoreController.dispatchEvent({
                        type: 'playMediaUnpublishFail',
                        message: playMediaUnpublishFailData
                    });
                }
            }
        }
    }

    handlerStreamFailed(streamEvent){
        let that = this;
        /*type: 'stream-failed',
            msg:{reason:'Subscribing stream failed after connection' , source:'subscribe'} ,
        stream:stream }*/
        if(!streamEvent.stream.video)  //mp3,动态PPT 直接返回
            return;
        let msg = streamEvent.message;
        let stream = streamEvent.stream;

            if (stream != undefined && stream.extensionId && stream.getAttributes().filename == "") {
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

            if (msg != undefined && msg.source == 'subscribe') {  //取消发布
                if (stream != undefined && stream.extensionId) {
                    ServiceSignalling.unpublishMediaStream(stream); //取消发布
                }
            }
    }
    _handlerVolumeMute(){//点击喇叭图标 静音和恢复音量
        const that = this ;
        let media=that.refs.video;
        media.muted = !media.muted ;
        if(media.muted){
            media.volume = 0;
            that.setState({
                volume:0 ,
                volumeButtonStyle:'muted'
            });
        }else{
            media.volume = 1;
            that.setState({
                volume:100,
                volumeButtonStyle:''
            });
        }
    };
	
    render() {
        let that = this;
    	let test = that.state.open ;
    	//let title = this.state.stream?this.stream.getAttributes().filename:'';
    	let closeStyle = !that.state.isTeacher?'none':(that.state.close?'block':'none');
    	let zIndex = that.state.title!=""?119:151;
        let { volumeButtonStyle } = that.state ;
    	return(
    		<div id="video-box" ref="mp4"  style={{display:this.state.open?'block':'none' , zIndex:zIndex}}  >
	    		<div id="mp4">
	    			
	    			<div className="video-play" style={{height:TkGlobal.playback?'100%':undefined}}>
	    				<video  ref="video" id="uploaded-video" className="video-js" preload="auto" >
		    				{/*<source  ref="video" type="video/mp4"/> 测试 播放地址src="https://192.168.1.17:443/upload/20170811_111901_dlyzsowh-1.mp4"*/}
		    			</video>
	    			</div>

                    <button  className="close" onClick={this.closeMediaVideo.bind(this)} style={{display:closeStyle}}></button>
		    		<div className="video-controller" style={{display:TkGlobal.playback?'none':undefined}}>
							
						<div className="video-func-btn-container clear-float">
							<div className="play-container" ref = "progressDiv">
								<ReactSlider disabled={!this.state.isTeacher} ref="progressBar" defaultValue={0}  withBars value={this.state.progress} onBeforeChange={this.progressOnBeforeChange.bind(this)} onAfterChange={this.progressOnAfterChange.bind(this)} />
							</div>
							
							<span className="button-left add-fl" onClick={this.playPause.bind(this)}>
								<button style={{display:!this.state.isTeacher?'none':'block'}} ref="playPauseBtn" className="playing-btn" id="play_pause_btn"></button>
							</span>
							<span className="button-right add-fr clear-float">
								<span className="video-time add-fl">
									<time ref="currentVideoTime" className="curr-play-time"></time>/<time id = "total-play-time" ref="totalVideoTime" className="total-play-time"></time>
								</span>
								<button  className={"volume-btn add-fl yes " + volumeButtonStyle} onClick={that._handlerVolumeMute.bind(that) } ></button>
								<span id="video_volume_slide" className="volume-bar-container add-position-relative add-fl ui-slider ui-corner-all ui-slider-horizontal ui-widget ui-widget-content">
									<ReactSlider  defaultValue={100} withBars  value={this.state.volume} onChange = {this.volumeOnAfterChange.bind(this)}   />
								</span>
								<button onClick={this.videoMediaFullScreen.bind(this)} className="full-btn no add-fl"></button>
							</span>
							
							
						</div>
   					
			   		 </div>
		    	</div>
		    	
		    </div>
		    	
    	)
    	
    }
};

export default Video;