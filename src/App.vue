<template>
    <a-layout id="app">
      <a-layout-header class="header flexrow">
        <!-- flexrow以行作为布局 -->
        <h2>作业管理系统</h2>
        <!-- 登录后的头部 -->
        <div class="right flexrow" v-if="loggedIn">
          <!-- 老师的头部 -->
          <div v-if="isTeacher" class="flexrow">
            <h4>{{ info.name }}</h4>
            <a-button icon="file-add" class="vcenter" type="primary" @click="newWorkOn">新建作业</a-button>
          </div>
          <!-- 学生的头部 -->
          <div v-else class="flexrow">
            <h4 class="flexcol">
              <span>{{ info.full_name }}</span>
              <span>{{ info.name }}</span>
            </h4>
            <h5 class="flexrow">
              <span v-for="(org, index) in student.orgs" :key="`${org}_${index}`">{{ org }}</span>
            </h5>
            <div>
              <span class="label">{{ student.stats.uncommitted }}个作业待提交</span>
              <span class="label">{{ student.stats.revising }}个作业待批改</span>
              <span class="label">{{ student.stats.improvable }}个作业需完善</span>
              <span class="label">{{ student.stats.finished }}个作业已完成</span>
            </div>
            
          </div>
          <!-- 公共头部 -->
          <a href="http://vipgit.chanke.xyz" target="_blank" class="vcenter">
            <a-button icon="home">代码仓库</a-button>
          </a>
          <a-button icon="logout" class="vcenter" @click="$store.dispatch('user/logout')">退出</a-button>
        </div>
      </a-layout-header>
      <a-layout-content>
        <Authorization v-if="!loggedIn"></Authorization>
        <div v-else>
          <Teacher v-if="isTeacher" :teacher="teacher"></Teacher>
          <Student v-else :student="student">
            学生页面
          </Student>
        </div>
      </a-layout-content>
    </a-layout>
</template>

<script>
import {mapState, mapMutations} from "vuex"
import {api} from "./utils/api"
import Authorization from "./components/Authorization"
import Teacher from "./components/Teacher"
import Student from "./components/Student"
export default {
  name: 'app',
  data() {
    return {
      // loggedIn: false,
      student: {
        // 存放学生的详细信息
        orgs: [], // 班级
        stats: {}, // 状态
        assignments: [], // 作业信息
      },
      teacher: {
        orgs: [],
        stats: {},
        assignments: [],
      }
    }
  },
  computed: {
    ...mapState("user", ["info", "loggedIn"]),
    isTeacher() {
      return this.info.is_admin > 0;
    }
  },
  created() {
    if(this.loggedIn) {
      // 登录后刷新也可以获取数据
      this.loadDetails()
    }
  },
  watch: {
    loggedIn(val) {
      if(val) {
        this.loadDetails();
      }
    }
  },
  methods: {
    ...mapMutations(["newWorkOn"]),
    loadDetails() {
      if(this.isTeacher) {
        api.get("/teacher/detail").then( data => {
          // console.log(data)
          this.teacher.orgs = data.orgs;
          this.teacher.assignments = data.assignments;
        })
      }else{
        api.get("/student/detail").then(data => {
          // console.log(data)
          // 登录成功后请求用户的详细信息
          // 赋值操作
          this.student.orgs = data.orgs;
          this.student.assignments = data.assignments;
          this.student.stats = data.stats;
        })
      }
    }
  },
  components: {
    Authorization,
    Teacher,
    Student
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}
.header {
  font-size: 1.1em;
  h2, h4, h5 {
    color: white;
  }
  .right > .flexrow > * {
    margin-right: 25px;
  }
  .label {
    padding: 0 5px;
    color: white;
  }
}
.flexrow {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
}
.right {
  margin-left: auto;
}
.flexcol {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-evenly;
  height: 100%;
  span {
    flex: 1;
    max-height: 20px;
    line-height: 20px;
  }
}
.vcenter {
  align-self: center;
}
</style>
