import { Alert } from '@iqss/dataverse-design-system'

interface ErrorDatasetsMessageProps {
  errorMessage: string
}

export const ErrorDatasetsMessage = ({ errorMessage }: ErrorDatasetsMessageProps) => (
  <Alert variant="danger" dismissible={false}>
    {errorMessage}
  </Alert>
)
