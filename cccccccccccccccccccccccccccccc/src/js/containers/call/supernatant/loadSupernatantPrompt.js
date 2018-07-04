/**
 * 加载ing浮层提示 Smart组件
 * @module LoadSupernatantPromptSmart
 * @description   提供加载jin提示浮层
 * @author QiuShao
 * @date 2017/11/24
 */

'use strict';
import React from 'react';
import eventObjectDefine from 'eventObjectDefine' ;
import LoadSupernatantPromptDumb from '../../../components/supernatantPrompt/loadSupernatantPrompt' ;

class LoadSupernatantPromptSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            show:false ,
            content:undefined ,
        };
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        let that = this ;
        eventObjectDefine.CoreController.addEventListener( 'loadSupernatantPrompt' , that.handlerLoadSupernatantPrompt.bind(that)  , that.listernerBackupid );
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        let that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid );
    };

    handlerLoadSupernatantPrompt(recvEventData){
        let { show , content  } = recvEventData.message ;
        this.setState({show:show ,content:content });
    };

    render(){
        let {show , content} = this.state ;
        return (
            <LoadSupernatantPromptDumb  show={show} content ={content} />
        )
    }
};
export default  LoadSupernatantPromptSmart;