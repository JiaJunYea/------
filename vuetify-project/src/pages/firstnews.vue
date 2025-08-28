<template>
  <div class="news-section">
    <h2>最新消息</h2>

    <ul v-if="!loading">
      <li v-for="(news, index) in newsList" :key="index">
        {{ news }}
      </li>
    </ul>

    <ul v-else>
      <li v-for="n in 5" :key="n" class="skeleton-line" />
    </ul>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        loading: true,
        newsList: [],
      }
    },
    mounted () {
      // 模擬資料載入
      setTimeout(() => {
        this.newsList = [
          '捷乘客運HINO RK8JRVA-KJF(高巴)KKA-3083~KKA-3089領牌(原欣欣客運336-U8~339-U8.350-U8~351-U8)',
          '大都會客運RAC RAC-700-ELCB-2900(大型電動車⚡️)EAL-5939領牌，並配置262路線',
          '統聯客運GOLDEN DRAGON XML6125JEV(電動車⚡️)EAL-1283~EAL-1288、038-FV~039-FV、EAA-329領牌，目前全配置168路線',
          '大都會客運TOYOTA COASTER GDB70L-ZETSYR(中巴)KKB-0503~KKB-0506領牌，並配置559路線',
          '中壢客運RAC RAC-700-ELCB-2900(大型電動車⚡️)EAL-5950~EAL-5952領牌，全配置1路',
          '台北客運GOLDEN DRAGON XML6122H(弘鉅六期單門普遊型)KKA-3372~KKA-3376.KKA-3378領牌，全配置939路線',
          '光華巴士KINGLONG KL6112UE1(短軸版，電動車)EAL-3227~EAL-3231領牌',
          '統聯客運RAC RAC-700-ELCB-2900(大型電動車⚡️)EAL-5953~EAL-5966領牌，全配置台中市區公車',
          '中興巴士KINGLONG KL6112UE1(短軸版，電動車)EAL-3232~EAL-3238領牌',
          '大都會客運成運 Master MB120SRE 城際電巴⚡️EAL-5582~EAL-5587.EAL-5589領牌',
          '還會持續更新中~~~',
        ]
        this.loading = false
      }, 1000)
    },
  }
</script>

<style scoped>
.news-section {
  margin: 40px;
}

.news-section h2 {
  color: orange;
  font-size: 36px;
  margin-bottom: 12px;
}

.news-section ul {
  list-style: none;
  padding-left: 0;
}

.news-section li {
  margin-bottom: 8px;
  padding: 8px 12px;
  background: #f9f9f9;
  border-radius: 4px;
}

.skeleton-line {
  height: 16px;
  background: linear-gradient(90deg, #eee, #ddd, #eee);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
  border-radius: 4px;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>

<route lang="yaml">
  meta:
    # 標題
    title: '最新消息'
    # 有沒有登入都能看
    login: 'no-login-only'
    # 不是管理員也能看
    admin: false
</route>
