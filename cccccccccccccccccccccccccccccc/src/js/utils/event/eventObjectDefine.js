/**
 * 事件对象定义组件
 * @module eventUtilModule
 * @description  用于定义事件分发器的对象
 * @author QiuShao
 * @date 2017/7/6
 */
var eventsObj  = {} ;
eventsObj.Document = TK.EventDispatcher( {} );
eventsObj.Window =  TK.EventDispatcher( {} );
eventsObj.Element =  TK.EventDispatcher( {} );
eventsObj.Room =  TK.EventDispatcher( {} );
eventsObj.Stream =  TK.EventDispatcher( {} );
eventsObj.Role =  TK.EventDispatcher( {} );
export default  eventsObj ;
