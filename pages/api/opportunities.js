import prisma from '../../lib/prisma'

let base = {
  type: 'FeatureCollection',
  crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
}

export default async function handler(req, res) {
  const allOpportunities = await prisma.opportunities.findMany()
  console.log(allOpportunities)
  base.features = allOpportunities.map(opportunity => ({
    type: 'Feature',
    properties: {
      ...opportunity
    },
    geometry: { type: 'Point', coordinates: [opportunity.longitude, opportunity.latitude, 0.0] },
  }))
  res.status(200).json(base)
}
