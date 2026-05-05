import { renderHook, act } from '@testing-library/react'
import { useFileTreeSelection } from '../../../../../../src/sections/dataset/dataset-files/files-tree/useFileTreeSelection'
import {
  FileTreeFileMother,
  FileTreeFolderMother
} from '../../../../files/domain/models/FileTreeItemMother'

const folderData = FileTreeFolderMother.create({ name: 'data', path: 'data' })
const fileA = FileTreeFileMother.create({ id: 1, name: 'a.txt', path: 'data/a.txt', size: 1000 })
const fileB = FileTreeFileMother.create({ id: 2, name: 'b.txt', path: 'data/b.txt', size: 2000 })
const fileTopLevel = FileTreeFileMother.create({
  id: 3,
  name: 'top.txt',
  path: 'top.txt',
  size: 100
})

describe('useFileTreeSelection', () => {
  it('starts with no selection', () => {
    const { result } = renderHook(() => useFileTreeSelection())
    expect(result.current.totals.count).to.equal(0)
    expect(result.current.totals.bytes).to.equal(0)
    expect(result.current.fileState(fileA)).to.equal('none')
    expect(result.current.folderState(folderData, [fileA, fileB])).to.equal('none')
  })

  it('toggles a single file in and out of selection', () => {
    const { result } = renderHook(() => useFileTreeSelection())
    act(() => result.current.toggleFile(fileTopLevel))
    expect(result.current.fileState(fileTopLevel)).to.equal('all')
    expect(result.current.totals.count).to.equal(1)
    expect(result.current.totals.bytes).to.equal(100)
    act(() => result.current.toggleFile(fileTopLevel))
    expect(result.current.fileState(fileTopLevel)).to.equal('none')
    expect(result.current.totals.count).to.equal(0)
  })

  it('marks a folder as logically selected without enumerating descendants', () => {
    const { result } = renderHook(() => useFileTreeSelection())
    act(() => result.current.toggleFolder(folderData, []))
    expect(result.current.folderState(folderData, [])).to.equal('all')
    expect(result.current.fileState(fileA)).to.equal('all')
    expect(result.current.fileState(fileB)).to.equal('all')
    expect(result.current.totals.hasLogicalFolders).to.equal(true)
  })

  it('flips folder to partial when an inner file is deselected', () => {
    const { result } = renderHook(() => useFileTreeSelection())
    act(() => result.current.toggleFolder(folderData, [fileA, fileB]))
    expect(result.current.folderState(folderData, [fileA, fileB])).to.equal('all')
    act(() => result.current.toggleFile(fileA))
    expect(result.current.folderState(folderData, [fileA, fileB])).to.equal('partial')
    expect(result.current.fileState(fileA)).to.equal('none')
    expect(result.current.fileState(fileB)).to.equal('all')
  })

  it('reports a folder as all when every visited child file is checked individually', () => {
    const { result } = renderHook(() => useFileTreeSelection())
    act(() => result.current.toggleFile(fileA))
    expect(result.current.folderState(folderData, [fileA, fileB])).to.equal('partial')
    act(() => result.current.toggleFile(fileB))
    expect(result.current.folderState(folderData, [fileA, fileB])).to.equal('all')
  })

  it('clears all sets', () => {
    const { result } = renderHook(() => useFileTreeSelection())
    act(() => result.current.toggleFolder(folderData, [fileA, fileB]))
    act(() => result.current.toggleFile(fileA))
    act(() => result.current.clear())
    expect(result.current.folderState(folderData, [fileA, fileB])).to.equal('none')
    expect(result.current.fileState(fileA)).to.equal('none')
    expect(result.current.fileState(fileB)).to.equal('none')
    expect(result.current.totals.count).to.equal(0)
    expect(result.current.totals.hasLogicalFolders).to.equal(false)
  })

  it('deselecting a logical folder removes nested explicit selections', () => {
    const { result } = renderHook(() => useFileTreeSelection())
    act(() => result.current.toggleFolder(folderData, [fileA, fileB]))
    act(() => result.current.toggleFolder(folderData, [fileA, fileB]))
    expect(result.current.folderState(folderData, [fileA, fileB])).to.equal('none')
    expect(result.current.totals.hasLogicalFolders).to.equal(false)
  })
})
