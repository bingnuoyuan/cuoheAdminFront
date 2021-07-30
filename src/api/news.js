import request from '@/utils/request'
const baseURL = 'http://199.180.116.241:45235'
//const baseURL = 'http://localhost:45235'



export function newsList(params){
    return request({
        params,
        url: `${baseURL}/news/list`,
        method: 'get'
    })
}

export function topNews(params){
    return request({
        params,
        url: `${baseURL}/news/topNews`,
        method: 'post'
    })
}


export function topNewsadd(params) {
    return request({
        url: `${baseURL}/news/topNewsadd`,
        data: {
            ...params
        },
        method: 'post',
    })
}

export function add(params) {
    return request({
        url: `${baseURL}/news/add`,
        data: {
            ...params
        },
        method: 'post',
    })
}

export function fetchById(params) {
    return request({
        params,
        url: `${baseURL}/news/getById`,
        method: 'get',
    })
}

export function update(params) {
    return request({
        url: `${baseURL}/news/updateNews`,
        data: {
            ...params
        },
        method: 'post',
    })
}


export function updateNewsTop(params) {
    return request({
        url: `${baseURL}/news/updateNewsTop`,
        data: {
            ...params
        },
        method: 'post',
    })
}

export function del(params) {
    return request({
        params,
        url: `${baseURL}/news/del`,
        method: 'get',
    })
}

export function syncData(params) {
    return request({
        data: {
            ...params
        },
        url: `${baseURL}/news/syncData`,
        method: 'post',
    })
}
export function syncDataTop(params) {
    return request({
        data: {
            ...params
        },
        url: `${baseURL}/news/syncData`,
        method: 'post',
    })
}
