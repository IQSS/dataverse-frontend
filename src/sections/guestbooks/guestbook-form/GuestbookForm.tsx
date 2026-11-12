import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Col, Form, Row } from '@iqss/dataverse-design-system'
import { DashLg, PlusLg } from 'react-bootstrap-icons'
import { GuestbookQuestionType } from '@/guestbooks/domain/models/Guestbook'
import { GuestbookDTO } from '@/guestbooks/domain/useCases/DTOs/GuestbookDTO'
import styles from '../create-guestbooks/CreateGuestbook.module.scss'

interface GuestbookFormProps {
  initialGuestbook?: GuestbookDTO
  isSubmitting: boolean
  submitButtonText: string
  cancelButtonText: string
  onSubmit: (guestbook: GuestbookDTO) => void
  onCancel: () => void
}

interface CustomQuestionDraft {
  draftId: number
  id?: number
  type: GuestbookQuestionType
  questionText: string
  required: boolean
  hidden: boolean
  responseOptions: ResponseOptionDraft[]
}

interface ResponseOptionDraft {
  id?: number
  value: string
}

const createEmptyQuestion = (draftId: number): CustomQuestionDraft => ({
  draftId,
  type: 'text',
  questionText: '',
  required: false,
  hidden: false,
  responseOptions: [{ value: '' }]
})

const getInitialQuestions = (guestbook?: GuestbookDTO): CustomQuestionDraft[] => {
  const customQuestions = guestbook?.customQuestions ?? []

  if (customQuestions.length === 0) {
    return [createEmptyQuestion(1)]
  }

  return customQuestions.map((question, index) => ({
    draftId: question.id ?? index + 1,
    id: question.id,
    type: question.type,
    questionText: question.question,
    required: question.required,
    hidden: question.hidden,
    responseOptions:
      question.optionValues && question.optionValues.length > 0
        ? question.optionValues.map((option) => ({ id: option.id, value: option.value }))
        : [{ value: '' }]
  }))
}

export const GuestbookForm = ({
  initialGuestbook,
  isSubmitting,
  submitButtonText,
  cancelButtonText,
  onSubmit,
  onCancel
}: GuestbookFormProps) => {
  const { t } = useTranslation('guestbooks')
  const [guestbookName, setGuestbookName] = useState(initialGuestbook?.name ?? '')
  const [nameRequired, setNameRequired] = useState(initialGuestbook?.nameRequired ?? false)
  const [emailRequired, setEmailRequired] = useState(initialGuestbook?.emailRequired ?? false)
  const [institutionRequired, setInstitutionRequired] = useState(
    initialGuestbook?.institutionRequired ?? false
  )
  const [positionRequired, setPositionRequired] = useState(
    initialGuestbook?.positionRequired ?? false
  )
  const [customQuestions, setCustomQuestions] = useState<CustomQuestionDraft[]>(
    getInitialQuestions(initialGuestbook)
  )

  useEffect(() => {
    setGuestbookName(initialGuestbook?.name ?? '')
    setNameRequired(initialGuestbook?.nameRequired ?? false)
    setEmailRequired(initialGuestbook?.emailRequired ?? false)
    setInstitutionRequired(initialGuestbook?.institutionRequired ?? false)
    setPositionRequired(initialGuestbook?.positionRequired ?? false)
    setCustomQuestions(getInitialQuestions(initialGuestbook))
  }, [initialGuestbook])

  const updateQuestion = (
    questionDraftId: number,
    updater: (question: CustomQuestionDraft) => CustomQuestionDraft
  ) => {
    setCustomQuestions((current) =>
      current.map((question) =>
        question.draftId === questionDraftId ? updater(question) : question
      )
    )
  }

  const addQuestionAfter = (questionDraftId: number) => {
    setCustomQuestions((current) => {
      const nextId = Math.max(...current.map((question) => question.draftId), 0) + 1
      const newQuestion = createEmptyQuestion(nextId)
      const insertionIndex = current.findIndex((question) => question.draftId === questionDraftId)

      if (insertionIndex === -1) {
        return [...current, newQuestion]
      }

      const nextQuestions = [...current]
      nextQuestions.splice(insertionIndex + 1, 0, newQuestion)
      return nextQuestions
    })
  }

  const removeQuestion = (questionDraftId: number) => {
    setCustomQuestions((current) => {
      if (current.length === 1) {
        return current
      }
      return current.filter((question) => question.draftId !== questionDraftId)
    })
  }

  const addOptionLine = (questionDraftId: number, optionIndex: number) => {
    updateQuestion(questionDraftId, (question) => {
      const nextOptions = [...question.responseOptions]
      nextOptions.splice(optionIndex + 1, 0, { value: '' })
      return { ...question, responseOptions: nextOptions }
    })
  }

  const removeOptionLine = (questionDraftId: number, optionIndex: number) => {
    updateQuestion(questionDraftId, (question) => {
      if (question.responseOptions.length === 1) {
        return question
      }
      const nextOptions = question.responseOptions.filter((_, index) => index !== optionIndex)
      return { ...question, responseOptions: nextOptions }
    })
  }

  const buildGuestbookDTO = (): GuestbookDTO => ({
    name: guestbookName.trim(),
    enabled: initialGuestbook?.enabled ?? true,
    nameRequired,
    emailRequired,
    institutionRequired,
    positionRequired,
    ...(initialGuestbook?.createTime !== undefined
      ? { createTime: initialGuestbook.createTime }
      : {}),
    customQuestions: customQuestions
      .filter((question) => question.questionText.trim().length > 0)
      .map((question, index) => ({
        ...(question.id !== undefined ? { id: question.id } : {}),
        question: question.questionText.trim(),
        required: question.required,
        displayOrder: index,
        type: question.type,
        hidden: question.hidden,
        optionValues:
          question.type === 'options'
            ? question.responseOptions
                .filter((option) => option.value.trim().length > 0)
                .map((option, optionIndex) => ({
                  ...(option.id !== undefined ? { id: option.id } : {}),
                  value: option.value.trim(),
                  displayOrder: optionIndex
                }))
            : undefined
      }))
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(buildGuestbookDTO())
  }

  return (
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
            <div key={question.draftId} className={styles['question-block']}>
              <Row className="g-3 align-items-end">
                <Col sm={3}>
                  <Form.Group.Label>
                    {t('create.fields.customQuestions.typeLabel')}
                  </Form.Group.Label>
                  <Form.Group.Select
                    value={question.type}
                    onChange={(event) =>
                      updateQuestion(question.draftId, (current) => ({
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
                      updateQuestion(question.draftId, (current) => ({
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
                      onClick={() => addQuestionAfter(question.draftId)}>
                      <PlusLg />
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      className={styles['add-question-button']}
                      aria-label={t('create.fields.customQuestions.removeQuestion')}
                      onClick={() => removeQuestion(question.draftId)}
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
                      key={`${question.draftId}-${responseOption.id ?? optionIndex}`}>
                      <Col sm={3}>
                        <div />
                      </Col>
                      <Col sm={7}>
                        <Form.Group.Input
                          type="text"
                          value={responseOption.value}
                          onChange={(event) =>
                            updateQuestion(question.draftId, (current) => ({
                              ...current,
                              responseOptions: current.responseOptions.map((option, index) =>
                                index === optionIndex
                                  ? { ...option, value: event.target.value }
                                  : option
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
                            onClick={() => addOptionLine(question.draftId, optionIndex)}>
                            <PlusLg />
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            className={styles['option-button']}
                            aria-label={t('create.fields.customQuestions.removeOption')}
                            onClick={() => removeOptionLine(question.draftId, optionIndex)}
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
                id={`custom-question-required-${question.draftId}`}
                label={t('create.fields.customQuestions.required')}
                checked={question.required}
                onChange={() =>
                  updateQuestion(question.draftId, (current) => ({
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
        <Button type="submit" disabled={isSubmitting || guestbookName.trim().length === 0}>
          {submitButtonText}
        </Button>
        <Button variant="link" type="button" disabled={isSubmitting} onClick={onCancel}>
          {cancelButtonText}
        </Button>
      </div>
    </form>
  )
}
