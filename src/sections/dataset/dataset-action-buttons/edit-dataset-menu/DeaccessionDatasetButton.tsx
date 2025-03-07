import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Dataset } from '../../../../dataset/domain/models/Dataset'
import { DropdownButtonItem, DropdownSeparator } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { DeaccessionDatasetModal } from '@/sections/dataset/deaccession-dataset/DeaccessionDatasetModal'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { DeaccessionFormData } from '@/sections/dataset/deaccession-dataset/DeaccessionFormData'
import { useDeaccessionDataset } from '@/sections/dataset/deaccession-dataset/useDeaccessionDataset'
import { QueryParamKey, Route } from '@/sections/Route.enum'
import { ConfirmationModal } from '@/sections/dataset/deaccession-dataset/ConfirmationModal'
import { useForm, SubmitHandler } from 'react-hook-form'

interface DeaccessionDatasetButtonProps {
  dataset: Dataset
  datasetRepository: DatasetRepository
}

export function DeaccessionDatasetButton({
  dataset,
  datasetRepository
}: DeaccessionDatasetButtonProps) {
  const { t } = useTranslation('dataset')
  const navigate = useNavigate()
  const [showDeaccessionModal, setShowDeaccessionModal] = useState(false)
  const [showConfirmationModal, setShowConfirmationModal] = useState(false)
  const { submissionStatus, submitDeaccession, deaccessionError } = useDeaccessionDataset(
    datasetRepository,
    dataset.persistentId,
    onDeaccessionSucceed
  )
  const publishedVersions =
    dataset.versionsSummaries?.filter(
      (version) => version.publishedOn && version.summary !== 'versionDeaccessioned'
    ) || []
  const defaultVersions = publishedVersions.length === 1 ? [publishedVersions[0].versionNumber] : []

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<DeaccessionFormData>({
    defaultValues: { versions: defaultVersions, deaccessionForwardUrl: '' }
  })

  if (
    !dataset.version.someDatasetVersionHasBeenReleased ||
    !dataset.permissions.canPublishDataset ||
    publishedVersions.length === 0
  ) {
    return <></>
  }
  const handleOpen = () => setShowDeaccessionModal(true)
  const handleClose = () => setShowDeaccessionModal(false)
  const handleConfirm = () => {
    setShowDeaccessionModal(false)
    setShowConfirmationModal(true)
  }
  const handleCancelConfirmation = () => {
    console.log('handleCancelConfirmation')
    setShowConfirmationModal(false)
  }
  const handleSubmitForm: SubmitHandler<DeaccessionFormData> = (data) => {
    handleConfirm()
  }
  const handleConfirmDeaccession = () => {
    console.log('handleConfirmDeaccession')
    const formData = watch()
    console.log('formData', formData)
    submitDeaccession(formData)
    setShowConfirmationModal(false)
  }

  function onDeaccessionSucceed() {
    navigate(`${Route.DATASETS}?${QueryParamKey.PERSISTENT_ID}=${dataset.persistentId}`)
    handleClose()
    toast.success('Dataset deaccessioned successfully')
    window.location.reload()
  }

  return (
    <>
      <DropdownSeparator />
      <DropdownButtonItem onClick={handleOpen}>
        {t('datasetActionButtons.editDataset.deaccession')}
      </DropdownButtonItem>
      <DeaccessionDatasetModal
        show={showDeaccessionModal}
        publishedVersions={publishedVersions}
        handleClose={handleClose}
        handleSubmitForm={handleSubmit(handleSubmitForm)}
        control={control}
        errors={errors}
        setValue={setValue}
      />
      <ConfirmationModal
        submissionStatus={submissionStatus}
        deaccessionError={deaccessionError}
        show={showConfirmationModal}
        onConfirm={handleConfirmDeaccession}
        onCancel={handleCancelConfirmation}
      />
    </>
  )
}
