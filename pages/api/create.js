import prisma from '../../lib/prisma'
const NodeGeocoder = require('node-geocoder')
const options = {
  provider: 'opencage',
  apiKey: 'b74c1f4948b54091a294c7ce3eee2aca',
}

const geocoder = NodeGeocoder(options)

export default async function handler(req, res) {
  const { LONGITUDE, LATITUDE } = (
    await fetch(
      `https://developers.onemap.sg/commonapi/search?searchVal=${req.body.postcode}&returnGeom=Y&getAddrDetails=Y&pageNum=1`,
    ).then(r => r.json())
  )['results'][0]
  const mapGeocode = await geocoder.geocode(
    req.body.postcode + ', Singapore, Singapore 266747',
  )
  const created = await prisma.opportunities.create({
    data: {
      name: req.body.title,
      description: req.body.description,
      address: req.body.postcode,
      longitude: parseFloat(LONGITUDE),
      latitude: parseFloat(LATITUDE),
      images: [],
    },
  })
  res.send(created)
}
