/**
 * 左侧工具栏-工具按钮Smart模块
 * @module ToolButtonVesselSmart
 * @description   承载左侧工具栏-工具按钮的所有组件
 * @author QiuShao
 * @date 2017/08/11
 */
'use strict';
import React from 'react';
import TkGlobal from 'TkGlobal';
import TkConstant from 'TkConstant';
import CoreController from 'CoreController';
import TkUtils from 'TkUtils';
import ServiceRoom from 'ServiceRoom';
import ButtonDumb from 'ButtonDumb';
import eventObjectDefine from 'eventObjectDefine';
import Tipbtn from '../../../../../../help';

class ToolButtonVesselSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            toolButtonDescriptionArry:this.getToolButtonDescriptionArry(),
        };
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
        this.newRaisehand = 0 ;
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this ;
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomConnected , that.handlerRoomConnected.bind(that) , that.listernerBackupid ) ; //RoomEvent事件
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomUserpropertyChanged , that.handlerRoomUserpropertyChanged.bind(that) , that.listernerBackupid  ); //room-userproperty-changed事件-收到参与者属性改变后执行更新
        eventObjectDefine.CoreController.addEventListener('initAppPermissions' , that.handlerInitAppPermissions.bind(that)  , that.listernerBackupid) ; //事件 initAppPermissions
        eventObjectDefine.CoreController.addEventListener('detectionDeviceFinsh' , that.handlerDetectionDeviceFinsh.bind(that) , that.listernerBackupid ) ; //detectionDeviceFinsh 事件
        eventObjectDefine.CoreController.addEventListener( 'resetAllLeftToolButtonOpenStateToFalse' , that.handlerResetAllLeftToolButtonOpenStateToFalse.bind(that) , that.listernerBackupid ); //resetAllLeftToolButtonOpenStateToFalse 事件-重置所有的按钮打开状态为false
        eventObjectDefine.CoreController.addEventListener( 'callAllWrapOnClick' , that.handlerCallAllWrapOnClick.bind(that) , that.listernerBackupid ); //callAllWrapOnClick 事件-点击整个页面容器
        eventObjectDefine.CoreController.addEventListener( 'areaExchange', that.handlerAreaExchange.bind(that) ,that.listernerBackupid  ); // 区域交换事件监听
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomParticipantEvicted,that.handlerRoomParticipantEvicted.bind(that) , that.listernerBackupid); //Disconnected事件：参与者被踢事件
        eventObjectDefine.CoreController.addEventListener( TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that), that.listernerBackupid); //roomDelmsg事件 下课事件 classBegin
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        const that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid);
    };

    componentWillUpdate(){ //在组件接收到新的props或者state但还没有render时被调用。在初始化时不会被调用
    };

    handlerCallAllWrapOnClick(recvEventData){
        let {event} = recvEventData.message ;
        if( !(event.target.id === 'tool_list_left' ||  $(event.target).parents("#tool_list_left").length>0 ) && !( event.target.id === 'tool_extend_container' ||  $(event.target).parents("#tool_extend_container").length>0  ) && !CoreController.handler.getAppPermissions('toolListIsShowPairMany') ){
            this.handlerResetAllLeftToolButtonOpenStateToFalse();
        }
    };

    handlerAreaExchange(event){
        const self = this,
              targetArray = ['tool_courseware_list', 'tool_media_courseware_list', 'tool_user_list'];
        let toggle = !event.message.hasExchange;
        targetArray.map((item, index)=>{self.buttonShowToggleById(item, toggle)});
    }

    buttonShowToggleById(id, toggle){
        this.state.toolButtonDescriptionArry.map((item, index)=>{
            if(item['id'] === id){
                item['show'] = toggle;
            }
        });
        this.setState({toolButtonDescriptionArry:this.state.toolButtonDescriptionArry}) ;
    }

    handlerRoomConnected(recvEventData){
        const that = this ;
  /*      if(TkConstant.hasRole.roleStudent){
            that.state.toolButtonDescriptionArry.map( (item) => {
                if(item.id === 'disable_audio' || item.id === 'disable_video'){
                    item.show = true ;
                }
            } );
            that.setState({toolButtonDescriptionArry:that.state.toolButtonDescriptionArry}) ;
        }   */
        let users = ServiceRoom.getTkRoom().getUsers();
        for(let user of Object.values(users) ){
            that._setToolButtonStateByUserproperty(user , TkUtils.getCustomUserPropertyByUser(user) );
        }
    };

    handlerInitAppPermissions(){
        const that = this ;
        for(let item of that.state.toolButtonDescriptionArry ){
            if(item.id === 'tool_user_list'){
                item.show = CoreController.handler.getAppPermissions('loadUserlist') ;
                item.open = CoreController.handler.getAppPermissions('toolListIsShowPairMany');
            }else if(item.id === 'tool_courseware_list'){
                item.show = CoreController.handler.getAppPermissions('loadCoursewarelist') ;
                item.open = false;
            }else if(item.id === 'tool_media_courseware_list'){
                item.show = CoreController.handler.getAppPermissions('loadMedialist') ;
                item.open = false;
            }else if (item.id === 'tool_setting') {
                item.show = CoreController.handler.getAppPermissions('loadSystemSettings') ;
                item.open = false;
            }
        }
        that.setState({toolButtonDescriptionArry:that.state.toolButtonDescriptionArry}) ;
    };

    handlerResetAllLeftToolButtonOpenStateToFalse(){
        this.state.toolButtonDescriptionArry.map( (itemValue , itemIndex) => {
            if(this.state.toolButtonDescriptionArry[itemIndex]['open'] &&  this.state.toolButtonDescriptionArry[itemIndex].id !== 'tool_setting' ){
                //如果是一对三十的界面则默认显示用户列表，其他重置
                if (this.state.toolButtonDescriptionArry[itemIndex]['id'] == 'tool_user_list' && CoreController.handler.getAppPermissions('toolListIsShowPairMany')) {
                    this.state.toolButtonDescriptionArry[itemIndex]['open'] = true ;
                }else {
                    this.state.toolButtonDescriptionArry[itemIndex]['open'] = false ;
                }
            }
        });
        this.setState({toolButtonDescriptionArry:this.state.toolButtonDescriptionArry});
    };

    /*加载工具条按钮*/
    loadToolButtonArray(toolbuttonArray){
        const that = this ;
        const toolButtonElementArray = [] ;
        toolbuttonArray.forEach( (value , index) => {
            const { id , className , show  , onClick  , ...other } = value ;
            toolButtonElementArray.push(
               <ButtonDumb hide={!show} className={"tk-tool-btn tool-icon " +(className || '') + ' ' +(other && other['open'] && !other['exclude-active'] ? 'active' : '' ) + ' ' +(other && other['data-circle-show'] ? 'data-circle-show' : '' ) }
                           key={index} id={id} onClick={that.handlerToolButtonClick.bind(that ,index ,id ) } {...other}  />
            );
        } );
        return {toolButtonElementArray:toolButtonElementArray} ;
    };

    /*获取工具条按钮描述数组*/
    getToolButtonDescriptionArry(){
        const that = this ;
        const toolButtonDescriptionArry = [
            {
                'className':'tl-left-document-list' ,
                'title':TkGlobal.language.languageData.toolContainer.toolIcon.documentList.title ,
                'id':'tool_courseware_list' ,
                'open':false ,
                'show':true
            } , {
                'className':'tl-left-media-document-list' ,
                'title':TkGlobal.language.languageData.toolContainer.toolIcon.mediaDocumentList.title ,
                'id':'tool_media_courseware_list' ,
                'open':false ,
                'show':(TkConstant.hasRole.roleChairman || TkConstant.hasRole.roleTeachingAssistant)?true:false,
            } , {
                'className':'tl-left-user-list circle' ,
                'title':TkGlobal.language.languageData.toolContainer.toolIcon.userList.title,
                'id':'tool_user_list' ,
                'open':false ,
                'data-circle-show':false  ,
                'show':true
            }  /*, {
                'className':'disable_audio' ,
                'title':TkGlobal.language.languageData.toolContainer.toolIcon.disableAudio.no,
                'id':'disable_audio' ,
                'open':false ,
                'show':false ,
                'exclude-active':true
            } , {
                'className':'disable_video' ,
                'title':TkGlobal.language.languageData.toolContainer.toolIcon.disableVideo.no,
                'id':'disable_video' ,
                'open':false ,
                'show':false  ,
                'exclude-active':true
            } */, {
                'className':'tl-left-setting' ,
                'title':TkGlobal.language.languageData.toolContainer.toolIcon.setting.title ,
                'id':'tool_setting' ,
                'open':false ,
                'show':true
            }, {
                'className':'tl-left-seek-help' ,
                'title':TkGlobal.language.languageData.toolContainer.toolIcon.seekHelp.title ,
                'id':'tool_seek_help' ,
                'open':false ,
                'show':( TkConstant.joinRoomInfo &&  (TkConstant.joinRoomInfo.helpcallbackurl !== '' && TkConstant.joinRoomInfo.helpcallbackurl !== null && TkConstant.joinRoomInfo.helpcallbackurl !== undefined) )?true:false,
            }
        ] ;
        return toolButtonDescriptionArry ;
    };

    /*更新*/
    updateStateFromToolButtonDescriptionArry(index , id){
        const that = this ;
        this.state.toolButtonDescriptionArry.map( (itemValue , itemIndex) => {
            if(itemIndex === index){
                itemValue['open'] = CoreController.handler.getAppPermissions('toolListIsShowPairMany')?true:(!this.state.toolButtonDescriptionArry[index]['open']) ;
                if(itemValue.id === 'tool_setting' && itemValue['open']  ){
                    eventObjectDefine.CoreController.dispatchEvent( {type: "loadDetectionDevice"  , message:{check:false, main:true} } );
                }
                if(itemValue.id === 'tool_user_list' && itemValue['open']  ){
                    that.newRaisehand = 0 ; //未查看的举手个数置为0
                    if(itemValue['data-circle-show']){
                        itemValue['data-circle-show'] = false ;
                    }
                }
            }else{
                itemValue['open'] = false ;
            }
        });
        this.setState({toolButtonDescriptionArry:this.state.toolButtonDescriptionArry}) ;
        eventObjectDefine.CoreController.dispatchEvent({
            type:'updateToolButtonDescription' ,
            message:{
                index:index ,
                id:id ,
                open:this.state.toolButtonDescriptionArry[index]['open']
            }
        }) ;
    }
    openSeekHelpLink() {
        let helpcallbackurl = TkConstant.joinRoomInfo.helpcallbackurl;
        if(helpcallbackurl){
            window.open(helpcallbackurl);
        }else{
            L.Logger.error('openSeekHelpLink(helpcallbackurl):seek url is exist , helpcallbackurl is '+helpcallbackurl+'!');
        }
    };

    handlerToolButtonClick(index , id){
        if (id === 'tool_seek_help'){
            this.openSeekHelpLink();//跳转到求助链接
            return;
        }
        this.updateStateFromToolButtonDescriptionArry( index , id ) ;
        /*if (id == 'disable_audio') {
            ServiceRoom.getTkRoom().changeMyDisableAudioState( !ServiceRoom.getTkRoom().getMySelf().disableaudio );
        }else if (id == 'disable_video') {
            ServiceRoom.getTkRoom().changeMyDisableVideoState( !ServiceRoom.getTkRoom().getMySelf().disablevideo );
        }*/
    };
    handlerRoomUserpropertyChanged(recvEventData){
        const that = this ;
        let changeProperty = recvEventData.message ;
        let user = recvEventData.user ;
        that._setToolButtonStateByUserproperty(user , changeProperty , recvEventData.type );
    };

    handlerDetectionDeviceFinsh(){ //设备切换完成后重置设备按钮状态
        const that = this ;
        that.state.toolButtonDescriptionArry.map( (itemValue) => {
            if(itemValue.id === 'tool_setting' && itemValue.open){
                itemValue.open = !itemValue.open;
            }
        });
        that.setState({toolButtonDescriptionArry:that.state.toolButtonDescriptionArry}) ;
    };

    _setToolButtonStateByUserproperty(user ,userProperty  , source  ){
        const that = this ;
        let mySelfInfo = ServiceRoom.getTkRoom().getMySelf();
        let change = false ;
        for(let [propertyKey , propertyValue] of Object.entries(userProperty) ){
            /*if(user.id === mySelfInfo.id  && (propertyKey === 'disableaudio' ||  propertyKey === 'disablevideo' )  ){
                that.state.toolButtonDescriptionArry.map((item,index) => {
                    if (item.id == 'disable_audio') {
                        item.className = 'disable_audio' + ( mySelfInfo.disableaudio?' off':'' ) ;
                        item.title = mySelfInfo.disableaudio? TkGlobal.language.languageData.toolContainer.toolIcon.disableAudio.yes:TkGlobal.language.languageData.toolContainer.toolIcon.disableAudio.no;
                        change = true ;
                    }else if (item.id == 'disable_video') {
                        item.className = 'disable_video' + ( mySelfInfo.disablevideo?' off':'' ) ;
                        item.title = mySelfInfo.disablevideo? TkGlobal.language.languageData.toolContainer.toolIcon.disableVideo.yes:TkGlobal.language.languageData.toolContainer.toolIcon.disableVideo.no;
                        change = true ;
                    }
                });
            }*/
            if(propertyKey === 'raisehand'){
                for(let value of that.state.toolButtonDescriptionArry ){
                    if(value.id === 'tool_user_list'){
                        if(value.open){ //用户列表打开
                            that.newRaisehand = 0 ; //未查看的举手个数置为0
                            if(value['data-circle-show']){
                                value['data-circle-show'] = false ;
                                change = true ;
                            }
                        }else{
                            if(propertyValue){ //举手且用户列表没打开，则未查看的举手个数+1
                                that.newRaisehand++ ;
                            }else{//举手且用户列表没打开，则未查看的举手个数-1
                                if( source === TkConstant.EVENTTYPE.RoomEvent.roomUserpropertyChanged){
                                    that.newRaisehand--;
                                }
                                that.newRaisehand =  that.newRaisehand>=0?that.newRaisehand:0 ;
                            }
                            if(that.newRaisehand>0 && !value['data-circle-show']){ //未查看的举手个数>0且没有显示circle
                                value['data-circle-show'] = true ;
                                change = true ;
                            }else if(that.newRaisehand ===0 &&  value['data-circle-show'] ){//未查看的举手个数=0且显示circle
                                value['data-circle-show'] = false ;
                                change = true ;
                            }
                        }
                        break;
                    }
                }
            }
        }
        if(change){
            that.setState({toolButtonDescriptionArry:that.state.toolButtonDescriptionArry}) ;
        }
    }

    changeButtonDescriptionToHide(){
        let that = this;
        let toolButtonDescriptionArry = that.state.toolButtonDescriptionArry;
        for(let i=0; i<toolButtonDescriptionArry.length;i++){
            toolButtonDescriptionArry[i].show = false;
        }
        that.setState({toolButtonDescriptionArry:toolButtonDescriptionArry}) ;
    }

    handlerRoomParticipantEvicted(event){
        const that = this ;
        that.changeButtonDescriptionToHide();
    }

    handlerRoomDelmsg(recvEventData){
        const that = this ;
        let delmsgData = recvEventData.message ;
        switch(delmsgData.name)
        {
            case "ClassBegin":{
                if(CoreController.handler.getAppPermissions('endClassbeginRevertToStartupLayout')){ //是否拥有下课重置界面权限
                    that.handlerResetAllLeftToolButtonOpenStateToFalse();
                }else{
                    that.changeButtonDescriptionToHide();
                }
                break;
            }
        }
    }

    render(){
        let that = this ;
        const { toolButtonElementArray } = that.loadToolButtonArray( that.state.toolButtonDescriptionArry );
        return (
            <article className={"tool-icon-wrap add-position-relative"+(( TkConstant.joinRoomInfo &&  (TkConstant.joinRoomInfo.helpcallbackurl !== '' && TkConstant.joinRoomInfo.helpcallbackurl !== null && TkConstant.joinRoomInfo.helpcallbackurl !== undefined))?' hasSeekHelpBtn':'')} id="tool_list_left"   >
                {toolButtonElementArray}
                {/* xueln 帮助组件 */}
                <Tipbtn title={TkGlobal.language.languageData.toolContainer.toolIcon.help.title}  />
                <form method="post" className="account-basic-upload add-display-none"  id="uploadForm" encType="multipart/form-data" >
                    <input type="file" name="filedata" id="filedata"  accept="" />{/*.xls,.xlsx,.ppt,.pptx,.doc,.docx,.txt,.rtf,.pdf,.bmp,.jpg,.jpeg,.png,.flv,.mp4,.swf*/}
                </form>
            </article>
        )
    };

};
export default  ToolButtonVesselSmart;

