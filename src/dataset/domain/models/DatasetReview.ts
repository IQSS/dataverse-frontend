export interface DatasetReview {
  title: string
  authors: string[]
  persistentId: string
  persistentIdUrl: string
  id: number
  citation: string
  citationHtml: string
  datePublished: string
  description: string
  rubricMetadataBlocks: DatasetReviewRubricMetadataBlock[]
}

export interface DatasetReviewRubricMetadataBlock {
  name: string
  displayName: string
  fields: DatasetReviewRubricMetadataField[]
}

export interface DatasetReviewRubricMetadataField {
  typeName: string
  value: string
}
