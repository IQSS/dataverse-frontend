import { ChangeEvent } from 'react'
import cn from 'classnames'
import { Form, Icon, IconName, Stack } from '@iqss/dataverse-design-system'
import styles from './TypeFilters.module.scss'

export const TypeFilters = () => {
  return (
    <Stack gap={1} className={styles['type-filters']}>
      <Form.Group.Checkbox
        id="collections-type-check"
        onChange={(e: ChangeEvent<HTMLInputElement>) => console.log(e.target.checked)}
        label={
          <span
            className={cn(styles['label-content-wrapper'], {
              [styles['selected']]: true
            })}>
            <Icon name={IconName.COLLECTION} />
            <span>Collections (19)</span>
          </span>
        }
        // checked={Boolean(value as boolean)} // TODO:ME Handle this and other filter states in a useReducer
      />
      <Form.Group.Checkbox
        id="datasets-type-check"
        onChange={(e: ChangeEvent<HTMLInputElement>) => console.log(e.target.checked)}
        label={
          <span
            className={cn(styles['label-content-wrapper'], {
              [styles['selected']]: false
            })}>
            <Icon name={IconName.DATASET} />
            <span>Datasets (32)</span>
          </span>
        }
        // checked={Boolean(value as boolean)}
      />
      <Form.Group.Checkbox
        id="files-type-check"
        onChange={(e: ChangeEvent<HTMLInputElement>) => console.log(e.target.checked)}
        label={
          <span
            className={cn(styles['label-content-wrapper'], {
              [styles['selected']]: true
            })}>
            <Icon name={IconName.FILE} />
            <span>Files (10,081)</span>
          </span>
        }
        // checked={Boolean(value as boolean)}
      />
    </Stack>
  )
}
