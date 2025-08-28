<template>
  <v-app-bar>
    <v-container class="d-flex align-center">
      <v-app-bar-title>公車車型介紹</v-app-bar-title>

      <template v-for="item of navItems" :key="item.to">
        <v-btn v-if="item.show" :prepend-icon="item.icon" :to="item.to">
          {{ item.title }}
          <v-badge v-if="item.to === '/bus' && user.cartTotal > 0" color="red" :content="user.cartTotal" floating />
        </v-btn>
      </template>
      <v-btn v-if="user.isLoggedIn" @click="logout">登出</v-btn>
    </v-container>
  </v-app-bar>
  <v-main>
    <router-view :key="$route.fullPath" />
  </v-main>
</template>

<script setup>
  import { computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useSnackbar } from 'vuetify-use-dialog'
  import userService from '@/services/user'
  import { useUserStore } from '@/stores/user'

  const user = useUserStore()
  const createSnackbar = useSnackbar()
  const router = useRouter()

  const navItems = computed(() => [
    { title: '首頁', to: '/', show: true },
    { title: '最新消息', to: '/firstnews', show: !user.isLoggedIn },
    { title: '公車資訊', to: '/businfo', show: !user.isLoggedIn },
    { title: '註冊', to: '/register', show: !user.isLoggedIn },
    { title: '登入', to: '/login', show: !user.isLoggedIn },
    { title: '管理', to: '/admin', show: user.isLoggedIn && user.isAdmin },
  ])

  const logout = async () => {
    try {
      await userService.logout()
    } catch (error) {
      console.log(error)
    }
    user.logout()
    router.push('/')
    createSnackbar({
      text: '登出成功! ',
      snackbarProps: {
        color: 'green',
      },
    })
  }
</script>
