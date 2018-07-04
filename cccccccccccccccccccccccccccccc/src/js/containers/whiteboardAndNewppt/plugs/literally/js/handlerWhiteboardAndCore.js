/**
 * 白板界面与白板底层沟通的中间层处理类
 * @class HandlerWhiteboardAndCore
 * @description  提供白板界面与白板底层沟通的中间层处理类
 * @author QiuShao
 * @date 2017/09/05
 */
'use strict';
/*RGB颜色转换为16进制*/
String.prototype.colorHex = function(){
    let  that = this;
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    if(/^(rgb|RGB)/.test(that)){
        let aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g,"").split(",");
        let strHex = "#";
        for(let i=0; i<aColor.length; i++){
            let hex = Number(aColor[i]).toString(16);
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
        let aNum = that.replace(/#/,"").split("");
        if(aNum.length === 6){
            return that;
        }else if(aNum.length === 3){
            let numHex = "#";
            for(let i=0; i<aNum.length; i+=1){
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
    let sColor = this.toLowerCase();
    let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    if(sColor && reg.test(sColor)){
        if(sColor.length === 4){
            let sColorNew = "#";
            for(let i=1; i<4; i+=1){
                sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        let sColorChange = [];
        for(let i=1; i<7; i+=2){
            sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));
        }
        return "RGB(" + sColorChange.join(",") + ")";
    }else{
        return sColor;
    }
};
/*白板内部使用的工具*/
const whiteboardInnerUtils = {
    /**绑定事件
     @method addEvent
     @param   {element} element 添加事件元素
     {string} eType 事件类型
     {Function} handle 事件处理器
     {Bollean} bol false 表示在事件第三阶段（冒泡）触发，true表示在事件第一阶段（捕获）触发。
     */
    addEvent:(element, eType, handle, bol) => {
        bol = (bol!=undefined && bol!=null)?bol:false ;
        if(element.addEventListener){           //如果支持addEventListener
            element.addEventListener(eType, handle, bol);
        }else if(element.attachEvent){          //如果支持attachEvent
            element.attachEvent("on"+eType, handle);
        }else{                                  //否则使用兼容的onclick绑定
            element["on"+eType] = handle;
        }
    },
    /**事件解绑
     @method removeEvent
     @param   {element} element 删除事件元素
     {string} eType 事件类型
     {Function} handle 事件处理器
     {Bollean} bol false 表示在事件第三阶段（冒泡）触发，true表示在事件第一阶段（捕获）触发。
     */
    removeEvent:(element, eType, handle, bol) => {
       if(element.addEventListener){
            element.removeEventListener(eType, handle, bol);
        }else if(element.attachEvent){
            element.detachEvent("on"+eType, handle);
        }else{
            element["on"+eType] = null;
        }
    },
     getOffset:(elem) =>{
        let obj={
            left:elem.offsetLeft,
            top:elem.offsetTop,
        };
        while(elem != document.body){
            elem = elem.offsetParent ;
            obj.left += elem.offsetLeft ;
            obj.top += elem.offsetTop ;
        }
        return obj;
    }
};

/*白板类*/
class HandlerWhiteboardAndCore{
    constructor(){
        this.whiteboardToolsInfo = { //白板当前工具的状态
            primaryColor:"#000000" , //画笔的颜色
            secondaryColor:"#ffffff" , //填充的颜色
            backgroundColor:"#ffffff" , //背景颜色
            pencilWidth:5 , //笔的大小
            shapeWidth:5, //图形画笔大小
            eraserWidth:15 , //橡皮大小
            fontSize:18 , //字体大小
            fontFamily:"微软雅黑" ,
            fontStyle:"normal" ,
            fontWeight:"normal"
        };
        this.defaultProductionOptions = { //默认的白板生产配置选项
            whiteboardClear:true , //默认清除白板
            watermarkImageScalc:16/9 , //默认的白板比例
            whiteboardMagnification:1, //默认的白板放大比例
            containerWidthAndHeight:{width:0,height:0} , //白板承载容器的宽和高
            minHeight:undefined , //白板默认的最小高度
            rotateDeg:0 , //默认的旋转角度
            baseWhiteboardWidth:960 , //白板的宽高比例基数
            proprietaryTools:false , //白板是否拥有专属工具
            deawPermission:true , //白板可画权限
            tempDeawPermission:true ,//白板临时可画权限（必须在可画权限的基础上）
            saveRedoStack:false , //saveRedoStack权限
            saveUndoStack:true , //saveUndoStack权限
            remindContentTime:3000 , //提示内容显示时间
            showRemoteRemindContent:false , //是否显示远程提示内容
            showMyselfRemindContent:false , //是否显示自己的提示内容
        };
        this.whiteboardInstanceIDPrefix = "whiteboard_" ;
        this.whiteboardInstanceDefaultID = "whiteboard_"+'default' ;
        this.whiteboardInstanceStore = {} ; //白板实例存储中心
        this.whiteboardThumbnailStore = {} ; //白板缩略图存储中心
        this.uniqueWhiteboard = false ; //唯一的白板
        this.minMagnification = 1 ; //最小的白板放大倍数
        this.maxMagnification = 3 ; //最大的白板放大倍数
        this.useWhiteboardTool = {
            tool_pencil:false ,
            tool_highlighter:false ,
            tool_line:false ,
            tool_arrow:false ,
            tool_dashed:false ,
            tool_eraser:false ,
            tool_text:false ,
            tool_rectangle:false ,
            tool_rectangle_empty:false ,
            tool_ellipse:false ,
            tool_ellipse_empty:false ,
            tool_polygon:false ,
            tool_eyedropper:false ,
            tool_selectShape:false ,
            tool_mouse:false ,
            tool_laser:false ,
            action_undo:false ,
            action_redo:false ,
            action_clear:false ,
            zoom_big:false ,
            zoom_small:false ,
            zoom_default:false ,
        }; //使用的白板工具
        this.specialWhiteboardInstanceIDPrefix = 'specialWhiteboardInstanceIDPrefix_' ;
        this.awaitSaveToWhiteboardInstanceSignallingArray = [] ; //等待保存到白板实例的信令数据集合
        this.commonActiveTool = 'tool_pencil' ; //公共的正在使用的白板工具
        this.basicTemplateWhiteboardSignallingList = {}; //基本模板信令集合
        this.basicTemplateWhiteboardSignallingChildrenStackStorage = {} ; //基本模板画笔数据集合-孩子集合（用户保存使用模板的白板数据栈数据,不包含模板数据）
    };

    /*获取特殊白板id前缀*/
    getSpecialWhiteboardInstanceIDPrefix(){
        return this.specialWhiteboardInstanceIDPrefix ;
    };

    /*设置白板是否是唯一的白板*/
    setUniqueWhiteboard(isUniqueWhiteboard){
        this.uniqueWhiteboard = isUniqueWhiteboard ;
    };

    /*激活公共的白板工具*/
    activeCommonWhiteboardTool(toolKey){
        const that = this ;
        if( /^tool_/.test(toolKey) ) { //白板底层工具
            that.commonActiveTool = toolKey ; //当前使用的公共的激活工具
        }
        for(let whiteboardInstance of Object.values(that.whiteboardInstanceStore) ){
            if(whiteboardInstance.proprietaryTools){ //白板拥有专属工具则不受公共工具的管理
                continue ;
            }
            let id =  whiteboardInstance.id ;
            that.activeWhiteboardTool(toolKey , id);
        }
    };

    /*更新whiteboardToolsInfo*/
    updateCommonWhiteboardToolsInfo(whiteboardToolsInfo){
        if(whiteboardToolsInfo && typeof whiteboardToolsInfo === 'object'){
            Object.assign(this.whiteboardToolsInfo , whiteboardToolsInfo)
        }
    };

    /*获取白板的默认filedata数据*/
    getWhiteboardDefaultFiledata( replaceJson ){
        let filedata = {
            fileid:0,
            currpage:1 ,
            pagenum:1 ,
            filetype: 'whiteboard'  ,
            filename: 'whiteboard' ,
            swfpath: '' ,
            pptslide:1 ,
            pptstep:0 ,
            steptotal:0 ,
        };
        if(replaceJson && typeof replaceJson === 'object'){
            Object.assign(filedata , replaceJson );
        }
        return filedata ;
    };

    /*处理pubmsg的SharpsChange信令数据(注意：只能有一个地方调用)*/
    handlerPubmsg_SharpsChange(pubmsgData){
        if(pubmsgData){
            if(pubmsgData.data && typeof pubmsgData.data === 'string'){
                pubmsgData.data = JSON.parse(pubmsgData.data);
            }
            this._saveBasicTemplateWhiteboardSignallingData(pubmsgData , 'pubmsg' );
            let whiteboardID = pubmsgData.data.whiteboardID ;
            let whiteboardInstance = this._getWhiteboardInstanceById(whiteboardID);
            if(!whiteboardInstance){
                pubmsgData.source = 'pubmsg';
                this.awaitSaveToWhiteboardInstanceSignallingArray.push(pubmsgData);
                return ;
            }
            if(pubmsgData && pubmsgData.data != null && (pubmsgData.data.eventType === "shapeSaveEvent"
                || pubmsgData.data.eventType === "clearEvent" || pubmsgData.data.eventType === "redoEvent" || pubmsgData.data.eventType === "laserMarkEvent" || pubmsgData.data.eventType === "changeZoomEvent" )) {
                pubmsgData.source = 'pubmsg';
                if(pubmsgData.data.eventType  === "laserMarkEvent" ) {
                    this._receiveSnapshot(pubmsgData, whiteboardInstance);
                }else {
                    let shapeName = pubmsgData.id.substring(pubmsgData.id.lastIndexOf("###_") + 4);
                    if(shapeName){
                        let shapeNameArr =shapeName.split("_");
                        let remoteFileid = shapeNameArr[1] ;
                        let remoteCurrpage = shapeNameArr[2] ;
                        let  currFileData = this.getWhiteboardFiledata(whiteboardID);
                        if( currFileData.fileid == remoteFileid && currFileData.currpage == remoteCurrpage ){
                            this._receiveSnapshot(pubmsgData, whiteboardInstance);
                            if(whiteboardInstance.showRemoteRemindContent && pubmsgData.remindContent){
                                this._handlerShowRemoteRemindContentFromPubmsgData(whiteboardInstance , pubmsgData)
                            }
                        }else{
                            if(whiteboardInstance.waitingProcessShapeData[shapeName] == null || whiteboardInstance.waitingProcessShapeData[shapeName] == undefined) {
                                whiteboardInstance.waitingProcessShapeData[shapeName] = [];
                                whiteboardInstance.waitingProcessShapeData[shapeName].push(pubmsgData);
                            } else {
                                whiteboardInstance.waitingProcessShapeData[shapeName].push(pubmsgData);
                            }
                        }
                    }
                };
            }
        }
    };

    /*处理delmsg的SharpsChange信令数据(注意：只能有一个地方调用)*/
    handlerDelmsg_SharpsChange(delmsgData){
        if(delmsgData){
            if(delmsgData.data && typeof delmsgData.data === 'string'){
                delmsgData.data = JSON.parse(delmsgData.data);
            }
            this._saveBasicTemplateWhiteboardSignallingData(delmsgData , 'delmsg' );
            let whiteboardID = delmsgData.data.whiteboardID;
            let whiteboardInstance = this._getWhiteboardInstanceById(whiteboardID);
            if(!whiteboardInstance){
                delmsgData.source = 'delmsg';
                this.awaitSaveToWhiteboardInstanceSignallingArray.push(delmsgData);
                return ;
            }
            let shapeName = delmsgData.id.substring(delmsgData.id.lastIndexOf("###_") + 4);
            if(shapeName){
                let shapeNameArr =shapeName.split("_");
                let remoteFileid = shapeNameArr[1] ;
                let remoteCurrpage = shapeNameArr[2] ;
                let  currFileData = this.getWhiteboardFiledata(whiteboardID);
                delmsgData.source = 'delmsg';
                if( currFileData.fileid == remoteFileid && currFileData.currpage == remoteCurrpage ){
                    this._receiveSnapshot(delmsgData, whiteboardInstance);
                }else{
                    if(whiteboardInstance.waitingProcessShapeData[shapeName] == null || whiteboardInstance.waitingProcessShapeData[shapeName] == undefined) {
                        whiteboardInstance.waitingProcessShapeData[shapeName] = [];
                        whiteboardInstance.waitingProcessShapeData[shapeName].push(delmsgData);
                    } else {
                        whiteboardInstance.waitingProcessShapeData[shapeName].push(delmsgData);
                    }
                }
            }
        }
    };

    /*处理msglist的SharpsChange信令数据(注意：只能有一个地方调用)*/
    handlerMsglist_SharpsChange(sharpsChangeArray ){
        for(let i=0 ; i< sharpsChangeArray.length ; i++){
            let waitingProcessData = sharpsChangeArray[i] ;
            if(waitingProcessData.data && typeof waitingProcessData.data === 'string'){
                waitingProcessData.data = JSON.parse(waitingProcessData.data);
            }
            if( waitingProcessData.data.whiteboardID!==undefined  && waitingProcessData.data.dependenceBaseboardWhiteboardID !== undefined  &&  this.basicTemplateWhiteboardSignallingChildrenStackStorage[waitingProcessData.data.dependenceBaseboardWhiteboardID] && this.basicTemplateWhiteboardSignallingChildrenStackStorage[waitingProcessData.data.dependenceBaseboardWhiteboardID][waitingProcessData.data.whiteboardID] ){
                this.basicTemplateWhiteboardSignallingChildrenStackStorage[waitingProcessData.data.dependenceBaseboardWhiteboardID][waitingProcessData.data.whiteboardID] = null ;
                delete  this.basicTemplateWhiteboardSignallingChildrenStackStorage[waitingProcessData.data.dependenceBaseboardWhiteboardID][waitingProcessData.data.whiteboardID] ;
            }
            this._saveBasicTemplateWhiteboardSignallingData(waitingProcessData , 'msglist' );
            let whiteboardID = waitingProcessData.data.whiteboardID ;
            let whiteboardInstance = this._getWhiteboardInstanceById(whiteboardID);
            if(!whiteboardInstance){
                waitingProcessData.source = 'msglist';
                this.awaitSaveToWhiteboardInstanceSignallingArray.push(waitingProcessData);
                continue ;
            }
            if(waitingProcessData.data != null && (waitingProcessData.data.eventType === "shapeSaveEvent" || waitingProcessData.data.eventType === "clearEvent" || waitingProcessData.data.eventType === "redoEvent" || waitingProcessData.data.eventType === "changeZoomEvent")) {
                waitingProcessData.source = 'msglist';
                let shapeName =waitingProcessData.id.substring(waitingProcessData.id.lastIndexOf("###_") + 4);
                if(whiteboardInstance.waitingProcessShapeData[shapeName] == null || whiteboardInstance.waitingProcessShapeData[shapeName] == undefined) {
                    whiteboardInstance.waitingProcessShapeData[shapeName] = [];
                    whiteboardInstance.waitingProcessShapeData[shapeName].push(waitingProcessData);
                } else {
                    whiteboardInstance.waitingProcessShapeData[shapeName].push(waitingProcessData);
                }
            }
        }
    };

    /*预加载白板的图片*/
    preloadWhiteboardImg(imgUrl , callback){
        if(!imgUrl){L.Logger.warning('preload img url is not esixt!');return ;} ;
        let img = new Image();
        img.onload = function(){ //图片加载成功后
            if(callback && typeof callback === 'function'){
                callback();
            }
        };
        img.src = imgUrl ;
    };

    /*初始化白板权限
     * @params
     whiteboardElementId:白板元素id（string , required） thumbnailId:缩略图元素id（string ） ，
     options:配置项(object)
     */
    productionWhiteboard({whiteboardElementId , thumbnailId , productionOptions = {} , handler = {} , id  } = {} ){
        const that = this ;
        if( !whiteboardElementId ){L.Logger.error('whiteboardElementId is required!'); return ;}
        let whiteboardInstanceID =  that._getWhiteboardInstanceID(id)  ;
        let whiteboardInstance = that._getWhiteboardInstanceByID(whiteboardInstanceID);
        if(whiteboardInstance){L.Logger.error( 'The production whiteboard(whiteboardInstanceID:'+whiteboardInstanceID+') fails, the whiteboard already exists!' ) ;return  whiteboardInstance;}
        whiteboardInstance = {} ;
        let whiteboardElement = document.getElementById(whiteboardElementId);
        if(!whiteboardElement){L.Logger.error( 'Whiteboard elements do not exist , element id is:'+whiteboardElementId+'!' ) ;return whiteboardInstance;}
        let whiteboardInstanceElement =  document.createElement('div');
        let whiteboardInstanceElementId =  whiteboardElementId+'_whiteboardInstance' ;
        whiteboardInstanceElement.className = 'whiteboard-instance-element' ;
        whiteboardInstanceElement.id =  whiteboardInstanceElementId ;
        whiteboardElement.appendChild(whiteboardInstanceElement);
        productionOptions = Object.assign( {} , that.defaultProductionOptions , productionOptions  ) ;
        that.whiteboardInstanceStore[whiteboardInstanceID] = whiteboardInstance ; //白板实例
        whiteboardInstance.filedata = productionOptions.filedata || {} ;
        whiteboardInstance.baseWhiteboardWidth = productionOptions.baseWhiteboardWidth ;
        whiteboardInstance.whiteboardInstanceID = whiteboardInstanceID ; //白板id
        whiteboardInstance.parcelAncestorElementId = productionOptions.parcelAncestorElementId ; //包裹的祖先元素的id
        whiteboardInstance.isBaseboard = productionOptions.isBaseboard ; //是否是模板白板
        whiteboardInstance.needLooadBaseboard = productionOptions.needLooadBaseboard ; //是否需要加载模板数据
        whiteboardInstance.dependenceBaseboardWhiteboardID = productionOptions.dependenceBaseboardWhiteboardID ; //依赖的模板白板的id
        whiteboardInstance.watermarkImageScalc = productionOptions.watermarkImageScalc ; //白板比例
        whiteboardInstance.whiteboardMagnification = productionOptions.whiteboardMagnification ; //白板缩放倍数
        whiteboardInstance.remindContentTime = productionOptions.remindContentTime ; //提示内容显示时间
        whiteboardInstance.showRemoteRemindContent = productionOptions.showRemoteRemindContent ; //是否显示远程提示内容
        whiteboardInstance.showMyselfRemindContent = productionOptions.showMyselfRemindContent ; //是否显示自己的提示内容
        whiteboardInstance.associatedMsgID = productionOptions.associatedMsgID; //绑定的信令消息id
        whiteboardInstance.associatedUserID = productionOptions.associatedUserID; //绑定的用户id
        whiteboardInstance.proprietaryTools = productionOptions.proprietaryTools; //白板是否拥有专属工具
        whiteboardInstance.minHeight  = productionOptions.minHeight ;//白板最小的高度
        whiteboardInstance.rotateDeg  = productionOptions.rotateDeg ;//白板的旋转角度
        whiteboardInstance.deawPermission =productionOptions.deawPermission ; //白板可画权限
        whiteboardInstance.tempDeawPermission =productionOptions.tempDeawPermission ; //白板临时可画权限（必须在可画权限的基础上）
        whiteboardInstance.nickname =productionOptions.nickname ; //白板属于的用户的nickname
        whiteboardInstance.userid =productionOptions.userid ; //白板属于的用户的userid
        whiteboardInstance.whiteboardToolsInfo = Object.assign({} ,  that.whiteboardToolsInfo ) ; //白板工具信息
        if(productionOptions.primaryColor){
            whiteboardInstance.whiteboardToolsInfo.primaryColor = productionOptions.primaryColor ;
        }
        if(productionOptions.secondaryColor){
            whiteboardInstance.whiteboardToolsInfo.secondaryColor = productionOptions.secondaryColor ;
        }
        if(productionOptions.backgroundColor){
            whiteboardInstance.whiteboardToolsInfo.backgroundColor = productionOptions.backgroundColor ;
        }
        whiteboardInstance.saveRedoStack =productionOptions.saveRedoStack ; //白板的saveRedoStack权限
        whiteboardInstance.saveUndoStack =productionOptions.saveUndoStack ; //白板的saveUndoStack权限
        whiteboardInstance.imageThumbnailId =productionOptions.imageThumbnailId ; //白板的图片缩略图Id
        whiteboardInstance.imageThumbnailTipContent = productionOptions.imageThumbnailTipContent ; //白板的图片缩略图提示信息
        whiteboardInstance.registerWhiteboardToolsList = {} ; //白板标注工具注册集合
        whiteboardInstance.stackStorage  = {} ;//白板数据栈对象
        whiteboardInstance.handler = {} ; //处理函数集合
        whiteboardInstance.handler.sendSignallingToServer = handler.sendSignallingToServer ;
        whiteboardInstance.handler.delSignallingToServer = handler.delSignallingToServer ;
        whiteboardInstance.handler.resizeWhiteboardSizeCallback = handler.resizeWhiteboardSizeCallback ;
        whiteboardInstance.handler.noticeUpdateToolDescCallback = handler.noticeUpdateToolDescCallback ;
        whiteboardInstance.active = true ; //白板激活状态
        whiteboardInstance.containerWidthAndHeight = productionOptions.containerWidthAndHeight ;
        //tkpc2.0.8
        whiteboardInstance.useToolKey = productionOptions.useToolKey ;
        whiteboardInstance.waitingProcessShapeData = {} ; //等待处理的白板数据
        whiteboardInstance.whiteboardElementId = whiteboardElementId ; //白板节点的id
        whiteboardInstance.whiteboardElement = whiteboardElement ; //白板的节点元素
        whiteboardInstance.whiteboardInstanceElementId = whiteboardInstanceElementId ; //白板实例节点的id
        whiteboardInstance.whiteboardInstanceElement = whiteboardInstanceElement ; //白板实例节点元素
        whiteboardInstance.id = id ; //文件id
        whiteboardInstance.thumbnailId = thumbnailId ; //白板缩略图元素id
        whiteboardInstance.lc = window.LC.init( whiteboardInstance.whiteboardInstanceElement ); //白板对象
        whiteboardInstance.lc.backingScale = 1 ; //设置canvas不受电脑分辨率影响
        whiteboardInstance.lc.setColor('primary',whiteboardInstance.whiteboardToolsInfo.primaryColor );
        whiteboardInstance.lc.setColor('secondary',whiteboardInstance.whiteboardToolsInfo.secondaryColor  );
        whiteboardInstance.lc.setColor('background',whiteboardInstance.whiteboardToolsInfo.backgroundColor );
        whiteboardInstance.lc.setWatermarkImageToLcBackground( false );
        whiteboardInstance.lc.setZoom( 1 );
        whiteboardInstance.lc.setPan(0,0);
        whiteboardInstance.lc.on( "shapeSave", that._handlerShapeSaveEvent.bind(that , whiteboardInstance ) );
        whiteboardInstance.lc.on( "undo" , that._handlerUndoEvent.bind(that , whiteboardInstance ) ) ;
        whiteboardInstance.lc.on( "redo" ,that._handlerRedoEvent.bind(that , whiteboardInstance ) ) ;
        whiteboardInstance.lc.on( "clear" ,that._handlerClearEvent.bind(that , whiteboardInstance ) ) ;
        whiteboardInstance.lc.on('drawingChange', this._handlerDrawingChangeEvent.bind(that , whiteboardInstance ) );
//      whiteboardInstance.lc.on('snapshotLoad ', this.snapshotLoadEvent);
//      whiteboardInstance.lc.on("doClearRedoStack",this.doClearRedoStackEvent) ;
//      whiteboardInstance.lc.on("primaryColorChange",this.primaryColorChangeEvent) ;
//      whiteboardInstance.lc.on("secondaryColorChange",this.secondaryColorChangeEvent) ;
//      whiteboardInstance.lc.on("backgroundColorChange",this.backgroundColorChangeEvent) ;
//      whiteboardInstance.lc.on("drawStart",this.drawStartEvent) ;
//      whiteboardInstance.lc.on("drawContinue",this.drawContinueEvent) ;
//      whiteboardInstance.lc.on("drawEnd",this.drawEndEvent) ;
//      whiteboardInstance.lc.on("toolChange",this.toolChangeEvent) ;
//      whiteboardInstance.lc.on('pan',  this.panEvent);
//      whiteboardInstance.lc.on('zoom',  this.zoomEvent);
//      whiteboardInstance.lc.on("repaint",this.repaintEvent) ;
//      whiteboardInstance.lc.on("lc-pointerdown",whiteboardInstance.lcPointerdownEvent) ;
//      whiteboardInstance.lc.on("lc-pointerup",whiteboardInstance.lcPointerupEvent) ;
//      whiteboardInstance.lc.on("lc-pointermove",whiteboardInstance.lcPointermoveEvent) ;
//      whiteboardInstance.lc.on("lc-pointerdrag",whiteboardInstance.lcPointerdragEvent) ;
        whiteboardInstance.activeTool = undefined ;
        if(productionOptions.whiteboardClear){
            that.clearWhiteboardAllDataById(id);
        };
        if( whiteboardInstance.dependenceBaseboardWhiteboardID !== undefined  && whiteboardInstance.id !== undefined){
            if(that.basicTemplateWhiteboardSignallingChildrenStackStorage[whiteboardInstance.dependenceBaseboardWhiteboardID]  && that.basicTemplateWhiteboardSignallingChildrenStackStorage[whiteboardInstance.dependenceBaseboardWhiteboardID][whiteboardInstance.id] ){
                if(!whiteboardInstance.isBaseboard){
                    whiteboardInstance.stackStorage = Object.assign({} , that.basicTemplateWhiteboardSignallingChildrenStackStorage[whiteboardInstance.dependenceBaseboardWhiteboardID][whiteboardInstance.id]);
                }
                that.basicTemplateWhiteboardSignallingChildrenStackStorage[whiteboardInstance.dependenceBaseboardWhiteboardID][whiteboardInstance.id]  = null ;
                delete that.basicTemplateWhiteboardSignallingChildrenStackStorage[whiteboardInstance.dependenceBaseboardWhiteboardID][whiteboardInstance.id]  ;
            }
        }
        that._changeWhiteboardDeawPermission(whiteboardInstance.deawPermission , whiteboardInstance);
        that._changeWhiteboardTemporaryDeawPermission(whiteboardInstance.tempDeawPermission , whiteboardInstance);
        that._saveAwaitSaveToWhiteboardInstanceSignallingToWhiteboardInstance(whiteboardInstance); //保存等待的白板信令数据到相应的白板实例中
        that.activeWhiteboardTool( ( !whiteboardInstance.proprietaryTools ?  that.commonActiveTool : ( whiteboardInstance.useToolKey ?   whiteboardInstance.useToolKey : 'tool_pencil' ) ) , id);
        that._zoomIsDisable(whiteboardInstance);
        that._actionIsDisable(whiteboardInstance);
        that._noticeUpdateToolDesc(whiteboardInstance);
        that._resizeWhiteboardHandler(whiteboardInstance);
        return whiteboardInstance ;
    };

    /*更新图片缩略图ID*/
    updateImageThumbnailId(id , imageThumbnailId){
        let whiteboardInstance = this._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[updateImageThumbnailId]There are no white board Numbers that belong to id '+id ) ;return ;}
        whiteboardInstance.imageThumbnailId = imageThumbnailId ;
        this._saveImageBase64ToImageThumbnail(whiteboardInstance);
    };

    /*更新白板saveRedoStack、saveUndoStack权限*/
    updateWhiteboardSaveRedoStackAndSaveUndoStack(id , {saveRedoStack , saveUndoStack} ){
        let whiteboardInstance = this._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[updateSaveRedoStackAndSaveUndoStack]There are no white board Numbers that belong to id '+id ) ;return ;}
        whiteboardInstance.saveRedoStack = saveRedoStack!=undefined?saveRedoStack : whiteboardInstance.saveRedoStack;
        whiteboardInstance.saveUndoStack = saveUndoStack!=undefined?saveUndoStack : whiteboardInstance.saveUndoStack;
    }

    /*更新isBaseboard*/
    updateIsBaseboard(id , isBaseboard){
        const that = this ;
        let whiteboardInstance = that._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[updateIsBaseboard]There are no white board Numbers that belong to id '+id ) ;return ;}
        whiteboardInstance.isBaseboard = isBaseboard ;
    }

    /*更新dependenceBaseboardWhiteboardID*/
    updateDependenceBaseboardWhiteboardID(id , dependenceBaseboardWhiteboardID){
        const that = this ;
        let whiteboardInstance = that._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[updateDependenceBaseboardWhiteboardID]There are no white board Numbers that belong to id '+id ) ;return ;}
        whiteboardInstance.dependenceBaseboardWhiteboardID = dependenceBaseboardWhiteboardID ;
    }

    /*更新提示内容显示权限*/
    updateShowRemindContent(id , showRemoteRemindContent , showMyselfRemindContent){
        let whiteboardInstance = this._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[updateShowRemindContent]There are no white board Numbers that belong to id '+id ) ;return ;}
        whiteboardInstance.showRemoteRemindContent = showRemoteRemindContent ||  whiteboardInstance.showRemoteRemindContent ;
        whiteboardInstance.showMyselfRemindContent = showMyselfRemindContent ||  whiteboardInstance.showMyselfRemindContent ;
    };


    /*生产白板提示内容*/
    /*productionWhiteboardRemindContent(id , x , y , content){
        let whiteboardInstance = this._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[productionWhiteboardRemindContent]There are no white board Numbers that belong to id '+id ) ;return ;}
        this._productionWhiteboardRemindContent(id , x , y , content);
    }*/

    /*更新白板信令绑定的消息id*/
    updateWhiteboardAssociatedMsgID(id , associatedMsgID){
        const that = this ;
        let whiteboardInstance = that._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[updateWhiteboardAssociatedMsgID]There are no white board Numbers that belong to id '+id ) ;return ;}
        whiteboardInstance.associatedMsgID = associatedMsgID ;
    }

    /*更新白板信令绑定的用户id*/
    updateWhiteboardAssociatedUserID(id , associatedUserID){
        const that = this ;
        let whiteboardInstance = that._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[updateWhiteboardAssociatedUserID]There are no white board Numbers that belong to id '+id ) ;return ;}
        whiteboardInstance.associatedUserID = associatedUserID ;
    }

    /*白板实例是否存在，通过id判断*/
    hasWhiteboardById(id){
        const that = this ;
        let whiteboardInstance = that._getWhiteboardInstanceById(id);
        return (whiteboardInstance !== undefined &&  whiteboardInstance !== null) ;
    };

    /*清除白板的所有数据，包括存储的数据,通过id*/
    clearWhiteboardAllDataById(id){
        const that = this ;
        let whiteboardInstance = that._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[clear]There are no white board Numbers that belong to id '+id ) ;return ;}
        that._clearWhiteboardAllDataByInstance(whiteboardInstance);
    };

    /*生产特殊的id*/
    productionSpecialId(id){
        const that = this ;
        let specialId = that.specialWhiteboardInstanceIDPrefix+id ;
        return specialId ;
    }

    /*销毁白板实例，通过id*/
    destroyWhiteboardInstance(id){
        const that = this ;
        let whiteboardInstance = that._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[destroy]There are no white board Numbers that belong to id '+id ) ;return ;};
        that._destroyWhiteboardInstance(whiteboardInstance);
    };

    /*清空白板且清除白板数据栈*/
    clearRedoAndUndoStack(id , clearRedoAndUndoStackJson ){
        const that = this ;
        let whiteboardInstance = that._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[clearRedoAndUndoStack]There are no white board Numbers that belong to id '+id ) ;return ;};
        that._clearRedoAndUndoStack(whiteboardInstance , clearRedoAndUndoStackJson );
    };

    /*重置白板的缩放比*/
    resetDedaultWhiteboardMagnification(id){
        const that = this ;
        let whiteboardInstance = that._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[resetDedaultWhiteboardMagnification]There are no white board Numbers that belong to id '+id ) ;return ;};
        whiteboardInstance.whiteboardMagnification = that.defaultProductionOptions.whiteboardMagnification;
        that._zoomIsDisable(whiteboardInstance);
        that._resizeWhiteboardHandler(whiteboardInstance);
    };

    /*更新白板的缩放比*/
    updateWhiteboardMagnification(id , whiteboardMagnification){
        const that = this ;
        let whiteboardInstance = that._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[updateWhiteboardMagnification]There are no white board Numbers that belong to id '+id ) ;return ;};
        whiteboardInstance.whiteboardMagnification = whiteboardMagnification ;
    };

    /*更新白板的watermarkImageScalc*/
    updateWhiteboardWatermarkImageScalc(id , watermarkImageScalc = this.defaultProductionOptions.watermarkImageScalc ){
        let whiteboardInstance = this._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[updateWhiteboardWatermarkImageScalc]There are no white board Numbers that belong to id '+id ) ;return ;};
        this._updateWhiteboardWatermarkImageScalc( whiteboardInstance , watermarkImageScalc );
    }

    /*设置白板的图片*/
    setWhiteboardWatermarkImage(id ,watermarkImageUrl , {resetDedaultWhiteboardMagnification = true} = {} ){
        const that = this ;
        L.Logger.debug('setWhiteboardWatermarkImage watermarkImageUrl:'+ watermarkImageUrl );
        let whiteboardInstance = that._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[setWhiteboardWatermarkImage]There are no white board Numbers that belong to id '+id ) ;return ;};
        whiteboardInstance.lc.watermarkImage = null ;
        if(resetDedaultWhiteboardMagnification){
            that.resetDedaultWhiteboardMagnification(id);
        }
        if(!watermarkImageUrl){ //图片地址没有，则使用默认白板
            that.hideWhiteboardCanvasBackground(id);
            whiteboardInstance.lc.watermarkScale = 1 ;
            that._resizeWhiteboardByScalc(whiteboardInstance ,{isChangeWatermarkScale:false});
            that._hideWhiteboardLoading(whiteboardInstance);
            whiteboardInstance.lc.watermarkImage = null ;
            whiteboardInstance.lc.customCanvasBackgroundElement.style.backgroundImage = '';
            that._hideWhiteboardLoading(whiteboardInstance);
        }else{
            that.showWhiteboardCanvasBackground(id);
            that._showWhiteboardLoading(whiteboardInstance);
            clearTimeout( whiteboardInstance.setWhiteboardWatermarkImageTimer );
            whiteboardInstance.setWhiteboardWatermarkImageTimer =  setTimeout(function(){
                let watermarkImage = new Image();
                watermarkImage.onload = function(){
                    let watermarkImageScalc =  watermarkImage.width / watermarkImage.height ;
                    whiteboardInstance.lc.setWatermarkImage(watermarkImage);
                    that._resizeWhiteboardByScalc(whiteboardInstance , { watermarkImage, watermarkImageScalc } );
                    that._hideWhiteboardLoading(whiteboardInstance);
                };
                watermarkImage.src = watermarkImageUrl;
            },150);
        }
    };

    /*根据resize更新白板的大小*/
    resizeWhiteboardHandler(id){
        const that = this ;
        if(id === undefined){
            for( let whiteboardInstance of  Object.values( that.whiteboardInstanceStore ) ){
                that._resizeWhiteboardHandler(whiteboardInstance);
            }
        }else{
            let whiteboardInstance = that._getWhiteboardInstanceById(id);
            if(!whiteboardInstance){L.Logger.error( '[resizeWhiteboardHandler]There are no white board Numbers that belong to id '+id ) ;return ;};
            that._resizeWhiteboardHandler(whiteboardInstance);
        }
    };

    /*更新承载容器的宽高*/
    updateContainerWidthAndHeight(id , {width  , height}={}){
        const that = this ;
        let whiteboardInstance = that._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[updateContainerWidthAndHeight]There are no white board Numbers that belong to id '+id ) ;return ;};
        if(width === undefined || height === undefined){L.Logger.error( '[updateContainerWidthAndHeight]width or height is not exist , [width:'+width+' , height:'+height+']!') ;return ;};
        whiteboardInstance.containerWidthAndHeight = {width , height} ;
        that._resizeWhiteboardHandler(whiteboardInstance);
    };

    /*隐藏白板的背景canvas*/
    hideWhiteboardCanvasBackground(id){
        const that = this ;
        let whiteboardInstance = that._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[hideWhiteboardCanvasBackground]There are no white board Numbers that belong to id '+id ) ;return ;};
        if(whiteboardInstance.lc && whiteboardInstance.lc.backgroundCanvas){
            whiteboardInstance.lc.backgroundCanvas.style.display = 'none' ;
            whiteboardInstance.lc.customCanvasBackgroundElement.style.display = 'none';
        }
    };

    /*显示白板的背景canvas*/
    showWhiteboardCanvasBackground(id){
        const that = this ;
        let whiteboardInstance = that._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[showWhiteboardCanvasBackground]There are no white board Numbers that belong to id '+id ) ;return ;};
        if(whiteboardInstance.lc && whiteboardInstance.lc.backgroundCanvas){
            whiteboardInstance.lc.backgroundCanvas.style.display = '' ;
            whiteboardInstance.lc.customCanvasBackgroundElement.style.display = '';
        }
    };

    /*隐藏白板*/
    hideWhiteboard(id){
        const that = this ;
        let whiteboardInstance = that._getWhiteboardInstanceById(id);
        if(whiteboardInstance && whiteboardInstance.whiteboardElement){
            whiteboardInstance.whiteboardElement.style.display = 'none' ;
        }
    };

    /*显示白板*/
    showWhiteboard(id){
        const that = this ;
        let whiteboardInstance = that._getWhiteboardInstanceById(id);
        if(whiteboardInstance && whiteboardInstance.whiteboardElement){
            whiteboardInstance.whiteboardElement.style.display = 'block' ;
        }
    };

    /*更新白板字体*/
    updateTextFont(id , {fontSize  , fontFamily , fontStyle , fontWeight } = {} ){
        const that = this ;
        let whiteboardInstance = that._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[updateTextFont]There are no white board Numbers that belong to id '+id ) ;return ;}
        whiteboardInstance.whiteboardToolsInfo.fontSize = fontSize != undefined ?  fontSize : whiteboardInstance.whiteboardToolsInfo.fontSize ;
        whiteboardInstance.whiteboardToolsInfo.fontFamily = fontFamily != undefined ?  fontFamily : whiteboardInstance.whiteboardToolsInfo.fontFamily ;
        whiteboardInstance.whiteboardToolsInfo.fontStyle = fontStyle != undefined ?  fontStyle : whiteboardInstance.whiteboardToolsInfo.fontStyle ;
        whiteboardInstance.whiteboardToolsInfo.fontWeight = fontWeight != undefined ?  fontWeight : whiteboardInstance.whiteboardToolsInfo.fontWeight ;
        that._updateTextFont(whiteboardInstance);
    };

    /*更新橡皮宽度*/
    updateEraserWidth(id , {eraserWidth} = {} ){
        const that = this ;
        let whiteboardInstance = that._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[updateEraserWidth]There are no white board Numbers that belong to id '+id ) ;return ;}
        whiteboardInstance.whiteboardToolsInfo.eraserWidth = eraserWidth != undefined ?  eraserWidth : whiteboardInstance.whiteboardToolsInfo.eraserWidth ;
        that._updateEraserWidth(whiteboardInstance );
    };

    /*更新画笔的宽度*/
    updatePencilWidth(id , {pencilWidth}={} ){
        const that = this ;
        let whiteboardInstance = that._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[updatePencilWidth]There are no white board Numbers that belong to id '+id ) ;return ;}
        whiteboardInstance.whiteboardToolsInfo.pencilWidth = pencilWidth != undefined ?  pencilWidth : whiteboardInstance.whiteboardToolsInfo.pencilWidth ;
        that._updatePencilWidth(whiteboardInstance );
    };

    /*更新whiteboardToolsInfo*/
    updateWhiteboardToolsInfo(id , whiteboardToolsInfo){
        const that = this ;
        let whiteboardInstance = that._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[updateWhiteboardToolsInfo]There are no white board Numbers that belong to id '+id ) ;return ;}
        if(whiteboardToolsInfo && typeof whiteboardToolsInfo === 'object'){
            Object.assign(whiteboardInstance.whiteboardToolsInfo , whiteboardToolsInfo)
        }
    };

    /*更新形状的宽度*/
    updateShapeWidth(id , {shapeWidth}={} ){
        const that = this ;
        let whiteboardInstance = that._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[uploadShapeWidth]There are no white board Numbers that belong to id '+id ) ;return ;}
        whiteboardInstance.whiteboardToolsInfo.shapeWidth = shapeWidth != undefined ?  shapeWidth : whiteboardInstance.whiteboardToolsInfo.shapeWidth ;
        that._updateShapeWidth(whiteboardInstance );
    };

    /*更新颜色*/
    updateColor(id , colorJson ){
        const that = this ;
        if( colorJson && typeof colorJson === 'object'){
            let whiteboardInstance = that._getWhiteboardInstanceById(id);
            if(!whiteboardInstance){L.Logger.error( '[updateColor]There are no white board Numbers that belong to id '+id ) ;return ;}
            for(let [key ,value] of Object.entries(colorJson) ){
                /*
                 primaryColor:"#000000" , //画笔的颜色
                 secondaryColor:"#ffffff" , //填充的颜色
                 backgroundColor:"#ffffff" , //背景颜色
                 */
                whiteboardInstance.whiteboardToolsInfo[key+"Color"] = value ;
            }
            that._updateColor(whiteboardInstance , colorJson)
        }
    }

    /*激活白板工具*/
    activeWhiteboardTool(toolKey , id){
        const that = this ;
        if( that.useWhiteboardTool[toolKey]  === undefined ){L.Logger.error('The whiteboard does not have the '+toolKey+' tool!');return ;};
        if(id === undefined || id === null){ L.Logger.error( '[activeWhiteboardTool]id is undefined or null ' ) ;return ; } ;
        let whiteboardInstance = that._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[activeWhiteboardTool]There are no white board Numbers that belong to id '+id ) ;return ;}
        if( /^tool_/.test(toolKey) ){ //白板底层工具
            whiteboardInstance.activeTool = toolKey ; //当前使用的激活工具
            that._setWhiteboardTools(toolKey , whiteboardInstance);
            that._handlerActiveToolLaser(toolKey , whiteboardInstance);
            if( toolKey == "tool_text" ){
                that._updateTextFont(whiteboardInstance);
            }else if(toolKey == "tool_eraser"){
                that._updateEraserWidth(whiteboardInstance);
            }else if(toolKey == "tool_pencil" || toolKey == "tool_highlighter" || toolKey == "tool_line"   || toolKey == "tool_arrow"  || toolKey == "tool_dashed"){
                that._updatePencilWidth(whiteboardInstance);
            }else if(  toolKey == "tool_rectangle" || toolKey == "tool_rectangle_empty"  || toolKey == "tool_ellipse"  || toolKey == "tool_ellipse_empty"   || toolKey == "tool_polygon" ){
                that._updateShapeWidth(whiteboardInstance);
            }

            if(  toolKey == "tool_ellipse_empty"  || toolKey == "tool_rectangle_empty" ){ //空心
                whiteboardInstance.lc.setColor('secondary',"transparent" ) ;
            }else{
                whiteboardInstance.lc.setColor('secondary',whiteboardInstance.whiteboardToolsInfo.secondaryColor);
            }

            if( toolKey === 'tool_highlighter' ){  //荧光笔
                let color = whiteboardInstance.whiteboardToolsInfo.primaryColor.colorRgb().toLowerCase().replace("rgb","rgba").replace(")",",0.5)") ;
                whiteboardInstance.lc.setColor('primary', color  ) ;
            }else{
                whiteboardInstance.lc.setColor('primary',whiteboardInstance.whiteboardToolsInfo.primaryColor);
            }

        }else if(/^action_/.test(toolKey) ){ //白板执行的动作
            if(toolKey === 'action_undo'){
                whiteboardInstance.lc.undo();
            }else if( toolKey === 'action_redo' ){
                whiteboardInstance.lc.redo();
            }else if( toolKey === 'action_clear' ){
                whiteboardInstance.lc.clear();
                this._removeAllRemindContent(whiteboardInstance);
            }
            that._actionIsDisable(whiteboardInstance);
        }else if(/^zoom_/.test(toolKey) ){ //白板的缩放调整
            if(toolKey === 'zoom_big'){
                if(whiteboardInstance.whiteboardMagnification < that.maxMagnification ){
                    whiteboardInstance.whiteboardMagnification += 0.5 ;
                }
            }else if( toolKey === 'zoom_small' ){
                if(whiteboardInstance.whiteboardMagnification > that.minMagnification ){
                    whiteboardInstance.whiteboardMagnification -= 0.5 ;
                }
            }else if( toolKey === 'zoom_default' ){
                whiteboardInstance.whiteboardMagnification = that.defaultProductionOptions.whiteboardMagnification ;
            }
            if(whiteboardInstance.whiteboardMagnification >  that.maxMagnification  ){
                whiteboardInstance.whiteboardMagnification = that.maxMagnification  ;
            }else if(whiteboardInstance.whiteboardMagnification < that.minMagnification ){
                whiteboardInstance.whiteboardMagnification = that.minMagnification ;
            }
            that._zoomIsDisable(whiteboardInstance);
            that._resizeWhiteboardHandler(whiteboardInstance);
        }
    };

    /*改变白板临时可画权限*/
    changeWhiteboardTemporaryDeawPermission(value , id){
        const that = this ;
        let whiteboardInstance = undefined ;
        if(id != undefined){
            whiteboardInstance = that._getWhiteboardInstanceById(id);
            if(!whiteboardInstance){L.Logger.error( '[changeWhiteboardTemporaryDeawPermission]There are no white board Numbers that belong to id '+id ) ;return ;}
        }
        that._changeWhiteboardTemporaryDeawPermission(value , whiteboardInstance);
    };

    /*改变白板临时可画权限*/
    changeWhiteboardDeawPermission(value , id){
        const that = this ;
        let whiteboardInstance = undefined ;
        if(id != undefined){
            whiteboardInstance = that._getWhiteboardInstanceById(id);
            if(!whiteboardInstance){L.Logger.error( '[changeWhiteboardDeawPermission]There are no white board Numbers that belong to id '+id ) ;return ;}
        }
        that._changeWhiteboardDeawPermission(value , whiteboardInstance);
    };

    /*初始化标注工具*/
    registerWhiteboardTools(id , toolsDesc){
        const that = this ;
        if( !(toolsDesc && typeof toolsDesc === 'object') ){L.Logger.error('[initWhiteboardTools] tools desc cannot be empty and type json!');return;  };
        let whiteboardInstance  = that._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[registerWhiteboardTools]There are no white board Numbers that belong to id '+id ) ;return ;}
        let toolsDescMap = {} ;
        for(let [toolKey , toolValue] of Object.entries(toolsDesc) ){
            if( that.useWhiteboardTool[toolKey]  === undefined ){L.Logger.warning('The whiteboard does not have the '+toolKey+' tool!');continue ;}
            toolsDescMap[toolKey] = that._productionToolDesc(toolKey , toolValue);
            that.useWhiteboardTool[toolKey] = true ;
        }
        whiteboardInstance.registerWhiteboardToolsList = toolsDescMap ;
        whiteboardInstance.isRegisterWhiteboardTool = true ;
        that._zoomIsDisable(whiteboardInstance);
        that._zoomIsDisable(whiteboardInstance);
        that._noticeUpdateToolDesc(whiteboardInstance);
    };

    /*是否拥有filedata数据*/
    hasWhiteboardFiledata(id){
        let whiteboardInstance = this._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[hasWhiteboardFiledata]There are no white board Numbers that belong to id '+id ) ;return ;}
        for( let key of Object.keys(whiteboardInstance.filedata) ){
            return true ;
        }
        return false ;
    };

    /*更新白板的filedata数据*/
    updateWhiteboardFiledata(id , filedata){
       let whiteboardInstance = this._getWhiteboardInstanceById(id);
       if(!whiteboardInstance){L.Logger.error( '[updateWhiteboardFiledata]There are no white board Numbers that belong to id '+id ) ;return ;}
       this._updateWhiteboardFiledata(whiteboardInstance , filedata);
    };

    /*获取白板的filedata*/
    getWhiteboardFiledata(id){
        let whiteboardInstance = this._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[getWhiteboardFiledata]There are no white board Numbers that belong to id '+id ) ;return ;}
        return Object.assign({} ,  whiteboardInstance.filedata ) ;
    };

    /*加载当前页的白板数据*/
    loadCurrpageWhiteboard(id , {loadRedoStack=false , loadUndoStack=true , callback} = {} ){
        let whiteboardInstance = this._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[loadCurrpageWhiteboard]There are no white board Numbers that belong to id '+id ) ;return ;}
        this._clearRedoAndUndoStack(whiteboardInstance) ; //清空白板且清除白板数据栈
        this._basicTemplateWhiteboardSignallingListToWhiteboardInstance(whiteboardInstance);
        let {fileid , currpage} = whiteboardInstance.filedata ;
        if(loadUndoStack){
            let undoStack = whiteboardInstance.stackStorage[ "undoStack_"+fileid+"_"+currpage ] ;
            if(undoStack && undoStack.length>0){
                let undoStackAddShapeActionActionArray = [] ;
                for (let i=0 ; i<undoStack.length; i++) {
                    let action =  undoStack[i] ;
                    if(action.actionName === "AddShapeAction"){
                        undoStackAddShapeActionActionArray.push(action);
                        //whiteboardInstance.lc.saveShape( action.shape  , false  , null , false);
                    }else if(action.actionName === "ClearAction"){
                        undoStackAddShapeActionActionArray.map( (action , index ) => {
                            let doNotPaint = true ;
                            //if(index === undoStackAddShapeActionActionArray.length-1 ){
                            //    doNotPaint = false ;
                            //}
                            whiteboardInstance.lc.saveShape( action.shape  , false  , null , doNotPaint);
                        });
                        undoStackAddShapeActionActionArray.length = 0;
                        whiteboardInstance.lc.clear(false , action.id);
                        this._removeAllRemindContent(whiteboardInstance);
                    }
                }
                undoStackAddShapeActionActionArray.map( (action , index ) => {
                    let doNotPaint = true ;
                    if(index === undoStackAddShapeActionActionArray.length-1 ){
                        doNotPaint = false ;
                    }
                    whiteboardInstance.lc.saveShape( action.shape  , false  , null , doNotPaint);
                });
                undoStackAddShapeActionActionArray.length = 0;
            }
        }
        if(loadRedoStack){  /*TODO 这里暂时采用老师将恢复栈的数据都加到撤销站中，再执行撤销操作，有待优化*/
            let redoStack = whiteboardInstance.stackStorage[ "redoStack_"+fileid+"_"+currpage ] ;
            if(redoStack && redoStack.length>0){
                let redoStackAddShapeActionActionArray = [] ;
                for (let i=redoStack.length - 1 ; i>=0; i--) {
                    let action =  redoStack[i] ;
                    if(action.actionName === "AddShapeAction"){
                        redoStackAddShapeActionActionArray.push(action);
                        //whiteboardInstance.lc.saveShape( action.shape  , false  , null , false);
                    }else if(action.actionName === "ClearAction"){
                        redoStackAddShapeActionActionArray.map( (action , index ) => {
                            let doNotPaint = true ;
                            //if(index === undoStackAddShapeActionActionArray.length-1 ){
                            //    doNotPaint = false ;
                            //}
                            whiteboardInstance.lc.saveShape( action.shape  , false  , null , doNotPaint);
                        });
                        redoStackAddShapeActionActionArray.length = 0;
                        whiteboardInstance.lc.clear(false , action.id);
                        this._removeAllRemindContent(whiteboardInstance);
                    }
                }
                redoStackAddShapeActionActionArray.map( (action , index ) => {
                    let doNotPaint = true ;
                    if(index === redoStackAddShapeActionActionArray.length-1 ){
                        doNotPaint = false ;
                    }
                    whiteboardInstance.lc.saveShape( action.shape  , false  , null , doNotPaint);
                });
                redoStackAddShapeActionActionArray.length = 0;
                for (let i=0 ; i<redoStack.length; i++) {
                    whiteboardInstance.lc.undo(false);
                }
            }
        }
        if(  whiteboardInstance.waitingProcessShapeData == undefined ||  whiteboardInstance.waitingProcessShapeData == null){
            whiteboardInstance.waitingProcessShapeData = {};
        }else{
            let currpageWaitingProcessShapeData =  whiteboardInstance.waitingProcessShapeData["SharpsChange_"+fileid+"_"+currpage] ;
            if(currpageWaitingProcessShapeData!=null && currpageWaitingProcessShapeData!=undefined && currpageWaitingProcessShapeData.length>0){
                this._batchReceiveSnapshot(currpageWaitingProcessShapeData , whiteboardInstance);
                whiteboardInstance.waitingProcessShapeData ["SharpsChange_"+fileid+"_"+currpage] = null ;
                delete whiteboardInstance.waitingProcessShapeData ["SharpsChange_"+fileid+"_"+currpage]  ;
            }
        }
        this._actionIsDisable(whiteboardInstance);
        if(callback && typeof callback === "function"){
            callback();
        }
    };

    /*保存白板数据栈到数据栈仓库中*/
    saveWhiteboardStackToStorage(id , {saveRedoStack , saveUndoStack } = {} ){
        let whiteboardInstance = this._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[saveWhiteboardStackToStorage]There are no white board Numbers that belong to id '+id ) ;return ;}
        saveRedoStack = saveRedoStack!=undefined?saveRedoStack : whiteboardInstance.saveRedoStack;
        saveUndoStack = saveUndoStack!=undefined?saveUndoStack : whiteboardInstance.saveUndoStack;
        let {fileid , currpage} = this.getWhiteboardFiledata(id);
        if(saveUndoStack){
            whiteboardInstance.stackStorage["undoStack_"+fileid+"_"+currpage]  = whiteboardInstance.lc.undoStack.slice(0) ;
        }
        if(saveRedoStack){
            whiteboardInstance.stackStorage["redoStack_"+fileid+"_"+currpage]  = whiteboardInstance.lc.redoStack.slice(0)  ;
        }
    };

    /*显示白板正在loading*/
    showWhiteboardLoading(id){
        let whiteboardInstance = this._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[showWhiteboardLoading]There are no white board Numbers that belong to id '+id ) ;return ;}
        this._showWhiteboardLoading(whiteboardInstance);
    };

    /*隐藏白板正在loading*/
    hideWhiteboardLoading(id){
        let whiteboardInstance = this._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[showWhiteboardLoading]There are no white board Numbers that belong to id '+id ) ;return ;}
        this._hideWhiteboardLoading(whiteboardInstance);
    };

    /*白板是否处于文本点击状态*/
    isWhiteboardTextEditing(id){
        let whiteboardInstance = this._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[isWhiteboardTextEditing]There are no white board Numbers that belong to id '+id ) ;return ;}
        let  isEditing =  (whiteboardInstance.lc.tool.name.toString() == "Text"  && whiteboardInstance.lc.tool.currentShapeState == "editing" ) ;
        return isEditing;
    }

    /*检测白板Canvas大小*/
    checkWhiteboardCanvasSize(id , {isResize=false}={}){
        let whiteboardInstance = this._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[checkWhiteboardCanvasSize]There are no white board Numbers that belong to id '+id ) ;return ;}
        if(whiteboardInstance.lc && whiteboardInstance.lc.canvas){
            if( whiteboardInstance.lc.canvas.width  === 0 || whiteboardInstance.lc.canvas.height === 0){
                if(isResize){
                    this._resizeWhiteboardHandler(whiteboardInstance);
                }
                return true ;
            }
            return false ;
        }
        return undefined ;
    };

    /*下载画板canvas图片*/
    downCanvasImageToLocalFile(id , type='png'){
        const _fixtype=function(type){
            type=type.toLocaleLowerCase().replace(/jpg/i,'jpeg');
            let r=type.match(/png|jpeg|bmp|gif/)[0];
            return 'image/'+r;
        };
        const _savaFile=function(data,filename) { //将图片保存到本地
            let save_link=document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
            save_link.href=data;
            save_link.download=filename;
            let event=document.createEvent('MouseEvents');
            event.initMouseEvent('click', true , false , window , 0,0,0,0,0,false,false,false,false,0,null);
            save_link.dispatchEvent(event);
        };
        let whiteboardInstance = this._getWhiteboardInstanceById(id);
        if(!whiteboardInstance){L.Logger.error( '[downCanvasImageToLocalFile]There are no white board Numbers that belong to id '+id ) ;return ;}
        let imgBase64 = this._convertCanvasToImageBase64(whiteboardInstance , type);
        imgBase64 = imgBase64.replace(_fixtype(type),'image/octet-stream');//将mime-type改为image/octet-stream,强制让浏览器下载
        let filename= (whiteboardInstance.nickname ?  whiteboardInstance.nickname+"_" : "" ) + whiteboardInstance.id +'_'+new Date().getTime()+'.'+type;
        _savaFile( imgBase64 , filename );
    }

    /*清空白板且清除白板数据栈*/
    _clearRedoAndUndoStack(whiteboardInstance , {clear=true , redo=true , undo=true } = {} ){
        const that = this ;
        if(clear){ that._clearLc(whiteboardInstance , {triggerEvent:false}) };
        if(redo){ that._clearLcRedoStack(whiteboardInstance) };
        if(undo){ that._clearLcUndoStack(whiteboardInstance) };
        that._actionIsDisable(whiteboardInstance);
    };

    /*更新白板的filedata数据*/
    _updateWhiteboardFiledata(whiteboardInstance , filedata){
        if(filedata && typeof filedata === 'object'){
            filedata.currpage = Number( filedata.currpage );
            filedata.pagenum = Number( filedata.pagenum );
            filedata.pptslide = Number( filedata.pptslide );
            filedata.pptstep = Number( filedata.pptstep );
            filedata.steptotal = Number( filedata.steptotal );
            Object.assign(whiteboardInstance.filedata , filedata);
        }
    };

    /*批量接收白板数据操作shape画图*/
    _batchReceiveSnapshot(shapesArray , whiteboardInstance){
        const that = this ;
        if( !Array.isArray(shapesArray) ){L.Logger.error('shapesArray must be an array!');return ;} ;
        shapesArray.forEach( (remoteData , index) => {
            let doNotPaint = true ;
            if(index === shapesArray.length-1 ){
                doNotPaint = false ;
            }
            that._handlerRemoteDataToWhiteboard( remoteData   , doNotPaint , whiteboardInstance);
        });
        that._actionIsDisable(whiteboardInstance);
    };

   /* 接收白板数据操作shape画图*/
    _receiveSnapshot(remoteData , whiteboardInstance){
        const that = this ;
        let doNotPaint = false ;
        that._handlerRemoteDataToWhiteboard( remoteData   , doNotPaint , whiteboardInstance);
        that._actionIsDisable(whiteboardInstance);
    };

    /*处理远程的数据到白板上*/
    _handlerRemoteDataToWhiteboard(remoteData , doNotPaint = false , whiteboardInstance){
        if(remoteData.data && typeof remoteData.data === 'string'){
            remoteData.data = JSON.parse(remoteData.data);
        }
        if(remoteData.data!=null && remoteData.data.eventType!=null){
            if( remoteData.source === 'delmsg' ){   //回放的delmsg数据不是发送上去的数据，而是撤销的动作的相关描述，所以这里需要做兼容，如果是来自于delmsg的则事件类型为shapeSaveEvent和clearEvent也执行撤销操作
                switch(remoteData.data.eventType){
                    case "shapeSaveEvent":
                    case "clearEvent":
                    case "undoEvent":
                        if(remoteData.data.actionName && remoteData.data.actionName === "AddShapeAction"){
                            whiteboardInstance.lc.undo(false , remoteData.data.shapeId);
                            this._removeRemindContentByElementId(whiteboardInstance , "whiteboard_remind_"+remoteData.data.shapeId);
                        }else if( remoteData.data.actionName && remoteData.data.actionName === "ClearAction" ){
                            whiteboardInstance.lc.undo(false , remoteData.data.clearActionId);
                        }
                        break ;
                }
            }else{
                switch(remoteData.data.eventType){
                    case "shapeSaveEvent":
                        if(remoteData.data && remoteData.data.data && remoteData.data.data.data){
                            remoteData.data.data = LC.JSONToShape(remoteData.data.data);
                        }
                        whiteboardInstance.lc.saveShape(  remoteData.data.data  , false  , null , doNotPaint);
                        break ;
                    case "undoEvent":
                        if(remoteData.data.actionName && remoteData.data.actionName === "AddShapeAction"){
                            whiteboardInstance.lc.undo(false , remoteData.data.shapeId);
                            this._removeRemindContentByElementId(whiteboardInstance , "whiteboard_remind_"+remoteData.data.shapeId);
                        }else if( remoteData.data.actionName && remoteData.data.actionName === "ClearAction" ){
                            whiteboardInstance.lc.undo(false , remoteData.data.clearActionId);
                        }
                        break ;
                    case "redoEvent":
                        if(remoteData.data.actionName && remoteData.data.actionName === "AddShapeAction"){
                            let flag = false ;  //恢复栈中是否有该shape
                            for (let i= whiteboardInstance.lc.redoStack.length-1 ; i>=0 ; i-- ) {
                                if( remoteData.data.shapeId === whiteboardInstance.lc.redoStack[i].shapeId){
                                    whiteboardInstance.lc.redoStack.splice(i,1);
                                    flag = true ;
                                    break ;
                                }
                            }
                            if(remoteData.data && remoteData.data.data && remoteData.data.data.data){
                                remoteData.data.data = LC.JSONToShape(remoteData.data.data);
                            }
                            whiteboardInstance.lc.saveShape(  remoteData.data.data  , false  , null , doNotPaint);
                        }else if( remoteData.data.actionName && remoteData.data.actionName === "ClearAction" ){
                            whiteboardInstance.lc.clear(false , null);
                            this._removeAllRemindContent(whiteboardInstance);
                        }
                        break ;
                    case "clearEvent":
                        whiteboardInstance.lc.clear(false , null);
                        this._removeAllRemindContent(whiteboardInstance);
                        break ;
                    case "laserMarkEvent":
                        let laserMark =  whiteboardInstance.lc.containerEl.parentNode.getElementsByClassName("laser-mark")[0] ;
                        switch (remoteData.data.actionName){
                            case "show":
                                laserMark.style.display = 'block' ;
                                break;
                            case "hide":
                                laserMark.style.display = 'none' ;
                                break;
                            case "move":
                                if(remoteData.data && remoteData.data.laser){
                                    let left = remoteData.data.laser.left ;
                                    let top = remoteData.data.laser.top ;
                                    laserMark.style.left = left+"%" ;
                                    laserMark.style.top = top+"%" ;
                                }
                                break;
                            default:
                                break;
                        }
                        break ;
                }
            }
        }
    };

    /*生产标注工具的描述信息*/
    _productionToolDesc(toolKey , toolValue){
        const that = this ;
        let toolDesc = {
            toolKey: toolKey ,
            disabled:false
        };
        return toolDesc ;
    };

    /*通知白板工具更新的消息给上层*/
    _noticeUpdateToolDesc(whiteboardInstance){
        if(whiteboardInstance && whiteboardInstance.isRegisterWhiteboardTool){
            clearTimeout( whiteboardInstance.noticeUpdateToolDescTimer ) ;
            whiteboardInstance.noticeUpdateToolDescTimer = setTimeout( () => {
                if(whiteboardInstance.handler && whiteboardInstance.handler.noticeUpdateToolDescCallback){
                    whiteboardInstance.handler.noticeUpdateToolDescCallback(whiteboardInstance.registerWhiteboardToolsList);
                }
            } , 250);
        }
    };

    /*更新标注工具的描述信息*/
    _updateToolDesc(whiteboardInstance , toolKey , toolValue){
        if(whiteboardInstance.registerWhiteboardToolsList[toolKey]){
            for(let [key,value] of Object.entries(toolValue) ){
                if(  whiteboardInstance.registerWhiteboardToolsList[toolKey][key] !== undefined ){
                    whiteboardInstance.registerWhiteboardToolsList[toolKey][key] = value ;
                }
            }
        }
    };

    /*批量更新工具描述*/
    _batchUpdateToolDesc(whiteboardInstance , updateDescArray){
        const that = this ;
        if( !Array.isArray(updateDescArray) ){L.Logger.error('updateDescArray must be an array , whiteboard id is '+whiteboardInstance.id+'!');return ;} ;
        for(let desc of updateDescArray){
            if( Array.isArray(desc) ){
                that._updateToolDesc( whiteboardInstance ,  desc[0] , desc[1]);
            }
        }
    };

    /*设置白板的标注工具*/
    _setWhiteboardTools(toolKey  , whiteboardInstance){
        const that = this ;
        const _setWhiteboardToolsFromInner = (whiteboardInstance) => {
            let tool = that._productionToolByCore(toolKey  , whiteboardInstance) ;
            whiteboardInstance.lc.setTool(tool);
        };
        that._automaticTraverseWhiteboardInstance(whiteboardInstance , _setWhiteboardToolsFromInner);
    };

    /*生产白板核心层工具，通过白板核心层来生产*/
    _productionToolByCore(toolKey , whiteboardInstance){
        const that = this ;
        let tool = undefined;
        if( that.useWhiteboardTool[toolKey] === undefined ){L.Logger.error('The whiteboard does not have the '+toolKey+' tool!');return tool;}
        switch (toolKey){
            case 'tool_pencil': //笔
                tool =  new LC.tools.Pencil(whiteboardInstance.lc);
                break;
            case 'tool_highlighter': //荧光笔
                tool =  new LC.tools.Pencil(whiteboardInstance.lc);
                break;
            case 'tool_line': //直线
                tool = new LC.tools.Line(whiteboardInstance.lc) ;
                break;
            case 'tool_arrow': //箭头
                tool = new LC.tools.Line(whiteboardInstance.lc);
                tool.hasEndArrow = true;
                break;
            case 'tool_dashed': //虚线
                tool = new LC.tools.Line(whiteboardInstance.lc);
                tool.isDashed = true;
                break;
            case 'tool_eraser': //橡皮
                tool = new LC.tools.Eraser(whiteboardInstance.lc);
                break;
            case 'tool_text': //文字
                tool = new LC.tools.Text(whiteboardInstance.lc) ;
                break;
            case 'tool_rectangle': //矩形
                tool = new LC.tools.Rectangle(whiteboardInstance.lc) ;
                break;
            case 'tool_rectangle_empty': //空心矩形
                tool = new LC.tools.Rectangle(whiteboardInstance.lc) ;
                break;
            case 'tool_ellipse': //椭圆
                tool = new LC.tools.Ellipse(whiteboardInstance.lc) ;
                break;
            case 'tool_ellipse_empty': //空心椭圆
                tool = new LC.tools.Ellipse(whiteboardInstance.lc) ;
                break;
            case 'tool_polygon': //多边形
                tool = new LC.tools.Polygon(whiteboardInstance.lc) ;
                break;
            case 'tool_eyedropper': //吸管
                tool = new LC.tools.Eyedropper(whiteboardInstance.lc) ;
                break;
            case 'tool_selectShape': //选中拖动
                tool = new LC.tools.SelectShape(whiteboardInstance.lc) ;
                break;
            case 'tool_mouse': //鼠标
                tool = whiteboardInstance.lc.tool ;
                break;
            case 'tool_laser': //激光笔
                tool = whiteboardInstance.lc.tool ;
                break;
            default:
                L.Logger.warning('Tool '+toolKey+' is not created in the whiteboard core layer!');
                tool = whiteboardInstance.lc.tool ;
                break;
        };
        return tool ;
    };

   /*获取白板实例id,根据id获取*/
    _getWhiteboardInstanceID(id){
        const that = this ;
        let whiteboardInstanceID = !that.uniqueWhiteboard && id!=undefined && id!=null  ? (that.whiteboardInstanceIDPrefix+id) :  that.whiteboardInstanceDefaultID ;
        if(id && typeof id === 'string'){
            let rq = new RegExp(that.specialWhiteboardInstanceIDPrefix , 'g') ;
            if( rq .test(id) ){
                whiteboardInstanceID = id ;
            }
        }
        return whiteboardInstanceID ;
    };

    /*获取白板实例,根据id获取*/
    _getWhiteboardInstanceById(id){
        const that = this ;
        let whiteboardInstanceID =  that._getWhiteboardInstanceID(id)  ;
        let whiteboardInstance = that.whiteboardInstanceStore[whiteboardInstanceID] ;
        return whiteboardInstance ;
    };

    /*获取白板实例,根据whiteboardInstanceID获取*/
    _getWhiteboardInstanceByID(whiteboardInstanceID){
        const that = this ;
        let whiteboardInstance = that.whiteboardInstanceStore[whiteboardInstanceID] ;
        return whiteboardInstance ;
    };

    /*白板大小根据比例自适应*/
    _resizeWhiteboardByScalc(whiteboardInstance  , { watermarkImage , isChangeCanvas=true , isChangeWatermarkScale = true , watermarkImageScalc} = {} ){
        watermarkImageScalc = watermarkImageScalc!== undefined ?  watermarkImageScalc : whiteboardInstance.watermarkImageScalc ;
        let whiteboardInstance_lc = whiteboardInstance.lc ;
        if(whiteboardInstance_lc){
            let whiteboardElement = whiteboardInstance.whiteboardElement ;
            let whiteboardInstanceElement = whiteboardInstance.whiteboardInstanceElement ;
           let containerWidth = whiteboardInstance.containerWidthAndHeight['width'] ;
            let containerHeight = whiteboardInstance.containerWidthAndHeight['height'] ;
            if(whiteboardInstance.parcelAncestorElementId && document.getElementById(whiteboardInstance.parcelAncestorElementId) ){
                let parcelAncestorElement =  document.getElementById(whiteboardInstance.parcelAncestorElementId) ;
                containerWidth = parcelAncestorElement.clientWidth ;
                containerHeight = parcelAncestorElement.clientHeight ;
            }
            let fatherContainerConfiguration = {} ;
            let width = 0 , height = 0  , minWidth = 0 , minHeight = 0;
            if(containerHeight*watermarkImageScalc < containerWidth ){
                width = Math.round( containerHeight * watermarkImageScalc * whiteboardInstance.whiteboardMagnification ) ;
                height =  Math.round( containerHeight * whiteboardInstance.whiteboardMagnification ) ;
                whiteboardElement.style.width  =  width +'px' ;
                whiteboardElement.style.height  = height +'px' ;
                whiteboardInstanceElement.style.width  = width +'px' ;
                whiteboardInstanceElement.style.height  = height +'px' ;
                if(whiteboardInstance.minHeight !== undefined && whiteboardInstance.minHeight !== null ){
                    minWidth = ( whiteboardInstance.minHeight * watermarkImageScalc) ;
                    minHeight = (whiteboardInstance.minHeight) ;
                    whiteboardElement.style.minWidth  =  minWidth +'px' ;
                    whiteboardElement.style.minHeight  = minHeight +'px' ;
                    whiteboardInstanceElement.style.minWidth  = minWidth +'px' ;
                    whiteboardInstanceElement.style.minHeight  = minHeight +'px' ;
                    fatherContainerConfiguration['minWidth'] =  minWidth + 'px';
                    fatherContainerConfiguration['minHegiht'] = minHeight + 'px';
                }
                fatherContainerConfiguration['top'] = 0  + '%' ;
                fatherContainerConfiguration['left'] = 50  + '%';
                fatherContainerConfiguration['marginTop'] = 0  + 'px' ;
                fatherContainerConfiguration['marginLeft'] = (- width/2 )+ 'px'  ;
                fatherContainerConfiguration['width'] = width + 'px';
                fatherContainerConfiguration['height'] = height + 'px';
            }else{
                width = Math.round( containerWidth * whiteboardInstance.whiteboardMagnification )  ;
                height = Math.round( containerWidth /watermarkImageScalc *  whiteboardInstance.whiteboardMagnification )  ;
                whiteboardElement.style.width  =  width +'px' ;
                whiteboardElement.style.height  = height +'px' ;
                whiteboardInstanceElement.style.width  = width +'px' ;
                whiteboardInstanceElement.style.height  = height +'px' ;
                if(whiteboardInstance.minHeight !== undefined && whiteboardInstance.minHeight !== null ){
                    minWidth = ( whiteboardInstance.minHeight * watermarkImageScalc) ;
                    minHeight = (whiteboardInstance.minHeight) ;
                    whiteboardElement.style.minWidth  =  minWidth +'px' ;
                    whiteboardElement.style.minHeight  = minHeight +'px' ;
                    whiteboardInstanceElement.style.minWidth  = minWidth +'px' ;
                    whiteboardInstanceElement.style.minHeight  = minHeight +'px' ;
                    fatherContainerConfiguration['minWidth'] =  minWidth + 'px';
                    fatherContainerConfiguration['minHegiht'] = minHeight + 'px';
                }
                fatherContainerConfiguration['top'] = 50  + '%' ;
                fatherContainerConfiguration['left'] = 0  + '%';
                fatherContainerConfiguration['marginTop'] =  (-height/2)  + 'px' ;
                fatherContainerConfiguration['marginLeft'] =  0+'px' ;
                fatherContainerConfiguration['width'] = width+ 'px' ;
                fatherContainerConfiguration['height'] = height + 'px';
            }

            if(isChangeCanvas){
                 whiteboardInstance_lc.respondToSizeChange();
                let eleWidth = whiteboardInstanceElement.clientWidth ;
                let eleHeight= whiteboardInstanceElement.clientHeight ;
                let whiteboardScalc =  ( eleWidth + eleHeight  ) /  ( whiteboardInstance.baseWhiteboardWidth + whiteboardInstance.baseWhiteboardWidth*watermarkImageScalc ) ;
                whiteboardInstance_lc.setZoom(whiteboardScalc);
                whiteboardInstance_lc.setPan(0,0);
                if(isChangeWatermarkScale && watermarkImage ){
                    let watermarkImageWidth = watermarkImage.width ;
                    let watermarkImageHeight = watermarkImage.height ;
                    let lvW = whiteboardInstance_lc.backgroundCanvas.width / watermarkImageWidth ;
                    let lvH =  whiteboardInstance_lc.backgroundCanvas.height / watermarkImageHeight ;
                    let lv = (lvW+lvH)/2;
                    whiteboardInstance_lc.watermarkScale= lv ;
                    whiteboardInstance_lc.setWatermarkImage(watermarkImage);
                }
            }

            if(whiteboardInstance.whiteboardMagnification>1){
                fatherContainerConfiguration.addClassName = 'custom-scroll-bar' ;
            }else{
                fatherContainerConfiguration.addClassName = '' ;
            }
            if(whiteboardInstance.handler && whiteboardInstance.handler.resizeWhiteboardSizeCallback && typeof whiteboardInstance.handler.resizeWhiteboardSizeCallback === 'function' ){
                whiteboardInstance.handler.resizeWhiteboardSizeCallback(fatherContainerConfiguration);
            }
        }
    }

    /*清除白板的所有数据，包括存储的数据,通过whiteboardInstanceID*/
    _clearWhiteboardAllDataByInstance(whiteboardInstance){
        if(!whiteboardInstance){L.Logger.error('[_clear]The whiteboard instance does not exist!' ) ;return ;}
        whiteboardInstance.lc.clear(false);
        whiteboardInstance.lc.redoStack.length = 0 ;
        whiteboardInstance.lc.undoStack.length = 0 ;
        whiteboardInstance.stackStorage  = {} ;//白板数据栈对象
        whiteboardInstance.waitingProcessShapeData = {} ; //等待处理的白板数据
        this._removeAllRemindContent(whiteboardInstance);
    };

    /*更新白板的大小*/
    _resizeWhiteboardHandler(whiteboardInstance){
        const that = this ;
        if(whiteboardInstance && whiteboardInstance.lc){
            let watermarkImage = whiteboardInstance.lc.watermarkImage ;
            if(watermarkImage && watermarkImage.src){
                let watermarkImageScalc = watermarkImage.width / watermarkImage.height ;
                that._resizeWhiteboardByScalc(whiteboardInstance , { watermarkImage, watermarkImageScalc } );
            }else{
                that._resizeWhiteboardByScalc(whiteboardInstance ,{isChangeWatermarkScale:false});
            }
            this._updateAllRemindContent(whiteboardInstance);
        }
    };

    /*更新白板的watermarkImageScalc*/
    _updateWhiteboardWatermarkImageScalc(whiteboardInstance , watermarkImageScalc){
        whiteboardInstance.watermarkImageScalc = watermarkImageScalc ;
    }

    /*生产白板提示内容*/
    _productionWhiteboardRemindContent(whiteboardInstance , x , y , content  , shapeId){
        if(whiteboardInstance && content){
            try{
                if(whiteboardInstance && whiteboardInstance.lc && whiteboardInstance.lc.containerEl.parentNode && typeof whiteboardInstance.lc.drawingCoordsToClientCoords === 'function' ){
                    let coords = whiteboardInstance.lc.drawingCoordsToClientCoords(x , y ) ;
                    if(coords){
                        let remindSpan =  document.createElement('span');
                        remindSpan.className = "remind-content" ;
                        remindSpan.style.position = 'absolute' ;
                        remindSpan.style.left =  coords.x  + 'px';
                        remindSpan.style.top =  coords.y  + 'px';
                        remindSpan.innerHTML = content;
                        let remindSpanId = shapeId ? 'whiteboard_remind_'+shapeId : "whiteboard_remind_"+ new Date().getTime();
                        remindSpan.setAttribute('data-position-x' ,  x);
                        remindSpan.setAttribute('data-position-y' ,  y);
                        remindSpan.setAttribute('id' ,   remindSpanId );
                        whiteboardInstance.lc.containerEl.parentNode.appendChild (remindSpan) ;
                        setTimeout( () => {
                            this._removeRemindContentByElementId(whiteboardInstance , remindSpanId);
                            // whiteboardInstance.lc.containerEl.parentNode.removeChild(remindSpan);
                            remindSpan = null ;
                        } , whiteboardInstance.remindContentTime);
                    }
                }
            }catch (error){
                L.Logger.error('productionWhiteboardRemindContent error:' , error)
            }
        }
    }

    /*更新所有提示内容的坐标*/
    _updateAllRemindContent(whiteboardInstance){
        try{
            if(whiteboardInstance.lc && whiteboardInstance.lc.containerEl.parentNode){
                let remindSpanElements = whiteboardInstance.lc.containerEl.parentNode.getElementsByClassName("remind-content") ;
                if(remindSpanElements && remindSpanElements.length>0){
                    for(let index=0 ; index<remindSpanElements.length ; index++){
                        let remindSpanElement = remindSpanElements[index];
                        let x=Number(remindSpanElement.getAttribute('data-position-x')) , y=Number(remindSpanElement.getAttribute('data-position-y')) ;
                        let coords = whiteboardInstance.lc.drawingCoordsToClientCoords(x , y ) ;
                        remindSpanElement.style.left =  coords.x  + 'px';
                        remindSpanElement.style.top =  coords.y  + 'px';
                    }
                }
            }
        }catch (error){
            L.Logger.error('updateAllRemindContent error:' , error)
        }
    }

    /*移除所有提示内容*/
    _removeRemindContentByElementId(whiteboardInstance , elementid){
        if(whiteboardInstance && whiteboardInstance.lc && whiteboardInstance.lc.containerEl.parentNode){
            let   remindSpanElement = document.getElementById(elementid) ;
            if( remindSpanElement ){
                remindSpanElement.innerHTML = '';
                whiteboardInstance.lc.containerEl.parentNode.removeChild( remindSpanElement );
                remindSpanElement = null ;
            }
        }
    }

    /*移除所有提示内容*/
    _removeAllRemindContent(whiteboardInstance){
        if(whiteboardInstance && whiteboardInstance.lc && whiteboardInstance.lc.containerEl.parentNode ){
            try{
                if(whiteboardInstance.lc && whiteboardInstance.lc.containerEl.parentNode){
                    let remindSpanElements = whiteboardInstance.lc.containerEl.parentNode.getElementsByClassName("remind-content") ;
                    if(remindSpanElements && remindSpanElements.length>0){
                        for(let index=remindSpanElements.length-1 ; index>=0 ; index--){
                            let remindSpanElement = remindSpanElements[index];
                            remindSpanElement.innerHTML = '' ;
                            whiteboardInstance.lc.containerEl.parentNode.removeChild(remindSpanElement);
                            remindSpanElement = null ;
                        }
                    }
                }
            }catch (error){
                L.Logger.error('removeAllRemindContent error:' , error)
            }
        }
    }

    /*白板事件回调处理函数:shapeSave*/
    _handlerShapeSaveEvent(whiteboardInstance , eventData){
        this._sendWhiteboardMessageToSignallingServer(whiteboardInstance , "shapeSaveEvent" , eventData) ;
        this._actionIsDisable(whiteboardInstance);
    };

    /*白板事件回调处理函数:undo*/
    _handlerUndoEvent(whiteboardInstance , eventData){
        this._sendWhiteboardMessageToSignallingServer(whiteboardInstance , "undoEvent" , eventData) ;
        this._actionIsDisable(whiteboardInstance);
    };

    /*白板事件回调处理函数:redo*/
    _handlerRedoEvent(whiteboardInstance , eventData){
        this._sendWhiteboardMessageToSignallingServer(whiteboardInstance , "redoEvent" , eventData) ;
        this._actionIsDisable(whiteboardInstance);
    };

    /*白板事件回调处理函数:clear*/
    _handlerClearEvent(whiteboardInstance , eventData){
        this._sendWhiteboardMessageToSignallingServer(whiteboardInstance , "clearEvent" , eventData) ;
        this._actionIsDisable(whiteboardInstance);
    };

    /*白板画了数据之后的回调函数*/
    _handlerDrawingChangeEvent(whiteboardInstance){
        this._saveImageBase64ToImageThumbnail(whiteboardInstance);
    };

    /*保存canvas数据到图片缩略图中*/
    _saveImageBase64ToImageThumbnail(whiteboardInstance){
        if(whiteboardInstance.imageThumbnailId){
            let imageThumbnail =  document.getElementById( whiteboardInstance.imageThumbnailId );
            if( imageThumbnail && imageThumbnail.nodeName.toLowerCase() === 'img' ){
                let imageBase64Url = this._convertCanvasToImageBase64(whiteboardInstance , 'jpg');
                imageThumbnail.src = imageBase64Url ;
                if( whiteboardInstance.imageThumbnailTipContent  &&  document.getElementById(whiteboardInstance.imageThumbnailId+'_imageDescribe') ){
                    document.getElementById(whiteboardInstance.imageThumbnailId+'_imageDescribe').innerHTML =   whiteboardInstance.imageThumbnailTipContent ;
                } else if( whiteboardInstance.nickname  &&  document.getElementById(whiteboardInstance.imageThumbnailId+'_imageDescribe') ){
                    document.getElementById(whiteboardInstance.imageThumbnailId+'_imageDescribe').innerHTML =   whiteboardInstance.nickname ;
                }
            }
        }
    }

    /*销毁白板实例，通过实例whiteboardInstance*/
    _destroyWhiteboardInstance(whiteboardInstance){
        const that = this ;
        clearTimeout( whiteboardInstance.noticeUpdateToolDescTimer ) ;
        clearTimeout( whiteboardInstance.laserTimer ) ;
        clearTimeout( whiteboardInstance.setWhiteboardWatermarkImageTimer ) ;
        if( whiteboardInstance.dependenceBaseboardWhiteboardID !== undefined  && !whiteboardInstance.isBaseboard && whiteboardInstance.id !== undefined){
            if(that.basicTemplateWhiteboardSignallingList[whiteboardInstance.dependenceBaseboardWhiteboardID]){
                that.saveWhiteboardStackToStorage(whiteboardInstance.id , {saveRedoStack:whiteboardInstance.saveRedoStack , saveUndoStack:whiteboardInstance.saveUndoStack });
                that.basicTemplateWhiteboardSignallingChildrenStackStorage[whiteboardInstance.dependenceBaseboardWhiteboardID] = that.basicTemplateWhiteboardSignallingChildrenStackStorage[whiteboardInstance.dependenceBaseboardWhiteboardID] || {} ;
                that.basicTemplateWhiteboardSignallingChildrenStackStorage[whiteboardInstance.dependenceBaseboardWhiteboardID][whiteboardInstance.id] = Object.assign({} ,  whiteboardInstance.stackStorage) ;
            }else if( that.basicTemplateWhiteboardSignallingChildrenStackStorage[whiteboardInstance.dependenceBaseboardWhiteboardID] ){
                that.basicTemplateWhiteboardSignallingChildrenStackStorage[whiteboardInstance.dependenceBaseboardWhiteboardID] = null;
                delete that.basicTemplateWhiteboardSignallingChildrenStackStorage[whiteboardInstance.dependenceBaseboardWhiteboardID] ;
            }
        }
        if(that.basicTemplateWhiteboardSignallingList[whiteboardInstance.id]){
            that.basicTemplateWhiteboardSignallingList[whiteboardInstance.id] = null ;
            delete that.basicTemplateWhiteboardSignallingList[whiteboardInstance.id] ;
        }
        if(that.basicTemplateWhiteboardSignallingChildrenStackStorage[whiteboardInstance.id]){
            that.basicTemplateWhiteboardSignallingChildrenStackStorage[whiteboardInstance.id] = null ;
            delete that.basicTemplateWhiteboardSignallingChildrenStackStorage[whiteboardInstance.id] ;
        }
        that._clearWhiteboardAllDataByInstance(whiteboardInstance);
        let whiteboardInstanceID = whiteboardInstance.whiteboardInstanceID ;
        let whiteboardElement = whiteboardInstance.whiteboardElement;
        if(whiteboardInstance.lc && typeof whiteboardInstance.lc.teardown === 'function'){
            whiteboardInstance.lc.teardown();
        }
        if(!whiteboardElement){
            L.Logger.warning( '[destroy] whiteboard elements do not exist , element id is:'+whiteboardInstance.whiteboardElementId+'!' ) ;
        }else{
            whiteboardElement.innerHTML = '' ;
        }
        let thumbnailElement = whiteboardInstance.thumbnailId ? document.getElementById(whiteboardInstance.thumbnailId) : undefined;
        if(thumbnailElement){
            thumbnailElement.innerHTML = '' ;
        }
        for(let key of Object.keys(whiteboardInstance) ){
            whiteboardInstance[key] = null ;
            delete whiteboardInstance[key] ;
        }
        that.whiteboardInstanceStore[whiteboardInstanceID] = null ; //白板实例
        delete  that.whiteboardInstanceStore[whiteboardInstanceID]  ;
    };

    /*执行白板的clear方法*/
    _clearLc(whiteboardInstance , {triggerEvent=true} = {}){
        if(whiteboardInstance&&whiteboardInstance.lc){
            whiteboardInstance.lc.clear(false)
            this._removeAllRemindContent(whiteboardInstance);
        } else{
            L.Logger.warning('clear whiteboard is not exist!') ;
        }
    };

    /*执行白板的redoStack方法*/
    _clearLcRedoStack(whiteboardInstance){
        whiteboardInstance&&whiteboardInstance.lc?whiteboardInstance.lc.redoStack.length = 0: L.Logger.warning('clearRedoStack whiteboard is not exist!') ;
    };

    /*执行白板的UndoStack方法*/
    _clearLcUndoStack(whiteboardInstance){
        whiteboardInstance&&whiteboardInstance.lc?whiteboardInstance.lc.undoStack.length = 0: L.Logger.warning('clearUndoStack whiteboard is not exist!') ;
    };

    /*显示白板正在loading*/
    _showWhiteboardLoading(whiteboardInstance){
        const that = this ;
        if(whiteboardInstance.lc.loadingElement){
            whiteboardInstance.lc.loadingElement.style.display = 'block' ;
        }
    };

    /*隐藏白板正在loading*/
    _hideWhiteboardLoading(whiteboardInstance){
        const that = this ;
        if(whiteboardInstance.lc.loadingElement){
            whiteboardInstance.lc.loadingElement.style.display = 'none' ;
        }
    };

    /*改变白板临时可画权限*/
    _changeWhiteboardTemporaryDeawPermission(value , whiteboardInstance){
        const that = this ;
        const _handerChangeWhiteboardTemporaryDeawPermission = (whiteboardInstance)=> {
            let whiteboardInstance_lc = whiteboardInstance.lc ;
            if( whiteboardInstance_lc.isTmpDrawAble !== value ){
                whiteboardInstance_lc.isTmpDrawAble = value ;
                let temporaryDrawPermission = whiteboardInstance_lc.containerEl.parentNode.getElementsByClassName("temporary-draw-permission")[0];
                if( whiteboardInstance_lc.isTmpDrawAble ){
                    temporaryDrawPermission.className = temporaryDrawPermission.className.replace(/( yes| no)/g,"");
                    temporaryDrawPermission.className += " yes" ;
                }else{
                    temporaryDrawPermission.className = temporaryDrawPermission.className.replace(/( yes| no)/g,"");
                    temporaryDrawPermission.className += " no" ;
                }
            }
        };
        that._automaticTraverseWhiteboardInstance(whiteboardInstance , _handerChangeWhiteboardTemporaryDeawPermission);
    };

    /*改变白板可画权限*/
    _changeWhiteboardDeawPermission(value , whiteboardInstance){
        const that = this ;
        const _handerChangeWhiteboardDeawPermission = (whiteboardInstance)=> {
            let whiteboardInstance_lc = whiteboardInstance.lc ;
            if( whiteboardInstance_lc.isDrawAble !==  value){
                whiteboardInstance_lc.isDrawAble = value ;
                let drawPermission = whiteboardInstance_lc.containerEl.parentNode.getElementsByClassName("draw-permission")[0];
                if( whiteboardInstance_lc.isDrawAble ){
                    drawPermission.className = drawPermission.className.replace(/( yes| no)/g,"");
                    drawPermission.className += " yes" ;
                }else{
                    drawPermission.className = drawPermission.className.replace(/( yes| no)/g,"");
                    drawPermission.className += " no" ;
                }
            }
        };
        that._automaticTraverseWhiteboardInstance(whiteboardInstance , _handerChangeWhiteboardDeawPermission);
    };

    /*处理激光笔工具的激活*/
    _handlerActiveToolLaser( toolKey , whiteboardInstance){
        const that = this ;
        const _handlerActiveToolLaserFromInner = (whiteboardInstance)=> {
            let whiteboardInstance_lc = whiteboardInstance.lc ;
            let containerElParent = whiteboardInstance_lc.containerEl.parentNode ;
            let temporaryDrawPermission = containerElParent.getElementsByClassName("temporary-draw-permission")[0];
            let laserMark =  containerElParent.getElementsByClassName("laser-mark")[0] ;
            if(toolKey === 'tool_laser'){
                that._laserEventHandler_mousemove =   that._laserEventHandler_mousemove ||  ( (e) => {
                        let x = e.pageX , y = e.pageY ;
                        let offset =  temporaryDrawPermission.getBoundingClientRect();
                        let x1 , y1 ;
                        let markContainerWidth  = temporaryDrawPermission.clientWidth ;
                        let markContainerHeight = temporaryDrawPermission.clientHeight ;
                        switch (whiteboardInstance.rotateDeg){
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
                        let left = x1 / markContainerWidth *100;
                        let top =  y1  / markContainerHeight *100;
                        laserMark.style.left = left+"%"  ;
                        laserMark.style.top = top+"%"  ;
                        clearTimeout(whiteboardInstance.laserTimer);
                        whiteboardInstance.laserTimer = setTimeout(function(){
                            if( whiteboardInstance.laserPosition && ( Math.abs( left - whiteboardInstance.laserPosition.left ) > 0.3 || Math.abs( top - whiteboardInstance.laserPosition.top )>0.3 ) ){
                                let parameter = {
                                    laser:{
                                        left:left ,
                                        top:top
                                    },
                                    action:{
                                        actionName:"move"
                                    }
                                };
                                whiteboardInstance.laserPosition = parameter.laser ;
                                that._sendWhiteboardMessageToSignallingServer(whiteboardInstance , "laserMarkEvent" , parameter);
                            }
                        },100);
                        return false;
                } );
                that._laserEventHandler_mouseenter =   that._laserEventHandler_mouseenter ||  ( (e) => {
                        let parameter = {
                            action:{
                                actionName:"show"
                            }
                        };
                        that._sendWhiteboardMessageToSignallingServer(whiteboardInstance , "laserMarkEvent" , parameter);
                        laserMark.style.display = 'block';
                        return false;
                } );
                that._laserEventHandler_mouseleave =   that._laserEventHandler_mouseleave ||  ( (e) => {
                        let parameter = {
                            action:{
                                actionName:"hide"
                            }
                        };
                        that._sendWhiteboardMessageToSignallingServer(whiteboardInstance , "laserMarkEvent" , parameter);
                        laserMark.style.display = 'none';
                        return false;
                } );

                that._changeWhiteboardTemporaryDeawPermission(false , whiteboardInstance);
                whiteboardInstance.selectLaserTool = true ;
                whiteboardInnerUtils.removeEvent(temporaryDrawPermission , 'mousemove' , that._laserEventHandler_mousemove );
                whiteboardInnerUtils.removeEvent(containerElParent , 'mouseenter' , that._laserEventHandler_mouseenter);
                whiteboardInnerUtils.removeEvent(containerElParent , 'mouseleave' , that._laserEventHandler_mouseleave);
                temporaryDrawPermission.className = temporaryDrawPermission.className.replace(/ cursor-none/g,"");
                temporaryDrawPermission.className += " cursor-none" ;
                whiteboardInstance.laserPosition =  whiteboardInstance.laserPosition  || {left:0 , top:0} ;
                whiteboardInnerUtils.addEvent(temporaryDrawPermission , 'mousemove' , that._laserEventHandler_mousemove );
                whiteboardInnerUtils.addEvent(containerElParent , 'mouseenter' , that._laserEventHandler_mouseenter);
                whiteboardInnerUtils.addEvent(containerElParent , 'mouseleave' ,that._laserEventHandler_mouseleave);
            }else{
                that._changeWhiteboardTemporaryDeawPermission(toolKey !== 'tool_mouse' , whiteboardInstance);
                whiteboardInnerUtils.removeEvent(temporaryDrawPermission , 'mousemove' , that._laserEventHandler_mousemove );
                whiteboardInnerUtils.removeEvent(containerElParent , 'mouseenter' , that._laserEventHandler_mouseenter);
                whiteboardInnerUtils.removeEvent(containerElParent , 'mouseleave' , that._laserEventHandler_mouseleave);
                temporaryDrawPermission.className = temporaryDrawPermission.className.replace(/ cursor-none/g,"");
                laserMark.style.display = 'none';
                if(whiteboardInstance.selectLaserTool){
                    let parameter = {
                        action:{
                            actionName:"hide"
                        }
                    };
                    that._sendWhiteboardMessageToSignallingServer(whiteboardInstance , "laserMarkEvent" , parameter);
                    whiteboardInstance.selectLaserTool = false ;
                }
            }
        };
        that._automaticTraverseWhiteboardInstance(whiteboardInstance , _handlerActiveToolLaserFromInner);
    };

    /*发送白板数据信令给服务器*/
    _sendSignallingToServer(whiteboardInstance , {idPrefix , data , signallingName , assignId , do_not_save , expiresabs  , associatedMsgID , associatedUserID } = {}){
        if(!whiteboardInstance){
            L.Logger.error('[_sendSignallingToServer]whiteboardInstance is not exist!');
            return ;
        }
        if(whiteboardInstance.handler && whiteboardInstance.handler.sendSignallingToServer && typeof whiteboardInstance.handler.sendSignallingToServer === 'function' ){
            let { currpage , fileid } = whiteboardInstance.filedata  ;
            if( currpage === undefined ||  fileid  === undefined  ){
                L.Logger.error('[_sendSignallingToServer]whiteboardInstance.filedata do not contain  currpage or fileid , [ currpage , fileid ]is ['+currpage+','+fileid+']!');
                return ;
            }
            if(data && typeof data === 'string'){
                data = JSON.parse(data);
            }
            data.whiteboardID = whiteboardInstance.id ;
            data.isBaseboard = whiteboardInstance.isBaseboard ;
            if(whiteboardInstance.dependenceBaseboardWhiteboardID !== undefined ){
                data.dependenceBaseboardWhiteboardID = whiteboardInstance.dependenceBaseboardWhiteboardID ;
            }
            associatedMsgID = associatedMsgID || whiteboardInstance.associatedMsgID  ;
            associatedUserID = associatedUserID || whiteboardInstance.associatedUserID ;
            let id = assignId || idPrefix + "###_"+signallingName+"_"+fileid+"_"+currpage , toID = "__allExceptSender" ;
            let copyData = Object.assign({} , data );
            this._saveBasicTemplateWhiteboardSignallingData({signallingName ,id , toID ,  data:copyData , do_not_save , expiresabs  , associatedMsgID , associatedUserID} , 'pubmsg' );
            whiteboardInstance.handler.sendSignallingToServer(signallingName ,id , toID ,  data , do_not_save , expiresabs  , associatedMsgID , associatedUserID);
        }
    };

    /*发送白板数据信令给服务器*/
    _delSignallingToServer(whiteboardInstance , { idPrefix , data , signallingName , assignId  } = {}){
        if(!whiteboardInstance){
            L.Logger.error('[_delSignallingToServer]whiteboardInstance is not exist!');
            return ;
        }
        if(whiteboardInstance.handler && whiteboardInstance.handler.delSignallingToServer && typeof whiteboardInstance.handler.delSignallingToServer === 'function'){
            let { currpage , fileid } = whiteboardInstance.filedata  ;
            if( currpage === undefined ||  fileid  === undefined  ){
                L.Logger.error('[_delSignallingToServer]whiteboardInstance.filedata do not contain  currpage or fileid , [ currpage , fileid ]is ['+currpage+','+fileid+']!');
                return ;
            }
            data.whiteboardID = whiteboardInstance.id ;
            data.isBaseboard = whiteboardInstance.isBaseboard ;
            if(whiteboardInstance.dependenceBaseboardWhiteboardID !== undefined ){
                data.dependenceBaseboardWhiteboardID = whiteboardInstance.dependenceBaseboardWhiteboardID ;
            }
            let id = assignId || idPrefix + "###_"+signallingName+"_"+fileid+"_"+currpage , toID = "__allExceptSender" ;
            let copyData = Object.assign({} , data );
            this._saveBasicTemplateWhiteboardSignallingData({signallingName ,id , toID ,  data:copyData } , 'delmsg' );
            whiteboardInstance.handler.delSignallingToServer(signallingName ,id , toID ,  data );
        }
    };

    /*发送白板消息给信令服务器*/
    _sendWhiteboardMessageToSignallingServer( whiteboardInstance ,  eventType , parameter ){
        const that = this ;
        let idPrefix , data  , signallingName   , assignId , do_not_save  , shapeData , testData;
        switch(eventType){
            case "shapeSaveEvent":
                shapeData  = LC.shapeToJSON(parameter.shape);
                if(shapeData!=null && shapeData.className != null && (shapeData.className == "LinePath" || shapeData.className == "ErasedLinePath" )){
                    shapeData.data.smoothedPointCoordinatePairs = null ;
                    delete shapeData.data.smoothedPointCoordinatePairs;
                    let tmpData = shapeData.data.pointCoordinatePairs ;
                    tmpData.forEach(function (item) {
                        item[0] = Math.round( item[0] )  ;
                        item[1] = Math.round(  item[1]  ) ;
                    });
                }
                testData  = {eventType:eventType , actionName:parameter.action.actionName , shapeId:parameter.shapeId , data:shapeData  };
                idPrefix = parameter.shapeId  , data =  testData , signallingName = "SharpsChange"  , assignId = undefined , do_not_save = undefined ;
                that._sendSignallingToServer(whiteboardInstance , {idPrefix , data , signallingName , assignId , do_not_save} );
                break;
            case "undoEvent" :
                if( parameter.action.actionName === "AddShapeAction" ){
                    let shapeId = parameter.action.shapeId ;
                    testData  = {eventType:eventType , actionName:parameter.action.actionName  , shapeId:shapeId  };
                    idPrefix = shapeId  , data =  testData , signallingName = "SharpsChange"  , assignId = undefined ;
                    that._delSignallingToServer(whiteboardInstance , { idPrefix , data , signallingName , assignId } );
                }else if(parameter.action.actionName === "ClearAction"){
                    let clearActionId = parameter.action.id ;
                    testData  = {eventType:eventType , actionName:parameter.action.actionName  , clearActionId:clearActionId  };
                    idPrefix = clearActionId  , data =  testData , signallingName = "SharpsChange"  , assignId = undefined ;
                    that._delSignallingToServer(whiteboardInstance , { idPrefix , data , signallingName , assignId } );
                }
                break ;
            case "redoEvent" :
                if( parameter.action.actionName === "AddShapeAction" ){
                    shapeData  = LC.shapeToJSON(parameter.action.shape);
                    if(shapeData!=null && shapeData.className != null && (shapeData.className == "LinePath" || shapeData.className == "ErasedLinePath" )){
                        shapeData.data.smoothedPointCoordinatePairs = null ;
                        delete shapeData.data.smoothedPointCoordinatePairs;
                        let tmpData = shapeData.data.pointCoordinatePairs ;
                        tmpData.forEach(function (item) {
                            item[0] = Math.round( item[0] )  ;
                            item[1] = Math.round(  item[1]  ) ;
                        });
                    };
                    let shapeId =  parameter.action.shapeId ;
                    testData  = {eventType:eventType  , actionName:parameter.action.actionName  , shapeId:shapeId ,  data:shapeData };
                    let idPrefix = shapeId  , data =  testData , signallingName = "SharpsChange"  , assignId = undefined , do_not_save = undefined ;
                    that._sendSignallingToServer(whiteboardInstance , {idPrefix , data , signallingName , assignId , do_not_save} );
                }else if(parameter.action.actionName === "ClearAction"){
                    let clearActionId = parameter.action.id ;
                    testData  = {eventType:eventType , actionName:parameter.action.actionName , clearActionId:clearActionId };
                    idPrefix = clearActionId  , data =  testData , signallingName = "SharpsChange"  , assignId = undefined , do_not_save = undefined ;
                    that._sendSignallingToServer(whiteboardInstance , {idPrefix , data , signallingName , assignId , do_not_save} );
                }
                break ;
            case "clearEvent":
                let clearActionId = parameter.clearActionId;
                testData  = {eventType:eventType , actionName:parameter.action.actionName , clearActionId:clearActionId};
                idPrefix = clearActionId  , data =  testData , signallingName = "SharpsChange"  , assignId = undefined , do_not_save = undefined ;
                that._sendSignallingToServer(whiteboardInstance , {idPrefix , data , signallingName , assignId , do_not_save} );
                break ;
            case "laserMarkEvent":
                let laserMarkId =  "laserMarkEvent";
                testData  = {eventType:eventType , actionName:parameter.action.actionName };
                if(parameter && parameter.laser){
                    testData.laser = parameter.laser
                }
                idPrefix = laserMarkId  , data =  testData , signallingName = "SharpsChange"  , assignId = undefined , do_not_save = true ;
                that._sendSignallingToServer(whiteboardInstance , {idPrefix , data , signallingName , assignId , do_not_save} );
                break ;
        };
    };

    /*更新白板字体*/
    _updateTextFont( whiteboardInstance){
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
        const that = this ;
        const _updateTextFontFromInner = (whiteboardInstance) => {
            let fontSize = whiteboardInstance.whiteboardToolsInfo.fontSize ,fontFamily = whiteboardInstance.whiteboardToolsInfo.fontFamily,fontStyle = whiteboardInstance.whiteboardToolsInfo.fontStyle , fontWeight = whiteboardInstance.whiteboardToolsInfo.fontWeight ;
            let tool = whiteboardInstance.lc.tool ;
            if(tool.name == "Text"){
                tool.font = fontStyle+" "+fontWeight+" "+fontSize+"px "+fontFamily;
            }
        };
        that._automaticTraverseWhiteboardInstance(whiteboardInstance , _updateTextFontFromInner);
    };

    /*更新橡皮宽度*/
    _updateEraserWidth(whiteboardInstance){
        const that = this ;
        const _updateEraserWidthFromInner = (whiteboardInstance) => {
            let eraserWidth = whiteboardInstance.whiteboardToolsInfo.eraserWidth ;
            whiteboardInstance.lc.trigger( 'setStrokeWidth', eraserWidth );
        };
        that._automaticTraverseWhiteboardInstance(whiteboardInstance , _updateEraserWidthFromInner);
    };

    /*更新画笔的宽度*/
    _updatePencilWidth(whiteboardInstance ){
        const that = this ;
        const _updatePencilWidthFromInner = (whiteboardInstance) => {
            let pencilWidth = whiteboardInstance.whiteboardToolsInfo.pencilWidth ;
            whiteboardInstance.lc.trigger( 'setStrokeWidth', pencilWidth );
        };
        that._automaticTraverseWhiteboardInstance(whiteboardInstance , _updatePencilWidthFromInner);
    };

    /*更新形状的宽度*/
    _updateShapeWidth(whiteboardInstance  ){
        const that = this ;
        const _updateShapeWidthFromInner = (whiteboardInstance) => {
            let shapeWidth = whiteboardInstance.whiteboardToolsInfo.shapeWidth ;
            whiteboardInstance.lc.trigger( 'setStrokeWidth', shapeWidth );
        };
        that._automaticTraverseWhiteboardInstance(whiteboardInstance , _updateShapeWidthFromInner);
    };

    /*更新颜色*/
    _updateColor(whiteboardInstance , colorJson ){
        const that = this ;
        if(colorJson && typeof colorJson === 'object'){
            const _updateColorFromInner = (whiteboardInstance) => {
                for(let key of Object.keys(colorJson) ){
                    whiteboardInstance.lc.setColor(key , whiteboardInstance.whiteboardToolsInfo[key+"Color"]) ;
                    if(key==="primary" && whiteboardInstance.activeTool === 'tool_highlighter' ){
                        let color = whiteboardInstance.whiteboardToolsInfo[key+"Color"].colorRgb().toLowerCase().replace("rgb","rgba").replace(")",",0.5)") ;
                        whiteboardInstance.lc.setColor(key, color  ) ;
                    }
                }
            };
            that._automaticTraverseWhiteboardInstance(whiteboardInstance , _updateColorFromInner);
        }
    };

    /*undo、redo、clear等动作是否禁用*/
    _actionIsDisable(whiteboardInstance){
        const that = this ;
        const _actionIsDisableFromInnner = (whiteboardInstance) => {
            if(whiteboardInstance.active){ //如果白板处于激活动态
                if(whiteboardInstance.lc.shapes.length === 0 ){ //白板没有画笔数据
                    let updateDescArray = [
                        ['action_clear' , {disabled:true} ] ,
                        ['tool_eraser' , {disabled:true} ] ,
                        ['tool_eyedropper' , {disabled:true} ]
                    ];
                    that._batchUpdateToolDesc(whiteboardInstance , updateDescArray);
                    that._noticeUpdateToolDesc(whiteboardInstance);
                }else{
                    let updateDescArray = [
                        ['action_clear' , {disabled:false} ] ,
                        ['tool_eraser' , {disabled:false} ] ,
                        ['tool_eyedropper' , {disabled:false} ]
                    ];
                    that._batchUpdateToolDesc(whiteboardInstance , updateDescArray);
                    that._noticeUpdateToolDesc(whiteboardInstance);
                }
                if( !whiteboardInstance.lc.canRedo() ){ //不能够redo
                    that._updateToolDesc(whiteboardInstance , 'action_redo' , {disabled:true});
                    that._noticeUpdateToolDesc(whiteboardInstance);
                }else{
                    that._updateToolDesc(whiteboardInstance ,  'action_redo' , {disabled:false});
                    that._noticeUpdateToolDesc(whiteboardInstance);
                }
                if( ! whiteboardInstance.lc.canUndo()  ){ //不能够undo
                    that._updateToolDesc(whiteboardInstance , 'action_undo' , {disabled:true});
                    that._noticeUpdateToolDesc(whiteboardInstance);
                }else{
                    that._updateToolDesc(whiteboardInstance , 'action_undo' , {disabled:false});
                    that._noticeUpdateToolDesc(whiteboardInstance);
                }
            }
        };
        that._automaticTraverseWhiteboardInstance(whiteboardInstance , _actionIsDisableFromInnner);
    };

    /*白板缩放比例决定其描述信息*/
    _zoomIsDisable(whiteboardInstance){
        const that = this ;
        const _zoomIsDisableFromInnner = (whiteboardInstance) => {
            if(whiteboardInstance.active){ //如果白板处于激活动态
                if(whiteboardInstance.whiteboardMagnification <= that.minMagnification ){
                    let updateDescArray = [
                        ['zoom_small' , {disabled:true} ] ,
                        ['zoom_default' , {disabled:true} ] ,
                    ];
                    that._batchUpdateToolDesc(whiteboardInstance , updateDescArray);
                    that._noticeUpdateToolDesc(whiteboardInstance);
                }else{
                    let updateDescArray = [
                        ['zoom_small' , {disabled:false} ] ,
                        ['zoom_default' , {disabled:false} ] ,
                    ];
                    that._batchUpdateToolDesc(whiteboardInstance , updateDescArray);
                    that._noticeUpdateToolDesc(whiteboardInstance);
                }
                if( whiteboardInstance.whiteboardMagnification >=  that.maxMagnification ){
                    that._updateToolDesc(whiteboardInstance , 'zoom_big' , {disabled:true});
                    that._noticeUpdateToolDesc(whiteboardInstance);
                }else{
                    that._updateToolDesc(whiteboardInstance , 'zoom_big' , {disabled:false});
                    that._noticeUpdateToolDesc(whiteboardInstance);
                }
            }
        };
        that._automaticTraverseWhiteboardInstance(whiteboardInstance , _zoomIsDisableFromInnner);
    };

    /*自动遍历白板实例，如果实例没有则遍历所有实例执行处理*/
    _automaticTraverseWhiteboardInstance(whiteboardInstance , callback ){
        const that = this ;
        if(whiteboardInstance){
            if(callback && typeof callback === 'function'){
                callback(whiteboardInstance);
            }
        }else{
            for(let whiteboardInstance of Object.values(that.whiteboardInstanceStore) ){
                if(callback && typeof callback === 'function'){
                    callback(whiteboardInstance);
                }
            }
        }
    };

    /*保存等待的白板信令数据到相应的白板实例中*/
    _saveAwaitSaveToWhiteboardInstanceSignallingToWhiteboardInstance(whiteboardInstance){
        let isClear = false ;
        for( let i = 0 ; i< this.awaitSaveToWhiteboardInstanceSignallingArray.length ; i++ ){
            let waitingProcessData = this.awaitSaveToWhiteboardInstanceSignallingArray[i] ;
            if(waitingProcessData.data && typeof waitingProcessData.data === 'string'){
                waitingProcessData.data = JSON.parse(waitingProcessData.data);
            }
            if(waitingProcessData.data.whiteboardID === whiteboardInstance.id ){
                let shapeName =waitingProcessData.id.substring(waitingProcessData.id.lastIndexOf("###_") + 4);
                if(whiteboardInstance.waitingProcessShapeData[shapeName] == null || whiteboardInstance.waitingProcessShapeData[shapeName] == undefined) {
                    whiteboardInstance.waitingProcessShapeData[shapeName] = [];
                    whiteboardInstance.waitingProcessShapeData[shapeName].push(waitingProcessData);
                } else {
                    whiteboardInstance.waitingProcessShapeData[shapeName].push(waitingProcessData);
                }
                isClear = true ;
                this.awaitSaveToWhiteboardInstanceSignallingArray.splice(i,1 , null) ;
            }
        }
        if(isClear){
            for(let i= this.awaitSaveToWhiteboardInstanceSignallingArray.length -1 ; i>=0 ; i--){
                if( this.awaitSaveToWhiteboardInstanceSignallingArray[i] === null){
                    this.awaitSaveToWhiteboardInstanceSignallingArray.splice(i,1) ;
                }
            }
        }
    };

    /*模板数据保存到*/
    _basicTemplateWhiteboardSignallingListToWhiteboardInstance(whiteboardInstance){
        if( whiteboardInstance.needLooadBaseboard &&  !whiteboardInstance.isBaseboard &&  whiteboardInstance.dependenceBaseboardWhiteboardID !== undefined && !whiteboardInstance.isHandleBasicTemplateWhiteboardSignallingList  && whiteboardInstance.id !== whiteboardInstance.dependenceBaseboardWhiteboardID 
            && this.basicTemplateWhiteboardSignallingList[whiteboardInstance.dependenceBaseboardWhiteboardID]  && Array.isArray(this.basicTemplateWhiteboardSignallingList[whiteboardInstance.dependenceBaseboardWhiteboardID]) ){
            this._batchReceiveSnapshot(this.basicTemplateWhiteboardSignallingList[whiteboardInstance.dependenceBaseboardWhiteboardID] , whiteboardInstance);
            whiteboardInstance.isHandleBasicTemplateWhiteboardSignallingList = true ;
        }
    };

    /*从 canvas 提取图片 image*/
    _convertCanvasToImage (whiteboardInstance , type = 'png' ) {
        if(whiteboardInstance && whiteboardInstance.lc && whiteboardInstance.lc.canvas){
            let canvas = whiteboardInstance.lc.canvas;
            //新Image对象，可以理解为DOM
            let image = new Image();
            // canvas.toDataURL 返回的是一串Base64编码的URL，当然,浏览器自己肯定支持
            image.src = canvas.toDataURL("image/"+type);        // 指定格式 PNG
            return image;
        }
    };

    /*从 canvas 提取图片 image base64*/
    _convertCanvasToImageBase64 (whiteboardInstance , type) {
        if(whiteboardInstance && whiteboardInstance.lc && whiteboardInstance.lc.canvas){
            let canvas = whiteboardInstance.lc.canvas;
            // canvas.toDataURL 返回的是一串Base64编码的URL，当然,浏览器自己肯定支持
            let imgBase64 = canvas.toDataURL("image/"+type);        // 指定格式 PNG
            return imgBase64;
        }
    };

    /*保存基础模板数据*/
    _saveBasicTemplateWhiteboardSignallingData(signallingData , source){
        if(signallingData.data.isBaseboard){
            if(signallingData && signallingData.data){
                if(signallingData.data.isBaseboard && signallingData.data.whiteboardID !== undefined){
                    signallingData.source = source;
                    this.basicTemplateWhiteboardSignallingList[signallingData.data.whiteboardID] = this.basicTemplateWhiteboardSignallingList[signallingData.data.whiteboardID] || [] ;
                    this.basicTemplateWhiteboardSignallingList[signallingData.data.whiteboardID].push( signallingData );
                }
            }
        }
    };

    /*显示远程提示内容，来自于pubmsg*/
    _handlerShowRemoteRemindContentFromPubmsgData(whiteboardInstance , pubmsgData){
        let x , y , content  ;
        if(pubmsgData.source === 'pubmsg'  && pubmsgData.data && pubmsgData.data.eventType === 'shapeSaveEvent'){
            if(pubmsgData.data.data.className == "LinePath" ) {
                let arrLength = pubmsgData.data.data.points.length;
                if(arrLength>0) {
                    x = pubmsgData.data.data.points[arrLength - 1].x;
                    y = pubmsgData.data.data.points[arrLength - 1].y;
                    content = pubmsgData.remindContent;
                }
                this._productionWhiteboardRemindContent(whiteboardInstance , x , y , content  , pubmsgData.data.shapeId );
            }else if(pubmsgData.data.data.className =="Rectangle" || pubmsgData.data.data.className =="Ellipse" ) {
                if(pubmsgData.data.data.width>0&&pubmsgData.data.data.height>0){
                    x = pubmsgData.data.data.x + pubmsgData.data.data.width;
                    y = pubmsgData.data.data.y;
                }else if(pubmsgData.data.data.width>0&&pubmsgData.data.data.height<0){
                    x = pubmsgData.data.data.x + pubmsgData.data.data.width;
                    y = pubmsgData.data.data.y + pubmsgData.data.data.height;
                }else if(pubmsgData.data.data.width<0&&pubmsgData.data.data.height<0){
                    x = pubmsgData.data.data.x;
                    y = pubmsgData.data.data.y + pubmsgData.data.data.height;
                }else if(pubmsgData.data.data.width<0&&pubmsgData.data.data.height>0){
                    x = pubmsgData.data.data.x;
                    y = pubmsgData.data.data.y;
                }
                content = pubmsgData.remindContent;
                this._productionWhiteboardRemindContent(whiteboardInstance , x , y , content  , pubmsgData.data.shapeId );
            }else if(pubmsgData.data.data.className == "Text"){
                x = pubmsgData.data.data.x + pubmsgData.data.data.renderer.metrics.width;
                y = pubmsgData.data.data.y + pubmsgData.data.data.renderer.metricses.length * 20;
                content = pubmsgData.remindContent;
                this._productionWhiteboardRemindContent(whiteboardInstance , x , y , content , pubmsgData.data.shapeId );
            }else if(pubmsgData.data.data.className == "Line"){
                x = pubmsgData.data.data.x2 ;
                y = pubmsgData.data.data.y2 ;
                content = pubmsgData.remindContent;
                this._productionWhiteboardRemindContent(whiteboardInstance , x , y , content  , pubmsgData.data.shapeId);
            }
        }
    }
};
const  HandlerWhiteboardAndCoreInstance = new HandlerWhiteboardAndCore();
export default HandlerWhiteboardAndCoreInstance ;
