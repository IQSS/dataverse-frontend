import { PropsWithChildren } from 'react'
import { Tab as TabBS } from 'react-bootstrap'

export interface TabProps {
  title: string
  eventKey: string
  disabled?: boolean
}

export function Tab({ title, eventKey, disabled = false, children }: PropsWithChildren<TabProps>) {
  return (
    <TabBS title={title} eventKey={eventKey} disabled={disabled}>
      {children}
    </TabBS>
  )
}
