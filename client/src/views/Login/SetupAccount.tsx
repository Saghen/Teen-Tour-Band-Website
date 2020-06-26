import React from 'react'

import { User as UserIcon, Lock as PasswordIcon, Code as VerificationCodeIcon } from 'react-feather'

import Input from 'Components/shared/Input'
import { Flex } from 'lese'
import { H2 } from 'Components/shared/Typography'
import { Button } from 'Components/shared/Button'

export default () => {
  return (
    <>
      <H2>Setup Account</H2>
      <Flex column separation="20px">
        <Input Icon={UserIcon} placeholder="Username" />
        <Input Icon={VerificationCodeIcon} placeholder="Verification Code" />
        <Input Icon={PasswordIcon} placeholder="Password" />
        <Input Icon={PasswordIcon} placeholder="Confirm Password" />
      </Flex>
      <Button>Setup Account</Button>
    </>
  )
}
