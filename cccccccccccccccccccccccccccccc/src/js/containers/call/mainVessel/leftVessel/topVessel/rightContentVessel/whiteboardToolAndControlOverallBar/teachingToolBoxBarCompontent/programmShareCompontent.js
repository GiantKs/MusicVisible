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

class ProgrammShareSmart extends React.Component {
    constructor(props){
        super(props);
        this.state={
            modeStatuses: [false, true, false],
            programmShare:false,
            shareStream:undefined,
            type:3,
        };
        this.listernerBackupid =  new Date().getTime()+'_'+Math.random();
        this.isPublish = false;
        this.programmArray = [];    //可共享列表数组
        this.selectProgramm = undefined;

    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this;

        eventObjectDefine.CoreController.addEventListener("programmShare",that.handlerProgrammShare.bind(that));
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that), that.listernerBackupid); //roomDelmsg事件 下课事件 classBegin
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPlaybackClearAllFromPlaybackController,that.handlerRoomPlaybackClearAll.bind(that) , that.listernerBackupid); //roomPlaybackClearAll 事件：回放清除所有信令

    };


    handlerRoomDelmsg(recvEventData){
        const that = this ;
        let pubmsgData = recvEventData.message ;
        switch(pubmsgData.name)
        {
            case "ClassBegin":{
                if(this.state.programmShare) {
                    that.wsToggle(false);
                    that.setState({
                        programmShare:false,
                    });
                }
                break;
            }
        }
    }

    handlerRoomPlaybackClearAll(){  //重置数据
        this.setState({
            modeStatuses: [false, false, true],
            programmShare:false,
            shareStream:undefined,
        });
        this.isPublish = false;
        this.programmArray = [];    //可共享列表数组
        this.selectProgramm = undefined;
    };


    /*侦听工具箱桌面共享按钮事件*/
    handlerProgrammShare(){
        let that = this;
        that.setState({
            modeStatuses: [false, false, true],
            programmShare:true,
        });
        that.handlerCreateStream();
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
            type: 0,
        };
        ServiceRoom.getTkRoom().updateWindowSource(ws); //更新窗口
        that.closeProgrammShare();  //关闭本页
    }


    clickCloseProgrammShare(){
        let that = this;
        that.wsToggle(false);
        that.closeProgrammShare();
        
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
            type: 0,
        }
        ServiceRoom.getTkRoom().updateWindowSource(ws);  //1.更新窗口
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
            //区域共享
            this.wsToggle(true);   //开启区域窗口

        }else if(type === 2 ){
            //桌面共享
            this.wsToggle(false);    //关闭区域窗口
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
                
            case 1:     //区域共享
                this.handlerShareAreaClick();
                
                break;
                
            case 2:     //桌面共享
                this.handlerShareFullScreenClick();
                break;
        
            default:
                break;
        }
    }










    onComboBoxChanged(e){
        this.selectProgramm = this.refs.programmShareSelect.value;
    }

    /*开始程序共享 暂时推桌面，区域，应用程序都用1280*720的分辨率，视频都用640*480的分辨率*/
    handlerProgrammShareSelectClick(){
        let that = this;

        //创建流
        that.handlerCreateStream();
        
        //推流
        that.upShareStream();

        var ws = {
            id: this.selectProgramm,
            mixSpk: false,
            mixMic: false,
            type: 1,
        };
        ServiceRoom.getTkRoom().updateWindowSource(ws);  //更新窗口

        
        //关闭
        that.closeProgrammShare();
    }
    /*获取可共享的程序*/
    handlerProgrammShareSelect(){
        let that = this;
        
        ServiceRoom.getTkRoom().getValidWindowList(1,function (windowList) {//可共享程序列表
            if (!Array.isArray(windowList)) return;
            that.programmArray = [];
            let select = that.refs.programmShareSelect;
            select.innerHTML = "";
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
                    select.options.add(optionItem);
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
                ServiceSignalling.publishDeskTopShareStream(that.state.stream);
            } else if(TkGlobal.isBroadcast && TkGlobal.isClient){ //直播且客户端
                ServiceRoom.getTkRoom().stopBroadcast(); //停止推流
                let pullWidth=1920,pullHeight = 1080;
                that.state.shareStream.create();
                ServiceRoom.getTkRoom().uninitBroadcast();
                ServiceRoom.getTkRoom().initBroadcast(TkConstant.joinRoomInfo.pushConfigure.RTMP,10,2,pullWidth,pullHeight);
                ServiceRoom.getTkRoom().startBroadcast(that.state.shareStream.extensionId);
                let isDelMsg = false;
                let id = 'shareStream_' + TkConstant.joinRoomInfo.serial;
                let toID = "__all";
                let dot_not_save = false;
                let mySelf = ServiceRoom.getTkRoom().getMySelf();

                let data = {};
                data.type = -1;
                data.selectProgramm = this.selectProgramm;
                for(let i = 0; i < this.state.modeStatuses.length; i++){
                    if(this.state.modeStatuses[i]===true){
                        data.type = i;
                    }
                }
                ServiceSignalling.sendSignallingFromLiveShareStream(isDelMsg, id, toID, data);
            }
            that.isPublish = true;
        }
    }









    render(){
        let that = this;
        return (
            <div>
                <div className="programm-share" style={{display:that.state.programmShare?"block":"none"}}>
                    <div className="programm-share-title">
                        <h3 className="programm-share-name">
                            {TkGlobal.language.languageData.shares.sharingMode.text}
                            
                        </h3>
                        <button className="programm-share-close" onClick={that.clickCloseProgrammShare.bind(that)}></button>
                    </div>
                    <div className="programm-share-body">
                        <div className="programm-share-item" onClick = {this.changeMode.bind(this, 0)}>
                            <div className={that.state.modeStatuses[0]? ' programm-share-item-box-active programm-share-item-box' : 'programm-share-item-box'} >
                                <div className={"programm-share-item-img programm-share-img"}></div>
                                <span className={"tk-programm-share-btn"  } >{TkGlobal.language.languageData.shares.programmShare.text}</span>
                                <div className="programm-share-item-border"></div>
                            </div>
                        </div>
                        
                        <div className="programm-share-item" onClick = {this.changeMode.bind(this, 1)}>
                            <div className={that.state.modeStatuses[1]? ' programm-share-item-box-active programm-share-item-box' : 'programm-share-item-box'} >
                                <div className={"programm-share-item-img area-share-img"}></div>
                                <span className={"tk-programm-share-btn"  }>{TkGlobal.language.languageData.shares.shareArea.text}</span>
                                <div className="programm-share-item-border"></div>
                            </div>
                        </div>
                        <div className="programm-share-item" onClick = {this.changeMode.bind(this, 2)}>
                            <div className={that.state.modeStatuses[2]? ' programm-share-item-box-active programm-share-item-box' : 'programm-share-item-box'} >
                                <div className={"programm-share-item-img screen-share-img"}></div>
                                <span className={"tk-programm-share-btn"  }>{TkGlobal.language.languageData.shares.shareSceen.text}</span>
                                <div className="programm-share-item-border"></div>
                            </div>
                        </div>
                        <div className="programm-share-select-box" style={{display: this.state.modeStatuses[0]? 'block' : 'none'}} >
                            <p className="programm-share-select-tit" >{TkGlobal.language.languageData.shares.selectProgramm.text}</p>
                            <select ref="programmShareSelect" className="programm-share-select" onChange={that.onComboBoxChanged.bind(that) } >
                            
                            </select>
                        </div>
                        
                        <button className={"tk-programm-share-start-btn"  } onClick={that.next.bind(that) }>{TkGlobal.language.languageData.shares.startSharing.text}</button>
                    </div>
                    
                </div>
            </div>
        )
    }
}

export default ProgrammShareSmart;