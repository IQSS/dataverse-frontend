import { useCallback, useEffect, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Alert, Button, Table } from '@iqss/dataverse-design-system'
import { CaretDown, CaretUp, ChevronExpand, Download } from 'react-bootstrap-icons'
import { toast } from 'react-toastify'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { GuestbookResponsesPaginationInfo } from '@/guestbooks/domain/models/GuestbookResponsesPaginationInfo'
import { EventType, GuestbookResponse } from '@/guestbooks/domain/models/GuestbookResponse'
import { downloadGuestbookResponsesByGuestbookId } from '@/guestbooks/domain/useCases/downloadGuestbookResponsesByGuestbookId'
import { useCollection } from '@/sections/collection/useCollection'
import { NotFoundPage } from '@/sections/not-found-page/NotFoundPage'
import { RouteWithParams } from '@/sections/Route.enum'
import { PaginationControls } from '@/sections/shared/pagination/PaginationControls'
import { BreadcrumbsGenerator } from '@/sections/shared/hierarchy/BreadcrumbsGenerator'
import { SeparationLine } from '@/sections/shared/layout/SeparationLine/SeparationLine'
import { downloadFile } from '@/sections/shared/citation/citation-download/useDownloadCitation'
import { useGetGuestbookById } from '@/sections/dataset/dataset-guestbook/useGetGuestbookById'
import { useLoading } from '@/shared/contexts/loading/LoadingContext'
import { useGuestbookRepositories } from '@/shared/contexts/repositories/RepositoriesProvider'
import { GuestbookSkeleton } from '../GuestbookSkeleton'
import { useGetGuestbookResponsesByGuestbookId } from './useGetGuestbookResponsesByGuestbookId'
import styles from '../Guestbooks.module.scss'

interface GuestbookResponsesProps {
  collectionRepository: CollectionRepository
  collectionId: string
  guestbookId: number
}

type SortableColumn = 'dataset' | 'date' | 'type' | 'file' | 'user'

const formatResponseDate = (date: string): string => new Date(date).toLocaleDateString()

const getCustomQuestionsText = (response: GuestbookResponse): string => {
  if (!response.customQuestions || response.customQuestions.length === 0) {
    return ''
  }

  return response.customQuestions
    .map((customQuestion) => `${customQuestion.question}: ${customQuestion.response}`)
    .join('\n')
}

export const GuestbookResponses = ({
  collectionRepository,
  collectionId,
  guestbookId
}: GuestbookResponsesProps) => {
  const { t } = useTranslation('guestbooks')
  const [sortBy, setSortBy] = useState<SortableColumn | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [isDownloadingResponses, setIsDownloadingResponses] = useState(false)
  const [downloadResponsesError, setDownloadResponsesError] = useState<string | null>(null)
  const [paginationInfo, setPaginationInfo] = useState<GuestbookResponsesPaginationInfo>(
    new GuestbookResponsesPaginationInfo()
  )
  const { setIsLoading } = useLoading()
  const { guestbookRepository } = useGuestbookRepositories()
  const { collection, isLoading } = useCollection(collectionRepository, collectionId)
  const { guestbook, isLoadingGuestbook, errorGetGuestbook } = useGetGuestbookById({
    guestbookRepository,
    guestbookId
  })
  const {
    guestbookResponses,
    totalGuestbookResponseCount,
    isLoadingGuestbookResponses,
    errorGetGuestbookResponses
  } = useGetGuestbookResponsesByGuestbookId({
    guestbookRepository,
    guestbookId,
    limit: paginationInfo.pageSize,
    offset: paginationInfo.offset
  })
  const isLoadingData = isLoading || isLoadingGuestbook || isLoadingGuestbookResponses
  const getEventTypeLabel = useCallback(
    (eventType: EventType): string =>
      t(`responses.eventTypes.${eventType}`, { defaultValue: eventType }),
    [t]
  )

  useEffect(() => {
    setIsLoading(isLoadingData)
  }, [isLoadingData, setIsLoading])

  useEffect(() => {
    setPaginationInfo((currentPaginationInfo) =>
      currentPaginationInfo.withTotal(totalGuestbookResponseCount)
    )
  }, [totalGuestbookResponseCount])

  const sortedGuestbookResponses = useMemo(() => {
    if (!sortBy) {
      return guestbookResponses
    }

    const sorted = [...guestbookResponses]
    sorted.sort((first, second) => {
      if (sortBy === 'dataset') {
        return first.dataset.localeCompare(second.dataset, undefined, { sensitivity: 'base' })
      }
      if (sortBy === 'date') {
        return new Date(first.date).getTime() - new Date(second.date).getTime()
      }
      if (sortBy === 'type') {
        return getEventTypeLabel(first.type).localeCompare(getEventTypeLabel(second.type))
      }
      if (sortBy === 'file') {
        return (first.fileName ?? '').localeCompare(second.fileName ?? '', undefined, {
          sensitivity: 'base'
        })
      }
      return first.userName.localeCompare(second.userName, undefined, {
        sensitivity: 'base'
      })
    })

    return sortDirection === 'asc' ? sorted : sorted.reverse()
  }, [getEventTypeLabel, guestbookResponses, sortBy, sortDirection])

  const handleSort = (column: SortableColumn) => {
    if (sortBy === column) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortBy(column)
    setSortDirection('asc')
  }

  const sortIndicator = (column: SortableColumn) => {
    if (sortBy === column) {
      return sortDirection === 'asc' ? (
        <CaretUp className={styles['sort-icon']} />
      ) : (
        <CaretDown className={styles['sort-icon']} />
      )
    }
    return <ChevronExpand className={styles['sort-icon']} />
  }

  const sortButtonClass = (column: SortableColumn) =>
    `${styles['sort-button']}${sortBy === column ? ` ${styles['sort-button-active']}` : ''}`
  const sortHeaderClass = (column: SortableColumn) =>
    sortBy === column ? styles['sort-header-active'] : ''

  const handleDownloadResponses = async () => {
    if (!guestbook) {
      return
    }

    setDownloadResponsesError(null)
    setIsDownloadingResponses(true)

    try {
      const csvContent = await downloadGuestbookResponsesByGuestbookId(
        guestbookRepository,
        guestbook.dataverseId,
        guestbook.id
      )
      downloadFile(csvContent, `${guestbook.name}-responses.csv`, 'text/csv;charset=utf-8')
      toast.success(t('alerts.downloadStarted'))
    } catch {
      setDownloadResponsesError(t('errors.downloadResponses'))
    } finally {
      setIsDownloadingResponses(false)
    }
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
        actionItemText={t('responses.title')}
        actionItems={[
          {
            text: t('title'),
            url: RouteWithParams.GUESTBOOKS(collectionId)
          },
          {
            text: t('responses.title')
          }
        ]}
      />

      <header className={styles.header}>
        <div className={styles['header-title']}>
          <h1>{collection.name}</h1>
          {collection.affiliation ? (
            <span className={styles.subtext}>({collection.affiliation})</span>
          ) : null}
        </div>
      </header>

      <Alert variant="info" dismissible={false} customHeading={t('responses.title')}>
        <Trans t={t} i18nKey="responses.info" />
      </Alert>

      {errorGetGuestbook && <Alert variant="danger">{errorGetGuestbook}</Alert>}
      {errorGetGuestbookResponses && <Alert variant="danger">{errorGetGuestbookResponses}</Alert>}
      {downloadResponsesError && <Alert variant="danger">{downloadResponsesError}</Alert>}

      {guestbook && (
        <>
          <div className={styles['response-details']}>
            <div className={styles['response-detail-row']}>
              <strong>{t('responses.guestbookName')}</strong>
              <span>{guestbook.name}</span>
            </div>
          </div>

          <SeparationLine />

          <div className={styles['response-actions']}>
            <strong>
              {t('responses.count', {
                count: totalGuestbookResponseCount
              })}
            </strong>
            <Button
              variant="secondary"
              onClick={handleDownloadResponses}
              disabled={isDownloadingResponses}
              className={styles['download-all-button']}>
              <Download />
              {t('responses.downloadButton')}
            </Button>
          </div>

          <Table>
            <thead>
              <tr>
                <th scope="col" className={sortHeaderClass('dataset')}>
                  <Button
                    variant="link"
                    onClick={() => handleSort('dataset')}
                    aria-pressed={sortBy === 'dataset'}
                    className={sortButtonClass('dataset')}>
                    <span>{t('responses.table.dataset')}</span>
                    <span>{sortIndicator('dataset')}</span>
                  </Button>
                </th>
                <th scope="col" className={sortHeaderClass('date')}>
                  <Button
                    variant="link"
                    onClick={() => handleSort('date')}
                    aria-pressed={sortBy === 'date'}
                    className={sortButtonClass('date')}>
                    <span>{t('responses.table.date')}</span>
                    <span>{sortIndicator('date')}</span>
                  </Button>
                </th>
                <th scope="col" className={sortHeaderClass('type')}>
                  <Button
                    variant="link"
                    onClick={() => handleSort('type')}
                    aria-pressed={sortBy === 'type'}
                    className={sortButtonClass('type')}>
                    <span>{t('responses.table.type')}</span>
                    <span>{sortIndicator('type')}</span>
                  </Button>
                </th>
                <th scope="col" className={sortHeaderClass('file')}>
                  <Button
                    variant="link"
                    onClick={() => handleSort('file')}
                    aria-pressed={sortBy === 'file'}
                    className={sortButtonClass('file')}>
                    <span>{t('responses.table.file')}</span>
                    <span>{sortIndicator('file')}</span>
                  </Button>
                </th>
                <th scope="col" className={sortHeaderClass('user')}>
                  <Button
                    variant="link"
                    onClick={() => handleSort('user')}
                    aria-pressed={sortBy === 'user'}
                    className={sortButtonClass('user')}>
                    <span>{t('responses.table.user')}</span>
                    <span>{sortIndicator('user')}</span>
                  </Button>
                </th>
                <th scope="col">{t('responses.table.customQuestions')}</th>
              </tr>
            </thead>
            <tbody>
              {sortedGuestbookResponses.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles['no-records-cell']}>
                    {t('responses.noRecords')}
                  </td>
                </tr>
              ) : (
                sortedGuestbookResponses.map((response) => (
                  <tr key={response.id}>
                    <td>{response.dataset}</td>
                    <td>{formatResponseDate(response.date)}</td>
                    <td>{getEventTypeLabel(response.type)}</td>
                    <td>{response.fileName ?? ''}</td>
                    <td>{response.userName}</td>
                    <td className={styles['custom-questions-cell']}>
                      {getCustomQuestionsText(response)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
          {paginationInfo.totalPages > 1 && (
            <PaginationControls
              initialPaginationInfo={paginationInfo}
              onPaginationInfoChange={setPaginationInfo}
            />
          )}
        </>
      )}
    </section>
  )
}
