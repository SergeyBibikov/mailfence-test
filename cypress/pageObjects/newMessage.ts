export class NewMessagePage {
    setMailReciever(reciever: string) {
        const MAIL_TO = '#mailTo'

        cy.get(MAIL_TO).type(reciever).type('{enter}');

        return this
    }
    setMailSubject(subject: string) {
        const SUBJECT = '#mailSubject'

        cy.get(SUBJECT).type(subject);
        return this
    }
    setMailText(mailText: string) {
        cy.window().then((w) => {
            //TODO: заменить селектор на более надёжный
            w.document.querySelector('.GCSDBRWBFGC').querySelector('iframe').contentDocument.body.innerHTML = mailText
        })
        return this
    }
    attachFile(fileName: string) {
        const ATTACHMENT_INPUT = 'input[type="file"]'
        const ATTACHMENT_BTN = 'a:contains("Attachment")'

        cy.get(ATTACHMENT_BTN).click();
        cy.get(ATTACHMENT_INPUT).selectFile(fileName, { force: true });
        return this
    }
    sendMail() {
        const SEND = '#mailSend';

        cy.get(SEND).click();
    }
}