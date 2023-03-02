export class MessagesPage {
    createNewMessage() {
        const NEW_MAIL = '#mailNewBtn'

        cy.get(NEW_MAIL).click();
    }
    openMailWithSubjectPreview(mailSubject: string) {
        cy.get(`[title="${mailSubject}"]`).click();
        return this
    }

    saveOpenedMailAttachmentToDocuments(attachmentFileName: string) {
        cy.get(`a[title*="${attachmentFileName}"]`).find('b').click({ force: true });
        cy.get('span:contains("Save in Documents")').click({ force: true })
        cy.get('div.treeItemLabel:contains("My documents")').click()

        cy.intercept("POST", 'https://mailfence.com/gwt').as('save');
        cy.get('div.btnCtn:contains("Save")').click();
        cy.get('div.btnCtn:contains("Save")').click();
        cy.wait('@save')
    }

    waitForNewMailWithSubject(mailSubject: string, timeout = 3000) {
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

        return this
    }
}