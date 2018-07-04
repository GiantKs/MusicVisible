/**
 * ListItem Dumb组件
 * @module ListItemDumb
 * @description   提供 List的ItemDumb组件
 * @author QiuShao
 * @date 2017/08/09
 */
'use strict';
import React  from 'react';
import TkUtils from 'TkUtils' ;
import CoreController from 'CoreController';
import TkGlobal from "TkGlobal" ;
import TkConstant from 'TkConstant';


class ListItemDumb extends React.Component {
    constructor(props) {
        super(props);
    };

    /*加载图标元素*/
    loadIconArray(iconArray){
        const beforeElementArray = [] , afterElementArray = [] ;
        if(iconArray){
            iconArray.forEach( (value , index) =>{
                value.attrJson = value.attrJson || {} ;
                const {attrJson , disabled , after , before , context , show , onClick  , onMouseLeave , iconChildren} = value ;
                const {id , title  , className , ...otherAttrs} =  attrJson ;
                const iconTemp = !iconChildren?
                    (<button key={index} style={ {display:!show ?'none':undefined} } className={'tk-icon  tk-listitem-icon '+ (before?' tk-icon-before ':' tk-icon-after ')
                    + (className?className:'') + ' ' + (disabled?' disabled ':' ') } onMouseLeave={onMouseLeave && typeof onMouseLeave === "function"?onMouseLeave:undefined}
                                            onClick={onClick && typeof onClick === "function"?onClick:undefined}  disabled={disabled?disabled:undefined} title={title} id={id} {...TkUtils.filterContainDataAttribute(otherAttrs) } >
                        {context?context:''}
                    </button>) :
                    (<span key={index} style={ {display:!show?'none':undefined} } className={'tk-icon  tk-button-span tk-listitem-icon '+ (before?' tk-icon-before ':' tk-icon-after ')
                    + (className?className:'') + ' ' + (disabled?' disabled ':' ') } onMouseLeave={onMouseLeave && typeof onMouseLeave === "function"?onMouseLeave:undefined}
                            onClick={onClick && typeof onClick === "function"?onClick:undefined}  disabled={disabled?disabled:undefined} title={title} id={id} {...TkUtils.filterContainDataAttribute(otherAttrs) } >
                        {context?context:''}
                        {iconChildren}
                    </span>) ;

                	if(before){
                        beforeElementArray.push(iconTemp)
	                }else if(after){
	                    afterElementArray.push(iconTemp)
	                }
            
            });
        }
        return{
            beforeElementArray:beforeElementArray ,
            afterElementArray:afterElementArray
        }
    }

    render() {
        let that = this;
        const { className , id  , iconArray , onClick , show ,   ...other  } = that.props  ;
        let { beforeElementArray ,  afterElementArray }  = that.loadIconArray(iconArray);
        // /*<li  className={"tk-list-item "+className} id={id}  onClick={onClick}  style={ {display:!show || id ==="file_list_0"?'none':undefined} }  {...TkUtils.filterContainDataAttribute(other) } > 文件夹模式暂时注释备份*/
        return (
            <li  className={"tk-list-item "+className} id={id}  onClick={onClick}  style={{display:TkConstant.joinRoomInfo.isDocumentClassification?(!show || id ==="file_list_0"?'none':undefined):(!show ?'none':undefined)}}  {...TkUtils.filterContainDataAttribute(other) } >
                <span className={"tk-icon-before-container tk-icon-size-"+beforeElementArray.length }  >
                    {beforeElementArray}
                </span>
                {that.props.children}
                <span className={"tk-icon-after-container tk-icon-size-"+afterElementArray.length} >
                    {afterElementArray}
                </span>
            </li>
        )
    };
}
;

export  default  ListItemDumb ;


