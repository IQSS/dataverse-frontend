import { getControlledVocabularyValueLabel } from '@/metadata-block-info/domain/models/ControlledVocabularyValueLabel'

describe('getControlledVocabularyValueLabel', () => {
  const relationTypeLabels = {
    IsCitedBy: 'Is Cited By',
    Cites: 'Cites',
    IsSupplementTo: 'Is Supplement To',
    IsSupplementedBy: 'Is Supplemented By',
    IsReferencedBy: 'Is Referenced By',
    References: 'References'
  }

  Object.entries(relationTypeLabels).forEach(([value, label]) => {
    it(`returns "${label}" for publication relation type value "${value}"`, () => {
      expect(getControlledVocabularyValueLabel('publicationRelationType', value)).to.equal(label)
    })
  })

  it('falls back to the original value for an unknown publication relation type', () => {
    expect(getControlledVocabularyValueLabel('publicationRelationType', 'IsDerivedFrom')).to.equal(
      'IsDerivedFrom'
    )
  })

  it('does not change values belonging to other controlled vocabulary fields', () => {
    expect(getControlledVocabularyValueLabel('authorIdentifierScheme', 'ResearcherID')).to.equal(
      'ResearcherID'
    )
  })
})
