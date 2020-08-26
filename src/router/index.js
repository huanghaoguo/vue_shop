import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
// import Login from '../components/Login.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
// import Home from '../components/Home.vue'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')
// import Welcome from '../components/Welcome.vue'

const Users = () => import(/* webpackChunkName: "users_rights_roles" */ '../components/user/Users.vue')
// import Users from '../components/user/Users.vue'
const Rights = () => import(/* webpackChunkName: "users_rights_roles" */ '../components/power/Rights.vue')
// import Rights from '../components/power/Rights.vue'
const Roles = () => import(/* webpackChunkName: "users_rights_roles" */ '../components/power/Roles.vue')
// import Roles from '../components/power/Roles.vue'

const Cate = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/Cate.vue')
// import Cate from '../components/goods/Cate.vue'
const Params = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/Params.vue')
// import Params from '../components/goods/Params.vue'

const GoodsList = () => import(/* webpackChunkName: "goodlist_add" */ '../components/goods/List.vue')
// import GoodsList from '../components/goods/List.vue'
const Add = () => import(/* webpackChunkName: "goodlist_add" */ '../components/goods/Add.vue')
// import Add from '../components/goods/Add.vue'

const Order = () => import(/* webpackChunkName: "order_report" */ '../components//order/Order.vue')
// import Order from '../components//order/Order.vue'
const Report = () => import(/* webpackChunkName: "order_report" */ '../components/report/Report.vue')
// import Report from '../components/report/Report.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/users',
          component: Users
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/categories',
          component: Cate
        },
        {
          path: '/params',
          component: Params
        },
        {
          path: '/goods',
          component: GoodsList
        },
        {
          path: '/goods/add',
          component: Add
        },
        {
          path: '/orders',
          component: Order
        },
        {
          path: '/reports',
          component: Report
        }
      ]
    }
  ]
})
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from代表从哪个路径跳转过来
  // next 是一个函数，表示放行，两种表达方式next() next('url') 强制跳转的页面
  if (to.path === '/login') return next()
  // 获取token判断用户是否已经登录
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
