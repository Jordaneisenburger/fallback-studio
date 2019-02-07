function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import { bool, shape, string } from 'prop-types';
import classify from 'src/classify'; //Uncomment to use venia-concept footer again
//import Footer from 'parentComponents/Footer';

import Footer from "../Footer";
import Header from 'parentComponents/Header';
import TopBar from "../TopBar";
import defaultClasses from 'parentComponents/Main/main.css';

class Main extends Component {
  get classes() {
    const {
      classes,
      isMasked
    } = this.props;
    const suffix = isMasked ? '_masked' : '';
    return ['page', 'root'].reduce((acc, val) => _objectSpread({}, acc, {
      [val]: classes[`${val}${suffix}`]
    }), {});
  }

  render() {
    const {
      classes,
      props
    } = this;
    const {
      children
    } = props;
    return React.createElement("main", {
      className: classes.root
    }, React.createElement(TopBar, null), React.createElement(Header, null), React.createElement("div", {
      className: classes.page
    }, children), React.createElement(Footer, null));
  }

}

_defineProperty(Main, "propTypes", {
  classes: shape({
    page: string,
    page_masked: string,
    root: string,
    root_masked: string
  }),
  isMasked: bool
});

export default classify(defaultClasses)(Main);
//# sourceMappingURL=main.js.map