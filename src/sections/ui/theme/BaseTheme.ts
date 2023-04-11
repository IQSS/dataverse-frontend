import colorVariables from '../assets/styles/design-tokens/colors.module.scss'
import typographyVariables from '../assets/styles/design-tokens/typography.module.scss'

export const baseTheme = {
  themeKey: 'base',
  color: {
    brand: colorVariables.brand,
    primary: colorVariables.primary,
    secondary: colorVariables.secondary,
    textColor: colorVariables.textColor,
    subTextColor: colorVariables.subTextColor,
    primaryTextColor: colorVariables.primaryTextColor,
    primaryTextShadowColor: colorVariables.primaryTextShadowColor,
    secondaryTextColor: colorVariables.secondaryTextColor,
    secondaryTextShadowColor: colorVariables.secondaryTextShadowColor,
    linkColor: colorVariables.linkColor,
    linkHoverColor: colorVariables.linkHoverColor,
    primaryBackgroundColor: colorVariables.primaryBackgroundColor,
    primaryBackgroundColorDisabled: colorVariables.primaryBackgroundColorDisabled,
    primaryBorderColor: colorVariables.primaryBorderColor,
    secondaryBackgroundColor: colorVariables.secondaryBackgroundColor,
    secondaryBackgroundColorDisabled: colorVariables.secondaryBackgroundColorDisabled,
    secondaryBorderColor: colorVariables.secondaryBorderColor
  },
  typography: {
    fontSize: typographyVariables.fontSize,
    fontSizeSm: typographyVariables.fontSizeSm,
    brandFontSize: typographyVariables.brandFontSize,
    fontFamily: typographyVariables.fontFamily
  }
}
