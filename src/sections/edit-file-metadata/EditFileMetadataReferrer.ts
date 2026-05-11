/**
 * Enum indicating where the user came from when editing file metadata.
 * Extracted to its own file to avoid circular import issues.
 */
export enum EditFileMetadataReferrer {
  DATASET = 'dataset',
  FILE = 'file'
}
