import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { Navbar } from '../../../sections/ui/navbar/Navbar'
import logo from '../../../sections/ui/logo.svg'
import { CanvasFixedHeight } from '../CanvasFixedHeight'

const meta: Meta<typeof Navbar> = {
  title: 'UI/Navbar',
  component: Navbar,
  decorators: [WithI18next]
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

export const Menu: Story = {
  render: () => (
    <CanvasFixedHeight height={150}>
      <Navbar brand={{ title: 'Dataverse', href: '#', logoImgSrc: logo }}>
        <Navbar.Link href="/sing-up">Sing Up</Navbar.Link>
        <Navbar.Link href="/login">Log In</Navbar.Link>
      </Navbar>
    </CanvasFixedHeight>
  )
}
