import { useTranslation } from 'react-i18next'
import { BriefcaseFill } from 'react-bootstrap-icons'
import { Button } from '@iqss/dataverse-design-system'
import { useSession } from '@/sections/session/SessionContext'
import { useDataset } from '@/sections/dataset/DatasetContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { QueryParamKey, Route } from '@/sections/Route.enum'
import styles from './EditDatasetTermsButton.module.scss'

export function EditDatasetTermsButton() {
  const { t } = useTranslation('dataset')
  const { user } = useSession()
  const { dataset } = useDataset()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  if (!user || !dataset?.permissions.canUpdateDataset) {
    return null
  }

  const handleClick = () => {
    // Preserve current dataset identifiers in query params if present
    const newParams = new URLSearchParams(searchParams)
    if (dataset?.persistentId) {
      newParams.set(QueryParamKey.PERSISTENT_ID, dataset.persistentId)
    }
    if (dataset?.version.number) {
      newParams.set(QueryParamKey.DATASET_VERSION, dataset.version.number.toString())
    }
    navigate(`${Route.EDIT_DATASET_TERMS}?${newParams.toString()}`)
  }

  return (
    <div className={styles['edit-terms-button-container']}>
      <Button
        type="button"
        size={'sm'}
        onClick={handleClick}
        icon={<BriefcaseFill className={styles.icon} />}
        disabled={dataset.checkIsLockedFromEdits(user.persistentId)}>
        {t('termsTab.editTermsButton')}
      </Button>
    </div>
  )
}
