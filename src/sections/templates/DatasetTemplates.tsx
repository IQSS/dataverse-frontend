import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
import { RouteWithParams, TemplateEditMode } from '@/sections/Route.enum'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { DatasetTemplatesSkeleton } from './DatasetTemplatesSkeleton'
import { useGetCollectionUserPermissions } from '@/shared/hooks/useGetCollectionUserPermissions'
import { DatasetTemplatesEmptyState } from './DatasetTemplatesEmptyState'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { MetadataBlockInfoRepository } from '@/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { useCollection } from '../collection/useCollection'
import { useGetTemplatesByCollectionId } from '@/templates/domain/hooks/useGetTemplatesByCollectionId'
import { NotFoundPage } from '../not-found-page/NotFoundPage'
import { Template } from '@/templates/domain/models/Template'
import { ConfirmDeleteTemplateModal } from './confirm-delete-template-modal/ConfirmDeleteTemplateModal'
import { TemplatePreviewModal } from './template-preview-modal/TemplatePreviewModal'
import { useCopyTemplate } from './useCopyTemplate'
import { useSetTemplateAsDefault } from './useSetTemplateAsDefault'

import styles from './DatasetTemplates.module.scss'

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
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const state = location.state as { fromEditTemplate?: boolean } | null
    if (state?.fromEditTemplate) {
      toast.success(t('alerts.editSuccess'))
      navigate(location.pathname, { replace: true, state: null })
    }
  }, [location, navigate, t])
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'usage' | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [templateToDelete, setTemplateToDelete] = useState<Template | undefined>(undefined)
  const [templateToPreview, setTemplateToPreview] = useState<Template | undefined>(undefined)
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
    fetchDatasetTemplates,
    toggleDefaultTemplate
  } = useGetTemplatesByCollectionId({
    templateRepository,
    collectionIdOrAlias: collectionId
  })
  const { copyTemplate, isCopyingTemplate } = useCopyTemplate({
    collectionId,
    templateRepository,
    metadataBlockInfoRepository
  })
  const { handleSetTemplateAsDefault, handleUnsetTemplateAsDefault, isSettingDefault } =
    useSetTemplateAsDefault({
      collectionId,
      templateRepository
    })

  const { collectionUserPermissions } = useGetCollectionUserPermissions({
    collectionIdOrAlias: collectionId,
    collectionRepository
  })
  const canUserEditTemplate = Boolean(collectionUserPermissions?.canEditCollection)
  const rootCollectionNames = collection?.hierarchy?.toArray().map((node) => node.name) ?? []

  const isLoadingData = isLoadingCollection || isLoadingDatasetTemplates

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
        return new Date(first.createDate).getTime() - new Date(second.createDate).getTime()
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

  const handleCreateTemplate = () => {
    navigate('create', { relative: 'path' })
  }

  const handleOpenDeleteModal = (template: Template) => {
    setTemplateToDelete(template)
    setErrorDeletingTemplate(null)
  }

  const handleCloseDeleteModal = () => {
    if (isDeletingTemplate) return
    setTemplateToDelete(undefined)
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
      setTemplateToDelete(undefined)
    } catch (error) {
      setErrorDeletingTemplate(t('alerts.deleteError'))
    } finally {
      setIsDeletingTemplate(false)
    }
  }

  const handleEditTemplateAction = (template: Template, action: 'metadata' | 'terms') => {
    const editMode = action === 'metadata' ? TemplateEditMode.METADATA : TemplateEditMode.LICENSE
    navigate(RouteWithParams.TEMPLATES_EDIT(collectionId, template.id, editMode))
  }

  const handleOpenPreviewModal = (template: Template) => {
    setTemplateToPreview(template)
  }

  const handleClosePreviewModal = () => {
    setTemplateToPreview(undefined)
  }

  const handleCopyTemplate = async (template: Template) => {
    const didCopy = await copyTemplate(template.id)
    if (didCopy) {
      await fetchDatasetTemplates()
    }
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
      <ConfirmDeleteTemplateModal
        show={Boolean(templateToDelete)}
        handleClose={handleCloseDeleteModal}
        handleDelete={handleDeleteTemplate}
        templateName={templateToDelete?.name ?? ''}
        isDeleting={isDeletingTemplate}
        errorDeleting={errorDeletingTemplate}
      />
      {templateToPreview && (
        <TemplatePreviewModal
          show={true}
          handleClose={handleClosePreviewModal}
          templateId={templateToPreview.id}
          templateName={templateToPreview.name}
          templateRepository={templateRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      )}
      <section>
        <BreadcrumbsGenerator hierarchy={collection.hierarchy} />
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
          <DatasetTemplatesEmptyState collectionId={collectionId} />
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
                          <span
                            onClick={async () => {
                              if (isSettingDefault) return
                              const didUnset = await handleUnsetTemplateAsDefault()
                              if (didUnset) {
                                toggleDefaultTemplate(null)
                              }
                            }}>
                            <Button variant="secondary" size="sm" disabled>
                              <CheckLg />
                              {t('actions.default')}
                            </Button>
                          </span>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            disabled={isSettingDefault}
                            onClick={async () => {
                              const didSet = await handleSetTemplateAsDefault(template.id)
                              if (didSet) {
                                toggleDefaultTemplate(template.id)
                              }
                            }}
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
                            onClick={() => handleCopyTemplate(template)}
                            aria-label={t('actions.copy')}
                            disabled={isCopyingTemplate}>
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
                              <DropdownButtonItem eventKey="metadata" as="button">
                                {t('editTemplate.actions.metadata')}
                              </DropdownButtonItem>
                              <DropdownButtonItem eventKey="terms" as="button">
                                {t('editTemplate.actions.terms')}
                              </DropdownButtonItem>
                            </DropdownButton>
                            <Tooltip
                              placement="top"
                              overlay={
                                template.usageCount > 0
                                  ? t('actions.deleteDisabledTip')
                                  : t('actions.delete')
                              }>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => handleOpenDeleteModal(template)}
                                aria-label={
                                  template.usageCount > 0
                                    ? t('actions.deleteDisabledTip')
                                    : t('actions.delete')
                                }
                                disabled={template.usageCount > 0}>
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
