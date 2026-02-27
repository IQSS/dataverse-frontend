import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Form, Table, Alert } from '@iqss/dataverse-design-system'
import { CaretDown, CaretUp, ChevronExpand } from 'react-bootstrap-icons'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import { useCollection } from '@/sections/collection/useCollection'
import { NotFoundPage } from '@/sections/not-found-page/NotFoundPage'
import { BreadcrumbsGenerator } from '@/sections/shared/hierarchy/BreadcrumbsGenerator'
import { SeparationLine } from '@/sections/shared/layout/SeparationLine/SeparationLine'
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
  const [includeGuestbooksFromRoot, setIncludeGuestbooksFromRoot] = useState(true)
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'usage' | 'responses' | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [guestbookToPreview, setGuestbookToPreview] = useState<Guestbook | undefined>()

  const { collection, isLoading } = useCollection(collectionRepository, collectionId)
  const { guestbooks, isLoadingGuestbooksByCollectionId, errorGetGuestbooksByCollectionId } =
    useGetGuestbooksByCollectionId({
      collectionIdOrAlias: collection?.id
    })
  console.log('Guestbooks', guestbooks)
  const rootCollectionNames = collection?.hierarchy?.toArray().map((node) => node.name) ?? []

  const currentDataverseId = Number(collection?.id) || 1

  const filteredGuestbooks = useMemo(
    () =>
      includeGuestbooksFromRoot
        ? guestbooks
        : guestbooks.filter((guestbook) => guestbook.dataverseId === currentDataverseId),
    [guestbooks, includeGuestbooksFromRoot, currentDataverseId]
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
      // TODO: Update after api is ready for usage and response
      return first.customQuestions.length - second.customQuestions.length
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

  if (!isLoading && !collection) {
    return <NotFoundPage dvObjectNotFoundType="collection" />
  }

  if (isLoading || isLoadingGuestbooksByCollectionId || !collection) {
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
          {rootCollectionNames.length > 0 && (
            <Form.Group.Checkbox
              id="include-guestbooks-from-root"
              label={t('filters.includeFromRoot', { root: rootCollectionNames[0] ?? 'Root' })}
              checked={includeGuestbooksFromRoot}
              onChange={() => setIncludeGuestbooksFromRoot((current) => !current)}
              className={styles['include-templates-filter']}
            />
          )}
        </div>
        <CreateGuestbookButton collectionId={collectionId} className={styles['create-button']} />
      </div>
      {errorGetGuestbooksByCollectionId && (
        <Alert variant="danger">{errorGetGuestbooksByCollectionId}</Alert>
      )}

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
                {/* TODO: Update after api is ready for usage and response */}
                {/* <td>{guestbook.usageCount}</td>
                <td>{getGuestbookResponseCount(guestbook)}</td> */}
                <td>usage</td>
                <td>responses</td>
                <td>
                  {guestbook.dataverseId !== currentDataverseId && (
                    <span className={styles['template-origin']}>
                      {t('table.guestbookCreatedAt', { alias: guestbook.dataverseId })}
                    </span>
                  )}
                  <GuestbookActionButtons
                    isEnabled={guestbook.enabled}
                    onView={() => setGuestbookToPreview(guestbook)}
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
