import React from 'react';
import eventObjectDefine from 'eventObjectDefine' ;

export default class BigPictureDisplay extends React.Component{
    constructor(){
        super();
        this.state={
            istrue:false,
            imgurl:''
        }
    }
    componentDidMount() {
        eventObjectDefine.CoreController.addEventListener('isBigPictureDisplay',this.isBigPicture.bind(this))
    }

    isBigPicture(obj){
        if(obj['imgurl']){
            this.setState({
                istrue:true,
                imgurl:obj.imgurl
            })
        }
    }
    del(e){
        if(e.keyCode==27){
            this.setState({
                istrue:false,
                imgurl:''
            })
        }
    }
    clickDel(){
        this.setState({
            istrue:false,
            imgurl:''
        })
    }

    focus(){
        this.a.focus()
    }

    render(){
        return(
            <div>
                {this.state.istrue?<div  ref={a=>this.a=a} onLoad={this.focus.bind(this)} className='isdisplay' tabIndex="0"  onKeyDown={this.del.bind(this)} onClick={this.clickDel.bind(this)}>
                        <img src={this.state.imgurl} className='changebigimg'  alt="bigimg"/>
                </div>:null}
            </div>
        )
    }
}