import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Tabs, Breadcrumb, Alert } from '@iqss/dataverse-design-system'
import { RouteWithParams } from '@/sections/Route.enum'
import { useGetTemplate } from '@/templates/domain/hooks/useGetTemplate'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { LicenseRepository } from '@/licenses/domain/repositories/LicenseRepository'
import { EditTemplateLicenseTerms } from './EditTemplateLicenseTerms'
import { EditTemplateTermsOfAccess } from './EditTemplateTermsOfAccess'
import styles from '../create-template/CreateTemplate.module.scss'
import termsStyles from './EditTemplateTerms.module.scss'
import { EditTemplateTermsSkeleton } from './EditTemplateTermsSkeleton'

interface EditTemplateTermsProps {
  collectionId: string
  templateId: number
  templateRepository: TemplateRepository
  licenseRepository: LicenseRepository
}

export const EditTemplateTerms = ({
  collectionId,
  templateId,
  templateRepository,
  licenseRepository
}: EditTemplateTermsProps) => {
  const { t } = useTranslation('datasetTemplates')
  const { t: tDataset } = useTranslation('dataset')
  const navigate = useNavigate()
  const location = useLocation()

  const handleClose = () =>
    navigate(RouteWithParams.COLLECTION_TEMPLATES(collectionId), {
      state: { fromEditTemplate: true }
    })

  const { template, isLoadingTemplate, errorGetTemplate } = useGetTemplate({
    templateRepository,
    templateId
  })
  const showCreateSuccess = Boolean(
    (location.state as { fromCreateTemplate?: boolean } | null)?.fromCreateTemplate
  )

  if (isLoadingTemplate) {
    return <EditTemplateTermsSkeleton />
  }

  return (
    <section className={styles.container}>
      <Breadcrumb className={styles.breadcrumb}>
        <Breadcrumb.Item
          linkAs={Link}
          linkProps={{ to: RouteWithParams.COLLECTIONS(collectionId) }}>
          {collectionId}
        </Breadcrumb.Item>
        <Breadcrumb.Item
          linkAs={Link}
          linkProps={{ to: RouteWithParams.COLLECTION_TEMPLATES(collectionId) }}>
          {t('pageTitle')}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{t('editTemplate.termsPageTitle')}</Breadcrumb.Item>
      </Breadcrumb>
      <header className={styles.header}>
        <h1>{t('editTemplate.termsPageTitle')}</h1>
      </header>
      {showCreateSuccess && (
        <Alert variant="success" dismissible={false}>
          {t('createTemplate.alerts.success')}
        </Alert>
      )}
      {errorGetTemplate && <Alert variant="danger">{errorGetTemplate}</Alert>}
      {!isLoadingTemplate && template && (
        <Tabs defaultActiveKey="datasetTerms">
          <Tabs.Tab eventKey="datasetTerms" title={tDataset('termsTab.licenseTitle')}>
            <div className={termsStyles['tab-container']}>
              <EditTemplateLicenseTerms
                template={template}
                templateRepository={templateRepository}
                licenseRepository={licenseRepository}
                onSuccess={handleClose}
                onCancel={handleClose}
              />
            </div>
          </Tabs.Tab>
          <Tabs.Tab eventKey="restrictedFilesTerms" title={tDataset('termsTab.termsTitle')}>
            <div className={termsStyles['tab-container']}>
              <EditTemplateTermsOfAccess
                template={template}
                templateRepository={templateRepository}
                onSuccess={handleClose}
                onCancel={handleClose}
              />
            </div>
          </Tabs.Tab>
        </Tabs>
      )}
    </section>
  )
}
