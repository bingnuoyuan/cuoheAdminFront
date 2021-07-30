<template>
    <div class="product-page">
        <el-row>
            <el-col :span="24" class="right">
                <el-button type="primary" @click="onAdd">新增订单</el-button>
            </el-col>
        </el-row>
        <el-table  v-loading="loading" :data="list" stripe>
            <el-table-column prop="orderId" label="订单号"> </el-table-column>
            <el-table-column prop="status" label="订单状态"> 
                <template slot-scope="scope">
                    <span style="color: #ff6600;" >{{ handleStatus(scope.row.status)}}</span>
                </template>  
            </el-table-column>
            <el-table-column prop="member" label="所属会员"> </el-table-column>
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
import { orderList, del } from '@/api/order'
import scroll from '@/utils/scroll'

export default{
    data() {
        return {
            list:[],
            // 删除歌单的对话框是否显示
            delDialogVisible: false,
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
            this.$router.push(`/order/edit/${row._id}`)
        },
        onAdd(){
            this.$router.push('/order/add')
        },
        getList() {
            let that = this;
            this.loading = true
            orderList({
                start: this.list.length,
                count: this.count
            }).then(res => {
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
        handleStatus(status){
            let s =status;
            switch(s){
                case '1':
                    return '未完成'
                    break;
                // case '2':
                //     return '已支付'
                //     break;
                case '3':
                    return '已完成'
                    break;
            }
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