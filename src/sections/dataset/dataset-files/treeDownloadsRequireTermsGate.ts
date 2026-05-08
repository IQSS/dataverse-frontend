import {
  Dataset,
  DatasetPublishingStatus,
  defaultLicense
} from '../../../dataset/domain/models/Dataset'

/**
 * True when the tree-view download paths must be gated behind a terms /
 * guestbook / non-default-license acknowledgement that the table view
 * already prompts for via its own modal. The tree's streaming-zip flow
 * does not yet wire that modal in — until it does, callers should
 * disable downloads when this returns true.
 *
 * Returns false on:
 *   - missing dataset (mount-time / loading)
 *   - draft versions (only owners can read draft files)
 *   - users with edit permission (they accept terms by virtue of editing)
 *
 * Otherwise: true if any of guestbook / non-default license / custom
 * terms are present on the version.
 */
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
