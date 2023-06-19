import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [{
    path: '/',
    component: () => import('@/views/login/customer-login'),
    hidden: true
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/customer-login',
    component: () => import('@/views/login/customer-login'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/Home',
    component: Layout,
    meta: {
      title: '主界面',
      icon: 'plane'
    },
    children: [{
      path: 'Home',
      name: 'Home',
      component: () => import('@/views/Home'),
      meta: {
        title: '主界面',
      }
    }]
  },
  {
    path: '/savings',
    component: Layout,
    redirect: '/savings/upload',
    meta: {
      title: '活期储蓄',
      icon: 'plane'
    },
    children: [{
        path: 'user-open-account',
        name: 'user-open-account',
        component: () => import('@/views/savings/user-open-account'),
        meta: {
          title: '客户开户',
        }
      }, {
        path: 'user-deposit',
        name: 'user-deposit',
        component: () => import('@/views/savings/user-deposit'),
        meta: {
          title: '客户存款',
        }
      }, {
        path: 'user-withdraw',
        name: 'user-withdraw',
        component: () => import('@/views/savings/user-withdraw'),
        meta: {
          title: '客户取款',
        }
      },
      {
        path: 'user-contract',
        name: 'user-contract',
        component: () => import('@/views/savings/user-contract'),
        meta: {
          title: '客户签约解约',
        },
      },
      {
        path: 'user-cannel-account',
        name: 'user-cannel-account',
        component: () => import('@/views/savings/user-cannel-account'),
        meta: {
          title: '客户销户',
        }
      },
      {
        path: 's-customer-trading-warter',
        name: 's-customer-trading-warter',
        component: () => import('@/views/savings/s-customer-trading-warter'),
        meta: {
          title: '客户交易流水',
        }
      },
      {
        path: 's-transfer',
        name: 's-transfer',
        component: () => import('@/views/savings/s-transfer'),
        meta: {
          title: '客户转账',
        }
      },
    ]
  },
  // 总账流水
  {
    path: '/generalAccount',
    component: Layout,
    meta: {
      title: '总账',
      icon: 'plane'
    },
    children: [{
      path: 'generalAccount',
      name: 'generalAccount',
      component: () => import('@/views/generalAccount/generalAccount'),
      meta: {
        title: '总账流水',
      }
    }]
  },
  // 网上银行
  {
    path: '/onlineBanking',
    component: () => import('@/views/onlineBanking/layout/index'),
    redirect: '/onlineBanking/upload',
    hidden: true,
    meta: {
      title: '网上银行',
      icon: 'plane'
    },
    children: [{
        path: '/',
        name: 'customerHomepage',
        component: () => import('@/views/onlineBanking/customerHomepage'),
        meta: {
          title: '主页',
        }
      },
      {
        path: 'customer-trading-water',
        name: 'customer-trading-water',
        component: () => import('@/views/onlineBanking/customer-trading-water'),
        meta: {
          title: '客户交易流水',
        }
      },
      {
        path: 'transfer',
        name: 'transfer',
        component: () => import('@/views/onlineBanking/transfer'),
        meta: {
          title: '转账',
        }
      },
      {
        path: 'person-info-update',
        name: 'person-info-update',
        component: () => import('@/views/onlineBanking/person-info-update'),
        meta: {
          title: '个人信息修改',
        }
      },
      {
        path: 'password-update',
        name: 'password-update',
        component: () => import('@/views/onlineBanking/password-update'),
        meta: {
          title: '密码修改',
        }
      },
    ]
  },
  //系统设置
  {
    path: '/systemSettings',
    component: Layout,
    redirect: '/systemSettings/upload',
    meta: {
      title: '系统信息',
      icon: 'plane'
    },
    children: [{
      path: 'interest-rate-definition',
      name: 'interest-rate-definition',
      component: () => import('@/views/systemSettings/interest-rate-definition'),
      meta: {
        title: '利率列表',
      }
    }, {
      path: 'system-information-settings',
      name: 'system-information-settings',
      component: () => import('@/views/systemSettings/system-information-settings'),
      meta: {
        title: '系统设置',
      }
    }, ]
  },

  // // 404 page must be placed at the end !!!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  // scrollBehavior: () => ({
  //   y: 0
  // }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
