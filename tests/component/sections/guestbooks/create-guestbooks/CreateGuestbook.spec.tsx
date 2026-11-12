import { act, renderHook } from '@testing-library/react'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { useLocation } from 'react-router-dom'
import { CreateGuestbook } from '@/sections/guestbooks/create-guestbooks/CreateGuestbook'
import { CreateGuestbookButton } from '@/sections/guestbooks/create-guestbooks/CreateGuestbookButton'
import { useCreateGuestbook } from '@/sections/guestbooks/create-guestbooks/useCreateGuestbook'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { GuestbookDTO } from '@/guestbooks/domain/useCases/DTOs/GuestbookDTO'
import { CollectionMother } from '@tests/component/collection/domain/models/CollectionMother'
import { createGuestbookRepositoryStub } from '../createGuestbookRepositoryStub'
import { WithRepositories } from '@tests/component/WithRepositories'

type CreateGuestbookStub = sinon.SinonStub<
  [collectionIdOrAlias: number | string, guestbook: GuestbookDTO],
  Promise<number>
>

const guestbook: GuestbookDTO = {
  name: 'Test Guestbook',
  enabled: false,
  emailRequired: true,
  nameRequired: true,
  institutionRequired: false,
  positionRequired: false,
  customQuestions: [
    {
      question: 'How will you use this data?',
      required: true,
      displayOrder: 0,
      type: 'text',
      hidden: false
    }
  ]
}

const sourceGuestbookToCopy: Guestbook = {
  id: 10,
  name: 'Source Guestbook',
  enabled: false,
  emailRequired: true,
  nameRequired: true,
  institutionRequired: true,
  positionRequired: false,
  customQuestions: [
    {
      id: 21,
      question: 'Preferred format',
      required: true,
      displayOrder: 0,
      type: 'options',
      hidden: false,
      optionValues: [
        { id: 31, value: 'CSV', displayOrder: 0 },
        { id: 32, value: 'JSON', displayOrder: 1 }
      ]
    }
  ],
  createTime: '2026-01-01T00:00:00.000Z',
  dataverseId: 17
}

describe('CreateGuestbook', () => {
  const collectionRepository = {} as CollectionRepository
  let guestbookRepository: GuestbookRepository
  let createGuestbookStub: Cypress.Agent<CreateGuestbookStub>

  beforeEach(() => {
    collectionRepository.getById = cy.stub().resolves(
      CollectionMother.create({
        id: 'root',
        name: 'Root'
      })
    )
    guestbookRepository = createGuestbookRepositoryStub()
    createGuestbookStub = guestbookRepository.createGuestbook as Cypress.Agent<CreateGuestbookStub>
    createGuestbookStub.as('createGuestbook').resolves(123)
  })

  const mountCreateGuestbook = () =>
    cy.customMount(
      <WithRepositories guestbookRepository={guestbookRepository}>
        <CreateGuestbook collectionId="root" collectionRepository={collectionRepository} />
      </WithRepositories>
    )
  const mountCopyGuestbook = () =>
    cy.customMount(
      <WithRepositories guestbookRepository={guestbookRepository}>
        <CreateGuestbook collectionId="root" collectionRepository={collectionRepository} />
      </WithRepositories>,
      [{ pathname: '/root/guestbooks/create', state: { guestbookToCopy: sourceGuestbookToCopy } }]
    )

  const expectGuestbookCreatedWith = (expectedGuestbook: GuestbookDTO) => {
    cy.wrap(null).should(() => {
      expect(createGuestbookStub).to.have.been.calledOnce

      const createGuestbookCall = createGuestbookStub.getCall(0)
      expect(createGuestbookCall.args[0]).to.equal('root')
      expect(createGuestbookCall.args[1]).to.deep.equal(expectedGuestbook)
    })
  }

  it('creates guestbooks as enabled by default', () => {
    mountCreateGuestbook()

    cy.get('#guestbook-name').type('Enabled By Default Guestbook')
    cy.get('button[type="submit"]').click()

    cy.wrap(null).should(() => {
      expect(createGuestbookStub).to.have.been.calledOnce
      expect(createGuestbookStub.getCall(0).args[1].enabled).to.equal(true)
    })
  })

  it('prefills a copied guestbook and submits it as a new guestbook', () => {
    mountCopyGuestbook()

    cy.findByDisplayValue('Copy of Source Guestbook').should('exist')
    cy.findByLabelText('Name').should('be.checked')
    cy.findByLabelText('Email').should('be.checked')
    cy.findByLabelText('Institution').should('be.checked')
    cy.findByLabelText('Position').should('not.be.checked')
    cy.findByDisplayValue('Preferred format').should('exist')
    cy.findByDisplayValue('CSV').should('exist')
    cy.findByDisplayValue('JSON').should('exist')
    cy.findByLabelText('Required field').should('be.checked')

    cy.get('button[type="submit"]').click()
    cy.wrap(guestbookRepository.getGuestbook as Cypress.Agent<sinon.SinonStub>).should(
      'not.have.been.called'
    )

    expectGuestbookCreatedWith({
      name: 'Copy of Source Guestbook',
      enabled: false,
      nameRequired: true,
      emailRequired: true,
      institutionRequired: true,
      positionRequired: false,
      customQuestions: [
        {
          question: 'Preferred format',
          required: true,
          displayOrder: 0,
          type: 'options',
          hidden: false,
          optionValues: [
            { value: 'CSV', displayOrder: 0 },
            { value: 'JSON', displayOrder: 1 }
          ]
        }
      ]
    })
  })

  it('submits a guestbook with single line and multiple line custom questions', () => {
    mountCreateGuestbook()

    cy.get('#guestbook-name').type('Research Use Guestbook')

    cy.get('select').first().select('text')
    cy.get('input[type="text"]').eq(1).type('What is your project name?')

    cy.findByLabelText('Add question').click()
    cy.get('select').last().select('textarea')
    cy.get('input[type="text"]').eq(2).type('How will you use this data?')
    cy.get('#custom-question-required-2').click()

    cy.get('button[type="submit"]').click()

    expectGuestbookCreatedWith({
      name: 'Research Use Guestbook',
      enabled: true,
      nameRequired: false,
      emailRequired: false,
      institutionRequired: false,
      positionRequired: false,
      customQuestions: [
        {
          question: 'What is your project name?',
          required: false,
          displayOrder: 0,
          type: 'text',
          hidden: false,
          optionValues: undefined
        },
        {
          question: 'How will you use this data?',
          required: true,
          displayOrder: 1,
          type: 'textarea',
          hidden: false,
          optionValues: undefined
        }
      ]
    })
  })

  it('submits a guestbook with multiline and multiple choice custom questions', () => {
    mountCreateGuestbook()

    cy.get('#guestbook-name').type('Research Use Guestbook')
    cy.get('#data-collected-name').click()
    cy.get('#data-collected-institution').click()

    cy.get('select').first().select('textarea')
    cy.get('input[type="text"]').eq(1).type('How will you use this data?')
    cy.get('#custom-question-required-1').click()

    cy.findByLabelText('Add question').click()
    cy.get('select').last().select('options')
    cy.get('input[type="text"]').eq(2).type('Preferred format')
    cy.get('input[type="text"]').eq(3).type('CSV')
    cy.findByLabelText('Add response option').click()
    cy.get('input[type="text"]').eq(4).type('JSON')

    cy.get('button[type="submit"]').click()

    expectGuestbookCreatedWith({
      name: 'Research Use Guestbook',
      enabled: true,
      nameRequired: true,
      emailRequired: false,
      institutionRequired: true,
      positionRequired: false,
      customQuestions: [
        {
          question: 'How will you use this data?',
          required: true,
          displayOrder: 0,
          type: 'textarea',
          hidden: false,
          optionValues: undefined
        },
        {
          question: 'Preferred format',
          required: false,
          displayOrder: 1,
          type: 'options',
          hidden: false,
          optionValues: [
            { value: 'CSV', displayOrder: 0 },
            { value: 'JSON', displayOrder: 1 }
          ]
        }
      ]
    })
  })

  it('renders collection not found page when the collection cannot be fetched', () => {
    collectionRepository.getById = cy.stub().rejects(new Error('missing collection'))

    mountCreateGuestbook()

    cy.findByTestId('not-found-page').should('exist')
    cy.findByText(/We can't find the/i).should('exist')
    cy.findByText('Collection').should('exist')
  })

  it('shows an error alert when creating the guestbook fails', () => {
    createGuestbookStub.rejects(new Error('unexpected'))

    mountCreateGuestbook()

    cy.get('#guestbook-name').type('Research Use Guestbook')
    cy.get('button[type="submit"]').click()

    cy.findByText(/Something went wrong creating the guestbook/i).should('exist')
  })
})

describe('CreateGuestbookButton', () => {
  const LocationDisplay = () => {
    const location = useLocation()

    return <div data-testid="location-display">{location.pathname}</div>
  }

  it('navigates to the create guestbook page when clicked', () => {
    cy.customMount(
      <>
        <CreateGuestbookButton collectionId="root" />
        <LocationDisplay />
      </>,
      ['/root/guestbooks']
    )

    cy.findByRole('button', { name: 'Create Dataset Guestbook' }).click()

    cy.findByTestId('location-display').should('have.text', '/root/guestbooks/create')
  })
})

describe('useCreateGuestbook', () => {
  let guestbookRepository: GuestbookRepository
  let onSuccessfulCreate: Cypress.Agent<sinon.SinonStub>

  beforeEach(() => {
    guestbookRepository = createGuestbookRepositoryStub()
    onSuccessfulCreate = cy.stub().as('onSuccessfulCreate')
  })

  it('creates guestbook and calls success callback', async () => {
    const createGuestbookStub =
      guestbookRepository.createGuestbook as Cypress.Agent<sinon.SinonStub>
    createGuestbookStub.resolves(123)

    const { result } = renderHook(() =>
      useCreateGuestbook({
        guestbookRepository,
        collectionIdOrAlias: 'root',
        onSuccessfulCreate
      })
    )

    await act(async () => {
      await result.current.handleCreateGuestbook(guestbook)
    })

    expect(createGuestbookStub).to.have.been.calledOnceWith('root', guestbook)
    expect(onSuccessfulCreate).to.have.been.calledOnceWith(123)
    expect(result.current.errorCreatingGuestbook).to.deep.equal(null)
    expect(result.current.isCreatingGuestbook).to.deep.equal(false)
  })

  it('sets formatted error when create fails with WriteError', async () => {
    const writeError = new WriteError()
    writeError.message = 'Request failed. Reason was: [400] Guestbook name is required'
    const createGuestbookStub =
      guestbookRepository.createGuestbook as Cypress.Agent<sinon.SinonStub>
    createGuestbookStub.rejects(writeError)

    const { result } = renderHook(() =>
      useCreateGuestbook({
        guestbookRepository,
        collectionIdOrAlias: 'root',
        onSuccessfulCreate
      })
    )

    await act(async () => {
      await result.current.handleCreateGuestbook(guestbook)
    })

    expect(onSuccessfulCreate).to.not.have.been.called
    expect(result.current.errorCreatingGuestbook).to.deep.equal('Guestbook name is required')
    expect(result.current.isCreatingGuestbook).to.deep.equal(false)
  })

  it('sets default error when create fails with unknown error', async () => {
    const createGuestbookStub =
      guestbookRepository.createGuestbook as Cypress.Agent<sinon.SinonStub>
    createGuestbookStub.rejects(new Error('unexpected'))

    const { result } = renderHook(() =>
      useCreateGuestbook({
        guestbookRepository,
        collectionIdOrAlias: 'root',
        onSuccessfulCreate
      })
    )

    await act(async () => {
      await result.current.handleCreateGuestbook(guestbook)
    })

    expect(onSuccessfulCreate).to.not.have.been.called
    expect(result.current.errorCreatingGuestbook).to.deep.equal(
      'Something went wrong creating the guestbook. Try again later.'
    )
    expect(result.current.isCreatingGuestbook).to.deep.equal(false)
  })
})
