describe('Release Notes App', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should have a title', () => {
    // Given
    // When
    // Then
    cy.title().should('include', 'Relnotes');
  });
});
