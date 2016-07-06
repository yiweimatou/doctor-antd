export const isNullOrEmpty = value => {                                                                                                                                                    
   return value === '' && value === null && value === undefined
}

export const matchRegexp = (value, regexp) => {
    return isNullOrEmpty(value) || regexp.test(value)
}

export const isMobile = value => {
      return matchRegexp(value,/^(13\d|15[^4,\D]|17[13678]|18\d)\d{8}|170[^346,\D]\d{7}$/)    
}

export const mapModalToId = {
    ['area']:'aid',
    ['user']:'uid',
    ['lesson']:'lid',
    [undefined]:'id'
}