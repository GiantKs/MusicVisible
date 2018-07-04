/**
 * 提供异步加载的Dumb组件
 * @module AsyncComponent
 * @description   提供 组件的异步加载
 * @author QiuShao
 * @date 2017/12/25
 */
'use strict';
import React, { Component } from "react";
import Loading from './Loading' ;

/*asyncComponent函数需要一个参数; 一个函数（importComponent），当被调用时会动态地导入给定的组件*/
export default function asyncComponent(importComponent) {
  class AsyncComponent extends Component {
    constructor(props) {
      super(props);

      this.state = {
        component: null
      };
    }

    async componentDidMount() {
      const { default: component } = await importComponent();

      this.setState({
        component: component
      });
    }

    render() {
      const C = this.state.component;
      return (C ? <C {...this.props} /> : <Loading /> ); /*可以在这里加上loading*/
    }
  }

  return AsyncComponent;
}
