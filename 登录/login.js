var h2=document.getElementById('h2');
var title=document.getElementById('title');
var password=document.getElementById('password');
var userphone=document.getElementById('userphone');
var checkbox=document.querySelector('.p');
var form=document.getElementById('form');
var hidden=document.getElementById('clientInfo');
var url=document.getElementById('url');
var button=document.querySelector('.button');
var hint=document.getElementById('hint');
var Right=document.querySelector('.checkbox .p');
var endtype=getUrlParams('endtype');
var clientversion=getUrlParams('clientversion');
var companyid=getUrlParams('companyid');
var timer;
hidden.value='endtype='+endtype+'&clientversion='+clientversion;

url.value=window.location.href;


//--------------------------------------------
function getUrlParams(key , url)  {
    var href = window.location.href ;
    href = url || href;
    var urlAdd = decodeURIComponent(href);
    var urlIndex = urlAdd.indexOf("?");
    var urlSearch = urlAdd.substring(urlIndex + 1);
    var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");   //reg表示匹配出:$+url传参数名字=值+$,并且$可以不存在，这样会返回一个数组
    var arr = urlSearch.match(reg);
    if(arr != null) {
        return arr[2];
    } else {
        return "";
    }
}
//-------------------------------------------加密
var L = L || {};
L.hex64Instance = undefined ;
;(function() {
    //
    // 密文字符集（size:65）。
    // [0-9A-Za-z$_~]
    //
    // var _hexCHS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$_~';
    var _hexCHS = 'JKijklmnoz$_01234ABCDEFGHI56789LMNOPQRpqrstuvwxySTUVWXYZabcdefgh~';

    if(_hexCHS.length !== 65){L.Logger.error('密文字符集长度必须是65位，当前长度为:'+_hexCHS.length );return ;}
    //
    // Base64 变形加密法
    // 算法与 Base64 类似，即将 8 位字节用 6 位表示。
    // 规则：
    // 1. 码值 <= 0xff 的用 1 个字节表示；
    // 2. 码值 > 0xff 的用 2 字节表示；
    // 3. 单/双字节序列间用 0x1d 进行分隔；
    // 4. 首字为双字节时即前置 0x1d 分隔符。
    //
    // @param array key  - [0-63] 互斥值数组，length == 64
    //
    var Hex64 = function( key )
    {
        this._key = [], this._tbl = {};

        for (var _i=0; _i<64; ++_i) {
            this._key[_i] = _hexCHS.charAt(key[_i]);
            this._tbl[this._key[_i]] = _i;
        }
        this._pad = _hexCHS.charAt(64);
    };

    // 加密
    Hex64.prototype.enc = function( s )
    {
        var _rs = '';
        var _c1, _c2, _c3, _n1, _n2, _n3, _n4;
        var _i = 0;
        var _a = Hex64._2to1(s);
        var _en = _a.length % 3, _sz = _a.length - _en;
        while (_i < _sz) {
            _c1 = _a[_i++];
            _c2 = _a[_i++];
            _c3 = _a[_i++];
            _n1 = _c1 >> 2;
            _n2 = ((_c1 & 3) << 4) | (_c2 >> 4);
            _n3 = ((_c2 & 15) << 2) | (_c3 >> 6);
            _n4 = _c3 & 63;
            _rs += this._key[_n1]
                + this._key[_n2]
                + this._key[_n3]
                + this._key[_n4];
        }
        if (_en > 0) {
            _c1 = _a[_i++];
            _c2 = _en > 1 ? _a[_i] : 0;
            _n1 = _c1 >> 2;
            _n2 = ((_c1 & 3) << 4) | (_c2 >> 4);
            _n3 = (_c2 & 15) << 2;
            _rs += this._key[_n1] + this._key[_n2]
                + (_n3 ? this._key[_n3] : this._pad)
                + this._pad;
        }
        return  _rs.replace(/.{76}/g, function(s) {
            return  s + '\n';
        });
    };

    // 解密
    Hex64.prototype.dec = function( s )
    {
        var _sa = [],
            _n1, _n2, _n3, _n4,
            _i = 0, _c = 0;
        s = s.replace(/[^0-9A-Za-z$_~]/g, '');
        while (_i < s.length) {
            _n1 = this._tbl[s.charAt(_i++)];
            _n2 = this._tbl[s.charAt(_i++)];
            _n3 = this._tbl[s.charAt(_i++)];
            _n4 = this._tbl[s.charAt(_i++)];
            _sa[_c++] = (_n1 << 2) | (_n2 >> 4);
            _sa[_c++] = ((_n2 & 15) << 4) | (_n3 >> 2);
            _sa[_c++] = ((_n3 & 3) << 6) | _n4;
        }
        var _e2 = s.slice(-2);
        if (_e2.charAt(0) == this._pad) {
            _sa.length = _sa.length - 2;
        } else if (_e2.charAt(1) == this._pad) {
            _sa.length = _sa.length - 1;
        }
        return  Hex64._1to2(_sa);
    };

    //
    // 辅助：
    // Unicode 字符串 -> 单字节码值数组
    // 注意：
    // 原串中值为 0x1d 的字节（非字符）会被删除。
    //
    // @param string s  - 字符串（UCS-16）
    // @return array  - 单字节码值数组
    //
    Hex64._2to1 = function( s )
    {
        var _2b = false, _n = 0, _sa = [];

        if (s.charCodeAt(0) > 0xff) {
            _2b = true;
            _sa[_n++] = 0x1d;
        }
        for (var _i=0; _i<s.length; ++_i) {
            var _c = s.charCodeAt(_i);
            if (_c == 0x1d) continue;
            if (_c <= 0xff) {
                if (_2b) {
                    _sa[_n++] = 0x1d;
                    _2b = false;
                }
                _sa[_n++] = _c;
            } else {
                if (! _2b) {
                    _sa[_n++] = 0x1d;
                    _2b = true;
                }
                _sa[_n++] = _c >> 8;
                _sa[_n++] = _c & 0xff;
            }
        }
        return  _sa;
    };

    //
    // 辅助：
    // 单字节码值数组 -> Unicode 字符串
    //
    // @param array a  - 单字节码值数组
    // @return string  - 还原后的字符串（UCS-16）
    //
    Hex64._1to2 = function( a )
    {
        var _2b = false, _rs = '';

        for (var _i=0; _i<a.length; ++_i) {
            var _c = a[_i];
            if (_c == 0x1d) {
                _2b = !_2b;
                continue;
            }
            if (_2b) {
                _rs += String.fromCharCode(_c * 256 + a[++_i]);
            } else {
                _rs += String.fromCharCode(_c);
            }
        }
        return  _rs;
    };
    // var _k3 = [38,48,18,11,26,19,55,58,10,33,34,49,14,25,44,52,61,16,2,56,23,29,45,9,3,12,39,30,42,47,22,21,60,1,54,28,57,17,27,15,40,46,43,13,0,51,35,63,36,50,6,32,4,31,62,5,24,8,53,59,41,20,7,37];
    var _k3 = [15,40,46,43,13,0,51,35,63,36,50,6,32,4,31,62,5,24,8,53,59,41,20,7,37,38,48,18,11,26,19,55,58,10,33,34,49,14,25,44,52,61,16,2,56,23,29,45,9,3,12,39,30,42,47,22,21,60,1,54,28,57,17,27];
    if(_k3.length !== 64){L.Logger.error('互斥值数组长度必须是65位，当前长度为:'+_k3.length );return ;}
    L.hex64Instance = new Hex64(_k3);
})();
function jia(str , encryptRandom ) {
    if(!str){return str;}
    encryptRandom = encryptRandom != undefined ? encryptRandom : 'talk_2017_@beijing' ;
    var out = L.hex64Instance.enc(str);
    out = encryptRandom + out + encryptRandom ;
    return out
}
function jie(str , encryptRandom ){
    if(!str){return str;}
    encryptRandom = encryptRandom != undefined ? encryptRandom : 'talk_2017_@beijing' ;
    var regExp = new RegExp( encryptRandom , 'gm' ) ;
    str = str.replace( regExp , '' );
    var out = L.hex64Instance.dec(str);
    return out
}

Right.onclick=function () {
    if(Right.className=='p'){
        Right.className='q'
    }else {
        Right.className='p'
    }
}

var dW = 4096;
document.documentElement.style.fontSize = ( (document.documentElement.clientWidth || document.body.clientWidth) / (dW/ 100) ) + "px";
window.onresize = function() {
    document.documentElement.style.fontSize = ( (document.documentElement.clientWidth || document.body.clientWidth) / (dW/ 100) ) + "px";
}
function getBrowserInfo(){  //��ȡ�����������Ϣ
    var userAgent=window.navigator.userAgent ,
        rMsie=/(msie\s|trident.*rv:)([\w.]+)/,
        rFirefox=/(firefox)\/([\w.]+)/,
        rOpera=/(opera).+version\/([\w.]+)/,
        rChrome=/(chrome)\/([\w.]+)/,
        rSafari=/version\/([\w.]+).*(safari)/;
    function uaMatch (ua){
        var match=rMsie.exec(ua);
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
    var browserMatch=uaMatch( userAgent.toLowerCase() );
    var language = (navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage || navigator.language ) ;
    //�жϷ����ն�
    var browser={
        versions:function(){
            var u = navigator.userAgent, app = navigator.appVersion;
            return {
                trident: u.indexOf('Trident') > -1,
                presto: u.indexOf('Presto') > -1,
                webKit: u.indexOf('AppleWebKit') > -1,
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
                mobile: !!u.match(/AppleWebKit.*Mobile.*/),
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
                iPhone: u.indexOf('iPhone') > -1 , //
                iPad: u.indexOf('iPad') > -1, //
                webApp: u.indexOf('Safari') == -1 //
            };
        }(),
        language:language ? language.toLowerCase() : undefined ,
        info:{
            browserName:browserMatch.browser ,
            browserVersion:browserMatch.version ,
            appCodeName:navigator.appCodeName ,
            appMinorVersion:navigator.appMinorVersion ,
            appName:navigator.appName ,
            appVersion:navigator.appVersion ,
            browserLanguage:navigator.browserLanguage ,
            cookieEnabled: navigator.cookieEnabled ,
            cpuClass:navigator.cpuClass ,
            onLine:navigator.onLine ,
            platform:navigator.platform ,
            systemLanguage:navigator.systemLanguage ,
            userAgent:navigator.userAgent ,
            userLanguage:navigator.userLanguage
        }
    };
    return browser ;
}
var browserInfo = getBrowserInfo();
var  languageName = browserInfo.language && browserInfo.language.toLowerCase().match(/zh/g) ?  'chinese' : 'english' ;
if(languageName==='chinese'){
    var user = JSON.parse(localStorage.getItem("isRememberpassword"));
    if(user){
        if(user.isRememberpassword){
            Right.className='q';
            userphone.value=user.userphone;
            password.value=jie(user.password);
        }
    }
    if(getUrlParams('result')=='1'){
        if(user.isRememberpassword){
            Right.className='q';}
        if(user){
            userphone.value=user.userphone;
            password.value=jie(user.password);
        }
        hint.innerText= '用户没有课堂!';
        hint.style.display='block';
        button.style.opacity='0.5';
        button.classList.remove('btn');
        var reg=/(&|\?)result=\d/;
        url.value = window.location.href.replace(reg,'');
    }
    if(getUrlParams('result')=='2'){
        if(user.isRememberpassword){
            Right.className='q';}
        var user = JSON.parse(localStorage.getItem("isRememberpassword"));
        if(user){
            userphone.value=user.userphone;
            password.value=jie(user.password);
        }
        hint.innerText= '用户账号或密码错误!';
        hint.style.display='block';
        password.value='';
        password.focus();
        button.style.opacity='0.5';
        button.classList.remove('btn');
        var reg=/(&|\?)result=\d/;
        url.value = window.location.href.replace(reg,'');
        localStorage.removeItem("isRememberpassword");
    }


    button.onclick=function (e) {
        if(password.value===''){
            hint.innerText= '密码不能为空!';
            hint.style.display='block';
            /*e.target.value='';*/
            button.style.opacity='0.5';
            button.classList.remove('btn')
        }
        if(!userphone.value){
            hint.innerText= '用户名不能为空!';
            hint.style.display='block';
            /*e.target.value='';*/
            button.style.opacity='0.5';
            button.classList.remove('btn')
        }
        if(hint.style.display=='block'){
            return false
        }
        console.log(endtype,clientversion,companyid);
        if(Right.className=='q'){
            localStorage.setItem('isRememberpassword',JSON.stringify({isRememberpassword:1,userphone:userphone.value,password:jia(password.value)}))
        }
        if(Right.className=='p'){
            localStorage.setItem('isRememberpassword',JSON.stringify({isRememberpassword:0,userphone:userphone.value,password:jia(password.value)}))
        }

    };

    form.onsubmit=function () {
        if(hint.style.display=='block'){
            return false
        }else{
            return true
        }
    };

    userphone.onkeyup=function (e) {
        if(e.target.value.length=='11'){
            if (!(/^1[34578]\d{9}$/.test(e.target.value))) {
                hint.innerText= '用户名需为正确手机号!';
                hint.style.display='block';
                /*e.target.value='';*/
                button.style.opacity='0.5';
                button.classList.remove('btn')
            }else{
                hint.innerText= '';
                hint.style.display='none';
                button.style.opacity='1';
                button.classList.add('btn')
            }
        }
    };

    password.onkeydown=function (e) {
        clearTimeout(timer)
        timer=setTimeout(function () {
            if(e.keyCode=='13'){
                e.preventDefault();
                button.click()
            }
        },10)
    };

    password.onkeyup=function (e) {
        if(e.target.value){
            if (!(/^1[34578]\d{9}$/.test(userphone.value))) {
                hint.innerText= '用户名需为正确手机号!';
                hint.style.display='block';
                /*e.target.value='';*/
                button.style.opacity='0.5';
                button.classList.remove('btn')
            }else{
                hint.innerText= '';
                hint.style.display='none';
                button.style.opacity='1';
                button.classList.add('btn')
            }
        }

    }


    userphone.onblur=function (e) {
        if (!(/^1[34578]\d{9}$/.test(e.target.value))) {
            hint.innerText= '用户名需为正确手机号!';
            hint.style.display='block';
            /*e.target.value='';*/
            button.style.opacity='0.5';
            button.classList.remove('btn')
        }else{
            hint.innerText= '';
            hint.style.display='none';
            button.style.opacity='1';
            button.classList.add('btn')
        }
    }
}else{
    var user = JSON.parse(localStorage.getItem("isRememberpassword"));
    title.innerText='SWIC';
    h2.innerText='SWIC';
    userphone.setAttribute("placeholder","Please enter the phone number");
    password.setAttribute("placeholder","Please input your password");
    checkbox.innerText='Remember the password';
    button.value='Login';

    if(user){
        if(user.isRememberpassword){
            Right.className='q';
            userphone.value=user.userphone;
            password.value=jie(user.password);
        }
    }

    if(getUrlParams('result')=='1'){
        if(user.isRememberpassword){
            Right.className='q';}
        if(user){
            userphone.value=user.userphone;
            password.value=jie(user.password);
        }
        hint.innerText= 'There is no classroom for users!';
        hint.style.display='block';
        button.style.opacity='0.5';
        button.classList.remove('btn');
        var reg=/(&|\?)result=\d/;
        url.value = window.location.href.replace(reg,'');

    }
    if(getUrlParams('result')=='2'){
        if(user.isRememberpassword){
            Right.className='q';}
        var user = JSON.parse(localStorage.getItem("isRememberpassword"));
        if(user){
            userphone.value=user.userphone;
            password.value=jie(user.password);
        }
        hint.innerText= 'User account or password error!';
        hint.style.display='block';
        password.value='';
        password.focus();
        button.style.opacity='0.5';
        button.classList.remove('btn');
        var reg=/(&|\?)result=\d/;
        url.value = window.location.href.replace(reg,'');
        localStorage.removeItem("isRememberpassword");
    }


    button.onclick=function (e) {
        if(password.value===''){
            hint.innerText= 'The password can not be empty!';
            hint.style.display='block';
            /*e.target.value='';*/
            button.style.opacity='0.5';
            button.classList.remove('btn')
        }
        if(!userphone.value){
            hint.innerText= 'The username can not be empty!';
            hint.style.display='block';
            /*e.target.value='';*/
            button.style.opacity='0.5';
            button.classList.remove('btn')
        }
        if(hint.style.display=='block'){
            return false
        }
        console.log(endtype,clientversion,companyid);
        if(Right.className=='q'){
            localStorage.setItem('isRememberpassword',JSON.stringify({isRememberpassword:1,userphone:userphone.value,password:jia(password.value)}))
        }
        if(Right.className=='p'){
            localStorage.setItem('isRememberpassword',JSON.stringify({isRememberpassword:0,userphone:userphone.value,password:jia(password.value)}))
        }
    };

    form.onsubmit=function () {
        if(hint.style.display=='block'){
            return false
        }else{
            return true
        }
    }

    userphone.onkeyup=function (e) {
        if(e.target.value.length=='11'){
            if (!(/^1[34578]\d{9}$/.test(e.target.value))) {
                hint.innerText= 'The username needs to be the correct cell phone number!';
                hint.style.display='block';
                /*e.target.value='';*/
                button.style.opacity='0.5';
                button.classList.remove('btn')
            }else{
                hint.innerText= '';
                hint.style.display='none';
                button.style.opacity='1';
                button.classList.add('btn')
            }
        }
    }

    password.onkeydown=function (e) {
        clearTimeout(timer)
        timer=setTimeout(function () {
            if(e.keyCode=='13'){
                e.preventDefault();
                button.click()
            }
        },10)
    }

    password.onkeyup=function (e) {
        if(e.target.value){
            if (!(/^1[34578]\d{9}$/.test(userphone.value))) {
                hint.innerText= 'The username needs to be the correct cell phone number!';
                hint.style.display='block';
                /*e.target.value='';*/
                button.style.opacity='0.5';
                button.classList.remove('btn')
            }else{
                hint.innerText= '';
                hint.style.display='none';
                button.style.opacity='1';
                button.classList.add('btn')
            }
        }

    }


    userphone.onblur=function (e) {
        if (!(/^1[34578]\d{9}$/.test(e.target.value))) {
            hint.innerText= 'The username needs to be the correct cell phone number!';
            hint.style.display='block';
            /*e.target.value='';*/
            button.style.opacity='0.5';
            button.classList.remove('btn')
        }else{
            hint.innerText= '';
            hint.style.display='none';
            button.style.opacity='1';
            button.classList.add('btn')
        }
    }
}

