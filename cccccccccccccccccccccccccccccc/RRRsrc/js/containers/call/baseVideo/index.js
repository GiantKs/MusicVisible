import React, { Component } from 'react';
import eventObjectDefine from 'eventObjectDefine';
import TkGlobal from 'TkGlobal';
import TkUtils from 'TkUtils';
import ServiceTooltip from 'ServiceTooltip';
import CoreController from 'CoreController' ;

class Video extends Component{
	constructor(props,context){
		super(props,context);
		this.state={
			pullUrl:''
		};
		this.player = undefined;
	}

    componentDidMount(){
		let that = this;
		if(that.props.pullUrl!=="")
        	that.videoHls(that.props.pullUrl);
        eventObjectDefine.CoreController.dispatchEvent({type:'receiveStreamComplete' ,message:{right:true} });
    }

    handlerOnDoubleClick(event){ //双击视频全屏
        if(! CoreController.handler.getAppPermissions('dblclickDeviceVideoFullScreenRight')){return ; } ;
        //let targetVideo = document.getElementById('player');
        let targetVideo = this.refs.hisPlayer;
        if(targetVideo){
            if( TkUtils.tool.isFullScreenStatus() ) {
                TkUtils.tool.exitFullscreen(targetVideo);
            }else{
                TkUtils.tool.launchFullscreen(targetVideo);
            }
        }
        event.stopPropagation();
        return false;
    };

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
		
		let videoType = "hls";
        let requestArgs = getRequestArgs();
		for(let idx in requestArgs) {
			switch(idx) {
				case "type": {
					videoType = requestArgs[idx];
				}; break;
			}		
		}
	
		/*if(Clappr.isSupportMSE()) {
			logDebug( "MSE is supported." );
		} else {
			logDebug( "MSE is unsupported." );
		}	
		logDebug("videoType=" + videoType);*/

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
						parentId:"#player", disableVideoTagContextMenu:true, autoPlay:true,
						//logoPos:"right", logoLinkUrl: "http://www.baidu.com",
						logo:"http://smep.s.wcsapi.biz.matocloud.com/linxj/sinar2/WS3.png",
						playerSkinType: 1, enableSetting: false, muted: false, videoType: "flv", 
								
						//liveCutFlag: false, liveCutPlayerUrl: "http://vodflv.haplat.net/static/load/ad/advert1_mp4_10s.mp4",					
						video: "http://ovplive.haplat.net/test1/2b0b0a8a042f419dbef98e1dfe42469d.flv"
						//isLive: false, video: "http://192.168.15.34/h5Player/flv/KongFu.Panda.400kbps.flv"
					};
					flvparam.callbacks = callbacks;
					h5player = new Clappr.Player( flvparam );
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

    render(){
        let that = this;
        return(
			<div className="clear-float video-participants-vessel">
				<div id="video_container_live" className="video-chairman-wrap"  onDoubleClick={that.handlerOnDoubleClick }> {/*老师类名:video-chairman-wrap*/}
					<div  className="video-permission-container add-position-relative clear-float">
						<div  className="video-wrap  participant-right video-participant-wrap add-position-relative" >
							<div className="live-broadcast" id="player" ref="hisPlayer" style={{height:'100%'}} />
						</div>
					</div>
				</div>
			</div>

        )
    }
}
export default Video
