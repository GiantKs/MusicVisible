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
import { Router, Route, hashHistory } from 'react-router';
import CoreController from  'CoreController' ;
import TkLogin from './containers/login/tk-login';
import TkCall from './containers/call/tk-call';
import TkPlayback from './containers/playback/tk-playback';

$(function () {
    CoreController.handler.loadSystemRequiredInfo(); //加载系统所需的信息
        /*根据路由决定渲染的页面*/
    ReactDom.render((
        <Router history={hashHistory}  >
                <Route path='/' component={TkLogin}></Route>
                <Route path='/login' component={TkLogin} />
                <Route path='/call' component={TkCall} />
                <Route path='/playback' component={TkPlayback} />
                <Route path='/replay' component={TkPlayback} />
        </Router>
    ), document.getElementById('tk_app'));
});





