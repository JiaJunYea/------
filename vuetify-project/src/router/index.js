/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

import { setupLayouts } from 'virtual:generated-layouts'
// eslint-disable-next-line import/no-duplicates
import { createRouter, createWebHashHistory, START_LOCATION } from 'vue-router/auto'
// eslint-disable-next-line import/no-duplicates
import { routes } from 'vue-router/auto-routes'
import userService from '@/services/user'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

router.beforeEach(async (to, from, next) => {
  const user = useUserStore()

  // 第一次進入網站初始導航時，如果有 token，取使用者資料
  if (from === START_LOCATION && user.isLoggedIn) {
    try {
      const { data } = await userService.profile()
      user.login(data.user)
    } catch (error) {
      console.error(error)
      user.token = ''
    }
  }

  // 根據登入狀態和頁面路徑進行導航守衛
  if (to.meta.login === 'no-login-only' && user.isLoggedIn) {
    // 去未登入限定頁面，註冊頁和登入頁，且使用者有登入，導航回首頁
    next('/')
  } else if (to.meta.login === 'login-only' && !user.isLoggedIn) {
    // 去登入限定頁面，且使用者沒有登入，導航到登入頁
    next('/login')
  } else if (to.meta.admin && !user.isAdmin) {
    // 去管理員限定頁面，且使用者不是管理員，導航回首頁
    next('/')
  } else {
    // 不阻擋
    next()
  }
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (localStorage.getItem('vuetify:dynamic-reload')) {
      console.error('Dynamic import error, reloading page did not fix it', err)
    } else {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
