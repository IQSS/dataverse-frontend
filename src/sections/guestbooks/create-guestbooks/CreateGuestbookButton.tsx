import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@iqss/dataverse-design-system'
import { PlusLg } from 'react-bootstrap-icons'
import { RouteWithParams } from '@/sections/Route.enum'

interface CreateGuestbookButtonProps {
  collectionId: string
  className?: string
}

export const CreateGuestbookButton = ({ collectionId, className }: CreateGuestbookButtonProps) => {
  const { t } = useTranslation('guestbooks')
  const navigate = useNavigate()

  return (
    <Button
      variant="primary"
      onClick={() => navigate(RouteWithParams.GUESTBOOKS_CREATE(collectionId))}
      className={className}>
      <PlusLg />
      {t('actions.create')}
    </Button>
  )
}
