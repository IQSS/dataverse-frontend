import { MetadataBlockInfo } from '../../../../../src/metadata-block-info/domain/models/MetadataBlockInfo'

export class JournalMetadataBlockInfoMother {
  static get(): MetadataBlockInfo {
    return {
      id: 6,
      name: 'journal',
      displayName: 'Journal Metadata',
      displayOnCreate: false,
      metadataFields: {
        journalVolumeIssue: {
          name: 'journalVolumeIssue',
          displayName: 'Journal',
          title: 'Journal',
          type: 'NONE',
          watermark: '',
          description:
            'Indicates the volume, issue and date of a journal, which this Dataset is associated with.',
          multiple: true,
          isControlledVocabulary: false,
          displayFormat: '',
          isRequired: false,
          displayOrder: 0,
          typeClass: 'compound',
          displayOnCreate: false,
          isAdvancedSearchFieldType: false,
          childMetadataFields: {
            journalVolume: {
              name: 'journalVolume',
              displayName: 'Journal Volume',
              title: 'Volume',
              type: 'TEXT',
              watermark: '',
              description:
                'The journal volume which this Dataset is associated with (e.g., Volume 4).',
              multiple: false,
              isControlledVocabulary: false,
              displayFormat: '',
              isRequired: false,
              displayOrder: 1,
              typeClass: 'primitive',
              displayOnCreate: false,
              isAdvancedSearchFieldType: false
            },
            journalIssue: {
              name: 'journalIssue',
              displayName: 'Journal Issue',
              title: 'Issue',
              type: 'TEXT',
              watermark: '',
              description:
                'The journal issue number which this Dataset is associated with (e.g., Number 2, Autumn).',
              multiple: false,
              isControlledVocabulary: false,
              displayFormat: '',
              isRequired: false,
              displayOrder: 2,
              typeClass: 'primitive',
              displayOnCreate: false,
              isAdvancedSearchFieldType: false
            },
            journalPubDate: {
              name: 'journalPubDate',
              displayName: 'Journal Publication Date',
              title: 'Publication Date',
              type: 'DATE',
              watermark: 'YYYY or YYYY-MM or YYYY-MM-DD',
              description:
                'The publication date for this journal volume/issue, which this Dataset is associated with (e.g., 1999).',
              multiple: false,
              isControlledVocabulary: false,
              displayFormat: '',
              isRequired: false,
              displayOrder: 3,
              typeClass: 'primitive',
              displayOnCreate: false,
              isAdvancedSearchFieldType: false
            }
          }
        },
        journalArticleType: {
          name: 'journalArticleType',
          displayName: 'Type of Article',
          title: 'Type of Article',
          type: 'TEXT',
          watermark: '',
          description:
            'Indicates what kind of article this is, for example, a research article, a commentary, a book or product review, a case report, a calendar, etc (based on JATS). ',
          multiple: false,
          isControlledVocabulary: true,
          controlledVocabularyValues: [
            'abstract',
            'addendum',
            'announcement',
            'article-commentary',
            'book review',
            'books received',
            'brief report',
            'calendar',
            'case report',
            'collection',
            'correction',
            'data paper',
            'discussion',
            'dissertation',
            'editorial',
            'in brief',
            'introduction',
            'letter',
            'meeting report',
            'news',
            'obituary',
            'oration',
            'partial retraction',
            'product review',
            'rapid communication',
            'reply',
            'reprint',
            'research article',
            'retraction',
            'review article',
            'translation',
            'other'
          ],
          displayFormat: '',
          isRequired: false,
          displayOrder: 4,
          typeClass: 'controlledVocabulary',
          displayOnCreate: false,
          isAdvancedSearchFieldType: false
        }
      }
    }
  }
}
