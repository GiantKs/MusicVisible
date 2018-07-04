/**
 * 动态PPT组件
 * @module newPptCustomModule
 * @description  动态PPT自封装组件
 * @author QiuShao
 * @date 2017/7/10
 */
'use strict';
var NewPptAynamicPPTGLOBAL  =  {} ;
var NewPptAynamicPPT = function(options){
    var that = this ;
    this.options = options || {};
    this.isResized =  false ;
    this.sendMessagePermission = this.options.sendMessagePermission ||  true ; //发送数据的权限
    this.recvRemoteDataing = this.options.recvRemoteDataing ||  false ; //接收远端数据，则不需要发送信令
    this.isOpenPptFile = false ;
    NewPptAynamicPPTGLOBAL.newPptAynamicPPT ={
        that:that
    };
    this.aynamicPptData = {
        old:{
            slide:null ,
            step:null ,
            fileid:null
        } ,
        now:{
            slide:null ,
            step:null ,
            fileid:null
        }
    };
    this.remoteData = {} ;
    this.recvCount = 0 ;
};
NewPptAynamicPPT.prototype = {
    constructor:NewPptAynamicPPT,
    sendMessageToRemote:function (action , externalData , isGetData ) {
        var that = NewPptAynamicPPTGLOBAL.newPptAynamicPPT.that ;
        isGetData = isGetData!=undefined ?isGetData :true ;
        //if(that.sendMessagePermission){
            var data = {} ;
            if(isGetData && that.remoteData){
                data.pptslide = that.remoteData.slide+1 ;
                data.currpage = that.remoteData.slide+1 ;
                data.pptstep =that.remoteData.step>=0?that.remoteData.step:0;
                data.steptotal =that.remoteData.stepTotal;
            }
            for(var x in action){
                data[x] = action[x];
            }
            data["pagenum"] = that.remoteData.slidesCount ;
            var isInitiative = that.isInitiative(externalData);
            $(document).trigger("sendPPTMessageEvent",[data , isInitiative]);
        //}
    },
    resizeUpdatePPT:function(that){
        that.scale  = 1 ;
        $(window).trigger("resize");
    },
    resizeHandler:function (that) {
        var that = that || this ;
        if(that.isOpenPptFile){
            that.autoChangePptSize(that);
        }
    },
    autoChangePptSize:function(that){
        that = that || this ;
    },
    changeAynamicPptData:function () {
        var that = this ;
        var ts = that.remoteData;
        if( !(ts.slide!=undefined && ts.step!=undefined) ){
            return ;
        }
        var data = {
            slide: ts.slide+1 ,
            step: ts.step
        };
        for (var key in that.aynamicPptData.now){
            that.aynamicPptData.old[key] = that.aynamicPptData.now[key]  ;
        }
        that.aynamicPptData.now.fileid = that.fileid ;
        that.aynamicPptData.now.slide = data.slide;
        that.aynamicPptData.now.step = data.step ;
    },
    playerControlClass:{
        HandleSlideChange:function(n) {
            //Handle slide change here
            var that = NewPptAynamicPPTGLOBAL.newPptAynamicPPT.that ;
            $("#curr_ppt_page").html(n+1);
            $("#all_ppt_page").html(  that.remoteData.slidesCount );
            var data = {
                pptslide:n+1 ,
                currpage:n+1 ,
                fileid:that.fileid ,
                pagenum:that.remoteData.slidesCount
            };
            $(document).trigger("slideChangeToLcData", [data]);
        } ,
    },
    changeFileElementProperty:function () {
        var that = NewPptAynamicPPTGLOBAL.newPptAynamicPPT.that ;
        var ts = that.remoteData;
        if( ts.step === undefined &&  ts.stepTotal === undefined &&  ts.slide === undefined){
            return ;
        }
        var stepTotal = ts.stepTotal ;
        var slide = ts.slide + 1 ;
        var step = ts.step ;
        if(slide <=1 && step<=0){
            $("#ppt_prev_page_slide[data-set-disabled=yes] ,#prev_page_phone_slide[data-set-disabled=yes]").removeClass("disabled").addClass("disabled").attr("disabled","disabled");
        }else{
            $("#ppt_prev_page_slide[data-set-disabled=yes] ,#prev_page_phone_slide[data-set-disabled=yes]").removeClass("disabled").removeAttr("disabled");
        }
        if(slide >= that.remoteData.slidesCount && step>=stepTotal-1){
            $("#ppt_next_page_slide[data-set-disabled=yes] ,#next_page_phone_slide[data-set-disabled=yes]").removeClass("disabled").addClass("disabled").attr("disabled","disabled");
        }else{
            $("#ppt_next_page_slide[data-set-disabled=yes] ,#next_page_phone_slide[data-set-disabled=yes]").removeClass("disabled").removeAttr("disabled");
        };
/*        $("#big_literally_vessel")
            .attr("data-ppt-step" ,ts.step )
            .attr('data-ppt-step-total' , ts.stepTotal);*/
        $(document).trigger("newppt_changeFileElementProperty" , {pptstep:ts.step , steptotal:ts.stepTotal});
    },
    setSendMessagePermission:function (value) {
        var that = NewPptAynamicPPTGLOBAL.newPptAynamicPPT.that ;
        that.sendMessagePermission = value ;
    },
    setRPathAndPres:function(options){
        var that = NewPptAynamicPPTGLOBAL.newPptAynamicPPT.that ;
        options = options || {};
        that.rPathAddress = options.rPathAddress  ;
        that.PresAddress = options.PresAddress  ;
        that.fileid = options.fileid ||  null ;
        that.currScale = 1 ;
        var slideIndex = options.slideIndex || 1 ;
        var stepIndex = options.stepIndex || 0 ;
        that.remoteSlide = slideIndex;
        that.remoteStep = stepIndex;
        that.needUpdateSlideAndStep = true ;
        that.isInitFinsh = false ;
        that.setNewPptFrameSrc(that.rPathAddress+that.PresAddress);
        that.loading.loadingStart();
    },
    setNewPptFrameSrc:function (src) {
        var that = this ;
        console.log('set newppt src:' , src);
        if(src){
            $("#newppt_frame").attr("src", src) ;
        }else{
            $("#newppt_frame").removeAttr("src") ;
        }
    },
    clearAll:function () {
        var that = this ;
        that.isResized =  false ;
        that.isOpenPptFile = false ;
        that.firstLoaded = false ;
        that.sendMessagePermission = this.options.sendMessagePermission ||  true ; //发送数据的权限
        that.recvRemoteDataing = this.options.recvRemoteDataing ||  false ; //接收远端数据，则不需要发送信令
        that.contentHolder = null;
        that.contentHolderParent =  null ;
        that.pptVesselElemnt =   null;
        that.pptZoomElemnt =  null;
        that.lcToolContainer =   null;
        that.presSettings = {};
        that.aynamicPptData = {
            old:{
                slide:null ,
                step:null ,
                fileid:null
            } ,
            now:{
                slide:null ,
                step:null ,
                fileid:null
            }
        };
        that.recvCount = 0 ;
        that.setNewPptFrameSrc("");
        that.newpptFrame = null ;
    },
    recvInitEventHandler:function (slideIndex , stepIndex) {
        var that = this ;
        that.isInitFinsh = true ;
        that.changeAynamicPptData();
        that.playerControlClass.HandleSlideChange(slideIndex);
        that.onInitaliseSettingsHandler();
        that.changeFileElementProperty();
        if(that.needUpdateSlideAndStep){
            if(that.remoteSlide!=null && that.remoteStep!=null ){
                that.jumpToAnim(that.remoteSlide ,that.remoteStep );
                that.remoteSlide = null ;
                that.remoteStep = null ;
            }
            that.needUpdateSlideAndStep = false ;
        };
        if(that.remoteActionData){
            that.postMessage(that.remoteActionData);
            that.remoteActionData = null ;
        }
        var data = {
            Width: that.remoteData.view.width,
            Height: that.remoteData.view.height
        }
        $(document).trigger("updateLcScaleWhenAynicPPTInit" , [data]); //更新动态ppt的白板尺寸
        that.loading.loadingEnd();
    },
    recvSlideChangeEventHandler:function (slideIndex , externalData) {
        var that  = this;
        that.changeAynamicPptData();
        that.playerControlClass.HandleSlideChange(slideIndex);
        that.changeFileElementProperty();
        if(!that.isLoadInitSlideAndStep){
            that.isLoadInitSlideAndStep = true ;
            if(that.remoteData.slide ===0 &&  that.remoteData.step===0 ){
                return ;
            }
        }
        that.sendMessageToRemote({action: "slide"} , externalData);
    },
    recvStepChangeEventHandler:function (stepIndex , externalData) {
        var that  = this;
        that.changeAynamicPptData();
        that.changeFileElementProperty();
        if(!that.isLoadInitSlideAndStep){
            that.isLoadInitSlideAndStep = true ;
            if(that.remoteData.slide ===0 &&  that.remoteData.step===0 ){
                return ;
            }
        }
        that.sendMessageToRemote({action: "step"} , externalData);
    },
    newDopPresentation:function(options , loadUrl){ //初始化PPT对象
        var that = NewPptAynamicPPTGLOBAL.newPptAynamicPPT.that ;
        that.options = options || that.options  ;
        that.resetParameter(that.options);
        that.playbackController  = null ;
        that.remoteData.slidesCount  = null ;
        that.isPlayedPresentation  = null ;
        that.remoteData.view  = null ;
        that.presentation  = null ;
        that.isLoadInitSlideAndStep  = false ;
        if(!that.isResized){
            that.resizeUpdatePPT(that);
            that.isResized = true ;
        }
        if (!that.firstLoaded) {
            that.firstLoaded = true;
            $('#ppt_prev_page , #ppt_next_page , #btnPause , #btnPlay , #ppt_next_page_slide ,#ppt_prev_page_slide , #btnGoto , #resizer , #aynamic_ppt_click  , #tool_zoom_big_ppt , #tool_zoom_small_ppt , #prev_page_phone_slide , #next_page_phone_slide').off("click mousedown");
            $('#ppt_prev_page_slide,#prev_page_phone_slide').click(function(){
                var plugs =  $(this).attr("data-plugs") ;
                if(plugs == "newppt"){
                    that.recvCount = 0 ;
                    that.gotoPreviousStep();
                    return false ;
                }
            }) ;


            $('#ppt_next_page_slide,#next_page_phone_slide').click(function(){
                var plugs =  $(this).attr("data-plugs") ;
                if(plugs == "newppt"){
                    that.recvCount = 0 ;
                    that.gotoNextStep();
                    return false ;
                }
            }) ;


            $("#tool_zoom_big_ppt").off("click");
            $("#tool_zoom_big_ppt").click(function(){
                var plugs =  $(this).attr("data-plugs") ;
                if(plugs == "newppt"){
                    that.currScale += 0.5 ;
                    if(that.currScale >=3){
                        that.currScale = 3 ;
                    }
                    that.checkZoomStatus();
                    that.autoChangePptSize(that);
                }
            });
            $("#tool_zoom_small_ppt").off("click");
            $("#tool_zoom_small_ppt").click(function(){
                var plugs =  $(this).attr("data-plugs") ;
                if(plugs == "newppt"){
                    that.currScale -= 0.5 ;
                    if(that.currScale <=1){
                        that.currScale = 1 ;
                    }
                    that.checkZoomStatus();
                    that.autoChangePptSize(that);
                }
            });
            that.checkZoomStatus();
            var eventData = {
                eventSelector:'#ppt_prev_page , #ppt_next_page , #btnPause , #btnPlay , #ppt_next_page_slide ,#ppt_prev_page_slide , #btnGoto , #resizer , #aynamic_ppt_click , #prev_page_phone_slide , #next_page_phone_slide ' ,
                eventName:'click mousedown' ,
                rolePermissionNotExecute:'chairman' ,
                needClassBegin:true ,
            };
            $(document).trigger("cancelEvent" , [eventData]) ;
        }
        return that ;
    } ,
    checkZoomStatus:function () {
        var that = this ;
        if( that.currScale>=3){
            $("#tool_zoom_big_ppt").addClass("disabled").attr("disabled","disabled");
        }else{
            $("#tool_zoom_big_ppt").removeClass("disabled").removeAttr("disabled");
        }
        if( that.currScale<=1){
            $("#tool_zoom_small_ppt").addClass("disabled").attr("disabled","disabled");
        }else{
            $("#tool_zoom_small_ppt").removeClass("disabled").removeAttr("disabled");
        }
        $(document).trigger("updateLcScale" , [that.currScale]);
    },
    resetParameter:function(options){ //重置参数
        this.playbackController  = null ;
        this.slidesCount  = null ;
        this.isPlayedPresentation  = null ;
        this.view  = null ;
        this.presentation  = null ;
        this.options = options || this.options  || {};
        this.rPathAddress = options.rPathAddress  ;
        this.PresAddress = options.PresAddress ;
        this.fileid = options.fileid ||  null ;
        this.remoteSlide = options.remoteSlide ||  null ;
        this.remoteStep = options.remoteStep ||  null ;
        this.needUpdateSlideAndStep = false ;
        this.currScale = 1 ;
        this.recvCount = 0 ;
        this.isOpenPptFile = false ;
        this.aynamicPptData = {
            old:{
                slide:null ,
                step:null ,
                fileid:null
            } ,
            now:{
                slide:null ,
                step:null ,
                fileid:null
            }
        };
        this.formatedTotalTime = null ;
        this.presSettings = {} ;
        this.isTouchDevice = null ;
        this.ipadKeyPadFlg = null ;
        this.isPlaying = false ;
        this.remoteData = {};
    },
    postMessage:function (data) {
        var that  = this ;
        that.newpptFrame =  that.newpptFrame  ||  document.getElementById("newppt_frame")  ;
        if( that.newpptFrame.getAttribute("src") ){
            var source =  "tk_dynamicPPT" ;
            var sendData = {
                source:source ,
                data:data
            };
            sendData = JSON.stringify(sendData);
            if(that.newpptFrame && that.newpptFrame.contentWindow){
                //that.newpptFrame.contentWindow.postMessage(data , that.newpptFrame.getAttribute("src") );
                that.newpptFrame.contentWindow.postMessage(sendData ,"*" );
            }else{
                console.error("postMessage error【that.newpptFrame ，that.newpptFrame.contentWindow 】:" , that.newpptFrame , that.newpptFrame.contentWindow);
            }
        }
    },
    jumpToAnim:function (slide,step , initiative , timeOffset , autoStart ) {
        var that = NewPptAynamicPPTGLOBAL.newPptAynamicPPT.that ;
        //that.needUpdateSlideAndStep = false ;
        that.jumpToAnimTimer = that.jumpToAnimTimer || null ;
        if(that.isInitFinsh){
            // clearTimeout(that.jumpToAnimTimer);
            // that.jumpToAnimTimer = setTimeout(function () {
            var data = {
                action:"jumpToAnim" ,
                data:{
                    slide:slide  ,
                    step:step ,
                    timeOffset:timeOffset ,
                    autoStart:autoStart ,
                    initiative:initiative
                }
            } ;
            that.postMessage(data);
            // },200);
        }
    },
    onInitaliseSettingsHandler:function(){ //InitaliseSettings后的处理函数
        var that = NewPptAynamicPPTGLOBAL.newPptAynamicPPT.that ;
        $(document).trigger("updateSlidesCountToLcElement" , {pagenum:that.remoteData.slidesCount}) ;
/*        $("#big_literally_vessel")
            .attr("data-total-page" ,that.remoteData.slidesCount );*/
    } ,
    gotoPreviousStep:function () {
        var that = this ;
        if(that.isInitFinsh) {
            //clearTimeout(that.actionTimer);
            //that.actionTimer = setTimeout(function () {
            var data = {
                action:"gotoPreviousStep" ,
            } ;
            that.postMessage(data);
            //},100);
        }
    },
    gotoNextStep:function () {
        var that = this ;
        if(that.isInitFinsh) {
            //clearTimeout(that.actionTimer);
            //that.actionTimer = setTimeout(function () {
            that.recvCount = 0 ;
            var data = {
                action:"gotoNextStep" ,
            } ;
            that.postMessage(data);
            //},100);
        }
    },
    gotoNextSlide:function (autoStart) {
        var that = this ;
        if(that.isInitFinsh) {
            var ts = that.remoteData;
            if( !(ts.slide!=undefined && ts.step!=undefined) ){
                return ;
            }
            var data = {
                slide: ts.slide+1 ,
                step: ts.step
            };
            if(that.remoteData.slidesCount   &&   data.slide< that.remoteData.slidesCount) {
                that.recvCount = 0;
                var sendData = {
                    action:"gotoNextSlide" ,
                    autoStart:autoStart
                } ;
                that.postMessage(sendData);
            }
        }
    },
    gotoPreviousSlide:function (autoStart) {
        var that = this ;
        if(that.isInitFinsh) {
            var ts = that.remoteData;
            if( !(ts.slide!=undefined && ts.step!=undefined) ){
                return ;
            }
            var data = {
                slide: ts.slide+1 ,
                step: ts.step
            };
            if(that.remoteData.slidesCount  &&  data.slide > 1 ) {
                that.recvCount = 0;
                var sendData = {
                    action:"gotoPreviousSlide" ,
                    autoStart:autoStart
                } ;
                that.postMessage(sendData);
            }
        }
    },
    isInitiative:function (externalData) {
        return externalData && externalData.initiative  ;
    },
    loading:{ //加载ppt
        loadingStart:function(){
            $("#preloader_newppt").css("display" , 'block');
        } ,
        loadingEnd:function(){
            $("#preloader_newppt").css("display" , 'none');
        }
    },
};
export default NewPptAynamicPPT ;

