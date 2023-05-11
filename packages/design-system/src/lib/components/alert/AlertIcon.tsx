import { AlertVariant } from './AlertVariant'
import {
  CheckCircleFill,
  ExclamationCircleFill,
  ExclamationTriangleFill,
  InfoCircleFill
} from 'react-bootstrap-icons'

interface AlertIconProps {
  variant: AlertVariant
}
export function AlertIcon({ variant }: AlertIconProps) {
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
  return (
    <span role="img" aria-label={`alert-icon-${variant}`}>
      {getAlertIcon(variant)}
    </span>
  )
}
