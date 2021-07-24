import prisma from '../../lib/prisma'
const crypto = require('crypto')
var MyInfoConnector = require('myinfo-connector-nodejs')
import { getSession } from 'next-auth/client'
const title = require('title')

export default async function handler(req, res) {
  const session = await getSession({ req })
  if (session === null || !req.query.nickname) {
    res.redirect('/')
    return
  }
  const updateUser = await prisma.user.update({
    where: {
      email: session.user.email,
    },
    data: {
      nickname: req.query.nickname,
    },
  })

  let name = title(updateUser.name)
  
  if (!(
    updateUser.nickname ==
      `${name.split(' ')[0]} ${name
        .split(' ')
        [name.split(' ').length - 1][0].toUpperCase()}.` ||
    updateUser.nickname ==
      `${name.split(' ')[0][0].toUpperCase()}.${name.replace(
        name.split(' ')[0],
        '',
      )}` ||
    updateUser.nickname ==
      `${name.replace(name.split(' ')[0] + ' ', '')} ${name
        .split(' ')[0][0]
        .toUpperCase()}.` ||
    updateUser.nickname == `${name}`
  )) {
    const updateUser2 = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        nickname: name,
      },
    })
    res.send('Invalid Nickname. Not Changed.')
    return
  }
  res.redirect(`/`)
}
