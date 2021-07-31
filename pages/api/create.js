import prisma from '../../lib/prisma'

export default async function handler(req, res) {
  const { LONGITUDE, LATITUDE, SEARCHVAL } = (
    await fetch(
      `https://developers.onemap.sg/commonapi/search?searchVal=${req.query.postcode}&returnGeom=Y&getAddrDetails=Y&pageNum=1`,
    ).then(r => r.json())
  )['results'][0]
  const created = await prisma.opportunities.create({
    data: {
      name: req.query.title,
      description: req.query.description,
      address: SEARCHVAL,
      longitude: parseFloat(LONGITUDE),
      latitude: parseFloat(LATITUDE),
      images: [req.query.image],
      tags: req.query.tags.split(',')
    },
  })
  res.send(created)
}
