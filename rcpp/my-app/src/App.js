import React, { Component } from 'react';
import {connect} from 'react-redux'
class App extends Component {

    drag(e){

    }
    down(e){



        /*data.style.left=e.clientX;
        data.style.top=e.clientY;*/
    }

  render() {
    return (
          <div className="App" onDragOver={this.down}>
            <h1 id='qwe' style={{position:'absolute'}} onDragStart={this.drag} draggable="true" >hello,word</h1>
            <p>{this.props.num>16?'SB':this.props.num}</p>
            <button onClick={this.props.add}>+</button>
            <button onClick={this.props.ree}>-</button>
          </div>
    );
  }
}




export default connect((state) => {
    return {num:state.num}
} ,(
    dispatch,
    ownProps
) => {
    return {
        add: () => {
            dispatch({
                type: 'add',
            });
        }, ree: () => {
            dispatch({
                type: 'ree',
            });
        },
    };
})(App);

