import React, { Component } from 'react';
import ReactDom from 'react-dom';
import TkGlobal from 'TkGlobal';
import TkConstant from 'TkConstant';
import TkUtils from 'TkUtils';
import eventObjectDefine from 'eventObjectDefine';
import ServiceRoom from 'ServiceRoom';
import UploadFileFrom from '../../../containers/from/UploadFileFrom';
import CoreController from 'CoreController';

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
            size: 1 * 1024 * 1024 ,
            updateState:false ,
		};
        this.emotionArray = [
            TkGlobal.language.languageData.phoneBroadcast.chat.face.naughty,TkGlobal.language.languageData.phoneBroadcast.chat.face.happy,TkGlobal.language.languageData.phoneBroadcast.chat.face.complacent,TkGlobal.language.languageData.phoneBroadcast.chat.face.curlOnesLips,
            TkGlobal.language.languageData.phoneBroadcast.chat.face.grieved,TkGlobal.language.languageData.phoneBroadcast.chat.face.shedTears,TkGlobal.language.languageData.phoneBroadcast.chat.face.kiss,TkGlobal.language.languageData.phoneBroadcast.chat.face.love
        ];
		this.isTeacher = TkConstant.hasRole.roleChairman;
        this.sendTextTempArray=[];

		this.listernerBackupid = new Date().getTime()+'_'+Math.random();
	}
    componentDidMount() {
		eventObjectDefine.CoreController.addEventListener('onAnsClick', this.handlerOnAnsClick.bind(this) , this.listernerBackupid);
		eventObjectDefine.CoreController.addEventListener('resetInputState', this.resetInputState.bind(this) , this.listernerBackupid);
		eventObjectDefine.CoreController.addEventListener('initAppPermissions', this.initAppPermissions.bind(this) , this.listernerBackupid);
	};
    componentWillUnmount() {
		eventObjectDefine.CoreController.removeBackupListerner(this.listernerBackupid );
	};

    handleEditableOnInput(e){
        let that = this;
        let range = document.createRange();
        let text = this.refs.textEditable.innerHTML.replace(/&nbsp;/g , " ");
        that.setState({sendRealText:text});
    };

    handleEditableOnKeyDown(e){//当按回车发送时将value置空，使得按钮变颜色
        let that=this;
        if(e.keyCode===13){
            e.preventDefault();
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
    //  sendImg权限控制
    initAppPermissions(a){
        this.setState({updateState:!this.state.updateState});
    }

	handlerOnAnsClick(event){
		this.setState({
			isAns: event.data.isAns,
			associatedMsgID: event.data.associatedMsgID
		});
	}
    // 获取子组件的元素
    /*	form=(inputw,form)=>{
        this.file=inputw;
        this.forml=form;

        let input=this.file;
        input.click();
        input.addEventListener('change',function (e) {
            let uploadFileName = input.files[0].name;
            let fileType = uploadFileName.substring(uploadFileName.lastIndexOf(".") + 1);

            Log.log(uploadFileParams,565656565665656566565);

            let formData = new FormData(this.forml);
            Log.log(this.forml);
            ServiceRoom.getTkRoom().uploadFile(formData,function () {
                console.log(arguments);
            })
        })

    }*/

    // 触发from组件渲染
	OnSendIMG(){
        this.setState({
            flag: this.state.flag + 1,
        })
    };

    /*   if (files && files.length > 0) {
                        /!*let URL = window.URL || window.webkitURL;*!/
                        for(let i=0;i<files.length;i++){
                           /!* let imgURL=URL.createObjectURL(files[i]);
                          Log.log(imgURL,88888888888)*!/
                            reader.readAsBinaryString(files[i]);
                              //判断文件是不是imgage类型
                             reader. onloadend  = function(e) {
                                 Log.log(e.target);
                             }
                        }
                    }*/
	//当按回车发送时将value置空，使得按钮变颜色
	handleInputOnKeyDown(e){
		/*let that=this;
		if(e.keyCode==13){
			if(that.props.handleInputToSend && TkUtils.isFunction(that.props.handleInputToSend) ){
				let value = e.target.value ;
                that.props.handleInputToSend({
					value:value,
					associatedMsgID: that.state.associatedMsgID
				});
			}
			that.resetInputState();
			that.msgEmpty();
            e.preventDefault();
		}*/
	}

    handleInputOnButtonClick(e){
        /*let that=this;
        if(that.props.handleInputToSend && TkUtils.isFunction(that.props.handleInputToSend) ){
            let value = that.state.value ;
            if(value === "")
                value = e.target.parentNode.children[0].children[1].value;
            that.props.handleInputToSend({
				value:value,
				associatedMsgID: that.state.associatedMsgID
			});
		}
		that.resetInputState();
        that.msgEmpty();
        e.preventDefault();*/
	};

	resetInputState(){
		this.setState({
			isAns: false,
			associatedMsgID: ''
		})
	}
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

    replace_em(str){//发送的表情代码正则转为图片
        /*if(!str) return;
        str = str.replace(/\</g,'&lt;');
        str = str.replace(/\>/g,'&gt;');
        str = str.replace(/\n/g,'<br/>');

        if(str.indexOf('em')!=-1){
            str = str.replace(/\[em_([1-8]*)\]/g,function(str,str1){
                return '<img style ="height: 0.23rem;width: 0.23rem" src='+require("../static/img/"+str1+".png")+' border="0" />' ;
            })
        }

        return	<span  dangerouslySetInnerHTML={{__html: str}} ></span>*/
    }

    handleGetSendText(){
        /*let tempAddText = "";
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
        return tempAddText;*/
    }
    /*点击表情*/
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
				<li key={'td_'+index} ><img title={title} className={"icon"} data-labFace={labFace}  src={require("../static/img/"+iconIndex+suffix)} onClick={that.handleFaceOnClick.bind(that , index  , labFace)}  /></li>
			);
		});
      	for(let [key,value] of Object.entries(tdJson) ){
            emotionTrArray.push(
				<ul key={'tr_'+key}>{value}</ul>
			);
		}
    	return{
            emotionArray:emotionTrArray
		}
	};

    uoloadSuccess(res){
        this.props.handleInputToSend({
            value:res.swfpath,
            msgtype: "onlyimg"
        });
    }


	render(){
		let {emotionArray} = this._loadEmotionArray() ;
		let {qqFaceShow} = this.state ;
		return(

		    <div>
                <div className='input-top'>
                    <span className="left">
                        <span className="emotion" onClick={this.handleEmotionBtnOnClick.bind(this)}>
                        </span>
                    </span>
                    <span className="emotionl"
                          style={{display: CoreController.handler.getAppPermissions('chatSendImg') ? 'inline-block' : 'none'}}
                          onClick={this.OnSendIMG.bind(this)}>
                    </span>
                    {CoreController.handler.getAppPermissions('chatSendImg') ?
                        <UploadFileFrom size={this.state.size} flag={this.state.flag}
                                        uoloadSuccessCallback={this.uoloadSuccess.bind(this)}
                                        accept={this.state.accept}/> : null}

                    <div className="qqFace" style={{display: !qqFaceShow ? 'none' : ''}}
                         onMouseLeave={this.handleQqFaceOnMouseLeave.bind(this)}>
                        {emotionArray}
                    </div>
                </div>
                <div className="chat-subject" onMouseLeave={this.handleQqFaceOnMouseLeave.bind(this)} >
                    <div className="chat-input">
                        <div contentEditable={true} ref='textEditable'  id={this.props.id} disabled={this.props.canNotUse }  placeholder={TkGlobal.language.languageData.videoContainer.sendMsg.inputText.placeholder} onInput = {this.handleEditableOnInput.bind(this)} onKeyDown={this.handleEditableOnKeyDown.bind(this)} className="inputContentEditable custom-scroll-bar" />
                        {/*<textarea ref='chatTextarea' id={this.props.id} disabled={this.props.canNotUse} style={{display:'none',paddingRight:this.props.isBroadcast?'0.4rem':'0.1rem'}} placeholder={TkGlobal.language.languageData.videoContainer.sendMsg.inputText.placeholder} onChange={this.handleInputOnChange.bind(this)} onKeyDown={this.handleInputOnKeyDown.bind(this)} className="input" >*/}
                        {/*</textarea>*/}

                    </div>{/*+(this.state.sendRealText.trim().length !== 0?'active':'not-active')*/}
                    <div className='shutiao'></div><button className="sendBtn "  onClick={this.handleEditableOnButtonClick.bind(this)}  disabled={this.props.canNotUse}>
                        {this.state.isAns ? TkGlobal.language.languageData.quiz.answer : (this.props.selectChat === 'chat' ? TkGlobal.language.languageData.videoContainer.sendMsg.sendBtn.text : TkGlobal.language.languageData.quiz.ask )}
                    </button>
                </div>
            </div>
		)
	}
	
	
}

export default Input;