import React from 'react';
import TkGlobal from 'TkGlobal' ;

class VoteItem extends React.Component{

    constructor(){
        super();

        this.pagination = 0;
    }

    handleToDetail(pageNum, data, handle){
        this.props.toDetailPage(pageNum, data, handle)
    }

    delete(id){
        this.props.delete(id);
    }

    __getStatusText(status) {
        switch(status){
            case 'UNPUB':
                return <span className="t2 status">{TkGlobal.language.languageData.vote.unpub}</span>;
            case 'PUB':
                return <span className="t2 status">{TkGlobal.language.languageData.vote.voting}</span>;
            case 'FINISH':
                return <span className="t2 status isend">{TkGlobal.language.languageData.vote.finished}</span>;
        }
    }
    changeTimeFormat(num){  //转换时间格式
        let d = new Date(num*1e3);
        let str = d.getMonth()+1+ '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes()
        return str;
    }
    render(){
        let that = this;

        return(
            <li className="vote-item">
                <div className="vote-item-box" >
                    <button className="dark-close vote-item-close" onClick={this.delete.bind(this, this.props.data.id)}></button>
                    <span className="t1 status">{this.props.data.subject}</span>
                    <span className="icon status" ></span>
                    {this.__getStatusText(this.props.data.status)}
                </div>
                
                <div style={{height: ".25rem",marginTop: '.1rem'}}>
                    <span className="vote-item-isSho" >{this.props.data.owner}</span>
                    <span className="vote-item-time" >{that.changeTimeFormat(this.props.data.createTime)}</span>
                    <button className="t3 status"
                            onClick={this.handleToDetail.bind(this, 1, this.props.data, 'updateVote')}
                            disabled = {this.props.data.status !== 'UNPUB' ? true : false}
                            style = {{display: this.props.data.status === 'UNPUB' ? '' : 'none'}}>
                            {TkGlobal.language.languageData.vote.modification}
                            </button>
                    <button className="t4 status"
                            onClick={this.handleToDetail.bind(this, 2, this.props.data, 'publish')}
                            // disabled = {this.props.hasVoting ? true : false}
                            style = {{display: this.props.data.status === 'UNPUB' ? '' : 'none'}}>
                            {TkGlobal.language.languageData.vote.publish}
                            </button>
                    <button className="t3 status"
                            onClick={this.handleToDetail.bind(this, 2, this.props.data,)}
                            style = {{display: this.props.data.status !== 'UNPUB' ? '' : 'none'}}>
                            {TkGlobal.language.languageData.vote.check}
                            </button>
                </div>
            </li>
        );
    }
}

export default VoteItem;