/**
 * 右侧内容-直播抽奖 Smart组件
 * @module responderStudentToolComponent
 * @description   抽奖组件
 * @author xiaguodong
 * @date 2017/11/27
 */

'use strict';
import React from 'react';
import TkGlobal from 'TkGlobal' ;
import TkConstant from 'TkConstant';
import eventObjectDefine from 'eventObjectDefine';
import ServiceRoom from 'ServiceRoom';
import ServiceSignalling from 'ServiceSignalling' ;
import { debug } from 'util';

class ProgrammShareSmart extends React.Component {
    constructor(props){
        super(props);
        this.state={
            modeStatuses: [false, false, false],
            programmShare:false,
            shareStream:undefined,
        };
        this.listernerBackupid =  new Date().getTime()+'_'+Math.random();
        this.isPublish = false;
        this.programmArray = [];    //可共享列表数组
        this.selectProgramm = undefined;

    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this;

        eventObjectDefine.CoreController.addEventListener("programmShare",that.handlerProgrammShare.bind(that));
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPlaybackClearAllFromPlaybackController,that.handlerRoomPlaybackClearAll.bind(that) , that.listernerBackupid); //roomPlaybackClearAll 事件：回放清除所有信令

    };

    handlerRoomPlaybackClearAll(){  //重置数据
        this.setState({
            modeStatuses: [false, false, false],
            programmShare:false,
            shareStream:undefined,
        });
        this.isPublish = false;
    };


    /*侦听工具箱桌面共享按钮事件*/
    handlerProgrammShare(){
        let that = this;
        for(let i = 0; i < this.state.modeStatuses.length; i++){
            if(this.state.modeStatuses[i]===true && i === 2){
                if(i === 0){
                    this.handlerProgrammShareSelect();  //获取可共享程序
                }else if(i === 2){
                    that.wsToggle(true);
                }
               
            }
        }
        that.handlerCreateStream();
        that.setState({
            programmShare:true
        });
    }


    handlerShareRegionClick(){
        let that = this;
    }

    handlerCreateStream(){//创建流
        let that = this;
        let eid = ServiceRoom.getTkRoom().getMySelf().id + ":screen";
        let stream = TK.Stream({
            audio: true,
            video: true,
            screen: true,
            data: false,
            extensionId: eid,
            attributes: {type: 'screen'},
        },true);
        
        that.setState({
            shareStream:stream
        })

    }

    /*桌面共享*/
    handlerShareFullScreenClick(){
        let that = this;

        //创建流
        that.handlerCreateStream();


        //推流
        that.upShareStream();

        var ws = {
            id: 0,
            mixSpk: false,
            mixMic: false,
            type:0
        };
        ServiceRoom.getTkRoom().updateWindowSource(ws); //更新窗口
        Log.error('桌面共享ws',ws);
        
        that.closeProgrammShare();  //关闭本页
    }


    clickCloseProgrammShare(){
        let that = this;
        that.closeProgrammShare();
        that.wsToggle(false);
    }

    //关闭
    closeProgrammShare(){
        let that = this;
        that.setState({
            programmShare:false,
        });
        that.isPublish = false;
        
    }
 
    wsToggle(t){  // t为开关
        let ws = {
            id:0,
            x: t ? window.innerWidth/2-200 : 0,
            y: t ? window.innerHeight/2-150 : 0,
            width: t ? 400 : 0,
            height:t ? 300 : 0,
            mixSpk: false,
            mixMic: false,
            type:0
        }

        ServiceRoom.getTkRoom().updateWindowSource(ws);  //1.更新窗口
        Log.error('区域共享ws',ws);
        
    }

    /*区域共享*/
    handlerShareAreaClick(){
        let that = this;

        //创建流
        that.handlerCreateStream();

        //推流
        that.upShareStream();

        that.closeProgrammShare();  //关闭本页

    }

    changeMode(type){  // type =>  0/1/2 : program/full/area
        if(type === 0 ){
            //程序共享
            this.wsToggle(false);   //关闭区域窗口
            this.handlerProgrammShareSelect();  //获取可共享程序
        }else if(type === 1 ){
            //桌面共享
            this.wsToggle(false);   //关闭区域窗口

        }else if(type === 2 ){
            //区域共享
            this.wsToggle(true);    //开启区域窗口
        }else {
            this.wsToggle(false);   //关闭区域窗口
            return ;
        }

        this.setState({
            modeStatuses: (Array.from(this.state.modeStatuses)).map((item, index) => index === type),
        });
    }

    next(){
        let activeMode = undefined;
        for(let i = 0; i < this.state.modeStatuses.length; i++){
            if(this.state.modeStatuses[i]===true){
                activeMode = i;
            }
        }
        if(activeMode === undefined)return;
        
        switch (Number(activeMode)) {
            case 0:     //程序共享
                // this.handlerProgrammShareClick()
                this.handlerProgrammShareSelectClick()
                break;
                
            case 1:     //桌面共享
                this.handlerShareFullScreenClick();
                break;
                
            case 2:     //区域共享
                this.handlerShareAreaClick();
                break;
        
            default:
                break;
        }
    }










    onComboBoxChanged(e){
        this.selectProgramm = this.refs.windowsel.value;
    }

    /*开始程序共享 暂时推桌面，区域，应用程序都用1280*720的分辨率，视频都用640*480的分辨率*/
    handlerProgrammShareSelectClick(){
        let that = this;
        //创建流
        // that.handlerCreateStream();
        
        //推流
        that.upShareStream();

        var ws = {
            id: this.selectProgramm,
            mixSpk: false,
            mixMic: false,
            type:1,
        };
        ServiceRoom.getTkRoom().updateWindowSource(ws);  //更新窗口
        Log.error('程序共享ws',ws);
        
        //关闭
        that.closeProgrammShare();
    }
    /*获取可共享的程序*/
    handlerProgrammShareSelect(){
        let that = this;
        
        ServiceRoom.getTkRoom().getValidWindowList(1,function (windowList) {//可共享程序列表
            if (!Array.isArray(windowList)) return;
            let windowsel = that.refs.windowsel;
            for(let index=0; index < windowList.length; index++)
            {
                let flag = false;
                for(let i=0;i<that.programmArray.length;i++){
                    if(that.programmArray[i].value === windowList[index].id ){
                        flag = true;
                        break;
                    }
                }
                if(!flag) {
                    let item = {};
                    item.value = windowList[index].id;
                    item.label = windowList[index].title;

                    that.programmArray.push(item);

                    let textData = windowList[index].title.indexOf("-") !== -1?windowList[index].title.split("-")[0]:windowList[index].title;

                    let optionItem = document.createElement("option");
                    //optionItem.style.width = "350px";
                    //optionItem.style.overflowX= "hidden";
                    optionItem.title = windowList[index].title;
                    optionItem.value = windowList[index].id;
                    optionItem.text = textData;
                    windowsel.options.add(optionItem);
                }
            }
            that.selectProgramm = that.programmArray[0].value;
            
        });
       
        // let refShare = that.refs.windowsel;
        // refShare.style.width="90%";
    }


    upShareStream(){
        //推流
        let that = this;
        if(that.state.shareStream !== undefined && !that.isPublish) {
            if(!TkGlobal.isBroadcast ){//交互 发布流
                ServiceSignalling.publishDeskTopShareStream(that.state.shareStream);
                let isDelMsg = false;
                let toID = "__all";
                let dot_not_save = false;
                let mySelf = ServiceRoom.getTkRoom().getMySelf();

                let data = {};
                data.type = -1;
                for(let i = 0; i < this.state.modeStatuses.length; i++){
                    if(this.state.modeStatuses[i]===true){
                        data.type = i;
                    }
                }
            Log.error('发送信令',data);
                ServiceSignalling.sendSignallingFromLiveShareStream(isDelMsg, mySelf.id, toID, data, dot_not_save);







            } else if(TkGlobal.isBroadcast && TkGlobal.isClient){ //直播且客户端
                
                ServiceRoom.getTkRoom().stopBroadcast(); //停止推流
                that.state.shareStream.create();
                ServiceRoom.getTkRoom().uninitBroadcast();
                ServiceRoom.getTkRoom().initBroadcast(TkConstant.joinRoomInfo.pushConfigure.RTMP,10,2,1280,720);
                ServiceRoom.getTkRoom().startBroadcast(that.state.shareStream.extensionId);
                let isDelMsg = false;
                let toID = "__all";
                let dot_not_save = false;
                let mySelf = ServiceRoom.getTkRoom().getMySelf();

                let data = {};
                data.type = -1;
                for(let i = 0; i < this.state.modeStatuses.length; i++){
                    if(this.state.modeStatuses[i]===true){
                        data.type = i;
                    }
                }
                
                ServiceSignalling.sendSignallingFromLiveShareStream(isDelMsg, mySelf.id, toID, data, dot_not_save);
            }
            that.isPublish = true;
        }
    }

























    render(){
        let that = this;
        return (
            <div>
                <div className="programm-share" style={{width:"70%",height:"70%",zIndex:1000,display:that.state.programmShare?"block":"none"}}>
                    <div className="programm-share-title">
                        <span className="programm-share-name">{TkGlobal.language.languageData.shares.sharingMode.text}</span>
                        <span className="programm-share-name-info">{TkGlobal.language.languageData.shares.programmShareArea.text}</span>
                        <button className="programm-share-close" onClick={that.clickCloseProgrammShare.bind(that)}></button>
                    </div>
                    <div className="programm-share-area s-active" onClick = {this.changeMode.bind(this, 0)}>
                        <label htmlFor="tk-programm-share-radio" >
                            <div className={"programm-share-img"}></div>
                            <div className="tk-programm-share-active">
                                <input type='radio' className="tk-programm-share-radio" id="tk-programm-share-radio" name="tk-programm-share-radio" />
                                <span className={"tk-programm-share-btn"  } >{TkGlobal.language.languageData.shares.programmShare.text}</span>
                            </div>
                        </label>
                    </div>
                    <div className="screen-share-area s-active" onClick = {this.changeMode.bind(this, 1)}>
                        <label htmlFor="tk-screen-share-radio" >
                            <div className={"screen-share-img"}>
                            </div>
                            <div className="tk-programm-share-active">
                                <input type='radio' className="tk-programm-share-radio" id="tk-screen-share-radio" name="tk-programm-share-radio" />
                                <span className={"tk-programm-share-btn"  }>{TkGlobal.language.languageData.shares.shareSceen.text}</span>
                            </div>
                        </label>
                        
                    </div>
                    <div className="area-share-area s-active" onClick = {this.changeMode.bind(this, 2)}>
                        <label htmlFor="th-area-share-radio" >
                            <div className={"area-share-img"}>
                            </div>
                            <div className="tk-programm-share-active">
                                <input type='radio' className="tk-programm-share-radio" id="th-area-share-radio" name="tk-programm-share-radio" />
                                <span className={"tk-programm-share-btn"  }>{TkGlobal.language.languageData.shares.shareArea.text}</span>
                            </div>
                        </label>
                        
                    </div>
                    <div>
                        <select id="windowsel" ref="windowsel" style={{left: "5%",position: "absolute",display: this.state.modeStatuses[0]? 'block' : 'none'}} onChange={that.onComboBoxChanged.bind(that)}></select>
                        <button className={"tk-programm-share-btn tk-programm-share-start-btn"  } onClick={that.next.bind(that) }>{TkGlobal.language.languageData.shares.startSharing.text}</button>
                    </div>

                </div>
            </div>
        )
    }
}

export default ProgrammShareSmart;