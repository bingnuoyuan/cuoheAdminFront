<template>
    <div class="product-page">
        <el-row>
            <el-col :span="24" class="right">
                <el-button type="primary" @click="onAdd">新增发布人</el-button>
            </el-col>
        </el-row>
        <el-table  v-loading="loading" :data="list" stripe>
            <el-table-column prop="nickName" label="发布人名称"> </el-table-column>
            <el-table-column prop="download_url" label="头像">
                <template slot-scope="scope">
                    <el-avatar shape="square" :size="50" fit="fill" :src="scope.row.download_url"></el-avatar>
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
     <!--新增发布人对话框-->
    <el-dialog title="新增发布人" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
        <el-form :model="publisherInfo">
          <el-form-item label="发布人名称" :label-width="formLabelWidth" required>
            <el-input v-model="publisherInfo.nickName" ></el-input>
          </el-form-item>
          <el-form-item label="上传头像" :label-width="formLabelWidth" required>
            <el-upload
                class="upload-demo"
                :action="uploadUrl" 
                :on-success="uploadSuccess"
                :show-file-list="false"
            >
                <el-button v-if="!loadImg.download_url" size="small" type="primary">点击上传</el-button>
                <el-avatar v-else shape="square" :size="50" fit="fill" :src="loadImg.download_url"></el-avatar>
            </el-upload>
            
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="doSave">确 定</el-button>
        </div>
      </el-dialog> 
      <!--编辑发布人对话框-->
    <el-dialog title="编辑发布人" :visible.sync="dialogEditVisible" :close-on-click-modal="false">
        <el-form :model="editInfo">
          <el-form-item label="发布人名称" :label-width="formLabelWidth" required>
            <el-input v-model="editInfo.nickName" ></el-input>
          </el-form-item>
          <el-form-item label="上传头像" :label-width="formLabelWidth" required>
            <el-upload
                class="upload-demo"
                :action="uploadUrl" 
                :on-success="uploadSuccess"
                :show-file-list="false"
            >
                <el-button v-if="!loadImg.download_url" size="small" type="primary">点击上传</el-button>
                <el-avatar v-else shape="square" :size="50" fit="fill" :src="loadImg.download_url"></el-avatar>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEditVisible = false">取 消</el-button>
          <el-button type="primary" @click="doEdit">确 定</el-button>
        </div>
      </el-dialog> 
    </div>
</template>

<script>
import { publisherList, del, publisherAdd, update } from '@/api/publisher';
import { avatarById } from '@/api/avatar'
import {syncData, syncDataTop} from '@/api/news'
import scroll from '@/utils/scroll'
let _baseURL = 'http://199.180.116.241:45235'
// let _baseURL = 'http://localhost:45235'
export default{
    data() {
        return {
            list:[],
            delDialogVisible: false,
            info: {},
            formLabelWidth: '120px',
            dialogFormVisible: false,
            publisherInfo: {},
            uploadUrl:`${_baseURL}/avatar/upload`,
            loadImg: {},
            dialogEditVisible: false,
            editInfo: {}
        }
    },
    created(){
        this.getList()
    },
    mounted(){

    },
    methods:{
        onEdit(row) {
            this.dialogEditVisible = true;
            this.editInfo = row;
            this.loadImg.download_url = this.editInfo.download_url
        },
        managePublisher(){
            this.$router.push('/news/publisher')
        },
        editTopNews(){
            this.$router.push('/news/addEdit')
        },
        onAdd(){
            this.publisherInfo = {};
            this.dialogFormVisible = true;
        },
        uploadSuccess(res) {
        if (res.id_list.length > 0) {
            this.$message({
            message: '上传成功',
            type: 'success'
            })
            this.getAvatar(res.id_list[0])
            }   
        },
        getAvatar(id){
            let that = this;
            avatarById({
                _id: id
            }).then(res => {
                console.log("avatar",res)
                if(res.data){
                    that.loadImg = res.data[0]
                }
            })
        },
        doEdit(){
            let that = this;
            that.editInfo.download_url = that.loadImg.download_url;
            that.editInfo.fileid = that.loadImg.fileid;
            that.editInfo.avatarId = that.loadImg._id;
            update(that.editInfo).then((res)=>{
                console.log(res)
                if(res.data && res.data.modified > 0){
                    that.$message({
                        message: '更新成功',
                        type: 'success'
                    })
                    that.dialogEditVisible = false;
                    //编辑成功后同步到news的发布人
                    let _syncData = {
                        nickName: this.editInfo.nickName,
                        avatarUrl: this.editInfo.download_url
                    }
                    syncData(_syncData).then(res=>{
                        console.log(res)
                    })
                    syncDataTop(_syncData).then(res=>{
                        console.log(res)
                    })

                }else{
                    that.$message.error('更新失败')
                }
            })
        },
        doSave(){
            let that = this;
            that.publisherInfo.download_url = that.loadImg.download_url;
            that.publisherInfo.fileid = that.loadImg.fileid;
            that.publisherInfo.avatarId = that.loadImg._id;
            publisherAdd(that.publisherInfo).then(res => {
                if(res.data && res.data.errcode >= 0){
                    this.$message({
                        message: '新增成功',
                        type: 'success'
                    })
                    that.getList();
                    that.dialogFormVisible = false;
                }else{
                    this.$message.error('新增失败')
                }
            })
        },
        getList() {
            let that = this;
            this.loading = true
            publisherList().then(res => {
                console.log(res)
                let tempArr = [];
                res.data && res.data.length && res.data.forEach(element => {
                    tempArr.push(JSON.parse(element));
                });
                that.list = tempArr;
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