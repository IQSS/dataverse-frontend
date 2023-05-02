import { act, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Footer } from '../../../../src/sections/layout/footer/Footer'
import { createSandbox, SinonSandbox } from 'sinon'
import { DataverseInfoRepository } from '../../../../src/info/domain/repositories/DataverseInfoRepository'
import { vi } from 'vitest'

describe('Footer', () => {
  const sandbox: SinonSandbox = createSandbox()
  const dataverseInfoRepository: DataverseInfoRepository = {} as DataverseInfoRepository
  const testVersion = 'v. 5.13 build 1244-79d6e57'
  dataverseInfoRepository.getVersion = sandbox.stub().resolves(testVersion)

  afterEach(() => {
    sandbox.restore()
  })

  it('should render footer content', async () => {
    const { getByText, getByAltText, findByText } = render(
      <Footer dataverseInfoRepository={dataverseInfoRepository} />
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
    const { findByText } = render(<Footer dataverseInfoRepository={dataverseInfoRepository} />)

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
