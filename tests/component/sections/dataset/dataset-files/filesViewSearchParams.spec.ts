import {
  PATH_PARAM,
  VIEW_PARAM,
  nextSearchParamsForTreePath,
  nextSearchParamsForView
} from '../../../../../src/sections/dataset/dataset-files/filesViewSearchParams'

describe('filesViewSearchParams', () => {
  describe('nextSearchParamsForView', () => {
    it('sets view=tree when switching to tree', () => {
      const out = nextSearchParamsForView(new URLSearchParams(), 'tree')
      expect(out.get(VIEW_PARAM)).to.equal('tree')
    })

    it('removes view and path when switching to table', () => {
      const current = new URLSearchParams({ [VIEW_PARAM]: 'tree', [PATH_PARAM]: 'data/raw' })
      const out = nextSearchParamsForView(current, 'table')
      expect(out.has(VIEW_PARAM)).to.equal(false)
      expect(out.has(PATH_PARAM)).to.equal(false)
    })

    it('preserves unrelated params on either transition', () => {
      const current = new URLSearchParams({ q: 'hello', [VIEW_PARAM]: 'tree' })
      const treeOut = nextSearchParamsForView(current, 'tree')
      const tableOut = nextSearchParamsForView(current, 'table')
      expect(treeOut.get('q')).to.equal('hello')
      expect(tableOut.get('q')).to.equal('hello')
    })
  })

  describe('nextSearchParamsForTreePath', () => {
    it('sets path to the next folder when non-empty', () => {
      const out = nextSearchParamsForTreePath(new URLSearchParams(), 'data/raw')
      expect(out.get(PATH_PARAM)).to.equal('data/raw')
    })

    it('drops path when next is empty', () => {
      const current = new URLSearchParams({ [PATH_PARAM]: 'data/raw' })
      const out = nextSearchParamsForTreePath(current, '')
      expect(out.has(PATH_PARAM)).to.equal(false)
    })

    it('replaces an existing path with the new one', () => {
      const current = new URLSearchParams({ [PATH_PARAM]: 'data/raw' })
      const out = nextSearchParamsForTreePath(current, 'docs')
      expect(out.get(PATH_PARAM)).to.equal('docs')
    })

    it('preserves other params', () => {
      const current = new URLSearchParams({ [VIEW_PARAM]: 'tree', q: 'x' })
      const out = nextSearchParamsForTreePath(current, 'data')
      expect(out.get(VIEW_PARAM)).to.equal('tree')
      expect(out.get('q')).to.equal('x')
      expect(out.get(PATH_PARAM)).to.equal('data')
    })
  })
})
