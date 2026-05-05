import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Alert } from '@iqss/dataverse-design-system'
import { type DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { type MetadataBlockInfoRepository } from '../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'
import { HostCollectionForm } from './HostCollectionForm/HostCollectionForm'
import { NotImplementedModal } from '../not-implemented/NotImplementedModal'
import { useNotImplementedModal } from '../not-implemented/NotImplementedModalContext'
import { DatasetMetadataForm } from '../shared/form/DatasetMetadataForm'
import { useGetCollectionUserPermissions } from '../../shared/hooks/useGetCollectionUserPermissions'
import { useLoading } from '../../shared/contexts/loading/LoadingContext'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { useCollection } from '../collection/useCollection'
import { NotFoundPage } from '../not-found-page/NotFoundPage'
import { CreateDatasetSkeleton } from './CreateDatasetSkeleton'
import { useGetTemplatesByCollectionId } from '@/templates/domain/hooks/useGetTemplatesByCollectionId'
import { type Template } from '@/templates/domain/models/Template'
import { DatasetTemplateSelect } from './dataset-template-select/DatasetTemplateSelect'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { useCollectionRepositories } from '@/shared/contexts/repositories/RepositoriesProvider'

interface CreateDatasetProps {
  datasetRepository: DatasetRepository
  templateRepository: TemplateRepository
  metadataBlockInfoRepository: MetadataBlockInfoRepository
  collectionId: string
}

export function CreateDataset({
  datasetRepository,
  templateRepository,
  metadataBlockInfoRepository,
  collectionId
}: CreateDatasetProps) {
  const { collectionRepository } = useCollectionRepositories()
  const { t } = useTranslation('createDataset')
  const { isModalOpen, hideModal } = useNotImplementedModal()
  const { setIsLoading } = useLoading()
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  const { collection, isLoading: isLoadingCollection } = useCollection(
    collectionRepository,
    collectionId
  )

  const { collectionUserPermissions, isLoading: isLoadingCollectionUserPermissions } =
    useGetCollectionUserPermissions({
      collectionIdOrAlias: collectionId,
      collectionRepository: collectionRepository
    })

  const canUserAddDataset = Boolean(collectionUserPermissions?.canAddDataset)

  const { datasetTemplates, isLoadingDatasetTemplates } = useGetTemplatesByCollectionId({
    templateRepository,
    collectionIdOrAlias: collectionId
  })

  const handleDatasetTemplateChange = (selectedTemplateId: string) => {
    const template: Template | null =
      datasetTemplates.find((template) => template.id.toString() === selectedTemplateId) || null
    setSelectedTemplate(template)
  }

  const isLoadingData =
    isLoadingCollectionUserPermissions || isLoadingCollection || isLoadingDatasetTemplates

  useEffect(() => {
    setIsLoading(isLoadingData)
  }, [isLoadingData, setIsLoading])

  // When dataset templates are loaded we set the default one if any
  useEffect(() => {
    if (datasetTemplates.length > 0) {
      const defaultTemplate: Template | null =
        datasetTemplates.find((template) => template.isDefault) || null

      setSelectedTemplate(defaultTemplate)
    }
  }, [datasetTemplates])

  if (!isLoadingCollection && !collection) {
    return <NotFoundPage dvObjectNotFoundType="collection" />
  }

  if (isLoadingData || !collection) {
    return <CreateDatasetSkeleton />
  }

  if (collectionUserPermissions && !canUserAddDataset) {
    return (
      <div className="pt-4" data-testid="not-allowed-to-create-dataset-alert">
        <Alert variant="danger" dismissible={false}>
          {t('notAllowedToCreateDataset')}
        </Alert>
      </div>
    )
  }

  return (
    <>
      <NotImplementedModal show={isModalOpen} handleClose={hideModal} />
      <section>
        <BreadcrumbsGenerator
          hierarchy={collection?.hierarchy}
          withActionItem
          actionItemText={t('pageTitle')}
        />
        <header>
          <h1>{t('pageTitle')}</h1>
        </header>
        <SeparationLine />
        <HostCollectionForm collectionId={collection.id} />

        {datasetTemplates.length > 0 && (
          <DatasetTemplateSelect
            datasetTemplates={datasetTemplates}
            onChange={handleDatasetTemplateChange}
          />
        )}

        <DatasetMetadataForm
          mode="create"
          collectionId={collectionId}
          datasetRepository={datasetRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
          datasetTemplate={selectedTemplate ?? undefined}
          key={selectedTemplate ? selectedTemplate.id : 'no-template-selected'} // We use the template id as key to force remounting the form when the template changes
        />
      </section>
    </>
  )
}
