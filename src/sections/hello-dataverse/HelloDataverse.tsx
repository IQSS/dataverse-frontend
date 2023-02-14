import logo from './logo.svg'
import styles from './HelloDataverse.module.scss'

export function HelloDataverse() {
  return (
    <div className={styles.container}>
      <header>
        <h1 className={styles.title}>Hello Dataverse</h1>
        <img src={logo} className={styles.logo} alt="logo" />
        <p>
          Edit <code>src/sections/hello-dataverse/HelloDataverse.tsx</code> and save to reload.
        </p>
        <a
          className={styles.link}
          href="https://dataverse.org"
          target="_blank"
          rel="noopener noreferrer">
          Dataverse
        </a>
      </header>
    </div>
  )
}
