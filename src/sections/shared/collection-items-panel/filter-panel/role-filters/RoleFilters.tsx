import { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Stack } from '@iqss/dataverse-design-system'
import styles from './RoleFilters.module.scss'

import { Role } from '@/users/domain/models/Role'

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
    onRolesChange({ roleId: role.roleId, checked: checked })
  }

  return (
    <Stack gap={1} className={styles['type-filters']}>
      <div className={styles['role-title']}>{t('myData.roleFilterTitle')}</div>
      {userRoles.map((role) => {
        const roleCheckDisabled =
          isLoadingCollectionItems ||
          (currentRoleIds.length === 1 && currentRoleIds.includes(role.roleId))

        return (
          <Form.Group.Checkbox
            key={role.roleId}
            id={`${role.roleName}-check`}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleItemRoleChange(role, e.target.checked)
            }
            label={
              <>
                <span>{t(`${role.roleName}`)}</span>
              </>
            }
            checked={currentRoleIds.includes(role.roleId)}
            disabled={roleCheckDisabled}
          />
        )
      })}
    </Stack>
  )
}
