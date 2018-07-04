;(function () {
    var DEV = false ;
    var _getUrlParams = function(key){
        // var urlAdd = decodeURI(window.location.href);
        var urlAdd = decodeURIComponent(window.location.href);
        var urlIndex = urlAdd.indexOf("?");
        var urlSearch = urlAdd.substring(urlIndex + 1);
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");   //reg表示匹配出:$+url传参数名字=值+$,并且$可以不存在，这样会返回一个数组
        var arr = urlSearch.match(reg);
        if(arr != null) {
            return arr[2];
        } else {
            return "";
        }
    };
    if(window.__SDKDEV__ !== undefined && window.__SDKDEV__!== null && typeof window.__SDKDEV__ === 'boolean'){
        try{
            DEV = window.__SDKDEV__ ;
        }catch (e){
            DEV = false ;
        }
    }
    var debug = (DEV || _getUrlParams('debug') );
    window.__TkSdkBuild__ = !debug ;
    try{
        if(window.localStorage){
            var debugStr =  debug ? '*' : 'none';
            window.localStorage.setItem('debug' ,debugStr );
        }else{
            console.warn('[tk-sdk]window.localStorage is not exist!' );
        }
    }catch (err){
        console.warn('[tk-sdk]Browser does not support localStorage!'  );
    }
})();

!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.io=e():t.io=e()}(this,function(){return function(t){function e(r){if(n[r])return n[r].exports;var o=n[r]={exports:{},id:r,loaded:!1};return t[r].call(o.exports,o,o.exports,e),o.loaded=!0,o.exports}var n={};return e.m=t,e.c=n,e.p="",e(0)}([function(t,e,n){"use strict";function r(t,e){"object"===("undefined"==typeof t?"undefined":o(t))&&(e=t,t=void 0),e=e||{};var n,r=i(t),s=r.source,u=r.id,h=r.path,f=p[u]&&h in p[u].nsps,l=e.forceNew||e["force new connection"]||!1===e.multiplex||f;return l?(c("ignoring socket cache for %s",s),n=a(s,e)):(p[u]||(c("new io instance for %s",s),p[u]=a(s,e)),n=p[u]),r.query&&!e.query&&(e.query=r.query),n.socket(r.path,e)}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=n(1),s=n(7),a=n(13),c=n(3)("socket.io-client");t.exports=e=r;var p=e.managers={};e.protocol=s.protocol,e.connect=r,e.Manager=n(13),e.Socket=n(39)},function(t,e,n){(function(e){"use strict";function r(t,n){var r=t;n=n||e.location,null==t&&(t=n.protocol+"//"+n.host),"string"==typeof t&&("/"===t.charAt(0)&&(t="/"===t.charAt(1)?n.protocol+t:n.host+t),/^(https?|wss?):\/\//.test(t)||(i("protocol-less url %s",t),t="undefined"!=typeof n?n.protocol+"//"+t:"https://"+t),i("parse %s",t),r=o(t)),r.port||(/^(http|ws)$/.test(r.protocol)?r.port="80":/^(http|ws)s$/.test(r.protocol)&&(r.port="443")),r.path=r.path||"/";var s=r.host.indexOf(":")!==-1,a=s?"["+r.host+"]":r.host;return r.id=r.protocol+"://"+a+":"+r.port,r.href=r.protocol+"://"+a+(n&&n.port===r.port?"":":"+r.port),r}var o=n(2),i=n(3)("socket.io-client:url");t.exports=r}).call(e,function(){return this}())},function(t,e){var n=/^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,r=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];t.exports=function(t){var e=t,o=t.indexOf("["),i=t.indexOf("]");o!=-1&&i!=-1&&(t=t.substring(0,o)+t.substring(o,i).replace(/:/g,";")+t.substring(i,t.length));for(var s=n.exec(t||""),a={},c=14;c--;)a[r[c]]=s[c]||"";return o!=-1&&i!=-1&&(a.source=e,a.host=a.host.substring(1,a.host.length-1).replace(/;/g,":"),a.authority=a.authority.replace("[","").replace("]","").replace(/;/g,":"),a.ipv6uri=!0),a}},function(t,e,n){(function(r){function o(){return!("undefined"==typeof window||!window.process||"renderer"!==window.process.type)||("undefined"!=typeof document&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||"undefined"!=typeof window&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/))}function i(t){var n=this.useColors;if(t[0]=(n?"%c":"")+this.namespace+(n?" %c":" ")+t[0]+(n?"%c ":" ")+"+"+e.humanize(this.diff),n){var r="color: "+this.color;t.splice(1,0,r,"color: inherit");var o=0,i=0;t[0].replace(/%[a-zA-Z%]/g,function(t){"%%"!==t&&(o++,"%c"===t&&(i=o))}),t.splice(i,0,r)}}function s(){return"object"==typeof console&&console.log&&Function.prototype.apply.call(console.log,console,arguments)}function a(t){try{null==t?e.storage.removeItem("debug"):e.storage.debug=t}catch(n){}}function c(){var t;try{t=e.storage.debug}catch(n){}return!t&&"undefined"!=typeof r&&"env"in r&&(t=r.env.DEBUG),t}function p(){try{return window.localStorage}catch(t){}}e=t.exports=n(5),e.log=s,e.formatArgs=i,e.save=a,e.load=c,e.useColors=o,e.storage="undefined"!=typeof chrome&&"undefined"!=typeof chrome.storage?chrome.storage.local:p(),e.colors=["lightseagreen","forestgreen","goldenrod","dodgerblue","darkorchid","crimson"],e.formatters.j=function(t){try{return JSON.stringify(t)}catch(e){return"[UnexpectedJSONParseError]: "+e.message}},e.enable(c())}).call(e,n(4))},function(t,e){function n(){throw new Error("setTimeout has not been defined")}function r(){throw new Error("clearTimeout has not been defined")}function o(t){if(u===setTimeout)return setTimeout(t,0);if((u===n||!u)&&setTimeout)return u=setTimeout,setTimeout(t,0);try{return u(t,0)}catch(e){try{return u.call(null,t,0)}catch(e){return u.call(this,t,0)}}}function i(t){if(h===clearTimeout)return clearTimeout(t);if((h===r||!h)&&clearTimeout)return h=clearTimeout,clearTimeout(t);try{return h(t)}catch(e){try{return h.call(null,t)}catch(e){return h.call(this,t)}}}function s(){y&&l&&(y=!1,l.length?d=l.concat(d):m=-1,d.length&&a())}function a(){if(!y){var t=o(s);y=!0;for(var e=d.length;e;){for(l=d,d=[];++m<e;)l&&l[m].run();m=-1,e=d.length}l=null,y=!1,i(t)}}function c(t,e){this.fun=t,this.array=e}function p(){}var u,h,f=t.exports={};!function(){try{u="function"==typeof setTimeout?setTimeout:n}catch(t){u=n}try{h="function"==typeof clearTimeout?clearTimeout:r}catch(t){h=r}}();var l,d=[],y=!1,m=-1;f.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)e[n-1]=arguments[n];d.push(new c(t,e)),1!==d.length||y||o(a)},c.prototype.run=function(){this.fun.apply(null,this.array)},f.title="browser",f.browser=!0,f.env={},f.argv=[],f.version="",f.versions={},f.on=p,f.addListener=p,f.once=p,f.off=p,f.removeListener=p,f.removeAllListeners=p,f.emit=p,f.prependListener=p,f.prependOnceListener=p,f.listeners=function(t){return[]},f.binding=function(t){throw new Error("process.binding is not supported")},f.cwd=function(){return"/"},f.chdir=function(t){throw new Error("process.chdir is not supported")},f.umask=function(){return 0}},function(t,e,n){function r(t){var n,r=0;for(n in t)r=(r<<5)-r+t.charCodeAt(n),r|=0;return e.colors[Math.abs(r)%e.colors.length]}function o(t){function n(){if(n.enabled){var t=n,r=+new Date,o=r-(p||r);t.diff=o,t.prev=p,t.curr=r,p=r;for(var i=new Array(arguments.length),s=0;s<i.length;s++)i[s]=arguments[s];i[0]=e.coerce(i[0]),"string"!=typeof i[0]&&i.unshift("%O");var a=0;i[0]=i[0].replace(/%([a-zA-Z%])/g,function(n,r){if("%%"===n)return n;a++;var o=e.formatters[r];if("function"==typeof o){var s=i[a];n=o.call(t,s),i.splice(a,1),a--}return n}),e.formatArgs.call(t,i);var c=n.log||e.log||console.log.bind(console);c.apply(t,i)}}return n.namespace=t,n.enabled=e.enabled(t),n.useColors=e.useColors(),n.color=r(t),"function"==typeof e.init&&e.init(n),n}function i(t){e.save(t),e.names=[],e.skips=[];for(var n=("string"==typeof t?t:"").split(/[\s,]+/),r=n.length,o=0;o<r;o++)n[o]&&(t=n[o].replace(/\*/g,".*?"),"-"===t[0]?e.skips.push(new RegExp("^"+t.substr(1)+"$")):e.names.push(new RegExp("^"+t+"$")))}function s(){e.enable("")}function a(t){var n,r;for(n=0,r=e.skips.length;n<r;n++)if(e.skips[n].test(t))return!1;for(n=0,r=e.names.length;n<r;n++)if(e.names[n].test(t))return!0;return!1}function c(t){return t instanceof Error?t.stack||t.message:t}e=t.exports=o.debug=o["default"]=o,e.coerce=c,e.disable=s,e.enable=i,e.enabled=a,e.humanize=n(6),e.names=[],e.skips=[],e.formatters={};var p},function(t,e){function n(t){if(t=String(t),!(t.length>100)){var e=/^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(t);if(e){var n=parseFloat(e[1]),r=(e[2]||"ms").toLowerCase();switch(r){case"years":case"year":case"yrs":case"yr":case"y":return n*u;case"days":case"day":case"d":return n*p;case"hours":case"hour":case"hrs":case"hr":case"h":return n*c;case"minutes":case"minute":case"mins":case"min":case"m":return n*a;case"seconds":case"second":case"secs":case"sec":case"s":return n*s;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return n;default:return}}}}function r(t){return t>=p?Math.round(t/p)+"d":t>=c?Math.round(t/c)+"h":t>=a?Math.round(t/a)+"m":t>=s?Math.round(t/s)+"s":t+"ms"}function o(t){return i(t,p,"day")||i(t,c,"hour")||i(t,a,"minute")||i(t,s,"second")||t+" ms"}function i(t,e,n){if(!(t<e))return t<1.5*e?Math.floor(t/e)+" "+n:Math.ceil(t/e)+" "+n+"s"}var s=1e3,a=60*s,c=60*a,p=24*c,u=365.25*p;t.exports=function(t,e){e=e||{};var i=typeof t;if("string"===i&&t.length>0)return n(t);if("number"===i&&isNaN(t)===!1)return e["long"]?o(t):r(t);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(t))}},function(t,e,n){function r(){}function o(t){var n=""+t.type;return e.BINARY_EVENT!==t.type&&e.BINARY_ACK!==t.type||(n+=t.attachments+"-"),t.nsp&&"/"!==t.nsp&&(n+=t.nsp+","),null!=t.id&&(n+=t.id),null!=t.data&&(n+=JSON.stringify(t.data)),h("encoded %j as %s",t,n),n}function i(t,e){function n(t){var n=d.deconstructPacket(t),r=o(n.packet),i=n.buffers;i.unshift(r),e(i)}d.removeBlobs(t,n)}function s(){this.reconstructor=null}function a(t){var n=0,r={type:Number(t.charAt(0))};if(null==e.types[r.type])return u();if(e.BINARY_EVENT===r.type||e.BINARY_ACK===r.type){for(var o="";"-"!==t.charAt(++n)&&(o+=t.charAt(n),n!=t.length););if(o!=Number(o)||"-"!==t.charAt(n))throw new Error("Illegal attachments");r.attachments=Number(o)}if("/"===t.charAt(n+1))for(r.nsp="";++n;){var i=t.charAt(n);if(","===i)break;if(r.nsp+=i,n===t.length)break}else r.nsp="/";var s=t.charAt(n+1);if(""!==s&&Number(s)==s){for(r.id="";++n;){var i=t.charAt(n);if(null==i||Number(i)!=i){--n;break}if(r.id+=t.charAt(n),n===t.length)break}r.id=Number(r.id)}return t.charAt(++n)&&(r=c(r,t.substr(n))),h("decoded %s as %j",t,r),r}function c(t,e){try{t.data=JSON.parse(e)}catch(n){return u()}return t}function p(t){this.reconPack=t,this.buffers=[]}function u(){return{type:e.ERROR,data:"parser error"}}var h=n(3)("socket.io-parser"),f=n(8),l=n(9),d=n(11),y=n(12);e.protocol=4,e.types=["CONNECT","DISCONNECT","EVENT","ACK","ERROR","BINARY_EVENT","BINARY_ACK"],e.CONNECT=0,e.DISCONNECT=1,e.EVENT=2,e.ACK=3,e.ERROR=4,e.BINARY_EVENT=5,e.BINARY_ACK=6,e.Encoder=r,e.Decoder=s,r.prototype.encode=function(t,n){if(t.type!==e.EVENT&&t.type!==e.ACK||!l(t.data)||(t.type=t.type===e.EVENT?e.BINARY_EVENT:e.BINARY_ACK),h("encoding packet %j",t),e.BINARY_EVENT===t.type||e.BINARY_ACK===t.type)i(t,n);else{var r=o(t);n([r])}},f(s.prototype),s.prototype.add=function(t){var n;if("string"==typeof t)n=a(t),e.BINARY_EVENT===n.type||e.BINARY_ACK===n.type?(this.reconstructor=new p(n),0===this.reconstructor.reconPack.attachments&&this.emit("decoded",n)):this.emit("decoded",n);else{if(!y(t)&&!t.base64)throw new Error("Unknown type: "+t);if(!this.reconstructor)throw new Error("got binary data when not reconstructing a packet");n=this.reconstructor.takeBinaryData(t),n&&(this.reconstructor=null,this.emit("decoded",n))}},s.prototype.destroy=function(){this.reconstructor&&this.reconstructor.finishedReconstruction()},p.prototype.takeBinaryData=function(t){if(this.buffers.push(t),this.buffers.length===this.reconPack.attachments){var e=d.reconstructPacket(this.reconPack,this.buffers);return this.finishedReconstruction(),e}return null},p.prototype.finishedReconstruction=function(){this.reconPack=null,this.buffers=[]}},function(t,e,n){function r(t){if(t)return o(t)}function o(t){for(var e in r.prototype)t[e]=r.prototype[e];return t}t.exports=r,r.prototype.on=r.prototype.addEventListener=function(t,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+t]=this._callbacks["$"+t]||[]).push(e),this},r.prototype.once=function(t,e){function n(){this.off(t,n),e.apply(this,arguments)}return n.fn=e,this.on(t,n),this},r.prototype.off=r.prototype.removeListener=r.prototype.removeAllListeners=r.prototype.removeEventListener=function(t,e){if(this._callbacks=this._callbacks||{},0==arguments.length)return this._callbacks={},this;var n=this._callbacks["$"+t];if(!n)return this;if(1==arguments.length)return delete this._callbacks["$"+t],this;for(var r,o=0;o<n.length;o++)if(r=n[o],r===e||r.fn===e){n.splice(o,1);break}return this},r.prototype.emit=function(t){this._callbacks=this._callbacks||{};var e=[].slice.call(arguments,1),n=this._callbacks["$"+t];if(n){n=n.slice(0);for(var r=0,o=n.length;r<o;++r)n[r].apply(this,e)}return this},r.prototype.listeners=function(t){return this._callbacks=this._callbacks||{},this._callbacks["$"+t]||[]},r.prototype.hasListeners=function(t){return!!this.listeners(t).length}},function(t,e,n){(function(e){function r(t){if(!t||"object"!=typeof t)return!1;if(o(t)){for(var n=0,i=t.length;n<i;n++)if(r(t[n]))return!0;return!1}if("function"==typeof e.Buffer&&e.Buffer.isBuffer&&e.Buffer.isBuffer(t)||"function"==typeof e.ArrayBuffer&&t instanceof ArrayBuffer||s&&t instanceof Blob||a&&t instanceof File)return!0;if(t.toJSON&&"function"==typeof t.toJSON&&1===arguments.length)return r(t.toJSON(),!0);for(var c in t)if(Object.prototype.hasOwnProperty.call(t,c)&&r(t[c]))return!0;return!1}var o=n(10),i=Object.prototype.toString,s="function"==typeof e.Blob||"[object BlobConstructor]"===i.call(e.Blob),a="function"==typeof e.File||"[object FileConstructor]"===i.call(e.File);t.exports=r}).call(e,function(){return this}())},function(t,e){var n={}.toString;t.exports=Array.isArray||function(t){return"[object Array]"==n.call(t)}},function(t,e,n){(function(t){function r(t,e){if(!t)return t;if(s(t)){var n={_placeholder:!0,num:e.length};return e.push(t),n}if(i(t)){for(var o=new Array(t.length),a=0;a<t.length;a++)o[a]=r(t[a],e);return o}if("object"==typeof t&&!(t instanceof Date)){var o={};for(var c in t)o[c]=r(t[c],e);return o}return t}function o(t,e){if(!t)return t;if(t&&t._placeholder)return e[t.num];if(i(t))for(var n=0;n<t.length;n++)t[n]=o(t[n],e);else if("object"==typeof t)for(var r in t)t[r]=o(t[r],e);return t}var i=n(10),s=n(12),a=Object.prototype.toString,c="function"==typeof t.Blob||"[object BlobConstructor]"===a.call(t.Blob),p="function"==typeof t.File||"[object FileConstructor]"===a.call(t.File);e.deconstructPacket=function(t){var e=[],n=t.data,o=t;return o.data=r(n,e),o.attachments=e.length,{packet:o,buffers:e}},e.reconstructPacket=function(t,e){return t.data=o(t.data,e),t.attachments=void 0,t},e.removeBlobs=function(t,e){function n(t,a,u){if(!t)return t;if(c&&t instanceof Blob||p&&t instanceof File){r++;var h=new FileReader;h.onload=function(){u?u[a]=this.result:o=this.result,--r||e(o)},h.readAsArrayBuffer(t)}else if(i(t))for(var f=0;f<t.length;f++)n(t[f],f,t);else if("object"==typeof t&&!s(t))for(var l in t)n(t[l],l,t)}var r=0,o=t;n(o),r||e(o)}}).call(e,function(){return this}())},function(t,e){(function(e){function n(t){return e.Buffer&&e.Buffer.isBuffer(t)||e.ArrayBuffer&&t instanceof ArrayBuffer}t.exports=n}).call(e,function(){return this}())},function(t,e,n){"use strict";function r(t,e){if(!(this instanceof r))return new r(t,e);t&&"object"===("undefined"==typeof t?"undefined":o(t))&&(e=t,t=void 0),e=e||{},e.path=e.path||"/socket.io",this.nsps={},this.subs=[],this.opts=e,this.reconnection(e.reconnection!==!1),this.reconnectionAttempts(e.reconnectionAttempts||1/0),this.reconnectionDelay(e.reconnectionDelay||1e3),this.reconnectionDelayMax(e.reconnectionDelayMax||5e3),this.randomizationFactor(e.randomizationFactor||.5),this.backoff=new l({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(null==e.timeout?2e4:e.timeout),this.readyState="closed",this.uri=t,this.connecting=[],this.lastPing=null,this.encoding=!1,this.packetBuffer=[];var n=e.parser||c;this.encoder=new n.Encoder,this.decoder=new n.Decoder,this.autoConnect=e.autoConnect!==!1,this.autoConnect&&this.open()}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=n(14),s=n(39),a=n(8),c=n(7),p=n(41),u=n(42),h=n(3)("socket.io-client:manager"),f=n(37),l=n(43),d=Object.prototype.hasOwnProperty;t.exports=r,r.prototype.emitAll=function(){this.emit.apply(this,arguments);for(var t in this.nsps)d.call(this.nsps,t)&&this.nsps[t].emit.apply(this.nsps[t],arguments)},r.prototype.updateSocketIds=function(){for(var t in this.nsps)d.call(this.nsps,t)&&(this.nsps[t].id=this.generateId(t))},r.prototype.generateId=function(t){return("/"===t?"":t+"#")+this.engine.id},a(r.prototype),r.prototype.reconnection=function(t){return arguments.length?(this._reconnection=!!t,this):this._reconnection},r.prototype.reconnectionAttempts=function(t){return arguments.length?(this._reconnectionAttempts=t,this):this._reconnectionAttempts},r.prototype.reconnectionDelay=function(t){return arguments.length?(this._reconnectionDelay=t,this.backoff&&this.backoff.setMin(t),this):this._reconnectionDelay},r.prototype.randomizationFactor=function(t){return arguments.length?(this._randomizationFactor=t,this.backoff&&this.backoff.setJitter(t),this):this._randomizationFactor},r.prototype.reconnectionDelayMax=function(t){return arguments.length?(this._reconnectionDelayMax=t,this.backoff&&this.backoff.setMax(t),this):this._reconnectionDelayMax},r.prototype.timeout=function(t){return arguments.length?(this._timeout=t,this):this._timeout},r.prototype.maybeReconnectOnOpen=function(){!this.reconnecting&&this._reconnection&&0===this.backoff.attempts&&this.reconnect()},r.prototype.open=r.prototype.connect=function(t,e){if(h("readyState %s",this.readyState),~this.readyState.indexOf("open"))return this;h("opening %s",this.uri),this.engine=i(this.uri,this.opts);var n=this.engine,r=this;this.readyState="opening",this.skipReconnect=!1;var o=p(n,"open",function(){r.onopen(),t&&t()}),s=p(n,"error",function(e){if(h("connect_error"),r.cleanup(),r.readyState="closed",r.emitAll("connect_error",e),t){var n=new Error("Connection error");n.data=e,t(n)}else r.maybeReconnectOnOpen()});if(!1!==this._timeout){var a=this._timeout;h("connect attempt will timeout after %d",a);var c=setTimeout(function(){h("connect attempt timed out after %d",a),o.destroy(),n.close(),n.emit("error","timeout"),r.emitAll("connect_timeout",a)},a);this.subs.push({destroy:function(){clearTimeout(c)}})}return this.subs.push(o),this.subs.push(s),this},r.prototype.onopen=function(){h("open"),this.cleanup(),this.readyState="open",this.emit("open");var t=this.engine;this.subs.push(p(t,"data",u(this,"ondata"))),this.subs.push(p(t,"ping",u(this,"onping"))),this.subs.push(p(t,"pong",u(this,"onpong"))),this.subs.push(p(t,"error",u(this,"onerror"))),this.subs.push(p(t,"close",u(this,"onclose"))),this.subs.push(p(this.decoder,"decoded",u(this,"ondecoded")))},r.prototype.onping=function(){this.lastPing=new Date,this.emitAll("ping")},r.prototype.onpong=function(){this.emitAll("pong",new Date-this.lastPing)},r.prototype.ondata=function(t){this.decoder.add(t)},r.prototype.ondecoded=function(t){this.emit("packet",t)},r.prototype.onerror=function(t){h("error",t),this.emitAll("error",t)},r.prototype.socket=function(t,e){function n(){~f(o.connecting,r)||o.connecting.push(r)}var r=this.nsps[t];if(!r){r=new s(this,t,e),this.nsps[t]=r;var o=this;r.on("connecting",n),r.on("connect",function(){r.id=o.generateId(t)}),this.autoConnect&&n()}return r},r.prototype.destroy=function(t){var e=f(this.connecting,t);~e&&this.connecting.splice(e,1),this.connecting.length||this.close()},r.prototype.packet=function(t){h("writing packet %j",t);var e=this;t.query&&0===t.type&&(t.nsp+="?"+t.query),e.encoding?e.packetBuffer.push(t):(e.encoding=!0,this.encoder.encode(t,function(n){for(var r=0;r<n.length;r++)e.engine.write(n[r],t.options);e.encoding=!1,e.processPacketQueue()}))},r.prototype.processPacketQueue=function(){if(this.packetBuffer.length>0&&!this.encoding){var t=this.packetBuffer.shift();this.packet(t)}},r.prototype.cleanup=function(){h("cleanup");for(var t=this.subs.length,e=0;e<t;e++){var n=this.subs.shift();n.destroy()}this.packetBuffer=[],this.encoding=!1,this.lastPing=null,this.decoder.destroy()},r.prototype.close=r.prototype.disconnect=function(){h("disconnect"),this.skipReconnect=!0,this.reconnecting=!1,"opening"===this.readyState&&this.cleanup(),this.backoff.reset(),this.readyState="closed",this.engine&&this.engine.close()},r.prototype.onclose=function(t){h("onclose"),this.cleanup(),this.backoff.reset(),this.readyState="closed",this.emit("close",t),this._reconnection&&!this.skipReconnect&&this.reconnect()},r.prototype.reconnect=function(){if(this.reconnecting||this.skipReconnect)return this;var t=this;if(this.backoff.attempts>=this._reconnectionAttempts)h("reconnect failed"),this.backoff.reset(),this.emitAll("reconnect_failed"),this.reconnecting=!1;else{var e=this.backoff.duration();h("will wait %dms before reconnect attempt",e),this.reconnecting=!0;var n=setTimeout(function(){t.skipReconnect||(h("attempting reconnect"),t.emitAll("reconnect_attempt",t.backoff.attempts),t.emitAll("reconnecting",t.backoff.attempts),t.skipReconnect||t.open(function(e){e?(h("reconnect attempt error"),t.reconnecting=!1,t.reconnect(),t.emitAll("reconnect_error",e.data)):(h("reconnect success"),t.onreconnect())}))},e);this.subs.push({destroy:function(){clearTimeout(n)}})}},r.prototype.onreconnect=function(){var t=this.backoff.attempts;this.reconnecting=!1,this.backoff.reset(),this.updateSocketIds(),this.emitAll("reconnect",t)}},function(t,e,n){t.exports=n(15)},function(t,e,n){t.exports=n(16),t.exports.parser=n(23)},function(t,e,n){(function(e){function r(t,n){if(!(this instanceof r))return new r(t,n);n=n||{},t&&"object"==typeof t&&(n=t,t=null),t?(t=u(t),n.hostname=t.host,n.secure="https"===t.protocol||"wss"===t.protocol,n.port=t.port,t.query&&(n.query=t.query)):n.host&&(n.hostname=u(n.host).host),this.secure=null!=n.secure?n.secure:e.location&&"https:"===location.protocol,n.hostname&&!n.port&&(n.port=this.secure?"443":"80"),this.agent=n.agent||!1,this.hostname=n.hostname||(e.location?location.hostname:"localhost"),this.port=n.port||(e.location&&location.port?location.port:this.secure?443:80),this.query=n.query||{},"string"==typeof this.query&&(this.query=f.decode(this.query)),this.upgrade=!1!==n.upgrade,this.path=(n.path||"/engine.io").replace(/\/$/,"")+"/",this.forceJSONP=!!n.forceJSONP,this.jsonp=!1!==n.jsonp,this.forceBase64=!!n.forceBase64,this.enablesXDR=!!n.enablesXDR,this.timestampParam=n.timestampParam||"t",this.timestampRequests=n.timestampRequests,this.transports=n.transports||["polling","websocket"],this.transportOptions=n.transportOptions||{},this.readyState="",this.writeBuffer=[],this.prevBufferLen=0,this.policyPort=n.policyPort||843,this.rememberUpgrade=n.rememberUpgrade||!1,this.binaryType=null,this.onlyBinaryUpgrades=n.onlyBinaryUpgrades,this.perMessageDeflate=!1!==n.perMessageDeflate&&(n.perMessageDeflate||{}),!0===this.perMessageDeflate&&(this.perMessageDeflate={}),this.perMessageDeflate&&null==this.perMessageDeflate.threshold&&(this.perMessageDeflate.threshold=1024),this.pfx=n.pfx||null,this.key=n.key||null,this.passphrase=n.passphrase||null,this.cert=n.cert||null,this.ca=n.ca||null,this.ciphers=n.ciphers||null,this.rejectUnauthorized=void 0===n.rejectUnauthorized||n.rejectUnauthorized,this.forceNode=!!n.forceNode;var o="object"==typeof e&&e;o.global===o&&(n.extraHeaders&&Object.keys(n.extraHeaders).length>0&&(this.extraHeaders=n.extraHeaders),n.localAddress&&(this.localAddress=n.localAddress)),this.id=null,this.upgrades=null,this.pingInterval=null,this.pingTimeout=null,this.pingIntervalTimer=null,this.pingTimeoutTimer=null,this.open()}function o(t){var e={};for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n]);return e}var i=n(17),s=n(8),a=n(3)("engine.io-client:socket"),c=n(37),p=n(23),u=n(2),h=n(38),f=n(31);t.exports=r,r.priorWebsocketSuccess=!1,s(r.prototype),r.protocol=p.protocol,r.Socket=r,r.Transport=n(22),r.transports=n(17),r.parser=n(23),r.prototype.createTransport=function(t){a('creating transport "%s"',t);var e=o(this.query);e.EIO=p.protocol,e.transport=t;var n=this.transportOptions[t]||{};this.id&&(e.sid=this.id);var r=new i[t]({query:e,socket:this,agent:n.agent||this.agent,hostname:n.hostname||this.hostname,port:n.port||this.port,secure:n.secure||this.secure,path:n.path||this.path,forceJSONP:n.forceJSONP||this.forceJSONP,jsonp:n.jsonp||this.jsonp,forceBase64:n.forceBase64||this.forceBase64,enablesXDR:n.enablesXDR||this.enablesXDR,timestampRequests:n.timestampRequests||this.timestampRequests,timestampParam:n.timestampParam||this.timestampParam,policyPort:n.policyPort||this.policyPort,pfx:n.pfx||this.pfx,key:n.key||this.key,passphrase:n.passphrase||this.passphrase,cert:n.cert||this.cert,ca:n.ca||this.ca,ciphers:n.ciphers||this.ciphers,rejectUnauthorized:n.rejectUnauthorized||this.rejectUnauthorized,perMessageDeflate:n.perMessageDeflate||this.perMessageDeflate,extraHeaders:n.extraHeaders||this.extraHeaders,forceNode:n.forceNode||this.forceNode,localAddress:n.localAddress||this.localAddress,requestTimeout:n.requestTimeout||this.requestTimeout,protocols:n.protocols||void 0});return r},r.prototype.open=function(){var t;if(this.rememberUpgrade&&r.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1)t="websocket";else{if(0===this.transports.length){var e=this;return void setTimeout(function(){e.emit("error","No transports available")},0)}t=this.transports[0]}this.readyState="opening";try{t=this.createTransport(t)}catch(n){return this.transports.shift(),void this.open()}t.open(),this.setTransport(t)},r.prototype.setTransport=function(t){a("setting transport %s",t.name);var e=this;this.transport&&(a("clearing existing transport %s",this.transport.name),this.transport.removeAllListeners()),this.transport=t,t.on("drain",function(){e.onDrain()}).on("packet",function(t){e.onPacket(t)}).on("error",function(t){e.onError(t)}).on("close",function(){e.onClose("transport close")})},r.prototype.probe=function(t){function e(){if(f.onlyBinaryUpgrades){var e=!this.supportsBinary&&f.transport.supportsBinary;h=h||e}h||(a('probe transport "%s" opened',t),u.send([{type:"ping",data:"probe"}]),u.once("packet",function(e){if(!h)if("pong"===e.type&&"probe"===e.data){if(a('probe transport "%s" pong',t),f.upgrading=!0,f.emit("upgrading",u),!u)return;r.priorWebsocketSuccess="websocket"===u.name,a('pausing current transport "%s"',f.transport.name),f.transport.pause(function(){h||"closed"!==f.readyState&&(a("changing transport and sending upgrade packet"),p(),f.setTransport(u),u.send([{type:"upgrade"}]),f.emit("upgrade",u),u=null,f.upgrading=!1,f.flush())})}else{a('probe transport "%s" failed',t);var n=new Error("probe error");n.transport=u.name,f.emit("upgradeError",n)}}))}function n(){h||(h=!0,p(),u.close(),u=null)}function o(e){var r=new Error("probe error: "+e);r.transport=u.name,n(),a('probe transport "%s" failed because of error: %s',t,e),f.emit("upgradeError",r)}function i(){o("transport closed")}function s(){o("socket closed")}function c(t){u&&t.name!==u.name&&(a('"%s" works - aborting "%s"',t.name,u.name),n())}function p(){u.removeListener("open",e),u.removeListener("error",o),u.removeListener("close",i),f.removeListener("close",s),f.removeListener("upgrading",c)}a('probing transport "%s"',t);var u=this.createTransport(t,{probe:1}),h=!1,f=this;r.priorWebsocketSuccess=!1,u.once("open",e),u.once("error",o),u.once("close",i),this.once("close",s),this.once("upgrading",c),u.open()},r.prototype.onOpen=function(){if(a("socket open"),this.readyState="open",r.priorWebsocketSuccess="websocket"===this.transport.name,this.emit("open"),this.flush(),"open"===this.readyState&&this.upgrade&&this.transport.pause){a("starting upgrade probes");for(var t=0,e=this.upgrades.length;t<e;t++)this.probe(this.upgrades[t])}},r.prototype.onPacket=function(t){if("opening"===this.readyState||"open"===this.readyState||"closing"===this.readyState)switch(a('socket receive: type "%s", data "%s"',t.type,t.data),this.emit("packet",t),this.emit("heartbeat"),t.type){case"open":this.onHandshake(h(t.data));break;case"pong":this.setPing(),this.emit("pong");break;case"error":var e=new Error("server error");e.code=t.data,this.onError(e);break;case"message":this.emit("data",t.data),this.emit("message",t.data)}else a('packet received with socket readyState "%s"',this.readyState)},r.prototype.onHandshake=function(t){this.emit("handshake",t),this.id=t.sid,this.transport.query.sid=t.sid,this.upgrades=this.filterUpgrades(t.upgrades),this.pingInterval=t.pingInterval,this.pingTimeout=t.pingTimeout,this.onOpen(),"closed"!==this.readyState&&(this.setPing(),this.removeListener("heartbeat",this.onHeartbeat),this.on("heartbeat",this.onHeartbeat))},r.prototype.onHeartbeat=function(t){clearTimeout(this.pingTimeoutTimer);var e=this;e.pingTimeoutTimer=setTimeout(function(){"closed"!==e.readyState&&e.onClose("ping timeout")},t||e.pingInterval+e.pingTimeout)},r.prototype.setPing=function(){var t=this;clearTimeout(t.pingIntervalTimer),t.pingIntervalTimer=setTimeout(function(){a("writing ping packet - expecting pong within %sms",t.pingTimeout),t.ping(),t.onHeartbeat(t.pingTimeout)},t.pingInterval)},r.prototype.ping=function(){var t=this;this.sendPacket("ping",function(){t.emit("ping")})},r.prototype.onDrain=function(){this.writeBuffer.splice(0,this.prevBufferLen),this.prevBufferLen=0,0===this.writeBuffer.length?this.emit("drain"):this.flush()},r.prototype.flush=function(){"closed"!==this.readyState&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length&&(a("flushing %d packets in socket",this.writeBuffer.length),this.transport.send(this.writeBuffer),this.prevBufferLen=this.writeBuffer.length,this.emit("flush"))},r.prototype.write=r.prototype.send=function(t,e,n){return this.sendPacket("message",t,e,n),this},r.prototype.sendPacket=function(t,e,n,r){if("function"==typeof e&&(r=e,e=void 0),"function"==typeof n&&(r=n,n=null),"closing"!==this.readyState&&"closed"!==this.readyState){n=n||{},n.compress=!1!==n.compress;var o={type:t,data:e,options:n};this.emit("packetCreate",o),this.writeBuffer.push(o),r&&this.once("flush",r),this.flush()}},r.prototype.close=function(){function t(){r.onClose("forced close"),a("socket closing - telling transport to close"),r.transport.close()}function e(){r.removeListener("upgrade",e),r.removeListener("upgradeError",e),t()}function n(){r.once("upgrade",e),r.once("upgradeError",e)}if("opening"===this.readyState||"open"===this.readyState){this.readyState="closing";var r=this;this.writeBuffer.length?this.once("drain",function(){this.upgrading?n():t()}):this.upgrading?n():t()}return this},r.prototype.onError=function(t){a("socket error %j",t),r.priorWebsocketSuccess=!1,this.emit("error",t),this.onClose("transport error",t)},r.prototype.onClose=function(t,e){if("opening"===this.readyState||"open"===this.readyState||"closing"===this.readyState){a('socket close with reason: "%s"',t);var n=this;clearTimeout(this.pingIntervalTimer),clearTimeout(this.pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),this.readyState="closed",this.id=null,this.emit("close",t,e),n.writeBuffer=[],n.prevBufferLen=0}},r.prototype.filterUpgrades=function(t){for(var e=[],n=0,r=t.length;n<r;n++)~c(this.transports,t[n])&&e.push(t[n]);return e}}).call(e,function(){return this}())},function(t,e,n){(function(t){function r(e){var n,r=!1,a=!1,c=!1!==e.jsonp;if(t.location){var p="https:"===location.protocol,u=location.port;u||(u=p?443:80),r=e.hostname!==location.hostname||u!==e.port,a=e.secure!==p}if(e.xdomain=r,e.xscheme=a,n=new o(e),"open"in n&&!e.forceJSONP)return new i(e);if(!c)throw new Error("JSONP disabled");return new s(e)}var o=n(18),i=n(20),s=n(34),a=n(35);e.polling=r,e.websocket=a}).call(e,function(){return this}())},function(t,e,n){(function(e){var r=n(19);t.exports=function(t){var n=t.xdomain,o=t.xscheme,i=t.enablesXDR;try{if("undefined"!=typeof XMLHttpRequest&&(!n||r))return new XMLHttpRequest}catch(s){}try{if("undefined"!=typeof XDomainRequest&&!o&&i)return new XDomainRequest}catch(s){}if(!n)try{
return new(e[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")}catch(s){}}}).call(e,function(){return this}())},function(t,e){try{t.exports="undefined"!=typeof XMLHttpRequest&&"withCredentials"in new XMLHttpRequest}catch(n){t.exports=!1}},function(t,e,n){(function(e){function r(){}function o(t){if(c.call(this,t),this.requestTimeout=t.requestTimeout,this.extraHeaders=t.extraHeaders,e.location){var n="https:"===location.protocol,r=location.port;r||(r=n?443:80),this.xd=t.hostname!==e.location.hostname||r!==t.port,this.xs=t.secure!==n}}function i(t){this.method=t.method||"GET",this.uri=t.uri,this.xd=!!t.xd,this.xs=!!t.xs,this.async=!1!==t.async,this.data=void 0!==t.data?t.data:null,this.agent=t.agent,this.isBinary=t.isBinary,this.supportsBinary=t.supportsBinary,this.enablesXDR=t.enablesXDR,this.requestTimeout=t.requestTimeout,this.pfx=t.pfx,this.key=t.key,this.passphrase=t.passphrase,this.cert=t.cert,this.ca=t.ca,this.ciphers=t.ciphers,this.rejectUnauthorized=t.rejectUnauthorized,this.extraHeaders=t.extraHeaders,this.create()}function s(){for(var t in i.requests)i.requests.hasOwnProperty(t)&&i.requests[t].abort()}var a=n(18),c=n(21),p=n(8),u=n(32),h=n(3)("engine.io-client:polling-xhr");t.exports=o,t.exports.Request=i,u(o,c),o.prototype.supportsBinary=!0,o.prototype.request=function(t){return t=t||{},t.uri=this.uri(),t.xd=this.xd,t.xs=this.xs,t.agent=this.agent||!1,t.supportsBinary=this.supportsBinary,t.enablesXDR=this.enablesXDR,t.pfx=this.pfx,t.key=this.key,t.passphrase=this.passphrase,t.cert=this.cert,t.ca=this.ca,t.ciphers=this.ciphers,t.rejectUnauthorized=this.rejectUnauthorized,t.requestTimeout=this.requestTimeout,t.extraHeaders=this.extraHeaders,new i(t)},o.prototype.doWrite=function(t,e){var n="string"!=typeof t&&void 0!==t,r=this.request({method:"POST",data:t,isBinary:n}),o=this;r.on("success",e),r.on("error",function(t){o.onError("xhr post error",t)}),this.sendXhr=r},o.prototype.doPoll=function(){h("xhr poll");var t=this.request(),e=this;t.on("data",function(t){e.onData(t)}),t.on("error",function(t){e.onError("xhr poll error",t)}),this.pollXhr=t},p(i.prototype),i.prototype.create=function(){var t={agent:this.agent,xdomain:this.xd,xscheme:this.xs,enablesXDR:this.enablesXDR};t.pfx=this.pfx,t.key=this.key,t.passphrase=this.passphrase,t.cert=this.cert,t.ca=this.ca,t.ciphers=this.ciphers,t.rejectUnauthorized=this.rejectUnauthorized;var n=this.xhr=new a(t),r=this;try{h("xhr open %s: %s",this.method,this.uri),n.open(this.method,this.uri,this.async);try{if(this.extraHeaders){n.setDisableHeaderCheck&&n.setDisableHeaderCheck(!0);for(var o in this.extraHeaders)this.extraHeaders.hasOwnProperty(o)&&n.setRequestHeader(o,this.extraHeaders[o])}}catch(s){}if("POST"===this.method)try{this.isBinary?n.setRequestHeader("Content-type","application/octet-stream"):n.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch(s){}try{n.setRequestHeader("Accept","*/*")}catch(s){}"withCredentials"in n&&(n.withCredentials=!0),this.requestTimeout&&(n.timeout=this.requestTimeout),this.hasXDR()?(n.onload=function(){r.onLoad()},n.onerror=function(){r.onError(n.responseText)}):n.onreadystatechange=function(){if(2===n.readyState){var t;try{t=n.getResponseHeader("Content-Type")}catch(e){}"application/octet-stream"===t&&(n.responseType="arraybuffer")}4===n.readyState&&(200===n.status||1223===n.status?r.onLoad():setTimeout(function(){r.onError(n.status)},0))},h("xhr data %s",this.data),n.send(this.data)}catch(s){return void setTimeout(function(){r.onError(s)},0)}e.document&&(this.index=i.requestsCount++,i.requests[this.index]=this)},i.prototype.onSuccess=function(){this.emit("success"),this.cleanup()},i.prototype.onData=function(t){this.emit("data",t),this.onSuccess()},i.prototype.onError=function(t){this.emit("error",t),this.cleanup(!0)},i.prototype.cleanup=function(t){if("undefined"!=typeof this.xhr&&null!==this.xhr){if(this.hasXDR()?this.xhr.onload=this.xhr.onerror=r:this.xhr.onreadystatechange=r,t)try{this.xhr.abort()}catch(n){}e.document&&delete i.requests[this.index],this.xhr=null}},i.prototype.onLoad=function(){var t;try{var e;try{e=this.xhr.getResponseHeader("Content-Type")}catch(n){}t="application/octet-stream"===e?this.xhr.response||this.xhr.responseText:this.xhr.responseText}catch(n){this.onError(n)}null!=t&&this.onData(t)},i.prototype.hasXDR=function(){return"undefined"!=typeof e.XDomainRequest&&!this.xs&&this.enablesXDR},i.prototype.abort=function(){this.cleanup()},i.requestsCount=0,i.requests={},e.document&&(e.attachEvent?e.attachEvent("onunload",s):e.addEventListener&&e.addEventListener("beforeunload",s,!1))}).call(e,function(){return this}())},function(t,e,n){function r(t){var e=t&&t.forceBase64;u&&!e||(this.supportsBinary=!1),o.call(this,t)}var o=n(22),i=n(31),s=n(23),a=n(32),c=n(33),p=n(3)("engine.io-client:polling");t.exports=r;var u=function(){var t=n(18),e=new t({xdomain:!1});return null!=e.responseType}();a(r,o),r.prototype.name="polling",r.prototype.doOpen=function(){this.poll()},r.prototype.pause=function(t){function e(){p("paused"),n.readyState="paused",t()}var n=this;if(this.readyState="pausing",this.polling||!this.writable){var r=0;this.polling&&(p("we are currently polling - waiting to pause"),r++,this.once("pollComplete",function(){p("pre-pause polling complete"),--r||e()})),this.writable||(p("we are currently writing - waiting to pause"),r++,this.once("drain",function(){p("pre-pause writing complete"),--r||e()}))}else e()},r.prototype.poll=function(){p("polling"),this.polling=!0,this.doPoll(),this.emit("poll")},r.prototype.onData=function(t){var e=this;p("polling got data %s",t);var n=function(t,n,r){return"opening"===e.readyState&&e.onOpen(),"close"===t.type?(e.onClose(),!1):void e.onPacket(t)};s.decodePayload(t,this.socket.binaryType,n),"closed"!==this.readyState&&(this.polling=!1,this.emit("pollComplete"),"open"===this.readyState?this.poll():p('ignoring poll - transport state "%s"',this.readyState))},r.prototype.doClose=function(){function t(){p("writing close packet"),e.write([{type:"close"}])}var e=this;"open"===this.readyState?(p("transport open - closing"),t()):(p("transport not open - deferring close"),this.once("open",t))},r.prototype.write=function(t){var e=this;this.writable=!1;var n=function(){e.writable=!0,e.emit("drain")};s.encodePayload(t,this.supportsBinary,function(t){e.doWrite(t,n)})},r.prototype.uri=function(){var t=this.query||{},e=this.secure?"https":"http",n="";!1!==this.timestampRequests&&(t[this.timestampParam]=c()),this.supportsBinary||t.sid||(t.b64=1),t=i.encode(t),this.port&&("https"===e&&443!==Number(this.port)||"http"===e&&80!==Number(this.port))&&(n=":"+this.port),t.length&&(t="?"+t);var r=this.hostname.indexOf(":")!==-1;return e+"://"+(r?"["+this.hostname+"]":this.hostname)+n+this.path+t}},function(t,e,n){function r(t){this.path=t.path,this.hostname=t.hostname,this.port=t.port,this.secure=t.secure,this.query=t.query,this.timestampParam=t.timestampParam,this.timestampRequests=t.timestampRequests,this.readyState="",this.agent=t.agent||!1,this.socket=t.socket,this.enablesXDR=t.enablesXDR,this.pfx=t.pfx,this.key=t.key,this.passphrase=t.passphrase,this.cert=t.cert,this.ca=t.ca,this.ciphers=t.ciphers,this.rejectUnauthorized=t.rejectUnauthorized,this.forceNode=t.forceNode,this.extraHeaders=t.extraHeaders,this.localAddress=t.localAddress}var o=n(23),i=n(8);t.exports=r,i(r.prototype),r.prototype.onError=function(t,e){var n=new Error(t);return n.type="TransportError",n.description=e,this.emit("error",n),this},r.prototype.open=function(){return"closed"!==this.readyState&&""!==this.readyState||(this.readyState="opening",this.doOpen()),this},r.prototype.close=function(){return"opening"!==this.readyState&&"open"!==this.readyState||(this.doClose(),this.onClose()),this},r.prototype.send=function(t){if("open"!==this.readyState)throw new Error("Transport not open");this.write(t)},r.prototype.onOpen=function(){this.readyState="open",this.writable=!0,this.emit("open")},r.prototype.onData=function(t){var e=o.decodePacket(t,this.socket.binaryType);this.onPacket(e)},r.prototype.onPacket=function(t){this.emit("packet",t)},r.prototype.onClose=function(){this.readyState="closed",this.emit("close")}},function(t,e,n){(function(t){function r(t,n){var r="b"+e.packets[t.type]+t.data.data;return n(r)}function o(t,n,r){if(!n)return e.encodeBase64Packet(t,r);var o=t.data,i=new Uint8Array(o),s=new Uint8Array(1+o.byteLength);s[0]=v[t.type];for(var a=0;a<i.length;a++)s[a+1]=i[a];return r(s.buffer)}function i(t,n,r){if(!n)return e.encodeBase64Packet(t,r);var o=new FileReader;return o.onload=function(){t.data=o.result,e.encodePacket(t,n,!0,r)},o.readAsArrayBuffer(t.data)}function s(t,n,r){if(!n)return e.encodeBase64Packet(t,r);if(g)return i(t,n,r);var o=new Uint8Array(1);o[0]=v[t.type];var s=new k([o.buffer,t.data]);return r(s)}function a(t){try{t=d.decode(t,{strict:!1})}catch(e){return!1}return t}function c(t,e,n){for(var r=new Array(t.length),o=l(t.length,n),i=function(t,n,o){e(n,function(e,n){r[t]=n,o(e,r)})},s=0;s<t.length;s++)i(s,t[s],o)}var p,u=n(24),h=n(9),f=n(25),l=n(26),d=n(27);t&&t.ArrayBuffer&&(p=n(29));var y="undefined"!=typeof navigator&&/Android/i.test(navigator.userAgent),m="undefined"!=typeof navigator&&/PhantomJS/i.test(navigator.userAgent),g=y||m;e.protocol=3;var v=e.packets={open:0,close:1,ping:2,pong:3,message:4,upgrade:5,noop:6},b=u(v),w={type:"error",data:"parser error"},k=n(30);e.encodePacket=function(e,n,i,a){"function"==typeof n&&(a=n,n=!1),"function"==typeof i&&(a=i,i=null);var c=void 0===e.data?void 0:e.data.buffer||e.data;if(t.ArrayBuffer&&c instanceof ArrayBuffer)return o(e,n,a);if(k&&c instanceof t.Blob)return s(e,n,a);if(c&&c.base64)return r(e,a);var p=v[e.type];return void 0!==e.data&&(p+=i?d.encode(String(e.data),{strict:!1}):String(e.data)),a(""+p)},e.encodeBase64Packet=function(n,r){var o="b"+e.packets[n.type];if(k&&n.data instanceof t.Blob){var i=new FileReader;return i.onload=function(){var t=i.result.split(",")[1];r(o+t)},i.readAsDataURL(n.data)}var s;try{s=String.fromCharCode.apply(null,new Uint8Array(n.data))}catch(a){for(var c=new Uint8Array(n.data),p=new Array(c.length),u=0;u<c.length;u++)p[u]=c[u];s=String.fromCharCode.apply(null,p)}return o+=t.btoa(s),r(o)},e.decodePacket=function(t,n,r){if(void 0===t)return w;if("string"==typeof t){if("b"===t.charAt(0))return e.decodeBase64Packet(t.substr(1),n);if(r&&(t=a(t),t===!1))return w;var o=t.charAt(0);return Number(o)==o&&b[o]?t.length>1?{type:b[o],data:t.substring(1)}:{type:b[o]}:w}var i=new Uint8Array(t),o=i[0],s=f(t,1);return k&&"blob"===n&&(s=new k([s])),{type:b[o],data:s}},e.decodeBase64Packet=function(t,e){var n=b[t.charAt(0)];if(!p)return{type:n,data:{base64:!0,data:t.substr(1)}};var r=p.decode(t.substr(1));return"blob"===e&&k&&(r=new k([r])),{type:n,data:r}},e.encodePayload=function(t,n,r){function o(t){return t.length+":"+t}function i(t,r){e.encodePacket(t,!!s&&n,!1,function(t){r(null,o(t))})}"function"==typeof n&&(r=n,n=null);var s=h(t);return n&&s?k&&!g?e.encodePayloadAsBlob(t,r):e.encodePayloadAsArrayBuffer(t,r):t.length?void c(t,i,function(t,e){return r(e.join(""))}):r("0:")},e.decodePayload=function(t,n,r){if("string"!=typeof t)return e.decodePayloadAsBinary(t,n,r);"function"==typeof n&&(r=n,n=null);var o;if(""===t)return r(w,0,1);for(var i,s,a="",c=0,p=t.length;c<p;c++){var u=t.charAt(c);if(":"===u){if(""===a||a!=(i=Number(a)))return r(w,0,1);if(s=t.substr(c+1,i),a!=s.length)return r(w,0,1);if(s.length){if(o=e.decodePacket(s,n,!1),w.type===o.type&&w.data===o.data)return r(w,0,1);var h=r(o,c+i,p);if(!1===h)return}c+=i,a=""}else a+=u}return""!==a?r(w,0,1):void 0},e.encodePayloadAsArrayBuffer=function(t,n){function r(t,n){e.encodePacket(t,!0,!0,function(t){return n(null,t)})}return t.length?void c(t,r,function(t,e){var r=e.reduce(function(t,e){var n;return n="string"==typeof e?e.length:e.byteLength,t+n.toString().length+n+2},0),o=new Uint8Array(r),i=0;return e.forEach(function(t){var e="string"==typeof t,n=t;if(e){for(var r=new Uint8Array(t.length),s=0;s<t.length;s++)r[s]=t.charCodeAt(s);n=r.buffer}e?o[i++]=0:o[i++]=1;for(var a=n.byteLength.toString(),s=0;s<a.length;s++)o[i++]=parseInt(a[s]);o[i++]=255;for(var r=new Uint8Array(n),s=0;s<r.length;s++)o[i++]=r[s]}),n(o.buffer)}):n(new ArrayBuffer(0))},e.encodePayloadAsBlob=function(t,n){function r(t,n){e.encodePacket(t,!0,!0,function(t){var e=new Uint8Array(1);if(e[0]=1,"string"==typeof t){for(var r=new Uint8Array(t.length),o=0;o<t.length;o++)r[o]=t.charCodeAt(o);t=r.buffer,e[0]=0}for(var i=t instanceof ArrayBuffer?t.byteLength:t.size,s=i.toString(),a=new Uint8Array(s.length+1),o=0;o<s.length;o++)a[o]=parseInt(s[o]);if(a[s.length]=255,k){var c=new k([e.buffer,a.buffer,t]);n(null,c)}})}c(t,r,function(t,e){return n(new k(e))})},e.decodePayloadAsBinary=function(t,n,r){"function"==typeof n&&(r=n,n=null);for(var o=t,i=[];o.byteLength>0;){for(var s=new Uint8Array(o),a=0===s[0],c="",p=1;255!==s[p];p++){if(c.length>310)return r(w,0,1);c+=s[p]}o=f(o,2+c.length),c=parseInt(c);var u=f(o,0,c);if(a)try{u=String.fromCharCode.apply(null,new Uint8Array(u))}catch(h){var l=new Uint8Array(u);u="";for(var p=0;p<l.length;p++)u+=String.fromCharCode(l[p])}i.push(u),o=f(o,c)}var d=i.length;i.forEach(function(t,o){r(e.decodePacket(t,n,!0),o,d)})}}).call(e,function(){return this}())},function(t,e){t.exports=Object.keys||function(t){var e=[],n=Object.prototype.hasOwnProperty;for(var r in t)n.call(t,r)&&e.push(r);return e}},function(t,e){t.exports=function(t,e,n){var r=t.byteLength;if(e=e||0,n=n||r,t.slice)return t.slice(e,n);if(e<0&&(e+=r),n<0&&(n+=r),n>r&&(n=r),e>=r||e>=n||0===r)return new ArrayBuffer(0);for(var o=new Uint8Array(t),i=new Uint8Array(n-e),s=e,a=0;s<n;s++,a++)i[a]=o[s];return i.buffer}},function(t,e){function n(t,e,n){function o(t,r){if(o.count<=0)throw new Error("after called too many times");--o.count,t?(i=!0,e(t),e=n):0!==o.count||i||e(null,r)}var i=!1;return n=n||r,o.count=t,0===t?e():o}function r(){}t.exports=n},function(t,e,n){var r;(function(t,o){!function(i){function s(t){for(var e,n,r=[],o=0,i=t.length;o<i;)e=t.charCodeAt(o++),e>=55296&&e<=56319&&o<i?(n=t.charCodeAt(o++),56320==(64512&n)?r.push(((1023&e)<<10)+(1023&n)+65536):(r.push(e),o--)):r.push(e);return r}function a(t){for(var e,n=t.length,r=-1,o="";++r<n;)e=t[r],e>65535&&(e-=65536,o+=w(e>>>10&1023|55296),e=56320|1023&e),o+=w(e);return o}function c(t,e){if(t>=55296&&t<=57343){if(e)throw Error("Lone surrogate U+"+t.toString(16).toUpperCase()+" is not a scalar value");return!1}return!0}function p(t,e){return w(t>>e&63|128)}function u(t,e){if(0==(4294967168&t))return w(t);var n="";return 0==(4294965248&t)?n=w(t>>6&31|192):0==(4294901760&t)?(c(t,e)||(t=65533),n=w(t>>12&15|224),n+=p(t,6)):0==(4292870144&t)&&(n=w(t>>18&7|240),n+=p(t,12),n+=p(t,6)),n+=w(63&t|128)}function h(t,e){e=e||{};for(var n,r=!1!==e.strict,o=s(t),i=o.length,a=-1,c="";++a<i;)n=o[a],c+=u(n,r);return c}function f(){if(b>=v)throw Error("Invalid byte index");var t=255&g[b];if(b++,128==(192&t))return 63&t;throw Error("Invalid continuation byte")}function l(t){var e,n,r,o,i;if(b>v)throw Error("Invalid byte index");if(b==v)return!1;if(e=255&g[b],b++,0==(128&e))return e;if(192==(224&e)){if(n=f(),i=(31&e)<<6|n,i>=128)return i;throw Error("Invalid continuation byte")}if(224==(240&e)){if(n=f(),r=f(),i=(15&e)<<12|n<<6|r,i>=2048)return c(i,t)?i:65533;throw Error("Invalid continuation byte")}if(240==(248&e)&&(n=f(),r=f(),o=f(),i=(7&e)<<18|n<<12|r<<6|o,i>=65536&&i<=1114111))return i;throw Error("Invalid UTF-8 detected")}function d(t,e){e=e||{};var n=!1!==e.strict;g=s(t),v=g.length,b=0;for(var r,o=[];(r=l(n))!==!1;)o.push(r);return a(o)}var y="object"==typeof e&&e,m=("object"==typeof t&&t&&t.exports==y&&t,"object"==typeof o&&o);m.global!==m&&m.window!==m||(i=m);var g,v,b,w=String.fromCharCode,k={version:"2.1.2",encode:h,decode:d};r=function(){return k}.call(e,n,e,t),!(void 0!==r&&(t.exports=r))}(this)}).call(e,n(28)(t),function(){return this}())},function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children=[],t.webpackPolyfill=1),t}},function(t,e){!function(){"use strict";for(var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",n=new Uint8Array(256),r=0;r<t.length;r++)n[t.charCodeAt(r)]=r;e.encode=function(e){var n,r=new Uint8Array(e),o=r.length,i="";for(n=0;n<o;n+=3)i+=t[r[n]>>2],i+=t[(3&r[n])<<4|r[n+1]>>4],i+=t[(15&r[n+1])<<2|r[n+2]>>6],i+=t[63&r[n+2]];return o%3===2?i=i.substring(0,i.length-1)+"=":o%3===1&&(i=i.substring(0,i.length-2)+"=="),i},e.decode=function(t){var e,r,o,i,s,a=.75*t.length,c=t.length,p=0;"="===t[t.length-1]&&(a--,"="===t[t.length-2]&&a--);var u=new ArrayBuffer(a),h=new Uint8Array(u);for(e=0;e<c;e+=4)r=n[t.charCodeAt(e)],o=n[t.charCodeAt(e+1)],i=n[t.charCodeAt(e+2)],s=n[t.charCodeAt(e+3)],h[p++]=r<<2|o>>4,h[p++]=(15&o)<<4|i>>2,h[p++]=(3&i)<<6|63&s;return u}}()},function(t,e){(function(e){function n(t){for(var e=0;e<t.length;e++){var n=t[e];if(n.buffer instanceof ArrayBuffer){var r=n.buffer;if(n.byteLength!==r.byteLength){var o=new Uint8Array(n.byteLength);o.set(new Uint8Array(r,n.byteOffset,n.byteLength)),r=o.buffer}t[e]=r}}}function r(t,e){e=e||{};var r=new i;n(t);for(var o=0;o<t.length;o++)r.append(t[o]);return e.type?r.getBlob(e.type):r.getBlob()}function o(t,e){return n(t),new Blob(t,e||{})}var i=e.BlobBuilder||e.WebKitBlobBuilder||e.MSBlobBuilder||e.MozBlobBuilder,s=function(){try{var t=new Blob(["hi"]);return 2===t.size}catch(e){return!1}}(),a=s&&function(){try{var t=new Blob([new Uint8Array([1,2])]);return 2===t.size}catch(e){return!1}}(),c=i&&i.prototype.append&&i.prototype.getBlob;t.exports=function(){return s?a?e.Blob:o:c?r:void 0}()}).call(e,function(){return this}())},function(t,e){e.encode=function(t){var e="";for(var n in t)t.hasOwnProperty(n)&&(e.length&&(e+="&"),e+=encodeURIComponent(n)+"="+encodeURIComponent(t[n]));return e},e.decode=function(t){for(var e={},n=t.split("&"),r=0,o=n.length;r<o;r++){var i=n[r].split("=");e[decodeURIComponent(i[0])]=decodeURIComponent(i[1])}return e}},function(t,e){t.exports=function(t,e){var n=function(){};n.prototype=e.prototype,t.prototype=new n,t.prototype.constructor=t}},function(t,e){"use strict";function n(t){var e="";do e=s[t%a]+e,t=Math.floor(t/a);while(t>0);return e}function r(t){var e=0;for(u=0;u<t.length;u++)e=e*a+c[t.charAt(u)];return e}function o(){var t=n(+new Date);return t!==i?(p=0,i=t):t+"."+n(p++)}for(var i,s="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""),a=64,c={},p=0,u=0;u<a;u++)c[s[u]]=u;o.encode=n,o.decode=r,t.exports=o},function(t,e,n){(function(e){function r(){}function o(t){i.call(this,t),this.query=this.query||{},a||(e.___eio||(e.___eio=[]),a=e.___eio),this.index=a.length;var n=this;a.push(function(t){n.onData(t)}),this.query.j=this.index,e.document&&e.addEventListener&&e.addEventListener("beforeunload",function(){n.script&&(n.script.onerror=r)},!1)}var i=n(21),s=n(32);t.exports=o;var a,c=/\n/g,p=/\\n/g;s(o,i),o.prototype.supportsBinary=!1,o.prototype.doClose=function(){this.script&&(this.script.parentNode.removeChild(this.script),this.script=null),this.form&&(this.form.parentNode.removeChild(this.form),this.form=null,this.iframe=null),i.prototype.doClose.call(this)},o.prototype.doPoll=function(){var t=this,e=document.createElement("script");this.script&&(this.script.parentNode.removeChild(this.script),this.script=null),e.async=!0,e.src=this.uri(),e.onerror=function(e){t.onError("jsonp poll error",e)};var n=document.getElementsByTagName("script")[0];n?n.parentNode.insertBefore(e,n):(document.head||document.body).appendChild(e),this.script=e;var r="undefined"!=typeof navigator&&/gecko/i.test(navigator.userAgent);r&&setTimeout(function(){var t=document.createElement("iframe");document.body.appendChild(t),document.body.removeChild(t)},100)},o.prototype.doWrite=function(t,e){function n(){r(),e()}function r(){if(o.iframe)try{o.form.removeChild(o.iframe)}catch(t){o.onError("jsonp polling iframe removal error",t)}try{var e='<iframe src="javascript:0" name="'+o.iframeId+'">';i=document.createElement(e)}catch(t){i=document.createElement("iframe"),i.name=o.iframeId,i.src="javascript:0"}i.id=o.iframeId,o.form.appendChild(i),o.iframe=i}var o=this;if(!this.form){var i,s=document.createElement("form"),a=document.createElement("textarea"),u=this.iframeId="eio_iframe_"+this.index;s.className="socketio",s.style.position="absolute",s.style.top="-1000px",s.style.left="-1000px",s.target=u,s.method="POST",s.setAttribute("accept-charset","utf-8"),a.name="d",s.appendChild(a),document.body.appendChild(s),this.form=s,this.area=a}this.form.action=this.uri(),r(),t=t.replace(p,"\\\n"),this.area.value=t.replace(c,"\\n");try{this.form.submit()}catch(h){}this.iframe.attachEvent?this.iframe.onreadystatechange=function(){"complete"===o.iframe.readyState&&n()}:this.iframe.onload=n}}).call(e,function(){return this}())},function(t,e,n){(function(e){function r(t){var e=t&&t.forceBase64;e&&(this.supportsBinary=!1),this.perMessageDeflate=t.perMessageDeflate,this.usingBrowserWebSocket=h&&!t.forceNode,this.protocols=t.protocols,this.usingBrowserWebSocket||(l=o),i.call(this,t)}var o,i=n(22),s=n(23),a=n(31),c=n(32),p=n(33),u=n(3)("engine.io-client:websocket"),h=e.WebSocket||e.MozWebSocket;if("undefined"==typeof window)try{o=n(36)}catch(f){}var l=h;l||"undefined"!=typeof window||(l=o),t.exports=r,c(r,i),r.prototype.name="websocket",r.prototype.supportsBinary=!0,r.prototype.doOpen=function(){if(this.check()){var t=this.uri(),e=this.protocols,n={agent:this.agent,perMessageDeflate:this.perMessageDeflate};n.pfx=this.pfx,n.key=this.key,n.passphrase=this.passphrase,n.cert=this.cert,n.ca=this.ca,n.ciphers=this.ciphers,n.rejectUnauthorized=this.rejectUnauthorized,this.extraHeaders&&(n.headers=this.extraHeaders),this.localAddress&&(n.localAddress=this.localAddress);try{this.ws=this.usingBrowserWebSocket?e?new l(t,e):new l(t):new l(t,e,n)}catch(r){return this.emit("error",r)}void 0===this.ws.binaryType&&(this.supportsBinary=!1),this.ws.supports&&this.ws.supports.binary?(this.supportsBinary=!0,this.ws.binaryType="nodebuffer"):this.ws.binaryType="arraybuffer",this.addEventListeners()}},r.prototype.addEventListeners=function(){var t=this;this.ws.onopen=function(){t.onOpen()},this.ws.onclose=function(){t.onClose()},this.ws.onmessage=function(e){t.onData(e.data)},this.ws.onerror=function(e){t.onError("websocket error",e)}},r.prototype.write=function(t){function n(){r.emit("flush"),setTimeout(function(){r.writable=!0,r.emit("drain")},0)}var r=this;this.writable=!1;for(var o=t.length,i=0,a=o;i<a;i++)!function(t){s.encodePacket(t,r.supportsBinary,function(i){if(!r.usingBrowserWebSocket){var s={};if(t.options&&(s.compress=t.options.compress),r.perMessageDeflate){var a="string"==typeof i?e.Buffer.byteLength(i):i.length;a<r.perMessageDeflate.threshold&&(s.compress=!1)}}try{r.usingBrowserWebSocket?r.ws.send(i):r.ws.send(i,s)}catch(c){u("websocket closed before onclose event")}--o||n()})}(t[i])},r.prototype.onClose=function(){i.prototype.onClose.call(this)},r.prototype.doClose=function(){"undefined"!=typeof this.ws&&this.ws.close()},r.prototype.uri=function(){var t=this.query||{},e=this.secure?"wss":"ws",n="";this.port&&("wss"===e&&443!==Number(this.port)||"ws"===e&&80!==Number(this.port))&&(n=":"+this.port),this.timestampRequests&&(t[this.timestampParam]=p()),this.supportsBinary||(t.b64=1),t=a.encode(t),t.length&&(t="?"+t);var r=this.hostname.indexOf(":")!==-1;return e+"://"+(r?"["+this.hostname+"]":this.hostname)+n+this.path+t},r.prototype.check=function(){return!(!l||"__initialize"in l&&this.name===r.prototype.name)}}).call(e,function(){return this}())},function(t,e){},function(t,e){var n=[].indexOf;t.exports=function(t,e){if(n)return t.indexOf(e);for(var r=0;r<t.length;++r)if(t[r]===e)return r;return-1}},function(t,e){(function(e){var n=/^[\],:{}\s]*$/,r=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,o=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,i=/(?:^|:|,)(?:\s*\[)+/g,s=/^\s+/,a=/\s+$/;t.exports=function(t){return"string"==typeof t&&t?(t=t.replace(s,"").replace(a,""),e.JSON&&JSON.parse?JSON.parse(t):n.test(t.replace(r,"@").replace(o,"]").replace(i,""))?new Function("return "+t)():void 0):null}}).call(e,function(){return this}())},function(t,e,n){"use strict";function r(t,e,n){this.io=t,this.nsp=e,this.json=this,this.ids=0,this.acks={},this.receiveBuffer=[],this.sendBuffer=[],this.connected=!1,this.disconnected=!0,n&&n.query&&(this.query=n.query),this.io.autoConnect&&this.open()}var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},i=n(7),s=n(8),a=n(40),c=n(41),p=n(42),u=n(3)("socket.io-client:socket"),h=n(31);t.exports=e=r;var f={connect:1,connect_error:1,connect_timeout:1,connecting:1,disconnect:1,error:1,reconnect:1,reconnect_attempt:1,reconnect_failed:1,reconnect_error:1,reconnecting:1,ping:1,pong:1},l=s.prototype.emit;s(r.prototype),r.prototype.subEvents=function(){if(!this.subs){var t=this.io;this.subs=[c(t,"open",p(this,"onopen")),c(t,"packet",p(this,"onpacket")),c(t,"close",p(this,"onclose"))]}},r.prototype.open=r.prototype.connect=function(){return this.connected?this:(this.subEvents(),this.io.open(),"open"===this.io.readyState&&this.onopen(),this.emit("connecting"),this)},r.prototype.send=function(){var t=a(arguments);return t.unshift("message"),this.emit.apply(this,t),this},r.prototype.emit=function(t){if(f.hasOwnProperty(t))return l.apply(this,arguments),this;var e=a(arguments),n={type:i.EVENT,data:e};return n.options={},n.options.compress=!this.flags||!1!==this.flags.compress,"function"==typeof e[e.length-1]&&(u("emitting packet with ack id %d",this.ids),this.acks[this.ids]=e.pop(),n.id=this.ids++),this.connected?this.packet(n):this.sendBuffer.push(n),delete this.flags,this},r.prototype.packet=function(t){t.nsp=this.nsp,this.io.packet(t)},r.prototype.onopen=function(){if(u("transport is open - connecting"),"/"!==this.nsp)if(this.query){var t="object"===o(this.query)?h.encode(this.query):this.query;u("sending connect packet with query %s",t),this.packet({type:i.CONNECT,query:t})}else this.packet({type:i.CONNECT})},r.prototype.onclose=function(t){u("close (%s)",t),this.connected=!1,this.disconnected=!0,delete this.id,this.emit("disconnect",t)},r.prototype.onpacket=function(t){if(t.nsp===this.nsp)switch(t.type){case i.CONNECT:this.onconnect();break;case i.EVENT:this.onevent(t);break;case i.BINARY_EVENT:this.onevent(t);break;case i.ACK:this.onack(t);break;case i.BINARY_ACK:this.onack(t);break;case i.DISCONNECT:this.ondisconnect();break;case i.ERROR:this.emit("error",t.data)}},r.prototype.onevent=function(t){var e=t.data||[];u("emitting event %j",e),null!=t.id&&(u("attaching ack callback to event"),e.push(this.ack(t.id))),this.connected?l.apply(this,e):this.receiveBuffer.push(e)},r.prototype.ack=function(t){var e=this,n=!1;return function(){if(!n){n=!0;var r=a(arguments);u("sending ack %j",r),e.packet({type:i.ACK,id:t,data:r})}}},r.prototype.onack=function(t){var e=this.acks[t.id];"function"==typeof e?(u("calling ack %s with %j",t.id,t.data),e.apply(this,t.data),delete this.acks[t.id]):u("bad ack %s",t.id)},r.prototype.onconnect=function(){this.connected=!0,this.disconnected=!1,this.emit("connect"),this.emitBuffered()},r.prototype.emitBuffered=function(){var t;for(t=0;t<this.receiveBuffer.length;t++)l.apply(this,this.receiveBuffer[t]);for(this.receiveBuffer=[],t=0;t<this.sendBuffer.length;t++)this.packet(this.sendBuffer[t]);this.sendBuffer=[]},r.prototype.ondisconnect=function(){u("server disconnect (%s)",this.nsp),this.destroy(),this.onclose("io server disconnect")},r.prototype.destroy=function(){if(this.subs){for(var t=0;t<this.subs.length;t++)this.subs[t].destroy();this.subs=null}this.io.destroy(this)},r.prototype.close=r.prototype.disconnect=function(){return this.connected&&(u("performing disconnect (%s)",this.nsp),this.packet({type:i.DISCONNECT})),this.destroy(),this.connected&&this.onclose("io client disconnect"),this},r.prototype.compress=function(t){return this.flags=this.flags||{},this.flags.compress=t,this}},function(t,e){function n(t,e){var n=[];e=e||0;for(var r=e||0;r<t.length;r++)n[r-e]=t[r];return n}t.exports=n},function(t,e){"use strict";function n(t,e,n){return t.on(e,n),{destroy:function(){t.removeListener(e,n)}}}t.exports=n},function(t,e){var n=[].slice;t.exports=function(t,e){if("string"==typeof e&&(e=t[e]),"function"!=typeof e)throw new Error("bind() requires a function");var r=n.call(arguments,2);return function(){return e.apply(t,r.concat(n.call(arguments)))}}},function(t,e){function n(t){t=t||{},this.ms=t.min||100,this.max=t.max||1e4,this.factor=t.factor||2,this.jitter=t.jitter>0&&t.jitter<=1?t.jitter:0,this.attempts=0}t.exports=n,n.prototype.duration=function(){var t=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),n=Math.floor(e*this.jitter*t);t=0==(1&Math.floor(10*e))?t-n:t+n}return 0|Math.min(t,this.max)},n.prototype.reset=function(){this.attempts=0},n.prototype.setMin=function(t){this.ms=t},n.prototype.setMax=function(t){this.max=t},n.prototype.setJitter=function(t){this.jitter=t}}])});
//# sourceMappingURL=socket.io.js.map
/*global L*/
'use strict';
/*
 * Class EventDispatcher provides event handling to sub-classes.
 * It is inherited from Publisher, Room, etc.
 */
var TK = TK || {};
TK.EventDispatcher = function (spec) {
    var that = {};
    var isArray = function (object){
        return  object && typeof object==='object' &&
            typeof object.length==='number' &&
            typeof object.splice==='function' &&
            //判断length属性是否是可枚举的 对于数组 将得到false
            !(object.propertyIsEnumerable('length'));
    }
    // Private vars
    spec.dispatcher = {};
    spec.dispatcher.eventListeners = {};
    spec.dispatcher.backupListerners = {};
    // Public functions

    // It adds an event listener attached to an event type.
    that.addEventListener = function (eventType, listener , backupid ) {
        if(eventType === undefined || eventType === null){
            return;
        }
        if (spec.dispatcher.eventListeners[eventType] === undefined) {
            spec.dispatcher.eventListeners[eventType] = [];
        }
        spec.dispatcher.eventListeners[eventType].push(listener);
        if(backupid){
            if (spec.dispatcher.backupListerners[backupid] === undefined) {
                spec.dispatcher.backupListerners[backupid] = [];
            }
            spec.dispatcher.backupListerners[backupid].push({eventType:eventType ,listener:listener });
        }
    };

    // It removes an available event listener.
    that.removeEventListener = function (eventType, listener) {
        var index;
		if(!spec.dispatcher.eventListeners[eventType]){ L.Logger.info('[tk-sdk]not event type: ' +eventType);  return ;} ;
        index = spec.dispatcher.eventListeners[eventType].indexOf(listener);
        if (index !== -1) {
            spec.dispatcher.eventListeners[eventType].splice(index, 1);
        }
    };
	
    // It removes all event listener.
    that.removeAllEventListener = function (eventTypeArr) {
        if( isArray(eventTypeArr) ){
            for(var i in eventTypeArr){
                var eventType = eventTypeArr[i] ;
                delete spec.dispatcher.eventListeners[eventType] ;
            }
        }else if(typeof eventTypeArr === "string"){
			delete spec.dispatcher.eventListeners[eventTypeArr] ;  
		}else if(typeof eventTypeArr === "object"){
            for(var key in eventTypeArr){
                var eventType = key  , listener = eventTypeArr[key];
                that.removeEventListener(eventType , listener);
            }
		}		  
    };

    // It dispatch a new event to the event listeners, based on the type
    // of event. All events are intended to be TalkEvents.
    that.dispatchEvent = function (event , log ) {
        var listener;
        log = log!=undefined?log:true ;
        if(log){
            L.Logger.debug('sdk-dispatchEvent , event type: ' + event.type);
        }
        for (listener in spec.dispatcher.eventListeners[event.type]) {
            if (spec.dispatcher.eventListeners[event.type].hasOwnProperty(listener)) {
                spec.dispatcher.eventListeners[event.type][listener](event);
            }
        }
    };

    that.removeBackupListerner = function (backupid) {
        if(backupid){
            if( spec.dispatcher.backupListerners[backupid] ){
                for(var i=0; i<spec.dispatcher.backupListerners[backupid].length ; i++){
                    var backupListernerInfo = spec.dispatcher.backupListerners[backupid][i] ;
                    that.removeEventListener(backupListernerInfo.eventType , backupListernerInfo.listener);
                }
                spec.dispatcher.backupListerners[backupid].length = 0 ;
                delete spec.dispatcher.backupListerners[backupid] ;
            }
        }
    };

    return that;
};

// **** EVENTS ****

/*
 * Class TalkEvent represents a generic Event in the library.
 * It handles the type of event, that is important when adding
 * event listeners to EventDispatchers and dispatching new events.
 * A TalkEvent can be initialized this way:
 * var event = TalkEvent({type: "room-connected"});
 */
TK.TalkEvent = function (spec) {
    var that = {};

    // Event type. Examples are: 'room-connected', 'stream-added', etc.
    that.type = spec.type;

    return that;
};

/*
 * Class RoomEvent represents an Event that happens in a Room. It is a
 * TalkEvent.
 * It is usually initialized as:
 * var roomEvent = RoomEvent({type:"room-connected", streams:[stream1, stream2]});
 * Event types:
 * 'room-connected' - points out that the user has been successfully connected to the room.
 * 'room-disconnected' - shows that the user has been already disconnected.
 */
TK.RoomEvent = function (spec , extraSpec) {
    var that = TK.TalkEvent(spec);

    // A list with the streams that are published in the room.
    that.streams = spec.streams;
    that.message = spec.message;
    that.user = spec.user;
    if(extraSpec && typeof extraSpec === 'object'){
        for(var key in extraSpec){
            that[key] = extraSpec[key];
        }
    }
    return that;
};

/*
 * Class StreamEvent represents an event related to a stream. It is a TalkEvent.
 * It is usually initialized this way:
 * var streamEvent = StreamEvent({type:"stream-added", stream:stream1});
 * Event types:
 * 'stream-added' - indicates that there is a new stream available in the room.
 * 'stream-removed' - shows that a previous available stream has been removed from the room.
 */
TK.StreamEvent = function (spec , extraSpec) {
    var that = TK.TalkEvent(spec);

    // The stream related to this event.
    that.stream = spec.stream;
    that.message = spec.message;
    that.bandwidth = spec.bandwidth;
    that.attrs = spec.attrs ;
    if(extraSpec && typeof extraSpec === 'object'){
        for(var key in extraSpec){
            that[key] = extraSpec[key];
        }
    }
    return that;
};

/*
 * Class PublisherEvent represents an event related to a publisher. It is a TalkEvent.
 * It usually initializes as:
 * var publisherEvent = PublisherEvent({})
 * Event types:
 * 'access-accepted' - indicates that the user has accepted to share his camera and microphone
 */
TK.PublisherEvent = function (spec , extraSpec) {
    var that = TK.TalkEvent(spec);
    if(extraSpec && typeof extraSpec === 'object'){
        for(var key in extraSpec){
            that[key] = extraSpec[key];
        }
    }
    return that;
};
TK.coreEventController = TK.EventDispatcher({});'use strict';
var TK = TK || {};

TK.FcStack = function (spec) {
/*
        spec.callback({
            type: sessionDescription.type,
            sdp: sessionDescription.sdp
        });
*/
    var that = {};

    that.pcConfig = {};

    that.peerConnection = {};
    that.desc = {};
    that.signalCallback = undefined;

    var L = L || {};

    that.close = function() {
        L.Logger.debug('[tk-sdk]Close FcStack');
    };

    that.createOffer = function() {
        L.Logger.debug('[tk-sdk]FCSTACK: CreateOffer');
    };

    that.addStream = function(stream) {
        L.Logger.debug('[tk-sdk]FCSTACK: addStream', stream);
    };
     //xueqiang change
    that.removeStream = function (stream) {
         L.Logger.debug('[tk-sdk]FCSTACK: removeStream', stream);
    };

    that.processSignalingMessage = function(msg) {
        L.Logger.debug('[tk-sdk]FCSTACK: processSignaling', msg);
        if(that.signalCallback !== undefined)
            that.signalCallback(msg);
    };

    that.sendSignalingMessage = function(msg) {
        L.Logger.debug('[tk-sdk]FCSTACK: Sending signaling Message', msg);
        spec.callback(msg);
    };

    that.setSignalingCallback = function(callback) {
        L.Logger.debug('[tk-sdk]FCSTACK: Setting signalling callback');
        that.signalCallback = callback;
    };
    return that;
};
/*global L, mozRTCIceCandidate, mozRTCSessionDescription, mozRTCPeerConnection*/
'use strict';
var TK = TK || {};

TK.FirefoxStack = function (spec) {
    var that = {},
        WebkitRTCPeerConnection = mozRTCPeerConnection,
        RTCSessionDescription = mozRTCSessionDescription,
        RTCIceCandidate = mozRTCIceCandidate;

    that.pcConfig = {
        'iceServers': []
    };

    if (spec.iceServers !== undefined) {
        that.pcConfig.iceServers = spec.iceServers;
    }

    if (spec.audio === undefined) {
        spec.audio = true;
    }

    if (spec.video === undefined) {
        spec.video = true;
    }

    that.mediaConstraints = {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
        mozDontOfferDataChannel: true
    };

    var errorCallback = function (message) {
        L.Logger.error('[tk-sdk]Error in Stack ', message );
    };

    var enableSimulcast = function () {
      if (!spec.video ||!spec.simulcast) {
        return;
      }
      that.peerConnection.getSenders().forEach(function(sender) {
        if (sender.track.kind === 'video') {
          sender.getParameters();
          sender.setParameters({encodings: [{ 
            rid: 'spam', 
            active: true, 
            priority: 'high', 
            maxBitrate: 40000, 
            maxHeight: 640, 
            maxWidth: 480 },{ 
            rid: 'egg', 
            active: true, 
            priority: 'medium', 
            maxBitrate: 10000, 
            maxHeight: 320, 
            maxWidth: 240 }]
          });
        }
      });
    };


    var gotCandidate = false;
    that.peerConnection = new WebkitRTCPeerConnection(that.pcConfig, that.con);
    spec.localCandidates = [];

    that.peerConnection.onicecandidate =  function (event) {
        var candidateObject = {};
        if (!event.candidate) {
            L.Logger.debug('[tk-sdk]Gathered all candidates. Sending END candidate');
            candidateObject = {
                sdpMLineIndex: -1 ,
                sdpMid: 'end',
                candidate: 'end'
            };
        }else{
            gotCandidate = true;
            if (!event.candidate.candidate.match(/a=/)) {
                event.candidate.candidate ='a=' + event.candidate.candidate;
            }
            candidateObject = event.candidate;
            if (spec.remoteDescriptionSet) {
                spec.callback({type:'candidate', candidate: candidateObject});
            } else {
                spec.localCandidates.push(candidateObject);
                L.Logger.debug('[tk-sdk]Local Candidates stored: ',
                               spec.localCandidates.length, spec.localCandidates);
            }

        }
    };


    that.peerConnection.onaddstream = function (stream) {
        if (that.onaddstream) {
            that.onaddstream(stream);
        }
    };

    that.peerConnection.onremovestream = function (stream) {
        if (that.onremovestream) {
            that.onremovestream(stream);
        }
    };

    that.peerConnection.oniceconnectionstatechange = function (ev) {
        if (that.oniceconnectionstatechange){
            that.oniceconnectionstatechange(ev.target.iceConnectionState);
        }
    };

    var setMaxBW = function (sdp) {
        var r, a;
        if (spec.video && spec.maxVideoBW) {
            sdp = sdp.replace(/b=AS:.*\r\n/g, '');
            a = sdp.match(/m=video.*\r\n/);
            if (a == null) {
                a = sdp.match(/m=video.*\n/);
            }
            if (a && (a.length > 0)) {
                r = a[0] + 'b=AS:' + spec.maxVideoBW + '\r\n';
                sdp = sdp.replace(a[0], r);
            }
        }

        if (spec.audio && spec.maxAudioBW) {
            a = sdp.match(/m=audio.*\r\n/);
            if (a == null) {
                a = sdp.match(/m=audio.*\n/);
            }
            if (a && (a.length > 0)) {
                r = a[0] + 'b=AS:' + spec.maxAudioBW + '\r\n';
                sdp = sdp.replace(a[0], r);
            }
        }

        return sdp;
    };

    var localDesc;

    var setLocalDesc = function (sessionDescription) {
        sessionDescription.sdp = setMaxBW(sessionDescription.sdp);
        sessionDescription.sdp =
              sessionDescription.sdp.replace(/a=ice-options:google-ice\r\n/g, '');
        spec.callback(sessionDescription);
        localDesc = sessionDescription;
    };

    var setLocalDescp2p = function (sessionDescription) {
        sessionDescription.sdp = setMaxBW(sessionDescription.sdp);
        sessionDescription.sdp =
              sessionDescription.sdp.replace(/a=ice-options:google-ice\r\n/g, '');
        spec.callback(sessionDescription);
        localDesc = sessionDescription;
        that.peerConnection.setLocalDescription(localDesc);
    };

    that.updateSpec = function (config){
        if (config.maxVideoBW || config.maxAudioBW ){
            if (config.maxVideoBW){
                L.Logger.debug ('[tk-sdk]Maxvideo Requested', config.maxVideoBW,
                                'limit', spec.limitMaxVideoBW);
                if (config.maxVideoBW > spec.limitMaxVideoBW) {
                    config.maxVideoBW = spec.limitMaxVideoBW;
                }
                spec.maxVideoBW = config.maxVideoBW;
            }
            if (config.maxAudioBW) {
                if (config.maxAudioBW > spec.limitMaxAudioBW) {
                    config.maxAudioBW = spec.limitMaxAudioBW;
                }
                spec.maxAudioBW = config.maxAudioBW;
            }

            localDesc.sdp = setMaxBW(localDesc.sdp);
            if (config.Sdp){
                L.Logger.error ('[tk-sdk]Cannot update with renegotiation in Firefox, ' +
                                'try without renegotiation');
            } else {
                L.Logger.debug ('[tk-sdk]Updating without renegotiation, newVideoBW:', spec.maxVideoBW,
                                ', newAudioBW:', spec.maxAudioBW);
                spec.callback({type:'updatestream', sdp: localDesc.sdp});
            }
        }
        if (config.minVideoBW || (config.slideShowMode!==undefined) ||
            (config.muteStream !== undefined) || (config.qualityLayer !== undefined)){
            L.Logger.debug ('[tk-sdk]MinVideo Changed to ', config.minVideoBW);
            L.Logger.debug ('[tk-sdk]SlideShowMode Changed to ', config.slideShowMode);
            L.Logger.debug ('[tk-sdk]muteStream changed to ', config.muteStream);
            spec.callback({type: 'updatestream', config:config});
        }
    };

    that.createOffer = function (isSubscribe) {
        if (isSubscribe === true) {
            that.peerConnection.createOffer(setLocalDesc, errorCallback, that.mediaConstraints);
        } else {
            enableSimulcast();
            that.mediaConstraints = {
                offerToReceiveAudio: false,
                offerToReceiveVideo: false,
                mozDontOfferDataChannel: true
            };
            that.peerConnection.createOffer(setLocalDesc, errorCallback, that.mediaConstraints);
        }
    };

    that.addStream = function (stream) {
        that.peerConnection.addStream(stream);
    };

      //xueqiang change
    that.removeStream = function (stream) {
         that.peerConnection.removeStream(stream);
    };
    
    spec.remoteCandidates = [];
    spec.remoteDescriptionSet = false;

    /**
     * Closes the connection.
     */
    that.close = function () {
        that.state = 'closed';
        that.peerConnection.close();
    };

    that.processSignalingMessage = function (msg) {

//        L.Logger.debug("Process Signaling Message", msg);

        if (msg.type === 'offer') {
            msg.sdp = setMaxBW(msg.sdp);
            that.peerConnection.setRemoteDescription(new RTCSessionDescription(msg), function(){
                that.peerConnection.createAnswer(setLocalDescp2p, function(error){
                L.Logger.error('[tk-sdk]Error', error);
            }, that.mediaConstraints);
                spec.remoteDescriptionSet = true;
            }, function(error){
              L.Logger.error('[tk-sdk]Error setting Remote Description', error);
            });
        } else if (msg.type === 'answer') {

            L.Logger.debug('[tk-sdk]Set remote and local description');
            L.Logger.debug('[tk-sdk]Local Description to set', localDesc.sdp);
            L.Logger.debug('[tk-sdk]Remote Description to set', msg.sdp);

            msg.sdp = setMaxBW(msg.sdp);

            that.peerConnection.setLocalDescription(localDesc, function(){
                that.peerConnection.setRemoteDescription(
                  new RTCSessionDescription(msg), function() {
                    spec.remoteDescriptionSet = true;
                    L.Logger.debug('[tk-sdk]Remote Description successfully set');
                    while (spec.remoteCandidates.length > 0 && gotCandidate) {
                        L.Logger.debug('[tk-sdk]Setting stored remote candidates');
                        // IMPORTANT: preserve ordering of candidates
                        that.peerConnection.addIceCandidate(spec.remoteCandidates.shift());
                    }
                    while(spec.localCandidates.length > 0) {
                        L.Logger.debug('[tk-sdk]Sending Candidate from list');
                        // IMPORTANT: preserve ordering of candidates
                        spec.callback({type:'candidate', candidate: spec.localCandidates.shift()});
                    }
                }, function (error){
                    L.Logger.error('[tk-sdk]Error Setting Remote Description', error);
                });
            },function(error){
               L.Logger.error('[tk-sdk]Failure setting Local Description', error);
            });

        } else if (msg.type === 'candidate') {

            try {
                var obj;
                if (typeof(msg.candidate) === 'object') {
                    obj = msg.candidate;
                } else {
                    obj = L.Utils.toJsonParse(msg.candidate);
                }
                obj.candidate = obj.candidate.replace(/ generation 0/g, '');
                obj.candidate = obj.candidate.replace(/ udp /g, ' UDP ');

                obj.sdpMLineIndex = parseInt(obj.sdpMLineIndex);
                var candidate = new RTCIceCandidate(obj);
//                L.logger.debug("Remote Candidate",candidate);

                if (spec.remoteDescriptionSet && gotCandidate) {
                    that.peerConnection.addIceCandidate(candidate);
                    while (spec.remoteCandidates.length > 0) {
                        L.Logger.debug('[tk-sdk]Setting stored remote candidates');
                        // IMPORTANT: preserve ordering of candidates
                        that.peerConnection.addIceCandidate(spec.remoteCandidates.shift());
                    }
                } else {
                    spec.remoteCandidates.push(candidate);
                }
            } catch(e) {
                L.Logger.error('[tk-sdk]Error parsing candidate', msg.candidate, e);
            }
        }
    };
    return that;
};
/*global L, RTCSessionDescription, webkitRTCPeerConnection, RTCIceCandidate*/
'use strict';

var TK = TK || {};
window.TkWebkitRTCPeerConnection = function(pcConfig, pcConstraints) {
    // Translate iceTransportPolicy to iceTransports,
    // see https://code.google.com/p/webrtc/issues/detail?id=4869
    if (pcConfig && pcConfig.iceTransportPolicy) {
        pcConfig.iceTransports = pcConfig.iceTransportPolicy;
    }

    var pc = new webkitRTCPeerConnection(pcConfig, pcConstraints); // jscs:ignore requireCapitalizedConstructors
    var origGetStats = pc.getStats.bind(pc);
    pc.getStats = function(selector, successCallback, errorCallback) { // jshint ignore: line

        var self = this;
        var args = arguments;

        // If selector is a function then we are in the old style stats so just
        // pass back the original getStats format to avoid breaking old users.
        if (arguments.length > 0 && typeof selector === 'function') {
            return origGetStats(selector, successCallback);
        }

        var fixChromeStats = function(response) {
            var standardReport = {};
            var reports = response.result();
            reports.forEach(function(report) {
                var standardStats = {
                    id: report.id,
                    timestamp:  new Date(report.timestamp).getTime() ,
                    type: report.type
                };
                report.names().forEach(function(name) {
                    standardStats[name] = report.stat(name);
                });
                standardReport[standardStats.id] = standardStats;
            });

            return standardReport;
        };

        if (arguments.length >= 2) {
            var successCallbackWrapper = function(response) {
                args[1](fixChromeStats(response));
            };

            return origGetStats.apply(this, [successCallbackWrapper, arguments[0]]);
        }
    };

    return pc;
};
TK.TkChromeStableStack = function (spec) {
    var that = {},
        WebkitRTCPeerConnection = window.TkWebkitRTCPeerConnection,
        // WebkitRTCPeerConnection = webkitRTCPeerConnection ,
        defaultSimulcastSpatialLayers = 2;

    that.pcConfig = {
        'iceServers': []
    };


    that.con = {'optional': [{'DtlsSrtpKeyAgreement': true}]};

    if (spec.iceServers !== undefined) {
        that.pcConfig.iceServers = spec.iceServers;
    }

    if (spec.audio === undefined) {
        spec.audio = true;
    }

    if (spec.video === undefined) {
        spec.video = true;
    }

    that.mediaConstraints = {
        mandatory: {
            'OfferToReceiveVideo': spec.video,
            'OfferToReceiveAudio': spec.audio
        }
    };

    var errorCallback = function (message) {
        L.Logger.error('[tk-sdk]Error in Stack ',  message);
    };

    that.peerConnection = new WebkitRTCPeerConnection(that.pcConfig, that.con);

    var addSim = function (spatialLayers) {
      var line = 'a=ssrc-group:SIM';
      spatialLayers.forEach(function(spatialLayerId) {
        line += ' ' + spatialLayerId;
      });
      return line + '\r\n';
    };

    var addGroup = function(spatialLayerId, spatialLayerIdRtx) {
      return 'a=ssrc-group:FID ' + spatialLayerId + ' ' + spatialLayerIdRtx + '\r\n';
    };

    var addSpatialLayer = function (cname, msid, mslabel, label, spatialLayerId, 
        spatialLayerIdRtx) {
      return  'a=ssrc:' + spatialLayerId + ' cname:' + cname +'\r\n' +
              'a=ssrc:' + spatialLayerId + ' msid:' + msid + '\r\n' +
              'a=ssrc:' + spatialLayerId + ' mslabel:' + mslabel + '\r\n' +
              'a=ssrc:' + spatialLayerId + ' label:' + label + '\r\n' +
              'a=ssrc:' + spatialLayerIdRtx + ' cname:' + cname +'\r\n' +
              'a=ssrc:' + spatialLayerIdRtx + ' msid:' + msid + '\r\n' +
              'a=ssrc:' + spatialLayerIdRtx + ' mslabel:' + mslabel + '\r\n' +
              'a=ssrc:' + spatialLayerIdRtx + ' label:' + label + '\r\n';
    };

    var enableSimulcast = function (sdp) {
      var result, matchGroup;
      if (!spec.video) {
        return sdp;
      }
      if (!spec.simulcast) {
        return sdp;
      }

      // TODO(javier): Improve the way we check for current video ssrcs
      matchGroup = sdp.match(/a=ssrc-group:FID ([0-9]*) ([0-9]*)\r?\n/);
      if (!matchGroup || (matchGroup.length <= 0)) {
        return sdp;
      }

      var numSpatialLayers = spec.simulcast.numSpatialLayers || defaultSimulcastSpatialLayers;
      var baseSsrc = parseInt(matchGroup[1]);
      var baseSsrcRtx = parseInt(matchGroup[2]);
      var cname = sdp.match(new RegExp('a=ssrc:' + matchGroup[1] + ' cname:(.*)\r?\n'))[1];
      var msid = sdp.match(new RegExp('a=ssrc:' + matchGroup[1] + ' msid:(.*)\r?\n'))[1];
      var mslabel = sdp.match(new RegExp('a=ssrc:' + matchGroup[1] + ' mslabel:(.*)\r?\n'))[1];
      var label = sdp.match(new RegExp('a=ssrc:' + matchGroup[1] + ' label:(.*)\r?\n'))[1];

      sdp.match(new RegExp('a=ssrc:' + matchGroup[1] + '.*\r?\n', 'g')).forEach(function(line) {
        sdp = sdp.replace(line, '');
      });
      sdp.match(new RegExp('a=ssrc:' + matchGroup[2] + '.*\r?\n', 'g')).forEach(function(line) {
        sdp = sdp.replace(line, '');
      });

      var spatialLayers = [baseSsrc];
      var spatialLayersRtx = [baseSsrcRtx];

      for (var i = 1; i < numSpatialLayers; i++) {
        spatialLayers.push(baseSsrc + i * 1000);
        spatialLayersRtx.push(baseSsrcRtx + i * 1000);
      }

      result = addSim(spatialLayers);
      var spatialLayerId;
      var spatialLayerIdRtx;
      for (var spatialLayerIndex in spatialLayers) {
        spatialLayerId = spatialLayers[spatialLayerIndex];
        spatialLayerIdRtx = spatialLayersRtx[spatialLayerIndex];
        result += addGroup(spatialLayerId, spatialLayerIdRtx);
      }

      for (var spatialLayerIndex in spatialLayers) {
        spatialLayerId = spatialLayers[spatialLayerIndex];
        spatialLayerIdRtx = spatialLayersRtx[spatialLayerIndex];
        result += addSpatialLayer(cname, msid, mslabel, label, spatialLayerId, spatialLayerIdRtx);
      }
      result += 'a=x-google-flag:conference\r\n';
      return sdp.replace(matchGroup[0], result);
    };

    var setMaxBW = function (sdp) {
        var r, a;
        if (spec.video && spec.maxVideoBW) {
            sdp = sdp.replace(/b=AS:.*\r\n/g, '');
            a = sdp.match(/m=video.*\r\n/);
            if (a == null) {
                a = sdp.match(/m=video.*\n/);
            }
            if (a && (a.length > 0)) {
                r = a[0] + 'b=AS:' + spec.maxVideoBW + '\r\n';
                sdp = sdp.replace(a[0], r);
            }
        }

        if (spec.audio && spec.maxAudioBW) {
            a = sdp.match(/m=audio.*\r\n/);
            if (a == null) {
                a = sdp.match(/m=audio.*\n/);
            }
            if (a && (a.length > 0)) {
                r = a[0] + 'b=AS:' + spec.maxAudioBW + '\r\n';
                sdp = sdp.replace(a[0], r);
            }
        }
        return sdp;
    };

    var enableOpusNacks = function (sdp) {
        var sdpMatch;
        sdpMatch = sdp.match(/a=rtpmap:(.*)opus.*\r\n/);
        if (sdpMatch !== null){
           var theLine = sdpMatch[0] + 'a=rtcp-fb:' + sdpMatch[1] + 'nack' + '\r\n';
           sdp = sdp.replace(sdpMatch[0], theLine);
        }

        return sdp;
    };

    /**
     * Closes the connection.
     */
    that.close = function () {
        that.state = 'closed';
        that.peerConnection.close();
    };

    spec.localCandidates = [];

    that.peerConnection.onicecandidate = function (event) {
        var candidateObject = {};
        if (!event.candidate) {
            L.Logger.debug('[tk-sdk]Gathered all candidates. Sending END candidate');
            candidateObject = {
                sdpMLineIndex: -1 ,
                sdpMid: 'end',
                candidate: 'end'
            };
        }else{

            if (!event.candidate.candidate.match(/a=/)) {
                event.candidate.candidate = 'a=' + event.candidate.candidate;
            }

            candidateObject = {
                sdpMLineIndex: event.candidate.sdpMLineIndex,
                sdpMid: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            };
        }

        if (spec.remoteDescriptionSet) {
            spec.callback({type: 'candidate', candidate: candidateObject});
        } else {
            spec.localCandidates.push(candidateObject);
            L.Logger.debug('[tk-sdk]Storing candidate: ', spec.localCandidates.length, candidateObject );
        }

    };

    that.peerConnection.onaddstream = function (stream) {
        if (that.onaddstream) {
            that.onaddstream(stream);
        }
    };

    that.peerConnection.onremovestream = function (stream) {
        if (that.onremovestream) {
            that.onremovestream(stream);
        }
    };

    that.peerConnection.oniceconnectionstatechange = function (ev) {
        if (that.oniceconnectionstatechange){
            that.oniceconnectionstatechange(ev.target.iceConnectionState);
        }
    };

    var localDesc;
    var remoteDesc;

    var setLocalDesc = function (isSubscribe, sessionDescription) {
        if (!isSubscribe) {
          sessionDescription.sdp = enableSimulcast(sessionDescription.sdp);
        }
        sessionDescription.sdp = setMaxBW(sessionDescription.sdp);
        sessionDescription.sdp = enableOpusNacks(sessionDescription.sdp);
        sessionDescription.sdp = sessionDescription.sdp.replace(/a=ice-options:google-ice\r\n/g,  '');
        sessionDescription.sdp = sessionDescription.sdp.replace(/a=rtcp-fb:\d+ transport-cc\r\n/g, '');//cyj

        spec.callback({
            type: sessionDescription.type,
            sdp: sessionDescription.sdp
        });
        localDesc = sessionDescription;
        //that.peerConnection.setLocalDescription(sessionDescription);
    };

    var setLocalDescp2p = function (sessionDescription) {
        sessionDescription.sdp = setMaxBW(sessionDescription.sdp);
        spec.callback({
            type: sessionDescription.type,
            sdp: sessionDescription.sdp
        });
        localDesc = sessionDescription;
        that.peerConnection.setLocalDescription(sessionDescription);
    };

    that.updateSpec = function (config, callback){
        if (config.maxVideoBW || config.maxAudioBW ){
            if (config.maxVideoBW){
                L.Logger.debug ('[tk-sdk]Maxvideo Requested:', config.maxVideoBW,
                                'limit:', spec.limitMaxVideoBW);
                if (config.maxVideoBW > spec.limitMaxVideoBW) {
                    config.maxVideoBW = spec.limitMaxVideoBW;
                }
                spec.maxVideoBW = config.maxVideoBW;
            }
            if (config.maxAudioBW) {
                if (config.maxAudioBW > spec.limitMaxAudioBW) {
                    config.maxAudioBW = spec.limitMaxAudioBW;
                }
                spec.maxAudioBW = config.maxAudioBW;
            }

            localDesc.sdp = setMaxBW(localDesc.sdp);
            if (config.Sdp || config.maxAudioBW){
                L.Logger.debug('[tk-sdk]Updating with SDP renegotiation', spec.maxVideoBW, spec.maxAudioBW);
                that.peerConnection.setLocalDescription(localDesc, function () {
                    remoteDesc.sdp = setMaxBW(remoteDesc.sdp);
                    that.peerConnection.setRemoteDescription(
                      new RTCSessionDescription(remoteDesc), function () {
                        spec.remoteDescriptionSet = true;
                        spec.callback({type:'updatestream', sdp: localDesc.sdp});
                      });
                }, function (error){
                    L.Logger.error('[tk-sdk]Error updating configuration', error);
                    callback('error');
                });

            } else {
                L.Logger.debug ('[tk-sdk]Updating without SDP renegotiation, ' +
                                'newVideoBW:', spec.maxVideoBW,
                                'newAudioBW:', spec.maxAudioBW);
                spec.callback({type:'updatestream', sdp: localDesc.sdp});
            }
        }
        if (config.minVideoBW || (config.slideShowMode!==undefined) ||
            (config.muteStream !== undefined) || (config.qualityLayer !== undefined)){
            L.Logger.debug ('[tk-sdk]MinVideo Changed to ', config.minVideoBW);
            L.Logger.debug ('[tk-sdk]SlideShowMode Changed to ', config.slideShowMode);
            L.Logger.debug ('[tk-sdk]muteStream changed to ', config.muteStream);
            spec.callback({type: 'updatestream', config:config});
        }
    };

    that.createOffer = function (isSubscribe) {
        if (isSubscribe === true) {
            that.peerConnection.createOffer(setLocalDesc.bind(null, isSubscribe), errorCallback,
                that.mediaConstraints);
        } else {
            that.mediaConstraints = {
                mandatory: {
                    'OfferToReceiveVideo': false,
                    'OfferToReceiveAudio': false
                }
            };
            that.peerConnection.createOffer(setLocalDesc.bind(null, isSubscribe), errorCallback, 
                that.mediaConstraints);
        }

    };

    that.addStream = function (stream) {
        if(!stream){
           L.Logger.error('[tk-sdk]chromeStableStack addStream : stream is not exist!' );
           return;
        }
        that.peerConnection.addStream(stream);
    };

     //xueqiang change
    that.removeStream = function (stream) {
        that.peerConnection.removeStream(stream);
    };

    that.getStats = function(callback) { //todo bug
        if(callback && typeof callback === 'function'){
            if(that.peerConnection && that.peerConnection.getStats){
                try{
                    that.peerConnection.getStats(undefined , function (stats) {
                        callback(stats , undefined);
                    } , function (error) {
                        L.Logger.error('[tk-sdk]that.peerConnection.getStats error:' , error);
                        callback(undefined , -2); //-2：that.peerConnection.getStats 失败
                    } );
                    /*that.peerConnection.getStats().then(function(stats){
                        callback(stats , undefined);
                    }).catch(function (e1) {
                        L.Logger.error('[tk-sdk]that.peerConnection.getStats error:' , e1);
                        callback(undefined , -2);
                    });*/
                }catch (e){
                    L.Logger.error('[tk-sdk]that.peerConnection.getStats error:' , e);
                    callback(undefined , -3); //-3：that.peerConnection.getStats 出现错误
                }
            }else{
                callback(undefined , -1); //-1： 没有 that.peerConnection.getStats
            }
        }
    };
    
    spec.remoteCandidates = [];

    spec.remoteDescriptionSet = false;

    that.processSignalingMessage = function (msg , stream) {
        L.Logger.debug("[tk-sdk]Process Signaling Message ",  L.Utils.toJsonStringify(msg));
        if( msg.sdp && msg.type === "answer" ){
            var sdpString = msg.sdp  ;
            var index = sdpString.indexOf('udp') ;
            if(index !== -1 ){
                var _str = "" ;
                if(stream){
                    _str+= 'stream sdp info:stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes()) + '. \n';
                }
                _str += 'udp info:'+ (window.__TkSdkBuild__?L.Utils.encrypt( sdpString.substr(index , 58) ):sdpString.substr(index , 58) ) ;
                L.Logger.info(_str);
            }
        }
        if (msg.type === 'offer') {
            msg.sdp = setMaxBW(msg.sdp);
            that.peerConnection.setRemoteDescription(new RTCSessionDescription(msg), function () {
                that.peerConnection.createAnswer(setLocalDescp2p, function (error) {
                    L.Logger.error('[tk-sdk]createAnswer Error: ', error );
                }, that.mediaConstraints);
                spec.remoteDescriptionSet = true;
            }, function (error) {
                L.Logger.error('[tk-sdk]Error setting Remote Description',  error );
            });


        } else if (msg.type === 'answer') {
            L.Logger.debug('[tk-sdk]Set remote and local description');
            L.Logger.debug('[tk-sdk]Remote Description',  msg.sdp );
            L.Logger.debug('[tk-sdk]Local Description', localDesc.sdp  );

            msg.sdp = setMaxBW(msg.sdp);

            remoteDesc = msg;
            that.peerConnection.setLocalDescription(localDesc, function () {
                that.peerConnection.setRemoteDescription(
                  new RTCSessionDescription(msg), function () {
                    spec.remoteDescriptionSet = true;
                    L.Logger.debug('[tk-sdk]Candidates to be added: ', spec.remoteCandidates.length,
                                  spec.remoteCandidates);
                    while (spec.remoteCandidates.length > 0) {
                        // IMPORTANT: preserve ordering of candidates
                        that.peerConnection.addIceCandidate(spec.remoteCandidates.shift());
                    }
                    L.Logger.debug('[tk-sdk]Local candidates to send:', spec.localCandidates.length);
                    while (spec.localCandidates.length > 0) {
                        // IMPORTANT: preserve ordering of candidates
                        spec.callback({type: 'candidate', candidate: spec.localCandidates.shift()});
                    }
                  });
            });

        } else if (msg.type === 'candidate') {
            try {
                var obj;
                if (typeof(msg.candidate) === 'object') {
                    obj = msg.candidate;
                } else {
                    obj = L.Utils.toJsonParse(msg.candidate);
                }
                if (obj.candidate === 'end') {
                    // ignore the end candidate for chrome
                    return;
                }
                obj.candidate = obj.candidate.replace(/a=/g, '');
                obj.sdpMLineIndex = parseInt(obj.sdpMLineIndex);
                var candidate = new RTCIceCandidate(obj);
                if (spec.remoteDescriptionSet) {
                    that.peerConnection.addIceCandidate(candidate);
                } else {
                    spec.remoteCandidates.push(candidate);
                }
            } catch (e) {
                L.Logger.error('[tk-sdk]Error parsing candidate', msg.candidate);
            }
        }
    };

    return that;
};
/*global L, console, RTCSessionDescription, webkitRTCPeerConnection, RTCIceCandidate*/
'use strict';
var TK = TK || {};

TK.BowserStack = function (spec) {
    var that = {},
        WebkitRTCPeerConnection = webkitRTCPeerConnection;

    that.pcConfig = {
        'iceServers': []
    };

    that.con = {'optional': [{'DtlsSrtpKeyAgreement': true}]};

    if (spec.stunServerUrl !== undefined) {
        that.pcConfig.iceServers.push({'url': spec.stunServerUrl});
    }

    if ((spec.turnServer || {}).url) {
        that.pcConfig.iceServers.push({'username': spec.turnServer.username,
                                       'credential': spec.turnServer.password,
                                       'url': spec.turnServer.url});
    }

    if (spec.audio === undefined) {
        spec.audio = true;
    }

    if (spec.video === undefined) {
        spec.video = true;
    }

    that.mediaConstraints = {
            'offerToReceiveVideo': spec.video,
            'offerToReceiveAudio': spec.audio
    };

    that.peerConnection = new WebkitRTCPeerConnection(that.pcConfig, that.con);

    spec.remoteDescriptionSet = false;

    var setMaxBW = function (sdp) {
        var a, r;
        if (spec.maxVideoBW) {
            a = sdp.match(/m=video.*\r\n/);
            if (a == null){
              a = sdp.match(/m=video.*\n/);
            }
            if (a && (a.length > 0)) {
                r = a[0] + 'b=AS:' + spec.maxVideoBW + '\r\n';
                sdp = sdp.replace(a[0], r);
            }
        }

        if (spec.maxAudioBW) {
            a = sdp.match(/m=audio.*\r\n/);
            if (a == null){
              a = sdp.match(/m=audio.*\n/);
            }
            if (a && (a.length > 0)) {
                r = a[0] + 'b=AS:' + spec.maxAudioBW + '\r\n';
                sdp = sdp.replace(a[0], r);
            }
        }

        return sdp;
    };

    /**
     * Closes the connection.
     */
    that.close = function () {
        that.state = 'closed';
        that.peerConnection.close();
    };

    spec.localCandidates = [];

    that.peerConnection.onicecandidate =  function (event) {
        if (event.candidate) {
            if (!event.candidate.candidate.match(/a=/)) {
                event.candidate.candidate ='a=' + event.candidate.candidate;
            }


            if (spec.remoteDescriptionSet) {
                spec.callback({type:'candidate', candidate: event.candidate});
            } else {
                spec.localCandidates.push(event.candidate);
//                L.Logger.debug('Local Candidates stored: ',
//                             spec.localCandidates.length, spec.localCandidates);
            }

        } else {

          //  spec.callback(that.peerConnection.localDescription);
            L.Logger.debug('End of candidates.' , that.peerConnection.localDescription);
        }
    };

    that.peerConnection.onaddstream = function (stream) {
        if (that.onaddstream) {
            that.onaddstream(stream);
        }
    };

    that.peerConnection.onremovestream = function (stream) {
        if (that.onremovestream) {
            that.onremovestream(stream);
        }
    };

    var errorCallback = function(message){
      L.Logger.debug('Error in Stack ', message);
    };

    var localDesc;

    var setLocalDesc = function (sessionDescription) {
        sessionDescription.sdp = setMaxBW(sessionDescription.sdp);
//      sessionDescription.sdp = sessionDescription.sdp
//                                        .replace(/a=ice-options:google-ice\r\n/g, '');
        L.Logger.debug('Set local description', sessionDescription.sdp);
        localDesc = sessionDescription;
        that.peerConnection.setLocalDescription(localDesc, function(){
            L.Logger.debug('The final LocalDesc', that.peerConnection.localDescription);
          spec.callback(that.peerConnection.localDescription);
        }, errorCallback);
        //that.peerConnection.setLocalDescription(sessionDescription);
    };

    var setLocalDescp2p = function (sessionDescription) {
        sessionDescription.sdp = setMaxBW(sessionDescription.sdp);
//        sessionDescription.sdp = sessionDescription.sdp
//                                          .replace(/a=ice-options:google-ice\r\n/g, "");
        spec.callback(sessionDescription);
        localDesc = sessionDescription;
        that.peerConnection.setLocalDescription(sessionDescription);
    };

    that.createOffer = function (isSubscribe) {
      if (isSubscribe===true)
        that.peerConnection.createOffer(setLocalDesc, errorCallback, that.mediaConstraints);
      else
        that.peerConnection.createOffer(setLocalDesc, errorCallback);

    };

    that.addStream = function (stream) {
        that.peerConnection.addStream(stream);
    };
    spec.remoteCandidates = [];


    that.processSignalingMessage = function (msg) {
        L.Logger.debug('Process Signaling Message', msg);

        if (msg.type === 'offer') {
            msg.sdp = setMaxBW(msg.sdp);
            that.peerConnection.setRemoteDescription(new RTCSessionDescription(msg));
            that.peerConnection.createAnswer(setLocalDescp2p, null, that.mediaConstraints);
            spec.remoteDescriptionSet = true;

        } else if (msg.type === 'answer') {

            L.Logger.debug('Set remote description', msg.sdp);

            msg.sdp = setMaxBW(msg.sdp);

            that.peerConnection.setRemoteDescription(new RTCSessionDescription(msg), function() {
              spec.remoteDescriptionSet = true;
              L.Logger.debug('Candidates to be added: ', spec.remoteCandidates.length);
              while (spec.remoteCandidates.length > 0) {
                L.Logger.debug('Candidate :', spec.remoteCandidates[spec.remoteCandidates.length-1]);
                that.peerConnection.addIceCandidate(spec.remoteCandidates.shift(),
                                                    function(){},
                                                    errorCallback);

              }
//              L.Logger.debug('Local candidates to send:' , spec.localCandidates.length);
              while(spec.localCandidates.length > 0) {
                spec.callback({type:'candidate', candidate: spec.localCandidates.shift()});
              }

            }, function(){L.Logger.warning('Error Setting Remote Description');});

        } else if (msg.type === 'candidate') {
            L.Logger.debug('Message with candidate');
            try {
                var obj;
                if (typeof(msg.candidate) === 'object') {
                    obj = msg.candidate;
                } else {
                    obj = L.Utils.toJsonParse(msg.candidate);
                }
//                obj.candidate = obj.candidate.replace(/ generation 0/g, "");
//                obj.candidate = obj.candidate.replace(/ udp /g, " UDP ");
                obj.candidate = obj.candidate.replace(/a=/g, '');
                obj.sdpMLineIndex = parseInt(obj.sdpMLineIndex);
                obj.sdpMLineIndex = obj.sdpMid === 'audio' ? 0 : 1;
                var candidate = new RTCIceCandidate(obj);
                L.Logger.debug('Remote Candidate', candidate);
                if (spec.remoteDescriptionSet) {
                    that.peerConnection.addIceCandidate(candidate, function(){}, errorCallback);
                } else {
                    spec.remoteCandidates.push(candidate);
                }
            } catch(e) {
                L.Logger.error('[tk-sdk]Error parsing candidate', msg.candidate);
            }
        }
    };

    return that;
};
/*global L, window, RTCSessionDescription, webkitRTCPeerConnection*/
'use strict';

var TK = TK || {};

TK.ChromeCanaryStack = function (spec) {
    var that = {},
        WebkitRTCPeerConnection = webkitRTCPeerConnection;

    that.pcConfig = {
        'iceServers': []
    };

    that.con = {'optional': [{'DtlsSrtpKeyAgreement': true}]};

    if (spec.stunServerUrl !== undefined) {
        that.pcConfig.iceServers.push({'url': spec.stunServerUrl});
    }

    if ((spec.turnServer || {}).url) {
        that.pcConfig.iceServers.push({'username': spec.turnServer.username,
                                       'credential': spec.turnServer.password,
                                       'url': spec.turnServer.url});
    }

    if (spec.audio === undefined || spec.nop2p) {
        spec.audio = true;
    }

    if (spec.video === undefined || spec.nop2p) {
        spec.video = true;
    }

    that.mediaConstraints = {
        'mandatory': {
            'OfferToReceiveVideo': spec.video,
            'OfferToReceiveAudio': spec.audio
        }
    };

    that.roapSessionId = 103;

    that.peerConnection = new WebkitRTCPeerConnection(that.pcConfig, that.con);

    that.peerConnection.onicecandidate = function (event) {
        L.Logger.debug('[tk-sdk]PeerConnection: ', spec.sessionId);
        if (!event.candidate) {
            // At the moment, we do not renegotiate when new candidates
            // show up after the more flag has been false once.
            L.Logger.debug('[tk-sdk]State: ' + that.peerConnection.iceGatheringState);

            if (that.ices === undefined) {
                that.ices = 0;
            }
            that.ices = that.ices + 1;
            if (that.ices >= 1 && that.moreIceComing) {
                that.moreIceComing = false;
                that.markActionNeeded();
            }
        } else {
            that.iceCandidateCount += 1;
        }
    };

    //L.Logger.debug('[tk-sdk]Created webkitRTCPeerConnnection with config \"' +
    //                                  L.Utils.toJsonStringify(that.pcConfig) + '\".');

    var setMaxBW = function (sdp) {
        var r, a;
        if (spec.maxVideoBW) {
            a = sdp.match(/m=video.*\r\n/);
            if (a && (a.length > 0)) {
                r = a[0] + 'b=AS:' + spec.maxVideoBW + '\r\n';
                sdp = sdp.replace(a[0], r);
            }
        }

        if (spec.maxAudioBW) {
            a = sdp.match(/m=audio.*\r\n/);
            if (a && (a.length > 0)) {
                r = a[0] + 'b=AS:' + spec.maxAudioBW + '\r\n';
                sdp = sdp.replace(a[0], r);
            }
        }

        return sdp;
    };

    /**
     * This function processes signalling messages from the other side.
     * @param {string} msgstring JSON-formatted string containing a ROAP message.
     */
    that.processSignalingMessage = function (msgstring) {
        // Offer: Check for glare and resolve.
        // Answer/OK: Remove retransmit for the msg this is an answer to.
        // Send back "OK" if this was an Answer.
        L.Logger.debug('[tk-sdk]Activity on conn ' + that.sessionId);
        var msg = L.Utils.toJsonParse(msgstring), sd;
        that.incomingMessage = msg;

        if (that.state === 'new') {
            if (msg.messageType === 'OFFER') {
                // Initial offer.
                sd = {
                    sdp: msg.sdp,
                    type: 'offer'
                };
                that.peerConnection.setRemoteDescription(new RTCSessionDescription(sd));

                that.state = 'offer-received';
                // Allow other stuff to happen, then reply.
                that.markActionNeeded();
            } else {
                that.error('Illegal message for this state: ' + msg.messageType +
                           ' in state ' + that.state);
            }

        } else if (that.state === 'offer-sent') {
            if (msg.messageType === 'ANSWER') {

                //regExp = new RegExp(/m=video[\w\W]*\r\n/g);

                //exp = msg.sdp.match(regExp);
                //L.Logger.debug('[tk-sdk]' ,exp);

                //msg.sdp = msg.sdp.replace(regExp, exp + "b=AS:100\r\n");

                sd = {
                    sdp: msg.sdp,
                    type: 'answer'
                };
                L.Logger.debug('[tk-sdk]Received ANSWER: ', sd.sdp);

                sd.sdp = setMaxBW(sd.sdp);

                that.peerConnection.setRemoteDescription(new RTCSessionDescription(sd));
                that.sendOK();
                that.state = 'established';

            } else if (msg.messageType === 'pr-answer') {
                sd = {
                    sdp: msg.sdp,
                    type: 'pr-answer'
                };
                that.peerConnection.setRemoteDescription(new RTCSessionDescription(sd));

                // No change to state, and no response.
            } else if (msg.messageType === 'offer') {
                // Glare processing.
                that.error('Not written yet');
            } else {
                that.error('Illegal message for this state: ' + msg.messageType +
                           ' in state ' + that.state);
            }

        } else if (that.state === 'established') {
            if (msg.messageType === 'OFFER') {
                // Subsequent offer.
                sd = {
                    sdp: msg.sdp,
                    type: 'offer'
                };
                that.peerConnection.setRemoteDescription(new RTCSessionDescription(sd));

                that.state = 'offer-received';
                // Allow other stuff to happen, then reply.
                that.markActionNeeded();
            } else {
                that.error('Illegal message for this state: ' + msg.messageType +
                           ' in state ' + that.state);
            }
        }
    };

    /**
     * Adds a stream - this causes signalling to happen, if needed.
     * @param {MediaStream} stream The outgoing MediaStream to add.
     */
    that.addStream = function (stream) {
        that.peerConnection.addStream(stream);
        that.markActionNeeded();
    };

     //xueqiang change
    that.removeStream = function (stream) {
        that.peerConnection.removeStream(stream);
    };

    /**
     * Removes a stream.
     * @param {MediaStream} stream The MediaStream to remove.
     */
    that.removeStream = function () {
//        var i;
//        for (i = 0; i < that.peerConnection.localStreams.length; ++i) {
//            if (that.localStreams[i] === stream) {
//                that.localStreams[i] = null;
//            }
//        }
        that.markActionNeeded();
    };

    /**
     * Closes the connection.
     */
    that.close = function () {
        that.state = 'closed';
        that.peerConnection.close();
    };

    /**
     * Internal function: Mark that something happened.
     */
    that.markActionNeeded = function () {
        that.actionNeeded = true;
        that.doLater(function () {
            that.onstablestate();
        });
    };

    /**
     * Internal function: Do something later (not on this stack).
     * @param {function} what Callback to be executed later.
     */
    that.doLater = function (what) {
        // Post an event to myself so that I get called a while later.
        // (needs more JS/DOM info. Just call the processing function on a delay
        // for now.)
        window.setTimeout(what, 1);
    };

    /**
     * Internal function called when a stable state
     * is entered by the browser (to allow for multiple AddStream calls or
     * other interesting actions).
     * This function will generate an offer or answer, as needed, and send
     * to the remote party using our onsignalingmessage function.
     */
    that.onstablestate = function () {
        var mySDP;
        if (that.actionNeeded) {
            if (that.state === 'new' || that.state === 'established') {
                // See if the current offer is the same as what we already sent.
                // If not, no change is needed.

                that.peerConnection.createOffer(function (sessionDescription) {

                    sessionDescription.sdp = setMaxBW(sessionDescription.sdp);
                    L.Logger.debug('[tk-sdk]Changed', sessionDescription.sdp);

                    var newOffer = sessionDescription.sdp;

                    if (newOffer !== that.prevOffer) {

                        that.peerConnection.setLocalDescription(sessionDescription);

                        that.state = 'preparing-offer';
                        that.markActionNeeded();
                        return;
                    } else {
                        L.Logger.debug('[tk-sdk]Not sending a new offer');
                    }

                }, null, that.mediaConstraints);


            } else if (that.state === 'preparing-offer') {
                // Don't do anything until we have the ICE candidates.
                if (that.moreIceComing) {
                    return;
                }


                // Now able to send the offer we've already prepared.
                that.prevOffer = that.peerConnection.localDescription.sdp;
                L.Logger.debug('[tk-sdk]Sending OFFER: ' + that.prevOffer);
                //L.Logger.debug('[tk-sdk]Sent SDP is ' + that.prevOffer);
                that.sendMessage('OFFER', that.prevOffer);
                // Not done: Retransmission on non-response.
                that.state = 'offer-sent';

            } else if (that.state === 'offer-received') {

                that.peerConnection.createAnswer(function (sessionDescription) {
                    that.peerConnection.setLocalDescription(sessionDescription);
                    that.state = 'offer-received-preparing-answer';

                    if (!that.iceStarted) {
                        var now = new Date();
                        L.Logger.debug('[tk-sdk]'+now.getTime() + ': Starting ICE in responder');
                        that.iceStarted = true;
                    } else {
                        that.markActionNeeded();
                        return;
                    }

                }, null, that.mediaConstraints);

            } else if (that.state === 'offer-received-preparing-answer') {
                if (that.moreIceComing) {
                    return;
                }

                mySDP = that.peerConnection.localDescription.sdp;

                that.sendMessage('ANSWER', mySDP);
                that.state = 'established';
            } else {
                that.error('Dazed and confused in state ' + that.state + ', stopping here');
            }
            that.actionNeeded = false;
        }
    };

    /**
     * Internal function to send an "OK" message.
     */
    that.sendOK = function () {
        that.sendMessage('OK');
    };

    /**
     * Internal function to send a signalling message.
     * @param {string} operation What operation to signal.
     * @param {string} sdp SDP message body.
     */
    that.sendMessage = function (operation, sdp) {
        var roapMessage = {};
        roapMessage.messageType = operation;
        roapMessage.sdp = sdp; // may be null or undefined
        if (operation === 'OFFER') {
            roapMessage.offererSessionId = that.sessionId;
            roapMessage.answererSessionId = that.otherSessionId; // may be null
            roapMessage.seq = (that.sequenceNumber += 1);
            // The tiebreaker needs to be neither 0 nor 429496725.
            roapMessage.tiebreaker = Math.floor(Math.random() * 429496723 + 1);
        } else {
            roapMessage.offererSessionId = that.incomingMessage.offererSessionId;
            roapMessage.answererSessionId = that.sessionId;
            roapMessage.seq = that.incomingMessage.seq;
        }
        that.onsignalingmessage(L.Utils.toJsonStringify(roapMessage));
    };

    /**
     * Internal something-bad-happened function.
     * @param {string} text What happened - suitable for logging.
     */
    that.error = function (text) {
        throw 'Error in RoapOnJsep: ' + text;
    };

    that.sessionId = (that.roapSessionId += 1);
    that.sequenceNumber = 0; // Number of last ROAP message sent. Starts at 1.
    that.actionNeeded = false;
    that.iceStarted = false;
    that.moreIceComing = true;
    that.iceCandidateCount = 0;
    that.onsignalingmessage = spec.callback;

    that.peerConnection.onopen = function () {
        if (that.onopen) {
            that.onopen();
        }
    };

    that.peerConnection.onaddstream = function (stream) {
        if (that.onaddstream) {
            that.onaddstream(stream);
        }
    };

    that.peerConnection.onremovestream = function (stream) {
        if (that.onremovestream) {
            that.onremovestream(stream);
        }
    };

    that.peerConnection.oniceconnectionstatechange = function (e) {
        if (that.oniceconnectionstatechange) {
            that.oniceconnectionstatechange(e.currentTarget.iceConnectionState);
        }
    };

    // Variables that are part of the public interface of PeerConnection
    // in the 28 January 2012 version of the webrtc specification.
    that.onaddstream = null;
    that.onremovestream = null;
    that.state = 'new';
    // Auto-fire next events.
    that.markActionNeeded();
    return that;
};
/*global L, window, RTCSessionDescription, webkitRTCPeerConnection*/
'use strict';
var TK = TK || {};

TK.ChromeRoapStack = function (spec) {
    var that = {},
        WebkitRTCPeerConnection = webkitRTCPeerConnection;

    that.pcConfig = {
        'iceServers': []
    };

    that.con = {'optional': [{'DtlsSrtpKeyAgreement': true}]};

    if (spec.stunServerUrl !== undefined) {
        that.pcConfig.iceServers.push({'url': spec.stunServerUrl});
    }

    if ((spec.turnServer || {}).url) {
        that.pcConfig.iceServers.push({'username': spec.turnServer.username,
                                       'credential': spec.turnServer.password,
                                       'url': spec.turnServer.url});
    }

    if (spec.audio === undefined || spec.nop2p) {
        spec.audio = true;
    }

    if (spec.video === undefined || spec.nop2p) {
        spec.video = true;
    }

    that.mediaConstraints = {
        'mandatory': {
            'OfferToReceiveVideo': spec.video,
            'OfferToReceiveAudio': spec.audio
        }
    };

    that.roapSessionId = 103;

    that.peerConnection = new WebkitRTCPeerConnection(that.pcConfig, that.con);

    that.peerConnection.onicecandidate = function (event) {
        L.Logger.debug('[tk-sdk]PeerConnection: ', spec.sessionId);
        if (!event.candidate) {
            // At the moment, we do not renegotiate when new candidates
            // show up after the more flag has been false once.
            L.Logger.debug('[tk-sdk]onicecandidate state: ' + that.peerConnection.iceGatheringState);

            if (that.ices === undefined) {
                that.ices = 0;
            }
            that.ices = that.ices + 1;
            if (that.ices >= 1 && that.moreIceComing) {
                that.moreIceComing = false;
                that.markActionNeeded();
            }
        } else {
            that.iceCandidateCount += 1;
        }
    };

    var setMaxBW = function (sdp) {
        var r, a;
        if (spec.maxVideoBW) {
            a = sdp.match(/m=video.*\r\n/);
            if (a && (a.length > 0)) {
                r = a[0] + 'b=AS:' + spec.maxVideoBW + '\r\n';
                sdp = sdp.replace(a[0], r);
            }
        }

        if (spec.maxAudioBW) {
            a = sdp.match(/m=audio.*\r\n/);
            if (a && (a.length > 0)) {
                r = a[0] + 'b=AS:' + spec.maxAudioBW + '\r\n';
                sdp = sdp.replace(a[0], r);
            }
        }

        return sdp;
    };

    /**
     * This function processes signalling messages from the other side.
     * @param {string} msgstring JSON-formatted string containing a ROAP message.
     */
    that.processSignalingMessage = function (msgstring) {
        // Offer: Check for glare and resolve.
        // Answer/OK: Remove retransmit for the msg this is an answer to.
        // Send back "OK" if this was an Answer.
        L.Logger.debug('[tk-sdk]Activity on conn ' + that.sessionId);
        var msg = L.Utils.toJsonParse(msgstring), sd;
        that.incomingMessage = msg;

        if (that.state === 'new') {
            if (msg.messageType === 'OFFER') {
                // Initial offer.
                sd = {
                    sdp: msg.sdp,
                    type: 'offer'
                };
                that.peerConnection.setRemoteDescription(new RTCSessionDescription(sd));

                that.state = 'offer-received';
                // Allow other stuff to happen, then reply.
                that.markActionNeeded();
            } else {
                that.error('Illegal message for this state: ' + msg.messageType +
                           ' in state ' + that.state);
            }

        } else if (that.state === 'offer-sent') {
            if (msg.messageType === 'ANSWER') {

                //regExp = new RegExp(/m=video[\w\W]*\r\n/g);

                //exp = msg.sdp.match(regExp);
                //L.Logger.debug('[tk-sdk]' ,exp);

                //msg.sdp = msg.sdp.replace(regExp, exp + "b=AS:100\r\n");

                sd = {
                    sdp: msg.sdp,
                    type: 'answer'
                };
                L.Logger.debug('[tk-sdk]Received ANSWER: ',  sd.sdp  );

                sd.sdp = setMaxBW(sd.sdp);

                that.peerConnection.setRemoteDescription(new RTCSessionDescription(sd));
                that.sendOK();
                that.state = 'established';

            } else if (msg.messageType === 'pr-answer') {
                sd = {
                    sdp: msg.sdp,
                    type: 'pr-answer'
                };
                that.peerConnection.setRemoteDescription(new RTCSessionDescription(sd));

                // No change to state, and no response.
            } else if (msg.messageType === 'offer') {
                // Glare processing.
                that.error('Not written yet');
            } else {
                that.error('Illegal message for this state: ' + msg.messageType +
                           ' in state ' + that.state);
            }

        } else if (that.state === 'established') {
            if (msg.messageType === 'OFFER') {
                // Subsequent offer.
                sd = {
                    sdp: msg.sdp,
                    type: 'offer'
                };
                that.peerConnection.setRemoteDescription(new RTCSessionDescription(sd));

                that.state = 'offer-received';
                // Allow other stuff to happen, then reply.
                that.markActionNeeded();
            } else {
                that.error('Illegal message for this state: ' + msg.messageType +
                           ' in state ' + that.state);
            }
        }
    };

    /**
     * Adds a stream - this causes signalling to happen, if needed.
     * @param {MediaStream} stream The outgoing MediaStream to add.
     */
    that.addStream = function (stream) {
        that.peerConnection.addStream(stream);
        that.markActionNeeded();
    };
     //xueqiang change
    that.removeStream = function (stream) {
        that.peerConnection.removeStream(stream);
    };
    /**
     * Removes a stream.
     * @param {MediaStream} stream The MediaStream to remove.
     */
    that.removeStream = function () {
//        var i;
//        for (i = 0; i < that.peerConnection.localStreams.length; ++i) {
//            if (that.localStreams[i] === stream) {
//                that.localStreams[i] = null;
//            }
//        }
        that.markActionNeeded();
    };

    /**
     * Closes the connection.
     */
    that.close = function () {
        that.state = 'closed';
        that.peerConnection.close();
    };

    /**
     * Internal function: Mark that something happened.
     */
    that.markActionNeeded = function () {
        that.actionNeeded = true;
        that.doLater(function () {
            that.onstablestate();
        });
    };

    /**
     * Internal function: Do something later (not on this stack).
     * @param {function} what Callback to be executed later.
     */
    that.doLater = function (what) {
        // Post an event to myself so that I get called a while later.
        // (needs more JS/DOM info. Just call the processing function on a delay
        // for now.)
        window.setTimeout(what, 1);
    };

    /**
     * Internal function called when a stable state
     * is entered by the browser (to allow for multiple AddStream calls or
     * other interesting actions).
     * This function will generate an offer or answer, as needed, and send
     * to the remote party using our onsignalingmessage function.
     */
    that.onstablestate = function () {
        var mySDP;
        if (that.actionNeeded) {
            if (that.state === 'new' || that.state === 'established') {
                // See if the current offer is the same as what we already sent.
                // If not, no change is needed.

                that.peerConnection.createOffer(function (sessionDescription) {

                    sessionDescription.sdp = setMaxBW(sessionDescription.sdp);
                    L.Logger.debug('[tk-sdk]Changed', sessionDescription.sdp );

                    var newOffer = sessionDescription.sdp;

                    if (newOffer !== that.prevOffer) {

                        that.peerConnection.setLocalDescription(sessionDescription);

                        that.state = 'preparing-offer';
                        that.markActionNeeded();
                        return;
                    } else {
                        L.Logger.debug('[tk-sdk]Not sending a new offer');
                    }

                }, null, that.mediaConstraints);


            } else if (that.state === 'preparing-offer') {
                // Don't do anything until we have the ICE candidates.
                if (that.moreIceComing) {
                    return;
                }


                // Now able to send the offer we've already prepared.
                that.prevOffer = that.peerConnection.localDescription.sdp;
                L.Logger.debug('[tk-sdk]Sending OFFER: ' + that.prevOffer);
                //L.Logger.debug('[tk-sdk]Sent SDP is ' + that.prevOffer);
                that.sendMessage('OFFER', that.prevOffer);
                // Not done: Retransmission on non-response.
                that.state = 'offer-sent';

            } else if (that.state === 'offer-received') {

                that.peerConnection.createAnswer(function (sessionDescription) {
                    that.peerConnection.setLocalDescription(sessionDescription);
                    that.state = 'offer-received-preparing-answer';

                    if (!that.iceStarted) {
                        var now = new Date();
                        L.Logger.debug('[tk-sdk]'+now.getTime() + ': Starting ICE in responder');
                        that.iceStarted = true;
                    } else {
                        that.markActionNeeded();
                        return;
                    }

                }, null, that.mediaConstraints);

            } else if (that.state === 'offer-received-preparing-answer') {
                if (that.moreIceComing) {
                    return;
                }

                mySDP = that.peerConnection.localDescription.sdp;

                that.sendMessage('ANSWER', mySDP);
                that.state = 'established';
            } else {
                that.error('Dazed and confused in state ' + that.state + ', stopping here');
            }
            that.actionNeeded = false;
        }
    };

    /**
     * Internal function to send an "OK" message.
     */
    that.sendOK = function () {
        that.sendMessage('OK');
    };

    /**
     * Internal function to send a signalling message.
     * @param {string} operation What operation to signal.
     * @param {string} sdp SDP message body.
     */
    that.sendMessage = function (operation, sdp) {
        var roapMessage = {};
        roapMessage.messageType = operation;
        roapMessage.sdp = sdp; // may be null or undefined
        if (operation === 'OFFER') {
            roapMessage.offererSessionId = that.sessionId;
            roapMessage.answererSessionId = that.otherSessionId; // may be null
            roapMessage.seq = (that.sequenceNumber += 1);
            // The tiebreaker needs to be neither 0 nor 429496725.
            roapMessage.tiebreaker = Math.floor(Math.random() * 429496723 + 1);
        } else {
            roapMessage.offererSessionId = that.incomingMessage.offererSessionId;
            roapMessage.answererSessionId = that.sessionId;
            roapMessage.seq = that.incomingMessage.seq;
        }
        that.onsignalingmessage(L.Utils.toJsonStringify(roapMessage));
    };

    /**
     * Internal something-bad-happened function.
     * @param {string} text What happened - suitable for logging.
     */
    that.error = function (text) {
        throw 'Error in RoapOnJsep: ' + text;
    };

    that.sessionId = (that.roapSessionId += 1);
    that.sequenceNumber = 0; // Number of last ROAP message sent. Starts at 1.
    that.actionNeeded = false;
    that.iceStarted = false;
    that.moreIceComing = true;
    that.iceCandidateCount = 0;
    that.onsignalingmessage = spec.callback;

    that.peerConnection.onopen = function () {
        if (that.onopen) {
            that.onopen();
        }
    };

    that.peerConnection.onaddstream = function (stream) {
        if (that.onaddstream) {
            that.onaddstream(stream);
        }
    };

    that.peerConnection.onremovestream = function (stream) {
        if (that.onremovestream) {
            that.onremovestream(stream);
        }
    };

    that.peerConnection.oniceconnectionstatechange = function (e) {
        if (that.oniceconnectionstatechange) {
            that.oniceconnectionstatechange(e.currentTarget.iceConnectionState);
        }
    };

    // Variables that are part of the public interface of PeerConnection
    // in the 28 January 2012 version of the webrtc specification.
    that.onaddstream = null;
    that.onremovestream = null;
    that.state = 'new';
    // Auto-fire next events.
    that.markActionNeeded();
    return that;
};
/*global L, RTCSessionDescription, webkitRTCPeerConnection, RTCIceCandidate*/
'use strict';

var TK = TK || {};

TK.nativeEntry = function () {
    var native_entry = document.getElementById('tknative');
    if( !(native_entry &&  native_entry.nodeName && native_entry.nodeName.toLowerCase() === 'embed') ){
        native_entry = document.createElement('embed');
        document.body.appendChild(native_entry);
        native_entry.setAttribute('id', 'tknative');
        native_entry.setAttribute('mainentry', true);
        native_entry.setAttribute('hidden', true);
        native_entry.setAttribute('type', 'application/x-ppapi-proxy');
    }
    return native_entry;
};

TK.nativePeerConnection = function (spec) {
    var that = {};

    var connection_callbacks = {};
    var connection_id = spec.cnnId;
    var has_audio = spec.audio;
    var has_video = spec.video;
    var has_screen = spec.screen;
    var send_connection = true;

    if (has_screen === undefined){
        has_screen = false;
    }

    that.onicecandidate = null;

    that.onaddstream = null;

    that.onremovestream = null;

    that.oniceconnectionstatechange = null;

    var STREAM_TYPE = {
        VIDEO: 0,
        MEDIA: 1,
        SCREEN: 2
    };

    var getType = function () {
        if (spec.media)
            return STREAM_TYPE.MEDIA;
        if (spec.screen)
            return STREAM_TYPE.SCREEN;
        return STREAM_TYPE.VIDEO;
    }

    var getId = function () {
        if (!spec.cnnId)
            throw Error('Invalid native-peer-connection ID');
        if (spec.media)
            return spec.cnnId + ':media';
        if (spec.screen)
            return spec.cnnId + ':screen';
        return spec.cnnId;
    }

    var messageCallback = function(msg)
    {
        var funcName = msg.data.name;
        var cnnid = msg.data.connectionId;
        if (cnnid != getId())
        {
            return;
        }

        if (funcName === "onLocalDescription")
        {
            var strSdp = msg.data.sdp;
            var sdpObj = {};
            sdpObj.sdp = strSdp;
            sdpObj.type = "offer";
            if (typeof connection_callbacks["createOffer_suc"] === "function")
                connection_callbacks["createOffer_suc"](sdpObj);
            delete connection_callbacks["createOffer_suc"];
            delete connection_callbacks["createOffer_fai"];
        }

        if (funcName === "onIceCandidate")
        {
            if (that.onicecandidate) {
                var event = {};
                event.candidate = {};
                event.candidate.sdpMLineIndex = msg.data.sdpMLineIndex;
                event.candidate.sdpMid = msg.data.sdpMid;
                event.candidate.candidate = msg.data.candidate;
                that.onicecandidate(event);
            }
        }

        if (funcName === "onIceStatusChanged")
        {
            var state = msg.data.state;
            if (state == 1)
            {
                that.oniceconnectionstatechange("checking");
            }
            if (state == 2)
            {
                that.oniceconnectionstatechange("connected");
            }
            if (state == 3)
            {
                that.oniceconnectionstatechange("completed");
            }
            if (state == 4)
            {
                that.oniceconnectionstatechange("failed");
            }
            if (state == 5)
            {
                that.oniceconnectionstatechange("disconnected");
            }
            if (state == 6)
            {
                that.oniceconnectionstatechange("closed");
            }
        }

        if (funcName === "onAddStream")
        {
            that.onaddstream({stream: {}});
        }

        if (funcName === "onRemoveStream")
        {
        }        
    };

    tknative.addEventListener("message", messageCallback, false);

    that.close = function () {
        tknative.postMessage({command: "closeConnection", streamId: getId().toString(), offerToSend: send_connection, type: Number(getType())});
    };

    that.createOffer = function (successCallback, failureCallback, isSubscribe) {
        if (isSubscribe)
        {
            send_connection = false;
        }
        // bobo todo..
        // delete parameters includeLocalMedia,hasAudio,hasVideo,hasScreen
        tknative.postMessage({command: "createOffer", streamId: getId().toString(), includeLocalMedia: send_connection, hasAudio: has_audio, hasVideo: has_video, hasScreen: has_screen, offerToSend: send_connection});
        connection_callbacks["createOffer_suc"] = successCallback;
        connection_callbacks["createOffer_fai"] = failureCallback;
    };

    that.setRemoteDescription = function (sessionDescription, successCallback, errorCallback) {
        tknative.postMessage({command: "setRemoteDescription", sdpAnswer: sessionDescription.sdp, streamId: getId().toString()});

        if (successCallback && typeof successCallback === "function") {
            successCallback();    
        }
        
        // connection_callbacks["setRemoteDescription_suc"] = successCallback;
        // connection_callbacks["setRemoteDescription_fai"] = failureCallback;
    };

    that.addIceCandidate = function (candidateObj) {
        var cand = candidateObj.candidate;
        var lineIndex = candidateObj.sdpMLineIndex;
        tknative.postMessage({command: "setIceCandidate", candidate: cand, sdpMid: 0, sdpMLineIndex: lineIndex, streamId: getId().toString()});
    };

    that.addStream = function (stream) {
        tknative.postMessage({command: "addStream", streamId: getId().toString(), type: Number(getType())});
    };

    that.removeStream = function (stream) {
        tknative.postMessage({command: "removeStream", streamId: getId().toString(), type: Number(getType())});  
    };

    that.setLocalDescription = function (sessionDescription) {

    };

    that.getStats = function(callback) { //todo debug
        if(callback && typeof callback === 'function'){
            callback(undefined , -1);
        }
        // return undefined;
    }

    return that;
};
/*global L, RTCSessionDescription, webkitRTCPeerConnection, RTCIceCandidate*/
'use strict';

var TK = TK || {};

TK.TkNativeStack = function (spec) {
    var that = {},
        WebkitRTCPeerConnection = TK.nativePeerConnection,
        defaultSimulcastSpatialLayers = 2;

    that.isNative = true;

    that.pcConfig = {
        'iceServers': []
    };

    that.con = {'optional': [{'DtlsSrtpKeyAgreement': true}]};

    if (spec.iceServers !== undefined) {
        that.pcConfig.iceServers = spec.iceServers;
    }

    if (spec.audio === undefined) {
        spec.audio = true;
    }

    if (spec.video === undefined) {
        spec.video = true;
    }

    that.mediaConstraints = {
        mandatory: {
            'OfferToReceiveVideo': spec.video,
            'OfferToReceiveAudio': spec.audio
        }
    };

    var errorCallback = function (message) {
        L.Logger.error('Error in Stack ', message);
    };

    that.peerConnection = new WebkitRTCPeerConnection(spec);

    var addSim = function (spatialLayers) {
      var line = 'a=ssrc-group:SIM';
      spatialLayers.forEach(function(spatialLayerId) {
        line += ' ' + spatialLayerId;
      });
      return line + '\r\n';
    };

    var addGroup = function(spatialLayerId, spatialLayerIdRtx) {
      return 'a=ssrc-group:FID ' + spatialLayerId + ' ' + spatialLayerIdRtx + '\r\n';
    };

    var addSpatialLayer = function (cname, msid, mslabel, label, spatialLayerId, 
        spatialLayerIdRtx) {
      return  'a=ssrc:' + spatialLayerId + ' cname:' + cname +'\r\n' +
              'a=ssrc:' + spatialLayerId + ' msid:' + msid + '\r\n' +
              'a=ssrc:' + spatialLayerId + ' mslabel:' + mslabel + '\r\n' +
              'a=ssrc:' + spatialLayerId + ' label:' + label + '\r\n' +
              'a=ssrc:' + spatialLayerIdRtx + ' cname:' + cname +'\r\n' +
              'a=ssrc:' + spatialLayerIdRtx + ' msid:' + msid + '\r\n' +
              'a=ssrc:' + spatialLayerIdRtx + ' mslabel:' + mslabel + '\r\n' +
              'a=ssrc:' + spatialLayerIdRtx + ' label:' + label + '\r\n';
    };

    var enableSimulcast = function (sdp) {
      var result, matchGroup;
      if (!spec.video) {
        return sdp;
      }
      if (!spec.simulcast) {
        return sdp;
      }

      // TODO(javier): Improve the way we check for current video ssrcs
      matchGroup = sdp.match(/a=ssrc-group:FID ([0-9]*) ([0-9]*)\r?\n/);
      if (!matchGroup || (matchGroup.length <= 0)) {
        return sdp;
      }

      var numSpatialLayers = spec.simulcast.numSpatialLayers || defaultSimulcastSpatialLayers;
      var baseSsrc = parseInt(matchGroup[1]);
      var baseSsrcRtx = parseInt(matchGroup[2]);
      var cname = sdp.match(new RegExp('a=ssrc:' + matchGroup[1] + ' cname:(.*)\r?\n'))[1];
      var msid = sdp.match(new RegExp('a=ssrc:' + matchGroup[1] + ' msid:(.*)\r?\n'))[1];
      var mslabel = sdp.match(new RegExp('a=ssrc:' + matchGroup[1] + ' mslabel:(.*)\r?\n'))[1];
      var label = sdp.match(new RegExp('a=ssrc:' + matchGroup[1] + ' label:(.*)\r?\n'))[1];

      sdp.match(new RegExp('a=ssrc:' + matchGroup[1] + '.*\r?\n', 'g')).forEach(function(line) {
        sdp = sdp.replace(line, '');
      });
      sdp.match(new RegExp('a=ssrc:' + matchGroup[2] + '.*\r?\n', 'g')).forEach(function(line) {
        sdp = sdp.replace(line, '');
      });

      var spatialLayers = [baseSsrc];
      var spatialLayersRtx = [baseSsrcRtx];

      for (var i = 1; i < numSpatialLayers; i++) {
        spatialLayers.push(baseSsrc + i * 1000);
        spatialLayersRtx.push(baseSsrcRtx + i * 1000);
      }

      result = addSim(spatialLayers);
      var spatialLayerId;
      var spatialLayerIdRtx;
      for (var spatialLayerIndex in spatialLayers) {
        spatialLayerId = spatialLayers[spatialLayerIndex];
        spatialLayerIdRtx = spatialLayersRtx[spatialLayerIndex];
        result += addGroup(spatialLayerId, spatialLayerIdRtx);
      }

      for (var spatialLayerIndex in spatialLayers) {
        spatialLayerId = spatialLayers[spatialLayerIndex];
        spatialLayerIdRtx = spatialLayersRtx[spatialLayerIndex];
        result += addSpatialLayer(cname, msid, mslabel, label, spatialLayerId, spatialLayerIdRtx);
      }
      result += 'a=x-google-flag:conference\r\n';
      return sdp.replace(matchGroup[0], result);
    };

    var setMaxBW = function (sdp) {
        var r, a;
        if (spec.video && spec.maxVideoBW) {
            sdp = sdp.replace(/b=AS:.*\r\n/g, '');
            a = sdp.match(/m=video.*\r\n/);
            if (a == null) {
                a = sdp.match(/m=video.*\n/);
            }
            if (a && (a.length > 0)) {
                r = a[0] + 'b=AS:' + spec.maxVideoBW + '\r\n';
                sdp = sdp.replace(a[0], r);
            }
        }

        if (spec.audio && spec.maxAudioBW) {
            a = sdp.match(/m=audio.*\r\n/);
            if (a == null) {
                a = sdp.match(/m=audio.*\n/);
            }
            if (a && (a.length > 0)) {
                r = a[0] + 'b=AS:' + spec.maxAudioBW + '\r\n';
                sdp = sdp.replace(a[0], r);
            }
        }
        return sdp;
    };

    var enableOpusNacks = function (sdp) {
        var sdpMatch;
        sdpMatch = sdp.match(/a=rtpmap:(.*)opus.*\r\n/);
        if (sdpMatch !== null){
           var theLine = sdpMatch[0] + 'a=rtcp-fb:' + sdpMatch[1] + 'nack' + '\r\n';
           sdp = sdp.replace(sdpMatch[0], theLine);
        }

        return sdp;
    };

    /**
     * Closes the connection.
     */
    that.close = function () {
        that.state = 'closed';
        that.peerConnection.close();
    };

    spec.localCandidates = [];

    that.peerConnection.onicecandidate = function (event) {
        var candidateObject = {};
        if (!event.candidate) {
            L.Logger.debug('Gathered all candidates. Sending END candidate');
            candidateObject = {
                sdpMLineIndex: -1 ,
                sdpMid: 'end',
                candidate: 'end'
            };
        }else{

            if (!event.candidate.candidate.match(/a=/)) {
                event.candidate.candidate = 'a=' + event.candidate.candidate;
            }

            candidateObject = {
                sdpMLineIndex: event.candidate.sdpMLineIndex,
                sdpMid: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            };
        }

        if (spec.remoteDescriptionSet) {
            spec.callback({type: 'candidate', candidate: candidateObject});
        } else {
            spec.localCandidates.push(candidateObject);
            L.Logger.debug('Storing candidate: ', spec.localCandidates.length, candidateObject );
        }

    };

    that.peerConnection.onaddstream = function (stream) {
        if (that.onaddstream) {
            that.onaddstream(stream);
        }
    };

    that.peerConnection.onremovestream = function (stream) {
        if (that.onremovestream) {
            that.onremovestream(stream);
        }
    };

    that.peerConnection.oniceconnectionstatechange = function (iceConnectionState) {
        if (that.oniceconnectionstatechange){
            that.oniceconnectionstatechange(iceConnectionState);
        }
    };

    var localDesc;
    var remoteDesc;

    var setLocalDesc = function (isSubscribe, sessionDescription) {
        if (!isSubscribe) {
          sessionDescription.sdp = enableSimulcast(sessionDescription.sdp);
        }
        sessionDescription.sdp = setMaxBW(sessionDescription.sdp);
        sessionDescription.sdp = enableOpusNacks(sessionDescription.sdp);
        sessionDescription.sdp = sessionDescription.sdp.replace(/a=ice-options:google-ice\r\n/g,
                                                                '');
        spec.callback({
            type: sessionDescription.type,
            sdp: sessionDescription.sdp
        });
        localDesc = sessionDescription;
        //that.peerConnection.setLocalDescription(sessionDescription);
    };

    var setLocalDescp2p = function (sessionDescription) {
        sessionDescription.sdp = setMaxBW(sessionDescription.sdp);
        spec.callback({
            type: sessionDescription.type,
            sdp: sessionDescription.sdp
        });
        localDesc = sessionDescription;
        that.peerConnection.setLocalDescription(sessionDescription);
    };

    that.updateSpec = function (config, callback){
        if (config.maxVideoBW || config.maxAudioBW ){
            if (config.maxVideoBW){
                L.Logger.debug ('Maxvideo Requested:', config.maxVideoBW,
                                'limit:', spec.limitMaxVideoBW);
                if (config.maxVideoBW > spec.limitMaxVideoBW) {
                    config.maxVideoBW = spec.limitMaxVideoBW;
                }
                spec.maxVideoBW = config.maxVideoBW;
                L.Logger.debug ('Result', spec.maxVideoBW);
            }
            if (config.maxAudioBW) {
                if (config.maxAudioBW > spec.limitMaxAudioBW) {
                    config.maxAudioBW = spec.limitMaxAudioBW;
                }
                spec.maxAudioBW = config.maxAudioBW;
            }

            localDesc.sdp = setMaxBW(localDesc.sdp);
            if (config.Sdp || config.maxAudioBW){
                L.Logger.debug('Updating with SDP renegotiation', spec.maxVideoBW, spec.maxAudioBW);
                remoteDesc.sdp = setMaxBW(remoteDesc.sdp);
                that.peerConnection.setRemoteDescription(remoteDesc, function () {
                    spec.remoteDescriptionSet = true;
                    spec.callback({type:'updatestream', sdp: localDesc.sdp});
                });

            } else {
                L.Logger.debug ('Updating without SDP renegotiation, ' +
                                'newVideoBW:', spec.maxVideoBW,
                                'newAudioBW:', spec.maxAudioBW);
                spec.callback({type:'updatestream', sdp: localDesc.sdp});
            }
        }
        if (config.minVideoBW || (config.slideShowMode!==undefined) ||
            (config.muteStream !== undefined) || (config.qualityLayer !== undefined)){
            L.Logger.debug ('MinVideo Changed to ', config.minVideoBW);
            L.Logger.debug ('SlideShowMode Changed to ', config.slideShowMode);
            L.Logger.debug ('muteStream changed to ', config.muteStream);
            spec.callback({type: 'updatestream', config:config});
        }
    };

    that.createOffer = function (isSubscribe) {
        that.peerConnection.createOffer(setLocalDesc.bind(null, isSubscribe), errorCallback, isSubscribe);
    };

    that.addStream = function (stream) {
        // if(!stream){
        //    L.Logger.error('nativeStack addStream : stream is not exist!' );
        //    return;
        // }
        that.peerConnection.addStream(stream);
    };

    that.removeStream = function (stream) {
        that.peerConnection.removeStream(stream);
    };

    // that.getStats = function() {
    //     var RR = that.peerConnection.getStats();
    //     return RR;
    // };
    
    spec.remoteCandidates = [];

    spec.remoteDescriptionSet = false;

    that.processSignalingMessage = function (msg) {
        L.Logger.debug("Process Signaling Message", msg);

        // todo...
        // 这里应该不需要offer了吧？
        if (msg.type === 'offer') {
            msg.sdp = setMaxBW(msg.sdp);
            that.peerConnection.setRemoteDescription(msg.sdp, setLocalDescp2p, function (error) {
                    L.Logger.error('Error: ', error);
                });
        } else if (msg.type === 'answer') {
            L.Logger.debug('Set remote and local description');
            L.Logger.debug('Remote Description', msg.sdp);
            L.Logger.debug('Local Description', localDesc.sdp);

            msg.sdp = setMaxBW(msg.sdp);

            that.peerConnection.setRemoteDescription(
              new RTCSessionDescription(msg), function () {
                spec.remoteDescriptionSet = true;
                L.Logger.debug('Candidates to be added: ', spec.remoteCandidates.length,
                              spec.remoteCandidates);
                while (spec.remoteCandidates.length > 0) {
                    // IMPORTANT: preserve ordering of candidates
                    that.peerConnection.addIceCandidate(spec.remoteCandidates.shift());
                }
                L.Logger.debug('Local candidates to send:', spec.localCandidates.length);
                while (spec.localCandidates.length > 0) {
                    // IMPORTANT: preserve ordering of candidates
                    spec.callback({type: 'candidate', candidate: spec.localCandidates.shift()});
                }
            });

        } else if (msg.type === 'candidate') {
            try {
                var obj;
                if (typeof(msg.candidate) === 'object') {
                    obj = msg.candidate;
                } else {
                    obj = L.Utils.toJsonParse(msg.candidate);
                }
                if (obj.candidate === 'end') {
                    // ignore the end candidate for chrome
                    return;
                }
                obj.candidate = obj.candidate.replace(/a=/g, '');
                obj.sdpMLineIndex = parseInt(obj.sdpMLineIndex);
                var candidate = new RTCIceCandidate(obj);
                if (spec.remoteDescriptionSet) {
                    that.peerConnection.addIceCandidate(candidate);
                } else {
                    spec.remoteCandidates.push(candidate);
                }
            } catch (e) {
                L.Logger.error('Error parsing candidate', msg.candidate);
            }
        }
    };

    return that;
};
/*global L, window, chrome, navigator*/
'use strict';
var TK = TK || {};

TK.sessionId = 103;

TK.Connection = function (spec, isTkNative) {
    var that = {};

    spec.sessionId = (TK.sessionId += 1);

    // Check which WebRTC Stack is installed.
    that.browser = TK.getBrowser();

    if (isTkNative === true) {
        L.Logger.debug('Talk-Client Stack');
        that = TK.TkNativeStack(spec);
    }
    else if (that.browser === 'fake') {
        L.Logger.warning('[tk-sdk]Publish/subscribe video/audio streams not supported in erizofc yet');
        that = TK.FcStack(spec);
    } else if (that.browser === 'mozilla') {
        L.Logger.debug('[tk-sdk]Firefox Stack');
        that = TK.FirefoxStack(spec);
    } else if (that.browser === 'bowser'){
        L.Logger.debug('[tk-sdk]Bowser Stack');
        that = TK.BowserStack(spec);
    } else if (that.browser === 'chrome-stable' || that.browser === 'electron') {
        L.Logger.debug('[tk-sdk]Chrome Stable Stack');
        that = TK.TkChromeStableStack(spec);
    } else {
        L.Logger.error('[tk-sdk]No stack available for this browser');
        throw 'WebRTC stack not available';
    }

    if (!that.updateSpec){
        that.updateSpec = function(newSpec, callback){
            L.Logger.error('[tk-sdk]Update Configuration not implemented in this browser');
            if (callback)
                callback ('unimplemented');
        };
    }

    return that;
};

TK.getBrowser = function () {
    var browser = 'none';

    if (typeof module!=='undefined' && module.exports){
        browser = 'fake';
    }else if (window.navigator.userAgent.match('Firefox') !== null) {
        // Firefox
        browser = 'mozilla';
    } else if (window.navigator.userAgent.match('Bowser') !== null){
        browser = 'bowser';
    } else if (window.navigator.userAgent.match('Chrome') !== null) {
        browser = 'chrome-stable';
        if (window.navigator.userAgent.match('Electron') !== null) {
            browser = 'electron';
        }
    } else if (window.navigator.userAgent.match('Safari') !== null) {
        browser = 'bowser';
    } else if (window.navigator.userAgent.match('AppleWebKit') !== null) {
        browser = 'bowser';
    }
    return browser;
};


  /*global L, document*/
'use strict';
/*
 * Class Stream represents a local or a remote Stream in the Room. It will handle the WebRTC stream
 * and identify the stream and where it should be drawn.
 */
var TK = TK || {};

TK.Stream = function(spec, isTkNative) {
    var that = {};

    if (isTkNative === true) {
        that = TK.NativeStream(spec);
    }
    else {
        that = TK.StreamInner(spec);
    }
    return that;
};

TK.StreamInner = function (spec) {
    var that = TK.EventDispatcher(spec),
        getFrame, controlHandler;

    if(spec.video !== undefined && typeof spec.video === 'number'){
        spec.video = spec.video !== 0 ;
    }
    if(spec.audio !== undefined && typeof spec.audio === 'number'){
        spec.audio = spec.audio !== 0 ;
    }
    that.stream = spec.stream;
    that.url = spec.url;
    that.recording = spec.recording;
    that.room = undefined;
    that.playing = false;
    that.local = false;
    that.video = spec.video;
    that.audio = spec.audio;
    that.screen = spec.screen;
    that.videoSize = spec.videoSize;
    that.videoFrameRate = spec.videoFrameRate;
    that.extensionId = spec.extensionId;
    that.desktopStreamId = spec.desktopStreamId;
    that.videoMuted = false;
    that.audioMuted = false;
    that.attributes = spec.attributes || {} ;
    that.isTkNative = false;
    if(that.attributes.type === undefined){
        L.Logger.error('[tk-sdk]create stream spec.attributes.type is not exist , call video stream type must is video!');
    }
    if (that.videoSize !== undefined &&
        (!(that.videoSize instanceof Array) ||
        that.videoSize.length !== 4)) {
        throw Error('Invalid Video Size');
    }
    if (spec.local === undefined || spec.local === true) {
        that.local = true;
    }

    // Public functions
    that.getID = function () {
        var id;
        // Unpublished local streams don't yet have an ID.
        if (that.local && !spec.streamID) {
            id = 'local';
        }
        else {
            id = spec.streamID;
        }
        return id;
    };
    that.id = that.getID() ;

    // Get attributes of this stream.
    that.getAttributes = function () {
        return spec.attributes;
    };

    // Changes the attributes of this stream in the room.
    /* that.setAttributes = function (attributes) {
        if(spec.attributes){
            for(var key in attributes){
                spec.attributes[key] = attributes[key];
            }
        }
    };*/

    that.updateLocalAttributes = function (attrs) {
        if(attrs && typeof attrs === 'object'){
            for(var key in attrs){
                spec.attributes[key] = attrs[key] ;
            }
        }
    };

    // Indicates if the stream has audio activated
    that.hasAudio = function () {
        return spec.audio;
    };

    that.changeAudio = function (audio) {
        spec.audio = audio ;
    };

    // Indicates if the stream has video activated
    that.hasVideo = function () {
        return spec.video;
    };

    that.changeVideo = function (video) {
        spec.video = video ;
    };

    // Indicates if the stream has data activated
    that.hasData = function () {
        return spec.data;
    };

    that.changeData = function (data) {
        spec.data = data ;
    };

    // Indicates if the stream has screen activated
    that.hasScreen = function () {
        return spec.screen;
    };

    // It just use for C++ play film.
    that.hasMedia = function () {
        return false;
    }

    that.changeScreen  = function (screen ) {
        spec.screen = screen ;
    };

    // Sends data through this stream.
    that.sendData = function () {
        L.Logger.error('[tk-sdk]Failed to send data. This Stream object has not that channel enabled.');
    };

    // Initializes the stream and tries to retrieve a stream from local video and audio
    // We need to call this method before we can publish it in the room.
    that.init = function (dispatchGetUserMediaResult_Event , options) {
        options = options || {};
        if(options.initDeviceId ){
            if( typeof options.initDeviceId  === 'object' ){
                if(options.initDeviceId.videoinput){
                    L.Utils.localStorage.setItem(L.Constant.deviceStorage.videoinput , options.initDeviceId.videoinput );
                }
                if(options.initDeviceId.audioinput){
                    L.Utils.localStorage.setItem(L.Constant.deviceStorage.audioinput , options.initDeviceId.audioinput );
                }
                if(options.initDeviceId.audiooutput){
                    L.Utils.localStorage.setItem(L.Constant.deviceStorage.audiooutput , options.initDeviceId.audiooutput );
                }
            }else{
                L.Logger.warning('[tk-sdk]stream.init options.initDeviceId must is json , key is (videoinput | audioinput | audiooutput )!');
            }
        }
        var streamEvent;
        try {
            // if ( (spec.audio || spec.video || spec.screen) && spec.url === undefined) {
            if ( (spec.audio || spec.video) && spec.url === undefined) {
                L.Logger.debug('[tk-sdk]Requested access to local media');

                var _handlerGotStream = function (stream) {
                    L.Logger.debug('[tk-sdk]User has granted access to local media.');
                    that.stream = stream;
                    var getUserMediaFailureCode = undefined;
                    if(that.stream && that.stream.getUserMediaFailureCode !== undefined){
                        getUserMediaFailureCode = that.stream.getUserMediaFailureCode ;
                    }
                    streamEvent = TK.StreamEvent({type: 'access-accepted' , message: {getUserMediaFailureCode:getUserMediaFailureCode}});
                    that.dispatchEvent(streamEvent);

                    that.stream.getTracks().forEach(function (track) {
                        track.onended = function () {
                            that.stream.getTracks().forEach(function (track) {
                                track.onended = null;
                            });
                            streamEvent = TK.StreamEvent({
                                type: 'stream-ended', stream: that,
                                message: track.kind
                            });
                            that.dispatchEvent(streamEvent);
                        };
                    });

                };
                var _handlerfailStream = function (error) {
                    L.Logger.error('[tk-sdk]Failed to get access to local media. Error name was ' +
                        error.name + '.', error);
                    var errorcode = L.Constant.accessDenied.streamFail , errormsg = error ;
                    var streamEvent = TK.StreamEvent({type: 'access-denied', message: {code:errorcode , msg:errormsg}});
                    that.dispatchEvent(streamEvent);
                };
                var specifiedConstraints = {dispatchEvent:dispatchGetUserMediaResult_Event , isDemotionLocalStream:true  , isNeedCheckChangeLocalStream:true , isStopLocalStream:true};
                var userMediaConfig = {
                    audio: spec.audio?{
                            sourceId:L.Utils.localStorage.getItem(L.Constant.deviceStorage.audioinput) ,
                        }:false ,
                    video:spec.video?{
                        sourceId:L.Utils.localStorage.getItem(L.Constant.deviceStorage.videoinput) ,
                    }:false ,
                };
                TK.AVMgr.getUserMedia(_handlerGotStream, _handlerfailStream, userMediaConfig  , specifiedConstraints);
            } else {
                var errormsg = undefined , errorcode = undefined ;
                if(!spec.audio && !spec.video){
                    errormsg = "There\'s no audio or video equipment";
                    errorcode = L.Constant.accessDenied.notAudioAndVideo ;
                }else{
                    errormsg = "There\'s no audio or video or screen equipment , or url is not undefined";
                    errorcode = L.Constant.accessDenied.notAudioAndVideoAndScreenOrUrlNotUndefined ;
                }
                L.Logger.warning('[tk-sdk]'+errormsg , errorcode);
                streamEvent = TK.StreamEvent({type: 'access-denied', message: {code:errorcode , msg:errormsg}});
                that.dispatchEvent(streamEvent);
            }
        } catch (e) {
            var errorcode =  L.Constant.accessDenied.ohterError   , errormsg ='[tk-sdk]Failed to get access to local media. Error was ' + e + '.' ;
            L.Logger.error(errormsg);
            streamEvent = TK.StreamEvent({type: 'access-denied', message: {code:errorcode , msg:errormsg}});
            that.dispatchEvent(streamEvent);
        }
    };

    that.close = function () {
        if (that.local) {
            if (that.room !== undefined) {
                that.room.unpublish(that);
            }
            // Remove HTML element
            that.hide();
            if (that.stream !== undefined) {
                that.stream.getTracks().forEach(function (track) {
                    track.onended = null;
                    track.stop();
                });
            }
            that.stream = undefined;
        }
    };

    that.play = function (elementID, options) {
        options = options || {};
        that.elementID = elementID;
        var player;
        /* if (that.hasVideo() || this.hasScreen()) {*/
        // Draw on HTML
        if (elementID !== undefined) {
            player = new TK.VideoPlayer({
                id: that.getID(),
                stream: that,
                elementID: elementID,
                options: options
            });
            that.player = player;
            that.playing = true;
        }
        /*        } else if (that.hasAudio) {
         player = new TK.AudioPlayer({id: that.getID(),
         stream: that,
         elementID: elementID,
         options: options});
         that.player = player;
         that.playing = true;
         }*/
    };

    that.stop = function () {
        if (that.playing) {
            if (that.player !== undefined) {
                that.player.destroy();
                that.playing = false;
            }
        }
    };

    that.show = function () {
        if (that.player !== undefined ) {
            that.player.showVideo();
        }
    };

    that.hide = function () {
        if (that.player !== undefined ) {
            that.player.hideVideo();
        }
    };

    getFrame = function () {
        if (that.player !== undefined && that.stream !== undefined) {
            var video = that.player.video,

                style = document.defaultView.getComputedStyle(video),
                width = parseInt(style.getPropertyValue('width'), 10),
                height = parseInt(style.getPropertyValue('height'), 10),
                left = parseInt(style.getPropertyValue('left'), 10),
                top = parseInt(style.getPropertyValue('top'), 10);

            var div;
            if (typeof that.elementID === 'object' &&
                typeof that.elementID.appendChild === 'function') {
                div = that.elementID;
            }
            else {
                div = document.getElementById(that.elementID);
            }

            var divStyle = document.defaultView.getComputedStyle(div),
                divWidth = parseInt(divStyle.getPropertyValue('width'), 10),
                divHeight = parseInt(divStyle.getPropertyValue('height'), 10),

                canvas = document.createElement('canvas'),
                context;

            canvas.id = 'testing';
            canvas.width = divWidth;
            canvas.height = divHeight;
            canvas.setAttribute('style', 'display: none');
            //document.body.appendChild(canvas);
            context = canvas.getContext('2d');

            context.drawImage(video, left, top, width, height);

            return canvas;
        } else {
            return null;
        }
    };

    that.getVideoFrameURL = function (format) {
        var canvas = getFrame();
        if (canvas !== null) {
            if (format) {
                return canvas.toDataURL(format);
            } else {
                return canvas.toDataURL();
            }
        } else {
            return null;
        }
    };

    that.getVideoFrame = function () {
        var canvas = getFrame();
        if (canvas !== null) {
            return canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
        } else {
            return null;
        }
    };

    that.checkOptions = function (config, isUpdate) {
        //TODO: Check for any incompatible options
        if (isUpdate === true) {  // We are updating the stream
            if (config.video || config.audio || config.screen) {
                L.Logger.warning('[tk-sdk]Cannot update type of subscription');
                config.video = undefined;
                config.audio = undefined;
                config.screen = undefined;
            }
        } else {  // on publish or subscribe
            if (that.local === false) { // check what we can subscribe to
                if (config.video === true && that.hasVideo() === false) {
                    L.Logger.warning('[tk-sdk]Trying to subscribe to video when there is no ' +
                        'video, won\'t subscribe to video');
                    config.video = false;
                }
                if (config.audio === true && that.hasAudio() === false) {
                    L.Logger.warning('[tk-sdk]Trying to subscribe to audio when there is no ' +
                        'audio, won\'t subscribe to audio');
                    config.audio = false;
                }
            }
        }
        if (that.local === false) {
            if (!that.hasVideo() && (config.slideShowMode === true)) {
                L.Logger.warning('[tk-sdk]Cannot enable slideShowMode if it is not a video ' +
                    'subscription, please check your parameters');
                config.slideShowMode = false;
            }
        }
    };

    that.updateMuteToServer = function (callback) {
        if (that.room && that.room.p2p) {
            L.Logger.warning('[tk-sdk]muteAudio is not implemented in p2p streams');
            callback('error');
            return;
        }

        if (that.pc === undefined) {
            return;
        }

        var config = {muteStream: {video:that.videoMuted, audio:that.audioMuted}};
        that.checkOptions(config, true);
        that.pc.updateSpec(config, callback);
    };
    that._setQualityLayer = function (spatialLayer, temporalLayer, callback) {
        if (that.room && that.room.p2p) {
            L.Logger.warning('[tk-sdk]setQualityLayer is not implemented in p2p streams');
            callback('error');
            return;
        }
        var config = {qualityLayer: {spatialLayer: spatialLayer, temporalLayer: temporalLayer}};
        that.checkOptions(config, true);
        that.pc.updateSpec(config, callback);
    };

    controlHandler = function (handlers, publisherSide, enable) {

        if (publisherSide !== true) publisherSide = false;

        handlers = (typeof handlers === 'string') ? [handlers] : handlers;
        handlers = (handlers instanceof Array) ? handlers : [];

        if (handlers.length > 0) {
            that.room.sendControlMessage(that, 'control', {
                name: 'controlhandlers',
                enable: enable,
                publisherSide: publisherSide,
                handlers: handlers
            });
        }
    };

    that.disableHandlers = function (handlers, publisherSide) {
        controlHandler(handlers, publisherSide, false);
    };

    that.enableHandlers = function (handlers, publisherSide) {
        controlHandler(handlers, publisherSide, true);
    };

    that.updateConfiguration = function (config, callback) {
        if (config === undefined)
            return;
        if (that.pc) {
            that.checkOptions(config, true);
            if (that.local) {
                if (that.room.p2p) {
                    for (var index in that.pc) {
                        that.pc[index].updateSpec(config, callback);
                    }
                } else {
                    that.pc.updateSpec(config, callback);
                }

            } else {
                that.pc.updateSpec(config, callback);
            }
        } else {
            callback('This stream has no peerConnection attached, ignoring');
        }
    };

    that.muteVideo = function (mute, callback) {
        if (that.videoMuted == mute)
            return;
		that.videoMuted = mute ;
        if (that.stream !== undefined) {
            that.stream.getTracks().forEach(function (track) {
                if (track.kind === 'video') {
                    track.enabled = !mute;
                }
            });
            that.updateMuteToServer(callback);
        } else {
            L.Logger.warning("[tk-sdk]not deviceStream to muteVideo");
        };
    };

    that.muteAudio = function (mute, callback) {

        if (that.audioMuted == mute)
            return;

        that.audioMuted = mute;
        if (that.stream !== undefined) {
            that.stream.getTracks().forEach(function (track) {
                if (track.kind === 'audio') {
                    track.enabled = !mute;
                }
            });

            that.updateMuteToServer(callback);
        } else {
            L.Logger.warning("[tk-sdk]not deviceStream to muteVideo");
        }

    };

    return that;
};
/*global L, document*/
'use strict';
/*
 * Class Stream represents a local or a remote Stream in the Room. It will handle the WebRTC stream
 * and identify the stream and where it should be drawn.
 */
var TK = TK || {};

TK.NativeStream = function (spec) {
    var that = TK.EventDispatcher(spec),
        getFrame, controlHandler;

    that.stream = spec.stream;
    that.url = spec.url;
    that.recording = spec.recording;
    that.room = undefined;
    that.playing = false;
    that.local = false;
    that.video = spec.video;
    that.audio = spec.audio;
    that.screen = spec.screen;
    that.media = spec.media;
    that.videoSize = spec.videoSize;
    that.videoFrameRate = spec.videoFrameRate;
    that.extensionId = spec.extensionId;
    that.desktopStreamId = spec.desktopStreamId;
    that.path = spec.path;
    that.videoMuted = false;
    that.audioMuted = false;
    that.isTkNative = true;

    var STREAM_TYPE = {
        VIDEO: 0,
        MEDIA: 1,
        SCREEN: 2
    };

    if (that.videoSize !== undefined &&
        (!(that.videoSize instanceof Array) ||
        that.videoSize.length !== 4)) {
        throw Error('Invalid Video Size');
    }
    if (spec.local === undefined || spec.local === true) {
        that.local = true;
    }
    if (spec.screen && spec.media) {
        throw Error('Wrong stream type which contains both media and screen');
    }
    if (!that.path)
    {
        that.path = "";
    }

    // Public functions

    var getType = function () {
        if (that.media)
            return STREAM_TYPE.MEDIA;
        if (that.screen)
            return STREAM_TYPE.SCREEN;
        return STREAM_TYPE.VIDEO;
    }

    var getNativeId = function () {
        return spec.extensionId;
    }

    that.getID = function () {
        var id;
        // Unpublished local streams don't yet have an ID.
        if (that.local && !spec.streamID) {
            id = 'local';
        }
        else {
            id = spec.streamID;
        }
        return id;
    };

    // Get attributes of this stream.
    that.getAttributes = function () {
        return spec.attributes;
    };

    // Changes the attributes of this stream in the room.
 /*   that.setAttributes = function (attributes) {
        if(spec.attributes){
            for(var key in attributes){
                spec.attributes[key] = attributes[key];
            }
        }
    };*/

    that.updateLocalAttributes = function (attrs) {
        if(attrs && typeof attrs === 'object'){
            for(var key in attrs){
                spec.attributes[key] = attrs[key] ;
            }
        }
    };

    // Indicates if the stream has audio activated
    that.hasAudio = function () {
        return spec.audio;
    };

    // Indicates if the stream has video activated
    that.hasVideo = function () {
        return spec.video;
    };

    // Indicates if the stream has data activated
    that.hasData = function () {
        return spec.data;
    };

    // Indicates if the stream has screen activated
    that.hasScreen = function () {
        return spec.screen;
    };

    that.hasMedia = function () {
        return spec.media;
    }

    // Sends data through this stream.
    that.sendData = function () {
        L.Logger.error('[tk-sdk]Failed to send data. This Stream object has not that channel enabled.');
    };

    // Initializes the stream and tries to retrieve a stream from local video and audio
    // We need to call this method before we can publish it in the room.
    that.init = function () {
        var streamEvent;
        try {
            if ((spec.audio || spec.video || spec.screen) && spec.url === undefined) {
                L.Logger.debug('[tk-sdk]Requested access to local media');
                var videoOpt = spec.video;
                if (videoOpt === true || spec.screen === true) {
                    videoOpt = videoOpt === true ? {} : videoOpt;
                    if (that.videoSize !== undefined) {
                        videoOpt.mandatory = videoOpt.mandatory || {};
                        videoOpt.mandatory.minWidth = that.videoSize[0];
                        videoOpt.mandatory.minHeight = that.videoSize[1];
                        videoOpt.mandatory.maxWidth = that.videoSize[2];
                        videoOpt.mandatory.maxHeight = that.videoSize[3];
                    }

                    if (that.videoFrameRate !== undefined) {
                        videoOpt.optional = videoOpt.optional || [];
                        videoOpt.optional.push({minFrameRate: that.videoFrameRate[0]});
                        videoOpt.optional.push({maxFrameRate: that.videoFrameRate[1]});
                    }

                } else if (spec.screen === true && videoOpt === undefined) {
                    videoOpt = true;
                }
                var opt = {
                    video: videoOpt,
                    audio: spec.audio,
                    fake: spec.fake,
                    screen: spec.screen,
                    extensionId: that.extensionId,
                    desktopStreamId: that.desktopStreamId
                };
                // todo...
                // 在nativeAVMgr中构造流
                // 在nativePeerConnection中构造流
                var _handlerGotStream = function (stream) {
                    L.Logger.debug('[tk-sdk]User has granted access to local media.');
                    that.stream = stream;

                    streamEvent = TK.StreamEvent({type: 'access-accepted'});
                    that.dispatchEvent(streamEvent);

                    // that.stream.getTracks().forEach(function (track) {
                    //     track.onended = function () {
                    //         that.stream.getTracks().forEach(function (track) {
                    //             track.onended = null;
                    //         });
                    //         streamEvent = TK.StreamEvent({
                    //             type: 'stream-ended', stream: that,
                    //             msg: track.kind
                    //         });
                    //         that.dispatchEvent(streamEvent);
                    //     };
                    // });

                };
                var _handlerfailStream = function (error) {
                    L.Logger.error('[tk-sdk]Failed to get access to local media. Error name was ' +
                        error.name + '.', error );
                    var streamEvent = TK.StreamEvent({type: 'access-denied', msg: error});
                    that.dispatchEvent(streamEvent);
                };
                TK.AVMgr.getUserMedia(_handlerGotStream, _handlerfailStream, opt  , {isDemotionLocalStream:true , isNeedCheckChangeLocalStream:true , isStopLocalStream:true});
            } else {
                streamEvent = TK.StreamEvent({type: 'access-accepted'});
                that.dispatchEvent(streamEvent);
            }
        } catch (e) {
            L.Logger.error('[tk-sdk]Failed to get access to local media. Error was:'  ,e );
            streamEvent = TK.StreamEvent({type: 'access-denied', msg: e});
            that.dispatchEvent(streamEvent);
        }
    };

    that.close = function () {
        if (that.local) {
            if (that.room !== undefined) {
                that.room.unpublish(that);
            }
            // Remove HTML element
            that.hide();
            // if (that.stream !== undefined) {
            //     that.stream.getTracks().forEach(function (track) {
            //         track.onended = null;
            //         track.stop();
            //     });
            // }
            that.stream = undefined;
        }
    };

    that.create = function () {
        if (that.local) {
            tknative.postMessage({command: "playStream", connectionId: getNativeId().toString(), isLocal: true, type: Number(getType()), args: {path: that.path.toString()}});
        }
        else {
            tknative.postMessage({command: "playStream", connectionId: getNativeId().toString(), isLocal: false, type: Number(getType())});
        }
    }

    that.destroy = function () {
        if (that.local) {
            tknative.postMessage({command: "stopStream", connectionId: getNativeId().toString(), isLocal: true, type: Number(getType())});
        }
        else {
            tknative.postMessage({command: "stopStream", connectionId: getNativeId().toString(), isLocal: false, type: Number(getType())});
        }   
    }

    that.play = function (elementID, options) {
        options = options || {};
        that.elementID = elementID;
        var player;
        /* if (that.hasVideo() || this.hasScreen()) {*/
        // Draw on HTML
        if (elementID !== undefined) {
            player = new TK.NativeVideoPlayer({
                id: getNativeId(),
                stream: that,
                elementID: elementID,
                options: options
            });
            that.player = player;
            that.playing = true;
            if (that.local) {
                tknative.postMessage({command: "playStream", connectionId: getNativeId().toString(), isLocal: true, type: Number(getType()), args: {path: that.path.toString()}});
            }
            else {
                tknative.postMessage({command: "playStream", connectionId: getNativeId().toString(), isLocal: false, type: Number(getType())});
            }
        }
        /*        } else if (that.hasAudio) {
         player = new TK.AudioPlayer({id: that.getID(),
         stream: that,
         elementID: elementID,
         options: options});
         that.player = player;
         that.playing = true;
         }*/
    };

    that.stop = function () {
        if (that.playing) {
            if (that.player !== undefined) {
                that.player.destroy();
                that.playing = false;
            }

            if (that.local) {
                tknative.postMessage({command: "stopStream", connectionId: getNativeId().toString(), isLocal: true, type: Number(getType())});
            }
            else {
                tknative.postMessage({command: "stopStream", connectionId: getNativeId().toString(), isLocal: false, type: Number(getType())});   
            }
        }
    };

    that.show = function () {
        if (that.player !== undefined ) {
            that.player.showVideo();
        }
    };

    that.hide = function () {
        if (that.player !== undefined ) {
            that.player.hideVideo();
        }
    };

    getFrame = function () {
        if (that.player !== undefined && that.stream !== undefined) {
            var video = that.player.video,

                style = document.defaultView.getComputedStyle(video),
                width = parseInt(style.getPropertyValue('width'), 10),
                height = parseInt(style.getPropertyValue('height'), 10),
                left = parseInt(style.getPropertyValue('left'), 10),
                top = parseInt(style.getPropertyValue('top'), 10);

            var div;
            if (typeof that.elementID === 'object' &&
                typeof that.elementID.appendChild === 'function') {
                div = that.elementID;
            }
            else {
                div = document.getElementById(that.elementID);
            }

            var divStyle = document.defaultView.getComputedStyle(div),
                divWidth = parseInt(divStyle.getPropertyValue('width'), 10),
                divHeight = parseInt(divStyle.getPropertyValue('height'), 10),

                canvas = document.createElement('canvas'),
                context;

            canvas.id = 'testing';
            canvas.width = divWidth;
            canvas.height = divHeight;
            canvas.setAttribute('style', 'display: none');
            //document.body.appendChild(canvas);
            context = canvas.getContext('2d');

            context.drawImage(video, left, top, width, height);

            return canvas;
        } else {
            return null;
        }
    };

    that.getVideoFrameURL = function (format) {
        var canvas = getFrame();
        if (canvas !== null) {
            if (format) {
                return canvas.toDataURL(format);
            } else {
                return canvas.toDataURL();
            }
        } else {
            return null;
        }
    };

    that.getVideoFrame = function () {
        var canvas = getFrame();
        if (canvas !== null) {
            return canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
        } else {
            return null;
        }
    };

    that.checkOptions = function (config, isUpdate) {
        //TODO: Check for any incompatible options
        if (isUpdate === true) {  // We are updating the stream
            if (config.video || config.audio || config.screen) {
                L.Logger.warning('[tk-sdk]Cannot update type of subscription');
                config.video = undefined;
                config.audio = undefined;
                config.screen = undefined;
            }
        } else {  // on publish or subscribe
            if (that.local === false) { // check what we can subscribe to
                if (config.video === true && that.hasVideo() === false) {
                    L.Logger.warning('[tk-sdk]Trying to subscribe to video when there is no ' +
                        'video, won\'t subscribe to video');
                    config.video = false;
                }
                if (config.audio === true && that.hasAudio() === false) {
                    L.Logger.warning('[tk-sdk]Trying to subscribe to audio when there is no ' +
                        'audio, won\'t subscribe to audio');
                    config.audio = false;
                }
            }
        }
        if (that.local === false) {
            if (!that.hasVideo() && (config.slideShowMode === true)) {
                L.Logger.warning('[tk-sdk]Cannot enable slideShowMode if it is not a video ' +
                    'subscription, please check your parameters');
                config.slideShowMode = false;
            }
        }
    };

    that.updateMuteToServer = function (callback) {
        if (that.room && that.room.p2p) {
            L.Logger.warning('[tk-sdk]muteAudio is not implemented in p2p streams');
            callback('error');
            return;
        }

        if (that.pc === undefined) {
            return;
        }

        var config = {muteStream: {video:that.videoMuted, audio:that.audioMuted}};
        that.checkOptions(config, true);
        that.pc.updateSpec(config, callback);
    };
    that._setQualityLayer = function (spatialLayer, temporalLayer, callback) {
        if (that.room && that.room.p2p) {
            L.Logger.warning('[tk-sdk]setQualityLayer is not implemented in p2p streams');
            callback('error');
            return;
        }
        var config = {qualityLayer: {spatialLayer: spatialLayer, temporalLayer: temporalLayer}};
        that.checkOptions(config, true);
        that.pc.updateSpec(config, callback);
    };

    controlHandler = function (handlers, publisherSide, enable) {

        if (publisherSide !== true) publisherSide = false;

        handlers = (typeof handlers === 'string') ? [handlers] : handlers;
        handlers = (handlers instanceof Array) ? handlers : [];

        if (handlers.length > 0) {
            that.room.sendControlMessage(that, 'control', {
                name: 'controlhandlers',
                enable: enable,
                publisherSide: publisherSide,
                handlers: handlers
            });
        }
    };

    that.disableHandlers = function (handlers, publisherSide) {
        controlHandler(handlers, publisherSide, false);
    };

    that.enableHandlers = function (handlers, publisherSide) {
        controlHandler(handlers, publisherSide, true);
    };

    that.updateConfiguration = function (config, callback) {
        if (config === undefined)
            return;
        if (that.pc) {
            that.checkOptions(config, true);
            if (that.local) {
                if (that.room.p2p) {
                    for (var index in that.pc) {
                        that.pc[index].updateSpec(config, callback);
                    }
                } else {
                    that.pc.updateSpec(config, callback);
                }

            } else {
                that.pc.updateSpec(config, callback);
            }
        } else {
            callback('This stream has no peerConnection attached, ignoring');
        }
    };

    that.muteVideo = function (mute, callback) {
        if (that.videoMuted == mute)
            return;
        that.videoMuted = mute ;
        // todo...
        // C++增加muteVideo接口
        tknative.postMessage({command: "enableVideo", enable: !mute});
        if (that.stream !== undefined) {
        //     that.stream.getTracks().forEach(function (track) {
        //         if (track.kind === 'video') {
        //             track.enabled = !mute;
        //         }
        //     });

            that.updateMuteToServer(callback);
        } else {
            L.Logger.warning("[tk-sdk]not deviceStream to muteVideo");
        };
    };

    that.muteAudio = function (mute, callback) {

        if (that.audioMuted == mute)
            return;

        that.audioMuted = mute;
        // todo...
        // C++增加muteAudio接口
        tknative.postMessage({command: "enableAudio", enable: !mute});
        if (that.stream !== undefined) {
        //     that.stream.getTracks().forEach(function (track) {
        //         if (track.kind === 'audio') {
        //             track.enabled = !mute;
        //         }
        //     });

            that.updateMuteToServer(callback);
        } else {
            L.Logger.warning("[tk-sdk]not deviceStream to muteVideo");
        }

    };

    return that;
};
/*global L, io*/
/*
 * Class Room represents a Talk Room. It will handle the connection, local stream publication and
 * remote stream subscription.
 * Typical Room initialization would be:
 * var room = TK.Room({token:'213h8012hwduahd-321ueiwqewq'});
 * It also handles RoomEvents and StreamEvents. For example:
 * Event 'room-connected' points out that the user has been successfully connected to the room.
 * Event 'room-disconnected' shows that the user has been already disconnected.
 * Event 'stream-added' indicates that there is a new stream available in the room.
 * Event 'stream-removed' shows that a previous available stream has been removed from the room.
 */


//var io = require('rpc.socket.io');
var TK = TK || {};
TK.SDKTYPE = 'pc';
var tknative;

TK.NativeInfo = function () {
    try{
        var that = {};
        that = talk_window;
        return that;
    }catch(e){
        return null;
    };
}

TK.Initialize = function (isTkNative) {
    try{
        if (!isTkNative) {
            TK.isTkNative = false;
            var native_entry = document.getElementById('tknative');
            if( native_entry &&  native_entry.nodeName && native_entry.nodeName.toLowerCase() === 'embed' ){
                var native_entryParentNode = native_entry.parentNode ;
                if(native_entryParentNode){
                    native_entryParentNode.removeChild(native_entry);
                }
            }
        }else{
            TK.isTkNative = true;
            tknative = tknative || TK.nativeEntry();
            TK.AVMgr = null ;
            TK.AVMgr = TK.NativeAVMgr();
            tknative.postMessage({command: "maximizeNativeClient"});
        }
    }catch (err){
        L.Logger.error('[tk-sdk]Initialize error:' , err);
    }
};

TK.Room = function () {
    'use strict';
    var SDKVERSIONS =  window.__SDKVERSIONS__  || "2.1.5";
    var SDKVERSIONSTIME =  window.__SDKVERSIONSTIME__  || "2018011014";
    L.Logger.info('[tk-sdk-version]sdk-version:'+ SDKVERSIONS +' , sdk-time: '+ SDKVERSIONSTIME) ;
    var spec={};
    var that = TK.EventDispatcher(spec),
        connectSocket  = undefined,
        sendMessageSocket  = undefined,
        sendSDPSocket  = undefined,
        sendDataSocket  = undefined,
        updateAttributes  = undefined,
        removeStream  = undefined,
        DISCONNECTED = 0,
        CONNECTING = 1,
        CONNECTED = 2 ,
        STREAMMAXRECONNECTIONNUMBER = 3 ; //stream最大重连次数

    var _web_host  = undefined,
        _temp_web_host = undefined ,
        _old_web_host = undefined ,
        _temp_web_port  = undefined ,
        _web_port  = undefined,
        _room_uri  = undefined,
        _room_id  = undefined,
        _room_type=0,
        _room_name  = undefined,
        _room_properties  = undefined,
        _room_video_width = 320,
        _room_video_height = 240,
        _room_video_fps = 15,
        _room_video_maxbps = 256,
        _room_max_videocount = 6,
        _configuration  = undefined,
        _testIP  = undefined,
        _testPort  = undefined,
        _default_stream = undefined,
        _desktop_stream = undefined,
        _myself = {} ,
        _serverList = undefined ,
        _serverName = undefined ,
        _avmgr  = undefined,
        _isIpFalsification = false ,
        _isGetFalsificationIp = true ,
        _ipFalsification = window.location.hostname ,
        // _ipFalsification = undefined , //默认为undefined，只能从index.html（8080）中获取
        _isPlayback = false ,
        _isGetFileList = true ,
        _recordfilepath = undefined ,
        _rtcStatsrObserverIntervalTime = 3000 ,
        _isGetRtcStatsrObserver = false ,
        _isDesktopSharing = false ,
        _webInterfaceHtmlPort = 8080 ,
        _connectedNumber = 0 ,
        _isConnected = false  ,
        _requestServerListPermission = true ,//是否请求服务器列表数据
        _handlerCallbackJson = {} ,
        _is_room_live = false ; //是否是直播

        TK.default_stream = _default_stream;

    var PROTOCOL = "https://"; //协议默认https
    var WEBFUNC_CHECKroom = "/ClientAPI/checkroom";
    var WEBFUNC_GETCONFIG = "/ClientAPI/getconfig";
    var WEBFUNC_GETFILELIST = "/ClientAPI/getroomfile";
    var WEBFUNC_UPLOADDOCUMENT = "/ClientAPI/uploaddocument";
    var WEBFUNC_UPLOADDOCUMENTASYNC = "/ClientAPI/uploaddocumentAsync";
    var WEBFUNC_DELROOMFILE = "/ClientAPI/delroomfile";
    var WEBFUNC_GETSERVERAREA = "/ClientAPI/getserverarea";

    var WEBFUNC_DOCUPDATEINFO = "/ClientAPI/docupdateinfo";  //xgd 2017-11-23 上传文件异步，接收转换完后的状态 getOnlineUsers
    var WEBFUNC_GETONLINENUM = "/ClientAPI/getonlinenum";  //xgd 2017-11-28  获取在线人数
    var WEBFUNC_LOTTERYDRAW = "/ClientAPI/lotterydraw";  //xgd 2017-11-28  请求服务器
    var WEBFUNC_LOTTERYOVER = "/ClientAPI/lotteryover";  //wyw 2018-1-12  通知后台结束抽奖
    var WEBFUNC_LOTTERYDRAWNUM = "/ClientAPI/lotterydrawnum";   //xgd 2018-01-04    请求可抽奖人数查询
    var WEBFUNC_LOTTERYDRAWALL = "/ClientAPI/lotterydrawall";  //xgd 2017-12-28  请求抽奖查询
    var WEBFUNC_ROLLCALLADD = "/ClientAPI/rollcalladd";  //xgd 2017-12-28  请求签到
    var WEBFUNC_ROLLCALLALL = "/ClientAPI/rollcallall";  //xgd 2017-12-28  请求签到查询
    var WEBFUNC_VOTELIST = "/ClientAPI/voteall";  //xgd 2017-12-28  投票列表
    var WEBFUNC_VOTECREATE = "/ClientAPI/voteadd";  //xgd 2017-12-28  投票添加
    var WEBFUNC_VOTEUPDATE = "/ClientAPI/voteup ";  //xgd 2017-12-28  投票更新
    var WEBFUNC_VOTERESULTCREATE = "/ClientAPI/voteresultadd";  //xgd 2017-12-28  请求签到查询
    var WEBFUNC_VOTEDELETE = "/ClientAPI/votedel";  //xgd 2017-12-28  请求签到查询
    var WEBFUNC_GETONLINEUSER = "/ClientAPI/getonlineuser";  //wyw 2018-1-17  请求花名册查询
    

    var _room_filelist;

    that.remoteStreams = {};
    that.localStreams = {};
    that.roomID = '';
    that.socket = {};
  
    that.p2p = false;
    that.state = DISCONNECTED;

    var _users={};
    var _rolelist = {} ;

    var ERR_OK = 0;
    var ERR_INTERNAL_EXCEPTION = -1;
    var ERR_NOT_INITIALIZED = 1;
    var ERR_INVALID_STATUS = 2;
    var ERR_HTTP_REQUEST_FAILED = 3;
    var ERR_BAD_PARAMETERS = 4;
    var ERR_NO_THIS_USER = 5;
    var ERR_USER_NOT_PUBLISHING = 6;
    var ERR_USER_NOT_PLAYING = 7;

    var STATUS_IDLE = 0;
    var STATUS_CHECKING = 1;
    var STATUS_GETTINGCFG = 2;
    var STATUS_CONNECTING = 3;
    var STATUS_CONNECTED = 4;
    var STATUS_JOINING = 5;
    var STATUS_ALLREADY = 6;
    var STATUS_DISCONNECTING = 7;
    var STATUS_DISCONNECTED = 8;

    var VIDEO_DEFINES = [[80,60] , [176, 144],[320, 240],[640, 480], [1280, 720], [1920, 1080] ];

    var _status=STATUS_IDLE;

    var jsonRpcClient;
    var guid = (function() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return function() {
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        };
    })();

    var nativeCallSeq = 0;
    var waitNativeToCallbackList = {};
    that.getNativeCallSeq = function () {
        return ++nativeCallSeq;
    };
    var _subscribe_from_native = false;

    // It removes the stream from HTML and close the PeerConnection associated
    removeStream = function (stream) {
        if (stream.stream !== undefined) {

            // Remove HTML element
            stream.hide();

            // Close PC stream
            if (stream.pc) {
              stream.pc.close();
              delete stream.pc;
            }
            if (stream.local) {
                stream.stream.stop();
            }
            delete stream.stream;
        }
    };

    sendDataSocket = function (stream, msg) {
        if (stream.local) {
            sendMessageSocket('sendDataStream', {id: stream.getID(), msg: msg});
        } else {
            L.Logger.error('[tk-sdk]You can not send data through a remote stream');
        }
    };

    updateAttributes = function(stream, attrs) {
        if (stream.local) {
            stream.updateLocalAttributes(attrs);
            sendMessageSocket('updateStreamAttributes', {id: stream.getID(), attrs: attrs});
        } else {
            L.Logger.error('[tk-sdk]You can not update attributes in a remote stream');
        }
    };


    /*socket.callRPC('getRemoteTime',{user:'admin', password:'toor'},{
      success: function(result){
        alert('The remote time is ' + result);
      },
      error: function(err){
        
      }
    });*/


    // It connects to the server through socket.io
    connectSocket = function (uri, callback, error) {

        var createRemotePc = function (stream, peerSocket) {
            //stream.pc相当于PEERCONNECTION
            stream.pc = TK.Connection({callback: function (msg) {
                   msg = _ipAndStationaryStrWitch_send(msg);
                  sendSDPSocket('signaling_message', {streamId: stream.getID(),
                                                      peerSocket: peerSocket,
                                                      msg: msg});
              },
              iceServers: that.iceServers,
              maxAudioBW: spec.maxAudioBW,
              maxVideoBW: spec.maxVideoBW,
              limitMaxAudioBW:spec.maxAudioBW,
              limitMaxVideoBW:spec.maxVideoBW,
              cnnId: stream.extensionId}, stream.isTkNative);

            stream.pc.onaddstream = function (evt) {
                if( that.remoteStreams[stream.getID()] ){
                    // Draw on html
                    L.Logger.debug('[tk-sdk]Stream subscribed');
                    stream.stream = evt.stream;
                    if( _isGetRtcStatsrObserver ){
                        that.rtcStatsrObserver(stream);
                    }
                    var evt2 = TK.StreamEvent({type: 'stream-subscribed', stream: stream});
                    L.Logger.info('[tk-sdk]createRemotePc(stream.pc.onaddstream), stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                    that.dispatchEvent(evt2);
                }else{
                    L.Logger.info( '[tk-sdk]createRemotePc(stream.pc.onaddstream):remoteStreams does not contain streams ,stream  subscribe  information does not need to be passed to the interface layer , stream id:'+stream.getID()+  ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                }
            };
        };

        // Once we have connected
        that.state = CONNECTING;
        that.socket = io.connect(_room_uri, {secure: true, reconnection:true , transports: ['websocket']});

        that.socket.on('connect', function () {
            L.Logger.debug('[tk-sdk]tk connectd');
            that.state = CONNECTED;
            _setStatus(STATUS_CONNECTED);
            if( _connectedNumber === 0 || that.needReconnectSocket){
                // We receive an event with a new stream in the room.
                // type can be "media" or "data"
                that.socket.on('onAddStream', function (arg) {
                    // We can subscribe the meida stream published by ourselves.
                    // We can not subscribe video or screen stream which published by ourselves.
                    var uid = arg.extensionId;
                    var suffix_index = uid.indexOf(":screen");
                    var need_subscribe = false;
                    var native_subscribe = false;
                    var video_stream = false;

                    if (suffix_index > 0)
                    {
                        uid = uid.substring(0, suffix_index)
                    }

                    if (uid != _myself.id)
                    {
                        need_subscribe = true;
                    }

                    if (arg.attributes === undefined || (arg.attributes !== undefined && arg.attributes.type !== "screen" && arg.attributes.type !== "media"))
                    {
                        video_stream = true;
                    }

                    if (_subscribe_from_native && need_subscribe && video_stream)
                    {
                        native_subscribe = true;
                    }

                    var stream = TK.Stream({streamID: arg.id,
                            local: false,
                            audio: arg.audio,
                            video: arg.video,
                            data: arg.data,
                            screen: arg.screen,
                            attributes: arg.attributes,
                            extensionId: arg.extensionId}, native_subscribe),
                        evt;
                    stream.room = that;
                    that.remoteStreams[arg.id] = stream;
					
                    if(uid === _myself.id){
                        that.publishedDefaultStream = stream ;
                    }

                    if (need_subscribe) {
                        that.subscribe(stream);
                    }

                    if( _isGetRtcStatsrObserver && arg.extensionId === _myself.id ){
                        that.rtcStatsrObserver(stream);
                    }
                    /*if( _myself.id === stream.extensionId && _myself.publishstate === TK.PUBLISH_STATE_NONE){ // todo 等待下一版优化
                        that.unpublish(_default_stream);
                    }*/
                    evt = TK.StreamEvent({type: 'stream-added', stream: stream});
                    L.Logger.info('[tk-sdk]stream-added , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                    that.dispatchEvent(evt);
                });

                that.socket.on('signaling_message_mediaserver', function (arg) {
                    var stream;
                    L.Logger.debug('[tk-sdk]signaling_message_mediaserver',arg);
                    arg.mess = _ipAndStationaryStrWitchSDP_recv(arg.mess);
                    if (arg.peerId) {
                        stream = that.remoteStreams[arg.peerId];
                    } else {
                        stream = that.localStreams[arg.streamId];
                    }
                    if(arg && arg.mess  && arg.mess.type === 'ready' ){
                        stream.isCompleted = true ;
                        stream.reconnectionNumber = 0 ;
                        if(_myself.udpstate !==  L.Constant.udpState.ok){
                            that.changeUserProperty(_myself.id, "__all", {udpstate: L.Constant.udpState.ok});
                        }
                    }
                    if (stream && !stream.failed) {
                        if(stream.pc && stream.pc.processSignalingMessage){
                            stream.pc.processSignalingMessage(arg.mess , stream);
                        }else{
                            L.Logger.warning('stream.pc is not exist , Can\'t call processSignalingMessage method!');
                        }
                    }
                });

                that.socket.on('signaling_message_peer', function (arg) {

                    var stream = that.localStreams[arg.streamId];
                    L.Logger.debug('signaling_message_peer',arg);
                    if (stream && !stream.failed) {
                        stream.pc[arg.peerSocket].processSignalingMessage(arg.msg);
                    } else {
                        stream = that.remoteStreams[arg.streamId];
                        if (!stream.pc) {
                            createRemotePc(stream, arg.peerSocket);
                        }
                        if(stream.pc && stream.pc.processSignalingMessage){
                            stream.pc.processSignalingMessage(arg.msg);
                        }else{
                            L.Logger.warning('stream.pc is not exist , Can\'t call processSignalingMessage method!');
                        }
                    }
                });

                that.socket.on('publish_me', function (arg) {
                    var myStream = that.localStreams[arg.streamId];

                    if (myStream.pc === undefined) {
                        myStream.pc = {};
                    }

                    myStream.pc[arg.peerSocket] = TK.Connection({callback: function (msg) {
                        msg = _ipAndStationaryStrWitch_send(msg);
                        sendSDPSocket('signaling_message', {streamId: arg.streamId,
                            peerSocket: arg.peerSocket, msg: msg});
                    }, audio: myStream.hasAudio(), video: myStream.hasVideo(), media: myStream.hasMedia(),
                        iceServers: that.iceServers, cnnId: myStream.extensionId}, TK.isTkNative);


                    myStream.pc[arg.peerSocket].oniceconnectionstatechange = function (state) {
                        if (state === 'failed') {
                            myStream.pc[arg.peerSocket].close();
                            delete myStream.pc[arg.peerSocket];
                        }
                        else if (state === 'disconnected') {
                            // TODO handle behaviour. Myabe implement Ice-Restart mechanism
                        }
                    };

                    myStream.pc[arg.peerSocket].addStream(myStream.stream);
                    myStream.pc[arg.peerSocket].createOffer();
                });

                that.socket.on('onBandwidthAlert', function (arg){
                    L.Logger.debug('[tk-sdk]Bandwidth Alert on', arg.streamID, 'message',
                        arg.message,'BW:', arg.bandwidth);
                    if(arg.streamID){
                        var stream = that.remoteStreams[arg.streamID];
                        if (stream && !stream.failed) {
                            var evt = TK.StreamEvent({type:'bandwidth-alert',
                                stream:stream,
                                message:arg.message,
                                bandwidth: arg.bandwidth});
                            that.dispatchEvent(evt);
                        }

                    }
                });

                // We receive an event of new data in one of the streams
                that.socket.on('onDataStream', function (arg) {
                    var stream = that.remoteStreams[arg.id],
                        evt = TK.StreamEvent({type: 'stream-data', message: arg.msg, stream: stream});
                    that.dispatchEvent(evt);
                });

                // We receive an event of new data in one of the streams
                that.socket.on('onUpdateAttributeStream', function (arg) {
                    var stream = that.remoteStreams[arg.id],
                        evt = TK.StreamEvent({type: 'stream-attributes-update',
                            attrs: arg.attrs,
                            stream: stream});
                    if(stream!==undefined) {
                        stream.updateLocalAttributes(arg.attrs);
                        that.dispatchEvent(evt);
                    } else {
                        L.Logger.warning('[tk-sdk]onUpdateAttributeStream stream invalid',arg);
                    }
                });

                // We receive an event of a stream removed from the room
                that.socket.on('onRemoveStream', function (arg) {
                    /*todo 这段代码无用
                    var stream = that.localStreams[arg.id];
                    if (stream && !stream.failed){
                        stream.failed = true;
                         if(stream.extensionId === _myself.id && _myself.publishstate > TK.PUBLISH_STATE_NONE ){
                            that.changeUserProperty(stream.extensionId, "__all", {publishstate:TK.PUBLISH_STATE_NONE});
                         }else{
                            that.unpublish(stream);
                         }
                        L.Logger.warning('[tk-sdk]We received a removeStream from our own stream --' +
                            ' probably timed out'  , arg);
                        var disconnectEvt = TK.StreamEvent({type: 'stream-failed',
                            message:{reason:'Publishing local stream failed because of an TK Error' , source:'onRemoveStream'} ,
                            stream: stream});
                        L.Logger.info('[tk-sdk]stream-failed , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                        that.dispatchEvent(disconnectEvt);
                        //that.unpublish(stream);
                        return;
                    }*/
                    var  stream = that.remoteStreams[arg.id];
                    if (stream && stream.failed){
                        L.Logger.debug('[tk-sdk]Received onRemoveStream for a stream ' +
                            'that we already marked as failed ', arg.id);
                        return;
                    }else if (!stream){
                        L.Logger.debug('[tk-sdk]Received a removeStream for', arg.id,
                            'and it has not been registered here, ignoring.');
                        return;
                    }
                    delete that.remoteStreams[arg.id];
                    delete that.localStreams[arg.id];
                    removeStream(stream);
                  /*  if( _myself.id === stream.extensionId && _myself.publishstate !== TK.PUBLISH_STATE_NONE){ //todo 下一版修改
                        that.publish(_default_stream);
                    }*/
                    var evt = TK.StreamEvent({type: 'stream-removed', stream: stream});
                    L.Logger.info('[tk-sdk]stream-removed , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                    that.dispatchEvent(evt);
                });

                // The socket has disconnected
                that.socket.on('disconnect', function (e) {
                    if(!that.needReconnectSocket){
                        L.Logger.debug('[tk-sdk]Socket disconnected, lost connection to TKController' ,  e );
                        if (that.state !== DISCONNECTED) {
                            _setStatus(STATUS_DISCONNECTED);
                            that.state = DISCONNECTED;
                            if(_isGetRtcStatsrObserver){
                                that.stopIntervalRtcStatsrObserver();
                            }
                            if(_default_stream.rtcStatsrObserverTimer){
                                that.stopIntervalRtcStatsrObserverByStream(_default_stream);
                            }

                            if (TK.isTkNative)
                            {
                                tknative.postMessage({command: "nativeClear"});
                            }

                            _isDesktopSharing = false;

                            var disconnectEvt = TK.RoomEvent({type: 'room-disconnected',
                                message: 'unexpected-disconnection'});
                            that.dispatchEvent(disconnectEvt);
                        };
                    }
                });

                that.socket.on('connection_failed', function(arg){
                    L.Logger.debug('[tk-sdk]Socket connection_failed , arg is '+L.Utils.toJsonStringify(arg) );
                    var stream,
                        disconnectEvt;
                    //todo 这里不理解，socket断了为什么还有流的失败？
                   /* if (arg.type === 'publish'){
                        L.Logger.error('[tk-sdk]ICE Connection Failed on publishing stream',
                            arg.streamId, that.state);
                        if (that.state !== DISCONNECTED ) {
                            if(arg.streamId){
                                stream = that.localStreams[arg.streamId];
                                if (stream && !stream.failed) {
                                    stream.failed = true;
                                    if(stream.extensionId === _myself.id && _myself.publishstate > TK.PUBLISH_STATE_NONE ){
                                        that.changeUserProperty(stream.extensionId, "__all", {publishstate:TK.PUBLISH_STATE_NONE});
                                    }else{
                                        that.unpublish(stream);
                                    }
                                    disconnectEvt = TK.StreamEvent({type: 'stream-failed',
                                        message:{reason:'Publishing local stream failed ICE Checks' , source:'publish' , from:'connection_failed' } ,
                                        stream: stream});
                                    L.Logger.info('[tk-sdk]stream-failed , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                                    that.dispatchEvent(disconnectEvt);
                                }
                            }
                        }
                    } else {
                        L.Logger.error('[tk-sdk]ICE Connection Failed on subscribe stream', arg.streamId);
                        if (that.state !== DISCONNECTED) {
                            if(arg.streamId){
                                stream = that.remoteStreams[arg.streamId];
                                if (stream && !stream.failed) {
                                    stream.failed = true;
                                    disconnectEvt = TK.StreamEvent({type: 'stream-failed',
                                        message:{reason:'Subscriber failed ICE, cannot reach Talk for media' , source:'subscribe'  , from:'connection_failed'} ,
                                        stream: stream});
                                    L.Logger.info('[tk-sdk]stream-failed , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                                    that.dispatchEvent(disconnectEvt);
                                    that.unsubscribe(stream);
                                }
                            }
                        }
                    }*/
                });

                that.socket.on('error', function(e){
                    L.Logger.error ('[tk-sdk]Cannot connect to Controller');
                    if (error) error('Cannot connect to TKController (socket.io error)',e);
                });

                /*that.socket.on('connect_error' , function (e) {
                    L.Logger.debug('[tk-sdk]connect_error info:' , e) ;
                });*/

               /* that.socket.on('reconnect' , function (e) {
                    L.Logger.debug('[tk-sdk]reconnect info:' , e) ;
                });*/

               /* that.socket.on('reconnect_attempt' , function (e) {
                    L.Logger.debug('[tk-sdk]reconnect_attempt info:' , e) ;
                });*/

                that.socket.on('reconnecting' , function (reconnectingNum) {
                    L.Logger.debug('[tk-sdk]reconnecting info:' , reconnectingNum) ;
                    var disconnectEvt = TK.RoomEvent({type: 'room-reconnecting',
                        message: {number:reconnectingNum , info:'room-reconnecting number:'+ reconnectingNum }});
                    that.dispatchEvent(disconnectEvt);
                });

              /*  that.socket.on('reconnect_error' , function (e) {
                    L.Logger.debug('[tk-sdk]reconnect_error info:' , e) ;
                });*/

               /* that.socket.on('reconnect_failed' , function (e) {
                    L.Logger.debug('[tk-sdk]reconnect_failed info:' , e) ;
                });*/

               /* that.socket.on('ping' , function (e) {
                    L.Logger.debug('[tk-sdk]ping info:' , e) ;
                });*/

                /*that.socket.on('pong' , function (e) {
                    L.Logger.debug('[tk-sdk]pong info:' , e) ;
                });*/

                that.socket.on('participantLeft', _handlerCallbackJson._handler_participantLeft );

                that.socket.on('participantJoined', _handlerCallbackJson._handler_participantJoined );
                that.socket.on('participantEvicted',function(messages){
                    L.Logger.info('[tk-sdk]user evicted room  , user info: '+L.Utils.toJsonStringify(_myself) + ' , participantEvicted  messages:'+ L.Utils.toJsonStringify(messages) );
                    that.leaveroom(true);
                    var roomEvt = TK.RoomEvent({type: 'room-participant_evicted' , message:messages , user:_myself});
                    that.dispatchEvent(roomEvt);
                });
                that.socket.on('sendMessage', _handlerCallbackJson._handler_sendMessage );
                that.socket.on("msgList",function(messages) {
                    L.Logger.debug('[tk-sdk]msgList info:' , L.Utils.toJsonStringify(messages) );
                    var roomEvt = TK.RoomEvent({type: 'room-msglist', message:messages});
                    that.dispatchEvent(roomEvt);
                });
                that.socket.on("pubMsg", _handlerCallbackJson._handler_pubMsg );
                that.socket.on("delMsg", _handlerCallbackJson._handler_delMsg );
                that.socket.on("setProperty", _handlerCallbackJson._handler_setProperty );
                //qiugs:回放清除所有信令
                that.socket.on("playback_clearAll" ,  _handlerCallbackJson._handler_playback_clearAll );
                //qiugs:回放获取开始和结束时间
                that.socket.on("duration" , _handlerCallbackJson._handler_duration);
                //qiugs:服务器播放完毕，收到结束的信令
                that.socket.on("playbackEnd" , _handlerCallbackJson._handler_playbackEnd );
                //qiugs:服务器回放的播放时间更新
                that.socket.on("playback_updatetime" ,_handlerCallbackJson._handler_playback_updatetime );
                _connectedNumber++;
                L.Logger.info('[tk-sdk]connected room  , current connected number is '+_connectedNumber+'! ');
                if(!that.needReconnectSocket){
                    L.Logger.info('[tk-sdk]Reconnect Socket ,  join room start! ');
                }
                that.needReconnectSocket = false ;
                _step4Join(callback,error);
            }else{
                L.Logger.info('[tk-sdk]reconnected room! ');
                var roomEvt = TK.RoomEvent({type: 'room-reconnected'});
                that.dispatchEvent(roomEvt);
                var options = {source:'reconnected room'};
                _reGetconfigToJoinRoom( options , callback,error );
            }
        });
    };

    // Function to send a message to the server using socket.io
    sendMessageSocket = function (type, msg, callback, error) {
        L.Logger.debug('[tk-sdk]sendMessageSocket', type, msg);
        that.socket.emit(type, msg, function (respType, respmsg) {
            if (respType === 'success') {

                L.Logger.debug('[tk-sdk]sendMessageSocket success', msg, respmsg);

                if (callback) callback(respmsg);
            } else if (respType === 'error'){
                if (error) error(respmsg);
            } else {
                if (callback) callback(respType, respmsg);
            }

        });
    };

    // It sends a SDP message to the server using socket.io
    sendSDPSocket = function (type, options, sdp, callback) {
        if (that.state !== DISCONNECTED){
            that.socket.emit(type, options, sdp, function (response, respCallback) {
                if (callback) callback(response, respCallback);
            });
        }else{
            L.Logger.warning('[tk-sdk]Trying to send a message over a disconnected Socket');
        }
    };

    that.setIsGetFileList = function (isGetFileListValue) {
        _isGetFileList = isGetFileListValue ;
    };

    that.getRoomType=function() {
        return _room_type;
    };

    that.getRoomName=function() {
        return _room_name;
    };

    that.getRoomProperties=function() {
        return _room_properties;
    };

    that.getMySelf=function() {
        return _myself;
    };

    that.getUser=function(id) {
        if(id === undefined)
            return undefined;

        return _users[id];
    };

    that.getUsers=function() {
        return _users;
    };
    that.getUsersNumber = function ( filterRole ) {
        var num = 0 ;
        for(var key in _users){
            if( !(filterRole !== undefined && _users[key].role == filterRole) ){
                num++ ;
            }
        }
        return num ;
    };
    that.getSpecifyRoleList=function(specifyKey) {
        if(specifyKey === undefined){
            L.Logger.error('[tk-sdk]getSpecifyRoleList specifyKey is exist!');
            return {};
        }
        var specifyRole = _rolelist[specifyKey] || {} ;
        return specifyRole ;
    };
    that.getAllRoleList=function() {
        return _rolelist;
    };
    that.getConfigInfo = function () {
        return _configuration ;
    };
    that.getSpecifyUsersByPublishstate = function (publishstate  , filterRole , filterPublished) {
        var _specifyUsers = {} ;
        for(var key in _users){
            var user = _users[key];
            if(!filterPublished){
                if(user.publishstate === publishstate){
                    if(filterRole == undefined || filterRole == null || typeof filterRole != 'number' ){
                        if( typeof filterRole != 'number' ){L.Logger.warning('filterRole must is number!' , filterRole);};
                        _specifyUsers[key] = user ;
                    }else{
                        if( user.role == filterRole ){
                            _specifyUsers[key] = user ;
                        }
                    }
                }
            }else{
                if(user.publishstate !== TK.PUBLISH_STATE_NONE){
                    if(filterRole == undefined || filterRole == null || typeof filterRole != 'number' ){
                        if( typeof filterRole != 'number' ){L.Logger.warning('filterRole must is number!' , filterRole);};
                        _specifyUsers[key] = user ;
                    }else{
                        if( user.role == filterRole ){
                            _specifyUsers[key] = user ;
                        }
                    }
                }
            }
        }
        return _specifyUsers ;
    };
    /*that.updateIsGetFalsificationIp = function(isGetFalsificationIp){
        _isGetFalsificationIp = isGetFalsificationIp ;
    };*/

    /*获取上台人数的数量*/
    that.getPublishStreamNumber = function(){
        var publishNumber = 0 ;
        for(var key in _users ){
            if(_users[key].publishstate !== TK.PUBLISH_STATE_NONE){
                publishNumber++ ;
            }
        }
        return  publishNumber ;
    };
    /*上台的人数是否达到人数限制*/
    that.isBeyondMaxVideo = function () {
        var publishNum = 0 ;
        var isBeyondMaxVideo = false ;
        for(var key in _users ){
            if(_users[key].publishstate !== TK.PUBLISH_STATE_NONE){
                if(  (++publishNum) >= _room_max_videocount){
                    isBeyondMaxVideo = true ;
                    return isBeyondMaxVideo ;
                }
            }
        }
        return isBeyondMaxVideo ;
    };

    that.changeUserProperty=function(id, tellWhom, properties) {
        if (_status != STATUS_ALLREADY)
            return ERR_INVALID_STATUS;

        if (properties === undefined){
            L.Logger.error('[tk-mobile-sdk]changeUserProperty properties or id is not exist!');
            return ERR_BAD_PARAMETERS ;
        }
        var params = {};
        params.id = id;
        params.toID = tellWhom || '__all';
        var user = _users[id] ;
        if(!user){L.Logger.error('[tk-sdk]user is not exist , user id: '+id+'!'); return ;} ;
        if( !(properties && typeof properties === 'object') ){L.Logger.error('[tk-sdk]properties must be json , user id: '+id+'!'); return ;} ;
        params.properties = properties;
        sendMessageSocket('setProperty',params);
        return ERR_OK;
    };

    that.onChangeMyPublishState=function(newState) {
        L.Logger.debug("[tk-sdk]onChangeMyPublishState " + _myself.publishstate + " to " + newState);
        if (_myself.publishstate == newState)
            return;

        if (newState > TK.PUBLISH_STATE_NONE) {
            _checkMyAudioAndVideoEnable(newState);
            if(_myself.publishstate === TK.PUBLISH_STATE_NONE){
                that.publish(_default_stream);
            }
        }
        else {
            //unpublishVideo();
            that.unpublish(_default_stream);
        }

        _myself.publishstate = newState;
    };

    that.onChangeMyDisableVideoState = function (disablevideo) { //改变我的视频设备禁用状态
        L.Logger.debug("[tk-sdk]onChangeMyDisableVideoState " + _myself.disablevideo + " to " + disablevideo);
        if (_myself.disablevideo == disablevideo)
            return;
        _myself.disablevideo = disablevideo;
        if (_myself.publishstate > TK.PUBLISH_STATE_NONE) {
            _checkMyAudioAndVideoEnable();
        }
    };
    that.onChangeMyDisableAudioState = function (disableaudio) { //改变我的视频设备禁用状态
        L.Logger.debug("[tk-sdk]onChangeMyDisableAudioState " + _myself.disableaudio + " to " + disableaudio);
        if (_myself.disableaudio == disableaudio)
            return;
        _myself.disableaudio = disableaudio;
        if (_myself.publishstate > TK.PUBLISH_STATE_NONE) {
            _checkMyAudioAndVideoEnable();
        }
    };

    that.changeUserPublish=function(id,publish) {
        if (_status != STATUS_ALLREADY)
            return ERR_INVALID_STATUS;

        if (id ===undefined)
            return ERR_BAD_PARAMETERS;

        /*if (id===_myself.id) {
            that.onChangeMyPublishState(publish);
        }*/
        that.changeUserProperty(id, "__all", {publishstate:publish});
        return ERR_OK;
    };

    that.changeMyDisableVideoState = function(disablevideo){ //改变自己音频设备的禁用状态
        if(typeof disablevideo !== "boolean" ){
            L.Logger.warning("[tk-sdk]changeMyDisableVideoState:disablevideo must boolean !") ;
            return ;
        }
        that.onChangeMyDisableVideoState(disablevideo);
        that.changeUserProperty(_myself.id, "__all", {disablevideo:disablevideo});
    };

    that.changeMyDisableAudioState = function(disableaudio){ //改变自己视频设备的禁用状态
        if(typeof disableaudio !== "boolean" ){
            L.Logger.warning("[tk-sdk]changeMyDisableAudioState:disableaudio must boolean !") ;
            return ;
        }
        that.onChangeMyDisableAudioState(disableaudio);
        that.changeUserProperty(_myself.id, "__all", {disableaudio:disableaudio});
    };

    that.sendMessage=function(message, toId) {
        if (_status != STATUS_ALLREADY)
            return ERR_INVALID_STATUS;

        var params={};
        params.toID=toId;
        params.message=message;


        sendMessageSocket('sendMessage',params);

        return  ERR_OK;
    };

    that.pubMsg=function(msgName, msgId, toId, data, save, do_not_replace, expiresabs, associatedMsgID , associatedUserID , expires, type, write2DB, actions) {
        if (_status != STATUS_ALLREADY)
            return ERR_INVALID_STATUS;

        var params = {};
        params.name=msgName;
        params.id=msgId;
        params.toID=toId; //  toID=> __all , __allExceptSender , userid , __none ,__allSuperUsers
        params.data=data;
        if(do_not_replace){
            params.do_not_replace=true;
        }

        if(!save)
            params.do_not_save="";
        if(expires !== undefined){
            if(typeof expires !== 'number'){
                L.Logger.error('[tk-mobile-sdk]pubMsg params expires must is number!');
                return ;
            }
            params.expires = expires;
        }
        if(expiresabs !== undefined){
            if(typeof expiresabs !== 'number'){
                L.Logger.error('[tk-mobile-sdk]pubMsg params expiresabs must is number!');
                return ;
            }
            params.expiresabs = expiresabs;
        }
        if(associatedMsgID !== undefined){
            params.associatedMsgID = associatedMsgID ;
        }
        if(associatedUserID !== undefined){
            params.associatedUserID = associatedUserID ;
        }
        if(type === 'count' || 'getCount'){  // 目前只有count一种扩展类型，之后如需扩展可在此处进行相应变动
            params.type = type ;
        }else if(type !== undefined){
            return L.Logger.error('[tk-sdk]pubMsg params type error!');
        }
        if(write2DB !== undefined && typeof write2DB === 'boolean'){
            params.write2DB = write2DB ;
        }
        if(actions !== undefined && Array.isArray(actions) && associatedMsgID !== undefined){
            params.actions = actions ;
        }else if(actions !== undefined && Array.isArray(actions) && associatedMsgID === undefined){
            return L.Logger.error('[tk-sdk]pubMsg params actions depend on associatedMsgID, but associatedMsgID not defined!');
        }
        sendMessageSocket('pubMsg',params);
        return  ERR_OK;
    };

    that.delMsg=function(msgName, msgId, toId, data) {

        if (_status != STATUS_ALLREADY)
            return ERR_INVALID_STATUS;

        var params = {};
        params.name=msgName;
        params.id=msgId;
        params.toID=toId;
        params.data=data;

        sendMessageSocket('delMsg',params);
        return  ERR_OK;
    };

    that.evictUser=function(id , causeJson) {

        L.Logger.debug('[tk-sdk]evictUser', id);
        if (_status != STATUS_ALLREADY)
            return ERR_INVALID_STATUS;

        var params = {};
        params.id = id;
        if(causeJson && typeof causeJson === 'object'){
            for(var key in causeJson){
                params[key] = causeJson[key];
            }
        }
        sendMessageSocket('evictParticipant',params);
        return ERR_OK;
    };

    // Public functions
    // It stablishes a connection to the room.
    // Once it is done it throws a RoomEvent("room-connected")
    //param进行http checkroom的时候的参数，透传的，properties是用户属性
    that.joinroom = function (defaultstream, testip,testport) {
        //var token = spec.token;
        if (that.state !== DISCONNECTED) {
            L.Logger.warning('[tk-sdk]Room already connected', this.state);
        }

        if(_status!==STATUS_CHECKING || _web_host === undefined || _web_port === undefined || _myself === undefined) {
            L.Logger.warning('[tk-sdk]Status error:', _status);
            return -1;
        }

        _default_stream = defaultstream;
        TK.default_stream = _default_stream;
        if(defaultstream === undefined) {
            _myself.hasvideo = false;
            _myself.hasaudio = false;
        } else {
            _myself.hasvideo = defaultstream.video;
            _myself.hasaudio = defaultstream.audio;
        }
        L.Logger.info('[tk-sdk]joinroom:my device info  [hasvideo , hasaudio] is ['+_myself.hasvideo+ ' ,' +_myself.hasaudio+']') ;
        _testIP = testip;
        _testPort = testport;

        /*
            var id = param.id;
            var roomId = param.roomid;
            var hasDC=param.hasDataChannel;
            var userproperties = param.properties;
            var p2p = param.p2p;
            var host = param.host;
            var secure = param.secure;//true for https,false for http
        */

        L.Logger.debug('[tk-sdk]joinroom:my room user', _myself );

        _users = {};
        _rolelist = {} ;

        //step1 checkroom
        //step2 getfilelist & getconfig
        //step3 connect
        //step4 join
        _step2GetConfig(_web_host, _web_port, function(result,responseText) {
            if(result!==0){
                L.Logger.error('[tk-sdk]step2GetConfig failure --> result and responseText:' , result ,  responseText);
            }else if (result == 0 && _status == STATUS_GETTINGCFG) {
                _step2GetFileList(_web_host, _web_port, function(result,message) {
                    L.Logger.debug('[tk-sdk]step2GetFileList result = '  + result + ' , message:'+ L.Utils.toJsonStringify(message) );
                    if(result !== -1 ){
                        if (message !== undefined) {
                            _room_filelist = message;
                            var Evt = TK.RoomEvent({type: 'room-files', message: _room_filelist});
                            that.dispatchEvent(Evt);
                        } else {
                            _room_filelist = [];
                            var Evt = TK.RoomEvent({type:'room-error',message:{source:L.Constant.roomError.GETFILELISTERROR , error:result }});
                            that.dispatchEvent(Evt);
                        }
                    }else {
                        L.Logger.info('[tk-sdk]step2GetFileList code is '+result);
                    }
                    _step3Connect();
                });
            } else {
                L.Logger.error('[tk-sdk]step2GetConfig failure --> result and responseText:' , result ,  responseText , ' , _status = '+_status);
                var Evt = TK.RoomEvent({type:'room-error',message:{source:L.Constant.roomError.GETCONFIGERROR , error:result }});
                that.dispatchEvent(Evt);
            }
        });

    };//joinroom end

    // It disconnects from the room, dispatching a new RoomEvent("room-disconnected")
    that.leaveroom = function (force) {
        force = force || false ;
        L.Logger.debug('[tk-sdk]leaveroom:Disconnection requested');
        _setStatus(STATUS_DISCONNECTED);
        // Close socket
        try {
            that.stopStreamTracksFromDefaultStream();
            if(that.socket && that.socket.disconnect){
                that.socket.disconnect();
            }
        } catch (error) {
            L.Logger.debug('[tk-sdk]Socket already disconnected , disconnect errorInfo:' , error);
        }
        that.socket = undefined;
        var roomEvt = TK.RoomEvent({type: 'room-leaveroom' , message:force});
        that.dispatchEvent(roomEvt);
    };

    // It publishes the stream provided as argument. Once it is added it throws a
    // StreamEvent("stream-added").
    that.publish = function (stream, options, callback) {
        if (_status != STATUS_ALLREADY) {
            L.Logger.warning('[tk-sdk]publish with wrong room status', _status);
            return ERR_INVALID_STATUS;
        }

        L.Logger.info('[tk-sdk]calling publish , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes()) );
        options = options || {};

        options.maxVideoBW = options.maxVideoBW || spec.defaultVideoBW;
        if (options.maxVideoBW > spec.maxVideoBW) {
            options.maxVideoBW = spec.maxVideoBW;
        }

        if (options.minVideoBW === undefined){
            options.minVideoBW = 0;
        }

        if (options.minVideoBW > spec.defaultVideoBW){
            options.minVideoBW = spec.defaultVideoBW;
        }

        options.simulcast = options.simulcast || options._simulcast || false;

        // 1- If the stream is not local or it is a failed stream we do nothing.
        if (stream  && that.localStreams[stream.getID()] === undefined) {
            // if (stream && stream.local && !stream.failed && that.localStreams[stream.getID()] === undefined) {
            // 2- Publish Media Stream to TK-Controller
            if (stream.hasAudio() || stream.hasVideo() || stream.hasScreen()) {
                if ( !(stream.url !== undefined || stream.recording !== undefined) ) {
                    if (stream.failed) {
                        delete stream.failed;
                    }
                    clearTimeout( stream._publishTimer);
                    stream._publishTimer = setTimeout(function () { //15s还没有订阅成功则视为失败，重新走一遍流程
                        that.unpublish(stream , function (ret) {
                            setTimeout(function () {
                                if(!ret){
                                    L.Logger.warning('[tk-sdk]publish timeout 15s: unpublish in not success , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes()) +' !');
                                }
                                if(stream.extensionId === _myself.id){
                                    if(stream.timeoutRePublishNumber < STREAMMAXRECONNECTIONNUMBER){
                                        if(stream.timeoutRePublishNumber === undefined){
                                            stream.timeoutRePublishNumber=0;
                                        };
                                        if(_myself.publishstate > TK.PUBLISH_STATE_NONE){
                                            L.Logger.info( '[tk-sdk]publish timeout 15s-->publish , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                                            stream.timeoutRePublishNumber++;
                                            that.publish(stream  , {timeoutPublishReconnection:true});
                                        }else{
                                            L.Logger.warning( '[tk-sdk]publish timeout 15s-->my publishstate is 0 , not need afresh publish , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                                        }
                                    }else{
                                        L.Logger.info( '[tk-sdk]publish timeout 15s-->rePublish number > '+STREAMMAXRECONNECTIONNUMBER+' , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                                        if(stream.extensionId === _myself.id && _myself.publishstate > TK.PUBLISH_STATE_NONE ){
                                            that.changeUserProperty(stream.extensionId, "__all", {publishstate:TK.PUBLISH_STATE_NONE});
                                        }
                                        var Evt = TK.StreamEvent({type: 'stream-publish-fail' , stream:stream  , message: { code:'publishTimeout' , errorCode:-1, timeoutRePublishNumber:stream.timeoutRePublishNumber  , timeoutPublishReconnection:true }});
                                        that.dispatchEvent(Evt);
                                        if (callback)
                                            callback(undefined, undefined);
                                    }
                                }else{
                                    var Evt = TK.StreamEvent({type: 'stream-publish-fail', stream:stream  , message: { code:'publishTimeout'   , errorCode:-1 }});
                                    that.dispatchEvent(Evt);
                                    L.Logger.info('[tk-sdk]publish timeout 15s--> publish stream stream.extensionId != _myself.id   , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes()) );
                                }
                            },1000);
                        });
                    },15000);

                    L.Logger.debug('[tk-sdk]Publishing to ms Normally, is createOffer', options.createOffer, stream.extensionId);
                    sendSDPSocket('publish', {state: 'ms',
                            data: stream.hasData(),
                            audio: stream.hasAudio(),
                            video: stream.hasVideo(),
                            screen: stream.hasScreen(),
                            minVideoBW: options.minVideoBW,
                            attributes: stream.getAttributes(),
                            extensionId: stream.extensionId,
                            createOffer: options.createOffer,
                            metadata: options.metadata,
                            scheme: options.scheme},
                        undefined, function (error, id) {
                            clearTimeout( stream._publishTimer);
                            if (error != 0) {
                                L.Logger.error('[tk-sdk]Error when publishing the stream: ', error, id);
                                L.Logger.info('[tk-sdk]stream-publish-fail , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                                if(stream.extensionId === _myself.id){
                                    if(stream.publishReconnectionNumber < STREAMMAXRECONNECTIONNUMBER ){  //订阅失败且流未移除，重新订阅
                                        if(stream.publishReconnectionNumber === undefined){
                                            stream.publishReconnectionNumber=0;
                                        };
                                        that.unpublish(stream , function (ret) {
                                            setTimeout( function () {
                                                if(_myself.publishstate > TK.PUBLISH_STATE_NONE){
                                                    L.Logger.info( '[tk-sdk]stream-publish-fail:publish , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                                                    stream.publishReconnectionNumber++;
                                                    that.publish(stream  , {publishReconnection:true});
                                                }else{
                                                    L.Logger.warning( '[tk-sdk]stream-publish-fail:my publishstate is 0 , not need afresh publish , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                                                }
                                            } , 1000);
                                        }, {publishReconnection:true});
                                    }else{
                                        if(stream.extensionId === _myself.id && _myself.publishstate > TK.PUBLISH_STATE_NONE ){
                                            that.changeUserProperty(stream.extensionId, "__all", {publishstate:TK.PUBLISH_STATE_NONE});
                                        }else{
                                            that.unpublish(stream);
                                        }
                                        var Evt = TK.StreamEvent({type: 'stream-publish-fail', stream:stream ,  message: { code:'publishFail'  , errorCode:error , publishReconnectionNumber:stream.publishReconnectionNumber  , publishReconnection:true  , hasdata:false  }});
                                        that.dispatchEvent(Evt);
                                        if (callback) callback(undefined, error);
                                    }
                                }else{
                                    L.Logger.info('[tk-sdk]stream-publish-fail:publish stream stream.extensionId != _myself.id   , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes()) );
                                    that.unpublish(stream);
                                    var Evt = TK.StreamEvent({type: 'stream-publish-fail', stream:stream ,  message: { code:'publishFail' , errorCode:error , id:id   , hasdata:false  }});
                                    that.dispatchEvent(Evt);
                                    if (callback) callback(undefined, error);
                                }
                                return;
                            }
                            L.Logger.debug('[tk-sdk]Stream assigned an Id, starting the publish process , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes()) );
                            stream.publishReconnectionNumber=0;
                            stream.timeoutRePublishNumber=0;
                            if(!options.reconnection){
                                delete stream.isCompleted ;
                                stream.reconnectionNumber = 0 ;
                            }
                            stream.getID = function () {
                                return id;
                            };
                            stream.id = stream.getID();
                            if (stream.hasData()) {
                                stream.sendData = function (msg) {
                                    sendDataSocket(stream, msg);
                                };
                            }
                            stream.setAttributes = function (attrs) {
                                updateAttributes(stream, attrs);
                            };

                            if (stream.hasScreen())
                                _isDesktopSharing = true;

                            that.localStreams[id] = stream;
                            stream.room = that;

                            stream.pc = TK.Connection({callback: function (message) {
                                L.Logger.debug('[tk-sdk]Sending message', message);
                                message = _ipAndStationaryStrWitch_send(message);
                                sendSDPSocket('signaling_message', {streamId: stream.getID(),
                                        msg: message},
                                    undefined, function () {});
                            }, iceServers: that.iceServers,
                                maxAudioBW: options.maxAudioBW,
                                maxVideoBW: stream.hasScreen() ? spec.maxScreenBW : options.maxVideoBW,
                                limitMaxAudioBW: spec.maxAudioBW,
                                limitMaxVideoBW: stream.hasScreen() ? spec.maxScreenBW : spec.maxVideoBW,
                                simulcast: options.simulcast,
                                audio: stream.hasAudio(),
                                video: stream.hasVideo(),
                                screen: stream.hasScreen(),
                                media: stream.hasMedia(),
                                cnnId:  _myself.id}, TK.isTkNative);

                            stream.pc.addStream(stream.stream);
                            stream.pc.oniceconnectionstatechange = function (state) {
                                // No one is notifying the other subscribers that this is a failure
                                // they will only receive onRemoveStream
                                // L.Logger.debug('publish state' , state , stream.isCompleted ,  stream.reconnectionNumber , that.state , DISCONNECTED);
                                L.Logger.info('[tk-sdk]publish ice state:'+state +' , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes()));
                                if (state === 'failed') {
                                    if (that.state !== DISCONNECTED && stream && !stream.failed) {
                                        stream.failed = true;
                                        L.Logger.warning('[tk-sdk]Publishing Stream',
                                            stream.getID(),
                                            'has failed after successful ICE checks , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes()) );
                                     /* todo  这里进行重连，不需要再发送stream-failed
                                        var disconnectEvt = TK.StreamEvent({
                                            type: 'stream-failed',
                                            message:{reason:'Publishing stream failed after connection' , source:'publish'} ,
                                            stream:stream });
                                        that.dispatchEvent(disconnectEvt);*/
                                        var source = 'publish';
                                        _oniceconnectionstatechangeFailed(stream ,state , source );
                                    }
                                }
                            };
                            if(!options.createOffer)
                                stream.pc.createOffer();
                            if(callback) callback(id);
                        });
                }
            }else{
                L.Logger.error('[tk-sdk]Either screen or audio or video is at least one true for streaming' , stream);
                if(callback) callback(undefined, 'Either screen or audio or video is at least one true for streaming');
                return ;
            }
        } else {
            L.Logger.error('[tk-sdk]Trying to publish invalid stream , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes()));
            if(callback) callback(undefined, 'Trying to publish invalid stream');
            return ;
        }
        return ERR_OK;
    };

    //媒体文件数据流发布
    that.publishMedia = function ( stream, options , callback ) {
        if (_status != STATUS_ALLREADY) {
            L.Logger.warning('[tk-sdk]publish with wrong room status', _status);
            return ERR_INVALID_STATUS;
        }

        L.Logger.info('[tk-sdk]calling mediaPublish stream , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes()) );
        options = options || {};
        // 1- If the stream is not local or it is a failed stream we do nothing.
        if (stream  && that.remoteStreams[stream.getID()] === undefined) {
            // 2- Publish Media Stream to TK-Controller
            if (stream.hasAudio() || stream.hasVideo()) {
                if (stream.url !== undefined || stream.recording !== undefined) {
                    if (stream.failed) {
                        delete stream.failed;
                    }
                    var type;
                    var arg;
                    if (stream.url) {
                        type = 'url';
                        arg = stream.url;
                    } else {
                        type = 'recording';
                        arg = stream.recording;
                    }
                    L.Logger.debug('[tk-sdk]Checking publish options for', stream.getID());
                    stream.checkOptions(options);
                    sendSDPSocket('publish', {state: type,
                            data: stream.hasData(),
                            audio: stream.hasAudio(),
                            video: stream.hasVideo(),
                            attributes: stream.getAttributes(),
                            extensionId: stream.extensionId,
                            metadata: options.metadata,
                            createOffer: options.createOffer},
                        arg, function (error, id) {
                            if (error == 0) {
                                L.Logger.debug('[tk-sdk]mediaStream published , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                                if(!options.reconnection){
                                    delete stream.isCompleted ;
                                    stream.reconnectionNumber = 0 ;
                                }
                                stream.getID = function () {
                                    return id;
                                };
                                stream.id = stream.getID();
                                stream.sendData = function (msg) {
                                    sendDataSocket(stream, msg);
                                };
                                stream.setAttributes = function (attrs) {
                                    updateAttributes(stream, attrs);
                                };
                                stream.room = that;
                                if (callback)
                                    callback(id);
                            } else {
                                L.Logger.error('[tk-sdk]Error when publishing mediaStream', error, id);
                                var Evt = TK.StreamEvent({type: 'stream-publish-fail', stream:stream  ,  message:{ errorCode:error , id:id  ,hasdata:false } });
                                L.Logger.info('[tk-sdk]stream-publish-fail , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                                that.dispatchEvent(Evt);
                                if (callback)
                                    callback(undefined, error);

                            }
                        });
                }
            }else{
                L.Logger.error('[tk-sdk]Audio and video in the media file stream at least one is true' , stream);
                if(callback) callback(undefined, 'Audio and video in the media file stream at least one is true');
                return ;
            }
        } else {
            L.Logger.error('[tk-sdk]Trying to publish invalid mediaStream' , stream);
            if(callback) callback(undefined, 'Trying to publish invalid mediaStrea');
            return ;
        }
        return ERR_OK;
    };

    //屏幕共享数据流发布
    that.publishScreen = function ( stream, options , callback ) {
        if (_status != STATUS_ALLREADY) {
            L.Logger.warning('[tk-sdk]publish with wrong room status', _status);
            return ERR_INVALID_STATUS;
        }

        if (_isDesktopSharing) {
            L.Logger.error('[tk-sdk]Screen has been shared already');
            return;
        }
        L.Logger.info('[tk-sdk]calling screenPublish stream , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes()) );
        if (stream  && !stream.failed && that.remoteStreams[stream.getID()] === undefined) {
            if (stream.hasScreen()) {
                _desktop_stream = stream;
                return that.publish( _desktop_stream, options , callback);
            }else{
                L.Logger.error('[tk-sdk]Screen Shared streaming screen  must be true' , stream);
                if(callback) callback(undefined, 'Screen Shared streaming screen must be true');
                return ;
            }
        } else {
            L.Logger.error('[tk-sdk]Trying to publish invalid screenStream' , stream);
            if(callback) callback(undefined, 'Trying to publish invalid screenStream');
            return ;
        }
    };

    // Returns callback(id, error)
    that.startRecording = function (stream, callback) {
        if (stream){
            L.Logger.debug('[tk-sdk]Start Recording stream: ' + stream.getID());
            sendMessageSocket('startRecorder', {to: stream.getID()}, function(id, error){
                if (id === null){
                    L.Logger.error('[tk-sdk]Error on start recording', error);
                    if (callback) callback(undefined, error);
                    return;
                }

                L.Logger.debug('[tk-sdk]Start recording', id);
                if (callback) callback(id);
            });
        }else{
            L.Logger.error('[tk-sdk]Trying to start recording on an invalid stream', stream);
            if(callback) callback(undefined, 'Invalid Stream');
        }
    };

    // Returns callback(id, error)
    that.stopRecording = function (recordingId, callback) {
        sendMessageSocket('stopRecorder', {id: recordingId}, function(result, error){
            if (result === null){
                L.Logger.error('[tk-sdk]Error on stop recording', error);
                if (callback) callback(undefined, error);
                return;
            }
            L.Logger.debug('[tk-sdk]Stop recording', recordingId);
            if (callback) callback(true);
        });
    };

    // It unpublishes the local stream in the room, dispatching a StreamEvent("stream-removed")
    that.unpublish = function (stream, callback , options ) {
        if (_status != STATUS_ALLREADY)
            return ERR_INVALID_STATUS;
        options = options || {};

        L.Logger.info('[tk-sdk]calling unpublish , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes()) );
        // Unpublish stream from TK-Controller
        if (stream) {
            // Media stream
            sendMessageSocket('unpublish', stream.getID(), function(result, error){
                if (result !== 0){
                    L.Logger.error('[tk-sdk]Error unpublishing stream, stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  , error );
                    var Evt = TK.StreamEvent({type: 'stream-unpublish-fail', stream:stream , message: {error:error}});
                    L.Logger.info('[tk-sdk]stream-unpublish-fail , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                    that.dispatchEvent(Evt);
                    if (callback) callback(undefined, error);
                    return;
                }
                L.Logger.debug('[tk-sdk]Stream unpublished  , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                if(!options.reconnection){
                    delete stream.isCompleted ;
                    stream.reconnectionNumber = 0 ;
                }
                stream.room = undefined;
                if ((stream.hasAudio() ||
                    stream.hasVideo() ||
                    stream.hasScreen()) &&
                    stream.url === undefined) {
                    if (stream.pc) stream.pc.close();
                    stream.pc = undefined;
                }

                if (stream.hasScreen())
                    _isDesktopSharing = false;

                if( stream.extensionId === _myself.id){
                    if(!that.publishedDefaultStream){
                        var Evt = TK.StreamEvent({type: 'stream-unpublish-not-belong-remoteStreams', stream:stream });
                        L.Logger.warning('[tk-sdk]stream-unpublish-not-belong-remoteStreams , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                        that.dispatchEvent(Evt);
                    }
                    that.publishedDefaultStream = undefined ;
                }
                delete that.localStreams[stream.getID()];
                stream.getID = function () {return 'local';};
                stream.id = stream.getID();
                stream.sendData = function () {};
                stream.setAttributes = function () {};

                // remove stream failed property since the stream has been
                // correctly removed from Talk so is eligible to be
                // published again
                if (stream.failed) {
                    delete stream.failed;
                }
                if (callback) callback(true);
            });
        } else {
            var error = 'Cannot unpublish, stream does not exist or is not local';
            L.Logger.error('[tk-sdk]unpublish error:' , error );
            var Evt = TK.StreamEvent({type: 'stream-unpublish-fail', stream:stream , message: {error:error}});
            L.Logger.info('[tk-sdk]stream-unpublish-fail , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
            that.dispatchEvent(Evt);
            if (callback) callback(undefined, error);
            return;
        }
        return ERR_OK;
    };

    that.unpublishMedia = function ( stream, callback ) {
        if (_status != STATUS_ALLREADY)
            return ERR_INVALID_STATUS;

        L.Logger.info('[tk-sdk]calling unpublishMedia , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes()) );
        // Media stream
        sendMessageSocket('unpublish', stream.getID(), function(result, error){
            if (result !== 0){
                L.Logger.error('[tk-sdk]Error unpublishing stream', error);
                var Evt = TK.StreamEvent({type: 'stream-unpublish-fail', stream:stream , message: {error:error}});
                L.Logger.info('[tk-sdk]stream-unpublish-fail , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                that.dispatchEvent(Evt);
                if (callback) callback(undefined, error);
                return;
            }
            L.Logger.debug('[tk-sdk]meidaStream unpublished , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes()) );
            if (stream.failed) {
                delete stream.failed;
            }
            //delete that.remoteStreams[stream.getID()];
            if (callback) callback(true);
        });
        return ERR_OK;
    };

    that.unpublishScreen = function ( callback ) {
        if (_status != STATUS_ALLREADY)
            return ERR_INVALID_STATUS;
        if (!_isDesktopSharing) return;
        L.Logger.info('[tk-sdk]calling unpublishScreen , stream id:'+_desktop_stream.getID()+ ' , extensionId is '+ _desktop_stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(_desktop_stream.getAttributes()) );
        return that.unpublish(_desktop_stream, callback);
    };

    that.sendControlMessage = function(stream, type, action) {
      if (stream && stream.getID()) {
        var msg = {type: 'control', action: action};
        sendSDPSocket('signaling_message', {streamId: stream.getID(), msg: msg});
      }
    };

    // It subscribe to a remote stream and draws it inside the HTML tag given by the ID='elementID'
    that.subscribe = function (stream, options, callback) {
        if (_status != STATUS_ALLREADY) {
            L.Logger.warning('[tk-sdk]subscribe when not ready');
            return ERR_INVALID_STATUS;
        }
        clearTimeout( stream._subscribeTimer);
        stream._subscribeTimer = setTimeout(function () { //15s还没有订阅成功则视为失败，重新走一遍流程
            that.unsubscribe(stream , function (ret) {
                setTimeout( function () {
                    if(!ret){
                        L.Logger.warning('[tk-sdk]subscribe timeout 15s: unsubscribe in not success , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes()) +' !');
                    }
                    if( that.remoteStreams[stream.getID()] ){
                        if(stream.timeoutReSubcribeNumber < STREAMMAXRECONNECTIONNUMBER){
                            L.Logger.info( '[tk-sdk]subscribe timeout 15s-->subscribe , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                            if(stream.timeoutReSubcribeNumber === undefined){
                                stream.timeoutReSubcribeNumber=0;
                            };
                            stream.timeoutReSubcribeNumber++;
                            L.Logger.info( '[tk-sdk]subscribe timeout 15s-->stream-removed(initiative) , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                            var evt2 = TK.StreamEvent({type: 'stream-removed', stream: stream , message:{timeoutSubscribeReconnection:true , timeoutReSubcribeNumber:stream.timeoutReSubcribeNumber  , source:'subscribe' , isNotRemote:true  }});
                            that.dispatchEvent(evt2);
                            that.subscribe(stream  , {timeoutSubscribeReconnection:true});
                        }else{
                            L.Logger.info( '[tk-sdk]subscribe timeout 15s-->reSubscribe number > '+STREAMMAXRECONNECTIONNUMBER+' , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                            var Evt = TK.StreamEvent({type: 'stream-subscribe-fail' , stream:stream , message: { code:'subscribeTimeout' , hasdata:false , timeoutReSubcribeNumber:stream.timeoutReSubcribeNumber , hasRemoteStream:that.remoteStreams[stream.getID()]!== undefined }});
                            that.dispatchEvent(Evt);
                            if (callback)
                                callback(undefined, undefined);
                        }
                    }else{
                        L.Logger.info( '[tk-sdk]subscribe timeout 15s-->remoteStreams does not contain streams , not need afresh subscribe , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                    }
                },1000);
            }, {timeoutSubscribeReconnection:true});
        },15000);
        options = options || {};
        if (stream && !stream.local && !stream.failed) {

            if (stream.hasVideo() || stream.hasAudio() || stream.hasScreen()) {
                // 1- Subscribe to Stream

                if (!stream.hasVideo() && !stream.hasScreen()) options.video = false;
                if (!stream.hasAudio()) options.audio = false;

                options.maxVideoBW = options.maxVideoBW || spec.defaultVideoBW;
                if (options.maxVideoBW > spec.maxVideoBW) {
                    options.maxVideoBW = spec.maxVideoBW;
                }
                L.Logger.debug('[tk-sdk]Checking subscribe options for', stream.getID());
                stream.checkOptions(options);
                sendSDPSocket('subscribe', {streamId: stream.getID(),
                                            audio: options.audio,
                                            video: options.video,
                                            data: options.data,
                                            browser: TK.getBrowser(),
                                            createOffer: options.createOffer,
                                            metadata: options.metadata,
                                            slideShowMode: options.slideShowMode},
                              undefined, function (result, error) {
                        clearTimeout(stream._subscribeTimer);
                        if (result !== 0) {
                            L.Logger.error('[tk-sdk]Error subscribing to stream ', error);
                            L.Logger.info('[tk-sdk]stream-subscribe-fail , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                            if( that.remoteStreams[stream.getID()] ){
                                if(stream.subscribeReconnectionNumber < STREAMMAXRECONNECTIONNUMBER ){  //订阅失败且流未移除，重新订阅
                                    if(stream.subscribeReconnectionNumber === undefined){
                                        stream.subscribeReconnectionNumber=0;
                                    };
                                    that.unsubscribe(stream , function (ret) {
                                        setTimeout( function () {
                                            if( that.remoteStreams[stream.getID()] ){
                                                stream.subscribeReconnectionNumber++;
                                                L.Logger.info( '[tk-sdk]stream-subscribe-fail-->stream-removed(initiative) , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                                                var evt2 = TK.StreamEvent({type: 'stream-removed', stream: stream , message:{subscribeReconnection:true , subscribeReconnectionNumber:stream.subscribeReconnectionNumber  , source:'subscribe' , isNotRemote:true  }});
                                                that.dispatchEvent(evt2);
                                                that.subscribe(stream , {subscribeReconnection:true});
                                            }else{
                                                L.Logger.info( '[tk-sdk]stream-subscribe-fail(subscribe-fail):  failed -->remoteStreams does not contain streams , not need afresh subscribe , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                                            }
                                        } , 1000);
                                    }, {subscribeReconnection:true});
                                }else{
                                    that.unsubscribe(stream);
                                    var Evt = TK.StreamEvent({type: 'stream-subscribe-fail',  error:error, message: { code:'subscribeFail'  , stream:stream , hasdata:false , subscribeReconnectionNumber:stream.subscribeReconnectionNumber , hasRemoteStream:that.remoteStreams[stream.getID()]!== undefined }});
                                    that.dispatchEvent(Evt);
                                    if (callback)
                                        callback(undefined, error);
                                }
                            }else{
                                L.Logger.info( '[tk-sdk]stream-subscribe-fail:remoteStreams does not contain streams , not need afresh subscribe , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                            }
                            return;
                        }
                            L.Logger.debug('[tk-sdk]Subscriber added');
                            stream.subscribeReconnectionNumber = 0 ;
                            stream.timeoutReSubcribeNumber=0;
                            if(!options.reconnection){
                                delete stream.isCompleted ;
                                stream.reconnectionNumber = 0 ;
                            }
                            stream.pc = TK.Connection({callback: function (message) {
                                L.Logger.debug('[tk-sdk]Sending message ', message );
                                message = _ipAndStationaryStrWitch_send(message);
                                var browser_type ='chrome-stable';
                                if (stream.pc && stream.pc.browser)
                                    browser_type = stream.pc.browser;
                                sendSDPSocket('signaling_message', {streamId: stream.getID(),
                                        msg: message,
                                        browser: browser_type},
                                    undefined, function () {});
                            },
                                nop2p: true,
                                audio: options.audio,
                                video: options.video,
                                screen: false,
                                maxAudioBW: spec.maxAudioBW,
                                maxVideoBW: stream.hasScreen() ? spec.maxScreenBW : spec.maxVideoBW,
                                limitMaxAudioBW: spec.maxAudioBW,
                                limitMaxVideoBW: stream.hasScreen() ? spec.maxScreenBW : spec.maxVideoBW,
                                iceServers: that.iceServers,
                                cnnId: stream.extensionId}, stream.isTkNative);

                            stream.pc.onaddstream = function (evt) {
                                if( that.remoteStreams[stream.getID()] ){
                                    // Draw on html
                                    L.Logger.debug('[tk-sdk]Stream subscribed');
                                    stream.stream = evt.stream;
                                    if( _isGetRtcStatsrObserver){
                                        that.rtcStatsrObserver(stream);
                                    }
                                    var evt2 = TK.StreamEvent({type: 'stream-subscribed', stream: stream});
                                    L.Logger.info('[tk-sdk]stream-subscribed , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                                    that.dispatchEvent(evt2);
                                }else{
                                    L.Logger.info( '[tk-sdk]stream-subscribe:remoteStreams does not contain streams ,stream  subscribe  information does not need to be passed to the interface layer , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                                }
                            };

                            stream.pc.oniceconnectionstatechange = function (state) {
                                // No one is notifying the other subscribers that this is a failure
                                // they will only receive onRemoveStream
                                //L.Logger.debug('subscribe state' , state , stream.isCompleted ,  stream.reconnectionNumber , that.state , DISCONNECTED);
                                L.Logger.info('[tk-sdk]subscribe ice state:'+state +' , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes()));
                               if (state === 'failed') {
                                    if (that.state !== DISCONNECTED && stream &&!stream.failed) {
                                        stream.failed = true;
                                        L.Logger.warning('[tk-sdk]Subscribing stream',
                                            stream.getID(),
                                            'has failed after successful ICE checks , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes()));
                                        /*  todo 这里进行重连，不需要发送 stream-failed
                                         var disconnectEvt = TK.StreamEvent(
                                         {type: 'stream-failed',
                                         message:{reason:'Subscribing stream failed after connection' , source:'subscribe'} ,
                                         stream:stream });
                                         that.dispatchEvent(disconnectEvt);*/
                                        var source = 'subscribe' ;
                                        _oniceconnectionstatechangeFailed(stream ,state  , source);
                                    }
                                }
                            };

                            stream.pc.createOffer(true);
                            if(callback) callback(true);

                    });
            } else if (stream.hasData() && options.data !== false) {
                sendSDPSocket('subscribe',
                              {streamId: stream.getID(),
                               data: options.data,
                               metadata: options.metadata},
                              undefined, function (result, error) {
                    if (result !== 0) {
                        L.Logger.error('[tk-sdk]Error subscribing to stream ', error);
                        var Evt = TK.StreamEvent({type: 'stream-subscribe-fail' , stream:stream , message: {error:error  , hasdata:true }});
                        L.Logger.info('[tk-sdk]stream-subscribe-fail , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                        that.dispatchEvent(Evt);
                        if (callback)
                            callback(undefined, error);
                        return;
                    }
                    if( that.remoteStreams[stream.getID()] ){
                        L.Logger.debug('[tk-sdk]Stream subscribed');
                        var evt = TK.StreamEvent({type: 'stream-subscribed', stream: stream});
                        L.Logger.info('[tk-sdk]stream-subscribed , stream id:'+stream.getID()+ ' , hasData is '+ stream.hasData()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                        that.dispatchEvent(evt);
                        if(callback) callback(true);
                    }else{
                        L.Logger.info( '[tk-sdk]stream-subscribe:remoteStreams does not contain streams ,stream  subscribe  information does not need to be passed to the interface layer , stream id:'+stream.getID()+ ' , hasData is '+ stream.hasData()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                        if(callback) callback(false);
                    }
                });
            } else {
                L.Logger.warning ('[tk-sdk]There\'s nothing to subscribe to');
                if (callback) callback(undefined, 'Nothing to subscribe to');
                return;
            }
            // Subscribe to stream stream
            L.Logger.debug('[tk-sdk]Subscribing to: ' + stream.getID());
        }else{
            var error = 'Error on subscribe';
            if (!stream){
                L.Logger.warning('[tk-sdk]Cannot subscribe to invalid stream', stream);
                error = 'Invalid or undefined stream';
            }
            else if (stream.local){
                L.Logger.warning('[tk-sdk]Cannot subscribe to local stream, you should ' +
                                 'subscribe to the remote version of your local stream');
                error = 'Local copy of stream';
            }
            else if (stream.failed){
                L.Logger.warning('[tk-sdk]Cannot subscribe to failed stream, you should ' +
                                 'wait a new stream-added event.');
                error = 'Failed stream';
            }
            if (callback)
                callback(undefined, error);
            return;
        }
        return  ERR_OK;
    };

    // It unsubscribes from the stream, removing the HTML element.
    that.unsubscribe = function (stream, callback  , options) {
        // Unsubscribe from stream stream
        if (that.socket !== undefined) {
            if (stream && !stream.local) {
                options = options || {};
                sendMessageSocket('unsubscribe', stream.getID(), function (result, error) {
                    if (result !== 0) {
                        var Evt = TK.StreamEvent({type: 'stream-unsubscribe-fail' , stream:stream , message: {error:error}});
                        L.Logger.info('[tk-sdk]stream-unsubscribe-fail , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                        that.dispatchEvent(Evt);
                        if (callback)
                            callback(undefined, error);
                        return;
                    }
                    if(!options.reconnection){
                        delete stream.isCompleted ;
                        stream.reconnectionNumber = 0 ;
                    }
                    if(stream.failed){
                        delete stream.failed ;
                    }
                    removeStream(stream);
                    if (callback) callback(true);
                }, function () {
                    L.Logger.error('[tk-sdk]Error calling unsubscribe.');
                });
            }
        }
    };

    that.getStreamStats = function (stream, callback) {
        if (!that.socket) {
            return 'Error getting stats - no socket';
        }
        if (!stream) {
            return 'Error getting stats - no stream';
        }

        sendMessageSocket('getStreamStats', stream.getID(), function (result) {
            if (result) {
                callback(result);
            }
        });
    };

    //It searchs the streams that have "name" attribute with "value" value
    that.getStreamsByAttribute = function (name, value) {
        var streams = [], index, stream;

        for (index in that.remoteStreams) {
            if (that.remoteStreams.hasOwnProperty(index)) {
                stream = that.remoteStreams[index];

                if (stream.getAttributes() !== undefined &&
                    stream.getAttributes()[name] !== undefined) {

                    if (stream.getAttributes()[name] === value) {
                        streams.push(stream);
                    }
                }
            }
        }

        return streams;
    };
    //如果只是切换设备，不用重新发布，只需要将原来的本地流删除，
    //重新stream.init,再添加新的流就可以
    that.deleteStream=function(stream) {
        if (stream.stream !== undefined) {

            // Remove HTML element
            stream.hide();

            // Close PC stream
            if (stream.pc) {
              stream.pc.removeStream(stream.stream);
            }
            if (stream.local) {
                stream.stream.stop();
            }
            delete stream.stream;
        }
        //stream.pc.removeStream(stream.stream);
    };

    that.addStream=function(stream) {
        //切换设备首先删除原来的stream,再添加一个新的流
        //stream.pc.removeStream(stream);
        if(!stream){
            L.Logger.warning("[tk-sdk]not stream to addStream");
        }
        stream.pc.addStream(stream);
    };

    /*发送回放的seek消息给服务器
        @params positionTime：seek的位置，毫秒级
    */
    that.seekPlayback = function (positionTime) {
        if(!_isPlayback){L.Logger.warning('[tk-sdk]No playback environment!');return ;} ;
        try{
            positionTime = Number(positionTime);
            that.socket.emit('seekPlayback' , positionTime );
        }catch (e){
            L.Logger.error('[tk-sdk]The seek posttion must be a number, in milliseconds !');
        }
    };

    /*发送回放的暂停消息给服务器  */
    that.pausePlayback = function () {
        if(!_isPlayback){L.Logger.warning('[tk-sdk]No playback environment!');return ;} ;
        that.socket.emit('pausePlayback');
    };

    /*发送回放的播放消息给服务器
     @params positionTime：seek的位置，毫秒级
     */
    that.playPlayback = function () {
        if(!_isPlayback){L.Logger.warning('[tk-sdk]No playback environment!');return ;} ;
        that.socket.emit('Playback');
    };

    /*初始化回放信息*/
    that.initPlaybackInfo = function(host, port, params, callback , oldInitPlaybackInterface) {
        var _oldInitPlaybackInterfaceHandler = function () {
            /*旧的回放初始化回放信息*/
            var userid = undefined ;
            if(!params){L.Logger.error('[tk-sdk]params is required ,params type is json !');return ;}
            if(typeof params === 'string'){try{params = L.Utils.toJsonParse(params);}catch (e){L.Logger.error('[tk-sdk]params type must is json! ');return ;}}
            if(params.roomtype === undefined || params.serial === undefined || params.recordfilepath === undefined ){L.Logger.error('[tk-sdk]The params must be included [roomtype , serial , recordfilepath] ! ');return ;}
            _setStatus(STATUS_CHECKING);
            //_firstSaveServerNameToLocalStorage(host);
            _updateWebAddressInfo(host , port);
            //_changeWebRequestAddress();
            var response = {
                room:{
                    roomtype:params.roomtype ,
                    maxvideo:params.maxvideo || params.roomtype == 0 ? 2 : 10000 , //回放不管发布个数
                    roomrole:-1 ,
                    serial:params.serial ,
                    roomname:params.roomname || 'Play Back',
                    recordfilepath:params.recordfilepath ,
                    domain:params.domain ,
                    host:params.host ,
                    companyid:params.companyid || -1 ,
                } ,
                nickname:"playback" ,
                roomrole: -1 ,
                thirdid: userid ? userid+":playback"  : guid()+":playback"
            };
            var userinfo = {};
            var room;
            room = response.room;
            room.roomtype =  Number( room.roomtype ) ;
            room.maxvideo =  parseInt( room.maxvideo ) ;
            room.roomrole =  Number( room.roomrole ) ;
            _room_properties = room;
            _room_id = room.serial;
            _room_name = room.roomname;
            _room_type = room.roomtype ;
            _room_max_videocount = room.maxvideo;
            _recordfilepath = room.recordfilepath  ;

            userinfo.properties = {};
            userinfo.properties.role =response.roomrole  ;
            userinfo.properties.nickname = response.nickname;
            userinfo.id = response.thirdid;
            _isPlayback = true ;
            _myself = TK.RoomUser(userinfo);
            _avmgr = TK.AVMgr ;
            if(_isPlayback){
                _room_id = _room_id+"_"+_myself.id;
                if( _room_id && _room_id.indexOf(':playback') === -1 ){
                    _room_id +=":playback" ;
                }
            }
            that.setIsGetFileList(false) ; //不获取文件列表
            _isGetRtcStatsrObserver = false ; //不获取视频网络状态
            if(callback && typeof callback === 'function'){
                callback(0 , userinfo, _room_properties);
            }
            L.Logger.info('[tk-sdk]initPlaybackInfo-->_room_max_videocount:'+_room_max_videocount  + ' , my id:'+_myself.id + ' , room id:'+_room_id , 'room properties chairmancontrol is:'+ (_room_properties.chairmancontrol ? ( window.__TkSdkBuild__?L.Utils.encrypt(_room_properties.chairmancontrol):_room_properties.chairmancontrol )  : undefined ));
        };
        if(!oldInitPlaybackInterface){
            if(!params || typeof params !== 'object' ){L.Logger.error('[tk-sdk]params is required ,params type is json !');return ;}
            if(!params.recordfilepath ){L.Logger.error('[tk-sdk]params.recordfilepath is required !');return ;}
            _setStatus(STATUS_CHECKING);
            _updateWebAddressInfo(host , port);
            _isPlayback = true ;
            _avmgr = TK.AVMgr ;
            _recordfilepath = params.recordfilepath  ;
            that.setIsGetFileList(false) ; //不获取文件列表
            _isGetRtcStatsrObserver = false ; //不获取视频网络状态
            params.playback = true ;
            L.Logger.info('[tk-sdk]initPlaybackInfo to checkroom start , params is '+( window.__TkSdkBuild__ ? L.Utils.encrypt( L.Utils.toJsonStringify(params) ): L.Utils.toJsonStringify(params) )+'!');
            var url = params.recordfilepath + "room.json";
            if( /room.json/g.test(params.recordfilepath) ){
                url = params.recordfilepath ;
            }
            $.ajax({
                url:url,
                dataType: "json",
                type: 'GET',
                async: true,
            }).done(function (response) {
                L.Logger.debug('[tk-sdk]getPlaybackRoomJson resp = ', L.Utils.toJsonStringify(response));
                if(response && typeof response === 'object'){
                    _handlerCheckroom(response , function (ret , userinfo, roominfo ) {
                        if(ret === 0){
                            if(callback && typeof callback === 'function'){
                                callback(ret , userinfo, roominfo);
                            }
                        }else{
                            _oldInitPlaybackInterfaceHandler();
                        }
                    });
                }else{
                    L.Logger.error('[tk-sdk]getPlaybackRoomJson resp must is json , call oldInitPlaybackInterface handler!');
                    _oldInitPlaybackInterfaceHandler();
                }
            }).fail(function (jqXHR, textStatus, errorThrown) {
                L.Logger.error("[tk-sdk]getPlaybackRoomJson fail[ jqXHR , textStatus , errorThrown ]:", jqXHR, textStatus, errorThrown);
                _oldInitPlaybackInterfaceHandler();
            });
        }else{
            _oldInitPlaybackInterfaceHandler();
        }
    } ;

    that.updateProtocol = function (protocol) {
        PROTOCOL = protocol ;
        _webInterfaceHtmlPort = /http:/g.test(protocol) ? 81 : 8080 ;
    };

    that.checkroom=function(host, port, params, callback , userid , options) {
        if (TK.isTkNative)
            tknative.addEventListener("message", nativeMsgCallback, false);
        _setStatus(STATUS_CHECKING);
        if(!_isPlayback){
            _firstSaveServerNameToLocalStorage(host);
            _updateWebAddressInfo(host , port);
            _changeWebRequestAddress();
        }
        if( !(_serverList !== undefined && _serverName !== undefined) && !_isPlayback  ){
            var requestServerListOptions = { checkroom:true };
            that.requestServerList( _web_host, _web_port  , undefined , requestServerListOptions);
        }
        var url = PROTOCOL + _web_host + ":" + _web_port + WEBFUNC_CHECKroom+"?ts="+new Date().getTime();

        var first = true;
        var object = "";
        if (typeof params === 'string') {
            object = params ;
            if(_isPlayback){
                object += '&playback=true'
            }
        } else{
            if(_isPlayback){
                params.playback = true ;
            }
            for (var key in params) {
                if (first)
                    first = false;
                else
                    object = object + "&";

                object = object + key + "=" + params[key];
            }
        }

        L.Logger.debug('[tk-sdk]Going to checkroom', object);
        L.Logger.info('[tk-sdk]call checkroom start!');
        var xmlhttp ;
         xmlhttp =  _sendRequest(
                "POST",
                url,
                true,
                object,
                function() {
                    L.Logger.debug('[tk-sdk]Http status ', xmlhttp.readyState);
                    if (xmlhttp.readyState != 4)
                        return;

                    if (xmlhttp.status == 200) {
                        L.Logger.debug('[tk-sdk]checkroom resp : '+xmlhttp.responseText);
                        var response = L.Utils.toJsonParse(xmlhttp.responseText);//xmlhttp.responseText;
                        _handlerCheckroom(response , callback , userid);
                    }
                    else
                    {
                        L.Logger.error('[tk-sdk]checkroom fail[readyState-status]:' , xmlhttp.readyState , xmlhttp.status ) ;
                        callback(ERR_HTTP_REQUEST_FAILED,xmlhttp.responseText);
                    }
                });
    } ;

    that.getAVMgr = function () {
        return _avmgr ;
    } ;

    that.controlMedia=function(streamId, cmd){
        that.socket.emit('controlmedia', streamId, cmd);
    };

    /*更换本地设备，生成数据流改变本地媒体数据流轨道
    * @method changeLocalDeviceToLocalstream
    * @params [deviceIdMap:json , callback:function , audioouputElementIdArr:array(需要更新扩音器输出的节点元素数组) ]  */
    that.changeLocalDeviceToLocalstream = function (deviceIdMap , callback  , audioouputElementArr) {
        var _getUserMediaCallback = function (stream) {
            if(!_default_stream){
                L.Logger.error('[tk-sdk]changeLocalDeviceToLocalstream _default_stream is not exist!');
                return ;
            }
            if( _default_stream.hasVideo() !==  _myself.hasvideo){
                _default_stream.changeVideo(_myself.hasvideo ) ;
            }
            if( _default_stream.hasAudio() !==  _myself.hasaudio){
                _default_stream.changeAudio(_myself.hasaudio ) ;
            }
            if (!_default_stream.stream) {
                _default_stream.stream = stream;
            } else {
                for(var key in stream){
                    if(/^customdata_/g.test(key)){
                        _default_stream.stream[key] = stream[key];
                    }
                }
                var localTracks = _default_stream.stream.getTracks();
                for (var i = 0; i < localTracks.length; i++) {
                    var track = localTracks[i];
                    _default_stream.stream.removeTrack(track);
                }
                var newTracks = stream.getTracks();
                for (var i = 0; i < newTracks.length; i++) {
                    var track = newTracks[i];
                    _default_stream.stream.addTrack(track);
                }
            }
            if(_default_stream.player){
                _default_stream.player.changeMediaStreamUrl(_default_stream.stream);
            }
            if(_isConnected && _myself && _myself.id != undefined && _users[ _myself.id]){
                // 暂时注掉，以解决视频设备占用时切到未占用设备后其他人仍无法看到视频问题。
                // 等服务器支持单独协商音频设备信息和视频设备信息后再打开，因为C++切换设备不需要重新走发布流程。
                //if (TK.isTkNative === true) return;
                var publishstate = _myself.publishstate ;
                if(publishstate > TK.PUBLISH_STATE_NONE){
                    that.unpublish(_default_stream , function (result , error) {
                        _enableLocalAudio(true);
                        _enableLocalVideo(true);
                        _checkMyAudioAndVideoEnable(_myself.publishstate);
                        if(publishstate > TK.PUBLISH_STATE_NONE){
                            that.publish(_default_stream);
                        }
                    });
                }
            }
        };
        TK.AVMgr.changeLocalDeviceToLocalstream(_getUserMediaCallback ,deviceIdMap , callback  , audioouputElementArr);
    };

    /*请求服务器抽奖，返回抽奖结果 xgd 2017-12-28 */
    that.getLottyerDraw = function (lottyerData, callback ) {
        var host = _web_host ;
        var port = _web_port ;
        var url = PROTOCOL + host + ":" + port + WEBFUNC_LOTTERYDRAW+"?ts="+new Date().getTime();
        
        var getLottyerDrawAjaxXhr =  $.ajax({
            url:url ,
            dataType: "json",
            type: 'POST',
            data: lottyerData,
            async:false ,
        }).done(function (response) {
            L.Logger.debug('[tk-sdk]getLottyerDraw resp = ',  L.Utils.toJsonStringify(response) );
            if(callback && typeof callback === "function"){
                var code = response.result ;
                callback(code, response);
            }
        }).fail(function (jqXHR, textStatus, errorThrown){
            L.Logger.error("[tk-sdk]getLottyerDraw fail[ jqXHR , textStatus , errorThrown ]:", jqXHR , textStatus , errorThrown );
            callback(ERR_HTTP_REQUEST_FAILED,undefined);
        });

        return getLottyerDrawAjaxXhr ;
    };


    /*请求服务器抽奖，通知后台抽奖结束 wyw 2018-1-12 */
    that.getLottyerOver = function (lotteryid, callback ) {
        var host = _web_host ;
        var port = _web_port ;
        var url = PROTOCOL + host + ":" + port + WEBFUNC_LOTTERYOVER+"?ts="+new Date().getTime();
        
        var getLottyerOverAjaxXhr =  $.ajax({
            url:url ,
            dataType: "json",
            type: 'POST',
            data: {
                "lotteryid":lotteryid,
            },
            async:false ,
        }).done(function (response) {
            L.Logger.debug('[tk-sdk]getLottyerOver resp = ',  L.Utils.toJsonStringify(response) );
            if(callback && typeof callback === "function"){
                var code = response.result ;
                callback(code, response);
            }
        }).fail(function (jqXHR, textStatus, errorThrown){
            L.Logger.error("[tk-sdk]getLottyerOver fail[ jqXHR , textStatus , errorThrown ]:", jqXHR , textStatus , errorThrown );
            callback(ERR_HTTP_REQUEST_FAILED,undefined);
        });

        return getLottyerOverAjaxXhr ;
    };


    /*请求服务器抽奖，返回可抽奖人数 xgd 2018-01-04 */
    that.getLottyerDrawNum = function (serial, callback ) {
        var host = _web_host ;
        var port = _web_port ;
        var url = PROTOCOL + host + ":" + port + WEBFUNC_LOTTERYDRAWNUM+"?ts="+new Date().getTime();
        
        var getLottyerDrawNumAjaxXhr =  $.ajax({
            url:url ,
            dataType: "json",
            type: 'POST',
            data: {"serial":serial},
            async:false ,
        }).done(function (response) {
            L.Logger.debug('[tk-sdk]getLottyerDrawNum resp = ',  L.Utils.toJsonStringify(response) );
            if(callback && typeof callback === "function"){
                var code = response.result ;
                callback(code, response);
            }
        }).fail(function (jqXHR, textStatus, errorThrown){
            L.Logger.error("[tk-sdk]getLottyerDrawNum fail[ jqXHR , textStatus , errorThrown ]:", jqXHR , textStatus , errorThrown );
            callback(ERR_HTTP_REQUEST_FAILED,undefined);
        });

        return getLottyerDrawNumAjaxXhr ;
    };




    /*请求服务器抽奖查询，返回抽奖查询结果 xgd 2017-12-28 */
    that.getLottyerDrawAll = function (serial, callback ) {
        var host = _web_host ;
        var port = _web_port ;
        var url = PROTOCOL + host + ":" + port + WEBFUNC_LOTTERYDRAWALL+"?ts="+new Date().getTime();
        if(!serial){
            L.Logger.error('[tk-sdk]getLottyerDrawAll serial is required!');
            return ;
        }
      
        
        var getLottyerDrawAllAjaxXhr =  $.ajax({
            url:url ,
            dataType: "json",
            type: 'POST',
            data: {"serial":serial},
            async:false ,
        }).done(function (response) {
            L.Logger.debug('[tk-sdk]getLottyerDrawAll resp = ',  L.Utils.toJsonStringify(response) );
            if(callback && typeof callback === "function"){
                var code = response.result ;
                callback(code, response);
            }
        }).fail(function (jqXHR, textStatus, errorThrown){
            L.Logger.error("[tk-sdk]getLottyerDrawAll fail[ jqXHR , textStatus , errorThrown ]:", jqXHR , textStatus , errorThrown );
            callback(ERR_HTTP_REQUEST_FAILED,undefined);
        });

        return getLottyerDrawAllAjaxXhr ;
    };

     /*请求服务器签到添加，返回添加结果 xgd 2017-12-28 */
    that.rollCallAdd = function (rollCallData, callback ) {
        var host = _web_host ;
        var port = _web_port ;
        var url = PROTOCOL + host + ":" + port + WEBFUNC_ROLLCALLADD+"?ts="+new Date().getTime();
        
        var getRollCallAddAjaxXhr =  $.ajax({
            url:url ,
            dataType: "json",
            type: 'POST',
            data: rollCallData,
            async:false ,
        }).done(function (response) {
            L.Logger.debug('[tk-sdk]getRollCallAdd resp = ',  L.Utils.toJsonStringify(response) );
            if(callback && typeof callback === "function"){
                var code = response.result ;
                callback(code, response);
            }
        }).fail(function (jqXHR, textStatus, errorThrown){
            L.Logger.error("[tk-sdk]getRollCallAdd fail[ jqXHR , textStatus , errorThrown ]:", jqXHR , textStatus , errorThrown );
            callback(ERR_HTTP_REQUEST_FAILED,undefined);
        });

        return getRollCallAddAjaxXhr ;
    };

    /*请求服务器签到查询，返回查询结果 xgd 2017-12-28 */
    that.getRollCallAll = function (serial, callback ) {
        var host = _web_host ;
        var port = _web_port ;
        var url = PROTOCOL + host + ":" + port + WEBFUNC_ROLLCALLALL+"?ts="+new Date().getTime();

        if(!serial){
            L.Logger.error('[tk-sdk]getRollCallAll serial is required!');
            return ;
        }
        
        var getRollCallAllAjaxXhr =  $.ajax({
            url:url ,
            dataType: "json",
            type: 'POST',
            data: {"serial":serial},
            async:false ,
        }).done(function (response) {
            L.Logger.debug('[tk-sdk]getRollCallAll resp = ',  L.Utils.toJsonStringify(response) );
            if(callback && typeof callback === "function"){
                var code = response.result ;
                callback(code, response);
            }
        }).fail(function (jqXHR, textStatus, errorThrown){
            L.Logger.error("[tk-sdk]getRollCallAll fail[ jqXHR , textStatus , errorThrown ]:", jqXHR , textStatus , errorThrown );
            callback(ERR_HTTP_REQUEST_FAILED,undefined);
        });

        return getRollCallAllAjaxXhr ;
    };

    
    /*请求服务器投票接口，返回查询结果 xgd 2017-12-28 */
    that.vote = function (data, action, callback ) {
        var host = _web_host ;
        var port = _web_port ;
        if(action === 'list' || 'create' || 'result' || 'update' || 'delete'){
            var url = PROTOCOL + host + ":" + port + (action === 'list' ? 
                                                    WEBFUNC_VOTELIST : action === 'create' ? 
                                                    WEBFUNC_VOTECREATE : action === 'result' ?
                                                    WEBFUNC_VOTERESULTCREATE : action === 'update' ?
                                                    WEBFUNC_VOTEUPDATE : WEBFUNC_VOTEDELETE)+"?ts="+new Date().getTime();
        }else {
            return  L.Logger.error("[tk-sdk]vote web interface fail[action]:");
        }

        var response =  $.ajax({
            url:url ,
            dataType: "json",
            type: 'POST',
            data: data,
            async:false ,
        }).done(function (response) {
            L.Logger.debug('[tk-sdk]getVoteList resp = ',  L.Utils.toJsonStringify(response) );
            if(callback && typeof callback === "function"){
                var code = response.result ;
                callback(code, response);
            }
        }).fail(function (jqXHR, textStatus, errorThrown){
            L.Logger.error("[tk-sdk]getVoteList fail[ jqXHR , textStatus , errorThrown ]:", jqXHR , textStatus , errorThrown );
            callback(ERR_HTTP_REQUEST_FAILED,undefined);
        });

        return response ;
    };


    /*获取在线人数 xgd 2017-11-28 */
    that.getOnlineNum = function (companyid, serial, callback ) {
        var host = _web_host ;
        var port = _web_port ;
        var url = PROTOCOL + host + ":" + port + WEBFUNC_GETONLINENUM+"?ts="+new Date().getTime();
        if(!companyid){
            L.Logger.error('[tk-sdk]getOnlineNum companyid is required!');
            return ;
        }
        if(!serial){
            L.Logger.error('[tk-sdk]getOnlineNum serial is required!');
            return ;
        }
        var getOnlineNumAjaxXhr =  $.ajax({
            url:url ,
            dataType: "json",
            type: 'POST',
            data: {"companyid":companyid,"serial":serial},
            async:false ,
        }).done(function (response) {
            L.Logger.debug('[tk-sdk]getOnlineNum resp = ',  L.Utils.toJsonStringify(response) );
            if(callback && typeof callback === "function"){
                var code = response.result ;
                callback(code, response);
            }
        }).fail(function (jqXHR, textStatus, errorThrown){
            L.Logger.error("[tk-sdk]getOnlineNum fail[ jqXHR , textStatus , errorThrown ]:", jqXHR , textStatus , errorThrown );
            callback(ERR_HTTP_REQUEST_FAILED,undefined);
        });

        return getOnlineNumAjaxXhr ;
    };


    /*获取花名册 wyw 2018-1-17 */
    that.getOnlineUser = function (data, callback ) {
        var host = _web_host ;
        var port = _web_port ;
        var url = PROTOCOL + host + ":" + port + WEBFUNC_GETONLINEUSER + "?ts=" +new Date().getTime();
        if(!data){
            L.Logger.error('[tk-sdk]getOnlineUser data is required!');
            return ;
        }
        var getOnlineUserXhr =  $.ajax({
            url:url ,
            dataType: "json",
            type: 'POST',
            data: data,
            async:false ,
        }).done(function (response) {
            L.Logger.debug('[tk-sdk]getOnlineUser resp = ',  L.Utils.toJsonStringify(response) );
            if(callback && typeof callback === "function"){
                var code = response.result ;
                callback(code, response);
            }
        }).fail(function (jqXHR, textStatus, errorThrown){
            L.Logger.error("[tk-sdk]getOnlineUser fail[ jqXHR , textStatus , errorThrown ]:", jqXHR , textStatus , errorThrown );
            callback(ERR_HTTP_REQUEST_FAILED,undefined);
        });

        return getOnlineUserXhr ;
    };



    /*获取上传文件的参数*/
    that.getUploadFileParams = function (filename ,filetype , isWritedb ) {
        isWritedb = isWritedb!== undefined?isWritedb:true ;
        return {
            "serial": _room_properties['serial'],           //会议id
            "userid": _myself.id,            //用户id
            "sender": _myself.nickname,     //用户名
            "conversion": 1,               //是否进行文档转换
            "isconversiondone": 0,         //表示是否从客户端进行转换   1：客户端转换 0：否
            "writedb": isWritedb?1:0,                 //是否写数据库 1：写  0：不写
            'fileoldname':filename  ,     //原文件名(如果是原文件)
            "fieltype": filetype,             //文件类型(如果是原文件)
            "alluser": 1 ,                   //是否对所有人可见

        };
    };


    /*获取上传文件转换完成状态 xgd 2017-11-23 */
    that.docUploadFileDataInfo = function (fileId , callback ) {
        var host = _web_host ;
        var port = _web_port ;
        var url = PROTOCOL + host + ":" + port + WEBFUNC_DOCUPDATEINFO+"?ts="+new Date().getTime();
        if(!fileId){
            L.Logger.error('[tk-sdk]docUploadFileDataInfo fileId is required!');
            return ;
        }
        var docUploadDataInfoAjaxXhr =  $.ajax({
            url:url ,
            dataType: "json",
            type: 'POST',
            data: {fileid:fileId},
            async:false ,
        }).done(function (response) {
            L.Logger.debug('[tk-sdk]docUploadFileDataInfo resp = ',  L.Utils.toJsonStringify(response) );
            if(callback && typeof callback === "function"){
                var code = response.status ;
                callback(code , response);
            }
        }).fail(function (jqXHR, textStatus, errorThrown){
            L.Logger.error("[tk-sdk]docUploadFileDataInfo fail[ jqXHR , textStatus , errorThrown ]:", jqXHR , textStatus , errorThrown );
            callback(ERR_HTTP_REQUEST_FAILED,undefined);
        });

        return docUploadDataInfoAjaxXhr ;
    };

    /*上传文件*/
    that.uploadFile = function (formData , callback , progressListenCallback ) {
        return _webInterfaceUploadFile(formData , callback , progressListenCallback );
    };

    /*删除文件*/
    that.deleteFile = function (fileid , callback ) {
        _webInterfaceDeleteFile(fileid , callback );
    };

    that.setIsGetRtcStatsrObserver = function (isGetRtcStatsrObserver) {
        _isGetRtcStatsrObserver = isGetRtcStatsrObserver ;
    };

    that.setRtcStatsrObserverTimer = function (rtcStatsrObserverIntervalTime) {
        _rtcStatsrObserverIntervalTime = rtcStatsrObserverIntervalTime ;
    };

    that.stopIntervalRtcStatsrObserver = function () {
        clearInterval(that._rtcStatsrObserverTimer);
        that._rtcStatsrObserverTimer = null ;
    };

    that.startIntervalRtcStatsrObserver = function () {
        clearInterval(that._rtcStatsrObserverTimer);
        that._rtcStatsrObserverTimer = setInterval( function () {
            for(var key in that.remoteStreams){
                var stream = that.remoteStreams[key] ;
                if( stream.extensionId === _myself.id && that.localStreams[stream.getID()] ){
                    stream = _default_stream ;
                }
                // if(stream && stream.getAttributes() &&  stream.getAttributes().type === 'video' ){
                    if(stream && stream.pc){
                        that.rtcStatsrObserver(stream);
                    }
                // }
            }
        } , _rtcStatsrObserverIntervalTime)
    };

    that.stopIntervalRtcStatsrObserverByStream = function (stream) {
        if(!stream){L.Logger.error('[tk-sdk]stream is not exist!');return ;}
        clearInterval(stream.rtcStatsrObserverTimer);
        stream.rtcStatsrObserverTimer = null ;
    };

    that.startIntervalRtcStatsrObserverByStream = function(stream ,  rtcStatsrObserverByStreamIntervalTime ){
        rtcStatsrObserverByStreamIntervalTime = rtcStatsrObserverByStreamIntervalTime ||  _rtcStatsrObserverIntervalTime ;
        if(!stream){L.Logger.error('[tk-sdk]stream is not exist!');return ;}
        clearInterval(stream.rtcStatsrObserverTimer);
        stream.rtcStatsrObserverTimer = setInterval( function () {
            if(stream && stream.pc){
                that.rtcStatsrObserver(stream);
            }
        } , rtcStatsrObserverByStreamIntervalTime)
    };

    /*pc链路状态*/
    that.rtcStatsrObserver = function (stream) {
        if( !stream ){L.Logger.error('[tk-sdk]stream is not exist!'); return ;};
        if( stream.extensionId === _myself.id && that.localStreams[stream.getID()] ){
            stream = _default_stream ;
        }
        if( !stream.pc ){L.Logger.error('[tk-sdk]stream.pc is not exist , stream id and extensionId:'+stream.getID() +','+stream.extensionId+'!'); return ;};
        if(stream && stream.pc){
            if (stream.pc.isNative === true) {
                var slog = 'pc.getStats has not been implemented currently!' ;
                L.Logger.debug('[tk-sdk]' + slog);
                clearTimeout( that._rtcStatsrObserverTimer );
                clearTimeout( stream.rtcStatsrObserverTimer );
                that._rtcStatsrObserverTimer = null ;
                stream.rtcStatsrObserverTimer = null ;
                var evt = TK.StreamEvent({type: 'stream-rtcStats-failed', stream: stream  , message:{error:'[tk_client]'+slog , code:L.Constant.getStats.nativeFailure , isNative:stream.pc.isNative } });
                that.dispatchEvent(evt);
                return;
            }

            if(!stream.pc.getStats){
                var error = 'pc.getStats is not exist!' ;
                L.Logger.error('[tk-sdk]'+error);
                //clearTimeout( that._rtcStatsrObserverTimer );
                clearTimeout( stream.rtcStatsrObserverTimer );
                // that._rtcStatsrObserverTimer = null ;
                stream.rtcStatsrObserverTimer = null ;
                var evt = TK.StreamEvent({type: 'stream-rtcStats-failed', stream: stream  , message:{error:error , code:L.Constant.getStats.pcNotGetStats , isNative:stream.pc.isNative} });
                that.dispatchEvent(evt);
                return ;
            }else{
                try{
                    var _getStatsCallback = function (stats , code) {
                        if(code !== undefined && (code === -1 ||  code === -2 || code === -3) ){
                            var error = 'pc.getStats -> getStats not exist!' ;
                            L.Logger.error('[tk-sdk]'+error);
                            // clearTimeout( that._rtcStatsrObserverTimer );
                            clearTimeout( stream.rtcStatsrObserverTimer );
                            stream.rtcStatsrObserverTimer = null ;
                            var evt = TK.StreamEvent({type: 'stream-rtcStats-failed', stream: stream  , message:{error:error , code:code === -1 ? L.Constant.getStats.peerConnectionNotGetStats :( code === -2 ? L.Constant.getStats.getStatsFailure : L.Constant.getStats.getStatsError) , isNative:stream.pc.isNative} });
                            that.dispatchEvent(evt);
                            return ;
                        }
                        var streamNetworkStatusInfo = _rtcStatsrObserver(stream , stats);
                        if(streamNetworkStatusInfo){
                            stream.networkStatus = streamNetworkStatusInfo ;
                            // L.Logger.debug('[tk-sdk]stream-rtcStats info:'+L.Utils.toJsonStringify(streamNetworkStatusInfo) + ',by stream id is '+ stream.getID() );
                            var evt = TK.StreamEvent({type: 'stream-rtcStats', stream: stream  , message:{networkStatus:streamNetworkStatusInfo} } , false );
                            that.dispatchEvent(evt , false);
                        }else{
                            that.rtcStatsrObserver(stream);
                        }
                    };
                    stream.pc.getStats( _getStatsCallback );
                }catch (e){
                    L.Logger.error('[tk-sdk]pc.getStats error:' , e) ;
                }
            }
        }
    };

    that.initBroadcast = function (url, fps, key_sec, width, height) {
        if (!url)
        {
            L.Logger.error('[tk-sdk]argument url of initBroadcast function not exist!');
            return;
        }
        if (!fps)
            fps = 10;
        if (!key_sec)
            key_sec = 3;
        if (!width || !height)
        {
            L.Logger.error('[tk-sdk]argument width or height of initBroadcast function not exist!');
            return;
        }
        tknative.postMessage({command: "initBroadcast", url: url.toString(), fps: Number(fps), key_sec: Number(key_sec), width: Number(width), height: Number(height)});
    };

    that.uninitBroadcast = function () {
        tknative.postMessage({command: "uninitBroadcast"});  
    }

    that.startBroadcast = function (extensionId) {
        if (!extensionId){
            L.Logger.error('[tk-sdk]argument extensionId of startBroadcast function not exist!')
            return;
        }
        tknative.postMessage({command: "startBroadcast", streamId: extensionId});
    };

    that.stopBroadcast = function () {
        tknative.postMessage({command: "stopBroadcast"});
    };

    that.addOndevicechange = function(){
        if(!_isPlayback){
            var _changeCallback = function (event) {
                var args = [];
                for(var key in arguments){
                    args.push(arguments[key]);
                }
                _deviceChangeCallback(event);
            };
            if(TK && TK.AVMgr && TK.AVMgr.addOndevicechange){
                var isOk = TK.AVMgr.addOndevicechange(_changeCallback);
                if(isOk){
                    var addOndevicechangeEvent = {type:'add_device_change_listener'};
                    that.dispatchEvent(addOndevicechangeEvent);
                }
            }else{
                L.Logger.error('TK.AVMgr no initialization is done!');
            }
        }
    };

    that.removeOndevicechange = function(){
        if(TK && TK.AVMgr && TK.AVMgr.removeOndevicechange){
            var isOk = TK.AVMgr.removeOndevicechange();
            if(isOk){
                var removeOndevicechangeEvent = {type:'remove_device_change_listener'};
                that.dispatchEvent(removeOndevicechangeEvent);
            }
        }else{
            L.Logger.error('TK.AVMgr no initialization is done!');
        }
    };

    that.startRecordStream = function(stream, options, callback) {
        if (_status != STATUS_ALLREADY)
            return ERR_INVALID_STATUS;

        if (stream === undefined || stream.getID() === undefined)
            return ERR_BAD_PARAMETERS;

        var params = {};
        params.streamId = stream.getID();
        params.convert = options.convert || 0;
        sendMessageSocket('startRecordStream', params, function(ret, path){
            L.Logger.debug('startRecordStream', ret, path);
            callback(ret, path);
        });
        return ERR_OK;
    };

    that.stopRecordStream = function(stream, callback) {

        if (_status != STATUS_ALLREADY)
            return ERR_INVALID_STATUS;

        if (stream === undefined || stream.getID() === undefined)
            return ERR_BAD_PARAMETERS;

        var params = {};
        params.streamId = stream.id;
        sendMessageSocket('stopRecordStream', params, function(ret){
            L.Logger.debug('stopRecordStream', ret);
            callback(ret);
        });
        return ERR_OK;
    };

    that.getRoomMaxVideocount = function () {
        return   _room_max_videocount;
    };

    that.updateRoomMaxVideocount = function (room_max_videocount) {
        _room_max_videocount = room_max_videocount ;
        L.Logger.info('[tk-sdk]updateRoomMaxVideocount --> update room_max_videocount to '+ _room_max_videocount);
    };

    that.requestServerList = function(web_host , web_port , callback  , options ){
        if(!_requestServerListPermission){
            if(callback && typeof callback === 'function'){
                callback( undefined  , -2);
            }
            return undefined ;
        }
        if(that.webInterfaceGetservering ||  that.webInterfaceGetserverNameing){
            L.Logger.info('[tk-sdk]requestServerList  interface is being requested and cannot be executed again requestServerList');
            if(callback && typeof callback === 'function'){
                callback( _serverList  , -2);
            }
            return undefined;
        }
        if(_serverList !== undefined && _serverName !== undefined ){
            if(callback && typeof callback === 'function'){
                callback( _serverList  , -1);
            }
            return _serverList ;
        }else{
            if( (web_host === undefined ||  web_host === null) ||(web_port === undefined ||  web_port === null)){L.Logger.error('[tk-sdk]first requestServerList web_host or web_port is not exist!');return ;} ;
            var  _localstorageGetserverName = function(web_host , callback){
                _firstSaveServerNameToLocalStorage(web_host);
                if(callback && typeof callback === 'function'){
                    callback();
                }
            };

            _temp_web_host = web_host ;
            _temp_web_port = web_port ;
            L.Logger.debug('[tk-sdk]Going to requestServerList');
            var isWebInterfaceGetserverCallback = false , isWebInterfaceGetserverNameCallback = false ;
            var _handleCallback = function(){
                if(isWebInterfaceGetserverCallback && isWebInterfaceGetserverNameCallback){
                    _updateSelectServer(_serverList , _serverName );
                    L.Logger.info('[tk-sdk]requestServerList finshed , serverName is '+_serverName+' , serverlist info : ' , (window.__TkSdkBuild__?L.Utils.encrypt( L.Utils.toJsonStringify(_serverList)): L.Utils.toJsonStringify(_serverList)) );
                    var disconnectEvt = TK.RoomEvent({type: 'room-serverlist',
                        message:{serverList:_serverList , serverName:_serverName}});
                    that.dispatchEvent(disconnectEvt);
                    if( callback && typeof callback === 'function' ){
                        callback( _serverList , 0 );
                    }
                }
            };
            that.webInterfaceGetservering = true ;
            that.webInterfaceGetserverNameing = true ;
            _webInterfaceGetserver(web_host , web_port , function (nRet,responseText) {
                that.webInterfaceGetservering = false ;
                isWebInterfaceGetserverCallback = true ;
               _handleCallback();
            });

            _localstorageGetserverName(web_host , function () {
                that.webInterfaceGetserverNameing = false ;
                isWebInterfaceGetserverNameCallback = true ;
                _handleCallback();
            });

            /*_webInterfaceGetserverName(web_host , _webInterfaceHtmlPort , function (nRet,responseText) {
                that.webInterfaceGetserverNameing = false ;
                isWebInterfaceGetserverNameCallback = true ;
                _handleCallback();
            });
            */
        }
    };

    that.getServerName = function () {
        return _serverName ;
    };

    that.switchServerByName = function (serverName) {
        if(_serverList === undefined){
            L.Logger.error('[tk-sdk]selectServerByName --> service list not request  , list is not exist!');
            return false;
        }
        if(!_serverList[serverName]){
            L.Logger.error('[tk-sdk]selectServerByName --> the service list  has no option name  ' + serverName +'!');
            return false;
        }
        if(_web_host !== undefined && _web_port !== undefined){
            if(_connectedNumber > 0){
                _serverName = serverName ;
                L.Utils.localStorage.setItem('tkLocalstorageServerName' , _serverName );
                _updateSelectServer(_serverList , _serverName );
                _changeWebRequestAddress();
                if(_old_web_host !== _web_host){
                    var options = {source:'select service reconnect'};
                    _reGetconfigToJoinRoom(options);
                }else{
                    L.Logger.info('[tk-sdk]web request host is not change , not need reconnect service!');
                }
            }else{
                L.Logger.error('[tk-sdk]selectServerByName-->The room has no connection success and cannot perform a reswitch server! ');
            }
        }else{
            L.Logger.error('[tk-sdk]selectServerByName-->web request host and port is not exist , cannot perform a reswitch server! ');
        }
        return true ;
    };

    that.selectServerToCheckroom = function(serverName , params , callback , userid , options){
        serverName = serverName || _serverName ;
        if(_serverList === undefined){
            L.Logger.error('[tk-sdk]selectServerToCheckroom -->service list not request  , list is not exist!');
            if(callback && typeof callback === 'function'){
                callback(-2 , undefined , undefined) ;
            }
            return ;
        }
        if(!_serverList[serverName]){
            L.Logger.error('[tk-sdk]selectServerToCheckroom -->the service list  has no option name  ' + serverName +'!');
            if(callback && typeof callback === 'function'){
                callback(-2 , undefined , undefined) ;
            }
            return ;
        }
        _serverName = serverName ;
        L.Utils.localStorage.setItem('tkLocalstorageServerName' , _serverName );
        _updateSelectServer(_serverList , _serverName );
        _updateWebAddressInfo(_temp_web_host , _temp_web_port);
        if(_web_host !== undefined && _web_port !== undefined){
            _changeWebRequestAddress();
            that.checkroom(_web_host, _web_port, params, callback , userid , options);
        }else{
            L.Logger.error('[tk-sdk]web request host and port is not exist , cannot call checkroom ! ');
        }
    };

    that.getWebAddressInfo = function(){
        return{
            host:_web_host ,
            port:_web_port,
            protocol:PROTOCOL
        }
    };

    that.updateRequestServerListPermission = function (requestServerListPermission) {
        _requestServerListPermission  = requestServerListPermission ;
    };

    that.stopStreamTracksFromDefaultStream = function () {
        if(_default_stream && _default_stream.stream){
            if(TK.AVMgr.stopStreamTracks){
                TK.AVMgr.stopStreamTracks(_default_stream.stream);
            }else{
                L.Logger.warning('[tk-sdk] TK.AVMgr.stopStreamTracks is not exist , inexecutable stopStreamTracksFromDefaultStream');
            }
        }else{
            L.Logger.warning('[tk-sdk] defaultstream.stream is not exist , inexecutable stopStreamTracksFromDefaultStream');
        }
    };
    
    that.getValidWindowList = function (type, callback) {
        if (type === undefined || type === null || typeof callback !== "function") {
            L.Logger.error('[tk-sdk] getValidWindowList function got wrong arguments');
            return;
        }     
        var seqId = that.getNativeCallSeq();
        waitNativeToCallbackList[seqId] = callback;
        tknative.postMessage({command: "getValidWindowList", type: Number(type), seq: seqId});
    }

    that.updateWindowSource = function (windowSource) {
        if (!windowSource.id)
            windowSource.id = 0;
        if (!windowSource.x)
            windowSource.x = 0;
        if (!windowSource.y)
            windowSource.y = 0;
        if (!windowSource.width)
            windowSource.width = 0;
        if (!windowSource.height)
            windowSource.height = 0;
        if (!windowSource.mixMic)
            windowSource.mixMic = false;
        if (!windowSource.mixSpk)
            windowSource.mixSpk = false;
        if (!windowSource.type)
            windowSource.type = 0;

        tknative.postMessage({command: "updateWindowSource", 
            id: Number(windowSource.id), 
            left: Number(windowSource.x), 
            top: Number(windowSource.y), 
            width: Number(windowSource.width), 
            height: Number(windowSource.height), 
            mixMic: windowSource.mixMic, 
            mixSpk: windowSource.mixSpk,
            type: Number(windowSource.type)});
    }

    that.getMonitorCount = function (callback) {
        if (!TK.isTkNative) return;
        if (typeof callback !== "function") {
            L.Logger.error('[tk-sdk] getMonitorCount function got wrong arguments');
            return;
        }
        var seqId = that.getNativeCallSeq();
        waitNativeToCallbackList[seqId] = callback;
        tknative.postMessage({command: "getMonitorCount", seq: seqId});
    }

    that.enableViceMonitor = function () {
        if (!TK.isTkNative) return;
        _subscribe_from_native = true;
        tknative.postMessage({command: "enableViceMonitor"});   
    }

    that.takeSnapshot = function (minimize, filename, requestid, callback) {
        if (!TK.isTkNative) return;
        if (!filename || !requestid) {
            L.Logger.error('[tk-sdk] takeSnapshot function got wrong arguments');
            return;
        }
        if (typeof callback !== "function") {
            L.Logger.error('[tk-sdk] takeSnapshot function got wrong arguments');
            return;
        }
        waitNativeToCallbackList[requestid] = callback;
        tknative.postMessage({command: "takeSnapshot", needMin: minimize, fileName: filename, requestId: requestid});
    }

    // param = {type:Int, fileName:Boolean}
    // type:0-mp3, 1-flv
    // callback(param1)
    // param1 = {action:String, filepath:String}
    // action:Failed, Recording
    that.startLocalRecord = function (param, callback) {
        if (!TK.isTkNative) return;
        if (!param || typeof callback !== "function") {
            L.Logger.error('[tk-sdk] startRecordScreen function got wrong arguments');
            return;
        }
        var seqId = that.getNativeCallSeq();
        waitNativeToCallbackList[seqId] = callback;
        tknative.postMessage({command: "startLocalRecord", args: param, seq: seqId});
    }

    // param = {type:Int}
    that.stopLocalRecord = function (param) {
        if (!TK.isTkNative) return;
        tknative.postMessage({command: "stopLocalRecord", args: param});
    }

    // param = {type:Int, pause:Boolean}
    // callback(param1)
    // param1 = {action:String}
    // action:Paused, Recording
    that.pauseLocalRecord = function (param, callback) {
        if (!TK.isTkNative) return;
        if (!param || typeof callback !== "function") {
            L.Logger.error('[tk-sdk] pauseLocalRecord function got wrong arguments');
            return;
        }
        var seqId = that.getNativeCallSeq();
        waitNativeToCallbackList[seqId] = callback;
        tknative.postMessage({command: "pauseLocalRecord", args: param, seq: seqId});
    };

    that.shutdownNativeClient = function () {
        if (!TK.isTkNative) return;
        tknative.postMessage({command: "shutdownNativeClient"});   
    };

    // param = {caption:String, filter:String}
    // callback(param1)
    // param1 = {action:String, filename:String}
    // action:Activated, Cancelled, Complete
    that.getOpenFileName = function (param, callback) {
        if (!TK.isTkNative) return;
        if (!param || typeof callback !== "function") {
            L.Logger.error('[tk-sdk] getOpenFileName function got wrong arguments');
            return;
        }
        var seqId = that.getNativeCallSeq();
        waitNativeToCallbackList[seqId] = callback;
        tknative.postMessage({command: "getOpenFileName", args: param, seq: seqId});
    }

    // param = {caption:String, filter:String}
    // callback(param1)
    // param1 = {action:String, filename:String}
    // action:Activated, Cancelled, Complete
    that.getSaveFileName = function (param, callback) {
        if (!TK.isTkNative) return;
        if (!param || typeof callback !== "function") {
            L.Logger.error('[tk-sdk] getSaveFileName function got wrong arguments');
            return;
        }
        var seqId = that.getNativeCallSeq();
        waitNativeToCallbackList[seqId] = callback;
        tknative.postMessage({command: "getSaveFileName", args: param, seq: seqId});
    }

    // callback(param)
    // param = {duration:Int, pos:Double}
    that.getMediaPlayPos = function (callback) {
        if (!TK.isTkNative) return;
        if (typeof callback !== "function") {
            L.Logger.error('[tk-sdk] getMediaPlayPos function got wrong arguments');
            return;
        }
        var seqId = that.getNativeCallSeq(); // Note: seqId overflow ?
        waitNativeToCallbackList[seqId] = callback;
        tknative.postMessage({command: "getMediaPlayPos", seq: seqId});   
    }

    // bPause:Boolean
    that.pauseMediaFile = function (bPause) {
        if (!TK.isTkNative) return;
        if (!pause) {
            L.Logger.error('[tk-sdk] pauseMediaFile function got wrong arguments');
            return;
        }
        tknative.postMessage({command: "pauseMediaFile", pause: bPause});      
    }

    // position:Double
    that.seekMediaFile = function (position) {
        if (!TK.isTkNative) return;
        if (!position) {
            L.Logger.error('[tk-sdk] seekMediaFile function got wrong arguments');
            return;
        }
        tknative.postMessage({command: "seekMediaFile", pos: position});
    }

    // Call this funciton, the onTalkWindowClose function will be called when client close button pressed.
    that.listenCloseEvent = function () {
        if (!TK.isTkNative) return;
        try{
            talk_window.listenCloseEvent();
        }catch(e){
            L.Logger.error('[tk-sdk] listenCloseEvent function can not be called');
        };
    }

    that.closeWindow = function () {
        if (!TK.isTkNative) return;
        try{
            talk_window.closeWindow();
        }catch(e){
            L.Logger.error('[tk-sdk] closeWindow function can not be called');
        };   
    }



    /*直播回放仿服务器通信接口*/
    that.liveSimulateServerCommunicationInterface = function(interfaceName){
      if(_handlerCallbackJson['_handler_'+interfaceName] && typeof _handlerCallbackJson['_handler_'+interfaceName] === 'function'){
          var interfaceArrayArgs = [] ;
          for(var i =1 ; i<arguments.length ; i++){
              interfaceArrayArgs.push(arguments[i]);
          }
          _handlerCallbackJson['_handler_'+interfaceName].apply(null , interfaceArrayArgs);
      }
    };

    // Private functions
    function _count(obj){
        var objType = typeof obj;
        if(objType == "string"){
            return obj.length;
        }else if(objType == "object"){
            var objLen = 0;
            for(var i in obj){
                objLen++;
            }
            return objLen;
        }
        return false;
    };

    function _firstSaveServerNameToLocalStorage(web_host){
        if(!_serverName){
            var _tkLocalstorageServerName = L.Utils.localStorage.getItem('tkLocalstorageServerName') ;
            if( _tkLocalstorageServerName && _tkLocalstorageServerName != undefined && _tkLocalstorageServerName!=null && _tkLocalstorageServerName!='undefind' && _tkLocalstorageServerName !='null' ){
                _serverName = _tkLocalstorageServerName;
            }else if( web_host && !(/(192.168.|127.0.0.1|127.17.|localhost)/g.test( web_host ) ) ){
                var firstDotIndex = web_host.indexOf('.') ;
                if(firstDotIndex > 0 ){
                    var serverNameStr = web_host.substring(0 , firstDotIndex );
                    if(serverNameStr){
                        _serverName = serverNameStr ;
                        //L.Utils.localStorage.setItem('tkLocalstorageServerName' , _serverName );
                    }
                }else{
                    L.Logger.warning('[tk-sdk]firstSaveServerNameToLocalStorage-->web request host not find first dot , current host is '+  (window.__TkSdkBuild__?L.Utils.encrypt(web_host):web_host) +' ! ');
                }
            }else{
                L.Logger.warning('[tk-sdk]firstSaveServerNameToLocalStorage-->servername is undefind and web_host is exist or not a domain name , current host is '+  (window.__TkSdkBuild__?L.Utils.encrypt(web_host):web_host) +' ! ');
            }
        }
    }
    function _updateWebAddressInfo(host , port) {
        _web_host = host || _web_host ;
        _web_port = port || _web_port ;
        var Evt = TK.RoomEvent({type: 'room-updateWebAddressInfo', message:{host:_web_host , port:_web_port } });
        that.dispatchEvent(Evt);
    }
    function _reGetconfigToJoinRoom( options , callback,error  ) {
        var oldRoomUri = _room_uri ;
        options = options || {};
        options.source  = options.source || 'unknown source' ;
        var source =   options.source ;
       /* if(source === 'select service reconnect'){
            oldRoomUri = undefined ; //测试选择服务器
        }*/
        _step2GetConfig(_web_host, _web_port, function(result,responseText) {
            if(result!==0){
                L.Logger.error('[tk-sdk]'+source+':step2GetConfig failure --> result and responseText:' , result ,  responseText);
            }else if (result == 0 && _status == STATUS_GETTINGCFG) {
                if( !( oldRoomUri  === _room_uri ) ){
                    that.needReconnectSocket = true ;
                    if(_isGetRtcStatsrObserver){
                        that.stopIntervalRtcStatsrObserver();
                    }
                    if(_default_stream.rtcStatsrObserverTimer){
                        that.stopIntervalRtcStatsrObserverByStream(_default_stream);
                    }
                    if (TK.isTkNative){
                        tknative.postMessage({command: "nativeClear"});
                    }
                    _isDesktopSharing = false;
                    try {
                        if(that.socket && that.socket.disconnect){
                            that.socket.disconnect(); // Close socket
                        }
                    } catch (error) {
                        L.Logger.debug('[tk-sdk]'+source+':Socket already disconnected , disconnect errorInfo:' , error);
                    }
                    that.socket = undefined;
                    if(source === 'select service reconnect'){
                        _resetRoomState();
                        var disconnectEvt = TK.RoomEvent({type: 'room-disconnected',
                            message: 'select service reconnect , need socket disconnect'});
                        that.dispatchEvent(disconnectEvt);
                    }
                }
                _step2GetFileList(_web_host, _web_port, function(result,message) {
                    L.Logger.debug('[tk-sdk]reconnected room:step2GetFileList result = '  + result + ' , message:'+ L.Utils.toJsonStringify(message) );
                    if(result !== -1 ){
                        if (message !== undefined) {
                            _room_filelist = message;
                            var Evt = TK.RoomEvent({type: 'room-files', message: _room_filelist});
                            that.dispatchEvent(Evt);
                        } else {
                            _room_filelist = [];
                            var Evt = TK.RoomEvent({type:'room-error',message:{source:L.Constant.roomError.GETFILELISTERROR , error:result }});
                            that.dispatchEvent(Evt);
                        }
                    }else {
                        L.Logger.info('[tk-sdk]'+source+':step2GetFileList code is '+result);
                    }
                    if(oldRoomUri  === _room_uri ){
                        L.Logger.info('[tk-sdk]'+source+':room socket url not change  , room socket url:'+(window.__TkSdkBuild__?L.Utils.encrypt( _room_uri ):_room_uri )+'! ');
                        if(source === 'reconnected room'){
                            _step4Join(callback,error);
                        }else if (source === 'select service reconnect') {
                            L.Logger.warning('[tk-sdk]room uri is not change , no need to perform a reload server');
                            if(_isConnected && _myself && _myself.id && _users[_myself.id] && _serverName !== _myself.servername){
                                that.changeUserProperty(_myself.id, "__all", {servername:_serverName});
                            }
                        }
                    }else{
                        L.Logger.info('[tk-sdk]'+source+':room socket url  changed  , old room socket url:'+(window.__TkSdkBuild__?L.Utils.encrypt( oldRoomUri ):oldRoomUri )+'  , now room socket url:'+(window.__TkSdkBuild__?L.Utils.encrypt( _room_uri ):_room_uri )+ '! ');
                        _step3Connect();
                    }
                });
            } else {
                L.Logger.error('[tk-sdk]'+source+':step2GetConfig failure --> result and responseText:' , result ,  responseText , ' , _status = '+_status);
                var Evt = TK.RoomEvent({type:'room-error',message:{source:L.Constant.roomError.GETCONFIGERROR , error:result }});
                that.dispatchEvent(Evt);
            }
        });
    }
    function _updateSelectServer(serverlist , serverName) {
        serverlist = serverlist || _serverList ;
        serverName = serverName || _serverName ;
        if(serverlist !== undefined && serverName !== undefined){
            for(var key in serverlist){
                if(serverName === key){
                    serverlist[key].isUseServer = true ;
                }else{
                    serverlist[key].isUseServer = false ;
                }
            }
        }
    };
    function _changeWebRequestAddress() {
      /*  if(_serverList === undefined){
            L.Logger.error('[tk-sdk]_changeWebRequestAddress-->service list not request  , list is not exist!');
            return ;
        }
        if(!_serverList[_serverName]){
            L.Logger.error('[tk-sdk]_changeWebRequestAddress --> the service list  has no option name  ' + _serverName +'!');
            return ;
        }*/
        if(  !(/(192.168.|127.0.0.1|127.17.|localhost)/g.test(_web_host) ) ){
            if(_web_host !== undefined){
                var firstDotIndex = _web_host.indexOf('.') ;
                if(firstDotIndex > 0 ){
                    var replaceStr = _web_host.substring(0 , firstDotIndex );
                    var regExp = new RegExp(replaceStr);
                    _old_web_host = _web_host ;
                    var replace_web_host = _web_host.replace(regExp , _serverName) ;
                    if(replace_web_host !==  _web_host){
                        L.Logger.info('[tk-sdk]changeWebRequest host , old host is '+  (window.__TkSdkBuild__?L.Utils.encrypt(_old_web_host):_old_web_host) + ', now host is '+  (window.__TkSdkBuild__?L.Utils.encrypt(replace_web_host):replace_web_host)   ) ;
                        _updateWebAddressInfo(replace_web_host);
                    }else{
                        L.Logger.info('[tk-sdk]changeWebRequest host , host is not change ,   host is '+  (window.__TkSdkBuild__?L.Utils.encrypt(_web_host):_web_host)  ) ;
                    }
                }else{
                    L.Logger.error('[tk-sdk]web request host not find first dot , cannot address to replace , current host is '+  (window.__TkSdkBuild__?L.Utils.encrypt(_web_host):_web_host) +' ! ');
                }
            }else{
                L.Logger.error('[tk-sdk]web request host is not exist , cannot call changeWebRequestAddress ! ');
            }
        }
    };
    function _checkMyAudioAndVideoEnable(publishstate  , videoInfo , audioInfo ) {
        publishstate = publishstate || _myself.publishstate ;
        videoInfo = videoInfo || {
                hasvideo:_myself.hasvideo ,
                disablevideo:_myself.disablevideo
            };
        audioInfo = audioInfo || {
                hasaudio:_myself.hasaudio ,
                disableaudio:_myself.disableaudio
            };
        _enableLocalVideo( videoInfo.hasvideo && !videoInfo.disablevideo && ( publishstate === TK.PUBLISH_STATE_VIDEOONLY || publishstate === TK.PUBLISH_STATE_BOTH ) );
        _enableLocalAudio( audioInfo.hasaudio && !audioInfo.disableaudio && ( publishstate=== TK.PUBLISH_STATE_AUDIOONLY  || publishstate === TK.PUBLISH_STATE_BOTH ) );
    }
    function  _enableLocalAudio(enable) {
        _default_stream.muteAudio(!enable, function (message) {
            if (_default_stream.getID() !== undefined || _default_stream.getID() !== 'local') {
                L.Logger.debug('[tk-sdk]Sending message', message);
                message = _ipAndStationaryStrWitch_send(message);
                sendSDPSocket('signaling_message', {streamId: _default_stream.getID(), msg: message});
            }
        });
    }
    function  _enableLocalVideo(enable) {
        _default_stream.muteVideo(!enable, function (message) {
            if (_default_stream.getID() !== undefined || _default_stream.getID() !== 'local') {
                L.Logger.debug('[tk-sdk]Sending message', message);
                message = _ipAndStationaryStrWitch_send(message);
                sendSDPSocket('signaling_message', {streamId: _default_stream.getID(), msg: message});
            }
        });
    }
    function _onRemoteMessage(add, inList,message) {
        L.Logger.debug('[tk-sdk]msg: ' + message);
        var id = message.id!==undefined ? message.id : "";
        var name = message.name!==undefined ? message.name : "";
        var data = message.data;
        /*long ts = (message.get("ts") instanceof Long) ? (Long)message.get("ts") : 0;*/
        var ts = message.ts;
        message.add = add;

        /*boolean isWbMsg = false;
         if (_wb != null && !inList)
         isWbMsg = _wb.onRemoteMsg(add, id, name, ts, data);

         if (!isWbMsg && _cbk != null)
         _cbk.roomManagerOnRemoteMsg(add, id, name, ts, data);*/
        var connectEvt = TK.RoomEvent({type: 'room-remotemsg', message: message});
        that.dispatchEvent(connectEvt);
    }
    function  _oniceconnectionstatechangeFailed(stream , state , source) {
        if (state === 'failed') {
            if(stream.reconnectionNumber === undefined){stream.reconnectionNumber = 0;};
            if (that.state !== DISCONNECTED && stream && stream.reconnectionNumber < STREAMMAXRECONNECTIONNUMBER ) {
                if(source === 'publish'){
                    if(stream.extensionId === _myself.id){
                        L.Logger.info( '[tk-sdk]oniceconnectionstatechange failed -->unpublish , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                        that.unpublish(stream , function (ret) {
                            setTimeout( function(){
                                if(!ret){
                                    L.Logger.warning('[tk-sdk]oniceconnectionstatechange failed: unpublish in not success , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes()) +' !');
                                }
                                if(_myself.publishstate > TK.PUBLISH_STATE_NONE){
                                    L.Logger.info( '[tk-sdk]oniceconnectionstatechange failed -->publish , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                                    stream.reconnectionNumber++ ;
                                    that.publish(stream , {reconnection:true});
                                }else{
                                    L.Logger.warning( '[tk-sdk]oniceconnectionstatechange failed -->my publishstate is 0 , not need afresh publish , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                                }
                            } ,1000);
                        }, {reconnection:true});
                    }else{
                        that.unpublish(stream);
                        L.Logger.info('[tk-sdk]publish stream stream.extensionId != _myself.id   , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes()) );
                    }
                }else if(source === 'subscribe'){
                    L.Logger.info( '[tk-sdk]oniceconnectionstatechange failed -->unsubscribe , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                    that.unsubscribe(stream , function (ret) {
                        setTimeout( function(){
                            if(!ret){
                                L.Logger.warning('[tk-sdk]oniceconnectionstatechange failed: unsubscribe in not success , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes()) +' !');
                            }
                            if( that.remoteStreams[stream.getID()] ){
                                stream.reconnectionNumber++ ;
                                L.Logger.info( '[tk-sdk]oniceconnectionstatechange failed -->stream-removed(initiative) , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                                var evt2 = TK.StreamEvent({type: 'stream-removed', stream: stream , message:{reconnection:true , reconnectionNumber:stream.reconnectionNumber , isCompleted:stream.isCompleted  , source:source , isNotRemote:true  }});
                                that.dispatchEvent(evt2);
                                L.Logger.info( '[tk-sdk]oniceconnectionstatechange failed -->subscribe , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                                that.subscribe(stream , {reconnection:true});
                            }else{
                                L.Logger.info( '[tk-sdk]oniceconnectionstatechange failed -->remoteStreams does not contain streams , not need afresh subscribe , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                            }
                        } ,1000);
                    }, {reconnection:true});
                }
            }else if(  stream.reconnectionNumber >= STREAMMAXRECONNECTIONNUMBER ){
                if(source === 'publish'){
                    if( stream.extensionId === _myself.id && _myself.publishstate > TK.PUBLISH_STATE_NONE){
                        that.changeUserProperty(stream.extensionId, "__all", {publishstate:TK.PUBLISH_STATE_NONE});
                    }else{
                        that.unpublish(stream);
                    }
                }else if(source === 'subscribe'){
                    that.unsubscribe(stream);
                }
                if(!stream.isCompleted && _myself.udpstate !==  L.Constant.udpState.notOnceSuccess){
                    that.changeUserProperty(_myself.id, "__all", {udpstate: L.Constant.udpState.notOnceSuccess});
                }
                 L.Logger.info('[tk-sdk]stream-reconnection-failed , source is ' + source +', isCompleted is ' + stream.isCompleted +', reconnectionNumber is ' + stream.reconnectionNumber +' , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                 var disconnectEvt = TK.StreamEvent({
                     type: 'stream-reconnection-failed',
                     message:{reconnectionNumber:stream.reconnectionNumber  , source:source , isCompleted:stream.isCompleted  , code:!stream.isCompleted?L.Constant.streamReconnection.notOnceSuccess:L.Constant.streamReconnection.midwayReconnectionNotSuccess } ,
                     stream:stream
                 });
                 that.dispatchEvent(disconnectEvt);
            }
        }
    };
    function _resetRoomState( ) { //重置房间状态
        var index, stream, evt2 ;
        // Remove all streams
        for (index in that.remoteStreams) {
            if (that.remoteStreams.hasOwnProperty(index)) {
                stream = that.remoteStreams[index];
                removeStream(stream);
                delete that.remoteStreams[index];
                if (stream && !stream.failed){
                    L.Logger.info('[tk-sdk]_resetRoomState-->stream-removed(), stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                    evt2 = TK.StreamEvent({type: 'stream-removed', stream: stream});
                    that.dispatchEvent(evt2);
                }
            }
        }
        that.remoteStreams = {};

        // Close Peer Connections
        for (index in that.localStreams) {
            if (that.localStreams.hasOwnProperty(index)) {
                stream = that.localStreams[index];
                if(that.p2p){
                    for(var i in stream.pc){
                        stream.pc[i].close();
                    }
                }else{
                    stream.pc.close();
                }
                delete that.localStreams[index];
            }
        }
        if(_default_stream && _default_stream.pc && _default_stream.pc.close){
            _default_stream.pc.close();
        }
        if (_users) {
            _clearRoleList(_rolelist);
            _clearUsers(_users);
        }
        if(_myself){
            _myself.publishstate = TK.PUBLISH_STATE_NONE;
        }
    };
    function _setStatus(newStatus) {
        //logd("setStatus " + newStatus);

        L.Logger.debug('[tk-sdk]setStatus to: ' + newStatus);

        if (_status == newStatus)
            return;

        _status = newStatus;
        if (_status == STATUS_ALLREADY) {
            if(!_rolelist[_myself.role]) { _rolelist[_myself.role] = {} };
            _rolelist[_myself.role][_myself.id] = _myself ;
            _users[_myself.id]=_myself;

            if (_myself.publishstate > TK.PUBLISH_STATE_NONE) {
                _checkMyAudioAndVideoEnable(_myself.publishstate);
                that.publish(_default_stream);
            }
        }
        else if(_status == STATUS_DISCONNECTED){
            _resetRoomState();
        }
        else if(_status == STATUS_IDLE) {
            _resetRoomState();
        }
    };
    function _clearUsers(obj) {
        if(!_isPlayback){ //回放则不清空用户列表
            for(var key in obj){
                delete obj[key];
            }
        }else{
            for(var key in obj){
                obj[key].playbackLeaved = true;
            }
        }
    };
    function _clearRoleList(obj) {
        if(!_isPlayback){//回放则不清空用户列表
            for(var key in obj){
                delete obj[key];
            }
        }
    };
    function _sendRequest(method, url, isAsyns, params, action , requestHeader) {
        var xmlhttp  ;
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest();
        } else {// code for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.open(method, url, isAsyns);
        xmlhttp.setRequestHeader("Content-Type",requestHeader?requestHeader:"application/x-www-form-urlencoded;charset=utf-8");
        xmlhttp.send(params);
        xmlhttp.onreadystatechange = action;
        return xmlhttp ;
    };
    function _dealWithVideoConfig(roomtype,role,vidoetype,fps) {
        roomtype = Number(roomtype);
        role = Number(role);
        vidoetype = Number(vidoetype);
        fps = Number(fps);
        // var video_type = Math.min(2, vidoetype);
        var video_type = vidoetype + 1;
        //role->0：主讲  1：助教    2: 学员   3：直播用户 4:巡检员　10:系统管理员　11:企业管理员　12:管理员 , -1:回放者
        if (roomtype > 0 && role >= 2)// 1vn student: smaller than teacher, max 320
            video_type = Math.max(0, Math.min(2, video_type - 1));
        _room_video_width = VIDEO_DEFINES[video_type][0];
        _room_video_height = VIDEO_DEFINES[video_type][1];

        _room_video_fps = fps < 10 ? 10 : (fps > 30 ? 30 : fps);
        _room_video_maxbps = _getMaxBPS(_room_video_width, _room_video_fps);
        var key_value_json = {
            room_video_width:_room_video_width ,
            room_video_height:_room_video_height ,
            room_video_fps:_room_video_fps ,
        };
        _avmgr = TK.AVMgr ;
        _avmgr.setAVMgrProperty(key_value_json);
        L.Logger.info('[tk-sdk]video config[_room_video_width * _room_video_height  , _room_video_fps , _room_video_maxbps]:' + _room_video_width + '*' + _room_video_height + ', ' + _room_video_fps + ', ' + _room_video_maxbps);
    } ;
    function _getMaxBPS(w, fr) {
        var dw = 128;
        if(w<=80){ //80*60
            if( fr < 20 )
                dw = 64;
            else
                dw = 64+32;
        }
        else if (w <= 176) //176*144
        {
            if( fr < 20 )
                dw = 128;
            else
                dw = 128+64;
        }
        else if (w <= 320) //320*240
        {
            if( fr < 20 )
                dw = 256;
            else
                dw = 256+128 ;
        }
        else if (w <=640)//640*480
        {
            if( fr < 20 )
                dw = 256 + 128 ;
            else
                dw = 512;
        }
        else if (w <=1280)//1280*720
        {
            if( fr  <  15   )
                dw = 1024 ;
            else if( fr >=15 &&  fr <=20 )
                dw = 1024+256 ;
            else
                dw = 1024+512 ;
        }
        else
        {
            if( fr  <  15   )
                dw =  1024+256 ;
            else if( fr >=15 &&  fr <=20 )
                dw =  1024+ 512;
            else
                dw =  1024+1024 ;
        }
        return dw;
    } ;
    function _step2GetConfig(host, port, callback) {

        _setStatus(STATUS_GETTINGCFG);
        if(_room_id == undefined) {
            callback(ERR_HTTP_REQUEST_FAILED, null);
            return;
        }

        L.Logger.debug('[tk-sdk]Going to getConfig');

        var url = PROTOCOL + host + ":" + port + WEBFUNC_GETCONFIG+"?ts="+new Date().getTime();
        var xmlhttp ;

        xmlhttp = _sendRequest("POST",url,true,"serial="+_room_id+"&userrole="+ _myself.role,function() {

            if (xmlhttp.readyState != 4)
                return;

            if (xmlhttp.status == 200) {
                var response_json = L.Utils.toJsonParse(xmlhttp.responseText);
                L.Logger.debug('[tk-sdk]getConfig resp = ',  L.Utils.toJsonStringify(response_json) );
                _configuration = response_json ;
                var sighost = host, sigport = "8889";
                if (_testIP === undefined || _testPort === undefined) {
                    if (response_json.courseserver!==undefined) {
                        var tmp = response_json.courseserver;
                        if (tmp != null && tmp.length > 0)
                            sighost = tmp;
                    }
                    if (response_json.courseserverport!==undefined){
                        sigport =  /http:/g.test(PROTOCOL) ? Number( response_json.courseserverport) + 1 : Number(response_json.courseserverport) ;
                    }
                } else {
                    sighost = _testIP;
                    sigport = _testPort;
                }

                _room_uri = PROTOCOL  + sighost + ":" + sigport;
                if(_is_room_live && response_json.LiveDocServerAddr){
                    _updateWebAddressInfo( response_json.LiveDocServerAddr , _web_port);
                }
                _step2GetFalsificationIp(_web_host , _webInterfaceHtmlPort) ;
                L.Logger.debug("[tk-sdk]_room_uri = " + _room_uri);
                callback(response_json ? 0 : ERR_HTTP_REQUEST_FAILED, xmlhttp.responseText);
            } else {
                L.Logger.error('[tk-sdk]getConfig fail[readyState-status]:' , xmlhttp.readyState , xmlhttp.status ) ;
                callback(ERR_HTTP_REQUEST_FAILED , xmlhttp.responseText);
            }
        });
    } ;
    function _step2GetFileList(host, port, callback) {
        if(_room_id === undefined) {
            callback(ERR_HTTP_REQUEST_FAILED, undefined);
            return;
        }
        if(!_isGetFileList){
            callback( -1 , undefined); //-1代表不执行web请求
            return ;
        }
        L.Logger.debug('[tk-sdk]Going to getFileList');
        var url = PROTOCOL + host + ":" + port + WEBFUNC_GETFILELIST+"?ts="+new Date().getTime();
        var xmlhttp ;
        xmlhttp = _sendRequest("POST",url,true,"serial="+_room_id,function() {

            if (xmlhttp.readyState != 4)
                return;

            if (xmlhttp.status == 200){
                var response_json = L.Utils.toJsonParse(xmlhttp.responseText);
                L.Logger.debug('[tk-sdk]getFileList resp = ',  L.Utils.toJsonStringify(response_json) );

                var nRet = response_json.result;
                var roomfile;
                if (nRet == 0 && response_json.roomfile!==undefined) {
                    roomfile = response_json.roomfile;
                }else{
                    L.Logger.info('[tk-sdk]getFileList resp.roomfile is not exist , nRet:'+nRet);
                }
                callback(nRet, roomfile);

            } else {
                L.Logger.error('[tk-sdk]getFileList fail[readyState-status]:' , xmlhttp.readyState , xmlhttp.status ) ;
                callback(ERR_HTTP_REQUEST_FAILED,undefined);
            }
        });

    } ;
    function _step2GetFalsificationIp(host , port ) {
        if(_isGetFalsificationIp){
            var url = PROTOCOL +host+":"+port +"/index.html?ts=" + new Date().getTime();
            if( _is_room_live || /(192.168.|127.0.0.1|127.17.|localhost)/g.test(host) ){ //直播或者本地地址不获取ip映射地址
                _isIpFalsification = false ;
            }else{
                _isIpFalsification = true ;
            }
            if(_isIpFalsification){
                $.ajax({
                    url: url,
                    type: "get",
                    async: false,
                }).done(function(response_json) {
                    L.Logger.info('[tk-sdk]getFalsificationIp resp :',  (window.__TkSdkBuild__?L.Utils.encrypt(response_json):response_json)  );
                    if(response_json && typeof response_json === 'string'){
                        _ipFalsification = _trim(response_json) ;
                    }else{
                        L.Logger.warning('[tk-sdk]getFalsificationIp resp not is string');
                    }
                }).fail(function(err) {
                    L.Logger.error('[tk-sdk]getFalsificationIp fail:' ,err ) ;
                });

                /*       var xmlhttp ;
                 xmlhttp =     _sendRequest("GET",url,false,"",function() {
                 if (xmlhttp.readyState != 4)
                 return;

                 if (xmlhttp.status == 200) {
                 var response_json = xmlhttp.responseText;
                 L.Logger.info('[tk-sdk]getFalsificationIp resp = ',  L.Utils.toJsonStringify(response_json));
                 if(response_json && typeof response_json === 'string'){
                 _ipFalsification = response_json.toString() ;
                 }

                 } else {
                 L.Logger.error('[tk-sdk]getFalsificationIp fail[readyState-status]:' , xmlhttp.readyState , xmlhttp.status ) ;
                 }
                 });*/
            }
        }
    };
    function _step3Connect(host,port) {
        L.Logger.debug("[tk-sdk]step3Connect");
        if (_status >= STATUS_CONNECTING)
            return;
        _setStatus(STATUS_CONNECTING);
        L.Logger.info("[tk-sdk]socket connect address:"+ (window.__TkSdkBuild__?L.Utils.encrypt( _room_uri ):_room_uri ) );
        _isConnected = false ;
        connectSocket(_room_uri, _handlerCallbackJson._handler_connectSocketSuccess, function (error) {
            L.Logger.error('[tk-sdk]Not Connected! Error: ' + error);
            var connectEvt = TK.RoomEvent({type: 'room-error', message:{source:L.Constant.roomError.ROOMCONNECTERROR  , error:error}});
            that.dispatchEvent(connectEvt);
        });
    };
    function _step4Join(callback,error) {

        if(_status >= STATUS_JOINING)
            return;

        if (_myself.id == undefined || _room_id == undefined) {
            L.Logger.error('[tk-sdk]Invalid status', _myself, _room_id);
            return;
        }

        _setStatus(STATUS_JOINING);
        if(_myself){
            if(_serverName){
                _myself.servername = _serverName ;
            }
            _myself.udpstate = L.Constant.udpState.ok ;
        }
        var properties =  {};
        for (var key in _myself) {
            if (key != 'id' && key != 'watchStatus')
                properties[key]=_myself[key];
        }
        var params = {
            userId:_myself.id,
            roomId:_room_id,
            maxVideo:_room_max_videocount,
            videofps:_room_video_fps,
            videowidth:_room_video_width,
            videoheight:_room_video_height,
            properties:properties ,
            roomtype:_room_properties.roomtype ,
        };

        if(_isPlayback){ //是回放，则添加地址
            if(!_recordfilepath){L.Logger.error('[tk-sdk]The playback file address does not exist!');return ; } ;
            params.recordfilepath = _recordfilepath ;
        }
        L.Logger.info('joinRoom params info:'+  (window.__TkSdkBuild__?L.Utils.encrypt( L.Utils.toJsonStringify(params)): L.Utils.toJsonStringify(params) ) );
        sendMessageSocket('joinRoom', params, callback, error);
    } ;
    function _webInterfaceGetserver(host , port , callback ) {
        L.Logger.debug('[tk-sdk]Going to webInterfaceGetserver');
        var url = PROTOCOL + host + ":" + port + WEBFUNC_GETSERVERAREA+"?ts="+new Date().getTime();
        $.ajax({
            url: url,
            type: "post",
            async: true,
        }).done(function(response_json) {
            L.Logger.info('[tk-sdk]webInterfaceGetserver resp = ', (window.__TkSdkBuild__?L.Utils.encrypt( L.Utils.toJsonStringify(response_json)): L.Utils.toJsonStringify(response_json))  );
            response_json =  L.Utils.toJsonParse(response_json);
            var nRet = response_json.result;
            _serverList = {};
            if (nRet == 0 && response_json.serverarealist!==undefined) {
                for(var key in response_json.serverarealist){
                    var serverarea = response_json.serverarealist[key];
                    _serverList[serverarea.serverareaname] = serverarea ;
                }
            }else{
                L.Logger.info('[tk-sdk]webInterfaceGetserver resp.serverarealist is not exist , nRet:'+nRet);
            }
            callback(nRet, L.Utils.toJsonStringify(response_json) );
        }).fail(function(err) {
            L.Logger.error('[tk-sdk]webInterfaceGetserver fail[readyState-status]:' , err ) ;
            callback(ERR_HTTP_REQUEST_FAILED,undefined);
        });
    };
/*    function _webInterfaceGetserverName(host , port , callback ) {
        L.Logger.debug('[tk-sdk]Going to webInterfaceGetserverName');
        var url = PROTOCOL + host + ":" + port +"/where.html?ts=" + new Date().getTime();
        $.ajax({
            url: url,
            type: "get",
            async: true,
        }).done(function(response_json) {
            L.Logger.info('[tk-sdk]webInterfaceGetserverName resp :', (window.__TkSdkBuild__?L.Utils.encrypt( L.Utils.toJsonStringify(response_json)): L.Utils.toJsonStringify(response_json))  );
            response_json =  L.Utils.toJsonParse(response_json) ;
            var nRet = undefined ;
            if( response_json.name){
                _serverName = response_json.name ;
                //L.Utils.localStorage.setItem('tkLocalstorageServerName' , _serverName );
                nRet = 0 ;
                if(_isConnected && _myself && _myself.id != undefined && _users[ _myself.id] ){
                    if(  _myself.servername === undefined && _serverName !== _myself.servername ){
                        that.changeUserProperty( _myself.id, "__all", {servername:_serverName} );
                    }
                }
            }
            callback(nRet , L.Utils.toJsonStringify(response_json) );
        }).fail(function(err) {
            L.Logger.error('[tk-sdk]webInterfaceGetserverName fail:' ,err ) ;
            callback(ERR_HTTP_REQUEST_FAILED,undefined);
        });
    };*/
    function _webInterfaceUploadFile(formData , callback , progressListenCallback) {
        var url = PROTOCOL + _web_host + ":" + _web_port + WEBFUNC_UPLOADDOCUMENT+"?ts="+new Date().getTime();
        if(!formData){
            L.Logger.error('[tk-sdk]uploadFile formData is required!');
            return ;
        }
        var xmlhttp =  $.ajax({
            url:url ,
            dataType: "json",
            type: 'POST',
            data: formData,
            async:true ,
            // 告诉jQuery不要去处理发送的数据
            processData: false,
            // 告诉jQuery不要去设置Content-Type请求头
            contentType: false,
            //这里我们先拿到jQuery产生的 XMLHttpRequest对象，为其增加 progress 事件绑定，然后再返回交给ajax使用
            xhr: function () {
                var xhr = $.ajaxSettings.xhr(); //获取ajax的XMLHttpRequestUpload
                if (xhr.upload) {
                    if(progressListenCallback && typeof progressListenCallback === 'function'){
                        //注册进度监听事件
                        L.Utils.removeEvent(xhr.upload, "progress",_handlerUploadFileProgress.bind(that , progressListenCallback ) , false);
                        L.Utils.addEvent(xhr.upload, "progress",_handlerUploadFileProgress.bind(that , progressListenCallback ) , false);
                    }
                    return xhr;
                }
            }
        }).done(function (response) {
            L.Logger.debug('[tk-sdk]uploadFile resp = ',  L.Utils.toJsonStringify(response) );
            if(callback && typeof callback === "function"){
                var code = response.result ;
                callback(code , response);
            }
        }).fail(function (jqXHR, textStatus, errorThrown){
            L.Logger.error("[tk-sdk]uploadFile fail[ jqXHR , textStatus , errorThrown ]:", jqXHR , textStatus , errorThrown );
            if(callback && typeof callback === "function"){
                callback(ERR_HTTP_REQUEST_FAILED,undefined);
            }
        });

        /*    var xmlhttp ;
         xmlhttp =  _sendRequest("POST",url,true,formData,function() {
         /!*readyState:
         0 － （未初始化）还没有调用send()方法
         1 － （载入）已调用send()方法，正在发送请求
         2 － （载入完成）send()方法执行完成，已经接收到全部响应内容
         3 － （交互）正在解析响应内容
         4 － （完成）响应内容解析完成，可以在客户端调用了
         status:
         1**：请求收到，继续处理
         2**：操作成功收到，分析、接受
         3**：完成此请求必须进一步处理
         4**：请求包含一个错误语法或不能完成
         5**：服务器执行一个完全有效请求失败
         *!/
         if (xmlhttp.readyState != 4)
         return;

         if (xmlhttp.status == 200)
         {
         var response_json = L.Utils.toJsonParse(xmlhttp.responseText);
         L.Logger.debug('[tk-sdk]uploadFile resp = ',  L.Utils.toJsonStringify(response_json));
         var nRet = response_json.result;
         callback(nRet, response_json);
         }
         else
         {
         L.Logger.error('[tk-sdk]uploadFile fail[readyState-status]:' , xmlhttp.readyState , xmlhttp.status ) ;
         callback(ERR_HTTP_REQUEST_FAILED,undefined);
         }
         });
         */
        return   xmlhttp  ;
    };
    function _webInterfaceDeleteFile(fileid , callback) {
        var url = PROTOCOL + _web_host + ":" + _web_port + WEBFUNC_DELROOMFILE+"?ts="+new Date().getTime();
        if(fileid === undefined || fileid === null){
            L.Logger.error('[tk-sdk]deleteFile fileid is required!');
            return ;
        }
        var deleteFileParams = {
            "serial":_room_properties['serial'],   //会议id
            "fileid":fileid     //文件id
        };
        $.ajax({
            url:url ,
            dataType:"json",
            type : 'POST',
            anync:false ,
            data : deleteFileParams,
        }).done(function (response) {
            L.Logger.debug('[tk-sdk]deleteFile resp = ',  L.Utils.toJsonStringify(response));
            if(callback && typeof callback === "function"){
                var code = response.result ;
                callback(code , response);
            }
        }).fail(function (jqXHR, textStatus, errorThrown){
            L.Logger.error("[tk-sdk]deleteFile fail[ jqXHR , textStatus , errorThrown ]:", jqXHR , textStatus , errorThrown );
            callback(ERR_HTTP_REQUEST_FAILED,undefined);
        });

        /*    var xmlhttp ;
          xmlhttp =  _sendRequest("POST",url,true,deleteFileParams,function() {
         if (xmlhttp.readyState != 4)
         return;

         if (xmlhttp.status == 200)
         {
         var response_json = L.Utils.toJsonParse(xmlhttp.responseText);
         L.Logger.deubg('[tk-sdk]deleteFile resp = ', L.Utils.toJsonStringify(response_json) );
         var nRet = response_json.result;
         if(callback && typeof callback === "function"){
         callback(nRet, response_json);
         }
         }
         else
         {
         L.Logger.error('[tk-sdk]deleteFile fail[readyState-status]:' , xmlhttp.readyState , xmlhttp.status ) ;
         if(callback && typeof callback === "function") {
         callback(ERR_HTTP_REQUEST_FAILED, undefined);
         }
         }
         });*/
    };
    function _deviceChangeCallback(event) {
        clearTimeout(that._deviceChangeCallbackTimer);
        that._deviceChangeCallbackTimer = setTimeout( function () {
            if(_isConnected && _myself && _myself.id != undefined && _users[ _myself.id] && !_isPlayback ){
                TK.AVMgr.enumerateDevices(function (devicesInfo) {
                    var hasDevice = devicesInfo.hasdevice;
                    var property = {} ;
                    var isChangeUserProperty = false ;
                    if( _myself.hasvideo  !==  hasDevice.videoinput ){
                        property.hasvideo = hasDevice.videoinput ;
                        isChangeUserProperty = true ;
                    }
                    if( _myself.hasaudio  !==  hasDevice.audioinput ){
                        property.hasaudio = hasDevice.audioinput ;
                        isChangeUserProperty = true ;
                    }
                    if(isChangeUserProperty){
                        L.Logger.info('[tk-sdk]change device:my old device info  [hasvideo , hasaudio] is ['+_myself.hasvideo+ ' ,' +_myself.hasaudio+'] , change device property is '+ L.Utils.toJsonStringify(property)  ) ;
                        var isOk = that.changeUserProperty( _myself.id, "__all", property );
                        if(isOk === ERR_OK){
                            if(property.hasvideo != undefined && _myself.hasvideo !== property.hasvideo ){
                                _myself.hasvideo = property.hasvideo ;
                            }
                            if(property.hasaudio != undefined && _myself.hasaudio !== property.hasaudio){
                                _myself.hasaudio = property.hasaudio ;
                            }
                        }
                        if(_default_stream){
                            if( _default_stream.hasVideo() !==  _myself.hasvideo){
                                _default_stream.changeVideo(_myself.hasvideo ) ;
                            }
                            if( _default_stream.hasAudio() !==  _myself.hasaudio){
                                _default_stream.changeAudio(_myself.hasaudio ) ;
                            }
                        }
                        var _getUserMediaCallback = function (stream) {
                            if (!_default_stream.stream) {
                                _default_stream.stream = stream;
                            } else {
                                for(var key in stream){
                                    if(/^customdata_/g.test(key)){
                                        _default_stream.stream[key] = stream[key];
                                    }
                                }
                                var localTracks = _default_stream.stream.getTracks();
                                for (var i = 0; i < localTracks.length; i++) {
                                    var track = localTracks[i];
                                    _default_stream.stream.removeTrack(track);
                                }
                                var newTracks = stream.getTracks();
                                for (var i = 0; i < newTracks.length; i++) {
                                    var track = newTracks[i];
                                    _default_stream.stream.addTrack(track);
                                }
                            }
                            if(_default_stream.player){
                                _default_stream.player.changeMediaStreamUrl(_default_stream.stream);
                            }
                            var publishstate = _myself.publishstate ;
                            if(publishstate > TK.PUBLISH_STATE_NONE){
                                that.unpublish(_default_stream , function (result , error) {
                                    _enableLocalAudio(true);
                                    _enableLocalVideo(true);
                                    if(result!=undefined){
                                        _checkMyAudioAndVideoEnable(_myself.publishstate);
                                        if(publishstate > TK.PUBLISH_STATE_NONE){
                                            that.publish(_default_stream);
                                        }
                                    }
                                });
                            }
                        };
                        TK.AVMgr.getUserMedia(_getUserMediaCallback , undefined , undefined , {isDemotionLocalStream:true , isNeedCheckChangeLocalStream:true , isStopLocalStream:false});
                    }
                },{isSetlocalStorage:true}) ;
            }
            var audioMediaElement = document.getElementsByTagName('audio');
            var videoMediaElement = document.getElementsByTagName('video');
            var mediaElementArray = [];
            if(audioMediaElement && audioMediaElement.length>0){
                for(var i=0 ; i<audioMediaElement.length ; i++){
                    mediaElementArray.push(audioMediaElement[i]);
                }
            }
            if(videoMediaElement && videoMediaElement.length>0){
                for(var i=0 ; i<videoMediaElement.length ; i++){
                    mediaElementArray.push(videoMediaElement[i]);
                }
            }
            if(mediaElementArray.length>0){
                TK.AVMgr.setElementSinkIdToAudioouputDevice(mediaElementArray);
            }
            var devicechangeEvent = {type:'device_change'};
            that.dispatchEvent(devicechangeEvent);
        } , 250 );
    };
    function _ipAndStationaryStrWitch_send( sdpInfo){ /*send ice ip转换工具*/
        if(!_isIpFalsification || !_ipFalsification){
            return sdpInfo ;
        }
        var hostname = "254.254.254.254" ;
        if(sdpInfo.type === 'offer' || sdpInfo.type === 'candidate' ){
            var ipStr =  L.Utils.toJsonStringify(sdpInfo) ;
            var ipFormat = /(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))/g ;
            if( ipFormat.test(ipStr) ){
                sdpInfo =  L.Utils.toJsonParse(  ipStr.replace(ipFormat,hostname) ) ;
            }
        }
        return sdpInfo ;
    } ;
    function _ipAndStationaryStrWitchSDP_recv(sdpInfo){ /*recv ice ip转换工具*/
        if(!_isIpFalsification || !_ipFalsification){
            return sdpInfo ;
        }
        if(sdpInfo.type === 'answer'){
            var ipStr =  L.Utils.toJsonStringify(sdpInfo) ;
            var hostname = _ipFalsification ;
            var ipFormat = /(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))/g ;
            if( ipFormat.test(ipStr) ){
                sdpInfo =   L.Utils.toJsonParse(  ipStr.replace(ipFormat,hostname)  );
            }
        }
        return sdpInfo ;
    } ;
    function _rtcStatsrObserver( stream , stats ) {
        var isFrist = false  , isRemote = false , bit = 0;
        isRemote = ( stream.getID() !== _default_stream.getID() )  ;
        var rtt = 0  , frameRatio = { frameWidth:0 , frameHeight:0 }  , frameRate = 0  , packetsLost = 0  , kbps = 0;
        var googRtt = 0  , googFrameWidthSent  = 0 , googFrameHeightSent = 0 , timestamp  = 0 , googFrameRateSent = 0 , bytesSent = 0 , packetsSent = 0 , packetsLostSend = 0  ,
            bytesReceived = 0 , googCurrentDelayMs = 0  ,  googFrameWidthReceived = 0 , googFrameHeightReceived = 0 , googFrameRateReceived = 0  , packetsReceived = 0 , packetsLostReceived = 0 , googNacksReceived = 0 , googNacksSent =0  ;
        var _handlerStatsForeach = function (report) {
            if(report.type === 'ssrc' && report.mediaType === 'video'){
                if(/send/g.test( report.id ) ){
                    bytesSent = report.bytesSent ;
                    packetsSent = report.packetsSent ;
                    googRtt= Number(report.googRtt) ;
                    googNacksReceived =  Number(report.googNacksReceived) ;
                    packetsLostSend =  Number(report.packetsLost) ;
                    googFrameWidthSent =  Number(report.googFrameWidthSent) ;
                    googFrameHeightSent =  Number(report.googFrameHeightSent) ;
                    googFrameRateSent =  Number(report.googFrameRateSent) ;
                    timestamp = report.timestamp ;
                    isRemote = false ;
                }else if( /recv/g.test( report.id )  ){
                    bytesReceived =  Number( report.bytesReceived) ;
                    packetsReceived =  Number( report.packetsReceived) ;
                    googNacksSent =  Number( report.googNacksSent) ;
                    googCurrentDelayMs =  Number(report.googCurrentDelayMs) ;
                    packetsLostReceived =  Number(report.packetsLost );
                    googFrameWidthReceived =  Number(report.googFrameWidthReceived );
                    googFrameHeightReceived =  Number(report.googFrameHeightReceived );
                    googFrameRateReceived = Number( report.googFrameRateReceived) ;
                    timestamp = report.timestamp ;
                    isRemote = true ;
                }
            }
        };
        if(stats && typeof stats === 'object' && stats.forEach ){
            stats.forEach(function (report , index) {
                _handlerStatsForeach(report);
            });
        }else{
            for(var key in stats){
                var report = stats[key] ;
                _handlerStatsForeach(report);
            }
        }
        if(!stream.report){stream.report =  {};isFrist = true ;}
        stream.report.timestamp = stream.report.timestamp || timestamp ;
        if(isRemote){
            stream.report.bytesReceived = stream.report.bytesReceived || bytesReceived ;
            stream.report.packetsReceived = stream.report.packetsReceived || packetsReceived ;
            stream.report.googNacksSent = stream.report.googNacksSent || googNacksSent ;
        }else{
            stream.report.bytesSent = stream.report.bytesSent || bytesSent ;
            stream.report.packetsSent = stream.report.packetsSent || packetsSent ;
            stream.report.googNacksReceived = stream.report.googNacksReceived || googNacksReceived ;
        }
        if(isFrist){return undefined;};
        if(isRemote){
            bit = (bytesReceived - stream.report.bytesReceived) * 8  ;
            frameRatio.frameWidth =   !isNaN(googFrameWidthSent) ? googFrameWidthReceived  : 0;
            frameRatio.frameHeight =  !isNaN(googFrameHeightSent) ?  googFrameHeightReceived : 0;
            frameRate = googFrameRateReceived ;
            rtt = googCurrentDelayMs ;
            packetsLost = ((googNacksSent - stream.report.googNacksSent)/(packetsReceived - stream.report.packetsReceived)) * 100  ;
        }else{
            bit = (bytesSent - stream.report.bytesSent) * 8  ;
            frameRatio.frameWidth =   !isNaN(googFrameWidthSent) ? googFrameWidthSent  : 0;
            frameRatio.frameHeight =  !isNaN(googFrameHeightSent) ?  googFrameHeightSent : 0;
            frameRate = googFrameRateSent ;
            rtt = googRtt ;
            packetsLost = ( (googNacksReceived - stream.report.googNacksReceived)/(packetsSent - stream.report.packetsSent) ) * 100;
        }
        kbps = bit / ( (timestamp - stream.report.timestamp) / 1000) / 1024 ;

        if(isRemote){
            stream.report.bytesReceived =  bytesReceived ;
            stream.report.packetsReceived =  packetsReceived ;
            stream.report.googNacksSent =  googNacksSent ;
        }else{
            stream.report.bytesSent =  bytesSent ;
            stream.report.packetsSent =  packetsSent ;
            stream.report.googNacksReceived = googNacksReceived ;
        }
        stream.report.timestamp = timestamp   ;
        var networkStatus = {
            kbps: !isNaN(kbps) ? Math.round( kbps ) : 0  , //带宽
            frameRatio:frameRatio , //分辨率
            frameRate: !isNaN(frameRate) ? Math.round( frameRate ) : 0 , //帧率
            packetsLost: !isNaN( packetsLost ) ?(Math.round( packetsLost ) <= 100 ? Math.round( packetsLost ) :100) : 0 , //丢包率(%)
            rtt: !isNaN(rtt) ?  rtt : 0 , //延时
        };
        return networkStatus ;
    } ;
    function _handlerUploadFileProgress(progressListenCallback , evt ) {
        /**侦查附件上传情况    ,这个方法大概0.05-0.1秒执行一次*/
        var loaded = evt.loaded;  //已经上传大小情况
        var tot = evt.total;  //附件总大小
        var per = Math.floor(100 * loaded / tot); //已经上传的百分比
        if(progressListenCallback && typeof progressListenCallback === "function"){
            progressListenCallback(evt , per);
        }
    } ;
    //去左空格;
    function _ltrim(s){
        return s.replace(/(^\s*)/g, "");
    }
    //去右空格;
    function _rtrim(s){
        return s.replace(/(\s*$)/g, "");
    }
    //去左右空格;
    function _trim(s){
        return s.replace(/(^\s*)|(\s*$)/g, "");
    }

    if(TK && TK.coreEventController){
        TK.coreEventController.addEventListener( 'getUserMedia_success' , function (recvEventData) {
            that.dispatchEvent(recvEventData);
        } );
        TK.coreEventController.addEventListener( 'getUserMedia_failure' , function (recvEventData) {
            that.dispatchEvent(recvEventData);
        } );
        TK.coreEventController.addEventListener( 'getUserMedia_failure_reGetOnlyAudioStream' , function (recvEventData) {
            that.dispatchEvent(recvEventData);
        } );
    }

    // C++ callback
    var nativeMsgCallback = function(msg) {
        var funcName = msg.data.name;

        if (funcName === "onValidWindowList")
        {
            var windows = msg.data.validWindows;
            var seqId = msg.data.seq;
            if (seqId === undefined) return;
            if (typeof waitNativeToCallbackList[seqId] !== "function") return;
            waitNativeToCallbackList[seqId](windows);
            delete waitNativeToCallbackList[seqId];
            return;
        }

        if (funcName === "onLog")
        {
            var level = msg.data.level; //0: Debug, 1: Info, 2: Warning, 3: Error
            var log = msg.data.log;
            if (level === 0) {
                L.Logger.debug(log);
            }
            if (level === 1) {
                L.Logger.info(log);
            }
            if (level === 2) {
                L.Logger.warning(log);
            }
            if (level === 3) {
                L.Logger.error(log);
            }
            return;
        }

        if (funcName === "onMonitorCount")
        {
            var count = msg.data.count;
            var seqId = msg.data.seq;
            if (seqId === undefined) return;
            if (typeof waitNativeToCallbackList[seqId] !== "function") return;
            waitNativeToCallbackList[seqId](count);
            delete waitNativeToCallbackList[seqId];
            return;
        }

        if (funcName === "onTakSnapshot")
        {
            var action = msg.data.action;
            var requestId = msg.data.requestId;
            var total = msg.data.total;
            var now  = msg.data.now;
            var code = msg.data.code;
            var strResult = msg.data.result;
            if (typeof waitNativeToCallbackList[requestId] !== "function") return;
            var result = L.Utils.toJsonParse(strResult);
            waitNativeToCallbackList[requestId](action, requestId, total, now, code, result);
            if (action === "result")
                delete waitNativeToCallbackList[requestId];
            return;
        }

        if (funcName === "onLocalRecord")
        {
            var arg = msg.data.arg;
            var seqId = msg.data.seq;
            if (typeof waitNativeToCallbackList[seqId] !== "function") return;
            waitNativeToCallbackList[seqId](arg);
            delete waitNativeToCallbackList[seqId];
            return;
        }

        if (funcName === "onGetOpenOrSaveFileName")
        {
            var arg = msg.data.arg;
            var seqId = msg.data.seq;
            if (typeof waitNativeToCallbackList[seqId] !== "function") return;
            waitNativeToCallbackList[seqId](arg);
            delete waitNativeToCallbackList[seqId];
            return;   
        }

        if (funcName === "onGetMediaPlayPos")
        {
            var arg = msg.data.arg;
            var seqId = msg.data.seq;
            if (typeof waitNativeToCallbackList[seqId] !== "function") return;
            waitNativeToCallbackList[seqId](arg);
            delete waitNativeToCallbackList[seqId];
            return;
        }

    };

    /*回放清除所有sdk相关数据*/
    function _playbackClearAll() {
        if(!_isPlayback){L.Logger.error('[tk-sdk]No playback environment, no execution playbackClearAll!');return ;} ;
        if (_users != undefined) {
            _clearRoleList(_rolelist);
            _clearUsers(_users);
        }
        if(_myself != null){
            _myself.publishstate = TK.PUBLISH_STATE_NONE;
        }
    };

    /*处理checkroom的结果*/
    function _handlerCheckroom(response , callback  , userid){
        var userinfo = {};
        var nRet = response.result;
        var room;
        var pullInfo  ;
        if (nRet == 0) {
            if(_isPlayback){
                response.nickname = 'playback' ;
                response.roomrole = -1 ;
                response.thirdid =  guid()+":playback" ;
            }
            room = response.room;
            pullInfo = response.pullinfo ;
            if (room.serial===undefined)
                nRet = ERR_INTERNAL_EXCEPTION;
            else {
                room.roomtype =  Number( room.roomtype ) ;
                room.maxvideo =  parseInt( room.maxvideo ) ;
                response.roomrole =  Number( response.roomrole ) ;
                var  pullConfigureJson = {};
                var pushConfigureJson = {} ;
                if(pullInfo && pullInfo.data && pullInfo.data.pullConfigureList){
                    var pullConfigureList = pullInfo.data.pullConfigureList ;
                    for(var i in pullConfigureList){
                        var pullConfigure = pullConfigureList[i] ;
                        pullConfigureJson[ pullConfigure.pullProtocol ] =  pullConfigure.pullUrlList ;
                    }
                }
                if(pullInfo && pullInfo.data && pullInfo.data.pushConfigureInfo){
                    var pushConfigureInfo = pullInfo.data.pushConfigureInfo ;
                    for(var i in pushConfigureInfo){
                        var pushConfigure = pushConfigureInfo[i] ;
                        pushConfigureJson[ pushConfigure.pushProtocol ] =  pushConfigure.pushUrl ;
                    }
                }
                room.pullConfigure = pullConfigureJson ;
                room.pushConfigure = pushConfigureJson ;

                _room_properties = room;

                _room_name = room.roomname;
                _room_type = room.roomtype ;
                _is_room_live = _room_type === 10 ;
                _room_max_videocount = room.maxvideo;

                userinfo.properties = {};
                userinfo.properties.role =response.roomrole  ;
                userinfo.properties.nickname = response.nickname;

                var id = response.thirdid;

                if(id !== undefined && id != "0" && id != ''){
                    userinfo.id = id;
                }else if(userid){
                    userinfo.id = userid ;
                }else{
                    userinfo.id = guid();
                }
                _myself = TK.RoomUser(userinfo);
                if(_isPlayback){
                    _room_id = room.serial+"_"+_myself.id;
                    if( _room_id && _room_id.indexOf(':playback') === -1 ){
                        _room_id +=":playback" ;
                    }
                }else{
                    _room_id = room.serial;
                }
                if(!_isPlayback){
                    _dealWithVideoConfig(_room_type, _myself.role, room.videotype, room.videoframerate);
                    if (TK.isTkNative) {
                        tknative.postMessage({command: "initNative", localId: _myself.id.toString(), width: Number(_room_video_width), height: Number(_room_video_height), fps: Number(_room_video_fps), roomInfo: L.Utils.toJsonStringify(response) , webAddr: _web_host.toString(), webPort: _web_port.toString()});
                    }
                    if(response.roomrole === 3){
                        _isGetFalsificationIp = false ;
                    }
                }
                L.Logger.info('[tk-sdk]'+(_isPlayback?'initPlaybackInfo to checkroom finshed-->':'')+'_room_max_videocount:'+_room_max_videocount  , 'my id:'+_myself.id , 'room id:'+_room_id  , 'room properties chairmancontrol is:'+ (_room_properties.chairmancontrol ? (window.__TkSdkBuild__ ? L.Utils.encrypt(_room_properties.chairmancontrol):_room_properties.chairmancontrol)  : undefined ) );
            }
        }else{
            L.Logger.warning('[tk-sdk]checkroom failure code is '+ nRet);
        }
        L.Logger.info('[tk-sdk]checkroom finshed!');
        callback(nRet, userinfo, response);
    };

    /*socket事件处理start*/
    _handlerCallbackJson._handler_participantLeft = function (userid , leaveTs ) {
        L.Logger.debug('[tk-sdk]participantLeft userid:' + userid);
        var user = _users[userid];
        Log.error('_users',_users)
        Log.error('userid',userid)
        if (user === undefined){
            L.Logger.error( '[tk-sdk]participantLeft user is not exist , userid is '+userid+'!'  );
            return;
        }
        L.Logger.info('[tk-sdk]user leave room  , user info: '+L.Utils.toJsonStringify(user) );
        if( _isPlayback && leaveTs !== undefined){
            user.leaveTs = leaveTs ;
        }
        if(!_rolelist[user.role]) { _rolelist[user.role] = {} };
        if(!_isPlayback){
            delete _rolelist[user.role][userid] ;
            delete _users[userid];
        }else{
            if(_users[userid]){
                _users[userid].playbackLeaved = true ;
            }
        }
        if( _isPlayback && typeof userid === 'object' ){
            var userinfo = userid ;
            user.leaveTs = userinfo.ts ;
        }
        var roomEvt = TK.RoomEvent({type: 'room-participant_leave', user: user});
        that.dispatchEvent(roomEvt);
    };
    _handlerCallbackJson._handler_participantJoined =function (userinfo) {
        L.Logger.debug('[tk-sdk]participantJoined userinfo:'+ L.Utils.toJsonStringify(userinfo) );
        var user = TK.RoomUser(userinfo);
        L.Logger.info('[tk-sdk]user join room  , user info: '+L.Utils.toJsonStringify(user) );
        /*if (user === undefined) {
         return;
         }*/
        if(!_rolelist[user.role]) { _rolelist[user.role] = {} };
        _rolelist[user.role][user.id] = user ;
        _users[user.id]=user;
        if(_isPlayback && _users[user.id]){
            delete _users[user.id].playbackLeaved ;
        }
        if( _isPlayback && typeof userinfo === 'object'  ){
            user.joinTs = userinfo.ts ;
        }
        var roomEvt = TK.RoomEvent({type: 'room-participant_join', user: user});
        that.dispatchEvent(roomEvt);
    };
    _handlerCallbackJson._handler_sendMessage = function (messages) {
        L.Logger.debug('[tk-sdk]room-text-message info:' + (messages && typeof messages === 'object' ? L.Utils.toJsonStringify(messages) : messages )) ;
        if (!( messages && messages.hasOwnProperty('message') ) ){  L.Logger.error('messages or messages.message is not exist!'); return;};
        var from = messages.fromID;
        var user = _myself;

        if(_room_properties.roomtype === 10){  //2017-11-13 xgd 是否是直播，是直播user为undefined
            user = undefined;
        } else {
            if (from !== undefined)
                user = _users[messages.fromID];
            if(!user){L.Logger.error('[tk-sdk]user is not exist , user id:'+messages.fromID+', message from room-text-message!');return ;};
        }
        if( _isPlayback){
            var isString = false ;
            if(messages && messages.message && typeof  messages.message  === 'string' ){
                messages.message = L.Utils.toJsonParse(messages.message);
                isString = true ;
            }
            messages.message.ts = messages.ts ; //ms
            if(isString && typeof messages.message === 'object'){
                messages.message = L.Utils.toJsonStringify( messages.message );
            }
        }
        var roomEvt = TK.RoomEvent({type: 'room-text-message', user:user, message:messages.message});
        that.dispatchEvent(roomEvt);
    } ;
    _handlerCallbackJson._handler_pubMsg = function (messages) {
        L.Logger.debug( '[tk-sdk]pubMsg info:' ,  L.Utils.toJsonStringify(messages) );
        var roomEvt = TK.RoomEvent({type: 'room-pubmsg', message:messages});
        that.dispatchEvent(roomEvt);
    };
    _handlerCallbackJson._handler_delMsg = function (messages) {
        L.Logger.debug( '[tk-sdk]delMsg info:' ,  L.Utils.toJsonStringify(messages) );
        var roomEvt = TK.RoomEvent({type: 'room-delmsg', message:messages});
        that.dispatchEvent(roomEvt);
    };
    _handlerCallbackJson._handler_setProperty = function  (messages) {
        L.Logger.debug('[tk-sdk]setProperty info:' , L.Utils.toJsonStringify(messages) );

        var param = messages;
        var id = param.id;

        if(param.hasOwnProperty("properties"))
        {
            var properties =  param.properties;
            var user = _users[id];
            if (_myself.id==id) {
                user = _myself;
                if ( properties.hasOwnProperty("publishstate") ){
                    that.onChangeMyPublishState(properties.publishstate);
                }else if( properties.hasOwnProperty("disablevideo") ){
                    that.onChangeMyDisableVideoState(properties.disablevideo);
                } else if( properties.hasOwnProperty("disableaudio") ){
                    that.onChangeMyDisableAudioState(properties.disableaudio);
                } else if( properties.hasOwnProperty("hasaudio") ){
                    _default_stream.audio = properties.hasaudio ;
                }else if( properties.hasOwnProperty("hasvideo") ){
                    _default_stream.video = properties.hasvideo ;
                }
            }

            if (user === undefined){
                L.Logger.error( '[tk-sdk]setProperty user is not exist , userid is '+id+'!'  );
                return;
            }
            var userServername = user.servername ;
            for (var key in properties) {
                if (key != 'id' && key != 'watchStatus'){
                    user[key]=properties[key];
                }
            }
            var roomEvt = TK.RoomEvent({type: 'room-userproperty-changed', user:user, message:properties} , { fromID:param.fromID} );
            that.dispatchEvent(roomEvt);
            if( _myself.id==id && properties.hasOwnProperty("servername") ){
                if(_myself.id !== param.fromID ){ //不是自己触发的改变服务器，则切换服务器
                    if( properties.servername  && properties.servername !==  userServername){
                        that.switchServerByName(  properties.servername );
                    }
                }else{
                    if( properties.servername  && properties.servername !==  userServername){
                        _serverName =  properties.servername ;
                        L.Utils.localStorage.setItem('tkLocalstorageServerName' , _serverName );
                        _updateSelectServer(_serverList , _serverName );
                    }
                }
            }
        }
    };
    _handlerCallbackJson._handler_playback_clearAll = function () {
        if(!_isPlayback){L.Logger.warning('[tk-sdk]No playback environment!');return ;} ;
        var roomEvt = TK.RoomEvent({type: 'room-playback-clear_all'});
        that.dispatchEvent(roomEvt);
        _playbackClearAll();
    };
    _handlerCallbackJson._handler_duration = function (message) {
        if(!_isPlayback){L.Logger.warning('[tk-sdk]No playback environment!');return ;} ;
        var roomEvt = TK.RoomEvent({type: 'room-playback-duration' , message:message });
        that.dispatchEvent(roomEvt);
    };
    _handlerCallbackJson._handler_playbackEnd = function () {
        if(!_isPlayback){L.Logger.warning('[tk-sdk]No playback environment!');return ;} ;
        var roomEvt = TK.RoomEvent({type: 'room-playback-playbackEnd'});
        that.dispatchEvent(roomEvt);
    } ;
    _handlerCallbackJson._handler_playback_updatetime = function  (message) {
        if(!_isPlayback){L.Logger.warning('[tk-sdk]No playback environment!');return ;} ;
        var roomEvt = TK.RoomEvent({type: 'room-playback-playback_updatetime' , message:message });
        that.dispatchEvent(roomEvt);
    };
    _handlerCallbackJson._handler_connectSocketSuccess = function (code, response) {
        var roominfo = response.roominfo;//房间信息
        var msglist = response.msglist; //各种消息列表，对应pugmsg所有信息
        var userlist = response.userlist;//用户列表，我进入教室后，服务器发送此房间列表给我

        var index = 0, stream, streamList = [], streams, roomId, arg, connectEvt;
        streams = roominfo.streams || [];
        that.p2p = roominfo.p2p;
        roomId = roominfo.id;
        that.iceServers = roominfo.iceServers;
        //that.state = CONNECTED;


        //spec.defaultVideoBW = roominfo.defaultVideoBW;
        //spec.maxVideoBW = roominfo.maxVideoBW;

        spec.defaultVideoBW = _room_video_maxbps;
        spec.maxVideoBW = _room_video_maxbps;
        spec.defaultScreenBW = 1024 + 512;
        spec.maxScreenBW = 1024 + 512;
        _users = {} ;
        _rolelist = {} ;

        //size和frame初始化本地流的时候用
        /*_room_video_width = 320,
         _room_video_height = 240,
         _room_video_fps = 15,
         _room_video_maxbps = 256,*/

        _setStatus(STATUS_ALLREADY);

        // 2- Retrieve list of streams
        for (index in streams) {
            if (streams.hasOwnProperty(index)) {
                arg = streams[index];

                var native_subscribe = false;
                var video_stream = false;

                if (arg.attributes === undefined || (arg.attributes !== undefined && arg.attributes.type !== "screen" && arg.attributes.type !== "media"))
                {
                    video_stream = true;
                }

                if (_subscribe_from_native && video_stream)
                {
                    native_subscribe = true;
                }

                stream = TK.Stream({streamID: arg.id,
                    local: false,
                    audio: arg.audio,
                    video: arg.video,
                    data: arg.data,
                    screen: arg.screen,
                    attributes: arg.attributes,
                    extensionId: arg.extensionId}, native_subscribe);
                streamList.push(stream);
                that.remoteStreams[arg.id] = stream;
                L.Logger.info('[tk-sdk]room-connected --> stream info , stream id:'+stream.getID()+ ' , extensionId is '+ stream.extensionId +', attrs is '+ L.Utils.toJsonStringify(stream.getAttributes())  );
                that.subscribe(stream);
            }
        }

        for (index in userlist) {
            if (userlist.hasOwnProperty(index)) {
                var userproperties = userlist[index];
                var user = TK.RoomUser(userproperties);
                if (user !== undefined) {
                    if(!_rolelist[user.role]) { _rolelist[user.role] = {} };
                    _rolelist[user.role][user.id] = user ;
                    _users[user.id]=user;
                    if(_isPlayback && _users[user.id]){
                        delete _users[user.id].playbackLeaved ;
                    }
                    L.Logger.info('[tk-sdk]room-connected --> user info: '+L.Utils.toJsonStringify(user) );
                }
            }
        }
        L.Logger.info('[tk-sdk]room-connected --> myself info: '+L.Utils.toJsonStringify(_myself) );
        var msgs = new Array();
        if(msglist && typeof msglist == "string") {
            msglist = L.Utils.toJsonParse(msglist);
        }
        for (index in msglist) {
            if (msglist.hasOwnProperty(index)) {
                msgs.push(msglist[index]);
            }
        }

        msgs.sort(function(obj1, obj2){
            if (obj1 === undefined || !obj1.hasOwnProperty('seq') || obj2 === undefined || !obj2.hasOwnProperty('seq'))
                return 0;

            return obj1.seq - obj2.seq;

        });

        // 3 - Update RoomID
        that.roomID = roomId;
        _isConnected = true ;
        L.Logger.debug('[tk-sdk]Connected to room ' + that.roomID);
        L.Logger.debug('[tk-sdk]connected response:' , L.Utils.toJsonStringify(response));
        L.Logger.info('[tk-sdk]room-connected ,streams length is '+streamList.length +' , signalling list length '+ msgs.length);
        var connectEvt = TK.RoomEvent({type: 'room-connected', streams: streamList, message:msgs});
        that.dispatchEvent(connectEvt);
        if(_isGetRtcStatsrObserver){
            that.stopIntervalRtcStatsrObserver();
            that.startIntervalRtcStatsrObserver();
        }
    };
    /*socket事件处理end*/

    window.onNativeWindowClose = function () {
        if(!TK.isTkNative){return ; } 
        var roomClientCloseEvt = TK.RoomEvent({type: 'room-cilent-close'});
        that.dispatchEvent(roomClientCloseEvt);
    };

    return that;
};
/*global L, document*/
'use strict';
/*
 * Class Stream represents a local or a remote Stream in the Room. It will handle the WebRTC stream
 * and identify the stream and where it should be drawn.
 */
var TK = TK || {};

TK.PUBLISH_STATE_NONE = 0; //下台
TK.PUBLISH_STATE_AUDIOONLY = 1; //只发布音频
TK.PUBLISH_STATE_VIDEOONLY = 2; //只发布视频
TK.PUBLISH_STATE_BOTH = 3; //音视频都发布
TK.PUBLISH_STATE_MUTEALL = 4; //音视频都关闭
TK.RoomUser = function (userinfo) {

    if (userinfo == undefined || userinfo.properties === undefined) {
        L.Logger.warning('[tk-sdk]Invalidate user info', id, properties);
        return undefined;
    }

    var id = userinfo.id;
    var properties = userinfo.properties;
    L.Logger.debug('[tk-sdk]RoomUser', id, properties);

    var that={};
    that.id = id;
    that.watchStatus = 0;//0 idel 1 sdp 2 ice 3 streaming 4 canceling  

    for (var key in properties) {
        if (key != 'id' && key != 'watchStatus')
            that[key]=properties[key];
    }

    that.publishstate = that.publishstate || TK.PUBLISH_STATE_NONE;
    return that;
};
/*global document, console*/
'use strict';
var L = L || {};
var TK = TK || {} ;
/*
 * API to write logs based on traditional logging mechanisms: debug, trace, info, warning, error
 */
L.Logger = (function (L) {
    var DEBUG = 0,
        TRACE = 1,
        INFO = 2,
        WARNING = 3,
        ERROR = 4,
        NONE = 5,
        enableLogPanel,
        setLogLevel,
        setOutputFunction,
        setLogPrefix,
        outputFunction,
        logPrefix = '',
        print,
        debug,
        trace,
        info,
        log,
        warning,
        error , 
		setLogDevelopment,
		developmentEnvironment = false;

    // By calling this method we will not use console.log to print the logs anymore.
    // Instead we will use a <textarea/> element to write down future logs
    enableLogPanel = function () {
        L.Logger.panel = document.createElement('textarea');
        L.Logger.panel.setAttribute('id', 'licode-logs');
        L.Logger.panel.setAttribute('style', 'width: 100%; height: 100%; display: none');
        L.Logger.panel.setAttribute('rows', 20);
        L.Logger.panel.setAttribute('cols', 20);
        L.Logger.panel.setAttribute('readOnly', true);
        document.body.appendChild(L.Logger.panel);
    };

    // It sets the new log level. We can set it to NONE if we do not want to print logs
    setLogLevel = function (level) {
        if (level > L.Logger.NONE) {
            level = L.Logger.NONE;
        } else if (level < L.Logger.DEBUG) {
            level = L.Logger.DEBUG;
        }
        L.Logger.logLevel = level;
    };
	
	setLogDevelopment = function(isDevelopmentEnvironment){
		developmentEnvironment = isDevelopmentEnvironment ;
	};
	
    outputFunction = function (args , level) {
        try{
            switch (level){
                case L.Logger.DEBUG:
                    developmentEnvironment ? console.warn.apply(console, args) : console.debug.apply(console, args)  ;
                    break;
                case L.Logger.TRACE:
                    console.trace.apply(console, args);
                    break;
                case L.Logger.INFO:
                    developmentEnvironment ? console.warn.apply(console, args) :  console.info.apply(console, args);
                    break;
                case L.Logger.WARNING:
                    console.warn.apply(console, args);
                    break;
                case L.Logger.ERROR:
                    console.error.apply(console, args);
                    break;
                case L.Logger.NONE:
					console.warn("log level is none!");
                    break;
                default:
                    developmentEnvironment ? console.warn.apply(console, args) : console.log.apply(console, args);
                    break;
            }
        }catch (e){
            console.log.apply(console, args);
        }
    };

    setOutputFunction = function (newOutputFunction) {
        outputFunction = newOutputFunction;
    };

    setLogPrefix = function (newLogPrefix) {
        logPrefix = newLogPrefix;
    };

    // Generic function to print logs for a given level:
    //  L.Logger.[DEBUG, TRACE, INFO, WARNING, ERROR]
    print = function (level) {
        var out = logPrefix;
        if (level < L.Logger.logLevel) {
            return;
        }
        if (level === L.Logger.DEBUG) {
            out = out + 'DEBUG('+new Date().toLocaleString()+')';
        } else if (level === L.Logger.TRACE) {
            out = out + 'TRACE('+new Date().toLocaleString()+')';
        } else if (level === L.Logger.INFO) {
            out = out + 'INFO('+new Date().toLocaleString()+')';
        } else if (level === L.Logger.WARNING) {
            out = out + 'WARNING('+new Date().toLocaleString()+')';
        } else if (level === L.Logger.ERROR) {
            out = out + 'ERROR('+new Date().toLocaleString()+')';
        }
        out = out + ':';
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args[i] = arguments[i];
        }
        var tempArgs = args.slice(1);
        args = [out].concat(tempArgs);
        if (L.Logger.panel !== undefined) {
            var tmp = '';
            for (var idx = 0; idx < args.length; idx++) {
                tmp = tmp + args[idx];
            }
            L.Logger.panel.value = L.Logger.panel.value + '\n' + tmp;
        } else {
            outputFunction.apply(L.Logger, [args , level] );
        }
    };

    // It prints debug logs
    debug = function () {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args[i] = arguments[i];
        }
        L.Logger.print.apply(L.Logger,[L.Logger.DEBUG].concat(args));
    };

    // It prints trace logs
    trace = function () {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args[i] = arguments[i];
        }
        L.Logger.print.apply(L.Logger,[L.Logger.TRACE].concat(args));
    };

    // It prints info logs
    info = function () {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args[i] = arguments[i];
        }
        L.Logger.print.apply(L.Logger,[L.Logger.INFO].concat(args));
    };

    // It prints warning logs
    warning = function () {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args[i] = arguments[i];
        }
        L.Logger.print.apply(L.Logger,[L.Logger.WARNING].concat(args));
    };

    // It prints error logs
    error = function () {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
            args[i] = arguments[i];
        }
        L.Logger.print.apply(L.Logger,[L.Logger.ERROR].concat(args));
    };

    return {
        DEBUG: DEBUG,
        TRACE: TRACE,
        INFO: INFO,
        WARNING: WARNING,
        ERROR: ERROR,
        NONE: NONE,
		setLogDevelopment:setLogDevelopment , 
        enableLogPanel: enableLogPanel,
        setLogLevel: setLogLevel,
        setOutputFunction: setOutputFunction,
        setLogPrefix: setLogPrefix,
        print:print ,
        debug: debug,
        trace: trace,
        info: info,
        warning: warning,
        error: error 
    };
}(L));

/*设置日志输出,通过配置项*/
TK.tkLogPrintConfig =  function (socketLogConfig , loggerConfig , adpConfig ) {
    loggerConfig = loggerConfig || {} ;
    socketLogConfig = socketLogConfig || {} ;
    adpConfig = adpConfig || {} ;
    var development = loggerConfig.development != undefined  ? loggerConfig.development : true;
    var logLevel =  loggerConfig.logLevel  != undefined  ? loggerConfig.logLevel  : 0;
    var debug = socketLogConfig.debug != undefined  ? socketLogConfig.debug  : true ;
    var webrtcLogDebug =  adpConfig.webrtcLogDebug!= undefined  ? adpConfig.webrtcLogDebug : true ;
    L.Logger.setLogDevelopment(development);
    L.Logger.setLogLevel(logLevel);
    if(L.Utils.localStorage){
        var debugStr =  debug ? '*' : 'none';
        L.Utils.localStorage.setItem('debug' ,debugStr );
    }
    window.webrtcLogDebug = webrtcLogDebug;
};/* global unescape */
'use strict';
var L = L || {};
L.Base64 = (function () {
    var END_OF_INPUT,
        base64Chars,
        reverseBase64Chars,
        base64Str,
        base64Count,
        i,
        setBase64Str,
        readBase64,
        encodeBase64,
        readReverseBase64,
        ntos,
        decodeBase64;

    END_OF_INPUT = -1;

    base64Chars = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
        'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
        'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
        'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
        'w', 'x', 'y', 'z', '0', '1', '2', '3',
        '4', '5', '6', '7', '8', '9', '+', '/'
    ];

    reverseBase64Chars = [];

    for (i = 0; i < base64Chars.length; i = i + 1) {
        reverseBase64Chars[base64Chars[i]] = i;
    }

    setBase64Str = function (str) {
        base64Str = str;
        base64Count = 0;
    };

    readBase64 = function () {
        var c;
        if (!base64Str) {
            return END_OF_INPUT;
        }
        if (base64Count >= base64Str.length) {
            return END_OF_INPUT;
        }
        c = base64Str.charCodeAt(base64Count) & 0xff;
        base64Count = base64Count + 1;
        return c;
    };

    encodeBase64 = function (str) {
        var result, inBuffer, lineCount, done;
        setBase64Str(str);
        result = '';
        inBuffer = new Array(3);
        lineCount = 0;
        done = false;
        while (!done && (inBuffer[0] = readBase64()) !== END_OF_INPUT) {
            inBuffer[1] = readBase64();
            inBuffer[2] = readBase64();
            result = result + (base64Chars[inBuffer[0] >> 2]);
            if (inBuffer[1] !== END_OF_INPUT) {
                result = result + (base64Chars [((inBuffer[0] << 4) & 0x30) | (inBuffer[1] >> 4)]);
                if (inBuffer[2] !== END_OF_INPUT) {
                    result = result +
                              (base64Chars [((inBuffer[1] << 2) & 0x3c) | (inBuffer[2] >> 6)]);
                    result = result + (base64Chars[inBuffer[2] & 0x3F]);
                } else {
                    result = result + (base64Chars[((inBuffer[1] << 2) & 0x3c)]);
                    result = result + ('=');
                    done = true;
                }
            } else {
                result = result + (base64Chars[((inBuffer[0] << 4) & 0x30)]);
                result = result + ('=');
                result = result + ('=');
                done = true;
            }
            lineCount = lineCount + 4;
            if (lineCount >= 76) {
                result = result + ('\n');
                lineCount = 0;
            }
        }
        return result;
    };

    readReverseBase64 = function () {
        if (!base64Str) {
            return END_OF_INPUT;
        }
        while (true) {
            if (base64Count >= base64Str.length) {
                return END_OF_INPUT;
            }
            var nextCharacter = base64Str.charAt(base64Count);
            base64Count = base64Count + 1;
            if (reverseBase64Chars[nextCharacter]) {
                return reverseBase64Chars[nextCharacter];
            }
            if (nextCharacter === 'A') {
                return 0;
            }
        }
    };

    ntos = function (n) {
        n = n.toString(16);
        if (n.length === 1) {
            n = '0' + n;
        }
        n = '%' + n;
        return unescape(n);
    };

    decodeBase64 = function (str) {
        var result, inBuffer, done;
        setBase64Str(str);
        result = '';
        inBuffer = new Array(4);
        done = false;
        while (!done &&
              (inBuffer[0] = readReverseBase64()) !== END_OF_INPUT &&
              (inBuffer[1] = readReverseBase64()) !== END_OF_INPUT) {
            inBuffer[2] = readReverseBase64();
            inBuffer[3] = readReverseBase64();
            result = result + ntos((((inBuffer[0] << 2) & 0xff)| inBuffer[1] >> 4));
            if (inBuffer[2] !== END_OF_INPUT) {
                result +=  ntos((((inBuffer[1] << 4) & 0xff) | inBuffer[2] >> 2));
                if (inBuffer[3] !== END_OF_INPUT) {
                    result = result +  ntos((((inBuffer[2] << 6)  & 0xff) | inBuffer[3]));
                } else {
                    done = true;
                }
            } else {
                done = true;
            }
        }
        return result;
    };

    return {
        encodeBase64: encodeBase64,
        decodeBase64: decodeBase64
    };
}(L));
/* globals $$, Elements */
'use strict';
/**
 * Copyright 2013 Marc J. Schmidt. See the LICENSE file at the top-level
 * directory of this distribution and at
 * https://github.com/marcj/css-element-queries/blob/master/LICENSE.
 */
(function() {

    this.L = this.L || {};
    var L = this.L;

    /**
     *
     * @type {Function}
     * @constructor
     */
    L.ElementQueries = function() {
        /**
         *
         * @param element
         * @returns {Number}
         */
        function getEmSize(element) {
            if (!element) {
                element = document.documentElement;
            }
            var fontSize = getComputedStyle(element, 'fontSize');
            return parseFloat(fontSize) || 16;
        }

        /**
         *
         * @copyright https://github.com/Mr0grog/element-query/blob/master/LICENSE
         *
         * @param element
         * @param value
         * @param units
         * @returns {*}
         */
        function convertToPx(element, value) {
            var units = value.replace(/[0-9]*/, '');
            value = parseFloat(value);
            switch (units) {
                case 'px':
                    return value;
                case 'em':
                    return value * getEmSize(element);
                case 'rem':
                    return value * getEmSize();
                // Viewport units!
                // According to http://quirksmode.org/mobile/tableViewport.html
                // documentElement.clientWidth/Height gets us the most reliable info
                case 'vw':
                    return value * document.documentElement.clientWidth / 100;
                case 'vh':
                    return value * document.documentElement.clientHeight / 100;
                case 'vmin':
                case 'vmax':
                    var vw = document.documentElement.clientWidth / 100;
                    var vh = document.documentElement.clientHeight / 100;
                    var chooser = Math[units === 'vmin' ? 'min' : 'max'];
                    return value * chooser(vw, vh);
                default:
                    return value;
                // for now, not supporting physical units (since they are just a set number of px)
                // or ex/ch (getting accurate measurements is hard)
            }
        }

        /**
         *
         * @param {HTMLElement} element
         * @constructor
         */
        function SetupInformation(element) {
            this.element = element;
            this.options = [];
            var i,
                j,
                option,
                width = 0,
                height = 0,
                value,
                actualValue,
                attrValues,
                attrValue,
                attrName;

            /**
             * @param option {mode: 'min|max', property: 'width|height', value: '123px'}
             */
            this.addOption = function(option) {
                this.options.push(option);
            };

            var attributes = ['min-width', 'min-height', 'max-width', 'max-height'];

            /**
             * Extracts the computed width/height and sets to min/max- attribute.
             */
            this.call = function() {
                // extract current dimensions
                width = this.element.offsetWidth;
                height = this.element.offsetHeight;

                attrValues = {};

                for (i = 0, j = this.options.length; i < j; i++) {
                    option = this.options[i];
                    value = convertToPx(this.element, option.value);

                    actualValue = option.property === 'width' ? width : height;
                    attrName = option.mode + '-' + option.property;
                    attrValue = '';

                    if (option.mode === 'min' && actualValue >= value) {
                        attrValue += option.value;
                    }

                    if (option.mode === 'max' && actualValue <= value) {
                        attrValue += option.value;
                    }

                    if (!attrValues[attrName]) attrValues[attrName] = '';
                    if (attrValue && -1 === (' '+attrValues[attrName]+' ')
                                              .indexOf(' ' + attrValue + ' ')) {
                        attrValues[attrName] += ' ' + attrValue;
                    }
                }

                for (var k in attributes) {
                    if (attrValues[attributes[k]]) {
                        this.element.setAttribute(attributes[k],
                                                  attrValues[attributes[k]].substr(1));
                    } else {
                        this.element.removeAttribute(attributes[k]);
                    }
                }
            };
        }

        /**
         * @param {HTMLElement} element
         * @param {Object}      options
         */
        function setupElement(element, options) {
            if (element.elementQueriesSetupInformation) {
                element.elementQueriesSetupInformation.addOption(options);
            } else {
                element.elementQueriesSetupInformation = new SetupInformation(element);
                element.elementQueriesSetupInformation.addOption(options);
                new L.ResizeSensor(element, function() {
                    element.elementQueriesSetupInformation.call();
                });
            }
            element.elementQueriesSetupInformation.call();
        }

        /**
         * @param {String} selector
         * @param {String} mode min|max
         * @param {String} property width|height
         * @param {String} value
         */
        function queueQuery(selector, mode, property, value) {
            var query;
            if (document.querySelectorAll) query = document.querySelectorAll.bind(document);
            if (!query && 'undefined' !== typeof $$) query = $$;
            if (!query && 'undefined' !== typeof jQuery) query = jQuery;

            if (!query) {
                throw 'No document.querySelectorAll, jQuery or Mootools\'s $$ found.';
            }

            var elements = query(selector);
            for (var i = 0, j = elements.length; i < j; i++) {
                setupElement(elements[i], {
                    mode: mode,
                    property: property,
                    value: value
                });
            }
        }

        var regex = /,?([^,\n]*)\[[\s\t]*(min|max)-(width|height)[\s\t]*[~$\^]?=[\s\t]*"([^"]*)"[\s\t]*]([^\n\s\{]*)/mgi;  // jshint ignore:line

        /**
         * @param {String} css
         */
        function extractQuery(css) {
            var match;
            css = css.replace(/'/g, '"');
            while (null !== (match = regex.exec(css))) {
                if (5 < match.length) {
                    queueQuery(match[1] || match[5], match[2], match[3], match[4]);
                }
            }
        }

        /**
         * @param {CssRule[]|String} rules
         */
        function readRules(rules) {
            var selector = '';
            if (!rules) {
                return;
            }
            if ('string' === typeof rules) {
                rules = rules.toLowerCase();
                if (-1 !== rules.indexOf('min-width') || -1 !== rules.indexOf('max-width')) {
                    extractQuery(rules);
                }
            } else {
                for (var i = 0, j = rules.length; i < j; i++) {
                    if (1 === rules[i].type) {
                        selector = rules[i].selectorText || rules[i].cssText;
                        if (-1 !== selector.indexOf('min-height') ||
                            -1 !== selector.indexOf('max-height')) {
                            extractQuery(selector);
                        } else if (-1 !== selector.indexOf('min-width') ||
                                   -1 !== selector.indexOf('max-width')) {
                            extractQuery(selector);
                        }
                    } else if (4 === rules[i].type) {
                        readRules(rules[i].cssRules || rules[i].rules);
                    }
                }
            }
        }

        /**
         * Searches all css rules and setups the event listener
         * to all elements with element query rules..
         */
        this.init = function() {
            for (var i = 0, j = document.styleSheets.length; i < j; i++) {
                readRules(document.styleSheets[i].cssText ||
                          document.styleSheets[i].cssRules ||
                          document.styleSheets[i].rules);
            }
        };
    };

    function init() {
        (new L.ElementQueries()).init();
    }

    if (window.addEventListener) {
        window.addEventListener('load', init, false);
    } else {
        window.attachEvent('onload', init);
    }

    // Only used for the dirty checking, so the event callback count is limted
    //  to max 1 call per fps per sensor.
    // In combination with the event based resize sensor this saves cpu time,
    // because the sensor is too fast and
    // would generate too many unnecessary events.
    var requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function (fn) {
            return window.setTimeout(fn, 20);
        };

    /**
     * Iterate over each of the provided element(s).
     *
     * @param {HTMLElement|HTMLElement[]} elements
     * @param {Function}                  callback
     */
    function forEachElement(elements, callback){
        var elementsType = Object.prototype.toString.call(elements);
        var isCollectionTyped = ('[object Array]' === elementsType ||
            ('[object NodeList]' === elementsType) ||
            ('[object HTMLCollection]' === elementsType) ||
            ('undefined' !== typeof jQuery && elements instanceof jQuery) || //jquery
            ('undefined' !== typeof Elements && elements instanceof Elements) //mootools
        );
        var i = 0, j = elements.length;
        if (isCollectionTyped) {
            for (; i < j; i++) {
                callback(elements[i]);
            }
        } else {
            callback(elements);
        }
    }
    /**
     * Class for dimension change detection.
     *
     * @param {Element|Element[]|Elements|jQuery} element
     * @param {Function} callback
     *
     * @constructor
     */
    L.ResizeSensor = function(element, callback) {
        /**
         *
         * @constructor
         */
        function EventQueue() {
            var q = [];
            this.add = function(ev) {
                q.push(ev);
            };

            var i, j;
            this.call = function() {
                for (i = 0, j = q.length; i < j; i++) {
                    q[i].call();
                }
            };

            this.remove = function(ev) {
                var newQueue = [];
                for(i = 0, j = q.length; i < j; i++) {
                    if(q[i] !== ev) newQueue.push(q[i]);
                }
                q = newQueue;
            };

            this.length = function() {
                return q.length;
            };
        }

        /**
         * @param {HTMLElement} element
         * @param {String}      prop
         * @returns {String|Number}
         */
        function getComputedStyle(element, prop) {
            if (element.currentStyle) {
                return element.currentStyle[prop];
            } else if (window.getComputedStyle) {
                return window.getComputedStyle(element, null).getPropertyValue(prop);
            } else {
                return element.style[prop];
            }
        }

        /**
         *
         * @param {HTMLElement} element
         * @param {Function}    resized
         */
        function attachResizeEvent(element, resized) {
            if (!element.resizedAttached) {
                element.resizedAttached = new EventQueue();
                element.resizedAttached.add(resized);
            } else if (element.resizedAttached) {
                element.resizedAttached.add(resized);
                return;
            }

            element.resizeSensor = document.createElement('div');
            element.resizeSensor.className = 'resize-sensor';
            var style = 'position: absolute; left: 0; top: 0; right: 0; bottom: 0; ' +
                        'overflow: hidden; z-index: -1; visibility: hidden;';
            var styleChild = 'position: absolute; left: 0; top: 0; transition: 0s;';

            element.resizeSensor.style.cssText = style;
            element.resizeSensor.innerHTML =
                '<div class="resize-sensor-expand" style="' + style + '">' +
                    '<div style="' + styleChild + '"></div>' +
                '</div>' +
                '<div class="resize-sensor-shrink" style="' + style + '">' +
                    '<div style="' + styleChild + ' width: 200%; height: 200%"></div>' +
                '</div>';
            element.appendChild(element.resizeSensor);

            if (getComputedStyle(element, 'position') === 'static') {
                element.style.position = 'relative';
            }

            var expand = element.resizeSensor.childNodes[0];
            var expandChild = expand.childNodes[0];
            var shrink = element.resizeSensor.childNodes[1];

            var reset = function() {
                expandChild.style.width  = 100000 + 'px';
                expandChild.style.height = 100000 + 'px';

                expand.scrollLeft = 100000;
                expand.scrollTop = 100000;

                shrink.scrollLeft = 100000;
                shrink.scrollTop = 100000;
            };

            reset();
            var dirty = false;

            var dirtyChecking = function() {
                if (!element.resizedAttached) return;

                if (dirty) {
                    element.resizedAttached.call();
                    dirty = false;
                }

                requestAnimationFrame(dirtyChecking);
            };

            requestAnimationFrame(dirtyChecking);
            var lastWidth, lastHeight;
            var cachedWidth, cachedHeight; //useful to not query offsetWidth twice

            var onScroll = function() {
              if ((cachedWidth = element.offsetWidth) !== lastWidth ||
                  (cachedHeight = element.offsetHeight) !== lastHeight) {
                  dirty = true;

                  lastWidth = cachedWidth;
                  lastHeight = cachedHeight;
              }
              reset();
            };

            var addEvent = function(el, name, cb) {
                if (el.attachEvent) {
                    el.attachEvent('on' + name, cb);
                } else {
                    el.addEventListener(name, cb);
                }
            };

            addEvent(expand, 'scroll', onScroll);
            addEvent(shrink, 'scroll', onScroll);
        }

        forEachElement(element, function(elem){
            attachResizeEvent(elem, callback);
        });

        this.detach = function(ev) {
            L.ResizeSensor.detach(element, ev);
        };
    };

    L.ResizeSensor.detach = function(element, ev) {
        forEachElement(element, function(elem){
            if(elem.resizedAttached && typeof ev === 'function'){
                elem.resizedAttached.remove(ev);
                if(elem.resizedAttached.length()) return;
            }
            if (elem.resizeSensor) {
                if (elem.contains(elem.resizeSensor)) {
                    elem.removeChild(elem.resizeSensor);
                }
                delete elem.resizeSensor;
                delete elem.resizedAttached;
            }
        });
    };


})();
'use strict';
/*
 * View class represents a HTML component
 * Every view is an EventDispatcher.
 */
var TK = TK || {};
TK.View = function () {
    var that = TK.EventDispatcher({});

    // Variables

    // URL where it will look for icons and assets
    that.url = '';
    return that;
};
/*global window, document, L, webkitURL*/
'use strict';
/*
 * VideoPlayer represents a Talk video component that shows either a local or a remote video.
 * Ex.: var player = VideoPlayer({id: id, stream: stream, elementID: elementID});
 * A VideoPlayer is also a View component.
 */
var TK = TK || {};

TK.VideoPlayer = function (spec) {
    var testVideoClone = undefined ;
    var testVideo = false;
    spec.options.bar = spec.options.bar != undefined?spec.options.bar:false ;
    var that = TK.View({}),
        onmouseover,
        onmouseout;

    // Variables

    // VideoPlayer ID
    that.id = spec.id;
    that.local = spec.stream.local ;
    // Stream that the VideoPlayer will play
    that.stream = spec.stream.stream;

    // DOM element in which the VideoPlayer will be appended
    that.elementID = spec.elementID;

    // Private functions
    onmouseover = function () {
        that.bar.display();
    };

    onmouseout = function () {
        that.bar.hide();
    };

    // Public functions

    // It will stop the VideoPlayer and remove it from the HTML
    that.destroy = function () {
        L.Utils.mediaPause( that.video);
        delete that.resizer;
        try{
            if(that.div){
                that.container.removeChild(that.div);
                // that.parentNode.removeChild(that.div);
            }
            if(testVideo){
                var testVideoElement = document.getElementById('testVideoContainer');
                if(testVideoClone && testVideoElement){
                    testVideoElement.removeChild(testVideoClone);
                }
            }
        }catch (e){
            L.Logger.error('[tk-sdk]videoplayer destroy error , removeChild method error info:' , e);
        }
    };

    that.resize = function () {
        var width = that.container.offsetWidth,
            height = that.container.offsetHeight;

        if (spec.stream.screen || spec.options.crop === false) {

            if (width * (9 / 16) < height) {

                that.video.style.width = width + 'px';
                that.video.style.height = (9 / 16) * width + 'px';

                that.video.style.top = -((9 / 16) * width / 2 - height / 2) + 'px';
                that.video.style.left = '0px';

            } else {

                that.video.style.height = height + 'px';
                that.video.style.width = (16 / 9) * height + 'px';

                that.video.style.left = -((16 / 9) * height / 2 - width / 2) + 'px';
                that.video.style.top = '0px';

            }
        } else {
            if (width !== that.containerWidth || height !== that.containerHeight) {

                if (width * (3 / 4) > height) {

                    that.video.style.width = width + 'px';
                    that.video.style.height = (3 / 4) * width + 'px';

                    that.video.style.top = -((3 / 4) * width / 2 - height / 2) + 'px';
                    that.video.style.left = '0px';

                } else {

                    that.video.style.height = height + 'px';
                    that.video.style.width = (4 / 3) * height + 'px';

                    that.video.style.left = -((4 / 3) * height / 2 - width / 2) + 'px';
                    that.video.style.top = '0px';

                }
            }
        }

        that.containerWidth = width;
        that.containerHeight = height;

    };

    /*window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        document.getElementById(key).value = unescape(value);
    });*/
    if(that.stream && typeof that.stream === "object" && that.stream.playbackquUrl  ){ //如果是回放，则取回放地址
        L.Logger.debug('[tk-sdk]Creating palyback URL from stream ' + that.stream);
        that.streamUrl = that.stream.playbackquUrl ;
    }else if(that.stream){
        L.Logger.debug('[tk-sdk]Creating URL from stream ' + that.stream);
        var myURL = window.URL || webkitURL;
        that.streamUrl = myURL.createObjectURL(that.stream);
    }


    // Container
    that.div = document.createElement('div');
    that.div.setAttribute('id', 'player_' + that.id);
    that.div.setAttribute('class', 'Talk_player');
    that.div.setAttribute('style', 'width: 100%; height: 100%; position: relative; ' +
                                   'background-color: black; overflow: hidden;');

    // Loader icon
    if (spec.options.loader !== false) {
	 //qiushao改:2017-07-26
     // that.loader = document.createElement('img');
	  that.loader = document.createElement('div');
      that.loader.setAttribute('id', 'back_' + that.id);
      that.loader.setAttribute('class', 'Talk_loader');
	 //qiushao改:2017-07-26
     // that.loader.setAttribute('src', that.url + '/assets/loader.gif');
    }

    // Video tag
    that.video = document.createElement('video');
    that.video.setAttribute('id', 'stream' + that.id);
    that.video.setAttribute('class', 'Talk_stream');
    that.video.setAttribute('style', 'width: 100%; height: 100%; position: absolute;background-color:#000;');
    that.video.setAttribute('autoplay', 'autoplay');

    // Video Supernatant
    that.videoSupernatant = document.createElement('div');
    that.videoSupernatant.setAttribute('class', 'Talk_stream_videoSupernatant');
    that.videoSupernatant.setAttribute('style', 'width: 100%; height: 100%; position: absolute;background-color:transparent;left:0;top:0;');

    that.showVideoContainer = function () {
        if(that.container){
            that.container.style.display = 'block' ;
        }
    };
    that.hideVideoContainer = function () {
        if(that.container){
            that.container.style.display = 'none' ;
        }
    };
    that.showVideo = function () {
        if (that.video ) {
            that.video.style.display = 'block' ;
        }
    };
    that.hideVideo = function () {
        if (that.video) {
            that.video.style.display = 'none' ;
        }
    };
    if(that.local){
        that.video.volume = 0;
        that.video.muted = true ;
    }

    if (that.elementID !== undefined) {
        // Check for a passed DOM node.
        if (typeof that.elementID === 'object' && typeof that.elementID.appendChild === 'function') {
            that.container = that.elementID;
        } else {
            that.container = document.getElementById(that.elementID);
        }
    } else {
        that.container = document.body;
    }
    that.container.appendChild(that.div);
    //that.parentNode = that.div.parentNode;

    if (that.loader) {
      that.div.appendChild(that.loader);
    }
    that.div.appendChild(that.video);
    that.div.appendChild(that.videoSupernatant);

    that.containerWidth = 0;
    that.containerHeight = 0;

    // if (spec.options.resizer !== false) {
    //   that.resizer = new L.ResizeSensor(that.container, that.resize);

    //   that.resize();
    // }

    // Bottom Bar
    if (spec.options.bar !== false) {
        that.bar = new TK.Bar({elementID: 'player_' + that.id,
                                  id: that.id,
                                  stream: spec.stream,
                                  media: that.video,
                                  options: spec.options});

        that.div.onmouseover = onmouseover;
        that.div.onmouseout = onmouseout;
    }
    else {
        // Expose a consistent object to manipulate the media.
        that.media = that.video;
    }

    if(that.streamUrl){
        that.video.src = that.streamUrl;
        that.video.load();
    }

    var _removeTempAudioElement = function () {
        if(that.video && that.video.readyState !== 0 && that.audio){
            if(that.div && that.div.removeChild && that.audio){
                that.audio.src = '';
                that.div.removeChild( that.audio );
            }
            that.audio = undefined ;
        }
    };

    that.video.oncanplay = function (event) {
        that.loader.style.display = "none" ;
        that.div.style.backgroundColor = "transparent" ;
        that.video.oncanplay = undefined ;
        that.video.onloadeddata = undefined ;
        that.video.onloadedmetadata = undefined ;
        _removeTempAudioElement();
    };

    that.video.onloadeddata = function (event) {
        that.loader.style.display = "none" ;
        that.div.style.backgroundColor = "transparent" ;
        that.video.oncanplay = undefined ;
        that.video.onloadeddata = undefined ;
        that.video.onloadedmetadata = undefined ;
        _removeTempAudioElement();
    };

    that.video.onloadedmetadata = function (event) {
        //event = event || window.event ;
        that.loader.style.display = "none" ;
        that.div.style.backgroundColor = "transparent" ;
        that.video.oncanplay = undefined ;
        that.video.onloadeddata = undefined ;
        that.video.onloadedmetadata = undefined ;
        _removeTempAudioElement();
    };
    that.video.onreadystatechange = function (event) {
        _removeTempAudioElement();
    };

    that.changeMediaStreamUrl = function(mediaStream){
        if(that.video && mediaStream){
            that.stream = mediaStream ;
            if(that.stream && typeof that.stream === "object" && that.stream.playbackquUrl  ){ //如果是回放，则取回放地址
                L.Logger.debug('[tk-sdk]Creating palyback URL from stream:' , that.stream);
                that.streamUrl = that.stream.playbackquUrl ;
            }else if(that.stream){
                L.Logger.debug('[tk-sdk]Creating URL from stream: ' , that.stream);
                var myURL = window.URL || webkitURL;
                that.streamUrl = myURL.createObjectURL(that.stream);
            }
            if(that.streamUrl){
                that.video.src = that.streamUrl;
                that.video.load();
            }
        }
    };
    if( that.stream ){
        if( !( typeof that.stream === "object" && that.stream.playbackquUrl ) ){
            var videoTracks = that.stream.getVideoTracks ? that.stream.getVideoTracks() : undefined;
            if( !(videoTracks && videoTracks.length>0 ) ){
                L.Logger.warning('[tk-sdk]TK.VideoPlayer stream is not videoTracks , hide video element , VideoPlayer id is '+that.id+'!');
                that.hideVideo();
            }
        }
    }else{
        L.Logger.warning('[tk-sdk]TK.VideoPlayer stream is not exist , hide video element , VideoPlayer id is '+that.id+'!');
        that.hideVideo();
    }
    var _handlerPlayVideoElement = function () {
        try {
            if(that.video && that.video.readyState === 0 && !that.local){
                setTimeout(function () {
                    if(that && that.video && that.video.readyState === 0 && that.streamUrl && that.div){
                        /*readyState	返回视频当前的就绪状态
                         0 = HAVE_NOTHING - 没有关于音频/视频是否就绪的信息
                         1 = HAVE_METADATA - 关于音频/视频就绪的元数据
                         2 = HAVE_CURRENT_DATA - 关于当前播放位置的数据是可用的，但没有足够的数据来播放下一帧/毫秒
                         3 = HAVE_FUTURE_DATA - 当前及至少下一帧的数据是可用的
                         4 = HAVE_ENOUGH_DATA - 可用数据足以开始播放*/

                        //temp video tag
                        that.audio = document.createElement('audio');
                        that.audio.setAttribute('id', 'stream_temp_audio_' + that.id);
                        that.audio.setAttribute('autoplay', 'autoplay');
                        that.audio.style.display = 'none' ;
                        that.div.appendChild(that.audio);
                        that.audio.src = that.streamUrl;
                        that.audio.load();
                        if(that.local){
                            that.audio.volume = 0;
                            that.audio.muted = true ;
                        }
                        var _handlerPlayTempAudioElement = function () {
                            if(that.audio && that.audio.play){
                                var playmethod = L.Utils.mediaPlay( that.audio);
                                if(playmethod && playmethod.catch ){
                                    playmethod.catch(function(err){
                                        L.Logger.warning('[tk-sdk]audio.play method catch error , videoPlayer id is '+that.id +' , error info:'+err);
                                    });
                                }
                            }
                        };
                        var audiooutputDeviceIdToAudio = L.Utils.localStorage.getItem(L.Constant.deviceStorage.audiooutput) ;
                        if(audiooutputDeviceIdToAudio){
                            TK.AVMgr.setElementSinkIdToAudioouputDevice(that.audio ,audiooutputDeviceIdToAudio , function () {
                                _handlerPlayTempAudioElement();
                            });
                        }else{
                            _handlerPlayTempAudioElement();
                        }
                    }
                },250);
            }
            if(that.video && that.video.play){
                var playmethod = L.Utils.mediaPlay( that.video);
                if(playmethod && playmethod.catch ){
                    playmethod.catch(function(err){
                        L.Logger.warning('[tk-sdk]video.play method catch error , videoPlayer id is '+that.id +' , error info:'+err);
                    });
                }
            }
        }catch (e){
            L.Logger.warning('[tk-sdk]video.play method error , videoPlayer id is '+that.id +' !');
        }
    };
    var audiooutputDeviceId = L.Utils.localStorage.getItem(L.Constant.deviceStorage.audiooutput) ;
    if(that.video && audiooutputDeviceId){
        TK.AVMgr.setElementSinkIdToAudioouputDevice(that.video ,audiooutputDeviceId , function () {
            _handlerPlayVideoElement();
        });
    }else{
        _handlerPlayVideoElement();
    }
    if(testVideo){
        var testVideoElement = document.getElementById('testVideoContainer');
        if(testVideoElement){
            testVideoClone = that.div.cloneNode(true);
            testVideoElement.appendChild(testVideoClone);
        }
    }
    return that;
};
/*global window, document, L, webkitURL*/
'use strict';
/*
 * VideoPlayer represents a Talk video component that shows either a local or a remote video.
 * Ex.: var player = VideoPlayer({id: id, stream: stream, elementID: elementID});
 * A VideoPlayer is also a View component.
 */
var TK = TK || {};
TK.NativeVideoPlayer = function (spec) {
	spec.options.bar = spec.options.bar != undefined?spec.options.bar:false ;  
	if(!spec.stream.stream){L.Logger.warning('[tk-sdk]VideoPlayer: media stream  is not exist!');} ;
    var that = TK.View({}),
        onmouseover,
        onmouseout;

    // Variables

    // VideoPlayer ID
    that.id = spec.id;

    // Stream that the VideoPlayer will play
    that.stream = spec.stream.stream;

    // DOM element in which the VideoPlayer will be appended
    that.elementID = spec.elementID;

    // Private functions
    onmouseover = function () {
        that.bar.display();
    };

    onmouseout = function () {
        that.bar.hide();
    };

    // Public functions

    // It will stop the VideoPlayer and remove it from the HTML
    that.destroy = function () {
        //L.Utils.mediaPause(that.video);
        //delete that.resizer;
        that.parentNode.removeChild(that.div);
    };

    that.resize = function () {
        var width = that.container.offsetWidth,
            height = that.container.offsetHeight;

        if (spec.stream.screen || spec.options.crop === false) {

            if (width * (9 / 16) < height) {

                that.video.style.width = width + 'px';
                that.video.style.height = (9 / 16) * width + 'px';

                that.video.style.top = -((9 / 16) * width / 2 - height / 2) + 'px';
                that.video.style.left = '0px';

            } else {

                that.video.style.height = height + 'px';
                that.video.style.width = (16 / 9) * height + 'px';

                that.video.style.left = -((16 / 9) * height / 2 - width / 2) + 'px';
                that.video.style.top = '0px';

            }
        } else {
            if (width !== that.containerWidth || height !== that.containerHeight) {

                if (width * (3 / 4) > height) {

                    that.video.style.width = width + 'px';
                    that.video.style.height = (3 / 4) * width + 'px';

                    that.video.style.top = -((3 / 4) * width / 2 - height / 2) + 'px';
                    that.video.style.left = '0px';

                } else {

                    that.video.style.height = height + 'px';
                    that.video.style.width = (4 / 3) * height + 'px';

                    that.video.style.left = -((4 / 3) * height / 2 - width / 2) + 'px';
                    that.video.style.top = '0px';

                }
            }
        }

        that.containerWidth = width;
        that.containerHeight = height;

    };

    /*window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        document.getElementById(key).value = unescape(value);
    });*/
    // if(that.stream && typeof that.stream === "object" && that.stream.playbackquUrl  ){ //如果是回放，则取回放地址
    //     L.Logger.debug('[tk-sdk]Creating palyback URL from stream :' ,  L.Utils.toJsonStringify(that.stream) );
    //     that.streamUrl = that.stream.playbackquUrl ;
    // }else if(that.stream){
    //     L.Logger.debug('[tk-sdk]Creating URL from stream: ' ,  L.Utils.toJsonStringify(that.stream) );
    //     var myURL = window.URL || webkitURL;
    //     that.streamUrl = myURL.createObjectURL(that.stream);
    // }


    // Container
    that.div = document.createElement('div');
    that.div.setAttribute('id', 'player_' + that.id);
    that.div.setAttribute('class', 'Talk_player');
    that.div.setAttribute('style', 'width: 100%; height: 100%; position: relative; ' +
                                   'background-color: black; overflow: hidden;');

    // Loader icon
    if (spec.options.loader !== false) {
	 //qiushao改:2017-07-26
     // that.loader = document.createElement('img');
	  that.loader = document.createElement('div');
      that.loader.setAttribute('id', 'back_' + that.id);
      that.loader.setAttribute('class', 'Talk_loader');
	 //qiushao改:2017-07-26
     // that.loader.setAttribute('src', that.url + '/assets/loader.gif');
    }

    // Video tag
    that.video = document.createElement('embed');
    //that.video.setAttribute('id', 'stream' + that.id);
    that.video.setAttribute('id', that.id);
    that.video.setAttribute('class', 'Talk_stream');
    that.video.setAttribute('style', 'width: 100%; height: 100%; position: absolute;background-color:#000;');
    that.video.setAttribute('type', 'application/x-ppapi-proxy');
    //that.video.setAttribute('autoplay', 'autoplay');

    // Video Supernatant
    that.videoSupernatant = document.createElement('div');
    that.videoSupernatant.setAttribute('class', 'Talk_stream_videoSupernatant');
    that.videoSupernatant.setAttribute('style', 'width: 100%; height: 100%; position: absolute;background-color:transparent;left:0;top:0;');

    that.showVideo = function () {
        if (that.video ) {
            that.video.style.opacity = 1 ;
        }
    };

    that.hideVideo = function () {
        if (that.video ) {
            that.video.style.opacity = 0 ;
        }
    };

    //if(spec.stream.local)
        //that.video.volume = 0;
    if (that.elementID !== undefined) {
        // Check for a passed DOM node.
        if (typeof that.elementID === 'object' &&
          typeof that.elementID.appendChild === 'function') {
            that.container = that.elementID;
        }
        else {
            that.container = document.getElementById(that.elementID);
        }
    } else {
        that.container = document.body;
    }
    that.container.appendChild(that.div);

    that.parentNode = that.div.parentNode;

    if (that.loader) {
      that.div.appendChild(that.loader);
    }
    that.div.appendChild(that.video);
    that.div.appendChild(that.videoSupernatant);

    that.containerWidth = 0;
    that.containerHeight = 0;

    // if (spec.options.resizer !== false) {
    //   that.resizer = new L.ResizeSensor(that.container, that.resize);

    //   that.resize();
    // }

    // Bottom Bar
    if (spec.options.bar !== false) {
        that.bar = new TK.Bar({elementID: 'player_' + that.id,
                                  id: that.id,
                                  stream: spec.stream,
                                  media: that.video,
                                  options: spec.options});

        that.div.onmouseover = onmouseover;
        that.div.onmouseout = onmouseout;
    }
    else {
        // Expose a consistent object to manipulate the media.
        that.media = that.video;
    }

    if(that.streamUrl){
        //that.video.src = that.streamUrl;
    }

    that.video.onloadedmetadata = function (event) {
        event = event || window.event ;
        that.loader.style.display = "none" ;
        that.div.style.backgroundColor = "transparent" ;
    };
    that.changeMediaStreamUrl = function(mediaStream){
        // if(that.video && mediaStream){
        //     that.stream = mediaStream ;
        //     if(that.stream && typeof that.stream === "object" && that.stream.playbackquUrl  ){ //如果是回放，则取回放地址
        //         L.Logger.debug('[tk-sdk]Creating palyback URL from stream :' ,  that.stream);
        //         that.streamUrl = that.stream.playbackquUrl ;
        //     }else if(that.stream){
        //         L.Logger.debug('[tk-sdk]Creating URL from stream ' ,that.stream);
        //         var myURL = window.URL || webkitURL;
        //         that.streamUrl = myURL.createObjectURL(that.stream);
        //     }
        //     if(that.streamUrl){
        //         that.video.src = that.streamUrl;
        //     }
        // }
    };
    return that;
};
/*global window, document, L, webkitURL*/
'use strict';
/*
 * AudioPlayer represents a Talk Audio component that shows either a local or a remote Audio.
 * Ex.: var player = AudioPlayer({id: id, stream: stream, elementID: elementID});
 * A AudioPlayer is also a View component.
 */
var TK = TK || {};
TK.ChromeStableStack = 10;
TK.AudioPlayer = function (spec) {
    var that = TK.View({}),
        onmouseover,
        onmouseout;

    // Variables

    // AudioPlayer ID
    that.id = spec.id;

    // Stream that the AudioPlayer will play
    that.stream = spec.stream.stream;

    // DOM element in which the AudioPlayer will be appended
    that.elementID = spec.elementID;


    L.Logger.debug('[tk-sdk]Creating URL from stream ' + that.stream);
    var myURL = window.URL || webkitURL;
    that.streamUrl = myURL.createObjectURL(that.stream);

    // Audio tag
    that.audio = document.createElement('audio');
    that.audio.setAttribute('id', 'stream' + that.id);
    that.audio.setAttribute('class', 'Talk_stream');
    that.audio.setAttribute('style', 'width: 100%; height: 100%; position: absolute');
    that.audio.setAttribute('autoplay', 'autoplay');

    if(spec.stream.local)
        that.audio.volume = 0;

    if(spec.stream.local)
        that.audio.volume = 0;


    if (that.elementID !== undefined) {

        // It will stop the AudioPlayer and remove it from the HTML
        that.destroy = function () {
            L.Utils.mediaPause(that.audio);
            that.parentNode.removeChild(that.div);
        };

        onmouseover = function () {
            that.bar.display();
        };

        onmouseout = function () {
            that.bar.hide();
        };

        // Container
        that.div = document.createElement('div');
        that.div.setAttribute('id', 'player_' + that.id);
        that.div.setAttribute('class', 'Talk_player');
        that.div.setAttribute('style', 'width: 100%; height: 100%; position: relative; ' +
                              'overflow: hidden;');

        // Check for a passed DOM node.
        if (typeof that.elementID === 'object' &&
          typeof that.elementID.appendChild === 'function') {
            that.container = that.elementID;
        }
        else {
            that.container = document.getElementById(that.elementID);
        }
        that.container.appendChild(that.div);

        that.parentNode = that.div.parentNode;

        that.div.appendChild(that.audio);

        // Bottom Bar
        if (spec.options.bar !== false) {
            that.bar = new TK.Bar({elementID: 'player_' + that.id,
                                      id: that.id,
                                      stream: spec.stream,
                                      media: that.audio,
                                      options: spec.options});

            that.div.onmouseover = onmouseover;
            that.div.onmouseout = onmouseout;
        }
        else {
            // Expose a consistent object to manipulate the media.
            that.media = that.audio;
        }

    } else {
        // It will stop the AudioPlayer and remove it from the HTML
        that.destroy = function () {
            L.Utils.mediaPause(that.audio);
            that.parentNode.removeChild(that.audio);
        };

        document.body.appendChild(that.audio);
        that.parentNode = document.body;
    }

    that.audio.src = that.streamUrl;

    return that;
};
/*global document, clearTimeout, setTimeout */
'use strict';
/*
 * Bar represents the bottom menu bar of every mediaPlayer.
 * It contains a Speaker and an icon.
 * Every Bar is a View.
 * Ex.: var bar = Bar({elementID: element, id: id});
 */
var TK = TK || {};
TK.Bar = function (spec) {
    var that = TK.View({}),
        waiting,
        show;

    // Variables

    // DOM element in which the Bar will be appended
    that.elementID = spec.elementID;

    // Bar ID
    that.id = spec.id;

    // Container
    that.div = document.createElement('div');
    that.div.setAttribute('id', 'bar_' + that.id);
    that.div.setAttribute('class', 'Talk_bar');

    // Bottom bar
    that.bar = document.createElement('div');
    that.bar.setAttribute('style', 'width: 100%; height: 15%; max-height: 30px; ' +
                                   'position: absolute; bottom: 0; right: 0; ' +
                                   'background-color: rgba(255,255,255,0.62)');
    that.bar.setAttribute('id', 'subbar_' + that.id);
    that.bar.setAttribute('class', 'Talk_subbar');

    // Lynckia icon
    that.link = document.createElement('a');
    that.link.setAttribute('href', spec && spec.options && spec.options.link?spec.options.link : 'http://www.talk-cloud.com/');
    that.link.setAttribute('class', 'Talk_link');
    that.link.setAttribute('target', '_blank');
	
	//qiushao改:2017-07-06
    that.logo = document.createElement('div');
    that.logo.setAttribute('style', 'width: 100%; height: 100%; max-width: 30px; ' +
                                    'position: absolute; top: 0; left: 2px;');
    that.logo.setAttribute('class', 'Talk_logo');
    that.logo.setAttribute('alt', 'Lynckia');
	//qiushao改:2017-07-06
    //that.logo.setAttribute('src', that.url + '/assets/star.svg');

    // Private functions
    show = function (displaying) {
        if (displaying !== 'block') {
            displaying = 'none';
        } else {
            clearTimeout(waiting);
        }

        that.div.setAttribute('style', 'width: 100%; height: 100%; position: relative; ' +
                                       'bottom: 0; right: 0; display:' + displaying);
    };

    // Public functions

    that.display = function () {
        show('block');
    };

    that.hide = function () {
        waiting = setTimeout(show, 1000);
    };

    document.getElementById(that.elementID).appendChild(that.div);
    that.div.appendChild(that.bar);
    that.bar.appendChild(that.link);
    that.link.appendChild(that.logo);

    // Speaker component
    if (!spec.stream.screen && (spec.options === undefined ||
                                spec.options.speaker === undefined ||
                                spec.options.speaker === true)) {
        that.speaker = new TK.Speaker({elementID: 'subbar_' + that.id,
                                          id: that.id,
                                          stream: spec.stream,
                                          media: spec.media});
    }

    that.display();
    that.hide();

    return that;
};
/*global document */
'use strict';
/*
 * Speaker represents the volume icon that will be shown in the mediaPlayer, for example.
 * It manages the volume level of the media tag given in the constructor.
 * Every Speaker is a View.
 * Ex.: var speaker = Speaker({elementID: element, media: mediaTag, id: id});
 */
var TK = TK || {};
TK.Speaker = function (spec) {
    var that = TK.View({}),
        show,
        mute,
        unmute,
        lastVolume = 50;

    // Variables

    // DOM element in which the Speaker will be appended
    that.elementID = spec.elementID;

    // media tag
    that.media = spec.media;

    // Speaker id
    that.id = spec.id;

    // MediaStream
    that.stream = spec.stream;

    // Container
    that.div = document.createElement('div');
    that.div.setAttribute('style', 'width: 40%; height: 100%; max-width: 32px; ' +
                                   'position: absolute; right: 0;z-index:0;');

    // Volume icon
	//qiushao改:2017-07-26
    //that.icon = document.createElement('img');
	that.icon = document.createElement('div');
    that.icon.setAttribute('id', 'volume_' + that.id);
	//qiushao改:2017-07-26
    //that.icon.setAttribute('src', that.url + '/assets/sound48.png');
	that.icon.setAttribute('class', 'Talk_Volume_icon');		
    that.icon.setAttribute('style', 'width: 80%; height: 100%; position: absolute;');
    that.div.appendChild(that.icon);


    if (!that.stream.local) {

        // Volume bar
        that.picker = document.createElement('input');
        that.picker.setAttribute('id', 'picker_' + that.id);
        that.picker.type = 'range';
        that.picker.min = 0;
        that.picker.max = 100;
        that.picker.step = 10;
        that.picker.value = lastVolume;
        //  FireFox supports range sliders as of version 23
        that.picker.setAttribute('orient', 'vertical');
        that.div.appendChild(that.picker);
        that.media.volume = that.picker.value / 100;
        that.media.muted = false;

        that.picker.oninput = function () {
            if (that.picker.value > 0) {
                that.media.muted = false;
				//qiushao改:2017-07-26
				//that.icon.setAttribute('src', that.url + '/assets/sound48.png');
				removeClass(that.icon , 'sound');
				addClass(that.icon , 'mute');
            } else {
                that.media.muted = true;
				//qiushao改:2017-07-26
                //that.icon.setAttribute('src', that.url + '/assets/mute48.png');
				removeClass(that.icon , 'sound');
				addClass(that.icon , 'mute');
            }
            that.media.volume = that.picker.value / 100;
        };

        // Private functions
        show = function (displaying) {
            that.picker.setAttribute('style', 'background: transparent; width: 32px; ' +
                                              'height: 100px; position: absolute; bottom: 90%; ' +
                                              'z-index: 1;' + that.div.offsetHeight + 'px; ' +
                                              'right: 0px; -webkit-appearance: slider-vertical; ' +
                                              'display: ' + displaying);
        };

        mute = function () {
			//qiushao改:2017-07-26
            //that.icon.setAttribute('src', that.url + '/assets/mute48.png');
			removeClass(that.icon , 'sound');
			addClass(that.icon , 'mute');			
            lastVolume = that.picker.value;
            that.picker.value = 0;
            that.media.volume = 0;
            that.media.muted = true;
        };

        unmute = function () {  
			//qiushao改:2017-07-26
			//that.icon.setAttribute('src', that.url + '/assets/sound48.png');
			removeClass(that.icon , 'mute');
			addClass(that.icon , 'sound');
            that.picker.value = lastVolume;
            that.media.volume = that.picker.value / 100;
            that.media.muted = false;
        };

        that.icon.onclick = function () {
            if (that.media.muted) {
                unmute();
            } else {
                mute();
            }
        };

        // Public functions
        that.div.onmouseover = function () {
            show('block');
        };

        that.div.onmouseout = function () {
            show('none');
        };

        show('none');

    } else {

        mute = function () {
            that.media.muted = true;
			//qiushao改:2017-07-26
			//that.icon.setAttribute('src', that.url + '/assets/mute48.png');
			removeClass(that.icon , 'sound');
			addClass(that.icon , 'mute');        
            that.stream.stream.getAudioTracks()[0].enabled = false;
        };

        unmute = function () {
            that.media.muted = false;
			//qiushao改:2017-07-26
			//that.icon.setAttribute('src', that.url + '/assets/sound48.png');
			removeClass(that.icon , 'mute');
			addClass(that.icon , 'sound');  

            that.stream.stream.getAudioTracks()[0].enabled = true;
        };

        that.icon.onclick = function () {
            if (that.media.muted) {
                unmute();
            } else {
                mute();
            }
        };
    }
    document.getElementById(that.elementID).appendChild(that.div);
	
	
	/**qiushao改:2017-07-26 class方法*/
	function removeClass(elem, cls){
		if(hasClass(elem, cls)){
			var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, '') + ' ';
			while(newClass.indexOf(' ' + cls + ' ') >= 0){
				newClass = newClass.replace(' ' + cls + ' ', ' ');
			}
			elem.className = newClass.replace(/^\s+|\s+$/g, '');
		}
	}
	function addClass(elem, cls){
		if(!hasClass(elem, cls)){
			elem.className += ' ' + cls;
		}
	}
	function hasClass(elem, cls){
		cls = cls || '';
		if(cls.replace(/\s/g, '').length == 0) return false;
		return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
	}

    return that;
};
/**
 * SDK常量
 * @class L.Constant
 * @description   提供常量存储对象
 * @author QiuShao
 * @date 2017/7/29
 */
'use strict';
var L = L || {};
L.Constant = (function () {
    return {
		roomError:{
			ROOMCONNECTERROR: 0, //room-error：房间连接错误（room-connect）
			GETCONFIGERROR: 1 ,  //room-error：获取配置信息错误(getconfig)
			GETFILELISTERROR: 2 ,  //room-error：获取文件列表错误(getfilelist)
		},
        getUserMedia:{
			SUCCESS_ONLY_VIDEO:1 , //getUserMedia 成功，只获取到video
			SUCCESS_ONLY_AUDIO:2 , //getUserMedia 成功，只获取到audio
			SUCCESS_ALL:3 , //getUserMedia 成功，audio和video都获取到了
			SUCCESS_NOT_ALL:4 , //getUserMedia 成功，audio和video都获取不到
			FAILURE_ONLY_VIDEO:-1 , //getUserMedia 失败，只获取video失败
			FAILURE_ONLY_AUDIO:-2 , //getUserMedia 失败，只获取audio失败
			FAILURE_ALL:-3 ,//getUserMedia 失败，获取audio和video失败
			FAILURE_USERMEDIA_AGAIN_ONLY_GET_AUDIO:0 ,//getUserMedia 失败，重新只获取audio而不获取video
			FAILURE_USERMEDIA_AGAIN_ONLY_GET_VIDEO:0 ,//getUserMedia 失败，重新只获取video而不获取aduio
		},
        accessDenied:{
			streamFail:0 , //获取流失败
			notAudioAndVideo:1 , //没有音视频设备
            notAudioAndVideoAndScreenOrUrlNotUndefined:2 , //video、audio、screen都不为真，或者url不是undefined
			ohterError:-1  , //未知的错误
		},
		deviceStorage:{
			audioinput:"audioinputDeviceId" , //localStorage 存储的音频输入设备id
            audiooutput:"audiooutputDeviceId" ,  //localStorage 存储的音频输出设备id
            videoinput:"videoinputDeviceId" ,  //localStorage 存储的视频输入设备id
   	 	},
		streamReconnection:{
            notOnceSuccess:1 , //流的订阅或者发布重连几次后没有一次成功
            midwayReconnectionNotSuccess:2  , //中途udp断了重新连接几次后却没有一次成功的
		},
		getStats:{
			nativeFailure:1 , //是客户端显示的失败
            pcNotGetStats:2 , //pc没有getStats方法
            peerConnectionNotGetStats:3 , //peerConnection没有getStats方法
            getStatsFailure:4 , //peerConnection的getStats失败
            getStatsError:5 , //peerConnection的getStats报错
		},
		udpState:{//udpstate = 1 udp畅通 2 防火墙拦截udp不通（一次都没链接成功）
			ok:1 ,
			notOnceSuccess:2 ,
		},
		localRecord:{
			onlyRecordAudio:0 , //只录制音频
            recordAudioAndVideo:1 , //录制音频和视频
		}
    };
}(L));
/**
 * SDK工具类
 * @class L.Utils
 * @description   提供SDK所需要的工具
 * @author QiuShao
 * @date 2017/7/29
 */
'use strict';
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

L.Utils = ( function () {
    var _handleFunction = undefined ;
    var loged = {
        localStorage:false ,
        sessionStorage:false ,
    };
    _handleFunction = {
         handleMediaPlayOnEvent:function ( mediaElement  , mediaElementId){
             try{
                 L.Utils.removeEvent( mediaElement , 'canplay' ,  _handleFunction.handleMediaPlayOnEvent.bind(null , mediaElement , mediaElementId ) ) ;
                 L.Utils.removeEvent( mediaElement , 'loadedmetadata' ,  _handleFunction.handleMediaPlayOnEvent.bind(null , mediaElement , mediaElementId  ) ) ;
                 L.Utils.removeEvent( mediaElement , 'loadeddata' ,  _handleFunction.handleMediaPlayOnEvent.bind(null , mediaElement , mediaElementId  ) ) ;
                 if(mediaElement && mediaElement.play && typeof mediaElement.play === 'function'){
                     var playHandler = mediaElement.play();
                     if(playHandler && playHandler.catch && typeof playHandler.catch === 'function'){
                         playHandler.catch(function (err) {
                             L.Logger.error('[tk-sdk]media play err:' , L.Utils.toJsonStringify(err)   ,  (mediaElementId ? (' , media element id is '+mediaElementId) : (' media element:')  ) , (!mediaElementId?mediaElement:''));
                         })
                     }
                 }
             }catch (error){
                 L.Logger.error('[tk-sdk]media play error:' ,  L.Utils.toJsonStringify(error)   ,  (mediaElementId ? (' , media element id is '+mediaElementId) : (' media element:')  ) , (!mediaElementId?mediaElement:''));
             }
         },
        handleMediaPauseOnEvent:function ( mediaElement, mediaElementId){
            try{
                L.Utils.removeEvent( mediaElement , 'canplay' ,  _handleFunction.handleMediaPauseOnEvent.bind(null , mediaElement , mediaElementId ) ) ;
                L.Utils.removeEvent( mediaElement , 'loadedmetadata' ,  _handleFunction.handleMediaPauseOnEvent.bind(null , mediaElement , mediaElementId  ) ) ;
                L.Utils.removeEvent( mediaElement , 'loadeddata' ,  _handleFunction.handleMediaPauseOnEvent.bind(null , mediaElement , mediaElementId  ) ) ;
                if(mediaElement && mediaElement.pause && typeof mediaElement.pause === 'function'){
                    var pauseHandler = mediaElement.pause();
                    if(pauseHandler && pauseHandler.catch && typeof pauseHandler.catch === 'function'){
                        pauseHandler.catch(function (err) {
                            L.Logger.error('[tk-sdk]media pause err:' , L.Utils.toJsonStringify(err)   ,  (mediaElementId ? (' , media element id is '+mediaElementId) : (' media element:')  ) , (!mediaElementId?mediaElement:''));
                        })
                    }
                }
            }catch (error){
                L.Logger.error('[tk-sdk]media pause error:' ,  L.Utils.toJsonStringify(error)   ,  (mediaElementId ? (' , media element id is '+mediaElementId) : (' media element:')  ) , (!mediaElementId?mediaElement:''));
            }
        }
    };
    return {
        /**绑定事件
         @method addEvent
         @param   {element} element 添加事件元素
         {string} eType 事件类型
         {Function} handle 事件处理器
         {Bollean} bol false 表示在事件第三阶段（冒泡）触发，true表示在事件第一阶段（捕获）触发。
         */
        addEvent:function(element, eType, handle, bol ){
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
        removeEvent:function(element, eType, handle, bol ) {
            bol = (bol!=undefined && bol!=null)?bol:false ;
            if(element.removeEventListener){
                element.removeEventListener(eType, handle, bol);
            }else if(element.detachEvent){
                element.detachEvent("on"+eType, handle);
            }else{
                element["on"+eType] = null;
            }
        },
        /*toStringify*/
        toJsonStringify:function (json , isChange) {
            isChange = isChange!=undefined?isChange:true;
            if(!isChange){
                return json ;
            }
            if(!json){
                return json ;
            }
            try{
                if( typeof  json !== 'object'){
                    // L.Logger.debug('[tk-sdk]toJsonStringify:json must is object!');
                    return json ;
                }
                var jsonString = JSON.stringify(json);
                if(jsonString){
                    json = jsonString ;
                }else{
                    L.Logger.debug('[tk-sdk]toJsonStringify:data is not json!');
                }
            }catch (e){
                L.Logger.debug('[tk-sdk]toJsonStringify:data is not json!');
            }
            return json ;
        },
        /*toParse*/
        toJsonParse:function (jsonStr , isChange) {
            isChange = isChange!=undefined?isChange:true;
            if(!isChange){
                return jsonStr ;
            }
            if(!jsonStr){
                return jsonStr ;
            }
            try{
                if( typeof  jsonStr !== 'string'){
                    // L.Logger.debug('[tk-sdk]toJsonParse:jsonStr must is string!');
                    return jsonStr ;
                }
                var json =  JSON.parse(jsonStr);
                if(json){
                    jsonStr = json;
                }else{
                    L.Logger.debug('[tk-sdk]toJsonParse:data is not json string!');
                }
            }catch (e){
                L.Logger.debug('[tk-sdk]toJsonParse:data is not json string!');
            }
            return jsonStr ;
        },
        /**
         * 加密函数
         * @param str 待加密字符串
         * @returns {string}
         */
        encrypt: function(str , encryptRandom ) {
            if(!str){return str;}
            encryptRandom = encryptRandom != undefined ? encryptRandom : 'talk_2017_@beijing' ;
            var out = L.hex64Instance.enc(str);
            out = encryptRandom + out + encryptRandom ;
            return out
        },
        /**
         * 解密函数
         * @param str 待解密字符串
         * @returns {string}*/
        decrypt: function(str , encryptRandom ){
            if(!str){return str;}
            encryptRandom = encryptRandom != undefined ? encryptRandom : 'talk_2017_@beijing' ;
            var regExp = new RegExp( encryptRandom , 'gm' ) ;
            str = str.replace( regExp , '' );
            var out = L.hex64Instance.dec(str);
            return out
        },
        /*媒体文件的播放*/
        mediaPlay:function(mediaElement){
            var mediaElementId = undefined ;
            if(mediaElement && typeof mediaElement === 'string'){
                mediaElement = document.getElementById(mediaElement);
            }else if(mediaElement &&  /(audio|video)/g.test(mediaElement.nodeName.toLowerCase()) && mediaElement.getAttribute && typeof mediaElement.getAttribute === 'function'){
                mediaElementId = mediaElement.getAttribute('id');
            }
            if(mediaElement &&  /(audio|video)/g.test(mediaElement.nodeName.toLowerCase()) ){
                if(mediaElement.readyState !== 0){
                    _handleFunction.handleMediaPlayOnEvent(mediaElement , mediaElementId);
                }else{
                    L.Utils.removeEvent( mediaElement , 'canplay' ,  _handleFunction.handleMediaPlayOnEvent.bind(null , mediaElement , mediaElementId ) ) ;
                    L.Utils.removeEvent( mediaElement , 'loadedmetadata' ,  _handleFunction.handleMediaPlayOnEvent.bind(null , mediaElement , mediaElementId  ) ) ;
                    L.Utils.removeEvent( mediaElement , 'loadeddata' ,  _handleFunction.handleMediaPlayOnEvent.bind(null , mediaElement , mediaElementId  ) ) ;
                    L.Utils.addEvent(mediaElement  , 'canplay'  , _handleFunction.handleMediaPlayOnEvent.bind(null , mediaElement  , mediaElementId ) ) ;
                    L.Utils.addEvent(mediaElement  , 'loadedmetadata'  , _handleFunction.handleMediaPlayOnEvent.bind(null , mediaElement , mediaElementId  ) ) ;
                    L.Utils.addEvent(mediaElement  , 'loadeddata'  , _handleFunction.handleMediaPlayOnEvent.bind(null , mediaElement  , mediaElementId ) ) ;
                }
            }
        },
        /*媒体文件的播放*/
        mediaPause:function(mediaElement){
            var mediaElementId = undefined ;
            if(mediaElement && typeof mediaElement === 'string'){
                mediaElement = document.getElementById(mediaElement);
            }else if(mediaElement &&  /(audio|video)/g.test(mediaElement.nodeName.toLowerCase()) && mediaElement.getAttribute && typeof mediaElement.getAttribute === 'function'){
                mediaElementId = mediaElement.getAttribute('id');
            }
            if(mediaElement &&  /(audio|video)/g.test(mediaElement.nodeName.toLowerCase()) ){
                if(mediaElement.readyState !== 0){
                    _handleFunction.handleMediaPauseOnEvent(mediaElement , mediaElementId);
                }else{
                    L.Utils.removeEvent( mediaElement , 'canplay' ,  _handleFunction.handleMediaPauseOnEvent.bind(null , mediaElement , mediaElementId ) ) ;
                    L.Utils.removeEvent( mediaElement , 'loadedmetadata' ,  _handleFunction.handleMediaPauseOnEvent.bind(null , mediaElement , mediaElementId  ) ) ;
                    L.Utils.removeEvent( mediaElement , 'loadeddata' ,  _handleFunction.handleMediaPauseOnEvent.bind(null , mediaElement , mediaElementId  ) ) ;
                    L.Utils.addEvent(mediaElement  , 'canplay'  , _handleFunction.handleMediaPauseOnEvent.bind(null , mediaElement  , mediaElementId ) ) ;
                    L.Utils.addEvent(mediaElement  , 'loadedmetadata'  , _handleFunction.handleMediaPauseOnEvent.bind(null , mediaElement , mediaElementId  ) ) ;
                    L.Utils.addEvent(mediaElement  , 'loadeddata'  , _handleFunction.handleMediaPauseOnEvent.bind(null , mediaElement  , mediaElementId ) ) ;
                }
            }
        },
        /*本地存储*/
        localStorage:{
            setItem:function (key,value) {
                try{
                    if(window.localStorage){
                        if(window.localStorage.setItem){
                            window.localStorage.setItem(key , value);
                        }else{
                            L.Logger.warning('[tk-sdk]Browser does not support localStorage.setItem , key is '+key+' , value is '+value+'!');
                        }
                    }else{
                        if(!loged.localStorage){
                            loged.localStorage = true ;
                            L.Logger.warning('[tk-sdk]Browser does not support localStorage!');
                        }
                    }
                }catch (err){
                    if(!loged.localStorage){
                        loged.localStorage = true ;
                        L.Logger.warning('[tk-sdk]Browser does not support localStorage , error info:' , L.Utils.toJsonStringify(err) );
                    }
                }
            },
            getItem:function (key) {
                try{
                    if(window.localStorage){
                        if(window.localStorage.getItem){
                           return window.localStorage.getItem(key);
                        }else{
                            L.Logger.warning('[tk-sdk]Browser does not support localStorage.getItem , key is '+key+' !');
                            return "" ;
                        }
                    }else{
                        if(!loged.localStorage){
                            loged.localStorage = true ;
                            L.Logger.warning('[tk-sdk]Browser does not support localStorage!');
                        }
                        return "" ;
                    }
                }catch (err){
                    if(!loged.localStorage){
                        loged.localStorage = true ;
                        L.Logger.warning('[tk-sdk]Browser does not support localStorage , error info:' , L.Utils.toJsonStringify(err) );
                    }
                    return "" ;
                }
            }
        },
        /*会话存储*/
        sessionStorage:{
            setItem:function (key,value) {
                try{
                    if(window.sessionStorage){
                        if(window.sessionStorage.setItem){
                            window.sessionStorage.setItem(key , value);
                        }else{
                            L.Logger.warning('[tk-sdk]Browser does not support sessionStorage.setItem , key is '+key+' , value is '+value+'!');
                        }
                    }else{
                        if(!loged.sessionStorage){
                            loged.sessionStorage = true ;
                            L.Logger.warning('[tk-sdk]Browser does not support sessionStorage!');
                        }
                    }
                }catch (err){
                    if(!loged.sessionStorage){
                        loged.sessionStorage = true ;
                        L.Logger.warning('[tk-sdk]Browser does not support sessionStorage , error info:' , L.Utils.toJsonStringify(err) );
                    }
                }
            },
            getItem:function (key) {
                try{
                    if(window.sessionStorage){
                        if(window.sessionStorage.getItem){
                            return window.sessionStorage.getItem(key);
                        }else{
                            L.Logger.warning('[tk-sdk]Browser does not support sessionStorage.getItem , key is '+key+' !');
                            return "" ;
                        }
                    }else{
                        if(!loged.sessionStorage){
                            loged.sessionStorage = true ;
                            L.Logger.warning('[tk-sdk]Browser does not support sessionStorage!');
                        }
                        return "" ;
                    }
                }catch (err){
                    if(!loged.sessionStorage){
                        loged.sessionStorage = true ;
                        L.Logger.warning('[tk-sdk]Browser does not support sessionStorage , error info:' , L.Utils.toJsonStringify(err) );
                    }
                    return "" ;
                }
            }
        }
    };
}(L));/**
 * 本地设备管理类
 * @class AVMgr
 * @description   提供设备的枚举，设备流的获取以及切换等功能
 * @author QiuShao
 * @date 2017/7/29
 */
'use strict';
var TK = TK || {};
TK.mediaStream = undefined ;
TK.AVMgr = (function () {
    var that = {} ;
    that.room_video_width = 320 ;
    that.room_video_height = 240 ;
    that.room_video_fps = 10 ;
    that.streamJson = {
        selectStream:undefined ,
        // useStream:undefined ,
    };
    that.setAVMgrProperty = function (key_value_json) { //设置AVMgr的属性值
      for (var key in key_value_json){
          if(that.hasOwnProperty(key)){
              that[key] =key_value_json[key] ;
          }
      }
    };
    var _getMediaFromInner = function (config , callback , error) {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(config)
                .then(callback)
                .catch(error) ;
            /*
             AbortError［中止错误］
             尽管用户和操作系统都授予了访问设备硬件的权利，而且未出现可能抛出NotReadableError异常的硬件问题，但仍然有一些问题的出现导致了设备无法被使用。
             NotAllowedError［拒绝错误］
             用户拒绝了当前的浏览器实例的访问请求；或者用户拒绝了当前会话的访问；或者用户在全局范围内拒绝了所有媒体访问请求。
             较旧版本的规范使用了SecurityError；但在新版本当中SecurityError被赋予了新的意义。
             NotFoundError［找不到错误］
             找不到满足请求参数的媒体类型。
             NotReadableError［无法读取错误］
             尽管用户已经授权使用相应的设备，操作系统上某个硬件、浏览器或者网页层面发生的错误导致设备无法被访问。
             OverConstrainedError［无法满足要求错误］
             指定的要求无法被设备满足，此异常是一个类型为OverconstrainedError的对象，拥有一个constraint属性，这个属性包含了当前无法被满足的constraint对象，还拥有一个message属性，包含了阅读友好的字符串用来说明情况。
             因为这个异常甚至可以在用户尚未授权使用当前设备的情况下抛出，所以应当可以当作一个探测设备能力属性的手段［fingerprinting surface］。
             SecurityError［安全错误］
             在getUserMedia() 被调用的 Document 上面，使用设备媒体被禁止。这个机制是否开启或者关闭取决于单个用户的偏好设置。
             TypeError［类型错误］
             constraints对象未设置［空］，或者都被设置为false。
             */
        }else{
            navigator.getMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
            navigator.getMedia(config, callback, error);
        }
    };
    var _checkGetUserMedia = function(callback , videoinputDeviceId , audioinputDeviceId ){
        L.Logger.debug('[tk-sdk]checkGetUserMediaing , videoinputDeviceId:'+videoinputDeviceId +' , audioinputDeviceId:'+audioinputDeviceId);
        if(!(callback && typeof callback === 'function' ) ){
            L.Logger.error('[tk-sdk]checkGetUserMedia callback must function');
        }
        var isCheckVideoFinshed = false , isCheckAudioFinshed = false , successVideoinputId  ,  successAudioinputId;
        var _callback = function () {
            if(isCheckVideoFinshed && isCheckAudioFinshed){
                callback({
                    videoinput:{old:videoinputDeviceId , now:successVideoinputId } ,
                    audioinput:{old:audioinputDeviceId , now:successAudioinputId }
                });
            }
        };
        var _videocallback = function (_successVideoinputId) {
            L.Logger.debug('[tk-sdk]checkGetUserMedia video finshed , videoinputDeviceId:'+videoinputDeviceId + ' , successVideoinputId:'+_successVideoinputId);
            isCheckVideoFinshed = true ;
            successVideoinputId = _successVideoinputId ;
            _callback();
        };
        var _audiocallback = function (_successAudioinputId) {
            L.Logger.debug('[tk-sdk]checkGetUserMedia audio finshed , audioinputDeviceId:'+audioinputDeviceId + ' , successAudioinputId:'+_successAudioinputId);
            isCheckAudioFinshed = true ;
            successAudioinputId = _successAudioinputId ;
            _callback();
        };

        if(videoinputDeviceId){
            _getMediaFromInner({ audio:false ,video:{deviceId: {exact: videoinputDeviceId}} } , function (stream) {
                //_stopStreamTracks(stream,true,false);
                _videocallback(videoinputDeviceId);
            } , function (error) {
                that.enumerateDevices( function (devicesInfo) {
                    if(devicesInfo && devicesInfo.devices && devicesInfo.devices.videoinput){
                        var videoinputDevices = devicesInfo.devices.videoinput ;
                        if(videoinputDevices && videoinputDevices.length>0){
                            var deviceIdJson = videoinputDevices[0] ;
                            var _handlerCheckVideoDeviceCallback = function (deviceId) {
                                _getMediaFromInner({ audio:false ,video:{deviceId: {exact: deviceId}} } , function (stream) {
                                    videoinputDevices.shift();
                                    //_stopStreamTracks(stream,true,false);
                                    _videocallback(deviceId);
                                } , function (error) {
                                    videoinputDevices.shift();
                                    deviceIdJson = videoinputDevices[0] ;
                                    if(deviceIdJson){
                                        _handlerCheckVideoDeviceCallback(deviceIdJson.deviceId);
                                    }else{
                                        _videocallback();
                                    }
                                });
                            };
                            if( deviceIdJson ){
                                _handlerCheckVideoDeviceCallback(deviceIdJson.deviceId);
                            }else{
                                _videocallback();
                            }
                        }else{
                            _videocallback();
                        }
                    }else{
                        _videocallback();
                    }
                });
            } );
        }else{
            _videocallback();
        }
        if(audioinputDeviceId){
            _getMediaFromInner({ video:false ,audio:{deviceId: {exact: audioinputDeviceId}} } , function (stream) {
                //_stopStreamTracks(stream,false,true);
                _audiocallback(audioinputDeviceId);
            } , function (error) {
                that.enumerateDevices( function (devicesInfo) {
                    if(devicesInfo && devicesInfo.devices && devicesInfo.devices.audioinput){
                        var audioinputDevices = devicesInfo.devices.audioinput ;
                        if(audioinputDevices && audioinputDevices.length>0){
                            var deviceIdJson = audioinputDevices[0] ;
                            var _handlerCheckAudioDeviceCallback = function (deviceId) {
                                _getMediaFromInner({ video:false ,audio:{deviceId: {exact: deviceId}} } , function (stream) {
                                    audioinputDevices.shift();
                                    //_stopStreamTracks(stream,false,true);
                                    _audiocallback(deviceId);
                                } , function (error) {
                                    audioinputDevices.shift();
                                    deviceIdJson = audioinputDevices[0] ;
                                    if(deviceIdJson){
                                        _handlerCheckAudioDeviceCallback(deviceIdJson.deviceId);
                                    }else{
                                        _audiocallback();
                                    }
                                });
                            };
                            if( deviceIdJson ){
                                _handlerCheckAudioDeviceCallback(deviceIdJson.deviceId);
                            }else{
                                _audiocallback();
                            }
                        }else{
                            _audiocallback();
                        }
                    }else{
                        _audiocallback();
                    }
                });
            } );
        }else{
            _audiocallback();
        }
    };

    var _getUserMedia =  function ( callbackHandler ,errorHandler , config , specifiedConstraints ) {
        var currUserMediaConfig = undefined , _callback , _error , _getUserMediaByFfConfig , _initConfig;
         _callback = function (stream) {
            var currUserMediaConfigJson = currUserMediaConfig && typeof currUserMediaConfig === 'string' ?L.Utils.toJsonParse(currUserMediaConfig):currUserMediaConfig;
             stream.customdata_createID = new Date().getTime();
             stream.customdata_deviceJsonId = {} ;
            if(currUserMediaConfigJson){
                if( currUserMediaConfigJson.video && typeof currUserMediaConfigJson.video === 'object' ){
                    var currentVideoinputDeviceId = typeof currUserMediaConfigJson.video.deviceId  === 'object' ? currUserMediaConfigJson.video.deviceId.exact:currUserMediaConfigJson.video.deviceId ;
                    stream.customdata_deviceJsonId.videoinput = currentVideoinputDeviceId ;
                }
                if( currUserMediaConfigJson.audio && typeof currUserMediaConfigJson.audio === 'object' ){
                    var currentAudioinputDeviceId = typeof currUserMediaConfigJson.audio.deviceId  === 'object' ? currUserMediaConfigJson.audio.deviceId.exact:currUserMediaConfigJson.audio.deviceId ;
                    stream.customdata_deviceJsonId.audioinput = currentAudioinputDeviceId ;
                }
            }
            that.streamJson.selectStream = stream ;
            var customdata_tracksInfo = {
                videoTracks:true ,
                audioTracks:true ,
            };
            if(stream){
                var videoTracks = stream.getVideoTracks ? stream.getVideoTracks() : undefined;
                var audioTracks = stream.getAudioTracks ?  stream.getAudioTracks() : undefined;
                if( !(videoTracks && videoTracks.length>0 ) ){
                    customdata_tracksInfo.videoTracks = false ;
                    L.Logger.warning('[tk-sdk]getUserMedia stream is  not videoTracks  , currUserMediaConfig info:'+currUserMediaConfig+'!'  );
                }
                if( !(audioTracks && audioTracks.length>0 ) ){
                    customdata_tracksInfo.audioTracks = false ;
                    L.Logger.warning('[tk-sdk]getUserMedia stream is  not audioTracks  , currUserMediaConfig info:'+currUserMediaConfig+'!'  );
                }
            }else{
                L.Logger.error('[tk-sdk]getUserMedia stream is not exist!');
                customdata_tracksInfo.videoTracks = false ;
                customdata_tracksInfo.audioTracks = false ;
            }
            var args = [];
            args.push(stream);
            args.push(customdata_tracksInfo);
            stream.customdata_tracksInfo = customdata_tracksInfo ;
            if(specifiedConstraints && specifiedConstraints.externalJson &&  specifiedConstraints.externalJson.getUserMediaFailureCode !== undefined ){
                stream.getUserMediaFailureCode = specifiedConstraints.externalJson.getUserMediaFailureCode ;
            }
            if(specifiedConstraints.isNeedCheckChangeLocalStream && specifiedConstraints.deviceInfo.initDeviceId.audioinput !== stream.customdata_deviceJsonId.audioinput){
                L.Logger.info('[tk-sdk]getUserMedia changed audioinput device , old device id is '+ specifiedConstraints.deviceInfo.initDeviceId.audioinput + ' , now device id is '+ stream.customdata_deviceJsonId.audioinput  );
                L.Utils.localStorage.setItem(L.Constant.deviceStorage.audioinput, stream.customdata_deviceJsonId.audioinput || "" );
            }
             if(specifiedConstraints.isNeedCheckChangeLocalStream && specifiedConstraints.deviceInfo.initDeviceId.videoinput !== stream.customdata_deviceJsonId.videoinput){
                 L.Logger.info('[tk-sdk]getUserMedia changed videoinput device , old device id is '+ specifiedConstraints.deviceInfo.initDeviceId.videoinput + ' , now device id is '+ stream.customdata_deviceJsonId.videoinput  );
                 L.Utils.localStorage.setItem(L.Constant.deviceStorage.videoinput, stream.customdata_deviceJsonId.videoinput || "" );
             }
            if( specifiedConstraints && specifiedConstraints.dispatchEvent){ //如果需要派发getUserMedia结果事件
                var code = L.Constant.getUserMedia.SUCCESS_ALL ;
                if( !customdata_tracksInfo.videoTracks &&  !customdata_tracksInfo.audioTracks ){
                    code = L.Constant.getUserMedia.SUCCESS_NOT_ALL ;
                }else if(!customdata_tracksInfo.videoTracks){
                    code = L.Constant.getUserMedia.SUCCESS_ONLY_AUDIO ;
                }else if(!customdata_tracksInfo.audioTracks){
                    code = L.Constant.getUserMedia.SUCCESS_ONLY_VIDEO ;
                }
                if(TK && TK.coreEventController){
                    TK.coreEventController.dispatchEvent( {type:'getUserMedia_success' , message:{mediaStream:stream , customdata_tracksInfo:customdata_tracksInfo , code:code , externalJson:specifiedConstraints.externalJson }} , false );
                }
            }
            callbackHandler.apply(callbackHandler, args);
        };
         _error = function (err) {
            L.Logger.error("[tk-sdk]getUserMedia error info:" + ' name is ' + err.name  + ' , message is '+err.message+' , constraintName is '+err.constraintName  );
            var currUserMediaConfigJson = currUserMediaConfig && typeof currUserMediaConfig === 'string' ?L.Utils.toJsonParse(currUserMediaConfig):currUserMediaConfig;
            var initConfig = _initConfig && typeof _initConfig === 'string' ?L.Utils.toJsonParse(_initConfig):_initConfig;
            if(specifiedConstraints.isDemotionLocalStream){
                if( currUserMediaConfigJson.video && typeof currUserMediaConfigJson.video  === 'object' && !specifiedConstraints.deviceInfo.demotion.videoinput  ){
                    specifiedConstraints.deviceInfo.demotion.videoinput = true ;
                    initConfig.video = false ;
                    specifiedConstraints.externalJson.getUserMediaFailureCode =  L.Constant.getUserMedia.FAILURE_USERMEDIA_AGAIN_ONLY_GET_AUDIO ;
                    L.Logger.warning( '[tk-sdk]Gets the data stream failed and now only gets the audio device stream , oldUserMediaConfig info:'+currUserMediaConfig+' , nowUserMediaConfig info:'+ L.Utils.toJsonStringify(initConfig)+'!'  );
                    if( specifiedConstraints && specifiedConstraints.dispatchEvent){ //如果需要派发getUserMedia结果事件
                        if(TK && TK.coreEventController){
                            TK.coreEventController.dispatchEvent( {type:'getUserMedia_failure_reGetOnlyAudioStream' , message:{errorMsg:errorMsg , code: L.Constant.getUserMedia.FAILURE_USERMEDIA_AGAIN_ONLY_GET_AUDIO , externalJson:specifiedConstraints.externalJson }} , false );
                        }
                    }
                    _getUserMediaByFfConfig(initConfig);
                    return ;
                }else if( currUserMediaConfigJson.video && typeof currUserMediaConfigJson.video  === 'object' && !specifiedConstraints.deviceInfo.demotion.audioinput ){
                    specifiedConstraints.deviceInfo.demotion.audioinput = true ;
                    initConfig.audio = false ;
                    specifiedConstraints.externalJson.getUserMediaFailureCode =  L.Constant.getUserMedia.FAILURE_USERMEDIA_AGAIN_ONLY_GET_VIDEO ;
                    L.Logger.warning( '[tk-sdk]Gets the data stream failed and now only gets the video device stream , oldUserMediaConfig info:'+currUserMediaConfig+' , nowUserMediaConfig info:'+ L.Utils.toJsonStringify(initConfig)+'!'  );
                    if( specifiedConstraints && specifiedConstraints.dispatchEvent){ //如果需要派发getUserMedia结果事件
                        if(TK && TK.coreEventController){
                            TK.coreEventController.dispatchEvent( {type:'getUserMedia_failure_reGetOnlyVideoStream' , message:{errorMsg:errorMsg , code: L.Constant.getUserMedia.FAILURE_USERMEDIA_AGAIN_ONLY_GET_VIDEO , externalJson:specifiedConstraints.externalJson }} , false );
                        }
                    }
                    _getUserMediaByFfConfig(initConfig);
                    return ;
                }
            }

             var errorMsg = '[tk-sdk]Gets the data stream failed[video , audio] ,currUserMediaConfig info:'+currUserMediaConfig+'!';
             L.Logger.warning( errorMsg );
             specifiedConstraints.externalJson.getUserMediaFailureCode =  L.Constant.getUserMedia.FAILURE_ALL  ;
             if( specifiedConstraints && specifiedConstraints.dispatchEvent){ //如果需要派发getUserMedia结果事件
                 if(TK && TK.coreEventController){
                     TK.coreEventController.dispatchEvent( {type:'getUserMedia_failure' , message:{errorMsg:errorMsg , code: L.Constant.getUserMedia.FAILURE_ALL , externalJson:specifiedConstraints.externalJson }} , false);
                 }
             }
             if( errorHandler && typeof errorHandler === 'function'){
                 var args = [];
                 for (var i = 0; i < arguments.length; i++) {
                     args[i] = arguments[i];
                 }
                 if(specifiedConstraints && specifiedConstraints.externalJson &&  specifiedConstraints.externalJson.getUserMediaFailureCode !== undefined ){
                     args.push( {getUserMediaFailureCode: specifiedConstraints.externalJson.getUserMediaFailureCode} );
                 }
                 errorHandler.apply(errorHandler, args);
             }
        };
         _getUserMediaByFfConfig = function (_userMediaConfig) {
            currUserMediaConfig = _userMediaConfig && typeof _userMediaConfig === 'object' ?L.Utils.toJsonStringify(_userMediaConfig):_userMediaConfig;
            if(!_initConfig){
                _initConfig = currUserMediaConfig ;
            }
            /*if(specifiedConstraints.isStopLocalStream && TK.default_stream && TK.default_stream.stream && TK.default_stream.stream.getTracks ){
                 _stopStreamTracks(TK.default_stream.stream);
            }
            if(!(that.streamJson.selectStream && TK.default_stream && TK.default_stream.stream && TK.default_stream.stream.customdata_createID === that.streamJson.selectStream.customdata_createID) ){
                _stopStreamTracks(that.streamJson.selectStream);
            }*/
      /*      if(specifiedConstraints.isStopLocalStream && TK.default_stream && TK.default_stream.stream && TK.default_stream.stream.getTracks ){
                _stopStreamTracks(TK.default_stream.stream);
            }else if(that.streamJson.selectStream && that.streamJson.selectStream.getTracks ){
                if(TK.default_stream && TK.default_stream.stream && TK.default_stream.stream.customdata_deviceJsonId && that.streamJson.selectStream.customdata_deviceJsonId){
                    var stopVideoTrack = TK.default_stream.stream.customdata_deviceJsonId.videoinput !== that.streamJson.selectStream.customdata_deviceJsonId.videoinput ;
                    var stopAudioTrack = TK.default_stream.stream.customdata_deviceJsonId.audioinput !== that.streamJson.selectStream.customdata_deviceJsonId.audioinput;
                    _stopStreamTracks(that.streamJson.selectStream , stopVideoTrack , stopAudioTrack );
                }else{
                    _stopStreamTracks(that.streamJson.selectStream);
                }
            }*/
            _getMediaFromInner(_userMediaConfig , _callback , _error);
        };
        _getUserMediaByFfConfig(config);
    };

    var _getUserMediaConfig = function (config , specifiedConstraints ) {
        var userMediaConfig = { video:{} , audio: {} };
        if(config){
            if(config.audio !== undefined){
                userMediaConfig.audio = config.audio ;
            }
            if(config.video !== undefined){
                userMediaConfig.video = config.video ;
            }
            if( userMediaConfig.audio && typeof  userMediaConfig.audio === 'object' && userMediaConfig.audio.sourceId !== undefined){
                userMediaConfig.audio.deviceId = userMediaConfig.audio.sourceId ;
                delete userMediaConfig.audio.sourceId ;
            }
            if( userMediaConfig.video && typeof  userMediaConfig.video === 'object' && userMediaConfig.video.sourceId !== undefined){
                userMediaConfig.video.deviceId = userMediaConfig.video.sourceId ;
                delete userMediaConfig.video.sourceId ;
            }
        }else{
            userMediaConfig.audio.deviceId =  L.Utils.localStorage.getItem(L.Constant.deviceStorage.audioinput) ;
            userMediaConfig.video.deviceId =  L.Utils.localStorage.getItem(L.Constant.deviceStorage.videoinput) ;
        }
        if( userMediaConfig.video && typeof userMediaConfig.video === 'object'){
            var videoCfg = {
                idealWidth:that.room_video_width || 320 ,
                maxWidth:that.room_video_width || 320 ,
                idealHeight:that.room_video_height || 240 ,
                maxHeight:that.room_video_height || 240 ,
                idealFrameRate: Number(that.room_video_fps || 10)  ,
                maxFrameRate: Number(that.room_video_fps || 10) ,
            };
            if(userMediaConfig.video.width === undefined){
                userMediaConfig.video.width = {ideal: videoCfg.idealWidth, max: videoCfg.maxWidth};
            }
            if(userMediaConfig.video.height === undefined){
                userMediaConfig.video.height = {ideal: videoCfg.idealHeight, max: videoCfg.maxHeight};
            }
            if(userMediaConfig.video.frameRate === undefined){
                userMediaConfig.video.frameRate = {ideal: videoCfg.idealFrameRate, max: videoCfg.maxFrameRate};
            }
        }
        if(specifiedConstraints.audio.sourceId){
            userMediaConfig.audio = typeof userMediaConfig.audio === 'object' ? userMediaConfig.audio : {} ;
            userMediaConfig.audio.deviceId = specifiedConstraints.audio.sourceId ;
        }else if(specifiedConstraints.audio.deviceId){
            userMediaConfig.audio = typeof userMediaConfig.audio === 'object' ? userMediaConfig.audio : {} ;
            userMediaConfig.audio.deviceId = specifiedConstraints.audio.deviceId ;
        }
        if(specifiedConstraints.video.sourceId){
            userMediaConfig.video = typeof userMediaConfig.video === 'object' ? userMediaConfig.video : {} ;
            userMediaConfig.video.deviceId = specifiedConstraints.video.sourceId ;
        }else  if(specifiedConstraints.video.deviceId){
            userMediaConfig.video = typeof userMediaConfig.video === 'object' ? userMediaConfig.video : {} ;
            userMediaConfig.video.deviceId = specifiedConstraints.video.deviceId ;
        }
        if(specifiedConstraints.exclude && specifiedConstraints.exclude.audio ){
            userMediaConfig.audio = false ;
        }else if(userMediaConfig.audio && typeof userMediaConfig.audio === 'object' && userMediaConfig.audio.deviceId !== undefined){
            //userMediaConfig.audio.deviceId = userMediaConfig.audio.deviceId ;//exact:
            userMediaConfig.audio.deviceId = userMediaConfig.audio.deviceId !== 'object'?{exact:userMediaConfig.audio.deviceId}:userMediaConfig.audio.deviceId;
        }
        if(specifiedConstraints.exclude && specifiedConstraints.exclude.video ){
            userMediaConfig.video = false ;
        }else if(userMediaConfig.video && typeof userMediaConfig.video === 'object' && userMediaConfig.video.deviceId !== undefined){
            //userMediaConfig.video.deviceId = userMediaConfig.video.deviceId ;//exact:
            userMediaConfig.video.deviceId = userMediaConfig.video.deviceId !== 'object'?{exact:userMediaConfig.video.deviceId}:userMediaConfig.video.deviceId;
        }
        return userMediaConfig ;
    };

    /*获取设备数据流
     * @method GetUserMedia
     * @params [ callback:function ,error:function , config:object ]
     * */
    that.getUserMedia = function (callback,error , config , specifiedConstraints) {
        specifiedConstraints = specifiedConstraints != undefined && specifiedConstraints!=null  && typeof specifiedConstraints === 'object' ?  specifiedConstraints : { video:{}, audio: {} , exclude:{} } ;
        specifiedConstraints.video  =    specifiedConstraints.video || {} ;
        specifiedConstraints.audio =  specifiedConstraints.audio || {};
        specifiedConstraints.exclude = specifiedConstraints.exclude || {} ;
        specifiedConstraints.externalJson = specifiedConstraints.externalJson || {} ;
        specifiedConstraints.deviceInfo = {initDeviceId:{videoinput:undefined , audioinput:undefined} , demotion:{videoinput:false , audioinput:false}};
        config = _getUserMediaConfig(config , specifiedConstraints);
        if(config.audio && typeof config.audio === 'object'){
            specifiedConstraints.deviceInfo.initDeviceId.audioinput = typeof config.audio.deviceId === 'object'?config.audio.deviceId.exact : config.audio.deviceId ;
        }
        if(config.video && typeof config.video === 'object'){
            specifiedConstraints.deviceInfo.initDeviceId.videoinput = typeof config.video.deviceId === 'object'?config.video.deviceId.exact : config.video.deviceId ;
        }
        if(specifiedConstraints.isNeedCheckChangeLocalStream){
            var  checkAudioinputDeviceId = specifiedConstraints.deviceInfo.initDeviceId.audioinput ,
                 checkVideoinputDeviceId = specifiedConstraints.deviceInfo.initDeviceId.videoinput  ;
            _checkGetUserMedia(function (checkResult) {
                var videoinputCheckResult = checkResult.videoinput ;
                var audioinputCheckResult = checkResult.audioinput ;
                if(config.video && typeof config.video === 'object' && videoinputCheckResult.old !== videoinputCheckResult.now ){
                    if(videoinputCheckResult.now){
                        config.video.deviceId = {exact:videoinputCheckResult.now} ;
                    }else{
                        config.video = false;
                    }
                }else if(!videoinputCheckResult.old){
                    config.video = false;
                }
                if(config.audio && typeof config.audio === 'object' && audioinputCheckResult.old !== audioinputCheckResult.now ){
                    if(audioinputCheckResult.now){
                        config.audio.deviceId = {exact:audioinputCheckResult.now} ;
                    }else{
                        config.audio = false;
                    }
                }else if(!audioinputCheckResult.old){
                    config.audio = false;
                }
                _getUserMedia(callback,error , config , specifiedConstraints);
            } , checkVideoinputDeviceId , checkAudioinputDeviceId );
        }else{
            _getUserMedia(callback,error , config , specifiedConstraints);
        }
    };

    /*枚举设备信息进行分类
     * @method GetUserMedia
     * @params [ callback:function , paramsJson:object ]
     */
    that.enumerateDevices = function (callback , paramsJson) {
        paramsJson = paramsJson || {} ;
        paramsJson.isSetlocalStorage = paramsJson.isSetlocalStorage!=undefined ? paramsJson.isSetlocalStorage : false ;
        var  _enumerateDevices = function (_enumerateDevicesCallback) {
            //List cameras and microphones.
            if (!(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices)) {
                L.Logger.error("[tk-sdk]navigator.mediaDevices.enumerateDevices method not supported.");
                if(_enumerateDevicesCallback && typeof  _enumerateDevicesCallback === "function"){
                    var devices = [] ;
                    _enumerateDevicesCallback(devices);
                }
                return null;
            }
            navigator.mediaDevices.enumerateDevices()
                .then(function(devices) {
                    var devicesJson = {} ;
                    devices.forEach(function(device) {
                        L.Logger.debug('[tk-sdk]'+device.kind + ": " + device.label + " id = " + device.deviceId , device);
                        devicesJson[device.kind] = devicesJson[device.kind] || {} ;
                        devicesJson[device.kind][device.deviceId] = {
                            kind:device.kind ,
                            label:device.label,
                            deviceId:device.deviceId,
                        }
                    });
                    L.Logger.debug('[tk-sdk]enumerateDevices devices:'+  L.Utils.toJsonStringify(devicesJson) ) ;
                    if(_enumerateDevicesCallback && typeof  _enumerateDevicesCallback === "function"){
                        _enumerateDevicesCallback(devices);
                    }
                })
                .catch(function(err) {
                    L.Logger.error('[tk-sdk]enumerateDevices error :'+err.name + ": " + err.message);
                    if(_enumerateDevicesCallback && typeof  _enumerateDevicesCallback === "function"){
                        var devices = [] ;
                        _enumerateDevicesCallback(devices);
                    }
                    throw err ;
                });
        };
         function _handlerEnumerateDevices (devices) {
            var audioinputDeviceId = L.Utils.localStorage.getItem(L.Constant.deviceStorage.audioinput);
            var videoinputDeviceId = L.Utils.localStorage.getItem(L.Constant.deviceStorage.videoinput);
            var audiooutputDeviceId = L.Utils.localStorage.getItem(L.Constant.deviceStorage.audiooutput);
            //L.Logger.debug("devices in enumerateDevices:", devices);
            var devicesTmp = {
                all: {},
                defalut: {},
            };
            var devicesInfo = {
                hasdevice: {
                    "audioinput": false,
                    "audiooutput": false,
                    "videoinput": false
                },
                devices:{
                    "audioinput": [],
                    "audiooutput": [],
                    "videoinput": []
                },
                useDevices:{}
            };
            if(devices && devices.forEach){
                devices.forEach(function(device) {
                    if(device != null) {
                        if( !( device.groupId =="communications" || device.deiceId == "communications" || device.label == "通讯" ) ) {
                            if (device.kind === "audioinput" && device.deviceId === audioinputDeviceId) {
                                devicesInfo.useDevices[device.kind] = device.deviceId;
                            }
                            if (device.kind === "videoinput" && device.deviceId === videoinputDeviceId) {
                                devicesInfo.useDevices[device.kind] = device.deviceId;
                            }
                            if (device.kind === "audiooutput" && device.deviceId === audiooutputDeviceId) {
                                devicesInfo.useDevices[device.kind] = device.deviceId;
                            }
                            devicesTmp.all[device.kind] = device.deviceId;
                            devicesInfo.devices[device.kind].push(device);
                            devicesInfo.hasdevice[device.kind] = true;
                            if (device.deviceId === "default") {
                                devicesTmp.defalut[device.kind] = device.deviceId;
                            }
                        }
                    }
                });
            }
            if(!devicesInfo.useDevices["audioinput"]) {
                devicesInfo.useDevices["audioinput"]  = devicesTmp.defalut["audioinput"] || devicesTmp.all["audioinput"] || "";
            }
            if(!devicesInfo.useDevices["videoinput"]) {
                devicesInfo.useDevices["videoinput"]  =  devicesTmp.defalut["videoinput"] || devicesTmp.all["videoinput"] || "";
            }
            if(!devicesInfo.useDevices["audiooutput"]) {
                devicesInfo.useDevices["audiooutput"]  = devicesTmp.defalut["audiooutput"] || devicesTmp.all["audiooutput"] || "";
            }
            if(L.Utils.localStorage) { //存储设备id到本地存储localStorage中
                if(paramsJson.isSetlocalStorage){
                    L.Utils.localStorage.setItem(L.Constant.deviceStorage.audioinput, devicesInfo.useDevices["audioinput"]);
                    L.Utils.localStorage.setItem(L.Constant.deviceStorage.videoinput, devicesInfo.useDevices["videoinput"]);
                    L.Utils.localStorage.setItem(L.Constant.deviceStorage.audiooutput, devicesInfo.useDevices["audiooutput"]);
                }
            } else {
                L.Logger.error("[tk-sdk]not support localStorage");
            }
            L.Logger.info('[tk-sdk]enumerateDevices devicesInfo:' ,  L.Utils.toJsonStringify(devicesInfo) ) ;
            if(callback && typeof callback === "function") {
                callback(devicesInfo);
            }
        }
        _enumerateDevices(function(devices) {
            _handlerEnumerateDevices(devices);
        });
       /*
       todo 调用getUserMedia导致高清获取不成功
       var _enumerateDevicesGetUserMediaSuccess =  function (stream) {
            _enumerateDevices(function(devices) {
                _handlerEnumerateDevices(devices);
            });
        };
        var _enumerateDevicesGetUserMediaFail = function (error) {
            //L.Logger.debug("[tk-sdk]getUserMedia error on enumerateDevices:" , error) ;
            _enumerateDevices(function(devices) {
                _handlerEnumerateDevices(devices);
            });
        };
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({audio:true , video:true})
                .then(_enumerateDevicesGetUserMediaSuccess)
                .catch(_enumerateDevicesGetUserMediaFail) ;
        }else{
            navigator.getMedia = ( navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
            navigator.getMedia({audio:true , video:true},_enumerateDevicesGetUserMediaSuccess , _enumerateDevicesGetUserMediaFail );
        }*/
    } ;

    /*获取声音探测实例
     * @method getsSoundMeterInstance
     * @params [ audioContext:new window.AudioContext()]
     * @return 声音探测实例SoundMeter
     */
    that.getsSoundMeterInstance = function (audioContext) {
        if(!audioContext){
            L.Logger.error('[tk-sdk]getsSoundMeterInstance audioContext is not exist!');
            return undefined ;
        }
        var SoundMeter =  function (audioContext) {
            var _that = this ;
            _that.audioContext = audioContext;
            _that.instant = 0.0;
            _that.slow = 0.0;
            _that.clip = 0.0;
            _that.script = _that.audioContext.createScriptProcessor(2048, 1, 1);
            var that = _that;
            _that.script.onaudioprocess = function (event) {
                var input = event.inputBuffer.getChannelData(0);
                var i;
                var sum = 0.0;
                var clipcount = 0;
                for (i = 0; i < input.length; ++i) {
                    sum += input[i] * input[i];
                    if (Math.abs(input[i]) > 0.99) {
                        clipcount += 1;
                    }
                }
                that.instant = Math.sqrt(sum / input.length);
                that.slow = 0.95 * that.slow + 0.05 * that.instant;
                that.clip = clipcount / input.length;
            };
            _that.connectToSource = function (stream, callback) {
                L.Logger.debug('SoundMeter connecting');
                try {
                    _that.mic = _that.audioContext.createMediaStreamSource(stream);
                    _that.mic.connect(_that.script);
                    // necessary to make sample run, but should not be.
                    _that.script.connect(_that.audioContext.destination);
                    if (typeof callback !== 'undefined') {
                        callback(null);
                    }
                } catch (e) {
                    L.Logger.error('[tk-sdk]connecToSource error:' , e);
                    if (typeof callback !== 'undefined') {
                        callback(e);
                    }
                }
            };
            _that.stop = function () {
                _that.mic.disconnect();
                _that.script.disconnect();
            };
            return _that ;
        };
        return new SoundMeter(audioContext);
    };

    /*为音视频节点设置扩音器输出
    * @method setElementSinkIdToAudioouputDevice
    * @params [elementArr:array(需要设置音频输出的节点数组)]*/
    that.setElementSinkIdToAudioouputDevice = function (elementArr , audiooutputDeviceId , callback) {
        var audiooutputDeviceId = audiooutputDeviceId ||  L.Utils.localStorage.getItem(L.Constant.deviceStorage.audiooutput );
        if(!audiooutputDeviceId){
            if(callback && typeof callback === 'function'){
                callback(false);
            }
            return ;
        }
        /*if(TK.isTkNative){ //如果是客户端，不调用setSinkId
            if(callback && typeof callback === 'function'){
                callback(false);
            }
            return ;
        }*/
        var finshedNumberJson = {number:0};
        var _setElementSinkId = function (element , index , length) {
            if(element &&  /(audio|video)/g.test(element.nodeName.toLowerCase())  && audiooutputDeviceId){
                if(element.setSinkId){
                    try{
                        element.setSinkId(audiooutputDeviceId)
                            .then(function() {
                                var elementId = element.getAttribute('id');
                                L.Logger.debug('[tk-sdk]Audio output device set to ' + audiooutputDeviceId , (elementId ? (' , element id is '+elementId) : ('  element:')  ) , (!elementId?element:''));
                                finshedNumberJson.number++;
                                if(  finshedNumberJson.number === length && callback && typeof callback === 'function'){
                                    callback(true);
                                }
                            })
                            .catch(function(error) {
                                var errorMessage = undefined;
                                var elementId = element.getAttribute('id');
                                if (error && error.name === 'SecurityError') {
                                    errorMessage = 'You need to use HTTPS for selecting audio output device  '
                                };
                                L.Logger.warning('[tk-sdk]setSinkId error:' , error   , (errorMessage?errorMessage:'') , (elementId ? (' , element id is '+elementId) : ('  element:')  ) , (!elementId?element:'') );
                                finshedNumberJson.number++;
                                if( finshedNumberJson.number === length && callback && typeof callback === 'function'){
                                    callback(false);
                                }
                            });
                    }catch (err){
                        var elementId = element.getAttribute('id');
                        L.Logger.error('[tk-sdk]setSinkId err:' , err , (elementId ? (' , element id is '+elementId) : ('  element:')  ) , (!elementId?element:'') );
                        finshedNumberJson.number++;
                        if( finshedNumberJson.number === length && callback && typeof callback === 'function'){
                            callback(false);
                        }
                    }
                }else{
                    var elementId = element.getAttribute('id');
                    L.Logger.error("[tk-sdk]The browser does not support the setSinkId method,audiooutputDeviceId :" ,audiooutputDeviceId , (elementId ? (' , element id is '+elementId) : ('  element:')  ) , (!elementId?element:'')  );
                    finshedNumberJson.number++;
                    if( finshedNumberJson.number === length && callback && typeof callback === 'function'){
                        callback(false);
                    }
                }
            }else{
                finshedNumberJson.number++;
                if( finshedNumberJson.number === length && callback && typeof callback === 'function'){
                    callback(false);
                }
            }
        };

        if(!elementArr){
            elementArr = [] ;
            var audioElementArr = document.getElementsByTagName('audio') ;
            var videoElementArr = document.getElementsByTagName('video') ;
            if( audioElementArr && audioElementArr.length > 0 ){
                for(var i=0 ; i<audioElementArr.length;i++){
                    var ele = audioElementArr[i] ;
                    elementArr.push(ele);
                }
            }
            if( videoElementArr && videoElementArr.length > 0 ){
                for(var i=0 ; i<videoElementArr.length;i++){
                    var ele = videoElementArr[i] ;
                    elementArr.push(ele);
                }
            }
        }
        if( elementArr && elementArr.length > 0 ){
            var length = elementArr.length;
            for(var i=0 ; i<elementArr.length;i++){
                var ele = elementArr[i] ;
                var index = i ;
                _setElementSinkId(ele , index , length);
            }
        }else{
            var index = 0 , length = 1 ;
            _setElementSinkId(elementArr , index , length);
        }
    };

    /*更换本地设备，生成数据流改变本地媒体数据流轨道
     * @method changeLocalDeviceToLocalstream
     * @params [getUserMediaCallback:function(切换设备后获取的数据流回调) ， deviceIdMap:json , callback:function , audioouputElementIdArr:array(需要更新扩音器输出的节点元素数组) ]  */
    that.changeLocalDeviceToLocalstream = function (getUserMediaCallback , deviceIdMap , callback  , audioouputElementArr) {
        var changeDeviceId = {};
        for (var key in deviceIdMap) {
            if (L.Constant.deviceStorage[key] && deviceIdMap[key] !== L.Utils.localStorage.getItem(L.Constant.deviceStorage[key])) {
                L.Utils.localStorage.setItem(L.Constant.deviceStorage[key], deviceIdMap[key]);
                changeDeviceId[key] = true;
            }
        }
        if( !(changeDeviceId.videoinput || changeDeviceId.audioinput) && TK && TK.default_stream && TK.default_stream.stream  ){
            if(deviceIdMap.videoinput && TK.default_stream.stream.getVideoTracks  && TK.default_stream.stream.getVideoTracks() && TK.default_stream.stream.getVideoTracks().length === 0 ){
                changeDeviceId.videoinput = true ;
            }
            if(deviceIdMap.audioinput  &&  TK.default_stream.stream.getAudioTracks  && TK.default_stream.stream.getAudioTracks() && TK.default_stream.stream.getAudioTracks().length === 0 ){
                changeDeviceId.audioinput = true ;
            }
        }
        if(changeDeviceId.videoinput || changeDeviceId.audioinput){
            that.getUserMedia(function (stream) {
                if(getUserMediaCallback && typeof getUserMediaCallback === "function"){
                    getUserMediaCallback(stream);
                }
                if(callback && typeof callback === "function"){
                    callback(stream);
                }
            }, undefined , undefined , {isDemotionLocalStream:true , isNeedCheckChangeLocalStream:false , isStopLocalStream:false });
        }
        if(audioouputElementArr &&  audioouputElementArr.length > 0){
            that.setElementSinkIdToAudioouputDevice(audioouputElementArr);
        }
    };

    /*添加设备改变事件*/
    that.addOndevicechange = function(callback){
        if(!navigator.mediaDevices){L.Logger.error('Browser does not support navigator.mediaDevices!');return false;};
        if(navigator.mediaDevices){
            navigator.mediaDevices.ondevicechange = null ;
            navigator.mediaDevices.ondevicechange = function(event) {
                L.Logger.debug("[tk-sdk]AVMgr:ondevicechange event:" ,event );
                if(callback && typeof callback === 'function'){
                    callback(event);
                }
            };
            return true ;
        }
    };

    /*删除设备改变事件*/
    that.removeOndevicechange = function () {
        if(!navigator.mediaDevices){L.Logger.error('Browser does not support navigator.mediaDevices!'); return false;};
        if(!navigator.mediaDevices.ondevicechange){
            return false;
        }
        navigator.mediaDevices.ondevicechange = null ;
        return true ;
    };

    that.stopStreamTracks = function(stream ,  stopVideoTrack , stopAudioTrack){
        _stopStreamTracks(stream ,  stopVideoTrack , stopAudioTrack);
    };

    function _stopStreamTracks(stream ,  stopVideoTrack , stopAudioTrack){
        stopVideoTrack = stopVideoTrack!==undefined ?stopVideoTrack:true ;
        stopAudioTrack = stopAudioTrack!==undefined ?stopAudioTrack:true ;
        if(stopVideoTrack && stopAudioTrack && stream && stream.getTracks && typeof stream.getTracks === 'function'){
            var tracks = stream.getTracks();
            if(tracks && tracks.length>0){
                for(var trackIndex=0 ; trackIndex<tracks.length ; trackIndex++){
                    if( tracks[trackIndex] &&  tracks[trackIndex].stop && typeof  tracks[trackIndex].stop  === 'function'){
                        tracks[trackIndex].stop();
                    }
                }
            }
        }else{
            if(stopVideoTrack && stream && stream.getVideoTracks && typeof stream.getVideoTracks  === 'function'){
                var videotracks = stream.getVideoTracks();
                if(videotracks && videotracks.length>0){
                    for(var videotrackIndex=0 ; videotrackIndex<videotracks.length ; videotrackIndex++){
                        if( videotracks[videotrackIndex] &&  videotracks[videotrackIndex].stop && typeof videotracks[videotrackIndex].stop ===  'function'){
                            videotracks[videotrackIndex].stop();
                        }
                    }
                }
            }
            if(stopAudioTrack && stream && stream.getAudioTracks && typeof stream.getAudioTracks  === 'function'){
                var audiotracks = stream.getAudioTracks();
                if(audiotracks && audiotracks.length>0){
                    for(var audiotrackIndex=0 ; audiotrackIndex<audiotracks.length ; audiotrackIndex++){
                        if( audiotracks[audiotrackIndex] &&  audiotracks[audiotrackIndex].stop && typeof audiotracks[audiotrackIndex].stop === 'function'){
                            audiotracks[audiotrackIndex].stop();
                        }
                    }
                }
            }
        }

    }

    return that ;
})(TK);
'use strict';
var TK = TK || {};

TK.NativeAVMgr = function () {
    var that = {} ;
    that.room_video_width = 320 ;
    that.room_video_height = 240 ;
    that.room_video_fps = 10 ;

    var avmgr_callbacks = {};

    var avmgr_params = {};

    var req_seq_ = 100;

    var genSeq = function () {
        return req_seq_ ++;
    };

    that.setAVMgrProperty = function (key_value_json) { //设置AVMgr的属性值
      for (var key in key_value_json){
          if(that.hasOwnProperty(key)){
              that[key] =key_value_json[key] ;
          }
      }
    };

    var messageCallback = function(msg)
    {
        var funcName = msg.data.name;
        if (funcName === "onEnumerateDevices")
        {
            var _onEnumerateDevicesCallback = function () {
                var audioinputDeviceId = L.Utils.localStorage.getItem(L.Constant.deviceStorage.audioinput);
                var videoinputDeviceId = L.Utils.localStorage.getItem(L.Constant.deviceStorage.videoinput);
                var audiooutputDeviceId = L.Utils.localStorage.getItem(L.Constant.deviceStorage.audiooutput);
                L.Logger.debug("devices in enumerateDevices(client):", msg.data);
                var ai = msg.data.audioinput;
                var vi = msg.data.videoinput;
                var ao = msg.data.audiooutput;
                var seqId = msg.data.seq;
                var devicesTmp = {
                    all: {},
                    defalut: {},
                };
                var devicesInfo = {
                    hasdevice: {
                        "audioinput": false,
                        "audiooutput": false,
                        "videoinput": false
                    },
                    devices:{
                        "audioinput": [],
                        "audiooutput": [],
                        "videoinput": []
                    },
                    useDevices:{}
                };
                var _handlerForeachDevices = function (device) {
                    if(device != null) {
                        if( !( device.groupId =="communications" || device.deiceId == "communications" || device.label == "通讯" ) ) {
                            if (device.kind === "audioinput" && device.deviceId === audioinputDeviceId) {
                                devicesInfo.useDevices[device.kind] = device.deviceId;
                            }
                            if (device.kind === "videoinput" && device.deviceId === videoinputDeviceId) {
                                devicesInfo.useDevices[device.kind] = device.deviceId;
                            }
                            if (device.kind === "audiooutput" && device.deviceId === audiooutputDeviceId) {
                                devicesInfo.useDevices[device.kind] = device.deviceId;
                            }
                            devicesTmp.all[device.kind] = device.deviceId;
                            devicesInfo.devices[device.kind].push(device);
                            devicesInfo.hasdevice[device.kind] = true;
                            if (device.deviceId === "default") {
                                devicesTmp.defalut[device.kind] = device.deviceId;
                            }
                        }
                    }
                };
                if(Array.isArray(ai)){
                    ai.forEach(function(device) {
                        _handlerForeachDevices(device);
                    });
                }
                if(Array.isArray(vi)){
                    vi.forEach(function(device) {
                        _handlerForeachDevices(device);
                    });
                }
                if(Array.isArray(ao)){
                    ao.forEach(function(device) {
                        _handlerForeachDevices(device);
                    });
                }

                if(!devicesInfo.useDevices["audioinput"]) {
                    devicesInfo.useDevices["audioinput"]  = devicesTmp.defalut["audioinput"] || devicesTmp.all["audioinput"] || "";
                }
                if(!devicesInfo.useDevices["videoinput"]) {
                    devicesInfo.useDevices["videoinput"]  =  devicesTmp.defalut["videoinput"] || devicesTmp.all["videoinput"] || "";
                }
                if(!devicesInfo.useDevices["audiooutput"]) {
                    devicesInfo.useDevices["audiooutput"]  = devicesTmp.defalut["audiooutput"] || devicesTmp.all["audiooutput"] || "";
                }
                if(L.Utils.localStorage) { //存储设备id到本地存储localStorage中
                    var param = avmgr_params[seqId];
                    if(param.isSetlocalStorage){
                        L.Utils.localStorage.setItem(L.Constant.deviceStorage.audioinput, devicesInfo.useDevices["audioinput"]);
                        L.Utils.localStorage.setItem(L.Constant.deviceStorage.videoinput, devicesInfo.useDevices["videoinput"]);
                        L.Utils.localStorage.setItem(L.Constant.deviceStorage.audiooutput, devicesInfo.useDevices["audiooutput"]);
                    }
                } else {
                    L.Logger.error("not support localStorage");
                }

                if (avmgr_callbacks[seqId]) {
                    avmgr_callbacks[seqId](devicesInfo);
                    delete avmgr_callbacks[seqId];
                }

                if (avmgr_params[seqId]) {
                    delete avmgr_params[seqId];
                }
            };
            if (!(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices)) {
                L.Logger.error("[tk-sdk]navigator.mediaDevices.enumerateDevices method not supported.");
                msg.data.audiooutput = [];
                _onEnumerateDevicesCallback();
            }else{
                navigator.mediaDevices.enumerateDevices()
                    .then(function(devices) {
                        var audiooutputDevicesArray = [] ;
                        devices.forEach(function(device) {
                            if(device.kind === 'audiooutput'){
                                audiooutputDevicesArray.push ({
                                    kind:device.kind ,
                                    label:device.label,
                                    deviceId:device.deviceId,
                                })
                            }
                        });
                        msg.data.audiooutput = audiooutputDevicesArray ;
                        _onEnumerateDevicesCallback();
                    }).catch(function(err) {
                        L.Logger.error('[tk-sdk]enumerateDevices error :'+err.name + ": " + err.message);
                        msg.data.audiooutput = [];
                        _onEnumerateDevicesCallback();
                    });
            }

        } // end if (funcName === "onEnumerateDevices")

        if (funcName === "onMicVolumeReport")
        {
            var vol = msg.data.volume;
            if (vol === null || vol === undefined) return;
            if (avmgr_callbacks["detecte-mic-callback"] && typeof avmgr_callbacks["detecte-mic-callback"] === "function") {
                avmgr_callbacks["detecte-mic-callback"](vol / 100);
            }
        }

        if (funcName === "onGetSpeakerVolume")
        {
            var vol = msg.data.volume;
            var seqId = msg.data.seq;
            if (typeof avmgr_callbacks[seqId] !== "function") return;
            vol = Math.round(vol / 2.55);
            avmgr_callbacks[seqId](vol);
            delete avmgr_callbacks[seqId];
        }
    };

    tknative.addEventListener("message", messageCallback, false);


    var _getUserMedia =  function ( callback,error , config , specifiedConstraints ) {
        var _getUserMediaByFfConfig = function (ffConfig) {
            tknative.postMessage({command: "setCamera", deviceId: ffConfig.video.deviceId, width: Number(ffConfig.video.width), height: Number(ffConfig.video.height), fps: Number(ffConfig.video.frameRate)});
            tknative.postMessage({command: "setMicrophone", deviceId: ffConfig.audio.deviceId});
            // todo...
            // 构造一个流？
            callback(null);
        };
        config = config || {audio:{} , video:{}} ;
        error = error || function (error) {L.Logger.error("[tk-sdk]getUserMedia error:" ,error );};
        if ( config.screen) {
            L.Logger.debug('[tk-sdk]Screen access requested!');
            callback(null);
        } else {
                var ffConfig = {video:{}, audio: {}, screen: config.screen};
                if(typeof config.audio === "object"){
                    ffConfig.audio = config.audio
                }
                specifiedConstraints = specifiedConstraints != undefined && specifiedConstraints!=null  && typeof specifiedConstraints === 'object' ?  specifiedConstraints : { video:{}, audio: {} , exclude:{} } ;
                specifiedConstraints.video  =    specifiedConstraints.video || {} ;
                specifiedConstraints.audio =  specifiedConstraints.audio || {};
                var audioMandatoryCfg = config.audio.mandatory || {
                    sourceId: specifiedConstraints.audio.sourceId ||  L.Utils.localStorage.getItem(L.Constant.deviceStorage.audioinput) || ""
                };
                var videoMandatoryCfg = config.video.mandatory || {
                    sourceId: specifiedConstraints.video.sourceId || L.Utils.localStorage.getItem(L.Constant.deviceStorage.videoinput) || "" ,
                    idealWidth:that.room_video_width || 320 ,
                    maxWidth:that.room_video_width || 320 ,
                    idealHeight:that.room_video_height || 240 ,
                    maxHeight:that.room_video_height || 240
                };
                ffConfig.video.width = videoMandatoryCfg.maxWidth;
                ffConfig.video.height = videoMandatoryCfg.maxHeight;
                if (config.video.optional !== undefined) {
                    ffConfig.video.frameRate =  config.video.optional[1].maxFrameRate;
                }else{
                    var videoOptionalCfg =  {
                        idealFrameRate: Number(that.room_video_fps || 10)  ,
                        maxFrameRate: Number(that.room_video_fps || 10)
                    };
                    if(videoOptionalCfg.idealFrameRate != undefined && videoOptionalCfg.maxFrameRate != undefined ){
                        ffConfig.video.frameRate = videoOptionalCfg.maxFrameRate;
                    }else if(videoOptionalCfg.frameRate != undefined){
                        ffConfig.video.frameRate = videoOptionalCfg.frameRate ;
                    }
                }
                if( !videoMandatoryCfg.sourceId ||   !audioMandatoryCfg.sourceId ){
                    that.enumerateDevices(function (devicesInfo) {
                        var useDevices = devicesInfo.useDevices ;
                        var hasDevice = devicesInfo.hasdevice;
                        if((hasDevice['videoinput'] !== null && hasDevice['videoinput'] !== undefined) && (useDevices['videoinput'] !== null && useDevices['videoinput'] !== undefined) && !videoMandatoryCfg.sourceId){
                            videoMandatoryCfg.sourceId =  useDevices['videoinput'] ;
                            L.Utils.localStorage.setItem(L.Constant.deviceStorage.videoinput ,videoMandatoryCfg.sourceId );
                        }
                        if((hasDevice['audioinput'] !== null && hasDevice['audioinput'] !== undefined)&& (useDevices['audioinput'] !== null && useDevices['audioinput'] !== undefined) && !audioMandatoryCfg.sourceId ){
                            audioMandatoryCfg.sourceId =  useDevices['audioinput'] ;
                            L.Utils.localStorage.setItem(L.Constant.deviceStorage.audioinput ,audioMandatoryCfg.sourceId );
                        }
                        if (audioMandatoryCfg.sourceId !== null && audioMandatoryCfg.sourceId !== undefined) {
                            ffConfig.audio.deviceId = audioMandatoryCfg.sourceId;
                        }else{
                            ffConfig.audio = false ;
                        }
                        if (videoMandatoryCfg.sourceId !== null && videoMandatoryCfg.sourceId !== undefined) {
                            ffConfig.video.deviceId =videoMandatoryCfg.sourceId;
                        }else{
                            ffConfig.video = false ;
                        }
                        if(specifiedConstraints.exclude && specifiedConstraints.exclude.video ){
                            ffConfig.video = false ;
                        }else if(specifiedConstraints.exclude && specifiedConstraints.exclude.audio ){
                            ffConfig.audio = false ;
                        }
                        _getUserMediaByFfConfig(ffConfig);
                    }) ;
                }else{
                    if (audioMandatoryCfg.sourceId !== null && audioMandatoryCfg.sourceId !== undefined) {
                        ffConfig.audio.deviceId = audioMandatoryCfg.sourceId;
                    }else{
                        ffConfig.audio = false ;
                    }
                    if (videoMandatoryCfg.sourceId !== null && videoMandatoryCfg.sourceId !== undefined) {
                        ffConfig.video.deviceId =videoMandatoryCfg.sourceId;
                    }else{
                        ffConfig.video = false ;
                    }
                    if(specifiedConstraints.exclude && specifiedConstraints.exclude.video ){
                        ffConfig.video = false ;
                    }else if(specifiedConstraints.exclude && specifiedConstraints.exclude.audio ){
                        ffConfig.audio = false ;
                    }
                    _getUserMediaByFfConfig(ffConfig);
                }
            }
    };

    /*获取设备数据流
     * @method GetUserMedia
     * @params [ callback:function ,error:function , config:object ]
     * */
    that.getUserMedia = function (callback,error , config , specifiedConstraints) {
        _getUserMedia(callback,error , config , specifiedConstraints);
    };

    that.startDetecteMic = function (deviceId, callback) {
        that.stopDetectMic(); //需要等强制更新客户端才能去掉
        tknative.postMessage({command: "startDetecteMic", deviceId: deviceId});
        avmgr_callbacks["detecte-mic-callback"] = callback;
    }

    that.stopDetectMic = function () {
        tknative.postMessage({command: "stopDetecteMic"});
        delete  avmgr_callbacks["detecte-mic-callback"];
    }

    that.startDetecteCam = function (deviceId, param) {
        // param:{elementId: id}
        that.stopDetecteCam(); //需要等强制更新客户端才能去掉
        tknative.postMessage({command: "startDetecteCam", deviceId: deviceId, args: param});
    }

    that.stopDetecteCam = function () {
        tknative.postMessage({command: "stopDetecteCam"});
    }

    that.enumerateDevices = function (callback, paramsJson) {
        var seqId = genSeq();
        avmgr_callbacks[seqId] = callback;
        var param = {} ;
        param.isSetlocalStorage = paramsJson === undefined ? false : (paramsJson.isSetlocalStorage!=undefined ? paramsJson.isSetlocalStorage : false);
        avmgr_params[seqId] = param;
        tknative.postMessage({command: "enumerateDevices", seq: seqId});
    };

    that.setSpeaker = function(deviceId) {
        tknative.postMessage({command: "setSpeaker", deviceId: deviceId});
    }

    that.getsSoundMeterInstance = function (audioContext) {
        if(!audioContext){
            L.Logger.error('[tk-sdk]getsSoundMeterInstance audioContext is not exist!');
            return undefined ;
        }
        var SoundMeter =  function (audioContext) {
            var _that = this ;
            _that.audioContext = audioContext;
            _that.instant = 0.0;
            _that.slow = 0.0;
            _that.clip = 0.0;
            _that.script = _that.audioContext.createScriptProcessor(2048, 1, 1);
            var that = _that;
            _that.script.onaudioprocess = function (event) {
                var input = event.inputBuffer.getChannelData(0);
                var i;
                var sum = 0.0;
                var clipcount = 0;
                for (i = 0; i < input.length; ++i) {
                    sum += input[i] * input[i];
                    if (Math.abs(input[i]) > 0.99) {
                        clipcount += 1;
                    }
                }
                that.instant = Math.sqrt(sum / input.length);
                that.slow = 0.95 * that.slow + 0.05 * that.instant;
                that.clip = clipcount / input.length;
            };
            _that.connectToSource = function (stream, callback) {
                L.Logger.debug('SoundMeter connecting');
                try {
                    _that.mic = _that.audioContext.createMediaStreamSource(stream);
                    _that.mic.connect(_that.script);
                    // necessary to make sample run, but should not be.
                    _that.script.connect(_that.audioContext.destination);
                    if (typeof callback !== 'undefined') {
                        callback(null);
                    }
                } catch (e) {
                    L.Logger.error(e);
                    if (typeof callback !== 'undefined') {
                        callback(e);
                    }
                }
            };
            _that.stop = function () {
                _that.mic.disconnect();
                _that.script.disconnect();
            };
            return _that ;
        };
        return new SoundMeter(audioContext);
    };

    that.setElementSinkIdToAudioouputDevice = function (elementArr , audiooutputDeviceId , callback) {
    /*    audiooutputDeviceId = audiooutputDeviceId || L.Utils.localStorage.getItem(L.Constant.deviceStorage.audiooutput );
        tknative.postMessage({command: "setSpeaker", deviceId: audiooutputDeviceId});
        if(callback && typeof callback === 'function'){
            callback();
        }*/

        var audiooutputDeviceId = audiooutputDeviceId ||  L.Utils.localStorage.getItem(L.Constant.deviceStorage.audiooutput );
        if(!audiooutputDeviceId){
            if(callback && typeof callback === 'function'){
                callback(false);
            }
            return ;
        }
        var finshedNumberJson = {number:0};
        var _setElementSinkId = function (element , index , length) {
            if(element &&  /(audio|video)/g.test(element.nodeName.toLowerCase())  && audiooutputDeviceId){
                if(element.setSinkId){
                    try{
                        element.setSinkId(audiooutputDeviceId)
                            .then(function() {
                                var elementId = element.getAttribute('id');
                                L.Logger.debug('[tk-sdk]Audio output device set to ' + audiooutputDeviceId , (elementId ? (' , element id is '+elementId) : ('  element:')  ) , (!elementId?element:''));
                                finshedNumberJson.number++;
                                if(  finshedNumberJson.number === length && callback && typeof callback === 'function'){
                                    callback(true);
                                }
                            })
                            .catch(function(error) {
                                var errorMessage = undefined;
                                var elementId = element.getAttribute('id');
                                if (error && error.name === 'SecurityError') {
                                    errorMessage = 'You need to use HTTPS for selecting audio output device  '
                                };
                                L.Logger.warning('[tk-sdk]setSinkId error:' , error   , (errorMessage?errorMessage:'') , (elementId ? (' , element id is '+elementId) : ('  element:')  ) , (!elementId?element:'') );
                                finshedNumberJson.number++;
                                if( finshedNumberJson.number === length && callback && typeof callback === 'function'){
                                    callback(false);
                                }
                            });
                    }catch (err){
                        var elementId = element.getAttribute('id');
                        L.Logger.error('[tk-sdk]setSinkId err:' , err , (elementId ? (' , element id is '+elementId) : ('  element:')  ) , (!elementId?element:'') );
                        finshedNumberJson.number++;
                        if( finshedNumberJson.number === length && callback && typeof callback === 'function'){
                            callback(false);
                        }
                    }
                }else{
                    var elementId = element.getAttribute('id');
                    L.Logger.error("[tk-sdk]The browser does not support the setSinkId method,audiooutputDeviceId :" ,audiooutputDeviceId , (elementId ? (' , element id is '+elementId) : ('  element:')  ) , (!elementId?element:'')  );
                    finshedNumberJson.number++;
                    if( finshedNumberJson.number === length && callback && typeof callback === 'function'){
                        callback(false);
                    }
                }
            }else{
                finshedNumberJson.number++;
                if( finshedNumberJson.number === length && callback && typeof callback === 'function'){
                    callback(false);
                }
            }
        };

        if(!elementArr){
            elementArr = [] ;
            var audioElementArr = document.getElementsByTagName('audio') ;
            var videoElementArr = document.getElementsByTagName('video') ;
            if( audioElementArr && audioElementArr.length > 0 ){
                for(var i=0 ; i<audioElementArr.length;i++){
                    var ele = audioElementArr[i] ;
                    elementArr.push(ele);
                }
            }
            if( videoElementArr && videoElementArr.length > 0 ){
                for(var i=0 ; i<videoElementArr.length;i++){
                    var ele = videoElementArr[i] ;
                    elementArr.push(ele);
                }
            }
        }
        if( elementArr && elementArr.length > 0 ){
            var length = elementArr.length;
            for(var i=0 ; i<elementArr.length;i++){
                var ele = elementArr[i] ;
                var index = i ;
                _setElementSinkId(ele , index , length);
            }
        }else{
            var index = 0 , length = 1 ;
            _setElementSinkId(elementArr , index , length);
        }

    };

    that.changeLocalDeviceToLocalstream = function (getUserMediaCallback , deviceIdMap , callback  , audioouputElementArr) {
        var changeDeviceId = {};
        for (var key in deviceIdMap) {
            if (L.Constant.deviceStorage[key] && deviceIdMap[key] !== L.Utils.localStorage.getItem(L.Constant.deviceStorage[key])) {
                L.Utils.localStorage.setItem(L.Constant.deviceStorage[key], deviceIdMap[key]);
                changeDeviceId[key] = true;
            }
        }
        if(changeDeviceId.videoinput || changeDeviceId.audioinput ){
            that.getUserMedia(function (stream) {
                if(getUserMediaCallback && typeof getUserMediaCallback === "function"){
                    getUserMediaCallback(stream);
                }
                if(callback && typeof callback === "function"){
                    callback(stream);
                }
            } , undefined , undefined , {isDemotionLocalStream:true , isNeedCheckChangeLocalStream:false , isStopLocalStream:false});
        }
        if(audioouputElementArr &&  audioouputElementArr.length > 0){
            that.setElementSinkIdToAudioouputDevice(audioouputElementArr);
        }
    };

    /*添加设备改变事件*/
    that.addOndevicechange = function(callback){
        // navigator.mediaDevices.ondevicechange = null ;
        // navigator.mediaDevices.ondevicechange = function(event) {
        //     L.Logger.debug("[tk-sdk]AVMgr:ondevicechange event:" , event );
        //     if(callback && typeof callback === 'function'){
        //         callback(event);
        //     }
        // }
    };

    /*删除设备改变事件*/
    that.removeOndevicechange = function () {
        //navigator.mediaDevices.ondevicechange = null ;
    };

    that.getSpeakerVolume = function (callback) {
        if (typeof callback !== "function") {
            L.Logger.error('[tk-sdk] wrong arguments in funciton getSpeakerVolume');
            return;
        }
        var seqId = genSeq();
        avmgr_callbacks[seqId] = callback;
        tknative.postMessage({command: "getSpeakerVolume", seq: seqId});
    }

    that.setSpeakerVolume = function (vol) {
        if (vol === undefined || vol === null || vol < 0 || vol > 100) {
            L.Logger.error('[tk-sdk] invalid arguments in funciton setSpeakerVolume');
            return;   
        }
        vol = Math.round(vol * 2.55); // the volume range is 0~255 in C++
        tknative.postMessage({command: "setSpeakerVolume", volume: vol});
    }

    return that ;
};
