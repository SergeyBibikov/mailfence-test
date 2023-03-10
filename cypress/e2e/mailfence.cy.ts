import { DocumentsPage } from "../pageObjects/documents"
import { MessagesPage } from "../pageObjects/messages"
import { NewMessagePage } from "../pageObjects/newMessage"


const testFileName = 'dummy.txt'

//TODO: сделать PO future-proof
//TODO: переделать функцию ожидания письма на использование each и return false

describe('Mailfence spec', () => {
  before(() => {
    cy.writeFile(testFileName, "My only purpose is to be attached to the test e-mail. OMG :(")
  })

  beforeEach(() => {
    cy.fixture('mailText.txt').as("mailText")
  })

  it('File: attach > move > delete', function () {

    const testSubject = `The file you requested ${Date.now()}`

    const messagesPage = new MessagesPage();
    const newMessagePage = new NewMessagePage();

    cy.visit('/');
    cy.login();

    messagesPage.createNewMail();

    newMessagePage
      .setMailReciever(Cypress.env("USERNAME") + "@mailfence.com")
      .setMailSubject(testSubject)
      .setMailText(this.mailText)
      .attachFile(testFileName);

    //Asserting the file was attached
    cy.get('table').eq(1).find('tbody tr').last().should('contain.text', testFileName)

    newMessagePage.sendMail();

    messagesPage
      .waitForNewMailWithSubject(testSubject)
      .openMailWithSubjectPreview(testSubject)
      .saveOpenedMailAttachmentToDocumentsPage(testFileName);

    new DocumentsPage().open();

    //Asserting the testfile is in the DocumentsPage
    cy.get(`[title="${testFileName}"]`).should('be.visible')

    //Deleting the test email
    messagesPage.open().deleteMailWithSubject(testSubject);

  })

  after(() => {
    let command = 'rm ' + testFileName;

    if (Cypress.platform.includes("win")) {
      command = `del /f "${testFileName}"`
    }

    cy.exec(command)
  })
})