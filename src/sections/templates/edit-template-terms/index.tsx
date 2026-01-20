// waiting to be implemented till Edit Template api support is ready

import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Accordion, Button, Breadcrumb, Alert } from '@iqss/dataverse-design-system'
import { RouteWithParams } from '@/sections/Route.enum'
import { useGetTemplate } from '@/templates/domain/hooks/useGetTemplate'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { License } from '@/sections/dataset/dataset-terms/License'
import { CustomTerms } from '@/sections/dataset/dataset-terms/CustomTerms'
import { TermsOfAccess } from '@/sections/dataset/dataset-terms/TermsOfAccess'
import { DatasetTermsRow } from '@/sections/dataset/dataset-terms/DatasetTermsRow'
import styles from '../create-template/CreateTemplate.module.scss'
import { EditTemplateTermsSkeleton } from './EditTemplateTermsSkeleton'

interface EditTemplateTermsProps {
  collectionId: string
  templateId: number
  templateRepository: TemplateRepository
}

export const EditTemplateTerms = ({
  collectionId,
  templateId,
  templateRepository
}: EditTemplateTermsProps) => {
  const { t } = useTranslation('datasetTemplates')
  const { t: tDataset } = useTranslation('dataset')
  const { t: tShared } = useTranslation('shared')
  const navigate = useNavigate()
  const location = useLocation()

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
    <>
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
          <Breadcrumb.Item active>
            {tDataset('datasetActionButtons.editDataset.terms')}
          </Breadcrumb.Item>
        </Breadcrumb>
        <header className={styles.header}>
          <h1>{tDataset('datasetActionButtons.editDataset.terms')}</h1>
        </header>
        {showCreateSuccess && (
          <Alert variant="success" dismissible={false}>
            {t('createTemplate.alerts.success')}
          </Alert>
        )}
        {errorGetTemplate && (
          <Alert variant="danger">{tShared('errors.loadingDataErrorMessage')}</Alert>
        )}
        {!isLoadingTemplate && template && (
          <Accordion defaultActiveKey={['0', '1']} alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>{tDataset('termsTab.licenseTitle')}</Accordion.Header>
              <Accordion.Body>
                <License license={template?.license} />
                <CustomTerms customTerms={template?.termsOfUse.customTerms} />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>{tDataset('termsTab.termsTitle')}</Accordion.Header>
              <Accordion.Body>
                <TermsOfAccess
                  termsOfAccess={template.termsOfUse.termsOfAccess}
                  filesCountInfo={undefined}
                  restrictedFilesCount={0}
                />
                <DatasetTermsRow
                  title={tDataset('termsTab.requestAccess')}
                  tooltipMessage={tDataset('termsTab.requestAccessTip')}
                  value={
                    template?.termsOfUse?.termsOfAccess?.fileAccessRequest
                      ? tDataset('termsTab.requestAccessTrue')
                      : tDataset('termsTab.requestAccessFalse')
                  }
                />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        )}
        <div className={styles['form-actions']}>
          <Button type="button" disabled>
            {tShared('saveChanges')}
          </Button>
          <Button
            type="button"
            variant="secondary"
            withSpacing
            onClick={() => navigate(RouteWithParams.COLLECTION_TEMPLATES(collectionId))}>
            {tShared('cancel')}
          </Button>
        </div>
      </section>
    </>
  )
}
