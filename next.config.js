const withMDX = require('@next/mdx')({ extension: /\.mdx?$/ })
module.exports = withMDX({
  pageExtensions: ['js', 'mdx'],
  images: {
    domains: [
      'cloud-okol6b1vm-hack-club-bot.vercel.app',
      'cloud-qmweg7d8y-hack-club-bot.vercel.app',
      'volunteer.gov.sg',
      'lp-cms-production.imgix.net',
      'www.volunteer.gov.sg'
    ],
  },
  async redirects() {
    return [
      {
        source: '/callback',
        destination: '/api/singpass',
        permanent: true,
      },
    ]
  },
})
