<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片内容区域-->
    <el-card>
      <!--搜索框区域-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @clear="getOrderList">
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!--表格区域-->
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="70px"></el-table-column>
        <el-table-column label="是否付款" width="100px">
          <template slot-scope="scope">
            <el-tag  type="danger" v-if="scope.row.pay_status === '0'">未付款</el-tag>
            <el-tag  v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="70px"></el-table-column>
        <el-table-column label="下单时间" width="140px">
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox(scope.row.order_id)"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressBox(scope.row.order_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域-->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[3, 6, 9]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </el-card>
    <!--修改地址的对话框-->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressDialogClosed">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader v-model="addressForm.address1" :options="cityData" :props="addressProps"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!--展示物流进度的对话框-->
    <el-dialog title="提示" :visible.sync="progressVisible" width="50%">
      <!--时间线-->
      <el-timeline reverse>
        <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import cityData from './citydata.js'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 当前显示的数据条数
        pagesize: 9
      },
      // 订单数据列表
      orderlist: [],
      // 总订单数
      total: 0,
      // 控制修改地址对话框的显示与隐藏
      addressVisible: false,
      // 修改地址对话框表单信息
      addressForm: {
        address1: [],
        address2: ''
      },
      // 定义地址的规则
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      // 省市区/县级联选择器的数据
      cityData,
      // 级联选择器传递规则
      addressProps: {
        label: 'label',
        value: 'value',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 控制物流进度对话框的显示和隐藏
      progressVisible: false,
      // 物流进度数据
      progressInfo: []
    }
  },
  created () {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表数据失败')
      }
      console.log(res.data)
      this.orderlist = res.data.goods
      this.total = res.data.total
    },
    // 监听页面显示数据条发生改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 监听页面发生跳转改变事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 展示修改地址的对话框
    showBox(id) {
      this.addressVisible = true
    },
    // 监听修改地址对话框关闭事件
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    // 展示物流进程的对话框
    async showProgressBox(id) {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error('获取物流数据失败')
      }
      console.log(res.data)
      this.progressInfo = res.data
      this.progressVisible = true
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css';
</style>
