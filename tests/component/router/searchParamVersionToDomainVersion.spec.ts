import { searchParamVersionToDomainVersion } from '@/router'
import { DatasetNonNumericVersion } from '@/dataset/domain/models/Dataset'

describe('searchParamVersionToDomainVersion', () => {
  it('returns undefined when version is undefined', () => {
    expect(searchParamVersionToDomainVersion(undefined)).to.be.undefined
  })

  it('normalizes DRAFT to DatasetNonNumericVersion.DRAFT', () => {
    expect(searchParamVersionToDomainVersion('DRAFT')).to.equal(
      DatasetNonNumericVersion.DRAFT.toString()
    )
  })

  it('normalizes lowercase draft to DatasetNonNumericVersion.DRAFT', () => {
    expect(searchParamVersionToDomainVersion('draft')).to.equal(
      DatasetNonNumericVersion.DRAFT.toString()
    )
  })

  it('normalizes mixed case Draft to DatasetNonNumericVersion.DRAFT', () => {
    expect(searchParamVersionToDomainVersion('Draft')).to.equal(
      DatasetNonNumericVersion.DRAFT.toString()
    )
  })

  it('normalizes version with leading colon :draft to DatasetNonNumericVersion.DRAFT', () => {
    expect(searchParamVersionToDomainVersion(':draft')).to.equal(
      DatasetNonNumericVersion.DRAFT.toString()
    )
    expect(searchParamVersionToDomainVersion(':DRAFT')).to.equal(
      DatasetNonNumericVersion.DRAFT.toString()
    )
  })

  it('returns numeric version as is', () => {
    expect(searchParamVersionToDomainVersion('1.0')).to.equal('1.0')
    expect(searchParamVersionToDomainVersion('2.1')).to.equal('2.1')
  })
})
