import { 
    HTML, ACCOUNT, ACTIVE, TOPICS, BOOK, NOTICE 
} from '../constants/api'

export function keyToDisplayname(key) {
    switch (key.toString()) {
        case HTML:
            return '图文'
        case ACCOUNT:
            return '账户'
        case ACTIVE:
            return '活动'
        case TOPICS:
            return '试卷'
        case BOOK:
            return '板书'
        case NOTICE:
            return '通知'
        default:
            return ''
    }
}

export function keyToName(key) {
    switch (key.toString()) {
        case HTML:
            return 'html'
        case ACCOUNT:
            return 'account'
        case ACTIVE:
            return 'active'
        case TOPICS:
            return 'topics'
        case BOOK:
            return 'book'
        case NOTICE:
            return 'notice'
        default:
            return ''
    }
}

export function nameToKey(name) {
    switch (name.toUpperCase()) {
        case 'HTML':
            return HTML
        case 'ACCOUNT':
            return ACCOUNT
        case 'ACTIVE':
            return ACTIVE
        case 'TOPICS':
            return TOPICS
        case 'NOTICE':
            return NOTICE
        case 'BOOK':
            return BOOK
        default:
            return 0
    }
}

export const isNullOrEmpty = value => {
    return value === '' && value === null && value === undefined
}

export const matchRegexp = (value, regexp) => {
    return isNullOrEmpty(value) || regexp.test(value)
}

export const isMobile = value => {
    return matchRegexp(value, /^(13\d|15[^4,\D]|17[13678]|18\d)\d{8}|170[^346,\D]\d{7}$/)
}

export const isUrl = value => {
    return matchRegexp(value, /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.?)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\\d_]*)?$/i)
}

export const isBaike = value => {
    return isUrl(value) && matchRegexp(value, /^http:\/\/baike.baidu.com*/)
}

export const isWX = value => {
    return isUrl(value) && matchRegexp(value, /^mp.weixin.qq.com*/)
}

export const mapModalToId = {
    ['area']: 'aid',
    ['user']: 'uid',
    ['lesson']: 'lid',
    [undefined]: 'id'
}

export function loadJS(url, success) {
    let domScript = document.createElement('script');
    domScript.src = url;
    success = success || function(){};
    if(navigator.userAgent.indexOf('MSIE') > 0){
        domScript.onreadystatechange = function(){
            if('loaded' === this.readyState || 'complete' === this.readyState){
            success();
            this.onload = this.onreadystatechange = null;
            this.parentNode.removeChild(this);
            }
        }
    }else{
        domScript.onload = function(){
            success();
            this.onload = this.onreadystatechange = null;
            this.parentNode.removeChild(this);
        }
    }
    document.getElementsByTagName('head')[0].appendChild(domScript);        
}