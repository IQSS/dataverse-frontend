import { Alert as AlertBS } from 'react-bootstrap'
import { AlertVariant } from './AlertVariant'
import { AlertIcon } from './AlertIcon'
import { ReactNode, useState } from 'react'
import { AlertLink } from './AlertLink'

interface AlertProps {
  variant: AlertVariant
  dismissible?: boolean
  customHeading?: string
  children: ReactNode
}

function Alert({ variant, dismissible = true, customHeading, children }: AlertProps) {
  interface AlertHeadings {
    [key: string]: string
  }

  const ALERT_HEADINGS: AlertHeadings = {
    success: 'Success!',
    info: 'Information',
    warning: 'Warning',
    danger: 'Error'
  }
  const [show, setShow] = useState(true)

  function getAlertHeading(variant: AlertVariant, customHeading?: string): string {
    return customHeading ?? ALERT_HEADINGS[variant]
  }
  const heading = getAlertHeading(variant, customHeading)

  return (
    <>
      {show && (
        <AlertBS variant={variant} onClose={() => setShow(false)} dismissible={dismissible}>
          <AlertIcon variant={variant} />
          &nbsp;
          <b>{heading}</b> - {children}
        </AlertBS>
      )}
    </>
  )
}
Alert.Link = AlertLink

export { Alert }
