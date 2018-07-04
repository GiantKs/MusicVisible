/**
 * 白板组件
 * @module literallyCustomModule
 * @description  白板自封装组件
 * @author QiuShao
 * @date 2017/7/10
 */
'use strict';
/*=======自定义Literally Canvas画板=============*/
var CustomLiterallyGLOBAL = {} ;
var CustomLiterally  = function(ele , cloneElement){
//	this.literallyIDPrefix = "literallyID_" ;
    CustomLiterallyGLOBAL.thisObj = this ;
    this.ele = ele || null   ;
    this.isResized = false ;
    this.isOpenLcFile = false ;
    this.cloneCanvasEle = cloneElement || null  ;
    this.lcLitellyScalc = 16 / 9 ;
    this.watermarkImage = null ;
    this.waitingProcessShapeData = {} ; //等待处理的白板数据
    this.rolePermission = {
        laser:false
    } ;
    this.stackStorage  = {} ;//白板数据栈对象
    this.imgServiceUrl = null ;
    this.imgServicePort = null ;

    /*回掉函数*/
    this.callback = {
        onAddElementDisable:null ,
        onRemoveElementDisable:null ,
        onRemoveToolActive:null ,
        onToolActiveDetection:null
    };

    /*工具节点*/
    this.toolElement = {
        tool_pencil:"tool_pencil" ,
        tool_pencil_phone:"tool_pencil_phone" ,
        tool_eraser:"tool_eraser" ,
        tool_eraser_phone:"tool_eraser_phone" ,
        tool_text:"tool_text" ,
        tool_pan:"tool_pan" ,
        tool_line:"tool_line" ,
        tool_rectangle:"tool_rectangle" ,
        tool_rectangle_empty:"tool_rectangle_empty" ,
        tool_ellipse:"tool_ellipse" ,
        tool_ellipse_empty:"tool_ellipse_empty" ,
        tool_polygon:"tool_polygon" ,
        tool_eyedropper:"tool_eyedropper" ,
        tool_selectShape:"tool_selectShape" ,
        tool_arrow:"tool_arrow" ,
        tool_dashed:"tool_dashed" ,
        tool_fill_color:"tool_fill_color" ,
        tool_stroke_color:"tool_stroke_color" ,
        tool_background_color:"tool_background_color" ,
        tool_operation_undo:"tool_operation_undo" ,
        tool_operation_redo:"tool_operation_redo" ,
        tool_operation_clear:"tool_operation_clear" ,
        tool_zoom_big:"tool_zoom_big" ,
        tool_zoom_small:"tool_zoom_small" ,
        tool_zoom_default:"tool_zoom_default" ,
        tool_pan_default:"tool_pan_default" ,
        tool_move_scrollbar:"tool_move_scrollbar" ,
        tool_mouse:"tool_mouse" ,
        tool_mouse_phone:"tool_mouse_phone" ,
        tool_highlighter:"tool_highlighter" ,
        tool_laser:"tool_laser" ,
        tool_rotate_left:"tool_rotate_left" ,
        tool_rotate_right:"tool_rotate_right"
    };

    /*其它节点*/
    this.otherElement = {
        literallyDataLoadingWrap:"#literally_data_loading_wrap" ,
        whiteBoardOuterLayout:"#white_board_outer_layout" ,
        bigLiterallyWrap:"#big_literally_wrap" ,
        lcToolContainer:"#lc_tool_container" ,
        scrollLiterallyContainer:"#scroll_literally_container" ,
        MINWH:null ,
        BaseLiterallyWidth:960 ,
    };
    this.defaultBackImgSrc = "./js/plugs/literally/lib/img/transparent_bg.png";

};

CustomLiterally.prototype = {
    constructor:CustomLiterally,
    initConfig:{
       primaryColor:"#000000" ,
       secondaryColor:"#ffffff" ,
       backgroundColor:"#ffffff" ,
       backgroundShapes:[] ,
       snapshot: JSON.parse(L.Utils.localStorage.getItem('drawing')),
       keyboardShortcuts:true ,
       defaultStrokeWidth: 5,
       strokeWidths: [1, 2, 5, 10, 20, 30] ,
       toolbarPosition: 'top'
    } ,
    clearRedoAndUndiStack:function(){
        this.lc.clear(false);
        this.lc.redoStack.length = 0 ;
        this.lc.undoStack.length = 0 ;
    },
    clearAll:function(resetLc){
        resetLc = resetLc!=undefined && resetLc!=null?resetLc:true ;
        if(this.lc){
            this.lc.clear(false);
            this.lc.redoStack.length = 0 ;
            this.lc.undoStack.length = 0 ;
            this.stackStorage  = {} ;//白板数据栈对象
            this.waitingProcessShapeData = {} ; //等待处理的白板数据
        }
        if(resetLc){
            this.isResized = false;
            this.lc = null ;
            this.ele = null ;
            this.cloneCanvasEle = null ;
        }
    },
    lcInit:function(ele , cloneElement  ,  initConfig , isDefalutClear , isDefalutDrawingChangeEvent){
        var that = this ;
        this.lc = null ;
        this.ele = ele ||  this.ele || $("#lc_vessel") ;
        this.cloneCanvasEle = this.cloneCanvasEle || cloneElement  || $("#lc_canvas_clone") ;
        this.initConfig = initConfig || this.initConfig ;
        isDefalutClear = ( isDefalutClear == undefined || isDefalutClear == null || isDefalutClear==true ? true :false ) ;
        isDefalutDrawingChangeEvent = ( isDefalutDrawingChangeEvent == undefined || isDefalutDrawingChangeEvent == null || isDefalutDrawingChangeEvent==true ? true :false ) ;
        this.backImageResize(this,this.lcLitellyScalc,null,false);
        this.lc = LC.init(this.ele[0],this.initConfig);
        this.lc.setColor('background',this.initConfig.backgroundColor);
        this.lc.setColor('secondary',this.initConfig.secondaryColor);
        this.lc.setColor('primary',this.initConfig.primaryColor);
        this.lc.setZoom( 1 );
        this.lc.setPan(0,0);
        this.lc.backgroundShapes.length = 0;
        this.lc.backingScale = 1 ;
        if(isDefalutClear){
            this.lc.clear(false);
        }

        this.lc.on('shapeSave', this.shapeSaveEvent);
        this.lc.on("undo",this.undoEvent) ;
        this.lc.on("redo",this.redoEvent) ;
        this.lc.on("clear",this.clearEvent) ;
//      this.lc.on('drawingChange', this.drawingChangeEvent);
//      this.lc.on('snapshotLoad ', this.snapshotLoadEvent);
//      this.lc.on("doClearRedoStack",this.doClearRedoStackEvent) ;
//      this.lc.on("primaryColorChange",this.primaryColorChangeEvent) ;
//      this.lc.on("secondaryColorChange",this.secondaryColorChangeEvent) ;
//      this.lc.on("backgroundColorChange",this.backgroundColorChangeEvent) ;
//      this.lc.on("drawStart",this.drawStartEvent) ;
//      this.lc.on("drawContinue",this.drawContinueEvent) ;
//      this.lc.on("drawEnd",this.drawEndEvent) ;
//      this.lc.on("toolChange",this.toolChangeEvent) ;
//      this.lc.on('pan',  this.panEvent);
//      this.lc.on('zoom',  this.zoomEvent);
//      this.lc.on("repaint",this.repaintEvent) ;
//      this.lc.on("lc-pointerdown",this.lcPointerdownEvent) ;
//      this.lc.on("lc-pointerup",this.lcPointerupEvent) ;
//      this.lc.on("lc-pointermove",this.lcPointermoveEvent) ;
//      this.lc.on("lc-pointerdrag",this.lcPointerdragEvent) ;
//      this.setBackgroundWatermarkImage("./plugs/literally/lib/img/saturation.png");
        if(isDefalutDrawingChangeEvent){
            this.drawingChangeEvent();
        }

        /*白板工具状态量*/
        this.lc.toolStatus = {
            pencilWidth:5 ,
            eraserWidth:20 ,
            shapeWidth:5,
            eyedropperIsStroke:"stroke" ,
            strokeColor:"#000000"  ,
            fillColor:"#ffffff" ,
            backgroundColor:"#ffffff" ,
            fontSize:30 ,
            fontFamily:"微软雅黑" ,
            fontStyle:"normal" ,
            fontWeight:"normal"
        };

        /*是否是谷歌*/
        this.isChrome = false ;
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        if (userAgent.toString().toLocaleLowerCase().indexOf("chrome") > -1){
            this.isChrome = true ;
        }
        /*操作栈*/
        this.undoAndRedoStack = {} ;
        this.literallyOutsideScale = 1 ;  //白板外层盒子缩放默认为1

        if(!that.lc.watermarkImage){
            that.setBackgroundWatermarkImage("");
        }else{
            that.resizeHandler(that);
        }
        /*更新canvas*/
        if(!this.isResized){
            this.resizeUpdateCanvas(this);
            this.isResized = true ;
        }
        /* $("#big_literally_wrap").scroll( function (e) {
            var $big_literally_wrap = $("#big_literally_wrap") ;
            var scrollTop = $big_literally_wrap.scrollTop();
            var scrollLeft = $big_literally_wrap.scrollLeft();
            var outerHeight = $big_literally_wrap.outerHeight();
            var outerWidth = $big_literally_wrap.outerWidth();
            console.error( scrollTop ,  scrollLeft , outerWidth ,  outerHeight , scrollTop / outerHeight , scrollLeft/outerWidth ) ;
        } );*/
        return this ;
    },
    resetLcDefault:function () {
        var that = this ;
        that.eleWHPercent = 1 ;
        that.lc.rotateDeg = 0 ;
        var initiative = true ;
        that.scaleButtonStyle(initiative);
        that.resizeHandler(that);
    },
    resizeUpdateCanvas:function(that){
        that.x = 0 ;
        that.scale  = 1 ;
        that.eleWHPercent = 1 ; //canvas包裹元素宽高百分比
        that.y=0 ;
        that.canvastimer = null ;
        $(window).trigger("resize");
    },
    resizeHandler:function (that) {
        var that = that || this ;
        if(that.lc){
            var backImg =  that.lc.watermarkImage ;
            if(backImg &&  backImg.src ){
                var imgScale = backImg.width / backImg.height;
                that.backImageResize(that, imgScale, backImg, true, true);
            }else{
                that.backImageResize(that,that.lcLitellyScalc,backImg,true,false);
            }
        }
    },
    batchReceiveSnapshot:function(shapeJsonList){ //批量操作shape画图
    
        for (var i=0 ; i<shapeJsonList.length; i++ ) {
            var doNotPaint = true ;
            if( i == shapeJsonList.length-1){
                doNotPaint = false ;
            }
            this.remoteSaveShape( shapeJsonList[i]   , doNotPaint);
        }
        this.operationIsAbled();
    },
    receiveSnapshot:function(obj ){  //接收shape进行画操作
        var doNotPaint = false ;
        this.remoteSaveShape( obj    , doNotPaint);
        this.operationIsAbled();
    },
    remoteSaveShape:function(obj   , doNotPaint){ //处理shape画操作
        if(obj.data!=null && obj.data.eventType!=null){
            if( obj.source === 'delmsg' ){
                switch(obj.data.eventType){
                    //回放的delmsg数据不是发送上去的数据，而是撤销的动作的相关描述，所以这里需要做兼容，如果是来自于delmsg的则事件类型为shapeSaveEvent和clearEvent也执行撤销操作
                    case "shapeSaveEvent":
                    case "clearEvent":
                    case "undoEvent":
                        if(obj.data.actionName && obj.data.actionName === "AddShapeAction"){
                            this.lc.undo(false , obj.data.shapeId);
                        }else if( obj.data.actionName && obj.data.actionName === "ClearAction" ){
                            this.lc.undo(false , obj.data.clearActionId);
                        }
                        break ;
                }
            }else{
                switch(obj.data.eventType){
                    case "shapeSaveEvent":
                        if(obj.data && obj.data.data && obj.data.data.data){
                            obj.data.data = LC.JSONToShape(obj.data.data);
                        }
                        this.lc.saveShape(  obj.data.data  , false  , null , doNotPaint);
                        break ;
                    case "undoEvent":
                        if(obj.data.actionName && obj.data.actionName === "AddShapeAction"){
                            this.lc.undo(false , obj.data.shapeId);
                        }else if( obj.data.actionName && obj.data.actionName === "ClearAction" ){
                            this.lc.undo(false , obj.data.clearActionId);
                        }
                        break ;
                    case "redoEvent":
                        if(obj.data.actionName && obj.data.actionName === "AddShapeAction"){
                            var flag = false ;  //恢复栈中是否有该shape
                            for (var i= this.lc.redoStack.length-1 ; i>=0 ; i-- ) {
                                if( obj.data.shapeId === this.lc.redoStack[i].shapeId){
                                    this.lc.redoStack.splice(i,1);
                                    flag = true ;
                                    break ;
                                }
                            }
                            if(obj.data && obj.data.data && obj.data.data.data){
                                obj.data.data = LC.JSONToShape(obj.data.data);
                            }
                            this.lc.saveShape(  obj.data.data  , false  , null , doNotPaint);
                        }else if( obj.data.actionName && obj.data.actionName === "ClearAction" ){
                            this.lc.clear(false , null);
                        }
                        break ;
                    case "clearEvent":
                        this.lc.clear(false , null);
                        break ;
                    case "laserMarkEvent":
                        var $laserMark =  $(this.lc.containerEl).parent().find(".laser-mark");
                        switch (obj.data.actionName){
                            case "show":
                                $laserMark.show();
                                break;
                            case "hide":
                                $laserMark.hide();
                                break;
                            case "move":
                                if(obj.data && obj.data.laser){
                                    var left = obj.data.laser.left ;
                                    var top = obj.data.laser.top ;
                                    $laserMark.css({
                                        "left":left+"%" ,
                                        "top":top+"%"
                                    });
                                }
                                break;
                            default:
                                break;
                        }
                        break ;
                    case "changeZoomEvent":
                        this.eleWHPercent = obj.data.zoom ;
                        this.scaleButtonStyle();
                        this.resizeHandler(this);
                       /* var $big_literally_wrap = $("#big_literally_wrap") ;
                        var outerHeight = $big_literally_wrap.outerHeight();
                        var outerWidth = $big_literally_wrap.outerWidth();
                        var scrollTop =  outerHeight * obj.data.scroll.top ;
                        var scrollLeft =  outerWidth * obj.data.scroll.left ;
                        $big_literally_wrap.scrollTop( scrollTop );
                        $big_literally_wrap.scrollLeft( scrollLeft );*/
                        break ;
                    default:
                        break ;
                }
            }
        }
    },
    sendMessageCommonFunction:function(eventType , parameter){
        var thisObj = this ;
        switch(eventType){
            case "shapeSaveEvent":
                var shapeData  = LC.shapeToJSON(parameter.shape);
                if(shapeData!=null && shapeData.className != null && (shapeData.className == "LinePath" || shapeData.className == "ErasedLinePath" )){
                    shapeData.data.smoothedPointCoordinatePairs = null ;
                    delete shapeData.data.smoothedPointCoordinatePairs;
                    var tmpData = shapeData.data.pointCoordinatePairs ;
                    tmpData.forEach(function (item) {
                        item[0] = Math.round( item[0] )  ;
                        item[1] = Math.round(  item[1]  ) ;
                    });
                }
                var testData  = {eventType:eventType , actionName:parameter.action.actionName , shapeId:parameter.shapeId , data:shapeData  };
                var signallingName = "SharpsChange" ;
                $(document).trigger("sendDataToLiterallyEvent",[ parameter.shapeId , testData , signallingName]);
                break;
            case "undoEvent" :
                if( parameter.action.actionName === "AddShapeAction" ){
                    var shapeId = parameter.action.shapeId ;
                    var testData  = {eventType:eventType , actionName:parameter.action.actionName  , shapeId:shapeId  };
                    var signallingName = "SharpsChange" ;
                    $(document).trigger("deleteLiterallyDataEvent",[ shapeId , testData , signallingName ]);
                }else if(parameter.action.actionName === "ClearAction"){
                    var clearActionId = parameter.action.id ;
                    var testData  = {eventType:eventType , actionName:parameter.action.actionName  , clearActionId:clearActionId  };
                    var signallingName = "SharpsChange" ;
                    $(document).trigger("deleteLiterallyDataEvent",[ clearActionId , testData , signallingName ]);
                }
                break ;
            case "redoEvent" :
                if( parameter.action.actionName === "AddShapeAction" ){
                    var shapeData  = LC.shapeToJSON(parameter.action.shape);
                    if(shapeData!=null && shapeData.className != null && (shapeData.className == "LinePath" || shapeData.className == "ErasedLinePath" )){
                        shapeData.data.smoothedPointCoordinatePairs = null ;
                        delete shapeData.data.smoothedPointCoordinatePairs;
                        var tmpData = shapeData.data.pointCoordinatePairs ;
                        tmpData.forEach(function (item) {
                            item[0] = Math.round( item[0] )  ;
                            item[1] = Math.round(  item[1]  ) ;
                        });
                    }
                    var shapeId =  parameter.action.shapeId ;
                    var testData  = {eventType:eventType  , actionName:parameter.action.actionName  , shapeId:shapeId ,  data:shapeData };
                    var signallingName = "SharpsChange" ;
                    $(document).trigger("sendDataToLiterallyEvent",[ shapeId , testData , signallingName]);
                }else if(parameter.action.actionName === "ClearAction"){
                    var clearActionId = parameter.action.id ;
                    var testData  = {eventType:eventType , actionName:parameter.action.actionName , clearActionId:clearActionId };
                    var signallingName = "SharpsChange" ;
                    $(document).trigger("sendDataToLiterallyEvent",[clearActionId , testData , signallingName]);
                }
                break ;
            case "clearEvent":
                var clearActionId = parameter.clearActionId;
                var testData  = {eventType:eventType , actionName:parameter.action.actionName , clearActionId:clearActionId};
                var signallingName = "SharpsChange" ;
                $(document).trigger("sendDataToLiterallyEvent",[ clearActionId , testData , signallingName]);
                break ;
            case "laserMarkEvent":
                var signallingName = "SharpsChange" ;
                var laserMarkId =  "laserMarkEvent";
                var testData  = {eventType:eventType , actionName:parameter.action.actionName };
                if(parameter && parameter.laser){
                    testData.laser = parameter.laser
                }
                var do_not_save = true ;
                $(document).trigger("sendDataToLiterallyEvent",[ laserMarkId , testData , signallingName , undefined , do_not_save]);
                break ;
            case "changeZoomEvent":
                var signallingName = "SharpsChange" ;
                var zoomId =  "changeZoomEvent";
                var testData  = {eventType:eventType , actionName:parameter.action.actionName };
                if(parameter && parameter.zoom){
                    testData.zoom = parameter.zoom
                }
                if(parameter && parameter.scroll){
                    testData.scroll = parameter.scroll
                }
                var do_not_save = undefined ;
                $(document).trigger("sendDataToLiterallyEvent",[ zoomId , testData , signallingName , undefined , do_not_save]);
                break ;
        }
    },
    setBackgroundWatermarkImage:function(imgUrl){
        console.log("setBackgroundWatermarkImage imgUrl:" , imgUrl);
        var that = this ;
        that.eleWHPercent = 1 ;
        var $_thisLC = this.lc ;
        $_thisLC.watermarkImage = null;
        if(  imgUrl=="" || imgUrl==null || imgUrl==undefined ){
            that.hideCanvasBackground();
            //that.backImg = new Image();
            // that.backImg.src = that.defaultBackImgSrc;
            //that.backImg.src = that.defaultBackImgSrc+"?ts" + new Date().getTime();
            that.backImageResize(that, that.lcLitellyScalc, that.backImg, true, false);
            $_thisLC.watermarkScale = 1;
            //$_thisLC.setWatermarkImage(that.backImg);
        }else{
            that.showCanvasBackground();
            $(that.otherElement.literallyDataLoadingWrap).show();
            that.time = that.time!=undefined || null ;
            clearTimeout(that.time);
            that.time = setTimeout(function(){
                that.backImg = new Image();
                that.backImg.onload = function(){
                    var imgWidth = that.backImg.width ;
                    var imgHeight = that.backImg.height ;
                    var imgScale = imgWidth / imgHeight ;
                    $_thisLC.setWatermarkImage(that.backImg);
                    that.backImageResize(that,imgScale,that.backImg,true,true);
                    $(that.otherElement.literallyDataLoadingWrap).hide();
                };
                that.backImg.src = imgUrl;
            },150);
        }
    },
    preloadWhiteboardImg:function (imgUrl) {
        if(!imgUrl){console.warn('preload img url is not esixt!');return ;} ;
        var img = new Image();
        img.onload = function(){ //图片加载成功后
            //console.log('preload img success , img url='+imgUrl) ;
        };
        img.src = imgUrl ;
    },
    closeLoading:function () {/*关闭loading*/
        var that = this ;
        $(that.otherElement.literallyDataLoadingWrap).hide();
    },
    backImageResize:function(that,imgScale,backImg,isChangeCanvas,isChangeWatermarkScale){
        var that = this ;
        // clearTimeout(that.backImageResizeTimer);
        // that.backImageResizeTimer = setTimeout(function () {
        isChangeCanvas = ( isChangeCanvas !=undefined && isChangeCanvas!=null?isChangeCanvas:true);
        isChangeWatermarkScale = ( isChangeWatermarkScale !=undefined && isChangeWatermarkScale!=null?isChangeWatermarkScale:true);
        var $_thisLC = that.lc ;
        if($_thisLC){
            var $literally =  that.ele;
            var $literrallyLayout = that.ele.parents(that.otherElement.whiteBoardOuterLayout) ;
            var $bigLiterallyWrap =  that.ele.parents(that.otherElement.bigLiterallyWrap) ;
            var $lc_tool_container = $(that.otherElement.lcToolContainer);
            var $scroll_literally_container = $(that.otherElement.scrollLiterallyContainer);
            that.eleWHPercent = that.eleWHPercent || 1 ;
            var MINWH = that.otherElement.MINWH ;
            var imgScaleFixed= imgScale ;
            var isRotate = false ;
            if( $_thisLC.rotateDeg % 180 !== 0 ){
                isRotate = true ;
            }
            if(!isRotate){
                if( $literrallyLayout.height() * imgScale < $literrallyLayout.width()  ){
                    $bigLiterallyWrap.add($literally).add($scroll_literally_container).height( Math.round( $literrallyLayout.height() )  * that.eleWHPercent);
                    $bigLiterallyWrap.add($literally).add($scroll_literally_container).width( Math.round(  $literrallyLayout.height()*imgScale ) * that.eleWHPercent );
                    if(MINWH !=undefined && MINWH!=null){
                        $literally.add($bigLiterallyWrap).add($scroll_literally_container).css({"min-width":Math.round(MINWH*imgScale)+"px"});
                        $literally.add($bigLiterallyWrap).add($scroll_literally_container).css({"min-hegiht":MINWH+"px"});
                    }
                    $bigLiterallyWrap.css({
                        "margin-top":"0px" ,
                        // "transform": "translateX(-50%)",//wj change 11.14
                        "margin-left":-$bigLiterallyWrap.width()/2+"px" ,
                        "top":"0px" ,
                        "left":"50%" });
                }else {
                    $bigLiterallyWrap.add($literally).add($scroll_literally_container).height(Math.round($literrallyLayout.width() / imgScale) * that.eleWHPercent);
                    $bigLiterallyWrap.add($literally).add($scroll_literally_container).width($literrallyLayout.width() * that.eleWHPercent);
                    if (MINWH != undefined && MINWH != null) {
                        $literally.add($bigLiterallyWrap).add($scroll_literally_container).css({"min-width": Math.round(MINWH * imgScale) + "px"});
                        $literally.add($bigLiterallyWrap).add($scroll_literally_container).css({"min-height": MINWH + "px"});
                    }
                    $bigLiterallyWrap.css({
                        "margin-left": "0px",
                        // "transform": "translateY(-50%)",//wj change 11.14
                        "margin-top": -$bigLiterallyWrap.height() / 2 + "px",
                        "left": "0px",
                        "top": "50%"
                    });
                }
                /*$bigLiterallyWrap.css({
                    "transform": "translate(-50%,-50%)",
                    "top":"50%" ,
                    "left":"50%" });*/
                $literally.css({
                    "transform":"rotate("+$_thisLC.rotateDeg+"deg)" ,
                    "left":"" ,
                    "top":"",
                });
            }else{
                var imgScaleRotate = 1 / imgScale ;
                if( $literrallyLayout.height() * imgScaleRotate < $literrallyLayout.width()  ){
                    $bigLiterallyWrap.add($scroll_literally_container).height( Math.round( $literrallyLayout.height() )  * that.eleWHPercent);
                    $bigLiterallyWrap.add($scroll_literally_container).width( Math.round(  $literrallyLayout.height()*imgScaleRotate ) * that.eleWHPercent );
                    $literally.width( Math.round( $literrallyLayout.height() )  * that.eleWHPercent);
                    $literally.height( Math.round(  $literrallyLayout.height()*imgScaleRotate ) * that.eleWHPercent );
                    if(MINWH !=undefined && MINWH!=null){
                        $bigLiterallyWrap.css({"min-width":Math.round(MINWH*imgScaleRotate)+"px"});
                        $bigLiterallyWrap.css({"min-hegiht":MINWH+"px"});
                        $literally.css({"min-height":Math.round(MINWH*imgScaleRotate)+"px"});
                        $literally.css({"min-width":MINWH+"px"});
                    }
                    $bigLiterallyWrap.css({
                        "margin-top":"0px" ,
                        // "transform": "translateX(-50%)",//wj change 11.14
                        "margin-left":-$bigLiterallyWrap.width()/2+"px" ,
                        "top":"0px" ,
                        "left":"50%" });
                }else {
                    $bigLiterallyWrap.add($scroll_literally_container).height(Math.round($literrallyLayout.width() / imgScaleRotate) * that.eleWHPercent);
                    $bigLiterallyWrap.add($scroll_literally_container).width($literrallyLayout.width() * that.eleWHPercent);
                    $literally.width(Math.round($literrallyLayout.width() / imgScaleRotate) * that.eleWHPercent);
                    $literally.height($literrallyLayout.width() * that.eleWHPercent);
                    if (MINWH != undefined && MINWH != null) {
                        $bigLiterallyWrap.css({"min-width": Math.round(MINWH * imgScaleRotate) + "px"});
                        $bigLiterallyWrap.css({"min-height": MINWH + "px"});
                        $literally.css({"min-height": Math.round(MINWH * imgScaleRotate) + "px"});
                        $literally.css({"min-width": MINWH + "px"});
                    }
                    $bigLiterallyWrap.css({
                        "margin-left": "0px",
                        // "transform": "translateY(-50%)",//wj change 11.14
                        "margin-top": -$bigLiterallyWrap.height() / 2 + "px",
                        "left": "0px",
                        "top": "50%"
                    });
                }
                /*$bigLiterallyWrap.css({
                    "transform": "translate(-50%,-50%)",
                    "top":"50%" ,
                    "left":"50%" });*/
                /* if( $literrallyLayout.height() * imgScale < $literrallyLayout.width()  ){
                 $literally.height( Math.round( $literrallyLayout.height() )  * that.eleWHPercent);
                 $literally.width( Math.round(  $literrallyLayout.height()*imgScale ) * that.eleWHPercent );
                 if(MINWH !=undefined && MINWH!=null){
                 $literally.css({"min-width":Math.round(MINWH*imgScale)+"px"});
                 $literally.css({"min-hegiht":MINWH+"px"});
                 }
                 }else {
                 $literally.height(Math.round($literrallyLayout.width() / imgScale) * that.eleWHPercent);
                 $literally.width($literrallyLayout.width() * that.eleWHPercent);
                 if (MINWH != undefined && MINWH != null) {
                 $literally.css({"min-width": Math.round(MINWH * imgScale) + "px"});
                 $literally.css({"min-height": MINWH + "px"});
                 }
                 }*/
                // $literally.width( $bigLiterallyWrap.height() ).height( $bigLiterallyWrap.width() );
                $literally.css({
                    "transform":"rotate("+$_thisLC.rotateDeg+"deg)" ,
                    "left":($literally.height() - $literally.width() ) / 2+"px" ,
                    "top":-($literally.height() - $literally.width() ) / 2+"px" ,
                });
            }
            if(isChangeCanvas){
                that.lc.respondToSizeChange();
                that.scale = ($literally.height()+$literally.width() ) /  ( that.otherElement.BaseLiterallyWidth+that.otherElement.BaseLiterallyWidth*imgScale ) ;
                that.lc.setZoom(that.scale);
                that.lc.setPan(	that.x  , that.y) ;
                if(isChangeWatermarkScale){
                    var imgWidth = backImg.width ;
                    var imgHeight = backImg.height ;
                    var lv = null ;
                    var lvW = $_thisLC.backgroundCanvas.width / imgWidth ;
                    var lvH =  $_thisLC.backgroundCanvas.height / imgHeight ;
                    lv = (lvW+lvH)/2;
                    $_thisLC.watermarkScale= lv  ;
                    $_thisLC.setWatermarkImage(backImg);
                }
                clearTimeout(that.canvastimer);
                that.canvastimer = setTimeout(function(){
                    if(isChangeWatermarkScale){
                        var imgWidth = backImg.width ;
                        var imgHeight = backImg.height ;
                        var lv = null ;
                        var lvW = $_thisLC.backgroundCanvas.width / imgWidth ;
                        var lvH =  $_thisLC.backgroundCanvas.height / imgHeight ;
                        lv = (lvW+lvH)/2;
                        $_thisLC.watermarkScale= lv  ;
                        $_thisLC.setWatermarkImage(backImg);
                    }
                    var cWidth = $_thisLC.canvas.width  ;
                    var cHeight = $_thisLC.canvas.height  ;
                    var eleWidth = $literally.width()   ;
                    var eleHeight = $literally.height() ;
                    if( (cWidth!=eleWidth) || (cHeight!=eleHeight) ){
                        that.lc.respondToSizeChange();
                        that.scale = ($literally.height()+$literally.width() ) /  ( that.otherElement.BaseLiterallyWidth+that.otherElement.BaseLiterallyWidth*imgScale ) ;
                        that.lc.setZoom(that.scale);
                        that.lc.setPan(	that.x  , that.y) ;
                    }else{
                        clearTimeout(that.canvastimer);
                        that.canvastimer = null ;
                    }
                },150);
            };

            // if(that.isOpenLcFile){
            if(that.eleWHPercent>1){
                $bigLiterallyWrap.addClass("custom-scroll-bar");
                if(  $literrallyLayout.width()  - $bigLiterallyWrap.width() < $lc_tool_container.width() ){
                    $lc_tool_container.css({"right":"0.15rem"});
                }else{
                    $lc_tool_container.css({"right":""});
                }
            }else{
                $bigLiterallyWrap.removeClass("custom-scroll-bar");
                $lc_tool_container.css({"right":""});
            }
            // }
            $("#aynamic_ppt , #aynamic_ppt_newppt").height( $literally.height() ).width($literally.width());
            $("#h5FileWrap").height( $literally.height() ).width($literally.width());
        }
        // },150);
    },
    cloneCanvas:function(canvas ){
        if(  this.cloneCanvasEle.html() == ""){
            this.cloneCanvasEle.html( this.ele.html() ) ;
        }
        var $cv = this.cloneCanvasEle.find(".lc-drawing");
        $cv.empty();
        $cv[0].appendChild(canvas);
    } ,
    convertCanvasToImage:function (canvas) {  // 从 canvas 提取图片 image
        //新Image对象，可以理解为DOM
        var image = new Image();
        // canvas.toDataURL 返回的是一串Base64编码的URL，当然,浏览器自己肯定支持
        // 指定格式 PNG
        image.src = canvas.toDataURL("image/png");
        return image;
    },
    bindElementOnLC:function(ele,cloneElement){
        this.ele = ele || null   ;
        this.cloneCanvasEle = cloneElement || null  ;
    } ,
    cloneElementScalc:function(clonePackElement){
    } ,
    toolsConfig:function(){
        var thisObj = this ;
        return {
            tools:[
                {
                    name: 'pencil',
                    ele: document.getElementById(thisObj.toolElement['tool_pencil']),
                    tool: new LC.tools.Pencil(this.lc)
                },{
                    name: 'pencilPhone',
                    ele: document.getElementById(thisObj.toolElement['tool_pencil_phone']),
                    tool: new LC.tools.Pencil(this.lc)
                },{
                    name: 'eraser',
                    ele: document.getElementById(thisObj.toolElement['tool_eraser']),
                    tool: new LC.tools.Eraser(this.lc)
                },{
                    name: 'eraserPhone',
                    ele: document.getElementById(thisObj.toolElement['tool_eraser_phone']),
                    tool: new LC.tools.Eraser(this.lc)
                },{
                    name: 'text',
                    ele: document.getElementById(thisObj.toolElement['tool_text']),
                    tool: new LC.tools.Text(this.lc)
                },
                {
                    name: 'pan',
                    ele: document.getElementById(thisObj.toolElement['tool_pan']),
                    tool: new LC.tools.Pan(this.lc)
                },
                {
                    name: 'line',
                    ele: document.getElementById(thisObj.toolElement['tool_line']),
                    tool: new LC.tools.Line(this.lc)
                },{
                    name: 'rectangle',
                    ele: document.getElementById(thisObj.toolElement['tool_rectangle']),
                    tool: new LC.tools.Rectangle(this.lc)
                },{
                    name: 'rectangleEmpty',
                    ele: document.getElementById(thisObj.toolElement['tool_rectangle_empty']),
                    tool: new LC.tools.Rectangle(this.lc)
                },{
                    name: 'ellipse',
                    ele: document.getElementById(thisObj.toolElement['tool_ellipse']),
                    tool: new LC.tools.Ellipse(this.lc)
                },{
                    name: 'ellipseEmpty',
                    ele: document.getElementById(thisObj.toolElement['tool_ellipse_empty']),
                    tool: new LC.tools.Ellipse(this.lc)
                },{
                    name: 'polygon',
                    ele: document.getElementById(thisObj.toolElement['tool_polygon']),
                    tool: new LC.tools.Polygon(this.lc)
                },{
                    name: 'eyedropper',
                    ele: document.getElementById(thisObj.toolElement['tool_eyedropper']),
                    tool: new LC.tools.Eyedropper(this.lc)
                },{
                    name: 'selectShape',
                    ele: document.getElementById(thisObj.toolElement['tool_selectShape']),
                    tool: new LC.tools.SelectShape(this.lc)
                },{
                    name: 'arrow',
                    ele: document.getElementById(thisObj.toolElement['tool_arrow']),
                    tool: function() {
                        var arrow = null ;
                        arrow = new LC.tools.Line(thisObj.lc);
                        arrow.hasEndArrow = true;
                        return arrow;
                    }()
                },{
                    name: 'dashed',
                    ele: document.getElementById(thisObj.toolElement['tool_dashed']),
                    tool: function() {
                        var dashed = null  ;
                        dashed = new LC.tools.Line(thisObj.lc);
                        dashed.isDashed = true;
                        return dashed;
                    }()
                },{
                    name: 'mouse',
                    ele: document.getElementById(thisObj.toolElement['tool_mouse']),
                    tool: new LC.tools.Pencil(this.lc)
                },{
                    name: 'mouse',
                    ele: document.getElementById(thisObj.toolElement['tool_mouse_phone']),
                    tool: new LC.tools.Pencil(this.lc)
                } ,
                {
                    name: 'highlighter',
                    ele: document.getElementById(thisObj.toolElement['tool_highlighter']),
                    tool: new LC.tools.Pencil(this.lc)
                }  ,
                {
                    name: 'laser',
                    ele: document.getElementById(thisObj.toolElement['tool_laser']),
                    tool: new LC.tools.Pencil(this.lc)
                }
            ] ,
            colors:[
                {
                    name: 'strokeColor',
                    ele: document.getElementById(thisObj.toolElement['tool_stroke_color']),
                    defalutColor:"#000000"
                },{
                    name: 'fillColor',
                    ele: document.getElementById(thisObj.toolElement['tool_fill_color']),
                    defalutColor:"#ffffff"
                },{
                    name: 'backgroundColor',
                    ele: document.getElementById(thisObj.toolElement['tool_background_color']),
                    defalutColor:"#ffffff"
                }
            ] ,
            operation:[
                {
                    name: 'undo',
                    ele: document.getElementById(thisObj.toolElement['tool_operation_undo']),
                } ,
                {
                    name: 'redo',
                    ele: document.getElementById(thisObj.toolElement['tool_operation_redo']),
                } ,
                {
                    name: 'clear',
                    ele: document.getElementById(thisObj.toolElement['tool_operation_clear']),
                }
            ] ,
            zoom:[
                {
                    name: 'zoomBig',
                    ele: document.getElementById(thisObj.toolElement['tool_zoom_big']),
                } ,
                {
                    name: 'zoomSmall',
                    ele: document.getElementById(thisObj.toolElement['tool_zoom_small']),
                },
                {
                    name: 'zoomDefault',
                    ele: document.getElementById(thisObj.toolElement['tool_zoom_default']),
                }
            ],
            rotate:[
                {
                    name: 'rotateLeft',
                    ele: document.getElementById(thisObj.toolElement['tool_rotate_left']),
                } ,
                {
                    name: 'rotateRight',
                    ele: document.getElementById(thisObj.toolElement['tool_rotate_right']),
                }
            ],
            pan:[
                {
                    name: 'panDefault',
                    ele: document.getElementById(thisObj.toolElement['tool_pan_default']),
                },{
                    name: 'movePan',
                    ele: document.getElementById(thisObj.toolElement['tool_pan']),
                }
            ],
            move:[
                {
                    name: 'moveScrollbar',
                    ele: document.getElementById(thisObj.toolElement['tool_move_scrollbar']),
                }
            ]
        }
    },
    setActiveToolByName:function( ary , val) {
        var thisObj = this ;
        ary.forEach(function(cur) {
            var $curEle = $(cur.ele) ;
            $curEle.toggleClass('active-tool', ( cur.name == val) );
            thisObj.toolActiveDetection($curEle);
        });
    } ,
    isIE:function() {
        var userAgent = navigator.userAgent;
        var isIE = false;
        if (window.ActiveXObject || "ActiveXObject" in window) {
            isIE = true;
        } else {
            isIE = (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1
            && !(userAgent.indexOf("Opera") > -1));
            isIE = false;
        }
        return isIE;
    },
    toolsInitBind:function(){
        var thisObj = this ;
        var toolsConfig = thisObj.toolsConfig() ;
        // Wire tools
        toolsConfig.tools.forEach(function(tl) {
            $(tl.ele).off('click');
            $(tl.ele).click(function(event , initiative , json ) { 
                thisObj.handlerToolClick(tl , json);
                if(initiative){
                    return false ;
                }
            });
        });
//      $(toolsConfig.tools[0]).trigger("click");
        // thisObj.setActiveToolByName(toolsConfig.tools, toolsConfig.tools[0].name);

        // Wire Colors
        toolsConfig.colors.forEach(function(clr) {
            $(clr.ele).val(clr.defalutColor);
            $(clr.ele).off('change');
            $(clr.ele).change(function(ev , initiative) {
                switch(clr.name){
                    case "strokeColor" :
                        thisObj.lc.setColor('primary', $(ev.target).val()   ) ;
                        break ;
                    case "fillColor" :
                        thisObj.lc.setColor('secondary', $(ev.target).val()   ) ;
                        break ;
                    case "backgroundColor" :
                        thisObj.lc.setColor('background', $(ev.target).val()   ) ;
                        break ;
                };
                if(initiative){
                    return false ;
                }
            });
        });


        // Wire Operation
        toolsConfig.operation.forEach(function(ort) {
            $(ort.ele).off('click');
            $(ort.ele).click(function(e , initiative) {
                switch(ort.name){
                    case "undo" :
                        thisObj.lc.undo();
                        break;
                    case "redo" :
                        thisObj.lc.redo();
                        break;
                    case "clear" :
                        thisObj.lc.clear();
                        break;
                    case "rotate" :
                        thisObj.lc.rotateDeg = (thisObj.lc.rotateDeg + 90 ) % 360;
                        var that = thisObj ;
                        that.resizeHandler(that);
                        break;
                }
                thisObj.operationIsAbled();
                if(initiative){
                    return false ;
                }
            })
        });
        thisObj.operationIsAbled();


        // Wire Rotate
        toolsConfig.rotate.forEach(function(rtt) {
            $(rtt.ele).off('click');
            $(rtt.ele).click(function(e , initiative) {
                switch(rtt.name){
                    case "rotateLeft" :
                        thisObj.lc.rotateDeg = (thisObj.lc.rotateDeg - 90 + 360 ) % 360;
                        var that = thisObj ;
                        that.resizeHandler(that);
                        break;
                    case "rotateRight" :
                        thisObj.lc.rotateDeg = (thisObj.lc.rotateDeg + 90 + 360 ) % 360;
                        var that = thisObj ;
                        that.resizeHandler(that);
                        break;
                };
                if(initiative){
                    return false ;
                }
            });
        });

        // Wire Zoom
        toolsConfig.zoom.forEach(function(zm) {
            $(zm.ele).off('click');
            $(zm.ele).click(function(e , initiative) {
                switch(zm.name){
                    case "zoomBig" :
                        if( thisObj.eleWHPercent < 3){
                            thisObj.eleWHPercent += 0.5 ;
                        }
                        break;
                    case "zoomSmall" :
                        if( thisObj.eleWHPercent > 1){
                            thisObj.eleWHPercent -= 0.5 ;
                        }
                        break;
                    case "zoomDefault" :
                        //        			thisObj.lc.setZoom( thisObj.scale );
                        thisObj.eleWHPercent = 1 ;
                        break;
                }
                var initiative = true ;
                thisObj.scaleButtonStyle(initiative);
                var that = thisObj ;
                that.resizeHandler(that);
                if(initiative){
                    return false ;
                }
            });
            thisObj.scaleButtonStyle();
            var that = thisObj ;
            that.resizeHandler(that);
        });

        // Wire Pan
        toolsConfig.pan.forEach(function(pn) {
            $(pn.ele).off('click');
            $(pn.ele).click(function(e , initiative) {
                switch(pn.name){
                    case "panDefault" :
                        thisObj.lc.setPan( 0,0 );
                        break;
                } ;
                if(initiative){
                    return false ;
                }
            });
        });

        //wire  move
        toolsConfig.move.forEach(function(mv) {
            $(mv.ele).attr("data-move-open",false);
            var $moveToolBgContainer = $(thisObj.otherElement.moveToolBgContainer) ;
            $moveToolBgContainer.hide();
            $(mv.ele).off('click');
            $(mv.ele).click(function(e  , initiative) {
                switch(mv.name){
                    case "moveScrollbar" :
                        if( $(this).attr("data-move-open") == "false" ){
                            $moveToolBgContainer.show();
                            thisObj.setActiveToolByName(toolsConfig.tools,"");
                            thisObj.setActiveToolByName(toolsConfig.move, mv.name);
                            $(this).attr("data-move-open" , true) ;
                            thisObj.literallyMoveScrollEvent( $moveToolBgContainer  );
                        }else if($(this).attr("data-move-open") == "true"){
                            $moveToolBgContainer.hide();
                            $(this).attr("data-move-open" , false) ;
                            thisObj.setActiveToolByName(toolsConfig.move,"");
                            if( thisObj.lc ){
                                toolsConfig.tools.forEach(function(tl) {
                                    if( tl.name == thisObj.lc.tool.name.toLowerCase()  ){
                                        thisObj.setActiveToolByName(toolsConfig.tools, tl.name);
                                        if(  thisObj.lc.tool.name == "Eyedropper"){
                                            thisObj.setEyedropperObject();
                                        }else if( thisObj.lc.tool.name == "Text" ){
                                            thisObj.uploadTextFont();
                                        }else if(thisObj.lc.tool.name == "Eraser"){
                                            thisObj.uploadEraserWidth();
                                        }else if(thisObj.lc.tool.name == "Pencil" ){
                                            thisObj.uploadPencilWidth();
                                        }else if( thisObj.lc.tool.name == "Rectangle" || thisObj.lc.tool.name  == "Ellipse"){
                                            thisObj.uploadShapeWidth();
                                        }
                                    }
                                });
                            }

                        }
                        break;
                };
                if(initiative){
                    return false ;
                }
            });
        });
    },
    handlerToolClick:function (tl , json) {
        var that = this ;
        var toolsConfig = that.toolsConfig() ;
        that.lc.setTool(tl.tool);
        that.setActiveToolByName(toolsConfig.tools, tl.name);
        that.setIsTmpDrawAble(true);

        //鼠标部分
        if(tl.ele.getAttribute("id") === that.toolElement['tool_mouse'] || tl.ele.getAttribute("id") === that.toolElement['tool_mouse_phone'] ){
            that.setIsTmpDrawAble(false);
        }
        $(document).trigger("checkAynamicPptClickEvent",[]);

        //激光笔部分
        var $temporaryDrawPermission =  $(that.lc.containerEl).parent().find(".temporary-draw-permission");
        var $laserMark =  $(that.lc.containerEl).parent().find(".laser-mark");
        if(tl.ele.getAttribute("id") === that.toolElement['tool_laser'] ){
            that.setIsTmpDrawAble(false);
            $temporaryDrawPermission.off("mousemove");
            $(that.lc.containerEl).parent().off("mouseenter mouseleave");
            that.selectLaserTool = true ;
            if( that.rolePermission["laser"] ){
                $temporaryDrawPermission.removeClass("cursor-none").addClass("cursor-none");
                that.laserTime = that.laserTime!=undefined?that.laserTime : null ;
                that.laserPosition = that.laserPosition!=undefined?that.laserPosition : {left:0 , top:0} ;
                $temporaryDrawPermission.on("mousemove",function(e){
                    var offset = $(this).offset();
                    var x = e.pageX , y = e.pageY ;
                    var x1 , y1 ;
                    var markContainerWidth  = $(this).width();
                    var markContainerHeight = $(this).height()  ;
                    switch (that.lc.rotateDeg){
                        case 0:
                            x1 = x - offset.left ;
                            y1 = y - offset.top  ;
                            break;
                        case 90:
                            x1 =  y - offset.top ;
                            y1 = markContainerHeight - (x - offset.left );
                            break;
                        case 180:
                            x1 = markContainerWidth - (x - offset.left ) ;
                            y1 = markContainerHeight - ( y - offset.top) ;
                            break;
                        case 270:
                            x1 = markContainerWidth - ( y - offset.top) ;
                            y1 = x - offset.left ;
                            break;
                        default:
                            x1 = x - offset.left ;
                            y1 = y - offset.top  ;
                            break
                    }
                    var left = x1 /  $(this).width() *100;
                    var top =  y1  /  $(this).height() *100;
                    $laserMark.css({
                        "left":left+"%" ,
                        "top":top+"%"
                    });
                    clearTimeout(that.laserTime);
                    that.laserTime = setTimeout(function(){
                        if( that.laserPosition && ( Math.abs( left-that.laserPosition.left ) > 0.3 || Math.abs( top-that.laserPosition.top )>0.3 ) ){
                            var parameter = {
                                laser:{
                                    left:left ,
                                    top:top
                                },
                                action:{
                                    actionName:"move"
                                }
                            };
                            that.laserPosition = parameter.laser ;
                            that.sendMessageCommonFunction("laserMarkEvent" , parameter);
                        }
                    },100);
                    return false;
                });

                $(that.lc.containerEl).parent().on("mouseenter",function(e){
                    if( that.rolePermission["laser"] ){
                        var parameter = {
                            action:{
                                actionName:"show"
                            }
                        };
                        that.sendMessageCommonFunction("laserMarkEvent" , parameter);
                    }
                    $laserMark.show();
                    return false;
                });
                $(that.lc.containerEl).parent().on("mouseleave",function(e){
                    if( that.rolePermission["laser"] ){
                        var parameter = {
                            action:{
                                actionName:"hide"
                            }
                        };
                        that.sendMessageCommonFunction("laserMarkEvent" , parameter);
                    }
                    $laserMark.hide();
                    return false;
                });
            }
        }else{
            $temporaryDrawPermission.off("mousemove ");
            $(that.lc.containerEl).parent().off("mouseenter mouseleave");
            $temporaryDrawPermission.removeClass("cursor-none");
            // that.setIsTmpDrawAble(true);
            $laserMark.hide();
            if(that.selectLaserTool){
                if( that.rolePermission["laser"] ){
                    var parameter = {
                        action:{
                            actionName:"hide"
                        }
                    };
                    that.sendMessageCommonFunction("laserMarkEvent" , parameter);
                }
                that.selectLaserTool = false ;
            }
        }

        if(  that.lc.tool.name == "Eyedropper"){//吸管
            that.setEyedropperObject();
        }else if( that.lc.tool.name == "Text" ){
            that.uploadTextFont();
        }else if(that.lc.tool.name == "Eraser"){
            that.uploadEraserWidth();
        }else if(that.lc.tool.name == "Pencil" || that.lc.tool.name == "Rectangle" || that.lc.tool.name  == "Ellipse" ||  that.lc.tool.name  == "Line" ){
            that.uploadPencilWidth();
        }
        if( ( that.lc.tool.name == "Rectangle" || that.lc.tool.name  == "Ellipse" ) && tl.ele.getAttribute("data-empty") === "true" ){
            that.lc.setColor('secondary',"transparent" ) ;
        }else{
            that.lc.setColor('secondary',that.initConfig.secondaryColor);
        }

        //荧光笔
        if( tl.name === 'highlighter' ){
            var color = that.initConfig.primaryColor.colorRgb().toLowerCase().replace("rgb","rgba").replace(")",",0.5)") ;
            that.lc.setColor('primary', color  ) ;
        }else{
            that.lc.setColor('primary',that.initConfig.primaryColor);
        }
        $(document).trigger('sendWhiteboardMarkTool' , [json]);
    },
    scaleButtonStyle:function (initiative , callback) {
        var thisObj = this ;
        if( thisObj.eleWHPercent <= 1){
            thisObj.eleWHPercent =  1;
            thisObj.addElementDisable( $("#"+ thisObj.toolElement.tool_zoom_default)  );
            thisObj.addElementDisable( $("#"+ thisObj.toolElement.tool_zoom_small)  );
        }else{
            thisObj.removeElementDisable( $("#"+ thisObj.toolElement.tool_zoom_small) );
            thisObj.removeElementDisable( $("#"+ thisObj.toolElement.tool_zoom_default)  );
        }
        if( thisObj.eleWHPercent >= 3){
            thisObj.addElementDisable( $("#"+ thisObj.toolElement.tool_zoom_big)  );
        }else{
            thisObj.removeElementDisable( $("#"+ thisObj.toolElement.tool_zoom_big)  );
        }
       /* setTimeout( function () {
            if(initiative){
                var $big_literally_wrap = $("#big_literally_wrap") ;
                var scrollTop = $big_literally_wrap.scrollTop();
                var scrollLeft = $big_literally_wrap.scrollLeft();
                var outerHeight = $big_literally_wrap.outerHeight();
                var outerWidth = $big_literally_wrap.outerWidth();
                var parameter = {
                    action:{
                        actionName:'zoom'
                    },
                    zoom:thisObj.eleWHPercent ,
                    scroll:{
                        top: scrollTop / outerHeight,
                        left:scrollLeft/outerWidth
                    }
                };
                thisObj.sendMessageCommonFunction('changeZoomEvent' , parameter);
            }
        } , 500) ;*/

    },
    /*TODO 移动功能有bug,暂时没有修复*/
    literallyMoveScrollEvent:function($moveToolBgContainer,isClearEvent){
        var that = this;
        isClearEvent = (isClearEvent!=undefined && isClearEvent!=null?isClearEvent:false) ;
        var $literallyCanvasContainer = $(that.otherElement.literallyCanvasContainer);
        var flag = false;  //鼠标是否按下
        var nx,ny,dx,dy,x,y ;
        var timer = null ;
        var startPoint = {  //开始节点的x,y,scrollTop,scrollLeft
            x:0 ,
            y:0 ,
            scrollTop:0 ,
            scrollLeft:0
        }
        $moveToolBgContainer.mousedown(function(e){ //鼠标按下时
            startPoint = {
                x:e.offsetX ,
                y:e.offsetY ,
                scrollLeft:$literallyCanvasContainer.scrollLeft(),
                scrollTop:$literallyCanvasContainer.scrollTop()
            }
            flag = true ; //鼠标按下标志
        });
        $moveToolBgContainer.mousemove(function(e){
            if(flag){
                nx =  startPoint.x - e.offsetX ;
                ny =  startPoint.y - e.offsetY ;
                if( Math.abs( nx ) >5 ){
                    $literallyCanvasContainer.scrollLeft( startPoint.scrollLeft+nx );
                }

                if( Math.abs( ny ) >5 ){
                    $literallyCanvasContainer.scrollTop( startPoint.scrollTop+ny );
                }
            }
        });

        $moveToolBgContainer.on("mouseup mouseleave mouseenter",function(e){
            flag = false ;
            switch (e.type){
                case "mouseup":
                    startPoint = {
                        x:e.offsetX ,
                        y:e.offsetY ,
                        scrollLeft:$literallyCanvasContainer.scrollLeft(),
                        scrollTop:$literallyCanvasContainer.scrollTop()
                    }
                    break;
                default:
                    break;
            }
        });

        $(document).mouseenter(function(e){
            flag = false ;
        });
    },
    operationIsAbled:function(){
        var thisObj = this ;
        var addOperationDisabled  = function (ortName , targetName){
                var operation = !targetName? thisObj.toolsConfig().operation : thisObj.toolsConfig()[targetName] ;
                for (var i = 0; i < operation.length; i++) {
                    if( operation[i].name == ortName){
//  				$(operation[i].ele).css({"background":"#ddd"}).attr("disabled",true);
                        var $curEle =  $(operation[i].ele) ;
                        thisObj.addElementDisable($curEle);
                    }
                }
            };

        var removeOperationDisabled =  function (ortName , targetName){
            var operation = !targetName? thisObj.toolsConfig().operation : thisObj.toolsConfig()[targetName] ;
                for (var i = 0; i < operation.length; i++) {
                    if( operation[i].name == ortName){
                        var $curEle =  $(operation[i].ele) ;
                        thisObj.removeElementDisable($curEle);
                    }
                }
            };

        if( thisObj.lc.shapes.length == 0 ){
            addOperationDisabled("clear");
            var targetName = 'tools' ;
            addOperationDisabled("eraser" , targetName);
            thisObj.addElementDisable( $("#"+thisObj.toolElement["tool_eyedropper"]) );
        }else{
            removeOperationDisabled("clear");
            var targetName = 'tools' ;
            removeOperationDisabled("eraser" , targetName);
            thisObj.removeElementDisable( $("#"+thisObj.toolElement["tool_eyedropper"]) );
        }
        if( ! thisObj.lc.canRedo() ){
            addOperationDisabled("redo");
        }else{
            removeOperationDisabled("redo");
        }

        if( ! thisObj.lc.canUndo()  ){
            addOperationDisabled("undo");
        }else{
            removeOperationDisabled("undo");
        }
    },
    addElementDisable:function($curEle){
        $curEle.attr("disabled","disabled").addClass("disabled");
        if( this.callback.onAddElementDisable && $.isFunction(this.callback.onAddElementDisable) ){
            this.callback.onAddElementDisable($curEle);
        }
    },
    removeElementDisable:function($curEle){
        $curEle.removeAttr("disabled").removeClass("disabled");
        if( this.callback.onRemoveElementDisable && $.isFunction(this.callback.onRemoveElementDisable) ){
            this.callback.onRemoveElementDisable($curEle);
        }
    },
    toolActiveDetection:function($curEle){
        if( this.callback.onToolActiveDetection && $.isFunction(this.callback.onToolActiveDetection) ){
            this.callback.onToolActiveDetection($curEle);
        }
    },
    removeToolActive:function($curEle){
        if( this.callback.onRemoveToolActive && $.isFunction(this.callback.onRemoveToolActive) ){
            this.callback.onRemoveToolActive($curEle);
        }
    },
    setEyedropperObject:function(){
        var that = this ;
        var tool = that.lc.tool ;
        if(tool.name == "Eyedropper"){
            tool.strokeOrFill = that.lc.toolStatus.eyedropperIsStroke ;
        }
    },
    setLCTextFont:function(fontSize,fontFamily,fontStyle , fontWeight ){
        /*：font-style | font-variant | font-weight | font-size | line-height | font-family */
        /*
         font:italic small-caps bold 12px/1.5em arial,verdana;  （注：简写时，font-size和line-height只能通过斜杠/组成一个值，不能分开写。）
         等效于：
         font-style:italic;
         font-variant:small-caps;
         font-weight:bold;
         font-size:12px;
         line-height:1.5em;
         font-family:arial,verdana;
         */
        var tool = this.lc.tool ;
        if(tool.name == "Text"){
            fontSize = (fontSize!=null  && fontSize!=undefined  && fontSize>0 ) ? fontSize : 20 ;
            fontFamily = (fontFamily!=null && fontFamily!=undefined  && fontFamily!="" )? fontFamily : "微软雅黑" ;
            fontStyle =  (fontStyle!=null && fontStyle!=undefined  && fontStyle!="" )? fontStyle : "normal" ;
            fontWeight =  (fontWeight!=null && fontWeight!=undefined  && fontWeight!="" )? fontWeight : "normal" ;
            tool.font = fontStyle+" "+fontWeight+" "+fontSize+"px "+fontFamily;
        }

    },
    uploadTextFont:function(){
        this.setLCTextFont(  this.lc.toolStatus.fontSize,this.lc.toolStatus.fontFamily,this.lc.toolStatus.fontStyle , this.lc.toolStatus.fontWeight  );
    },
    uploadPencilWidth:function () {
        this.lc.trigger( 'setStrokeWidth', this.lc.toolStatus.pencilWidth );
    },
    uploadEraserWidth:function () {
        this.lc.trigger( 'setStrokeWidth', this.lc.toolStatus.eraserWidth );
    },
    uploadShapeWidth:function(){
        this.lc.trigger( 'setStrokeWidth', this.lc.toolStatus.shapeWidth );
    },
    getIsDrawAble:function(){
        return this.lc.isDrawAble ;
    },
    setIsDrawAble:function(value){
        this.lc.isDrawAble = value;
        var drawPermission = this.lc.containerEl.parentNode.getElementsByClassName("draw-permission")[0];
        if( this.lc.isDrawAble ){
            drawPermission.className = drawPermission.className.replace(/( yes| no)/g,"");
            drawPermission.className += " yes" ;
        }else{
            drawPermission.className = drawPermission.className.replace(/( yes| no)/g,"");
            drawPermission.className += " no" ;
        }
    },
    getIsTmpDrawAble:function(){
        return this.lc.isTmpDrawAble ;
    },
    setIsTmpDrawAble:function(value){
        this.lc.isTmpDrawAble = value;
        var temporaryDrawPermission = this.lc.containerEl.parentNode.getElementsByClassName("temporary-draw-permission")[0];
        if( this.lc.isTmpDrawAble ){
            temporaryDrawPermission.className = temporaryDrawPermission.className.replace(/( yes| no)/g,"");
            temporaryDrawPermission.className += " yes" ;
        }else{
            temporaryDrawPermission.className = temporaryDrawPermission.className.replace(/( yes| no)/g,"");
            temporaryDrawPermission.className += " no" ;
        }
    },
    uploadColor:function(key , value){
        var that = this ;
        that.initConfig[key+"Color"] = value ;
        that.lc.setColor(key , that.initConfig[key+"Color"]) ;

        var $toolHighlighter = $( "#"+that.toolElement['tool_highlighter'] ) ;
        if(key==="primary" && $toolHighlighter.length>0 &&  $toolHighlighter.attr("data-select") == "true" ){
            var color = value.colorRgb().toLowerCase().replace("rgb","rgba").replace(")",",0.5)") ;
            that.lc.setColor(key, color  ) ;
        }
    },
    snapshotLoadEvent:function(parameter){
        console.log( "================snapshotLoadEvent start===============" );
        console.log( parameter );
        console.log( "================snapshotLoadEvent end===============" );
    },
    primaryColorChangeEvent:function(parameter){
        console.log( "================primaryColorChangeEvent start===============" );
        console.log( parameter );
        console.log( "================primaryColorChangeEvent end===============" );
    },
    secondaryColorChangeEvent:function(parameter){
        console.log( "================secondaryColorChangeEvent start===============" );
        console.log( parameter );
        console.log( "================secondaryColorChangeEvent end===============" );
    },
    backgroundColorChangeEvent:function(parameter){
        console.log( "================backgroundColorChangeEvent start===============" );
        console.log( parameter );
        console.log( "================backgroundColorChangeEvent end===============" );
    },
    drawingChangeEvent:function(parameter) {
//      console.log( "================drawingChangeEvent start===============" );
//      console.log( parameter );
//      console.log( "================drawingChangeEvent end===============" );
        // var thisObj = CustomLiterallyGLOBAL.thisObj ;
        //parse用于从一个字符串中解析出json对象   stringify()用于从一个对象解析出字符串
//      localStorage.setItem('drawing', JSON.stringify( thisObj.lc.getSnapshot() ) );
//      var snapshotJSON = localStorage['drawing'];
//		var canvas = LC.renderShapesToCanvas(
//		  LC.snapshotJSONToShapes(snapshotJSON),
//		  { x: 0, y: 0, width: thisObj.lc.backgroundCanvas.width , height:  thisObj.lc.backgroundCanvas.height }
//	    );
        // Now you can pull out the image using a data URL:
        //var dataURL = canvas.toDataURL();
        //console.log(dataURL);
//		thisObj.cloneCanvas(canvas);
    },
    doClearRedoStackEvent:function(doClearRedoStack){
//  	console.log( "================doClearRedoStackEvent start===============" );
//      console.log( doClearRedoStack );
//      console.log( "================doClearRedoStackEvent end===============" );
//      var thisObj = CustomLiterallyGLOBAL.thisObj ;
//      $(document).trigger("doClearRedoStackEvent",[ doClearRedoStack.doClearRedoStack  , thisObj.undoAndRedoStack ]);
//      thisObj.undoAndRedoStack = [] ;
    },
    shapeSaveEvent:function(parameter){
        /*console.log( "================shapeSaveEvent start===============" );
         console.log( parameter );
         console.log( "================shapeSaveEvent end===============" );*/
        var thisObj = CustomLiterallyGLOBAL.thisObj ;
        thisObj.sendMessageCommonFunction("shapeSaveEvent" , parameter);
        thisObj.operationIsAbled();
    },
    undoEvent:function(parameter){
        /*console.log( "================undoEvent start===============" );
         console.log( parameter );
         console.log( "================undoEvent end===============" );*/
        var thisObj = CustomLiterallyGLOBAL.thisObj ;
        thisObj.sendMessageCommonFunction("undoEvent",parameter);
        thisObj.operationIsAbled();
    },
    redoEvent:function(parameter){
        /*console.log( "================redoEvent start===============" );
         //		 console.log( parameter );
         console.log( "================redoEvent end===============" );*/
        var thisObj = CustomLiterallyGLOBAL.thisObj ;
        thisObj.sendMessageCommonFunction("redoEvent",parameter);
        thisObj.operationIsAbled();
    },
    clearEvent:function(parameter){
        /*console.log( "================clearEvent start===============" );
         console.log( parameter );
         console.log( "================clearEvent end===============" );*/
        var thisObj = CustomLiterallyGLOBAL.thisObj ;
        thisObj.sendMessageCommonFunction("clearEvent",parameter);
        thisObj.operationIsAbled();
    },
    drawStartEvent:function(parameter){
//      console.log( "================drawStartEvent start===============" );
//      console.log( parameter );
//      console.log( "================drawStartEvent end===============" );
    },
    drawContinueEvent:function(parameter){
        console.log( "================drawContinueEvent start===============" );
        console.log( parameter );
        console.log( "================drawContinueEvent end===============" );
    },
    drawEndEvent:function(parameter){
        console.log( "================drawEndEvent start===============" );
        console.log( parameter );
        console.log( "================drawEndEvent end===============" );
    },
    toolChangeEvent:function(parameter){
        console.log( "================toolChangeEvent start===============" );
        console.log( parameter );
        console.log( "================toolChangeEvent end===============" );
    },
    panEvent:function(parameter){
        console.log( "================panEvent start===============" );
        console.log( parameter );
        console.log( "================panEvent end===============" );
        /*		var thisObj = CustomLiterallyGLOBAL.thisObj;
         thisObj.x = parameter.x * ( thisObj.newScale / thisObj.oldScale) ;
         thisObj.y = parameter.y * ( thisObj.newScale / thisObj.oldScale) ;*/
    },
    zoomEvent:function(parameter){
        console.log( "================zoomEvent start===============" );
        console.log( parameter );
        console.log( "================zoomEvent end===============" );
        /*		var thisObj = CustomLiterallyGLOBAL.thisObj;
         thisObj.oldScale = parameter.oldScale ;
         thisObj.newScale = parameter.newScale ;*/
    },
    repaintEvent:function(parameter){
        console.log( "================repaintEvent start===============" );
        console.log( parameter );
        console.log( "================repaintEvent end===============" );
    },
    lcPointerdownEvent:function(parameter){
        console.log( "================lcPointerdownEvent start===============" );
        console.log( parameter );
        console.log( "================lcPointerdownEvent end===============" );
    },
    lcPointerupEvent:function(parameter){
        console.log( "================lcPointerupEvent start===============" );
        console.log( parameter );
        console.log( "================lcPointerupEvent end===============" );
    },
    lcPointermoveEvent:function(parameter){
        console.log( "================lcPointermoveEvent start===============" );
        console.log( parameter );
        console.log( "================lcPointermoveEvent end===============" );
    },
    lcPointerdragEvent:function(parameter){
        console.log( "================lcPointerdragEvent start===============" );
        console.log( parameter );
        console.log( "================lcPointerdragEvent end===============" );
    } ,
    saveLcStackToStorage:function (paramsJson) {//保存之前白板数据栈到白板数据存储仓库中
        var that = this ;
        var saveRedoStack = paramsJson.saveRedoStack || false ; //是否保存redoStack
        var saveUndoStack = paramsJson.saveUndoStack || true ; //是否保存undoStack
        if( that.ele ){
            if( that.ele.attr("data-curr-page")!=undefined && that.ele.attr("data-curr-page")!=""   && that.ele.attr("data-file-id")!=undefined  && that.ele.attr("data-file-id")!="" ){
                var  currPageNum =  parseInt( that.ele.attr("data-curr-page")  )  ;
                var  fileId = parseInt( that.ele.attr("data-file-id") ) ;
                if(saveUndoStack){
                    that.stackStorage["undoStack_"+fileId+"_"+currPageNum]  = that.lc.undoStack.slice(0) ;
                }
                if(saveRedoStack){
                    that.stackStorage["redoStack_"+fileId+"_"+currPageNum]  = that.lc.redoStack.slice(0)  ;
                }
            }
        }
    },
    setFileDataToLcElement:function (filedata) {//设置当前文档数据到白板节点上
        var that = this ;
        that.DocumentFileInfo = filedata ;
        that.ele.attr("data-file-id" , filedata.fileid)
            .attr("data-curr-page",filedata.currpage )
            .attr("data-total-page", filedata.pagenum )
            .attr("data-file-type", filedata.filetype )
            .attr("data-file-name", filedata.filename )
            .attr("data-file-swfpath", filedata.swfpath)
            .attr("data-ppt-slide", filedata.pptslide)
            .attr("data-ppt-step", filedata.pptstep)
            .attr("data-ppt-step-total", filedata.steptotal);
    },
    getFileDataFromLcElement:function(){
        var that = this ;
       var filedata = {
            fileid:parseInt( that.ele.attr("data-file-id") || 0 ) ,
            currpage:parseInt( that.ele.attr("data-curr-page") || 1  ) ,
            pagenum:parseInt( that.ele.attr("data-total-page") || 1  ),
            filetype: that.ele.attr("data-file-type")  ,
            filename: that.ele.attr("data-file-name")  ,
            swfpath: that.ele.attr("data-file-swfpath") ,
            pptslide:parseInt( that.ele.attr("data-ppt-slide") || 1  ) ,
            pptstep:parseInt( that.ele.attr("data-ppt-step") || 0  ) ,
            steptotal:parseInt( that.ele.attr("data-ppt-step-total")  || 0 )  ,
        }
        return filedata ;
        //return that.DocumentFileInfo ;
    },
    setMediaFileDataToLcElement:function (filedata) {
        var that = this ;
        that.mediaFileInfo = filedata ;
        that.ele.attr("data-media-file-id" , filedata.fileid)
            .attr("data-media-curr-page",filedata.currpage )
            .attr("data-media-total-page", filedata.pagenum )
            .attr("data-media-file-type", filedata.filetype )
            .attr("data-media-file-name", filedata.filename )
            .attr("data-media-file-swfpath", filedata.swfpath)
            .attr("data-media-ppt-slide", filedata.pptslide)
            .attr("data-media-ppt-step", filedata.pptstep)
            .attr("data-media-ppt-step-total", filedata.steptotal);
    },
    getMeidaFileDataFromLcElement:function(){
        var that = this ;
       var filedata = {
            fileid:parseInt( that.ele.attr("data-media-file-id") || 0 ) ,
            currpage:parseInt( that.ele.attr("data-media-curr-page") || 1  ) ,
            pagenum:parseInt( that.ele.attr("data-media-total-page") || 1  ),
            filetype: that.ele.attr("data-media-file-type")  ,
            filename: that.ele.attr("data-media-file-name")  ,
            swfpath: that.ele.attr("data-media-file-swfpath") ,
            pptslide:parseInt( that.ele.attr("data-media-ppt-slide") || 1  ) ,
            pptstep:parseInt( that.ele.attr("data-media-ppt-step") || 0  ) ,
            steptotal:parseInt( that.ele.attr("data-media-ppt-step-total")  || 0 )  ,
        }
        return filedata ;
        //return that.mediaFileInfo ;
    },
    recoverCurrpageLcData:function (paramsJson) {//加载当前页的白板数据
        var that = this ;
        var loadRedoStack = paramsJson.loadRedoStack || false ; //是否加载redo栈的数据
        var  currPageNum = paramsJson.currPageNum ||  parseInt( that.ele.attr("data-curr-page")  )  ;
        var  fileId = paramsJson.fileId != undefined ? paramsJson.fileId : parseInt(  that.ele.attr("data-file-id") ) ;
        that.lc.clear(false);
        that.lc.redoStack.length = 0 ;
        that.lc.undoStack.length = 0 ;
        var undoStack = that.stackStorage[ "undoStack_"+fileId+"_"+currPageNum ] ;
        var redoStack = that.stackStorage[ "redoStack_"+fileId+"_"+currPageNum ] ;
        if(undoStack && undoStack.length>0){
            for (var i=0 ; i<undoStack.length; i++) {
                var action =  undoStack[i] ;
                if(action.actionName === "AddShapeAction"){
                    that.lc.saveShape( action.shape  , false  , null , false);
                }else if(action.actionName === "ClearAction"){
                    that.lc.clear(false , action.id);
                }
            }
        }
        if(loadRedoStack ){
            /*TODO 这里暂时采用老师将恢复栈的数据都加到撤销站中，再执行撤销操作，有待优化*/
            if(redoStack && redoStack.length>0){
                for (var i=redoStack.length - 1 ; i>=0; i--) {
                    var action =  redoStack[i] ;
                    if(action.actionName === "AddShapeAction"){
                        that.lc.saveShape( action.shape  , false  , null , false);
                    }else if(action.actionName === "ClearAction"){
                        that.lc.clear(false , action.id);
                    }
                }
                for (var i=0 ; i<redoStack.length; i++) {
                    that.lc.undo(false);
                }
            }
        }
        that.operationIsAbled();
        $("#tool_zoom_default").trigger("click");
        if(  that.waitingProcessShapeData == undefined ||  that.waitingProcessShapeData == null){
            that.waitingProcessShapeData = {};
        }else{
            var currPageShapeArr =  that.waitingProcessShapeData["SharpsChange_"+fileId+"_"+currPageNum] ;
            if(currPageShapeArr!=null && currPageShapeArr!=undefined && currPageShapeArr.length>0){
                that.batchReceiveSnapshot(currPageShapeArr);
                that.waitingProcessShapeData ["SharpsChange_"+fileId+"_"+currPageNum] = null ;
            	  delete that.waitingProcessShapeData ["SharpsChange_"+fileId+"_"+currPageNum]  ;
            }          
        }
        if(paramsJson.callback && typeof paramsJson.callback === "function"){
            paramsJson.callback();
        }
    } ,
    handlerPubmsg_SharpsChange:function (pubmsgData) { //处理pubmsg的SharpsChange信令数据
        var that = this ;
        if(pubmsgData.data != null && (pubmsgData.data.eventType === "shapeSaveEvent" || pubmsgData.data.eventType === "clearEvent" || pubmsgData.data.eventType === "redoEvent" || pubmsgData.data.eventType === "laserMarkEvent" || pubmsgData.data.eventType === "changeZoomEvent" )) {
            pubmsgData.source = 'pubmsg';
            if(pubmsgData.data.eventType  === "laserMarkEvent" ) {
                that.receiveSnapshot(pubmsgData, null);
            }else {
                var shapeName = pubmsgData.id.substring(pubmsgData.id.lastIndexOf("###_") + 4);
                if(shapeName){
                    var shapeNameArr =shapeName.split("_");
                    var remoteFileid = shapeNameArr[1] ;
                    var remoteCurrpage = shapeNameArr[2] ;
                    var  currFileData = that.getFileDataFromLcElement();
                    if( currFileData.fileid == remoteFileid && currFileData.currpage == remoteCurrpage ){
                        that.receiveSnapshot(pubmsgData, null);
                    }else{
                        if(that.waitingProcessShapeData[shapeName] == null || that.waitingProcessShapeData[shapeName] == undefined) {
                            that.waitingProcessShapeData[shapeName] = [];
                            that.waitingProcessShapeData[shapeName].push(pubmsgData);
                        } else {
                            that.waitingProcessShapeData[shapeName].push(pubmsgData);
                        }
                    }
                }
            };
        }
    },
    handlerDelmsg_SharpsChange:function (delmsgData) {
        var that = this ;
        var shapeName = delmsgData.id.substring(delmsgData.id.lastIndexOf("###_") + 4);
        if(shapeName){
            var shapeNameArr =shapeName.split("_");
            var remoteFileid = shapeNameArr[1] ;
            var remoteCurrpage = shapeNameArr[2] ;
            var  currFileData = that.getFileDataFromLcElement();
            delmsgData.source = 'delmsg';
            if( currFileData.fileid == remoteFileid && currFileData.currpage == remoteCurrpage ){
                that.receiveSnapshot(delmsgData, null);
            }else{
                if(that.waitingProcessShapeData[shapeName] == null || that.waitingProcessShapeData[shapeName] == undefined) {
                    that.waitingProcessShapeData[shapeName] = [];
                    that.waitingProcessShapeData[shapeName].push(delmsgData);
                } else {
                    that.waitingProcessShapeData[shapeName].push(delmsgData);
                }
            }
        }
    },
    handlerMsglist_SharpsChange:function (sharpsChangeArray) {
        var that = this ;
        for(var i=0 ; i< sharpsChangeArray.length ; i++){
            var waitingProcessData = sharpsChangeArray[i] ;
            if(waitingProcessData.data != null && (waitingProcessData.data.eventType === "shapeSaveEvent" || waitingProcessData.data.eventType === "clearEvent" || waitingProcessData.data.eventType === "redoEvent" || waitingProcessData.data.eventType === "changeZoomEvent")) {
                waitingProcessData.source = 'msglist';
                var shapeName =waitingProcessData.id.substring(waitingProcessData.id.lastIndexOf("###_") + 4);
                if(that.waitingProcessShapeData[shapeName] == null || that.waitingProcessShapeData[shapeName] == undefined) {
                    that.waitingProcessShapeData[shapeName] = [];
                    that.waitingProcessShapeData[shapeName].push(waitingProcessData);
                } else {
                    that.waitingProcessShapeData[shapeName].push(waitingProcessData);
                }
            }
        }
    },
    defaultFileData:function () {
        var that = this ;
        var filedata = {
            fileid:0,
            currpage:1 ,
            pagenum:1 ,
            filetype: 'whiteboard'  ,
            filename: 'whiteboard' ,
            swfpath: '' ,
            pptslide:1 ,
            pptstep:0 ,
            steptotal:0 ,
        }
        return filedata ;
    },
    checkCanvasSize:function () {//检测canvas大小
        if(this.lc && this.lc.canvas){
            if( this.lc.canvas.width  === 0 || this.lc.canvas.height === 0){
                this.resizeHandler(this);
            }
        }
    },
    isTextEditing:function(){
        var that = this ;
        var  isEditing =  that.lc.tool.name.toString() == "Text"  && that.lc.tool.currentShapeState == "editing" ;
        return isEditing;
    },
    showCanvasBackground:function(){
        if(this.lc && this.lc.backgroundCanvas){
            this.lc.backgroundCanvas.style.display = '' ;
        }
    },
    hideCanvasBackground:function () {
        if(this.lc && this.lc.backgroundCanvas){
            this.lc.backgroundCanvas.style.display = 'none' ;
        }
    }
};

/*RGB颜色转换为16进制*/
String.prototype.colorHex = function(){
    var that = this;
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    if(/^(rgb|RGB)/.test(that)){
        var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g,"").split(",");
        var strHex = "#";
        for(var i=0; i<aColor.length; i++){
            var hex = Number(aColor[i]).toString(16);
            if(hex === "0"){
                hex += hex;
            }
            strHex += hex;
        }
        if(strHex.length !== 7){
            strHex = that;
        }
        return strHex;
    }else if(reg.test(that)){
        var aNum = that.replace(/#/,"").split("");
        if(aNum.length === 6){
            return that;
        }else if(aNum.length === 3){
            var numHex = "#";
            for(var i=0; i<aNum.length; i+=1){
                numHex += (aNum[i]+aNum[i]);
            }
            return numHex;
        }
    }else{
        return that;
    }
};

/*16进制颜色转为RGB格式*/
String.prototype.colorRgb = function(){
    var sColor = this.toLowerCase();
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    if(sColor && reg.test(sColor)){
        if(sColor.length === 4){
            var sColorNew = "#";
            for(var i=1; i<4; i+=1){
                sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        var sColorChange = [];
        for(var i=1; i<7; i+=2){
            sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
        }
        return "RGB(" + sColorChange.join(",") + ")";
    }else{
        return sColor;
    }
};
export default  CustomLiterally ;



