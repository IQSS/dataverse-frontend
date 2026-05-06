import {
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
