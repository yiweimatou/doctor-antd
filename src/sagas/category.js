import {
    takeLatest
} from 'redux-saga'
import {
    fork, call
} from 'redux-saga/effects'
import {
    getArea, getAreaList
} from '../services/area.js'
import category from '../constants/category'
import array from 'lodash/array'

function* initialCategory(action) {
    try {
        const {
            area_id, category_id
        } = action.payload
        const ids = category_id.toString().split('')
        const defaultValue = []
        if(ids.length === 3){
            defaultValue.push(parseInt(ids[0], 10), parseInt(ids[0]+ids[1], 10), category_id)
        }else if(ids.length === 2) {
            defaultValue.push(parseInt(ids[0], 10), category_id)
        }else {
            throw new Error('非法category_id: '+category_id+' 初始化失败!')
        }
        const options = category
        const data = yield call(getArea, { id: area_id })
        const merge_id = data.get.merge_id.split(',')
        const area_ids = merge_id.slice(1,merge_id.length - 1).map(i => parseInt(i, 10) )//第一个为田家园，最后一个也不需要
        merge_id.slice(1, merge_id.length).forEach(id => {
            defaultValue.push(parseInt(id,10))
        })
        if(area_ids.length > 0){
            const areas = yield call(getAreaList, { pid_list: area_ids.join(','),limit:10000 })
            const _array = []
            area_ids.forEach(item => {
                _array.push(areas.list.filter(area=> {
                    if(area.pid === item) {
                        return true
                    }
                }).map(area => {
                    return {
                        label: area.title,
                        value: area.id,
                        zoom: area.zoom,
                        isLeaf: false,
                        pid: area.pid
                    }
                }))
            })
            let areaList = _array.pop()
            let _list = _array.pop()
            while(_list !== undefined){
                const _idx = array.findIndex(_list, { value: areaList[0].pid })
                if(_idx === -1) break;
                _list[_idx].children = areaList
                areaList = _list
                _list = _array.pop()                
            }
            if(ids.length === 2){
                const index1 = array.findIndex(options[0].children, { value: category_id})
                const index2 = array.findIndex(options[0].children[index1].children, { value: area_ids[0] })
                if(index2 === -1) return
                options[0].children[index1].children[index2].children = areaList
            }else {
                const index = array.findIndex(options[1].children, { value: parseInt(ids[0]+ids[1], 10) })
                if(index === -1) return
                const index1 = array.findIndex(options[1].children[index].children, { value: category_id })
                if(index1 === -1) return
                const _index = array.findIndex(options[1].children[index].children[index1].children, { value: area_ids[0] })
                if(_index === -1) return
                options[1].children[index].children[index1].children[_index].children = areaList 
            }
        }
        if(action.meta.resolve) {
            yield call(action.meta.resolve, defaultValue, options)
        }
    } catch (error) {
        if(action.meta.reject) {
            yield call(action.meta.reject, error)
        }
    }
}

function* watchInitial() {
    yield takeLatest('category/init', initialCategory)
}

export default function* () {
    yield [
        fork(watchInitial)
    ]
}