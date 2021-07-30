import request from '@/utils/request'
const baseURL = 'http://199.180.116.241:45235'
//const baseURL = 'http://localhost:45235'



export function orderList(params){
    return request({
        params,
        url: `${baseURL}/order/list`,
        method: 'get'
    })
}
export function add(params) {
    return request({
        url: `${baseURL}/order/add`,
        data: {
            ...params
        },
        method: 'post',
    })
}


export function fetchById(params) {
    return request({
        params,
        url: `${baseURL}/order/getById`,
        method: 'get',
    })
}

export function update(params) {
    return request({
        url: `${baseURL}/order/updateOrder`,
        data: {
            ...params
        },
        method: 'post',
    })
}

export function del(params) {
    return request({
        params,
        url: `${baseURL}/order/del`,
        method: 'get',
    })
}