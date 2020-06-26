import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'

import { navigate } from 'raviger'

import { Flex } from 'lese'

import AuthService from 'Services/auth'

import { H1, Text } from 'Components/shared/Typography'
import { Button } from 'Components/shared/Button'

const LogoutContainer = styled(Flex)`
  width: 100vw;
  height: 100vh;
`

export default () => {
  const [loggedOut, setLoggedOut] = useState(false)
  const [logOutFailed, setLogOutFailed] = useState(false)

  useEffect(() => {
    AuthService.logout()
      .then(() => {
        setLoggedOut(true)
        navigate('/login')
      })
      .catch(() => setLogOutFailed(true))
  }, [])

  return (
    <LogoutContainer column xAlign yAlign separation="16px">
      <H1>
        {loggedOut && 'Successfully logged out. Redirecting...'}
        {logOutFailed && !loggedOut && 'Logout failed. Please clear cookies manually'}
        {!loggedOut && !logOutFailed && 'Logging you out...'}
      </H1>
      <Text>If this was not manual, this occured due to an invalid login token.</Text>
      <Text>Re-logging in will fix the issue</Text>
      {loggedOut ||
        (logOutFailed && <Button onClick={() => navigate('/login')}>Click here to login</Button>)}
    </LogoutContainer>
  )
}
