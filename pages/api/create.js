import prisma from '../../lib/prisma'

export default async function handler(req, res) {
  const { LONGITUDE, LATITUDE, SEARCHVAL } = (
    await fetch(
      `https://developers.onemap.sg/commonapi/search?searchVal=${req.body.postcode}&returnGeom=Y&getAddrDetails=Y&pageNum=1`,
    ).then(r => r.json())
  )['results'][0]
  const created = await prisma.opportunities.create({
    data: {
      name: req.body.title,
      description: req.body.description,
      address: SEARCHVAL,
      longitude: parseFloat(LONGITUDE),
      latitude: parseFloat(LATITUDE),
      images: [],
    },
  })
  res.send(created)
}
