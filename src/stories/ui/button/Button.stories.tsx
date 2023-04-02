import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../../../sections/ui/button/Button'
import { userEvent, within } from '@storybook/testing-library'
import { expect } from '@storybook/jest'
const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  render: () => <Button label="Button" />
}

export const Secondary: Story = {
  render: () => <Button secondary label="Button" />
}

export const Large: Story = {
  render: () => {
    const handleSubmit = () => {
      console.log('hello')
    }
    return <Button size="large" onClick={handleSubmit} label="Large Button" />
  },
  // eslint-disable-next-line @typescript-eslint/require-await
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    console.log('test interaction: ')
    console.log(canvas)
    userEvent.click(canvas.getByTestId('button-test'))
    expect(canvas.getByTestId('button-test')).toBeInTheDocument()
    expect(canvas.getByText('Large Button')).toBeInTheDocument()
  }
}
