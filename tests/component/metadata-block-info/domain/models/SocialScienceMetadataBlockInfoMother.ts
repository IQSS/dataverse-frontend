import { MetadataBlockInfo } from '../../../../../src/metadata-block-info/domain/models/MetadataBlockInfo'

export class SocialScienceMetadataBlockInfoMother {
  static get(): MetadataBlockInfo {
    return {
      id: 3,
      name: 'socialscience',
      displayName: 'Social Science and Humanities Metadata',
      displayOnCreate: false,
      metadataFields: {
        unitOfAnalysis: {
          name: 'unitOfAnalysis',
          displayName: 'Unit of Analysis',
          title: 'Unit of Analysis',
          type: 'TEXTBOX',
          watermark: '',
          description:
            "Basic unit of analysis or observation that this Dataset describes, such as individuals, families/households, groups, institutions/organizations, administrative units, and more. For information about the DDI's controlled vocabulary for this element, please refer to the DDI web page at http://www.ddialliance.org/controlled-vocabularies.",
          multiple: true,
          isControlledVocabulary: false,
          displayFormat: '',
          isRequired: false,
          displayOrder: 0,
          typeClass: 'primitive',
          displayOnCreate: false
        },
        universe: {
          name: 'universe',
          displayName: 'Universe',
          title: 'Universe',
          type: 'TEXTBOX',
          watermark: '',
          description:
            'Description of the population covered by the data in the file; the group of people or other elements that are the object of the study and to which the study results refer. Age, nationality, and residence commonly help to  delineate a given universe, but any number of other factors may be used, such as age limits, sex, marital status, race, ethnic group, nationality, income, veteran status, criminal convictions, and more. The universe may consist of elements other than persons, such as housing units, court cases, deaths, countries, and so on. In general, it should be possible to tell from the description of the universe whether a given individual or element is a member of the population under study. Also known as the universe of interest, population of interest, and target population.',
          multiple: true,
          isControlledVocabulary: false,
          displayFormat: '',
          isRequired: false,
          displayOrder: 1,
          typeClass: 'primitive',
          displayOnCreate: false
        },
        timeMethod: {
          name: 'timeMethod',
          displayName: 'Time Method',
          title: 'Time Method',
          type: 'TEXT',
          watermark: '',
          description:
            'The time method or time dimension of the data collection, such as panel, cross-sectional, trend, time- series, or other.',
          multiple: false,
          isControlledVocabulary: false,
          displayFormat: '',
          isRequired: false,
          displayOrder: 2,
          typeClass: 'primitive',
          displayOnCreate: false
        },
        dataCollector: {
          name: 'dataCollector',
          displayName: 'Data Collector',
          title: 'Data Collector',
          type: 'TEXT',
          watermark: 'FamilyName, GivenName or Organization',
          description:
            'Individual, agency or organization responsible for  administering the questionnaire or interview or compiling the data.',
          multiple: false,
          isControlledVocabulary: false,
          displayFormat: '',
          isRequired: false,
          displayOrder: 3,
          typeClass: 'primitive',
          displayOnCreate: false
        },
        collectorTraining: {
          name: 'collectorTraining',
          displayName: 'Collector Training',
          title: 'Collector Training',
          type: 'TEXT',
          watermark: '',
          description: 'Type of training provided to the data collector',
          multiple: false,
          isControlledVocabulary: false,
          displayFormat: '',
          isRequired: false,
          displayOrder: 4,
          typeClass: 'primitive',
          displayOnCreate: false
        },
        frequencyOfDataCollection: {
          name: 'frequencyOfDataCollection',
          displayName: 'Frequency',
          title: 'Frequency',
          type: 'TEXT',
          watermark: '',
          description:
            'If the data collected includes more than one point in time, indicate the frequency with which the data was collected; that is, monthly, quarterly, or other.',
          multiple: false,
          isControlledVocabulary: false,
          displayFormat: '',
          isRequired: false,
          displayOrder: 5,
          typeClass: 'primitive',
          displayOnCreate: false
        },
        samplingProcedure: {
          name: 'samplingProcedure',
          displayName: 'Sampling Procedure',
          title: 'Sampling Procedure',
          type: 'TEXTBOX',
          watermark: '',
          description:
            'Type of sample and sample design used to select the survey respondents to represent the population. May include reference to the target sample size and the sampling fraction.',
          multiple: false,
          isControlledVocabulary: false,
          displayFormat: '',
          isRequired: false,
          displayOrder: 6,
          typeClass: 'primitive',
          displayOnCreate: false
        },
        targetSampleSize: {
          name: 'targetSampleSize',
          displayName: 'Target Sample Size',
          title: 'Target Sample Size',
          type: 'NONE',
          watermark: '',
          description:
            'Specific information regarding the target sample size, actual  sample size, and the formula used to determine this.',
          multiple: false,
          isControlledVocabulary: false,
          displayFormat: '',
          isRequired: false,
          displayOrder: 7,
          typeClass: 'compound',
          displayOnCreate: false,
          childMetadataFields: {
            targetSampleActualSize: {
              name: 'targetSampleActualSize',
              displayName: 'Target Sample Size Actual',
              title: 'Actual',
              type: 'INT',
              watermark: 'Enter an integer...',
              description: 'Actual sample size.',
              multiple: false,
              isControlledVocabulary: false,
              displayFormat: '',
              isRequired: false,
              displayOrder: 8,
              typeClass: 'primitive',
              displayOnCreate: false
            },
            targetSampleSizeFormula: {
              name: 'targetSampleSizeFormula',
              displayName: 'Target Sample Size Formula',
              title: 'Formula',
              type: 'TEXT',
              watermark: '',
              description: 'Formula used to determine target sample size.',
              multiple: false,
              isControlledVocabulary: false,
              displayFormat: '',
              isRequired: false,
              displayOrder: 9,
              typeClass: 'primitive',
              displayOnCreate: false
            }
          }
        },
        deviationsFromSampleDesign: {
          name: 'deviationsFromSampleDesign',
          displayName: 'Major Deviations for Sample Design',
          title: 'Major Deviations for Sample Design',
          type: 'TEXT',
          watermark: '',
          description:
            'Show correspondence as well as discrepancies between the sampled units (obtained) and available statistics for the population (age, sex-ratio, marital status, etc.) as a whole.',
          multiple: false,
          isControlledVocabulary: false,
          displayFormat: '',
          isRequired: false,
          displayOrder: 10,
          typeClass: 'primitive',
          displayOnCreate: false
        },
        collectionMode: {
          name: 'collectionMode',
          displayName: 'Collection Mode',
          title: 'Collection Mode',
          type: 'TEXTBOX',
          watermark: '',
          description:
            'Method used to collect the data; instrumentation characteristics (e.g., telephone interview, mail questionnaire, or other).',
          multiple: true,
          isControlledVocabulary: false,
          displayFormat: '',
          isRequired: false,
          displayOrder: 11,
          typeClass: 'primitive',
          displayOnCreate: false
        },
        researchInstrument: {
          name: 'researchInstrument',
          displayName: 'Type of Research Instrument',
          title: 'Type of Research Instrument',
          type: 'TEXT',
          watermark: '',
          description:
            'Type of data collection instrument used. Structured indicates an instrument in which all respondents are asked the same questions/tests, possibly with precoded answers. If a small portion of such a questionnaire includes open-ended questions, provide appropriate comments. Semi-structured indicates that the research instrument contains mainly open-ended questions. Unstructured indicates that in-depth interviews were conducted.',
          multiple: false,
          isControlledVocabulary: false,
          displayFormat: '',
          isRequired: false,
          displayOrder: 12,
          typeClass: 'primitive',
          displayOnCreate: false
        },
        dataCollectionSituation: {
          name: 'dataCollectionSituation',
          displayName: 'Characteristics of Data Collection Situation',
          title: 'Characteristics of Data Collection Situation',
          type: 'TEXTBOX',
          watermark: '',
          description:
            'Description of noteworthy aspects of the data collection situation. Includes information on factors such as cooperativeness of respondents, duration of interviews, number of call backs, or similar.',
          multiple: false,
          isControlledVocabulary: false,
          displayFormat: '',
          isRequired: false,
          displayOrder: 13,
          typeClass: 'primitive',
          displayOnCreate: false
        },
        actionsToMinimizeLoss: {
          name: 'actionsToMinimizeLoss',
          displayName: 'Actions to Minimize Losses',
          title: 'Actions to Minimize Losses',
          type: 'TEXT',
          watermark: '',
          description:
            'Summary of actions taken to minimize data loss. Include information on actions such as follow-up visits, supervisory checks, historical matching, estimation, and so on.',
          multiple: false,
          isControlledVocabulary: false,
          displayFormat: '',
          isRequired: false,
          displayOrder: 14,
          typeClass: 'primitive',
          displayOnCreate: false
        },
        controlOperations: {
          name: 'controlOperations',
          displayName: 'Control Operations',
          title: 'Control Operations',
          type: 'TEXT',
          watermark: '',
          description:
            'Control OperationsMethods to facilitate data control performed by the primary investigator or by the data archive.',
          multiple: false,
          isControlledVocabulary: false,
          displayFormat: '',
          isRequired: false,
          displayOrder: 15,
          typeClass: 'primitive',
          displayOnCreate: false
        },
        weighting: {
          name: 'weighting',
          displayName: 'Weighting',
          title: 'Weighting',
          type: 'TEXTBOX',
          watermark: '',
          description:
            'The use of sampling procedures might make it necessary to apply weights to produce accurate statistical results. Describes the criteria for using weights in analysis of a collection. If a weighting formula or coefficient was developed, the formula is provided, its elements are defined, and it is indicated how the formula was applied to the data.',
          multiple: false,
          isControlledVocabulary: false,
          displayFormat: '',
          isRequired: false,
          displayOrder: 16,
          typeClass: 'primitive',
          displayOnCreate: false
        },
        cleaningOperations: {
          name: 'cleaningOperations',
          displayName: 'Cleaning Operations',
          title: 'Cleaning Operations',
          type: 'TEXT',
          watermark: '',
          description:
            'Methods used to clean the data collection, such as consistency checking, wildcode checking, or other.',
          multiple: false,
          isControlledVocabulary: false,
          displayFormat: '',
          isRequired: false,
          displayOrder: 17,
          typeClass: 'primitive',
          displayOnCreate: false
        },
        datasetLevelErrorNotes: {
          name: 'datasetLevelErrorNotes',
          displayName: 'Study Level Error Notes',
          title: 'Study Level Error Notes',
          type: 'TEXT',
          watermark: '',
          description:
            'Note element used for any information annotating or clarifying the methodology and processing of the study. ',
          multiple: false,
          isControlledVocabulary: false,
          displayFormat: '',
          isRequired: false,
          displayOrder: 18,
          typeClass: 'primitive',
          displayOnCreate: false
        },
        responseRate: {
          name: 'responseRate',
          displayName: 'Response Rate',
          title: 'Response Rate',
          type: 'TEXTBOX',
          watermark: '',
          description: 'Percentage of sample members who provided information.',
          multiple: false,
          isControlledVocabulary: false,
          displayFormat: '',
          isRequired: false,
          displayOrder: 19,
          typeClass: 'primitive',
          displayOnCreate: false
        },
        samplingErrorEstimates: {
          name: 'samplingErrorEstimates',
          displayName: 'Estimates of Sampling Error',
          title: 'Estimates of Sampling Error',
          type: 'TEXT',
          watermark: '',
          description:
            'Measure of how precisely one can estimate a population value from a given sample.',
          multiple: false,
          isControlledVocabulary: false,
          displayFormat: '',
          isRequired: false,
          displayOrder: 20,
          typeClass: 'primitive',
          displayOnCreate: false
        },
        otherDataAppraisal: {
          name: 'otherDataAppraisal',
          displayName: 'Other Forms of Data Appraisal',
          title: 'Other Forms of Data Appraisal',
          type: 'TEXT',
          watermark: '',
          description:
            'Other issues pertaining to the data appraisal. Describe issues such as response variance, nonresponse rate  and testing for bias, interviewer and response bias, confidence levels, question bias, or similar.',
          multiple: false,
          isControlledVocabulary: false,
          displayFormat: '',
          isRequired: false,
          displayOrder: 21,
          typeClass: 'primitive',
          displayOnCreate: false
        },
        socialScienceNotes: {
          name: 'socialScienceNotes',
          displayName: 'Notes',
          title: 'Notes',
          type: 'NONE',
          watermark: '',
          description: 'General notes about this Dataset.',
          multiple: false,
          isControlledVocabulary: false,
          displayFormat: '',
          isRequired: false,
          displayOrder: 22,
          typeClass: 'compound',
          displayOnCreate: false,
          childMetadataFields: {
            socialScienceNotesType: {
              name: 'socialScienceNotesType',
              displayName: 'Notes Type',
              title: 'Type',
              type: 'TEXT',
              watermark: '',
              description: 'Type of note.',
              multiple: false,
              isControlledVocabulary: false,
              displayFormat: '',
              isRequired: false,
              displayOrder: 23,
              typeClass: 'primitive',
              displayOnCreate: false
            },
            socialScienceNotesSubject: {
              name: 'socialScienceNotesSubject',
              displayName: 'Notes Subject',
              title: 'Subject',
              type: 'TEXT',
              watermark: '',
              description: 'Note subject.',
              multiple: false,
              isControlledVocabulary: false,
              displayFormat: '',
              isRequired: false,
              displayOrder: 24,
              typeClass: 'primitive',
              displayOnCreate: false
            },
            socialScienceNotesText: {
              name: 'socialScienceNotesText',
              displayName: 'Notes Text',
              title: 'Text',
              type: 'TEXTBOX',
              watermark: '',
              description: 'Text for this note.',
              multiple: false,
              isControlledVocabulary: false,
              displayFormat: '',
              isRequired: false,
              displayOrder: 25,
              typeClass: 'primitive',
              displayOnCreate: false
            }
          }
        }
      }
    }
  }
}
