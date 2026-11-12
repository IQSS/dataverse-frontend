import { type ChangeEvent, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Form, Table, Alert } from '@iqss/dataverse-design-system'
import { CaretDown, CaretUp, ChevronExpand, Download } from 'react-bootstrap-icons'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import { downloadGuestbookResponsesByCollectionId } from '@/guestbooks/domain/useCases/downloadGuestbookResponsesByCollectionId'
import { downloadGuestbookResponsesByGuestbookId } from '@/guestbooks/domain/useCases/downloadGuestbookResponsesByGuestbookId'
import { setGuestbookEnabled } from '@/guestbooks/domain/useCases/setGuestbookEnabled'
import { RouteWithParams } from '@/sections/Route.enum'
import { useCollection } from '@/sections/collection/useCollection'
import { NotFoundPage } from '@/sections/not-found-page/NotFoundPage'
import { BreadcrumbsGenerator } from '@/sections/shared/hierarchy/BreadcrumbsGenerator'
import { SeparationLine } from '@/sections/shared/layout/SeparationLine/SeparationLine'
import { downloadFile } from '@/sections/shared/citation/citation-download/useDownloadCitation'
import { useLoading } from '@/shared/contexts/loading/LoadingContext'
import { useGuestbookRepositories } from '@/shared/contexts/repositories/RepositoriesProvider'
import { GuestbookActionButtons } from './action-buttons/GuestbookActionButtons'
import { CreateGuestbookButton } from './create-guestbooks/CreateGuestbookButton'
import { GuestbookSkeleton } from './GuestbookSkeleton'
import { GuestbooksEmptyState } from './GuestbooksEmptyState'
import { PreviewGuestbookModal } from './preview-modal/PreviewGuestbookModal'
import { useGetGuestbooksByCollectionId } from './useGetGuestbooksByCollectionId'
import styles from './Guestbooks.module.scss'

interface GuestbooksProps {
  collectionRepository: CollectionRepository
  collectionId: string
}

export const Guestbooks = ({ collectionRepository, collectionId }: GuestbooksProps) => {
  const { t } = useTranslation('guestbooks')
  const navigate = useNavigate()
  const [includeGuestbooksFromParent, setIncludeGuestbooksFromParent] = useState(true)
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'usage' | 'responses' | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [guestbookToPreview, setGuestbookToPreview] = useState<Guestbook | undefined>()
  const [displayGuestbooks, setDisplayGuestbooks] = useState<Guestbook[]>([])
  const [togglingGuestbookId, setTogglingGuestbookId] = useState<number | undefined>()
  const [toggleGuestbookError, setToggleGuestbookError] = useState<string | null>(null)
  const [isDownloadingAllResponses, setIsDownloadingAllResponses] = useState(false)
  const [downloadingGuestbookId, setDownloadingGuestbookId] = useState<number | undefined>()
  const [downloadResponsesError, setDownloadResponsesError] = useState<string | null>(null)
  const { setIsLoading } = useLoading()
  const { guestbookRepository } = useGuestbookRepositories()

  const { collection, isLoading } = useCollection(collectionRepository, collectionId)
  const { guestbooks, isLoadingGuestbooksByCollectionId, errorGetGuestbooksByCollectionId } =
    useGetGuestbooksByCollectionId({
      guestbookRepository,
      collectionIdOrAlias: collection?.id,
      includeStats: true,
      includeInherited: includeGuestbooksFromParent
    })
  const {
    guestbooks: currentCollectionGuestbooks,
    isLoadingGuestbooksByCollectionId: isLoadingCurrentCollectionGuestbooks,
    errorGetGuestbooksByCollectionId: errorGetCurrentCollectionGuestbooks
  } = useGetGuestbooksByCollectionId({
    guestbookRepository,
    collectionIdOrAlias: collection?.id,
    includeStats: false,
    includeInherited: false
  })
  const collectionHierarchy = collection?.hierarchy?.toArray() ?? []
  const collectionHierarchyNames = collectionHierarchy.map((node) => node.name)
  const parentCollectionName =
    collectionHierarchyNames.length > 1
      ? collectionHierarchyNames[collectionHierarchyNames.length - 2] ?? 'Parent'
      : undefined

  const currentCollectionGuestbookIds = useMemo(
    () => new Set(currentCollectionGuestbooks.map((guestbook) => guestbook.id)),
    [currentCollectionGuestbooks]
  )
  const isLoadingData =
    isLoading || isLoadingGuestbooksByCollectionId || isLoadingCurrentCollectionGuestbooks

  useEffect(() => {
    setDisplayGuestbooks(guestbooks)
  }, [guestbooks])

  useEffect(() => {
    setIsLoading(isLoadingData)
  }, [isLoadingData, setIsLoading])

  const filteredGuestbooks = displayGuestbooks
  const hasGuestbookResponses = filteredGuestbooks.some(
    (guestbook) => (guestbook.responseCount ?? 0) > 0
  )
  const guestbookFetchErrors = useMemo(
    () =>
      Array.from(
        new Set(
          [errorGetGuestbooksByCollectionId, errorGetCurrentCollectionGuestbooks].filter(
            (error): error is string => Boolean(error)
          )
        )
      ),
    [errorGetCurrentCollectionGuestbooks, errorGetGuestbooksByCollectionId]
  )
  const sortedGuestbooks = useMemo(() => {
    if (!sortBy) {
      return filteredGuestbooks
    }

    const sorted = [...filteredGuestbooks]
    sorted.sort((first, second) => {
      if (sortBy === 'name') {
        return first.name.localeCompare(second.name, undefined, { sensitivity: 'base' })
      }
      if (sortBy === 'created') {
        return new Date(first.createTime).getTime() - new Date(second.createTime).getTime()
      }
      if (sortBy === 'usage') {
        return (first.usageCount ?? 0) - (second.usageCount ?? 0)
      }
      return (first.responseCount ?? 0) - (second.responseCount ?? 0)
    })

    return sortDirection === 'asc' ? sorted : sorted.reverse()
  }, [filteredGuestbooks, sortBy, sortDirection])

  const handleSort = (column: 'name' | 'created' | 'usage' | 'responses') => {
    if (sortBy === column) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
      return
    }

    setSortBy(column)
    setSortDirection('asc')
  }

  const sortIndicator = (column: 'name' | 'created' | 'usage' | 'responses') => {
    if (sortBy === column) {
      return sortDirection === 'asc' ? (
        <CaretUp className={styles['sort-icon']} />
      ) : (
        <CaretDown className={styles['sort-icon']} />
      )
    }
    return <ChevronExpand className={styles['sort-icon']} />
  }
  const sortButtonClass = (column: 'name' | 'created' | 'usage' | 'responses') =>
    `${styles['sort-button']}${sortBy === column ? ` ${styles['sort-button-active']}` : ''}`
  const sortHeaderClass = (column: 'name' | 'created' | 'usage' | 'responses') =>
    sortBy === column ? styles['sort-header-active'] : ''
  const isGuestbookFromCurrentCollection = (guestbook: Guestbook): boolean =>
    currentCollectionGuestbookIds.has(guestbook.id)
  const getGuestbookOriginAlias = (guestbook: Guestbook): string => {
    const matchingCollection = collectionHierarchy.find(
      (node) =>
        node.id === String(guestbook.dataverseId) || Number(node.id) === guestbook.dataverseId
    )

    if (matchingCollection) {
      return matchingCollection.id
    }

    if (guestbook.dataverseId === 1) {
      return collectionHierarchy[0]?.id ?? 'root'
    }

    return collectionHierarchy[collectionHierarchy.length - 2]?.id ?? String(guestbook.dataverseId)
  }

  const handleIncludeGuestbooksFromParentChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIncludeGuestbooksFromParent(event.target.checked)
  }

  const handleToggleEnabled = async (guestbook: Guestbook) => {
    setToggleGuestbookError(null)
    setTogglingGuestbookId(guestbook.id)

    try {
      await setGuestbookEnabled(
        guestbookRepository,
        guestbook.dataverseId,
        guestbook.id,
        !guestbook.enabled
      )
      setDisplayGuestbooks((currentGuestbooks) =>
        currentGuestbooks.map((currentGuestbook) =>
          currentGuestbook.id === guestbook.id
            ? { ...currentGuestbook, enabled: !currentGuestbook.enabled }
            : currentGuestbook
        )
      )
      toast.success(t('alerts.statusUpdated'))
    } catch {
      setToggleGuestbookError(t('errors.toggleEnabled'))
    } finally {
      setTogglingGuestbookId(undefined)
    }
  }

  const handleDownloadResponses = async (guestbook: Guestbook) => {
    setDownloadResponsesError(null)
    setDownloadingGuestbookId(guestbook.id)

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
      setDownloadingGuestbookId(undefined)
    }
  }

  const handleDownloadAllResponses = async () => {
    if (!collection) {
      return
    }

    setDownloadResponsesError(null)
    setIsDownloadingAllResponses(true)

    try {
      const csvContent = await downloadGuestbookResponsesByCollectionId(
        guestbookRepository,
        collection.id
      )
      downloadFile(
        csvContent,
        `${collection.name}-all-guestbook-responses.csv`,
        'text/csv;charset=utf-8'
      )
      toast.success(t('alerts.downloadStarted'))
    } catch {
      setDownloadResponsesError(t('errors.downloadResponses'))
    } finally {
      setIsDownloadingAllResponses(false)
    }
  }

  if (!isLoading && !collection) {
    return <NotFoundPage dvObjectNotFoundType="collection" />
  }

  if (isLoadingData || !collection) {
    return <GuestbookSkeleton />
  }

  return (
    <section>
      <BreadcrumbsGenerator
        hierarchy={collection.hierarchy}
        withActionItem
        actionItemText={t('title')}
      />
      <header className={styles.header}>
        <div className={styles['header-title']}>
          <h1>{collection.name}</h1>
          {collection.affiliation ? (
            <span className={styles.subtext}>({collection.affiliation})</span>
          ) : null}
        </div>
      </header>

      <SeparationLine />
      {guestbookToPreview && (
        <PreviewGuestbookModal
          show={Boolean(guestbookToPreview)}
          handleClose={() => setGuestbookToPreview(undefined)}
          guestbook={guestbookToPreview}
        />
      )}

      <div className={styles['table-actions']}>
        <div className={styles['table-actions-left']}>
          {parentCollectionName && (
            <Form.Group.Checkbox
              id="include-guestbooks-from-parent"
              label={t('filters.includeFromParent', { parent: parentCollectionName })}
              checked={includeGuestbooksFromParent}
              onChange={handleIncludeGuestbooksFromParentChange}
              className={styles['include-templates-filter']}
            />
          )}
        </div>
        <div className={styles['table-actions-right']}>
          <CreateGuestbookButton collectionId={collectionId} className={styles['create-button']} />
          {hasGuestbookResponses && (
            <Button
              variant="primary"
              onClick={handleDownloadAllResponses}
              disabled={isDownloadingAllResponses}
              className={styles['download-all-button']}>
              <Download />
              {t('actions.downloadAllResponses')}
            </Button>
          )}
        </div>
      </div>
      {guestbookFetchErrors.map((error) => (
        <Alert key={error} variant="danger">
          {error}
        </Alert>
      ))}
      {toggleGuestbookError && <Alert variant="danger">{toggleGuestbookError}</Alert>}
      {downloadResponsesError && <Alert variant="danger">{downloadResponsesError}</Alert>}

      {filteredGuestbooks.length === 0 ? (
        <GuestbooksEmptyState collectionId={collectionId} />
      ) : (
        <Table>
          <thead>
            <tr>
              <th scope="col" className={`${styles['name-column']} ${sortHeaderClass('name')}`}>
                <Button
                  variant="link"
                  onClick={() => handleSort('name')}
                  aria-pressed={sortBy === 'name'}
                  className={sortButtonClass('name')}>
                  <span>{t('table.name')}</span>
                  <span>{sortIndicator('name')}</span>
                </Button>
              </th>
              <th scope="col" className={sortHeaderClass('created')}>
                <Button
                  variant="link"
                  onClick={() => handleSort('created')}
                  aria-pressed={sortBy === 'created'}
                  className={sortButtonClass('created')}>
                  <span>{t('table.created')}</span>
                  <span>{sortIndicator('created')}</span>
                </Button>
              </th>
              <th scope="col" className={sortHeaderClass('usage')}>
                <Button
                  variant="link"
                  onClick={() => handleSort('usage')}
                  aria-pressed={sortBy === 'usage'}
                  className={sortButtonClass('usage')}>
                  <span>{t('table.usage')}</span>
                  <span>{sortIndicator('usage')}</span>
                </Button>
              </th>
              <th scope="col" className={sortHeaderClass('responses')}>
                <Button
                  variant="link"
                  onClick={() => handleSort('responses')}
                  aria-pressed={sortBy === 'responses'}
                  className={sortButtonClass('responses')}>
                  <span>{t('table.responses')}</span>
                  <span>{sortIndicator('responses')}</span>
                </Button>
              </th>
              <th scope="col" className={styles['action-column']}>
                {t('table.action')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedGuestbooks.map((guestbook) => (
              <tr key={guestbook.id}>
                <td>{guestbook.name}</td>
                <td>{new Date(guestbook.createTime).toLocaleDateString()}</td>
                <td>{guestbook.usageCount ?? 0}</td>
                <td>{guestbook.responseCount ?? 0}</td>
                <td>
                  {!isGuestbookFromCurrentCollection(guestbook) && (
                    <span className={styles['template-origin']}>
                      {t('table.guestbookCreatedAt', {
                        alias: getGuestbookOriginAlias(guestbook)
                      })}
                    </span>
                  )}
                  <GuestbookActionButtons
                    isEnabled={guestbook.enabled}
                    onView={() => setGuestbookToPreview(guestbook)}
                    onCopy={() =>
                      navigate(RouteWithParams.GUESTBOOKS_CREATE(collectionId), {
                        state: { guestbookToCopy: guestbook }
                      })
                    }
                    onEdit={() =>
                      navigate(RouteWithParams.GUESTBOOKS_EDIT(collectionId, guestbook.id))
                    }
                    onViewResponses={() =>
                      navigate(RouteWithParams.GUESTBOOKS_RESPONSES(collectionId, guestbook.id))
                    }
                    onToggleEnabled={() => handleToggleEnabled(guestbook)}
                    canToggleEnabled={isGuestbookFromCurrentCollection(guestbook)}
                    canEdit={isGuestbookFromCurrentCollection(guestbook)}
                    isTogglingEnabled={togglingGuestbookId === guestbook.id}
                    onDownloadResponses={() => handleDownloadResponses(guestbook)}
                    isDownloadingResponses={downloadingGuestbookId === guestbook.id}
                    actionGroupClassName={styles['action-group']}
                    toggleStatusButtonClassName={styles['toggle-status-button']}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </section>
  )
}
