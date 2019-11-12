import Vue from 'vue'
import Vuex from 'vuex'
import user from "./user"
import createPersistedState from 'vuex-persistedstate'
// 自动存取插件
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    newWork: false,
  },
  getters: {

  },
  mutations: {
    newWorkOn(state) {
      state.newWork = true;
    },
    newWorkOff(state) {
      state.newWork = false;
    }
  },
  actions: {
  },
  modules: {
    user,
  },
  plugins: [
    createPersistedState({
      key: "eStudy",
      paths: ["user"],
      // 所有user下的数据都会存到这里
      subscriber(store) {
      //   // 插件初始化钩子函数
      //   // store是当前vue的实例
        store.dispatch("user/checkedLogin");
      //   console.log(111)
        return function(handler) {
          // 默认 handler mutation与处理内部的关系
          return store.subscribe(handler)
          // 实例中订阅
        }

      }

    })
  ]
})
