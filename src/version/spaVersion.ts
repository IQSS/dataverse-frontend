import { resolveSpaVersionDisplay } from './resolveSpaVersionDisplay'

export const spaVersion =
  import.meta.env.VITE_SPA_DISPLAY_VERSION ??
  resolveSpaVersionDisplay({
    packageVersion: import.meta.env.VITE_APP_VERSION,
    commitSha: import.meta.env.VITE_COMMIT_SHA_SHORT,
    exactTag: import.meta.env.VITE_GIT_EXACT_TAG,
    refName: import.meta.env.VITE_GITHUB_REF_NAME,
    refType: import.meta.env.VITE_GITHUB_REF_TYPE
  })
