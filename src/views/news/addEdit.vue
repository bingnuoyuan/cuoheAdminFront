<template>
  <div class="add-page">
    <el-form ref="news" :model="news" :rules="rules">
      <el-form-item label="发布人" required prop="nickName">
        <el-select v-model="news.nickName" placeholder="请选择" @change="handleAvatar">
          <el-option
            v-for="item in publisher"
            :key="item.id"
            :label="item.nickName"
            :value="item.nickName">
          </el-option>
        </el-select>
      </el-form-item>
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
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { topNews, topNewsadd, updateNewsTop } from '@/api/news'
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
      info: {},
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
    this.loadTopNews();
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
    loadTopNews(){
      let that = this;
      topNews().then(res=>{
        console.log(res)
        let tempArr = [];
        res.data.forEach(element => {
            tempArr.push(JSON.parse(element));
        });
        that.news = tempArr[0];
        console.log('news', that.news)
      })
    },
    onSubmit() {
      let that = this;
      this.$refs['news'].validate((valid) => {
        if (valid) {
          this.news.readCount = (this.news.readCount || 1);
          if(that.news._id){
            updateNewsTop(this.news).then(res=>{
              if(res.data && res.data.errcode >= 0){
                  this.$message({
                      message: '修改成功',
                      type: 'success'
                  })
              }else{
                  this.$message.error('修改失败')
              }
            })
          }else{
            topNewsadd(this.news).then((res)=>{
            if(res.data && res.data.errcode >= 0){
                this.$message({
                    message: '修改成功',
                    type: 'success'
                })
              }else{
                  this.$message.error('修改失败')
              }
            })
          }
          
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  }
}
</script>

<style>
.add-page{
    margin: 10px 30px;
}
</style>



