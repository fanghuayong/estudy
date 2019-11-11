import {api} from "../utils/api"
// const eStudy = JSON.parse(localStorage.getItem("eStudy")) || {};
// 如果没有的话 就是一个空对象
// 取值 自动登录
const state = {
    loggedIn: false,
    info: {
        
    },
    // loggedIn: eStudy.loggedIn || false,
    // info: eStudy.info ? JSON.parse(eStudy.info) : {}
    // 如果去不到值也是一个空对象
}
const getters = {

}
const mutations = {
    login(state, data) {
        state.loggedIn = true
        state.info = data
        // localStorage.setItem("eStudy", JSON.stringify({loggedIn: true, info: JSON.stringify(data)}))
        // 存值
        api.defaults.headers.common["Token"] = state.info.token
    },
    updateToken(state, token) {
        // 续期toeken
        state.info.token = token;
    },
    logout(state) {
        state.info = {},
        state.loggedIn = false
    }
    // 登出
}
const actions = {
    login({commit}, form) {
        console.log(form)
        api.post("/auth/login", form).then( (result) => {
            commit("login", result)
        })
    },
    checkedLogin({commit, state, dispatch}) {
        // 钩子函数
        api.defaults.headers.common["Token"] = state.info.token;
        api.post("/auth/refreshToken", {}, {_slient:true}).then( token => {
            // 静音(不提示) 传不了了
            // console.log(token)
            commit("updateToken", token)
            // 触发续期token
        }).catch( () => {
            // console.log(err)
            dispatch("logout")
        })
    },
    logout({commit}) {
        // 退出登录
        commit("logout")
    }
}
export default {
    namespaced: true,
    // 独立命名空间
    state,
    getters,
    mutations,
    actions,
}