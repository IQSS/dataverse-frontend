import {
  Dataset,
  DatasetPublishingStatus,
  defaultLicense
} from '../../../dataset/domain/models/Dataset'

export function treeDownloadsRequireTermsGate(
  dataset:
    | Pick<Dataset, 'version' | 'permissions' | 'guestbookId' | 'license' | 'termsOfUse'>
    | undefined
    | null
): boolean {
  if (!dataset) return false
  const isDraft = dataset.version.publishingStatus === DatasetPublishingStatus.DRAFT
  const canEdit = dataset.permissions.canUpdateDataset
  if (isDraft || canEdit) return false
  const hasGuestbook = dataset.guestbookId !== undefined
  const hasNonDefaultLicense =
    dataset.license !== undefined && dataset.license.name !== defaultLicense.name
  const hasCustomTerms = dataset.termsOfUse?.customTerms !== undefined
  return hasGuestbook || hasNonDefaultLicense || hasCustomTerms
}
