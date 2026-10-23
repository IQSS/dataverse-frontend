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

  it('whitespace-only query short-circuits matches() to true (no name filter)', () => {
    const dataFolder = FileTreeFolderMother.create({ name: 'data', path: 'data' })
    const fileTop = FileTreeFileMother.create({ id: 1, name: 'top.txt', path: 'top.txt' })
    const nodes = new Map<string, FolderNode>([['', folder('', [dataFolder, fileTop])]])

    // Whitespace-only query: matches() trims to "" and short-circuits to true
    // (line 82). All top-level items are kept; the matched-folder auto-expand
    // logic still kicks in (Boolean(query) is true) so the recursion adds a
    // loading row for the unloaded 'data' subtree.
    const rows = buildVisibleRows(nodes, new Set(['']), '   ')
    const items = rows
      .filter((r) => r.kind === 'item')
      .map((r) => (r.kind === 'item' ? r.node.path : ''))
    expect(items).to.deep.equal(['data', 'top.txt'])
  })

  it('folder whose name matches the query is included (even though children are filtered out)', () => {
    const dataFolder = FileTreeFolderMother.create({ name: 'archive', path: 'archive' })
    const inner = FileTreeFileMother.create({ id: 5, name: 'misc.txt', path: 'archive/misc.txt' })
    const nodes = new Map<string, FolderNode>([
      ['', folder('', [dataFolder])],
      ['archive', folder('archive', [inner])]
    ])

    // The folder name matches "arch" (line 88's true branch). Its children
    // do not match and are dropped by the recursive walk; what we want to
    // assert is that the folder itself survives the filter.
    const rows = buildVisibleRows(nodes, new Set<string>(), 'arch')
    const items = rows
      .filter((r) => r.kind === 'item')
      .map((r) => (r.kind === 'item' ? r.node.path : ''))
    expect(items).to.deep.equal(['archive'])
  })

  it('folder with unloaded children and a non-matching name is excluded under a query', () => {
    const dataFolder = FileTreeFolderMother.create({ name: 'plain', path: 'plain' })
    const nodes = new Map<string, FolderNode>([['', folder('', [dataFolder])]])
    // No 'plain' entry in the map — sub is undefined; matches() returns
    // false (line 92) so the folder is filtered out.
    const rows = buildVisibleRows(nodes, new Set<string>(), 'something-else')
    const items = rows.filter((r) => r.kind === 'item')
    expect(items).to.have.length(0)
  })

  it('emits a trailing error row when items are present and an error is set', () => {
    const fileTop = FileTreeFileMother.create({ id: 1, name: 'top.txt', path: 'top.txt' })
    const node: FolderNode = {
      path: '',
      items: [fileTop],
      nextCursor: null,
      loading: false,
      loaded: true,
      error: 'partial-fail'
    }
    // items.length > 0 + error set hits line 70 (error row appended after the items).
    const rows = buildVisibleRows(new Map([['', node]]), new Set(['']))
    expect(rows[0].kind).to.equal('item')
    expect(rows[rows.length - 1]).to.deep.include({ kind: 'error', error: 'partial-fail' })
  })
})
