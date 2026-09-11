import { formatBytes } from './format'

const GB = 1024 * 1024 * 1024

export const ZIP_SIZE_CAPS = {
  ios: 1 * GB,
  android: 2 * GB,
  bufferedDesktop: 2 * GB
} as const

export type DownloadPlatform = 'ios' | 'android' | 'desktop'

export interface PlatformProbe {
  userAgent: string
  maxTouchPoints: number
  userAgentData?: { mobile?: boolean; platform?: string }
}

function currentProbe(): PlatformProbe {
  const nav = navigator as Navigator & {
    userAgentData?: { mobile?: boolean; platform?: string }
  }
  return {
    userAgent: nav.userAgent,
    maxTouchPoints: nav.maxTouchPoints,
    userAgentData: nav.userAgentData
  }
}

export function detectPlatform(probe: PlatformProbe = currentProbe()): DownloadPlatform {
  const data = probe.userAgentData
  if (data?.mobile) {
    return /iphone|ipad|ipod|ios/i.test(data.platform ?? '') ? 'ios' : 'android'
  }
  if (/iPhone|iPad|iPod/.test(probe.userAgent)) return 'ios'
  if (/Android/.test(probe.userAgent)) return 'android'
  if (/Mac/.test(probe.userAgent) && probe.maxTouchPoints > 1) return 'ios'
  return 'desktop'
}

export function zipSizeCap(platform: DownloadPlatform, streaming: boolean): number | null {
  if (platform === 'ios') return ZIP_SIZE_CAPS.ios
  if (platform === 'android') return ZIP_SIZE_CAPS.android
  return streaming ? null : ZIP_SIZE_CAPS.bufferedDesktop
}

export function checkZipSelectionSize(args: {
  bytes: number
  platform: DownloadPlatform
  streaming: boolean
}): { allowed: boolean; capBytes: number | null; message?: string } {
  const capBytes = zipSizeCap(args.platform, args.streaming)
  if (capBytes === null || args.bytes <= capBytes) return { allowed: true, capBytes }
  const size = formatBytes(args.bytes)
  const cap = formatBytes(capBytes)
  const message =
    args.platform === 'desktop'
      ? `This download is too large for this browser. Your browser can only save zips up to ${cap} from this page, and your selection is ${size}. You can download it in Chrome, Edge, Firefox or Opera, download smaller selections, or download files individually.`
      : `Large downloads need a computer. Your selection is ${size}; the limit on this device is ${cap}. Select fewer files or download them individually.`
  return { allowed: false, capBytes, message }
}
