<template>
  <div class="add-page">
    <el-form ref="order" :model="order" :rules="rules">
      <el-form-item label="所属会员" required prop="member">
        <el-select v-model="order.member" placeholder="请选择" >
          <el-option
            v-for="item in member"
            :key="item.id"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="订单号" >
        <span>系统自动生成</span>
      </el-form-item>
      <el-form-item label="采购日期" required prop="bargain">
        <el-date-picker
          v-model="order.bargain"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="剩余未提" required prop="undeliver">
        <el-input v-model="order.undeliver" style="width: 70%;"></el-input>
      </el-form-item>
      <el-form-item label="订单状态" required prop="status">
        <el-select v-model="order.status" placeholder="请选择" >
          <el-option
            v-for="item in statusDic"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="产品信息" required>
        <div class="listInfo">
          <div v-for="(item, index) in order.productInfo" v-model="order.productInfo">
              <span class="label">产品：</span>
              <span class="value">{{item.name}}</span>
              <span class="label">型号：</span>
              <span class="value">{{item.type}}</span>
              <span class="label">数量：</span>
              <span class="value">{{item.num}}</span>
              <span class="label">单价：</span>
              <span class="value">{{item.price}}</span>
              <span class="btn-group">
                <el-button class="edit" type="text" size="mini" @click="editPro(item, index)">编辑</el-button>
                <el-button class="del" type="text" size="mini" @click="del('productInfo', index)">删除</el-button>
              </span>
          </div>
          <el-button type="primary" @click="addProduct">新增产品信息</el-button>
        </div>
      </el-form-item>
      <el-form-item label="合同信息" required >
        <el-upload
          v-model="order.contractInfo"
          :action="uploadUrl"
          list-type="picture-card"
          :on-success="uploadSuccess"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" :close-on-click-modal="false">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="提货信息" required>
        <div class="listInfo">
          <div v-for="(item,index) in order.deliverInfo"  v-model="order.deliverInfo">
              <span class="label">提货日期</span>
              <span class="value">{{formMateDate(item.date)}}</span>
              <span class="label">数量：</span>
              <span class="value">{{item.num}}</span>
              <span class="btn-group">
                <el-button class="edit" type="text" size="mini" @click="editDeliver(item, index)">编辑</el-button>
                <el-button class="del" type="text" size="mini" @click="del('deliverInfo', index)">删除</el-button>
              </span>
          </div>
          <el-button type="primary" @click="addDeliver">新增提货信息</el-button>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">新增</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="新增产品信息" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :model="productAdd">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="productAdd.name" ></el-input>
        </el-form-item>
        <el-form-item label="型号" :label-width="formLabelWidth">
          <el-input v-model="productAdd.type" ></el-input>
        </el-form-item>
        <el-form-item label="数量" :label-width="formLabelWidth">
          <el-input v-model="productAdd.num" ></el-input>
        </el-form-item>
        <el-form-item label="单价" :label-width="formLabelWidth">
          <el-input v-model="productAdd.price" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="doSave">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新增提货信息" :visible.sync="dialogDeliverVisible" :close-on-click-modal="false">
      <el-form :model="deliverAdd">
        <el-form-item label="提货日期" :label-width="formDeliverWidth">
            <el-date-picker
            v-model="deliverAdd.date"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="数量" :label-width="formDeliverWidth">
          <el-input v-model="deliverAdd.num" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDeliverVisible = false">取 消</el-button>
        <el-button type="primary" @click="doSaveDeliver">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 确认删除的对话框 -->
    <el-dialog title="提示" :visible.sync="delDialogVisible" width="30%" :close-on-click-modal="false">
      <span>确定删除该条数据吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doDel">确 定</el-button>
      </span>
    </el-dialog>
    <!--产品信息编辑框-->
    <el-dialog title="编辑产品信息" :visible.sync="dialogEditVisible" :close-on-click-modal="false">
      <el-form :model="productEdit">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="productEdit.name" ></el-input>
        </el-form-item>
        <el-form-item label="型号" :label-width="formLabelWidth">
          <el-input v-model="productEdit.type" ></el-input>
        </el-form-item>
        <el-form-item label="数量" :label-width="formLabelWidth">
          <el-input v-model="productEdit.num" ></el-input>
        </el-form-item>
        <el-form-item label="单价" :label-width="formLabelWidth">
          <el-input v-model="productEdit.price" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="doEdit">确 定</el-button>
      </div>
    </el-dialog>
    <!--编辑提货信息对话框-->
    <el-dialog title="编辑提货信息" :visible.sync="dialogDeliverEditVisible" :close-on-click-modal="false">
      <el-form :model="deliverEdit">
        <el-form-item label="提货日期" :label-width="formDeliverWidth">
            <el-date-picker
            v-model="deliverEdit.date"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="数量" :label-width="formDeliverWidth">
          <el-input v-model="deliverEdit.num" ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDeliverEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="doEditDeliver">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchById, add } from '@/api/order'
import { memberList } from '@/api/member'
import { fetchList } from '@/api/product'
import Tinymce from '@/components/Tinymce'
import { avatarById } from '@/api/avatar'
let _baseURL = 'http://199.180.116.241:45235'
//let _baseURL = 'http://localhost:45235'
export default {
  components: {Tinymce},
  data() {
    return {
      delDialogVisible: false,
      delId: '',
      delIndex: 0,
      uploadUrl: `${_baseURL}/avatar/upload`,
      dialogImageUrl: '',
      dialogVisible: false,
      dialogFormVisible: false,
      dialogDeliverVisible: false,
      dialogDeliverEditVisible:false,
      dialogEditVisible:false,
      list: [],
      product:[],
      order:{
        productInfo: [],
        deliverInfo: [],
        contractInfo: []
      },
      member:[],
      productData:[],
      productAdd: {},
      productEdit: {},
      productEditIndex: 0,
      productInfo: [],
      deliverAdd:{},
      deliverEdit: {},
      deliverEditIndex: 0,
      deliverInfo:[],
      loadImg:[],
      formLabelWidth: '120px',
      formDeliverWidth: '80px',
      rules:{
        member: [
            { required: true, message: '请选择所属会员', trigger: 'change' }
        ],
        contractId: [
            { required: true, message: '请填写合同号', trigger: 'change' }
        ],
        product: [
            { required: true, message: '请选择关联产品', trigger: 'change' }
        ],
        contract: [
            { required: true, message: '请填写合同信息', trigger: 'change' }
        ],
        deliver: [
            { required: true, message: '请填写提货信息', trigger: 'change' }
        ]
      },
      statusDic:[{
        value: '1',
        label: '未完成'
      },{
        value: '3',
        label: '已完成'
      }]
    }
  },
  created() {
    this.loadMember();
    this.loadPro();
  },
  methods: {
    formMateDate(d){
      let date = new Date(d);
      let fmt = 'yyyy-MM-dd hh:mm:ss'
      let o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分钟
      's+': date.getSeconds(), // 秒
      }
  
      if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, date.getFullYear())
      }
      for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, o[k].toString().length == 1 ? '0' + o[k] : o[k])
      }
      }
      return fmt
    },
    uploadSuccess(res) {
    if (res.id_list.length > 0) {
        this.getAvatar(res.id_list[0])
      }   
    },
    editDeliver(item, index){
      this.deliverEdit = item;
      this.deliverEditIndex = index;
      this.dialogDeliverEditVisible = true;
    },
    
    editPro(item, index){
      this.productEdit = item;
      this.productEditIndex = index;
      this.dialogEditVisible = true;
    },
    del(name,index){
      this.delDialogVisible = true;
      this.delId = name;
      this.delIndex = index;
    },
    doEdit(){
      this.order.productInfo[this.productEditIndex] = this.productEdit;
      this.dialogEditVisible = false;
    },
    doEditDeliver(){
      this.order.deliverInfo[this.deliverEditIndex] = this.deliverEdit;
      this.dialogDeliverEditVisible = false;
    },
    doDel(){
      this.order[this.delId].splice(this.delIndex, 1);
      this.delDialogVisible = false;
    },
    getAvatar(id){
        let that = this;
        avatarById({
            _id: id
        }).then(res => {
            console.log("avatar",res)
            if(res.data){
                that.loadImg.push(res.data[0]);
                console.log('that.loadImg', that.loadImg)
            }
        })
    },
    addProduct(){
      this.dialogFormVisible = true
    },
    addDeliver(){
      this.dialogDeliverVisible = true
    },
    doSave(){
      this.productAdd.createTime = new Date().getTime();
      this.order.productInfo.push(this.productAdd);
      console.log('this.order.productInfo', this.order.productInfo)
      this.productAdd = {}
      this.dialogFormVisible = false;
    },
    doSaveDeliver(){
      this.deliverAdd.createTime = new Date().getTime();
      this.order.deliverInfo.push(this.deliverAdd);
      this.deliverAdd = {}
      this.dialogDeliverVisible = false;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    loadPro(){
      let that = this;
      fetchList().then(res => {
        let tempArr = [];
        res.data.forEach(element => {
          let _name = JSON.parse(element).name;
          let _id = JSON.parse(element)._id;
            tempArr.push({
              name: _name,
              id: _id
            });
        });
        console.log("product",tempArr)
        that.product = tempArr;
    })
    },
    loadMember(){
      let that = this;
      memberList().then(res => {
        console.log(res)
        let tempArr = [];
        res.data.forEach(element => {
          let _name = JSON.parse(element).userinfo.nickName;
          let _id = JSON.parse(element)._id;
          let _phoneNum = JSON.parse(element).phoneData.phoneNumber;
            tempArr.push({
              name: _name,
              id: _id,
              phoneNumber:_phoneNum
            });
        });
        that.member = tempArr;
        // console.log('member', that.member);
    })
    },
    onSubmit() {
      let that = this;
      this.$refs['order'].validate((valid) => {
        if (valid) {
          this.order.memberId = ''
          this.order.memberPhoneNumber = ''
          that.member.forEach(i=>{
            if(i.name == that.order.member){
              this.order.memberId = i.id;
              this.order.memberPhoneNumber = i.phoneNumber;
            }
          })
          // that.product.forEach(i=>{
          //   if(i.name == that.order.product){
          //     this.order.productId = i.id;
          //   }
          // })
          that.order.contractInfo = that.loadImg;
          // that.order.productInfo = that.productInfo;
          // that.order.deliverInfo = that.deliverInfo;
          console.log('this.order', this.order);
          add(this.order).then((res)=>{
            if(res.data && res.data.errcode == 0){
                this.$message({
                    message: '新增成功',
                    type: 'success'
                })
                this.$router.push('/order/list')
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
      this.$router.push('/order/list')
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

<style scoped>
.add-page{
    margin: 10px 30px;
}
.listInfo{
  display: inline-block;
}
.value{
  font-weight: bold;
  margin-right: 10px;
}
</style>



