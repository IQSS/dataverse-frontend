/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_VERSION?: string
  readonly VITE_COMMIT_SHA_SHORT?: string
  readonly VITE_GIT_EXACT_TAG?: string
  readonly VITE_GITHUB_REF_NAME?: string
  readonly VITE_GITHUB_REF_TYPE?: string
  readonly VITE_SPA_DISPLAY_VERSION?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
