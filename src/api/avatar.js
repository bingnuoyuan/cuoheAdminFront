import request from '@/utils/request'
const baseURL = 'http://199.180.116.241:45235'
//const baseURL = 'http://localhost:45235'

export function avatarById(params) {
    return request({
        params,
        url: `${baseURL}/avatar/getById`,
        method: 'get',
    })
}