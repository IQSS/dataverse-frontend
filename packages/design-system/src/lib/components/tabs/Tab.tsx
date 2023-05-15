import { PropsWithChildren } from 'react'
import { Tab as TabBS } from 'react-bootstrap'

export interface TabProps {
  title: string
  eventKey: string
}

export function Tab({ title, eventKey, children }: PropsWithChildren<TabProps>) {
  return (
    <TabBS title={title} eventKey={eventKey}>
      {children}
    </TabBS>
  )
}
