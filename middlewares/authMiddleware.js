const jwt = require('jsonwebtoken');
const BaseOutput = require('../outputs/BaseOutput');

const authMiddleware = (req, res, next) => {
    // 1. Support gateway headers injected by Traefik
    const gatewayUserId = req.headers['x-user-id'];
    if (gatewayUserId) {
        req.user = {
            id: parseInt(gatewayUserId, 10),
            email: req.headers['x-user-email'],
            role: req.headers['x-user-role'] || 'user',
            name: req.headers['x-user-name']
        };
        return next();
    }

    // 2. Fall back to direct JWT token verification (for local testing/direct requests)
    let token = null;
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json(BaseOutput.error(null, 'Unauthorized: No token provided', 401));
    }

    try {
        const publicKey = `-----BEGIN CERTIFICATE-----
MIIE2TCCAsGgAwIBAgIDAeJAMA0GCSqGSIb3DQEBCwUAMCYxDjAMBgNVBAoTBWFk
bWluMRQwEgYDVQQDDAtjZXJ0X3hycXhidzAeFw0yNjA3MDcwNzMxMzBaFw00NjA3
MDcwNzMxMzBaMCYxDjAMBgNVBAoTBWFkbWluMRQwEgYDVQQDDAtjZXJ0X3hycXhi
dzCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBANHDy1nbVddfgejBItmz
DqIY0B2dLNHuGPejuqUqa1F8e3eNdO4Z97mPhuQ14dPsgzBxGkw5COjkKgQniYy1
4EO1E7MiI6UhrBhlFJktp+LMIQM4uk83+xkP+LhTRLKSzsIebiHiX2RcGrkoHTSX
1VcPfDYmkD+spPPeJZOlPay4JrQO4fSrzRS2XIwyRcWWNMSiow83t7V1IiGSUklR
gdlOtcTPX6ocVAorBHPS2Xs+WNK4B6JjIjo08JKkCEWSgCtzh5KL3LMe9ouNxxhk
AlyuUqGL4pcM/U41zUmH6F6Dbc5ZwpGKdC04dGZdChSlrARnr8U8nRDnePjtat+e
5E5MU0uikBglpS7Ly+m6njpYW9ffi2TPQLMcFv5Shs56WeAHwqxHdY4VFMJVlYuC
LZ4NkSpYE2wy6kU0m1t2iuV3WY0WC8t2FbA9wXK3+MtDj9pe9HCtv6dfq7dvslaT
cYwaNaXz7blgJY6BxReCN3dzSXZf/ebj4CyWq0Vc92lgLAl9SWYPHjenhBJfAiwi
LrjmrPiDPnLI7XHI2rLPYkmSro2ImGTgngdHI7MHCw6eHISQBh6YsPjzmysIf/bp
K/TVRLSSP0BH4YcDtCBWN3TBHUfk20WHKgYGopyWnT35yzVHsuoHQKkwzeukfCQi
TbSziy2ocAjMAMSHWhlGqaIvAgMBAAGjEDAOMAwGA1UdEwEB/wQCMAAwDQYJKoZI
hvcNAQELBQADggIBAKhXM5rIXwFjPx1PcNf6f+LNXhWzUh4gpk3dfq7fLrpXLbed
KdkCEkd3oj+cSHAMdxNQj5otXFwh+DVZnYsBPk3NEy67dhuB5GoS3Fi5eHoiWFas
+Oq7VME5HQHt10BdIhR9lr2BRpMYRZCxoEvYLA/PXDSV0dbfkdrTC9PmbHkJpxb8
1SbFhVLtHaAtnjTdlFq+nPyCS7XUBYiHtlsb4A4M3rwOl1HIBEvgodzR15jsdE3O
YYcLStYTNW3/4XtfdhEXd+pfnAWTkyWpaXygoE4juQEIsKuz4GxQPqVTadUpDxBH
KmEk2UuinhYIystQV2uJfZjB94uksZ0G7LYa7olkjw6wUohZy27pRUTXUUV7Gtdp
AXq7ZgIdUhtr20EnZWcZUOBvDcwfz0AlV9wSsfoyMhvJ32JEw03uZzQ2whVK8qL1
6ALr5TrCOibKfsnb9U4nbxbHJhty8VNKwuCINsIzBIRrJaDN1GEA8WG9vcHUyEt4
aFCDJvl5uzLEiercWvZa2cy4mcr+0YrUJKW4ayBWjREj6+3+UxUIyUSYVgSwRUg6
FNM6B+Ja/gWj/G8V4lIXFTfJtdtwa6nMld4tjKQwO8s5Q2V8Rs7XFkThrmP4DtrK
qXtlBM/Rur6uYyhXylnRBufWQmKkPxL2+MyqpCOD0jKwHPJ5rA0t+AHvpuF1
-----END CERTIFICATE-----`;

        if (publicKey) {
            let formattedPublicKey = publicKey.replace(/\\n/g, '\n');
            if (!formattedPublicKey.includes('-----BEGIN')) {
                formattedPublicKey = `-----BEGIN CERTIFICATE-----\n${formattedPublicKey}\n-----END CERTIFICATE-----`;
            }

            let decoded;
            try {
                decoded = jwt.verify(token, formattedPublicKey, { algorithms: ['RS256'] });
            } catch (err) {
                decoded = jwt.verify(token, 'rizurin_super_secret_jwt_key_for_user_service');
            }

            req.user = {
                id: decoded.id || decoded.name,
                email: decoded.email || decoded.emailAddress,
                role: decoded.role || 'user',
                name: decoded.displayName || decoded.name
            };
        } else {
            const decoded = jwt.verify(token, 'rizurin_super_secret_jwt_key_for_user_service');
            req.user = decoded;
        }
        next();
    } catch (err) {
        return res.status(401).json(BaseOutput.error(null, 'Unauthorized: Invalid or expired token', 401));
    }
};

module.exports = authMiddleware;
