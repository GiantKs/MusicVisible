/**
 * Button Dumb组件
 * @module ButtonDumb
 * @description   提供 Button基础组件
 * @author QiuShao
 * @date 2017/08/11
 */
'use strict';
import React  from 'react';
import TkUtils from 'TkUtils' ;

class ButtonDumb extends React.Component {
    constructor(props) {
        super(props);
    };

    render() {
        let that = this;
        const { className , id  , buttonText ,title , onClick , hide , ...other  } = that.props  ;
        return (
            <button style={{display:hide?'none':''}} className={"tk-button "+(className || '')} id={id} title={title} {...TkUtils.filterContainDataAttribute(other) }  onClick={onClick} >
                {buttonText}
            </button>
        )
    };
};
export  default  ButtonDumb ;


