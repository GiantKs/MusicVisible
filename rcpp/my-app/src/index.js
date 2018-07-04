import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from "./App";
var store =createStore(reducer);
function reducer(state={num:1},action) {
    if(action.type==='add'){
        return{num:state.num+1}
    }
    if(action.type==='ree'){
        return{num:state.num-1}
    }
    return state
        }
ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
);

