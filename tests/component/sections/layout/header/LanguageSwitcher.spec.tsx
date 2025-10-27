import { LANGUAGE_LOCAL_STORAGE_KEY } from '@/i18n'
import { LanguageSwitcher } from '@/sections/layout/header/LanguageSwitcher'

describe('LanguageSwitcher', () => {
  afterEach(() => {
    cy.clearAllLocalStorage()
  })

  it(
    'does not render when only one language is configured',
    {
      env: {
        LANGUAGES: [{ code: 'en', name: 'English' }]
      }
    },
    () => {
      cy.customMount(<LanguageSwitcher />)

      cy.get('#language-switcher-dropdown').should('not.exist')
    }
  )

  it(
    'renders language options correctly when more than one language is configured',
    {
      env: {
        LANGUAGES: [
          { code: 'en', name: 'English' },
          { code: 'es', name: 'Español' },
          { code: 'it', name: 'Italiano' }
        ]
      }
    },
    () => {
      cy.customMount(<LanguageSwitcher />)

      cy.get('#language-switcher-dropdown').should('exist')

      cy.get('#language-switcher-dropdown').click()

      cy.findByText('English').should('exist')
      cy.findByText('Español').should('exist')
      cy.findByText('Italiano').should('exist')
    }
  )

  it('changes language when a language option is selected', () => {
    cy.customMount(<LanguageSwitcher />)

    cy.findByTestId('language-switcher-dropdown-title').should('have.text', 'Language')

    cy.get('#language-switcher-dropdown').should('exist').click()

    cy.findByText('English').should('have.class', 'active')

    cy.findByText('Español').click()

    cy.findByText('Español').should('have.class', 'active')
    cy.findByText('English').should('not.have.class', 'active')

    // Dropdown title should update to the selected language
    cy.findByTestId('language-switcher-dropdown-title').should('have.text', 'Idioma')

    // Verify that the selected language is stored in localStorage
    cy.window().then((win) => {
      const storedLang = win.localStorage.getItem(LANGUAGE_LOCAL_STORAGE_KEY)
      expect(storedLang).to.equal('es')
    })

    // Change back to English
    cy.get('#language-switcher-dropdown').click()
    cy.findByText('English').click()

    cy.findByTestId('language-switcher-dropdown-title').should('have.text', 'Language')

    cy.findByText('English').should('have.class', 'active')
    cy.findByText('Español').should('not.have.class', 'active')

    cy.window().then((win) => {
      const storedLang = win.localStorage.getItem(LANGUAGE_LOCAL_STORAGE_KEY)
      expect(storedLang).to.equal('en')
    })
  })
})
