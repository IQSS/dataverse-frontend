/**
 * This component will render an embedded external tool if the file has one applicable.
 * This could be a "preview" or "query" tool type.
 * If more than one tool is applicable with the file, we show a dropdown to select which one to use.
 * The tool resolved URL is fetched when the component is mounted or the tool selection changes.
 * The tool is rendered in an iframe.
 */

/* TODO:ME - If is in view and only first time then fetch resolved url and show iframe */

/* TODO:ME - Open in new window button */

import { ExternalTool } from '@/externalTools/domain/models/ExternalTool'
import { File } from '@/files/domain/models/File'

interface FileEmbededExternalToolProps {
  file: File
  applicableTools: ExternalTool[]
  toolTypeSelectedQueryParam: string | undefined
}

export const FileEmbededExternalTool = ({
  file,
  applicableTools,
  toolTypeSelectedQueryParam
}: FileEmbededExternalToolProps) => {
  console.log({ applicableTools })
  const moreThanOneTool = applicableTools.length > 1

  return (
    <div>
      <header>
        Aca un dropdown para seleccionar la herramienta si hay más de una, deberia ser condicional.
      </header>

      <iframe
        style={{ width: '100%', height: '100%', border: 'none' }}
        src="https://gdcc.github.io/dataverse-previewers/previewers/v1.5/AudioPreview.html?callback=aHR0cDovL2xvY2FsaG9zdDo4MDgwL2FwaS92MS9maWxlcy81L21ldGFkYXRhLzEvdG9vbHBhcmFtcy8y&locale=en&preview=true"
        // title={t('tabs.preview')}
        role="presentation"></iframe>
    </div>
  )
}
