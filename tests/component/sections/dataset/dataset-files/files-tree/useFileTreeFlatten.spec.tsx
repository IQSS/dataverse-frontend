import { buildVisibleRows } from '../../../../../../src/sections/dataset/dataset-files/files-tree/useFileTreeFlatten'
import {
  FileTreeFileMother,
  FileTreeFolderMother
} from '../../../../files/domain/models/FileTreeItemMother'
import { FolderNode } from '../../../../../../src/sections/dataset/dataset-files/files-tree/useFileTree'

const folder = (path: string, items: FolderNode['items']): FolderNode => ({
  path,
  items,
  nextCursor: null,
  loading: false,
  loaded: true
})

describe('buildVisibleRows', () => {
  it('flattens only opened folders', () => {
    const dataFolder = FileTreeFolderMother.create({ name: 'data', path: 'data' })
    const fileTop = FileTreeFileMother.create({ id: 1, name: 'top.txt', path: 'top.txt' })
    const inner = FileTreeFileMother.create({ id: 2, name: 'inner.txt', path: 'data/inner.txt' })

    const nodes = new Map<string, FolderNode>([
      ['', folder('', [dataFolder, fileTop])],
      ['data', folder('data', [inner])]
    ])
    const expanded = new Set<string>([''])

    const rows = buildVisibleRows(nodes, expanded)
    expect(rows.map((r) => (r.kind === 'item' ? r.node.path : r.kind))).to.deep.equal([
      'data',
      'top.txt'
    ])

    const rowsExpanded = buildVisibleRows(nodes, new Set(['', 'data']))
    expect(rowsExpanded.map((r) => (r.kind === 'item' ? r.node.path : r.kind))).to.deep.equal([
      'data',
      'data/inner.txt',
      'top.txt'
    ])
  })

  it('emits a load-more row when nextCursor is set', () => {
    const dataFolder = FileTreeFolderMother.create({ name: 'data', path: 'data' })
    const node: FolderNode = {
      path: '',
      items: [dataFolder],
      nextCursor: 'mem:1',
      loading: false,
      loaded: true
    }
    const rows = buildVisibleRows(new Map([['', node]]), new Set(['']))
    expect(rows[rows.length - 1].kind).to.equal('load-more')
  })

  it('emits an error row when error is present and no items', () => {
    const node: FolderNode = {
      path: '',
      items: [],
      nextCursor: null,
      loading: false,
      loaded: true,
      error: 'boom'
    }
    const rows = buildVisibleRows(new Map([['', node]]), new Set(['']))
    expect(rows[0]).to.deep.include({ kind: 'error', error: 'boom' })
  })

  it('emits a loading row for a folder pending children', () => {
    const dataFolder = FileTreeFolderMother.create({ name: 'data', path: 'data' })
    const node: FolderNode = {
      path: '',
      items: [dataFolder],
      nextCursor: null,
      loading: false,
      loaded: true
    }
    const rows = buildVisibleRows(new Map([['', node]]), new Set(['', 'data']))
    expect(rows.find((r) => r.kind === 'loading')?.path).to.equal('data')
  })

  it('filters by query, opens matching folders implicitly', () => {
    const dataFolder = FileTreeFolderMother.create({ name: 'data', path: 'data' })
    const inner = FileTreeFileMother.create({ id: 2, name: 'wanted.txt', path: 'data/wanted.txt' })
    const noise = FileTreeFileMother.create({ id: 3, name: 'noise.txt', path: 'data/noise.txt' })
    const nodes = new Map<string, FolderNode>([
      ['', folder('', [dataFolder])],
      ['data', folder('data', [inner, noise])]
    ])

    const rows = buildVisibleRows(nodes, new Set<string>(), 'wanted')
    const items = rows
      .filter((r) => r.kind === 'item')
      .map((r) => (r.kind === 'item' ? r.node.path : ''))
    expect(items).to.deep.equal(['data', 'data/wanted.txt'])
  })
})
