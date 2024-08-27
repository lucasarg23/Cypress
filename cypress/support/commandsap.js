// Comando para llenar y enviar el formulario
Cypress.Commands.add('fillAndSubmitForm', (data) => {
    cy.get('input[name="name"]').type(data.name);
    cy.get('input[name="email"]').type(data.email);
    cy.get('input[name="phone"]').type(data.phone);
    cy.get('input[name="subject"]').type(data.subject);
    cy.get('textarea[name="message"]').type(data.message);
    cy.get('button[type="submit"]').click();
});

// Comando para verificar el mensaje en la página
Cypress.Commands.add('verifyMessage', (message) => {
    cy.contains(message).should('be.visible');
});

