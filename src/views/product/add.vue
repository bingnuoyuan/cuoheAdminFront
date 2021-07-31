<template>
  <div class="add-page">
    <el-form ref="product" :model="product" :rules="rules">
      <el-form-item label="品牌logo" required prop="logo">
        <el-avatar v-if="brandLogo[0].download_url"  shape="square" :size="50" fit="fill" :src="brandLogo[0].download_url"></el-avatar>
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
      <el-form-item label="商品品牌" required prop="brand">
        <el-input v-model="product.brand"></el-input>
      </el-form-item>
      <el-form-item label="型号" required prop="model">
        <el-input v-model="product.model"></el-input>
      </el-form-item>
      <el-form-item label="名称" required prop="name">
        <el-input v-model="product.name"></el-input>
      </el-form-item>
      <!-- <el-form-item label="价格" required prop="price">
        <el-input v-model="product.price"></el-input>
      </el-form-item>
      <el-form-item label="历史价格" required prop="oldprice">
        <el-input v-model="product.oldprice"></el-input>
      </el-form-item> -->
      <p>产品详情</p>
      <el-form-item required prop="detail">
        <Tinymce :height="300" v-model="product.detail"></Tinymce>
      </el-form-item>
      <p>产品参数</p>
      <el-form-item label="" required prop="params">
        <Tinymce :height="300" v-model="product.params"></Tinymce>
      </el-form-item>
      <p>物流外库</p>
      <el-form-item label="" required prop="deliver">
        <Tinymce :height="300" v-model="product.deliver"></Tinymce>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">新增</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      title="提示"
      :visible.sync="centerDialogVisible"
      width="50%"
      :close-on-click-modal="false"
      center>
      <div class="dialog_body">
        <p><i class="el-icon-success success"></i></p>
        <span>新增成功，请选择继续新增或维护价格</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="continueAdd">继续新增</el-button>
        <el-button type="primary" @click="goPrice">维护价格</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchById, add } from '@/api/product'
import { itemList } from '@/api/item'
import Tinymce from '@/components/Tinymce'
import { avatarById } from '@/api/avatar'
let _baseURL = 'http://localhost:45236'
export default {
  data() {
    return {
      list: [],
      product:{},
      ItemList:[],
      brandLogo: [{}],
      uploadUrl:`${_baseURL}/avatar/upload`,
      loadImg: {},
      pid: [],
      centerDialogVisible:false,
      content: '',
      rules:{
        item: [
            { required: true, message: '请填写商品类别', trigger: 'change' }
        ],
        brand: [
            { required: true, message: '请填写品牌', trigger: 'change' }
        ],
        model: [
            { required: true, message: '请填写类别', trigger: 'change' }
        ],
        name: [
            { required: true, message: '请填写名称', trigger: 'change' }
        ],
        price: [
            { required: true, message: '请填写价格', trigger: 'change' }
        ],
        oldprice: [
            { required: true, message: '请填写历史价格', trigger: 'change' }
        ]
      }
    }
  },
  components: {Tinymce},
  created() {

  },
  methods: {
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
    handlePid(e){
      console.log('handlePid', e)
      let that = this;
      that.pid = [];
      this.ItemList.forEach(i => {
        if(e.includes(i.itemName)){
          that.pid.push(i.pid);
        }
      })
       console.log('pid', this.pid);
    },
    getItemList(){
      let that = this;
      itemList().then(res => {
        console.log(res)
        let tempArr = [];
        res.data.forEach(element => {
            tempArr.push(JSON.parse(element));
        });
        that.ItemList = tempArr;
        console.log('ItemList', that.ItemList)
      })
    },
    onSubmit() {
      let that = this;
      this.$refs['product'].validate((valid) => {
        if (valid) {
          console.log('product', this.product)
          this.product.pid = this.pid;
          this.product.historyPrice = [];
          add(this.product).then((res)=>{
            console.log(res)
            if(res.data && res.data.errcode == 0){
                that.centerDialogVisible = true;
                // this.$message({
                //     message: '新增成功',
                //     type: 'success'
                // })
                // this.$router.push('/product/list')
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
    goPrice(){
      this.$router.push('/product/price')
    },
    continueAdd(){
      this.centerDialogVisible = false;
    },
    onCancel() {
      this.$router.push('/product/list')
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



