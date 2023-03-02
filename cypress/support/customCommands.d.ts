declare namespace Cypress {
  interface Chainable<Subject> {
    waitForMail(mailSubjectundefined: string, timeout?: number): Chainable<any>
    login(): Chainable<any>
  }
}