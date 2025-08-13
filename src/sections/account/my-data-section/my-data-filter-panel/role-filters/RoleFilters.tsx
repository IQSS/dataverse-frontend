import { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Stack } from '@iqss/dataverse-design-system'
import { Role } from '@/roles/domain/models/Role'
import styles from './RoleFilters.module.scss'

interface RoleFiltersProps {
  userRoles: Role[]
  currentRoleIds: number[]
  onRolesChange: (roleChange: RoleChange) => void
  isLoadingCollectionItems: boolean
}

export interface RoleChange {
  roleId: number
  checked: boolean
}

export const RoleFilters = ({
  userRoles,
  currentRoleIds,
  onRolesChange,
  isLoadingCollectionItems
}: RoleFiltersProps) => {
  const { t } = useTranslation('account')
  const handleItemRoleChange = (role: Role, checked: boolean) => {
    onRolesChange({ roleId: role.id, checked: checked })
  }

  return (
    <Stack gap={1} className={styles['role-filters']}>
      <div className={styles['title']}>{t('myData.roleFilterTitle')}</div>
      {userRoles.map((role) => {
        const roleCheckDisabled =
          isLoadingCollectionItems ||
          (currentRoleIds.length === 1 && currentRoleIds.includes(role.id))

        return (
          <Form.Group.Checkbox
            key={role.id}
            id={`${role.alias}-check`}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleItemRoleChange(role, e.target.checked)
            }
            label={
              <>
                <span>{t(`${role.name}`)}</span>
              </>
            }
            checked={currentRoleIds.includes(role.id)}
            disabled={roleCheckDisabled}
          />
        )
      })}
    </Stack>
  )
}
