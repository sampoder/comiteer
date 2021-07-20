import prisma from '../../lib/prisma'

let base = {
  type: 'FeatureCollection',
  crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
}

export default async function handler(req, res) {
  let tags
  try {
    tags = req.query.tags.split(',')
  } catch {
    tags = []
  }
  console.log(tags)
  const allOpportunities = await prisma.opportunities.findMany(
    tags.length > 0
      ? {
          where: {
            OR: tags.map(tag => ({
              tags: { has: tag },
            })),
          },
        }
      : {},
  )
  console.log(allOpportunities)
  base.features = allOpportunities.map(opportunity => ({
    type: 'Feature',
    properties: {
      ...opportunity,
    },
    geometry: {
      type: 'Point',
      coordinates: [opportunity.longitude, opportunity.latitude, 0.0],
    },
  }))
  res.status(200).json(base)
}
