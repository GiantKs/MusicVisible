/**
 * 右侧内容-文档翻页等工具Smart组件
 * @module PagingToolBarSmart
 * @description   承载右侧内容-文档翻页等工具的所有Smart组件
 * @author QiuShao
 * @date 2017/08/14
 */
'use strict';
import React from 'react';
import { DragSource } from 'react-dnd';
import TkGlobal from 'TkGlobal' ;
import TkConstant from 'TkConstant' ;
import TkUtils from 'TkUtils';
import eventObjectDefine from 'eventObjectDefine';
import CoreController from 'CoreController';
import ServiceTooltip from 'ServiceTooltip';
import ServiceRoom from 'ServiceRoom';
import ServiceTools from 'ServiceTools';

const specSource = {
    beginDrag(props, monitor, component) {
        const { id, percentLeft,percentTop } = props;
        return { id, percentLeft,percentTop };
    },
};

function collect(connect, monitor) {
    return {
        // Call this function inside render()
        // to let React DnD handle the drag events:
        connectDragSource: connect.dragSource(),
        // You can ask the monitor about the current drag state:
        isDragging: monitor.isDragging()
    };
}

class PagingToolBarSmart extends React.Component{
    constructor(props){
        super(props);
        this.whiteboardJson = {
            disabled:{
                prevPage:true ,
                nextPage:true ,
                addPage:true
            },
            page:{
                currpage:1 ,
                totalpage:1
            },
            temporaryDisabled:{
                prevPage:false ,
                nextPage:false ,
                addPage:false
            },
            show:{
                prevPage:true ,
                nextPage:true ,
                addPage:false
            },
            onClick:{
                prevPage:this.whiteboardPrevPageClick.bind(this) ,
                nextPage:this.whiteboardNextPageClick.bind(this) ,
                addPage:this.whiteboardAddPageClick.bind(this) ,
                fullScreen:this.fullScreenClick.bind(this)
            }
        };
        this.newpptJson = {
            disabled:{
                prevPage:true ,
                nextPage:true ,
                addPage:true
            },
            page:{
                currpage:1 ,
                totalpage:1
            },
            temporaryDisabled:{
                prevPage:false ,
                nextPage:false ,
                addPage:false
            },
            show:{
                prevPage:true ,
                nextPage:true ,
                addPage:false
            },
            onClick:{
                prevPage:this.newpptPrevStepClick.bind(this) ,
                nextPage:this.newpptNextStepClick.bind(this) ,
                addPage:undefined ,
                fullScreen:this.fullScreenClick.bind(this) ,
            }
        };
        this.h5DocumentJson = {
            disabled:{
                prevPage:true ,
                nextPage:true ,
                addPage:true
            },
            page:{
                currpage:1 ,
                totalpage:1
            },
            temporaryDisabled:{
                prevPage:false ,
                nextPage:false ,
                addPage:false
            },
            show:{
                prevPage:true ,
                nextPage:true ,
                addPage:false
            },
            onClick:{
                prevPage:this.h5DocumentPrevStepClick.bind(this) ,
                nextPage:this.h5DocumentNextStepClick.bind(this) ,
                addPage:undefined ,
                fullScreen:this.fullScreenClick.bind(this) ,
            }
        };
        this.state = {
            jumpPage:CoreController.handler.getAppPermissions('jumpPage') ,
            fileTypeMark:'general' ,
            isFullScreen:false ,
            pagingDesc:this._getPaddingDesc('general') ,
            registerWhiteboardToolsList:{
                zoom_small:{
                    toolKey: 'zoom_small' ,
                    disabled:false
                } ,
                zoom_big:{
                    toolKey: 'zoom_big' ,
                    disabled:false
                }
            },
            page_wrap:{
                pagingToolLeft:"",
                pagingToolTop:"",
            },
        };
        this.listernerBackupid = new Date().getTime()+'_'+Math.random();
    };
    componentDidMount() { //在完成首次渲染之前调用，此时仍可以修改组件的state
        const that = this ;
        eventObjectDefine.Window.addEventListener( TkConstant.EVENTTYPE.WindowEvent.onResize , this.handlerOnResize.bind(this) , this.listernerBackupid );
        eventObjectDefine.Document.addEventListener(TkConstant.EVENTTYPE.DocumentEvent.onKeydown , that.handlerOnKeydown.bind(that)   , that.listernerBackupid); //document.keydown事件
        eventObjectDefine.Document.addEventListener(TkConstant.EVENTTYPE.DocumentEvent.onFullscreenchange , that.handlerOnFullscreenchange.bind(that)   , that.listernerBackupid); //document.onFullscreenchange事件
        eventObjectDefine.CoreController.addEventListener('changeFileTypeMark' , that.handlerChangeFileTypeMark.bind(that)  , that.listernerBackupid); //设置翻页栏属于普通文档还是动态PPT
        eventObjectDefine.CoreController.addEventListener('updatePagdingState' , that.handlerUpdatePagdingState.bind(that)  , that.listernerBackupid); //更新翻页状态事件
        eventObjectDefine.CoreController.addEventListener('initAppPermissions' , that.handlerInitAppPermissions.bind(that)  , that.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener('updateAppPermissions_jumpPage' , that.handlerUpdateAppPermissions_jumpPage.bind(that)  , that.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener('commonWhiteboardTool_noticeUpdateToolDesc' , that.handlerCommonWhiteboardTool_noticeUpdateToolDesc.bind(that)  , that.listernerBackupid);
        eventObjectDefine.CoreController.addEventListener('mobileSdk_fullScreenChangeCallback' , that.handlerMobileSdk_fullScreenChangeCallback.bind(that)  , that.listernerBackupid);
    };
    componentWillUnmount() { //组件被移除之前被调用，可以用于做一些清理工作，在componentDidMount方法中添加的所有任务都需要在该方法中撤销，比如创建的定时器或添加的事件监听器
        const that = this ;
        eventObjectDefine.CoreController.removeBackupListerner(that.listernerBackupid);
        eventObjectDefine.Document.removeBackupListerner(that.listernerBackupid);
        eventObjectDefine.Window.removeBackupListerner(this.listernerBackupid);
        clearTimeout(that.keydownTimer);
    };
    handlerOnResize(){
        let that = this;
        let {percentLeft,percentTop,id,isDrag} = this.props;
        TkUtils.getPagingToolLT(that,percentLeft,percentTop,id,isDrag);
        this.setState({[id]:this.state[id]});
    };
    handlerOnKeydown(recvEventData){
        const that = this ;
        if(TkGlobal.playPptVideoing || TkGlobal.playMediaFileing || TkGlobal.isSkipPageing){ //正在播放动态ppt视频或者播放媒体文件，不能执行键盘翻页事件
            return ;
        }
        let { keyCode } = recvEventData.message;
        clearTimeout(that.keydownTimer);
        that.keydownTimer = setTimeout( () => {
            if(that.state.fileTypeMark === 'general'){
                if( CoreController.handler.getAppPermissions('whiteboardPagingPage') ){
                    switch(keyCode) {
                        case 37://左键
                            eventObjectDefine.CoreController.dispatchEvent({type:'lcTextEditing' , message:{ callback:function(lcTextEditing){
                                if(!lcTextEditing){
                                    eventObjectDefine.CoreController.dispatchEvent({type:'whiteboardPrevPage'}); //通知白板执行了翻页：上一页
                                }
                            } } });
                            break ;
                        case 39://右键
                            eventObjectDefine.CoreController.dispatchEvent({type:'lcTextEditing' , message:{ callback:function(lcTextEditing){
                                if(!lcTextEditing){
                                    eventObjectDefine.CoreController.dispatchEvent({type:'whiteboardNextPage'}); //通知白板执行了翻页：下一页
                                }
                            } } });
                            break ;
                    }
                }
            }else if(that.state.fileTypeMark === 'dynamicPPT'){
                if (  CoreController.handler.getAppPermissions('newpptPagingPage')  ) {
                    switch (keyCode){
                        case 39:
                            eventObjectDefine.CoreController.dispatchEvent({type:'lcTextEditing' , message:{ callback:function(lcTextEditing){
                                if(!lcTextEditing){
                                    eventObjectDefine.CoreController.dispatchEvent({type:'newpptNextSlideClick'}); //通知动态PPT执行下一页
                                }
                            } } });
                            break ;
                        case 37:
                            eventObjectDefine.CoreController.dispatchEvent({type:'lcTextEditing' , message:{ callback:function(lcTextEditing){
                                if(!lcTextEditing){
                                    eventObjectDefine.CoreController.dispatchEvent({type:'newpptPrevSlideClick'}); //通知动态PPT执行上一页
                                }
                            } } });
                            break ;
                        case 38:
                            eventObjectDefine.CoreController.dispatchEvent({type:'newpptPrevStepClick'}); //通知动态PPT执行上一帧
                            break ;
                        case 40:
                            eventObjectDefine.CoreController.dispatchEvent({type:'newpptNextStepClick'}); //通知动态PPT执行下一帧
                            break ;
                    }
                }
            }else if(that.state.fileTypeMark === 'h5document'){
                if( CoreController.handler.getAppPermissions('h5DocumentPagingPage') ){
                    switch(keyCode) {
                        case 37://左键
                            eventObjectDefine.CoreController.dispatchEvent({type:'lcTextEditing' , message:{ callback:function(lcTextEditing){
                                if(!lcTextEditing){
                                    eventObjectDefine.CoreController.dispatchEvent({type:'h5DocumentPageUpClick'}); //通知h5文件执行下上一页
                                }
                            } } });
                            break ;
                        case 39://右键
                            eventObjectDefine.CoreController.dispatchEvent({type:'lcTextEditing' , message:{ callback:function(lcTextEditing){
                                if(!lcTextEditing){
                                    eventObjectDefine.CoreController.dispatchEvent({type:'h5DocumentPageDownClick'}); //通知h5文件执行下一页
                                }
                            } } });
                            break ;
                    }
                }
            }
        } , 400 ) ;
    };
    handlerChangeFileTypeMark(recvEventData){
        this.setState({fileTypeMark:recvEventData.message.fileTypeMark});
        this.setState({pagingDesc:this._getPaddingDesc(recvEventData.message.fileTypeMark)});
    };
    handlerUpdatePagdingState(recvEventData){
        const that = this ;
        let message = recvEventData.message ;
        if(message.source === 'whiteboard'){
            let tmpWhiteboardDesc = {
                disabled:{
                    prevPage:!( CoreController.handler.getAppPermissions('whiteboardPagingPage') && message.data.currpage > 1  )  ,
                    nextPage: !( CoreController.handler.getAppPermissions('whiteboardPagingPage') && message.data.currpage < message.data.pagenum  ) ,
                    addPage: !( CoreController.handler.getAppPermissions('sendSignallingFromWBPageCount') && message.data.currpage === message.data.pagenum && message.data.fileid === 0  )
                },
                page:{
                    currpage:message.data.currpage ,
                    totalpage:message.data.pagenum
                },
                show:{
                    prevPage:true ,
                    nextPage:!(message.data.fileid === 0 && message.data.currpage === message.data.pagenum)   ,
                    addPage: message.data.fileid === 0 && message.data.currpage === message.data.pagenum
                },
            };
            Object.assign(this.whiteboardJson , tmpWhiteboardDesc);
            if(this.state.fileTypeMark === 'general'){
                this.setState({pagingDesc:this.whiteboardJson});
            }
        }else if(message.source === 'newppt'){
            let tmpNewPptDesc = {
                disabled:{
                    prevPage:  !CoreController.handler.getAppPermissions('newpptPagingPage')   || TkGlobal.playMediaFileing ||  TkGlobal.playPptVideoing ||  (message.data.pptslide <= 1 && message.data.pptstep<=0)  ,
                    nextPage: !CoreController.handler.getAppPermissions('newpptPagingPage')  ||   TkGlobal.playMediaFileing || TkGlobal.playPptVideoing || (message.data.pptslide >= message.data.pagenum && message.data.pptstep>=message.data.steptotal-1)  ,
                    addPage:true
                },
                page:{
                    currpage:message.data.currpage ,
                    totalpage:message.data.pagenum
                },
            };
            Object.assign(this.newpptJson , tmpNewPptDesc);
            if(this.state.fileTypeMark === 'dynamicPPT' ){
                this.setState({pagingDesc:this.newpptJson});
            }
        }else if(message.source === 'h5document') {
            let h5DocumentDesc = {
                disabled:{
                    prevPage:!( CoreController.handler.getAppPermissions('h5DocumentPagingPage') && message.data.currpage > 1  )  ,
                    nextPage:!( CoreController.handler.getAppPermissions('h5DocumentPagingPage') && message.data.currpage < message.data.pagenum  ) ,
                    addPage:true
                },
                page:{
                    currpage:message.data.currpage ,
                    totalpage:message.data.pagenum
                },
            };
            Object.assign(this.h5DocumentJson , h5DocumentDesc);
            if(this.state.fileTypeMark === 'h5document' ){
                this.setState({pagingDesc:this.h5DocumentJson});
            }
        }
    };

    /*添加全屏监测处理函数*/
    handlerOnFullscreenchange(){
        if(TK.SDKTYPE !== 'mobile'){
            this.setState({isFullScreen: TkUtils.tool.getFullscreenElement() && TkUtils.tool.getFullscreenElement().id == "lc-full-vessel" });
        }
    };
    handlerMobileSdk_fullScreenChangeCallback(recvEventData){
        if(TK.SDKTYPE === 'mobile'){
            let {isFullScreen} = recvEventData.message ;
            this.setState({isFullScreen: isFullScreen });
        }
    };
    handlerInitAppPermissions(){
        this.setState({
            jumpPage:CoreController.handler.getAppPermissions('jumpPage')
        });
    };
    handlerUpdateAppPermissions_jumpPage(){
        this.setState({
            jumpPage:CoreController.handler.getAppPermissions('jumpPage')
        });
    };
    /*当前页修改的处理函数*/
    handlerCurrpageOnChange(e){
        let currpage = e.target.value ;
        currpage =  currpage.replace(/[^\d]/g, "");             //xgd 17-09-19
        this.state.pagingDesc.page.currpage = currpage ;
        this.setState({pagingDesc:this.state.pagingDesc});
    };
    /*回车键按下响应事件*/
    handlerKeyDown(e){
        const that = this ;
        if(e.keyCode=== 13){
            that.handlerCurrpageOnBlur(e);
        }
    }
    /*当前页修改的处理函数*/
    handlerCurrpageOnBlur(e){
        const that = this ;
        TkGlobal.isSkipPageing = false ;
        if( !(/^\d+$/.test(that.state.pagingDesc.page.currpage) ) ){
            ServiceTooltip.showPrompt(TkGlobal.language.languageData.alertWin.call.fun.page.pageInteger.text);
            that.state.pagingDesc.page.currpage = that.changeCurrpage ;
            that.setState({pagingDesc:that.state.pagingDesc});
            return ;
        }
        if( that.state.pagingDesc.page.currpage >  that.state.pagingDesc.page.totalpage ){
            ServiceTooltip.showPrompt(TkGlobal.language.languageData.alertWin.call.fun.page.pageMax.text);
            that.state.pagingDesc.page.currpage = that.changeCurrpage ;
            that.setState({pagingDesc:that.state.pagingDesc});
            return ;
        }
        if( that.state.pagingDesc.page.currpage <  1){
            ServiceTooltip.showPrompt(TkGlobal.language.languageData.alertWin.call.fun.page.pageMin.text);
            that.state.pagingDesc.page.currpage = that.changeCurrpage ;
            that.setState({pagingDesc:that.state.pagingDesc});
            return ;
        }
        eventObjectDefine.CoreController.dispatchEvent({type:'skipPage_'+that.state.fileTypeMark , message:{currpage:that.state.pagingDesc.page.currpage}});
        that.changeCurrpage = undefined ;
    };
    /*当前页修改的处理函数*/
    handlerCurrpageOnFocus(e){
        const that = this ;
        TkGlobal.isSkipPageing = true ;
        that.changeCurrpage = that.state.pagingDesc.page.currpage ;
    };
    whiteboardPrevPageClick(event){
        this._addTemporaryDisabled('prevPage');
        eventObjectDefine.CoreController.dispatchEvent({type:'whiteboardPrevPage'}); //通知白板执行了翻页：上一页
    };
    whiteboardNextPageClick(event){
        this._addTemporaryDisabled('nextPage');
        eventObjectDefine.CoreController.dispatchEvent({type:'whiteboardNextPage'}); //通知白板执行了翻页：下一页
    };
    whiteboardAddPageClick(event){
        this._addTemporaryDisabled('addPage');
        eventObjectDefine.CoreController.dispatchEvent({type:'whiteboardAddPage'}); //通知白板执行了加页
    };
    newpptPrevStepClick(event){
        this._addTemporaryDisabled('prevPage');
        eventObjectDefine.CoreController.dispatchEvent({type:'newpptPrevStepClick'}); //通知动态PPT执行上一帧
    };
    newpptNextStepClick(event){
        this._addTemporaryDisabled('nextPage');
        eventObjectDefine.CoreController.dispatchEvent({type:'newpptNextStepClick'}); //通知动态PPT执行下一帧
    };
    h5DocumentPrevStepClick(event) {
        this._addTemporaryDisabled('prevPage');
        eventObjectDefine.CoreController.dispatchEvent({type:'h5DocumentPageUpClick'}); //通知h5文件执行下上一页
    }
    h5DocumentNextStepClick(event) {
        this._addTemporaryDisabled('nextPage');
        eventObjectDefine.CoreController.dispatchEvent({type:'h5DocumentPageDownClick'}); //通知h5文件执行下一页
    }
    fullScreenClick(event){
        if(TK.SDKTYPE=== 'mobile'){
            let isFullScreen = !this.state.isFullScreen ;
            ServiceRoom.getTkRoom().changeWebPageFullScreen(isFullScreen);
        }else {
            let ele = document.getElementById("lc-full-vessel") ;
            if(  TkUtils.tool.isFullScreenStatus(ele) ){
                TkUtils.tool.exitFullscreen();
            }else{
                TkUtils.tool.launchFullscreen( ele );
            }
        }
    };
    handlerWhiteboard_activeCommonWhiteboardToolClick(toolKey , event){
        eventObjectDefine.CoreController.dispatchEvent({type:'whiteboard_activeCommonWhiteboardTool' , message:{toolKey}});
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
    /*获取分页数据描述*/
    _getPaddingDesc(fileTypeMark){
        fileTypeMark = fileTypeMark || this.state.fileTypeMark  ;
        if(fileTypeMark === 'general' || fileTypeMark === undefined ){
            return this.whiteboardJson ;
        }else if( fileTypeMark === 'dynamicPPT' ){
            return this.newpptJson ;
        }else if ( fileTypeMark === 'h5document' ){
            return this.h5DocumentJson ;
        }
    };
    /*添加按钮的临时disabled*/
    _addTemporaryDisabled( temporaryDisabledKey){
        let fileTypeMark = this.state.fileTypeMark ;
        let jsonKey = this.state.fileTypeMark == 'general'?'whiteboardJson':(this.state.fileTypeMark == 'dynamicPPT'?'newpptJson':'h5DocumentJson') ;
        this[jsonKey].temporaryDisabled[temporaryDisabledKey] = true ;
        this.setState({ pagingDesc:this._getPaddingDesc(this.state.fileTypeMark) });
        setTimeout( () => {
            this[jsonKey].temporaryDisabled[temporaryDisabledKey] = false ;
            if(this.state.fileTypeMark === fileTypeMark){
                this.setState({ pagingDesc:this._getPaddingDesc(this.state.fileTypeMark) });
            }
        } , 250 );
    }


    render(){
        let that = this ;
        const {connectDragSource,isDragging,percentLeft,percentTop,id,isDrag} = that.props;
        TkUtils.getPagingToolLT(that,percentLeft,percentTop,id,isDrag);
        let {pagingToolLeft,pagingToolTop} = that.state[id];
        let layerIsShowFlag = true;
        if (isDragging) {
            //layerIsShowOfDraging = false;
            let newpptLayer = document.getElementById("ppt_not_click_newppt");
            let h5DocumentLayer = document.getElementById("h5Document-layer");
            if (newpptLayer) {
                newpptLayer.style.display = 'block';
            }
            if (h5DocumentLayer) {
                h5DocumentLayer.style.display = 'block';
            }
        }else {
            let newpptLayer = document.getElementById("ppt_not_click_newppt");
            let h5DocumentLayer = document.getElementById("h5Document-layer");
            if (newpptLayer) {
                newpptLayer.style.display = 'none';
            }
            if (h5DocumentLayer) {
                h5DocumentLayer.style.display = 'none';
            }
        }
        let {fileTypeMark , isFullScreen , pagingDesc , registerWhiteboardToolsList} = that.state ;
        let { zoom_small  , zoom_big } = registerWhiteboardToolsList;
        return connectDragSource(
            <div className="header-left-page-time-container clear-float add-fr tk-tool-bottom" id="page_wrap"  style={{position:"absolute",marginLeft:isDrag?"0":"-1.6rem",left:pagingToolLeft+"rem",top:pagingToolTop+"rem"}} > {/*白板以及动态PPT下面工具条*/}
                <div className="h-page-container add-fl clear-float"  >
                    <div className={"h-page-next-prev-container add-fl clear-float " + ('tk-paging-'+fileTypeMark) } >
                        <button className={"lc-tool-icon-wrap add-fl arrow-wrap lc-prev-page " + ( pagingDesc.disabled.prevPage?' disabled' : '' ) + (pagingDesc.temporaryDisabled.prevPage?' temporary-disabled':' ') }  data-set-disabled="yes" onClick={ !pagingDesc.disabled.prevPage ? pagingDesc.onClick.prevPage : undefined }  style={{display:!pagingDesc.show.prevPage?'none':'block'}}  disabled={pagingDesc.disabled.prevPage || undefined} id="prev_page" title={TkGlobal.language.languageData.header.page.prev.text} >
                        </button>
                        <div className="lc-tool-icon-wrap  add-fl page-print not-active">
                            <span className="page-print-content">
                                <input id="curr_page"   disabled={!that.state.jumpPage ? true : undefined} className="h-page-print-oblique curr-page"  type="text" value={pagingDesc.page.currpage}  onFocus={that.handlerCurrpageOnFocus.bind(that)  }   onBlur={that.handlerCurrpageOnBlur.bind(that)  } onChange={that.handlerCurrpageOnChange.bind(that)  }  onKeyDown={that.handlerKeyDown.bind(that)}></input>
                                <span className="h-page-print-oblique">/</span>
                                <span id="all_page" className="all-page disabled " disabled={true} >{pagingDesc.page.totalpage}</span>
                            </span>
                        </div>
                        <button className={"lc-tool-icon-wrap  add-fl arrow-wrap lc-next-page " + ( pagingDesc.disabled.nextPage?' disabled' : '' ) + (pagingDesc.temporaryDisabled.nextPage?' temporary-disabled':' ') }   data-set-disabled="yes"  onClick={ !pagingDesc.disabled.nextPage ? pagingDesc.onClick.nextPage : undefined }   style={{display:!pagingDesc.show.nextPage?'none':'block'}}   disabled={pagingDesc.disabled.nextPage || undefined} id="next_page" title={TkGlobal.language.languageData.header.page.next.text}>
                        </button>
                        <button className={" lc-tool-icon-wrap   add-fl add-page lc-add-page " + ( pagingDesc.disabled.addPage?' disabled' : '' ) + (pagingDesc.temporaryDisabled.addPage?' temporary-disabled':' ')  }   id="add_literally_page"    data-set-disabled="yes"  onClick={ !pagingDesc.disabled.addPage ? pagingDesc.onClick.addPage : undefined }   style={{display:!pagingDesc.show.addPage?'none':'block'}} disabled={pagingDesc.disabled.addPage || undefined}  title={TkGlobal.language.languageData.header.page.add.text}>
                        </button>
                        <button disabled={zoom_small.disabled} className={" lc-tool-icon-wrap   add-fl lc-zoom-small " + (zoom_small.disabled?'disabled':'') }  id="tool_zoom_small" data-set-disabled="yes" title={TkGlobal.language.languageData.header.tool.tool_zoom_small.title}  onClick={that.handlerWhiteboard_activeCommonWhiteboardToolClick.bind(that , 'zoom_small')}  >
                        </button>
                        <button disabled={zoom_big.disabled} className={" lc-tool-icon-wrap   add-fl lc-zoom-big "+ (zoom_big.disabled?'disabled':'') } id="tool_zoom_big" data-set-disabled="yes" title={TkGlobal.language.languageData.header.tool.tool_zoom_big.title}   onClick={that.handlerWhiteboard_activeCommonWhiteboardToolClick.bind(that , 'zoom_big')}  >
                        </button>
                        <button className={" lc-tool-icon-wrap   add-fl lc-full " + (isFullScreen?'yes':'no') }  id="lc_full_btn"  onClick={pagingDesc.onClick.fullScreen }  title={fileTypeMark === 'general'?TkGlobal.language.languageData.header.page.lcFullBtn.title:(fileTypeMark === 'dynamicPPT'?TkGlobal.language.languageData.header.page.pptFullBtn.title:TkGlobal.language.languageData.header.page.h5FileFullBtn.title)}   >
                        </button>
                    </div>
                </div>
            </div>
        )
    };
};
export default  DragSource('talkDrag', specSource, collect)(PagingToolBarSmart);

