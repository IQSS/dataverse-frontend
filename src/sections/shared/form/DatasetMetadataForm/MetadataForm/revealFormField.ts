import { type FieldErrors } from 'react-hook-form'

const ACCORDION_OPEN_ANIMATION_MS = 800
const FOCUSABLE_CONTROLS = 'input, textarea, select, button, [tabindex]:not([tabindex="-1"])'

/**
 * Finds the form name (for example "citation.dsDescription.0.dsDescriptionValue") of the first field
 * that react-hook-form reports an error for. Errors are nested by block, field, row and child field.
 */
export function findFirstErrorFieldName(errors: FieldErrors): string | undefined {
  const walk = (node: unknown, path: string[]): string | undefined => {
    if (!node || typeof node !== 'object') return undefined

    if (isLeafError(node)) return path.join('.')

    const entries = Array.isArray(node)
      ? node.map((child, index) => [String(index), child] as const)
      : Object.entries(node as Record<string, unknown>)

    for (const [key, child] of entries) {
      const found = walk(child, [...path, key])
      if (found) return found
    }

    return undefined
  }

  return walk(errors, [])
}

function isLeafError(node: object): boolean {
  return 'type' in node && 'message' in node && !('root' in node && Object.keys(node).length === 1)
}

/**
 * Opens every folded accordion section that hides the element, then scrolls to it and focuses it.
 * Used after a failed submit (to show the first invalid field) and by the "go to the next empty
 * required field" link.
 */
export function revealFormField(container: HTMLElement, fieldName: string): void {
  const target = findFieldElement(container, fieldName)
  if (!target) return

  openFoldedAccordionSectionsAround(target)

  setTimeout(
    /* istanbul ignore next */ () => {
      // The form may have been left (or re-mounted) in the meantime
      if (!target.isConnected) return

      target.scrollIntoView({ behavior: 'smooth', block: 'center' })
      focusField(target)
    },
    ACCORDION_OPEN_ANIMATION_MS
  )
}

/**
 * Reveals the first field with a validation error, if any.
 */
export function revealFirstInvalidField(container: HTMLElement, errors: FieldErrors): void {
  const firstErrorFieldName = findFirstErrorFieldName(errors)
  if (!firstErrorFieldName) return

  revealFormField(container, firstErrorFieldName)
}

function findFieldElement(container: HTMLElement, fieldName: string): HTMLElement | null {
  const byId = document.getElementById(fieldName)
  if (byId && container.contains(byId)) return byId

  const byWrapper = container.querySelector<HTMLElement>(`[data-field-name="${fieldName}"]`)
  if (byWrapper) return byWrapper

  // A child field of a composed field: fall back to the wrapper of its parent field, if any
  const [blockName, parentFieldName] = fieldName.split('.')
  const parentWrapper = container.querySelector<HTMLElement>(
    `[data-field-name="${blockName}.${parentFieldName}"]`
  )
  if (parentWrapper) return parentWrapper

  return container.querySelector<HTMLElement>('.is-invalid')
}

function openFoldedAccordionSectionsAround(element: HTMLElement): void {
  let current: HTMLElement | null = element.parentElement

  while (current) {
    if (current.classList.contains('accordion-collapse') && !current.classList.contains('show')) {
      const item = current.closest('.accordion-item')
      const headerButton = item?.querySelector<HTMLButtonElement>('button.accordion-button')
      if (headerButton?.classList.contains('collapsed')) headerButton.click()
    }
    current = current.parentElement
  }
}

function focusField(target: HTMLElement): void {
  const control = target.matches(FOCUSABLE_CONTROLS)
    ? target
    : target.querySelector<HTMLElement>(FOCUSABLE_CONTROLS)

  control?.focus({ preventScroll: true })
}
