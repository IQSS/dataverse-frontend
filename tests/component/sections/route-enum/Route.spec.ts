import { Route, RouteWithParams } from '@/sections/Route.enum'
import { TemplateEditMode } from '@/sections/Route.enum'
import { EditFileMetadataReferrer } from '@/sections/edit-file-metadata/EditFileMetadata'
import { ReplaceFileReferrer } from '@/sections/replace-file/ReplaceFile'

describe('Route.enum.ts', () => {
  describe('RouteWithParams', () => {
    it('should return the correct route for COLLECTIONS', () => {
      expect(RouteWithParams.COLLECTIONS()).to.be.equal(Route.COLLECTIONS_BASE)
      expect(RouteWithParams.COLLECTIONS('123')).to.be.equal(`${Route.COLLECTIONS_BASE}/123`)
    })

    it('should return the correct route for CREATE_COLLECTION', () => {
      expect(RouteWithParams.CREATE_COLLECTION('123')).to.be.equal(`/collections/123/create`)
    })

    it('should return the correct route for EDIT_COLLECTION', () => {
      expect(RouteWithParams.EDIT_COLLECTION('123')).to.be.equal(`/collections/123/edit`)
    })

    it('should return the correct route for CREATE_DATASET', () => {
      expect(RouteWithParams.CREATE_DATASET('123')).to.be.equal(`/datasets/123/create`)
    })

    it('should return the correct route for EDIT_FEATURED_ITEMS', () => {
      expect(RouteWithParams.EDIT_FEATURED_ITEMS('123')).to.be.equal(
        `/collections/123/edit-featured-items`
      )
    })

    it('should return the correct route for collection templates', () => {
      expect(RouteWithParams.COLLECTION_TEMPLATES('root')).to.be.equal('/root/templates')
      expect(RouteWithParams.TEMPLATES_CREATE('root')).to.be.equal('/root/templates/create')
      expect(RouteWithParams.TEMPLATES_EDIT('root', 10, TemplateEditMode.METADATA)).to.be.equal(
        '/templates/edit?id=10&ownerId=root&editMode=METADATA'
      )
      expect(
        RouteWithParams.TEMPLATES_EDIT('root', 'template-10', TemplateEditMode.LICENSE)
      ).to.be.equal('/templates/edit?id=template-10&ownerId=root&editMode=LICENSE')
    })

    it('should return the correct route for EDIT_FILE_METADATA', () => {
      expect(
        RouteWithParams.EDIT_FILE_METADATA(
          'doi:10.5072/FK2/ABC',
          'draft',
          5,
          EditFileMetadataReferrer.DATASET
        )
      ).to.be.equal(
        '/files/edit-metadata?id=5&persistentId=doi%3A10.5072%2FFK2%2FABC&datasetVersion=draft&referrer=dataset'
      )
    })

    it('should return the correct route for FILES_REPLACE', () => {
      expect(RouteWithParams.FILES_REPLACE('doi:10.5072/FK2/ABC', 'draft', 5)).to.be.equal(
        '/files/replace?id=5&persistentId=doi%3A10.5072%2FFK2%2FABC&datasetVersion=draft'
      )

      expect(
        RouteWithParams.FILES_REPLACE('doi:10.5072/FK2/ABC', 'draft', 5, ReplaceFileReferrer.FILE)
      ).to.be.equal(
        '/files/replace?id=5&persistentId=doi%3A10.5072%2FFK2%2FABC&datasetVersion=draft&referrer=file'
      )
    })

    it('should return the correct route for FEATURED_ITEM', () => {
      expect(RouteWithParams.FEATURED_ITEM('parent', 'item')).to.be.equal(
        '/featured-item/parent/item'
      )
    })

    it('should return the correct route for ADVANCED_SEARCH', () => {
      expect(RouteWithParams.ADVANCED_SEARCH('root')).to.be.equal('/collections/root/search')
    })
  })
})
