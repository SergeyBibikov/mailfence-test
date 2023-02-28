/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.on("uncaught:exception", (_, _1) => false)
Cypress.Commands.add('waitForMail', (mailSubject: string, timeout = 3000) => {
    const refr = (time: number, found: boolean) => {
        if (!found) {
            cy.wait(time)
            cy.get('div[title="Refresh"]').click()
            cy.get('table').eq(3).find('tbody').eq(1).should('be.visible')
        }
    }
    const gl = (d: Document) => d.querySelectorAll('table')[3].querySelectorAll('tbody')[1].innerHTML.includes(mailSubject)

    const t = timeout - 300
    const second = Math.round(t * 0.3)
    const third = t - second

    cy.get('table').eq(3).find('tbody').eq(1).should('be.visible')
    cy.log(`Waiting for the mail with subject "${mailSubject}"`)
    cy.document()
        .then(d => gl(d))
        .then(r => refr(300, r))

    cy.document()
        .then(d => gl(d))
        .then(r => refr(second, r))

    cy.document()
        .then(d => gl(d))
        .then(r => refr(third, r))

    cy.document()
        .then(d => gl(d))
        .then(r => expect(r).to.be.true)
})