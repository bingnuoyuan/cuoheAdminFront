<template>
    <div class="product-page">
        <el-form ref="bill" :model="bill" label-width="80px" :rules="rules">
            <el-form-item label="所属会员" required prop="member">
                <el-select v-model="bill.member" placeholder="请选择" @change="handleMember">
                  <el-option
                    v-for="item in member"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
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
            <!-- <p>发票内容</p>
            <el-form-item label="内容" required prop="content">
              <Tinymce :height="300" v-model="bill.content"></Tinymce>
            </el-form-item> -->
            <el-form-item>
                <el-button type="primary" @click="onSubmit">保存</el-button>
              </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { save,updateBill } from '@/api/bill'
import scroll from '@/utils/scroll'
import Tinymce from '@/components/Tinymce'
import { memberList } from '@/api/member'
export default{
    components: {Tinymce},
    data() {
        return {
            list:[],
            member:[],
            delDialogVisible: false,
            bill: {},
            deliverCList: [{
                id: '1',
                value: '顺丰快递'
            }],
            rules:{
                member: [
                    { required: true, message: '请选择所属会员', trigger: 'change' }
                ],
                date: [
                    { required: true, message: '请选择寄出时间', trigger: 'change' }
                ],
                deliverC: [
                    { required: true, message: '请选择快递公司', trigger: 'change' }
                ],
                deliverNo: [
                    { required: true, message: '请填写物流单号', trigger: 'change' }
                ],
                content: [
                    { required: true, message: '请填写提货信息', trigger: 'change' }
                ]
            },
        }
    },
    created(){
        this.getList()
        this.loadMember();
    },
    mounted(){

    },
    methods:{
        handleMember(e){
            console.log(e);
            //获取bill数据

        },
        getList(){

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
                    phoneNum: _phoneNum
                    });
                });
                that.member = tempArr;
                // console.log('member', that.member);
            })
            },
        handleDetail(row){
            this.$router.push(`/bill/edit/${row._id}`)
        },
        onEdit(row) {
            this.$router.push(`/bill/edit/${row._id}`)
        },
        onSubmit(){
            let that = this;
            this.member.forEach(item=>{
                if(item.name == this.bill.member){
                    this.bill.memberId = item.id;
                    this.bill.memberPhoneNumber = item.phoneNumber;
                }
            })
            save(this.bill).then((res)=>{
                if(res.data && res.data.errcode >= 0){
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    })
                    this.$router.push('/bill/list')
                }else{
                    this.$message.error('保存失败')
                }
            })
            
        }
    }
}
</script>

<style scoped>
.product-page{
    margin: 10px 30px;
}
.right{
    text-align: right;
}
</style>