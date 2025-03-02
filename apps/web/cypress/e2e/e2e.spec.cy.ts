describe('Visit Page', () => {
  it('should visit the homepage and check the title', () => {
    cy.visit('/');
    cy.title().should('include', 'Dashboard');
  });
});
