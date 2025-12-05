/**
 * Minimal File Repository Types
 *
 * These types define the minimal interface needed by the file uploader components.
 * This allows the uploader to work with both the full FileRepository (SPA mode)
 * and a partial implementation (standalone mode).
 */

import { FileRepository } from '@/files/domain/repositories/FileRepository'

/**
 * Minimal file repository interface needed by the uploader components.
 * Standalone mode only implements these methods.
 */
export type UploaderFileRepository = Pick<
  FileRepository,
  'uploadFile' | 'addUploadedFiles' | 'getFixityAlgorithm'
>

/**
 * Extended file repository interface that includes replace functionality.
 * Used by components that support file replacement (SPA mode only).
 */
export type FullUploaderFileRepository = UploaderFileRepository & Pick<FileRepository, 'replace'>
