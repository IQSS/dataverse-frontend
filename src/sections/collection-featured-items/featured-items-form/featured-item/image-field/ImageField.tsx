import { useState, ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Controller, UseControllerProps, useFormContext } from 'react-hook-form'
import { Button, Col, Form, Stack } from '@iqss/dataverse-design-system'
import { X as CloseIcon, ArrowDownUp, ArrowCounterclockwise } from 'react-bootstrap-icons'
import cn from 'classnames'
import styles from '../FeaturedItem.module.scss'

// TODO:ME - Add tooltips

interface ImageFieldProps {
  itemIndex: number
  initialImageUrl?: string
}

interface FormattedSelectedFile {
  size: number
  type: string
  name: string
  objectUrl: string
}

const IMAGE_MAX_SIZE_ACCEPTED = 1_000_000 // 1MB

export const ImageField = ({ itemIndex, initialImageUrl }: ImageFieldProps) => {
  const { control, setValue } = useFormContext()
  const { t } = useTranslation('collectionFeaturedItems')
  const [formattedSelectedFile, setFormattedSelectedFile] = useState<FormattedSelectedFile | null>(
    null
  )

  let fileInputRef: HTMLInputElement | null = null

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    formOnChange: (...event: unknown[]) => void
  ) => {
    const file = e.target.files?.[0]

    if (file) {
      const formattedFile: FormattedSelectedFile = {
        size: file.size,
        type: file.type,
        name: file.name,
        objectUrl: URL.createObjectURL(file)
      }

      setFormattedSelectedFile(formattedFile)
    }

    formOnChange(file || null)
  }

  const rules: UseControllerProps['rules'] = {
    validate: (value) => {
      if (value instanceof File && value.size > IMAGE_MAX_SIZE_ACCEPTED) {
        return t('form.image.invalid.size', { maxImageSize: formatBytes(IMAGE_MAX_SIZE_ACCEPTED) })
      }
      return true
    }
  }

  const handleClickChangeImage = () => fileInputRef?.click()

  const handleRemoveImage = () => {
    setFormattedSelectedFile(null)
    fileInputRef?.value && (fileInputRef.value = '')
    setValue(`featuredItems.${itemIndex}.image`, null, {
      shouldDirty: true,
      shouldValidate: true
    })
  }

  const handleRestoreInitialImage = () => {
    setFormattedSelectedFile(null)
    fileInputRef?.value && (fileInputRef.value = '')
    setValue(`featuredItems.${itemIndex}.image`, initialImageUrl, {
      shouldDirty: true,
      shouldValidate: true
    })
  }

  return (
    <Form.Group controlId={`featuredItems.${itemIndex}.image`} as={Col} md={6}>
      <Form.Group.Label required={false} message={t('form.image.description')}>
        {t('form.image.label')}
      </Form.Group.Label>

      <Controller
        name={`featuredItems.${itemIndex}.image`}
        control={control}
        rules={rules}
        render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => {
          const castedValue = value as string | File | null

          const isNewFileSelected = castedValue instanceof File
          const isExistingFile = typeof castedValue === 'string' && castedValue !== ''
          const showFileInput = (!isNewFileSelected && !isExistingFile) || invalid

          return (
            <Col>
              <Stack direction="horizontal" gap={2}>
                <Form.Group.Input
                  type="file"
                  accept=".png, .jpg, .jpeg, .webp"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileChange(e, onChange)}
                  isInvalid={invalid}
                  style={{ display: showFileInput ? 'block' : 'none' }}
                  ref={(elem: HTMLInputElement | null) => {
                    ref(elem)
                    fileInputRef = elem
                  }}
                />
                {showFileInput && initialImageUrl && (
                  <Button onClick={handleRestoreInitialImage} aria-label="Restore initial image">
                    <ArrowCounterclockwise />
                  </Button>
                )}
              </Stack>
              <div
                className={cn(styles['image-wrapper'], {
                  [styles['hide']]: showFileInput
                })}>
                {isExistingFile && <img src={castedValue} alt="Image preview" />}
                {isNewFileSelected && (
                  <img src={formattedSelectedFile?.objectUrl} alt="Image preview" />
                )}

                <Button type="button" onClick={handleClickChangeImage} aria-label="Change image">
                  <ArrowDownUp />
                </Button>
                <Button type="button" onClick={handleRemoveImage} aria-label="Remove image">
                  <CloseIcon />
                </Button>
              </div>

              {invalid && <div className={styles['error-msg']}>{error?.message}</div>}
            </Col>
          )
        }}
      />
    </Form.Group>
  )
}

const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
