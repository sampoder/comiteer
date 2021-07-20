import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import Adapters from 'next-auth/adapters'
import prisma from '../../../lib/prisma'
import nodemailer from "nodemailer"
export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: ({
        identifier: email,
        url,
        token,
        baseUrl,
        provider,
      }) => {
        return new Promise((resolve, reject) => {
          const { server, from } = provider
          // Strip protocol from URL and use domain as site name
          const site = baseUrl.replace(/^https?:\/\//, '')

          nodemailer.createTransport(server).sendMail(
            {
              to: email,
              from,
              subject: `Sign in to Comiteer!`,
              text: text({ url, site, email }),
              html: html({ url, site, email }),
            },
            error => {
              if (error) {
                logger.error('SEND_VERIFICATION_EMAIL_ERROR', email, error)
                return reject(new Error('SEND_VERIFICATION_EMAIL_ERROR', error))
              }
              return resolve()
            },
          )
        })
      },
    }),

    // ...add more providers here
  ],

  adapter: Adapters.Prisma.Adapter({ prisma }),
})

// Email HTML body
const html = ({ url, site, email }) => {
  // Insert invisible space into domains and email address to prevent both the
  // email address and the domain from being turned into a hyperlink by email
  // clients like Outlook and Apple mail, as this is confusing because it seems
  // like they are supposed to click on their email address to sign in.
  const escapedEmail = `${email.replace(/\./g, '&#8203;.')}`
  const escapedSite = `${site.replace(/\./g, '&#8203;.')}`

  // Some simple styling options
  const backgroundColor = '#f9f9f9'
  const textColor = '#444444'
  const mainBackgroundColor = '#ffffff'
  const buttonBackgroundColor = '#346df1'
  const buttonBorderColor = '#346df1'
  const buttonTextColor = '#ffffff'

  // Uses tables for layout and inline CSS due to email client limitations
  return `
<body>
  Thanks for using Comiteer! Click <a href="${url}">here</a> to sign in.
</body>
`
}

// Email text body – fallback for email clients that don't render HTML
const text = ({ url, site }) => `Sign in to Comiteer!\n${url}\n\n`
