import { takeLatest } from 'redux-saga'
import { fork, put, call } from 'redux-saga/effects'
import { fetchInfo, fetchList } from '../services/message'

function* fetchInfoSaga(action) {
	try {
		const data = yield call(fetchInfo, action.payload)
		yield put({
			type: 'message/fetchinfo/success',
			payload: data.count
		})
	} catch(error) {
		yield put({
			type: 'message/fetchinfo/failure',
			payload: error
		})
	}
}

function* watchFetchInfo() {
	yield* takeLatest('message/fetchinfo', fetchInfoSaga)
}

function* fetchListSaga(action) {
	try {
		const data = yield call(fetchList, action.payload)
		yield put({
			type: 'message/fetchlist/success',
			payload: {
				data: data.list,
				params: action.payload
			}
		})
	} catch (error) {
		yield put({
			type: 'message/fetchlist/failure',
			payload: error
		})
	}
}

function* watchFetchList() {
	yield* takeLatest('message/fetchlist', fetchListSaga)
}

export default function* () {
	yield [
		fork(watchFetchInfo),
		fork(watchFetchList)
	]
}