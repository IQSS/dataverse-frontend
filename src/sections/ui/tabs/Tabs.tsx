import { PropsWithChildren } from 'react'
import { Tab } from './tab/Tab'
import { Tabs as TabsBS } from 'react-bootstrap'

interface TabsProps {
  defaultActiveKey: string
}

function Tabs({ defaultActiveKey, children }: PropsWithChildren<TabsProps>) {
  return <TabsBS defaultActiveKey={defaultActiveKey}>{children}</TabsBS>
}

Tabs.Tab = Tab

export { Tabs }
