<template>
  <div>
    <el-form ref="form" :model="list" label-width="80px">
      <el-form-item label="商品类别">
        <span>{{list.item}}</span>
      </el-form-item>
      <el-form-item label="商品品牌">
        <el-input v-model="list.brand"></el-input>
      </el-form-item>
      <el-form-item label="型号">
        <el-input v-model="list.model"></el-input>
      </el-form-item>
      <el-form-item label="名称">
        <el-input v-model="list.item"></el-input>
      </el-form-item>
      <el-form-item label="产品详情">
        <Tinymce :height="300" v-model="list.detail"></Tinymce>
      </el-form-item>
      <el-form-item label="产品参数">
        <Tinymce :height="300" v-model="list.params"></Tinymce>
      </el-form-item>
      <el-form-item label="物流外库">
        <Tinymce :height="300" v-model="list.deliver"></Tinymce>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">更新</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { fetchById, update } from '@/api/product'
import Tinymce from '@/components/Tinymce'
export default {
  data() {
    return {
      list: {},
      centerDialogVisible:false
    }
  },
  components: {Tinymce},
  created() {
    fetchById({
      id: this.$route.params.id
    }).then(res => {
      console.log(res)
      this.list = res.data
    })
  },
  methods: {
    onSubmit() {
      let that = this;
      update(that.list).then((res)=>{
        console.log(res)
          if(res.data ){
            if(res.data.modified > 0){
              that.$message({
                  message: '更新成功',
                  type: 'success'
              })
            }else if(res.data.modified == 0){
              that.$message({
                  message: '更新了0条数据',
                  type: 'success'
              })
            }
            this.$router.push('/product/list')
          }else{
              that.$message.error('更新失败')
          }
      })
    },
    onCancel() {
      this.$router.push('/product/list')
    },
  }
}
</script>

<style>
.dialog_body{
  text-align: center;
}
.dialog_body i{
  font-size: 100px;
}
.dialog_body i.success{
  color: #67C23A;
}
</style>



