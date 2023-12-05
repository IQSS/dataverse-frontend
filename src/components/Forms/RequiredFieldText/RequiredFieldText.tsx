export function RequiredFieldText() {
  return (
    <p>
      <RequiredInputSymbol />
      Asterisks indicate required fields
    </p>
  )
}

// TODO: Why can't I export this object from Storybook?
// Needed to duplicate it on the frontend to be able to use.

const RequiredInputSymbol = () => {
  return (
    <span role="img" aria-label="Required input symbol" style={{ color: '#a94442' }}>
      {' '}
      *
    </span>
  )
}
