import React,{ Component } from 'react';
import TkGlobal from 'TkGlobal';
import Md5 from 'js-md5';
import Bubble from './bubble';
import TkConstant from 'TkConstant';


class ChatListMessageDumb extends Component{
	constructor(props,context){
        super(props,context);
        this.state={
            isDown:true,
            isDowntext:0,
            none:true
        }
        this.prevnum=0;
        this.prevnumber=0;
        this.none=function () {

        }
	}
    componentDidMount(){
        $(this.ul).scrollTop(this.ul.scrollHeight)
    };
    shouldComponentUpdate(newsProps,newState){
        if(newsProps.chatMessageList.length!==this.props.chatMessageList.length||newState!==this.state){
            if(newsProps.chatMessageList.length!==this.props.chatMessageList.length){
                if(!this.state.isDown){
                    if(this.prevnum==0){
                        this.prevnum+=1;
                    }
                }
            }
            return true
        }else{
            return false
        }
    }
    componentDidUpdate(prev){
        if(!this.state.isDown){
            if(this.prevnum==0){
                this.prevnumber=prev.chatMessageList.length;
            }
        }
       if(prev.chatMessageList.length!==this.props.chatMessageList.length){
           if(this.props.chatMessageList.length){
               if(this.props.chatMessageList[this.props.chatMessageList.length-1].fromID){
                   if(this.props.chatMessageList[this.props.chatMessageList.length-1].fromID==this.props.myid){
                       $(this.ul).scrollTop(this.ul.scrollHeight)
                   }
               }
            }
        }

        if(!this.state.isDown){
            if(prev.chatMessageList.length!==this.props.chatMessageList.length){
            let timer;
            clearTimeout(timer);
             timer=setTimeout(()=>{
                this.setState({
                    isDowntext:this.props.chatMessageList.length-this.prevnumber
                })
            },80)
        }}
    }

    componentWillUnmount(){
    };
    _loadChatMessageList(chatMessageList){
        const that = this ;
        let chatMessageArray = [];
        if(Array.isArray(chatMessageList) ){
            chatMessageList.forEach( (value,index) => {
                let ansList = value.ansList ? value.ansList : [];
                chatMessageArray.push(
                    <Bubble data = {value}
                            index = {index}
                            key = {index}
                            ansList = {ansList}
                    />
                );
            });
        }
        return {
            chatMessageArray:chatMessageArray
        }
    };
    scroll(){
        if(this.ul.scrollHeight-this.ul.clientHeight<=this.ul.scrollTop+20){
            this.setState({
                isDown:true,
                isDowntext:''
            })
            this.prevnum=0;
        }else{
            this.setState({
                isDown:false
            })
        }
    }
    godown(){
        $(this.ul).scrollTop(this.ul.scrollHeight)
    }

	render(){
        const that = this;
        let {chatMessageArray} = this._loadChatMessageList(this.props.chatMessageList);
		return(
				<ul className={"chat-list custom-scroll-bar " + (this.props.isBroadcast ? 'isBroadcast' : '')} onScroll={this.scroll.bind(this)} ref={ul=>this.ul=ul} style={{display:this.props.show?'block':'none'}}>





                    {this.isDown!==true&&this.prevnum ?<span onClick={this.godown.bind(this)}
                        style={{position:'fixed',bottom:'1.31rem',marginLeft:'0.98rem',backgroundColor:'lightskyblue',zIndex:99,width:'2.6rem',height:'0.26rem',textAlign:'center',lineHeight:'0.26rem',fontSize:'0.12rem',fontWeight:"bold",borderRadius:'0.1rem',cursor:'pointer'
                        }}>{this.state.isDowntext+TkGlobal.language.languageData.alertWin.call.fun.UnreadMessage.text}</span>:null}






					<li className='remind-msg' style={{display: !(this.props.isBroadcast && !TkGlobal.isClient) ?'none' : this.props.prompt==="" ? 'none':'block'}}>
						<span className='angle'></span>
						<p className='system-info-text'>{this.props.prompt}</p>
					</li>
					{chatMessageArray}

				</ul>
		)
	};
};

export default ChatListMessageDumb;
