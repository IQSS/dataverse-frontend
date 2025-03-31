import { HTMLProps, useEffect, useRef } from 'react'

export function RowSelectionCheckbox({
  indeterminate,
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      if (ref.current) {
        ref.current.indeterminate = !rest.checked && indeterminate
      }
    }
  }, [ref, indeterminate, rest.checked])

  return <input type="checkbox" aria-label="Select row" ref={ref} {...rest} />
}
