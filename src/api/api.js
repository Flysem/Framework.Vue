import axios from 'axios'
import Vue from 'vue'
const _apiUrl = {

  Login: '/api/Login',

  Menus: '/api/Menu',

  MenusAll: '/api/Menu/All',

  Power: '/api/PowerRole',

  PowerAll: '/api/PowerRole/All',

  User: '/api/User',

  UserImg: '/images/uploader/UserIcon/',

  UserImgupload: '/api/User/Icon'

}

let base = ''
// 如果是IIS部署，用这个，因为 IIS 只能是 CORS 跨域，不能代理
// base = process.env.NODE_ENV === 'production' ? 'http:/127.0.0.1:5000' : ''
base = 'http://127.0.0.1:5001'
// 请求发送拦截，把数据发送给后台之前做些什么......
axios.interceptors.request.use((request) => {
  request.headers.Authorization = 'Bearer ' + localStorage.getItem('Authorization')
  return request
}, function (error) {
  Vue.prototype.$message({
    message: '请求异常',
    type: 'error'
  })
  return Promise.reject(error)
})
// 请求返回拦截，把数据返回到页面之前做些什么...
axios.interceptors.response.use((response) => {
  return response
}, function (error) {
  let message = '请求异常'
  if (error.response) {
    switch (error.response.status) {
      case 500:
        message = '服务器错误'
        break
      case 401:
        message = '无权限'
        break
    }
  } else {
    message = error
  }
  Vue.prototype.$message({
    message: message,
    type: 'error'
  })
  return Promise.reject(error)
})

const api = {}

api.base = base
api.apiUrl = _apiUrl

// function GetTime () {
//   var nowDate = new Date()
//   var year = nowDate.getFullYear()
//   var month = nowDate.getMonth() + 1
//   var today = nowDate.getDate()
//   var hours = nowDate.getHours()
//   var minutes = nowDate.getMinutes()
//   var seconds = nowDate.getSeconds()

//   if (month >= 1 && month <= 9) {
//     month = '0' + month
//   }
//   if (today >= 1 && today <= 9) {
//     today = '0' + today
//   }
//   var currentdate = year + '-' + month + '-' + today + ' ' + hours + ':' + minutes + ':' + seconds
//   return new Date(currentdate.replace(new RegExp('-', 'gm'), '/')).getTime()
// }

api.Query = (url, succeed, parameters, error) => {
  return axios.get(`${base}${url}`, { params: parameters })
    .then(res => res.data)
    .then(data => { succeed(data) }).catch(_error => { error(_error) })
}

api.update = (url, succeed, parameters, error) => {
  return axios.put(`${base}${url}`, parameters)
    .then(res => res.data)
    .then(data => { succeed(data) }).catch(_error => { error(_error) })
}

api.delete = (url, succeed, parameters, error) => {
  return axios.delete(`${base}${url}`, { data: parameters })
    .then(res => res.data)
    .then(data => { succeed(data) }).catch(_error => { error(_error) })
}

api.add = (url, succeed, parameters, error) => {
  return axios.post(`${base}${url}`, parameters)
    .then(res => res.data)
    .then(data => { succeed(data) }).catch(_error => { error(_error) })
}

api.GetImg = (filename) => {
  // + '?v=' + GetTime() + Math.floor(Math.random() * 10 + 1)
  return `${base}${_apiUrl.UserImg}` + filename
}

api.UserUpload = () => {
  return `${base}${_apiUrl.UserImgupload}`
}

export default api
