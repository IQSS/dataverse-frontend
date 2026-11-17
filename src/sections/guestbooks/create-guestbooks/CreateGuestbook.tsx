import { useEffect, useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Alert } from '@iqss/dataverse-design-system'
import { type NavigateFunction, useLocation, useNavigate } from 'react-router-dom'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import { GuestbookDTO } from '@/guestbooks/domain/useCases/DTOs/GuestbookDTO'
import { RouteWithParams } from '@/sections/Route.enum'
import { useCollection } from '@/sections/collection/useCollection'
import { NotFoundPage } from '@/sections/not-found-page/NotFoundPage'
import { BreadcrumbsGenerator } from '@/sections/shared/hierarchy/BreadcrumbsGenerator'
import { useLoading } from '@/shared/contexts/loading/LoadingContext'
import { useGuestbookRepositories } from '@/shared/contexts/repositories/RepositoriesProvider'
import { GuestbookSkeleton } from '../GuestbookSkeleton'
import { GuestbookForm } from '../guestbook-form/GuestbookForm'
import { useCreateGuestbook } from './useCreateGuestbook'

interface CreateGuestbookProps {
  collectionId: string
  collectionRepository: CollectionRepository
}

interface CreateGuestbookLocationState {
  guestbookToCopy?: Guestbook
}

export const CreateGuestbook = ({ collectionId, collectionRepository }: CreateGuestbookProps) => {
  const { t } = useTranslation('guestbooks')
  const navigate: NavigateFunction = useNavigate()
  const location = useLocation()
  const { guestbookRepository } = useGuestbookRepositories()
  const { setIsLoading } = useLoading()
  const { collection, isLoading } = useCollection(collectionRepository, collectionId)
  const guestbookToCopy = (location.state as CreateGuestbookLocationState | null)?.guestbookToCopy
  const guestbooksGuideUrl =
    'https://guides.dataverse.org/en/latest/user/dataverse-management.html#dataset-guestbooks'
  const navigateToGuestbooks = () => navigate(RouteWithParams.GUESTBOOKS(collectionId))
  const { isCreatingGuestbook, errorCreatingGuestbook, handleCreateGuestbook } = useCreateGuestbook(
    {
      guestbookRepository,
      collectionIdOrAlias: collectionId,
      onSuccessfulCreate: navigateToGuestbooks
    }
  )
  const initialGuestbook = useMemo(
    () =>
      guestbookToCopy
        ? {
            name: `Copy of ${guestbookToCopy.name}`,
            enabled: guestbookToCopy.enabled,
            emailRequired: guestbookToCopy.emailRequired,
            nameRequired: guestbookToCopy.nameRequired,
            institutionRequired: guestbookToCopy.institutionRequired,
            positionRequired: guestbookToCopy.positionRequired,
            customQuestions: guestbookToCopy.customQuestions.map((question, index) => ({
              question: question.question,
              required: question.required,
              displayOrder: index,
              type: question.type,
              hidden: question.hidden,
              optionValues: question.optionValues?.map((option, optionIndex) => ({
                value: option.value,
                displayOrder: optionIndex
              }))
            }))
          }
        : undefined,
    [guestbookToCopy]
  )

  useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading, setIsLoading])

  const handleSubmit = (guestbook: GuestbookDTO) => {
    void handleCreateGuestbook(guestbook)
  }

  if (!isLoading && !collection) {
    return <NotFoundPage dvObjectNotFoundType="collection" />
  }

  if (isLoading || !collection) {
    return <GuestbookSkeleton />
  }

  return (
    <section>
      <BreadcrumbsGenerator
        hierarchy={collection.hierarchy}
        withActionItem
        actionItemText={t('create.title')}
        actionItems={[
          {
            text: t('title'),
            url: RouteWithParams.GUESTBOOKS(collectionId)
          },
          {
            text: t('create.title')
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

      {errorCreatingGuestbook && <Alert variant="danger">{errorCreatingGuestbook}</Alert>}

      <GuestbookForm
        initialGuestbook={initialGuestbook}
        isSubmitting={isCreatingGuestbook}
        submitButtonText={t('create.submit')}
        cancelButtonText={t('create.cancel')}
        onSubmit={handleSubmit}
        onCancel={navigateToGuestbooks}
      />
    </section>
  )
}
