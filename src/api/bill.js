import request from '@/utils/request'
const baseURL = 'http://199.180.116.241:45235'
//const baseURL = 'http://localhost:45235'



export function billList(params){
    return request({
        url: `${baseURL}/bill/billList`,
        data: {
            ...params
        },
        method: 'post',
    })
}

export function save(params) {
    return request({
        url: `${baseURL}/bill/save`,
        data: {
            ...params
        },
        method: 'post',
    })
}

export function updateBill(params) {
    return request({
        url: `${baseURL}/bill/updateBill`,
        data: {
            ...params
        },
        method: 'post',
    })
}

export function billById(params) {
    return request({
        params,
        url: `${baseURL}/bill/billById`,
        method: 'get',
    })
}
export function del(params) {
    return request({
        params,
        url: `${baseURL}/bill/del`,
        method: 'get',
    })
}