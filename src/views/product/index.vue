<template>
    <div class="product-page">
        <el-row>
            <el-col :span="24" class="right">
                <el-button type="primary" @click="onAdd">新增类别</el-button>
            </el-col>
        </el-row>
        <el-table  v-loading="loading" :data="list" stripe>
            <el-table-column prop="itemName" label="类别"> </el-table-column>
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
      <!--新增对话框-->
      <el-dialog title="新增类别" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
        <el-form :model="info">
          <el-form-item label="类别名" :label-width="formLabelWidth">
            <el-input v-model="info.itemName" ></el-input>
          </el-form-item>
          <!-- <el-form-item label="pid" :label-width="formLabelWidth">
            <el-input v-model="info.pid" ></el-input>
          </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="doSave">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import { itemList, del,add } from '@/api/item'
import scroll from '@/utils/scroll'

export default{
    data() {
        return {
            list:[],
            // 删除歌单的对话框是否显示
            delDialogVisible: false,
            dialogFormVisible:false,
            info: {},
            formLabelWidth: '120px'
        }
    },
    created(){
        this.getList()
    },
    mounted(){

    },
    methods:{
        onEdit(row) {
            this.dialogFormVisible = true;
            this.info = row;
        },
        onAdd(){
            this.dialogFormVisible = true;
            this.info = {};
        },
        doSave(){
            let that = this;
            this.loading = true;
            this.info.pid = new Date().getTime();
            add(this.info).then((res)=>{
            console.log(res)
            if(res.data && res.data.errcode == 0){
                this.$message({
                    message: '新增成功',
                    type: 'success'
                })
                that.getList();
                this.dialogFormVisible = false;
            }else{
                this.$message.error('新增失败')
            }
          })
        },
        getList() {
            let that = this;
            this.loading = true
            itemList({
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
                // console.log('list', that.list);
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