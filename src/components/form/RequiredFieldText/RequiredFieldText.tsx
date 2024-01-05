import { RequiredInputSymbol } from '@iqss/dataverse-design-system'

export function RequiredFieldText() {
  return (
    <p>
      <RequiredInputSymbol />
      Asterisks indicate required fields
    </p>
  )
}
