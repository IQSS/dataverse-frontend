import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import cn from 'classnames'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { Alert, DropdownButton, DropdownButtonItem, Spinner } from '@iqss/dataverse-design-system'
import { BoxArrowUpRight } from 'react-bootstrap-icons'
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
  const { t, i18n } = useTranslation('file', { keyPrefix: 'previewTab' })
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
    <section>
      <header className={styles.header}>
        {moreThanOneTool && (
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
        )}

        {fileExternalToolResolved && (
          // eslint-disable-next-line react/jsx-no-target-blank
          <a
            href={FilePageHelper.replacePreviewParamInToolUrl(
              fileExternalToolResolved.toolUrlResolved,
              false
            )}
            target="_blank"
            className="btn btn-secondary btn-sm d-flex align-items-center gap-1">
            <BoxArrowUpRight size={12} />
            <span>{t('openInNewWindow')}</span>
          </a>
        )}
      </header>

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
          <Spinner />
        </div>
        {/* Show error message if the fetching the tool URL fails or the iframe somehow fails. */}
        {errorLoadingTool && (
          <Alert variant="danger" dismissible={false}>
            {errorLoadingTool}
          </Alert>
        )}
      </div>
    </section>
  )
}
