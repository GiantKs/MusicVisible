import React from 'react'
import '../static/index.css'
import rename from 'TkConstant';
import TkGlobal from 'TkGlobal';
import eventObjectDefine from 'eventObjectDefine';

class Help extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state={
        	className:'bg1',
        	page:1,
        	show:false
        	
        	
        }
    }
    _loadProloadArray(){
        let helpProloadArray = [] , ProloadArrayNum = (rename.hasRole.roleChairman || rename.hasRole.roleTeachingAssistant || rename.hasRole.rolePatrol ) ?  7 : 4;
        for(let i=1 ; i<=ProloadArrayNum ; i++){
            helpProloadArray.push(
				<div key={i} className={"bg"+i +" " + ( (rename.hasRole.roleChairman || rename.hasRole.roleTeachingAssistant || rename.hasRole.rolePatrol )? "teacher":"student")}  style={{display:'none'}} ></div>
            );
        }
        return helpProloadArray ;
	}
    render() {
   		let helpProloadArray = this._loadProloadArray();
        return (
            <div id="help" className={"tool-help-frame "+TkGlobal.language.name} onClick={this.changeImg.bind(this)} style={{display:this.state.show?'block':'none',height:'100%',position:'fixed',zIndex:99999}}>
            	<div className={this.state.className + " " + ( (rename.hasRole.roleChairman || rename.hasRole.roleTeachingAssistant || rename.hasRole.rolePatrol )? "teacher":"student")}></div>
				{helpProloadArray}
            </div>
        )
    }
    changeImg(e){
    	let totalNum = (rename.hasRole.roleChairman || rename.hasRole.roleTeachingAssistant || rename.hasRole.rolePatrol )? 7:4;
    	if(this.state.page < totalNum){//切换图片
    		this.setState({
	    		className:'bg'+(this.state.page+1),
	    		page:this.state.page+1
	    	})
    	}
    	else{//当到最后一张图片时，向父组件通信传递false，并把图片状态置为初始
			//this.props.toFather(false);
			this.setState({
				className:'bg1',
	    		page:1
			});
			this.state.show=false;
			//eventObjectDefine.CoreController.dispatchEvent({type:'hide' , message: false});
    	}
    
    }
    componentDidMount(){
    	let that=this;
    	
    	eventObjectDefine.CoreController.addEventListener('show', function(param){
    		that.setState({
    			show:param.message
    		});
    		that.state.show=param.message;
    	});
    }
}

export default  Help;
