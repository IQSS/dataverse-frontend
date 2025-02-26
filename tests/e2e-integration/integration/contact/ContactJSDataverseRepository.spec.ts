import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { ContactJSDataverseRepository } from '@/contact/infrastructure/ContactJSDataverseRepository'
import { FeedbackDTO } from '@/contact/domain/useCases/FeedbackDTO'
import { ContactResponse } from '@/contact/domain/models/ContactResponse'
import { TestsUtils } from '../../shared/TestsUtils'

chai.use(chaiAsPromised)
const expect = chai.expect

const repository = new ContactJSDataverseRepository()

describe('Contact JSDataverse Repository', () => {
  before(() => TestsUtils.setup())
  beforeEach(() => TestsUtils.login())

  it('send information to contacts', async () => {
    const data: FeedbackDTO = {
      subject: 'test subject',
      body: 'test message body',
      fromEmail: 'test@dataverse.com'
    }
    const contact: ContactResponse[] = await repository.sendFeedbacktoOwners(data)

    expect(contact).to.not.be.undefined
  })
})
