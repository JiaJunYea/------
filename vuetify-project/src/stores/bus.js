// Utilities
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useBusStore = defineStore('bus', () => {
  const busplate = ref('bus')
  const busmodel = ref('bus')
  const firstnews = ref('')
  const token = ref('')

  const isLoggedIn = computed(() => token.value.length > 0)

  const login = data => {
    busplate.value = data.busplate
    busmodel.value = data.busmodel
    if (data.token) {
      token.value = data.token
    }
  }

  const logout = () => {
    busplate.value = ''
    busmodel.value = ''
    firstnews.value = ''
    token.value = ''
  }

  return {
    busplate,
    busmodel,
    firstnews,
    isLoggedIn,
    login,
    logout,
  }
}, {
  persist: {
    key: 'shop-bus',
    pick: ['token'],
  },
})
