/**
 * This component will render an embedded external tool if the file has one applicable.
 * This could be a "preview" or "query" tool type.
 * If more than one tool is applicable with the file, we show a dropdown to select which one to use.
 * The tool resolved URL is fetched when the component is mounted or the tool selection changes.
 * The tool is rendered in an iframe.
 */

/* TODO:ME - If is in view and only first time then fetch resolved url and show iframe */

/* TODO:ME - Open in new window button */

import { useEffect, useState } from 'react'
import { ExternalTool } from '@/externalTools/domain/models/ExternalTool'
import { File } from '@/files/domain/models/File'
import { DropdownButton, DropdownButtonItem, Spinner } from '@iqss/dataverse-design-system'
import { FileExternalToolResolved } from '@/externalTools/domain/models/FileExternalToolResolved'
import { ExternalToolsRepository } from '@/externalTools/domain/repositories/ExternalToolsRepository'
import { FilePageHelper } from '../FilePageHelper'
import { getFileExternalToolResolved } from '@/externalTools/domain/useCases/GetFileExternalToolResolved'
import { useTranslation } from 'react-i18next'

interface FileEmbededExternalToolProps {
  file: File
  isInView: boolean
  applicableTools: ExternalTool[]
  toolTypeSelectedQueryParam: string | undefined
  externalToolsRepository: ExternalToolsRepository
}

export const FileEmbededExternalTool = ({
  file,
  isInView,
  applicableTools,
  toolTypeSelectedQueryParam,
  externalToolsRepository
}: FileEmbededExternalToolProps) => {
  const { t, i18n } = useTranslation('file')
  const [toolIdSelected, setToolIdSelected] = useState<number>(
    FilePageHelper.getDefaultSelectedToolId(toolTypeSelectedQueryParam, applicableTools)
  )
  const [isLoadingToolIframe, setIsLoadingToolIframe] = useState<boolean>(true)
  const [fileExternalToolsResolved, setFileExternalToolsResolved] =
    useState<FileExternalToolResolved | null>(null)

  const moreThanOneTool = applicableTools.length > 1

  const handleToolSelect = (eventKey: string | null) => {
    setToolIdSelected(Number(eventKey))
  }

  const openInNewWindow = async () => {
    // // If already opening, do nothing
    // if (isOpening) return
    // setIsOpening(true)
    // const newWindow = window.open('', '_blank')
    // // If the window didn't open, likely due to a popup blocker
    // if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
    //   toast.info(tShared('allowPopups'))
    //   setIsOpening(false)
    //   newWindow?.close()
    //   return
    // }
    // try {
    //   // Set a temporary title on the new window while fetching the tool URL
    //   newWindow.document.title = `Loading ${toolDisplayName}...`
    //   const datasetExternalTool = await getDatasetExternalToolResolved(
    //     externalToolsRepository,
    //     persistentId,
    //     toolId,
    //     { preview: false, locale: i18n.language }
    //   )
    //   // Change the location of the new window to the tool URL
    //   newWindow.location.href = datasetExternalTool.toolUrlResolved
    // } catch (error) {
    //   // If there's an error, notify the user and close the new window
    //   toast.error(tShared('externalToolOpeningFailed'))
    //   if (!newWindow?.closed) newWindow.close()
    // } finally {
    //   setIsOpening(false)
    // }
  }

  useEffect(() => {
    if (isInView) {
      const fetchFileExternalToolResolved = async () => {
        setIsLoadingToolIframe(true)
        setFileExternalToolsResolved(null)

        try {
          const fileExternalTool = await getFileExternalToolResolved(
            externalToolsRepository,
            file.id,
            toolIdSelected,
            { preview: true, locale: i18n.language }
          )

          setFileExternalToolsResolved(fileExternalTool)
        } catch (error) {
          console.error('Error fetching tool resolved URL:', error)
        } finally {
          setIsLoadingToolIframe(false)
        }
      }

      void fetchFileExternalToolResolved()
      console.log('Fetch tool resolved url for tool id:', toolIdSelected)
    }
  }, [isInView, toolIdSelected, externalToolsRepository, file.id, i18n.language])

  return (
    <div>
      <div>
        {moreThanOneTool && (
          <div>
            <DropdownButton
              title="Change Tool"
              id="external-tool-selector"
              onSelect={handleToolSelect}
              variant="secondary"
              size="sm">
              {applicableTools.map((tool) => (
                <DropdownButtonItem
                  eventKey={tool.id.toString()}
                  active={toolIdSelected === tool.id}
                  as="button"
                  key={tool.id}>
                  {tool.displayName}
                </DropdownButtonItem>
              ))}
            </DropdownButton>
          </div>
        )}
        {/* If tool is preview */}
        {/* {fileExternalToolsResolved && applicableTools.(
          <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#555' }}>
            {t('previewToolDescription', { toolName: fileExternalToolsResolved.toolDisplayName })}
          </div>
        )} */}
      </div>

      <div style={{ width: '100%', height: '100%', aspectRatio: '16/9', paddingBlock: '1rem' }}>
        {fileExternalToolsResolved && (
          <iframe
            style={{ width: '100%', height: '100%', border: 'none' }}
            src={fileExternalToolsResolved.toolUrlResolved}
            title={t('tabs.preview')}
            role="presentation"></iframe>
        )}
        {isLoadingToolIframe && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              paddingBlock: '4rem'
            }}>
            <Spinner aria-label={t('loadingExternalTool')} />
          </div>
        )}
      </div>
    </div>
  )
}
