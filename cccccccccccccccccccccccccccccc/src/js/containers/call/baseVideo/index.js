import React, { Component } from 'react';
import eventObjectDefine from 'eventObjectDefine';
import TkGlobal from 'TkGlobal';
import TkUtils from 'TkUtils';
import ServiceTooltip from 'ServiceTooltip';
import CoreController from 'CoreController' ;
import TkConstant from 'TkConstant';
import ServiceRoom from 'ServiceRoom'

class Video extends Component{
	constructor(props,context){
		super(props,context);
		this.state={
			pullUrl:'',
			areaExchangeFlag: false,
            isShareStraem: false,
			//startTime:undefined,
            //endTime:undefined,
            //currTime:undefined,
		};

		this.player = undefined;
		this.areaExchange = false;
		this.currTime = this.props.startTime;
		this.media = undefined;
		this.listernerBackupid = new Date().getTime()+'_'+Math.random();
	}


    componentDidMount(){
		let that = this;
		//let {pullWidth,pullHeight} = TkUtils.getWidthAndHeight(this.props.roomVideoType);

        if(that.props.pullUrl!=="" || this.props.rtmpUrl!==""){

            if(this.props.playType === "flash") {
                //let videoWidth = that.refs.broadCastVideo.parentNode.parentNode.parentNode.offsetWidth;
                //let videoHeight = that.refs.broadCastVideo.parentNode.parentNode.parentNode.offsetHeight;

                //let videoContainerConfiguration = that.resizeVideoByScalc(videoWidth,videoHeight);
                broadcastInit('100%','100%',that.props.rtmpUrl);
            } else
                that.videoHls(that.props.pullUrl);

        }

        eventObjectDefine.Window.addEventListener( TkConstant.EVENTTYPE.WindowEvent.onResize , that.handlerOnResize.bind(that) , that.listernerBackupid );
        eventObjectDefine.CoreController.dispatchEvent({type:'receiveStreamComplete' ,message:{right:true} });
		eventObjectDefine.CoreController.addEventListener( 'areaExchange', that.handlerAreaExchange.bind(that) ,that.listernerBackupid  ); // 区域交换事件监听
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that), that.listernerBackupid); //roomDelmsg事件 下课事件 classBegin
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPubmsg , that.handlerRoomPubmsg.bind(that), that.listernerBackupid); //roomPubmsg事件 桌面共享事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomMsglist, that.handlerRoomMsgList.bind(that), that.listernerBackupid);//开始后进入
		eventObjectDefine.CoreController.addEventListener( 'playbackControl_seek_position' , that.handlerPlaybackControl_seek_position.bind(that)  , that.listernerBackupid );//直播回放拖动当前位置
        eventObjectDefine.CoreController.addEventListener( 'playbackControl_pause_play' , that.handlerPlaybackControl_pause_play.bind(that)  , that.listernerBackupid );//直播暂停和播放事件

        //that.setState({currTime:positionTime});
		if(TkGlobal.playback) {
            that.media = that.refs.liveVideo;
            that.media.addEventListener("canplay", function () {
                    if (TkGlobal.liveRoom === undefined)
                        return;
                    TkGlobal.liveRoom.temporarilyPause(false);
                }
            );
            //that.setState({currTime:positionTime});
            that.media.addEventListener("waiting", function () {
                    if (TkGlobal.liveRoom === undefined)
                        return;
                    TkGlobal.liveRoom.temporarilyPause(true);
                }
            );
        }
    }



    componentDidUpdate(prevProps , prevState ){
        let that = this;
        if(prevProps.pullUrl !== this.props.pullUrl || this.props.rtmpUrl!==prevProps.rtmpUrl){

            //if(that.props.ieKernel){
            /*if(!Clappr.isSupportMSE()) {
                broadcastInit(that.props.rtmpUrl);
            } else*/
            //    that.videoHls(that.props.pullUrl);
        }

	}
	
	componentWillUnmount(){
        eventObjectDefine.CoreController.removeBackupListerner(this.listernerBackupid );
        eventObjectDefine.Window.removeBackupListerner(this.listernerBackupid);
	}
	
	handlerAreaExchange(){
        this.setState({
            areaExchangeFlag: !this.state.areaExchangeFlag,
        });
    }

    handlerOnResize(recvEvent){
        /*let parentWidth = this.refs.broadCastVideo.parentNode.parentNode.parentNode.offsetWidth;
        let parentHeight = this.refs.broadCastVideo.parentNode.parentNode.parentNode.offsetHeight;
        let fatherContainerConfiguration = this.resizeVideoByScalc(parentWidth,parentHeight,0,0);
        this.refs.broadCastVideo.childNodes[0].style.width = fatherContainerConfiguration['width'];
        this.refs.broadCastVideo.childNodes[0].style.height = fatherContainerConfiguration['height'];
        this.refs.broadCastVideo.childNodes[0].style.marginTop = fatherContainerConfiguration['marginTop'];
        this.refs.broadCastVideo.childNodes[0].style.marginLeft = fatherContainerConfiguration['marginLeft'];*/
    };

    /*视频大小根据比例自适应*/
    resizeVideoByScalc(parentWidth,parentHeight){
        let watermarkVideoScalc = 16/9;

        let videoContainerConfiguration = {} ;
        let width = 0 , height = 0  , minWidth = 320 , minHeight = 240;

        if(parentHeight*watermarkVideoScalc < parentWidth ){
            width = Math.round( parentHeight * watermarkVideoScalc ) ;
            height =  Math.round( parentHeight ) ;
            videoContainerConfiguration['top'] = 0  + '%' ;
            videoContainerConfiguration['left'] = 50  + '%';
            videoContainerConfiguration['marginTop'] = 0  + 'px' ;
            videoContainerConfiguration['marginLeft'] = (parentWidth- width )/2+ 'px'  ;
            videoContainerConfiguration['width'] = width + 'px';
            videoContainerConfiguration['height'] = height + 'px';
        }else{
            width = Math.round( parentWidth  )  ;
            height = Math.round( parentWidth /watermarkVideoScalc )  ;

            videoContainerConfiguration['top'] = 50  + '%' ;
            videoContainerConfiguration['left'] = 0  + '%';
            videoContainerConfiguration['marginTop'] =  (parentHeight-height)/2 + 'px' ;
            videoContainerConfiguration['marginLeft'] =  0+'px' ;
            videoContainerConfiguration['width'] = width+ 'px' ;
            videoContainerConfiguration['height'] = height + 'px';
        }

        return videoContainerConfiguration;

    }

    handlerRoomDelmsg(recvEventData){
        const that = this ;
        let pubmsgData = recvEventData.message ;
        switch(pubmsgData.name)
        {

			case "ClassBegin":{
                onCloseHandler();
                break;
			}
        	case "LiveShareStream":{

                //onCloseHandler();
                //let {pullWidth,pullHeight} = TkUtils.getWidthAndHeight(this.props.roomVideoType);
                //broadcastInit(pullWidth,pullHeight,that.props.rtmpUrl);
                if(this.areaExchange)
                    that.handleAreaExchange();
                that.setState({
                    isShareStraem: false,
                })

                break;
            }
        }
    }

    handlerRoomPubmsg(recvEventData){
        const that = this ;
        let pubmsgData = recvEventData.message ;
        switch(pubmsgData.name)
        {
        	case "LiveShareStream": {

                //broadcastInit("1280","720",that.props.rtmpUrl);
                if(!this.areaExchange)
                    that.handleAreaExchange();
                that.setState({
                    isShareStraem: true,
                })
                break;
			}
			case "ClassBegin": {
				// Log.debug('上课了');
				setTimeout(()=>{document.head.getElementsByTagName('title')[0].innerHTML = ServiceRoom.getRoomName();},2000)
				//document.head.getElementsByTagName('title')[0].innerHTML = ServiceRoom.getRoomName(); //设置title为房间名字
			}
        }
    }

    handlerRoomMsgList(recvEventData){
        const that = this;
        let pubmsgData = recvEventData.message;
        let users =ServiceRoom.getTkRoom().getMySelf();
        for(let i=0;i<pubmsgData.length;i++){
            let data = pubmsgData[i];
            if(data.name === "LiveShareStream"){
                if(users.role !== TkConstant.role.roleChairman){
                    if(!this.areaExchange)
                        that.handleAreaExchange();
                    that.setState({
                        isShareStraem: true,
                    })
                }


            }else if(data.name === "ClassBegin"){
				document.head.getElementsByTagName('title')[0].innerHTML = ServiceRoom.getRoomName(); //设置title为房间名字
			}
        }
    }



    handlerPlaybackControl_pause_play(recvEventData){ //回放暂停，播放
        const that = this ;
        let {play} = recvEventData.message ;
        //let media=that.refs.liveVideo;


        if(play){ //播放
            L.Utils.mediaPlay(that.media);
		} else{ //暂停
            L.Utils.mediaPause(that.media);
		}
        that.setState({play:play});
	}

    handlerPlaybackControl_seek_position(recvEventData){
        const that = this ;
        let {positionTime} = recvEventData.message ;
        //let media=that.refs.liveVideo;
        let currentTime = (positionTime-that.props.startTime)/(that.props.endTime-that.props.startTime)*that.media.duration;
        that.media.currentTime = currentTime.toFixed(3);
        that.currTime = positionTime;

	}

    handlerOnDoubleClick(event){ //双击视频全屏

		if(! CoreController.handler.getAppPermissions('dblclickDeviceVideoFullScreenRight')){return ; } ;
        //let targetVideo = document.getElementById('player');
        let targetVideo = this.refs.flashCom;
        if(targetVideo){
            if( TkUtils.tool.isFullScreenStatus(targetVideo) ) {
                TkUtils.tool.exitFullscreen(targetVideo);
            }else{
                TkUtils.tool.launchFullscreen(targetVideo);
            }
        }
        event.stopPropagation();
        return false;
    };


    /*videoFlash(){
        function initSwf(){
            let swfVersionStr = "11.3.0"; // flash版本号
            let xiSwfUrlStr = "playerProductInstall.swf";

            // json对象，为flash传递一些初始化信息
            let flashvars = {};

            // 设置flash的样式
            let params = {};
            params.quality = "high";             // video开启平滑处理时要求设置为高品质
            params.bgcolor = "#000000";          // swf容器的背景色，不影响网页背景色
            params.wmode = "transparent";
            params.allowFullScreen = "true";     // 是否允许全屏
            params.AllowScriptAccess = "always"; // 是否允许跨域
            params.allowFullScreenInteractive = "true"; // 是否允许带键盘交互的全屏


            // 嵌入flash完成时的object标签的ID，name等属性
            let attributes = {};
            attributes.id = "cloudvPlayer";
            attributes.name = "cloudvPlayer";
            attributes.align = "middle";

            //embedSWF 参数解释：
            // 参数1：swf 文件地址
            // 参数2：swf 文件容器
            // 参数3：flash 的宽度
            // 参数4：flash 的高度
            // 参数5：正常播放该 flash 的最低版本
            // 可选参数信息：
            // 参数6：版本低于当前要求时，执行该 swf 文件，跳转到官方下载最新版本的 flash 插件
            // 参数7：为flash传递一些参数信息
            // 参数8：设置flash的样式
            // 参数9：嵌入flash完成时的object标签的ID，name等属性
            // 参数10：定义一个在执行embedSWF方法后，嵌入flash成功或失败后都可以回调的 JS 函数

            swfobject.embedSWF("cloudvPlayer.swf", "flashContent", '100%', '100%', swfVersionStr, xiSwfUrlStr, flashvars, params, attributes);
            swfobject.createCSS("#flashContent", "display:block; text-align:left; background-color: #000000;");
        }
        // 网页准备就绪
        $(document).ready(readyLoadSwf);

        // 网页加载完毕，开始加载播放器
        function readyLoadSwf() {
            initSwf();
            //loadWsPlayerComplete();
        }
        // 播放器加载完毕，播放器通知回调接口
        function loadWsPlayerComplete() {
            onPlayHandler();
            console.warn( "loadWsPlayerComplete!" );
        }

        //播放入口
        function onPlayHandler() {
            let args = {
                url: "rtmp://pull.talk-cloud.com/live/edede5700927488c8853a56121a560df",
                isLive: true, videoType: "rtmp"
            };
            // cloudvPlayer为播放器初始化中的attributes.id值
            let a =  thisMapMovie("cloudvPlayer") ;
            thisMapMovie("cloudvPlayer").jsPlay(args);
        }

        // 获取播放器对象
        function thisMapMovie(movieName) {
            if (window.document[movieName]) {
                return window.document[movieName];
            }
            if (navigator.appName.indexOf("Microsoft Internet") == -1) {
                if (document.embeds && document.embeds[movieName]) return document.embeds[movieName];
            } else {
                return document.getElementById(movieName);
            }
        }

        function onCloseHandler() {
            thisMapMovie("cloudvPlayer").jsClose();
        }

        function wsPlayerLogHandler(log, obj) {
            console.log( log );
            if(obj) {
                for(let id in obj) {
                    console.log( id + ":" + obj[id] );
                }
            }
        }

    }*/
	videoHls(pullurl){//视频直播  网宿代码   //拉流地址
		function getRequestArgs() {
            let url = location.search;
            let reqArgs = new Object();
			if(url.indexOf("?") != -1) {
                let turl = url.substr(1);
                let args = turl.split("&");
				for(let i=0; i<args.length; i++) {
					 reqArgs[args[i].split("=")[0]] = unescape(args[i].split("=")[1]);
				}
			}   
			return reqArgs; 
		}
		
        //let videoType = "hls";
        let videoType = this.props.playType;
        let requestArgs = getRequestArgs();
		for(let idx in requestArgs) {
			switch(idx) {
				case "type": {
					videoType = requestArgs[idx];
				}; break;
			}		
		}
	
		/*if(Clappr.isSupportMSE()) {
			//logDebug( "MSE is supported." );
		} else {
            //videoType = 'hls';
			//logDebug( "MSE is unsupported." );
		}	*/
		//logDebug("videoType=" + videoType);

        let h5player = undefined;
        let callbacks = {
			//log: logDebug,
			video: videoCallBack,
			error: videoErrorCallback,
			progress: progressCallback,
			timeUpdate: timeupdateCallback,
		};
		switch(videoType) {
			case "vod": 
			case "vod1": 
			case "vod2": 
			case "vod3":
			case "vod4": {
                let vodParam = {
					parentId:"#player", disableVideoTagContextMenu:true, autoPlay:true,
					logoPos:"left", logoLinkUrl: "http://www.baidu.com",
					logo:"http://smep.s.wcsapi.biz.matocloud.com/linxj/sinar2/WS3.png",
					playerSkinType: 1, enableSetting: false, muted: false, 
					
					video: "http://192.168.15.34/lxj/mp4/test1/test1.mp4",
					
					//前贴/中贴/后贴广告
					//beforeAd:{ src:"http://vodflv.haplat.net/static/load/ad/advert1_mp4_10s.mp4", url:"http://www.baidu.com" },
					//afterAd: { src:"http://vodflv.haplat.net/static/load/ad/advert1_mp4_10s.mp4", url:"http://www.baidu.com" },
					//midAd:{ src:'http://www.roctoday.com.cn/portfolio/brand/images/chinanet-01.jpg',duration:10,start:0.2,url:"http://www.baidu.com"},
					
					/*list:{
						0:{ videoType:'vod', videoClaritySwitchID:2, title:"列表0", duration:10,
							url:"http://192.168.15.34/lxj/mp4/test1/test1.mp4",
							originalClarityUrl:"http://192.168.15.34/lxj/mp4/test1/test1_original.mp4",
							fluencyClarityUrl:"http://192.168.15.34/lxj/mp4/test1/test1_fluency.mp4",
							hdClarityUrl:"",
							superClarityUrl:"",
							cover:"http://tpic.home.news.cn/newsVideo/video/videoStore/videoPic/2016/8/d8c2eafd90c266e19ab9dcacc479f8af-b-1.png"
						},
						1:{ videoType:'vod', videoClaritySwitchID:3, title:"列表1", duration:10,
							url: "http://192.168.15.34/lxj/mp4/test2/test2.mp4",
							originalClarityUrl: "http://192.168.15.34/lxj/mp4/test2/test2_original.mp4",
							fluencyClarityUrl: "http://192.168.15.34/lxj/mp4/test2/test2_fluency.mp4",
							standardClarityUrl: "http://192.168.15.34/lxj/mp4/test2/test2_standard.mp4",
							hdClarityUrl:"",						
							cover:"http://tpic.home.news.cn/newsVideo/video/videoStore/videoPic/2016/1/82067a40efb614b52b09cfb62c45918c-b-1.png"
						},
						2:{ videoType:'vod', videoClaritySwitchID:2, title:"列表2", duration:10,
							url: "http://192.168.15.34/lxj/mp4/test3/test3.mp4",
							originalClarityUrl: "http://192.168.15.34/lxj/mp4/test3/test3_original.mp4",
							fluencyClarityUrl: "http://192.168.15.34/lxj/mp4/test3/test3_fluency.mp4",
							hdClarityUrl:"",
							superClarityUrl:"",
							cover:"http://tpic.home.news.cn/newsVideo/video/videoStore/videoPic/2016/8/d8c2eafd90c266e19ab9dcacc479f8af-b-1.png"
						}		
					}*/
				};
				if(videoType != "vod4") {
					/*vodParam.levelConfig = {
						labels: {
							//0: '默认',
							1: '原画',
							2: '流畅',
							3: '标清',
							//4: '高清',
							5: '超清'
						},
						urls:{
							//0: "http://192.168.15.34/lxj/mp4/test1/test1.mp4",
							1: "http://192.168.15.34/lxj/mp4/test1/test1_original.mp4",
							2: "http://192.168.15.34/lxj/mp4/test1/test1_fluency.mp4",
							3: "http://192.168.15.34/lxj/mp4/test1/test1_standard.mp4",
							//4: "http://192.168.15.34/lxj/mp4/test1/test1_high.mp4",
							5: "http://192.168.15.34/lxj/mp4/test1/test1_super.mp4",
						},
						currentLevel: 3
					};*/
				}			
				if(videoType == "vod1") {
					vodParam.beforeAd = { src:"http://vodflv.haplat.net/static/load/ad/advert1_mp4_10s.mp4", url:"http://www.baidu.com" };
				} else if(videoType == "vod2") {
					vodParam.afterAd = { src:"http://vodflv.haplat.net/static/load/ad/advert1_mp4_10s.mp4", url:"http://www.baidu.com" };
				} else if(videoType == "vod3") {
					vodParam.beforeAd = { src:"http://vodflv.haplat.net/static/load/ad/advert1_mp4_10s.mp4", url:"http://www.baidu.com" };
					vodParam.afterAd = { src:"http://vodflv.haplat.net/static/load/ad/advert1_mp4_10s.mp4", url:"http://www.baidu.com" };
				}			
				vodParam.callbacks = callbacks;			
				h5player = new Clappr.Player( vodParam );		
			}; break;
			case "hls": {
                let hlsparam = {
                    control:false ,
					parentId:"#player", //播放器渲染的html元素，采用jquery语法
					disableVideoTagContextMenu:true, //是否显示播放器右键菜单
					autoPlay:true, //是否自动播放，手机端无效
					playerSkinType: 1, //播放器皮肤，1-默认、2-典雅、3-经典、4-炫酷
					enableSetting: false, //是否开始设置交互面板（画面比例切换、亮度、对比度、饱和度调节）
					muted: false, //是否静音
					//logo:url , //logo链接地址
					//logoLinkUrl:url ,
					enableResetAngle:false , //是否开启全屏视角切回默认视角
					enableErrorHint: true, //是否开启hls流异常提示显示框
					isLive:true , //是否直播
					videoType:'hls' , //hls-指定采用hls模块播放，flv/hdl指定采用flv模块播放
					errorHintInfo: TkGlobal.language.languageData.broadcast.errorHintInfo, //流异常提示显示框中显示内容
					video:pullurl , //视频地址，绝对地址
					hideVolumeBar:true , //是否半隐藏当前音量栏
					language:TkGlobal.language.name === 'chinese'?1 : 2 , //中英文选择，1-默认中文、2-英文
                    enableControlBar:false,
				};
				hlsparam.callbacks = callbacks;
				if(h5player==undefined)
					h5player = new Clappr.Player( hlsparam );
				if(h5player && h5player.setVolume){
                    h5player.setVolume(100);
				}
			}; break;
		    case "flv": {
				if(Clappr.isSupportMSE()) {
                    let flvparam = {
						parentId:"#player",
						//logoPos:"right", logoLinkUrl: "http://www.baidu.com",
                        //logo:"http://smep.s.wcsapi.biz.matocloud.com/linxj/sinar2/WS3.png",
                        playerSkinType: 1,
						enableSetting: false,
						muted: false,
						videoType: "flv",

                        //liveCutFlag: false, liveCutPlayerUrl: "http://vodflv.haplat.net/static/load/ad/advert1_mp4_10s.mp4",
                        //video: "http://ovplive.haplat.net/test1/2b0b0a8a042f419dbef98e1dfe42469d.flv"
                        control:false ,
                        disableVideoTagContextMenu:true, //是否显示播放器右键菜单
                        autoPlay:true, //是否自动播放，手机端无效

                        //logo:url , //logo链接地址
                        //logoLinkUrl:url ,
                        enableResetAngle:false , //是否开启全屏视角切回默认视角
                        enableErrorHint: true, //是否开启hls流异常提示显示框
                        isLive:true , //是否直播
                        errorHintInfo: TkGlobal.language.languageData.broadcast.errorHintInfo, //流异常提示显示框中显示内容
                        video:pullurl , //视频地址，绝对地址
                        hideVolumeBar:true , //是否半隐藏当前音量栏
                        language:TkGlobal.language.name === 'chinese'?1 : 2 , //中英文选择，1-默认中文、2-英文
                        enableControlBar:false,
						//isLive: false, video: "http://192.168.15.34/h5Player/flv/KongFu.Panda.400kbps.flv"
					};
					flvparam.callbacks = callbacks;
                    if(h5player==undefined)
                        h5player = new Clappr.Player( flvparam );
                    if(h5player && h5player.setVolume){
                        h5player.setVolume(100);
                    }
				}
			}; break;
			case "vr": {
                let video360param = {
					parentId:"#player", disableVideoTagContextMenu:true, autoPlay:true,
					playerSkinType: 1, enableSetting: false, muted: false,	
					//logoPos:"right", logoLinkUrl: "http://www.baidu.com",
					logo:"http://smep.s.wcsapi.biz.matocloud.com/linxj/sinar2/WS3.png",
					
					video: "cool.mp4",				
					plugins: {
						container: [Video360]
					}
				};
				video360param.callbacks = callbacks;
				h5player = new Clappr.Player( video360param );
			}; break;
		};
		
		// callback
		receivePlayerCallback();
		function receivePlayerCallback(player) {
			if(player) {
				h5player = player;
			}
		};
		function videoCallBack(event, data) {
			//console.log("trigger event: " + event);
			switch(event) {
				case "loadedmetadata": {
					//console.log(data.videoWidth);   // data is video element
					//console.log(data.videoHeight);  // you can get all attribution of video tag
					//console.log(data.duration);     // notice: suggest to get readonly attributions
				}; break;
				case "waiting": {
					// no data
				}; break;
				case "playing": {
					// no data
				}; break;
				case "pause": {
					// no data
				}; break;
				case "ended": {
					// no data
				}; break;
				case "error": {
					// data is {code: 1/2/3/4}
					//console.log(data.code)
				}; break;
				case "seeking": {
					// data is current time of seek before
					//console.log("before seek time: " + data);
				}; break;
				case "seeked": {
					// data is current time of seek after
					//console.log("after seek time: " + data);
				}; break;
				case "fullscreen": {
					// data is isFullscreen(value of bool)
					//console.log("fullscreen: " + data);
				}; break;
			}
		}
		function videoErrorCallback(errCode, errMsg) {
			//logDebug( "errCode=" + errCode + ", errMsg=" + errMsg);
		};
		function timeupdateCallback(tobj) {
			//console.log( tobj );
		}

		function progressCallback(pobj) {
			//console.log( pobj );
		}
			
	}

	handleAreaExchange(){

        this.areaExchange = !this.areaExchange;

        eventObjectDefine.CoreController.dispatchEvent({//自己本地改变拖拽的video位置
            type:'areaExchange',
            message: {
                hasExchange: this.areaExchange,
            }
        });
        let defalutFontSize = window.innerWidth / TkConstant.STANDARDSIZE ;
        setTimeout(function(){
            eventObjectDefine.Window.dispatchEvent({ type:TkConstant.EVENTTYPE.WindowEvent.onResize , message:{defalutFontSize:defalutFontSize} });
        }, 20);

    }


    render(){
        let that = this;

        return(
			<div  className={"clear-float video-participants-vessel " + (this.state.areaExchangeFlag ? 'areaExchange' : '')}  onChange={that.handleOnChange}>
				<div id="video_container_live" className="video-chairman-wrap"  onDoubleClick={that.handlerOnDoubleClick }> {/*老师类名:video-chairman-wrap*/}
					<div data-video="false"  className="video-permission-container add-position-relative clear-float">
						<div ref="broadCastVideo" className="video-wrap  participant-right video-participant-wrap add-position-relative" >

							{/*<div className="video-hover-function-container">
								<span className="button-set role-student" onDoubleClick={ (e) => { e.stopPropagation(); return false ; } } >
								<button className="areaExchange-btn"
										onClick={this.handleAreaExchange.bind(this)}
								> {TkGlobal.language.languageData.otherVideoContainer.button.areaExchange.text} </button>;
								</span>
							</div>*/}

							<div id="flashContent"  style={{display:!TkGlobal.playback && that.props.ieKernel?'block':'none',width:'100%', height:'100%'}}>
                                <object type="application/x-shockwave-flash" id="cloudvPlayer" name="cloudvPlayer"  data="cloudvPlayer.swf" style={{display:that.props.ieKernel?'block':'none',width:'100%', height:'100%'}} >

                                </object>
							</div>
							<div id="livePlayback_div" style={{display:TkGlobal.playback ?'block':'none',width:'100%', height:'100%'}}>
								<video id="livePlayback"  ref="liveVideo"  autoPlay="true" src={TkGlobal.liveVideoFile}></video>
							</div>

							<div className="live-broadcast" id="player" ref="hisPlayer" style={{display:TkGlobal.playback?"none":that.props.ieKernel?'none':'block',height:'100%'}}></div>}
						</div>
					</div>
				</div>
			</div>

        )
    }
}
export default Video
