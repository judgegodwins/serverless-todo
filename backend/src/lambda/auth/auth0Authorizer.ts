import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'
import { getToken } from '../../auth/utils'

const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJZuIz1zzDrtZeMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1vZXZ4YTNxYi51cy5hdXRoMC5jb20wHhcNMjAwNzI5MTY1NzEzWhcN
MzQwNDA3MTY1NzEzWjAkMSIwIAYDVQQDExlkZXYtb2V2eGEzcWIudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2xwPJsBsO9Iq96l2
I9RiRJyCTBkSfPaszUyAmlulkcqzbKL1W71DKrJIwBHU2wR2L+ei/iDfXcGtSIMw
IqLY7M1Pv+gc05KTATVWl2Pp0uFmHXJ0B7pqQIvNFFs07xvdhQD84736AlCgs6KG
aafdqw0nJpIkGmuLdwiyQJDwvW8Q756mLIbA8ky4Ho9SjOKJU7iLF0BncgQ0H70n
5L8dpATznoP6V2j9rXi/BhyzWs3FsEiBFbkaeosWl+sA9xjkOl9PAdLEOmV/cVPJ
/oDZbMrRXY4Esx7EXwcgMJmQMIT0n9trwZJLEv3OLGvDcwIgNwos9rdacSKDv+Dm
BNtCNwIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBSoNEc56jFD
fav3tvUaUjp2a0UJ/jAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
ACeZ1yNTix57z2BF1Iw5KvvFlq+cSRcwEuTqLe00Z5anu9bza6SaI9ohnPY61n+Z
k2feuoBF+B9vjJRh6JFi6IDfmRGJBbMc+020zqDYQOh25TTVrFdNn026KRcU3XjM
gfg04enSa3v5OBylccJrQHjpNmz1zIg+afDUUOmmBJFtdeRkKDPn73EiKaFV6Iqr
Iu68ktSwYPVihsorzUSKGst/2vSBT6B7q5Uf7BJepmEJPEs/Rnaygb0NixqgpYcE
iAsFrYH+WsGe00hj+3102POgYBdz+1CIQkqDMY2fr8cqSImc8AVzQqqbYp7Q7WQF
qE435cImEPp+cb/44LTXYIA=
-----END CERTIFICATE-----`

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  // const jwt: Jwt = decode(token, { complete: true }) as Jwt

  // TODO: Implement token verification
  // You should implement it similarly to how it was implemented for the exercise for the lesson 5
  // You can read more about how to do this here: https://auth0.com/blog/navigating-rs256-and-jwks/
  return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload
}