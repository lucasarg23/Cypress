// cypress/support/commands.js

// Comando para enviar un formulario vacío y verificar los mensajes de error
Cypress.Commands.add('submitEmptyForm', () => {
    cy.visit('https://automationintesting.online/');
    cy.log('Envío de form de contacto en blanco...');
    cy.get('#submitContact').click();
    cy.get('.alert').should('be.visible');
    cy.get('p').contains('Subject must be between 5 and 100 characters.');
    cy.get('p').contains('Subject may not be blank');
    cy.get('p').contains('Name may not be blank');
    cy.get('p').contains('Message must be between 20 and 2000 characters.');
    cy.get('p').contains('Message may not be blank');
    cy.get('p').contains('Email may not be blank');
    cy.get('p').contains('Phone may not be blank');
    cy.get('p').contains('Phone must be between 11 and 21 characters.');
  });
  
  // Comando para llenar el formulario con datos incorrectos
  Cypress.Commands.add('fillFormWithIncorrectData', () => {
    cy.log('Set de datos incorrectos...');
    cy.get('input[placeholder="Name"]').type('asd');
    cy.get('input[placeholder="Email"]').type('asdasd');
    cy.get('input[placeholder="Phone"]').type('asdasd');
    cy.get('input[placeholder="Subject"]').type('asdasd');
    cy.get('[data-testid="ContactDescription"]').type('asdasd');
    cy.get('#submitContact').click();
    cy.get('.alert').should('be.visible');
    cy.get('p').contains('Phone must be between 11 and 21 characters.');
    cy.get('p').contains('debe ser una dirección de correo electrónico con formato correcto');
    cy.get('p').contains('Message must be between 20 and 2000 characters.');
  });
  
  // Comando para llenar el formulario con datos correctos y verificar la respuesta de la API
  Cypress.Commands.add('submitFormAndVerifyApiResponse', (formData) => {
    // Interceptar la solicitud de la API
    cy.intercept('POST', '/api/contact', (req) => {
      // Puedes modificar la solicitud aquí si es necesario
      req.continue((res) => {
        // Opcional: verificar la respuesta
        expect(res.statusCode).to.equal(200); // O el código de estado que esperas
        expect(res.body).to.have.property('success', true); // Ajusta según la estructura de tu respuesta
      });
    }).as('contactFormSubmit');
  
    // Enviar el formulario
    cy.visit('https://automationintesting.online/');
    cy.get('input[placeholder="Name"]').type(formData.name);
    cy.get('input[placeholder="Email"]').type(formData.email);
    cy.get('input[placeholder="Phone"]').type(formData.phone);
    cy.get('input[placeholder="Subject"]').type(formData.subject);
    cy.get('[data-testid="ContactDescription"]').type(formData.message);
    cy.get('#submitContact').click();
  
    // Esperar y verificar la solicitud interceptada
    cy.wait('@contactFormSubmit').then((interception) => {
      // Verifica que la respuesta de la API es la esperada
      expect(interception.response.statusCode).to.equal(200); // Ajusta según tu respuesta esperada
      expect(interception.response.body).to.have.property('success', true); // Ajusta según tu respuesta esperada
    // cypress/support/commands.js

Cypress.Commands.add('submitFormWithInvalidDataAndVerifyApiResponse', (formData) => {
    // Interceptar la solicitud de la API
    cy.intercept('POST', '/api/contact', (req) => {
      req.continue((res) => {
        // Verifica la respuesta de la API para datos incorrectos
        expect(res.statusCode).to.equal(400); // Ajusta según tu código de estado esperado
        expect(res.body).to.have.property('errors'); // Ajusta según la estructura de tu respuesta
      });
    }).as('contactFormSubmit');
  
    // Visitar la página
    cy.visit('https://automationintesting.online/');
  
    // Rellenar el formulario con datos incorrectos
    cy.get('input[placeholder="Name"]').type(formData.name);
    cy.get('input[placeholder="Email"]').type(formData.email);
    cy.get('input[placeholder="Phone"]').type(formData.phone);
    cy.get('input[placeholder="Subject"]').type(formData.subject);
    cy.get('[data-testid="ContactDescription"]').type(formData.message);
    cy.get('#submitContact').click();
  
    // Esperar y verificar la solicitud interceptada
    cy.wait('@contactFormSubmit').then((interception) => {
      // Verifica que la respuesta de la API es la esperada
      expect(interception.response.statusCode).to.equal(400); // Ajusta según tu respuesta esperada
      expect(interception.response.body).to.have.property('errors'); // Ajusta según la estructura de tu respuesta esperada
    });
  });
  
    });
  });
  