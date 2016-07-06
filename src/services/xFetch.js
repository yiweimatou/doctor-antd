import fetch from 'isomorphic-fetch'

const errorMessages = (res) => `${res.status} ${res.statusText}`;

// function check401(res) {
//   if (res.status === 401) {
//     location.href = '/401';
//   }
//   return res;
// }

// function check404(res) {
//   if (res.status === 404) {
//     return Promise.reject(errorMessages(res));
//   }
//   return res;
// }

function checkOk(res) {
  if (res.ok) {
    return Promise.reject(errorMessages(res))
  }
  return res
}

function jsonParse (res){
  return res.json()
}

function errorMessageParse(res) {
  const {
    code,
    msg
  } = res
  if (code !== 200) {
    return Promise.reject(msg)
  }
  return res
}

function xFetch(url, options) {
  const authorization = localStorage.getItem('authorization')
  if (authorization) {
    const {
      key,
      token
    } = authorization
    options.body = `key=${key}&token=${token}&${options.body}`
  }
  return fetch(url, options)
    .then(checkOk)
    .then(jsonParse)
    .then(errorMessageParse)
}

export default xFetch