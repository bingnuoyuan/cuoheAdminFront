import request from '@/utils/request'
const baseURL = 'http://localhost:45236'

export function account(params) {
    return request({
        params,
        url: `${baseURL}/account/getByName`,
        method: 'get',
    })
}
