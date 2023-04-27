import type { Meta, StoryObj } from '@storybook/react'
import { Breadcrumb } from '../../../sections/ui/breadcrumb/Breadcrumb'

/**
 * ## Description
 * The breadcrumbs are displayed under the header, and provide a trail of links that represent the user's current
 * location within the application. The breadcrumb component can help users understand the hierarchy of the content
 * they are viewing and navigate back to previous pages.
 *
 * ## Usage guidelines
 *
 * ### Dos
 * - The breadcrumbs should be displayed wight under the header.
 * - The last element of the breadcrumb should be always the user's current location
 *
 * ### Don'ts
 * - Add a href to the last element of the breadcrumb.
 */
const meta: Meta<typeof Breadcrumb> = {
  title: 'UI/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Breadcrumb>

export const Default: Story = {
  render: () => (
    <>
      <Breadcrumb>
        <Breadcrumb.Item href="/link-1">Breadcrumb Item 1</Breadcrumb.Item>
        <Breadcrumb.Item href="/link-2">Breadcrumb Item 2</Breadcrumb.Item>
        <Breadcrumb.Item active>Breadcrumb Item 3</Breadcrumb.Item>
      </Breadcrumb>
    </>
  )
}
