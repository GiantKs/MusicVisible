/**
 * 提供组件js加载的Loading-Dumb组件
 * @module Loading
 * @description   提供 提供组件js加载的Loading
 * @author QiuShao
 * @date 2017/12/25
 */
'use strict';
import React  from 'react';

class Loading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show:false
        }
    };

    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.setState({show:true});
        },150);
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        clearTimeout(this.timer);
        this.timer = null ;
    };
    render() {
        return (
            <div className="tk-download-loading" style={{display:this.state.show?'block':'none' , width:'100%' , height:'100%' , position: 'absolute' ,  left:0 , top:0 , backgroundColor:'#121a2c' }}>
                <span className="text"  style={{display:'none' , position: 'absolute' ,  left:'50%' , top:'50%' , color:'#DDD' , fontSize:'0.3rem' , fontWeight:'500' , transform: 'translate(-50% , -50%)' }}  >{window.GLOBAL  && window.GLOBAL.language && window.GLOBAL.language.name === 'chinese' ? '资源正在加载中...':'Trying to loading...'  }</span>
            </div>
        )
    };
};
export  default  Loading ;
