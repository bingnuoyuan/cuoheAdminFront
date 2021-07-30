<template>
  <div class="add-page">
    <el-form ref="news" :model="news" :rules="rules">
      
      <el-form-item label="发布人" required prop="nickName">
        <el-input v-model="news.nickName"></el-input>
      </el-form-item>
      <el-form-item label="主题" required prop="title">
        <el-input v-model="news.title"></el-input>
      </el-form-item>
      <el-form-item label="内容" required prop="content">
        <el-input v-model="news.content"></el-input>
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
import { fetchById, update } from '@/api/news'
export default {
  data() {
    return {
      list: {},
      news: {},
      rules:{
        nickName: [
            { required: true, message: '请填写发布人', trigger: 'change' }
        ],
        title: [
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
    fetchById({
      id: this.$route.params.id
    }).then(res => {
      console.log(res)
      this.news = res.data
    })
  },
  methods: {
    onSubmit() {
      let that = this;
      console.log('that.news', that.news)
      update(that.news).then((res)=>{
        console.log(res)
          if(res.data && res.data.modified > 0){
              that.$message({
                  message: '更新成功',
                  type: 'success'
              })
              this.$router.push('/news/list')
          }else{
              that.$message.error('更新失败')
          }
      })
    },
    onCancel() {
      this.$router.push('/news/list')
    },
  }
}
</script>

<style scoped>
</style>



