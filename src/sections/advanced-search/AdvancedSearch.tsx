import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { useCollection } from '../collection/useCollection'
import { useLoading } from '../loading/LoadingContext'
import { NotFoundPage } from '../not-found-page/NotFoundPage'
import { AppLoader } from '../shared/layout/app-loader/AppLoader'
import { BreadcrumbsGenerator } from '../shared/hierarchy/BreadcrumbsGenerator'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'
import { Accordion } from '@iqss/dataverse-design-system'
import { CollectionsFields } from './CollectionsFields'
import { FormProvider, useForm } from 'react-hook-form'

interface AdvancedSearchProps {
  collectionId: string
  collectionRepository: CollectionRepository
  collectionPageQuery: string | null
}

export const AdvancedSearch = ({
  collectionId,
  collectionRepository,
  collectionPageQuery
}: AdvancedSearchProps) => {
  const { t } = useTranslation('advancedSearch')
  const { setIsLoading } = useLoading()

  const { collection, isLoading: isLoadingCollection } = useCollection(
    collectionRepository,
    collectionId
  )

  {
    /* <CollectionFormData> */
  }
  const formMethods = useForm({
    mode: 'onChange'
    // defaultValues
  })

  useEffect(() => {
    if (!isLoadingCollection) {
      setIsLoading(false)
    }
  }, [isLoadingCollection, setIsLoading])

  if (!isLoadingCollection && !collection) {
    return <NotFoundPage dvObjectNotFoundType="collection" />
  }

  if (isLoadingCollection || !collection) {
    return <AppLoader />
  }

  console.log({ collectionPageQuery })

  // Los metadatablocks se muestran sin importar el estado displayOnCreate

  return (
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

      <div>
        <FormProvider {...formMethods}>
          <form
            // onSubmit={formMethods.handleSubmit(submitForm)}
            noValidate={true}>
            <Accordion
              defaultActiveKey={['collections', 'metadata-citation', 'files']}
              alwaysOpen={true}>
              <Accordion.Item eventKey="collections">
                <Accordion.Header>Collections</Accordion.Header>
                <Accordion.Body>
                  <CollectionsFields />
                </Accordion.Body>
              </Accordion.Item>

              {/*  Datasets Metadata blocks  */}
              <Accordion.Item eventKey="metadata-citation">
                <Accordion.Header>Datasets: Citation Metadata</Accordion.Header>
                <Accordion.Body>Blah blha.</Accordion.Body>
              </Accordion.Item>

              {/* Files  */}
              <Accordion.Item eventKey="files">
                <Accordion.Header>Files</Accordion.Header>
                <Accordion.Body>Blah blha.</Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </form>
        </FormProvider>
      </div>
    </section>
  )
}
