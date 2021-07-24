import prisma from '../../lib/prisma'
const crypto = require('crypto')
var MyInfoConnector = require('myinfo-connector-nodejs')
import { getSession } from 'next-auth/client'
const title = require('title')

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (session === null) {
    res.redirect('/')
    return
  }
  const user = await prisma.user.findFirst({
    where: {
      email: session.user.email,
    },
  })
  res.redirect(user.name ? `/` : '/verify')
}
