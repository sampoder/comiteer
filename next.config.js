const withMDX = require('@next/mdx')({ extension: /\.mdx?$/ })
const withPWA = require('next-pwa')
module.exports = withPWA(
  withMDX({
    pwa: {
      dest: 'public',
    },
    pageExtensions: ['js', 'mdx'],
    images: {
      domains: [
        'cloud-okol6b1vm-hack-club-bot.vercel.app',
        'cloud-qmweg7d8y-hack-club-bot.vercel.app',
        'volunteer.gov.sg',
        'lp-cms-production.imgix.net',
        'www.volunteer.gov.sg',
      ],
    },
    webpack: (config, { isServer }) => {
      if (isServer) {
        config.externals.push('_http_common')
        // config.externals.push('encoding');
      }
      return config
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
  }),
)
