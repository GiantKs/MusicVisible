/**
 * 拓课开发使用的日志类
 * @module LogDevelopment
 * @description   提供 拓课开发使用的日志类
 * @author QiuShao
 * @date 2017/7/20
 */
const LogDevelopment = {
  error:function(){
      let args = [];
      for (let i = 0; i < arguments.length; i++) {
          args[i] = arguments[i];
      }
      console.error.apply(console, args);
    } ,
    log:function(){
        let args = [];
        for (let i = 0; i < arguments.length; i++) {
            args[i] = arguments[i];
        }
        console.log.apply(console, args);
    } ,
    info:function(){
        let args = [];
        for (let i = 0; i < arguments.length; i++) {
            args[i] = arguments[i];
        }
        console.info.apply(console, args);
    } ,
    warn:function(){
        let args = [];
        for (let i = 0; i < arguments.length; i++) {
            args[i] = arguments[i];
        }
        console.warn.apply(console, args);
    } ,
    trace:function(){
        let args = [];
        for (let i = 0; i < arguments.length; i++) {
            args[i] = arguments[i];
        }
        console.trace.apply(console, args);
    } ,
    debug:function(){
        let args = [];
        for (let i = 0; i < arguments.length; i++) {
            args[i] = arguments[i];
        }
        console.debug.apply(console, args);
    } ,
};
window.Log = LogDevelopment ;
