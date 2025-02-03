import { PropsWithChildren, useEffect, useState } from 'react'
import { Tab } from './Tab'
import { Tabs as TabsBS } from 'react-bootstrap'

interface TabsProps {
  defaultActiveKey: string
  onSelect?: (key: string | null) => void
}

function Tabs({ defaultActiveKey, onSelect, children }: PropsWithChildren<TabsProps>) {
  const [key, setKey] = useState(defaultActiveKey)

  useEffect(() => {
    if (defaultActiveKey) {
      setKey(defaultActiveKey)
    }
  }, [defaultActiveKey])

  const handleSelect = (k: string | null) => {
    if (k) {
      setKey(k)
      if (onSelect) {
        onSelect(k)
      }
    }
  }

  return (
    <TabsBS onSelect={handleSelect} activeKey={key}>
      {children}
    </TabsBS>
  )
}
Tabs.Tab = Tab
export { Tabs }
