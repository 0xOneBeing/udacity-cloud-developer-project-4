// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '638ec0cabf8e07fd9e023ca7'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-csd2kjw0eenlxvdn.us.auth0.com', // Auth0 domain
  clientId: 'aWgcNP2LtAPI54tSXgo2vl5JdeZAMRV6', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
