import { ReactNode } from 'react'
import cn from 'classnames'
import { Table } from '@iqss/dataverse-design-system'
import { ReducedMetadataBlockInfo } from '../../../../useGetAllMetadataBlocksInfo'
import { InputLevelFieldRow } from './InputLevelFieldRow'
import styles from './InputLevelsTable.module.scss'

interface InputLevelsTableProps {
  show: boolean
  disabled: boolean
  blockMetadataInputLevelFields: ReducedMetadataBlockInfo
  closeButton: ReactNode
}

export const InputLevelsTable = ({
  show,
  disabled,
  blockMetadataInputLevelFields,
  closeButton
}: InputLevelsTableProps) => {
  return (
    <div
      className={cn(styles['input-levels-table-container'], {
        [styles['input-levels-table-container--show']]: show,
        [styles['input-levels-table-container--disabled']]: disabled
      })}>
      <div className={styles['close-button-container']}>{closeButton}</div>

      <Table>
        <tbody>
          {Object.entries(blockMetadataInputLevelFields.metadataFields).map(([key, field]) => (
            <InputLevelFieldRow metadataField={field} disabled={disabled} key={key} />
          ))}
        </tbody>
      </Table>
    </div>
  )
}
