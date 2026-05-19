import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { type CreateGuestbookDTO } from '@iqss/dataverse-client-javascript'
import { Alert, Button, Col, Form, Row } from '@iqss/dataverse-design-system'
import { type NavigateFunction, useNavigate } from 'react-router-dom'
import { DashLg, PlusLg } from 'react-bootstrap-icons'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { GuestbookQuestionType } from '@/guestbooks/domain/models/Guestbook'
import { RouteWithParams } from '@/sections/Route.enum'
import { useCollection } from '@/sections/collection/useCollection'
import { NotFoundPage } from '@/sections/not-found-page/NotFoundPage'
import { BreadcrumbsGenerator } from '@/sections/shared/hierarchy/BreadcrumbsGenerator'
import { useGuestbookRepository } from '../GuestbookRepositoryContext'
import { GuestbookSkeleton } from '../GuestbookSkeleton'
import { useCreateGuestbook } from './useCreateGuestbook'
import styles from './CreateGuestbook.module.scss'

interface CreateGuestbookProps {
  collectionId: string
  collectionRepository: CollectionRepository
}

interface CustomQuestionDraft {
  id: number
  type: GuestbookQuestionType
  questionText: string
  required: boolean
  responseOptions: string[]
}

export const CreateGuestbook = ({ collectionId, collectionRepository }: CreateGuestbookProps) => {
  const { t } = useTranslation('guestbooks')
  const navigate: NavigateFunction = useNavigate()
  const guestbookRepository = useGuestbookRepository()
  const { collection, isLoading } = useCollection(collectionRepository, collectionId)
  const [guestbookName, setGuestbookName] = useState('')
  const [nameRequired, setNameRequired] = useState(false)
  const [emailRequired, setEmailRequired] = useState(false)
  const [institutionRequired, setInstitutionRequired] = useState(false)
  const [positionRequired, setPositionRequired] = useState(false)
  const [customQuestions, setCustomQuestions] = useState<CustomQuestionDraft[]>([
    {
      id: 1,
      type: 'text',
      questionText: '',
      required: false,
      responseOptions: ['']
    }
  ])
  const guestbooksGuideUrl =
    'https://guides.dataverse.org/en/6.9/user/dataverse-management.html#dataset-guestbooks'
  const guestbooksRoute = RouteWithParams.GUESTBOOKS(collectionId)
  const navigateToGuestbooks = () => navigate(guestbooksRoute)
  const { isCreatingGuestbook, errorCreatingGuestbook, handleCreateGuestbook } = useCreateGuestbook(
    {
      guestbookRepository,
      collectionIdOrAlias: collectionId,
      onSuccessfulCreate: navigateToGuestbooks
    }
  )

  const updateQuestion = (
    questionId: number,
    updater: (question: CustomQuestionDraft) => CustomQuestionDraft
  ) => {
    setCustomQuestions((current) =>
      current.map((question) => (question.id === questionId ? updater(question) : question))
    )
  }

  const addQuestionAfter = (questionId: number) => {
    setCustomQuestions((current) => {
      const nextId = Math.max(...current.map((question) => question.id), 0) + 1
      const newQuestion: CustomQuestionDraft = {
        id: nextId,
        type: 'text',
        questionText: '',
        required: false,
        responseOptions: ['']
      }

      const insertionIndex = current.findIndex((question) => question.id === questionId)
      if (insertionIndex === -1) {
        return [...current, newQuestion]
      }

      const nextQuestions = [...current]
      nextQuestions.splice(insertionIndex + 1, 0, newQuestion)
      return nextQuestions
    })
  }

  const removeQuestion = (questionId: number) => {
    setCustomQuestions((current) => {
      if (current.length === 1) {
        return current
      }
      return current.filter((question) => question.id !== questionId)
    })
  }

  const addOptionLine = (questionId: number, optionIndex: number) => {
    updateQuestion(questionId, (question) => {
      const nextOptions = [...question.responseOptions]
      nextOptions.splice(optionIndex + 1, 0, '')
      return { ...question, responseOptions: nextOptions }
    })
  }

  const removeOptionLine = (questionId: number, optionIndex: number) => {
    updateQuestion(questionId, (question) => {
      if (question.responseOptions.length === 1) {
        return question
      }
      const nextOptions = question.responseOptions.filter((_, index) => index !== optionIndex)
      return { ...question, responseOptions: nextOptions }
    })
  }

  const buildGuestbookDTO = (): CreateGuestbookDTO => ({
    name: guestbookName.trim(),
    enabled: false,
    nameRequired,
    emailRequired,
    institutionRequired,
    positionRequired,
    customQuestions: customQuestions
      .filter((question) => question.questionText.trim().length > 0)
      .map((question, index) => ({
        question: question.questionText.trim(),
        required: question.required,
        displayOrder: index,
        type: question.type,
        hidden: false,
        optionValues:
          question.type === 'options'
            ? question.responseOptions
                .filter((option) => option.trim().length > 0)
                .map((option, optionIndex) => ({
                  value: option.trim(),
                  displayOrder: optionIndex
                }))
            : undefined
      }))
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void handleCreateGuestbook(buildGuestbookDTO())
  }

  if (!isLoading && !collection) {
    return <NotFoundPage dvObjectNotFoundType="collection" />
  }

  if (isLoading || !collection) {
    return <GuestbookSkeleton />
  }

  return (
    <section>
      <BreadcrumbsGenerator
        hierarchy={collection.hierarchy}
        withActionItem
        actionItemText={t('create.title')}
        actionItems={[
          {
            text: t('title'),
            url: RouteWithParams.GUESTBOOKS(collectionId)
          },
          {
            text: t('create.title')
          }
        ]}
      />

      <Alert variant="info" dismissible={false}>
        <Trans
          t={t}
          i18nKey="create.info"
          components={{
            anchor: <a href={guestbooksGuideUrl} target="_blank" rel="noreferrer" />
          }}
        />
      </Alert>

      {errorCreatingGuestbook && <Alert variant="danger">{errorCreatingGuestbook}</Alert>}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <Form.Group as={Row} className={styles['form-row']} controlId="guestbook-name">
          <Form.Group.Label column sm={3} className={styles['row-label']} required>
            {t('create.fields.name.label')}
          </Form.Group.Label>
          <Col sm={6}>
            <Form.Group.Input
              type="text"
              aria-required={true}
              value={guestbookName}
              onChange={(event) => setGuestbookName(event.target.value)}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className={styles['form-row']}>
          <Form.Group.Label column sm={3} className={styles['row-label']}>
            {t('create.fields.dataCollected.label')}
          </Form.Group.Label>
          <Col sm={9}>
            <p className={styles.help}>{t('create.fields.dataCollected.help')}</p>
            <div className={styles.checkboxes}>
              <Form.Group.Checkbox
                id="data-collected-name"
                label={t('create.fields.dataCollected.options.name')}
                checked={nameRequired}
                onChange={() => setNameRequired((current) => !current)}
              />
              <Form.Group.Checkbox
                id="data-collected-email"
                label={t('create.fields.dataCollected.options.email')}
                checked={emailRequired}
                onChange={() => setEmailRequired((current) => !current)}
              />
              <Form.Group.Checkbox
                id="data-collected-institution"
                label={t('create.fields.dataCollected.options.institution')}
                checked={institutionRequired}
                onChange={() => setInstitutionRequired((current) => !current)}
              />
              <Form.Group.Checkbox
                id="data-collected-position"
                label={t('create.fields.dataCollected.options.position')}
                checked={positionRequired}
                onChange={() => setPositionRequired((current) => !current)}
              />
            </div>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className={styles['form-row']}>
          <Form.Group.Label column sm={3} className={styles['row-label']}>
            {t('create.fields.customQuestions.label')}
          </Form.Group.Label>
          <Col sm={9}>
            <p className={styles.help}>{t('create.fields.customQuestions.help')}</p>
            {customQuestions.map((question, questionIndex) => (
              <div key={question.id} className={styles['question-block']}>
                <Row className="g-3 align-items-end">
                  <Col sm={3}>
                    <Form.Group.Label>
                      {t('create.fields.customQuestions.typeLabel')}
                    </Form.Group.Label>
                    <Form.Group.Select
                      value={question.type}
                      onChange={(event) =>
                        updateQuestion(question.id, (current) => ({
                          ...current,
                          type: event.target.value as GuestbookQuestionType
                        }))
                      }>
                      <option value="text">
                        {t('create.fields.customQuestions.types.singleLine')}
                      </option>
                      <option value="textarea">
                        {t('create.fields.customQuestions.types.multipleLine')}
                      </option>
                      <option value="options">
                        {t('create.fields.customQuestions.types.multipleChoice')}
                      </option>
                    </Form.Group.Select>
                  </Col>
                  <Col sm={7}>
                    <Form.Group.Label>
                      {t('create.fields.customQuestions.questionText')}
                    </Form.Group.Label>
                    <Form.Group.Input
                      type="text"
                      value={question.questionText}
                      onChange={(event) =>
                        updateQuestion(question.id, (current) => ({
                          ...current,
                          questionText: event.target.value
                        }))
                      }
                    />
                  </Col>
                  <Col sm={2}>
                    <div className={styles['question-controls']}>
                      <Button
                        type="button"
                        variant="secondary"
                        className={styles['add-question-button']}
                        aria-label={t('create.fields.customQuestions.addQuestion')}
                        onClick={() => addQuestionAfter(question.id)}>
                        <PlusLg />
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        className={styles['add-question-button']}
                        aria-label={t('create.fields.customQuestions.removeQuestion')}
                        onClick={() => removeQuestion(question.id)}
                        disabled={customQuestions.length === 1}>
                        <DashLg />
                      </Button>
                    </div>
                  </Col>
                </Row>

                {question.type === 'options' && (
                  <div className={styles['response-options']}>
                    <Row className="g-3">
                      <Col sm={3}>
                        <div />
                      </Col>
                      <Col sm={7}>
                        <Form.Group.Label>
                          {t('create.fields.customQuestions.responseOptions')}
                        </Form.Group.Label>
                      </Col>
                    </Row>
                    {question.responseOptions.map((responseOption, optionIndex) => (
                      <Row
                        className={`g-3 align-items-end ${styles['option-row']}`}
                        key={`${question.id}-${optionIndex}`}>
                        <Col sm={3}>
                          <div />
                        </Col>
                        <Col sm={7}>
                          <Form.Group.Input
                            type="text"
                            value={responseOption}
                            onChange={(event) =>
                              updateQuestion(question.id, (current) => ({
                                ...current,
                                responseOptions: current.responseOptions.map((option, index) =>
                                  index === optionIndex ? event.target.value : option
                                )
                              }))
                            }
                          />
                        </Col>
                        <Col sm={2}>
                          <div className={styles['question-controls']}>
                            <Button
                              type="button"
                              variant="secondary"
                              className={styles['option-button']}
                              aria-label={t('create.fields.customQuestions.addOption')}
                              onClick={() => addOptionLine(question.id, optionIndex)}>
                              <PlusLg />
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              className={styles['option-button']}
                              aria-label={t('create.fields.customQuestions.removeOption')}
                              onClick={() => removeOptionLine(question.id, optionIndex)}
                              disabled={question.responseOptions.length === 1}>
                              <DashLg />
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    ))}
                  </div>
                )}

                <Form.Group.Checkbox
                  id={`custom-question-required-${question.id}`}
                  label={t('create.fields.customQuestions.required')}
                  checked={question.required}
                  onChange={() =>
                    updateQuestion(question.id, (current) => ({
                      ...current,
                      required: !current.required
                    }))
                  }
                />

                {questionIndex !== customQuestions.length - 1 && (
                  <div className={styles['question-separator']} />
                )}
              </div>
            ))}
          </Col>
        </Form.Group>

        <div className={styles.actions}>
          <Button type="submit" disabled={isCreatingGuestbook || guestbookName.trim().length === 0}>
            {t('create.submit')}
          </Button>
          <Button
            variant="link"
            type="button"
            disabled={isCreatingGuestbook}
            onClick={navigateToGuestbooks}>
            {t('create.cancel')}
          </Button>
        </div>
      </form>
    </section>
  )
}
