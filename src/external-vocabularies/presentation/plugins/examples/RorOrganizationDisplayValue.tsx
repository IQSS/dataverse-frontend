import { ExternalVocabularyDisplayValuePluginProps } from '../ExternalVocabularyPlugin'
import { isHttpUri } from './pluginMatching'

export function RorOrganizationDisplayValue({
  metadataFieldValue
}: ExternalVocabularyDisplayValuePluginProps) {
  if (Array.isArray(metadataFieldValue)) {
    return (
      <>
        {metadataFieldValue.map((value) => (
          <RorOrganizationValue key={String(value)} value={String(value)} />
        ))}
      </>
    )
  }

  return <RorOrganizationValue value={String(metadataFieldValue)} />
}

function RorOrganizationValue({ value }: { value: string }) {
  if (!isHttpUri(value)) {
    return <span>{value}</span>
  }

  return (
    <a href={value} target="_blank" rel="noreferrer">
      ROR: {value.replace('https://ror.org/', '')}
    </a>
  )
}
