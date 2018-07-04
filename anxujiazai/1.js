import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter as Router,Route,Link} from 'react-router-dom';
import asyncComponent from './asyncComponent';
const AsyncHome = asyncComponent(() => import('./components/Home'))
const AsyncUser = asyncComponent(() => import('./components/User'))

ReactDOM.render(
    <Router>
        <div>
            <Link to="/">首页</Link>
            <Link to="/user">用户页</Link>
            <Route exact path='/' component={AsyncHome}/>
            <Route exact path='/user' component={AsyncUser}/>
        </div>
    </Router>
    , document.getElementById('root'));