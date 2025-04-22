import type { JSX } from 'keycloakify/tools/JSX'
import { useState } from 'react'
import { kcSanitize } from 'keycloakify/lib/kcSanitize'
import { useIsPasswordRevealed } from 'keycloakify/tools/useIsPasswordRevealed'
import type { PageProps } from 'keycloakify/login/pages/PageProps'
import type { KcContext } from '../KcContext'
import type { I18n } from '../i18n'
import { Button, Col, Form } from '@iqss/dataverse-design-system'
import {
  EyeFill,
  EyeSlashFill,
  Facebook,
  Github,
  Gitlab,
  Google,
  Instagram,
  Linkedin,
  Microsoft,
  Paypal,
  StackOverflow,
  TwitterX
} from 'react-bootstrap-icons'
import cn from 'classnames'
import styles from './Login.module.scss'

export default function Login(props: PageProps<Extract<KcContext, { pageId: 'login.ftl' }>, I18n>) {
  const { kcContext, i18n, doUseDefaultCss, Template, classes } = props

  const {
    social,
    realm,
    url,
    usernameHidden,
    login,
    auth,
    registrationDisabled,
    messagesPerField
  } = kcContext

  const { msg, msgStr } = i18n

  const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false)

  return (
    <Template
      kcContext={kcContext}
      i18n={i18n}
      doUseDefaultCss={doUseDefaultCss}
      classes={classes}
      displayMessage={!messagesPerField.existsError('username', 'password')}
      headerNode={msg('loginAccountTitle')}
      displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
      infoNode={
        <div className={styles.info} id="kc-registration-container">
          <div id="kc-registration">
            <span>
              {msg('noAccount')} <a href={url.registrationUrl}>{msg('doRegister')}</a>
            </span>
          </div>
        </div>
      }
      socialProvidersNode={
        <>
          {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
            <div id="kc-social-providers" className={styles['social-providers']}>
              <hr />
              <h2>{msg('identity-provider-login-label')}</h2>
              <ul
                className={cn(styles['social-account-list'], {
                  [styles['grid']]: social.providers.length > 3
                })}>
                {social.providers.map((...[p]) => (
                  <li key={p.alias}>
                    <a id={`social-${p.alias}`} type="button" href={p.loginUrl}>
                      <span className={styles['social-icon']}>
                        {SocialAliasToIconMapper[p.alias as keyof typeof SocialAliasToIconMapper]}
                      </span>
                      <span dangerouslySetInnerHTML={{ __html: kcSanitize(p.displayName) }}></span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      }>
      <div id="kc-form">
        <div id="kc-form-wrapper">
          {realm.password && (
            <form
              id="kc-form-login"
              onSubmit={() => {
                setIsLoginButtonDisabled(true)
                return true
              }}
              action={url.loginAction}
              method="post">
              {/* Username Field */}
              {!usernameHidden && (
                <Form.Group as={Col}>
                  <Form.Group.Label htmlFor="username">
                    {!realm.loginWithEmailAllowed
                      ? msg('username')
                      : !realm.registrationEmailAsUsername
                      ? msg('usernameOrEmail')
                      : msg('email')}
                  </Form.Group.Label>
                  <Form.Group.Input
                    id="username"
                    name="username"
                    defaultValue={login.username ?? ''}
                    type="text"
                    autoFocus
                    autoComplete="username"
                    aria-invalid={messagesPerField.existsError('username', 'password')}
                    isInvalid={messagesPerField.existsError('username', 'password')}
                  />
                  {messagesPerField.existsError('username', 'password') && (
                    <Form.Group.Feedback type="invalid">
                      <span
                        id="input-error"
                        aria-live="polite"
                        dangerouslySetInnerHTML={{
                          __html: kcSanitize(messagesPerField.getFirstError('username', 'password'))
                        }}
                      />
                    </Form.Group.Feedback>
                  )}
                </Form.Group>
              )}

              {/* Password Field */}
              <Form.Group as={Col}>
                <Form.Group.Label htmlFor="password">{msg('password')}</Form.Group.Label>
                <PasswordWrapper i18n={i18n} passwordInputId="password">
                  <Form.Group.Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    aria-invalid={messagesPerField.existsError('username', 'password')}
                    isInvalid={messagesPerField.existsError('username', 'password')}
                  />
                </PasswordWrapper>
                {usernameHidden && messagesPerField.existsError('username', 'password') && (
                  <Form.Group.Feedback type="invalid">
                    <span
                      id="input-error"
                      aria-live="polite"
                      dangerouslySetInnerHTML={{
                        __html: kcSanitize(messagesPerField.getFirstError('username', 'password'))
                      }}
                    />
                  </Form.Group.Feedback>
                )}
              </Form.Group>

              {/* Remember Me and Forgot Password */}
              <div className={styles.settings}>
                <div id="kc-form-options">
                  {realm.rememberMe && !usernameHidden && (
                    <Form.Group.Checkbox
                      id="rememberMe"
                      name="rememberMe"
                      label={msg('rememberMe')}
                      defaultChecked={!!login.rememberMe}
                    />
                  )}
                </div>
                <div>
                  {realm.resetPasswordAllowed && (
                    <span>
                      <a href={url.loginResetCredentialsUrl}>{msg('doForgotPassword')}</a>
                    </span>
                  )}
                </div>
              </div>

              <div id="kc-form-buttons">
                <input
                  type="hidden"
                  id="id-hidden-input"
                  name="credentialId"
                  value={auth.selectedCredential}
                />
                <Button
                  disabled={isLoginButtonDisabled}
                  style={{ width: '100%' }}
                  name="login"
                  id="kc-login"
                  type="submit">
                  {msgStr('doLogIn')}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Template>
  )
}

function PasswordWrapper(props: { i18n: I18n; passwordInputId: string; children: JSX.Element }) {
  const { i18n, passwordInputId, children } = props

  const { msgStr } = i18n

  const { isPasswordRevealed, toggleIsPasswordRevealed } = useIsPasswordRevealed({
    passwordInputId
  })

  return (
    <Form.InputGroup>
      {children}
      <Button
        variant="secondary"
        type="button"
        aria-label={msgStr(isPasswordRevealed ? 'hidePassword' : 'showPassword')}
        aria-controls={passwordInputId}
        onClick={toggleIsPasswordRevealed}>
        {isPasswordRevealed ? <EyeSlashFill /> : <EyeFill />}
      </Button>
    </Form.InputGroup>
  )
}

const SocialAliasToIconMapper = {
  microsoft: <Microsoft />,
  google: <Google />,
  facebook: <Facebook />,
  instagram: <Instagram />,
  twitter: <TwitterX />,
  linkedin: <Linkedin />,
  stackoverflow: <StackOverflow />,
  github: <Github />,
  bitbucket: '',
  gitlab: <Gitlab />,
  paypal: <Paypal />,
  openshift: ''
}
