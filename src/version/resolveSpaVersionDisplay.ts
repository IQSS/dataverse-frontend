export interface SpaVersionBuildInfo {
  packageVersion?: string
  commitSha?: string
  exactTag?: string
  refName?: string
  refType?: string
}

function normalizeTag(tag?: string): string | undefined {
  if (!tag) {
    return undefined
  }

  return tag.replace(/^refs\/tags\//, '').replace(/^v/, '')
}

export function resolveSpaVersionDisplay({
  packageVersion,
  commitSha,
  exactTag,
  refName,
  refType
}: SpaVersionBuildInfo): string {
  const releaseTag = refType === 'tag' ? refName : exactTag

  if (packageVersion && normalizeTag(releaseTag) === packageVersion) {
    return packageVersion
  }

  if (commitSha) {
    return commitSha
  }

  return packageVersion ?? 'unknown'
}
