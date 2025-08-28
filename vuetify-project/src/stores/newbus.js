// Utilities
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNewbusStore = defineStore('newbus', () => {
  const token = ref('')
  const login = data => {
    if (data.access_token) {
      token.value = data.access_token
    }
  }

  return {
    token,
    login,
  }
}, {
  persist: {
    key: 'tdx-bus',
    pick: ['token'],
  },
})
