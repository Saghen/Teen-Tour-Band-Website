import axios from 'axios'
import config from 'Config'

import { navigate } from 'raviger'

const instance = axios.create({
  baseURL: config.api.getUrl(),
  withCredentials: true,
  headers: { 'content-type': 'application/json' }
})

instance.interceptors.response.use(
  res => res.data,
  err => {
    if (err.response?.data?.invalidToken) navigate('/logout')

    delete err.message
    if (err.response?.data?.message)
      err.message =
        err.response.status >= 500 ? 'An error occured on the server' : err.response.data.message

    return Promise.reject(err)
  }
)

export default instance
