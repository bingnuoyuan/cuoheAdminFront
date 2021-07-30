<template>
  <div class="add-page">
    <el-form ref="bill" :model="bill" label-width="80px">
        <el-form-item label="所属会员" required prop="member">
          <el-input v-model="bill.member"></el-input>
        </el-form-item>
        <el-form-item label="寄出时间" required prop="date">
          <el-date-picker
          v-model="bill.date"
          type="date"
          placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="快递公司" required prop="deliverC">
          <el-select v-model="bill.deliverC" placeholder="请选择" >
            <el-option
              v-for="item in deliverCList"
              :key="item.id"
              :label="item.value"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号" required prop="deliverNo">
          <el-input v-model="bill.deliverNo"></el-input>
        </el-form-item>
      <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
        </el-form-item>
  </el-form>
  </div>
</template>

<script>
import { billById, updateBill } from '@/api/bill'
import Tinymce from '@/components/Tinymce'
export default {
  components: {Tinymce},
  data() {
    return {
      list: {},
      news: {},
      bill:{},
      member:{},
      deliverCList: [{
          id: '1',
          value: '顺丰快递'
      }],
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
    billById({
      id: this.$route.params.id
    }).then(res => {
      console.log(res)
      this.bill = res.data
    })
  },
  methods: {
    onSubmit() {
      let that = this;
      console.log('that.news', that.news)
      updateBill(that.bill).then((res)=>{
        console.log(res)
          if(res.data && res.data.modified > 0){
              that.$message({
                  message: '更新成功',
                  type: 'success'
              })
              this.$router.push('/bill/list')
          }else{
              that.$message.error('更新失败')
          }
      })
    },
    onCancel() {
      this.$router.push('/bill/list')
    },
  }
}
</script>

<style scoped>
</style>



