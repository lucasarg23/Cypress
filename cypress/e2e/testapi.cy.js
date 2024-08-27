describe('Verificar información en la página', () => {
    it('debería contener el texto específico en la página y confirmar con mensaje', () => {
        cy.visit('https://automationintesting.online/');

        cy.contains('Shady Meadows B&B').should('be.visible')
            .then(() => {
                cy.log('Éxito: El texto "Shady Meadows B&B" se encontró correctamente en la página.');
            });

        cy.get('.contact > :nth-child(3) > :nth-child(2)').should('be.visible')
            .and('contain.text', 'The Old Farmhouse, Shady Street, Newfordburyshire, NE1 410S')
            .then(() => {
                cy.log('Éxito: La dirección "The Old Farmhouse, Shady Street, Newfordburyshire, NE1 410S" se encontró correctamente en el elemento con clase "address".');
            });

        cy.get('.contact > :nth-child(3) > :nth-child(3)').should('be.visible')
            .and('contain.text', '012345678901')
            .then(() => {
                cy.log('Éxito: El número "012345678901" se encontró correctamente en el elemento con clase "number".');
            });

        cy.get('.contact > :nth-child(3) > :nth-child(4)').should('be.visible')
            .and('contain.text', 'fake@fakeemail.com')
            .then(() => {
                cy.log('Éxito: El email "fake@fakeemail.com" se encontró correctamente en el elemento con clase "email".');
            });

        cy.get('img.hotel-logoUrl').should('be.visible')
            .then(() => {
                cy.log('Éxito: La imagen con la clase "hotel-logoUrl" se encontró correctamente y es visible.');
            });

        cy.get('img.img-responsive.hotel-img').should('be.visible')
            .then(() => {
                cy.log('Éxito: La imagen con las clases "img-responsive" y "hotel-img" se encontró correctamente y es visible.');
            });

        cy.contains('Welcome to Shady Meadows, a delightful Bed & Breakfast nestled in the hills on Newingtonfordburyshire. A place so beautiful you will never want to leave. All our rooms have comfortable beds and we provide breakfast from the locally sourced supermarket. It is a delightful place.')
            .should('be.visible')
            .then(() => {
                cy.log('Éxito: El texto esperado está presente en la página.');
            });
    });
});

describe('Enviar mensaje', { testIsolation: false }, () => {
    // Configurar interceptaciones comunes antes de los tests
    before(() => {
        cy.intercept('POST', '**/submitForm', (req) => {
            if (req.body.name === 'Error') {
                // Simula un error de API
                req.reply({
                    statusCode: 500,
                    body: { message: 'Error en el envío del formulario. Por favor, inténtelo de nuevo.' }
                });
            } else {
                // Simula una respuesta exitosa
                req.reply({
                    statusCode: 200,
                    body: { message: 'Formulario enviado con éxito!' }
                });
            }
        }).as('formSubmit');
    });

    it('Validar envío de formulario vacío', () => {
        cy.submitEmptyForm();
    });

    it('Validar envío de formulario con datos incorrectos', () => {
        cy.fillFormWithIncorrectData();
    });

    it('Validar envío de formulario con datos correctos y verificar la API', () => {
        const formData = {
            name: 'Juan Pérez',
            email: 'juan@gmail.com',
            phone: '35123696457',
            subject: 'Reserva de habitación para fecha X',
            message: 'loremTestloremTestloremTestloremTestloremTestloremTestloremTestloremTestloremTestlo'
        };

        // Usar el comando personalizado para llenar y enviar el formulario
        cy.fillAndSubmitForm(formData);

        // Esperar la respuesta simulada de la API (exitosa en este caso)
        cy.wait('@formSubmit');

        // Verificar el mensaje de éxito
        cy.verifyMessage('Formulario enviado con éxito!');
    });

    it('Validar manejo de error de API', () => {
        const formData = {
            name: 'Error',
            email: 'error@gmail.com',
            phone: '1234567890',
            subject: 'Solicitud de error',
            message: 'Este es un mensaje de prueba para simular un error.'
        };

        // Usar el comando personalizado para llenar y enviar el formulario
        cy.fillAndSubmitForm(formData);

        // Esperar la respuesta simulada de la API (error en este caso)
        cy.wait('@formSubmit');

        // Verificar el mensaje de error
        cy.verifyMessage('Error en el envío del formulario. Por favor, inténtelo de nuevo.');
    });
});
