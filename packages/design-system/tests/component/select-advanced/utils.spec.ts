import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import {
  areOptionArraysEqual,
  normalizeOptions
} from '../../../src/lib/components/select-advanced/utils'

chai.use(chaiAsPromised)
const expect = chai.expect

describe('utils', () => {
  describe('normalizeOptions', () => {
    it('should normalize string[] into Option[]', () => {
      const input = ['Option 1', 'Option 2']
      const result = normalizeOptions(input)
      expect(result).to.deep.equal([
        { value: 'Option 1', label: 'Option 1' },
        { value: 'Option 2', label: 'Option 2' }
      ])
    })

    it('should keep Option[] as-is', () => {
      const input = [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' }
      ]
      const result = normalizeOptions(input)
      expect(result).to.deep.equal(input)
    })

    it('should return [] for empty input', () => {
      expect(normalizeOptions([])).to.deep.equal([])
    })
  })

  describe('areOptionArraysEqual', () => {
    it('should return true if arrays are equal (order-insensitive)', () => {
      const case1 = areOptionArraysEqual([], [])
      const case2 = areOptionArraysEqual(
        normalizeOptions(['Option 1', 'Option 2', 'Option 3']),
        normalizeOptions(['Option 1', 'Option 2', 'Option 3'])
      )
      const case3 = areOptionArraysEqual(
        normalizeOptions(['Option 1', 'Option 2', 'Option 3']),
        normalizeOptions(['Option 1', 'Option 3', 'Option 2'])
      )
      const case4 = areOptionArraysEqual(
        normalizeOptions(['0', '1', '2', '10']),
        normalizeOptions(['10', '1', '0', '2'])
      )

      expect(case1).to.equal(true)
      expect(case2).to.equal(true)
      expect(case3).to.equal(true)
      expect(case4).to.equal(true)
    })

    it('should return false if arrays differ by content or length', () => {
      const case1 = areOptionArraysEqual(
        normalizeOptions(['Option 1']),
        normalizeOptions(['Option 1', 'Option 2'])
      )
      const case2 = areOptionArraysEqual(
        normalizeOptions(['Option 1', 'Option 2', 'Option 3']),
        normalizeOptions(['Option 1', 'Option 2', 'Option 4'])
      )
      const case3 = areOptionArraysEqual(
        [{ value: 'a', label: 'A' }],
        [{ value: 'a', label: 'Different Label' }]
      )

      expect(case1).to.equal(false)
      expect(case2).to.equal(false)
      expect(case3).to.equal(false)
    })
  })
})
