import fetch from 'isomorphic-fetch'

class ApiClient {
    constructor(){
        const config = {
            methods:['post','put','delete']
        }
        const {
            key,token
        } = _getAuth()
        this.get = (url, params, fetchConfig) => {
            let body = _queryString(params)
            if(fetchConfig.needAuth){
                body = `key=${key}&token=${token}&${body}`
            }
            return fetch(url,{
                method:'GET',
                body:body
            }).then(_checkError).then(_checkResult)
        }
        config.methods.forEach(method => {
            this[method] = (url, params) => {
                return fetch(url, {
                    method,
                    headers: {
                        'Content-Type':'application/x-www-form-urlencoded'
                    },
                    body: `key=${key}&token=${token}&${_queryString(params)}`
                }).then(_checkError).then(_checkResult)
            }
        })
    }
}

function _getAuth() {
    const auth = JSON.parse(localStorage.getItem('auth'))
    return auth
}

function _checkError(response) {
    if(!response.ok){
        return Promise.reject('服务器开小差了，待会儿再试吧！')
    }else{
        return response.json()
    }
}

function _checkResult(data) {
    const {
        code,msg
    } = data
    if(code === 200){
        return data
    }else{
        return Promise.reject(msg?msg:'出错了！，待会儿再试吧！')
    }
}

function _queryString(params) {
    let s = ''
    for(let p in params){
        if(params.hasOwnProperty(p)){
            s+=`${p}=${params[p]}&`
        }
    }
    return s
}

export default ApiClient