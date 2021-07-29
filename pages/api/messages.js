import prisma from '../../lib/prisma'
import { getSession } from 'next-auth/client'

export default async function handler(req, res) {
  const md5 = require('md5')
  const session = await getSession({ req })
  if (session === null) {
    res.redirect('/')
    return
  }
  const user = await prisma.user.findFirst({
    where: {
      email: session.user.email,
    },
    include: {
      from: { include: { to: true } },
      to: { include: { from: true } },
    },
  })
  console.log(user)
  let conversations = [...user.from.map(x => x.to), ...user.to.map(x => x.from)]
    .map(x => ({
      id: x.id,
      nickname: x.nickname,
      image: `https://www.gravatar.com/avatar/${md5(x.email)}?d=retro`,
      lastMessaged: x.createdAt,
    }))
    .sort((a, b) => b.lastMessaged - a.lastMessaged)
    .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i)
  console.log(conversations)
  let messages = { sent: {}, received: {} }
  user.from.map(x => {
    if (typeof messages.sent[x.toId] == 'undefined') {
      messages.sent[x.toId] = [
        {
          text: x.text,
          attachments: x.attachements,
          createdAt: x.createdAt,
          sent: true,
          received: false,
        },
      ]
    } else {
      messages.sent[x.toId].push({
        text: x.text,
        attachments: x.attachements,
        createdAt: x.createdAt,
        sent: true,
        received: false,
      })
    }
  })
  user.to.map(x => {
    if (typeof messages.received[x.fromId] == 'undefined') {
      messages.received[x.fromId] = [
        {
          text: x.text,
          attachments: x.attachements,
          createdAt: x.createdAt,
          sent: false,
          received: true,
        },
      ]
    } else {
      messages.received[x.fromId].push({
        text: x.text,
        attachments: x.attachements,
        createdAt: x.createdAt,
        sent: false,
        received: true,
      })
    }
  })
  res.json({ conversations, messages })
}
