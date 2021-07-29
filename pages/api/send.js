import prisma from '../../lib/prisma'
import { getSession } from 'next-auth/client'

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (session === null) {
    res.redirect('/')
    return
  }
  console.log(session)
  const user = await prisma.user.findFirst({
    where: {
      email: session.user.email,
    },
  })
  const message = await prisma.messages.create({
    data: {
      toId: parseInt(req.query.to),
      fromId: user.id,
      text: req.query.text
    }
  })
  res.json(message)
}