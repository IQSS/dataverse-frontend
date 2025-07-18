export {}

declare global {
  // This interface extends the Window object to include custom properties we set in the Vite config.
  interface Window {
    __DATAVERSE_FRONTEND_VERSION__: string | undefined
    __DATAVERSE_CLIENT_JAVASCRIPT_VERSION__: string | undefined
  }
}
