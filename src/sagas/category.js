import { takeLatest } from 'redux-saga'
import { fork, call } from 'redux-saga/effects'
import { list, get as getCategory } from '../services/category'
import { add, get } from '../services/grow'

function* watchList() {
    yield takeLatest('category/list', function* (action) {
        try {
            const result = yield call(list, action.payload.params)
            if (action.payload.resolve) {
                action.payload.resolve(result.list)
            }
        } catch (error) {
            if (action.payload.reject) {
                action.payload.reject(error)
            }
        }
    })
}

function* watchGrow() {
    yield takeLatest('grow/add', function* (action) {
        try {
            yield call(add, action.payload.params)
            if (action.payload.resolve) {
                action.payload.resolve()
            }
        } catch (error) {
            if (action.payload.reject) {
                action.payload.reject(error)
            }
        }
    })
}

function* watchGet() {
    yield takeLatest('grow/get', function* (action) {
        try {
            const result = yield call(get, action.payload.params)
            if (action.payload.resolve) {
                action.payload.resolve(result.get)
            }
        } catch (error) {
            if (action.payload.reject) {
                action.payload.reject(error)
            }
        }
    })
}

function* watchGetCategory() {
    yield takeLatest('category/get', function* (action) {
        try {
            const result = yield call(getCategory, action.payload.params)
            if (action.payload.resolve) {
                action.payload.resolve(result.list)
            }
        } catch (error) {
            if (action.payload.reject) {
                action.payload.reject(error)
            }
        }
    })
}

function* watchInit() {
    yield takeLatest('category/init', function* (action) {
        try {
            const options = [{
                label: '医学专业人员',
                value: '1',
                isLeaf: false
            }, {
                value: '2',
                label: '普通大众',
                isLeaf: false
            }]
            const values = action.payload.params
            const num = values.length
            const data = {}
            for (let i = 0; i <= num - 1; i ++) {
                const result = yield call(list, { parent_id: values[i]})
                data[values[i]] = result.list.map(i => ({
                    label: i.title,
                    value: i.id,
                    isLeaf: false
                }))
            }
            let opt = []
            for(let i = num - 1; i > 0; i--) {
                if (i === num -1){
                    opt = data[values[i]]
                } else {
                    opt = data[values[i-1]].map(item => {
                        if (item.value === values[i]) {
                            return {
                                ...item,
                                children: opt
                            }
                        } else {
                            return item
                        }
                    })
                }
            }
            if (values[0] == '1') {
                options[0].children = opt
            } else {
                options[1].children = opt
            }
            if (action.payload.resolve) {
                action.payload.resolve(options)
            }
        } catch (error) {
            if (action.payload.reject) {
                action.payload.reject(error)
            }
        }
    })
}

export default function* () {
    yield [
        fork(watchList),
        fork(watchGrow),
        fork(watchGet),
        fork(watchGetCategory),
        fork(watchInit)
    ]
}