import type { Root } from 'react-dom/client'
interface MountInShadowRootArgs {
  rootElementId: string
}

interface ShadowMountResult {
  reactRoot: HTMLDivElement
  shadowRoot: ShadowRoot
}

declare global {
  interface Window {
    __dvPendingStyles?: string[]
    __dvShadowRoot?: Record<string, ShadowRoot>
  }
}

export function mountInShadowRoot({ rootElementId }: MountInShadowRootArgs): ShadowMountResult {
  const host = document.getElementById(rootElementId)
  if (!host) {
    throw new Error(`[shadow-mount] No element with id="${rootElementId}" found in the host page.`)
  }

  let shadowRoot = host.shadowRoot
  if (!shadowRoot) {
    shadowRoot = host.attachShadow({ mode: 'open' })
  } else {
    while (shadowRoot.firstChild) {
      shadowRoot.removeChild(shadowRoot.firstChild)
    }
  }

  const pending: string[] = window.__dvPendingStyles ?? []
  for (const cssText of pending) {
    const style = document.createElement('style')
    style.textContent = cssText
    shadowRoot.appendChild(style)
  }

  const reactRoot = document.createElement('div')
  reactRoot.className = 'dv-reusable-root'
  shadowRoot.appendChild(reactRoot)

  window.__dvShadowRoot = window.__dvShadowRoot ?? {}
  window.__dvShadowRoot[rootElementId] = shadowRoot

  return { reactRoot, shadowRoot }
}

export function unmountQuietly(root: Root): void {
  try {
    root.unmount()
  } catch {
    return
  }
}
