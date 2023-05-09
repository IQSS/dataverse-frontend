import { render, fireEvent } from '@testing-library/react'
import { Form } from '../../../../src/sections/ui/form/Form'
import { vi } from 'vitest'
import { FormEvent } from 'react'

describe('Form', () => {
  it('should render children', () => {
    const { getByText } = render(
      <Form>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" />
      </Form>
    )

    expect(getByText('Username')).toBeInTheDocument()
  })

  it('should call onSubmit when the form is submitted', () => {
    const handleSubmit = vi.fn((e: FormEvent<HTMLFormElement>) => e.preventDefault())
    const { getByText } = render(
      <Form onSubmit={handleSubmit}>
        <button type="submit">Submit Form</button>
      </Form>
    )

    fireEvent.click(getByText('Submit Form'))
    expect(handleSubmit).toHaveBeenCalledTimes(1)
  })
})
