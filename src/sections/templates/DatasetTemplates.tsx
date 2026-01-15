import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import {
  Alert,
  Button,
  ButtonGroup,
  DropdownButton,
  DropdownButtonItem,
  Form,
  Table,
  Tooltip
} from '@iqss/dataverse-design-system'
import {
  CaretDown,
  CaretUp,
  ChevronExpand,
  CheckLg,
  Eye,
  Files,
  Pencil,
  PlusLg,
  Trash
} from 'react-bootstrap-icons'
import { toast } from 'react-toastify'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { MetadataBlockInfoRepository } from '@/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { useCollection } from '../collection/useCollection'
import { useGetTemplatesByCollectionId } from '@/dataset/domain/hooks/useGetTemplatesByCollectionId'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { NotFoundPage } from '../not-found-page/NotFoundPage'
import { NotImplementedModal } from '../not-implemented/NotImplementedModal'
import { useNotImplementedModal } from '../not-implemented/NotImplementedModalContext'
import { Template } from '@/templates/domain/models/Template'
import { ConfirmDeleteTemplateModal } from './confirm-delete-template-modal/ConfirmDeleteTemplateModal'
import { DatasetTemplatePreviewModal } from './dataset-template-preview-modal/DatasetTemplatePreviewModal'
import styles from './DatasetTemplates.module.scss'
import { RouteWithParams } from '@/sections/Route.enum'
import { DatasetTemplatesSkeleton } from './DatasetTemplatesSkeleton'
import { useGetCollectionUserPermissions } from '@/shared/hooks/useGetCollectionUserPermissions'

interface DatasetTemplatesProps {
  collectionRepository: CollectionRepository
  templateRepository: TemplateRepository
  metadataBlockInfoRepository: MetadataBlockInfoRepository
  collectionId: string
}

export const DatasetTemplates = ({
  collectionRepository,
  templateRepository,
  metadataBlockInfoRepository,
  collectionId
}: DatasetTemplatesProps) => {
  const { t } = useTranslation('datasetTemplates')
  const { t: tDataset } = useTranslation('dataset')
  const navigate = useNavigate()
  const { isModalOpen, hideModal, showModal } = useNotImplementedModal()
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'usage' | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null)
  const [templateToPreview, setTemplateToPreview] = useState<Template | null>(null)
  const [isDeletingTemplate, setIsDeletingTemplate] = useState(false)
  const [errorDeletingTemplate, setErrorDeletingTemplate] = useState<string | null>(null)
  const [includeParentTemplates, setIncludeParentTemplates] = useState(true)
  const { collection, isLoading: isLoadingCollection } = useCollection(
    collectionRepository,
    collectionId
  )
  const {
    datasetTemplates,
    isLoadingDatasetTemplates,
    errorGetDatasetTemplates,
    fetchDatasetTemplates
  } = useGetTemplatesByCollectionId({
    templateRepository,
    collectionIdOrAlias: collectionId
  })
  const { collectionUserPermissions } = useGetCollectionUserPermissions({
    collectionIdOrAlias: collectionId,
    collectionRepository
  })
  const canUserEditTemplate = Boolean(collectionUserPermissions?.canEditCollection)
  const rootCollectionNames = collection?.hierarchy?.toArray().map((node) => node.name) ?? []

  const isLoadingData = isLoadingCollection || isLoadingDatasetTemplates
  const resolveCreateDate = (template: Template) => {
    return Date.parse(template.createDate)
  }

  const filteredTemplates = useMemo(() => {
    if (includeParentTemplates) {
      return datasetTemplates
    }
    return datasetTemplates.filter((template) => template.collectionAlias === collectionId)
  }, [datasetTemplates, includeParentTemplates, collectionId])

  const sortedTemplates = useMemo(() => {
    if (!sortBy) {
      return filteredTemplates
    }
    const sorted = [...filteredTemplates]
    sorted.sort((first, second) => {
      if (sortBy === 'name') {
        return first.name.localeCompare(second.name, undefined, { sensitivity: 'base' })
      }
      if (sortBy === 'created') {
        return resolveCreateDate(first) - resolveCreateDate(second)
      }
      return first.usageCount - second.usageCount
    })
    return sortDirection === 'asc' ? sorted : sorted.reverse()
  }, [filteredTemplates, sortBy, sortDirection])

  const handleSort = (column: 'name' | 'created' | 'usage') => {
    if (sortBy === column) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }
    setSortBy(column)
    setSortDirection('asc')
  }

  const sortIndicator = (column: 'name' | 'created' | 'usage') => {
    if (sortBy === column) {
      return sortDirection === 'asc' ? (
        <CaretUp className={styles['sort-icon']} />
      ) : (
        <CaretDown className={styles['sort-icon']} />
      )
    }
    return <ChevronExpand className={styles['sort-icon']} />
  }
  const sortButtonClass = (column: 'name' | 'created' | 'usage') =>
    `${styles['sort-button']}${sortBy === column ? ` ${styles['sort-button-active']}` : ''}`
  const sortHeaderClass = (column: 'name' | 'created' | 'usage') =>
    sortBy === column ? styles['sort-header-active'] : ''

  const emptyStateWhyBullets = t('emptyState.whyBullets', {
    returnObjects: true
  }) as string[]
  const emptyStateHowBullets = t('emptyState.howBullets', {
    returnObjects: true
  }) as string[]

  const generalInfoUrl = `/spa${RouteWithParams.EDIT_COLLECTION(collectionId)}`
  const templatesGuideUrl =
    'https://guides.dataverse.org/en/6.9/user/dataverse-management.html#dataset-templates'

  const handleCreateTemplate = () => {
    navigate('create', { relative: 'path' })
  }

  const handleOpenDeleteModal = (template: Template) => {
    setTemplateToDelete(template)
    setErrorDeletingTemplate(null)
  }

  const handleCloseDeleteModal = () => {
    if (isDeletingTemplate) return
    setTemplateToDelete(null)
    setErrorDeletingTemplate(null)
  }

  const handleDeleteTemplate = async () => {
    if (!templateToDelete) return
    setIsDeletingTemplate(true)
    setErrorDeletingTemplate(null)
    try {
      await templateRepository.deleteTemplate(templateToDelete.id)
      await fetchDatasetTemplates()
      toast.success(t('alerts.deleteSuccess'))
      setTemplateToDelete(null)
    } catch (error) {
      setErrorDeletingTemplate(t('alerts.deleteError'))
    } finally {
      setIsDeletingTemplate(false)
    }
  }

  const handleEditTemplateAction = (template: Template, action: 'metadata' | 'terms') => {
    if (action === 'metadata') {
      navigate(RouteWithParams.TEMPLATES_EDIT_METADATA(collectionId, template.id))
      return
    }
    navigate(RouteWithParams.TEMPLATES_EDIT_TERMS(collectionId, template.id))
  }

  const handleOpenPreviewModal = (template: Template) => {
    setTemplateToPreview(template)
  }

  const handleClosePreviewModal = () => {
    setTemplateToPreview(null)
  }

  if (!isLoadingCollection && !collection) {
    return <NotFoundPage dvObjectNotFoundType="collection" />
  }

  if (isLoadingData || !collection) {
    return <DatasetTemplatesSkeleton />
  }

  if (errorGetDatasetTemplates) {
    return <Alert variant="danger">{errorGetDatasetTemplates}</Alert>
  }

  return (
    <>
      <NotImplementedModal show={isModalOpen} handleClose={hideModal} />
      <ConfirmDeleteTemplateModal
        show={Boolean(templateToDelete)}
        handleClose={handleCloseDeleteModal}
        handleDelete={handleDeleteTemplate}
        templateName={templateToDelete?.name ?? ''}
        isDeleting={isDeletingTemplate}
        errorDeleting={errorDeletingTemplate}
      />
      <DatasetTemplatePreviewModal
        show={Boolean(templateToPreview)}
        handleClose={handleClosePreviewModal}
        templateId={templateToPreview?.id ?? null}
        templateName={templateToPreview?.name ?? ''}
        templateRepository={templateRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
      <section>
        <BreadcrumbsGenerator
          hierarchy={collection.hierarchy}
          withActionItem
          actionItemText={t('pageTitle')}
        />
        <header className={styles.header}>
          <div className={styles['header-title']}>
            <h1>{collection.name}</h1>
            {collection.affiliation ? (
              <span className={styles.subtext}>({collection.affiliation})</span>
            ) : null}
          </div>
        </header>

        {datasetTemplates.length !== 0 && (
          <Alert variant="info" customHeading={t('infoAlert.title')} dismissible>
            {t('infoAlert.text')}
          </Alert>
        )}

        <div className={styles['table-actions']}>
          <div className={styles['table-actions-left']}>
            {rootCollectionNames.length > 1 && (
              <Form.Group.Checkbox
                id="include-parent-templates"
                label={t('filters.includeTemplatesFromRoot', {
                  root: rootCollectionNames[0] ?? 'Root'
                })}
                checked={includeParentTemplates}
                onChange={() => setIncludeParentTemplates((current) => !current)}
                className={styles['include-templates-filter']}
              />
            )}
          </div>
          <Button
            variant="primary"
            onClick={handleCreateTemplate}
            className={styles['create-button']}>
            <PlusLg />
            {t('actions.create')}
          </Button>
        </div>

        {datasetTemplates.length === 0 ? (
          <div className={styles['empty-state']}>
            <div>
              <h2>{t('emptyState.whyTitle')}</h2>
              <ul>
                {emptyStateWhyBullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <h2>{t('emptyState.howTitle')}</h2>
              <ul>
                {emptyStateHowBullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
                <li>
                  <Trans
                    t={t}
                    i18nKey="emptyState.howNote"
                    components={{
                      anchor: <a href={generalInfoUrl} target="_blank" rel="noreferrer" />
                    }}
                  />
                </li>
              </ul>
              <p>
                <Trans
                  t={t}
                  i18nKey="emptyState.footer"
                  components={{
                    anchor: <a href={templatesGuideUrl} target="_blank" rel="noreferrer" />
                  }}
                />
              </p>
            </div>
          </div>
        ) : (
          <>
            <Table>
              <thead>
                <tr>
                  <th scope="col" className={`${styles['name-column']} ${sortHeaderClass('name')}`}>
                    <Button
                      variant="link"
                      onClick={() => handleSort('name')}
                      className={sortButtonClass('name')}
                      aria-pressed={sortBy === 'name'}>
                      <span>{t('table.name')}</span>
                      <span>{sortIndicator('name')}</span>
                    </Button>
                  </th>
                  <th scope="col" className={sortHeaderClass('created')}>
                    <Button
                      variant="link"
                      onClick={() => handleSort('created')}
                      className={sortButtonClass('created')}
                      aria-pressed={sortBy === 'created'}>
                      <span>{t('table.created')}</span>
                      <span>{sortIndicator('created')}</span>
                    </Button>
                  </th>
                  <th scope="col" className={sortHeaderClass('usage')}>
                    <Button
                      variant="link"
                      onClick={() => handleSort('usage')}
                      className={sortButtonClass('usage')}
                      aria-pressed={sortBy === 'usage'}>
                      <span>{t('table.usage')}</span>
                      <span>{sortIndicator('usage')}</span>
                    </Button>
                  </th>
                  <th scope="col" className={styles['action-column']}>
                    {t('table.action')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedTemplates.map((template) => (
                  <tr key={template.id}>
                    <td>{template.name}</td>
                    <td>{template.createDate}</td>
                    <td>{template.usageCount}</td>
                    <td className={styles['action-cell']}>
                      {template.collectionAlias !== collectionId && (
                        <span className={styles['template-origin']}>
                          {t('table.templateCreatedAt', {
                            alias: template.collectionAlias
                          })}
                        </span>
                      )}
                      <ButtonGroup
                        className={styles['action-group']}
                        aria-label={t('table.action')}>
                        {template.isDefault ? (
                          <Button variant="secondary" size="sm" disabled>
                            <CheckLg />
                            {t('actions.default')}
                          </Button>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={showModal}
                            className={styles['make-default-button']}>
                            {t('actions.makeDefault')}
                          </Button>
                        )}
                        <Tooltip placement="top" overlay={t('actions.view')}>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleOpenPreviewModal(template)}
                            aria-label={t('actions.view')}>
                            <Eye />
                          </Button>
                        </Tooltip>
                        <Tooltip placement="top" overlay={t('actions.copy')}>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={showModal}
                            aria-label={t('actions.copy')}>
                            <Files />
                          </Button>
                        </Tooltip>
                        {canUserEditTemplate && template.collectionAlias === collectionId && (
                          <>
                            <DropdownButton
                              id={`edit-template-${template.id}`}
                              title={t('actions.edit')}
                              icon={
                                <Pencil
                                  className={styles['action-icon']}
                                  style={{ marginRight: '5px' }}
                                />
                              }
                              variant="secondary"
                              size="sm"
                              onSelect={(eventKey) =>
                                handleEditTemplateAction(template, eventKey as 'metadata' | 'terms')
                              }>
                              {/* waiting for Edit Template api support */}
                              <DropdownButtonItem eventKey="metadata" as="button" disabled>
                                {tDataset('datasetActionButtons.editDataset.metadata')}
                              </DropdownButtonItem>
                              <DropdownButtonItem eventKey="terms" as="button" disabled>
                                {tDataset('datasetActionButtons.editDataset.terms')}
                              </DropdownButtonItem>
                            </DropdownButton>
                            <Tooltip placement="top" overlay={t('actions.delete')}>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleOpenDeleteModal(template)}
                                aria-label={t('actions.delete')}>
                                <Trash />
                              </Button>
                            </Tooltip>
                          </>
                        )}
                      </ButtonGroup>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </section>
    </>
  )
}
