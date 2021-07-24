import prisma from '../../lib/prisma'
const crypto = require('crypto')
var MyInfoConnector = require('myinfo-connector-nodejs')
import { getSession } from 'next-auth/client'
const title = require('title')

let APP_CONFIG = {
  DEMO_APP_CLIENT_ID: 'STG2-MYINFO-DEMO-APP',
  DEMO_APP_CLIENT_SECRET: 'outzuu7n3bxzcvdyrv98y3picshnkydf1r4ybwas',
  DEMO_APP_CLIENT_SECURE_CERT: './cert/your-sample-app-certificate.p12',
  DEMO_APP_CLIENT_SECURE_CERT_PASSPHRASE: 'DemoApp',
  DEMO_APP_CALLBACK_URL: 'http://localhost:3001/callback',
  DEMO_APP_PURPOSE: 'demonstrating MyInfo APIs',
  DEMO_APP_SCOPES: 'uinfin,name,dob',
  MYINFO_API_AUTHORISE: {
    SANDBOX: 'https://sandbox.api.myinfo.gov.sg/com/v3/authorise',
    TEST: 'https://test.api.myinfo.gov.sg/com/v3/authorise',
  },
  MYINFO_API_TOKEN: {
    SANDBOX: 'https://sandbox.api.myinfo.gov.sg/com/v3/token',
    TEST: 'https://test.api.myinfo.gov.sg/com/v3/token',
  },
  MYINFO_API_PERSON: {
    SANDBOX: 'https://sandbox.api.myinfo.gov.sg/com/v3/person',
    TEST: 'https://test.api.myinfo.gov.sg/com/v3/person',
  },
}

let MYINFO_CONNECTOR_CONFIG = {
  MYINFO_SIGNATURE_CERT_PUBLIC_CERT: 'cert/staging-myinfo-public-cert.pem',

  CLIENT_ID: APP_CONFIG.DEMO_APP_CLIENT_ID, //Client id provided during onboarding
  CLIENT_SECRET: APP_CONFIG.DEMO_APP_CLIENT_SECRET, //Client secret provided during onboarding
  CLIENT_SECURE_CERT: APP_CONFIG.DEMO_APP_CLIENT_SECURE_CERT, //Alias of the application private key in P12 format.
  CLIENT_SECURE_CERT_PASSPHRASE:
    APP_CONFIG.DEMO_APP_CLIENT_SECURE_CERT_PASSPHRASE, //Password of the private key.
  REDIRECT_URL: APP_CONFIG.DEMO_APP_CALLBACK_URL, //Redirect URL for web application
  ATTRIBUTES: APP_CONFIG.DEMO_APP_SCOPES,

  ENVIRONMENT: 'TEST',
  TOKEN_URL: 'https://test.api.myinfo.gov.sg/com/v3/token',
  PERSON_URL: 'https://test.api.myinfo.gov.sg/com/v3/person',

  //Proxy parameters (OPTIONAL)
  USE_PROXY: 'N', //Indicate whether proxy url is used. i.e. Y or N
  PROXY_TOKEN_URL: '', //Configure your proxy url here, if any.
  PROXY_PERSON_URL: '', //Configure your proxy url here, if any.

  /*
  Debug level for library logging. i.e 'error, info, debug' leave empty to turn off logs (OPTIONAL)
   * error - Log out all the errors returned from the library
   * info - log urls called, authorization headers and errors from the library
   * debug - Full logs from the library, i.e (errors, urls, authorization headers, API response) 
  
  NOTE: debug mode should never be turned on in production
  */
  DEBUG_LEVEL: 'info',
}

export default async function handler(req, res) {
  try {
    var authCode = req.query.code
    var state = req.query.state
    var txnNo = crypto.randomBytes(10).toString('hex')
    let connector = new MyInfoConnector(MYINFO_CONNECTOR_CONFIG)
    connector
      .getMyInfoPersonData(authCode, state, txnNo)
      .then(async personData => {
        const session = await getSession({ req })
        if (session === null) {
          res.redirect('/')
          return
        }
        const updateUser = await prisma.user.update({
          where: {
            email: session.user.email,
          },
          data: {
            name: personData.name.value,
            nickname: personData.name.value,
            dob: personData.dob.value,
          },
        })
        res.redirect(`/nickname?name=${title(personData.name.value)}`)
      })
      .catch(async error => {
        res.status(500).send({
          error: error,
        })
      })
  } catch (error) {
    res.status(500).send({
      error: error,
    })
  }
}
