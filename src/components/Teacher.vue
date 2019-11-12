<template>
    <div>
        <a-table :dataSource="teacher.assignments" :columns="columns"  :rowKey="assignment => assignment.assignment_id" :pagination="false">
            <template slot="operation" slot-scope="text, record">
                <div v-if="record.work_count > 0">
                    <a-button v-if="!revisingAssignment" icon="plus-square" type="primary" @click="revisingAssignment = record">展开</a-button>
                    <a-button v-else icon="minus-square" type="primary" @click="revisingAssignment = false">收起</a-button>
                    <a :href="`${downloadHost}All=${record.assignment_id}`">
                        <a-button icon="download">下载全部</a-button>
                    </a>
                    
                </div>
                <div v-else>
                    <a-popconfirm title="确认要删除该作业?" okText="确定" cancelText="取消" @confirm="removeAssignment(record.assignment_id)">
                        <a-button icon="delete" type="danger">删除</a-button>
                    </a-popconfirm>
                </div>
            </template>
        </a-table>
        <a-table 
            v-if="revisingAssignment" 
            :dataSource="revisingAssignment.works"
            :columns="workColumns"
            :rowKey="work => work.id">
            <template slot="operation" slot-scope="text, record">

                <a :href="`${downloadHost}?id=${record.id}&type=student`">
                    <a-button icon="download">下载</a-button>
                </a>
                
                <a-button icon="form" type="primary" @click="revisingWork = record;revisingForm.review=record.teacher_review" >批改</a-button>
            </template>
        </a-table>
        <!-- 批改作业的模态框 -->
        <a-modal :visible="Boolean(revisingWork)" :footer="null" @cancel="revisingWork = false">
            <form action="">
                <a-form-item label="状态">
                    <a-select v-model="revisingForm.status">
                        <a-select-option v-for="(status_name, status) in work_status" :value="status" :key="`status_${status}`">
                            {{status_name}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="批改意见">
                    <a-textarea v-model="revisingForm.review" autosize></a-textarea>
                </a-form-item>
                <a-form-item label="附件">
                    <a-upload :action="uploadHost" :headers="{Token:info.token}" :data="{id:revisingWork.id}">
                        <a-button icon="upload">上传</a-button>
                    </a-upload>
                </a-form-item>
                <a-form-item>
                    <a-button @click="save" type="primary">保存</a-button>
                </a-form-item>
            </form>
        </a-modal>
        <!-- 新增作业的模态框 -->
        <a-modal :visible="newWork" @cancel="newWorkOff" :footer="null">
            <form action="">
                <a-form-item label="课程">
                    <a-input v-model="newWorkForm.org_id"></a-input>
                </a-form-item>
                <a-form-item label="作业名称">
                    <a-input v-model="newWorkForm.name"></a-input>
                </a-form-item>
                <a-form-item label="开始/结束时间">
                    <a-range-picker @change="onChange">
                    </a-range-picker>
                </a-form-item>
                <a-button type="primary" @click="save1();newWorkOff()">保存</a-button>
            </form>
        </a-modal>
    </div>
</template>
<script>
import {api} from "../utils/api"
import {mapState, mapMutations} from "vuex"
// import { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } from 'constants'

const work_status = {
    "0": "待批改",
    "1": "需完善",
    "2": "已完成"
}
const HOST = "http://sandbox_api.estudy.chanke.xyz"
export default {
    props: ["teacher"],
    data() {
        return {
            newWorkForm: {
                org_id: "",
                name: "",
                start_time:"",
                end_time:"",
            },
            work_status,
            revisingWork: false,
            revisingAssignment: false,
            revisingForm: {
                status: "1",
                review: "",
            },
            downloadHost: HOST + "/teacher/download",
            uploadHost: HOST + "/teacher/upload",
            // columns: [{
            //     title: "课程",
            //     dataIndex: "org_name"
            // },{
            //     title: "作业名称",
            //     dataIndex: "name"
            // },{
            //     title: "开始-截止时间",
            //     customRender(text, record) {
            //         return `${record.start_time} ~ ${record.end_time}`
            //     }
            // },{
            //     title: "状态",
            //     customRender(text, record) {
            //         return `${record.student_count} 个学员 / ${record.work_count} 个提交` + 
            //         (record.work_count > 0 ? ` - ${record.work_update_time}` : "")
            //     }
            // },{
            //     title: "操作",
            //     scopedSlots: {
            //         customRender: "operation"
            //     }
            // },]
            workColumns: [{
                title: "学员名字",
                dataIndex: "user.full_name",
            },{
                title: "学号",
                dataIndex: "user.name",
            },{
                title: "提交的作业名称",
                dataIndex: "student_upload_name",
            },{
                title: "提交时间",
                dataIndex: "commit_time",
            },{
                title: "状态",
                customRender(text, record) {
                    return work_status[record.status];
                }
            },{
                title: "操作",
                scopedSlots: {
                    customRender: "operation"
                }
            },],
        }
    },
    computed: {
        newWork() {
            return this.$store.state.newWork
        },
        ...mapState("user", ["info"]),
        columns() {
            return [{
                title: "课程",
                dataIndex: "org_name"
            },{
                title: "作业名称",
                dataIndex: "name"
            },{
                title: "开始-截止时间",
                customRender(text, record) {
                    return `${record.start_time} ~ ${record.end_time}`
                }
            },{
                title: "状态",
                customRender(text, record) {
                    return `${record.student_count} 个学员 / ${record.work_count} 个提交` + 
                    (record.work_count > 0 ? ` - ${record.work_update_time}` : "")
                }
            },{
                title: "操作",
                scopedSlots: {
                    customRender: "operation"
                },
                key: "operation",
                filteredValue: this.revisingAssignment ? [this.revisingAssignment.assignment_id] : null,
                onFilter(value, record) {
                    return value === record.assignment_id
                }
            },]
        }
    },
    methods: {
        ...mapMutations(["newWorkOff"]),
        removeAssignment(id) {
            // console.log(this.teacher.assignments.findIndex(assignment =>  assignment.assignment_id === id))
            api.post("/teacher/deleteAssignment", {id}).then( () => {
                const index = this.teacher.assignments.findIndex(assignment =>  assignment.assignment_id === id)
                this.teacher.assignments.splice(index, 1);
                this.$message.info("删除成功")
            })
        },
        save() {
            const form = {
                id: this.revisingWork.id,
                review: this.revisingForm.review,
                status: this.revisingForm.status
            }
            api.post("/teacher/review", form).then(data => {
                Object.entries(data).forEach( item => this.$set(this.revisingWork, item[0], item[1]))
            }).finnally( () => {
                this.revisingWork = false;
            })
        },
        // 新建作业
        save1() {
            const form1 = {
                org_id : this.newWorkForm.org_id,
                name : this.newWorkForm.name,
                start_time : this.newWorkForm.start_time,
                end_time : this.newWorkForm.end_time
            }
            // console.log(form1.org_id);
            // api.defaults.headers.common['Token'] = 
            api.post("/teacher/createAssignment", form1, "{Token:info.token, Content-Type:application/x-www-form-urlencoded}")
            // .then( data => {
            //     // console.log(data)
            // }, err => {
            //     // console.log(err)
            // })
        },
        // 日期选择
        onChange(date, dateString) {
            this.newWorkForm.start_time = dateString[0]
            this.newWorkForm.end_time = dateString[1]
        },
    }
}
</script>
<style scoped>

</style>