/**
 * 白板以及动态 Smart模块
 * @module WhiteboardAndNewpptSmart
 * @description   整合白板以及动态PPT
 * @author QiuShao
 * @date 2017/7/27
 */
'use strict';
import React from 'react';
import ReactDom from 'react-dom';
import WhiteboardSmart from './whiteboard' ;
import NewpptSmart from './newppt' ;
import eventObjectDefine from 'eventObjectDefine';
import H5Document from './H5Document';
import Barrage from './plugs/barrage';
// import { DropTarget } from 'react-dnd';

class WhiteboardAndNewpptSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            fileTypeMark: 'general', //general 、 dynamicPPT 、 h5document
            literallyWrapClass:'' ,
            literallyWrapStyle:{} ,
            barrageShow: false,
        };
        this.fatherContainerId = 'white_board_outer_layout';
        this.whiteboardContainerId = 'big_literally_wrap';

        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
        this.barrage = undefined;
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        let that = this ;
        this.barrage = new Barrage('barrage');

        eventObjectDefine.CoreController.addEventListener( "barrage" , that.handleBarrage.bind(that), that.listernerBackupid); // 发送弹幕事件
        eventObjectDefine.CoreController.addEventListener( "barrageToggle" , that.handleBarrageToggle.bind(that), that.listernerBackupid); // 发送弹幕事件
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        let that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid );
    };
    changeFileTypeMark(fileTypeMark){
        if(this.state.fileTypeMark !== fileTypeMark){
            eventObjectDefine.CoreController.dispatchEvent({ type:'changeFileTypeMark' , message:{fileTypeMark:fileTypeMark} } );
            this.setState({fileTypeMark:fileTypeMark});
        }
    }

    handleBarrage(event){
        this.barrage.send(event.message);
    }

    handleBarrageToggle(event){
        this.setState({
            barrageShow: !this.state.barrageShow,
        })
    }

    resizeWhiteboardSizeCallback(fatherContainerConfiguration){
        if(fatherContainerConfiguration && fatherContainerConfiguration.addClassName !== undefined ){
            this.state.literallyWrapClass = fatherContainerConfiguration.addClassName ;
            delete fatherContainerConfiguration.addClassName ;
        }
        let $whiteboardContainer = $("#"+this.whiteboardContainerId);
        let isChangeMarginTop = false , isChangeMarginLeft = false ;
        for(let [key , value] of Object.entries(fatherContainerConfiguration) ){
            if( key==='marginTop' && Number( value.replace(/(px|%)/g , '') ) !== 0 ){
                isChangeMarginTop = true ;
                continue;
            }
            if(  key==='marginLeft' &&  Number( value.replace(/(px|%)/g , '') ) !== 0 ){
                isChangeMarginLeft = true ;
                continue ;
            }
            if( key === 'width' || key === 'height' ){
                this.state.literallyWrapStyle[key] = value ;
            }
            $whiteboardContainer[0].style[key] = value ;
        }
        if(isChangeMarginTop){
            let height = $whiteboardContainer.height() ;
            $whiteboardContainer.css({'margin-top':(-height/2)+'px'});
        }
        if(isChangeMarginLeft){
            let width = $whiteboardContainer.width() ;
            $whiteboardContainer.css({'margin-left':(-width/2)+'px'});
        }
        this.setState({
            literallyWrapClass:this.state.literallyWrapClass ,
            literallyWrapStyle:this.state.literallyWrapStyle
        });
    };

    render(){
        let that = this ;
        return (
            <div id={that.fatherContainerId}  className={"white-board-outer-layout"} >  {/*白板最外层包裹 */}
                {/*白板和动态PPT*/}
                <div id={that.whiteboardContainerId}  className={"big-literally-wrap "+this.state.literallyWrapClass} > {/*白板内层包裹区域*/}
                    <WhiteboardSmart instanceId={'default'}  resizeWhiteboardSizeCallback={that.resizeWhiteboardSizeCallback.bind(that)}  fatherContainerId = {that.fatherContainerId} fileTypeMark={that.state.fileTypeMark} changeFileTypeMark={that.changeFileTypeMark.bind(that) } />
                    <NewpptSmart styleJson={this.state.literallyWrapStyle}  fileTypeMark={that.state.fileTypeMark}  changeFileTypeMark={that.changeFileTypeMark.bind(that) } />
                    <H5Document  styleJson={this.state.literallyWrapStyle}  fileTypeMark={that.state.fileTypeMark}  changeFileTypeMark={that.changeFileTypeMark.bind(that) } />
                    <canvas id='barrage' width={this.state.literallyWrapStyle.width} height='auto' 
                            style={{position:'absolute', top: '0', zIndex: '997', display:this.state.barrageShow? '': 'none'}}></canvas>
                </div>
            </div>
        )
    };
};

export default  WhiteboardAndNewpptSmart;

