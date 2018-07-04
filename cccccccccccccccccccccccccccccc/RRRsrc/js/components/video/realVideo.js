/**
 * video Dumb组件
 * @module VideoDumb
 * @description   提供 Video显示区组件
 * @author xiagd
 * @date 2017/08/10
 */
'use strict';
import React  from 'react';
import TkGlobal from 'TkGlobal' ;
import ServiceRoom from "ServiceRoom";

class VideoDumb extends React.Component{
    constructor(props){
        super(props);
    };

    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        let that = this;
        // Log.error('VideoDumb componentWillUnmount ' , this.props.stream.getID()  , this.props.stream.extensionId  );
        this.props.stream.stop();
    };

    componentDidMount(){
        let that = this;
        // Log.error('VideoDumb componentDidMount ' , this.props.stream.getID()  , this.props.stream.extensionId  );
        if(!this.props.stream.playing)
            this.props.stream.play(that.props.videoDumbClassName + that.props.stream.extensionId,{bar:false});
            that._findevideoAndAudioList()
        //let input = this.refs.myInput;
    };
    componentDidUpdate(prevProps, prevState){
        let that = this;
        if(that.props.volume !== undefined && that.props.volume !== null ){
            if(prevProps.volume !== that.props.volume){
                    that._findevideoAndAudioList()
            }
        }
    }
    _findevideoAndAudioList(){
        let that = this;
        let participantsvideoAndAudioList = document.getElementById(that.props.videoDumbClassName+that.props.stream.extensionId).querySelectorAll("audio,video");
        for( let pKey of participantsvideoAndAudioList ){
            pKey.volume=that.props.volume/100
        }
    }
    render(){
        //if(this.props.stream!==undefined)
            //this.props.stream.show(this.props.stream.getID());
        let that=this;

        return (
            <div  className={this.props.videoDumbClassName} id={that.props.videoDumbClassName+that.props.stream.extensionId}/>
        )
    };
};

export  default  VideoDumb ;
