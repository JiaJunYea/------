<template>
  <div class="bus-list">
    <div v-for="(bus, index) in busList" :key="index" class="bus-card">
      <img alt="公車圖片" class="bus-image" :src="bus.image">
      <div class="bus-info">
        <h3>{{ bus.title }}</h3>
        <h4>車體廠：{{ bus.busbodyshop }}</h4>
        <h4>車長：{{ bus.vehiclelength }}</h4>
        <h4>軸距：{{ bus.buswheelbase }}</h4>
        <h4>變速系統：{{ bus.Transmissionsystem }}</h4>
        <p>領牌範圍：{{ bus.Licenserange }}</p>
        <b>
          圖片資訊是<span style="color:red;">{{ bus.busroute.routeName }}</span>
          <span style="color:green;">的{{ bus.busroute.license }}</span>
        </b>
        <h5>{{ bus.description }}</h5>

        <!-- 公車動態資訊 -->
        <br>
        <h2 style="text-decoration: underline;">即時公車動態</h2>
        <p>目前站: <span style="font-size: 1.5rem; color:black">{{ bus.stopName || '無資料' }}</span></p>
        <p><span style="font-size: 1.5rem; color:blue">{{ getNextStopLabel(bus) }}</span></p>
        <p><span style="font-size: 1.3rem; color:black">
          公車目前站點位置:
          <br>
          經度 {{ bus.currentLocation.longitude ?? '無' }}
          <br>
          緯度 {{ bus.currentLocation.latitude ?? '無' }}
        </span></p>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { onMounted, ref } from 'vue'

  import bus3 from '@/assets/095-U6.jpg'
  import bus1 from '@/assets/406-U5.jpg'
  import bus4 from '@/assets/409-FW.jpg'
  import bus2 from '@/assets/EAL-3068.jpg'
  import bus5 from '@/assets/FAB-512.jpg'
  import bus6 from '@/assets/KKB-2295.jpg'

  import busService from '@/services/bus'
  import { useNewbusStore } from '@/stores/newbus'

  const newbus = useNewbusStore()

  const CLIENT_ID = import.meta.env.VITE_BUS_CLIENT_ID
  const CLIENT_SECRET = import.meta.env.VITE_BUS_CLIENT_SECRET

  // 公車列表響應式資料
  const busList = ref([
    {
      title: '三重客運DAEWOO BS120CN(成運五期低地板)',
      busbodyshop: '成運',
      vehiclelength: '12,050mm',
      buswheelbase: '6,100mm',
      Transmissionsystem: 'ALLISON T375R自排(前6後1)',
      Licenserange:
        '137-U5~176-U5(2013年生產)、395-U5~429-U5.433-U5~449-U5.488-U5~502-U5.525-U5~539-U5.630-U5~648-U5.661-U5~679-U5(2014年生產)、928-U3~937-U3.169-U7~192-U7.FAB-186~FAB-193.FAB-197~FAB-200.FAB-202~FAB-206.FAB-209.FAB-211~FAB-213.FAB-252~FAB-263.FAB-266.FAB-268.FAB-270.FAB-272~FAB-275(2015年生產)',
      busroute: {
        routeName: '822',
        license: '406-U5',
        city: 'NewTaipei',
      },
      description: '方便長者和輪椅族群上下車的低地板設計。',
      image: bus1,
      stopName: '',
      nextStations: [],
      currentLocation: { latitude: null, longitude: null },
    },
    {
      title: '三重客運RAC RAC-700-ELCB-2802(大型電動車⚡️)',
      busbodyshop: '華德動能科技',
      vehiclelength: '11,980mm',
      buswheelbase: '5,800mm',
      Transmissionsystem: 'Eaton六速自手排',
      Licenserange: 'EAL-3050~EAL-3071(2023年生產)',
      busroute: {
        routeName: '637',
        license: 'EAL-3068',
        city: 'NewTaipei',
      },
      description: '零碳排環保公車，推動綠色交通。',
      image: bus2,
      stopName: '',
      nextStations: ['', ''],
      currentLocation: { latitude: null, longitude: null },
    },
    {
      title: '指南客運KINGLONG KL6112U1(短軸版，五期引擎)',
      busbodyshop: '金龍汽車製造',
      vehiclelength: '11,200mm',
      buswheelbase: '5,300mm',
      Transmissionsystem:
        '綦江QJ1205手排(前5後1)、Voith DIWA854.5自排(前4後1)',
      Licenserange:
        '027-FY~049-FY、240-FY~241-FY、266-FY~278-FY、571-FZ~581-FZ、742-FW~750-FW(2012年生產)、737-FZ~763-FZ、988-FZ~999-FZ、FAA-097~FAA-099、FAA-116~FAA-117、401-FY~411-FY、816-FX~820-FX(2013年生產)、110-U3~129-U3、133-U3~137-U3、365-U3~388-U3、489-U3、568-U3~571-U3、940-U5~971-U5(2014年生產)、037-U6~039-U6、050-U6~056-U6、093-U6~100-U6、301-U6~303-U6、062-U7~065-U7、070-U7~071-U7(2015年生產)、KKB-0170~KKB-0171(2021年生產)',
      busroute: {
        routeName: '801',
        license: '095-U6',
        city: 'NewTaipei',
      },
      description: '方便長者和輪椅族群上下車的低地板設計。',
      image: bus3,
      stopName: '',
      nextStations: [],
      currentLocation: { latitude: null, longitude: null },
    },
    {
      title: '指南客運KINGLONG KL6112U1(短軸版，四期引擎)',
      busbodyshop: '金龍汽車製造',
      vehiclelength: '11,200mm',
      buswheelbase: '5,300mm',
      Transmissionsystem: '綦江QJ1205手排(前5後1)',
      Licenserange: '405-FW~420-FW、479-FW~500-FW、045-FZ~052-FZ(2012年生產)',
      busroute: {
        routeName: '801',
        license: '409-FW',
        city: 'NewTaipei',
      },
      description: '方便長者和輪椅族群上下車的低地板設計。',
      image: bus4,
      stopName: '',
      nextStations: [],
      currentLocation: { latitude: null, longitude: null },
    },
    {
      title: '大有巴士YUTONG ZK6128HG',
      busbodyshop: '台灣宇通實業',
      vehiclelength: '11,990mm',
      buswheelbase: '5,875mm',
      Transmissionsystem: 'ZF EcoLife 6AP1200B自排(前6後1)',
      Licenserange:
        'FAB-387~FAB-389、FAB-391~FAB-395、FAB-397~FAB-399、FAB-500~FAB-510、FAB-512~FAB-513、FAB-516、FAB-767~FAB-769、FAB-771~FAB-775、FAB-976~FAB-979、KKA-1029~KKA-1036(2016年生產)',
      busroute: {
        routeName: '257',
        license: 'FAB-512',
        city: 'Taipei',
      },
      description: '方便長者和輪椅族群上下車的低地板設計。',
      image: bus5,
      stopName: '',
      nextStations: ['', ''],
      currentLocation: { latitude: null, longitude: null },
    },
    {
      title: '大有巴士JIAMA JC290E6-5850(總盈)',
      busbodyshop: '總盈',
      vehiclelength: '12,030mm',
      buswheelbase: '5,850mm',
      Transmissionsystem: 'ZF EcoLife2 6AP1220B自排(前6後1)',
      Licenserange: 'KKB-2290~KKB-2297(2024年生產)',
      busroute: {
        routeName: '257',
        license: 'KKB-2295',
        city: 'Taipei',
      },
      description: '方便長者和輪椅族群上下車的低地板設計。',
      image: bus6,
      stopName: '',
      nextStations: [],
      currentLocation: { latitude: null, longitude: null },
    },
  ])

  // 取得 Token
  const getBusToken = async () => {
    try {
      const params = new URLSearchParams()
      params.append('grant_type', 'client_credentials')
      params.append('client_id', CLIENT_ID)
      params.append('client_secret', CLIENT_SECRET)

      const { data } = await busService.login(params)
      newbus.login(data)
    } catch (error) {
      console.error('bus登入失敗', error)
    }
  }

  // 取得即時公車動態並更新 busList
  const getBusInfo = async (city, busroute) => {
    try {
      console.log('=============', city, busroute)

      const res1 = await busService.getCurrentBus(city, busroute, 30) || []

      console.log('搜尋路線:', busroute)
      for (const bus of busList.value) {
        try {
          // 只處理該路線的車輛
          if (bus.busroute.routeName === busroute) {
            // 找該路線中，與 bus.busroute.license 相同的車牌
            console.log('處理車牌:', bus.busroute.license)
            const matchedBus = res1.data.find(b => b.PlateNumb === bus.busroute.license)
            console.log('matchedBus', matchedBus)

            const stopName = matchedBus ? (matchedBus.StopName?.Zh_tw || '') : ''
            const stopSwquence = matchedBus ? (matchedBus.StopSequence || '') : ''
            console.log(`目前所在站點: ${stopName}(${stopSwquence})`)

            //
            const routeID = matchedBus ? (matchedBus.RouteID || '') : ''
            const direction = matchedBus ? (matchedBus.Direction || 0) : 0
            console.log('routeID', routeID)
            console.log('direction', direction)

            const res2 = await busService.getNextStations(city, busroute, routeID, direction) || []
            const currentstop = res2.data[0].Stops[Number.parseInt(stopSwquence) - 1] || {}
            const nextstop1 = res2.data[0].Stops[Number.parseInt(stopSwquence)] || {}
            const nextstop2 = res2.data[0].Stops[Number.parseInt(stopSwquence) + 1] || {}
            console.log('res2', res2)
            console.log('目前站站點 - 經度:', currentstop.StopPosition.PositionLat || '無資料')
            console.log('目前站站點 - 緯度:', currentstop.StopPosition.PositionLon || '無資料')
            console.log('下 1 站站點:', nextstop1)
            console.log('下 2 站站點:', nextstop2)

            bus.stopName = stopName
            bus.nextStations = [nextstop1.StopName?.Zh_tw || '無資料', nextstop2.StopName?.Zh_tw || '無資料']
            // 取得目前站點經緯度
            bus.currentLocation = {
              latitude: currentstop.StopPosition.PositionLat || '無資料',
              longitude: currentstop.StopPosition.PositionLon || '無資料',
            }

            console.log('[寫入 bus 資料]', bus.stopName)
            console.log('[寫入 bus 資料]', bus.nextStations)
            console.log('[寫入 bus 位置]', bus.currentLocation)
          }
        } catch (error) {
          console.error('處理車輛資料錯誤', error)
        }
      }
    } catch (error) {
      console.error('取得公車動態失敗', error)
    }
  }

  onMounted(async () => {
    await getBusToken()

    // await getBusInfo('Taipei', '257')

    // 只抓你指定的這四條路線
    const uniqueRoutes = [...new Set(busList.value.map(bus => `${bus.busroute.city}-${bus.busroute.routeName}`))]

    for (const routeWithCity of uniqueRoutes) {
      const [city, route] = routeWithCity.split('-')
      await getBusInfo(city, route)
    }
  })

  const getNextStopLabel = bus => {
    const stops = bus.nextStations
    // console.log(getNextStopLabel)
    if (!Array.isArray(stops) || stops.length === 0 || !stops[0]) {
      return '下一站：無'
    }
    if (stops.length === 1 || !stops[1]) {
      return `下一站：${stops[0]}`
    }
    // 避免 stops[1] 為空字串
    if (stops[1]) {
      return `下兩站：${stops[0]} 和 ${stops[1]}`
    }
    return `下一站：${stops[0]}`
  }

  const getCurrentLocation = bus => {
    const loc = bus.currentLocation
    if (loc.latitude && loc.longitude) {
      return `經度 ${loc.longitude}, 緯度 ${loc.latitude}`
    }
    return '無'
  }
</script>

<style scoped>
.bus-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 兩欄排版 */
  gap: 24px;
  padding: 40px;
}

.bus-card {
  display: flex;
  background-color: #f9f9f9;
  color: #3e3a3d;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.bus-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
}

.bus-info {
  padding: 16px;
  flex: 1;
}

.bus-info h3 {
  margin: 0 0 10px;
  font-size: 18px;
}

.bus-info p {
  margin: 0;
  color:green;
  line-height: 2;
}

.bus-info h4 {
  margin: 0;
  color: black;
  line-height: 2;
}

.bus-info h5 {
  margin: 0;
  color: #2c5647;
  line-height: 2;
}

/* 手機版響應式：變成一欄 */
@media (max-width: 768px) {
  .bus-list {
    grid-template-columns: 1fr;
  }

  .bus-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .bus-image {
    width: 100%;
    height: auto;
  }

  .bus-info {
    padding: 16px;
  }
}
</style>

<route lang="yaml">
  meta:
    # 標題
    title: '公車資訊'
    # 只能在沒登入的情況下看
    login: 'no-login-only'
    # 不是管理員也能看
    admin: false
</route>
