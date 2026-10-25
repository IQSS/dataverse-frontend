export function htmlToPlainText(html: string): string {
  const document = new DOMParser().parseFromString(html, 'text/html')
  return (document.body.textContent ?? '').trim()
}
