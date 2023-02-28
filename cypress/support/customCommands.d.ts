declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * @param mailSubject 
     * @param timeout in ms. Defaults to 2000 ms
     */
    waitForMail(mailSubject: string, timeout?: number): Chainable<any>
  }
}