/**
 * 顶部部分-左侧工具栏Smart模块
 * @module LeftToolBarVesselSmart
 * @description   承载顶部部分-左侧工具的承载容器
 * @author QiuShao
 * @date 2017/08/08
 */
'use strict';
import React from 'react';
import TkGlobal from 'TkGlobal';
import eventObjectDefine from 'eventObjectDefine';
import ToolButtonVesselSmart from './toolButtonVessel/toolButtonVessel';
import ToolExtendListVesselSmart from './toolExtendListVessel/toolExtendListVessel';
import "./css/cssLeftToolBarVessel.css";

class LeftToolBarVesselSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        };
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this ;
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
    };

    render(){
        let that = this ;
        return (
            <article id="tool_container" className="tool-container add-position-relative add-fl" >{/*工具区域*/}
               <ToolButtonVesselSmart /> {/*工具按钮的所有组件*/}
               <ToolExtendListVesselSmart /> {/*工具按钮对应的List列表Smart模块*/}
            </article>
        )
    };
};
export default  LeftToolBarVesselSmart;

