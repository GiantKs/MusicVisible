/**
 * Select Dumb组件
 * @module SelectDumb
 * @description   提供 Select基础组件
 * @author QiuShao
 * @date 2017/08/11
 */
'use strict';
import React  from 'react';
import ReactDOM from 'react-dom';

class SelectDumb extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            extendShow:false ,
            listDirection:'down' , //down , up
        };
        this.maxOptionNumber = 5 ;
        this.pageSelectListPassivityHideNumber = this.props.pageSelectListPassivityHideNumber ;
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state

    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        clearTimeout( this.pageSelectListPassivityHideNumbertTimer);
        this.pageSelectListPassivityHideNumbertTimer = null ;
    };
    componentDidUpdate(prevProps , prevState){ //在组件完成更新后立即调用,在初始化时不会被调用
        if(prevState.extendShow !== this.state.extendShow){
            this._noticeSelectExtendListShowOrHide(this.state.extendShow);
        }
        if(this.props.pageSelectListPassivityHideNumber !== undefined && this.pageSelectListPassivityHideNumber!== this.props.pageSelectListPassivityHideNumber){
            clearTimeout( this.pageSelectListPassivityHideNumbertTimer);
            this.pageSelectListPassivityHideNumbertTimer = setTimeout( () => {
                this.pageSelectListPassivityHideNumber = this.props.pageSelectListPassivityHideNumber;
                if(this.state.extendShow){
                    this.setState({extendShow:false});
                }
            } , 150);
        }

        if(this.refs.tkSelectContainer){
            let tkSelectContainerElement = ReactDOM.findDOMNode(this.refs.tkSelectContainer) ;
            if(tkSelectContainerElement){
                let {top , height} = this._getRect(tkSelectContainerElement) ;
                if( window.innerHeight - top > (this.maxOptionNumber *  height + 20 ) ){
                    if(this.state.listDirection !== 'down'){
                        this.setState({listDirection:'down'});
                    }
                }else{
                    if(this.state.listDirection !== 'up'){
                        this.setState({listDirection:'up'});
                    }
                }
            }
        }
        //   // ReactDOM.findDOMNode(this.refs.turnTable).style.transform=0 ;
    };

    optionOnClick(selectValue , index , event){
        this.setState({extendShow:false});
        if(selectValue !== this.props.currentValue){
            if(this.props.onChange && typeof this.props.onChange === 'function'){
                this.props.onChange(selectValue , index);
            }
        }
        if(event){
            event.preventDefault();
            event.stopPropagation();
        }
        return false ;
    }
    currentTextOnClick(event){
        this.setState({extendShow:!this.state.extendShow});
        if(event){
            event.preventDefault();
            event.stopPropagation();
        }
        return false ;
    }
    selectContainerOnMouseLeave(event){
        this.setState({extendShow:false});
        if(event){
            event.preventDefault();
            event.stopPropagation();
        }
        return false ;
    }
    _noticeSelectExtendListShowOrHide(extendShow){
        if(this.props.noticeSelectExtendListShowOrHide && typeof this.props.noticeSelectExtendListShowOrHide === 'function'){
            this.props.noticeSelectExtendListShowOrHide(extendShow);
        }
    }
    _getRect ( elements ){
        let rect = elements.getBoundingClientRect();
        let clientTop = document.documentElement.clientTop;
        let clientLeft = document.documentElement.clientLeft;
        return { // 兼容ie多出的两个px
            top : rect.top - clientTop, // 距离顶部的位置
            bottom : rect.bottom - clientTop, // 距离顶部加上元素本身的高度就等于bottom的位置
            left : rect.left - clientLeft, // 距离左边的位置
            right : rect.right - clientLeft , // 距离右边的位置就是 距离左边的位置加上元素本身的宽度
            width:rect.width , //元素宽度
            height:rect.height , //元素高度
        };
    };
    render() {
        const { id , className ,optionClassName , selectOptions = []  ,  disabled ,isMobile = false  , currentValue  } = this.props  ;
        return (
            <div id={id} ref={"tkSelectContainer"} className={"tk-select-container clear-float " + this.state.listDirection +(disabled?' disabled ':'  ') + (className || '')  + (disabled ? ' hideExtendList':(this.state.extendShow?' showExtendList':' hideExtendList') ) }  onMouseLeave={isMobile?undefined:this.selectContainerOnMouseLeave.bind(this)} >
                <button className={"current-select-text "+(disabled?'disabled ':' ')} disabled={disabled}  onClick={disabled?undefined:this.currentTextOnClick.bind(this)} >{currentValue}</button>
                <span className={"arrow-container " +(disabled?'disabled ':' ') }>
                    <em className={"arrow "}></em>
                </span>
                <ol className={"select-extend-list-container " + this.state.listDirection + (disabled?' disabled ':'  ')+ (disabled ? ' hide':(this.state.extendShow?' show':' hide') )}  style={{display:disabled?'none':(this.state.extendShow?'block':'none') , maxHeight:"calc("+(this.maxOptionNumber)+" * 0.5rem)" }} >
                    {selectOptions.map( (item , index) => {
                        return (  <li key={index} className={"select-option "  + (optionClassName || ' ') + (currentValue === item.value?' selected':' ' )}  data-label={item.label} onClick={disabled?undefined:this.optionOnClick.bind(this , item.value , index)}  >{item.value}</li> ) ;
                    })}
                </ol>
            </div>
        )
    };
};

export  default  SelectDumb ;


