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
    brand: colorVariables.brand,
    primary: colorVariables.primary,
    secondary: colorVariables.secondary,
    successColor: colorVariables.successColor,
    warningColor: colorVariables.warningColor,
    infoColor: colorVariables.infoColor,
    dangerColor: colorVariables.dangerColor,
    textColor: colorVariables.textColor,
    subTextColor: colorVariables.subTextColor,
    primaryTextColor: colorVariables.primaryTextColor,
    secondaryTextColor: colorVariables.secondaryTextColor,
    successTextColor: colorVariables.successTextColor,
    warningTextColor: colorVariables.warningTextColor,
    infoTextColor: colorVariables.infoTextColor,
    dangerTextColor: colorVariables.dangerTextColor,
    successBoxColor: colorVariables.successBoxColor,
    warningBoxColor: colorVariables.warningBoxColor,
    infoBoxColor: colorVariables.infoBoxColor,
    dangerBoxColor: colorVariables.dangerBoxColor,
    headingsColor: colorVariables.headingsColor,
    linkColor: colorVariables.linkColor,
    linkHoverColor: colorVariables.linkHoverColor,
    buttonBorderColor: colorVariables.buttonBorderColor,
    tooltipColor: colorVariables.tooltipColor,
    tooltipHoverColor: colorVariables.tooltipHoverColor
  },
  typography: {
    fontSize: typographyVariables.fontSize,
    fontSizeSm: typographyVariables.fontSizeSm,
    brandFontSize: typographyVariables.brandFontSize,
    fontFamily: typographyVariables.fontFamily,
    fontWeight: typographyVariables.fontWeight,
    fontWeightBold: typographyVariables.fontWeightBold,
    fontWeightLight: typographyVariables.fontWeightLight,
    lineHeight: typographyVariables.lineHeight
  }
}
