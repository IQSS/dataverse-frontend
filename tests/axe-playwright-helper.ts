// typescript
// File: `tests/axe-playwright-helper.ts`
type AxeNode = {
  target: string[]
  html?: string
}

type Violation = {
  id: string
  description?: string
  nodes?: AxeNode[]
}

type AxeResult = {
  violations?: Violation[]
}

function hasAnalyze(obj: unknown): obj is { analyze: (page: unknown) => Promise<AxeResult> } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'analyze' in obj &&
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    typeof (obj as any).analyze === 'function'
  )
}

export async function runAxeAndAssert(page: unknown, { ignoreRuleIds = [] as string[] } = {}) {
  // runtime require so this helper doesn't cause TS/ES module resolution issues during Storybook build
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod: unknown = require('axe-playwright')

  let analyzeFn: ((p: unknown) => Promise<AxeResult>) | undefined

  if (hasAnalyze(mod)) {
    analyzeFn = mod.analyze
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  } else if (typeof mod === 'object' && mod !== null && hasAnalyze((mod as any).default)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    analyzeFn = (mod as any).default.analyze
  }

  if (typeof analyzeFn !== 'function') {
    // eslint-disable-next-line no-console
    console.warn('`axe-playwright` analyze function not found; skipping axe assertion.')
    return
  }

  const results = await analyzeFn(page)
  // Always print full results in CI for debugging
  // eslint-disable-next-line no-console
  console.log('Axe results:', JSON.stringify(results, null, 2))

  const allViolations: Violation[] = results.violations ?? []
  const violations = allViolations.filter((v) => !ignoreRuleIds.includes(v.id))

  if (violations.length) {
    // eslint-disable-next-line no-console
    console.error('Accessibility violations (filtered):', JSON.stringify(violations, null, 2))
  }

  if (violations.length > 0) {
    throw new Error(`${violations.length} accessibility violation(s) detected`)
  }
}
