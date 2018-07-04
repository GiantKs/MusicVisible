/**
 * 组合回放playback页面的控制条组件
 * @module PlaybackControlSmart
 * @description   提供组合回放playback页面的控制条组件
 * @author QiuShao
 * @date 2017/09/02
 */

'use strict';
import React from 'react';
import ReactSlider from 'react-slider';
import eventObjectDefine from 'eventObjectDefine' ;
import ServiceRoom from 'ServiceRoom' ;
import TkGlobal from 'TkGlobal' ;
import TkConstant from 'TkConstant' ;
import TkUtils from 'TkUtils' ;

/*Call页面*/
class PlaybackControlSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            startTime:0 , //开始的时间
            endTime:0 ,   //结束的时间
            currTime:0 ,   //当前播放的时间
            play:false ,  //是否正在播放 ,
            fullScreenState:false , //全屏状态
            progress:0 , //当前的播放进度
        };
        this.currTimeBackup = 0 ; //当前播放的时间的备份,非状态
        this.progressBackup = 0 ; //当前的播放进度的备份,非状态
        this.intervalNumber = 1000 ; //定时器时间间隔
        this.progressDraging = false ; //是否拖拽中
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this ;
        eventObjectDefine.Document.addEventListener(TkConstant.EVENTTYPE.DocumentEvent.onFullscreenchange , that.handlerOnFullscreenchange.bind(that)   , that.listernerBackupid); //document.onFullscreenchange事件
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPlaybackClearAll , that.handlerRoomPlaybackClearAll.bind(that) , that.listernerBackupid );
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPlaybackDuration , that.handlerRoomPlaybackDuration.bind(that) , that.listernerBackupid );
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPlaybackPlaybackEnd , that.handlerRoomPlaybackPlaybackEnd.bind(that) , that.listernerBackupid );
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPlaybackPlaybackUpdatetime , that.handlerRoomPlaybackPlaybackUpdatetime.bind(that) , that.listernerBackupid );
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPubmsg , that.handlerRoomPubmsg.bind(that) , that.listernerBackupid );
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that) , that.listernerBackupid );
    };

    componentDidUpdate(prevProps , prevState){ //在组件完成更新后立即调用,在初始化时不会被调用
        if(prevState.play !== this.state.play){
            eventObjectDefine.CoreController.dispatchEvent({type:'playbackControl_play_pause' , message:{play:this.state.play}});
        }
    }

    componentWillUnmount(){ //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        const that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid );
        eventObjectDefine.Document.removeBackupListerner(that.listernerBackupid );
        that._stopTimer();
    };

    handlerRoomPlaybackClearAll() { //回放清除信令
        if (!TkGlobal.playback) {L.Logger.error('No playback environment, no execution event[roomPlaybackClearAll] handler ');return;};
        eventObjectDefine.CoreController.dispatchEvent({type:TkConstant.EVENTTYPE.RoomEvent.roomPlaybackClearAllFromPlaybackController});
        if(!TkGlobal.isBroadcast) //交互
            ServiceRoom.getTkRoom().playbackClearAll();
    };

    handlerRoomPlaybackDuration(recvEventData){ //回放开始，结束时间
        const that = this ;

        let {startTime , endTime} = recvEventData.message ;
        that.progressBackup  = 0;
        that.currTimeBackup = startTime ;
        that.setState({startTime:startTime , endTime:endTime , currTime:startTime , progress:0 , play:true});
        that.handlerRoomPlaybackClearAll();
        that._startTimer();
    };

    handlerRoomPlaybackPlaybackEnd(){ //回放结束
        const that = this ;
        let {endTime} = that.state ;
        that.progressBackup  = 100;
        that.currTimeBackup = endTime ;
        that.setState({currTime:endTime , progress:100 , play:false});
        that._stopTimer();
    };

    handlerRoomPlaybackPlaybackUpdatetime(recvEventData){  //回放更新时间
        const that = this ;
        let {current} = recvEventData.message ;
        let currTime = !TkUtils.isMillisecondClass( current) ? current * 1000 : current ;
        let progress = that._getProgressByTimeDifference( currTime );
        that.currTimeBackup = currTime ;
        that.progressBackup  = progress;
        that.setState({currTime:currTime , progress:progress });
    };

    handlerOnFullscreenchange(){//全屏
        const that = this ;
        that.setState({fullScreenState: TkUtils.tool.getFullscreenElement() && TkUtils.tool.getFullscreenElement().nodeName.toLowerCase() == "body" });
    };

    handlerRoomPubmsg(recvEventData){ //获取时间ts
        return ;
        const that = this ;
        let {ts} = recvEventData.message ;
        let currTime = !TkUtils.isMillisecondClass( ts) ? ts * 1000 : ts ;
        let progress = that._getProgressByTimeDifference( currTime );
        that.currTimeBackup = currTime ;
        that.progressBackup  = progress;
        that.setState({currTime:currTime , progress:progress });
    };

    handlerRoomDelmsg(recvEventData){//获取时间ts
        return ;
        const that = this ;
        let {ts} = recvEventData.message ;
        let currTime = !TkUtils.isMillisecondClass( ts) ? ts * 1000 : ts ;
        let progress = that._getProgressByTimeDifference( currTime );
        that.currTimeBackup = currTime ;
        that.progressBackup  = progress;
        that.setState({currTime:currTime , progress:progress });
    };

    /*进度条更新事件完成后处理*/
    onAfterChangeProgressPlayback(progress , sendPlayOrPausePlayback = true){
        const that = this ;
        that.progressDraging = false ;
        let {startTime , endTime} = that.state ;
        let positionTime = parseInt( ( progress / 100 ) * (endTime - startTime) + startTime );
        that.progressBackup  = progress;
        that.currTimeBackup = positionTime ;
        if(positionTime > endTime){
            positionTime = endTime ;
            progress = 100 ;
        }else if(positionTime <= startTime){
            positionTime = startTime ;
            progress = 0 ;
        }
        that.currTimeBackup = positionTime ;
        that.progressBackup  = progress;

        if(!TkGlobal.isBroadcast)
            ServiceRoom.getTkRoom().seekPlayback(positionTime);
        else{ //
            if(TkGlobal.liveRoom === undefined)
                return;
            TkGlobal.liveRoom.seekPlayback(positionTime);
        }
        if(sendPlayOrPausePlayback  && !this.state.play){
            that.playOrPausePlayback(true , false);
        }
        eventObjectDefine.CoreController.dispatchEvent({type:'playbackControl_seek_position' , message:{positionTime:positionTime , progress:progress}});

        that.setState({currTime:positionTime , progress:progress});
    };

    /*进度条更新事件完成前处理*/
    onBeforeChangeProgressPlayback(progress){
        this.progressDraging = true ;
    };

    /*暂停回放处理*/
    playOrPausePlayback(play , handleProgress = true){
        const that = this ;
        if(play){
            if (handleProgress && this.state.progress >= 100) {
                that.setState({currTime:0 , progress:0 });
                that.onAfterChangeProgressPlayback(0 , false);
            }
            if(!TkGlobal.isBroadcast)
                ServiceRoom.getTkRoom().playPlayback();
            else { //直播
                if(TkGlobal.liveRoom === undefined)
                    return;
                TkGlobal.liveRoom.playPlayback();
            }

            that._startTimer();

        }else{
            if(!TkGlobal.isBroadcast)
                ServiceRoom.getTkRoom().pausePlayback();
            else{ //直播
                if(TkGlobal.liveRoom === undefined)
                    return;
                TkGlobal.liveRoom.pausePlayback();
            }
            that._stopTimer();

        }
        eventObjectDefine.CoreController.dispatchEvent({type:'playbackControl_pause_play' , message:{play:play}});
        that.setState({play:play});
    };

    /*回放全屏*/
    playbackFullScreen(element){
        if( TkUtils.tool.isFullScreenStatus() ){
            TkUtils.tool.exitFullscreen() ;
        }else{
            TkUtils.tool.launchFullscreen(element) ;
        }
    };

    /*改变回放进度*/
    onChangeProgressPlayback(changeProgress){
        const that = this ;
        if(that.progressDraging){
            that.progressBackup  = changeProgress;
        }
    };

    /*格式化时间*/
    _timeDifferenceToFormat(startTime , endTime){
        let clock = TkUtils.getTimeDifferenceToFormat(startTime , endTime) ;
        let timeStr = undefined ;
        if(clock){
            let {hh , mm , ss} = clock ;
            timeStr = mm+":"+ss ;
            if( !(hh == '0' || hh == '00' ) ){
                timeStr = hh+':'+timeStr ;
            }
        }
        return timeStr ;
    }

    _startTimer(){
        return ;
        const that = this ;
        clearInterval(that.timer) ;
        that.timer = setInterval( () => {
            let {endTime , startTime} = that.state ;
            let currTimeBackup = that.currTimeBackup ;
            currTimeBackup+=that.intervalNumber;
            if(currTimeBackup>endTime){
                currTimeBackup = endTime ;
            }else if(currTimeBackup<startTime){
                currTimeBackup = startTime ;
            }
            let progress = that._getProgressByTimeDifference(currTimeBackup , startTime , endTime );
            if(!that.progressDraging){
                that.progressBackup  = progress;
                that.currTimeBackup = currTimeBackup ;
                that.setState({currTime:currTimeBackup , progress:progress })  ;
            }else{
                that.currTimeBackup = currTimeBackup ;
                that.setState({currTime:currTimeBackup})  ;
            }
        } , that.intervalNumber );
    }

    _stopTimer(){
        return ;
        const that = this ;
        clearInterval(that.timer) ;
        that.timer = null ;
    };

    /*获取进度条*/
    _getProgressByTimeDifference(currTime ,startTime , endTime ){
        const that = this ;
        let progress = 0 ;
        startTime = startTime || that.state.startTime ;
        endTime = endTime || that.state.endTime ;
        let currTimeDifference = currTime-startTime ;
        let totalTimeDifference = endTime-startTime ;
        if(totalTimeDifference > 0){
            progress = Math.floor( currTimeDifference/ totalTimeDifference * 100  ) ;
        }
        if( currTimeDifference > totalTimeDifference){
            progress = 100 ;
        }
        if(progress<0){
            progress = 0 ;
        }
        if(progress>100){
            progress = 100 ;
        }
        return progress ;
    };

    render(){
        const that = this ;
        let { play   , startTime , endTime , fullScreenState  } = that.state ;
        let currTimeBackup = that.currTimeBackup ;
        let currTimeStr = that._timeDifferenceToFormat( startTime , currTimeBackup  );
        let totalTimeStr = that._timeDifferenceToFormat( startTime , endTime );
        return (
            <article className="video-controller video-controller-replay add-position-absolute-bottom0-left0"  id="replay_video_container" >
                <div  id="playback_video_progress_slide"  className="video-progress-bar-vessel add-position-absolute-top0-left0"  >
                    <ReactSlider   className={"tk-slide tk-playback-progress-slider"} defaultValue={0} withBars  value={that.progressBackup}  onChange={that.onChangeProgressPlayback.bind(that)} onAfterChange={that.onAfterChangeProgressPlayback.bind(that)} onBeforeChange={that.onBeforeChangeProgressPlayback.bind(that)} />
                </div>
                <div className="video-func-btn-container video-func-btn-container-replay clear-float add-position-absolute-bottom0-left0 ">
                    <span className="button-left add-fl">
                        <button className={"play-pause-btn "+(play?'pause':'play')} id="play_pause_btn_replay"  onClick={that.playOrPausePlayback.bind(that  , !play) }  ></button>
                    </span>
                    <span className="button-right add-fr clear-float">
                        <span className="video-time add-fl">
                            <time className="curr-play-time">{currTimeStr}</time>/<time className="total-play-time">{totalTimeStr}</time>
                        </span>
					    <button className="volume-btn yes add-fl add-display-none"></button>
                        <span  id="video_volume_slide_replay" className="volume-bar-container add-position-relative add-fl add-display-none">
                            <span className="volume-bar add-position-absolute-top0-left0">
                                <span className="curr-volume add-position-absolute-top0-left0">
                                </span>
                            </span>
                        </span>
					    <button className={"full-btn add-fl " +(fullScreenState?'yes':'no') }  onClick={that.playbackFullScreen.bind(that , document.body) } ></button>
				    </span>
                </div>
            </article>
        )
    }
};
export default  PlaybackControlSmart;