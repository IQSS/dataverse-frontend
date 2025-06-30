import { useWatch } from 'react-hook-form'

interface UseFieldsHaveValueProps {
  itemIndex: number
}
/**
 *
 * @description Hook to determine if the featured item fields have values. Used to show a confirmation dialog when the user tries to go back or remove the item.
 */
export const useShowConfirmDialog = ({ itemIndex }: UseFieldsHaveValueProps): boolean => {
  const [dvObjectUrlValue, customContentValue, customImageValue] = useWatch({
    name: [
      `featuredItems.${itemIndex}.dvObjectUrl`,
      `featuredItems.${itemIndex}.content`,
      `featuredItems.${itemIndex}.image`
    ]
  }) as [string | undefined | null, string | undefined | null, File | undefined | null]

  const isDvObjectUrlEmpty = !dvObjectUrlValue || dvObjectUrlValue.trim() === ''

  const isCustomContentEmpty =
    customContentValue?.replace(/<p[^>]*>|<\/p>/g, '').trim() === '' ||
    customContentValue === '' ||
    customContentValue === undefined

  const isCustomImageEmpty = customImageValue === null || customImageValue === undefined

  const shouldShowConfirmDialog =
    !isDvObjectUrlEmpty || !isCustomContentEmpty || !isCustomImageEmpty

  return shouldShowConfirmDialog
}
