import React, { useState } from 'react'
import styled from '@emotion/styled'
import { useQueryParams } from 'raviger'

import { colors } from 'Constants'

import { Flex } from 'lese'

import { H2, Text } from 'Components/shared/Typography'
import { Button } from 'Components/shared/Button'

type SwitcherProps = {
  isSwitched: boolean
  formWidth: string
}

const Switcher = styled(Flex)<SwitcherProps>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${({ isSwitched, formWidth }) => (isSwitched ? '0' : formWidth)};
  background-color: ${colors.secondary.default};
  color: ${colors.primary.text};
  width: ${({ formWidth }) => formWidth};
  height: 100%;
  padding: 0 32px;
  box-sizing: border-box;
  transition: 0.2s left;
`
Switcher.defaultProps = { column: true, separation: '24px', xAlign: true, yAlign: true }

const SwitcherBackground = styled.picture`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.15;
  mix-blend-mode: overlay;
  pointer-events: none;

  > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

export default props => {
  const [{ setupAccount }] = useQueryParams()
  const [isSwitched, setIsSwitched] = useState(setupAccount === 'true')
  return (
    <Switcher isSwitched={isSwitched} {...props}>
      <SwitcherBackground>
        <source type="image/webp" srcSet="/login-overlay.webp" />
        <img src="/login-overlay.jpg" alt="" />
      </SwitcherBackground>
      <H2>Welcome{!isSwitched && ' Back'}!</H2>
      <Text align>
        {isSwitched && 'Accounts are for band members only. Please fill in the info on the right to continue.'}
        {!isSwitched && 'Please enter your login credentials on the left to continue'}
      </Text>
      <Button
        color={colors.background.default}
        textColor={colors.background.text}
        onClick={() => setIsSwitched(!isSwitched)}
      >
        {isSwitched ? 'Login' : 'Setup Account'}
      </Button>
    </Switcher>
  )
}
