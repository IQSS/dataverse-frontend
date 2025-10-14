import { useTranslation } from 'react-i18next'
import { DatasetVersionDiff } from '@/dataset/domain/models/DatasetVersionDiff'
import { Table } from '@iqss/dataverse-design-system'
import { DateHelper } from '@/shared/helpers/DateHelper'
import styles from './DatasetVersionsDifferenceTable.module.scss'

interface datasetVersionsDifferenceTableProps {
  differences: DatasetVersionDiff
}

export const DatasetVersionsDifferenceTable = ({
  differences
}: datasetVersionsDifferenceTableProps) => {
  const { t } = useTranslation('dataset')
  const {
    oldVersion,
    newVersion,
    metadataChanges,
    filesAdded,
    filesRemoved,
    fileChanges,
    termsOfAccess,
    filesReplaced
  } = differences

  const citationMetadata = metadataChanges?.find((m) => m.blockName === 'Citation Metadata')

  const areFilesAdded = filesAdded && filesAdded.length > 0
  const areFilesRemoved = filesRemoved && filesRemoved.length > 0
  const areFileChanges = fileChanges && fileChanges.length > 0

  return (
    <div className={styles['dataset-versions-difference-table']}>
      <Table>
        <tbody>
          <tr className={styles['version-row']}>
            <td></td>
            <td>
              {t('versions.version')}: {oldVersion.versionNumber}
              <br />
              {t('versions.lastUpdated')}:{' '}
              {DateHelper.toDisplayFormat(new Date(oldVersion.lastUpdatedDate))}
            </td>
            <td>
              {t('versions.version')}: {newVersion.versionNumber}
              <br />
              {t('versions.lastUpdated')}:{' '}
              {DateHelper.toDisplayFormat(new Date(newVersion.lastUpdatedDate))}
            </td>
          </tr>
        </tbody>
      </Table>

      {citationMetadata && (
        <Table bordered>
          <thead>
            <tr>
              <th>{t('versions.citationMetadata')}</th>
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

      {(areFilesAdded || areFilesRemoved || areFileChanges) && (
        <Table bordered>
          <thead>
            <tr>
              <th>{t('versions.files')}</th>
            </tr>
          </thead>
          <tbody>
            {areFilesRemoved &&
              filesRemoved.map((file) => (
                <tr key={`removed-${file.fileId}`} data-testid={`file-removed-row-${file.fileId}`}>
                  <td>
                    {t('versions.fileID')} {file.fileId}
                    <br />
                    {t('versions.MD5')} {file.MD5}
                  </td>
                  <td>
                    {t('versions.name')}: {file.fileName}
                    <br />
                    {t('versions.type')}: {file.type || ''}
                    <br />
                    {t('versions.description')}: {file.description || ''}
                    <br />
                    {t('versions.access')}: {file.isRestricted ? 'Restricted' : 'Public'}
                  </td>
                  <td></td>
                </tr>
              ))}
            {areFilesAdded &&
              filesAdded.map((file) => (
                <tr key={`added-${file.fileId}`} data-testid={`file-added-row-${file.fileId}`}>
                  <td>
                    {t('versions.fileID')} {file.fileId}
                    <br />
                    {t('versions.MD5')} {file.MD5}
                  </td>
                  <td></td>
                  <td>
                    {t('versions.name')}: {file.fileName}
                    <br />
                    {t('versions.type')}: {file.type || ''}
                    <br />
                    {t('versions.description')}: {file.description || ''}
                    <br />
                    {t('versions.access')}: {file.isRestricted ? 'Restricted' : 'Public'}
                  </td>
                </tr>
              ))}
            {areFileChanges &&
              fileChanges.map((file) => (
                <tr key={`changed-${file.fileId}`} data-testid={`file-changed-row-${file.fileId}`}>
                  <td>
                    {t('versions.fileID')} {file.fileId}
                    <br />
                    {t('versions.MD5')} {file.MD5}
                  </td>
                  <td>
                    {file.changed.map((change) => (
                      <div key={change.fieldName}>
                        {change.fieldName}: {change.oldValue || ''}
                      </div>
                    ))}
                  </td>
                  <td>
                    {file.changed.map((change) => (
                      <div key={change.fieldName}>
                        {change.fieldName}: {change.newValue || ''}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}

      {filesReplaced && (
        <Table bordered>
          <tbody>
            {filesReplaced.map(({ oldFile, newFile }) => (
              <tr key={`replaced-${oldFile.fileId}-${newFile.fileId}`}>
                <td>{t('versions.fileReplaced')}</td>
                <td>
                  {t('versions.fileID')} {oldFile.fileId}
                  <br />
                  {t('versions.MD5')} {oldFile.MD5}
                  <br />
                  {t('versions.name')}: {oldFile.fileName}
                </td>
                <td>
                  {t('versions.fileID')} {newFile.fileId}
                  <br />
                  {t('versions.MD5')} {newFile.MD5}
                  <br />
                  {t('versions.name')}: {newFile.fileName}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {termsOfAccess && (
        <Table bordered>
          <thead>
            <tr>
              <th>{t('versions.termsAccess')}</th>
            </tr>
          </thead>
          <tbody>
            {termsOfAccess.changed.map((term) => (
              <tr key={term.fieldName}>
                <td>{term.fieldName}</td>
                <td>{term.oldValue || ''}</td>
                <td>{term.newValue || ''}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  )
}
