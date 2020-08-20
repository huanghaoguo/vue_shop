<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片内容区域-->
    <el-card>
      <!--提示消息区域-->
      <el-alert title="注意：只允许为第三分类设置相关参数" type="warning" show-icon :closable="false"></el-alert>
      <!--选择商品分类-->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!--选择商品分类的级联选择框-->
          <el-cascader v-model="selectedKey" :options="catelist" :props="cascaderProps" @change="handleChange" clearable></el-cascader>
        </el-col>
      </el-row>
      <!--tab 页签区域-->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!--添加动态参数管理页面-->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
          <!--动态参数列表-->
          <el-table :data="manyTableData" border stripe>
            <!--展开列-->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!--循环渲染tag标签-->
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{item}}</el-tag>
                <!--输入的文本框-->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"></el-input>
                <!--添加按钮-->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!--索引列-->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!--添加静态参数管理页面-->
        <el-tab-pane label="静态参数" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
          <!--静态参数列表-->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!--循环渲染tag标签-->
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i, scope.row)">{{item}}</el-tag>
                <!--输入的文本框-->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"></el-input>
                <!--添加按钮-->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!--索引列-->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!--添加参数对话框-->
    <el-dialog :title="'添加' + titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!--添加参数对话框-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改参数对话框-->
    <el-dialog :title="'修改' + titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <!--添加参数对话框-->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 获取商品分类数据列表
      catelist: [],
      // 级联选择器选中三级分类的id值
      selectedKey: [],
      // 向三级级联选择器传值
      cascaderProps: {
        value: 'cat_id', // 表示的是具体选中的值
        label: 'cat_name', // 指定所看到的属性
        children: 'children', // 指定父子嵌套用的是哪个属性
        expandTrigger: 'hover'
      },
      // 被激活的页签名称
      activeName: 'many',
      // 动态参数表格的数据
      manyTableData: [],
      // 静态参数表格的数据
      onlyTableData: [],
      // 控制对话框的显示与隐藏
      addDialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {
        // 属性名
        attr_name: ''
      },
      // 表单验证规则
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入属性名称', trigger: 'blur' }
        ]
      },
      // 控制修改参数对话框的显示与隐藏
      editDialogVisible: false,
      // 修改的表达数据
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入属性名称', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // 获取所有的商品分类
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      // console.log(res.data)
      this.catelist = res.data
    },
    // 监听级联选择器选中的id
    handleChange() {
      // console.log(this.selectedKey)
      this.getParamsData()
    },
    // 监听tab页切换栏
    handleTabClick() {
      console.log(this.activeName)
      this.getParamsData()
    },
    // 将获取商品参数单独封装成一个函数，方便进行调用
    async getParamsData() {
      if (this.selectedKey.length !== 3) {
        this.selectedKey = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      // 根据所选当前分类的id和当前所处的面板，获取对应的参数
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      res.data.forEach(item => {
        // 将获取的attr_vals字符串分割成一个数组进行返回，方便遍历
        item.attr_vals = item.attr_vals.split(' ')
        // 为解决点击一个按钮却所有都添加的问题，给每一个数据都加上inputVisible和inputValue
        // 控制文本框的显示与隐藏
        item.inputVisible = false
        // 文本框中输入的值
        item.inputValue = ''
      })
      console.log(res.data)
      if (this.activeName === 'many') {
        // 获取到的是动态参数
        this.manyTableData = res.data
        console.log(this.manyTableData)
      } else {
        this.onlyTableData = res.data
      }
    },
    // 监听对话框关闭事件
    addDialogClosed() {
      // 清空对话框的内容
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加属性
    addParams() {
      // 对于表单中是否填写内容进行验证
      this.$refs.addFormRef.validate(async valid => {
        // 验证失败
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加属性失败')
        }
        this.$message.success('添加属性成功')
        // 关闭对话框
        this.addDialogVisible = false
        // 更新表格数据
        this.getParamsData()
      })
    },
    // 点击编辑按钮，弹出编辑对话框
    // eslint-disable-next-line camelcase
    async showEditDialog(attr_id) {
      // eslint-disable-next-line camelcase
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`, { params: { attr_sel: this.activeName } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改参数对话框的关闭事件，重置修改的表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击确定按钮，提交修改信息
    editParams() {
      // 对表单内容进行校验
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName
        })
        if (res.meta.status !== 200) {
          return this.$message.error('更新属性失败')
        }
        this.$message.success('更新属性成功')
        this.getParamsData()
        this.editDialogVisible = false
      })
    },
    // 点击删除按钮，删除对应的属性
    // eslint-disable-next-line camelcase
    async removeParams(attr_id) {
      // eslint-disable-next-line camelcase
      // 返回的是一个文本不需要用数据结构进行接收
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // 用户取消删除操作
      if (confirmResult !== 'confirm') {
        return this.$message.info('您已取消删除')
      }
      // 删除的业务逻辑
      // eslint-disable-next-line camelcase
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getParamsData()
    },
    // 文本框失去焦点或者摁下enter键进行触发
    handleInputConfirm(row) {
      // 对文本框中的内容进行判断
      // row.inputValue.trim()表示去除空字符串后的文本框内容
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 输入内容合法,将输入的内容放到attr_vals数组中
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      // 需要发起请求保存添加进去的属性
      this.saveAttrVals(row)
    },
    // 将对 attr_vals 的请求操作封装成一个函数
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        return this.$message.error('添加属性失败')
      }
      this.$message.success('添加属性成功')
    },
    // 点击按钮，显示文本框
    showInput(row) {
      row.inputVisible = true
      // 让文本框自动获得焦点
      // $nextTick的作用，就是当页面上元素杯重新渲染后，才会指定回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除对应的tag标签选项
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
    }
  },
  computed: {
    // 如果按钮需要被禁用，则返回true，不需要则false
    isBtnDisabled() {
      if (this.selectedKey.length !== 3) {
        return true
      }
      return false
    },
    // 获取当前选中的三级分类的id
    cateId() {
      if (this.selectedKey.length === 3) {
        return this.selectedKey[2]
      }
      return null
    },
    // 公用一个对话框判断谁使用对话框，产生相应的title
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>
<style lang="less" scoped>
.cat_opt{
  margin-top: 15px;
}
.el-tag{
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
