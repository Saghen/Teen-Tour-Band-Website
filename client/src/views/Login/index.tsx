import React from 'react'
import styled from '@emotion/styled'

import { colors } from 'Constants'

import { Flex, Grid } from 'lese'
import Login from './Login'
import SetupAccount from './SetupAccount'
import Switcher from './Switcher'

const formWidth = '400px'

const Background = styled(Flex)`
  background-color: #1b1d24;
  width: 100vw;
  height: 100vh;
`
Background.defaultProps = { xAlign: true, yAlign: true }

const LoginCard = styled(Grid)`
  position: relative;
  background-color: ${colors.background.default};
  box-shadow: 10px 10px 53px 0px rgba(0, 0, 0, 0.75);
`

const LoginForm = styled(Flex)`
  padding: 48px 16px;
`
LoginForm.defaultProps = { xAlign: true, separation: '32px', column: true }

export default () => {
  return (
    <Background>
      <LoginCard columns={`${formWidth} ${formWidth}`} align="center">
        <LoginForm>
          <Login />
        </LoginForm>
        <LoginForm>
          <SetupAccount />
        </LoginForm>
        <Switcher formWidth={formWidth} />
      </LoginCard>
    </Background>
  )
}
