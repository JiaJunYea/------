<template>
  <div class="home">
    <!-- 新增內容區塊 -->
    <section class="content-section">
      <v-carousel style="width:700px">
        <v-carousel-item
          cover
          src="@/assets/KKA-3060.jpg"
        />

        <v-carousel-item
          cover
          src="@/assets/752-FZ.jpg"
        />

        <v-carousel-item
          cover
          src="@/assets/638.jpg"
        />

        <v-carousel-item
          cover
          src="@/assets/KKB-1669.jpg"
        />

        <v-carousel-item
          cover
          src="@/assets/EAL-1686.jpg"
        />
      </v-carousel>
      <p>這裡是公車車型介紹的首頁，有低地板公車和電動公車等。</p>
    </section>
  </div>

</template>

<script>
  export default {
    name: 'Home',
  }
</script>

<style scoped>
.content-section {
  display: flex;
  flex-direction: column;
  justify-content: center; /* 水平置中 */
  align-items: center;     /* 垂直置中 */
  min-height: 80vh;        /* 占整個畫面高度 */
  padding: 30px;
  background-color: #ffffcc;
  text-align: center;
}

.content-center {
  min-width: 600px;
}

.bus-image {
  max-width: 100%;
  height: 100px;
  width: 100px;
}
</style>

<route lang="yaml">
  meta:
    # 標題
    title: '首頁'
    # 有沒有登入都能看
    login: ''
    # 不是管理員也能看
    admin: false
</route>
