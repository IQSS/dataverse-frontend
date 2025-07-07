import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FormProvider, useForm } from 'react-hook-form'
import { Accordion } from '@iqss/dataverse-design-system'
import {
  MetadataBlockInfo,
  MetadataBlockName
} from '@/metadata-block-info/domain/models/MetadataBlockInfo'
import { CollectionsSearchFields } from './CollectionsSearchFields'
import { FilesSearchFields } from './FilesSearchFields'

interface AdvancedSearchFormProps {
  metadataBlocks: MetadataBlockInfo[]
}

export const AdvancedSearchForm = ({ metadataBlocks }: AdvancedSearchFormProps) => {
  const { t } = useTranslation('shared')
  {
    /* <CollectionFormData> */
  }
  const formMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      collections: {
        name: '',
        alias: '',
        affiliation: '',
        description: '',
        subject: []
      },
      files: {
        name: '',
        description: '',
        fileType: '',
        dataFilePersistentId: '',
        variableName: '',
        variableLabel: '',
        fileTags: ''
      }
    }
  })

  const citationBlock: MetadataBlockInfo = useMemo(
    () =>
      metadataBlocks.find(
        (block) => block.name === MetadataBlockName.CITATION
      ) as MetadataBlockInfo,
    [metadataBlocks]
  )

  const subjectFieldControlledVocab: string[] = useMemo(
    () => citationBlock.metadataFields['subject'].controlledVocabularyValues as string[],
    [citationBlock]
  )

  const metadataBlockNames: string[] = metadataBlocks.map((block) => block.name)

  return (
    <FormProvider {...formMethods}>
      <form
        // onSubmit={formMethods.handleSubmit(submitForm)}
        noValidate={true}>
        <Accordion
          defaultActiveKey={['collections', 'files', ...metadataBlockNames]}
          alwaysOpen={true}>
          <Accordion.Item eventKey="collections">
            <Accordion.Header>{t('collections')}</Accordion.Header>
            <Accordion.Body>
              <CollectionsSearchFields subjectControlledVocabulary={subjectFieldControlledVocab} />
            </Accordion.Body>
          </Accordion.Item>

          {/*  Datasets Metadata blocks  */}
          {metadataBlocks.map((metadataBlock) => {
            return (
              <Accordion.Item eventKey={metadataBlock.name} key={metadataBlock.name}>
                <Accordion.Header>{`${t('datasets')}: ${
                  metadataBlock.displayName
                }`}</Accordion.Header>
                <Accordion.Body>{/* Map fields here */} holo</Accordion.Body>
              </Accordion.Item>
            )
          })}

          {/* Files  */}
          <Accordion.Item eventKey="files">
            <Accordion.Header>{t('files')}</Accordion.Header>
            <Accordion.Body>
              <FilesSearchFields />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </form>
    </FormProvider>
  )
}
