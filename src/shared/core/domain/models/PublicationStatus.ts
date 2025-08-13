export enum PublicationStatus {
  Published = 'Published',
  Unpublished = 'Unpublished',
  Draft = 'Draft',
  Deaccessioned = 'Deaccessioned',
  InReview = 'In Review'
}

export const AllPublicationStatuses: PublicationStatus[] = [
  PublicationStatus.Published,
  PublicationStatus.Unpublished,
  PublicationStatus.Draft,
  PublicationStatus.Deaccessioned,
  PublicationStatus.InReview
]
