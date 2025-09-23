import { useTranslation } from 'react-i18next'
import { BriefcaseFill } from 'react-bootstrap-icons'
import { Button } from '@iqss/dataverse-design-system'
import { useSession } from '@/sections/session/SessionContext'
import { useDataset } from '@/sections/dataset/DatasetContext'
import { useNavigate } from 'react-router-dom'
import { QueryParamKey, Route } from '@/sections/Route.enum'
import {
  DatasetPublishingStatus,
  DatasetNonNumericVersionSearchParam
} from '@/dataset/domain/models/Dataset'
import styles from './EditDatasetTermsButton.module.scss'

export function EditDatasetTermsButton() {
  const { t } = useTranslation('dataset')
  const { user } = useSession()
  const { dataset } = useDataset()
  const navigate = useNavigate()

  if (!user || !dataset?.permissions.canUpdateDataset) {
    return null
  }

  const handleClick = () => {
    const searchParams = new URLSearchParams()
    searchParams.set(QueryParamKey.PERSISTENT_ID, dataset.persistentId)

    if (dataset.version.publishingStatus === DatasetPublishingStatus.DRAFT) {
      searchParams.set(QueryParamKey.VERSION, DatasetNonNumericVersionSearchParam.DRAFT)
    } else {
      searchParams.set(QueryParamKey.VERSION, dataset.version.number.toString())
    }

    navigate(`${Route.EDIT_DATASET_TERMS}?${searchParams.toString()}`)
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
