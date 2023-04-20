import { Alert as AlertBS } from 'react-bootstrap'
import { ReactNode, useState } from 'react'
import {
  CheckCircleFill,
  ExclamationCircleFill,
  ExclamationTriangleFill,
  InfoCircleFill
} from 'react-bootstrap-icons'

interface AlertProps {
  variant: 'success' | 'danger' | 'warning' | 'info'
  dismissible: boolean
  children: ReactNode
}

export function Alert({ variant, dismissible, children }: AlertProps) {
  function getAlertIcon(variant: string) {
    let icon
    switch (variant) {
      case 'success':
        console.log('success')
        icon = <CheckCircleFill></CheckCircleFill>
        break
      case 'info':
        icon = <InfoCircleFill></InfoCircleFill>
        break
      case 'warning':
        icon = <ExclamationTriangleFill></ExclamationTriangleFill>
        break
      case 'danger':
        icon = <ExclamationCircleFill></ExclamationCircleFill>
    }
    return icon
  }
  const [show, setShow] = useState(true)
  if (show) {
    return (
      <AlertBS variant={variant} onClose={() => setShow(false)} dismissible={dismissible}>
        <span role="img" aria-label={'alert-icon-' + variant}>
          {getAlertIcon(variant)}
        </span>{' '}
        &nbsp;
        {children}
      </AlertBS>
    )
  } else {
    return null
  }
}
