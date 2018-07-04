/**
 * video Dumb组件
 * @module VideoDumb
 * @description   提供 Video显示区组件
 * @author xiagd
 * @date 2017/08/10
 */
'use strict';
import React  from 'react';
import CoreController from 'CoreController' ;
import TkUtils from 'TkUtils';
import TkGlobal from 'TkGlobal';

class DestTop extends React.Component{
    constructor(props){
        super(props);
    };

    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        let that = this;
        this.props.stream.stop();
    };

    componentDidMount(){
        let that = this;
        if(this.props.stream!== undefined && !this.props.stream.playing)
            this.props.stream.play(that.props.stream.extensionId,{bar:false});
        //let input = this.refs.myInput;
    }
    /*componentUpdate(){
        let that = this;
        if(this.props.stream!== undefined && !this.props.stream.playing)
            this.props.stream.play(that.props.stream.extensionId,{bar:false});
    }*/

    stopScreenShare(){
        let that = this;
        that.props.unScreenSharing();
    }

    handlerOnDoubleClick(event){ //双击视频全屏
        let that = this;
        if(! CoreController.handler.getAppPermissions('dblclickDeviceVideoFullScreenRight')){return ; } ;
        //let targetVideo = document.getElementById('player');
        let targetVideo = that.refs.destTopPlayer;
        if(targetVideo){
            if( TkUtils.tool.isFullScreenStatus(targetVideo) ) {
                TkUtils.tool.exitFullscreen(targetVideo);
            }else{
                TkUtils.tool.launchFullscreen(targetVideo);
            }
        }
    };

    _loadComponent(isTeacher){
        let that = this;
        let destTopComponents = undefined ;
        if(isTeacher){
            destTopComponents = <div  className={"screen-share-" +  (that.props.destTopFlag?"all":"unall") + " screen-share-wrap"}  ><button className="screen-share-wrap_button"   onClick={this.stopScreenShare.bind(that)} >{TkGlobal.language.languageData.shares.stopShare.text}</button> <span className="screen-shareing-wrap_button">{TkGlobal.language.languageData.shares.shareing.text}</span></div>;
        } else{
            destTopComponents = <div  ref="destTopPlayer" className={"screen-share-" +  (that.props.destTopFlag?"all":"unall") } id={that.props.stream!==undefined?that.props.stream.extensionId:""} onDoubleClick={that.handlerOnDoubleClick.bind(that)} />;

        }
        return {destTopComponents:destTopComponents};
    }

    render(){
        //if(this.props.stream!==undefined)
        //this.props.stream.show(this.props.stream.getID());
        let that=this;
        let {isTeacher} = that.props;
        let {destTopComponents} = that._loadComponent(isTeacher);

        return (
            <div  className="add-fl clear-float tool-and-literally-wrap add-position-relative "  id={"screen"}>
                {destTopComponents}
            </div>
        )
    };
};

export  default  DestTop;
