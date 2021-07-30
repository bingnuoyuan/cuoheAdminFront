<template>
    <div class="product-page">
        <el-row>
            <el-col :span="24" class="right">
                <el-button type="primary" @click="onAdd">新增发票</el-button>
            </el-col>
        </el-row>
        <el-table  v-loading="loading" :data="list" stripe>
            <el-table-column prop="member" label="会员名"> </el-table-column>
            <!-- <el-table-column prop="createTime" label="创建时间"> 
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ formMateDate(scope.row.createTime) }}</span>
                </template>
            </el-table-column> -->
            <el-table-column prop="date" label="寄出时间">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ formMateDate(scope.row.date) }}</span>
                </template>    
            </el-table-column>
            <el-table-column prop="deliverC" label="快递公司"> </el-table-column>
            <el-table-column prop="deliverNo" label="物流单号"> </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="onEdit(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="onDel(scope.row)">删除</el-button>
                </template>
            </el-table-column>
      </el-table>
      <!-- 确认删除的对话框 -->
    <el-dialog title="提示" :visible.sync="delDialogVisible" width="30%" :close-on-click-modal="false">
        <span>确定删除该条数据吗</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="delDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="doDel">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
import { memberList,update } from '@/api/member'
import { save,updateBill,billList, del} from '@/api/bill'
import scroll from '@/utils/scroll'

export default{
    data() {
        return {
            list:[],
            member:[],
            delDialogVisible: false,
            dialogFormVisible: false,
            userinfo: {},
            phoneData: {},
            formLabelWidth: '120px',
            info: {}
        }
    },
    created(){
        this.getList()
    },
    mounted(){

    },
    methods:{
        onEdit(row) {
            this.$router.push(`/bill/edit/${row._id}`)
        },
        formMateDate(d){
            let date = new Date(d);
            let fmt = 'yyyy-MM-dd hh:mm:ss'
            let o = {
            'M+': date.getMonth() + 1, // 月份
            'd+': date.getDate(), // 日
            'h+': date.getHours(), // 小时
            'm+': date.getMinutes(), // 分钟
            's+': date.getSeconds(), // 秒
            }
        
            if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, date.getFullYear())
            }
            for (let k in o) {
            if (new RegExp('(' + k + ')').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, o[k].toString().length == 1 ? '0' + o[k] : o[k])
            }
            }
        
            // console.log(fmt)
            return fmt
        },
        onAdd(){
            this.$router.push('/bill/index')
        },
        getList() {
            let that = this;
            this.loading = true
            billList().then(res => {
                console.log(res)
                let tempArr = [];
                res.data.forEach(element => {
                    tempArr.push(JSON.parse(element));
                });
                that.list = tempArr;
                if (tempArr && tempArr.length < that.count) {
                scroll.end()
                }
                that.loading = false
                console.log("list", that.list)
            })
        },
        onDel(row) {
            this.delDialogVisible = true
            this.info.id = row._id
        },
        doDel() {
            del({ id: this.info.id }).then(res => {
                this.delDialogVisible = false
                if (res.data.deleted > 0) {
                this.playlist = []
                this.getList()
                this.$message({
                    message: '删除成功',
                    type: 'success'
                })
                } else {
                this.$message.error('删除失败')
                }
            })
        },
        doSave(){
            update(this.info).then(res => {
                this.delDialogVisible = false
                if (res.data.errmsg == 'ok') {
                    this.playlist = []
                    this.getList()
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    })
                    this.dialogFormVisible = false;
                } else {
                    this.$message.error('保存失败')
                }
            })
        }
    }
}
</script>

<style scoped>
.product-page{
    margin: 10px 30px;
}
.right{
    text-align: right;
}
</style>