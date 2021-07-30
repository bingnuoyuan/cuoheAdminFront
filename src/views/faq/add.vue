<template>
  <div class="add-page">
    <el-form ref="faq" :model="faq" :rules="rules">
      <el-form-item label="主题" required prop="title">
        <el-input v-model="faq.title"></el-input>
      </el-form-item>
      <el-form-item label="内容" required prop="content">
        <el-input v-model="faq.content"></el-input>
      </el-form-item>
        <el-button type="primary" @click="onSubmit">新增</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { fetchById, add } from '@/api/faq'
export default {
  data() {
    return {
      list: [],
      faq:{},
      rules:{
        title: [
            { required: true, message: '请填写主题', trigger: 'change' }
        ],
        content: [
            { required: true, message: '请填写内容', trigger: 'change' }
        ]
      }
    }
  },
  created() {
 
  },
  methods: {
    onSubmit() {
      this.$refs['faq'].validate((valid) => {
        if (valid) {
          add(this.faq).then((res)=>{
            if(res.data && res.data.errcode >= 0){
                this.$message({
                    message: '新增成功',
                    type: 'success'
                })
                this.$router.push('/faq/list')
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
      this.$router.push('/faq/list')
    }
  }
}
</script>

<style scoped>
.add-page{
    margin: 10px 30px;
}
</style>



