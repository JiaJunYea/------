// Utilities
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const username = ref('')
  const role = ref('user')
  const password = ref('')
  const token = ref('')

  const isLoggedIn = computed(() => token.value.length > 0)
  const isAdmin = computed(() => role.value === 'admin')

  const login = data => {
    username.value = data.username
    role.value = data.role
    if (data.token) {
      token.value = data.token
    }
  }

  const logout = () => {
    username.value = ''
    role.value = 'user'
    password.value = ''
    token.value = ''
  }

  return {
    username,
    role,
    password,
    token,
    isLoggedIn,
    isAdmin,
    login,
    logout,
  }
}, {
  persist: {
    key: 'shop-user',
    pick: ['token'],
  },
})
