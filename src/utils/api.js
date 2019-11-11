import axios from "axios"
import Vue from "vue"

const api = axios.create({
    baseURL: "http://sandbox_api.estudy.chanke.xyz"
})
// 发送json格式
api.defaults.headers.post["Content-Type"] = "application/json"
// 拦截器
api.interceptors.response.use( response => {
    return response.data.data
    // 成功后只要response.data.data中的数据
}, error => {
    const config = error.config
    // 输入错误有一个错误对象
    console.dir(error)
    const response = error.response
    if(!config._slient) {
        Vue.$notification.error({
            message: "API Error",
            description: response.data.errorMessage
        })
    }
    return Promise.reject(error)
})
export {api}