import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Modal, Stack, Form, Col, Alert } from '@iqss/dataverse-design-system'
import { FileLabels } from '@/sections/file/file-labels/FileLabels'
import { FileLabel, FileLabelType } from '@/files/domain/models/FileMetadata'
import { useFilesContext } from '@/sections/file/FilesContext'
import { Utils } from '@/shared/helpers/Utils'
import styles from './EditFileTagsModal.module.scss'

const FILE_TAG_OPTIONS = ['Documentation', 'Data', 'Code']
const TABULAR_TAG_OPTIONS = [
  'Survey',
  'Time Series',
  'Panel',
  'Event',
  'Genomics',
  'Network',
  'Geospatial'
]

interface EditFileTagsModalProps {
  show: boolean
  handleClose: () => void
  fileId: number
  isTabularFile: boolean
  existingLabels?: FileLabel[]
  handleUpdateCategories: (
    fileId: number | string,
    categories: string[],
    replace?: boolean
  ) => Promise<void>
  isUpdatingFileCategories: boolean
  errorUpdatingFileCategories: string | null
  handleUpdateTabularTags: (
    fileId: number | string,
    tags: string[],
    replace?: boolean
  ) => Promise<void>
  isUpdatingTabularTags: boolean
  errorUpdatingTabularTags: string | null
}

export const EditFileTagsModal = ({
  show,
  fileId,
  isTabularFile,
  handleClose,
  existingLabels,
  handleUpdateCategories,
  handleUpdateTabularTags,
  isUpdatingFileCategories,
  errorUpdatingFileCategories,
  isUpdatingTabularTags,
  errorUpdatingTabularTags
}: EditFileTagsModalProps) => {
  const { t: tShared } = useTranslation('shared')
  const { t } = useTranslation('file')
  const { refreshFiles } = useFilesContext()
  const [customTag, setCustomTag] = useState('')
  const initialSelectedFileTags = useMemo(
    () => existingLabels?.filter((l) => l.type === 'category').map((l) => l.value) || [],
    [existingLabels]
  )
  const initialSelectedTabularTags = useMemo(
    () => existingLabels?.filter((l) => l.type === 'tag').map((l) => l.value) || [],
    [existingLabels]
  )
  const [selectedFileTags, setSelectedFileTags] = useState<string[]>(initialSelectedFileTags)
  const [fileTagOptions, setFileTagOptions] = useState<string[]>([
    ...FILE_TAG_OPTIONS,
    ...initialSelectedFileTags.filter((tag) => !FILE_TAG_OPTIONS.includes(tag))
  ])
  const [selectedTabularTags, setSelectedTabularTags] = useState<string[]>(
    initialSelectedTabularTags
  )

  const handleSave = async () => {
    const replaceTags = true // fully replace the tag array with current selected array

    if (!Utils.areArraysEqual(selectedFileTags, initialSelectedFileTags)) {
      await handleUpdateCategories(fileId, selectedFileTags, replaceTags)
    }
    if (!Utils.areArraysEqual(selectedTabularTags, initialSelectedTabularTags)) {
      await handleUpdateTabularTags(fileId, selectedTabularTags, replaceTags)
    }

    await refreshFiles()
    handleClose()
  }

  const handleAddCustomTag = () => {
    if (customTag === '') {
      return
    }
    if (!fileTagOptions.includes(customTag)) {
      setFileTagOptions((prev) => [...prev, customTag])
    }
    setSelectedFileTags((prev) => [...prev, customTag])
    setCustomTag('')
  }

  const handleTabularTagsChange = (selected: string[]) => {
    setSelectedTabularTags(selected)
  }

  const handleModalClose = () => {
    setSelectedFileTags(initialSelectedFileTags)
    setSelectedTabularTags(initialSelectedTabularTags)
    setCustomTag('')
    setFileTagOptions([
      ...FILE_TAG_OPTIONS,
      ...initialSelectedFileTags.filter((tag) => !FILE_TAG_OPTIONS.includes(tag))
    ])
    handleClose()
  }

  const selectedLabels = [
    ...selectedFileTags.map((tag) => ({ value: tag, type: FileLabelType.CATEGORY })),
    ...selectedTabularTags.map((tag) => ({ value: tag, type: FileLabelType.TAG }))
  ]

  return (
    <Modal show={show} onHide={handleModalClose} centered size="lg">
      <Modal.Header>
        <Modal.Title>{t('editFileTagsModal.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorUpdatingFileCategories && (
          <Alert variant="danger">{errorUpdatingFileCategories}</Alert>
        )}
        {errorUpdatingTabularTags && <Alert variant="danger">{errorUpdatingTabularTags}</Alert>}
        <p className={styles.helper_text}>{t('editFileTagsModal.intro')}</p>
        <Stack gap={3} className={styles.stack_container}>
          <Stack direction="horizontal" gap={2} className="align-items-center">
            <Form.Group.Label column sm={3}>
              {t('editFileTagsModal.selectedTagsLabel')}
            </Form.Group.Label>
            <Col sm={9}>
              {selectedLabels.length === 0 ? (
                <span>{t('editFileTagsModal.noTagsSelected')}</span>
              ) : (
                <FileLabels labels={selectedLabels} />
              )}
            </Col>
          </Stack>

          <Form>
            <Stack gap={3} className={styles.stack_container}>
              <Stack direction="horizontal" gap={2} className="align-items-center">
                <Form.Group.Label column sm={3}>
                  {t('editFileTagsModal.fileTagsLabel')}
                </Form.Group.Label>
                <Col sm={9}>
                  <Form.Group.SelectAdvanced
                    isMultiple
                    key={customTag}
                    defaultValue={selectedFileTags}
                    options={fileTagOptions}
                    onChange={setSelectedFileTags}
                    inputButtonId="file-tags-select"
                    isSearchable={false}
                  />
                </Col>
              </Stack>

              <Stack direction="horizontal" gap={2} className="align-items-center">
                <Form.Group.Label column sm={3}>
                  {t('editFileTagsModal.customFileTagLabel')}
                </Form.Group.Label>
                <Col sm={9}>
                  <p className={styles.helper_text}>{t('editFileTagsModal.customFileTagHelp')}</p>
                  <Stack direction="horizontal" gap={2}>
                    <input
                      type="text"
                      data-testid="custom-file-tag-input"
                      placeholder={t('editFileTagsModal.customFileTagPlaceholder')}
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddCustomTag()
                        }
                      }}
                      className={styles.custom_tag_input}
                    />

                    <Button type="button" variant="secondary" onClick={handleAddCustomTag}>
                      {t('editFileTagsModal.customFileTagApply')}
                    </Button>
                  </Stack>
                </Col>
              </Stack>

              {isTabularFile && (
                <Stack direction="horizontal" gap={2} className="align-items-center">
                  <Form.Group.Label column sm={3}>
                    {t('editFileTagsModal.tabularTagsLabel')}
                  </Form.Group.Label>
                  <Col sm={9}>
                    <p className={styles.helper_text}>{t('editFileTagsModal.tabularTagsHelp')}</p>
                    <Form.Group.SelectAdvanced
                      isMultiple
                      defaultValue={selectedTabularTags}
                      options={TABULAR_TAG_OPTIONS}
                      onChange={handleTabularTagsChange}
                      inputButtonId="tabular-tags-select"
                      isSearchable={false}
                    />
                  </Col>
                </Stack>
              )}
            </Stack>
            {/* This is shown when multiple files are selected */}
            {/* <Stack gap={3} className={styles.stack_container}>
              <Stack direction="horizontal" gap={2} className="align-items-center">
                <Form.Group.Label column sm={3}>
                  {t('editFileTagsModal.deleteTagsLabel')}
                </Form.Group.Label>
                <Col sm={9}>
                  <p className={styles.helper_text}>{t('editFileTagsModal.deleteTagsHelp')}</p>
                  <Form.Group.Checkbox
                    id="delete-tags-checkbox"
                    label={t('editFileTagsModal.deleteTagsCheckboxLabel')}
                  />
                </Col>
              </Stack>
            </Stack> */}
          </Form>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleModalClose}
          type="button"
          disabled={isUpdatingFileCategories || isUpdatingTabularTags}>
          {tShared('cancel')}
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          type="button"
          disabled={isUpdatingFileCategories}>
          {isUpdatingFileCategories ? tShared('saving') : tShared('saveChanges')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
