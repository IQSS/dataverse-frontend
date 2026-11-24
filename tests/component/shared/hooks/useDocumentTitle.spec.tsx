import { renderHook } from '@testing-library/react'
import {
  useDocumentTitle,
  formatDocumentTitle,
  DEFAULT_DOCUMENT_TITLE,
  setDefaultInstallationName,
  resetDefaultInstallationName,
  getDefaultInstallationName
} from '@/shared/hooks/useDocumentTitle'

describe('formatDocumentTitle', () => {
  beforeEach(() => {
    resetDefaultInstallationName()
  })

  it('returns formatted title when title and parentTitle are provided', () => {
    expect(formatDocumentTitle('Replication Data for: Foo', 'Demo Dataverse')).to.equal(
      'Replication Data for: Foo - Demo Dataverse'
    )
  })

  it('returns title alone when parentTitle is not provided', () => {
    expect(formatDocumentTitle('Demo Dataverse')).to.equal('Demo Dataverse')
  })

  it('returns parentTitle when title is not provided', () => {
    expect(formatDocumentTitle(undefined, 'Demo Dataverse')).to.equal('Demo Dataverse')
  })

  it('returns default title when neither title nor parentTitle is provided', () => {
    expect(formatDocumentTitle()).to.equal(DEFAULT_DOCUMENT_TITLE)
  })

  it('returns updated installation name as fallback', () => {
    setDefaultInstallationName('Demo Dataverse')
    expect(getDefaultInstallationName()).to.equal('Demo Dataverse')
    expect(formatDocumentTitle()).to.equal('Demo Dataverse')
  })
})

describe('useDocumentTitle', () => {
  beforeEach(() => {
    resetDefaultInstallationName()
    document.title = DEFAULT_DOCUMENT_TITLE
  })

  it('sets document.title to title alone when parentTitle is not provided', () => {
    renderHook(() => useDocumentTitle('Root Collection'))

    expect(document.title).to.equal('Root Collection')
  })

  it('sets document.title to title and parentTitle when both are provided', () => {
    renderHook(() =>
      useDocumentTitle('Replication Data for: Foo', { parentTitle: 'Demo Dataverse' })
    )

    expect(document.title).to.equal('Replication Data for: Foo - Demo Dataverse')
  })

  it('restores previous title on unmount when restoreOnUnmount is true', () => {
    document.title = 'Initial Title'

    const { unmount } = renderHook(() =>
      useDocumentTitle('New Page Title', { restoreOnUnmount: true })
    )

    expect(document.title).to.equal('New Page Title')

    unmount()

    expect(document.title).to.equal('Initial Title')
  })

  it('resets to default installation name on unmount by default', () => {
    document.title = 'Initial Title'

    const { unmount } = renderHook(() => useDocumentTitle('New Page Title'))

    expect(document.title).to.equal('New Page Title')

    unmount()

    expect(document.title).to.equal(DEFAULT_DOCUMENT_TITLE)
  })

  it('resets to updated installation name on unmount', () => {
    setDefaultInstallationName('Demo Dataverse')

    const { unmount } = renderHook(() => useDocumentTitle('Dataset Page'))

    expect(document.title).to.equal('Dataset Page')

    unmount()

    expect(document.title).to.equal('Demo Dataverse')
  })

  it('does not update title when enabled is false', () => {
    document.title = '404 Not Found - Dataverse'

    renderHook(() => useDocumentTitle('Advanced Search', { enabled: false }))

    expect(document.title).to.equal('404 Not Found - Dataverse')
  })

  it('does nothing when title and parentTitle are undefined', () => {
    document.title = 'Existing Title'

    renderHook(() => useDocumentTitle(undefined))

    expect(document.title).to.equal('Existing Title')
  })
})
