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
import { getCollectionsForUnlinking } from '@/collection/domain/useCases/getCollectionsForUnlinking'
import { JSDataverseReadErrorHandler } from '@/shared/helpers/JSDataverseReadErrorHandler'
import { Utils } from '@/shared/helpers/Utils'
import styles from './CollectionLinkSelect.module.scss'

/**
 * This component is used to select a collection to link or unlink a dataset or collection to/from.
 * It is not responsible for performing the actual linking or unlinking, just for selecting the collection.
 * The onCollectionSelected callback is called when a collection is selected. That gives the parent component the ability to store the selected collection in its state.
 */

type BaseProps = {
  collectionRepository: CollectionRepository
  onCollectionSelected: (collectionSelected: CollectionSummary | null) => void
  helpText: string
  mode: 'link' | 'unlink'
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
  mode
}: CollectionLinkSelectProps) => {
  const { t: tShared } = useTranslation('shared')

  const [collections, setCollections] = useState<CollectionSummary[]>([])
  const [selectedCollection, setSelectedCollection] = useState<CollectionSummary | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [onlyOneCollection, setOnlyOneCollection] = useState(false)
  const [noCollections, setNoCollections] = useState(false)
  const firstFetchHappened = useRef(false)
  // A ref to hold the latest onCollectionSelected callback to avoid infinite loops in useEffect
  const onCollectionSelectedRef = useRef(onCollectionSelected)
  onCollectionSelectedRef.current = onCollectionSelected

  const fetchCollections = useCallback(
    async (searchTerm: string) => {
      setIsLoading(true)
      setError(null)
      try {
        const identifier =
          linkingObjectType === 'collection' ? collectionIdOrAlias : datasetPersistentId
        const method = mode === 'unlink' ? getCollectionsForUnlinking : getCollectionsForLinking

        const collectionSummaries = await method(
          collectionRepository,
          linkingObjectType,
          identifier,
          searchTerm
        )
        // Sort by display name alphabetically
        collectionSummaries.sort((a, b) => a.displayName.localeCompare(b.displayName))
        setCollections(collectionSummaries)

        if (searchTerm === '' && collectionSummaries.length === 1) {
          setOnlyOneCollection(true)
          onCollectionSelectedRef.current(collectionSummaries[0])
          setSelectedCollection(collectionSummaries[0])
        }
        if (searchTerm === '' && collectionSummaries.length === 0) {
          setNoCollections(true)
        } else {
          setNoCollections(false)
        }
      } catch (err) {
        if (err instanceof ReadError) {
          const error = new JSDataverseReadErrorHandler(err)
          const formattedError =
            error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()
          setError(formattedError)
        } else {
          setError(
            mode === 'unlink'
              ? 'An unexpected error occurred while fetching collections for unlinking.'
              : 'An unexpected error occurred while fetching collections for linking.'
          )
        }
      } finally {
        setIsLoading(false)
        firstFetchHappened.current = true
      }
    },
    [collectionIdOrAlias, datasetPersistentId, linkingObjectType, collectionRepository, mode]
  )

  // Fetch all collections for linking with empty search when the component is mounted
  useEffect(() => void fetchCollections(''), [fetchCollections])

  const handleSelectCollection = (eventKey: string | null) => {
    if (!eventKey) return
    const collection = collections.find((c) => c.id === Number(eventKey))

    // Update the selected collection state and notify the parent component
    setSelectedCollection(collection ?? null)
    onCollectionSelected(collection ?? null)
  }

  const handleSearchChange = Utils.debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    void fetchCollections(e.target.value.trim())
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

  if (noCollections) {
    return (
      <div className="d-flex gap-2 text-info mb-3">
        <InfoCircleFill />
        <span className="small">
          {tShared(
            mode === 'unlink'
              ? 'collectionLinkSelect.noCollectionsToUnlink'
              : 'collectionLinkSelect.noCollectionsToLink'
          )}
        </span>
      </div>
    )
  }

  return (
    <Form.Group>
      <Form.Group.Text className="mb-2">
        {onlyOneCollection ? (
          <span>
            {tShared(
              mode === 'unlink'
                ? 'collectionLinkSelect.onlyOneCollectionToUnlink'
                : 'collectionLinkSelect.onlyOneCollectionToLink',
              {
                linkingObjectType:
                  linkingObjectType === 'collection' ? tShared('collection') : tShared('dataset')
              }
            )}
          </span>
        ) : (
          <span>{helpText}</span>
        )}
      </Form.Group.Text>
      <Form.Group.Label column lg={3} htmlFor="search-collection">
        {tShared('collectionLinkSelect.label')}
      </Form.Group.Label>
      <Col lg={9}>
        {error && <small className="text-danger">{error}</small>}

        {onlyOneCollection && selectedCollection && (
          <Form.Group.Input
            readOnly
            value={selectedCollection.displayName}
            id="search-collection"
          />
        )}

        {!onlyOneCollection && !noCollections && (
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
                  size="sm"
                />
                <div className={`${styles['loader-line']} ${isLoading ? styles.loading : ''}`} />
              </Dropdown.Header>

              {collections.length === 0 && (
                <div className="px-3 py-1">{tShared('collectionLinkSelect.noOptions')}</div>
              )}

              {collections.map((collection) => (
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
