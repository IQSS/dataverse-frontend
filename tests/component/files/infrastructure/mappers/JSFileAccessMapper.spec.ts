import chai from 'chai'
import { JSFileAccessMapper } from '../../../../../src/files/infrastructure/mappers/JSFileAccessMapper'

const expect = chai.expect

describe('JSFileAccessMapper', () => {
  it('maps file access when request has already been submitted', () => {
    const fileAccess = JSFileAccessMapper.toFileAccess(true, true, true)
    expect(fileAccess).to.deep.equal({
      restricted: true,
      latestVersionRestricted: false,
      canBeRequested: true,
      requested: true
    })
  })

  it('maps file access when request has not been submitted', () => {
    const fileAccess = JSFileAccessMapper.toFileAccess(true, true, false)
    expect(fileAccess).to.deep.equal({
      restricted: true,
      latestVersionRestricted: false,
      canBeRequested: true,
      requested: false
    })
  })

  it('maps file access for a restricted file with access request allowed', () => {
    const fileAccess = JSFileAccessMapper.toFileAccess(true, true)
    expect(fileAccess).to.deep.equal({
      restricted: true,
      latestVersionRestricted: false,
      canBeRequested: true,
      requested: false
    })
  })

  it('maps file access for a non-restricted file', () => {
    const fileAccess = JSFileAccessMapper.toFileAccess(false, false, false)
    expect(fileAccess).to.deep.equal({
      restricted: false,
      latestVersionRestricted: false,
      canBeRequested: false,
      requested: false
    })
  })
})
