import { FileEmbargo, FileStatus } from '../../../../../files/domain/models/File'
import { useTranslation } from 'react-i18next'

interface FileEmbargoDateProps {
  embargo: FileEmbargo | undefined
  status: FileStatus
}

export function FileEmbargoDate({ embargo, status }: FileEmbargoDateProps) {
  const { t } = useTranslation('files')

  if (!embargo) {
    return <></>
  }

  return (
    <div>
      <span>
        {t(embargoTypeOfDate(embargo.active, status))} {embargo.date}
      </span>
    </div>
  )
}

const embargoTypeOfDate = (embargoIsActive: boolean, status: FileStatus) => {
  if (status === FileStatus.RELEASED) {
    return embargoIsActive ? 'embargoedUntil' : 'embargoedWasThrough'
  }

  return 'embargoedWillBeUntil'
}
