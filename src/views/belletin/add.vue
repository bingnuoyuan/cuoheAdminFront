<template>
  <div class="add-page">
    <el-form ref="belletin" :model="belletin" :rules="rules">
      <!--判断平台发布人是否已维护，如果有在下啦菜单里选，如果没有，新增-->
      <el-form-item label="发布人">
        <div v-if="publisher[0].nickName">{{publisher[0].nickName}} </div>
        <el-button v-if="!publisher[0].nickName" type="primary" @click="onAdd">新增发布人</el-button>
      </el-form-item>
      <el-form-item v-if="publisher[0].download_url" label="发布人头像">
        <el-avatar shape="square" :size="50" fit="fill" :src="publisher[0].download_url"></el-avatar>
      </el-form-item>
      <el-form-item label="主题" required prop="title">
        <el-input v-model="belletin.title"></el-input>
      </el-form-item>
      <el-form-item label="简介" required prop="subtitle">
        <el-input v-model="belletin.subtitle"></el-input>
      </el-form-item>
      <el-form-item label="阅读量" required prop="readCount">
        <el-input v-model="belletin.readCount"></el-input>
      </el-form-item>
      <p>内容</p>
      <el-form-item label="内容" required prop="content">
        <Tinymce :height="300" v-model="belletin.content"></Tinymce>
      </el-form-item>
      <el-form-item label="是否精选" required >
        <el-switch v-model="belletin.interest"> </el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">新增</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
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
  </div>
</template>

<script>
import { fetchById, add } from '@/api/belletin'
import { bulletinAvatar, addPlatformer} from '@/api/platform';
import { avatarById } from '@/api/avatar'
import Tinymce from '@/components/Tinymce'
//let _baseURL = 'http://localhost:45235'
let _baseURL = 'http://199.180.116.241:45235'
export default {
  components: {Tinymce},
  data() {
    return {
      list: [],
      belletin:{},
      publisher: [{}],
      publisherInfo: {},
      formLabelWidth: '120px',
      uploadUrl:`${_baseURL}/avatar/upload`,
      dialogFormVisible:false,
      loadImg: {},
      rules:{
        nickName: [
            { required: true, message: '请填写发布人', trigger: 'change' }
        ],
        title: [
            { required: true, message: '请填写主题', trigger: 'change' }
        ],
        subtitle: [
            { required: true, message: '请填写主题', trigger: 'change' },
            { min: 1, max: 60, message: '长度在 60 个字符以内', trigger: 'blur' }
        ],
        readCount: [
            { required: true, message: '请填写主题', trigger: 'change' }
        ],
        content: [
            { required: true, message: '请填写内容', trigger: 'change' }
        ],
        interest: [
            { required: true, message: '请选择是否精选', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    let that = this;
    that.getPlatformer();
  },
  methods: {
    getPlatformer(){
      let that = this;
      bulletinAvatar().then(res => {
        console.log(res)
        let tempArr = [];
        res.data && res.data.length && res.data.forEach(element => {
            tempArr.push(JSON.parse(element));
        });
        that.publisher = tempArr;
        // that.belletin.nickName = that.publisher[0].nickName;
        // that.belletin.download_url = that.publisher[0].download_url;
        console.log('that.belletin', that.belletin);
        
      })
    },
    handleAvatar(e){
      let that = this;
      console.log(e)
      this.publisher.forEach(i =>{
        if(i._id == e){
          that.publisherInfo = i;
        }
      })
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
    doSave(){
      let that = this;
      that.publisherInfo.download_url = that.loadImg.download_url;
      that.publisherInfo.fileid = that.loadImg.fileid;
      that.publisherInfo.avatarId = that.loadImg._id;
      addPlatformer(that.publisherInfo).then(res => {
          if(res.data && res.data.errcode >= 0){
              this.$message({
                  message: '添加成功',
                  type: 'success'
              })
              that.getPlatformer();
              that.dialogFormVisible = false;
          }else{
              this.$message.error('添加失败')
          }
      })
    },
    onAdd(){
      this.publisherInfo = {};
      this.dialogFormVisible = true;
    },
    onSubmit() {
      let that = this;
      this.$refs['belletin'].validate((valid) => {
        if (valid) {
          this.belletin.nickName = that.publisher[0].nickName;
          this.belletin.avatarUrl = that.publisher[0].download_url;
          add(this.belletin).then((res)=>{
            if(res.data && res.data.errcode >= 0){
                this.$message({
                    message: '新增成功',
                    type: 'success'
                })
                this.$router.push('/belletin/list')
            }else{
                this.$message.error('新增失败')
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    onCancel() {
      this.$router.push('/belletin/list')
    }
  }
}
</script>

<style>
.add-page{
    margin: 10px 30px;
}
</style>



