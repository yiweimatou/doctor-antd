import { takeEvery } from 'redux-saga'
import { fork, put, call } from 'redux-saga/effects'

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

function* garbageCollector() {
  yield call(delay, 10 * 60 * 1000) // initial 10 minute delay
  for (;;) {
    yield call(delay, 5 * 60 * 1000) // every 5 minutes thereafter
    yield put({ type: 'GARBAGE_COLLECT', payload: { now: Date.now() } })
  }
}

export const apiGeneric = (apiClient: Object) =>
    function* _apiGeneric(action) {
        const { method, url, params, fetchConfig, success, failure } = action.payload
        const meta = {
            params,
            fetchTime: Date.now()
        }
        try {
            const response = yield call(apiClient[method], url, params, fetchConfig)
            if( success ) {
              yield put({ meta, type: success, payload: response })
            }
        } catch (error) {
            if( failure ) {
              yield put({ meta, type: failure, payload: error, error: true })
            }
        }
    }

const watchFetch = (apiClient) => function* _watchFetch() {
  yield* takeEvery('FETCH', apiGeneric(apiClient))
}

const watchFetchOne = (apiClient) => function* _watchFetchOne() {
  yield* takeEvery('FETCH_ONE', apiGeneric(apiClient))
}

const watchCreate = (apiClient) => function* _watchCreate() {
  yield* takeEvery('CREATE', apiGeneric(apiClient))
}

const watchUpdate = (apiClient) => function* _watchUpdate() {
  yield* takeEvery('UPDATE', apiGeneric(apiClient))
}

const watchDelete = (apiClient) => function* _watchDelete() {
  yield* takeEvery('DELETE', apiGeneric(apiClient))
}

const watchApiCall = (apiClient) => function* _watchApiCall() {
  yield* takeEvery('API_CALL', apiGeneric(apiClient))
}

export default function crudSaga(apiClient: Object) {
  return function* _crudSaga() {
    yield [
      fork(watchFetch(apiClient)),
      fork(watchFetchOne(apiClient)),
      fork(watchCreate(apiClient)),
      fork(watchUpdate(apiClient)),
      fork(watchDelete(apiClient)),
      fork(watchApiCall(apiClient)),
      fork(garbageCollector)
    ]
  }
}
