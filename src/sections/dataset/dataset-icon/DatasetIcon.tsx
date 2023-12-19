import styles from './DatasetIcon.module.scss'
import { Icon, IconName } from '@iqss/dataverse-design-system'

export function DatasetIcon() {
  return (
    <div className={styles.icon}>
      <Icon name={IconName.DATASET} />
    </div>
  )
}
