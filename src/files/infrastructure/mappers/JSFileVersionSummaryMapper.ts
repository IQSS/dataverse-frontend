import { FileVersionSummaryInfo } from '../../domain/models/FileVersionSummaryInfo'

export class JSFileVersionSummaryMapper {
  static toFileVersionSummary(
    JSFileVersionSummary: FileVersionSummaryInfo
  ): FileVersionSummaryInfo {
    return {
      datasetVersion: JSFileVersionSummary.datasetVersion,
      contributors: JSFileVersionSummary.contributors,
      publishedDate: JSFileVersionSummary.publishedDate,
      fileDifferenceSummary: JSFileVersionSummary.fileDifferenceSummary,
      versionState: JSFileVersionSummary.versionState,
      versionNote: JSFileVersionSummary.versionNote,
      datafileId: JSFileVersionSummary.datafileId
    }
  }
}
