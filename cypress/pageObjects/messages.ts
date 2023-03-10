export class MessagesPage {
    /** Opens the form of new mail creation */
    createNewMail() {
        cy.get('#mailNewBtn').click();
    }

    /**
     * Deletes the mail with the specified subject from inbox
     * @param mailSubject 
     */
    deleteMailWithSubject(mailSubject: string) {
        const mail = `[title="${mailSubject}"]`

        cy.get(mail).should('be.visible')

        cy.document().then((d) => {
            if (d.querySelectorAll('tr.selectedRow').length === 0) {
                cy.get(mail).parents('td').prev().click()
            }
        })

        cy.get('[title="To Trash"]').click();
    }

    open() {
        cy.get('#nav-mail').click()

        return this
    }

    openMailWithSubjectPreview(mailSubject: string) {
        cy.get(`[title="${mailSubject}"]`).click();
        return this
    }

    /**
     * Saves the file specified from the mail whose preview is 
     * currently open.
     * @param attachmentFileName 
     */
    saveOpenedMailAttachmentToDocumentsPage(attachmentFileName: string) {
        cy.get(`a[title*="${attachmentFileName}"]`).find('b').click({ force: true });
        cy.get('span:contains("Save in DocumentsPage")').click({ force: true })
        cy.get('div.treeItemLabel:contains("My DocumentsPage")').click()

        cy.intercept("POST", 'https://mailfence.com/gwt').as('save');

        const saveBtn = 'div.btnCtn:contains("Save")';
        cy.get(saveBtn).click();
        //Somehow one click is not enough
        cy.get(saveBtn).click();

        cy.wait('@save')
    }

    /**
     * Makes maximum 3 iterations waiting for the mail with the specified subject.
     * The wait time increases with every iteration.
     * @param mailSubject 
     * @param timeout total timeout in ms. Default is 3000
     */
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