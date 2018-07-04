/**
 * 文件上传进度的Smart组件
 * @module FileProgressBarSmart
 * @description   文件上传进度的Smart组件
 * @author 邱广生
 * @date 2017/09/07
 */

'use strict';
import React from 'react';


class FileProgressBarSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {

        }
        this.listernerBackupid = new Date().getTime()+'_'+Math.random() ;
    };

    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this ;

    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        let that = this ;
    };

    render(){
        const that = this ;
        let {id , progressBarDisabled =true , cancelFileUpload  , cancelBtnShow = true , currProgressText ,currProgressWidth = 0  , failureColor , faukureText} = that.props ;
        return (
            <div id={id} className="progress-bar-box">
                <button className={'progress-bar-wrap '+ (progressBarDisabled?'disabled':'') } disabled={progressBarDisabled} >
                    <span className='progress-bar'  style={{width:currProgressWidth+"%"}}  >
                        <span className='curr-progress' >{currProgressText}</span>
                    </span>
                    <span className='upload-failure' style={{color:failureColor}}>{faukureText}</span>
                </button>
                <button style={{display:!cancelBtnShow?'none':''}} className='cancel-file-upload'  onClick={cancelFileUpload} ></button>
            </div>
        )
    };

};
export default  FileProgressBarSmart;

