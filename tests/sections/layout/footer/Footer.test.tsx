import { act, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Footer } from '../../../../src/sections/layout/footer/Footer'
import { createSandbox, SinonSandbox } from 'sinon'
import { vi } from 'vitest'
import { FooterMother } from './FooterMother'
import { DataverseVersionMother } from '../../../info/models/DataverseVersionMother'

describe('Footer', () => {
  const sandbox: SinonSandbox = createSandbox()
  const testVersion = DataverseVersionMother.create()

  afterEach(() => {
    sandbox.restore()
  })

  it('should render footer content', async () => {
    const { getByText, getByAltText, findByText } = render(
      FooterMother.withDataverseVersion(sandbox, testVersion)
    )

    expect(getByText('copyright')).toBeInTheDocument()
    expect(getByText('privacyPolicy')).toBeInTheDocument()
    expect(getByText('poweredBy')).toBeInTheDocument()
    expect(getByAltText('The Dataverse Project logo')).toBeInTheDocument()

    const version = await findByText(testVersion)
    expect(version).toBeInTheDocument()
  })

  it('should call dataverseInfoRepository.getInfo on mount', async () => {
    const dataverseInfoRepository = {
      getVersion: vi.fn().mockResolvedValue(testVersion)
    }
    await act(() => render(<Footer dataverseInfoRepository={dataverseInfoRepository} />))

    expect(dataverseInfoRepository.getVersion).toHaveBeenCalledTimes(1)
  })

  it('should open privacy policy link in new tab', async () => {
    const { findByText } = render(FooterMother.withDataverseVersion(sandbox))

    const privacyPolicyLink = await findByText('privacyPolicy')

    userEvent.click(privacyPolicyLink)

    expect(privacyPolicyLink).toHaveAttribute(
      'href',
      'https://dataverse.org/best-practices/harvard-dataverse-privacy-policy'
    )
    expect(privacyPolicyLink).toHaveAttribute('target', '_blank')
    expect(privacyPolicyLink).toHaveAttribute('rel', 'noreferrer')
  })
})
