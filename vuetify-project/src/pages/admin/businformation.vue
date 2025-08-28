<template>
  <v-app>
    <v-container>
      <v-card>
        <v-card-title class="headline">公車資訊管理</v-card-title>
        <v-card-subtitle>第一手資訊消息</v-card-subtitle>

        <v-card-text>
          <v-skeleton-loader v-if="loading" :loading="loading" type="heading, paragraph" />
          <div>
            <p>等有新消息在補充</p>
            <p>等有新消息在補充</p>
            <p>等有新消息在補充</p>
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        loading: true, // 用來控制是否顯示加載骨架屏
      }
    },
    mounted () {
      // 假設數據加載完成後，我們會把 loading 設置為 false
      setTimeout(() => {
        this.loading = false // 模擬數據加載完成
      }, 1000)
    },
    methods: {
      // 點擊按鈕後執行的修改公車資訊邏輯
      editBusInfo () {
        this.$router.push('/edit-bus-info') // 假設我們有一個修改公車資訊的頁面
      },
    },
  }
</script>

<route lang="yaml">
  meta:
    layout: 'admin'
    title: '公車資訊管理'
    login: 'login-only'
    admin: true
</route>
