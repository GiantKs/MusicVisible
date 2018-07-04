import React, { Component } from 'react';
import ReactDom from 'react-dom';
import TkGlobal from 'TkGlobal';
import TkConstant from 'TkConstant';
import TkUtils from 'TkUtils';
import eventObjectDefine from 'eventObjectDefine';
import CoreController from 'CoreController' ;
import UploadFileFrom from '../../../containers/from/UploadFileFrom';

const core = eventObjectDefine.CoreController;

class Input extends Component{
	constructor(props,context){
		super(props,context);
		this.state={
			value:'',
			qqFaceShow:false ,
			isAns: false,
			associatedMsgID: '',
            sendRealText:'',
            uploadFileName:'',
            fileType:'',
            flag:1,
            accept:".png,.gif,.jpg,.jpeg",
            size: 1 * 1024 * 1024,
		};
		/*this.emotionArray = [
            TkGlobal.language.languageData.phoneBroadcast.chat.face.happy,TkGlobal.language.languageData.phoneBroadcast.chat.face.watch,TkGlobal.language.languageData.phoneBroadcast.chat.face.smile,TkGlobal.language.languageData.phoneBroadcast.chat.face.silence,
            TkGlobal.language.languageData.phoneBroadcast.chat.face.XOXO,TkGlobal.language.languageData.phoneBroadcast.chat.face.dashing,TkGlobal.language.languageData.phoneBroadcast.chat.face.sleepy,TkGlobal.language.languageData.phoneBroadcast.chat.face.complacent
		];*/
        this.emotionArray = [
            TkGlobal.language.languageData.phoneBroadcast.chat.face.naughty,TkGlobal.language.languageData.phoneBroadcast.chat.face.gelasmus,TkGlobal.language.languageData.phoneBroadcast.chat.face.complacent,TkGlobal.language.languageData.phoneBroadcast.chat.face.speechless,
            TkGlobal.language.languageData.phoneBroadcast.chat.face.sorry,TkGlobal.language.languageData.phoneBroadcast.chat.face.shedtears,TkGlobal.language.languageData.phoneBroadcast.chat.face.kiss,TkGlobal.language.languageData.phoneBroadcast.chat.face.love
        ];
		this.isTeacher = TkConstant.hasRole.roleChairman;
        this.sendTextTempArray=[];

        this.listernerBackupid = new Date().getTime()+'_'+Math.random() ;

        this.isBeforeClassInteraction = false;
        this.isAfterClassInteraction = false;


		this.timeStamp = new Date().getTime()+'_'+Math.random();
	}
    componentDidMount() {
	    let that = this;
		core.addEventListener('onAnsClick', this.handlerOnAnsClick.bind(this) , this.timeStamp); //监听房间连接事件
		core.addEventListener('picClick', this.OnSendIMG.bind(this) , this.timeStamp); //监听房间连接事件
		core.addEventListener('emotionClick', this.handleEmotionBtnOnClick.bind(this) , this.timeStamp); //监听房间连接事件
		core.addEventListener('resetInputState', this.resetInputState.bind(this) , this.timeStamp); //监听房间连接事件
        core.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPlaybackClearAllFromPlaybackController,that.handlerRoomPlaybackClearAll.bind(that) , that.listernerBackupid); //roomPlaybackClearAll 事件：回放清除所有信令
        core.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomConnected, that.handlerRoomConnected.bind(that)  , that.listernerBackupid ); //Room-Connected事件：房间连接事件
	};
    componentWillUnmount() {
		core.removeBackupListerner(this.listernerBackupid );
	};

    handlerRoomPlaybackClearAll(){
        this.setState({
			value:'',
			qqFaceShow:false ,
			isAns: false,
			associatedMsgID: '',
            sendRealText:''
		});
        this.emotionArray = [
            TkGlobal.language.languageData.phoneBroadcast.chat.face.naughty,TkGlobal.language.languageData.phoneBroadcast.chat.face.gelasmus,TkGlobal.language.languageData.phoneBroadcast.chat.face.complacent,TkGlobal.language.languageData.phoneBroadcast.chat.face.speechless,
            TkGlobal.language.languageData.phoneBroadcast.chat.face.sorry,TkGlobal.language.languageData.phoneBroadcast.chat.face.shedtears,TkGlobal.language.languageData.phoneBroadcast.chat.face.kiss,TkGlobal.language.languageData.phoneBroadcast.chat.face.love
        ];
		this.isTeacher = TkConstant.hasRole.roleChairman;
        this.sendTextTempArray=[];

        this.listernerBackupid = new Date().getTime()+'_'+Math.random() ;

        this.isBeforeClassInteraction = false;
        this.isAfterClassInteraction = false;
    }

    handlerRoomConnected(roomEvent){//房间连接时
        const that = this;
        // Log.error('roomInfo',TkConstant.joinRoomInfo)
        that.isBeforeClassInteraction = TkConstant.joinRoomInfo.isBeforeClassInteraction;
        that.isAfterClassInteraction = TkConstant.joinRoomInfo.isAfterClassInteraction;
    }

    handleEditableOnInput(e){
        let that = this;
        let range = document.createRange();
        let text = this.refs.textEditable.innerHTML.replace(/&nbsp;/g , " ");
        // if(text.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, "[em_$1]").length>=140)return;
        that.setState({sendRealText:text});
    };

    handleEditableOnKeyDown(e){//当按回车发送时将value置空，使得按钮变颜色
        let that=this;
        if(e.keyCode===13){
            e.preventDefault();
            if((!TkGlobal.classBegin && !this.isBeforeClassInteraction) || (!TkGlobal.classBegin && !this.isAfterClassInteraction)){
                return ;
            }
            if(that.props.handleInputToSend && TkUtils.isFunction(that.props.handleInputToSend) ){
                /*let tempAddText = this.handleGetSendText();
                let value = that.state.value + tempAddText;*/
                let reg = /<img [^>]*src=['"]([^'"]+)[^>]*>/gi;
                let str = this.state.sendRealText.replace(reg, "[em_$1]");
                let value = str.replace(/\.\/img\//gi,'').replace(/\.png/gi,'').replace(/&nbsp;/g , " " );
                that.props.handleInputToSend({
                    value:value,
                    associatedMsgID: that.state.associatedMsgID
                });
            }
            that.resetInputState();
            this.refs.textEditable.innerHTML="";
            that.setState({sendRealText:""});
        }
    }

    handleEditableOnButtonClick(e){
        let that=this;
        if((!TkGlobal.classBegin && !this.isBeforeClassInteraction) || (!TkGlobal.classBegin && !this.isAfterClassInteraction)){
            return ;
        }
        if(that.props.handleInputToSend && TkUtils.isFunction(that.props.handleInputToSend) ){
            // let reg = /<img[^>]*src[=\"\'\s]+[^\.]*\/([^\.]+)\.[^\"\']+[\"\']?[^>]*>/gi;
            let reg = /<img [^>]*src=['"]([^'"]+)[^>]*>/gi;
            let str = this.state.sendRealText.replace(reg, "[em_$1]");
            let value = str.replace(/\.\/img\//gi,'').replace(/\.png/gi,'').replace(/&nbsp;/g , " " );

            that.props.handleInputToSend({
                value:value,
                associatedMsgID: that.state.associatedMsgID
            });
        }
        that.resetInputState();
        this.refs.textEditable.innerHTML="";
        that.setState({sendRealText:""});
    };

    // handleEditableOnInput(e){
    //     let that = this;
    //     let range = document.createRange();
    //     let text = this.refs.textEditable.innerHTML.replace(/&nbsp;/g , " ");
    //     that.setState({sendRealText:text});
    // };

    // sendEditableToList(){
    //     let that = this;
    //     let tempAddText = this.handleGetSendText();
    //     let value = that.state.value + tempAddText;

    //     if (that.props.handleInputToSend && TkUtils.isFunction(that.props.handleInputToSend)) {
    //         that.props.handleInputToSend(value);
    //     }
    //     that.msgEmpty();
    //     this.refs.textEditable.innerHTML="";
    //     this.sendTextTempArray = [];
    //     that.setState({sendRealText:""});
    // }

    // handleEditableOnKeyDown(e){//当按回车发送时将value置空，使得按钮变颜色

    //     let that=this;
    //     if(e.keyCode==13){
    //         if(that.props.handleInputToSend && TkUtils.isFunction(that.props.handleInputToSend) ){
    //             let tempAddText = this.handleGetSendText();
    //             let value = that.state.value + tempAddText;
    //             that.props.handleInputToSend({
    //                 value:value,
    //                 associatedMsgID: that.state.associatedMsgID
    //             });
    //         }
    //         that.resetInputState();
    //         that.msgEmpty();
    //         this.refs.textEditable.innerHTML="";
    //         this.sendTextTempArray = [];
    //         that.setState({sendRealText:""});
    //     }
    // }

    // handleEditableOnButtonClick(e){
    //     let that=this;
    //     if(that.props.handleInputToSend && TkUtils.isFunction(that.props.handleInputToSend) ){
    //         let tempAddText = this.handleGetSendText();
    //         let value = that.state.value + tempAddText;
    //         //let value = that.state.value ;
    //         that.props.handleInputToSend({
    //             value:value,
    //             associatedMsgID: that.state.associatedMsgID
    //         });
    //     }
    //     that.resetInputState();
    //     that.msgEmpty();
    //     this.refs.textEditable.innerHTML="";
    //     this.sendTextTempArray = [];
    //     that.setState({sendRealText:""});
    // };
	
    // handleInputOnChange(e){
    //     let InputValue = e.target.value.trim();
    //     if(InputValue !== ''){
    //         this.setState({
    //             value:e.target.value
    //         });
    //     }else{
    //         this.setState({
    //             value:''
    //         });
    //     }

	// };

	handlerOnAnsClick(event){
		this.setState({
			isAns: event.data.isAns,
			associatedMsgID: event.data.associatedMsgID
		});
        this.refs.textEditable.focus();
        
	}

	//当按回车发送时将value置空，使得按钮变颜色
	// handleInputOnKeyDown(e){
	// 	let that=this;
	// 	if(e.keyCode==13){
	// 		if(that.props.handleInputToSend && TkUtils.isFunction(that.props.handleInputToSend) ){
    //             let value = e.target.value ;
    //             if(value === "")return;
    //             that.props.handleInputToSend({
	// 				value:value, 
	// 				associatedMsgID: that.state.associatedMsgID
	// 			});
	// 		}
	// 		that.resetInputState();
	// 		that.msgEmpty();
    //         e.preventDefault();
	// 	}
	// }
	
    // handleInputOnButtonClick(e){
    //     let that=this;
    //     if(that.props.handleInputToSend && TkUtils.isFunction(that.props.handleInputToSend) ){
    //        /* let value = that.state.value ;
    //         if(value === "")
    //             value = e.target.parentNode.children[0].children[1].value;*/
    //         if(value === "")return;
    //         let value = that.refs.chatTextarea.value ;
    //         that.props.handleInputToSend({
	// 			value:value, 
	// 			associatedMsgID: that.state.associatedMsgID
	// 		});
	// 	}
	// 	that.resetInputState();
    //     that.msgEmpty();
    //     e.preventDefault();
	// };

	resetInputState(){
		this.setState({
			isAns: false,
			associatedMsgID: ''
		})
	}


	//当点击发送按钮发送时将value置空，使得按钮变颜色
	msgEmpty(){
		if(this.refs.chatTextarea && ReactDom.findDOMNode(this.refs.chatTextarea)){
            ReactDom.findDOMNode(this.refs.chatTextarea).value = '' ;
		}
        this.refs.textEditable.innerHTML = '' ;
		this.setState({
			value:''
		});
	};

    handleEmotionBtnOnClick(){
        this.setState({
            qqFaceShow:!this.state.qqFaceShow
        });
        this.refs.textEditable.focus();
	};

    handleQqFaceOnMouseLeave(){
        this.setState({
            qqFaceShow:false
        });
	};

    // replace_em(str){//发送的表情代码正则转为图片
    //     if(!str) return;
    //     str = str.replace(/\</g,'&lt;');
    //     str = str.replace(/\>/g,'&gt;');
    //     str = str.replace(/\n/g,'<br/>');

    //     if(str.indexOf('em')!=-1){
    //         str = str.replace(/\[em_([1-8]*)\]/g,function(str,str1){
    //             return '<img style ="height: 0.23rem;width: 0.23rem" src='+require("../static/img/"+str1+".png")+' border="0" />' ;
    //         })
    //     }

    //     return	<span  dangerouslySetInnerHTML={{__html: str}} ></span>
    // }

    handleGetSendText(){
        let tempAddText = "";
        let tempInnerText = this.refs.textEditable.innerText;
        if(this.sendTextTempArray.length>0){

            let tempLength = 0;

            for(let i=0;i<this.sendTextTempArray.length;i++){
                tempLength += this.sendTextTempArray[i].length;
            }
            if(tempInnerText.length>tempLength){
                tempAddText = tempInnerText.substr(tempLength,tempInnerText.length);
                this.sendTextTempArray.push(tempAddText);
            }
        }else{
            tempAddText = tempInnerText;
            this.sendTextTempArray.push(tempAddText);
        }
        return tempAddText;
    }

    handleFaceOnClick( index  , iconIndex){
        let insertImgSrc = "./img/"+iconIndex+".png";
        this.insertImg(insertImgSrc);//插入表情图片
		this.setState({
			qqFaceShow:false ,
            sendRealText:this.refs.textEditable.innerHTML
		});
    };
    
    /*插入文本*/
    insertText(text) {
        if('getSelection' in window) {
            let sel = window.getSelection();
            if(sel && sel.rangeCount === 1 && sel.isCollapsed) {
                //有选区，且选区数量是一个，且选区的起始点和终点在同一位置
                this.refs.textEditable.focus();
                let range = sel.getRangeAt(0);
                let textNode = document.createTextNode(text);
                range.insertNode(textNode);
                range.collapse(false); //对于IE来说，参数不可省略
                sel.removeAllRanges();
                sel.addRange(range);
            }
        } else if('selection' in document) {
            this.refs.textEditable.focus();
            let range = document.selection.createRange();
            range.text = text;
            this.refs.textEditable.focus(); //IE 11模拟的IE5~IE8无须这一步也能获得焦点
        }
    }
    /*插入表情图片*/
    insertImg(src) {
        if('getSelection' in window) {
            let sel = window.getSelection();
            if(sel && sel.rangeCount === 1 && sel.isCollapsed) {
                //有选区，且选区数量是一个，且选区的起始点和终点在同一位置
                this.refs.textEditable.focus();
                let range = sel.getRangeAt(0);
                let img = new Image();
                img.src = src;
                range.insertNode(img);
                range.collapse(false); //对于IE来说，参数不可省略
                sel.removeAllRanges();
                sel.addRange(range);
            }
        } else if('selection' in document) {
            this.refs.textEditable.focus();
            let range = document.selection.createRange();
            range.pasteHTML('<img src="' + src + '">');
            this.refs.textEditable.focus(); //IE 11模拟的IE5~IE8无须这一步也能获得焦点
        }
    }
    
    // Old code
    // handleFaceOnClick( index  , labFace){

    //     let tempAddText = this.handleGetSendText();
    //     this.state.value = this.state.value + tempAddText +  labFace ;
    //     let tempStr = this.state.value;
    //     let sendContent = this.replace_em(this.state.value);


    //     if(this.refs.chatTextarea && ReactDom.findDOMNode(this.refs.chatTextarea)){
	// 		ReactDom.findDOMNode(this.refs.chatTextarea).value = this.state.value;
    //         ReactDom.findDOMNode(this.refs.textEditable).innerHTML  = sendContent.props.dangerouslySetInnerHTML.__html;
    //     }
	// 	this.setState({
	// 		qqFaceShow:false ,
	// 		value:this.state.value
	// 	});
	// };

	/*加载表情数组*/
    _loadEmotionArray(){
    	const that = this ;
		let suffix = '.png';
		let tdNum = 15 ;
        let emotionTrArray = [];
    	let tdJson = {} ;
    	let emotionElement = undefined;
/*        strFace = '<div id="'+id+'" style="position:absolute;display:none;z-index:5;bottom:100%;left:0;line-height:26px" class="qqFace">' +
            '<table border="0" cellspacing="0" cellpadding="0"><tr>';
        for(let i=1; i<=count; i++){
            labFace = '['+tip+i+']';

            strFace += '<td><img title='+title[i-1]+' class="icon" labFace="'+labFace+'" src='+require("../static/img/"+i+suffix)+' /></td>';//onclick="$(\'#'+option.assign+'\').setCaret();$(\'#'+option.assign+'\').insertAtCaret(\'' + labFace + '\');"
            if( i % 15 == 0 ) strFace += '</tr><tr>';
        }

        strFace += '</tr></table></div>';*/
      	this.emotionArray.map( (title , index) => {
      		let num = Math.floor( index / tdNum ) ;
            tdJson[num] = tdJson[num] || [];
            let iconIndex = index+1 ;
            //title = undefined ;
            tdJson[num].push(
				<td key={'td_'+index} ><img title={title} className={"icon"}  src={"./img/"+iconIndex+suffix} onClick={that.handleFaceOnClick.bind(that , index  , iconIndex)}  /></td>
			);
		});
      	for(let [key,value] of Object.entries(tdJson) ){
            emotionTrArray.push(
				<tr key={'tr_'+key}>{value}</tr>
			);
		}
    	return{
            emotionArray:emotionTrArray
		}
	};

    // 触发from组件渲染
	OnSendIMG(){
	    this.setState({
         flag:this.state.flag+1,
        })
    }
    
    uoloadSuccess(res){
        this.props.handleInputToSend({
            value:res.swfpath,
            msgtype: "onlyimg"
        });
    }

	render(){
        let that = this;
		let {emotionArray} = this._loadEmotionArray() ;
        let {qqFaceShow} = this.state ;
        // ( ( TkGlobal.classBegin && !this.props.liveAllNoTalking ) || ( !TkGlobal.classBegin && that.isBeforeClassInteraction ) || ( !TkGlobal.classBegin && that.isAfterClassInteraction ) )
		return(
			<div className="chat-subject" onMouseLeave={this.handleQqFaceOnMouseLeave.bind(this)} >
				<div className="chat-input" >
                    <div 
                        contentEditable={ !this.props.liveAllNoTalking ? this.props.isQuiz ? (TkGlobal.classBegin ? true : false) : ( ( ( !TkGlobal.classBegin && that.isBeforeClassInteraction ) || ( !TkGlobal.classBegin && that.isAfterClassInteraction ) || TkGlobal.classBegin ) ? true : false) : false  } 
                        ref='textEditable'  id={this.props.id + 1} 
                        disabled={ ( this.props.liveAllNoTalking ? true : ( ( (!TkGlobal.classBegin && !that.isBeforeClassInteraction) || (!TkGlobal.classBegin && !that.isAfterClassInteraction) ) ? true : false ) ) } 
                        style={{paddingRight:this.props.isBroadcast?'0.4rem':'0.1rem'}} 
                        placeholder={TkGlobal.language.languageData.videoContainer.sendMsg.inputText.placeholder} 
                        onInput = {this.handleEditableOnInput.bind(this)} 
                        onKeyDown={this.handleEditableOnKeyDown.bind(this)} 
                        className="inputContentEditable chat"
					></div>
					{/* <textarea ref='chatTextarea' id={this.props.id} disabled={this.props.liveAllNoTalking || this.props.canNotUse || (TkGlobal.classBegin && !that.isBeforeClassInteraction) || (TkGlobal.classBegin && !that.isAfterClassInteraction)} style={{paddingRight:this.props.isBroadcast?'0.4rem':'0.1rem'}} placeholder={TkGlobal.language.languageData.videoContainer.sendMsg.inputText.placeholder} onChange={this.handleInputOnChange.bind(this)} onKeyDown={this.handleInputOnKeyDown.bind(this)} className="input" >
					</textarea> */}
					<div className="chat-accessory" style={{display:this.props.liveAllNoTalking?'none':'flex'}}>
                        <UploadFileFrom  size={this.state.size} flag={this.state.flag} uoloadSuccessCallback={this.uoloadSuccess.bind(this)} accept={this.state.accept} />
						{/* <span className="left" style={{display: 'none'}}>
							<span className="emotion" onClick={this.handleEmotionBtnOnClick.bind(this)} disabled={this.props.liveAllNoTalking || (!TkGlobal.classBegin && !that.isBeforeClassInteraction) || (!TkGlobal.classBegin && !that.isAfterClassInteraction) } >
							</span>
						</span> */}
                        <span className="emotionl" onClick={this.OnSendIMG.bind(this)} style={{display: 'none'}}>
                        <a href="javascript:;" className="fileq" style={{display: 'none'}}>+
                                <div name="img"   ref={p=>this.p=p} />
                            </a>
                        </span>
					</div>
					<div className="qqFace" style={{display:!qqFaceShow?'none':''}} onMouseLeave={this.handleQqFaceOnMouseLeave.bind(this)} >
						<table style={{border:0}} cellSpacing={0} cellPadding={0} >
							<tbody>{emotionArray}</tbody>
						</table>
					</div>
				</div>
                <div className='hr-line' style={{width: '.02rem'}}></div>
                <button 
                    className={"sendBtn "+(this.state.sendRealText || (this.props.selectChat === 'quiz' && this.state.isAns)?'active':'not-active')} 
                    onClick={this.handleEditableOnButtonClick.bind(this)} 
                    disabled={ ( this.props.liveAllNoTalking ? true : ( ( (!TkGlobal.classBegin && !that.isBeforeClassInteraction) || (!TkGlobal.classBegin && !that.isAfterClassInteraction) ) ? true : ( (!TkGlobal.classBegin && this.props.isQuiz)? true : false ) ) ) }>
					{this.state.isAns ? TkGlobal.language.languageData.quiz.answer : (this.props.selectChat === 'chat' ? TkGlobal.language.languageData.videoContainer.sendMsg.sendBtn.text : TkGlobal.language.languageData.quiz.ask )}
				</button>
			</div>
			
		)
	}
	
	
}

export default Input;