import React from 'react'
import styled from '@emotion/styled'
import { ActiveLink } from 'raviger'
import { colors } from 'Constants'
import isExternal from 'is-url-external'
import isRelativeUrl from 'is-relative-url'

type LinkProps = {
  to?: string
  color?: string
  underline?: boolean
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>
} & React.HTMLAttributes<HTMLAnchorElement | HTMLButtonElement>

const Link: React.FunctionComponent<LinkProps> = ({ to, children, ...props }) => {
  if (to && isExternal(to))
    return (
      <a target="_blank" rel="noopener noreferrer" href={to} {...props}>
        {children}
      </a>
    )
  if (to && isRelativeUrl(to))
    return (
      <ActiveLink
        activeClass="link-active"
        exactActiveClass="link-active-exact"
        href={to}
        {...props}
      >
        {children}
      </ActiveLink>
    )
  return (
    <button type="button" {...props}>
      {children}
    </button>
  )
}

const StyledLink = styled(Link)`
  position: relative;
  color: ${props => props.color || colors.secondary.textColor};
  text-decoration: none;
  cursor: pointer;
  background: none;
  border: none;
  outline: none;
  padding: 0; /* Necessary for button */
  line-height: 0; /* Solved vertical alignment on button */

  ::after {
    ${props => props.underline && "content: '';"}
    background-color: ${props => props.color || colors.primary.default};
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    width: 0;
    transition: 0.2s width;
  }

  :hover::after {
    width: 100%;
  }
`

export default StyledLink

export const NavbarLink = styled(StyledLink)`
  color: ${colors.background.text};
`
