import { useTranslation } from 'react-i18next'
import { DatasetVersionDiff } from '@/dataset/domain/models/DatasetVersionDiff'
import { Table } from '@iqss/dataverse-design-system'
import { DateHelper } from '@/shared/helpers/DateHelper'
import styles from './DatasetVersionsDifferenceTable.module.scss'

interface atasetVersionsDifferenceTableProps {
  differences: DatasetVersionDiff
}

export const DatasetVersionsDifferenceTable = ({
  differences
}: atasetVersionsDifferenceTableProps) => {
  const { t } = useTranslation('dataset')
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

      {additionalCitationMetadata && (
        <Table bordered>
          <thead>
            <tr>
              <th>{t('versions.additionalCitationMetadata')}</th>
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
              <th>{t('versions.files')}</th>
            </tr>
          </thead>
          <tbody>
            {filesRemoved?.map((file) => (
              <tr key={`removed-${file.fileId}`}>
                <td>
                  {t('versions.fileID')} {file.fileId}
                  <br />
                  {t('versions.MD5')} {file.MD5}
                </td>
                <td>
                  {t('versions.name')}: {file.fileName}
                  <br />
                  {t('versions.type')}: {file.type || 'Unknown'}
                  <br />
                  {t('versions.description')}: {file.description || ''}
                  <br />
                  {t('versions.access')}: {file.isRestricted ? 'Restricted' : 'Public'}
                </td>
                <td></td>
              </tr>
            ))}
            {filesAdded?.map((file) => (
              <tr key={`added-${file.fileId}`}>
                <td>
                  {t('versions.fileID')} {file.fileId}
                  <br />
                  {t('versions.MD5')} {file.MD5}
                </td>
                <td></td>
                <td>
                  {t('versions.name')}: {file.fileName}
                  <br />
                  {t('versions.type')}: {file.type || 'Unknown'}
                  <br />
                  {t('versions.description')}: {file.description || ''}
                  <br />
                  {t('versions.access')}: {file.isRestricted ? 'Restricted' : 'Public'}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  )
}
