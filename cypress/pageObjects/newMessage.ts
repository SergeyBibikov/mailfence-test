export class NewMessagePage {
    setMailReciever(reciever: string) {
        cy.get('#mailTo').type(reciever).type('{enter}');

        return this
    }

    setMailSubject(subject: string) {
        cy.get('#mailSubject').type(subject);

        return this
    }

    setMailText(mailText: string) {
        cy.window().then((w) => {
            //@ts-ignore
            w.document.querySelector('iframe[class*="editable"]').contentDocument.body.innerHTML = mailText
        })

        return this
    }

    attachFile(fileName: string) {
        cy.get('a:contains("Attachment")').click();
        cy.get('input[type="file"]').selectFile(fileName, { force: true });

        return this
    }

    sendMail() {
        cy.get('#mailSend').click();
    }
}