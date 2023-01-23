export {}
context('Test Componenet', () => {
  it('Should render a page with test and test2 text present on the screen', () => {
    cy.visit('http://localhost:3000')

    cy.contains('Test3')
    cy.contains('Test2')
  })
})
