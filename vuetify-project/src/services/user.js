import apiService from './api'

export default {
  create (data) {
    return apiService.api.post('/user', data)
  },
  getAll () {
    return apiService.apiAuth.get('/user/all')
  },
  login (data) {
    return apiService.api.post('/user/login', data)
  },
  profile () {
    return apiService.apiAuth.get('/user/profile')
  },
  logout () {
    return apiService.apiAuth.delete('/user/logout')
  },
  changeRole (data) {
    return apiService.apiAuth.patch('/user/changerole', data)
  },
  delete (data) {
    return apiService.apiAuth.post('/user/delete', data)
  },
}
