import { DatasetLicense } from '../../../dataset/domain/models/Dataset'
import { License } from '@/sections/dataset/dataset-terms/License'
import { useTranslation } from 'react-i18next'
import { DatasetTermsRow } from '@/sections/dataset/dataset-terms/DatasetTermsRow'

interface LicenseTermsProps {
  license?: DatasetLicense
  termsOfUse?: string
  confidentialityDeclaration?: string
  specialPermissions?: string
  restrictions?: string
  citationRequirements?: string
  depositorRequirements?: string
  conditions?: string
  disclaimer?: string
}
interface LicenseTermsProps {
  license?: DatasetLicense
  termsOfUse?: string
  confidentialityDeclaration?: string
  specialPermissions?: string
  restrictions?: string
  citationRequirements?: string
  depositorRequirements?: string
  conditions?: string
  disclaimer?: string
}
export function CustomTerms({
  license,
  termsOfUse,
  confidentialityDeclaration,
  specialPermissions,
  restrictions,
  citationRequirements,
  depositorRequirements,
  conditions,
  disclaimer
}: LicenseTermsProps) {
  const { t } = useTranslation('dataset')

  return (
    <>
      <DatasetTermsRow
        title={t('termsTab.termsOfUse')}
        tooltipMessage={t('termsTab.termsOfUseTip')}
        value={termsOfUse}
      />
      <DatasetTermsRow
        title={t('termsTab.confidentialityDeclaration')}
        tooltipMessage={t('termsTab.confidentialityDeclarationTip')}
        value={confidentialityDeclaration}
      />
      <DatasetTermsRow
        title={t('termsTab.specialPermissions')}
        tooltipMessage={t('termsTab.specialPermissionsTip')}
        value={specialPermissions}
      />
      <DatasetTermsRow
        title={t('termsTab.restrictions')}
        tooltipMessage={t('termsTab.restrictionsTip')}
        value={restrictions}
      />
      <DatasetTermsRow
        title={t('termsTab.citationRequirements')}
        tooltipMessage={t('termsTab.citationRequirementsTip')}
        value={citationRequirements}
      />
      <DatasetTermsRow
        title={t('termsTab.depositorRequirements')}
        tooltipMessage={t('termsTab.depositorRequirementsTip')}
        value={depositorRequirements}
      />
      <DatasetTermsRow
        title={t('termsTab.conditions')}
        tooltipMessage={t('termsTab.conditionsTip')}
        value={conditions}
      />
      <DatasetTermsRow
        title={t('termsTab.disclaimer')}
        tooltipMessage={t('termsTab.disclaimerTip')}
        value={disclaimer}
      />
    </>
  )
}
