import React, { useState } from 'react'

import { navigate } from 'raviger'

import { colors } from 'Constants'
import { useInput, runOnEnter } from 'Helpers'

import { login } from 'Store/user'

import { User as UserIcon, Lock as PasswordIcon } from 'react-feather'

import Input from 'Components/shared/Input'
import { Flex } from 'lese'
import { H2, ErrorText } from 'Components/shared/Typography'
import { Button } from 'Components/shared/Button'
import Link from 'Components/shared/Link'

export default () => {
  const [forgotPassword, setForgotPassword] = useState(false)
  const [errorText, setErrorText] = useState('')

  const usernameHook = useInput('')
  const passwordHook = useInput('')

  const attemptLogin = async () => {
    const response = await login({
      username: usernameHook.value,
      password: passwordHook.value
    }).catch(err => {
      if (!err.response?.data?.message)
        return setErrorText(
          'There appears to be an issue with the server. Please contact a system administator.'
        )
      setErrorText(err.response.data.message)
    })
    if (!response) return
    navigate('/')
  }

  return (
    <>
      <H2>{forgotPassword ? 'Forgot Password' : 'Login'}</H2>
      <Flex column separation="20px">
        <Input
          Icon={UserIcon}
          placeholder="Username"
          onKeyDown={runOnEnter(attemptLogin)}
          {...usernameHook.bind}
        />
        {!forgotPassword && (
          <Input
            type="password"
            Icon={PasswordIcon}
            placeholder="Password"
            onKeyDown={runOnEnter(attemptLogin)}
            {...passwordHook.bind}
          />
        )}
      </Flex>

      <Button onClick={attemptLogin}>{forgotPassword ? 'Reset Password' : 'Login'}</Button>
      {errorText && <ErrorText align>{errorText}</ErrorText>}
      <Link onClick={() => setForgotPassword(!forgotPassword)} style={{ color: colors.background.textFaded }}>
        {forgotPassword ? 'Login' : 'Forgot password'}
      </Link>
    </>
  )
}
