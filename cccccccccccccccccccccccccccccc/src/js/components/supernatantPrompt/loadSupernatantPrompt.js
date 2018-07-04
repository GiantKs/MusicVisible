/**
 * 加载ing浮层提示 Dumb组件
 * @module LoadSupernatantPromptDumb
 * @description   提供加载jin提示浮层
 * @author QiuShao
 * @date 2017/11/24
 */

'use strict';
import React from 'react';

class LoadSupernatantPromptDumb extends React.Component{
    constructor(props){
        super(props);
    };

    render(){
        let {show , content  , showIcon = true  , showContent = true  } = this.props ;
        return (
            <section className="supernatant-container add-position-absolute-top0-left0"   style={{display:show?'block':'none'}} >
                <div className="load-container">
                    <span className="icon" style={{display:!showIcon?'none':''}} ></span>
                    <span className="content" style={{display:!showContent?'none':''}}  >{content}</span>
                </div>
            </section>
        )
    }
};
export default  LoadSupernatantPromptDumb;