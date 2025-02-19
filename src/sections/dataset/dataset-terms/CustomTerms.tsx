import { useTranslation } from 'react-i18next'
import { DatasetTermsRow } from '@/sections/dataset/dataset-terms/DatasetTermsRow'
import { CustomTerms as CustomTermsModel } from '../../../dataset/domain/models/Dataset'

interface CustomTermsProps {
  customTerms?: CustomTermsModel
}

export function CustomTerms({ customTerms }: CustomTermsProps) {
  const { t } = useTranslation('dataset')
  if (!customTerms) {
    return null
  }
  return (
    <>
      <DatasetTermsRow
        title={t('termsTab.termsOfUse')}
        tooltipMessage={t('termsTab.termsOfUseTip')}
        value={customTerms.termsOfUse}
      />
      <DatasetTermsRow
        title={t('termsTab.confidentialityDeclaration')}
        tooltipMessage={t('termsTab.confidentialityDeclarationTip')}
        value={customTerms.confidentialityDeclaration}
      />
      <DatasetTermsRow
        title={t('termsTab.specialPermissions')}
        tooltipMessage={t('termsTab.specialPermissionsTip')}
        value={customTerms.specialPermissions}
      />
      <DatasetTermsRow
        title={t('termsTab.restrictions')}
        tooltipMessage={t('termsTab.restrictionsTip')}
        value={customTerms.restrictions}
      />
      <DatasetTermsRow
        title={t('termsTab.citationRequirements')}
        tooltipMessage={t('termsTab.citationRequirementsTip')}
        value={customTerms.citationRequirements}
      />
      <DatasetTermsRow
        title={t('termsTab.depositorRequirements')}
        tooltipMessage={t('termsTab.depositorRequirementsTip')}
        value={customTerms.depositorRequirements}
      />
      <DatasetTermsRow
        title={t('termsTab.conditions')}
        tooltipMessage={t('termsTab.conditionsTip')}
        value={customTerms.conditions}
      />
      <DatasetTermsRow
        title={t('termsTab.disclaimer')}
        tooltipMessage={t('termsTab.disclaimerTip')}
        value={customTerms.disclaimer}
      />
    </>
  )
}
