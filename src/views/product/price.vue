<template>
    <div class="product-page">
        <el-row>
            <el-col :span="24" class="right">
                <el-form :inline="true" :model="search" class="demo-form-inline">
                    <el-form-item label="所属产品" :label-width="formLabelWidth" >
                        <el-select placeholder="请选择所属产品" v-model="info.pid" @change="handlePro">
                          <el-option
                            v-for="item in proList"
                            :key="item._id"
                            :label="item.name"
                            :value="item._id">
                            <span>{{ item.name }}</span>
                            <span style="color: #8492a6; font-size: 13px">({{ item.model}})</span>
                          </el-option>
                        </el-select>
                      </el-form-item>
                    <el-form-item>
                    <el-button type="primary" @click="addPrice">新增价格</el-button>
                    </el-form-item>
                  </el-form>
            </el-col>
        </el-row>
        <el-table  v-loading="loading" :data="historyPrice" stripe>
            <!-- <el-table-column prop="name" label="所属产品"> </el-table-column> -->
            <el-table-column prop="price" label="平台价格"> </el-table-column>
            <el-table-column prop="marketPrice" label="市场价格"> </el-table-column>
            <el-table-column prop="updateTime" label="更新时间">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ formMateDate(scope.row.updateTime) }}</span>
                </template>        
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" @click="onEdit(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="onDel(scope.row)">删除</el-button>
                </template>
            </el-table-column>
      </el-table>
      <!-- 确认删除的对话框 -->
    <el-dialog title="提示" :visible.sync="delDialogVisible" width="30%" :close-on-click-modal="false">
        <span>确定删除该条数据吗</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="delDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="doDel">确 定</el-button>
        </span>
    </el-dialog>
    <!--新增价格对话框-->
    <el-dialog title="新增价格" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
        <el-form :model="info">
          <el-form-item label="平台价格" :label-width="formLabelWidth" required prop="price">
            <el-input v-model="info.price" ></el-input>
          </el-form-item>
          <el-form-item label="市场价格" :label-width="formLabelWidth" required prop="marketPrice">
            <el-input v-model="info.marketPrice" ></el-input>
          </el-form-item>
          <el-form-item label="更新时间" :label-width="formLabelWidth" required prop="updateTime">
            <el-date-picker
                v-model="info.updateTime"
                type="datetime"
                placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="doSave">确 定</el-button>
        </div>
      </el-dialog>
      <!--编辑价格对话框-->
    <el-dialog title="编辑价格" :visible.sync="dialogEditVisible" :close-on-click-modal="false">
        <el-form :model="editInfo">
          <el-form-item label="平台价格" :label-width="formLabelWidth" required prop="price">
            <el-input v-model="editInfo.price" ></el-input>
          </el-form-item>
          <el-form-item label="市场价格" :label-width="formLabelWidth" required prop="marketPrice">
            <el-input v-model="editInfo.marketPrice" ></el-input>
          </el-form-item>
          <el-form-item label="更新时间" :label-width="formLabelWidth" required prop="updateTime">
            <el-date-picker
                v-model="editInfo.updateTime"
                type="datetime"
                placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEditVisible = false">取 消</el-button>
          <el-button type="primary" @click="doSaveEdit">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import { fetchList, delprice,update} from '@/api/product'

export default{
    data() {
        return {
            list:[],
            delDialogVisible: false,
            info: {},
            editInfo: {},
            historyPrice:[],
            dialogFormVisible: false,
            dialogEditVisible:false,
            price: {},
            formLabelWidth: '120px',
            proList:[],
            search:{},
            saveData:{},
            loading: false,
            delId: ''
        }
    },
    created(){
        this.getList()
    },
    mounted(){

    },
    methods:{
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
        
            // console.log(fmt)
            return fmt
        },
        compare(a,b){
            let v1 = a['id'], v2 = b['id'];
            return v2 - v1;
        }, 
        handlePro(e){
            let that = this;
            console.log(e)
            //获取当前产品的历史价格渲染表格
            this.proList.forEach(i=>{
                if(i._id == e){
                    that.saveData = i;
                    that.handleHistoryPrice(i.historyPrice);
                }
            })
        },
        handleHistoryPrice(priceList){
            let that = this;
            priceList.sort(that.compare);
            that.historyPrice = priceList;
        },
        addPrice(){
            //判断是否已选产品
            if(!this.saveData.name){
                return this.$message({
                    message: '请选选择所属产品',
                    type: 'warning'
                });
            } else{
                this.info = {};
                this.dialogFormVisible = true;
            }
        },
        onEdit(row){
            console.log("row", row);
            this.editInfo = row;
            this.dialogEditVisible = true;
        },
        doSaveEdit(){
            //update
            //判断是否需要修改product price
            //需知道当前修改的价格是历史还是product price
            //product price 总取最新 oldprice 第二新
            //对价格降序排列
            // that.saveData.historyPrice.sort(that.compare);
            let that = this;
            that.saveData.historyPrice.sort(that.compare);
            console.log('compare',that.saveData.historyPrice)
            // that.saveData.price = that.saveData.historyPrice[0].price;
            // if(that.saveData.historyPrice[1]){
            //     that.saveData.oldprice = that.saveData.historyPrice[1].price;
            // }
            that.saveData.historyPrice.forEach(i=>{
                if(i.id == that.editInfo.id){
                    i = that.editInfo;
                }
            })
            this.updateData();
        },
        doSave(){
            let that = this;
            let priceTemp = '';
            this.info.id = new Date().getTime();
            that.saveData.historyPrice.unshift(that.info);
            console.log('saveData', that.saveData)
            this.updateData();
        },
        updateData(){
            let that = this;
            update(that.saveData).then((res)=>{
                console.log(res)
                if(res.data && res.data.modified > 0){
                    that.$message({
                        message: '新增成功',
                        type: 'success'
                    })
                    that.dialogFormVisible = false;
                }else{
                    that.$message.error('新增失败')
                }
            })
        },
        getList() {
            let that = this;
            this.loading = true
            fetchList().then(res => {
                console.log(res)
                let tempArr = [];
                res.data.forEach(element => {
                    tempArr.push(JSON.parse(element));
                });
                that.proList = tempArr;
                that.loading = false;
            })
        },
        onDel(row) {
            this.delDialogVisible = true
            console.log(row);
            this.delId = row.id
        },
        doDel() {
            //update product historyPrice
            let that = this;
            this.saveData.historyPrice.forEach((i,j)=>{
                if(i.id == that.delId){
                    that.saveData.historyPrice.splice(j,1);
                }
            })
            console.log('historyPrice', that.saveData.historyPrice);
            update(that.saveData).then((res)=>{
                console.log(res)
                if(res.data && res.data.modified > 0){
                    that.$message({
                        message: '删除成功',
                        type: 'success'
                    })
                    that.delDialogVisible = false;
                }else{
                    that.$message.error('删除失败')
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