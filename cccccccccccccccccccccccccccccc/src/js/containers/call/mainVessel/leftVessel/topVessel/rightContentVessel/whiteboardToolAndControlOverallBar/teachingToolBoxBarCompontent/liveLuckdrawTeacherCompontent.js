/**
 * 右侧内容-直播抽奖 Smart组件
 * @module responderStudentToolComponent
 * @description   抽奖组件
 * @author xiaguodong
 * @date 2017/11/21
 */

'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import TkGlobal from 'TkGlobal' ;
import rename from 'TkConstant';
import TkConstant from 'TkConstant' ;
import TkUtils from 'TkUtils';
import eventObjectDefine from 'eventObjectDefine';
import CoreController from 'CoreController';
import ServiceRoom from 'ServiceRoom';
import ServiceSignalling from 'ServiceSignalling' ;
import ServiceTooltip from 'ServiceTooltip' ;
import LiveLuckdrawStudentComponent from './liveLuckdrawStudentCompontent';
import LiveList from '../../../../../../../../components/live/liveList';
import '../../../../../../../../../css/public-r.css';
import { DragSource } from 'react-dnd';


const specSource = {
    beginDrag(props, monitor, component) {
        const { id, percentLeft,percentTop } = props;
        return { id, percentLeft,percentTop };
    },
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

class LiveLuckdrawTeacherSmart extends React.Component {
    constructor(props){
        super(props);
        let id = props.id;
        this.state={
            [id]:{
                pagingToolLeft:"",
                pagingToolTop:"",
            },
            liveLuckdraw:false,//按钮开始结束状态
            isDisabledLiveLuckdraw: false,//摇奖按钮是否禁用
            liveLuckdrawShow:false,//是否开启抽奖
            luckdrawNum: 1, //中奖名额
            luckdrawListContent: [],//显示的中奖列表
            liveExcludeWinners:false,//是否排除已中奖人数
        };
        this.luckdrawEmitNum = 1; //页数
        this.luckdrawEmitPageCount = 1; //总页数
        this.listernerBackupid =  new Date().getTime()+'_'+Math.random();
        this.onlinenum = 1;//在线人数
        this.showLuckdrawEmitLeft= true;
        this.showLuckdrawEmitRight= true;
        this.liveLuckdrawArray = [];//中奖列表
        this.responseData = undefined;
        this.isStarting = false;    //是否已经开始抽奖
    };

    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this;
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomPubmsg , that.handlerRoomPubmsg.bind(that), that.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that), that.listernerBackupid); //roomDelmsg事件
        eventObjectDefine.CoreController.addEventListener( 'liveLuckDrawShow', that.handlerLiveLuckDrawShow.bind(that) ,that.listernerBackupid  ); // 直播抽奖事件监听
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPlaybackClearAllFromPlaybackController,that.handlerRoomPlaybackClearAll.bind(that) , that.listernerBackupid); //roomPlaybackClearAll 事件：回放清除所有信令
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomMsglist, that.handlerRoomMsgList.bind(that), that.listernerBackupid);//开始后进入
    };


    componentWillUnmount(){
        let that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid );
    }

    handlerRoomPubmsg(recvEventData){
        const that = this;
        let pubmsgData = recvEventData.message;
        let users =ServiceRoom.getTkRoom().getMySelf();
        switch (pubmsgData.name) {
            case "LiveLuckDraw":
                if( users.id === pubmsgData.data.fromUser.id ){
                    if(pubmsgData.data.state === 1){
                        //是自己发起抽奖，不关闭抽奖页面
                        that.setState({
                            liveLuckdrawShow: true,
                        })
                    }
                }else{
                    if(pubmsgData.data.state === 1){
                        //是有人抽奖，自动关闭抽奖页面
                        that.setState({
                            liveLuckdrawShow: false,
                        })
                    }
                }
                
                // else if(pubmsgData.data.state === 0){
                //     //结束抽奖，加入抽奖记录
                //     that.liveLuckdrawArray.unshift(pubmsgData.data.winners);
                // }
                
                // if(pubmsgData.fromID === users.id){
                //     that.setState({
                //         liveLuckdrawShow: true,
                //     })
                // }else{
                //     if(pubmsgData.data.state === 0){
                //         that.liveLuckdrawArray.unshift(pubmsgData.data.winners);
                //     }    
                // }
                break;
        }
    };
    handlerRoomDelmsg(recvEventData){
        const that = this;
        let pubmsgData = recvEventData.message;
        let users =ServiceRoom.getTkRoom().getMySelf();
        Log.error('handlerRoomDelmsg', pubmsgData)
        switch (pubmsgData.name) {
            case "LiveLuckDraw":
                Log.error('1111', recvEventData)
                if( users.id !== pubmsgData.data.fromUser.id ){
                    if(pubmsgData.data.state === 0){
                        //结束抽奖，加入抽奖记录
                        Log.error('添加了')
                        that.liveLuckdrawArray.unshift(pubmsgData.data.winners);
                        that.showLuckdrawEmitBtn();
                        that.liveLuckdrawList();
                    }
                }
                

                break;
            case "ClassBegin":
                that.closeLuckdrawChat();
                that.handlerRoomPlaybackClearAll();

                break;
        }
    };

    getOnlineNumBack(code,response,serial){
        let that = this;
        if(code === 0){
            for(let i=0;i<response.onlinenum.length;i++){
                if(response.onlinenum[i].serial === serial){
                    that.onlinenum = response.onlinenum[i].num;
                    break;
                }
            }
        }

    }


    handlerRoomMsgList(recvEventData){ 
        const that = this;
        let pubmsgData = recvEventData.message;
        let users =ServiceRoom.getTkRoom().getMySelf();
        for(let i=0;i<pubmsgData.length;i++){
            let data = pubmsgData[i];
            switch (data.name) {
                case "LiveLuckDraw":
                    if( users.id === data.data.fromUser.id ){
                        if(data.data.state === 1){
                            //开始抽奖
                            that.setState({
                                liveLuckdraw: true,
                                liveLuckdrawShow: true,
                                luckdrawNum: data.data.luckdrawNum,
                                liveExcludeWinners:data.data.isReLotterydraw
                            });
                            that.isStarting = true    //已经开始
                        }
                        // else if(data.data.state === 0){
                        //     that.setState({
                        //         liveLuckdraw:false,
                        //         liveLuckdrawShow:true,
                        //         luckdrawNum: data.data.luckdrawNum,
                        //         liveExcludeWinners: data.data.isReLotterydraw,
                        //     });
                        // }
                    }
                    // else{
                    //     if(data.data.state === 1){
                    //         //是有人抽奖，自动关闭抽奖页面
                    //         that.setState({
                    //             liveLuckdrawShow: false,
                    //         })
                    //     }else if(data.data.state === 0){
                    //         //结束抽奖，加入抽奖记录
                    //         that.liveLuckdrawArray.unshift(data.data.winners);
                    //     }
                    // }
                    
                    
                break;
            }
        }
        Log.error('isClassBegin', TkGlobal.classBegin)
       that.liveLuckdrawAll();
        
    }


    //获取在线人数
    getOnlineNum(){
        const that = this ;
        let getOnlineNumAjaxInfo = {
            getOnlineNumAjaxXhr:undefined
        };
        let roomProperties = ServiceRoom.getTkRoom().getRoomProperties();
        getOnlineNumAjaxInfo.getOnlineNumAjaxXhr = ServiceRoom.getTkRoom().getOnlineNum(roomProperties.companyid,roomProperties.serial,function(code,response){
            that.getOnlineNumBack(code,response,roomProperties.serial);
        });

    }


    //重置数据
    handlerRoomPlaybackClearAll(){
        if(!TkGlobal.playback){L.Logger.error('No playback environment, no execution event[roomPlaybackClearAll] handler ') ;return ;};
        const that = this ;
        that.setState({
            liveLuckdraw:false,//按钮开始结束状态
            isDisabledLiveLuckdraw: false,//摇奖按钮是否禁用
            liveLuckdrawShow:false,//是否开启抽奖
            luckdrawNum: 1, //中奖名额
            luckdrawListContent: [],//显示的中奖列表
            liveExcludeWinners:false,//是否排除已中奖人数
        });
        
        that.luckdrawEmitNum = 1; //页数
        this.luckdrawEmitPageCount = 1; //总页数
        that.listernerBackupid =  new Date().getTime()+'_'+Math.random();
        that.onlinenum = 1;//在线人数
        that.showLuckdrawEmitLeft= true;
        that.showLuckdrawEmitRight= true;
        that.liveLuckdrawArray = [];//中奖列表
        that.responseData = undefined;
        that.isStarting = false;    //是否已经开始抽奖
        
    };


    handlerLiveLuckDrawShow(){//开启
        let that = this;
        if(TkGlobal.isBroadcast) {
            that.setState({
                liveLuckdrawShow: true
            });
            that.liveLuckdrawList();
        }
    }

    //关闭
    closeLuckdrawChat(){
        let that = this;
        let mySeif = ServiceRoom.getTkRoom().getMySelf();
        let id = 'luck_'+ TkConstant.joinRoomInfo.serial;
        let toID = "__all";
        let tempData = {};
        tempData.fromUser = mySeif;
        // ServiceSignalling.sendSignallingFromLiveLuckDraw(true, id, toID, tempData);
        eventObjectDefine.CoreController.dispatchEvent({
            type: 'receive-msglist-liveLuckDraw',
        });
        that.setState({liveLuckdrawShow:false});
    }

    handlerInputState(event){//是否排除已中奖
        let that = this;
        if(event.target.checked){
            that.setState({
                liveExcludeWinners : true,
                isDisabledLiveLuckdraw: false,
            })
            that.getLuckdrawWinnersNum();
        }else{
            that.setState({
                liveExcludeWinners : false,
                isDisabledLiveLuckdraw: false,
            })
        }  
    }



    //开始抽奖
    handlerStartLuckDraw(){
        let that = this;
        let mySeif = ServiceRoom.getTkRoom().getMySelf();
        let id = 'luck_'+ TkConstant.joinRoomInfo.serial;
        let toID = "__all";
        let tempData = {};
        
        if(that.state.liveLuckdraw === undefined || that.state.liveLuckdraw === false){
            that.setState({
                liveLuckdraw:true,
            });
            that.liveLuckdrawStart();
            
        } else{
            ServiceRoom.getTkRoom().getLottyerOver(that.responseData.lotteryid,(code,response)=>{
                // Log.debug('handlerStartLuckDraw',response);
            })
            that.setState({
                liveLuckdraw:false,
            });
            if(that.responseData.winners === undefined || that.responseData.winners === null || that.responseData.winners.length === 0){
                return
            }
            that.changeLiveLuckdrawArray(that.responseData);
            tempData.fromName = mySeif.nickname;
            tempData.state = 0;
            tempData.winners = that.liveLuckdrawArray[0];
            tempData.fromUser = mySeif;
            ServiceSignalling.sendSignallingFromLiveLuckDraw(true, id, toID, tempData);

            that.isStarting = false;
            
        }
    }

    
    //开始抽奖后台交互
    liveLuckdrawStart(){
        //1  不去重  0 去重
        let that = this;
        let mySeif = ServiceRoom.getTkRoom().getMySelf();

        let data = {
            initiatorid: mySeif.id,//发起人的ID
            initiator: mySeif.nickname,//发起人的name
            lotteryid: TkUtils.getLotteryid(),//抽奖表ID
            starttime: TkUtils.getTs(),//开始时间
            serial: TkConstant.joinRoomInfo.serial,//房间号
            isReLotterydraw: that.state.liveExcludeWinners?0:1,//是否排除
            num: that.state.luckdrawNum,//中奖名额
        };
        
        ServiceRoom.getTkRoom().getLottyerDraw(data,function(code,response){
            // Log.debug('liveLuckdrawStart',response);
            if(parseInt(code) === 0){
                if(response.winners !== undefined && response.winners !== null && response.winners.length > 0){
                    that.responseData = response;
                    that.setState({
                        liveLuckdraw:true,
                        isDisabledLiveLuckdraw: false,
                    });
                    let id = 'luck_'+ TkConstant.joinRoomInfo.serial;
                    let toID = "__all";
                    let tempData = {};
                    tempData.state = 1;
                    tempData.fromName = mySeif.nickname;
                    tempData.fromUser = mySeif;
                    tempData.luckdrawNum = that.state.luckdrawNum;
                    tempData.isReLotterydraw = that.state.liveExcludeWinners;
                    let save = true;
                    let do_not_replace = true;
                    ServiceSignalling.sendSignallingFromLiveLuckDraw(false, id, toID, tempData, '', do_not_replace);
                }else{
                    that.setState({
                        liveLuckdraw:false,
                        isDisabledLiveLuckdraw: false,
                    });
                    ServiceTooltip.showError(TkGlobal.language.languageData.broadcast.noWinningStudent);
                }
                
            }else if(parseInt(code) === 1){
                that.setState({
                    liveLuckdraw:false,
                });
                ServiceTooltip.showError(TkGlobal.language.languageData.broadcast.noWinningStudent);
            }else{
                that.setState({
                    liveLuckdraw:false,
                });

            }
            
        });
    }

    //获取所有记录
    liveLuckdrawAll(){
        let that = this;
        ServiceRoom.getTkRoom().getLottyerDrawAll(TkConstant.joinRoomInfo.serial,function(code,response){
            if(parseInt(code) === 0){
                let data = response.data;
                if(Array.isArray(data)){
                    if(that.liveLuckdrawArray.length === 0){
                        data.forEach((element,index) => {
                            if(index === data.length-1 && that.isStarting === true){
                                that.responseData = element;
                            }else{
                                element.endtime = that.changeTime(element.endtime);
                                that.liveLuckdrawArray.unshift(element);
                            }
                            
                        });
                        that.showLuckdrawEmitBtn();
                        that.liveLuckdrawList();
                    }
                }
            }
        });
    }

    getLuckdrawWinnersNum(){    //获取剩余可中奖人数
        let that = this;
        ServiceRoom.getTkRoom().getLottyerDrawNum(TkConstant.joinRoomInfo.serial,function(code,response){
            // Log.debug('getLuckdrawWinnersNum',response);
            if(parseInt(code) === 1){
                that.setState({
                    liveExcludeWinners: false,
                    isDisabledLiveLuckdraw: false,
                })
                ServiceTooltip.showError(TkGlobal.language.languageData.broadcast.noWinningStudent);
            }else if(parseInt(code) === 0){
                that.setState({
                    liveExcludeWinners : true,
                    isDisabledLiveLuckdraw: false,
                })
            }else{
                return ;
            }
        });

    }


    //处理时间格式
    changeTime(time){
        return time.substr(5,2) + '/' + time.substr(8,8);
    }

    //增加中奖纪录
    changeLiveLuckdrawArray(data){
        let that = this;
        let luckdraw = {};
        if(data.lotteryid !== undefined || data.lotteryid !== ""){
            data.endtime = that.changeTime(data.endtime);
            that.liveLuckdrawArray.unshift(data);
            that.showLuckdrawEmitBtn();
            that.liveLuckdrawList();
        }
        
    }


    //转换时间格式
    // timeFormat(str){
    //     let d = new Date(parseInt(str)*1e3)
    //     return d.getMonth() + 1 + '/' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes();
    // }


    //修改获奖名额
    changeLuckdrawNum(num){
        let that = this;
        let newNum = parseInt(num);
        // Log.debug('changeLuckdrawNum',newNum);
        if(newNum <= 1){
            newNum = 1;
        }else if(newNum >= 10){
            newNum = 10;
        }
        that.setState({
            luckdrawNum:newNum
        });
    }
    //input change事件
    handlerGetInpueNum(event){
        let that = this;
        let inputValue = event.target.value;
        that.setState({
            luckdrawNum:inputValue,
        });
    }
    //input失去焦点事件
    handlerGetInpueBlur(event){
        let that = this;
        let inputValue = event.target.value;
        if(!isNaN(inputValue)){
            that.changeLuckdrawNum(inputValue);
        }else{
            that.setState({
                luckdrawNum:1
            });
        }
    }
    //按钮修改获奖人数
    changeLackdrawNumReduce(event){
        let that = this;
        let num = that.state.luckdrawNum;
        num -= 1;
        that.changeLuckdrawNum(num);
    }
    changeLackdrawNumPlus(event){
        let that = this;
        let num = that.state.luckdrawNum;
        num += 1;
        that.changeLuckdrawNum(num);
    }

    //返回n个随机数
    createRandom(m,n){
        let a=[0];
        for(let i=0;i<m;i++)
        {
            a[i]=parseInt(Math.random()*n);
            for(var j=0;j<i;j++)
            {
                if(a[j]==a[i])
                {
                    while (1)
                    {
                        a[i]=parseInt(Math.random()*n);
                        if(a[i]!=a[j])
                        {
                            j=-1;
                            break;
                        }
                    }
                }
            }
        }
        return a;
    }

    //显示的已中奖列表内容
    liveLuckdrawList(){
        let that = this;
        let num = that.luckdrawEmitNum;
        let luckdrawArray = that.liveLuckdrawArray;
        let luckdrawListContent = [];
        let startNum = num *2-2;
        let endNum = num*2 >luckdrawArray.length? luckdrawArray.length : num*2;

        for(let i=startNum;i<endNum;i++){
            let luckdrawData = luckdrawArray[i];
            let listItemData = [];
            for(let j=0;j<luckdrawData.winners.length;j++){
                if(j === luckdrawData.winners.length-1 || j === 4){
                    listItemData.push(<li key={j} className="live-luckdraw-listItem" title={luckdrawData.winners[j].buddyname} ><span className="addEllipsis" >{luckdrawData.winners[j].buddyname}</span></li>)
                }else{
                    listItemData.push(<li key={j} className="live-luckdraw-listItem addSpot" title={luckdrawData.winners[j].buddyname} >
                        <span className="addEllipsis">{luckdrawData.winners[j].buddyname}</span>
                        <span>、</span>
                        </li>)
                }
                
            }
            luckdrawListContent.push(<div key={i} className="live-luckdraw-teacher-list-item">
                <div className="live-luckdraw-teacher-listNum"></div>
                <p className="live-luckdraw-listTime">{luckdrawData.endtime}</p>
                <ul className="live-luckdraw-listBox">
                    {listItemData}
                </ul>
            </div>)
        }
        that.setState({
            luckdrawListContent : luckdrawListContent
        })
    }

    //修改页数
    changeluckdrawEmitNum(event){
        let that = this;
        let listArr = that.liveLuckdrawArray;
        let maxNum = listArr.length%2===0?listArr.length/2:(listArr.length+1)/2
        let num = that.luckdrawEmitNum;
        if(event.target.value === 'top'){
            num -=1;
        }else if(event.target.value === 'bottom'){
            num +=1
        }
        if(num < 1){
            num = 1;
        }else if(num > maxNum){
            num = maxNum;
        }
        that.luckdrawEmitNum = num;
        that.luckdrawEmitPageCount = maxNum <= 0 ? 1 : maxNum ;
        that.showLuckdrawEmitBtn();
        that.liveLuckdrawList()
    }

    //控制上页下页按钮状态
    showLuckdrawEmitBtn(){
        let that = this;
        let emitNum = that.luckdrawEmitNum;
        let luckdrawList = that.liveLuckdrawArray;
        let maxNum = luckdrawList.length%2===0?luckdrawList.length/2:(luckdrawList.length+1)/2;
        if(emitNum <= 1){
            that.showLuckdrawEmitLeft = true;
        }else{
            that.showLuckdrawEmitLeft = false;
        }
        if(emitNum >= maxNum){
            that.showLuckdrawEmitRight = true;
        }else{
            that.showLuckdrawEmitRight = false;
        }
        that.luckdrawEmitPageCount = maxNum <= 0 ? 1 : maxNum ;
    }

    render(){
        let that = this;
        let luckdrawNum = that.state.luckdrawNum;
        let luckdrawListContent = that.state.luckdrawListContent;
        const {connectDragSource,isDragging,percentLeft,percentTop,id,isDrag} = this.props;
        TkUtils.getPagingToolLT(this,percentLeft,percentTop,id,isDrag);
        let {pagingToolLeft,pagingToolTop} = this.state[id];
        return connectDragSource(
            <div className="live-luckdraw-teacher" id={id} style={{display:TkGlobal.isBroadcast && that.state.liveLuckdrawShow?"block":"none",position:"absolute",left:pagingToolLeft+"rem",top:pagingToolTop+"rem"}}>
                <div className="live-luckdraw-teacher-title">
                    <span className="live-luckdraw-teacher-name">{TkGlobal.language.languageData.broadcast.luckdraw}</span>
                    <button className="live-luckdraw-teacher-close" onClick={this.closeLuckdrawChat.bind(this)}></button>
                </div>
                <div className="live-luckdraw-teacher-option">
                    <p className="live-luckdraw-teacher-option-title">{TkGlobal.language.languageData.broadcast.winnersNum}</p>
                    <div className="live-luckdraw-teacher-option-numBox">
                        <span className="live-luckdraw-teacher-option-numj" onClick={that.changeLackdrawNumReduce.bind(that)}></span><input type="text" className="live-luckdraw-teacher-option-num" onChange={that.handlerGetInpueNum.bind(that)} onBlur={that.handlerGetInpueBlur.bind(that)} value={luckdrawNum}></input><span className="live-luckdraw-teacher-option-numj" onClick={that.changeLackdrawNumPlus.bind(that)}></span>
                    </div>
                    <div style = {{marginTop:'.1rem'}}>
                        <button className="live-luckdraw-teacher-button"  onClick={that.handlerStartLuckDraw.bind(that)} disabled={that.state.isDisabledLiveLuckdraw} >{that.state.liveLuckdraw?TkGlobal.language.languageData.broadcast.endLuckdraw:TkGlobal.language.languageData.broadcast.startLuckdraw}</button>
                        <input className="live-luckdraw-teacher-input" type="checkbox"  onClick={that.handlerInputState.bind(that)} checked={that.state.liveExcludeWinners?'checked':''}></input><span className="live-luckdraw-teacher-input-name">{TkGlobal.language.languageData.broadcast.excludeWinners}</span>
                    </div>
                </div>
                <div className="live-luckdraw-teacher-luckdrawTitle">{TkGlobal.language.languageData.broadcast.listOfWinners}</div>
                <div className="live-luckdraw-teacher-list">{luckdrawListContent}</div>
                <div className="live-luckdraw-emitBox">
                    <button className={that.showLuckdrawEmitLeft?"live-luckdraw-emitLeft isDisable":"live-luckdraw-emitLeft "} onClick={that.changeluckdrawEmitNum.bind(that)} value='top' disabled={that.showLuckdrawEmitLeft} >上一页</button>
                    <span>{that.luckdrawEmitNum}/{this.luckdrawEmitPageCount}</span>
                    <button className={that.showLuckdrawEmitRight?"live-luckdraw-emitRight isDisable":"live-luckdraw-emitRight"} onClick={that.changeluckdrawEmitNum.bind(that)} value="bottom" disabled={that.showLuckdrawEmitRight}>下一页</button>
                </div>
                {/*<LiveList liveLuckDrawWinners={that.state.liveLuckdrawArray}/>*/}
            </div>
        )
    }
}

export default DragSource('talkDrag', specSource, collect)(LiveLuckdrawTeacherSmart);