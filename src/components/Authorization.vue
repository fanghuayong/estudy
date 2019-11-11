<template>
    <div class="authorization">
        <form @submit.prevent="submit">
            <div class="filed">
                <a-input type="text" 
                    placeholder="请输入用户名" 
                    v-validate="'required'" 
                    name="name"
                    data-vv-as="用户名"
                    v-model="form.name"
                    :class="{error: errors.has('name')}">
                    <a-icon slot="prefix" type="user" class="icon"></a-icon>
                </a-input>
                <span class="error-tip">{{ errors.first('name')}}</span>
            </div>
            <div class="filed">
                <a-input type="password" 
                placeholder="请输入密码" 
                v-validate="'required'" 
                name="password"
                data-vv-as="密码"
                v-model="form.password"
                :class="{error: errors.has('password')}">
                    <a-icon slot="prefix" type="lock" class="icon"></a-icon>
                </a-input>
                <span class="error-tip">{{ errors.first('password')}}</span>
            </div>
            <div class="filed">
                <a-button type="primary" htmlType="submit">提交</a-button>
            </div>
        </form>
        <div class="test">
            <p>测试账号:</p>
            <p>账号 | 密码</p>
            <p>luwei | luwei</p>
            <p>V01002 | V01002</p>
        </div>
    </div>
</template>
<script>
// import {api} from "../utils/api"
export default {
    data() {
        return {
            form: {
                name: "",
                password: "",
            }
        }
    },
    methods: {
        submit() {
            // 验证
            this.$validator.validateAll().then( result => {
                if(result) {
                    // api.post("/auth/login", this.form).then(() => {
                    //     this.$emit("changeLog")
                    // })

                    this.$store.dispatch("user/login", this.form)
                    // action异步请求
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .authorization {
        display: flex;
        justify-content: center;
        // border: 1px solid #000;
    }
    form {
        width: 400px;
    }
    .filed {
        margin: 20px;
        button {
            width: 100%;
        }
    }
    .icon {
        color: rgba(0, 0, 0, .25);
    }
    .error {
        border: 1px solid red;
    }
    .error-tip {
        color: red;
        font-size: 12px;
    }
    .test {
        position: absolute;
        left: 0;
        display: block;
        // border: 1px solid #ccc;
    }
</style>