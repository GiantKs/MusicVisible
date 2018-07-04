import React from 'react';
import TkGlobal from 'TkGlobal' ;
import ss from 'ServiceSignalling';
import evtObj from 'eventObjectDefine';
import ServiceRoom from 'ServiceRoom';
import TkUtils from 'TkUtils';
import './static/index.css';
import '../callRoll/static/panel.css';
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

class VoteCommit extends React.Component {

    constructor(props){
        super(props);
        let id = props.id;
        this.state={
            [id]:{
                pagingToolLeft:"",
                pagingToolTop:"",
            },
            show: false,
            resShow: false,
            result: undefined,
            data: {},
            optionList: [],
            optionType: 'radio',
        }

        this.optionListFlgArray = [];
        this.actions = undefined;
        this.markID = new Date().getTime()+'_'+Math.random();
        this.firstOptionNumber = 'A'.charCodeAt();
    }

    componentDidMount(){
        const that = this;
        evtObj.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPubmsg , that.handleRoomPubmsg.bind(that), that.markID); //roomPubmsg事件  上课事件 classBegin
        evtObj.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDelmsg, that.handleRoomDelmsg.bind(that) , that.markID); //监听roomDelmsg
        evtObj.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomMsglist, this.handleRoomMsgList.bind(this), this.markID);
    }

    componentWillUnmount(){
        evtObj.CoreController.removeBackupListerner(this.markID);
    }

    handleRoomMsgList(dataFromServer){
        dataFromServer.message.forEach((item, index) => {
            if(item.name === 'LiveVote'){
                item.data.options.forEach((item,index)=>{
                    item.flg = false;
                })
                this.setState({
                    show: true,
                    data: item.data,
                    optionList: item.data.options,
                    optionType: parseInt(item.data.maxOp) > 1 ? 'checkbox': 'radio',
                },() => {
                    this.actions = new Array(this.state.optionList.length).fill(0);
                });
            }
        });
    }
    
    handleRoomPubmsg(dataFromServer){
        let message = dataFromServer.message;
        
        switch(message.name){
            case 'LiveVote':
            message.data.options.forEach((item,index)=>{
                item.flg = false;
            })
            this.setState({
                show: true,
                resShow: false,
                data: message.data,
                optionList: message.data.options,
                optionType: parseInt(message.data.maxOp) > 1 ? 'checkbox': 'radio',
            },() => {
                    this.actions = new Array(this.state.optionList.length).fill(0);
                });

                break;
        }
    }

    handleRoomDelmsg(dataFromServer){
        switch(dataFromServer.message.name){
            case 'LiveVote':
                this.setState({
                    show: false,
                    resShow: dataFromServer.message.data.hasPub ? true : false,
                    result: dataFromServer.message.data,
                    data: {},
                    optionList: [],
                    optionType: 'radio',
                });
                break;
        }
    }

    handleCommit(){
        let that = this;
        this.setState({
            show: false,
        });
        
        let data = [];
        that.state.optionList.forEach((item)=>{
            item.flg === true ? data.push(1) : data.push(0);
        })
        ss.sendSignallingFromLiveVoteCommit(this.__getVoteCommitID(), 
                                            this.state.data.id,
                                            {nickname: ServiceRoom.getTkRoom().getMySelf().nickname},
                                            data,);
    }

    handleChange(index, e){
        let that = this;
        let arr = that.state.optionList;
        switch(this.state.optionType){
            case 'radio':
                
                arr.forEach((item,i)=>{
                    if(i === index){
                        item.flg = true
                    }else{
                        item.flg = false;
                    }
                })
                that.setState({
                    optionList: arr,
                })
                break;
            case 'checkbox':
                let num = that.mapOptionListFlg();
                if(arr[index].flg){
                    arr[index].flg = !arr[index].flg;
                }else{
                    if(num >= that.state.data.maxOp){
                        return ;
                    }else{
                        arr[index].flg = !arr[index].flg;
                    }
                }
                that.setState({
                    optionList: arr,
                })
                break;
        }

    }

    mapOptionListFlg(){
        let that = this;
        let num = 0;
        that.state.optionList.forEach((item,index)=>{
            if(item.flg === true){
                num++
            }
        })
        return num;
    }

    __getOptionList(){
        let optionList = [];
        let that = this;
        this.state.optionList.map((item, index) => {
            if(item.flg){
                optionList.push(
                    <div className="vote-result-item vote-result-item-active" key={index} onClick={that.handleChange.bind(this,index)}>
                        <div className="vote-result-item-left">
                            {String.fromCharCode(this.firstOptionNumber + index)}
                        </div>
                        <div className="vote-result-item-right">
                            <span>{item.content}</span>
                        </div>
                        
                    </div>
                )
            }else{
                optionList.push(
                    <div className="vote-result-item" key={index} onClick={that.handleChange.bind(this,index)}>
                        <div className="vote-result-item-left">
                            {String.fromCharCode(this.firstOptionNumber + index)}
                        </div>
                        <div className="vote-result-item-right">
                            <span>{item.content}</span>
                        </div>
                        
                    </div>
                )
            }
            
        });
        return optionList;
    }

    __getVoteCommitID(){
        return (
           'v_sub_' + ServiceRoom.getTkRoom().getMySelf().id + '_' + TkUtils.getGUID().getGUIDDate() + TkUtils.getGUID().getGUIDTime() // vote_userid_timestamp
        );
    }

    loadOptionList(){
        let opList = [],
            maxNum = this.state.result.voteNum;

        this.state.result.result.map((item, index) => {
            let process = maxNum !== 0 ?parseInt((item.value/maxNum)*1e2)+'%' : '0%';
            opList.push(<div key={index} className="op-item">
                            <p className="op-name">{item.name}</p>
                            <div className="flex-box">
                                <div className="process-bar wrap">
                                    <div className="bar" style={{width: process}}></div>
                                </div>
                                <span className="process-txt">{process} </span>
                                <span className="process-num">{item.value}</span>
                            </div>
                        </div>);
        });

        return opList;
    }

    close(){
        this.setState({show: false, resShow: false})
    }
    changeTimeFormat(num){  //转换时间格式
        let d = new Date(num*1e3);
        let str = d.getMonth()+1+ '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes()
        return str;
    }
    render(){
        const self = this;
        let that = this;
        const {connectDragSource,isDragging,percentLeft,percentTop,id,isDrag} = this.props;
        TkUtils.getPagingToolLT(this,percentLeft,percentTop,id,isDrag);
        let {pagingToolLeft,pagingToolTop} = this.state[id];
        let mySelf = ServiceRoom.getTkRoom().getMySelf();
        let roleAudit = mySelf.role === TkConstant.role.roleAudit? true:false;
        return connectDragSource(
            <div className="vote vote-commit panel" id={id} style={{display: (this.state.show && roleAudit) || (this.state.resShow && roleAudit) ? 'block' : 'none' ,position:"absolute",left:pagingToolLeft+"rem",top:pagingToolTop+"rem"}} >
                <div className="panel-title">
                    <span>{TkGlobal.language.languageData.vote.vote}</span>
                    <button className='panel-close light-close' onClick={this.close.bind(this)}></button>
                </div>
                <div className="panel-body" style={{display: this.state.show ?　'' : 'none'}}>
                    <div className='card vote-result'>
                        <div className="vote-result-box" >
                           <span className="name">{this.state.data.owner}</span> 
                            {this.changeTimeFormat(that.state.data.createTime)} {TkGlobal.language.languageData.vote.voteRes}
                            <span className="vote-result-loading" >
                                <i className="vote-result-icon" ></i>
                                {TkGlobal.language.languageData.vote.voting}
                            </span>
                        </div>
                    </div>
                    <div className="vote-result">
                        <div>
                            {this.state.data.subject}
                            <span className="vote-result-max" >({TkGlobal.language.languageData.vote.maxOpTit.text1}{that.state.data.maxOp}{TkGlobal.language.languageData.vote.maxOpTit.text2})</span>
                        </div>
                        {this.__getOptionList()}
                    </div>
                    <button className="button" onClick={this.handleCommit.bind(this)}>{TkGlobal.language.languageData.vote.commit}</button>
                </div>
                {
                    this.state.resShow ? 
                    (<div className="panel-body" style={{display: this.state.resShow ?　'' : 'none'}}>
                        <div className="vote-result">
                            <div className="op-name">
                                {this.state.result.subject}
                            </div>
                            {this.loadOptionList()}
                        </div>
                        <div className="vote-result" style={{display: this.state.result.rightOps.length > 0 ? '' : 'none'}}>
                            <span>{TkGlobal.language.languageData.vote.rightOpsTip}:{this.state.result.rightOps.map(item => String.fromCharCode(this.firstOptionNumber + item))}</span>
                        </div>
                    </div>) :
                    null
                }
                
            </div>
        )
        
    }

}

export default DragSource('talkDrag', specSource, collect)(VoteCommit);