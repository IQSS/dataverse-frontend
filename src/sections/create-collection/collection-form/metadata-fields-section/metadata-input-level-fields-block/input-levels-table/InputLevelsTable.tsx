import { BlockMetadataInputLevelFields } from '../useGetBlockMetadataInputLevelFields'
import cn from 'classnames'
import styles from './InputLevelsTable.module.scss'
import React from 'react'
import { Table } from '@iqss/dataverse-design-system'
import { InputLevelFieldRow } from './InputLevelFieldRow'

interface InputLevelsTableProps {
  show: boolean
  disabled: boolean
  blockMetadataInputLevelFields: BlockMetadataInputLevelFields
  closeButton: React.ReactNode
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
