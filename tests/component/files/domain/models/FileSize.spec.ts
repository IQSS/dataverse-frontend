import { FileSize, FileSizeUnit } from '@/files/domain/models/FileMetadata'

describe('FileSize', () => {
  const byteSizes = [
    { bytes: 0, english: '0 B', spanish: '0 B' },
    { bytes: 1023, english: '1,023 B', spanish: '1023 B' },
    { bytes: 1024, english: '1 KB', spanish: '1 KB' },
    { bytes: 1280, english: '1.3 KB', spanish: '1,3 KB' },
    { bytes: 180_300, english: '176.1 KB', spanish: '176,1 KB' },
    { bytes: 1_048_575, english: '1,024 KB', spanish: '1024 KB' },
    { bytes: 1_048_576, english: '1 MB', spanish: '1 MB' },
    { bytes: 1_572_864, english: '1.5 MB', spanish: '1,5 MB' },
    { bytes: 1_073_741_824, english: '1 GB', spanish: '1 GB' },
    { bytes: 1_099_511_627_776, english: '1 TB', spanish: '1 TB' },
    { bytes: 1_125_899_906_842_624, english: '1 PB', spanish: '1 PB' }
  ]

  byteSizes.forEach(({ bytes, english, spanish }) => {
    it(`formats ${bytes} bytes using 1024-based units in English and Spanish`, () => {
      const size = new FileSize(bytes, FileSizeUnit.BYTES)

      expect(size.toString('en')).to.equal(english)
      expect(size.toString('es')).to.equal(spanish)
      expect(size.toBytes()).to.equal(bytes)
    })
  })

  it('converts sizes supplied in larger units without treating them as bytes', () => {
    const size = new FileSize(1536, FileSizeUnit.KILOBYTES)

    expect(size.value).to.equal(1.5)
    expect(size.unit).to.equal(FileSizeUnit.MEGABYTES)
    expect(size.toString('en')).to.equal('1.5 MB')
    expect(size.toString('es')).to.equal('1,5 MB')
    expect(size.toBytes()).to.equal(1_572_864)
  })

  it('rounds only the display while preserving the original byte count', () => {
    const size = new FileSize(1126, FileSizeUnit.BYTES)

    expect(size.toString('en')).to.equal('1.1 KB')
    expect(size.toString('es')).to.equal('1,1 KB')
    expect(size.toBytes()).to.equal(1126)
  })
})
