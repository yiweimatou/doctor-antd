import fetch from 'isomorphic-fetch'
const initialFetchConfig = {
    needAuth:false
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
            }).then(response =>
                response.ok ?
                response.json() :
                Promise.reject(`${response.status}:${response.statusText}`))
            .then(data => {
                const {
                    code,
                    msg
                } = data
                if (code === 200) {
                    return data
                } else {
                    return Promise.reject(msg)
                }
            })
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
            }).then(response =>
                response.ok ?
                response.json() :
                Promise.reject(`${response.status}:${response.statusText}`))
            .then(data => {
                const {
                    code,
                    msg
                } = data
                if (code === 200) {
                    return data
                } else {
                    return Promise.reject(msg)
                }
            })
    },
    put(url,params){
        this.post(url,params,{needAuth: true})
    },
    remove(url,params){
        this.post(url,params,{needAuth: true})
    }
}

function queryString(params) {
    let s = ''
    for(let p in params){
        if(params.hasOwnProperty(p)){
            s+=`${p}=${params[p]}&`
        }
    }
    return s
}

export default ApiClient