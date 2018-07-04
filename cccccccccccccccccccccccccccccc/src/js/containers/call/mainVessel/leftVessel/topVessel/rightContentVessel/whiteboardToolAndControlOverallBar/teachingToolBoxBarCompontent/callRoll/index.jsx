import React from 'react';
import TkGlobal from 'TkGlobal' ;
import ss from 'ServiceSignalling';
import evtObj from 'eventObjectDefine';
import ServiceRoom from 'ServiceRoom';
import TkUtils from 'TkUtils';
import './static/index.css';
import './static/panel.css';
import TkConstant from '../../../../../../../../../tk_class/TkConstant';
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

class CallRoll extends React.Component {

    constructor(props){
        super(props);

        this.pollTimerID = undefined;
        this.crTimerID = undefined;
        this.me = ServiceRoom.getTkRoom().getMySelf().id;
        this.currentCRID = undefined;
        this.cTime = undefined;
        this.signInNum = 0;
        this.markID = new Date().getTime()+'_'+Math.random();
        this.data = {timerType: 0}; // 0->1分钟，1->3分钟，2->5分钟，3->10分钟，4->30分钟
        this.timerType = [6e4, 1.8e5, 3e5, 6e5, 1.8e6];

        let id = props.id;
        this.state = {
            buttonStatus: 0, // 用于控制发起点名按钮的状态,O为发布信令，1为删除信令
            callRollList: [],  // TODO 需要从服务器拉取数据
            [id]:{
                pagingToolLeft:"",
                pagingToolTop:"",
            },
        }
    }

    componentDidMount(){
        evtObj.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPubmsg, this.handleRoomPubmsg.bind(this), this.markID);
        evtObj.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPlaybackClearAllFromPlaybackController,this.handlerRoomPlaybackClearAll.bind(this) , this.listernerBackupid); //roomPlaybackClearAll 事件：回放清除所有信令
        evtObj.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomConnected,this.handleRoomConnect.bind(this) , this.listernerBackupid); //roomPlaybackClearAll 事件：回放清除所有信令
    }

    componentWillUnmount(){
        evtObj.CoreController.removeBackupListerner(this.markID);
    }

    handleRoomConnect(){
        ServiceRoom.getTkRoom().getRollCallAll(TkConstant.joinRoomInfo.serial,(code, res) => {

            if(Number(code) === 0){
                let tempList = [];
                tempList = res.data.map((item, index) => {
                    let obj = {
                        id: item.callrollid,
                        nickname: item.nickname || '',
                        signInNum: Number(item.signlnnumber),
                        status: 'FINISH',
                        timerType: Number(item.callrolltime),
                        time: new Date(Number(item.createtime)*1e3).toLocaleString()
                    };
                    return obj;
                })
                this.setState({
                    callRollList: tempList
                })
            }
        })
    }

    //重置数据
    handlerRoomPlaybackClearAll(){
        this.setState({
            buttonStatus: 0, // 用于控制发起点名按钮的状态,O为发布信令，1为删除信令
            callRollList: [],  // TODO 需要从服务器拉取数据
        })
        this.currentCRID = undefined;
        this.cTime = undefined;
        this.signInNum = 0;
        this.data = {timerType: 0}; // 0->1分钟，1->3分钟，2->5分钟，3->10分钟，4->30分钟
        this.timerType = [6e4, 1.8e5, 3e5, 6e5, 1.8e6];
    };

    handleRoomPubmsg(dataFromServer){

        let message = dataFromServer.message;

        switch(message.name){
            case 'LiveSignIn':
                this.signInNum++;
                this.updateCurrentCallRoll({id: this.currentCRID, 
                                       signInNum: this.signInNum},'signInNum');
                break;

            case 'getSICount':
                this.signInNum = Number(message.value);
                this.updateCurrentCallRoll({id: this.currentCRID, signInNum: Number(message.value)},'signInNum');
                break;
            // TODO 在上课的时候需要从服务器拉取点名数据
            // TODO 在下课的时候需要将本次列表提交给服务器
        }
    }

    handlePubCallRoll(){
        if(this.state.buttonStatus === 0 && this.crTimerID === undefined){
            this.crTimerID = setTimeout(() => {
                if(this.state.buttonStatus === 1){
                    this.autoSetButtonStatus();
                }
            }, this.timerType[this.data.timerType]);
        }

        this.autoSetButtonStatus();
    }

    handleOnChange(e){
        this.data.timerType  = e.target.value;
    }

    updateCurrentCallRoll(data, key){
        let tempList = [];

        this.state.callRollList.map((item, index) => {
            if(item.id === data.id){
                if(key === 'signInNum'){
                    item.signInNum = data.signInNum;
                }else {
                    item.status = 'FINISH';
                }
            }
            tempList.push(item);
        });

        this.setState({
            callRollList: tempList,
        });
    }

    updateCallRollList(data){
        const self = this;
        let tempList = [];
        if(this.state.callRollList.length === 0){
            tempList.unshift(data)
        }else {
            this.state.callRollList.map((item, index)=>{
                if(item.id === data.id){
                    tempList.push(data);
                }else if(item.id !== data.id && index === self.state.callRollList.length-1){
                    tempList.push(item);
                    tempList.unshift(data);
                }else {
                    tempList.push(item);
                }
            });
        }

        this.setState({
            callRollList: tempList,
        });
    }

    autoSetButtonStatus(){
        this.updateCurrentCallRoll({id: this.currentCRID});
        let user = ServiceRoom.getTkRoom().getMySelf();
        this.setState({
            buttonStatus: this.state.buttonStatus === 0 ? 1 : 0,  // 0为发布，1为删除
        },() => {
            this.currentCRID = this.currentCRID ?　this.currentCRID : this.__getCallRollID();  // 获取当前点名ID
            this.cTime = this.cTime ? this.cTime : TkUtils.getTs();
            let data = this.data;
            data.fromUser = user;
            ss.sendSignallingFromLiveCallRoll(this.state.buttonStatus === 0 ?true : false, this.currentCRID, data,);
            if(this.state.buttonStatus === 1){ // 发布点名
                this.updateCallRollList({id: this.currentCRID, 
                    timerType: this.data.timerType, 
                    signInNum: 0,
                    time: new Date().toLocaleTimeString(),
                    nickname :ServiceRoom.getTkRoom().getMySelf().nickname,
                    status: 'PUB'});

                if(this.pollTimerID === undefined){
                    this.pollTimerID = setInterval( () => {
                        ss.getSICount('getSICount', this.currentCRID, {}, this.me,);
                    },5e3);
                }else{
                    return Log.error('Callroll index error: poll timer has not clear')
                }
            }else if(this.state.buttonStatus === 0){ // 结束点名
                ss.getSICount('getSICount', this.currentCRID, {}, this.me,)
                let companyid = TkConstant.joinRoomInfo.companyid,
                    serial    = TkConstant.joinRoomInfo.serial;

                ServiceRoom.getTkRoom().getOnlineNum(companyid, serial, (code,res) => {
                    ServiceRoom.getTkRoom().rollCallAdd({
                        callrollid    : this.currentCRID, 
                        callrolltime  : this.data.timerType,
                        createtime    : this.cTime,
                        callrollnumber: Number((res.onlinenum.filter(item => item.serial === serial))[0].num),
                        signlnnumber  : this.signInNum,
                        serial        : TkConstant.joinRoomInfo.serial}, (code, resp) => {
                        })
                        });

                clearInterval(this.pollTimerID);
                clearTimeout(this.crTimerID);
                this.pollTimerID = undefined;
                this.crTimerID = undefined;                                                                               
                this.signInNum = 0;
                this.currentCRID = undefined;   // 重置当前点名ID，此时buttonStatus为删除信令，则不重置
                this.cTime = undefined;
            }
        })
    }

    close(){
        this.props.close();
    }

    __getTimerType(code){
        switch(parseInt(code)){
            case 0:
                return TkGlobal.language.languageData.callroll.timerType0;
                break;
            case 1:
                return TkGlobal.language.languageData.callroll.timerType1;
                break;
            case 2:
                return TkGlobal.language.languageData.callroll.timerType2;
                break;
            case 3:
                return TkGlobal.language.languageData.callroll.timerType3;
                break;
            case 4:
                return TkGlobal.language.languageData.callroll.timerType4;
                break;

        }
    }

    __getCallRollList(){
        let callRollList = [];
        
        if(this.state.callRollList.length !== 0){
            this.state.callRollList.map((item, index) => {
                callRollList.push(
                    <li className="card card-item" key={index}>
                        <div>
                            <span className="name">{item.nickname}</span>
                            <span className="time">({item.time})</span>
                            <span className={item.status === 'PUB' ? 'status-pub' : 'status-finish'}>
                                {item.status === 'PUB' ?　TkGlobal.language.languageData.callroll.state0 : TkGlobal.language.languageData.callroll.state1}
                            </span>
                        </div>
                        <p>
                            <span className="t-circle"></span>
                            {TkGlobal.language.languageData.callroll.crTime}：
                            <span className="act">{this.__getTimerType(item.timerType)}</span>
                        </p>
                        {/* <p>{TkGlobal.language.languageData.callroll.totalNum}</p> */}
                        <p>
                            <span className="s-circle"></span>
                            {TkGlobal.language.languageData.callroll.signInNum}：
                            <span className="act">{item.signInNum}人</span>
                        </p>
                    </li>
                )
            });
        }

        return callRollList;
    }

    __getCallRollID(){
        return TkUtils.getUniqueId(); // vote_userid_timestamp;
    }

    render(){
        const {connectDragSource,isDragging,left,top,id,isDrag} = this.props;

        return connectDragSource(
            <div id={id} className='call-roll panel' style={{display: this.props.show ? '' : 'none',position:"absolute",left:left+"rem",top:top+"rem"}}>
                <div className='panel-title'>
                    <span>{TkGlobal.language.languageData.callroll.callroll}</span>
                    <button className='panel-close light-close' onClick={this.close.bind(this)}></button>
                </div>
                <div className='panel-body'>
                    <div className='card panel-body-box'>
                        <span>{TkGlobal.language.languageData.callroll.setType}:</span>
                        <select name="" id="" onChange={this.handleOnChange.bind(this)}>
                            <option value="0">{TkGlobal.language.languageData.callroll.timerType0}</option>
                            <option value="1">{TkGlobal.language.languageData.callroll.timerType1}</option>
                            <option value="2">{TkGlobal.language.languageData.callroll.timerType2}</option>
                            <option value="3">{TkGlobal.language.languageData.callroll.timerType3}</option>
                            <option value="4">{TkGlobal.language.languageData.callroll.timerType4}</option>
                        </select>
                        <div>
                            <button className='button' onClick={this.handlePubCallRoll.bind(this)}>{this.state.buttonStatus === 0 ? '发起点名' : '结束点名'}</button>    
                        </div>
                    </div>

                    <ul className="callroll-list">
                        {this.__getCallRollList()}
                    </ul>
                </div>
            </div>
        )

    }
}

export default DragSource('talkDrag', specSource, collect)(CallRoll); 