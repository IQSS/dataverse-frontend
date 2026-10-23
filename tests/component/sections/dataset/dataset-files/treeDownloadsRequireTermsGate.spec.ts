import {
  DatasetPublishingStatus,
  defaultLicense
} from '../../../../../src/dataset/domain/models/Dataset'
import { treeDownloadsRequireTermsGate } from '../../../../../src/sections/dataset/dataset-files/treeDownloadsRequireTermsGate'

type GateInput = Parameters<typeof treeDownloadsRequireTermsGate>[0]

const baseDataset = {
  version: { publishingStatus: DatasetPublishingStatus.RELEASED },
  permissions: { canUpdateDataset: false },
  guestbookId: undefined,
  license: defaultLicense,
  termsOfUse: undefined
} as unknown as NonNullable<GateInput>

describe('treeDownloadsRequireTermsGate', () => {
  it('returns false when the dataset is missing', () => {
    expect(treeDownloadsRequireTermsGate(undefined)).to.equal(false)
    expect(treeDownloadsRequireTermsGate(null)).to.equal(false)
  })

  it('returns false on a draft version', () => {
    const ds = {
      ...baseDataset,
      version: { publishingStatus: DatasetPublishingStatus.DRAFT }
    } as unknown as NonNullable<GateInput>
    expect(treeDownloadsRequireTermsGate(ds)).to.equal(false)
  })

  it('returns false when the user can edit (no need to gate downloads)', () => {
    const ds = {
      ...baseDataset,
      permissions: { canUpdateDataset: true }
    } as unknown as NonNullable<GateInput>
    expect(treeDownloadsRequireTermsGate(ds)).to.equal(false)
  })

  it('returns false on a released, non-editable dataset with default license, no guestbook, no custom terms', () => {
    expect(treeDownloadsRequireTermsGate(baseDataset)).to.equal(false)
  })

  it('returns true when the dataset has a guestbook', () => {
    const ds = { ...baseDataset, guestbookId: 7 } as unknown as NonNullable<GateInput>
    expect(treeDownloadsRequireTermsGate(ds)).to.equal(true)
  })

  it('returns true when the dataset has a non-default license', () => {
    const ds = {
      ...baseDataset,
      license: { ...defaultLicense, name: 'CC BY 4.0' }
    } as unknown as NonNullable<GateInput>
    expect(treeDownloadsRequireTermsGate(ds)).to.equal(true)
  })

  it('returns true when the dataset has custom terms', () => {
    const ds = {
      ...baseDataset,
      termsOfUse: { customTerms: { value: 'Be excellent', startDate: undefined } }
    } as unknown as NonNullable<GateInput>
    expect(treeDownloadsRequireTermsGate(ds)).to.equal(true)
  })

  it('returns false when license is undefined and no guestbook / custom terms', () => {
    const ds = {
      ...baseDataset,
      license: undefined
    } as unknown as NonNullable<GateInput>
    expect(treeDownloadsRequireTermsGate(ds)).to.equal(false)
  })
})
