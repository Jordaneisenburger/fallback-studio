function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from 'react';
import ReactDOM from 'react-dom';
import { setContext } from 'apollo-link-context';
import { Util } from '@magento/peregrine';
import { Adapter } from 'parentSrc/drivers';
import store from 'parentSrc/store';
import app from 'parentSrc/actions/app';
import App from 'parentComponents/App';
import 'parentSrc/index.css'; // we create this file here instead of scss because of loading order

import "./general.css";
const {
  BrowserPersistence
} = Util;
const apiBase = new URL('/graphql', location.origin).toString();
/**
 * The Venia adapter provides basic context objects: a router, a store, a
 * GraphQL client, and some common functions. It is not opinionated about auth,
 * so we add an auth implementation here and prepend it to the Apollo Link list.
 */

const authLink = setContext((_, {
  headers
}) => {
  // get the authentication token from local storage if it exists
  const storage = new BrowserPersistence(); // TODO: Get correct token expire time from API

  const token = storage.getItem('signin_token'); // return the headers to the context so httpLink can read them

  return {
    headers: _objectSpread({}, headers, {
      authorization: token ? `Bearer ${token}` : ''
    })
  };
});
ReactDOM.render(React.createElement(Adapter, {
  apiBase: apiBase,
  apollo: {
    link: authLink.concat(Adapter.apolloLink(apiBase))
  },
  store: store
}, React.createElement(App, null)), document.getElementById('root'));

if (process.env.SERVICE_WORKER && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(process.env.SERVICE_WORKER).then(registration => {
      console.log('Service worker registered: ', registration);
    }).catch(error => {
      console.log('Service worker registration failed: ', error);
    });
  });
}

window.addEventListener('online', () => {
  store.dispatch(app.setOnline());
});
window.addEventListener('offline', () => {
  store.dispatch(app.setOffline());
});
//# sourceMappingURL=index.js.map