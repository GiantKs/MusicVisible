/**
 * 拓课工具类
 * @module serviceTools
 * @description   提供 系统所需要的工具
 * @author QiuShao
 * @date 2017/7/20
 */
'use strict';

const tkUtils  = {
    /*所需工具*/
    tool:{
        /**启动全屏
         @method launchFullscreen
         @param {element} element 全屏元素
         */
        launchFullscreen:(element) => {
            if(element.requestFullscreen) {
                element.requestFullscreen();
            } else if(element.mozRequestFullScreen) {
                element.mozRequestFullScreen();
            } else if(element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            } else if(element.msRequestFullscreen) {
                element.msRequestFullscreen();
            }
        },
        /**退出全屏
         @method exitFullscreen
         */
        exitFullscreen:() => {
            if(document.exitFullScreen) {
                document.exitFullScreen();
            } else if(document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if(document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if(element.msExitFullscreen) {
                element.msExitFullscreen();
            }
        } ,
        /*是否处于全屏状态
         @method isFullScreenStatus
         * */
        isFullScreenStatus:(element) => {
            return document.fullscreen ||
                document.mozFullScreen ||
                document.webkitIsFullScreen ||
                document.webkitFullScreen ||
                document.msFullScreen ||
                false;
        },
        /**返回正处于全屏状态的Element节点，如果当前没有节点处于全屏状态，则返回null。
         @method getFullscreenElement
         */
        getFullscreenElement: () => {
            let fullscreenElement =
                document.fullscreenElement ||
                document.mozFullScreenElement ||
                document.webkitFullscreenElement;
            return fullscreenElement;
        },
        /**返回一个布尔值，表示当前文档是否可以切换到全屏状态
         @method isFullscreenEnabled
         */
        isFullscreenEnabled: () => {
            let fullscreenEnabled =
                document.fullscreenEnabled ||
                document.mozFullScreenEnabled ||
                document.webkitFullscreenEnabled ||
                document.msFullscreenEnabled;
            return fullscreenEnabled;
        },
        /*添加前缀---方法执行（如果是方法），又是属性判断（是否支持属性）
         @method runPrefixMethod
         TODO 暂时没有测试能否可用
         */
        runPrefixMethod:(element, method) => {
            let usablePrefixMethod;
            ["webkit", "moz", "ms", "o", ""].forEach((prefix) => {
                if (usablePrefixMethod) return;
                if (prefix === "") {
                    // 无前缀，方法首字母小写
                    method = method.slice(0,1).toLowerCase() + method.slice(1);

                }

                let typePrefixMethod = typeof element[prefix + method];

                if (typePrefixMethod + "" !== "undefined") {
                    if (typePrefixMethod === "function") {
                        usablePrefixMethod = element[prefix + method]();
                    } else {
                        usablePrefixMethod = element[prefix + method];
                    }
                }
            });

            return usablePrefixMethod;
        },
        /**为全屏添加全屏事件fullscreenchange
         @method addFullscreenchange
         @param   {Function} handle 事件处理器
         */
        addFullscreenchange:(handle) => {
            tkUtils.tool.addEvent(document,"fullscreenchange",handle,false);
            tkUtils.tool.addEvent(document,"webkitfullscreenchange",handle,false);
            tkUtils.tool.addEvent(document,"mozfullscreenchange",handle,false);
            tkUtils.tool.addEvent(document,"MSFullscreenChange",handle,false);
            tkUtils.tool.addEvent(document,"msfullscreenchange",handle,false);
            tkUtils.tool.addEvent(document,"fullscreeneventchange",handle,false);
        },
        /**移除全屏添加全屏事件fullscreenchange
         @method removeFullscreenchange
         @param   {Function} handle 事件处理器
         */
        removeFullscreenchange:(handle) => {
            tkUtils.tool.removeEvent(document,"fullscreenchange",handle,false);
            tkUtils.tool.removeEvent(document,"webkitfullscreenchange",handle,false);
            tkUtils.tool.removeEvent(document,"mozfullscreenchange",handle,false);
            tkUtils.tool.removeEvent(document,"MSFullscreenChange",handle,false);
            tkUtils.tool.removeEvent(document,"msfullscreenchange",handle,false);
            tkUtils.tool.removeEvent(document,"fullscreeneventchange",handle,false);
        },
        /**为全屏添加全屏事件fullscreenerror
         @method addFullscreenerror
         @param   {Function} handle 事件处理器
         */
        addFullscreenerror :(handle) => {
            tkUtils.tool.addEvent(document,"fullscreenerror",handle,false);
            tkUtils.tool.addEvent(document,"webkitfullscreenerror",handle,false);
            tkUtils.tool.addEvent(document,"mozfullscreenerror",handle,false);
            tkUtils.tool.addEvent(document,"MSFullscreenError",handle,false);
            tkUtils.tool.addEvent(document,"msfullscreenerror",handle,false);
            tkUtils.tool.addEvent(document,"fullscreenerroreventchange",handle,false);
        },
        /**移除全屏添加全屏事件fullscreenerror
         @method removeFullscreenerror
         @param   {Function} handle 事件处理器
         */
        removeFullscreenerror :(handle) => {
            tkUtils.tool.removeEvent(document,"fullscreenerror",handle,false);
            tkUtils.tool.removeEvent(document,"webkitfullscreenerror",handle,false);
            tkUtils.tool.removeEvent(document,"mozfullscreenerror",handle,false);
            tkUtils.tool.removeEvent(document,"MSFullscreenError",handle,false);
            tkUtils.tool.removeEvent(document,"msfullscreenerror",handle,false);
            tkUtils.tool.removeEvent(document,"fullscreenerroreventchange",handle,false);
        },
        /**绑定事件
         @method addEvent
         @param   {element} element 添加事件元素
         {string} eType 事件类型
         {Function} handle 事件处理器
         {Bollean} bol false 表示在事件第三阶段（冒泡）触发，true表示在事件第一阶段（捕获）触发。
         */
        addEvent:(element, eType, handle, bol) => {
            /*$(element).on(eType , handle);*/
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
         @method addEvent
         @param   {element} element 添加事件元素
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
        /**自动元素定位--中间定位
         @method autoElementPositionCneter
         @param {element} $ele 定位元素
         */
        autoElementPositionCneter: ($ele) => {
            $ele.css({
                "margin-left":(-$ele.width()/2)+"px" ,
                "margin-top":(-$ele.height()/2)+"px"
            });
        } ,
        /**清除元素定位--中间定位
         @method clearElementPositionCneter
         @param {element} $ele 定位元素
         */
        clearElementPositionCneter: ($ele) => {
            $ele.css({
                "margin-left":"" ,
                "margin-top":""
            });
        }
    },
    getGUID:() => { //获取GUID
        function GUID(){
            this.date = new Date();   /* 判断是否初始化过，如果初始化过以下代码，则以下代码将不再执行，实际中只执行一次 */
            if (typeof this.newGUID != 'function') {   /* 生成GUID码 */
                GUID.prototype.newGUID = function () {
                    this.date = new Date();
                    let guidStr = '';
                    let sexadecimalDate = this.hexadecimal(this.getGUIDDate(), 16);
                    let sexadecimalTime = this.hexadecimal(this.getGUIDTime(), 16);
                    for (let i = 0; i < 9; i++) {
                        guidStr += Math.floor(Math.random() * 16).toString(16);
                    }
                    guidStr += sexadecimalDate;
                    guidStr += sexadecimalTime;
                    while (guidStr.length < 32) {
                        guidStr += Math.floor(Math.random() * 16).toString(16);
                    }
                    return this.formatGUID(guidStr);
                }
                /* * 功能：获取当前日期的GUID格式，即8位数的日期：19700101 * 返回值：返回GUID日期格式的字条串 */
                GUID.prototype.getGUIDDate = function () {
                    return this.date.getFullYear() + this.addZero(this.date.getMonth() + 1) + this.addZero(this.date.getDay());
                }
                /* * 功能：获取当前时间的GUID格式，即8位数的时间，包括毫秒，毫秒为2位数：12300933 * 返回值：返回GUID日期格式的字条串 */
                GUID.prototype.getGUIDTime = function () {
                    return this.addZero(this.date.getHours()) + this.addZero(this.date.getMinutes()) + this.addZero(this.date.getSeconds()) + this.addZero(parseInt(this.date.getMilliseconds() / 10));
                }
                /* * 功能: 为一位数的正整数前面添加0，如果是可以转成非NaN数字的字符串也可以实现 * 参数: 参数表示准备再前面添加0的数字或可以转换成数字的字符串 * 返回值: 如果符合条件，返回添加0后的字条串类型，否则返回自身的字符串 */
                GUID.prototype.addZero = function (num) {
                    if (Number(num).toString() != 'NaN' && num >= 0 && num < 10) {
                        return '0' + Math.floor(num);
                    } else {
                        return num.toString();
                    }
                }
                /*  * 功能：将y进制的数值，转换为x进制的数值 * 参数：第1个参数表示欲转换的数值；第2个参数表示欲转换的进制；第3个参数可选，表示当前的进制数，如不写则为10 * 返回值：返回转换后的字符串 */GUID.prototype.hexadecimal = function (num, x, y) {
                    if (y != undefined) { return parseInt(num.toString(), y).toString(x); }
                    else { return parseInt(num.toString()).toString(x); }
                }
                /* * 功能：格式化32位的字符串为GUID模式的字符串 * 参数：第1个参数表示32位的字符串 * 返回值：标准GUID格式的字符串 */
                GUID.prototype.formatGUID = function (guidStr) {
                    let str1 = guidStr.slice(0, 8) + '-', str2 = guidStr.slice(8, 12) + '-', str3 = guidStr.slice(12, 16) + '-', str4 = guidStr.slice(16, 20) + '-', str5 = guidStr.slice(20);
                    return str1 + str2 + str3 + str4 + str5;
                }

                GUID.prototype.getFormatDate = function (guidStr) {
                    return this.getGUIDDate().toString().slice(4, 6) + '-' + this.getGUIDDate().toString().slice(6, 8) +
                           ' ' + this.getGUIDTime().toString().slice(0,2) + ':' + this.getGUIDTime().toString().slice(2, 4);
                }
            }
        }
        return new GUID();
    } ,
    getTs(){  // 获取10位时间戳
        return (Date.parse(new Date()))/1e3;
    },
    getNewGUID:() => { //获取初始化
        if(!tkUtils.guidObj){
            tkUtils.guidObj = new tkUtils.getGUID();
        }
        let guid = tkUtils.guidObj.newGUID();
        tkUtils.guidObj = null ;
        return guid ;
    } ,
    getBrowserInfo: () =>{  //获取浏览器基本信息
        let userAgent=window.navigator.userAgent ,
            rMsie=/(msie\s|trident.*rv:)([\w.]+)/,
            rFirefox=/(firefox)\/([\w.]+)/,
            rOpera=/(opera).+version\/([\w.]+)/,
            rChrome=/(chrome)\/([\w.]+)/,
            rSafari=/version\/([\w.]+).*(safari)/;
        let uaMatch  = (ua)=> {
            let match=rMsie.exec(ua);
            if(match != null) {
                return {browser:"IE",version:match[2] || "0"};
            }
            match=rFirefox.exec(ua);
            if(match != null) {
                return {browser:match[1] || "",version:match[2] || "0"};
            }
            match=rOpera.exec(ua);
            if(match != null) {
                return {browser:match[1] || "",version:match[2] || "0"};
            }
            match=rChrome.exec(ua);
            if(match != null) {
                return {browser:match[1] || "",version:match[2] || "0"};
            }
            match=rSafari.exec(ua);
            if(match != null) {
                return {browser:match[2] || "",version:match[1] || "0"};
            }
            if(match != null) {
                return {browser:"",version:"0"};
            }else{
                return {browser:"unknown",version:"unknown"};
            }
        };
        let browserMatch=uaMatch( userAgent.toLowerCase() );
        let language = (navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage || navigator.language ) ;
        //判断访问终端
        let browser={
            versions:function(){
                let u = navigator.userAgent, app = navigator.appVersion;
                //Log.error("navigator.userAgent ===",u);
                //Log.error("navigator.appVersion ===",app);
                return {
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                    iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                    chrome: u.toLowerCase().indexOf('chrome') > 1, //谷歌内核
                    qq: u.toLowerCase().indexOf('qqbrowser') > 1, //qq浏览器
                    baidu: u.toLowerCase().indexOf('bidubrowser') > 1, //百度浏览器
                    maxthon: u.toLowerCase().indexOf('maxthon') > 1, //遨游浏览器
                    uc: u.toLowerCase().indexOf('ubrowser') > 1, //遨游浏览器
                };
            }(),
            language:language ? language.toLowerCase() : undefined ,
            info:{
                browserName:browserMatch.browser , //浏览器使用的版本名字
                browserVersion:browserMatch.version ,//浏览器使用的版本号
                appCodeName:navigator.appCodeName , //返回浏览器的代码名。
                appMinorVersion:navigator.appMinorVersion , //返回浏览器的次级版本。
                appName:navigator.appName , //返回浏览器的名称。
                appVersion:navigator.appVersion ,  //	返回浏览器的平台和版本信息。
                browserLanguage:navigator.browserLanguage , //	返回当前浏览器的语言。
                cookieEnabled: navigator.cookieEnabled , //	返回指明浏览器中是否启用 cookie 的布尔值。
                cpuClass:navigator.cpuClass , //	返回浏览器系统的 CPU 等级。
                onLine:navigator.onLine , //	返回指明系统是否处于脱机模式的布尔值。
                platform:navigator.platform , //	返回运行浏览器的操作系统平台。
                systemLanguage:navigator.systemLanguage ,  //返回 OS 使用的默认语言。
                userAgent:navigator.userAgent , //返回由客户机发送服务器的 user-agent 头部的值。
                userLanguage:navigator.userLanguage , //	返回 OS 的自然语言设置。
            }
        };
        return browser ;
    },
    isEmpty:(obj) => {
        let keys = Object.keys(obj) ;
        return keys.length === 0;
    } ,
    getUrlParams: (key , url) => {
        /*charCodeAt()：返回指定位置的字符的 Unicode 编码。这个返回值是 0 - 65535 之间的整数。
         fromCharCode()：接受一个指定的 Unicode 值，然后返回一个字符串。
         encodeURIComponent()：把字符串作为 URI 组件进行编码。
         decodeURIComponent()：对 encodeURIComponent() 函数编码的 URI 进行解码。*/
        let href = window.location.href ;
        if(window.TkConstant){
            href = tkUtils.decrypt( window.TkConstant.SERVICEINFO.joinUrl ) || window.location.href;
        }
        href = url || href;
        // let urlAdd = decodeURI(href);
        let urlAdd = decodeURIComponent(href);
        let urlIndex = urlAdd.indexOf("?");
        let urlSearch = urlAdd.substring(urlIndex + 1);
        let reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");   //reg表示匹配出:$+url传参数名字=值+$,并且$可以不存在，这样会返回一个数组
        let arr = urlSearch.match(reg);
        if(arr != null) {
            return arr[2];
        } else {
            return "";
        }
    } ,
    /*字符串第一个首字母转大写
    * @method replaceFirstUper
    * @params [str:string]*/
    replaceFirstUper: (str) => {
        if(str.length>0){
            let tmpChar = str.substring(0,1).toUpperCase();
            let postString = str.substring(1);
            let  tmpStr = tmpChar + postString;
            return tmpStr ;
        }else{
            str
        }
    } ,
    /*判断是否是数组
     * @method isArray
     * @params [object:any]*/
    isArray: (object) => {
        return Array && Array.isArray && typeof  Array.isArray === 'function' ?  Array.isArray(object) : ( object && typeof object==='object' &&
            typeof object.length==='number' &&
            typeof object.splice==='function' &&
            //判断length属性是否是可枚举的 对于数组 将得到false
            !(object.propertyIsEnumerable('length')) );
    } ,
    /*过滤包含以data-开头的属性
    * @method filterContainDataAttribute */
    filterContainDataAttribute:(attributeObj) => {
        const that = tkUtils ;
        if(attributeObj && !that.isArray(attributeObj) && typeof attributeObj === "object"){
            let tmpAttributeObj = {} ;
            for (let [key, value] of Object.entries(attributeObj)) {
                if(/^data-/g.test(key)){
                    tmpAttributeObj[key] = value ;
                }
            }
            return tmpAttributeObj ;
        }else{
            return attributeObj ;
        }
    } ,
    /*根据文件后缀名判断属于什么文件类型*/
    getFiletyeByFilesuffix:(filesuffix) => {

        let filetype = undefined;
        if (filesuffix == "jpg" || filesuffix == "jpeg" || filesuffix == "png" || filesuffix == "gif" || filesuffix == "ico" || filesuffix == "bmp") {
            filetype = "jpg"; //图片
        } else if (filesuffix == "doc" || filesuffix == "docx" || filesuffix == "rtf") {
            filetype = "doc"; //文档
        } else if (filesuffix == "pdf") {
            filetype = "pdf";  //pdf
        } else if (filesuffix == "ppt" || filesuffix == "pptx" || filesuffix == "pps") {
            filetype = "ppt"; //ppt
        } else if (filesuffix == "txt") {
            filetype = "txt"; //txt
        } else if (filesuffix == "xls" || filesuffix == "xlsx") {
            filetype = "xlsx"; //xlsx
        } else if (filesuffix == "mp4" || filesuffix == "webm") {
            //video:.mp4  , .webm
            filetype = "mp4";
        } else if (filesuffix == "mp3" || filesuffix == "wav") {
            //audio:.mp3 , .wav , .ogg
            filetype = "mp3";
        }else if (filesuffix == "zip" ) {
            //h5
            filetype = "h5";
        }else if(filesuffix === "whiteboard"){
            filetype = "whiteboard" ;
        } else {
            filetype = "other";
        }
        return filetype; //jpg、doc、pdf、ppt、txt、xlsx、mp4、mp3、other
    },
    /*是否是函数*/
    isFunction:( callback ) => {
        return  callback && typeof callback === 'function' ;
    },
    /*从用户中获取用户的自定义属性*/
    getCustomUserPropertyByUser:(user)=>{
        let  customUserproperty  = {
            disableaudio:user.disableaudio ,
            disablevideo:user.disablevideo ,
            giftnumber:user.giftnumber ,
            hasaudio:user.hasaudio ,
            hasvideo:user.hasvideo  ,
            publishstate:user.publishstate ,
            raisehand:user.raisehand
        }  ;
        return customUserproperty;
    } ,
    /*计算时间差，转为hh,mm,ss*/
    getTimeDifferenceToFormat: (start  , end) => {
        let difference = end - start  ;//时间差的毫秒数
        if(difference >= 0)	{
            //计算出相差天数
            let days = Math.floor(difference / (24 * 3600 * 1000));
            //计算出小时数
            let leave1 = difference % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
            let hours = Math.floor(leave1 / (3600 * 1000));
            //计算相差分钟数
            let leave2 = leave1 % (3600 * 1000);       //计算小时数后剩余的毫秒数
            let minutes = Math.floor(leave2 / (60 * 1000));
            //计算相差秒数
            let leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
            let seconds = Math.round(leave3 / 1000);
            let daysAddHour = hours + (days * 24);  //加上天数的小时数
            let clock = {};
            if(seconds >=60){
                seconds = 0 ;
                minutes += 1 ;
            }
            if(minutes >=60){
                minutes = 0 ;
                daysAddHour += 1 ;
            }
            clock.hh = daysAddHour > 9 ? daysAddHour : '0' + daysAddHour;
            clock.mm = minutes > 9 ? minutes : '0' + minutes;
            clock.ss = seconds > 9 ? seconds : '0' + seconds;
            return clock;
        }else{
            L.Logger.error('Start time is greater than end time [start:'+start+'  , end:'+end+']!' );
            return undefined ;
        }
    },
    /*判断时间是秒级还是毫秒级 ,true:毫秒级 ， false:秒级 , undefined:传入的时间不正确 */
    isMillisecondClass:(time) => {
        if(typeof time !== 'number'  ){L.Logger.error('time must is number!');return ;};
        time = String(time);
        let length = time.length ;
        if( length === 13  ){
            return true; //毫秒级
        }else if(  length === 10  ) {
            return false; //秒级
        }else{
            L.Logger.warning('The incoming time is incorrect and cannot be judged to be second or second!');
            return undefined ;
        }
    } ,
    /**
     * 加密函数
     * @param str 待加密字符串
     * @returns {string}
     */
    encrypt: (str , encryptRandom ) => {
        if(!str){return str;}
        if( window.TkConstant ){
            if( window.TkConstant.DEV ) { //开发模式
                return str;
            }
        }else{
            let DEV = false ;
            try{
                DEV = __DEV__ ;
            }catch (e){
                L.Logger.warning('There is no configuration dev mark[__DEV__]!');
            }
            if( DEV || tkUtils.getUrlParams('debug') ) { //开发模式
                return str;
            }
        }
        return  L.Utils.encrypt(str , encryptRandom);
    },
    /**
     * 解密函数
     * @param str 待解密字符串
     * @returns {string}*/
    decrypt: (str , encryptRandom ) => {
        if(!str){return str;}
        if( window.TkConstant ){
            if( window.TkConstant.DEV ) { //开发模式
                return str;
            }
        }else{
            let DEV = false ;
            try{
                DEV = __DEV__ ;
            }catch (e){
                L.Logger.warning('There is no configuration dev mark[__DEV__]!');
            }
            DEV = false ;
            if( DEV || tkUtils.getUrlParams('debug') ) { //开发模式
                return str;
            }
        }
       return  L.Utils.decrypt(str , encryptRandom);
    },
    /*返回操作系统*/
    detectOS:function(){
        let sUserAgent = navigator.userAgent;
        let isWin = (navigator.platform === "Win32") || (navigator.platform === "Windows");
        let isMac = (navigator.platform === "Mac68K") || (navigator.platform === "MacPPC") || (navigator.platform === "Macintosh") || (navigator.platform === "MacIntel");
        if (isMac) return "Mac";
        let isUnix = (navigator.platform === "X11") && !isWin && !isMac;
        if (isUnix) return "Unix";
        let isLinux = (String(navigator.platform).indexOf("Linux") > -1);
        if (isLinux) return "Linux";
        if (isWin) {
            let isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
            if (isWin2K) return "Win2000";
            let isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
            if (isWinXP) return "WinXP";
            let isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
            if (isWin2003) return "Win2003";
            let isWinVista= sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
            if (isWinVista) return "WinVista";
            let isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
            if (isWin7) return "Win7";
            let isWin8 = sUserAgent.indexOf("Windows NT 6.2") > -1 || sUserAgent.indexOf("Windows 8") > -1;
            if (isWin8) return "Win8";
            let isWin10 = sUserAgent.indexOf("Windows NT 10.0") > -1 || sUserAgent.indexOf("Windows 10") > -1;
            if (isWin10) return "Win10";
        } 
        return "Other";
    },
    /*网速检测*/
    internetSpeedTest:function() {

    },
    /*获取白板区工具相对白板的位置(拖拽后将相对白板的百分比转为rem使用)*/
    getPagingToolLT:function(that,percentLeft,percentTop,id,isDrag) {//获取白板区工具相对白板的位置
        if (isDrag) {
            const defalutFontSize = window.innerWidth / TkConstant.STANDARDSIZE ;
            //获取拖拽的元素宽高：
            let dragEle = document.getElementById(id);//拖拽的元素
            let dragEleW = dragEle.clientWidth;
            let dragEleH = dragEle.clientHeight;
            if (dragEleW === 0) {
                return
            }
            //获取白板区域宽高：
            let content = document.getElementById('content');
            let contentW = content.clientWidth;
            let contentH = content.clientHeight;
            //计算白板区工具相对白板的位置：
            let pagingToolLeft = percentLeft*(contentW - dragEleW)/defalutFontSize;
            let pagingToolTop = percentTop*(contentH - dragEleH)/defalutFontSize;
            that.state[id] = {
                pagingToolLeft:pagingToolLeft,
                pagingToolTop:pagingToolTop
            };
            return that.state[id];
        }
    },
    /*获取白板区工具相对白板的位置%(拖拽后将相对白板的rem转为百分比使用)*/
    RemChangeToPercentage:function(left,top,dragEleId) {//获取白板区工具相对白板的位置
        const defalutFontSize = window.innerWidth / TkConstant.STANDARDSIZE ;
        //获取拖拽的元素宽高：
        let dragEle = document.getElementById(dragEleId);//拖拽的元素
        let dragEleW = dragEle.clientWidth;
        let dragEleH = dragEle.clientHeight;
        //获取白板区域宽高：
        let boundsEle = document.getElementById('content');
        let boundsEleW = boundsEle.clientWidth;
        let boundsEleH = boundsEle.clientHeight;
        //计算白板区工具相对白板的位置：
        let percentLeft = (left*defalutFontSize)/(boundsEleW - dragEleW);
        let percentTop = (top*defalutFontSize)/(boundsEleH - dragEleH);
        return {percentLeft,percentTop};
    },
    /*处理兼容性，监听浏览器窗口是否课件（最小化）*/
    handleVisibilityChangeCompatibility:function () {
        let hidden, state, visibilityChange;
        if (typeof document.hidden !== "undefined") {
            hidden = "hidden";
            visibilityChange = "visibilitychange";
            state = "visibilityState";
        } else if (typeof document.mozHidden !== "undefined") {
            hidden = "mozHidden";
            visibilityChange = "mozvisibilitychange";
            state = "mozVisibilityState";
        } else if (typeof document.msHidden !== "undefined") {
            hidden = "msHidden";
            visibilityChange = "msvisibilitychange";
            state = "msVisibilityState";
        } else if (typeof document.webkitHidden !== "undefined") {
            hidden = "webkitHidden";
            visibilityChange = "webkitvisibilitychange";
            state = "webkitVisibilityState";
        }
        return {hidden, state, visibilityChange};
    },
    /*延时工具*/
    liveTimeout:(callback , timeoutTime = 0 , isTimeout ) => {
        if(callback && typeof callback === 'function'){
            if(!isTimeout){
                callback();
            }else{
                setTimeout( callback , timeoutTime ) ;
            }
        }
    },
    // 房间号+8位日期+5位随机数
    getLotteryid:()=>{
        let serial = TkConstant.joinRoomInfo.serial;
        let d = new Date();
        let num = Math.round((Math.random()*9+1)*10000);
        return serial + d.getFullYear() + (d.getMonth()+1) + d.getDate() + num
    },

    getUniqueId:()=>{
        let serial = TkConstant.joinRoomInfo.serial;
        let d = new Date();
        let num = Math.random()*900|0+100;
        return serial + d.getFullYear() + (d.getMonth()+1) + d.getDate() + num
    },

    getWidthAndHeight:(videotype)=>{
        let that = this;
        let pullWidth = 320,pullHeight = 240;
        if(videotype === 0){
            pullWidth = 80;
            pullHeight = 60;
        } else if(videotype === 1){
            pullWidth = 176;
            pullHeight = 144;
        } else if(videotype === 2){
            pullWidth = 320;
            pullHeight = 240;
        } else if(videotype === 3){
            pullWidth = 640;
            pullHeight = 480;
        } else if(videotype === 4){
            pullWidth = 1280;
            pullHeight = 720;
        } else if(videotype === 5){
            pullWidth = 1920;
            pullHeight = 1080;
        }
        return {pullWidth:pullWidth,pullHeight:pullHeight};
    },

    toTwo(num){//时间个位数转十位数
        if(parseInt(num/10)==0){
            return '0'+num;
        }else{
            return num;
        }
    },

    getSendTime(){//获取当前时间
        let time;
            time=this.toTwo(new Date().getHours())+':'+this.toTwo(new Date().getMinutes());
        return time;
    }

};
export default  tkUtils ;