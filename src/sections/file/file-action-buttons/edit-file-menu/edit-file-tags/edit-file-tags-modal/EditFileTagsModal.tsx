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
  const [hasDuplicateCustomTag, setHasDuplicateCustomTag] = useState(false)

  const initialSelectedFileTags = useMemo(
    () =>
      existingLabels?.filter((l) => l.type === FileLabelType.CATEGORY).map((l) => l.value) || [],
    [existingLabels]
  )

  const initialSelectedTabularTags = useMemo(
    () => existingLabels?.filter((l) => l.type === FileLabelType.TAG).map((l) => l.value) || [],
    [existingLabels]
  )
  const [selectedFileTags, setSelectedFileTags] = useState<string[]>(initialSelectedFileTags)
  const [fileTagOptions, setFileTagOptions] = useState<string[]>([
    ...FILE_TAG_OPTIONS,
    ...initialSelectedFileTags.filter((tag) => !FILE_TAG_OPTIONS.includes(tag))
  ]) //TODO: populated the tag options with Dataset's Categories if the api is ready
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
    if (customTag.trim() === '') {
      return
    }

    if (fileTagOptions.some((tag) => tag === customTag)) {
      setHasDuplicateCustomTag(true)
      return
    }
    setFileTagOptions((prev) => [...prev, customTag])
    setSelectedFileTags((prev) => [...prev, customTag])
    setCustomTag('')
    setHasDuplicateCustomTag(false)
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
    setHasDuplicateCustomTag(false)
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
        <Form.Group.Text>{t('editFileTagsModal.intro')}</Form.Group.Text>
        <Stack gap={3} className={styles.stack_container}>
          <Stack direction="horizontal" gap={2} className="align-items-center">
            <span className="col-sm-3" style={{ fontWeight: 'bold' }}>
              {t('editFileTagsModal.selectedTagsLabel')}
            </span>
            <Col sm={9}>
              {selectedLabels.length === 0 ? (
                <span>{t('editFileTagsModal.noTagsSelected')}</span>
              ) : (
                <FileLabels labels={selectedLabels} />
              )}
            </Col>
          </Stack>

          <Stack gap={3} className={styles.stack_container}>
            <Stack direction="horizontal" gap={2} className="align-items-center">
              <Form.Group.Label column sm={3} htmlFor="file-tags-select">
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
              <Form.Group.Label column sm={3} htmlFor="custom-file-tag-input">
                {t('editFileTagsModal.customFileTagLabel')}
              </Form.Group.Label>
              <Col sm={9}>
                <Form.Group.Text>{t('editFileTagsModal.customFileTagHelp')}</Form.Group.Text>

                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleAddCustomTag()
                  }}>
                  <Stack direction="horizontal" gap={2}>
                    <Form.Group.Input
                      type="text"
                      data-testid="custom-file-tag-input"
                      placeholder={t('editFileTagsModal.customFileTagPlaceholder')}
                      value={customTag}
                      onChange={(e) => {
                        setCustomTag(e.target.value)
                        setHasDuplicateCustomTag(false)
                      }}
                      isInvalid={hasDuplicateCustomTag}
                    />
                    <Button type="submit" variant="secondary">
                      {t('editFileTagsModal.customFileTagApply')}
                    </Button>{' '}
                  </Stack>
                </form>
                {hasDuplicateCustomTag && (
                  <span className="text-danger">
                    {t('editFileTagsModal.customFileTagDuplicateError')}
                  </span>
                )}
              </Col>
            </Stack>

            {isTabularFile && (
              <Stack direction="horizontal" gap={2} className="align-items-center">
                <Form.Group.Label column sm={3} htmlFor="tabular-tags-select">
                  {t('editFileTagsModal.tabularTagsLabel')}
                </Form.Group.Label>
                <Col sm={9}>
                  <Form.Group.Text>{t('editFileTagsModal.tabularTagsHelp')}</Form.Group.Text>
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
                <Form.Group.Label column sm={3} htmlFor="delete-tags-checkbox">
                  {t('editFileTagsModal.deleteTagsLabel')}
                </Form.Group.Label>
                <Col sm={9}>
                  <Form.Group.Text>{t('editFileTagsModal.deleteTagsHelp')}</Form.Group.Text>
                  <Form.Group.Checkbox
                    id="delete-tags-checkbox"
                    label={t('editFileTagsModal.deleteTagsCheckboxLabel')}
                  />
                </Col>
              </Stack>
            </Stack> */}
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
