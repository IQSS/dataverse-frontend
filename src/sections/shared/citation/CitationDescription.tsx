import parse from 'html-react-parser'

interface CitationDescriptionProps {
  citation: string
}

export function CitationDescription({ citation }: CitationDescriptionProps) {
  const citationAsReactElement = parse(citation)

  return <span>{citationAsReactElement}</span>
}
