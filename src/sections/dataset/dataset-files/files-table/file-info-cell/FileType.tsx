import { FileSize } from '../../../../../files/domain/models/File'

interface FileTypeProps {
  type: string
  size: FileSize
}

export function FileType({ type, size }: FileTypeProps) {
  return (
    <div>
      <span>
        {capitalizeFirstLetter(type)} - {size.toString()}
      </span>
    </div>
  )
}

function capitalizeFirstLetter(str: string): string {
  if (str.length === 0) {
    return str
  }
  return str.charAt(0).toUpperCase() + str.slice(1)
}
