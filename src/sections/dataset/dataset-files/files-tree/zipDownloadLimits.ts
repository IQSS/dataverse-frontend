import { formatBytes } from './format'

const GB = 1024 * 1024 * 1024

export const BUFFERED_ZIP_SIZE_CAP = 2 * GB

export function zipSizeCap(streaming: boolean): number | null {
  return streaming ? null : BUFFERED_ZIP_SIZE_CAP
}

export function checkZipSelectionSize(args: {
  bytes: number
  streaming: boolean
  browserCanStream?: boolean
}): { allowed: boolean; capBytes: number | null; message?: string } {
  const capBytes = zipSizeCap(args.streaming)
  if (capBytes === null || args.bytes <= capBytes) return { allowed: true, capBytes }
  const size = formatBytes(args.bytes)
  const cap = formatBytes(capBytes)
  const message = args.browserCanStream
    ? `This download is too large for this page. It can only save zips up to ${cap} here, and your selection is ${size}. Download smaller selections, or download files individually.`
    : `This download is too large for this browser. Your browser can only save zips up to ${cap} from this page, and your selection is ${size}. You can download it in Chrome, Edge, Firefox or Opera, download smaller selections, or download files individually.`
  return { allowed: false, capBytes, message }
}
