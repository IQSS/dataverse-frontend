import { Alert } from '@iqss/dataverse-design-system'

interface ErrorItemsMessageProps {
  errorMessage: string
}

export const ErrorItemsMessage = ({ errorMessage }: ErrorItemsMessageProps) => (
  <Alert variant="danger" dismissible={false}>
    {errorMessage}
  </Alert>
)
