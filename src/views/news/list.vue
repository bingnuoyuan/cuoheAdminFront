<template>
    <div class="product-page">
        <el-row>
            <el-col :span="24" class="right">
                <el-button type="primary" @click="managePublisher">管理发布人</el-button>
                <el-button type="primary" @click="onAdd">新增资讯</el-button>
                <el-button type="primary" @click="editTopNews">编辑置顶资讯</el-button>
            </el-col>
        </el-row>
        <el-table  v-loading="loading" :data="list" stripe>
            <el-table-column prop="nickName" label="发布人"> </el-table-column>
            <el-table-column prop="title" label="主题"> </el-table-column>
            <el-table-column prop="subtitle" label="简介"> </el-table-column>
            <el-table-column prop="readCount" label="阅读量"> </el-table-column>
            <el-table-column prop="interest" label="是否精选"> 
                <template slot-scope="scope">
                    <span style="color: #ff6600;" >{{ handleBool(scope.row.interest)}}</span>
                </template>  
            </el-table-column>
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
import { newsList, del } from '@/api/news'
import scroll from '@/utils/scroll'

export default{
    data() {
        return {
            list:[],
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
            this.$router.push(`/news/edit/${row._id}`)
        },
        managePublisher(){
            this.$router.push('/news/publisher')
        },
        editTopNews(){
            this.$router.push('/news/addEdit')
        },
        onAdd(){
            this.$router.push('/news/add')
        },
        getList() {
            let that = this;
            this.loading = true
            newsList({
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
        handleBool(t){
            return t == 'true'? '是': '否';
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