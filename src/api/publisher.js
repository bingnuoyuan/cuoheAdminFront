import request from '@/utils/request'
const baseURL = 'http://199.180.116.241:45235'
//const baseURL = 'http://localhost:45235'

export function publisherList(params){
    return request({
        params,
        url: `${baseURL}/publisher/list`,
        method: 'get'
    })
}

export function publisherAdd(params) {
    return request({
        url: `${baseURL}/publisher/add`,
        data: {
            ...params
        },
        method: 'post',
    })
}

export function publisherUpload(params) {
    return request({
        url: `${baseURL}/publisher/upload`,
        data: {
            ...params
        },
        method: 'post',
    })
}
export function publisherById(params) {
    return request({
        params,
        url: `${baseURL}/publisher/getById`,
        method: 'get',
    })
}

export function update(params) {
    return request({
        url: `${baseURL}/publisher/update`,
        data: {
            ...params
        },
        method: 'post',
    })
}

export function del(params) {
    return request({
        params,
        url: `${baseURL}/publisher/del`,
        method: 'get',
    })
}