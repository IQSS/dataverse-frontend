import { existsSync, readFileSync } from 'node:fs'
import * as path from 'node:path'

export function getNodeEnv() {
  return globalThis.process?.env
}

function normalizeTag(tag) {
  if (!tag) {
    return undefined
  }

  return tag.replace(/^refs\/tags\//, '').replace(/^v/, '')
}

function resolveSpaVersionDisplay({ packageVersion, commitSha, exactTag, refName, refType }) {
  const releaseTag = refType === 'tag' ? refName : exactTag

  if (packageVersion && normalizeTag(releaseTag) === packageVersion) {
    return packageVersion
  }

  if (commitSha) {
    return commitSha
  }

  return packageVersion ?? 'unknown'
}

function readTextFile(filePath) {
  try {
    return readFileSync(filePath, 'utf8').trim() || undefined
  } catch {
    return undefined
  }
}

export function resolveProjectRoot(configDir) {
  const candidates = [configDir, path.resolve(configDir, '..'), path.resolve(configDir, '../..')]

  const projectRoot = candidates.find((candidate) => {
    return (
      existsSync(path.join(candidate, 'package.json')) && existsSync(path.join(candidate, '.git'))
    )
  })

  return projectRoot ?? configDir
}

function readPackageVersion(projectRoot) {
  try {
    const packageJson = JSON.parse(readFileSync(path.join(projectRoot, 'package.json'), 'utf8'))

    return packageJson.version
  } catch {
    return undefined
  }
}

function resolveGitDir(projectRoot) {
  const dotGitPath = path.join(projectRoot, '.git')

  if (!existsSync(dotGitPath)) {
    return undefined
  }

  const dotGitContent = readTextFile(dotGitPath)

  if (dotGitContent?.startsWith('gitdir: ')) {
    return path.resolve(projectRoot, dotGitContent.slice('gitdir: '.length))
  }

  return dotGitPath
}

function readPackedRef(gitDir, ref) {
  const packedRefs = readTextFile(path.join(gitDir, 'packed-refs'))

  if (!packedRefs) {
    return undefined
  }

  for (const line of packedRefs.split('\n')) {
    if (!line || line.startsWith('#') || line.startsWith('^')) {
      continue
    }

    const [sha, packedRef] = line.split(' ')
    if (packedRef === ref) {
      return sha
    }
  }

  return undefined
}

function readGitHeadInfo(projectRoot) {
  const gitDir = resolveGitDir(projectRoot)

  if (!gitDir) {
    return {}
  }

  const head = readTextFile(path.join(gitDir, 'HEAD'))

  if (!head) {
    return {}
  }

  if (!head.startsWith('ref: ')) {
    return { commitSha: head.slice(0, 9) }
  }

  const ref = head.slice('ref: '.length)
  const commitSha = readTextFile(path.join(gitDir, ref)) ?? readPackedRef(gitDir, ref)
  const exactTag = ref.startsWith('refs/tags/') ? ref.replace('refs/tags/', '') : undefined

  return {
    commitSha: commitSha?.slice(0, 9),
    exactTag
  }
}

export function createSpaVersionDefines(projectRoot, nodeEnv = getNodeEnv()) {
  const packageVersion = readPackageVersion(projectRoot)
  const gitHeadInfo = readGitHeadInfo(projectRoot)
  const shortCommitSha = nodeEnv?.GITHUB_SHA?.slice(0, 9) ?? gitHeadInfo.commitSha
  const exactTag =
    (nodeEnv?.GITHUB_REF_TYPE === 'tag' ? nodeEnv.GITHUB_REF_NAME : undefined) ??
    gitHeadInfo.exactTag
  const spaDisplayVersion = resolveSpaVersionDisplay({
    packageVersion,
    commitSha: shortCommitSha,
    exactTag,
    refName: nodeEnv?.GITHUB_REF_NAME,
    refType: nodeEnv?.GITHUB_REF_TYPE
  })

  return {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(packageVersion),
    'import.meta.env.VITE_COMMIT_SHA_SHORT': JSON.stringify(shortCommitSha),
    'import.meta.env.VITE_GIT_EXACT_TAG': JSON.stringify(exactTag),
    'import.meta.env.VITE_GITHUB_REF_NAME': JSON.stringify(nodeEnv?.GITHUB_REF_NAME),
    'import.meta.env.VITE_GITHUB_REF_TYPE': JSON.stringify(nodeEnv?.GITHUB_REF_TYPE),
    'import.meta.env.VITE_SPA_DISPLAY_VERSION': JSON.stringify(spaDisplayVersion)
  }
}
