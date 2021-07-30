import request from '@/utils/request'
// const baseURL = 'http://199.180.116.241:45235'
const baseURL = 'http://localhost:45235'



export function itemList(params){
    return request({
        params,
        url: `${baseURL}/item/list`,
        method: 'get'
    })
}

export function add(params) {
    return request({
        url: `${baseURL}/item/add`,
        data: {
            ...params
        },
        method: 'post',
    })
}

export function fetchById(params) {
    return request({
        params,
        url: `${baseURL}/item/getById`,
        method: 'get',
    })
}

export function update(params) {
    return request({
        url: `${baseURL}/item/update`,
        data: {
            ...params
        },
        method: 'post',
    })
}

export function del(params) {
    return request({
        params,
        url: `${baseURL}/item/del`,
        method: 'get',
    })
}