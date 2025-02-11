import { PropsWithChildren, useEffect, useState } from 'react'
import { Tab } from './Tab'
import { Tabs as TabsBS } from 'react-bootstrap'

interface TabsProps {
  defaultActiveKey: string
  onSelect?: (key: string | null) => void
}

function Tabs({ defaultActiveKey, onSelect, children }: PropsWithChildren<TabsProps>) {
  return (
    <TabsBS onSelect={onSelect} activeKey={defaultActiveKey}>
      {children}
    </TabsBS>
  )
}
Tabs.Tab = Tab
export { Tabs }
