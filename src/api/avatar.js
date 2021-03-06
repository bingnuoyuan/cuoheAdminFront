import request from '@/utils/request'
const baseURL = 'http://localhost:45236'

export function avatarById(params) {
    return request({
        params,
        url: `${baseURL}/avatar/getById`,
        method: 'get',
    })
}
