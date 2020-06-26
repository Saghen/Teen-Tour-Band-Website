import { Store } from 'laco'
import { cookieStringToObject } from 'Helpers'

import AuthService from 'Services/auth'

const UserStore = new Store({})

export function updateStore() {
  const cookies = cookieStringToObject()
  UserStore.set(() => ({
    isLoggedIn: Boolean(cookies.loggedIn),
    virtualOffices: [],
    user: cookies.user,
    token: cookies.token
  }))
}

export async function login({ username, password }) {
  const response = await AuthService.login({
    username,
    password
  })
  updateStore()
  return response
}

updateStore()

export default UserStore
