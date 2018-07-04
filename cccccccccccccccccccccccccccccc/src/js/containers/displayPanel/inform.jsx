/**
 * 通知组件
 * @description 在组件内以浮层展示
 * @author R37
 * @date 2017/10/25
 */
import TkGlobal from "TkGlobal" ;
import React,{ Component } from 'react';
import './static/css/displayPanel.css';

class Inform extends Component {

    constructor(){
        super();
    }
    
    // Mounting
    componentWillMount(){}
    componentDidMount(){}

    // Updating
    componentWillUpdate(){}
    componentDidUpdate(){}

    // Unmounting
    componentWillUnmount(){}

    close(){
        this.props.handleClose();
    }

    render(){
        const self = this;

        return (
           <section className="marquee ifm" style={{display: self.props.data.text ? 'block' : 'none',backgroundColor:'rgba(18,25,44,.5)'}}>
            {/*测试用style*/}
                <div>
                        {/* <a href={"http://"+self.props.data.href}>  */}
                            {TkGlobal.language.languageData.notice.inform}: {self.props.data.text}
                        {/* </a> */}
                </div>
                <button className="btn-close" onClick={self.close.bind(self)}>X</button>
           </section>
       );
       
    }
}

export default Inform;