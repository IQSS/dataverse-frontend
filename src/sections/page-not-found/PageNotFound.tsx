import { Alert } from 'dataverse-design-system'

export function PageNotFound() {
  return (
    <Alert variant="danger" customHeading="Page Not Found" dismissible={false}>
      The page you are looking for was not found. If you believe this is an error, please contact
      Demo Dataverse Support for assistance.
    </Alert>
  )
}
