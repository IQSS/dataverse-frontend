import { renderHook } from '@testing-library/react'
import { useBeforeUnloadGuard } from '../../../../src/shared/hooks/useBeforeUnloadGuard'

const fireBeforeUnload = (): boolean => {
  const event = new Event('beforeunload', { cancelable: true })
  window.dispatchEvent(event)
  return event.defaultPrevented
}

describe('useBeforeUnloadGuard', () => {
  it('asks for confirmation only while active', () => {
    const { rerender } = renderHook(({ active }) => useBeforeUnloadGuard(active), {
      initialProps: { active: false }
    })
    expect(fireBeforeUnload()).to.equal(false)

    rerender({ active: true })
    expect(fireBeforeUnload()).to.equal(true)

    rerender({ active: false })
    expect(fireBeforeUnload()).to.equal(false)
  })

  it('removes its listener on unmount', () => {
    const { unmount } = renderHook(() => useBeforeUnloadGuard(true))
    expect(fireBeforeUnload()).to.equal(true)
    unmount()
    expect(fireBeforeUnload()).to.equal(false)
  })
})
