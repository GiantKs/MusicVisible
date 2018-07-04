import React from 'react'
import Help from './subpage/help'
import TkGlobal from 'TkGlobal';
import eventObjectDefine from 'eventObjectDefine';
import CoreController from 'CoreController';

class Tipbtn extends React.Component {
    constructor(props, context) {
        super(props, context);
        
    }
    render() {
        let {title} = this.props ;
        return (
            <div id="tip" style={{display:TkGlobal.isBroadcast?"none":CoreController.handler.getAppPermissions('loadNoviceHelp')?"block":"none"}}>
            	<button title={TkGlobal.language.languageData.header.system.help.title} id="tool_help" className="tool-tip tool-icon tl-left-help" ref="btn" onClick={this.showHide.bind(this)}></button>           	
            </div>
        )
    }
    
    showHide(){//点击帮助按钮，让帮助页面显示
    	
    	eventObjectDefine.CoreController.dispatchEvent({type:'show' , message: true});
    }
   
   
    
}

export default Tipbtn;