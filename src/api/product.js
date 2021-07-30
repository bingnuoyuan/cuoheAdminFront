import request from '@/utils/request'
// const baseURL = 'http://199.180.116.241:45236'
const baseURL = 'http://localhost:45236'



export function fetchList(params){
    return request({
        params,
        url: `${baseURL}/product/list`,
        method: 'get'
    })
}
export function add(params) {
    return request({
        url: `${baseURL}/product/add`,
        data: {
            ...params
        },
        method: 'post',
    })
}


export function fetchById(params) {
    return request({
        params,
        url: `${baseURL}/product/getById`,
        method: 'get',
    })
}

export function update(params) {
    return request({
        url: `${baseURL}/product/updateProduct`,
        data: {
            ...params
        },
        method: 'post',
    })
}

export function del(params) {
    return request({
        params,
        url: `${baseURL}/product/del`,
        method: 'get',
    })
}