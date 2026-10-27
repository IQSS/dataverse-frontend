import { Table } from '@iqss/dataverse-design-system'
import { useSession } from '@/sections/session/SessionContext'
import { useTranslation } from 'react-i18next'
import { Stack } from '@iqss/dataverse-design-system'
import { useUserRepositories } from '@/shared/contexts/repositories/RepositoriesProvider'
import { OrcidIcon } from '@/sections/shared/orcid/OrcidIcon'
import { useGetAuthenticatedOrcid } from './useGetAuthenticatedOrcid'

// TODO - Add verified email icon
// TODO - Edit account information
// TODO - Change password

export const AccountInfoSection = () => {
  const { t } = useTranslation('account', { keyPrefix: 'info' })
  const { user } = useSession()
  const { userRepository } = useUserRepositories()
  const {
    orcid,
    isLoading: isLoadingOrcid,
    error: orcidError
  } = useGetAuthenticatedOrcid(userRepository)

  return (
    <Table striped={false} bordered={false} borderless>
      <tbody>
        <tr>
          <th scope="row">{t('username')}</th>
          <td>{user?.identifier}</td>
        </tr>
        <tr>
          <th scope="row">{t('givenName')}</th>
          <td>{user?.firstName}</td>
        </tr>
        <tr>
          <th scope="row">{t('familyName')}</th>
          <td>{user?.lastName}</td>
        </tr>
        <tr>
          <th scope="row">{t('email')}</th>
          <td>{user?.email}</td>
        </tr>
        {user?.affiliation && (
          <tr>
            <th scope="row">{t('affiliation')}</th>
            <td>{user?.affiliation}</td>
          </tr>
        )}
        {user?.position && (
          <tr>
            <th scope="row">{t('position')}</th>
            <td>{user?.position}</td>
          </tr>
        )}
        {!isLoadingOrcid && !orcidError && (
          <tr data-testid="orcid-row">
            <th scope="row">{t('orcid')}</th>
            <td>
              {orcid ? (
                <Stack direction="horizontal" gap={2}>
                  <OrcidIcon />
                  <a href={orcid} target="_blank" rel="noreferrer">
                    {orcid}
                  </a>
                </Stack>
              ) : (
                <span className="text-muted">{t('orcidNotConnected')}</span>
              )}
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  )
}
