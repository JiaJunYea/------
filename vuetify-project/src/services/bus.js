import apiService from './api'

export default {
  login (params) {
    return apiService.busapi.post('https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  },

  getCurrentBus (city, routeName, num) {
    return apiService.busapiAuth.get(`v2/Bus/RealTimeNearStop/City/${city}/${routeName}`, { params: {
      $top: num, // 顯示的公車數量
      $format: 'JSON', // 期望返回 JSON 格式
    } })
  },

  getNextStations (city, routeName, routeID, direction) {
    return apiService.busapiAuth.get(`v2/Bus/DisplayStopOfRoute/City/${city}/${routeName}`, { params: {
      $filter: `RouteID eq '${routeID}' and Direction eq '${direction}'`, // 篩選條件
      $format: 'JSON', // 期望返回 JSON 格式
    } })
  },
}

// https://tdx.transportdata.tw/api/basic/v2/Bus/RealTimeNearStop/City/Taipei/257?%24top=30&%24format=JSON

// 這是chatgpt寫法========================================================================
// import apiService from './api'

// export default {
//   // 方法從 API 獲取公車資料
//   getCurrentBus(routeName, num) {
//     return apiService.busapi.get('v2/Bus/RealTimeNearStop/City/Taipei/' + routeName, {
//       params: { top: num, format: 'JSON' }
//     });
//   },
// };

// // 使用 async 函數來等待結果
// (async () => {
//   try {
//     // 等待 API 請求的結果並解構出 data
//     const { data } = await apiService.getCurrentBus('257', 30);
//     console.log(data);  // 打印返回的資料
//   } catch (error) {
//     console.error('獲取資料錯誤：', error);  // 捕捉並打印錯誤
//   }
// })();
