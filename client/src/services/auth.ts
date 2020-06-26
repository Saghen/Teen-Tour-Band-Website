import request from 'Request'

const AuthService = {
  async login({ username, password }) {
    return request.post('/auth/login', { username, password })
  },

  async get() {
    return request.get('/auth/get')
  },

  async logout() {
    return request.get('/auth/logout')
  }
}

export default AuthService
