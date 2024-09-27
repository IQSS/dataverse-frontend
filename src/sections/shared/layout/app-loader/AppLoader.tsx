import cn from 'classnames'
import { Spinner } from '@iqss/dataverse-design-system'
import styles from './AppLoader.module.scss'

interface AppLoaderProps {
  fullViewport?: boolean
}

export const AppLoader = ({ fullViewport = false }: AppLoaderProps) => {
  return (
    <section
      className={cn(styles['app-loader'], {
        [styles['full-viewport']]: fullViewport
      })}>
      <Spinner />
    </section>
  )
}
