import type { Meta, StoryObj } from '@storybook/react'
import { Layout } from '../../sections/layout/Layout'
import { WithI18next } from '../WithI18next'
import { rest } from 'msw'

const meta: Meta<typeof Layout> = {
  title: 'Layout/Layout',
  component: Layout,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof Layout>

const TestData = {
  data: {
    id: 1,
    persistentUserId: 'Test',
    identifier: '@Test',
    displayName: 'Test User',
    firstName: 'Testname',
    lastName: 'Testlastname',
    email: 'testuser@dataverse.org',
    superuser: false,
    deactivated: false,
    createdTime: '2023-04-14T11:52:28Z',
    authenticationProviderId: 'builtin',
    lastLoginTime: '2023-04-14T11:52:28Z',
    lastApiUseTime: '2023-04-14T15:53:32Z'
  }
}

export const LoggedIn: Story = {
  parameters: {
    msw: [
      rest.get('http://localhost:6006/undefined/users/:me', (_req, res, ctx) => {
        return res(ctx.json(TestData))
      }),
      rest.get('http://localhost:6006/undefined/info/version', (_req, res, ctx) => {
        return res(ctx.json({ data: { version: '5.13', build: '1244-79d6e57' } }))
      })
    ]
  },
  render: () => {
    return <Layout />
  }
}
