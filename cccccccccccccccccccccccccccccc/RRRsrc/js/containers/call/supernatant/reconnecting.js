/**
 * 正在重连smart组件
 * @module ReconnectingSmart
 * @description   提供正在重连的提示浮层
 * @author QiuShao
 * @date 2017/08/25
 */

'use strict';
import React from 'react';
import eventObjectDefine from 'eventObjectDefine' ;
import TkConstant from 'TkConstant' ;
import TkGlobal from 'TkGlobal' ;
import LoadSupernatantPromptDumb from '../../../components/supernatantPrompt/loadSupernatantPrompt' ;

class ReconnectingSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            reconnecting:false
        };
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        let that = this ;
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomReconnecting , that.handlerRoomReconnecting.bind(that)  , that.listernerBackupid );
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomConnected , that.handlerRoomConnected.bind(that)  , that.listernerBackupid );
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        let that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid );
    };

    handlerRoomReconnecting(){
        if(!this.state.reconnecting){
            this.setState({reconnecting:true});
        }
    };

    handlerRoomConnected(){
        this.setState({reconnecting:false});
    };

    render(){
        const that = this ;
        let {reconnecting} = that.state ;
        return (
            <LoadSupernatantPromptDumb  show={reconnecting} content ={TkGlobal.language.languageData.loadSupernatantPrompt.reconnecting} />
        )
    }
};
export default  ReconnectingSmart;