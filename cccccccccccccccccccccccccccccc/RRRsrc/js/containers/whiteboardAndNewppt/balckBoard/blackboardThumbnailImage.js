/**
 * 多黑板缩略图组件
 * @module MoreBlackboardSmart
 * @description   提供 多黑板缩略图组件
 * @author QiuShao
 * @date 2017/11/20
 */
'use strict';
import React from 'react';
import eventObjectDefine from 'eventObjectDefine';

class BlackboardThumbnailImageSmart extends React.Component{
    constructor(props){
        super(props);
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
        this.state = {
            show:false ,
            blackboardThumbnailImageWidth:this.props.blackboardThumbnailImageWidth || "2rem" ,
            blackboardThumbnailImageBackgroundColor:this.props.blackboardThumbnailImageBackgroundColor || "#ffffff"  ,
            blackboardThumbnailImageId: this.props.blackboardThumbnailImageId ||  'blackboardThumbnailImageId' ,
        };
    };

    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        let that = this ;
        eventObjectDefine.CoreController.addEventListener('updateBlackboardThumbnailImageFromMoreBlackboard' ,that.handlerUpdateBlackboardThumbnailImageFromMoreBlackboard.bind(that)  , that.listernerBackupid );
    };

    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        let that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid);
    };

    handlerUpdateBlackboardThumbnailImageFromMoreBlackboard(recvEventData){
        let {show , blackboardThumbnailImageId , blackboardThumbnailImageBackgroundColor} = recvEventData.message ;
        if(blackboardThumbnailImageId !== this.state.blackboardThumbnailImageId){
            this.setState({blackboardThumbnailImageId:blackboardThumbnailImageId});
        }
        if(show !== this.state.show){
            this.setState({show:show});
        }
        if(blackboardThumbnailImageBackgroundColor !== this.state.blackboardThumbnailImageBackgroundColor){
            this.setState({blackboardThumbnailImageBackgroundColor:blackboardThumbnailImageBackgroundColor});
        }
    };
    blackboardThumbnailOnClick(){
        this.setState({show:false});
        eventObjectDefine.CoreController.dispatchEvent({type:'updateBlackboardThumbnailImageFromBlackboardThumbnailImage' , message:{action:'magnify'} });
    };
    render() {
        return(
            <article className="blackboard-thumbnail-image-container add-position-absolute-bottom0-left0"  onClick={this.blackboardThumbnailOnClick.bind(this)}  style={{display:this.state.show?'block':'none' , zIndex:160 }} >
                <img  className="blackboard-thumbnail-img" id={this.state.blackboardThumbnailImageId} style={{display:'block' , width:this.state.blackboardThumbnailImageWidth , height:'auto', backgroundColor:this.state.blackboardThumbnailImageBackgroundColor } } />
                <span  className="blackboard-thumbnail-imageDescribe add-position-absolute-bottom0-left0 add-nowrap" id={this.state.blackboardThumbnailImageId+'_imageDescribe'} style={{display:'block' ,width:this.state.blackboardThumbnailImageWidth , height:'auto'  , fontSize:'0.2rem'}} />
            </article>
        )
    };
};
export default BlackboardThumbnailImageSmart;


