import { 
    HTML, ACCOUNT, ACTIVE, TOPICS, BOOK, NOTICE 
} from '../constants/api'

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