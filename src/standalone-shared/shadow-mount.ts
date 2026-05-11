/**
 * Shadow-DOM mounting helper for standalone reusable components.
 *
 * The host JSF / external page and the embedded React bundle both have
 * stylesheets we cannot modify. Without isolation:
 *
 *  - The bundle's Bootstrap-5 reset / design-system tokens leak into
 *    `<head>` and override the host page's own chrome.
 *  - The host's element-level rules (e.g. `input { display: inline-block }`
 *    from PrimeFaces or Bootstrap-3) cascade into the bundle and defeat
 *    the component's own styling — the canonical symptom is the
 *    `<input type="file" hidden>` controls being visible inside the
 *    React uploader.
 *
 * Shadow DOM is the only mechanism that gives us hard, two-way isolation
 * without an iframe (and the postMessage / cookie story an iframe would
 * bring). This helper:
 *
 *   1. Creates an open shadow root on the configured host element.
 *   2. Drains every CSS chunk that `vite-plugin-css-injected-by-js`
 *      buffered onto `window.__dvPendingStyles` and adopts each one as
 *      a `<style>` element inside the shadow root.
 *   3. Returns a `<div>` inside the shadow root — the React mount
 *      target.
 *
 * Toasts (react-toastify) live in-tree as a child of `<ToastContainer>`,
 * so they stay inside the shadow root automatically. The anchor-click
 * download trick still appends a momentary anchor to `document.body`,
 * which is fine — it is browser-level navigation, not styling.
 *
 * If a future reusable component introduces a portal that defaults to
 * `document.body` (modal, popover, react-bootstrap `<Overlay>`), it must
 * be passed an explicit container that lives inside the shadow root.
 * The shadow root is exposed on `window.__dvShadowRoot.<rootElementId>`
 * for that purpose; importing it explicitly is preferred.
 */

interface MountInShadowRootArgs {
  rootElementId: string
}

interface ShadowMountResult {
  /** The element React should mount into. */
  reactRoot: HTMLDivElement
  /** The shadow root itself. Useful as `portalContainer` for libraries
   *  that default to `document.body`. */
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

  // Re-mounting into a host that already has a shadow root would throw.
  // We allow a re-mount in dev (e.g. HMR) by reusing the existing root.
  let shadowRoot = host.shadowRoot
  if (!shadowRoot) {
    shadowRoot = host.attachShadow({ mode: 'open' })
  } else {
    // Clear previous mount.
    while (shadowRoot.firstChild) {
      shadowRoot.removeChild(shadowRoot.firstChild)
    }
  }

  // Drain queued CSS chunks. The queue is populated by
  // `vite-plugin-css-injected-by-js`'s overridden `injectCode` (see
  // `vite.config.uploader.ts`). The same queue is shared across multiple
  // bundles loaded on the same page; that's fine — appending the same
  // CSS into multiple shadow roots is correct, each shadow scope needs
  // its own copy.
  const pending: string[] = window.__dvPendingStyles ?? []
  for (const cssText of pending) {
    const style = document.createElement('style')
    style.textContent = cssText
    shadowRoot.appendChild(style)
  }

  const reactRoot = document.createElement('div')
  reactRoot.className = 'dv-reusable-root'
  shadowRoot.appendChild(reactRoot)

  // Expose the shadow root by host id so future components that use
  // portal-based libraries can target it explicitly.
  window.__dvShadowRoot = window.__dvShadowRoot ?? {}
  window.__dvShadowRoot[rootElementId] = shadowRoot

  return { reactRoot, shadowRoot }
}
