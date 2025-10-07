import colorVariables from '../../assets/styles/design-tokens/colors.module.scss'
import typographyVariables from '../../assets/styles/design-tokens/typography.module.scss'

export interface BaseThemeType {
  themeKey: string
  color: {
    brand: string
    primary: string
    secondary: string
    successColor: string
    warningColor: string
    infoColor: string

    dangerColor: string
    textColor: string
    subTextColor: string
    primaryTextColor: string
    secondaryTextColor: string
    successTextColor: string
    warningTextColor: string
    infoTextColor: string
    dangerTextColor: string
    successBoxColor: string
    warningBoxColor: string
    infoBoxColor: string
    dangerBoxColor: string
    headingsColor: string
    linkColor: string
    linkHoverColor: string
    buttonBorderColor: string
    tooltipColor: string
    tooltipHoverColor: string
  }
  typography: {
    fontSize: string
    fontSizeSm: string
    brandFontSize: string
    fontFamily: string
    fontWeight: string
    fontWeightBold: string
    fontWeightLight: string
    lineHeight: string
  }
}

export const baseTheme: BaseThemeType = {
  themeKey: 'base',
  color: {
    brand: colorVariables['brand'],
    primary: colorVariables['primary'],
    secondary: colorVariables['secondary'],
    successColor: colorVariables['success-color'],
    warningColor: colorVariables['warning-color'],
    infoColor: colorVariables['info-color'],
    dangerColor: colorVariables['danger-color'],
    textColor: colorVariables['text-color'],
    subTextColor: colorVariables['sub-text-color'],
    primaryTextColor: colorVariables['primary-text-color'],
    secondaryTextColor: colorVariables['secondary-text-color'],
    successTextColor: colorVariables['success-text-color'],
    warningTextColor: colorVariables['warning-text-color'],
    infoTextColor: colorVariables['info-text-color'],
    dangerTextColor: colorVariables['danger-text-color'],
    successBoxColor: colorVariables['success-box-color'],
    warningBoxColor: colorVariables['warning-box-color'],
    infoBoxColor: colorVariables['info-box-color'],
    dangerBoxColor: colorVariables['danger-box-color'],
    headingsColor: colorVariables['headings-color'],
    linkColor: colorVariables['link-color'],
    linkHoverColor: colorVariables['link-hover-color'],
    buttonBorderColor: colorVariables['button-border-color'],
    tooltipColor: colorVariables['tooltip-fill-color'],
    tooltipHoverColor: colorVariables['tooltip-border-color']
  },
  typography: {
    fontSize: typographyVariables['font-size'],
    fontSizeSm: typographyVariables['font-size-sm'],
    brandFontSize: typographyVariables['brand-font-size'],
    fontFamily: typographyVariables['font-family'],
    fontWeight: typographyVariables['font-weight'],
    fontWeightBold: typographyVariables['font-weight-bold'],
    fontWeightLight: typographyVariables['font-weight-light'],
    lineHeight: typographyVariables['line-height']
  }
}
