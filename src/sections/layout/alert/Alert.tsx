/*
export function Alert({ variant, dismissible = true, children, customHeading }: AlertProps) {
  interface AlertIcons {
    [key: string]: JSX.Element
  }
  interface AlertHeadings {
    [key: string]: string
  }
  const ALERT_ICONS: AlertIcons = {
    success: <CheckCircleFill></CheckCircleFill>,
    info: <InfoCircleFill></InfoCircleFill>,
    warning: <ExclamationTriangleFill></ExclamationTriangleFill>,
    danger: <ExclamationCircleFill></ExclamationCircleFill>
  }

  const ALERT_HEADINGS: AlertHeadings = {
    success: 'Success!',
    info: 'Information',
    warning: 'Warning',
    danger: 'Error'
  }
  const [show, setShow] = useState(true)

  function getAlertIcon(variant: AlertVariant): JSX.Element {
    return ALERT_ICONS[variant]
  }

  function getVariantHeading(variant: AlertVariant, customHeading?: string): string {
    return customHeading ?? ALERT_HEADINGS[variant];
  }

  const heading = getVariantHeading(variant, customHeading);

  return (
      <>
        {show && (
            <AlertBS variant={variant} onClose={() => setShow(false)} dismissible={dismissible}>
          <span role="img" aria-label={`alert-icon-${variant}`}>
            {getAlertIcon(variant)}
          </span>{' '}
              &nbsp;
              {heading}
              {children}
            </AlertBS>
        )}
      </>
  )
}
*/

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
  customHeading?: string
}

export function Alert({ variant, dismissible = true, customHeading, children }: AlertProps) {
  interface AlertIcons {
    [key: string]: JSX.Element
  }
  interface AlertHeadings {
    [key: string]: string
  }
  const ALERT_ICONS: AlertIcons = {
    success: <CheckCircleFill></CheckCircleFill>,
    info: <InfoCircleFill></InfoCircleFill>,
    warning: <ExclamationTriangleFill></ExclamationTriangleFill>,
    danger: <ExclamationCircleFill></ExclamationCircleFill>
  }

  const ALERT_HEADINGS: AlertHeadings = {
    success: 'Success!',
    info: 'Information',
    warning: 'Warning',
    danger: 'Error'
  }
  const [show, setShow] = useState(true)

  function getAlertIcon(variant: AlertVariant): JSX.Element {
    return ALERT_ICONS[variant]
  }
  function getAlertHeading(variant: AlertVariant, customHeading?: string): string {
    return customHeading ?? ALERT_HEADINGS[variant]
  }
  const heading = getAlertHeading(variant, customHeading)

  return (
    <>
      {show && (
        <AlertBS variant={variant} onClose={() => setShow(false)} dismissible={dismissible}>
          <span role="img" aria-label={`alert-icon-${variant}`}>
            {getAlertIcon(variant)}
          </span>{' '}
          &nbsp;
          <b>{heading}</b> - {children}
        </AlertBS>
      )}
    </>
  )
}
