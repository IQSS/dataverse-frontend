import { render, screen, fireEvent } from '@testing-library/react'
import { DynamicFieldsButtons } from '../../../../../../src/sections/ui/form/form-group-multiple-fields/dynamic-fields-buttons/DynamicFieldsButtons'
import { vi } from 'vitest'

describe('DynamicFieldsButtons', () => {
  it('renders add button correctly', () => {
    const onAddButtonClick = vi.fn()
    const onRemoveButtonClick = vi.fn()

    const { getByRole } = render(
      <DynamicFieldsButtons
        onAddButtonClick={onAddButtonClick}
        onRemoveButtonClick={onRemoveButtonClick}
      />
    )

    const addButton = getByRole('button', { name: '+' })
    expect(addButton).toBeInTheDocument()

    fireEvent.click(addButton)
    expect(onAddButtonClick).toHaveBeenCalledTimes(1)
  })

  it('renders remove button correctly when originalField is false', () => {
    const onAddButtonClick = vi.fn()
    const onRemoveButtonClick = vi.fn()
    const { getByRole } = render(
      <DynamicFieldsButtons
        onAddButtonClick={onAddButtonClick}
        onRemoveButtonClick={onRemoveButtonClick}
      />
    )

    const removeButton = getByRole('button', { name: '-' })
    expect(removeButton).toBeInTheDocument()

    fireEvent.click(removeButton)
    expect(onRemoveButtonClick).toHaveBeenCalledTimes(1)
  })

  it('does not render remove button when originalField is true', () => {
    const onAddButtonClick = vi.fn()
    const onRemoveButtonClick = vi.fn()
    const { getByRole, queryByRole } = render(
      <DynamicFieldsButtons
        originalField
        onAddButtonClick={onAddButtonClick}
        onRemoveButtonClick={onRemoveButtonClick}
      />
    )

    const addButton = getByRole('button', { name: '+' })
    expect(addButton).toBeInTheDocument()

    const removeButton = queryByRole('button', { name: '-' })
    expect(removeButton).toBeNull()

    fireEvent.click(addButton)
    expect(onAddButtonClick).toHaveBeenCalledTimes(1)
    expect(onRemoveButtonClick).toHaveBeenCalledTimes(0)
  })
})
