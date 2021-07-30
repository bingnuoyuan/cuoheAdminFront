<template>
  <div class="add-page">
    <el-form ref="aboutus" :model="aboutus" :rules="rules">
      
      <el-form-item label="邮箱" required prop="email">
        <el-input v-model="aboutus.email"></el-input>
      </el-form-item>
      <el-form-item label="客服电话" required prop="phone">
        <el-input v-model="aboutus.phone"></el-input>
      </el-form-item>
      <el-form-item label="公司网址" required prop="url">
        <el-input v-model="aboutus.url"></el-input>
      </el-form-item>
      <el-form-item label="用户协议" required prop="portol">
        <el-input type="textarea" v-model="aboutus.portol"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { aboutus, update } from '@/api/aboutus'
export default {
  data() {
    return {
      list: {},
      aboutus: {},
      rules:{
        email: [
            { required: true, message: '请填写邮箱', trigger: 'change' }
        ],
        phone: [
            { required: true, message: '请填写客服电话', trigger: 'change' }
        ],
        url: [
            { required: true, message: '请填写公司网址', trigger: 'change' }
        ],
        portol: [
            { required: true, message: '请填写用户协议', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    aboutus({
        start: this.list.length,
        count: this.count
    }).then(res => {
        console.log(res)
        let tempArr = [];
        res.data.forEach(element => {
            tempArr.push(JSON.parse(element));
        });
        that.aboutus = tempArr;
        if (tempArr && tempArr.length < that.count) {
        scroll.end()
        }
        that.loading = false
    })
  },
  methods: {
    onSubmit() {
      let that = this;
      update(that.aboutus).then((res)=>{
        console.log(res)
          if(res.data && res.data.modified > 0){
              that.$message({
                  message: '更新成功',
                  type: 'success'
              })
          }else{
              that.$message.error('更新失败')
          }
      })
    }
  }
}
</script>

<style scoped>
</style>



