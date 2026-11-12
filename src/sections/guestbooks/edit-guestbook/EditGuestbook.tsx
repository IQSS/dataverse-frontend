import { useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Alert } from '@iqss/dataverse-design-system'
import { type NavigateFunction, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { GuestbookDTO } from '@/guestbooks/domain/useCases/DTOs/GuestbookDTO'
import { RouteWithParams } from '@/sections/Route.enum'
import { useCollection } from '@/sections/collection/useCollection'
import { NotFoundPage } from '@/sections/not-found-page/NotFoundPage'
import { BreadcrumbsGenerator } from '@/sections/shared/hierarchy/BreadcrumbsGenerator'
import { useLoading } from '@/shared/contexts/loading/LoadingContext'
import { useGetGuestbookById } from '@/sections/dataset/dataset-guestbook/useGetGuestbookById'
import { useGuestbookRepositories } from '@/shared/contexts/repositories/RepositoriesProvider'
import { GuestbookSkeleton } from '../GuestbookSkeleton'
import { GuestbookForm } from '../guestbook-form/GuestbookForm'
import { useEditGuestbook } from './useEditGuestbook'

interface EditGuestbookProps {
  collectionId: string
  guestbookId: number
  collectionRepository: CollectionRepository
}

export const EditGuestbook = ({
  collectionId,
  guestbookId,
  collectionRepository
}: EditGuestbookProps) => {
  const { t } = useTranslation('guestbooks')
  const { t: tShared } = useTranslation('shared')
  const navigate: NavigateFunction = useNavigate()
  const { guestbookRepository } = useGuestbookRepositories()
  const { setIsLoading } = useLoading()
  const { collection, isLoading } = useCollection(collectionRepository, collectionId)
  const { guestbook, isLoadingGuestbook, errorGetGuestbook } = useGetGuestbookById({
    guestbookRepository,
    guestbookId
  })
  const guestbooksGuideUrl =
    'https://guides.dataverse.org/en/latest/user/dataverse-management.html#dataset-guestbooks'
  const navigateToGuestbooks = () => navigate(RouteWithParams.GUESTBOOKS(collectionId))
  const { isEditingGuestbook, errorEditingGuestbook, handleEditGuestbook } = useEditGuestbook({
    guestbookRepository,
    onSuccessfulEdit: () => {
      toast.success(t('alerts.updated'))
      navigateToGuestbooks()
    }
  })
  const isLoadingData = isLoading || isLoadingGuestbook

  useEffect(() => {
    setIsLoading(isLoadingData)
  }, [isLoadingData, setIsLoading])

  const handleSubmit = (guestbookDTO: GuestbookDTO) => {
    void handleEditGuestbook(guestbookId, guestbookDTO)
  }

  if (!isLoading && !collection) {
    return <NotFoundPage dvObjectNotFoundType="collection" />
  }

  if (!isLoadingGuestbook && !guestbook && errorGetGuestbook === null) {
    return <NotFoundPage />
  }

  if (isLoadingData || !collection || (!guestbook && errorGetGuestbook === null)) {
    return <GuestbookSkeleton />
  }

  return (
    <section>
      <BreadcrumbsGenerator
        hierarchy={collection.hierarchy}
        withActionItem
        actionItemText={t('edit.title')}
        actionItems={[
          {
            text: t('title'),
            url: RouteWithParams.GUESTBOOKS(collectionId)
          },
          {
            text: t('edit.title')
          }
        ]}
      />

      <Alert variant="info" dismissible={false}>
        <Trans
          t={t}
          i18nKey="create.info"
          components={{
            anchor: <a href={guestbooksGuideUrl} target="_blank" rel="noreferrer" />
          }}
        />
      </Alert>

      {errorGetGuestbook && <Alert variant="danger">{errorGetGuestbook}</Alert>}
      {errorEditingGuestbook && <Alert variant="danger">{errorEditingGuestbook}</Alert>}

      {guestbook && (
        <GuestbookForm
          initialGuestbook={guestbook}
          isSubmitting={isEditingGuestbook}
          submitButtonText={tShared('saveChanges')}
          cancelButtonText={tShared('cancel')}
          onSubmit={handleSubmit}
          onCancel={navigateToGuestbooks}
        />
      )}
    </section>
  )
}
