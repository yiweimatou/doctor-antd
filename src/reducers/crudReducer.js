import {
    fromJS
} from 'immutable'
import isEqual from 'lodash.isequal'

const recordsInitialState = fromJS({})

const collectionInitialState = fromJS({
    params: {},
    ids: [],
    fetchTime: null,
    error: null
})

const collectionsInitialState = fromJS([])

const actionStatusInitialState = fromJS({
    create: {},
    update: {},
    delete: {}
})

// const modelInitialState = fromJS({
//     collections: [],
//     records: undefined,
//     actionStatus: undefined
// })

// holds a number of models, each of which are strucured like modelInitialState
const initialState = fromJS({})

function recordsReducer(state = recordsInitialState, action) {
    const id = action.meta.params ? action.meta.params.id : undefined
    switch (action.type) {
        case 'FETCH_SUCCESS':
            const data = state.toJS()
            action.payload.list.forEach(record => {
                data[record.id] = {
                    record,
                    fetchTime: action.meta.fetchTime,
                    error: null
                }
            })
            return fromJS(data)
        case 'FETCH_ONE':
            return state.setIn([id.toString(), 'fetchTime'], 0)
                .setIn([id.toString(), 'error'], null)
                .setIn([id.toString(), 'record'], null)
        case 'FETCH_ONE_SUCCESS':
            return state.setIn([id.toString(), 'record'], action.payload.get)
                .setIn([id.toString(), 'fetchTime'], action.meta.fetchTime)
                .setIn([id.toString(), 'error'], null)
        case 'FETCH_ONE_FAILURE':
            return state.setIn([id.toString(), 'fetchTime'], action.meta.fetchTime)
                .setIn([id.toString(), 'record'], null)
                .setIn([id.toString(), 'error'], action.payload)
        case 'UPDATE':
            return state.set([id.toString(), 'fetchTime'], null)
        case 'UPDATE_SUCCESS':
            return state.set([id.toString(), 'fetchTime'], action.meta.fetchTime)
                .set([id.toString(), 'record'], {
                    ...state.get(id.toString()).record,
                    ...action.payload.params
                })
                .set([id.toString(), 'error'], null)
        case 'DELETE_SUCCESS':
            return state.delete(id.toString())
        case 'GARBAGE_COLLECT':
            const tenMinutesAgo = action.meta.now - 10 * 60 * 1000
            return state.filter(collection => (
                collection.get('fetchTime') > tenMinutesAgo ||
                collection.get('fetchTime') === null
            ))
        default:
            return state
    }
}

function collectionReducer(state = collectionInitialState, action) {
    switch (action.type) {
        case 'FETCH':
            return state.set('params', fromJS(action.payload.params))
                .set('fetchTime', 0)
                .set('error', null)
        case 'FETCH_SUCCESS':
            const ids = action.payload.list.map(item => item.id)
            return state.set('ids', fromJS(ids))
                .set('error', null)
                .set('fetchTime', action.meta.fetchTime)
        case 'FETCH_FAILURE':
            return state.set('error', action.payload)
                .set('fetchTime', action.meta.fetchTime)
        default:
            return state
    }
}

function collectionsReducer(state = collectionsInitialState, action) {
    switch (action.type) {
        case 'FETCH':
        case 'FETCH_SUCCESS':
        case 'FETCH_FAILURE':
            if (action.payload.params === undefined) {
                return state
            }
            const entry = state.findEntry(coll => (
                isEqual(coll.toJS().params, action.meta.params)
            ))
            if (entry === undefined) {
                return state.push(collectionReducer(undefined, action))
            }
            const [index] = entry
            return state.update(index, s => collectionReducer(s, action))
        case 'CREATE_SUCCESS':
        case 'DELETE_SUCCESS':
            return state.map(item => item.set('fetchTime', null))
        case 'GARBAGE_COLLECT':
            const tenMinutesAgo = action.meta.now - 10 * 60 * 1000
            return state.filter(collection => (
                collection.get('fetchTime') > tenMinutesAgo ||
                collection.get('fetchTime') === null
            ))
    }
}

function actionStatusReducer(state = actionStatusInitialState, action) {
    switch (action.type) {
        case 'CLEAR_ACTION_STATUS':
            return state.set(action.payload.action, fromJS({}))
        case 'CREATE':
            return state.set('create', fromJS({
                pending: true
            }))
        case 'CREATE_SUCCESS':
            return state.set('create', fromJS({
                pending: false
            }))
        case 'CREATE_ERROR':
            return state.set('create', fromJS({
                pending: false,
                isSuccess: false
            }))
        case 'UPDATE':
            return state.set('update', fromJS({
                pending: true
            }))
        case 'UPDATE_SUCCESS':
            return state.set('update', fromJS({
                pending: false,
                isSuccess: true
            }))
        case 'UPDATE_ERROR':
            return state.set('update', fromJS({
                pending: false,
                isSuccess: false
            }))
        case 'DELETE':
            return state.set('delete', fromJS({
                pending: true
            }))
        case 'DELETE_SUCCESS':
            return state.set('delete', fromJS({
                pending: false,
                isSuccess: true
            }))
        case 'DELETE_ERROR':
            return state.set('delete', fromJS({
                pending: false,
                isSuccess: false
            }))
        default:
            return state
    }
}

export default function crudReducer(state = initialState, action) {
    switch (action.type) {
        case 'CLEAR_ACTION_STATUS':
            return state.updateIn([action.payload.model, 'actionStatus'],
                (s) => actionStatusReducer(s, action))
        case 'GARBAGE_COLLECT':
            return state.map(model => (
                model.update('collections',
                    (s) => collectionsReducer(s, action))
                .update('records',
                    (s) => recordsReducer(s, action))
            ))
        case 'FETCH':
        case 'FETCH_SUCCESS':
        case 'FETCH_ERROR':
            return state.updateIn([action.meta.model, 'collections'],
                    (s) => collectionsReducer(s, action))
                .updateIn([action.meta.model, 'records'],
                    (s) => recordsReducer(s, action))
        case 'FETCH_ONE':
        case 'FETCH_ONE_SUCCESS':
        case 'FETCH_ONE_ERROR':
            return state.updateIn([action.meta.model, 'records'],
                (s) => recordsReducer(s, action))
        case 'CREATE':
            return state.updateIn([action.meta.model, 'actionStatus'],
                (s) => actionStatusReducer(s, action))
        case 'CREATE_SUCCESS':
            return state.updateIn([action.meta.model, 'records'],
                    (s) => recordsReducer(s, action))
                .updateIn([action.meta.model, 'collections'],
                    fromJS([]),
                    (s) => collectionsReducer(s, action))
                .updateIn([action.meta.model, 'actionStatus'],
                    (s) => actionStatusReducer(s, action))
        case 'CREATE_ERROR':
            return state.updateIn([action.meta.model, 'actionStatus'],
                (s) => actionStatusReducer(s, action))
        case 'UPDATE':
        case 'UPDATE_SUCCESS':
        case 'UPDATE_ERROR':
            return state.updateIn([action.meta.model, 'records'],
                    (s) => recordsReducer(s, action))
                .updateIn([action.meta.model, 'actionStatus'],
                    (s) => actionStatusReducer(s, action))
        case 'DELETE':
        case 'DELETE_SUCCESS':
        case 'DELETE_ERROR':
            return state.updateIn([action.meta.model, 'records'],
                    (s) => recordsReducer(s, action))
                .updateIn([action.meta.model, 'collections'],
                    fromJS([]),
                    (s) => collectionsReducer(s, action))
                .updateIn([action.meta.model, 'actionStatus'],
                    (s) => actionStatusReducer(s, action))
        default:
            return state
    }
}