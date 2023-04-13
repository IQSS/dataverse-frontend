import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { Navbar } from '../../../sections/ui/navbar/Navbar'
import logo from '../../../sections/ui/logo.svg'
import { CanvasFixedHeight } from '../CanvasFixedHeight'

/**
 * ## Description
 * The navbar component is a user interface element that typically appears at the top of a website or application. Its main
 * purpose is to provide users with easy access to the main sections and features of the website or application.
 *
 * ## Usage guidelines
 *
 * The text used in the component should be concise and meaningful, and the component should be organized in a logical way
 * to make it easy for users to find what they are looking for.
 *
 * ## SASS variables
 *
 * ```
 *
 * $dv-brand-color
 *
 * ```
 *
 */
const meta: Meta<typeof Navbar> = {
  title: 'UI/Navbar',
  component: Navbar,
  decorators: [WithI18next],
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Navbar>

export const Default: Story = {
  render: () => (
    <CanvasFixedHeight height={150}>
      <Navbar
        brand={{ logo: { src: logo, altText: 'logo' }, title: 'Brand Title', path: '#' }}
        links={[
          { title: 'Link 1 ', value: '#' },
          { title: 'Link 2', value: '#' },
          {
            title: 'Dropdown 1',
            value: [
              { title: 'Link 3 ', value: '#' },
              { title: 'Link 4', value: '#' }
            ]
          },
          {
            title: 'Dropdown 2',
            value: [
              { title: 'Link 5 ', value: '#' },
              { title: 'Link 6', value: '#' }
            ]
          }
        ]}
      />
    </CanvasFixedHeight>
  )
}

/**
 * This an example use case for a menu using the navbar component
 */
export const UseCaseMenu: Story = {
  name: 'Example use case: Menu',
  render: () => (
    <CanvasFixedHeight height={150}>
      <Navbar
        brand={{ logo: { src: logo, altText: 'logo' }, title: 'Dataverse', path: '#' }}
        links={[
          { title: 'Sign Up', value: '#' },
          { title: 'Log In', value: '#' }
        ]}
      />
    </CanvasFixedHeight>
  )
}
