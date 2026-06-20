const nodemailer = require('nodemailer')

module.exports = {
  async sendMail(opts) {
    // placeholder: in real app configure transport
    console.log('sendMail', opts)
    return true
  },
}
