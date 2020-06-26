import React, { useState } from 'react'
import styled from '@emotion/styled'

import { colors } from 'Constants'

import { Flex } from 'lese'

type TabsProps = {
  children: React.DetailedReactHTMLElement<any, HTMLElement>[]
}

const Tabs: React.FC<TabsProps> = ({ children, ...props }) => {
  const [activeTab, setActiveTab] = useState(0)

  const childrenArr = React.Children.toArray(children) as React.DetailedReactHTMLElement<
    any,
    HTMLElement
  >[]

  const tabs = React.cloneElement(childrenArr[0], { setActiveTab, activeTab })
  // TODO: Just display none lol
  return (
    <Flex column {...props}>
      {tabs}
      {childrenArr[activeTab + 1]}
    </Flex>
  )
}

const TabList = ({ setActiveTab, activeTab, children, ...props }) => (
  <Flex {...props}>
    {children.map((child, tabNumber) =>
      React.cloneElement(child, {
        onClick: () => setActiveTab(tabNumber),
        active: tabNumber === activeTab
      })
    )}
  </Flex>
)

type TabType = {
  active?: boolean
}

const Tab = styled(Flex)<TabType>`
  justify-content: center;
  padding: 16px 36px;
  cursor: pointer;

  ${({ active }) => active && `background-color: ${colors.background[800]}`}
`

const TabContent = styled(Flex)`
  padding: 16px;
`
TabContent.defaultProps = { column: true, separation: '16px' }

export { Tabs, TabList, Tab, TabContent }
