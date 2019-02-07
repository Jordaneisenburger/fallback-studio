function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import classify from 'parentSrc/classify';
import defaultClasses from "./topbar.scss";
import { shape, string } from "prop-types";

class TopBar extends Component {
  render() {
    const {
      classes
    } = this.props;
    return React.createElement("div", {
      className: classes.root
    }, "A custom react component on top of venia-concept");
  }

}

_defineProperty(TopBar, "propTypes", {
  classes: shape({
    root: string
  })
});

export default classify(defaultClasses)(TopBar);
//# sourceMappingURL=topbar.js.map