const sgMail = require('@sendgrid/mail')
sgMail.setApiKey("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")
const send_mail = (to_mail, subject, text) => {
    const mgs = {
        to: to_mail,
        from: 'no-reply@avidia.in',
        subject: subject,
        text: text
    }
    sgMail
    .send(mgs)
    .then(()=>console.log('Mail sent'))
    .catch((error)=>console.log(error))
}

//send_mail('mushrafahmed555@gmail.com', 'jdgdjhgdj', 'ejdgjhgd', 'edh')
module.exports = send_mail;