import {
  FileTreeNodeType,
  FileTreeFolderNode,
  FileTreeFileNode
} from '@iqss/dataverse-client-javascript'
import { JSFileTreeMapper } from '../../../../../src/files/infrastructure/mappers/JSFileTreeMapper'
import { FileTreeItemType } from '../../../../../src/files/domain/models/FileTreeItem'

describe('JSFileTreeMapper.toFileTreeFile', () => {
  /**
   * The SDK's per-file `access` is a string union (`'public' |
   * 'restricted' | 'embargoed'`); the SPA's `FileAccess` shape is a
   * boolean-ish object that collapses restricted+embargoed into the
   * same `restricted: true` flag — fine for permission gating, lossy
   * for tree display. The mapper has to keep BOTH so the row can colour
   * a "Embargoed" cell distinctly from a "Restricted" cell while the
   * existing `FileAccess` consumers stay working.
   */
  it('preserves the three-way access status alongside the FileAccess shape', () => {
    const sdkPublic: FileTreeFileNode = {
      type: FileTreeNodeType.FILE,
      id: 1,
      name: 'a.txt',
      path: 'a.txt',
      size: 10,
      access: 'public',
      downloadUrl: '/api/access/datafile/1'
    }
    const sdkRestricted: FileTreeFileNode = { ...sdkPublic, id: 2, access: 'restricted' }
    const sdkEmbargoed: FileTreeFileNode = { ...sdkPublic, id: 3, access: 'embargoed' }

    const pub = JSFileTreeMapper.toFileTreeFile(sdkPublic)
    const restr = JSFileTreeMapper.toFileTreeFile(sdkRestricted)
    const emb = JSFileTreeMapper.toFileTreeFile(sdkEmbargoed)

    expect(pub.accessStatus).to.equal('public')
    expect(restr.accessStatus).to.equal('restricted')
    expect(emb.accessStatus).to.equal('embargoed')

    // FileAccess collapses both non-public buckets — kept for legacy
    // consumers, validated here so we notice if the mapping ever drifts.
    expect(pub.access?.restricted).to.equal(false)
    expect(restr.access?.restricted).to.equal(true)
    expect(emb.access?.restricted).to.equal(true)
    expect(restr.access?.canBeRequested).to.equal(true)
    expect(emb.access?.canBeRequested).to.equal(false)
  })

  it('leaves accessStatus undefined when the SDK omits access (older server)', () => {
    const noAccess: FileTreeFileNode = {
      type: FileTreeNodeType.FILE,
      id: 9,
      name: 'b.txt',
      path: 'b.txt',
      size: 0,
      downloadUrl: '/api/access/datafile/9'
    }
    const out = JSFileTreeMapper.toFileTreeFile(noAccess)
    expect(out.accessStatus).to.equal(undefined)
    expect(out.access).to.equal(undefined)
  })

  it('forwards id/name/path/size/contentType/checksum/downloadUrl unchanged', () => {
    const node: FileTreeFileNode = {
      type: FileTreeNodeType.FILE,
      id: 42,
      name: 'data.csv',
      path: 'data/raw/data.csv',
      size: 1024,
      contentType: 'text/csv',
      checksum: { type: 'MD5', value: 'abc' },
      access: 'public',
      downloadUrl: '/api/access/datafile/42'
    }
    const out = JSFileTreeMapper.toFileTreeFile(node)
    expect(out.type).to.equal(FileTreeItemType.FILE)
    expect(out.id).to.equal(42)
    expect(out.name).to.equal('data.csv')
    expect(out.path).to.equal('data/raw/data.csv')
    expect(out.size).to.equal(1024)
    expect(out.contentType).to.equal('text/csv')
    expect(out.checksum).to.deep.equal({ type: 'MD5', value: 'abc' })
    expect(out.downloadUrl).to.equal('/api/access/datafile/42')
  })
})

describe('JSFileTreeMapper.toFileTreeFolder', () => {
  it('passes the recursive counts shape through, including bytes / restricted / embargoed', () => {
    const node: FileTreeFolderNode = {
      type: FileTreeNodeType.FOLDER,
      name: 'mixed',
      path: 'mixed',
      counts: { files: 5, folders: 1, bytes: 8192, restricted: 2, embargoed: 1 }
    }
    const out = JSFileTreeMapper.toFileTreeFolder(node)
    expect(out.type).to.equal(FileTreeItemType.FOLDER)
    expect(out.name).to.equal('mixed')
    expect(out.path).to.equal('mixed')
    expect(out.counts).to.deep.equal({
      files: 5,
      folders: 1,
      bytes: 8192,
      restricted: 2,
      embargoed: 1
    })
  })

  it('tolerates a folder payload without counts (older server)', () => {
    const node: FileTreeFolderNode = {
      type: FileTreeNodeType.FOLDER,
      name: 'sparse',
      path: 'sparse'
    }
    const out = JSFileTreeMapper.toFileTreeFolder(node)
    expect(out.counts).to.equal(undefined)
  })
})
