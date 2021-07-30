<template>
    <div class="product-page">
        <el-table  v-loading="loading" :data="list" stripe>
            <el-table-column prop="userinfo.nickName" label="会员名"> </el-table-column>
            <el-table-column prop="phoneData.phoneNumber" label="手机号"> </el-table-column>
            <el-table-column prop="userinfo.level" label="会员等级"> </el-table-column>
            <el-table-column prop="userinfo.province" label="所在地"> </el-table-column>

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
      <!--编辑对话框-->
      <el-dialog title="会员信息" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
        <el-form :model="info">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="info.nickName" ></el-input>
          </el-form-item>
          <el-form-item label="用户等级" :label-width="formLabelWidth">
            <el-select placeholder="请选择用户等级" v-model="info.level">
              <el-option label="VIP1" value="VIP1"></el-option>
              <el-option label="VIP2" value="VIP2"></el-option>
              <el-option label="VIP3" value="VIP3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input v-model="info.remark" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="doSave">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import { memberList, del,update } from '@/api/member'
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
            this.dialogFormVisible = true;
            this.info = row.userinfo;
            this.info._id = row._id;
        },
        getList() {
            let that = this;
            this.loading = true
            memberList({
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