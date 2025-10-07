export interface FileExternalToolResolved {
  toolUrlResolved: string // The URL to access the external tool. The URL includes necessary authentication tokens and parameters based on the user's permissions and the tool's configuration.
  displayName: string
  fileId: number
  preview: boolean
}
