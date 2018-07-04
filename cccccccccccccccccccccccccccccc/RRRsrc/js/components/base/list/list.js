/**
 * List Dumb组件
 * @module ListDumb
 * @description   提供 List的Dumb组件
 * @author QiuShao
 * @date 2017/08/09
 */
'use strict';
import React  from 'react';
import ListItem  from './ListItem';
import TkUtils  from 'TkUtils';
import TkGlobal from 'TkGlobal';

class ListDumb extends React.Component{
    constructor(props){
        super(props);
    };

    /*加载ListItem组件数组*/
    loadListItem(listItemDataArray){
        const that = this ;
        const _loadListItemContext = (textContextArray) => {
            const listItemContextArray = [] ;
            const _handlerAddTextContext = (value , index) => {
            const {className , textContext , id , onClick  ,order ,   ...ohterAttrs} = value ;
//          if(order == 1) {
//			 	listItemContextArray.push(
//			 		<span key={index} title={textContext} className={"tk-listitem-context "+(className || '')  }  id={id}  onClick={onClick} {...ohterAttrs} >{textContext}({TkGlobal.language.languageData.toolContainer.toolIcon.userList.userStatus.assistant.text})</span>
//			 	)
//			 } else {
			 	listItemContextArray.push(
			 		<span key={index} title={textContext} className={"tk-listitem-context "+(className || '')  }  id={id}  onClick={onClick} {...ohterAttrs} >{textContext}</span>
			 	)
//			 }
			 };
            if(TkUtils.isArray(textContextArray)){
                textContextArray.forEach( (value , index) =>{
                    _handlerAddTextContext(value , index);
                } );
            }else{
                _handlerAddTextContext(textContextArray );
            }
            return {listItemContextArray:listItemContextArray};
        }
        const listItemArray = [] ;
        if(listItemDataArray){
            listItemDataArray.forEach( (value , index) =>{
                value = value || {} ;
                let { textContextArray , children , ...otherProps} =  value ;
                let {listItemContextArray} = _loadListItemContext(textContextArray);
                listItemArray.push(
                    <ListItem  key={index}  { ...otherProps} >
                        {listItemContextArray}
                        {children}
                    </ListItem>
                );
            });
        }
        return {listItemArray:listItemArray} ;
    }

    render(){
        let that = this ;
        let {listItemDataArray , className , id , ...otherProps } = that.props ;
        let {listItemArray} = that.loadListItem(listItemDataArray);
        return (
            <ul className={ "tk-list "+ (className || '') } id={id} { ...TkUtils.filterContainDataAttribute(otherProps) }>
                {listItemArray}
            </ul>
        )
    };
};
export  default  ListDumb ;

/*数据格式：
props = {
    id:id ,
    className:classNmae ,
    listItemDataArray:[
       {
            textContextArray:[
                {
                    className:className ,
                    id:id ,
                    textContext:textContext ,
                    ...ohterAttrs
                }
            ] ,
            className:className ,
            id:id ,
            iconArray:[
                {
                     attrJson:{
                         id:id ,
                         title:title ,
                         className:className ,
                         ...otherProps
                     } ,
                     before:before ,
                     after:after ,
                     context:context ,
                     disabled:disabled ,
                     onClick:onClick
                }
            ] ,
             ...otherProps
       }
    ] ,
    ...otherProps
}
*/

