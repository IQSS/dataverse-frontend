import { Alert } from '@iqss/dataverse-design-system'

export function ConfigError(props: { message: string; schemaError?: string }) {
  const { message, schemaError } = props

  return (
    <section className="d-flex align-items-center justify-content-center min-vh-100 p-4">
      <Alert variant="danger" customHeading="Configuration Error" dismissible={false}>
        <p className="my-2">{message}</p>
        {schemaError && (
          <>
            <p className="mb-1">
              <strong>
                <i>Check the schema validation errors below 👇</i>
              </strong>
            </p>
            <pre>{schemaError}</pre>
          </>
        )}
      </Alert>
    </section>
  )
}
