import { useCallback, useEffect, useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Badge, Col, Form } from '@iqss/dataverse-design-system'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { CollectionSummary } from '@/collection/domain/models/CollectionSummary'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { getCollectionsForLinking } from '@/collection/domain/useCases/getCollectionsForLinking'
import { JSDataverseReadErrorHandler } from '@/shared/helpers/JSDataverseReadErrorHandler'
import { Utils } from '@/shared/helpers/Utils'
import styles from './CollectionLinkSelect.module.scss'

interface CollectionLinkSelectProps {
  collectionIdOrAlias: string
  collectionRepository: CollectionRepository
  onCollectionSelected: (collectionSelected: CollectionSummary | null) => void
  helpText: string
}

export const CollectionLinkSelect = ({
  collectionIdOrAlias,
  collectionRepository,
  onCollectionSelected,
  helpText
}: CollectionLinkSelectProps) => {
  const { t: tShared } = useTranslation('shared')
  const [collectionsForLinking, setCollectionsForLinking] = useState<CollectionSummary[]>([])
  const [selectedCollection, setSelectedCollection] = useState<CollectionSummary | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // A useEffect to call the API to get the collections available to link when the component is mounted

  const fetchCollectionsForLinking = useCallback(
    async (searchTerm: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const collectionSummaries = await getCollectionsForLinking(
          collectionRepository,
          'collection',
          collectionIdOrAlias,
          searchTerm
        )
        setCollectionsForLinking(collectionSummaries)
      } catch (err: ReadError | unknown) {
        if (err instanceof ReadError) {
          const error = new JSDataverseReadErrorHandler(err)
          const formattedError =
            error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()

          setError(formattedError)
        } else {
          setError('An unexpected error occurred while fetching collections for linking.')
        }
      } finally {
        setIsLoading(false)
      }
    },
    [collectionIdOrAlias, collectionRepository]
  )

  const handleSelectCollection = (eventKey: string | null) => {
    if (!eventKey) return

    const collection: CollectionSummary | undefined = collectionsForLinking.find(
      (collection) => collection.id === Number(eventKey)
    )

    // Update the selected collection state and notify the parent component
    setSelectedCollection(collection ?? null)
    onCollectionSelected(collection ?? null)
  }

  const handleSearchChange = Utils.debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const trimmedValue = value.trim()
    void fetchCollectionsForLinking(trimmedValue)
  }, 400)

  useEffect(() => {
    void fetchCollectionsForLinking('')
  }, [fetchCollectionsForLinking])

  return (
    <Form.Group>
      <Form.Group.Text className="mb-2">{helpText}</Form.Group.Text>
      <Form.Group.Label column lg={3} htmlFor="search-collection-select">
        {tShared('collectionLinkSelect.label')}
      </Form.Group.Label>
      <Col lg={9}>
        <Dropdown autoClose onSelect={handleSelectCollection}>
          <div className={styles['toggle-wrapper']}>
            <Dropdown.Toggle
              as="input"
              type="button"
              id="search-collection-select"
              aria-label="Toggle options menu"
              className={styles.toggle}
            />
            <div className={styles['inner-content']} data-testid="toggle-inner-content">
              {selectedCollection ? (
                <span>{selectedCollection.displayName}</span>
              ) : (
                <span className="text-muted">{tShared('collectionLinkSelect.select')}</span>
              )}
            </div>
          </div>
          <Dropdown.Menu className={styles.menu}>
            <Dropdown.Header className={styles['menu-header']}>
              <Form.Group.Input
                onChange={handleSearchChange}
                type="search"
                placeholder={tShared('collectionLinkSelect.placeholder')}
              />
              <div className={`${styles['loader-line']} ${isLoading ? styles.loading : ''}`} />
            </Dropdown.Header>
            {error && <div className="px-3 py-1 text-danger">{error}</div>}
            {collectionsForLinking.length === 0 && (
              <div className="px-3 py-1">{tShared('collectionLinkSelect.noOptions')}</div>
            )}
            {collectionsForLinking.map((collection) => (
              <Dropdown.Item
                eventKey={collection.id}
                active={selectedCollection?.id === collection.id}
                key={collection.id}>
                <div className="d-flex align-items-center gap-2">
                  <span>{collection.displayName}</span>
                  <Badge variant="secondary">{collection.alias}</Badge>
                </div>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Col>
    </Form.Group>
  )
}
