import styles from './Header.module.scss'
import logo from '../../shared/logo.svg'
import { useTranslation } from 'react-i18next'
import { Button } from '../../shared/button/Button'

type User = {
  name: string
}

interface HeaderProps {
  user?: User
  onLogin: () => void
  onLogout: () => void
  onCreateAccount: () => void
}

export function Header({ user, onLogin, onLogout, onCreateAccount }: HeaderProps) {
  const { t } = useTranslation('helloDataverse')

  return (
    <header className={styles.wrapper}>
      <div className={styles.container}>
        <div>
          <img width="28" height="28" src={logo} alt={t('altImage') ?? 'logo'} />
          <h1 className={styles.title}>Dataverse</h1>
        </div>
        <div>
          {user ? (
            <>
              <span className={styles.welcome}>
                Welcome, <b>{user.name}</b>!
              </span>
              <Button secondary onClick={onLogout} label="Log out" />
            </>
          ) : (
            <>
              <Button secondary onClick={onLogin} label="Log in" />
              <Button onClick={onCreateAccount} label="Sign up" />
            </>
          )}
        </div>
      </div>
    </header>
  )
}
