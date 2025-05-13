import { useState, ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Controller, UseControllerProps, useFormContext } from 'react-hook-form'
import { Button, Col, Form, Stack, Tooltip } from '@iqss/dataverse-design-system'
import {
  ArrowDownUp,
  ArrowCounterclockwise,
  XLg,
  ExclamationCircleFill
} from 'react-bootstrap-icons'
import cn from 'classnames'
import { FeaturedItemsFormHelper } from '../FeaturedItemsFormHelper'
import { appendTimestampToImageUrl } from '@/sections/collection/featured-items/custom-featured-item-card/CustomFeaturedItemCard'
import styles from './FeaturedItemField.module.scss'

interface ImageFieldProps {
  itemIndex: number
  initialImageUrl?: string
}

export const FEATURED_ITEM_IMAGE_MAX_SIZE_ACCEPTED = 1_000_000 // 1MB

export const ImageField = ({ itemIndex, initialImageUrl }: ImageFieldProps) => {
  const { control, setValue } = useFormContext()
  const { t } = useTranslation('editCollectionFeaturedItems')
  const [selectedFileObjectURL, setSelectedFileObjectURL] = useState<string | null>(null)
  const [imageAspectRatio, setImageAspectRatio] = useState<{
    hasRecommendedAspectRatio: boolean
    aspectRatioStringValue: string
  } | null>(null)

  let fileInputRef: HTMLInputElement | null = null

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
    formOnChange: (...event: unknown[]) => void
  ) => {
    const file = e.target.files?.[0]

    if (file) {
      const { hasRecommendedAspectRatio, aspectRatioStringValue } =
        await FeaturedItemsFormHelper.hasRecommendedAspectRatio(file)

      setImageAspectRatio({
        hasRecommendedAspectRatio,
        aspectRatioStringValue
      })

      setSelectedFileObjectURL(URL.createObjectURL(file))
    }

    formOnChange(file || /* istanbul ignore next */ null)
  }

  const rules: UseControllerProps['rules'] = {
    validate: (value) => {
      if (value instanceof File && value.size > FEATURED_ITEM_IMAGE_MAX_SIZE_ACCEPTED) {
        return t('form.image.invalid.size', {
          maxImageSize: FeaturedItemsFormHelper.formatBytes(FEATURED_ITEM_IMAGE_MAX_SIZE_ACCEPTED)
        })
      }
      return true
    }
  }

  const handleClickChangeImage = () => fileInputRef?.click()

  const handleRemoveImage = () => {
    selectedFileObjectURL && URL.revokeObjectURL(selectedFileObjectURL)
    setSelectedFileObjectURL(null)
    setImageAspectRatio(null)

    fileInputRef?.value && (fileInputRef.value = '')

    setValue(`featuredItems.${itemIndex}.image`, null, {
      shouldDirty: true,
      shouldValidate: true
    })
  }

  const handleRestoreInitialImage = () => {
    selectedFileObjectURL && URL.revokeObjectURL(selectedFileObjectURL)
    setSelectedFileObjectURL(null)
    setImageAspectRatio(null)

    fileInputRef?.value && (fileInputRef.value = '')

    setValue(`featuredItems.${itemIndex}.image`, initialImageUrl, {
      shouldDirty: true,
      shouldValidate: true
    })
  }

  const showAspectRatioWarning = imageAspectRatio && !imageAspectRatio.hasRecommendedAspectRatio

  return (
    <Form.Group
      className={styles['form-group-image']}
      controlId={`featuredItems.${itemIndex}.image`}
      as={Col}>
      <Form.Group.Label
        required={false}
        message={t('form.image.description', {
          maxImageSize: FeaturedItemsFormHelper.formatBytes(FEATURED_ITEM_IMAGE_MAX_SIZE_ACCEPTED)
        })}>
        {t('form.image.label')}
      </Form.Group.Label>

      <Controller
        name={`featuredItems.${itemIndex}.image`}
        control={control}
        rules={rules}
        render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => {
          const castedImageValue = value as string | File | null

          const isNewFileSelected = castedImageValue instanceof File
          const isExistingFile = typeof castedImageValue === 'string' && castedImageValue !== ''
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
                  <Tooltip placement="top" overlay={t('form.image.restoreInitial')}>
                    <Button
                      type="button"
                      onClick={handleRestoreInitialImage}
                      aria-label={t('form.image.restoreInitial')}>
                      <ArrowCounterclockwise />
                    </Button>
                  </Tooltip>
                )}
              </Stack>
              <div
                className={cn(styles['image-wrapper'], {
                  [styles['hide']]: showFileInput
                })}>
                {isExistingFile && (
                  <img
                    src={appendTimestampToImageUrl(castedImageValue)}
                    alt="Image preview"
                    data-testid={`existing-file-img-${itemIndex.toString()}`}
                  />
                )}
                {isNewFileSelected && selectedFileObjectURL && (
                  <img
                    src={selectedFileObjectURL}
                    alt="Image preview"
                    data-testid={`selected-file-img-${itemIndex.toString()}`}
                  />
                )}
                <div className={styles['image-actions']}>
                  {initialImageUrl && selectedFileObjectURL && (
                    <Tooltip placement="top" overlay={t('form.image.restoreInitial')}>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleRestoreInitialImage}
                        aria-label={t('form.image.restoreInitial')}>
                        <ArrowCounterclockwise />
                      </Button>
                    </Tooltip>
                  )}

                  <Tooltip placement="top" overlay={t('form.image.changeImage')}>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleClickChangeImage}
                      aria-label={t('form.image.changeImage')}>
                      <ArrowDownUp />
                    </Button>
                  </Tooltip>

                  <Tooltip placement="top" overlay={t('form.image.removeImage')}>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleRemoveImage}
                      aria-label={t('form.image.removeImage')}>
                      <XLg />
                    </Button>
                  </Tooltip>
                </div>
              </div>
              {invalid && <div className={styles['error-msg']}>{error?.message}</div>}
              {!showAspectRatioWarning && !invalid && (
                <Form.Group.Text>{t('form.image.helperText')}</Form.Group.Text>
              )}
              {showAspectRatioWarning && !invalid && (
                <div className={styles['aspect-ratio-warning']}>
                  <div>
                    <ExclamationCircleFill size={18} />
                  </div>
                  <span>
                    {t('form.image.aspectRatioWarning', {
                      aspectRatio: imageAspectRatio.aspectRatioStringValue
                    })}
                  </span>
                </div>
              )}
            </Col>
          )
        }}
      />
    </Form.Group>
  )
}
