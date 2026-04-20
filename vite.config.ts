import { readFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import istanbul from 'vite-plugin-istanbul'
import { keycloakify } from 'keycloakify/vite-plugin'
import * as path from 'path'
import { resolveSpaVersionDisplay } from './src/version/resolveSpaVersionDisplay'

function readTextFile(filePath: string): string | undefined {
  try {
    return readFileSync(filePath, 'utf8').trim() || undefined
  } catch {
    return undefined
  }
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

const projectRoot = path.resolve(__dirname)
const packageVersion = readPackageVersion(projectRoot)
const gitHeadInfo = readGitHeadInfo(projectRoot)
const shortCommitSha = process.env.GITHUB_SHA?.slice(0, 9) ?? gitHeadInfo.commitSha
const exactTag =
  (process.env.GITHUB_REF_TYPE === 'tag' ? process.env.GITHUB_REF_NAME : undefined) ??
  gitHeadInfo.exactTag
const spaDisplayVersion = resolveSpaVersionDisplay({
  packageVersion,
  commitSha: shortCommitSha,
  exactTag,
  refName: process.env.GITHUB_REF_NAME,
  refType: process.env.GITHUB_REF_TYPE
})

export default defineConfig({
  base: '/modern',
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(packageVersion),
    'import.meta.env.VITE_COMMIT_SHA_SHORT': JSON.stringify(shortCommitSha),
    'import.meta.env.VITE_GIT_EXACT_TAG': JSON.stringify(exactTag),
    'import.meta.env.VITE_GITHUB_REF_NAME': JSON.stringify(process.env.GITHUB_REF_NAME),
    'import.meta.env.VITE_GITHUB_REF_TYPE': JSON.stringify(process.env.GITHUB_REF_TYPE),
    'import.meta.env.VITE_SPA_DISPLAY_VERSION': JSON.stringify(spaDisplayVersion)
  },
  plugins: [
    react(),
    istanbul({
      cypress: true,
      requireEnv: false
    }),
    keycloakify({
      themeName: 'dataverse-spa',
      keycloakifyBuildDirPath: './dist_keycloak',
      accountThemeImplementation: 'none',
      keycloakVersionTargets: {
        '22-to-25': false,
        'all-other-versions': 'dv-spa-kc-theme.jar'
      }
    })
  ],
  preview: {
    port: 5173
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@tests': path.resolve(__dirname, 'tests')
    }
  }
})
