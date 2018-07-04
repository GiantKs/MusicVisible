/**
 * 用户列表的 Dumb组件
 * @module UserListDumb
 * @description   提供用户列表的Dumb组件
 * @author QiuShao
 * @date 2017/08/10
 */
'use strict';
import React , {PropTypes} from 'react';
import TkAppListDumb  from '../tkAppList/tkAppList';
import TkUtils  from 'TkUtils';
import CoreController  from 'CoreController';
import TkGlobal from 'TkGlobal';
import eventObjectDefine from 'eventObjectDefine';
import TkConstant from '../../tk_class/TkConstant';

class UserListDumb extends React.Component{
    constructor(props){
        super(props);
    };
	 componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state


    };
   
    /*加载用户列表所需要的props*/
    loadUserListProps(titleJson ,userListItemJson ){
        const _getListItemDataArray = (userListItemJson) => {
            const listItemDataArray = [] ;
            userListItemJson.forEach( (value , index) => {
                let {id , disabled  , children , textContext , beforeIconArray ,afterIconArray , show , active ,temporaryDisabled ,  onClick   , order , clientDeviceVersionInfo, role} = value ;
                let userId = id;

                // if(TkGlobal.isBroadcast){
                //     disabled = false
                // }

                let tmpUserListItemJson = {
                    className:'user-container clear-float add-position-relative '+( disabled?' disabled ':' ') + ( active?' active ':' ')+ ( temporaryDisabled?' temporary-disabled ':' '),
                    // className:'user-container clear-float add-position-relative '+ ' disabled ' + ( temporaryDisabled?' temporary-disabled ':' '),
                    id:id ? 'userlist_'+id : undefined ,
                    textContextArray:[
                        {
                            className:'user-name add-fl add-nowrap' ,
                            textContext:textContext ,
                            order:order ,
                        }
                    ] ,
                    order:order ,
                    children:children ,
                    show:show!=undefined?show:true ,
                    onClick:onClick ,
                    role:role,
                    clientDeviceVersionInfo:clientDeviceVersionInfo,
                    iconArray:(function (afterIconArray , beforeIconArray) {
                        const tmpArr = [] ;
                        afterIconArray = afterIconArray || [] ;
                        beforeIconArray = beforeIconArray || [] ;
                        afterIconArray.forEach(function (item) {
                            const {after ,before , className , show ,title ,id ,onClick ,  ...other } = item;
                            tmpArr.push(
                                {
                                    attrJson:{
                                        className:before?'user-portrait add-fl add-block use-pic '+ ( className || '' ) :  className,
                                        title:title ,
                                        id:id,
                                    } ,
                                    before:before,
                                    after: after!=undefined? after:true,
                                    disabled:(show && id == 'ask_'+userId)?false:true ,
                                    show:show!=undefined?show:true ,
                                    onClick:onClick?onClick:undefined ,
                                    ...TkUtils.filterContainDataAttribute(other),
                                }
                            );
                        });
                        beforeIconArray.forEach(function (item) {
                            const {after ,before = true , className , show = true ,title ,id ,onClick ,onMouseLeave , disabled = true , iconChildren , ...other } = item;
                            tmpArr.push(
                                {
                                    attrJson:{
                                        className:(className || '')+' user-portrait add-fl add-block use-pic ' +' '+(clientDeviceVersionInfo==="WindowPC"?"netWindowPc":'')+' '+(clientDeviceVersionInfo=="MacPC"?"netMacPc":'') +' '+(clientDeviceVersionInfo=="AndroidPhone"?'netAndroid':'') +' '+(clientDeviceVersionInfo=="AndroidPad"?'netAndroidPad':'') +' '+(clientDeviceVersionInfo=="iPhone"?'netIPhone':'') +' '+(clientDeviceVersionInfo=="iPad"?'netIPad':'')+' '+(clientDeviceVersionInfo=="WindowClient"?'netWindowClient':'')+' '+(clientDeviceVersionInfo=="MacClient"?'netMacClient':''),
                                        title:title ,
                                        id:id,
                                    } ,
                                    iconChildren:iconChildren ,
                                    before:before,
                                    after: after!=undefined? after:false,
                                    disabled:disabled ,
                                    show:show!=undefined?show:true ,
                                    onClick:onClick?onClick:undefined ,
                                    onMouseLeave:onMouseLeave?onMouseLeave:undefined ,
                                    ...TkUtils.filterContainDataAttribute(other),
                                }
                            );
                        });
                        return tmpArr ;
                    })(afterIconArray , beforeIconArray) ,
                };

                let indexMark = undefined ;
                for(let i=0 ; i<listItemDataArray.length;i++){
                    if(order>listItemDataArray[i].order){
                        indexMark = i ;
                        break;
                    }
                }
                if(indexMark!=undefined){
                    listItemDataArray.splice(indexMark , 0 , tmpUserListItemJson ) ;
                }else{
                    listItemDataArray.push(tmpUserListItemJson);
                }
            });
            return listItemDataArray ;
        };
        
        const userListProps = {
            id:'tool_user_list_extend' ,
            className:'tool-user-list-extend'  ,
            titleJson:{
                id:'tool_user_list' ,
                title:titleJson.title ,
                number:titleJson.number
            }  ,
            listPros:{
                id:'tool_participant_user_list' ,
                className:'t-participant-user-list add-over-auto-max-height  custom-scroll-bar' ,
                listItemDataArray:_getListItemDataArray(userListItemJson) ,
            }  ,
        };
        return {userListProps:userListProps} ;
    };

    render(){
        const that = this ;
        const {titleJson , userListItemJson , show , ...otherProps} = that.props ;
        const {userListProps} = that.loadUserListProps(titleJson ,userListItemJson ) ;
        return (
            <TkAppListDumb show={show} {...userListProps} {...otherProps}  />
        )
    };
};

UserListDumb.propTypes = {
    titleJson:PropTypes.object.isRequired ,
    userListItemJson:PropTypes.object.isRequired
};
export  default  UserListDumb ;

/*
数据格式：
props = {
  show:true ,
  titleJson:{
     title:title ,
     number:number
  } ,
 userListItemJson:Map( [userid:{
     id:id,
     disabled:disabled  ,
     textContext:textContext ,
     afterIconArray:[
         {
         className:className
         }
     ]
    }
 ] ) ,
 ...otherProps
}
* */
