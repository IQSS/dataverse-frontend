import { StoryFn } from '@storybook/react'
import { MetadataBlockInfoContext } from '../../sections/dataset/metadata-block-info/MetadataBlockInfoContext'
import { MetadataBlockInfoMother } from '../../../tests/component/metadata-block-info/domain/models/MetadataBlockInfoMother'

export const WithCitationMetadataBlockInfo = (Story: StoryFn) => {
  const setMetadataBlockName = () => {}
  const metadataBlockInfoMock = MetadataBlockInfoMother.create()

  return (
    <MetadataBlockInfoContext.Provider
      value={{ metadataBlockInfo: metadataBlockInfoMock, setMetadataBlockName }}>
      <Story />
    </MetadataBlockInfoContext.Provider>
  )
}
