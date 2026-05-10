import {
  formatBytes,
  formatCount,
  formatFileAccess,
  formatFolderAccess
} from '../../../../../../src/sections/dataset/dataset-files/files-tree/format'

describe('formatBytes', () => {
  it('returns empty string for undefined / null / NaN', () => {
    expect(formatBytes(undefined)).to.equal('')
    expect(formatBytes(null as unknown as number)).to.equal('')
    expect(formatBytes(Number.NaN)).to.equal('')
  })

  it('formats bytes below 1KiB as B', () => {
    expect(formatBytes(0)).to.equal('0 B')
    expect(formatBytes(512)).to.equal('512 B')
    expect(formatBytes(1023)).to.equal('1023 B')
  })

  it('formats KB / MB / GB ranges', () => {
    expect(formatBytes(1024)).to.equal('1.0 KB')
    expect(formatBytes(1024 * 1024)).to.equal('1.0 MB')
    expect(formatBytes(1024 * 1024 * 1024)).to.equal('1.00 GB')
    expect(formatBytes(5 * 1024 * 1024 * 1024)).to.equal('5.00 GB')
  })
})

describe('formatCount', () => {
  it('returns empty string for undefined / null / NaN', () => {
    expect(formatCount(undefined)).to.equal('')
    expect(formatCount(null as unknown as number)).to.equal('')
    expect(formatCount(Number.NaN)).to.equal('')
  })

  it('formats counts < 1000 verbatim', () => {
    expect(formatCount(0)).to.equal('0')
    expect(formatCount(42)).to.equal('42')
    expect(formatCount(999)).to.equal('999')
  })

  it('formats counts >= 1000 with k suffix', () => {
    expect(formatCount(1000)).to.equal('1.0k')
    expect(formatCount(1500)).to.equal('1.5k')
    expect(formatCount(12345)).to.equal('12.3k')
  })
})

describe('formatFileAccess', () => {
  it('returns empty string for undefined access (older server / SDK)', () => {
    expect(formatFileAccess(undefined)).to.equal('')
  })

  it('capitalises each access bucket', () => {
    expect(formatFileAccess('public')).to.equal('Public')
    expect(formatFileAccess('restricted')).to.equal('Restricted')
    expect(formatFileAccess('embargoed')).to.equal('Embargoed')
  })
})

describe('formatFolderAccess', () => {
  it('returns empty string when counts are absent', () => {
    expect(formatFolderAccess(undefined)).to.equal('')
  })

  it('returns empty string when subtree is all public (default case is silent)', () => {
    expect(formatFolderAccess({ restricted: 0, embargoed: 0 })).to.equal('')
    // Both fields are individually optional — undefined coerces to 0.
    expect(formatFolderAccess({})).to.equal('')
  })

  it('reports a restricted-only subtree with the exact count', () => {
    expect(formatFolderAccess({ restricted: 3, embargoed: 0 })).to.equal('3 restricted')
    expect(formatFolderAccess({ restricted: 1 })).to.equal('1 restricted')
  })

  it('reports an embargoed-only subtree with the exact count', () => {
    expect(formatFolderAccess({ restricted: 0, embargoed: 1 })).to.equal('1 embargoed')
    expect(formatFolderAccess({ embargoed: 4 })).to.equal('4 embargoed')
  })

  it('combines counts when the subtree mixes restricted and embargoed', () => {
    expect(formatFolderAccess({ restricted: 3, embargoed: 1 })).to.equal(
      '3 restricted · 1 embargoed'
    )
  })
})
