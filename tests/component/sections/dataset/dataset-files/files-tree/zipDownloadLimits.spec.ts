import {
  BUFFERED_ZIP_SIZE_CAP,
  checkZipSelectionSize,
  zipSizeCap
} from '../../../../../../src/sections/dataset/dataset-files/files-tree/zipDownloadLimits'

const GB = 1024 * 1024 * 1024

describe('zipSizeCap', () => {
  it('does not cap a browser that streams to disk', () => {
    expect(zipSizeCap(true)).to.equal(null)
  })

  it('caps a browser that has to buffer the archive', () => {
    expect(zipSizeCap(false)).to.equal(BUFFERED_ZIP_SIZE_CAP)
    expect(BUFFERED_ZIP_SIZE_CAP).to.equal(2 * GB)
  })
})

describe('checkZipSelectionSize', () => {
  it('allows a selection under the cap', () => {
    const out = checkZipSelectionSize({ bytes: 500 * 1024 * 1024, streaming: false })
    expect(out.allowed).to.equal(true)
    expect(out.message).to.equal(undefined)
  })

  it('allows any size once the browser can stream, whatever the device', () => {
    const out = checkZipSelectionSize({ bytes: 900 * GB, streaming: true })
    expect(out.allowed).to.equal(true)
    expect(out.capBytes).to.equal(null)
  })

  it('refuses an over-cap selection on a browser that cannot stream and names the alternatives', () => {
    const out = checkZipSelectionSize({
      bytes: 4 * GB,
      streaming: false,
      browserCanStream: false
    })
    expect(out.allowed).to.equal(false)
    expect(out.capBytes).to.equal(2 * GB)
    expect(out.message).to.contain('too large for this browser')
    expect(out.message).to.contain('Chrome, Edge, Firefox or Opera')
  })

  it('does not tell a capable browser to switch browsers when the page cannot stream', () => {
    const out = checkZipSelectionSize({
      bytes: 4 * GB,
      streaming: false,
      browserCanStream: true
    })
    expect(out.allowed).to.equal(false)
    expect(out.message).to.not.contain('Chrome, Edge, Firefox or Opera')
    expect(out.message).to.contain('this page')
  })
})
