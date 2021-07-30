import request from '@/utils/request'
const baseURL = 'http://199.180.116.241:45235'
//const baseURL = 'http://localhost:45235'

export function bulletinAvatar(params){
    return request({
        params,
        url: `${baseURL}/platform/list`,
        method: 'get'
    })
}

export function addPlatformer(params) {
    return request({
        url: `${baseURL}/platform/add`,
        data: {
            ...params
        },
        method: 'post',
    })
}

export function publisherUpload(params) {
    return request({
        url: `${baseURL}/platform/upload`,
        data: {
            ...params
        },
        method: 'post',
    })
}
export function publisherById(params) {
    return request({
        params,
        url: `${baseURL}/platform/getById`,
        method: 'get',
    })
}

export function update(params) {
    return request({
        url: `${baseURL}/platform/update`,
        data: {
            ...params
        },
        method: 'post',
    })
}

export function del(params) {
    return request({
        params,
        url: `${baseURL}/platform/del`,
        method: 'get',
    })
}