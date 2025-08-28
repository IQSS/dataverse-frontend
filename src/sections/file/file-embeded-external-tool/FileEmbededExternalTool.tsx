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
import { useTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
import cn from 'classnames'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { Alert, DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'
import { ExternalTool } from '@/externalTools/domain/models/ExternalTool'
import { File } from '@/files/domain/models/File'
import { FileExternalToolResolved } from '@/externalTools/domain/models/FileExternalToolResolved'
import { ExternalToolsRepository } from '@/externalTools/domain/repositories/ExternalToolsRepository'
import { getFileExternalToolResolved } from '@/externalTools/domain/useCases/GetFileExternalToolResolved'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'
import { FilePageHelper } from '../FilePageHelper'
import styles from './FileEmbededExternalTool.module.scss'

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
  const { t, i18n } = useTranslation('file', { keyPrefix: 'fileEmbededExternalTool' })
  const [toolIdSelected, setToolIdSelected] = useState<number>(
    FilePageHelper.getDefaultSelectedToolId(toolTypeSelectedQueryParam, applicableTools)
  )
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false)
  const [errorLoadingTool, setErrorLoadingTool] = useState<string | null>(null)
  const [fileExternalToolResolved, setFileExternalToolResolved] =
    useState<FileExternalToolResolved | null>(null)

  const moreThanOneTool = applicableTools.length > 1

  const handleToolSelect = (eventKey: string | null) => setToolIdSelected(Number(eventKey))

  const handleOnLoadIframe = () => setIframeLoaded(true)
  const handleOnErrorIframe = () => {
    setIframeLoaded(false)
    setErrorLoadingTool(t('defaultLoadingToolError'))
  }

  // Loads the tool every time the tab is in view or the tool selection changes.
  useEffect(() => {
    if (!isInView) return

    const fetchFileExternalToolResolved = async () => {
      setIframeLoaded(false)
      setErrorLoadingTool(null)
      setFileExternalToolResolved(null)

      try {
        const fileExternalTool = await getFileExternalToolResolved(
          externalToolsRepository,
          file.id,
          toolIdSelected,
          { preview: true, locale: i18n.language }
        )

        setFileExternalToolResolved(fileExternalTool)
      } catch (err: WriteError | unknown) {
        if (err instanceof WriteError) {
          const error = new JSDataverseWriteErrorHandler(err)
          const formattedError =
            error.getReasonWithoutStatusCode() ?? /* istanbul ignore next */ error.getErrorMessage()
          setErrorLoadingTool(formattedError)
        } else {
          setErrorLoadingTool(t('defaultLoadingToolError'))
        }
      }
    }

    void fetchFileExternalToolResolved()
  }, [isInView, toolIdSelected, externalToolsRepository, file.id, t, i18n.language])

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
      </div>

      <div
        className={cn(styles['iframe-container'], {
          [styles.loaded]: iframeLoaded,
          [styles.error]: errorLoadingTool
        })}>
        {fileExternalToolResolved && (
          <iframe
            src={fileExternalToolResolved.toolUrlResolved}
            title={fileExternalToolResolved.displayName}
            className={styles.iframe}
            onLoad={handleOnLoadIframe}
            onError={handleOnErrorIframe}
            role="presentation"></iframe>
        )}
        {/* Keep skeleton overlay on top of the iframe while it loads to mask flickering */}
        <div aria-hidden={true} className={styles.overlay}>
          <Skeleton height="50%" width="100%" />
        </div>
        {/* Show error message if the fetching the tool URL fails or the iframe somehow fails. */}
        {errorLoadingTool && (
          <Alert variant="danger" dismissible={false}>
            {errorLoadingTool}
          </Alert>
        )}
      </div>
    </div>
  )
}
