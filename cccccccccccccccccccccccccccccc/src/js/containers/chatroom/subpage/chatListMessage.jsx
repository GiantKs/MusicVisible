import React,{ Component } from 'react';
import TkGlobal from 'TkGlobal';
import Md5 from 'js-md5';
import Bubble from './bubble';


class ChatListMessageDumb extends Component{
	constructor(props,context){
        super(props,context);

	}
    componentDidMount(){
    };
    componentWillUnmount(){
    };

    sendUserNoTalk(userid , e){
        this.props.sendUserNoTalk(userid);
    }

    liveUserListAdd(userid ,nickname, e){
        this.props.liveUserlistAdd(userid,nickname);
    }

    sendKickOut(userid , e){
        this.props.liveSendKickOut(userid);
    }

    _loadChatMessageList(chatMessageList){
        const that = this ;
        let chatMessageArray = [];
        if(Array.isArray(chatMessageList) ){
            /*debugger;
            Log.error('-------', chatMessageList);*/
            chatMessageList.forEach( (value,index) => {
                //Log.error("_loadChatMessageList===",value);
                let ansList = value.ansList ? value.ansList : [];
                chatMessageArray.push(
                    <Bubble data = {value} 
                            index = {index}
                            key = {index}
                            ansList = {ansList}
                            liveUserListAdd = {that.liveUserListAdd.bind(that)}
                            sendUserNoTalk = {that.sendUserNoTalk.bind(that)}
                            sendKickOut = {that.sendKickOut.bind(that)}
                    />
                );
            });
        }
        return {
            chatMessageArray:chatMessageArray
        }
    };

	render(){
        const that = this;
		let {chatMessageArray} = this._loadChatMessageList(this.props.chatMessageList);
		return(
				<ul className={(this.props.type === 'chat' ?"chat-list":"quiz-list " )+" custom-scroll-bar " + (this.props.isBroadcast ? 'isBroadcast' : '') + (this.props.liveNoticeBoard ? ' isNotice' : '')} style={{display:this.props.show?'block':'none'}}>
					{chatMessageArray}
                    <li className='remind-msg' style={{display: !(this.props.isBroadcast && !TkGlobal.isClient) ?'none' : this.props.prompt==="" ? 'none':'block'}}>
                        <span className='angle'></span>
                        <p className='system-info-text'>{this.props.prompt}</p>
                    </li>
				</ul>
		)
	};
};

export default ChatListMessageDumb;
