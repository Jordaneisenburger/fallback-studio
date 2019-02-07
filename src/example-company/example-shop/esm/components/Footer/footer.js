function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import defaultClasses from 'parentComponents/Footer/footer.css';

class Footer extends Component {
  render() {
    const {
      classes
    } = this.props;
    return React.createElement("footer", {
      className: classes.root
    }, React.createElement("div", {
      className: classes.tile
    }, React.createElement("h2", {
      className: classes.tileTitle
    }, React.createElement("span", null, "Custom Example shop")), React.createElement("p", {
      className: classes.tileBody
    }, React.createElement("span", null, "this component is overwritten inside \"example-shop\" but the styling is still resolved from \"venia-concept\" because we don't need to change styling"))), React.createElement("div", {
      className: classes.tile
    }, React.createElement("h2", {
      className: classes.tileTitle
    }, React.createElement("span", null, "Your Account")), React.createElement("p", {
      className: classes.tileBody
    }, React.createElement("span", null, "Sign up and get access to our wonderful rewards program."))), React.createElement("div", {
      className: classes.tile
    }, React.createElement("h2", {
      className: classes.tileTitle
    }, React.createElement("span", null, "inquiries@example.com")), React.createElement("p", {
      className: classes.tileBody
    }, React.createElement("span", null, "Need to email us? Use the address above and we\u2019ll respond as soon as possible."))), React.createElement("div", {
      className: classes.tile
    }, React.createElement("h2", {
      className: classes.tileTitle
    }, React.createElement("span", null, "Live Chat")), React.createElement("p", {
      className: classes.tileBody
    }, React.createElement("span", null, "Mon \u2013 Fri: 5 a.m. \u2013 10 p.m. PST"), React.createElement("br", null), React.createElement("span", null, "Sat \u2013 Sun: 6 a.m. \u2013 9 p.m. PST"))), React.createElement("div", {
      className: classes.tile
    }, React.createElement("h2", {
      className: classes.tileTitle
    }, React.createElement("span", null, "Help Center")), React.createElement("p", {
      className: classes.tileBody
    }, React.createElement("span", null, "Get answers from our community online."))), React.createElement("div", {
      className: classes.copyright
    }, React.createElement("span", null, "\xA9 Magento 2018. All rights reserved.")));
  }

}

_defineProperty(Footer, "propTypes", {
  classes: PropTypes.shape({
    copyright: PropTypes.string,
    root: PropTypes.string,
    tile: PropTypes.string,
    tileBody: PropTypes.string,
    tileTitle: PropTypes.string
  })
});

export default classify(defaultClasses)(Footer);
//# sourceMappingURL=footer.js.map