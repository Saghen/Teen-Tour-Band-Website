import React from 'react'
import styled from '@emotion/styled'

import { colors } from 'Constants'

import { propertyGenerator } from 'lese'

type TextProps = {
  align?: boolean | string
  small?: boolean
}

const TextProperties = propertyGenerator([
  ['align', { property: 'text-align', default: 'center' }],
  ['small', () => 'font-size: 0.8em']
])

const Text = styled.span<TextProps>`
  font-family: 'proxima-nova', sans-serif;
  line-height: 1.2em;
  ${TextProperties}
`

const H1 = styled(Text)`
  font-size: 2em;
`.withComponent('h1')

const H2 = styled(Text)`
  font-size: 1.6em;
`.withComponent('h2')

const H3 = styled(Text)`
  font-size: 1.4em;
`.withComponent('h3')

const FadedText = styled(Text)`
  color: ${colors.background.textFaded};
`

const ErrorText = styled(Text)`
  color: ${colors.primary.textColor};
`

const SuccessText = styled(Text)`
  color: ${colors.green.textColor};
`

const LabelWithTitle = ({ title, children }) => (
  <div>
    <FadedText>{title}: </FadedText>
    <Text>{children}</Text>
  </div>
)

export { Text, H1, H2, H3, FadedText, ErrorText, SuccessText, LabelWithTitle }
