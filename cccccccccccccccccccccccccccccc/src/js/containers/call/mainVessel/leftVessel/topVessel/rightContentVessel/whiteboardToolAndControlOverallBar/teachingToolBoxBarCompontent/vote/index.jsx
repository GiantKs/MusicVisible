import React from 'react';
import TkGlobal from 'TkGlobal' ;
import TkUtils from 'TkUtils';
import VoteList from './subpage/list';
import VoteDetail from './subpage/detail';
import VoteCommit from './commit';
import VoteResult from './subpage/result';
import ss from 'ServiceSignalling';
import evtObj from 'eventObjectDefine';
import './static/index.css';
import '../callRoll/static/panel.css';
import ServiceRoom from '../../../../../../../../../services/ServiceRoom';
import { DragSource } from 'react-dnd';
import Toast from '../../../../../../../../LxNotification/toast'


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

class VotePanel extends React.Component {

    constructor(props){
        super(props);
        
        this.pageArray = [0,1,2];
        this.tTimer = undefined;
        this.firstOptionNumber = 'A'.charCodeAt();
        this.markID = new Date().getTime()+'_'+Math.random();
        this.me = ServiceRoom.getTkRoom().getMySelf().id;
        this.pollTimerID = undefined;
        this.voteDataTemplate = {
                id     : undefined,
                desc   : undefined,
                type   : undefined,
                maxOp  : 1,
                status : undefined,
                subject: undefined,
                options: [{}, {}, {}, {}],
            };
        
        let id = props.id;
        this.state = {
            [id]:{
                pagingToolLeft:"",
                pagingToolTop:"",
            },
            toast: {
                msg: undefined,
                show: false,
            },
            resultList    : [],
            currentVoteID : undefined,
            hasVoting     : false,
            voteList      : [],                                                                                           // TODO 需要从服务器拉取投票列表
            pageNumber    : 0,
            voteNum       : 0,
            dataToDetail  : this.voteDataTemplate,
            dataVoteCanvas: [{name: 'A', value: 0}, {name: 'B', value: 0}, {name: 'C', value: 0}, {name: 'D', value: 0}]
        }

    }

    componentDidMount(){
        const self = this;

        evtObj.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPubmsg , this.handleRoomPubmsg.bind(this), this.markID);
        evtObj.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomConnected,this.handleRoomConnect.bind(this) , this.markID); //roomPlaybackClearAll 事件：回放清除所有信令
    }

    componentWillUnmount(){
        evtObj.CoreController.removeBackupListerner(this.markID);
    }

    handleRoomConnect(){
        this.voteAjax('list', {'serial':TkConstant.joinRoomInfo.serial}, (res) => {

            this.setState({
                voteList: res.data.map(item=>this.transData('list', item)),
                resultList: res.data.filter(item=>Number(item.status)===2).map(item=>{
                    return {
                        id: item.voteid,
                        result: Array.isArray(item.options) ?item.options.map((oItem, index)=>{
                            return {
                                name: String.fromCharCode('A'.charCodeAt()+index)+'、'+oItem.content,
                                value: oItem.votenum,
                            }
                        }):null
                    }
                })
            });
        });
    }

    // 监听pubmsg事件
    handleRoomPubmsg(dataFromServer){
        
        let message = dataFromServer.message;

        switch(message.name){
            case 'getVoteCount':
                let tempList = [],
                    flags = dataFromServer.message.values;
                this.state.dataVoteCanvas.map((item, index) => {
                    item.value = Number(flags[index]);
                    tempList.push(item);
                });

                this.setState({voteNum: dataFromServer.message.value,
                               dataVoteCanvas: tempList});
                break;
            // TODO 在上课的时候需要从服务器拉取投票数据
            // TODO 在下课的时候需要将本次列表提交给服务器
        }
    }

    // 处理页面跳转事件
    pageTurning(pageNum, data, handle){
        if(this.pageArray.indexOf(pageNum) === -1)return;
        if(data.id)this.updateVoteDetail(data);
        let user = ServiceRoom.getTkRoom().getMySelf();

        if(data.id && data.status !== 'FINISH')this.updateVoteDetail(data);
        if(data.id && data.status === 'FINISH')this.setState({
            dataVoteCanvas: this.getResultById(data.id)
        });
        let action = this.state.voteList.some(item => item.id === data.id) ? 'update' : 'create';
        switch(handle) {
            case 'updateList':
                this.voteAjax(action, this.transData(action, data));
                this.updateVoteList(data);
                break;
            case 'cpublish':
                if(this.state.voteList.some(item=>item.status === 'PUB'&&item.id !== data.id)){
                    return this.toast({time: 3e3,msg: TkGlobal.language.languageData.vote.toast});
                }; // 同时只能发布一个投票
                this.voteAjax(action, this.transData(action, data))
                    // poll current vote data from server;
                    if(this.pollTimerID === undefined){
                        this.pollTimerID = setInterval( () => {
                            ss.getVoteCount('getVoteCount', data.id, {}, this.me,);
                        },5e3);
                    }else{
                        return Log.error('Vote index error: poll timer has not clear')
                    }
                data.status = 'PUB';
                data.fromUser = user;
                this.setState({hasVoting: true});
                this.updateVoteList(data);
                this.updateDataCanvas(data);
                ss.sendSignallingFromLiveVote(false, data);
                break;
            case 'publish':
                if(this.state.voteList.some(item=>item.status === 'PUB'&&item.id !== data.id)){
                    return this.toast({time: 3e3,msg: TkGlobal.language.languageData.vote.toast});
                }; // 同时只能发布一个投票
                // poll current vote data from server;
                if(this.pollTimerID === undefined){
                    this.pollTimerID = setInterval( () => {
                        ss.getVoteCount('getVoteCount', data.id, {}, this.me,);
                    },5e3);
                }else{
                    return Log.error('Vote index error: poll timer has not clear')
                }
                data.status = 'PUB';
                data.fromUser = user;
                this.setState({hasVoting: true});
                this.updateVoteList(data);
                this.updateDataCanvas(data);
                ss.sendSignallingFromLiveVote(false, data);
                break;
            case 'createVote':
                if(this.state.hasVoting)this.toast({time: 3e3,msg: TkGlobal.language.languageData.vote.toast})
                this.setState({
                    dataToDetail: {    
                        id:      undefined,
                        desc:    undefined,
                        type:    undefined,
                        maxOp:   1,
                        status:  undefined,
                        subject: undefined,
                        options: [{isRight: false,},{isRight: false,},{isRight: false,},{isRight: false,},],
                    },
                });
                break;
            case 'updateVote':
                this.setState({
                    dataToDetail: data,
                });
                break;
            case 'finish':
                this.voteAjax('result', this.transData('result', {id: data.id, result: data.result, totalNum: this.state.voteNum}))
                data.status = 'FINISH';
                data.totalNum = this.state.voteNum;
                this.updateVoteList(data);
                ss.getVoteCount('getVoteCount', data.id, {}, this.me,);
                ss.sendSignallingFromLiveVote(true, {id: data.id, subject: data.subject, desc: data.desc,voteNum: this.state.voteNum, result: data.result, hasPub: data.hasPub, fromUser: user, rightOps: data.options.map((item, index) => {
                    if(item.isRight)return index;
                }).filter(item => item !== undefined)});
                this.updateResultList({
                    id: data.id,
                    result: data.result,
                    totalNum: this.state.voteNum,
                })
                this.setState({
                    voteNum: 0,
                    hasVoting: false,
                    dataVoteCanvas: [{name: 'A', value: 0}, {name: 'B', value: 0}, {name: 'C', value: 0}, {name: 'D', value: 0}]
                });
                clearInterval(this.pollTimerID);
                this.pollTimerID = undefined;
        } 

        this.setState({
            pageNumber: pageNum,
        });
    }

    close(){
        this.props.close();
        this.pageTurning(0, {},)
    }

/*********************************** Server Opration ************************************/

    // 与服务器投票相关业务接口
    voteAjax(handle, data, callback){
        ServiceRoom.getTkRoom().vote(data, handle,(code, res) => {
            if(Number(code) === 0 && typeof callback === 'function'){
                return callback(res);
            }
        })
    }

/*********************************** Server Opration ************************************/

/*********************************** Data Opration ************************************/

    // 服务器相关数据转换
    transData(handle, data){
        let tempData = {};

        switch (handle) {
            case 'create':
                tempData = {
                    voteid: data.id,
                    desc: data.desc,
                    type: data.type === 'radio' ? 0 : 1,
                    status: 0,
                    subject: data.subject,
                    createtime: data.createTime,
                    serial: TkConstant.joinRoomInfo.serial,
                    options: data.options,
                    owner: data.owner,
                    maxop: data.maxOp,
                }
                break;
            case 'update':
                tempData = {
                    voteid: data.id,
                    desc: data.desc,
                    type: data.type === 'radio' ? 0 : 1,
                    status: 0,
                    subject: data.subject,
                    createtime: data.createTime,
                    serial: TkConstant.joinRoomInfo.serial,
                    options: data.options,
                    owner: data.owner,
                    maxop: data.maxOp,
                }
                break;
            case 'result':
                tempData = {
                    voteid: data.id,
                    totalnumber: data.totalNum,
                    result: data.result.map(item => Number(item.value)),
                }
                break;
            case 'list':
                tempData = {
                    id: data.voteid,
                    desc: data.desc,
                    type: Number(data.type) === 0 ? 'radio' : 'checkbox',
                    status: Number(data.status) === 0 ? 'UNPUB' : Number(data.status) === 1 ? 'PUB' : Number(data.status) === 2 ? 'FINISH' : undefined,
                    subject: data.subject,
                    createTime: Number(data.createtime),
                    cTime: new Date(data.createtime*1e3).toJSON(),
                    serial: data.serial,
                    options: data.options,
                    owner: data.owner,
                    maxOp: data.maxop,
                    totalNum: Number(data.totalnumber),
                }
                break
        
            default:
                break;
        }

        return tempData;
    }

    // 更新dataCanvas数据
    updateDataCanvas(data){
        let tempList = [];
        if(Array.isArray(data.options)){
            data.options.map((item, index) => {
                tempList.push({
                    name: String.fromCharCode(this.firstOptionNumber + index) + '、' + item.content,
                    value: 0,
                });
            });
        }

        this.setState({
            currentVoteID: data.id,
            dataVoteCanvas: tempList,
        });
    }

    deleteVoteById(id){
        this.voteAjax('delete', {voteid: id});

        this.setState({
            voteList: this.state.voteList.filter(item => item.id !== id),
        });
    }

    getResultById(id){
        let canvasData = undefined;
        this.state.resultList.map((item, index) => {
            if(item.id === id)canvasData = item.result;
        });
        return canvasData;
    }

    // 投票结果列表
    updateResultList(data){
        const self = this;
        let tempList = [];

        if(this.state.resultList.length === 0){
            tempList.push(data)
        }else {
            let hasThisItem = false;
            this.state.resultList.map((item, index)=>{
                if(item.id === data.id){
                    tempList.push(data);
                    hasThisItem = true;
                }else if(item.id !== data.id && index === self.state.resultList.length-1 && !hasThisItem){
                    tempList.push(item);
                    tempList.push(data);
                }else {
                    tempList.push(item);
                }
            });
        }

        this.setState({
            resultList: tempList,
        });
    }

    // 更新VoteList
    updateVoteList(voteData){
        const self = this;
        let tempList = [];

        if(this.state.voteList.length === 0){
            tempList.unshift(voteData)
        }else {
            let hasThisItem = false;
            this.state.voteList.map((item, index)=>{
                if(item.id === voteData.id){
                    tempList.push(voteData);
                    hasThisItem = true;
                }else if(item.id !== voteData.id && index === self.state.voteList.length-1 && !hasThisItem){
                    tempList.push(item);
                    tempList.unshift(voteData);
                }else {
                    tempList.push(item);
                }
            });
        }

        this.setState({
            voteList: tempList,
        });
    }

    // 更新VoteDetail事件
    updateVoteDetail(voteData){
        this.setState({
            dataToDetail: voteData ? voteData : {},
        })
    }

/********************************* Data Opration End **********************************/
    
    toast(data){
        if(this.tTimer === undefined){
            this.setState({
                toast: {
                    show: true,
                    msg: data.msg,
                },
            });
            setTimeout(() => {
                this.tTimer = undefined;
                this.setState({
                    toast: {
                        show: false,
                        msg: undefined,
                    },
                })
            }, data.time);
        }
    }


    render(){
        const self = this;
        const {connectDragSource,isDragging,left,top,id,isDrag} = this.props;

        return connectDragSource(
            <div id={id} className="vote panel custom-scroll-bar" style={{display: this.props.show ? '' : 'none',position:"absolute",left:left+"rem",top:top+"rem"}}>
                <div className="panel-title">
                    <button className="panel-back back" onClick={self.pageTurning.bind(self, 0)} style={{display: this.state.pageNumber === 0 ? 'none' : ''}}>
                    {/* {TkGlobal.language.languageData.vote.back}  */}
                    </button>
                    <span>{TkGlobal.language.languageData.vote.vote} </span>
                    <button className="panel-close light-close" onClick={self.close.bind(self)}>
                    {/* {TkGlobal.language.languageData.vote.close} */}
                    </button>
                </div>
                
                <div className="panel-body">
                    <VoteList currentPageNumber = {this.state.pageNumber}
                              toDetailPage      = {this.pageTurning.bind(this)}
                              data              = {this.state.voteList}
                              hasVoting         = {this.state.hasVoting}
                              delete            = {this.deleteVoteById.bind(this)}/>
                    {this.state.pageNumber === 1 ? <VoteDetail 
                                toast = {this.toast.bind(this)}
                                hasVoting         = {this.state.hasVoting}
                                currentPageNumber = {this.state.pageNumber}
                                toListPage        = {this.pageTurning.bind(this)}
                                data              = {this.state.dataToDetail}/> : null}
                    {this.state.pageNumber === 2 ? <VoteResult 
                            data       = {this.state.dataVoteCanvas}
                            voteNum    = {this.state.voteNum}
                            toListPage = {this.pageTurning.bind(this)}
                            voteData   = {this.state.dataToDetail}
                            show       = {this.state.pageNumber === 2}/> : null}
                    {this.state.toast.show ? <Toast msg={this.state.toast.msg}/> : null}
                </div>

            </div>
        )

    }

}

export default DragSource('talkDrag', specSource, collect)(VotePanel);