/**
 * Enum indicating where the user came from when replacing a file.
 * Extracted to its own file to avoid circular import issues.
 */
export enum ReplaceFileReferrer {
  DATASET = 'dataset',
  FILE = 'file'
}
