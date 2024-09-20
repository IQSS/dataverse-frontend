import type { Meta, StoryObj } from '@storybook/react'

import { Spinner } from '../../components/spinner/Spinner'

/**
 * ## Description
 * The Spinner component is used to indicate a loading state.
 */
const meta: Meta<typeof Spinner> = {
  title: 'Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered'
  }
}

export default meta
type Story = StoryObj<typeof Spinner>

export const Default: Story = {
  render: () => <Spinner variant="primary" />
}

export const AllBorderVariantsAtAGlance: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Spinner animation="border" variant="primary" />
      <Spinner animation="border" variant="secondary" />
      <Spinner animation="border" variant="success" />
      <Spinner animation="border" variant="danger" />
      <Spinner animation="border" variant="warning" />
      <Spinner animation="border" variant="info" />
      <Spinner animation="border" variant="light" />
      <Spinner animation="border" variant="dark" />
    </div>
  )
}

export const AllGrowVariantsAtAGlance: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Spinner animation="grow" variant="primary" />
      <Spinner animation="grow" variant="secondary" />
      <Spinner animation="grow" variant="success" />
      <Spinner animation="grow" variant="danger" />
      <Spinner animation="grow" variant="warning" />
      <Spinner animation="grow" variant="info" />
      <Spinner animation="grow" variant="light" />
      <Spinner animation="grow" variant="dark" />
    </div>
  )
}

export const AllSizesAtAGlance: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Spinner animation="border" variant="primary" size="sm" />
      <Spinner animation="border" variant="primary" />
      <Spinner animation="grow" variant="primary" size="sm" />
      <Spinner animation="grow" variant="primary" />
    </div>
  )
}
