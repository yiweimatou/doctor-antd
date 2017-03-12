import fetch from 'isomorphic-fetch'
import { WECHATLOGIN } from '../constants/api'
import { isNullOrEmpty } from '../utils'

const initialFetchConfig = {
    needAuth:false
}
function checkStatus(data) {
    const {
        code,
        msg
    } = data
    if (code === 200) {
        return data
    } else if (code === 401){
        localStorage.clear()
        window.location.reload(WECHATLOGIN)
    } else if (code === 500) {
        return Promise.reject('服务器开小差啦，请待会再试!')
    } else {
        return Promise.reject(msg)
    }
}
function checkResponse(response) {
    if(response.ok) {
        return response.json()
    }else {
        return Promise.reject(`${response.status}:${response.statusText}`)
    }
}
const ApiClient = {
    get(url, params, fetchConfig = initialFetchConfig) {
        let body
        if (fetchConfig.needAuth) {
            const auth = JSON.parse(localStorage.getItem('auth'))
            const {
                key,
                token
            } = auth
            body = `key=${key}&token=${token}&${queryString(params)}`
        } else {
            body = queryString(params)
        }
        return fetch(`${url}?${body}`, {
                method: 'GET'
            }).then(checkResponse).then(checkStatus)
    },
    post(url,params,fetchConfig=initialFetchConfig){
        let body
        if (fetchConfig.needAuth) {
            const auth = JSON.parse(localStorage.getItem('auth'))
            const {
                key,
                token
            } = auth
            body = `key=${key}&token=${token}&${queryString(params)}`
        } else {
            body = queryString(params)
        }
        return fetch(url, {
                method: 'POST',
                headers:{
                    'Content-Type':'application/x-www-form-urlencoded'
                },
                body
            }).then(checkResponse).then(checkStatus)
    },
    put(url,params){
        return this.post(url,params,{needAuth: true})
    },
    remove(url,params){
        return this.post(url,params,{needAuth: true})
    }
}

function queryString(params) {
    let s = ''
    for(let p in params){
        if(params.hasOwnProperty(p) && !isNullOrEmpty(params[p])){
            s+=`${p}=${encodeURIComponent(params[p])}&`
        }
    }
    return s
}

export default ApiClient
