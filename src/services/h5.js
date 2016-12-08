import ApiClient from './ApiClient'
import {
    H5_ADD, H5_EDIT, H5_BUY, H5_INFO, H5_GET, H5_LIST, H5_REMOVE
 } from '../constants/api'

 export function get(params) {
     return ApiClient.get(H5_GET, params)
 }

 export function info(params) {
     return ApiClient.get(H5_INFO, params)
 }

 export function list(params) {
     return ApiClient.get(H5_LIST, params)
 }

 export function buy(params) {
     return ApiClient.post(H5_BUY, params, { needAuth: true })
 }

 export function add(params) {
     return ApiClient.post(H5_ADD, params, { needAuth: true })
 }

 export function edit(params) {
     return ApiClient.post(H5_EDIT, params, { needAuth: true })
 }

 export function remove(params) {
     return ApiClient.post(H5_REMOVE, params)
 }