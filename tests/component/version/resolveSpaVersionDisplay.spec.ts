import { resolveSpaVersionDisplay } from '@/version/resolveSpaVersionDisplay'

describe('resolveSpaVersionDisplay', () => {
  it('returns the package version when the current ref is an official release tag', () => {
    expect(
      resolveSpaVersionDisplay({
        packageVersion: '3.5.0',
        commitSha: 'abc123def',
        refName: 'v3.5.0',
        refType: 'tag'
      })
    ).to.equal('3.5.0')
  })

  it('returns the commit sha when the current build is not an official release', () => {
    expect(
      resolveSpaVersionDisplay({
        packageVersion: '3.5.0',
        commitSha: 'abc123def',
        exactTag: 'v3.4.9',
        refName: 'develop',
        refType: 'branch'
      })
    ).to.equal('abc123def')
  })
})
