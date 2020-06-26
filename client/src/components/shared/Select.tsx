import React, { useState, useEffect } from 'react'
import styled from '@emotion/styled'

import { colors } from 'Constants'
import { runOnEnter } from 'Helpers'

import { FadedText, Text } from 'Components/shared/Typography'
import { Flex } from 'lese'

import { ChevronDown } from 'react-feather'

import { Button } from 'Components/shared/Button'

const OptionsContainer = styled(Flex)`
  display: none;
  position: absolute;
  top: 100%;
  background: ${colors.background.default};
  width: 100%;
  border: 1px solid ${colors.background[700]};
  border-top: none;
  z-index: 10;
`

const Option = styled(Text)`
  cursor: pointer;
  padding: 12px;

  :hover {
    background-color: ${colors.background[800]};
  }
`

type SelectContainerProps = {
  open: boolean
} & React.HTMLAttributes<HTMLDivElement>

const SelectContainer = styled(Flex)<SelectContainerProps>`
  position: relative;
  cursor: pointer;
  outline: 0;
  ${({ open }) =>
    open &&
    `${OptionsContainer} {
      display: flex;
    }

    .select-icon {
      transform: rotate(180deg);
    }`}
`

const Select = ({ options, defaultIndex = 0, header, width, xAlign, onChange }) => {
  const [selection, setSelection] = useState(defaultIndex)
  const [open, setOpen] = useState(false)

  useEffect(() => setSelection(defaultIndex), [defaultIndex])

  const generateChangeHandler = i => () => {
    let shouldContinue = true
    if (typeof onChange === 'function')
      shouldContinue = !(onChange({ previousIndex: selection, newIndex: i }) === false)
    if (shouldContinue) setSelection(i)
    return true
  }

  options = options.map(option => (typeof option === 'string' ? { text: option } : option))

  return (
    <SelectContainer
      tabIndex={0}
      style={{ width }}
      xAlign={xAlign}
      onBlur={() => setOpen(false)}
      onKeyDown={runOnEnter(() => setOpen(!open))}
      onClick={() => setOpen(!open)}
      open={open}
    >
      <Flex separation="4px" yAlign>
        <Text>{options[selection].text}</Text>
        <ChevronDown className="select-icon" />
      </Flex>
      <OptionsContainer column>
        {header && <FadedText style={{ padding: '8px' }}>{header}</FadedText>}
        {options.map((option, i) => (
          <Option onClick={generateChangeHandler(i)}>{option.text}</Option>
        ))}
      </OptionsContainer>
    </SelectContainer>
  )
}

const SelectUsingButton = ({ options, defaultIndex = 0, header, onChange }) => {
  const [selection, setSelection] = useState(defaultIndex)
  const [open, setOpen] = useState(false)

  useEffect(() => setSelection(defaultIndex), [defaultIndex])

  const generateChangeHandler = i => () => {
    let shouldContinue = true
    if (typeof onChange === 'function')
      shouldContinue = !(onChange({ previousIndex: selection, newIndex: i }) === false)
    if (shouldContinue) setSelection(i)
    return true
  }

  options = options.map(option => (typeof option === 'string' ? { text: option } : option))

  return (
    <SelectContainer
      tabIndex={0}
      onBlur={() => setOpen(false)}
      onKeyDown={runOnEnter(() => setOpen(!open))}
      onClick={() => setOpen(!open)}
      open={open}
    >
      <Button separation="4px" yAlign color={options[selection].color}>
        <Text>{options[selection].text}</Text>
        <ChevronDown className="select-icon" size="16px" />
      </Button>
      <OptionsContainer column>
        {header && <FadedText style={{ padding: '8px' }}>{header}</FadedText>}
        {options.map((option, i) => (
          <Option onClick={generateChangeHandler(i)}>{option.text}</Option>
        ))}
      </OptionsContainer>
    </SelectContainer>
  )
}

export { Select, SelectUsingButton }
