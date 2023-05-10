import TopBarProgress from 'react-topbar-progress-indicator'
import { useTheme } from '../../ui/theme/ThemeProvider'
import { useEffect, useState } from 'react'
import { useLoading } from '../../loading/LoadingContext'

const TopBarProgressIndicator = () => {
  const theme = useTheme()
  const { isLoading } = useLoading()
  const [progress, setProgress] = useState(false)

  useEffect(() => {
    setProgress(isLoading)
  }, [isLoading])

  TopBarProgress.config({
    barColors: {
      '0': theme.color.brand,
      '1.0': theme.color.secondary
    },
    shadowBlur: 5
  })

  return progress ? <TopBarProgress /> : <></>
}

export default TopBarProgressIndicator
