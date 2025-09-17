import { useCallback, useEffect, useRef, useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import Skeleton from 'react-loading-skeleton'
import { useTranslation } from 'react-i18next'
import { InfoCircleFill } from 'react-bootstrap-icons'
import { Col, Form, Row } from '@iqss/dataverse-design-system'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { CollectionSummary } from '@/collection/domain/models/CollectionSummary'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { getCollectionsForLinking } from '@/collection/domain/useCases/getCollectionsForLinking'
import { JSDataverseReadErrorHandler } from '@/shared/helpers/JSDataverseReadErrorHandler'
import { Utils } from '@/shared/helpers/Utils'
import styles from './CollectionLinkSelect.module.scss'

type BaseProps = {
  collectionRepository: CollectionRepository
  onCollectionSelected: (collectionSelected: CollectionSummary | null) => void
  helpText: string
  helpTextOnlyOneCollection: string
}

type CollectionLinkSelectProps = BaseProps &
  (
    | {
        linkingObjectType: 'collection'
        collectionIdOrAlias: string
        datasetPersistentId?: never
      }
    | {
        linkingObjectType: 'dataset'
        collectionIdOrAlias?: never
        datasetPersistentId: string
      }
  )

export const CollectionLinkSelect = ({
  collectionIdOrAlias,
  datasetPersistentId,
  collectionRepository,
  linkingObjectType,
  onCollectionSelected,
  helpText,
  helpTextOnlyOneCollection
}: CollectionLinkSelectProps) => {
  const { t: tShared } = useTranslation('shared')
  const [collectionsForLinking, setCollectionsForLinking] = useState<CollectionSummary[]>([])
  const [selectedCollection, setSelectedCollection] = useState<CollectionSummary | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [onlyOneCollection, setOnlyOneCollection] = useState(false)
  const [noCollectionsToLink, setNoCollectionsToLink] = useState(false)
  const firstFetchHappened = useRef(false)

  // A ref to hold the latest onCollectionSelected callback to avoid infinite loops in useEffect
  const onCollectionSelectedRef = useRef(onCollectionSelected)
  onCollectionSelectedRef.current = onCollectionSelected

  const fetchCollectionsForLinking = useCallback(
    async (searchTerm: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const collectionSummaries = await getCollectionsForLinking(
          collectionRepository,
          linkingObjectType,
          linkingObjectType === 'collection' ? collectionIdOrAlias : datasetPersistentId,
          searchTerm
        )

        // Sort by display name alphabetically
        collectionSummaries.sort((a, b) => a.displayName.localeCompare(b.displayName))

        setCollectionsForLinking(collectionSummaries)

        if (searchTerm === '' && collectionSummaries.length === 1) {
          // If there's only one collection available to link, select it by default
          setOnlyOneCollection(true)
          onCollectionSelectedRef.current(collectionSummaries[0])
          setSelectedCollection(collectionSummaries[0])
        }
        if (searchTerm === '' && collectionSummaries.length === 0) {
          setNoCollectionsToLink(true)
        } else {
          setNoCollectionsToLink(false)
        }
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
        firstFetchHappened.current = true
      }
    },
    [collectionIdOrAlias, datasetPersistentId, linkingObjectType, collectionRepository]
  )

  // Fetch all collections for linking with empty search when the component is mounted
  useEffect(() => void fetchCollectionsForLinking(''), [fetchCollectionsForLinking])

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

  // Show loading skeletons until the first fetch is done
  if (!firstFetchHappened.current) {
    return (
      <Row>
        <Skeleton width="70%" height={20} className="mb-2" />
        <Col xs={3}>
          <Skeleton width="100%" height={24} />
        </Col>
        <Col xs={9}>
          <Skeleton width="100%" height={38} />
        </Col>
      </Row>
    )
  }

  // If there are no collections to link, show a message
  if (noCollectionsToLink) {
    return (
      <div className="d-flex gap-2 text-danger">
        <div>
          <InfoCircleFill />
        </div>
        <span>{tShared('linkCollectionDataset.noCollectionsToLink')}</span>
      </div>
    )
  }

  return (
    <Form.Group>
      <Form.Group.Text className="mb-2">
        {onlyOneCollection ? <span>{helpTextOnlyOneCollection}</span> : <span>{helpText}</span>}
      </Form.Group.Text>
      <Form.Group.Label column lg={3} htmlFor="search-collection">
        {tShared('linkCollectionDataset.label')}
      </Form.Group.Label>
      <Col lg={9}>
        {error && <small className="text-danger">{error}</small>}

        {onlyOneCollection && selectedCollection && (
          <Form.Group.Input readOnly value={selectedCollection.displayName} />
        )}
        {!onlyOneCollection && !noCollectionsToLink && (
          <Dropdown autoClose onSelect={handleSelectCollection}>
            <div className={styles['toggle-wrapper']}>
              <Dropdown.Toggle
                as="input"
                type="button"
                id="search-collection"
                aria-label="Toggle options menu"
                className={styles.toggle}
              />
              <div className={styles['inner-content']}>
                {selectedCollection ? (
                  <span>{selectedCollection.displayName}</span>
                ) : (
                  <span className="text-muted">{tShared('linkCollectionDataset.select')}</span>
                )}
              </div>
            </div>
            <Dropdown.Menu className={styles.menu}>
              <Dropdown.Header className={styles['menu-header']}>
                <Form.Group.Input
                  onChange={handleSearchChange}
                  type="search"
                  placeholder={tShared('linkCollectionDataset.placeholder')}
                  size="sm"
                />
                <div className={`${styles['loader-line']} ${isLoading ? styles.loading : ''}`} />
              </Dropdown.Header>

              {collectionsForLinking.length === 0 && (
                <div className="px-3 py-1">{tShared('linkCollectionDataset.noOptions')}</div>
              )}

              {collectionsForLinking.map((collection) => (
                <Dropdown.Item
                  eventKey={collection.id}
                  active={selectedCollection?.id === collection.id}
                  key={collection.id}>
                  <Row>
                    <Col xs={7} className="text-wrap">
                      {collection.displayName}
                    </Col>
                    <Col xs={5} className="text-wrap text-break text-muted">
                      <small>{collection.alias}</small>
                    </Col>
                  </Row>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        )}
      </Col>
    </Form.Group>
  )
}
