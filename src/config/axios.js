import axios from 'axios'
import swal from 'sweetalert'

axios.defaults.baseURL = 'http://192.168.0.29/api-curbd/public/'

const token = localStorage.getItem('token')

if (token) {
  axios.defaults.headers.common['Authorization'] = 'Bearer '+ token
}

axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response;
}, function (error) {
  // Do something with response error
  if (error.response.status == 500)
    swal({title: "Something went wrong on API side", icon: "warning"})
  else
    swal(error.response.data.message)
  return Promise.reject(error);
});
