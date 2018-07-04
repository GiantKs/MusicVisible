/**
 * 路由组件
 * @module Routers
 * @description   提供 系统程序的路由功能
 * @author QiuShao
 * @date 2017/12/25
 */

'use strict';
import React  from 'react';
import {HashRouter as Router , Route , Switch } from 'react-router-dom';
/*import asyncComponent from "AsyncComponent";*/
import TkLogin from '../containers/login/tk-login';
import TkCall from '../containers/call/tk-call';
import TkPlayback from '../containers/playback/tk-playback';
/*const TkLogin = asyncComponent( () => import("../containers/login/tk-login") );
 const TkCall = asyncComponent( () => import("../containers/call/tk-call") );
const TkPlayback = asyncComponent( () => import("../containers/playback/tk-playback") );*/

/*根据路由决定渲染的页面*/
class Routers extends React.Component {
    constructor(props) {
        super(props);
        this.listernerBackupid = new Date().getTime() + '_' + Math.random();
    };
    render() {
        return (
            <Router >
                <Switch>
                    <Route path='/login' component={TkLogin} />
                    <Route path='/call' component={TkCall} />
                    <Route path='/playback' component={TkPlayback} />
                    <Route path='/replay' component={TkPlayback} />
                     <Route path='/' component={TkLogin} />
                </Switch>
            </Router>
        )
    }
}
export default  Routers;




