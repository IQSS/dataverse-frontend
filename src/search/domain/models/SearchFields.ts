/**
 * This class is inspired by https://github.com/IQSS/dataverse/blob/develop/src/main/java/edu/harvard/iq/dataverse/search/SearchFields.java
 */

export class SearchFields {
  public static readonly DATAVERSE_NAME = 'dvName'
  public static readonly DATAVERSE_ALIAS = 'dvAlias'
  public static readonly DATAVERSE_AFFILIATION = 'dvAffiliation'
  public static readonly DATAVERSE_DESCRIPTION = 'dvDescription'
  public static readonly DATAVERSE_SUBJECT = 'dvSubject'

  public static readonly FILE_NAME = 'fileName'
  public static readonly FILE_DESCRIPTION = 'fileDescription'
  public static readonly FILE_TYPE_SEARCHABLE = 'fileType'
  public static readonly FILE_PERSISTENT_ID = 'filePersistentId'

  public static readonly VARIABLE_NAME = 'variableName'
  public static readonly VARIABLE_LABEL = 'variableLabel'

  public static readonly FILE_TAG_SEARCHABLE = 'fileTags'
}
