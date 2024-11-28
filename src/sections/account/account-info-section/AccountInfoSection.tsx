import { Table } from '@iqss/dataverse-design-system'
import { useSession } from '@/sections/session/SessionContext'
import { useTranslation } from 'react-i18next'

// TODO - Add verified email icon
// TODO - Edit account information
// TODO - Change password

export const AccountInfoSection = () => {
  const { t } = useTranslation('account', { keyPrefix: 'info' })
  const { user } = useSession()

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
      </tbody>
    </Table>
  )
}
