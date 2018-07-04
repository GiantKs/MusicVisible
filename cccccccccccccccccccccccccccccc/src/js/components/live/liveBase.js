/**
 * 右侧内容-直播抽奖组件
 * @module responderStudentToolComponent
 * @description   抽奖组件
 * @author xiaguodong
 * @date 2017/11/21
 */

'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import TkGlobal from 'TkGlobal' ;
import rename from 'TkConstant';
import TkConstant from 'TkConstant' ;
import TkUtils from 'TkUtils';
import eventObjectDefine from 'eventObjectDefine';
import CoreController from 'CoreController';
import ServiceRoom from 'ServiceRoom';
import ServiceSignalling from 'ServiceSignalling' ;

class LiveBase extends React.Component {
    constructor(props){
        super(props);
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this;
    };

    closeLiveBase(){
        let that = this;
        that.props.closeLiveBase();
    }


    render(){
        let that = this;

        return (
            <div className="live-base-student"  style={{display:that.props.show?"block":"none"}}>
                <div className="live-base-student-title">
                    <span className="live-base-student-name">{that.props.titleName}</span>
                    <button className="live-base-student-close" onClick={that.closeLiveBase.bind(that)}></button>
                </div>
                <div className="live-base-student-show">
                    {that.props.content}
                </div>
            </div>
        )
    }
}

export default LiveBase;