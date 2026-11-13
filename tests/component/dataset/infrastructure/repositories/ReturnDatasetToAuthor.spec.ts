import {
  returnDatasetToAuthor as returnToAuthorUseCase,
  WriteError
} from '@iqss/dataverse-client-javascript'
import { DatasetJSDataverseRepository } from '@/dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { returnDatasetToAuthor } from '@/dataset/domain/useCases/returnDatasetToAuthor'

describe('return dataset to author request', () => {
  const repository = new DatasetJSDataverseRepository()

  it('delegates the validated reason to js-dataverse', () => {
    const submit = cy.stub(returnToAuthorUseCase, 'execute').resolves()
    cy.then(() => returnDatasetToAuthor(repository, 'doi:10.123/test', ' Please add files. '))
    cy.then(() => {
      expect(submit).to.have.been.calledOnceWithExactly('doi:10.123/test', 'Please add files.')
    })
  })

  it('propagates client write errors', () => {
    const error = new WriteError('[403] Forbidden')
    cy.stub(returnToAuthorUseCase, 'execute').rejects(error)
    cy.then(() =>
      repository.returnToAuthor(123, 'Please add files.').then(
        () => {
          throw new Error('Expected request to fail')
        },
        (actual: unknown) => {
          expect(actual).to.equal(error)
        }
      )
    )
  })

  for (const reason of ['', '   ', 'a'.repeat(2001)]) {
    it(`rejects invalid input with length ${reason.length} before sending`, () => {
      const submit = cy.stub(repository, 'returnToAuthor')
      cy.then(() =>
        returnDatasetToAuthor(repository, 'doi:10.123/test', reason).then(
          () => {
            throw new Error('Expected validation to fail')
          },
          () => {
            expect(submit).not.to.have.been.called
          }
        )
      )
    })
  }
})
