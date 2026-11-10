import {
  fileAccessVariant,
  folderAccessParts,
  folderAccessVariant,
  formatBytes,
  formatCount
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

  it('matches the files-table FileSize ladder for KB / MB / GB / TB', () => {
    expect(formatBytes(1024)).to.equal('1 KB')
    expect(formatBytes(1536)).to.equal('1.5 KB')
    expect(formatBytes(1024 * 1024)).to.equal('1 MB')
    expect(formatBytes(5 * 1024 * 1024 * 1024)).to.equal('5 GB')
    // The previous hand-rolled formatter capped at GB and would have
    // shown this as "2048.00 GB" while the files table said "2 TB".
    expect(formatBytes(2 * 1024 ** 4)).to.equal('2 TB')
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

describe('fileAccessVariant', () => {
  it('returns undefined for public and unknown access (no colour cue)', () => {
    expect(fileAccessVariant(undefined)).to.equal(undefined)
    expect(fileAccessVariant('public')).to.equal(undefined)
  })

  it('returns each non-public state as its own variant', () => {
    expect(fileAccessVariant('restricted')).to.equal('restricted')
    expect(fileAccessVariant('embargoed')).to.equal('embargoed')
    expect(fileAccessVariant('retentionExpired')).to.equal('retentionExpired')
  })
})

describe('folderAccessVariant', () => {
  it('returns undefined when the subtree is all public or counts are absent', () => {
    expect(folderAccessVariant(undefined)).to.equal(undefined)
    expect(folderAccessVariant({})).to.equal(undefined)
    expect(folderAccessVariant({ restricted: 0, embargoed: 0, retentionExpired: 0 })).to.equal(
      undefined
    )
  })

  it('follows the server resolution order: retentionExpired > restricted > embargoed', () => {
    expect(folderAccessVariant({ restricted: 1, embargoed: 2, retentionExpired: 3 })).to.equal(
      'retentionExpired'
    )
    expect(folderAccessVariant({ restricted: 1, embargoed: 2 })).to.equal('restricted')
    expect(folderAccessVariant({ embargoed: 2 })).to.equal('embargoed')
  })
})

describe('folderAccessParts', () => {
  it('returns no parts when counts are absent or all zero', () => {
    expect(folderAccessParts(undefined)).to.deep.equal([])
    expect(folderAccessParts({})).to.deep.equal([])
    expect(folderAccessParts({ restricted: 0, embargoed: 0 })).to.deep.equal([])
  })

  it('lists each non-empty bucket with its count, in display order', () => {
    expect(folderAccessParts({ restricted: 3 })).to.deep.equal([{ key: 'restricted', count: 3 }])
    expect(folderAccessParts({ embargoed: 4 })).to.deep.equal([{ key: 'embargoed', count: 4 }])
    expect(folderAccessParts({ retentionExpired: 2 })).to.deep.equal([
      { key: 'retentionExpired', count: 2 }
    ])
    expect(folderAccessParts({ restricted: 3, embargoed: 1, retentionExpired: 2 })).to.deep.equal([
      { key: 'restricted', count: 3 },
      { key: 'embargoed', count: 1 },
      { key: 'retentionExpired', count: 2 }
    ])
  })
})
