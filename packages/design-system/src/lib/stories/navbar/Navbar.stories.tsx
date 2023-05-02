import type { Meta, StoryObj } from '@storybook/react'
import { Navbar } from '../../components/navbar/Navbar'
import { CanvasFixedHeight } from '../CanvasFixedHeight'
import logo from '../assets/logo.svg'

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
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Navbar>

export const Default: Story = {
  render: () => (
    <CanvasFixedHeight height={150}>
      <Navbar brand={{ title: 'Brand Title', href: '#', logoImgSrc: logo }}>
        <Navbar.Link href="/link-1">Link 1</Navbar.Link>
        <Navbar.Link href="/link-2">Link 2</Navbar.Link>
        <Navbar.Dropdown title="Dropdown 1" id="dropdown">
          <Navbar.Dropdown.Item href="/link-3">Link 3</Navbar.Dropdown.Item>
          <Navbar.Dropdown.Item href="/link-4">Link 4</Navbar.Dropdown.Item>
        </Navbar.Dropdown>
      </Navbar>
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
      <Navbar brand={{ title: 'Dataverse', href: '#', logoImgSrc: logo }}>
        <Navbar.Link href="/sing-up">Sing Up</Navbar.Link>
        <Navbar.Link href="/login">Log In</Navbar.Link>
      </Navbar>
    </CanvasFixedHeight>
  )
}
