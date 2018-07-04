import React from 'react';
import TkGlobal from 'TkGlobal' ;
import ServiceRoom from 'ServiceRoom';
import TkUtils from 'TkUtils';

class VoteResult extends React.Component{

    constructor(props){
        super(props);
        this.pagination = 2;
        this.hasPub =false;

        this.resultData = undefined;
        if(!!props && props.voteData.status !== 'FINISH'){
            this.resultData = props.data;
        }
    }

    componentDidMount(){}

    handleToList(pageNum, data, handle){
        data.hasPub = this.hasPub;
        this.props.toListPage(pageNum, data, handle)
    }

    loadOptionList(){
        let opList = [],
            totalNum = this.props.voteData.status === 'FINISH' ? this.props.voteData.totalNum : this.props.voteNum;
        
        this.props.data.map((item, index) => {
            let process = (totalNum !== 0 ? parseInt((item.value/totalNum)*1e2)+'%' : '0%');
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

    changeTimeFormat(num){  //转换时间格式
        let d = new Date(num*1e3);
        let str = d.getMonth()+1+ '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes()
        return str;
        //2018/1/16 下午12:27:20
        // let str = new Date(num*1e3).toLocaleString()
        // return str.substr(5,1) + '-'+ str.substr(7,2) + " " + str.substr(12,5);
    }

    publish(e){
        this.hasPub = e.target.checked;
    }


    render(){
        let that = this;
        return (
            <div style={{display: this.props.show ? '' : 'none'}}>
                
                <div className='card vote-result'>
                    <div className="vote-result-box" >
                        <span className="name">{this.props.voteData.owner}</span>
                        {that.changeTimeFormat(that.props.voteData.createTime)} {TkGlobal.language.languageData.vote.voteRes}
                        <span className="vote-result-loading" >
                            <i className="vote-result-icon" ></i>
                            {TkGlobal.language.languageData.vote.voting}
                        </span>
                    </div>
                </div>
                {/* <canvas id="canvas1" style={{width:'4rem', height: '3.2rem'}}></canvas> */}
                <div className="vote-result">
                    <div className="op-name">
                        {this.props.voteData.subject}
                    </div>
                    {this.loadOptionList()}
                </div>
                <p className="vote-result-remind" style={{display:this.props.voteData.status === 'PUB' ? '' : 'none'}}>
                    {TkGlobal.language.languageData.vote.updataText}
                </p>
                <p className="vote-result-remind" style={{display:this.props.voteData.status === 'PUB' ? '' : 'none'}}>
                    <input type="checkbox" onChange={this.publish.bind(this)}/>
                    {TkGlobal.language.languageData.vote.isOpen}
                </p>
                <button className="button" onClick={this.handleToList.bind(this, 0, Object.assign(this.props.voteData, {result: this.resultData}), 'finish')}
                        style={{display:this.props.voteData.status === 'PUB' ? '' : 'none'}}>
                    {TkGlobal.language.languageData.vote.finishVote}
                </button>
            </div>
        )
    }

}

export default VoteResult;