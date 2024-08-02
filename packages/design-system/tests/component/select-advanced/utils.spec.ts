import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { areArraysEqual } from '../../../src/lib/components/select-advanced/utils'

chai.use(chaiAsPromised)
const expect = chai.expect

describe('utils', () => {
  describe('areArraysEqual', () => {
    it('should return true if arrays are equal', () => {
      const case1 = areArraysEqual([], [])
      const case2 = areArraysEqual(
        ['Option 1', 'Option 2', 'Option 3'],
        ['Option 1', 'Option 2', 'Option 3']
      )
      const case3 = areArraysEqual(
        ['Option 1', 'Option 2', 'Option 3'],
        ['Option 1', 'Option 3', 'Option 2']
      )
      const case4 = areArraysEqual(['0', '1', '2', '10'], ['10', '1', '0', '2'])

      expect(case1).to.be.equal(true)
      expect(case2).to.be.equal(true)
      expect(case3).to.be.equal(true)
      expect(case4).to.be.equal(true)
    })
    it('should return false if arrays are not equal', () => {
      const case1 = areArraysEqual(['Option 1'], ['Option 1', 'Option 2'])
      const case2 = areArraysEqual(
        ['Option 1', 'Option 2', 'Option 3'],
        ['Option 1', 'Option 2', 'Option 4']
      )
      expect(case1).to.be.equal(false)
      expect(case2).to.be.equal(false)
    })
  })
})
