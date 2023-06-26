import { File } from '../../../../../files/domain/models/File'
import { ClipboardPlusFill } from 'react-bootstrap-icons'
import styles from './FileInfoCell.module.scss'
import { FileThumbnail } from './file-thumbnail/FileThumbnail'

export function FileInfoCell({ file }: { file: File }) {
  return (
    <div className={styles.container}>
      <FileThumbnail
        thumbnail={file.thumbnail}
        name={file.name}
        access={file.access}
        type={file.type}
      />
      <div className={styles['info-container']}>
        <a href={file.link}>{file.name}</a>
        <div className={styles['info-container__body']}>
          <div>
            <span>
              {file.type} - {file.size.toString()}
            </span>
          </div>
          <div>
            <span>Published {file.publicationDate}</span>
          </div>
          <div>
            <span>{file.downloads} Downloads</span>
          </div>
          <div>
            <span>
              {file.checksum} <ClipboardPlusFill />
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
