import request from '@/utils/request'
const baseURL = 'http://199.180.116.241:45235'
//const baseURL = 'http://localhost:45235'



export function memberList(params){
    return request({
        params,
        url: `${baseURL}/member/list`,
        method: 'get'
    })
}


export function fetchById(params) {
    return request({
        params,
        url: `${baseURL}/member/getById`,
        method: 'get',
    })
}

export function update(params) {
    return request({
        url: `${baseURL}/member/updateMember`,
        data: {
            ...params
        },
        method: 'post',
    })
}

export function del(params) {
    return request({
        params,
        url: `${baseURL}/member/del`,
        method: 'get',
    })
}