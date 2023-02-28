
//Login page
const SIGN_IN = '#signin'
const USER_ID = '#UserID'
const PASSWORD = '#Password'
const ENTER = 'input[value="Enter"]'

//Send email page
const MESSAGES = '#nav-mail'
const NEW_MAIL = '#mailNewBtn'
const MAIL_TO = '#mailTo'
const SUBJECT = '#mailSubject'
const ATTACHMENT_INPUT = 'input[type="file"]'
const ATTACHMENT_BTN = 'a:contains("Attachment")'
const SEND = '#mailSend'
const REFRESH = 'div[title="Refresh"]'
const MAIL_LIST = '#mailList'

/*
TODO:
  - Вынести действия пользователя в PO
  - удалить письмо после проверки
*/
const testFileName = 'dummy.txt'

describe('Mailfence spec', () => {
  before(() => {
    cy.writeFile(testFileName, "My only purpose is to be attached to the test e-mail. OMG :(")
  })

  it('File: attach > move > delete', function () {
    const testSubject = `The file you requested ${Date.now()}`
    cy.fixture('mailText.txt').as("mailText")

    cy.visit('/');

    cy.get(SIGN_IN).click();
    cy.get(USER_ID).type(Cypress.env("USERNAME"));
    cy.get(PASSWORD).type(Cypress.env("PASSWORD"), { log: false })
    cy.get(ENTER).click();

    cy.get(MESSAGES).click();
    cy.get(NEW_MAIL).click();
    cy.get(MAIL_TO).type(Cypress.env("USERNAME") + "@mailfence.com").type('{enter}');
    cy.get(SUBJECT).type(testSubject);
    cy.window().then((w) => {
      w.document.querySelector('.GCSDBRWBFGC').querySelector('iframe').contentDocument.body.innerHTML = this.mailText
    })
    cy.get(ATTACHMENT_BTN).click();
    cy.get(ATTACHMENT_INPUT).selectFile(testFileName, { force: true });
    cy.get('table').eq(1).find('tbody tr').last().should('contain.text', testFileName)
    cy.get(SEND).click();

    cy.waitForMail(testSubject);
    cy.get(`[title="${testSubject}"]`).click()

    cy.get(`a[title*="${testFileName}"]`).find('b').click({ force: true });
    cy.get('span:contains("Save in Documents")').click({ force: true })
    cy.get('div.treeItemLabel:contains("My documents")').click()

    cy.intercept("POST", 'https://mailfence.com/gwt').as('save');
    cy.get('div.btnCtn:contains("Save")').click();
    cy.get('div.btnCtn:contains("Save")').click();
    cy.wait('@save')

    cy.get('#nav-docs').click();
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