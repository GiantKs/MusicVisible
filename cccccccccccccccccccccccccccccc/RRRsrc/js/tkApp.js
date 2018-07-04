/**
 * 主要入口
 * @module tkApp
 * @description   提供 系统程序的入口
 * @author QiuShao
 * @date 2017/7/21
 */

'use strict';
import React  from 'react';
import ReactDom from 'react-dom';
import Routers from './router/Router';
import CoreController from  'CoreController' ;

CoreController.handler.loadSystemRequiredInfo(); //加载系统所需的信息
ReactDom.render((
    <Routers />
), document.getElementById('tk_app'));/*根据路由决定渲染的页面*/




