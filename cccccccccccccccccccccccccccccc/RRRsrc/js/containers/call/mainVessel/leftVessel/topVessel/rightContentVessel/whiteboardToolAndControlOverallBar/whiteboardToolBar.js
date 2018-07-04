/**
 * 右侧内容-白板标注工具Smart组件
 * @module WhiteboardToolBarSmart
 * @description   承载右侧内容-白板标注工具的所有Smart组件
 * @author QiuShao
 * @date 2017/08/14
 */
'use strict';
import React from 'react';
import TkGlobal from 'TkGlobal' ;
import TkConstant from 'TkConstant' ;
import eventObjectDefine from 'eventObjectDefine';
import CoreController from 'CoreController';
import ServiceSignalling from 'ServiceSignalling';

class WhiteboardToolBarSmart extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            fileTypeMark:'general' ,
            selectColor:'000000' ,
            show:false ,
            showItemJson:{
                mouse:true ,
                laser:false ,
                brush:true ,
                text:true ,
                shape:true ,
                undo:false ,
                redo:false ,
                eraser:true  ,
                clear:false ,
                colorAndSize:true,
                colors:true ,
                measure:true ,
            },
            registerWhiteboardToolsList:{
                action_clear:{
                    toolKey: 'action_clear' ,
                    disabled:false
                } ,
                action_redo:{
                    toolKey: 'action_redo' ,
                    disabled:false
                },
                action_undo:{
                    toolKey: 'action_undo' ,
                    disabled:false
                },
                tool_eraser:{
                    toolKey: 'tool_eraser' ,
                    disabled:false
                }
            },
            currentUseTool:'tool_mouse' ,
            currentExtendToolContainer:undefined ,
            currentExtendToolExtraContainer:undefined ,
            showCurrentExtendToolContainer:false ,
            useBrush:'tool_pencil' ,
            useText:'tool_text_msyh' ,
            useShape:'tool_rectangle_empty' ,
            useStrokeSize:'tool_color_measure_small' ,
            useStrokeColor:'simple_color_000000'
        };
        this.selectMouse = undefined ;
        this.colors = {
            smipleList:["#000000" , "#2d2d2d" , "#5b5b5b" , "#8e8e8e" , "#c5c5c5" , "#ffffff" ,"#ff0001" , "#06ff02" , "#0009ff" , "#ffff03"  , "#00ffff"  , "#ff03ff"]  ,
            moreList:[
                [ "#000000" , "#002d00" , "#015b00" ,  "#028e01" , "#03c501" , "#06ff02" , "#2d0000" , "#2d2d00" , "#2d5b00" , "#2d8e01" , "#2dc501" , "#2eff02"  , "#5b0000" , "#5b2d00"  , "#5b5b00" , "#5b8e01" , "#5bc501" , "#5cff02" ],
                [ "#00002d" , "#002d2d" , "#015b2d" , "#028e2d" , "#03c52d" , "#05ff2d" , "#2d002d" , "#2d2d2d" , "#2d5b2d" , "#2d8e2d" , "#2dc52d"  ,"#2eff2d" , "#5b002d" , "#5b2d2d" , "#5b5b2d" , "#5b8e2d" , "#5bc52d" , "#5cff2d" ],
                [ "#00015b" , "#002d5b" , "#005b5b" , "#018e5b" , "#02c55b" , "#05ff5b" , "#2d015b" , "#2d2d5b" , "#2d5b5b" , "#2d8e5b" , "#2dc55b" , "#2eff5b"  , "#5b005b" , "#5b2d5b" , "#5b5b5b" , "#5b8e5b" , "#5bc55b" , "#5cff5b" ],
                [ "#00038e" , "#002d8e" , "#005b8e" , "#008e8e" , "#01c58e" , "#03ff8e" , "#2c038e" , "#2d2d8e" , "#2d5b8e" , "#2d8e8e" , "#2dc58e" , "#2dff8e" , "#5b028e" , "#5b2d8e" , "#5b5b8e" , "#5b8e8e" , "#5bc58e" , "#5bff8e" ],
                [ "#0005c5" , "#002ec5" , "#005bc5" , "#008ec5" , "#00c5c5" , "#01ffc5" , "#2c05c5" , "#2c2ec5" , "#2c5bc5" , "#2c8ec5" , "#2dc5c5" , "#2dffc5" , "#5b04c5" , "#5b2ec5" , "#5b5bc5" , "#5b8ec5" , "#5bc5c5" , "#5bffc5" ],
                [ "#0009ff" , "#002eff" , "#005cff" , "#008fff" , "#00c5ff" ,"#00ffff" ,"#2c08ff" ,"#2c2eff" , "#2c5cff" , "#2c8fff" , "#2cc5ff" , "#2dffff" , "#5b08ff" , "#5b2eff" , "#5b5cff" , "#5b8fff" , "#5bc5ff" , "#5bffff" ],
                [ "#8e0000" , "#8e2d00" , "#8e5b01" , "#8e8e01" , "#8fc502" , "#8fff03" ,"#c50001" , "#c52c01" , "#c55b01" , "#c58e01" , "#c5c502" , "#c5ff03" , "#ff0001" , "#ff2c01" , "#ff5b01" , "#ff8e02" , "#ffc502" , "#ffff03" ],
                [ "#8e002d" , "#8e2d2d" , "#8e5b2d" , "#8e8e2d" , "#8fc52d" , "#8fff2d" , "#c5002d" , "#c52c2d" , "#c55b2d" , "#c58e2d" , "#c5c52d" , "#c5ff2d" , "#ff002d" , "#ff2c2d" , "#ff5b2d" , "#ff8e2d" , "#ffc52d" , "#ffff2d" ],
                [ "#8e005b" , "#8e2d5b" , "#8e5b5b" , "#8e8e5b" , "#8fc55b" , "#8fff5b" ,"#c5005b" , "#c52c5b" , "#c55b5b" , "#c58e5b" , "#c5c55b" , "#c5ff5b" , "#ff005b" , "#ff2c5b" , "#ff5b5b" , "#ff8e5b" , "#ffc55b" , "#ffff5b" ],
                [ "#8e018e" , "#8e2d8e" , "#8e5b8e" , "#8e8e8e" , "#8ec58e" , "#8fff8e" , "#c5008e" , "#c52d8e" , "#c55b8e" , "#c58e8e" , "#c5c58e" , "#c5ff8e" , "#ff008e" , "#ff2c8e" , "#ff5b8e" , "#ff8e8e" , "#ffc58e" , "#ffff8e" ],
                [ "#8e03c5" , "#8e2dc5" , "#8e5bc5" , "#8e8ec5" , "#8ec5c5" , "#8effc5" , "#c502c5" , "#c52dc5" , "#c55bc5" , "#c58ec5" , "#c5c5c5" , "#c5ffc5" , "#ff00c5" , "#ff2dc5" , "#ff5bc5" , "#ff8ec5" , "#ffc5c5" , "#ffffc5" ],
                [ "#8e07ff","#8e2eff" , "#8e5cff" , "#8e8fff" , "#8ec5ff" , "#8effff" , "#c505ff" , "#c52eff" , "#c55bff" , "#c58eff" , "#c5c5ff" , "#c5ffff" , "#ff03ff" , "#ff2dff", "#ff5bff" , "#ff8eff" , "#ffc5ff" , "#ffffff" ]
            ]
        };
        this.listernerBackupid =  new Date().getTime()+'_'+Math.random();
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this ;
        eventObjectDefine.CoreController.addEventListener('changeFileTypeMark' , that.handlerChangeFileTypeMark.bind(that) , that.listernerBackupid ); //设置翻页栏属于普通文档还是动态PPT
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomConnected , that.handlerRoomConnected.bind(that) , that.listernerBackupid  ); //roomConnected事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomPubmsg , that.handlerRoomPubmsg.bind(that) , that.listernerBackupid  ); //roomPubmsg 事件
        eventObjectDefine.CoreController.addEventListener(TkConstant.EVENTTYPE.RoomEvent.roomDelmsg , that.handlerRoomDelmsg.bind(that) , that.listernerBackupid  ); //roomDelmsg 事件
        eventObjectDefine.CoreController.addEventListener( 'callAllWrapOnClick' , that.handlerCallAllWrapOnClick.bind(that) , that.listernerBackupid ); //callAllWrapOnClick 事件-点击整个页面容器
        eventObjectDefine.CoreController.addEventListener("updateAppPermissions_canDraw" ,that.handlerUpdateAppPermissions_canDraw.bind(that) , that.listernerBackupid  ); //updateAppPermissions_canDraw：白板可画权限更新
        eventObjectDefine.CoreController.addEventListener("initAppPermissions" ,that.handlerInitAppPermissions.bind(that)  , that.listernerBackupid ); //initAppPermissions：白板可画权限更新
        eventObjectDefine.CoreController.addEventListener('resetDefaultAppPermissions' ,that.handlerResetDefaultAppPermissions.bind(that)  , that.listernerBackupid ); //resetDefaultAppPermissions：白板可画权限更新
        eventObjectDefine.CoreController.addEventListener('receive-msglist-whiteboardMarkTool' ,that.handlerReceive_msglist_whiteboardMarkTool.bind(that)  , that.listernerBackupid ); //receive-msglist-whiteboardMarkTool
        eventObjectDefine.CoreController.addEventListener('commonWhiteboardTool_noticeUpdateToolDesc' , that.handlerCommonWhiteboardTool_noticeUpdateToolDesc.bind(that)  , that.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener('teacherToolBox' , that.handlerTeacherToolBox.bind(that)  , that.listernerBackupid); //点击工具箱事件
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        const that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid);
    };
    /* //在组件完成更新后立即调用。在初始化时不会被调用
     componentDidUpdate(prevProps , prevState) { }*/

    handlerCallAllWrapOnClick(recvEventData){
        if(TK.SDKTYPE === 'mobile'){
            let {event} = recvEventData.message ;
            let parentId = this.props.parentId ||  'header_tool_vessel';
            if( !(event.target.id === parentId || ($(event.target) && $(event.target).parents("#"+parentId).length>0 ) ) ){
                if(this.state.showCurrentExtendToolContainer){
                    this.setState({showCurrentExtendToolContainer:false});//离开li则隐藏扩展框
                }
                if(this.state.currentExtendToolExtraContainer){
                    this.setState({currentExtendToolExtraContainer:undefined}); //离开li则隐藏扩展框
                }
            }
        }
    };
    handlerRoomDelmsg(recvEventData){
        let delmsgData = recvEventData.message ;
        switch(delmsgData.name) {
            case "ClassBegin":
                if(!TkConstant.joinRoomInfo.isClassOverNotLeave){
                    this.selectMouse = undefined ;
                    this._initWhiteboardToolDefaultStyle();
                }
                break;
        }
    };

    handlerRoomPubmsg(recvEventData){
        const that = this ;
        let pubmsgData = recvEventData.message ;
        switch(pubmsgData.name) {
            case "whiteboardMarkTool":
                let { selectMouse } = pubmsgData.data ;
                if(that.selectMouse !== selectMouse){
                    let isRemote = true ;
                    if(selectMouse){
                        that.selectCurrentUseTool({toolId:'tool_mouse' ,  isRemote });
                    }else{
                        that.selectExtendTool({extendToolId:'whiteboard_tool_vessel_brush' ,  isRemote });
                    }
                }
                break;
        }
    };

    handlerReceive_msglist_whiteboardMarkTool(recvEventData){
        const that = this ;
        let pubmsgData = recvEventData.message ;
        let { selectMouse } = pubmsgData.data ;
        if(that.selectMouse !== selectMouse){
            let isRemote = true ;
            if(selectMouse){
                that.selectCurrentUseTool({toolId:'tool_mouse' ,  isRemote });
            }else{
                that.selectExtendTool({extendToolId:'whiteboard_tool_vessel_brush' ,  isRemote });
            }
        }
    };

    handlerChangeFileTypeMark(recvEventData){
        this.setState({fileTypeMark:recvEventData.message.fileTypeMark});
    };

    handlerRoomConnected(recvEventData){
        if( TkConstant.hasRole.roleChairman ){ //如果是老师
            for(let key of  Object.keys(this.state.showItemJson) ){
                this.state.showItemJson[key] = true ;
            }
            if(TK.SDKTYPE === 'mobile'){
                this.state.showItemJson.laser = false ;
                this.state.showItemJson.undo = false ;
                this.state.showItemJson.redo = false ;
                this.state.showItemJson.clear = false ;
                this.state.showItemJson.colorAndSize = false ;
                this.state.showItemJson.colors = true ;
                this.state.showItemJson.measure = true ;
            }else{
                this.state.showItemJson.colors = false ;
                this.state.showItemJson.measure = false ;
            }
            this.setState({showItemJson:this.state.showItemJson});
        }else{
            if(TK.SDKTYPE === 'mobile'){
                this.state.showItemJson.laser = false ;
                this.state.showItemJson.undo = false ;
                this.state.showItemJson.redo = false ;
                this.state.showItemJson.clear = false ;
                this.state.showItemJson.colorAndSize = false ;
                this.state.showItemJson.colors = true ;
                this.state.showItemJson.measure = true ;
                this.setState({showItemJson:this.state.showItemJson});
            }
        }
        this._initWhiteboardToolDefaultStyle();
    };

    handlerUpdateAppPermissions_canDraw(recvEventData){
        this._changeCanDrawPermissions();
    };

    handlerInitAppPermissions(recvEventData){
        this._changeCanDrawPermissions();
    };

    handlerResetDefaultAppPermissions(){
        this._changeCanDrawPermissions();
    };

    handlerCommonWhiteboardTool_noticeUpdateToolDesc(recvEventData){
        let {registerWhiteboardToolsList} = recvEventData.message ;
        let isChange = false ;
        for(let key of Object.keys(this.state.registerWhiteboardToolsList) ){
            if(registerWhiteboardToolsList[key]){
                this.state.registerWhiteboardToolsList[key] = registerWhiteboardToolsList[key] ;
                isChange = true ;
            }
        }
        if(isChange){
            this.setState({
                registerWhiteboardToolsList:this.state.registerWhiteboardToolsList
            });
        }
    };

    handlerTeacherToolBox(recvEventData){
        if(this.state.showCurrentExtendToolContainer){
            this.setState({showCurrentExtendToolContainer:false});//离开li则隐藏扩展框
        }
        if(this.state.currentExtendToolExtraContainer){
            this.setState({currentExtendToolExtraContainer:undefined}); //离开li则隐藏扩展框
        }
    };

    /*所有li的鼠标移出事件处理*/
    allLiMouseLeave( elementId ){
        if(TK.SDKTYPE !== 'mobile'){
            if(this.state.showCurrentExtendToolContainer){
                this.setState({showCurrentExtendToolContainer:false});//离开li则隐藏扩展框
            }
            if(this.state.currentExtendToolExtraContainer){
                this.setState({currentExtendToolExtraContainer:undefined}); //离开li则隐藏扩展框
            }
        }
    };

    /*改变大小的点击事件*/
    changeStrokeSizeClick(strokeSizeId , strokeJson ){
        let selectedTool = {} ;
        if(this.state.currentExtendToolContainer === 'whiteboard_tool_vessel_brush'){
            selectedTool.pencil = true ;
        }else if(this.state.currentExtendToolContainer === 'whiteboard_tool_vessel_text' || (TK.SDKTYPE === 'mobile' && this.state.currentUseTool === 'tool_text' ) ){
            selectedTool.text = true ;
        }else if(this.state.currentExtendToolContainer === 'whiteboard_tool_vessel_shape'){
            selectedTool.shape = true ;
        }else if(this.state.currentUseTool === 'tool_eraser'){
            selectedTool.eraser = true ;
        }
        this.setState({useStrokeSize:strokeSizeId});
        if( TK.SDKTYPE === 'mobile' && this.state.currentExtendToolExtraContainer  ){
            this.setState({currentExtendToolExtraContainer:undefined});
        }
        eventObjectDefine.CoreController.dispatchEvent({type:'changeStrokeSize' , message:{strokeJson:strokeJson  , selectedTool:selectedTool}});
    };

    /*改变选中的颜色点击事件*/
    changeStrokeColorClick(useStrokeColorId , selectColor){
        eventObjectDefine.CoreController.dispatchEvent({type:'changeStrokeColor' , message:{selectColor:selectColor}});
        this.setState({selectColor:selectColor , useStrokeColor:useStrokeColorId});
        if( TK.SDKTYPE === 'mobile' && this.state.currentExtendToolExtraContainer  ){
            this.setState({currentExtendToolExtraContainer:undefined});
        }
    }

    /*选择当前使用的工具*/
    selectCurrentUseTool({toolId , extendToolId , isRemote = false , initiative = true  }={} , event){
        this.setState({currentUseTool:toolId});
        if(this.state.currentExtendToolContainer !== extendToolId){
            this.setState({currentExtendToolContainer:extendToolId});
        }
        if(this.state.currentExtendToolExtraContainer !== undefined){
            this.setState({currentExtendToolExtraContainer:undefined});
        }
        if( initiative && ( !extendToolId || (TK.SDKTYPE === 'mobile' && this.state.showCurrentExtendToolContainer ) ) ){
            this.setState({showCurrentExtendToolContainer:false});
        }
        if(initiative && !isRemote){
            eventObjectDefine.CoreController.dispatchEvent({type:'whiteboardToolBox'});
        }
        if(extendToolId){
            switch (extendToolId){
                case 'whiteboard_tool_vessel_brush':
                    this.setState({useBrush:toolId});
                    break;
                case 'whiteboard_tool_vessel_text':
                    let fontFamily = 'tool_text_msyh';
                    switch (toolId){
                        case 'tool_text_msyh':
                            fontFamily = TkGlobal.language.languageData.header.tool.text.Msyh.text;
                            break ;
                        case 'tool_text_ming':
                            fontFamily = TkGlobal.language.languageData.header.tool.text.Ming.text ;
                            break ;
                        case 'tool_text_arial':
                            fontFamily = TkGlobal.language.languageData.header.tool.text.Arial.text ;
                            break ;
                    }
                    eventObjectDefine.CoreController.dispatchEvent({type:'whiteboard_updateWhiteboardToolsInfo' , message:{ whiteboardToolsInfo:{fontFamily:fontFamily} }});
                    eventObjectDefine.CoreController.dispatchEvent({type:'whiteboard_updateTextFont'});
                    this.setState({useText:toolId});
                    break;
                case 'whiteboard_tool_vessel_shape':
                    this.setState({useShape:toolId});
                    break;
            }
        }
        if(  this.selectMouse !==  (toolId === 'tool_mouse') ){
            this.selectMouse =  (toolId === 'tool_mouse') ;
            eventObjectDefine.CoreController.dispatchEvent({type:'updateSelectMouse' , message:{selectMouse: this.selectMouse} })//通知白板标注工具是否更换为鼠标
            if(!isRemote){
                ServiceSignalling.sendMarkToolMouseIsSelect( this.selectMouse);
            }
        }
        if( extendToolId === 'whiteboard_tool_vessel_text'){
            this._whiteboard_activeCommonWhiteboardToolClick( 'tool_text' );
        }else{
            this._whiteboard_activeCommonWhiteboardToolClick( toolId );
        }
        if(event){
            event.preventDefault();
            event.stopPropagation();
        }
        return false ;
    };

    /*选择额外的扩展工具*/
    selectExtendExtraTool({extendToolId , isRemote = false , toolId }={} , event){
        if(extendToolId){
            if(!isRemote){
                if(this.state.currentExtendToolExtraContainer !== extendToolId){
                    this.setState({currentExtendToolExtraContainer:extendToolId});
                }else {
                    this.setState({currentExtendToolExtraContainer:undefined});
                }
            }
            this.setState({showCurrentExtendToolContainer:false});
            if(!isRemote){
                eventObjectDefine.CoreController.dispatchEvent({type:'whiteboardToolBox'});
            }
        }
        if(event){
            event.preventDefault();
            event.stopPropagation();
        }
        return false ;
    };

    /*选择扩展的工具*/
    selectExtendTool({extendToolId , isRemote = false , toolId }={} , event){
        if(extendToolId){
            if(!isRemote){
                if(this.state.currentExtendToolContainer && this.state.currentExtendToolContainer ===  extendToolId ){
                    this.setState({showCurrentExtendToolContainer:!this.state.showCurrentExtendToolContainer});//主动点击则显示扩展框
                }else{
                    this.setState({showCurrentExtendToolContainer:true});//主动点击则显示扩展框
                }
                this.setState({currentExtendToolExtraContainer:undefined });
            }else{
                this.setState({showCurrentExtendToolContainer:false  ,currentExtendToolExtraContainer:undefined });
            }
            switch (extendToolId){
                case 'whiteboard_tool_vessel_brush':
                    this.selectCurrentUseTool({toolId:this.state.useBrush , extendToolId:extendToolId , isRemote:isRemote , initiative:false} );
                    break;
                case 'whiteboard_tool_vessel_text':
                    this.selectCurrentUseTool({toolId:this.state.useText , extendToolId:extendToolId , isRemote:isRemote , initiative:false} );
                    break;
                case 'whiteboard_tool_vessel_shape':
                    this.selectCurrentUseTool({toolId:this.state.useShape , extendToolId:extendToolId , isRemote:isRemote , initiative:false} );
                    break;
            }
            if(!isRemote){
                eventObjectDefine.CoreController.dispatchEvent({type:'whiteboardToolBox'});
            }
        }
        if(event){
            event.preventDefault();
            event.stopPropagation();
        }
        return false ;
    };

    /*标注工具撤销、恢复、删除等操作*/
    useWhiteboardAction({actionId , isRemote=false}={}  , event){
        if(actionId){
            this.setState({showCurrentExtendToolContainer:false});
            this.setState({currentExtendToolExtraContainer:undefined});
            this._whiteboard_activeCommonWhiteboardToolClick(actionId);
        }
        if(event){
            event.preventDefault();
            event.stopPropagation();
        }
        return false ;
    };

    _whiteboard_activeCommonWhiteboardToolClick(toolKey){
        eventObjectDefine.CoreController.dispatchEvent({type:'whiteboard_activeCommonWhiteboardTool' , message:{toolKey}});
    };

    /*加载*/
    _loadSmipleAndMoreListToArray(smipleList , moreList){
        const that = this ;
        let smipleColorElementArray = [] ;
        let moreColorElementArray = [] ;
        smipleList.map( (item , index) => {
            smipleColorElementArray.push(
                <li key={index} className={" "+( (that.state.useStrokeColor  ===  "simple_color_"+that._colorFilter(item) )  ?  'active':'' )}  onClick={that.changeStrokeColorClick.bind( that , "simple_color_"+that._colorFilter(item) , that._colorFilter(item) )} style={{backgroundColor:item}}  id={"simple_color_"+that._colorFilter(item)} ></li>
            );
        });
        moreList.map( (itemArr , itemArrIndex) => {
            if( Array.isArray(itemArr ) ){
                let tempArr = [] ;
                itemArr.map( (item , itemIndex) => {
                    tempArr.push(
                        <li key={itemIndex}  className={" "+( (that.state.useStrokeColor  ===  "more_color_"+that._colorFilter(item) )  ?  'active':'' )} onClick={that.changeStrokeColorClick.bind( that , "more_color_"+that._colorFilter(item) , that._colorFilter(item) )}  style={{backgroundColor:item}} id={"more_color_"+that._colorFilter(item)} ></li>
                    );
                });
                moreColorElementArray.push(
                    <ul key={itemArrIndex} className="clear-float" >
                        {tempArr}
                    </ul>
                );
            }
        });
        return {
            smipleColorElementArray:smipleColorElementArray ,
            moreColorElementArray:moreColorElementArray
        }
    };

    /*颜色过滤器*/
    _colorFilter(text){
        return text.replace(/#/g,"");
    };

    /*改变可画权限*/
    _changeCanDrawPermissions(){
        let show = CoreController.handler.getAppPermissions('canDraw');
        this.setState({show:show});
    };

    _initWhiteboardToolDefaultStyle(){
        if( TkConstant.hasRole.roleChairman  ||  TkConstant.hasRole.roleTeachingAssistant){
            this.changeStrokeColorClick( "simple_color_ff0001", 'ff0001' );
        }else{
            this.changeStrokeColorClick( "simple_color_000000", '000000' );
        }

        if(this.selectMouse === undefined){
            let isRemote = true ;
            this.selectCurrentUseTool({toolId:'tool_mouse' ,  isRemote });
        }
        let sizeJson = undefined ;
        if(TK.SDKTYPE === 'mobile'){
            if(TkGlobal.mobileDeviceType === 'phone'){
                sizeJson = {pencil:5 , text:25 , eraser:120 , shape:5} ;
            }else{
                sizeJson = {pencil:5 , text:25 , eraser:50 , shape:5} ;
            }
        }else{
            sizeJson = {pencil:5 , text:18 , eraser:30 , shape:5} ;
        }
        this.changeStrokeSizeClick( 'tool_color_measure_small' , sizeJson ) ;
    };

    render(){
        let that = this ;
        let {pagingToolLeft} = this.props; /*tkpc2.0.8*/
        let { smipleColorElementArray  , moreColorElementArray} = that._loadSmipleAndMoreListToArray( that.colors.smipleList  , that.colors.moreList );
        let {mouse , laser , brush , text , shape , undo , redo , eraser  , clear ,colorAndSize , colors , measure} = that.state.showItemJson ;
        let { action_clear  , action_redo , action_undo  } = this.state.registerWhiteboardToolsList;
        let {currentUseTool , currentExtendToolContainer , showCurrentExtendToolContainer , useBrush , useText , useShape , useStrokeSize , currentExtendToolExtraContainer } = that.state ;
        return (
            <div className="whiteboard-tool-total-box add-fl clear-float">
                { (TkGlobal.mobileDeviceType !== 'phone' )? (
                    <ol className="add-fl clear-float h-tool tool-whiteboard-container pc pad " id="header_tool_vessel"  style={{display:!that.state.show ? 'none' : ''}}  > {/*白板工具栏*/}
                        {
                            !mouse?undefined: (
                                <li className={"tool-li tl-mouse " +(currentUseTool === 'tool_mouse'?'active':'') }  id="whiteboard_tool_vessel_mouse"  style={{display:!mouse?'none':undefined }} >
                                    <button className="header-tool"  title={TkGlobal.language.languageData.header.tool.mouse.title}  id="tool_mouse"   onClick={that.selectCurrentUseTool.bind(that , {toolId:'tool_mouse'  } ) }  >
                                        <span className="tool-img-wrap"></span>
                                    </button>
                                </li>
                            )
                        }

                        {
                            !laser?undefined: (
                                <li className={"tool-li tl-laser " +(currentUseTool === 'tool_laser'?'active':'')}   id="whiteboard_tool_vessel_laser" style={{display:!laser?'none':undefined }}  >
                                    <button className="header-tool"  title={TkGlobal.language.languageData.header.tool.pencil.laser.title}  id="tool_laser"  onClick={that.selectCurrentUseTool.bind(that ,{toolId:'tool_laser'  } ) } >
                                        <span className="tool-img-wrap"></span>
                                    </button>
                                </li>
                            )
                        }

                        {
                            !brush?undefined: (
                                <li className={"tool-li tl-pencil " +(currentExtendToolContainer === 'whiteboard_tool_vessel_brush'?'active ':' ') +(currentExtendToolContainer === 'whiteboard_tool_vessel_brush' && showCurrentExtendToolContainer ?'more ':' ')   } id="whiteboard_tool_vessel_brush"  onMouseLeave={that.allLiMouseLeave.bind(that  , 'whiteboard_tool_vessel_brush') }   style={{display:!brush?'none':undefined }}  >
                                    <button  className={"header-tool tool-pencil  tool-more " }   id="tool_vessel_brush"  title={TkGlobal.language.languageData.header.tool.pencil.title}    onClick={that.selectExtendTool.bind(that  ,  {extendToolId:'whiteboard_tool_vessel_brush'} ) }   tkcustomdataiconclass={useBrush} >
                                        <span className="tool-img-wrap tool-pencil-icon" ></span>
                                    </button>
                                    <div className="header-tool-extend tool-pencil-extend" style={{right:(pagingToolLeft>1.45|| pagingToolLeft === undefined?'100%':undefined),left:(pagingToolLeft<1.4  && typeof(pagingToolLeft)=="number"?'100%':undefined)}}>{/*tkpc2.0.8*/}
                                        <ul className="clear-float">
                                            <li id="tool_pencil"    className={'extend-brush-pencil '+( useBrush === 'tool_pencil' ? 'active' : '') } onClick={that.selectCurrentUseTool.bind(that ,  {toolId:'tool_pencil' , extendToolId:'whiteboard_tool_vessel_brush'  } ) } ><span  className="add-nowrap"   >{ TK.SDKTYPE === 'mobile' ? undefined:TkGlobal.language.languageData.header.tool.pencil.pen.text}</span></li>
                                            <li id="tool_highlighter"  className={ 'extend-brush-highlighter '+(useBrush === 'tool_highlighter'?'active':'') } onClick={that.selectCurrentUseTool.bind(that ,  {toolId:'tool_highlighter' , extendToolId:'whiteboard_tool_vessel_brush'  } ) }   ><span  className="add-nowrap"   >{TK.SDKTYPE === 'mobile' ? undefined:TkGlobal.language.languageData.header.tool.pencil.Highlighter.text}</span></li>
                                            <li id="tool_line"   className={ 'extend-brush-line '+(useBrush === 'tool_line'?'active':'') }  onClick={that.selectCurrentUseTool.bind(that ,  {toolId:'tool_line' , extendToolId:'whiteboard_tool_vessel_brush'  } ) }   ><span  className="add-nowrap"    >{TK.SDKTYPE === 'mobile' ? undefined:TkGlobal.language.languageData.header.tool.pencil.linellae.text}</span></li>
                                            <li id="tool_arrow" className={ 'extend-brush-arrow '+(useBrush === 'tool_arrow'?'active':'') }  onClick={that.selectCurrentUseTool.bind(that , {toolId:'tool_arrow' , extendToolId:'whiteboard_tool_vessel_brush'  } ) }  ><span  className="add-nowrap"   >{TK.SDKTYPE === 'mobile' ? undefined:TkGlobal.language.languageData.header.tool.pencil.arrow.text}</span></li>
                                        </ul>
                                    </div>
                                </li>
                            )
                        }

                        {
                            !text?undefined: (
                                TK.SDKTYPE !== 'mobile'? (
                                    <li  className={"tool-li tl-text " +(currentExtendToolContainer === 'whiteboard_tool_vessel_text'?'active ':' ') +(currentExtendToolContainer === 'whiteboard_tool_vessel_text' && showCurrentExtendToolContainer ?'more ':' ')  }   id="whiteboard_tool_vessel_text"  onMouseLeave={that.allLiMouseLeave.bind(that  , 'whiteboard_tool_vessel_text') }   style={{display:!text?'none':undefined }}  >
                                        <button className="header-tool  tool-text  tool-more"   title={TkGlobal.language.languageData.header.tool.text.title}  id="tool_text"   onClick={that.selectExtendTool.bind(that  ,  {extendToolId:'whiteboard_tool_vessel_text'} ) }    tkcustomdataiconclass={useText} >
                                            <span className="tool-img-wrap"></span>
                                        </button>
                                        <div className="header-tool-extend tool-text-extend" id="tool_text_extend" style={{right:(pagingToolLeft>1.45|| pagingToolLeft === undefined?'100%':undefined),left:(pagingToolLeft<1.4  && typeof(pagingToolLeft)=="number"?'100%':undefined)}}>{/*tkpc2.0.8*/}
                                            <ul className="clear-float">
                                                <li  id="tool_text_msyh"  className={ 'extend-text-msyh '+(useText === 'tool_text_msyh'?'active':'') }   onClick={that.selectCurrentUseTool.bind(that ,  {toolId:'tool_text_msyh' , extendToolId:'whiteboard_tool_vessel_text'   } ) }      ><span  className="add-nowrap"  >{TkGlobal.language.languageData.header.tool.text.Msyh.text}</span></li>
                                                <li  id="tool_text_ming"  className={ 'extend-text-ming '+(useText === 'tool_text_ming'?'active':'') } onClick={that.selectCurrentUseTool.bind(that ,  {toolId:'tool_text_ming' , extendToolId:'whiteboard_tool_vessel_text'   } ) }      ><span  className="add-nowrap"  >{TkGlobal.language.languageData.header.tool.text.Ming.text}</span></li>
                                                <li  id="tool_text_arial"  className={ 'extend-text-arial '+(useText === 'tool_text_arial'?'active':'') } onClick={that.selectCurrentUseTool.bind(that ,  {toolId:'tool_text_arial' , extendToolId:'whiteboard_tool_vessel_text'  } ) }     ><span  className="add-nowrap"  >{TkGlobal.language.languageData.header.tool.text.Arial.text}</span></li>
                                            </ul>
                                        </div>
                                    </li>
                                ) :(
                                    <li className={"tool-li tl-text " +(currentUseTool === 'tool_text'?'active':'')}   id="whiteboard_tool_vessel_text" style={{display:!text?'none':undefined }}  >
                                        <button className="header-tool"  title={TkGlobal.language.languageData.header.tool.text.title}  id="tool_text"  onClick={that.selectCurrentUseTool.bind(that ,{toolId:'tool_text'  } ) } >
                                            <span className="tool-img-wrap"></span>
                                        </button>
                                    </li>
                                )
                            )
                        }

                        {
                            !shape?undefined: (
                                <li  className={"tool-li tl-shape "  +(currentExtendToolContainer === 'whiteboard_tool_vessel_shape'?'active ':' ') +(currentExtendToolContainer === 'whiteboard_tool_vessel_shape' && showCurrentExtendToolContainer ?'more ':' ')  }    id="whiteboard_tool_vessel_shape"   onMouseLeave={that.allLiMouseLeave.bind(that  , 'whiteboard_tool_vessel_shape') }   style={{display:!shape?'none':undefined }}  >
                                    <button className="header-tool  tool-shape   tool-more"   title={TkGlobal.language.languageData.header.tool.shape.title}  id="tool_shape_list"  onClick={that.selectExtendTool.bind(that  ,  {extendToolId:'whiteboard_tool_vessel_shape'} ) }   tkcustomdataiconclass={useShape} >
                                        <span className="tool-img-wrap"></span>
                                    </button>
                                    <div className="header-tool-extend tool-shape-extend" style={{right:(pagingToolLeft >1.45|| pagingToolLeft === undefined?'100%':undefined),left:(pagingToolLeft<1.4  && typeof(pagingToolLeft)=="number"?'100%':undefined)}}>{/*tkpc2.0.8*/}
                                        <ul className="clear-float">
                                            <li  className={ 'extend-shape-rectangle-empty '+(useShape === 'tool_rectangle_empty'?'active':'') }   onClick={that.selectCurrentUseTool.bind(that ,  {toolId:'tool_rectangle_empty' , extendToolId:'whiteboard_tool_vessel_shape'  } ) }   id="tool_rectangle_empty"     ><span className="add-nowrap"   >{TK.SDKTYPE === 'mobile' ? undefined:TkGlobal.language.languageData.header.tool.shape.outlinedRectangle.text}</span></li>
                                            <li  className={ 'extend-shape-rectangle '+(useShape === 'tool_rectangle'?'active':'') }  onClick={that.selectCurrentUseTool.bind(that ,  {toolId:'tool_rectangle' , extendToolId:'whiteboard_tool_vessel_shape'  } ) }  id="tool_rectangle"  ><span className="add-nowrap" >{TK.SDKTYPE === 'mobile' ? undefined:TkGlobal.language.languageData.header.tool.shape.filledRectangle.text}</span></li>
                                            <li  className={ 'extend-shape-ellipse-empty '+(useShape === 'tool_ellipse_empty'?'active':'') }  onClick={that.selectCurrentUseTool.bind(that ,  {toolId:'tool_ellipse_empty' , extendToolId:'whiteboard_tool_vessel_shape'  } ) } id="tool_ellipse_empty"  ><span className="add-nowrap" >{TK.SDKTYPE === 'mobile' ? undefined:TkGlobal.language.languageData.header.tool.shape.outlinedCircle.text}</span></li>
                                            <li  className={ 'extend-shape-ellipse '+(useShape === 'tool_ellipse'?'active':'') }  onClick={that.selectCurrentUseTool.bind(that ,  {toolId:'tool_ellipse' , extendToolId:'whiteboard_tool_vessel_shape'  } ) }    id="tool_ellipse"   ><span className="add-nowrap" >{TK.SDKTYPE === 'mobile' ? undefined:TkGlobal.language.languageData.header.tool.shape.filledCircle.text}</span></li>
                                        </ul>
                                    </div>
                                </li>
                            )
                        }

                        {
                            !colors?undefined: (
                                TK.SDKTYPE === 'mobile'?(
                                    <li  className={"tool-li tl-colors "  + (currentExtendToolExtraContainer === 'whiteboard_tool_vessel_colors'?'active more':'')  }    id="whiteboard_tool_vessel_colors"   onMouseLeave={that.allLiMouseLeave.bind(that  , 'whiteboard_tool_vessel_colors') }   style={{display:!colors?'none':undefined }}  >
                                        <button className="header-tool  tool-colors   tool-more"   title={TkGlobal.language.languageData.header.tool.colors.title}  id="tool_colors_list"  onClick={that.selectExtendExtraTool.bind(that  ,  {extendToolId:'whiteboard_tool_vessel_colors'} ) }    >
                                            <span className="tool-img-wrap" style={{background:"#"+this.state.selectColor}} ></span>
                                        </button>
                                        <div className="header-tool-extend tool-colors-extend">
                                            <ul className="clear-float">
                                                <li  className={"simple-color-000000 "+( (that.state.useStrokeColor  ===  "simple_color_000000")  ?  'active':'' )}  onClick={that.changeStrokeColorClick.bind( that , "simple_color_000000" , '000000' )}  id={"mobile_simple_color_000000"} ><span className="add-nowrap" style={{backgroundColor:'#000000'}}  ></span></li>
                                                <li  className={"simple-color-ff0001 "+( (that.state.useStrokeColor  ===  "simple_color_ff0001")  ?  'active':'' )}  onClick={that.changeStrokeColorClick.bind( that , "simple_color_ff0001" , 'ff0001' )}  id={"mobile_simple_color_ff0001"} ><span className="add-nowrap"  style={{backgroundColor:'#ff0001'}} ></span></li>
                                                <li  className={"simple-color-fcd000 "+( (that.state.useStrokeColor  ===  "simple_color_fcd000")  ?  'active':'' )}  onClick={that.changeStrokeColorClick.bind( that , "simple_color_fcd000" , 'fcd000' )}  id={"mobile_simple_color_fcd000"} ><span className="add-nowrap" style={{backgroundColor:'#fcd000'}}  ></span></li>
                                                <li  className={"simple-color-0488f8 "+( (that.state.useStrokeColor  ===  "simple_color_0488f8")  ?  'active':'' )}  onClick={that.changeStrokeColorClick.bind( that , "simple_color_0488f8" , '0488f8' )}  id={"mobile_simple_color_0488f8"} ><span className="add-nowrap"  style={{backgroundColor:'#0488f8'}}  ></span></li>
                                            </ul>
                                        </div>
                                    </li>
                                ):undefined
                            )
                        }

                        {
                            !measure?undefined: (
                                TK.SDKTYPE === 'mobile'?(
                                    <li  className={"tool-li tl-measure "  + (currentExtendToolExtraContainer === 'whiteboard_tool_vessel_measure'?'active more':'') }    id="whiteboard_tool_vessel_measure"   onMouseLeave={that.allLiMouseLeave.bind(that  , 'whiteboard_tool_vessel_measure') }   style={{display:!measure?'none':undefined }}  >
                                        <button className="header-tool  tool-measure  tool-more"   title={TkGlobal.language.languageData.header.tool.measure.title}  id="tool_measure_list"  onClick={that.selectExtendExtraTool.bind(that  ,  {extendToolId:'whiteboard_tool_vessel_measure'} ) }    >
                                            <span className="tool-img-wrap" ><em  style={{width:(useStrokeSize === 'tool_color_measure_small'?0.1:(useStrokeSize === 'tool_color_measure_middle'?0.2:0.3))+'rem' , height:(useStrokeSize === 'tool_color_measure_small'?0.1:(useStrokeSize === 'tool_color_measure_middle'?0.2:0.3))+'rem'}} ></em></span>
                                        </button>
                                        <div className="header-tool-extend tool-measure-extend">
                                            <ul className="clear-float">
                                                <li id="tool_color_measure_small" onClick={that.changeStrokeSizeClick.bind(that , 'tool_color_measure_small' , {pencil:5 , text:25 , eraser:50 , shape:5} ) } className={"h-tool-measure-mobile h-tool-measure-small-mobile " +(useStrokeSize === 'tool_color_measure_small'?'active':'')}    ><span className="add-nowrap"  style={{width:'0.1rem' , height:'0.1rem'}} ></span></li>
                                                <li id="tool_color_measure_middle" onClick={that.changeStrokeSizeClick.bind(that , 'tool_color_measure_middle' , {pencil:15 , text:50 , eraser:100 , shape:15} ) } className={"h-tool-measure-mobile h-tool-measure-middle-mobile "+(useStrokeSize === 'tool_color_measure_middle'?'active':'')}  ><span className="add-nowrap" style={{width:'0.2rem' , height:'0.2rem'}} ></span></li>
                                                <li id="tool_color_measure_big" onClick={that.changeStrokeSizeClick.bind(that , 'tool_color_measure_big' , {pencil:30 , text:100 , eraser:200 , shape:30}  ) } className={"h-tool-measure-mobile h-tool-measure-big-mobile " +(useStrokeSize === 'tool_color_measure_big'?'active':'')}  ><span className="add-nowrap" style={{width:'0.3rem' , height:'0.3rem'}} ></span></li>
                                            </ul>
                                        </div>
                                    </li>
                                ):undefined
                            )
                        }

                        {
                            !undo?undefined: (
                                <li  className="tool-li tl-undo"  id="whiteboard_tool_vessel_undo"    style={{display:!undo?'none':undefined }}   >
                                    <button  disabled={action_undo.disabled} className={"header-tool not-active "+ (action_undo.disabled?'disabled':'') } id="tool_operation_undo"  title={TkGlobal.language.languageData.header.tool.undo.title} onClick={that.useWhiteboardAction.bind(that , {actionId:'action_undo'}) }  >
                                        <span className="tool-img-wrap"></span>
                                    </button>
                                </li>
                            )
                        }

                        {
                            !redo?undefined: (
                                <li  className="tool-li tl-redo" id="whiteboard_tool_vessel_redo"  style={{display:!redo?'none':undefined }}  >
                                    <button  disabled={action_redo.disabled} className={"header-tool not-active "+ (action_redo.disabled?'disabled':'') } id="tool_operation_redo" title={TkGlobal.language.languageData.header.tool.redo.title} onClick={that.useWhiteboardAction.bind(that , {actionId:'action_redo'}) }   >
                                        <span className="tool-img-wrap"></span>
                                    </button>
                                </li>
                            )
                        }

                        {
                            !eraser?undefined: (
                                <li  className={"tool-li tl-eraser " +(currentUseTool === 'tool_eraser'?'active':'')}  id="whiteboard_tool_vessel_eraser"   style={{display:!eraser?'none':undefined }} >
                                    <button className="header-tool tool-eraser" title={TkGlobal.language.languageData.header.tool.eraser.title} id="tool_eraser"    onClick={that.selectCurrentUseTool.bind(that ,  {toolId:'tool_eraser'  } ) }   >
                                        <span className="tool-img-wrap"></span>
                                    </button>
                                </li>
                            )
                        }

                        {
                            !clear?undefined: (
                                <li  className="tool-li tl-clear"  id="whiteboard_tool_vessel_clear"  style={{display:!clear?'none':undefined }} >
                                    <button  disabled={action_clear.disabled} className={"header-tool not-active "+ (action_clear.disabled?'disabled':'') } id="tool_operation_clear" title={TkGlobal.language.languageData.header.tool.clear.title} onClick={that.useWhiteboardAction.bind(that , {actionId:'action_clear'}) }  >
                                        <span className="tool-img-wrap"></span>
                                    </button>
                                </li>
                            )
                        }

                        {
                            !colorAndSize?undefined: (
                                <li  className={"tool-li tl-color " + (currentExtendToolExtraContainer === 'whiteboard_tool_vessel_color_strokesize'?'active more':'') }   id="whiteboard_tool_vessel_color_strokesize" onMouseLeave={that.allLiMouseLeave.bind(that  , 'whiteboard_tool_vessel_color_strokesize') } style={{display:!colorAndSize?'none':undefined }} >
                                    <button className="header-tool" id="tool_stroke_color_vessel" title={TkGlobal.language.languageData.header.tool.colorAndMeasure.title}  onClick={that.selectExtendExtraTool.bind(that  ,  {extendToolId:'whiteboard_tool_vessel_color_strokesize'} ) }  >
                                <span id="tool_stroke_color"  className="tool-img-wrap h-tool-color no-hover">
                                    <span  className="tool-color-show tk-tool-color" id="header_curr_color"  style={{backgroundColor:"#"+that.state.selectColor}} >
                                        <span className="tool_triangle" />
                                    </span>
                                </span>
                                    </button>
                                    <div className="header-tool-extend tool-color-extend clear-float tk-tool-color-extend" style={{right:(pagingToolLeft >1.45|| pagingToolLeft === undefined?'100%':undefined),left:(pagingToolLeft<1.4  && typeof(pagingToolLeft)=="number"?'100%':undefined)}}>{/*tkpc2.0.8*/}
                                        <div className="tool-measure-container add-fl"  id="tool_measure">
                                            <div className="h-tool-measure-title"><span>{TkGlobal.language.languageData.header.tool.colorAndMeasure.selectMeasure}</span></div>
                                            <div id="tool_color_measure_small" onClick={that.changeStrokeSizeClick.bind(that , 'tool_color_measure_small' , {pencil:5 , text:18 , eraser:30 , shape:5} ) } className={"h-tool-measure h-tool-measure-small " +(useStrokeSize === 'tool_color_measure_small'?'active':'')}    >
                                                <span></span>
                                            </div>
                                            <div id="tool_color_measure_middle" onClick={that.changeStrokeSizeClick.bind(that , 'tool_color_measure_middle' , {pencil:15 , text:36 , eraser:90 , shape:15} ) } className={"h-tool-measure h-tool-measure-middle "+(useStrokeSize === 'tool_color_measure_middle'?'active':'')}  >
                                                <span></span>
                                            </div>
                                            <div id="tool_color_measure_big" onClick={that.changeStrokeSizeClick.bind(that , 'tool_color_measure_big' , {pencil:30 , text:72 , eraser:150 , shape:30} ) } className={"h-tool-measure h-tool-measure-big " +(useStrokeSize === 'tool_color_measure_big'?'active':'')}  >
                                                <span></span>
                                            </div>
                                        </div>
                                        <div className="tool-color-container add-fl">
                                            <div className="header-tool-extend-option-wrap  header-tool-extend-option-color ">
                                                <div className="h-tool-extend-option-title"  >{TkGlobal.language.languageData.header.tool.colorAndMeasure.selectColorText}</div>
                                                <div className="h-tool-extend-option-content">
                                                    <div className="h-curr-color-wrap" id="header_curr_select_color"><span className="h-curr-color" style={{backgroundColor:"#"+this.state.selectColor}}></span></div>
                                                    <div className="h-color-list-wrap clear-float" id="header_color_list">
                                                        <div className="h-color-simple add-fl">
                                                            <ul className="clear-float" >
                                                                {smipleColorElementArray}
                                                            </ul>
                                                        </div>
                                                        <div className="h-color-more add-fl">
                                                            {moreColorElementArray}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            )
                        }

                    </ol>
                ) : (
                    <ol className="add-fl clear-float h-tool tool-whiteboard-container phone " id="header_tool_vessel"  style={{display:!that.state.show ? 'none' : ''}}  > {/*白板工具栏*/}
                        {
                            !mouse?undefined: (
                                <li className={"tool-li tl-mouse " +(currentUseTool === 'tool_mouse'?'active':'') }  id="whiteboard_tool_vessel_mouse"  style={{display:!mouse?'none':undefined }} >
                                    <button className="header-tool"  title={TkGlobal.language.languageData.header.tool.mouse.title}  id="tool_mouse"   onClick={that.selectCurrentUseTool.bind(that , {toolId:'tool_mouse'  } ) }  >
                                        <span className="tool-img-wrap"></span>
                                    </button>
                                </li>
                            )
                        }

                        {
                            !colors?undefined: (
                                <li  className={"tool-li  tl-color simple-color-000000 "+( (that.state.useStrokeColor  ===  "simple_color_000000")  ?  'active':'' )} id={"whiteboard_tool_vessel_color_000000"} style={{display:!colors?'none':undefined }} >
                                    <button className="header-tool"  id="tool_color_000000"  onClick={that.changeStrokeColorClick.bind( that , "simple_color_000000" , '000000' )}  >
                                        <span className="tool-img-wrap" style={{backgroundColor:'#000000'}}  ></span>
                                    </button>
                                </li>
                            )
                        }

                        {
                            !colors?undefined: (
                                <li  className={"tool-li tl-color  simple-color-ff0001 "+( (that.state.useStrokeColor  ===  "simple_color_ff0001")  ?  'active':'' )} id={"whiteboard_tool_vessel_color_ff0001"} style={{display:!colors?'none':undefined }}  >
                                    <button className="header-tool"  id="tool_color_ff0001"  onClick={that.changeStrokeColorClick.bind( that , "simple_color_ff0001" , 'ff0001' )}  >
                                        <span className="tool-img-wrap" style={{backgroundColor:'#ff0001'}}  ></span>
                                    </button>
                                </li>
                            )
                        }

                        {
                            !colors?undefined: (
                                <li  className={"tool-li  tl-color simple-color-fcd000 "+( (that.state.useStrokeColor  ===  "simple_color_fcd000")  ?  'active':'' )} id={"whiteboard_tool_vessel_color_fcd000"} style={{display:!colors?'none':undefined }}  >
                                    <button className="header-tool"  id="tool_color_fcd000"  onClick={that.changeStrokeColorClick.bind( that , "simple_color_fcd000" , 'fcd000' )}  >
                                        <span className="tool-img-wrap" style={{backgroundColor:'#fcd000'}}  ></span>
                                    </button>
                                </li>
                            )
                        }

                        {
                            !colors?undefined: (
                                <li  className={"tool-li  tl-color simple-color-0488f8 "+( (that.state.useStrokeColor  ===  "simple_color_0488f8")  ?  'active':'' )} id={"whiteboard_tool_vessel_color_0488f8"} style={{display:!colors?'none':undefined }}  >
                                    <button className="header-tool"  id="tool_color_0488f8"  onClick={that.changeStrokeColorClick.bind( that , "simple_color_0488f8" , '0488f8' )}  >
                                        <span className="tool-img-wrap" style={{backgroundColor:'#0488f8'}}  ></span>
                                    </button>
                                </li>
                            )
                        }

                        {
                            !brush?undefined: (
                                <li className={"tool-li tl-pencil " +(currentUseTool === 'tool_pencil'?'active':'')}   id="whiteboard_tool_vessel_pencil" style={{display:!brush?'none':undefined }}  >
                                    <button className="header-tool"  title={TkGlobal.language.languageData.header.tool.pencil.title}  id="tool_pencil"  onClick={that.selectCurrentUseTool.bind(that ,{toolId:'tool_pencil'  } ) } >
                                        <span className="tool-img-wrap"></span>
                                    </button>
                                </li>
                            )
                        }

                        {
                            !eraser?undefined: (
                                <li  className={"tool-li tl-eraser " +(currentUseTool === 'tool_eraser'?'active':'')}  id="whiteboard_tool_vessel_eraser"   style={{display:!eraser?'none':undefined }} >
                                    <button className="header-tool tool-eraser" title={TkGlobal.language.languageData.header.tool.eraser.title} id="tool_eraser"    onClick={that.selectCurrentUseTool.bind(that ,  {toolId:'tool_eraser'  } ) }   >
                                        <span className="tool-img-wrap"></span>
                                    </button>
                                </li>
                            )
                        }
                    </ol>
                )}
            </div>
        )
    };
};
export default  WhiteboardToolBarSmart;

