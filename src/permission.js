// /* eslint-disable prefer-const */
// import router from './router'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/customer-login','/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasLogin = localStorage.getItem('hasLogin')
//   const hasLogin1 = localStorage.getItem('hasLogin1')
//   if (hasLogin1) {
//     if (to.path === '/customer-login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/customer-login' })
//       NProgress.done()
//     } else if(to.path === '/onlineBanking/customerHomepage'){
//         next({ path: '/onlineBanking/customerHomepage' })
//         NProgress.done()
//     } else if(to.path === '/onlineBanking/customer-trading-water'){
//         next({ path: '/onlineBanking/customer-trading-water' })
//         NProgress.done()
//     } else if(to.path === '/onlineBanking/transfer'){
//         next({ path: '/onlineBanking/transfer' })
//         NProgress.done()
//     } else if(to.path === '/onlineBanking/person-info-update'){
//         next({ path: '/onlineBanking/person-info-update' })
//         NProgress.done()
//     }else{
//         next({ path: '/' })
//         NProgress.done()
//     }
//   } 
//   else if(hasLogin){
//     if (to.path === '/login') {
//         // if is logged in, redirect to the home page
//         next({ path: '/login' })
//         NProgress.done()
//       } else {
//         next()
//         NProgress.done()
//       }
//   }
//   else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) == -1) {
//       next({ path: '/customer-login' })
//       NProgress.done()
//     } else{
//       // in the free login whitelist, go directly
//       next()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
