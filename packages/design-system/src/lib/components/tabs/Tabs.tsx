import { PropsWithChildren } from 'react'
import { Tab } from './Tab'
import { Tabs as TabsBS } from 'react-bootstrap'

interface TabsProps {
  defaultActiveKey?: string
  activeKey?: string
  onSelect?: (key: string | null) => void
}

function Tabs({ defaultActiveKey, activeKey, onSelect, children }: PropsWithChildren<TabsProps>) {
  if (activeKey && !onSelect) {
    throw new Error('Tabs component requires onSelect function when activeKey is provided')
  }
  if (!activeKey && !defaultActiveKey) {
    throw new Error('Tabs component requires either activeKey or defaultActiveKey')
  }
  return (
    <TabsBS onSelect={onSelect} activeKey={activeKey} defaultActiveKey={defaultActiveKey}>
      {children}
    </TabsBS>
  )
}
Tabs.Tab = Tab
export { Tabs }
