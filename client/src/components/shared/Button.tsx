import React from 'react'
import styled from '@emotion/styled'
import { colors } from 'Constants'

import { Flex } from 'lese'

import Link from './Link'

type ButtonProps = {
  disabled?: boolean
  secondary?: boolean
  wide?: boolean
  color?: string
  textColor?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

// TODO: Use a button
const Button = styled(Flex)<ButtonProps>`
  ${({ disabled }) => disabled && 'pointer-events: none; opacity: 0.5;'}
  color: ${({ secondary, color, textColor }) =>
    secondary ? color || colors.secondary.default : textColor || colors.secondary.text};
  background: ${({ secondary, color }) => (secondary ? 'transparent' : color || colors.secondary.default)};
  border: 2px solid ${({ color }) => color || colors.secondary.default};
  padding: ${({ wide }) => (wide ? '12px 32px' : '12px 20px')};
  transition: 0.2s all;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  align-items: center;
`

const ButtonWithLink = Button.withComponent(Link)

export { Button, ButtonWithLink }
