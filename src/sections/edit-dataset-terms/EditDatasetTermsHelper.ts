export class EditDatasetTermsHelper {
  static EDIT_DATASET_TERMS_TABS_KEYS = {
    datasetTerms: 'datasetTerms',
    restrictedFilesTerms: 'restrictedFilesTerms',
    guestBook: 'guestBook'
  } as const

  static EDIT_DATASET_TERMS_TAB_QUERY_KEY = 'tab'

  public static defineSelectedTabKey(searchParams: URLSearchParams): EditDatasetTermsTabKey {
    const tabValue = searchParams.get(this.EDIT_DATASET_TERMS_TAB_QUERY_KEY)

    return (
      this.EDIT_DATASET_TERMS_TABS_KEYS[
        tabValue as keyof typeof this.EDIT_DATASET_TERMS_TABS_KEYS
      ] ?? this.EDIT_DATASET_TERMS_TABS_KEYS.datasetTerms
    )
  }
}

export type EditDatasetTermsTabKey =
  (typeof EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS)[keyof typeof EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS]
