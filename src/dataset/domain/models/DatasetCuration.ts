export interface DatasetCurationStatus {
  label?: string
  createTime?: string
  assigner?: string
  assignerDisplayName?: string
}

export interface DatasetReviewSubmission {
  inReview: boolean
  message: string
}
