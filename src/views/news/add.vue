<template>
  <div class="add-page">
    <el-form ref="news" :model="news" :rules="rules">
      <el-form-item label="发布人" required prop="nickName">
        <el-select v-model="news.nickName" placeholder="请选择" @change="handleAvatar">
          <el-option
            v-for="item in publisher"
            :key="item.id"
            :label="item.nickName"
            :value="item._id">
          </el-option>
        </el-select>
      </el-form-item>
<!-- 
      <el-form-item label="头像" required prop="nickName">
        <el-input v-model="news.avatarUrl"></el-input>
      </el-form-item> -->
      <el-form-item label="主题" required prop="title">
        <el-input v-model="news.title"></el-input>
      </el-form-item>
      <el-form-item label="简介" required prop="subtitle">
        <el-input v-model="news.subtitle"></el-input>
      </el-form-item>
      <el-form-item label="阅读量" required prop="readCount">
        <el-input v-model="news.readCount"></el-input>
      </el-form-item>
      <p>内容</p>
      <el-form-item label="内容" required prop="content">
        <Tinymce :height="300" v-model="news.content"></Tinymce>
      </el-form-item>
      <el-form-item label="是否精选" required >
        <el-switch v-model="news.interest"> </el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">新增</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { fetchById, add } from '@/api/news'
import { publisherList} from '@/api/publisher';
import Tinymce from '@/components/Tinymce'
export default {
  components: {Tinymce},
  data() {
    return {
      list: [],
      news:{},
      publisher: [],
      publisherInfo: {},
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
    publisherList().then(res => {
      console.log(res)
      let tempArr = [];
      res.data && res.data.length && res.data.forEach(element => {
          tempArr.push(JSON.parse(element));
      });
      that.publisher = tempArr;
    })
  },
  methods: {
    handleAvatar(e){
      let that = this;
      console.log(e)
      this.publisher.forEach(i =>{
        if(i._id == e){
          that.publisherInfo = i;
        }
      })
    },
    onSubmit() {
      let that = this;
      this.$refs['news'].validate((valid) => {
        if (valid) {
          this.news.nickName = that.publisherInfo.nickName;
          this.news.avatarUrl = that.publisherInfo.download_url;
          add(this.news).then((res)=>{
            if(res.data && res.data.errcode >= 0){
                this.$message({
                    message: '新增成功',
                    type: 'success'
                })
                this.$router.push('/news/list')
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
      this.$router.push('/news/list')
    },
    addItem() {
      let that = this;
      this.$prompt('请输入商品类别', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '请输入商品类别'
      }).then(({ value }) => {
        this.$message({
          type: 'success',
          message: '新增的商品类别是: ' + value
        });
        that.list.push({
          item: value,
          id: new Date().getTime()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });       
      });
    }
  }
}
</script>

<style>
.add-page{
    margin: 10px 30px;
}
</style>



