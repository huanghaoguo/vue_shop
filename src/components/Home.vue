<template>
  <el-container class="home-container">
    <!-- 页面头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" srcset="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--页面主体区域-->
      <el-container>
        <!--侧边栏-->
      <el-aside :width="isCollaspe ?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--侧边栏菜单-->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409BEF" :unique-opened="true" :collapse="isCollaspe" :collapse-transition="false">
          <!--一级菜单-->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!--一级菜单的模板区域-->
            <template slot="title">
              <!--图标-->
              <i :class="iconsObj[item.id]"></i>
              <!--文本-->
              <span>{{item.authName}}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item :index="subItem.id + ''" v-for="subItem in item.children" :key="subItem.id">
              <!--二级菜单的模板区域-->
              <template slot="title">
              <!--图标-->
              <i class="el-icon-menu"></i>
              <!--文本-->
              <span>{{subItem.authName}}</span>
            </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右侧内容-->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      menuList: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 是否折叠
      isCollaspe: false
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      // 数据获取不成功
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 数据获取成功
      this.menuList = res.data
      console.log(res)
    },
    // 点击按钮，切换这个菜单的折叠
    toggleCollapse () {
      this.isCollaspe = !this.isCollaspe
    }
  }
}
</script>
<style lang="less" scoped>
.home-container{
  height: 100%;
}
.el-header{
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffffff;
  font-size: 20px;
  >div{
    display: flex;
    align-items: center;
    >span{
      margin-left: 15px;
    }
  }
}
.el-aside{
  background-color: #333744;
  .el-menu{
    border-right: 0;
  }
}
.el-main{
  background-color: #eaedf1;
}
.iconfont{
  margin-right: 10px;
}
.toggle-button{
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  letter-spacing: 0.3em;
  cursor: pointer;
}
</style>
