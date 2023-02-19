import testIds from 'cypress/testIds'

context('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.url().should('include', '/')
    cy.viewport(1280, 720)
  })

  it('Should render homepage', () => {
    cy.findByTestId(testIds.home_title).should('exist')
    cy.findByTestId(testIds.home_subtitle).should('exist')
    cy.findByTestId(testIds.home_login_link).should('exist')
    cy.findByTestId(testIds.home_features_link).should('exist')
    cy.findByTestId(testIds.home_get_started_link).should('exist')
  })

  it('Should jump to features', () => {
    cy.findByTestId(testIds.home_feature_section).should('exist').should('not.be.visible')
    cy.findByTestId(testIds.home_features_link).should('exist').should('be.visible')
    cy.findByTestId(testIds.home_features_link).click({ force: true })
    cy.url().should('include', '#features')
    cy.findByTestId(testIds.home_feature_section).should('be.visible')
  })

  it('Should jump back to top', () => {
    cy.findByTestId(testIds.home_feature_section).should('exist').should('not.be.visible')
    cy.findByTestId(testIds.home_features_link).should('exist').should('be.visible')
    cy.findByTestId(testIds.home_features_link).click({ force: true })
    cy.url().should('include', '#features')
    cy.findByTestId(testIds.home_feature_section).should('be.visible')
    cy.findByTestId(testIds.home_features_link).should('not.be.visible')
    cy.findByTestId(testIds.home_top_link).scrollIntoView().should('be.visible')
    cy.findByTestId(testIds.home_top_link).click({ force: true })
    cy.url().should('include', '#top')
    cy.findByTestId(testIds.home_feature_section).should('not.be.visible')
  })

  it('Should jump to login', () => {
    cy.findByTestId(testIds.home_login_link).should('exist').should('be.visible')
    cy.findByTestId(testIds.home_login_link).click({ force: true })
    cy.url().should('include', '/login')
  })

  it('Should jump to get started', () => {
    cy.findByTestId(testIds.home_get_started_link).should('exist').should('be.visible')
    cy.findByTestId(testIds.home_get_started_link).click({ force: true })
    cy.url().should('include', '/login')
  })
})
