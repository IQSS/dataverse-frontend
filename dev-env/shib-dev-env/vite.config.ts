import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import istanbul from 'vite-plugin-istanbul'
import * as path from 'path'

const nodeEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
  ?.env

function readTextFile(filePath: string): string | undefined {
  try {
    return readFileSync(filePath, 'utf8').trim() || undefined
  } catch {
    return undefined
  }
}

function resolveSpaVersionDisplay({
  packageVersion,
  commitSha,
  exactTag,
  refName,
  refType
}: {
  packageVersion?: string
  commitSha?: string
  exactTag?: string
  refName?: string
  refType?: string
}): string {
  const releaseTag = refType === 'tag' ? refName : exactTag
  const normalizedReleaseTag = releaseTag?.replace(/^refs\/tags\//, '').replace(/^v/, '')

  if (packageVersion && normalizedReleaseTag === packageVersion) {
    return packageVersion
  }

  if (commitSha) {
    return commitSha
  }

  return packageVersion ?? 'unknown'
}

function resolveProjectRoot(configDir: string): string {
  const candidates = [configDir, path.resolve(configDir, '..'), path.resolve(configDir, '../..')]

  const projectRoot = candidates.find((candidate) => {
    return Boolean(readTextFile(path.join(candidate, 'package.json'))) && Boolean(readTextFile(path.join(candidate, '.git')))
  })

  return projectRoot ?? configDir
}

function readPackageVersion(projectRoot: string): string | undefined {
  try {
    const packageJson = JSON.parse(readFileSync(path.join(projectRoot, 'package.json'), 'utf8')) as {
      version?: string
    }

    return packageJson.version
  } catch {
    return undefined
  }
}

function resolveGitDir(projectRoot: string): string | undefined {
  const dotGitPath = path.join(projectRoot, '.git')
  const dotGitContent = readTextFile(dotGitPath)

  if (dotGitContent?.startsWith('gitdir: ')) {
    return path.resolve(projectRoot, dotGitContent.slice('gitdir: '.length))
  }

  return dotGitContent ? undefined : dotGitPath
}

function readPackedRef(gitDir: string, ref: string): string | undefined {
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

function readGitHeadInfo(projectRoot: string): { commitSha?: string; exactTag?: string } {
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

const projectRoot = resolveProjectRoot(__dirname)
const packageVersion = readPackageVersion(projectRoot)
const gitHeadInfo = readGitHeadInfo(projectRoot)
const shortCommitSha = nodeEnv?.GITHUB_SHA?.slice(0, 9) ?? gitHeadInfo.commitSha
const exactTag =
  (nodeEnv?.GITHUB_REF_TYPE === 'tag' ? nodeEnv.GITHUB_REF_NAME : undefined) ?? gitHeadInfo.exactTag
const spaDisplayVersion = resolveSpaVersionDisplay({
  packageVersion,
  commitSha: shortCommitSha,
  exactTag,
  refName: nodeEnv?.GITHUB_REF_NAME,
  refType: nodeEnv?.GITHUB_REF_TYPE
})

export default defineConfig({
  root: projectRoot,
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(packageVersion),
    'import.meta.env.VITE_COMMIT_SHA_SHORT': JSON.stringify(shortCommitSha),
    'import.meta.env.VITE_GIT_EXACT_TAG': JSON.stringify(exactTag),
    'import.meta.env.VITE_GITHUB_REF_NAME': JSON.stringify(nodeEnv?.GITHUB_REF_NAME),
    'import.meta.env.VITE_GITHUB_REF_TYPE': JSON.stringify(nodeEnv?.GITHUB_REF_TYPE),
    'import.meta.env.VITE_SPA_DISPLAY_VERSION': JSON.stringify(spaDisplayVersion)
  },
  plugins: [
    react(),
    istanbul({
      cypress: true,
      requireEnv: false
    })
  ],
  preview: {
    port: 5173
  },
  server: {
    //https://github.com/vitejs/vite/discussions/3396
    host: true,
    port: 5173,
    hmr: {
      clientPort: 443 // nginx reverse proxy port
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(projectRoot, 'src'),
      '@tests': path.resolve(projectRoot, 'tests')
    }
  }
})
