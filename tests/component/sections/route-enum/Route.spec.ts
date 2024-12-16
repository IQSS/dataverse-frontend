import { Route, RouteWithParams } from '@/sections/Route.enum'

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
  })
})
