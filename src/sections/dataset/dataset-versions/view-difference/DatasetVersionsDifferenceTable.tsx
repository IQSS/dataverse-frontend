import { DatasetVersionDiff } from '@/dataset/domain/models/DatasetVersionDiff'
import { Table } from '@iqss/dataverse-design-system'
import { DateHelper } from '@/shared/helpers/DateHelper'
import styles from './DatasetVersionsDifferenceTable.module.scss'

interface VersionDetailModalProps {
  differences: DatasetVersionDiff
}

export const DatasetVersionsDifferenceTable = ({ differences }: VersionDetailModalProps) => {
  const { oldVersion, newVersion, metadataChanges, filesAdded, filesRemoved } = differences

  const citationMetadata = metadataChanges?.find((m) => m.blockName === 'Citation Metadata')
  const additionalCitationMetadata = metadataChanges?.find(
    (m) => m.blockName === 'Additional Citation Metadata'
  )

  return (
    <div className={styles['dataset-versions-difference-table']}>
      <Table>
        <tbody>
          <tr className={styles['version-row']}>
            <td></td>
            <td>
              Version: {oldVersion.versionNumber}
              <br />
              Last Updated: {DateHelper.toDisplayFormat(new Date(oldVersion.lastUpdatedDate))}
            </td>
            <td>
              Version: {newVersion.versionNumber}
              <br />
              Last Updated: {DateHelper.toDisplayFormat(new Date(newVersion.lastUpdatedDate))}
            </td>
          </tr>
        </tbody>
      </Table>

      {citationMetadata && (
        <Table bordered>
          <thead>
            <tr>
              <th>Citation Metadata</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {citationMetadata.changed.map((field) => (
              <tr key={field.fieldName}>
                <td>{field.fieldName}</td>
                <td>{field.oldValue || ''}</td>
                <td>{field.newValue || ''}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {additionalCitationMetadata && (
        <Table bordered>
          <thead>
            <tr>
              <th>Additional Citation Metadata</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {additionalCitationMetadata.changed.map((field) => (
              <tr key={field.fieldName}>
                <td>{field.fieldName}</td>
                <td>{field.oldValue || ''}</td>
                <td>{field.newValue || ''}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {(filesAdded || filesRemoved) && (
        <Table bordered>
          <thead>
            <tr>
              <th>Files</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filesRemoved?.map((file) => (
              <tr key={`removed-${file.fileId}`}>
                <td>
                  File ID: {file.fileId}
                  <br />
                  MD5: {file.MD5}
                </td>
                <td>
                  Name: {file.fileName}
                  <br />
                  Type: {file.type || 'Unknown'}
                  <br />
                  Description: {file.description || ''}
                  <br />
                  Access: {file.isRestricted ? 'Restricted' : 'Public'}
                </td>
                <td></td>
              </tr>
            ))}
            {filesAdded?.map((file) => (
              <tr key={`added-${file.fileId}`}>
                <td>
                  File ID: {file.fileId}
                  <br />
                  MD5: {file.MD5}
                </td>
                <td></td>
                <td>
                  Name: {file.fileName}
                  <br />
                  Type: {file.type || 'Unknown'}
                  <br />
                  Description: {file.description || ''}
                  <br />
                  Access: {file.isRestricted ? 'Restricted' : 'Public'}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  )
}
