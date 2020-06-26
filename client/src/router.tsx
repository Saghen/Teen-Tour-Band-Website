import React from 'react'
import { useRoutes, usePath, navigate } from 'raviger'
import { useStore } from 'laco-react'

import UserStore from 'Store/user'

import Base from 'Views/Base'
import Login from 'Views/Login'
import Logout from 'Views/Logout'

const loginPath = '/login'

export const routes = {
  [loginPath]: () => <Login />,
  '/logout': () => <Logout />
}

export default () => {
  const path = usePath()
  const userStore = useStore(UserStore)
  if (!userStore.isLoggedIn && path !== loginPath) {
    navigate(loginPath)
  }

  const newPath = usePath()

  const routeResult = useRoutes(routes)

  if (newPath === loginPath) return routeResult
  return <Base>{routeResult}</Base>
}
