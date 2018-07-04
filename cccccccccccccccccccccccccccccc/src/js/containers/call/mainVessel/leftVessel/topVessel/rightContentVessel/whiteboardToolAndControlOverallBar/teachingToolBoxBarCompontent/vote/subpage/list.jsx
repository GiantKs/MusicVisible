import React from 'react';
import TkGlobal from 'TkGlobal' ;
import VoteItem from './item';
import '../static/index.css';

class VoteList extends React.Component{

    constructor(){
        super();

        this.pagination = 0;
    }

    handleToDetail(pageNum, data, handle){
        this.props.toDetailPage(pageNum, data, handle)
    }

    render(){

        return(
            <div className="vote-home" style={{display: this.props.currentPageNumber === this.pagination ? '' : 'none'}}>
                 {/* {TkGlobal.language.languageData.vote.voteTips}  */}
                 <span>
                     <img style={{width: '1rem'}} src={require('../static/img/vote-logo.png')} alt=""/>
                 </span>
                <div>
                    <button className="button" onClick={this.handleToDetail.bind(this, 1, this.props.data, 'createVote')}>
                    {TkGlobal.language.languageData.vote.startVote}
                    </button>
                </div>
                <ul className="vote-list ishase" style={{display: this.props.data.length === 0 ? 'none': ''}}>
                    {this.props.data.map((item, index) => {
                        return <VoteItem key={index} data={item} toDetailPage={this.handleToDetail.bind(this)}
                                hasVoting = {this.props.hasVoting} delete={this.props.delete}/>
                    })}
                </ul>
            </div>
        );
    }
}

export default VoteList;