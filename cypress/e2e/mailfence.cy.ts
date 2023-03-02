import { Documents } from "../pageObjects/documents"
import { MessagesPage } from "../pageObjects/messages"
import { NewMessagePage } from "../pageObjects/newMessage"


/*
TODO:
  - Отрефакторить PO
  - добавить комментарии к функциям PO
  - удалить письмо после проверки
*/
const testFileName = 'dummy.txt'

describe('Mailfence spec', () => {
  before(() => {
    cy.writeFile(testFileName, "My only purpose is to be attached to the test e-mail. OMG :(")
  })

  beforeEach(() => {
    cy.fixture('mailText.txt').as("mailText")
  })

  it('File: attach > move > delete', function () {

    const testSubject = `The file you requested ${Date.now()}`

    cy.visit('/');
    cy.login();

    const mp = new MessagesPage();
    mp.createNewMessage();

    const nmp = new NewMessagePage();
    nmp
      .setMailReciever(Cypress.env("USERNAME") + "@mailfence.com")
      .setMailSubject(testSubject)
      .setMailText(this.mailText)
      .attachFile(testFileName);

    //Asserting the file was attached
    cy.get('table').eq(1).find('tbody tr').last().should('contain.text', testFileName)

    nmp.sendMail();

    mp
      .waitForNewMailWithSubject(testSubject)
      .openMailWithSubjectPreview(testSubject)
      .saveOpenedMailAttachmentToDocuments(testFileName);

    new Documents().open();

    //Asserting the testfile is in the documents
    cy.get(`[title="${testFileName}"]`).should('be.visible')

  })

  after(() => {
    let command = 'rm ' + testFileName;

    if (Cypress.platform.includes("win")) {
      command = `del /f "${testFileName}"`
    }

    cy.exec(command)
  })
})