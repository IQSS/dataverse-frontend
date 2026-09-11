import {
  ZIP_SIZE_CAPS,
  checkZipSelectionSize,
  detectPlatform,
  zipSizeCap
} from '../../../../../../src/sections/dataset/dataset-files/files-tree/zipDownloadLimits'

const GB = 1024 * 1024 * 1024

const probe = (over: {
  userAgent?: string
  maxTouchPoints?: number
  userAgentData?: { mobile?: boolean; platform?: string }
}) => ({
  userAgent: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/152.0.0.0',
  maxTouchPoints: 0,
  ...over
})

describe('detectPlatform', () => {
  it('trusts userAgentData over the user agent string', () => {
    expect(
      detectPlatform(
        probe({
          userAgent: 'Mozilla/5.0 (X11; Linux x86_64) Chrome/152.0.0.0',
          userAgentData: { mobile: true, platform: 'Android' }
        })
      )
    ).to.equal('android')
  })

  it('reads an iPhone from the user agent', () => {
    expect(
      detectPlatform(
        probe({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_2) Safari/605.1.15' })
      )
    ).to.equal('ios')
  })

  it('reads an iPad that still says iPad', () => {
    expect(
      detectPlatform(probe({ userAgent: 'Mozilla/5.0 (iPad; CPU OS 18_2) Safari/605.1.15' }))
    ).to.equal('ios')
  })

  it('treats a Mac reporting touch points as an iPad', () => {
    expect(
      detectPlatform(
        probe({
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
          maxTouchPoints: 5
        })
      )
    ).to.equal('ios')
  })

  it('leaves a real Mac as desktop', () => {
    expect(
      detectPlatform(
        probe({
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
          maxTouchPoints: 0
        })
      )
    ).to.equal('desktop')
  })

  it('reads Android from the user agent when userAgentData is missing', () => {
    expect(
      detectPlatform(probe({ userAgent: 'Mozilla/5.0 (Linux; Android 15) Chrome/152.0.0.0' }))
    ).to.equal('android')
  })

  it('falls back to desktop', () => {
    expect(detectPlatform(probe({}))).to.equal('desktop')
  })
})

describe('zipSizeCap', () => {
  it('does not cap a desktop browser that can stream', () => {
    expect(zipSizeCap('desktop', true)).to.equal(null)
  })

  it('caps a desktop browser that has to buffer', () => {
    expect(zipSizeCap('desktop', false)).to.equal(ZIP_SIZE_CAPS.bufferedDesktop)
  })

  it('caps iOS at 1 GB even when it can stream', () => {
    expect(zipSizeCap('ios', true)).to.equal(1 * GB)
  })

  it('caps Android at 2 GB even when it can stream', () => {
    expect(zipSizeCap('android', true)).to.equal(2 * GB)
  })
})

describe('checkZipSelectionSize', () => {
  it('allows a selection under the cap', () => {
    const out = checkZipSelectionSize({
      bytes: 500 * 1024 * 1024,
      platform: 'ios',
      streaming: true
    })
    expect(out.allowed).to.equal(true)
    expect(out.message).to.equal(undefined)
  })

  it('allows any size on a desktop browser that streams', () => {
    const out = checkZipSelectionSize({ bytes: 900 * GB, platform: 'desktop', streaming: true })
    expect(out.allowed).to.equal(true)
  })

  it('refuses an over-cap selection on mobile without naming other browsers', () => {
    const out = checkZipSelectionSize({ bytes: 4 * GB, platform: 'ios', streaming: true })
    expect(out.allowed).to.equal(false)
    expect(out.capBytes).to.equal(1 * GB)
    expect(out.message).to.contain('Large downloads need a computer')
    expect(out.message).to.not.contain('Chrome')
  })

  it('refuses an over-cap selection on a browser that cannot stream and names the alternatives', () => {
    const out = checkZipSelectionSize({
      bytes: 4 * GB,
      platform: 'desktop',
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
      platform: 'desktop',
      streaming: false,
      browserCanStream: true
    })
    expect(out.allowed).to.equal(false)
    expect(out.message).to.not.contain('Chrome, Edge, Firefox or Opera')
    expect(out.message).to.contain('this page')
  })
})
