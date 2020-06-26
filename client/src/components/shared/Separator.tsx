import styled from '@emotion/styled'
import { colors } from 'Constants'

type SeperatorProps = {
  width?: string
  height?: string
  color?: string
}

export default styled.div<SeperatorProps>`
  width: ${({ width }) => width ?? '100px'};
  height: ${({ height }) => height ?? '2px'};
  background-color: ${({ color }) => color ?? colors.backgroundInverted.default};
  align-self: center;
`
