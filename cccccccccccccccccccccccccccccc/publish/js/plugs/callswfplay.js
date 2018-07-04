
//直播调用设置拉流地址和调用
function broadcastInit(broadcastPullUrl){
    var pullUrl = broadcastPullUrl;
    readyLoadSwf(); //启动播放swf
    //初始化播放器
    function initSwf(){
        var swfVersionStr = "11.3.0"; // flash版本号
        var xiSwfUrlStr = "playerProductInstall.swf";

        // json对象，为flash传递一些初始化信息
        var flashvars = {};

        // 设置flash的样式
        var params = {};
        params.quality = "high";             // video开启平滑处理时要求设置为高品质
        params.bgcolor = "#000000";          // swf容器的背景色，不影响网页背景色
        params.wmode = "transparent";
        params.allowfullscreen = "true";     // 是否允许全屏
        params.allowscriptaccess = "always"; // 是否允许跨域
        params.allowFullScreenInteractive = "true"; // 是否允许带键盘交互的全屏


        // 嵌入flash完成时的object标签的ID，name等属性
        var attributes = {};
        attributes.id = "cloudvPlayer";
        attributes.name = "cloudvPlayer";
        attributes.align = "middle";

        //embedSWF 参数解释：
        // 参数1：swf 文件地址
        // 参数2：swf 文件容器
        // 参数3：flash 的宽度
        // 参数4：flash 的高度
        // 参数5：正常播放该 flash 的最低版本
        // 可选参数信息：
        // 参数6：版本低于当前要求时，执行该 swf 文件，跳转到官方下载最新版本的 flash 插件
        // 参数7：为flash传递一些参数信息
        // 参数8：设置flash的样式
        // 参数9：嵌入flash完成时的object标签的ID，name等属性
        // 参数10：定义一个在执行embedSWF方法后，嵌入flash成功或失败后都可以回调的 JS 函数
        swfobject.embedSWF("cloudvPlayer.swf", "flashContent", '100%', '100%', swfVersionStr, xiSwfUrlStr, flashvars, params, attributes);
        swfobject.createCSS("#flashContent", "display:block; text-align:left; background-color: #000000;");
    }


// 网页加载完毕，开始加载播放器
    function readyLoadSwf() {
        initSwf();
    }

// 播放器加载完毕，播放器通知回调接口
    function loadWsPlayerComplete() {
        onPlayHandler();
        console.warn( "loadWsPlayerComplete!" );
    }

//播放入口
    function onPlayHandler() {
        var args = {
            url: pullUrl,
            isLive: true, videoType: "rtmp"
        };
        // cloudvPlayer为播放器初始化中的attributes.id值
        //console.error("cloudvPlayer" , thisMapMovie("cloudvPlayer"));
        thisMapMovie("cloudvPlayer").jsPlay(args);
    }

// 获取播放器对象
    function thisMapMovie(movieName) {
        if (window.document[movieName]) {
            return window.document[movieName];
        }
        if (navigator.appName.indexOf("Microsoft Internet") == -1) {
            if (document.embeds && document.embeds[movieName]) return document.embeds[movieName];
        } else {
            return document.getElementById(movieName);
        }
    }

    function onCloseHandler() {
        thisMapMovie("cloudvPlayer").jsClose();
        pullUrl = "";
    }

    function wsPlayerLogHandler(log, obj) {
        console.log( log );
        if(obj) {
            for(var id in obj) {
                console.log( id + ":" + obj[id] );
            }
        }
    }
}

