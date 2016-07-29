import './index.html';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { browserHistory } from 'react-router';
import { routerMiddleware,syncHistoryWithStore, routerReducer as routing } from 'react-router-redux';
import reducers from '../reducers/index';
import crudReducer from '../reducers/crudReducer'
import SagaManager from '../sagas/SagaManager';
import './index.less';
import App from '../components/App'

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
  ...reducers, routing, models: crudReducer
}), initialState, enhancer)
SagaManager.startSagas(sagaMiddleware)

if (module.hot) {
  module.hot.accept('../reducers', () => {
    const reducers = require('../reducers');
    const combinedReducers = combineReducers({ ...reducers, routing, models: crudReducer });
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
