/**
 * 顶部部分-左侧工具栏Smart模块
 * @module LeftToolBarVesselSmart
 * @description   承载顶部部分-左侧工具的承载容器
 * @author QiuShao
 * @date 2017/08/08
 */
'use strict';
import React from 'react';
import ToolButtonVesselSmart from './toolButtonVessel/toolButtonVessel';

class LeftToolBarVesselSmart extends React.Component{
    constructor(props){
        super(props);
    };

    render(){
        return (
            <article style={this.props.styleJson} id="tool_container" className="tool-container add-position-relative add-fl" >{/*工具区域*/}
               <ToolButtonVesselSmart  /> {/*工具按钮的所有组件*/}
            </article>
        )
    };
};
export default  LeftToolBarVesselSmart;

