interface FileImageProps {
  thumbnail: string
  name: string
  maxWidth?: number
  maxHeight?: number
}

export function FileImage({ thumbnail, name, maxWidth, maxHeight }: FileImageProps) {
  return (
    <img
      src={thumbnail}
      alt={name}
      style={{ maxWidth: maxWidth ? maxWidth : '100%', maxHeight: maxHeight ? maxHeight : 'auto' }}
    />
  )
}
