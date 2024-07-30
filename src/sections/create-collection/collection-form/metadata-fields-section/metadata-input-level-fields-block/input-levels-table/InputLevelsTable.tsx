import { ReactNode } from 'react'
import cn from 'classnames'
import { Table } from '@iqss/dataverse-design-system'
import { BlockMetadataInputLevelFields } from '../useGetBlockMetadataInputLevelFields'
import { InputLevelFieldRow } from './InputLevelFieldRow'
import styles from './InputLevelsTable.module.scss'

interface InputLevelsTableProps {
  show: boolean
  disabled: boolean
  blockMetadataInputLevelFields: BlockMetadataInputLevelFields
  closeButton: ReactNode
}

export const InputLevelsTable = ({
  show,
  disabled,
  blockMetadataInputLevelFields,
  closeButton
}: InputLevelsTableProps) => {
  // console.log(blockMetadataInputLevelFields)

  // TODO:ME Disable everything if disabled
  return (
    <div
      className={cn(styles['input-levels-table-container'], {
        [styles['input-levels-table-container--show']]: show
      })}>
      <div className={styles['close-button-container']}>{closeButton}</div>

      <Table bordered={false}>
        <tbody>
          {Object.entries(blockMetadataInputLevelFields.metadataFields).map(([key, field]) => (
            <InputLevelFieldRow metadataField={field} key={key} />
          ))}
        </tbody>
      </Table>
    </div>
  )
}
