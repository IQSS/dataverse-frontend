const PUBLICATION_RELATION_TYPE_FIELD_NAME = 'publicationRelationType'

const PUBLICATION_RELATION_TYPE_LABELS: Readonly<Record<string, string>> = {
  IsCitedBy: 'Is Cited By',
  Cites: 'Cites',
  IsSupplementTo: 'Is Supplement To',
  IsSupplementedBy: 'Is Supplemented By',
  IsReferencedBy: 'Is Referenced By',
  References: 'References'
}

/**
 * Returns the human-readable label for controlled vocabulary values that need
 * presentation-specific formatting. The original value remains the value used
 * by forms, APIs, and stored metadata.
 */
export function getControlledVocabularyValueLabel(fieldName: string, value: string): string {
  if (fieldName !== PUBLICATION_RELATION_TYPE_FIELD_NAME) {
    return value
  }

  return PUBLICATION_RELATION_TYPE_LABELS[value] ?? value
}
