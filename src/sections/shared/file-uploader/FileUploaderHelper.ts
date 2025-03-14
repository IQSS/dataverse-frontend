import { FixityAlgorithm } from '@/files/domain/models/FixityAlgorithm'
import { md5 } from 'js-md5'

export class FileUploaderHelper {
  public static getFileKey = (file: File): string => file.webkitRelativePath || file.name

  public static isDS_StoreFile = (file: File): boolean => file.name === '.DS_Store'

  public static sanitizeFileName(fileName: string) {
    // Replace all invalid characters with underscore
    return fileName.replace(/[:<>;#/"*|?\\]/g, '_')
  }

  public static sanitizeFilePath(filePath: string) {
    // Replace all invalid characters with underscore
    return filePath.replace(/[^\w.\-\\/ ]/g, '_')
  }

  public static async getChecksum(blob: Blob, algorithm: FixityAlgorithm): Promise<string> {
    if (algorithm === FixityAlgorithm.MD5) {
      return await this.getMD5Checksum(blob)
    } else {
      return await this.getSubtleDigestChecksum(blob, algorithm)
    }
  }

  private static async getMD5Checksum(blob: Blob): Promise<string> {
    const chunkSize = 1024 * 1024 // 1MB chunks
    const totalSize = blob.size
    const md5Hash = md5.create()

    let offset = 0
    while (offset < totalSize) {
      const chunk = blob.slice(offset, offset + chunkSize)
      const buffer = await chunk.arrayBuffer()
      md5Hash.update(new Uint8Array(buffer))

      offset += chunkSize
    }

    return md5Hash.hex()
  }

  private static async getSubtleDigestChecksum(
    blob: Blob,
    algorithm: FixityAlgorithm.SHA1 | FixityAlgorithm.SHA256 | FixityAlgorithm.SHA512
  ): Promise<string> {
    const chunkSize = 1024 * 1024 // 1MB chunks
    const totalSize = blob.size
    const chunks: Uint8Array[] = []

    let offset = 0
    while (offset < totalSize) {
      const chunk = blob.slice(offset, offset + chunkSize)
      const buffer = await chunk.arrayBuffer()
      chunks.push(new Uint8Array(buffer))

      offset += chunkSize
    }

    const fullBuffer = this.concatUint8Arrays(chunks)
    const digest = await window.crypto.subtle.digest(algorithm, fullBuffer)
    return this.bufferToHex(new Uint8Array(digest))
  }

  private static concatUint8Arrays(chunks: Uint8Array[]): Uint8Array {
    const totalLength = chunks.reduce((sum, c) => sum + c.length, 0)
    const result = new Uint8Array(totalLength)
    let offset = 0
    for (const chunk of chunks) {
      result.set(chunk, offset)
      offset += chunk.length
    }
    return result
  }

  private static bufferToHex(buffer: Uint8Array): string {
    return Array.from(buffer)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }
}
