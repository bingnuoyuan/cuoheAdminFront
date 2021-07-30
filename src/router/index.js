import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/',
    redirect: 'product/list'
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/product',
    component: Layout,
    children: [
      {
        path: 'list',
        component: () => import('@/views/product/list'),
        meta: {title: '产品管理', icon: 'table'}
      }, {
        path: 'index',
        component: () => import('@/views/product/index'),
        meta: { title: '产品类别', icon: 'table' },
        hidden: true
      },{
        path: 'add',
        component: () => import('@/views/product/add'),
        meta: { title: '新增产品', icon: 'table' },
        hidden: true
      }, {
        path: 'edit/:id',
        component: () => import('@/views/product/edit'),
        meta: { title: '编辑产品', icon: 'table' },
        hidden: true
      },
      {
        path: 'price',
        component: () => import('@/views/product/price'),
        meta: {title: '产品价格', icon: 'table'},
        hidden: true
      }
    ]
  },
  {
    path: '/news',
    component: Layout,
    children: [
      {
        path: 'list',
        component: () => import('@/views/news/list'),
        meta: {title: '资讯管理', icon: 'example'}
      }, {
        path: 'add',
        component: () => import('@/views/news/add'),
        meta: { title: '新增资讯', icon: 'example' },
        hidden: true
      }, {
        path: 'addEdit',
        component: () => import('@/views/news/addEdit'),
        meta: { title: '维护置顶资讯', icon: 'example' },
        hidden: true
      }, {
        path: 'edit/:id',
        component: () => import('@/views/news/edit'),
        meta: { title: '编辑资讯', icon: 'example' },
        hidden: true
      }, {
        path: 'publisher',
        component: () => import('@/views/news/publisher'),
        meta: { title: '管理发布人', icon: 'example' },
        hidden: true
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    children: [
      {
        path: 'list',
        component: () => import('@/views/order/list'),
        meta: {title: '订单管理', icon: 'nested'}
      }, {
        path: 'add',
        component: () => import('@/views/order/add'),
        meta: { title: '订单新增', icon: 'nested' },
        hidden: true
      }, {
        path: 'edit/:id',
        component: () => import('@/views/order/edit'),
        meta: { title: '订单编辑', icon: 'nested' },
        hidden: true
      }
    ]
  },
  {
    path: '/member',
    component: Layout,
    children: [
      {
        path: 'list',
        component: () => import('@/views/member/list'),
        meta: {title: '会员管理', icon: 'user'}
      }
    ]
  },
  // {
  //   path: '/bill',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'list',
  //       component: () => import('@/views/bill/list'),
  //       meta: {title: '发票管理', icon: 'tree'}
  //     },{
  //       path: 'index',
  //       component: () => import('@/views/bill/index'),
  //       meta: {title: '发票管理', icon: 'tree'}
  //     }, {
  //       path: 'edit/:id',
  //       component: () => import('@/views/bill/edit'),
  //       meta: { title: '发票管理', icon: 'tree' },
  //       hidden: true
  //     }
  //   ]
  // },
  {
    path: '/bill',
    component: Layout,
    children: [
      {
        path: 'list',
        component: () => import('@/views/bill/list'),
        meta: {title: '发票管理', icon: 'tree'}
      }, {
        path: 'index',
        component: () => import('@/views/bill/index'),
        meta: { title: '发票管理', icon: 'tree' },
        hidden: true
      }, {
        path: 'edit/:id',
        component: () => import('@/views/bill/edit'),
        meta: { title: '发票管理', icon: 'tree' },
        hidden: true
      }
    ]
  },
  {
    path: '/belletin',
    component: Layout,
    children: [
      {
        path: 'list',
        component: () => import('@/views/belletin/list'),
        meta: {title: '平台公告', icon: 'form'}
      }, {
        path: 'add',
        component: () => import('@/views/belletin/add'),
        meta: { title: '新增公告', icon: 'form' },
        hidden: true
      },{
        path: 'edit/:id',
        component: () => import('@/views/belletin/edit'),
        meta: { title: '编辑公告', icon: 'form' },
        hidden: true
      }
    ]
  },
  // {
  //   path: '/aboutus',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/aboutus/index'),
  //       meta: {title: '关于我们管理', icon: 'tree'}
  //     }
  //   ]
  // },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
