/**
 * 左侧部分-顶部所有组件的Smart模块
 * @module TopVesselSmart
 * @description   承载左侧部分-顶部所有组件
 * @author QiuShao
 * @date 2017/08/08
 */
'use strict';
import React from 'react';
import eventObjectDefine from 'eventObjectDefine';
import TkGlobal from 'TkGlobal';
import LeftToolBarVesselSmart from './leftToolBarVessel/leftToolBarVessel';
import RightContentVesselSmart from './rightContentVessel/rightContentVessel';
import CoreController from 'CoreController';

class TopVesselSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            toolListBoxIsShow:false,
			loadLeftToolBarVesselSmart:true,
        };
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
		 const that = this ;
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomConnected , that.handlerRoomConnected.bind(that) , that.listernerBackupid ) ; //RoomEvent事件
        eventObjectDefine.CoreController.addEventListener('initAppPermissions' , this.handlerInitAppPermissions.bind(this)  , this.listernerBackupid) ; //事件 initAppPermissions
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        eventObjectDefine.CoreController.removeBackupListerner(this.listernerBackupid);
    };
    /*todo 暂时注释
    componentDidUpdate( prevProps,  prevState ){
        if(this.props.bottomVesselSmartHeightRem !== prevProps.bottomVesselSmartHeightRem){
            eventObjectDefine.CoreController.dispatchEvent({type:"resizeHandler"});
            eventObjectDefine.CoreController.dispatchEvent({type:"resizeMediaVideoHandler"});
            eventObjectDefine.CoreController.dispatchEvent({type:"changeMainContentVesselSmartSize" , message:{bottomVesselSmartHeightRem:this.props.bottomVesselSmartHeightRem}});
        }
    }*/

    handlerRoomConnected() {
        this.setState({
            loadLeftToolBarVesselSmart: !TkConstant.hasRole.roleAudit
        });
    };

    handlerInitAppPermissions() {
        this.state.toolListBoxIsShow = CoreController.handler.getAppPermissions('toolListIsShowPairMany');
        this.setState({toolListBoxIsShow: this.state.toolListBoxIsShow});
    };

    render(){
        let that = this ;
        let {bottomVesselSmartHeightRem} = that.props;
        return (
            <section className="add-fl clear-float tool-and-literally-wrap add-position-relative" id="main_tool_literally"  style={{height:'calc(100% - '+bottomVesselSmartHeightRem+'rem)'}} >
                {/*工具、白板区域*/}
                { !TkGlobal.playback && this.state.loadLeftToolBarVesselSmart ? <LeftToolBarVesselSmart /> : undefined }
                <div className="tool-list-box" style={{display:this.state.toolListBoxIsShow?'block':'none'}}></div>
                <RightContentVesselSmart />
            </section>
        )
    };
};
export default  TopVesselSmart;

