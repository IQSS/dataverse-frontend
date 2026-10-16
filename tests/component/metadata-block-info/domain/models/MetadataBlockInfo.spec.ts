import type { TFunction } from 'i18next'

import {
  getPublicationRelationLabel,
  PUBLICATION_RELATION_TYPE_VALUES
} from '@/metadata-block-info/domain/models/MetadataBlockInfo'

const t = ((key: string) => `translated:${key}`) as TFunction

describe('getPublicationRelationLabel', () => {
  PUBLICATION_RELATION_TYPE_VALUES.forEach((value) => {
    it(`returns the translated label for publication relation type "${value}"`, () => {
      expect(getPublicationRelationLabel(value, t)).to.equal(
        `translated:publicationRelationTypes.${value}`
      )
    })
  })

  it('falls back to the original value for an unknown publication relation type', () => {
    expect(getPublicationRelationLabel('IsDerivedFrom', t)).to.equal('IsDerivedFrom')
  })

  it('defines every publication relation type in each locale', () => {
    const supportedLanguages = ['en', 'es']

    supportedLanguages.forEach((language) => {
      cy.readFile<{ publicationRelationTypes: Record<string, string> }>(
        `public/locales/${language}/shared.json`
      ).then((translations) => {
        expect(Object.keys(translations.publicationRelationTypes)).to.deep.equal([
          ...PUBLICATION_RELATION_TYPE_VALUES
        ])
      })
    })
  })
})
