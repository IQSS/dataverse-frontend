import { Alert as AlertBS } from 'react-bootstrap'
import { ReactNode } from 'react'
import {
  CheckCircleFill,
  ExclamationCircleFill,
  ExclamationTriangleFill,
  InfoCircleFill
} from 'react-bootstrap-icons'

interface AlertProps {
  variant: 'success' | 'danger' | 'warning' | 'info'
  children: ReactNode
}

export function Alert({ variant, children }: AlertProps) {
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
  return (
    <AlertBS variant={variant}>
      <span role="img" aria-label={'alert-icon-' + variant}>
        {getAlertIcon(variant)}
      </span>{' '}
      &nbsp;
      {children}
    </AlertBS>
  )
}
