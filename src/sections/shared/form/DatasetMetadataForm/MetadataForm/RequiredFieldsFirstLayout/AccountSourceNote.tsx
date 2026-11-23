import { useTranslation } from 'react-i18next'
import { Form } from '@iqss/dataverse-design-system'
import { type User } from '@/users/domain/models/User'
import { type UserDataPrefillValue } from '../userDataPrefill'
import styles from './RequiredFieldsFirstLayout.module.scss'

interface AccountSourceNoteProps {
  user: User
  prefillValues: UserDataPrefillValue[]
}

const NAME_FIELD_SUFFIX = 'Name'
const AFFILIATION_FIELD_SUFFIX = 'Affiliation'

/**
 * A note under a completed field listing what was filled in from the depositor's account. When the
 * account holds an ORCID iD it is shown after the name, and a ROR ID after the affiliation.
 */
export const AccountSourceNote = ({ user, prefillValues }: AccountSourceNoteProps) => {
  const { t } = useTranslation('shared', {
    keyPrefix: 'datasetMetadataForm.requiredFieldsFirst.completed'
  })

  const parts = prefillValues.flatMap(({ fieldName, value }) => {
    const childFieldName = fieldName.split('.').pop() ?? ''
    const identifiers: string[] = []

    // The identifiers are shown as plain text, so their slashes must not be escaped
    if (childFieldName.endsWith(NAME_FIELD_SUFFIX) && user.orcid) {
      identifiers.push(t('orcid', { orcid: user.orcid, interpolation: { escapeValue: false } }))
    }
    if (childFieldName.endsWith(AFFILIATION_FIELD_SUFFIX) && user.affiliationRorId) {
      identifiers.push(
        t('ror', { ror: user.affiliationRorId, interpolation: { escapeValue: false } })
      )
    }

    return [value, ...identifiers]
  })

  if (parts.length === 0) return null

  return (
    <div className={styles['account-note']} data-testid="account-source-note">
      <Form.Group.Text>
        {t('fromAccount')} {parts.join(' · ')}
      </Form.Group.Text>
    </div>
  )
}
