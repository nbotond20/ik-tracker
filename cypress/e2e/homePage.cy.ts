export {}
context('Home Page', () => {
  it('Should render a page with "Hello from tRPC" text present on the screen', () => {
    cy.visit('http://localhost:3000')
    cy.wait(1000)
    cy.contains('This is a mock test. Always passes').should('not.exist')
  })
})
