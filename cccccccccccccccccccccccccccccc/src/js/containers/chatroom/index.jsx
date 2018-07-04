import React,{ Component } from 'react';
import TkGlobal from 'TkGlobal';
import CoreController from 'CoreController';
import eventObjectDefine from 'eventObjectDefine';
import TkConstant from 'TkConstant';
import ChatContainer from './subpage/chatContainer';
import './static/css/chatroom.css';

class ChatBox extends Component{
	constructor(props,context){
		super(props,context);		
		this.state={
            selectChat:'chat',//设置聊天室的工具栏切换的是聊天还是提问的索引值
			chatUnread:0,//显示未读聊天数量
			quizUnread:0,//显示未读提问数量
			isBroadcast: TkGlobal.isBroadcast ,
		};
		this.chatIndex = 'chat' ;
		this.quizIndex = 'quiz' ;
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
	}
    componentDidMount(){
		const that = this ;
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDelmsg, that.handlerRoomDelmsg.bind(that) , that.listernerBackupid); //监听roomDelmsg
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomTextMessage, that.handlerRoomTextMessage.bind(that)  , that.listernerBackupid);//监听服务器的广播聊天消息
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPubmsg , that.handlerRoomPubmsg.bind(that), that.listernerBackupid); //roomPubmsg事件  上课事件 classBegin
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPlaybackClearAllFromPlaybackController,that.handlerRoomPlaybackClearAll.bind(that) , that.listernerBackupid); //roomPlaybackClearAll 事件：回放清除所有信令
    };
    componentWillUnmount(){
        let that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid );
    }
    handlerRoomPlaybackClearAll(){
        this.setState({
            selectChat:'chat',//设置聊天室的工具栏切换的是聊天还是提问的索引值
			chatUnread:0,//显示未读聊天数量
			quizUnread:0,//显示未读提问数量
			isBroadcast: TkGlobal.isBroadcast ,
		});
		this.chatIndex = 'chat' ;
		this.quizIndex = 'quiz' ;
    };
    handlerRoomTextMessage(param){
        const that = this ;
        //如果是我自己 需要在用户名后跟着我字样
        if(param.message.type == 1){//提问
            if(this.state.selectChat != this.quizIndex ){//只有当前选中的选项卡不是提问时才计数：记录未读消息数
                this.setState({
                    quizUnread:parseInt(this.state.quizUnread)<99?++this.state.quizUnread:99+'+'
                })
            }
        }else if(param.message.type == 0){
            if(this.state.selectChat!= this.chatIndex){//只有当前选中的选项卡不是聊天时才计数：记录未读消息数
                this.setState({
                    chatUnread:parseInt(this.state.chatUnread)<99?++this.state.chatUnread:99+'+'
                })
            }
        }
    };

    // 接收到发布信令时的处理方法
    handlerRoomPubmsg(recvEventData){
        const that = this ;

        if( this.state.isBroadcast ){//是直播的话才处理
            let pubmsgData = recvEventData.message;

            switch(pubmsgData.name){
                case "LiveQuestions":
                if(this.state.selectChat != this.quizIndex ){//只有当前选中的选项卡不是提问时才计数：记录未读消息数
                    this.setState({
                        quizUnread:parseInt(this.state.quizUnread)<99?++this.state.quizUnread:99+'+'
                    })
                }
                break;
                case "CLassBegin":{
                    this.setState({
                        isBroadcast: TkGlobal.isBroadcast
                    })
                }
            }
        }
    };

    handlerRoomDelmsg(delmsgDataEvent){
        const that = this ;
        let delmsgData = delmsgDataEvent.message ;
        switch(delmsgData.name) {
            case "ClassBegin":
                if(CoreController.handler.getAppPermissions('endClassbeginRevertToStartupLayout')) { //是否拥有下课重置界面权限
                    setTimeout( () => {
                        that._resetChatList();
                    } , 250 );
                }
                break;
        }
    };
	optionTap(selectChat){//工具栏切换
		this.setState({
            selectChat:selectChat
		});
		switch(selectChat){
			case this.chatIndex:this.setState({chatUnread:0});break;
			case this.quizIndex:this.setState({quizUnread:0});break;
			default:
				break;
        }
        eventObjectDefine.CoreController.dispatchEvent({type:'resetInputState'});
	}
    _resetChatList(){
        this.setState({
            selectChat:this.chatIndex,//设置聊天室的工具栏切换的是聊天还是提问的索引值
            chatUnread:0,//显示未读聊天数量
            quizUnread:0,//显示未读提问数量
        });
	}
	_loadTap(){
		const that = this ;
        let tabs=[
            {
                name:'chat',
                content:TkGlobal.language.languageData.videoContainer.sendMsg.tap.chat ,
                index:this.chatIndex ,
                unread:that.state.chatUnread
            },
            {
                name:'question',
                content:TkGlobal.language.languageData.videoContainer.sendMsg.tap.question ,
                index:this.quizIndex ,
                unread:that.state.quizUnread
            }
        ];
        let tapArray = [];
        tabs.forEach(  (value , index) => {
            let isActive= (value.index==that.state.selectChat)?'active-setting':'';
            tapArray.push(
				<li key={index} className={value.name+' '+isActive} onClick={that.optionTap.bind(that , value.index)}  >
                    {value.content}
					<span className={value.name+'-unread'}  style={{ display:value.unread !== 0? '':'none'}} >{value.unread}</span>
				</li>
			);
		});
        return{
            tapArray:tapArray
		}
	};

	render(){
        const that = this;
        let {tapArray} = that._loadTap();
        let chatContainerShow = (this.state.selectChat === this.chatIndex) || (this.state.selectChat === this.quizIndex) ;
        return(
			<div id={this.props.id} className={TkGlobal.playback?"playback":""} style={{
                    position:'relative' , 
                    height:TkGlobal.isBroadcast ? ('calc(100% - '+(this.props.videoContainerHeightRem > 2.775 ? 2.775 : this.props.videoContainerHeightRem)+'rem - 0.2rem)') :  ('calc(100% - '+this.props.videoContainerHeightRem+'rem - 0.2rem)')}}   >
				<div className="options-wrap" style={{display:!this.props.ignoreIsBroadcast && this.state.isBroadcast?"block":"none"}}>
					<ul className="options" >
						{tapArray}
					</ul>
				</div>
				<div className="content-wrap" style={{height:!this.props.ignoreIsBroadcast && this.state.isBroadcast?'calc(100% - 0.4rem)':'100%'}}>
					<ChatContainer  chatContainerHide={!chatContainerShow} isBroadcast={this.state.isBroadcast}  selectChat={this.state.selectChat}   />
				</div>
			</div>
		)
	};
};

export default ChatBox;
