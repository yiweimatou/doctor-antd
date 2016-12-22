import './index.html';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { browserHistory } from 'react-router';
import { routerMiddleware,syncHistoryWithStore, routerReducer as routing } from 'react-router-redux';
import reducers from '../reducers/index';
import SagaManager from '../sagas/SagaManager';
import './index.less';
import App from '../components/App'
import moment from 'moment';
import { message } from 'antd';
import 'quill/dist/quill.core.css'

// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
message.config({
  duration: 6
});

//////////////////////
// Store

const sagaMiddleware = createSagaMiddleware();
const authorization = localStorage.getItem('auth')
const initialState = authorization
                    ?{
                      auth:JSON.parse(authorization)
                    }:{}
const middleware = routerMiddleware(browserHistory)
const enhancer = compose(
  applyMiddleware(sagaMiddleware),
  applyMiddleware(middleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f
);
const store = createStore(combineReducers({
  ...reducers, routing
}), initialState, enhancer)
SagaManager.startSagas(sagaMiddleware)
store.dispatch({
  type: 'user/set',
  payload: {
    id: store.getState().auth.key
  }
})

if (module.hot) {
  module.hot.accept('../reducers', () => {
    const reducers = require('../reducers');
    const combinedReducers = combineReducers({ ...reducers, routing });
    store.replaceReducer(combinedReducers);
  });
  module.hot.accept('../sagas/SagaManager', () => {
    SagaManager.cancelSagas(store);
    require('../sagas/SagaManager').default.startSagas(sagaMiddleware);
  });
}

//////////////////////
// Render

const history = syncHistoryWithStore(browserHistory, store);
let render = () => {
  ReactDOM.render(
      <App
          history = { history }
          store = { store }
      />
  , document.getElementById('root'));
};

if (module.hot) {
  const renderNormally = render;
  const renderException = (error) => {
    const RedBox = require('redbox-react');
    ReactDOM.render(<RedBox error={error} />, document.getElementById('root'));
  };
  render = () => {
    try {
      renderNormally();
    } catch (error) {
      console.error('error', error);
      renderException(error);
    }
  };
  module.hot.accept('../routes/index', () => {
    render();
  });
}

render();
