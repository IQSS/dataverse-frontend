import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Accordion, Alert, Button, Modal, Stack } from '@iqss/dataverse-design-system'
import { MetadataBlockName } from '@/dataset/domain/models/Dataset'
import { DatasetMetadataFields } from '@/sections/dataset/dataset-metadata/dataset-metadata-fields/DatasetMetadataFields'
import { useGetMetadataBlockDisplayFormatInfo } from '@/sections/dataset/useGetMetadataBlockDisplayFormatInfo'
import { License } from '@/sections/dataset/dataset-terms/License'
import { CustomTerms } from '@/sections/dataset/dataset-terms/CustomTerms'
import { TermsOfAccess } from '@/sections/dataset/dataset-terms/TermsOfAccess'
import { DatasetTermsRow } from '@/sections/dataset/dataset-terms/DatasetTermsRow'
import { Template } from '@/dataset/domain/models/DatasetTemplate'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { MetadataBlockInfoRepository } from '@/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { DatasetTemplatePreviewModalSkeleton } from './DatasetTemplatePreviewModalSkeleton'

interface DatasetTemplatePreviewModalProps {
  show: boolean
  handleClose: () => void
  templateId: number | null
  templateName: string
  templateRepository: TemplateRepository
  metadataBlockInfoRepository: MetadataBlockInfoRepository
}

export const DatasetTemplatePreviewModal = ({
  show,
  handleClose,
  templateId,
  templateName,
  templateRepository,
  metadataBlockInfoRepository
}: DatasetTemplatePreviewModalProps) => {
  const { t } = useTranslation('datasetTemplates')
  const { t: tShared } = useTranslation('shared')
  const { t: tDataset } = useTranslation('dataset')
  const [template, setTemplate] = useState<Template | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!show || !templateId) {
      setTemplate(null)
      setError(null)
      return
    }

    let isMounted = true
    setIsLoading(true)
    setError(null)

    templateRepository
      .getTemplate(templateId)
      .then((response) => {
        if (isMounted) {
          setTemplate(response)
        }
      })
      .catch(() => {
        if (isMounted) {
          setError(t('preview.error'))
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [show, templateId, templateRepository, t])

  const citationBlock = useMemo(() => {
    if (!template?.datasetMetadataBlocks) return null
    return (
      template.datasetMetadataBlocks.find((block) => block.name === MetadataBlockName.CITATION) ||
      null
    )
  }, [template])

  const {
    metadataBlockDisplayFormatInfo,
    isLoading: isLoadingBlockInfo,
    error: errorBlockInfo
  } = useGetMetadataBlockDisplayFormatInfo({
    metadataBlockName: MetadataBlockName.CITATION,
    metadataBlockInfoRepository
  })

  const hasCitationFields = citationBlock && Object.keys(citationBlock.fields ?? {}).length > 0

  return (
    <Modal show={show} onHide={isLoading ? () => {} : handleClose} centered size="lg">
      <Modal.Header>
        <Modal.Title>{t('preview.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <span style={{ margin: '10px', fontWeight: 'bold' }}>{t('preview.templateLabel')}</span>
          <span style={{ display: 'inline-grid', margin: '10px', fontWeight: 'bold' }}>
            {template?.name ?? templateName}
          </span>
        </div>

        {isLoading && <DatasetTemplatePreviewModalSkeleton />}

        {error && <Alert variant="danger">{error}</Alert>}

        {!isLoading && template && (
          <Accordion defaultActiveKey={['0', '1', '2']} alwaysOpen>
            <Accordion.Item eventKey="0">
              <Accordion.Header>{t('preview.sections.metadata')}</Accordion.Header>
              <Accordion.Body>
                {isLoadingBlockInfo && <DatasetTemplatePreviewModalSkeleton />}
                {errorBlockInfo && <Alert variant="danger">{errorBlockInfo}</Alert>}
                {!isLoadingBlockInfo &&
                !errorBlockInfo &&
                hasCitationFields &&
                metadataBlockDisplayFormatInfo ? (
                  <DatasetMetadataFields
                    metadataBlockName={MetadataBlockName.CITATION}
                    metadataFields={citationBlock.fields}
                    metadataBlockDisplayFormatInfo={metadataBlockDisplayFormatInfo}
                  />
                ) : null}
                {!isLoadingBlockInfo &&
                !errorBlockInfo &&
                (!hasCitationFields || !metadataBlockDisplayFormatInfo) ? (
                  <span>{t('preview.noMetadata')}</span>
                ) : null}
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>{t('preview.sections.terms')}</Accordion.Header>
              <Accordion.Body>
                <License license={template.license} />
                <CustomTerms customTerms={template.termsOfUse.customTerms} />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>{t('preview.sections.access')}</Accordion.Header>
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
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
          <Stack direction="horizontal" gap={1}>
            {tShared('close')}
          </Stack>
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
