import { Alert as AlertBS } from 'react-bootstrap'
import { ReactNode, useState } from 'react'
import {
  CheckCircleFill,
  ExclamationCircleFill,
  ExclamationTriangleFill,
  InfoCircleFill
} from 'react-bootstrap-icons'

type AlertVariant = 'success' | 'info' | 'warning' | 'danger'

interface AlertProps {
  variant: AlertVariant
  dismissible?: boolean
  children: ReactNode
}

export function Alert({ variant, dismissible = true, children }: AlertProps) {
  interface AlertIcons {
    [key: string]: JSX.Element
  }

  const ALERT_ICONS: AlertIcons = {
    success: <CheckCircleFill></CheckCircleFill>,
    info: <InfoCircleFill></InfoCircleFill>,
    warning: <ExclamationTriangleFill></ExclamationTriangleFill>,
    danger: <ExclamationCircleFill></ExclamationCircleFill>
  }

  function getAlertIcon(variant: AlertVariant): JSX.Element {
    return ALERT_ICONS[variant]
  }

  const [show, setShow] = useState(true)
  return (
    show && (
      <AlertBS variant={variant} onClose={() => setShow(false)} dismissible={dismissible}>
        <span role="img" aria-label={'alert-icon-' + variant}>
          {getAlertIcon(variant)}
        </span>{' '}
        &nbsp;
        {children}
      </AlertBS>
    )
  )
}
