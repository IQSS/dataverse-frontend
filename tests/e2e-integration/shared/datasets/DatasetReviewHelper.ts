import { DataverseApiHelper } from '../DataverseApiHelper'
import { DatasetResponse } from './DatasetHelper'

const REVIEW_DATASET_TYPE_NAME = 'review'
const DEFAULT_DATASET_TYPE_NAME = 'dataset'
const RUBRIC_METADATA_BLOCK_NAME = 'rubric_trusteddatadimensionsintensities'

export const REVIEW_SOLR_SCHEMA_FIELD_NAMES = [
  'itemReviewed',
  'itemReviewedCitation',
  'itemReviewedType',
  'itemReviewedUrl',
  'authorAndProvenance'
]

const REVIEW_METADATA_BLOCK_TSV = [
  '#metadataBlock\tname\tdataverseAlias\tdisplayName',
  '\treview\t\tReview Metadata',
  [
    '#datasetField',
    'name',
    'title',
    'description',
    'watermark',
    'fieldType',
    'displayOrder',
    'displayFormat',
    'advancedSearchField',
    'allowControlledVocabulary',
    'allowmultiples',
    'facetable',
    'displayoncreate',
    'required',
    'parent',
    'metadatablock_id',
    'termURI'
  ].join('\t'),
  '\titemReviewed\tItem Reviewed\tThe item being reviewed\t\tnone\t1\t\tFALSE\tFALSE\tFALSE\tFALSE\tTRUE\tTRUE\t\treview\t',
  '\titemReviewedUrl\tURL\tThe URL of the item being reviewed\t\turl\t2\t\tFALSE\tFALSE\tFALSE\tFALSE\tTRUE\tTRUE\titemReviewed\treview\t',
  '\titemReviewedType\tType\tThe type of the item being reviewed\t\ttext\t3\t\tFALSE\tTRUE\tFALSE\tFALSE\tTRUE\tTRUE\titemReviewed\treview\t',
  '\titemReviewedCitation\tCitation\tThe full bibliographic citation of the item being reviewed\t\ttextbox\t4\t\tFALSE\tFALSE\tFALSE\tFALSE\tTRUE\tTRUE\titemReviewed\treview\t',
  '#controlledVocabulary\tDatasetField\tValue\tidentifier\tdisplayOrder',
  '\titemReviewedType\tAudiovisual\t\t0',
  '\titemReviewedType\tAward\t\t1',
  '\titemReviewedType\tBook\t\t2',
  '\titemReviewedType\tBook Chapter\t\t3',
  '\titemReviewedType\tCollection\t\t4',
  '\titemReviewedType\tComputational Notebook\t\t5',
  '\titemReviewedType\tConference Paper\t\t6',
  '\titemReviewedType\tConference Proceeding\t\t7',
  '\titemReviewedType\tDataPaper\t\t8',
  '\titemReviewedType\tDataset\t\t9',
  '\titemReviewedType\tDissertation\t\t10',
  '\titemReviewedType\tEvent\t\t11',
  '\titemReviewedType\tImage\t\t12',
  '\titemReviewedType\tInteractive Resource\t\t13',
  '\titemReviewedType\tInstrument\t\t14',
  '\titemReviewedType\tJournal\t\t15',
  '\titemReviewedType\tJournal Article\t\t16',
  '\titemReviewedType\tModel\t\t17',
  '\titemReviewedType\tOutput Management Plan\t\t18',
  '\titemReviewedType\tPeer Review\t\t19',
  '\titemReviewedType\tPhysical Object\t\t20',
  '\titemReviewedType\tPreprint\t\t21',
  '\titemReviewedType\tProject\t\t22',
  '\titemReviewedType\tReport\t\t23',
  '\titemReviewedType\tService\t\t24',
  '\titemReviewedType\tSoftware\t\t25',
  '\titemReviewedType\tSound\t\t26',
  '\titemReviewedType\tStandard\t\t27',
  '\titemReviewedType\tStudy Registration\t\t28',
  '\titemReviewedType\tText\t\t29',
  '\titemReviewedType\tWorkflow\t\t30',
  '\titemReviewedType\tOther\t\t31'
].join('\n')

const RUBRIC_METADATA_BLOCK_TSV = [
  '#metadataBlock\tname\tdataverseAlias\tdisplayName\tblockURI',
  `\t${RUBRIC_METADATA_BLOCK_NAME}\t\tTrusted Data Dimensions and Intensities\t`,
  [
    '#datasetField',
    'name',
    'title',
    'description',
    'watermark',
    'fieldType',
    'displayOrder',
    'displayFormat',
    'advancedSearchField',
    'allowControlledVocabulary',
    'allowmultiples',
    'facetable',
    'displayoncreate',
    'required',
    'parent',
    'metadatablock_id',
    'termURI'
  ].join('\t'),
  `\tauthorAndProvenance\tAuthor and Provenance\tThe level of trust in the data creators and in other provenance information\t\ttext\t1\t\tTRUE\tTRUE\tFALSE\tTRUE\tFALSE\tFALSE\t\t${RUBRIC_METADATA_BLOCK_NAME}\t`,
  '#controlledVocabulary\tDatasetField\tValue\tidentifier\tdisplayOrder',
  '\tauthorAndProvenance\tLow\t\t0',
  '\tauthorAndProvenance\tMedium\t\t1',
  '\tauthorAndProvenance\tHigh\t\t2'
].join('\n')

interface DatasetTypeResponse {
  id: number
  name: string
}

export interface DatasetReviewResponse {
  id: number
  title: string
  persistentId: string
  persistentIdUrl: string
}

export class DatasetReviewHelper extends DataverseApiHelper {
  static async ensureReviewMetadataBlocksExist(): Promise<void> {
    await this.ensureMetadataBlockExists('review', REVIEW_METADATA_BLOCK_TSV)
    await this.ensureMetadataBlockExists(RUBRIC_METADATA_BLOCK_NAME, RUBRIC_METADATA_BLOCK_TSV)
  }

  static async ensureReviewDatasetTypeExists(): Promise<void> {
    const datasetType = await this.request<DatasetTypeResponse>(
      `/datasets/datasetTypes/${REVIEW_DATASET_TYPE_NAME}`,
      'GET'
    ).catch((error: unknown) => {
      const status = (error as { response?: { status?: number } }).response?.status

      if (status !== 404) {
        throw error
      }

      return this.request<DatasetTypeResponse>('/datasets/datasetTypes', 'POST', {
        name: REVIEW_DATASET_TYPE_NAME,
        displayName: 'Review',
        description: 'A review of a dataset compiled by the expert community.',
        linkedMetadataBlocks: [],
        availableLicenses: []
      })
    })

    await this.request(`/datasets/datasetTypes/${datasetType.id}`, 'PUT', [
      'review',
      RUBRIC_METADATA_BLOCK_NAME
    ])
  }

  static async allowReviewDatasetTypeInCollection(collectionAlias: string): Promise<void> {
    await this.request(
      `/dataverses/${collectionAlias}/attribute/allowedDatasetTypes?value=${[
        DEFAULT_DATASET_TYPE_NAME,
        REVIEW_DATASET_TYPE_NAME
      ].join(',')}`,
      'PUT'
    )
  }

  static async createReviewDataset(
    collectionAlias: string,
    itemReviewedPersistentId: string,
    reviewTitle: string
  ): Promise<DatasetResponse> {
    return this.request<DatasetResponse>(
      `/dataverses/${collectionAlias}/datasets`,
      'POST',
      this.createReviewDatasetPayload(itemReviewedPersistentId, reviewTitle)
    )
  }

  static async waitForDatasetReview(
    datasetId: string | number,
    reviewDatasetId: number,
    maxRetries = 20
  ): Promise<DatasetReviewResponse> {
    for (let retry = 0; retry < maxRetries; retry++) {
      const reviews = await this.getDatasetReviews(datasetId)
      const review = reviews.find((candidate) => candidate.id === reviewDatasetId)

      if (review) {
        return review
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    throw new Error(`Expected dataset review ${reviewDatasetId} to be indexed.`)
  }

  private static async ensureMetadataBlockExists(
    metadataBlockName: string,
    metadataBlockTsv: string
  ): Promise<void> {
    const exists = await this.request(`/metadatablocks/${metadataBlockName}`, 'GET')
      .then(() => true)
      .catch((error: unknown) => {
        const status = (error as { response?: { status?: number } }).response?.status

        if (status === 404) {
          return false
        }

        throw error
      })

    if (exists) {
      return
    }

    await this.request(
      '/admin/datasetfield/load',
      'POST',
      metadataBlockTsv,
      'text/tab-separated-values'
    )
  }

  private static async getDatasetReviews(
    datasetId: string | number
  ): Promise<DatasetReviewResponse[]> {
    const response = await this.request<{ reviews: DatasetReviewResponse[] }>(
      typeof datasetId === 'number'
        ? `/datasets/${datasetId}/reviews`
        : `/datasets/:persistentId/reviews?persistentId=${datasetId}`,
      'GET'
    )

    return response.reviews
  }

  private static createReviewDatasetPayload(itemReviewedPersistentId: string, reviewTitle: string) {
    const itemReviewedUrl = this.getPersistentIdUrl(itemReviewedPersistentId)

    return {
      datasetType: REVIEW_DATASET_TYPE_NAME,
      datasetVersion: {
        license: {
          name: 'CC0 1.0',
          uri: 'http://creativecommons.org/publicdomain/zero/1.0',
          iconUri: 'https://licensebuttons.net/p/zero/1.0/88x31.png'
        },
        metadataBlocks: {
          citation: {
            displayName: 'Citation Metadata',
            fields: [
              {
                value: reviewTitle,
                typeClass: 'primitive',
                multiple: false,
                typeName: 'title'
              },
              {
                value: [
                  {
                    authorName: {
                      value: 'Reviewer, Dataverse',
                      typeClass: 'primitive',
                      multiple: false,
                      typeName: 'authorName'
                    },
                    authorAffiliation: {
                      value: 'Dataverse.org',
                      typeClass: 'primitive',
                      multiple: false,
                      typeName: 'authorAffiliation'
                    }
                  }
                ],
                typeClass: 'compound',
                multiple: true,
                typeName: 'author'
              },
              {
                value: [
                  {
                    datasetContactEmail: {
                      value: 'reviewer@mailinator.com',
                      typeClass: 'primitive',
                      multiple: false,
                      typeName: 'datasetContactEmail'
                    },
                    datasetContactName: {
                      value: 'Reviewer, Dataverse',
                      typeClass: 'primitive',
                      multiple: false,
                      typeName: 'datasetContactName'
                    }
                  }
                ],
                typeClass: 'compound',
                multiple: true,
                typeName: 'datasetContact'
              },
              {
                value: [
                  {
                    dsDescriptionValue: {
                      value: 'This is a review of a dataset.',
                      multiple: false,
                      typeClass: 'primitive',
                      typeName: 'dsDescriptionValue'
                    }
                  }
                ],
                typeClass: 'compound',
                multiple: true,
                typeName: 'dsDescription'
              },
              {
                value: ['Medicine, Health and Life Sciences'],
                typeClass: 'controlledVocabulary',
                multiple: true,
                typeName: 'subject'
              }
            ]
          },
          review: {
            displayName: 'Review Metadata',
            fields: [
              {
                value: {
                  itemReviewedUrl: {
                    value: itemReviewedUrl,
                    typeClass: 'primitive',
                    multiple: false,
                    typeName: 'itemReviewedUrl'
                  },
                  itemReviewedType: {
                    value: 'Dataset',
                    typeClass: 'controlledVocabulary',
                    multiple: false,
                    typeName: 'itemReviewedType'
                  },
                  itemReviewedCitation: {
                    value: 'Dataset with a review, Dataverse, 2026',
                    typeClass: 'primitive',
                    multiple: false,
                    typeName: 'itemReviewedCitation'
                  }
                },
                typeClass: 'compound',
                multiple: false,
                typeName: 'itemReviewed'
              }
            ]
          },
          [RUBRIC_METADATA_BLOCK_NAME]: {
            displayName: 'Trusted Data Dimensions and Intensities',
            fields: [
              {
                value: 'High',
                typeClass: 'controlledVocabulary',
                multiple: false,
                typeName: 'authorAndProvenance'
              }
            ]
          }
        }
      }
    }
  }

  private static getPersistentIdUrl(persistentId: string): string {
    return persistentId.startsWith('doi:')
      ? `https://doi.org/${persistentId.replace(/^doi:/, '')}`
      : persistentId
  }
}
