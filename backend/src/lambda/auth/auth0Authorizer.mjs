import jsonwebtoken, {decode} from 'jsonwebtoken'
import {JwksClient} from 'jwks-rsa'
import {createLogger} from "../../utils/logger.mjs";
const logger = createLogger('auth')
const client = new JwksClient({
    jwksUri: process.env.JWKS_URL,
    timeout: 30000,
    cache: true
})

export async function handler(event) {
    try {
        const jwtToken = verifyToken(event.authorizationToken)
        logger.info('User was authorized', jwtToken)

        return {
            principalId: 'user',
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
        logger.info('User was not authorized', e.message)

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

async function verifyToken(authHeader) {
    if (!authHeader) throw new Error('No authorization header')

    if (!authHeader.toLowerCase().startsWith('bearer '))
        throw new Error('Invalid authorization header')

    const split = authHeader.split(' ')

    const token = split[1]
    let jwtToken = decode(token, {complete: true});

    let cert = await getCertificate(jwtToken.header.kid);
    logger.info(`Cert received ${cert}`)
    let verified = jsonwebtoken.verify(token, cert, {algorithms: ['RS256']});
    logger.info(`Results of verification ${verified}`)
    return verified
}

async function getCertificate(signingKey) {
    const key = await client.getSigningKey(signingKey)
    return certToPEM(key.getPublicKey());

}

//https://community.auth0.com/t/what-are-the-tradeoffs-between-verifying-jwt-using-public-key-versus-rsa-mod-and-exponentb64/8614
export function certToPEM(cert) {
    cert = cert.match(/.{1,64}/g).join('\n');

    cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
    return cert;
}